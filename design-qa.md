# Workflow comparison — visual QA

Date: 2026-09-07. Scope: `#knowledge-workflows` only, not a new whole-homepage audit.

## State verified

- Clone: `/private/tmp/wenlan-task-first-site-sync`, branch `codex/task-first-site-sync`.
- Base HEAD: `b6eb76c6be2a58345de178771412ed18dc0d3a65`, with preserved existing working changes.
- Changed-scope fingerprint: `f7e016b8198f25aaa155cf8fc774d74b48dbf43176b80a759075171ae83e2a7c` (SHA-256 of ordered filenames plus contents: pains.tsx, workflow-comparison.css, globals.css, schema.ts, en.ts, zh-TW.ts, zh-CN.ts, protected-tokens.ts, home-layout.test.mjs, home-claims.test.mjs, homepage-workflow-comparison-evidence.md).
- Local production preview: `http://127.0.0.1:3096/zh-TW?preview=workflow-research#knowledge-workflows`. No commit, push, PR, merge, deployment or indexing action.

## Visual truth and capture

- Selected reference: `/Users/lucian/.codex/generated_images/019f70d0-90c0-72e0-a213-32f69be1c6c2/exec-8fd8529f-ab5f-4d11-97ac-c00b6c803d5a.png` (1488 × 1056 raster; generated for a 1440 × 1024 desktop target).
- Evidence directory: `/Users/lucian/.codex/visualizations/2026/07/17/019f70d0-90c0-72e0-a213-32f69be1c6c2/2026-09-07-researched-comparison/`.
- Final desktop: `zh-TW-desktop.png`; browser CSS viewport 1440 × 1024, DPR 1, captured raster 1434 × 1020. Browser capture excludes a small edge area. Reference and implementation were emitted together in the same comparison input; compare proportions after width normalization, not literal pixels.
- Mobile: `zh-TW-mobile.png`, `zh-CN-mobile.png`, `en-mobile.png`; actual measured CSS width 393, DPR 1, final zh-TW raster 387 × 1379. Initial phone check used height 852; full-section checks used height 1400 to make all rows inspectable without shrinking the content. Native full-page-plus-clip capture produced a scaled image and was rejected, then replaced with a normal viewport capture.
- Additional views: `zh-CN-desktop.png`, `en-desktop.png`, `notion-desktop.png`, `dark-desktop.png`. Some alternative-state desktop screenshots are scroll-positioned around the comparison, not at its heading.
- States: default self-built LLM Wiki; click Notion; keyboard ArrowRight to Obsidian then Markdown; native source disclosure open; light and dark theme.

## Comparison findings and fixes

1. First desktop pass: answer text and the question rail were undersized relative to the chosen visual. Enlarged answer text to 20px desktop, question rail to 17px, Wenlan heading to 40px, and selector to 18px. Kept the site's existing 1152px content grid rather than widening this one section beyond its neighbors.
2. First mobile pass: highlighted CJK phrases could break internally; keeping a phrase together could then strand its following comma. The final renderer keeps the highlighted phrase and immediate punctuation in one inline unit. Recaptured both Mandarin locales and English after the correction.
3. The old cards, repeated per-card labels and oversized closing slogan are not rendered. Three criteria now align directly across two workflow columns. The existing detailed copy is retained in the source disclosure.
4. Mobile moves the question above each pair of answers. No horizontal page overflow was observed at 393px. All three question/answer rows and the source entry remain visible in the full-section captures.
5. The comparison is keyboard-operable with native radio controls, with one visible panel at a time. All panels are server-rendered; no comparison-specific client JavaScript, timed switching or animation was added. Source disclosure opens in document flow without clipping.
6. Preserved site typography and theme tokens. Chinese remains sans-serif, with the existing Latin brand face. No fake product assets or new image assets are involved.

## Verification

