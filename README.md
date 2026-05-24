# origin-website

Marketing + docs site for [Origin](https://github.com/7xuanlu/origin), a local-first memory layer for AI work.

Production: [useorigin.app](https://useorigin.app).

## Stack

Next.js 16 (App Router) on Vercel. Tailwind 4. TypeScript. JSON-LD schema everywhere. IndexNow auto-ping on every production deploy.

## Develop

```bash
pnpm install
pnpm dev
```

Default dev URL: http://localhost:3000.

## Build + ship

```bash
pnpm build           # Next.js production build + postbuild IndexNow ping
pnpm start           # serve the production build locally
```

Vercel deploys main automatically. Preview deploys fire on every PR.

## SEO surfaces

The site ships the following AI-discovery + SEO surfaces:

- `/llms.txt` and `/llms-full.txt` per [llmstxt.org](https://llmstxt.org/) spec
- `/feed.xml` RSS 2.0 for `/learn` articles
- `/sitemap.xml` with per-URL images and accurate `lastmod`
- `/robots.txt` allowing 20+ AI crawler user agents
- `/.well-known/security.txt` per RFC 9116
- `/manifest.webmanifest` PWA manifest
- `/humans.txt`
- Per-page JSON-LD: Article + TechArticle + SoftwareApplication + Organization + Person + WebSite + CollectionPage + FAQPage + HowTo + VideoObject + BreadcrumbList + SiteNavigationElement
- Dynamic per-page OG images via `next/og` (Learn articles, Doc pages, About, Get started, section indices)
- IndexNow auto-ping on every production deploy reaching Bing, Yandex, Seznam, Naver, Yep, Internet Archive, Amazon Bot

## Layout

```
src/app/
  page.tsx                       Homepage
  layout.tsx                     Root layout (head, JSON-LD, footer, fonts)
  about/                         /about
  docs/                          /docs index + slug pages + get-started
  learn/                         /learn index + slug pages + articles.ts data
  feed.xml/route.ts              RSS feed
  llms-full.txt/route.ts         Long-form llms.txt
  sitemap.ts                     Sitemap (Next MetadataRoute)
  robots.ts                      robots.txt (Next MetadataRoute)
src/components/
  site-footer.tsx                Sitewide footer rendered in root layout
  sections.tsx                   Homepage FAQ + section components
  problem-solution.tsx           Homepage problem/solution sections
scripts/
  indexnow-ping.mjs              Postbuild IndexNow submitter (Vercel production only)
public/
  09521e19ffdcca3d68daffa830e64611.txt  IndexNow ownership key
  manifest.webmanifest
  humans.txt
  llms.txt
  .well-known/security.txt
```

## Content updates

Learn articles live in `src/app/learn/articles.ts`. Each entry's `updatedAt` drives the sitemap `lastmod` and is shown to readers + AI crawlers as the freshness signal. Bump the date when you edit substantively.

Doc pages live in `src/app/docs/docs.ts` under the `docPages` array. Same `updatedAt` semantics.

## License

This website source is MIT. The Origin product (daemon, CLI, MCP server) is Apache-2.0 in [7xuanlu/origin](https://github.com/7xuanlu/origin).

## Author

Built by [Qi-Xuan Lu](https://github.com/7xuanlu).
