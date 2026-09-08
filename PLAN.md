# Wenlan One-Month Exposure Growth Campaign

<!-- FROZEN-GOAL-CONTRACT:START -->
## Frozen Goal Contract

This section is immutable for the life of this Goal. Any change requires explicit
user approval and a corresponding verifier update. The strategy and campaign
state below this frozen section may change as evidence arrives.

### Goal, deadline, baselines, and final window

- Deadline: 2026-08-18.
- GitHub total stars >= 100 at the deadline.
- GSC `sc-domain:wenlan.app` rolling-28-day property clicks >= 100.
- GSC `sc-domain:wenlan.app` rolling-28-day property impressions >= 10,000.
- Vercel Web Analytics rolling-28-day visitors >= 2,000 over the same range.
- Fixed progress baseline: GitHub total stars 47.
- Fixed progress baseline: GSC property clicks 6.
- Fixed progress baseline: GSC property impressions 197.
- Fixed progress baseline: Vercel visitors 323.
- Verify the fixed progress baselines against the real source on the day the
  control plane starts and record provenance. A later observation may be
  recorded separately, but it does not silently rewrite the fixed baseline.
- Target values, deadline, metric definitions, and the final window must not be
  changed by the Goal controller.
- The final search and traffic window is the 28 complete days ending
  2026-08-17. If GSC reporting is delayed, delay the final read; do not move the
  window.
- Wenlan and `https://wenlan.app` are the destination product and canonical
  public site. `https://useorigin.app` and `https://www.useorigin.app` are
  redirect bridges into Wenlan, not destination brands.

### Control-plane precondition

1. `PLAN.md` must keep this Frozen Goal Contract above the mutable strategy,
   current gap, current experiment, and next decision.
2. `EXPERIMENTS.md` is append-only and records every experiment round with its
   hypothesis, candidate evidence, baseline, change, publish and index dates,
   24h, 7d, W2, W4, and W8 readouts, result, decision, and next step.
3. `pnpm seo:goal:check` must be deterministic, use no new dependency, and
   fail when any protected Goal clause or production-concurrency guard is
   missing or violated.
4. Before every campaign action, run `pnpm seo:goal:control` and follow
   the verified active-view reading rules. If the verifier fails, stop; do not
   continue from a summary or chat memory.
5. Deliver the artifact and verifier diff plus verification evidence for user
   review before starting any experiment that affects the website. The Goal
   contract must be approved before such an experiment begins.

### Quality conditions

- Every weekly report must show GSC property totals, visible-query totals, and
  the query visibility gap separately. Visible query rows must never be
  presented as complete property totals or complete non-brand totals.
- Track visible-query non-brand impressions, valid problem clusters, and
  non-brand pages with impressions separately so brand and irrelevant queries
  cannot hide quality degradation.
- Report Vercel raw visitors, direct traffic, qualified-source visitors, and
  acquisition-surface visitors separately. If a source-to-page join is not
  available, do not invent source-to-page sessions.
- GSC clicks, GSC impressions, website visitors, GitHub outbound clicks,
  stars, and setup starts remain separate metrics. Do not create a composite
  score and do not claim causality among them.
- CTA is fixed as `github_outbound / eligible acquisition-surface sessions`.
  Until a reliable Umami baseline exists, CTA is diagnostic only and has no
  invented 4% threshold.
- Setup starts are a lagging metric: report them when reliable, but they do not
  gate completion of this Goal.
- Sitemap, canonical, robots, redirects, noindex and X-Robots headers,
  structured data, key direct-200 URLs, and indexing must not gain a new
  technical regression.
- Inspect English, zh-TW, and zh-CN acquisition surfaces separately. Do not
  translate low-evidence English content at scale.
- Do not use a fixed article quota, programmatic SEO, source-free comparisons,
  invented keyword volume, or `FAQPage` JSON-LD for an ordinary software site.
- Prefer a real, maintained Wenlan command, workflow, test, release, or
  first-party source over generic prose.

### Evidence roles and demand discovery

- GSC is the only authority for Google Search performance and indexing.
- Vercel is the primary source for visitors and referrers. Umami may enrich
  UTM, outbound, and CTA evidence when available. GitHub public or REST data is
  the authority for stars.
- Google Trends, Reddit, GitHub issues and discussions, OSS documentation and
  directories, and SERP observations are demand-discovery inputs only. They
  may nominate experiments, but they must never enter authenticated GSC input,
  impersonate GSC evidence, or be described as keyword volume.
- Google Trends must preserve query, geography, period, captured-at, and the raw 0-100 index.
  A Trends index must never be interpreted as search volume.
- Every source keeps its native unit. Do not convert or normalize numbers
  across GSC, Trends, Reddit, GitHub, Vercel, Umami, or other sources.
- Raw or large external discovery captures stay under
  `/tmp/wenlan-seo-demand`, physically separate from authenticated GSC inputs
  under `/tmp/wenlan-seo`. A committed candidate record contains only
  interpreted, redacted, inspectable provenance.

### Acquisition focus

- The acquisition center for new experiments is one co-primary, non-ranked
  cluster: AI knowledge bases, Karpathy or LLM wiki, source-backed wiki, and
  knowledge bases for AI agents across English, zh-TW, and zh-CN.
- Codex, ChatGPT, Claude Code, Obsidian, and MCP are first-class tool or
  workflow entry points into that same cluster when the candidate gate passes.
  Do not rank Karpathy or LLM-wiki demand below AI-knowledge-base demand by
  default; select the page or refresh from evidence and coverage gaps.
- Generic memory demand does not nominate a new acquisition experiment.
  Existing memory pages and cohorts remain measurable evidence and may be
  maintained for factual or technical correctness, but they do not control the
  next content decision.
- Historical route slugs or article titles containing `memory` do not change
  this priority. Treat them as existing coverage only when they answer one of
  the protected acquisition families above.

### Candidate gate

An external observation can become an experiment only when all five conditions
are true:

1. The source is inspectable, and its URL or query, capture date, language or
   geography, and native unit have provenance.
2. The problem repeats, has independent corroboration, or has clear high
   intent.
3. Existing Wenlan coverage has a clean gap. If a page partly covers the
   intent, refresh the existing page before creating a new URL.
4. Wenlan can prove the answer with a real command, workflow, test, release, or
   maintained first-party source.
5. The asset has standalone utility even without promoting Wenlan.

### Experiment rules

- Priority order:
  `technical blockers -> indexed page with impressions -> integration/workflow hub -> diagnostic/recipe -> net-new article`.
- Weekly data windows are reporting boundaries, not launch blockers. A
  verified, evidence-backed website asset with explicit publish approval may
  launch while another experiment is measuring.
- Production concurrency is capped at one website change in `approved` or
  `active` preparation/verification state.
- Once a change is production-verified, record it as `live` or `measuring`.
  `live`, `measuring`, and `extended` measurement cohorts do not consume the
  production slot and do not block another evidence-backed website change.
- Do not impose a fixed calendar article quota. A net-new search asset may
  launch after the full candidate gate passes, the preceding website change is
  production-verified, and the new asset does not overlap an existing intent.
- Every experiment predeclares its hypothesis, baseline, positive minimum
  exposure threshold and unit, success, failure, and stop criteria, and its
  24h, 7d, W2, W4, and W8 readouts.
- If minimum exposure is not reached, the result is `inconclusive`; do not
  force a success or failure verdict.
- In month one, prefer an existing indexed page plus approved distribution.
  Do not make success depend only on a new article waiting for Google to crawl.
- When there is no new evidence, wait. Do not continuously rewrite the same
  page.

### Relationship to the existing weekly SEO automation

- The existing `weekly-origin-seo-cleanup` automation remains independent. Do
  not create a duplicate weekly cron or change its schedule or ID without
  explicit user approval.
- This Goal is the campaign controller. The existing weekly automation remains
  the Searchfit, GSC, indexing, and technical-evidence lane.
- The Goal reads the latest weekly report and result so it does not repeat the
  same evidence collection or concurrently modify the same page.
- The weekly prompt currently allows low-risk code and content edits. If that
  conflicts with experiment attribution or campaign working files, present the
  smallest prompt diff for user approval; do not silently allow both
  controllers to write.
- Pursue the campaign until the deadline in evidence-driven bursts. When no
  useful authorized work remains before an external event, follow native Goal
  blocked rules and retain the scheduled wakeup. Temporary waiting does not
  require keeping the Goal active.
- If a calendar wake is needed, use a scheduled follow-up in this same main
  task. Do not create another standalone SEO automation, and do not write files
  at the same time as the Friday weekly run.

### Approval boundaries

- No deploy, Reddit or external article/message publication, OSS directory submission, paid acquisition, request indexing, GSC validation submission, push, or merge without explicit user approval.
- Do not change metric definitions without explicit user approval.
- GA4 is outside this Goal. Keep the GSC + Vercel + existing Umami + GitHub
  evidence stack unless an approved question cannot be answered by it and the
  user separately approves GA4.
- Contract approval authorizes the Goal controller to maintain the mutable plan
  and prepare evidence-backed local experiment changes within these bounds. It
  does not authorize any external or shared-state action listed above.

### Stop conditions

Stop the campaign and deliver attempted paths, evidence by source,
success/failure/inconclusive experiments, blockers, and the next decision that
requires the user when any condition is true:

1. The deadline arrives and one or more fixed targets are unmet.
2. Two consecutive windows have no reliable data.
3. No reasonable experiment passes the candidate gate.
4. Approval boundaries block a necessary action.

The Goal does not stop merely because one window is quiet. It waits until a
readout, a new evidence window, a stop condition, or the fixed final read.
<!-- FROZEN-GOAL-CONTRACT:END -->

<!-- ACTIVE-CONTROL-OPERATIONS:START -->
## User-approved operational amendment — 2026-09-06

This operational-only amendment was explicitly authorized through the token-audit
coordination in this task. It changes reading and waiting mechanics, not goals,
targets, dates, final windows, evidence roles, experiment eligibility, production
slots, approval boundaries, or historical records. On 2026-09-06 the user also
authorized removing the obsolete
full-PLAN-read and keep-Goal-active instructions at their source. Only those two
operational clauses in the frozen block were amended; all other protected clauses
remain unchanged and checked.

- Before every campaign action, run `pnpm seo:goal:control`. It runs the complete
  deterministic `pnpm seo:goal:check` logic before emitting the complete active
  view in `docs/seo-active-control.md` and a source fingerprint. Read that view
  completely. This supersedes only the repeated full-PLAN reading requirement;
  the retained PLAN narrative is a referenced historical archive, not recurring
  model input. It is never deleted or silently rewritten by the control helper.
- Within the same context, after actually reading a verified active view, pass
  `--known-fingerprint <sha256>` to reuse that read. Verification still runs on
  every invocation. If any control source, ledger, scenario state, relevant site
  source, verifier/helper, or evidence file changes, the fingerprint changes and
  the complete current view must be read again. After compaction or a new task,
  omit the old fingerprint and read the view; a summary is not a verified read.
- `pnpm seo:goal:control --update` only regenerates the derived active Markdown;
  it grants no campaign action or publication permission. Missing, stale, altered,
  duplicated-marker, or oversized active views fail closed. The full historical
  PLAN and experiment ledger continue to be checked deterministically.
- Before a specific experiment or readout, read its exact original ledger
  contract and relevant latest evidence, including per-locale exposure and crawl
  conditions. The active view is a complete common contract, not permission to
  omit experiment-specific gates. Reuse the latest successfully completed weekly
  report; do not rerun its pipeline merely because the Goal resumed.
- Use the native Goal lifecycle. A future readout is a temporary external-state
  blocker once no useful authorized work remains; it need not be a permanent
  failure. Retain the scheduled wakeup and follow the native blocked audit.
  Do not poll the clock or heartbeat to keep an otherwise idle Goal active.
  This helper does not change Goal state, create jobs, or grant external authority.

<!-- ACTIVE-CONTROL-OPERATIONS:END -->

<!-- ACTIVE-CONTROL-STATE:START -->
### Current operational checkpoint

The user approved compacting the language dropdown and merging the complete
`codex/task-first-site-sync` homepage recovery branch on September 7 (local).
The user-supplied graph capture and recorded wiki/review frames are complete;
their provenance is in `docs/homepage-media-provenance.json`. Do not recapture
them merely because older notes say capture is pending.
The publication scope includes the previously reviewed trilingual homepages,
shared UI and existing LLM-wiki/tool-selection guide owners, plus verified
release/download synchronization. This is user-directed UX and factual repair,
not evidence that the SEO 20/3/28 experiment gate passed. Preserve original
experiment baselines; observations after the deployment boundary must not be
attributed to superseded copy. Publication verification and its exact boundary
will be recorded in `docs/seo-audits/2026-09-08-homepage-publication.md`.
The SRE seven-day readout was appended at `2026-09-08T05:28:05Z`; consult the
latest ledger and scheduler state rather than repeating an older due boundary.
No indexing request, validation, analytics mutation or external promotion is
authorized by this website approval. Goal targets and final window are unchanged.
<!-- ACTIVE-CONTROL-STATE:END -->

## Mutable Campaign State

This section is maintained by the Goal controller. It may change only after the
controller has read the frozen section and `pnpm seo:goal:check` passes.

### Current recovery work — 2026-09-05

The user requested stepwise resolution of the September 4 diagnosis, starting
with demand, audience, alternatives, and first-reader acquisition rather than
implementation alone. The current work queue and next decision are in
`docs/seo-growth-recovery.md`; dated evidence is in
`docs/seo-audits/2026-09-04-seo-growth-diagnosis.md`. This pointer supersedes
stale next-action recommendations below, not protected contracts or historical
experiments. Local repair and research do not authorize publication. The app
Goal was last observed `blocked`; this work does not claim to change that
native state. Targets and the final window remain unchanged.

On September 5 the user explicitly approved a substantial **local** redesign
following the root-cause diagnosis: task-first positioning, fair alternatives,
inspectable worked outcomes, and a specific relevant-reader path. The user owns
real-person comparison and repeat-use tests; agents must not substitute model
opinions for those observations. Native agent workers implement bounded pieces;
the lead owns positioning, evidence judgments, integration, and rendered QA.
The first integrated tranche covers the three homepages, their shared footer
navigation, and the existing three LLM-wiki guide owners. No new search URL is
created. This is explicit local preparation authorization, not a claim that the
20/3/28 publication gate passed. Existing experiment attribution, production
timestamps, successor targets, and final window remain unchanged. Publication
and any necessary attribution supersession require a separate exact approval.
The adopted decision is preserved in Wenlan page
`page_662404f4-0a4f-4015-9407-0195990fedd8`; execution stays in the recovery index.

<!-- AUTHORITY-FIRST-CORRECTION:START -->
### Authority-first growth correction

This correction was explicitly approved by the user on `2026-08-20` after the
fixed campaign window showed that indexed inventory and repeated on-page SEO
changes did not create qualified discovery. It preserves the completed
campaign's deadline, targets, metric definitions, and final window as
historical facts; it changes what work is allowed to count as progress.

- The execution objective is authenticated non-brand query ownership and
  durable external authority for the protected AI knowledge-base, Karpathy or
  LLM-wiki, source-backed-wiki, and agent-knowledge-base cluster. Article
  count, indexed-page count, technical checks, indexing requests, and raw
  Vercel visitors are not growth outcomes.
- Technical SEO is a regression guardrail. A green sitemap, canonical,
  robots, redirect, schema, locale, build, or render check cannot nominate a
  content experiment or be reported as acquisition progress.
- An existing page may receive another SEO copy, title, metadata, or internal-
  link experiment only after Google has confirmed a post-deploy crawl of its
  current version, the same complete 28-day GSC range contains at least 20
  target-page impressions, and the query-page join contains at least 3
  qualified visible impressions for that owner. Evidence below either floor
  is an evidence gap, not permission to edit.
- A net-new or translated search asset requires the full candidate gate, no
  current canonical that already owns the intent, locale-specific evidence,
  and one predeclared authority or distribution path. Low traffic alone is
  not evidence for another article.
- After an SEO content change, do not change the same canonical again until
  28 complete days after a confirmed post-deploy crawl. A factual, release,
  security, accessibility, or technical regression may be corrected earlier,
  but it is not a growth experiment.
- If two consecutive website experiments remain below their post-crawl
  exposure floor, stop the on-page lane. The next eligible growth action must
  build inspectable authority or distribution, or wait; it must not be
  another article, translation, title rewrite, or internal-link shuffle.
- An external submission or open pull request is attempted distribution, not
  authority. Count authority only when an accurate listing, integration
  document, maintained first-party reference, or other inspectable source is
  publicly live or merged and links to Wenlan or its repository.
- Keep Vercel raw visitors as the historical contract unit, but never present
  them as human search acquisition without the separate traffic-quality
  split. GSC remains the authority for Google clicks and impressions.
- Each weekly action queue must prefer one qualified query owner or one
  inspectable authority action. When neither passes its gate, the correct
  action is no on-page change.
- Pre-final candidate and readout text retained below is historical
  provenance. It cannot nominate a starter-schema refresh, translation,
  title rewrite, internal-link change, or other website experiment after the
  fixed-deadline stop.
- The old campaign stopped at its fixed deadline with its final read recorded
  below. A new numeric deadline or target is not invented by the controller;
  it requires explicit user approval after this correction is reviewed.
<!-- AUTHORITY-FIRST-CORRECTION:END -->

<!-- SUCCESSOR-GOAL-CONTRACT:START -->
### Successor Goal Contract

The user explicitly approved this successor campaign and its exact external
authority action on `2026-08-21T08:24:29Z`. The completed 2026-08-18 campaign
and its final evidence remain immutable history.

#### Goal, deadline, baselines, and final window

- Deadline: 2026-09-21.
- GitHub total stars >= 100 at the deadline.
- GSC `sc-domain:wenlan.app` rolling-28-day property clicks >= 100.
- GSC `sc-domain:wenlan.app` rolling-28-day property impressions >= 10,000.
- Vercel Web Analytics rolling-28-day visitors >= 2,000 over the same range.
- The fixed final search and traffic window is `2026-08-24..2026-09-20`, the
  28 complete days ending 2026-09-20. If GSC reporting is delayed, delay the
  final read; do not move this window.
- Fixed successor starting observation: GitHub total stars 48.
- Fixed successor starting observation: GSC property clicks 8 and property
  impressions 985 for `2026-07-24..2026-08-20`.
- Fixed successor starting observation: Vercel visitors 248 for
  `2026-07-24..2026-08-20`.
- The same GSC capture separately reports 2 visible-query clicks and 212
  visible-query impressions, leaving a 6-click and 773-impression visibility
  gap. The same Vercel capture separately reports 217 direct visitors and 30
  `google.com`-referrer visitors. These source-native units are not joined or
  substituted for the protected totals.
- Target values, deadline, metric definitions, starting observations, and the
  final window must not be changed by the Goal controller.

#### Execution contract

- The complete quality conditions, evidence roles, demand-discovery rules,
  candidate gate, experiment rules, weekly-SEO-controller relationship, and
  approval boundaries in the historical Frozen Goal Contract remain in
  force. The Authority-first growth correction controls later execution and
  resolves any conflict with retained pre-final candidate text.
- Progress means qualified non-brand query ownership or an inspectable live or
  merged authority source. Article count, indexed-page count, technical
  checks, indexing requests, open pull requests, and raw visitor counts are
  not acquisition outcomes.
- No existing-page SEO edit is eligible without a confirmed post-deploy Google
  crawl, at least 20 target-page impressions, and at least 3 joined qualified
  visible impressions in the same complete 28-day GSC range.
- Keep the 28-complete-day post-crawl canonical cooldown and stop the on-page
  lane after two consecutive below-exposure website experiments.
- A net-new or translated search asset requires the complete candidate gate,
  a clean intent gap, locale-specific evidence, and one predeclared authority
  path. Low traffic by itself is not a content brief.
- The user approved the exact one-file Awesome Selfhosted authority submission
  recorded in
  `docs/seo-audits/2026-08-20-awesome-selfhosted-authority-candidate.md`,
  including fork, branch, commit, push, pull request creation, and read-only
  result verification. Publish it only when current upstream plus the exact
  candidate pass the upstream pull-request gate. Do not include an unrelated
  upstream repair or automated maintainer interaction.
- No other external publication, website deployment, request indexing, GSC
  validation, paid acquisition, synthetic analytics event, or metric change
  is approved by this successor contract.
- The existing `weekly-origin-seo-cleanup` automation remains independent.
  This Goal consumes its latest completed report rather than duplicating the
  authenticated weekly evidence pipeline.

#### Successor stop conditions

Stop and deliver source-native evidence, attempted paths, experiment results,
blockers, and the next user decision when any condition is true:

1. The 2026-09-21 deadline arrives and one or more successor targets are
   unmet.
2. Two consecutive complete windows have no reliable authenticated data.
3. No reasonable authority path or experiment passes its protected gate.
4. An approval boundary blocks a necessary action.
<!-- SUCCESSOR-GOAL-CONTRACT:END -->

<!-- CONTENT-EXPANSION-CORRECTION:START -->
### Protected trilingual scenario expansion correction

The user approved this correction after reviewing the 120-URL intent-owner
inventory. It controls successor content execution after the earlier waiting-
work block and resolves any conflict with historical text that treated low
exposure as a reason to stop all content preparation.

- Technical green, indexed-page count, sitemap size, and intent-owner count
  are quality floors. They do not prove that search scenarios are sufficiently
  covered and do not mean growth is complete.
- Every week must select one trilingual scenario family from
  `docs/seo-scenario-backlog.json` after applying every candidate gate. The
  English, zh-TW, and zh-CN versions represent the same user task in natural
  local search language; they are not keyword-by-keyword translations.
- Each scenario family must explicitly preserve its audience, trigger, user task, and desired outcome.
- A user group alone does not justify a separate URL; split only when the search task and observed SERP are materially different.
- If no family passes, record every failed candidate and its failed gate plus
  the next research direction. A bare `wait` is not a valid weekly content
  decision; research continues to the next ordered family in the same window.
- The confirmed post-deploy crawl, 20 target-page impressions, 3 joined
  qualified visible-query impressions, and 28-complete-day cooldown apply only
  when rewriting an existing owner. Those existing-page floors must not block
  a clean net-new intent backed by external demand evidence, a distinct task
  and SERP, complete first-party proof, standalone utility, at least three
  contextual internal links, and a predeclared authority path.
- A measuring page does not block preparation of the next non-overlapping
  trilingual scenario family. Production concurrency remains one website
  change at a time, and no weak, duplicated, programmatic, or fixed-quota page
  may be published merely to satisfy the cadence.
- `docs/seo-scenario-backlog.json` is the only editable scenario source.
  `docs/seo-scenario-backlog.md` is deterministic generated output. Both must
  remain present and synchronized through `pnpm seo:scenario:check`, and
  `pnpm seo:goal:check` must fail closed when this correction, the scenario
  files, or the four-week cadence is missing.
- New demand may be nominated by inspectable Trends, SERP, Reddit, Chinese-
  community, GitHub, and OSS evidence with source, capture date, language or
  geography, and native unit. It does not enter authenticated GSC input and
  is not keyword volume. GSC remains the authority for Wenlan performance.
- The target queue is one family per week for `2026-08-24..2026-08-30`,
  `2026-08-31..2026-09-06`, `2026-09-07..2026-09-13`, and
  `2026-09-14..2026-09-20`. A failed preferred family immediately yields to
  the next ordered candidate; it does not force a low-quality publication.
- Local implementation and verification do not grant commit, push, PR, merge,
  Vercel deployment, request indexing, GSC validation, or external-publication
  approval. Those boundaries remain explicit and separate.
<!-- CONTENT-EXPANSION-CORRECTION:END -->

<!-- SUCCESSOR-WAITING-WORK:START -->
### Approved successor waiting work

The user explicitly approved this bounded waiting-period work at
`2026-08-22T20:55:14Z`. It prepares the successor campaign while protecting
the clean GSC observation window. These lanes are not website experiments and
do not consume the production slot.

1. Run trilingual demand reconnaissance across English, zh-TW, and zh-CN for
   AI knowledge base, Karpathy or LLM Wiki, source-backed wiki, Codex or
   ChatGPT knowledge-base workflows, and modifier-qualified Obsidian intents.
   Preserve source URL or query, capture date, language or geography, and each
   source's native unit. Keep Trends, Reddit, Chinese-community, GitHub, OSS,
   and SERP observations physically and semantically separate from GSC. The
   output is a candidate evidence matrix, not a content brief by itself.
2. Audit the public GitHub conversion path from a first-time visitor to a
   star: README first screen, concrete product proof, install and download
   entry points, current release assets, and localized README consistency.
   Claims must be implementation-backed. Prepare an exact candidate diff only
   when a discrete gap is proven; do not commit, push, or publish it under
   this approval.
3. Maintain the authority pipeline by reading source-native state for
   `awesome-selfhosted/awesome-selfhosted-data#2955` and
   `DhanushNehru/awesome-mcp-servers#52` only when a state change is plausible,
   and verify the rendered upstream result after a merge. Research at most one
   additional non-duplicate, active, exact-fit high-authority path with a
   verifiable contribution gate and review cadence. Do not submit it or
   contact maintainers under this approval.
4. Prepare the `2026-08-28` decision matrix by reusing the completed weekly
   pipeline. Keep GSC property totals, visible-query totals, visibility gap,
   page rows, joined qualified queries, and URL Inspection crawl evidence
   separate; keep Vercel visitors and referrers, GitHub stars, and locale
   checks in their native units. Apply the protected post-crawl gate: at least
   20 target-page impressions and 3 joined qualified visible-query impressions
   before nominating an existing-page refresh or net-new asset.

No article, translation, title, metadata, schema, internal-link, homepage,
README, or release-surface change is authorized here. No deployment, external
publication, new directory submission, maintainer message, request indexing,
GSC validation, paid acquisition, synthetic event, analytics mutation, or
metric-definition change is authorized here. Any exact diff or external
action returns for separate explicit approval.
<!-- SUCCESSOR-WAITING-WORK:END -->

### Control-plane status

- At `2026-08-21T08:24:29Z`, the user approved the exact successor contract
  above and the exact Awesome Selfhosted one-file publication scope. The
  old `2026-08-18` Goal was later marked blocked after its deadline and stop
  conditions were met. At `2026-08-22T20:55:14Z`, the user explicitly asked
  to replace it with the successor Goal, but `create_goal` returned
  `cannot create a new goal because this thread has an unfinished goal;
  complete the existing goal first.` A blocked Goal is therefore still
  treated as unfinished by the current API. The old unmet Goal cannot be
  falsely marked complete. At `2026-08-22T21:09:02Z`, the user cleared the
  historical Goal through the app; `get_goal` then returned `goal: null`, the
  repository verifier passed, and `create_goal` successfully created the exact
  protected `2026-09-21` successor with status `active` and zero initial token
  or elapsed-time usage.
- At `2026-08-22T20:55:14Z`, the user approved the hash-protected waiting-work
  block above: trilingual demand reconnaissance, the public GitHub visitor-to-
  star audit, bounded authority-path maintenance and research, and preparation
  of the `2026-08-28` decision matrix. Its exclusions remain binding.
- The first saved waiting-work audit is
  `docs/seo-audits/2026-08-22-successor-waiting-work-initial-audit.md`. It
  reviewed 96 Exa results across 12 workstreams, deduplicated them to 81 URLs,
  retained exact Reddit evidence only after a domain-filtered retry, and kept
  English, zh-TW, and zh-CN conclusions separate. It nominates no content
  change before `2026-08-28`. The GitHub conversion audit found one factual
  candidate: GitHub latest is `v0.16.0` while production homepage, download,
  and about surfaces still render `v0.15.8`; prepare only an exact proposal
  until separate publication approval exists.
- The one allowed additional authority-path search selected
  `jaywcjlove/awesome-mac` and stopped. The source-native gate in
  `docs/seo-audits/2026-08-22-awesome-mac-authority-gate.md` records 111,611
  GitHub stars, an active `2026-08-21` push, exact `AI Tools` and `Note-taking`
  category fit, recent merged third-party AI or knowledge-tool precedents, a
  mandatory four-README contribution contract, and no Wenlan duplicate at
  capture. It is a candidate only: no fork, edit, submission, maintainer
  contact, or authority claim is authorized or recorded.
- The approved August 28 native-unit decision structure is prepared in
  `docs/seo-audits/2026-08-28-successor-decision-matrix.md`. It leaves all new
  source observations pending, fixes the expected interim range to
  `2026-07-31..2026-08-27`, preserves the successor final range, and requires
  post-deploy crawl, 20 page impressions, 3 joined qualified impressions,
  28 complete cooldown days, owner alignment, and an open production slot
  before an existing-page edit can be nominated. It also keeps net-new asset,
  authority, Vercel, GitHub, and factual-release decisions separate.
- The exact, unapplied v0.16.0 factual-correction candidate is stored at
  `docs/seo-audits/2026-08-22-wenlan-v0.16.0-proposal.patch`, based on
  `origin/main` commit `721b862cde31a767f58c58a46c9f734a1a660114`. Its
  SHA-256 is
  `6dce422661f86a6303c5445ae12fb5727bd2ecaa4a2c3625a39d65b6374a4f98`.
  The 15-file candidate keeps the Windows desktop installer and headless ZIP
  distinct, aligns all three website locales and machine-readable release
  surfaces, updates sitemap dates, and removes the version-hardcoded app
  contract test. In an isolated worktree, lint, 63 i18n tests, 224 SEO tests,
  the production build, built technical SEO, diff hygiene, and reverse patch
  validation all passed. This is still a review artifact: it was not applied
  to campaign website source, committed, pushed, merged, deployed, or indexed.
- The existing heartbeat automation
  `wenlan-claude-memory-24h-readout` was updated in place on
  `2026-08-22T21:43:49Z` and renamed `wenlan-successor-aug28-decision`. It now
  targets this main Goal task and next wakes after `2026-08-28T17:30:00Z`,
  safely after the Friday weekly SEO run, to fill the prepared native-unit
  decision matrix. No duplicate automation or SEO controller was created.
- At `2026-08-22T21:44:36Z`, the App Goal was marked `blocked` after the same
  clean-window condition repeated across more than three automatic
  continuations: every approved waiting-work artifact was complete, no
  source-native state change was plausible, website and publication actions
  remained separately gated, and the next usable weekly evidence does not
  exist before `2026-08-28`. This is a bounded external-state wait, not a
  failed campaign or a changed deadline. The existing August 28 heartbeat
  remains active and targets this main task.
- At `2026-08-22T04:11:12Z`, the approved Awesome Selfhosted submission was
  opened as `awesome-selfhosted/awesome-selfhosted-data#2955` from commit
  `5db2d2953f342d0ea953f8bfe98dea3dc2e319ec`. Current upstream plus the exact
  candidate passed `make awesome_lint`, `make export_markdown`, and diff
  hygiene before publication. The open PR is attempted distribution, not
  inspectable authority; only a merge plus rendered upstream listing can
  change that status.
- At `2026-08-13T04:00:02Z`, the user explicitly approved commit, push, PR
  creation, merge, automatic Vercel deployment, and production verification
  for the exact `v0.15.8` release-accuracy correction manifest recorded in
  `docs/seo-audits/2026-08-11-wenlan-v0.15.8-release-alignment-prelaunch.md`.
  The publication branch must remain based on
  `9d49f9c4fdb1e2ba64f946cc7e4e0fe1236bb84e` and exclude campaign working
  files and already-published acquisition changes. Request indexing, GSC
  validation, external posts, paid actions, synthetic events, analytics
  mutation, and metric-definition changes remain unapproved.
- Historical Goal status: the `2026-08-18` campaign stopped at its fixed
  deadline with final-window evidence captured on `2026-08-20`. The approved
  `2026-09-21` successor numeric contract now governs repository execution,
  and the app now displays that successor as active. At
  `2026-07-24T18:37:21Z`, the user approved the
  throughput correction: measurement cohorts no longer consume the production
  slot, and there is no fixed calendar article quota. Threads and other
  owned-social work remain outside this SEO-only campaign.
- At `2026-07-31T23:54:43Z`, the user explicitly expanded the protected GSC
  targets for the same deadline and final rolling window to 100 property
  clicks and 10,000 property impressions. The stars, Vercel, quality,
  evidence-role, approval, and stop-condition clauses remain unchanged.
- At `2026-08-01T05:11:57Z`, the user corrected the two-repository OSS
  inventory and approved the complete non-duplicate publication scope:
  publish the docs-only control-plane correction, update valid existing pre-Wenlan
  PRs and accepted listings in place, and submit new high-fit directory
  candidates whose current contribution gates pass. Website content, request
  indexing, GSC validation, analytics mutation, paid acquisition, unrelated
  external posts, and prerequisite product/plugin packaging changes remain
  excluded.
- At `2026-08-01T14:05:56Z`, the user explicitly approved publication of the
  locally verified three-language homepage acquisition-links correction. The
  approval covers commit, push, PR, merge, automatic Vercel deployment, and
  read-only production verification of that exact scope. It does not cover
  request indexing, GSC validation, another website change, analytics
  mutation, or another external publication.
- PR #106 merged at `2026-08-01T14:19:05Z` as
  `c8ae3c82a281464bc29966785d77bf670bc439cc`; Vercel completed production at
  `2026-08-01T14:19:53Z`. The three-language homepage acquisition-links
  correction is production-verified and no longer consumes the production
  slot. No indexing request, GSC validation, analytics mutation, or unrelated
  external publication was performed.
- At `2026-08-01T16:43:08Z`, the user approved local preparation of a bounded
  GitHub-download and signup-attribution correction. The work keeps GitHub
  cumulative release downloads, anonymous Umami events, and Resend contacts
  in their native units and never sends email to Umami. Local preparation of
  `TECH-2026-08-01-download-signup-attribution` occupies the website-change
  slot. Commit, push, PR, merge, deployment, Resend contact-property mutation,
  Vercel environment mutation, and a live signup remain separately gated.
- At `2026-08-01T18:42:18Z`, the user confirmed the Resend secrets already
  exist in Vercel and approved completing the exact measurement scope. The
  production and preview environments contain the Resend API key, Audience
  ID, and Umami website ID; values were not copied or printed. All six bounded
  Resend string properties now exist, and
  `RESEND_ACQUISITION_PROPERTIES_ENABLED=1` is set for Production and Preview.
  PR #108 merged at `2026-08-01T19:14:11Z` as
  `3daf34b31d43ecaa4f4eaaf365a7fb3565ba3327`; Vercel production completed at
  `2026-08-01T19:14:59Z`. New successful signups can now carry those bounded
  Resend fields and emit the anonymous Umami success event. No fabricated
  contact or synthetic analytics event was created.
