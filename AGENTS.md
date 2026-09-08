# AGENTS.md

Guidance for coding agents working in this repository.

## Project

Wenlan public website and SEO/GEO surface, built with Next.js 16 App Router, React 19, and Tailwind CSS 4. The product is Wenlan, and the canonical public site is https://wenlan.app.

The site is deployed on Vercel. Do not push, deploy, submit Search Console validations, or post externally unless the user explicitly asks.

## Commands

```bash
pnpm dev                  # Local dev server with Turbopack
pnpm build                # Production build; postbuild skips IndexNow unless production/forced
pnpm start                # Serve the production build
pnpm lint                 # TypeScript check: tsc --noEmit --incremental false
pnpm test:seo             # node:test suite for brand, SEO, redirects, schema, and pipeline behavior
pnpm seo:release:bump     # rewrite mechanical release surfaces (docs highlights stay manual)
pnpm seo:weekly:sample    # Fixture-backed weekly SEO pipeline health check
pnpm seo:weekly:run -- --date YYYY-MM-DD
pnpm seo:gsc:fetch -- --date YYYY-MM-DD
pnpm seo:ai-visibility -- --date YYYY-MM-DD
pnpm seo:goal:check
pnpm seo:scenario:check
pnpm seo:scenario:update
pnpm seo:intent:check
pnpm seo:technical:built
pnpm seo:technical:deployed
pnpm seo:release:check     # Live GitHub stable release and published download verification
```

The SEO tests read sibling Wenlan and wenlan-app checkouts for current source facts. Set both `WENLAN_REPO_ROOT=/absolute/path/to/wenlan` and `WENLAN_APP_REPO_ROOT=/absolute/path/to/wenlan-app` when those repos are not adjacent to this checkout.

## Architecture

- `src/app/page.tsx` - homepage.
- `src/app/about/page.tsx` - about/release positioning page.
- `src/app/docs/` - documentation index, docs content, docs pages, and docs OG images.
- `src/app/learn/` - Learn index, SEO article data, article pages, article visuals, and Learn OG images.
- `src/app/layout.tsx` - root metadata, fonts, Umami script, theme bootstrap, JSON-LD, and footer shell.
- `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/feed.xml/route.ts`, `src/app/llms-full.txt/route.ts` - machine-readable SEO/GEO surfaces.
- `next.config.ts` - X-Robots headers plus legacy pre-Wenlan and `/guides/*` redirects to canonical Wenlan/`/learn/*` URLs.
- `scripts/` - deterministic SEO, technical SEO, AI visibility worksheet, GSC fetch, IndexNow, and brand-contract checks.
- `docs/search-console-umami.md`, `docs/seo-growth-loop.md`, `docs/seo-measurement.md`, `docs/seo-audits/` - weekly SEO/GEO operating docs and generated/manual audit records.

## Product And SEO Rules

- Use Wenlan as the product name. `useorigin.app` and `www.useorigin.app` are legacy redirect bridge hosts for migrating users and search queries into `wenlan.app`.
- Search Console is the canonical source for query/page performance. Do not invent GSC, indexing, or Umami metrics.
- Prefer refreshing indexed pages with impressions before creating net-new Learn content.
- Keep visible FAQ text where useful, but do not add `FAQPage` JSON-LD unless Google eligibility changes for ordinary software sites.
- Keep canonical public URLs in the sitemap. Old `/guides/*`, `/docs/guides/*`, and legacy pre-Wenlan Learn slugs should redirect, not appear in the sitemap.
- `/llms.txt`, `/llms-full.txt`, `/feed.xml`, `/humans.txt`, manifest, and static assets intentionally receive noindex-style headers where configured.
- **Product evidence quality floor:** Before publishing a new or substantially
  expanded scenario page, follow `docs/seo-product-evidence-standard.md`. Use a
  real sanitized product view, an inspectable workflow, a scenario-specific
  action, natural three-locale copy, and responsive browser QA. Simulated UI is
  not product proof.

## SEO Campaign Control Plane

This section is an index, not a second copy of the campaign contract. Keep the
detailed rules in their versioned source files so they cannot drift between
documents.

