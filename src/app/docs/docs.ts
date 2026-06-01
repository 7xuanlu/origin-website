import { DEFAULT_AUTHOR, SITE_URL } from "../learn/articles";

export const DOCS_UPDATED_AT = "2026-06-01";

export type DocGroup = "After setup" | "Reference" | "Project";

export type DocCodeBlock = {
  label: string;
  code: string;
};

export type DocSection = {
  heading: string;
  body: string[];
  bullets?: string[];
  code?: DocCodeBlock;
  link?: {
    label: string;
    href: string;
  };
};

export type DocPage = {
  slug: string;
  group: DocGroup;
  eyebrow: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  updatedAt: string;
  author: string;
  readingTime: string;
  summary: string[];
  sections: DocSection[];
  nextSlug?: string;
  howTo?: boolean;
};

const mcpAddCommand = `~/.origin/bin/origin mcp add claude-code
# or: codex, cursor, claude-desktop, vscode, gemini`;

const mcpConfig = `{
  "mcpServers": {
    "origin": {
      "command": "/Users/you/.origin/bin/origin-mcp"
    }
  }
}`;

const originSetupCommand = "npx -y @7xuanlu/origin setup";

const architectureMap = `origin-server  -> local daemon on 127.0.0.1:7878
origin-core    -> storage, search, graph, pages, eval
origin-cli     -> setup, service management, recall, doctor
origin-mcp     -> MCP connector for AI clients
origin-types   -> shared HTTP/MCP wire types
plugin/        -> Claude Code slash commands and hooks`;

const evalSnapshot = `Benchmark                         Recall@5   MRR     NDCG@10
LongMemEval oracle, 500 Q          93.6%     0.857   0.883
LoCoMo locomo10                    70.0%     0.647   0.684`;

const serviceCommands = `origin status
origin doctor
origin install
origin uninstall`;

const cliDailyCommands = `origin recall "origin website positioning"
origin search "MCP setup"
origin store "We chose spaces for client separation" --type decision
origin list --limit 10`;

const spaceCommands = `ORIGIN_SPACE=career claude

origin space list
origin space add ideas --default
origin space show ideas
origin space move scratch career`;

const importPortabilityCommands = `origin import vault /path/to/markdown-vault

# readable Origin artifacts
ls ~/.origin/pages/
ls ~/.origin/sessions/`;

const gitHistoryCommands = `cd ~/.origin
git log --oneline --decorate --all -20
git show --stat HEAD
git diff HEAD~1 -- pages/`;

const modelSetupCommands = `origin setup --basic
origin model install qwen3-4b
origin key set anthropic

origin model status
origin key status
origin doctor`;

const configurationKnobs = `ORIGIN_SPACE=client-a
ORIGIN_BIND_ADDR=127.0.0.1:7878
ORIGIN_BIND_ADDR=0.0.0.0:7878  # Docker or VM only`;

const configurationFiles = `~/.origin/
~/.origin/bin/
~/.origin/db/
~/.origin/pages/
~/.origin/sessions/
~/.origin/spaces.toml
~/Library/Application Support/origin/
~/.local/share/origin/
%LOCALAPPDATA%\\origin\\`;

const captureExamples = `/capture We chose source-backed pages because summaries need provenance.
/capture Supersedes earlier setup docs: Windows now uses a Task Scheduler ONLOGON task.
/capture Gotcha: Do not paste private memory contents into public issues.`;

const httpSurfaces = `/api/health
/api/status
/api/setup/status
/api/memory/store
/api/memory/search
/api/chat-context
/api/memory/list
/api/memory/confirm/{id}
/api/distill
/api/on-device-model
/api/setup/anthropic-key`;

const buildFromSourceCommands = `git clone https://github.com/7xuanlu/origin.git
cd origin
cargo build --workspace
cargo run -p origin-server

# before a PR
cargo fmt --check --all
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace`;

const retrievalFlags = `ORIGIN_ENABLE_GRAPH_GATE
ORIGIN_ENABLE_TEMPORAL_FILTER
ORIGIN_ENABLE_FTS_HARDENING
ORIGIN_ENABLE_SESSION_DIVERSITY
ORIGIN_ENABLE_SALIENCE_PRIOR
ORIGIN_ENABLE_FACT_CHANNEL
ORIGIN_ENABLE_GRAPH_KHOP
ORIGIN_ENABLE_GLOBAL_PRELUDE
ORIGIN_ENABLE_COT_RETRIEVAL
ORIGIN_LLM_ROUTE
ORIGIN_ENABLE_CONTEXT_COMPRESS`;

