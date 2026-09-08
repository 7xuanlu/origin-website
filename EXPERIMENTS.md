# Wenlan Growth Experiment Ledger

This file is append-only. Never delete, reorder, or rewrite a historical
record. Correct an earlier statement by appending a new correction or readout
record with a later timestamp and the same experiment ID. Git history is the
audit trail; the verifier enforces record shape and campaign caps but does not
replace review of destructive history edits.

Before appending a record:

1. read `PLAN.md`;
2. run `pnpm seo:goal:check`;
3. stop if it fails;
4. keep external demand provenance separate from authenticated GSC inputs;
5. do not perform an approval-gated external action.

## Experiment-start record schema

Every started experiment uses one immutable block with these exact fields:

```text
<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-YYYY-MM-DD-short-name

- Record type: experiment-start
- Experiment ID: EXP-YYYY-MM-DD-short-name
- Status: active
- Data window: YYYY-MM-DD..YYYY-MM-DD
- Asset class: refresh
- Launched: YYYY-MM-DD
- Hypothesis: one falsifiable sentence
- Candidate evidence: inspectable sources, dates, locale/geography, and native units
- Baseline: GSC, Vercel, GitHub, and optional Umami measures kept separate
- Change: one bounded change
- Publish date: YYYY-MM-DD or not-published
- Index date: YYYY-MM-DD or not-indexed
- Minimum exposure: positive threshold and native unit
- Success criteria: predeclared
- Failure criteria: predeclared
- Stop criteria: predeclared
- 24h readout: pending or observed evidence
- 7d readout: pending or observed evidence
- W2 readout: pending or observed evidence
- W4 readout: pending or observed evidence
- W8 readout: pending or observed evidence
- Result: pending, success, failure, or inconclusive
- Decision: wait, scale, refresh, merge, stop, localize, or extend
- Next step: one concrete next action or wait condition
<!-- EXPERIMENT-RECORD:END -->

```

Allowed start statuses are `approved`, `active`, `live`, `measuring`,
`extended`, `decided`, `inconclusive`, and `stopped`. Active reporting counts
`approved`, `active`, `live`, `measuring`, and `extended`; only `approved` and
`active` consume the single production-in-flight slot.

Allowed asset classes are `refresh`, `integration-hub`,
`diagnostic-recipe`, and `net-new-search`.

Each data window contains seven complete reporting dates, inclusive, on the
campaign cadence anchored at `2026-07-18..2026-07-24` and advancing in
seven-day increments. A reporting window does not block an approved launch.
There is no fixed net-new article interval, but the complete candidate gate,
preceding-change production verification, and non-overlapping-intent guard
still apply. No experiment may launch after the frozen `2026-08-18` campaign
deadline.

## Readout and correction records

Readouts and corrections are appended after the start record. They restate the
experiment ID, observation timestamp, native metric units, result, decision,
and next step. They never overwrite the start record. The verifier applies the
latest appended status for each experiment when enforcing production
concurrency.
A readout must follow its experiment-start record. Its `Observed at` value is a
real ISO-8601 UTC calendar timestamp, cannot predate launch, and must strictly
increase for that experiment.

```text
<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-YYYY-MM-DD-short-name at YYYY-MM-DDTHH:MM:SSZ

- Record type: experiment-readout
- Experiment ID: EXP-YYYY-MM-DD-short-name
- Observed at: YYYY-MM-DDTHH:MM:SSZ
- Readout: 24h, 7d, W2, W4, W8, or correction
- Status: active, live, measuring, extended, decided, inconclusive, or stopped
- Evidence: native-unit observations separated by source
- Result: pending, success, failure, or inconclusive
- Decision: wait, scale, refresh, merge, stop, localize, or extend
- Next step: one concrete next action or wait condition
<!-- EXPERIMENT-RECORD:END -->

```

## Ledger

### 2026-07-18T21:14:56.537Z — control-plane bootstrap

- Record type: campaign-bootstrap
- Goal deadline: 2026-08-18
- Contract status: pending user review
- Experiments started: 0
- Active experiments: 0
- Website-affecting changes: none
- External actions: none
- Next step: review `PLAN.md`, `EXPERIMENTS.md`, the verifier, and its tests.

### 2026-07-18T22:06:21Z — contract approval

- Record type: campaign-approval
- Contract status: approved by the user in this Codex task
- Experiments started: 0
- Active experiments: 0
- Website-affecting changes: none
- External actions: none
- Execution mode: primary Codex agent inline; no SDD or subagents
- Next step: build the provenance-backed demand candidate queue and apply all
  five candidate-gate conditions before recording an experiment.

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-18-claude-code-memory-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-07-18-claude-code-memory-refresh
- Status: approved
- Data window: 2026-07-18..2026-07-24
- Asset class: refresh
- Launched: 2026-07-18
- Hypothesis: A native-memory-first, source-current refresh of the existing indexed Claude Code memory page will earn more qualified search exposure and make the route more useful without adding another URL.
- Candidate evidence: `CAND-2026-07-18-claude-code-memory-layer` in `docs/seo-audits/2026-07-18-growth-candidate-queue.md`; authenticated GSC and Vercel rows; inspectable Reddit discussions; Claude Code issues #27298 and #34556; current official Claude Code memory docs; current Wenlan README at commit `88fc7df1a242a1f2dbc33b6e76c2af4c39a1748a`.
- Baseline: GSC page row for `2026-06-20..2026-07-17` is 23 impressions, 0 clicks, and 38.7 average position; visible Claude-memory query rows total 5 impressions but are not joined to the page; Vercel page aggregate is 3 visitors and 3 pageviews; GitHub total stars are 47; Umami and Vercel custom CTA events are unavailable/account-gated.
- Change: Refresh only `/learn/claude-code-memory` in English with the documented Claude Code native-memory layers and limits, deterministic `/memory` inspection, the current preferred direct Wenlan plugin path, and an explicit native-first boundary; create no new URL and no Mandarin translation.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 25 GSC page impressions in the first 28 complete days after the refreshed page is first confirmed crawled or indexed
- Success criteria: After minimum exposure, the page earns at least 2 GSC clicks or improves average position by at least 10 positions from the 38.7 baseline; report clicks, impressions, position, Vercel visitors, GitHub outbound, and stars separately.
- Failure criteria: After minimum exposure and 28 complete post-index days, the page has 0 GSC clicks and average position is 38.7 or worse; if minimum exposure is not reached, mark the result inconclusive instead.
- Stop criteria: Stop or hold the experiment if a source fact becomes invalid, any canonical/indexing/robots/noindex/redirect/structured-data regression appears, a second controller edits the same page, or the required publish/distribution approval is not granted.
- 24h readout: pending — after publish, verify the live page, canonical, indexability, structured data, links, and separate Vercel page/referrer observations without judging SEO success
- 7d readout: pending — report GSC latency/index state, page impressions/clicks/position when available, Vercel page visitors, GitHub outbound when available, and total stars separately
- W2 readout: pending — apply the minimum-exposure rule and inspect English, zh-TW, and zh-CN surfaces for regressions without speculative localization
- W4 readout: pending — evaluate the predeclared success/failure criteria in native units and keep source metrics separate
- W8 readout: pending — post-campaign follow-up if still useful; scale, refresh, merge, stop, or mark inconclusive without changing the fixed Goal window
- Result: pending
- Decision: wait
- Next step: prepare and verify the local one-page refresh, then request explicit approval before deploy, push/merge, distribution, indexing, or validation
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-18T23:24:28Z — execution-mode correction

- Record type: campaign-correction
- Corrects: the execution-mode line in the
  `2026-07-18T22:06:21Z` contract approval record
- Execution mode: primary Codex coordinator with bounded, short-lived native
  Codex subagents; no Superpowers SDD
- Reason: the user clarified that the token-cost preference excludes the
  Superpowers SDD workflow, not ordinary native Codex subagents
- Experiments started: 1
- Active experiments: 1
- External actions: none
- Next step: use bounded native subagents to prepare, source-check, and review
  the approved local experiment

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-18-claude-code-memory-refresh at 2026-07-18T23:33:43Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-18-claude-code-memory-refresh
- Observed at: 2026-07-18T23:33:43Z
- Readout: correction
- Status: active
- Evidence: Before publish, an authenticated same-range GSC query-plus-page capture exposed 11 of the page's 23 impressions. The selected five-query non-brand Claude-memory cluster has 9 visible impressions, 0 clicks, and 50.0 impression-weighted average position. The original page-level success condition remains necessary but is no longer sufficient for a qualified-exposure success label. Qualified-exposure success also requires the cluster to remain visible with at least 9 impressions and to improve in at least one native unit: at least 1 click, at least 12 impressions, or impression-weighted average position of 45.0 or better. If the cluster is hidden by privacy filtering or this guardrail is not met, report the qualified-exposure result as inconclusive even if page-level efficiency improves.
- Result: pending
- Decision: wait
- Next step: finish local verification, then request approval before publish; after publish, keep page-level and visible non-brand cluster readouts separate
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-18-claude-code-memory-refresh at 2026-07-18T23:38:34Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-18-claude-code-memory-refresh
- Observed at: 2026-07-18T23:38:34Z
- Readout: correction
- Status: active
- Evidence: Local preparation is complete and unpublished. Official Claude Code memory facts and the Wenlan direct plugin path were independently source-checked. `pnpm test:seo` passed 172 tests, `pnpm lint` passed, `pnpm build` generated 208 static pages and skipped IndexNow outside production, built technical SEO passed, i18n contract and live built-route checks passed, and desktop/mobile rendered QA passed with no global overflow or browser warnings. Evidence report: `/tmp/wenlan-seo/visual-qa/2026-07-18-claude-code-memory/report.md`.
- Result: pending
- Decision: wait
- Next step: create the durable local Git checkpoint, then request explicit approval before push, merge, deploy, external distribution, indexing, or validation
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-18T23:45:41Z — pre-publish wait observation

- Record type: campaign-observation
- Experiments started this window: 0
- Active experiments: 1
- Publish state: `EXP-2026-07-18-claude-code-memory-refresh` remains unpublished
- GitHub evidence: 47 total stars from GitHub REST, captured `2026-07-18T23:45:41Z`
- Production technical evidence: deployed robots, 108 sitemap URLs, 13 key pages, 6 utility noindex headers, FAQPage absence across 108 sitemap URLs, 25 redirects, 6 bridge-host redirects, and old-URL sitemap exclusions passed
- External actions: none
- Decision: wait; no new evidence-backed experiment and no continuous rewrite
- Next step: one-time same-thread heartbeat `wenlan-growth-evidence-window-2` on `2026-07-25 10:00` America/Los_Angeles, after the Friday weekly SEO controller

### 2026-07-18T23:48:28Z — approval-boundary stop

- Record type: campaign-stop
- Stop condition: approval boundaries block a necessary action after three
  consecutive Goal turns
- Experiments started: 1
- Active experiments: 1
- Publish state:
  `EXP-2026-07-18-claude-code-memory-refresh` remains locally prepared and
  unpublished
- Evidence attempted: frozen control plane and verifier; authenticated GSC and
  Vercel baselines; GitHub stars; target query-plus-page guardrail; official
  source review; full local, built, i18n, rendered, and deployed technical SEO
  verification
- Result: the experiment is unexposed and remains pending; no publish or index
  date exists, so it is neither a success nor a failure
- External actions: none
- Heartbeat: `wenlan-growth-evidence-window-2` deleted
- Blocker: explicit push, merge, and deploy approval was not granted
- Next decision: the user must explicitly approve push, merge, and deploy to
  resume this current experiment; Reddit or other external publication, OSS
  submission, request indexing, and GSC validation remain separately
  approval-gated

### 2026-07-19T00:22:07Z — campaign resumed

- Record type: campaign-approval
- Approval: the user explicitly approved push, merge, and deploy for
  `EXP-2026-07-18-claude-code-memory-refresh`
- Goal status: resumed from the approval-boundary stop
- Experiments started: 1
- Active experiments: 1
- Google Trends retry: `Claude Code memory` and `MCP memory server`, US, past
  12 months, captured `2026-07-19T00:21:54Z`; the official public endpoint
  returned HTTP 429 again, so no 0–100 index was captured or used
- Raw Trends retry evidence:
  `/tmp/wenlan-seo-demand/2026-07-18/google-trends-explore.headers` and
  `/tmp/wenlan-seo-demand/2026-07-18/google-trends-explore.raw`
- Approved external actions: push, merge, and deploy only for the current
  experiment
- Still approval-gated: Reddit or other external publication, OSS submission,
  request indexing, and GSC validation
- Next step: publish the current experiment, verify production, then wait for
  the predeclared 24h and 7d readouts

### 2026-07-19T00:33:42Z — experiment published

- Record type: campaign-observation
- Experiment ID: `EXP-2026-07-18-claude-code-memory-refresh`
- Active experiments: 1
- Pull request: `https://github.com/7xuanlu/wenlan-site/pull/56`
- Merge revision: `1546bde7aa94dad7c5530002325d0c60cb3e0b8e`
- Publish date: `2026-07-18` America/Los_Angeles
- Production completion: `2026-07-19T00:26:09Z`
- Index date: not confirmed; no indexing request or GSC validation was
  submitted
- Live route: `https://wenlan.app/learn/claude-code-memory` returned HTTP 200
  with the canonical URL, `index, follow`, the native 200-line/25-KB limit,
  `/memory` guidance, the direct Wenlan plugin commands, and Article
  `datePublished=2026-06-07` plus `dateModified=2026-07-18`
- Production technical evidence: robots, 108 sitemap URLs, 13 direct-200 key
  pages, six utility noindex headers, sitemap-wide FAQPage absence, 25
  redirects, six bridge-host redirects, and legacy-URL sitemap exclusions
  passed
- Production rendered evidence: desktop top/install and mobile top/all seven
  sections passed with no document-level horizontal overflow and no console
  entries; report:
  `/tmp/wenlan-seo/visual-qa/production-2026-07-19-claude-code-memory/report.md`
- Result: pending; the experiment has only just received exposure and cannot
  be judged at publish time
- Decision: wait
- Next step: one-time same-task heartbeat
  `wenlan-claude-memory-24h-readout` at `2026-07-19 18:00`
  America/Los_Angeles; do not start another experiment

### 2026-07-19T02:47:01Z — Google Trends demand-discovery gate resolved

- Record type: campaign-observation
- Experiments started: 0
- Active experiments: 1
- Source result: the official unattended Google Trends API remains
  limited-alpha/account-gated, but the signed-in official Explore UI produced
  repeatable CSV exports in Chrome
- Raw evidence: 14 request-relative `0–100` timeline comparisons, 9
  related-query exports, and capture metadata under
  `/tmp/wenlan-seo-demand/2026-07-18/trends/`
- Coverage: Worldwide, United States, and Taiwan; English, Traditional
  Chinese, and Simplified Chinese terms; past 12 months and one Worldwide
  five-year comparison
- Interpretation:
  `docs/seo-audits/2026-07-18-trends-demand-discovery.md`
- Validated clusters: `LLM wiki`, Claude/agent memory, modifier-qualified
  Obsidian, MCP memory, and modifier-qualified AI knowledge base
- Rejected as primary targets: generic `knowledge base`, `AI memory`, and
  `AI wiki`; `AI notes` remains inconclusive
- GSC guardrail: existing impression-bearing pages cover the validated
  clusters, so future work should refresh those pages before creating a new
  URL
- Result: demand-discovery prerequisite resolved; no second experiment started
- Decision: wait for the current Claude Code memory experiment's predeclared
  readouts
- Next step: use the next GSC window to choose among the existing LLM-wiki,
  Obsidian, AI-knowledge-base, and MCP-memory pages; do not stack an edit now

### 2026-07-19T17:10:27Z — Trends false-positive removal and ranking clarification

- Record type: campaign-observation
- Experiments started: 0
- Active experiments: 1
- Trigger: the user correctly challenged the visual influence of the
  false-positive `AI memory` curve and the unclear flat priority list
- Change to evidence: three new signed-in official Explore comparisons removed
  `AI memory`; the Taiwan comparison also removed the large `Obsidian` anchor
- Raw evidence: three request-relative `0–100` CSV exports and metadata under
  `/tmp/wenlan-seo-demand/2026-07-19/trends/`
- Taiwan result: `AI 筆記` moved `36.0 → 67.4`, but its top related queries
  were NotebookLM, laptop, Google Notes/AI, and Notion AI; it is real adjacent
  discovery demand, not a clean Wenlan problem cluster
- Taiwan result: exact `AI 知識庫` moved `0.0 → 1.3`; removing Obsidian did
  not reveal meaningful demand, while generic `知識庫` remained broad
- Clarified focus: agent-memory demand, `LLM wiki for AI agents` as the
  source-backed solution/category, and Claude Code/Obsidian/MCP as entry
  points; these are distinct roles rather than one flat keyword ranking
- Execution remains evidence-gated: the current Claude Code memory experiment
  is the only active edit; compare fresh GSC evidence for existing LLM-wiki and
  modifier-qualified Obsidian pages at the next eligible window
- `agent memory` is the next demand hypothesis because it has the strongest
  cleaned relevant Trends direction, but it is not an automatic next edit
  without an impression-backed current page row
- Rejected or held: `AI memory`, `AI wiki`, exact Taiwan `AI 知識庫`, generic
  `knowledge base`, and generic `AI notes`/`AI 筆記` as primary targets
- Decision: do not start a new experiment; wait for the current experiment's
  predeclared readout and use the next GSC window to choose the next existing
  page refresh

### 2026-07-19T17:33:31Z — Goal explicitly resumed

- Record type: campaign-approval
- User instruction: resume the existing Wenlan exposure Goal
- Controller reconciliation: the Goal API snapshot still carried the prior
  approval-boundary `blocked` status immediately before this resumed run; the
  explicit user instruction starts a fresh resumed run
- Contract gate: complete `PLAN.md` read; `pnpm seo:goal:check` passed
- Experiments started: 0
- Active experiments: 1
- Campaign state: evidence-wait; the published Claude Code memory refresh
  remains the only active website experiment
- Safe work resumed now: read-only net-new article coverage-gap research using
  cleaned Trends, related-query, Reddit, OSS, SERP, and current-site evidence
- External actions: none
- Decision: keep the 24h readout heartbeat active; do not start, publish,
  push, merge, deploy, distribute, or request indexing for a second experiment
- Next step: nominate at most one net-new article candidate for a later
  eligible window, or record that no clean coverage gap passes the candidate
  gate

### 2026-07-19T17:46:26Z — zh-TW localized acquisition candidate queued

- Record type: campaign-observation
- Experiments started: 0
- Active experiments: 1
- User direction: when a Chinese locale lacks a corresponding article and
  locale-specific demand evidence exists, treat that as a coverage gap worth
  filling
- Candidate:
  zh-TW localization of `/learn/wenlan-vs-obsidian-ai-memory`
- Candidate record:
  `docs/seo-audits/2026-07-19-localized-acquisition-gap.md`
- Candidate-gate result: PASS for queueing; modifier-qualified Obsidian plus
  Claude Code/MCP/agent-memory intent is supported by Taiwan Trends direction,
  repeated Reddit and OSS workflows, Traditional Chinese corroboration, and
  the existing English page's authenticated GSC impressions
- Rejected framing: generic `Obsidian` and generic `AI 筆記`; both remain too
  broad or mixed without Claude, agent, MCP, or durable-knowledge modifiers
- Locale scope: zh-TW only; no zh-CN demand evidence was established
- Technical prerequisite: replace the shared two-locale Learn slug assumption
  with actual per-locale availability before publishing, so static params,
  sitemap entries, locale switching, and hreflang never advertise a
  nonexistent zh-CN page
- Current-window result: queued, not active; no page, code, route, sitemap, or
  production change was made
- External actions: none
- Decision: wait for the active Claude Code memory experiment's predeclared
  readout; do not stack a second experiment
- Next step: at the next eligible weekly window, re-read fresh GSC evidence
  before selecting this candidate as the single experiment

### 2026-07-19T18:05:38Z — early 24h-heartbeat timing correction

- Record type: campaign-observation
- Experiment ID: `EXP-2026-07-18-claude-code-memory-refresh`
- Experiments started: 0
- Active experiments: 1
- Heartbeat received: `2026-07-19T18:00:08Z`
- Production completion: `2026-07-19T00:26:09Z`
- Elapsed at heartbeat: 17 hours 33 minutes 59 seconds
- Readout label: not-24h; this observation does not replace the pending 24h
  field in the immutable experiment-start record
- Contract gate: complete `PLAN.md` read; `pnpm seo:goal:check` passed
- Latest weekly evidence: read from
  `docs/seo-audits/2026-07-17-weekly-seo.md`; no duplicate weekly pipeline was
  run
- GSC: no reliable post-publish complete-day observation was available; no
  search result was inferred
- Vercel partial range: `2026-06-22..2026-07-19`, fetched
  `2026-07-19T18:01:59Z` while the final date was incomplete; raw 818 visitors
  and 970 pageviews; direct 230 visitors and 290 pageviews; 590
  qualified-source visitors summed across the existing separate referrer
  allowlist and not deduplicated; target page 5 visitors and 14 pageviews;
  unique acquisition-surface visitors unavailable from separate path rows
- Vercel custom events: account-gated, Pro or Enterprise required
- Umami: no authenticated report available
- GitHub: 47 total stars at the read-only REST observation; unchanged from the
  fixed baseline and not attributed to the page
- Live route: HTTP 200; canonical
  `https://wenlan.app/learn/claude-code-memory`; `index, follow`; visible
  native-memory-first copy; direct plugin command block; Article
  `datePublished=2026-06-07` and `dateModified=2026-07-18`
- Production render: desktop at 1280x720 rendered the expected title, packet,
  intro, and article structure with no horizontal overflow or console
  warnings; mobile DOM at 393x852 rendered the same H1, eight H2 sections, and
  install commands with no horizontal overflow or console warnings. The
  isolated mobile screenshot capture timed out after the successful DOM
  checks, so it is not claimed as image evidence.
- Production technical evidence: deployed robots passed; sitemap contained
  108 URLs; 13 key pages passed; six utility noindex headers passed;
  `FAQPage` remained absent across 108 sitemap pages; 25 redirects and six
  bridge-host redirects passed; old URLs remained absent from the sitemap
- Result: pending; this was an early technical observation, not enough elapsed
  time or Search evidence for a success/failure/inconclusive experiment verdict
- Decision: wait
- External actions: no content change, second experiment, publish, indexing
  request, validation, push, merge, deploy, or distribution
- Heartbeat correction: the same
  `wenlan-claude-memory-24h-readout` heartbeat is active for
  `2026-07-20T00:30:00Z` (`2026-07-19 17:30`
  America/Los_Angeles), after the actual 24-hour boundary
- Next step: run the actual 24h technical/evidence readout, then keep waiting
  and update the same heartbeat to the predeclared 7-day follow-up if the
  result remains inconclusive

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-18-claude-code-memory-refresh at 2026-07-20T00:35:13Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-18-claude-code-memory-refresh
- Observed at: 2026-07-20T00:35:13Z
- Readout: 24h
- Status: measuring
- Evidence: GSC `sc-domain:wenlan.app` for `2026-06-22..2026-07-19` reported 6 property clicks and 212 property impressions; its visible query table reported 0 clicks and 51 impressions, including 22 non-brand impressions under the existing Searchfit classification. The target page remained at 23 impressions, 0 clicks, and 38.7 average position, and its five visible Claude-memory queries remained at 9 impressions and 0 clicks. Separate one-day GSC requests for both `2026-07-18` and `2026-07-19` returned no query or page rows, so no post-publish search result is available and the zeros are treated as reporting latency rather than zero demand. Vercel's complete-date `2026-06-22..2026-07-19` range reported 854 raw visitors and 1,009 pageviews; direct reported 232 visitors and 293 pageviews; the existing search, AI, and GitHub qualified-source allowlist summed to 629 visitors without user deduplication; `/learn/claude-code-memory` reported 6 visitors and 16 pageviews. Unique acquisition-surface visitors and source-to-page sessions are unavailable from the separate aggregates. Vercel custom events remain Pro/Enterprise-gated and no authenticated Umami report was available, so GitHub outbound and CTA are unavailable. GitHub REST reported 47 total stars, unchanged from the fixed baseline and not attributed to the page. The deployed technical suite passed robots, 108 sitemap URLs, 13 English/zh-TW/zh-CN key pages, six utility noindex headers, sitemap-wide FAQPage absence, 25 redirects, six bridge-host redirects, and legacy-URL exclusions. The live English route returned HTTP 200 with its canonical, `index, follow`, Article JSON-LD, expected title, H1, eight H2 sections, visible install commands, no document-level horizontal overflow, and no console warning/error entries. A requested 393x852 browser override remained at the backend's 1280x720 viewport, so this readout claims desktop DOM render evidence only rather than inventing a mobile result.
- Result: inconclusive
- Decision: wait
- Next step: keep this as the only active experiment and run the 7-day readout after `2026-07-26T00:26:09Z`; do not start another experiment before that evidence window
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-23T06:15:22Z — idle-posture correction and next-asset preparation

- Record type: campaign-observation
- User correction: the exposure Goal must not treat a predeclared readout as
  permission to leave the next content candidate unprepared
- Goal API state: still reported `blocked`; repo control plane and the
  same-thread heartbeat had continued, so the controller state was
  inconsistent
- Contract gate: complete `PLAN.md` read; `pnpm seo:goal:check` passed before
  this campaign action
- GSC: `2026-06-24..2026-07-21` property totals were 6 clicks and 264
  impressions; visible query rows were 0 clicks and 64 impressions, leaving a
  6-click and 200-impression visibility gap; the target Claude Code memory
  page remained at 23 impressions, 0 clicks, and 38.7 average position
- Vercel: the same complete-date range reported 1,142 raw visitors and 1,313
  pageviews; direct reported 242 visitors and 305 pageviews; the existing
  qualified-source allowlist summed to 912 visitors without user
  deduplication; `/docs/configuration` reported 624 visitors,
  `/learn/mcp-memory-server` 224, and `/learn/claude-code-memory` 7
- GitHub: 47 total stars; the 14-day traffic endpoint reported 247 repository
  views from 46 unique visitors and 3,738 clones from 811 unique cloners.
  Clones are not setup starts, and none of these observations is attributed to
  the website.
- Measurement finding: site GitHub CTAs already emit Vercel custom events,
  but the plan is account-gated from reading them; tracked external links also
  use `noreferrer`, so GitHub referrer data cannot establish
  `wenlan.app`-to-repository visits
- Deterministic report:
  `/tmp/wenlan-weekly-seo-2026-07-22.md`
- Experiments started: 0
- Active experiments: 1
- Preparation decision: build and verify the already-gated zh-TW Obsidian plus
  Claude Code / agent-memory localization locally now, including
  locale-specific route, sitemap, and hreflang support; do not create zh-CN
- Launch decision: wait for the `2026-07-25..2026-07-31` window and read the
  Friday weekly report before selecting the window's single experiment
- External actions: no publish, push, merge, deploy, indexing request,
  validation, external post, or OSS submission

### 2026-07-23T06:39:32Z — queued zh-TW acquisition asset locally ready

- Record type: campaign-observation
- Experiments started: 0
- Active experiments: 1
- Candidate:
  `/zh-TW/learn/wenlan-vs-obsidian-ai-memory`
- Preparation result: complete locally, queued, not active, not published
- Demand provenance:
  `docs/seo-audits/2026-07-19-localized-acquisition-gap.md`; the asset keeps
  modifier-qualified Obsidian, Claude Code, MCP, and agent-memory intent rather
  than targeting generic `Obsidian` or generic `AI 筆記`
- Locale boundary: zh-TW only; per-locale availability drives static params,
  locale routing, sitemap, and alternates; the zh-CN counterpart is absent and
  verified as HTTP 404
- Source quality: visible official references include Obsidian data and plugin
  documentation, maintained Claudian and Obsidian MCP repositories, and
  Wenlan's core-concepts and data-and-privacy pages; the copy does not claim
  Obsidian sync
- Verification: `pnpm test:i18n` 52/52, `pnpm lint`, `pnpm build`,
  `pnpm seo:technical:built`, and the built-route i18n checker all passed; the
  latter verified 19 expected 200 routes and 5 expected 404 routes
- Render evidence:
  `/tmp/wenlan-visual-qa-2026-07-22-zhtw-obsidian`; final article captures used
  verified `1440x1200` and `393x852` CSS viewports. The mobile document
  reported `scrollWidth=393`, and the article, official references, CTA, FAQ,
  and Learn-card entry rendered without content clipping
- Launch decision: wait for the Friday weekly evidence and the
  `2026-07-25..2026-07-31` window; select this as the single launch only if no
  technical blocker or stronger impression-bearing existing-page action
  supersedes it
- External actions: no publish, push, merge, deploy, indexing request,
  validation, external post, or OSS submission

### 2026-07-23T14:32:13Z — zh-TW prelaunch contract drafted

- Record type: campaign-observation
- Experiments started this window: 0
- Active experiments: 1
- Candidate:
  `/zh-TW/learn/wenlan-vs-obsidian-ai-memory`
- Prelaunch record:
  `docs/seo-audits/2026-07-23-zhtw-obsidian-prelaunch.md`
- Prepared decision fields: source-native baseline, hypothesis, bounded change,
  5-GSC-page-impression minimum exposure, success/failure/inconclusive rules,
  stop criteria, and 24h/7d/W2/W4/W8 readouts
- Exposure proposal: after production verification, one separately approved
  Traditional Chinese owned-social post; Threads is the proposed first
  channel. Reddit, OSS submissions, paid acquisition, indexing requests, and
  GSC validation remain outside this proposal.
- Launch gate: read the 2026-07-24 weekly report, then choose this candidate
  only if no technical blocker or materially stronger impression-bearing
  existing-page action supersedes it
- Experiment state: queued and unpublished; no experiment-start record was
  appended and the `2026-07-25..2026-07-31` slot remains unused
- External actions: none
- Next step: run the contract verifier and diff check, then wait for the Friday
  report and explicit push, merge, deploy, and distribution approvals

### 2026-07-23T14:33:41Z — Goal API active-state reconciliation

- Record type: campaign-observation
- Codex Goal API status: active
- Prior mismatch: the API had continued to report the earlier
  approval-boundary `blocked` state after the user resumed the campaign
- Resolution: the live Goal controller and the repository control plane now
  agree that the campaign is active
- Experiments started this window: 0
- Active experiments: 1
- External actions: none
- Next step: keep the Goal active, read the 2026-07-24 weekly report, and make
  the predeclared 2026-07-25 single-experiment launch decision

### 2026-07-23T14:35:02Z — 7-day heartbeat launch-gate correction

- Record type: campaign-observation
- Automation:
  `wenlan-claude-memory-24h-readout`
- Schedule: unchanged at `2026-07-26T00:30:00Z`, after the 7-day boundary and
  the independent Friday weekly run
- Correction: the heartbeat no longer treats an inconclusive first experiment
  as an automatic reason to leave the next-window candidate inactive
- Required order: append the due 7-day readout first, then use the Friday
  report and
  `docs/seo-audits/2026-07-23-zhtw-obsidian-prelaunch.md` to evaluate the
  `2026-07-25..2026-07-31` single-experiment slot
- Approval boundary: without explicit approval, the heartbeat may select and
  report the candidate but must not append its experiment-start record, push,
  merge, deploy, publish the proposed Threads post, request indexing, submit
  validation, post to Reddit, submit OSS directories, or buy traffic
- Existing weekly automation: unchanged
- Experiments started this window: 0
- Active experiments: 1
- External actions: heartbeat instructions updated; no website, repository,
  indexing, or publication action
- Next step: wait for the Friday report and the scheduled combined readout plus
  launch-gate decision

### 2026-07-23T14:43:13Z — zh-TW owned-social unit locally ready

- Record type: campaign-observation
- Experiments started this window: 0
- Active experiments: 1
- Candidate experiment:
  `EXP-2026-07-25-zhtw-obsidian-localization`
- Draft:
  `docs/seo-audits/2026-07-23-zhtw-obsidian-threads-draft.md`
- Distribution shape: one standalone Traditional Chinese main post followed
  by a first reply containing the tagged canonical article link
- Voice evidence: the local Lucian Threads voice source requires direct,
  concrete Traditional Chinese, one job per post, no hashtags or em dash, and
  warns against placing a product explanation and external link inside the
  same main body
- Draft checks: main post is 461 characters including line breaks; no em dash,
  hashtag, or banned hype term appears in the extracted main-post text;
  article claims are tied to official Obsidian documentation, maintained
  Claudian and Obsidian MCP repositories, and Wenlan's maintained workflow
- Review synthesis: Gemini 3.1 Pro returned `ship`; Claude Opus 4.6 returned
  `revise` and its concrete opener, tool naming, natural wording, reply
  question, and author disclosure were adopted; GPT-OSS 120B returned `revise`
  but its forced product-term translations and promotional emoji CTA were
  rejected
- Observation plan: preserve exact post/reply text, URLs, timestamps, tagged
  URL, available Threads manual units, Vercel page/referrer aggregates, GSC
  page units, and GitHub stars separately without a causal claim
- Approval boundary: no post, reply, live conversation, push, merge, deploy,
  indexing request, validation, Reddit action, OSS submission, or paid
  acquisition is authorized by this preparation
- External actions: none
- Next step: at the 2026-07-25 launch gate, request one explicit website
  approval and one explicit main-post-plus-link-reply distribution approval

### 2026-07-23T14:50:03Z — zh-TW checkpoint verification complete

- Record type: campaign-observation
- Experiments started this window: 0
- Active experiments: 1
- Checkpoint scope: 16 modified or untracked files covering only the Trends
  interpretation, localized-candidate evidence, prelaunch and Threads drafts,
  mutable campaign state, the zh-TW article, per-locale availability,
  sitemap/hreflang/static params, official-reference rendering, and matching
  deterministic verifiers
- Independent review: `SHIP`; no correctness, SEO, locale, contract, or
  unrelated-scope blocker found
- Passing verification: `pnpm seo:goal:check`; `pnpm test:i18n` 52/52;
  `pnpm lint`; 45/45 affected built/deployed technical SEO tests;
  `pnpm build` with 209 generated static pages and no production IndexNow
  action; `pnpm seo:technical:built` with 109 sitemap URLs, 14 required URLs,
  14 checked HTML pages, and `FAQPage` absent from 113 HTML files; production
  build smoke test with 19 expected 200 routes and 5 expected 404 routes;
  `git diff --check`
- Render evidence: the unchanged final implementation remains represented by
  the verified 1440x1200 and 393x852 captures under
  `/tmp/wenlan-visual-qa-2026-07-22-zhtw-obsidian`; the mobile document width
  matched its 393px viewport
- Whole-suite caveat: with explicit sibling checkout roots, `pnpm test:seo`
  passed 64 tests and failed 5. Four failures are current source-fact drift
  outside this candidate (Wenlan 0.14.1/current desktop Remote Access versus
  website 0.13.2-era public facts); the fifth is the Node 24.11.1 native
  test-runner assertion in `scripts/seo-weekly.test.mjs`. The 45 tests covering
  this candidate's built/deployed technical checkers pass independently.
- External actions: none; no publish, push, merge, deploy, indexing request,
  validation, social post, Reddit action, OSS submission, or paid acquisition
- Next step: create a local-only Git checkpoint, then wait for the 2026-07-24
  weekly report and the explicit 2026-07-25 launch/distribution approvals

### 2026-07-23T14:52:42Z — approval-boundary campaign stop

- Record type: campaign-stop
- Stop condition: the same explicit external-action approval boundary blocked
  the next necessary exposure action for three consecutive resumed Goal turns
- Codex Goal API status: blocked
- Experiments started: 1
- Active experiments: 1
- Current experiment:
  `EXP-2026-07-18-claude-code-memory-refresh` remains measuring; its 24-hour
  result is inconclusive and its 7-day readout is not yet due
- Prepared next candidate:
  `EXP-2026-07-25-zhtw-obsidian-localization` remains queued, unpublished, and
  absent from the experiment-start ledger
- Local checkpoint: `9ea931f`
  (`seo: prepare zh-TW Obsidian acquisition experiment`), independently
  reviewed `SHIP`, with a clean worktree before this administrative record
- Attempted paths: authenticated GSC and Vercel evidence; GitHub stars; signed
  Google Trends exports with false-positive removal; Reddit, OSS, and
  Traditional Chinese candidate corroboration; zh-TW article and per-locale
  routing; sitemap/hreflang/404 verification; desktop/mobile rendered QA;
  predeclared experiment fields; exact Threads main post and link reply;
  three-model copy review; local-only Git checkpoint
- Evidence status: the candidate passed the five-part gate and all affected
  technical checks. The whole SEO suite still exposes four unrelated current
  source-fact drift failures plus one Node 24 test-runner crash, recorded in
  the preceding checkpoint observation.
- Heartbeat:
  `wenlan-claude-memory-24h-readout` paused while the Goal is blocked
- Existing weekly automation:
  `weekly-origin-seo-cleanup` remains ACTIVE and unchanged
- External actions: none; no publish, push, merge, deploy, indexing request,
  validation, social post, Reddit action, OSS submission, or paid acquisition
- Blocker: no explicit approval was granted for the prepared website
  push/merge/deploy or the exact Threads main-post-plus-link-reply unit
- Next user decision: approve the website action, approve the distribution
  unit, or approve both; any approval resumes this Goal as a fresh blocked
  audit and requires reading the latest Friday evidence before launch

### 2026-07-23T14:57:22Z — scope correction and website-action approval

- Record type: campaign-resume
- Experiments started this window: 0
- Active experiments: 1
- User scope correction: Threads and all owned-social work are outside this
  campaign; this controller is responsible only for website SEO
- Historical ledger entries mentioning a Threads draft remain unchanged
  because this file is append-only; this record supersedes those proposed
  actions
- Removed current Threads draft:
  `docs/seo-audits/2026-07-23-zhtw-obsidian-threads-draft.md`
- SEO-only exposure lane: localized Learn hub, canonical sitemap/hreflang, and
  contextual links from the two existing zh-TW wiki pages
- Approval granted: push, merge, and production deploy for the prepared
  website candidate
- Approval not granted: Threads, Reddit or other external publication, OSS
  submission, paid acquisition, request indexing, or GSC validation
- Launch state: queued, not active; do not consume the
  `2026-07-25..2026-07-31` slot until the 2026-07-24 weekly evidence is read
- Next step: verify and publish a GitHub PR for the website candidate, then
  wait for the Friday evidence and 2026-07-25 launch gate before merge/deploy
- Follow-up controller: `wenlan-claude-memory-24h-readout` reactivated with an
  SEO-only prompt for the 7-day readout and next launch gate

### 2026-07-23T15:06:26Z — SEO-only website candidate published as draft PR

- Record type: campaign-observation
- Experiments started this window: 0
- Active experiments: 1
- Clean branch: `agent/zhtw-obsidian-seo`
- Candidate commit: `0a0d183`
- Draft PR: `https://github.com/7xuanlu/wenlan-site/pull/58`
- GitHub merge state at observation: `MERGEABLE`, `CLEAN`
- Vercel PR checks: preview deployment and preview comments both succeeded
- Production state: not merged and not production-deployed
- Scope: website SEO only; the branch and PR contain no Threads draft
- Next step: read the 2026-07-24 weekly evidence and apply the predeclared
  2026-07-25 launch gate before merge or production deploy

### 2026-07-23T15:14:19Z — immediate website launch correction

- Record type: campaign-correction
- User correction: there is no technical reason to delay the verified website
  candidate; the weekly reporting boundary must not block direct merge
- Supersedes: the proposed `2026-07-25` launch gate and the earlier instruction
  to keep the Claude Code memory experiment as the only active experiment
- Contract change: weekly windows remain reporting boundaries, but no longer
  cap verified and explicitly approved website launches
- Caps retained: at most two active experiments and at most one net-new search
  asset in any 14-calendar-day period
- Approval: website push, merge, and production deploy remain explicitly
  approved; no external publication or indexing action was added
- Next step: start the zh-TW experiment, merge PR #58, and verify production

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-23-zhtw-obsidian-localization

- Record type: experiment-start
- Experiment ID: EXP-2026-07-23-zhtw-obsidian-localization
- Status: approved
- Data window: 2026-07-18..2026-07-24
- Asset class: net-new-search
- Launched: 2026-07-23
- Hypothesis: Publishing the modifier-qualified zh-TW counterpart will create measurable Traditional Chinese search exposure and a useful path to GitHub without fabricating zh-CN coverage.
- Candidate evidence: Taiwan Google Trends observations, repeated Reddit and OSS workflows, Traditional Chinese corroboration, the English page's authenticated GSC impressions, and the clean localized coverage gap recorded in `docs/seo-audits/2026-07-19-localized-acquisition-gap.md`.
- Baseline: GSC `sc-domain:wenlan.app` for `2026-06-24..2026-07-21` reported 6 property clicks and 264 impressions; visible query rows reported 0 clicks and 64 impressions; the English Obsidian page reported 0 clicks, 4 impressions, and average position 4.5; Vercel reported 1,142 property visitors, 6 `/zh-TW` visitors, 1 `/zh-TW/learn` visitor, and 3 English Obsidian-page visitors; GitHub reported 47 total stars; Umami outbound remained unavailable.
- Change: Publish only the prepared zh-TW route, localized Learn-hub entry, contextual links from the two existing zh-TW wiki pages, per-locale static params, sitemap, locale switching, and hreflang support; keep the unsupported zh-CN route as a hard 404.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 5 GSC page impressions within the first 28 complete post-index days
- Success criteria: After at least 5 GSC page impressions, the route earns at least 1 GSC click or average position is 20.0 or better; report Vercel page visitors and GitHub stars separately without a causal claim.
- Failure criteria: After 28 complete post-index days and at least 5 GSC page impressions, the route has 0 clicks and average position is worse than 20.0; fewer than 5 impressions is inconclusive.
- Stop criteria: Stop or hold if an official source becomes invalid; a canonical, indexing, robots, noindex, redirect, structured-data, sitemap, or locale regression appears; or the unsupported zh-CN route leaks into static params or hreflang.
- 24h readout: pending — verify live 200, canonical, indexability, sitemap and hreflang, zh-CN 404, production render, and separate Vercel/GitHub observations without an SEO-success judgment
- 7d readout: pending — report indexing latency, GSC page impressions/clicks/position when available, Vercel page visitors, and stars separately
- W2 readout: pending — apply the minimum-exposure guard and inspect English, zh-TW, and zh-CN acquisition surfaces for regressions
- W4 readout: pending — evaluate the predeclared success, failure, or inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains useful
- Result: pending
- Decision: merge
- Next step: Mark PR #58 ready, merge it, verify production, and append the production completion evidence.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-23-zhtw-obsidian-localization at 2026-07-23T15:20:40Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-23-zhtw-obsidian-localization
- Observed at: 2026-07-23T15:20:40Z
- Readout: correction
- Status: live
- Evidence: PR #58 merged at `2026-07-23T15:18:29Z` as `7166bad1e3020bac60c9454780d2b732e17e4242`; Vercel production completed at `2026-07-23T15:19:18Z`. The deployed technical audit passed robots, 109 sitemap URLs, 14 key pages, six utility noindex headers, sitemap-wide FAQPage absence, 25 redirects, six bridge-host redirects, and legacy-URL exclusions. The live zh-TW route returned HTTP 200 with the exact canonical, expected title and H1, visible maintained-source links, no framework overlay or console warnings, and no horizontal overflow at 393px. The unsupported zh-CN route returned HTTP 404, and the live sitemap contained the zh-TW route without a zh-CN counterpart. No search-performance result is inferred at production completion.
- Result: pending
- Decision: wait
- Next step: Run the 24-hour technical/evidence readout after `2026-07-24T15:19:18Z`; waiting for that measurement does not block other eligible website work.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-24T18:37:21Z — production-throughput correction

- Record type: campaign-correction
- User approval: proceed with the proposed SEO-only website work and correct
  the Goal rules that had turned measurement into an idle period
- Contract change: replace the two-active-experiment and 14-day net-new limits
  with one production-in-flight website change; production-verified `live`,
  `measuring`, and `extended` cohorts retain their readouts without blocking
  another eligible change
- Article cadence: no fixed quota; a net-new asset still requires the complete
  candidate gate, a production-verified preceding change, and a non-overlapping
  intent
- Latest evidence read: authenticated weekly GSC and Vercel exports for
  `2026-06-26..2026-07-23`, regenerated as
  `docs/seo-audits/2026-07-24-weekly-seo.md`
- Experiments started before this record: 2
- Active experiments before this record: 2
- External actions: none
- Next step: refresh the existing indexed English AI work memory versus
  knowledge base page, verify it locally, and surface the Git publish boundary

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-24-ai-work-memory-knowledge-base-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-07-24-ai-work-memory-knowledge-base-refresh
- Status: approved
- Data window: 2026-07-18..2026-07-24
- Asset class: refresh
- Launched: 2026-07-24
- Hypothesis: A more direct title, first answer, and source-backed role comparison on the existing indexed page will earn qualified exposure or clicks for AI work memory and AI knowledge-base intent without adding another URL.
- Candidate evidence: The authenticated `2026-06-26..2026-07-23` GSC page table reports 9 impressions, 0 clicks, and average position 8.0 for `/learn/ai-work-memory-vs-knowledge-base`; the weekly Searchfit queue recommends a title/meta/intro/quick-answer refresh; the cleaned Google Trends work retains modifier-qualified AI knowledge-base intent as a secondary cluster; Wenlan v0.14.1's maintained README documents distinct Source, Memory, and Page roles with a real capture, recall, handoff, and distill workflow.
- Baseline: GSC `sc-domain:wenlan.app` reported 7 property clicks and 310 property impressions; visible query rows reported 1 click and 75 impressions, leaving a 6-click and 235-impression visibility gap; the target page reported 0 clicks, 9 impressions, and average position 8.0; Vercel reported 1,402 visitors and 1,593 pageviews, while the target page was absent from the top-page export and no zero was inferred; GitHub reported 47 total stars; Umami and Vercel custom CTA events remained unavailable or account-gated.
- Change: Refresh only `/learn/ai-work-memory-vs-knowledge-base` in English: title, metadata, first answer, Source/Memory/Page boundary, comparison table, maintained first-party sources, contextual internal links, and visible FAQ copy; create no new URL, Mandarin translation, FAQPage JSON-LD, or external distribution.
- Publish date: not-published
- Index date: indexed-before-2026-07-24-date-unavailable
- Minimum exposure: 20 GSC page impressions in the first 28 complete post-deploy days
- Success criteria: After at least 20 GSC page impressions, the page earns at least 1 GSC click or average position is 5.0 or better; report Vercel page visitors, GitHub outbound when available, and stars separately without a causal claim.
- Failure criteria: After 28 complete post-deploy days and at least 20 GSC page impressions, the page has 0 clicks and average position is worse than the 8.0 baseline; fewer than 20 impressions is inconclusive.
- Stop criteria: Stop or hold if a first-party source becomes invalid; a canonical, indexing, robots, noindex, redirect, structured-data, sitemap, or locale regression appears; another controller edits the same page; or the refreshed page overlaps another acquisition route instead of clarifying its distinct intent.
- 24h readout: pending — verify live 200, title, description, canonical, indexability, structured data, source links, production render, and separate source-native observations without an SEO-success judgment
- 7d readout: pending — report GSC latency, target-page clicks, impressions and position when available, Vercel page visitors, and stars separately
- W2 readout: pending — apply the minimum-exposure guard and inspect the related AI work memory, LLM wiki, Obsidian, and Basic Memory routes for intent overlap
- W4 readout: pending — evaluate the predeclared success, failure, or inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains useful
- Result: pending
- Decision: wait
- Next step: finish local content, test, build, technical, and rendered verification, then request explicit push, merge, and production-deploy approval.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-24T18:46:11Z — knowledge-base refresh locally verified

- Record type: campaign-observation
- Experiments started: 3
- Active experiments: 3
- Production-in-flight changes: 1
- Current change:
  `EXP-2026-07-24-ai-work-memory-knowledge-base-refresh`
- Evidence: `pnpm test:seo` 174/174; `pnpm test:i18n` 52/52;
  `pnpm lint`; `pnpm seo:goal:check`; `pnpm build` with 209 static pages;
  built technical SEO with 109 sitemap URLs, 14 checked HTML pages, and no
  `FAQPage` in 113 built HTML files; built i18n smoke with 19 direct-200 and 5
  hard-404 routes; current-production technical SEO; `git diff --check`
- Render evidence: refreshed article at 1440×1000 and 393×852; all six
  English, Simplified Chinese, and Traditional Chinese About/Get Started pages
  at 393×852; 1200×630 About social image. Expected title, metadata, canonical,
  release version, localized dates, and current Remote Access instructions
  were present with no document overflow, framework overlay, or console error.
  Evidence remains under
  `/tmp/wenlan-seo/visual-qa/2026-07-24-growth-unblock/`.
- Publish date: still `not-published`
- External actions: none; no push, merge, deployment, indexing request,
  validation, external post, OSS submission, or paid acquisition
- Next step: request explicit approval for Git push, merge, and production
  deploy; after production verification, mark the experiment `live` or
  `measuring` and free the production slot

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-ai-work-memory-knowledge-base-refresh at 2026-07-24T18:55:26Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-ai-work-memory-knowledge-base-refresh
- Observed at: 2026-07-24T18:55:26Z
- Readout: correction
- Status: live
- Evidence: PR #60 merged at `2026-07-24T18:53:32Z` as `f8b8adc9dc0cbbcb40c74f8928676d142268f643`; Vercel production completed at `2026-07-24T18:54:22Z`. The live route returned HTTP 200 with the refreshed title and H1, exact canonical, `index, follow`, Article JSON-LD, maintained source links, visible role-comparison copy, no `FAQPage`, no mobile document overflow, and no console warning or error. The deployed technical audit passed robots, 109 sitemap URLs, 14 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL exclusions. No search-performance result is inferred at production completion.
- Result: pending
- Decision: wait
- Next step: Run the 24-hour technical/evidence readout after `2026-07-25T18:54:22Z`; this measurement cohort does not consume the production slot or block another eligible website change.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-24-learn-hub-exposure-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-07-24-learn-hub-exposure-refresh
- Status: approved
- Data window: 2026-07-18..2026-07-24
- Asset class: integration-hub
- Launched: 2026-07-24
- Hypothesis: A direct LLM-wiki and AI-memory category answer plus evidence-ranked search paths on the existing English Learn hub will earn more qualified Google exposure or clicks and send more visitors into Wenlan's strongest existing guides without adding another URL.
- Candidate evidence: Authenticated GSC reports 71 impressions, 0 clicks, and average position 15.6 for `/learn`; same-range Vercel reports 98 visitors and 100 pageviews for the route; the reviewed exposure-first design names the Learn integration/workflow hub as the first backlog item; cleaned Trends, Reddit, OSS, and current GSC evidence validate Claude Code memory, LLM wiki, Basic Memory comparison, and MCP memory as distinct existing-page paths. The evidence sources retain their native units and are not joined or treated as keyword volume.
- Baseline: GSC `sc-domain:wenlan.app` for `2026-06-26..2026-07-23` reported 7 property clicks and 310 property impressions; visible query rows reported 1 click and 75 impressions, leaving a 6-click and 235-impression visibility gap; `/learn` reported 0 clicks, 71 impressions, and average position 15.6. Vercel separately reported 1,402 visitors and 1,593 pageviews property-wide and 98 visitors and 100 pageviews for `/learn`; no source-to-page sessions are inferred. GitHub reported 47 total stars. Umami and Vercel custom CTA events remained unavailable or account-gated.
- Change: Refresh only the English `/learn` metadata, first-screen answer, and existing popular-search-path cards. Lead with Claude Code memory, Basic Memory comparison, MCP memory server, and LLM wiki for AI agents; keep the complete article grid, existing canonical and locale alternates, and bottom GitHub/setup CTA. Create no new URL, Mandarin translation, schema type, FAQPage JSON-LD, or external distribution.
- Publish date: not-published
- Index date: indexed-before-2026-07-24-date-unavailable
- Minimum exposure: 100 GSC `/learn` page impressions in the first 28 complete post-deploy days
- Success criteria: After at least 100 GSC `/learn` page impressions, the page earns at least 1 GSC click or average position is 12.0 or better; report Vercel page visitors, GitHub outbound when available, and stars separately without a causal claim.
- Failure criteria: After 28 complete post-deploy days and at least 100 GSC `/learn` page impressions, the page has 0 clicks and average position is worse than the 15.6 baseline. Fewer than 100 impressions is inconclusive; after minimum exposure, 0 clicks with average position from 12.1 through 15.6 is also inconclusive as no material change.
- Stop criteria: Stop or hold if a canonical, indexing, robots, noindex, structured-data, sitemap, locale, or rendered-layout regression appears; another controller edits the same hub; the search paths overlap or contradict an active article; or maintained Wenlan proof no longer supports the category answer.
- 24h readout: pending — verify live 200, title, description, canonical, locale alternates, CollectionPage and BreadcrumbList JSON-LD, search-path links, production render, and separate source-native observations without an SEO-success judgment
- 7d readout: pending — report GSC latency, `/learn` clicks, impressions and position when available, Vercel page visitors, and stars separately
- W2 readout: pending — apply the minimum-exposure guard and inspect English, zh-TW, and zh-CN Learn surfaces plus linked Claude Code, Basic Memory, MCP memory, and LLM-wiki pages for overlap or regression
- W4 readout: pending — evaluate the predeclared success, failure, or inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains useful
- Result: pending
- Decision: wait
- Next step: Prepare the bounded English Learn-hub change, run focused and full SEO/i18n/build/technical/rendered checks, and then request explicit Git push, merge, and production-deploy approval.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-24T19:13:30Z — Learn hub refresh locally verified

- Record type: campaign-observation
- Current change: `EXP-2026-07-24-learn-hub-exposure-refresh`
- Production-in-flight changes: 1
- Scope: English `/learn` metadata, CollectionPage description, H1, direct
  quick answer, and nine existing search-path cards; Goal fixtures and focused
  SEO assertions updated; no URL, Mandarin content, sitemap, canonical,
  locale-availability, schema-type, or CTA change
- Focused verification: the Learn-index assertion failed before implementation
  and passed after the bounded change
- Full verification: `pnpm test:seo` 174/174; `pnpm test:i18n` 52/52;
  `pnpm lint`; `pnpm seo:goal:check`; `pnpm build` with 209 static pages;
  built technical SEO with 109 sitemap URLs, 26 redirects, seven noindex
  headers, 14 checked HTML pages, and no `FAQPage` in 113 built HTML files;
  production-build i18n smoke with 19 expected direct-200 routes and five
  expected hard-404 routes; current-production deployed technical SEO;
  `git diff --check`
- Linked-path verification: `/learn`, its nine promoted destination routes,
  `/zh-TW/learn`, and `/zh-CN/learn` all returned local production-build HTTP
  200
- Render evidence: desktop 1440×1000 and mobile 393×852 English Learn checks
  confirmed the title, description, exact canonical, `index, follow`,
  reciprocal locale alternates, BreadcrumbList and CollectionPage JSON-LD,
  quick answer, ranked search paths, no `FAQPage`, no framework error overlay,
  and no document or H1 overflow. Mobile zh-TW and zh-CN Learn checks retained
  their localized titles, H1s, self-canonicals, and overflow-safe layouts.
  Screenshots are under
  `/tmp/wenlan-seo/visual-qa/2026-07-24-learn-hub-exposure/`.
- Independent review: initial `fix-first` found a neutral outcome band; the
  experiment now classifies 0 clicks with average position 12.1 through 15.6
  after minimum exposure as inconclusive. No other blocker was found.
- Publish date: still `not-published`
- External actions: none; no push, merge, deployment, indexing request,
  validation, external post, OSS submission, or paid acquisition
- Next step: request explicit Git push, merge, and production-deploy approval

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-learn-hub-exposure-refresh at 2026-07-24T19:21:10Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-learn-hub-exposure-refresh
- Observed at: 2026-07-24T19:21:10Z
- Readout: correction
- Status: live
- Evidence: PR #62 merged at `2026-07-24T19:17:15Z` as `e8c089a0391795e778b2e02f1bd11355fda4e4e8`; Vercel production completed at `2026-07-24T19:18:03Z`. The deployed technical audit passed robots, 109 sitemap URLs, 14 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL exclusions. The live English `/learn` route returned HTTP 200 with the refreshed title, description, H1, quick answer, exact canonical, `index, follow`, reciprocal locale alternates, BreadcrumbList and CollectionPage JSON-LD, and all nine acquisition links. The English, zh-TW, and zh-CN Learn hubs and all promoted destinations returned HTTP 200; rendered checks found no `FAQPage`, document overflow, framework error, console warning, or console error. No search-performance result or causal effect is inferred at production completion.
- Result: pending
- Decision: wait
- Next step: Run the 24-hour technical/evidence readout after `2026-07-25T19:18:03Z`; this measurement cohort does not consume the production slot or block another eligible website change.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-24-llm-wiki-category-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-07-24-llm-wiki-category-refresh
- Status: approved
- Data window: 2026-07-18..2026-07-24
- Asset class: refresh
- Launched: 2026-07-24
- Hypothesis: A clearer LLM-wiki-for-AI-agents title, concrete capture-to-page workflow, source-backed maintenance model, and explicit boundary from code or repository search on the existing indexed page will earn more qualified exposure or clicks for the validated LLM-wiki category without adding another URL.
- Candidate evidence: The authenticated `2026-06-26..2026-07-23` GSC page table reports 2 impressions, 0 clicks, and average position 3.5 for `/learn/distilled-wiki-pages-ai-memory`; the separate visible query `llm wiki 2.0` reports 1 impression, 0 clicks, and average position 13.0 and is not joined to that page row. Signed official Google Trends Explore captures recorded `LLM wiki` moving `0.7 → 3.8` and `1.6 → 15.2` in separate request-relative Worldwide 0–100 series, with clean related queries around Karpathy, GitHub, Obsidian, Claude Code, Codex, `llm wiki skill`, and `llm wiki v2`; these indices are not search volume and are not compared across requests. The maintained Wenlan repository at `93451bf0ef58399e08400e3b4ac613942adcfec8` documents the Source/Memory/Page model and the real `/capture`, `/distill`, and page-opening workflow. The target page's last substantive category copy was published on 2026-07-04, leaving a clean existing-page refresh seam.
- Baseline: GSC `sc-domain:wenlan.app` reported 7 property clicks and 310 property impressions; visible query rows reported 1 click and 75 impressions, leaving a 6-click and 235-impression visibility gap; the target page reported 0 clicks, 2 impressions, and average position 3.5; the separate visible query `llm wiki 2.0` reported 0 clicks, 1 impression, and average position 13.0. Vercel separately reported 1,402 visitors and 1,593 pageviews property-wide and 4 visitors and 4 pageviews for the target route; no source-to-page sessions are inferred. GitHub reported 47 total stars. Umami and Vercel custom CTA events remained unavailable or account-gated.
- Change: Refresh only `/learn/distilled-wiki-pages-ai-memory` in English: title, metadata, first answer, concrete `/capture` → `/distill` → `/pages` workflow, source-backed maintenance explanation, boundary from code and repository search, maintained references, and visible FAQ copy. Create no new URL, Mandarin translation, schema type, `FAQPage` JSON-LD, CTA change, or external distribution.
- Publish date: not-published
- Index date: indexed-before-2026-07-24-date-unavailable
- Minimum exposure: 10 GSC target-page impressions in the first 28 complete post-deploy days
- Success criteria: After at least 10 GSC target-page impressions, the page earns at least 1 GSC click or keeps average position at 5.0 or better; report Vercel page visitors, GitHub outbound when available, and stars separately without a causal claim.
- Failure criteria: After 28 complete post-deploy days and at least 10 GSC target-page impressions, the page has 0 clicks and average position is worse than 6.0. Fewer than 10 impressions is inconclusive; after minimum exposure, 0 clicks with average position from 5.1 through 6.0 is also inconclusive as no material outcome.
- Stop criteria: Stop or hold if maintained Wenlan sources no longer support the workflow or boundary; a canonical, indexing, robots, noindex, structured-data, sitemap, locale, or rendered-layout regression appears; another controller edits the same route; or the refreshed page overlaps the source-backed-wiki trust-mechanics route instead of keeping a distinct category-and-workflow intent.
- 24h readout: pending — verify live 200, title, description, canonical, indexability, Article and BreadcrumbList JSON-LD, maintained references, production render, and separate source-native observations without an SEO-success judgment
- 7d readout: pending — report GSC latency, target-page clicks, impressions and position when available, Vercel page visitors, and stars separately
- W2 readout: pending — apply the minimum-exposure guard and inspect the related source-backed wiki, knowledge-base, Obsidian, and MCP-memory routes for intent overlap
- W4 readout: pending — evaluate the predeclared success, failure, or inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains useful
- Result: pending
- Decision: wait
- Next step: finish local content, focused RED-to-GREEN assertion, full SEO/i18n/lint/build/technical checks, independent review, and rendered verification; then request explicit push, merge, and production-deploy approval.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-24T19:58:47Z — LLM-wiki category refresh locally verified

- Record type: campaign-observation
- Current change: `EXP-2026-07-24-llm-wiki-category-refresh`
- Production-in-flight changes: 1
- Scope: English `/learn/distilled-wiki-pages-ai-memory` title, metadata,
  first answer, `/capture` to `/distill` to `/pages` workflow, code/repository
  search boundary, maintained references, and visible FAQ copy; original
  `2026-06-24` publication date retained and `2026-07-24` modification date
  recorded; no URL, Mandarin content, schema type, `FAQPage`, CTA, or external
  distribution change
- Focused verification: the category/workflow assertion failed before
  implementation and passed after the bounded content change; a separate
  mobile-readability assertion failed before the command hint was shortened
  and passed after; the independent review's intent-collision assertions now
  lock the LLM-wiki category page apart from the source-backed trust-mechanics
  route
- Full verification: `pnpm test:seo` 174/174; `pnpm test:i18n` 52/52;
  `pnpm lint`; `pnpm seo:goal:check`; `pnpm build` with 209 static pages;
  built technical SEO with 109 sitemap URLs, 14 checked HTML pages, and no
  `FAQPage` in 113 built HTML files; built i18n smoke with 19 direct-200 and
  5 hard-404 routes; current-production deployed technical SEO;
  `git diff --check`
- Final local HTML: title, description, exact canonical, reciprocal English,
  zh-TW, and zh-CN hreflang, `index, follow`, Article and BreadcrumbList
  JSON-LD, `datePublished: 2026-06-24`, `dateModified: 2026-07-24`, shortened
  workflow command, and `FAQPage` absence passed; SHA-256
  `c1daab8e4ebd4e2cde236e8936babc191a3e1a591f042d8cd3b8e20afea4edd7`
- Render evidence: desktop 1440×1000 and mobile 393×852 confirmed the expected
  H1, first-screen answer, workflow copy, no document or H1 overflow, no
  workflow-code horizontal scroll after the correction, no framework overlay,
  and no browser warning or error. Screenshots are under
  `/tmp/wenlan-seo/visual-qa/2026-07-24-llm-wiki-category/`.
- Independent review: initial `fix-first` findings for stale temporary HTML,
  obsolete raw-Trends wording, and missing intent-separation assertions were
  corrected; re-review verdict is `SHIP` with no remaining blocker.
- Publish date: still `not-published`
- External actions: none; no push, merge, deployment, indexing request,
  validation, external post, OSS submission, or paid acquisition
- Next step: request explicit approval for Git push, merge, and production
  deploy

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-23-zhtw-obsidian-localization at 2026-07-24T20:10:06Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-23-zhtw-obsidian-localization
- Observed at: 2026-07-24T20:10:06Z
- Readout: 24h
- Status: measuring
- Evidence: The latest authenticated weekly range is `2026-06-26..2026-07-23`: GSC property totals are 7 clicks and 310 impressions; visible-query totals are 1 click and 75 impressions; the query visibility gap is 6 clicks and 235 impressions. The zh-TW target is absent from the GSC page table, so no zero is inferred; the range ends on the launch date and provides neither a confirmed index date nor a complete post-launch search cohort. The stale indexing snapshot was last updated on `2026-07-09`: 77 indexed URLs, 40 not indexed, 9 pages with redirect, 1 excluded by `noindex`, 1 alternate page with proper canonical, 27 discovered but not indexed, and 2 crawled but not indexed. Search Console last read the sitemap on `2026-07-03` with 101 discovered URLs, while the live sitemap has 109 URLs, so the target's indexing status remains unconfirmed. Vercel separately reports 1,402 visitors and 1,593 pageviews property-wide, 255 direct visitors and 319 direct pageviews, and a 1,149-visitor qualified-source aggregate that is not deduplicated. The target has 1 visitor and 2 pageviews in the same range, but that range includes only part of its launch day and is not a complete post-deploy 24-hour cohort. No source-to-page join or causal inference is made. GitHub REST reports 47 total stars. Vercel custom events remain account-gated and no authenticated Umami observation is available, so GitHub outbound and CTA are not reported. The live target returned HTTP 200 with its exact canonical, `index, follow`, `en-US`, `zh-TW`, and `x-default` alternates, Article and BreadcrumbList JSON-LD, visible maintained source links, and no `FAQPage`; the sitemap includes the zh-TW URL and excludes the unsupported zh-CN counterpart, which returned HTTP 404. The deployed technical audit passed 109 sitemap URLs, 14 key pages, noindex policy, redirects, bridge hosts, and legacy exclusions. Desktop 1440×1000 and mobile 393×852 renders showed the expected title and H1, seven maintained-source links, no document or H1 overflow, no framework overlay, and no console warning or error. Render evidence is under `/tmp/wenlan-seo/visual-qa/2026-07-24-zhtw-obsidian-24h/`.
- Result: pending
- Decision: wait
- Next step: Run the 7-day readout after `2026-07-30T15:19:18Z`; apply no success or failure judgment until the target has a confirmed indexing context and reaches the predeclared 5-impression minimum exposure.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-24T20:16:19Z — LLM-wiki website publication approved

- Record type: campaign-approval
- Approval: the user explicitly approved Git push, merge, and production
  deploy for `EXP-2026-07-24-llm-wiki-category-refresh`
- Approved external actions: push, merge, and deploy only for the current
  website experiment and its production evidence record
- Still approval-gated: Reddit or other external publication, OSS submission,
  paid acquisition, request indexing, GSC validation, and metric-definition
  changes
- Verification at approval: `pnpm test:seo` passed 174/174 with explicit
  Wenlan and wenlan-app checkout roots; `pnpm test:i18n` passed 52/52;
  `pnpm lint`, `pnpm seo:goal:check`, `pnpm build`,
  `pnpm seo:technical:built`, and `git diff --check` passed
- Next step: commit the reviewed scope, push the current branch, merge its PR,
  wait for Vercel production, and verify the live LLM-wiki page

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-llm-wiki-category-refresh at 2026-07-24T20:23:04Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-llm-wiki-category-refresh
- Observed at: 2026-07-24T20:23:04Z
- Readout: correction
- Status: live
- Evidence: PR #63 merged at `2026-07-24T20:18:36Z` as `73c3f0d6a2d7937408df1d297ef0607bd2637fcd`; Vercel production completed at `2026-07-24T20:19:21Z`. The live route returned HTTP 200 with the refreshed title and H1, exact canonical, `index, follow`, reciprocal `en-US`, `zh-TW`, `zh-CN`, and `x-default` alternates, Article and BreadcrumbList JSON-LD, `datePublished: 2026-06-24`, `dateModified: 2026-07-24`, the visible `/capture` to `/distill` to `/pages` workflow, code/repository-search boundary, and maintained Wenlan and LLM-wiki references. No `FAQPage` is present. The deployed technical audit passed robots, 109 sitemap URLs, 14 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL exclusions. Desktop 1440×1000 and mobile 393×852 renders showed the expected content with no document, H1, or workflow overflow, framework overlay, console warning, or console error. Render evidence is under `/tmp/wenlan-seo/visual-qa/2026-07-24-llm-wiki-production/`. No search-performance result or causal effect is inferred at production completion.
- Result: pending
- Decision: wait
- Next step: Run the 24-hour technical/evidence readout after `2026-07-25T20:19:21Z`; this production-verified measurement cohort does not block another eligible website change.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-24T20:42:43Z — localized Learn BreadcrumbList correction locally verified

- Record type: campaign-observation
- Current change: `TECH-2026-07-24-localized-learn-breadcrumb`
- Production-in-flight changes: 1
- Production-before evidence: localized zh-TW and zh-CN Learn articles
  returned HTTP 200 with localized home and article BreadcrumbList items, but
  item 2 incorrectly pointed to the English `https://wenlan.app/learn` hub
- Scope: use `canonicalUrl(resolvedLocale, "/learn")` for localized Article
  BreadcrumbList item 2 and add a focused regression test; no visible copy,
  URL, canonical, hreflang, sitemap, locale availability, schema type, or
  `FAQPage` change
- Focused verification: the new contract failed against the hard-coded
  English ancestor and passed after the one-line implementation fix
- Full verification: `pnpm test:i18n` 53/53; `pnpm test:seo` 174/174 with
  explicit Wenlan and wenlan-app roots; `pnpm lint`;
  `pnpm seo:goal:check`; `pnpm build` with 209 static pages;
  `pnpm seo:technical:built`; `pnpm i18n:technical:built`; and
  `git diff --check`
- Built evidence: zh-TW and zh-CN article BreadcrumbList item 2 now points to
  the corresponding localized Learn hub; all 19 expected direct-200 and five
  expected hard-404 locale routes passed
- Render evidence: zh-TW and zh-CN at 393×852 retained localized title and H1,
  no document overflow, no framework overlay, and no console warning or error;
  screenshots are under
  `/tmp/wenlan-seo/visual-qa/2026-07-24-localized-breadcrumb/`
- Content decision: no new title/meta experiment starts from the weekly top
  three because the report keeps them inside recent measurement windows and
  current query/demand evidence is insufficient for another rewrite
- External actions: none; no push, merge, deploy, indexing request, validation,
  external post, OSS submission, paid acquisition, or metric change
- Next step: finish independent review, then request explicit approval for Git
  push, merge, and production deploy of this technical correction

### 2026-07-24T20:44:38Z — localized Learn breadcrumb independent review

- Record type: campaign-observation
- Current change: `TECH-2026-07-24-localized-learn-breadcrumb`
- Independent review: `SHIP` with no findings
- Review evidence: production reproduces the English Learn ancestor for both
  zh-TW and zh-CN; the local build emits the corresponding localized Learn
  ancestor; English remains `/learn`; Article `isPartOf`, `inLanguage`,
  sitemap membership, locale availability, and visible rendering remain
  unchanged
- Test assessment: the positive localized-helper assertion and explicit
  rejection of the former hard-coded expression adequately guard the defect
- External actions: none
- Next step: request explicit approval for Git push, merge, and production
  deploy; indexing and non-website publication remain separately gated

### 2026-07-24T20:51:29Z — localized Learn breadcrumb production verified

- Record type: campaign-observation
- Current change: `TECH-2026-07-24-localized-learn-breadcrumb`
- Approval: the user explicitly approved Git push, merge, and production
  deployment for this correction in the current Codex task
- Publication: PR #65 merged at `2026-07-24T20:47:55Z` as
  `7f54c64a46d48e1d5f0f4d619bdd5a61aaba75dd`; Vercel production completed at
  `2026-07-24T20:48:42Z`
- Deployed technical verification: robots, 109 sitemap URLs, 14 key pages, six
  utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six
  bridge-host redirects, and old-URL exclusions passed
- Locale-route verification: 19 expected HTTP 200 routes and five expected
  HTTP 404 routes passed against `https://wenlan.app`
- Structured-data verification: live zh-TW and zh-CN LLM-wiki articles emit
  `https://wenlan.app/zh-TW/learn` and
  `https://wenlan.app/zh-CN/learn` respectively as BreadcrumbList item 2 while
  retaining exact localized canonicals, H1s, and language tags
- Render verification: both 393×852 production pages had no document
  overflow, framework overlay, console warning, or console error
- Status: production-verified; the production preparation slot is open
- Unperformed gated actions: no indexing request, GSC validation, external
  post, OSS submission, paid acquisition, or metric-definition change
- Next step: run the due Learn-hub and LLM-wiki 24-hour readouts after their
  predeclared timestamps and continue the read-only demand/coverage-gap audit
  without rewriting low-evidence weekly candidates

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-24-mcp-shared-memory-exposure

- Record type: experiment-start
- Experiment ID: EXP-2026-07-24-mcp-shared-memory-exposure
- Status: active
- Data window: 2026-07-18..2026-07-24
- Asset class: integration-hub
- Launched: 2026-07-24
- Hypothesis: Adding one relevant internal link from the high-use MCP memory integration hub to the existing Cursor and Claude Code shared-memory workflow will improve discovery and search exposure for the indexed target without stacking another copy rewrite on a page refreshed on 2026-07-17.
- Candidate evidence: Authenticated GSC for `2026-06-26..2026-07-23` reports 0 clicks, 8 impressions, and average position 20.8 for `/learn/cursor-claude-code-shared-memory`, and 0 clicks, 2 impressions, and average position 5.5 for `/learn/mcp-memory-server`. Same-range Vercel reports 291 visitors and 293 pageviews for the source; the target is absent from the returned top-page export, so no zero is inferred. Official signed-in Google Trends Explore captures at `2026-07-19T02:47:01Z` record `memory MCP` moving `2.0 → 7.0` inside a focused English Worldwide, past-12-month, request-relative 0–100 series; related queries in the committed integration-cluster interpretation include Claude, Claude Code, Codex, agent, and open memory. Reddit and GitHub/OSS observations captured on `2026-07-18` independently describe cross-session and cross-instance memory and a crowded cross-client MCP-memory category. The target already provides a standalone same-daemon, same-data-directory, same-space smoke test backed by current client documentation and the maintained Wenlan source.
- Baseline: GSC property totals are 7 clicks and 310 impressions; visible-query totals are 1 click and 75 impressions, leaving a 6-click and 235-impression visibility gap. The target page has 0 clicks, 8 impressions, and average position 20.8; the source page has 0 clicks, 2 impressions, and average position 5.5. Vercel separately reports 1,402 visitors and 1,593 pageviews property-wide and 291 visitors and 293 pageviews for the source; no target count or source-to-target sessions are inferred. GitHub reports 47 total stars. Umami and Vercel custom CTA events remain unavailable or account-gated.
- Change: Add only `cursor-claude-code-shared-memory` to the English `/learn/mcp-memory-server` article's `relatedSlugs`. Do not edit the source or target copy, metadata, dates, URL, canonical, hreflang, sitemap, schema, CTA, Mandarin coverage, or external distribution.
- Publish date: not-published
- Index date: indexed-before-2026-07-24-date-unavailable
- Minimum exposure: 10 GSC target-page impressions in the first 28 complete post-deploy days
- Success criteria: After at least 10 GSC target-page impressions, the target earns at least 1 GSC click or average position is 18.0 or better; Vercel target-page visitors and GitHub stars are reported separately without a causal claim.
- Failure criteria: After 28 complete post-deploy days and at least 10 GSC target-page impressions, the target has 0 clicks and average position is worse than 22.0. Fewer than 10 impressions is inconclusive; after minimum exposure, 0 clicks with average position from 18.1 through 22.0 is also inconclusive.
- Stop criteria: Stop or hold if the source-target relationship is no longer useful, maintained Wenlan or client sources no longer support the shared-memory workflow, the link creates a canonical, indexing, robots, noindex, structured-data, sitemap, locale, or rendered-layout regression, another controller edits either route, or the experiment would require an untracked source-to-target attribution claim.
- 24h readout: pending — verify both live routes, the visible source link, target canonical and indexability, structured data, English and Mandarin non-regression, production render, and separate source-native observations without an SEO-success judgment
- 7d readout: pending — report GSC latency, target-page clicks, impressions, and position when available, Vercel target-page presence when available, and GitHub stars separately
- W2 readout: pending — apply the minimum-exposure guard and inspect source-target relevance, duplicate anchors, and overlap with the active Claude Code and Learn-hub cohorts
- W4 readout: pending — evaluate the predeclared success, failure, or inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains useful
- Result: pending
- Decision: wait
- Next step: complete the focused RED-to-GREEN link assertion, full SEO/i18n/lint/build/technical checks, rendered verification, and independent review; then request explicit Git push, merge, and production-deploy approval.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-24T21:03:08Z — MCP shared-memory exposure locally verified

- Record type: campaign-observation
- Current change: `EXP-2026-07-24-mcp-shared-memory-exposure`
- Production-in-flight changes: 1
- Scope: add only `cursor-claude-code-shared-memory` to the English
  `/learn/mcp-memory-server` related-article list; no source or target copy,
  metadata, date, URL, canonical, hreflang, sitemap, schema, CTA, Mandarin
  availability, or external-distribution change
- Focused verification: the new source-scoped related-link assertion failed
  before implementation and passed after the one-slug addition
- Full verification: `pnpm test:seo` 175/175 with explicit Wenlan and
  wenlan-app roots; `pnpm test:i18n` 53/53; `pnpm lint`;
  `pnpm seo:goal:check`; `pnpm build` with 209 static pages;
  `pnpm seo:technical:built`; built i18n smoke with 19 direct-200 and five
  hard-404 routes; `git diff --check`
- Local production evidence: the source and target returned HTTP 200, the
  source contained exactly one target link, and the target retained its exact
  self-canonical and `index, follow`
- Render evidence: mobile 393×852 and desktop 1440×1000 source renders showed
  the complete four-link related block; the mobile target retained the
  expected title and H1; there was no document overflow, framework overlay,
  `FAQPage`, console warning, or console error; screenshots are under
  `/tmp/wenlan-seo/visual-qa/2026-07-24-mcp-shared-memory-exposure/`
- Locale evidence: neither changed English slug entered the translated Learn
  availability registry; the 53 i18n contracts and localized smoke routes
  passed
- External actions: none; no push, merge, deployment, indexing request,
  validation, external post, OSS submission, paid acquisition, or metric
  change
- Next step: finish independent review, then request explicit Git push, merge,
  and production-deploy approval

### 2026-07-24T21:10:24Z — MCP shared-memory exposure approved for publication

- Record type: campaign-observation
- Current change: `EXP-2026-07-24-mcp-shared-memory-exposure`
- Independent review: the initial pass found one stale contradiction in the
  mutable `PLAN.md` state; after that wording was corrected, the reviewer
  reread the changed state and returned `SHIP` with no other finding
- Approval: the user explicitly approved Git push, PR creation, merge, and
  production deployment in this Codex task
- Scope unchanged: one English related-article link and its focused contract;
  no copy, metadata, dates, URL, canonical, hreflang, sitemap, schema, CTA,
  Mandarin availability, indexing request, validation, external post, OSS
  submission, paid acquisition, or metric-definition change
- Next step: publish the reviewed branch and verify the resulting Vercel
  production deployment before marking the change production-verified

### 2026-07-24T21:13:05Z — MCP shared-memory exposure production verified

- Record type: campaign-observation
- Current change: `EXP-2026-07-24-mcp-shared-memory-exposure`
- Status: live; measuring
- Production-in-flight changes: 0
- Publication: PR #67 merged at `2026-07-24T21:12:18Z` as
  `6de693d7069db65455712022efbad0520830746d`; Vercel production completed at
  `2026-07-24T21:13:05Z`
- Deployed technical verification: robots, 109 sitemap URLs, 14 key pages, six
  utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six
  bridge-host redirects, and old-URL exclusions passed
- Locale-route verification: 19 expected HTTP 200 routes and five expected
  HTTP 404 routes passed against `https://wenlan.app`
- Live source evidence: `/learn/mcp-memory-server` returned HTTP 200, retained
  its exact self-canonical and `index, follow`, and contained exactly one
  rendered link labeled `How to Share Memory Between Cursor and Claude Code`
- Live target evidence:
  `/learn/cursor-claude-code-shared-memory` returned HTTP 200 with the expected
  title and H1, exact self-canonical, `index, follow`, and no `FAQPage`
- Render verification: at 1280×720 the source link was visible and a real
  click navigated to the target; both pages had document width equal to client
  width and no console warning or console error
- Metric interpretation: no 24-hour SEO-success judgment, source-to-target
  session inference, causality claim, or new GSC/Vercel/Umami/GitHub metric
- Unperformed gated actions: no indexing request, GSC validation, external
  post, OSS submission, paid acquisition, or metric-definition change
- Next step: run the predeclared 24-hour technical/evidence readout after
  `2026-07-25T21:13:05Z`; waiting for that readout does not close the
  production preparation slot

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-mcp-shared-memory-exposure at 2026-07-24T21:17:37Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-mcp-shared-memory-exposure
- Observed at: 2026-07-24T21:17:37Z
- Readout: correction
- Status: live
- Evidence: PR #67 merged at `2026-07-24T21:12:18Z` as `6de693d7069db65455712022efbad0520830746d`; Vercel production completed at `2026-07-24T21:13:05Z`. The deployed technical audit passed robots, 109 sitemap URLs, 14 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL exclusions. Nineteen expected locale routes returned HTTP 200 and five unsupported locale routes returned HTTP 404. The live source returned HTTP 200 with its exact self-canonical, `index, follow`, and exactly one visible shared-memory target link. A rendered click navigated to the HTTP 200 target with the expected title and H1, exact self-canonical, `index, follow`, no `FAQPage`, no document overflow, and no console warning or error. No search-performance result, source-to-target session, or causal effect is inferred at production completion.
- Result: pending
- Decision: wait
- Next step: Run the 24-hour technical/evidence readout after `2026-07-25T21:13:05Z`; this production-verified measurement cohort does not block another eligible website change.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-24-stale-ai-memory-diagnostic

- Record type: experiment-start
- Experiment ID: EXP-2026-07-24-stale-ai-memory-diagnostic
- Status: active
- Data window: 2026-07-18..2026-07-24
- Asset class: diagnostic-recipe
- Launched: 2026-07-24
- Hypothesis: Refreshing the existing English trust page into a modifier-qualified, source-backed diagnostic for stale and contradictory AI-agent memory will improve qualified discovery and exposure for that failure-mode intent without overlapping the active Claude Code or MCP workflows.
- Candidate evidence: Five English Reddit discussions observed at `2026-07-24T21:25:46Z` independently describe stale, contradictory, duplicated, or obsolete agent memory. Their search-result score snapshots were +39, +0, +2, +1, and +2; Reddit JSON returned HTTP 403, so these are not API scores. The directly inspectable HTML URLs and full provenance are recorded in `docs/seo-audits/2026-07-24-stale-ai-memory-diagnostic-prelaunch.md`. GitHub API evidence for open NousResearch/hermes-agent issue #10771 reports 9 comments, 5 reactions, creation at `2026-04-16T05:20:31Z`, and update at `2026-07-19T11:13:41Z`; it independently reports stale relative dates, contradictory entries, duplicates, obsolete notes, and memory rot. The existing Wenlan page partly covers trust but lacks a usable symptom-to-verification workflow. Maintained Wenlan commit `93451bf0ef58399e08400e3b4ac613942adcfec8`, version `0.14.1`, proves `/recall`, read-only `/lint deep`, `/curate revisions`, corrections and supersession, and destructive `/forget`. External observations are demand discovery only, not GSC or keyword volume.
- Baseline: GSC property totals are 7 clicks and 310 impressions; visible-query totals are 1 click and 75 impressions, leaving a 6-click and 235-impression visibility gap. The target route is absent from the returned GSC page export, so no target zero, position, or indexing status is inferred. Vercel separately reports 1,402 visitors and 1,593 pageviews property-wide and 1 visitor and 1 pageview for the target route. GitHub reports 47 total stars. Umami and Vercel custom CTA events remain unavailable or account-gated. No source-to-page join or causal inference is made.
- Change: Refresh only the existing English `/learn/review-before-trust-ai-memory` article title, metadata, body, diagnostic code block, FAQ copy, maintained references, and related links. Keep its URL, canonical, sitemap membership, locale availability, Article and BreadcrumbList schema types, and CTA unchanged. Add no Mandarin route, `FAQPage` JSON-LD, indexing request, or external distribution.
- Publish date: not-published
- Index date: unknown-existing-route
- Minimum exposure: 5 GSC target-page impressions in the first 28 complete post-deploy days
- Success criteria: After at least 5 GSC target-page impressions, the target earns at least 1 GSC click or average position is 20.0 or better; Vercel target-page visitors and GitHub stars are reported separately without a causal claim.
- Failure criteria: After 28 complete post-deploy days and at least 5 GSC target-page impressions, the target has 0 clicks and average position is worse than 30.0. Fewer than 5 impressions is inconclusive; after minimum exposure, 0 clicks with average position from 20.1 through 30.0 is also inconclusive.
- Stop criteria: Stop or hold if maintained Wenlan sources no longer support the workflow, the diagnostic overlaps an active Claude Code or MCP page, another controller edits the route, or the change creates a canonical, indexing, robots, noindex, structured-data, sitemap, locale, or rendered-layout regression.
- 24h readout: pending — verify the live route, title, metadata, canonical, indexability, structured data, maintained references, English and Mandarin non-regression, production render, and separate source-native observations without an SEO-success judgment
- 7d readout: pending — report GSC latency and target-page clicks, impressions, and position when available, Vercel target-page presence when available, and GitHub stars separately
- W2 readout: pending — apply the minimum-exposure guard and inspect diagnostic-intent relevance plus overlap with the Claude Code, MCP, Learn-hub, and LLM-wiki cohorts
- W4 readout: pending — evaluate the predeclared success, failure, or inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains useful
- Result: pending
- Decision: wait
- Next step: complete RED-to-GREEN article verification, full SEO/i18n/lint/build/technical checks, rendered verification, independent review, and the user-approved website publication; do not perform indexing or external distribution.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-24T23:02:17Z — stale AI memory diagnostic locally verified

- Record type: campaign-observation
- Current change: `EXP-2026-07-24-stale-ai-memory-diagnostic`
- Production-in-flight changes: 1
- Scope: refresh the existing English
  `/learn/review-before-trust-ai-memory` route into a source-backed
  stale/contradictory-memory diagnostic; no new URL, translation, canonical,
  sitemap, schema type, CTA, `FAQPage`, indexing request, or external
  distribution
- Focused verification: the new article contract failed against the old
  abstract trust page and passed after the diagnostic refresh; rendered mobile
  QA then exposed an internally scrolling command block, and a second
  RED-to-GREEN pass shortened only the example lines until the block fit
  337px inside 337px
- Full verification: `pnpm test:seo` 176/176 with explicit Wenlan and
  wenlan-app roots; `pnpm test:i18n` 53/53; `pnpm lint`;
  `pnpm seo:goal:check`; `pnpm build` with 209 static pages;
  `pnpm seo:technical:built`; built i18n smoke with 19 direct-200 and five
  hard-404 routes; `pnpm seo:technical:deployed`; and `git diff --check`
- Technical evidence: the final build retains 109 sitemap URLs, 26 compiled
  redirects, seven compiled noindex headers, 14 checked HTML pages, and no
  `FAQPage` across 113 built HTML files; unchanged production passed robots,
  109 sitemap URLs, 14 key pages, six utility noindex headers, 25 redirects,
  six bridge redirects, and legacy exclusions
- Render evidence: 1280×720 and 393×852 exposed the exact title and H1,
  canonical, `index, follow`, four maintained source links, Article and
  BreadcrumbList JSON-LD, and no `FAQPage`, framework overlay, document/H1/code
  overflow, console warning, or console error; screenshots are under
  `/tmp/wenlan-seo/visual-qa/2026-07-24-stale-ai-memory-diagnostic/`
- Metric interpretation: the GSC target remains absent from the authenticated
  page export, which is not a zero; same-range Vercel target baseline is
  1 visitor and 1 pageview; no source-to-page session or causal claim is made
- Approval: the user explicitly approved Git push, PR, merge, and production
  deployment for this bounded website experiment; indexing, GSC validation,
  external posts, OSS submission, paid acquisition, and metric changes remain
  unapproved
- Next step: complete independent final review, then publish and verify
  production

### 2026-07-24T23:06:05Z — stale AI memory diagnostic independent review

- Record type: campaign-observation
- Current change: `EXP-2026-07-24-stale-ai-memory-diagnostic`
- Independent review: `SHIP` with no P0–P2 findings
- Review evidence: all five candidate gates and source-native baselines were
  inspectable; the article preserves the read-only lint, curated revision,
  correction, and destructive forget boundaries; its failure-mode intent is
  distinct from Claude Code native memory, MCP setup/shared-client memory, and
  the product-reference docs; PLAN and the append-only ledger consistently
  report seven active experiments and one production slot
- Independent verification: `pnpm seo:goal:check`; `pnpm test:seo` 176/176;
  `pnpm test:i18n` 53/53; TypeScript lint; focused article contract;
  `git diff --check`; and fresh desktop/mobile clipping and command-block
  overflow inspection all passed
- Next step: commit, push, merge the user-approved PR, wait for Vercel
  production, and verify the deployed route before marking the experiment live

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-stale-ai-memory-diagnostic at 2026-07-24T23:08:30Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-stale-ai-memory-diagnostic
- Observed at: 2026-07-24T23:08:30Z
- Readout: correction
- Status: live
- Publish date: 2026-07-24
- Production-in-flight changes: 0
- Evidence: PR #69 merged at `2026-07-24T23:07:44Z` as `ee9694d40771a6477bf9b7c294f1ec45f7dd7c69`; Vercel production completed at `2026-07-24T23:08:30Z`. The deployed technical audit passed robots, 109 sitemap URLs, 14 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL exclusions. Nineteen expected locale routes returned HTTP 200 and five unsupported locale routes returned HTTP 404. The live English route returned HTTP 200 with the expected title and description, exact self-canonical, `index, follow`, Article and BreadcrumbList JSON-LD, `dateModified` `2026-07-24`, four maintained source links, and no `FAQPage`. Desktop 1280×720 and mobile 393×852 production renders showed the expected H1, no framework overlay, no console warning or error, and no document, H1, or command-block overflow; the mobile document and command widths were `387/387` and `337/337`. Render evidence is under `/tmp/wenlan-seo/visual-qa/2026-07-24-stale-ai-memory-production/`. This launch changes no Mandarin route; the separate zh-TW and zh-CN route smoke passed without regression.
- Metric interpretation: The authenticated pre-publish GSC target-page absence remains absence, not zero. Same-range Vercel target baseline remains 1 visitor and 1 pageview, and GitHub remains 47 total stars. No post-deploy SEO result, source-to-page session, CTA, or causal effect is inferred at production completion.
- Result: pending
- Decision: wait
- Unperformed gated actions: no indexing request, GSC validation, Reddit or other external post, OSS submission, paid acquisition, or metric-definition change
- Next step: run the 24-hour technical/evidence readout after `2026-07-25T23:08:30Z`; this production-verified measurement cohort does not consume the production slot
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-24-claude-mem-comparison-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-07-24-claude-mem-comparison-refresh
- Status: active
- Data window: 2026-07-18..2026-07-24
- Asset class: refresh
- Launched: 2026-07-24
- Hypothesis: Correcting the existing claude-mem comparison around the current automatic-versus-explicit memory decision will improve qualified exposure for comparison intent without overlapping the active Claude Code memory page.
- Candidate evidence: The target has 7 authenticated GSC impressions, 0 clicks, and average position 14.4. Same-range Vercel reports 1 visitor and 1 pageview for the target. Current claude-mem commit `132b46343e60ecf4057c427736c57b08f7615dfe` and release `v13.12.4` show that the page's Claude-Code-only, MIT-license, and weak cross-agent framing is stale. GitHub REST reports 88,477 stars, 7,680 forks, and 274 open issues in native OSS units; issues #1270 and #1328 independently repeat the cross-agent job. Full provenance is recorded in `docs/seo-audits/2026-07-24-claude-mem-comparison-prelaunch.md`. External observations validate the candidate but are not GSC or keyword volume.
- Baseline: GSC property totals are 7 clicks and 310 impressions; visible-query totals are 1 click and 75 impressions, leaving a 6-click and 235-impression visibility gap. The target page has 7 impressions, 0 clicks, and average position 14.4; no visible query row is joined to it. Vercel separately reports 1,402 visitors and 1,593 pageviews property-wide and 1 visitor and 1 pageview for the target. GitHub reports 47 Wenlan total stars. Umami and Vercel custom CTA events remain unavailable or account-gated. No source-to-page join or causal inference is made.
- Change: Refresh only the existing English `/learn/wenlan-vs-claude-mem` title, metadata, first answer, comparison copy and table, FAQ copy, and maintained references. Correct the competitor license and cross-agent support. Keep the URL, canonical, sitemap membership, locale availability, Article and BreadcrumbList schema types, and CTA unchanged. Add no Mandarin route, `FAQPage` JSON-LD, indexing request, or external distribution.
- Publish date: not-published
- Index date: unknown-existing-route
- Minimum exposure: 5 GSC target-page impressions in the first 28 complete post-deploy days
- Success criteria: After at least 5 GSC target-page impressions, the target earns at least 1 GSC click or average position is 12.0 or better; Vercel target-page visitors and GitHub stars are reported separately without a causal claim.
- Failure criteria: After 28 complete post-deploy days and at least 5 GSC target-page impressions, the target has 0 clicks and average position is worse than 20.0. Fewer than 5 impressions is inconclusive; after minimum exposure, 0 clicks with average position from 12.1 through 20.0 is also inconclusive.
- Stop criteria: Stop or hold if maintained sources no longer support the comparison, the page overlaps the active Claude Code memory intent, another controller edits the route, or the change creates a canonical, indexing, robots, noindex, structured-data, sitemap, locale, source-link, or rendered-layout regression.
- 24h readout: pending — verify the live route, title, metadata, canonical, indexability, structured data, maintained references, English and Mandarin non-regression, production render, and separate source-native observations without an SEO-success judgment
- 7d readout: pending — report GSC latency and target-page clicks, impressions, and position when available, Vercel target-page presence when available, and GitHub stars separately
- W2 readout: pending — apply the minimum-exposure guard and inspect comparison-intent relevance plus overlap with the Claude Code memory cohort
- W4 readout: pending — evaluate the predeclared success, failure, or inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains useful
- Result: pending
- Decision: wait
- Next step: complete RED-to-GREEN article verification, full SEO/i18n/lint/build/technical checks, rendered verification, and independent review; stop before push, PR, merge, or deploy without new explicit approval
<!-- EXPERIMENT-RECORD:END -->

### Campaign observation — 2026-07-25T00:02:30Z

- Experiment: `EXP-2026-07-24-superlocalmemory-comparison-refresh`
- Local preparation: complete
- Reviewer: initial `FIX FIRST` because the regression contracts did not protect the Mode C `87.7%` scope or the AGPL-family and commercial-license facts; added article-scoped assertions in both SEO contract suites; focused re-review returned `SHIP` with no remaining P0–P2 findings
- Verification: `seo:goal:check` passed; SEO tests 178/178; i18n tests 53/53; TypeScript lint passed; build generated 209 static pages; built technical SEO passed with 109 sitemap locations and no `FAQPage` in 113 built HTML files; locale-route technical checks and `git diff --check` passed
- Rendered QA: desktop and mobile production-build frames covered the complete article; document/client widths were `1274/1274` and `387/387`; the comparison table remained intentionally horizontally scrollable on mobile; source links, title, canonical, `index, follow`, Article and BreadcrumbList schema, and visible benchmark/licensing copy passed; browser warnings/errors were empty; both inline visual passes passed
- Locale decision: English refresh only. The authenticated/localized evidence does not establish a Mandarin SuperLocalMemory comparison cluster, so no zh-TW or zh-CN page was added; the existing localized route matrix passed without regression.
- Approval: at `2026-07-25T00:02:30Z`, the user approved commit, push, PR, merge, deployment, and production verification for this website change
- Still unapproved: request indexing, GSC validation, Reddit or other external publication, OSS submission, paid acquisition, and metric-definition changes
- Next step: publish through the normal PR gate, verify the production route and technical SEO, append the production evidence, and release the one production slot

### Campaign observation — 2026-07-24T23:27:13Z

- Experiment: `EXP-2026-07-24-claude-mem-comparison-refresh`
- Local preparation: complete
- Reviewer: initial `FIX FIRST` because the article treated Gemini as a client integration and named unsupported Hermes support; corrected to the pinned installation guide's supported-IDE list and cited that guide; focused re-review returned `SHIP`
- Verification: `seo:goal:check` passed; SEO tests 177/177; i18n tests 53/53; TypeScript lint passed; build generated 209 static pages; built technical SEO passed with 109 sitemap locations and no `FAQPage` in 113 built HTML files; `git diff --check` passed
- Rendered QA: desktop `1274/1274` and mobile `387/387` document/client widths; corrected integration list present; unsupported Gemini/Hermes integration claim absent; browser warnings/errors empty; both inline visual passes passed
- Locale decision: English refresh only. The latest authenticated/localized evidence still does not establish a Mandarin claude-mem comparison cluster, so no zh-TW or zh-CN page was added.
- Approval: at `2026-07-24T23:27:13Z`, the user approved commit, push, PR, merge, deployment, and production verification for this website change
- Still unapproved: request indexing, GSC validation, Reddit or other external publication, OSS submission, paid acquisition, and metric-definition changes
- Next step: publish through the normal PR gate, verify the production route and technical SEO, append the production evidence, and release the one production slot

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-claude-mem-comparison-refresh at 2026-07-24T23:34:19Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-claude-mem-comparison-refresh
- Observed at: 2026-07-24T23:34:19Z
- Readout: correction
- Status: live
- Publish date: 2026-07-24
- Production-in-flight changes: 0
- Evidence: PR #71 merged at `2026-07-24T23:33:32Z` as `f6e5dd083ad5086fe4c4552cee1764c8dc848645`; Vercel production completed at `2026-07-24T23:34:19Z`. The deployed technical audit passed robots, 109 sitemap URLs, 14 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL exclusions. The live English route returned HTTP 200 with the expected title, exact self-canonical, `index, follow`, Article and BreadcrumbList JSON-LD, v13.12.4 and pinned installation sources, the corrected supported-IDE list, and no `FAQPage`. Desktop and mobile production renders showed the expected H1 and corrected copy, no console warning or error, and no document or H1 overflow; desktop and mobile document/client widths were `1274/1274` and `387/387`.
- Metric interpretation: The authenticated pre-publish target baseline remains 7 GSC impressions, 0 clicks, and average position 14.4. Same-range Vercel remains 1 visitor and 1 pageview for the target, while GitHub remains 47 total stars. No post-deploy SEO result, source-to-page session, CTA, or causal effect is inferred at production completion.
- Result: pending
- Decision: wait
- Unperformed gated actions: no indexing request, GSC validation, Reddit or other external post, OSS submission, paid acquisition, or metric-definition change
- Next step: run the 24-hour technical/evidence readout after `2026-07-25T23:34:19Z`; this production-verified measurement cohort does not consume the production slot
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-24-superlocalmemory-comparison-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-07-24-superlocalmemory-comparison-refresh
- Status: active
- Data window: 2026-07-18..2026-07-24
- Asset class: refresh
- Launched: 2026-07-24
- Hypothesis: Correcting the existing SuperLocalMemory comparison around the current control-plane-versus-source-backed-wiki decision and matching the current competitor brand/version will improve qualified exposure for comparison intent without creating a competing URL.
- Candidate evidence: The target has 16 authenticated GSC impressions, 0 clicks, and average position 8.6. The visible query `super local memory` has 1 impression, 0 clicks, and average position 45.0, but the separate query and page exports are not joined. Earlier overlapping weekly data also returned `superlocal memory` and `super local memory`, establishing recurrence without adding the counts. GitHub REST reports 197 stars, 33 forks, 5 open issues, AGPL-3.0, and current commit `893e6d7d521cef6013d35f0ea468eca3005916de`; npm reports v3.8.3 published at `2026-07-24T15:17:25.395Z`. The v3.8.3 README and changelog show material drift to a local-first agent memory control plane with temporal retrieval, team scopes and access, audit, cache/compression, bounded loops, and framework adapters. Full provenance is recorded in `docs/seo-audits/2026-07-24-superlocalmemory-comparison-prelaunch.md`. OSS observations validate accuracy and intent but are not GSC or keyword volume.
- Baseline: GSC property totals are 7 clicks and 310 impressions; visible-query totals are 1 click and 75 impressions, leaving a 6-click and 235-impression visibility gap. The target has 16 impressions, 0 clicks, and average position 8.6. Vercel separately reports 1,402 visitors and 1,593 pageviews property-wide and 7 visitors and 7 pageviews for the target. GitHub reports 47 Wenlan total stars. Umami and Vercel custom CTA events remain unavailable or account-gated. No source-to-page join or causal inference is made.
- Change: Refresh only the existing English `/learn/wenlan-vs-superlocal-memory` title, metadata, first answer, source links, body, comparison table, FAQ copy, and related links. Correct the current SuperLocalMemory product boundary and the published 60.4%, 74.8%, and 87.7% benchmark scopes. Keep the URL, canonical, sitemap membership, locale availability, Article and BreadcrumbList schema types, and CTA destination unchanged. Add no Mandarin route, `FAQPage` JSON-LD, indexing request, or external distribution.
- Publish date: not-published
- Index date: unknown-existing-route
- Minimum exposure: 5 GSC target-page impressions in the first 28 complete post-deploy days
- Success criteria: After at least 5 GSC target-page impressions, the target earns at least 1 GSC click or average position is 7.0 or better; Vercel target-page visitors and GitHub stars are reported separately without a causal claim.
- Failure criteria: After 28 complete post-deploy days and at least 5 GSC target-page impressions, the target has 0 clicks and average position is worse than 15.0. Fewer than 5 impressions is inconclusive; after minimum exposure, 0 clicks with average position from 7.1 through 15.0 is also inconclusive.
- Stop criteria: Stop or hold if maintained sources no longer support the comparison, another controller edits the route, a claim cannot be pinned to first-party evidence, or the change creates a canonical, indexing, robots, noindex, structured-data, sitemap, locale, source-link, or rendered-layout regression.
- 24h readout: pending — verify the live route, title, metadata, canonical, indexability, structured data, maintained references, English and Mandarin non-regression, production render, and separate source-native observations without an SEO-success judgment
- 7d readout: pending — report GSC latency and target-page clicks, impressions, and position when available, Vercel target-page presence when available, and GitHub stars separately
- W2 readout: pending — apply the minimum-exposure guard and inspect comparison-intent relevance plus overlap with the local-first, trust, and claude-mem comparison cohorts
- W4 readout: pending — evaluate the predeclared success, failure, or inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains useful
- Result: pending
- Decision: wait
- Next step: complete RED-to-GREEN article verification, full SEO/i18n/lint/build/technical checks, rendered verification, and independent review; stop before push, PR, merge, or deploy without new explicit approval
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-superlocalmemory-comparison-refresh at 2026-07-25T00:05:36Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-superlocalmemory-comparison-refresh
- Observed at: 2026-07-25T00:05:36Z
- Readout: correction
- Status: live
- Publish date: 2026-07-24
- Production-in-flight changes: 0
- Evidence: PR #73 merged at `2026-07-25T00:04:41Z` as `9883ddaf74ae07667a57d752aee59468c2d0ee1c`; Vercel production deployment `dpl_7ywPX5MLQVhr5NtFWqCNnevbTAGM` completed at `2026-07-25T00:05:36Z`, and `wenlan.app` resolved to that deployment. The deployed technical audit passed robots, 109 sitemap URLs, 14 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL exclusions. The live English route returned HTTP 200 with the expected v3.8.3 title and H1, exact self-canonical, `index, follow`, English language, SoftwareApplication, WebSite, Organization, Article, and BreadcrumbList JSON-LD, five maintained source links, and no `FAQPage`. Desktop and mobile production renders showed the refreshed page without document or H1 overflow; desktop document/client widths were `1274/1274`, mobile widths were `387/387`, the mobile comparison table exposed its full 98-pixel horizontal scroll range, and browser warning/error logs were empty.
- Metric interpretation: The authenticated pre-publish target baseline remains 16 GSC impressions, 0 clicks, and average position 8.6. Same-range Vercel remains 7 visitors and 7 pageviews for the target, while GitHub remains 47 Wenlan total stars. No post-deploy SEO result, source-to-page session, CTA, or causal effect is inferred at production completion.
- Result: pending
- Decision: wait
- Unperformed gated actions: no indexing request, GSC validation, Reddit or other external post, OSS submission, paid acquisition, or metric-definition change
- Next step: run the 24-hour technical/evidence readout after `2026-07-26T00:05:36Z`; this production-verified measurement cohort does not consume the production slot
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-25-basic-memory-comparison-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-07-25-basic-memory-comparison-refresh
- Status: active
- Data window: 2026-07-25..2026-07-31
- Asset class: refresh
- Launched: 2026-07-25
- Hypothesis: Correcting the existing comparison around Basic Memory's current local, Cloud, Teams, search, and maintenance paths versus Wenlan's source-backed AI-work workflow will improve qualified exposure without creating a competing URL.
- Candidate evidence: The target has 20 authenticated GSC impressions, 1 click, and average position 14.6. Joined visible rows `basic memory` and `basicmemory` have 5 impressions and 0 clicks; the page click is outside those visible rows and remains unattributed. Basic Memory release v0.22.1, PyPI v0.22.1, current source commit `5d444f0974476645f904c1446998c0a938a6e7f7`, and docs commit `1c670035987b21f0a93d4e45ea1eed1487775f74` show material drift from the page's local-vault-only framing to explicit local or hosted deployment, Teams, cross-client MCP, semantic and graph search, agent skills, sync, snapshots, and hosted file history. Independent English comparison surfaces from Mem0, Creed, and Hippo include Basic Memory in direct product-selection decisions. Each external surface is one inspectable observation, not keyword volume. Full provenance is recorded in `docs/seo-audits/2026-07-25-basic-memory-comparison-prelaunch.md`.
- Baseline: GSC property totals are 7 clicks and 310 impressions; visible-query totals are 1 click and 75 impressions, leaving a 6-click and 235-impression visibility gap. The target has 20 impressions, 1 click, and average position 14.6. Vercel separately reports 1,402 visitors and 1,593 pageviews property-wide and 5 visitors and 5 pageviews for the target. GitHub reports 47 Wenlan total stars. Umami and Vercel custom CTA events remain unavailable or account-gated. No source-to-page join or causal inference is made.
- Change: Refresh only the existing English `/learn/wenlan-vs-basic-memory` H1, first answer, maintained source links, Basic Memory product boundary, decision framework, comparison table, FAQ copy, and freshness statement. State local and hosted Basic Memory paths separately, remove unsupported retrieval-scale and local-only history claims, and preserve a neutral chooser. Keep the URL, meta title, canonical, sitemap membership, locale availability, Article and BreadcrumbList schema types, related routes, and CTA destination unchanged. Add no Mandarin route, `FAQPage` JSON-LD, indexing request, or external distribution.
- Publish date: not-published
- Index date: unknown-existing-route
- Minimum exposure: 5 GSC target-page impressions in the first 28 complete post-deploy days
- Success criteria: After at least 5 GSC target-page impressions, the target earns at least 1 GSC click or average position is 12.0 or better; Vercel target-page visitors and GitHub stars are reported separately without a causal claim.
- Failure criteria: After 28 complete post-deploy days and at least 5 GSC target-page impressions, the target has 0 clicks and average position is worse than 20.0. Fewer than 5 impressions is inconclusive; after minimum exposure, 0 clicks with average position from 12.1 through 20.0 is also inconclusive.
- Stop criteria: Stop or hold if maintained sources no longer support the comparison, another controller edits the route, a claim cannot be pinned to first-party evidence, or the change creates a canonical, indexing, robots, noindex, structured-data, sitemap, locale, source-link, or rendered-layout regression.
- 24h readout: pending — verify the live route, title, metadata, canonical, indexability, structured data, maintained references, English and Mandarin non-regression, production render, and separate source-native observations without an SEO-success judgment
- 7d readout: pending — report GSC latency and target-page clicks, impressions, and position when available, Vercel target-page presence when available, and GitHub stars separately
- W2 readout: pending — apply the minimum-exposure guard and inspect Basic Memory comparison relevance plus overlap with the knowledge-base, Learn-hub, and other comparison cohorts
- W4 readout: pending — evaluate the predeclared success, failure, or inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains useful
- Result: pending
- Decision: wait
- Next step: complete focused article verification, full SEO/i18n/lint/build/technical checks, rendered verification, and independent review; stop before push, PR, merge, or deploy without new explicit approval
<!-- EXPERIMENT-RECORD:END -->

### Campaign observation — 2026-07-25T01:01:13Z

- Experiment: `EXP-2026-07-25-basic-memory-comparison-refresh`
- Local preparation: complete
- Change: refreshed the existing English Basic Memory comparison around its
  current local, Cloud, Teams, semantic and graph search, Agent Skills, hosted
  history, and collaboration paths versus Wenlan's source-backed Sources,
  Memories, and Pages workflow; preserved the URL, meta title, canonical,
  sitemap membership, locale availability, schema types, related routes, and
  CTA destination
- Publication-date correction: preserved the original
  `publishedAt: "2026-05-14"` and set `updatedAt: "2026-07-25"`; removed
  Wenlan-only LME numbers from the side-by-side table so the page does not
  imply an unmatched benchmark comparison
- Reviewer: initial `FIX FIRST` for the publication-date schema and asymmetric
  benchmark presentation; both were fixed, and the final independent verdict
  was `SHIP` with no remaining P0-P2 findings
- Verification: `seo:goal:check` passed; SEO tests 182/182; i18n tests 53/53;
  TypeScript lint passed; build generated 209 static pages; built technical SEO
  passed with 109 sitemap locations and no `FAQPage` in 113 built HTML files;
  production-build locale checks and `git diff --check` passed
- Rendered QA: desktop 1440x1000 and mobile 393x852 returned 200 with the
  expected H1, exact self-canonical, `index, follow`, Article and
  BreadcrumbList schema, no `FAQPage`, correct `datePublished` and
  `dateModified`, nine HTTPS source links, no document or H1 overflow, and no
  browser warning or error
- Locale decision: English refresh only. The authenticated and discovery
  evidence does not establish a Mandarin Basic Memory comparison cluster;
  zh-TW and zh-CN unsupported routes remain intentional 404s.
- Approval: at `2026-07-25T01:01:13Z`, the user approved commit, push, PR,
  merge, deployment, and production verification for this website change
- Still unapproved: request indexing, GSC validation, Reddit or other external
  publication, OSS submission, paid acquisition, and metric-definition changes
- Next step: publish through the normal PR gate, verify the production route
  and deployed technical SEO, append the production evidence, and release the
  one production slot

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-25-basic-memory-comparison-refresh at 2026-07-25T01:04:56Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-25-basic-memory-comparison-refresh
- Observed at: 2026-07-25T01:04:56Z
- Readout: correction
- Status: live
- Publish date: 2026-07-25
- Production-in-flight changes: 0
- Evidence: PR #76 merged at `2026-07-25T01:04:11Z` as `983f9383b499c73e293b7c61e5f256ea1276388b`; Vercel production completed at `2026-07-25T01:04:56Z`. The deployed technical audit passed robots, 109 sitemap URLs, 14 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL exclusions. The live English route returned HTTP 200 with the refreshed H1, exact self-canonical, `index, follow`, English language, SoftwareApplication, WebSite, Organization, Article, and BreadcrumbList JSON-LD, nine maintained source links, no `FAQPage`, `datePublished: "2026-05-14"`, and `dateModified: "2026-07-25"`. Desktop and mobile production renders showed the refreshed page without document or H1 overflow; the mobile comparison table remained horizontally accessible; no unmatched LME metric or browser warning/error was present.
- Metric interpretation: The authenticated pre-publish target baseline remains 20 GSC impressions, 1 click, and average position 14.6. Joined visible rows remain 5 impressions and 0 clicks, with the page click unattributed. Same-range Vercel remains 5 visitors and 5 pageviews for the target, while GitHub remains 47 Wenlan total stars. No post-deploy SEO result, source-to-page session, CTA, or causal effect is inferred at production completion.
- Result: pending
- Decision: wait
- Unperformed gated actions: no indexing request, GSC validation, Reddit or other external post, OSS submission, paid acquisition, or metric-definition change
- Next step: run the 24-hour technical/evidence readout after `2026-07-26T01:04:56Z`; this production-verified measurement cohort does not consume the production slot
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-25-ai-agent-memory-types

- Record type: experiment-start
- Experiment ID: EXP-2026-07-25-ai-agent-memory-types
- Status: active
- Data window: 2026-07-25..2026-07-31
- Asset class: net-new-search
- Launched: 2026-07-25
- Hypothesis: A neutral placement guide for working, episodic, semantic, and procedural AI-agent memory will earn qualified exposure inside the validated English `agent memory` category without competing with Wenlan's existing AI-work-memory definition, capture-quality guide, handoff workflow, or product memory-type reference.
- Candidate evidence: A signed-in Google Trends Explore export captured at `2026-07-25T01:42:25Z` preserves 53 raw weekly request-relative `0–100` rows for one Worldwide, Web Search, past-12-month request. Inside that request, `AI agent memory` moved from a first-13-week average of 3.7 to a latest-13-week average of 26.9, and `agent memory` from 11.7 to 73.1. The raw CSV and provenance metadata are committed under `docs/seo-audits/data/`. Four English Reddit threads observed at `2026-07-25T01:27:14Z` represent three independent authors; two procedural-memory posts share one author and count as one source. CoALA and LangChain establish the four-role taxonomy, while Letta supports the placement tradeoff. The complete URLs, dates, native units, provenance, limitations, and coverage audit are in `docs/seo-audits/2026-07-25-ai-agent-memory-types-prelaunch.md`. External observations are demand discovery only, not GSC input or keyword volume.
- Baseline: GSC property totals are 7 clicks and 310 impressions; visible-query totals are 1 click and 75 impressions, leaving a 6-click and 235-impression visibility gap. The target page and target query have no prelaunch rows because the URL is net new; no zero or indexing state is inferred. Vercel separately reports 1,402 visitors and 1,593 pageviews property-wide, with no target-route baseline. GitHub reports 47 Wenlan total stars. Umami and Vercel custom CTA events remain unavailable or account-gated. No source-to-page join or causal inference is made.
- Change: Add one English `/learn/ai-agent-memory-types` article that defines the four roles, gives a practical placement guide, explains their different lifecycles, and conservatively maps Wenlan's durable captures, handoffs, and source-backed pages while keeping client working context and procedural rules or skills distinct. Explicitly state that Wenlan's six `memory_type` values are capture metadata, not the four cognitive layers. Add no zh-TW or zh-CN route, `FAQPage` JSON-LD, indexing request, or external distribution.
- Publish date: not-published
- Index date: unknown-net-new-route
- Minimum exposure: 5 GSC target-page impressions in the first 28 complete post-deploy days
- Success criteria: After at least 5 GSC target-page impressions, the target earns at least 1 GSC click or average position is 30.0 or better; Vercel target-page visitors and GitHub stars are reported separately without a causal claim.
- Failure criteria: After 28 complete post-deploy days and at least 5 GSC target-page impressions, the target has 0 clicks and average position is worse than 40.0. Fewer than 5 impressions is inconclusive; after minimum exposure, 0 clicks with average position from 30.1 through 40.0 is also inconclusive.
- Stop criteria: Stop or hold if maintained sources do not support the taxonomy, the page conflates cognitive roles with Wenlan's capture metadata, another controller edits the route, or the change creates a canonical, indexing, robots, noindex, structured-data, sitemap, locale, source-link, or rendered-layout regression.
- 24h readout: pending — verify the live route, title, metadata, canonical, indexability, structured data, maintained references, English and Mandarin non-regression, production render, and separate source-native observations without an SEO-success judgment
- 7d readout: pending — report GSC latency and target-page clicks, impressions, and position when available, Vercel target-page presence when available, and GitHub stars separately
- W2 readout: pending — apply the minimum-exposure guard and inspect whether the taxonomy page remains distinct from AI work memory, capture quality, handoff, and Wenlan memory-type docs
- W4 readout: pending — evaluate the predeclared success, failure, or inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains useful
- Result: pending
- Decision: wait
- Next step: run the focused article contract RED, implement the bounded English page, then complete full SEO/i18n/lint/build/technical, rendered, and independent-review gates before the approved PR and production path
<!-- EXPERIMENT-RECORD:END -->

### Campaign observation — 2026-07-25T01:45:53Z

- Experiment: `EXP-2026-07-25-ai-agent-memory-types`
- Local preparation: complete
- Change: added one English `/learn/ai-agent-memory-types` acquisition page
  explaining working, episodic, semantic, and procedural memory roles plus a
  product-independent placement guide; explicitly separated those roles from
  Wenlan's six capture metadata values
- Evidence repair: committed the complete signed-in 53-week Google Trends
  export and metadata, counted four Reddit threads as three independent
  authors, and used Letta only as placement evidence rather than taxonomy
  proof
- Reviewer: initial `FIX FIRST` for evidence provenance and attribution; all
  findings were corrected, and focused re-review returned `SHIP` with no
  remaining P0-P2 findings
- Verification: `seo:goal:check` passed; SEO tests 184/184; i18n tests 53/53;
  TypeScript lint passed; weekly sample pipeline passed; build generated 211
  static pages; built technical SEO passed with 110 sitemap locations and no
  `FAQPage` in 114 built HTML files; built-locale checks passed 19 direct-200
  routes and five expected 404s; `git diff --check` passed
- Rendered QA: desktop 1440px and fresh mobile 393x852 returned the expected
  H1, title, exact canonical, `index, follow`, Article and BreadcrumbList
  schema, four source links, and visible FAQ behavior with no document or H1
  overflow. One existing global unused-font preload warning appeared on the
  fresh mobile render; no page error or target-route defect appeared.
- Locale decision: English only. No independent zh-TW or zh-CN taxonomy demand
  has been observed; both unsupported Mandarin routes remain intentional 404s.
- Approval: the user approved commit, push, PR, merge, deployment, and
  production verification for this website change
- Still unapproved: request indexing, GSC validation, Reddit or other external
  publication, OSS submission, paid acquisition, and metric-definition changes
- Next step: publish through the normal PR gate, wait for Vercel production,
  verify the live route and deployed technical SEO, append the production
  evidence, and release the one production slot

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-25-ai-agent-memory-types at 2026-07-25T01:49:40Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-25-ai-agent-memory-types
- Observed at: 2026-07-25T01:49:40Z
- Readout: correction
- Status: live
- Publish date: 2026-07-25
- Production-in-flight changes: 0
- Evidence: PR #78 merged at `2026-07-25T01:48:42Z` as `4d4ff8abc51fd053809e32ec63da9e8c3d604926`; the Vercel production commit status completed successfully at `2026-07-25T01:49:40Z`. The deployed technical audit passed robots, 110 sitemap URLs, 14 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL exclusions. The live English route returned HTTP 200 with the expected title and H1, exact self-canonical, `index, follow`, English language, SoftwareApplication, WebSite, Organization, Article, and BreadcrumbList JSON-LD, four maintained source links, two visible FAQ questions, and no `FAQPage`. The unsupported zh-TW and zh-CN routes returned 404 and were absent from the sitemap. Desktop and mobile production renders had no document or H1 overflow and no browser warning or error; document/client widths were `1440/1440` and `393/393`. The first FAQ opened and exposed the expected answer.
- Metric interpretation: The authenticated pre-publish property baseline remains 7 GSC clicks and 310 impressions, while the target route has no prelaunch GSC or Vercel row because it is net new; no zero or indexing state is inferred. GitHub REST reports 47 total Wenlan stars. No post-deploy SEO result, source-to-page session, CTA, or causal effect is inferred at production completion.
- Result: pending
- Decision: wait
- Unperformed gated actions: no indexing request, GSC validation, Reddit or other external post, OSS submission, paid acquisition, or metric-definition change
- Next step: run the 24-hour technical/evidence readout after `2026-07-26T01:49:40Z`; this production-verified measurement cohort does not consume the production slot
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-25-context-loss-diagnostic-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-07-25-context-loss-diagnostic-refresh
- Status: active
- Data window: 2026-07-25..2026-07-31
- Asset class: diagnostic-recipe
- Launched: 2026-07-25
- Hypothesis: Refreshing the existing context-loss page as a source-backed symptom-to-recovery diagnostic will improve qualified exposure without competing with the Claude Code memory, handoff, persistent-project-context, or AI-agent-memory-types pages.
- Candidate evidence: The target has 2 authenticated GSC impressions, 0 clicks, and average position 9.5, but no visible joined query row; the 2-impression page-query visibility gap remains explicit. Same-range Vercel reports 1 visitor and 1 pageview. Two independent Reddit questions observed at `2026-07-25T01:58:34Z` have +8 score snapshots each. Independently authored Anthropic issues #27298 and #34556 have 24 comments and 2 reactions, and 61 comments and 5 reactions, respectively. Current Claude Code memory and session docs distinguish fresh sessions, resume, CLAUDE.md, auto memory, and compaction; current Wenlan source and docs support the brief, recall, capture, and handoff loop. Full URLs, dates, native units, limitations, and overlap analysis are in `docs/seo-audits/2026-07-25-context-loss-diagnostic-prelaunch.md`. External observations are demand discovery only, not GSC input or keyword volume.
- Baseline: GSC property totals are 7 clicks and 310 impressions; visible-query totals are 1 click and 75 impressions, leaving a 6-click and 235-impression visibility gap. The target has 2 impressions, 0 clicks, and average position 9.5, while its visible joined query total is 0 rows and the 2-impression page-query gap remains unknown. Vercel separately reports 1,402 visitors and 1,593 pageviews property-wide and 1 visitor and 1 pageview for the target. GitHub reports 47 Wenlan total stars. Umami and Vercel custom CTA events remain unavailable or account-gated. No source-to-page join or causal inference is made.
- Change: Refresh only the existing English `/learn/ai-coding-agent-loses-context` title metadata, description, quick answer, diagnosis, recovery checklist, FAQ, maintained source links, and related links. Keep the URL and H1. Distinguish exact native-session resume, project instructions or native memory, handoffs, and a shared durable-memory boundary; add the verified Wenlan `/brief`, `/recall`, `/capture`, `/handoff` loop. Add no zh-TW or zh-CN route, `FAQPage` JSON-LD, indexing request, or external distribution.
- Publish date: not-published
- Index date: unknown-existing-route
- Minimum exposure: 5 GSC target-page impressions in the first 28 complete post-deploy days
- Success criteria: After at least 5 GSC target-page impressions, the target earns at least 1 GSC click or average position is 8.0 or better; Vercel target-page visitors and GitHub stars are reported separately without a causal claim.
- Failure criteria: After 28 complete post-deploy days and at least 5 GSC target-page impressions, the target has 0 clicks and average position is worse than 15.0. Fewer than 5 impressions is inconclusive; after minimum exposure, 0 clicks with average position from 8.1 through 15.0 is also inconclusive.
- Stop criteria: Stop or hold if maintained sources do not support a native-memory claim, the page overlaps an existing search job, another controller edits the route, or the change creates a canonical, robots, noindex, structured-data, sitemap, locale, source-link, internal-link, or rendered-layout regression.
- 24h readout: pending — verify the live route, title, metadata, canonical, indexability, structured data, maintained references, internal links, locale non-regression, production render, and separate source-native observations without an SEO-success judgment
- 7d readout: pending — report GSC latency and target-page clicks, impressions, and position when available, Vercel target-page presence when available, and GitHub stars separately
- W2 readout: pending — apply the minimum-exposure guard and inspect whether the diagnostic remains distinct from native Claude Code memory, handoff, persistent-project-context, and taxonomy pages
- W4 readout: pending — evaluate the predeclared success, failure, or inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains useful
- Result: pending
- Decision: wait
- Next step: make the focused article contract pass, then complete full SEO/i18n/lint/build/technical, rendered, and independent-review gates before requesting explicit publication approval
<!-- EXPERIMENT-RECORD:END -->

### Campaign observation — 2026-07-25T02:09:09Z

- Experiment: `EXP-2026-07-25-context-loss-diagnostic-refresh`
- Local preparation: complete
- Change: refreshed the existing English
  `/learn/ai-coding-agent-loses-context` diagnostic without changing the URL
  or H1; separated native session resume, project instructions or native
  memory, handoffs, and durable cross-session or cross-tool knowledge
- Evidence: retained the authenticated target baseline of 2 GSC impressions,
  0 clicks, and average position 9.5; retained the empty visible joined query
  set and two-impression page-query visibility gap; retained Vercel's separate
  1 visitor and 1 pageview target-route observation
- Review repair: independent review found that the existing-page refresh would
  otherwise present the update date as a new publication date. Added
  `publishedAt` pass-through, pinned the original date to `2026-06-06`, kept
  `updatedAt: "2026-07-25"`, and added a focused regression assertion
- Verification: Goal verifier passed; focused test completed RED to GREEN; SEO
  tests 185/185; i18n tests 53/53; TypeScript lint, weekly sample, build,
  built technical SEO, built locale checks, and `git diff --check` passed
- Rendered QA: the final build passed complete desktop and 390 px mobile
  segmented inspection, exact canonical, `index, follow`, Article and
  BreadcrumbList schema, stable original and modified dates, maintained
  references, visible FAQ interaction, no `FAQPage`, no page overflow, and no
  browser warning or error
- Locale decision: English refresh only; unsupported zh-TW and zh-CN article
  routes remain intentional 404s
- Approval: at `2026-07-25T02:09:09Z`, the controller recorded the user's
  approval for commit, push, PR, merge, deployment, and production
  verification
- Still unapproved: request indexing, GSC validation, Reddit or other external
  publication, OSS submission, paid acquisition, and metric-definition changes
- Next step: publish through the normal PR gate, verify production, append the
  production readout, and release the single production slot

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-25-context-loss-diagnostic-refresh at 2026-07-25T02:15:21Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-25-context-loss-diagnostic-refresh
- Observed at: 2026-07-25T02:15:21Z
- Readout: correction
- Status: live
- Publish date: 2026-07-25
- Production-in-flight changes: 0
- Evidence: PR #80 merged at `2026-07-25T02:14:16Z` as `338f5a510d0294b69b7b691d82b6da9e42481a9b`; Vercel production completed successfully at `2026-07-25T02:15:21Z`. The deployed technical audit passed robots, 110 sitemap URLs, 14 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL exclusions. The live English route returned HTTP 200 with the expected title and H1, exact self-canonical, `index, follow`, SoftwareApplication, WebSite, Organization, Article, and BreadcrumbList JSON-LD, five maintained source links, `datePublished: "2026-06-06"`, `dateModified: "2026-07-25"`, and no `FAQPage`. The unsupported zh-TW and zh-CN routes returned 404 and were absent from the sitemap. Complete desktop and 390 px mobile production renders covered the full page without document overflow or browser warning/error, and the first FAQ opened with the expected native-session versus durable-memory answer.
- Metric interpretation: The authenticated pre-publish property baseline remains 7 GSC clicks and 310 impressions; visible-query totals remain 1 click and 75 impressions, leaving a 6-click and 235-impression visibility gap. The target baseline remains 2 impressions, 0 clicks, and average position 9.5 with no visible joined query row; its two-impression page-query visibility gap remains unknown. Same-range Vercel remains 1,402 property visitors and 1,593 pageviews, with 1 visitor and 1 pageview for the target route. GitHub REST reports 47 total Wenlan stars. No post-deploy SEO result, source-to-page session, CTA, or causal effect is inferred at production completion.
- Result: pending
- Decision: wait
- Unperformed gated actions: no indexing request, GSC validation, Reddit or other external post, OSS submission, paid acquisition, or metric-definition change
- Next step: run the 24-hour technical/evidence readout after `2026-07-26T02:15:21Z`; this production-verified measurement cohort does not consume the production slot
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-26T01:47:53Z — due 24-hour cohort evidence

- Record type: campaign-observation
- Scope: shared evidence for the seven 24-hour readouts due from the Learn-hub
  refresh through the Basic Memory comparison refresh; the AI-agent-memory
  types and context-loss cohorts were not yet due at this observation time
- Search Console: the latest authenticated Friday weekly range remains
  `2026-06-26..2026-07-23`, before these deployments. Property totals are
  7 clicks and 310 impressions; visible-query totals are 1 click and
  75 impressions; the query visibility gap is 6 clicks and 235 impressions.
  This range cannot measure a post-deploy 24-hour cohort and is not treated as
  zero post-deploy demand.
- Vercel: the same complete range reports 1,402 visitors and 1,593 pageviews,
  including 255 direct visitors and 319 direct pageviews. The existing
  qualified-source allowlist sums to 1,149 visitors across separate referrer
  rows and is not deduplicated. The range predates these deployments and
  cannot be joined to a post-deploy route cohort.
- GitHub: the read-only REST observation reports 47 total Wenlan stars.
  Vercel custom events remain account-gated and no authenticated Umami
  observation is available, so GitHub outbound and CTA are not reported.
- Deployed technical SEO: robots passed; the live sitemap contains 110 URLs;
  14 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence,
  25 redirects, six bridge-host redirects, and legacy-URL exclusions passed.
  The production locale matrix passed 19 expected HTTP 200 routes and five
  expected hard 404 routes.
- Live cohort routes: `/learn`,
  `/learn/distilled-wiki-pages-ai-memory`, `/learn/mcp-memory-server`,
  `/learn/cursor-claude-code-shared-memory`,
  `/learn/review-before-trust-ai-memory`,
  `/learn/wenlan-vs-claude-mem`,
  `/learn/wenlan-vs-superlocal-memory`, and
  `/learn/wenlan-vs-basic-memory` each returned HTTP 200 with the exact
  self-canonical and `index, follow`. The Learn hub retained
  `CollectionPage` and `BreadcrumbList`; every article retained `Article` and
  `BreadcrumbList`; none emitted `FAQPage`. The MCP source retained exactly
  one link to the shared-memory target.
- Production render: fresh desktop and mobile evidence covered all eight
  routes. Document and H1 scroll widths equaled their client widths on every
  route; comparison tables remained within their rendered containers; browser
  warning/error logs were empty. The in-app browser's long-page full-page
  capture stitched repeated viewport segments on some routes, so those
  artifacts are not interpreted as page regressions. Objective DOM geometry,
  fresh viewport evidence, and prior/current desktop image comparisons remain
  the render gate. The unchanged LLM-wiki desktop capture was pixel-identical
  to its production reference; the stale-memory desktop comparison remained
  96/100 similar with differences concentrated near the long-page bottom.
  Evidence is under
  `/tmp/wenlan-seo/visual-qa/2026-07-25-due-24h-readouts/`.
- Interpretation: technical health passed. No SEO success, source-to-page
  session, CTA, or causal effect is inferred at 24 hours.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-learn-hub-exposure-refresh at 2026-07-26T01:47:53Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-learn-hub-exposure-refresh
- Observed at: 2026-07-26T01:47:53Z
- Readout: 24h
- Status: measuring
- Evidence: The shared batch observation above passed the live route, canonical, indexability, locale, schema, technical, and render gates. The latest authenticated GSC range ends before deployment; its target baseline remains 0 clicks, 71 impressions, and average position 15.6 for `/learn`. Same-range Vercel remains 98 visitors and 100 pageviews for `/learn`; GitHub reports 47 stars. No complete post-deploy search or visitor cohort is available.
- Result: pending
- Decision: wait
- Next step: run the 7-day readout after `2026-07-31T19:18:03Z`; apply the 100-impression minimum-exposure guard and keep source-native metrics separate
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-llm-wiki-category-refresh at 2026-07-26T01:47:53Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-llm-wiki-category-refresh
- Observed at: 2026-07-26T01:47:53Z
- Readout: 24h
- Status: measuring
- Evidence: The shared batch observation above passed the live route, reciprocal locale alternates, canonical, indexability, schema, technical, and render gates. The latest authenticated GSC range ends before deployment; its target baseline remains 0 clicks, 2 impressions, and average position 3.5 for `/learn/distilled-wiki-pages-ai-memory`. Same-range Vercel remains 4 visitors and 4 pageviews for the target; GitHub reports 47 stars. No complete post-deploy search or visitor cohort is available.
- Result: pending
- Decision: wait
- Next step: run the 7-day readout after `2026-07-31T20:19:21Z`; apply the 10-impression minimum-exposure guard and keep the LLM-wiki category separate from source-backed trust mechanics
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-mcp-shared-memory-exposure at 2026-07-26T01:47:53Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-mcp-shared-memory-exposure
- Observed at: 2026-07-26T01:47:53Z
- Readout: 24h
- Status: measuring
- Evidence: The shared batch observation above passed both live routes, the source's single visible target link, the target canonical and indexability, schema, locale, technical, and render gates. The latest authenticated GSC range ends before deployment; its target baseline remains 0 clicks, 8 impressions, and average position 20.8, while the source baseline remains 0 clicks, 2 impressions, and average position 5.5. Same-range Vercel remains 291 visitors and 293 pageviews for the source; the target is absent from the returned top-page export, so no zero is inferred. GitHub reports 47 stars. No source-to-target session or complete post-deploy cohort is available.
- Result: pending
- Decision: wait
- Next step: run the 7-day readout after `2026-07-31T21:13:05Z`; apply the 10-impression target minimum and do not infer source-to-target attribution
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-stale-ai-memory-diagnostic at 2026-07-26T01:47:53Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-stale-ai-memory-diagnostic
- Observed at: 2026-07-26T01:47:53Z
- Readout: 24h
- Status: measuring
- Evidence: The shared batch observation above passed the live route, canonical, indexability, schema, locale, technical, and render gates. The target remains absent from the latest authenticated GSC page export, whose range ends before deployment; absence is not reported as zero. Same-range Vercel remains 1 visitor and 1 pageview for the target; GitHub reports 47 stars. No complete post-deploy search or visitor cohort is available.
- Result: pending
- Decision: wait
- Next step: run the 7-day readout after `2026-07-31T23:08:30Z`; apply the 5-impression minimum-exposure guard and keep failure-mode intent separate from generic AI memory
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-claude-mem-comparison-refresh at 2026-07-26T01:47:53Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-claude-mem-comparison-refresh
- Observed at: 2026-07-26T01:47:53Z
- Readout: 24h
- Status: measuring
- Evidence: The shared batch observation above passed the live route, canonical, indexability, schema, locale, technical, and render gates. The latest authenticated GSC range ends before deployment; its target baseline remains 0 clicks, 7 impressions, and average position 14.4 for `/learn/wenlan-vs-claude-mem`. Same-range Vercel remains 1 visitor and 1 pageview for the target; GitHub reports 47 stars. No complete post-deploy search or visitor cohort is available.
- Result: pending
- Decision: wait
- Next step: run the 7-day readout after `2026-07-31T23:34:19Z`; apply the 5-impression minimum-exposure guard and inspect comparison-intent overlap separately
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-superlocalmemory-comparison-refresh at 2026-07-26T01:47:53Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-superlocalmemory-comparison-refresh
- Observed at: 2026-07-26T01:47:53Z
- Readout: 24h
- Status: measuring
- Evidence: The shared batch observation above passed the live route, canonical, indexability, schema, locale, technical, and render gates. The latest authenticated GSC range ends before deployment; its target baseline remains 0 clicks, 16 impressions, and average position 8.6 for `/learn/wenlan-vs-superlocal-memory`. Same-range Vercel remains 7 visitors and 7 pageviews for the target; GitHub reports 47 stars. No complete post-deploy search or visitor cohort is available.
- Result: pending
- Decision: wait
- Next step: run the 7-day readout after `2026-08-01T00:05:36Z`; apply the 5-impression minimum-exposure guard and inspect local-first comparison overlap separately
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-25-basic-memory-comparison-refresh at 2026-07-26T01:47:53Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-25-basic-memory-comparison-refresh
- Observed at: 2026-07-26T01:47:53Z
- Readout: 24h
- Status: measuring
- Evidence: The shared batch observation above passed the live route, canonical, indexability, schema, locale, technical, and render gates. The latest authenticated GSC range ends before deployment; its target baseline remains 1 click, 20 impressions, and average position 14.6. Joined visible rows remain 0 clicks and 5 impressions, so the page click remains unattributed. Same-range Vercel remains 5 visitors and 5 pageviews for the target; GitHub reports 47 stars. No complete post-deploy search or visitor cohort is available.
- Result: pending
- Decision: wait
- Next step: run the 7-day readout after `2026-08-01T01:04:56Z`; apply the 5-impression minimum-exposure guard and keep the unattributed page click separate from visible product-name queries
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-26T01:51:16Z — next-candidate demand gate

- Record type: campaign-observation
- Decision: no new English, zh-TW, or zh-CN experiment currently passes all
  five candidate gates
- English: repeated agent-memory taxonomy, context-loss, stale-memory, MCP
  shared-memory, LLM-wiki, Basic Memory, claude-mem, and SuperLocalMemory
  demand is already covered by live measurement cohorts. The latest
  authenticated GSC maps the visible Claude Code memory, MCP memory, and Basic
  Memory terms to existing pages and supplies no new recurring non-brand
  cluster with a clean coverage gap.
- zh-TW: the modifier-qualified Obsidian, Claude Code, and MCP intent is
  already covered by the live Obsidian localization. `AI 筆記` remains
  adjacent NotebookLM, Notion, meeting-note, and note-tooling demand without a
  clean Wenlan intent.
- zh-CN: no inspectable Simplified Chinese demand observation supports a new
  localized page; Taiwan or Worldwide evidence is not extrapolated.
- Trends interpretation: the committed 53-row, Worldwide, English,
  past-12-month `AI agent memory` versus `agent memory` series remains a
  request-relative `0–100` category signal, not exact-query demand or search
  volume.
- Minimum missing evidence: a later authenticated GSC `query + page` window
  must expose a recurring non-brand cluster that no existing page answers
  cleanly. A localized candidate also needs matching locale-specific query,
  Trends, or local-language community evidence.
- Next step: wait for the next authenticated GSC window while keeping the
  already scheduled technical/evidence readouts; do not manufacture an
  experiment from generic Trends, Vercel totals, or incomplete cohort data

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-18-claude-code-memory-refresh at 2026-07-26T02:04:08Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-18-claude-code-memory-refresh
- Observed at: 2026-07-26T02:04:08Z
- Readout: 7d
- Status: measuring
- Evidence: The latest authenticated Friday range is
  `2026-06-26..2026-07-23`, so it does not contain seven complete
  post-deploy days after production completed at `2026-07-19T00:26:09Z`.
  GSC property totals are 7 clicks and 310 impressions; visible-query totals
  are 1 click and 75 impressions; the query visibility gap is 6 clicks and
  235 impressions. The target remains at 0 clicks, 23 impressions, and
  average position 38.7. Its five predeclared visible Claude-memory query
  rows remain at 0 clicks, 9 impressions, and 50.0
  impression-weighted average position. The rolling page row and fixed
  visible cluster therefore match the pre-publish baseline, but they are not
  a complete seven-day post-deploy cohort and do not establish a refresh
  effect. The refresh has no confirmed post-change crawl or index date, so
  the 25-impression minimum-exposure clock cannot be proven from this range.
- Vercel: The same complete range reports 1,402 raw visitors and 1,593
  pageviews, including 255 direct visitors and 319 direct pageviews. The
  existing qualified-source allowlist sums to 1,149 visitors across separate
  referrer rows and is not deduplicated. The target reports 7 visitors and
  19 pageviews, compared with the separate 3-visitor and 3-pageview
  pre-publish baseline. The date ranges differ and the current range is not
  seven complete post-deploy days, so no lift, source-to-page session, or
  causal claim is inferred. Unique acquisition-surface visitors remain
  unavailable.
- Technical and source evidence: The deployed technical audit passed after
  the latest production deployment with 110 sitemap URLs. The live target
  returned HTTP 200 with the exact self-canonical, `index, follow`, Article
  and BreadcrumbList JSON-LD, `datePublished: "2026-06-07"`,
  `dateModified: "2026-07-18"`, the current official Claude Code memory
  source, and no `FAQPage`. Its 24-hour production render evidence remains
  green; no page change has been made since that readout.
- GitHub and CTA: GitHub REST reports 47 total Wenlan stars. Vercel custom
  events remain account-gated and no authenticated Umami observation is
  available, so GitHub outbound and CTA are not reported.
- Result: inconclusive
- Decision: wait
- Unperformed gated actions: no indexing request, GSC validation, Reddit or
  other external post, OSS submission, paid acquisition, or metric-definition
  change
- Next step: run the W2 readout after `2026-08-02T00:26:09Z`; use the next
  authenticated Friday evidence, apply the original 25-impression and
  qualified-cluster guards, and keep the unknown post-change crawl date
  explicit
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-25-ai-agent-memory-types at 2026-07-26T02:04:08Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-25-ai-agent-memory-types
- Observed at: 2026-07-26T02:04:08Z
- Readout: 24h
- Status: measuring
- Evidence: The latest authenticated GSC and complete Vercel range remains
  `2026-06-26..2026-07-23`, before this route was deployed. GSC property
  totals are 7 clicks and 310 impressions; visible-query totals are 1 click
  and 75 impressions; the query visibility gap is 6 clicks and
  235 impressions. The net-new target is absent from the pre-deploy page
  table, so no zero, index state, or post-deploy demand is inferred. Vercel
  separately reports 1,402 raw visitors and 1,593 pageviews, 255 direct
  visitors and 319 direct pageviews, and a non-deduplicated 1,149-visitor
  qualified-source aggregate. The range predates deployment and provides no
  target baseline, acquisition-surface visitor count, or source-to-page join.
- Technical and render evidence: The deployed technical audit passed after
  the latest production deployment with 110 sitemap URLs. The live English
  route returned HTTP 200 with the expected title and H1, exact
  self-canonical, `index, follow`, Article and BreadcrumbList JSON-LD,
  `datePublished: "2026-07-25"`, `dateModified: "2026-07-25"`, four
  maintained source links, two visible FAQ questions, and no `FAQPage`.
  Unsupported zh-TW and zh-CN routes returned HTTP 404. Fresh Chrome
  desktop and mobile renders showed the expected first screen; document and
  H1 scroll widths matched their client widths, and no page warning or error
  was recorded.
- GitHub and CTA: GitHub REST reports 47 total Wenlan stars. Vercel custom
  events remain account-gated and no authenticated Umami observation is
  available, so GitHub outbound and CTA are not reported.
- Result: pending
- Decision: wait
- Unperformed gated actions: no indexing request, GSC validation, Reddit or
  other external post, OSS submission, paid acquisition, or metric-definition
  change
- Next step: run the 7-day readout after `2026-08-01T01:49:40Z`; apply the
  original 5-impression minimum-exposure guard and keep English, zh-TW, and
  zh-CN evidence separate
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-25-context-loss-diagnostic-refresh at 2026-07-26T02:15:47Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-25-context-loss-diagnostic-refresh
- Observed at: 2026-07-26T02:15:47Z
- Readout: 24h
- Status: measuring
- Evidence: The latest authenticated GSC and complete Vercel range remains
  `2026-06-26..2026-07-23`, before this refresh was deployed. GSC property
  totals are 7 clicks and 310 impressions; visible-query totals are 1 click
  and 75 impressions; the query visibility gap is 6 clicks and
  235 impressions. The target's pre-publish page row remains 0 clicks,
  2 impressions, and average position 9.5, while its visible joined query set
  remains empty; the two-impression page-query visibility gap is not
  interpreted as a target query or post-deploy result. Vercel separately
  reports 1,402 raw visitors and 1,593 pageviews, 255 direct visitors and
  319 direct pageviews, and a non-deduplicated 1,149-visitor
  qualified-source aggregate. The same pre-deploy range reports 1 visitor and
  1 pageview for the target. It supplies no acquisition-surface visitor
  count, source-to-page join, or post-deploy cohort.
- Technical and locale evidence: The post-boundary deployed audit passed
  robots, 110 sitemap URLs, 14 key pages, six utility noindex headers,
  sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects,
  and legacy-URL exclusions. The production locale matrix passed 19 expected
  HTTP 200 routes and five expected hard 404 routes. The live English target
  returned HTTP 200 with its exact self-canonical, `index, follow`, Article
  and BreadcrumbList JSON-LD, `datePublished: "2026-06-06"`,
  `dateModified: "2026-07-25"`, five maintained source links, four related
  internal links, and no `FAQPage`. Unsupported zh-TW and zh-CN routes
  returned HTTP 404.
- Render evidence: Fresh desktop and mobile Chrome renders in this readout
  sequence showed the expected title, H1, description, and first-screen
  layout. Document and H1 scroll widths matched their client widths. The
  post-boundary live HTML and technical checks confirmed the same production
  artifact. No Wenlan-origin browser warning or error appeared; one recorded
  error originated from an unrelated Chrome extension URL and is not treated
  as a page regression.
- GitHub and CTA: GitHub REST reports 47 total Wenlan stars. Vercel custom
  events remain account-gated and no authenticated Umami observation is
  available, so GitHub outbound and CTA are not reported.
- Result: pending
- Decision: wait
- Unperformed gated actions: no indexing request, GSC validation, Reddit or
  other external post, OSS submission, paid acquisition, or metric-definition
  change
- Next step: run the 7-day readout after `2026-08-01T02:15:21Z`; apply the
  original 5-impression minimum-exposure guard and keep this diagnostic
  distinct from native Claude Code memory, handoff, persistent-project
  context, and taxonomy pages
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-ai-work-memory-knowledge-base-refresh at 2026-07-26T02:19:26Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-ai-work-memory-knowledge-base-refresh
- Observed at: 2026-07-26T02:19:26Z
- Readout: 24h
- Status: measuring
- Timing: This readout is late and is recorded at the actual observation
  time. It is not backdated to the original boundary at
  `2026-07-25T18:54:22Z`.
- Evidence: The latest authenticated GSC and complete Vercel range remains
  `2026-06-26..2026-07-23`, before this refresh was deployed. GSC property
  totals are 7 clicks and 310 impressions; visible-query totals are 1 click
  and 75 impressions; the query visibility gap is 6 clicks and
  235 impressions. The target remains at its pre-publish 0 clicks,
  9 impressions, and average position 8.0. No visible joined target query is
  claimed. Vercel separately reports 1,402 raw visitors and 1,593 pageviews,
  255 direct visitors and 319 direct pageviews, and a non-deduplicated
  1,149-visitor qualified-source aggregate. The target reports 1 visitor and
  1 pageview in that pre-deploy range; no post-deploy cohort,
  acquisition-surface visitor count, source-to-page join, or causal effect is
  inferred.
- Technical, locale, and render evidence: The post-boundary deployed audit
  passed robots, 110 sitemap URLs, 14 key pages, six utility noindex headers,
  sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects,
  and legacy-URL exclusions. The live English target returned HTTP 200 with
  its refreshed title, exact self-canonical, `index, follow`, Article and
  BreadcrumbList JSON-LD, `datePublished: "2026-07-24"`,
  `dateModified: "2026-07-24"`, maintained first-party source links, and no
  `FAQPage`; unsupported zh-TW and zh-CN routes returned HTTP 404. The
  production desktop/mobile render evidence from the deployment readout
  remains green, and no page change has been made since that verification.
- GitHub and CTA: GitHub REST reports 47 total Wenlan stars. Vercel custom
  events remain account-gated and no authenticated Umami observation is
  available, so GitHub outbound and CTA are not reported.
- Result: pending
- Decision: wait
- Unperformed gated actions: no indexing request, GSC validation, Reddit or
  other external post, OSS submission, paid acquisition, or metric-definition
  change
- Next step: run the 7-day readout after `2026-07-31T18:54:22Z`; apply the
  original 20-impression minimum-exposure guard and keep this Source/Memory/Page
  role comparison distinct from generic AI knowledge-base demand
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-ai-work-memory-knowledge-base-refresh correction at 2026-07-26T02:24:10Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-ai-work-memory-knowledge-base-refresh
- Observed at: 2026-07-26T02:24:10Z
- Readout: correction
- Status: active
- Evidence: This corrects the date-health interpretation in the preceding
  24-hour readout. The route and its canonical,
  indexability, maintained sources, unsupported locale 404s, and retained
  render evidence were healthy, but the date-health interpretation was not.
  Live Article JSON-LD emits `datePublished: "2026-07-24"` and
  `dateModified: "2026-07-24"`. Git history establishes that the page first
  shipped with the article registry's `2026-05-27` date, so the refresh
  rewrote the original publication date instead of preserving it.
- Local change: add `publishedAt: "2026-05-27"` while retaining
  `updatedAt: "2026-07-24"`, protected by a focused regression assertion.
- Scope: metadata and Article JSON-LD only. No visible copy, URL, canonical,
  hreflang, sitemap membership, locale availability, schema type,
  `FAQPage`, experiment baseline, or metric definition changes.
- Approval: At `2026-07-26T02:24:10Z`, the user approved local preparation,
  commit, Git push, PR creation, merge, production deployment, and production
  verification for this correction.
- Production slot: occupied until the live Article JSON-LD and deployed
  technical checks verify the correction.
- Unperformed separately gated actions: no indexing request, GSC validation,
  Reddit or other external post, OSS submission, paid acquisition, or
  metric-definition change.
- Result: pending
- Decision: refresh
- Next step: prove the focused test GREEN, run the full relevant build and SEO
  verification, obtain independent review, publish the approved correction,
  and append production evidence without changing the experiment's 7-day
  readout schedule.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-ai-work-memory-knowledge-base-refresh production correction at 2026-07-26T02:32:30Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-ai-work-memory-knowledge-base-refresh
- Observed at: 2026-07-26T02:32:30Z
- Readout: correction
- Status: measuring
- Evidence: PR #83 merged at `2026-07-26T02:30:28Z` as
  `a54f13f891d472774f48cafb8798955bf8906ce4`; Vercel production completed at
  `2026-07-26T02:31:19Z`. The deployed technical audit passed robots,
  110 sitemap URLs, 14 key pages, six utility noindex headers, sitemap-wide
  `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL
  exclusions. The production locale matrix passed 19 expected HTTP 200 routes
  and five expected hard 404 routes. The live English target retained its
  exact self-canonical and `index, follow`; Open Graph and Article JSON-LD now
  emit `datePublished: "2026-05-27"` and
  `dateModified: "2026-07-24"`, with no `FAQPage`. This verifies the
  technical correction only and does not establish search-performance lift.
- Production slot: released after production verification.
- Unperformed separately gated actions: no indexing request, GSC validation,
  Reddit or other external post, OSS submission, paid acquisition, or
  metric-definition change.
- Result: pending
- Decision: wait
- Next step: run the experiment's original 7-day readout after
  `2026-07-31T18:54:22Z`; apply the predeclared 20-impression minimum-exposure
  guard without attributing any effect to this technical correction.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-26T02:59:07Z — provider-neutral CTA measurement correction prepared

- Record type: campaign-observation
- Technical correction:
  `TECH-2026-07-26-provider-neutral-cta-tracking`
- Status: active local preparation; consumes the single production slot
- Evidence: The live `wenlan.app` homepage returned HTTP 200 at
  `2026-07-26T02:56:08Z` and loaded the configured Umami Cloud tracker.
  Before this correction, `TrackedLink` sent the four acquisition
  interactions only through `@vercel/analytics`, while the authenticated
  weekly evidence kept Vercel custom events account-plan-gated. No
  `github_outbound` total or CTA baseline is inferred.
- Change: normalize the existing events to `github_outbound`,
  `get_started_click`, `learn_article_click`, and `setup_path_click`; keep
  Vercel for pageviews; route custom events only to configured Umami; allow
  only placement, locale, context, and a fixed destination category; harden
  the tracker to `wenlan.app`, exclude search parameters, and respect Do Not
  Track; disclose public website analytics separately from installed Wenlan
  product telemetry.
- Privacy: no memory content, code, commands, user paths, search terms, names,
  emails, query strings, full URLs, or stable account identifiers are sent.
- RED/GREEN: the source contract failed while it still required Vercel custom
  events, then passed after the provider-neutral seam and disclosure were
  implemented. Runtime interaction tests pass for all four event mappings and
  safe no-op behavior when Umami is unavailable.
- Metric role: this enables a future diagnostic CTA observation only.
  `github_outbound` is not a star, no metric definition changes, and no
  search-performance or causal claim is made.
- Approval: At `2026-07-26T03:07:04Z`, the user approved commit, Git push, PR
  creation, merge, automatic Vercel deployment, and production verification.
- Remaining boundary: no synthetic production event, indexing request, GSC
  validation, external publication, OSS submission, paid acquisition, account
  mutation, or metric-definition change is authorized.
- Evidence record:
  `docs/seo-audits/2026-07-25-cta-measurement-prelaunch.md`
- Local verification: SEO tests 187/187; i18n tests 53/53; TypeScript, Goal
  verifier, weekly sample, production build, built technical SEO, built locale
  matrix, desktop/mobile render, tracked CTA navigation, and
  `git diff --check` pass. Independent review returned APPROVE with no P0-P2
  findings.
- Next step: publish and production-verify the approved technical correction

### 2026-07-26T03:14:06Z — provider-neutral CTA measurement correction production verification

- Record type: campaign-observation
- Technical correction:
  `TECH-2026-07-26-provider-neutral-cta-tracking`
- Status: production-verified; production slot released
- Publication: PR #86 merged at `2026-07-26T03:12:02Z` as
  `7674c47405ed42a71f8776b8276093fbea05fefd`; Vercel production completed at
  `2026-07-26T03:12:51Z`.
- Live evidence: the configured Umami tag exposes the approved
  `data-domains="wenlan.app"`, `data-exclude-search="true"`, and
  `data-do-not-track="true"` attributes. The public website-analytics
  disclosure and normalized `github_outbound` and `get_started_click` event
  code are live.
- Technical evidence: the deployed audit passed robots, 110 sitemap URLs, 14
  key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25
  redirects, six bridge-host redirects, and legacy-URL exclusions.
- Metric role: this verifies deployment and future measurement readiness
  only. No CTA count, star attribution, SEO lift, or causal result is inferred.
  Actual Umami totals remain manual/account-gated until authenticated access
  is available.
- Unperformed separately gated actions: no synthetic production event,
  indexing request, GSC validation, external publication, OSS submission,
  paid acquisition, account mutation, or metric-definition change.
- Next step: wait for real authenticated Umami observations and the scheduled
  Goal readouts; do not infer zero events from missing dashboard access.

### 2026-07-26T03:21:39Z — Wenlan source release-boundary audit

- Record type: campaign-observation
- Technical correction: `TECH-2026-07-26-source-release-boundary`
- Status: active local preparation; no public page change
- Source evidence: Wenlan's published release remains `v0.14.1`, while remote
  main at `65013459b0909cbb1899e9fd1667f80bad981194` includes merged PR #390
  and PR #382. wenlan-app's published release remains `v0.14.0`, while remote
  main at `3ef7332c6a37e2ae5810b89ad1ba630b4d5d426a` includes merged PR #98 and
  PR #96.
- Checkout limitation: both local source checkouts were two commits behind.
  The wenlan-app checkout also contained unrelated user changes, so neither
  working tree was pulled, reset, or modified. Remote refs and GitHub were
  inspected read-only.
- Finding: the Wenlan contract already resolves the latest version tag. The
  wenlan-app contract instead read the mutable working tree and accepted its
  unreleased `0.14.1` state as a release even though the latest published app
  tag is `v0.14.0`.
- RED/GREEN: the focused contract failed with actual `v0.14.1` versus expected
  published tag `v0.14.0`. It passes 5/5 after reading immutable tag files with
  `git show`, failing closed without tags, and supporting both backend-pin
  manifest shapes. The complete SEO contract passes 189/189; TypeScript, Goal
  verifier, and `git diff --check` also pass. Independent review returned
  APPROVE with no remaining P0-P2 findings after mixed-manifest parsing was
  made fail-closed.
- Product decision: PR #382, #390, #96, and #98 remain merged but unreleased.
  Do not change stable website product claims until a containing release is
  published; no content experiment starts from this audit.
- Evidence:
  `docs/seo-audits/2026-07-25-source-release-boundary.md`
- Approval boundary: local preparation only. No push, merge, deployment,
  indexing request, GSC validation, external publication, source-repository
  mutation, or metric-definition change is authorized.
- Next step: present the verified local diff for explicit push, merge, and
  automatic deployment approval.

### 2026-07-27T03:02:34Z — Wenlan v0.15.0 release/download correction prepared

- Record type: campaign-observation
- Technical correction: `TECH-2026-07-26-source-release-boundary`
- Status: active local public-site preparation; consumes the single production
  slot
- Changed premise: Wenlan `v0.15.0` was published at
  `2026-07-26T05:13:54Z`. The release now provides native Windows x64, macOS
  Apple silicon, Linux x64, and Linux ARM64 runtime archives. The Windows ZIP
  includes `wenlan.exe`, `wenlan-server.exe`, `wenlan-mcp.exe`,
  `onnxruntime.dll`, `vulkan-1.dll`, and the Vulkan runtime license.
- Desktop-app boundary: wenlan-app's latest published release remains
  `v0.14.0`. Later Windows-compatible main work does not establish a
  downloadable Windows desktop app, installer, signer, or updater.
- Change: centralize exact `v0.15.0` release metadata and four direct assets;
  add the release-backed homepage Download section; point the main homepage
  action at it; add English, Traditional Chinese, and Simplified Chinese
  platform setup; align About, changelog, platform/security/build docs,
  structured data, social image, and sitemap dates; track direct asset clicks
  as bounded `github_outbound` events with `placement="home-download"`.
- URL evidence: read-only HEAD requests followed all four GitHub release
  redirects and returned HTTP 200.
- Local verification: Goal verifier passed; SEO tests 189/189; i18n tests
  53/53; TypeScript passed; the production build generated 211 static pages
  and correctly skipped IndexNow; compiled technical SEO passed 110 sitemap
  URLs, 26 redirects, seven noindex headers, 14 checked HTML pages, and
  sitemap-wide `FAQPage` absence across 114 built HTML files.
- Render verification: Home, Get Started, and About were captured from the
  production build in English, Traditional Chinese, and Simplified Chinese at
  `1440x1000` and `393x852`. All 18 route/viewport pairs returned HTTP 200,
  none had horizontal overflow, all release assets were present, the
  `#download` path and Windows focus target worked, and no page or console
  error appeared. The first visual pass found an unnatural Chinese
  `直 / 接` break and possible `選 / 擇` and `不需 / 要` breaks; the second
  fresh-build pass confirmed the exact word-joiner fix.
- Metric role: this is release accuracy and conversion-path readiness, not
  proof of SEO lift, CTA conversion, star growth, or causal effect.
- Evidence:
  `docs/seo-audits/2026-07-25-source-release-boundary.md`
- Approval boundary: no push, PR, merge, deployment, indexing request, GSC
  validation, external publication, source-repository mutation, OSS
  submission, paid acquisition, account mutation, or metric-definition change
  was performed.
- Next step: obtain explicit push, merge, and automatic deployment approval,
  production-verify the exact runtime/app boundary and four download paths,
  then release the production slot.

### 2026-07-27T03:02:34Z — LLM-wiki, Obsidian, and knowledge-cluster candidate

- Record type: campaign-observation
- Status: queued candidate; not an experiment start and does not consume a
  second production slot
- User intent: improve discovery for `LLM wiki`, modifier-qualified Obsidian,
  AI-native notes, and AI knowledge-base searches without opening overlapping
  URLs.
- Authenticated GSC evidence: `sc-domain:wenlan.app`,
  `2026-06-27..2026-07-24`, reports 7 property clicks and 329 property
  impressions. Visible-query rows report 1 click and 81 impressions, leaving
  a visibility gap of 6 clicks and 248 impressions. The page rows separately
  report 2 impressions at average position 3.5 for the LLM-wiki page,
  4 impressions at 4.5 for the English Obsidian page, and 9 impressions at
  8.0 for the knowledge-base comparison. The visible `llm wiki 2.0` row has
  1 impression at position 13.0.
- Coverage finding: the English Learn hub already has direct search paths to
  all three pages; the knowledge-base page already links to the LLM-wiki and
  Obsidian pages; the zh-TW Obsidian page already covers `AI 筆記` and
  supporting `AI 知識庫` language. The remaining clean gap is that the
  English LLM-wiki page lacks direct related links to the two comparison
  pages, and the English Obsidian page lacks a direct related link back to the
  LLM-wiki category page.
- Demand boundary: Trends retains request-relative `0–100` indices, not search
  volume. `AI notes` / `AI 筆記` is real adjacent demand dominated by note-tool
  and document-QA intent; exact Taiwan `AI 知識庫` remains too sparse for a
  dedicated asset; generic `knowledge base` is too broad without agent,
  local, open-source, or source-backed modifiers.
- Candidate decision: after the current release/download correction is
  production-verified, launch one bounded English internal-link closure across
  the existing pages. Do not rewrite titles, change canonical URLs, create a
  generic notes article, or manufacture zh-CN coverage.
- Evidence:
  `docs/seo-audits/2026-07-26-llm-wiki-obsidian-knowledge-cluster.md`
- Next step: production-verify the current correction, then create the
  immutable experiment start for this cross-link change with its own baseline
  and readout thresholds.

### 2026-07-27T04:00:43Z — v0.15.0 release/download publication approved

- Record type: campaign-approval
- Technical correction: `TECH-2026-07-26-source-release-boundary`
- Status: approved for publication; continues to consume the single production
  slot until production verification
- Approved action: commit the verified local scope, push its existing branch,
  create and merge its pull request, allow the normal automatic Vercel
  deployment, and verify the resulting production surface and direct release
  downloads.
- Approval provenance: the user replied `批准` after receiving the exact
  requested boundary: commit, push, PR, merge, Vercel deployment, production
  verification, then an immediate separately attributable internal-link
  experiment.
- Still unapproved: request indexing, submit GSC validation, publish Reddit or
  other external posts, submit an OSS directory, buy traffic, mutate analytics
  accounts, generate synthetic production events, or change metric
  definitions.
- Next step: run the frozen-contract verifier after this record, commit and
  publish the bounded correction, then append native-unit production evidence.

### 2026-07-27T04:06:15Z — v0.15.0 release/download production verification

- Record type: campaign-observation
- Technical correction: `TECH-2026-07-26-source-release-boundary`
- Status: production-verified; releases the single production slot
- Git evidence: PR #88 merged at `2026-07-27T04:03:09Z` as
  `f8ca1a975f3c567de934dd757023b0b199e61e15`.
- Deployment evidence: the Vercel status for that exact commit changed to
  `success` with `Deployment has completed` at `2026-07-27T04:03:56Z`.
- Technical evidence: the deployed audit passed robots, 110 sitemap URLs, 14
  key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25
  redirects, six bridge-host redirects, and legacy-URL exclusions.
- Render and asset evidence: English, zh-TW, and zh-CN homepages returned HTTP
  200 with the localized v0.15.0 copy and all four exact asset links. The
  Windows x64, macOS Apple silicon, Linux x64, and Linux ARM64 release assets
  each returned HTTP 200.
- Metric interpretation: this proves deployment and download availability
  only. No SEO lift, CTA conversion, source-to-page session, star attribution,
  setup success, or causal result is inferred.
- Unperformed gated actions: no indexing request, GSC validation, Reddit or
  other external post, OSS submission, paid acquisition, synthetic analytics
  event, account mutation, or metric-definition change.
- Next step: start the separately attributable LLM-wiki, Obsidian, and
  knowledge-cluster internal-link experiment already requested by the user.

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-27-llm-wiki-knowledge-cluster-links

- Record type: experiment-start
- Experiment ID: EXP-2026-07-27-llm-wiki-knowledge-cluster-links
- Status: active
- Data window: 2026-07-25..2026-07-31
- Asset class: integration-hub
- Launched: 2026-07-27
- Hypothesis: Closing the missing related-link edges among Wenlan's existing LLM-wiki, Obsidian AI-memory, and AI knowledge-base pages will increase qualified Google exposure across that cluster without creating a competing URL or changing its category claims.
- Candidate evidence: Authenticated GSC API data for `sc-domain:wenlan.app`, complete days `2026-06-27..2026-07-24`, reports the three existing pages separately; signed-in Trends evidence retains request-relative `0–100` indices for Worldwide English and Taiwan Mandarin demand; current route and content inspection proves the incomplete English cross-link graph. Repeated OSS, Reddit, and maintained first-party evidence supports modifier-qualified LLM-wiki, Obsidian, agent-memory, and knowledge-base jobs. Complete URLs, dates, locales, native units, limitations, candidate gate, and coverage graph are in `docs/seo-audits/2026-07-26-llm-wiki-obsidian-knowledge-cluster.md`. External observations remain demand discovery only and are not GSC input or keyword volume.
- Baseline: GSC property totals are 7 clicks and 329 impressions; visible-query totals are 1 click and 81 impressions, leaving a 6-click and 248-impression visibility gap. The LLM-wiki page has 0 clicks, 2 impressions, and average position 3.5; the English Obsidian page has 0 clicks, 4 impressions, and position 4.5; the knowledge-base comparison has 0 clicks, 9 impressions, and position 8.0. Vercel separately reports 1,406 visitors and 1,612 pageviews property-wide; no target-route or source-to-page baseline is inferred. GitHub reports 47 total Wenlan stars. Umami and Vercel custom CTA observations remain unavailable or account-gated.
- Change: Keep all three existing canonical URLs and visible answers. Add the English knowledge-base and Obsidian comparison routes to the LLM-wiki page's related paths, and add the English LLM-wiki route to the Obsidian comparison's related paths. Leave the already complete knowledge-base links, English Learn-hub cards, zh-TW cluster, and intentionally narrower zh-CN coverage unchanged. Add no article, title rewrite, `FAQPage` JSON-LD, indexing request, or external distribution.
- Publish date: not-published
- Index date: existing-indexed-pages
- Minimum exposure: 15 combined GSC impressions across the three target pages in the first 28 complete post-deploy days
- Success criteria: After 28 complete post-deploy days and at least 15 combined GSC target-page impressions, the cluster earns at least 1 GSC click or at least 30 combined impressions; per-page clicks, impressions, and average positions remain separate, and Vercel, Umami, and GitHub observations are reported separately without a causal claim.
- Failure criteria: After 28 complete post-deploy days and at least 15 combined GSC target-page impressions, the cluster has 0 clicks and no more than 15 combined impressions. A result from 16 through 29 combined impressions with 0 clicks is inconclusive; fewer than 15 impressions is also inconclusive.
- Stop criteria: Stop or hold if a link targets a missing or redirected route, another controller edits either page, the related paths become duplicative or misleading, or the change creates a canonical, indexing, robots, noindex, structured-data, sitemap, locale, publication-date, source-link, or rendered-layout regression.
- 24h readout: pending — verify the two live English related-link sets, the unchanged knowledge-base links, canonical/indexability/schema/FAQ policy, English and Mandarin non-regression, production render, and separate source-native observations without an SEO-success judgment
- 7d readout: pending — report GSC latency plus per-page clicks, impressions, and average position when available; report Vercel target-page presence, Umami internal CTA observations, and GitHub stars separately when available
- W2 readout: pending — apply the minimum-exposure guard and inspect whether the cluster remains category-distinct rather than collapsing LLM wiki, AI notes, Obsidian, and knowledge base into one claim
- W4 readout: pending — evaluate the predeclared success, failure, or inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains useful
- Result: pending
- Decision: wait
- Next step: finish the focused RED-to-GREEN contract, run full SEO/i18n/lint/build/technical and rendered verification, then present the exact diff for separate publication approval
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-27-llm-wiki-knowledge-cluster-links at 2026-07-27T04:45:29Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-27-llm-wiki-knowledge-cluster-links
- Observed at: 2026-07-27T04:45:29Z
- Readout: correction
- Status: stopped
- Evidence: The target LLM-wiki page has 0 clicks, 2 impressions,
  and page-average position 3.5, but both underlying queries are
  privacy-hidden. The authenticated query-plus-page join maps the only visible
  `llm wiki 2.0` row to `https://wenlan.app/zh-TW`, not to the target article.
  Known qualified `llm wiki` query-to-target impressions are therefore 0 for
  `2026-06-27..2026-07-24`. A fixed US English first-page SERP observation
  also did not show Wenlan. Position 3.5 is not an exact-query rank.
- Result: inconclusive
- Decision: stop
- Interpretation: The experiment stopped before publication, so its original
  minimum exposure, success, failure, and readout thresholds will not be
  applied. Do not publish the three related-link changes as a standalone
  experiment; fold the useful links into a stronger existing-page refresh
  with standalone implementation utility.
- Production effect: none. No commit, push, PR, merge, deployment, indexing
  request, validation, or external publication occurred for this standalone
  experiment.
- Next step: start
  `EXP-2026-07-27-llm-wiki-implementation-guide-refresh` in the released
  production slot.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-27-llm-wiki-implementation-guide-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-07-27-llm-wiki-implementation-guide-refresh
- Status: active
- Data window: 2026-07-25..2026-07-31
- Asset class: refresh
- Launched: 2026-07-27
- Hypothesis: Turning the existing English LLM-wiki route into a standalone
  definition, architecture, protocol, verification, failure-repair, and
  adjacent-system decision guide, with contextual inbound links from five
  relevant existing pages, will earn qualified Google exposure or clicks
  without creating a competing URL.
- Candidate evidence: Authenticated GSC API data for `sc-domain:wenlan.app`,
  complete days `2026-06-27..2026-07-24`, reports 2 privacy-hidden target-page
  impressions and no known qualified query-to-target impression. A fixed US
  English first-page SERP did not show Wenlan. Committed signed-in Trends
  observations, Karpathy and Rohitg00 notes, the inspectable LLM-wiki OSS
  surface, and independent Reddit threads repeat high-intent setup, freshness,
  contradiction, context-bloat, Obsidian, Claude Code, MCP, and cross-session
  jobs. Wenlan `v0.15.0` provides maintained first-party commands and
  Source/Memory/Page lifecycle proof. Exact URLs, dates, locales, native units,
  limitations, and the complete candidate gate are in
  `docs/seo-audits/2026-07-27-llm-wiki-implementation-guide-prelaunch.md`.
  External observations remain demand discovery only, not GSC input or
  keyword volume.
- Baseline: GSC property totals are 7 clicks and 329 impressions;
  visible-query totals are 1 click and 81 impressions, leaving a 6-click and
  248-impression visibility gap. The target page has 0 clicks, 2 impressions,
  and page-average position 3.5; both queries are hidden. The visible
  `llm wiki 2.0` row has 0 clicks, 1 impression, and position 13.0 but maps to
  `/zh-TW`, so known qualified query-to-target impressions are 0. Vercel
  separately reports 1,406 visitors and 1,612 pageviews property-wide; no
  source-to-page session is inferred. GitHub reports 47 total Wenlan stars.
  Umami and Vercel custom CTA observations remain unavailable or
  account-gated.
- Change: Keep `/learn/distilled-wiki-pages-ai-memory`, its original
  publication date, English-only availability, sitemap/hreflang behavior,
  Article and BreadcrumbList schemas, visible-only FAQ policy, and CTA
  destination. Refresh H1 and metadata; add the generic four-plane
  architecture, six-command five-minute protocol, observable success checks,
  source-to-memory-to-page evidence trail, five recurring failure repairs,
  and neutral RAG/Obsidian/agent-memory boundaries before the maintained
  Wenlan mapping. Add contextual inbound links from the MCP memory, Claude
  Code memory, AI-agent-memory-types, knowledge-base, and Obsidian pages.
  Retain the prepared related links inside this experiment. Add no new URL,
  Mandarin translation, `FAQPage` JSON-LD, indexing request, or external
  distribution.
- Publish date: not-published
- Index date: existing-indexed-page-date-unavailable
- Minimum exposure: 20 GSC target-page impressions in the first 28 complete
  post-deploy days
- Success criteria: After minimum exposure, at least 1 GSC target-page click
  or at least 40 target-page impressions. Page-average position and visible
  joined query rows remain separate and are not reported as exact-query rank.
- Failure criteria: After 28 complete post-deploy days and minimum exposure,
  the target has 0 clicks, fewer than 40 impressions, and page-average
  position worse than 20.0. Below minimum exposure or any result between the
  success and failure conditions is inconclusive.
- Stop criteria: Stop or hold if a maintained Wenlan command or lifecycle
  claim is invalid, an inbound link is missing or redirected, another
  controller edits the route, or the change creates a canonical, indexing,
  robots, noindex, structured-data, sitemap, locale, publication-date,
  FAQ-policy, source-link, intent-overlap, or rendered-layout regression.
- 24h readout: pending — verify the live route, H1, metadata, six-command
  protocol, contextual inbound paths, canonical/indexability/schema/FAQ
  policy, locale non-regression, and production render without an SEO-success
  judgment
- 7d readout: pending — report GSC latency, target-page clicks, impressions,
  page-average position, and joined visible qualified rows when available;
  report Vercel target presence, authenticated Umami CTA observations, and
  GitHub stars separately
- W2 readout: pending — apply the exposure guard and inspect whether the page
  earns relevant joined `llm wiki`, Claude Code, Obsidian, and RAG-modified
  intent without collapsing into generic AI notes or enterprise
  knowledge-base demand
- W4 readout: pending — evaluate the predeclared success, failure, or
  inconclusive condition without changing thresholds
- W8 readout: pending — record a post-campaign follow-up only if it remains
  useful
- Result: pending
- Decision: wait
- Next step: finish local SEO/i18n/lint/build/technical and rendered
  verification, then present the exact diff for separate publication approval
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-27T04:59:46Z — LLM-wiki implementation guide locally verified

- Record type: campaign-observation
- Current experiment:
  `EXP-2026-07-27-llm-wiki-implementation-guide-refresh`
- Status: active; locally verified; not published; continues to consume the
  single production slot until production verification or a terminal decision
- Evidence correction retained: target-page average position 3.5 remains a
  two-impression page aggregate with both queries hidden. The visible
  `llm wiki 2.0` row maps to `/zh-TW`; known qualified query-to-target
  impressions remain 0. No exact-query rank is inferred.
- Scope: one existing English canonical refreshed with a generic definition,
  four-plane architecture, six-command protocol, observable checks,
  source-to-page evidence trail, five recurring failure repairs, neutral
  adjacent-system boundaries, and maintained Wenlan proof. Five existing
  English pages add contextual inbound links. No URL, locale availability,
  original publication date, sitemap/hreflang behavior, schema type, CTA
  destination, or visible-only FAQ policy changed.
- Contract evidence: the focused acquisition assertion failed before the page
  refresh and passed after it.
- Static verification: Goal PASS; SEO 189/189; i18n 53/53; TypeScript PASS;
  production build PASS with 211 static pages; compiled technical SEO PASS
  with 110 sitemap URLs, 26 redirects, seven noindex headers, 14 checked HTML
  pages, and no `FAQPage` across 114 built HTML files.
- Runtime verification: the locale matrix passed 19 expected HTTP 200 routes
  and five expected hard 404 routes against the isolated production server.
  Fresh rendered QA covered six English direct content/link surfaces at
  desktop and mobile breakpoints plus the existing zh-TW and zh-CN target
  routes on mobile. All five contextual links navigated to the exact target;
  the mobile FAQ opened; no document/H1 overflow, console warning/error, CJK
  clipping, canonical, schema, or FAQ-policy regression was found.
- Evidence path:
  `/private/tmp/wenlan-llm-wiki-visual-qa-2026-07-27/`
- Result: pending; no SEO lift or causal effect is inferred before publication
  or from local verification.
- Unperformed gated actions: no commit, push, PR, merge, deployment, indexing
  request, GSC validation, Reddit or other external post, OSS submission,
  paid acquisition, synthetic analytics event, or metric change.
- Next step: present the exact local diff and verification results for
  separate publication approval.

### 2026-07-27T05:26:43Z — LLM-wiki implementation guide publication approved

- Record type: campaign-observation
- Current experiment:
  `EXP-2026-07-27-llm-wiki-implementation-guide-refresh`
- Status: active; locally verified; publication authorized
- Approval: the user approved commit, Git push, ready PR creation, merge, the
  existing automatic Vercel deployment triggered by merge, and read-only
  production verification.
- Boundaries retained: no request indexing, GSC validation, Reddit or other
  external post, OSS submission, paid acquisition, synthetic analytics event,
  account mutation, or metric-definition change is authorized.
- Next step: re-run the frozen Goal and release gates, publish the scoped diff,
  wait for required GitHub checks, merge, and verify the exact production
  commit without making an SEO-success or causal claim.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-27-llm-wiki-implementation-guide-refresh production verification at 2026-07-27T05:38:39Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-27-llm-wiki-implementation-guide-refresh
- Observed at: 2026-07-27T05:38:39Z
- Readout: correction
- Status: measuring
- Evidence: PR #89 merged as the exact commit recorded below; its Vercel
  status completed successfully, the live target and five inbound paths
  matched the approved change, and the deployed technical audit passed.
- Publication: PR #89 merged at `2026-07-27T05:28:59Z` as
  `a8698b1629e88e4f48949fbc3ec96046e4e39f81`; Vercel production completed at
  `2026-07-27T05:29:47Z`.
- Live evidence: the English target returned its exact self-canonical, H1,
  `datePublished: "2026-06-24"`, `dateModified: "2026-07-27"`, five-minute
  protocol, verification section, failure repairs, and neutral adjacent-system
  comparison. Each of the five contextual source pages exposed the exact
  inbound target link.
- Technical evidence: the deployed audit passed robots, 110 sitemap URLs,
  14 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence,
  25 redirects, six bridge-host redirects, and legacy-URL exclusions.
- Locale boundary: no Mandarin content or locale availability changed. The
  existing zh-TW and zh-CN target routes remain outside this English refresh's
  content attribution.
- Production slot: released after production verification.
- Metric interpretation: publication and technical integrity are verified.
  No SEO lift, exact-query ranking, source-to-page session, CTA conversion,
  star attribution, setup success, or causal result is inferred.
- Unperformed separately gated actions: no indexing request, GSC validation,
  Reddit or other external post, OSS submission, paid acquisition, synthetic
  analytics event, account mutation, or metric-definition change.
- Result: pending
- Decision: wait
- Next step: run the 24-hour technical/evidence readout after
  `2026-07-28T05:29:47Z`, keeping page-level GSC data, joined visible queries,
  Vercel, Umami when authenticated, and GitHub stars in their native units.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-27-download-information-architecture

- Record type: experiment-start
- Experiment ID: EXP-2026-07-27-download-information-architecture
- Status: active
- Data window: 2026-07-25..2026-07-31
- Asset class: integration-hub
- Launched: 2026-07-27
- Hypothesis: Replacing the full homepage release matrix with one compact
  browser-recommended platform action, while moving every archive and setup
  path to a localized `/download` hub, will make the download action visible
  in the first mobile anchor viewport and earn qualified GitHub outbound use
  without weakening release accuracy or technical SEO.
- Candidate evidence: The live `https://wenlan.app/#download` render inspected
  on `2026-07-27` measured about 960.45 CSS pixels on desktop and about
  1,739 to 1,834 CSS pixels on the inspected mobile views. The first mobile
  anchor viewport exposed no download action. Current source promotes Windows
  structurally before browser-system evidence exists and gives the other three
  visible actions the same generic label. The user independently confirmed
  that the homepage should show only a system recommendation and link to a
  complete download page. Exact rendered, code, date, and locale provenance is
  recorded in
  `docs/seo-audits/2026-07-27-download-information-architecture-prelaunch.md`.
- Baseline: GSC property totals are 7 clicks and 329 impressions;
  visible-query totals are 1 click and 81 impressions, leaving a 6-click and
  248-impression visibility gap. Vercel separately reports 1,406 visitors and
  1,612 pageviews. GitHub reports 47 total Wenlan stars. Authenticated Umami
  CTA totals and Vercel source-to-page sessions are unavailable, so no CTA
  ratio, star attribution, or causal baseline is inferred.
- Change: Keep the homepage `#download` anchor but replace its full platform
  matrix with one compact client-leaf recommendation and a localized complete
  download link. Add `/download`, `/zh-TW/download`, and `/zh-CN/download`
  with all four immutable release archives, platform-specific setup guidance,
  `wenlan doctor` verification, reciprocal canonical and hreflang metadata,
  sitemap membership, and BreadcrumbList JSON-LD. Keep release facts sourced
  from `WENLAN_RELEASE`; add no search article, `FAQPage` JSON-LD, indexing
  request, or external distribution.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 100 Vercel pageviews summed in native units across the
  localized homepage and download-hub paths in the first 28 complete
  post-deploy days; this is not a deduplicated visitor count
- Success criteria: After minimum exposure, at least 10 authenticated Umami
  `github_outbound` events across `home-download` and `download-page`, while
  technical, release, locale, and rendered-layout gates continue to pass.
- Failure criteria: After 28 complete post-deploy days and minimum exposure,
  zero authenticated Umami `github_outbound` events across both placements
  while tracker coverage is verified.
- Stop criteria: Stop or repair if the recommendation mismatches the detected
  desktop OS family, an archive disappears, release facts drift from
  `WENLAN_RELEASE`, another controller edits the same surfaces, or the change
  creates a canonical, indexing, robots, noindex, redirect, structured-data,
  sitemap, locale, analytics, accessibility, or rendered-layout regression.
- 24h readout: pending - verify the live homepage recommendation, complete
  download hub, four archive URLs, canonical/hreflang/sitemap/schema contract,
  locale routes, mobile first-viewport action, and tracker presence without a
  conversion or causal judgment
- 7d readout: pending - report Vercel homepage and download-hub pageviews,
  authenticated Umami outbound events when available, GSC, and GitHub stars
  separately; keep the result inconclusive without tracker coverage
- W2 readout: pending - apply the native-unit exposure guard and inspect
  platform recommendation errors, download-hub engagement, and technical or
  locale regressions
- W4 readout: pending - apply the predeclared success, failure, or
  inconclusive condition without changing thresholds
- W8 readout: pending - record a post-campaign follow-up only if the
  conversion surface remains useful to evaluate
- Result: pending
- Decision: wait
- Next step: Implement and verify the approved local scope, then stop before
  commit, push, PR, merge, deployment, request indexing, GSC validation,
  synthetic analytics events, or external publication.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-27T06:22:51Z — Download information architecture local preflight

- Record type: campaign-observation
- Current experiment:
  `EXP-2026-07-27-download-information-architecture`
- Status: active; locally implemented and verified; not published
- Verification: frozen Goal verifier, TypeScript, 193 SEO/brand/technical
  tests, 53 i18n tests, production build, built technical SEO, local
  production-route i18n checks, and rendered desktop/mobile QA all passed.
- Rendered result: the English homepage download surface measured about 411
  CSS pixels on the inspected desktop viewport and about 698 CSS pixels at
  393 by 852 CSS pixels, versus live baselines of about 960 and 1,834 CSS
  pixels. English, zh-TW, and zh-CN home/download routes had no document-level
  horizontal overflow, and every mobile download-hub CTA stayed within the
  viewport.
- Technical result: all four immutable release assets, exact localized
  canonicals, reciprocal hreflang, sitemap membership, `BreadcrumbList` and
  `WebPage` JSON-LD, visible `wenlan doctor`, and the ordinary-site
  no-`FAQPage` rule were verified locally.
- Metric interpretation: local implementation and technical integrity are
  verified. No pageview, event, search, star, setup, conversion, or causal
  result is inferred before publication.
- Unperformed separately gated actions: no commit, push, PR, merge,
  deployment, indexing request, GSC validation, external post, OSS
  submission, paid acquisition, synthetic analytics event, or
  metric-definition change.
- Next step: present the exact local diff and verification evidence for
  separate publication approval.

### 2026-07-27T06:58:14Z — Download information architecture PR approved

- Record type: campaign-observation
- Current experiment:
  `EXP-2026-07-27-download-information-architecture`
- Status: active; locally verified; PR publication authorized
- Approval: the user approved commit, Git push, and PR creation for the exact
  locally verified download-information-architecture diff.
- Boundaries retained: no merge, deployment, request indexing, GSC
  validation, Reddit or other external post, OSS submission, paid
  acquisition, synthetic analytics event, account mutation, or
  metric-definition change is authorized.
- Next step: re-run the frozen Goal and release gates, publish an isolated
  branch and draft PR, and stop before merge or deployment.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-27-llm-wiki-implementation-guide-refresh at 2026-07-28T05:47:53Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-27-llm-wiki-implementation-guide-refresh
- Observed at: 2026-07-28T05:47:53Z
- Readout: 24h
- Status: measuring
- Evidence: The production and locale gates passed, while every available
  authenticated search and visitor range still ends before deployment.
- GSC evidence: The latest authenticated range remains
  `2026-06-27..2026-07-24`, before the implementation-guide deployment.
  Property totals are 7 clicks and 329 impressions; visible-query totals are
  1 click and 81 impressions; the query visibility gap is 6 clicks and
  248 impressions. The target-page row is separately 0 clicks,
  2 impressions, and page-average position 3.5. The joined visible qualified
  query-to-target subset is 0 clicks, 0 impressions, and 0 rows. The visible
  `llm wiki 2.0` row has 1 impression and average position 13.0 but maps to
  `/zh-TW`, not to the target. This range cannot measure the first complete
  post-deploy day; no indexing state, exact-query rank, SEO success, or
  post-change search effect is inferred.
- Vercel evidence: The same complete pre-deploy range reports 1,406 raw
  visitors and 1,612 pageviews. Direct traffic is separately 262 visitors and
  341 pageviews. The existing qualified-source allowlist sums to
  1,149 visitors across separate search, AI, and GitHub referrer rows and is
  not a deduplicated visitor count. Acquisition-surface page rows are
  separately 5 visitors and 5 pageviews for the English target,
  3 visitors and 4 pageviews for the zh-TW counterpart, and 2 visitors and
  3 pageviews for the zh-CN counterpart. The aggregates provide no
  source-to-page join or unique cross-page acquisition-surface visitor count,
  and the range predates this refresh.
- Umami and GitHub evidence: No authenticated Umami event observation is
  available. Vercel custom events remain Pro-or-Enterprise account-gated, so
  GitHub outbound and CTA are not reported. GitHub REST reports 47 total
  Wenlan stars at this readout; no star attribution or causal claim is made.
- Technical evidence: The production technical audit passed robots,
  110 sitemap URLs, 14 key pages, six utility noindex headers,
  sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects,
  18 direct changed redirects, and legacy-URL exclusions. The English target
  returned direct HTTP 200 with no blocking `X-Robots-Tag`, its exact
  self-canonical, `index, follow`, Article and BreadcrumbList JSON-LD,
  `datePublished: "2026-06-24"`, and
  `dateModified: "2026-07-27"`.
- Content and link evidence: The live page retained the LLM-wiki definition,
  four-plane architecture, six-command `/brief`, `/recall`, `/capture`,
  `/handoff`, `/distill`, and `/pages` protocol, observable verification
  section, source-to-maintained-answer evidence trail, failure repairs, and
  neutral RAG, Obsidian, repository-search, and agent-memory boundaries.
  Four visible FAQ summary controls remain present without `FAQPage`
  JSON-LD. The MCP memory, Claude Code memory, AI-agent-memory-types,
  AI-work-memory-versus-knowledge-base, and Obsidian comparison pages each
  expose a visible exact link to the target.
- Locale and render evidence: English, zh-TW, and zh-CN targets returned their
  exact self-canonicals, `index, follow`, reciprocal `en-US`, `zh-TW`,
  `zh-CN`, and `x-default` alternates, and Article plus BreadcrumbList schema.
  Fresh rendered DOM checks found no document or H1 overflow on the English
  desktop and 393 by 852 CSS-pixel views or on the two Mandarin desktop
  views. The English implementation sections and FAQ controls had rendered
  dimensions, and the browser recorded no warning or error.
- Result: pending
- Decision: wait
- Unperformed gated actions: no push, PR, merge, deployment, indexing request,
  GSC validation, Reddit or other external post, OSS submission, paid
  acquisition, synthetic analytics event, account mutation, or
  metric-definition change was performed in this readout.
- Next step: keep this cohort measuring and do not record its 7-day readout
  before `2026-08-03T05:29:47Z`. Reuse the next authenticated weekly evidence
  rather than duplicating its GSC or Vercel pipeline, and keep every source in
  its native unit.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-29T01:01:37Z — unified acquisition and domain-migration observation

- Record type: campaign-observation
- Status: Change of Address active; sitemap refreshed; targeted indexing
  requests completed; no new content experiment started
- User correction: the acquisition center is AI knowledge bases, LLM wiki,
  source-backed wiki, and Obsidian or knowledge-base-adjacent workflows.
  Memory remains an enabling product capability and supporting vocabulary,
  but generic memory demand no longer nominates the next acquisition asset.
- Aligned evidence window: `2026-06-28..2026-07-25`.
- Wenlan GSC: 8 property clicks and 395 property impressions; visible-query
  totals are 2 clicks and 92 impressions; the visibility gap is 6 clicks and
  303 impressions. The existing Searchfit grouping reports 48 visible
  non-brand impressions; its `Other` bucket still includes noisy Wenlan
  misspellings.
- Legacy `useorigin.app` GSC: 5 property clicks and 516 property impressions. These
  remain a migration diagnostic and are not added to the Wenlan Goal metric.
- Vercel: 1,420 raw visitors and 1,628 pageviews; direct is separately
  270 visitors and 351 pageviews; the qualified-source sum is separately
  1,152 visitors across per-referrer rows and is not deduplicated.
- GitHub and CTA: GitHub reports 47 stars. No authenticated Umami event read
  is available, so no GitHub-outbound or CTA ratio is reported.
- Search Console migration verification: `useorigin.app` shows
  `This site is currently moving` to `wenlan.app`, with start date
  2026-07-28. The Wenlan sitemap was submitted and read on 2026-07-28 with
  `Success` and 113 discovered pages.
- Targeted URL Inspection: all four selected URLs first returned
  `URL is on Google`, then returned `Indexing requested`:
  `/learn/distilled-wiki-pages-ai-memory`,
  `/learn/source-backed-wiki-pages-ai-work`,
  `/learn/ai-work-memory-vs-knowledge-base`, and
  `/zh-TW/learn/distilled-wiki-pages-ai-memory`.
- GSC validation: not submitted because no matching repaired coverage issue
  is awaiting validation.
- Evidence:
  `docs/seo-audits/2026-07-29-unified-acquisition-observation.md`.
- Decision: monitor migration and re-run the candidate gate around AI
  knowledge base and wiki intent; do not repeat indexing requests or start a
  generic memory article.
- Next step: read Wenlan GSC, legacy `useorigin.app` GSC, Vercel, GitHub, indexing, and
  sitemap evidence together in the next authenticated window while preserving
  native units and avoiding a fabricated source-to-page join.

### 2026-07-29T02:56:17Z — acquisition-focus control-plane correction

- Record type: campaign-observation
- Status: local control-plane and Searchfit correction verified; no website
  experiment started
- Approval: after correcting the acquisition center to AI knowledge bases,
  LLM wiki, source-backed wiki, and Obsidian or knowledge-base workflows, the
  user instructed the controller to continue implementing the semantic guard.
- Contract change: the frozen acquisition focus now separates new acquisition
  decisions from existing memory-page measurement and maintenance. Generic
  memory demand cannot nominate the next experiment.
- Mutable-plan change: existing memory cohorts are labeled measurement
  maintenance and no longer occupy the acquisition decision lane.
- Pipeline change: Searchfit now maps LLM-wiki, source-backed-wiki,
  AI-knowledge-base, Traditional Chinese `AI 知識庫`, and Simplified Chinese
  `AI 知识库` queries to maintained existing surfaces before generic
  memory-adjacent groups. Modifier-qualified Obsidian intent remains mapped to
  the Obsidian surface.
- Verification: the focused Goal drift test and the focused Searchfit mapping
  test pass, and `pnpm seo:goal:check` passes with the updated frozen hash.
- Boundaries: no article or website copy was changed; no push, PR, merge,
  deployment, indexing request, GSC validation, external publication, paid
  acquisition, synthetic analytics event, or metric-definition change was
  performed.
- Decision: use AI knowledge-base and wiki evidence for the next candidate;
  keep memory rows reportable only as historical or measuring evidence.
- Next step: regenerate the latest authenticated report through the corrected
  classifier, then evaluate the highest-evidence existing knowledge-base or
  wiki page before considering a net-new URL.

### 2026-07-29T02:59:52Z — corrected Searchfit action read

- Record type: campaign-observation
- Status: corrected authenticated action view generated; no website experiment
  started
- Evidence window: `2026-06-28..2026-07-25`, reusing the same authenticated
  Wenlan GSC and Vercel inputs without changing any native metric.
- Report:
  `/tmp/wenlan-seo-2026-07-28/weekly-seo-corrected.md`.
- Evidence fingerprint:
  `sha256:eeddd8e91beeccb18dc26ee212349f73911ff37fc940e18824076d4e949a4e3d`.
- Corrected query mapping: visible `llm wiki 2.0` now maps to the existing
  distilled-wiki page under `AI knowledge base / wiki` instead of `Other`.
  Its single impression remains below the action threshold.
- Top Actions: refresh the existing
  `/learn/ai-work-memory-vs-knowledge-base` knowledge-base surface and sharpen
  the `/learn` hub. Generic memory rows remain in the complete queues but are
  excluded from acquisition nominations.
- Decision: evaluate the indexed knowledge-base surface first, then the Learn
  hub; do not launch a generic memory experiment from this report.
- Next step: inspect the current knowledge-base page, joined visible-query
  evidence, SERP intent, and maintained Wenlan proof before proposing a
  bounded content refresh.

### 2026-07-29T03:14:36Z — Obsidian query-language boundary

- Record type: campaign-observation
- Status: demand-discovery boundary and Searchfit nomination guard verified;
  no website experiment started
- Authenticated GSC evidence: the `2026-06-28..2026-07-25` visible query
  export contains no Obsidian row. The English Obsidian page has 4 impressions
  and average position 4.5, but its page aggregate does not reveal the search
  wording.
- Google Trends evidence: the signed-in Taiwan capture from 2026-07-18
  recorded related rising queries `obsidian claude code` (+3,350%),
  `obsidian and claude` (+2,400%), and `obsidian claude` (+1,500%). These are
  Trends rising percentages, not search volume.
- Independent wording evidence: current Reddit, Obsidian community-plugin,
  OSS, and SERP surfaces repeatedly pair Obsidian with Claude Code, Claude,
  or MCP.
- Decision: `Obsidian workflow` is an internal category, not a proven query.
  Obsidian is a discovery bridge into the AI-knowledge-base story, not a peer
  acquisition center.
- Pipeline guard: only a visible query pairing `obsidian` with `claude`,
  `claude code`, or `mcp` can nominate the Obsidian group in Top Actions.
  Generic `obsidian`, `obsidian workflow`, `obsidian knowledge base`,
  `markdown knowledge base`, and `obsidian ai memory` remain reportable but
  discovery-only.
- Verification: `pnpm seo:goal:check` passes; the full 195-test SEO suite
  passes; the same authenticated report retains evidence fingerprint
  `sha256:eeddd8e91beeccb18dc26ee212349f73911ff37fc940e18824076d4e949a4e3d`
  and still nominates only the indexed knowledge-base page and Learn hub.
- Boundaries: no website content, URL, canonical, sitemap, structured data, or
  analytics definition changed; no push, PR, merge, deployment, indexing
  request, GSC validation, external publication, or paid acquisition occurred.

### 2026-07-29T03:46:54Z — Trends nomination clarification

- Record type: campaign-observation
- Status: control-plane interpretation corrected; no website experiment
  started
- Correction: the preceding Searchfit guard applies only to Top Actions
  derived from authenticated GSC rows. It is not a campaign-wide requirement
  to wait for a visible GSC query.
- Evidence role: an inspectable modifier-qualified Trends query may nominate
  advance preparation when independent corroboration, a clean coverage gap,
  maintained Wenlan proof, and standalone utility also pass. GSC remains the
  later authority for Wenlan search performance and indexing.
- Existing coverage: the live zh-TW Obsidian page already leads with
  `Obsidian + Claude Code` and covers `Obsidian MCP`. The existing English
  route still leads with `Wenlan vs Obsidian AI Memory`, making it the cleaner
  refresh candidate for the observed English tool-pair queries.
- Decision: do not create another Obsidian URL. If selected as the next
  experiment, refresh the existing English route around `obsidian claude
  code`, `claude code obsidian`, and `obsidian mcp`, while keeping the
  AI-knowledge-base role and maintained sources explicit.

### 2026-07-29T04:29:56Z — Simplified Chinese community-heat lane

- Record type: campaign-observation
- Status: initial public-source snapshot recorded; no website experiment
  started
- Sources: public V2EX, Bilibili, Juejin, Zhihu, and Simplified Chinese
  SERP-visible community pages. Login-gated sources remain manual and were not
  treated as unavailable-zero observations.
- Repeated core language: `LLM Wiki 知识库`, `AI 知识库`, `本地 AI 知识库`,
  `AI 维护知识库`, and `RAG vs LLM Wiki`.
- Repeated tool-bridge language: `Claude Code + Obsidian`, `Obsidian CLI +
  Claude Code`, `Obsidian MCP`, and `Claudian`.
- Native-unit examples at capture: one Bilibili LLM-Wiki/Obsidian item showed
  `8.0万播放`; a Karpathy AI-knowledge-base item showed `3.1万播放`; a V2EX
  LLM-wiki launch thread showed 1,236 clicks and 1 reply; a V2EX Obsidian plus
  Claude Code thread showed 2,116 views and 6 replies; a Juejin LLM-Wiki
  article showed 2,053 reads. These units are not combined or converted.
- Coverage read: the existing zh-CN LLM-wiki page partially covers the core
  language. Its current title leads with `AI 工作的 LLM wiki`, while public
  community wording repeatedly leads with `LLM Wiki 知识库` or
  `AI 知识库`. Refresh that existing route before creating another zh-CN URL
  if the full candidate gate clears.
- Decision: monitor the lane at most once per campaign window and use it for
  advance candidate nomination, not authenticated GSC input, keyword-volume
  claims, or causal attribution.
- Evidence:
  `docs/seo-audits/2026-07-29-zh-cn-community-demand.md`.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-27-download-information-architecture production correction at 2026-07-29T04:52:26Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-27-download-information-architecture
- Observed at: 2026-07-29T04:52:26Z
- Readout: correction
- Status: measuring
- Evidence: PR #91 merged at `2026-07-28T14:29:47Z` as
  `ca89fb2d16f51a15c8b36378a22425af346b5954`; production completed and the
  localized homepage recommendation plus `/download`, `/zh-TW/download`, and
  `/zh-CN/download` are live. The deployed technical audit passes 113 sitemap
  URLs, 17 key pages, six utility noindex headers, sitemap-wide `FAQPage`
  absence, 25 redirects, six bridge-host redirects, and old-URL exclusions.
  This correction reconciles the append-only experiment state with the
  production-verified PLAN record and releases the preparation slot.
- Result: pending
- Decision: wait
- Next step: Keep the download cohort on its predeclared readouts while the
  single production-preparation slot is available to the next eligible
  evidence-backed website experiment.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-29-zhcn-llm-wiki-knowledge-base-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-07-29-zhcn-llm-wiki-knowledge-base-refresh
- Status: active
- Data window: 2026-07-25..2026-07-31
- Asset class: refresh
- Launched: 2026-07-29
- Hypothesis: Refreshing the existing zh-CN LLM-wiki canonical around the
  recurring public language `LLM Wiki 知识库`, `AI 知识库`, and
  `本地 AI 知识库`, while adding a standalone RAG comparison and an
  inspectable implementation loop, will create measurable Simplified Chinese
  search exposure without adding an overlapping URL.
- Candidate evidence: The public Simplified Chinese snapshot captured
  independent Bilibili, V2EX, and Juejin pages using the target language,
  including native observations of `8.0万播放`, `3.1万播放`, 1,236 clicks
  plus 1 reply, and 2,053 reads; these units remain separate. Current SERP
  observations also return exact-language competing LLM-wiki and
  knowledge-base pages while Wenlan was absent from the inspected first
  results. The existing
  `/zh-CN/learn/distilled-wiki-pages-ai-memory` route is the clean coverage
  seam but currently leads with memory-first wording. Evidence and URLs are
  preserved in
  `docs/seo-audits/2026-07-29-zh-cn-community-demand.md`.
- Baseline: Authenticated GSC for `2026-06-28..2026-07-25` reports 8 property
  clicks and 395 property impressions; visible-query totals are 2 clicks and
  92 impressions, leaving a 6-click and 303-impression visibility gap. The
  target zh-CN URL has no GSC page row, which is not reported as zero.
  Vercel separately reports 2 visitors and 3 pageviews for the target page.
  GitHub reports 47 total Wenlan stars. Authenticated Umami events are
  unavailable, so no CTA baseline or source-to-page session is inferred.
- Change: Keep
  `/zh-CN/learn/distilled-wiki-pages-ai-memory`, its original
  `datePublished: "2026-07-04"`, canonical, sitemap entry, hreflang set, and
  Article plus BreadcrumbList schema. Refresh its title, metadata, quick
  answer, architecture, RAG/Obsidian boundaries, implementation and
  verification sections, FAQs, and maintained references around the
  Simplified Chinese AI-knowledge-base intent. Set
  `dateModified: "2026-07-29"`. Keep visible FAQ text without `FAQPage`
  JSON-LD and do not add a new URL or unsupported locale.
- Publish date: pending explicit publication approval
- Index date: not observed; no indexing request authorized
- Minimum exposure: 5 GSC target-page impressions in the first 28 complete
  post-publication days for which Search Console data is available.
- Success criteria: After minimum exposure, the target page records at least
  1 GSC click or page-average position at or above the declared threshold of
  20 or better. Keep any visible joined qualified-query rows separate from
  the page aggregate.
- Failure criteria: After 28 complete post-publication days and minimum
  exposure, the target page records 0 clicks and page-average position worse
  than 20.
- Stop criteria: Stop or repair before publication if the refresh creates a
  canonical, sitemap, hreflang, robots, noindex, Article/BreadcrumbList,
  localization, maintained-source, duplicate-intent, or rendered-layout
  regression. After publication, stop further copy churn until a declared
  readout or new evidence.
- 24h readout: Verify exact production commit, HTTP 200, self-canonical,
  indexability, schema dates, visible target sections, FAQPage absence,
  reciprocal locale alternates, sitemap membership, and rendered desktop plus
  mobile output. Report available metrics in native units without an SEO or
  causal judgment.
- 7d readout: Reuse the latest authenticated weekly range; report GSC
  property, visible-query, visibility-gap, target-page, Vercel, Umami when
  authenticated, and GitHub observations separately. Mark inconclusive when
  the range or exposure is incomplete.
- W2 readout: Apply the same native-unit split and inspect target-page plus
  visible qualified-query movement only after enough post-publication days.
- W4 readout: Apply the predeclared minimum exposure and success or failure
  rule; otherwise record inconclusive.
- W8 readout: Preserve the final observation if available after the campaign
  deadline without moving the Goal's fixed final window.
- Result: pending
- Decision: wait
- Next step: complete local content, localization, rendered UI, build, and
  technical SEO verification, then stop at the explicit Git push, PR, merge,
  deployment, and indexing approval boundaries.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-29T05:00:11Z — zh-CN LLM-wiki refresh local verification

- Record type: campaign-observation
- Current experiment:
  `EXP-2026-07-29-zhcn-llm-wiki-knowledge-base-refresh`
- Status: active; locally verified; awaiting explicit publication approval
- Content evidence: the existing zh-CN canonical now leads with
  `LLM Wiki 知识库`, `AI 知识库`, `本地 AI 知识库`, and
  `RAG vs LLM Wiki`; it adds a standalone definition, four-layer
  architecture, Ingest/Query/Lint responsibilities, a six-command Wenlan
  implementation loop, observable checks, failure boundaries, visible FAQs,
  and maintained first-party references. The original publication date
  remains `2026-07-04`; the local modified date is `2026-07-29`.
- RED/GREEN evidence: the focused zh-CN acquisition-intent contract first
  failed on the old memory-first title and then passed after the refresh.
- Verification: `pnpm seo:goal:check` passes; `pnpm test:i18n` passes
  54 tests; `pnpm test:seo` passes 195 tests with
  `WENLAN_REPO_ROOT=/Users/lucian/Repos/wenlan` and
  `WENLAN_APP_REPO_ROOT=/Users/lucian/Repos/wenlan-app`; `pnpm lint` passes;
  `pnpm build` generates 214 static pages; `pnpm seo:technical:built` passes
  113 sitemap URLs, 17 required URLs, seven noindex headers, and 117 built
  HTML pages without `FAQPage`; `pnpm i18n:technical:built` passes 22 direct
  200 routes and five expected 404 routes; `git diff --check` passes.
- Deployed baseline: before publication, the production audit passes 113
  sitemap URLs, 17 key pages, six utility noindex headers, sitemap-wide
  `FAQPage` absence, 25 redirects, six bridge-host redirects, and old-URL
  exclusions. The current live target returns direct 200, `index, follow`,
  its exact self-canonical, and Article dates `2026-07-04`.
- Rendered verification: fresh production-build captures at 1440 by 1100 and
  393 by 852 CSS pixels show the hero, architecture, RAG comparison,
  implementation, verification, CTA, references, and FAQ surfaces without
  document-level horizontal overflow, clipped headings, CJK orphan lines, or
  browser warnings/errors. Article and BreadcrumbList schema expose
  `datePublished: "2026-07-04"` and `dateModified: "2026-07-29"`.
  Evidence is under `/tmp/wenlan-zhcn-llm-wiki-*.png`.
- Visual QA: the inline design-system/functional-integrity pass and the
  independent visual/CJK-precision pass both return PASS on the same build.
- Boundaries: no commit, Git push, PR, merge, deployment, indexing request,
  GSC validation, Reddit or other external post, OSS submission, paid
  acquisition, synthetic analytics event, account mutation, or
  metric-definition change was performed.
- Next decision: obtain explicit approval for commit, Git push, PR creation,
  merge, automatic Vercel deployment, and read-only production verification
  of this exact locally verified experiment. Indexing and GSC validation stay
  separately gated.

### 2026-07-29T05:13:16Z — zh-CN LLM-wiki publication approval

- Record type: campaign-approval
- Current experiment:
  `EXP-2026-07-29-zhcn-llm-wiki-knowledge-base-refresh`
- Approval: the user explicitly approved publication of this Simplified
  Chinese LLM-Wiki and AI-knowledge-base experiment in the active Codex Goal.
- Authorized actions: commit the exact locally verified worktree scope, push
  an isolated Git branch, create a pull request, merge it, allow the automatic
  Vercel production deployment, and perform read-only production
  verification.
- Boundaries retained: no request indexing, GSC validation, Reddit or other
  external post, OSS submission, paid acquisition, synthetic analytics event,
  account mutation, or metric-definition change is authorized.
- Next step: re-run the frozen Goal and publication gates, publish the isolated
  branch, verify the exact production commit and live technical/content state,
  then record production completion without claiming SEO lift or causality.

### 2026-07-29T05:25:56Z — zh-CN localized code-block production correction

- Record type: campaign-observation
- Current experiment:
  `EXP-2026-07-29-zhcn-llm-wiki-knowledge-base-refresh`
- Status: active; production-render correction in flight
- Publication provenance: PR #92 merged at `2026-07-29T05:16:36Z` as
  `1618945972a6957c4fd08501de464d2fb94627f1`; Vercel reported production
  success at `2026-07-29T05:17:23Z`.
- Production finding: live technical SEO, canonical, indexability, Article and
  BreadcrumbList schema, sitemap membership, hreflang, and locale-route checks
  passed. The visible six-command implementation loop did not: the localized
  Learn route rendered section body, bullets, and links but omitted the
  existing `section.code` data. The live HTML therefore lacked `/brief
  <主题>`.
- Correction: render localized `section.code` with the same bounded code-block
  treatment used by English Learn pages, and add a focused renderer contract.
  The focused test failed before the renderer change and passed afterward.
- Local verification: `pnpm seo:goal:check` passes; `pnpm test:i18n` passes 55
  tests; `pnpm test:seo` passes 195 tests; `pnpm lint` passes; `pnpm build`
  generates 214 static pages; `pnpm seo:technical:built` passes; and the local
  production locale matrix passes 22 expected 200 routes plus five expected
  404 routes. At a 393-pixel viewport, the document `scrollWidth` equals its
  387-pixel `clientWidth`; the zh-CN six-command block is fully visible.
  Desktop rendering at 1440 pixels also passes. The existing zh-TW long-command
  block remains contained by its own horizontal scroller without widening the
  document.
- Result: no SEO result; production correction pending
- Decision: repair
- Boundaries: this correction uses the existing publication approval for the
  exact experiment. No request indexing, GSC validation, external post, OSS
  submission, paid acquisition, synthetic analytics event, account mutation,
  or metric-definition change is performed.
- Next step: publish the isolated renderer correction, verify the exact live
  command block and technical state, then start the post-publication readout
  clock from the corrected production completion time.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-29-zhcn-llm-wiki-knowledge-base-refresh production verification at 2026-07-29T05:30:32Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-29-zhcn-llm-wiki-knowledge-base-refresh
- Observed at: 2026-07-29T05:30:32Z
- Readout: correction
- Status: measuring
- Evidence: PR #92 and corrective PR #93 are merged and production-deployed;
  the exact live content, technical SEO, locale matrix, and responsive render
  checks below passed against `https://wenlan.app`.
- Publication: PR #92 merged at `2026-07-29T05:16:36Z` as
  `1618945972a6957c4fd08501de464d2fb94627f1`; its Vercel production completed
  at `2026-07-29T05:17:23Z`. PR #93 merged the localized renderer correction
  at `2026-07-29T05:27:38Z` as
  `5a4cc9264a9fa7554fc20f56bbda07bdbbb50685`; corrected Vercel production
  completed at `2026-07-29T05:28:22Z`.
- Live content evidence: the target returns direct HTTP 200 with the
  AI-knowledge-base title, exact self-canonical, `index, follow`, reciprocal
  `en-US`, `zh-TW`, `zh-CN`, and `x-default` alternates, Article and
  BreadcrumbList JSON-LD, stable `datePublished: "2026-07-04"`,
  `dateModified: "2026-07-29"`, seven intended guide sections, four
  maintained source links, visible FAQs without `FAQPage`, and all six
  `/brief`, `/recall`, `/capture`, `/handoff`, `/distill`, and `/pages`
  workflow commands.
- Technical evidence: the deployed audit passes robots, 113 sitemap URLs, 17
  key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25
  redirects, six bridge-host redirects, and legacy-URL exclusions. The live
  locale matrix passes 22 expected direct-200 routes and five expected 404
  routes.
- Render evidence: at a 393-pixel viewport, document `scrollWidth` equals the
  387-pixel `clientWidth`, the command block occupies 337 pixels, and the six
  commands are visible. At 1440 pixels, document `scrollWidth` equals the
  1434-pixel `clientWidth` and the command block occupies 586 pixels. No
  browser warning or error was observed.
- Production slot: released after production verification.
- Metric interpretation: publication and technical integrity are verified.
  No SEO lift, exact-query rank, source-to-page session, CTA conversion, star
  attribution, setup success, or causal result is inferred.
- Unperformed separately gated actions: no indexing request, GSC validation,
  Reddit or other external post, OSS submission, paid acquisition, synthetic
  analytics event, account mutation, or metric-definition change.
- Result: pending
- Decision: wait
- Next step: run the 24-hour technical/evidence readout after
  `2026-07-30T05:28:22Z`, keeping GSC property totals, visible-query totals,
  query visibility gap, target-page rows, Vercel native-unit observations,
  authenticated Umami observations when available, and GitHub stars separate.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-29-obsidian-claude-code-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-07-29-obsidian-claude-code-refresh
- Status: active
- Data window: 2026-07-25..2026-07-31
- Asset class: refresh
- Launched: 2026-07-29
- Hypothesis: Refocusing the existing English Obsidian comparison on the repeated `obsidian claude code`, `claude code obsidian`, and `obsidian mcp` integration question will increase qualified target-page search exposure without creating a competing URL or moving Wenlan away from its AI-knowledge-base center.
- Candidate evidence: The signed-in Taiwan Trends capture from `2026-07-18` recorded related rising queries `obsidian claude code` (+3,350%), `obsidian and claude` (+2,400%), and `obsidian claude` (+1,500%); these are rising-query percentages, not search volume. Current Reddit titles, fixed English US SERP observations, and three inspectable unarchived OSS repositories independently repeat direct vault access, editor-context, Claude Code, and MCP intent. The existing English route has four authenticated GSC impressions but still leads with unsupported `Obsidian AI Memory` wording. Exact provenance, current GitHub native units, and maintained Wenlan proof are recorded in `docs/seo-audits/2026-07-29-obsidian-claude-code-prelaunch.md`.
- Baseline: Authenticated GSC for `2026-06-28..2026-07-25` reports 8 property clicks and 395 property impressions; visible-query totals are 2 clicks and 92 impressions, leaving a 6-click and 303-impression visibility gap. The target page has 0 clicks, 4 impressions, and page-average position 4.5, but no visible Obsidian query row, so no exact-query rank is inferred. Vercel separately reports 1,420 property visitors, 1,628 property pageviews, 4 target-page visitors, and 4 target-page pageviews. GitHub reports 47 total Wenlan stars. Authenticated Umami events are unavailable, so no source-to-page session or CTA baseline is inferred.
- Change: Refresh only the existing English `/learn/wenlan-vs-obsidian-ai-memory` H1, metadata, first answer, integration decision path, comparison rows, FAQs, maintained sources, and modified date around direct vault access, Claude Code IDE context, Obsidian MCP, and the boundary between access and a durable source-backed AI knowledge base. Preserve the canonical URL, original `datePublished: "2026-06-06"`, sitemap and locale behavior, Article and BreadcrumbList schema, visible FAQ without `FAQPage`, CTA destination, and existing zh-TW copy. Add no new URL or locale.
- Publish date: not-published
- Index date: unknown-existing-route
- Minimum exposure: 5 GSC target-page impressions in the first 28 complete post-deploy days.
- Success criteria: After minimum exposure, the target records at least 12 GSC target-page impressions or at least 1 target-page click. Page-average position and any visible joined qualified-query rows remain separate and are not substituted for exact-query rank.
- Failure criteria: After 28 complete post-deploy days and minimum exposure, the target records 0 clicks, fewer than 8 target-page impressions, and page-average position worse than 20.0.
- Stop criteria: Stop or repair before publication if a claim is not supported by a maintained first-party source, the change edits the zh-TW copy, or it creates a canonical, indexing, robots, noindex, structured-data, sitemap, locale, publication-date, FAQ-policy, source-link, or rendered-layout regression. After publication, stop further copy churn until a declared readout or new evidence.
- 24h readout: Verify exact production commit, direct HTTP 200, exact canonical, indexability, Article and BreadcrumbList dates, visible direct-files/editor-context/MCP/knowledge-lifecycle decision layers, maintained sources, sitemap membership, FAQPage absence, English and Mandarin non-regression, and desktop/mobile rendering. Keep all available metrics in native units and do not infer SEO success.
- 7d readout: Reuse the latest authenticated weekly range; report GSC property totals, visible-query totals, visibility gap, target-page rows, joined visible qualified-query rows, Vercel observations, authenticated Umami observations when available, and GitHub stars separately. Mark inconclusive when the range or exposure is incomplete.
- W2 readout: Apply the same native-unit split and inspect target-page plus joined qualified-query exposure only after enough complete post-deploy days.
- W4 readout: Apply the predeclared minimum exposure and success, failure, or inconclusive rule.
- W8 readout: Preserve a post-campaign observation only if useful without moving the Goal's fixed final window.
- Result: pending
- Decision: wait
- Next step: complete RED-to-GREEN content verification, full SEO/i18n/lint/build/technical checks, and rendered desktop/mobile verification, then stop before commit, push, PR, merge, or deploy without new explicit approval.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-29T05:57:52Z — Obsidian Claude Code refresh local verification

- Record type: campaign-observation
- Current experiment: `EXP-2026-07-29-obsidian-claude-code-refresh`
- Status: active; locally verified; awaiting explicit publication approval
- Scope: the existing English canonical now answers the smallest useful
  integration layer in order—direct Markdown files, real-time editor context,
  an Obsidian MCP tool surface, then a maintained source-backed knowledge
  lifecycle. It does not create a new URL or locale, and it keeps Obsidian as
  an integration bridge into the protected AI-knowledge-base acquisition
  center.
- RED/GREEN evidence: the focused Obsidian acquisition contract failed
  against the previous memory-first title and passed after the refresh.
- Verification: `pnpm seo:goal:check` passes; `pnpm test:seo` passes 196
  tests with the Wenlan and wenlan-app source roots supplied;
  `pnpm test:i18n` passes 55 tests; `pnpm lint` passes; `pnpm build`
  generates 214 static pages; `pnpm seo:technical:built` passes 113 sitemap
  URLs, 17 required URLs, seven noindex headers, and 117 built HTML pages
  without `FAQPage`; the local production locale matrix passes 22 expected
  direct-200 routes and five expected 404 routes; `git diff --check` passes.
- Rendered evidence: fresh production-build desktop and mobile checks cover
  the hero, quick answer, integration decision, comparison, CTA, maintained
  references, related pages, FAQs, and footer. The exact self-canonical,
  `index, follow`, Article and BreadcrumbList schema,
  `datePublished: "2026-06-06"`, `dateModified: "2026-07-29"`, and visible
  FAQ without `FAQPage` pass. The document and H1 do not overflow, the
  comparison table remains inside its horizontal scroller, and no browser
  warning or error was observed.
- Visual QA: the inline design-system and functional-integrity pass and the
  separate responsive visual-precision pass both pass. Production was a
  geometry reference rather than a pixel target because its persisted theme
  state differed from the local capture.
- Boundaries: no commit, Git push, PR, merge, deployment, indexing request,
  GSC validation, external post, OSS submission, paid acquisition, synthetic
  analytics event, account mutation, or metric-definition change was
  performed for this experiment.
- Next decision: obtain explicit approval for commit, Git push, PR creation,
  merge, automatic Vercel deployment, and read-only production verification
  of this exact locally verified refresh. Indexing and GSC validation remain
  separately gated.

### 2026-07-29T06:04:29Z — Obsidian Claude Code refresh publication approval

- Record type: campaign-approval
- Current experiment: `EXP-2026-07-29-obsidian-claude-code-refresh`
- Approval: the user explicitly approved publication of this locally verified
  English Obsidian + Claude Code and MCP refresh.
- Authorized actions: commit the exact verified worktree scope, push the
  isolated branch, create and merge a pull request, allow the automatic Vercel
  production deployment, and perform read-only production verification.
- Boundaries retained: no request indexing, GSC validation, Reddit or other
  external post, OSS submission, paid acquisition, synthetic analytics event,
  account mutation, or metric-definition change is authorized.
- Next step: rerun the Goal and publication gates, publish the isolated branch,
  verify the exact production commit and live technical/content state, then
  record production completion without claiming SEO lift or causality.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-29-obsidian-claude-code-refresh production verification at 2026-07-29T06:29:58Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-29-obsidian-claude-code-refresh
- Observed at: 2026-07-29T06:29:58Z
- Readout: correction
- Status: measuring
- Evidence: PR #95 is merged and production-deployed; the exact live content,
  technical SEO, locale matrix, complete responsive renders, and
  local-versus-production differential checks below passed against
  `https://wenlan.app`.
- Publication: commit `a94b42683b73c140316262b476935779d0c01a09`
  was pushed on the isolated branch; PR #95 merged at
  `2026-07-29T06:06:33Z` as
  `04fce969e09e56dee72b97bd0b59da05a09b4f61`; Vercel production completed at
  `2026-07-29T06:07:17Z`.
- Live content evidence: the English target returns direct HTTP 200 with the
  `Obsidian + Claude Code` title, exact self-canonical, `index, follow`,
  stable `datePublished: "2026-06-06"`, `dateModified: "2026-07-29"`,
  Article and BreadcrumbList JSON-LD, direct-files, editor-context, MCP, and
  source-backed knowledge-lifecycle sections, three maintained Obsidian and
  Claude Code OSS references plus maintained Wenlan anchors, and visible FAQ
  text without `FAQPage`.
- Technical evidence: the deployed audit passes robots, 113 sitemap URLs, 17
  key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25
  redirects, six bridge-host redirects, and legacy-URL exclusions. The live
  locale matrix passes 22 expected direct-200 routes and five expected 404
  routes; the English and zh-TW routes remain available, while the unsupported
  zh-CN article route remains a hard 404.
- Render evidence: fresh production captures cover the entire page in 12
  mobile tiles at 393 by 852 CSS pixels and five desktop tiles at 1440 by
  1100 CSS pixels. The document and H1 do not overflow; the comparison table
  remains contained by its horizontal scroller; no clipping, broken text,
  or browser warning/error was observed. Native visible FAQ
  `details`/`summary` markup and answer content are present; the unchanged
  interaction was not independently clicked during this post-deploy pass.
- Visual QA: the inline design-system and functional-integrity pass and the
  separate responsive visual-precision pass both returned PASS. Exact
  local-build versus production image differentials returned zero differing
  pixels and a 100 similarity score for both the mobile and desktop top
  captures, with intact alpha and no hotspots.
- Production slot: released after production verification.
- Metric interpretation: publication and technical integrity are verified.
  No SEO lift, exact-query rank, source-to-page session, CTA conversion, star
  attribution, setup success, or causal result is inferred at production
  completion.
- Unperformed separately gated actions: no indexing request, GSC validation,
  Reddit or other external post, OSS submission, paid acquisition, synthetic
  analytics event, account mutation, or metric-definition change.
- Result: pending
- Decision: wait
- Next step: run the 24-hour technical/evidence readout after
  `2026-07-30T06:07:17Z`, keeping GSC property totals, visible-query totals,
  query visibility gap, target-page rows, joined visible qualified-query
  rows, Vercel native-unit observations, authenticated Umami observations
  when available, and GitHub stars separate.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-29-zhcn-llm-wiki-knowledge-base-refresh at 2026-07-30T05:39:51Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-29-zhcn-llm-wiki-knowledge-base-refresh
- Observed at: 2026-07-30T05:39:51Z
- Readout: 24h
- Status: measuring
- Timing: This readout is 24 hours 11 minutes 29 seconds after corrected
  production completed at `2026-07-29T05:28:22Z`; it is recorded at the
  actual observation time and is not backdated.
- Evidence: The live technical, metadata, content, locale, and responsive
  geometry checks pass. The latest authenticated search and visitor range
  still ends before deployment, while fresh mobile visual inspection found
  two CJK phrase breaks that require a bounded presentation correction.
- GSC evidence: The latest reusable authenticated range remains
  `2026-06-28..2026-07-25`, before this refresh. Property totals are 8 clicks
  and 395 impressions; visible-query totals are 2 clicks and 92 impressions;
  the query visibility gap is 6 clicks and 303 impressions. The zh-CN target
  has no page row and no joined visible qualified-query row; neither is
  reported as zero. The visible `llm wiki 2.0` row maps to the zh-TW page,
  not this target. No indexing state, exact-query rank, post-change exposure,
  or SEO success is inferred.
- Vercel evidence: The same complete pre-deploy range reports 1,420 raw
  visitors and 1,628 pageviews. Direct traffic is separately 270 visitors and
  351 pageviews. The existing qualified-source allowlist sums to 1,152
  visitors across separate search, AI, and GitHub referrer rows and is not a
  deduplicated visitor count. The zh-CN target separately reports 2 visitors
  and 3 pageviews. Unique acquisition-surface visitors and source-to-page
  sessions remain unavailable; the page row is not joined to a referrer.
- Umami and GitHub evidence: No authenticated Umami event observation is
  available, so GitHub outbound and CTA are not reported. GitHub public REST
  reports 46 total Wenlan stars at this readout, one below the fixed
  47-star baseline; no attribution or causal claim is made.
- Technical and content evidence: The target returns direct HTTP 200 with its
  exact self-canonical, `index, follow`, reciprocal `en-US`, `zh-TW`,
  `zh-CN`, and `x-default` alternates, Article and BreadcrumbList JSON-LD,
  stable `datePublished: "2026-07-04"`,
  `dateModified: "2026-07-29"`, all seven intended guide sections, four
  visible FAQ controls without `FAQPage`, maintained references, and all six
  `/brief`, `/recall`, `/capture`, `/handoff`, `/distill`, and `/pages`
  commands.
- Deployed technical and locale evidence: The audit passes robots, 113
  sitemap URLs, 17 key pages, six utility noindex headers, sitemap-wide
  `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL
  exclusions. The production locale matrix passes 22 expected direct-200
  routes and five expected 404 routes.
- Render evidence: Fresh full-page captures at 393 by 852 and 1440 by 1100
  CSS pixels cover the entire route at
  `/private/tmp/wenlan-24h-production-qa/`. Mobile document width is
  393/393 and H1 width is 345/345; desktop document width is 1434/1434 and
  H1 width is 664/664. No document overflow, clipped surface, missing section,
  unexpected alpha channel, browser warning, or browser error was observed.
- Visual QA pass A: PASS with high confidence. The page remains a real shared
  DOM and token-driven article surface; canonical links, maintained sources,
  native FAQ details, schemas, responsive containers, and the six-command
  workflow are present and functional in the rendered tree.
- Visual QA pass B: REVISE with high confidence. In the exact 393-pixel hero
  capture, the H1 breaks `知识库` as `知识 / 库`, and the article packet breaks
  `来源` as `来 / 源`. Desktop and the remaining mobile surface show no
  additional clipping or obvious CJK orphan. The synthesized visual verdict
  is NEEDS WORK until those two mobile phrase breaks are corrected on fresh
  complete-page evidence.
- Result: pending
- Decision: refresh
- Unperformed gated actions: No push, PR, merge, deployment, indexing request,
  GSC validation, Reddit or other external post, OSS submission, paid
  acquisition, synthetic analytics event, account mutation, or
  metric-definition change was performed.
- Next step: Prepare only a bounded local mobile wrapping correction for the
  two confirmed CJK phrases, re-run fresh complete-page visual QA, and obtain
  separate approval before any push, PR, merge, or deployment. Keep the
  experiment measuring and apply its original exposure guard at the next
  authenticated readout.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-29-obsidian-claude-code-refresh early partial at 2026-07-30T05:39:51Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-29-obsidian-claude-code-refresh
- Observed at: 2026-07-30T05:39:51Z
- Readout: correction
- Status: measuring
- Timing: This user-requested immediate observation is 23 hours 32 minutes
  34 seconds after production completed at `2026-07-29T06:07:17Z`. It is an
  early partial technical/evidence observation, not the formal 24-hour
  readout and not an SEO verdict.
- Evidence: The live technical, metadata, content, locale, and complete
  responsive render checks pass. The latest authenticated search and visitor
  range still ends before deployment.
- GSC evidence: The latest reusable authenticated range remains
  `2026-06-28..2026-07-25`, before this refresh. Property totals are 8 clicks
  and 395 impressions; visible-query totals are 2 clicks and 92 impressions;
  the query visibility gap is 6 clicks and 303 impressions. The target page
  separately has 0 clicks, 4 impressions, and page-average position 4.5, but
  there is no visible Obsidian query row or joined visible qualified-query
  row. Page-average position is not an exact-query rank, and no post-change
  search effect is inferred.
- Vercel evidence: The same complete pre-deploy range reports 1,420 raw
  visitors and 1,628 pageviews, 270 direct visitors and 351 direct pageviews,
  and a non-deduplicated 1,152-visitor qualified-source aggregate. The target
  page separately reports 4 visitors and 4 pageviews. Unique
  acquisition-surface visitors and source-to-page sessions remain
  unavailable.
- Umami and GitHub evidence: No authenticated Umami event observation is
  available, so GitHub outbound and CTA are not reported. GitHub public REST
  reports 46 total Wenlan stars; no attribution or causal claim is made.
- Technical and content evidence: The English target returns direct HTTP 200
  with the exact self-canonical, `index, follow`, Article and BreadcrumbList
  JSON-LD, stable `datePublished: "2026-06-06"`,
  `dateModified: "2026-07-29"`, direct-files, active-editor-context, Obsidian
  MCP, and source-backed knowledge-lifecycle sections, three maintained
  Obsidian and Claude Code OSS references plus maintained Wenlan anchors, and
  two visible FAQ controls without `FAQPage`.
- Deployed technical and locale evidence: The audit passes robots, 113
  sitemap URLs, 17 key pages, six utility noindex headers, sitemap-wide
  `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL
  exclusions. The production locale matrix passes 22 expected direct-200
  routes and five expected 404 routes; English and zh-TW remain available,
  while the unsupported zh-CN article route remains a hard 404.
- Render evidence: Fresh complete-page captures at 393 by 852 and 1440 by
  1100 CSS pixels are under `/private/tmp/wenlan-24h-production-qa/`.
  Mobile document width is 393/393 and H1 width is 345/345; the comparison
  table remains contained in a 343-pixel horizontal scroller with a
  378-pixel scroll width. Desktop document width is 1434/1434, H1 width is
  664/664, and the table is 678/678. No clipping, unexpected alpha channel,
  browser warning, or browser error was observed.
- Visual QA pass A: PASS with high confidence. The page is a real shared
  DOM and token-driven article surface with live links, native FAQ details,
  schema, responsive layout, and maintained references; it is not a raster
  substitute.
- Visual QA pass B: PASS with high confidence. Direct inspection of both
  complete captures found no clipping, overflow, broken heading, or visual
  precision defect. The synthesized visual verdict is GOOD.
- Result: pending
- Decision: wait
- Unperformed gated actions: No push, PR, merge, deployment, indexing request,
  GSC validation, Reddit or other external post, OSS submission, paid
  acquisition, synthetic analytics event, account mutation, or
  metric-definition change was performed.
- Next step: Do not treat this early partial observation as a formal 24-hour
  SEO result and do not rewrite the page. Reuse the next authenticated weekly
  range for its declared later readout while keeping GSC, Vercel, Umami, and
  GitHub observations in their native units.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-DATE-SCHEMA-V1 -->
<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-29-docs-github-acquisition

- Record type: experiment-start
- Experiment ID: EXP-2026-07-29-docs-github-acquisition
- Status: active
- Data window: 2026-07-25..2026-07-31
- Asset class: integration-hub
- Launched: 2026-07-29
- Hypothesis: A persistent, restrained repository path in the shared Docs rail will produce measurable GitHub-outbound interest from existing Docs traffic.
- Candidate evidence: Authenticated aligned Vercel data reports 774 visitors and 850 pageviews for `/docs/configuration`; GSC separately reports 12 impressions, 0 clicks, and average position 15.8; the current English Docs renderer has no tracked repository path; GitHub REST reports 46 stars; the maintained repository is `https://github.com/7xuanlu/wenlan`.
- Baseline: GSC property totals are 8 clicks and 395 impressions; visible-query totals are 2 clicks and 92 impressions; the visibility gap is 6 clicks and 303 impressions; Vercel raw totals are 1,420 visitors and 1,628 pageviews; `/docs/configuration` separately has 774 visitors and 850 pageviews; authenticated Umami events are unavailable rather than zero; GitHub has 46 stars.
- Change: Add one compact open-source module below the existing English Docs table of contents and emit the existing bounded `github_outbound` event with placement `docs-article`, locale `en`, context `setup`, and destination category `github`.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 50 Vercel visitors to English Docs slug routes after production
- Success criteria: By the 7-day readout, authenticated Umami reports at least five `github_outbound` events with placement `docs-article`, and the deployed technical floor remains green.
- Failure criteria: At least 100 Vercel visitors reach English Docs slug routes in a complete post-deploy window and authenticated Umami reports zero `docs-article` GitHub outbound events.
- Stop criteria: Stop for a technical SEO regression, broken navigation, unsafe analytics payload, misleading destination, or sustained evidence that the module harms Docs use.
- 24h readout: pending
- 7d readout: pending
- W2 readout: pending
- W4 readout: pending
- W8 readout: pending
- Result: pending
- Decision: wait
- Next step: Complete local code, event-contract, responsive-render, and technical verification, then publish under the user's explicit approval.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-29-docs-github-acquisition production verification

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-29-docs-github-acquisition
- Observed at: 2026-07-30T07:27:30Z
- Readout: correction
- Status: measuring
- Evidence: PR #98 merged as `15fbea08073646d977b9c3b1036e592fe99f5a10`; Vercel production completed at this timestamp. The live `/docs/configuration` route returns the exact self-canonical, `index, follow`, one `Open GitHub` link to `https://github.com/7xuanlu/wenlan` with `_blank` and `noopener noreferrer`, no `FAQPage`, no horizontal overflow, and no browser warning or error. The deployed audit passes robots, 113 sitemap URLs, 17 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy exclusions. No post-deploy GSC, Vercel, authenticated Umami, or attributed GitHub outcome is inferred.
- Result: pending
- Decision: wait
- Next step: Measure the predeclared Docs visitor and authenticated Umami event thresholds at the due readouts while allowing the production-verified slot to pass to the next approved non-overlapping website experiment.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-07-30-knowledge-base-locales-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-07-30-knowledge-base-locales-refresh
- Status: active
- Data window: 2026-07-25..2026-07-31
- Asset class: refresh
- Launched: 2026-07-30
- Hypothesis: Leading the existing Learn hubs and source-backed article routes with a concrete, maintained AI knowledge-base answer in English, zh-TW, and zh-CN will earn more qualified search exposure without creating another low-evidence URL.
- Candidate evidence: Authenticated GSC reports 91 impressions for `/learn`, 4 for the English source-backed article, 1 for its zh-TW route, and 1 for its zh-CN route; authenticated Vercel separately reports 100, 5, 1, and 2 visitors on those same surfaces. Simplified-Chinese community sources independently repeat `LLM Wiki 知识库`, `AI 知识库`, `有来源的知识库`, and `知识库最佳实践`. Exact Taiwan `AI 知識庫` evidence is sparse, so zh-TW remains a bounded refresh of an existing route rather than a demand-volume claim.
- Baseline: GSC property totals are 8 clicks and 395 impressions; visible-query totals are 2 clicks and 92 impressions; the visibility gap is 6 clicks and 303 impressions. Vercel raw totals are 1,420 visitors and 1,628 pageviews. The changed target rows keep GSC clicks at zero and target-page impressions at 91, 4, 1, and 1; Vercel target-page visitors are 100, 5, 1, and 2. Authenticated Umami events are unavailable rather than zero; GitHub public REST reports 46 stars.
- Change: Refresh existing English, zh-TW, and zh-CN Learn hub copy and the existing source-backed article in all three locales around source-backed AI knowledge bases, LLM wiki, provenance, refresh state, review, and a verifiable Wenlan workflow. Preserve URLs, publication dates, locale availability, canonical, sitemap, structured data, and visible-FAQ policy.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 10 GSC impressions across changed canonical pages in one complete post-deploy readout window
- Success criteria: At the W2 readout, the changed canonical pages record at least 10 GSC impressions in total, at least two locale surfaces have nonzero page impressions, and the deployed technical floor remains green.
- Failure criteria: A reliable complete post-deploy readout window reports zero GSC impressions across all changed canonical pages, or the change creates a technical, locale, indexing, or visible-render regression.
- Stop criteria: Stop for a canonical, sitemap, hreflang, noindex, structured-data, unsupported-locale, source-accuracy, CJK-render, or standalone-utility regression.
- 24h readout: pending
- 7d readout: pending
- W2 readout: pending
- W4 readout: pending
- W8 readout: pending
- Result: pending
- Decision: wait
- Next step: Implement the bounded existing-page refresh, verify English and both Mandarin locales in production-rendered desktop and mobile layouts, then publish under the user's explicit approval.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-learn-hub-exposure-refresh superseded at 2026-07-30T07:53:53Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-learn-hub-exposure-refresh
- Observed at: 2026-07-30T07:53:53Z
- Readout: correction
- Status: inconclusive
- Evidence: The experiment remained below its predeclared 100-impression minimum exposure and had no complete 28-day post-deploy readout. The user-approved `EXP-2026-07-30-knowledge-base-locales-refresh` now changes the same English `/learn` metadata, first-screen answer, and search-path framing around the corrected AI knowledge-base and LLM-wiki center. Continuing the older cohort would mix two interventions and make its attribution invalid. This is a superseding campaign decision, not evidence of SEO success or failure.
- Result: inconclusive
- Decision: stop
- Next step: Remove the older Learn-hub cohort from pending 7-day, W2, W4, and W8 judgments. Use the authenticated `EXP-2026-07-30-knowledge-base-locales-refresh` baseline and its predeclared 10-impression cross-locale exposure guard for future `/learn` interpretation.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-30-knowledge-base-locales-refresh production verification

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-30-knowledge-base-locales-refresh
- Observed at: 2026-07-30T08:07:02Z
- Readout: correction
- Status: measuring
- Evidence: PR #99 merged at `2026-07-30T07:58:58Z` as `5a4c8fe302b4557b4f34ca7ac9c40bad4e39bfbc`; Vercel production completed at `2026-07-30T07:59:58Z`. The deployed audit passes robots, 113 sitemap URLs, 17 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy URL exclusions. Live English, zh-TW, and zh-CN Learn hubs and source-backed article routes expose exact self-canonicals, `index, follow`, reciprocal English/zh-TW/zh-CN/x-default alternates, the expected CollectionPage or Article plus BreadcrumbList schema, stable English dates `2026-06-06` / `2026-07-30`, stable Mandarin dates `2026-07-04` / `2026-07-30`, the visible six-command workflow and FAQ, and no horizontal overflow. GSC URL Inspection reported `/learn`, `/zh-TW/learn`, `/zh-CN/learn`, `/zh-TW/learn/source-backed-wiki-pages-ai-work`, and `/zh-CN/learn/source-backed-wiki-pages-ai-work` already on Google; one request-indexing action for each returned `Indexing requested`. These are current index-presence and crawl-queue observations, not a post-change crawl, rank, traffic, or causal result.
- Result: pending
- Decision: wait
- Next step: Keep the production slot open for a non-overlapping evidence-gated candidate. Do not repeat the five indexing requests. At the predeclared readouts, keep property totals, visible-query totals, target-page rows, Vercel observations, authenticated Umami events, and GitHub stars in their native units; mark exposure below 10 target-page GSC impressions inconclusive.
<!-- EXPERIMENT-RECORD:END -->

### 2026-07-31T23:54:43Z — GSC target expansion approval

- Record type: campaign-contract-update
- Contract status: approved by the user in this Codex task
- Deadline: unchanged at 2026-08-18
- Final window: unchanged at the 28 complete days ending 2026-08-17
- GSC property-click target: 100
- GSC property-impression target: 10,000
- Other targets: GitHub stars and Vercel visitors unchanged
- Metric definitions: GSC rolling-28-day property clicks and property
  impressions from `sc-domain:wenlan.app`; property totals remain separate
  from visible-query totals and the query visibility gap
- External actions: none
- Next step: protect the expanded targets in `pnpm seo:goal:check`, then build
  the next action queue around authenticated GSC click and impression growth.

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-01-zhtw-llm-wiki-v2-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-08-01-zhtw-llm-wiki-v2-refresh
- Status: active
- Data window: 2026-08-01..2026-08-07
- Asset class: refresh
- Launched: 2026-08-01
- Hypothesis: Refreshing the existing zh-TW LLM Wiki article with the
  maintained Karpathy and LLM Wiki v2 concept, architecture, RAG and Obsidian
  boundaries, setup, verification, and failure-repair answer will move
  qualified Traditional Chinese LLM-wiki exposure from the homepage toward
  the article and earn at least one target-page click without creating a new
  URL.
- Candidate evidence: Authenticated GSC for `2026-07-03..2026-07-30` maps
  the exact visible query `llm wiki 2.0` to `/zh-TW` with 1 impression,
  0 clicks, and position 13. The zh-TW homepage has 9 impressions, 1 click,
  and page-average position 5.9. The localized LLM Wiki article has no
  privacy-visible page row, remains the older four-section version, and lacks
  the Karpathy and LLM Wiki v2 maintained references present in the English
  and zh-CN guides. The exact query is clear high intent; the existing route
  has a clean partial-coverage gap; Wenlan can prove the workflow with six
  maintained commands; and the standalone architecture and verification
  answer passes the full candidate gate. The deployed technical audit passes,
  so the mismatch is not a technical-indexability defect.
- Baseline: GSC property totals are 10 clicks and 660 impressions;
  visible-query totals are 2 clicks and 111 impressions; the query visibility
  gap is 8 clicks and 549 impressions. The exact `llm wiki 2.0` query-page
  row is 1 impression, 0 clicks, and position 13 on `/zh-TW`. No localized
  target-page row is visible and is not reported as zero. Same-range Vercel
  and GitHub observations remain separate and are not used to infer
  source-to-page sessions or causality.
- Change: Refresh only
  `/zh-TW/learn/distilled-wiki-pages-ai-memory` in idiomatic Traditional
  Chinese. Preserve the existing URL, original `datePublished: 2026-07-04`,
  locale availability, canonical, sitemap, reciprocal hreflang, Article and
  BreadcrumbList schema, and visible FAQ without `FAQPage`. Add no new URL
  and make no homepage change in this experiment.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 5 target-page GSC impressions in one complete
  post-deploy readout window
- Success criteria: At the W2 readout, the target has at least 5 GSC
  impressions and at least 1 GSC click, while the deployed technical and
  locale floor remains green.
- Failure criteria: At the W4 readout, at least 20 target-page GSC impressions
  have accumulated with zero target-page clicks, or a reliable complete
  post-deploy window shows the visible qualified intent continuing to land
  only on `/zh-TW` after Google has recrawled the refreshed article.
- Stop criteria: Stop for a canonical, hreflang, sitemap, indexability,
  structured-data, source-accuracy, unsupported-locale, visible-FAQ, CJK
  rendering, or standalone-utility regression.
- 24h readout: pending
- 7d readout: pending
- W2 readout: pending
- W4 readout: pending
- W8 readout: pending
- Result: pending
- Decision: wait
- Next step: Prepare and verify the bounded local refresh. Stop before push,
  PR, merge, deploy, repeat indexing, GSC validation, or external publication.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-01T02:24:46Z — v0.15.2 release alignment prepared

- Record type: campaign-observation
- Technical correction: `TECH-2026-08-01-release-v0.15.2-alignment`
- Status: local preparation
- Source evidence: immutable Wenlan tag `v0.15.2` and GitHub release
  `https://github.com/7xuanlu/wenlan/releases/tag/v0.15.2` are dated
  `2026-07-31`; the release publishes native Windows x64, macOS Apple
  Silicon, Linux x64, and Linux ARM64 archives. The tagged changelog records
  the setup repair guard and test-config isolation in `v0.15.2`, plus the
  Space Brief workflow and source-truth work in `v0.15.1`.
- Defect: website release metadata, localized download/get-started/about
  copy, About OG copy, changelog/security docs, and sitemap freshness still
  identify `v0.15.0`.
- Change boundary: align those factual public surfaces to `v0.15.2`, its
  immutable assets, and `2026-07-31`. Preserve URLs, canonical/hreflang,
  schema types, locale availability, and the active zh-TW LLM Wiki
  experiment's attribution.
- Metric role: technical and release accuracy only; do not attribute GSC,
  Vercel, Umami, GitHub, download, or star movement to this correction.
- External actions: none. Push, PR, merge, deploy, indexing, validation, and
  external publication remain approval-gated.
- Evidence:
  `docs/seo-audits/2026-08-01-v0.15.2-release-alignment.md`
- Next step: verify immutable asset availability, release contracts,
  localized content, build output, and rendered release surfaces before
  requesting publication approval.

### 2026-08-01T02:37:50Z — due seven-day cohort evidence

- Record type: campaign-observation
- Evidence reuse: the completed authenticated weekly result at
  `/tmp/wenlan-seo/2026-07-31-click-priority.md`; no GSC or Vercel pipeline
  was rerun for this readout.
- Evidence range: `2026-07-03..2026-07-30` for both authenticated GSC and
  Vercel Web Analytics. This rolling range overlaps pre-deploy dates and, for
  the 2026-07-24 and 2026-07-25 changes, does not contain seven complete
  post-deploy dates. It is current aggregate evidence, not a causal cohort.
- GSC property totals: 10 clicks, 660 impressions, 1.52% CTR, and average
  position 10.3. Visible-query totals: 2 clicks and 111 impressions. Query
  visibility gap: 8 clicks and 549 impressions. These remain separate.
- Vercel raw totals: 1,468 visitors and 1,745 pageviews. Direct referrer row:
  307 visitors and 457 pageviews. Qualified-source referrer row aggregate:
  1,163 visitors and 1,286 pageviews, not deduplicated and not joined to page
  rows. Acquisition-surface page rows are reported per experiment below and
  are not summed as unique visitors.
- Umami: authenticated custom-event observations remain account-gated; no CTA
  baseline or event count is invented.
- GitHub: the public REST repository record reported 46 total stars at this
  observation time.
- Indexing: the sitemap API reports 113 submitted web URLs, zero warnings,
  zero errors, and last download `2026-07-31T08:54:03.875Z`. No new target
  URL Inspection read was performed, and a missing GSC page row is not called
  unindexed.
- Technical floor: the current deployed audit passes robots, 113 sitemap
  URLs, 17 key pages, six utility noindex headers, sitemap-wide `FAQPage`
  absence, 25 redirects, six bridge-host redirects, and legacy exclusions.
- Interpretation: no experiment below is called successful or failed from
  this overlapping range. Apply its immutable minimum exposure and final
  evaluation timing at the later due readout.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-23-zhtw-obsidian-localization at 2026-08-01T02:37:50Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-23-zhtw-obsidian-localization
- Observed at: 2026-08-01T02:37:50Z
- Readout: 7d
- Status: measuring
- Evidence: The authenticated GSC page export has no privacy-visible row for
  `/zh-TW/learn/wenlan-vs-obsidian-ai-memory`, and the joined query-page export
  has no row; neither is reported as zero or an indexing state. Vercel reports
  2 visitors and 3 pageviews for the target. The route's deployed technical
  and unsupported-zh-CN 404 floor remains green through the shared audit.
- Minimum exposure: not established; the required 5 GSC page impressions are
  not visible.
- Result: pending
- Decision: wait
- Next step: Reassess at W2 with a later complete GSC range; do not translate
  to zh-CN or repeat indexing from this absence.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-ai-work-memory-knowledge-base-refresh at 2026-08-01T02:37:50Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-ai-work-memory-knowledge-base-refresh
- Observed at: 2026-08-01T02:37:50Z
- Readout: 7d
- Status: measuring
- Evidence: GSC reports 1 click, 16 impressions, and average position 6.8 for
  `/learn/ai-work-memory-vs-knowledge-base`; no privacy-visible query-page row
  is joined to the target. Vercel reports 6 visitors and 6 pageviews. The
  click remains unattributed to a visible query and the range overlaps the
  pre-refresh period.
- Minimum exposure: not reached; 16 target-page impressions are below 20.
- Result: pending
- Decision: wait
- Next step: Keep the existing URL unchanged and apply the 20-impression guard
  at W2 or the next complete post-deploy range.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-llm-wiki-category-refresh at 2026-08-01T02:37:50Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-llm-wiki-category-refresh
- Observed at: 2026-08-01T02:37:50Z
- Readout: 7d
- Status: measuring
- Evidence: GSC reports 0 clicks, 5 impressions, and average position 6.2 for
  `/learn/distilled-wiki-pages-ai-memory`, with no joined visible query row.
  Vercel reports 11 visitors and 15 pageviews. The separate visible
  `llm wiki 2.0` row has 1 impression on `/zh-TW`, not this English page, and
  is not used as target-page exposure.
- Minimum exposure: not reached; 5 target-page impressions are below 10.
- Result: pending
- Decision: wait
- Next step: Continue the English route's W2 measurement separately from the
  new zh-TW refresh; do not merge their evidence or infer a locale effect.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-mcp-shared-memory-exposure at 2026-08-01T02:37:50Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-mcp-shared-memory-exposure
- Observed at: 2026-08-01T02:37:50Z
- Readout: 7d
- Status: measuring
- Evidence: The target `/learn/cursor-claude-code-shared-memory` has 0 GSC
  clicks, 9 impressions, and average position 19.1, with no joined visible
  query row; Vercel reports 2 visitors and 3 pageviews. The linking source
  `/learn/mcp-memory-server` separately has 0 GSC clicks, 15 impressions,
  average position 7.1, and 295 Vercel visitors with 298 pageviews. No
  source-to-target session or causal join is inferred.
- Minimum exposure: not reached; 9 target-page impressions are below 10.
- Result: pending
- Decision: wait
- Next step: Reassess the target at W2 while preserving the single useful
  internal link and the source/target metric separation.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-stale-ai-memory-diagnostic at 2026-08-01T02:37:50Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-stale-ai-memory-diagnostic
- Observed at: 2026-08-01T02:37:50Z
- Readout: 7d
- Status: measuring
- Evidence: The authenticated GSC page and joined query-page exports have no
  privacy-visible row for `/learn/review-before-trust-ai-memory`; absence is
  not reported as zero or unindexed. Vercel reports 4 visitors and 6
  pageviews. The technical floor remains green.
- Minimum exposure: not established; the required 5 GSC page impressions are
  not visible.
- Result: pending
- Decision: wait
- Next step: Keep the diagnostic measuring until a later GSC row or the W2
  readout; do not nominate more generic memory content from this absence.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-claude-mem-comparison-refresh at 2026-08-01T02:37:50Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-claude-mem-comparison-refresh
- Observed at: 2026-08-01T02:37:50Z
- Readout: 7d
- Status: measuring
- Evidence: GSC reports 0 clicks, 27 impressions, and average position 13.1
  for `/learn/wenlan-vs-claude-mem`. Qualified joined visible rows contribute
  5 impressions and 0 clicks; unrelated `mem.ai changelog` remains outside
  that qualified subtotal. Vercel reports 3 visitors and 5 pageviews.
- Minimum exposure: reached in the overlapping aggregate range, but a
  complete seven-day post-deploy GSC cohort is unavailable and W4 evaluation
  is not due.
- Result: pending
- Decision: wait
- Next step: Preserve the page and evaluate the immutable neutral band at W2
  and W4; do not stack another comparison rewrite now.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-24-superlocalmemory-comparison-refresh at 2026-08-01T02:37:50Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-24-superlocalmemory-comparison-refresh
- Observed at: 2026-08-01T02:37:50Z
- Readout: 7d
- Status: measuring
- Evidence: GSC reports 0 clicks, 42 impressions, and average position 7.7
  for `/learn/wenlan-vs-superlocal-memory`; the joined qualified row
  `super local memory` contributes 1 impression and 0 clicks. Vercel reports
  10 visitors and 12 pageviews.
- Minimum exposure: reached in the overlapping aggregate range, but a
  complete seven-day post-deploy GSC cohort is unavailable and W4 evaluation
  is not due.
- Result: pending
- Decision: wait
- Next step: Inspect SERP/snippet intent at W2 without changing the current
  source-backed comparison or treating page-one average position as success.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-25-basic-memory-comparison-refresh at 2026-08-01T02:37:50Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-25-basic-memory-comparison-refresh
- Observed at: 2026-08-01T02:37:50Z
- Readout: 7d
- Status: measuring
- Evidence: GSC reports 1 click, 60 impressions, and average position 11.2
  for `/learn/wenlan-vs-basic-memory`. Qualified joined visible rows
  `basic memory` and `basicmemory` contribute 8 impressions and 0 clicks;
  the page click is outside those rows and remains unattributed. Vercel
  reports 6 visitors and 8 pageviews.
- Minimum exposure: reached in the overlapping aggregate range, but the range
  does not contain seven complete post-deploy dates and the page click cannot
  be assigned to the refresh or a visible query.
- Result: pending
- Decision: wait
- Next step: Preserve the current comparison and evaluate at W2/W4 using a
  later complete range; do not claim early SEO success.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-25-ai-agent-memory-types at 2026-08-01T02:37:50Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-25-ai-agent-memory-types
- Observed at: 2026-08-01T02:37:50Z
- Readout: 7d
- Status: measuring
- Evidence: GSC reports 0 clicks, 7 impressions, and average position 22.4
  for `/learn/ai-agent-memory-types`; two joined visible rows contribute 2
  impressions and 0 clicks. Vercel reports 2 visitors and 2 pageviews. The
  route remains distinct from Wenlan capture metadata and the technical floor
  remains green.
- Minimum exposure: reached in the overlapping aggregate range, but the range
  ends before seven complete post-deploy dates and no early success is called.
- Result: pending
- Decision: wait
- Next step: Apply the original taxonomy and overlap checks at W2, using a
  later complete GSC range before any result judgment.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-25-context-loss-diagnostic-refresh at 2026-08-01T02:37:50Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-25-context-loss-diagnostic-refresh
- Observed at: 2026-08-01T02:37:50Z
- Readout: 7d
- Status: measuring
- Evidence: GSC reports 0 clicks, 3 impressions, and average position 9.7 for
  `/learn/ai-coding-agent-loses-context`, with no joined visible query row.
  Vercel reports 3 visitors and 4 pageviews. The current aggregate preserves
  the diagnostic's separation from Claude Code memory and handoff pages.
- Minimum exposure: not reached; 3 target-page impressions are below 5.
- Result: pending
- Decision: wait
- Next step: Keep the diagnostic unchanged and reassess at W2 with the
  original 5-impression minimum.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-01T02:56:04Z — zh-TW LLM Wiki v2 local preparation verified

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-01-zhtw-llm-wiki-v2-refresh`
- Status: local-prepared
- Change: The existing zh-TW LLM Wiki route now carries the maintained
  seven-section architecture, RAG/Obsidian boundary, setup, verification,
  six-command workflow, failure-repair, and when-not-needed answer. It keeps
  the original URL and publication date, four visible FAQs without
  `FAQPage`, and maintained Wenlan, Karpathy, and LLM Wiki v2 sources.
- Verification: Goal contract pass; SEO tests 202/202; i18n tests 57/57;
  TypeScript pass; production build pass with 214 static pages; built SEO and
  locale technical gates pass; mobile and desktop visual QA pass without
  document overflow or browser errors.
- Typography: Align the localized site with the App's Fraunces/Instrument Sans
  design and native CJK fallback model. Prefer PingFang plus Songti on macOS,
  preserve Microsoft and Noto fallbacks for Windows/Linux, and add no CJK
  runtime dependency. A rejected self-hosted Noto CJK trial generated 429
  font files and 21 MB of media, with roughly 2.6–4.1 MB of sampled page font
  resources; the final build contains 14 font files and 480 KB of media.
- Publish date: not-published
- Index date: not-indexed
- Result: pending
- Decision: publication approval required
- Next step: After explicit approval, publish the bounded local package and
  record the production completion time before starting its 24-hour clock.
  Do not repeat indexing requests or submit GSC validation without a matching
  new coverage condition.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-30-knowledge-base-locales-refresh at 2026-08-01T03:01:49Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-30-knowledge-base-locales-refresh
- Observed at: 2026-08-01T03:01:49Z
- Readout: 24h
- Status: measuring
- Evidence: Production completed at `2026-07-30T07:59:58Z`. The current
  deployed audit passes robots, 113 sitemap URLs, 17 key pages, six utility
  noindex headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge
  redirects, and legacy exclusions. Targeted live checks pass all six changed
  English, zh-TW, and zh-CN Learn hubs and source-backed article routes: each
  returns direct `200`, exact self-canonical, `index, follow`, reciprocal
  English/zh-TW/zh-CN/x-default alternates, its expected CollectionPage or
  Article plus BreadcrumbList schema, visible AI-knowledge-base/LLM-wiki
  wording, the article six-command workflow and stable dates, and no
  `FAQPage`. Authenticated GSC for `2026-07-03..2026-07-30` reports property
  totals of 10 clicks and 660 impressions; visible-query totals of 2 clicks
  and 111 impressions; and a visibility gap of 8 clicks and 549 impressions.
  Changed-page rows separately report `/learn` at 0 clicks/120 impressions,
  English source-backed at 0/4, zh-TW source-backed at 0/1, and zh-CN
  source-backed at 0/1; the two localized Learn hubs have no privacy-visible
  page row and are not reported as zero. The four visible query-page rows on
  those page-visible targets total 0 clicks/7 impressions, leaving a 119-
  impression known-row visibility gap; the report's qualified acquisition
  join is separately 0 clicks/3 impressions on `/learn`. Vercel reports raw
  totals of 1,468 visitors/1,745 pageviews, direct at 307/457, and a non-
  deduplicated qualified-source row aggregate of 1,163/1,286. Target-page
  rows remain separate: `/learn` 105/110, English source-backed 9/9, zh-TW
  Learn 5/5, zh-TW source-backed 4/4, zh-CN Learn 5/5, and zh-CN source-
  backed 6/7; their 134-visitor/140-pageview row sum is not unique visitors
  and has no source join. Authenticated Umami events remain account-gated;
  GitHub separately reports 46 stars. The five approved GSC indexing requests
  were not repeated, and their earlier queue acceptance is not a new crawl.
- Minimum exposure: not assessable yet. The range is mostly pre-deploy and
  includes only the partial post-deploy portion of `2026-07-30`, so it is not
  the required complete post-deploy window even though its overlapping known
  target-page subtotal exceeds 10 impressions.
- Result: pending
- Decision: wait
- Next step: Preserve the six routes and run the 7-day readout after
  `2026-08-06T07:59:58Z` with a later authenticated complete range. Do not
  repeat indexing, submit GSC validation, infer source-to-page sessions, or
  treat the current page-average positions as exact-query ranks.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-01T03:21:16Z — Chinese heading typography correction

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-01-zhtw-llm-wiki-v2-refresh`
- Status: local-prepared
- Observation: Rendered review found the Songti heading fallback visually too
  close to a Ming-style newspaper face and inconsistent with the surrounding
  product interface.
- Change: Retain Fraunces for Latin terms inside display headings, but render
  Traditional and Simplified Chinese heading glyphs with the same native sans
  stacks used by body copy: PingFang on macOS, Microsoft JhengHei/YaHei on
  Windows, and Noto Sans CJK fallbacks on Linux. No CJK webfont was added.
- Publish date: not-published
- Result: pending rendered verification
- Decision: replace the prior local Songti preference before publication
- Next step: Run the i18n, production-build, rendered mobile/desktop, technical
  SEO, and Goal contract gates before requesting publication approval.

### 2026-08-01T03:24:50Z — Chinese heading correction verified

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-01-zhtw-llm-wiki-v2-refresh`
- Status: local-prepared
- Verification: i18n tests pass 57/57; SEO tests pass 202/202 with explicit
  Wenlan and wenlan-app source roots; production build passes with 214 static
  pages; built technical SEO passes with 26 redirects, seven noindex routes,
  113 sitemap URLs, 17 required pages, and no `FAQPage` across 117 HTML pages;
  Goal contract and diff checks pass. Ten rendered captures cover four zh-TW
  and zh-CN surfaces at `393x852` and `1440x1100`. Computed heading stacks are
  Fraunces plus PingFang TC/SC, every document has equal client and scroll
  widths, and no browser console or page errors were observed.
- Evidence: `/private/tmp/wenlan-cjk-sans-heading-visual-qa-2026-08-01/evidence.json`
- Publish date: not-published
- Result: local verification passed
- Decision: keep the native CJK sans heading correction in the unpublished
  package
- Next step: Request publication approval for the already bounded package; do
  not push, merge, or deploy under the current approval state.

### 2026-08-01T03:53:42Z — zh-TW LLM Wiki publication approval

- Record type: campaign-approval
- Related experiment: `EXP-2026-08-01-zhtw-llm-wiki-v2-refresh`
- Contract status: approved by the user in this Codex task
- Approved scope: Commit, push, Draft PR creation, merge to `main`, automatic
  Vercel deployment, and read-only production verification for the bounded
  multilingual SEO package in PR #101. The package includes the existing-route
  zh-TW LLM Wiki refresh, v0.15.2 factual alignment, click-priority pipeline
  correction, and native CJK sans heading correction.
- Excluded scope: Repeat indexing requests, GSC validation, external posts,
  OSS submissions, paid acquisition, synthetic analytics events, analytics
  account mutations, and metric-definition changes.
- Next step: Resolve pre-merge review findings, rerun the full gates, update PR
  #101, and merge only when CI and mergeability remain green.

### 2026-08-01T04:11:03Z — zh-TW LLM Wiki v2 production verification

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-01-zhtw-llm-wiki-v2-refresh`
- Status: measuring
- Publication evidence: PR #101 merged to `main` at
  `2026-08-01T04:04:21Z` as
  `ee72f1dea9bd46e93db220fb70cca420d4684f56`; the Vercel commit status
  reported `Deployment has completed` at `2026-08-01T04:05:07Z`.
- Technical evidence: The deployed audit passes robots, 113 sitemap URLs, 17
  key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25
  redirects, six bridge-host redirects, and legacy exclusions. The live
  `/zh-TW/learn/distilled-wiki-pages-ai-memory` route returns direct `200`,
  exact self-canonical, `index, follow`, Article and BreadcrumbList schema,
  stable `datePublished: 2026-07-04`, `dateModified: 2026-08-01`, all seven
  intended sections, the six-command workflow, maintained sources, and
  visible FAQ text without `FAQPage`. Its sitemap entry retains reciprocal
  English, zh-TW, zh-CN, and x-default alternates and the localized
  `2026-08-01T00:00:00.000Z` last-modified value.
- Measurement evidence: No complete authenticated post-deploy GSC or Vercel
  window exists at production verification time. No click, impression,
  visitor, indexing, or causality result is inferred. Umami remains
  account-gated and GitHub stars remain a separate native-unit observation.
- Publish date: `2026-08-01T04:05:07Z` production completion
- Index date: unknown; no indexing request was repeated
- Result: pending
- Decision: wait for the predeclared exposure window; the production slot is
  open for a separate candidate that passes the full evidence gate
- Next step: Append the actual 24-hour technical/evidence readout after
  `2026-08-02T04:05:07Z`. Do not stack another change on this route or infer
  SEO success before the target-page exposure gate.

### 2026-08-01T04:20:26Z — priority-cluster Trends refresh

- Record type: campaign-observation
- Related experiment: none; demand-discovery only
- Status: candidate-evidence-refreshed
- Source: Signed-in official Google Trends Explore, Google Web Search, past
  12 months. Three requests preserve 53 raw weekly `0–100` index rows for
  English Worldwide, Traditional Chinese Taiwan, and Simplified Chinese
  phrases Worldwide. Raw CSVs and SHA-256 provenance are recorded in
  `docs/seo-audits/2026-08-01-priority-cluster-trends-refresh.md` and remain
  under `/tmp/wenlan-seo-demand/2026-08-01/trends/`.
- Evidence: English `LLM wiki` moved from a first-13-week average of 6.5 to a
  latest-13-week average of 63.1, while `AI knowledge base` moved from 29.5
  to 61.7 inside the same request. Taiwan `LLM wiki` moved from 0.0 to 48.6.
  The Simplified-Chinese Worldwide request moved `LLM wiki` from 6.5 to 63.1
  and `AI 知识库` from 1.5 to 14.1; this is not mainland-China demand. Exact
  Codex and ChatGPT knowledge-base phrases remained much smaller.
  Related-query panels were not retained and are excluded from the decision
  evidence.
- Native-unit boundary: Every value is a request-relative Trends index, not
  search volume, GSC, traffic, or a cross-request conversion. GSC property,
  visible-query, visibility-gap, Vercel, Umami, and GitHub observations remain
  separate.
- Result: The retained time series supports the co-primary LLM Wiki plus AI
  knowledge-base lane and rejects separate exact-phrase Codex/ChatGPT
  knowledge-base articles. Karpathy remains explicit and
  modifier-qualified Obsidian remains an ecosystem bridge under the Frozen
  Goal Contract and prior inspectable evidence, not this unretained
  related-query view.
- Decision: nominate a three-locale existing-page/snippet/internal-link audit
  without treating the weekly window or a measuring experiment as a launch
  blocker
- Next step: Reconcile the next available authenticated GSC query-page join
  with the existing English, zh-TW, and zh-CN LLM-wiki and source-backed
  knowledge-base pages. A separate non-overlapping candidate may proceed when
  it passes the full gate. Do not create a new URL or publish from Trends
  alone.

### 2026-08-01T04:36:11Z — v0.15.2 release alignment production verification

- Record type: campaign-observation
- Technical correction: `TECH-2026-08-01-release-v0.15.2-alignment`
- Status: production-verified
- Publication evidence: PR #101 merged to `main` at
  `2026-08-01T04:04:21Z` as
  `ee72f1dea9bd46e93db220fb70cca420d4684f56`; Vercel reported production
  completion at `2026-08-01T04:05:07Z`.
- Live evidence: English, zh-TW, and zh-CN `/download` routes return direct
  `200` and expose `v0.15.2` plus all four immutable platform asset names.
  English, zh-TW, and zh-CN `/docs/get-started` routes return direct `200` and
  expose `v0.15.2` plus the Windows asset. All three About routes return
  direct `200` and expose `v0.15.2`. The live sitemap records
  `2026-07-31T00:00:00.000Z` for all nine localized Download, About, and Get
  Started URLs.
- Technical evidence: The same production deployment passed robots, 113
  sitemap URLs, 17 key pages, six utility noindex headers, sitemap-wide
  `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy
  exclusions.
- Metric role: release and download accuracy only. No GSC, Vercel, Umami,
  GitHub, download, setup, or star movement is attributed to this correction.
- Result: production verification passed
- Decision: close the technical correction as production-verified; it does
  not consume the website production slot
- Next step: Keep release claims aligned to immutable Wenlan releases; no
  indexing request, GSC validation, external publication, or metric change is
  implied.

### 2026-08-01T04:51:43Z — OSS directory distribution candidate prepared

- Record type: campaign-observation
- Related experiment: none; approval-gated candidate only
- Status: local-prepared
- Candidate: one coordinated distribution proposal for
  `punkpeye/awesome-mcp-servers` and
  `gavischneider/awesome-llm-wiki`. Wenlan is absent from both current
  repositories.
- Native source evidence: GitHub reports 91,667 stars for Awesome MCP Servers
  and 43 stars for Awesome LLM Wiki at capture. Those repository stargazer
  counts are audience-size observations only; they are not Wenlan impressions,
  traffic, clicks, or predicted stars.
- Candidate evidence: the current provider search set contains multiple
  exact-topic LLM Wiki products, directories, implementations, and guides but
  not Wenlan. Awesome MCP Servers is active and recently merged inspectable
  Knowledge & Memory additions within minutes to roughly one day. Awesome LLM
  Wiki explicitly accepts local compilers, daemons, MCP integrations, and
  agent skills. Search-result order is not reported as GSC or Google rank.
- Coverage and proof: Wenlan already has maintained English, zh-TW, and zh-CN
  LLM Wiki and source-backed knowledge-base coverage. Its public source proves
  the Rust CLI, daemon, MCP server, citation-gated Markdown Pages, agent
  plugins, local Git history, and released macOS, Windows, and Linux runtimes.
  The clean gap is third-party discovery, not another article.
- Local change: exactly one non-promotional README line is prepared in each
  pinned clone under `/private/tmp`. Both diffs pass `git diff --check`; the
  Awesome LLM Wiki patch also passes its official `npm test` and
  `awesome-lint README.md` gate.
- Baseline: GitHub reports 46 Wenlan stars. The latest authenticated GSC
  property totals remain 10 clicks and 660 impressions; Vercel remains 1,468
  visitors in its separate same-range observation. No source is joined or
  attributed to another.
- Result: candidate gate passed; external action not started
- Decision: request one explicit approval covering the two factual directory
  PR submissions. Treat the large MCP directory as reach and the smaller LLM
  Wiki directory as topical relevance; do not claim either will cause stars or
  search lift.
- Next step: If approved, append the immutable experiment start and submit
  only the two verified one-line PRs. Otherwise keep the patches local. Do not
  fork, push, open external PRs, request indexing, submit GSC validation, or
  mutate analytics without approval.

### 2026-08-01T05:11:57Z — OSS directory candidate inventory correction

- Record type: campaign-observation
- Related experiment: none; approval-gated distribution correction
- Status: candidate-evidence-refreshed
- Correction: The first two-repository audit was incomplete. The account-wide
  GitHub inventory found 20 relevant forks, ten still-open pre-Wenlan PRs, four
  upstream-merged pre-Wenlan PRs, one additional entry merged manually after PR
  closure, one closed unmerged PR with a new Glama prerequisite, and four
  forks without an external PR. No prior external PR authored by `7xuanlu`
  contains the Wenlan brand.
- Maintainer evidence: `punkpeye/awesome-mcp-servers` PR #7080 was closed after
  the project required a Glama listing, runtime/introspection checks, and score
  badge. Public Glama API reads for both `7xuanlu/wenlan` and
  `7xuanlu/origin` returned HTTP 404. The earlier local patch is therefore not
  submission-ready. `hashgraph-online/awesome-codex-plugins` separately
  requires a repository-root plugin manifest, HOL scanner CI, score >=80/130,
  and no high or critical findings; Wenlan's plugin currently lives under
  `plugin-codex/`, so a directory PR would fail its published gate.
- Decision: Update valid existing PRs and accepted listings in place, submit
  only new directories whose current gate passes, and keep the Glama and Codex
  packaging prerequisites explicit. Do not duplicate old pre-Wenlan submissions
  or disguise an obsolete bundled plugin as a mechanical rebrand.
- Evidence: `docs/seo-audits/2026-08-01-oss-directory-publication-scope.md`
- Result: corrected publication scope prepared
- Next step: Record explicit publication approval, publish the control-plane
  correction, then update or submit the non-duplicate external changes.

### 2026-08-01T05:11:57Z — complete OSS directory publication approval

- Record type: campaign-approval
- Related experiment: OSS directory rebrand and distribution campaign
- Contract status: approved by the user in this Codex task
- Approved scope: Commit, push, ready PR creation, merge to `wenlan-site`
  `main`, automatic Vercel deployment of the docs-only control-plane update,
  and external fork/branch pushes plus PR or repository-supported directory
  submission for the non-duplicate scope in
  `docs/seo-audits/2026-08-01-oss-directory-publication-scope.md`. Existing
  pre-Wenlan PRs and accepted listings must be updated in place where possible.
- Excluded scope: Wenlan website content changes, request indexing, GSC
  validation, analytics mutation, paid acquisition, unsupported ranking or
  benchmark claims, unrelated external posts, and prerequisite product or
  plugin-packaging changes that require a separate contract.
- Native-unit boundary: PR states, accepted listing count, listing-days,
  GitHub stars, GSC, Vercel, and Umami remain separate. No causal claim or
  source-to-page join is authorized.
- Next step: Publish this control-plane correction, then execute the verified
  in-place updates and new high-fit submissions. Stop at any newly discovered
  maintainer or prerequisite boundary rather than forcing a duplicate PR.

### 2026-08-01T05:11:57Z — OSS publication action classification correction

- Record type: campaign-observation
- Related experiment: none
- Status: approved-distribution-action
- Correction: The superseded two-repository preflight said approval would be
  followed by an immutable experiment start. The complete inventory shows a
  mixed maintenance and distribution action: most work updates existing PRs or
  accepted entries, and no reliable directory-to-GitHub, GSC, Vercel, or Umami
  attribution exists. It is therefore tracked as a campaign action rather than
  a new Goal experiment.
- Guard: The action does not increment the active experiment count or consume
  the website production slot. Append campaign observations for PR state,
  maintainer feedback, accepted-listing presence, and complete live
  listing-days. Keep GitHub, GSC, Vercel, and authenticated Umami separate.
- Submission boundary: The `mcpservers.org` form requires a contact email and
  offers an optional $39 Premium path. Keep it pending until an approved email
  is available, do not store that address in the repository, and use only the
  free path. Before every external push or form submission, search the current
  upstream, all-author PRs, and directory surface for an existing Wenlan name
  or repository URL; update an existing path instead of creating a duplicate.
- Result: approved
- Decision: execute the non-duplicate publication scope
- Next step: Publish the corrected control plane and then execute the verified
  external actions. Do not create an experiment-start record for this batch.

### 2026-08-01T06:00:29Z — OSS directory publication execution

- Record type: campaign-observation
- Related experiment: none; approved distribution action
- Status: partially-published
- Control-plane publication: Wenlan site PR #103 merged at
  `2026-08-01T05:35:39Z` as
  `554df3bc1b09747fa28bd226883ddc94a8475d97` after the Goal verifier, 204
  SEO tests, `git diff --check`, independent review, and Vercel checks passed.
- New exact-topic submission: `gavischneider/awesome-llm-wiki` PR #4 is open,
  ready, mergeable, and its GitGuardian check passed.
- Existing PR maintenance: nine existing pre-Wenlan PR branches were updated
  in place rather than duplicated: `jvidal86` #1, `composio-community` #254,
  `mcp-finder` #2, `ComposioHQ` #852, `tolkonepiu` #225, `YuzeHao2023` #266,
  `rohitg00` #231, `XiaomingX` #8, and `wfnuser` #6. Names, repository and
  package links, current product framing, docs, and the 46-star observations
  were updated only where the target format carries them.
- Accepted-listing refreshes: `TeleAI-UAGI` #72, `DhanushNehru` #52,
  `toolsdk-ai` #433, and `TensorBlock` #1500 are open and mergeable. ToolSDK
  Package Schema Check and biome passed; a trusted-main local validator checked
  one changed registry file with zero errors and zero warnings. Composio #852
  passed validation after its alphabetical-order correction.
- Runtime evidence: local daemon health returned `ok`; `wenlan-mcp 0.15.1`
  completed MCP `initialize` and `tools/list` over stdio and returned 29 tools.
  The npm registry separately reports published `wenlan-mcp 0.15.2`,
  `Apache-2.0`, repository `7xuanlu/wenlan`, and bin entry `run.js`. These are
  capability and package observations, not traffic or conversion metrics.
- Platform blockers: GitHub recognized the prepared appcypher comparison as
  one commit ahead but denied PR creation through GraphQL and REST. Dhanush
  #52's link check fails on nine unrelated upstream links, not the Wenlan URL.
  The `mcpservers.org` free form is prepared with Premium unchecked but remains
  pending explicit contact-email confirmation. Glama requires GitHub OAuth and
  GitHub App repository access before the punkpeye prerequisite can pass; that
  permission mutation was not authorized. The Codex directory still requires
  a separate repository-root plugin packaging and scanner change.
- Duplicate evidence: Immediately before each push, current upstream files,
  all-author open and closed PRs, and the directory surface were checked for
  Wenlan and `7xuanlu/wenlan`. Existing entries were updated instead of
  duplicated; no new PR was created where state or permissions were blocked.
- Native-unit boundary: 14 external PR states, four accepted-listing refresh
  proposals, nine in-place PR updates, one new exact-topic submission, one
  prepared form, 46 GitHub stars, GSC, Vercel, and Umami remain separate. No
  directory-to-star, directory-to-search, or source-to-page causality is
  inferred.
- Result: Approved publication scope executed where repository gates permitted;
  remaining form and prerequisite lanes are account- or permission-gated.
- Decision: Wait for maintainer review and complete the free form only after
  the destination-specific email confirmation. Do not repair unrelated
  upstream link debt, install a GitHub App, pay for Premium, or start another
  SEO experiment under this action.
- Next step: Recheck PR state and direct accepted-listing presence after 24
  hours and seven complete live days. Keep listing-days, GitHub, GSC, Vercel,
  and Umami in their native units.

### 2026-08-01T06:38:49Z — mcpservers.org free submission accepted

- Record type: campaign-observation
- Related experiment: none; approved distribution action
- Status: submitted-pending-review
- Submission: The repository-supported `mcpservers.org` form accepted Wenlan
  submission ID `5334` with category `memory`, `plan=free`, and
  `paymentStatus=not_required`. The destination returned `pending`; this is a
  review-queue state, not an accepted or live directory listing.
- Contact boundary: The user explicitly confirmed the public contact email for
  this destination. The address is intentionally not stored in the repository.
- Duplicate gate: The prepared submission had already passed the directory
  inventory gate. A current post-submit reconciliation found no Wenlan name or
  `7xuanlu/wenlan` match in `wong2/awesome-mcp-servers`, no open or closed PR
  by `7xuanlu` there, and no indexed `mcpservers.org` result for Wenlan.
- Native-unit boundary: One pending free-form submission remains separate from
  accepted listing count, complete listing-days, external PR states, GitHub
  stars, GSC, Vercel, and Umami. No acquisition or ranking effect is inferred.
- Result: free submission accepted into review queue
- Decision: wait for maintainer review; do not resubmit or select Premium
- Next step: At the 24-hour and seven-complete-live-day checks, record the
  direct listing state and listing-days only if the Wenlan listing becomes
  publicly accessible.

### 2026-08-01T07:05:47Z — homepage acquisition-link restoration prepared

- Record type: campaign-observation
- Related experiment: none; technical information-architecture candidate
- Status: local-prepared, not published
- Evidence: The authenticated 2026-07-03 through 2026-07-30 GSC range has
  10 property clicks and 660 property impressions. The visible exact query
  `llm wiki 2.0` maps 1 impression, 0 clicks, and average position 13 to
  `/zh-TW`, while the intended localized guide is a different URL. Same-range
  Vercel remains separate at 1,468 visitors and 1,745 pageviews.
- Defect: English, zh-TW, and zh-CN content dictionaries retained direct LLM
  Wiki guide metadata, but the homepage renderer stopped emitting it after the
  redesign. Deployed homepages therefore had no direct link to either the
  localized LLM Wiki guide or the localized source-backed AI knowledge-base
  guide.
- Local change: Add a low-density navigation row after the hero, replace the
  unused memory-first homepage link metadata with the two acquisition-center
  guides, localize both targets in all three languages, and track bounded
  `learn_article_click` events with `placement="home-acquisition"`. Preserve
  Download and GitHub CTAs and every public URL.
- RED evidence: An actual `HomePage` static-render contract failed for all
  three locales before implementation. The same contract passes after the
  local correction; full verification and rendered QA remain pending.
- Attribution boundary: This is not an experiment start and no result is
  inferred. If deployed, it adds inbound exposure to the measuring zh-TW LLM
  Wiki target, so that deployment time must be recorded in its readout.
- External boundary: No push, PR, merge, deployment, indexing request, GSC
  validation, analytics mutation, or external publication is authorized by
  this preparation.
- Evidence: `docs/seo-audits/2026-08-01-home-acquisition-links-prelaunch.md`
- Next step: Complete the local test, build, technical SEO, and fresh
  desktop/mobile render gates, then request a distinct website-publication
  approval if the candidate remains green.

### 2026-08-01T07:22:42Z — homepage acquisition-link restoration locally verified

- Record type: campaign-observation
- Related experiment: none; technical information-architecture candidate
- Status: local-verified, not published
- Verification: `pnpm test:i18n` passed 58 of 58, `pnpm lint` passed,
  `pnpm test:seo` passed 204 of 204 with explicit Wenlan sibling roots,
  `pnpm build` emitted 214 pages, `pnpm seo:technical:built` passed, and the
  built locale check passed 22 expected 200 routes plus 5 expected 404 routes.
- Render evidence: English, zh-TW, and zh-CN were inspected at 1440-pixel
  desktop and 393-pixel mobile widths in dark and light themes. All six
  viewports had no horizontal overflow. Both acquisition links remained
  readable without clipping or CJK phrase-break regressions, and Download and
  GitHub retained primary CTA hierarchy.
- Visual decision: Pass A implementation fidelity PASS; Pass B design quality
  PASS; synthesized verdict GOOD. Baseline diffs were attributable to the
  existing animated hero, the intended new row, and its expected downstream
  shift rather than an unrelated regression.
- Performance boundary: two existing localized link components were added;
  no dependency, script, media, animation, or client boundary was introduced.
  Lighthouse is unavailable locally, so no score is claimed.
- External boundary: This verification does not authorize a commit, push, PR,
  merge, deployment, indexing request, GSC validation, or external post.
- Evidence: `docs/seo-audits/2026-08-01-home-acquisition-links-prelaunch.md`
- Next step: Request a distinct website-publication approval, then record the
  production completion time against the existing zh-TW LLM Wiki readout.

### 2026-08-01T07:28:06Z — homepage production contrast reconfirmed

- Record type: campaign-observation
- Related experiment: none; technical information-architecture candidate
- Status: production defect confirmed; local fix remains unpublished
- Evidence: Fresh direct reads returned HTTP 200 for the English, zh-TW, and
  zh-CN homepages. None of the three production HTML responses contained the
  localized LLM Wiki guide href or source-backed AI knowledge-base guide href.
- Interpretation: The live site still requires a Learn-hub detour, while the
  local verified candidate restores both direct paths. This is technical
  corroboration, not an SEO result or evidence of causality.
- Decision: Keep the local candidate unchanged and do not stack a `/learn`
  rewrite. The authenticated 120-impression Learn row mostly predates its
  latest production refresh and cannot justify another edit yet.
- External boundary: Push, PR, merge, deployment, indexing request, and GSC
  validation still require a distinct explicit website-publication approval.

### 2026-08-01T07:32:20Z — core-guide internal-link graph quantified

- Record type: campaign-observation
- Related experiment: none; technical information-architecture candidate
- Status: local-verified, not published
- Production evidence: A deterministic rendered-anchor crawl fetched all 113
  canonical sitemap pages without a failure. Each English core guide has 7
  unique non-self source pages, each zh-TW guide has 3, and each zh-CN guide
  has 2. Link occurrences remain a separate native count: English LLM Wiki
  20, English AI knowledge base 14, zh-TW 12 and 12, zh-CN 11 and 11.
- Local-build evidence: The matching 113-route crawl also had no failures and
  adds exactly one occurrence and one unique non-self source to every target:
  `/`, `/zh-TW`, or `/zh-CN` respectively. No other inbound source changes.
- Interpretation: The Mandarin graph is thinner than English but no target is
  orphaned. The evidence supports the existing bounded homepage correction;
  it does not support another article, a broad link spray, or a `/learn`
  rewrite.
- Raw boundary: Machine crawl output remains outside git under
  `/private/tmp`; only this interpreted native-unit summary is committed to
  the campaign ledger.
- External boundary: Push, PR, merge, deployment, indexing request, and GSC
  validation still require a distinct explicit website-publication approval.

### 2026-08-01T14:05:56Z — homepage acquisition links approved for publication

- Record type: campaign-observation
- Related experiment: none; technical information-architecture correction
- Status: approved, awaiting GitHub publication
- Approval: The user explicitly approved publishing the exact locally
  verified three-language homepage acquisition-links scope.
- Authorized actions: commit, push, PR creation, merge, automatic Vercel
  deployment, and read-only production verification.
- Excluded actions: request indexing, GSC validation, another website change,
  analytics mutation, paid acquisition, and unrelated external publication.
- Attribution boundary: Record production completion against the measuring
  zh-TW LLM Wiki experiment because the new homepage link adds inbound
  exposure; do not claim SEO lift or causality at deployment.

### 2026-08-01T14:22:36Z — homepage acquisition links production verified

- Record type: campaign-observation
- Related experiment: none; `TECH-2026-08-01-home-acquisition-links`
- Status: production-verified
- GitHub: PR #106 merged at `2026-08-01T14:19:05Z` as
  `c8ae3c82a281464bc29966785d77bf670bc439cc` after its Vercel preview checks
  passed.
- Deployment: Vercel marked the main-branch production deployment complete at
  `2026-08-01T14:19:53Z`.
- Live render: English, zh-TW, and zh-CN homepages each returned direct HTTP
  200 and rendered both exact localized guide hrefs and labels.
- Technical floor: The deployed audit passed robots, 113 sitemap URLs, 17 key
  pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25
  redirects, six bridge-host redirects, and old-URL sitemap exclusion.
- Link graph: The post-deploy crawl fetched 113 of 113 sitemap pages without a
  failure and confirmed the predeclared one-source increase: 8 non-self
  sources per English core guide, 4 per zh-TW guide, and 3 per zh-CN guide.
- Attribution boundary: Record `2026-08-01T14:19:53Z` in the measuring zh-TW
  LLM Wiki readout as an added homepage exposure. Production integrity is
  verified; no SEO lift, click, conversion, star attribution, or causality is
  inferred.
- External boundary: No indexing request, GSC validation, analytics mutation,
  paid acquisition, or unrelated external publication was performed.

### 2026-08-01T16:43:08Z — download and signup attribution prepared locally

- Record type: campaign-observation
- Related experiment: none; `TECH-2026-08-01-download-signup-attribution`
- Status: local preparation; website-change slot occupied
- GitHub evidence: A read-only snapshot at `2026-08-01T16:47:51.633Z`
  reports 46 stars, 19 cumulative downloads across the four website-linked
  `v0.15.3` assets, and 1,376 cumulative downloads across all assets in all 44
  returned releases. These are point-in-time GitHub counters.
- Umami boundary: A successful waitlist response emits one anonymous
  `waitlist_signup` event with placement, locale, context, and destination
  category only. Email, referrer, UTM values, and paths are excluded.
- Resend boundary: Optional contact properties retain locale, landing path,
  referrer host, and UTM source, medium, and campaign only after the six
  properties are initialized and the production feature flag is enabled.
- Homepage placement: The existing waitlist remains in the bottom closing CTA
  and is not moved directly below the Download section.
- Release correction: The local public-site release contract and localized
  copy now match the source-backed and publicly released `v0.15.3`; the prior
  `v0.15.2` surface was stale.
- Decision: Keep GitHub downloads, Umami events, Resend contacts, stars, GSC,
  and Vercel in separate native units. Do not infer a person-level join or
  causality.
- External boundary: No Resend property, Vercel variable, synthetic event,
  contact, push, PR, merge, or deployment was created. Each remains gated.

### 2026-08-01T17:03:53Z — download and signup attribution locally verified

- Record type: campaign-observation
- Related experiment: none; `TECH-2026-08-01-download-signup-attribution`
- Status: local-verified, not published
- Verification: `pnpm seo:goal:check` passed; `pnpm lint` passed;
  `pnpm test:seo` passed 209 of 209; `pnpm test:i18n` passed 58 of 58;
  `pnpm build` emitted 214 pages; `pnpm seo:technical:built` passed; and the
  fixture-backed weekly pipeline health check passed.
- Render evidence: English, zh-TW, and zh-CN desktop/mobile views had no
  horizontal overflow. The unchanged closing CTA and each mobile waitlist
  form matched production at 100/100 pixel similarity. DOM inspection
  confirmed the bounded locale, landing-path, referrer-host, and UTM fields.
- Release evidence: Final review aligned the changelog date and v0.15.3-only
  highlights with the official release instead of carrying older bullets
  forward.
- Interpretation: The three source-native observation lanes are ready for
  publication and account setup, but no conversion lift, completed-download
  attribution, person-level join, or causality is inferred.
- External boundary: Commit, push, PR, merge, deployment, Resend property
  creation, Vercel environment mutation, synthetic events, and a live signup
  remain unperformed and separately gated.

### 2026-08-01T18:42:18Z — Resend and Vercel measurement setup verified

- Record type: campaign-observation
- Related experiment: none; `TECH-2026-08-01-download-signup-attribution`
- Status: account setup complete; branch deployment pending
- Existing secrets: Vercel Production and Preview already contained
  `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, and
  `NEXT_PUBLIC_UMAMI_WEBSITE_ID`. Their values were neither copied nor
  printed.
- Resend setup: Created and verified six string properties:
  `signup_locale`, `signup_landing_path`, `signup_referrer_host`,
  `signup_utm_source`, `signup_utm_medium`, and `signup_utm_campaign`.
- Vercel setup: Added `RESEND_ACQUISITION_PROPERTIES_ENABLED=1` to Production
  and Preview. The dashboard explicitly requires a new deployment before it
  takes effect; current production still runs the old code.
- API verification: A production-key aggregate fetch succeeded. For the
  completed `2026-07-03..2026-07-30` GSC-aligned range, the configured Resend
  audience reports 2 total subscribed contacts, 0 contacts created in range,
  and 0 attributed contacts in range. The output contains no email addresses.
- Pipeline verification: The weekly generator consumed the Resend aggregate
  together with current GSC and Vercel inputs and kept Resend contacts in their
  own native unit. It did not infer a cross-source user or causal conversion.
- OpenSEO boundary: The official MCP endpoint was added, but real query testing
  remains blocked on user-completed OAuth. No paid plan or Google Search
  Console access was granted.
- Approval: The user authorized completion and publication of this exact
  measurement scope. Synthetic events, paid service activation, external
  posting, indexing requests, GSC validation, and unrelated changes remain
  excluded.

### 2026-08-01T19:02:55Z — OpenSEO evaluation and pre-merge hardening

- Record type: campaign-observation
- Related experiment: none; demand discovery plus
  `TECH-2026-08-01-download-signup-attribution`
- OpenSEO scope: Added the official hosted project for `wenlan.app` and used
  trial credits only. GSC was not connected and no paid plan was activated.
- OpenSEO native observations: United States `llm wiki` displayed 5,400,
  United States `AI knowledge base` 880, United States
  `obsidian claude code` 210, Taiwan `AI 知識庫` 210, and United States
  `chatgpt knowledge base` 50. United States `codex knowledge base` suffered an
  unrelated intent collision; Singapore `AI 知识库` returned insufficient
  data. These third-party displayed volumes remain separate from GSC and
  Trends.
- SERP observation: Wenlan was absent from the observed top 10 for United
  States `llm wiki` and Taiwan `AI 知識庫`. The Taiwan result set joined AI
  knowledge base, Obsidian, and Karpathy in one intent family.
- Decision: Keep LLM Wiki, Karpathy, and AI knowledge base together as the top
  acquisition family; keep Obsidian plus Claude Code/MCP as the next clean
  workflow cluster. OpenSEO is useful for English/Taiwan nomination and SERP
  inspection, but its generic AI expansion was noisy and it did not close the
  Simplified Chinese gap. No new site experiment starts from this evaluation.
- Review correction: Hardened attribution ingestion and export against query
  or fragment-bearing paths, malformed hosts, disallowed UTM characters, and
  ASCII or internationalized email-like values. Resend property setup now
  paginates with an advance guard; GitHub credentials stay on the official API
  origin; both GitHub REST and `gh` release enumeration have a 1,000-release
  cap.
- Verification boundary: Targeted regression tests and TypeScript pass. Full
  SEO, i18n, build, technical, Goal, and final review gates must be rerun after
  these last edits before publication.
- Evidence: `docs/seo-audits/2026-08-01-openseo-evaluation.md` and
  `/tmp/wenlan-seo-demand/2026-08-01/openseo/observations.json`.

### 2026-08-01T19:09:02Z — measurement correction final gate passed

- Record type: campaign-observation
- Related experiment: none; `TECH-2026-08-01-download-signup-attribution`
- Status: approved and ready for GitHub publication
- Fresh-eye review: `MERGE`; all prior privacy, credential-origin,
  pagination, and resource-cap findings are resolved with regressions.
- Verification: `pnpm seo:goal:check` passed; `pnpm lint` passed; `pnpm
  test:seo` passed 215 of 215; `pnpm test:i18n` passed 58 of 58; `pnpm build`
  emitted 214 pages; `pnpm seo:technical:built` passed; the local production
  server passed 22 expected i18n 200 routes and 5 expected 404 routes; `pnpm
  seo:weekly:sample` passed; and `git diff --check` passed.
- Account verification: The hardened idempotent property check found all six
  existing Resend properties. The privacy-filtered, configured-audience fetch
  again returned 2 total subscribed contacts, 0 contacts in the completed
  GSC-aligned range, and 0 attributed contacts in that range.
- External boundary: The approved commit, PR, merge, automatic Vercel
  deployment, and read-only production verification may proceed. Synthetic
  events, a fabricated contact, paid activation, indexing requests, GSC
  validation, and unrelated publication remain excluded.

### 2026-08-01T19:17:55Z — download and signup attribution production-verified

- Record type: campaign-observation
- Related experiment: none; `TECH-2026-08-01-download-signup-attribution`
- Status: production-verified; website-change slot released
- Publication: PR #108 merged at `2026-08-01T19:14:11Z` as
  `3daf34b31d43ecaa4f4eaaf365a7fb3565ba3327`; Vercel marked the main-branch
  production deployment complete at `2026-08-01T19:14:59Z`.
- Technical floor: The deployed audit passed robots, 113 sitemap URLs, 17 key
  pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25
  redirects, six bridge-host redirects, and old-URL sitemap exclusion.
- Live acquisition surface: English, zh-TW, and zh-CN homepages and the
  download page expose the Umami script, current `v0.15.3` release metadata,
  current Windows, macOS Apple Silicon, Linux x86_64, and Linux aarch64 asset
  URLs, and the bounded `setup_path_click` and `github_outbound` event wiring.
- Signup measurement: All six Resend string properties and the production
  feature flag were verified before deployment. Future successful signups can
  store the bounded acquisition fields in the configured Resend audience and
  emit one anonymous `waitlist_signup` event. No consented test address was
  supplied, so no contact or synthetic event was generated for this check.
- Baseline remains native-unit and non-causal: 2 total subscribed contacts in
  the configured Resend audience, 0 contacts created in the completed
  `2026-07-03..2026-07-30` range, and 0 attributed contacts in that range.
  GitHub downloads, Umami events, Resend contacts, stars, GSC, and Vercel are
  not joined or converted into one score.
- External boundary: No indexing request, GSC validation, paid activation,
  unrelated publication, fabricated contact, or synthetic analytics event was
  performed.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-23-zhtw-obsidian-localization superseded at 2026-08-01T19:34:18Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-23-zhtw-obsidian-localization
- Observed at: 2026-08-01T19:34:18Z
- Readout: correction
- Status: inconclusive
- Evidence: The latest authenticated `2026-07-03..2026-07-30` GSC page table still has no privacy-visible row for the zh-TW target and is not reported as zero; Vercel separately reports 2 visitors and 3 pageviews. Fresh official Trends, OpenSEO, live-SERP, maintained OSS, and Mandarin community evidence now supports replacing the page's older `AI 筆記` and `Agent Memory` framing with a direct-files, editor-context, MCP, and source-backed AI knowledge-base answer. The new experiment changes the same title, first answer, and workflow surface, so continuing the older cohort would mix interventions. No SEO success or failure is inferred.
- Result: inconclusive
- Decision: stop
- Next step: Remove the earlier zh-TW-only cohort from future verdicts. Preserve its historical observations, but use `EXP-2026-08-01-obsidian-knowledge-base-locales` and its separate per-locale exposure guards after publication.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-01-zhtw-llm-wiki-v2-refresh production verification at 2026-08-01T04:11:03Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-01-zhtw-llm-wiki-v2-refresh
- Observed at: 2026-08-01T04:11:03Z
- Readout: correction
- Status: measuring
- Evidence: PR #101 merged to `main` at `2026-08-01T04:04:21Z` as `ee72f1dea9bd46e93db220fb70cca420d4684f56`; Vercel reported production completion at `2026-08-01T04:05:07Z`. The deployed technical audit passed and the live zh-TW LLM Wiki route retained its self-canonical, reciprocal locale alternates, sitemap membership, indexability, Article and BreadcrumbList schema, stable `datePublished: 2026-07-04`, `dateModified: 2026-08-01`, seven intended sections, six-command workflow, maintained sources, and visible FAQ without `FAQPage`. No complete post-deploy GSC or Vercel window existed at verification time.
- Result: pending
- Decision: wait
- Next step: Append the actual 24-hour technical/evidence readout after `2026-08-02T04:05:07Z`; do not stack another change on this route or infer SEO success before the target-page exposure gate.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-01-obsidian-knowledge-base-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-01-obsidian-knowledge-base-locales
- Status: active
- Data window: 2026-08-01..2026-08-07
- Asset class: net-new-search
- Launched: 2026-08-01
- Hypothesis: Refreshing the existing zh-TW Obsidian + Claude Code page and publishing its independently corroborated zh-CN counterpart around direct files, editor context, MCP, and a maintained AI knowledge-base lifecycle will create qualified Mandarin search exposure without changing the English canonical or adding another topic URL.
- Candidate evidence: Authenticated GSC for `2026-07-03..2026-07-30` gives the unchanged English canonical 0 clicks, 8 impressions, and page-average position 5.6; the zh-TW target has no privacy-visible page row and is not reported as zero. Vercel separately reports 2 zh-TW target visitors and 3 pageviews. Taiwan Trends recorded `obsidian claude code` at `+3,350%`, `obsidian and claude` at `+2,400%`, and `obsidian claude` at `+1,500%` in their preserved request. OpenSEO separately displayed United States `obsidian claude code` at 210. Bilibili, V2EX, and Juejin independently repeat Simplified-Chinese Obsidian, Claude Code, LLM Wiki, and AI-knowledge-base workflows in their native platform units. Wenlan source proves read-only Obsidian Source ingestion, Markdown resync and projection, MCP, distillation, lint, and review. The existing zh-TW framing is partial coverage; the zh-CN route is a clean 404 gap; and the integration-layer decision has standalone utility.
- Baseline: GSC property totals are 10 clicks and 660 impressions; visible-query totals are 2 clicks and 111 impressions; the query visibility gap is 8 clicks and 549 impressions. The English page has 0 clicks, 8 impressions, and page-average position 5.6 with no visible joined Obsidian query. The zh-TW page has no privacy-visible GSC row; Vercel reports 2 visitors and 3 pageviews. The zh-CN route is unpublished and has no page baseline. Vercel property totals are 1,468 visitors and 1,745 pageviews; GitHub public REST reports 46 stars; authenticated Umami custom events remain unavailable rather than zero.
- Change: Preserve the English page. Refresh the existing zh-TW page with its original `datePublished: 2026-07-22` and `dateModified: 2026-08-01`; add the matching zh-CN route with `datePublished` and `dateModified` set to `2026-08-01`. Both Mandarin routes answer the six-section integration and verification job, cite maintained sources, emit Article and BreadcrumbList schema, use reciprocal locale alternates, appear in the sitemap, and keep visible FAQ without `FAQPage`.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 5 GSC page impressions per Mandarin route in a complete post-deploy window; locale thresholds are evaluated separately and never combined
- Success criteria: After its own minimum exposure, a locale route earns at least 1 GSC click or has page-average position 20.0 or better, while the deployed technical and locale floor remains green.
- Failure criteria: After 28 complete post-index days and its own minimum exposure, a locale route has 0 clicks and page-average position worse than 20.0, or the publication creates a technical, source-accuracy, or rendered-layout regression.
- Stop criteria: Stop for a canonical, reciprocal hreflang, sitemap, indexability, Article or BreadcrumbList schema, publication-date, maintained-source, visible-FAQ, locale-routing, CJK-rendering, direct-200, or standalone-utility regression.
- 24h readout: pending
- 7d readout: pending
- W2 readout: pending
- W4 readout: pending
- W8 readout: pending
- Result: pending
- Decision: wait
- Next step: Complete the local content, locale, sitemap, technical, build, and rendered desktop/mobile verification. Stop before push, PR, merge, deployment, request indexing, GSC validation, external publication, paid acquisition, synthetic analytics events, or account mutation without explicit user approval.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-01T19:52:07Z — Obsidian knowledge-base locales locally verified

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-01-obsidian-knowledge-base-locales`
- Status: active; locally verified; not published
- Change evidence: The existing zh-TW route now answers direct Markdown, editor-context, Obsidian MCP, source-backed knowledge lifecycle, minimal workflow, and end-to-end verification intent while preserving `datePublished: 2026-07-22` and setting `dateModified: 2026-08-01`. The missing zh-CN counterpart uses the same six-section contract with both dates set to `2026-08-01`. English remains unchanged.
- Verification: Goal passed; SEO passed 215 of 215; i18n passed 59 of 59; TypeScript and build passed with 215 generated pages; the built technical audit passed 114 sitemap URLs and 18 required pages; the local route matrix passed 23 direct-200 and four expected 404 routes; `git diff --check` passed.
- Render evidence: Fresh `393x852` and `1440x1100` top-fold and complete-page captures for both Mandarin routes had no horizontal overflow, clipping, tofu, orphaned CJK heading, code or table overflow, or missing section. Exact locale canonicals, `index, follow`, Article and BreadcrumbList schema, and `FAQPage` absence were observed in the rendered DOM.
- Decision: wait for explicit publication approval. Do not commit, push, create or merge a PR, deploy, request indexing, submit GSC validation, publish externally, generate synthetic events, or mutate accounts from this observation.
- Next step: If the user approves this exact publication scope, publish the bounded branch and verify production before recording the 24-hour measurement boundary.

### 2026-08-01T20:30:38Z — Obsidian locale candidate final premerge correction

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-01-obsidian-knowledge-base-locales`
- Status: active; locally verified; not published
- Review corrections: Fresh review separated Wenlan Source ingestion/resync, MCP tools, and plugin `/handoff` responsibilities; clarified that original Markdown remains in the read-only vault while Wenlan indexes projected content; added exact Article-date guards for both locales in contract, built, and deployed checks; and protected core CJK acquisition phrases from mobile line splitting without changing metadata or schema text.
- Verification: Goal passed; SEO passed 217 of 217; i18n passed 60 of 60; TypeScript passed; build generated 215 pages; built technical checks passed 114 sitemap URLs, 18 required pages, redirects, robots, noindex headers, exact Article dates, and sitemap-wide `FAQPage` absence; the local route matrix passed 23 direct-200 and four expected 404 routes; `git diff --check` passed.
- Render evidence: Fresh post-correction `393x852` and `1280x720` captures for both locale routes showed no horizontal overflow or clipped content. Character-level line inspection kept `來源` / `来源` and `AI 知識庫` / `AI 知识库` intact. The design-system/functional and CJK-precision passes both returned PASS.
- Decision: wait for explicit publication approval. No commit, push, PR, merge, deployment, indexing request, GSC validation, external publication, synthetic event, or account mutation was performed.
- Next step: On explicit approval of this exact bounded publication, commit, push, create and merge the PR, verify Vercel production, then record the production timestamp that starts the 24-hour boundary.

### 2026-08-01T20:36:41Z — Obsidian Source wording correction

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-01-obsidian-knowledge-base-locales`
- Status: active; locally verified; not published
- Correction: The preceding observation's phrase "indexes projected content" was imprecise. The read-only Obsidian Source keeps the original Markdown in the vault while Wenlan rescans, chunks, and indexes the vault's current content. Markdown projection is a separate Pages export boundary. This correction changes no site code, metric, experiment rule, or publication status.
- Decision: wait for explicit publication approval under the unchanged boundary.

### 2026-08-01T20:43:01Z — Obsidian locale publication approved

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-01-obsidian-knowledge-base-locales`
- Status: approved for bounded GitHub publication and production verification
- Approval: The user explicitly approved commit, Git push, PR creation,
  merge, automatic Vercel deployment, and read-only production verification
  of the exact locally verified zh-TW refresh plus zh-CN counterpart. English
  remains unchanged.
- Excluded actions: Request indexing, GSC validation, external publication,
  paid acquisition, synthetic analytics events, and account mutation remain
  unapproved.
- Next step: Publish the reviewed branch, wait for required checks and Vercel
  production, verify the exact live locale and technical contract, and record
  the production completion timestamp as the 24-hour boundary.

### 2026-08-01T21:03:54Z — Obsidian locale production visual correction

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-01-obsidian-knowledge-base-locales`
- Status: published; bounded CJK rendering correction locally verified
- Publication: PR #110 merged at `2026-08-01T20:45:39Z` as
  `317bc9152fd8f22bded644c64934ebac7d2bc372`; Vercel completed production at
  `2026-08-01T20:46:25Z`.
- Production evidence: The deployed technical audit passed 114 sitemap URLs,
  18 key pages, utility headers, redirects, bridge-host redirects, and
  sitemap-wide `FAQPage` absence. The live locale matrix passed 23 expected
  direct-200 routes and four expected 404 routes.
- Visual finding: Fresh full-page `393x852` and `1280x720` captures proved no
  document overflow, but found two semantic phrase breaks in the Mandarin
  article packet/CTA and a flex-distribution side effect after protecting an
  FAQ phrase. This is a presentation regression, not an SEO result.
- Correction: Shorten the packet/CTA copy without changing intent; protect
  `AI 知識庫`, `AI 知识库`, `來源`, and `来源` only on the Obsidian canonical
  family; keep the FAQ question inside one flex child. English, URLs,
  metadata, schema dates, sitemap, hreflang, and experiment thresholds remain
  unchanged.
- Verification: Goal passed; SEO passed 217 of 217; i18n passed 60 of 60;
  TypeScript and the 215-page build passed. Fresh complete-page evidence for
  both locales and both viewports has zero document overflow and zero split
  protected phrases; both inline visual passes returned PASS.
- Decision: Publish this bounded correction under the user's existing exact-
  scope approval, then use the corrected Vercel production completion time as
  the experiment's 24-hour boundary.

### 2026-08-01T21:12:41Z — Obsidian locale correction production verification

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-01-obsidian-knowledge-base-locales`
- Status: live; measuring
- Publication: PR #111 merged at `2026-08-01T21:09:03Z` as
  `4c67e4c54b90c6f05fda29f0390cc380157c9849`; Vercel production completed at
  `2026-08-01T21:09:50Z`.
- Technical evidence: The deployed audit passed 114 sitemap URLs, 18 key
  pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25
  redirects, six bridge-host redirects, and old-URL exclusion. The live locale
  matrix passed 23 expected direct-200 routes and four expected 404 routes.
- Render evidence: Fresh complete-page captures for zh-TW and zh-CN at
  `393x852` and `1280x1000` report document `scrollWidth == clientWidth` and
  zero protected-phrase splits. Direct screenshot inspection found no
  actionable clipping or FAQ fragmentation; reported off-canvas elements are
  the intentional decorative halo and screen-reader-only skip link.
- Metric interpretation: This is production and presentation verification,
  not evidence of indexing, traffic lift, click lift, rank change, or
  causality. No GSC, Vercel Analytics, Umami, or GitHub metric was synthesized
  for this observation.
- Next readout: The actual 24-hour boundary is after
  `2026-08-02T21:09:50Z`; use only reliable post-deploy observations in their
  native units and mark insufficient exposure inconclusive.

### 2026-08-01T21:22:46Z — post-publication Goal and OSS exposure reconciliation

- Record type: campaign-observation
- Related experiment: none; controller-state and approved-distribution read
- Status: website production slot open; wait for new authenticated evidence
- Goal guard: The controller reread the complete current `PLAN.md`; `pnpm
  seo:goal:check` passed before this action.
- Search evidence: The latest authenticated Friday range remains
  `2026-07-03..2026-07-30`: GSC property totals are 10 clicks and 660
  impressions, visible-query totals are 2 clicks and 111 impressions, and the
  visibility gap is 8 clicks and 549 impressions. It predates the completed
  August 1 website changes and cannot support another rewrite yet.
- GitHub evidence: GitHub REST reports 47 total stars, in the source's native
  cumulative unit. This restores the fixed campaign baseline but remains 53
  stars below the target; no directory-to-star attribution is inferred.
- OSS evidence: Of the 14 previously approved external PRs, one is merged and
  13 remain open. `gavischneider/awesome-llm-wiki` PR #4 merged at
  `2026-08-01T18:55:52Z`; the repository's current default-branch README lists
  Wenlan directly at line 234 with `https://github.com/7xuanlu/wenlan`. The
  listing has zero complete live days at this observation boundary. The
  other public PR states are nine `clean`, two `blocked`, and two `unstable`;
  these are GitHub mergeability states, not accepted-listing or traffic units.
- Decision: The Obsidian locale correction is production-verified and no
  longer consumes the website slot. Do not start a new article or another
  same-page edit from pre-deploy GSC evidence. Reconcile the next authenticated
  query-page window across English, zh-TW, and zh-CN acquisition families,
  while the already-approved OSS PRs continue maintainer review.
- Approval boundary: No push, PR, merge, deployment, new external submission,
  indexing request, GSC validation, paid acquisition, synthetic event, or
  account mutation is authorized by this read-only observation.

### 2026-08-01T21:25:26Z — non-clean OSS PR blocker audit

- Record type: campaign-observation
- Related experiment: none; approved-distribution maintenance audit
- Status: no author-side correction nominated
- `ComposioHQ/awesome-claude-skills` PR #852 is mergeable and blocked only by
  required maintainer review. Its validation and both Socket Security checks
  are successful; it has no review or comment requesting a change.
- `TensorBlock/awesome-mcp-servers` PR #1500 is mergeable and blocked only by
  required maintainer review. It has no status check, review, or comment
  requesting a change.
- `DhanushNehru/awesome-mcp-servers` PR #52 is mergeable. Hypersweep succeeds;
  the repository-wide Lychee check fails. Prior direct evidence established
  that the Wenlan URL returns `200` and the failures are unrelated upstream
  links, so repairing that repository-wide debt remains outside the one-line
  listing update.
- `TeleAI-UAGI/Awesome-Agent-Memory` PR #72 is mergeable, with no check run,
  commit status, review, or comment requesting a change. GitHub reports the
  empty aggregate status as `pending`; there is no inspectable author-side
  failure to repair.
- Decision: Do not push no-op commits, broaden patches, or prompt maintainers.
  Continue passive review-state observation and record a new action only when
  a maintainer requests a scoped correction or a current entry becomes live.

### 2026-08-01T21:33:26Z — self-updating codebase-wiki candidate gate

- Record type: campaign-observation
- Related experiment: none; no experiment started
- Status: candidate rejected for this window
- Demand evidence: Multiple independent English Reddit discussions repeat
  self-updating codebase-wiki and documentation-drift problems. Six maintained
  adjacent GitHub repositories were read in native cumulative units: 40, 354,
  11, 758, 305, and 1,264 stars respectively, with provenance recorded in the
  coverage audit. A Simplified-Chinese Bilibili workflow corroborates Claude
  Code, Obsidian, LLM Wiki, and AI-knowledge-base interest, but not a distinct
  codebase-sync query; no matching Traditional-Chinese exact observation was
  retained. None of these observations is GSC evidence or keyword volume.
- Coverage evidence: The existing English, zh-TW, and zh-CN LLM Wiki and
  source-backed knowledge-base canonicals already explain Sources, maintained
  Pages, stale reasons, refresh, review, and the boundary that current code,
  tests, repository search, and native documentation remain authoritative.
- Product-proof boundary: First-party Directory Source ingestion scans only
  `.md`, `.txt`, and `.pdf`. Although a generic chunker recognizes code
  extensions, it is not wired into Directory Source ingestion. Wenlan can
  prove maintained source-backed engineering documentation from supported
  documents and work evidence, but not automatic arbitrary codebase indexing.
- Candidate-gate result: provenance passes; repeated English problem passes;
  standalone utility passes; clean coverage gap fails; maintained proof for a
  code-sync promise fails. Mandarin exact-intent evidence is also insufficient
  for a separate localized page.
- Decision: Do not create or translate a new article. Monitor the qualified
  phrases and prefer a bounded clarification on the existing LLM Wiki
  canonical only if a future authenticated query-page join supports it.
- Evidence: `docs/seo-audits/2026-08-01-self-updating-codebase-wiki-coverage-gate.md`.
- Approval boundary: No website edit, push, PR, merge, deployment, indexing
  request, GSC validation, external publication, synthetic event, or account
  mutation was performed or authorized by this observation.

### 2026-08-01T21:47:09Z — core acquisition crawl-freshness inspection

- Record type: campaign-observation
- Related experiment: `EXP-2026-07-27-llm-wiki-implementation-guide-refresh`,
  `EXP-2026-07-29-zhcn-llm-wiki-knowledge-base-refresh`,
  `EXP-2026-07-29-obsidian-claude-code-refresh`, and
  `EXP-2026-08-01-obsidian-knowledge-base-locales`
- Status: authenticated read-only GSC observation; no experiment started
- Authority: Google Search Console URL Inspection API for
  `sc-domain:wenlan.app`, captured at `2026-08-01T21:47:09Z`.
- Indexed technical evidence: All six LLM Wiki and source-backed
  knowledge-base URLs returned exact Google-selected self-canonicals,
  indexing allowed, successful fetches, and `Submitted and indexed`.
- Freshness evidence: English LLM Wiki has a post-implementation-refresh
  crawl. Both Mandarin source-backed knowledge-base pages have post-content-
  deploy crawls. The zh-TW and zh-CN LLM Wiki, English and zh-TW Obsidian,
  and English source-backed pages have crawl times that predate their latest
  content changes.
- New-locale evidence: The live zh-CN Obsidian page is `URL is unknown to
  Google`, with no crawl, canonical, sitemap, referring URL, or fetch fields
  returned by GSC. Missing fields are not reported as zero.
- Decision: Do not rewrite an existing page or create another overlapping
  article. Nominate one fixed, separately approval-gated request-indexing
  batch for the new zh-CN Obsidian URL plus the stale zh-TW and English
  Obsidian URLs and stale zh-CN LLM Wiki URL. Do not repeat previously
  completed requests for English source-backed or zh-TW LLM Wiki.
- Evidence: `docs/seo-audits/2026-08-01-core-acquisition-url-inspection.md`.
- Approval boundary: No request indexing, GSC validation, website edit, push,
  PR, merge, deployment, external publication, paid acquisition, synthetic
  event, or account mutation was performed.

### 2026-08-01T22:00:20Z — approved four-URL indexing-request batch

- Record type: campaign-observation
- Related experiment: `EXP-2026-07-27-llm-wiki-implementation-guide-refresh`,
  `EXP-2026-07-29-zhcn-llm-wiki-knowledge-base-refresh`,
  `EXP-2026-07-29-obsidian-claude-code-refresh`, and
  `EXP-2026-08-01-obsidian-knowledge-base-locales`
- Status: request-indexing batch completed; wait for a later crawl observation
- Approval: The user explicitly approved the fixed four-URL GSC Request
  Indexing batch. The approval did not include validation or another URL.
- Results: Signed-in Search Console returned `Indexing requested` for
  `/zh-CN/learn/wenlan-vs-obsidian-ai-memory`,
  `/zh-TW/learn/wenlan-vs-obsidian-ai-memory`,
  `/learn/wenlan-vs-obsidian-ai-memory`, and
  `/zh-CN/learn/distilled-wiki-pages-ai-memory` by
  `2026-08-01T22:00:20Z`.
- Pre-request state: The new zh-CN Obsidian URL was not on Google and unknown
  to Google. The other three URLs were on Google and indexed, but their latest
  GSC crawl timestamps predated the meaningful content changes recorded in the
  experiment ledger.
- Interpretation: Each result confirms priority-crawl queue acceptance only.
  It is not evidence of a new crawl, indexing success for the new locale,
  ranking or impression lift, clicks, traffic, or causality. Do not resubmit
  any URL in this batch.
- Next step: At the experiment's actual 24-hour boundary or a later
  authenticated window, re-read URL Inspection crawl state without requesting
  again; keep each locale and metric in its native unit.
- Evidence: `docs/seo-audits/2026-08-01-core-acquisition-url-inspection.md`.
- Excluded actions: No GSC validation, website edit, push, PR, merge,
  deployment, external publication, paid acquisition, synthetic event, or
  unrelated account mutation was performed.

### 2026-08-01 — document knowledge-base article candidate locally prepared

- Record type: candidate-preparation observation
- Related experiment: none; no experiment or measurement clock started
- Status: full candidate gate passed; English, zh-TW, and zh-CN local implementation in progress
- Demand evidence: OpenSEO's previously captured US `AI knowledge base` result exposed builder, examples, open-source, tools, GitHub, and free modifiers; the Taiwan `AI 知識庫` result corroborated the locale family. Current English and Chinese SERP/community observations independently repeat document-ingestion, Markdown, local-control, and implementation intent. OpenSEO displayed volumes remain third-party units, not GSC data or forecasts.
- Coverage evidence: Existing LLM Wiki and source-backed knowledge-base pages explain architecture and maintenance, but do not provide one focused document-to-page recipe with supported source types, idempotent resync, scanned-PDF limits, the Obsidian read-only boundary, and an end-to-end verification loop.
- Product proof: Current Wenlan README, CLI implementation, and tests support `wenlan sources add <path>`, `.md`, `.txt`, text-extractable `.pdf`, recursive folders, read-only Obsidian sources, resync, maintained Pages, lint, and review. The candidate explicitly excludes arbitrary code ingestion and direct support for image-only PDFs.
- Tool boundary: The signed-in OpenSEO account has exhausted credits and has no GSC connection. Authenticated Vercel API queries proved referrer-filtered page aggregates and page-filtered referrer aggregates on the current plan; CTA events returned HTTP 402 and remain account-gated.
- Candidate family: `/learn/build-local-ai-knowledge-base-from-documents` in English, zh-TW, and zh-CN.
- Decision: prepare and verify locally. Do not label this an active experiment until Vercel production completes after a separately approved publication.
- Evidence: `docs/seo-audits/2026-08-01-tool-boundaries-and-document-knowledge-base-gate.md`.
- Approval boundary: No push, PR, merge, deployment, request indexing, GSC validation, paid OpenSEO action, rank-tracking setup, or external publication is authorized by this observation.

### 2026-08-01 — document knowledge-base candidate local verification closed

- Record type: candidate-preparation observation
- Related experiment: none; no experiment or measurement clock started
- Status: locally ready for publication review
- Deterministic verification: 217 SEO tests passed; 62 i18n contract tests passed; TypeScript passed; the production build generated 219 static pages; the built technical checker passed 117 sitemap URLs, 21 required canonicals, 21 checked pages, and the site-wide `FAQPage` absence check; the built-server locale matrix passed 25 intended 200 routes and four expected 404 routes; `pnpm seo:goal:check` and `git diff --check` passed.
- Rendered verification: English, zh-TW, and zh-CN article routes were inspected at 393px and 1280px widths. Exact canonicals, indexability, Article and BreadcrumbList schema, visible FAQ without `FAQPage`, CJK phrase wrapping, code containment, and the acquisition CTA passed without a blocking issue.
- Interpretation: This closes local implementation risk only. It is not production completion, an active experiment, indexing evidence, GSC lift, Vercel visitor lift, or causality.
- Approval boundary: No commit, push, PR, merge, deployment, indexing request, GSC validation, paid OpenSEO action, rank-tracking setup, or external publication was performed.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-18-claude-code-memory-refresh at 2026-08-02T00:36:22Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-18-claude-code-memory-refresh
- Observed at: 2026-08-02T00:36:22Z
- Readout: W2
- Status: measuring
- Evidence: Completed Friday report
  `docs/seo-audits/2026-07-31-gsc-click-priority.md`, authenticated exports
  under `/tmp/wenlan-seo`, read-only Search Console URL Inspection, clean
  `origin/main` deployed technical audit, and fresh production DOM/render
  inspection.
- Evidence window: Reused the completed Friday authenticated
  `2026-07-03..2026-07-30` GSC and Vercel range; no Search Analytics or
  Vercel source pipeline was rerun. The range contains 11 complete dates
  after Vercel production completed at `2026-07-19T00:26:09Z`, not a
  complete 14-day post-deploy cohort.
- GSC property totals: 10 clicks and 660 impressions. Visible-query totals:
  2 clicks and 111 impressions. Query visibility gap: 8 clicks and 549
  impressions. These remain separate native GSC aggregates.
- Target-page guard: `/learn/claude-code-memory` has 0 clicks, 24 impressions,
  and page-average position 38.8. Its five predeclared visible qualified
  query-to-page rows have 0 clicks, 9 impressions, and 50.0
  impression-weighted average position; the remaining 15 target-page
  impressions are not attributed to that visible qualified cluster.
- Crawl and exposure guard: A read-only URL Inspection observation returned
  `Submitted and indexed`, `INDEXING_ALLOWED`, `SUCCESSFUL`, and exact matching
  user and Google canonicals, but its last crawl is
  `2026-07-04T09:03:21Z`, before the 2026-07-18 refresh. A first confirmed
  post-change crawl or index date therefore remains unavailable. The rolling
  target row is also one impression below the immutable 25-page-impression
  minimum. The minimum-exposure clock and 28-complete-post-index-day failure
  guard cannot be satisfied from this evidence.
- Neutral-band decision: The target has neither two clicks nor the required
  10-position improvement. Its 0 clicks and 38.8 page-average position are
  not classified as failure because minimum exposure, a confirmed
  post-change crawl, and 28 complete post-index days are all missing. The
  immutable success/failure gap is not collapsed into a verdict.
- Vercel: The same complete range reports 1,468 raw visitors and 1,745
  pageviews, including 307 direct visitors and 457 direct pageviews. The
  existing search, AI, and GitHub qualified-source allowlist sums to 1,163
  visitors across separate referrer rows and is not deduplicated. The target
  page reports 9 visitors and 21 pageviews. The authenticated source-to-page
  export does not return this target in its 25 rows, so source-to-target
  visitors are unavailable rather than zero. Unique acquisition-surface
  visitors remain unavailable.
- Umami, CTA, and GitHub: No authenticated Umami observation is available.
  Vercel custom events remain HTTP-402 account-gated, so GitHub outbound and
  CTA are not reported. A separate GitHub REST capture reports 46 total stars;
  no page attribution or causality is inferred.
- Technical and production render: The clean `origin/main` deployed audit
  passed robots, 114 sitemap URLs, 18 key pages, six utility noindex headers,
  sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host redirects,
  and legacy-URL exclusions. The target returns 200, is present in the
  sitemap, and renders its exact self-canonical, `index, follow`, Article and
  BreadcrumbList schema, stable `datePublished: "2026-06-07"` and
  `dateModified: "2026-07-18"`, visible native-memory-first answer, current
  Claude Code memory and MCP references, and no `FAQPage`. A fresh 1280px
  production render had no document overflow or console warnings/errors.
  Unsupported zh-TW and zh-CN counterparts remain the expected 404s.
- Result: inconclusive
- Decision: wait
- Rationale: Preserve the page and do not stack another memory-content edit.
  This measuring cohort does not nominate the next acquisition asset.
- Unperformed gated actions: no repeat indexing request, GSC validation,
  website edit, commit, push, PR, merge, deployment, external publication,
  paid acquisition, synthetic event, or metric-definition change.
- Next step: Keep the original W4 evaluation and exposure guards. The next
  campaign heartbeat should run the due 24-hour readout for
  `EXP-2026-08-01-obsidian-knowledge-base-locales` after
  `2026-08-02T21:09:50Z`, reusing the next available authenticated evidence
  and not repeating its completed indexing requests.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-01-obsidian-knowledge-base-locales production verification at 2026-08-01T21:09:50Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-01-obsidian-knowledge-base-locales
- Observed at: 2026-08-01T21:09:50Z
- Readout: correction
- Status: measuring
- Evidence: Corrective PR #111 merged as
  `4c67e4c54b90c6f05fda29f0390cc380157c9849`, Vercel production completed at
  `2026-08-01T21:09:50Z`, and the deployed technical, locale, canonical,
  schema, source, FAQ, CJK wrapping, and desktop/mobile render gates passed.
- Result: pending
- Decision: wait
- Next step: Run the actual 24-hour technical/evidence readout after
  `2026-08-02T21:09:50Z`; keep zh-TW and zh-CN exposure separate and do not
  repeat the completed indexing requests.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-01-document-knowledge-base-guide

- Record type: experiment-start
- Experiment ID: EXP-2026-08-01-document-knowledge-base-guide
- Status: approved
- Data window: 2026-08-01..2026-08-07
- Asset class: net-new-search
- Launched: 2026-08-01
- Hypothesis: A source-backed implementation guide that turns Markdown,
  text-extractable PDFs, and an Obsidian vault into a maintained local AI
  knowledge base will earn qualified search exposure across English, zh-TW,
  and zh-CN without replacing the existing conceptual LLM-wiki and
  source-backed-knowledge-base pages.
- Candidate evidence: OpenSEO's prior US `AI knowledge base` modifier result
  and Taiwan `AI 知識庫` result in their native third-party unit; independently
  repeated English and Chinese SERP/community document-ingestion intent; the
  clean coverage gap; and current Wenlan README, CLI, tests, and source
  behavior. None is GSC evidence or a forecast.
- Baseline: The three target URLs do not exist in the authenticated
  `2026-07-03..2026-07-30` GSC or Vercel exports and are unavailable rather
  than zero. Same-range GSC property totals are 10 clicks and 660 impressions;
  visible-query totals are 2 clicks and 111 impressions; the visibility gap
  is 8 clicks and 549 impressions. Vercel reports 1,468 visitors and 1,745
  pageviews. GitHub REST separately reports 46 stars. Umami is unavailable
  and Vercel custom events are HTTP-402 account-gated.
- Change: Publish
  `/learn/build-local-ai-knowledge-base-from-documents`,
  `/zh-TW/learn/build-local-ai-knowledge-base-from-documents`, and
  `/zh-CN/learn/build-local-ai-knowledge-base-from-documents`; add one English
  Learn search-path link; preserve contextual links to the existing LLM-wiki
  and source-backed knowledge-base canonicals; and add deterministic Vercel
  acquisition source-to-page reporting without inferring causality.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 5 GSC target-page impressions per locale within the first
  28 complete days after that exact
  locale URL is first confirmed crawled or indexed; locale impressions are
  never pooled.
- Success criteria: After its own minimum exposure, a locale earns at least 1
  GSC target-page click or reaches page-average position 20.0 or better while
  the technical, source-accuracy, and locale floors remain green.
- Failure criteria: After 28 complete post-index days and its own minimum
  exposure, a locale has 0 clicks and page-average position worse than 20.0,
  or the publication creates a technical, source-accuracy, or rendered-layout
  regression.
- Inconclusive criteria: A locale below 5 target-page impressions, without a
  confirmed post-change crawl/index date, or without 28 complete post-index
  days remains inconclusive; missing rows remain unavailable rather than zero.
- Stop criteria: Hold or repair the experiment if a supported-source claim
  becomes false, the new page overlaps an existing canonical's intent, any
  canonical, robots, sitemap, hreflang, noindex, redirect, schema, or
  direct-200 contract regresses, or a second controller edits the same
  canonical family.
- 24h readout: verify publication integrity, live three-locale routes,
  canonicals, hreflang, sitemap, Article and BreadcrumbList schema, visible
  answer, sources, FAQ policy, and production renders without judging SEO
  success.
- 7d readout: report authenticated property, visible-query, visibility-gap,
  per-locale page, joined visible-query, Vercel, Umami, and GitHub evidence in
  native units when available; otherwise keep the result inconclusive.
- W2 readout: apply each locale's independent 5-impression exposure guard and
  inspect overlap with the existing LLM-wiki and source-backed knowledge-base
  canonicals.
- W4 readout: apply the 28-complete-post-index-day success, failure, or
  inconclusive contract separately per locale.
- W8 readout: post-campaign follow-up; scale, refresh, merge, stop, or mark
  inconclusive without moving the fixed Goal window.
- Result: pending
- Decision: wait
- Evidence: `docs/seo-audits/2026-08-01-tool-boundaries-and-document-knowledge-base-gate.md`.
- Approval: At `2026-08-02T00:36:22Z`, the user explicitly approved commit,
  push, PR creation, merge, automatic Vercel deployment, and read-only
  production verification for this exact scope.
- Excluded actions: request indexing, GSC validation, paid OpenSEO actions,
  rank-tracking setup, external publication, paid acquisition, synthetic
  events, and metric-definition changes.
- Next step: Complete the merge and production gate, record the exact Vercel
  production completion time, then schedule the 24-hour readout from that
  boundary.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-01-document-knowledge-base-guide production verification at 2026-08-02T02:43:57Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-01-document-knowledge-base-guide
- Observed at: 2026-08-02T02:43:57Z
- Readout: correction
- Status: measuring
- Publish date: 2026-08-01
- Index date: not-indexed
- Evidence: PR #114 merged at `2026-08-02T02:41:40Z` as
  `8577a2730946a110ac6d6d26d15e27c4e250505c`; the attached Vercel production
  deployment changed to `Deployment has completed` at
  `2026-08-02T02:42:26Z`.
- Technical verification: The live audit passed robots, 117 sitemap URLs, 21
  key pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25
  redirects, six bridge-host redirects, 18 direct changed redirects, and
  legacy-URL exclusions. The production locale matrix passed 25 intended
  direct-200 routes and four expected 404 routes.
- Locale and render verification: English, zh-TW, and zh-CN target routes
  return their exact titles and visible document workflow. Fresh production
  captures at `393px` and `1280px` have no horizontal overflow; every mobile
  capture has `scrollWidth=clientWidth=393`. The CLI block contains
  `wenlan status` and `wenlan sources add ~/Knowledge/project-docs`; setup copy
  separates platform installation, plugin slash commands, and MCP-only client
  tools. CJK headings and protected phrases have no blocking split.
- Schema and source verification: The exact self-canonicals, reciprocal
  hreflang, Article and BreadcrumbList schema, `datePublished: "2026-08-01"`,
  `dateModified: "2026-08-01"`, maintained official references, visible FAQ,
  and absence of `FAQPage` remain green.
- Measurement boundary: This readout verifies production integrity only. It
  does not establish a new crawl, index date, GSC impression or click, Vercel
  visitor lift, CTA result, star attribution, or causality. The three locales
  retain independent five-impression minimum-exposure guards; missing rows
  remain unavailable rather than zero.
- Unperformed gated actions: No request indexing, GSC validation, paid
  OpenSEO action, rank-tracking setup, external publication, paid acquisition,
  synthetic event, or metric-definition change was performed.
- Result: pending
- Decision: wait
- Next step: Run the actual 24-hour technical/evidence readout after
  `2026-08-03T02:42:26Z`. Keep the earlier Obsidian-locale heartbeat due after
  `2026-08-02T21:09:50Z`, then reuse that same task for this later boundary;
  do not create another automation.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-02T03:52:06Z — Karpathy / LLM Wiki three-language demand gate

- Record type: campaign-observation
- Related experiment: none; candidate evidence only
- Status: candidate-nominated
- Evidence: Signed-in Google Trends Explore retained exact United States,
  Taiwan, and Worldwide Simplified-Chinese phrase requests for the past 12
  months. The request-relative averages were respectively `25 / 46 / 7 / 0 /
  1`, `20 / 0 / 4 / 0 / 0`, and `28 / 6 / 7 / 0 / 0`; every source retains
  its own terms and geography in the linked audit. Related-query panels repeat
  Karpathy, LLM Wiki, Obsidian, and GitHub wording. Prior OpenSEO native-unit
  results, English Reddit and maintained OSS, and public Simplified-Chinese
  community sources independently corroborate the same family.
- Coverage: The document-ingestion and LLM Wiki canonical families already
  answer builder, source, RAG, Obsidian, setup, maintenance, and failure-mode
  jobs in English, zh-TW, and zh-CN. A new URL would overlap them. The bounded
  gap is discoverability: Karpathy appears only in reference labels, not in
  the three LLM Wiki titles, first answers, section headings, or internal-link
  anchors.
- Tool boundary: The authenticated OpenSEO workspace has used all trial
  credits and is not connected to GSC. No new paid or credit-consuming query,
  GSC connection, rank tracker, or account mutation was performed.
- Decision: nominate a later three-language refresh of the existing LLM Wiki
  canonicals; do not start it before the zh-TW route's actual 24-hour readout
  after `2026-08-02T04:05:07Z`.
- Evidence record:
  `docs/seo-audits/2026-08-01-karpathy-llm-wiki-three-language-demand.md`.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-01-zhtw-llm-wiki-v2-refresh 24h superseded at 2026-08-02T04:14:53Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-01-zhtw-llm-wiki-v2-refresh
- Observed at: 2026-08-02T04:14:53Z
- Readout: 24h
- Status: inconclusive
- Evidence: The latest authenticated GSC export remains
  `2026-07-03..2026-07-30`, before the production completion at
  `2026-08-01T04:05:07Z`. It has no privacy-visible target-page row, which is
  unavailable rather than zero, and cannot satisfy the five-impression
  minimum-exposure guard. The same-range Vercel export is also pre-deploy and
  cannot measure a target-page visitor change. No authenticated Umami event or
  fresh GitHub-star observation was used for this readout.
- Technical evidence: The live zh-TW route returns direct `200`, exact
  self-canonical, `index, follow`, reciprocal English, zh-TW, zh-CN, and
  x-default alternates, Article and BreadcrumbList schema, stable
  `datePublished: 2026-07-04`, `dateModified: 2026-08-01`, seven visible
  sections, the six-command workflow, maintained references, and visible FAQ
  without `FAQPage`. The deployed sitemap contains all three localized
  canonicals and reciprocal hreflang links.
- Result: inconclusive
- Decision: stop
- Next step: Preserve the historical cohort, but do not attribute later
  observations to this copy version. Start the separately gated
  three-language Karpathy / LLM Wiki / AI knowledge-base refresh with its own
  per-locale exposure guards.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-01-karpathy-llm-wiki-locales-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-08-01-karpathy-llm-wiki-locales-refresh
- Status: approved
- Data window: 2026-08-01..2026-08-07
- Asset class: refresh
- Launched: 2026-08-01
- Hypothesis: Exposing the independently corroborated `Karpathy LLM Wiki`
  phrase while keeping `LLM wiki` and `AI knowledge base` co-primary on the
  existing English, zh-TW, and zh-CN canonical family will earn qualified
  page impressions and at least one click per exposed locale without creating
  a duplicate URL.
- Candidate evidence: The complete gate in
  `docs/seo-audits/2026-08-01-karpathy-llm-wiki-three-language-demand.md`
  preserves exact Trends queries, geography, period, capture time, and native
  `0-100` units; prior OpenSEO native units; Reddit observations; maintained
  OSS; and public Simplified-Chinese community corroboration. These sources
  repeat Karpathy, LLM Wiki, Obsidian, and GitHub wording. Existing Wenlan
  coverage answers the job, but Karpathy appears only in reference labels.
- Baseline: Authenticated GSC for `2026-07-03..2026-07-30` reports property
  totals of 10 clicks and 660 impressions, visible-query totals of 2 clicks
  and 111 impressions, and a visibility gap of 8 clicks and 549 impressions.
  The target family has no complete post-August-1 authenticated page window;
  missing locale rows remain unavailable rather than zero. Same-range Vercel
  reports 1,468 visitors and 1,745 pageviews at property level; no
  source-to-page session or causality is inferred.
- Change: Refresh only the existing English, zh-TW, and zh-CN
  `/learn/distilled-wiki-pages-ai-memory` canonical family. Expose `Karpathy
  LLM Wiki` in each locale's title or metadata, first answer, one
  maintained-source-backed section heading, and same-locale Learn link text;
  keep AI knowledge base, RAG, Obsidian, source maintenance, and failure-mode
  utility visible. State that Andrej Karpathy described the pattern and did
  not endorse Wenlan. Preserve URLs, locale availability, reciprocal
  hreflang, sitemap membership, original publication dates, Article and
  BreadcrumbList schema, and visible FAQ without `FAQPage`.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 5 target-page GSC impressions per locale in a complete
  post-deploy window; locale thresholds are evaluated separately and never
  combined
- Success criteria: At W2, after its own minimum exposure, a locale target has
  at least 1 GSC click or page-average position 20.0 or better while the
  technical, locale, source-accuracy, and rendered-layout floor remains green.
- Failure criteria: After 28 complete post-index days and its own minimum
  exposure, a locale target has 0 clicks and page-average position worse than
  20.0, or the publication creates an evidence, intent-overlap, or technical
  regression.
- Stop criteria: Stop for canonical, hreflang, sitemap, indexability, Article
  or BreadcrumbList schema, publication-date, maintained-source,
  endorsement-clarity, visible-FAQ, locale-routing, CJK-rendering, direct-200,
  or standalone-utility regression.
- 24h readout: pending
- 7d readout: pending
- W2 readout: pending
- W4 readout: pending
- W8 readout: pending
- Result: pending
- Decision: refresh
- Next step: Implement the bounded approved refresh, verify it, publish through
  PR and Vercel, then start the measurement clock from production completion.
- Approval: At `2026-08-02T04:14:53Z`, after reviewing the exact three-language
  scope, the user explicitly approved implementation, build, PR, merge,
  automatic Vercel deployment, and read-only production verification.
- Excluded actions: request indexing, GSC validation, paid OpenSEO actions,
  rank-tracking setup, external posts, paid acquisition, synthetic events,
  analytics mutation, and metric-definition changes.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-01-karpathy-llm-wiki-locales-refresh local preparation at 2026-08-02T04:34:55Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-01-karpathy-llm-wiki-locales-refresh
- Observed at: 2026-08-02T04:34:55Z
- Readout: correction
- Status: active
- Evidence: The approved bounded refresh is implemented on the existing
  English, zh-TW, and zh-CN canonical family. It exposes Karpathy LLM Wiki and
  AI knowledge-base intent in titles, metadata, first answers, maintained
  source-backed sections, visible FAQ, and same-locale Learn routing without
  adding a URL. Publication dates remain `2026-06-24` for English and
  `2026-07-04` for both Mandarin locales; all three modification dates are
  `2026-08-01`. The copy distinguishes Karpathy's public pattern from any
  endorsement of Wenlan.
- Verification: `pnpm test:seo` passed `222/222`; `pnpm lint`,
  `pnpm build`, `pnpm seo:technical:built`, `pnpm seo:goal:check`, and
  `git diff --check` passed. The built audit checked 26 redirects, 7 noindex
  headers, 117 sitemap locations, 21 required locations and HTML pages, and
  all 121 built HTML artifacts for absence of `FAQPage`. Fresh English,
  zh-TW, and zh-CN renders at 393px and 1274px had no document overflow,
  clipping, or CJK phrase break. A separate 320px zh-TW check reported
  `clientWidth = scrollWidth = 314`; the long Karpathy phrase is allowed to
  wrap below 361px instead of creating overflow.
- Result: pending
- Decision: merge
- Next step: Complete the approved commit, PR, merge, Vercel deployment, and
  read-only production verification, then replace the pre-publish sentinel
  with the production completion time and begin the measurement clock.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-01-karpathy-llm-wiki-locales-refresh production verification at 2026-08-02T04:43:17Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-01-karpathy-llm-wiki-locales-refresh
- Observed at: 2026-08-02T04:43:17Z
- Readout: correction
- Status: measuring
- Publish date: 2026-08-01
- Index date: not-indexed
- Evidence: PR #116 merged at `2026-08-02T04:39:10Z` as
  `93c943637e8e7dad4db881fd2564b18abca4a208`; its Vercel production status
  changed to `Deployment has completed` at `2026-08-02T04:39:55Z`.
- Technical verification: The deployed audit passed robots, 117 sitemap URLs,
  21 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence,
  25 redirects, six bridge-host redirects, and old-URL exclusion. All three
  target routes return direct `200`, exact self-canonicals, `index, follow`,
  reciprocal `en-US`, `zh-TW`, `zh-CN`, and `x-default` alternates, Article
  and BreadcrumbList schema, and no `FAQPage`; all three canonicals remain in
  the deployed sitemap.
- Content and render verification: Production exposes the intended English,
  Traditional-Chinese, and Simplified-Chinese titles, first answers, Karpathy
  source attribution, and endorsement distinction. English retains
  `datePublished: 2026-06-24`; zh-TW and zh-CN retain
  `datePublished: 2026-07-04`; all three emit `dateModified: 2026-08-01`.
  Fresh production renders at 393px report `scrollWidth = clientWidth = 387`
  for all locales, with the protected Mandarin Karpathy phrase on one line.
  The 320px zh-TW check reports `scrollWidth = clientWidth = 314` and allows
  that long phrase to wrap rather than overflow.
- Measurement boundary: The latest authenticated GSC and Vercel evidence is
  still the pre-deploy `2026-07-03..2026-07-30` range. This production gate
  establishes no new crawl, index date, impression, click, visitor, CTA,
  GitHub-star change, or causality. Each locale retains its independent five
  GSC target-page-impression minimum-exposure guard; missing rows remain
  unavailable rather than zero.
- Unperformed gated actions: No request indexing, GSC validation, paid
  OpenSEO action, rank-tracking setup, external post, paid acquisition,
  synthetic event, analytics mutation, or metric-definition change was
  performed.
- Result: pending
- Decision: wait
- Next step: Run the actual 24-hour technical/evidence readout after
  `2026-08-03T04:39:55Z`, using the latest authenticated weekly evidence when
  available and without starting another overlapping refresh of this family.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-18-claude-code-memory-refresh at 2026-08-02T06:17:58Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-18-claude-code-memory-refresh
- Observed at: 2026-08-02T06:17:58Z
- Readout: W2
- Status: measuring
- Evidence: The latest completed Friday report remains the immutable
  `2026-07-03..2026-07-30` weekly capture at 10 property clicks and 660
  property impressions, 2 visible-query clicks and 111 visible-query
  impressions, and an 8-click/549-impression visibility gap. A focused
  authenticated backfill of the same range, captured on 2026-08-02 without
  rerunning the weekly pipeline, now reports 10 property clicks and 706
  property impressions, 2 visible-query clicks and 120 visible-query
  impressions, and an 8-click/586-impression visibility gap. These captures
  remain separate evidence snapshots rather than a rewritten historical
  report.
- Target and qualified guard: The target page reports 0 clicks, 24
  impressions, and 38.8 average position. It remains below the predeclared
  25-impression minimum. The fixed five-query Claude-memory guard remains
  visible at 0 clicks, 9 impressions, and 50.0 impression-weighted average
  position: `claude code memory` 0/3/51.0, `claude mcp memory` 0/1/46.0,
  `claude memory mcp` 0/3/50.3, `claude memory md` 0/1/55.0, and
  `claudecode memory` 0/1/45.0. It meets the 9-impression visibility floor
  but does not improve clicks, impressions, or position under the immutable
  qualified-exposure guard.
- Crawl and index evidence: Search Console URL Inspection for
  `https://wenlan.app/learn/claude-code-memory`, captured
  `2026-08-02T06:11:32Z`, reports `PASS`, `Submitted and indexed`, robots
  allowed, indexing allowed, successful mobile fetch, and exact matching
  user-selected and Google-selected canonicals. Its last crawl is
  `2026-07-04T09:03:21Z`, before the refresh completed production at
  `2026-07-19T00:26:09Z`. A post-refresh crawl is therefore not confirmed and
  the original post-crawl minimum-exposure clock cannot be anchored.
- Vercel evidence: Reused, without refetching, the latest complete
  `2026-07-03..2026-07-30` Friday range: 1,468 raw visitors/1,745 pageviews,
  307 direct visitors/457 pageviews, and a non-deduplicated 1,163-visitor/
  1,286-pageview qualified-source row aggregate. The target-page row remains
  separate at 9 visitors/21 pageviews. Unique acquisition-surface visitors
  and source-to-page sessions are unavailable. The separate traffic-quality
  audit labels 1,132 raw visitors as an exact suspected automated/referrer-
  incompatible cohort; it does not redefine the protected raw or qualified-
  source metrics.
- Technical and rendered evidence: The live English route returns direct
  HTTP 200 with the exact self-canonical, `index, follow`, Article and
  BreadcrumbList JSON-LD, `datePublished: "2026-06-07"`,
  `dateModified: "2026-07-18"`, the maintained Claude Code memory source,
  visible `/memory` and Wenlan plugin guidance, sitemap membership, and no
  `FAQPage`. Unsupported zh-TW and zh-CN counterparts remain direct 404s with
  `noindex` and remain absent from the sitemap. Fresh 1440x1200 desktop and
  emulated 393x852 mobile renders show the expected responsive article hero;
  the mobile document has 393px client and scroll widths, and the long install
  command is contained by a 337px internal horizontal scroller. No visual,
  locale, canonical, schema, indexability, or document-overflow regression was
  found. Evidence screenshots:
  `/tmp/wenlan-claude-memory-w2-desktop.png` and
  `/tmp/wenlan-claude-memory-w2-mobile-emulated.png`.
- GitHub and CTA: GitHub REST reports 47 total stars. Authenticated Umami
  observations and Vercel custom CTA events remain unavailable/account-gated,
  so GitHub outbound and CTA are not reported.
- Minimum exposure: not reached. The target has 24 page impressions, and URL
  Inspection does not confirm any crawl after the refresh.
- Result: inconclusive
- Decision: wait
- Unperformed gated actions: no indexing request, GSC validation, website
  edit, push, PR, merge, deployment, external publication, OSS submission,
  paid acquisition, synthetic analytics event, or metric-definition change.
- Next step: Preserve the page and run W4 only when due, after a confirmed
  post-refresh crawl can anchor the exposure clock. Do not classify the page
  as success or failure or rewrite it from this evidence. Separately continue
  the current AI-knowledge-base/LLM-wiki/Obsidian acquisition lane; this legacy
  memory measurement does not nominate the next content experiment.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-02T06:26:05Z — approved OSS distribution second merge

- Record type: campaign-observation
- Related experiment: none; approved-distribution maintenance observation
- Status: two merged listings; twelve open PRs
- New acceptance: `TeleAI-UAGI/Awesome-Agent-Memory` PR #72 merged at
  `2026-08-01T22:15:12Z` as
  `62f9864ca13ced26dd645025940d72aaeb5b2f96`. The upstream default-branch
  README now contains the visible Wenlan site link, GitHub star badge, and
  `https://github.com/7xuanlu/wenlan` code link.
- Existing acceptance: `gavischneider/awesome-llm-wiki` PR #4 remains merged
  at `2026-08-01T18:55:52Z` as
  `046112f2b49b4410fe569c2c7065411aed180980`; its default-branch README still
  contains the exact Wenlan repository link and source-backed LLM-wiki
  description.
- Open inventory: twelve approved listing PRs remain open. Nine are
  `CLEAN`; `ComposioHQ/awesome-claude-skills` #852 and
  `TensorBlock/awesome-mcp-servers` #1500 are mergeable and `BLOCKED` only on
  required maintainer review; `DhanushNehru/awesome-mcp-servers` #52 is
  mergeable and `UNSTABLE` only because its whole-repository Lychee check
  still reports unrelated upstream links while Hypersweep succeeds. None has
  a maintainer comment or review requesting an author-side change.
- GitHub evidence: GitHub REST reports 47 total Wenlan stars and 6 forks in
  their native cumulative units. No listing-to-star attribution or causal
  claim is made.
- Decision: wait; do not manufacture no-op commits, broaden the one-line
  listing patches, contact maintainers, resubmit the pending free directory
  form, or mutate Glama/Codex-directory prerequisites.
- External actions: none in this observation; all calls were read-only.
- Next step: Reconcile the same twelve PRs only when a maintainer acts or at
  the predeclared seven-complete-live-day boundary. Keep the earlier
  Obsidian-locale 24-hour website readout as the next scheduled campaign
  action.

### 2026-08-02T06:29:47Z — release-to-download integrity observation

- Record type: campaign-observation
- Related experiment: none; release-integrity guard
- Official release evidence: GitHub `releases/latest` reports `v0.15.3`,
  published `2026-08-01T08:47:47Z`, and the official tag inventory contains no
  `v0.15.4`.
- Artifact evidence: the Windows x64, macOS Apple Silicon, Linux x64, and Linux
  ARM64 `v0.15.3` public download assets each resolve with HTTP 200.
- Live-site evidence: `/`, `/download`, `/zh-TW/download`,
  `/zh-CN/download`, `/about`, and `/docs/get-started` each return HTTP 200,
  visibly identify `v0.15.3`, and do not identify `v0.15.4`. Home and localized
  download surfaces contain all four release asset URLs; the get-started page
  contains the Windows installer link.
- Pending repository evidence: GitHub PRs #430 and #431 concern a possible
  `0.15.4` release but are not an official published tag or release and cannot
  override the public release contract.
- Result: pass; current website release and download claims match the official
  published release.
- Decision: no change. Recheck only after an official newer release is
  published, then verify its complete artifact matrix before changing the site.
- External actions: none; all checks were read-only. No website edit, push, PR,
  merge, deployment, indexing request, GSC validation, external publication,
  or analytics mutation occurred.

### 2026-08-02T06:41:10Z — acquisition hierarchy evidence guard

- Record type: campaign-observation
- Related experiment: none; deterministic measurement-control improvement
- Change: the local weekly report generator now emits an `Acquisition
  Hierarchy Validation` table from authenticated query-plus-page evidence. It
  reports protected acquisition layer, query, observed owner pages, configured
  owner, query impressions, joined owner impressions, their visibility
  difference, ownership state, and decision without pooling locales or sources.
- Guard: a visible split or mismatch is a routing-review signal rather than
  proof of cannibalization. Missing rows are unavailable rather than zero, and
  joined evidence below the existing three-impression query-action floor waits.
- Current evidence: the preserved authenticated `2026-07-03..2026-07-30`
  inputs expose only `llm wiki 2.0` in the protected acquisition set: 1 query
  impression, 1 joined impression, and one observed owner `/zh-TW` versus the
  configured English LLM Wiki owner. No protected query is visibly split over
  multiple pages.
- Result: inconclusive. The only protected row is below the diagnostic floor,
  and the evidence range predates the August 1 routing and localized content
  changes.
- Decision: keep the current hierarchy unchanged and rerun the same section
  with the next authenticated query-page window. A future above-floor visible
  split or mismatch nominates routing review; an aligned row supports only the
  visible query, not the hidden property total.
- Verification: focused split-owner and below-floor tests pass; the generated
  current-state report is
  `/tmp/wenlan-seo/2026-08-01-hierarchy-validation.md`.
- External actions: none. No website edit, new experiment, push, PR, merge,
  deployment, indexing request, GSC validation, external publication, paid
  action, synthetic event, or metric-definition change occurred.

### 2026-08-02T06:49:33Z — AI knowledge-base tool-selection candidate gate

- Record type: campaign-observation
- Related experiment: none; demand-discovery and coverage-gap preparation
- Candidate: one three-locale `choose an AI knowledge-base tool` canonical
  family, not a best-tools ranking or vendor-comparison page.
- Demand evidence: an English Reddit selection discussion retained 33 votes
  in its 2026-01-09 search observation; a Simplified-Chinese V2EX request for
  a reliable AI knowledge base has 6,166 views and 28 replies; Taiwan-language
  result pages target AI knowledge-base tool selection and comparison. The
  previously captured OpenSEO United States `AI knowledge base` 880 and Taiwan
  `AI 知識庫` 210 remain separate third-party units. The current authenticated
  GSC visible-query export contains no tool-selection row and is unavailable,
  not zero.
- Coverage decision: reject separate `RAG vs LLM Wiki`, Codex/ChatGPT
  knowledge-base, and duplicate local/open-source build URLs. Existing LLM
  Wiki, MCP, source-backed knowledge, and document-workflow pages already own
  those questions. No current page owns the tool-selection intent.
- Gate result: pass. Provenance is inspectable, the problem repeats across
  language surfaces, the coverage gap is clean, first-party Wenlan sources can
  prove the proposed criteria, and the eight-test checklist remains useful
  without selecting Wenlan.
- Prepared scope: `/learn/choose-ai-knowledge-base-tool` with zh-TW and zh-CN
  counterparts; distinguish document upload, RAG/document QA, note-editor
  access, and maintained source-backed agent knowledge, then test provenance,
  freshness, conflicts/review, ownership/export, privacy, interoperability,
  input limits, and reproducible acceptance. No `FAQPage` JSON-LD and no
  unsupported vendor claims.
- Decision: prepare, do not start or publish. The prior net-new document guide
  completed production at `2026-08-02T02:42:26Z`, so the frozen 14-day cap
  makes `2026-08-16T02:42:26Z` the earliest unchanged-contract launch.
- Approval boundary: earlier publication requires an explicit amendment to
  the experiment-cap clause. Push, PR, merge, deployment, indexing request,
  GSC validation, external publication, paid action, synthetic event, and
  metric-definition changes remain unperformed and gated.
- Evidence artifact:
  `docs/seo-audits/2026-08-02-ai-knowledge-base-tool-selection-gate.md`.

### 2026-08-02T06:56:05Z — tool-selection gate cap correction

- Record type: campaign-observation correction
- Corrects: the publication-boundary statements in the immediately preceding
  `2026-08-02T06:49:33Z` observation.
- Correction: the current Frozen Goal Contract explicitly has no fixed
  calendar article quota. The older two-active/14-day limits were replaced by
  the production-concurrency rule approved on 2026-07-24. The document guide
  and Karpathy refresh are production-verified and measuring, so they do not
  consume the single preparation slot.
- Decision: the three-locale tool-selection candidate may enter local
  preparation now. It still does not start a public experiment until the
  immutable experiment fields are recorded and publication is explicitly
  approved.
- Unchanged boundaries: no push, PR, merge, deployment, request indexing, GSC
  validation, external publication, paid action, synthetic event, analytics
  mutation, or metric-definition change is authorized by this correction.

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-02-ai-knowledge-base-tool-selection

- Record type: experiment-start
- Experiment ID: EXP-2026-08-02-ai-knowledge-base-tool-selection
- Status: active
- Data window: 2026-08-01..2026-08-07
- Asset class: net-new-search
- Launched: 2026-08-02
- Hypothesis: A standalone, source-backed selection guide that distinguishes
  document upload, RAG/document QA, note-editor access, and maintained agent
  knowledge will earn qualified non-brand impressions and clicks for AI
  knowledge-base tool-selection intent without splitting the current category,
  construction, trust, MCP, or Obsidian owners.
- Candidate evidence: OpenSEO's United States `AI knowledge base` result
  displayed 880 in its third-party unit and exposed tools, builder, examples,
  open-source, GitHub, and free modifiers; its Taiwan `AI 知識庫` result
  displayed 210 in the same unit. An English Reddit tool-selection discussion
  retained 33 votes in the captured result; a Simplified-Chinese V2EX request
  for a reliable AI knowledge base has 6,166 views and 28 replies; Taiwan-
  language result pages independently use AI-knowledge-base tool-selection
  and comparison-guide framing. None of these numbers is GSC or keyword
  volume.
- Coverage gate: pass. Existing pages own category definition, document
  construction, source-backed maintenance, MCP access, and Obsidian workflow;
  none owns the tool-selection question. Separate RAG-vs-LLM-Wiki,
  Codex/ChatGPT knowledge-base, and duplicate local/open-source build URLs are
  rejected.
- First-party proof: maintained Wenlan source documents local storage,
  supported document inputs, source-backed Pages, citations, review, refresh,
  MCP clients, open-source scope, and explicit limitations. The page must not
  claim that Wenlan is best or make an unverified third-party product claim.
- Baseline: Authenticated `2026-07-03..2026-07-30` GSC reports 10 property clicks and 706 property impressions after same-range backfill, 2 visible-query clicks and 120 visible-query impressions, and no visible tool-selection row; Vercel reports 1,468 raw visitors; GitHub reports 47 stars.
- Baseline date range: authenticated `2026-07-03..2026-07-30` rolling range,
  with the same-range GSC backfill captured on 2026-08-02 kept separate from
  the immutable Friday report.
- Baseline GSC property: 10 clicks and 706 impressions.
- Baseline GSC visible queries: 2 clicks and 120 impressions; 8-click and
  586-impression visibility gap. No visible query row contains the prepared
  tool-selection phrases; this is unavailable, not zero.
- Baseline target pages: not applicable before publication; all three
  proposed URLs are new and have no prelaunch Search Console page row.
- Baseline Vercel: 1,468 raw visitors and 1,745 pageviews; 307 direct visitors
  and 457 pageviews; 1,163 visitors and 1,286 pageviews in the separate,
  non-deduplicated qualified-source row aggregate. No target-page observation
  exists before publication.
- Baseline GitHub: 47 total stars. Umami custom-event totals remain account-
  gated and are not inferred.
- Change: add `/learn/choose-ai-knowledge-base-tool` with zh-TW and
  zh-CN counterparts, reciprocal hreflang, sitemap membership, Article and
  BreadcrumbList schema, visible FAQ without `FAQPage`, eight evaluation
  tests, first-party Wenlan proof, and one same-locale Learn-hub route.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 5 GSC target-page impressions per locale after a confirmed post-publish crawl or a complete post-publish range; locale exposure is never pooled.
  Each locale independently needs at least 5 GSC target-page
  impressions after a confirmed post-publish crawl or a complete post-publish
  range. Locale exposure is never pooled.
- Success criteria: after minimum exposure, a locale succeeds when it records
  at least 1 target-page click, or at least 10 target-page impressions with
  page-average position at or above the top 30 and no visible above-floor
  qualified query owned by a conflicting canonical.
- Failure criteria: at W4 or later, after at least 10 target-page impressions
  and a confirmed post-publish crawl, a locale fails when it has 0 clicks,
  page-average position worse than 50, and no visible qualified tool-selection
  query aligned to the target. Below exposure remains inconclusive.
- Stop criteria: stop or correct immediately for a canonical, hreflang,
  sitemap, robots, noindex, schema, locale, mobile-render, source-accuracy, or
  standalone-utility regression; stop a locale if an above-floor joined query
  consistently belongs to an existing protected owner rather than the new
  page. Do not continuously rewrite while exposure is insufficient.
- 24h readout: technical/indexability and available native-unit evidence only;
  never infer SEO success
- 7d readout: target-page and joined-query evidence if a complete authenticated
  post-publish range exists; otherwise inconclusive
- W2 readout: apply the independent locale minimums and success/failure bands
- W4 readout: apply the same immutable bands after confirmed crawl/exposure
- W8 readout: terminal cohort read if the Goal remains active or a later
  controller preserves it
- Result: pending
- Decision: wait
- Next step: add the bounded three-locale canonical family and deterministic
  coverage, then run the full local SEO, TypeScript, build, technical, locale,
  and responsive-render gates before asking for publication approval.
- Excluded actions: push, PR, merge, deployment, request indexing, GSC
  validation, external publication, paid action, synthetic event, analytics
  mutation, and metric-definition change.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-02T07:17:04Z — tool-selection hierarchy local verification

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-02-ai-knowledge-base-tool-selection`
- Status: local verification passed; publication approval pending
- Hierarchy contract: tool-selection queries map to the new canonical family;
  document-build queries remain on the document workflow; LLM Wiki/category,
  source-backed maintenance, MCP access, and Obsidian workflow keep their
  existing owners. The three locale owners remain independent and are not
  pooled.
- Deterministic verification: `pnpm seo:goal:check` passed; the full SEO suite
  passed 222/222; the i18n contract passed 63/63; TypeScript passed; the
  production build generated 223 static pages; the built technical checker
  passed 120 sitemap URLs, 24 required canonicals, 24 checked pages, and the
  site-wide `FAQPage` absence check across 124 built HTML pages.
- Rendered verification: fresh full-height Chrome captures covered English,
  zh-TW, and zh-CN at 393px and 1440px widths. The exact title hierarchy,
  article packet, body sections, eight-test list, code block, CTA, references,
  related links, and visible FAQ were inspected. Document widths matched their
  scroll widths; CJK titles and semantic phrases wrapped without clipping or
  single-character orphan lines. The first FAQ opened on every locale route,
  and the browser recorded no errors or warnings.
- Interpretation: this verifies a coherent implementation and a falsifiable
  query-to-owner hypothesis. It is not indexing evidence, GSC demand, ranking,
  clicks, Vercel visitor lift, or causality. After publication, each locale
  needs its own declared five target-page GSC impressions before evaluation.
  An above-floor visible split or mismatch triggers routing review rather than
  a forced defense of the new URL.
- Result: local verification passed
- Decision: wait
- Next step: request explicit approval to commit, push, create and merge a PR,
  allow Vercel production deployment, and perform read-only production
  verification for this bounded three-locale family.
- External actions: none. No push, PR, merge, deployment, request indexing,
  GSC validation, external publication, paid action, synthetic event,
  analytics mutation, or metric-definition change occurred.

### 2026-08-02T07:41:27Z — tool-selection publication approval

- Record type: campaign-approval
- Related experiment: `EXP-2026-08-02-ai-knowledge-base-tool-selection`
- Status: active; publication authorized; consumes the single production slot
- Approved scope: commit the verified English, zh-TW, and zh-CN canonical
  family and its deterministic hierarchy, locale, sitemap, schema, and
  technical coverage; push the current branch; create and merge the PR; allow
  automatic Vercel production deployment; and perform read-only production
  verification.
- Excluded actions: request indexing, GSC validation, external publication,
  paid action, synthetic event, analytics mutation, and metric-definition
  changes remain unapproved.
- Next step: rerun the frozen Goal and publication gates, publish the isolated
  branch, wait for Vercel production completion, and verify the exact live
  three-locale contract before releasing the production slot.

### 2026-08-02T07:55:01Z — tool-selection production publication and visual correction

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-02-ai-knowledge-base-tool-selection`
- Status: live and measuring; narrow same-experiment CJK correction in local
  preparation
- Publication: PR #118 squash-merged at `2026-08-02T07:54:17Z` as
  `4d4d805b82527bff1d312779047c7ee37408f855`. Vercel production completed at
  `2026-08-02T07:55:01Z`; this is the experiment's fixed publish and
  measurement boundary.
- Deployed technical evidence: `pnpm seo:technical:deployed` passed 120
  sitemap URLs, 24 key pages, six utility noindex headers, 120 sitemap-page
  `FAQPage` absence checks, 25 redirects, six bridge-host redirects, and
  old-URL sitemap absence.
- Rendered evidence: fresh Chrome device emulation captured every English,
  zh-TW, and zh-CN route at exact 393px and 1440px CSS viewports. Root and body
  scroll widths equaled the viewport widths, H1 bounds stayed within the
  content column, full-page renders completed, and the first FAQ on every
  route opened with a non-empty answer. Earlier command-line Chrome captures
  that appeared clipped used a 393px bitmap over Chrome's larger minimum
  layout viewport and are rejected as invalid evidence.
- Correction evidence: the stricter CJK pass found that the new localized slug
  did not use the existing semantic-term wrapper, so `驗收資料` /
  `验收资料` and `8 項` / `8 项` could split awkwardly on mobile. A focused
  local correction adds this slug and those phrases, plus `AI 知識庫` /
  `AI 知识库`, to the existing wrapper. The regression test failed before the
  implementation and the i18n suite now passes 63/63.
- Interpretation: publication, indexability, and responsive containment are
  verified. The phrase correction changes only rendered wrapping; it does not
  change visible text, metadata, canonical ownership, the immutable
  experiment bands, or the `2026-08-02T07:55:01Z` measurement boundary. This
  is not crawl evidence, ranking, GSC demand, visitor lift, or causality.
- Result: production technical pass; CJK correction pending full publication
  gates
- Decision: finish the same-experiment correction, then wait for the declared
  24-hour and 7-day evidence boundaries
- Excluded actions: no request indexing, GSC validation, external publication,
  paid action, synthetic event, analytics mutation, or metric-definition
  change.

### 2026-08-02T08:15:04Z — tool-selection CJK correction local verification

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-02-ai-knowledge-base-tool-selection`
- Status: same-experiment render correction locally verified; publication
  pending
- Change: extend the existing localized semantic-term wrapper to the new
  tool-selection slug and keep `AI 知識庫` / `AI 知识库`, `知識庫` /
  `知识库`, `驗收資料` / `验收资料`, and `8 項` / `8 项` intact above
  the existing 360px escape hatch. Visible strings and search metadata are
  unchanged.
- Regression proof: the updated i18n contract failed before implementation,
  then passed 63/63 after the focused correction. The full SEO suite passed
  222/222, TypeScript and the Goal verifier passed, the production build
  generated 223 static pages, the built technical checker passed 120 sitemap
  URLs, 24 key pages, and no `FAQPage` across 124 built HTML pages, and the
  built route matrix passed 27 direct 200 routes plus four intentional 404s.
- Visual Pass A — design-system and functional integrity: PASS. The shared
  Learn renderer, existing wrapper seam, live DOM, typography and color tokens,
  responsive grid, links, CTA, code scroller, and FAQ interaction remain real
  and functional; no raster or one-off replacement was introduced.
- Visual Pass B — visual fidelity and CJK precision: PASS. Fresh full-page and
  FAQ-open Chrome captures covered English, zh-TW, and zh-CN at exact 393px
  and 1440px CSS viewports. Root and body widths equaled each viewport, H1
  bounds remained inside the content column, and the four protected phrase
  families did not split or orphan. Decorative SVG and horizontally scrollable
  code contents extend inside intentional clipped/scroll containers without
  changing document width.
- Interpretation: this closes the local render defect, not a GSC, visitor,
  click, crawl, ranking, or causal readout. The original
  `2026-08-02T07:55:01Z` measurement boundary remains fixed.
- Decision: publish the focused same-experiment correction through the
  existing approved PR, Vercel, and read-only production verification path;
  then wait for the declared evidence boundaries.
- Excluded actions: no request indexing, GSC validation, external publication,
  paid action, synthetic event, analytics mutation, or metric-definition
  change.

### 2026-08-02T08:22:13Z — tool-selection CJK correction production verification

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-02-ai-knowledge-base-tool-selection`
- Status: live and measuring; same-experiment correction production-verified
- Publication: PR #119 squash-merged at `2026-08-02T08:21:25Z` as
  `cde12da7226f8129822ae45fa61a8cc85592adce`; Vercel production completed at
  `2026-08-02T08:22:13Z`.
- Deployed technical evidence: `pnpm seo:technical:deployed` passed 120
  sitemap URLs, 24 key pages, six utility noindex headers, 120 sitemap-page
  `FAQPage` absence checks, 25 redirects, six bridge-host redirects, and
  old-URL sitemap absence.
- Rendered evidence: fresh production Chrome device emulation covered the
  English, zh-TW, and zh-CN routes at exact 393px and 1440px CSS viewports.
  Root and body scroll widths matched every viewport, H1 bounds stayed within
  their content columns, complete pages rendered, and the first FAQ on every
  route opened with a non-empty answer. `AI 知識庫` / `AI 知识库`, `知識庫` /
  `知识库`, `驗收資料` / `验收资料`, and `8 項` / `8 项` remained intact.
- Interpretation: the focused render correction is production-verified. It is
  not crawl, ranking, click, visitor, or causal evidence, and does not move the
  original `2026-08-02T07:55:01Z` measurement boundary.
- Decision: close the correction path and wait for the experiment's declared
  24-hour and 7-day evidence boundaries.
- Excluded actions: no request indexing, GSC validation, external publication,
  paid action, synthetic event, analytics mutation, or metric-definition
  change.
<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-02-ai-knowledge-base-tool-selection correction

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-02-ai-knowledge-base-tool-selection
- Observed at: 2026-08-02T08:22:13Z
- Readout: correction
- Status: measuring
- Evidence: PR #118 published the three-locale family at
  `2026-08-02T07:55:01Z`; PR #119 production-verified its render-only CJK
  correction at `2026-08-02T08:22:13Z`. The deployed technical checker and
  exact 393px and 1440px locale renders passed. This correction records the
  already-preserved production observation in verifier-readable form.
- Result: pending
- Decision: wait
- Next step: keep the original production boundary and independent locale
  exposure guards; wait for source-native readouts rather than holding the
  production slot.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-11-llm-wiki-schema-template-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-08-11-llm-wiki-schema-template-refresh
- Status: active
- Data window: 2026-08-08..2026-08-14
- Asset class: refresh
- Launched: 2026-08-13
- Hypothesis: adding a concise vendor-neutral starter schema, on-demand
  procedure boundary, and source-change acceptance test to the existing LLM
  Wiki canonicals will help each locale earn a first target-page click or a
  privacy-visible qualified template/schema query without splitting category
  ownership into another URL.
- Candidate evidence: Karpathy's inspectable LLM-wiki note; the maintained
  jackwener implementation; an independent English CLAUDE.md template; two
  independent Reddit implementation/verification questions; maintained
  Simplified-Chinese OSS and a Chinese walkthrough; two independent
  Traditional-Chinese explanations; and maintained Wenlan first-party source.
  Source URLs, capture dates, languages, and available native units are
  preserved in
  `docs/seo-audits/2026-08-11-llm-wiki-schema-template-candidate.md`.
- Baseline: authenticated GSC `2026-07-14..2026-08-10` reports 7 property
  clicks and 869 impressions, 2 visible-query clicks and 174 impressions,
  and a 5-click and 695-impression visibility gap. English, zh-TW, and zh-CN
  target rows are independently 0 clicks/5 impressions, 0/1, and 0/3.
  Vercel target rows remain separate at 10/15, 5/9, and 16/21
  visitors/pageviews. Missing visible schema queries are unavailable, not
  zero; no source-to-page or causal join is inferred.
- Change: refresh only the existing English, zh-TW, and zh-CN
  `/learn/distilled-wiki-pages-ai-memory` canonical family. Add a minimum
  schema checklist, compact CLAUDE.md/AGENTS.md client contract, on-demand
  ingest/query/lint/review boundary, a five-step source-change acceptance
  test, two maintained implementation references, and the explicit Wenlan
  boundary that users do not author its internal Page schema.
- Fixed surfaces: keep each current URL, title and category ownership,
  `datePublished` (`2026-06-24` English; `2026-07-04` Mandarin), canonical,
  reciprocal hreflang, sitemap membership, Article and BreadcrumbList schema,
  maintained source list, visible FAQ, and absence of `FAQPage`. Only
  `dateModified` moves to `2026-08-12`.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 10 GSC target-page impressions per locale after a
  confirmed post-deploy crawl; locales are never pooled.
- Success criteria: after minimum exposure, the locale records at least one
  target-page click, or a privacy-visible qualified template/schema query
  records at least 5 impressions on the intended locale canonical without a
  visible owner split.
- Failure criteria: after minimum exposure and a confirmed post-deploy crawl,
  the locale has zero target-page clicks and no privacy-visible qualified
  query reaches 5 impressions by W4.
- Inconclusive: the locale remains below 10 target-page impressions, lacks a
  confirmed post-deploy crawl, or available performance data mixes another
  edit to the same canonical.
- Stop criteria: another controller edits the same canonical; canonical,
  indexability, hreflang, schema, source, FAQ, or responsive floors regress;
  first-party product truth changes; or the copy implies an unsupported user-
  authored Wenlan Page schema.
- 24h readout: pending after production completion; technical and source-
  native evidence only.
- 7d readout: pending after production completion plus seven days.
- W2 readout: pending after production completion plus fourteen days.
- W4 readout: pending after production completion plus twenty-eight days.
- W8 readout: pending after production completion plus fifty-six days.
- Result: pending
- Decision: wait
- Next step: run the full local content, SEO, i18n, TypeScript, build,
  technical, locale, and responsive visual gates. Do not publish or request
  indexing from this start record.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-13 — LLM Wiki starter-schema local verification

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-11-llm-wiki-schema-template-refresh`
- Status: active; local preparation verified; publication pending approval
- Verification: `pnpm seo:goal:check`, 222 SEO tests, 63 i18n tests,
  TypeScript, the 223-page production build, the built technical audit, 27
  expected localized 200 routes, four expected localized 404 routes, and
  `git diff --check` pass.
- Render evidence: fresh English, zh-TW, and zh-CN production-build checks at
  393px and 1440px show no document overflow; H1 and the new starter-schema
  and acceptance-test sections remain inside the content column; mobile code
  blocks scroll only inside their own containers; FAQ content remains
  present; and the browser reports no warning or error.
- Built SEO packet: each locale has its exact self-canonical, `index, follow`,
  reciprocal English, zh-TW, zh-CN, and x-default alternates, its stable
  original `datePublished`, `dateModified: 2026-08-12`, Article and
  BreadcrumbList schema, and zero `FAQPage` occurrences. The Karpathy,
  Rohitg00, jackwener, and Hjarni reference URLs each return HTTP 200.
- Interpretation: this verifies local implementation and presentation only.
  It is not publication, crawl, indexing, ranking, impression, click,
  visitor, star, or causal evidence.
- Decision: request the separate publication approval already required by the
  frozen boundary. Do not request indexing or submit GSC validation.

### 2026-08-13 — publication-approval blocker audit

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-11-llm-wiki-schema-template-refresh`
- Status: active local candidate; shared-state work paused
- Evidence: the candidate gate, implementation, deterministic tests, build,
  built SEO packet, three-locale route matrix, responsive render inspection,
  external-reference checks, and diff hygiene are complete. The same explicit
  approval boundary has prevented commit, push, PR creation, merge, automatic
  Vercel deployment, and production verification for three consecutive Goal
  turns.
- Result: the repository can make no further attributable progress on this
  experiment without a user decision. Repeating local checks would add no new
  evidence and would not increase exposure.
- Decision: pause the Goal controller at its frozen approval stop condition.
  Preserve the prepared branch and resume from this exact candidate if the
  user approves publication.
- Next decision needed: approve or reject commit, push, PR creation, merge,
  automatic Vercel deployment, and read-only production verification for
  `codex/llm-wiki-starter-schema`. Request indexing, GSC validation, external
  publication, paid actions, synthetic events, analytics mutation, and metric
  changes remain excluded.

### 2026-08-13 — LLM Wiki starter-schema publication approval

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-11-llm-wiki-schema-template-refresh`
- Status: approved; consumes the single website production slot
- Approval: the user explicitly approved commit, push, PR creation, merge,
  automatic Vercel deployment, and read-only production verification for the
  exact `codex/llm-wiki-starter-schema` candidate.
- Included scope: the existing English, zh-TW, and zh-CN LLM Wiki canonical
  refresh, focused contracts, the candidate audit, and its PLAN and ledger
  records.
- Excluded actions: request indexing, GSC validation, external publication,
  paid actions, synthetic events, analytics mutation, and metric-definition
  changes remain unapproved.
- Decision: publish the verified candidate and keep the production slot until
  the merged Vercel Production deployment and live three-locale gates pass.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-11-llm-wiki-schema-template-refresh production verification

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-11-llm-wiki-schema-template-refresh
- Observed at: 2026-08-13T05:22:32Z
- Readout: correction
- Status: measuring
- Evidence: PR #124 squash-merged at `2026-08-13T05:21:47Z` as
  `38e5a6b69a0b30a73550f97732b59c2fff0b5b8c`; Vercel Production deployment
  `5882382588` completed successfully at `2026-08-13T05:22:32Z`. The deployed
  technical audit passed 120 sitemap URLs, 24 key pages, six utility noindex
  headers, sitemap-wide `FAQPage` absence, 25 redirects, six bridge-host
  redirects, and old-URL exclusion. Direct live HTML and fresh 393px plus
  1440px renders pass all three locale content, canonical, robots, schema,
  FAQ, overflow, and browser-console floors.
- Result: pending
- Decision: wait
- Next step: preserve the production pages unchanged and run the technical
  and source-native 24-hour readout after `2026-08-14T05:22:32Z`; do not infer
  crawl, indexing, ranking, impression, click, visitor, star, or causality
  from deployment.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-13T05:22:32Z — LLM Wiki starter-schema production record

- Record type: campaign-observation
- Related experiment: `EXP-2026-08-11-llm-wiki-schema-template-refresh`
- Status: production-verified and measuring; production slot open
- Publication: commit `16e30743f2b818732f6d9f48e91ff24105b683d2`
  published through PR #124; squash merge
  `38e5a6b69a0b30a73550f97732b59c2fff0b5b8c` entered `main` at
  `2026-08-13T05:21:47Z`.
- Deployment: Vercel Production deployment `5882382588` completed with state
  `success` at `2026-08-13T05:22:32Z`.
- Live verification: deployed technical SEO, exact three-locale HTML, 393px
  and 1440px responsive rendering, content sections, FAQ count, canonical,
  indexability, schema dates, Article/BreadcrumbList, reference links, and
  browser console all pass.
- Interpretation: publication integrity is proven; search and traffic effect
  is not. The original independent 10-impression post-crawl locale guards and
  all approval exclusions remain unchanged.

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-08-source-backed-ai-knowledge-base-snippet-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-08-08-source-backed-ai-knowledge-base-snippet-refresh
- Status: measuring
- Data window: 2026-08-08..2026-08-14
- Asset class: refresh
- Launched: 2026-08-09
- Hypothesis: a build-task title, description, H1, and quick answer on the
  existing English source-backed AI knowledge-base canonical can earn a first
  target-page click without creating another overlapping URL.
- Candidate evidence: authenticated GSC reports 0 clicks and 8 impressions
  for the target at page-average position 9.5; the deterministic weekly
  report ranked it first among protected AI-knowledge-base and wiki snippet
  actions. Only 3 brand/entity impressions are visible in the query-page
  join, so no hidden query is invented. Full provenance is preserved in
  `docs/seo-audits/2026-08-08-source-backed-ai-knowledge-base-snippet-prelaunch.md`.
- Baseline: GSC property 8 clicks/874 impressions; visible queries 2/172;
  query visibility gap 6/702; target page 0/8 at 9.5. Vercel separately
  reports 1,387 visitors/1,666 pageviews, 231 direct visitors/383 pageviews,
  and target page 5 visitors/5 pageviews. GitHub's separate observation is 47
  stars; Umami is unavailable.
- Change: refresh only the English H1, page description, meta title, meta
  description, and quick answer. Preserve the six-command workflow,
  maintained sources, canonical ownership, locale behavior, Article and
  BreadcrumbList schema, visible FAQ, and absence of `FAQPage`.
- Publish date: 2026-08-09
- Index date: not-indexed
- Minimum exposure: 10 GSC target-page impressions after a confirmed
  post-deploy Google crawl.
- Success criteria: after both guards, at least 1 target-page GSC click while
  the technical and content floor remains green.
- Failure criteria: after 28 complete post-deploy days and both guards, 0
  target-page clicks, or a technical, source, locale, schema, FAQ, or render
  regression.
- Inconclusive: fewer than 10 target-page impressions, no confirmed
  post-deploy crawl, or mixed evidence from another edit to this canonical.
- Stop criteria: another controller edits the same canonical or any protected
  technical/content floor regresses.
- 24h readout: inconclusive at 2026-08-13T05:35:20Z; see the source-native
  readout below.
- 7d readout: pending after 2026-08-16T15:32:38Z.
- W2 readout: pending after 2026-08-23T15:32:38Z.
- W4 readout: pending after 2026-09-06T15:32:38Z.
- W8 readout: pending after 2026-10-04T15:32:38Z.
- Result: pending
- Decision: wait
- Next step: keep this canonical unchanged until a post-deploy crawl and the
  minimum exposure guard exist; do not repeat the prior indexing request.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-08-source-backed-ai-knowledge-base-snippet-refresh 24h

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-08-source-backed-ai-knowledge-base-snippet-refresh
- Observed at: 2026-08-13T05:35:20Z
- Readout: 24h
- Status: measuring
- Evidence: PR #121 squash-merged at `2026-08-09T15:31:50Z` as
  `3736a89135be0ef826cb6eaf1f1d039140bf7145`; Vercel Production deployment
  `5820163298` completed successfully at `2026-08-09T15:32:38Z`. Current live
  HTML returns HTTP 200, exact self-canonical, `index, follow`, the deployed
  build-task title and description, `dateModified: 2026-08-08`, Article and
  BreadcrumbList schema, visible quick answer, and no `FAQPage`. Authenticated
  GSC URL Inspection reports `PASS`, submitted and indexed, allowed fetch and
  indexing, exact Google and user canonical, sitemap discovery, successful
  mobile fetch, and last crawl `2026-07-29T01:09:32Z`.
- Result: inconclusive
- Interpretation: Google's recorded crawl predates deployment, so the
  post-deploy-crawl guard is not met. The latest preserved complete GSC and
  Vercel window ends 2026-08-11 and remains mixed; it is not used to judge
  success or failure.
- Decision: wait
- Next step: run the 7-day source-native readout after
  `2026-08-16T15:32:38Z`; do not edit this canonical, request indexing again,
  submit validation, or infer indexing-request effect.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-13-ai-agent-knowledge-graph-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-08-13-ai-agent-knowledge-graph-refresh
- Status: active
- Data window: 2026-08-08..2026-08-14
- Asset class: refresh
- Launched: 2026-08-13
- Hypothesis: a task-qualified title and compact first answer on the existing
  indexed `/docs/knowledge-graph` owner can earn a first target-page click or
  visible AI-agent knowledge-graph query without creating an overlapping
  Learn URL.
- Candidate evidence: independent English GitHub and Reddit observations,
  Simplified-Chinese V2EX and Zhihu observations, authenticated URL
  Inspection, and maintained Wenlan first-party source pass the five-part
  gate. Full URLs, capture dates, languages, native units, coverage analysis,
  and product proof are preserved in
  `docs/seo-audits/2026-08-13-ai-agent-knowledge-graph-coverage-gate.md`.
- Baseline: authenticated GSC `2026-07-15..2026-08-11` reports 7 property
  clicks and 855 impressions, 2 visible-query clicks and 170 impressions,
  and a 5-click/685-impression visibility gap. The target is absent from the
  returned page table and is unavailable, not zero. URL Inspection reports
  the target indexed on the exact canonical with last crawl
  `2026-07-16T09:43:37Z`. Vercel target rows are unavailable; GitHub's
  separate observation is 47 stars; Umami is unavailable.
- Change: refresh only the existing English `/docs/knowledge-graph` metadata,
  H1/description, and first answer. Keep the URL, canonical, sitemap,
  TechArticle/BreadcrumbList schema, adjacent Docs routing, and intentional
  zh-TW/zh-CN 404 behavior. Graph context must remain supporting evidence,
  not authority over source memories and maintained pages.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 10 GSC target-page impressions after a confirmed
  post-deploy Google crawl.
- Success criteria: after both guards, at least 1 target-page click or at
  least 5 privacy-visible qualified AI-agent knowledge-graph impressions on
  the intended canonical, with technical floors green.
- Failure criteria: after 28 complete post-deploy days and both guards, 0
  target-page clicks and no qualified visible query reaches 5 impressions,
  or a technical, source, locale, schema, or render regression.
- Inconclusive: minimum exposure is not reached, no post-deploy crawl is
  confirmed, or another edit mixes the same canonical.
- Stop criteria: controller overlap; product-truth drift; canonical,
  indexability, schema, source, or responsive regression; or copy that treats
  graph context as authority without inspectable sources.
- 24h readout: pending after production completion.
- 7d readout: pending after production completion plus seven days.
- W2 readout: pending after production completion plus fourteen days.
- W4 readout: pending after production completion plus twenty-eight days.
- W8 readout: pending after production completion plus fifty-six days.
- Result: pending
- Decision: wait
- Next step: prepare and verify the bounded existing-page refresh locally;
  stop before commit, push, PR, merge, deployment, or indexing actions.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-13-ai-agent-knowledge-graph-refresh local verification

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-13-ai-agent-knowledge-graph-refresh
- Observed at: 2026-08-13T05:57:03Z
- Readout: correction
- Status: active
- Evidence: the RED content-contract control failed against the prior page.
  After the bounded refresh, `pnpm test:seo` passed 223/223; `pnpm lint`,
  `pnpm seo:goal:check`, `git diff --check`, `pnpm build`, and
  `pnpm seo:technical:built` passed. The non-production build skipped
  IndexNow. Fresh local production rendering covered all four desktop and
  eight 393px mobile viewports with no clipped text, horizontal overflow,
  broken images, or awkward heading orphan. Exact canonical, `index, follow`,
  intended H1, and the visible quick answer were present.
- Result: pending
- Decision: wait
- Next step: obtain explicit approval for commit, push, PR creation, merge,
  automatic Vercel deployment, and read-only production verification. Keep
  indexing request, GSC validation, external publication, paid action,
  synthetic events, analytics mutation, and metric changes gated.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-07-29-obsidian-claude-code-refresh W2 at 2026-08-13T06:07:55Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-07-29-obsidian-claude-code-refresh
- Observed at: 2026-08-13T06:07:55Z
- Readout: W2
- Status: measuring
- Evidence: the latest completed weekly evidence is the authenticated
  `2026-07-10..2026-08-06` range. GSC property totals are 8 clicks and 874
  impressions; visible-query totals are 2 clicks and 172 impressions; the
  query visibility gap is 6 clicks and 702 impressions. The mixed target-page
  row is 0 clicks, 12 impressions, and 17.5 page-average position. A narrow
  final GSC query for eight complete post-deploy dates
  `2026-07-30..2026-08-06` reports 0 target-page clicks, 6 impressions, and
  28.8 page-average position; the only privacy-visible target join is
  `stevenstavrakis/obsidian-mcp` with 1 impression at position 46. Vercel
  separately reports 1,387 raw visitors and 1,666 pageviews, 231 direct
  visitors and 383 direct pageviews, and 8 target-page visitors plus 13
  target-page pageviews for its aligned rolling range; no target-specific
  source-to-page row is returned, so none is inferred. Umami remains
  unavailable/account-gated. GitHub public REST reports 47 stars. Read-only
  GSC URL Inspection reports `PASS`, submitted and indexed, successful mobile
  fetch, exact Google and user canonicals, and a post-deploy crawl at
  `2026-08-03T11:30:48Z`. Current live HTML returns direct 200 with exact
  canonical, `index, follow`, stable `datePublished: 2026-06-06` and
  `dateModified: 2026-07-29`, Article and BreadcrumbList schema, direct-files,
  editor-context, Obsidian MCP, and source-backed knowledge-lifecycle content,
  two visible FAQs without `FAQPage`, and sitemap membership.
- Result: inconclusive
- Decision: wait
- Next step: keep the English canonical unchanged and run W4 after
  `2026-08-26T06:07:17Z`; do not infer exact-query rank, source-to-page
  sessions, indexing-request effect, causality, or SEO success, and do not
  request indexing or submit validation.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-01-document-knowledge-base-guide 7d at 2026-08-13T06:21:12Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-01-document-knowledge-base-guide
- Observed at: 2026-08-13T06:21:12Z
- Readout: 7d
- Status: measuring
- Evidence: The latest authenticated rolling observation remains
  `2026-07-15..2026-08-11`: GSC property totals are 7 clicks and 855
  impressions; visible-query totals are 2 clicks and 170 impressions; the
  query visibility gap is 5 clicks and 685 impressions. A narrow authenticated
  page query for the nine complete post-publish dates `2026-08-03..2026-08-11`
  reports English at 0 clicks, 2 impressions, and page-average position 51.0;
  zh-TW at 0 clicks, 1 impression, and position 1.0; and no zh-CN page row,
  which is unavailable rather than zero. The only privacy-visible target join
  is English `local ai knowledge base` at 0 clicks, 1 impression, and position
  56. Read-only URL Inspection reports all three URLs submitted and indexed,
  successfully fetched as mobile, and using exact matching Google and user
  canonicals; last crawls are `2026-08-02T14:11:47Z`,
  `2026-08-03T12:56:06Z`, and `2026-08-03T17:27:04Z`. Vercel separately
  reports 74 raw visitors and 214 pageviews, 65 direct visitors and 203 direct
  pageviews, and a non-deduplicated qualified-referrer row sum of 9 visitors
  and 10 pageviews for the same dates. The English target has 2 visitors and
  3 pageviews; the Mandarin targets have no returned page row. No qualified
  source-to-target row was returned. Umami remains unavailable/account-gated,
  and GitHub public REST reports 47 stars.
- Result: inconclusive
- Decision: wait
- Next step: Keep the three canonicals unchanged and run W2 after
  `2026-08-16T02:42:26Z`. Each locale remains below its independent five-
  impression minimum; do not pool locales, interpret a missing row as zero,
  infer exact-query rank, source-to-page sessions, causality, or SEO success,
  or request indexing or submit validation.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-01-karpathy-llm-wiki-locales-refresh 7d at 2026-08-13T06:21:13Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-01-karpathy-llm-wiki-locales-refresh
- Observed at: 2026-08-13T06:21:13Z
- Readout: 7d
- Status: stopped
- Evidence: The same source-native rolling observation keeps GSC property
  totals at 7 clicks and 855 impressions, visible-query totals at 2 clicks and
  170 impressions, and the visibility gap at 5 clicks and 685 impressions.
  The narrow authenticated `2026-08-03..2026-08-11` page rows report English
  at 0 clicks, 1 impression, and page-average position 5.0; zh-TW at 0 clicks,
  1 impression, and position 8.0; and zh-CN at 0 clicks, 3 impressions, and
  position 10.3. No target query is privacy-visible. All three URLs are
  submitted and indexed with exact Google and user canonicals, but their last
  crawls—`2026-07-29T01:09:29Z`, `2026-07-29T01:10:28Z`, and
  `2026-08-01T22:01:38Z`—predate the `2026-08-02T04:39:55Z` Karpathy refresh.
  Vercel separately returns 8 visitors and 8 pageviews for zh-CN and no page
  row for English or zh-TW in the same complete-date window; no qualified
  source-to-target row is returned. Umami remains unavailable/account-gated,
  and GitHub public REST reports 47 stars. On `2026-08-13T05:22:32Z`,
  `EXP-2026-08-11-llm-wiki-schema-template-refresh` changed this exact
  canonical family in production, ending attributable exposure for the older
  copy.
- Result: inconclusive
- Decision: stop
- Next step: Stop this intervention as superseded and make no W2 or later
  attribution to its copy. Each locale remained below its five-impression
  minimum before controller overlap; the newer schema-template experiment now
  owns future measurement. Do not infer endorsement, exact-query rank,
  causality, or SEO success, and do not repeat indexing requests or submit
  validation.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-02-ai-knowledge-base-tool-selection 7d at 2026-08-13T06:21:14Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-02-ai-knowledge-base-tool-selection
- Observed at: 2026-08-13T06:21:14Z
- Readout: 7d
- Status: measuring
- Evidence: The same authenticated rolling observation reports 7 GSC property
  clicks and 855 impressions, 2 visible-query clicks and 170 impressions, and
  a 5-click and 685-impression visibility gap. The narrow authenticated
  `2026-08-03..2026-08-11` page rows report English at 0 clicks, 1 impression,
  and page-average position 1.0; zh-TW at 0 clicks, 1 impression, and position
  7.0; and no zh-CN page row, which is unavailable rather than zero. No target
  query is privacy-visible. Read-only URL Inspection reports all three URLs
  submitted and indexed with successful fetches and exact Google and user
  canonicals; last crawls are `2026-08-02T14:20:50Z`,
  `2026-08-03T10:19:09Z`, and `2026-08-03T13:05:24Z`. Vercel separately
  reports 2 English visitors and 6 pageviews, 1 zh-TW visitor and 1 pageview,
  and no zh-CN page row for the same dates; no qualified source-to-target row
  is returned. Umami remains unavailable/account-gated, and GitHub public REST
  reports 47 stars.
- Result: inconclusive
- Decision: wait
- Next step: Keep the three canonicals unchanged and run W2 after
  `2026-08-16T07:55:01Z`. Each locale remains below its independent five-
  impression minimum; do not pool locales, convert a missing row to zero,
  infer hidden query intent, exact-query rank, source-to-page sessions,
  causality, or SEO success, or request indexing or submit validation.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-13T06:29:00Z — approved OSS distribution reconciliation

- Record type: campaign-observation
- Related experiment: none; approved OSS distribution lane
- Status: external permission blocked
- Evidence: A just-in-time check found no `Wenlan`, `7xuanlu/wenlan`, or
  pre-Wenlan duplicate in `appcypher/awesome-mcp-servers` upstream `main`
  or its all-state pull requests. Fork branch `add-wenlan-appcypher` remains
  exactly one commit and one README line ahead of upstream. The maintained
  repository and `https://wenlan.app/favicon.svg` both return HTTP 200. A
  fresh `gh pr create` attempt for the previously approved exact entry failed
  before PR creation with `GraphQL: 7xuanlu does not have the correct
  permissions to execute CreatePullRequest (createPullRequest)`.
- Interpretation: The patch remains valid, but the upstream/fork permission
  relationship blocks GitHub PR creation. No PR, comment, maintainer message,
  duplicate listing, website edit, indexing request, or analytics mutation was
  created. The other approved Wenlan directory PRs remain twelve clean or
  maintainer-review-waiting submissions plus one upstream-link-check failure
  already proven unrelated to the Wenlan URL.
- Decision: stop retrying this destination unless its permission state changes;
  continue passive review-state observation for the submitted directory set.

### 2026-08-13T06:36:02Z — AI-agent knowledge-graph publication approval

- Record type: campaign-approval
- Related experiment: EXP-2026-08-13-ai-agent-knowledge-graph-refresh
- Status: active
- Approved scope: commit, push, ready PR creation, merge, automatic Vercel
  deployment, and read-only production verification for the exact
  `codex/ai-agent-knowledge-graph-refresh` candidate. The candidate contains
  only the existing English `/docs/knowledge-graph` metadata, visible title
  and description, first answer, focused regression test, candidate audit,
  and campaign records.
- Excluded actions: request indexing, GSC validation, external publication,
  paid action, synthetic events, analytics mutation, and metric changes.
- Decision: publish the exact locally verified scope and keep the production
  slot occupied until the Vercel deployment and live checks pass.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-13-ai-agent-knowledge-graph-refresh production verification

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-13-ai-agent-knowledge-graph-refresh
- Observed at: 2026-08-13T06:43:11Z
- Readout: correction
- Status: measuring
- Evidence: PR #126 squash-merged at `2026-08-13T06:39:04Z` as
  `fe5e6c7816c397d207de71ae6d28069b355b313d`; Vercel Production deployment
  `5883194191` completed successfully at `2026-08-13T06:39:50Z`. The deployed
  technical checker passed 120 sitemap URLs, 24 key pages, six utility
  noindex headers, `FAQPage` absence across every sitemap page, 25 redirects,
  six bridge-host redirects, and old-URL sitemap exclusion. The live English
  target returns direct HTTP 200 with exact self-canonical, `index, follow`,
  the intended AI-agent knowledge-graph H1 and compact first answer,
  TechArticle and BreadcrumbList schema, and sitemap membership; `FAQPage` is
  absent and the unsupported zh-TW and zh-CN Docs routes remain direct 404s.
  Fresh Chrome device emulation measured exact 393px and 1440px CSS viewports:
  document and body scroll widths equal their client widths, the H1 stays
  inside the viewport, both content floors are visible, no image is broken,
  and no page exception occurred. Complete screenshots were inspected.
- Result: pending
- Decision: wait
- Next step: use `2026-08-13T06:39:50Z` as the production and measurement
  boundary; run the 24-hour source-native readout only after
  `2026-08-14T06:39:50Z`. Do not infer a Google crawl, indexing effect,
  impressions, clicks, traffic lift, or causality from deployment, and do not
  request indexing or submit validation.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-13-ai-knowledge-base-context-links

- Record type: experiment-start
- Experiment ID: EXP-2026-08-13-ai-knowledge-base-context-links
- Status: active
- Data window: 2026-08-08..2026-08-14
- Asset class: refresh
- Launched: 2026-08-14
- Hypothesis: Three additional semantically exact contextual entry points will
  help Google and users discover the existing English comparison owner
  without disturbing its successful answer, increasing attributable
  target-page exposure or clicks.
- Candidate evidence: The authenticated weekly action queue recommends an
  internal-link refresh after the target reached 1 click and 44 impressions.
  Read-only URL Inspection reports `Crawled - currently not indexed`; stable
  provenance, project-scope, and readable-artifact owners each expose a clean
  contextual gap. Full source-native evidence, coverage exclusions, product
  proof, and rendered evidence are preserved in
  `docs/seo-audits/2026-08-13-ai-knowledge-base-context-links-prelaunch.md`.
- Baseline: GSC `2026-07-25..2026-08-12` reports the target at 1 click, 44
  impressions, 2.27% CTR, and page-average position 10.0. The only
  privacy-visible joined query is `knowledge db` with one impression at
  position 81 and does not reveal the clicked query. Vercel separately
  reports 4 visitors and 4 pageviews. GitHub reports 47 stars; Umami CTA
  evidence and a source-to-star path are unavailable.
- Change: Add `ai-work-memory-vs-knowledge-base` to `relatedSlugs` for exactly
  `/learn/ai-memory-provenance`, `/learn/project-scope-ai-memory`, and
  `/learn/markdown-local-index-ai-memory`. Change no target or source copy,
  dates, metadata, canonical, schema, sitemap entry, or locale route.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions in the first 28 complete
  post-deploy days.
- Success criteria: after at least 20 target-page impressions, the target
  earns at least 2 clicks or page-average position is 8.0 or better.
- Failure criteria: after 28 complete post-deploy days and at least 20
  impressions, the target remains at 1 or fewer clicks and page-average
  position is worse than 10.0.
- Inconclusive: fewer than 20 target-page impressions in the first 28 complete
  post-deploy days.
- Stop criteria: another controller edits the target or any of the three
  source pages, or a link, direct-200, canonical, indexability, sitemap,
  schema, related-card render, or locale regression appears. Source-backed,
  document-guide, tool-selection, Knowledge Graph, and LLM Wiki measurement
  surfaces must remain unchanged.
- 24h readout: pending after production completion.
- 7d readout: pending after production completion plus seven days.
- W2 readout: pending after production completion plus fourteen days.
- W4 readout: pending after production completion plus twenty-eight days.
- W8 readout: pending after production completion plus fifty-six days if
  useful.
- Result: pending
- Decision: wait
- Next step: publish the exact approved branch, keep the production slot
  occupied until Vercel and live verification pass, and do not request
  indexing or submit GSC validation.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-14T05:24:28Z — AI knowledge-base contextual-link publication approval

- Record type: campaign-approval
- Related experiment: EXP-2026-08-13-ai-knowledge-base-context-links
- Status: active
- Approved scope: commit, push, ready PR creation, merge, automatic Vercel
  deployment, and read-only production verification for the exact
  `codex/ai-knowledge-base-context-links` candidate. The candidate contains
  only three English contextual related-article links, the focused regression
  test, immutable candidate audit, and required campaign records.
- Excluded actions: request indexing, GSC validation, external publication,
  paid action, synthetic events, analytics mutation, and metric changes.
- Decision: publish the exact locally verified scope and keep the production
  slot occupied until Vercel deployment and live checks pass.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-13-ai-knowledge-base-context-links production verification

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-13-ai-knowledge-base-context-links
- Observed at: 2026-08-14T05:46:09Z
- Readout: correction
- Status: measuring
- Evidence: PR #128 squash-merged at `2026-08-14T05:41:10Z` as
  `764649dbeae42684e33d0d1cc8a151be438d98b6`; Vercel Production deployment
  `CjgnT33d3KWotANpYXSf479Gruve` completed successfully at
  `2026-08-14T05:41:58Z`. The deployed technical checker passed 120 sitemap
  URLs, 24 key pages, six utility noindex headers, sitemap-wide `FAQPage`
  absence, 25 redirects, six bridge-host redirects, and old-URL exclusion.
  Each of the three live English sources and the unchanged target return
  direct 200 with exact self-canonical, `index, follow`, Article and
  BreadcrumbList schema, sitemap membership, no `FAQPage`, and unchanged
  dates. Each source exposes exactly one target link. Fresh exact 393px and
  1440px Chrome renders have no document overflow, broken image, console
  warning, or console error. The zh-TW and zh-CN Learn hubs remain direct 200;
  the six unsupported localized source routes remain direct 404.
- Publish date: 2026-08-14T05:41:58Z
- Index date: unavailable; no indexing request or crawl inference was made.
- Result: pending
- Decision: wait
- Next step: use `2026-08-14T05:41:58Z` as the fixed production and
  measurement boundary. Run the 24-hour technical and source-native readout
  only after `2026-08-15T05:41:58Z`, and the seven-day readout only after
  `2026-08-21T05:41:58Z`. Do not infer a Google crawl, indexing effect,
  impressions, clicks, traffic lift, or causality from deployment, and do not
  request indexing or submit validation.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-11-llm-wiki-schema-template-refresh 24h at 2026-08-14T06:05:19Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-11-llm-wiki-schema-template-refresh
- Observed at: 2026-08-14T06:05:19Z
- Readout: 24h
- Status: measuring
- Evidence: The latest separate inter-window capture covers the 28 complete
  dates `2026-07-16..2026-08-12`, which end before Vercel Production
  completion at `2026-08-13T05:22:32Z`. GSC property totals are 8 clicks and
  958 impressions; visible-query totals are 3 clicks and 208 impressions;
  the visibility gap is 5 clicks and 750 impressions. The English, zh-TW,
  and zh-CN target-page rows are independently 0 clicks/8 impressions at
  page-average position 11.3, 0/1 at 8.0, and 0/4 at 18.5. The only visible
  qualified join is English `llm wiki for codebase` with one impression at
  position 7; it remains below the configured three-impression routing floor
  and is not a schema/template-query result. These rows are pre-deploy or
  mixed rolling-window evidence and do not satisfy the independent
  post-crawl 10-impression locale guards.
- Technical evidence: The deployed technical audit passes 120 sitemap URLs,
  24 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence,
  25 redirects, six bridge-host redirects, and old-URL exclusion. All three
  live routes return direct 200 with exact self-canonicals, `index, follow`,
  reciprocal `en-US`, `zh-TW`, `zh-CN`, and `x-default` alternates, Article
  and BreadcrumbList schema, stable English `datePublished: 2026-06-24`,
  stable Mandarin `datePublished: 2026-07-04`, and
  `dateModified: 2026-08-12`. The starter-schema and acceptance-test sections,
  maintained references, and five visible FAQs remain present without
  `FAQPage`.
- Indexing evidence: Read-only URL Inspection reports all three canonicals
  submitted and indexed, fetch successful, indexing allowed, and exact
  matching Google and user canonicals. Last crawls remain
  `2026-07-29T01:09:29Z` for English, `2026-07-29T01:10:28Z` for zh-TW, and
  `2026-08-01T22:01:38Z` for zh-CN, all before this deployment. No indexing
  request or validation was submitted.
- Vercel evidence: The same complete pre-deploy range reports 1,339 raw
  visitors and 1,773 pageviews, 234 direct visitors and 545 direct pageviews,
  and a non-deduplicated search-referrer row sum of 1,107 visitors and 1,229
  pageviews. Unique acquisition-surface visitors remain unavailable. Target
  rows remain separate at English 10 visitors/15 pageviews, zh-TW 6/10, and
  zh-CN 16/21; no authenticated qualified source-to-target row was returned.
  Umami remains unavailable/account-gated. GitHub public REST reports 47
  stars.
- Result: inconclusive
- Decision: wait
- Next step: Keep all three canonicals unchanged. Run the seven-day readout
  only after `2026-08-20T05:22:32Z`, using complete post-deploy performance
  dates and the original independent 10-impression plus confirmed-crawl guard.
  Do not pool locales, convert missing rows to zero, infer exact-query rank,
  source-to-page sessions, indexing effect, causality, or SEO success, and do
  not repeat indexing requests or submit validation.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-13-ai-agent-knowledge-graph-refresh 24h at 2026-08-14T06:43:56Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-13-ai-agent-knowledge-graph-refresh
- Observed at: 2026-08-14T06:43:56Z
- Readout: 24h
- Status: stopped
- Evidence: The latest separate authenticated performance capture covers the
  28 complete dates `2026-07-16..2026-08-12`, which end before Vercel
  Production completion at `2026-08-13T06:39:50Z`. GSC property totals are 8
  clicks and 958 impressions; visible-query totals are 3 clicks and 208
  impressions; the query visibility gap is 5 clicks and 750 impressions. The
  target page and its qualified AI-agent knowledge-graph joins are absent from
  the returned rows and remain unavailable rather than zero. The original
  10-impression exposure guard is therefore unmet.
- Indexing evidence: Read-only GSC URL Inspection reports `PASS`, submitted
  and indexed, indexing allowed, successful mobile fetch, and exact matching
  Google and user canonicals. The last crawl remains
  `2026-07-16T09:43:37Z`, before deployment. No indexing request or validation
  was submitted.
- Technical evidence: The deployed checker passes 120 sitemap URLs, 24 key
  pages, six utility noindex headers, sitemap-wide `FAQPage` absence, 25
  redirects, six bridge-host redirects, and old-URL exclusion. The target
  returns direct 200 with exact canonical, `index, follow`, TechArticle and
  BreadcrumbList schema, maintained-source links, the source-backed quick
  answer, and sitemap membership. The unsupported zh-TW and zh-CN detail
  routes remain direct 404. However, the refresh changed the record from the
  previous `updatedAt: 2026-07-09` fallback to `updatedAt: 2026-08-13`
  without preserving `publishedAt`. Live TechArticle schema now emits both
  `datePublished` and `dateModified` as `2026-08-13`, violating the declared
  stable-publication-date floor.
- Vercel evidence: The same complete pre-deploy range reports 1,339 raw
  visitors and 1,773 pageviews, 234 direct visitors and 545 direct pageviews,
  and a non-deduplicated search-referrer row sum of 1,107 visitors and 1,228
  pageviews. The target has 2 visitors and 2 pageviews; no authenticated
  qualified source-to-target row was returned. Unique acquisition-surface
  visitors remain unavailable. Umami remains unavailable/account-gated.
  GitHub public REST reports 47 stars.
- Result: failure
- Decision: stop
- Next step: restore the stable `datePublished: 2026-07-09` with an explicit
  `publishedAt` field while keeping `dateModified: 2026-08-13`, add a focused
  regression assertion, and run the complete local technical gate. Publishing
  the correction still requires explicit approval; do not request indexing,
  submit validation, or infer SEO performance from the pre-deploy evidence.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-14T06:51:40Z — Knowledge Graph published-date correction local verification

- Record type: campaign-observation
- Related experiment: EXP-2026-08-13-ai-agent-knowledge-graph-refresh
- Related correction: TECH-2026-08-14-knowledge-graph-published-date
- Status: locally verified; publication approval required
- Evidence: The focused RED control failed because the existing record lacked
  `publishedAt`. The correction explicitly restores `publishedAt: 2026-07-09`
  while retaining `updatedAt: 2026-08-13`; the focused test then passed. The
  complete SEO suite passes 223/223 with explicit sibling source roots;
  TypeScript, Goal verifier, diff hygiene, the 223-page production build, and
  the built technical audit pass. Built HTML emits the exact self-canonical,
  `index, follow`, one TechArticle with `datePublished: 2026-07-09` and
  `dateModified: 2026-08-13`, and no `FAQPage`.
- Decision: wait for explicit publication approval.
- Excluded actions: no commit, push, PR, merge, deployment, request indexing,
  GSC validation, external publication, analytics mutation, paid action, or
  synthetic event occurred.

### 2026-08-14T06:57:39Z — authenticated inter-window evidence

- Record type: campaign-observation
- Data window: `2026-07-17..2026-08-13`
- GSC evidence: `sc-domain:wenlan.app` reports 8 property clicks and 951
  property impressions. The visible query table reports 3 clicks and 208
  impressions, leaving a 5-click and 743-impression visibility gap. The
  English Learn hub has 0 clicks and 129 impressions; the existing MCP page
  has 0/24; the English Obsidian page has 0/16; the source-backed article has
  0/9; and the LLM Wiki page has 0/8. The knowledge-graph target has no
  returned GSC page row and remains unavailable rather than zero. The only
  visible protected acquisition phrases are individually sparse: `ai memory
  mcp persistent context llm` at 2 impressions, plus `llm wiki for codebase`,
  `local ai knowledge base`, `obsidian 筆記`, and
  `stevenstavrakis/obsidian-mcp` at 1 impression each.
- Vercel evidence: the aligned range reports 1,268 raw visitors and 1,785
  pageviews, 234 direct visitors and 628 direct pageviews, and a
  non-deduplicated qualified source-to-page row sum of 1,078 visitors and
  1,156 pageviews. The knowledge-graph target has 3 visitors and 11
  pageviews; the comparison target has 5/5. No qualified source-to-target row
  was returned for either page, and unique acquisition-surface visitors
  remain unavailable. Custom events remain account-gated.
- Other evidence: GitHub remains 47 stars. Umami remains unavailable without
  a paid account and is not substituted by Vercel page aggregates.
- Decision: the newest rolling window is weaker than the preceding
  inter-window capture because older dates leave faster than the newest date
  replaces them. This is not a daily-loss, CTA, source-to-page, or causal
  result. No new privacy-visible cluster passes the candidate gate. Publish
  the locally verified Knowledge Graph date correction after explicit
  approval, then reassess the already prepared MCP candidate; do not stack a
  new page rewrite from hidden-query impressions.
- Excluded actions: no website edit from this evidence, indexing request,
  validation, external publication, paid action, synthetic event, analytics
  mutation, or metric change occurred.

### 2026-08-14T07:06:01Z — OSS and free-directory exposure reconciliation

- Record type: campaign-observation
- OSS acceptance evidence: `TensorBlock/awesome-mcp-servers` PR #1500 merged
  at `2026-08-03T00:09:13Z` as
  `5baf490be39676ed39b92e0eef98ed290113684a`. Its current default-branch
  knowledge-management file contains the exact
  `https://github.com/7xuanlu/wenlan` link and describes Wenlan as a local-first
  AI knowledge base and LLM wiki. The approved OSS batch therefore has three
  merged listings rather than two.
- Remaining PR evidence: eleven directory PRs remain open and all eleven
  report `MERGEABLE`. `ComposioHQ/awesome-claude-skills` PR #852 explicitly
  requires maintainer review. `DhanushNehru/awesome-mcp-servers` PR #52 still
  has one failing whole-repository link check previously traced to unrelated
  upstream URLs; its other link check passes. No maintainer review or comment
  requests an author-side correction on any of the eleven PRs.
- Free-directory evidence: the previously pending `mcpservers.org` submission
  ID `5334` is publicly live at
  `https://mcpservers.org/servers/7xuanlu/wenlan`. A direct read returned HTTP
  200. The page is not marked `noindex`, links to both the Wenlan GitHub
  repository and `https://wenlan.app`, and contains the approved `AI knowledge
  base` and `LLM wiki` wording. The public server sitemap includes the exact
  listing URL with `lastmod` `2026-08-13T06:35:37.000Z`.
- Goal evidence: GitHub public REST still reports 47 stars. Listing and PR
  state are exposure surfaces only; they are not GSC impressions, Vercel
  visitors, stars, or evidence of causality.
- Decision: keep the eleven mergeable PRs in passive maintainer review, count
  the three merged OSS listings and the separate live free-directory page in
  their own native units, and do not push no-op commits, contact maintainers,
  resubmit ID `5334`, or select Premium.
- Excluded actions: no website edit, commit, push, PR creation, external
  message, directory resubmission, paid action, indexing request, GSC
  validation, analytics mutation, synthetic event, or metric change occurred.

### 2026-08-15T00:20:38Z — Knowledge Graph published-date correction publication approval

- Record type: campaign-observation
- Related experiment: EXP-2026-08-13-ai-agent-knowledge-graph-refresh
- Related correction: TECH-2026-08-14-knowledge-graph-published-date
- Status: approved; occupies the single website production slot
- Approved scope: commit, push, ready PR creation, merge, automatic Vercel
  deployment, and read-only production verification for the exact
  `codex/knowledge-graph-published-date-fix` candidate. The correction restores
  only `publishedAt: 2026-07-09` on the existing English
  `/docs/knowledge-graph` record, retains `updatedAt: 2026-08-13`, adds the
  focused regression guard and immutable correction audit, and includes the
  required campaign records.
- Excluded actions: request indexing, GSC validation, external publication,
  paid action, synthetic events, analytics mutation, and metric changes remain
  outside this approval.
- Decision: publish the exact locally verified scope and keep the production
  slot occupied until the merged Vercel Production deployment and live
  read-only verification pass.

### 2026-08-15T00:25:58Z — Knowledge Graph published-date correction production verification

- Record type: campaign-observation
- Related experiment: EXP-2026-08-13-ai-agent-knowledge-graph-refresh
- Related correction: TECH-2026-08-14-knowledge-graph-published-date
- Status: production-verified; production slot open
- GitHub evidence: PR #130 squash-merged at `2026-08-15T00:23:03Z` as
  `3f2eeb9aabb40213f0526e571e66bb29788988a2`.
- Vercel evidence: Production deployment
  `dpl_GPLMqStz21H724odWXZv8jQZMRQE` targets the exact merge commit and entered
  `READY` at `2026-08-15T00:23:48.475Z`. The production URL is aliased to
  `wenlan.app`, `www.wenlan.app`, and the two approved legacy bridge hosts.
- Deployed technical evidence: `pnpm seo:technical:deployed` passes robots,
  120 sitemap URLs, 24 key pages, six utility noindex headers, sitemap-wide
  `FAQPage` absence, 25 redirects, six bridge-host redirects, and old-URL
  exclusion. The English target returns direct 200; the unsupported zh-TW and
  zh-CN detail routes remain direct 404; the sitemap returns direct 200 and
  contains the exact target once.
- Exact page evidence: `/docs/knowledge-graph` retains its exact self-canonical,
  `index, follow`, visible `AI Agent Knowledge Graph` title, source-backed quick
  answer and source-authority boundary, TechArticle and BreadcrumbList schema,
  `datePublished: 2026-07-09`, `dateModified: 2026-08-13`, and no `FAQPage`.
- Result: pass. This closes the technical regression only; it does not prove a
  Google crawl, indexing effect, impression or click lift, visitor change,
  star change, or causality.
- Decision: close the correction and release the single website production
  slot. Keep the stopped experiment's original performance result separate;
  reassess the prepared MCP knowledge-base-server candidate before another
  publication decision.
- Excluded actions: no request indexing, GSC validation, external publication,
  paid action, synthetic event, analytics mutation, or metric change occurred.

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-13-mcp-knowledge-base-server-refresh

- Record type: experiment-start
- Experiment ID: EXP-2026-08-13-mcp-knowledge-base-server-refresh
- Status: active
- Data window: 2026-08-08..2026-08-14
- Asset class: refresh
- Launched: 2026-08-13
- Hypothesis: Reframing the existing indexed MCP page around the repeated
  `MCP knowledge base server` task, while answering memory-server intent as a
  comparison, will improve qualified discovery without creating a competing
  canonical.
- Candidate evidence: Official MCP concepts say servers expose tools,
  resources, and prompts and can provide knowledge-base resources. Maintained
  packages and integrations explicitly use `MCP Knowledge Base Server`, while
  independent user discussions repeat shared documents, coding standards,
  citations, source sync, and cross-client access. Wenlan `v0.15.8` proves a
  source-backed knowledge base, provenance, maintained Pages, citations,
  refresh, review, local MCP, Streamable HTTP MCP, and supported client setup.
  Full provenance and exclusions are in
  `docs/seo-audits/2026-08-13-mcp-knowledge-base-server-coverage-gate.md`.
- Baseline: GSC property totals are 8 clicks and 958 impressions; visible-query
  totals are 3 clicks and 208 impressions; the visibility gap is 5 clicks and
  750 impressions. The target has 0 clicks, 24 impressions, and page-average
  position 7.2. Its six privacy-visible joined impressions are unrelated or
  branded; the other 18 impressions are hidden and their intent is not
  inferred. Read-only URL Inspection reports submitted and indexed, exact
  canonicals, successful fetch, and last crawl `2026-08-10T00:37:43Z`.
  Vercel separately reports 293 visitors and 296 pageviews; the 285-visitor
  `google.com` source-to-target row is preserved as possibly automated or
  referrer-incompatible, not human search traffic. GitHub reports 47 stars;
  Umami remains unavailable.
- Change: Keep `/learn/mcp-memory-server` and make `MCP knowledge base server`
  the primary H1, snippet, and first answer. Add the memory-versus-knowledge-
  base distinction, source/citation/freshness contract, a four-step MCP
  validation loop, source-backed related paths, and maintained references.
  Preserve `datePublished: 2026-06-07`, move `dateModified` to `2026-08-13`,
  and create no URL or locale route.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 15 GSC target-page impressions after a confirmed
  post-deploy Google crawl.
- Success criteria: after both guards, at least 1 target-page click or at least
  5 privacy-visible qualified `MCP knowledge base server`, `MCP knowledge
  server`, or tool-qualified MCP knowledge-base impressions on this canonical,
  with technical floors green.
- Failure criteria: after 28 complete post-deploy days and both guards, 0
  target clicks and no qualified visible query reaches 5 impressions, or any
  technical, source, product-truth, or render regression occurs.
- Inconclusive: either guard is unmet within the first 28 complete post-deploy
  days.
- Stop criteria: another controller edits this canonical, product truth
  changes, or the page implies MCP itself supplies provenance or freshness.
- 24h readout: pending after production completion.
- 7d readout: pending after production completion plus seven days.
- W2 readout: pending after production completion plus fourteen days.
- W4 readout: pending after production completion plus twenty-eight days.
- W8 readout: pending after production completion plus fifty-six days if
  useful.
- Result: pending
- Decision: refresh
- Next step: complete deterministic, build, technical, and rendered checks;
  then stop for explicit publication approval. Do not request indexing or
  submit GSC validation.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-14T06:32:15Z — MCP knowledge-base server local verification

- Record type: campaign-observation
- Related experiment: EXP-2026-08-13-mcp-knowledge-base-server-refresh
- Status: active; locally verified; publication approval required
- Evidence: The focused RED control failed on the previous copy and passes
  after the refresh. Both the new knowledge-base contract and preserved MCP
  shared-memory contract pass. The complete SEO suite passes 224/224;
  TypeScript, the Goal verifier, diff hygiene, a 223-page production build,
  and the built technical audit pass. Fresh exact 393px and 1440px local
  production renders cover the complete route without overflow, clipping,
  broken images, console warnings, or console errors. Article and
  BreadcrumbList remain present, `FAQPage` remains absent, and all three
  visible FAQ rows expand to their complete answer.
- Decision: wait for explicit publication approval.
- Excluded actions: no commit, push, PR, merge, deployment, indexing request,
  GSC validation, external publication, analytics mutation, paid action, or
  synthetic event occurred.

### 2026-08-15T00:34:51Z — MCP publication-date regression caught locally

- Record type: campaign-observation
- Related experiment: EXP-2026-08-13-mcp-knowledge-base-server-refresh
- Status: active; local correction required before publication
- Evidence: current production emits `datePublished: 2026-06-07`. The rebased
  local build initially emitted both `datePublished` and `dateModified` as
  `2026-08-13` because the candidate changed `updatedAt` without pinning
  `publishedAt`. A focused assertion for `publishedAt: 2026-06-07` failed
  against that candidate before the correction.
- Decision: pin `publishedAt: 2026-06-07`, retain
  `updatedAt: 2026-08-13`, rerun the complete gates, and inspect compiled
  schema dates. This correction remains inside the same unpublished candidate.
- Excluded actions: no commit, push, PR, merge, deployment, indexing request,
  GSC validation, external publication, analytics mutation, paid action, or
  synthetic event occurred.

### 2026-08-15T00:34:51Z — MCP candidate Friday-evidence reassessment

- Record type: campaign-observation
- Related experiment: EXP-2026-08-13-mcp-knowledge-base-server-refresh
- Status: active; locally prepared; publication approval required
- GSC evidence: the completed `2026-08-14` weekly report covers
  `2026-07-17..2026-08-13` and reports 8 property clicks and 951 property
  impressions, 3 visible-query clicks and 208 visible-query impressions, and
  a 5-click plus 743-impression visibility gap. The target remains at
  0 clicks, 24 impressions, and page-average position 7.2. The deterministic
  page queue says `wait`; no visible row proves exact MCP knowledge-base
  intent, and hidden target queries remain uninterpreted.
- Vercel evidence: the same aligned range separately reports 240 target
  visitors and 243 pageviews, including a `google.com` source-to-target row
  of 232 visitors and 234 pageviews. The known referrer/device anomaly keeps
  these as raw, possibly automated or referrer-incompatible observations, not
  confirmed human search sessions or candidate-demand evidence.
- Candidate-gate decision: retain the candidate. Official MCP documentation,
  maintained knowledge-base implementations, independent repeated user
  problems, the clean existing-page owner, maintained Wenlan proof, and the
  standalone validation loop still pass all five external-evidence gates.
  This is not a GSC exact-query claim, a second URL, or a locale expansion.
- Next step: rerun the deterministic, TypeScript, build, and built technical
  gates on the rebased current-main candidate, then stop for explicit commit,
  push, PR, merge, automatic Vercel deployment, and read-only production
  verification approval.
- Excluded actions: no commit, push, PR, merge, deployment, indexing request,
  GSC validation, external publication, analytics mutation, paid action, or
  synthetic event occurred.

### 2026-08-15T00:47:26Z — MCP current-main verification after date correction

- Record type: campaign-observation
- Related experiment: EXP-2026-08-13-mcp-knowledge-base-server-refresh
- Status: active; locally verified; publication approval required
- Evidence: The candidate is rebased onto current `origin/main`. The focused
  publication-date assertion first failed against the regressed candidate and
  now passes with `publishedAt: 2026-06-07` and
  `updatedAt: 2026-08-13`. Compiled metadata preserves the original published
  date and emits `dateModified: 2026-08-13`. The Goal verifier passes; the
  complete SEO suite passes 224/224; TypeScript passes; the production build
  emits 223/223 pages; and the built technical audit passes. Fresh complete
  production renders at 393x852 and 1440x1000 show no horizontal overflow,
  clipping, broken images, console warnings, or console errors, with all three
  visible FAQ answers expanded. Canonical and indexability remain exact,
  Article and BreadcrumbList remain present, and `FAQPage` remains absent.
- Decision: candidate is ready for an explicit publication decision.
- Excluded actions: no commit, push, PR, merge, deployment, indexing request,
  GSC validation, external publication, analytics mutation, paid action, or
  synthetic event occurred.

### 2026-08-15T05:53:43Z — MCP publication scope approved

- Record type: campaign-observation
- Related experiment: EXP-2026-08-13-mcp-knowledge-base-server-refresh
- Status: approved; publication in progress
- Approval: The user explicitly approved commit, push, ready PR creation,
  merge, automatic Vercel deployment, and read-only production verification
  for the exact `codex/mcp-knowledge-base-server-refresh` candidate.
- Included scope: the existing English `/learn/mcp-memory-server` refresh,
  stable `datePublished: 2026-06-07`, `dateModified: 2026-08-13`, focused
  regression coverage, the immutable candidate audit, and required campaign
  records. No URL or locale route is created.
- Excluded actions: request indexing, GSC validation, external publication,
  paid action, synthetic events, analytics mutation, and metric changes remain
  unapproved.
- Next step: commit, push, open a ready PR, merge after checks, wait for the
  automatic Vercel production deployment, and perform read-only live
  verification before releasing the production slot.

### 2026-08-15T05:59:42Z — MCP production verification

- Record type: campaign-observation
- Related experiment: EXP-2026-08-13-mcp-knowledge-base-server-refresh
- Status: production-verified; measuring
- Publication: PR #132 squash-merged at `2026-08-15T05:56:07Z` as
  `44b0ad40275554c65444a7941e7c5038d02b7ece`. Vercel Production deployment
  `3zcJXN1enGp3w3GQKVTd7KP3kTCm` completed at
  `2026-08-15T05:56:51Z`; that time is the fixed measurement boundary.
- Technical evidence: the deployed technical audit passes 120 sitemap URLs,
  24 key pages, six utility noindex headers, sitemap-wide `FAQPage` absence,
  25 redirects, six bridge-host redirects, and old-URL exclusion. The target
  returns direct HTTP 200 with exact canonical
  `https://wenlan.app/learn/mcp-memory-server`, `index, follow`, Article and
  BreadcrumbList schema, stable `datePublished: 2026-06-07`,
  `dateModified: 2026-08-13`, and exactly one sitemap `<loc>` entry.
- Content evidence: the production page exposes the exact MCP knowledge-base
  title and first answer, memory-server comparison, source/citation/freshness
  contract, four-step validation loop, maintained references, and three
  visible FAQs without `FAQPage`.
- Render evidence: fresh production renders at exact 393x852 and 1440x1000
  have matching document and body client/scroll widths, no horizontal
  overflow, zero broken images, zero console warnings or errors, and all three
  FAQ answers open. Direct inspection found no clipping or missing content.
- Result: pending
- Decision: measure
- Next step: run the 24-hour technical and source-native readout only after
  `2026-08-16T05:56:51Z`, retaining the original 15-target-impression plus
  confirmed post-deploy-crawl guards. Run the seven-day readout only after
  `2026-08-22T05:56:51Z`. Do not infer a crawl, indexing effect, exact-query
  rank, source-to-page sessions, causality, or SEO success from publication.
- Excluded actions: no indexing request, GSC validation, external publication,
  paid action, synthetic event, analytics mutation, or metric change occurred.
<!-- EXPERIMENTS-APPEND-ONLY-BASELINE-SHA256:637df82ff50bf214692d6bc9b3b391b625263148dd173f543a5579b68b252403 -->

## Campaign observation: fixed final window at 2026-08-21T04:28:22Z

- Record type: campaign-observation
- Related experiment: none; this is the terminal read of the original fixed
  campaign window and does not start another experiment.
- Evidence: authenticated Search Console API, Vercel Web Analytics API,
  GitHub REST plus timestamped public stargazer evidence, and the deterministic
  report at `/tmp/wenlan-seo-final-2026-08-18/final-window-seo.md`.
- Fixed range: `2026-07-21..2026-08-17`; reporting latency delayed the read
  but did not move the range.
- GSC property evidence: 9 clicks, 1,024 impressions, 0.88% CTR, and 15.5
  property-average position. Visible-query rows separately report 3 clicks
  and 222 impressions, leaving a 6-click and 802-impression visibility gap.
- Core query evidence: the exact privacy-visible `llm wiki`,
  `llm wiki for codebase`, and `local ai knowledge base` rows total 0 clicks
  and 3 impressions. This is not a complete non-brand total.
- Vercel evidence: 605 raw visitors and 1,026 pageviews; direct reports 219
  visitors and 615 pageviews; `google.com` reports 383 visitors and 406
  pageviews. AI referrals, Reddit referrals, and `llms.txt` hits are zero.
  Custom CTA events remain account-gated.
- GitHub evidence: timestamped stargazer evidence reports 47 stars at the
  2026-08-18 deadline; REST reports 48 at the later final read. The fixed
  deadline value is 47.
- Result: failure. The campaign missed 91 clicks, 8,976 impressions, 1,395
  Vercel visitors, and 53 stars at the protected deadline and window.
- Decision: stop the original campaign under its deadline stop condition.
  Preserve the final metrics and do not move its window or redefine success.
- Excluded actions: no website edit, push, PR, merge, deployment, indexing
  request, GSC validation, external publication, paid action, synthetic event,
  analytics mutation, or metric-definition change occurred.

## Campaign correction: authority-first execution at 2026-08-21T04:28:22Z

- Record type: campaign-correction
- Approval: the user explicitly instructed the controller to modify the Goal
  from the root-cause finding and not repeat work in ineffective directions.
- Objective: establish qualified non-brand query ownership and inspectable
  external authority for the protected AI knowledge-base and LLM-wiki cluster.
- Non-progress outputs: article count, indexed-page count, technical passes,
  indexing requests, open directory pull requests, and raw Vercel visitors.
- Existing-page gate: confirmed post-deploy Google crawl, at least 20
  target-page impressions in one complete 28-day GSC range, and at least 3
  joined qualified visible impressions before another SEO content, title,
  metadata, or internal-link experiment.
- Net-new gate: full candidate gate, no existing query owner, locale-specific
  evidence for translations, and one predeclared authority or distribution
  path.
- Cooldown: do not edit the same canonical again until 28 complete days after
  a confirmed post-deploy crawl, except for factual or technical corrections.
- Stop rule: two consecutive below-exposure website experiments stop the
  on-page lane; the next action must build inspectable authority or wait.
- Next step: update the deterministic Goal verifier and weekly action queue so
  sparse page rows cannot silently re-enable the old strategy. Do not invent a
  new numeric deadline or target.

## Campaign observation: authority-path reconciliation at 2026-08-21T04:43:02Z

- Record type: campaign-observation
- Related experiment: none; this is read-only post-campaign authority
  preparation and does not restart the stopped campaign.
- Existing attempts: twelve of the thirteen directory PRs recorded on
  2026-08-12 remain open with no new merge. `tolkonepiu/best-of-mcp-servers#225`
  was closed on 2026-08-18 because Wenlan did not meet that catalog's 50-star
  threshold. An open PR remains attempted distribution rather than authority.
- Selected candidate: Awesome Selfhosted is the only prepared next authority
  path. The rendered repository reports 314,007 stars, remains active, and
  merged recent additions through 2026-08-17. Wenlan now passes its four-month
  release-age gate, current maintenance, license, installation, category, and
  required duplicate checks.
- Candidate artifact:
  `docs/seo-audits/2026-08-20-awesome-selfhosted-authority-candidate.md`
  records the exact one-file `software/wenlan.yml` proposal and provenance.
- Risk: the repository rejects noncompliant machine-generated contributions,
  and a recent similar AI-tool submission received a maintainer rejection
  focused on generated tone and development style. Mechanical eligibility is
  not publication approval or likely acceptance.
- Decision: do not submit automatically. Ask the user to review the exact YAML
  and explicitly approve the one-file external PR. If approved, use only the
  upstream template and factual YAML without marketing prose or automated
  maintainer interaction.
- Excluded actions: no fork, branch, commit, push, PR, issue, comment,
  maintainer message, website change, deployment, indexing request, GSC
  validation, paid action, synthetic event, analytics mutation, or metric-
  definition change occurred.

## Campaign observation: Awesome Selfhosted local gate at 2026-08-21T04:47:45Z

- Record type: campaign-observation
- Related experiment: none; this is isolated local validation of the prepared
  authority candidate and does not restart the stopped campaign.
- Upstream base: current master
  `237fd410a7e9d8ba68a2cc7b4324ae604728e14b`, fetched into a temporary clone.
- Candidate scope: one untracked file, `software/wenlan.yml`, matching the
  reviewed audit artifact. No upstream or fork state was changed.
- Passing gates: upstream's pinned `hecat@1.6.0` toolchain installed;
  `make export_markdown` completed and rendered Wenlan under Knowledge
  Management Tools; `git diff --check` passed; no Wenlan lint finding was
  emitted.
- Failing gate: `make awesome_lint` failed on the existing `ZincSearch` entry
  because its source repository is now archived. Current master advanced to
  this metadata state after the last observed successful build, so a new PR
  would be expected to reproduce the unrelated whole-tree failure.
- Decision: do not submit yet and do not mix an unrelated ZincSearch fix into
  the Wenlan one-file contribution. After explicit publication approval,
  refetch current master and require the baseline plus candidate PR workflow
  to pass before any push.
- Excluded actions: no fork, branch, commit, push, PR, issue, comment,
  maintainer message, website change, deployment, indexing request, GSC
  validation, paid action, synthetic event, analytics mutation, or metric-
  definition change occurred.

## Campaign approval: successor authority-first campaign at 2026-08-21T08:24:29Z

- Record type: campaign-approval
- Contract status: approved by the user in this Codex task
- Deadline and final window: deadline `2026-09-21`; fixed final range
  `2026-08-24..2026-09-20`, with delayed reading allowed but no window move.
- Protected targets: GitHub total stars >=100; GSC property clicks >=100;
  GSC property impressions >=10,000; Vercel visitors >=2,000.
- Authenticated starting range: `2026-07-24..2026-08-20`.
- Starting GSC property totals: 8 clicks, 985 impressions, 0.81% CTR, and 16.5
  property-average position. Visible-query totals remain separate at 2 clicks
  and 212 impressions, leaving a 6-click and 773-impression visibility gap.
- Starting Vercel totals: 248 raw visitors and 646 pageviews. Referrers remain
  separate at 217 direct visitors, 30 `google.com`, 1 `cn.bing.com`, and 1
  DuckDuckGo; authenticated source-to-page rows are retained in
  `/tmp/wenlan-seo-successor-2026-08-21` without person-level attribution.
- Starting GitHub total: 48 stars from GitHub REST at
  `2026-08-21T08:23:54.719Z`.
- Deterministic report:
  `/tmp/wenlan-seo-successor-2026-08-21/successor-baseline.md`, fingerprint
  `sha256:c830faf477da514f59754da066223b6080c60a6da745b4482a9fe9abb5434fa4`.
- Execution correction: qualified non-brand query ownership and inspectable
  live or merged authority are the growth outcomes. The approved 20-page,
  3-joined-query, post-crawl, canonical-cooldown, and two-below-exposure stops
  remain protected; the starting report nominates no on-page action.
- Exact external approval: the user approved the one-file Awesome Selfhosted
  scope in
  `docs/seo-audits/2026-08-20-awesome-selfhosted-authority-candidate.md`,
  including fork, branch, commit, push, PR creation, and read-only result
  verification, only after current upstream plus candidate pass the upstream
  PR gate.
- Goal API state: `create_goal` rejected the successor because the prior
  blocked Goal remains unfinished; the old Goal cannot truthfully be marked
  complete. The repo contract is therefore protected while app-level Goal
  replacement remains user-controlled.
- Excluded actions: no other external publication, website deployment,
  request indexing, GSC validation, paid acquisition, synthetic event,
  analytics mutation, or metric-definition change is approved.

## Campaign observation: Awesome Selfhosted authority PR at 2026-08-22T04:11:12Z

- Record type: campaign-observation
- Related experiment: none; this is the approved authority-path publication,
  not a website or search-content experiment.
- Upstream gate: current `awesome-selfhosted/awesome-selfhosted-data` master
  `8d4c53ae49dd67b54447fb10da781fc681d78e04` plus the exact candidate passed
  `make awesome_lint`, `make export_markdown`, and `git diff --check` after
  upstream removed the stale ZincSearch entry that blocked the earlier read.
- Duplicate gate: repository content plus open and closed issue and pull-
  request searches for `Wenlan`, `wenlan.app`, and `7xuanlu/wenlan` found no
  prior submission.
- Publication: fork `7xuanlu/awesome-selfhosted-data`, branch
  `codex/add-wenlan`, commit
  `5db2d2953f342d0ea953f8bfe98dea3dc2e319ec`, and upstream PR
  `https://github.com/awesome-selfhosted/awesome-selfhosted-data/pull/2955`.
- Exact scope: one added file, `software/wenlan.yml`, with 11 additions and no
  deletions. The PR uses the unmodified upstream template with applicable
  boxes checked and contains no extra marketing prose.
- First result read: PR open, not draft, and mergeable; no review, comment, or
  status check was reported. Missing checks are unavailable, not passing.
- Decision: wait for maintainer review. An open PR is attempted distribution,
  not authority. Count authority only after merge and a rendered upstream
  listing with correct Wenlan website and source links.
- Excluded actions: no maintainer message, automated reply, unrelated upstream
  fix, website edit, deployment, indexing request, GSC validation, paid
  action, synthetic event, analytics mutation, or metric-definition change
  occurred.

## Campaign observation: directory PR conflict reconciliation at 2026-08-22T04:41:52Z

- Record type: campaign-observation
- Related experiment: none; this is read-only authority-path maintenance and
  local conflict preparation, not a website experiment.
- Source-native result: no remaining submitted directory PR merged.
  Awesome Selfhosted PR #2955 remains open and mergeable with no review,
  comment, or reported check. Eleven older PRs remain open and mergeable without
  an author-side request. `tolkonepiu/best-of-mcp-servers#225` remains closed
  on its documented 50-star threshold.
- Actionable blocker: `DhanushNehru/awesome-mcp-servers#52` is open but now
  conflicting. Current upstream keeps the correct `7xuanlu/wenlan` URL but
  still displays the legacy `Origin MCP` name and description.
- Local candidate: merge current upstream
  `31a75ed430ece9952da413ef81fe907780c45d46` into the existing
  `7xuanlu:update-wenlan-listing` branch and resolve the only content conflict
  in favor of the existing Wenlan line. The resulting comparison against
  upstream is exactly one README replacement, with no unrelated workflow or
  catalog change.
- Verification: `git diff --check` passed, the compared diff contains the
  single Origin-to-Wenlan replacement, and the Wenlan GitHub URL returned HTTP
  200.
- Decision: hold the local resolution for explicit commit-and-push approval.
  Do not create a new PR or message the maintainer. A repaired open PR remains
  attempted distribution, not authority.
- Excluded actions: no commit, push, PR mutation, maintainer message, website
  edit, deployment, indexing request, GSC validation, paid action, synthetic
  event, analytics mutation, or metric-definition change occurred.

## Campaign observation: directory PR conflict repair at 2026-08-22T04:46:49Z

- Record type: campaign-observation
- Related experiment: none; this is the explicitly approved maintenance of an
  existing distribution attempt, not a website experiment or new submission.
- Publication: merge commit
  `7247b2294e98f0556c5594915716513d6bf462d9` incorporates upstream main
  `31a75ed430ece9952da413ef81fe907780c45d46` and was pushed to
  `7xuanlu/dhanushnehru-awesome-mcp-servers:update-wenlan-listing`.
- Remote scope: `DhanushNehru/awesome-mcp-servers#52` now compares exactly one
  README replacement, from the legacy `Origin MCP` name and description to
  the factual `Wenlan MCP` entry. No upstream workflow or unrelated catalog
  change appears in the pull-request diff.
- Result: PR #52 is open, non-draft, and mergeable again. `hypersweep` passes.
  `lychee` fails on 16 whole-repository links reported as rejected HTTP 200
  responses; its failure list does not include `github.com/7xuanlu/wenlan`.
- Decision: wait for maintainer review. Do not repair the unrelated upstream
  checker in this PR or send an automated maintainer message. The open PR
  remains attempted distribution, not authority.
- Excluded actions: no new PR, maintainer message, website edit, deployment,
  indexing request, GSC validation, paid action, synthetic event, analytics
  mutation, or metric-definition change occurred.

## Campaign observation: authority PR check refresh at 2026-08-22T20:18:56Z

- Record type: campaign-observation
- Related experiment: none; this is a read-only source-native authority and
  GitHub-star refresh.
- Awesome Selfhosted: PR #2955 remains open, non-draft, and mergeable. Its
  `syntax-checks` workflow completed successfully at
  `2026-08-22T07:16:55Z`; no maintainer review, comment, or merge exists.
- Existing PR maintenance: `DhanushNehru/awesome-mcp-servers#52` remains open
  and mergeable with the exact one-file replacement. `hypersweep` passes and
  the previously reconciled unrelated whole-repository `lychee` failure
  remains unchanged.
- GitHub native unit: `7xuanlu/wenlan` reports 48 total stars, unchanged from
  the fixed successor starting observation. This is a point-in-time REST
  value, not an attributed result of either pull request.
- Weekly evidence boundary: no committed weekly SEO report newer than
  `2026-08-07` exists in this worktree. The authenticated successor capture
  ending `2026-08-20` remains the newer protected baseline; the old weekly
  action queue does not authorize an on-page change.
- Decision: keep both PRs stable and wait for maintainer state. Do not create
  a no-op update, maintainer message, new directory submission, or website
  experiment from unchanged star or stale weekly evidence.
- Excluded actions: no push, PR mutation, maintainer message, website edit,
  deployment, indexing request, GSC validation, paid action, synthetic event,
  analytics mutation, or metric-definition change occurred.

## Campaign correction: 2026-08-21 weekly evidence import at 2026-08-22

- Record type: campaign-correction and evidence observation.
- Correction: the `2026-08-21` weekly automation completed successfully in
  its isolated worktree. The preceding observation's statement that no newer
  weekly report existed described only this worktree and was not the campaign-
  wide state. The exact primary report is now imported unchanged at
  `docs/seo-audits/2026-08-21-weekly-seo.md`.
- Evidence range and fingerprint: authenticated `2026-07-24..2026-08-20`;
  `sha256:20b31bcecc2f92ee54f7808a04f6d2a5f406c171614e19c59ca77024e1b5b1b6`.
- GSC native units: property totals are 8 clicks and 1,005 impressions;
  visible-query totals are 2 clicks and 216 impressions; the visibility gap
  is 6 clicks and 789 impressions. Page-table impressions remain a separate
  1,663-impression aggregate and are not substituted for property impressions.
- Other native units: Vercel reports 248 visitors and 646 pageviews; GitHub
  reports 48 stars at `2026-08-21T16:03:11.543Z`. The fixed successor starting
  observation remains 8 clicks, 985 impressions, 248 visitors, and 48 stars;
  the later GSC backfill is an observation, not a baseline rewrite.
- Protected action read: no owner passes a clean post-crawl window with both
  20 page impressions and 3 joined qualified visible-query impressions.
  English LLM Wiki is 16/2, English Obsidian is 18/1, and the document
  knowledge-base guide is 7/1. `/learn` has 140 page impressions, but its
  three qualified impressions are split across three mismatched intents.
- Decision: no on-page or net-new article action. Keep the affected canonicals
  stable until the next clean comparison on `2026-08-28`; continue treating
  Awesome Selfhosted PR #2955 and Dhanush PR #52 as attempted distribution
  until source-native maintainer state changes.
- Excluded actions: no website edit, deployment, indexing request, GSC
  validation, paid action, synthetic event, analytics mutation, external
  publication, or metric-definition change occurred.

## Campaign approval: successor waiting work at 2026-08-22T20:55:14Z

- Record type: campaign-approval
- Contract status: approved by the user in this Codex task
- Approved work: trilingual demand reconnaissance; public GitHub conversion-
  path audit; source-native maintenance of the two current authority PRs plus
  research for at most one exact-fit high-authority candidate; and preparation
  of the `2026-08-28` native-unit decision matrix.
- Output boundary: evidence matrices, audit findings, and local candidate
  diffs only. These lanes are not website experiments and do not consume the
  production slot.
- Excluded actions: no website or README mutation, commit, push, PR, merge,
  deployment, external publication, directory submission, maintainer message,
  request indexing, GSC validation, paid acquisition, synthetic event,
  analytics mutation, or metric-definition change is approved by this record.

## Campaign observation: successor App Goal replacement attempt at 2026-08-22T20:55:14Z

- Record type: campaign-observation
- User direction: replace the app's stale `2026-08-18` Goal with the approved
  `2026-09-21` successor and preserve the approved waiting work against drift.
- Repository result: the waiting-work block is hash-protected in `PLAN.md`,
  this append-only approval record exists, and the deterministic verifier has
  a mutation test for both the work scope and approval record.
- App result: the old Goal is blocked, but `create_goal` returned
  `cannot create a new goal because this thread has an unfinished goal;
  complete the existing goal first.` The unmet historical Goal cannot be
  truthfully marked complete, and no supported tool can mutate its objective.
- Decision: keep executing the repository-protected successor. The user must
  clear or replace the old Goal through the app; after that state change,
  create the successor Goal with the exact protected 9/21 objective.
- Excluded actions: no metric, deadline, final window, website, README,
  external publication, indexing, validation, analytics, or paid state was
  changed to work around the Goal API limitation.

## Campaign observation: successor waiting-work initial audit at 2026-08-22

- Record type: campaign-observation
- Artifact: `docs/seo-audits/2026-08-22-successor-waiting-work-initial-audit.md`.
- Demand evidence: 96 Exa results across 12 English, zh-TW, zh-CN, and Reddit-
  aimed workstreams deduplicated to 81 URLs. Exa returned no exact Reddit URL
  for its Reddit-aimed searches; three domain-filtered retries supplied the
  retained Reddit evidence. No source is treated as GSC or keyword volume.
- Demand result: the repeated job is a maintained, source-backed AI knowledge
  base or LLM Wiki with ingest, query, lint, citations, stale-state, review,
  and source ownership. zh-CN adds explicit `Codex knowledge base` wording;
  generic memory, generic Obsidian workflow, and AI notes remain non-nominating.
- GitHub audit: the four localized public READMEs already provide a strong
  implementation-backed first screen and install path. They contain no literal
  star request, but that is only a candidate conversion gap. GitHub latest is
  `v0.16.0`, while the live homepage, download, and about surfaces render
  `v0.15.8`; this factual release drift is the first discrete repair candidate.
- Decision: no article, translation, metadata, internal-link, or README change.
  Keep current page owners stable to `2026-08-28`. Prepare the release-alignment
  proposal separately from any optional star CTA and request separate approval
  before changing or publishing it.
- Excluded actions: no website or README edit, commit, push, PR, merge,
  deployment, external publication, directory submission, maintainer message,
  indexing request, GSC validation, analytics mutation, paid action, synthetic
  event, or metric-definition change occurred.

## Campaign correction: successor App Goal activated at 2026-08-22T21:09:02Z

- Record type: campaign-correction
- User action: the user cleared the historical blocked Goal through the app.
- Precondition: `get_goal` returned `goal: null` and
  `pnpm seo:goal:check` passed before replacement.
- Result: `create_goal` created the exact protected `2026-09-21` successor
  objective with status `active`, zero initial token usage, and zero initial
  elapsed-time usage. It includes the fixed `2026-08-24..2026-09-20` final
  window, four independent numeric targets, fixed starting observations,
  post-crawl 20/3 gate, complete inherited quality and evidence contract, four
  approved waiting-work lanes, and all external-state approval boundaries.
- Correction to preceding observation: the Goal API limitation was resolved
  by the user's app state change; the repository contract and App Goal are now
  aligned. The prior failed attempt remains append-only history.
- Excluded actions: no metric, deadline, final window, website, README,
  external publication, indexing, validation, analytics, or paid state was
  changed during Goal replacement.

## Campaign observation: Awesome Mac authority candidate gate at 2026-08-22

- Record type: campaign-observation
- Related experiment: none; this is the one bounded new authority-path review
  allowed by the approved successor waiting work.
- Artifact:
  `docs/seo-audits/2026-08-22-awesome-mac-authority-gate.md`.
- Source-native state: `jaywcjlove/awesome-mac` reported 111,611 GitHub stars,
  `archived: false`, last push `2026-08-21T08:08:53Z`, default branch `master`,
  and license `CC0-1.0` at capture.
- Fit evidence: the current repository has both `AI Tools` and `Note-taking`
  categories. Recent merged third-party precedents include Loadout PR #2586,
  NoteGen PR #2462, and AQBot PR #2423; each changed the four required locale
  README files.
- Contribution gate: one useful, non-duplicate suggestion per PR; concise and
  alphabetized entry; English, simplified Chinese, Japanese, and Korean README
  synchronization required by the current contribution instructions.
- Duplicate check: current GitHub code search found no `Wenlan`, `wenlan.app`,
  or `7xuanlu/wenlan` match, and issue search found no Wenlan or
  `useorigin.app` PR.
- Decision: pass as the single researched successor candidate under `AI
  Tools`; stop additional directory discovery in this window. It remains a
  candidate, not submitted distribution or earned authority.
- Excluded actions: no fork, external-repository edit, commit, push, PR,
  maintainer message, website or README edit, deployment, indexing request,
  GSC validation, analytics mutation, paid action, synthetic event, or metric
  change occurred.

## Campaign observation: August 28 decision matrix prepared at 2026-08-22T21:16:21Z

- Record type: campaign-observation
- Related experiment: none; this is the approved waiting-period decision
  control, not a website experiment or performance readout.
- Artifact:
  `docs/seo-audits/2026-08-28-successor-decision-matrix.md`.
- Evidence boundary: the latest completed weekly report remains
  `docs/seo-audits/2026-08-21-weekly-seo.md` for
  `2026-07-24..2026-08-20`. Its values appear only as an explicitly labeled
  reference and do not pre-fill the August 28 observation.
- Prepared gate: the August 28 result must reuse the successfully completed
  weekly pipeline and separately preserve GSC property totals, visible-query
  totals, visibility gap, page rows, joined qualified rows, URL Inspection,
  Vercel aggregates, GitHub observations, and source-native authority state.
- Action rule: an existing-page change requires a post-deploy crawl, at least
  20 target-page impressions, at least 3 joined qualified visible impressions,
  the 28-complete-day crawl cooldown, owner alignment, and an open production
  slot. A net-new or translated asset still requires the complete candidate
  gate and a predeclared authority path.
- Decision: wait for the August 28 completed weekly evidence; do not turn
  pending or unavailable cells into zero or an on-page task.
- Excluded actions: no website, README, release, analytics, indexing,
  validation, external repository, paid, synthetic-event, or metric state was
  changed.

## Campaign observation: release alignment and star proposals at 2026-08-22T21:26:06Z

- Record type: campaign-observation; no website experiment was started.
- Artifact:
  `docs/seo-audits/2026-08-22-release-and-star-proposals.md`.
- Release evidence: GitHub's latest release is `v0.16.0`, published
  `2026-08-19T03:57:54Z`; the tagged app configuration is version `0.16.0`,
  and the release includes `Wenlan_0.16.0_x64-setup.exe` plus the separate
  `wenlan-windows-x64.zip` headless runtime. The tagged setup guide and four
  localized READMEs independently preserve those two Windows paths.
- Production evidence: rendered `https://wenlan.app/`, `/download`, and
  `/about` surfaces still expose `v0.15.8`; the about copy incorrectly says
  Windows has no desktop app. The same stale facts exist in checked
  `origin/main`, so this is a factual source and deployment correction
  candidate rather than an inferred SEO opportunity.
- Exact release proposal: update the release manifest to six website-linked
  assets; recommend the Windows desktop installer to unambiguous Windows x64
  browsers while retaining the headless ZIP; align English, zh-TW, zh-CN,
  docs, structured data, LLM-readable surfaces, OG version, and deterministic
  tests. Existing generic rendering components do not require redesign.
- Separate star proposal: add one localized request after the product screenshot
  proof in English, zh-Hant, zh-Hans, and Spanish READMEs. GitHub provides no
  native README-view-to-star funnel, so the hypothesis remains unproven and
  only total stars may be observed in their native unit.
- Decision: request separate implementation/publication approval for the
  factual v0.16.0 correction first. Keep the README CTA isolated for a later
  decision; neither proposal changes the August 28 SEO evidence gate.
- Excluded actions: no website, README, source repo, release, commit, push, PR,
  merge, deployment, external publication, indexing, validation, analytics,
  paid, synthetic-event, or metric state was changed.

## Campaign observation: exact v0.16.0 patch prepared at 2026-08-22T21:40:26Z

- Record type: campaign-observation; no website experiment was started.
- Artifact:
  `docs/seo-audits/2026-08-22-wenlan-v0.16.0-proposal.patch`.
- Base and identity: exact diff from `origin/main`
  `721b862cde31a767f58c58a46c9f734a1a660114`; SHA-256
  `6dce422661f86a6303c5445ae12fb5727bd2ecaa4a2c3625a39d65b6374a4f98`.
- Scope: 15 files, 150 insertions, 92 deletions. It adds the Windows x64
  desktop installer without removing the headless ZIP, aligns v0.16.0 facts
  across English, zh-TW, zh-CN, docs, structured data, LLM-readable surfaces,
  OG output, sitemap dates, recommendation logic, translation hashes, and
  deterministic contracts.
- Verification: `pnpm lint` passed; `pnpm test:i18n` passed 63/63;
  `pnpm test:seo` passed 224/224; `pnpm build` passed and generated 223 static
  pages; `pnpm seo:technical:built`, `git diff --check`, and reverse patch
  validation passed.
- Decision: keep the candidate unapplied until separate implementation and
  publication approval. It is a factual release correction, not an SEO or
  star-growth result, and does not change the August 28 decision gate.
- Excluded actions: no campaign website source, README, source repository,
  release, commit, push, PR, merge, deployment, external publication,
  indexing request, GSC validation, analytics mutation, paid action,
  synthetic event, or metric definition changed.

## Campaign observation: August 28 heartbeat scheduled at 2026-08-22T21:43:49Z

- Record type: campaign-control observation; no experiment was started.
- The existing heartbeat `wenlan-claude-memory-24h-readout` was updated in
  place, renamed `wenlan-successor-aug28-decision`, and retargeted to the main
  successor Goal task. Its next boundary is `2026-08-28T17:30:00Z`, safely
  after the Friday weekly SEO run.
- The prompt reuses the completed weekly pipeline, fills the fixed
  `2026-07-31..2026-08-27` decision matrix, preserves all source-native metric
  splits, checks the two named authority PRs once, and reapplies the protected
  crawl, 20-page-impression, 3-qualified-impression, cooldown, owner, and
  production-slot gates.
- Decision: stop immediate empty continuations and wait for the scheduled
  evidence boundary. The same heartbeat must update itself to the next due
  boundary after the August 28 read; no second automation may be created.
- Excluded actions: no website, README, release, directory, analytics,
  indexing, validation, paid, maintainer-message, or other external state was
  changed.


## Campaign correction: Goal blocked for bounded evidence wait at 2026-08-22T21:44:36Z

- Record type: campaign-control correction; no experiment was started or
  stopped.
- The same no-action condition repeated across more than three automatic Goal
  continuations after all four approved waiting-work lanes were complete.
  No new weekly evidence exists before August 28, no authority PR state change
  was plausible within minutes, and all website or publication actions still
  require separate approval.
- Decision: mark the App Goal `blocked` to stop empty immediate continuations.
  The successor contract, `2026-09-21` deadline, fixed final window, targets,
  baselines, and August 28 decision gate remain unchanged. The existing
  `wenlan-successor-aug28-decision` heartbeat remains active and points to this
  main task for `2026-08-28T17:30:00Z`.
- Excluded actions: no website, README, release, directory, analytics,
  indexing, validation, paid, maintainer-message, or other external state was
  changed.

## Campaign observation: v0.16.0 website release alignment published at 2026-08-23T03:10:12Z

- Record type: campaign-observation; this factual correction is not a search
  experiment and does not consume or reset the August 28 evidence gate.
- Approval boundary: the user approved the exact website correction through
  commit, push, PR, merge, automatic Vercel deployment, and production
  read-only verification. The four-language README star request remained
  excluded.
- Source result: branch `codex/wenlan-v0160-release-alignment` produced commit
  `cda3c7adc574a408ed5d40d3a5f182092dcf0e01`; 15 public-site and deterministic
  contract files changed by 153 insertions and 94 deletions. The final scope
  adds the Windows x64 desktop setup executable without removing the separate
  headless runtime ZIP, aligns v0.16.0 facts across English, zh-TW, zh-CN,
  structured data, Docs, LLM-readable surfaces, OG output, sitemap dates, and
  recommendation logic, and removes two remaining false separate-repository
  statements.
- Publication result: GitHub PR #134
  `https://github.com/7xuanlu/wenlan-site/pull/134` merged at
  `2026-08-23T03:06:52Z` as
  `e614035c65526f30d10832886e6ef047e4a58454`. Vercel reported production
  deployment success at `2026-08-23T03:07:27Z`; the remote publication branch
  was deleted.
- Local verification: `pnpm lint` passed; `pnpm test:i18n` passed 63/63;
  source-backed `pnpm test:seo` passed 224/224 with explicit Wenlan and
  wenlan-app checkout roots; `pnpm build` generated 223 static pages;
  `pnpm seo:technical:built` and `git diff --check` passed. Browser QA inspected
  17 changed routes at 393x852 and 1280x900 after their entry animations
  settled; there was no horizontal overflow, broken image, FAQPage schema, or
  visible English/zh-TW/zh-CN wrapping regression.
- Production verification: `pnpm seo:technical:deployed` passed with 120
  sitemap URLs, 24 key pages, 6 utility noindex surfaces, 25 legacy redirects,
  and 6 bridge-host redirects. Browser DOM checks passed on 18 live routes with
  exact canonicals, no overflow, no broken images, no FAQPage schema, and no
  stale separate-repository claim. The live download hub exposes all six
  v0.16.0 GitHub assets, including both the Windows x64 setup EXE and headless
  ZIP; English, zh-TW, and zh-CN mobile renders plus the English desktop render
  were inspected. `llms.txt`, `llms-full.txt`, and all three localized download
  sitemap entries expose the published state. Windows recommendation mapping
  is covered by deterministic user-agent tests; this run did not claim a real
  Windows-browser render from the available browser session.
- Decision: retain this as an authority-first factual correction, not evidence
  of search growth. Continue to the fixed August 28 source-native decision
  matrix; do not restart copy churn or infer clicks, impressions, visitors,
  downloads, or stars from deployment completion.
- Excluded actions: no Wenlan README edit, star CTA, new article, new
  experiment, indexing request, GSC validation, analytics mutation, paid
  action, external directory submission, maintainer message, synthetic event,
  or metric-definition change occurred.

## Campaign observation: Awesome Mac distribution PR opened at 2026-08-23T03:37:10Z

- Record type: authority-distribution attempt; this is not a website or search
  experiment and does not consume or reset the August 28 evidence gate.
- Approval boundary: the user approved forking `jaywcjlove/awesome-mac`, editing
  the four required locale READMEs, committing, pushing, and opening an upstream
  PR. Upstream merge and maintainer messaging remained excluded.
- Upstream and duplicate evidence: the submission used upstream `master` commit
  `b4043d92c04720f24bd0855cbc9fe6374205efec`. The repository was active and not
  archived; exact repository code search and open-PR searches found no existing
  Wenlan, `wenlan.app`, or `7xuanlu/wenlan` entry before submission.
- Published attempt: fork `7xuanlu/awesome-mac`, branch
  `codex/add-wenlan-ai-tools`, commit
  `e594429f7890089ba3c0633f69eb7ed853f491ed`, and upstream PR #2643
  `https://github.com/jaywcjlove/awesome-mac/pull/2643`. At capture time the PR
  is public, open, non-draft, and GitHub reports it mergeable; License
  Compliance passed.
- Exact scope: `README.md`, `README-zh.md`, `README-ja.md`, and `README-ko.md`
  each received one synchronized Wenlan line under AI Tools. The product link
  is `https://wenlan.app`; the open-source badge links to
  `https://github.com/7xuanlu/wenlan`; no unrelated entry was changed.
- Verification: each target README contains exactly one Wenlan entry;
  `git diff --check` passed; the final diff is four insertions and no deletions;
  both public links returned HTTP 200; GitHub's PR file list matches exactly
  the four intended README files.
- Decision: treat PR #2643 only as attempted distribution. It becomes earned
  authority evidence only after an upstream merge and a live rendered listing;
  do not infer impressions, clicks, visitors, downloads, stars, or causality
  from the open PR.
- Excluded actions: no Wenlan website or source-repository change, new article,
  indexing request, GSC validation, analytics mutation, paid action, maintainer
  message, upstream merge, synthetic event, or metric-definition change
  occurred.

## Campaign control: search-intent ownership guard at 2026-08-23T03:56:37Z

- Record type: campaign-control correction; not an experiment and no public
  page changed.
- Change: added a deterministic locale-aware intent registry and verifier for
  all 120 canonical sitemap URLs, then corrected weekly GSC ownership routing
  so narrow variants resolve before broad acquisition clusters.
- Evidence: the authenticated `2026-07-24..2026-08-20` query-page join contains
  115 visible rows and no visible protected query split across multiple URLs.
  Property totals remain 8 clicks / 1,005 impressions; visible-query totals
  remain 2 clicks / 216 impressions; the visibility gap remains 6 clicks / 789
  impressions. Hidden rows are unavailable rather than zero.
- Decision: keep one useful page per user task, not one page per keyword
  variation. Locale translations may own equivalent intents through distinct
  self-canonical URLs and reciprocal hreflang. Correct the AI-agent-memory-types
  and generic CJK Obsidian owners, preserve document-building intent for
  explicit build/setup queries, and require each configured owner to meet the
  existing impression floor independently.
- Artifact: `docs/seo-audits/2026-08-22-search-intent-map.md`.
- Verification: weekly pipeline tests passed 133/133;
  `pnpm seo:intent:check`, `pnpm seo:weekly:sample`,
  `pnpm seo:goal:check`, and `git diff --check` passed.
- Excluded actions: no website copy or metadata edit, publication, deployment,
  indexing request, GSC validation, analytics mutation, new experiment, or
  metric-definition change occurred.

## Campaign control: search-intent ownership guard published at 2026-08-23T04:35:49Z

- Record type: campaign-control publication; not an experiment and no public
  content or metadata changed.
- Publication: PR #135
  `https://github.com/7xuanlu/wenlan-site/pull/135` squash-merged at
  `2026-08-23T04:33:46Z` as
  `9d30003eaf1c3965ccc329494f9fc1cd19d3728b`; Vercel Production completed at
  `2026-08-23T04:34:30Z`; the remote branch was deleted.
- Scope: deterministic one-intent ownership for all 120 sitemap URLs, narrow
  query-owner corrections, and independent per-owner evidence floors in the
  weekly GSC action queue. No rendered page, title, H1, body, canonical,
  sitemap, redirect, locale route, or analytics integration changed.
- Verification: complete SEO suite 228/228; weekly pipeline 132/132; intent
  tests 2/2; intent ownership 120/120; weekly sample, Goal verifier, diff
  hygiene, Vercel deployment, and the complete deployed technical audit
  passed.
- Decision: retain as a campaign-control correction and continue to the
  August 28 evidence gate without resetting an experiment window.
- Excluded actions: no indexing request, GSC validation, analytics mutation,
  external publication other than the approved code PR, paid action,
  synthetic event, or metric-definition change occurred.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-13-mcp-knowledge-base-server-refresh production verification migration

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-13-mcp-knowledge-base-server-refresh
- Observed at: 2026-08-15T05:59:42Z
- Readout: correction
- Status: measuring
- Evidence: The protected origin/main campaign record proves PR #132
  squash-merged as `44b0ad40275554c65444a7941e7c5038d02b7ece`, Vercel Production
  completed at `2026-08-15T05:56:51Z`, and the deployed route passed direct
  200, exact canonical, indexability, Article and BreadcrumbList schema,
  stable `datePublished: 2026-06-07`, `dateModified: 2026-08-13`, sitemap
  membership, maintained content, FAQ without FAQPage, and responsive render
  checks. This typed correction changes neither that evidence nor its fixed
  measurement boundary.
- Result: pending
- Decision: wait
- Next step: Continue the source-native measurement schedule recorded in the
  protected campaign observation; this cohort does not consume the production
  slot.
<!-- EXPERIMENT-RECORD:END -->

<!-- SUCCESSOR-EXPERIMENT-SCHEMA-V1 -->

## Campaign control: trilingual scenario expansion approved at 2026-08-23T05:00:00Z

- Record type: campaign-control approval; this is not an experiment and does
  not change historical experiment records.
- Approval: the user approved the Wenlan trilingual SEO scenario expansion
  plan, including its protected content correction, successor experiment-date
  cutover, deterministic scenario registry, four-week target queue, and local
  verification work.
- Deadline schema: experiment starts before the marker above remain governed
  by the historical `2026-08-18` deadline. Later starts use the protected
  successor deadline `2026-09-21`; starts on `2026-09-22` or later fail.
- Scenario source: `docs/seo-scenario-backlog.json` is the editable source and
  `docs/seo-scenario-backlog.md` is generated. Empty SERP or demand evidence is
  recorded as research required, not zero demand and not a passed gate.
- Execution: audit the seven ordered families across English, zh-TW, and zh-CN.
  A measuring owner does not block the next non-overlapping family. Existing-
  page exposure floors apply only to another rewrite of that owner.
- Excluded actions: no public page, metadata, canonical, sitemap, redirect,
  commit, push, PR, merge, deployment, indexing request, GSC validation,
  analytics mutation, external publication, paid action, or metric definition
  is authorized or changed by this control record.

## Campaign control: trilingual scenario expansion implemented at 2026-08-23T06:12:00Z

- Record type: campaign-control implementation; this is not a website or
  search experiment and does not consume a production slot.
- Artifacts: added the seven-family trilingual source
  `docs/seo-scenario-backlog.json`, deterministic generated report
  `docs/seo-scenario-backlog.md`, scenario validator/generator, tests, package
  commands, protected PLAN correction, and successor deadline cutover.
- Baseline: the registry preserves 120 sitemap URLs, 46 English Learn URLs,
  five strict English AI knowledge-base or LLM Wiki owners plus one Obsidian-
  adjacent owner, five zh-TW Learn URLs, five zh-CN Learn URLs, 1,005 GSC
  impressions, 8 GSC clicks, 0.80% GSC CTR, 248 Vercel visitors, and 30 Google-
  referred Vercel visitors as native-unit baselines rather than demand or
  causal evidence.
- Gate state: all seven families remain `research`. Empty external evidence is
  explicitly unavailable, not zero. No family is marked executable until its
  provenance, repeated-demand, trilingual SERP, clean-gap, product-proof,
  standalone-utility, internal-link, and authority-path gates all pass.
- Verification: `pnpm seo:goal:check`, `pnpm seo:scenario:check`,
  `pnpm test:goal` (40/40), `pnpm test:i18n` (63/63), `pnpm lint`,
  `pnpm build` (223 static pages), `pnpm seo:technical:built`, and
  `git diff --check` passed. The source-backed full SEO suite passed 238/241;
  its three failures are an existing release-alignment mismatch between this
  dirty worktree's v0.15.8 public constants and the authoritative Wenlan
  v0.16.0 source, outside this control-plane change.
- Visual QA: not applicable because no rendered page, metadata, or public
  content changed in this implementation.
- Excluded actions: no public page, commit, push, PR, merge, deployment,
  request indexing, GSC validation, external publication, analytics mutation,
  paid action, synthetic event, or metric definition changed.

## Campaign control: scenario family 1 gate decision at 2026-08-23T06:15:44Z

- Record type: campaign-control correction; this supersedes only the earlier
  statement that all seven scenario families remained `research`.
- Decision: reject a net-new source-change or stale-page family. Independent
  English, Taiwan, and Chinese-language sources repeat the maintenance problem,
  but the existing source-backed AI knowledge-base owner in each locale already
  answers source changes, stale state, conflicts, refresh, citations, and
  review. Another URL would duplicate the same user task.
- Evidence boundary: dated web-search result observations and inspectable
  Reddit, Taiwan documentation, and Chinese-community sources are stored in
  `docs/seo-scenario-backlog.json` with their native units. The search provider
  did not expose stable Google rank or Taiwan/mainland geolocation, so the
  regional Google SERP gate remains pending and no rank is claimed.
- Existing-owner boundary: family 1 can return only as a refresh of the current
  source-backed owner after its confirmed post-deploy crawl, 20 page
  impressions, 3 joined qualified visible-query impressions, and cooldown gate
  pass. Those floors do not block research on family 2.
- Next step: audit family 2, the Codex or coding-agent source-backed knowledge-
  base task, across the three locales. No website experiment starts here.
- Excluded actions: no public content, commit, push, PR, merge, deployment,
  indexing request, GSC validation, external publication, analytics mutation,
  paid action, synthetic event, or metric definition changed.

## Campaign control: scenario family 2 evidence read at 2026-08-23T06:16:50Z

- Record type: campaign-control evidence read; no website experiment starts.
- Evidence: English results include OpenAI's repository-docs system-of-record
  and stale-doc gardening workflow plus an inspectable Codex cited-evidence
  implementation. zh-CN has two high-intent V2EX questions and a Juejin
  Codex/LLM-wiki implementation. Each source, query, date, language or
  geography, and native observation unit is stored in the scenario JSON.
- Current gate: provenance and repeated-demand pass. The trilingual SERP gate
  remains pending because no exact zh-TW coding-agent knowledge-base result set
  or stable regional Google capture is stored. Missing zh-TW evidence is
  unavailable, not zero, and the family remains `research`.
- Coverage: the English Wenlan Codex workflow partially owns the task; zh-TW
  and zh-CN have no dedicated Codex knowledge-base owner. The next audit must
  decide whether English is a gated refresh and whether Mandarin result sets
  support locale-specific net-new routes, without splitting query variants.
- Next step: research Taiwan developer and Obsidian communities using natural
  Codex, coding-agent, project-knowledge, source, citation, and context-loss
  wording. If that evidence remains weak, record the failure and move to
  family 3 in the same execution lane.
- Excluded actions: no content, commit, push, PR, merge, deployment, indexing
  request, GSC validation, external publication, analytics mutation, paid
  action, synthetic event, or metric definition changed.

## EXP-2026-08-23-coding-agent-source-backed-knowledge-base

- Status: local preparation; not published and no production measurement clock
  has started.
- Successor deadline: `2026-09-21` under
  `SUCCESSOR-EXPERIMENT-SCHEMA-V1`.
- User task: give Codex or another coding agent a source-backed project
  knowledge base without overloading `AGENTS.md`, `CLAUDE.md`, or generic
  memory.
- Canonical family:
  - `https://wenlan.app/learn/coding-agent-source-backed-knowledge-base`
  - `https://wenlan.app/zh-TW/learn/coding-agent-source-backed-knowledge-base`
  - `https://wenlan.app/zh-CN/learn/coding-agent-source-backed-knowledge-base`
- Hypothesis: one task-specific owner per locale that separates always-loaded
  agent instructions, repository truth, on-demand cited project knowledge,
  and acceptance tests can earn qualified coding-agent knowledge-base search
  exposure without cannibalizing the existing Codex session workflow or the
  generic source-backed architecture guide.
- Candidate evidence: the complete source-native English, zh-TW, and zh-CN
  SERP, community, overlap, Wenlan-proof, internal-link, and authority-path
  gate is stored in `docs/seo-scenario-backlog.json`. The observations are
  not keyword volume, GSC data, or rank claims.
- Baseline: the authenticated `2026-07-24..2026-08-20` Wenlan property range
  reports 8 clicks and 1,005 impressions; visible-query rows report 2 clicks
  and 216 impressions, leaving a 6-click and 789-impression visibility gap.
  Vercel separately reports 248 visitors, including 30 attributed to Google;
  GitHub reports 48 stars. The three new URLs have no pre-publication GSC or
  Vercel page row. Missing rows are unavailable, not zero.
- Change: add exactly one English, zh-TW, and zh-CN canonical for the same
  locale-natural integration task; add reciprocal hreflang, sitemap and
  Learn-hub membership, Article and BreadcrumbList schema through the shared
  renderer, visible maintained sources and FAQ without `FAQPage`, and at
  least three same-locale contextual inbound paths. Do not rewrite the
  existing Codex workflow owner.
- Product boundary: current code, tests, specifications, and approved
  first-party documents remain authoritative. Wenlan supports Markdown,
  text, text-extractable PDF, folders, and read-only Obsidian Sources; this
  experiment does not claim arbitrary source-code ingestion or autonomous
  truth.
- Publication and index dates: unavailable until separately approved commit,
  push, PR, merge, Vercel deployment, and production verification. Request
  indexing and GSC validation are separate approval boundaries.
- Minimum exposure: each locale independently requires at least 20 GSC
  target-page impressions in 28 complete days after a confirmed post-deploy
  Google crawl. Locale exposure is never pooled.
- Success: after the minimum exposure, a locale records at least 3 qualified
  joined-query impressions and at least 1 GSC click. Position and CTR are
  reported separately and cannot replace either condition.
- Failure: after 28 complete post-crawl days and at least 20 target-page
  impressions, a locale has no qualified joined-query impressions or no GSC
  click, or an above-floor query-page join shows that the same task belongs
  to an existing owner. A technical, factual, unsupported-claim, or duplicate-
  intent regression stops publication immediately.
- Inconclusive: fewer than 20 target-page impressions, no confirmed post-
  deploy crawl, privacy-hidden joined queries, incomplete days, or mixed
  controller exposure. Inconclusive measurement does not block the next
  non-overlapping scenario family.
- Readouts: 24 hours after production completion for technical/indexability
  only; 7 days for early native-unit GSC page/query and Vercel page/referrer
  observations; W2 and W4 for continued source-native observation; W8 only
  if it remains useful after the Goal deadline. The formal decision uses 28
  complete post-crawl days.
- Authority path: `https://github.com/thc1006/ai-prompting-guide` is a current
  exact-fit, English/zh-TW handbook that explicitly welcomes synchronized
  documentation PRs. It has only 2 GitHub stars at the 2026-08-23 capture, so
  it is recorded as a small executable path rather than high authority. No
  contribution or maintainer message is approved by this experiment.
- Approval boundary: the user approved the trilingual scenario implementation
  and local verification. Commit, push, PR, merge, deployment, indexing,
  validation, external publication, paid action, synthetic events, analytics
  mutation, and metric-definition changes remain excluded.

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-23-coding-agent-source-backed-knowledge-base

- Record type: experiment-start
- Experiment ID: EXP-2026-08-23-coding-agent-source-backed-knowledge-base
- Status: approved
- Data window: 2026-08-22..2026-08-28
- Asset class: net-new-search
- Launched: 2026-08-23
- Hypothesis: A task-specific trilingual owner that separates agent instructions, repository truth, and on-demand cited project knowledge will earn qualified coding-agent knowledge-base exposure without cannibalizing the existing Codex session workflow or generic source-backed guide.
- Candidate evidence: Dated English, zh-TW, and zh-CN official, SERP, Reddit, Taiwan practitioner, V2EX, Juejin, overlap, product-proof, internal-link, and authority-path observations with native units are stored in docs/seo-scenario-backlog.json.
- Baseline: GSC property 8 clicks and 1,005 impressions; visible-query 2 clicks and 216 impressions; visibility gap 6 clicks and 789 impressions; Vercel 248 visitors with 30 attributed to Google; GitHub 48 stars; new target-page rows unavailable, all kept separate.
- Change: Add exactly one English, zh-TW, and zh-CN canonical for the coding-agent source-backed project-knowledge task, with same-locale routing, citations, workflow, acceptance tests, reciprocal hreflang, sitemap membership, and at least three contextual inbound paths.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after the minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and the minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor join assigns the same task to an existing owner.
- Stop criteria: Stop on a technical, factual, unsupported-claim, duplicate-intent, controller-overlap, or approval-boundary violation.
- 24h readout: pending technical and indexability observation after production completion
- 7d readout: pending early source-native GSC page/query and Vercel page/referrer observation
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Complete local deterministic and rendered verification, then request separate publication approval with the exact diff and evidence.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-23 local verification — EXP-2026-08-23-coding-agent-source-backed-knowledge-base

- Observed at: `2026-08-23T08:21:08Z`.
- Status: prepared locally; not published, no production crawl or measurement
  clock has started, and the experiment-start record above remains immutable.
- Routes: the English, zh-TW, and zh-CN candidates each returned local
  production status `200`, emitted one exact canonical, `index, follow`, one
  `Article`, one `BreadcrumbList`, reciprocal locale routing, and no
  `FAQPage` schema.
- Content: all seven declared Wenlan workflow commands, maintained source and
  limitation boundaries, visible FAQ, and same-locale contextual paths were
  present in the production render.
- Responsive evidence: exact Playwright viewports at `393x852` and
  `1440x1200` had no horizontal overflow. English, zh-TW, and zh-CN hero,
  packet, article, and expanded FAQ states were inspected. The Mandarin
  renderer keeps `知識庫` and `知识库` intact rather than orphaning the final
  character.
- Deterministic evidence: `pnpm test:i18n` and `pnpm build` passed after the
  final render correction. The complete verifier set is recorded in the task
  handoff after it runs.
- Decision: request a separate publication approval only after the final
  verifier set remains green. Commit, push, PR, merge, Vercel deployment,
  indexing, validation, external publication, paid action, synthetic events,
  analytics mutation, and metric-definition changes remain excluded.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-23-coding-agent-source-backed-knowledge-base publication approval

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-23-coding-agent-source-backed-knowledge-base
- Observed at: 2026-08-23T17:41:09Z
- Readout: correction
- Status: active
- Evidence: The user explicitly approved the exact commit, push, PR creation, merge, automatic Vercel deployment, and read-only production-verification scope after reviewing the local implementation and verification result. Request indexing, GSC validation, external publication, paid actions, synthetic events, analytics mutation, and metric-definition changes remain excluded.
- Result: pending
- Decision: merge
- Next step: Complete the independent pre-merge review, push the exact branch, merge only after required checks pass, wait for automatic Vercel production completion, and verify the three live locale routes without requesting indexing.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-23 OpenSEO MCP restoration and authenticated boundary

- The official hosted MCP endpoint `https://app.openseo.so/mcp` was restored
  to the global Codex configuration and its OAuth flow completed successfully.
- A fresh read-only Codex execution called `list_projects` and
  `get_project_context` through OpenSEO without an access error. The returned
  project is `Default` for `wenlan.app`.
- Business overview, current goal, positioning, competitors, key pages, and
  research log remain empty. No project context was written.
- The signed-in hosted account still reports exhausted credits. GSC and GA4
  remain unconnected, no keyword or SERP research, site audit, rank tracker,
  Brand Lookup, paid action, or credit-consuming call was run.
- GSC connection remains separately pending because the Chrome extension
  control transport disconnected after approval. This did not block the MCP
  read-only smoke test and does not change GSC's role as the only authority
  for Wenlan Google Search performance and indexing.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-23-coding-agent-source-backed-knowledge-base production completion

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-23-coding-agent-source-backed-knowledge-base
- Observed at: 2026-08-23T18:05:09Z
- Readout: correction
- Status: measuring
- Evidence: PR #136 merged at 2026-08-23T18:04:33Z as e3ea912d458bfbe7c0ad864872effe48a9ca9c97; Vercel production deployment 6051054690 completed at 2026-08-23T18:05:09Z and the three locale routes were production-verified without requesting indexing.
- Result: pending
- Decision: wait
- Next step: Keep the coding-agent family stable and read each locale in native GSC and Vercel units after sufficient post-crawl exposure. It no longer consumes the production-in-flight slot.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-23-citation-verification-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-23-citation-verification-locales
- Status: approved
- Data window: 2026-08-22..2026-08-28
- Asset class: net-new-search
- Launched: 2026-08-23
- Hypothesis: A task-specific trilingual owner for claim-to-evidence citation diagnosis can earn qualified AI knowledge-base verification exposure without cannibalizing the existing source-backed architecture guide.
- Candidate evidence: Dated English, zh-TW, and zh-CN SERP, issue, practitioner, official-documentation, overlap, product-proof, internal-link, and authority-path observations with native units are stored in docs/seo-scenario-backlog.json.
- Baseline: GSC property 8 clicks and 1,005 impressions; visible-query 2 clicks and 216 impressions; visibility gap 6 clicks and 789 impressions; Vercel 248 visitors with 30 attributed to Google; GitHub 48 stars; new target-page rows unavailable, all kept separate.
- Change: Add exactly one English, zh-TW, and zh-CN canonical for citation verification, with locale-natural wording, claim-to-evidence workflow, maintained sources, reciprocal hreflang, sitemap membership, and contextual inbound paths from the source-backed, tool-selection, and LLM Wiki owners.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after the minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and the minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor join assigns the same task to an existing owner.
- Stop criteria: Stop on a technical, factual, unsupported-claim, duplicate-intent, controller-overlap, or approval-boundary violation.
- 24h readout: pending technical and indexability observation after production completion
- 7d readout: pending early source-native GSC page/query and Vercel page/referrer observation
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Publish the exact verified branch after the approval record below, then start the measurement clock from production completion without requesting indexing.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-23-citation-verification-locales publication approval

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-23-citation-verification-locales
- Observed at: 2026-08-23T22:08:21Z
- Readout: correction
- Status: active
- Evidence: The user explicitly approved the exact commit, push, PR creation, merge, automatic Vercel deployment, and read-only production-verification scope after reviewing the local implementation, evidence, and responsive previews. Request indexing, GSC validation, external publication, paid actions, synthetic events, analytics mutation, and metric-definition changes remain excluded.
- Result: pending
- Decision: merge
- Next step: Commit and push only the citation-verification family and its deterministic control records, merge only after required checks pass, then wait for automatic Vercel production completion and verify the three live routes.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-23-citation-verification-locales production completion

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-23-citation-verification-locales
- Observed at: 2026-08-23T22:21:18Z
- Readout: correction
- Status: measuring
- Evidence: PR #137 merged at 2026-08-23T22:20:42Z as b04a5e2ea480bf6a689e14bf6bac7267b8d7ed12; Vercel production completed at 2026-08-23T22:21:18Z. The English, zh-TW, and zh-CN routes returned direct 200 responses with exact canonicals, reciprocal hreflang, Article and BreadcrumbList schema dated 2026-08-23, visible FAQ without FAQPage JSON-LD, same-locale links, no horizontal overflow at 393x852 or 1280x720, and no browser console errors.
- Result: pending
- Decision: wait
- Next step: Keep all three locale owners stable and read each locale in native GSC page/query and Vercel page/referrer units after sufficient post-crawl exposure. The experiment no longer consumes the production-in-flight slot.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-23-knowledge-retrieval-policy-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-23-knowledge-retrieval-policy-locales
- Status: approved
- Data window: 2026-08-22..2026-08-28
- Asset class: net-new-search
- Launched: 2026-08-23
- Hypothesis: A task-specific trilingual owner for deciding when an AI agent should query, pre-retrieve, autonomously retrieve, progressively disclose, or skip a knowledge base can earn qualified retrieval-policy exposure without cannibalizing the existing role-comparison or coding-agent source-boundary owners.
- Candidate evidence: Dated English, zh-TW, and zh-CN official, practitioner, SERP, overlap, product-proof, internal-link, and authority-path observations with native units are stored in docs/seo-scenario-backlog.json.
- Baseline: GSC property 8 clicks and 1,005 impressions; visible-query 2 clicks and 216 impressions; visibility gap 6 clicks and 789 impressions; Vercel 248 visitors with 30 attributed to Google; GitHub 48 stars; new target-page rows unavailable, all kept separate.
- Change: Add exactly one English, zh-TW, and zh-CN canonical for the per-task retrieval-policy job, with locale-natural wording, query-or-skip workflow, Wenlan plugin and MCP-only command boundaries, maintained sources, reciprocal hreflang, sitemap membership, and at least three same-locale contextual inbound paths.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after the minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and the minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor join assigns the same task to an existing owner.
- Stop criteria: Stop on a technical, factual, unsupported-claim, duplicate-intent, command-prerequisite, controller-overlap, or approval-boundary violation.
- 24h readout: pending technical and indexability observation after production completion
- 7d readout: pending early source-native GSC page/query and Vercel page/referrer observation
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Publish the exact verified branch after the approval record below, then start the measurement clock from production completion without requesting indexing.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-23-knowledge-retrieval-policy-locales publication approval

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-23-knowledge-retrieval-policy-locales
- Observed at: 2026-08-24T01:21:21Z
- Readout: correction
- Status: active
- Evidence: The user explicitly approved the exact commit, push, PR creation, merge, automatic Vercel deployment, and read-only production-verification scope after reviewing the audience-trigger-task-outcome contract, local implementation, evidence, and responsive QA. Request indexing, GSC validation, external publication, paid actions, synthetic events, analytics mutation, and metric-definition changes remain excluded.
- Result: pending
- Decision: merge
- Next step: Complete the independent pre-merge fixes and review, push the exact branch, merge only after required checks pass, wait for automatic Vercel production completion, and verify the three live locale routes without requesting indexing.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-23-knowledge-retrieval-policy-locales production completion

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-23-knowledge-retrieval-policy-locales
- Observed at: 2026-08-24T01:35:46Z
- Readout: correction
- Status: measuring
- Evidence: PR #138 merged at 2026-08-24T01:35:09Z as c95d009437b910a6b85f9d648e667e2d89b70d66; Vercel production completed at 2026-08-24T01:35:46Z. The English, zh-TW, and zh-CN routes returned direct 200 responses with exact canonicals, reciprocal hreflang, Article and BreadcrumbList schema dated 2026-08-23, visible FAQ without FAQPage JSON-LD, the corrected Wenlan plugin, MCP recall, and local wenlan pages CLI boundary, no horizontal overflow at 393x852 or 1280x720, no broken images, and no browser console errors. The deployed technical audit passed 129 sitemap URLs, 27 key pages, six utility noindex surfaces, FAQPage absence, 25 redirects, six bridge-host redirects, 18 direct changed redirects, and legacy URL exclusion.
- Result: pending
- Decision: wait
- Next step: Keep all three locale owners stable and read each locale in native GSC page/query and Vercel page/referrer units after sufficient post-crawl exposure. The experiment no longer consumes the production-in-flight slot. Do not move the 2026-08-24T01:35:46Z content measurement boundary for a later control-record-only deployment.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-23-pdf-ingestion-troubleshooting-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-23-pdf-ingestion-troubleshooting-locales
- Status: approved
- Data window: 2026-08-22..2026-08-28
- Asset class: net-new-search
- Launched: 2026-08-23
- Hypothesis: A task-specific trilingual owner for diagnosing skipped, empty, oversized, image-only, near-empty, or parser-error PDFs can earn qualified AI knowledge-base ingestion-troubleshooting exposure without cannibalizing the existing document-build guide.
- Candidate evidence: Dated English, zh-TW, and zh-CN official documentation, SERP, OSS issue, Taiwan practitioner, overlap, product-proof, internal-link, and authority-path observations with native units are stored in docs/seo-scenario-backlog.json. They are not keyword volume, GSC data, or rank claims.
- Baseline: GSC property 8 clicks and 1,005 impressions; visible-query 2 clicks and 216 impressions; visibility gap 6 clicks and 789 impressions; Vercel 248 visitors with 30 attributed to Google; GitHub 48 stars; new target-page rows unavailable, all kept separate.
- Change: Prepare exactly one English, zh-TW, and zh-CN canonical for PDF ingestion diagnosis, with locale-natural wording, text-layer and OCR decision flow, Wenlan input limits and parser outcomes, extracted-evidence acceptance tests, reciprocal hreflang, sitemap membership, visible FAQ without FAQPage, and contextual inbound paths from document-build, tool-selection, and citation-verification owners.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after the minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and the minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor join assigns the same task to the existing document-build owner.
- Stop criteria: Stop on a technical, factual, unsupported-claim, duplicate-intent, command-prerequisite, controller-overlap, or approval-boundary violation.
- 24h readout: pending technical and indexability observation after production completion
- 7d readout: pending early source-native GSC page/query and Vercel page/referrer observation
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Complete local deterministic and rendered verification, then request separate publication approval with the exact diff and evidence.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-24 local verification — EXP-2026-08-23-pdf-ingestion-troubleshooting-locales

- Observed at: `2026-08-24T03:08:37Z`.
- Status: prepared locally; not published, no production crawl or measurement clock has started, and the experiment-start record above remains immutable.
- Routes: English, zh-TW, and zh-CN returned local production status `200`, one exact canonical, `index, follow`, reciprocal hreflang, one `Article`, one `BreadcrumbList`, and no `FAQPage` schema.
- Content: the rendered pages preserve the text-layer, external-OCR, 1 MB text, 10 MB PDF, skipped/error, parser, known-sentence, answerable/unanswerable, source, and limitation boundaries. Each locale has contextual links from its document-build, tool-selection, and citation-verification owners.
- Responsive evidence: fresh full-page and close-up captures under `/private/tmp/wenlan-pdf-ingestion-qa` cover all three routes at exact `393x852` and `1440x1200`. No page had horizontal overflow or broken images; English, zh-TW, and zh-CN headings, workflow, code, CTA, expanded FAQ, and footer were inspected with no CJK orphan or clipping finding.
- Browser integrity: every page has one main article and one H1, visible FAQ expansion works, links have visible names, and no browser console warning or error was recorded.
- Deterministic evidence: `pnpm test:goal`, `pnpm seo:scenario:check`, source-backed `pnpm test:seo`, `pnpm test:i18n`, `pnpm lint`, `pnpm build`, `pnpm seo:technical:built`, `pnpm seo:intent:check`, `pnpm seo:goal:check`, and `git diff --check` passed after the final content correction.
- Decision: request separate publication approval for the exact verified diff. Commit, push, PR, merge, Vercel deployment, indexing, validation, external publication, paid action, synthetic events, analytics mutation, and metric-definition changes remain excluded.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-23-pdf-ingestion-troubleshooting-locales production completion

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-23-pdf-ingestion-troubleshooting-locales
- Observed at: 2026-08-24T03:34:00Z
- Readout: correction
- Status: measuring
- Evidence: PR #140 merged at 2026-08-24T03:33:23Z as 3a4b2aedc7d827cf9999161a1f27bc1e678ebcda; Vercel production completed at 2026-08-24T03:34:00Z. The English, zh-TW, and zh-CN routes returned direct 200 responses with exact canonicals, reciprocal hreflang, Article and BreadcrumbList schema, visible FAQ without FAQPage, and clean mobile and desktop rendering.
- Result: pending
- Decision: wait
- Next step: Keep `2026-08-24T03:34:00Z` fixed as the production boundary and measure each locale independently in source-native GSC page/query and Vercel page/referrer units. No indexing request, validation, analytics mutation, or external publication occurred.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-24-multi-agent-knowledge-conflicts-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-24-multi-agent-knowledge-conflicts-locales
- Status: approved
- Data window: 2026-08-22..2026-08-28
- Asset class: net-new-search
- Launched: 2026-08-24
- Hypothesis: One task-specific English, zh-TW, and zh-CN owner for preventing shared-knowledge overwrites, stale writes, contradictions, scope pollution, and unsupported promotion can earn qualified maintenance exposure without cannibalizing the existing multi-agent client-connection workflow.
- Candidate evidence: Dated English papers and framework discussions, a Taiwan news result and practitioner implementation, a maintained Simplified Chinese chapter, and a current Chinese bug report are stored in `docs/seo-scenario-backlog.json` in native units. They are not keyword volume, rank, GSC data, or causal evidence.
- Baseline: GSC property 8 clicks and 1,005 impressions; visible-query 2 clicks and 216 impressions; visibility gap 6 clicks and 789 impressions; Vercel 248 visitors with 30 attributed to Google; GitHub 48 stars; new target-page rows unavailable, all kept separate.
- Change: Prepare exactly one English, zh-TW, and zh-CN canonical for the conflict-and-stale-conclusion maintenance task, with locale-natural phrasing, evidence/candidate/accepted states, expected-version and review workflow, truthful Wenlan limits, reciprocal hreflang, sitemap membership, visible FAQ without FAQPage, and at least three same-locale contextual inbound paths.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after the minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor join assigns the same maintenance task to the existing multi-agent workflow owner.
- Stop criteria: Stop on a technical, factual, unsupported automatic-conflict-resolution, duplicate-intent, controller-overlap, canonical, locale, or approval-boundary violation.
- 24h readout: pending technical and indexability observation after production completion
- 7d readout: pending early source-native GSC page/query and Vercel page/referrer observation
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Complete local deterministic and rendered verification, then request separate publication approval with the exact diff and evidence.
<!-- EXPERIMENT-RECORD:END -->

### 2026-08-24T05:24:02Z — multi-agent knowledge-conflict family locally verified

- Record type: campaign-observation
- Experiment ID: `EXP-2026-08-24-multi-agent-knowledge-conflicts-locales`
- Status: prepared locally; not published, so no production crawl or
  measurement clock has started and the experiment-start record remains
  immutable.
- Intent boundary: the existing multi-agent workflow remains the owner for
  connection, shared daemon, data directory, space, capture, recall, handoff,
  and distill. The new trilingual family owns stale writes, contradictory or
  scope-polluted candidate claims, evidence review, expected-version refusal,
  and supersession history.
- Content evidence: English, zh-TW, and zh-CN each provide one direct answer,
  failure taxonomy, staged candidate-to-accepted workflow, a source-backed
  Wenlan command loop, truthful scheduler/lock/consensus limits, visible FAQ,
  maintained sources, and at least three same-locale inbound paths.
- Browser evidence: all three local production routes exposed exact canonicals,
  reciprocal hreflang, `index, follow`, one `Article`, one `BreadcrumbList`, no
  `FAQPage`, no broken images, and no horizontal overflow. Fresh mobile and
  desktop captures were inspected for heading, prose, workflow, code, CTA, FAQ,
  and CJK wrapping with no clipping or orphan finding. The browser control
  yielded 308 and 1,146 CSS-pixel widths instead of exact 393 and 1,440; those
  narrower captures are conservative responsive evidence, not exact-device
  claims. A calibrated recapture was blocked by browser URL policy and was not
  bypassed.
- Deterministic evidence: `pnpm seo:goal:check`, `pnpm seo:scenario:check`,
  `pnpm test:goal`, source-backed `pnpm test:seo` (245/245), `pnpm test:i18n`
  (68/68), `pnpm lint`, `pnpm build` (243 static pages),
  `pnpm seo:technical:built` (135 sitemap URLs, 24 checked HTML pages, no
  `FAQPage` in 140 built HTML files), `pnpm seo:intent:check` (135/135), and
  `git diff --check` passed.
- Decision: request separate publication approval for this exact verified diff.
  Commit, push, PR, merge, Vercel deployment, indexing, validation, external
  publication, paid action, synthetic events, analytics mutation, and
  metric-definition changes remain excluded.

### 2026-08-24T06:20:00Z — pre-merge product-boundary correction

- Record type: campaign-correction
- Experiment ID: `EXP-2026-08-24-multi-agent-knowledge-conflicts-locales`
- Supersedes: the experiment-start phrase `expected-version and review
  workflow` and the local-verification phrases `expected-version refusal` and
  generic `Wenlan command loop` wherever they imply a capability of the
  current public Agent path.
- Corrected capability: Wenlan's core manual Page update request supports an
  `expected_version`, but the current public MCP `write_page` refresh input
  does not expose it. The public multi-agent recipe therefore records the
  version, re-reads the source and target, and stops before `write_page` when
  they changed; it does not claim an atomic stale-write rejection for a
  machine-owned Page. Human-owned Page refreshes still become reviewable
  revisions.
- Corrected command boundary: `/pages`, `/capture`, `/distill`, `/lint`, and
  `/curate` are Wenlan Codex plugin commands and require plugin setup. Other
  agents use local MCP tools or the local `wenlan pages`, `wenlan capture`,
  `wenlan lint`, and `wenlan curate revisions` commands. Local Page refresh is
  available only over local stdio MCP.
- Scope: three locale articles, tests, mutable PLAN/scenario/gate records, and
  this append-only correction. The intent, canonical routes, baseline,
  measurement contract, and publication approval do not change.
- Decision: re-run the full local gate and obtain a fresh independent SHIP
  review before publishing the corrected exact diff.

### 2026-08-24T06:23:36Z — corrected publication scope approved

- Record type: campaign-approval
- Experiment ID: `EXP-2026-08-24-multi-agent-knowledge-conflicts-locales`
- Approval: the user explicitly approved the presented local experiment for
  commit, Git push, PR creation, merge, automatic Vercel deployment, and
  read-only production verification. The factual product-boundary correction
  is part of that same publication scope.
- Independent review: `SHIP`; the public MCP `write_page` limitation and the
  Codex-plugin versus local MCP/CLI command boundary are accurate in all three
  locales and pinned by the trilingual contract test. No critical or important
  issue remains.
- Passing gate: `pnpm seo:goal:check`, `pnpm seo:scenario:check`,
  `pnpm test:goal` (43/43), source-backed `pnpm test:seo` (245/245),
  `pnpm test:i18n` (68/68), `pnpm lint`, `pnpm build` (243 static pages),
  `pnpm seo:technical:built` (135 sitemap URLs),
  `pnpm seo:intent:check` (135/135), and `git diff --check`.
- Boundaries retained: no request indexing, GSC validation, Reddit or other
  external publication, OSS submission, paid action, synthetic analytics
  event, analytics/account mutation, or metric-definition change.
- Next step: publish the exact corrected diff, wait for the automatic Vercel
  production deployment, and verify the three production routes read-only.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-24-multi-agent-knowledge-conflicts-locales production completion

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-24-multi-agent-knowledge-conflicts-locales
- Observed at: 2026-08-24T06:28:41Z
- Readout: correction
- Status: measuring
- Evidence: PR #141 merged at 2026-08-24T06:25:27Z as ffa458414ce462bc8eb953da1e4ffb1c03c116e8; Vercel production completed at 2026-08-24T06:26:03Z. English, zh-TW, and zh-CN returned direct 200 responses with exact canonicals, reciprocal hreflang, index, follow, one Article, one BreadcrumbList, no FAQPage, and the corrected public-MCP, Codex-plugin, local-MCP, and CLI boundaries. The full deployed technical audit passed 135 sitemap URLs, 27 key pages, six utility noindex headers, 25 redirects, six bridge-host redirects, FAQPage absence across the sitemap, and old-URL exclusions.
- Result: pending
- Decision: wait
- Next step: Keep 2026-08-24T06:26:03Z fixed as the content production boundary and measure each locale independently in source-native GSC page/query and Vercel page/referrer units. A later controller-only deployment does not move the boundary. No request indexing, GSC validation, analytics mutation, or external publication occurred.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-24-multi-agent-knowledge-conflicts-locales indexing request

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-24-multi-agent-knowledge-conflicts-locales
- Observed at: 2026-08-25T02:18:58Z
- Readout: correction
- Status: measuring
- Evidence: Using authenticated Search Console account `Qi-Xuan Lu (h164654156465@gmail.com)`, the live English, zh-TW, and zh-CN routes each showed `URL is not on Google`, `URL is unknown to Google`, and no last crawl before the one approved request. All three returned `Indexing requested` and were accepted into Google's priority crawl queue. This does not prove a crawl, indexing, rank, impressions, or clicks, and repeated submission does not change queue position or priority.
- Result: pending
- Decision: wait
- Next step: Keep the fixed `2026-08-24T06:26:03Z` production boundary, do not repeat the indexing requests, and read each locale independently in source-native GSC page/query and Vercel page/referrer units when available.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-26-retrieval-regression-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-26-retrieval-regression-locales
- Status: active
- Data window: 2026-08-22..2026-08-28
- Asset class: net-new-search
- Launched: 2026-08-26
- Hypothesis: One task-specific English, zh-TW, and zh-CN owner for regression-testing retrieval after corpus, embedding, chunking, hybrid-search, filter, or reranker changes can earn qualified evaluation-workflow exposure without cannibalizing citation verification or Wenlan's maintainer evaluation documentation.
- Candidate evidence: Separate English, Taiwan, and Simplified-Chinese SERP observations plus dated product-neutral guides, a maintained discussion, and an implemented OSS change are stored in `docs/seo-scenario-backlog.json` in their native units. They are not keyword volume, rank, authenticated GSC data, or causal evidence.
- Baseline: GSC property 8 clicks and 1,005 impressions; visible-query 2 clicks and 216 impressions; visibility gap 6 clicks and 789 impressions; Vercel 248 visitors with 30 attributed to Google; GitHub 48 stars; new target-page rows unavailable, all kept separate.
- Change: Prepare exactly one English, zh-TW, and zh-CN canonical for a versioned golden-query, expected-source, Recall@k, MRR, no-answer, regression-triage, and rollback workflow. Keep Wenlan's maintainer-only drift test distinct from a released end-user command and state that it detects drift, not correctness.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor join assigns the same task to citation verification or the existing evaluation documentation.
- Stop criteria: Stop on a technical, factual, unsupported product-command, duplicate-intent, controller-overlap, canonical, locale, responsive-render, or approval-boundary violation.
- 24h readout: pending technical and indexability observation after production completion
- 7d readout: pending early source-native GSC page/query and Vercel page/referrer observation
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Complete local deterministic and rendered verification, then request separate publication approval with the exact diff and evidence.
<!-- EXPERIMENT-RECORD:END -->

## 2026-08-26T07:54:44Z — retrieval-regression local prelaunch verification

- Experiment ID: `EXP-2026-08-26-retrieval-regression-locales`
- Scope remains local preparation only; the three routes are not published or
  indexed, and no performance readout is recorded.
- Passing gates: `pnpm seo:goal:check`, `pnpm seo:scenario:check` (8 trilingual
  families; 138 sitemap owners), `pnpm test:goal` (44/44),
  `pnpm test:i18n` (69/69), `pnpm lint`, `pnpm build` (247 static pages),
  `pnpm seo:technical:built` (138 sitemap URLs),
  `pnpm seo:intent:check` (138/138), the focused weekly technical fixture, and
  `git diff --check`.
- Full `pnpm test:seo`: the scenario and technical fixture pass. Four unrelated
  release-contract tests remain red because the site still publishes v0.16.0
  while the sibling Wenlan repository reports v0.17.0. That release-sync gap
  is not changed or hidden in this scenario diff.
- Render QA: English, zh-TW, and zh-CN passed at exact 393x852 and 1440x1200
  viewports with no horizontal overflow, broken images, console warnings, or
  console errors. All seven article sections and an expanded FAQ were checked;
  the discovered zh-TW/zh-CN orphan-question-mark break was fixed and rechecked.
- Approval boundary: commit, push, PR, merge, deployment, request indexing,
  GSC validation, analytics mutation, and external publication still require
  separate explicit approval.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-26-retrieval-regression-locales publication approval

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-26-retrieval-regression-locales
- Observed at: 2026-08-27T04:09:57Z
- Readout: correction
- Status: active
- Evidence: The user explicitly approved publishing the exact verified English, zh-TW, and zh-CN retrieval-regression family through commit, push, PR creation, merge, automatic Vercel deployment, and read-only production verification. Request indexing, GSC validation, external publication, paid actions, synthetic events, analytics mutation, and metric-definition changes remain excluded.
- Result: pending
- Decision: merge
- Next step: Re-run the complete local gates on the exact branch, commit and push only the prepared family and its deterministic control records, merge after required checks pass, wait for automatic Vercel production completion, and verify all three live routes without requesting indexing.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-26-retrieval-regression-locales production publication

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-26-retrieval-regression-locales
- Observed at: 2026-08-27T04:32:45Z
- Readout: correction
- Status: measuring
- Evidence: PR #144 merged at `2026-08-27T04:31:56Z` as `681754936193cb035b4285709bd98ed82189e466`; Vercel reported production deployment success at `2026-08-27T04:32:45Z`. The English, zh-TW, and zh-CN routes passed direct 200, exact canonical, reciprocal hreflang, sitemap, Article and BreadcrumbList, visible FAQ without FAQPage, maintained-source, and responsive-render verification. This proves publication and technical availability only.
- Result: pending
- Decision: wait
- Next step: Keep `2026-08-27T04:32:45Z` as the fixed production boundary. At 24 hours record technical and indexability evidence only; judge each locale independently after a confirmed crawl and 28 complete post-crawl days with its original 20-page-impression, 3-qualified-joined-query-impression, and 1-click contract. Do not request indexing or publish the authority candidate without separate approval.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-27-source-backed-research-knowledge-base-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-27-source-backed-research-knowledge-base-locales
- Status: measuring
- Data window: 2026-08-22..2026-08-28
- Asset class: net-new-search
- Launched: 2026-08-27
- Hypothesis: One bounded English, zh-TW, and zh-CN owner for turning an already selected paper or PDF set into an inspectable literature matrix and synthesis can earn qualified research-workflow exposure without cannibalizing generic document ingestion, citation debugging, scholarly discovery, or manuscript-generation intent.
- Candidate evidence: Separate English/US, Taiwan Traditional-Chinese, and mainland-parameter Simplified-Chinese SERP observations plus request-relative Trends indices, maintained OSS workflows, a first-hand citation-ledger report, and current university guidance are stored in `docs/seo-scenario-backlog.json` in native units. They are not keyword volume, rank, authenticated GSC data, or causal evidence.
- Baseline: GSC property 8 clicks and 1,005 impressions; visible-query 2 clicks and 216 impressions; visibility gap 6 clicks and 789 impressions; Vercel 248 visitors with 30 attributed to Google; GitHub 48 stars; new target-page rows unavailable, all kept separate.
- Change: Publish exactly one English, zh-TW, and zh-CN canonical that starts with a bounded paper set, builds a claim/method/sample/result/limitation matrix, preserves contradictions and exact source locations, refreshes changed papers, and excludes scholarly search, DOI discovery, Zotero import, citation formatting, scanned-PDF OCR, and manuscript generation.
- Publish date: 2026-08-28
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor join shows that document ingestion, citation verification, or an unsupported literature-generator intent owns the same task.
- Stop criteria: Stop on a technical, factual, unsupported discovery or writing claim, duplicate-intent, controller-overlap, canonical, locale, responsive-render, or approval-boundary violation.
- 24h readout: pending technical and indexability observation after 2026-08-29T03:49:51Z
- 7d readout: pending early source-native GSC page/query and Vercel page/referrer observation after 2026-09-04T03:49:51Z
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Keep `2026-08-28T03:49:51Z` as the fixed production boundary. Prepare only the exact `0x11c11e/awesome-ai-research-tools` candidate against current upstream; do not fork, push, open a pull request, message maintainers, request indexing, or change account state without separate approval.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-27-source-backed-research-knowledge-base-locales production publication

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-27-source-backed-research-knowledge-base-locales
- Observed at: 2026-08-28T03:49:51Z
- Readout: correction
- Status: measuring
- Evidence: PR #145 merged at `2026-08-28T03:49:03Z` as `37b28a0df3e2e85a41ca7ec4bb9d25db3149ca89`; Vercel reported production deployment success at `2026-08-28T03:49:51Z`. All three live routes returned 200 with exact canonicals, reciprocal alternates, sitemap membership, Article and BreadcrumbList schema, no FAQPage, and the locale-specific literature-matrix, contradiction, limitation, and source-update workflow. The deployed technical audit passed all 141 sitemap URLs. This proves publication and technical availability only.
- Result: pending
- Decision: wait
- Next step: Keep the canonical family stable, record the due 24-hour technical/indexability observation without an SEO-success verdict, and pursue external authority only after its exact candidate receives separate approval.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-27-source-backed-research-knowledge-base-locales authority-path correction

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-27-source-backed-research-knowledge-base-locales
- Observed at: 2026-08-28T04:22:23Z
- Readout: correction
- Status: measuring
- Evidence: Current `0x11c11e/awesome-ai-research-tools` is public, non-archived, CC0-1.0, at 67 GitHub stars, last pushed `2026-08-15T04:00:55Z`, and has no Wenlan duplicate. Its owner recently rejected a maintainer submission partly because the same product was being added to several Awesome lists and the activity read as promotion. Because Wenlan already has multiple directory submissions, hold this low-reach path. Current Wenlan source main `76a127bf3779b2aa5d9a6b7601159cf88b908499` names researchers and proves the relevant workflow but has no direct research-guide link. A local-only four-README proposal adds that link in English, zh-Hant, zh-Hans, and Spanish and passes the README translation-sync checker, its self-test, and `git diff --check`.
- Result: pending
- Decision: wait
- Next step: Present `docs/seo-audits/2026-08-27-wenlan-research-readme-authority-proposal.patch` for separate source-repository publication approval. Do not submit the Awesome-list candidate, apply the source diff, push, open a pull request, message maintainers, or change account state under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-28-consultant-client-project-knowledge-base-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-28-consultant-client-project-knowledge-base-locales
- Status: active
- Data window: 2026-08-22..2026-08-28
- Asset class: net-new-search
- Launched: 2026-08-28
- Hypothesis: One client-scoped English, zh-TW, and zh-CN owner for maintaining approved consulting sources, research, decisions, deliverables, stale evidence, and a reproducible handoff can earn qualified consulting-workflow exposure without cannibalizing generic document ingestion, paper research, citation verification, or project-management intent.
- Candidate evidence: Separate English, Taiwan Traditional-Chinese, and mainland-parameter Simplified-Chinese SERP observations plus dated consulting-delivery, engagement-lifecycle, and research-workflow sources are stored in `docs/seo-scenario-backlog.json` and `docs/seo-audits/2026-08-28-consultant-client-knowledge-base-candidate.md` in their native units. They are not keyword volume, rank, authenticated GSC data, or causal evidence.
- Baseline: GSC property 7 clicks and 913 impressions; visible-query 2 clicks and 221 impressions; visibility gap 5 clicks and 692 impressions; Vercel 289 visitors with 257 direct and 28 attributed to Google; GitHub 51 stars; new target-page rows unavailable, all kept separate.
- Change: Publish exactly one English, zh-TW, and zh-CN canonical that isolates one client engagement, registers approved sources, records decisions and open questions, verifies deliverable claims, reviews stale evidence, and leaves a reproducible handoff. Explicitly exclude CRM ingestion, email or calendar sync, RBAC, automatic redaction, compliance, billing, and project management.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor join shows that document ingestion, paper research, citation verification, or project-management intent owns the same task.
- Stop criteria: Stop on a technical, confidentiality-boundary, unsupported product claim, duplicate-intent, controller-overlap, canonical, locale, responsive-render, or approval-boundary violation.
- 24h readout: pending technical and indexability observation after production completion
- 7d readout: pending early source-native GSC page/query and Vercel page/referrer observation
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: merge
- Next step: Publish the exact verified trilingual scope, wait for automatic Vercel production completion, verify the three live routes read-only, and keep request indexing and all other external actions separately gated.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-28-consultant-client-project-knowledge-base-locales publication approval

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-28-consultant-client-project-knowledge-base-locales
- Observed at: 2026-08-28T18:05:00Z
- Readout: correction
- Status: active
- Evidence: The user explicitly approved the locally verified English, zh-TW, and zh-CN consultant client-project knowledge-base family for commit, Git push, PR creation, merge, automatic Vercel deployment, and read-only production verification. The approved diff includes the scenario and intent controls, trilingual content, three stable same-locale inbound paths, safety boundaries, deterministic tests, and dated candidate record. Request indexing, GSC validation, analytics mutation, paid action, maintainer messaging, synthetic events, metric-definition changes, and unrelated external publication remain excluded.
- Result: pending
- Decision: merge
- Next step: Re-run the Goal and integration gates on the exact branch, commit and push only the approved files, merge after checks pass, verify the integrated commit and live deployment, and keep the production boundary fixed at Vercel completion.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-28-consultant-client-project-knowledge-base-locales production publication

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-28-consultant-client-project-knowledge-base-locales
- Observed at: 2026-08-29T04:59:15Z
- Readout: correction
- Status: measuring
- Evidence: PR #148 merged at `2026-08-29T04:58:27Z` as `8dc5990c2ed2892ce0afbd10962ea175cb53d534`; Vercel reported production deployment success at `2026-08-29T04:59:15Z`. The integrated commit passed the Goal, scenario, 45 goal tests, 247 SEO tests, 71 i18n tests, TypeScript, production build, and built technical audit. The English, zh-TW, and zh-CN live routes returned direct 200 responses with exact canonicals, reciprocal en-US/zh-TW/zh-CN/x-default hreflang, Article and BreadcrumbList schema, visible consulting-workflow answers, and no FAQPage schema. The deployed technical audit passed 144 sitemap URLs, 30 key pages, utility noindex headers, redirects, and bridge-host redirects. This proves publication and technical availability only; it is not a crawl, indexing, ranking, traffic, or causality claim.
- Result: pending
- Decision: wait
- Next step: Keep `2026-08-29T04:59:15Z` as the fixed production boundary. Record the 24-hour technical and indexability observation after `2026-08-30T04:59:15Z`, then the seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-05T04:59:15Z`. Judge each locale independently only after a confirmed post-deploy crawl and 28 complete post-crawl days with its original 20-page-impression, 3-qualified-joined-query-impression, and 1-click contract. Do not request indexing, submit GSC validation, mutate analytics, or publish externally under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-28-source-backed-investment-research-knowledge-base-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-28-source-backed-investment-research-knowledge-base-locales
- Status: active
- Data window: 2026-08-22..2026-08-28
- Asset class: net-new-search
- Launched: 2026-08-28
- Hypothesis: One company-scoped English, zh-TW, and zh-CN owner for maintaining annual reports, filings, earnings material, thesis changes, contradictions, stale evidence, and open questions can earn qualified investment-research exposure without cannibalizing generic document ingestion, paper research, consulting engagements, citation verification, or financial-data intent.
- Candidate evidence: Separate English, Taiwan Traditional-Chinese, and mainland-parameter Simplified-Chinese SERP observations plus a maintained first-party finance workflow, a Taiwan analyst workflow, maintained OSS research methods, and finance directories are stored in `docs/seo-scenario-backlog.json` and `docs/seo-audits/2026-08-28-investment-research-knowledge-base-candidate.md` in native units. They are not authenticated GSC data, Wenlan rank, causal evidence, or proof that broad finance queries share this intent.
- Baseline: GSC property 7 clicks and 913 impressions; visible-query 2 clicks and 221 impressions; visibility gap 5 clicks and 692 impressions; Vercel 289 visitors with 257 direct and 28 attributed to Google; GitHub 51 stars; new target-page rows unavailable, all kept separate.
- Change: Publish exactly one English, zh-TW, and zh-CN canonical that registers user-provided company disclosures, separates reported facts from calculations and judgments, compares reporting periods, preserves citations and thesis invalidation, and reviews stale evidence. Explicitly exclude live market data, licensed transcripts or research, XBRL, reliable table extraction, valuation, portfolio monitoring, trading signals, and investment advice.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor join assigns the same task to generic document ingestion, paper research, consulting, citation verification, or live financial-data intent.
- Stop criteria: Stop on a technical, financial-capability, investment-advice, duplicate-intent, controller-overlap, canonical, locale, responsive-render, or approval-boundary violation.
- 24h readout: pending technical and indexability observation after production completion
- 7d readout: pending early source-native GSC page/query and Vercel page/referrer observation
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: merge
- Next step: Publish the exact verified trilingual scope, wait for automatic Vercel production completion, verify the three live routes read-only, and keep request indexing and all other external actions separately gated.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-28-source-backed-investment-research-knowledge-base-locales publication approval

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-28-source-backed-investment-research-knowledge-base-locales
- Observed at: 2026-08-29T05:55:25Z
- Readout: correction
- Status: active
- Evidence: The user explicitly approved the locally verified English, zh-TW, and zh-CN investment-research knowledge-base family for commit, Git push, PR creation, merge, automatic Vercel deployment, and read-only production verification. The approved diff includes the scenario and intent controls, trilingual content, three stable same-locale inbound paths, finance-specific limitations, deterministic tests, and dated candidate record.
- Result: pending
- Decision: merge
- Next step: Re-run the Goal and integration gates on the exact branch, commit and push only the approved files, merge after required checks pass, verify the integrated commit and live deployment, and keep request indexing, GSC validation, analytics mutation, directory submission, paid action, maintainer messaging, synthetic events, metric-definition changes, and unrelated external publication excluded.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-28-source-backed-investment-research-knowledge-base-locales production publication

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-28-source-backed-investment-research-knowledge-base-locales
- Observed at: 2026-08-29T06:04:09Z
- Readout: correction
- Status: measuring
- Evidence: PR #150 merged at `2026-08-29T06:01:49Z` as `b9fb06d1eb0fdd3c07c0a271332f8166c9fcef6e`; Vercel reported production deployment success at `2026-08-29T06:02:35Z`. The merged tree is identical to the fully verified branch tree. The English, zh-TW, and zh-CN live routes returned direct 200 responses with exact canonicals, reciprocal en-US/zh-TW/zh-CN/x-default hreflang, Article and BreadcrumbList schema, visible filing-to-thesis workflow, and no FAQPage schema. The deployed technical audit passed 147 sitemap URLs, 30 key pages, utility noindex headers, redirects, and bridge-host redirects. This proves publication and technical availability only; it is not a crawl, indexing, ranking, traffic, or causality claim.
- Result: pending
- Decision: wait
- Next step: Keep `2026-08-29T06:02:35Z` as the fixed production boundary. Record the 24-hour technical and indexability observation after `2026-08-30T06:02:35Z`, then the seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-05T06:02:35Z`. Judge each locale independently only after a confirmed post-deploy crawl and 28 complete post-crawl days with its original 20-page-impression, 3-qualified-joined-query-impression, and 1-click contract. The now-open production slot may be used for the next independently gated scenario; do not request indexing, submit GSC validation, mutate analytics, or publish externally under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-28-product-research-to-prd-knowledge-base-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-28-product-research-to-prd-knowledge-base-locales
- Status: active
- Data window: 2026-08-22..2026-08-28
- Asset class: net-new-search
- Launched: 2026-08-28
- Hypothesis: One product-scoped English, zh-TW, and zh-CN owner for preserving dated user evidence, contradictions, assumptions, open questions, requirement rationale, and decision history before PRD drafting can earn qualified product-research exposure without cannibalizing generic document ingestion, academic research, consulting, investment research, or citation-verification intent.
- Candidate evidence: Separate English, Taiwan Traditional-Chinese, and Simplified-Chinese SERP observations, native-unit Google Trends indices, current practitioner workflows, and maintained OSS workflows are stored in `docs/seo-scenario-backlog.json` and `docs/seo-audits/2026-08-28-product-research-prd-knowledge-base-candidate.md`. They are not authenticated GSC data, keyword volume, exact rank, or causal evidence.
- Baseline: GSC property 7 clicks and 913 impressions; visible-query 2 clicks and 221 impressions; visibility gap 5 clicks and 692 impressions; Vercel 289 visitors with 257 direct and 28 attributed to Google; GitHub 51 stars; new target-page rows unavailable, all kept separate.
- Change: Publish exactly one English, zh-TW, and zh-CN canonical that registers approved product evidence, separates observations from interpretations and decisions, preserves contradictions and assumptions, maps requirement claims to sources, and leaves open questions visible before PRD drafting. Explicitly exclude transcription, PII redaction, research recruiting, analytics ingestion, Jira, Linear, Slack or CRM integration, automatic prioritization, automatic PRD generation, roadmap decisions, and product-outcome claims.
- Publish date: 2026-08-29
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor join assigns the same task to generic document ingestion, academic research, consulting, investment research, citation verification, or product-management software intent.
- Stop criteria: Stop on a technical, unsupported product claim, duplicate-intent, controller-overlap, canonical, locale, responsive-render, or approval-boundary violation.
- 24h readout: pending technical and indexability observation after 2026-08-30T06:44:59Z
- 7d readout: pending early source-native GSC page/query and Vercel page/referrer observation after 2026-09-05T06:44:59Z
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Keep the published canonical family stable, record the due technical and source-native readouts, and pursue the predeclared authority path only after its exact external change receives separate approval.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-28-product-research-to-prd-knowledge-base-locales publication approval

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-28-product-research-to-prd-knowledge-base-locales
- Observed at: 2026-08-29T06:43:32Z
- Readout: correction
- Status: active
- Evidence: By this observation, the current task contained the user's explicit approval for the locally verified English, zh-TW, and zh-CN product-research-to-PRD family to be committed, pushed, opened as a PR, merged, automatically deployed by Vercel, and verified read-only in production. Request indexing, GSC validation, analytics mutation, OSS contribution, maintainer messaging, paid action, synthetic events, metric-definition changes, and unrelated external publication remained excluded.
- Result: pending
- Decision: merge
- Next step: Merge only after required checks pass, verify the integrated commit and production deployment, and keep the production boundary fixed at Vercel completion.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-28-product-research-to-prd-knowledge-base-locales production publication

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-28-product-research-to-prd-knowledge-base-locales
- Observed at: 2026-08-29T06:44:59Z
- Readout: correction
- Status: measuring
- Evidence: PR #152 merged at `2026-08-29T06:43:59Z` as `66f7b012f25174cac63e94dcec8b27b9b3d6e5e2`; Vercel reported production deployment success at `2026-08-29T06:44:59Z`. The integrated commit passed the Goal, scenario, 47 goal tests, 249 SEO tests, 73 i18n tests, TypeScript, production build, and built technical audit. The English, zh-TW, and zh-CN live routes returned direct 200 responses with exact canonicals, reciprocal en-US/zh-TW/zh-CN/x-default hreflang, Article and BreadcrumbList schema, visible evidence-to-PRD workflow, three visible FAQ items, and no FAQPage schema. The deployed technical audit passed all 150 sitemap URLs, key pages, utility noindex headers, redirects, and bridge-host redirects. This proves publication and technical availability only; it is not a crawl, indexing, ranking, traffic, or causality claim.
- Result: pending
- Decision: wait
- Next step: Keep `2026-08-29T06:44:59Z` as the fixed production boundary. Record the 24-hour technical and indexability observation after `2026-08-30T06:44:59Z`, then the seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-05T06:44:59Z`. Judge each locale independently only after a confirmed post-deploy crawl and 28 complete post-crawl days with its original 20-page-impression, 3-qualified-joined-query-impression, and 1-click contract. Do not request indexing, submit GSC validation, mutate analytics, or publish externally under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-29-sre-incident-knowledge-base-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-29-sre-incident-knowledge-base-locales
- Status: approved
- Data window: 2026-08-29..2026-09-04
- Asset class: net-new-search
- Launched: 2026-08-29
- Hypothesis: One English, zh-TW, and zh-CN owner for maintaining source-backed runbooks and postmortem knowledge can earn qualified discovery from SRE and on-call searches without claiming monitoring, incident-management, or automatic-remediation features.
- Candidate evidence: Dated official Microsoft and AWS documentation, current English Reddit SRE discussions, a Taiwan-localized Microsoft workflow, a Simplified-Chinese SRE practice whitepaper, and a Chinese runbook-maintenance guide independently repeat stale runbooks, missing incident learning, reproducible procedures, and post-incident review. Full provenance remains in `docs/seo-scenario-backlog.json` and `docs/seo-audits/2026-08-29-sre-incident-knowledge-base-candidate.md`.
- Baseline: Target-page GSC and Vercel rows are unavailable before publication. Keep them unavailable rather than zero. Google Trends returned no inspectable series in this pass, so no relative index or keyword volume is recorded.
- Change: Prepare exactly one English, zh-TW, and zh-CN canonical that turns approved runbooks, postmortems, architecture notes, and sanitized incident summaries into a reviewed operational Page with source revisions, stale state, safety limits, abort conditions, verification signals, owners, and test results. Explicitly exclude monitoring, alerts, live telemetry, automatic RCA, incident command, runbook execution, approvals, credentials, and emergency access.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor query-page join assigns the task to incident-management software, generic runbook templates, or an existing Wenlan owner.
- Stop criteria: Stop on a technical, unsafe operational claim, unsupported product capability, duplicate-intent, canonical, locale, responsive-render, controller-overlap, or approval-boundary violation.
- 24h readout: pending only after a production deployment is separately approved and completed
- 7d readout: pending only after a production deployment is separately approved and completed
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Finish deterministic and visual verification, then stop for exact publication approval. Do not commit, push, open or merge a PR, deploy, request indexing, submit GSC validation, mutate analytics, change the source repository, or publish externally under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-29-sre-incident-knowledge-base-locales publication approval

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-29-sre-incident-knowledge-base-locales
- Observed at: 2026-08-30T04:19:59Z
- Readout: correction
- Status: active
- Evidence: The user explicitly approved the locally verified English, zh-TW, and zh-CN SRE incident knowledge-base family for commit, Git push, PR creation, merge, automatic Vercel deployment, and read-only production verification. GitHub Releases was re-read before publication and confirmed `v0.17.4` as the authoritative current product release; its separate website-alignment commit resolves the pre-existing release-contract failures without mixing that repair into the SRE experiment commit.
- Result: pending
- Decision: merge
- Next step: Run the complete Goal, scenario, SEO, i18n, TypeScript, production-build, and technical gates on the combined branch; commit the SRE family separately; push, open and merge the PR only after checks pass; then verify the integrated commit and live production routes. Request indexing, GSC validation, analytics mutation, source-repository changes, paid action, maintainer messaging, synthetic events, metric-definition changes, and unrelated external publication remain excluded.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-29-sre-incident-knowledge-base-locales production publication

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-29-sre-incident-knowledge-base-locales
- Observed at: 2026-08-30T05:08:59Z
- Readout: correction
- Status: measuring
- Evidence: PR #155 merged at `2026-08-30T05:05:37Z` as `1e05812ed436f1ff829f0c523bdf9755772f3c92`; Vercel reported production deployment success at `2026-08-30T05:06:25Z`. The integrated commit passed the Goal, scenario, 49 goal tests, 251 SEO tests, 75 i18n tests, TypeScript, production build, and built technical audit. The English, zh-TW, and zh-CN live routes returned direct 200 responses with exact canonicals, reciprocal en-US/zh-TW/zh-CN/x-default hreflang, Article and BreadcrumbList schema dated `2026-08-29`, visible SRE runbook and postmortem answers, exact 393px rendering, and no FAQPage schema, overflow, framework overlay, console warning, or console error. The deployed technical audit passed all 153 sitemap URLs, 30 key pages, utility noindex headers, redirects, and bridge-host redirects. The public download page also rendered authoritative `v0.17.4`, notarized macOS DMG copy, and the exact GitHub release link. This proves publication and technical availability only; it is not a crawl, indexing, ranking, traffic, or causality claim.
- Result: pending
- Decision: wait
- Next step: Keep `2026-08-30T05:06:25Z` as the fixed production boundary. Record the 24-hour technical and indexability observation after `2026-08-31T05:06:25Z`, then the seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-06T05:06:25Z`. Judge each locale independently only after a confirmed post-deploy crawl and 28 complete post-crawl days with its original 20-page-impression, 3-qualified-joined-query-impression, and 1-click contract. Do not request indexing, submit GSC validation, mutate analytics, change the source repository, message maintainers, buy traffic, generate synthetic events, change metric definitions, or publish externally under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-28-consultant-client-project-knowledge-base-locales 24h technical and indexability

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-28-consultant-client-project-knowledge-base-locales
- Observed at: 2026-08-30T06:33:09Z
- Readout: 24h
- Status: measuring
- Evidence: The fixed production boundary was `2026-08-29T04:59:15Z`. At `2026-08-30T06:30:32Z`, direct GETs for the English, zh-TW, and zh-CN canonicals each returned 200 with no redirect, exact self-canonical, reciprocal en-US/zh-TW/zh-CN/x-default hreflang, sitemap membership, Article and BreadcrumbList, visible consulting task, limitations, and FAQ, and no FAQPage schema. The latest preserved authenticated GSC and Vercel capture covers `2026-07-31..2026-08-27`, ending before publication: GSC property is 7 clicks / 913 impressions, visible-query is 2 / 221, and the 5-click / 692-impression visibility gap remains separate. No target page or target query-page row appears, so every locale target observation is unavailable rather than zero. Vercel remains 289 visitors / 690 pageviews, with direct and referrer rows separate; no target page or source-to-page row exists. GitHub is 51 stars, separately. No persisted authenticated URL Inspection evidence exists for this family, so post-deploy crawl and indexability remain unavailable.
- Result: inconclusive
- Decision: wait
- Next step: Run the due seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-05T04:59:15Z`; do not request indexing, submit validation, mutate analytics, or publish externally.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-28-source-backed-investment-research-knowledge-base-locales 24h technical and indexability

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-28-source-backed-investment-research-knowledge-base-locales
- Observed at: 2026-08-30T06:33:09Z
- Readout: 24h
- Status: measuring
- Evidence: The fixed production boundary was `2026-08-29T06:02:35Z`. At `2026-08-30T06:30:32Z`, direct GETs for the English, zh-TW, and zh-CN canonicals each returned 200 with no redirect, exact self-canonical, reciprocal en-US/zh-TW/zh-CN/x-default hreflang, sitemap membership, Article and BreadcrumbList, visible filing-to-thesis task, limitations, and FAQ, and no FAQPage schema. The latest preserved authenticated GSC and Vercel capture covers `2026-07-31..2026-08-27`, ending before publication: GSC property is 7 clicks / 913 impressions, visible-query is 2 / 221, and the 5-click / 692-impression visibility gap remains separate. No target page or target query-page row appears, so every locale target observation is unavailable rather than zero. Vercel remains 289 visitors / 690 pageviews, with direct and referrer rows separate; no target page or source-to-page row exists. GitHub is 51 stars, separately. No persisted authenticated URL Inspection evidence exists for this family, so post-deploy crawl and indexability remain unavailable.
- Result: inconclusive
- Decision: wait
- Next step: Run the due seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-05T06:02:35Z`; do not request indexing, submit validation, mutate analytics, or publish externally.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-28-product-research-to-prd-knowledge-base-locales 24h

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-28-product-research-to-prd-knowledge-base-locales
- Observed at: 2026-08-30T06:45:29Z
- Readout: 24h
- Status: measuring
- Evidence: The fixed production boundary was `2026-08-29T06:44:59Z`. At `2026-08-30T06:45:31Z`, direct GETs for the English, zh-TW, and zh-CN product-research-to-PRD canonicals each returned 200 with no redirect, exact self-canonical, reciprocal en-US/zh-TW/zh-CN/x-default hreflang, sitemap membership, Article and BreadcrumbList, visible evidence-to-PRD task, limitations, and FAQ, and no FAQPage schema. The latest preserved authenticated GSC and Vercel capture covers `2026-07-31..2026-08-27`, ending before publication: GSC property is 7 clicks / 913 impressions, visible-query is 2 / 221, and the 5-click / 692-impression visibility gap remains separate. No target page or target query-page row appears, so every locale target observation is unavailable rather than zero. Vercel remains 289 visitors / 690 pageviews, with direct and referrer rows separate; no target page or source-to-page row exists. GitHub is 51 stars, separately. No persisted authenticated URL Inspection evidence exists for this family, so post-deploy crawl and indexability remain unavailable.
- Result: inconclusive
- Decision: wait
- Next step: Run the due seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-05T06:44:59Z`; do not request indexing, submit validation, mutate analytics, or publish externally.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-30-competitive-intelligence-knowledge-base-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-30-competitive-intelligence-knowledge-base-locales
- Status: active
- Data window: 2026-08-29..2026-09-04
- Asset class: net-new-search
- Launched: 2026-08-30
- Hypothesis: One English, zh-TW, and zh-CN owner for maintaining permitted competitor evidence can earn qualified discovery from competitive-intelligence and competitor-research searches without cannibalizing generic research, product research before a PRD, consulting delivery, investment research, document ingestion, citation verification, or AI knowledge-base tool-selection intent.
- Candidate evidence: Dated English, Taiwan Traditional-Chinese, and Simplified-Chinese practitioner sources and separate result observations repeat source registers, evidence chains, scoped comparison, continuous updates, revision or date tracking, and human review. Full provenance remains in `docs/seo-scenario-backlog.json` and `docs/seo-audits/2026-08-30-competitive-intelligence-knowledge-base-candidate.md`. These observations are not authenticated GSC data, keyword volume, exact rank, or causal evidence.
- Baseline: The latest completed authenticated range is `2026-07-31..2026-08-27`: GSC property 7 clicks and 913 impressions; visible-query 2 clicks and 221 impressions; visibility gap 5 clicks and 692 impressions; Vercel 289 visitors and 690 pageviews; GitHub 51 stars. New target-page and joined-query rows are unavailable rather than zero, and every source remains separate.
- Change: Prepare exactly one English, zh-TW, and zh-CN canonical that bounds one decision and competitor set, registers permitted sources with dates and revisions, separates observations from inferences and assumptions, preserves contradictions and stale claims, and requires human review before a battlecard, product decision, or positioning update. Explicitly exclude competitor discovery, crawling, scraping, live monitoring, current pricing or review collection, alerts, automatic scoring or recommendations, and legal or commercial decisions.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor query-page join assigns the task to generic research, product research, consulting, investment research, tool selection, live competitor monitoring, or an existing Wenlan owner.
- Stop criteria: Stop on a technical, unsupported collection or decision claim, duplicate-intent, controller-overlap, canonical, locale, responsive-render, authority-path, or approval-boundary violation.
- 24h readout: pending only after a production deployment is separately approved and completed
- 7d readout: pending only after a production deployment is separately approved and completed
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Finish deterministic and visual verification, then stop for exact publication approval. Do not commit, push, open or merge a PR, deploy, request indexing, submit GSC validation, mutate analytics, open an OSS issue or pull request, message maintainers, buy traffic, generate synthetic events, or publish externally under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-30-competitive-intelligence-knowledge-base-locales at 2026-08-30T17:07:28Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-30-competitive-intelligence-knowledge-base-locales
- Observed at: 2026-08-30T17:07:28Z
- Readout: correction
- Status: active
- Evidence: Goal and scenario verifiers passed; focused scenario and intent tests passed 14/14; Goal tests passed 50/50; i18n passed 76/76; SEO passed 252/252; TypeScript lint passed; the production build generated 271 static pages; the built technical audit passed with 156 sitemap owners, 24 key pages, and no FAQPage in 160 built HTML files. Fresh in-app Browser checks covered English, zh-TW, and zh-CN at desktop and exact 393px mobile width. Every route had one H1, one exact canonical, reciprocal hreflang, Article and BreadcrumbList schema, no horizontal overflow, no console warning or error, a loaded product-evidence image, and an expandable visible FAQ. Source-native DOM checks confirmed one article, one product-evidence panel, and one instance of each H2; duplication seen in an earlier stitched full-page capture was a capture artifact rather than rendered DOM duplication. The pages remain unpublished and unindexed.
- Result: pending
- Decision: wait
- Next step: Stop for exact commit, push, PR, merge, automatic Vercel deployment, and production-read verification approval. Request indexing and the declared OSS authority proposal remain separate approval decisions.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-30-competitive-intelligence-knowledge-base-locales at 2026-08-30T17:47:52Z

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-30-competitive-intelligence-knowledge-base-locales
- Observed at: 2026-08-30T17:47:52Z
- Readout: correction
- Status: active
- Evidence: The candidate was reconstructed from current `origin/main` `d94b807cc83f66ac5be85500682066fdb68d0d05` in an isolated clean worktree with unrelated dirty hunks excluded. Goal tests passed 50/50, i18n passed 76/76, SEO passed 252/252 with explicit authoritative sibling checkout paths, TypeScript passed, the production build generated 271/271 static pages, and the built technical audit passed with 156 sitemap owners, 24 required pages, and no FAQPage in 160 built HTML files. The first valid exact 393px Mandarin renders exposed semantic splits in `競品檔案` / `竞品档案`, `證據` / `证据`, and `追溯`; the existing localized renderer seam and fail-closed i18n contract now protect them. Fresh English, zh-TW, and zh-CN desktop and exact 393px captures have the correct viewport, canonical, reciprocal hreflang, Article and BreadcrumbList schema, one article and product-evidence panel, loaded image, expandable FAQ, no document overflow, no console warning or error, and no remaining protected-phrase split. Full provenance is in `docs/seo-audits/2026-08-30-competitive-intelligence-clean-rebuild-verification.md`.
- Result: pending
- Decision: wait
- Next step: Stop for exact commit, push, pull request, merge, automatic Vercel deployment, and read-only production verification approval. Request indexing, GSC validation, analytics mutation, maintainer contact, the planned OSS authority proposal, paid actions, synthetic events, and other external publication remain separate decisions.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-30-competitive-intelligence-knowledge-base-locales publication approval

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-30-competitive-intelligence-knowledge-base-locales
- Observed at: 2026-08-30T19:44:10Z
- Readout: correction
- Status: active
- Evidence: The user explicitly approved the exact isolated `codex/competitive-intelligence-knowledge-base` candidate for commit, Git push, pull request creation, merge, automatic Vercel deployment, and read-only production verification. The candidate is based on current `origin/main` `d94b807cc83f66ac5be85500682066fdb68d0d05`; the complete clean verification receipt and publication manifest remain part of the approved scope.
- Result: pending
- Decision: merge
- Next step: Commit and push only the clean manifest-owned diff, open and merge its pull request in turn, verify the integrated commit, wait for the automatic Vercel deployment, and verify all three production routes. Do not request indexing, submit GSC validation, mutate analytics, contact maintainers, publish the separately planned OSS authority proposal, buy traffic, generate synthetic events, or perform another external action.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-30-competitive-intelligence-knowledge-base-locales production publication

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-30-competitive-intelligence-knowledge-base-locales
- Observed at: 2026-08-30T23:40:14Z
- Readout: correction
- Status: measuring
- Evidence: PR #158 merged at `2026-08-30T19:47:24Z` as `f68b16b82d1c6c28f816c4ab0cf5c164232fe3c1`; Vercel reported production deployment success at `2026-08-30T19:48:14Z`. The integrated commit passed the Goal, scenario, 50 Goal tests, 252 SEO tests, 76 i18n tests, TypeScript, the 271-page production build, and the 156-owner built technical audit. The deployed audit passed robots, sitemap, key pages, utility noindex surfaces, redirects, bridge-host redirects, and sitemap-wide FAQPage absence. English, zh-TW, and zh-CN returned direct 200 with exact canonicals, reciprocal hreflang, Article and BreadcrumbList schema, visible bounded competitor-dossier answers, loaded product evidence, and visible FAQ without FAQPage. Exact `393x852` and `1280x900` production checks found no overflow, broken image, console warning or error, or protected CJK phrase split. This proves publication and technical availability only; it is not a crawl, indexing, rank, impression, click, visitor, or causal result.
- Result: pending
- Decision: wait
- Next step: Keep `2026-08-30T19:48:14Z` as the fixed production boundary. Record the 24-hour technical and indexability observation after `2026-08-31T19:48:14Z`, then the seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-06T19:48:14Z`. Judge each locale independently only after a confirmed post-deploy crawl and 28 complete post-crawl days with at least 20 target-page impressions, 3 qualified joined-query impressions, and 1 GSC click. Do not request indexing, submit GSC validation, mutate analytics, publish the planned OSS proposal, message maintainers, buy traffic, generate synthetic events, or perform another external action under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Campaign readout: authority follow-up and ICT supplier due-diligence gate at 2026-08-31

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-30-competitive-intelligence-knowledge-base-locales
- Observed at: 2026-08-31T00:13:40Z
- Readout: correction
- Status: measuring
- Evidence: The user-approved one-time follow-up was posted to `awesome-selfhosted/awesome-selfhosted-data#2955` at `https://github.com/awesome-selfhosted/awesome-selfhosted-data/pull/2955#issuecomment-5472149912`. The comment only offered to adjust metadata or category when maintainers review the existing one-file submission. It remains attempted distribution, not earned authority: count it only after the PR is merged and the listing is visibly rendered upstream. No backlink, acceptance, or traffic is assumed, and no further maintainer contact is authorized under this record. Separately, the trilingual `ict-supplier-due-diligence-evidence-pack` candidate passes provenance, repeated demand, separate locale SERP, clean gap, Wenlan first-party proof, standalone utility, internal links, and its conditional authority-path gate. Full native-unit evidence is recorded in `docs/seo-scenario-backlog.json` and `docs/seo-audits/2026-08-30-ict-supplier-due-diligence-demand-gate.md`; it is not GSC data, keyword volume, rank, backlink, or causal evidence.
- Result: inconclusive
- Decision: scale
- Next step: The production slot is open. Prepare the supplier family's English, zh-TW, and zh-CN pages locally while keeping it `net-new` / `not-published`; publication still requires a separate exact website approval. The conditional `mohitagw15856/pm-claude-skills/blob/main/skills/vendor-security-review/SKILL.md` path requires a separate contribution decision; maintainer acceptance and any backlink are not assumed. Do not open another OSS issue or PR, request indexing, validate GSC, mutate analytics, buy traffic, generate synthetic events, or publish externally under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-30-ict-supplier-due-diligence-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-30-ict-supplier-due-diligence-locales
- Status: active
- Data window: 2026-08-29..2026-09-04
- Asset class: net-new-search
- Launched: 2026-08-30
- Hypothesis: One English, zh-TW, and zh-CN owner for a source-bounded ICT/software supplier due-diligence evidence pack can earn qualified discovery from supplier-security and due-diligence searches without cannibalizing investment research, RFP preparation, document ingestion, citation verification, tool selection, consulting, SRE, or competitive-intelligence intent.
- Candidate evidence: Dated NIST, Taiwan NICS, New Taipei procurement, Microsoft supplier-assurance, separate locale result observations, maintained Wenlan source, overlap, internal-link, and conditional authority-path evidence is stored in `docs/seo-scenario-backlog.json` and `docs/seo-audits/2026-08-30-ict-supplier-due-diligence-demand-gate.md`. These observations are not authenticated GSC data, keyword volume, exact rank, backlink, or causal evidence.
- Baseline: The latest completed authenticated range is `2026-07-31..2026-08-27`: GSC property 7 clicks and 913 impressions; visible-query 2 clicks and 221 impressions; visibility gap 5 clicks and 692 impressions; Vercel 289 visitors and 690 pageviews; GitHub 51 stars. New target-page and joined-query rows are unavailable rather than zero, and every source remains separate.
- Change: Publish exactly one English, zh-TW, and zh-CN canonical that registers approved supplier sources, provenance, data-access scope, resilience and security evidence, dependencies, gaps, questions, owner, and review date. Explicitly exclude certification validation, legal or privacy advice, vendor discovery, crawling, live monitoring, vulnerability scanning, automatic scoring, approval/rejection, and material outside approved controls.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor query-page join assigns the task to an existing owner or unsupported compliance, monitoring, scoring, or procurement-decision intent.
- Stop criteria: Stop on a technical, unsupported compliance or decision claim, duplicate-intent, controller-overlap, canonical, locale, responsive-render, authority-path, or approval-boundary violation.
- 24h readout: pending only after the production deployment completes
- 7d readout: pending only after the production deployment completes
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: merge
- Next step: Implement and verify the exact three-locale family, commit and push the bounded diff, open and merge one pull request, wait for automatic Vercel deployment, and verify all three production routes. Do not request indexing, submit GSC validation, mutate analytics, contribute to `pm-claude-skills`, contact another maintainer, buy traffic, generate synthetic events, or perform unrelated external publication.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-30-ict-supplier-due-diligence-locales local verification

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-30-ict-supplier-due-diligence-locales
- Observed at: 2026-08-31T01:23:11Z
- Readout: correction
- Status: active
- Evidence: The isolated candidate passed Goal and scenario verification with 15 trilingual families and 159 sitemap owners, 51/51 Goal tests, 253/253 SEO tests, 77/77 i18n tests, TypeScript lint, the 275-page production build, and the built technical audit with 159 sitemap URLs, 24 required pages, and no FAQPage in 163 built HTML pages. Fresh in-app Browser checks covered English, zh-TW, and zh-CN at exact `393x852` mobile and `1280x900` desktop sizes in light and dark themes. Every route had one H1, an exact self-canonical, reciprocal en-US/zh-TW/zh-CN/x-default hreflang, Article and BreadcrumbList schema, a loaded product-evidence image, visible FAQ without FAQPage, no horizontal overflow, and no console warning or error. Protected Traditional- and Simplified-Chinese supplier due-diligence phrases rendered without mobile splits. This is local technical evidence only; the pages remain unpublished and unindexed.
- Result: pending
- Decision: merge
- Next step: Commit and push the bounded candidate, open and merge one pull request, verify the integrated commit, wait for automatic Vercel production deployment, and verify all three live routes. Do not request indexing, submit GSC validation, mutate analytics, contribute to `pm-claude-skills`, contact another maintainer, buy traffic, generate synthetic events, or perform unrelated external publication.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-30-ict-supplier-due-diligence-locales production publication

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-30-ict-supplier-due-diligence-locales
- Observed at: 2026-08-31T01:26:37Z
- Readout: correction
- Status: measuring
- Evidence: PR #160 merged at `2026-08-31T01:25:45Z` as `6608763f95f016a611041ddf50324e2ac616c77e`; Vercel reported production deployment success at `2026-08-31T01:26:37Z`. The integrated commit passed Goal and scenario verification, 51/51 Goal tests, 253/253 SEO tests, 77/77 i18n tests, TypeScript lint, the 275-page production build, and the 159-owner built technical audit. A fresh merged-diff read found the expected route, locale, internal-link, and bounded-capability changes without semantic integration conflict. The deployed audit passed robots, all 159 sitemap URLs, 30 key pages, utility noindex surfaces, redirects, bridge hosts, and sitemap-wide FAQPage absence. English, zh-TW, and zh-CN returned direct 200 with exact canonicals, reciprocal hreflang, Article and BreadcrumbList schema, visible bounded supplier-evidence answers, loaded product evidence in the exact mobile checks, visible FAQ without FAQPage, no horizontal overflow, and no console warning or error. This proves publication and technical availability only; it is not a crawl, indexing, rank, impression, click, visitor, authority, or causal result.
- Result: pending
- Decision: wait
- Next step: Keep `2026-08-31T01:26:37Z` as the fixed production boundary. Record the 24-hour technical and indexability observation after `2026-09-01T01:26:37Z`, then the seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-07T01:26:37Z`. Judge each locale independently only after a confirmed post-deploy crawl and 28 complete post-crawl days with at least 20 target-page impressions, 3 qualified joined-query impressions, and 1 GSC click. Do not request indexing, submit GSC validation, mutate analytics, contribute to `pm-claude-skills`, contact maintainers, buy traffic, generate synthetic events, or perform another external action under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-29-sre-incident-knowledge-base-locales 24h technical and indexability

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-29-sre-incident-knowledge-base-locales
- Observed at: 2026-08-31T05:06:46Z
- Readout: 24h
- Status: measuring
- Evidence: The fixed production boundary remains `2026-08-30T05:06:25Z`. Direct live GETs for the English, zh-TW, and zh-CN canonicals each returned 200 with no redirect, exact self-canonical, reciprocal en-US/zh-TW/zh-CN/x-default hreflang, sitemap membership, Article and BreadcrumbList dated `2026-08-29`, visible runbook, postmortem or incident-review, safety-limit, and FAQ answers, and no FAQPage schema. The latest successfully completed authenticated Friday capture covers `2026-07-31..2026-08-27`, ending before publication: GSC property is 7 clicks / 913 impressions, visible-query is 2 / 221, and the 5-click / 692-impression visibility gap remains separate. No SRE target-page or joined query-page row exists in that pre-deploy range, so all three locale observations are unavailable rather than zero. Vercel remains 289 visitors / 690 pageviews; direct is 257 visitors / 654 pageviews, and qualified referrers remain separate. No SRE page or source-to-page row exists in the preserved range. GitHub is 51 stars at the report's `2026-08-28T16:02:33.553Z` capture. Authenticated URL Inspection was unavailable in this task, so post-deploy crawl and indexing state remain unavailable. Independently, GitHub Releases now reports immutable `v0.17.6`, published `2026-08-31T00:25:35Z`, with 12 asset downloads at capture time, while the live download page still renders `v0.17.5`; this is a release-alignment finding, not SRE traffic evidence.
- Result: inconclusive
- Decision: wait
- Next step: Run the seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-06T05:06:25Z`. Separately align the website to immutable `v0.17.6` only with explicit publication approval. Do not request indexing, submit GSC validation, mutate analytics, contact maintainers, buy traffic, generate synthetic events, change metric definitions, or publish externally under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-31-customer-support-answer-knowledge-base-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-31-customer-support-answer-knowledge-base-locales
- Status: measuring
- Data window: 2026-08-29..2026-09-04
- Asset class: net-new-search
- Launched: 2026-08-31
- Hypothesis: One English, zh-TW, and zh-CN owner for maintaining approved customer-support answers can earn qualified discovery from customer-support knowledge-base searches without cannibalizing generic document ingestion, citation verification, stale-page repair, retrieval regression, or broad AI-customer-support platform intent.
- Candidate evidence: Ubersuggest's US report, KCS, Microsoft, Emergent, separate Taiwan Traditional-Chinese and Simplified-Chinese result observations, maintained Wenlan source, overlap, internal-link, and conditional authority-path evidence remain in `docs/seo-scenario-backlog.json` and `docs/seo-audits/2026-08-30-customer-support-answer-knowledge-base-demand-gate.md`. These observations are not authenticated GSC data, Taiwan or China keyword volume, exact rank, backlink, or causal evidence.
- Baseline: The latest completed authenticated range is `2026-07-31..2026-08-27`: GSC property 7 clicks and 913 impressions; visible-query 2 clicks and 221 impressions; visibility gap 5 clicks and 692 impressions; Vercel 289 visitors and 690 pageviews; GitHub 51 stars. New target-page and joined-query rows are unavailable rather than zero, and every source remains separate.
- Change: Publish exactly one English, zh-TW, and zh-CN canonical that turns approved product and policy documents into one reviewable support-answer pack with the customer question, supported answer, scope, prohibited promise, escalation condition, source revision, owner, and next review date. Explicitly exclude ticket or CRM ingestion, raw customer conversations, PII handling, team permissions, support analytics, automatic policy approval, customer-facing publication, reply generation or delivery, channel synchronization, and automatic escalation.
- Publish date: 2026-08-31
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor query-page join assigns the task to an existing owner or unsupported help-desk, CRM, reply automation, or customer-data intent.
- Stop criteria: Stop on a technical, unsupported customer-support-platform claim, duplicate-intent, controller-overlap, canonical, locale, responsive-render, authority-path, or approval-boundary violation.
- 24h readout: pending after 2026-09-01T15:27:07Z
- 7d readout: pending after 2026-09-07T15:27:07Z
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Keep `2026-08-31T15:27:07Z` as the fixed production boundary. Record the 24-hour technical and indexability observation after `2026-09-01T15:27:07Z`, then the seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-07T15:27:07Z`. Do not request indexing, submit GSC validation, mutate analytics, publish the conditional `awesome-customer-success` proposal, contact maintainers, buy traffic, generate synthetic events, or perform another external action under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-31-customer-support-answer-knowledge-base-locales production publication

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-31-customer-support-answer-knowledge-base-locales
- Observed at: 2026-08-31T15:31:22Z
- Readout: correction
- Status: measuring
- Evidence: PR #164 merged at `2026-08-31T15:26:16Z` as `19636df9cdcc170639fab9c652353028b39ffd00`; Vercel reported production deployment success at `2026-08-31T15:27:07Z`. The integrated commit passed Goal and scenario verification, 52 Goal tests, 254 SEO tests, 79 i18n tests, TypeScript, the 279-page production build, and the 162-owner built technical audit. A fresh merged-diff read found the expected bounded route, locale, internal-link, CJK, and responsive-grid changes without semantic integration conflict. The deployed audit passed robots, all 162 sitemap URLs, 30 key pages, utility noindex surfaces, redirects, bridge hosts, and sitemap-wide FAQPage absence. English, zh-TW, and zh-CN returned direct 200 with exact canonicals, reciprocal hreflang, Article and BreadcrumbList schema, the visible bounded answer-pack task, loaded product evidence, and visible FAQ without FAQPage. Exact `393x852` and `1280x900` production checks found no overflow, broken image, console warning or error. This proves publication and technical availability only; it is not a crawl, indexing, rank, impression, click, visitor, authority, or causal result.
- Result: pending
- Decision: wait
- Next step: Keep `2026-08-31T15:27:07Z` as the fixed production boundary. Record the 24-hour technical and indexability observation after `2026-09-01T15:27:07Z`, then the seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-07T15:27:07Z`. Judge each locale independently only after a confirmed post-deploy crawl and 28 complete post-crawl days with at least 20 target-page impressions, 3 qualified joined-query impressions, and 1 GSC click. Do not request indexing, submit GSC validation, mutate analytics, publish the planned OSS proposal, message maintainers, buy traffic, generate synthetic events, or perform another external action under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-08-31-course-wiki-from-lecture-notes-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-08-31-course-wiki-from-lecture-notes-locales
- Status: active
- Data window: 2026-08-29..2026-09-04
- Asset class: net-new-search
- Launched: 2026-08-31
- Hypothesis: One English, zh-TW, and zh-CN owner for turning readable lecture slides, notes, and course PDFs into a maintained course wiki can earn qualified discovery without cannibalizing generic document ingestion, paper research, the general Karpathy / LLM Wiki implementation guide, or unsupported AI-study-product intent.
- Candidate evidence: Separate English, Taiwan Traditional-Chinese, and Simplified-Chinese SERP observations, request-relative Google Trends indexes, independent OSS course-material workflows, maintained Wenlan source, clean-gap, internal-link, and conditional authority-path evidence are stored in `docs/seo-scenario-backlog.json`, `docs/seo-audits/2026-08-31-next-scenario-demand-comparison.md`, and `docs/seo-audits/2026-08-31-course-wiki-from-lecture-notes-prelaunch.md`. These observations are not authenticated GSC data, keyword volume, Wenlan rank, backlink, or causal evidence.
- Baseline: The latest completed authenticated range is `2026-07-31..2026-08-27`: GSC property 7 clicks and 913 impressions; visible-query 2 clicks and 221 impressions; visibility gap 5 clicks and 692 impressions; Vercel 289 visitors and 690 pageviews; Google referrer 28 visitors and 29 pageviews; GitHub 51 stars. New target-page and joined-query rows are unavailable rather than zero, and every source remains separate.
- Change: Prepare exactly one English, zh-TW, and zh-CN canonical that turns one approved set of readable course materials into linked concept pages with a question, prerequisites, exact source locations, source revision, review state, reviewer, and next review trigger. Explicitly exclude flashcards, quizzes, audio or video transcription, OCR, grading, tutoring, homework solving, exam planning, automatic academic judgment, and NotebookLM equivalence.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor query-page join assigns the task to an existing owner or unsupported tutoring, assessment, transcription, OCR, flashcard, quiz, or exam-planning intent.
- Stop criteria: Stop on a technical, unsupported study-product claim, duplicate-intent, controller-overlap, canonical, locale, responsive-render, authority-path, or approval-boundary violation.
- 24h readout: pending only after a separately approved production deployment completes
- 7d readout: pending only after a separately approved production deployment completes
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Finish deterministic and rendered local verification, then stop for exact commit, push, PR, merge, automatic Vercel deployment, and read-only production-verification approval. Do not request indexing, submit GSC validation, mutate analytics, publish the conditional `awesome-ai-tools-for-students` proposal, contact maintainers, buy traffic, generate synthetic events, or perform another external action under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-31-course-wiki-from-lecture-notes-locales local verification

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-31-course-wiki-from-lecture-notes-locales
- Observed at: 2026-08-31T18:36:02Z
- Readout: correction
- Status: active
- Evidence: Goal and scenario checks passed with 17 trilingual families and 165 sitemap owners; Goal tests passed 53/53, SEO tests passed 255/255 against the published Wenlan `v0.17.6` tag, i18n passed 80/80, TypeScript lint passed, the production build generated 283 static pages, the built technical audit passed all 165 sitemap URLs and found no FAQPage in 169 built HTML files, and the running-build locale matrix returned 200 for 37 expected routes plus four intentional 404s. The in-app Browser control tool was not exposed in this task, so bundled Playwright and local Chrome ran the permitted fallback. English, zh-TW, and zh-CN passed at `1280x900` and exact `393x852` with exact titles, H1s, canonicals, reciprocal hreflang, Article and BreadcrumbList schema, visible FAQ without FAQPage, a loaded product-evidence image, working FAQ expansion, no framework overlay, no console warning or error, no horizontal overflow, and no protected Mandarin phrase split. This is local technical evidence only; the pages are not published, crawled, indexed, ranked, or measured.
- Result: pending
- Decision: wait
- Next step: Stop for exact commit, push, PR, merge, automatic Vercel deployment, and read-only production-verification approval. Do not request indexing, submit GSC validation, mutate analytics, publish the conditional `awesome-ai-tools-for-students` proposal, contact maintainers, buy traffic, generate synthetic events, or perform another external action under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-31-course-wiki-from-lecture-notes-locales publication approval

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-31-course-wiki-from-lecture-notes-locales
- Observed at: 2026-09-01T04:21:18Z
- Readout: correction
- Status: active
- Evidence: The user explicitly approved the locally verified English, zh-TW, and zh-CN Course Wiki family for commit, Git push, pull request creation, merge, automatic Vercel deployment, and read-only production verification. The approved diff is restricted to the publication manifest's candidate-owned files and hunks.
- Result: pending
- Decision: merge
- Next step: Commit and push only the verified manifest-owned candidate, merge its pull request in turn after required checks, verify the integrated commit, wait for automatic Vercel production completion, and verify the three live routes read-only. Do not request indexing, submit GSC validation, mutate analytics, publish the conditional `awesome-ai-tools-for-students` proposal, contact maintainers, buy traffic, generate synthetic events, change metric definitions, or perform another external action.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-31-course-wiki-from-lecture-notes-locales production publication

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-31-course-wiki-from-lecture-notes-locales
- Observed at: 2026-09-01T04:26:43Z
- Readout: correction
- Status: measuring
- Evidence: PR #166 merged at `2026-09-01T04:25:50Z` as `9b12ad73eb51c95d013e69e455c1a67d03f0e08d`, and Vercel production completed at `2026-09-01T04:26:43Z`. The integrated tree exactly matched the verified candidate. Goal and scenario checks, 53 Goal tests, 255 SEO tests against Wenlan v0.17.6, 80 i18n tests, TypeScript, the 283-page build, 165-owner intent check, built technical audit, and 37 expected 200 / four expected 404 route matrix passed on the merge commit. The deployed audit passed all 165 sitemap URLs and the broader technical surface. English, zh-TW, and zh-CN returned direct 200 with exact canonicals, reciprocal hreflang, Article and BreadcrumbList schema, working visible FAQ without FAQPage, loaded images, no console issue, no overflow, and no protected Mandarin phrase split at 1280x900 and exact 393x852. This proves publication and technical availability only; it is not a crawl, indexing, rank, impression, click, visitor, authority, or causal result.
- Result: pending
- Decision: wait
- Next step: Keep `2026-09-01T04:26:43Z` as the fixed production boundary. Record the 24-hour technical observation after `2026-09-02T04:26:43Z`, then the seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-08T04:26:43Z`. Judge each locale independently only after a confirmed post-deploy crawl and 28 complete post-crawl days with at least 20 target-page impressions, 3 qualified joined-query impressions, and 1 GSC click. Do not request indexing, submit GSC validation, mutate analytics, publish the conditional student-tools proposal, contact maintainers, buy traffic, generate synthetic events, or perform another external action.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment start: EXP-2026-09-01-business-metric-definition-knowledge-base-locales

- Record type: experiment-start
- Experiment ID: EXP-2026-09-01-business-metric-definition-knowledge-base-locales
- Status: active
- Data window: 2026-08-29..2026-09-04
- Asset class: net-new-search
- Launched: 2026-09-01
- Hypothesis: One English, zh-TW, and zh-CN owner for turning approved metric-definition files into a reviewed source-backed data dictionary can earn qualified discovery without cannibalizing document ingestion, citation verification, financial research, or multi-agent conflict intent.
- Candidate evidence: Separate English, Taiwan Traditional-Chinese, and Simplified-Chinese Trends, SERP, standards, OSS, and practitioner observations are stored in `docs/seo-audits/2026-08-31-business-metrics-glossary-demand-gate.md`. They are not authenticated GSC data, keyword volume, Wenlan rank, backlinks, or causal evidence.
- Baseline: The latest completed authenticated range remains `2026-07-31..2026-08-27`: GSC property 7 clicks and 913 impressions; visible-query 2 clicks and 221 impressions; visibility gap 5 clicks and 692 impressions; Vercel 289 visitors and 690 pageviews; Google referrer 28 visitors and 29 pageviews; GitHub 51 stars. New target-page and joined-query rows are unavailable rather than zero, and every source remains separate.
- Change: Prepare exactly one English, zh-TW, and zh-CN canonical that turns approved Markdown, text, and text-extractable PDF metric specifications into a reviewable definition record with metric name, business definition, formula as non-executable text, grain, dimensions, exclusions, owner, source IDs and revisions, review state, and supersession. Explicitly exclude CSV, YAML, SQL, warehouse or BI ingestion, metric execution, lineage, data-quality monitoring, permissions, approval workflow, and automatic reconciliation.
- Publish date: not-published
- Index date: not-indexed
- Minimum exposure: 20 GSC target-page impressions per locale in 28 complete post-crawl days
- Success criteria: Per locale, at least 3 qualified joined-query impressions and at least 1 GSC click after minimum exposure; report CTR and position separately.
- Failure criteria: After 28 complete post-crawl days and minimum exposure, a locale has no qualified joined-query impressions or no GSC click, or an above-floor query-page join assigns the task to an existing owner or unsupported data-catalog, BI, SQL, metric-computation, governance, or approval intent.
- Stop criteria: Stop on a technical, unsupported data capability, duplicate-intent, controller-overlap, canonical, locale, responsive-render, authority-path, or approval-boundary violation.
- 24h readout: pending only after a separately approved production deployment completes
- 7d readout: pending only after a separately approved production deployment completes
- W2 readout: pending
- W4 readout: pending formal 28-complete-post-crawl-day decision when eligible
- W8 readout: pending only if useful after the Goal deadline
- Result: pending
- Decision: wait
- Next step: Complete local deterministic and rendered verification, then stop for exact commit, push, PR, merge, automatic Vercel deployment, and read-only production-verification approval. Do not change the Wenlan source README, request indexing, submit GSC validation, mutate analytics, contact maintainers, buy traffic, generate synthetic events, or perform another external action under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-09-01-business-metric-definition-knowledge-base-locales local verification

- Record type: experiment-readout
- Experiment ID: EXP-2026-09-01-business-metric-definition-knowledge-base-locales
- Observed at: 2026-09-01T04:54:48Z
- Readout: correction
- Status: active
- Evidence: Goal and scenario checks passed with 18 trilingual families and 168 sitemap owners; Goal tests passed 54/54, SEO tests passed 256/256 against Wenlan v0.17.6, i18n passed 81/81, TypeScript lint passed, the production build generated 287 static pages, the built technical audit passed all 168 sitemap URLs and found no FAQPage in 172 built HTML pages, and the running-build locale matrix returned 200 for 39 expected routes plus four intentional 404s. Fresh in-app Browser checks covered English, zh-TW, and zh-CN at `1280x900` and exact `393x852`: one H1, exact self-canonical, reciprocal hreflang, Article and BreadcrumbList schema, visible FAQ without FAQPage, a loaded product-evidence image, working evidence-anchor and FAQ interactions, no framework overlay, no console warning or error, no horizontal overflow, and no protected Mandarin phrase split. The initial zh-CN desktop capture caught font loading in progress; a fresh capture after `document.fonts.ready` showed the stable layout without overlap. This is local technical evidence only; the pages are not published, crawled, indexed, ranked, or measured.
- Result: pending
- Decision: wait
- Next step: Stop for exact commit, push, PR, merge, automatic Vercel deployment, and read-only production-verification approval. Do not change the Wenlan source README, request indexing, submit GSC validation, mutate analytics, contact maintainers, buy traffic, generate synthetic events, or perform another external action under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-09-01-business-metric-definition-knowledge-base-locales publication approval

- Record type: experiment-readout
- Experiment ID: EXP-2026-09-01-business-metric-definition-knowledge-base-locales
- Observed at: 2026-09-01T05:03:53Z
- Readout: correction
- Status: active
- Evidence: The user explicitly approved the locally verified English, zh-TW, and zh-CN business-metric definition candidate for commit, Git push, pull request creation, merge, automatic Vercel deployment, and read-only production verification. The approved diff is restricted to the candidate-owned files and exclusions recorded in `docs/seo-audits/2026-09-01-business-metric-definition-publication-manifest.md`.
- Result: pending
- Decision: merge
- Next step: Commit and push only the verified candidate, open and merge one pull request after required checks, verify the integrated commit, wait for automatic Vercel production completion, and verify the three live routes read-only. Do not change the Wenlan source README, request indexing, submit GSC validation, mutate analytics, contact maintainers, buy traffic, generate synthetic events, or perform another external action.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-09-01-business-metric-definition-knowledge-base-locales production publication

- Record type: experiment-readout
- Experiment ID: EXP-2026-09-01-business-metric-definition-knowledge-base-locales
- Observed at: 2026-09-01T05:16:00Z
- Readout: correction
- Status: measuring
- Evidence: PR #167 merged at `2026-09-01T05:07:45Z` as `7664d1a3d3578533fab8aed626856930e3d04b11`; Vercel reported production deployment success at `2026-09-01T05:08:53Z`. The integrated commit passed Goal and scenario verification, 54 Goal tests, 256 SEO tests against Wenlan v0.17.6, 81 i18n tests, TypeScript, the 287-page production build, the 39 expected 200 / four intentional 404 route matrix, and the 168-owner built technical audit. The deployed audit passed robots, all 168 sitemap URLs, 30 key pages, six utility noindex surfaces, 25 redirects, six bridge-host redirects, and sitemap-wide FAQPage absence. English, zh-TW, and zh-CN returned direct 200 with exact canonicals, reciprocal hreflang, Article and BreadcrumbList schema, loaded product evidence, a working evidence anchor and FAQ, and visible FAQ without FAQPage. Fresh `1280x900` production captures rendered correctly. Exact `393x852` mobile emulation measured `innerWidth`, HTML scroll width, and body scroll width as 393 for every locale, one viewport-contained H1, no broken image, no browser warning or error, and no protected Mandarin phrase split. A command-line-only narrow screenshot had first appeared cropped because it did not emulate a mobile layout viewport; the measured mobile viewport disproved that false positive. This proves publication and technical availability only; it is not a crawl, indexing, rank, impression, click, visitor, authority, or causal result.
- Result: pending
- Decision: wait
- Next step: Keep `2026-09-01T05:08:53Z` as the fixed production boundary. Record the 24-hour technical and indexability observation after `2026-09-02T05:08:53Z`, then the seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-08T05:08:53Z`. Judge each locale independently only after a confirmed post-deploy crawl and 28 complete post-crawl days with at least 20 target-page impressions, 3 qualified joined-query impressions, and 1 GSC click. Do not change the Wenlan source README, request indexing, submit GSC validation, mutate analytics, contact maintainers, buy traffic, generate synthetic events, or perform another external action under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-09-01-business-metric-definition-knowledge-base-locales README authority approval

- Record type: experiment-readout
- Experiment ID: EXP-2026-09-01-business-metric-definition-knowledge-base-locales
- Observed at: 2026-09-01T06:49:30Z
- Readout: correction
- Status: measuring
- Evidence: The user explicitly approved the predeclared maintained first-party authority path: one natural same-locale Business Metric Guide link in Wenlan source `README.md`, `README.zh-Hant.md`, and `README.zh-Hans.md`, plus only the mechanical translated-README sync-marker update required by that repository. The user also approved correcting Course Wiki from prepared to measuring and correcting Business Metric from production-in-flight to live, production-verified, and measuring without changing either fixed production boundary. Commit, push, PR, merge, and read-only GitHub rendering verification are approved for those exact files. This is approval evidence, not a rendered link, referral, crawl, indexing, rank, impression, click, visitor, star, authority acceptance, or causal result.
- Result: pending
- Decision: merge
- Next step: Publish only the approved README links after the Goal verifier passes, verify the merged GitHub README rendering read-only, append the resulting source-native merge evidence, and merge the control-plane correction. Do not create a Wenlan release, edit a site page, request indexing, submit GSC validation, mutate analytics, contact maintainers, buy traffic, generate synthetic events, or perform another external action under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-09-01-business-metric-definition-knowledge-base-locales README authority publication

- Record type: experiment-readout
- Experiment ID: EXP-2026-09-01-business-metric-definition-knowledge-base-locales
- Observed at: 2026-09-01T06:54:33Z
- Readout: correction
- Status: measuring
- Evidence: Wenlan source PR #655 merged at `2026-09-01T06:53:31Z` as `e450c4371f224802666a53e4dcbe7b4990935ca8` after its docs-provenance check passed. The integrated commit passed translated-README sync verification and its self-test. GitHub main visibly renders the English, Traditional-Chinese, and Simplified-Chinese Business Metric Guide links, and each locale-matched `wenlan.app` target returned a direct 200 before publication. The Spanish README content is unchanged; only its required English-source sync marker advanced. This proves a maintained first-party source link, not a referral, crawl, indexing, rank, impression, click, visitor, star, backlink acceptance, or causal result.
- Result: pending
- Decision: wait
- Next step: Keep `2026-09-01T05:08:53Z` as the fixed site production boundary. Record the 24-hour technical and indexability observation after `2026-09-02T05:08:53Z`, then the seven-day source-native GSC page/query and Vercel page/referrer observation after `2026-09-08T05:08:53Z`; keep the new GitHub source link as a separate authority observation. Do not create a Wenlan release, edit a site page, request indexing, submit GSC validation, mutate analytics, contact maintainers, buy traffic, generate synthetic events, or perform another external action under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-31-course-wiki-from-lecture-notes-locales authority-path gate

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-31-course-wiki-from-lecture-notes-locales
- Observed at: 2026-09-01T07:13:17Z
- Readout: correction
- Status: measuring
- Evidence: The predeclared `sohailakhtar01/awesome-ai-tools-for-students` authority target was checked source-natively before any submission. Its current README has relevant AI Study and Learning plus AI Note-Taking categories, its contribution rules require a maintained non-duplicate student tool with a real free tier, honest limitations, first-hand use, and affiliation disclosure, and Wenlan is not currently listed. However, the repository has 0 stars, 3 forks, one initial commit dated 2026-05-10, no merged pull requests, and three unattended open pull requests (#1 since 2026-06-01, #2 since 2026-06-02, and draft #4 since 2026-07-31). These are GitHub-native repository observations, not GSC data, search volume, backlink value, referral traffic, or causal evidence.
- Result: failure
- Decision: stop
- Next step: Do not submit to or contact the rejected repository. Replacement research selected `bydeng01/student-gpt-tools` as the best conditional match: 85 stars, 15 forks, six merged pull requests including external tool submissions, last merge 2026-06-17, and two newer open submissions. The exact neutral one-row proposal and affiliation disclosure are prepared in `docs/seo-audits/2026-09-01-course-wiki-authority-gate.md`, but creating a fork, branch, pull request, issue, or maintainer message remains separately approval-gated. Keep the Course Wiki measurement boundary at `2026-09-01T04:26:43Z` and run due readouts on schedule.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-31-course-wiki-from-lecture-notes-locales authority submission

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-31-course-wiki-from-lecture-notes-locales
- Observed at: 2026-09-01T08:11:06Z
- Readout: correction
- Status: measuring
- Evidence: After explicit user approval, GitHub identity was verified as Qi-Xuan Lu (`7xuanlu`), the exact Course Wiki destination returned HTTP 200, and the disclosed neutral one-row proposal was committed as `052c297b2b811f2221dc9c03e6eee05becbe47a8` in `7xuanlu/student-gpt-tools`. Upstream `bydeng01/student-gpt-tools#18` opened at this timestamp and its source-native state was open, non-draft, mergeable, with no review decision and no status checks. The row links the exact Course Wiki owner and states supported inputs, citations, concept links, revision state, and human review; the PR body discloses maintainer affiliation and explicitly excludes quizzes, flashcards, audio, transcripts, grades, tutoring answers, and exam plans. This is a submitted proposal, not a merged or rendered listing, backlink, referral, crawl, indexing, rank, impression, click, visitor, star, or causal result.
- Result: pending
- Decision: wait
- Next step: Keep the Course Wiki measurement boundary at `2026-09-01T04:26:43Z`. Re-read PR #18 once at the next due Goal boundary and count authority only after an upstream merge and visible README render. Do not contact the maintainer again, request indexing, submit GSC validation, mutate analytics, buy traffic, generate synthetic events, or perform another external action without new approval.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-27-source-backed-research-knowledge-base-locales README authority reconciliation

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-27-source-backed-research-knowledge-base-locales
- Observed at: 2026-09-01T14:14:03Z
- Readout: correction
- Status: measuring
- Evidence: Wenlan source PR #624 merged the locale-aware research-workflow README links at `2026-08-28T05:16:37Z` as `368fabcf667736e1b116dac8a9e79b017ae4d6bf`. Current source main `e450c4371f224802666a53e4dcbe7b4990935ca8` still contains the English, Traditional-Chinese, Simplified-Chinese, and Spanish links; `git blame` assigns them to that merge, and the translated-README sync checker and its self-test pass. The English, zh-TW, and zh-CN site destinations each return a direct HTTP 200. This proves maintained first-party publication and destination availability only, not independent endorsement, referral traffic, crawl, indexing, rank, impressions, clicks, visitors, or causality.
- Result: success
- Decision: wait
- Next step: Mark the authority path published and do not reapply the stale proposal patch. Keep `2026-08-28T03:49:51Z` as the fixed site production boundary, append the overdue 24-hour technical/indexability readout, and run the seven-day source-native GSC/Vercel readout after `2026-09-04T03:49:51Z`. Keep the awesome-ai-research-tools submission on hold.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-27-source-backed-research-knowledge-base-locales overdue technical observation

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-27-source-backed-research-knowledge-base-locales
- Observed at: 2026-09-01T14:39:32Z
- Readout: 24h
- Status: measuring
- Evidence: The fixed production boundary remains `2026-08-28T03:49:51Z`. Direct live GETs for the English, zh-TW, and zh-CN canonicals each returned 200 with no redirect, exact self-canonical, reciprocal en-US/zh-TW/zh-CN/x-default hreflang, `index, follow`, Article and BreadcrumbList schema dated `2026-08-27`, visible literature-matrix, contradiction, limitation, source-update, and human-review answers, and no FAQPage schema. The deployed technical audit passed robots, 168 sitemap URLs, 30 key pages, six utility noindex surfaces, sitemap-wide FAQPage absence, 25 redirects, six bridge-host redirects, and legacy URL exclusion. The latest preserved authenticated GSC and Vercel capture covers `2026-07-31..2026-08-27`, ending before publication: GSC property is 7 clicks / 913 impressions, visible-query totals and the visibility gap remain separate, and no target page or joined query-page row exists; Vercel remains 289 visitors / 690 pageviews and has no target page or source-to-page row. Those target observations are unavailable rather than zero. Authenticated URL Inspection could not be read in this task, so post-deploy crawl and indexing state are unchecked. GitHub separately reports 60 stars; no star attribution is inferred.
- Result: inconclusive
- Decision: wait
- Next step: Keep the fixed production boundary and current pages unchanged. Run the seven-day source-native GSC page/query and Vercel page/referrer readout after `2026-09-04T03:49:51Z`; re-read authenticated URL Inspection when available without requesting indexing. Do not infer SEO success, source-to-page sessions, or star causality.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-31-customer-support-answer-knowledge-base-locales 24-hour technical observation

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-31-customer-support-answer-knowledge-base-locales
- Observed at: 2026-09-01T15:29:34Z
- Readout: 24h
- Status: measuring
- Evidence: The fixed production boundary remains `2026-08-31T15:27:07Z`. Direct live GETs for the English, zh-TW, and zh-CN customer-support canonicals each returned 200 with no redirect, exact self-canonical, reciprocal en-US/zh-TW/zh-CN/x-default hreflang, `index, follow`, Article and BreadcrumbList schema, the bounded approved-document support-answer task, maintained-source and limitation boundaries, human review, and visible FAQ without FAQPage schema. The current deployed audit passed robots, 168 sitemap URLs, 30 key pages, six utility noindex surfaces, sitemap-wide FAQPage absence, 25 redirects, six bridge-host redirects, and legacy URL exclusion. The exact `393x852` and `1280x900` production render evidence from publication remains applicable: later shared-renderer changes only extended protected CJK terms for the separate Course Wiki and Business Metric owners and did not alter this route's layout or customer-support terms. The latest successfully completed authenticated GSC and Vercel capture remains `2026-07-31..2026-08-27`, ending before publication: GSC property is 7 clicks / 913 impressions, target-page and joined query-page rows are unavailable rather than zero, and property, visible-query, and visibility-gap units remain separate; Vercel is 289 visitors / 690 pageviews, while target-page and source-to-page rows are unavailable rather than zero and direct/qualified referrers remain separate. Authenticated URL Inspection was unavailable, so post-deploy crawl and indexing state are unchecked. GitHub separately reports 60 stars at `2026-09-01T15:28:19Z`; release `v0.17.6` separately reports 22 cumulative asset downloads at the same capture, with no attribution to this page.
- Result: inconclusive
- Decision: wait
- Next step: Keep the fixed production boundary and current pages unchanged. Run the seven-day source-native GSC page/query and Vercel page/referrer readout after `2026-09-07T15:27:07Z`; re-read authenticated URL Inspection when available without requesting indexing. Do not infer SEO success, source-to-page sessions, authority, release-download attribution, or star causality.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-23-coding-agent-source-backed-knowledge-base factual-boundary correction

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-23-coding-agent-source-backed-knowledge-base
- Observed at: 2026-09-05T01:39:51Z
- Readout: correction
- Status: measuring
- Evidence: An isolated Wenlan v0.18.0 negative control showed that valid source IDs did not make an unsupported Page assertion fail on the tested refresh path. Updating a source already cited by the Page marked it `source_updated`, while storing a separate superseding memory preserved a version chain but did not invalidate the predecessor-linked Page. The user approved a narrow trilingual factual correction. PR #174 merged at 2026-09-05T01:39:00Z as ab3b191a8d67493e4206f4613c37b684519e1a13; Vercel production completed at 2026-09-05T01:39:51Z. Integrated Goal, i18n 81/81, SEO 273/273, lint, build, built technical, deployed technical, desktop, 393px, FAQ interaction, exact canonical, dateModified and reciprocal alternate checks passed.
- Result: inconclusive
- Decision: wait
- Next step: Preserve the factual correction without starting a new search experiment. Treat 2026-09-05T01:39:51Z as a new copy-attribution boundary and do not attribute later observations solely to the original 2026-08-23 copy. Keep native GSC page/query and Vercel observations separate; do not request indexing or infer ranking, traffic, CTR, or causal improvement from technical publication.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-27-source-backed-research-knowledge-base-locales seven-day observation

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-27-source-backed-research-knowledge-base-locales
- Observed at: 2026-09-05T03:51:21Z
- Readout: 7d
- Status: measuring
- Evidence: The fixed production boundary remains `2026-08-28T03:49:51Z`. The latest successfully completed authenticated weekly capture covers `2026-08-07..2026-09-03`; GSC property totals are 12 clicks / 1,066 impressions, visible-query totals are 2 clicks / 262 impressions, and the visibility gap is 10 clicks / 804 impressions. The English target-page row is 0 clicks / 1 impression at page-average position 3.0. The zh-TW and zh-CN target-page rows and all three locale joined qualified-query rows are unavailable rather than zero. Authenticated URL Inspection captured on 2026-09-04 reports `PASS`, `Submitted and indexed`, successful mobile fetch, exact Google/user canonical, and post-deploy crawl timestamps of `2026-08-30T15:12:09Z` for English, `2026-08-31T02:51:06Z` for zh-TW, and `2026-08-30T13:28:59Z` for zh-CN. The unchanged publication checks remain current: all three routes return direct 200, exact canonicals, reciprocal hreflang, `index, follow`, Article and BreadcrumbList schema dated `2026-08-27`, the visible literature-matrix, contradiction, limitation, source-update and human-review task, and no FAQPage schema; the deployed audit passed all 168 sitemap owners and protected technical cases. Vercel for the same weekly range is 570 visitors / 1,040 pageviews, with direct at 537 / 999 and qualified referrers kept separate: Google 31 / 31, Bing 2 / 2, GitHub 2 / 5, DuckDuckGo 1 / 2, Gemini 1 / 1, and Kagi 1 / 1. Only the zh-CN target has a page row, 3 visitors / 3 pageviews; English and zh-TW are unavailable. The authenticated source-page aggregate contains GitHub to the zh-CN target at 1 visitor / 1 pageview; it is not a person-level session or causal attribution. Wenlan source PR #624 remains the maintained first-party README authority path, not independent endorsement. GitHub separately reports 62 total stars at `2026-09-04T22:36:15.280Z`; the latest reusable release observation remains `v0.17.6` with 22 cumulative asset downloads at `2026-09-01T15:28:19Z`. No metric is converted, combined, or attributed to this experiment.
- Result: inconclusive
- Decision: wait
- Next step: Keep every locale stable. Each locale remains below its independent minimum of 20 GSC target-page impressions in 28 complete post-crawl days: English has 1 impression, while zh-TW and zh-CN are unavailable. Do not declare success or failure from the English average position, Vercel visits, indexing, the first-party README link, stars, or downloads. Run the next due Goal readout after `2026-09-05T04:59:15Z`; do not request indexing, submit GSC validation, modify analytics, contact maintainers, buy traffic, generate synthetic events, change metric definitions, or start another overlapping edit under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-28-consultant-client-project-knowledge-base-locales seven-day observation

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-28-consultant-client-project-knowledge-base-locales
- Observed at: 2026-09-05T05:00:20Z
- Readout: 7d
- Status: measuring
- Evidence: The fixed production boundary remains `2026-08-29T04:59:15Z`. The latest successfully completed authenticated weekly capture covers `2026-08-07..2026-09-03`; GSC property totals are 12 clicks / 1,066 impressions, visible-query totals are 2 clicks / 262 impressions, and the visibility gap is 10 clicks / 804 impressions. None of the English, zh-TW, or zh-CN consultant target pages appears in the GSC page table or joined query-page table, so every target-page and qualified joined-query observation is unavailable rather than zero. The 2026-09-04 authenticated URL Inspection sample does not include this family, so post-deploy crawl and indexing state remain unavailable; no crawl is inferred from sitemap membership or technical availability. The unchanged publication evidence remains current: all three locale routes return direct 200 with exact self-canonicals, reciprocal hreflang, sitemap membership, Article and BreadcrumbList schema, the visible client-scoped consulting task and limitation boundary, visible FAQ, and no FAQPage schema; the deployed technical audit has continued to pass the protected site surface. Vercel for the same weekly range is 570 visitors / 1,040 pageviews, with direct at 537 / 999 and qualified referrers kept separate: Google 31 / 31, Bing 2 / 2, GitHub 2 / 5, DuckDuckGo 1 / 2, Gemini 1 / 1, and Kagi 1 / 1. None of the three consultant routes appears in the Vercel page or authenticated source-page tables, so every locale target-page and source-page observation is unavailable rather than zero. The predeclared maintained first-party consulting README authority path remains planned and unpublished, not an endorsement or referral. GitHub separately reports 62 total stars at `2026-09-04T22:36:15.280Z`; the latest reusable release observation remains `v0.17.6` with 22 cumulative asset downloads at `2026-09-01T15:28:19Z`. No metric is converted, combined, or attributed to this experiment.
- Result: inconclusive
- Decision: wait
- Next step: Keep all three locale pages stable. No locale has established a post-deploy crawl or reached its independent minimum of 20 GSC target-page impressions in 28 complete post-crawl days, so success and failure are both ineligible. Run the next due Goal readout after `2026-09-05T06:02:35Z`; do not request indexing, submit GSC validation, publish the planned README link, modify analytics, contact maintainers, buy traffic, generate synthetic events, change metric definitions, or start an overlapping edit under this record.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-28-source-backed-investment-research-knowledge-base-locales seven-day observation

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-28-source-backed-investment-research-knowledge-base-locales
- Observed at: 2026-09-05T06:05:53Z
- Readout: 7d
- Status: measuring
- Evidence: Fixed production remains `2026-08-29T06:02:35Z`. Reused the September 4 successful weekly capture and `docs/seo-audits/2026-09-04-seo-growth-diagnosis.md` without rerunning Search Analytics or Vercel. The requested `2026-08-07..2026-09-03` GSC range contains 12 property clicks / 1,066 property impressions, 2 visible-query clicks / 262 visible-query impressions, and a 10-click / 804-impression visibility gap. September 3 is partial according to the separate daily capture's `firstIncompleteDate`; the full aggregate is also mixed pre/post-deploy and pre/post-crawl, not a complete post-crawl measurement window. Exact owner routes are `/learn/build-investment-research-knowledge-base`, `/zh-TW/learn/build-investment-research-knowledge-base`, and `/zh-CN/learn/build-investment-research-knowledge-base`. None occurs in the preserved GSC page or query-page table: per-locale page impressions, clicks, CTR, position, and joined qualified-query observations are unavailable, not zero.
- Crawl evidence: Fresh authenticated Search Console URL Inspection API reads at `2026-09-05T06:05:17.028Z`, `2026-09-05T06:05:23.443Z`, and `2026-09-05T06:05:29.815Z` returned HTTP 200, `PASS`, `Submitted and indexed`, `ALLOWED`, `INDEXING_ALLOWED`, successful mobile fetch, and exact user/Google canonical for English, zh-TW, and zh-CN respectively. Last crawl timestamps are English `2026-08-30T06:30:53Z`, zh-TW `2026-08-30T11:25:43Z`, and zh-CN `2026-08-31T13:54:08Z`. All are after production; these are source-native crawl/index observations, not effects attributed to indexing requests or proof of search performance.
- Technical evidence: Fresh live GETs at `2026-09-05T06:05:53Z` returned direct 200 for all three exact routes, exact self-canonicals, `index, follow`, no X-Robots header, reciprocal en-US/zh-TW/zh-CN/x-default alternates, Article and BreadcrumbList, datePublished/dateModified `2026-08-28`, and no FAQPage schema. Prior publication and 24-hour content/render evidence is retained as dated historical evidence; no fresh visual QA or blanket claim of unchanged deployment is made by this readout.
- Other native observations: Vercel's complete UTC `2026-08-07..2026-09-03` range is 570 visitors / 1,040 pageviews; direct is 537 / 999. Reported referrers remain individual aggregates: Google 31 / 31, Bing 2 / 2, GitHub 2 / 5, DuckDuckGo 1 / 2, Gemini 1 / 1, Kagi 1 / 1. Referrer visitors are not summed. None of the exact target routes appears in Vercel page or authenticated source-page rows; target and source-page observations are unavailable. Unique acquisition-surface visitors are unavailable and are not reconstructed by summing page visitors. Umami is unavailable; Vercel custom events remain account-gated. The latest reused GitHub observation is 62 total stars at `2026-09-04T22:36:15.280Z`. The older `v0.17.6` release observation of 22 cumulative asset downloads at `2026-09-01T15:28:19Z` is historical, not current-release downloads. The scenario's first-party README authority path is recorded as planned-not-published; no independent authority or financial outcome is claimed.
- Result: inconclusive
- Decision: wait
- Next step: Each locale must independently accumulate 28 complete post-crawl days and at least 20 page impressions before formal judgment; success additionally requires 3 qualified joined-query impressions and 1 click. None has established that exposure, and missing rows do not establish failure. Preserve the page family and fixed production boundary. The next recorded due readout is product research to PRD after `2026-09-05T06:44:59Z`. No publication, indexing request, validation, analytics mutation, directory submission, or other external write occurred.
<!-- EXPERIMENT-RECORD:END -->

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-28-product-research-to-prd-knowledge-base-locales seven-day observation

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-28-product-research-to-prd-knowledge-base-locales
- Observed at: 2026-09-05T06:47:16Z
- Readout: 7d
- Status: measuring
- Evidence: Fixed production remains `2026-08-29T06:44:59Z`. Resolved the product-research scenario to the published slug `build-product-research-knowledge-base-for-prd` and its English, zh-TW, and zh-CN Learn canonicals before filtering evidence. Reused the September 4 weekly capture and `docs/seo-audits/2026-09-04-seo-growth-diagnosis.md`; no Search Analytics or Vercel pipeline was rerun. GSC requested range `2026-08-07..2026-09-03` contains property totals of 12 clicks / 1,066 impressions, visible-query totals of 2 clicks / 262 impressions, and a visibility gap of 10 clicks / 804 impressions. September 3 is partial per the separate daily capture, and this aggregate mixes pre/post-deploy and pre/post-crawl days. English target: 0 clicks / 1 impression, CTR 0%, page-average position 3.0. zh-CN target: 0 clicks / 1 impression, CTR 0%, page-average position 9.0. zh-TW target is unavailable. All locale joined qualified-query rows are unavailable, not zero; page-average positions do not establish exact-query rankings.
- Crawl evidence: Fresh authenticated URL Inspection reads at `2026-09-05T06:47:02.653Z` (English), `2026-09-05T06:47:09.342Z` (zh-TW), and `2026-09-05T06:47:15.995Z` (zh-CN) each returned HTTP 200, `PASS`, `Submitted and indexed`, allowed robots/indexing, successful mobile fetch, and exact Google/user canonical. Their last crawls are respectively `2026-08-30T11:03:06Z`, `2026-08-31T22:46:38Z`, and `2026-08-30T13:52:50Z`. These establish observed post-deploy crawls, not an indexing-request effect or search performance.
- Technical evidence: Fresh GETs during the same capture returned direct 200, exact self-canonicals, `index, follow`, no X-Robots header, reciprocal en-US/zh-TW/zh-CN/x-default alternates, Article and BreadcrumbList schema, datePublished `2026-08-28`, dateModified `2026-08-29`, and no FAQPage schema on all three routes. Prior publication/24-hour content and render checks remain dated historical evidence; this readout did not perform fresh visual QA or assert unchanged deployment.
- Other native observations: Vercel's complete UTC `2026-08-07..2026-09-03` capture reports 570 visitors / 1,040 pageviews; direct 537 / 999; Google 31 / 31; Bing 2 / 2; GitHub 2 / 5; DuckDuckGo 1 / 2; Gemini 1 / 1; Kagi 1 / 1. Referrer visitors are not summed. Target-page rows report zh-TW 3 visitors / 6 pageviews and zh-CN 8 / 11; English and all target source-page rows are unavailable. Unique acquisition-surface visitors are unavailable and cannot be obtained by summing page visitors. Umami is unavailable and Vercel custom events remain account-gated. Reused GitHub total is 62 stars at `2026-09-04T22:36:15.280Z`; historical `v0.17.6` downloads were 22 cumulative asset downloads at `2026-09-01T15:28:19Z`, not current-release downloads. The scenario records its maintained OSS workflow authority path as planned-not-published; no submission, endorsement, referral attribution, or product outcome is inferred.
- Result: inconclusive
- Decision: wait
- Next step: Keep the family stable. No locale meets the independent 20-page-impression floor and 28-complete-post-crawl-day requirement; success additionally requires 3 qualified joined-query impressions and 1 click. English/zh-CN each have only 1 observed impression, and zh-TW exposure is unavailable. Neither success nor failure is established. The next recorded scheduled seven-day boundary is SRE after `2026-09-06T05:06:25Z`. No website, README, analytics, indexing, validation, directory, paid, or other external write occurred.
<!-- EXPERIMENT-RECORD:END -->

## 2026-09-05 evidence correction — consultant canonical lookup

This append-only correction supersedes the absence claims in the consultant
seven-day observation at `2026-09-05T05:00:20Z`, not its fixed publication time
or inconclusive outcome. The exact owner is
`build-client-project-knowledge-base-for-consulting`, not the experiment name.
Re-read the preserved September 4 native exports without fetching a new range:

- GSC `2026-08-07..2026-09-03`: English page 0 clicks / 7 impressions;
  zh-CN page 0 clicks / 1 impression; zh-TW unavailable. English joined visible
  query `knowledge base consulting`: 0 clicks / 6 impressions, average position
  16.8333. Its wording is ambiguous, not validated consulting-workflow intent.
- GSC property remains 12 clicks / 1,066 impressions; visible queries remain
  2 / 262 and visibility gap 10 / 804. The range mixes pre/post-deploy and
  pre/post-crawl days; September 3 is incomplete per the separate daily capture.
- `url-inspection-2026-09-04.json` does include the English canonical, with
  exact Google/user canonical and last crawl `2026-08-30T13:32:13Z`. This is
  source-native crawl evidence, not indexing-request causality.
- Vercel target zh-CN has 4 visitors / 4 pageviews. Other locale page rows and
  target source-page joins are unavailable; do not fabricate a user/session join.
- Evidence files: `/tmp/wenlan-seo/gsc-pages.csv`, `gsc-query-pages.json`,
  `gsc-metadata.json`, `vercel-pages.csv`, and the URL Inspection capture above.
  Page exposure remains below the 20-impression floor and does not establish
  28 complete post-crawl days. The correct decision remains inconclusive, but
  it is incorrect to state that all locale observations and crawl data are absent.

<!-- EXPERIMENT-RECORD:START -->
## Experiment readout: EXP-2026-08-29-sre-incident-knowledge-base-locales seven-day observation

- Record type: experiment-readout
- Experiment ID: EXP-2026-08-29-sre-incident-knowledge-base-locales
- Observed at: 2026-09-08T05:28:05Z
- Readout: 7d
- Status: measuring
- Evidence: This is the overdue seven-day observation, not a moved measurement boundary. Production remains fixed at `2026-08-30T05:06:25Z`; the seven-day boundary was `2026-09-06T05:06:25Z`. No earlier SRE seven-day record exists in this ledger. Resolved the canonical owners from `docs/seo-audits/2026-08-29-sre-incident-knowledge-base-candidate.md` and published article data: `/learn/build-sre-incident-knowledge-base`, `/zh-TW/learn/build-sre-incident-knowledge-base`, and `/zh-CN/learn/build-sre-incident-knowledge-base`.
- Weekly reuse and evidence availability: Reused the latest successfully completed September 4 weekly result from the existing weekly automation memory and its preserved interpretation in `docs/seo-audits/2026-09-04-seo-growth-diagnosis.md`. The original ff5f weekly-report checkout is no longer present. In this run `/tmp/wenlan-seo` is also absent, so the original GSC page/query-page and Vercel page/source-page exports cannot be filtered again for the exact SRE owners. Do not reuse another experiment's rows or convert this missing artifact into zero impressions/visitors. No GSC Search Analytics or Vercel pipeline was rerun.
- GSC native observations: The historical September 4 requested range `2026-08-07..2026-09-03` reports property totals of 12 clicks / 1,066 impressions, visible-query totals of 2 clicks / 262 impressions, and a visibility gap of 10 clicks / 804 impressions. September 3 was incomplete per the separately recorded daily capture; the requested aggregate mixes pre/post-deploy and pre/post-crawl days. Each SRE locale's page clicks, page impressions, CTR, page-average position, and joined qualified visible-query observations are unavailable in this readout because the retained interpretation does not contain those exact rows and the original exports are absent. Neither the 20-page-impression floor nor the 3-qualified-joined-query-impression and 1-click success conditions can be established.
- Crawl evidence: Fresh authenticated read-only Search Console URL Inspection API responses returned HTTP 200, `PASS`, `Submitted and indexed`, `ALLOWED`, `INDEXING_ALLOWED`, successful mobile fetch, and exact Google/user canonicals for all three owners. English was inspected at `2026-09-08T05:24:10.141Z`, last crawl `2026-08-30T14:24:19Z`; zh-TW at `2026-09-08T05:24:17.705Z`, last crawl `2026-08-31T07:36:09Z`; zh-CN at `2026-09-08T05:24:24.122Z`, last crawl `2026-08-30T15:35:52Z`. Each recorded crawl is after the fixed deployment boundary, but none establishes 28 complete post-crawl days. These are current observations of Google's stored crawl state, not newly occurring crawls, indexing-request effects, or search-acquisition outcomes. No indexing request or validation was submitted.
- Technical and render evidence: Fresh direct GETs at `2026-09-08T05:24:01Z` returned 200 without redirects for all three owners, exact self-canonicals, `index, follow`, no X-Robots header, reciprocal en-US/zh-TW/zh-CN/x-default alternates, sitemap membership, Article and BreadcrumbList schema with datePublished/dateModified `2026-08-29`, visible incident/runbook review answers and safety boundaries, maintained source links, visible FAQ, and no FAQPage schema. Robots and sitemap returned 200 and allow the canonical routes. Fresh in-app production screenshots covered all three first screens at the normal desktop viewport and configured 393x852 mobile viewport; there was no blank page, headline clipping, framework overlay, or captured console warning/error. The zh-TW evidence-section jump rendered the labeled real fixture image. This is a bounded render smoke check, not a new complete-site visual audit or a claim that the deployment is byte-identical to the August publication. The previously documented oversized CJK desktop title/Article packet presentation remains; it is not silently corrected by this readout. Technical captures, HTML hashes, and source-native URL Inspection evidence are preserved outside the disposable checkout at `/Users/lucian/.codex/visualizations/2026/07/17/019f70d0-90c0-72e0-a213-32f69be1c6c2/2026-09-08-sre-readout/evidence.json`; screenshots are in this task's browser tool receipts. The capture parser was corrected locally for HTML's case-insensitive `hrefLang` attribute using the same saved responses, without refetching or changing the site.
- Vercel native observations: The reused complete UTC `2026-08-07..2026-09-03` range reports 570 visitors / 1,040 pageviews; direct is 537 / 999. Individual qualified referrer aggregates remain Google 31 / 31, Bing 2 / 2, GitHub 2 / 5, DuckDuckGo 1 / 2, Gemini 1 / 1, and Kagi 1 / 1. Referrer visitors are not summed into a deduplicated qualified total. Unique acquisition-surface visitors are unavailable. The weekly capture historically contained authenticated source-page aggregates, but the absent exports prevent recovering exact SRE target-page or source-page rows; all three locales remain unavailable, not zero, and no person-level source-to-session path is inferred. This range is mixed pre/post-deploy and not a complete post-crawl cohort.
- Other native observations: Authenticated Umami detail is unavailable; Vercel custom events remain account-gated in the reused report. GitHub's last reused observation is 62 total stars at `2026-09-04T22:36:15.280Z`, not a fresh September 8 count. The older `v0.17.6` observation of 22 cumulative asset downloads at `2026-09-01T15:28:19Z` is historical, not current-release downloads. The SRE scenario's maintained first-party README path remains recorded as planned-not-published; no new authority check or independent endorsement is claimed. None of these counters is attributed to SRE content.
- Result: inconclusive
- Decision: wait
- Next step: Keep the three SRE owners stable. Formal judgment remains ineligible until each locale has 28 complete post-crawl days and at least 20 page impressions; success additionally requires 3 qualified joined-query impressions and 1 click. At the next normal weekly lane, restore native exports through its authorized capture and preserve the necessary interpreted per-owner rows outside disposable storage. Do not rerun that pipeline in this controller to recreate an old capture. The next chronological unrecorded seven-day boundary in PLAN is competitive intelligence after `2026-09-06T19:48:14Z`, also overdue; point the same heartbeat to that record for bounded reconciliation. Leave the native Goal lifecycle unchanged. No website, README, release, analytics, indexing, validation, directory, paid, maintainer-message, or other external state was changed.
<!-- EXPERIMENT-RECORD:END -->
