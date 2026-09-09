# First-party website measurement

Implementation default: **off until explicitly configured**. Production activation
and welcome-email verification were recorded on 2026-09-09 UTC (PRs #181,
#184 and #185); this is a dated receipt, not a live status probe.
Code, configuration, successful storage, and live collection are separate states.
This document does not authorize deployment, storage provisioning, a real
subscription, or an email send.

## What each source answers

| Question | Source and unit | Boundary |
| --- | --- | --- |
| Did Google show or send a searcher to Wenlan? | GSC impressions and clicks | Property totals, visible queries and their gap stay separate. |
| How many visitors/referrers did the site observe? | Vercel visitors and referrer aggregates | Keep raw/direct/qualified/acquisition-surface splits; no inferred person-level joins. |
| Which controls were used? | First-party accepted operations | Client-reported, repeatable and forgeable; not unique visitors or sessions. |
| Was a download link activated? | `github_outbound` with a known release asset | Not a completed download or install. |
| How many release assets were downloaded? | GitHub cumulative asset `download_count` | Point-in-time counter; no website/campaign/person attribution. |
| Was a subscription saved? | Resend contact evidence | A contact is not an email delivery, email open or click. |
| Did people star the repository? | GitHub stars | Separate from outbound operations and downloads; no causal conversion claim. |

Keep the same complete date range in one weekly report. No composite score,
new CTA denominator, per-user funnel or fabricated source-to-page sessions.

## Events and privacy

The existing tracking helper now optionally sends to `/api/site-events`,
independently of Umami. Existing Umami integration remains optional.

Events cover download/GitHub links, setup/guide entry links, demo play clicks,
subscription success/error feedback, scenario selection/source expansion,
comparison selection, and product-view selection/image opening. `waitlist_*`
names remain for historical event compatibility; the UI is a release-update
subscription, not a product waitlist. `waitlist_signup` means a browser observed
a successful contact-save response, **not** a deduplicated new contact count.
Video play clicks do not measure watch duration/completion. This is a named
event registry, not blanket recording of every click or input.

The server accepts only canonical sitemap paths aligned with locale and bounded
event, placement, context, detail, source, and known release-asset fields.
It rejects unknown fields, URL queries, arbitrary URLs and oversized bodies.
No email, form text, IP, user-agent, cookie, persistent identifier or raw
referrer/UTM string enters the event store. Existing short-lived browser
acquisition context is reduced to finite source categories. Labels are
client-reported and cannot prove the real source of a visitor.

Both client and server respect DNT/GPC. The transport and hosting infrastructure
still process ordinary network metadata; this is not a promise that no provider
ever sees an IP address. Resend contact data is separate and still contains the
address explicitly submitted by the subscriber. Subscription errors must not
print provider response bodies or addresses to server logs.

### Operator and test exclusion

Before inspecting the production website interactively, operators can opt this
browser out of the first-party collector using browser developer tools:

```js
localStorage.setItem("wenlan-site-events-disabled", "1");
```

To resume this collector deliberately:

```js
localStorage.removeItem("wenlan-site-events-disabled");
```

The preference is local to that browser and origin, checked on each event, and
never transmitted. It is not an identity or a global owner filter. Storage access
failure skips optional first-party collection rather than blocking the user's
action. This setting does not disable Vercel or Umami; use their respective
controls or isolated tests with external analytics blocked for those providers.
Existing aggregates cannot identify or subtract prior owner/test operations.
Mark their contamination **unknown**, not "organic" or "tests excluded".

## Storage and free-plan boundary

The repo owns collection, validation and reporting. Durable data is kept in a
dedicated Supabase Postgres database, not Git, a serverless filesystem, or an
in-memory production fallback. On 2026-09-08 the user approved the free dedicated
`wenlan-site-measurement` resource and its website-only activation. Creating the
resource does not by itself establish successful collection.

Verified official documentation on 2026-09-08:

- [Vercel custom events](https://vercel.com/docs/analytics/custom-events) require
  Pro or Enterprise; Hobby page/visitor analytics is not a custom-event backend.
- [Vercel function filesystems](https://vercel.com/kb/guide/why-does-my-serverless-function-work-locally-but-not-when-deployed)
  do not provide durable application storage.
- [Supabase pricing](https://supabase.com/pricing) lists a $0 Free plan with
  500 MB database storage and 5 GB egress, at most two active free projects,
  and pausing after one week of inactivity. Automatic backups and point-in-time
  recovery are not included. The Vercel resource was explicitly provisioned on
  `free` in `iad1`; never silently upgrade to paid billing.
- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)
  distinguish server secret keys from public keys. The secret bypasses RLS:
  protect it in server-only configuration, use a dedicated database, and deny
  public/authenticated roles access to aggregate tables and RPC functions.
  The browser talks only to the validated website endpoint, never to Supabase.
- [Resend Contacts](https://resend.com/docs/api-reference/contacts/create-contact)
  and [Segments](https://resend.com/docs/dashboard/segments/migrating-from-audiences-to-segments)
  are separate from sending email. The installed SDK still supports the legacy
  audience path; this patch does not migrate contact memberships or overwrite
  `unsubscribed`. Duplicate-contact behavior needs a consented integration test.

An atomic Postgres transaction increments a per-day aggregate, with at most 60
accepted events per UTC minute and 1,000 per UTC day. The database supplies the
UTC clock. Daily aggregate records have no automatic expiration; disabling
collection does not delete history. This is persistence, not a backup guarantee.
Keep operator exports separately and verify restore procedures before claiming
backup coverage. No paid backup or extra scheduled job is enabled by this patch.
The cap records saturation but is **not** bot detection or a billing limit:
rejected traffic still reaches hosting/storage and can consume quota. Verify
provider hard limits and hosting abuse controls before enabling. There is no
guarantee of an indefinitely free service at arbitrary traffic levels.

## Enable only after approval

### Repeatable read-only preflight

```bash
# Offline by default: no provider request and no environment-file loading.
pnpm seo:measurement:preflight
# Explicitly probe only the credentials already supplied to this process.
pnpm seo:measurement:preflight -- --live true --output /tmp/wenlan-seo/measurement-preflight.json
```

The live probe makes fixed-origin Resend GET requests for domain status,
required contact-property names and at most one contact's existence. It never
prints addresses, IDs, tokens or raw provider bodies. A configured event store
is exercised only with a read-only schema-health RPC, not a counter write. Requests time out
after four seconds and reject redirects. Pagination is bounded; an incomplete
or unreadable listing does not establish that something is absent.

**Do not treat `vercel env run -e production` as production proof by itself.**
The inspected CLI 52.0.0 loads local environment files after the downloaded
records, so local values can replace the intended production values. Run only
from an isolated, correctly linked directory without `.env*` files and clear
inherited measurement variables first. Even then, Vercel withholds values of
`sensitive` variables. The check describes its process environment, not a live
deployment's secret values; `missing_credentials` in that process must not be
reported as a missing production secret.

Reconcile the result with read-only production variable **metadata**. If a
required value is withheld, record `configured in Vercel; runtime unverified`.
Do not weaken its Sensitive setting, copy a local key over it, expose it through
a diagnostic route, or create a new secret merely to make the check pass.
Final production behavior requires an explicitly approved deployment and
consented subscription test. No preflight command should bypass that boundary.

The command's exit status reports whether the check itself ran; inspect its
per-service JSON evidence for disabled, unavailable, incomplete or unchecked
states. Even successful GET/health results do **not** establish contact-write
permissions, delivery, durable counter writes, an enabled deployment, or
end-to-end collection. It neither creates resources nor fixes account state.

### Production build health gate

The `postbuild` hook runs a separate read-only storage gate before the existing
IndexNow command. It runs only when `VERCEL_ENV=production` and
`SITE_EVENTS_ENABLED=1`; non-production builds and disabled collection skip
without a network request. An enabled production build must also have
`NEXT_PUBLIC_SITE_EVENTS_ENABLED=1`, valid server-only Supabase authentication,
and the exact authenticated health response
`{schemaVersion: 1, storage: "postgres", ready: true}`. A missing credential,
flag mismatch or health failure stops the build with a generic redacted error;
the gate does not record events, write data or print secrets. Existing IndexNow
behavior is unchanged and runs only after this gate succeeds.

### Activation sequence

1. Confirm the chosen account's free tier, hard limits, region and retention
   expectations; provision a **dedicated** database only with approval.
2. Apply the reviewed `supabase/migrations/20260908000000_site_events.sql` to
   the dedicated database. Configure server-only `SUPABASE_URL` and
   `SUPABASE_SECRET_KEY` (or the integration's legacy `SUPABASE_SERVICE_ROLE_KEY`).
   Never put secret keys in `NEXT_PUBLIC_*`, source,
   command output, exported counters or public deployment logs.
3. Exercise SQL permissions, count increments and caps in an isolated test
   database or rollback-only transaction before enabling collection. Test
   concurrent writes separately. Mocked REST unit tests do not prove a real
   Postgres deployment, durability or concurrency.
4. Set `SITE_EVENTS_ENABLED=1` and build-time
   `NEXT_PUBLIC_SITE_EVENTS_ENABLED=1` only for the approved production rollout.
   Client tracking and the server reject preview hosts. A development loopback
   is allowed only outside Vercel; never give it production database credentials.
5. Confirm real traffic collection and export once authorized, without generating
   synthetic production events. Record the exact enabled deployment boundary.

Disabled/misconfigured/storage-error responses are 503, capped requests are 429,
accepted events are 204, and privacy opt-outs are 204 without recording.
Failures never block the original user action and are not retried. To disable,
turn off the server flag; turn off the client build flag on the next approved
deployment. Disabling does not erase existing data.

## Export into the existing weekly report

For a quick operations check without rerunning GSC, execute
`scripts/site-events-operations.sql` in an authenticated **read-only** database
console. It returns 28 complete UTC calendar days plus today's separate partial
row, native counters, cap flags, missing-day status, and the contamination limit.
It reads only the event table; it does not read subscriber emails or mutate data.
No public diagnostic endpoint or downloadable production secret is necessary.
Calendar completeness never establishes collection completeness. A missing day
remains unavailable, not zero. Save private raw exports outside the public repo.

The SQL readout is not a full database backup. Follow the provider's backup
procedure for both schema and data; store copies outside disposable worktrees
and restore into an isolated database before marking backup coverage verified.
Do not expose subscription ledgers or signing material in a public report.

```bash
# Uses server credentials supplied securely by the operator; read-only REST.
pnpm seo:events:fetch -- --date YYYY-MM-DD
# Reuses real authenticated GSC and the available Vercel/GitHub/Resend inputs.
pnpm seo:weekly:run -- --date YYYY-MM-DD
```

The export defaults to `/tmp/wenlan-seo/site-events-metadata.json`, outside Git.
`--date` is the report date, not an inclusive data end date: September 8 selects
August 11 through September 7, 28 complete UTC days. A mismatched GSC range
fails rather than silently combining windows. The pipeline reads the optional
export; it does not create another job or repeat the GSC fetch.

Missing day keys and errors remain unavailable, not zero. Existing day keys
prove observed operations, not continuous collector uptime. Reports show
available-day counts, missing days, caps, locales and coarse source categories;
complete coverage is never inferred from key presence. Historical releases are
accepted in export validation without rewriting their tags to the current one.
The append-only `src/lib/site-events-v1-history.json` preserves public route and
asset IDs across deletions or renames. Add new canonical paths and asset IDs to
that registry when the contract test requests it; do not delete retained entries.
Event names, placements and finite details in v1 must also remain backward
compatible, or gain a separately readable versioned namespace.

## Verification and remaining production checks

`pnpm test:measurement` runs mocked backend, client, report and subscription
contracts. `pnpm lint`, the existing SEO/i18n suites and `pnpm build` guard the
integrated site. Browser QA must use local routes, blocked external analytics,
mocked event transport and no real contact submission. Distinguish that evidence
from durable Postgres writes, Resend membership, and email delivery.

Before claiming the release subscription works end to end, separately verify
production configuration, a consented contact save (including duplicate and
unsubscribed states), and removal of the test contact if authorized. Before
claiming email delivery, verify the sending domain and an explicitly approved
message/delivery result. Neither action is performed merely by running tests.
