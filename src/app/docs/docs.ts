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

const mcpOriginUrlCommand = "origin-mcp --origin-url http://127.0.0.1:7879";

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

const updateCommands = `# refresh the local runtime installed under ~/.origin/bin
npx -y @7xuanlu/origin setup

# verify after any update
~/.origin/bin/origin status
~/.origin/bin/origin doctor`;

const upgradeCommands = `# refresh the local runtime and connector
npx -y @7xuanlu/origin setup

# verify daemon and setup health
~/.origin/bin/origin status
~/.origin/bin/origin doctor

# inspect MCP config before changing a client
~/.origin/bin/origin mcp add codex --dry-run`;

const uninstallCommands = `~/.origin/bin/origin uninstall

# then remove Origin from each MCP client's settings if you added it manually`;

const packageSurfaceMap = `@7xuanlu/origin      Claude Code plugin package and setup entrypoint
origin-mcp          MCP connector package and Rust crate
origin-types        Shared HTTP/MCP wire types
GitHub Releases     Stable binaries, tags, and release notes`;

const packageInstallPaths = `# Claude Code
/plugin marketplace add 7xuanlu/origin
/plugin install origin@7xuanlu
/init

# Other MCP clients
npx -y @7xuanlu/origin setup
~/.origin/bin/origin mcp add codex

# Manual MCP fallback
npx -y origin-mcp`;

const packageVerificationCommands = `~/.origin/bin/origin status
~/.origin/bin/origin doctor
~/.origin/bin/origin mcp add codex --dry-run
~/.origin/bin/origin mcp add cursor --dry-run`;

const releaseFlow = `merge to main
  -> release-please updates the release PR
  -> merge the release PR when ready to ship
  -> tag workflow builds binaries and publishes packages
  -> users refresh with npx -y @7xuanlu/origin setup`;

const releaseBumpRules = `fix:              patch release before 1.0
feat:             minor release before 1.0
BREAKING CHANGE:  minor release before 1.0
docs/test/chore:  no release entry by default`;

const pluginInstallCommands = `/plugin marketplace add 7xuanlu/origin
/plugin install origin@7xuanlu
# restart Claude Code if prompted
/init`;

const pluginDailyCommands = `/init       setup + diagnosis
/help       one-screen reference
/brief      load session context
/capture    save one durable memory
/recall     search local memory
/distill    synthesize or refresh pages
/read       preview a page inline
/review     audit pending captures or revisions
/forget     delete a memory by ID
/handoff    end-of-session debrief
/debrief    alias for /handoff`;

const pluginDataPaths = `~/.origin/pages/               distilled wiki pages
~/.origin/sessions/            session logs
~/.origin/sessions/_status/    current project status
~/.origin/db/                  link to daemon store
~/.origin/bin/                 installed binaries`;

const diagnosticCommands = `# Claude Code
/init

# Terminal
~/.origin/bin/origin status
~/.origin/bin/origin doctor
~/.origin/bin/origin mcp add codex --dry-run
lsof -nP -iTCP:7878 -sTCP:LISTEN`;

const memoryTypeValues = `identity     durable facts about the user
preference   habits, style choices, or user preferences
decision     a choice made with rationale
lesson       root cause, workaround, or technical insight
gotcha       sharp edge, warning, or negative learning
fact         durable knowledge about people, projects, or tools`;

const memoryTypeTiers = `Protected: identity, preference
Standard:  decision, lesson, gotcha, fact
Ephemeral: missing or invalid memory_type`;

const memoryTypeAliases = `profile    classify into identity or preference
knowledge  classify into fact, lesson, or gotcha
goal       deprecated; folds into identity
correction/custom/recap  legacy compatibility; folds into fact`;

const platformMatrix = `macOS    arm64, x64              launchd user agent
Linux    x86_64, aarch64 glibc  systemd user unit
Windows  x86_64                 Task Scheduler ONLOGON task`;

const platformDataDirs = `macOS:   ~/Library/Application Support/origin/
Linux:   ~/.local/share/origin/ or $XDG_DATA_HOME/origin/
Windows: %LOCALAPPDATA%\\origin\\

Readable artifacts: ~/.origin/`;

const backupPaths = `Readable artifacts:
~/.origin/

Daemon application data:
macOS:   ~/Library/Application Support/origin/
Linux:   ~/.local/share/origin/ or $XDG_DATA_HOME/origin/
Windows: %LOCALAPPDATA%\\origin\\`;

const migrationChecks = `~/.origin/bin/origin status
~/.origin/bin/origin doctor

# then verify from the client:
/brief
/recall <known project fact>`;

const cliDailyCommands = `origin recall "origin website positioning"
origin search "MCP setup"
origin store "We chose spaces for client separation" --type decision
origin list --limit 10`;

const agentCommands = `origin agents list
origin agents show claude-code
origin agents edit claude-code --trust trusted --enabled true`;

const spaceCommands = `ORIGIN_SPACE=career claude

origin space list
origin space add ideas --default
origin space show ideas
origin space move scratch career`;

const spaceResolverChain = `1. explicit --arg override
2. ORIGIN_SPACE environment variable
3. ~/.origin/spaces.toml cwd-prefix mapping
3.5 spaces.toml top-level default
4. current git repo basename
5. conversation topic fallback
6. personal hard default`;

const spacesTomlExample = `[[mapping]]
prefix = "~/Repos/origin"
space  = "origin"

[[mapping]]
prefix = "~/notes/career"
space  = "career"

default = "personal"`;

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

const agentSideModelPhases = `Pick memory_type        daemon classifier       /capture chooses type
Extract entities        daemon extraction       /capture posts entities
Synthesize pages        daemon distill cycle    /distill writes page
Expand/rerank recall    daemon rerank/expand    /recall rewrites query`;

const configurationKnobs = `ORIGIN_SPACE=client-a
ORIGIN_HOST=http://127.0.0.1:7878
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

const runtimeEnvVars = `ORIGIN_SPACE=client-a
ORIGIN_HOST=http://127.0.0.1:7878
ORIGIN_BIND_ADDR=127.0.0.1:7878
ORIGIN_BIND_ADDR=0.0.0.0:7878  # Docker or VM only
ANTHROPIC_API_KEY=sk-ant-...`;

const devIsolationEnvVars = `ORIGIN_PORT=7879
ORIGIN_DATA_DIR=/tmp/origin-test
cargo run -p origin-server`;

const windowsEnvVars = `ORT_DYLIB_PATH=C:\\path\\to\\origin\\onnxruntime.dll`;

const evalEnvVars = `EVAL_BASELINES_DIR=$HOME/.cache/origin-eval
EVAL_LOCOMO_LIMIT=25
EVAL_LME_LIMIT=25
ANTHROPIC_API_KEY=sk-ant-...`;

const captureExamples = `/capture We chose source-backed pages because summaries need provenance.
/capture Supersedes earlier setup docs: Windows now uses a Task Scheduler ONLOGON task.
/capture Gotcha: Do not paste private memory contents into public issues.`;

const reviewCommands = `/review captures
/review revisions
/recall "what changed about the setup path"
/forget mem_abc123`;

const reviewMcpTools = `list_pending             unconfirmed captures
confirm_memory           accept one capture by source_id
list_pending_revisions   staged correction/revision rows
accept_revision          apply a pending revision
dismiss_revision         keep the current memory
dismiss_contradiction    mark a conflict as handled
list_rejections          quality-gate rejects`;

const httpSurfaces = `/api/health
/api/status
/api/setup/status
/api/memory/store
/api/memory/search
/api/chat-context
/api/memory/list
/api/memory/confirm/{id}
/api/distill
/api/pages
/api/pages/search
/api/pages/{id}/sources
/api/on-device-model
/api/setup/anthropic-key`;

const apiHealthExamples = `curl -s http://127.0.0.1:7878/api/health
curl -s http://127.0.0.1:7878/api/status
curl -s http://127.0.0.1:7878/api/setup/status`;

const apiMemoryExamples = `curl -s -X POST http://127.0.0.1:7878/api/memory/store \\
  -H 'content-type: application/json' \\
  -d '{
    "content": "We chose spaces for client separation because context bleed is risky.",
    "memory_type": "decision",
    "source_agent": "local-script",
    "space": "work"
  }'

curl -s -X POST http://127.0.0.1:7878/api/memory/search \\
  -H 'content-type: application/json' \\
  -d '{
    "query": "client separation decision",
    "limit": 5,
    "space": "work",
    "rerank": false
  }'`;

const apiContextExamples = `curl -s -X POST http://127.0.0.1:7878/api/chat-context \\
  -H 'content-type: application/json' \\
  -d '{
    "query": "origin website docs",
    "max_chunks": 8,
    "space": "work"
  }'`;

const apiReviewExamples = `curl -s -X POST http://127.0.0.1:7878/api/memory/list \\
  -H 'content-type: application/json' \\
  -d '{ "confirmed": false, "limit": 10 }'

curl -s -X POST http://127.0.0.1:7878/api/memory/confirm/mem_abc123 \\
  -H 'content-type: application/json' \\
  -d '{ "confirmed": true }'`;

const apiPageExamples = `curl -s -X POST http://127.0.0.1:7878/api/pages/search \\
  -H 'content-type: application/json' \\
  -d '{ "query": "distillation architecture", "limit": 5 }'

curl -s http://127.0.0.1:7878/api/pages/page_abc123/sources`;

const typedClientSurfaces = `origin-server  HTTP backend daemon
origin-mcp     MCP server wrapper for AI tools
origin CLI     setup, doctor, recall, search, store
local clients  Rust tools that call the daemon directly`;

const typedClientInstall = `cargo add origin-types

# then use the shared request/response structs
# instead of passing untyped JSON through your tool`;

const buildFromSourceCommands = `git clone https://github.com/7xuanlu/origin.git
cd origin
cargo build --workspace
cargo run -p origin-server

# before a PR
cargo fmt --check --all
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace`;

const testLayerMap = `Local iteration      targeted cargo test / cargo check
Pre-commit          cargo fmt --all + clippy on changed crates
Pre-push            workspace clippy + workspace library tests
PR CI               fmt, lint, tests for daemon crates
Coverage            informational on PR, not a local gate
Manual eval         GPU/API-backed benchmarks, run on demand`;

const contributorVerificationCommands = `cargo fmt --check --all
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace

# faster iteration examples
cargo test -p origin-core --lib
cargo test -p origin-server`;

const hookSetupCommands = `bash scripts/setup-hooks.sh

# hooks then run focused checks before commit/push
git commit
git push`;

const developmentBoundaryRules = `origin-core      business logic; no Axum or Tauri
origin-server    HTTP framing, not business logic
origin-types     lightweight shared wire types
origin-mcp       typed daemon responses, no JSON passthrough
route handlers   snapshot state before awaits`;

const developmentSafetyRules = `SQL:       parameterized queries only
NULL:      store Option<T> as SQL NULL
UTF-8:     do not byte-index Rust strings
Batch SQL: wrap multi-row mutations in BEGIN/COMMIT
Privacy:   redact memory contents in issues`;

const developmentGotchas = `Product daemon: 127.0.0.1:7878 + platform data dir
Isolated dev:   ORIGIN_PORT=7879 ORIGIN_DATA_DIR=/tmp/origin-test
Squash merges:  verify by commit message/body, not git cherry alone
Worktrees:      gitignored caches are per-checkout`;