- `pnpm lint`: passed.
- Homepage/scenario focused tests: 31/31 passed. Added assertions first and observed the expected failures before implementation.
- `pnpm build`: passed. IndexNow postbuild explicitly skipped because this is not production.
- `pnpm seo:technical:built`: passed (redirects, noindex, robots, 168 sitemap locations, 24 selected HTML pages; no FAQPage in 172 HTML outputs).
- `git diff --check`: passed.
- Browser captured error/warning log: empty on the final preview.
- Full i18n suite: 78/82 passed. Four pre-existing hero-contract mismatches remain: exact container-class regex, old continuation headline, old agent-description phrasing, and Wenlan/文瀾 protected-token wording. No additional comparison failures remain. These unrelated hero tests were not weakened or silently changed.

## Remaining limitations

- Documentation and source code were inspected, not all competitor applications exercised.
- No inference that this layout improves SEO, clicks or conversion without subsequent measurement.
- The chosen visual is adapted to the existing site's width and heading system, not a standalone pixel-for-pixel clone; core layout, emphasis and reading sequence are preserved.

Final result: passed

## Follow-up correction: comparison typography and switching (2026-09-07)

The previous verdict did not catch the user's legitimate size/alignment issue. This follow-up supersedes it for the comparison component only. The existing branch and unrelated homepage work are preserved.

Reference: the current homepage's adjacent 16px body text and the user-selected fixed-Wenlan/selectable-alternative layout, not a new template. Design-taste settings: variance 3, motion 1, density 5; preserve Wenlan typography, semantic colors and section hierarchy. The skill is design guidance, not an installed template gallery.

Pass A, design-system / functional integrity: APPROVE for this bounded correction. Removed 20px comparison body and unequal 40/32px product headings; now 16px body and matching 24px desktop headings. One semantic table retains the Wenlan column and shared row sizing; native radio selection still works by keyboard. Inactive alternate content uses visibility:hidden so hidden source links cannot receive focus. No new runtime dependency or animation. Source disclosure opens in normal flow and selects the correct alternative.

Pass B, visual / responsive: APPROVE for this bounded correction. Captured 24 states: English, zh-TW, zh-CN; four choices each; 1440px desktop and exact 393px mobile. All six locale/viewport groups have identical selector horizontal geometry and row heights across choices (tolerance 0.01px); no document horizontal overflow. Inspected representative final desktop/mobile images, including the lower rows and source disclosure. English emphasis now flows inline rather than forcing phrase-wide blocks; CJK emphasis keeps short phrases together.

Artifacts: `2026-09-07-comparison-alignment-fix/` in this task's durable visualization folder contains the 24 native screenshots, `geometry.json`, and a backup of changed source files. Screenshot bytes are the browser's native JPEG output even when paths retain a `.png` suffix. Two copies were losslessly decoded to PNG for the required image-diff helper: dimensions match, alphaChannelIntact true, similarity 93/100, diffRatio 0.0684. This cross-choice full-viewport comparison includes intentionally different text and neighboring reveal states; it is not an exact-reference score or the alignment verdict. DOM geometry and inline visual review establish alignment.

Final checks: lint PASS; 31/31 focused homepage/scenario tests PASS; build PASS; built technical SEO PASS; diff whitespace PASS. The stale-build guard correctly rejected the intermediate build after the English edit; rebuilding resolved it. Full i18n remains 78/82 with the same four pre-existing hero/protected-token contract mismatches. Lighthouse was not run; no page-performance or conversion improvement is claimed. No push, deployment or indexing request.

Verified base HEAD: `b6eb76c6be2a58345de178771412ed18dc0d3a65`, dirty `codex/task-first-site-sync` checkout. Final component SHA-256 `85d846b1691317a275acd3df8599604baf419e25ba3ff0b17db0de1b7179b086`; stylesheet SHA-256 `7b9ae5f371386823504128cac75dfabf7f05cebd64c0e6472d741080eeeb3b71`; English home unit hash `7aa5a7d3286645a07bcb6ba9f0c4b97628f541afa0447e0c74b334a8df7d6a05`.
