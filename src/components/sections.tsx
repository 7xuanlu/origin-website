/* ─── FAQ with Schema Markup ─── */

const faqs = [
  {
    q: "What is Origin?",
    a: "Origin is local-first memory for AI work. It runs quietly behind the tools you already use, carrying decisions, lessons, gotchas, and project context across chats, projects, and time.",
  },
  {
    q: "How is Origin different from built-in AI memory?",
    a: "Built-in memory stores what the AI decided was important. You usually cannot trace it, correct it, or use it from another tool. Origin keeps memory local, visible, editable, and traceable to its source.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Origin runs on your machine and stores memory locally. Basic memory works without a model or API key. Richer extraction and background refinement can use an on-device model, or an Anthropic key if you choose that path.",
  },
  {
    q: "Is Origin just another memory MCP?",
    a: "No. origin-mcp is the connector. Origin also includes the local daemon, background refinery, local database, optional desktop inspection app, provenance, and export paths.",
  },
  {
    q: "What AI tools work with Origin?",
    a: "MCP-compatible tools such as Claude Code, Cursor, Codex, Claude Desktop, Windsurf, and Gemini CLI can connect through origin-mcp. Claude.ai and ChatGPT web use Remote Access from the desktop app.",
  },
  {
    q: "Is Origin a replacement for Notion or Obsidian?",
    a: "No. Origin isn't a notes app or a writing tool. It captures and refines what you learn from AI conversations. It can import from Obsidian, but it's a different product with a different purpose.",
  },
  {
    q: "How do I set it up?",
    a: "For most people, download the desktop app from GitHub Releases and connect your AI tools through origin-mcp. Headless users can install the daemon from the command line. The GitHub README has the current setup paths.",
  },
  {
    q: "Does Origin work on Windows or Linux?",
    a: "Not yet. The current preview is macOS Apple Silicon (M1+) only. Linux and Windows support are on the roadmap but not committed to a timeline.",
  },
  {
    q: "Is Origin free?",
    a: "Yes. Origin is open-source. The core crates are Apache-2.0, the desktop app is AGPL-3.0. Nothing is held back.",
  },
];

export function FAQSection() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <section className="border-t border-[var(--o-border-subtle)] px-6 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">
            FAQ
          </p>
          <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
            Common questions.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-[var(--o-border-subtle)] rounded-lg border border-[var(--o-border)]">
          {faqs.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 font-serif text-sm font-medium text-[var(--o-text)] transition-colors duration-150 hover:text-[var(--o-text-secondary)] [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="ml-4 text-[var(--o-text-muted)] transition-transform duration-150 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-[13px] leading-relaxed text-[var(--o-text-muted)]">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
