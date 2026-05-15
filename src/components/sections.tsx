/* ─── FAQ ─── */

const faqs = [
  {
    q: "What is Origin?",
    a: "Origin is a local-first layer for AI work. It carries sessions, decisions, lessons, project context, and wiki pages across chats, tools, projects, and time.",
  },
  {
    q: "How is Origin different from built-in AI memory?",
    a: "Built-in memory stores what the AI decided was important. You usually cannot trace it, correct it, or use it from another tool. Origin keeps memory local, visible, editable, and traceable to its source.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Origin runs on your machine and stores its database locally. Local memory setup works without a model or API key. Richer extraction and distill cycles can use an on-device model, or an Anthropic key if you choose that path.",
  },
  {
    q: "Is Origin just another memory MCP?",
    a: "No. The MCP server is the connector. Origin also includes the local daemon, background refinery, local database, searchable wiki pages, provenance, and export paths.",
  },
  {
    q: "What AI tools work with Origin?",
    a: "Claude Code has a marketplace plugin. MCP-compatible tools such as Cursor, Codex, Claude Desktop, Gemini CLI, and other clients can connect through Origin's MCP server.",
  },
  {
    q: "Is Origin a replacement for Notion or Obsidian?",
    a: "No. Origin isn't a notes app or a writing tool. It captures and refines what you learn from AI conversations. It can import from Obsidian, but it's a different product with a different purpose.",
  },
  {
    q: "How do I set it up?",
    a: "In Claude Code, run /plugin marketplace add 7xuanlu/origin, then /plugin install origin@7xuanlu, then /init. For other MCP clients, run npx -y @7xuanlu/origin setup first, then add npx -y origin-mcp to their mcpServers config.",
  },
  {
    q: "Does Origin work on Windows or Linux?",
    a: "Not yet. The current preview is macOS Apple Silicon (M1+) only.",
  },
  {
    q: "Is Origin free?",
    a: "Yes. Origin is open-source. The local runtime, CLI, MCP server, and Claude Code plugin files in the Origin repo are Apache-2.0.",
  },
];

export function FAQSection() {
  return (
    <section className="border-t border-[var(--o-border-subtle)] px-6 py-24">
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
