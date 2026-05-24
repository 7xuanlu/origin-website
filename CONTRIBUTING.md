# Contributing to origin-website

This is the marketing + docs site for [Origin](https://github.com/7xuanlu/origin). Source lives at [github.com/7xuanlu/origin-website](https://github.com/7xuanlu/origin-website). Production at [useorigin.app](https://useorigin.app).

## Reporting issues

- Site bugs or content errors: open a GitHub issue with the URL of the affected page and what you saw vs what you expected.
- Security issues: see `.well-known/security.txt` or [SECURITY.md](./SECURITY.md). Do not file public issues for vulnerabilities.

## Editing content

The two files most contributors will touch:

- `src/app/learn/articles.ts` — Learn articles
- `src/app/docs/docs.ts` — Doc pages

Each entry's `updatedAt` field drives the sitemap `lastmod` signal and is shown to readers + AI crawlers as the freshness signal. Bump the date when you make a substantive edit.

## Style guidelines

These are conventions the existing copy follows. Keep new content in the same voice:

- No em-dashes. Use period, comma, colon, or restructure. Em-dashes read as AI-generated.
- No slop words: delve, leverage, robust, seamless, tapestry, moreover, furthermore, in the realm of, ultimately, in conclusion.
- First-person solo-dev voice when natural ("I picked X because Y").
- Concrete protocols over adjectives. "10-second inspectability test" beats "highly inspectable."
- Numbers + filenames + commands beat descriptions of them.
- Honest concessions when behind on a benchmark. The Superlocal Memory comparison page leads with the 7.8-point LoCoMo gap.

## Develop

```bash
pnpm install
pnpm dev
```

Then http://localhost:3000.

## Build

```bash
pnpm build
```

Postbuild runs `scripts/indexnow-ping.mjs` which only fires when `VERCEL_ENV=production`. Local builds skip the IndexNow ping.

For local IndexNow testing without hitting the real API:

```bash
INDEXNOW_FORCE=1 INDEXNOW_DRY_RUN=1 node scripts/indexnow-ping.mjs
```

## Pull requests

- One concern per PR. Keep them small.
- Conventional commit prefix in the PR title: `fix`, `feat`, `docs`, `chore`, `refactor`. The squash-merge commit on main inherits the PR title.
- Test plan section in the PR body listing what you verified.
- Vercel auto-builds a preview on every PR. Check the preview URL renders correctly before requesting review.

## License

By contributing you agree your contribution will be licensed under the MIT License (see [LICENSE](./LICENSE)).
