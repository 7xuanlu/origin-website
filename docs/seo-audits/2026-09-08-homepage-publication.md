# Task-first homepage publication

## Authorization and scope

The user approved shrinking the language dropdown and merging the complete
`codex/task-first-site-sync` branch on September 7, 2026 (America/Los_Angeles).
This publishes the previously reviewed English, zh-TW and zh-CN homepage
reorganization, source-backed workflow comparison and existing LLM-wiki and
tool-selection guide updates. It creates no new search URL.

The final dropdown uses a 144px menu rather than 176px and 36px desktop rows
rather than 44px; coarse-pointer devices retain 44px minimum targets. Native
language links, keyboard Escape, outside-click dismissal and focus return remain.

GitHub main `de0c22a09cc1712ecf2a2b61d6818e4f341b98c0` was integrated before
publication. Its detected-platform onboarding and shared card/button changes
were retained. Both branches' download tests were preserved in the one conflict.

The release check found that GitHub's latest stable release is v0.18.3, published
`2026-09-08T00:52:58Z`, not the previously pinned v0.18.0. Download URLs, six
asset sizes, localized current-version copy, source links, changelog highlights
and machine-readable app-source links were synchronized. Historical highlights
remain historical. Source evidence: the v0.18.3 GitHub release and tagged
CHANGELOG / security policy; no new capability is inferred from a version number.

Independent review corrections: update the canonical security response to
48-hour acknowledgment and a seven-day fix timeline; remove four superseded
captures from public serving while preserving local originals; synchronize the
active checkpoint with completed graph capture; update exact release guards.
The three public product captures remain hashed in the provenance manifest.

## Verification

Before publication: integrated SEO tests (342), i18n tests (83), Goal tests (57),
TypeScript, production build, technical built checks and live release-asset
verification. Final rerun receipts and publication outcome are appended below;
an earlier passing state is not presented as proof of a later code change.

Rendered checks cover the compact menu, English / zh-TW / zh-CN navigation,
Escape and outside-click dismissal, 393px mobile and 1440px desktop layout,
comparison columns and product-view tabs. Earlier full-section screenshots are
retained alongside the current merge-proof captures. They are UI observations,
not user preference tests or acquisition evidence.

## Attribution boundary

This is explicitly approved UX and factual repair, not a new demand experiment
and not a claim that the SEO 20/3/28 rewrite gate passed. Preserve all historical
cohort baselines and readout thresholds. Once production is verified, observations
after that deployment boundary must not be attributed to the superseded homepage,
LLM-wiki guide or tool-selection comparison copy. No indexing, validation,
analytics mutation, paid acquisition or external promotion is authorized here.

## Published result

- PR: https://github.com/7xuanlu/wenlan-site/pull/179
- Verified branch: `546c8abcaad1845aadbe8d6cbac3f9b1dd2332bb`.
- Merged main: `73fe491ee307952bd999243ac5de2fac633ea54e`.
- Merge time: `2026-09-08T06:25:31Z`.
- Vercel reported successful deployment at `2026-09-08T06:26:22Z` via the
  merged commit's GitHub status. Use this conservative observed-success time
  as the new UI attribution boundary, not as a Google crawl timestamp.
- Production locale verification: 39 expected direct-200 routes and four
  unsupported direct-404 routes passed.
- Production selection-guide schema is `datePublished: 2026-08-02`,
  `dateModified: 2026-09-07` in all three locales, exactly matching source.
  The first deployed technical audit failed because its three fixed expected
  modification dates still read August 2. Only those expectations are corrected
  in the verification follow-up; production page dates are not rolled back.
- Final local tests passed: SEO 342, i18n 83, Goal 57 (482 total), TypeScript,
  production build, built SEO, local route checks and public release check.
- All four independent-review findings were resolved. The closure's inventory
  guard correction explicitly retains the existing Learn fixture; the full
  suite passed after that correction.

The follow-up changes only technical-check expectations and this receipt.
It does not change the deployed UI or move the UI attribution boundary.

The corrected production audit passed: robots, 168 sitemap URLs, 30 key pages,
six utility noindex surfaces, FAQPage absence across all 168 sitemap pages,
25 redirects, six bridge-host redirects, and old-URL exclusion. No page or
schema change was needed; built and deployed test fixtures now share the
published selection-guide dates.
