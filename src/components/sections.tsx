/* ─── FAQ with Schema Markup ─── */

const faqs = [
  {
    q: "What is Origin?",
    a: "A local-first memory app that captures knowledge, decisions, and insights from every AI conversation. It distills what matters, makes every memory visible and editable, and gets sharper the longer you use it.",
  },
  {
    q: "How is Origin different from built-in AI memory?",
    a: "Built-in memory stores what the AI decided was important — stale facts, contradicted decisions, things you can't trace or fix. Origin gives you a memory layer you actually control: every memory is visible, editable, and traceable to its source. It also compounds over time — linking related memories, detecting contradictions, and distilling patterns.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Origin runs entirely on your machine. The on-device LLM processes everything locally via Apple Silicon Metal GPU. Your data never leaves your device by default.",
  },
  {
    q: "Is Origin just another memory MCP?",
    a: "No. Memory MCPs store and retrieve. Origin is a full product built on top — it distills the noise into what you actually need, detects contradictions, and compounds your understanding over time. Less to track, not more.",
  },
  {
    q: "What AI tools work with Origin?",
    a: "Any MCP-compatible agent. Today that includes Claude Code, Claude Desktop, Cursor, ChatGPT (via App Directory), and Gemini CLI. Add origin-mcp to your MCP config and you're connected.",
  },
  {
    q: "Is Origin a replacement for Notion or Obsidian?",
    a: "No. Origin isn't a notes app or a writing tool. It captures and refines what you learn from AI conversations. It can import from Obsidian, but it's a different product with a different purpose.",
  },
  {
    q: "How do I set it up?",
    a: "Download the app from GitHub Releases and open it. The onboarding wizard walks you through importing existing data (ChatGPT exports, Obsidian vaults) and connecting your AI tools via MCP. Detailed setup instructions are in the GitHub README.",
  },
  {
    q: "Does Origin work on Windows or Linux?",
    a: "Not yet. v0.2.0 is macOS Apple Silicon (M1+) only. Linux and Windows support are on the roadmap but not committed to a timeline.",
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
