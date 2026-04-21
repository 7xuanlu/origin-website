"use client";

import { useState } from "react";

/* ─── Use Cases (tabbed) ─── */

const useCases = [
  {
    tab: "Developers",
    accent: "warm" as const,
    bullets: [
      "Architecture decisions and project context persist across Claude Code, Cursor, and Claude Desktop.",
      "Past debugging sessions surface when you hit a related problem.",
      "A 200-token concept summary replaces re-explaining your project from scratch.",
    ],
  },
  {
    tab: "Knowledge Workers",
    accent: "indigo" as const,
    bullets: [
      "Every memory is editable and traceable to the conversation it came from.",
      "Observations, decisions, and learnings accumulate into a profile you control.",
      "Import your ChatGPT export or Obsidian vault — no cold start.",
    ],
  },
];

const tabAccents = {
  warm: {
    active: "border-[var(--o-warm)] text-[var(--o-warm)]",
    inactive:
      "border-transparent text-[var(--o-text-muted)] hover:text-[var(--o-text-secondary)]",
  },
  indigo: {
    active: "border-[var(--o-indigo)] text-[var(--o-indigo)]",
    inactive:
      "border-transparent text-[var(--o-text-muted)] hover:text-[var(--o-text-secondary)]",
  },
};

export function UseCasesSection() {
  const [active, setActive] = useState(0);
  const current = useCases[active];

  return (
    <section className="border-t border-[var(--o-border-subtle)] px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">
            Who it&apos;s for
          </p>
          <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
            Built for people who think with AI.
          </h2>
        </div>

        {/* Tabs */}
        <div className="mt-12 flex justify-center gap-1 border-b border-[var(--o-border-subtle)]">
          {useCases.map((uc, i) => {
            const accent = tabAccents[uc.accent];
            return (
              <button
                key={uc.tab}
                onClick={() => setActive(i)}
                className={`relative border-b-2 px-5 py-3 font-mono text-sm transition-colors duration-150 ${
                  i === active ? accent.active : accent.inactive
                }`}
              >
                {uc.tab}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div className="mt-8 rounded-lg border border-[var(--o-border)] bg-[var(--o-surface)] px-8 py-8">
          <ul className="space-y-3">
            {current.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-[13px] leading-relaxed text-[var(--o-text-muted)]"
              >
                <span className="mt-1 text-[var(--o-sage)]">&#10003;</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─── Honest Caveats + What It Isn't ─── */

const caveats = [
  {
    title: "Pays off over time",
    description:
      "Origin gets better the more you use it. If most of what you do is one-off chats, platform memory may be enough.",
  },
  {
    title: "Quality reflects input",
    description:
      "Origin can structure what you bring to it. It can't invent depth that isn't there.",
  },
  {
    title: "Opinionated by design",
    description:
      "Origin makes specific choices about what to keep and how to organize it. It's not infinitely configurable.",
  },
];

const notList = [
  "Another memory MCP — Origin is a product built on top of memory, not just a store",
  "A notes app or Notion / Obsidian replacement",
  "A chat UI — the conversation stays in your AI tool",
  "A graph visualization tool — the graph is a means, not the product",
  "An SDK or memory infrastructure for other apps",
  "Available on Windows or Linux at v0.1.0",
];

export function HonestCaveatsSection() {
  return (
    <section className="border-t border-[var(--o-border-subtle)] px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">
            Honest expectations
          </p>
          <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
            What Origin is — and isn&apos;t.
          </h2>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {/* Caveats */}
          <div>
            <h3 className="mb-6 font-mono text-xs tracking-[0.2em] text-[var(--o-text-muted)] uppercase">
              Honest caveats
            </h3>
            <div className="space-y-4">
              {caveats.map((c) => (
                <div
                  key={c.title}
                  className="rounded-lg border border-[var(--o-border)] bg-[var(--o-surface)] px-6 py-5"
                >
                  <p className="font-serif text-sm font-medium text-[var(--o-text)]">
                    {c.title}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--o-text-muted)]">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* What it isn't */}
          <div>
            <h3 className="mb-6 font-mono text-xs tracking-[0.2em] text-[var(--o-text-muted)] uppercase">
              What Origin isn&apos;t
            </h3>
            <ul className="space-y-3">
              {notList.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[13px] leading-relaxed text-[var(--o-text-muted)]"
                >
                  <span className="mt-0.5 text-[var(--o-text-muted)]">
                    &times;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

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