const retrievalFlags = `ORIGIN_ENABLE_GRAPH_GATE
ORIGIN_ENABLE_GRAPH_SEED
ORIGIN_ENABLE_TEMPORAL_FILTER
ORIGIN_ENABLE_QUERY_INTENT
ORIGIN_MAGNITUDE_FUSION
ORIGIN_ENABLE_FTS_HARDENING
ORIGIN_ENABLE_SESSION_DIVERSITY
ORIGIN_ENABLE_SALIENCE_PRIOR
ORIGIN_ENABLE_EPISODE_CHANNEL
ORIGIN_ENABLE_FACT_CHANNEL
ORIGIN_PRF_ROUNDS
ORIGIN_ENABLE_GRAPH_KHOP
ORIGIN_ENABLE_GLOBAL_PRELUDE
ORIGIN_ENABLE_COT_RETRIEVAL
ORIGIN_LLM_ROUTE
ORIGIN_ENABLE_CONTEXT_COMPRESS`;

const experimentalMaintenanceFlags = `ORIGIN_ENABLE_TEMPORAL_GROUNDING
ORIGIN_ENABLE_ENTITY_MINHASH
ORIGIN_MERGE_SHRINK_GUARD
ORIGIN_ENABLE_DUAL_POOL_RESOLVE
ORIGIN_ENABLE_EVICTION
ORIGIN_ENABLE_REFLECTION_DEBOUNCE`;

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
          "Capture one durable memory when a future AI session would waste time rediscovering it or would make a worse decision without it.",
          "The best captures name the project, tool, person, decision, or constraint and include the reason it matters. That gives retrieval enough surface area to find it later.",
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
          "Do not store raw command output, long logs, temporary todos, or facts that are already obvious from source files. Origin is the memory layer for durable work context, not a transcript archive.",
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
    nextSlug: "review-and-trust",
  },
  {
    slug: "review-and-trust",
    group: "After setup",
    eyebrow: "Trust",
    title: "Review and Trust",
    description:
      "Understand how Origin keeps uncertain memory visible: pending captures, revisions, contradictions, rejections, confirm, and forget.",
    metaTitle: "Origin Review and Trust | Docs",
    metaDescription:
      "Learn how Origin handles review queues, pending captures, memory revisions, contradictions, quality-gate rejections, confirm, forget, and trust before distillation.",
    keywords: [
      "Origin review",
      "Origin trust",
      "pending memories",
      "memory revisions",
      "AI memory contradictions",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Review is the trust layer between raw captures and context your future agent should rely on.",
      "Use review for uncertain captures, pending revisions, or changing facts; use distill when related trusted memories deserve a readable page.",
    ],
    sections: [
      {
        heading: "Review before trust",
        body: [
          "A useful memory layer should not silently trust every captured sentence. Some facts are low-confidence, duplicated, contradicted, superseded, or too vague to promote into future context.",
          "Origin keeps those states visible so the human can confirm, correct, dismiss, forget, or let the daemon keep the item out of trusted context.",
        ],
      },
      {
        heading: "Capture queue",
        body: [
          "Use /review captures when you want to walk unconfirmed memories. Confirm the captures that are durable and reject or forget the ones that should not carry forward.",
          "In MCP-only clients, list_pending and confirm_memory expose the same basic flow: inspect candidates, then confirm one source_id when it is worth keeping.",
        ],
        code: {
          label: "Claude Code",
          code: reviewCommands,
        },
      },
      {
        heading: "Revisions and supersession",
        body: [
          "When a fact changes, prefer a correction that supersedes the old memory over a silent rewrite. The old context still explains why future sessions might see a historical decision.",
          "/review revisions is for staged memory updates. Accept a revision when the new statement is the right current record; dismiss it when the old memory should remain.",
        ],
      },
      {
        heading: "Contradictions",
        body: [
          "Contradictions are not always bugs. They often mean the project changed, the user corrected course, or two contexts are being mixed.",
          "When Origin surfaces a contradiction, decide whether the newer fact supersedes the older one, whether the memories belong in different spaces, or whether one should be forgotten because it is simply wrong.",
        ],
      },
      {
        heading: "Quality-gate rejections",
        body: [
          "Some attempted captures should never become memory: duplicates, low-quality fragments, tool output, logs, or transient status. Rejections are useful diagnostic records, not a failure of the work loop.",
          "Use rejections when you are debugging why a capture did not appear. Do not treat every rejected item as something to recover.",
        ],
      },
      {
        heading: "MCP tool map",
        body: [
          "The MCP connector exposes review and trust operations for clients that do not have Claude Code slash commands.",
          "Destructive or authority-changing tools require care. Get the source_id from recall, list_pending, or a page source list before confirming, forgetting, or resolving a revision.",
        ],
        code: {
          label: "MCP tools",
          code: reviewMcpTools,
        },
      },
      {
        heading: "When to forget",
        body: [
          "Use forget when a memory should not remain in the local record at all: sensitive accidental capture, wrong private fact, or data that should not be retained.",
          "For ordinary changes, prefer a correction with supersession. That keeps the reasoning trail visible while steering future context toward the newer fact.",
        ],
        link: {
          label: "Read data and privacy",
          href: "/docs/data-and-privacy",
        },
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
    nextSlug: "memory-types",
  },
  {
    slug: "memory-types",
    group: "Reference",
    eyebrow: "Memory",
    title: "Memory Types",
    description:
      "Understand Origin's six canonical memory types, how agents choose them, and which legacy aliases still appear at API boundaries.",
    metaTitle: "Origin Memory Types | Docs",
    metaDescription:
      "Reference Origin's canonical memory_type values: identity, preference, decision, lesson, gotcha, and fact, plus stability tiers and legacy aliases.",
    keywords: [
      "Origin memory types",
      "Origin memory_type",
      "AI work memory taxonomy",
      "Origin capture types",
      "Origin memory schema",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Origin's current public taxonomy has six canonical memory types: identity, preference, decision, lesson, gotcha, and fact.",
      "Corrections are still valid capture content, but correction is not a canonical memory_type value in the current wire taxonomy.",
    ],
    sections: [
      {
        heading: "Canonical values",
        body: [
          "The daemon stores canonical memory_type values as lowercase strings. Claude Code skills pick one of these values in local memory mode; model-equipped daemon paths can classify on the daemon side.",
          "Use the type that best explains why the memory should matter later, not merely the first label that seems plausible.",
        ],
        code: {
          label: "memory_type",
          code: memoryTypeValues,
        },
      },
      {
        heading: "How to choose",
        body: [
          "Use decision for a concrete choice with rationale. Use preference for a recurring user habit or style. Use lesson when the work produced a reusable insight.",
          "Use gotcha for traps and warnings. Use fact for durable knowledge about people, projects, tools, or the work itself. Use identity only for durable facts about the user.",
        ],
        link: {
          label: "Read capture quality",
          href: "/docs/capture-quality",
        },
      },
      {
        heading: "Corrections and supersession",
        body: [
          "A correction is a kind of capture intent, not a canonical memory_type. When a fact changes, capture the corrected statement and include what it supersedes.",
          "Origin can then surface revision or supersession behavior while keeping future recall pointed at the current fact.",
        ],
        link: {
          label: "Read review and trust",
          href: "/docs/review-and-trust",
        },
      },
      {
        heading: "Stability tiers",
        body: [
          "Origin treats identity and preference as protected because they describe the user. Standard work memories can still be important, but they are easier to supersede when new work changes the current record.",
          "Missing or invalid types are treated as ephemeral at the stability boundary. Good captures should avoid leaving the type ambiguous when the agent can classify confidently.",
        ],
        code: {
          label: "Stability",
          code: memoryTypeTiers,
        },
      },
      {
        heading: "Aliases and compatibility",
        body: [
          "Some high-level or legacy labels can still appear at API boundaries. They exist for compatibility or classification flows, not as the six user-facing values agents should prefer.",
          "For new captures, choose one of the canonical values unless the daemon or skill explicitly handles the alias.",
        ],
        code: {
          label: "Aliases",
          code: memoryTypeAliases,
        },
      },
      {
        heading: "API usage",
        body: [
          "memory/store accepts memory_type as an optional field. If you provide it, use the canonical lowercase value.",
          "If you are building a Rust local tool, prefer origin-types so invalid values fail visibly instead of drifting through untyped JSON.",
        ],
        link: {
          label: "Read typed clients",
          href: "/docs/typed-clients",
        },
      },
    ],
    nextSlug: "glossary",
  },
  {
    slug: "glossary",
    group: "Reference",
    eyebrow: "Glossary",
    title: "Glossary",
    description:
      "A quick map of Origin terms: memory, handoff, page, space, daemon, MCP, local index, provenance, and eval language.",
    metaTitle: "Origin Glossary | Docs",
    metaDescription:
      "Define Origin product terms including memories, handoffs, distilled pages, spaces, daemon, MCP connector, Markdown projection, local index, provenance, revisions, and retrieval metrics.",
    keywords: [
      "Origin glossary",
      "AI work memory terms",
      "Origin terminology",
      "MCP memory glossary",
      "AI memory vocabulary",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Use this glossary when a docs page mentions an Origin term and you need the short version before continuing.",
      "The important distinction: readable artifacts are for humans, the local daemon and index are for retrieval, and MCP is how agents reach the same store.",
    ],
    sections: [
      {
        heading: "Workflow terms",
        body: [
          "Memory: one durable idea from AI work, such as a decision, lesson, gotcha, preference, fact, or correction.",
          "Capture: the act of storing one durable idea. Handoff: the end-of-session record that tells the next agent what changed, what remains open, and where to continue.",
        ],
        bullets: [
          "Brief: session-start context loaded from recent status, handoffs, and topic-relevant memory.",
          "Recall: targeted search for a specific past fact or thread.",
          "Distill: synthesize related memories into source-backed pages.",
          "Review: inspect uncertain captures, revisions, contradictions, or rejected items before trusting them.",
        ],
      },
      {
        heading: "Storage terms",
        body: [
          "Distilled page: a readable Markdown page composed from related memories, with source memory IDs preserved for provenance.",
          "Markdown projection: the human-readable artifact layer under ~/.origin. Local index: the daemon-owned libSQL store that powers embeddings, FTS, graph context, pages, metadata, and retrieval.",
        ],
        bullets: [
          "Source-backed: a page or claim traces back to memory IDs instead of appearing as an unsourced summary.",
          "Local git history: commits under ~/.origin/.git that make writes inspectable over time.",
          "Page source: a memory that contributed to a distilled page.",
        ],
      },
      {
        heading: "Runtime terms",
        body: [
          "Daemon: origin-server, the local process on 127.0.0.1:7878 that owns storage, search, pages, graph context, distill cycles, and the HTTP API.",
          "MCP connector: origin-mcp, the process MCP clients launch so agents can call Origin tools. CLI: the origin command-line tool for setup, status, doctor, recall, search, store, spaces, models, keys, and MCP config.",
        ],
        bullets: [
          "Claude Code plugin: the slash-command workflow layer around the same daemon and MCP connector.",
          "MCP-only setup: local runtime plus MCP tools, without Claude Code slash skills.",
          "Local memory mode: core capture, search, recall, and artifacts without a local model download or API key.",
        ],
      },
      {
        heading: "Trust terms",
        body: [
          "Confirmed memory: a memory accepted as trustworthy enough to carry forward. Pending memory: a capture that still needs review or confidence improvement.",
          "Supersession: a newer memory replaces an older fact while preserving the history of why the old fact existed.",
        ],
        bullets: [
          "Revision: a proposed update to an existing memory or page.",
          "Contradiction: two memories conflict and need human or daemon-side resolution.",
          "Quality-gate rejection: a capture attempt discarded before storage because it was duplicate, low-signal, or otherwise not useful memory.",
          "Forget: delete a memory by ID when it should not remain in the local record.",
        ],
      },
      {
        heading: "Separation terms",
        body: [
          "Space: a named memory bucket such as work, personal, client-X, or a project name. Spaces reduce context bleed while keeping one daemon and one install.",
          "Active space: the bucket chosen by inline arguments, ORIGIN_SPACE, spaces.toml, current repo, topic, or default resolver state.",
        ],
        link: {
          label: "Read spaces",
          href: "/docs/spaces",
        },
      },
      {
        heading: "Evaluation terms",
        body: [
          "Recall@5 measures whether relevant context appears in the top five retrieved results. MRR rewards putting the first relevant result higher. NDCG@10 rewards strong ranking across the top ten.",
          "Origin's public numbers are retrieval-only evals, not end-to-end answer-quality guarantees. They show whether the memory layer surfaces relevant context, not whether a downstream model always reasons correctly.",
        ],
        link: {
          label: "Read evaluation",
          href: "/docs/evaluation",
        },
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
    nextSlug: "claude-code-plugin",
  },
  {
    slug: "claude-code-plugin",
    group: "Reference",
    eyebrow: "Plugin",
    title: "Claude Code Plugin",
    description:
      "Use Origin's richest workflow inside Claude Code: setup, session brief, capture, recall, review, distill, read, and handoff.",
    metaTitle: "Origin Claude Code Plugin | Docs",
    metaDescription:
      "Install and use the Origin Claude Code plugin with /init, /brief, /capture, /recall, /handoff, /distill, /review, /forget, the SessionStart hook, and local memory mode.",
    keywords: [
      "Origin Claude Code plugin",
      "Claude Code memory plugin",
      "Origin slash commands",
      "Origin /init",
      "Claude Code MCP memory",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "The Claude Code plugin is the fastest and richest Origin path because it adds slash commands around the local daemon and MCP connector.",
      "/init is the setup and repair command: it verifies daemon reachability, MCP wiring, local memory setup, and a first round trip.",
    ],
    sections: [
      {
        heading: "Install path",
        body: [
          "Install through Claude Code's plugin marketplace, restart if Claude Code asks, then run /init.",
          "/init is designed to be the single setup check. It installs or verifies the local runtime, configures local memory, checks daemon and MCP reachability, and confirms a memory round trip.",
        ],
        code: {
          label: "Claude Code",
          code: pluginInstallCommands,
        },
      },
      {
        heading: "What the plugin adds",
        body: [
          "The plugin adds Claude Code skills and slash commands on top of the same local Origin daemon that other MCP clients use.",
          "That means Claude Code gets a more ergonomic workflow, while the memory itself remains shared with Codex, Cursor, Claude Desktop, VS Code, Gemini CLI, and other MCP-compatible clients when configured.",
        ],
      },
      {
        heading: "Daily command surface",
        body: [
          "Most sessions need only /brief at the start, /capture when something durable happens, /recall for a specific lookup, and /handoff before the session ends.",
          "The other commands are maintenance and inspection paths for when memory needs review, distillation, deletion, or inline reading.",
        ],
        code: {
          label: "Plugin commands",
          code: pluginDailyCommands,
        },
      },
      {
        heading: "SessionStart hook",
        body: [
          "The plugin includes a SessionStart hook that probes the local daemon on 127.0.0.1:7878.",
          "The hook is intentionally light: it prints a nudge to run /init when the daemon is down. It does not own installation logic and should not block a session.",
        ],
      },
      {
        heading: "Local memory mode",
        body: [
          "By default, /init configures local memory. That means no model download, no API key, and no cloud sync requirement for the basic memory loop.",
          "The daemon stores, embeds, deduplicates, and serves hybrid search. Claude Code skills can still classify captures, write handoffs, and synthesize pages through the agent-side model fallback because the agent already has language judgment in the active session.",
        ],
      },
      {
        heading: "Where data appears",
        body: [
          "The plugin does not store data by itself. It guides Claude Code to use local MCP tools, and those tools talk to the Origin daemon.",
          "Readable artifacts live under ~/.origin, so you can inspect pages, session logs, project status, and installed binaries without opening a separate app.",
        ],
        code: {
          label: "Local artifacts",
          code: pluginDataPaths,
        },
      },
      {
        heading: "Plugin versus MCP-only",
        body: [
          "MCP-only setup gives clients tools for context, capture, recall, doctor, and page distillation. It does not install Claude Code slash skills like /brief, /handoff, /distill, or /init.",
          "Use the plugin when Claude Code is your main surface. Use MCP-only setup when you want Origin in other clients or when you intentionally want raw MCP tools without the Claude Code workflow layer.",
        ],
        link: {
          label: "Connect MCP clients",
          href: "/docs/mcp-clients",
        },
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
    nextSlug: "updates-and-uninstall",
  },
  {
    slug: "updates-and-uninstall",
    group: "Reference",
    eyebrow: "Lifecycle",
    title: "Updates and Uninstall",
    description:
      "Refresh Origin's local runtime, verify version health, restart MCP clients, and remove the service without losing data by accident.",
    metaTitle: "Update or Uninstall Origin | Docs",
    metaDescription:
      "Learn how to update Origin's local runtime, verify status with origin doctor, handle MCP client restarts, and uninstall the daemon safely.",
    keywords: [
      "update Origin",
      "uninstall Origin",
      "Origin version",
      "Origin doctor",
      "Origin MCP update",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "Use setup and doctor to refresh and verify the local runtime under ~/.origin/bin.",
      "Uninstalling the service is separate from deleting memory data; keep those decisions explicit.",
    ],
    sections: [
      {
        heading: "When to update",
        body: [
          "Update when release notes mention a setup fix, new MCP client support, service-management change, or runtime bug that affects your machine.",
          "If everything is working, you do not need to chase every main-branch PR. Use the changelog to distinguish stable releases from unreleased work.",
        ],
        link: {
          label: "Read the changelog",
          href: "/docs/changelog",
        },
      },
      {
        heading: "Refresh the local runtime",
        body: [
          "For MCP clients outside Claude Code, rerun the setup command to refresh the local CLI, daemon, and MCP connector installed under ~/.origin/bin.",
          "After updating, run status and doctor before judging the client integration. That separates a runtime problem from a client restart or settings problem.",
        ],
        code: {
          label: "Terminal",
          code: updateCommands,
        },
      },
      {
        heading: "Claude Code plugin users",
        body: [
          "Claude Code plugin updates happen through Claude Code's plugin marketplace flow. After the plugin changes, restart Claude Code if prompted and run /init again.",
          "/init verifies the plugin, daemon, MCP route, and a memory round trip, so it is the right post-update check.",
        ],
        code: {
          label: "Claude Code",
          code: "/init",
        },
      },
      {
        heading: "MCP client settings",
        body: [
          "If origin-mcp moved, or a client still launches an old path, rerun origin mcp add for that client. Use --dry-run when you want to inspect the generated config first.",
          "Most MCP clients need a restart after settings change. Verify by running the client's Origin doctor or a small capture/recall round trip.",
        ],
        code: {
          label: "MCP refresh",
          code: "~/.origin/bin/origin mcp add codex --dry-run\n~/.origin/bin/origin mcp add cursor",
        },
      },
      {
        heading: "Uninstall the service",
        body: [
          "origin uninstall removes the per-user service registration: launchd on macOS, systemd user units on Linux, or the Windows Task Scheduler logon task.",
          "That does not delete memory data. Do not delete ~/.origin or the daemon data directory unless you have decided you no longer need those records.",
        ],
        code: {
          label: "Terminal",
          code: uninstallCommands,
        },
      },
      {
        heading: "Before deleting data",
        body: [
          "Memory data may include project history, private preferences, client context, pages, sessions, and local git history. Treat it like private application data.",
          "If you are removing Origin because setup failed, open an issue with redacted doctor output before deleting data. The diagnostic state is often the fastest way to fix the install path.",
        ],
      },
    ],
    nextSlug: "upgrade-notes",
  },
  {
    slug: "upgrade-notes",
    group: "Reference",
    eyebrow: "Upgrade",
    title: "Upgrade Notes",
    description:
      "Read the practical upgrade path for Origin releases: what to rerun, what to verify, and what changed in the current public runtime shape.",
    metaTitle: "Origin Upgrade Notes | Docs",
    metaDescription:
      "Upgrade Origin safely across plugin, npm setup, MCP connector, daemon service, spaces, platform support, and local data paths.",
    keywords: [
      "Origin upgrade notes",
      "update Origin",
      "Origin v0.7 upgrade",
      "Origin MCP update",
      "Origin setup update",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Treat a release upgrade as three checks: refresh the local runtime, verify daemon health, then verify each MCP client launches the expected connector.",
      "Do not delete local memory data as part of a normal upgrade. Back up readable artifacts and daemon data before machine moves or risky migrations.",
    ],
    sections: [
      {
        heading: "Read release state first",
        body: [
          "Origin moves quickly, so distinguish released packages from main-branch work. The changelog and GitHub Releases describe what is shipped; merged PRs can describe work that is not in your installed package yet.",
          "If a doc says an experiment is on main or opt-in, do not treat it as part of the stable runtime until a release page or changelog entry says so.",
        ],
        link: {
          label: "Read the changelog",
          href: "/docs/changelog",
        },
      },
      {
        heading: "Normal upgrade checklist",
        body: [
          "For MCP clients outside Claude Code, rerun the setup package. That refreshes the local runtime installed under ~/.origin/bin, including the CLI, daemon, and MCP connector.",
          "After setup, run status and doctor before judging a client. A healthy daemon with a broken client usually means MCP settings or restart state, not a failed upgrade.",
        ],
        code: {
          label: "Terminal",
          code: upgradeCommands,
        },
      },
      {
        heading: "Claude Code plugin upgrades",
        body: [
          "Claude Code users should update through the plugin marketplace flow, restart Claude Code if prompted, then run /init.",
          "/init is the post-upgrade smoke test because it checks plugin installation, daemon reachability, MCP wiring, and the memory round trip from the tool where you work.",
        ],
        code: {
          label: "Claude Code",
          code: "/plugin marketplace add 7xuanlu/origin\n/plugin install origin@7xuanlu\n/init",
        },
      },
      {
        heading: "v0.7.x runtime shape",
        body: [
          "The current public docs describe the v0.7-era runtime shape: Claude Code plugin, npm setup, origin-mcp connector, daemon-first architecture, explicit spaces, local git history, source-backed pages, and cross-platform service registration.",
          "The biggest practical upgrade checks are platform support, package path alignment, and spaces. Confirm your machine's service manager, confirm MCP clients launch the connector under ~/.origin/bin, and confirm the active space is the one you expect.",
        ],
        link: {
          label: "Read platform support",
          href: "/docs/platforms",
        },
      },
      {
        heading: "Client restarts",
        body: [
          "Most MCP clients read server configuration at startup. If tools disappear after an upgrade, restart MCP clients before rewriting configuration.",
          "If restart does not fix it, rerun origin mcp add for that client. Use --dry-run first when you want to inspect the generated command and path.",
        ],
        link: {
          label: "Connect MCP clients",
          href: "/docs/mcp-clients",
        },
      },
      {
        heading: "Data safety",
        body: [
          "Normal upgrades should not delete memory data. origin uninstall removes service registration, not ~/.origin or the daemon database.",
          "For machine migration, manual cleanup, or risky experiments, back up both readable ~/.origin artifacts and the platform daemon data directory. Then verify with doctor and a capture/recall round trip before trusting the restored install.",
        ],
        link: {
          label: "Read backup and migration",
          href: "/docs/backup-and-migration",
        },
      },
    ],
    nextSlug: "packages-and-registries",
  },
  {
    slug: "packages-and-registries",
    group: "Reference",
    eyebrow: "Packages",
    title: "Packages and Registries",
    description:
      "Know which Origin package name maps to the plugin, runtime setup, MCP connector, Rust crates, and release binaries.",
    metaTitle: "Origin Packages and Registries | Docs",
    metaDescription:
      "Understand Origin package names across the Claude Code plugin, npm setup, origin-mcp, origin-types, crates.io, and GitHub Releases.",
    keywords: [
      "Origin packages",
      "@7xuanlu origin",
      "origin-mcp npm",
      "origin-types crate",
      "Origin GitHub releases",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "Origin has several public package names because one local product crosses Claude Code plugins, npm setup, MCP clients, Rust crates, and release binaries.",
      "Most users should not choose a registry by hand. Install through Claude Code or npx setup, then let origin mcp add wire each client to the local connector.",
    ],
    sections: [
      {
        heading: "Why the names differ",
        body: [
          "Origin is one local memory layer with several runtime surfaces. The daemon owns memory, the CLI manages setup and diagnostics, origin-mcp bridges MCP clients, and the Claude Code plugin adds the slash-command workflow.",
          "The registry names map to ecosystems, not separate products. When docs mention several names, they are usually describing different entry points into the same local daemon.",
        ],
        code: {
          label: "Public surfaces",
          code: packageSurfaceMap,
        },
      },
      {
        heading: "Normal install paths",
        body: [
          "Claude Code users should use the plugin marketplace path, then run /init. That verifies the plugin, local daemon, MCP route, and a memory round trip from inside Claude Code.",
          "Other MCP clients should run the setup package once, then use origin mcp add for each client. That keeps client config pointed at the local connector installed under ~/.origin/bin.",
        ],
        code: {
          label: "Install paths",
          code: packageInstallPaths,
        },
      },
      {
        heading: "MCP connector packages",
        body: [
          "origin-mcp is the connector MCP clients launch when they need Origin tools. Normal setup installs a local origin-mcp binary beside the CLI so configs can use a stable machine-local path.",
          "The standalone npm package is useful when a client or automation flow needs to spawn the connector through npm. Prefer the installed local binary when setup has already prepared ~/.origin/bin.",
        ],
        link: {
          label: "Read MCP client setup",
          href: "/docs/mcp-clients",
        },
      },
      {
        heading: "Rust crates",
        body: [
          "origin-mcp is also published as a Rust crate because the connector ships from the Rust workspace. Most users never install this crate directly.",
          "origin-types contains shared HTTP and MCP wire types for downstream Rust clients. It exists so integrations can fail loudly on shape drift instead of passing around untyped JSON.",
        ],
      },
      {
        heading: "GitHub releases",
        body: [
          "GitHub Releases are the stable release record for tags, binaries, and changelog-backed behavior. If a page describes unreleased main-branch work, it should say so explicitly.",
          "When you need to know whether a behavior is shipped, read the changelog before assuming a merged PR is in the package you installed.",
        ],
        link: {
          label: "Read the changelog",
          href: "/docs/changelog",
        },
      },
      {
        heading: "Verify your install",
        body: [
          "After changing packages, verify the runtime first. status and doctor tell you whether the local daemon is healthy before you debug an MCP client.",
          "Then run origin mcp add with --dry-run for the client you care about. The output shows which connector path the client should launch.",
        ],
        code: {
          label: "Verification",
          code: packageVerificationCommands,
        },
      },
    ],
    nextSlug: "platforms",
  },
  {
    slug: "platforms",
    group: "Reference",
    eyebrow: "Platforms",
    title: "Platform Support",
    description:
      "Understand how Origin runs on macOS, Linux, and Windows: service managers, local data paths, model backends, and Docker/VM caveats.",
    metaTitle: "Origin Platform Support | Docs",
    metaDescription:
      "Review Origin platform support for macOS, Linux, and Windows, including service registration, data directories, model backend differences, and bind-address caveats.",
    keywords: [
      "Origin platform support",
      "Origin Windows",
      "Origin Linux",
      "Origin macOS",
      "Origin service manager",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Origin's released runtime supports macOS arm64/x64, Linux x86_64/aarch64 with glibc, and Windows x86_64.",
      "The daemon contract is the same across platforms, but service registration, data paths, and model acceleration differ.",
    ],
    sections: [
      {
        heading: "Supported platforms",
        body: [
          "Origin v0.7.0 broadened the local runtime from macOS-first to cross-platform support across macOS, Linux, and Windows.",
          "The same daemon, CLI, and MCP connector shape applies on each platform. The operating-system integration is what changes.",
        ],
        code: {
          label: "Runtime matrix",
          code: platformMatrix,
        },
      },
      {
        heading: "Service registration",
        body: [
          "Origin installs as a per-user service so the local daemon can be available to MCP clients without a manual terminal session.",
          "macOS uses launchd. Linux uses a systemd user unit. Windows uses a per-user Task Scheduler ONLOGON task.",
        ],
      },
      {
        heading: "Data paths",
        body: [
          "The daemon keeps its database and application data in the OS application data location. Origin also exposes human-readable artifacts under ~/.origin so pages, sessions, status records, and local git history are easy to inspect.",
          "Treat both locations as private application data. They can contain project decisions, preferences, client context, and old versions.",
        ],
        code: {
          label: "Data locations",
          code: platformDataDirs,
        },
      },
      {
        heading: "Model backends",
        body: [
          "The core memory loop does not require a local model or API key. Store, embed, search, recall, MCP context, and the agent-side workflow still work without configuring daemon-side language models.",
          "For optional local model paths, macOS keeps Metal acceleration. Linux and Windows release builds are CPU-only by default in the current public shape.",
        ],
      },
      {
        heading: "Docker and VMs",
        body: [
          "Normal laptop use should keep the daemon bound to 127.0.0.1:7878. That keeps the HTTP API local to the machine.",
          "Use ORIGIN_BIND_ADDR only when you intentionally need non-loopback access, such as a Docker or VM setup. Exposing the daemon changes the security boundary, so pair it with the security reporting and configuration guidance.",
        ],
        code: {
          label: "Bind address",
          code: "ORIGIN_BIND_ADDR=127.0.0.1:7878\nORIGIN_BIND_ADDR=0.0.0.0:7878  # Docker or VM only",
        },
      },
      {
        heading: "After setup",
        body: [
          "Whatever platform you use, verify setup the same way: run origin status and origin doctor, then do one capture/recall round trip from the client you care about.",
          "If the daemon works but an MCP client does not, restart the client and rerun origin mcp add for that client before assuming the runtime is broken.",
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
    nextSlug: "api-examples",
  },
  {
    slug: "api-examples",
    group: "Reference",
    eyebrow: "API",
    title: "API Examples",
    description:
      "Use the local daemon HTTP API from scripts when the CLI or MCP tools are not the right fit.",
    metaTitle: "Origin API Examples | Docs",
    metaDescription:
      "Copy local curl examples for Origin daemon health, setup status, memory store/search, chat context, review, confirm, and page search endpoints.",
    keywords: [
      "Origin API examples",
      "Origin curl",
      "Origin HTTP API",
      "Origin memory store API",
      "Origin chat context API",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "The HTTP API is local to the daemon on 127.0.0.1:7878. It is useful for scripts, diagnostics, and first-party clients.",
      "For normal workflows, prefer Claude Code slash commands, MCP tools, or the CLI. They carry Origin's current product semantics better than hand-written HTTP calls.",
    ],
    sections: [
      {
        heading: "Before using curl",
        body: [
          "Start with the CLI or MCP connector unless you specifically need local script automation. The daemon API is the local contract underneath those tools, not a hosted SDK surface.",
          "Keep calls on 127.0.0.1 unless you intentionally changed ORIGIN_BIND_ADDR. Exposing the daemon beyond loopback changes the security boundary.",
        ],
        link: {
          label: "Read HTTP API overview",
          href: "/docs/http-api",
        },
      },
      {
        heading: "Health and setup",
        body: [
          "Use health and status endpoints before testing memory calls. They separate daemon reachability from search, capture, or MCP-client problems.",
          "setup/status is useful when a client reports that Origin is installed but tools still fail.",
        ],
        code: {
          label: "Health checks",
          code: apiHealthExamples,
        },
      },
      {
        heading: "Store and search memory",
        body: [
          "memory/store accepts a complete memory statement plus optional memory_type, source_agent, space, supersedes, entity, structured_fields, and retrieval_cue fields.",
          "memory/search accepts query, limit, optional memory_type, optional space, optional source_agent, and rerank. rerank only changes ordering when the daemon has a reranker configured.",
        ],
        code: {
          label: "Memory calls",
          code: apiMemoryExamples,
        },
      },
      {
        heading: "Load context for a session",
        body: [
          "chat-context is the daemon route behind broad session orientation. It returns a context string plus structured knowledge fields for clients that need them.",
          "Use this when a local tool needs a compact context bundle. For specific facts, search memory instead.",
        ],
        code: {
          label: "Context call",
          code: apiContextExamples,
        },
      },
      {
        heading: "Review and confirm",
        body: [
          "memory/list can filter unconfirmed memories with confirmed=false. memory/confirm/{source_id} confirms or unconfirms one item.",
          "This is useful for a local review UI or a diagnostic script. In normal agent work, prefer /review or the MCP review tools when available.",
        ],
        code: {
          label: "Review calls",
          code: apiReviewExamples,
        },
      },
      {
        heading: "Search pages",
        body: [
          "pages/search looks over source-backed pages. A page result is different from an atomic memory result: it is synthesized from source memories and should preserve provenance.",
          "Use pages/{id}/sources when you need to inspect which memories produced a page before trusting or editing it.",
        ],
        code: {
          label: "Page calls",
          code: apiPageExamples,
        },
      },
      {
        heading: "Build typed clients carefully",
        body: [
          "Rust integrations should prefer origin-types for request and response shapes. That keeps shape drift visible at compile time instead of passing untyped JSON through local tools.",
          "For non-Rust scripts, keep bodies small, handle non-200 responses, and avoid destructive delete/update routes unless you have a backup and a clear source_id.",
        ],
        link: {
          label: "Read package names",
          href: "/docs/packages-and-registries",
        },
      },
    ],
    nextSlug: "typed-clients",
  },
  {
    slug: "typed-clients",
    group: "Reference",
    eyebrow: "Types",
    title: "Typed Clients",
    description:
      "Use origin-types when a Rust tool needs to call the local daemon without relying on untyped JSON shapes.",
    metaTitle: "Origin Typed Clients | Docs",
    metaDescription:
      "Learn when to use the origin-types crate for Origin daemon request and response types, what stability to expect before 1.0, and why the local daemon remains the boundary.",
    keywords: [
      "origin-types",
      "Origin typed clients",
      "Origin wire types",
      "Origin API types",
      "Rust MCP memory client",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "origin-types is the shared Rust wire-format crate for the daemon, MCP server, CLI, and downstream local clients.",
      "Use it for local Rust integrations that need shape checking; use MCP or the CLI for normal agent workflows.",
    ],
    sections: [
      {
        heading: "What origin-types is",
        body: [
          "origin-types defines shared request and response shapes plus core enums used across the local Origin runtime.",
          "The point is to make shape drift visible. A typed integration should fail loudly when a payload changes instead of silently passing mismatched JSON.",
        ],
        code: {
          label: "Shared surfaces",
          code: typedClientSurfaces,
        },
      },
      {
        heading: "When to use it",
        body: [
          "Use origin-types when you are writing a Rust local tool that calls origin-server directly or when you are contributing to the daemon, MCP connector, or CLI.",
          "Do not reach for it for ordinary daily work. Claude Code slash commands, MCP tools, and the CLI are the supported product surfaces for most users.",
        ],
        code: {
          label: "Rust dependency",
          code: typedClientInstall,
        },
      },
      {
        heading: "Stability expectations",
        body: [
          "Origin is pre-1.0. Minor version bumps can include breaking wire-type changes under Rust 0.x conventions.",
          "Types marked doc(hidden) are not part of the public stability contract. Treat them as implementation details even if they appear in generated docs.",
        ],
      },
      {
        heading: "Boundary still matters",
        body: [
          "origin-types does not mean clients should write the database directly. The daemon remains the owner of storage, search, pages, graph context, review state, and distill cycles.",
          "If your tool only needs to capture, recall, or load context, prefer MCP or CLI automation before building direct HTTP plumbing.",
        ],
        link: {
          label: "Read HTTP API overview",
          href: "/docs/http-api",
        },
      },
      {
        heading: "Where to find it",
        body: [
          "The crate is published as origin-types and lives in the public Origin repository with the rest of the daemon workspace.",
          "Package names matter here: origin-types is the shared type crate, origin-mcp is the MCP connector, and @7xuanlu/origin is the setup and Claude Code plugin package.",
        ],
        link: {
          label: "Read package names",
          href: "/docs/packages-and-registries",
        },
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
      "Separate work, personal, client, and project memory, and understand how Origin resolves the active space.",
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
    readingTime: "6 min read",
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
          "Origin can read space configuration from ~/.origin/spaces.toml. Map directory prefixes to spaces when you want a repo or notes folder to select the same context every time.",
          "Longest matching prefix wins. A top-level default applies when no mapping matches.",
        ],
        code: {
          label: "spaces.toml",
          code: spacesTomlExample,
        },
      },
      {
        heading: "Resolver order",
        body: [
          "Origin resolves the active space through a priority chain. Explicit overrides win, then the shell environment, then spaces.toml, then the current git repo name, then topic fallback, then personal.",
          "Use origin doctor when you are unsure which layer selected the current space. Doctor prints the resolver state so you can diagnose accidental context bleed.",
        ],
        code: {
          label: "Priority chain",
          code: spaceResolverChain,
        },
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
    nextSlug: "knowledge-graph",
  },
  {
    slug: "knowledge-graph",
    group: "Reference",
    eyebrow: "Graph",
    title: "Knowledge Graph",
    description:
      "Understand how Origin links people, projects, tools, observations, and relations so recall can recover context through more than text similarity.",
    metaTitle: "Origin Knowledge Graph | Docs",
    metaDescription:
      "Learn how Origin's knowledge graph uses entities, relations, observations, post-ingest enrichment, imported wikilinks, and graph context during retrieval.",
    keywords: [
      "Origin knowledge graph",
      "AI work knowledge graph",
      "memory entities",
      "graph context",
      "local knowledge graph",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "The graph turns repeated names, projects, tools, and observations into retrievable context instead of leaving every memory isolated.",
      "Graph context supplements hybrid search; it does not replace source-backed memories, pages, or human review.",
    ],
    sections: [
      {
        heading: "Why the graph exists",
        body: [
          "Text search can find matching words, and vector search can find similar meaning. The graph helps with relationships: who worked on what, which project uses which tool, and which observations belong together.",
          "Origin uses graph context as part of the local memory layer so agents can recover surrounding facts without replaying a full chat history.",
        ],
      },
      {
        heading: "Entities, relations, observations",
        body: [
          "An entity is a named thing such as a person, project, tool, repo, or concept. A relation connects two entities. An observation is a grounded statement attached to an entity.",
          "The goal is practical retrieval. The graph should help the next session find the right surrounding context, not become a hand-maintained ontology.",
        ],
        bullets: [
          "Entity: Origin, Claude Code, a client project, a person, a tool, or a repo.",
          "Relation: works_on, uses, depends_on, belongs_to, supersedes, or another useful link.",
          "Observation: a sourced note about an entity that should help future recall.",
        ],
      },
      {
        heading: "How graph context is created",
        body: [
          "Post-ingest enrichment can link entities, deduplicate overlapping captures, enrich titles, grow matching pages, and update effective confidence based on memory type, access, and age. Optional local models or API keys can make extraction and graph linking richer.",
          "Claude Code skills can also help because the agent already has language judgment during capture and distillation.",
        ],
        link: {
          label: "Read models and keys",
          href: "/docs/models-and-keys",
        },
      },
      {
        heading: "Wikilinks and imports",
        body: [
          "Imported Markdown vaults can carry useful links. Origin can preserve those relationships as graph signal while still treating imported content as context that should prove itself useful in recall.",
          "Wikilinks are helpful, but they are not the same as source-backed page provenance. A page claim is stronger when it traces to specific source memory IDs.",
        ],
        link: {
          label: "Read import and portability",
          href: "/docs/import-and-portability",
        },
      },
      {
        heading: "Graph in retrieval",
        body: [
          "Hybrid retrieval can combine vectors, full-text search, pages, and graph context. The graph adds nearby related facts when text similarity alone would miss why a memory matters.",
          "Treat graph context as support, not authority. The source memory, page provenance, and local git history remain the inspectable record.",
        ],
        link: {
          label: "Read advanced retrieval",
          href: "/docs/advanced-retrieval",
        },
      },
      {
        heading: "Review and cleanup",
        body: [
          "Graph data can be wrong when a name is ambiguous, a project changes direction, or an imported link was noisy. Use review, corrections, spaces, and forget when the memory layer needs cleanup.",
          "If graph context feels like it is mixing unrelated worlds, check the active space before changing the data model. Many apparent graph problems are actually context-boundary problems.",
        ],
        link: {
          label: "Read review and trust",
          href: "/docs/review-and-trust",
        },
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
          "Pages can become stale when new memories contradict them, extend them, or show that an old summary is no longer enough. Origin tracks stale_reasons so refresh work has a concrete cause.",
          "Origin also tracks revision_state so refreshes can be deliberate. The point is not to overwrite human-readable records casually; it is to keep them improving as the project changes.",
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
          "Git can help inspect, diff, revert, or recover a previous Markdown page or session note, but do not treat manual git restore as a full database rollback.",
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
          "The CLI can read ANTHROPIC_API_KEY through the key setup path. Your connected AI client may already call its own provider during normal chat; this page only describes Origin's daemon-side model and key paths.",
        ],
      },
      {
        heading: "Agent-side fallback",
        body: [
          "Claude Code skills can classify captures, write handoffs, and synthesize pages from inside the active agent session. That is why Origin remains useful before you configure a daemon model.",
          "The daemon stays the store and retrieval layer. The agent can supply language judgment when it is already in the work context.",
        ],
        code: {
          label: "Local mode fallback",
          code: agentSideModelPhases,
        },
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
          "After v0.7.0, main received a large opt-in retrieval batch. Examples include graph gates, temporal filters, query-adaptive routing, FTS hardening, session diversity, salience priors, episode and fact channels, PRF rounds, k-hop graph traversal, global preludes, CoT retrieval, LLM routing, and context compression.",
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
    nextSlug: "experimental-flags",
  },
  {
    slug: "experimental-flags",
    group: "Reference",
    eyebrow: "Experiments",
    title: "Experimental Flags",
    description:
      "How to read Origin's opt-in main-branch flags without mistaking them for released defaults.",
    metaTitle: "Origin Experimental Flags | Docs",
    metaDescription:
      "Understand Origin's opt-in experimental flags for retrieval, context compression, memory maintenance, entity resolution, page guards, and reflection.",
    keywords: [
      "Origin experimental flags",
      "Origin retrieval flags",
      "ORIGIN_ENABLE_CONTEXT_COMPRESS",
      "ORIGIN_ENABLE_GRAPH_GATE",
      "Origin main branch experiments",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "Experimental flags are for source checkouts, evaluation runs, and maintainer testing. They are not stable product defaults.",
      "Use release notes and the changelog to decide what installed users can rely on.",
    ],
    sections: [
      {
        heading: "Status first",
        body: [
          "Origin's main branch often carries opt-in work before a release promotes it. A flag on main means the code path exists for testing; it does not mean normal users receive that behavior after npx setup.",
          "When writing docs, bug reports, or benchmark notes, describe the flag, the branch or release, and whether it is enabled by default.",
        ],
      },
      {
        heading: "Retrieval and context flags",
        body: [
          "Recent main-branch work explores how to retrieve and assemble smaller, more useful context bundles: graph activation, temporal filtering, FTS hardening, session diversity, salience priors, episode and fact channels, PRF, k-hop graph traversal, global preludes, iterative retrieval, LLM routing, and read-time context compression.",
          "These flags can change ranking, context composition, token cost, or evaluation labels. Do not compare results across flag sets without naming the active flags.",
        ],
        code: {
          label: "Retrieval flags",
          code: retrievalFlags,
        },
        link: {
          label: "Read advanced retrieval",
          href: "/docs/advanced-retrieval",
        },
      },
      {
        heading: "Memory maintenance flags",
        body: [
          "Other experiments target write-time and background maintenance: temporal grounding, entity near-dedup, page rewrite shrink guards, dual-pool dedup/contradiction resolution, soft eviction, and debounced reflection.",
          "These are especially sensitive because they affect what becomes durable context. Use them on isolated development data unless a release note says the behavior is ready for normal installs.",
        ],
        code: {
          label: "Maintenance flags",
          code: experimentalMaintenanceFlags,
        },
      },
      {
        heading: "Eval discipline",
        body: [
          "Every flag that changes retrieval, compression, graph expansion, or maintenance can also change benchmark meaning. A result is only useful if it records the fixture, schema, model, run count, and active flags.",
          "If a flag is eval-only or not wired into the normal daemon path yet, say so plainly. Context compression is an example of a main-branch experiment that should not be described as default chat-context behavior until release notes promote it.",
        ],
        link: {
          label: "Read evaluation",
          href: "/docs/evaluation",
        },
      },
      {
        heading: "Safe local testing",
        body: [
          "Do not test experimental maintenance flags against your normal product data unless you mean to. Run a source checkout on a separate port and data directory so experiments cannot rewrite the memory store you rely on daily.",
          "After a flag test, capture the exact command, environment, and git commit. That makes the result reproducible and keeps later docs from turning a local experiment into a product claim.",
        ],
        code: {
          label: "Isolated daemon",
          code: devIsolationEnvVars,
        },
        link: {
          label: "Read environment variables",
          href: "/docs/environment-variables",
        },
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
          "There is no cloud sync or telemetry by default. Connected AI tools may still send prompts to their own model providers; Origin's job is to keep the memory layer itself local, inspectable, and shared across tools.",
        ],
      },
      {
        heading: "Where data lives",
        body: [
          "Origin exposes human-facing artifacts under ~/.origin. The daemon database lives under the operating system's application data directory and is linked from ~/.origin/db for convenience.",
          "The important files are readable without a special app: pages are Markdown, session logs are Markdown, and project status is stored beside the session records.",
        ],
        bullets: [
          "~/.origin/pages/: distilled wiki pages.",
          "~/.origin/sessions/: session handoff logs.",
          "~/.origin/sessions/_status/: current project status records.",
          "~/.origin/bin/: installed Origin CLI, daemon, and MCP connector binaries.",
          "~/.origin/db/: link to the daemon's local database store.",
          "macOS: ~/Library/Application Support/origin/.",
          "Linux: ~/.local/share/origin/ or $XDG_DATA_HOME/origin/.",
          "Windows: %LOCALAPPDATA%\\origin\\.",
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
          "ANTHROPIC_API_KEY is only used when you explicitly opt into daemon-side Anthropic work with the key setup path. Optional model and API paths can add heavier language features, but they are not required for the basic memory loop.",
        ],
      },
      {
        heading: "Correction and deletion",
        body: [
          "If a memory is wrong, capture the correction with why it supersedes the old fact. If a memory should be removed entirely, use /forget with the memory ID.",
          "Delete and forget operations are separate from service uninstall. For distilled pages, inspect the Markdown directly. User-edited pages are treated carefully so automated distillation does not overwrite human work casually.",
        ],
      },
    ],
    nextSlug: "backup-and-migration",
  },
  {
    slug: "backup-and-migration",
    group: "Reference",
    eyebrow: "Backup",
    title: "Backup and Migration",
    description:
      "Back up Origin's readable artifacts and daemon data together, then verify the restored runtime before trusting recall.",
    metaTitle: "Origin Backup and Migration | Docs",
    metaDescription:
      "Learn what to back up for Origin, how readable ~/.origin artifacts relate to daemon data, and how to verify a restored or migrated install.",
    keywords: [
      "Origin backup",
      "Origin migration",
      "backup AI memory",
      "migrate Origin",
      "Origin data directory",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "~/.origin contains readable artifacts, but the daemon data directory also matters for a complete backup.",
      "After moving or restoring Origin, verify with status, doctor, and a capture/recall round trip from the client you use.",
    ],
    sections: [
      {
        heading: "What to back up",
        body: [
          "Back up the readable artifacts and the daemon application data together. The readable side gives you pages, sessions, status records, and local git history. The daemon data side keeps the database, index, config, and service-facing state.",
          "A backup that only includes ~/.origin may preserve useful Markdown, but it should not be treated as a complete live runtime restore.",
        ],
        code: {
          label: "Paths",
          code: backupPaths,
        },
      },
      {
        heading: "Keep backups private",
        body: [
          "Origin memory can contain project decisions, private preferences, client names, sensitive repo details, and old versions preserved by local git history.",
          "Do not put backups in a shared cloud folder, public issue, or team drive unless that is an intentional data-governance decision.",
        ],
      },
      {
        heading: "Before moving machines",
        body: [
          "Install the Origin runtime on the new machine first, then restore the backed-up data into the matching platform locations.",
          "MCP client settings may contain absolute paths to origin-mcp. After migration, rerun origin mcp add for each client instead of assuming old settings still point to the right binary.",
        ],
      },
      {
        heading: "Verify after restore",
        body: [
          "Do not judge a migration from file presence alone. Verify the daemon can read the store, the MCP connector can reach the daemon, and the client can recall a known fact.",
          "If doctor reports path or service problems, fix those before capturing new production memories on the restored machine.",
        ],
        code: {
          label: "Checks",
          code: migrationChecks,
        },
      },
      {
        heading: "Plain Markdown fallback",
        body: [
          "If you cannot restore the daemon immediately, the projected Markdown under ~/.origin is still useful as a human-readable fallback.",
          "That fallback does not provide capture, recall, distill, review, forget, or index updates. Treat it as readable continuity, not a full Origin runtime.",
        ],
      },
      {
        heading: "Deletion is separate",
        body: [
          "Uninstalling Origin's service does not delete memory data. Deleting memory data is a separate decision because it can remove the only local record of project history.",
          "When removing Origin permanently, review what is in ~/.origin and the daemon data directory first. For normal troubleshooting, keep the data and use doctor output to diagnose the install.",
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
    nextSlug: "environment-variables",
  },
  {
    slug: "environment-variables",
    group: "Reference",
    eyebrow: "Config",
    title: "Environment Variables",
    description:
      "Know which Origin environment variables are normal configuration, which are development-only, and which belong to eval or Windows repair paths.",
    metaTitle: "Origin Environment Variables | Docs",
    metaDescription:
      "Reference Origin environment variables including ORIGIN_SPACE, ORIGIN_BIND_ADDR, ORIGIN_PORT, ORIGIN_DATA_DIR, ORT_DYLIB_PATH, ANTHROPIC_API_KEY, and eval cache variables.",
    keywords: [
      "Origin environment variables",
      "ORIGIN_SPACE",
      "ORIGIN_BIND_ADDR",
      "ORIGIN_DATA_DIR",
      "ORT_DYLIB_PATH",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Most users should configure Origin with /init, origin setup, origin mcp add, origin model, origin key, and origin space.",
      "Environment variables are for scoped overrides: spaces, daemon networking, dev isolation, Windows runtime repair, and eval runs.",
    ],
    sections: [
      {
        heading: "Use commands first",
        body: [
          "Origin's normal configuration path is command-driven. Use /init or npx setup for installation, origin mcp add for clients, origin space for spaces, and origin key or origin model for optional language features.",
          "Reach for environment variables when you need a temporary override, a scripted run, or a development/eval setup that should not become the default for every session.",
        ],
      },
      {
        heading: "Normal runtime overrides",
        body: [
          "ORIGIN_SPACE selects the active memory bucket for the current shell or process. ORIGIN_HOST points the CLI at a daemon URL when you are not using the default local address.",
          "ORIGIN_BIND_ADDR changes where the daemon listens and should stay loopback unless you intentionally expose the daemon in Docker or a VM.",
          "ANTHROPIC_API_KEY is only needed when you opt into daemon-side Anthropic work. The core local memory loop does not require it.",
        ],
        code: {
          label: "Runtime variables",
          code: runtimeEnvVars,
        },
      },
      {
        heading: "Development isolation",
        body: [
          "Developers sometimes need a separate port and data directory so a test daemon does not share the same database as the installed product runtime.",
          "Use those overrides deliberately and together. A different port without a different data directory can still point development work at production-like local memory data.",
        ],
        code: {
          label: "Isolated daemon",
          code: devIsolationEnvVars,
        },
      },
      {
        heading: "Windows runtime repair",
        body: [
          "If Windows cannot load the bundled ONNX Runtime library, point ORT_DYLIB_PATH at the onnxruntime.dll inside the Origin install directory before starting the daemon.",
          "This is a repair path, not a normal setup step. Start with origin doctor when the daemon fails to start.",
        ],
        code: {
          label: "Windows",
          code: windowsEnvVars,
        },
      },
      {
        heading: "Eval variables",
        body: [
          "Eval variables belong to benchmark and maintainer workflows. They control cache location, fixture truncation, and API-backed judge access.",
          "Do not use eval variables to make product claims casually. Public numbers should follow the eval methodology and state run count, fixture, model, and limits.",
        ],
        code: {
          label: "Eval examples",
          code: evalEnvVars,
        },
        link: {
          label: "Read evaluation",
          href: "/docs/evaluation",
        },
      },
      {
        heading: "Experimental flags",
        body: [
          "Main-branch experimental flags are separate from normal runtime configuration. They are for source checkouts, evaluation, and maintainer testing, not routine installed use.",
          "If you set one, record the flag name, git commit, data directory, and whether the feature is released or still on main.",
        ],
        link: {
          label: "Read experimental flags",
          href: "/docs/experimental-flags",
        },
      },
      {
        heading: "Security boundary",
        body: [
          "Environment variables can change where Origin listens, where it stores data, and which provider keys it can use. Treat those values like operational configuration, not copy-paste snippets.",
          "Never publish a shell transcript that includes API keys, private data paths, or a non-loopback daemon address you did not mean to expose.",
        ],
        link: {
          label: "Read data and privacy",
          href: "/docs/data-and-privacy",
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
          "If the daemon is running on a non-default local URL for development, origin-mcp also accepts --origin-url. Keep normal users on the default 127.0.0.1:7878 path.",
        ],
        code: {
          label: "mcpServers",
          code: mcpConfig,
        },
      },
      {
        heading: "Non-default daemon URL",
        body: [
          "Most users should not need this. It is for development or isolated testing when origin-server is intentionally running on a different local port.",
          "Use it together with isolated data so an MCP client does not accidentally talk to the wrong daemon.",
        ],
        code: {
          label: "MCP connector",
          code: mcpOriginUrlCommand,
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
    nextSlug: "agent-profiles",
  },
  {
    slug: "agent-profiles",
    group: "Reference",
    eyebrow: "Agents",
    title: "Agent Profiles",
    description:
      "Inspect the AI clients and local tools that write to Origin, then manage source attribution, enabled state, and trust from the CLI.",
    metaTitle: "Origin Agent Profiles | Docs",
    metaDescription:
      "Learn how Origin agent profiles identify Claude Code, Codex, Cursor, local scripts, and other clients through source_agent attribution, trust, enabled state, and CLI management.",
    keywords: [
      "Origin agent profiles",
      "origin agents command",
      "source_agent",
      "AI client trust",
      "MCP agent memory",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "Agent profiles help you see which client or tool produced a memory instead of treating every capture as anonymous.",
      "They are operational metadata for attribution and trust; spaces still separate work contexts.",
    ],
    sections: [
      {
        heading: "What an agent profile is",
        body: [
          "An agent profile represents a writer or client that uses the local daemon: Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, or a local script.",
          "Profiles make source attribution explicit. When memory has a source_agent value, later review and diagnostics can show where it came from.",
        ],
      },
      {
        heading: "Inspect registered agents",
        body: [
          "Use the CLI when you want to see which agents Origin knows about or inspect one profile in detail.",
          "This is useful after connecting a new MCP client, debugging an unexpected capture source, or checking whether a client is enabled.",
        ],
        code: {
          label: "Agent commands",
          code: agentCommands,
        },
      },
      {
        heading: "Trust and enabled state",
        body: [
          "Trust is a signal for how Origin should treat a known writer; it is not a replacement for reviewing uncertain memory.",
          "Enabled state is an operational switch for a profile. If a client is misconfigured or writing noisy captures, inspect the profile before deleting memory.",
        ],
        link: {
          label: "Read review and trust",
          href: "/docs/review-and-trust",
        },
      },
      {
        heading: "Profiles versus spaces",
        body: [
          "Agent profiles answer who wrote this. Spaces answer which work context this belongs to.",
          "Keep both dimensions. A trusted Claude Code profile can still write into the wrong space if the workspace resolver or ORIGIN_SPACE is wrong.",
        ],
        link: {
          label: "Read spaces",
          href: "/docs/spaces",
        },
      },
      {
        heading: "When to care",
        body: [
          "Most users do not need to edit profiles during normal daily work. The profile page matters when multiple MCP clients write to the same store, when a script imports memory, or when review shows an unfamiliar source.",
          "For normal setup, connect the client first, run doctor, then capture and recall one harmless fact to confirm the route.",
        ],
        link: {
          label: "Connect MCP clients",
          href: "/docs/mcp-clients",
        },
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
    nextSlug: "diagnostics-and-issue-reports",
  },
  {
    slug: "diagnostics-and-issue-reports",
    group: "Reference",
    eyebrow: "Diagnostics",
    title: "Diagnostics and Issue Reports",
    description:
      "Run the right checks before asking for help, separate daemon problems from client problems, and share only redacted output.",
    metaTitle: "Origin Diagnostics and Issue Reports | Docs",
    metaDescription:
      "Use /init, origin status, origin doctor, MCP dry-run output, and port checks to diagnose Origin setup issues before opening a redacted GitHub issue.",
    keywords: [
      "Origin diagnostics",
      "origin doctor",
      "Origin issue report",
      "Origin logs",
      "MCP diagnostics",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Start diagnostics with /init, origin status, origin doctor, and an MCP dry-run for the client that fails.",
      "Good issue reports include environment and redacted diagnostics, not private memory contents or full ~/.origin archives.",
    ],
    sections: [
      {
        heading: "Run the short checklist",
        body: [
          "Use the smallest command set that separates daemon health, client wiring, and port conflicts.",
          "If you are in Claude Code, start with /init. If you are in another client, use the terminal commands and the client's MCP status UI.",
        ],
        code: {
          label: "Diagnostics",
          code: diagnosticCommands,
        },
      },
      {
        heading: "Read the failure layer",
        body: [
          "If status or doctor cannot reach the daemon, focus on runtime setup, service registration, platform paths, and port 7878.",
          "If the daemon is healthy but the client has no tools, focus on MCP configuration, client restarts, and whether the client is launching the expected origin-mcp path.",
        ],
      },
      {
        heading: "Port 7878 conflicts",
        body: [
          "Only one Origin daemon should own the local database. A stale daemon from another checkout can make setup look broken even when the current install is fine.",
          "If port 7878 is occupied, identify what process is listening before restarting clients or changing configuration.",
        ],
      },
      {
        heading: "What to include in an issue",
        body: [
          "Include the client name, operating system, install path you used, exact command, expected behavior, actual behavior, and redacted diagnostic output.",
          "Mention whether /init or origin doctor passed, and whether a small capture/recall round trip works from any client.",
        ],
        bullets: [
          "Client: Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, VS Code, or other.",
          "Platform: macOS, Linux, Windows, Docker, VM, or WSL if relevant.",
          "Runtime: plugin setup, npx setup, source build, or migrated install.",
          "Diagnostics: /init output, origin status, origin doctor, and MCP dry-run output after redaction.",
        ],
        link: {
          label: "Open a GitHub issue",
          href: "https://github.com/7xuanlu/origin/issues",
        },
      },
      {
        heading: "What to redact",
        body: [
          "Do not paste private captures, client names, repo names, API keys, tokens, full session logs, or full ~/.origin archives into public issues.",
          "Replace sensitive project text with placeholders while keeping the structure of the failure visible. If the report is security-sensitive, use the private advisory path instead.",
        ],
        link: {
          label: "Security reporting",
          href: "/docs/security",
        },
      },
    ],
    nextSlug: "faq",
  },
  {
    slug: "faq",
    group: "Reference",
    eyebrow: "FAQ",
    title: "FAQ",
    description:
      "Short answers to the adoption questions people ask before and after installing Origin.",
    metaTitle: "Origin FAQ | Docs",
    metaDescription:
      "Answer common Origin questions about product positioning, install paths, desktop app status, local data, Markdown artifacts, uninstall behavior, and verification.",
    keywords: [
      "Origin FAQ",
      "what is Origin",
      "Origin install path",
      "Origin desktop app",
      "Origin local data",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "Origin is local-first memory for AI work: a daemon, CLI, MCP connector, and Claude Code plugin that share one local context layer.",
      "Use this page when you need the short answer, then follow the linked docs for setup, data, packages, troubleshooting, or project scope.",
    ],
    sections: [
      {
        heading: "Is Origin just memory?",
        body: [
          "Origin includes memory, but the product goal is broader than generic memory. It is a local memory layer for AI work so agents can carry decisions, context, handoffs, and source-backed pages across sessions and tools.",
          "That distinction matters because Origin is designed around the work loop: brief, capture, recall, handoff, distill, inspect, and keep going.",
        ],
        link: {
          label: "Read project scope",
          href: "/docs/project-scope",
        },
      },
      {
        heading: "Which install path should I use?",
        body: [
          "Use the Claude Code plugin if Claude Code is your main work surface. It gives you /init, /brief, /capture, /handoff, /distill, and the plugin-level workflow.",
          "Use npx -y @7xuanlu/origin setup when you want Origin from Codex, Cursor, Claude Desktop, Gemini CLI, VS Code, or another MCP client.",
        ],
        link: {
          label: "Compare package names",
          href: "/docs/packages-and-registries",
        },
      },
      {
        heading: "Do I need the desktop app?",
        body: [
          "No. The daemon, CLI, and MCP connector are the product path. The desktop app is optional and lives in a separate repository.",
          "If you only want agents to use Origin, install the plugin or runtime setup and verify the MCP route. You do not need a GUI.",
        ],
        link: {
          label: "Read desktop status",
          href: "/docs/desktop-app",
        },
      },
      {
        heading: "Where does data live?",
        body: [
          "Origin keeps the daemon database in the operating system's application data directory and keeps readable artifacts under ~/.origin.",
          "The core loop is local-first. Optional model or API-key choices can add more language features, but they are explicit configuration decisions.",
        ],
        link: {
          label: "Read data and privacy",
          href: "/docs/data-and-privacy",
        },
      },
      {
        heading: "Is Markdown the database?",
        body: [
          "No. Origin uses a local database and index for retrieval, graph context, pages, and daemon state. Markdown artifacts are the human-readable projection, not the whole storage system.",
          "This gives agents fast retrieval while still giving humans files they can inspect, version, back up, and move.",
        ],
        link: {
          label: "Read source-backed pages",
          href: "/docs/source-backed-pages",
        },
      },
      {
        heading: "Does uninstall delete memory?",
        body: [
          "No. origin uninstall removes the per-user service registration. It does not delete ~/.origin or the daemon data directory.",
          "That separation is intentional because local memory may be the only record of project decisions, handoffs, private preferences, and generated pages.",
        ],
        link: {
          label: "Read updates and uninstall",
          href: "/docs/updates-and-uninstall",
        },
      },
      {
        heading: "How do I know it works?",
        body: [
          "Run /init in Claude Code or origin doctor from the terminal. Then capture one small durable fact and recall it from the client you plan to use.",
          "If daemon health passes and a capture/recall round trip works, Origin is connected to the local memory layer.",
        ],
        link: {
          label: "Read troubleshooting",
          href: "/docs/troubleshooting",
        },
      },
    ],
    nextSlug: "security",
  },
  {
    slug: "security",
    group: "Project",
    eyebrow: "Security",
    title: "Security and Reporting",
    description:
      "Report vulnerabilities privately, keep diagnostic reports redacted, and understand Origin's local security boundary.",
    metaTitle: "Origin Security and Vulnerability Reporting | Docs",
    metaDescription:
      "Learn how to report Origin security issues, use the public security policy, avoid leaking private memory contents, and understand Origin's local-first security boundary.",
    keywords: [
      "Origin security",
      "Origin vulnerability reporting",
      "Origin security policy",
      "AI memory security",
      "local memory privacy",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "Use GitHub Issues for normal bugs and feature requests; use the private security channel for vulnerabilities.",
      "Do not paste private memory contents, API keys, client names, or ~/.origin archives into public reports.",
    ],
    sections: [
      {
        heading: "Where to report",
        body: [
          "Normal setup bugs, docs issues, and feature requests belong in GitHub Issues with redacted diagnostic output.",
          "If you discover a vulnerability, do not open a public issue. The source repository's SECURITY.md asks you to email h164654156465@gmail.com with the description, reproduction steps, and potential impact; GitHub Security Advisories are also available for private reports.",
        ],
        bullets: [
          "Public bugs: include client, OS, command, expected behavior, actual behavior, and redacted /init, doctor, or origin status output.",
          "Security reports: include impact, reproduction steps, affected version or commit, and only the minimum redacted data needed to reproduce.",
          "Never attach ~/.origin, the daemon database, private captures, API keys, or unredacted project logs to a public issue.",
        ],
        link: {
          label: "Open a private advisory",
          href: "https://github.com/7xuanlu/origin/security/advisories/new",
        },
      },
      {
        heading: "Local-first boundary",
        body: [
          "Origin keeps the memory layer local by default: daemon, database, Markdown artifacts, sessions, and git history live on your machine.",
          "That does not make every connected workflow offline. Your AI client may send prompts to its own provider, and Origin can optionally use configured model or API paths for daemon-side language work.",
        ],
      },
      {
        heading: "Secrets and memory contents",
        body: [
          "Treat memory as sensitive application data. It can contain project decisions, personal preferences, private codebase details, client names, and old versions preserved by local git history.",
          "If a bug involves a sensitive memory, create a minimal reproduction with fake content instead of sharing the real record.",
        ],
      },
      {
        heading: "Network exposure",
        body: [
          "The daemon binds to 127.0.0.1:7878 by default. That keeps the HTTP API local to the machine for normal use.",
          "Changing ORIGIN_BIND_ADDR to a non-loopback address is an explicit security decision. Do it only for deliberate Docker, VM, or development scenarios where you understand who can reach the daemon.",
        ],
      },
      {
        heading: "Security policy",
        body: [
          "The public website publishes /.well-known/security.txt for automated discovery. The source repository also carries the canonical security policy, including acknowledgement within 48 hours, a 7-day fix-timeline response target, and the current supported 0.7.x line.",
          "If in doubt, choose the private advisory or email path first. A maintainer can move non-sensitive follow-up work into a public issue later.",
        ],
        link: {
          label: "Read security.txt",
          href: "/.well-known/security.txt",
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
    nextSlug: "desktop-app",
  },
  {
    slug: "desktop-app",
    group: "Project",
    eyebrow: "Desktop",
    title: "Desktop App Status",
    description:
      "Understand how the optional Origin desktop app relates to the daemon, CLI, MCP server, and Claude Code plugin.",
    metaTitle: "Origin Desktop App Status | Docs",
    metaDescription:
      "Learn whether the Origin desktop app is required, what the main Origin repo owns, how the separate desktop repo fits, and which license boundary applies.",
    keywords: [
      "Origin desktop app",
      "Origin GUI",
      "Origin app",
      "Origin Tauri",
      "Origin desktop status",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "The core Origin product path is the local daemon, CLI, MCP server, and Claude Code plugin.",
      "The desktop app is optional and lives in a separate repository, while the daemon remains the source of truth.",
    ],
    sections: [
      {
        heading: "Is the desktop app required?",
        body: [
          "No. Origin's main workflow works through Claude Code commands, MCP tools, and the origin CLI. The local daemon owns memory either way.",
          "Use the desktop app only if you want a graphical layer on top of the same local memory system. Do not wait for the GUI to use the daily handoff loop.",
        ],
      },
      {
        heading: "What the main repo owns",
        body: [
          "The main Origin repo owns the daemon, business logic, CLI, MCP server, shared wire types, and Claude Code plugin files.",
          "That is the runtime path documented on this website: setup, capture, recall, handoff, distill, pages, data paths, diagnostics, and releases.",
        ],
      },
      {
        heading: "What the desktop repo owns",
        body: [
          "The desktop app lives separately so the GUI can evolve without making the local runtime depend on a specific frontend shell.",
          "When an issue is about memory behavior, retrieval, MCP tools, setup, service management, or the CLI, use the main Origin repo. When an issue is about the desktop UI itself, use the desktop app repo.",
        ],
        link: {
          label: "Open origin-app",
          href: "https://github.com/7xuanlu/origin-app",
        },
      },
      {
        heading: "Data model",
        body: [
          "The desktop app should be treated as a client over the daemon, not a second source of truth. The daemon owns the database, pages, sessions, and retrieval behavior.",
          "That boundary is what lets Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, terminal commands, and the optional GUI share the same memory layer.",
        ],
      },
      {
        heading: "License boundary",
        body: [
          "The main daemon, CLI, MCP server, core, shared types, and plugin files are Apache-2.0.",
          "The optional desktop app has its own repository and AGPL-3.0-only license boundary. Check the desktop repo before reusing app code or contributing across that boundary.",
        ],
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
    nextSlug: "releases-and-versioning",
  },
  {
    slug: "releases-and-versioning",
    group: "Project",
    eyebrow: "Releases",
    title: "Releases and Versioning",
    description:
      "Understand how Origin turns merged work into tagged releases, package versions, binaries, npm packages, and crates.",
    metaTitle: "Origin Releases and Versioning | Docs",
    metaDescription:
      "Learn Origin's release-please flow, pre-1.0 version bump rules, package publishing surfaces, and how users should distinguish released behavior from main-branch work.",
    keywords: [
      "Origin releases",
      "Origin versioning",
      "release-please Origin",
      "origin-mcp npm release",
      "Origin crates.io release",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "CHANGELOG.md and GitHub Releases are the user-facing record for shipped behavior.",
      "release-please prepares the release PR; tag workflows publish the local runtime packages and binaries.",
    ],
    sections: [
      {
        heading: "Release source of truth",
        body: [
          "For users, the shipped record is the GitHub release, CHANGELOG.md, and the packages installed by the Claude Code plugin or npx setup.",
          "Merged PRs can describe useful work, but they are not the same as a release until a tag and changelog entry publish that behavior.",
        ],
        link: {
          label: "Read the changelog",
          href: "/docs/changelog",
        },
      },
      {
        heading: "How a release moves",
        body: [
          "Origin uses release-please to maintain a release PR from merged commits. When that release PR is merged, tag-based workflows build and publish the local runtime.",
          "The release workflow ships the daemon CLI, origin-server, origin-mcp, standalone binaries, npm packages, crates, and Homebrew tap updates. The optional desktop app releases from its own repository.",
        ],
        code: {
          label: "Release flow",
          code: releaseFlow,
        },
      },
      {
        heading: "Version bump rules",
        body: [
          "Origin is pre-1.0, so release bump semantics are intentionally conservative. In this repo, feat commits bump the minor version before 1.0; fix commits bump patch.",
          "Squash merge titles matter because the squash commit message is what release-please reads. A PR titled feat: should only land that way when a minor release is intended.",
        ],
        code: {
          label: "Commit prefixes",
          code: releaseBumpRules,
        },
      },
      {
        heading: "What gets published",
        body: [
          "The release pipeline publishes the pieces users install: @7xuanlu/origin for the Claude Code plugin and setup path, origin-mcp for MCP clients, origin-types for Rust consumers, release archives, and Homebrew artifacts.",
          "Version files in the repo stay aligned so the CLI, daemon, MCP connector, npm packages, and crates all describe the same runtime generation.",
        ],
        link: {
          label: "Read package names",
          href: "/docs/packages-and-registries",
        },
      },
      {
        heading: "How users should upgrade",
        body: [
          "Users should read the changelog, rerun npx setup or /init, verify origin doctor, and restart MCP clients after package or connector changes.",
          "If a page says a feature is on main, opt-in, or experimental, do not assume it is available in your installed runtime until a release page says so.",
        ],
        link: {
          label: "Read upgrade notes",
          href: "/docs/upgrade-notes",
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
          "The product docs should stay practical. Setup, daily workflow, capture quality, memory types, architecture, commands, CLI/service management, updates, upgrade notes, packages, platform support, HTTP API, API examples, spaces, graph context, source-backed pages, import and portability, local git history, models and keys, retrieval status, experimental flags, data and privacy, backup and migration, configuration, environment variables, diagnostics, FAQ, evaluation, desktop status, releases, testing, development conventions, and troubleshooting are the current core path.",
          "The remaining gap is mature retrieval documentation once opt-in experiments become stable defaults.",
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
    nextSlug: "testing-and-ci",
  },
  {
    slug: "testing-and-ci",
    group: "Project",
    eyebrow: "Quality",
    title: "Testing and CI",
    description:
      "Understand which Origin checks run locally, which run in GitHub Actions, and which evals stay manual.",
    metaTitle: "Origin Testing and CI | Docs",
    metaDescription:
      "Learn Origin's local test workflow, pre-commit and pre-push hooks, PR CI, coverage policy, manual eval boundaries, and verification expectations for contributors.",
    keywords: [
      "Origin tests",
      "Origin CI",
      "Origin contributor checks",
      "Origin coverage",
      "Origin eval tests",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Origin splits checks by cost and signal: fast local checks gate development; heavy evals stay manual.",
      "PR CI must prove daemon correctness, but retrieval-quality claims need separate eval discipline.",
    ],
    sections: [
      {
        heading: "Why checks are layered",
        body: [
          "Origin is a local daemon, CLI, MCP server, core library, and shared type crate. A single slow mega-check would make normal contribution work worse.",
          "The repo separates correctness checks from quality measurement. Tests and clippy gate normal changes; coverage and evals inform decisions without pretending to be cheap smoke tests.",
        ],
        code: {
          label: "Check layers",
          code: testLayerMap,
        },
      },
      {
        heading: "Local verification",
        body: [
          "Use targeted crate tests while iterating, then run full formatting, clippy, and tests before opening or merging a PR.",
          "The public contributor path expects evidence. If a change affects behavior, include the smallest relevant test rather than relying on manual inspection.",
        ],
        code: {
          label: "Contributor checks",
          code: contributorVerificationCommands,
        },
      },
      {
        heading: "Git hooks",
        body: [
          "The repo includes hooks for routine local guardrails. Pre-commit handles formatting and changed-crate clippy. Pre-push runs workspace clippy plus library tests.",
          "Hooks reduce CI churn, but they do not replace the final PR checks. Treat them as early feedback.",
        ],
        code: {
          label: "Hook setup",
          code: hookSetupCommands,
        },
      },
      {
        heading: "CI and coverage",
        body: [
          "GitHub Actions runs the required PR gate: formatting, linting, and tests across the daemon workspace. Coverage runs separately as informational signal.",
          "Coverage is not a pre-push percentage gate. The project intentionally avoids local coverage gates that are slow, brittle, and not mirrored by the required CI lane.",
        ],
      },
      {
        heading: "Manual evals",
        body: [
          "LoCoMo, LongMemEval, KG faithfulness, page faithfulness, and API-backed judge runs have different cost and hardware requirements. Some run only as ignored tests or manual eval workflows.",
          "Do not cite new retrieval or quality numbers from a casual run. Public benchmark claims should follow the eval docs and state the fixture, model, run count, and limits.",
        ],
        link: {
          label: "Read evaluation",
          href: "/docs/evaluation",
        },
      },
      {
        heading: "Before asking for review",
        body: [
          "A good PR says what changed, why it matters, and how it was tested. Include the commands that prove the change instead of saying it should work.",
          "Docs-only changes still need a build. Code changes should include relevant tests or a clear explanation of why the behavior is covered elsewhere.",
        ],
        link: {
          label: "Read development conventions",
          href: "/docs/development-conventions",
        },
      },
    ],
    nextSlug: "development-conventions",
  },
  {
    slug: "development-conventions",
    group: "Project",
    eyebrow: "Development",
    title: "Development Conventions",
    description:
      "Codebase rules that keep Origin's daemon, CLI, MCP connector, shared types, and core logic maintainable.",
    metaTitle: "Origin Development Conventions | Docs",
    metaDescription:
      "Learn Origin contributor conventions for crate boundaries, SQL safety, async state snapshots, typed MCP wrappers, dev/prod isolation, and worktree gotchas.",
    keywords: [
      "Origin development conventions",
      "Origin crate boundaries",
      "Origin SQL safety",
      "Origin async locks",
      "Origin MCP wrappers",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Origin's maintainer rules keep the local daemon simple, testable, and careful around private work context.",
      "Use these conventions when you change daemon behavior, MCP tools, storage, typed clients, or release-facing paths.",
    ],
    sections: [
      {
        heading: "Why conventions matter",
        body: [
          "Origin's daemon owns the local store that multiple AI clients read from and write to. A small boundary mistake can leak framework dependencies into core logic, change a public response shape, or make private data harder to inspect safely.",
          "The conventions are intentionally practical: keep business logic in the core crate, keep public wire types stable, keep state snapshots short-lived, and keep user data out of public bug reports.",
        ],
      },
      {
        heading: "Crate boundaries",
        body: [
          "origin-core owns storage, retrieval, graph logic, pages, evals, and other business behavior. It should not depend on Axum or Tauri. origin-server should frame HTTP requests and call core logic instead of becoming a second business layer.",
          "origin-types stays lightweight because it is shared by the daemon, MCP connector, CLI-adjacent tooling, desktop app, and downstream Rust clients. origin-mcp should deserialize daemon responses into typed structs so envelope drift fails loudly.",
        ],
        code: {
          label: "Boundary map",
          code: developmentBoundaryRules,
        },
        link: {
          label: "Read architecture",
          href: "/docs/architecture",
        },
      },
      {
        heading: "Data safety",
        body: [
          "Use parameterized SQL instead of interpolated query strings. Preserve Option<T> as SQL NULL so unset values stay distinguishable from empty strings.",
          "Rust strings are UTF-8, so avoid byte indexing for user content. Wrap multi-row mutations in transactions, and redact memory contents before copying diagnostics into public issues.",
        ],
        code: {
          label: "Storage rules",
          code: developmentSafetyRules,
        },
      },
      {
        heading: "Async and state",
        body: [
          "Do not hold long-lived state guards across awaits. Route handlers should clone the small pieces they need, drop the lock, and then call storage, LLM, or eval code.",
          "This matters most around LLM calls, imports, distillation, eval paths, and any request that can take longer than a normal local HTTP round trip.",
        ],
      },
      {
        heading: "Development gotchas",
        body: [
          "A source checkout can talk to the same product daemon and data directory that your installed Origin uses. For isolated development, run the daemon on a different port with a temporary data directory.",
          "Worktrees have their own gitignored caches and generated artifacts. After squash merges, git cherry can mislead; verify integration by commit message, PR body, or the actual diff instead.",
        ],
        code: {
          label: "Common gotchas",
          code: developmentGotchas,
        },
        link: {
          label: "Read environment variables",
          href: "/docs/environment-variables",
        },
      },
      {
        heading: "Before changing shared behavior",
        body: [
          "Add the smallest relevant test before changing daemon behavior, public wire shapes, MCP tool outputs, or retrieval semantics. Keep PRs narrow enough that reviewers can reason about them.",
          "If a change affects what users install, run, cite, or troubleshoot, update the matching docs page in the same PR.",
        ],
        link: {
          label: "Read typed clients",
          href: "/docs/typed-clients",
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
          "Keep the core crate framework-independent, keep origin-types lightweight, deserialize MCP responses into typed structs, and avoid holding long-lived locks across awaits.",
          "The full convention list lives in the Development Conventions doc so this contributing page can stay focused on the contribution path.",
        ],
        link: {
          label: "Read development conventions",
          href: "/docs/development-conventions",
        },
      },
      {
        heading: "License",
        body: [
          "The main repo is Apache-2.0. By contributing, you agree that your changes are licensed under the license that applies to the files you modify.",
          "The desktop app has its own repository and AGPL-3.0-only license. Check the target repo before contributing across that boundary.",
        ],
        link: {
          label: "Read CONTRIBUTING.md",
          href: "https://github.com/7xuanlu/origin/blob/main/CONTRIBUTING.md",
        },
      },
      {
        heading: "Community behavior",
        body: [
          "The repository includes a Code of Conduct. Contributions, issues, reviews, and community discussion should follow that policy as well as the technical contribution rules.",
          "Keep public threads focused, specific, and redacted. Sensitive security details belong in the private reporting path.",
        ],
        link: {
          label: "Read the Code of Conduct",
          href: "https://github.com/7xuanlu/origin/blob/main/CODE_OF_CONDUCT.md",
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