- **Tier 0 — entrypoint:** `AGENTS.md` contains routing, required reads, commands,
  and stop conditions only. Do not copy the full campaign contract into it.
- **Tier 1 — contract:** Before every SEO campaign action, run
  `pnpm seo:goal:control` (which runs `pnpm seo:goal:check`) and read the complete
  `docs/seo-active-control.md` view. Within the same context only, reuse an actually
  read view with `--known-fingerprint <sha256>`; verification always runs. After
  compaction omit the fingerprint. Stop if it fails; do not continue from a chat
  summary. `PLAN.md` retains immutable contracts and referenced historical narrative.
  Regenerate the derived view with `pnpm seo:goal:control --update` after relevant
  PLAN edits. Read the exact experiment contract before its action or readout.
  For external-time waits, finish useful authorized work first; after the same
  blocker recurs for three consecutive Goal turns use the supported blocked
  transition and retain the same heartbeat. Do not repeatedly poll the timer.
- **Tier 2 — structured state:** `EXPERIMENTS.md` is the append-only experiment
  and readout ledger. `docs/seo-scenario-backlog.json` is the only editable
  scenario source; `docs/seo-scenario-backlog.md` is generated. Validate with
  `pnpm seo:scenario:check` and regenerate with `pnpm seo:scenario:update`.
  Search-intent ownership is derived from the canonical sitemap and content by
  `scripts/seo-intent-map.mjs`; run `pnpm seo:intent:check`.
  The current diagnosis-recovery queue is `docs/seo-growth-recovery.md`; it
  routes to evidence and next decisions without replacing the contract or
  scenario source. Demand-decision questions live only in
  `docs/seo-product-evidence-standard.md`.
- **Tier 3 — evidence:** Reuse the latest successfully completed weekly SEO
  report before collecting overlapping GSC or Vercel evidence. Dated files
  under `docs/seo-audits/` are evidence snapshots, not editable contract or
  state. Keep GSC, Vercel, Umami, GitHub, Trends, SERP, community, and OSS
  observations in their native units and evidence roles defined by `PLAN.md`.

## Theming And UI

Dark mode is the default. Light mode is enabled by setting `data-theme="light"` on `<html>`; do not rely on Tailwind `dark:` variants for site theming.

Theme state is stored in `localStorage("wenlan-theme")`. A blocking script in `layout.tsx` applies the saved theme before paint.

Static accent tokens live in `globals.css` as Tailwind theme variables such as `--color-wenlan-warm`, `--color-wenlan-amber`, `--color-wenlan-gold`, `--color-wenlan-indigo`, and `--color-wenlan-sage`. Runtime semantic colors use `--o-*` CSS variables under `:root` and `[data-theme="light"]`.

Style constraints:

- No left border accent stripes on cards. Use other visual treatments.
- Keep card radii restrained and avoid nested cards.
- Use the existing typography stack: Fraunces, Instrument Sans, JetBrains Mono.
- Path alias `@/*` maps to `./src/*`.

## Analytics And Server Actions

Umami is included only when `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set. `NEXT_PUBLIC_UMAMI_SCRIPT_URL` can override the script URL; otherwise the cloud script is used.

The waitlist server action lives in `src/app/actions.ts` and uses Resend. It requires `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` for successful submissions.

## Quality Bar

- Before claiming a change is done, run the narrow relevant check. For site or SEO changes, prefer `pnpm test:seo`, `pnpm seo:weekly:sample`, and `pnpm build` as applicable.
- Run `pnpm lint` when TypeScript or route/component code changes.
- Use `pnpm seo:technical:built` after build-output-sensitive SEO changes.
- For release/download updates, run `pnpm seo:release:check` against GitHub's
  latest stable release before publication. Local source contract tests inspect
  the exact website-selected tag; their passing result does not establish that
  this is still the latest published release. A newer local Git tag may be a
  prerelease and must not automatically change the website's release selection.
- Use `pnpm seo:technical:deployed` only when deployed-site checks are relevant and network access is available.
- Keep generated/raw GSC and Umami exports out of git. Use `/tmp/wenlan-seo` for weekly input CSVs and commit only interpreted reports when they record decisions or shipped work.