- At `2026-08-01T20:43:01Z`, the user explicitly approved commit, Git push,
  PR creation, merge, automatic Vercel deployment, and read-only production
  verification for the exact
  `EXP-2026-08-01-obsidian-knowledge-base-locales` scope. Request indexing,
  GSC validation, external publication, paid acquisition, synthetic events,
  and account mutation remain excluded.
- PR #110 merged at `2026-08-01T20:45:39Z` as
  `317bc9152fd8f22bded644c64934ebac7d2bc372`; Vercel completed production at
  `2026-08-01T20:46:25Z`. The deployed SEO and locale matrices passed, and
  actual `393px` measurement confirmed no document overflow. The fresh full-
  page visual pass found two CJK semantic-phrase breaks in the article packet
  and CTA plus a flex-distribution side effect in one FAQ question. A bounded
  renderer/copy correction was published through PR #111, which merged at
  `2026-08-01T21:09:03Z` as
  `4c67e4c54b90c6f05fda29f0390cc380157c9849`; Vercel completed production at
  `2026-08-01T21:09:50Z`. The deployed technical and locale matrices passed
  again. Fresh production captures at `393px` and `1280px` for both locales
  have no document overflow and zero protected-phrase splits. The experiment
  is now live and measuring; its actual 24-hour boundary is after
  `2026-08-02T21:09:50Z`.
- At `2026-08-01T22:00:20Z`, the user's explicit approval for the fixed
  four-URL GSC Request Indexing batch was completed. Search Console returned
  `Indexing requested` for the English, zh-TW, and zh-CN Obsidian URLs and the
  zh-CN LLM Wiki URL. The new zh-CN Obsidian URL was not on Google before the
  request; the other three were indexed but had stale crawl timestamps. Do
  not repeat these requests. Queue acceptance is not a new crawl, indexing,
  ranking, traffic, click, or causal result. No GSC validation was submitted.
- At `2026-08-02T00:36:22Z`, the user explicitly approved commit, push, PR
  creation, merge, automatic Vercel deployment, and read-only production
  verification for `EXP-2026-08-01-document-knowledge-base-guide`. The exact
  scope is the English, zh-TW, and zh-CN document-to-local-AI-knowledge-base
  guide family plus deterministic Vercel acquisition source-to-page report
  support. Request indexing, GSC validation, paid OpenSEO actions,
  rank-tracking setup, external publication, paid acquisition, synthetic
  events, and metric-definition changes remain excluded. The approved change
  occupies the single production slot until production verification.
- PR #114 merged at `2026-08-02T02:41:40Z` as
  `8577a2730946a110ac6d6d26d15e27c4e250505c`; Vercel completed production at
  `2026-08-02T02:42:26Z`. The deployed technical, locale, canonical, schema,
  source, FAQ-policy, and responsive-render gates passed. The experiment is
  now live and measuring, the production slot is open, and its actual 24-hour
  boundary is after `2026-08-03T02:42:26Z`. No indexing request or GSC
  validation was submitted.
- At `2026-08-02T04:14:53Z`, the due 24-hour readout for
  `EXP-2026-08-01-zhtw-llm-wiki-v2-refresh` found no complete authenticated
  post-deploy GSC or Vercel window. Its five-impression exposure guard was not
  met, so the result is inconclusive rather than success or failure. The live
  technical, canonical, hreflang, schema, sitemap, source, FAQ-policy, and
  visible-content floor remained green. The intervention is stopped and
  superseded before another change touches the same canonical family.
- At `2026-08-02T04:14:53Z`, the user approved implementation, build, PR,
  merge, automatic Vercel deployment, and read-only production verification
  for `EXP-2026-08-01-karpathy-llm-wiki-locales-refresh`. The bounded change
  refreshes the existing English, zh-TW, and zh-CN LLM Wiki canonicals around
  the co-primary Karpathy LLM Wiki and AI knowledge-base intent. It creates no
  new URL. Request indexing, GSC validation, paid OpenSEO actions, external
  posts, paid acquisition, synthetic events, analytics mutation, and metric
  changes remain excluded. This approved preparation occupies the single
  production slot until production verification.
- At `2026-08-02T04:34:55Z`, the three-language refresh completed local
  implementation and verification. The experiment is active and still
  occupies the production slot until the approved PR, merge, Vercel
  deployment, and production checks complete. The local gate passed 222 SEO
  tests, lint, build, the built technical audit, the Goal verifier, diff
  hygiene, and English, zh-TW, and zh-CN responsive rendering including a
  separate 320px no-overflow check.
- PR #116 merged at `2026-08-02T04:39:10Z` as
  `93c943637e8e7dad4db881fd2564b18abca4a208`, and Vercel production completed
  at `2026-08-02T04:39:55Z`. The deployed technical audit, exact three-locale
  canonical and schema matrix, sitemap and hreflang membership, source and
  endorsement copy, and 393px plus 320px production renders are green. The
  experiment is measuring, the production slot is open, and its actual
  24-hour boundary is after `2026-08-03T04:39:55Z`.
- At `2026-08-02T07:41:27Z`, the user explicitly approved commit, Git push,
  PR creation and merge, automatic Vercel deployment, and read-only production
  verification for the exact
  `EXP-2026-08-02-ai-knowledge-base-tool-selection` three-locale family.
  Request indexing, GSC validation, paid actions, external publication,
  synthetic events, analytics mutation, and metric-definition changes remain
  excluded. The approved change continues to consume the single production
  slot until production verification completes.
- The weekly window is a reporting boundary, not a publish gate. Only one
  website change may be in `approved` or `active` preparation at a time;
  production-verified `live`, `measuring`, and `extended` cohorts continue
  their readouts without blocking the next evidence-backed change.
- PR #58 merged at `2026-07-23T15:18:29Z` as
  `7166bad1e3020bac60c9454780d2b732e17e4242`. Vercel production completed at
  `2026-07-23T15:19:18Z`.
- PR #60 merged at `2026-07-24T18:53:32Z` as
  `f8b8adc9dc0cbbcb40c74f8928676d142268f643`. Vercel production completed at
  `2026-07-24T18:54:22Z`.
- PR #62 merged at `2026-07-24T19:17:15Z` as
  `e8c089a0391795e778b2e02f1bd11355fda4e4e8`. Vercel production completed at
  `2026-07-24T19:18:03Z`.
- PR #63 merged at `2026-07-24T20:18:36Z` as
  `73c3f0d6a2d7937408df1d297ef0607bd2637fcd`. Vercel production completed at
  `2026-07-24T20:19:21Z`.
- PR #65 merged at `2026-07-24T20:47:55Z` as
  `7f54c64a46d48e1d5f0f4d619bdd5a61aaba75dd`. Vercel production completed at
  `2026-07-24T20:48:42Z`.
- PR #67 merged at `2026-07-24T21:12:18Z` as
  `6de693d7069db65455712022efbad0520830746d`. Vercel production completed at
  `2026-07-24T21:13:05Z`.
- PR #69 merged at `2026-07-24T23:07:44Z` as
  `ee9694d40771a6477bf9b7c294f1ec45f7dd7c69`. Vercel production completed at
  `2026-07-24T23:08:30Z`.
- PR #73 merged at `2026-07-25T00:04:41Z` as
  `9883ddaf74ae07667a57d752aee59468c2d0ee1c`. Vercel production completed at
  `2026-07-25T00:05:36Z`.
- PR #75 merged at `2026-07-25T00:40:19Z` as
  `052fb4952b5c7bd38bca6633197ff7ca8b92c245`. It changed only the weekly SEO
  report generator, its tests, and the 2026-07-24 audit. Vercel completed the
  resulting production build, and the deployed technical audit remained
  green.
- Goal deadline: 2026-08-18.
- Contract approval: approved by the user in this Codex task on
  `2026-07-18T22:06:21Z`.
- Website-affecting experiment:
  `EXP-2026-09-01-business-metric-definition-knowledge-base-locales` is the
  latest live, production-verified, measuring experiment from the fixed
  `2026-09-01T05:08:53Z` boundary. PR #167 merged as
  `7664d1a3d3578533fab8aed626856930e3d04b11`; it no longer consumes the
  production slot, which is open.
  `EXP-2026-08-31-course-wiki-from-lecture-notes-locales` is live,
  production-verified, and measuring from the fixed
  `2026-09-01T04:26:43Z` boundary. PR #166 merged as
  `9b12ad73eb51c95d013e69e455c1a67d03f0e08d`; it no longer consumes the
  production slot.
  `EXP-2026-08-30-ict-supplier-due-diligence-locales` is live,
  production-verified, and measuring from the fixed
  `2026-08-31T01:26:37Z` boundary. PR #160 merged as
  `6608763f95f016a611041ddf50324e2ac616c77e`; it no longer consumes the
  production slot.
  `EXP-2026-08-30-competitive-intelligence-knowledge-base-locales` is live,
  production-verified, and measuring from the fixed
  `2026-08-30T19:48:14Z` boundary. PR #158 merged as
  `f68b16b82d1c6c28f816c4ab0cf5c164232fe3c1`; it no longer consumes the
  production slot.
  The product-research-to-PRD family is live, production-verified, and
  measuring without consuming the production slot.
  PR #152 merged at `2026-08-29T06:43:59Z` as
  `66f7b012f25174cac63e94dcec8b27b9b3d6e5e2`; Vercel production completed at
  `2026-08-29T06:44:59Z`. The production slot is open.
  The source-backed investment-research family is also live,
  production-verified, and measuring without consuming the slot. PR #150
  merged at `2026-08-29T06:01:49Z` as
  `b9fb06d1eb0fdd3c07c0a271332f8166c9fcef6e`; Vercel production completed at
  `2026-08-29T06:02:35Z`.
  The consultant client-project knowledge-base family is live,
  production-verified, and measuring without consuming the production slot;
  PR #148 merged at `2026-08-29T04:58:27Z` as
  `8dc5990c2ed2892ce0afbd10962ea175cb53d534`, and Vercel production completed
  at `2026-08-29T04:59:15Z`.
  `EXP-2026-08-27-source-backed-research-knowledge-base-locales` remains live,
  production-verified, and measuring without consuming the slot. PR #145
  merged at `2026-08-28T03:49:03Z` as
  `37b28a0df3e2e85a41ca7ec4bb9d25db3149ca89`; Vercel production completed at
  `2026-08-28T03:49:51Z`. The retrieval-regression family is also live and
  measuring from its fixed `2026-08-27T04:32:45Z` production boundary.
  Request indexing, GSC validation, analytics mutation, paid actions,
  synthetic events, and external publication remain excluded until separately
  approved.
  `EXP-2026-08-24-multi-agent-knowledge-conflicts-locales` is live,
  production-verified, and measuring, so it no longer consumes the production
  slot. PR #141 merged at `2026-08-24T06:25:27Z` as
  `ffa458414ce462bc8eb953da1e4ffb1c03c116e8`; Vercel production completed at
  `2026-08-24T06:26:03Z`. It adds one English, zh-TW, and zh-CN canonical for
  stale shared-knowledge candidates, contradictory claims, and supersession
  history. Request indexing, GSC validation, external publication, paid
  actions, synthetic events, analytics mutation, and metric-definition
  changes remain excluded.
  `EXP-2026-08-23-pdf-ingestion-troubleshooting-locales` is live,
  production-verified, and measuring, so it no longer consumes the production
  slot. PR #140 merged at `2026-08-24T03:33:23Z` as
  `3a4b2aedc7d827cf9999161a1f27bc1e678ebcda`; Vercel production completed at
  `2026-08-24T03:34:00Z`.
  `EXP-2026-08-23-knowledge-retrieval-policy-locales` is live,
  production-verified, and measuring, so it no longer consumes the single
  production-in-flight slot. It adds one English, zh-TW, and zh-CN canonical
  for the per-task query, pre-retrieve, autonomous-retrieval, progressive-
  disclosure, and skip decision. PR #138 merged at `2026-08-24T01:35:09Z` as
  `c95d009437b910a6b85f9d648e667e2d89b70d66`; Vercel production completed at
  `2026-08-24T01:35:46Z`. At
  `2026-08-24T01:21:21Z`, the controller recorded the user's explicit approval
  for the exact commit, push, PR creation, merge, automatic Vercel deployment,
  and read-only production-verification scope. Request indexing, GSC validation,
  external publication, paid actions, synthetic events, analytics mutation,
  and metric-definition changes remain excluded.
  `EXP-2026-08-23-citation-verification-locales` is live,
  production-verified, and measuring, so it no longer consumes the single
  production-in-flight slot. It adds one English, zh-TW, and zh-CN canonical
  for the claim-to-evidence citation diagnostic task. PR #137 merged at
  `2026-08-23T22:20:42Z` as
  `b04a5e2ea480bf6a689e14bf6bac7267b8d7ed12`, and Vercel production completed
  at `2026-08-23T22:21:18Z`. At
  `2026-08-23T22:08:21Z`, the controller recorded the user's explicit approval
  for the exact commit, push, PR creation, merge, automatic Vercel deployment,
  and read-only production-verification scope. Request indexing, GSC
  validation, external publication, paid actions, synthetic events, analytics
  mutation, and metric-definition changes remain excluded.
  `EXP-2026-08-23-coding-agent-source-backed-knowledge-base` is live,
  production-verified, and measuring; it no longer consumes the production
  slot. PR #136 merged at `2026-08-23T18:04:33Z` as
  `e3ea912d458bfbe7c0ad864872effe48a9ca9c97`, and Vercel production completed
  at `2026-08-23T18:05:09Z` as deployment `6051054690`.
  Historical experiment
  EXP-2026-08-08-source-backed-ai-knowledge-base-snippet-refresh is live,
  production-verified, and measuring for the existing English source-backed AI
  knowledge-base canonical; it no longer consumes the single production slot.
  It creates no URL and leaves both Mandarin counterparts unchanged. PR #121
  merged at `2026-08-09T15:31:50Z` as
  `3736a89135be0ef826cb6eaf1f1d039140bf7145`; Vercel deployment
  `dpl_93RVywCS6MBFQnhnEdeA8UxzVXqM` was created at
  `2026-08-09T15:31:53.447Z` and was first verified `READY` by
  `2026-08-09T15:34:35Z`. Request indexing, GSC validation, external
  publication, paid action, synthetic events, analytics mutation, and metric
  changes remain separately approval-gated.
  `EXP-2026-08-09-tool-selection-home-links` is live, production-verified, and
  measuring; it no longer consumes the single production slot. At
  `2026-08-09T19:13:25Z`, the user approved commit, push, PR, merge, automatic
  Vercel deployment, and read-only production verification for this exact
  scope. PR #122 merged at `2026-08-09T19:25:13Z` as
  `9d49f9c4fdb1e2ba64f946cc7e4e0fe1236bb84e`; production deployment
  `dpl_BktDsAq8rJuwVDrDaughv8sT48kg` was created at
  `2026-08-09T19:25:15.881Z` and first verified `READY` at
  `2026-08-09T19:26:04Z`. Each already indexed English, zh-TW, and zh-CN
  AI-knowledge-base tool-selection target now has its same-locale homepage
  plus Learn hub as two distinct non-self internal-link sources. Request
  indexing, GSC validation, external publication, paid action, synthetic
  events, analytics mutation, and metric changes remain approval-gated.
  `EXP-2026-08-02-ai-knowledge-base-tool-selection` is live,
  production-verified, and measuring for its exact English, zh-TW, and zh-CN
  tool-selection canonical family; it no longer consumes the single
  production slot.
  `EXP-2026-08-01-karpathy-llm-wiki-locales-refresh` is production-verified
  and measuring; it no longer occupies the single production slot. It
  refreshes only the existing English, zh-TW,
  and zh-CN LLM Wiki canonical family, keeps LLM Wiki and AI knowledge base
  co-primary, and exposes the independently corroborated Karpathy modifier
  without implying an endorsement. Publication must retain independent
  five-impression per-locale exposure guards.
  `EXP-2026-08-01-document-knowledge-base-guide` is live,
  production-verified, and measuring; it no longer consumes the single
  production slot. Its
  three locale URLs keep independent 5-impression minimum-exposure guards and
  start their measurement clocks from Vercel production completion at
  `2026-08-02T02:42:26Z`. PR #114 merged as
  `8577a2730946a110ac6d6d26d15e27c4e250505c`. The immutable contract is in
  `docs/seo-audits/2026-08-01-tool-boundaries-and-document-knowledge-base-gate.md`.
  `EXP-2026-08-01-obsidian-knowledge-base-locales` is live,
  production-verified, and measuring; it no longer consumes the single
  production slot. It refreshes the existing zh-TW Obsidian + Claude Code
  route around direct files, editor context, MCP, and a maintained AI
  knowledge-base lifecycle, then adds the independently corroborated zh-CN
  counterpart. PR #110 and corrective PR #111 are merged; corrected Vercel
  production completed at `2026-08-01T21:09:50Z`. English remains unchanged.
  Indexing, validation, external publication, paid acquisition, synthetic
  events, and account mutation remain separately approval-gated.
  `EXP-2026-08-01-zhtw-llm-wiki-v2-refresh` is stopped and superseded after an
  inconclusive 24-hour readout with no complete authenticated post-deploy
  window. PR #101 merged at `2026-08-01T04:04:21Z` as
  `ee72f1dea9bd46e93db220fb70cca420d4684f56`; Vercel production completed at
  `2026-08-01T04:05:07Z`. No repeat indexing request is due.
  `EXP-2026-07-29-docs-github-acquisition` is live,
  production-verified, and measuring; it no longer consumes the single
  production slot. PR #98 merged at `2026-07-30T07:26:34Z` as
  `15fbea08073646d977b9c3b1036e592fe99f5a10`; Vercel production completed
  at `2026-07-30T07:27:30Z`. The live English Docs article renderer exposes
  one bounded `docs-article` GitHub outbound path, and the deployed technical,
  canonical, indexability, FAQ policy, console, and responsive checks pass.
  `EXP-2026-07-29-obsidian-claude-code-refresh` is live,
  production-verified, and measuring; it no longer consumes the single
  production slot. It refreshes the
  existing English Obsidian canonical around the modifier-qualified
  `obsidian claude code`, `claude code obsidian`, and `obsidian mcp` intent;
  it creates no new URL or locale. PR #95 merged at
  `2026-07-29T06:06:33Z` as
  `04fce969e09e56dee72b97bd0b59da05a09b4f61`; Vercel production completed
  at `2026-07-29T06:07:17Z`. The deployed technical, locale, content, and
  responsive render checks passed.
  Indexing requests, GSC validation, external publication, paid acquisition,
  synthetic analytics events, and metric changes remain unapproved.
  `EXP-2026-07-29-zhcn-llm-wiki-knowledge-base-refresh` is live,
  production-verified, and measuring; it no longer consumes the slot. PR #92
  merged at `2026-07-29T05:16:36Z` as
  `1618945972a6957c4fd08501de464d2fb94627f1`, and corrective PR #93 merged
  at `2026-07-29T05:27:38Z` as
  `5a4cc9264a9fa7554fc20f56bbda07bdbbb50685`; corrected Vercel production
  completed at `2026-07-29T05:28:22Z`.
  `EXP-2026-07-27-download-information-architecture` is live,
  production-verified, and measuring; it no longer consumes the slot. PR #91
  merged at `2026-07-28T14:29:47Z` as
  `ca89fb2d16f51a15c8b36378a22425af346b5954`. The production audit verified
  113 sitemap URLs, 17 key pages, six utility noindex headers, sitemap-wide
  `FAQPage` absence, 25 redirects, six bridge-host redirects, and legacy-URL
  exclusions. The localized homepage recommendation and `/download` routes
  are live. Request indexing for the download surfaces was not submitted.
  The LLM-wiki implementation guide, context-loss, AI agent memory types,
  Basic Memory, SuperLocalMemory, claude-mem, stale-memory, and MCP
  shared-memory changes remain live, production-verified, and measuring; they
  do not consume the slot.
- Website-affecting technical correction:
  `TECH-2026-08-01-download-signup-attribution` is production-verified and no
  longer consumes the single production slot. GitHub release downloads,
  anonymous Umami events, and configured-audience Resend contacts remain
  separate native-unit evidence lanes.
  `TECH-2026-08-01-home-acquisition-links` is production-verified and no
  longer consumes the single production slot.
  `TECH-2026-08-01-release-v0.15.2-alignment` is production-verified and no
  longer consumes the single production slot.
  `TECH-2026-07-26-source-release-boundary` is production-verified and no
  longer consumes the single production slot.
  `TECH-2026-07-26-provider-neutral-cta-tracking`, production-verified and no
  longer consuming the single production slot.
  `TECH-2026-07-26-knowledge-base-published-date`, production-verified and no
  longer consuming the preparation slot.
  `TECH-2026-07-24-localized-learn-breadcrumb` remains production-verified
  and does not consume the slot.
- The user approved Git push, merge, and production deploy for this LLM-wiki
  refresh at `2026-07-24T20:16:19Z`. Reddit or other external publication, OSS
  submission, paid acquisition, request indexing, GSC validation, and metric
  changes remain outside that approval.
- The user approved Git push, merge, and production deploy for the localized
  Learn breadcrumb correction in this Codex task before PR #65 was created at
  `2026-07-24T20:47:07Z`. That approval did not include indexing, GSC
  validation, non-website publication, OSS submission, paid acquisition, or
  metric changes.
- The user approved local preparation, Git push, PR creation, merge, and
  production deployment for
  `EXP-2026-07-24-stale-ai-memory-diagnostic` in this Codex task on
  `2026-07-24`. That approval does not include indexing, GSC validation,
  non-website publication, OSS submission, paid acquisition, or metric
  changes.
- The user approved commit, Git push, PR creation, merge, production
  deployment, and production verification for
  `EXP-2026-07-24-superlocalmemory-comparison-refresh` in this Codex task at
  `2026-07-25T00:02:30Z`. That approval does not include request indexing,
  GSC validation, non-website publication, OSS submission, paid acquisition,
  or metric changes.
- The user approved commit, Git push, PR creation, merge, production
  deployment, and production verification for
  `EXP-2026-07-25-basic-memory-comparison-refresh` in this Codex task at
  `2026-07-25T01:01:13Z`. That approval does not include request indexing,
  GSC validation, non-website publication, OSS submission, paid acquisition,
  or metric changes.
- The user approved local preparation, commit, Git push, PR creation, merge,
  production deployment, and production verification for
  `EXP-2026-07-25-ai-agent-memory-types` in this Codex task before
  `2026-07-25T01:27:14Z`. That approval does not include request indexing,
  GSC validation, non-website publication, OSS submission, paid acquisition,
  or metric changes.
- At `2026-07-25T02:09:09Z`, the controller recorded the user's approval for
  local preparation, commit, Git push, PR creation, merge, production
  deployment, and production verification for
  `EXP-2026-07-25-context-loss-diagnostic-refresh`. That approval does not
  include request indexing, GSC validation, non-website publication, OSS
  submission, paid acquisition, or metric changes.
- At `2026-07-26T02:24:10Z`, the controller recorded the user's approval for
  local preparation, commit, Git push, PR creation, merge, production
  deployment, and production verification for
  `TECH-2026-07-26-knowledge-base-published-date`. That approval does not
  include request indexing, GSC validation, non-website publication, OSS
  submission, paid acquisition, or metric changes.
- At `2026-07-26T02:49:29Z`, the controller recorded the user's approval for
  commit, Git push, PR creation, merge, automatic production deployment, and
  production verification of the authenticated GSC query-plus-page export
  and the matching inter-window Goal observation. That approval does not
  include request indexing, GSC validation, non-website publication, OSS
  submission, paid acquisition, or metric changes.
- Active experiments: 39.
- Execution mode: primary Codex coordinator with bounded, short-lived native
  Codex subagents when parallel work helps; do not use Superpowers SDD, per
  the user's token-cost preference.
- Existing weekly automation: `weekly-origin-seo-cleanup`, ACTIVE, Friday at
  09:00, independent worktree execution; no field was changed in this setup.
- Latest completed Friday weekly action queue:
  `docs/seo-audits/2026-08-21-weekly-seo.md`, generated in the weekly
  automation worktree from authenticated GSC, query-page, Vercel, and GitHub
  evidence for `2026-07-24..2026-08-20` and imported unchanged into this
  worktree. It reports 8 GSC property clicks and 1,005 impressions, 2 visible-
  query clicks and 216 impressions, a 6-click and 789-impression visibility
  gap, 248 Vercel visitors, and 48 GitHub stars. It nominates no on-page
  action because no protected owner clears the clean post-crawl 20-page-
  impression and 3-qualified-joined-impression gate.
- Latest aligned inter-window action view:
  `/tmp/wenlan-seo-2026-07-28/weekly-seo-corrected.md`, generated from the
  authenticated `2026-06-28..2026-07-25` GSC and Vercel inputs through the
  corrected acquisition classifier. Its durable interpretation is
  `docs/seo-audits/2026-07-29-unified-acquisition-observation.md`.
- Prior reviewed growth design:
  `docs/seo-audits/2026-07-18-exposure-first-growth-design.md`.
- Latest website-affecting deployment observation: PR #114 merged at
  `2026-08-02T02:41:40Z` as
  `8577a2730946a110ac6d6d26d15e27c4e250505c`; Vercel reported production
  completion at `2026-08-02T02:42:26Z`. The deployed audit passed robots, 117
  sitemap URLs, 21 key pages, six utility noindex headers, sitemap-wide
  `FAQPage` absence, 25 redirects, six bridge-host redirects, 18 direct changed
  redirects, and legacy-URL exclusions. The live locale matrix passed 25
  direct-200 routes and four expected 404 routes. Fresh English, zh-TW, and
  zh-CN renders at `393px` and `1280px` have no document overflow or protected-
  phrase split.
- Latest source-release observation: refreshed after production deployment at
  `2026-08-13T04:02:58Z`.
  GitHub reports public `v0.15.8`, published at `2026-08-09T17:34:28Z`, with
  Windows x64, macOS Apple Silicon, Linux x64, and Linux ARM64 runtime
  archives, a macOS Apple Silicon desktop DMG, and a signed app archive. The
  production now presents `v0.15.8`; the earlier `v0.15.7` audit is
  historical. PR #123 merged at `2026-08-13T04:02:09Z` as
  `1adb1ec99b37793e807d71097069ef0dc34b518b`, and Vercel reported production
  completion at `2026-08-13T04:02:58Z`. The deployed technical audit and the
  16-route English, zh-TW, and zh-CN release-surface matrix pass at mobile and
  desktop widths. The production slot is open.
  The public Windows artifact remains a runtime ZIP rather than a desktop app.
  The historical Wenlan-versus-wenlan-app release boundary remains in
  `docs/seo-audits/2026-07-25-source-release-boundary.md`.
- Last production observation: `2026-07-26T02:32:30Z`; PR #83 merged as
  `a54f13f891d472774f48cafb8798955bf8906ce4`, and Vercel production completed
  at `2026-07-26T02:31:19Z`. Deployed robots, 110 sitemap URLs, 14 key pages,
  six utility noindex headers, sitemap-wide `FAQPage` absence, 25 redirects,
  six bridge-host redirects, and legacy-URL exclusions passed. The production
  locale matrix passed 19 expected HTTP 200 routes and five expected hard 404
  routes. The live `/learn/ai-work-memory-vs-knowledge-base` route retained
  its exact self-canonical and `index, follow`; Open Graph and Article JSON-LD
  now emit the original `datePublished: "2026-05-27"` and refreshed
  `dateModified: "2026-07-24"`, with no `FAQPage`.
- Latest authenticated inter-window observation: fetched on `2026-07-26` for
  the 28 complete days `2026-06-27..2026-07-24`. Search Console property
  totals are 7 clicks and 329 impressions; visible-query totals are 1 click
  and 81 impressions; the visibility gap is 6 clicks and 248 impressions.
  Vercel reports 1,406 visitors and 1,612 pageviews for the same range.
  GitHub REST still reports 47 stars. The deterministic temporary report is
  `/tmp/wenlan-seo/2026-07-25-goal-check.md`, with evidence fingerprint
  `sha256:05e9acea6da290f494238e55bafb3f9762ab858d44e0dec81b490a2277ba5599`.
  This is an early evidence refresh, not a scheduled experiment verdict.
- Latest unified acquisition observation: fetched for the aligned 28 complete
  days `2026-06-28..2026-07-25` and recorded in
  `docs/seo-audits/2026-07-29-unified-acquisition-observation.md`.
  `sc-domain:wenlan.app` reports 8 clicks and 395 impressions; visible-query
  totals are 2 clicks and 92 impressions, leaving a 6-click and
  303-impression visibility gap. Vercel reports 1,420 visitors and
  1,628 pageviews for the same range. GitHub reports 47 stars.
  `sc-domain:useorigin.app` separately reports 5 clicks and 516 impressions;
  it is a migration diagnostic and is never added to the Wenlan Goal metric.
  The user submitted Change of Address from `useorigin.app` to `wenlan.app`
  on 2026-07-28. Search Console now shows the move as active. The refreshed
  Wenlan sitemap was submitted and read on 2026-07-28 with status `Success`
  and 113 discovered pages.
- LLM-wiki evidence correction: the target page's 2 impressions and average
  position 3.5 are a page aggregate whose queries are fully privacy-hidden.
  The only visible `llm wiki 2.0` query row maps to `/zh-TW`, not to the
  target page. Known qualified `llm wiki` query-to-target impressions are
  therefore 0 in the authenticated `2026-06-27..2026-07-24` join. The fixed
  US English first-page SERP observation also did not show Wenlan. Position
  3.5 must not be reported as the target page's rank for `llm wiki`.
- Google Trends demand-discovery gate: resolved for the current decision at
  `2026-07-19T02:47:01Z` through signed-in official Explore UI CSV exports.
  Seventeen timeline comparisons and nine related-query exports cover
  Worldwide, US, and Taiwan; English, Traditional Chinese, and Simplified
  Chinese terms; 12 months and one five-year range. The interpreted summary
  remains in
  `docs/seo-audits/2026-07-18-trends-demand-discovery.md`, but its temporary
  raw capture directories are no longer present.
  A fresh signed-in two-query recapture at `2026-07-25T01:42:25Z` now
  preserves the complete 53-week raw `0–100` series and provenance metadata
  for `AI agent memory` and `agent memory` under
  `docs/seo-audits/data/`; values are interpreted only inside that request
  and never as search volume. The official
  unattended API remains limited-alpha/account-gated. The follow-up removed
  the false-positive `AI memory` series and the large Taiwan `Obsidian`
  anchor. It classifies `AI 筆記` as real but adjacent NotebookLM/Notion/note
  tooling demand, and exact `AI 知識庫` as too weak for a primary cluster.
- Priority-cluster Trends refresh: completed through the signed-in official
  Explore UI at `2026-08-01T04:20:26Z`. Three 53-week raw CSVs preserve
  English Worldwide, Traditional Chinese Taiwan, and Simplified Chinese
  phrase Worldwide requests under
  `/tmp/wenlan-seo-demand/2026-08-01/trends/`, with hashes and interpretation
  in
  `docs/seo-audits/2026-08-01-priority-cluster-trends-refresh.md`. The raw
  request-relative `0–100` indices strengthen one co-primary LLM-wiki and
  AI-knowledge-base lane and do not support separate Codex-knowledge-base or
  ChatGPT-knowledge-base pages. Related-query panels were not retained and do
  not support this decision. Karpathy and modifier-qualified Obsidian remain
  protected by the Frozen Goal Contract and prior inspectable evidence.
  Simplified-Chinese Worldwide data is not described as mainland-China demand.
  No experiment was started from Trends.
- Early heartbeat correction: the first
  `wenlan-claude-memory-24h-readout` wake arrived at
  `2026-07-19T18:00:08Z`, only 17 hours 33 minutes 59 seconds after production
  completion. It was not recorded as the 24-hour experiment readout.
- Actual 24-hour readout: observed at `2026-07-20T00:35:13Z`. Technical and
  production-render checks passed, but the Search Console API returned no
  query or page rows for either `2026-07-18` or `2026-07-19`; those dates are
  reporting-latency observations, not evidence of zero search demand. The
  result remains inconclusive.
- The zh-TW Obsidian article's actual 24-hour readout was recorded at
  `2026-07-24T20:10:06Z`. Technical and production-render checks passed; the
  latest GSC range ends on the launch date, the target has no confirmed index
  date, and the partial Vercel launch-day row is not a complete post-deploy
  cohort, so the result remains pending without an SEO-success judgment. Its
  7-day readout is due after `2026-07-30T15:19:18Z`. The
  `wenlan-claude-memory-24h-readout` heartbeat can now be reused for the
  earlier Claude Code experiment's 7-day readout. The independent Friday
  `weekly-origin-seo-cleanup` automation remains ACTIVE and unchanged.
- Seven additional 24-hour readouts were recorded at
  `2026-07-26T01:47:53Z` for the Learn hub, LLM-wiki category, MCP
  shared-memory exposure, stale-memory diagnostic, claude-mem comparison,
  SuperLocalMemory comparison, and Basic Memory comparison. All eight live
  routes in the batch returned HTTP 200 with exact self-canonicals and
  `index, follow`; the deployed technical audit passed with 110 sitemap URLs,
  and the production locale matrix passed 19 expected HTTP 200 routes and
  five expected hard 404 routes. Fresh desktop/mobile DOM and render evidence
  found no document or H1 overflow, no `FAQPage`, and no browser warning or
  error. The latest authenticated GSC and complete Vercel range still ends on
  `2026-07-23`, before these deployments, so every result remains pending
  without a 24-hour SEO-success judgment. GitHub remains 47 stars.
- The Claude Code memory refresh's due 7-day readout and the AI-agent-memory
  types page's due 24-hour readout were recorded at
  `2026-07-26T02:04:08Z`. The latest authenticated range still ends on
  `2026-07-23`: it does not contain seven complete post-deploy days for the
  Claude refresh and predates the AI-agent-memory deployment. The Claude
  target remains at 0 clicks, 23 impressions, and average position 38.7; its
  fixed five-query visible cluster remains at 0 clicks, 9 impressions, and
  50.0 impression-weighted average position. The original 25-impression
  post-change minimum cannot be applied because no refreshed-page crawl or
  index date is confirmed. The AI-agent-memory live route, maintained
  sources, schemas, unsupported locale 404s, and fresh desktop/mobile renders
  passed. Both results remain measuring without a causal or SEO-success
  claim, and GitHub remains 47 stars.
