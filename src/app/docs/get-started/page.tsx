import type { Metadata } from "next";
import Link from "next/link";
import { ArticleHalo, MemoryIndex } from "../../learn/article-visuals";
import { SITE_URL } from "../../learn/articles";

export const metadata: Metadata = {
  title: "Get Started with Origin | Local AI Work Memory",
  description:
    "Install Origin through the Claude Code plugin or run Origin setup before connecting another MCP client.",
  alternates: {
    canonical: "/docs/get-started",
  },
  openGraph: {
    title: "Get Started with Origin | Local AI Work Memory",
    description:
      "Install Origin through the Claude Code plugin or run Origin setup before connecting another MCP client.",
    type: "article",
    url: `${SITE_URL}/docs/get-started`,
    siteName: "Origin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Started with Origin | Local AI Work Memory",
    description:
      "Install Origin through the Claude Code plugin or run Origin setup before connecting another MCP client.",
  },
};

const claudeCommands = [
  "/plugin marketplace add 7xuanlu/origin",
  "/plugin install origin@7xuanlu",
  "/init",
];

const originSetupCommand = "npx -y @7xuanlu/origin setup";

const mcpConfig = `{
  "mcpServers": {
    "origin": {
      "command": "npx",
      "args": ["-y", "origin-mcp"]
    }
  }
}`;

export default function GetStartedPage() {
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Get started",
        item: `${SITE_URL}/docs/get-started`,
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Get started with Origin",
    description:
      "Install Origin in Claude Code or run Origin setup before connecting another MCP client.",
    step: [
      {
        "@type": "HowToStep",
        name: "Install the Claude Code plugin",
        text: claudeCommands.join("\n"),
      },
      {
        "@type": "HowToStep",
        name: "Set up the local runtime for another MCP client",
        text: "Run npx -y @7xuanlu/origin setup, then add npx -y origin-mcp to the client's mcpServers config.",
      },
      {
        "@type": "HowToStep",
        name: "Confirm memory works",
        text: "Store and recall a small durable project fact from your AI tool.",
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <article>
        <header className="relative border-b border-[var(--o-border-subtle)] px-6 py-24 sm:py-32">
          <ArticleHalo />
          <div className="relative z-10 mx-auto max-w-5xl">
            <nav className="flex items-center gap-3 font-mono text-xs text-[var(--o-text-muted)]">
              <Link
                href="/"
                className="transition-colors hover:text-[var(--o-text-secondary)]"
              >
                Origin
              </Link>
              <span>/</span>
              <Link
                href="/docs"
                className="transition-colors hover:text-[var(--o-text-secondary)]"
              >
                Docs
              </Link>
            </nav>
            <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div>
                <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
                  Get started
                </p>
                <h1 className="warm-glow font-serif text-[2rem] leading-[1.08] font-medium tracking-tight sm:text-7xl sm:leading-[1.05]">
                  Connect Origin to your AI tools.
                </h1>
                <p className="mt-8 max-w-[20rem] text-lg leading-relaxed text-[var(--o-text-secondary)] sm:max-w-2xl">
                  Start with the Claude Code plugin, or add Origin to another
                  MCP-compatible client through the local MCP server.
                </p>
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-[var(--o-text-muted)]">
                  <span>Origin team</span>
                  <span>Updated May 15, 2026</span>
                  <span>4 min setup</span>
                </div>
              </div>
              <MemoryIndex
                label="Setup path"
                items={["Claude Code", "MCP clients", "Local daemon"]}
              />
            </div>
          </div>
        </header>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,680px)_1fr]">
            <div className="space-y-14">
              <section className="grid gap-5 border-t border-[var(--o-border-subtle)] pt-10 sm:grid-cols-[72px_1fr]">
                <p className="font-mono text-[11px] text-[var(--o-warm)]">01</p>
                <div>
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                    Claude Code plugin
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-[var(--o-text-secondary)]">
                    This is the fastest path. The plugin handles daemon setup,
                    MCP wiring, local memory setup, and the first round-trip check.
                  </p>
                  <pre className="mt-6 overflow-x-auto rounded-xl border border-[var(--o-border)] bg-[var(--o-bg-deep)] p-5 font-mono text-sm leading-relaxed text-[var(--o-text-secondary)]">
                    <code>{claudeCommands.join("\n")}</code>
                  </pre>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--o-text-muted)]">
                    If Claude Code asks for a restart after installing, restart
                    once, then run <code className="font-mono">/init</code>.
                  </p>
                </div>
              </section>

              <section className="grid gap-5 border-t border-[var(--o-border-subtle)] pt-10 sm:grid-cols-[72px_1fr]">
                <p className="font-mono text-[11px] text-[var(--o-warm)]">02</p>
                <div>
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                    Other MCP clients
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-[var(--o-text-secondary)]">
                    For Cursor, Codex, Claude Desktop, Gemini CLI, and other
                    MCP-compatible clients, set up the local Origin runtime first.
                    Then add the MCP connector to the client.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--o-text-muted)]">
                    Origin setup installs the CLI, daemon, and MCP connector,
                    configures local memory, registers the daemon with launchd,
                    and verifies status.
                  </p>
                  <pre className="mt-6 overflow-x-auto rounded-xl border border-[var(--o-border)] bg-[var(--o-bg-deep)] p-5 font-mono text-sm leading-relaxed text-[var(--o-text-secondary)]">
                    <code>{originSetupCommand}</code>
                  </pre>
                  <pre className="mt-6 overflow-x-auto rounded-xl border border-[var(--o-border)] bg-[var(--o-bg-deep)] p-5 font-mono text-sm leading-relaxed text-[var(--o-text-secondary)]">
                    <code>{mcpConfig}</code>
                  </pre>
                </div>
              </section>

              <section className="grid gap-5 border-t border-[var(--o-border-subtle)] pt-10 sm:grid-cols-[72px_1fr]">
                <p className="font-mono text-[11px] text-[var(--o-warm)]">03</p>
                <div>
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                    What to try first
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-[var(--o-text-secondary)]">
                    Store one durable project fact, then ask your agent to recall
                    it in a new session. Origin should make that context visible,
                    searchable, and available through the same local memory layer.
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/docs/daily-workflow"
                      className="rounded-xl bg-[var(--o-text)] px-5 py-3 text-center text-sm font-semibold text-[var(--o-bg)] transition-all hover:shadow-[0_0_28px_var(--o-glow-warm)]"
                    >
                      Start daily workflow
                    </Link>
                    <Link
                      href="/learn"
                      className="rounded-xl border border-[var(--o-border)] px-5 py-3 text-center text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
                    >
                      Read articles
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                  You get
                </p>
                <div className="mt-4 space-y-3">
                  {["Local daemon", "Claude Code plugin", "MCP server", "Shared memory layer"].map(
                    (item, index) => (
                      <p
                        key={item}
                        className="grid grid-cols-[28px_1fr] gap-2 text-sm text-[var(--o-text-secondary)]"
                      >
                        <span className="font-mono text-[10px] text-[var(--o-text-dim)]">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <span>{item}</span>
                      </p>
                    ),
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </article>
    </main>
  );
}
