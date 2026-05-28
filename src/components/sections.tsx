/* ─── FAQ ─── */

export const homepageFaqs = [
  {
    q: "What is Origin?",
    a: "Origin is a local-first memory layer for AI work. It carries sessions, decisions, lessons, project context, and distilled wiki pages across chats, tools, projects, and time. One daemon, ~30 MCP tools, Markdown projection on disk you can read and edit.",
  },
  {
    q: "How is Origin different from built-in AI memory?",
    a: "Built-in memory stores what the AI decided was important. You usually cannot trace it, correct it, or use it from another tool. Origin keeps memory local, visible, editable, and traceable. Every write is a git commit in ~/.origin/.git/, and every distilled page cites the source memory IDs that produced it.",
  },
  {
    q: "What retrieval quality does Origin reach?",
    a: "Hybrid retrieval combines vector search (BGE-Base-EN-v1.5-Q, 768-dim), FTS5, reciprocal-rank fusion, and knowledge-graph context. Recall@5 is 93.6% on LongMemEval (oracle, 500 questions) and 70.0% on LoCoMo, at roughly 168 tokens per recall query. The eval harness ships in the repo at crates/origin-core/src/eval/.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Origin runs on your machine and stores its database locally. No cloud sync or telemetry by default. Local memory setup works without a model or API key. Distill cycles can use an on-device model or an Anthropic key if you opt in.",
  },
  {
    q: "Is Origin just another memory MCP?",
    a: "No. The MCP server is the connector. Origin also includes the local daemon, background distill cycles, libSQL store with DiskANN vectors, FTS5 + knowledge graph, mandatory provenance, real git versioning, and Markdown export paths.",
  },
  {
    q: "What AI tools work with Origin?",
    a: "Claude Code has a marketplace plugin. MCP-compatible clients such as Cursor, Codex, Claude Desktop, VS Code, Gemini CLI, and others connect through Origin's MCP server.",
  },
  {
    q: "Is Origin a replacement for Notion or Obsidian?",
    a: "No. Origin is not a notes app or a writing tool. It captures and refines what you learn from AI conversations. The Markdown projection under ~/.origin/ can be symlinked into Obsidian if you want to read it there.",
  },
  {
    q: "How do I set it up?",
    a: "In Claude Code, run /plugin marketplace add 7xuanlu/origin, then /plugin install origin@7xuanlu, then /init. For other MCP clients, run npx -y @7xuanlu/origin setup first, then ~/.origin/bin/origin mcp add codex, cursor, claude-desktop, vscode, or gemini.",
  },
  {
    q: "Does Origin work on Windows or Linux?",
    a: "Yes. The daemon builds and runs on macOS (arm64, x64), Linux (x86_64, aarch64; glibc), and Windows (x86_64). Service registration uses launchd on macOS, systemd-user on Linux, and Task Scheduler (schtasks) on Windows.",
  },
  {
    q: "Can I keep work and personal memory separate?",
    a: "Yes. Memories, pages, and recalls belong to a space (for example, work, personal, or client-X). Set the active space per shell with ORIGIN_SPACE, or declare them in ~/.origin/spaces.toml. The auto-detector also picks a space from the current repo or workspace.",
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
          {homepageFaqs.map((f) => (
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