export const docPages: DocPage[] = [
  {
    slug: "daily-workflow",
    group: "After setup",
    eyebrow: "Workflow",
    title: "Daily Workflow",
    howTo: true,
    description:
      "Start with context, capture what matters, recall when needed, and hand off before context goes cold.",
    metaTitle: "Origin Daily Workflow | Docs",
    metaDescription:
      "Learn the daily Origin loop after setup: /brief or MCP context, /capture, /recall, /handoff, plus review and distillation when needed.",
    keywords: [
      "Origin daily workflow",
      "AI session handoff",
      "memory capture workflow",
      "Claude Code workflow",
      "MCP daily workflow",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Start with /brief in Claude Code or context in MCP clients.",
      "Capture durable facts during work; close real sessions with /handoff.",
    ],
    sections: [
      {
        heading: "Start with context",
        body: [
          "Start a real work session with /brief in Claude Code or context in another MCP client. Origin returns project facts, recent handoffs, decisions, and distilled pages.",
          "If setup is not done yet, use /init in Claude Code. For other MCP clients, run npx -y @7xuanlu/origin setup, then ~/.origin/bin/origin mcp add for the client you use.",
        ],
        code: {
          label: "Session start",
          code: "Claude Code: /brief\nMCP tool: context",
        },
      },
      {
        heading: "Capture only durable knowledge",
        body: [
          "Use /capture for knowledge that should survive the current chat: decisions, lessons, gotchas, project constraints, preferences, and facts future agents would otherwise rediscover.",
          "Keep each capture atomic. One idea per memory is easier to search, merge, correct, and cite later.",
        ],
        bullets: [
          "Good: We chose local memory because this project needs local search without model setup.",
          "Good: Origin is AI work memory because it carries context across sessions, tools, and time.",
          "Skip: command output, temporary todos, filler, and facts the repo can trivially derive.",
        ],
        code: {
          label: "Claude Code",
          code: "/capture <one durable thing, including why it matters>",
        },
      },
      {
        heading: "Recall when history matters",
        body: [
          "Use /recall when the agent needs a specific thread of past context. This is better than asking the assistant to guess from the current chat.",
          "Specific recall queries work better than broad ones. Name the project, decision, person, feature, or failure mode you care about.",
        ],
        code: {
          label: "Claude Code",
          code: "/recall origin website docs decisions",
        },
      },
      {
        heading: "End with a handoff",
        body: [
          "/handoff is the closing ritual. It writes a session log, updates project status, and captures decisions, lessons, gotchas, and open threads before the session disappears into chat history.",
          "The next session can start from that handoff instead of rebuilding the situation from memory.",
        ],
        code: {
          label: "Claude Code",
          code: "/handoff",
        },
      },
      {
        heading: "Maintain memory when it grows",
        body: [
          "/review is for deep audits. /distill turns related memories into wiki pages.",
          "Use them after meaningful project work, before a new phase, or when recall starts surfacing repeated or stale context.",
        ],
        bullets: [
          "/review captures: walk unconfirmed memories when you want the full queue.",
          "/review revisions: accept or dismiss pending memory revisions.",
          "/distill: synthesize related memories into readable pages.",
          "/read: preview a distilled page without leaving the agent session.",
        ],
      },
    ],
    nextSlug: "capture-quality",
  },
  {
    slug: "capture-quality",
    group: "After setup",
    eyebrow: "Capture",
    title: "Capture Quality",
    description:
      "Decide what belongs in Origin: durable facts, decisions, lessons, gotchas, corrections, and project context.",
    metaTitle: "Origin Capture Quality | Docs",
    metaDescription:
      "Learn what to capture in Origin, what to skip, how to write useful atomic memories, and how corrections, review, distill, and forget fit the memory loop.",
    keywords: [
      "Origin capture",
      "AI memory capture",
      "what to capture",
      "memory correction",
      "Claude Code capture",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Good captures are durable, atomic, specific, and include why the fact matters.",
      "Skip tool output, command logs, filler, temporary todos, and facts the repo can derive directly.",
    ],
    sections: [
      {
        heading: "The capture test",
        body: [
          "Capture something when a future AI session would waste time rediscovering it or would make a worse decision without it.",
          "The best captures name the project, tool, person, decision, or constraint and include why it matters. That gives retrieval enough surface area to find it later.",
        ],
      },
      {
        heading: "Good capture shapes",
        body: [
          "Origin works best when each memory carries one idea. One idea per capture makes deduplication, supersession, review, and page distillation easier.",
          "Use capture for decisions, lessons, gotchas, preferences, project constraints, corrections, and durable facts about how work should continue.",
        ],
        code: {
          label: "Claude Code",
          code: captureExamples,
        },
      },
      {
        heading: "What to skip",
        body: [
          "Do not capture raw command output, long logs, temporary todos, or facts that are already obvious from source files. Origin is the memory layer for durable work context, not a transcript archive.",
          "If the source artifact is the authority, keep the capture short and point to the decision or lesson that a future agent should remember.",
        ],
        bullets: [
          "Skip: full test output, stack traces, generated diffs, and tool logs.",
          "Skip: conversational filler, acknowledgements, and one-off status messages.",
          "Skip: repo facts an agent can read directly, unless the important part is why that fact matters.",
        ],
      },
      {
        heading: "Corrections and supersession",
        body: [
          "When a fact changes, capture the correction instead of silently editing history in your head. Name what it supersedes and why the new fact should replace the old one.",
          "For sensitive or wrong records that should not remain at all, use /forget with the memory ID. Forget is destructive, so prefer correction when the history is still useful.",
        ],
      },
      {
        heading: "Review and distill",
        body: [
          "/review is for inspecting pending captures or revisions. /distill is for turning repeated clusters into readable pages.",
          "Use review when trust is the question. Use distill when synthesis is the question.",
        ],
      },
    ],
    nextSlug: "core-concepts",
  },
  {
    slug: "core-concepts",
    group: "After setup",
    eyebrow: "Concepts",
    title: "Core Concepts",
    description:
      "Understand the pieces behind Origin: memories, sessions, handoffs, pages, the daemon, MCP, Markdown, and the local index.",
    metaTitle: "Origin Core Concepts | Docs",
    metaDescription:
      "Learn how Origin organizes AI work memory with sessions, handoffs, distilled pages, local Markdown records, a local index, and MCP clients.",
    keywords: [
      "Origin core concepts",
      "AI memory model",
      "memory sessions",
      "distilled pages",
      "local index",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "Origin is local-first memory for AI work, not a chat UI or a notes app replacement.",
      "Markdown stays human-readable while the local database keeps retrieval indexes, graph structure, and metadata.",
    ],
    sections: [
      {
        heading: "Memory",
        body: [
          "A memory is one durable idea from your AI work. It might be a decision, preference, lesson, gotcha, project fact, or correction.",
          "Good memories include enough context to be useful later, especially why the fact matters.",
        ],
      },
      {
        heading: "Session",
        body: [
          "A session is a period of work with an AI agent. The session itself is noisy, but it contains decisions, constraints, and lessons worth carrying forward.",
          "Origin does not preserve every token as the primary interface. It extracts the durable parts and makes them searchable later.",
        ],
      },
      {
        heading: "Handoff",
        body: [
          "A handoff is the compact end-of-session record that lets a future agent resume without starting cold.",
          "It usually includes what changed, what was decided, what remains open, and what the next agent should know before acting.",
        ],
      },
      {
        heading: "Distilled pages",
        body: [
          "Distilled pages are wiki-style Markdown artifacts synthesized from related memories. They make accumulated context easier to inspect than a long list of individual captures.",
          "Pages are useful when a project, workflow, or concept keeps coming back across many sessions.",
        ],
      },
      {
        heading: "Daemon and MCP",
        body: [
          "The local daemon is the source of truth. It owns the database, search, distill cycles, provenance, and API.",
          "The MCP server is the bridge. Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, and other MCP clients can connect to the same local memory layer.",
        ],
      },
      {
        heading: "Markdown plus local index",
        body: [
          "Origin keeps human-readable artifacts in Markdown while the local database keeps indexes, metadata, graph structure, and retrieval state.",
          "That split matters for trust. The database helps agents search quickly, but the record is something you can inspect and control.",
        ],
      },
      {
        heading: "No model required",
        body: [
          "Origin gives you storage, embeddings, dedupe, hybrid search, and MCP recall without requiring a local model or API key.",
          "Claude Code skills can still classify captures, write handoffs, and distill pages because the agent already has language intelligence in the session.",
        ],
      },
    ],
    nextSlug: "architecture",
  },
  {
    slug: "architecture",
    group: "Reference",
    eyebrow: "Architecture",
    title: "Architecture",
    description:
      "How Origin is put together: one local daemon, thin clients, shared wire types, local artifacts, and retrieval owned by origin-core.",
    metaTitle: "Origin Architecture | Docs",
    metaDescription:
      "Understand Origin's daemon-first architecture, Cargo workspace crates, MCP connector, Claude Code plugin, local data layout, and retrieval pipeline.",
    keywords: [
      "Origin architecture",
      "Origin daemon",
      "origin-core",
      "origin-mcp architecture",
      "local AI work memory architecture",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "7 min read",
    summary: [
      "Origin is daemon-first: origin-server owns storage, search, pages, graph context, distill cycles, and the HTTP API.",
      "Claude Code, MCP clients, the CLI, and local tools are thin clients over the same local source of truth.",
    ],
    sections: [
      {
        heading: "The boundary",
        body: [
          "Origin keeps product behavior in one local daemon instead of scattering memory logic across every client. The daemon listens on 127.0.0.1:7878 and owns the database, embeddings, search, pages, graph context, and distill cycles.",
          "That boundary is what lets Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, VS Code, and terminal commands share the same memory layer without each tool inventing its own store.",
        ],
      },
      {
        heading: "Workspace map",
        body: [
          "The public repository is a Cargo workspace. The desktop app lives in a separate repo, while the local runtime, CLI, MCP server, shared wire types, core logic, and Claude Code plugin live together.",
        ],
        code: {
          label: "Repository map",
          code: architectureMap,
        },
      },
      {
        heading: "Runtime flow",
        body: [
          "A client stores or recalls memory through HTTP, MCP, or the CLI. origin-server frames the request and calls origin-core. origin-core handles storage, hybrid retrieval, knowledge graph context, pages, quality gates, enrichment, and eval-facing logic.",
          "The client receives a compact response: memories, pages, decisions, graph context, or diagnostic state. The source of truth stays local.",
        ],
        bullets: [
          "Claude Code plugin: slash commands such as /brief, /capture, /recall, /distill, and /handoff.",
          "origin-mcp: MCP tools such as context, capture, recall, distill, list_pending, confirm_memory, forget, and doctor.",
          "origin CLI: setup, service management, status, recall, search, store, spaces, model, key, and doctor.",
        ],
      },
      {
        heading: "Storage and retrieval",
        body: [
          "The local database uses libSQL for document chunks, vector search, FTS5 search, graph tables, pages, and metadata. Recall combines vector search, full-text search, graph context, and relevant pages with Reciprocal Rank Fusion.",
          "Human-facing artifacts stay under ~/.origin. Pages and session logs are Markdown. The database is the index and retrieval substrate; the readable artifacts are the record people can inspect.",
        ],
      },
      {
        heading: "Model paths",
        body: [
          "Local memory mode works without a model download or API key. Store, embed, search, recall, and MCP memory are available immediately.",
          "On-device models and Anthropic keys are optional. They unlock heavier extraction, page synthesis, recaps, and richer distill cycles, but the basic memory loop does not depend on them.",
        ],
      },
      {
        heading: "Platform services",
        body: [
          "Origin installs a local runtime into ~/.origin/bin. The service manager differs by operating system: launchd on macOS, systemd user units on Linux, and a per-user Task Scheduler logon task on Windows.",
          "The same daemon contract is used across platforms. Cross-platform support in the public release covers macOS arm64/x64, Linux x86_64/aarch64 with glibc, and Windows x86_64.",
        ],
      },
      {
        heading: "Why this shape",
        body: [
          "The daemon-first shape keeps memory behavior consistent. It also makes Origin easier to test: origin-core has no Axum or Tauri dependency, origin-types stays lightweight, and clients do not own business logic.",
          "For users, the practical result is simpler: one local home for AI work context, with multiple tools reading and writing through the same boundary.",
        ],
        link: {
          label: "View the source repository",
          href: "https://github.com/7xuanlu/origin",
        },
      },
    ],
    nextSlug: "commands",
  },
  {
    slug: "commands",
    group: "Reference",
    eyebrow: "Reference",
    title: "Commands and Tools",
    description:
      "The essential Claude Code commands and MCP tools for running Origin day to day.",
    metaTitle: "Origin Commands and MCP Tools | Docs",
    metaDescription:
      "Reference the daily Origin Claude Code commands and MCP tools: /init, /brief, context, /capture, /recall, /handoff, scoped /review, /distill, and doctor.",
    keywords: [
      "Origin commands",
      "MCP tools",
      "Claude Code slash commands",
      "capture handoff recall",
      "distill review",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Most Claude Code users need /init for setup, then four daily commands: /brief, /capture, /recall, and /handoff.",
      "MCP clients start with context, then use capture, recall, distill, list pending, confirm memory, forget, and doctor.",
    ],
    sections: [
      {
        heading: "Daily commands",
        body: [
          "Use these commands for the normal memory loop in Claude Code.",
        ],
        bullets: [
          "/init: install or verify the daemon, plugin, MCP route, and memory round trip.",
          "/brief: load relevant context at the start of a session.",
          "/capture: save one durable memory with the reason it matters.",
          "/recall: search local memory for a specific topic.",
          "/handoff: close a session with decisions, lessons, gotchas, and next context.",
        ],
      },
      {
        heading: "Curation commands",
        body: [
          "Use these when memory needs inspection, cleanup, or synthesis.",
        ],
        bullets: [
          "/review captures: walk unconfirmed captures; bare /review only prints help.",
          "/review revisions: walk pending revisions when /brief shows more than the top few.",
          "/distill: synthesize related memories into wiki pages.",
          "/read: preview a distilled page from inside Claude Code.",
          "/forget: delete a memory by ID when it should not remain in Origin.",
          "/debrief: alias for /handoff.",
        ],
      },
      {
        heading: "MCP tools",
        body: [
          "Other MCP clients call tools instead of slash commands. The names are intentionally close to the Claude Code workflow.",
        ],
        bullets: [
          "context: load session context at the start of work or major topic shifts.",
          "capture: store a durable memory.",
          "recall: search for relevant memories.",
          "distill: synthesize or refresh pages.",
          "list_pending and confirm_memory: inspect and accept pending captures.",
          "forget: delete a memory.",
          "doctor: diagnose daemon and setup state.",
        ],
      },
      {
        heading: "How to choose",
        body: [
          "Start with /brief in Claude Code or context in another MCP client. Save durable knowledge with capture. Search history with recall. Close a serious session with /handoff.",
          "Use /review, /distill, and /read when memory needs maintenance or a topic deserves a page.",
        ],
      },
    ],
    nextSlug: "cli-and-service",
  },
  {
    slug: "cli-and-service",
    group: "Reference",
    eyebrow: "CLI",
    title: "CLI and Service Management",
    description:
      "Use the Origin CLI to install the runtime, manage the daemon, inspect status, search memory, and wire MCP clients.",
    metaTitle: "Origin CLI and Service Management | Docs",
    metaDescription:
      "Learn the Origin CLI commands for setup, daemon service management, doctor diagnostics, recall, search, store, spaces, and MCP client configuration.",
    keywords: [
      "Origin CLI",
      "origin doctor",
      "origin install",
      "origin service management",
      "origin mcp add",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "The origin CLI is the terminal control surface for setup, diagnostics, service management, recall, search, store, spaces, models, keys, and MCP config.",
      "The daemon still owns memory. The CLI talks to that daemon instead of writing the database directly.",
    ],
    sections: [
      {
        heading: "Install the runtime",
        body: [
          "For non-Claude Code clients, start by installing the local Origin runtime. This puts the CLI, daemon, and MCP connector under ~/.origin/bin.",
          "Claude Code plugin users can usually run /init instead; it verifies the same local runtime and MCP route from inside Claude Code.",
        ],
        code: {
          label: "Terminal",
          code: originSetupCommand,
        },
      },
      {
        heading: "Check the daemon",
        body: [
          "The daemon listens on 127.0.0.1:7878 and owns storage, search, pages, graph context, and distill cycles. Use status for a quick health check and doctor for a fuller setup report.",
          "Service installation is per-user. Origin uses launchd on macOS, systemd user units on Linux, and a Task Scheduler logon task on Windows.",
        ],
        code: {
          label: "Service commands",
          code: serviceCommands,
        },
      },
      {
        heading: "Use memory from the terminal",
        body: [
          "The CLI can recall, search, store, and list memory from scripts or from a plain terminal session. It is useful when you need a repeatable diagnostic or when your current tool does not expose Origin commands directly.",
          "Use specific queries. Project names, feature names, people, and decisions usually retrieve better context than generic phrases.",
        ],
        code: {
          label: "Daily CLI",
          code: cliDailyCommands,
        },
      },
      {
        heading: "Wire MCP clients",
        body: [
          "After setup, use origin mcp add to configure a supported MCP client. The command writes or previews the client-specific config that launches the local origin-mcp connector.",
          "Use --dry-run when you want to inspect the generated config before changing a client settings file.",
        ],
        code: {
          label: "MCP setup",
          code: "~/.origin/bin/origin mcp add codex\n~/.origin/bin/origin mcp add cursor --dry-run",
        },
      },
      {
        heading: "When to use the CLI",
        body: [
          "Use Claude Code slash commands for the richest daily workflow. Use MCP tools from clients that support them. Use the CLI for setup, diagnostics, scripts, service management, and cases where a client UI hides too much detail.",
          "All three paths reach the same daemon, so they should agree on memory state when setup is healthy.",
        ],
      },
    ],
    nextSlug: "http-api",
  },
  {
    slug: "http-api",
    group: "Reference",
    eyebrow: "API",
    title: "HTTP API",
    description:
      "Know the local daemon surfaces that the CLI, MCP connector, plugin, and local tools call under the hood.",
    metaTitle: "Origin HTTP API | Docs",
    metaDescription:
      "Reference Origin's local daemon HTTP API surfaces for health, setup, memory store/search, context, review, distill, model setup, and Anthropic key setup.",
    keywords: [
      "Origin HTTP API",
      "Origin daemon API",
      "127.0.0.1 7878",
      "AI memory API",
      "origin-server API",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "The daemon listens locally on 127.0.0.1:7878 and owns the HTTP API.",
      "Most users should use the plugin, MCP tools, or CLI; the HTTP API explains what those clients call underneath.",
    ],
    sections: [
      {
        heading: "Local daemon boundary",
        body: [
          "origin-server is the local API boundary. Clients do not write the database directly; they ask the daemon to store, search, recall, distill, confirm, or diagnose memory.",
          "The default bind address is 127.0.0.1:7878. That local-only default is part of the product boundary: one machine owns the memory layer unless you deliberately change daemon networking.",
        ],
      },
      {
        heading: "Main surfaces",
        body: [
          "The server README groups the public surfaces into health/status, setup, memory ingest/search, review, pages, and model/key setup.",
          "These are implementation-level routes, not a stability promise for third-party SDKs. For normal use, prefer the CLI or MCP tools.",
        ],
        code: {
          label: "Daemon routes",
          code: httpSurfaces,
        },
      },
      {
        heading: "Client mapping",
        body: [
          "Claude Code slash commands and MCP tools are product workflows over these routes. /brief and context ask for a context bundle. /capture and capture store one durable memory. /distill triggers page synthesis. doctor checks daemon and setup state.",
          "The CLI uses the same daemon for status, doctor, search, recall, store, list, model, key, MCP config, and spaces.",
        ],
      },
      {
        heading: "What not to build against yet",
        body: [
          "Origin is not positioning the HTTP API as a hosted memory SDK. It is primarily the local daemon contract for first-party clients and local tools.",
          "If you need automation, start with the CLI or MCP connector. They carry the current product semantics better than hand-written HTTP calls.",
        ],
      },
      {
        heading: "Diagnostics",
        body: [
          "If a client cannot reach memory, check daemon health first with origin doctor or the MCP doctor tool. Then inspect whether the client is launching origin-mcp and whether port 7878 is occupied by an old daemon.",
          "For bug reports, include the client, operating system, command you ran, expected result, actual result, and redacted doctor output.",
        ],
      },
    ],
    nextSlug: "spaces",
  },
  {
    slug: "spaces",
    group: "Reference",
    eyebrow: "Spaces",
    title: "Spaces",
    description:
      "Separate work, personal, client, and project memory so agents do not blend unrelated context.",
    metaTitle: "Origin Spaces | Docs",
    metaDescription:
      "Learn how Origin spaces isolate AI work memory by project, client, or context using ORIGIN_SPACE, spaces.toml, origin space commands, and doctor resolver state.",
    keywords: [
      "Origin spaces",
      "AI memory spaces",
      "ORIGIN_SPACE",
      "origin space commands",
      "separate AI work memory",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Spaces are memory buckets for different work contexts, such as origin, career, ideas, or a client project.",
      "They reduce context bleed while keeping one local daemon and one Origin installation.",
    ],
    sections: [
      {
        heading: "What a space is",
        body: [
          "A space is a named partition for memories, pages, and recall context. It is for separating work streams that should not automatically inform each other.",
          "Use spaces when you switch between clients, personal projects, experiments, or repos with very different context.",
        ],
      },
      {
        heading: "Set the active space",
        body: [
          "The most explicit override is ORIGIN_SPACE. It is useful when launching an agent for a specific context and you want every capture and recall to stay in that bucket.",
          "The CLI also includes origin space commands for listing, adding, inspecting, and moving spaces.",
        ],
        code: {
          label: "Space commands",
          code: spaceCommands,
        },
      },
      {
        heading: "Configure defaults",
        body: [
          "Origin can read space configuration from ~/.origin/spaces.toml. The plugin repository includes an example spaces.toml you can adapt.",
          "Use origin doctor when you are unsure which space is active. Doctor reports the resolver state so you can see whether environment, config, or project context selected the space.",
        ],
      },
      {
        heading: "How recall behaves",
        body: [
          "Recall should start inside the active space so a client project does not accidentally pull personal notes or an unrelated repo history.",
          "If you intentionally need cross-space context, move or recapture the durable fact into the right space rather than relying on accidental bleed.",
        ],
      },
      {
        heading: "What spaces are not",
        body: [
          "Spaces are not separate user accounts, encryption boundaries, or permission systems. They are product-level context separation inside your local Origin store.",
          "For sensitive work, still treat the whole local machine and connected AI client as part of the privacy boundary.",
        ],
      },
    ],
    nextSlug: "source-backed-pages",
  },
  {
    slug: "source-backed-pages",
    group: "Reference",
    eyebrow: "Pages",
    title: "Source-Backed Pages",
    description:
      "Understand how Origin turns atomic captures into readable pages with source memory IDs, revision state, and refresh paths.",
    metaTitle: "Origin Source-Backed Pages | Docs",
    metaDescription:
      "Learn how Origin distilled pages work: source-backed Markdown pages, provenance, stale reasons, revision state, /distill, and /read.",
    keywords: [
      "Origin pages",
      "source-backed pages",
      "distilled pages",
      "AI memory provenance",
      "Origin distill",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Atomic memories are good for recall, but repeated work eventually needs a readable synthesis.",
      "Origin pages are Markdown artifacts backed by source memories so the synthesized view is inspectable instead of anonymous.",
    ],
    sections: [
      {
        heading: "Why pages exist",
        body: [
          "Raw captures are intentionally small. That makes them easy to search, deduplicate, correct, and cite, but a mature project needs more than a long list of fragments.",
          "Distilled pages compose related captures into a wiki-style record. They are for concepts, projects, decisions, workflows, and recurring lessons that deserve a stable surface.",
        ],
      },
      {
        heading: "Provenance is mandatory",
        body: [
          "Origin tracks which memories contributed to a page. That source backing is part of the trust model: a page should not read like it appeared from nowhere.",
          "When a page feels wrong, inspect the source memories and either correct the memory, refresh the page, or capture the missing context.",
        ],
      },
      {
        heading: "Distill and read",
        body: [
          "/distill asks Origin to synthesize or refresh pages from related memories. /read previews a page inside the agent session without forcing you to leave the tool.",
          "Use distillation before a new project phase, after a long sprint, or when recall keeps surfacing the same cluster of memories.",
        ],
        code: {
          label: "Claude Code",
          code: "/distill\n/read <page>",
        },
      },
      {
        heading: "Staleness and revision state",
        body: [
          "Pages can become stale when new memories contradict them, extend them, or show that an old summary is no longer enough.",
          "Origin tracks revision state so refreshes can be deliberate. The point is not to overwrite human-readable records casually; it is to keep them improving as the project changes.",
        ],
      },
      {
        heading: "Edit carefully",
        body: [
          "The Markdown files are readable and can be inspected with normal tools. If you hand-edit a page, treat it like a human-owned artifact.",
          "When you need the system to learn something new, prefer capturing the atomic fact or correction too. That keeps search, provenance, and future pages aligned.",
        ],
      },
    ],
    nextSlug: "import-and-portability",
  },
  {
    slug: "import-and-portability",
    group: "Reference",
    eyebrow: "Portability",
    title: "Import and Portability",
    description:
      "Bring existing Markdown vault context into Origin and keep Origin's readable artifacts portable outside the daemon.",
    metaTitle: "Origin Import and Portability | Docs",
    metaDescription:
      "Import Markdown vault content into Origin, understand non-destructive import behavior, and read Origin's projected Markdown pages and session logs outside the daemon.",
    keywords: [
      "Origin import",
      "Origin portability",
      "Obsidian import",
      "Markdown vault import",
      "AI memory export",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Origin can import Markdown-style vault content without moving or deleting the original files.",
      "Origin's pages and session logs are readable Markdown, so the human record remains portable even though retrieval needs the daemon.",
    ],
    sections: [
      {
        heading: "What import is for",
        body: [
          "Import is useful when you already have durable project notes, meeting notes, research notes, or a Markdown vault that should become searchable AI work context.",
          "Do not import everything just because it exists. Origin works best when imported material is useful to future agents, not when the memory layer becomes a bulk file mirror.",
        ],
      },
      {
        heading: "Import a Markdown vault",
        body: [
          "The vault import path reads Markdown files, chunks them, embeds them, and stores them as imported memories. The source vault is not moved or deleted.",
          "Use a small representative vault first, then recall against it before importing a larger archive. That gives you a chance to see whether the imported context is useful or noisy.",
        ],
        code: {
          label: "Terminal",
          code: importPortabilityCommands,
        },
      },
      {
        heading: "Wikilinks and graph context",
        body: [
          "Markdown links and wiki-style relationships are useful signal, but they are not the same as the source-backed page model.",
          "Imported links can help graph context. Source-backed pages are stronger when Origin can trace the synthesized claim to the source memories that produced it.",
        ],
      },
      {
        heading: "Keep ownership clear",
        body: [
          "If another app is your knowledge-base source of truth, keep using it for polished notes. Use Origin for the AI work loop: captures, handoffs, source-backed pages, recall, and cross-client context.",
          "Running both is possible through MCP, but you still need a human rule for which system owns which kind of context.",
        ],
      },
      {
        heading: "Read Origin outside the daemon",
        body: [
          "Origin projects readable artifacts under ~/.origin, including pages and session handoffs. You can open those files in an editor or point a Markdown reader at them.",
          "Plain-text access is not the same as full Origin behavior. Capture, recall, dedupe, distill, review, forget, and index updates still need the daemon and CLI/MCP paths.",
        ],
      },
      {
        heading: "Privacy and backup caution",
        body: [
          "Imported vaults and exported-looking Markdown can contain sensitive project history. Do not publish ~/.origin, sync it to a cloud drive, or attach it to an issue without redaction.",
          "For backups, treat ~/.origin and the daemon data directory as private application data. If you need to recover or migrate machines, verify with origin doctor afterward so the daemon, index, and MCP config agree.",
        ],
      },
    ],
    nextSlug: "local-git-history",
  },
  {
    slug: "local-git-history",
    group: "Reference",
    eyebrow: "Versioning",
    title: "Local Git History",
    description:
      "Inspect the real git history Origin keeps for local memory, page, session, and status artifacts.",
    metaTitle: "Origin Local Git History | Docs",
    metaDescription:
      "Learn how Origin uses a real local git repository under ~/.origin/.git to version memory artifacts, pages, sessions, handoffs, and status files.",
    keywords: [
      "Origin git history",
      "AI memory versioning",
      "local git memory",
      "Origin handoff history",
      "inspect Origin pages",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Origin versions local artifacts with a real git repository under ~/.origin/.git.",
      "Git history is for inspection, accountability, recovery, and understanding what changed across sessions.",
    ],
    sections: [
      {
        heading: "What is versioned",
        body: [
          "Origin writes human-facing artifacts under ~/.origin, including pages, session handoffs, and current status records. Those artifacts are committed into a local git repository.",
          "The git log gives you a practical audit trail for memory work: what changed, when it changed, and which artifacts were touched.",
        ],
      },
      {
        heading: "Inspect history",
        body: [
          "Use normal git commands from ~/.origin to inspect recent memory writes and page changes. This is often faster than opening the database when you want to understand a human-readable change.",
          "The repository is local. It is not pushed anywhere unless you explicitly sync or publish it yourself.",
        ],
        code: {
          label: "Terminal",
          code: gitHistoryCommands,
        },
      },
      {
        heading: "Recover with care",
        body: [
          "Git can help recover a previous Markdown page or session note, but do not treat manual git restore as a full database rollback.",
          "If the durable knowledge is wrong, the safer product path is to capture a correction or forget the memory by ID. That keeps the index and readable artifacts aligned.",
        ],
      },
      {
        heading: "Use with your notes",
        body: [
          "Because pages and sessions are normal files, you can inspect them from editors, terminals, or personal note tools. Some users symlink pages into a vault for reading.",
          "Keep writes disciplined. Origin should remain the writer for generated artifacts unless you intentionally edit a human-owned page.",
        ],
        code: {
          label: "Example",
          code: "ln -s ~/.origin/pages ~/Documents/Origin-pages",
        },
      },
      {
        heading: "Privacy boundary",
        body: [
          "Local git history makes Origin more inspectable, but it also means old versions may contain old private context.",
          "Do not publish, sync, or attach ~/.origin blindly. Redact or create minimal reproductions when reporting bugs.",
        ],
      },
    ],
    nextSlug: "models-and-keys",
  },
  {
    slug: "models-and-keys",
    group: "Reference",
    eyebrow: "Models",
    title: "Models and Keys",
    description:
      "Choose between local memory mode, optional on-device models, and optional Anthropic API keys for richer distill cycles.",
    metaTitle: "Origin Models and Keys | Docs",
    metaDescription:
      "Understand Origin setup modes: no-model local memory, optional on-device models, optional Anthropic API keys, model status, key status, and privacy implications.",
    keywords: [
      "Origin models",
      "Origin API keys",
      "local memory mode",
      "Qwen3-4B",
      "Anthropic API key",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Origin works without downloading a local model or adding an API key.",
      "Optional models and keys add heavier language work such as extraction, page synthesis, recaps, and richer distill cycles.",
    ],
    sections: [
      {
        heading: "Three setup levels",
        body: [
          "Start with local memory mode unless you know you need automated language-heavy maintenance. It gives you storage, embeddings, dedupe, hybrid search, MCP recall, and local artifacts.",
          "Add an on-device model or Anthropic key when you want richer daemon-side extraction, page synthesis, recaps, and knowledge graph work.",
        ],
        code: {
          label: "Setup options",
          code: modelSetupCommands,
        },
      },
      {
        heading: "Local memory mode",
        body: [
          "Local memory mode is the no-model default. It is enough for the core work loop: brief, capture, recall, handoff, distill from the agent side, and inspect local artifacts.",
          "This mode is also the right starting point when you want the smallest install path or when a machine cannot run local model inference comfortably.",
        ],
      },
      {
        heading: "On-device model",
        body: [
          "An on-device model lets the daemon perform more language work locally. It can help with classification, extraction, title generation, recaps, and other maintenance tasks without sending those daemon-side prompts to an external API.",
          "Local model capability is still bounded by hardware and context limits. For large distillation jobs, an API provider can be stronger when you choose to configure one.",
        ],
      },
      {
        heading: "Anthropic key",
        body: [
          "A configured Anthropic key is bring-your-own-key for daemon-side language tasks. It is optional and should be treated as an explicit tradeoff: stronger language work in exchange for sending the relevant task prompt to the API provider.",
          "Your connected AI client may already call its own provider during normal chat. This page only describes Origin's daemon-side model and key paths.",
        ],
      },
      {
        heading: "Agent-side fallback",
        body: [
          "Claude Code skills can classify captures, write handoffs, and synthesize pages from inside the active agent session. That is why Origin remains useful before you configure a daemon model.",
          "The daemon stays the store and retrieval layer. The agent can supply language judgment when it is already in the work context.",
        ],
      },
    ],
    nextSlug: "advanced-retrieval",
  },
  {
    slug: "advanced-retrieval",
    group: "Reference",
    eyebrow: "Retrieval",
    title: "Advanced Retrieval Status",
    description:
      "Understand Origin's shipped retrieval path and the opt-in main-branch experiments behind newer retrieval work.",
    metaTitle: "Origin Advanced Retrieval Status | Docs",
    metaDescription:
      "Read Origin's retrieval status: shipped hybrid retrieval, page channel, graph context, evaluation limits, and opt-in experimental flags on main.",
    keywords: [
      "Origin retrieval",
      "hybrid retrieval",
      "AI memory retrieval",
      "LongMemEval",
      "LoCoMo",
      "retrieval flags",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "The stable public path is hybrid retrieval over embeddings, FTS5, pages, and graph context.",
      "Recent main-branch PRs add many opt-in retrieval experiments; treat them as evaluation work until a release promotes them.",
    ],
    sections: [
      {
        heading: "Stable retrieval path",
        body: [
          "Origin's released retrieval combines vector embeddings, FTS5 full-text search, graph context, pages, and Reciprocal Rank Fusion. The goal is not a single magic ranking signal; it is a compact context bundle that helps the next AI session continue work.",
          "The public README snapshot reports retrieval metrics, not end-to-end answer quality. Read the evaluation page before using the numbers in comparisons.",
        ],
      },
      {
        heading: "Pages are part of retrieval",
        body: [
          "Origin treats distilled pages as retrieval surfaces, not only as human-readable notes. That matters because repeated project context often becomes clearer as a page than as isolated captures.",
          "A useful recall can include atomic memories, source-backed pages, graph neighbors, and decisions. The best result set is the one that gives the agent enough context without replaying a full chat history.",
        ],
      },
      {
        heading: "Opt-in main-branch work",
        body: [
          "After v0.7.0, main received a large opt-in retrieval batch. Examples include graph gates, temporal filters, query decomposition, FTS hardening, session diversity, salience priors, fact channels, k-hop graph traversal, global preludes, CoT retrieval, LLM routing, and context compression.",
          "These flags are useful for development and evaluation, but they should not be described as default product behavior until the release notes say so.",
        ],
        code: {
          label: "Example opt-in flags",
          code: retrievalFlags,
        },
      },
      {
        heading: "How to read experiments",
        body: [
          "A retrieval experiment can improve one benchmark slice and hurt another. Origin's eval discipline is deliberately conservative: compare under the same schema, fixture revision, embedder, and run protocol.",
          "When a feature is opt-in, the docs should say which problem it targets and which release status it has instead of implying it is the normal user path.",
        ],
      },
      {
        heading: "When to care",
        body: [
          "Most users should care about whether /brief, context, and recall bring the right project facts forward. Maintainers should care about benchmark slices, regression guards, and whether new retrieval work reduces real cold starts.",
          "If recall feels weak, first improve the query and capture quality. Then distill repeated topics into pages before reaching for experimental retrieval flags.",
        ],
      },
    ],
    nextSlug: "data-and-privacy",
  },
  {
    slug: "data-and-privacy",
    group: "Reference",
    eyebrow: "Local control",
    title: "Data and Privacy",
    description:
      "Where Origin keeps data, what stays local, and how Markdown records work with the local index.",
    metaTitle: "Origin Data and Privacy | Docs",
    metaDescription:
      "Understand Origin local storage, local memory setup, optional model/API paths, Markdown records, the local index, and deletion controls.",
    keywords: [
      "Origin data privacy",
      "local AI work memory storage",
      "Markdown records",
      "local-first privacy",
      "deletion controls",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Origin is local-first: the memory layer is owned by the daemon on your machine.",
      "Markdown artifacts remain readable while the database stores retrieval indexes and metadata.",
    ],
    sections: [
      {
        heading: "Local-first by default",
        body: [
          "Origin is designed so the durable context your agents use lives locally first. That context can include project decisions, private constraints, preferences, and work history.",
          "Connected AI tools may still send prompts to their own model providers. Origin's job is to keep the memory layer itself local, inspectable, and shared across tools.",
        ],
      },
      {
        heading: "Where data lives",
        body: [
          "Origin exposes human-facing artifacts under ~/.origin. The daemon database lives under the macOS application support directory and is linked from ~/.origin/db for convenience.",
          "The important files are readable without a special app: pages are Markdown, session logs are Markdown, and project status is stored beside the session records.",
        ],
        bullets: [
          "~/.origin/pages/: distilled wiki pages.",
          "~/.origin/sessions/: session handoff logs.",
          "~/.origin/sessions/_status/: current project status records.",
          "~/.origin/bin/: installed Origin CLI, daemon, and MCP connector binaries.",
          "~/.origin/db/: link to the daemon's local database store.",
          "~/Library/Application Support/origin/: daemon-owned application data.",
        ],
      },
      {
        heading: "Markdown and the local index",
        body: [
          "Markdown is the record you can read. The database is the index agents use to retrieve quickly.",
          "This avoids treating the database as an opaque source of truth. Search can be fast and structured while the important artifacts remain inspectable.",
        ],
      },
      {
        heading: "Local memory setup",
        body: [
          "Origin stores, embeds, deduplicates, and serves hybrid search without requiring a local model download or Anthropic API key.",
          "Optional model and API paths can add heavier language features, but they are not required for the basic memory loop.",
        ],
      },
      {
        heading: "Correction and deletion",
        body: [
          "If a memory is wrong, capture the correction with why it supersedes the old fact. If a memory should be removed entirely, use /forget with the memory ID.",
          "For distilled pages, inspect the Markdown directly. User-edited pages are treated carefully so automated distillation does not overwrite human work casually.",
        ],
      },
    ],
    nextSlug: "configuration",
  },
  {
    slug: "configuration",
    group: "Reference",
    eyebrow: "Configuration",
    title: "Configuration",
    description:
      "Know the Origin settings that matter: spaces, MCP client wiring, daemon bind address, local paths, models, and keys.",
    metaTitle: "Origin Configuration | Docs",
    metaDescription:
      "Configure Origin spaces, MCP clients, daemon bind address, local paths, models, API keys, and repair checks without editing the database by hand.",
    keywords: [
      "Origin configuration",
      "Origin settings",
      "ORIGIN_SPACE",
      "ORIGIN_BIND_ADDR",
      "origin spaces.toml",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Most configuration should go through /init, origin setup, origin mcp add, origin model, origin key, or origin space.",
      "The only environment knobs most users need are ORIGIN_SPACE and, rarely, ORIGIN_BIND_ADDR.",
    ],
    sections: [
      {
        heading: "Use commands first",
        body: [
          "Origin is configured through the plugin, CLI, and MCP connector. Start with /init in Claude Code or npx -y @7xuanlu/origin setup for other MCP clients.",
          "Use origin doctor after changing setup. It checks the daemon, local runtime, MCP connector, model state, key state, and common path issues.",
        ],
        code: {
          label: "Setup checks",
          code: "/init\norigin doctor",
        },
      },
      {
        heading: "Spaces",
        body: [
          "Spaces separate work, personal, client, and project memory without requiring multiple Origin installs. Set a space for a shell session with ORIGIN_SPACE, or define stable spaces in ~/.origin/spaces.toml.",
          "Use origin space commands when you want the CLI to list, create, inspect, or move spaces instead of editing the file directly.",
        ],
        code: {
          label: "Space config",
          code: "ORIGIN_SPACE=client-a claude\norigin space list\norigin space add client-a",
        },
      },
      {
        heading: "MCP client wiring",
        body: [
          "MCP clients need to launch the same local origin-mcp connector. The normal path is origin mcp add because each client stores MCP config differently.",
          "If a client requires manual JSON, use origin mcp add --dry-run to inspect the command path for your machine, then paste the generated shape into that client's settings.",
        ],
        code: {
          label: "Client config",
          code: mcpAddCommand,
        },
      },
      {
        heading: "Daemon bind address",
        body: [
          "The daemon binds to 127.0.0.1:7878 by default. That is the right setting for normal laptop use because the memory API stays local to the machine.",
          "Only change ORIGIN_BIND_ADDR when you deliberately need a non-loopback bind, such as a Docker or VM environment. Exposing the daemon is a privacy decision, not a normal setup step.",
        ],
        code: {
          label: "Environment",
          code: configurationKnobs,
        },
      },
      {
        heading: "Local files",
        body: [
          "Human-facing Origin artifacts live under ~/.origin. The daemon-owned database and platform service files live under the OS application data location.",
          "Read Markdown pages and session logs freely. Avoid hand-editing the database; use capture, review, distill, forget, and the CLI so the index, pages, and metadata stay consistent.",
        ],
        code: {
          label: "Paths",
          code: configurationFiles,
        },
      },
      {
        heading: "Models and keys",
        body: [
          "Origin works in local memory mode without a model download or API key. Configure a model or Anthropic key only when you want daemon-side language work such as richer extraction, recaps, or page synthesis.",
          "Treat keys as an explicit opt-in. The connected AI client may already call its own provider during chat; Origin's model and key settings only cover daemon-side work.",
        ],
        link: {
          label: "Read models and keys",
          href: "/docs/models-and-keys",
        },
      },
    ],
    nextSlug: "mcp-clients",
  },
  {
    slug: "mcp-clients",
    group: "Reference",
    eyebrow: "MCP",
    title: "Connect MCP Clients",
    description:
      "Use one local Origin memory layer from Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, and other MCP clients.",
    metaTitle: "Connect MCP Clients to Origin | Docs",
    metaDescription:
      "Run npx -y @7xuanlu/origin setup, add Origin with origin mcp add, and share one local AI work memory layer across MCP-compatible tools.",
    keywords: [
      "MCP client setup",
      "Claude Code MCP",
      "Cursor MCP",
      "Codex MCP",
      "Gemini CLI MCP",
      "origin-mcp",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "Origin's daemon is the local source of truth; origin-mcp is the bridge MCP clients launch.",
      "Claude Code users should start with the plugin. Other clients should run Origin setup first, then let the CLI add the MCP server config.",
    ],
    sections: [
      {
        heading: "How the pieces connect",
        body: [
          "The daemon runs locally and owns memory. origin-mcp is the connector MCP clients spawn when they need Origin tools.",
          "Once connected, a client can load context, capture, recall, distill, confirm, forget, and diagnose memory.",
        ],
      },
      {
        heading: "Set up the local runtime",
        body: [
          "Run this once before wiring another MCP client. It prepares the local Origin runtime that origin-mcp talks to.",
        ],
        code: {
          label: "Terminal",
          code: originSetupCommand,
        },
      },
      {
        heading: "Add a client",
        body: [
          "After setup, ask the Origin CLI to write the client-specific MCP configuration. It uses the local origin-mcp binary installed beside the CLI, with npm as a fallback when needed.",
        ],
        code: {
          label: "Terminal",
          code: mcpAddCommand,
        },
      },
      {
        heading: "Manual config fallback",
        body: [
          "If a client only accepts a raw JSON configuration, point it at the local MCP connector that setup installed. Use origin mcp add --dry-run to see the exact path for your machine.",
        ],
        code: {
          label: "mcpServers",
          code: mcpConfig,
        },
      },
      {
        heading: "Claude Code",
        body: [
          "The Claude Code plugin is the most complete path because it includes slash commands, setup checks, and the daily workflow around the MCP server.",
          "After installing the plugin, restart Claude Code if prompted, then run /init.",
        ],
        code: {
          label: "Claude Code",
          code: "/plugin marketplace add 7xuanlu/origin\n/plugin install origin@7xuanlu\n/init",
        },
      },
      {
        heading: "Other clients",
        body: [
          "Codex, Cursor, Claude Desktop, Gemini CLI, and other MCP clients can use origin mcp add when the client is supported.",
          "The settings screen differs by client. The important part is that the client launches the Origin MCP connector installed by setup.",
        ],
      },
      {
        heading: "Verify the connection",
        body: [
          "After connecting a client, run its available Origin doctor or recall tool. Then capture one small durable fact and recall it from another session or client.",
          "If that round trip works, the client is using the same local memory layer.",
        ],
      },
    ],
    nextSlug: "troubleshooting",
  },
  {
    slug: "troubleshooting",
    group: "Reference",
    eyebrow: "Repair",
    title: "Troubleshooting",
    description:
      "Fix the common setup issues: daemon not running, MCP not connected, missing Claude commands, stale context, and support escalation.",
    metaTitle: "Origin Troubleshooting | Docs",
    metaDescription:
      "Troubleshoot Origin setup issues with the daemon, MCP connection, Claude Code plugin commands, origin mcp add, port 7878, and memory recall.",
    keywords: [
      "Origin troubleshooting",
      "daemon not running",
      "MCP connection issues",
      "port 7878",
      "doctor command",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Start with /init in Claude Code, origin doctor in the terminal, or the doctor tool in an MCP client.",
      "Most issues are one of three things: daemon not reachable, MCP server not configured, or the client needs a restart.",
    ],
    sections: [
      {
        heading: "Claude Code commands are missing",
        body: [
          "If /brief, /capture, or /handoff do not appear after installing the plugin, restart Claude Code once.",
          "Then run /init. It should verify the plugin, daemon, MCP route, and memory round trip.",
        ],
        code: {
          label: "Claude Code",
          code: "/init",
        },
      },
      {
        heading: "Daemon is not reachable",
        body: [
          "Origin's daemon listens locally on port 7878. If a client cannot reach it, use /init from Claude Code or the doctor tool from an MCP client to check the daemon state.",
          "For non-Claude clients, rerun npx -y @7xuanlu/origin setup if the local runtime was never installed or status verification failed.",
          "Only one daemon should own the local database. If you have been developing Origin locally, make sure an old daemon from another checkout is not still running.",
        ],
      },
      {
        heading: "MCP client is not connected",
        body: [
          "Check that you ran npx -y @7xuanlu/origin setup first, then ran ~/.origin/bin/origin mcp add for that client. Some clients require a full restart after changing MCP settings.",
          "If the client shows the server but tools fail, run doctor. It reports whether the daemon is reachable and how setup is configured.",
        ],
        code: {
          label: "MCP config",
          code: mcpConfig,
        },
      },
      {
        heading: "Recall returns weak context",
        body: [
          "First make the recall query more specific. Include project names, feature names, decisions, people, or the exact failure mode.",
          "If the memory exists but is stale or duplicated, use /review for pending queues and /distill when a topic deserves a clearer page.",
        ],
      },
      {
        heading: "When to open an issue",
        body: [
          "If /init or doctor reports a daemon, MCP, or install failure you cannot resolve, open a GitHub issue with the client name, command you ran, and the diagnostic output.",
          "Avoid pasting private memory contents into public issues. Describe the setup failure and redact project-specific details.",
        ],
        link: {
          label: "Open a GitHub issue",
          href: "https://github.com/7xuanlu/origin/issues",
        },
      },
    ],
    nextSlug: "evaluation",
  },
  {
    slug: "evaluation",
    group: "Project",
    eyebrow: "Evaluation",
    title: "Evaluation",
    description:
      "What Origin's published retrieval numbers mean, how they are generated, and what they do not claim.",
    metaTitle: "Origin Evaluation and Benchmarks | Docs",
    metaDescription:
      "Read Origin's benchmark methodology, current retrieval snapshot, eval scope, and how to rerun LoCoMo and LongMemEval locally.",
    keywords: [
      "Origin evaluation",
      "Origin benchmarks",
      "LongMemEval",
      "LoCoMo",
      "AI memory retrieval benchmark",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "The public numbers are retrieval metrics, not end-to-end answer quality claims.",
      "The current README snapshot reports 93.6% Recall@5 on LongMemEval oracle and 70.0% Recall@5 on LoCoMo locomo10.",
    ],
    sections: [
      {
        heading: "Current snapshot",
        body: [
          "Origin's README publishes a compact retrieval snapshot for the shipped hybrid retrieval path. The snapshot uses BGE-Base-EN-v1.5-Q embeddings, FTS5, Reciprocal Rank Fusion, and the latest shipped local rerank path when enabled.",
          "The numbers below are the public README snapshot from the daemon repository. They should be read as retrieval-only metrics over the stated fixtures.",
        ],
        code: {
          label: "README snapshot",
          code: evalSnapshot,
        },
      },
      {
        heading: "What is measured",
        body: [
          "The headline metrics are Recall@5, MRR, and NDCG@10. They measure whether the retrieval layer surfaces relevant context near the top of the result set.",
          "This is useful because Origin's job is to bring the right memories, pages, decisions, and graph context into the next agent session. It does not prove that a downstream model will always answer correctly.",
        ],
      },
      {
        heading: "What is not measured",
        body: [
          "The published table is not a full product-quality score, a guarantee of answer quality, or a latency benchmark. It is also not a cross-product claim unless the comparison page explicitly states the protocol.",
          "Single-run snapshots are useful for development direction. Public claims that compare improvements should be regenerated under the current schema and, for headline claims, backed by repeated runs or documented methodology.",
        ],
      },
      {
        heading: "Where the harness lives",
        body: [
          "The eval harness lives in crates/origin-core/src/eval. The workflow docs live in docs/eval in the Origin repository.",
          "Slow GPU or API-backed evals are manual. Normal CI avoids running heavy model benchmarks because hosted runners do not provide the right hardware, secrets, or cost profile.",
        ],
        bullets: [
          "LoCoMo and LongMemEval use Recall@5, MRR, and NDCG@10 headline fields.",
          "The README updater reads a local metrics JSON and writes the tracked README snapshot.",
          "Raw local baseline artifacts stay outside git; the repository keeps the methodology and curated snapshot.",
        ],
      },
      {
        heading: "How to rerun",
        body: [
          "Clone the repository, follow the eval docs, and run the appropriate ignored eval harness command for the benchmark you want to reproduce. Expect slow runs when local models or judges are involved.",
          "When comparing two retrieval modes, regenerate both sides under the same schema and fixture revision. Cross-schema comparisons are treated as invalid by the repository's eval discipline.",
        ],
        link: {
          label: "Open eval docs on GitHub",
          href: "https://github.com/7xuanlu/origin/tree/main/docs/eval",
        },
      },
    ],
    nextSlug: "changelog",
  },
  {
    slug: "changelog",
    group: "Project",
    eyebrow: "Releases",
    title: "Changelog",
    description:
      "The public release history for Origin, plus how to read unreleased work on main.",
    metaTitle: "Origin Changelog | Docs",
    metaDescription:
      "Review Origin's public release history, current stable release, recent milestones, and links to the full GitHub changelog.",
    keywords: [
      "Origin changelog",
      "Origin releases",
      "Origin version 0.7.0",
      "origin-mcp release notes",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "The current stable release in the repository changelog is v0.7.0, dated 2026-05-24.",
      "Recent main-branch work after v0.7.0 is visible through merged PRs, but it should be treated as unreleased until the next release lands.",
    ],
    sections: [
      {
        heading: "Current stable release",
        body: [
          "Origin v0.7.0 is the current stable release recorded in CHANGELOG.md and the release-please manifest. It shipped cross-platform Linux and Windows support, spaces, eval reproducibility work, page and KG faithfulness benchmarks, and release pipeline hardening.",
          "The website keeps public install and product claims aligned to the stable release unless a page explicitly labels a feature as unreleased or on main.",
        ],
      },
      {
        heading: "v0.7.0 highlights",
        body: [
          "The v0.7.0 release broadened Origin from a macOS-first local runtime into a cross-platform local memory layer with explicit spaces and stronger evaluation discipline.",
        ],
        bullets: [
          "Cross-platform runtime support for macOS, Linux, and Windows.",
          "origin space subcommands and doctor resolver state.",
          "Plugin and server space resolver plumbing.",
          "KG-faithfulness and page-distillation faithfulness benchmarks.",
          "Structured binary judge and reproducibility foundations for evals.",
          "Release pipeline fixes for crates, npm, Homebrew, and version sync.",
        ],
      },
      {
        heading: "Earlier milestones",
        body: [
          "The v0.6.x line introduced the domain-to-space transition, curation workflows, pending revisions, and stronger daemon/client boundaries.",
          "The v0.5.x line merged the MCP server and Claude Code plugin into the monorepo, established the locked skill set, and made the public packages line up with the repo runtime.",
        ],
      },
      {
        heading: "Unreleased main work",
        body: [
          "After v0.7.0, main has received a wave of opt-in retrieval, refinery, and read-time experiments. Examples include query decomposition, graph activation gates, FTS hardening, temporal filters, session diversification, salience priors, fact channels, k-hop graph traversal, global preludes, background reflection debounce, CoT retrieval, and LLM read-time routing.",
          "Those PRs are useful signals for roadmap direction, but public users should treat them as main-branch work until a release entry publishes them.",
        ],
      },
      {
        heading: "Where to follow releases",
        body: [
          "GitHub releases are the canonical place to inspect release artifacts. CHANGELOG.md is generated by release-please and records the release history in the source repo.",
        ],
        link: {
          label: "View full changelog",
          href: "https://github.com/7xuanlu/origin/blob/main/CHANGELOG.md",
        },
      },
    ],
    nextSlug: "roadmap",
  },
  {
    slug: "roadmap",
    group: "Project",
    eyebrow: "Roadmap",
    title: "Roadmap and Status",
    description:
      "How to read Origin's current direction without confusing released features, main-branch work, and future bets.",
    metaTitle: "Origin Roadmap and Status | Docs",
    metaDescription:
      "Understand Origin's roadmap themes: reliable retrieval, provenance, local control, cross-client setup, eval discipline, and release status.",
    keywords: [
      "Origin roadmap",
      "Origin project status",
      "AI work memory roadmap",
      "Origin future releases",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "Origin's roadmap is centered on making AI work compound: better retrieval, better provenance, better handoffs, and safer local control.",
      "Roadmap items are directional, not promises. Stable release notes remain the source of truth for what shipped.",
    ],
    sections: [
      {
        heading: "Status model",
        body: [
          "Origin uses three practical status buckets: released, on main, and planned. Released means it appears in CHANGELOG.md or the current README install path. On main means merged but not necessarily released. Planned means a product direction, not a promise.",
          "This distinction matters because the repository moves quickly. The website should help users understand what they can rely on today without hiding where the project is going.",
        ],
      },
      {
        heading: "Released now",
        body: [
          "The released public shape is local-first AI work memory: Claude Code plugin, MCP server, CLI setup, daemon, local memory, hybrid retrieval, spaces, Markdown artifacts, source-backed pages, git versioning, and cross-platform runtime support.",
          "That is enough for the core loop: brief, capture, recall, handoff, distill, and inspect local artifacts.",
        ],
      },
      {
        heading: "Current development themes",
        body: [
          "Recent merged PRs show a strong focus on retrieval quality and memory maintenance. Most of that work is opt-in while it is evaluated.",
          "The useful way to read the direction is not as a pile of toggles, but as one goal: make the next AI session receive the smallest, most relevant, most trustworthy context bundle.",
        ],
        bullets: [
          "Retrieval quality: query decomposition, temporal filters, graph gates, FTS hardening, salience, session diversity, and read-time routing.",
          "Context composition: page channels, global preludes, context compression, fact channels, and iterative retrieval.",
          "Memory maintenance: deduplication, contradiction resolution, stale page refresh, soft eviction, and background reflection.",
          "Trust and provenance: source-backed pages, review queues, revision state, and visible local git history.",
        ],
      },
      {
        heading: "Near-term documentation gaps",
        body: [
          "The product docs should stay practical. Setup, daily workflow, capture quality, architecture, commands, CLI/service management, HTTP API, spaces, source-backed pages, import and portability, local git history, models and keys, retrieval status, data and privacy, configuration, evaluation, and troubleshooting are the current core path.",
          "The remaining gaps are deeper per-endpoint API examples, release-specific upgrade notes, and mature retrieval docs once opt-in experiments become stable defaults.",
        ],
      },
      {
        heading: "How to judge progress",
        body: [
          "For users, progress should show up as fewer cold starts, fewer repeated explanations, better recall, and more inspectable context. For maintainers, progress should show up in eval snapshots, smaller PRs, and clearer release notes.",
          "The project avoids a broad workflow-suite shape. The goal is a focused local memory layer for serious AI work, not a general productivity operating system.",
        ],
        link: {
          label: "Open current GitHub issues",
          href: "https://github.com/7xuanlu/origin/issues",
        },
      },
    ],
    nextSlug: "project-scope",
  },
  {
    slug: "project-scope",
    group: "Project",
    eyebrow: "Scope",
    title: "Project Scope",
    description:
      "What Origin is for, what it deliberately avoids, and how to decide whether it fits your AI work.",
    metaTitle: "Origin Project Scope | Docs",
    metaDescription:
      "Understand what Origin is and is not: local-first AI work memory, not a life OS, not a workflow suite, not a memory SDK, and not for one-off chats.",
    keywords: [
      "Origin project scope",
      "what Origin is not",
      "AI work memory scope",
      "local memory tool",
      "MCP memory scope",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Origin focuses on AI work context that spans sessions, projects, tools, and weeks.",
      "It deliberately avoids becoming a life OS, broad workflow suite, hosted memory SDK, or transcript archive.",
    ],
    sections: [
      {
        heading: "What Origin is for",
        body: [
          "Origin is for serious AI work where decisions, lessons, gotchas, project constraints, and handoffs need to survive beyond one chat.",
          "The product shape is narrow on purpose: one local daemon, shared memory across MCP clients, source-backed pages, review before trust, and readable local artifacts.",
        ],
      },
      {
        heading: "Not a life OS",
        body: [
          "Origin does not try to own habits, calendars, journaling, personal planning, or a full life-management system.",
          "Those domains can produce useful memories, but Origin's scope is the AI work artifact: what an agent needs to continue work correctly.",
        ],
      },
      {
        heading: "Not a workflow suite",
        body: [
          "Origin is not trying to bundle dozens of agents, research loops, and productivity workflows. It is the memory layer those workflows can use.",
          "That tradeoff keeps the product easier to understand: capture, recall, handoff, distill, inspect, and continue.",
        ],
      },
      {
        heading: "Not a memory SDK",
        body: [
          "Origin exposes a local daemon and MCP connector, but it is not positioned as backend infrastructure for other apps to add cloud memory features.",
          "The intended user is someone using AI tools daily who wants local, inspectable, shared work context.",
        ],
      },
      {
        heading: "Not for one-off chats",
        body: [
          "If a conversation is disposable, Origin may add more ceremony than value. The product starts paying off when work crosses sessions, tools, people, or weeks.",
          "A simple test: if the next agent should know it without you explaining it again, it probably belongs in Origin.",
        ],
      },
    ],
    nextSlug: "build-from-source",
  },
  {
    slug: "build-from-source",
    group: "Project",
    eyebrow: "Development",
    title: "Build from Source",
    description:
      "Build the Origin daemon, CLI, MCP server, shared types, core crate, and plugin from the public repository.",
    metaTitle: "Build Origin from Source | Docs",
    metaDescription:
      "Learn how to build Origin from source, run the daemon locally, understand workspace crates, and run contributor verification commands.",
    keywords: [
      "build Origin from source",
      "Origin development setup",
      "origin-server cargo build",
      "Origin Rust workspace",
      "contribute to Origin",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "The main repo is a Rust workspace with origin-core, origin-server, origin-cli, origin-mcp, and origin-types.",
      "Use the source build path for development; most users should install through the plugin or npx setup.",
    ],
    sections: [
      {
        heading: "When to build",
        body: [
          "Build from source when you are developing Origin, testing a branch, debugging the daemon, or preparing a contribution.",
          "If you only want to use Origin, install through the Claude Code plugin or npx setup instead. The release path installs prebuilt binaries into ~/.origin/bin.",
        ],
      },
      {
        heading: "Workspace build",
        body: [
          "The repository is a Cargo workspace. First builds can take several minutes, especially on macOS where llama.cpp compiles with Metal support.",
          "Run the daemon directly during development. For product-path testing, build release binaries and use origin setup, install, status, and doctor.",
        ],
        code: {
          label: "Source build",
          code: buildFromSourceCommands,
        },
      },
      {
        heading: "Crate boundaries",
        body: [
          "origin-core owns business logic and must stay free of Axum and Tauri dependencies. origin-server frames HTTP requests. origin-types stays lightweight because downstream clients consume it.",
          "origin-mcp bridges MCP clients to the daemon. origin-cli manages setup, service state, recall, search, store, spaces, models, keys, and doctor checks.",
        ],
      },
      {
        heading: "Platform notes",
        body: [
          "Origin supports macOS arm64/x64, Linux x86_64/aarch64 with glibc, and Windows x86_64. The service manager differs by platform: launchd, systemd user units, or a Task Scheduler logon task.",
          "Linux and Windows builds are CPU-only by default. macOS keeps Metal acceleration for local model paths.",
        ],
      },
      {
        heading: "Before opening a PR",
        body: [
          "Keep changes focused and evidence-backed. Add or update tests for behavior changes, run the relevant checks, and avoid unrelated refactors.",
          "Docs changes should remove ambiguity or stale public language. Eval changes should follow the repository's citation discipline instead of publishing unsupported headline claims.",
        ],
        link: {
          label: "Read CONTRIBUTING.md",
          href: "https://github.com/7xuanlu/origin/blob/main/CONTRIBUTING.md",
        },
      },
    ],
    nextSlug: "contributing",
  },
  {
    slug: "contributing",
    group: "Project",
    eyebrow: "Open source",
    title: "Contributing",
    description:
      "How to contribute useful bug reports, docs, eval cases, and code changes to Origin.",
    metaTitle: "Contributing to Origin | Docs",
    metaDescription:
      "Learn how to contribute to Origin: development setup, architecture boundaries, tests, linting, PR process, licensing, and useful issue reports.",
    keywords: [
      "contribute to Origin",
      "Origin open source",
      "Origin development setup",
      "Origin GitHub issues",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Bug reports, docs, eval cases, and focused code changes are welcome in the Apache-2.0 Origin repo.",
      "The daemon, CLI, MCP server, core, shared types, and Claude Code plugin live in the main repo; the desktop app lives separately.",
    ],
    sections: [
      {
        heading: "What belongs in the main repo",
        body: [
          "The main Origin repo contains origin-server, origin-core, origin-cli, origin-mcp, origin-types, and the Claude Code plugin. Runtime, memory behavior, MCP tooling, docs, evals, and release infrastructure belong there.",
          "The desktop app is a separate repository. If an issue is about the local runtime, CLI, MCP server, plugin, or memory behavior, the main repo is the right place.",
        ],
      },
      {
        heading: "Useful contributions",
        body: [
          "The most useful contributions are focused and evidence-backed. A good issue includes the client, operating system, exact command, expected behavior, actual behavior, and redacted diagnostic output from /init, doctor, or origin status.",
          "For code, keep PRs narrow. One logical change is easier to review, test, and release than a large bundle.",
        ],
        bullets: [
          "Bug fixes with a repro and the smallest relevant test.",
          "Docs that remove setup ambiguity or stale product language.",
          "Eval fixtures, methodology improvements, or clearer benchmark reporting.",
          "MCP/client setup fixes for supported clients.",
          "Platform-specific install and service-management fixes.",
        ],
      },
      {
        heading: "Development setup",
        body: [
          "Origin is a Rust workspace. You need Rust stable and the platform build tools for your OS. macOS builds may take several minutes on the first run while llama.cpp compiles for Metal.",
          "For local development, build the workspace and run origin-server directly. To test the product path, build the release binaries and use origin setup, install, status, and doctor.",
        ],
        code: {
          label: "Local development",
          code: "git clone https://github.com/7xuanlu/origin.git\ncd origin\ncargo build --workspace\ncargo run -p origin-server",
        },
      },
      {
        heading: "Verification",
        body: [
          "Before opening a PR, run the relevant tests and lint checks. The full workspace can be expensive, so use targeted crate tests while iterating and full checks before asking for merge.",
        ],
        code: {
          label: "Core checks",
          code: "cargo fmt --check --all\ncargo clippy --workspace --all-targets -- -D warnings\ncargo test --workspace",
        },
      },
      {
        heading: "Architecture rules",
        body: [
          "origin-core owns business logic and must stay free of Axum and Tauri dependencies. origin-server frames HTTP requests. origin-types stays lightweight because it is shared by the server, MCP connector, CLI, and downstream clients.",
          "MCP wrappers should deserialize typed wire responses instead of passing untyped JSON through silently. Route handlers should snapshot state before awaits instead of holding long-lived locks.",
        ],
      },
      {
        heading: "License",
        body: [
          "The main repo is Apache-2.0. By contributing, you agree that your changes are licensed under the license that applies to the files you modify.",
          "The desktop app has its own repository and license. Check the target repo before contributing across that boundary.",
        ],
        link: {
          label: "Read CONTRIBUTING.md",
          href: "https://github.com/7xuanlu/origin/blob/main/CONTRIBUTING.md",
        },
      },
    ],
  },
];

export function getDocPage(slug: string) {
  return docPages.find((page) => page.slug === slug);
}

export function docUrl(slug: string) {
  return `${SITE_URL}/docs/${slug}`;
}

export function formatDocDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
