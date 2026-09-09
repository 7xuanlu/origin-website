# Welcome email

`buildWelcomeEmail()` returns `subject`, `html`, `text`, and `attachments` for
`resend.emails.send`. Always pass the attachments as well as the HTML: the logo
uses an embedded CID, not an externally hosted URL. The REST API equivalent
uses `content_id` instead of the SDK's `contentId`.

The default light palette uses the Wenlan App's `#FCFCFB` background,
`#1A1A2E` text, and `#5E58C8` accent. `{ theme: "dark" }` selects the App's
`#11131A` / `#171A23` surfaces and `#8FB3EA` accent. This is explicit sender-side
selection, not a guarantee about mail clients' own automatic dark-mode changes.
Source: `7xuanlu/wenlan`, `src/index.css`, inspected 2026-09-08.

`wenlan-logo.png` is an unmodified copy of the App's
`app/icons/128x128@2x.png` (256 × 256), displayed at 48 × 48. Its SHA-256 is
guarded by the template test. No generated or substitute logo is used.

The optional `locale` is `en`, `zh-TW` (default), or `zh-CN`. Preview with
`{ includeTestFooter: true }`; production mail omits the test footer.

## Enable safely

1. Apply `supabase/migrations/20260909000000_welcome_delivery.sql` to the existing
   dedicated Supabase project. It is additive; it does not change analytics data.
2. Verify the sending domain `mail.wenlan.app` in Resend. Configure the existing
   Resend and server-only Supabase credentials, `WELCOME_EMAIL_REPLY_TO`, and a
   random 32-byte-or-longer hex `SUBSCRIPTION_SIGNING_SECRET` in the deployment.
3. Deploy the subscription code and `/email/unsubscribe` route. Set
   `WELCOME_EMAIL_STARTED_AT` to the actual UTC activation time and then enable
   `WELCOME_EMAIL_ENABLED=1`. Never backdate the cutoff to mail an existing list.
4. Exercise one authorized new subscription and verify provider delivery and the
   confirmation/one-click unsubscribe paths. Configuration alone is not proof.

Only a successfully saved, globally subscribed contact created after the cutoff
is eligible. Failure to send a welcome does not turn a saved subscription into a
failed signup. No existing-subscriber backfill or bulk campaign is implemented.
Welcome delivery runs in Next.js `after()`, after the subscription response;
it remains bounded by the platform function lifetime, not a durable job queue.

## Delivery guarantees and operations

The database allows one durable **attempt**, not guaranteed delivery, per
audience/contact pair. It stores provider UUIDs and state, not email addresses.
Claims are capped at 10 per minute and 50 per UTC day. Resend's idempotency key
adds protection, but the database remains the deduplication authority after the
provider's 24-hour idempotency window expires.

Run `pnpm email:status --live` with server credentials to see aggregate `claimed`,
`sent`, `failed`, and `suppressed` counts. `sent` means provider acceptance, not
inbox delivery. Use Resend delivery/bounce observations separately. Local
suppression does not erase the delivery receipt. The `suppressed` count overlaps
delivery states and must not be added to them as a total. A timeout or
uncertain response is never blindly retried: reconcile `claimed`/`failed` rows
against provider logs before any separately authorized manual action. There is
no background retry worker or new scheduler.

## Unsubscribe and rollback

The signed link contains opaque contact/audience IDs, never an email address.
GET only displays confirmation: a link preview/scanner cannot unsubscribe by
opening it. Confirmation POST and RFC 8058 one-click POST first save local
suppression and then set the global Resend contact to unsubscribed. Provider
failure displays a retry state; it never claims a completed unsubscribe.
Already-in-flight mail may still arrive. The route has no analytics or external
resources and is noindex, no-store, and no-referrer.

Keep the signing secret and audience configuration stable: links intentionally
do not expire. Replacing either invalidates existing links and requires an
explicit backwards-compatible key/audience migration. To pause welcome sending,
set `WELCOME_EMAIL_ENABLED=0`; keep the unsubscribe route, credentials, secret,
and suppression records available. Never delete the ledger to retry mail.

Run `pnpm test:email`; these tests also run in `pnpm test:measurement`.
An optional disposable Postgres-engine test can be run with
`PGLITE_MODULE=/absolute/path/to/@electric-sql/pglite/dist/index.js node scripts/welcome-sql.integration.mjs`.
It checks SQL permissions, deduplication and budgets without a production write;
PGlite is not a new site dependency or a production concurrency stress test.
