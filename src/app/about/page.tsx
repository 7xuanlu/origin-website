import type { Metadata } from "next";
import Link from "next/link";
import { ArticleHalo, MemoryIndex } from "../learn/article-visuals";
import { SITE_URL } from "../learn/articles";

export const metadata: Metadata = {
  title: "About Origin | Local-First Memory for AI Work",
  description:
    "Origin is an open-source, local-first memory layer for AI work across Claude Code, Cursor, Codex, and MCP-compatible tools.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Origin | Local-First Memory for AI Work",
    description:
      "Origin is an open-source, local-first memory layer for AI work across Claude Code, Cursor, Codex, and MCP-compatible tools.",
    type: "website",
    url: `${SITE_URL}/about`,
    siteName: "Origin",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Origin | Local-First Memory for AI Work",
    description:
      "Origin is an open-source, local-first memory layer for AI work across Claude Code, Cursor, Codex, and MCP-compatible tools.",
  },
};

const principles = [
  {
    title: "Local-first",
    body: "Memory starts on your machine. Cloud sync, telemetry, local models, and API keys are opt-in choices rather than the default source of truth.",
  },
  {
    title: "Human-readable",
    body: "Markdown is the durable artifact people can inspect, correct, and export. The local database keeps indexes for retrieval, not an opaque black box.",
  },
  {
    title: "Session rhythm",
    body: "Origin follows how AI work actually happens: load context, capture durable facts, write handoffs, and bring the right context into the next run.",
  },
  {
    title: "Background distillation",
    body: "Between sessions, Origin deduplicates repeat facts, links related ideas, distills wiki pages, and keeps provenance attached.",
  },
];

const projectLinks = [
  {
    href: "https://github.com/7xuanlu/origin",
    label: "GitHub repository",
  },
  {
    href: "https://github.com/7xuanlu/origin/blob/main/LICENSE",
    label: "Apache-2.0 license",
  },
  {
    href: "https://github.com/7xuanlu/origin/blob/main/CONTRIBUTING.md",
    label: "Contributing guide",
  },
  {
    href: "https://github.com/7xuanlu/origin/blob/main/SECURITY.md",
    label: "Security policy",
  },
];