- The context-loss diagnostic's actual 24-hour readout was recorded after its
  boundary at `2026-07-26T02:15:47Z`. The post-boundary deployed audit passed
  with 110 sitemap URLs, and the production locale matrix passed 19 expected
  HTTP 200 routes and five expected hard 404 routes. The live English target
  retained its exact canonical, `index, follow`, Article and BreadcrumbList
  schemas, stable original and modified dates, five maintained source links,
  four related internal links, and no `FAQPage`; unsupported zh-TW and zh-CN
  routes remained 404. The authenticated range predates deployment, so the
  target remains at its 0-click, 2-impression, 9.5-position baseline without
  a 24-hour SEO-success judgment. GitHub remains 47 stars.
- An independent control-plane review found that
  `EXP-2026-07-24-ai-work-memory-knowledge-base-refresh` had reached
  production but its 24-hour readout was omitted from the first batch. The
  controller recorded a late, non-backdated readout at
  `2026-07-26T02:19:26Z`. Its live route, canonical, indexability,
  first-party sources, unsupported locale 404s, and retained production
  render evidence passed, but a follow-up review found that the Article
  schema incorrectly used `2026-07-24` as both `datePublished` and
  `dateModified`. Git history establishes the original page date as
  `2026-05-27`; the approved local correction preserves that publication
  date while retaining `2026-07-24` as the modification date. Production
  remains regressed until the correction is deployed and verified. The
  authenticated range predates deployment, so the target remains at its
  0-click, 9-impression, 8.0-position baseline without an SEO-success
  judgment. Its 7-day readout is due after `2026-07-31T18:54:22Z`.

### Fixed baseline and live provenance

The fixed baseline remains the campaign comparison anchor. The live observation
is recorded separately because rolling windows and source backfill can change
after the anchor is frozen.

| Metric | Fixed baseline | Verified live observation | Provenance | Gap to target from live observation |
| --- | ---: | ---: | --- | ---: |
| GitHub total stars | 47 | 47 at the deadline; 48 at the final read | GitHub stargazer timestamps through `2026-08-18T23:59:59Z`, plus REST captured on 2026-08-20 | 53 at the deadline |
| GSC rolling-28-day property clicks | 6 | 9 | Search Console API, `sc-domain:wenlan.app`, fixed `2026-07-21..2026-08-17`; `/tmp/wenlan-seo-final-2026-08-18/gsc-metadata.json` | 91 |
| GSC rolling-28-day property impressions | 197 | 1,024 | Search Console API, `sc-domain:wenlan.app`, fixed `2026-07-21..2026-08-17`; `/tmp/wenlan-seo-final-2026-08-18/gsc-metadata.json` | 8,976 |
| Vercel rolling-28-day visitors | 323 | 605 | Vercel Web Analytics API, project `wenlan-site`, fixed `2026-07-21..2026-08-17`; `/tmp/wenlan-seo-final-2026-08-18/vercel-metadata.json` | 1,395 |

Supporting quality split for the same live range:

- GSC property totals: 9 clicks, 1,024 impressions.
- GSC visible-query totals: 3 clicks, 222 impressions.
- GSC query visibility gap: 6 clicks, 802 impressions.
- The exact privacy-visible core query set contains 0 clicks and 3
  impressions: `llm wiki`, `llm wiki for codebase`, and
  `local ai knowledge base` each contribute one impression. It is not a
  complete non-brand total.
- Vercel raw totals: 605 visitors and 1,026 pageviews.
- Vercel direct traffic: 219 visitors and 615 pageviews.
- Vercel reports 383 `google.com`-referrer visitors and 406 pageviews while
  GSC reports 9 Google Search clicks. Preserve both native units and the prior
  anomalous-cohort warning; do not call the Vercel row human search traffic.
- Vercel reports zero AI referrals, zero Reddit referrals, and zero
  `llms.txt` hits in the fixed window. Custom CTA events remain account-gated.
- Vercel reports 2 visitors and 2 pageviews for
  `/learn/ai-work-memory-vs-knowledge-base`; the page aggregate does not
  provide a source-to-page join.
- A same-range traffic-quality audit on 2026-08-01 found that 1,132 of the
  1,148 `google.com`-referrer visitors share the exact
  `Chrome + GNU/Linux + desktop` signature. Of those, 1,109 occurred during
  2026-07-15..2026-07-23, while finalized GSC Web data records one click in
  that interval and zero clicks across Image, Video, News, Discover, and
  Google News for the full range. The authenticated Vercel Production
  dashboard's broader 30-day Hostnames view reports `wenlan.app` at 100%, so
  another production hostname does not explain the cohort. Preserve 1,468
  raw visitors as the Goal metric; report the 1,132 as
  `suspected automated/referrer-incompatible` and the remaining 336 only as
  `not matched by the exact signature`, never as confirmed human traffic.
  This diagnostic does not silently redefine qualified-source visitors. Full
  provenance and the daily reconciliation are in
  `docs/seo-audits/2026-08-01-vercel-google-referrer-quality-audit.md`.
- Unique acquisition-surface visitors and source-to-page sessions remain
  unavailable from the separate Vercel aggregates. Vercel custom events
  remain Pro/Enterprise-gated, and no authenticated Umami report was
  available, so GitHub outbound and CTA are not reported.
- The visible-query inventory currently includes Basic Memory, Claude Code
  memory, MCP memory, LLM wiki, and setup/troubleshooting. This inventory is
  measurement evidence, not the acquisition priority list. Valid problem
  clusters at bootstrap: 0. Valid problem clusters now: 1, because Claude Code
  native-memory boundaries and cross-session context passed the historical
  candidate gate in
  `docs/seo-audits/2026-07-18-growth-candidate-queue.md`.
- Current page rows with impressions are preserved in
  `/tmp/wenlan-seo/gsc-pages.csv`. The pre-publish
  authenticated query-plus-page capture in
  `/tmp/wenlan-seo/gsc-query-pages.json` exposes 11 of the target page's 23
  baseline impressions; 9 visible impressions belong to the five-query
  non-brand Claude-memory cluster at 50.0 impression-weighted average
  position. Keep the remaining 12-impression page-query visibility gap
  explicit.
- The refreshed authenticated query-plus-page export now comes directly from
  `pnpm seo:gsc:fetch` and contains 49 visible rows for
  `2026-06-27..2026-07-24` in
  `/tmp/wenlan-seo/gsc-query-pages.json`. It maps 8 visible impressions on
  the Basic Memory comparison to `basic memory`, `basic-memory github`, and
  `basicmemory`; the separate page row has 23 impressions and one click, so
  the 15-impression and one-click visibility gap remains explicit. It also
  shows that all visible rows for `/docs/changelog` and
  `/docs/data-and-privacy` are brand variants or noisy misspellings, not a
  product problem cluster. The Learn hub exposes only two visible
  single-impression rows against its 78-impression page total.
- Setup starts: no reliable website-to-success measurement; lagging and
  non-gating.
- Early partial Vercel observation: fetched at `2026-07-19T18:01:59Z` for
  `2026-06-22..2026-07-19`, with the final date still incomplete. The raw
  count was 818 visitors and 970 pageviews; direct was 230 visitors and 290
  pageviews; the existing qualified-source allowlist summed to 590 visitors
  across separate referrer rows and is not deduplicated; the target page row
  was 5 visitors and 14 pageviews. Unique acquisition-surface visitors remain
  unavailable from the separate per-path aggregate. This partial range is not
  a comparable rolling-28-complete-day Goal observation and does not replace
  the fixed or verified live baselines above.
- Early GitHub observation: 47 total stars from the read-only REST check during
  the `2026-07-19T18:00Z` heartbeat; no causal claim is attached.
- Latest target-page evidence: the existing
  `/learn/ai-work-memory-vs-knowledge-base` route has 9 impressions, 0 clicks,
  and average position 8.0 in the authenticated `2026-06-26..2026-07-23`
  page table. This is page evidence for a refresh, not proof of a visible
  query cluster or future CTR.

### Current strategy

1. Execute the approved successor campaign ending `2026-09-21` for 100 GSC
   clicks, 10,000 GSC impressions, 2,000 Vercel visitors, and 100 GitHub stars.
   Keep all source-native measures separate, and do not turn article, page,
   test, indexing, or raw-visitor counts into a substitute score.
2. Protect the contract and ledger before any campaign action.
3. Contract approval received on `2026-07-18T22:06:21Z`; the GSC target
   expansion was explicitly approved at `2026-07-31T23:54:43Z`.
4. After approval, read the latest Friday weekly report rather than duplicating
   its GSC, indexing, or technical work.
5. Build the first candidate queue from inspectable Google Trends, Reddit,
   GitHub issue/discussion, OSS documentation/directory, and SERP observations,
   preserving native units and provenance.
   The first multi-group Trends capture and interpretation is recorded in
   `docs/seo-audits/2026-07-18-trends-demand-discovery.md`. It contains
   historical observations across wiki, knowledge-base, Obsidian, and memory
   families; those observations keep their original units. On `2026-07-29`,
   the user corrected the acquisition center to AI knowledge bases, LLM wiki,
   source-backed wiki, and Obsidian or knowledge-base-adjacent workflows. On
   `2026-07-31`, the user clarified that English, zh-TW, and zh-CN are all
   first-class acquisition languages; Karpathy or LLM-wiki intent and
   AI-knowledge-base intent form one co-primary, non-ranked cluster; and Codex
   and ChatGPT join Claude Code, Obsidian, and MCP as first-class tool or
   workflow entry points. Candidate selection may separate distinct user tasks
   into pages, but it must not impose a default priority between Karpathy or
   LLM wiki and AI knowledge bases.
   Memory remains enabling product infrastructure and supporting vocabulary;
   generic memory demand no longer nominates the next acquisition asset.
   The next candidate must be selected from fresh evidence for `AI knowledge
   base`, `Karpathy LLM wiki`, `LLM wiki`, `source-backed wiki`, `knowledge
   base for AI agents`, or a modifier-qualified Codex, ChatGPT, Claude Code,
   Obsidian, or MCP intent. For Obsidian, the currently
   evidenced search language is the tool pair: `obsidian claude code`,
   `claude code obsidian`, `obsidian claude`, `obsidian mcp`, and
   `obsidian claude code mcp`. `Obsidian workflow` is an internal category,
   not a proven query. Generic `obsidian`, `obsidian knowledge base`,
   `markdown knowledge base`, and `obsidian ai memory` remain
   discovery-only. Generic `knowledge base`, unqualified `AI wiki`, and exact
   Taiwan `AI 知識庫` still require a clean intent and coverage-gap check;
   `AI 筆記` remains discovery-only.
   A 2026-07-25 follow-up found independent direct-comparison surfaces from
   Mem0, Creed, and Hippo that include Basic Memory in a product-selection
   decision. That evidence remains valid for the already-shipped comparison
   refresh, but it no longer nominates a new acquisition asset. Each external
   page or repository remains one inspectable observation, not keyword volume.
   On 2026-07-29, the user added a Simplified Chinese community-heat lane.
   Once per campaign window or before candidate selection, inspect public
   V2EX, Bilibili, Juejin, Zhihu, and maintained Chinese OSS wording. Preserve
   every platform metric in its native unit, deduplicate reposts, and keep
   login-gated sources manual. The initial snapshot in
   `docs/seo-audits/2026-07-29-zh-cn-community-demand.md` independently
   repeats `LLM Wiki 知识库`, `AI 知识库`, `本地 AI 知识库`,
   `Claude Code + Obsidian`, and `Obsidian CLI + Claude Code`. These phrases
   can nominate advance preparation through the full candidate gate; they do
   not enter authenticated GSC input or become keyword-volume estimates.
6. Prefer one existing indexed acquisition page with impressions for the first
   bounded experiment. Consider a net-new search asset only if the complete
   candidate gate passes, the preceding website change is production-verified,
   and the intent does not overlap an existing page.
7. Prepare local changes and verifier evidence. Ask for approval only at the
   frozen external/shared-state boundaries.
8. Keep useful launched cohorts on their predeclared readout schedule, but do
   not ship another on-page change while the current owner is below the
   authority-first post-crawl, 20-page-impression, or 3-qualified-joined-
   impression gate. Measurement waiting does not block read-only authority
   work or an explicitly approved live distribution action.
9. Audit inspectable authority paths before any further content discovery.
   Reconcile existing directory PRs against merged or live state, reject
   inactive or misclassified surfaces, and prepare at most one exact-fit path
   whose current contribution gate and review cadence are both verified. An
   open PR remains attempted distribution, not authority.
10. Do not nominate another article, translation, title, metadata, schema, or
   internal-link experiment under the stopped campaign. A future numeric
   campaign may reconsider an existing indexed owner only after explicit user
   approval and the protected post-crawl, 20-page-impression, and
   3-qualified-joined-impression gates all pass.

### Current gap

- Successor starting range: `2026-07-24..2026-08-20` from authenticated GSC
  and Vercel APIs, with GitHub captured at `2026-08-21T08:23:54.719Z`.
- Stars: 52 short from the fixed successor starting observation.
- GSC property clicks: 92 short from the fixed successor starting observation.
- GSC property impressions: 9,015 short from the fixed successor starting
  observation.
- Vercel visitors: 1,752 short from the fixed successor starting observation.
- Latest completed weekly observation for the same nominal range, captured
  later after GSC backfill, reports 8 property clicks and 1,005 impressions.
  That is 92 clicks and 8,995 impressions short of the protected targets.
  Visible-query rows report 2 clicks and 216 impressions, leaving a 6-click
  and 789-impression visibility gap. Vercel remains 248 visitors and GitHub
  remains 48 stars. This later observation does not rewrite the fixed starting
  baseline of 985 impressions.
- The completed predecessor campaign remains historically 53 stars, 91 GSC
  clicks, 8,976 GSC impressions, and 1,395 Vercel visitors short at its own
  deadline. Those gaps do not replace the successor baseline.
- Legacy migration diagnostic: `sc-domain:useorigin.app` still has
  516 impressions and 5 clicks in the same aligned range. Those values are
  not added to the Wenlan Goal metric.
- Measurement gaps: complete non-brand page impressions, unique
  acquisition-surface visitors, Umami CTA baseline, and verified setup success
  remain unavailable; none may be invented.

### Current experiment

`EXP-2026-09-01-business-metric-definition-knowledge-base-locales` is the
latest live, production-verified, measuring experiment from the fixed
`2026-09-01T05:08:53Z` boundary. Its English, zh-TW, and zh-CN owners turn
approved Markdown, text, and text-extractable PDF metric specifications into a
reviewable metric-definition wiki with formula text, grain, exclusions, owner,
source revision, review state, and supersession. Warehouse discovery, BI
integration, SQL or metric execution, lineage, data-quality monitoring,
permissions, and automatic approval or reconciliation remain excluded. The
production slot is open; the next due observations remain the 24-hour boundary
after `2026-09-02T05:08:53Z` and the seven-day boundary after
`2026-09-08T05:08:53Z`.

### Latest measuring publication

`EXP-2026-08-30-competitive-intelligence-knowledge-base-locales` is live,
production-verified, and measuring from the fixed
`2026-08-30T19:48:14Z` production boundary. It owns the task of maintaining a
bounded competitor dossier from permitted, user-collected documents with
source class, date, revision, observations, inferences, assumptions,
contradictions, stale claims, and open questions. It does not claim competitor
discovery, crawling, scraping, live monitoring, current pricing or review
collection, alerts, automatic scoring or recommendations, or legal and
commercial decisions. Local verification completed on `2026-08-30`: the Goal
and scenario verifiers passed; the focused scenario and intent tests passed
`14/14`; the full Goal suite passed `50/50`; i18n passed `76/76`; SEO passed
`252/252`; TypeScript lint passed; the production build generated `271` static
pages; the built technical audit passed with `156` sitemap owners, `24` key
pages, and no `FAQPage` in `160` built HTML files. Fresh in-app Browser checks
covered English, zh-TW, and zh-CN at desktop and exact `393px` mobile width:
every route had one H1, one exact canonical, reciprocal hreflang, Article and
BreadcrumbList schema, no horizontal overflow, no console warning or error, a
loaded product-evidence image, and an expandable visible FAQ. Source-native DOM
evidence confirmed one article, one product-evidence panel, and one instance of
each H2; duplication in an earlier stitched full-page capture was a capture
artifact rather than rendered DOM duplication. PR #158 merged at
`2026-08-30T19:47:24Z` as
`f68b16b82d1c6c28f816c4ab0cf5c164232fe3c1`; Vercel reported production
success at `2026-08-30T19:48:14Z`. All three live routes passed direct 200,
exact canonical, reciprocal hreflang, Article and BreadcrumbList schema,
desktop and exact 393px rendering, and the deployed technical audit. The
production slot is open. This proves publication integrity only; no crawl,
indexing, ranking, traffic, click, or causal result is inferred.

The clean reconstruction found that the first exact 393px Mandarin render
split `競品檔案` / `竞品档案`, `證據` / `证据`, and `追溯`.
The existing localized renderer now protects those terms, the fail-closed i18n
contract covers them, and fresh exact-width captures plus single-rectangle DOM
evidence pass. Complete clean-rebuild evidence is stored in
`docs/seo-audits/2026-08-30-competitive-intelligence-clean-rebuild-verification.md`.

The SRE incident family is live, production-verified, and measuring from its
fixed `2026-08-30T05:06:25Z` boundary; it no longer consumes the production
slot.

The product-research-to-PRD family remains live, production-verified, and
measuring without consuming the production slot. PR
#152 merged as `66f7b012f25174cac63e94dcec8b27b9b3d6e5e2` at
`2026-08-29T06:43:59Z`, and Vercel production completed at
`2026-08-29T06:44:59Z`. The three live routes passed direct 200, exact
canonical, reciprocal hreflang, Article and BreadcrumbList schema, sitemap,
visible evidence-to-PRD workflow, and deployed technical verification. This is
technical publication evidence only, not a crawl, indexing, ranking, traffic,
or causality claim. The production slot is open for the next independently
gated scenario.

The source-backed investment-research family remains live,
production-verified, and measuring without consuming the production slot. PR
#150 merged as `b9fb06d1eb0fdd3c07c0a271332f8166c9fcef6e` at
`2026-08-29T06:01:49Z`, and Vercel production completed at
`2026-08-29T06:02:35Z`.

The consultant client-project knowledge-base family remains live,
production-verified, and measuring without consuming the production slot. PR
#148 merged as `8dc5990c2ed2892ce0afbd10962ea175cb53d534` at
`2026-08-29T04:58:27Z`, and Vercel production completed at
`2026-08-29T04:59:15Z`.

The retrieval-regression and source-backed-research families remain live,
production-verified, and measuring; neither consumes the production slot.

- The retrieval-regression family went live through PR #144,
  merged as `681754936193cb035b4285709bd98ed82189e466` at
  `2026-08-27T04:31:56Z`. Vercel production completed at
  `2026-08-27T04:32:45Z`; keep that as the fixed measurement boundary.
- The source-backed research knowledge-base family went live
  through PR #145, merged as
  `37b28a0df3e2e85a41ca7ec4bb9d25db3149ca89` at
  `2026-08-28T03:49:03Z`. Vercel production completed at
  `2026-08-28T03:49:51Z`; keep that as the fixed measurement boundary.

The retrieval-regression family owns the before-generation task of comparing a
versioned golden query set before and after one controlled retrieval change.
The research family owns the bounded-paper task of building a literature
matrix and synthesis that preserve citations, contradictions, limitations,
and source updates. Their source, task, SERP, and product boundaries remain
distinct from citation verification, generic document ingestion, and Wenlan's
maintainer evaluation documentation.

The latest authenticated baseline remains source-separated: GSC property totals
are 8 clicks and 1,005 impressions, visible-query totals are 2 clicks and 216
impressions, and the visibility gap is 6 clicks and 789 impressions. Vercel
separately reports 248 visitors, including 30 attributed to Google; GitHub
reports 48 stars. The six new locale routes have no source-native page rows yet;
that evidence is unavailable rather than zero. For each family, each locale is
judged independently after a confirmed crawl and 28 complete post-crawl days,
with at least 20 target-page impressions, 3 qualified joined-query impressions,
and 1 GSC click. The 24-hour boundary is technical and indexability evidence
only, not an SEO-success readout.

Request indexing, GSC validation, external publication, paid action, synthetic
events, analytics mutation, and metric-definition changes remain excluded.

#### Historical pre-final experiment records

The `v0.15.8` release-accuracy correction was production-verified and did not
occupy the single production slot; it was a technical repair rather than a
demand experiment. Two changes were live and measuring before the stop:
EXP-2026-08-08-source-backed-ai-knowledge-base-snippet-refresh and the
three-locale tool-selection homepage links.

Their actual 24-hour readouts were recorded at `2026-08-12T05:32:55Z`. The
deployed technical contract and live content or link floors pass, but the
latest authenticated GSC and Vercel window ends `2026-08-06`, before both
deployments. The source-backed page also remains on Google's
`2026-07-29T01:09:32Z` stored crawl. Both experiments are therefore
inconclusive, not failed: neither has an attributable post-deploy performance
window or reaches its predeclared exposure floor. Keep their production pages
unchanged until the next source-native window.

A read-only fetch on `2026-08-12` confirmed that current `origin/main` is
`9d49f9c4fdb1e2ba64f946cc7e4e0fe1236bb84e` and already contains both recent
SEO publications. The campaign worktree predates those merges and is not a
safe branch to push. If the release correction is approved, rebuild only its
exact manifest from current `origin/main`; do not carry `PLAN.md`,
`EXPERIMENTS.md`, earlier campaign audits, stale homepage-link forms, or the
already-published English source-backed article into the release PR. The
exact include/exclude manifest is recorded in
`docs/seo-audits/2026-08-11-wenlan-v0.15.8-release-alignment-prelaunch.md`.

### Measuring experiment: Source-backed AI knowledge-base snippet

`EXP-2026-08-08-source-backed-ai-knowledge-base-snippet-refresh` is live,
production-verified, and measuring; it does not consume the single website
production slot. This measuring experiment refreshes only the existing English
`/learn/source-backed-wiki-pages-ai-work` canonical. It creates no URL and
does not change zh-TW or zh-CN.

The authenticated `2026-07-10..2026-08-06` GSC range gives the target 0
clicks, 8 impressions, and page-average position 9.5. Only 3 impressions are
visible in the query-page join and belong to the brand/entity query
`wenlan technology`; the hidden remainder is not invented as a keyword. The
July 30 AI-knowledge-base and source-backed-wiki candidate gate remains
inspectable, and the existing page already proves the six-command maintained
workflow. The bounded hypothesis is snippet clarity, not exact-query
targeting: an action-oriented H1, meta title, description, and first answer may
earn the page's first click.

The original `datePublished: 2026-06-06`, canonical, indexability, sitemap and
hreflang membership, Article and BreadcrumbList schema, maintained sources,
six-command workflow, visible FAQ, and absence of `FAQPage` remain fixed.
Minimum exposure is 10 GSC target-page impressions in the first 28 complete
post-deploy days; fewer impressions or a mixed range remains inconclusive.
The immutable experiment contract and provenance are in `EXPERIMENTS.md` and
`docs/seo-audits/2026-08-08-source-backed-ai-knowledge-base-snippet-prelaunch.md`.

The user approved publication at `2026-08-09T15:18:19Z`. PR #121 merged at
`2026-08-09T15:31:50Z` as
`3736a89135be0ef826cb6eaf1f1d039140bf7145`. Vercel production deployment
`dpl_93RVywCS6MBFQnhnEdeA8UxzVXqM` was created at
`2026-08-09T15:31:53.447Z` and was first verified `READY` by
`2026-08-09T15:34:35Z`; the conservative measurement clock uses that first
verified-ready time because Vercel did not expose an exact ready timestamp.
Request indexing, GSC validation, external publication, paid action, synthetic
events, analytics mutation, and metric changes remain unapproved.

The bounded refresh is locally and in production verified. The focused
acquisition contract, TypeScript check, production build, built-output and
deployed technical audits, Goal verifier, diff hygiene, metadata/schema
checks, FAQ interaction, and paired mobile/desktop visual QA pass. Fresh local
and production screenshots match pixel-for-pixel at the tested mobile and
desktop viewports. The full SEO suite passes 219 of 222 tests; its three
failures are the existing public-release drift between current public Wenlan
`0.15.7` and this site's `0.15.3`, not a regression from this snippet change.

### Measuring experiment: Karpathy LLM Wiki locales

`EXP-2026-08-01-karpathy-llm-wiki-locales-refresh` is production-verified and
measuring; the single production slot is open. It refreshes the existing
English, zh-TW, and zh-CN LLM Wiki canonical family, keeps LLM Wiki and AI
knowledge base co-primary, and exposes the independently corroborated
Karpathy modifier without implying that Andrej Karpathy endorsed Wenlan. It
creates no new URL.

The authenticated pre-publish range is `2026-07-03..2026-07-30`. GSC property
totals are 10 clicks and 660 impressions; visible-query totals are 2 clicks
and 111 impressions; the visibility gap is 8 clicks and 549 impressions.
Vercel separately reports 1,468 visitors and 1,745 pageviews. The target
family has no complete post-August-1 authenticated page window, so missing
locale rows remain unavailable rather than zero. Each locale independently
requires 5 target-page GSC impressions; locale exposure is never pooled.

The user approved implementation, build, PR, merge, automatic Vercel
deployment, and read-only production verification at
`2026-08-02T04:14:53Z`. Request indexing, GSC validation, paid OpenSEO work,
rank tracking, external posts, paid acquisition, synthetic events, analytics
mutation, and metric changes remain outside the approval. Local preparation
completed at `2026-08-02T04:34:55Z` with 222 SEO tests, lint, build, built
technical checks, the Goal verifier, diff hygiene, and three-locale responsive
rendering green. The complete demand gate is in
`docs/seo-audits/2026-08-01-karpathy-llm-wiki-three-language-demand.md`.

PR #116 merged at `2026-08-02T04:39:10Z` as
`93c943637e8e7dad4db881fd2564b18abca4a208`, and Vercel production completed at
`2026-08-02T04:39:55Z`. That exact time starts the 24h, 7d, W2, W4, and W8
clocks. The deployed audit and live three-locale route, schema, sitemap,
hreflang, visible-copy, 393px, and 320px checks pass. No new authenticated
post-deploy GSC or Vercel window exists yet, so the result remains pending and
no search or traffic lift is inferred.

### Measuring experiment: Obsidian knowledge-base locales

`EXP-2026-08-01-obsidian-knowledge-base-locales` is live,
production-verified, and measuring; the single production slot is open. It
changes one canonical family only: refresh the existing
`/zh-TW/learn/wenlan-vs-obsidian-ai-memory` page and add the missing
`/zh-CN/learn/wenlan-vs-obsidian-ai-memory` counterpart. The English route is
already measuring the current direct-files, editor-context, MCP, and durable
knowledge-lifecycle answer and remains unchanged.

The latest authenticated baseline remains source-separated: GSC property
totals are 10 clicks and 660 impressions; visible-query totals are 2 clicks
and 111 impressions; the visibility gap is 8 clicks and 549 impressions. The
English page has 0 clicks, 8 impressions, and page-average position 5.6 but no
visible joined Obsidian query. The zh-TW page has no privacy-visible GSC page
row and is not reported as zero; Vercel separately reports 2 visitors and 3
pageviews. The zh-CN route remains a hard 404 in current production and has no
baseline; the local production build now serves the candidate route directly.

The full candidate gate passes from Taiwan Trends, the OpenSEO tool-pair and
live-SERP observation, repeated English community and maintained OSS wording,
and independently repeated Simplified-Chinese Bilibili, V2EX, and Juejin
workflows. Current Wenlan source proves read-only Obsidian Source ingestion,
Markdown resync and projection, MCP, distillation, lint, and review. Each
locale keeps its own 5-impression minimum; one locale cannot supply exposure
for the other.

The earlier zh-TW-only Obsidian cohort is superseded as inconclusive rather
than mixed with this new zh-TW framing. PR #110 and corrective PR #111 are
merged and production-verified; corrected production completed at
`2026-08-01T21:09:50Z`. The 24-hour readout boundary is after
`2026-08-02T21:09:50Z`. Request indexing, GSC validation, external
publication, paid acquisition, synthetic analytics events, and account
mutation remain separately approval-gated. The immutable contract and evidence are in
`docs/seo-audits/2026-08-01-obsidian-knowledge-base-locales-prelaunch.md`.

### Measuring cohort: Obsidian Claude Code

`EXP-2026-07-29-obsidian-claude-code-refresh` is live,
production-verified, and measuring. It
keeps the existing English `/learn/wenlan-vs-obsidian-ai-memory` route while
replacing the unsupported `Obsidian AI Memory` framing with the evidenced
tool-pair intent:
`obsidian claude code`, `claude code obsidian`, `obsidian claude`,
`obsidian mcp`, and `obsidian claude code mcp`.

The candidate gate passes from the signed-in Taiwan Trends rising-query
observations, repeated Reddit and current SERP wording, three maintained
Obsidian/Claude Code OSS implementations, the existing page's four
authenticated GSC impressions, and maintained Wenlan support for read-only
Obsidian source sync plus source-backed Pages. The page will answer the
standalone smallest-layer decision—direct Markdown files, editor context,
MCP, then durable knowledge lifecycle—before describing Wenlan. Obsidian
remains an integration bridge into the AI-knowledge-base story, not the
acquisition center.

The latest aligned baseline remains source-separated: GSC property totals are
8 clicks and 395 impressions; visible-query totals are 2 clicks and
92 impressions; the query visibility gap is 6 clicks and 303 impressions.
The target page has 0 clicks, 4 impressions, and page-average position 4.5,
but no visible Obsidian query row. Vercel separately reports 4 target-page
visitors and 4 pageviews; GitHub reports 47 stars; authenticated Umami events
remain unavailable. No exact-query rank, source-to-page session, keyword
volume, SEO lift, conversion, star attribution, or causal outcome is
preclaimed.

The original publication date is pinned from git history and the live Article
schema as `2026-06-06`; only `dateModified` moves to `2026-07-29`. The focused
RED-to-GREEN contract, 196 SEO tests, 55 i18n tests, TypeScript lint,
production build, built technical checks, locale-route matrix, and fresh
desktop/mobile production-build QA pass. The full hypothesis, evidence
provenance, exposure threshold, success/failure rules, stop conditions, and
readout schedule are in
`docs/seo-audits/2026-07-29-obsidian-claude-code-prelaunch.md` and the
append-only ledger. The change is locally verified. At
`2026-07-29T06:04:29Z`, the user approved commit, push, PR creation, merge,
automatic Vercel deployment, and read-only production verification of this
exact scope. Request indexing, GSC validation, external publication, paid
acquisition, synthetic analytics events, and metric changes remain separate
explicit approval boundaries.

PR #95 merged at `2026-07-29T06:06:33Z` as
`04fce969e09e56dee72b97bd0b59da05a09b4f61`; Vercel production completed at
`2026-07-29T06:07:17Z`. The live route returns direct HTTP 200 with its exact
self-canonical, `index, follow`, stable `datePublished: "2026-06-06"`,
`dateModified: "2026-07-29"`, Article and BreadcrumbList schema, the four
intended integration layers, maintained sources, visible FAQ without
`FAQPage`, and unchanged locale behavior. The deployed technical audit,
locale matrix, complete desktop/mobile render inspection, and exact
local-versus-production image differential passed. This verifies publication
integrity only; it does not establish SEO lift, exact-query rank, conversion,
star attribution, or causality. Run the 24-hour technical/evidence readout
after `2026-07-30T06:07:17Z`.

### Measuring cohorts

This section is measurement maintenance for already-published work. It does
not nominate the next acquisition experiment and must not override the
protected AI knowledge-base and wiki focus.

`EXP-2026-07-27-llm-wiki-implementation-guide-refresh` is live,
production-verified, and measuring. It keeps the indexed English
`/learn/distilled-wiki-pages-ai-memory` canonical URL and original publication
date while adding a standalone implementation guide and five contextual
inbound links. PR #89 merged at `2026-07-27T05:28:59Z`; Vercel production
completed at `2026-07-27T05:29:47Z`. Its 24-hour readout was recorded at
`2026-07-28T05:47:53Z`; the available authenticated GSC and complete Vercel
range still ended before deployment, so the result remains pending without an
SEO-success judgment. Do not record its 7-day readout before
`2026-08-03T05:29:47Z`. The target's approved URL Inspection request was
completed on 2026-07-28 and returned `Indexing requested`; do not repeat it.
Additional indexing requests, GSC validation, external publication, synthetic
analytics events, paid acquisition, OSS submission, and metric changes remain
separately approval-gated.

The Simplified Chinese LLM-wiki and AI-knowledge-base refresh is live,
production-verified, and measuring. PR #92 plus the localized renderer
correction in PR #93 completed corrected production at
`2026-07-29T05:28:22Z`. The live route preserves
`datePublished: "2026-07-04"`, emits `dateModified: "2026-07-29"`, and passes
canonical, indexability, sitemap, hreflang, schema, visible six-command
workflow, and desktop/mobile render checks. Its 24-hour technical/evidence
readout is due after `2026-07-30T05:28:22Z`; it does not consume the
production slot.

The actual 24-hour readout was recorded at `2026-07-30T05:39:51Z`.
Canonical, indexability, sitemap, hreflang, schema dates, all seven guide
sections, the six-command workflow, FAQ policy, deployed technical audit, and
the 22-direct-200 plus five-expected-404 locale matrix pass. The latest
authenticated GSC and Vercel range still ends before deployment, so no SEO
outcome is inferred. Fresh full-page visual QA found no document or H1
overflow, but the focused mobile CJK pass found the H1 splitting `知识库` as
`知识 / 库` and the article packet splitting `来源` as `来 / 源`. The technical
readout remains measuring while a bounded mobile wrapping correction awaits
separate publication approval.

`EXP-2026-07-25-context-loss-diagnostic-refresh` is live,
production-verified, and measuring. It refreshes the existing English
`/learn/ai-coding-agent-loses-context` route around a four-way diagnostic:
native session resume, project instructions or native memory, a compact
handoff, and durable cross-session or cross-tool knowledge.

The target has 2 authenticated GSC impressions, 0 clicks, and average position
9.5, but no visible joined query row; the two-impression page-query visibility
gap remains explicit. Same-range Vercel reports 1 visitor and 1 pageview.
Two independent Reddit questions and two Anthropic GitHub issues repeat the
cross-session, compaction, and project-memory problem. Current Claude Code
documentation confirms that a fresh session, resume, CLAUDE.md, and auto
memory are separate mechanisms. Maintained Wenlan sources confirm the
`/brief`, `/recall`, `/capture`, and `/handoff` continuity loop.

