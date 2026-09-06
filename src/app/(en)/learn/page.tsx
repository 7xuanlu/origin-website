import type { Metadata } from "next";
import Link from "next/link";
import { TrackedLink, type AnalyticsContext } from "@/components/tracked-link";
import {
  articleCategories,
  articles,
  articleUrl,
  formatArticleDate,
  SITE_URL,
} from "./articles";
import { ArticleHalo, MemoryIndex } from "./article-visuals";
import { alternateUrls } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "LLM Wiki & AI Knowledge Base Guides | Wenlan",
  description:
    "Build a source-backed AI knowledge base with maintained LLM wiki pages, citations, review, refresh state, and local workflows for AI agents.",
  alternates: {
    canonical: "/learn",
    languages: alternateUrls("/learn"),
  },
  openGraph: {
    title: "LLM Wiki & AI Knowledge Base Guides | Wenlan",
    description:
      "Build a source-backed AI knowledge base with maintained LLM wiki pages, citations, review, refresh state, and local workflows for AI agents.",
    type: "website",
    url: `${SITE_URL}/learn`,
    siteName: "Wenlan",
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Wiki & AI Knowledge Base Guides | Wenlan",
    description:
      "Build a source-backed AI knowledge base with maintained LLM wiki pages, citations, review, refresh state, and local workflows for AI agents.",
  },
};

