# Homepage workflow comparison evidence

Checked 2026-09-07. Current scope: five alternatives in `#knowledge-workflows`, in English, zh-TW and zh-CN. This is a documentation/source-code comparison, not a hands-on benchmark, demand measurement, or proof of conversion improvement. The final reconciliation below supersedes the earlier self-built-pattern comparison and four-choice visual receipt.

## Reading contract

- Ask which workflow the reader knows. Keep Wenlan in the first product column. Following the user's 2026-09-07 approval, both columns now answer the selected comparison; the underlying product facts and dimensions remain consistent.
- Compare the same three questions, in reader-outcome order: what can be reused next time, who updates it when information changes, and who controls data and edits.
- Keep sources and important configuration boundaries in a native disclosure. Do not hide the alternatives' strengths or imply mutually exclusive categories.
- Wenlan is an LLM Wiki implementation. Citations, local files, maintenance, review and MCP are not individually exclusive to Wenlan.
- The approved refined visual is an aligned comparison, not a Bento grid or a winners/losers checklist. Preserve other homepage sections.

## Claim ledger

### Self-built LLM Wiki

[Karpathy's original pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) describes human-curated raw sources and an LLM-maintained Markdown wiki: source ingestion, cross-links, cited answers, and checks for stale or conflicting claims. The reader chooses rules and invokes or arranges the maintenance work. It is a pattern, not one packaged product with universal defaults.

[nashsu/llm_wiki](https://github.com/nashsu/llm_wiki) is a packaged implementation that documents source watching, review and MCP. Its local project files do not mean every model or parsing provider runs locally. Do not attribute every packaged feature to Karpathy's minimal pattern, or deny those features to other implementations. No claim that arbitrary remote URLs are continuously fetched.

### Notion

[Notion Agent](https://www.notion.com/help/notion-agent) can search, create and edit content under workspace permissions and configured instructions. It supports personal and team work; describing it as merely a database or a passive old notebook is inaccurate.

[Offline pages](https://www.notion.com/help/use-pages-offline) and [export backups](https://www.notion.com/help/back-up-your-data) are distinct from a local-file-first store. The comparison therefore says cloud workspace with offline/export options. It does not claim Notion cannot automate maintenance. Export is not a promise of one-click full workspace restoration.

### Obsidian

[Data storage](https://obsidian.md/help/data-storage) establishes a local Markdown vault. [Community plugins](https://obsidian.md/help/community-plugins) and [plugin security](https://obsidian.md/help/plugin-security) establish that extra integrations can extend behavior and affect data access. AI search, summaries and editing depend on the selected integration, not a single universal Obsidian AI configuration. Do not equate a local vault with all AI processing staying local.

### Direct Markdown files

[CommonMark](https://commonmark.org/help/) establishes the plain-text format; it does not establish an AI product capability. [Claude Code file context](https://code.claude.com/docs/en/memory) provides a concrete, inspectable example of reading project instructions and importing files. The comparison describes direct-file use, not every automation an advanced user could build. Claude Code's auto memory is another supported mechanism; the copy does not claim users must perform all maintenance manually. Tool permissions and provider settings determine file access and processing.

### Wenlan

Inspected core checkout HEAD `af646ddcf705ee7450335a8772a8cb196f89a3a1` (clean) and app HEAD `697e6e9224847851e9b5cc2aa7b767b25b8fcf32` (older, dirty checkout). Paths below identify the source inspected, not a claim that every app line was already released.

- `README.md:98–115,193–223`: Sources and captured Memories independently support maintained Pages; Markdown artifacts and local Git history; an imported design document plus a captured debugging decision can support one Page.
- `crates/wenlan-core/src/post_write/page_update.rs:111–113`: human ownership is `user_edited || creation_kind == "authored"`.
- `crates/wenlan-server/src/page_routes.rs:1013–1033`: machine refresh of a human-owned Page stages a pending revision instead of directly replacing prose.
- `crates/wenlan-core/src/synthesis/distill.rs:1290–1308,1380–1472`: current evidence is assembled for refresh; insufficient citation verification can block it.
- `docs/technical-foundations.md:176–190`: local storage/retrieval and configured model processing are different boundaries; cloud providers are possible.
- `crates/wenlan-mcp/src/tools.rs:2962–2966`: configured tools share knowledge; daemon/Space/client permissions still bound access.

Reader-facing maintained references: [Source-backed Pages](https://wenlan.app/docs/source-backed-pages), [review and trust](https://wenlan.app/docs/review-and-trust), [models and keys](https://wenlan.app/docs/models-and-keys), [local Git history](https://wenlan.app/docs/local-git-history).

Do not fabricate localized `/zh-TW/docs/<slug>` or `/zh-CN/docs/<slug>` article links: most of those routes are unsupported. The comparison links to the maintained English docs with localized link labels.

## Evidence limitations

Three bounded native explorer agents collected LLM Wiki, notebook/direct-file, and Wenlan evidence at the configured low-cost explorer setting (Luna/high). The lead reconciled the copy and implemented the comparison. No competitor runtime was exercised; no paid account tier, latency, quality ranking, market demand, or unique-feature claim is established by this work. Recheck maintained sources before future material copy changes.

## Follow-up: readable comparison and concrete differentiation

The generic promise "documents and work decisions into shared knowledge pages" described category overlap, not a unique advantage. The updated second row names the actual input path: decisions and lessons captured during AI work can support the same cited Page as source documents. The following row explains the built-in maintenance/ownership behavior. Rechecked the core README's Sources / Memories / Pages model and maintained-page workflow on 2026-09-07. This is a description of Wenlan's integrated workflow, not evidence that another LLM Wiki implementation cannot offer it.

Visual correction: body copy now follows the adjacent 16px body size; both desktop column headings use 24px. One shared table, with intrinsic-size alternative content in each cell, keeps all rows aligned across choices. Inactive content uses visibility:hidden, not opacity, and is excluded from interaction. Selector weight stays constant to avoid horizontal label shifts. No new dependency or comparison-specific client JavaScript was added.

## Audience validation and paired copy (2026-09-07)

Product capability evidence above and audience evidence below have different roles. Public experiences support the relevance of reuse, upkeep, and control. They do not establish representative prevalence, willingness to pay, Wenlan's retention, a validated top-three ranking, or improved conversion. This is a provisional editorial ordering, not a survey result. Collaboration, capture friction, price, mobile availability, and setup effort also affect tool choice; the three rows are not an exhaustive buying guide.

Exa discovery used 4 lead searches plus 3 bounded Luna/high Mandarin searches, each requesting 5 results: `sources_reviewed=35` in the search skill's requested-result sense, not 35 independent or fully read sources. One lead query returned no matches. The same PKM complaint cross-posted on Obsidian and Zettelkasten forums counts as one author/event; duplicate URLs to the same discussion are not independent support. Vendor comparison pages and affiliate-style roundups were excluded from audience validation. The lead fetched the four sources below; technical claims inside user posts were not reused as product facts.

| Observation | Provenance | What it supports / limitation |
| --- | --- | --- |
| Notes accumulate, organization consumes effort, and AI retrieval can be incomplete. Replies describe successful search/plugin workflows and argue that not every rough note needs processing. | [romebot and discussion](https://forum.obsidian.md/t/every-attempt-at-pkm-has-landed-me-in-the-same-place-a-huge-mess/89221), 2024-10-01 onward, English, region unstated; first-person forum accounts. | Reuse and effort are real concerns, but automation is not everyone's preferred solution. Older evidence, not a current AI quality benchmark. |
| A user chose local Markdown after losing notes to dead services/proprietary formats and now manages backups personally. | [Marionette](https://forum.obsidian.md/t/im-perhaps-a-little-confused-between-obsidian-and-notion-what-distinguishes-obsidian/108691/6), post body 2025-12-05 (index metadata says 12-04), English, region unstated. | Data control can be a decisive selection criterion; one user's history does not prove competitors lose data. |
| Three months of Claude + Obsidian required structure, instructions, repeatable skills and corrections to avoid inconsistent writes. | [Eric Wu](https://ericwu.asia/blog/2026-05-30-%E6%88%91%E7%94%A8-claude-%E7%AE%A1-obsidian-%E7%9A%84%E4%B8%89%E5%80%8B%E6%9C%88/), 2026-05-30, zh-TW writing, location not inferred; first-person blog with consulting framing. | AI work and maintenance boundaries matter. Also counterevidence: a self-built Obsidian workflow can already be useful; no independent benchmark. |
| Long-term Notion user reports forgotten meeting/research conclusions; an Obsidian + Claude workflow maintains related notes, preserves raw sources and leaves conflicts to people. | [XINDOO](https://zxs.io/article/2215), 2026-08-24, zh-CN writing, location unstated; first-person technical blog. | Reuse, ongoing maintenance and human control recur together. Counterevidence against Wenlan exclusivity; the page's low view count is not market demand. |

### Implementation decision

- Keep three dimensions, but replace the vague "What does AI do?" with a concrete next-use outcome and move data control after reuse/upkeep. No audience-prevalence claim is put on the page.
- LLM Wiki comparison is explicitly the self-built Karpathy pattern, not an attempt to flatten nashsu/llm_wiki into an inferior product. Cite packaged alternatives and acknowledge shared capabilities in the disclosure. Compare self-selected rules/tooling with Wenlan's concrete built-in evidence/refresh/ownership behavior.
- Obsidian comparison emphasizes coexistence: the existing vault is a read-only source, not a forced migration or a claim that plugins cannot maintain notes.
- Notion comparison retains personal/team use and built-in Agent strengths; Wenlan explains local storage, reusable knowledge and configured model processing, not a claim to replace team collaboration.
- Direct Markdown comparison explains reusable cited pages and evidence/history handling, not a claim that sophisticated file-based agents cannot do this.
- The user's mobile screenshot identified selector-label alignment, not table-cell alignment. Center the labels inside equal mobile grid tracks with `justify-content:center` and `text-align:center`; keep CJK words intact. Verify text-range centers, not only table styles.

### Verified working state

Local clone `/private/tmp/wenlan-task-first-site-sync`, branch `codex/task-first-site-sync`, base HEAD `b6eb76c6be2a58345de178771412ed18dc0d3a65` plus the preserved working changes. No commit, push, PR or deployment was performed.

- Built and served the actual production output on loopback port 3096. Checked all four choices in English, zh-TW and zh-CN at 393px mobile and 1440px desktop widths (24 states); also inspected dark mode and full Mandarin comparison content.
- Mobile selector text centers differ from their grid-track centers by less than 0.004 CSS pixels. Mobile product headers use grid alignment because `vertical-align:middle` alone does not center the contents after table rows become CSS grids. Header centers differ by at most 0.25px.
- No horizontal page overflow in those states. Every comparison body cell uses 16px type. Per-row height and position stay stable across choices, allowing subpixel rounding below 0.001px.
- Both columns change with the selected alternative. Native keyboard arrow selection and the source disclosure were exercised successfully; only the selected alternative's source links appear. The inspected browser error/warning log was empty.
- `pnpm lint`, 31 focused homepage/scenario tests, both comparison-localization protected-token checks, production build, `pnpm seo:technical:built`, and `git diff --check` passed.
- Full `pnpm test:i18n`: 78/82 pass. Four existing failures remain outside this comparison: old hero class/headline/continuation expectations and the hero's `Wenlan`/`文瀾` protected-token mismatch. They were not weakened or repaired as part of this scoped change.
- Screenshots and geometry are stored outside git in the task's `2026-09-07-paired-comparison` visualization folder. They prove this local working state, not the public deployment or any conversion improvement.

## Named-project and market-research reconciliation (2026-09-07)

The user requested recall of the earlier market research. Retrieved the canonical local Wenlan page **LLM-Wiki Gap and Parity Tracker**, `page_fd8bd2ba-ac2d-4f74-b9d5-28ab17879f4a`, version 14, modified 2026-08-30. This is a research lead, not automatically current product truth. Its important surviving distinction is the combination of evidence handling, conditional pre-write review, and a runtime that can operate without a GUI. Feature overlap does not establish equivalence or market saturation.

### Current-source checks

- **Compare the named project, not a straw-man DIY pattern.** The tab now names [nashsu/llm_wiki](https://github.com/nashsu/llm_wiki), with the project identifier visible. It is not called "v1". Karpathy's concept remains separately attributed. The project already offers source watching, regeneration, saved answers, reviews, MCP and skills; these cannot be denied to make Wenlan look unique.
- **Review queue is not the same as blocking an overwrite.** Re-read current [`src/lib/ingest.ts`](https://github.com/nashsu/llm_wiki/blob/main/src/lib/ingest.ts): step 3 writes files (1165–1170), step 4 parses/adds Review items (1402–1411). This finding is scoped to that ingestion path, not every possible project edit. Wenlan's current `post_write/page_update.rs:111–121,151–194,625–679` stages a revision for human-authored or edited Pages and rechecks ownership/version before applying; `post_write/page_revision.rs:255–285` applies accepted revisions. Machine-maintained Pages can refresh according to configuration.
- **Separate superseding-memory gate.** Current `memory_routes.rs:485–495` gates `supersedes` from agents whose trust is not full. Plain appends and full-trust replacements are not universally gated. Do not promote this to "every AI write requires approval".
- **GUI is optional for Wenlan's runtime.** Current core `README.md:42,79–89` describes the same daemon with plugin/CLI/MCP or desktop front ends. The current [nashsu MCP README](https://github.com/nashsu/llm_wiki/blob/main/mcp-server/README.md) requires its desktop app to be running with the local API and MCP access enabled. Therefore headless use is a concrete difference, not simply "both have MCP".
- **Citation checks need calibrated wording.** Current `citations.rs:129–138,187–193,263–316` uses lexical overlap, records per-occurrence verification status, and strips out-of-range markers. The old research wording that every failed support marker is stripped is not current. Lexical support scoring is not semantic truth verification. Public copy says citations and check status, not guaranteed correctness.
- **No broad adoption inference.** The old page's download/install counts are not unique active users, retention, or proof that nobody owns the market. No such conclusion or ease-of-onboarding ranking is published here. "Approachable AI-native workflow" is a positioning hypothesis; representative usability tests are still needed.

### Recovered category and file boundaries

The earlier source-based Q&A notebook category was replaced with Notion (`docs/homepage-presentation.md`). It returns as a separate **NotebookLM** choice; this is the likely forgotten category, not a claim to know the user's intent with certainty. [Google's current help](https://support.google.com/gemininotebook/answer/16215270?hl=en) uses Gemini Notebook, so the familiar name is retained with the current name underneath. The [2026-05-26 Drive-sync announcement](https://workspaceupdates.googleblog.com/2026/05/keep-your-sources-up-to-date-with-automatic-drive-syncing-in-NotebookLM.html) establishes automatic Drive source sync. Do not repeat an outdated universal manual-sync claim.

The fifth choice is scattered Word/PDF/PPT/Markdown files, describing the reader's starting point rather than a format. This is not an import-support claim: Wenlan's current daemon directory source supports Markdown/plain text/text-extractable PDF (`sources/directory.rs:38–47,114–133,162–176,216–245`). Word and PPT require export; scanned PDFs require external OCR. An older dirty app checkout has a separate DOCX parser but does not establish support in the current public source UI.

### Scoped visual change

Use a short takeaway plus one supporting sentence in each centered cell. Shorten the three shared questions; retain Wenlan first and place Obsidian before Notion. Five choices wrap visibly on mobile rather than shrinking into one crowded row. Named-project background is available by hover, keyboard focus, or tap, while complete first-party sources remain in the disclosure. Only that optional help is a small client component; the matrix and all five alternatives remain server rendered. The audience evidence above supports testing these dimensions, not claiming they are everyone's top three priorities.

### Final local verification for this revision

- Working state: the same `codex/task-first-site-sync` clone and base `b6eb76c6be2a58345de178771412ed18dc0d3a65`, with preserved dirty work. English home content hash: `d90eb450c4c5076b71b8331a85eb7760ed1808cd6569f43d3e7458d738db2b18`. Build served at loopback port 3096; no external deployment.
- Captured current renders and measured all five choices in each of English/zh-TW/zh-CN at 393×852 and 1440×1024 CSS viewports: 30 states. No horizontal page overflow; body cells remain 16px; equal row heights across choices within each locale/viewport. Product-name vertical center differences are 0px; selector text horizontal center differences are below 0.004px.
- Mobile inspection caught the help icon displacing product headings. Replaced the separate circular icon with a dotted-underlined product-name button, with a minimum 44px target and shared heading/subtitle tracks. Final screenshots confirm aligned Wenlan/Notion/Obsidian headings.
- Exercised native arrow-key choice changes, keyboard focus opening background help, Escape closure, click opening, outside-click closure, and the selected first-party source disclosure. The 393px help panel stays within the viewport. Pointer-hover opening is implemented but was not separately exercised by the available locator API. Dark/light mode rendered checks passed and the original light theme was restored. Browser error/warning log was empty.
- `pnpm lint`, 33 focused homepage/scenario tests (including comparison protected tokens), production build, `pnpm seo:technical:built`, and `git diff --check` passed. Full i18n remains 78/82: the same four preexisting hero-related failures recorded above. The newly named product/format labels have scoped identifier exceptions, not an exemption for English body copy.
- Durable screenshots/geometry are in the task visualization directory `2026-09-07-comparison-clarity`; earlier screenshots in that directory are audit/intermediate captures, not final-state evidence. Final captures start at `07-final-mobile-notion.jpg`, `08-mobile-*`, `09-desktop-*`, `10-mobile-help.jpg`, and `11-dark-comparison.jpg`.

## Action-level comparison correction (2026-09-07)

### Persistent copy rule

The user correctly identified a repeated communication failure: both columns promised reusable Wiki pages or AI-managed content, while different adjectives implied a distinction that the sentences never explained. Future comparison edits must answer **actor + action + trigger + intervention boundary**. A heading such as "work outcomes with evidence" is not a differentiation claim unless the following sentence explains what the reader does differently.

The three rows now compare daily use, automatic upkeep, and human decisions. Data location and edit ownership remain in concrete cells and product background; this is a clearer expression of reuse/effort/control, not new evidence that these are a statistically proven top-three buyer ranking. Each selected pair has a visible difference summary. Wenlan's wording adapts to the reader's existing tool, but its capabilities and setup requirements must remain invariant across all five choices.

Shared capabilities must be admitted explicitly. Do not create a difference by calling another product manual, incapable of external integration, or research-only without current evidence. Do not claim that Wenlan is easier for a broad audience until comparative usability evidence exists. A reader may reasonably prefer the competitor's workflow.

### Manual-compile hypothesis: contradicted for the named project

Re-read the current [nashsu/llm_wiki README](https://github.com/nashsu/llm_wiki). It documents source-folder auto-watch, automatic ingestion of changed sources and saved answers, and an asynchronous review queue that does not block ingestion. Therefore the named project cannot be described as requiring a manual compile for every update. Karpathy's abstract method is a separate comparison target and is not silently substituted here.

The existing source check of the ingestion path remains relevant: page writes happen before Review items are added. That queue contains suggested research/new-page actions; it is not evidence of a pre-overwrite gate for every human-edited Page. The [MCP README](https://github.com/nashsu/llm_wiki/blob/main/mcp-server/README.md) requires the desktop process to run. On macOS, hiding its window does not quit that process. Wenlan's independent daemon and conditional human-owned-page revision gate are specific differences; automation itself is shared.

### Notion automation: explicitly included

[Custom Agents documentation](https://www.notion.com/help/custom-agents), read 2026-09-07, describes automatic background runs from schedules/events, including knowledge maintenance. Instructions, triggers and access can be set with templates or from scratch; activity and changes can be reviewed and reverted. The page lists Business/Enterprise eligibility. The revised comparison names these capabilities in the visible cells rather than burying them in a generic "person and Agent maintain together" statement.

The supported distinction is **configurable general workspace automation versus Wenlan's built-in source/knowledge-page/ownership maintenance**. It is not proof that Notion cannot implement a similar workflow, lacks safety controls, or requires a human to launch every run. Local storage versus Notion's cloud workspace remains a separate fact, not a claim that Wenlan never sends input to a configured cloud model.

### Current Wenlan automation boundary

One bounded native explorer (Luna/high) inspected clean core HEAD `af646ddcf705ee7450335a8772a8cb196f89a3a1`; no product runtime or performance benchmark was run. The lead re-read the key scheduler/update paths and owns the final wording.

- `crates/wenlan-server/src/scheduler.rs:801–813`: automatic phase allowlist is `ReDistill`, not every compile phase.
- `scheduler.rs:1285–1299`: registered directory sources sync by file changes; model inference is separate and resource-admitted.
- `crates/wenlan-core/src/refinery/mod.rs:1430–1485`: existing stale Pages refresh with an available model; blocked citation checks are not silently treated as success.
- `crates/wenlan-core/src/post_write/page_update.rs:111–194`: human-owned means authored or edited by a person; machine changes stage a revision rather than overwrite prose.
- `crates/wenlan-core/src/post_ingest.rs:188–203`: ambient growth updates matching existing Pages. A new unmatched topic does not imply automatic creation of a new Page.
- Initial source/model setup and first Page creation remain explicit. These conditions are visible above the table. The details explain paused inference/failed checks and the difference between routine maintenance and every possible AI write requiring approval.

Thus "human over the loop" is a useful description of the intended routine-maintenance relationship, not a blanket zero-touch product guarantee. Public copy uses concrete behavior instead of the slogan.

### Other pairs

- Obsidian: writing in one's own vault and choosing AI integrations versus keeping that vault read-only as a source for separately maintained Wenlan Pages. [Plugin documentation](https://obsidian.md/help/community-plugins) establishes extensibility and user-maintained plugin setup, not absence of automation.
- NotebookLM: selecting sources for reading/learning versus saving work conclusions for reuse through connected AI tools. [Current Google help](https://support.google.com/gemininotebook/answer/16215270?hl=en) confirms Drive auto-sync, uploaded copies, source selection, no writeback to Drive, and use of notebooks from Gemini. Do not imply all old generated materials automatically regenerate, or that the notebook cannot be used outside its own app.
- Scattered files: direct upload/file reading remains valid for small stable sets; a user can build automation. Wenlan adds configured source tracking and maintained cited Pages. Word/PPT conversion and scanned-PDF limitations remain in the visible product's background/source disclosure; the tab is not an import-support promise.

### Verification checkpoint

The new semantic regression first failed against the previous English copy because initial source/model/Page setup was not stated visibly. Final integrated check and screenshot results will be appended after all three locales are built. This change is local only; prior dirty work and the `codex/task-first-site-sync` branch are preserved.

### Final action-level revision verification

- Built the integrated working state on base `b6eb76c6be2a58345de178771412ed18dc0d3a65`. English home hash: `bb3eab75d3180ad4d069c48f9472de42b43941c515e08eeba0da40e327da1e8b`; both Mandarin source hashes match. Replaced only the owned loopback preview process; current preview is served from `/private/tmp/wenlan-task-first-site-sync` on port 3096 (owned exec session `2838`). No external deployment or IndexNow submission occurred.
- 34 focused homepage/scenario tests pass, including per-leaf protected identifiers, the new automatic-maintenance conditions, and visible selected-pair summaries. TypeScript lint, production build, built technical SEO, and diff whitespace checks pass. Full i18n remains 78/82 with exactly the four previously recorded unrelated hero failures; no check was weakened to hide them.
- Native browser UI checks cover 30 combinations: EN/zh-TW/zh-CN × five choices × 393px/1440px. The actual viewport matched every requested width. No horizontal or cell overflow; every comparison body is 16px. Product-heading center difference and per-row height drift across choices are both 0px. Exactly one selected difference summary is visible in every state.
- Lead visually inspected all five TW desktop comparisons, TW mobile Notion body/review rows, CN mobile LLM Wiki, EN mobile Notion, and dark mode. Native arrow selection, mobile background explanation, Escape dismissal, and selected source disclosure were exercised. Notion's longer help remains inside the 393px viewport (right edge 377px, bottom 734.75px). Browser warning/error log is empty. The original light theme and default viewport were restored.
- Screenshots and `geometry-30-states.json` are in the task visualization folder `2026-09-07-action-comparison`. Capture 01 is the old state; 02–11 are the new state. A first scroll capture preceded the browser's paint; it was re-observed and replaced with a fully painted capture, not treated as missing product content. The mobile theme control is not present; dark-mode QA used the visible desktop control, then returned to mobile.
- Source research used one bounded explorer (Luna/high); EN/CN localization used one bounded worker (Luna/xhigh). The lead determined comparison scope, checked core source, wrote TW and regression rules, and performed integrated visual QA. No comparative competitor usability, product-runtime benchmark, growth, or conversion improvement is claimed.

## 2026-09-07 — LLM Wiki lifecycle, lineage, and current developments

### Correct the comparison level

Automatic ingest, graphs, MCP, and a review queue do not establish architecture
parity. Conversely, a different internal architecture does not establish better
usability, retention, or output quality. The paired comparison should explain
what the user can preserve and reuse, not reduce Wenlan to an independent daemon
or imply a version-number hierarchy.

Wenlan's explicit model is **Sources + independent Memories -> maintained
Pages**. Decisions, lessons, and corrections have their own provenance and can
carry explicit supersession relationships instead of living only as paragraphs
inside a generated page. Source documents and those records can jointly support
Pages. This is the meaning behind the visible phrase about decisions keeping
their own evidence and history; it is not a promise that every fact is verified
or every contradiction automatically resolved.

Current first-party implementation references were read at core commit
`af646ddcf705ee7450335a8772a8cb196f89a3a1`:

- [Product model](https://github.com/7xuanlu/wenlan/blob/af646ddcf705ee7450335a8772a8cb196f89a3a1/README.md#what-is-this): Sources, Memories, Pages and the declared LLM-wiki lineage.
- [Memory records](https://github.com/7xuanlu/wenlan/blob/af646ddcf705ee7450335a8772a8cb196f89a3a1/crates/wenlan-types/src/memory.rs): independent source IDs, provenance, confidence, stability, supersedes, versions and pending revisions.
- [Page growth](https://github.com/7xuanlu/wenlan/blob/af646ddcf705ee7450335a8772a8cb196f89a3a1/crates/wenlan-core/src/post_ingest.rs): a saved record can enrich a matching existing Page; no match is terminal for that generation, not an automatic new-Page promise.
- [Human-owned Page update gate](https://github.com/7xuanlu/wenlan/blob/af646ddcf705ee7450335a8772a8cb196f89a3a1/crates/wenlan-core/src/post_write/page_update.rs): staged revision rather than immediate replacement.

Keep the already stated setup and availability conditions: initial Pages,
connected sources, a configured and available model, eligible background work,
and human-owned-page review. Confidence/recency calculations are not a factual
truth probability. Do not call automatic conflict arbitration a universal
default. Detailed configuration remains in the source disclosure, not a new
unqualified headline.

### What is recent, and what is only background?

Search window: **2026-08-08 through 2026-09-07**, calculated as the capture date
minus 30 days. English and Chinese queries covered the named implementation,
v2/lifecycle implementations, and explicit v3 discussions. Exa returned 55 result
slots across 11 searches; those are retrieval slots, not 55 independent primary
sources, market-demand observations, or authenticated performance evidence.

| Source | Event date | Evidence and limit |
| --- | --- | --- |
| [nashsu v0.6.9](https://github.com/nashsu/llm_wiki/releases/tag/v0.6.9) | 2026-08-14 | Shipped release; changelog describes per-page vector indexing/MCP and an answer-context evidence panel. Not a v2 parity certification. |
| [nashsu v0.6.10](https://github.com/nashsu/llm_wiki/releases/tag/v0.6.10) | 2026-08-21 | Source filtering, batch/retryable Deep Research, parsing and indexing improvements. |
| [nashsu v0.6.11](https://github.com/nashsu/llm_wiki/releases/tag/v0.6.11) | 2026-08-25 | Latest release found in the inspected release history; configurable ingest reasoning and provider/source-list fixes. No inference that development stopped after this date. |
| [Rohitg00 LLM Wiki v2](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2) | Earlier community proposal; read 2026-09-07 | Extends Karpathy's pattern with memory lifecycle, confidence, supersession, retrieval and automation. Not an official Karpathy version or a compliance standard. |
| [ahumanft LLM Wiki V3](https://gist.github.com/ahumanft/6c96385be6ca4af578cc9b20e0f79e66) | 2026-05-20 | Explicit concept document about segmentation/compartmentalization. Not a recent release, Karpathy publication, or demonstrated category consensus. |
| [obsidian-second-brain](https://github.com/eugeniughelbur/obsidian-second-brain) | README describes July 2026 v0.14; read 2026-09-07 | Adjacent implementation publicly describes scheduled agents, reconciliation and supersession-aware knowledge. These are author claims unless individually tested, and are counterevidence to claiming lifecycle work is exclusive to Wenlan. |
| [ai-wiki staged v2 plan](https://github.com/businessdatasolutions/ai-wiki/blob/main/llm-wiki-v2-plan.md) | Includes a 2026-05-17 update | A plan, not evidence that every proposed stage shipped. It also distinguishes acquiring material from processing it. |

Release details come from the project's
[versioned changelog](https://github.com/nashsu/llm_wiki/blob/main/src/lib/changelog.ts),
not download counts or search snippets. No official Karpathy v2/v3 publication
was found in this bounded search. No Chinese-authored v3 specification was found
in the queried results; neither negative observation proves none exists.

The v3 gist API reports `updated_at=2026-08-12T18:34:19Z`, but its actual
revision history ends at `2026-05-22T15:36:33Z`, revision
`a8dd9e7ca2fd8d5dcbf966b0ca5349d523ff2a92`. Do not present the metadata timestamp
as an August text release. The author explicitly describes the full architecture
as work being pursued rather than something already shipped. Its examples of
separating acquisition, curation, retrieval and lint are design proposals, not
independently measured reliability or token savings.

### Copy guard

Source-level reconciliation at nashsu main
`e8082119649e6a8e1cf85eaf289adcabfdf39d4e` (2026-08-25): its
[Business template](https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/lib/templates.ts#L434)
already defines decision pages with `status` and `supersedes`. Its Research
template also defines confidence on selected page types. These are important
counterexamples to claiming it has no decision lifecycle. The inspected
generation types, templates, project storage, ingest, search and MCP surfaces
did not establish a separate uniform typed atomic-memory store equivalent to
Wenlan's; that bounded finding is not a universal absence claim.

The actual
[Save to Wiki path](https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/components/chat/chat-message.tsx#L553)
writes an answer as a `wiki/queries` page, updates the index/log, and invokes
auto-ingest when a usable ingest model is configured. Earlier shorthand about
"saving answers as sources" must not be read as writing directly to
`raw/sources`. The visible copy now says answers are saved as Wiki pages.

The existing five comparison choices, three shared questions, table geometry,
locale routing, hero and other homepage sections stay intact. The LLM Wiki
comparison names `nashsu/llm_wiki`, acknowledges automatic upkeep and saved
answers, and explains Wenlan's independent decision-record model positively.
The v2 proposal belongs in the expandable lineage/source explanation, not a
claim that the competing project is obsolete v1. No new search URL, metric,
production experiment, indexing request, or external publication is introduced.

### Local verification receipt — lifecycle comparison

Verified `codex/task-first-site-sync` at base HEAD
`b6eb76c6be2a58345de178771412ed18dc0d3a65` plus the preserved working changes.
English home-section source hash:
`c780b66581776b2a14440fddfb3e52db97a29510b047c0741bbc7bea71be1954`;
both Mandarin dictionaries match it. This turn changes only the three locale
dictionaries, the claim regression test, and this evidence document. Comparison
components, CSS and layout tests match the prior verified snapshot byte-for-byte.

- The new lifecycle/lineage regression failed before the copy correction;
  focused home claims/layout/scenario tests now pass 35/35.
- Locale source-hash check, TypeScript lint, production build and built technical
  SEO checks pass. IndexNow was skipped; no production action was performed.
- Isolated light-theme Chromium capture covered English, zh-TW and zh-CN at
  393px and 1440px across all five tabs (30 states), plus the LLM Wiki tooltip
  and expanded sources. No measured horizontal/cell overflow, tab-switch row
  height drift or page errors; tooltip dismissal and source links were exercised.
- Root inline functional and visual passes inspected the same final build and
  all 30 captures. Changed text wraps without clipping; existing centered table
  geometry remains intact. TW image comparison is 2.1% changed pixels at desktop
  with identical dimensions, and 9.12% at mobile with a 2px section-height change;
  hotspots follow changed text and downstream wrapping, not displaced columns.
  Pixel similarity is diagnostic, not the acceptance criterion.
- Full SEO/i18n suites, dark-mode rendering, user comprehension, competitive
  usability and product effectiveness were not re-tested by this bounded change.

Private QA captures, machine-readable checks, before/after pixel diagnostics and
the working-state backup are retained outside the disposable worktree in the
local Codex visualization artifact folder `2026-09-07-lifecycle-comparison`.
The updated local preview is on port 3096; these checks do not prove deployment
or growth.

## 2026-09-07 — Independent tab audit and detail-page routing

The user approved the product-workflow positioning, requested independent checks
of all five alternatives, and asked to move the full explanation behind the
homepage summary. This is local preparation, not publication authority.

Two read-only agents completed separate jobs: a Luna/high first-party fact check
and a Sol/high reader-clarity audit. A Luna/xhigh worker implemented the bounded
server-rendered routing change; the lead owned copy decisions, integration and
browser verification. The reader audit is a heuristic assessment, not a real-user
comprehension, preference, adoption, retention or usability test.

### Findings and applied corrections

- **LLM Wiki:** identify `nashsu/llm_wiki` visibly, not the entire category. Its
  current ingest, folder watching, Review, MCP and templates already include
  automation. The Wenlan first row now starts with saving decisions while using
  connected tools. Neither an AI-native label nor version lineage proves ease
  of use or superiority. Keep the independent-record and human-edited-page review
  distinctions conditional on the documented setup and product behavior.
- **Obsidian:** retaining the original vault and a separate maintained Wiki is
  the clearest comparison. Make Wenlan's setup explicit, and add Obsidian's
  first-party plugin-security documentation to its evidence links.
- **Notion:** both can automate. Distinguish general shared-workspace tasks from
  local knowledge-maintenance work; qualify history/reversal wording rather than
  implying every Agent operation has an unrestricted undo.
- **NotebookLM:** source-based study and later-work knowledge are different jobs.
  Expose eligible Drive synchronization when opening a notebook versus uploaded
  source copies. Do not imply all generated study outputs regenerate on sync.
- **Scattered files:** direct-file automation depends on the selected tool.
  Remove a blanket need-for-another-prompt claim and expose Wenlan's Markdown,
  text, text-extractable PDF, Word/PPT conversion and external-OCR boundaries.

The dated first-party source URLs remain attached to each option in the localized
content dictionaries. Added source: <https://obsidian.md/help/plugin-security>.
The existing nashsu README/ingest/templates/MCP, Notion Agent/Custom Agents,
Obsidian data-storage/plugins, and Google Notebook/Drive-sync references were
checked by the evidence agent. No competitor runtime was exercised.

### One summary, one existing detailed owner

- Homepage retains the native five-option chooser and centered, matched table.
- Each selected **How it works & sources** link now goes to the corresponding
  `#workflow-{id}` section on the same-locale
  `/learn/choose-ai-knowledge-base-tool` owner. No new canonical URL was created.
- The owner now includes initial setup, when to keep the existing approach, when
  to consider Wenlan, maintained-source links, and a shared Wenlan setup/review
  explanation. All English, zh-TW and zh-CN variants are present. The existing
  eight evaluation tests remain intact.
- Publication date remains `2026-08-02`; current modification date becomes
  `2026-09-07`. Historical experiment production/crawl boundaries are unchanged.

### Verification and remaining work

- New copy guard was exercised red before correction. Focused home claims,
  layout and workflow-guide tests: **31/31 pass**. The guide tests are included
  in the standard SEO test command.
- TypeScript lint, production build and built technical SEO pass. Build needed
  network permission for the existing Google Fonts. IndexNow was explicitly
  skipped; no external publication or indexing action occurred.
- Full i18n suite: **78/82 pass**. Four remaining failures concern prior hero
  changes: an exact class-string assertion, two obsolete hero-copy expectations,
  and the protected `Wenlan` token where the Chinese hero uses the localized
  brand. Before-state captures preserve that hero copy. These are not a claim
  that the full branch is merge-ready; they require reconciliation separately.
- Root inspected fresh in-app-browser captures of all five TW desktop tabs,
  TW Obsidian/Notion mobile table rows, EN/TW/CN mobile comparison entries and
  detailed-guide sections. Selected homepage links reached their correct locale
  and option anchors. TW mobile width was 393px; observed body width was 387px.
  EN/CN screenshots were visually checked, but the browser's repeated DOM width
  evaluation timed out; no numeric overflow result is claimed for those pages.
- No dark-theme audit or new real-user test was performed. This check establishes
  local presentation/navigation and bounded evidence, not traffic causality.

Fresh captures and before/after working-state archives are retained outside the
disposable worktree in the local `2026-09-07-workflow-audit` artifact folder.
The verified preview uses `codex/task-first-site-sync` at base
`b6eb76c6be2a58345de178771412ed18dc0d3a65` plus the preserved local edits. No commit,
push, PR, merge, deployment, automation or Goal-definition mutation occurred.

### Everyday-access clarification — 2026-09-07

The first-row correction compares the same everyday access question on both
sides instead of contrasting Wenlan's record structure with a competitor's Wiki
output. Both can build and maintain a Wiki and connect external AI tools.
Wenlan's [runtime README](https://github.com/7xuanlu/wenlan#readme) describes the
same local daemon with an optional desktop interface. The current
[nashsu MCP README](https://github.com/nashsu/llm_wiki/blob/main/mcp-server/README.md)
explicitly requires its desktop App and enabled local API/MCP. Keeping an App
process running is not the same as keeping its window visible. No relative
onboarding-time, performance or usability advantage is inferred from this.

The table now says where each workflow runs; independent decisions,
supersession and human-edited-page revision rules remain in the detailed
explanation and the other rows. The fifth tab becomes `AI + files` in English
and `AI 工具＋文件` in Mandarin: direct AI-assisted file work without maintaining
a separate Wiki, not a universal limitation of AI tools or a new file-import
support claim. Existing format and configuration boundaries remain unchanged.

The correction is localized across all three surfaces. Focused tests remain
31/31, lint/build/built technical SEO pass, and the full i18n suite retains the
same four preexisting hero failures (78/82). In-app-browser verification covers
the TW desktop comparison and renamed-tab interaction, EN/TW/CN 393px first-row
renders, and the TW file-workflow detail link. Observed browser warning/error
logs are empty; screenshots show no clipping in the changed rows. These checks
do not establish user comprehension or acquisition improvement. Current captures
and the changed-file backup are in the task's `2026-09-07-workflow-access`
visualization folder; no publication was performed.

### Beyond folder watching: record lifecycle — 2026-09-07

The upkeep row previously compared unlike levels: Wenlan's Page enrichment
against nashsu's folder watcher. Both have folder watching, and nashsu also has
non-file inputs. This correction compares the trigger and maintained unit,
not who can automate.

Inspected revisions: Wenlan `af646ddcf705ee7450335a8772a8cb196f89a3a1`;
nashsu/llm_wiki `e8082119649e6a8e1cf85eaf289adcabfdf39d4e` (v0.6.11).
The inspected Wenlan core files have no local modifications. Findings come
from source paths and existing test definitions, not a new execution of
either product's lifecycle or a usability benchmark.

| Trigger | Verified implementation |
| --- | --- |
| nashsu: Save to Wiki | User action writes a query page, index and log, then invokes `autoIngest` if an ingest model is usable. [Code](https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/components/chat/chat-message.tsx#L547-L626). |
| nashsu: DeepResearch completes | Writes a cited query page, resolves its linked Review, refreshes the tree, and optionally embeds it. It explicitly does **not** feed that generated page back through source ingest. The README's broader auto-ingest description is not the implementation used for this claim. [Code](https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/lib/deep-research.ts#L505-L545). |
| nashsu: source deletion | Removes caches, removes source-only pages, rewrites source references on shared pages, and cascades deleted-page link cleanup. It does have source/page lifecycle behavior. [Code](https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/lib/source-lifecycle.ts#L457-L574). |
| nashsu: decision status | The Business template includes `status` and `supersedes` in page frontmatter. The inspected paths do not establish a uniform, runtime-enforced atomic-memory acceptance/rebinding state machine. This is not evidence that decision recording or lifecycle behavior is absent. [Template](https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/lib/templates.ts#L471-L485). |
| Wenlan: memory edited or deleted | The write/delete transaction finds dependent Pages via citation edges and legacy references, marks them stale, increments the source revision, and clears prior citation checks. [Invalidation](https://github.com/7xuanlu/wenlan/blob/af646ddcf705ee7450335a8772a8cb196f89a3a1/crates/wenlan-core/src/db.rs#L31034-L31143); edit caller at 32965–33018; delete caller at 30630–30690. |
| Wenlan: replacement revision accepted | The transaction rebinds dependent Pages to the new record and invalidates Pages and affected retrieval projections. [Dependency replacement](https://github.com/7xuanlu/wenlan/blob/af646ddcf705ee7450335a8772a8cb196f89a3a1/crates/wenlan-core/src/db.rs#L32452-L32505); acceptance at 41648–41684. Existing `accept_pending_revision_rebinds_and_invalidates_dependents_atomically` test at `db/main_tests.rs:12899–13056` was read, not rerun. |
| Wenlan: new record or stale Page | Eligible standalone memories can enrich matching existing Pages through `post_ingest`; no match does not promise a new Page. Scheduled re-distill refreshes eligible stale Pages when an authorized model is available. [Refresh slice](https://github.com/7xuanlu/wenlan/blob/af646ddcf705ee7450335a8772a8cb196f89a3a1/crates/wenlan-core/src/refinery/mod.rs#L1590-L1684). |

**Wording boundary:** pending memory revisions depend on agent trust
(`memory_routes.rs:485–495`). The inspected direct/full-trust supersession path
in `db.rs:26258–26279` suppresses its predecessor, but this review did not
establish the same dependent-Page rebinding as accepted pending revisions.
The table therefore says **accepting a replacement revision**, not “every
replacement updates every Page.” No core change is authorized or made here.
Invalidation is not completed regeneration; background model eligibility and
human-edited-page review still apply.

The homepage's second row, same-owner detailed explanation, and an explicitly
illustrative changed-delivery-date example express this difference in all
three locales. Four pinned implementation links accompany the existing
sources. No claim of exclusive automation, universal conflict resolution,
comparative usability or acquisition effect is made.

Verification: the new non-file lifecycle claim guard failed before the copy
correction; focused homepage/layout/guide tests then pass **32/32**. Lint,
Goal verifier, production build and built technical SEO pass. Full i18n remains
**78/82**, with the same four prior hero-contract failures listed above; this
is not a clean-branch or merge-readiness claim. IndexNow was skipped.

Fresh in-app-browser evidence covers the TW desktop table, EN/TW/CN 393px
upkeep rows, and the TW homepage-to-detailed-guide interaction and example.
The inspected screens show no clipping or framework overlay; observed warning
and error logs are empty. A long hover background panel was dismissed before
checking the mobile rows. Dark theme, competitor runtime behavior and real-user
comprehension were not exercised. Captures and a changed-file backup are kept
outside the disposable checkout in `2026-09-07-record-lifecycle` under this
task's visualization artifacts. Preview remains the local
`codex/task-first-site-sync` working state at base
`b6eb76c6be2a58345de178771412ed18dc0d3a65`, not the older checkout or a deployment.

### Files-first reader entry — 2026-09-07

The user chose AI + files as the primary reader entry. This is a positioning
decision, not measured evidence that a majority of visitors use that workflow.
The three locale dictionaries now order the choices as AI + files, nashsu LLM
Wiki, Obsidian, Notion, NotebookLM. The existing native first-radio default
follows the data order; IDs, same-locale owner anchors and source links stay
stable. No new client state, animation or comparison template was added.

The first pair now contrasts direct file work with a maintained, cited knowledge
base: saved decisions and documents reused by connected AI tools, eligible
background Page updates, and review before overwriting human-edited Pages.
The table leads with these actions rather than a list of import restrictions;
Markdown/text/text-extractable PDF, Word/PPT export and external OCR limits remain
in the detailed explanation and existing guide. nashsu's upkeep label explicitly
names sources and Wiki pages as its maintenance unit, without claiming it cannot
represent a decision or perform non-file-triggered work.

Counterevidence is retained: [Claude Code overview](https://code.claude.com/docs/en/overview)
and [memory documentation](https://code.claude.com/docs/en/memory), read on
2026-09-07, describe file editing, configurable automation and persistent auto
memory. Therefore this is not a claim that AI file tools always forget, cannot
share files, or lack automation. The compared workflow explicitly does not
maintain a separate Wiki; tools can be extended to do so. No market-share,
conversion, retention or causal growth claim follows from moving the tab.

Verification: **34/34** focused homepage/layout/guide tests pass, along with
lint, Goal verifier, build and built technical SEO. Full i18n remains **78/82**
with the same four preexisting hero-contract failures. A before/current row-ID
comparison confirms that only AI + files and nashsu copy changed; Obsidian,
Notion and NotebookLM content is unchanged apart from position.

The in-app browser confirms the default checked radio and all five options in
the requested order in EN/TW/CN. Root inspected TW desktop and three-locale
393px renders, switched between files and LLM Wiki, and followed the files link
to its exact same-locale owner anchor. Inspected copy is centered without
clipping or a framework overlay; observed warning/error logs are empty.
No dark-theme or real-user comprehension test was performed. Current captures
and changed-file archive are in the external `2026-09-07-files-first` artifact
folder. No commit, push, PR, merge, deployment or indexing was performed.

## Native AI file capabilities versus an implemented knowledge system — 2026-09-07

The AI + files pair now names the missing layer instead of saying outcomes
merely depend on settings. This is a workflow comparison before adding a
Wiki-maintenance system, not a universal negative claim about every AI product.
The Wenlan lead is “An AI knowledge base with upkeep built in”; its previously
accepted first-cell explanation remains unchanged. The LLM Wiki, Obsidian,
Notion and NotebookLM objects remain unchanged.

The [Claude Code memory documentation](https://code.claude.com/docs/en/memory)
and [hooks guide](https://code.claude.com/docs/en/hooks-guide), re-read on
2026-09-07, distinguish remembered instructions from executed controls and
describe user-defined automation. The inference is limited: file access,
persistent notes and automation entry points do not themselves implement a
source-to-page dependency and maintenance system. Such a system can be built
with extensions or code; this is not a claim that native tools cannot produce
Wiki pages, remember facts, or automate work.

Wenlan's supplied layer is backed by the pinned source, not ease-of-use or
traffic measurements:

- [Dependent-page invalidation](https://github.com/7xuanlu/wenlan/blob/af646ddcf705ee7450335a8772a8cb196f89a3a1/crates/wenlan-core/src/db.rs#L31034-L31143)
  uses recorded source relationships to mark affected pages stale.
- [Background refresh selection](https://github.com/7xuanlu/wenlan/blob/af646ddcf705ee7450335a8772a8cb196f89a3a1/crates/wenlan-core/src/refinery/mod.rs#L1604-L1635)
  requires an available model and selects eligible stale pages.
- The previously traced human-owned-page revision path remains the review
  boundary, not a guarantee that every generated assertion is correct.

The detailed files-workflow choice uses a changed-specification example to
explain why source-linked page upkeep is different from reading the latest
file on the next question. Supported-source, model-availability and new-topic
boundaries remain visible in its supporting explanation. No performance,
adoption, setup-time or causal growth claim is introduced.

Verification for this correction: **35/35** focused homepage/layout/guide tests,
TypeScript lint, Goal verifier, production build and built technical SEO pass.
The same four preexisting hero-related i18n checks remain failing (**78/82**).
A before/after comparison confirms that only `wiki-graveyard` changed in each
locale and the accepted Wenlan first-cell descriptions are byte-identical.
Root inspected the TW desktop table and three-locale 393px mobile copy,
including English and TW lower rows; tabs still switch and the TW detail link
opens its exact localized owner anchor with the revised example. The CJK
heading was shortened after rendered QA to keep the word for “update” intact.
No client/component/CSS change was needed. Observed browser warning/error logs
were empty; no real-user comprehension or conversion test is implied.
Current screenshots and the changed-file archive are stored outside the
worktree in `2026-09-07-native-files-upkeep`. This remains local preparation,
with no commit, push, PR, merge, deployment or indexing action.