The bounded refresh keeps the existing URL and H1, adds no Mandarin route,
and changes no `FAQPage`, indexing, or distribution behavior. It sharpens the
meta answer, diagnosis, native-versus-durable boundary, maintained references,
and related internal links. The complete gate, baseline, locale decision, and
readouts are recorded in
`docs/seo-audits/2026-07-25-context-loss-diagnostic-prelaunch.md`.

PR #80 merged at `2026-07-25T02:14:16Z` as
`338f5a510d0294b69b7b691d82b6da9e42481a9b`; Vercel production completed at
`2026-07-25T02:15:21Z`. The deployed technical audit, stable original and
modified dates, live metadata and schema, five maintained references,
unsupported locale 404s, sitemap membership, FAQ interaction, and complete
desktop/mobile renders passed. No SEO-success judgment is made at production
completion.

The AI agent memory types cohort is live, production-verified, and measuring.
It creates one English
`/learn/ai-agent-memory-types` acquisition page explaining working, episodic,
semantic, and procedural memory as
different architectural roles, plus where each should live.

The broader `agent memory` category is supported by the signed-in Trends
recapture and its committed 53-week raw series. Four English Reddit threads
from three independent authors repeat the taxonomy or placement problem;
CoALA and LangChain establish the four-role terminology, while Letta supports
the placement tradeoff. A coverage audit found no current Wenlan page that
answers both the taxonomy and placement decision. The page explicitly
separates this cognitive architecture from Wenlan's six capture `memory_type`
metadata values. The complete gate, native-unit baseline, locale decision,
and predeclared readouts are recorded in
`docs/seo-audits/2026-07-25-ai-agent-memory-types-prelaunch.md`.

The change is English-only because no matching Mandarin taxonomy demand has
been observed. It adds no `FAQPage` JSON-LD, indexing request, or external
distribution.

PR #78 merged at `2026-07-25T01:48:42Z` as
`4d4ff8abc51fd053809e32ec63da9e8c3d604926`; Vercel production completed at
`2026-07-25T01:49:40Z`. The deployed technical audit, live metadata and
schema, four maintained references, unsupported locale 404s, sitemap locale
membership, FAQ interaction, and desktop/mobile renders passed. No
SEO-success judgment is made at production completion.

The Basic Memory comparison refresh is live, production-verified, and
measuring. It no longer consumes the one production slot. It refreshes only
the existing English
`/learn/wenlan-vs-basic-memory` route. The authenticated target baseline is
20 GSC impressions, 1 click, and average position 14.6.
Joined visible rows `basic memory` and `basicmemory` have 5 impressions and 0
clicks; the target's one click is outside those visible rows and remains
unattributed. Same-range Vercel reports 5 visitors and 5 pageviews for the
target.

Basic Memory release v0.22.1, PyPI v0.22.1, current source commit
`5d444f0974476645f904c1446998c0a938a6e7f7`, and docs commit
`1c670035987b21f0a93d4e45ea1eed1487775f74` show that the current page's
local-vault-only framing is incomplete. Maintained sources now document local
or hosted deployment, Teams, cross-client MCP, semantic and graph search,
Agent Skills, local sync, snapshots, and hosted file history. Independent
English comparison surfaces from Mem0, Creed, and Hippo corroborate the
comparison decision without supplying keyword volume.

The bounded refresh corrects the operating-model boundary and removes
unsupported retrieval-scale and local-only history claims. It keeps the URL,
meta title, canonical, sitemap membership, locale availability, schema types,
related routes, and CTA destination unchanged. It adds no Mandarin route,
`FAQPage`, indexing request, or external distribution. The source evidence,
candidate gate, native-unit baseline, and predeclared readouts are recorded
in
`docs/seo-audits/2026-07-25-basic-memory-comparison-prelaunch.md`.

The SuperLocalMemory comparison refresh is live,
production-verified, and measuring. It no longer consumes the production
slot. It refreshes only the existing English
`/learn/wenlan-vs-superlocal-memory` route. The authenticated target baseline
is 16 GSC impressions, 0 clicks, and average position 8.6.
The separate visible query `super local memory` has 1 impression, 0 clicks,
and average position 45.0; it is not joined to the page export. Same-range
Vercel reports 7 visitors and 7 pageviews for the target.

Maintained SuperLocalMemory tag `v3.8.3`, commit
`893e6d7d521cef6013d35f0ea468eca3005916de`, npm publication
`2026-07-24T15:17:25.395Z`, README, and changelog show material drift from
the page's June reliability-layer snapshot to a local-first agent memory
control plane with temporal retrieval, team scopes and access, audit,
cache/compression, bounded loops, and framework adapters. The same source
corrects the old 74.8% zero-LLM description: Mode A Raw is 60.4% with
zero-LLM answer construction, while Mode A Retrieval is 74.8% with
GPT-4.1-mini answer synthesis. The bounded refresh compares that operational
control plane with Wenlan's explicit source-backed LLM wiki workflow and
keeps the URL, canonical, sitemap membership, locale availability, schema
types, and CTA destination unchanged. It adds no Mandarin route, `FAQPage`,
indexing request, or external distribution.

The current source evidence, candidate gate, native-unit baseline, and
predeclared readouts are recorded in
`docs/seo-audits/2026-07-24-superlocalmemory-comparison-prelaunch.md`.
The focused article contract failed against the old page and passes after the
refresh. SEO tests pass 178/178; i18n tests pass 53/53; TypeScript lint,
production build, built technical SEO, locale-route checks, full desktop and
mobile rendered QA, and `git diff --check` pass. Independent review found one
P2 gap in benchmark/license regression coverage; the repair added
article-scoped Mode C and licensing assertions, and re-review returned `SHIP`
with no remaining P0–P2 findings.

PR #73 merged at `2026-07-25T00:04:41Z` as
`9883ddaf74ae07667a57d752aee59468c2d0ee1c`; Vercel production completed at
`2026-07-25T00:05:36Z`. Deployed robots, sitemap, canonical, indexability,
utility headers, redirects, bridge hosts, schema, source links, locale
non-regression, and desktop/mobile renders passed. No SEO-success judgment is
made at production completion.

The claude-mem comparison is live, production-verified, and measuring. PR #71
merged at `2026-07-24T23:33:32Z` as
`f6e5dd083ad5086fe4c4552cee1764c8dc848645`; Vercel production completed at
`2026-07-24T23:34:19Z`. Its deployed technical, metadata,
maintained-source, and rendered checks passed, and no SEO-success judgment
was made at production completion.

The stale-memory diagnostic is live, production-verified, and measuring. PR
#69 merged at `2026-07-24T23:07:44Z` as
`ee9694d40771a6477bf9b7c294f1ec45f7dd7c69`; Vercel production completed at
`2026-07-24T23:08:30Z`. Its deployed technical and rendered checks passed,
and no SEO-success judgment was made at production completion.

The English Claude Code memory, zh-TW Obsidian, English AI work memory versus
knowledge-base, English LLM-wiki, MCP shared-memory, and
stale-memory changes remain production-verified measurement cohorts; they do
not consume the production slot.

`EXP-2026-07-24-learn-hub-exposure-refresh` ended inconclusive at
`2026-07-30T07:53:53Z` before reaching its 100-impression minimum. The
approved three-locale knowledge-base refresh changes the same English
`/learn` framing, so the older cohort is explicitly superseded rather than
mixed into future attribution.

### Latest technical correction

`TECH-2026-08-01-download-signup-attribution` is production-verified and no
longer consumes the website-change slot. PR #108 merged at
`2026-08-01T19:14:11Z` as
`3daf34b31d43ecaa4f4eaaf365a7fb3565ba3327`; Vercel production completed at
`2026-08-01T19:14:59Z`. The deployed technical audit and live English,
zh-TW, zh-CN, and Download acquisition surfaces pass.

GitHub release downloads remain cumulative point-in-time counters. Anonymous
Umami events, configured-audience Resend contacts, GitHub stars, GSC, and
Vercel remain separate native-unit evidence without a causal or person-level
join. All six Resend properties and the production feature flag are live. No
fabricated contact or synthetic analytics event was created. The complete
production record is in
`docs/seo-audits/2026-08-01-download-signup-attribution-prelaunch.md`.

### OpenSEO evaluation

The bounded `2026-08-01` OpenSEO trial is complete without connecting GSC or
buying a plan. OpenSEO remains an optional third-party demand-discovery and
live-SERP lane, not an authority for Wenlan performance. In its own displayed
DataForSEO-backed volume unit, the strongest tested seeds were United States
`llm wiki` at 5,400, United States `AI knowledge base` at 880, United States
`obsidian claude code` at 210, Taiwan `AI 知識庫` at 210, and United States
`chatgpt knowledge base` at 50. United States `codex knowledge base` collided
with an unrelated game intent, and Singapore `AI 知识库` returned insufficient
data; neither may nominate a direct page.

Keep LLM Wiki, Karpathy, and AI knowledge base as one top acquisition family.
Keep Obsidian plus Claude Code/MCP as the next clean workflow cluster. Treat
ChatGPT as a smaller monitored lane and use task-qualified Codex/context/MCP
phrasing only after independent corroboration. OpenSEO's broad AI expansions
were noisy and its Simplified Chinese result did not close the evidence gap,
so GSC, inspectable Trends, and provenance-preserving Chinese-community
observations remain necessary. No new article or experiment starts from this
evaluation alone. After the technical correction reached production, the
OpenSEO tool-pair observation combined with authenticated page evidence,
official Trends, maintained OSS, and Simplified-Chinese community provenance
to nominate the current Obsidian locale experiment through the full gate.
Evidence and provenance are recorded in
`docs/seo-audits/2026-08-01-openseo-evaluation.md`.

The final post-review gate completed at `2026-08-01T19:09:02Z`. The fresh-eye
review returned `MERGE` after all four findings were resolved. `pnpm
seo:goal:check`, TypeScript, 215 SEO tests, 58 i18n tests, the 214-page
production build, compiled technical SEO, 22 expected localized 200 routes,
5 expected localized 404 routes, the fixture-backed weekly pipeline, the live
audience-scoped Resend aggregate fetch, and `git diff --check` all pass. The
approved scope merged in PR #108 and is production-verified.

`TECH-2026-07-26-source-release-boundary` is production-verified and no longer
consumes the single production slot.
The original contract defect remains fixed: published wenlan-app facts come
from the highest immutable version tag with `git show`, both backend-pin
manifest shapes are supported, and missing tags fail closed instead of
silently reading a mutable working tree.

The source premise changed after that audit. Wenlan `v0.15.0` was published at
`2026-07-26T05:13:54Z` with direct native Windows x64, macOS Apple silicon,
Linux x64, and Linux ARM64 runtime archives. The bounded public-site change
adds one exact release contract, a visible homepage Download section, direct
release-asset CTAs, platform setup instructions in English, Traditional
Chinese, and Simplified Chinese, and aligned About, docs, schema, sitemap, and
social-image release claims. Windows is described as a released headless
runtime with ONNX Runtime and Vulkan support, not as a released desktop app;
wenlan-app remains pinned to published `v0.14.0`.

Local verification passed the Goal checker, 189 SEO tests, 53 i18n tests,
TypeScript, production build, compiled technical SEO, four direct release
asset URL checks, and fresh rendered QA over 18 route/locale/viewport
combinations. The first visual pass found and the second pass confirmed the
fix for awkward Chinese compound wrapping. Evidence is in
`docs/seo-audits/2026-07-25-source-release-boundary.md`. The user explicitly
approved commit, push, PR creation, merge, automatic Vercel deployment, and
production verification at `2026-07-27T04:00:43Z`; indexing requests, GSC
validation, and external publication remain unapproved.

PR #88 merged at `2026-07-27T04:03:09Z` as
`f8ca1a975f3c567de934dd757023b0b199e61e15`; Vercel production completed at
`2026-07-27T04:03:56Z`. The deployed technical audit and the exact English,
zh-TW, zh-CN, and four release-asset checks passed at
`2026-07-27T04:06:15Z`. This proves release accuracy and availability only,
not SEO lift, CTA conversion, star attribution, or causality.

`TECH-2026-07-26-provider-neutral-cta-tracking` is production-verified. Before
the correction, the live site loaded the configured Umami Cloud tracker, but
`TrackedLink` sent custom interactions only to Vercel Analytics. Vercel
custom-event reporting is account-plan-gated, so no reliable
`github_outbound` observation or diagnostic CTA baseline existed.

The bounded correction implements the provider-neutral contract already
approved in
`docs/seo-audits/2026-07-18-exposure-first-growth-design.md`: Vercel remains
the pageview source, while configured Umami becomes the single custom-event
sink for `github_outbound`, `get_started_click`, `learn_article_click`, and
`setup_path_click`. Event properties are limited to placement, locale,
context, and a fixed destination category. The Umami script is restricted to
`wenlan.app`, excludes URL search parameters, and respects Do Not Track.
`/docs/data-and-privacy` separately discloses public website analytics without
changing installed Wenlan's no-product-telemetry default.

This is a measurement correction, not an SEO-success or star-attribution
experiment. It changes no metric definition, URL, canonical, sitemap route,
locale availability, structured-data type, or `FAQPage` policy. The complete
evidence, privacy boundary, and verification contract are in
`docs/seo-audits/2026-07-25-cta-measurement-prelaunch.md`. Local preparation
is complete. The user approved commit, Git push, PR creation, merge,
automatic Vercel deployment, and production verification at
`2026-07-26T03:07:04Z`. PR #86 merged at
`2026-07-26T03:12:02Z` as
`7674c47405ed42a71f8776b8276093fbea05fefd`; Vercel production completed at
`2026-07-26T03:12:51Z`. The live tag exposes the hardened domain, query, and
Do Not Track attributes; the disclosure and normalized CTA event names are
live; and the deployed technical SEO audit passes. The production slot is
released. Synthetic production events and authenticated production event
reads remain separately unavailable or prohibited.

`TECH-2026-07-26-knowledge-base-published-date` corrects the live Article
JSON-LD for `/learn/ai-work-memory-vs-knowledge-base`. The existing indexed
page first shipped with the article registry's `2026-05-27` date, but the
2026-07-24 refresh supplied only `updatedAt`. The shared schema fallback
therefore emitted `datePublished: "2026-07-24"` and
`dateModified: "2026-07-24"`, rewriting the original publication date.

The bounded correction adds `publishedAt: "2026-05-27"` while retaining
`updatedAt: "2026-07-24"`, plus a focused regression assertion. It changes no
visible copy, URL, canonical, hreflang, sitemap membership, locale
availability, schema type, `FAQPage` policy, or experiment baseline. The user
approved commit, push, PR, merge, deployment, and production verification at
`2026-07-26T02:24:10Z`.

PR #83 merged at `2026-07-26T02:30:28Z` as
`a54f13f891d472774f48cafb8798955bf8906ce4`; Vercel production completed at
`2026-07-26T02:31:19Z`. The deployed technical audit, locale-route matrix,
exact canonical, indexability, Open Graph dates, Article JSON-LD dates, and
`FAQPage` absence passed at `2026-07-26T02:32:30Z`. The correction is
production-verified and no longer consumes the production slot.

`TECH-2026-07-24-localized-learn-breadcrumb` fixes a deterministic mismatch
between localized Learn Article JSON-LD and the visible localized breadcrumb.
Production-before checks showed the zh-TW and zh-CN article home and article
items localized correctly while item 2 still pointed to the English
`https://wenlan.app/learn` hub.

The production change uses `canonicalUrl(resolvedLocale, "/learn")` for item 2
and adds a focused regression test. Live production HTML now emits
`https://wenlan.app/zh-TW/learn` and `https://wenlan.app/zh-CN/learn`.
It changes no visible copy, article canonical, hreflang, sitemap membership,
locale availability, schema type, or `FAQPage` policy. Evidence is in
`docs/seo-audits/2026-07-24-localized-learn-breadcrumb-prelaunch.md`.

PR #65 merged at `2026-07-24T20:47:55Z` as
`7f54c64a46d48e1d5f0f4d619bdd5a61aaba75dd`; Vercel production completed at
`2026-07-24T20:48:42Z`. The deployed technical, locale-route, structured-data,
and rendered checks passed. The correction is production-verified and no
longer consumes the preparation slot.

The weekly report's changelog and data/privacy candidates remain unstarted.
The refreshed query-plus-page join shows their visible rows are brand variants
and noisy misspellings rather than a standalone changelog, privacy, or
configuration problem cluster; the remaining page impressions stay
privacy-filtered and cannot be invented. The SuperLocalMemory comparison was
the evidence-backed exception: fresh tagged source and the v3.8.3 package
established material product and benchmark drift beyond the one visible query
row, so refreshing the existing indexed page passed the full candidate gate.

### Completed localized launch

The next eligible localized candidate is a zh-TW counterpart of the existing
English `/learn/wenlan-vs-obsidian-ai-memory` page, with modifier-qualified
Obsidian, Claude Code, MCP, and agent-memory intent. It passed the candidate
gate from Taiwan Trends direction, repeated Reddit and OSS workflows,
Traditional Chinese corroboration, the English page's current GSC impressions,
and a clean zh-TW route gap.

The candidate went live at `2026-07-23T15:19:18Z`. The localized Learn
registry, static params, sitemap, locale switching, and hreflang enumerate
actual per-locale availability; the zh-TW article includes visible maintained
sources; and the nonexistent zh-CN route is a verified production 404 without
a sitemap or alternate entry.

The immutable experiment fields, source-native baseline, and exposure lane are
recorded in
`docs/seo-audits/2026-07-23-zhtw-obsidian-prelaunch.md`. The website exposure
lane consists of the localized Learn hub, sitemap/hreflang, and contextual
links from the two existing zh-TW wiki pages. Threads and other owned-social
work are excluded from this campaign.

Website push, merge, and production deploy were explicitly approved by the
user on `2026-07-23`. PR #58 is merged and production-verified.

### Working cadence

- Evidence waiting is a stop only for rewriting the same existing owner when
  its post-crawl or exposure floors are unmet. It does not block research or
  preparation of the next clean, non-overlapping trilingual scenario family.
- Each week, audit the ordered scenario backlog until one family passes every
  gate. If none passes, record every failure and continue the stated research
  direction instead of recording a bare wait or publishing a weak page.
- Read the Friday report for measurement and follow-up priorities; do not use
  its calendar boundary to delay a verified, approved website asset.
- Keep one website change in production preparation at a time. Production-
  verified measurement cohorts do not block the next change, and there is no
  fixed calendar article quota.
- Do not create a zh-CN counterpart from Taiwan-only evidence.
- Do not change the same canonical again until 28 complete days after a
  confirmed post-deploy Google crawl, except for a factual or technical
  correction that is explicitly excluded from growth attribution.

### Execution phases

- [x] Phase 0: verify repo, active Goal, weekly automation, and authenticated
  baseline provenance.
- [x] Phase 0: create the frozen contract, append-only ledger, and deterministic
  verifier with RED-to-GREEN tests.
- [x] Phase 1: receive user approval for the protected Goal contract.
- [x] Phase 2: refresh the candidate queue from evidence and keep experiment
  launches inside the production-concurrency and candidate gates.
- [x] Phase 3: prepare the approved local experiment change, verify technical
  and locale quality, and stop at any external/shared-state approval boundary.
- [x] Phase 4: append the due in-campaign readouts and preserve later W4/W8
  observations only as optional post-campaign evidence; they cannot reopen the
  stopped on-page lane.
- [x] Phase 5: read the fixed final window ending 2026-08-17 without moving
  it, record the missed targets, and stop the original campaign.

### Next decision

The publication ledger for PR #144 and PR #145 is corrected. The live
`0x11c11e/awesome-ai-research-tools` contribution rules and recent owner
decisions now show a material promotion-risk signal for another maintainer-led
Awesome-list submission, so do not publish that candidate.

The preferred next authority action is the exact four-README maintained-source
proposal in
`docs/seo-audits/2026-08-27-wenlan-research-readme-authority-proposal.patch`.
It adds one locale-aware research-workflow link from Wenlan's current source
README family and keeps every translation-sync marker valid. Return this exact
diff for separate source-repo publication approval before applying, committing,
pushing, opening or merging a pull request, or relying on automatic publication.

Do not rewrite either new canonical while it measures. Their 24-hour technical
readouts and later source-native GSC/Vercel observations do not block authority
preparation or research for the next clean, non-overlapping scenario family.

The fixed final read now governs this section. For `2026-07-21..2026-08-17`,
GSC reports 9 property clicks and 1,024 impressions; visible-query rows report
3 clicks and 222 impressions, leaving a 6-click and 802-impression visibility
gap. Vercel separately reports 605 raw visitors and 1,026 pageviews. GitHub
timestamp evidence reports 47 stars at the deadline, with 48 only at the later
read. All protected targets were missed, so the original campaign is stopped.

No existing protected page passes the corrected action contract from this
window: the exact visible core queries total only 3 impressions across three
different query owners, and the strongest relevant owner pages do not also
have 20 page impressions plus 3 joined qualified impressions. Do not publish
the previously prepared starter-schema refresh, another translation, another
title rewrite, or another internal-link shuffle from this evidence. The next
eligible growth lane is an inspectable live or merged authority path; if none
 passes its gate or lacks explicit publication approval, wait.

The completed `2026-08-21` weekly report confirms the same decision with a
newer authenticated capture. `/learn` has 140 page impressions but its three
qualified impressions represent three different intents rather than one clean
owner. The English LLM Wiki page has 16 page impressions and 2 aligned query
impressions; English Obsidian has 18 and 1; the document knowledge-base guide
has 7 and 1. All remain below the protected 20/3 gate, and the window mixes
pre- and post-change exposure. Keep those canonicals stable through the next
clean comparison on `2026-08-28`.

#### Current authority candidate

The read-only `2026-08-21T04:43:02Z` reconciliation found no new merge among
the 13 previously open directory PRs. Twelve remain open; the thirteenth,
`tolkonepiu/best-of-mcp-servers#225`, was closed because Wenlan had fewer than
that catalog's required 50 stars. Do not replace it with another small
directory submission.

Awesome Selfhosted is the only prepared authority candidate. Its rendered
repository currently reports 314,007 GitHub stars and remains active; recent
software additions were merged through 2026-08-17. Wenlan's first public
release passed the repository's four-month age gate after
`2026-08-19T22:09:18Z`, current install and source URLs return 200, the project
is maintained and Apache-2.0 licensed, and the required duplicate checks found
no Wenlan entry, issue, or PR. The exact one-file candidate and source-native
gate evidence are recorded in
`docs/seo-audits/2026-08-20-awesome-selfhosted-authority-candidate.md`.

The user approved the exact one-file submission. Upstream removed the stale
ZincSearch entry, so current upstream commit
`8d4c53ae49dd67b54447fb10da781fc681d78e04` plus the candidate passed
`make awesome_lint`, `make export_markdown`, and `git diff --check`. Commit
`5db2d2953f342d0ea953f8bfe98dea3dc2e319ec` was pushed from
`7xuanlu:codex/add-wenlan`, and PR
`awesome-selfhosted/awesome-selfhosted-data#2955` is open and mergeable with
an exact one-file diff. GitHub reported no checks for the branch at the first
read. A later source-native read at `2026-08-22T20:18:56Z` reports the
repository's `syntax-checks` workflow successful; the PR remains open,
mergeable, and without maintainer review or comment. Do not treat the open PR
as authority, message maintainers, or add
unrelated changes. The next state change is a maintainer merge followed by a
read-only check that the rendered upstream list includes Wenlan and links to
the correct site and repository.

A read-only reconciliation at `2026-08-22T04:41:52Z` found no new merge
among the remaining directory PRs. Eleven remain open and mergeable without an
author-side request, Awesome Selfhosted PR #2955 remains open and mergeable,
and `tolkonepiu/best-of-mcp-servers#225` remains closed on its 50-star gate.
`DhanushNehru/awesome-mcp-servers#52` is the only newly actionable state: it
is open but conflicting after 24 upstream commits. A local merge-resolution
candidate now incorporates current upstream
`31a75ed430ece9952da413ef81fe907780c45d46` and preserves an exact one-line
`Origin MCP` to `Wenlan MCP` replacement; compared with upstream, no workflow
or unrelated README change remains. Diff hygiene and the Wenlan repository
HTTP 200 check pass. The user approved this exact maintenance scope, and merge
commit `7247b2294e98f0556c5594915716513d6bf462d9` was pushed to the existing
branch at `2026-08-22T04:46:49Z`. PR #52 is open and mergeable again with an
exact one-file, one-line replacement. Its `hypersweep` check passes; `lychee`
still fails on 16 whole-repository URLs that return HTTP 200 and does not list
the Wenlan URL. Do not mix that unrelated upstream checker repair into PR #52
or message the maintainer automatically.

The bounded successor research lane also found one unsubmitted candidate:
`jaywcjlove/awesome-mac`. At the `2026-08-22` source-native capture it had
111,611 GitHub stars, was pushed on `2026-08-21`, exposed exact `AI Tools` and
`Note-taking` categories, and had recently merged third-party AI and knowledge
tool additions. Its rules require a useful, non-duplicate, alphabetized entry
across English, simplified Chinese, Japanese, and Korean README files. Exact
code and issue searches found no Wenlan, `wenlan.app`, `7xuanlu/wenlan`, or
`useorigin.app` duplicate. The complete gate is saved in
`docs/seo-audits/2026-08-22-awesome-mac-authority-gate.md`. This is not a
submitted PR or earned authority; stop new directory research for this waiting
window and request separate approval before preparing or publishing its exact
four-file proposal.

#### Superseded pre-final decisions

All candidate and readout text below this heading predates the fixed final
decision. It is retained as provenance only and cannot nominate or authorize
post-deadline website work.

The latest read-only progress refresh for the 28 complete days
`2026-07-15..2026-08-11` reports 7 GSC property clicks and 855 impressions,
2 visible-query clicks and 170 impressions, and a 5-click and 685-impression
visibility gap. This is 14 fewer property impressions and no additional click
versus the immediately preceding rolling window; the Goal gap therefore
widened to 93 clicks and 9,145 impressions. Vercel separately reports 1,378
raw visitors and 1,773 pageviews, 235 direct visitors and 507 pageviews, plus
a non-deduplicated acquisition source-to-page row sum of 1,187 visitors and
1,265 pageviews. GitHub remains 47 stars. Vercel custom events remain
Pro/Enterprise-gated, so CTA is unavailable rather than zero.

The same GSC page table strengthens, rather than replaces, the pending
three-language LLM Wiki starter-schema gate: English, zh-TW, and zh-CN LLM
Wiki pages report 5, 1, and 3 impressions respectively, all with zero clicks;
the corresponding source-backed pages report 8, 1, and 1 impressions, also
all with zero clicks. The existing three canonicals already own the intent,
so another URL remains rejected. The v0.15.8 technical correction is now
published and production-verified, so the production slot is open. The next
website candidate remains a bounded starter-schema, on-demand-procedure, and
acceptance-test refresh of those existing locale pages. It must keep the
independent 10-impression per-locale guards recorded in the candidate audit
and still requires separate approval before publication. No indexing request,
GSC validation, or analytics mutation occurred in the release publication.

The latest read-only Goal refresh for `2026-07-14..2026-08-10` now supersedes
the August 7 report as the current progress observation without rewriting that
weekly action queue. It reports 7 GSC property clicks and 869 impressions,
2 visible-query clicks and 174 impressions, and a 5-click and 695-impression
visibility gap. Vercel separately reports 1,370 raw visitors, 226 direct
visitors, and a non-deduplicated qualified-source row sum of 1,146 visitors.
GitHub remains at 47 stars. Every Goal metric is still below target and all
four gaps widened slightly as older dates rolled out. The source-backed snippet and
three-locale tool-selection homepage-link 24-hour readouts are now complete.
Both remain inconclusive because this authenticated window predates their
August 9 deployments; the source-backed page also lacks a confirmed
post-deploy crawl. Keep both changes stable. The English Obsidian and Claude
Code W2 readout is now complete. A page-filtered final-data GSC query for
`2026-07-30..2026-08-10` records 0 clicks and 12 impressions, satisfying the
predeclared five-impression minimum and 12-impression exposure success line.
URL Inspection separately reports an exact indexed canonical and a
`2026-08-03T11:30:48Z` mobile crawl; 9 of the impressions occur in complete
days after that crawl. This is exposure success only: it is not click, CTR,
rank, visitor, star, or campaign-goal success, and the page remains unchanged
through W4. The next due controller readout is the Mandarin Obsidian locale
W2 boundary after `2026-08-15T21:09:50Z`. The standalone current-release
correction is locally prepared and verified, but remains unpublished pending
approval for its exact commit, push, PR, merge, automatic deployment, and
production verification scope.

A read-only directory reconciliation at `2026-08-12T07:26:49Z` found all 13
submitted Wenlan directory PRs still open and no author-side review request.
Ten are `CLEAN`; `ComposioHQ/awesome-claude-skills#852` remains blocked only
on required review with all checks green; `DhanushNehru/awesome-mcp-servers#52`
and `toolsdk-ai/toolsdk-mcp-registry#433` currently report `UNKNOWN`, although
their Wenlan-specific or schema checks pass. No new listing exposure or star
lift can be claimed, and no no-op push or maintainer message is warranted.
The exact source-native state is appended to
`docs/seo-audits/2026-08-08-github-exposure-and-directory-status.md`.

The same refresh closes the omitted W2 readout for
`EXP-2026-07-24-ai-work-memory-knowledge-base-refresh`. The indexed English
comparison records 1 click and 41 impressions over complete dates after its
final production correction; authenticated URL Inspection reports an exact
indexed canonical and a `2026-07-29T01:10:28Z` mobile crawl. This exceeds the
predeclared 20-impression floor and succeeds on the original one-click rule.
It is currently the strongest protected AI-knowledge-base page, but its click
query is privacy-hidden and a 120-URL live crawl already finds six non-self
inbound sources. Keep it unchanged through W4; do not manufacture another
rewrite or link experiment from hidden intent.

A fresh three-language demand and coverage gate at `2026-08-12T06:52:10Z`
rejects another broad `RAG vs LLM Wiki` URL because the existing LLM Wiki
canonical family already owns that answer. The clean repeated job is instead
an LLM Wiki starter schema or template: a compact `CLAUDE.md` or `AGENTS.md`
contract, separate on-demand ingest/query/lint procedures, and a concrete
acceptance test. Karpathy's current idea file, independent English template
and Reddit observations, maintained OSS, a Simplified-Chinese walkthrough,
and current Chinese OSS wording independently repeat that problem. Existing
English, zh-TW, and zh-CN pages partially cover the architecture but omit the
starter-schema checklist and the important Wenlan boundary that Page rules are
built in rather than a user-authored schema. This passes the complete gate only
as a bounded refresh of the existing three canonicals, not a new URL. The
candidate and predeclared independent 10-impression locale guards are in
`docs/seo-audits/2026-08-11-llm-wiki-schema-template-candidate.md`. It is not
started: the production slot is now open, but publication remains separately
approval-gated.

The due Karpathy/LLM-Wiki and AI-knowledge-base-tool-selection seven-day
readouts completed at `2026-08-09T15:45:02Z`. All three Karpathy locale pages
remain indexed with exact canonicals, but every displayed crawl predates the
August 2 refresh; their mixed 6/1/1-impression page rows cannot satisfy the
independent post-deploy five-impression guards. All three tool-selection pages
now have confirmed post-publish crawls and exact indexed canonicals, but none
has a privacy-visible GSC page or joined qualified-query row. Vercel separately
reports post-publish tool-selection rows of English 2 visitors/6 pageviews,
zh-TW 2/2, and zh-CN 1/1, without an authenticated source-to-page row. Both
experiments remain independently inconclusive and unchanged until W2 after
`2026-08-16T04:39:55Z` and `2026-08-16T07:55:01Z` respectively.

The document-guide internal-link candidate in
`docs/seo-audits/2026-08-08-document-knowledge-base-internal-link-candidate.md`
remains deferred after its seven-day readout: English has only two mixed
target-page impressions and zh-TW/zh-CN remain privacy-hidden. Do not publish
that link from evidence below the predeclared floor.

A fresh rendered-anchor crawl at `2026-08-09T15:49:23Z` found one non-self
source per tool-selection locale before the homepage-link change. PR #122 is
now merged and production-verified: each locale has exactly two non-self
sources, its homepage and Learn hub, while the target pages remain untouched.
The 24-hour readout remains inconclusive because the latest authenticated
performance window predates deployment. Do not add another link or rewrite
the targets before a newer source-native window.

The full SEO suite also exposes a separate public-release technical defect:
GitHub now reports `v0.15.8` as the latest public stable release, while the
website release/download surface still presents `v0.15.3`. The release
includes current runtime archives, a macOS Apple Silicon desktop DMG, and a
signed app archive, so a blind version swap would miss the current download
information architecture. The prior
`docs/seo-audits/2026-08-09-wenlan-v0.15.7-release-drift.md` capture is now
historical. The corrected three-language public release, download, app-source,
license, schema, and machine-readable surfaces are now locally prepared and
verified in
`docs/seo-audits/2026-08-11-wenlan-v0.15.8-release-alignment-prelaunch.md`.
Do not publish without explicit approval and do not count the repair as
search, visitor, download, or star lift. Because current `origin/main` already
contains PR #121 and PR #122, publication must use the report's exact
release-only manifest on a fresh branch from
`9d49f9c4fdb1e2ba64f946cc7e4e0fe1236bb84e`; the current campaign branch must
not be pushed or merged directly.

At `2026-08-12`, that exact clean candidate was rebuilt locally in the
detached `/tmp/wenlan-v0158-candidate` worktree without a commit. It contains
15 release-only modified files and preserves both already-published SEO
changes from current `main`. Fresh verification passes 222 SEO tests, 63 i18n
tests, TypeScript, a 223-page production build, the built technical audit, and
diff hygiene. No commit, push, PR, merge, or deployment occurred. Publication
can proceed directly from this isolated candidate only after explicit
approval.

