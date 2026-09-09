#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteEventsConfig } from "../src/lib/site-events-store.ts";

const RESEND_API = "https://api.resend.com";
const REQUEST_TIMEOUT_MS = 4000;
const PAGE_SIZE = 100;
const MAX_PAGES = 1;
const DOMAIN_STATUSES = new Set([
  "not_started",
  "pending",
  "verified",
  "failed",
  "temporary_failure",
  "disabled",
]);
const REQUIRED_ACQUISITION_PROPERTIES = Object.freeze([
  "signup_locale",
  "signup_landing_path",
  "signup_referrer_host",
  "signup_utm_source",
  "signup_utm_medium",
  "signup_utm_campaign",
]);

const LIMITATIONS = Object.freeze([
  "A readable Resend contact list is not an email delivery, open, click, or new-contact count.",
  "Contact probes expose only readability and whether the bounded page has any rows; addresses and raw rows are omitted.",
  "Provider availability is not proof of deployed configuration, consent, collection, attribution, or delivery.",
  "This preflight does not assess deployment readiness; the client flag is reported as build-time configuration only.",
  "The site-events ping field is a compatibility name for a read-only Postgres schema-health RPC; it does not write events or prove collection health.",
  "Missing process credentials do not imply missing Vercel Sensitive variables; those values may be withheld from local reads.",
]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function check({
  status,
  configured = false,
  available = null,
  exercised = false,
  successful = null,
  reason,
}) {
  return {
    status,
    configured,
    available,
    exercised,
    successful,
    unchecked: status === "unchecked",
    ...(reason ? { reason } : {}),
  };
}

function generatedAt(now) {
  const value = typeof now === "function" ? now() : now;
  const date = value instanceof Date ? value : new Date(value ?? Date.now());
  return Number.isNaN(date.valueOf()) ? new Date().toISOString() : date.toISOString();
}

function credentialPart(value) {
  if (typeof value !== "string" || value.length === 0) return "missing";
  if (value.trim() !== value) return "invalid";
  return "configured";
}

function isLegacySupabaseJwt(value) {
  return typeof value === "string" && /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(value);
}

function makeResendConfiguration(env) {
  const apiKeyState = credentialPart(env.RESEND_API_KEY);
  const audienceState = credentialPart(env.RESEND_AUDIENCE_ID);
  const configured = apiKeyState === "configured" && audienceState === "configured";
  const invalid = apiKeyState === "invalid" || audienceState === "invalid";
  return {
    ...check({
      status: configured ? "configured" : "unchecked",
      configured,
      reason: configured ? undefined : invalid ? "invalid_config" : "missing_credentials",
    }),
    apiKeyConfigured: apiKeyState === "configured",
    audienceConfigured: audienceState === "configured",
  };
}

function makeAcquisitionConfiguration(env) {
  const enabled = env.RESEND_ACQUISITION_PROPERTIES_ENABLED === "1";
  return {
    ...check({
      status: enabled ? "configured" : "disabled",
      configured: enabled,
      reason: enabled ? undefined : "disabled",
    }),
    enabled,
    required: [...REQUIRED_ACQUISITION_PROPERTIES],
  };
}

function responseIsOk(response) {
  if (!response || response.ok === false) return false;
  if (response.ok === true) return true;
  return Number.isInteger(response.status) && response.status >= 200 && response.status < 300;
}

function safeHttpStatus(response) {
  const status = Number(response?.status);
  return Number.isInteger(status) && status >= 100 && status <= 599 ? status : null;
}

async function requestJson({
  fetchImpl,
  url,
  token,
  apiKey,
  authorizationToken = token,
  method = "GET",
  body,
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const headers = {};
  if (apiKey) headers.apikey = apiKey;
  if (authorizationToken) headers.authorization = `Bearer ${authorizationToken}`;
  if (body !== undefined) headers["content-type"] = "application/json";
  try {
    let response;
    try {
      response = await fetchImpl(url, {
        method,
        headers,
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        redirect: "error",
        signal: controller.signal,
      });
    } catch {
      return { kind: "failed" };
    }
    const httpStatus = safeHttpStatus(response);
    if (!responseIsOk(response)) return { kind: "failed", httpStatus };
    if (typeof response.json !== "function") return { kind: "malformed", httpStatus };
    try {
      return { kind: "response", payload: await response.json(), httpStatus };
    } catch {
      return { kind: "malformed", httpStatus };
    }
  } finally {
    clearTimeout(timeout);
  }
}

function extractPage(payload) {
  if (!isRecord(payload)) return null;
  const nested = isRecord(payload.data) ? payload.data : null;
  const rows = Array.isArray(payload.data)
    ? payload.data
    : nested && Array.isArray(nested.data)
      ? nested.data
      : null;
  const hasMore = typeof payload.has_more === "boolean"
    ? payload.has_more
    : nested && typeof nested.has_more === "boolean"
      ? nested.has_more
      : null;
  if (!rows || hasMore === null) return null;
  return { rows, hasMore };
}

function pageUrl(base, cursor, limit) {
  const url = new URL(base);
  url.searchParams.set("limit", String(limit));
  if (cursor) url.searchParams.set("after", cursor);
  return url.toString();
}

async function probeCollection({ fetchImpl, baseUrl, token, kind, limit }) {
  const result = {
    rows: [],
    has_more: null,
    incomplete: false,
    pages: 0,
    request: null,
    httpStatus: null,
  };
  let cursor;
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const url = pageUrl(baseUrl, cursor, limit);
    const response = await requestJson({ fetchImpl, url, token });
    result.pages += 1;
    result.request = response.kind;
    result.httpStatus = response.httpStatus ?? null;
    if (response.kind === "failed") {
      return { ...result, status: "failed", available: false, reason: "request_failed" };
    }
    if (response.kind === "malformed") {
      return { ...result, status: "unchecked", available: true, reason: "unexpected_response" };
    }
    const parsed = extractPage(response.payload);
    if (!parsed) {
      return { ...result, status: "unchecked", available: true, reason: "unexpected_response" };
    }
    const validRows = parsed.rows.every((row) => {
      if (!isRecord(row)) return false;
      if (kind !== "contacts") return true;
      return typeof row.id === "string" && row.id.length > 0
        && typeof row.email === "string" && row.email.length > 0;
    });
    if (!validRows) {
      return { ...result, status: "unchecked", available: true, reason: "unexpected_response" };
    }
    result.rows.push(...parsed.rows);
    result.has_more = parsed.hasMore;
    if (!parsed.hasMore) break;

    // Keep the probe intentionally bounded. We do not claim that a first page
    // is exhaustive when the provider says more rows exist.
    if (page + 1 >= MAX_PAGES) {
      result.incomplete = true;
      break;
    }
    const last = parsed.rows.at(-1);
    if (!isRecord(last) || typeof last.id !== "string" || last.id.length === 0) {
      result.incomplete = true;
      break;
    }
    if (last.id === cursor) {
      result.incomplete = true;
      break;
    }
    cursor = last.id;
  }

  result.status = result.incomplete ? "available" : "successful";
  result.available = true;
  return result;
}

function endpointFromResult(result, configured) {
  if (!configured) {
    return check({ status: "unchecked", reason: "not_configured" });
  }
  if (result.status === "failed") {
    const value = check({
        status: "failed",
        configured: true,
        available: false,
        exercised: true,
        successful: false,
        reason: result.reason,
    });
    return result.httpStatus === null ? value : { ...value, httpStatus: result.httpStatus };
  }
  if (result.status === "unchecked") {
    return check({
      status: "unchecked",
      configured: true,
      available: result.available,
      exercised: true,
      successful: false,
      reason: result.reason,
    });
  }
  const incomplete = result.incomplete === true;
  return check({
    status: incomplete ? "available" : "successful",
    configured: true,
    available: true,
    exercised: true,
    successful: !incomplete,
    reason: incomplete ? "bounded_pagination" : undefined,
  });
}

function domainEvidence(result, configured) {
  const base = endpointFromResult(result, configured);
  if (!configured || result.status === "failed" || result.status === "unchecked") {
    return {
      ...base,
      statuses: [],
      hasAny: null,
      has_more: result.has_more,
      incomplete: result.incomplete,
    };
  }
  const statuses = [];
  for (const row of result.rows) {
    if (typeof row.status !== "string" || !DOMAIN_STATUSES.has(row.status)) {
      return {
        ...check({
          status: "unchecked",
          configured: true,
          available: true,
          exercised: true,
          successful: false,
          reason: "unexpected_response",
        }),
        statuses: [],
        hasAny: null,
        has_more: result.has_more,
        incomplete: result.incomplete,
      };
    }
    statuses.push(row.status);
  }
  return {
    ...base,
    statuses,
    hasAny: statuses.length > 0,
    has_more: result.has_more,
    incomplete: result.incomplete,
  };
}

function propertyEvidence(result, configured) {
  const base = endpointFromResult(result, configured);
  if (!configured || result.status === "failed" || result.status === "unchecked") {
    return {
      ...base,
      required: [...REQUIRED_ACQUISITION_PROPERTIES],
      present: null,
      missing: null,
      has_more: result.has_more,
      incomplete: result.incomplete,
    };
  }
  const required = new Set(REQUIRED_ACQUISITION_PROPERTIES);
  const present = new Set();
  for (const row of result.rows) {
    if (typeof row.key !== "string" || row.key.length === 0 || row.key.length > 128) {
      return {
        ...check({
          status: "unchecked",
          configured: true,
          available: true,
          exercised: true,
          successful: false,
          reason: "unexpected_response",
        }),
        required: [...REQUIRED_ACQUISITION_PROPERTIES],
        present: null,
        missing: null,
        has_more: result.has_more,
        incomplete: result.incomplete,
      };
    }
    if (required.has(row.key)) present.add(row.key);
  }
  const presentList = REQUIRED_ACQUISITION_PROPERTIES.filter((key) => present.has(key));
  return {
    ...base,
    required: [...REQUIRED_ACQUISITION_PROPERTIES],
    present: presentList,
    missing: result.incomplete
      ? null
      : REQUIRED_ACQUISITION_PROPERTIES.filter((key) => !present.has(key)),
    has_more: result.has_more,
    incomplete: result.incomplete,
  };
}

function contactsEvidence(result, configured) {
  const base = endpointFromResult(result, configured);
  if (!configured || result.status === "failed" || result.status === "unchecked") {
    return {
      ...base,
      readable: false,
      hasAny: null,
      has_more: result.has_more,
      incomplete: result.incomplete,
    };
  }
  return {
    ...base,
    readable: true,
    hasAny: result.rows.length > 0,
    has_more: result.has_more,
    incomplete: result.incomplete,
  };
}

// Keep the external `ping` property for report compatibility. The probe is a
// read-only Postgres schema-health RPC, not a storage PING command.
async function checkSiteEventsHealth({ fetchImpl, config }) {
  if (!config.available) {
    return check({
      status: config.reason === "disabled" ? "disabled" : "unchecked",
      reason: config.reason,
    });
  }
  const result = await requestJson({
    fetchImpl,
    url: `${config.url}/rest/v1/rpc/site_events_health_v1`,
    apiKey: config.token,
    authorizationToken: isLegacySupabaseJwt(config.token) ? config.token : null,
    method: "POST",
    body: {},
  });
  if (result.kind === "failed") {
    const value = check({
      status: "failed",
      configured: true,
      available: false,
      exercised: true,
      successful: false,
      reason: "request_failed",
    });
    return result.httpStatus === null ? value : { ...value, httpStatus: result.httpStatus };
  }
  if (result.kind === "malformed" || !isRecord(result.payload)) {
    return check({
      status: "unchecked",
      configured: true,
      available: true,
      exercised: true,
      successful: false,
      reason: "unexpected_response",
    });
  }
  if (
    result.payload.schemaVersion !== 1
    || result.payload.storage !== "postgres"
    || result.payload.ready !== true
    || Object.hasOwn(result.payload, "error")
  ) {
    return check({
      status: "unchecked",
      configured: true,
      available: true,
      exercised: true,
      successful: false,
      reason: "unexpected_response",
    });
  }
  return check({
    status: "successful",
    configured: true,
    available: true,
    exercised: true,
    successful: true,
  });
}

function summaryStatus({ live, resend, siteEvents }) {
  if (!live) {
    const configs = [resend.configuration, siteEvents.configuration];
    if (configs.some((item) => item.status === "unchecked")) return "unchecked";
    if (configs.every((item) => item.status === "disabled")) return "disabled";
    return "configured";
  }
  const checks = [
    resend.domains,
    resend.contactProperties,
    resend.contacts,
    siteEvents.ping,
  ];
  if (checks.some((item) => item.status === "failed")) return "failed";
  if (checks.some((item) => item.status === "unchecked")) return "unchecked";
  if (checks.some((item) => item.status === "disabled")) return "unchecked";
  if (checks.some((item) => item.status === "available")) return "available";
  return "successful";
}

export async function runMeasurementPreflight({
  env = process.env,
  fetchImpl = fetch,
  now = () => new Date(),
  live = false,
} = {}) {
  const generated = generatedAt(now);
  const resendConfiguration = makeResendConfiguration(env);
  const acquisitionConfiguration = makeAcquisitionConfiguration(env);
  const siteEventsConfiguration = getSiteEventsConfig(env);
  const resendConfigured = resendConfiguration.configured;
  const liveMode = live === true;

  let domains = {
    ...check({
      status: "unchecked",
      configured: resendConfigured,
      reason: !resendConfigured ? "not_configured" : liveMode ? "not_probed" : "offline",
    }),
    statuses: [],
    hasAny: null,
    has_more: null,
    incomplete: false,
  };
  let contactProperties = {
    ...check({
      status: "unchecked",
      configured: resendConfigured,
      reason: !resendConfigured ? "not_configured" : liveMode ? "not_probed" : "offline",
    }),
    required: [...REQUIRED_ACQUISITION_PROPERTIES],
    present: null,
    missing: null,
    has_more: null,
    incomplete: false,
  };
  let contacts = {
    ...check({
      status: "unchecked",
      configured: resendConfigured,
      reason: !resendConfigured ? "not_configured" : liveMode ? "not_probed" : "offline",
    }),
    readable: false,
    hasAny: null,
    has_more: null,
    incomplete: false,
  };
  let ping = check({
    status: siteEventsConfiguration.available ? "unchecked" : siteEventsConfiguration.reason === "disabled" ? "disabled" : "unchecked",
    configured: siteEventsConfiguration.available,
    reason: siteEventsConfiguration.available ? (liveMode ? "not_probed" : "offline") : siteEventsConfiguration.reason,
  });

  if (liveMode && resendConfigured) {
    const apiKey = env.RESEND_API_KEY;
    const audienceId = env.RESEND_AUDIENCE_ID;
    const domainResult = await probeCollection({
      fetchImpl,
      baseUrl: `${RESEND_API}/domains`,
      token: apiKey,
      kind: "domains",
      limit: PAGE_SIZE,
    });
    const propertyResult = await probeCollection({
      fetchImpl,
      baseUrl: `${RESEND_API}/contact-properties`,
      token: apiKey,
      kind: "contact-properties",
      limit: PAGE_SIZE,
    });
    const contactsResult = await probeCollection({
      fetchImpl,
      baseUrl: `${RESEND_API}/audiences/${encodeURIComponent(audienceId)}/contacts`,
      token: apiKey,
      kind: "contacts",
      limit: 1,
    });
    domains = domainEvidence(domainResult, true);
    contactProperties = propertyEvidence(propertyResult, true);
    contacts = contactsEvidence(contactsResult, true);
  }

  if (liveMode) ping = await checkSiteEventsHealth({ fetchImpl, config: siteEventsConfiguration });

  const resend = {
    configuration: resendConfiguration,
    acquisitionProperties: acquisitionConfiguration,
    domains,
    contactProperties,
    contacts,
  };
  const clientEnabled = env.NEXT_PUBLIC_SITE_EVENTS_ENABLED === "1";
  const siteEvents = {
    configuration: siteEventsConfiguration.available
      ? check({ status: "configured", configured: true })
      : check({
        status: siteEventsConfiguration.reason === "disabled" ? "disabled" : "unchecked",
        reason: siteEventsConfiguration.reason,
      }),
    ping,
    clientConfiguration: {
      ...check({
        status: clientEnabled ? "configured" : "disabled",
        configured: clientEnabled,
        reason: clientEnabled ? undefined : "disabled",
      }),
      enabled: clientEnabled,
      scope: "build_time_only",
      deployed: null,
    },
  };
  const status = summaryStatus({ live: liveMode, resend, siteEvents });
  return {
    schemaVersion: 1,
    generatedAt: generated,
    configurationSource: "process_environment",
    mode: liveMode ? "live" : "offline",
    status,
    summary: {
      status,
      readiness: "not_assessed",
    },
    resend,
    siteEvents,
    limitations: [...LIMITATIONS],
  };
}

export function parseArgs(argv) {
  const args = {};
  const known = new Set(["live", "output"]);
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--") continue;
    if (typeof token !== "string" || !token.startsWith("--")) throw new Error("unknown argument");
    const key = token.slice(2);
    if (!known.has(key) || Object.hasOwn(args, key)) throw new Error("unknown argument");
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error("missing argument value");
    if (key === "live") {
      if (value !== "true" && value !== "false") throw new Error("live must be true or false");
      args.live = value === "true";
    } else {
      args.output = value;
    }
    index += 1;
  }
  return { live: false, ...args };
}

export async function main(
  argv = process.argv.slice(2),
  env = process.env,
  fetchImpl = fetch,
  now = () => new Date(),
) {
  const args = parseArgs(argv);
  const evidence = await runMeasurementPreflight({
    env,
    fetchImpl,
    now,
    live: args.live,
  });
  const serialized = `${JSON.stringify(evidence, null, 2)}\n`;
  if (args.output) {
    const output = resolve(args.output);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, serialized, "utf8");
    process.stdout.write(`${JSON.stringify({ status: evidence.status, output })}\n`);
  } else {
    process.stdout.write(serialized);
  }
  return evidence;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(() => {
    // Keep malformed arguments and implementation failures generic; provider
    // bodies, credentials and addresses must never reach CLI output.
    process.stderr.write("measurement preflight failed\n");
    process.exitCode = 1;
  });
}
