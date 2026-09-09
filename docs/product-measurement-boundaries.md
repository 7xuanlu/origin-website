# Website and product measurement boundaries

## Current implementation versus production

Website v1 uses a first-party aggregate collector, with a separate Resend
subscription ledger. See [first-party measurement](first-party-measurement.md)
for operational reads and operator exclusion. No App events are currently
accepted by the website event registry. Do not repurpose it silently.

The App contract below is locally implemented on `7xuanlu/wenlan` base
`b47fd45241d0d46c02e931dad0bd5dbfaf0a2e35`, version 0.18.4, with an independent
`/api/app-events` receiver in this repository. **Neither an App release nor
production App collection is established by local implementation.** The older
standalone `wenlan-app` checkout is not the current authority.

## Questions worth measuring

| Question | Measurement | What it does not establish |
| --- | --- | --- |
| Was the download link used? | Website asset-link operations | Completed downloads or installs |
| Was the asset downloaded? | GitHub asset download counters | Unique users, website source or first launch |
| Did an opted-in daemon start? | `daemon_ready` | GUI launch, startup failures, people or installs |
| Was a save accepted? | `save_success` | A distinct newly stored memory; accepted duplicate/revision operations may count |
| Did retrieval return a result? | `search_nonempty` / `search_empty` | Relevance, satisfaction or subsequent use |
| Did a measured Wiki operation produce a page? | `wiki_generated` | Correctness, user value or all background generation |
| Did a measured request fail? | `save_error` / `search_error` / `wiki_error` | Crash reports, error text or uninstrumented paths |

Do not join these into a person-level funnel. An opt-in sample also cannot be
assumed representative of all users. No denominator or retention rate can be
derived from anonymous operation totals.

## Implemented minimal App contract

- Default off, including upgrades of existing installations. User-visible
  opt-in, inspectable payload description and a persistent off switch are
  prerequisites. Disabling stops sending and discards unsent counters.
- Record only bounded operation counters after the operation succeeds. Count
  empty searches separately from searches that return results; neither proves
  that the result was useful. No backfill of pre-consent activity.
- No account/device/install/relay ID, email, file path, document or Wiki title,
  query, prompt, response, memory/source/entity ID, model endpoint, arbitrary
  error message, stack trace or content hash. Do not upload existing activity
  logs, onboarding payloads, or the local database.
- Keep at most 1,000 counters in memory and send at most one batch per hour.
  Use plain release version and the coarse macos/windows/linux/other platform.
  Do not send a machine
  fingerprint or an unrestricted map of properties. Even coarse combinations
  can single out people in a very small sample; restrict exposed breakdowns.
- Transport providers necessarily see network metadata such as IP. Do not call
  the entire system unconditionally anonymous. Review Vercel/access-log handling,
  database retention and processors before activation.
- Network failure must never delay saving, retrieving, generating a Wiki or
  quitting. Fixed HTTPS endpoint, four-second timeout, no redirects, retries,
  persistent queue or shutdown flush. Short sessions, exits and failed sends
  can lose counts. This intentionally trades completeness for privacy and low
  overhead; no exact-once delivery claim is made.
- Use a separate versioned App endpoint/schema and storage permissions. Never
  embed a database service key or reuse the Remote Access relay identity.
  A desktop endpoint is publicly forgeable; browser Origin/CORS checks are not
  App authentication. Quotas and abuse controls must be evaluated separately.
- Do not increase the website's event caps to accommodate App traffic. Preserve
  website and App counters, capacities and reporting independently.

## Verified integration risks

In the inspected canonical app, `docs/PRIVACY.md` explicitly says there is no
analytics, crash reporting or diagnostics service. The settings footer in
`src/i18n/resources.ts` also makes an outgoing-data claim. Both must be reconciled
with consent behavior before a telemetry-enabled release, in all supported
languages. Website subscriptions do not grant App telemetry consent.

`crates/wenlan-core/src/onboarding.rs::check_after_ingest` excludes manual
captures and embeds a memory preview. Its first-memory milestone is not an
all-input save counter. `check_after_context_call` likewise carries a preview;
no production caller was found in the inspected checkout. Do not export either
payload or mistake a UI milestone for complete lifecycle instrumentation.

Instrument at one authoritative success boundary per operation (usually the
daemon), not simultaneously in GUI, CLI and MCP. Otherwise one action becomes
multiple counts. Cover GUI-off/headless operation explicitly; do not require
the desktop interface merely to collect CLI/MCP statistics.

## Release acceptance

Before enabling App telemetry, tests must prove: no request before consent;
off switch clears queued work; no content/identifier fields accepted; rejected
unknown fields; exact-once counting at the chosen local success boundary;
bounded nonblocking transport; isolated storage/permissions; and no website
counter contamination. Retry semantics require a separate test from local
operation counting. Validate actual network payloads on each supported platform.

## Receiver and operator boundary

`APP_EVENTS_ENABLED=1` is independent of `SITE_EVENTS_ENABLED`. Existing
server-only Supabase credentials are reused; no key goes into an App binary.
Production build preflight requires the authenticated App schema health RPC
when enabled. Apply `20260909010000_app_events.sql` before enabling it.

The receiver accepts only the eight counters above, `schema_version:1`,
`app_version` and `platform`. It limits JSON to 2 KB and rejects extra fields,
browser Origin requests and noncanonical hosts. These are data minimization
rules, **not proof that a request came from Wenlan**. Anonymous reports can be
forged. Database-enforced per-day limits are 1,000 batches, 100,000 operations
and 20 versions; per-minute limit is 60 batches. Saturation is reported and is
not bot detection or a hosting-cost guarantee.

`scripts/app-events-operations.sql` reads 28 complete UTC days and partial
today, separate from website counters. Day means **receipt day**, not an
individual operation timestamp. Missing rows are unavailable, not measured
zero. No automatic retention expiry or per-person deletion is provided.

## Backup and restore

Use `scripts/measurement-backup-export.sql` before App migration (three tables),
or `scripts/measurement-backup-export-v2.sql` afterwards (four tables), in the
authenticated read-only SQL console. Save the private result outside Git.

```sh
node scripts/measurement-backup.mjs --input /absolute/private/export.json \
  --output-dir /absolute/private/backups --pglite-module /absolute/path/to/pglite/dist/index.js
```

This binds the exported rows and trusted migration bytes by SHA-256, restores
them into an isolated in-memory PostgreSQL engine, compares typed rows and
checks private-table RLS and public-role permissions. It never connects to a
production database or sends mail. Outputs are created with mode 0600.
Supply PGlite as an operator QA dependency, not a production dependency.

On 2026-09-09T05:00:17.650689Z the three deployed application tables were
exported and restored successfully (one row each). Snapshot SHA-256:
`3fa4276ae7d93f9bf22d9461eb7870933913bcd6038bd48bdeefd5009ddaf25b`.
The current website day contained five accepted operations, including known
authorized subscription tests; these are not five visitors or natural usage.
App storage was not yet deployed at that capture.

Coverage excludes Resend contacts, provider settings/secrets and Storage objects.
One off-provider local copy is **not** a verified second-device backup.
Never restore an old welcome ledger into production and enable sending before
reconciling later sends and opt-outs. [Supabase's backup guidance](https://supabase.com/docs/guides/platform/backups)
recommends off-site exports for free-tier projects. No paid plan, backup
scheduler, App release or production activation is implied by this document.