The fresh three-language Karpathy / LLM Wiki gate completed at
`2026-08-02T03:52:06Z`. Signed-in Trends related-query panels now independently
repeat `Karpathy`, `LLM Wiki`, `Obsidian`, and `GitHub` across the United
States, Taiwan, and a Worldwide Simplified-Chinese phrase comparison. OpenSEO's
prior native-unit results, English Reddit and maintained OSS, and public
Simplified-Chinese community wording corroborate the same family. Existing
coverage rejects another URL: the clean gap is that `Karpathy` appears only in
reference labels, not in the three localized LLM Wiki titles, first answers,
section headings, or internal-link anchors. The due zh-TW readout at
`2026-08-02T04:14:53Z` was inconclusive because no complete authenticated
post-deploy GSC or Vercel window exists, and that intervention is now stopped
and superseded. The user approved the bounded existing-canonical
three-language refresh. PR #116 is merged and production-verified from
`2026-08-02T04:39:55Z`; wait for its actual 24-hour technical and evidence
readout after `2026-08-03T04:39:55Z`, without inferring a crawl or SEO result
from deployment. The complete provenance and candidate gate are in
`docs/seo-audits/2026-08-01-karpathy-llm-wiki-three-language-demand.md`.

The document knowledge-base guide family is production-verified and measuring
from `2026-08-02T02:42:26Z`. Run its actual 24-hour technical and evidence
readout only after `2026-08-03T02:42:26Z`. The existing same-task heartbeat has
an earlier Obsidian-locale readout due after `2026-08-02T21:09:50Z`; keep that
earlier wake and let it advance to the document-guide boundary afterward
rather than creating another automation. Do not infer crawl, indexing,
impressions, clicks, or visitor lift from the successful deployment.

Keep the Vercel Goal metric raw and add the preserved traffic-quality split to
future complete-window observations before using referrer totals as evidence
of acquisition quality. The current aggregate evidence supports an exact
`suspected automated/referrer-incompatible` cohort, not a general Linux,
Chrome, Google-referrer, or bot exclusion rule. Do not call the 336-visitor
complement human traffic and do not change the protected qualified-source or
visitor definitions without explicit approval. The deterministic evidence and
capability boundary are recorded in
`docs/seo-audits/2026-08-01-vercel-google-referrer-quality-audit.md`.

Authenticated GSC URL Inspection at `2026-08-01T21:47:09Z` isolated crawl
freshness as the immediate search constraint. The user approved the fixed
four-URL request-indexing batch, and Search Console returned `Indexing
requested` for the English, zh-TW, and zh-CN Obsidian URLs and the zh-CN LLM
Wiki URL by `2026-08-01T22:00:20Z`. Do not repeat those requests, the earlier
English source-backed request, or the earlier zh-TW LLM Wiki request. Queue
acceptance is not a new crawl, indexing, ranking, traffic, click, or causal
result. Wait for the actual Obsidian-locale 24-hour boundary or later
authenticated evidence before re-reading crawl state; do not rewrite content
from this operation. The source-native inspection matrix and execution are in
`docs/seo-audits/2026-08-01-core-acquisition-url-inspection.md`.

Do not start another overlapping website edit from the current authenticated range. The
range ends on `2026-07-30`, before the August 1 homepage links, zh-TW LLM Wiki
refresh, and Obsidian locale experiment have a complete post-deploy day. The
production slot is open, but another website candidate still requires either a
new authenticated query-page join or a separately inspectable demand signal
that passes the complete candidate gate.

The fresh three-language coverage audit rejects a separate “self-updating
codebase wiki” article in this window. English Reddit and maintained OSS repeat
the documentation-drift problem, but the existing English, zh-TW, and zh-CN
LLM Wiki and source-backed knowledge-base canonicals already cover sources,
staleness, refresh, review, and the boundary that current code and tests remain
authoritative. First-party Directory Source ingestion currently accepts only
`.md`, `.txt`, and `.pdf`; the generic code chunker is not wired into that
source path. A new URL would therefore overlap existing intent and risk an
unsupported code-sync claim. Keep the phrases as a monitoring lane and revisit
only after a qualified query-page join or maintained code-ingestion proof. The
full gate is in
`docs/seo-audits/2026-08-01-self-updating-codebase-wiki-coverage-gate.md`.

The earlier zh-TW localization cohort is superseded as inconclusive because
the same URL receives a new title, first answer, and workflow framing. Keep the
English Obsidian experiment measuring independently. Each Mandarin route has
its own minimum exposure and result; do not aggregate locales or infer exact
query rank from page-average position.

At the next authenticated window, first reconcile `/learn`, the English,
zh-TW, and zh-CN LLM Wiki and source-backed knowledge-base families, and the
three Obsidian locale routes. Keep property totals, visible-query totals,
visibility gaps, page aggregates, and joined qualified queries separate. If
the evidence still predates the August 1 changes or stays below each
experiment's minimum exposure, record an inconclusive readout and do not
rewrite. Memory remains supporting infrastructure, not the acquisition
center.

The fresh signed-in Google Trends refresh at `2026-08-01T04:20:26Z` narrows
that inspection further. It keeps `LLM wiki` and `AI knowledge base` in one
co-primary category lane and rejects separate exact-phrase Codex or ChatGPT
knowledge-base pages from the retained evidence. Related-query panels were
not retained, so this refresh does not update the existing Karpathy or
modifier-qualified Obsidian decision. Reconcile the next available
authenticated query-page join with the existing English, zh-TW, and zh-CN
category pages before selecting any snippet or internal-link refresh. That
inspection may proceed without waiting for a weekly boundary when a
non-overlapping candidate passes the full gate. The preserved raw series and
full decision are in
`docs/seo-audits/2026-08-01-priority-cluster-trends-refresh.md`.

The Friday query-page audit exposed a narrower technical acquisition defect.
All three homepage dictionaries retained direct guide metadata after the
homepage redesign, but the shared homepage renderer no longer emitted those
links. In the pre-deploy production snapshot at `2026-08-01T07:28:06Z`,
English, zh-TW, and zh-CN homepages therefore routed LLM Wiki and AI
knowledge-base visitors through the Learn hub instead of linking to the
existing localized guides directly. The bounded correction is now
`production-verified` in
`docs/seo-audits/2026-08-01-home-acquisition-links-prelaunch.md`: restore one
low-density homepage navigation row to the localized LLM Wiki and
source-backed AI knowledge-base guides, preserve Download and GitHub CTAs,
and add an actual render contract so dictionary-only strings cannot satisfy
the link floor. It is a technical information-architecture correction, not a
new article or experiment start. PR #106 merged at `2026-08-01T14:19:05Z`,
and Vercel completed production at `2026-08-01T14:19:53Z`; that time is part
of the measuring zh-TW LLM Wiki page's attribution boundary.

A 113-page production internal-link crawl and matching local-build crawl now
quantify the correction. It adds exactly one new same-locale homepage source
to each of the six English, zh-TW, and zh-CN core-guide targets. The
pre-deploy production crawl exposed seven non-self sources per English guide,
three per zh-TW guide, and two per zh-CN guide; the local candidate raised
those counts to eight, four, and three respectively without changing another
source. This
supported publishing the bounded homepage correction but does not nominate a
second article or an additional link edit.

The post-deploy crawl at `2026-08-01T14:22:36Z` fetched all 113 sitemap pages
without a failure and confirmed the exact predeclared increase: eight
non-self sources per English guide, four per zh-TW guide, and three per zh-CN
guide. English, zh-TW, and zh-CN homepages each return direct 200 and render
both exact localized hrefs. The deployed technical SEO audit remains green.

The account-wide distribution correction is complete at
`docs/seo-audits/2026-08-01-oss-directory-publication-scope.md`, and the user
approved its complete non-duplicate publication scope at
`2026-08-01T05:11:57Z`. The inventory found ten still-open pre-Wenlan PRs, four
upstream-merged pre-Wenlan PRs, one additional entry merged manually after PR
closure, one closed unmerged PR with a new Glama prerequisite, and four forks
without an external PR. Existing PRs and accepted listings must be updated in
place; do not add a second Wenlan entry.

The immediate new-PR lane is the verified
`gavischneider/awesome-llm-wiki` entry. An exact `Note Taking` patch for
`appcypher/awesome-mcp-servers` must pass its current format and link checks
before it joins that lane. The repository-supported website lane for
`wong2/awesome-mcp-servers` remains pending an approved contact email; its
documented free submission path is the only permitted option, and the $39
Premium path remains prohibited as paid acquisition. Immediately before every
push or submission, search the current upstream, all-author PRs, and directory
surface for an existing Wenlan name or repository URL. The older
`punkpeye/awesome-mcp-servers` patch is not submission-ready because public
Glama reads for both Wenlan and the legacy slug return 404, and PR #7080
documents a mandatory Glama listing, runtime check, and score badge. The current Codex
plugin directory also cannot be submitted until a separately approved
repository-root plugin package and HOL scanner CI satisfy its published gate.
Publish the control-plane correction first, then execute the verified
in-place updates and eligible new submissions. Keep PR state, accepted
listing count, listing-days, GitHub stars, GSC, Vercel, and Umami in their
native units without attribution.

The same preflight found that `src/lib/releases.ts`, localized
download/get-started copy, About OG copy, changelog/security docs, and sitemap
freshness still identified `v0.15.0`, while immutable Wenlan tag `v0.15.2`
and its GitHub release were published on
`2026-07-31`. `TECH-2026-08-01-release-v0.15.2-alignment` is now live and
production-verified beside the localized refresh. Keep it outside the
experiment attribution: it updates only release-backed version, date, asset
URL/size, changelog, and freshness claims and does not start another content
experiment. Evidence and the exact boundary are in
`docs/seo-audits/2026-08-01-v0.15.2-release-alignment.md`.

#### Acquisition and migration decision

The Docs-to-GitHub bridge and the English, zh-TW, and zh-CN Learn
knowledge-base refresh are production-verified and measuring. The production
slot is open for the next non-overlapping candidate that passes the full
evidence gate. Preserve existing URLs, reciprocal locale behavior, canonical
and sitemap membership, Article and BreadcrumbList schema, and visible FAQ
without `FAQPage`.

Treat the domain migration and acquisition evidence as one operating view.
The user submitted Change of Address from `useorigin.app` to `wenlan.app` and
resubmitted the Wenlan sitemap on 2026-07-28. Search Console verification
shows the move active and the sitemap successful with 113 discovered pages.
With explicit approval, URL Inspection confirmed that the following URLs were
already on Google and then returned `Indexing requested`:

- `/learn/distilled-wiki-pages-ai-memory`
- `/learn/source-backed-wiki-pages-ai-work`
- `/learn/ai-work-memory-vs-knowledge-base`
- `/zh-TW/learn/distilled-wiki-pages-ai-memory`

Do not repeat those requests; Google states that resubmission does not improve
queue priority. No GSC validation was submitted because there is no matching
repaired coverage issue awaiting validation.

Use
`docs/seo-audits/2026-07-29-unified-acquisition-observation.md` as the current
decision view. The next authenticated read must keep the aligned date range
and show Wenlan GSC, legacy `useorigin.app` GSC, Vercel
raw/direct/qualified/page rows,
GitHub stars, and indexing together while preserving every source's native
unit and refusing a fabricated source-to-page join.

The next full candidate gate selected a refresh of the existing English
Obsidian page around modifier-qualified `obsidian claude code`, `claude code
obsidian`, and `obsidian mcp` intent. Memory is supporting infrastructure, not
the acquisition center. The standalone answer must distinguish direct
Markdown file access, real-time editor context, an Obsidian MCP tool surface,
and a maintained source-backed AI knowledge base. Keep
`/learn/wenlan-vs-obsidian-ai-memory`; do not add another Obsidian URL or
translate the refresh without matching locale evidence.

The experiment is production-verified and measuring. PR #95 merged at
`2026-07-29T06:06:33Z`; Vercel completed production at
`2026-07-29T06:07:17Z`. Preserve the original
`datePublished: "2026-06-06"`, canonical, sitemap and locale behavior,
Article and BreadcrumbList schema, and visible FAQ without `FAQPage`.
Do not rewrite the page again before a declared readout or new evidence.
At the user's request, an early partial technical/evidence observation was
recorded at `2026-07-30T05:39:51Z`, 23 hours 32 minutes 34 seconds after
production completion. It is not labeled as the formal 24-hour readout.
Technical, locale, content, and responsive render checks pass; the latest
authenticated GSC and Vercel range still predates deployment, so no SEO
outcome is inferred. A separate non-overlapping website candidate may be
prepared only after its complete gate passes; no new candidate is started by
this observation. Request indexing and GSC validation remain separately
gated.

#### Scheduled measurement maintenance

The following due readouts preserve previously launched experiment contracts.
They do not nominate new memory content or alter the acquisition priority.

The 24-hour technical/evidence readout for
`EXP-2026-07-27-llm-wiki-implementation-guide-refresh` completed at
`2026-07-28T05:47:53Z`. Keep the English target's page aggregate and joined
visible queries separate, and do not record its 7-day readout before
`2026-08-03T05:29:47Z`. Do not add a new search URL or translate the new
framing without locale-specific evidence. Actual Umami totals remain
manual/account-gated.

The
`TECH-2026-07-26-knowledge-base-published-date` correction is
production-verified: live Open Graph and Article JSON-LD preserve
`datePublished: "2026-05-27"` and `dateModified: "2026-07-24"`, and the
deployed technical and locale checks pass. Keep the related experiment's
original measurement schedule.

The context-loss diagnostic completed its 24-hour technical/evidence readout
at `2026-07-26T02:15:47Z`; run its 7-day readout after
`2026-08-01T02:15:21Z` and apply the original 5-impression minimum.

`EXP-2026-07-25-ai-agent-memory-types` completed its 24-hour
technical/evidence readout at `2026-07-26T02:04:08Z`; run its 7-day readout
after `2026-08-01T01:49:40Z` and apply the original 5-impression minimum.

`EXP-2026-07-18-claude-code-memory-refresh` completed its due 7-day readout
at `2026-07-26T02:04:08Z`, but the authenticated range did not contain seven
complete post-deploy days and no post-change crawl date is confirmed. Run its
W2 readout after `2026-08-02T00:26:09Z` with the original page and visible
qualified-cluster guards.

That W2 readout completed at `2026-08-02T06:17:58Z`. Authenticated URL
Inspection reports the page as submitted and indexed with the exact
self-canonical, but its last crawl remains `2026-07-04T09:03:21Z`, before the
July 18 refresh. The same-range backfilled page row is still below the
25-impression minimum at 0 clicks, 24 impressions, and 38.8 average position;
the fixed five-query guard is unchanged at 0 clicks, 9 impressions, and 50.0
impression-weighted average position. The W2 result is therefore
inconclusive, not a failure. Keep the page unchanged and evaluate it again at
W4 only after a post-refresh crawl can be confirmed or the original contract
otherwise becomes assessable.

The LLM-wiki, MCP shared-memory, stale-memory, claude-mem,
SuperLocalMemory, and Basic Memory 24-hour readouts were completed at
`2026-07-26T01:47:53Z`. Their production gates passed, but the latest
authenticated GSC and complete Vercel range ends before deployment, so each
result remains pending. Run their 7-day readouts after their predeclared
times from `2026-07-31T19:18:03Z` through `2026-08-01T01:04:56Z`, using the
Friday weekly evidence rather than duplicating its pipeline.

Do not run another readout for
`EXP-2026-07-24-learn-hub-exposure-refresh`; it was stopped as inconclusive
when the approved 2026-07-30 experiment superseded the same `/learn` surface.

The same-task `wenlan-claude-memory-24h-readout` heartbeat completed the
actual 24-hour zh-CN LLM-wiki readout and the user-requested early partial
English Obsidian observation at `2026-07-30T05:39:51Z`. Reuse that same
heartbeat at `2026-08-01T02:20:00Z`, safely after the Friday weekly SEO run
and the latest 7-day boundary. That batch covers the due zh-TW Obsidian,
AI-work-memory versus knowledge-base, LLM-wiki, MCP shared-memory,
stale-memory, claude-mem, SuperLocalMemory, Basic Memory,
AI-agent-memory-types, and context-loss 7-day readouts. It must not record the
Claude Code memory W2 readout before `2026-08-02T00:26:09Z`.

The document knowledge-base guide's production-verification record starts its
24-hour boundary at `2026-08-02T02:42:26Z`; do not record that readout before
`2026-08-03T02:42:26Z`. Keep the earlier Obsidian-locale heartbeat boundary
first and reuse the same task rather than creating a duplicate automation.

That due batch completed at `2026-08-01T02:37:50Z` using the authenticated
`2026-07-03..2026-07-30` weekly GSC and Vercel evidence. No source pipeline
was rerun. Target-page rows, visible joined queries, Vercel page rows, raw and
direct traffic, non-deduplicated qualified referrer rows, account-gated Umami,
and 46 GitHub stars remain separate. The range overlaps pre-deploy dates and
does not contain seven complete post-deploy dates for the 2026-07-24 and
2026-07-25 changes, so all ten results remain pending. The next scheduled
campaign readout is the Claude Code memory W2 readout after
`2026-08-02T00:26:09Z`; do not record it early.

The authenticated `2026-06-27..2026-07-24` inter-window refresh adds
19 property impressions, six visible-query impressions, four Vercel visitors,
and 19 Vercel pageviews relative to the preceding rolling range. These are
overlapping rolling-window observations, not daily gains or causal lift.
`basic memory` now has 4 visible impressions and
`basic-memory github` appears with 2 impressions, but the existing Basic
Memory page already covers that intent and its refresh was deployed after
this evidence window. The Learn hub has 78 impressions and no clicks, but the
range contains only its launch date rather than a complete post-change
cohort. Neither signal justifies stacking another edit before the scheduled
readout. The current 49-row query-plus-page export confirms these mappings and
also rejects the changelog and data/privacy queues as brand-noise candidates,
not new non-brand demand.

No additional English, zh-TW, or zh-CN content experiment is started by an
indexing action. Reassess the candidate gate under the corrected AI
knowledge-base and wiki center rather than carrying forward the old
memory-first queue. A localized candidate still needs matching
locale-specific evidence. Targeted indexing for the four URLs listed earlier
was approved and completed; do not repeat those requests.

The approved post-deploy GSC batch completed by `2026-07-30T08:07:02Z`. URL
Inspection reported each changed existing URL already on Google, and one
request-indexing action for each returned `Indexing requested`:

- `/learn`
- `/zh-TW/learn`
- `/zh-CN/learn`
- `/zh-TW/learn/source-backed-wiki-pages-ai-work`
- `/zh-CN/learn/source-backed-wiki-pages-ai-work`

The already-requested English source-backed article was excluded. Do not
repeat these requests; queue acceptance is not an indexing or ranking result.
Any URL outside this completed five-URL batch, non-website publication, or
GSC validation remains separately approval-gated.

#### 2026-08-01 authenticated tool boundary and new-content decision

The user clarified that low traffic makes eligible net-new articles a valid
growth tactic; waiting for another GSC window is not a blanket launch rule.
OpenSEO and Vercel were therefore verified inside their actual signed-in
account surfaces before changing the queue.

OpenSEO is authenticated for the `wenlan.app` project, but the hosted account
has exhausted its credits and GSC is not connected. Existing result pages are
readable; new keyword research, audit, rank tracking, GSC connection, and paid
actions remain unavailable, unverified, or separately approval-gated.

Vercel CLI 52.0.0 proved that the current Wenlan account can filter Web
Analytics by `referrerHostname` and group by `requestPath`, or filter by
`requestPath` and group by `referrerHostname`. The deterministic weekly lane
may therefore report authenticated acquisition source-to-page aggregates
without inventing a join. CTA custom events remain account-gated by HTTP 402
and must not be inferred.

The candidate gate passed for one non-overlapping three-locale workflow:
`/learn/build-local-ai-knowledge-base-from-documents`. It owns the document
ingestion, supported source types, repeatable sync, scanned-PDF boundary,
Obsidian read-only boundary, and end-to-end validation intent that the existing
conceptual LLM Wiki and source-backed knowledge-base pages do not. First-party
Wenlan source proves every product claim. The user approved commit, push, PR
creation, merge, automatic Vercel deployment, and read-only production
verification at `2026-08-02T00:36:22Z`. PR #114 merged as
`8577a2730946a110ac6d6d26d15e27c4e250505c`, and Vercel completed production
at `2026-08-02T02:42:26Z`; the change is live and measuring and no longer
consumes the production slot. Indexing requests, GSC
validation, external publication, paid actions, and account mutations remain
separately gated. See
`docs/seo-audits/2026-08-01-tool-boundaries-and-document-knowledge-base-gate.md`.
Report GSC, Vercel, Umami, GitHub, and technical evidence only when available
in their native units. Reddit or other external publication, OSS submission,
request indexing outside the fixed batch, and GSC validation remain
separately approval-gated.

#### OSS directory publication execution

The approved control-plane scope merged in PR #103 at
`2026-08-01T05:35:39Z`. The external execution then updated nine existing
pre-Wenlan PRs in place, opened four PRs that replace already-accepted legacy
listings, and opened the new exact-topic Awesome LLM Wiki PR #4. Every target
passed the just-in-time upstream, all-author PR, and directory duplicate gate
before push. `ComposioHQ/awesome-claude-skills` PR #852 passed its validation
after the Wenlan line was moved to its current alphabetical position.
`toolsdk-ai/toolsdk-mcp-registry` PR #433 passed both Package Schema Check and
biome; its trusted-main validator also checked the changed registry identity
with zero errors and zero warnings.

Keep three execution boundaries explicit. The prepared
`appcypher/awesome-mcp-servers` branch could be compared successfully, but
GitHub denied PR creation through both GraphQL and REST despite the valid fork
relationship; do not create a duplicate or misreport it as submitted.
`DhanushNehru/awesome-mcp-servers` PR #52 has a failing whole-repository link
check caused by nine unrelated upstream URLs, while the Wenlan repository URL
returns `200`; do not mix that upstream cleanup into the one-line rebrand PR.
Before destination-specific confirmation, the free `mcpservers.org` form was
prepared with Premium unchecked and held unsubmitted. That confirmation gate
was cleared by the user; the contact address remains excluded from this
repository.

The user confirmed the destination-specific public contact email and the free
`mcpservers.org` submission was accepted at `2026-08-01T06:38:49Z` as
submission ID `5334`. The authoritative response is `pending`, `plan=free`,
and `paymentStatus=not_required`; the contact address is not stored in this
repository. Treat this as one review-queue submission, not an accepted or live
listing. Do not resubmit or select Premium. Reconcile direct public listing
presence at the scheduled 24-hour and seven-complete-live-day observations.

The Glama prerequisite now has an authoritative account boundary: Glama
requires GitHub OAuth maintainer verification and a connected GitHub App
before it indexes and scores an open-source server. Installing that app or
granting repository access was not authorized by this directory batch, so the
punkpeye resubmission remains blocked. The Codex directory likewise remains
blocked on the separate repository-root plugin packaging and scanner contract.
Neither blocker authorizes a website edit, another experiment, paid listing,
indexing request, GSC validation, or analytics mutation.

The approved OSS batch now has three upstream acceptances:
`gavischneider/awesome-llm-wiki` PR #4,
`TeleAI-UAGI/Awesome-Agent-Memory` PR #72, and
`TensorBlock/awesome-mcp-servers` PR #1500. Eleven existing PRs remain open:
eight `CLEAN`, one `BLOCKED` on required review/policy, one `UNSTABLE` only
because of verified unrelated whole-repository link failures, and one
`UNKNOWN`. `XiaomingX/awesome-ai-memory` PR #8 briefly became `DIRTY` after an
upstream table reformat; the already-approved in-place maintenance scope
merged current upstream main into the same branch at
`d4f8111a17f7a2b69f3f114d60c2a23cb3e8cd4c`. Its comparison remains one Wenlan
README insertion and PR #8 is again `MERGEABLE/CLEAN`. No maintainer comment
or review requests another author-side correction. Continue passive
review-state observation; do not push no-op commits or contact maintainers
from this evidence. The complete native-unit traffic and directory status is
in `docs/seo-audits/2026-08-08-github-exposure-and-directory-status.md`.

#### Release-to-download integrity observation

The official GitHub latest release remained `v0.15.3`, published at
`2026-08-01T08:47:47Z`, when checked at `2026-08-02T06:29:47Z`; the official
tag list contained no `v0.15.4`. All four public site download assets for
Windows x64, macOS Apple Silicon, Linux x64, and Linux ARM64 resolved with
HTTP 200. The live `/`, `/download`, `/zh-TW/download`, `/zh-CN/download`,
`/about`, and `/docs/get-started` routes also returned HTTP 200, displayed
`v0.15.3`, and did not display `v0.15.4`; the applicable download surfaces
linked the expected release assets.

GitHub PRs #430 and #431 are evidence of mutable, unreleased repository work,
not a published release contract. No website correction is warranted until an
official release or tag exists and its artifacts can be verified. This
read-only observation made no website edit, push, PR, merge, deployment,
indexing request, validation submission, external publication, or analytics
mutation.

#### Acquisition hierarchy evidence guard

The local weekly report generator now prepares an explicit deterministic
`Acquisition Hierarchy Validation` section from the authenticated GSC
query-plus-page join. It keeps query impressions, joined owner impressions,
their visibility difference, observed owner pages, configured owner, and the
decision separate. A visible split or mismatch is only a routing-review signal,
not proof of cannibalization; a missing row is unavailable, not zero. Protected
locale rows are never pooled, and joined evidence below the existing
three-impression query-action floor remains `wait`.

Running the prepared generator against the latest preserved authenticated
`2026-07-03..2026-07-30` inputs produced one privacy-visible protected row:
`llm wiki 2.0` has one query impression and one joined impression on `/zh-TW`,
rather than the configured English LLM Wiki owner. No protected query is
visibly split across multiple pages. Because the only row is below the
diagnostic floor and the range predates the August 1 routing and localized
content changes, the hierarchy remains unproven rather than wrong. Do not edit
or create a page from this observation; rerun the same deterministic section
with the next authenticated query-page window.

#### Next non-overlapping content candidate

A bounded 2026-08-02 demand and coverage-gap pass rejected separate
`RAG vs LLM Wiki`, Codex/ChatGPT knowledge-base, and duplicate local/open-source
build URLs because the current LLM Wiki, MCP, and document-workflow owners
already cover those intents. The strongest clean gap is instead the
high-intent selection question: how to choose a reliable AI knowledge-base
tool.

The candidate has inspectable English Reddit, Simplified-Chinese V2EX, and
Taiwan-language result-shape evidence. OpenSEO's previously captured United
States `AI knowledge base` 880 and Taiwan `AI 知識庫` 210 remain in OpenSEO's
native third-party unit; authenticated GSC exposes no visible tool-selection
query and is not reported as zero. First-party Wenlan sources can prove the
proposed eight-test framework, and the asset remains useful without choosing
Wenlan. The clean provisional canonical family is
`/learn/choose-ai-knowledge-base-tool` plus zh-TW and zh-CN counterparts.

Decision: prepare locally; publication remains approval-gated. The current
Frozen Goal Contract has no fixed calendar article quota. The prior website
changes are production-verified and measuring, so the single preparation slot
is open and this non-overlapping candidate may enter local preparation now.
Push, PR creation, merge, deployment, request indexing, GSC validation, and
external publication remain separately gated. See
`docs/seo-audits/2026-08-02-ai-knowledge-base-tool-selection-gate.md`.

At `2026-08-02T06:57:00Z`, the candidate entered local preparation as
`EXP-2026-08-02-ai-knowledge-base-tool-selection`. It occupies the single
website preparation slot until local verification finishes. The bounded scope
is one English, zh-TW, and zh-CN canonical family plus same-locale Learn-hub
routing and deterministic SEO coverage. It must not alter the existing LLM
Wiki, document-build, source-backed trust, MCP, or Obsidian canonical owners.
No publication or external/shared-state action is approved by this local
preparation.

At `2026-08-02T07:17:04Z`, local preparation passed its deterministic and
rendered gates. The query-owner fixture keeps tool selection, document build,
LLM Wiki/category, source-backed maintenance, and Obsidian workflow intent on
distinct configured owners in English, zh-TW, and zh-CN. The complete SEO
suite passed 222/222, the i18n contract passed 63/63, TypeScript and the
production build passed, and the built technical checker verified 120 sitemap
URLs, 24 required canonicals, 24 checked pages, and no `FAQPage` across 124
built HTML pages. Fresh 393px and 1440px Chrome captures covered all three
routes; titles, hierarchy, CJK wrapping, code containment, CTA, and visible
FAQ passed, and each FAQ surface opened without browser errors.

This proves implementation separation, not search-market correctness. After
publication, each locale must independently reach its declared GSC exposure
floor. An above-floor visible query split or mismatch nominates routing review;
it does not justify preserving the new URL. The experiment remains the single
active website change. At `2026-08-02T07:41:27Z`, the user approved commit,
push, PR creation and merge, automatic Vercel deployment, and read-only
production verification of this exact scope. Request indexing, GSC validation,
external publication, paid action, synthetic event, analytics mutation, and
metric-definition changes remain excluded.

At `2026-08-02T07:54:17Z`, PR #118 squash-merged as
`4d4d805b82527bff1d312779047c7ee37408f855`; Vercel production completed at
`2026-08-02T07:55:01Z`. The live deployed checker passed 120 sitemap URLs, 24
key pages, six utility noindex headers, 120 sitemap-page `FAQPage` absence
checks, 25 redirects, six bridge-host redirects, and old-URL sitemap absence.
The experiment's publish and measurement boundary is that production
completion time; a later markup-only phrase-wrap correction does not move it.

Fresh Chrome device emulation then verified the exact 393px and 1440px CSS
viewports for all three routes. Each document's root and body scroll widths
equaled its viewport width, the title bounds stayed inside the content column,
the complete pages rendered, and the first visible FAQ opened with a non-empty
answer. The earlier apparent 393px clipping came from Chrome's command-line
window minimum, not the page. The stricter CJK pass did find that the new
localized route had not inherited the existing semantic-term wrapper, allowing
`驗收資料` / `验收资料` and `8 項` / `8 项` to split awkwardly. A focused
same-experiment correction now protects those phrases and `AI 知識庫` /
`AI 知识库`; its regression test first failed and now passes 63/63. This is a
render-only correction: visible text, metadata, canonical ownership, and the
measurement boundary remain unchanged. The correction must pass build,
technical, responsive, PR, deployment, and live verification gates before the
production readout is closed.

At `2026-08-02T08:15:04Z`, the focused correction passed its complete local
gate. The i18n contract passed 63/63, the full SEO suite passed 222/222,
TypeScript passed, the Goal verifier passed, the production build generated
223 static pages, and the built technical checker again passed 120 sitemap
URLs, 24 key pages, and `FAQPage` absence across 124 built HTML pages. The
built i18n route matrix passed 27 direct 200 routes and four intentional 404s.
Fresh exact-device Chrome captures covered all three routes at 393px and
1440px; both inline visual passes passed. The real component tree and shared
tokens remained intact, root/body width matched every viewport, complete-page
and FAQ-open states rendered, and `AI 知識庫` / `AI 知识库`, `知識庫` /
`知识库`, `驗收資料` / `验收资料`, and `8 項` / `8 项` no longer split
inside their semantic phrases. No visible copy, metadata, schema, canonical,
or experiment metric changed.

At `2026-08-02T08:21:25Z`, PR #119 squash-merged the focused correction as
`cde12da7226f8129822ae45fa61a8cc85592adce`; Vercel production completed at
`2026-08-02T08:22:13Z`. The deployed technical checker again passed 120
sitemap URLs, 24 key pages, six utility noindex headers, 120 sitemap-page
`FAQPage` absence checks, 25 redirects, six bridge-host redirects, and
old-URL sitemap absence. Fresh production Chrome device emulation covered all
three routes at exact 393px and 1440px CSS viewports. Root and body scroll
widths matched every viewport, titles stayed inside their content columns,
complete pages rendered, all first FAQs opened with non-empty answers, and the
four protected CJK phrase families remained intact. The correction is now
production-verified. The experiment remains live and measuring from its
original `2026-08-02T07:55:01Z` boundary; no indexing request, GSC validation,
external publication, paid action, synthetic event, analytics mutation, or
metric-definition change occurred.

At `2026-08-02T21:24:08Z`, the due 24-hour readout for
`EXP-2026-08-01-obsidian-knowledge-base-locales` completed. The latest
completed Friday evidence remains the source-native
`2026-07-03..2026-07-30` window and predates production, so neither Mandarin
locale has a complete post-deploy GSC or Vercel performance window. No
privacy-visible GSC page or joined qualified-query row exists for either
locale; those observations are unavailable, not zero, and each independent
five-impression guard remains unmet. Authenticated URL Inspection separately
reports both URLs on Google and indexed with exact self-canonicals. Its UI
shows a Googlebot-smartphone crawl on August 1 at `3:04:09 PM` for zh-TW and
`2:57:54 PM` for zh-CN, both after corrected production, without establishing
that the completed request-indexing action caused either state. The deployed
technical audit, exact canonicals, reciprocal hreflang, sitemap membership,
Article and BreadcrumbList dates, maintained sources, six-section answer,
visible FAQ without `FAQPage`, and fresh exact-device 393px and 1440px
renders pass. Both locale results are inconclusive, not success or failure.
Wait for the seven-day readout after `2026-08-08T21:09:50Z`; the next due
campaign readout is the document knowledge-base guide's 24-hour boundary after
`2026-08-03T02:42:26Z`. No indexing request, GSC validation, website edit,
publication, paid action, synthetic event, analytics mutation, or metric
change occurred.

At `2026-08-03T02:55:06Z`, the due 24-hour readout for
`EXP-2026-08-01-document-knowledge-base-guide` completed. The latest completed
Friday performance window remains `2026-07-03..2026-07-30` and predates
production; none of the three locale URLs has a privacy-visible GSC page or
joined qualified-query row, and neither Vercel page nor source-to-page export
contains a target row. Those observations are unavailable, not zero, so each
independent five-impression guard remains unmet. Authenticated URL Inspection
now reports the English URL indexed on Google with exact inspected canonical
and a displayed Googlebot-smartphone crawl at
`Aug 2, 2026, 7:11:47 AM`; zh-TW is discovered but currently not indexed with
no crawl, while zh-CN remains unknown to Google with no crawl. The deployed
technical audit, direct 200 routes, exact canonicals, reciprocal hreflang,
sitemap membership, Article and BreadcrumbList dates, maintained sources,
supported-source and scanned-PDF boundaries, visible FAQ without `FAQPage`,
and fresh exact-device 393px and 1440px renders pass for all three locales.
All three results are inconclusive, not success or failure. Wait for the
seven-day readout after `2026-08-09T02:42:26Z`; the next due campaign readout
is the Karpathy / LLM Wiki locale 24-hour boundary after
`2026-08-03T04:39:55Z`. No indexing request, GSC validation, website edit,
publication, paid action, synthetic event, analytics mutation, or metric
change occurred.

