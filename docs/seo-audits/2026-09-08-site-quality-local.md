# September 8 site quality repair — local implementation

This local change adds complete downloadable exercises and scenario-specific
product evidence to seven existing scenario families across three locales. It
also adds recorded citation/revision proof and a downloadable exercise to core
guides, and improves shared evidence inspection and localized reader navigation.
It is user-directed quality work, not a deployed SEO experiment or evidence of
increased traffic.

## Why these changes

The September 4 diagnosis found low qualified search visibility despite a large
indexed inventory. In its retained August 7–September 3 GSC observation, property
totals were 12 clicks / 1,066 impressions; visible queries were 2 / 262, leaving a
10 / 804 visibility gap. September 3 was incomplete. These are historical
observations, not a fresh September 8 GSC fetch. The separate complete-day
August 6–September 2 observation was 12 / 1,092; the ranges must not be combined.
See [the diagnosis](2026-09-04-seo-growth-diagnosis.md).

The user's three-month summary of 27 clicks / 2.31k impressions implies about
1.17% CTR, but the exact range and property were not independently re-fetched in
this task. That aggregate does not establish a penalty or identify the cause of
low clicks. Retained core-query observations had low exposure and average
positions around 35–63. Repeated technical checks or additional article count
alone do not resolve that visibility problem.