export default function AboutPage() {
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
        name: "About",
        item: `${SITE_URL}/about`,
      },
    ],
  };

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Origin",
    description:
      "Origin is an open-source, local-first memory layer for AI work, built by Qi-Xuan Lu.",
    url: `${SITE_URL}/about`,
    mainEntity: {
      "@id": "https://useorigin.app/#organization",
    },
    author: {
      "@id": "https://useorigin.app/#qixuan-lu",
    },
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://useorigin.app/#qixuan-lu",
    name: "Qi-Xuan Lu",
    alternateName: "7xuanlu",
    url: "https://github.com/7xuanlu",
    sameAs: [
      "https://github.com/7xuanlu",
      "https://github.com/7xuanlu/origin",
      "https://www.npmjs.com/package/@7xuanlu/origin",
      "https://www.npmjs.com/package/origin-mcp",
      "https://crates.io/crates/origin-mcp",
      "https://crates.io/crates/origin-types",
    ],
    knowsAbout: [
      "AI work memory",
      "local-first software",
      "Model Context Protocol",
      "knowledge graphs",
      "hybrid retrieval",
      "Rust",
      "libSQL",
    ],
    worksFor: { "@id": "https://useorigin.app/#organization" },
    mainEntityOfPage: `${SITE_URL}/about`,
  };

  return (
    <main className="grain min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <article>
        <header className="relative border-b border-[var(--o-border-subtle)] px-6 py-24 sm:py-32">
          <ArticleHalo />
          <div className="relative z-10 mx-auto max-w-5xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-3 font-mono text-xs text-[var(--o-text-muted)]">
              <Link
                href="/"
                className="transition-colors hover:text-[var(--o-text-secondary)]"
              >
                Origin
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--o-text-secondary)]" aria-current="page">
                About
              </span>
            </nav>
            <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div>
                <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
                  About
                </p>
                <h1 className="warm-glow font-serif text-5xl leading-[1.05] font-medium tracking-tight sm:text-7xl">
                  Local-first memory for AI work.
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--o-text-secondary)]">
                  Origin helps AI tools carry sessions, decisions, lessons,
                  project context, and wiki pages across chats, tools, projects,
                  and time.
                </p>
              </div>
              <MemoryIndex
                label="Project status"
                items={[
                  "v0.7.0",
                  "macOS, Linux, Windows",
                  "Apache-2.0",
                  "Built by Qi-Xuan Lu",
                ]}
              />
            </div>
          </div>
        </header>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,680px)_1fr]">
            <div className="space-y-14">
              <section className="grid gap-5 sm:grid-cols-[72px_1fr]">
                <p className="font-mono text-[11px] text-[var(--o-warm)]">01</p>
                <div>
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                    Why Origin exists
                  </h2>
                  <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--o-text-secondary)]">
                    <p>
                      AI work has become serious work, but most sessions still
                      end like disposable conversations. Decisions, debugging
                      lessons, project constraints, and handoffs get buried in
                      old chats.
                    </p>
                    <p>
                      Origin is built so the work can compound. Agents can save
                      what matters, recall it later, and keep refined context
                      available across MCP-compatible tools.
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid gap-5 sm:grid-cols-[72px_1fr]">
                <p className="font-mono text-[11px] text-[var(--o-warm)]">02</p>
                <div>
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                    Design principles
                  </h2>
                  <div className="mt-6 divide-y divide-[var(--o-border-subtle)] border-y border-[var(--o-border-subtle)]">
                    {principles.map((principle) => (
                      <div
                        key={principle.title}
                        className="grid gap-3 py-5 sm:grid-cols-[180px_1fr]"
                      >
                        <h3 className="font-serif text-xl font-medium tracking-tight text-[var(--o-text)]">
                          {principle.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[var(--o-text-muted)]">
                          {principle.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="grid gap-5 sm:grid-cols-[72px_1fr]">
                <p className="font-mono text-[11px] text-[var(--o-warm)]">03</p>
                <div>
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                    Built by Qi-Xuan Lu
                  </h2>
                  <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--o-text-secondary)]">
                    <p>
                      Origin is built and maintained by Qi-Xuan Lu (GitHub{" "}
                      <a
                        href="https://github.com/7xuanlu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--o-text)] underline decoration-[var(--o-warm)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--o-warm)]"
                      >
                        @7xuanlu
                      </a>
                      ). Background in AI infrastructure, knowledge graphs, and
                      local-first systems.
                    </p>
                    <p>
                      The work focuses on memory as a first-class layer for AI
                      tools: hybrid retrieval on libSQL, real git versioning of
                      every write, mandatory provenance on distilled pages, and
                      one daemon serving every MCP-compatible client.
                    </p>
                    <p>
                      Project channels: GitHub Issues for bugs and feature
                      requests, SECURITY.md for vulnerabilities, and the Origin
                      release notes for changes.
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid gap-5 sm:grid-cols-[72px_1fr]">
                <p className="font-mono text-[11px] text-[var(--o-warm)]">04</p>
                <div>
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                    Current status
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-[var(--o-text-secondary)]">
                    Origin v0.7.0 ships for macOS (arm64, x64), Linux (x86_64,
                    aarch64; glibc), and Windows (x86_64). The daemon, CLI, MCP
                    server, and Claude Code plugin are open source under
                    Apache-2.0.
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/docs/get-started"
                      className="rounded-xl bg-[var(--o-text)] px-5 py-3 text-center text-sm font-semibold text-[var(--o-bg)] transition-all hover:shadow-[0_0_28px_var(--o-glow-warm)]"
                    >
                      Get started
                    </Link>
                    <a
                      href="https://github.com/7xuanlu/origin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-[var(--o-border)] px-5 py-3 text-center text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
                    >
                      View on GitHub
                    </a>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                  Open source
                </p>
                <div className="mt-4 space-y-4">
                  {projectLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm leading-relaxed text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                  Help
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--o-text-muted)]">
                  For bugs and feature requests, use GitHub Issues. For
                  vulnerabilities, follow the security policy in the repository.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </article>
    </main>
  );
}