At `2026-08-03T04:54:40Z`, the due 24-hour readout for
`EXP-2026-08-01-karpathy-llm-wiki-locales-refresh` completed. The latest
completed Friday performance window remains `2026-07-03..2026-07-30` and
predates the `2026-08-02T04:39:55Z` production completion. English has a
pre-deploy target-page row of 0 clicks, 5 impressions, and page-average
position 6.2; zh-TW and zh-CN have no privacy-visible target-page row, and no
locale has a joined visible qualified-query row. These observations cannot
satisfy the independent post-deploy five-impression guards, so all three
locale outcomes remain inconclusive. Authenticated URL Inspection reports all
three URLs on Google and indexed with the inspected URL selected as canonical,
but the displayed crawls are still pre-deploy: English `Jul 28, 2026,
6:09:29 PM`, zh-TW `Jul 28, 2026, 6:10:28 PM`, and zh-CN `Aug 1, 2026,
3:01:38 PM`, all by Googlebot smartphone. The deployed technical audit,
direct 200 routes, exact canonicals, reciprocal hreflang, sitemap membership,
Article and BreadcrumbList dates, co-primary Karpathy LLM Wiki and AI
knowledge-base answer, non-endorsement boundary, maintained sources, visible
FAQ without `FAQPage`, and fresh exact-device 393px and 1440px renders pass for
all locales. Wait for the seven-day readout after
`2026-08-09T04:39:55Z`; the next due campaign readout is the English LLM Wiki
implementation-guide seven-day boundary after `2026-08-03T05:29:47Z`. No
indexing request, GSC validation, website edit, publication, paid action,
synthetic event, analytics mutation, or metric change occurred.

At `2026-08-03T05:38:32Z`, the due seven-day readout for
`EXP-2026-07-27-llm-wiki-implementation-guide-refresh` stopped the historical
cohort as inconclusive. The latest completed Friday window remains
`2026-07-03..2026-07-30`: GSC property totals are 10 clicks and 660
impressions, visible-query totals are 2 clicks and 111 impressions, and the
visibility gap is 8 clicks and 549 impressions. The English target has a
range-wide 0-click, 5-impression, 6.2 page-average-position row and no joined
visible qualified-query row; that range contains only three complete
post-deploy dates and does not isolate them from earlier dates. The original
20-impression minimum was not reached. The implementation-guide version was
live for only 5 days 23 hours 10 minutes before
`EXP-2026-08-01-karpathy-llm-wiki-locales-refresh` changed the same canonical
at `2026-08-02T04:39:55Z`, directly triggering the original controller-overlap
stop criterion before seven complete attributable days existed. Current
production remains technically green and retains the six command names plus
all five contextual inbound links, but its H1, first answer,
`dateModified: 2026-08-01`, FAQ packet, and `/capture` example now belong to
the later Karpathy experiment. Do not run W2, W4, or W8 attribution for the
superseded implementation-guide copy. No indexing request, GSC validation,
website edit, publication, paid action, synthetic event, analytics mutation,
or metric change occurred. The next due campaign readout is the tool-selection
family's 24-hour boundary after `2026-08-03T07:55:01Z`.

At `2026-08-03T08:31:34Z`, the due 24-hour readout for
`EXP-2026-08-02-ai-knowledge-base-tool-selection` completed. The fixed
measurement boundary remains `2026-08-02T07:55:01Z`; the later phrase-wrap
correction remains render-only and does not move it. The immutable Friday
window remains `2026-07-03..2026-07-30` at 10 property clicks and 660
impressions, 2 visible-query clicks and 111 impressions, and an 8-click and
549-impression visibility gap. Its later same-range GSC backfill remains
separate at 10/706 property, 2/120 visible-query, and an 8/586 gap. Both
captures predate publication. None of the three target URLs appears in the
preserved GSC, Vercel page, or Vercel source-to-page exports, so all per-locale
performance rows are unavailable rather than zero and each independent
five-impression guard remains unmet. Authenticated URL Inspection reports the
English URL indexed with the inspected canonical and a displayed
Googlebot-smartphone crawl at `Aug 2, 2026, 7:20:50 AM`; zh-TW is discovered
but not indexed with no crawl, and zh-CN is unknown to Google with no crawl.
The live three-locale technical, canonical, hreflang, sitemap, Article,
BreadcrumbList, schema-date, eight-test, first-party-source, limitation,
same-locale routing, and visible-FAQ-without-`FAQPage` contracts pass. Fresh
exact `393x852` and `1440x1200` hero, content/evaluation, and FAQ-open capture
sets pass both inline visual QA checks without overflow, clipping, tofu, or
actionable CJK phrase splitting. All three locale results remain inconclusive,
not success or failure. Wait for their seven-day readout after
`2026-08-09T07:55:01Z`. The next due controller item is the still-unrecorded
actual 24-hour readout for the English Obsidian + Claude Code refresh; its
earlier record is explicitly an early partial observation. No indexing
request, GSC validation, website edit, publication, paid action, synthetic
event, analytics mutation, or metric change occurred.

At `2026-08-03T08:45:18Z`, the overdue formal 24-hour readout for
`EXP-2026-07-29-obsidian-claude-code-refresh` completed without substituting
the earlier 23-hour-32-minute partial record. The immutable Friday performance
window remains `2026-07-03..2026-07-30`: property totals are 10 clicks and
660 impressions, visible-query totals are 2 clicks and 111 impressions, and
the visibility gap is 8 clicks and 549 impressions. The English target has a
range-wide 0-click, 8-impression, 5.6 page-average-position row but no joined
visible qualified-query row; the mixed aggregate cannot prove its five
post-deploy-impression floor. Authenticated URL Inspection now confirms the
page indexed with the inspected canonical and a post-refresh
Googlebot-smartphone crawl at `Aug 1, 2026, 3:01:38 PM`, but that crawl is
after the completed performance range, so no post-crawl search outcome is
available. The current Vercel range remains a mixed 7-visitor/12-pageview
target aggregate with no source-to-page target row. Current production,
technical, schema, source, FAQ-policy, three-locale non-regression, and fresh
exact `393x852` and `1440x1200` rendered checks pass. The formal 24-hour
result is inconclusive, not success or failure. Keep the English page
unchanged and run its seven-day readout after `2026-08-05T06:07:17Z`. No
indexing request, GSC validation, website edit, publication, paid action,
synthetic event, analytics mutation, or metric change occurred.

At `2026-08-08T06:31:56Z`, the due seven-day readout for
`EXP-2026-07-29-obsidian-claude-code-refresh` remained inconclusive. The
latest completed weekly evidence is still the authenticated
`2026-07-03..2026-07-30` report; the scheduled August 7 weekly run failed
before evidence collection because of its task usage limit and produced no
newer report. GSC therefore remains a mixed 0-click, 8-impression,
5.6-page-average-position target row with no visible joined qualified query,
ending before the confirmed August 1 post-refresh crawl. Vercel remains a
mixed 7-visitor and 12-pageview target aggregate with no authenticated
source-to-page target row. The original five-post-deploy-impression floor
cannot be proven. GitHub REST remains 47 stars and authenticated Umami remains
unavailable. The production deployment is unchanged and Ready; a narrow live
check still passes direct 200, exact canonical, indexability, Article and
BreadcrumbList, the four required integration/knowledge layers, and FAQPage
absence, so the still-current full technical, locale, source, and render
evidence was not repeated. Keep the English canonical unchanged and evaluate
W2 after `2026-08-12T06:07:17Z`. The next earlier due controller readout is
the Mandarin Obsidian locale seven-day boundary after
`2026-08-08T21:09:50Z`. No indexing request, GSC validation, website edit,
publication, paid action, synthetic event, analytics mutation, or metric
change occurred.

At `2026-08-08T21:15:29Z`, the due seven-day readout for
`EXP-2026-08-01-obsidian-knowledge-base-locales` kept zh-TW and zh-CN
independently inconclusive. The August 7 weekly task failed before evidence
collection at its usage limit and no successful retry exists, so the latest
completed authenticated performance range still ends on July 30 before
production. Neither locale has a privacy-visible GSC page or joined qualified-
query row; missing rows remain unavailable rather than zero and neither
independent five-impression guard can be assessed. Vercel remains the mixed
pre-deploy 1,468 raw visitors, 307 direct visitors, and non-deduplicated 1,163
qualified-source visitors; zh-TW has a 2-visitor/3-pageview target row, zh-CN
has no target row, unique acquisition-surface visitors remain unavailable,
and neither target has an authenticated source-to-page row. GitHub REST is 47
stars and authenticated Umami remains unavailable. The production deployment
is unchanged and Ready; narrow live checks still pass both locale routes at
direct 200 with exact canonicals, indexability, Article, BreadcrumbList, the
required integration and knowledge-base layers, and no `FAQPage`, so the
still-current full technical, source, locale, and render evidence was not
repeated. Keep both canonicals unchanged and evaluate W2 after
`2026-08-15T21:09:50Z`. The next earlier due controller readout is the
document knowledge-base guide seven-day boundary after
`2026-08-09T02:42:26Z`. No indexing request, GSC validation, website edit,
publication, paid action, synthetic event, analytics mutation, or metric
change occurred.

At `2026-08-09T00:43:32Z`, the append-only seven-day evidence reconciliation
for `EXP-2026-08-01-obsidian-knowledge-base-locales` incorporated the
successfully completed retry of the August 7 weekly pipeline. Its authenticated
`2026-07-10..2026-08-06` GSC range has 8 property clicks and 874 impressions,
2 visible-query clicks and 172 impressions, and a 6-click and 702-impression
visibility gap. zh-TW has a mixed 0-click, 1-impression target row at
page-average position 35.0 plus the visible `obsidian 筆記` row at 0 clicks and
1 impression; zh-CN has no privacy-visible target or joined qualified-query
row. The locales remain separate and neither reaches its five-impression
minimum. Vercel separately reports 1,387 raw visitors and 1,666 pageviews,
231 direct visitors and 383 pageviews, and a non-deduplicated qualified-source
row sum of 1,157 visitors and 1,280 pageviews. The zh-TW target has 6 visitors
and 7 pageviews and zh-CN has 4 visitors and 4 pageviews, but neither has an
authenticated source-to-page row and unique acquisition-surface visitors stay
unavailable. Authenticated Umami remains unavailable and the last separate
GitHub REST observation remains 47 stars. The successful retry's strict live
technical check passed; the unchanged formal technical, locale, source, and
render evidence was not repeated. Both locale results remain inconclusive.
Wait for W2 after `2026-08-15T21:09:50Z`; the next earlier controller readout
remains the document knowledge-base guide seven-day boundary after
`2026-08-09T02:42:26Z`. No indexing request, GSC validation, website edit,
publication, paid action, synthetic event, analytics mutation, or metric
change occurred.

At `2026-08-09T01:40:19Z`, the approved free `mcpservers.org` submission ID
`5334` was directly verified as a public Wenlan listing at
`https://mcpservers.org/servers/7xuanlu/wenlan`. The page exposes the submitted
AI-knowledge-base and LLM-wiki description, its exact self-canonical,
`SoftwareApplication` structured data, the GitHub repository link, and the
directory's native displayed star count of 47. Because the page exposes no
reliable publication timestamp, the campaign uses this first verified live
observation as the conservative listing-days start and does not backdate or
attribute repository views, stars, GSC, or Vercel results to it. Do not
resubmit or select Premium. The same read-only boundary check reconfirmed
`v0.15.5` as GitHub's latest public non-prerelease Wenlan release with six
assets; the `v0.15.6` tag and release endpoints still return 404, so the
standalone public-site release correction remains scoped to `v0.15.5`.

At `2026-08-09T01:45:51Z`, a read-only public search-surface comparison did
not surface the exact English source-backed target and still showed an older
memory-first Learn-hub title and extract. A direct production read separately
showed the current knowledge-base-first Learn title and answer; the target
page correctly retained its pre-experiment title because the prepared snippet
has not been published. This is a non-GSC freshness diagnostic, not indexing
authority, rank, keyword volume, or a crawl claim. It changes no baseline and
does not authorize request indexing.

At `2026-08-09T01:47:25Z`, a deterministic production anchor crawl fetched
all 120 sitemap URLs without failure and found 12 rendered links to the
English source-backed target from 10 distinct non-self canonical pages. The
anchors already include direct AI-knowledge-base language and eight full-title
occurrences. The target is not orphaned, so do not add another inbound-link
change before the prepared snippet experiment is published and measured.
These are internal-link occurrences and source counts, not GSC exposure,
authority, or causal evidence.

At `2026-08-09T01:49:40Z`, live GitHub code search found the literal Wenlan
repository path in 62 indexed files across eight external repositories, but
55 files come from two generated MCP/daily-digest repositories. The remaining
seven files span six repositories and include two current merged listings,
two automated catalog rows, one inaccurate generated capability profile, and
one competitive-research page that still says `Origin (Wenlan)`. Only one
indexed external file in the capture contains the literal `wenlan.app`
hostname. These are capped GitHub code-search matches, not backlinks,
visitors, GSC impressions, or star attribution. The result confirms that the
accurate external footprint is smaller than the raw file count; correcting
third-party pages remains an external action requiring separate approval.

At `2026-08-09T01:54:04Z`, authenticated GSC URL Inspection confirmed the
English source-backed canonical is indexed, fetch-successful, indexing-
allowed, and Google-canonicalized to itself, but its last crawl remains
`2026-07-29T01:09:32Z`. Google's stored HTML still contains the pre-July-30
`Source-Backed Wiki Pages for AI Work` title, memory-first description,
`dateModified: 2026-06-06`, and old page body. Google has not fetched the July
30 production knowledge-base refresh, and the prior completed request-
indexing action did not produce a newer recorded crawl. Do not repeat the
request. Before publication, correct the active experiment's attribution
guard: keep its 10-impression threshold but require a confirmed post-deploy
crawl; mixed or pre-crawl evidence is inconclusive, and any later success
supports the final consolidated page rather than isolating the August 8
snippet copy.

At `2026-08-09T01:56:00Z`, authenticated GSC Page indexing showed a healthy
site-wide floor rather than a broad indexing failure. The sitemap was
submitted on 2026-07-28, last read on 2026-08-02, reports `Success`, and lists
120 discovered pages. The property reports 116 indexed and 30 not indexed.
The 30 exclusions comprise 21 redirect URLs, one intentional `noindex` feed,
one tracking-parameter homepage alternate with a proper canonical, four
discovered-but-not-indexed URLs (`/docs/daily-workflow`,
`/docs/product-matrix`, `/docs/roadmap`, and `/zh-TW/download`), and three
crawled-but-not-indexed Open Graph image URLs. This is a later indexing
snapshot, not same-window performance evidence or causal growth. It narrows
the immediate problem to stale recrawling of changed acquisition pages and
low query exposure, not a property-wide canonical, robots, sitemap, or core
content indexing regression. No validation or indexing request was submitted.

At `2026-08-09T02:04:24Z`, read-only GitHub reconciliation confirmed the 11
remaining approved directory PRs are all still open: nine are `CLEAN`,
`DhanushNehru/awesome-mcp-servers` PR #52 is `UNSTABLE` only because its
whole-repository link check still fails while the other link checker passes,
and `ComposioHQ/awesome-claude-skills` PR #852 is `BLOCKED` only on required
review with all reported checks green. The previous `UNKNOWN` state resolved
to `CLEAN` without an author-side change. No PR has a review or change request
requiring action, so continue passive observation rather than no-op pushes or
maintainer contact. No external mutation occurred.

At `2026-08-09T02:08:15Z`, the previously prepared
`appcypher/awesome-mcp-servers` lane was re-gated. No Wenlan entry or prior PR
exists; the `7xuanlu:add-wenlan-appcypher` comparison remains one commit ahead,
zero behind, and one factual README insertion. However, current authoritative
repository metadata reports `archived: true` and GitHub returns HTTP 404 for
the repository pull-request endpoint. This explains the earlier PR-creation
denials and closes the lane unless the owner unarchives it. Do not retry,
duplicate, or contact the maintainer. No external mutation occurred.

At `2026-08-09T02:09:53Z`, the public Glama API still returned HTTP 404 and
`Server not found` for both `7xuanlu/wenlan` and `7xuanlu/origin`; public
search also exposed no Wenlan server result. The prerequisite for reopening
`punkpeye/awesome-mcp-servers` PR #7080 remains unmet. Do not install the
Glama GitHub App, grant repository access, or reopen the PR without separate
approval. No account or external state was changed.

At `2026-08-09T02:11:12Z`, the Codex plugin directory prerequisite was
rechecked against current GitHub `7xuanlu/wenlan@main` and the current
`hashgraph-online/awesome-codex-plugins` contribution contract. Wenlan still
keeps its bundle under `plugin-codex/`; root lacks
`.codex-plugin/plugin.json`, `assets/icon.svg`, and the required HOL scanner
workflow. The directory still requires a root bundle, passing scanner CI,
score >=80/130, and no high or critical findings. This is not a mechanical
SEO listing: it requires separately approved product/repository packaging or
a separate root plugin repository. No change or submission occurred.

At `2026-08-09T02:13:30Z`, a current GitHub fork-parent reconciliation closed
the original four fork-only directory cases. The `wong2` route is already
fulfilled by the live free `mcpservers.org` listing; `appcypher` is archived;
`IAAR-Shanghai/Awesome-AI-Memory` is a research-paper bibliography rather than
a software directory; and `subinium/awesome-claude-code` remains stale without
stronger acquisition evidence than the active Claude directories. No
fork-only candidate remains eligible for another non-duplicate submission.
No external mutation occurred.

At `2026-08-09T02:22:08Z`, the standing approved OSS-directory publication
scope was used for one new high-fit candidate:
`aristoapp/awesome-second-brain` PR #43. The current repository has 502 GitHub
stars and an active contribution contract centered on AI-native second-brain
workspaces, local knowledge, LLM-wiki workflows, and Obsidian-adjacent tools.
Wenlan had no existing entry or PR and passed the candidate gate through its
maintained local workspace, source-backed Pages, citations, refresh and review
workflow, MCP/CLI/plugin surfaces, and explicit platform and source-format
limits. Commit `4fb28dd` changes exactly five upstream files: the root chooser,
solution index, a new 94-line Wenlan profile, the layer comparison, and the
capability matrix. PR #43 is public, open, non-draft, and `CLEAN`; GitHub
reports no checks on the branch, so `CLEAN` is mergeability evidence rather
than CI evidence. Do not attribute a future merge, repository view, star, GSC
impression, or Vercel visit to this submission without source-native evidence.
No website change, indexing request, GSC validation, analytics mutation,
maintainer message, paid action, synthetic event, or metric change occurred.

At `2026-08-09T02:30:48Z`, read-only high-reach directory discovery rejected
three additional submissions rather than manufacturing low-fit backlinks.
`danielrosehill/Awesome-Obsidian-AI-Tools` has 252 GitHub stars but explicitly
lists Obsidian plugins; Wenlan can read an Obsidian vault but is not an
Obsidian plugin, and the repository exposes nine external PRs with no merged
external contribution. `Arindam200/awesome-ai-apps` has 13,353 stars but
accepts complete runnable examples implemented inside its own repository, not
external software listings. `awesome-selfhosted/awesome-selfhosted` has
311,438 stars and the current Wenlan daemon, HTTP/MCP service, Apache-2.0
license, headless installation instructions, active releases, and Knowledge
Management Tools fit are otherwise promising. Its authoritative source-data
contract requires the first stable release to be more than four months old;
Wenlan `v0.1.0` was published at `2026-04-19T22:09:18Z`, so the earliest
eligible submission is after `2026-08-19T22:09:18Z`, beyond this Goal's fixed
deadline. Keep Awesome Selfhosted as a post-campaign candidate and do not file
an early PR or issue. No external state changed.

At `2026-08-09T02:35:04Z`, the standing approved high-fit directory scope was
used for `tehtbl/awesome-note-taking` PR #121. The repository was captured at
934 GitHub stars and has an explicit open-source CLI category whose current
main branch already includes plain-text knowledge-management tools such as
IWE, `nb`, `zk`, and the adjacent local-first RAG/MCP project SwarmVault.
Wenlan had no entry or prior PR and passed the current contribution checklist:
knowledge management is primary, Pages are maintained Markdown, the link is
first-party, the Apache-2.0 license and Rust stack are current, the CLI category
is exact, and the project is active. Commit
`4ac8df8afb62162c3e98af26e39f58099414fcff` adds exactly one README line:
`Local source-backed AI knowledge base for agents, with maintained Markdown
pages, citations, and CLI, MCP, and HTTP access.` PR #121 is public, open,
non-draft, and `CLEAN`; GitHub reports no checks. The upstream last direct
commit is `2026-04-20` and many later submissions remain open, so this is a
valid distribution attempt with uncertain review latency, not proof of public
listing exposure. No website change, indexing request, GSC validation,
analytics mutation, maintainer message, paid action, synthetic event, or
metric change occurred.

At `2026-08-09T02:44:28Z`, the due seven-day readout for
`EXP-2026-08-01-document-knowledge-base-guide` kept English, zh-TW, and zh-CN
independently inconclusive. The successful August 7 weekly window
`2026-07-10..2026-08-06` reports 8 GSC property clicks and 874 impressions,
2 visible-query clicks and 172 impressions, and a 6-click and 702-impression
visibility gap. It contains only four complete post-deploy dates. English has
a 0-click, 2-impression target row at page-average position 51.0 and the joined
`local ai knowledge base` row at 0 clicks, 1 impression, and position 56.0;
zh-TW and zh-CN have no privacy-visible page or joined qualified-query rows.
No locale reaches its independent five-impression floor. Vercel separately
reports 1,387 raw visitors and 1,666 pageviews, 231 direct visitors and 383
pageviews, and a non-deduplicated qualified-source row sum of 1,157 visitors
and 1,280 pageviews. English target traffic is 2 visitors/3 pageviews, zh-TW
is 1/1, and zh-CN is 1/1; none has an authenticated source-to-page row and
unique acquisition-surface visitors remain unavailable. Umami remains
unavailable and GitHub REST remains 47 stars. The post-boundary deployed
technical gate and all three direct-200 checks pass; current 24-hour route and
render evidence was reused rather than duplicated. Wait for W2 and do not
publish the proposed internal-link change from two impressions. The next due
readout is the Karpathy / LLM Wiki locale family after
`2026-08-09T04:39:55Z`. No website edit, publication, indexing request, GSC
validation, analytics mutation, paid action, synthetic event, or metric change
occurred.

At `2026-08-22T21:26:06Z`, the approved read-only public GitHub conversion
lane produced
`docs/seo-audits/2026-08-22-release-and-star-proposals.md`. Source-native
GitHub evidence and rendered production evidence confirm a factual release
drift: GitHub's latest release is `v0.16.0`, while the homepage, download page,
about page, and checked `origin/main` source still expose `v0.15.8`. The
`v0.16.0` release has a Windows x64 desktop setup executable and a separate
Windows headless runtime ZIP, so the exact proposal preserves both paths and
does not perform a blind version replacement. A second, isolated proposal
places one restrained localized star request after product proof in the four
Wenlan READMEs; it remains an unproven conversion candidate and is not bundled
with the release correction. No website or README file was edited or
published. Both proposals require separate implementation and publication
approval; the successor Goal remains active and the August 28 decision gate is
unchanged.


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

- Record type: campaign-control correction; no website experiment was started
  and no public page was changed.
- Artifact: `docs/seo-audits/2026-08-22-search-intent-map.md` assigns one
  locale-aware primary intent to all 120 canonical sitemap URLs: 98 English,
  11 zh-TW, and 11 zh-CN. The labels are internal planning owners, not claimed
  keyword volume and not a `meta keywords` signal.
- Google boundary: one page owns one clear user task; related wording stays on
  that useful page rather than generating query-variant pages. Titles remain
  descriptive and distinct, internal anchors remain crawlable and contextual,
  similar URLs consolidate canonically, and translated equivalents remain
  separate self-canonical locale pages joined by reciprocal hreflang.
- Authenticated evidence: the latest completed GSC range remains
  `2026-07-24..2026-08-20`, with 8 property clicks and 1,005 property
  impressions versus 2 visible-query clicks and 216 visible-query impressions;
  the visibility gap remains 6 clicks and 789 impressions. The 115 visible
  query-page rows show no protected AI knowledge-base, LLM-wiki,
  source-backed-wiki, or modifier-qualified Obsidian query on more than one
  URL. Hidden query rows remain unavailable, not zero.
- Corrected routing: `types of ai agent memory` and glossary/taxonomy variants
  now belong to `/learn/ai-agent-memory-types`; generic `obsidian 筆記` and
  `obsidian 笔记` belong to their locale Obsidian pages; explicit build or setup
  queries such as `如何用 Obsidian 建立 AI 知識庫` remain with the localized
  document-to-knowledge-base guide. English OSS queries such as
  `stevenstavrakis/obsidian-mcp` remain on the English Obsidian page.
- Corrected action floor: different one-impression mismatches on `/learn` are
  no longer pooled into an artificial three-impression action. Each configured
  owner must independently meet the existing action floor.
- Verification: `node --test scripts/seo-weekly.test.mjs` passed 133/133;
  `pnpm seo:intent:check`, `pnpm seo:weekly:sample`,
  `pnpm seo:goal:check`, and `git diff --check` passed.
- Excluded actions: no metadata, copy, canonical, sitemap, redirect, deployment,
  indexing request, GSC validation, analytics mutation, external publication,
  experiment start, or metric-definition change occurred.

## Campaign control: search-intent ownership guard published at 2026-08-23T04:35:49Z

- Record type: campaign-control publication; this is not a website content
  experiment and does not consume or reset the August 28 evidence gate.
- Publication: branch `codex/search-intent-ownership` produced local commit
  `a2637c09f4295a2e41acca48cb1440a94796326a`; PR #135
  `https://github.com/7xuanlu/wenlan-site/pull/135` squash-merged at
  `2026-08-23T04:33:46Z` as
  `9d30003eaf1c3965ccc329494f9fc1cd19d3728b`. The remote publication branch
  was deleted.
- Exact scope: six files add the 120-URL locale-aware intent registry and
  audit, wire its deterministic check into `package.json`, correct narrow
  query ownership before broad weekly classifiers, and prevent unrelated
  sparse mismatches from being pooled into one action floor. No rendered
  page, metadata, canonical, sitemap, redirect, or analytics code changed.
- Local verification on the clean `origin/main` base: complete SEO suite
  228/228, weekly pipeline 132/132, intent tests 2/2, intent ownership
  120/120, fixture-backed weekly sample, Goal verifier, and diff hygiene
  passed.
- Deployment: Vercel Production completed successfully at
  `2026-08-23T04:34:30Z`. The read-only deployed audit passed 120 sitemap
  URLs, 24 key pages, six utility noindex surfaces, `FAQPage` absence across
  all sitemap pages, 25 redirects, six bridge-host redirects, 18 direct
  changed redirects, and old-URL sitemap exclusion.
- Decision: use the registry as a fail-closed planning owner and continue to
  the fixed August 28 source-native decision gate. Deployment completion is
  not evidence of impressions, clicks, visitors, downloads, stars, or causal
  growth.
- Excluded actions: no content experiment, indexing request, GSC validation,
  analytics mutation, paid action, external message, directory submission,
  synthetic event, or metric-definition change occurred.

## Campaign control: citation-verification trilingual publication at 2026-08-23T22:08:21Z

- Record type: publication-approved website candidate; production completion
  and measurement have not started.
- Exact task: start from one suspect AI knowledge-base or RAG answer, map each
  important claim to the cited page, chunk, source ID, and revision, then mark
  the claim supported, partial, unsupported, or stale. This remains distinct
  from the existing source-backed architecture owner.
- Exact routes:
  `/learn/verify-ai-knowledge-base-citations`,
  `/zh-TW/learn/verify-ai-knowledge-base-citations`, and
  `/zh-CN/learn/verify-ai-knowledge-base-citations`. Each has one locale-
  natural intent, a self-canonical URL, reciprocal hreflang, Article and
  BreadcrumbList schema, maintained references, visible FAQ without FAQPage
  JSON-LD, and contextual inbound links from the source-backed, tool-selection,
  and LLM Wiki owners.
- Content inventory: the source tree contains 48 English Learn pages and 7
  pages in each Mandarin locale after this family. The remaining 41 English
  slugs missing in each Mandarin locale are an audit queue, not an automatic
  translation quota; the complete inventory and priority rules are stored in
  `docs/seo-audits/2026-08-23-chinese-learn-gap-priority.md`.
- Authority path: after this family is live and Qi-Xuan Lu's existing
  `Danielskry/Awesome-RAG` PR #142 resolves, one neutral guide reference may be
  proposed to that repository's Production & Best Practices section. Do not
  open a concurrent promotional PR, message maintainers, or assume acceptance.
- Approval: at `2026-08-23T22:08:21Z`, the user approved the exact commit,
  push, PR, merge, automatic Vercel deployment, and read-only production
  verification scope.
- Excluded actions: request indexing, GSC validation, analytics mutation,
  external publication, paid action, synthetic events, and metric-definition
  changes remain excluded.

## Campaign preparation: retrieval-policy trilingual family at 2026-08-24T00:19:18Z

- Record type: live, production-verified website experiment; it no longer
  consumes the production-in-flight slot.
- Audience: developers operating AI agents over large documentation sets that
  are consulted repeatedly across tasks or sessions.
- Trigger: the agent repeatedly reloads the same raw documents, spends context
  on material already available, or retrieves knowledge for every task without
  deciding whether retrieval is needed.
- User task: decide when an AI agent should query a knowledge base and reduce
  repeated document context or token cost without skipping authoritative
  evidence.
- Desired outcome: apply a query, pre-retrieve, agent-decides, skip, progressive-
  disclosure, verify, and measure policy that opens exact sources only when
  needed. Smaller context is not automatically better and no token-saving
  percentage is promised.
- Exact local routes:
  `/learn/when-ai-agent-should-query-knowledge-base`,
  `/zh-TW/learn/when-ai-agent-should-query-knowledge-base`, and
  `/zh-CN/learn/when-ai-agent-should-query-knowledge-base`.
- Intent boundary: the existing memory-versus-knowledge-base page explains
  product roles, and the coding-agent knowledge-base page explains repository
  source boundaries. Neither owns the per-task query-or-skip retrieval policy,
  so this family has a distinct task and result set rather than a persona-only
  split.
- Internal paths: each locale receives contextual inbound links from its
  source-backed knowledge-base, coding-agent knowledge-base, and citation-
  verification owners.
- External authority path: `Meirtz/Awesome-Context-Engineering` is an exact-fit
  maintained candidate, but no new proposal may overlap Qi-Xuan Lu's open PR
  #108. Wait for that PR to resolve and obtain separate approval before any
  external action.
- Approval: at `2026-08-24T01:21:21Z`, the user approved the exact commit,
  push, PR creation, merge, automatic Vercel deployment, and read-only
  production-verification scope.
- Production: PR #138 merged at `2026-08-24T01:35:09Z` as
  `c95d009437b910a6b85f9d648e667e2d89b70d66`; Vercel production completed at
  `2026-08-24T01:35:46Z`. The three routes passed direct production rendering,
  canonical, reciprocal hreflang, Article and BreadcrumbList, FAQPage absence,
  393px and 1280px overflow, image, and console checks.
- Measurement boundary: keep `2026-08-24T01:35:46Z` fixed for this content
  experiment. A later control-record-only deployment does not move it.
- Excluded actions remain unchanged: no request indexing, GSC validation,
  analytics mutation, paid action, synthetic event, or external publication
  occurred for this family.

## Campaign preparation: PDF ingestion troubleshooting family at 2026-08-23

- Record type: approved local website candidate; no production measurement
  clock has started.
- Audience: people building an AI knowledge base from mixed Markdown, text
  PDFs, scanned PDFs, and long documents.
- Trigger: a document import reports skipped, empty, oversized, near-empty, or
  parser-error output, or appears successful but produces no usable evidence.
- User task: determine whether the PDF has a text layer, needs external OCR,
  exceeds the supported boundary, or failed parsing, then verify extracted
  source text before changing chunking, embeddings, or retrieval.
- Intent boundary: the existing document-build route owns initial setup and
  supported-source selection. This candidate owns post-import diagnosis and
  therefore has a separate trigger, workflow, and expected result.
- Exact local routes:
  `/learn/fix-pdf-ingestion-ai-knowledge-base`,
  `/zh-TW/learn/fix-pdf-ingestion-ai-knowledge-base`, and
  `/zh-CN/learn/fix-pdf-ingestion-ai-knowledge-base`.
- Product boundary: Wenlan v1 accepts `.md`, `.txt`, and `.pdf`; text files are
  limited to 1 MB and PDFs to 10 MB; scanned or image-only PDFs require OCR
  outside Wenlan. Batch counts are diagnostics, not proof that searchable
  evidence exists, so the page requires a distinctive-text and citation check.
- Internal paths: each locale receives contextual inbound links from its
  document-build, tool-selection, and citation-verification owners.
- External authority path: `HKUDS/DeepTutor#431` is an exact scanned-PDF
  troubleshooting discussion. No contribution, maintainer message, or other
  external action is approved before the page is live and separate approval is
  given.
- Current status: local implementation and verification only. Commit, push,
  PR, merge, Vercel deployment, request indexing, GSC validation, analytics
  mutation, paid action, synthetic event, and external publication remain
  excluded.

- Local verification completed at `2026-08-24T03:08:37Z`: the Goal, scenario,
  intent, SEO, i18n, TypeScript, build, and built technical checks passed. All
  three routes were inspected at `393x852` and `1440x1200` with exact
  canonicals, reciprocal hreflang, one Article and one BreadcrumbList schema,
  visible expanded FAQ without FAQPage, no horizontal overflow, no broken
  images, no browser console errors, and natural English, zh-TW, and zh-CN
  wrapping.

## Campaign publication: PDF ingestion troubleshooting at 2026-08-24T03:34:00Z

- PR #140 merged at `2026-08-24T03:33:23Z` as
  `3a4b2aedc7d827cf9999161a1f27bc1e678ebcda`; Vercel production completed at
  `2026-08-24T03:34:00Z`.