The working attraction hypothesis is concrete: people arrive with a task,
compare available approaches, and need an inspectable result they can reproduce
before deciding to install Wenlan. This remains a hypothesis about user behavior,
not a substitute for observed first-use or repeat-use evidence. Google's
[helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
supports original value and demonstrated experience; it does not promise rankings
for adding screenshots.

The September 8 homepage publication is a separate prior change. Its deployment
boundary must remain separate from this unshipped patch and from the historical
three-month aggregate; see [publication evidence](2026-09-08-homepage-publication.md).

## Implemented behavior

- English, Traditional Chinese, and Simplified Chinese versions of the existing
  LLM-wiki and source-backed-wiki guides show two real Tally demo frames: following
  a SQLite citation and inspecting a proposed page revision. Their text states
  exactly what is visible. A proposed revision is not presented as an approved
  result, and the Tally demo is not presented as the separate API exercise.
- The shared product-evidence viewer supports fit, enlarged detail, scrolling,
  original-image access, keyboard opening, Escape, and focus restoration. It
  improves the existing evidence panels across seven scenario families as well
  as the two core guide families. Captions remain server-rendered.
- The LLM-wiki exercise has a three-locale Markdown download generated from the
  existing exercise source. It includes the fictional source files, prompt,
  reference result, conflicting update, and review conditions. It works without
  installing Wenlan and is not represented as a captured Wenlan execution.
  Download endpoints are attachments, noindex, and absent from the sitemap.
- Shared Learn labels use reader-facing language; Chinese categories and FAQ
  labels are localized. Two internal editorial statements were replaced with
  practical explanations. Chinese docs cards identify destinations that are
  English-only; the translated getting-started route is correctly excluded.
- Twenty-seven substantially expanded pages (six core guides and 21 scenario
  pages) use September 8 update dates.
  Original publication dates are preserved. Minor caption and wrapping repairs
  do not mechanically refresh unrelated article dates.

- Seven existing scenario families now each include three complete fictional
  source files, a source-cited reference answer, a consequential source update,
  task-specific reasoning and review conditions, and a three-locale Markdown
  attachment. English fixture bodies are shared and explicitly labeled; the
  surrounding task, explanation and review copy is localized. The exercise also
  works with plain files. Existing canonicals, H1s and publication dates remain.
- Each scenario shows its own reference page and changed source in the published
  v0.18.3 product interface. The reference is explicitly authored teaching
  content, not automatically synthesized output or a customer outcome. An
  isolated v0.18.3 daemon stored the three memories and page; changing one cited
  source produced `source_updated`, one updated source, and unchanged page text
  in all seven runs. No model rebuild or approval was run.

The Tally recording assets retain
[`homepage-media-provenance.json`](../homepage-media-provenance.json).
The 14 new scenario captures are inventoried with hashes and limitations in
[`scenario-media-provenance.json`](../scenario-media-provenance.json). They use
unmodified product React code from tag v0.18.3 and the tag's test bridge to
render actual isolated API readback. They are not native desktop end-to-end
recordings; unrelated shell fixture state is not evidence. The visible
`updating…` label is explained as pending rebuild, not completed correction.

Page creation returned a top-10 self-retrieval warning in all seven isolated
runs. Some related memories returned near-duplicate warnings and were stored.
Exact-ID page/source readback succeeded; this verification does not establish
search ranking or retrieval quality. These warnings remain in the evidence.

## Verification and exact state

Base commit: `f1cf0c85322610498a0aa60215cf4144e38f4c8c`, with local changes.
Final build ID: `52MKGiNx8St7jXNez08KT`.
The SHA-256 of the compact JSON mapping of the 43 changed application, asset,
provenance and test files to their individual SHA-256 values is
`77b617a5fe522ff026b3c34237a510d2e2ef444a8bc34d61e8321a850d4bd8ed`.
This report is excluded from that mapping. The full mapping is retained in the
review artifacts; no commit was created.

- SEO suite: 346 passed. Locale suite: 83 passed. Goal suite: 57 passed.
- TypeScript, production build, goal/scenario contracts, weekly fixture sample,
  and built technical SEO passed. Eight required noindex header patterns are
  enforced, including raw scenario packets. IndexNow was explicitly skipped.
- Seven v0.18.3 isolated product runs passed the exact-ID page/source and stale
  state assertions described above. All 14 original product frames were visually
  inspected. The downloaded runtime archive matched its published SHA-256.
- Headless Chromium checked 21 scenario routes at exactly 393px and 1440px in
  dark and light themes: 84 states. Every reference link revealed its source;
  expanded sources and changed-source text had no page overflow. Both images
  loaded, keyboard opening/zoom/Escape/focus restoration worked, and no page
  runtime errors were observed. All 84 evidence sections were visually inspected.
- All 21 scenario Markdown attachments were checked over HTTP for complete
  sources, changed source, attachment disposition and noindex. Unsupported
  IDs/locales returned 404. Public JSON also returned noindex. The built checker
  now fails if that raw-packet header is removed, and provenance tests fail if
  packet content drifts from the inventoried image evidence.
- A final intro-only `text-pretty` correction was rebuilt and its 84 display
  states rechecked separately. The other scenario component sections retained
  their tested implementation. The build and technical check were repeated.
- The earlier tranche checked 104 article routes in 416 viewport/theme states,
  six core-guide recorded workflows, both Chinese docs indexes in eight states,
  all 47 documentation-card destinations per locale, and the three core Markdown
  downloads. That evidence remains scoped to unchanged shared header/viewer/core
  behavior; it is not described as a second fresh 416-state run after expansion.
- Independent Sol review and one closure check found no remaining substantive
  issue. The two findings were verification gaps (raw JSON noindex enforcement
  and packet-to-image provenance), both fixed with regression coverage. Native
  Luna workers handled bounded implementation and locale cleanup; root owned
  evidence judgments, integration, product execution and rendered QA.

The previous quality artifacts are retained at:
`/Users/lucian/.codex/visualizations/2026/09/08/01a081dd-3b78-7662-b354-7d3aab995038/quality/`.
The scenario extension, exact source manifest, receipts, scripts, browser checks,
sharing draft and source backup are retained under its `scenario-extension/`
subdirectory. The active localhost preview uses port 3108.

## Remaining limits

This is not a claim that every historical article has been rewritten. The seven
previously identified scenario proof gaps now have their own complete exercises,
actual source-update readbacks and product frontend captures. This proves the
bounded linkage/staleness behavior, not automatic answer correctness, review
completion, real customer adoption or superiority over plain files.

Browser evidence covers the changed shared headers, proof, viewer, downloads,
and docs labels. It does not establish Safari behavior, field Core Web Vitals,
or correctness of every historical paragraph.

Qualified discovery and distribution still require observed reader behavior. A
specific first-reader packet and an unpublished Traditional Chinese Threads
draft are retained with the local review artifacts. The proposed entry is the
existing LLM-wiki worked example, for people reusing changing project documents
with AI. This is a prepared sharing unit, not delivered readership. The original
TRAE discussion could not be refreshed (fetch timeout), so it is not treated as
a rules-verified posting destination. No external post was made.

The existing live Wenlan entry in
[Awesome MCP Servers](https://github.com/DhanushNehru/awesome-mcp-servers#productivity--collaboration)
was verified; it must not be submitted again or counted as measured referral
traffic. No new external submission or outreach occurred.

There was no commit, push, PR, merge, deployment, indexing request, analytics
mutation, or campaign-baseline change. Future publication needs an exact
integrated-state check and a recorded deployment boundary. Search performance
must then be assessed with the existing per-locale GSC/crawl/exposure contract,
alongside actual exercise use and repeat-use evidence; passing these checks is
not an acquisition outcome.
