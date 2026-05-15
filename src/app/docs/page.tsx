import type { Metadata } from "next";
import Link from "next/link";
import { ArticleHalo } from "../learn/article-visuals";
import { SITE_URL } from "../learn/articles";
import { docPages, docUrl, formatDocDate } from "./docs";

export const metadata: Metadata = {
  title: "Origin Docs | Product Manual",
  description:
    "Install Origin, learn the daily AI work memory loop, connect MCP clients, and understand local-first data control.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Origin Docs | Product Manual",
    description:
      "Install Origin, learn the daily AI work memory loop, connect MCP clients, and understand local-first data control.",
    type: "website",
    url: `${SITE_URL}/docs`,
    siteName: "Origin",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Origin Docs | Product Manual",
    description:
      "Install Origin, learn the daily AI work memory loop, connect MCP clients, and understand local-first data control.",
    images: ["/og.png"],
  },
};

const docsSections = [
  {
    title: "Start here",
    description: "Install Origin and verify the first memory round trip.",
    items: [
      {
        href: "/docs/get-started",
        label: "Setup",
        title: "Get started with Origin",
        description:
          "Install the Claude Code plugin or run Origin setup for another MCP client, then confirm the local memory loop works.",
        meta: "Origin team · Updated May 15, 2026 · 4 min setup",
      },
    ],
  },
  {
    title: "After setup",
    description:
      "Turn the install into a working habit: start warm, capture decisions, and hand off before context goes cold.",
    items: docPages
      .filter((page) => page.group === "After setup")
      .map((page) => ({
        href: `/docs/${page.slug}`,
        label: page.eyebrow,
        title: page.title,
        description: page.description,
        meta: `${page.author} · Updated ${formatDocDate(page.updatedAt)} · ${page.readingTime}`,
      })),
  },
  {
    title: "Reference",
    description:
      "Commands, local data, MCP clients, and the repair paths people need once Origin is in daily use.",
    items: docPages
      .filter((page) => page.group === "Reference")
      .map((page) => ({
        href: `/docs/${page.slug}`,
        label: page.eyebrow,
        title: page.title,
        description: page.description,
        meta: `${page.author} · Updated ${formatDocDate(page.updatedAt)} · ${page.readingTime}`,
      })),
  },
];

export default function DocsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Docs",
        item: `${SITE_URL}/docs`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Origin Docs",
    description:
      "Product documentation for Origin, a local-first memory layer for AI work.",
    url: `${SITE_URL}/docs`,
    hasPart: [
      {
        "@type": "WebPage",
        name: "Get started with Origin",
        url: `${SITE_URL}/docs/get-started`,
      },
      ...docPages.map((page) => ({
        "@type": "TechArticle",
        name: page.title,
        url: docUrl(page.slug),
      })),
    ],
  };

  return (
    <main className="grain min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <section className="relative border-b border-[var(--o-border-subtle)] px-6 py-24 sm:py-32">
        <ArticleHalo />
        <div className="relative z-10 mx-auto max-w-5xl">
          <Link
            href="/"
            className="font-mono text-xs text-[var(--o-text-muted)] transition-colors hover:text-[var(--o-text-secondary)]"
          >
            Origin
          </Link>
          <div className="mt-12 max-w-3xl">
            <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
              Docs
            </p>
            <h1 className="warm-glow max-w-[11ch] font-serif text-[2rem] leading-[1.08] font-medium tracking-tight sm:max-w-none sm:text-7xl sm:leading-[1.05]">
              Start using Origin.
            </h1>
            <p className="mt-8 max-w-[20rem] text-lg leading-relaxed text-[var(--o-text-secondary)] sm:max-w-2xl">
              Install the local memory layer, learn the daily handoff loop, and
              keep AI work context readable, searchable, and under your control.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="border-y border-[var(--o-border-subtle)] py-6">
            <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)]/80 uppercase">
              Start here
            </p>
            <p className="mt-3 max-w-[20rem] text-sm leading-relaxed text-[var(--o-text-secondary)] sm:max-w-2xl">
              New users should install first, run setup for their client, then
              read the daily workflow and core concepts before reaching for the
              reference docs.
            </p>
          </div>

          <div className="mt-14 space-y-16">
            {docsSections.map((section) => (
              <section key={section.title}>
                <div className="mb-6 border-b border-[var(--o-border-subtle)] pb-4">
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                    {section.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--o-text-muted)]">
                    {section.description}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="card-origin group relative overflow-hidden rounded-xl p-7 transition-transform duration-150 hover:-translate-y-1"
                    >
                      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full border border-[var(--o-border-subtle)] opacity-50 transition-transform duration-300 group-hover:scale-110" />
                      <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)]/80 uppercase">
                        {item.label}
                      </p>
                      <h3 className="mt-6 font-serif text-2xl font-medium tracking-tight text-[var(--o-text)]">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-[var(--o-text-muted)]">
                        {item.description}
                      </p>
                      <div className="mt-6 border-t border-[var(--o-border-subtle)] pt-5">
                        <p className="font-mono text-[10px] text-[var(--o-text-muted)]">
                          {item.meta}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-20 rounded-2xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-8 text-center">
            <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/70 uppercase">
              Already installed?
            </p>
            <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
              Make the memory loop habitual.
            </h2>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[var(--o-text-secondary)]">
              Start with the daily workflow, then use the reference docs when
              you need commands, MCP setup, or repair steps.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/docs/daily-workflow"
                className="rounded-xl bg-[var(--o-text)] px-6 py-3 text-sm font-semibold text-[var(--o-bg)] transition-all duration-150 hover:opacity-90"
              >
                Daily workflow
              </Link>
              <a
                href="https://github.com/7xuanlu/origin"
                className="rounded-xl border border-[var(--o-border)] px-6 py-3 text-sm font-medium text-[var(--o-text-secondary)] transition-all duration-150 hover:border-[var(--o-text-dim)] hover:text-[var(--o-text)]"
              >
                GitHub
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