- The English, zh-TW, and zh-CN PDF-ingestion routes returned direct 200
  responses with exact canonicals, reciprocal hreflang, Article and
  BreadcrumbList schema, visible FAQ without FAQPage, and clean mobile and
  desktop rendering. This family is now measuring and no longer consumes the
  production-in-flight slot.
- Keep `2026-08-24T03:34:00Z` as its fixed production boundary. No request
  indexing, GSC validation, analytics mutation, or external publication was
  performed.

## Campaign preparation: multi-agent shared-knowledge conflicts at 2026-08-24

- Record type: local website candidate; no production measurement clock has
  started.
- Audience: teams whose coding, research, or operations agents read from and
  write to the same project knowledge.
- Trigger: a conclusion is overwritten, contradicted, scope-polluted, or reused
  after its source changes.
- User task: detect stale writes before acceptance, compare candidate claims
  with current evidence, review them before acceptance, and preserve
  supersession history.
- Intent boundary: `/learn/multi-agent-memory-workflow` owns client connection,
  shared daemon, data directory, space, capture, recall, handoff, and distill.
  The new family owns the later maintenance failure after shared access works.
- Exact local routes:
  `/learn/prevent-multi-agent-knowledge-conflicts`,
  `/zh-TW/learn/prevent-multi-agent-knowledge-conflicts`, and
  `/zh-CN/learn/prevent-multi-agent-knowledge-conflicts`.
- Candidate gate: dated English, Taiwan Traditional Chinese, and Mainland
  Simplified Chinese paper, SERP, practitioner, framework-discussion, maintained
  OSS, and bug evidence is stored in `docs/seo-scenario-backlog.json` and
  `docs/seo-audits/2026-08-24-multi-agent-knowledge-conflicts-gate.md` in native
  units. It is not keyword volume or Wenlan performance evidence.
- Product boundary: Wenlan supports provenance, supersession, stale Pages,
  reviewable revisions, and an optional reconcile pass that is off by default.
  The current public MCP `write_page` input does not expose
  `expected_version`, so the agent workflow must re-read and compare before a
  machine-owned Page refresh; it must not claim atomic stale-write rejection.
  Slash commands require the Wenlan Codex plugin, while other agents use local
  MCP tools or the local CLI. Wenlan is not a scheduler, distributed lock, or
  automatic consensus system.
- Current status: local implementation and verification only. Commit, push,
  PR, merge, Vercel deployment, request indexing, GSC validation, analytics
  mutation, paid action, synthetic event, and external publication remain
  excluded.

## Campaign action: GSC queue and next-scenario demand research at 2026-08-25T02:18:58Z

- The user explicitly approved one GSC Request Indexing action for each live
  locale of `EXP-2026-08-24-multi-agent-knowledge-conflicts-locales` and a new
  trilingual demand-research pass.
- Authenticated Search Console account: `Qi-Xuan Lu
  (h164654156465@gmail.com)`. English, zh-TW, and zh-CN each showed `URL is not
  on Google`, `URL is unknown to Google`, and no last crawl before submission.
  All three returned `Indexing requested`. This is queue acceptance only, not
  evidence of a crawl, indexing, rank, impressions, or clicks; do not repeat
  the requests to try to change queue priority.
- Research decision: promote `retrieval-regression-golden-dataset` for exact
  contract review. Its task is to build a versioned golden query set and
  compare retrieval after corpus, chunking, embedding, reranker, top-k, or
  retrieval-policy changes. English, Taiwan Traditional Chinese, and Mainland
  Simplified Chinese each have dated independent observations, a clean owner
  gap, maintained Wenlan evaluation proof, standalone utility, three planned
  same-locale internal paths, and a first-party authority path.
- Duplicate or unsupported candidates were not promoted: source-deletion
  reconciliation overlaps the existing source-backed owner; coding-agent
  onboarding overlaps an experiment already measuring; permission-aware team
  knowledge lacks current Wenlan RBAC or tenant-ACL proof.
- Complete provenance and native-unit observations are stored in
  `docs/seo-audits/2026-08-24-next-scenario-demand-research.md`. The exact new
  family is not yet added to the protected scenario backlog and no content
  implementation, publication, deployment, additional indexing request, GSC
  validation, analytics mutation, or external action is authorized by this
  research record.
- Evidence continuity: the latest completed weekly report available to this
  task is the `2026-08-21` report, but it is not committed on current
  `origin/main`. Preserve its source-native values as an external read-only
  input and record the missing report as a version-control gap; do not rebuild
  or invent a substitute.

## Campaign correction: highest-leverage intent at 2026-08-25T04:50:58Z

- Supersedes only the next-action recommendation to promote
  `retrieval-regression-golden-dataset`. That candidate still passes its
  quality gate but remains in research because it is not the largest current
  opportunity.
- The corrected next priority is the existing trilingual LLM Wiki owner. In a
  single worldwide past-12-month Google Trends comparison, normalized average
  indices were `Obsidian AI` 49, `AI knowledge base` 31, `LLM wiki` 22,
  `RAG evaluation` 19, and `RAG tutorial` 9. Ubersuggest separately estimated
  US monthly volumes of `LLM wiki` 6,600, `Obsidian AI` 4,400,
  `AI powered knowledge base software` 1,600, `AI knowledge base` 880,
  `RAG evaluation` 210, and `RAG knowledge base` 140. Do not convert or combine
  these source-native units.
- OpenSEO is authenticated as `h164654156465@gmail.com` for the `wenlan.app`
  project, but reports zero hosted credits, so paid DataForSEO keyword metrics
  were unavailable. Its authenticated GSC read worked. Ubersuggest's requested
  Taiwan and China reports linked to US `locId=2840`, so their localized
  absolute-volume rows are invalid and excluded.
- Current final GSC range `2026-07-25..2026-08-22`: the English LLM Wiki page
  has 21 page impressions and 1 click; its visible query rows have 7
  impressions and 1 click. Exact `llm wiki` has 4 impressions, 1 click, and
  average position 11.5. The zh-TW page has 1 page impression and the zh-CN
  page has 6; their missing visible query rows remain unavailable rather than
  zero.
- The generic `llm wiki` SERP matches Wenlan directly but does not show Wenlan
  in the first ten organic results; a `site:wenlan.app` query returns the live
  canonical. Treat this as a ranking and authority gap, not an indexing gap.
  `Obsidian AI` is larger but primarily navigational/plugin intent, while broad
  AI-knowledge-base software results primarily serve enterprise customer
  support. LLM Wiki therefore has the best demand-to-product-fit leverage.
- Next action: prepare an exact English existing-page refresh and authority
  plan without changing the canonical or starting a new URL. The English page
  clears the 20-page-impression and three-qualified-query floor; the Mandarin
  pages do not and remain stable. No website edit, content experiment,
  authority placement, commit, push, PR, merge, deployment, indexing request,
  validation, analytics mutation, or external publication is authorized by
  this correction.

## Campaign gate: LLM Wiki post-crawl hold at 2026-08-25T05:07:10Z

- The user approved local execution of the highest-leverage LLM Wiki work and
  requested that the durable SEO rules be indexed from `AGENTS.md` rather than
  left in chat memory. The durable hierarchy is Tier 0 `AGENTS.md` entrypoint,
  Tier 1 `PLAN.md` contract, Tier 2 structured experiment, scenario, and intent
  state, and Tier 3 dated evidence. The Goal verifier now checks that index and
  tier structure instead of duplicating the full contract in `AGENTS.md`.
- Authenticated OpenSEO URL Inspection for
  `https://wenlan.app/learn/distilled-wiki-pages-ai-memory` reports submitted
  and indexed, exact Google and user canonicals, indexing allowed, successful
  fetch, mobile crawl, and last crawl `2026-07-29T01:09:29Z`.
- That crawl predates the current LLM Wiki production version deployed at
  `2026-08-02T04:39:55Z`. The English page clears the 20-page-impression and
  three-qualified-query performance floors, but it does not have a confirmed
  post-deploy crawl or 28 complete cooldown days. Do not stack another page,
  metadata, schema, internal-link, or copy edit on the same canonical.
- Authority-first preparation is recorded in
  `docs/seo-audits/2026-08-25-llm-wiki-authority-plan.md`. The preferred next
  publication is a three-language link from Wenlan's maintained source README
  LLM-wiki explanation to the existing locale guide. A neutral companion-guide
  link on the existing Awesome LLM Wiki row is a separate external candidate.
- No website article, Mandarin copy, canonical, sitemap, schema, or internal
  link changed. No commit, push, PR, merge, deployment, indexing request, GSC
  validation, analytics mutation, paid action, or external publication is
  authorized by this gate record.

## Campaign preparation: consultant client-project knowledge base at 2026-08-28

- The user approved adding `consultant-client-project-knowledge-base` to the
  verifier-protected scenario queue and preparing its English, zh-TW, and
  zh-CN pages locally.
- The task is one client-scoped consulting knowledge base for approved sources,
  research, decisions, open questions, deliverables, stale evidence, and a
  reproducible handoff. It must not mix clients or claim CRM ingestion,
  email/calendar sync, RBAC, redaction, compliance, billing, or project
  management.
- Exact routes are
  `/learn/build-client-project-knowledge-base-for-consulting`,
  `/zh-TW/learn/build-client-project-knowledge-base-for-consulting`, and
  `/zh-CN/learn/build-client-project-knowledge-base-for-consulting`.
- Three stable same-locale owners provide contextual inbound links. The freshly
  measuring research-knowledge-base canonical is not edited, preserving its
  attribution while satisfying the three-link floor.
- Complete provenance, candidate-gate reasoning, query families, first-party
  proof, and safety boundaries are stored in
  `docs/seo-audits/2026-08-28-consultant-client-knowledge-base-candidate.md`
  and `docs/seo-scenario-backlog.json`.
- This approval stops at local implementation, deterministic verification, and
  desktop plus exact 393px previews. Commit, push, PR, merge, deployment,
  request indexing, GSC validation, analytics mutation, and external
  publication remain excluded.
- Local implementation verification completed on `2026-08-28`: Goal 45/45,
  SEO 247/247, i18n 71/71, TypeScript, the 255-page production build, and the
  built technical checker all passed. The sitemap contains 144 canonical URLs.
  Fresh browser checks covered all three routes at `1280x900` and exact
  `393x852`; every route had one exact canonical, one Article schema, one
  BreadcrumbList, visible FAQ without FAQPage, no horizontal overflow, no
  broken images, and no browser warning or error. Separate viewport captures
  confirmed natural English, zh-TW, and zh-CN wrapping. The in-app browser's
  full-page JPEG stitch repeated rendered regions, but DOM counts and segmented
  viewport captures confirmed a single `main`, `article`, and `footer` in the
  actual page.
- The user then explicitly approved publishing this exact verified scope
  through commit, Git push, PR creation, merge, automatic Vercel deployment,
  and read-only production verification. Request indexing, GSC validation,
  analytics mutation, paid action, maintainer messaging, synthetic events,
  metric-definition changes, and any unrelated website or external action
  remain excluded.

## Campaign preparation: source-backed investment research at 2026-08-28

- The next locally prepared audience scenario is one company-scoped investment
  research knowledge base for annual reports, filings, earnings releases,
  presentations, earnings-call material, thesis changes, contradictions, stale
  evidence, and open questions.
- Exact routes are `/learn/build-investment-research-knowledge-base`,
  `/zh-TW/learn/build-investment-research-knowledge-base`, and
  `/zh-CN/learn/build-investment-research-knowledge-base`.
- This is not a generic `AI for finance` owner. It must separate reported facts,
  analyst calculations, and investment judgments, and it must not claim live
  market data, paid transcript or research access, XBRL, reliable table
  extraction, valuation, portfolio monitoring, trading signals, or investment
  advice.
- English, Taiwan Traditional Chinese, and Simplified Chinese demand evidence,
  query families, clean-gap reasoning, Wenlan proof, internal links, and the
  predeclared first-party authority path are stored in
  `docs/seo-audits/2026-08-28-investment-research-knowledge-base-candidate.md`
  and `docs/seo-scenario-backlog.json`.
- Ubersuggest returned `volume: 0`, no suggestions, and no intent label for the
  nine exact long-tail phrases, then exhausted the account's three-report daily
  quota before broader phrases could be tested. Preserve those exact tool
  results as low-resolution observations; do not infer that the broader task has
  zero demand or combine them with GSC.
- Local page, test, build, technical, and exact `393px` render preparation is
  authorized. Commit, push, PR, merge, deployment, request indexing, GSC
  validation, analytics mutation, directory submission, and external
  publication remain excluded until separately approved.
- Local verification completed on `2026-08-28`: Goal 46/46, SEO 248/248,
  i18n 72/72, scenario and intent checks 11/11, TypeScript, the 259-page
  production build, and the built technical checker all passed. The sitemap
  contains 147 canonical URLs. Fresh browser checks covered all three routes at
  `1280x900` and exact `393x852`; every route had the exact canonical, one
  Article schema, one BreadcrumbList, visible FAQ without FAQPage, no
  horizontal overflow, and no console warning or error. The related-guide
  navigation from the English page was opened and returned successfully.
- At `2026-08-29T05:55:25Z`, the user explicitly approved publishing this
  exact verified scope through commit, Git push, PR creation, merge, automatic
  Vercel deployment, and read-only production verification. Request indexing,
  GSC validation, analytics mutation, directory submission, paid action,
  maintainer messaging, synthetic events, metric-definition changes, and
  unrelated external publication remain excluded.

## Campaign preparation: product research to PRD at 2026-08-28

- The user approved preparing the next highest-leverage audience scenario after
  the investment-research family was published. English, Taiwan Traditional
  Chinese, and Simplified-Chinese demand and result shapes were checked before
  selecting the owner.
- Customer-support knowledge-base demand was stronger in the checked relative
  Trends requests, but it was rejected because Wenlan does not provide the
  expected help-desk or CRM ingestion, team permissions, customer-data
  redaction, or answer-deployment workflow. A broad student-study owner was
  deferred because current results expect transcription, flashcards, quizzes,
  spaced repetition, and exam planning that Wenlan does not provide.
- The selected task is one product-scoped, source-backed evidence base before
  drafting or reviewing a PRD. The audience is product managers, UX
  researchers, and product operations teams. Requirements must remain linked
  to approved dated research, support or sales notes, prior decisions,
  contradictions, assumptions, and open questions.
- Exact prepared routes are
  `/learn/build-product-research-knowledge-base-for-prd`,
  `/zh-TW/learn/build-product-research-knowledge-base-for-prd`, and
  `/zh-CN/learn/build-product-research-knowledge-base-for-prd`.
- This family does not claim meeting transcription, PII redaction, research
  recruiting, analytics ingestion, Jira, Linear, Slack or CRM integration,
  automatic prioritization, automatic PRD generation, roadmap decisions, or
  product outcomes.
- Complete provenance, Google Trends values in their original relative units,
  OpenSEO's account boundary, three-locale query families, clean-gap reasoning,
  first-party Wenlan proof, internal links, and the separately approval-gated
  OSS authority path are stored in
  `docs/seo-audits/2026-08-28-product-research-prd-knowledge-base-candidate.md`
  and `docs/seo-scenario-backlog.json`.
- OpenSEO was authenticated to the `wenlan.app` project in the Qi-Xuan Chrome
  profile, but all hosted credits were used. It supplied no new paid keyword or
  live-SERP metric, so none is invented or substituted for GSC.
- The user subsequently approved the exact verified scope for commit, Git push,
  PR creation, merge, automatic Vercel deployment, and read-only production
  verification. Request indexing, GSC validation, analytics mutation, OSS
  contribution, maintainer messaging, paid action, synthetic events, and other
  external publication remain excluded.
- Local preparation completed on `2026-08-28`: Goal 47/47, SEO 249/249, i18n
  73/73, TypeScript, the 263-page production build, scenario validation, and
  the built technical checker all passed. The sitemap contains 150 canonical
  URLs, and all 154 built HTML pages remain free of FAQPage JSON-LD. Fresh
  browser checks covered all three routes at exact `393x852` and `1280x900`:
  every route returned 200, had one exact canonical, reciprocal locale
  alternates, one Article schema, one BreadcrumbList, three visible FAQ items,
  no FAQPage schema, no horizontal overflow, and no console warning or error.
  A mobile title-wrap regression found during visual QA was fixed and protected
  by deterministic English and localized renderer tests.
- PR #152 merged at `2026-08-29T06:43:59Z` as
  `66f7b012f25174cac63e94dcec8b27b9b3d6e5e2`; Vercel production completed at
  `2026-08-29T06:44:59Z`. The integrated commit passed the Goal, scenario, goal,
  SEO, i18n, TypeScript, production-build, and built-technical gates. All three
  live routes passed direct 200, exact canonical, reciprocal hreflang, Article
  and BreadcrumbList schema, visible FAQ without FAQPage schema, production
  rendering, and the deployed technical audit. Keep this timestamp as the
  fixed production boundary; it proves publication and technical availability,
  not a Google crawl, indexing, ranking, traffic, or causality.

## Campaign preparation: SRE incident knowledge base at 2026-08-29

- A control-plane reconciliation found that the consultant and investment
  scenario records still said `prepared` after PRs #148 and #150 were already
  production-verified. Their scenario status is corrected to `measuring`;
  this does not move either production or measurement boundary.
- The next locally prepared audience scenario is one source-backed SRE
  incident knowledge base for current runbooks, postmortems, architecture
  notes, and sanitized incident summaries.
- Exact routes are `/learn/build-sre-incident-knowledge-base`,
  `/zh-TW/learn/build-sre-incident-knowledge-base`, and
  `/zh-CN/learn/build-sre-incident-knowledge-base`.
- The task begins after an incident is stable: keep one service, environment,
  and incident class inside a reviewed source boundary; separate observations,
  hypotheses, mitigations, and confirmed causes; preserve safety limits,
  abort conditions, verification signals, owners, revisions, and stale state.
- Wenlan does not monitor production, receive alerts, ingest live telemetry,
  run automatic RCA, command an incident, execute a runbook, approve a change,
  or provide emergency access. A retrieved Page is context for a qualified
  engineer, not permission to act on production.
- English, Taiwan Traditional Chinese, and Simplified-Chinese result and demand
  evidence is stored in
  `docs/seo-audits/2026-08-29-sre-incident-knowledge-base-candidate.md` and
  `docs/seo-scenario-backlog.json`. Google Trends returned no inspectable
  series in this pass, so no Trends index or keyword volume is claimed.
- The family uses the genuine deterministic Wenlan app fixture and the
  verifier-protected product-evidence contract. Three same-locale contextual
  entries come from document ingestion, source-backed architecture, and
  citation verification.
- The user explicitly approved the exact verified SRE family for commit, Git
  push, PR creation, merge, automatic Vercel deployment, and read-only
  production verification. Request indexing, GSC validation, analytics
  mutation, source-repository changes, maintainer messaging, paid action, and
  unrelated external publication remain excluded.
- Local preparation is complete: Goal 49/49, the 13-family scenario verifier,
  the 13 focused intent/scenario tests, i18n 75/75, TypeScript, the 267-page
  production build, and the 153-URL built technical audit pass. Twelve fresh
  browser states cover three locales, `1280x900` and exact `393x852`, and dark
  plus light themes. A first-pass CJK trailing-character break was fixed and
  added to the localized renderer contract.
- The independent public-release drift was repaired before publication in a
  separate commit: GitHub Releases confirms `v0.17.4` published on
  `2026-08-30`, and the website release metadata, download surfaces, About,
  Docs, schema, sitemap dates, and machine-readable surfaces now agree. The
  five focused release contracts and all 75 i18n contracts pass. The full SEO,
  build, and technical gates still run on the combined branch before merge.
- PR #155 merged at `2026-08-30T05:05:37Z` as
  `1e05812ed436f1ff829f0c523bdf9755772f3c92`; Vercel production completed at
  `2026-08-30T05:06:25Z`. The integrated commit passed the Goal, scenario,
  49 goal tests, 251 SEO tests, 75 i18n tests, TypeScript, the 267-page build,
  and the 153-URL built technical audit. All three live routes passed direct
  200, exact canonical, reciprocal hreflang, Article and BreadcrumbList
  schema, visible answers, 393px rendering, and no FAQPage schema or browser
  errors. The deployed technical audit passed 153 sitemap URLs, 30 key pages,
  noindex utilities, redirects, and bridge-host redirects. Keep
  `2026-08-30T05:06:25Z` as the fixed production boundary; it proves
  publication and technical availability, not a Google crawl, indexing,
  ranking, traffic, or causality.

## Campaign observation: consultant, investment, and product-research 24-hour readouts at 2026-08-30T06:45:29Z

- The English, zh-TW, and zh-CN consultant, investment, and product-research
  routes each return
  direct 200 with exact self-canonicals, reciprocal hreflang, sitemap
  membership, Article and BreadcrumbList schema, visible task and limitation
  text, visible FAQ, and no FAQPage schema.
- The latest authenticated `2026-07-31..2026-08-27` evidence ends before both
  publication boundaries. GSC property totals remain 7 clicks and 913
  impressions; visible-query totals remain 2 clicks and 221 impressions; the
  visibility gap remains 5 clicks and 692 impressions. No target page or
  query-page row exists for either family, so locale observations are
  unavailable rather than zero.
- Vercel remains 289 visitors and 690 pageviews, with direct, referrer,
  target-page, and source-to-page evidence kept separate. GitHub remains 51
  stars. No persisted authenticated URL Inspection evidence exists for either
  family.
- All three 24-hour results are inconclusive. This is technical availability
  evidence only; it does not establish a crawl, indexing, ranking, traffic,
  or causality. Keep the pages stable until their seven-day observations after
  `2026-09-05T04:59:15Z`, `2026-09-05T06:02:35Z`, and
  `2026-09-05T06:44:59Z`.

## Campaign research: engineering ADR and RFC demand at 2026-08-29

- English, zh-TW, and zh-CN official documentation, maintained OSS, and
  practitioner discussions repeat the task of recovering the rationale,
  alternatives, consequences, status, and supersession history behind an
  architecture or technical-design decision.
- A new URL fails the clean-gap gate. The existing trilingual
  `coding-agent-source-backed-knowledge-base` owner already covers repository
  truth, architecture decisions, cited Pages, and code/test verification.
- Do not create an ADR or RFC canonical. The evidence is stored in
  `docs/seo-audits/2026-08-29-engineering-adr-rfc-demand-gate.md`. It may
  nominate a bounded section on the existing owner only after a confirmed
  post-deploy crawl, 20 target-page impressions, 3 qualified joined-query
  impressions, and the 28-complete-day cooldown all pass.
- Do not claim automated code-to-ADR compliance, drift detection, policy
  enforcement, or architecture approval. The next clean scenario research
  must move to a different user task rather than a persona or query-variant
  split.

## Campaign preparation: competitive intelligence knowledge base at 2026-08-30

- The user approved local implementation of the next trilingual scenario after
  a demand, clean-gap, capability, and authority-path review.
- Exact prepared routes are
  `/learn/build-competitive-intelligence-knowledge-base`,
  `/zh-TW/learn/build-competitive-intelligence-knowledge-base`, and
  `/zh-CN/learn/build-competitive-intelligence-knowledge-base`.
- The audience is product marketing managers, founders, and product, strategy,
  or market researchers. The trigger is a competitor review, battlecard,
  product decision, positioning update, or periodic research refresh whose
  underlying evidence may have changed.
- The task is a bounded, source-backed competitor dossier from permitted,
  user-collected documents. It preserves source class, dates, revisions,
  observations, inferences, assumptions, contradictions, stale claims, and
  open questions for human review.
- Wenlan does not discover competitors, crawl or scrape websites, monitor live
  pricing or reviews, send alerts, score competitors, recommend strategy, or
  make legal or commercial decisions.
- Complete English, Taiwan Traditional-Chinese, and Simplified-Chinese query
  families, result observations, practitioner evidence, clean-gap reasoning,
  first-party proof, internal links, and the separately approval-gated
  `ferdinandobons/startup-skill` authority path are stored in
  `docs/seo-audits/2026-08-30-competitive-intelligence-knowledge-base-candidate.md`
  and `docs/seo-scenario-backlog.json`.
- The three routes use one clear task in natural locale language, genuine
  deterministic Wenlan product evidence, Article and BreadcrumbList schema,
  reciprocal hreflang, sitemap membership, visible FAQ without FAQPage, and
  exact `393px` plus desktop rendered verification.
- Current status: live, production-verified, and measuring from
  `2026-08-30T19:48:14Z`. PR #158 merged at `2026-08-30T19:47:24Z` as
  `f68b16b82d1c6c28f816c4ab0cf5c164232fe3c1`, and Vercel completed the
  automatic production deployment at `2026-08-30T19:48:14Z`.
  Request indexing, GSC validation, analytics mutation, paid action,
  maintainer messaging, the separately planned OSS contribution, synthetic
  events, and other external publication remain excluded.

## Campaign publication preparation: competitive intelligence clean rebuild

- The locally verified trilingual competitive-intelligence candidate was
  reconstructed from current `origin/main`
  `d94b807cc83f66ac5be85500682066fdb68d0d05` in the isolated worktree
  `/tmp/wenlan-competitive-intelligence`; the detached dirty readout worktree
  must not be pushed.
- The exact candidate-owned include list, exclusions, reconstruction steps,
  verification floor, and remaining approval boundary are stored in
  `docs/seo-audits/2026-08-30-competitive-intelligence-publication-manifest.md`.
- The unrelated zh-CN SRE indentation-only hunk and all weekly, authority,
  README-star, RFP, and other scenario artifacts were excluded from this clean
  reconstruction.
- No commit, push, pull request, merge, Vercel deployment, indexing request,
  GSC validation, analytics mutation, maintainer contact, OSS contribution,
  paid action, or other external state changed while preparing the clean
  candidate.
- Final clean verification passed Goal `50/50`, i18n `76/76`, SEO
  `252/252`, TypeScript, a 271-page production build, the 156-owner built
  technical audit, and desktop plus exact 393px rendered checks for all three
  locales. The detailed failure, rerun, and CJK-correction evidence is stored
  in
  `docs/seo-audits/2026-08-30-competitive-intelligence-clean-rebuild-verification.md`.
- At `2026-08-30T19:44:10Z`, the user explicitly approved publishing this
  exact isolated candidate through commit, Git push, pull request, merge,
  automatic Vercel deployment, and read-only production verification. The
  approval does not include request indexing, GSC validation, analytics
  mutation, maintainer contact, the planned `ferdinandobons/startup-skill`
  authority proposal, paid action, synthetic events, or any other external
  publication.

## Campaign publication: competitive intelligence knowledge base at 2026-08-30T19:48:14Z

- PR #158 merged at `2026-08-30T19:47:24Z` as
  `f68b16b82d1c6c28f816c4ab0cf5c164232fe3c1`; Vercel reported production
  deployment success at `2026-08-30T19:48:14Z`.
- The integrated commit passed the Goal, scenario, 50 Goal tests, 252 SEO
  tests, 76 i18n tests, TypeScript, the 271-page production build, and the
  156-owner built technical audit. The deployed audit passed robots, sitemap,
  key pages, utility noindex surfaces, redirects, bridge-host redirects, and
  sitemap-wide FAQPage absence.
- English, zh-TW, and zh-CN production routes returned direct 200 with exact
  self-canonicals, reciprocal hreflang, Article and BreadcrumbList schema,
  visible bounded competitor-dossier answers, loaded product evidence, and a
  visible FAQ without FAQPage schema. Exact `393x852` and `1280x900` checks
  found no overflow, broken image, console warning or error, or protected CJK
  phrase split.
- Keep `2026-08-30T19:48:14Z` as the fixed production boundary. The 24-hour
  technical and indexability observation is due after
  `2026-08-31T19:48:14Z`; the seven-day source-native GSC page/query and
  Vercel page/referrer observation is due after `2026-09-06T19:48:14Z`.
- This is publication evidence only. No request indexing, GSC validation,
  analytics mutation, OSS proposal, maintainer message, paid action, synthetic
  event, or other external publication occurred.

## Campaign research: RFP proposal-readiness authority path at 2026-08-30T23:40:14Z

- The files-first RFP proposal-readiness task still passes demand, clean-gap,
  trilingual wording, first-party proof, standalone utility, and internal-link
  checks. It still fails the required authority-path gate.
- Eight Exa workstreams returned 64 result slots, followed by full-page reads
  and source-native GitHub checks for the most plausible candidates. The count
  describes research coverage, not demand or keyword volume.
- `ProjectManagement.com` exposes a legitimate editorial submission route,
  but it rejects promotional material, product reviews, and software tutorials,
  accepts only a small fraction of submissions, may take up to one month, and
  requires original human experience plus AI-use disclosure. It can host a
  future neutral practitioner article, but it is not a predeclared Wenlan link
  path.
- `patwalls/awesome-government-contracting` accepts neutral free resources but
  is a one-star fork last pushed on `2026-06-16`, maintained by the vendor it
  promotes, and has no demonstrated review reach. `The-RFP-Hub/the-rfp-hub`
  uses RFP to mean Ethereum funding opportunities. The maintained PnP
  SharePoint skills repository accepts native SharePoint skills, not unrelated
  product links. The small `gener8v` RFP toolkit has no curated-resource or
  documented external-reference slot. None is a clean authority fit.
- Decision: keep the candidate in `research`; do not prepare or publish its
  three locale pages. Move the next scenario search to another files-first task
  rather than opening a promotional issue or pull request. The complete
  source and rejection record is in
  `docs/seo-audits/2026-08-30-rfp-proposal-readiness-demand-gate.md`.

## Campaign authority follow-up and supplier due-diligence gate at 2026-08-31

- The user-approved one-time follow-up was posted to
  `awesome-selfhosted/awesome-selfhosted-data#2955` at
  `2026-08-31T00:13:40Z`:
  `https://github.com/awesome-selfhosted/awesome-selfhosted-data/pull/2955#issuecomment-5472149912`.
  This remains an attempted distribution action, not earned authority. Count
  the path only after the PR is merged and the listing is visibly rendered
  upstream. No further maintainer contact is authorized by this record.
- The ICT/software supplier due-diligence evidence-pack family passes the
  trilingual demand, clean-gap, Wenlan-proof, standalone-utility, internal-link,
  and conditional authority-path gates. Its audience is procurement, security,
  and IT owners; its task is to preserve supplier provenance, data-access
  scope, resilience/security evidence, dependencies, gaps, questions, owner,
  and review date. It explicitly excludes certification validation, legal or
  privacy advice, vendor discovery, crawling, live monitoring, vulnerability
  scanning, automatic scoring, approval/rejection, and material outside
  approved controls.
- Keep family ID
  `ict-supplier-due-diligence-evidence-pack` at `net-new` / `research`. The
  conditional authority path is the existing
  `mohitagw15856/pm-claude-skills/blob/main/skills/vendor-security-review/SKILL.md`
  contribution seam;
  acceptance and any backlink are not assumed. Do not publish its three locale
  pages without a separate exact website publication approval. The production
  slot is open, so local page preparation is the next eligible action. Full
  provenance is in
  `docs/seo-audits/2026-08-30-ict-supplier-due-diligence-demand-gate.md`.

## Campaign publication approval: ICT supplier due diligence at 2026-08-31T01:10:00Z

- The user approved the exact English, zh-TW, and zh-CN supplier due-diligence
  evidence-pack family for local implementation, verification, commit, Git
  push, pull request creation, merge, automatic Vercel deployment, and
  read-only production verification.
- Exact routes are
  `/learn/build-ict-supplier-due-diligence-evidence-pack`,
  `/zh-TW/learn/build-ict-supplier-due-diligence-evidence-pack`, and
  `/zh-CN/learn/build-ict-supplier-due-diligence-evidence-pack`.
- Request indexing, GSC validation, analytics mutation, the conditional
  `pm-claude-skills` contribution, further maintainer contact, paid action,
  synthetic events, metric-definition changes, and unrelated external
  publication remain excluded.

## Local verification: ICT supplier due diligence at 2026-08-31T01:23:11Z

- The bounded three-locale candidate passed Goal and scenario verification,
  51 Goal tests, 253 SEO tests, 77 i18n tests, TypeScript lint, the 275-page
  production build, and the 159-owner built technical audit.
- Fresh English, zh-TW, and zh-CN checks at exact `393x852` mobile and
  `1280x900` desktop sizes covered light and dark themes. Each route had one
  H1, exact canonical, reciprocal hreflang, Article and BreadcrumbList schema,
  loaded product evidence, visible FAQ without FAQPage, no horizontal overflow,
  and no console warning or error. Protected Mandarin phrases did not split.
- This proves only local technical readiness. Publication, crawl, indexing,
  impressions, clicks, visitors, authority, and causality remain unproven.

## Campaign publication: ICT supplier due diligence at 2026-08-31T01:26:37Z

- PR #160 merged at `2026-08-31T01:25:45Z` as
  `6608763f95f016a611041ddf50324e2ac616c77e`; Vercel reported production
  deployment success at `2026-08-31T01:26:37Z`.

- The integrated merge commit passed Goal and scenario verification, 51 Goal
  tests, 253 SEO tests, 77 i18n tests, TypeScript lint, the 275-page production
  build, and the 159-owner built technical audit. A fresh merged-diff read found
  the expected three routes, locale availability, nine contextual inbound
  links, bounded capability claims, and no semantic integration conflict.
- The deployed audit passed robots, all 159 sitemap URLs, 30 key pages, utility
  noindex surfaces, 25 redirect checks, six bridge-host checks, and sitemap-wide
  FAQPage absence. English, zh-TW, and zh-CN returned direct 200 with exact
  canonicals, reciprocal hreflang, Article and BreadcrumbList schema, loaded
  product evidence on the exact mobile checks, visible FAQ without FAQPage, no
  horizontal overflow, and no console warning or error.
- Keep `2026-08-31T01:26:37Z` as the fixed production boundary. The 24-hour
  technical and indexability observation is due after
  `2026-09-01T01:26:37Z`; the seven-day source-native GSC page/query and Vercel
  page/referrer observation is due after `2026-09-07T01:26:37Z`.
- This is publication evidence only. No crawl, indexing, rank, impression,
  click, visitor, authority, or causal result is claimed, and no indexing
  request, GSC validation, analytics mutation, OSS contribution, maintainer
  message, paid action, or synthetic event occurred.

## Factual release correction approval: Wenlan v0.17.6 at 2026-08-31

- GitHub Releases is the immutable product-release source for this correction.
  It reports `v0.17.6`, published `2026-08-31T00:25:35Z`, while the production
  download page still renders `v0.17.5`.
