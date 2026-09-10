# Automatic stable downloads

The homepage recommendations, three localized download pages, Get Started Windows
downloads/install text and HowTo schema, and software JSON-LD
resolve a single validated GitHub release manifest on the server. They do not use
the documentation snapshot in `src/lib/releases.ts` as a latest-version pin.

## Selection and refresh

- Source: `https://api.github.com/repos/7xuanlu/wenlan/releases/latest`.
- Only a stable `vMAJOR.MINOR.PATCH` release with all supported uploaded, nonempty
  downloads and required updater/checksum assets is eligible. A tag alone, draft,
  prerelease, or incomplete asset set is not eligible.
- Download URLs must belong to that exact repository and tag. Versioned installer
  filenames, sizes, and the visible release label come from the same manifest.
- Next Data Cache revalidates after 300 seconds, on demand. ISR pages also
  revalidate every 300 seconds. Stale-while-revalidate can serve a previous result
  on the first visit after expiry; this is not an exact five-minute publication SLA.
- No cron, client-side GitHub polling, new storage service, or App release workflow
  change is required. Existing open tabs retain the version they rendered.

## Failure behavior

Invalid responses and upstream failures throw *inside* the cached function, so a
failed refresh cannot replace its last valid entry. Only the outer resolver catches
an initial cache failure and uses the bundled audited snapshot. If no cache survives
(for example after eviction), that snapshot can be older than the last version
served elsewhere; this is a safe download fallback, not guaranteed latestness.
Root layouts have explicit timed revalidation so a fallback build retries later.

The Data Cache is Vercel/Next-managed cache, not a durable release-history database.
The authoritative durable history and artifacts remain on GitHub. New platforms or
changed release naming conventions require a reviewed schema/UI update; releasing
another version with the existing contract does not.

## Measurement and evidence

`GET /api/release` is read-only, noindex, and exposes the server's resolved manifest
for verification/reporting. It does not record an event. Different cached page
generations may temporarily show the prior version; the endpoint is not proof that
every historical visitor saw that version.

The `X-Wenlan-Release-Source` header distinguishes `github-cache` from
`bundled-fallback`; the latter also emits a bounded server warning. A cached GitHub
result may be stale, so `github-cache` is not proof of a successful fresh fetch.
GitHub measurement exports retain this resolution label (or `unavailable` for an
older endpoint), separately from the asset counters.

Tracked download clicks identify the exact URL selected, not a bundled version.
The collector accepts only bounded stable-version labels and known asset IDs.
These remain anonymous client-reported operations, not authenticated release
evidence, successful downloads, installs, or unique people. GitHub's cumulative
asset download counts remain separate from site clicks.

The source/documentation snapshot and release highlights remain editorial evidence
for their stated version. `seo:release:bump` is optional maintenance for those
surfaces, not a prerequisite for new installer downloads.

## Verification

- `pnpm test:release`: deterministic parsing, malformed assets, future versions,
  failure handling, download selection, measurement, and report contracts.
- `pnpm seo:release:check`: current GitHub stable asset contract.
- `pnpm seo:release:check -- --site http://127.0.0.1:PORT`: exercise the running
  site's release endpoint and localized download pages.
- Run lint/build, built technical checks, and desktop/mobile rendering before
  publication. Then verify the production manifest and actual page links.

No test should send production analytics, subscribe an address, or count fixture
observations as organic usage.
