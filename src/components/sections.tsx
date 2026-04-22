/* ─── FAQ with Schema Markup ─── */

const faqs = [
  {
    q: "What is Origin?",
    a: "Origin is a local-first personal AI memory layer. It captures, organizes, and refines what you learn across AI conversations — making it editable, searchable, and available to any MCP-compatible agent.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Origin runs entirely on your machine. The on-device LLM (Qwen3-4B) processes everything locally via Apple Silicon Metal GPU. Your data never leaves your device by default.",
  },
  {
    q: "How is Origin different from built-in AI memory?",
    a: "Built-in platform memory stores what the AI decided was important. You can't inspect the full picture, trace where a fact came from, or correct what's wrong. Origin gives you an editable, searchable layer where every memory is visible and traceable. It also compounds — a background engine links related memories, detects contradictions, and distills patterns over time.",
  },
  {
    q: "What AI tools work with Origin?",
    a: "Any MCP-compatible agent. Today that includes Claude Code, Claude Desktop, Cursor, ChatGPT (via App Directory), and Gemini CLI. Add origin-mcp to your MCP config and you're connected.",
  },
  {
    q: "Does Origin work on Windows or Linux?",
    a: "Not yet. v0.1.0 is macOS Apple Silicon (M1+) only. Linux and Windows support are on the roadmap but not committed to a timeline.",
  },
  {
    q: "Is Origin free?",
    a: "Yes. Origin is open-source. The core crates (origin-types, origin-core, origin-server) are Apache-2.0. The desktop app is AGPL-3.0. Nothing is held back.",
  },
  {
    q: "Can I import existing data?",
    a: "Yes. Drop in your ChatGPT export or Obsidian vault and Origin starts refining immediately. No cold start, no waiting period before it's useful.",
  },
  {
    q: "What model does Origin use locally?",
    a: "Qwen3-4B and Qwen3.5-9B running on Apple Silicon Metal GPU via llama-cpp-2. They handle classification, summarization, entity extraction, and memory refinement — all on-device.",
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
    <section className="border-t border-[var(--o-border-subtle)] px-6 py-32">
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