- The user explicitly approved correcting and publishing the website release
  surfaces. The exact scope is release metadata and real asset links, download,
  About, Get Started, changelog, structured data, sitemap dates, Open Graph,
  `llms.txt`, `llms-full.txt`, and the corresponding trilingual and deterministic
  contracts.
- The release keeps the published Windows x64 desktop and runtime assets, the
  notarized macOS Apple Silicon desktop asset, and macOS and Linux headless
  runtimes. Its source-backed highlights are Page summary and citation fixes,
  MCP recall scope, installed Codex skill path resolution, and bounded desktop
  UI corrections recorded in the tagged changelog.
- This is an early factual release correction permitted by the authority-first
  contract, not a search-growth experiment. It does not move any experiment
  boundary or claim crawl, indexing, ranking, impressions, clicks, visitors,
  downloads caused by the website, or SEO success.
- Approval covers the bounded commit, Git push, pull request, merge, automatic
  Vercel deployment, and read-only production verification. Request indexing,
  GSC validation, analytics mutation, source-repository changes, paid action,
  maintainer messaging, synthetic events, and unrelated publication remain
  excluded.

## Campaign observation: recent GitHub star wave at 2026-08-31T05:44:24Z

- GitHub reports 60 current stars. The latest authenticated weekly report
  captured 51 at `2026-08-28T16:02:33.553Z`, so the source-native net increase
  from that fixed capture is 9. GitHub exposes nine current stargazer events
  between `2026-08-30T08:48:22Z` and `2026-08-31T02:00:36Z`. A user-observed
  increase of 10 may use an earlier starting point or include a later removed
  star; do not overwrite the current net evidence.
- GitHub's rolling traffic referrers separately report 9 unique visitors from
  `github.com`, 7 from `t.co`, 5 from `l.threads.com`, 2 from Google, and 1 each
  from `lib.rs` and mobile Facebook. Popular paths separately report 34 unique
  visitors to the repository overview and 8 to `README.zh-Hans.md`. These are
  aggregate referrer and path units, not person-level source-to-star joins.
- Release `v0.17.5` was published at `2026-08-30T04:02:06Z`, before the nine-star
  cluster. At capture time it had 41 total release-asset downloads, including
  11 Windows desktop setup downloads and 10 Linux x64 runtime downloads.
  Release `v0.17.6` was published at `2026-08-31T00:25:35Z`, after six of the
  nine star events, and had 12 total asset downloads. These are cumulative
  point-in-time counters; they do not prove downloader-to-star causality.
- The supported inference is a release-led Mandarin social burst: X and
  Threads referrers, the simplified-Chinese README path, a directly installable
  Windows release, and the concentrated timestamps align. The evidence does
  not support attributing this wave to website SEO; Google contributed only 2
  unique GitHub referrers, and `wenlan.app` does not appear in the returned
  popular-referrer rows.
- Treat this as a repeatable candidate channel, not a durable result yet. For
  the next two or three meaningful releases, preserve each English, zh-TW, and
  zh-CN distribution timestamp and separately read 24-hour and seven-day
  GitHub stars, unique views, referrers, popular paths, and release-asset
  downloads. Only repeated source-native waves establish sustainability. The
  fixed observations and protocol are preserved in
  `docs/seo-audits/2026-08-31-release-distribution-cohort.md`.

## Local verification: Wenlan v0.17.6 website alignment at 2026-08-31T05:44:24Z

- The release contract first failed against the immutable `v0.17.6` tag because
  the website still declared `0.17.5`; the same focused contract passes after
  the correction. GitHub release metadata, tagged CHANGELOG, README, exact asset
  names, published time, and asset sizes were used as source facts.
- Goal and scenario verification passes with 51 tests. SEO passes with 253
  tests, i18n with 77 tests, TypeScript lint passes, the 275-page production
  build passes, and the built technical audit passes 159 sitemap URLs, 24 key
  HTML pages, redirects, noindex surfaces, robots, and sitemap-wide FAQPage
  absence. The first build attempt was invalid because Turbopack rejected an
  out-of-root `node_modules` symlink; the reported pass is from a clean worktree
  install and a new successful build.
- The English, zh-TW, and zh-CN download routes render `v0.17.6`, exact locale
  canonicals, the six published asset links, no `v0.17.5` text, no horizontal
  overflow, and no browser warnings or errors at desktop and exact `393x852`
  mobile sizes. English structured data exposes software version `0.17.6`.
  Screenshots are stored under `/tmp/wenlan-v0176-download-*.png` for this run.
- Read-only HEAD checks followed every website-linked `v0.17.6` asset through
  GitHub's redirect and returned 200. This proves local release-surface
  readiness and current asset availability only. Production publication and
  live-site alignment remain pending until the approved PR is merged and the
  automatic Vercel deployment completes.

## Campaign publication: Wenlan v0.17.6 website alignment at 2026-08-31T05:49:10Z

- PR #162 merged at `2026-08-31T05:48:21Z` as
  `ed5344e018f1f09cc4905d2a77abf43aaaa00476`; Vercel reported production
  deployment success at `2026-08-31T05:49:10Z`.
- The integrated merge commit passed Goal verification, 51 Goal tests, 253 SEO
  tests, 77 i18n tests, TypeScript lint, the 275-page production build, and the
  159-owner built technical audit. The merged diff contains only the approved
  release surfaces, deterministic contracts, and campaign evidence.
- The deployed audit passed robots, all 159 sitemap URLs, 30 key pages, six
  utility noindex surfaces, 25 redirect checks, six bridge-host checks, and
  sitemap-wide FAQPage absence. English, zh-TW, and zh-CN download routes return
  direct 200 responses with exact canonicals and `v0.17.6`; the English
  structured data reports software version `0.17.6` and all six published asset
  links remain visible. The live desktop render has no visible release-layout
  regression. Historical `v0.17.5` changelog text in `llms-full.txt` remains
  intentionally preserved and is not the current-release declaration.
- This closes the factual release correction only. It does not move a search
  experiment boundary or claim a new crawl, indexing, ranking, impressions,
  clicks, visitors, download attribution, star attribution, or SEO success. No
  indexing request, GSC validation, analytics mutation, source-repository
  change, paid action, maintainer message, or synthetic event occurred.
## Campaign research: customer-support answer knowledge base at 2026-08-31T04:18:27Z

- The broad `AI customer support` candidate remains rejected. Wenlan does not
  provide help-desk or CRM ingestion, customer-data redaction, team
  permissions, ticket analytics, reply deployment, channel synchronization,
  or automatic escalation.
- A narrower files-first task passes all candidate gates: support operations,
  technical writers, product support, or customer-success content owners can
  turn approved product and policy documents into one reviewable support
  answer pack. Each answer preserves the customer question, supported answer,
  scope, prohibited promise, escalation condition, source revision, owner, and
  next review date.
- Ubersuggest estimated `70` US monthly searches for
  `customer support knowledge base` and `110` for the related
  `customer service knowledge base` phrase. Those tool-native estimates are
  materially below the recorded `LLM wiki` estimate and do not replace GSC.
  Ubersuggest's Taiwan and China-labelled reports still linked to US
  `locId=2840`; their localized absolute-volume rows are invalid and excluded.
- KCS, Microsoft, Emergent, a Taiwan practitioner workflow, and a
  Simplified-Chinese operating guide repeat stale answers, source revisions,
  ownership, review, and escalation. English, zh-TW, and zh-CN result surfaces
  were inspected separately; no external observation is treated as Wenlan
  rank, traffic, GSC, or causality.
- The clean gap is the answer record, not a renamed generic knowledge-base
  guide and not an AI-support platform. Existing owners cover document
  ingestion, source-backed architecture, citation verification, stale Pages,
  and retrieval regression; none owns the approved support-question to
  bounded answer-pack task.
- The conditional authority path is
  `keon/awesome-customer-success#knowledge-base-and-documentation`. The
  repository is active and merged relevant tool additions in 2026, but had 24
  stars and no written contribution guide at capture time. Treat it as an
  exact-fit, limited-reach proposal path; acceptance and any backlink are not
  assumed.
- The verifier-protected family is
  `customer-support-answer-knowledge-base` at `net-new` /
  `not-published`. Complete source provenance, locale wording, product
  boundaries, internal links, and authority checks are stored in
  `docs/seo-audits/2026-08-30-customer-support-answer-knowledge-base-demand-gate.md`
  and `docs/seo-scenario-backlog.json`.
- No page, translation, content experiment, commit, push, PR, merge,
  deployment, indexing request, GSC validation, analytics mutation, OSS
  proposal, maintainer message, paid action, or external publication is
  authorized or performed by this research record. Exact three-locale local
  page preparation requires a separate user approval.

## Campaign preparation: customer-support answer knowledge base at 2026-08-31

- The user separately approved exact local preparation of the English, zh-TW,
  and zh-CN customer-support answer knowledge-base family. The approved scope
  included the three pages, exactly three same-locale contextual inbound
  owners, deterministic SEO and localization contracts, a production build,
  the built technical audit, and desktop plus exact `393px` visual checks.
- Exact prepared routes are
  `/learn/build-customer-support-answer-knowledge-base`,
  `/zh-TW/learn/build-customer-support-answer-knowledge-base`, and
  `/zh-CN/learn/build-customer-support-answer-knowledge-base`.
- Each page owns one approved-document to reviewable-answer-pack task. It
  preserves the customer question, supported answer, scope, prohibited
  promise, escalation condition, source revision, human owner, and next review
  date. The broad AI-customer-support platform intent remains rejected.
- The implementation explicitly excludes ticket or CRM ingestion, raw customer
  conversations, PII handling, team permissions, support analytics, automatic
  policy approval, customer-facing publication, reply generation or delivery,
  channel synchronization, and automatic escalation.
- The scenario is `prepared`, not published or measuring. Commit, push, PR,
  merge, Vercel deployment, request indexing, GSC validation, analytics
  mutation, the conditional `awesome-customer-success` proposal, maintainer
  contact, paid action, synthetic events, and every other external publication
  remain excluded until separately approved.
- Local verification passes Goal and scenario checks, 52 Goal tests, 254 SEO
  tests, 79 i18n tests, TypeScript lint, a 279-page production build, the
  162-URL built technical audit, and the running-build locale matrix with 35
  expected 200 routes and four intentional 404 routes.
- Fresh browser checks cover all three routes at exact `393x852` and
  `1280x900`. Each state has the exact canonical, reciprocal hreflang, Article
  and BreadcrumbList schema, the copyable eight-field answer template, two
  visible FAQ items without FAQPage, no overflow, no broken image, no framework
  overlay, and no console warning or error. The protected Mandarin answer-pack,
  prohibited-promise, and escalation phrases each remain inside one rendered
  text rectangle at 393px; a final FAQ interaction opens its answer.
- The browser pass corrected two defects before the final build: the English
  page now contains the same eight-field record as both Mandarin pages, and the
  simplified-Chinese `禁止承诺` phrase has an explicit CJK no-split contract.
  A final responsive regression contract also makes both article hero grids use
  an explicit shrinkable mobile track. These are prelaunch corrections and do
  not start a measurement boundary.

## Campaign observation: SRE incident knowledge base 24-hour readout at 2026-08-31T05:06:46Z

- Keep `2026-08-30T05:06:25Z` as the fixed production boundary. The live
  English, zh-TW, and zh-CN routes each return a direct 200 with exact
  self-canonical, reciprocal en-US/zh-TW/zh-CN/x-default hreflang, sitemap
  membership, Article and BreadcrumbList dated `2026-08-29`, visible runbook,
  postmortem or incident-review, safety-limit, and FAQ answers, and no FAQPage
  schema. The newer supplier-publication deployed audit already passed all 159
  live sitemap URLs and the broader technical surface, so this readout did not
  duplicate that full pipeline.
- The latest successfully completed authenticated Friday evidence remains
  `2026-07-31..2026-08-27`, before SRE publication. GSC property totals are 7
  clicks / 913 impressions; visible-query totals are 2 / 221; the visibility
  gap is 5 clicks / 692 impressions. No SRE target-page or joined query-page row
  exists in that range, so every locale observation is unavailable rather than
  zero.
- Vercel remains 289 visitors / 690 pageviews. Direct remains 257 visitors /
  654 pageviews, while Google is 28 / 29, Bing is 2 / 2, cn.bing.com is 1 / 1,
  DuckDuckGo is 1 / 2, Gemini is 1 / 1, and Kagi is 1 / 1. No SRE target-page
  or authenticated source-to-page row exists in the preserved pre-deploy
  range. GitHub remains a separate 51-star observation captured at
  `2026-08-28T16:02:33.553Z`.
- Authenticated URL Inspection was unavailable in this task. No post-deploy
  crawl, indexing state, source-to-page session, rank, traffic, or causal result
  is inferred. The 24-hour result is `inconclusive`; run the seven-day
  source-native readout after `2026-09-06T05:06:25Z`.
- Independent release reconciliation found GitHub Releases at immutable
  `v0.17.6`, published `2026-08-31T00:25:35Z`, with 12 asset downloads at
  capture time, while the live download page still renders `v0.17.5`. This is a
  website release-alignment finding, not SRE growth evidence. No website,
  analytics, indexing, validation, paid, maintainer-message, or other external
  state was changed by this readout.

## Campaign publication: customer-support answer knowledge base at 2026-08-31T15:31:22Z

- The user approved publication. PR #164 merged at `2026-08-31T15:26:16Z` as
  `19636df9cdcc170639fab9c652353028b39ffd00`; Vercel production completed at
  `2026-08-31T15:27:07Z`.
- The integrated merge commit passes Goal and scenario verification, 52 Goal
  tests, 254 SEO tests, 79 i18n tests, TypeScript lint, the 279-page production
  build, and the 162-owner built technical audit. The deployed audit passes all
  162 sitemap URLs, 30 key pages, utility noindex surfaces, redirects, bridge
  hosts, and sitemap-wide FAQPage absence.
- English, zh-TW, and zh-CN return direct 200 with exact self-canonicals,
  reciprocal hreflang, Article and BreadcrumbList schema, the visible bounded
  support-answer pack, no FAQPage schema, and no broken image, console issue, or
  horizontal overflow at exact `393x852` and `1280x900` viewports.
- Keep `2026-08-31T15:27:07Z` as the fixed production boundary. This proves
  publication and technical availability only; it is not a crawl, indexing,
  rank, impression, click, visitor, authority, or causal result. The 24-hour
  technical observation is due after `2026-09-01T15:27:07Z`; the seven-day
  source-native GSC and Vercel observation is due after
  `2026-09-07T15:27:07Z`.
- Request indexing, GSC validation, analytics mutation, the conditional
  `awesome-customer-success` proposal, maintainer contact, paid actions,
  synthetic events, and every other external publication remain excluded.

## Campaign research: next trilingual scenario at 2026-08-31T17:53:42Z

- A three-way demand comparison covered RFP / tender answer libraries,
  employee onboarding / training knowledge bases, and student lecture / PDF
  study knowledge bases across English, zh-TW, and zh-CN. The research reviewed
  160 requested Exa results, fetched 12 source pages, inspected signed-in
  Google Trends, and checked the signed-in Qi-Xuan Lu OpenSEO workspace.
- OpenSEO keyword research is unavailable because the current account has no
  credits. Its GSC surface was used only to confirm existing `llm wiki`
  adjacency; no ambiguous date-range total was copied into the Goal or treated
  as demand.
- The selected next family is `course-slides-source-backed-llm-wiki`. It owns
  one course-material to maintained course-wiki task, not a generic student
  persona: readable lecture slides, notes, and PDFs become concept pages with
  exact sources, prerequisite links, source revisions, and review state.
- The family explicitly excludes flashcards, quizzes, audio, transcription,
  OCR, grading, tutoring, homework solving, exam planning, automatic academic
  judgment, and claims that Wenlan is equivalent to NotebookLM. These excluded
  capabilities dominate much of the broader student-study result set.
- RFP remains a future high-intent candidate, but the exact knowledge-base
  phrases have little Trends data and the dominant result intent expects
  response generation, document export, approvals, CRM, permissions, and bid
  management. Employee onboarding is rejected at the broad level because
  multi-user access, HR permissions, LMS / HRIS integration, training media,
  quizzes, and progress tracking are central to the result intent.
- The selected family has the stronger current acquisition leverage because
  it joins broad study demand with Wenlan's already visible LLM Wiki cluster
  and maintained first-party proof. A bilingual student LLM Wiki repository
  had 172 GitHub stars and a Georgia Tech course-PDF system had 7 stars and 26
  forks at capture; these remain independent observations, not endorsements.
- Full provenance, native-unit Trends values, source URLs, candidate failures,
  locale wording, owner overlap, first-party proof, internal links, and the
  separately approval-gated authority path are stored in
  `docs/seo-audits/2026-08-31-next-scenario-demand-comparison.md` and the
  verifier-protected `docs/seo-scenario-backlog.json` entry.
- No page was implemented or published. Exact local preparation of the three
  proposed routes requires separate user approval. Commit, push, PR, merge,
  Vercel deployment, request indexing, GSC validation, analytics mutation,
  the conditional `awesome-ai-tools-for-students` proposal, maintainer contact,
  paid actions, synthetic events, and every other external publication remain
  excluded.

## Campaign preparation: course wiki from lecture notes at 2026-08-31

- The user approved local preparation of the selected
  `course-slides-source-backed-llm-wiki` family. English, zh-TW, and zh-CN now
  have one local owner for turning readable lecture slides, notes, and course
  PDFs into a maintained course wiki with exact sources, prerequisite links,
  source revisions, and review state.
- The exact routes are `/learn/build-course-wiki-from-lecture-notes`,
  `/zh-TW/learn/build-course-wiki-from-lecture-notes`, and
  `/zh-CN/learn/build-course-wiki-from-lecture-notes`. The general document,
  LLM Wiki, and research owners provide the three same-locale inbound paths.
- The implementation uses real Wenlan source-backed Page, citation, wikilink,
  stale-dependency, revision, lint, and review behavior. It excludes flashcards,
  quizzes, transcription, OCR, grading, tutoring, homework solving, exam
  planning, academic judgment, and NotebookLM equivalence.
- The latest source-native weekly baseline remains GSC 7 clicks / 913
  impressions, visible-query 2 / 221, visibility gap 5 / 692, Vercel 289
  visitors / 690 pageviews, Google referrer 28 / 29, and GitHub 51 stars. New
  target rows remain unavailable rather than zero.
- Authority state changed independently: `awesome-selfhosted-data#2955` closed
  without merge or a recorded maintainer reason, while
  `awesome-mcp-servers#52` is merged and visibly renders a Wenlan repository
  listing. Neither observation is attributed traffic for this new family.
- Full demand, overlap, content, technical, measurement, and approval details
  are persisted in `docs/seo-scenario-backlog.json`,
  `docs/seo-audits/2026-08-31-next-scenario-demand-comparison.md`, and
  `docs/seo-audits/2026-08-31-course-wiki-from-lecture-notes-prelaunch.md`.
- The family is `prepared`, not published. Finish deterministic and rendered
  local verification, then stop for separate commit, push, PR, merge, Vercel
  deployment, and production-verification approval. Request indexing, GSC
  validation, analytics mutation, the planned OSS proposal, maintainer contact,
  paid actions, synthetic events, and other external publication remain
  excluded.

## Campaign verification: course wiki from lecture notes at 2026-08-31T18:36:02Z

- Local verification passed. Goal and scenario checks report 17 trilingual
  families and 165 sitemap owners; Goal tests pass 53/53, SEO passes 255/255
  against the published Wenlan `v0.17.6` tag, i18n passes 80/80, and TypeScript
  lint passes.
- The production build generated 283 static pages. The built technical audit
  passed 165 sitemap URLs, 24 required pages, 26 redirects, robots, noindex
  headers, and FAQPage absence across 169 HTML files. The running-build locale
  check returned 200 for 37 expected routes and 404 for four intentional
  unsupported routes.
- Because the in-app Browser control tool was unavailable in this task,
  bundled Playwright and local Chrome performed the permitted fallback.
  English, zh-TW, and zh-CN passed at `1280x900` and exact `393x852`: correct
  title, H1, canonical, reciprocal hreflang, Article and BreadcrumbList,
  visible FAQ without FAQPage, loaded evidence image, working FAQ expansion,
  no framework overlay, no console warning or error, no horizontal overflow,
  and no protected Mandarin phrase split.
- The three routes remain local and unpublished. The next decision is the
  exact commit, push, PR, merge, automatic Vercel deployment, and read-only
  production-verification scope. Indexing requests, GSC validation, analytics
  mutation, the planned OSS proposal, maintainer contact, paid actions,
  synthetic events, and every other external action remain separate.

## Campaign publication approval: course wiki from lecture notes at 2026-09-01T04:21:18Z

- The user explicitly approved the locally verified English, zh-TW, and zh-CN
  Course Wiki family for commit, Git push, pull request creation, merge,
  automatic Vercel deployment, and read-only production verification.
- The approved scope is exactly the manifest-owned candidate recorded in
  `docs/seo-audits/2026-08-31-course-wiki-publication-manifest.md`.
- Request indexing, GSC validation, analytics mutation, the conditional
  `awesome-ai-tools-for-students` proposal, maintainer contact, paid actions,
  synthetic events, metric-definition changes, and every other external action
  remain excluded.
- Next step: commit and push only the verified candidate, merge its pull request
  in turn after required checks, verify the integrated commit, wait for Vercel
  production completion, and run read-only production verification. Keep the
  Vercel completion timestamp as the fixed experiment boundary.

## Campaign publication: course wiki from lecture notes at 2026-09-01T04:26:43Z

- PR #166 merged at `2026-09-01T04:25:50Z` as
  `9b12ad73eb51c95d013e69e455c1a67d03f0e08d`; Vercel production completed at
  `2026-09-01T04:26:43Z`. Keep that completion time as the fixed experiment
  boundary.
- The integrated merge tree exactly matched the verified candidate. Goal and
  scenario checks, 53 Goal tests, 255 SEO tests against Wenlan v0.17.6, 80
  i18n tests, TypeScript, the 283-page build, 165-owner intent check, built
  technical audit, and 37 expected 200 / four expected 404 route matrix passed
  again on the merge commit.
- The deployed audit passed robots, all 165 sitemap URLs, 30 key pages, six
  utility noindex surfaces, sitemap-wide FAQPage absence, 25 redirects, six
  bridge-host redirects, and removal of old URLs from the sitemap.
- English, zh-TW, and zh-CN returned direct 200 with exact self-canonicals,
  reciprocal en-US / zh-TW / zh-CN / x-default hreflang, Article and
  BreadcrumbList schema, visible working FAQ without FAQPage, loaded images,
  no console issue, no horizontal overflow, and no protected Mandarin phrase
  split at 1280x900 and exact 393x852.
- This proves publication and technical availability only. It is not a crawl,
  indexing, rank, impression, click, visitor, authority, or causal result.
  Request indexing, GSC validation, analytics mutation, the conditional
  student-tools proposal, maintainer contact, paid action, and synthetic events
  remain excluded.

## Campaign preparation: business metric definition knowledge base at 2026-09-01T04:37:44Z

- The production slot is open after Course Wiki production verification. The
  next candidate is `business-metric-definition-knowledge-base`, whose complete
  gate is recorded in
  `docs/seo-audits/2026-08-31-business-metrics-glossary-demand-gate.md`.
- English discovery leads with `data dictionary` and `metric definition`;
  zh-TW leads with `指標定義`; zh-CN leads with `指标定义`. These are
  source-native Trends and result observations, not keyword volume or Wenlan
  performance.
- The one owned task is to resolve conflicting KPI definitions from approved
  files into a cited, versioned, human-reviewed definition record. Data,
  analytics, product, finance, operations, and AI-agent users share this result
  shape, so they do not receive separate duplicate landing pages.
- Local preparation is allowed. Commit, push, PR, merge, Vercel deployment,
  source-repository README links, request indexing, GSC validation, analytics
  mutation, maintainer contact, paid actions, synthetic events, and every other
  external action remain separately gated.

## Campaign verification: business metric definition knowledge base at 2026-09-01T04:54:48Z

- Local verification passed. Goal and scenario checks report 18 trilingual
  families and 168 sitemap owners; Goal tests pass 54/54, SEO passes 256/256
  against Wenlan v0.17.6, i18n passes 81/81, and TypeScript lint passes.
- The production build generated 287 static pages. The built technical audit
  passed all 168 sitemap URLs, 24 required pages, 26 redirects, robots,
  noindex headers, and FAQPage absence across 172 built HTML pages. The running
  build returned 200 for 39 expected routes and 404 for four intentional
  unsupported routes.
- Fresh in-app Browser checks covered English, zh-TW, and zh-CN at `1280x900`
  and exact `393x852`. Every route had one H1, exact self-canonical,
  reciprocal hreflang, Article and BreadcrumbList schema, loaded product
  evidence, a working evidence anchor and FAQ expansion, visible FAQ without
  FAQPage, no framework overlay, no console warning or error, no horizontal
  overflow, and no protected Mandarin phrase split. The initial zh-CN desktop
  screenshot caught a font-loading race; after `document.fonts.ready`, its
  stable layout had no overlap.
- Exact evidence, task boundary, routes, commands, internal links, and temporary
  screenshot paths are recorded in
  `docs/seo-audits/2026-09-01-business-metric-definition-knowledge-base-prelaunch.md`.
- The three routes remain local and unpublished. Stop for explicit commit,
  push, PR, merge, automatic Vercel deployment, and read-only production
  verification approval. The Wenlan source README link, request indexing, GSC
  validation, analytics mutation, maintainer contact, paid actions, synthetic
  events, and every other external action remain separate.

## Campaign publication approval: business metric definition knowledge base at 2026-09-01T05:03:53Z

- The user explicitly approved the locally verified English, zh-TW, and zh-CN
  business-metric definition family for commit, Git push, pull request
  creation, merge, automatic Vercel deployment, and read-only production
  verification.
- The approved scope is exactly the candidate-owned files and exclusions in
  `docs/seo-audits/2026-09-01-business-metric-definition-publication-manifest.md`.
- The Wenlan source README authority link, request indexing, GSC validation,
  analytics mutation, maintainer contact, paid actions, synthetic events, and
  every other external action remain excluded.
- Next step: commit and push only the verified candidate, merge its pull
  request in turn after required checks, verify the integrated commit, wait
  for Vercel production completion, and run read-only production verification.

## Campaign publication: business metric definition knowledge base at 2026-09-01T05:16:00Z

- PR #167 merged at `2026-09-01T05:07:45Z` as
  `7664d1a3d3578533fab8aed626856930e3d04b11`; Vercel production completed at
  `2026-09-01T05:08:53Z`.
- The integrated merge commit passes Goal and scenario verification, 54 Goal
  tests, 256 SEO tests against Wenlan v0.17.6, 81 i18n tests, TypeScript lint,
  the 287-page production build, the 39 expected 200 / four intentional 404
  route matrix, and the 168-owner built technical audit.
- The deployed audit passes robots, all 168 sitemap URLs, 30 key pages, six
  utility noindex surfaces, 25 redirects, six bridge-host redirects, and
  sitemap-wide FAQPage absence. English, zh-TW, and zh-CN return direct 200
  with exact self-canonicals, reciprocal hreflang, Article and BreadcrumbList
  schema, loaded product evidence, a working evidence anchor and FAQ, and
  visible FAQ without FAQPage.
- Fresh production captures at `1280x900` render all three locales correctly.
  Exact `393x852` mobile emulation reports `innerWidth`, HTML scroll width, and
  body scroll width all equal to 393 for every locale, with one H1 contained
  inside the viewport, no browser warning or error, no broken image, and no
  protected Mandarin phrase split. A command-line-only narrow screenshot had
  first appeared cropped because it did not emulate a mobile layout viewport;
  the measured mobile viewport disproved that false positive.
- Keep `2026-09-01T05:08:53Z` as the fixed production boundary. This proves
  publication and technical availability only; it is not a crawl, indexing,
  rank, impression, click, visitor, authority, or causal result. The 24-hour
  technical observation is due after `2026-09-02T05:08:53Z`; the seven-day
  source-native GSC and Vercel observation is due after
  `2026-09-08T05:08:53Z`.
- The Wenlan source README authority link, request indexing, GSC validation,
  analytics mutation, maintainer contact, paid actions, synthetic events, and
  every other external action remain excluded.

## Campaign authority approval: business metric definition README links at 2026-09-01T06:49:30Z

- The user approved the predeclared maintained first-party authority path and
  the control-plane state correction. The publication scope is one natural
  same-locale Business Metric Guide link in Wenlan source `README.md`,
  `README.zh-Hant.md`, and `README.zh-Hans.md`, plus only the mechanical
  translated-README sync-marker update required by that repository.
- The same correction marks Course Wiki and Business Metric as live,
  production-verified, and measuring, with the production slot open. It does
  not alter either fixed production boundary or any metric definition.
- Commit, push, PR, merge, and read-only GitHub rendering verification are
  approved for those exact README and control-plane files. A Wenlan release,
  site-page edit, request indexing, GSC validation, analytics mutation,
  maintainer contact, paid action, synthetic event, and every other external
  action remain excluded.

## Campaign authority publication: business metric definition README links at 2026-09-01T06:54:33Z

- Wenlan source PR #655 merged at `2026-09-01T06:53:31Z` as
  `e450c4371f224802666a53e4dcbe7b4990935ca8` after its docs-provenance check
  passed. The integrated commit passes the translated-README sync check and its
  self-test.
- GitHub main visibly renders the English, Traditional-Chinese, and
  Simplified-Chinese Business Metric Guide links. Their locale-matched
  `wenlan.app` targets each returned a direct 200 before publication. The
  Spanish README content is unchanged; only its required English-source sync
  marker advanced.
- This proves a maintained first-party source link, not a referral, crawl,
  indexing, rank, impression, click, visitor, star, backlink acceptance, or
  causal result. The site measurement boundary remains
  `2026-09-01T05:08:53Z`.
- No Wenlan release, site-page edit, request indexing, GSC validation,
  analytics mutation, maintainer contact, paid action, synthetic event, or
  other external action occurred.

## Campaign authority gate: Course Wiki OSS listing at 2026-09-01T07:13:17Z

- The predeclared `sohailakhtar01/awesome-ai-tools-for-students` target was
  checked source-natively before any submission. Its README categories and
  contribution format fit the student Course Wiki task, and Wenlan is not
  already listed.
- The maintenance and reach gate failed: the repository has 0 stars, one
  initial commit, no merged pull requests, and three unattended open pull
  requests. The target is now `rejected-inactive`; no pull request, issue, or
  maintainer message was created.
- Exact repository counts, timestamps, rules, and interpretation boundaries
  are recorded in
  `docs/seo-audits/2026-09-01-course-wiki-authority-gate.md`.
- Next research must find a student, course-material, or LLM-Wiki authority
  surface with direct audience fit, recent maintainer activity, and visible
  review or merge cadence. A replacement submission remains separately
  approval-gated.
- The best current replacement is `bydeng01/student-gpt-tools`: 85 stars, 15
  forks, six merged pull requests, and demonstrated external tool merges. Its
  latest merge was `2026-06-17` and two newer submissions remain open, so the
  exact one-row Course Wiki proposal is prepared but not published. The
  proposal and two rejected alternatives are recorded in the same audit.

## Campaign authority submission: Course Wiki student-tools PR at 2026-09-01T08:11:06Z

- The user explicitly approved the control-plane publication and external
  listing submission. GitHub identity was verified as `Qi-Xuan Lu`
  (`7xuanlu`).
- The exact one-row, affiliation-disclosed Course Wiki proposal was committed
  as `052c297b2b811f2221dc9c03e6eee05becbe47a8` in the fork and opened upstream
  as `bydeng01/student-gpt-tools#18`.
- Source-native state at capture is open, non-draft, mergeable, with no review
  decision and no status checks. It is not a merged or visibly rendered
  listing, backlink, referral, crawl, indexing, rank, impression, click,
  visitor, star, or causal result.
- Wait for maintainer action and re-read the PR once at the next due Goal
  boundary. Do not contact the maintainer again or count authority before an
  upstream merge and visible render.

## Campaign authority reconciliation: research README links at 2026-09-01T14:14:03Z

- The control plane incorrectly described the source-backed research
  knowledge-base README authority path as locally prepared. Source-native
  history shows Wenlan source PR #624 already merged it at
  `2026-08-28T05:16:37Z` as
  `368fabcf667736e1b116dac8a9e79b017ae4d6bf`.
- Current Wenlan main `e450c4371f224802666a53e4dcbe7b4990935ca8`
  still contains all four locale-aware README links. The translated-README sync
  checker and self-test pass, and the three website targets return direct 200.
- Mark the authority path `published`; do not reapply the stale proposal patch.
  This is first-party publication evidence only, not independent endorsement,
  referral traffic, crawl, indexing, rank, impressions, clicks, visitors, or
  causal growth.
- Keep the site production boundary at `2026-08-28T03:49:51Z`. Append the
  overdue 24-hour technical/indexability readout next, then run the seven-day
  GSC/Vercel readout after `2026-09-04T03:49:51Z`.

## Research technical readout and GitHub star diagnosis at 2026-09-01T14:39:32Z

- The overdue Research Knowledge Base technical readout passed: all three
  locale routes return direct 200, exact self-canonicals, reciprocal hreflang,
  `index, follow`, Article and BreadcrumbList schema, no FAQPage schema, and
  the visible literature-matrix, contradiction, limitation, and source-update
  task. The deployed audit passed 168 sitemap owners and every protected
  robots, redirect, utility-noindex, and FAQPage absence check.
- The latest authenticated GSC/Vercel evidence ends `2026-08-27`, before the
  fixed production boundary. Target-page/query/referrer rows are unavailable,
  not zero. Authenticated URL Inspection could not be read in this task and is
  `unchecked`; no crawl or indexing success is inferred.
- GitHub now reports 60 stars. The nine stars after the fixed 51-star weekly
  capture all arrived between `2026-08-30T08:48:22Z` and
  `2026-08-31T02:00:36Z`, with none afterward at capture. GitHub's aggregate
  referrers show much more X/Threads exposure than Google, but do not join a
  referrer to an individual star. Treat this as one distribution burst, not a
  sustainable daily rate or SEO attribution.
- Full source-native counters and interpretation boundaries are preserved in
  `docs/seo-audits/2026-09-01-github-star-burst-diagnosis.md`.
- Next due evidence: the Research family seven-day GSC/Vercel readout after
  `2026-09-04T03:49:51Z`. The 60-star plateau requires a repeatable qualified
  distribution cohort in parallel with SEO; keeping pages live alone is not a
  star-growth mechanism.
