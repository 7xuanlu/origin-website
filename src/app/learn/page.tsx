import type { Metadata } from "next";
import Link from "next/link";
import {
  articleCategories,
  articles,
  articleUrl,
  formatArticleDate,
  SITE_URL,
} from "./articles";
import { ArticleHalo, MemoryIndex } from "./article-visuals";

export const metadata: Metadata = {
  title: "Learn | Origin",
  description:
    "Articles on AI work memory, MCP memory servers, local-first AI memory, Claude Code memory, and Origin comparisons.",
  alternates: {
    canonical: "/learn",
  },
  openGraph: {
    title: "Learn | Origin",
    description:
      "Articles on AI work memory, MCP memory servers, local-first AI memory, Claude Code memory, and Origin comparisons.",
    type: "website",
    url: `${SITE_URL}/learn`,
    siteName: "Origin",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn | Origin",
    description:
      "Articles on AI work memory, MCP memory servers, local-first AI memory, Claude Code memory, and Origin comparisons.",
    images: ["/og.png"],
  },
};

export default function LearnPage() {
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
        name: "Learn",
        item: `${SITE_URL}/learn`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Origin Learn",
    description:
      "Articles about AI work memory, MCP memory servers, local-first AI memory, Claude Code persistent context, and Origin comparisons.",
    url: `${SITE_URL}/learn`,
    mainEntity: articles.map((article) => ({
      "@type": "Article",
      headline: article.title,
      description: article.description,
      url: articleUrl(article.slug),
      author: {
        "@id": "https://useorigin.app/#organization",
      },
    })),
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
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
                Learn
              </p>
              <h1 className="warm-glow font-serif text-5xl leading-[1.05] font-medium tracking-tight sm:text-7xl">
                Before you add AI memory.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--o-text-secondary)]">
                Origin makes AI work compound across Claude Code, Cursor,
                Codex, and other MCP-compatible tools. Memory is one mechanism;
                durable work context is the goal.
              </p>
            </div>
            <MemoryIndex
              label="Learn topics"
              items={[
                "AI work memory",
                "Named comparisons",
                "Developer workflows",
                "Local-first control",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="py-2">
            <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)]/80 uppercase">
              Start here
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--o-text-secondary)]">
              New to AI work memory? Read the concept pieces first, then use
              the comparison articles to decide whether Origin fits your workflow.
            </p>
          </div>

          <div className="mt-14 space-y-16">
            {articleCategories.map((category) => {
              const categoryArticles = articles.filter(
                (article) => article.category === category,
              );

              return (
                <section key={category}>
                  <div className="mb-6 flex items-end justify-between gap-4">
                    <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                      {category}
                    </h2>
                    <p className="font-mono text-[11px] text-[var(--o-text-dim)]">
                      {categoryArticles.length} articles
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {categoryArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/learn/${article.slug}`}
                        scroll
                        className="card-origin group relative overflow-hidden rounded-xl p-7 transition-transform duration-150 hover:-translate-y-1"
                      >
                        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full border border-[var(--o-border-subtle)] opacity-50 transition-transform duration-300 group-hover:scale-110" />
                        <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)]/80 uppercase">
                          {article.eyebrow}
                        </p>
                        <h3 className="mt-6 font-serif text-2xl font-medium tracking-tight text-[var(--o-text)]">
                          {article.title}
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-[var(--o-text-muted)]">
                          {article.description}
                        </p>
                        <div className="mt-6 border-t border-[var(--o-border-subtle)] pt-5">
                          <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] text-[var(--o-text-muted)]">
                            <span>{article.author}</span>
                            <span>{formatArticleDate(article.updatedAt)}</span>
                            <span>{article.readingTime}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--o-border-subtle)] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/70 uppercase">
            Ready to try the local memory loop?
          </p>
          <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
            Make AI work carry forward.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[var(--o-text-secondary)] sm:text-lg">
            Install Origin, connect your AI tools, and verify the first memory
            loop locally.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/docs/get-started"
              className="rounded-xl bg-[var(--o-text)] px-6 py-3 text-sm font-semibold text-[var(--o-bg)] transition-all duration-150 hover:opacity-90"
            >
              Get started
            </Link>
            <a
              href="https://github.com/7xuanlu/origin"
              className="rounded-xl border border-[var(--o-border)] px-6 py-3 text-sm font-medium text-[var(--o-text-secondary)] transition-all duration-150 hover:border-[var(--o-text-dim)] hover:text-[var(--o-text)]"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
