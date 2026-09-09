import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { Resend } from 'resend';
import { type Locale, isSupportedLocale } from '@/i18n/locales';
import { getSiteEventsConfig } from '@/lib/site-events-store';
import { buildWelcomeEmail } from './welcome';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const SUBSCRIPTION_ORIGIN = 'https://wenlan.app';
export const WELCOME_FROM = 'Wenlan 文瀾 <hello@mail.wenlan.app>';

function signingKey(env: NodeJS.ProcessEnv): string {
  const key = env.SUBSCRIPTION_SIGNING_SECRET ?? '';
  if (!/^[0-9a-f]{64,128}$/.test(key)) throw new Error('Subscription signing is not configured');
  return key;
}

/** A stable, non-expiring unsubscribe capability. No address in URLs or logs. */
export function createUnsubscribeToken(contact: string, locale: Locale, env = process.env): string {
  const audience = env.RESEND_AUDIENCE_ID ?? '';
  if (!UUID.test(contact) || !UUID.test(audience) || !isSupportedLocale(locale)) throw new Error('Invalid contact');
  const data = `v1.${audience}.${contact}.${locale}`;
  return `${data}.${createHmac('sha256', signingKey(env)).update(data).digest('hex')}`;
}

export function verifyUnsubscribeToken(token: string, env = process.env): { contact: string; locale: Locale } | null {
  try {
    if (token.length > 200) return null;
    const [version, audience, contact, locale, signature, extra] = token.split('.');
    if (extra !== undefined || version !== 'v1' || audience !== env.RESEND_AUDIENCE_ID || !UUID.test(audience) || !UUID.test(contact) || !isSupportedLocale(locale) || !/^[a-f0-9]{64}$/.test(signature)) return null;
    const expected = createUnsubscribeToken(contact, locale, env).split('.').at(-1)!;
    return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex')) ? { contact, locale } : null;
  } catch { return null; }
}

export async function subscriptionRpc(name: string, body: Record<string, unknown>, env = process.env, fetchImpl: typeof fetch = fetch): Promise<unknown> {
  const config = getSiteEventsConfig({ ...env, SITE_EVENTS_ENABLED: '1' });
  if (!config.available) throw new Error('Subscription storage unavailable');
  const headers: Record<string,string> = { apikey: config.token, 'content-type': 'application/json' };
  if (config.auth === 'legacy-jwt') headers.authorization = `Bearer ${config.token}`;
  const response = await fetchImpl(`${config.url.replace(/\/$/,'')}/rest/v1/rpc/${name}`, {
    method:'POST', headers, body:JSON.stringify(body), redirect:'error', signal:AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error('Subscription storage request failed');
  return response.json();
}

type Rpc = (name: string, body: Record<string, unknown>) => Promise<unknown>;
export type WelcomeOutcome = 'disabled' | 'skipped' | 'duplicate' | 'capped' | 'sent' | 'failed';

/** One durable attempt per provider contact; ambiguous outcomes are never automatically retried. */
export async function sendNewSubscriberWelcome(contactId: string, locale: Locale, options: {
  env?: NodeJS.ProcessEnv; resend?: Resend; rpc?: Rpc;
} = {}): Promise<WelcomeOutcome> {
  const env = options.env ?? process.env;
  if (env.WELCOME_EMAIL_ENABLED !== '1') return 'disabled';
  const rpc = options.rpc ?? ((name, body) => subscriptionRpc(name, body, env));
  const resend = options.resend ?? new Resend(env.RESEND_API_KEY);
  const audience = env.RESEND_AUDIENCE_ID ?? '';
  const startedAt = Date.parse(env.WELCOME_EMAIL_STARTED_AT ?? '');
  const replyTo = env.WELCOME_EMAIL_REPLY_TO ?? '';
  if (!UUID.test(contactId) || !UUID.test(audience) || !Number.isFinite(startedAt) || replyTo.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(replyTo) || /[\u0000-\u001f\u007f]/.test(replyTo)) return 'failed';
  const attempt = randomUUID();
  let claimed = false;
  try {
    const token = createUnsubscribeToken(contactId, locale, env);
    // Check global consent as well as audience membership; never override an opt-out.
    const contact = await resend.contacts.get({ id: contactId });
    if (contact.error || !contact.data || contact.data.id !== contactId) return 'failed';
    const created = Date.parse(contact.data.created_at);
    if (contact.data.unsubscribed !== false || !Number.isFinite(created) || created < startedAt) return 'skipped';
    const unsubscribeUrl = `${SUBSCRIPTION_ORIGIN}/email/unsubscribe?token=${encodeURIComponent(token)}`;
    const template = buildWelcomeEmail({ locale, unsubscribeUrl });
    const claim = await rpc('claim_welcome_v1', { p_audience: audience, p_contact: contactId, p_attempt: attempt });
    if (claim === 'duplicate' || claim === 'capped') return claim;
    if (claim !== 'claimed') return 'failed';
    claimed = true;
    // A concurrent unsubscribe may suppress the claim before the network send.
    if (await rpc('welcome_allowed_v1', { p_audience: audience, p_contact: contactId, p_attempt: attempt }) !== true) return 'skipped';
    const latest = await resend.contacts.get({ id: contactId });
    if (latest.error || !latest.data || latest.data.unsubscribed !== false) throw new Error('Consent unavailable');
    const result = await resend.emails.send({
      from: WELCOME_FROM, to: [latest.data.email], replyTo,
      ...template,
      headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
    }, { idempotencyKey: `welcome-v1/${audience}/${contactId}` });
    if (result.error || !result.data?.id) throw new Error('Send not confirmed');
    const recorded = await rpc('finish_welcome_v1', { p_audience: audience, p_contact: contactId, p_attempt: attempt, p_state: 'sent', p_provider: result.data.id });
    if (recorded !== true) console.error('Welcome delivery receipt needs reconciliation');
    return 'sent';
  } catch {
    if (claimed) {
      try { await rpc('finish_welcome_v1', { p_audience: audience, p_contact: contactId, p_attempt: attempt, p_state: 'failed', p_provider: null }); } catch { /* claim remains durable; never blind-retry */ }
    }
    console.error('Welcome delivery needs reconciliation');
    return 'failed';
  }
}

export async function unsubscribeContact(contact: string, options: {env?: NodeJS.ProcessEnv; resend?: Resend; rpc?: Rpc} = {}): Promise<boolean> {
  const env = options.env ?? process.env;
  if (!UUID.test(contact) || !UUID.test(env.RESEND_AUDIENCE_ID ?? '') || !env.RESEND_API_KEY) return false;
  try {
    const rpc = options.rpc ?? ((name, body) => subscriptionRpc(name, body, env));
    if (await rpc('suppress_welcome_v1', { p_audience: env.RESEND_AUDIENCE_ID, p_contact: contact }) !== true) return false;
    const resend = options.resend ?? new Resend(env.RESEND_API_KEY);
    const result = await resend.contacts.update({ id: contact, unsubscribed: true });
    // A deleted contact is already absent; all other failures remain retryable.
    return result.error?.statusCode === 404 || (!result.error && result.data?.id === contact);
  } catch { return false; }
}