const searchRoutes = [
  {
    query: "Choose an AI knowledge base tool",
    intent: "Compare document upload, RAG, note access, and maintained agent knowledge with eight repeatable tests.",
    href: "/learn/choose-ai-knowledge-base-tool",
    context: "workflows",
  },
  {
    query: "Build a local AI knowledge base",
    intent: "Turn Markdown, text files, text PDFs, or an Obsidian vault into a source-backed knowledge workflow.",
    href: "/learn/build-local-ai-knowledge-base-from-documents",
    context: "workflows",
  },
  {
    query: "AI knowledge base for agents",
    intent: "Build maintained pages with sources, review, refresh state, and a verifiable local workflow.",
    href: "/learn/source-backed-wiki-pages-ai-work",
    context: "concepts",
  },
  {
    query: "Claude Code memory",
    intent: "See what native CLAUDE.md and auto memory cover, then decide when shared local context helps.",
    href: "/learn/claude-code-memory",
    context: "workflows",
  },
  {
    query: "Basic Memory comparison",
    intent: "Compare Wenlan and Basic Memory on provenance, local retrieval, shared clients, and wiki pages.",
    href: "/learn/wenlan-vs-basic-memory",
    context: "comparisons",
  },
  {
    query: "MCP memory server",
    intent: "Connect Claude Code, Codex, Cursor, ChatGPT, and other MCP clients to Wenlan.",
    href: "/learn/mcp-memory-server",
    context: "concepts",
  },
  {
    query: "Karpathy LLM wiki for AI agents",
    intent: "Turn trusted sources and durable work context into a maintained AI knowledge base with inspectable support.",
    href: "/learn/distilled-wiki-pages-ai-memory",
    context: "concepts",
  },
  {
    query: "Cursor memory MCP",
    intent: "Wire Cursor to Wenlan's local MCP memory server and verify recall.",
    href: "/learn/how-to-add-mcp-memory-to-cursor",
    context: "workflows",
  },
  {
    query: "AI work memory vs knowledge base",
    intent: "Separate reusable decisions and handoffs from the source-backed pages they maintain.",
    href: "/learn/ai-work-memory-vs-knowledge-base",
    context: "comparisons",
  },
  {
    query: "Obsidian AI memory",
    intent: "Compare an Obsidian vault with a local memory layer shared by Claude Code and MCP clients.",
    href: "/learn/wenlan-vs-obsidian-ai-memory",
    context: "comparisons",
  },
  {
    query: "Local AI memory",
    intent: "Keep project context local, inspectable, and under your control.",
    href: "/learn/local-first-ai-memory",
    context: "concepts",
  },
  {
    query: "How Wenlan works",
    intent: "See how the daemon, MCP connector, local index, and source-backed pages fit together.",
    href: "/docs/architecture",
    context: "setup",
  },
] as const satisfies readonly {
  readonly query: string;
  readonly intent: string;
  readonly href: string;
  readonly context: AnalyticsContext;
}[];

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
    "@id": "https://wenlan.app/learn#collection",
    name: "Wenlan Learn",
    description:
      "Guides for building a source-backed AI knowledge base with maintained LLM wiki pages, citations, review, refresh state, and local agent workflows.",
    url: `${SITE_URL}/learn`,
    isPartOf: { "@id": "https://wenlan.app/#website" },
    publisher: { "@id": "https://wenlan.app/#organization" },
    inLanguage: "en-US",
    mainEntity: articles.map((article) => ({
      "@type": "Article",
      headline: article.title,
      description: article.description,
      url: articleUrl(article.slug),
      author: {
        "@id": "https://wenlan.app/#qixuan-lu",
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
          <nav aria-label="Breadcrumb" className="flex items-center gap-3 font-mono text-xs text-[var(--o-text-muted)]">
            <Link
              href="/"
              className="transition-colors hover:text-[var(--o-text-secondary)]"
            >
              Wenlan
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--o-text-secondary)]" aria-current="page">
              Learn
            </span>
          </nav>
          <div className="mt-12 grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="min-w-0">
              <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
                Learn
              </p>
              <h1 className="warm-glow break-words font-serif text-5xl leading-[1.05] font-medium tracking-tight sm:text-7xl">
                LLM wiki and AI knowledge base guides that stay current.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--o-text-secondary)]">
                Wenlan turns trusted sources and durable work facts into a
                local, source-backed AI knowledge base with maintained
                LLM-wiki pages for agents and people.
              </p>
              <div className="mt-8 max-w-2xl rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                <p className="font-mono text-[10px] tracking-[0.22em] text-[var(--o-warm)]/80 uppercase">
                  Quick answer
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--o-text-secondary)]">
                  An AI knowledge base stores and retrieves trusted sources. A maintained
                  LLM wiki adds reusable pages, citations, review, and refresh state.
                  Wenlan combines those layers locally for AI agents.
                </p>
              </div>
            </div>
            <MemoryIndex
              label="Learn topics"
              items={[
                "AI knowledge base architecture",
                "Source-backed LLM wiki",
                "Claude Code and MCP",
                "Knowledge-base maintenance",
                "Tool comparisons",
                "Local-first trust",
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
              Choose the job first: build an AI knowledge base, inspect the
              LLM-wiki lifecycle, connect a client, or compare adjacent tools.
            </p>
          </div>

          <section className="mt-10">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                Popular search paths
              </h2>
              <p className="font-mono text-[11px] text-[var(--o-text-dim)]">
                Search demand
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {searchRoutes.map((route) => (
                <TrackedLink
                  key={route.query}
                  href={route.href}
                  eventName="learn_article_click"
                  placement="learn-search-path"
                  locale="en"
                  context={route.context}
                  scroll
                  className="group rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5 transition-colors hover:border-[var(--o-warm)]/50"
                >
                  <p className="font-mono text-[10px] tracking-[0.18em] text-[var(--o-warm)]/80 uppercase">
                    {route.query}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--o-text-secondary)]">
                    {route.intent}
                  </p>
                </TrackedLink>
              ))}
            </div>
          </section>

          <div className="mt-16 space-y-16">
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
                      <TrackedLink
                        key={article.slug}
                        href={`/learn/${article.slug}`}
                        eventName="learn_article_click"
                        placement="learn-grid"
                        locale="en"
                        context={article.category === "Comparisons" ? "comparisons" : article.category === "Workflows" ? "workflows" : "concepts"}
                        scroll
                        className="card-wenlan group p-7"
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
                            <time dateTime={article.updatedAt}>
                              {formatArticleDate(article.updatedAt)}
                            </time>
                            <span>{article.readingTime}</span>
                          </div>
                        </div>
                      </TrackedLink>
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
            Install Wenlan, connect your AI tools, and verify the first memory
            loop locally.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <TrackedLink
              href="/docs/get-started"
              eventName="get_started_click"
              placement="learn-footer"
              locale="en"
              context="setup"
              className="rounded-xl bg-[var(--o-text)] px-6 py-3 text-sm font-semibold text-[var(--o-bg)] transition-all duration-150 hover:opacity-90"
            >
              Get started
            </TrackedLink>
            <TrackedLink
              href="https://github.com/7xuanlu/wenlan"
              eventName="github_outbound"
              placement="learn-footer"
              locale="en"
              context="setup"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[var(--o-border)] px-6 py-3 text-sm font-medium text-[var(--o-text-secondary)] transition-all duration-150 hover:border-[var(--o-text-dim)] hover:text-[var(--o-text)]"
            >
              View on GitHub
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
