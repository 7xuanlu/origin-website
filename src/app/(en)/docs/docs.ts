import { DEFAULT_AUTHOR, SITE_URL } from "../learn/articles";

export const DOCS_UPDATED_AT = "2026-07-09";

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
  publishedAt?: string;
  updatedAt: string;
  author: string;
  readingTime: string;
  summary: string[];
  sections: DocSection[];
  nextSlug?: string;
  howTo?: boolean;
};

const mcpConnectCommand = `~/.wenlan/bin/wenlan connect claude-code
# or: codex, cursor, claude-desktop, vscode, gemini`;

const mcpConfig = `{
  "mcpServers": {
    "wenlan": {
      "command": "/Users/you/.wenlan/bin/wenlan-mcp"
    }
  }
}`;

const mcpWenlanUrlCommand = "wenlan-mcp --origin-url http://127.0.0.1:7879";

const wenlanSetupCommand = "npx -y wenlan setup";

const architectureMap = `wenlan-server  -> local daemon on 127.0.0.1:7878
wenlan-core    -> storage, search, graph, pages, eval
wenlan CLI     -> setup, service management, recall, doctor
wenlan-mcp     -> stdio + Streamable HTTP MCP for AI clients
wenlan-types   -> shared HTTP/MCP wire types
plugin/        -> Claude Code slash commands and hooks
plugin-codex/  -> Codex skills and MCP runner`;

const evalSnapshot = `Benchmark                         Scope                         Recall@5   MRR     NDCG@10
LME_Oracle                        CE-reranked, 500 Q            93.6%     0.857   0.883
LME_S                             CE-reranked, deep N=90        87.7%     0.815   0.822`;

const serviceCommands = `wenlan status
wenlan doctor
wenlan background on
wenlan background off`;

const updateCommands = `# refresh the local runtime installed under ~/.wenlan/bin
npx -y wenlan setup

# verify after any update
~/.wenlan/bin/wenlan status
~/.wenlan/bin/wenlan doctor`;

const upgradeCommands = `# refresh the local runtime and connector
npx -y wenlan setup

# verify daemon and setup health
~/.wenlan/bin/wenlan status
~/.wenlan/bin/wenlan doctor

# inspect MCP config before changing a client
~/.wenlan/bin/wenlan connect codex --dry-run`;

const uninstallCommands = `~/.wenlan/bin/wenlan background off

# stops the background process and removes its per-user registration
# then remove Wenlan from each MCP client's settings if you added it manually`;

const packageSurfaceMap = `wenlan              Claude Code plugin package and setup entrypoint
plugin-codex/       Codex plugin source and local marketplace
wenlan-mcp          MCP connector package and Rust crate
wenlan-types        Shared HTTP/MCP wire types
GitHub Releases     Stable binaries, tags, and release notes`;

const packageInstallPaths = `# Claude Code
/plugin marketplace add 7xuanlu/claude-plugins
/plugin install wenlan@7xuanlu
/setup

# Codex and other local MCP clients
npx -y wenlan setup
~/.wenlan/bin/wenlan connect codex

# Manual MCP fallback
npx -y wenlan-mcp`;

const packageVerificationCommands = `~/.wenlan/bin/wenlan status
~/.wenlan/bin/wenlan doctor
~/.wenlan/bin/wenlan connect codex --dry-run
~/.wenlan/bin/wenlan connect cursor --dry-run`;

const releaseFlow = `merge to main
  -> release-please updates the release PR
  -> merge the release PR when ready to ship
  -> tag workflow builds binaries and publishes packages
  -> users refresh with npx -y wenlan setup`;

const releaseBumpRules = `fix:              patch release before 1.0
feat:             minor release before 1.0
BREAKING CHANGE:  minor release before 1.0
docs/test/chore:  no release entry by default`;

const pluginInstallCommands = `/plugin marketplace add 7xuanlu/claude-plugins
/plugin install wenlan@7xuanlu
# restart Claude Code if prompted
/setup`;

const pluginDailyCommands = `/setup       setup + diagnosis
/help       one-screen reference
/brief      load session context
/capture    save one durable memory
/recall     search local memory
/distill    synthesize or refresh pages
/pages      list or open distilled pages
/lint       run read-only memory and page health diagnostics
/curate     audit pending captures or revisions
/forget     delete a memory by ID
/handoff    end-of-session debrief`;

const pluginDataPaths = `~/.wenlan/pages/               distilled wiki pages
~/.wenlan/sessions/            session logs
~/.wenlan/sessions/_status/    current project status
~/.wenlan/db/                  link to daemon store
~/.wenlan/bin/                 installed binaries`;

const diagnosticCommands = `# Claude Code
/setup

# Terminal
~/.wenlan/bin/wenlan status
~/.wenlan/bin/wenlan doctor
~/.wenlan/bin/wenlan connect codex --dry-run
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

const productSurfaceBullets = [
  "daemon/runtime - owner: wenlan; released source of truth; run npx -y wenlan setup; verify with ~/.wenlan/bin/wenlan status.",
  "CLI - owner: wenlan; released with the runtime; run ~/.wenlan/bin/wenlan doctor before debugging clients.",
  "MCP connector - owner: wenlan; released as wenlan-mcp; run wenlan connect <client>; verify with wenlan connect codex --dry-run.",
  "Claude Code plugin - owner: wenlan; released plugin workflow; install wenlan@7xuanlu; verify with /setup.",
  "Codex plugin - owner: wenlan; released Codex plugin surface; use the plugin-codex setup skill; verify with wenlan connect codex --dry-run.",
  "ChatGPT and Claude.ai remote MCP - owner: wenlan; released Streamable HTTP MCP endpoint with a guided desktop Remote Access path; verify the generated URL before adding a custom app or connector.",
  "other MCP clients - owner: wenlan; client-specific config; run wenlan connect cursor or the matching client; restart the client, then call context.",
  "optional desktop app - owner: wenlan app/ crate; optional daemon client in the unified release; verify the app talks to localhost:7878.",
  "source build - owner: wenlan; contributor/dev path; run cargo build --workspace; verify with cargo test --workspace.",
  "eval/docs provenance - owner: wenlan; CI/release guarded docs; update the README eval block and check README translations.",
];

const productRouteBullets = [
  "Install first runtime: /docs/get-started.",
  "Run the daily memory loop: /docs/daily-workflow.",
  "Learn concepts: /docs/core-concepts.",
  "See daemon/client boundary: /docs/architecture.",
  "Map packages and registries: /docs/packages-and-registries.",
  "Check platform support: /docs/platforms.",
  "Connect MCP clients: /docs/mcp-clients.",
  "Understand optional GUI: /docs/desktop-app.",
  "Fix setup: /docs/troubleshooting.",
  "Know shipped versus unreleased work: /docs/releases-and-versioning.",
];

const platformSupportBullets = [
  "macOS Apple Silicon - current prebuilt runtime, launchd user agent, and current desktop app target aarch64-apple-darwin.",
  "macOS Intel - no current prebuilt runtime in the release workflow; launchd code path exists, but treat it as source/dev-only; no current desktop app target.",
  "Linux x86_64 - current prebuilt runtime and systemd user unit; no current desktop app target.",
  "Linux aarch64 glibc - current prebuilt runtime and systemd user unit; no current desktop app target.",
  "Windows x86_64 - current prebuilt runtime with bundled ONNX Runtime and Vulkan loader, plus a Task Scheduler ONLOGON task and a current desktop setup executable.",
];

const platformDataDirs = `macOS:   ~/Library/Application Support/wenlan/
Linux:   ~/.local/share/wenlan/ or $XDG_DATA_HOME/wenlan/
Windows: %LOCALAPPDATA%\\origin\\ (current runtime legacy directory)

Readable artifacts: ~/.wenlan/`;

const backupPaths = `Readable artifacts:
~/.wenlan/

Daemon application data:
macOS:   ~/Library/Application Support/wenlan/
Linux:   ~/.local/share/wenlan/ or $XDG_DATA_HOME/wenlan/
Windows: %LOCALAPPDATA%\\origin\\ (current runtime legacy directory)`;

const migrationChecks = `~/.wenlan/bin/wenlan status
~/.wenlan/bin/wenlan doctor

# then verify from the client:
/brief
/recall <known project fact>`;

const cliDailyCommands = `wenlan recall "wenlan website positioning"
wenlan search "MCP setup"
wenlan capture "We chose spaces for client separation" --type decision
wenlan memories --limit 10`;

const agentCommands = `wenlan agents list
wenlan agents show claude-code
wenlan agents edit claude-code --trust trusted --enabled true`;

const spaceCommands = `WENLAN_SPACE=career claude

wenlan spaces list
wenlan spaces add ideas --default
wenlan spaces show ideas
wenlan spaces move scratch career`;

const spaceResolverChain = `1. explicit --arg override
2. WENLAN_SPACE environment variable
3. ~/.wenlan/spaces.toml cwd-prefix mapping
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

const importPortabilityCommands = `# readable Wenlan artifacts
ls ~/.wenlan/pages/
ls ~/.wenlan/sessions/

# migrate selected durable notes explicitly
~/.wenlan/bin/wenlan capture "Imported note: <durable context>" --type fact`;

const gitHistoryCommands = `cd ~/.wenlan
git log --oneline --decorate --all -20
git show --stat HEAD
git diff HEAD~1 -- pages/`;

const modelSetupCommands = `wenlan setup --basic
wenlan models install qwen3-4b
wenlan keys set anthropic

wenlan models status
wenlan keys status
wenlan models reranker lite
wenlan doctor`;

const agentSideModelPhases = `Pick memory_type        daemon classifier       /capture chooses type
Extract entities        daemon extraction       /capture posts entities
Synthesize pages        daemon distill cycle    /distill writes page
Expand/rerank recall    daemon rerank/expand    /recall rewrites query`;

const configurationKnobs = `WENLAN_SPACE=client-a
WENLAN_HOST=http://127.0.0.1:7878
WENLAN_BIND_ADDR=127.0.0.1:7878
WENLAN_BIND_ADDR=0.0.0.0:7878  # Docker or VM only`;

const configurationFiles = `~/.wenlan/
~/.wenlan/bin/
~/.wenlan/db/
~/.wenlan/pages/
~/.wenlan/sessions/
~/.wenlan/spaces.toml
~/Library/Application Support/wenlan/
~/.local/share/wenlan/
%LOCALAPPDATA%\\origin\\  # current Windows runtime legacy directory`;

const runtimeEnvVars = `WENLAN_SPACE=client-a
WENLAN_HOST=http://127.0.0.1:7878
WENLAN_BIND_ADDR=127.0.0.1:7878
WENLAN_BIND_ADDR=0.0.0.0:7878  # Docker or VM only
ANTHROPIC_API_KEY=sk-ant-...`;

const devIsolationEnvVars = `WENLAN_PORT=7879
WENLAN_DATA_DIR=/tmp/wenlan-test
cargo run -p wenlan-server`;

const windowsEnvVars = `ORT_DYLIB_PATH=C:\\path\\to\\wenlan\\onnxruntime.dll`;

const evalEnvVars = `EVAL_BASELINES_DIR=$HOME/.cache/origin-eval
EVAL_LOCOMO_LIMIT=25
EVAL_LME_LIMIT=25
ANTHROPIC_API_KEY=sk-ant-...`;

const captureExamples = `/capture We chose source-backed pages because summaries need provenance.
/capture Supersedes earlier setup docs: Windows now uses a Task Scheduler ONLOGON task.
/capture Gotcha: Do not paste private memory contents into public issues.`;

const reviewCommands = `/curate captures
/curate revisions
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
    "query": "wenlan website docs",
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

const typedClientSurfaces = `wenlan-server  HTTP backend daemon
wenlan-mcp     MCP server wrapper for AI tools
wenlan CLI     setup, doctor, recall, search, capture, memories
local clients  Rust tools that call the daemon directly`;

const typedClientInstall = `cargo add wenlan-types

# then use the shared request/response structs
# instead of passing untyped JSON through your tool`;

const buildFromSourceCommands = `git clone https://github.com/7xuanlu/wenlan.git
cd wenlan
cargo build --workspace
cargo run -p wenlan-server

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
cargo test -p wenlan-core --lib
cargo test -p wenlan-server`;

const hookSetupCommands = `bash scripts/setup-hooks.sh

# hooks then run focused checks before commit/push
git commit
git push`;

const developmentBoundaryRules = `wenlan-core      business logic; no Axum or Tauri
wenlan-server    HTTP framing, not business logic
wenlan-types     lightweight shared wire types
wenlan-mcp       typed daemon responses, no JSON passthrough
route handlers   snapshot state before awaits`;

const developmentSafetyRules = `SQL:       parameterized queries only
NULL:      store Option<T> as SQL NULL
UTF-8:     do not byte-index Rust strings
Batch SQL: wrap multi-row mutations in BEGIN/COMMIT
Privacy:   redact memory contents in issues`;

const developmentGotchas = `Product daemon: 127.0.0.1:7878 + platform data dir
Isolated dev:   WENLAN_PORT=7879 WENLAN_DATA_DIR=/tmp/wenlan-test
Squash merges:  verify by commit message/body, not git cherry alone
Worktrees:      gitignored caches are per-checkout`;

const retrievalFlags = `WENLAN_ENABLE_GRAPH_GATE
WENLAN_ENABLE_GRAPH_SEED
WENLAN_ENABLE_TEMPORAL_FILTER
WENLAN_ENABLE_QUERY_INTENT
WENLAN_MAGNITUDE_FUSION
WENLAN_ENABLE_FTS_HARDENING
WENLAN_ENABLE_SESSION_DIVERSITY
WENLAN_ENABLE_SALIENCE_PRIOR
WENLAN_ENABLE_EPISODE_CHANNEL
WENLAN_ENABLE_FACT_CHANNEL
WENLAN_PRF_ROUNDS
WENLAN_ENABLE_GRAPH_KHOP
WENLAN_ENABLE_GLOBAL_PRELUDE
WENLAN_ENABLE_COT_RETRIEVAL
WENLAN_LLM_ROUTE
WENLAN_ENABLE_CONTEXT_COMPRESS`;

const experimentalMaintenanceFlags = `WENLAN_ENABLE_TEMPORAL_GROUNDING
WENLAN_ENABLE_ENTITY_MINHASH
WENLAN_MERGE_SHRINK_GUARD
WENLAN_ENABLE_DUAL_POOL_RESOLVE
WENLAN_ENABLE_EVICTION
WENLAN_ENABLE_REFLECTION_DEBOUNCE`;

export const docPages: DocPage[] = [
  {
    slug: "daily-workflow",
    group: "After setup",
    eyebrow: "Workflow",
    title: "Daily Workflow",
    howTo: true,
    description:
      "Start with context, capture what matters, recall when needed, and hand off before context goes cold.",
    metaTitle: "Wenlan Daily Workflow | Docs",
    metaDescription:
      "Learn the daily Wenlan loop after setup: /brief or MCP context, /capture, /recall, /handoff, plus review and distillation when needed.",
    keywords: [
      "Wenlan daily workflow",
      "AI session handoff",
      "memory capture workflow",
      "Claude Code workflow",
      "MCP daily workflow",
    ],
    updatedAt: "2026-07-24",
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
          "Start a real work session with /brief in Claude Code or context in another MCP client. Wenlan returns project facts, recent handoffs, decisions, and distilled pages.",
          "If setup is not done yet, use /setup in Claude Code. For other MCP clients, run npx -y wenlan setup, then ~/.wenlan/bin/wenlan connect for the client you use.",
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
          "Good: Wenlan is AI work memory because it carries context across sessions, tools, and time.",
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
          code: "/recall wenlan website docs decisions",
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
          "/curate is for deep audits. /distill turns related memories into wiki pages.",
          "Use them after meaningful project work, before a new phase, or when recall starts surfacing repeated or stale context.",
        ],
        bullets: [
          "/curate captures: walk unconfirmed memories when you want the full queue.",
          "/curate revisions: accept or dismiss pending memory revisions.",
          "/distill: synthesize related memories into readable pages.",
          "/pages: list recent pages or open a matching page in your editor.",
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
      "Decide what belongs in Wenlan: durable facts, decisions, lessons, gotchas, corrections, and project context.",
    metaTitle: "Wenlan Capture Quality | Docs",
    metaDescription:
      "Learn what to capture in Wenlan, what to skip, how to write useful atomic memories, and how corrections, review, distill, and forget fit the memory loop.",
    keywords: [
      "Wenlan capture",
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
          "Wenlan works best when each memory carries one idea. One idea per capture makes deduplication, supersession, review, and page distillation easier.",
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
          "Do not store raw command output, long logs, temporary todos, or facts that are already obvious from source files. Wenlan keeps durable work context for future agents; it is not a transcript archive.",
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
          "/curate is for inspecting pending captures or revisions. /distill is for turning repeated clusters into readable pages.",
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
      "Understand how Wenlan keeps uncertain memory visible: pending captures, revisions, contradictions, rejections, confirm, and forget.",
    metaTitle: "Wenlan Review and Trust | Docs",
    metaDescription:
      "Learn how Wenlan handles review queues, pending captures, memory revisions, contradictions, quality-gate rejections, confirm, forget, and trust before distillation.",
    keywords: [
      "Wenlan review",
      "Wenlan trust",
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
          "Wenlan should not silently trust every captured sentence. Some facts are low-confidence, duplicated, contradicted, superseded, or too vague to promote into future context.",
          "Wenlan keeps those states visible so the human can confirm, correct, dismiss, forget, or let the daemon keep the item out of trusted context.",
        ],
      },
      {
        heading: "Capture queue",
        body: [
          "Use /curate captures when you want to walk unconfirmed memories. Confirm the captures that are durable and reject or forget the ones that should not carry forward.",
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
          "/curate revisions is for staged memory updates. Accept a revision when the new statement is the right current record; dismiss it when the old memory should remain.",
        ],
      },
      {
        heading: "Contradictions",
        body: [
          "Contradictions are not always bugs. They often mean the project changed, the user corrected course, or two contexts are being mixed.",
          "When Wenlan surfaces a contradiction, decide whether the newer fact supersedes the older one, whether the memories belong in different spaces, or whether one should be forgotten because it is simply wrong.",
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
      "Understand the pieces behind Wenlan: memories, sessions, handoffs, pages, the daemon, MCP, Markdown, and the local index.",
    metaTitle: "Wenlan Core Concepts | Docs",
    metaDescription:
      "Learn how Wenlan organizes AI work memory with sessions, handoffs, distilled pages, readable artifacts, a daemon-owned retrieval store, and MCP clients.",
    keywords: [
      "Wenlan core concepts",
      "AI memory model",
      "memory sessions",
      "distilled pages",
      "local index",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "Wenlan is a local-first personal knowledge library for AI work, not a chat UI or a notes app replacement.",
      "The daemon-owned store powers retrieval, graph structure, and metadata while Markdown artifacts stay human-readable.",
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
          "Wenlan does not preserve every token as the primary interface. It extracts the durable parts and makes them searchable later.",
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
          "The MCP server is the bridge. Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, and other MCP clients can connect to the same local daemon and source-backed wiki.",
        ],
      },
      {
        heading: "Markdown plus local index",
        body: [
          "Wenlan keeps human-readable artifacts in Markdown while the local database keeps indexes, metadata, graph structure, and retrieval state.",
          "That split matters for trust. The database helps agents search quickly, but the record is something you can inspect and control.",
        ],
      },
      {
        heading: "No model required",
        body: [
          "Wenlan gives you storage, embeddings, dedupe, hybrid search, and MCP recall without requiring a local model or API key.",
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
    title: "Wenlan Memory Types and memory_type Values",
    description:
      "Choose the right Wenlan memory_type for identity, preference, decision, lesson, gotcha, or fact captures.",
    metaTitle: "Wenlan Memory Types and memory_type Values | Docs",
    metaDescription:
      "Reference Wenlan memory_type values for identity, preference, decision, lesson, gotcha, and fact, with selection rules, stability tiers, and aliases.",
    keywords: [
      "Wenlan memory types",
      "Wenlan memory_type",
      "AI work memory taxonomy",
      "Wenlan capture types",
      "Wenlan memory schema",
    ],
    updatedAt: "2026-07-10",
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Quick answer: Wenlan uses six canonical memory_type values: identity, preference, decision, lesson, gotcha, and fact.",
      "Choose the type that explains why the capture matters later. Corrections are valid content, but correction is not a canonical memory_type value.",
    ],
    sections: [
      {
        heading: "Quick answer: which memory_type to use",
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
          "Wenlan can then surface revision or supersession behavior while keeping future recall pointed at the current fact.",
        ],
        link: {
          label: "Read review and trust",
          href: "/docs/review-and-trust",
        },
      },
      {
        heading: "Stability tiers",
        body: [
          "Wenlan treats identity and preference as protected because they describe the user. Standard work memories can still be important, but they are easier to supersede when new work changes the current record.",
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
          "If you are building a Rust local tool, prefer wenlan-types so invalid values fail visibly instead of drifting through untyped JSON.",
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
      "A quick map of Wenlan terms: memory, handoff, page, space, daemon, MCP, local index, provenance, and eval language.",
    metaTitle: "Wenlan Glossary | Docs",
    metaDescription:
      "Define Wenlan product terms including memories, handoffs, distilled pages, spaces, daemon, MCP connector, Markdown projection, local index, provenance, revisions, and retrieval metrics.",
    keywords: [
      "Wenlan glossary",
      "AI work memory terms",
      "Wenlan terminology",
      "MCP memory glossary",
      "AI memory vocabulary",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Use this glossary when a docs page mentions an Wenlan term and you need the short version before continuing.",
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
          "Markdown projection: the human-readable artifact layer under ~/.wenlan. Local index: the daemon-owned libSQL store that powers embeddings, FTS, graph context, pages, metadata, and retrieval.",
        ],
        bullets: [
          "Source-backed: a page or claim traces back to memory IDs instead of appearing as an unsourced summary.",
          "Local git history: commits under ~/.wenlan/.git that make writes inspectable over time.",
          "Page source: a memory that contributed to a distilled page.",
        ],
      },
      {
        heading: "Runtime terms",
        body: [
          "Daemon: wenlan-server, the local process on 127.0.0.1:7878 that owns storage, search, pages, graph context, distill cycles, and the HTTP API.",
          "MCP connector: wenlan-mcp, the process MCP clients launch so agents can call Wenlan tools. CLI: the wenlan command-line tool for setup, status, doctor, recall, search, capture, memories, spaces, models, keys, and MCP config.",
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
          "Active space: the bucket chosen by inline arguments, WENLAN_SPACE, spaces.toml, current repo, topic, or default resolver state.",
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
          "Wenlan's public numbers are retrieval-only evals, not end-to-end answer-quality guarantees. They show whether retrieval surfaces relevant context, not whether a downstream model always reasons correctly.",
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
      "How Wenlan is put together: one local daemon, thin clients, shared wire types, local artifacts, and retrieval owned by wenlan-core.",
    metaTitle: "Wenlan Architecture | Docs",
    metaDescription:
      "Understand Wenlan's daemon-first architecture, Cargo workspace crates, local and remote MCP paths, Claude Code and Codex plugins, local data layout, and retrieval pipeline.",
    keywords: [
      "Wenlan architecture",
      "Wenlan daemon",
      "wenlan-core",
      "wenlan-mcp architecture",
      "local AI work memory architecture",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "7 min read",
    summary: [
      "Wenlan is daemon-first: wenlan-server owns storage, search, pages, graph context, distill cycles, and the HTTP API.",
      "Claude Code, Codex, ChatGPT, other MCP clients, the CLI, and local tools are clients over the same source-backed Wenlan system.",
    ],
    sections: [
      {
        heading: "The boundary",
        body: [
          "Wenlan keeps product behavior in one local daemon instead of scattering memory logic across every client. The daemon listens on 127.0.0.1:7878 and owns the database, embeddings, search, pages, graph context, and distill cycles.",
          "That boundary is what lets Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, VS Code, ChatGPT, Claude.ai, and terminal commands build on the same source-backed wiki without each tool inventing its own store.",
        ],
      },
      {
        heading: "Workspace map",
        body: [
          "The public repository is a Cargo workspace. The local runtime, CLI, MCP server, shared wire types, core logic, Claude Code plugin, Codex plugin, and AGPL-3.0-only desktop app crate now live together in the versioned monorepo.",
        ],
        code: {
          label: "Repository map",
          code: architectureMap,
        },
      },
      {
        heading: "Runtime flow",
        body: [
          "A client stores or recalls memory through HTTP, MCP, or the CLI. wenlan-server frames the request and calls wenlan-core. wenlan-core handles storage, hybrid retrieval, knowledge graph context, pages, quality gates, enrichment, and eval-facing logic.",
          "The client receives a compact response: memories, pages, decisions, graph context, or diagnostic state. The source of truth stays local.",
        ],
        bullets: [
          "Claude Code and Codex plugins: slash workflows such as /brief, /capture, /recall, /distill, and /handoff.",
          "wenlan-mcp: MCP tools such as context, capture, recall, distill, list_pending, confirm_memory, forget, and doctor.",
          "wenlan CLI: setup, background service management, status, recall, search, capture, memories, spaces, models, keys, and doctor.",
        ],
      },
      {
        heading: "Storage and retrieval",
        body: [
          "The local database uses libSQL for document chunks, vector search, FTS5 search, graph tables, pages, and metadata. Recall combines vector search, full-text search, graph context, and relevant pages with Reciprocal Rank Fusion.",
          "Human-facing artifacts stay under ~/.wenlan. Pages and session logs are Markdown. The daemon-owned database remains the retrieval source of truth; readable artifacts are the projection people can inspect.",
        ],
      },
      {
        heading: "Model paths",
        body: [
          "Local memory mode works without a model download or API key. Store, embed, search, recall, and MCP memory are available immediately.",
          "On-device models and Anthropic keys are optional. They unlock heavier extraction, page synthesis, recaps, and richer graph work, but the basic memory loop does not depend on them.",
        ],
      },
      {
        heading: "Platform services",
        body: [
          "Wenlan installs a local runtime into ~/.wenlan/bin. The service manager differs by operating system: launchd on macOS, systemd user units on Linux, and a per-user Task Scheduler logon task on Windows.",
          "The same daemon contract is used across platforms. Current prebuilt runtime artifacts cover macOS Apple Silicon, Linux x86_64, Linux aarch64 glibc, and Windows x86_64; macOS Intel should be treated as source/dev-only until a public release workflow publishes that artifact again.",
        ],
      },
      {
        heading: "Why this shape",
        body: [
          "The daemon-first shape keeps memory behavior consistent. It also makes Wenlan easier to test: wenlan-core has no Axum or Tauri dependency, wenlan-types stays lightweight, and clients do not own business logic.",
          "For users, the practical result is simpler: one local home for AI work context, with multiple tools reading and writing through the same boundary.",
        ],
        link: {
          label: "View the source repository",
          href: "https://github.com/7xuanlu/wenlan",
        },
      },
    ],
    nextSlug: "product-matrix",
  },
  {
    slug: "product-matrix",
    group: "Reference",
    eyebrow: "Matrix",
    title: "Product Matrix",
    description:
      "Map Wenlan's product surfaces, repositories, platforms, status, setup actions, and verification routes before choosing an install path.",
    metaTitle: "Wenlan Product Matrix | Docs",
    metaDescription:
      "Use the Wenlan product matrix to understand the daemon, CLI, local and remote MCP paths, Claude Code and Codex plugins, ChatGPT, the desktop app, platform support, and docs provenance.",
    keywords: [
      "Wenlan product matrix",
      "Wenlan platform matrix",
      "Wenlan desktop app",
      "Wenlan MCP clients",
      "Wenlan Codex plugin",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "Wenlan turns captures and sources into a source-backed LLM wiki; the daemon owns the data and retrieval boundary behind every client.",
      "Runtime platform support and desktop app release support are separate rows, not one blended promise.",
    ],
    sections: [
      {
        heading: "Product surfaces",
        body: [
          "Use this matrix before picking an install route. Wenlan is the source-backed LLM wiki; the daemon/runtime owns behavior, while the CLI, local and remote MCP, Claude Code plugin, Codex plugin, ChatGPT, other clients, and optional desktop app are ways to reach it.",
          "The daemon owns the database, pages, sessions, and retrieval behavior. Client surfaces should be debugged by checking daemon health first, then the client-specific config.",
        ],
        bullets: productSurfaceBullets,
      },
      {
        heading: "Platform boundaries",
        body: [
          "Do not collapse runtime support and desktop app support into one claim. The current product release workflow publishes the runtime for macOS Apple Silicon, Linux x86_64, Linux aarch64 glibc, and Windows x86_64. The desktop app release path currently targets macOS Apple Silicon and Windows x86_64.",
          "macOS Intel still has a launchd service model in the code path, but there is no current prebuilt runtime or desktop app target in the public release workflow. Treat that as source/dev-only until a release workflow adds an artifact.",
        ],
        bullets: platformSupportBullets,
        link: {
          label: "Read platform support",
          href: "/docs/platforms",
        },
      },
      {
        heading: "Start path",
        body: [
          "If you are new to Wenlan, start with setup instead of choosing packages by hand. The setup path installs the local runtime under ~/.wenlan/bin, verifies the daemon, and gives MCP clients a stable connector path.",
        ],
        link: {
          label: "Get started",
          href: "/docs/get-started",
        },
      },
      {
        heading: "Daily use",
        body: [
          "Once setup is green, the daily loop is brief or context at session start, capture when a durable fact appears, recall when history matters, and handoff when a work session should survive the chat.",
        ],
        link: {
          label: "Read daily workflow",
          href: "/docs/daily-workflow",
        },
      },
      {
        heading: "Concept map",
        body: [
          "Use the concept docs when you need to explain memory types, review queues, spaces, source-backed pages, or why a client is not the source of truth.",
        ],
        link: {
          label: "Read core concepts",
          href: "/docs/core-concepts",
        },
      },
      {
        heading: "Architecture boundary",
        body: [
          "Use the architecture page when a bug report or integration question needs ownership. Daemon behavior belongs in the main Wenlan repo; desktop UI behavior belongs in the app repo; the website owns public education and SEO surfaces.",
        ],
        link: {
          label: "Read architecture",
          href: "/docs/architecture",
        },
      },
      {
        heading: "Package map",
        body: [
          "Use the packages page when names are confusing: wenlan is the setup/plugin package, wenlan-mcp is the connector, wenlan-types is the shared wire type crate, and GitHub Releases are the stable artifact record.",
        ],
        link: {
          label: "Read packages",
          href: "/docs/packages-and-registries",
        },
      },
      {
        heading: "MCP clients",
        body: [
          "Use the MCP client docs for Codex, Cursor, Claude Desktop, VS Code, Gemini CLI, ChatGPT, Claude.ai, and manual fallback config. Local clients use wenlan connect; web clients use Streamable HTTP MCP through a URL you control.",
        ],
        link: {
          label: "Connect MCP clients",
          href: "/docs/mcp-clients",
        },
      },
      {
        heading: "Optional desktop app",
        body: [
          "The desktop app is a GUI client over the same daemon, not a requirement. Current app releases come from the main Wenlan repository's version-locked app/ crate and unified release manifest.",
        ],
        link: {
          label: "Read desktop app status",
          href: "/docs/desktop-app",
        },
      },
      {
        heading: "Troubleshooting",
        body: [
          "When something fails, diagnose in order: daemon health, local CLI, MCP generated config, client restart state, then app-specific UI. That order keeps client bugs from being mistaken for product-data drift.",
        ],
        link: {
          label: "Troubleshoot setup",
          href: "/docs/troubleshooting",
        },
      },
      {
        heading: "Release status",
        body: [
          "Shipped facts come from version.txt, CHANGELOG.md, release workflows, and repo-owned app pins. Merged main-branch work is not a public release until a release entry and artifact exist.",
        ],
        link: {
          label: "Read release status",
          href: "/docs/releases-and-versioning",
        },
      },
      {
        heading: "Route checklist",
        body: [
          "This route checklist is intentionally public. It is the website-level contract for whether users can move from setup, to concepts, to platform support, to troubleshooting without relying on private repo knowledge.",
        ],
        bullets: productRouteBullets,
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
      "The essential Claude Code and Codex plugin commands, CLI commands, and MCP tools for running Wenlan day to day.",
    metaTitle: "Wenlan Commands and MCP Tools | Docs",
    metaDescription:
      "Reference the daily Wenlan plugin, CLI, and MCP commands for Claude Code, Codex, and other clients: /setup, /brief, context, /capture, /recall, /handoff, /curate, /distill, and doctor.",
    keywords: [
      "Wenlan commands",
      "MCP tools",
      "Claude Code slash commands",
      "capture handoff recall",
      "distill review",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Most Claude Code users need /setup for setup, then four daily commands: /brief, /capture, /recall, and /handoff.",
      "MCP clients start with context, then use capture, recall, distill, list pending, confirm memory, forget, and doctor.",
    ],
    sections: [
      {
        heading: "Daily commands",
        body: [
          "Use these commands for the normal memory loop in Claude Code.",
        ],
        bullets: [
          "/setup: install or verify the daemon, plugin, MCP route, and memory round trip.",
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
          "/curate captures: walk unconfirmed captures; bare /curate only prints help.",
          "/curate revisions: walk pending revisions when /brief shows more than the top few.",
          "/distill: synthesize related memories into wiki pages.",
          "/pages: list recent pages or open a matching page in your editor.",
          "/lint: run the canonical read-only memory and page health report.",
          "/forget: delete a memory by ID when it should not remain in Wenlan.",
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
          "Use /lint, /curate, /distill, and /pages when memory needs diagnosis, maintenance, or a topic deserves a page.",
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
      "Use Wenlan's richest workflow inside Claude Code: setup, brief, capture, recall, lint diagnostics, curation, distillation, pages, and handoff.",
    metaTitle: "Wenlan Claude Code Plugin | Docs",
    metaDescription:
      "Install and use the Wenlan Claude Code plugin with /setup, /brief, /capture, /recall, /lint, /handoff, /distill, /curate, /forget, and /pages.",
    keywords: [
      "Wenlan Claude Code plugin",
      "Claude Code memory plugin",
      "Wenlan slash commands",
      "Wenlan /setup",
      "Claude Code MCP memory",
    ],
    updatedAt: "2026-07-17",
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "The Claude Code plugin is the fastest and richest Wenlan path because it adds slash commands around the local daemon and MCP connector.",
      "/setup is the setup and repair command: it verifies daemon reachability, MCP wiring, local memory setup, and a first round trip.",
    ],
    sections: [
      {
        heading: "Install path",
        body: [
          "Install through Claude Code's plugin marketplace, restart if Claude Code asks, then run /setup.",
          "/setup is designed to be the single setup check. It installs or verifies the local runtime, configures local memory, checks daemon and MCP reachability, and confirms a memory round trip.",
        ],
        code: {
          label: "Claude Code",
          code: pluginInstallCommands,
        },
      },
      {
        heading: "What the plugin adds",
        body: [
          "The plugin adds Claude Code skills and slash commands on top of the same local Wenlan daemon that other MCP clients use.",
          "That means Claude Code gets a more ergonomic workflow, while the memory itself remains shared with Codex, Cursor, Claude Desktop, VS Code, Gemini CLI, and other MCP-compatible clients when configured.",
        ],
      },
      {
        heading: "Daily command surface",
        body: [
          "Most sessions need only /brief at the start, /capture when something durable happens, /recall for a specific lookup, and /handoff before the session ends.",
          "The other commands are maintenance and inspection paths for read-only health diagnostics, review, distillation, deletion, or opening a page.",
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
          "The hook is intentionally light: it prints a nudge to run /setup when the daemon is down. It does not own installation logic and should not block a session.",
        ],
      },
      {
        heading: "Local memory mode",
        body: [
          "By default, /setup configures local memory. That means no model download, no API key, and no cloud sync requirement for the basic memory loop.",
          "The daemon stores, embeds, deduplicates, and serves hybrid search. Claude Code skills can still classify captures, write handoffs, and synthesize pages through the agent-side model fallback because the agent already has language judgment in the active session.",
        ],
      },
      {
        heading: "Where data appears",
        body: [
          "The plugin does not store data by itself. It guides Claude Code to use local MCP tools, and those tools talk to the Wenlan daemon.",
          "Readable artifacts live under ~/.wenlan, so you can inspect pages, session logs, project status, and installed binaries without opening a separate app.",
        ],
        code: {
          label: "Local artifacts",
          code: pluginDataPaths,
        },
      },
      {
        heading: "Plugin versus MCP-only",
        body: [
          "MCP-only setup gives clients tools for context, capture, recall, doctor, and page distillation. It does not install Claude Code slash skills like /brief, /handoff, /distill, or /setup.",
          "Use the plugin when Claude Code is your main surface. Use MCP-only setup when you want Wenlan in other clients or when you intentionally want raw MCP tools without the Claude Code workflow layer.",
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
    title: "Wenlan CLI Commands and Service Management",
    description:
      "Use the Wenlan CLI to install the runtime, check the daemon, search memory, and connect MCP clients.",
    metaTitle: "Wenlan CLI Commands and Service Management | Docs",
    metaDescription:
      "Run the Wenlan CLI for setup, daemon status, doctor diagnostics, background service management, recall, search, capture, and MCP client configuration.",
    keywords: [
      "Wenlan CLI",
      "wenlan doctor",
      "wenlan background on",
      "wenlan service management",
      "wenlan connect",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Quick answer: use wenlan setup, status, doctor, background, recall, search, capture, and connect when you need terminal control over the local memory runtime.",
      "The daemon owns memory, search, pages, and retrieval. The CLI talks to that daemon instead of editing the database directly.",
    ],
    sections: [
      {
        heading: "Quick answer: what the CLI controls",
        body: [
          "Use the CLI when you need repeatable terminal commands for setup, daemon health, service state, memory recall, search, capture, and MCP client wiring.",
          "Claude Code slash commands and MCP tools reach the same local daemon. The CLI is the direct path when a client UI hides status or configuration details.",
        ],
        code: {
          label: "Terminal",
          code: wenlanSetupCommand,
        },
      },
      {
        heading: "Check the daemon",
        body: [
          "The daemon listens on 127.0.0.1:7878 and owns storage, search, pages, graph context, and distill cycles. Use status for a quick health check and doctor for a fuller setup report.",
          "Service installation is per-user. Wenlan uses launchd on macOS, systemd user units on Linux, and a Task Scheduler logon task on Windows.",
        ],
        code: {
          label: "Service commands",
          code: serviceCommands,
        },
      },
      {
        heading: "Use memory from the terminal",
        body: [
          "The CLI can recall, search, capture, and show recent memories from scripts or from a plain terminal session. It is useful when you need a repeatable diagnostic or when your current tool does not expose Wenlan commands directly.",
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
          "After setup, use wenlan connect to configure a supported MCP client. The command writes or previews the client-specific config that launches the local wenlan-mcp connector.",
          "Use --dry-run when you want to inspect the generated config before changing a client settings file.",
        ],
        code: {
          label: "MCP setup",
          code: "~/.wenlan/bin/wenlan connect codex\n~/.wenlan/bin/wenlan connect cursor --dry-run",
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
      "Refresh Wenlan's local runtime, verify version health, restart MCP clients, and remove the service without losing data by accident.",
    metaTitle: "Update or Uninstall Wenlan | Docs",
    metaDescription:
      "Learn how to update Wenlan's local runtime, verify status with wenlan doctor, handle MCP client restarts, and uninstall the daemon safely.",
    keywords: [
      "update Wenlan",
      "uninstall Wenlan",
      "Wenlan version",
      "Wenlan doctor",
      "Wenlan MCP update",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "Use setup and doctor to refresh and verify the local runtime under ~/.wenlan/bin.",
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
          "For MCP clients outside Claude Code, rerun the setup command to refresh the local CLI, daemon, and MCP connector installed under ~/.wenlan/bin.",
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
          "Claude Code plugin updates happen through Claude Code's plugin marketplace flow. After the plugin changes, restart Claude Code if prompted and run /setup again.",
          "/setup verifies the plugin, daemon, MCP route, and a memory round trip, so it is the right post-update check.",
        ],
        code: {
          label: "Claude Code",
          code: "/setup",
        },
      },
      {
        heading: "MCP client settings",
        body: [
          "If wenlan-mcp moved, or a client still launches an old path, rerun wenlan connect for that client. Use --dry-run when you want to inspect the generated config first.",
          "Most MCP clients need a restart after settings change. Verify by running the client's Wenlan doctor or a small capture/recall round trip.",
        ],
        code: {
          label: "MCP refresh",
          code: "~/.wenlan/bin/wenlan connect codex --dry-run\n~/.wenlan/bin/wenlan connect cursor",
        },
      },
      {
        heading: "Uninstall the service",
        body: [
          "wenlan background off stops Wenlan and removes the per-user service registration: launchd on macOS, systemd user units on Linux, or the Windows Task Scheduler logon task.",
          "That does not delete memory data. Do not delete ~/.wenlan or the daemon data directory unless you have decided you no longer need those records.",
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
          "If you are removing Wenlan because setup failed, open an issue with redacted doctor output before deleting data. The diagnostic state is often the fastest way to fix the install path.",
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
      "Read the practical upgrade path for Wenlan releases: what to rerun, what to verify, and what changed in the current public runtime shape.",
    metaTitle: "Wenlan Upgrade Notes | Docs",
    metaDescription:
      "Upgrade Wenlan safely across plugin, npm setup, MCP connector, daemon service, spaces, platform support, and local data paths.",
    keywords: [
      "Wenlan upgrade notes",
      "update Wenlan",
      "Wenlan 0.9 upgrade",
      "Wenlan MCP update",
      "Wenlan setup update",
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
          "Wenlan moves quickly, so distinguish released packages from main-branch work. The changelog and GitHub Releases describe what is shipped; merged PRs can describe work that is not in your installed package yet.",
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
          "For MCP clients outside Claude Code, rerun the setup package. That refreshes the local runtime installed under ~/.wenlan/bin, including the CLI, daemon, and MCP connector.",
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
          "Claude Code users should update through the plugin marketplace flow, restart Claude Code if prompted, then run /setup.",
          "/setup is the post-upgrade smoke test because it checks plugin installation, daemon reachability, MCP wiring, and the memory round trip from the tool where you work.",
        ],
        code: {
          label: "Claude Code",
          code: "/plugin marketplace add 7xuanlu/claude-plugins\n/plugin install wenlan@7xuanlu\n/setup",
        },
      },
      {
        heading: "Current runtime shape",
        body: [
          "The current public docs describe the 0.14.1 runtime shape: Claude Code plugin, npm setup, wenlan-mcp connector, daemon-first architecture, explicit spaces, source-backed pages, real git versioning for readable pages, session handoffs, and status artifacts, wenlan restart, wenlan models reranker, and cross-platform service registration.",
          "The biggest practical upgrade checks are platform support, package path alignment, and spaces. Confirm your machine's service manager, confirm MCP clients launch the connector under ~/.wenlan/bin, and confirm the active space is the one you expect.",
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
          "If restart does not fix it, rerun wenlan connect for that client. Use --dry-run first when you want to inspect the generated command and path.",
        ],
        link: {
          label: "Connect MCP clients",
          href: "/docs/mcp-clients",
        },
      },
      {
        heading: "Data safety",
        body: [
          "Normal upgrades should not delete memory data. wenlan background off removes service registration, not ~/.wenlan or the daemon database.",
          "For machine migration, manual cleanup, or risky experiments, back up both readable ~/.wenlan artifacts and the platform daemon data directory. Then verify with doctor and a capture/recall round trip before trusting the restored install.",
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
      "Know which Wenlan package name maps to the plugin, runtime setup, MCP connector, Rust crates, and release binaries.",
    metaTitle: "Wenlan Packages and Registries | Docs",
    metaDescription:
      "Understand Wenlan package names across the Claude Code and Codex plugins, npm setup, wenlan-mcp, wenlan-types, crates.io, and GitHub Releases.",
    keywords: [
      "Wenlan packages",
      "@7wenlanxuanlu",
      "wenlan-mcp npm",
      "wenlan-types crate",
      "Wenlan GitHub releases",
    ],
    updatedAt: "2026-07-24",
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "Wenlan has several public package names because one product crosses Claude Code and Codex plugins, npm setup, local and remote MCP clients, Rust crates, and release binaries.",
      "Most users should not choose a registry by hand. Install through Claude Code or npx setup, then let wenlan connect wire each client to the local connector.",
    ],
    sections: [
      {
        heading: "Why the names differ",
        body: [
          "Wenlan is one source-backed LLM wiki with several runtime surfaces. The daemon owns data and retrieval, the CLI manages setup and diagnostics, wenlan-mcp bridges local and web clients, and the Claude Code and Codex plugins add slash workflows.",
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
          "Claude Code users should use the plugin marketplace path, then run /setup. That verifies the plugin, local daemon, MCP route, and a memory round trip from inside Claude Code.",
          "Other MCP clients should run the setup package once, then use wenlan connect for each client. That keeps client config pointed at the local connector installed under ~/.wenlan/bin.",
        ],
        code: {
          label: "Install paths",
          code: packageInstallPaths,
        },
      },
      {
        heading: "MCP connector packages",
        body: [
          "wenlan-mcp is the connector MCP clients launch when they need Wenlan tools. Normal setup installs a local wenlan-mcp binary beside the CLI so configs can use a stable machine-local path.",
          "The standalone npm package is useful when a client or automation flow needs to spawn the connector through npm. Prefer the installed local binary when setup has already prepared ~/.wenlan/bin.",
        ],
        link: {
          label: "Read MCP client setup",
          href: "/docs/mcp-clients",
        },
      },
      {
        heading: "Rust crates",
        body: [
          "wenlan-mcp is also published as a Rust crate because the connector ships from the Rust workspace. Most users never install this crate directly.",
          "wenlan-types contains shared HTTP and MCP wire types for downstream Rust clients. It exists so integrations can fail loudly on shape drift instead of passing around untyped JSON.",
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
          "Then run wenlan connect with --dry-run for the client you care about. The output shows which connector path the client should launch.",
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
      "Understand how Wenlan runs on macOS, Linux, and Windows: service managers, local data paths, model backends, and Docker/VM caveats.",
    metaTitle: "Wenlan Platform Support | Docs",
    metaDescription:
      "Review Wenlan platform support for macOS, Linux, and Windows, including service registration, data directories, model backend differences, and bind-address caveats.",
    keywords: [
      "Wenlan platform support",
      "Wenlan Windows",
      "Wenlan Linux",
      "Wenlan macOS",
      "Wenlan service manager",
    ],
    updatedAt: "2026-07-26",
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Wenlan's current prebuilt runtime release covers macOS Apple Silicon, Linux x86_64, Linux aarch64 glibc, and Windows x86_64.",
      "The daemon contract is the same across platforms, but release artifacts, service registration, data paths, app support, and model acceleration differ.",
    ],
    sections: [
      {
        heading: "Supported platforms",
        body: [
          "Wenlan v0.7.0 broadened the local runtime from macOS-first to cross-platform support across macOS, Linux, and Windows. The current release workflow publishes prebuilt runtime artifacts for macOS Apple Silicon, Linux x86_64, Linux aarch64 glibc, and Windows x86_64.",
          "The same daemon, CLI, and MCP connector shape applies on each platform. The operating-system integration and release artifact availability are what change.",
        ],
        bullets: platformSupportBullets,
      },
      {
        heading: "Service registration",
        body: [
          "Wenlan installs as a per-user service so the local daemon can be available to MCP clients without a manual terminal session.",
          "macOS uses launchd. Linux uses a systemd user unit. Windows uses a per-user Task Scheduler ONLOGON task.",
        ],
      },
      {
        heading: "Data paths",
        body: [
          "The daemon keeps its database and application data in the OS application data location. Wenlan also exposes human-readable artifacts under ~/.wenlan so pages, sessions, status records, and local git history are easy to inspect.",
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
          "For optional local model paths, macOS keeps Metal acceleration. Wenlan v0.15.0 bundles the Vulkan loader in the Windows x64 archive for supported GPU acceleration; Linux release builds remain CPU-only by default.",
        ],
      },
      {
        heading: "Docker and VMs",
        body: [
          "Normal laptop use should keep the daemon bound to 127.0.0.1:7878. That keeps the HTTP API local to the machine.",
          "Use WENLAN_BIND_ADDR only when you intentionally need non-loopback access, such as a Docker or VM setup. Exposing the daemon changes the security boundary, so pair it with the security reporting and configuration guidance.",
        ],
        code: {
          label: "Bind address",
          code: "WENLAN_BIND_ADDR=127.0.0.1:7878\nWENLAN_BIND_ADDR=0.0.0.0:7878  # Docker or VM only",
        },
      },
      {
        heading: "After setup",
        body: [
          "Whatever platform you use, verify setup the same way: run wenlan status and wenlan doctor, then do one capture/recall round trip from the client you care about.",
          "If the daemon works but an MCP client does not, restart the client and rerun wenlan connect for that client before assuming the runtime is broken.",
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
    metaTitle: "Wenlan HTTP API | Docs",
    metaDescription:
      "Reference Wenlan's local daemon HTTP API surfaces for health, setup, memory store/search, context, review, distill, model setup, and Anthropic key setup.",
    keywords: [
      "Wenlan HTTP API",
      "Wenlan daemon API",
      "127.0.0.1 7878",
      "AI memory API",
      "wenlan-server API",
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
          "wenlan-server is the local API boundary. Clients do not write the database directly; they ask the daemon to store, search, recall, distill, confirm, or diagnose memory.",
          "The default bind address is 127.0.0.1:7878. That local-only default is part of the product boundary: one machine owns the daemon and its data unless you deliberately change daemon networking.",
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
          "The CLI uses the same daemon for status, doctor, search, recall, capture, memories, models, keys, MCP config, and spaces.",
        ],
      },
      {
        heading: "What not to build against yet",
        body: [
          "Wenlan is not positioning the HTTP API as a hosted memory SDK. It is primarily the local daemon contract for first-party clients and local tools.",
          "If you need automation, start with the CLI or MCP connector. They carry the current product semantics better than hand-written HTTP calls.",
        ],
      },
      {
        heading: "Diagnostics",
        body: [
          "If a client cannot reach memory, check daemon health first with wenlan doctor or the MCP doctor tool. Then inspect whether the client is launching wenlan-mcp and whether port 7878 is occupied by an old daemon.",
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
    metaTitle: "Wenlan API Examples | Docs",
    metaDescription:
      "Copy local curl examples for Wenlan daemon health, setup status, memory store/search, chat context, review, confirm, and page search endpoints.",
    keywords: [
      "Wenlan API examples",
      "Wenlan curl",
      "Wenlan HTTP API",
      "Wenlan memory store API",
      "Wenlan chat context API",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "The HTTP API is local to the daemon on 127.0.0.1:7878. It is useful for scripts, diagnostics, and first-party clients.",
      "For normal workflows, prefer Claude Code slash commands, MCP tools, or the CLI. They carry Wenlan's current product semantics better than hand-written HTTP calls.",
    ],
    sections: [
      {
        heading: "Before using curl",
        body: [
          "Start with the CLI or MCP connector unless you specifically need local script automation. The daemon API is the local contract underneath those tools, not a hosted SDK surface.",
          "Keep calls on 127.0.0.1 unless you intentionally changed WENLAN_BIND_ADDR. Exposing the daemon beyond loopback changes the security boundary.",
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
          "setup/status is useful when a client reports that Wenlan is installed but tools still fail.",
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
          "This is useful for a local review UI or a diagnostic script. In normal agent work, prefer /curate or the MCP review tools when available.",
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
          "Rust integrations should prefer wenlan-types for request and response shapes. That keeps shape drift visible at compile time instead of passing untyped JSON through local tools.",
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
      "Use wenlan-types when a Rust tool needs to call the local daemon without relying on untyped JSON shapes.",
    metaTitle: "Wenlan Typed Clients | Docs",
    metaDescription:
      "Learn when to use the wenlan-types crate for Wenlan daemon request and response types, what stability to expect before 1.0, and why the local daemon remains the boundary.",
    keywords: [
      "wenlan-types",
      "Wenlan typed clients",
      "Wenlan wire types",
      "Wenlan API types",
      "Rust MCP memory client",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "wenlan-types is the shared Rust wire-format crate for the daemon, MCP server, CLI, and downstream local clients.",
      "Use it for local Rust integrations that need shape checking; use MCP or the CLI for normal agent workflows.",
    ],
    sections: [
      {
        heading: "What wenlan-types is",
        body: [
          "wenlan-types defines shared request and response shapes plus core enums used across the local Wenlan runtime.",
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
          "Use wenlan-types when you are writing a Rust local tool that calls wenlan-server directly or when you are contributing to the daemon, MCP connector, or CLI.",
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
          "Wenlan is pre-1.0. Minor version bumps can include breaking wire-type changes under Rust 0.x conventions.",
          "Types marked doc(hidden) are not part of the public stability contract. Treat them as implementation details even if they appear in generated docs.",
        ],
      },
      {
        heading: "Boundary still matters",
        body: [
          "wenlan-types does not mean clients should write the database directly. The daemon remains the owner of storage, search, pages, graph context, review state, and distill cycles.",
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
          "The crate is published as wenlan-types and lives in the public Wenlan repository with the rest of the daemon workspace.",
          "Package names matter here: wenlan-types is the shared type crate, wenlan-mcp is the MCP connector, and wenlan is the setup and Claude Code plugin package.",
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
      "Separate work, personal, client, and project memory, and understand how Wenlan resolves the active space.",
    metaTitle: "Wenlan Spaces | Docs",
    metaDescription:
      "Learn how Wenlan spaces isolate AI work memory by project, client, or context using WENLAN_SPACE, spaces.toml, wenlan spaces commands, and doctor resolver state.",
    keywords: [
      "Wenlan spaces",
      "AI memory spaces",
      "WENLAN_SPACE",
      "wenlan spaces commands",
      "separate AI work memory",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "Spaces are memory buckets for different work contexts, such as origin, career, ideas, or a client project.",
      "They reduce context bleed while keeping one local daemon and one Wenlan installation.",
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
          "The most explicit override is WENLAN_SPACE. It is useful when launching an agent for a specific context and you want every capture and recall to stay in that bucket.",
          "The CLI also includes wenlan spaces commands for listing, adding, inspecting, and moving spaces.",
        ],
        code: {
          label: "Space commands",
          code: spaceCommands,
        },
      },
      {
        heading: "Configure defaults",
        body: [
          "Wenlan can read space configuration from ~/.wenlan/spaces.toml. Map directory prefixes to spaces when you want a repo or notes folder to select the same context every time.",
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
          "Wenlan resolves the active space through a priority chain. Explicit overrides win, then the shell environment, then spaces.toml, then the current git repo name, then topic fallback, then personal.",
          "Use wenlan doctor when you are unsure which layer selected the current space. Doctor prints the resolver state so you can diagnose accidental context bleed.",
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
          "Spaces are not separate user accounts, encryption boundaries, or permission systems. They are product-level context separation inside your local Wenlan store.",
          "For sensitive work, still treat the whole local machine and connected AI client as part of the privacy boundary.",
        ],
      },
    ],
    nextSlug: "knowledge-graph",
  },
  {
    slug: "knowledge-graph",
    group: "Reference",
    eyebrow: "Agent Knowledge",
    title: "AI Agent Knowledge Graph",
    description:
      "Build a source-backed AI knowledge base that links people, projects, tools, observations, and relations without treating graph context as authority.",
    metaTitle: "AI Agent Knowledge Graph for a Source-Backed Knowledge Base | Wenlan",
    metaDescription:
      "Learn how an AI agent knowledge graph links entities, relations, observations, sources, and maintained pages for inspectable retrieval.",
    keywords: [
      "Wenlan knowledge graph",
      "AI agent knowledge graph",
      "agent knowledge graph",
      "source-backed AI knowledge base",
      "AI work knowledge graph",
      "graph context",
      "local knowledge graph",
    ],
    publishedAt: "2026-07-09",
    updatedAt: "2026-08-13",
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Quick answer: an AI agent knowledge graph connects typed entities, relations, and observations so retrieval can recover relationships that text similarity misses.",
      "Use graph context as supporting evidence. Source memories and maintained pages remain the inspectable authority and human review remains part of the workflow.",
    ],
    sections: [
      {
        heading: "Quick answer: what an AI agent knowledge graph adds",
        body: [
          "Use text or vector search for direct matches. Use an AI agent knowledge graph for typed relationships: who worked on a project, which tool it uses, and which grounded observations belong to the same entity.",
          "A reliable source-backed AI knowledge base keeps that graph beside inspectable source memories and maintained pages. Graph context supplies nearby facts; it does not become authority or replace provenance and review.",
        ],
      },
      {
        heading: "Entities, relations, observations",
        body: [
          "An entity is a named thing such as a person, project, tool, repo, or concept. A relation connects two entities. An observation is a grounded statement attached to an entity.",
          "The goal is practical retrieval. The graph should help the next session find the right surrounding context, not become a hand-maintained ontology.",
        ],
        bullets: [
          "Entity: Wenlan, Claude Code, a client project, a person, a tool, or a repo.",
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
          "Imported Markdown vaults can carry useful links. Wenlan can preserve those relationships as graph signal while still treating imported content as context that should prove itself useful in recall.",
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
          "Graph data can be wrong when a name is ambiguous, a project changes direction, or an imported link was noisy. Use review, corrections, spaces, and forget when stored context needs cleanup.",
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
      "Understand how Wenlan turns atomic captures into readable pages with source memory IDs, revision state, and refresh paths.",
    metaTitle: "Wenlan Source-Backed Pages | Docs",
    metaDescription:
      "Learn how Wenlan distilled pages work: source-backed Markdown pages, provenance, stale reasons, revision state, /distill, and /pages.",
    keywords: [
      "Wenlan pages",
      "source-backed pages",
      "distilled pages",
      "AI memory provenance",
      "Wenlan distill",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Atomic memories are good for recall, but repeated work eventually needs a readable synthesis.",
      "Wenlan pages are Markdown artifacts backed by source memories so the synthesized view is inspectable instead of anonymous.",
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
          "Wenlan tracks which memories contributed to a page. That source backing is part of the trust model: a page should not read like it appeared from nowhere.",
          "When a page feels wrong, inspect the source memories and either correct the memory, refresh the page, or capture the missing context.",
        ],
      },
      {
        heading: "Distill and open",
        body: [
          "/distill asks Wenlan to synthesize or refresh pages from related memories. /pages lists recent pages or opens a matching page in your editor.",
          "Use distillation before a new project phase, after a long sprint, or when recall keeps surfacing the same cluster of memories.",
        ],
        code: {
          label: "Claude Code",
          code: "/distill\n/pages <query>",
        },
      },
      {
        heading: "Staleness and revision state",
        body: [
          "Pages can become stale when new memories contradict them, extend them, or show that an old summary is no longer enough. Wenlan tracks stale_reasons so refresh work has a concrete cause.",
          "Wenlan also tracks revision_state so refreshes can be deliberate. The point is not to overwrite human-readable records casually; it is to keep them improving as the project changes.",
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
      "Move selected durable context into Wenlan and keep Wenlan's readable artifacts portable outside the daemon.",
    metaTitle: "Wenlan Import and Portability | Docs",
    metaDescription:
      "Migrate selected durable notes into Wenlan, understand the current no-bulk-import boundary, and read Wenlan's projected Markdown pages and session logs outside the daemon.",
    keywords: [
      "Wenlan migration",
      "Wenlan portability",
      "Markdown migration",
      "AI memory migration",
      "AI memory export",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "The current CLI does not expose a general Markdown-vault importer. Migrate selected durable notes explicitly through capture or the memory store API.",
      "Wenlan's pages and session logs are readable Markdown, so the human record remains portable even though retrieval needs the daemon.",
    ],
    sections: [
      {
        heading: "What migration is for",
        body: [
          "Migration is useful when you already have durable project notes, meeting notes, or research notes that should become searchable AI work context.",
          "Do not migrate everything just because it exists. Wenlan works best when selected material is useful to future agents, not when its sources become a bulk file mirror.",
        ],
      },
      {
        heading: "Migrate selected Markdown context",
        body: [
          "Use wenlan capture or normal client capture flows for selected durable notes. For larger moves, use a small script that reads source files you choose and posts distilled facts to /api/memory/store.",
          "Start with a representative sample, then recall against it before moving a larger archive. That gives you a chance to see whether the migrated context is useful or noisy.",
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
          "Links can still help when you rewrite selected notes into explicit memories. Source-backed pages are stronger when Wenlan can trace the synthesized claim to the source memories that produced it.",
        ],
      },
      {
        heading: "Keep ownership clear",
        body: [
          "If another app is your knowledge-base source of truth, keep using it for polished notes. Use Wenlan for the AI work loop: captures, handoffs, source-backed pages, recall, and cross-client context.",
          "Running both is possible through MCP, but you still need a human rule for which system owns which kind of context.",
        ],
      },
      {
        heading: "Read Wenlan outside the daemon",
        body: [
          "Wenlan projects readable artifacts under ~/.wenlan, including pages and session handoffs. You can open those files in an editor or point a Markdown reader at them.",
          "Plain-text access is not the same as full Wenlan behavior. Capture, recall, dedupe, distill, review, forget, and index updates still need the daemon and CLI/MCP paths.",
        ],
      },
      {
        heading: "Privacy and backup caution",
        body: [
          "Imported vaults and exported-looking Markdown can contain sensitive project history. Do not publish ~/.wenlan, sync it to a cloud drive, or attach it to an issue without redaction.",
          "For backups, treat ~/.wenlan and the daemon data directory as private application data. If you need to recover or migrate machines, verify with wenlan doctor afterward so the daemon, index, and MCP config agree.",
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
      "Inspect the real git history Wenlan keeps for readable page, session, handoff, and status artifacts.",
    metaTitle: "Wenlan Local Git History | Docs",
    metaDescription:
      "Learn how Wenlan uses a real local git repository under ~/.wenlan/.git to version readable pages, sessions, handoffs, and status files.",
    keywords: [
      "Wenlan git history",
      "AI memory versioning",
      "local git memory",
      "Wenlan handoff history",
      "inspect Wenlan pages",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Wenlan versions local artifacts with a real git repository under ~/.wenlan/.git.",
      "Git history is for inspection, accountability, recovery, and understanding what changed across sessions.",
    ],
    sections: [
      {
        heading: "What is versioned",
        body: [
          "Wenlan writes human-facing artifacts under ~/.wenlan, including pages, session handoffs, and current status records. Those artifacts are committed into a local git repository.",
          "The git log gives you a practical audit trail for memory work: what changed, when it changed, and which artifacts were touched.",
        ],
      },
      {
        heading: "Inspect history",
        body: [
          "Use normal git commands from ~/.wenlan to inspect recent readable artifact writes and page changes. This is often faster than opening the database when you want to understand a human-readable change.",
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
          "Keep writes disciplined. Wenlan should remain the writer for generated artifacts unless you intentionally edit a human-owned page.",
        ],
        code: {
          label: "Example",
          code: "ln -s ~/.wenlan/pages ~/Documents/Wenlan-pages",
        },
      },
      {
        heading: "Privacy boundary",
        body: [
          "Local git history makes Wenlan more inspectable, but it also means old versions may contain old private context.",
          "Do not publish, sync, or attach ~/.wenlan blindly. Redact or create minimal reproductions when reporting bugs.",
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
      "Choose between local memory mode, optional on-device models, and optional Anthropic API keys for richer extraction, page synthesis, recaps, and graph work.",
    metaTitle: "Wenlan Models and Keys | Docs",
    metaDescription:
      "Understand Wenlan setup modes: no-model local memory, optional on-device models, optional Anthropic API keys, model status, key status, and privacy implications.",
    keywords: [
      "Wenlan models",
      "Wenlan API keys",
      "local memory mode",
      "Qwen3-4B",
      "Anthropic API key",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Wenlan works without downloading a local model or adding an API key.",
      "Optional models and keys add heavier language work such as extraction, page synthesis, recaps, and richer graph work.",
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
          "The CLI can read ANTHROPIC_API_KEY through the key setup path. Your connected AI client may already call its own provider during normal chat; this page only describes Wenlan's daemon-side model and key paths.",
        ],
      },
      {
        heading: "Agent-side fallback",
        body: [
          "Claude Code skills can classify captures, write handoffs, and synthesize pages from inside the active agent session. That is why Wenlan remains useful before you configure a daemon model.",
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
      "Understand Wenlan's shipped retrieval path and the opt-in main-branch experiments behind newer retrieval work.",
    metaTitle: "Wenlan Advanced Retrieval Status | Docs",
    metaDescription:
      "Read Wenlan's retrieval status: shipped hybrid retrieval, page channel, graph context, evaluation limits, and opt-in experimental flags on main.",
    keywords: [
      "Wenlan retrieval",
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
          "Wenlan's released retrieval combines vector embeddings, FTS5 full-text search, graph context, pages, and Reciprocal Rank Fusion. The goal is not a single magic ranking signal; it is a compact context bundle that helps the next AI session continue work.",
          "The public README snapshot reports retrieval metrics, not end-to-end answer quality. Read the evaluation page before using the numbers in comparisons.",
        ],
      },
      {
        heading: "Pages are part of retrieval",
        body: [
          "Wenlan treats distilled pages as retrieval surfaces, not only as human-readable notes. That matters because repeated project context often becomes clearer as a page than as isolated captures.",
          "A useful recall can include atomic memories, source-backed pages, graph neighbors, and decisions. The best result set is the one that gives the agent enough context without replaying a full chat history.",
        ],
      },
      {
        heading: "Opt-in main-branch work",
        body: [
          "Recent retrieval work includes a large opt-in batch. Examples include graph gates, temporal filters, query-adaptive routing, FTS hardening, session diversity, salience priors, episode and fact channels, PRF rounds, k-hop graph traversal, global preludes, CoT retrieval, LLM routing, and context compression.",
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
          "A retrieval experiment can improve one benchmark slice and hurt another. Wenlan's eval discipline is deliberately conservative: compare under the same schema, fixture revision, embedder, and run protocol.",
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
      "How to read Wenlan's opt-in main-branch flags without mistaking them for released defaults.",
    metaTitle: "Wenlan Experimental Flags | Docs",
    metaDescription:
      "Understand Wenlan's opt-in experimental flags for retrieval, context compression, memory maintenance, entity resolution, page guards, and reflection.",
    keywords: [
      "Wenlan experimental flags",
      "Wenlan retrieval flags",
      "WENLAN_ENABLE_CONTEXT_COMPRESS",
      "WENLAN_ENABLE_GRAPH_GATE",
      "Wenlan main branch experiments",
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
          "Wenlan's main branch often carries opt-in work before a release promotes it. A flag on main means the code path exists for testing; it does not mean normal users receive that behavior after npx setup.",
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
    title: "Wenlan Local Data and Privacy",
    description:
      "Where Wenlan stores local AI work memory, what stays on your machine, and when connected model providers may see prompts.",
    metaTitle: "Wenlan Local Data and Privacy | Docs",
    metaDescription:
      "See where Wenlan stores local AI work memory, what stays on your machine, when AI providers may receive prompts, and how readable artifacts and deletion controls work.",
    keywords: [
      "Wenlan data privacy",
      "local AI work memory storage",
      "Readable artifacts",
      "local-first privacy",
      "deletion controls",
    ],
    updatedAt: "2026-09-04",
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "Quick answer: Wenlan's daemon, database, pages, sessions, and readable artifacts live locally by default.",
      "Connected AI clients may still send prompts to their model providers; Wenlan keeps its own memory store local, inspectable, and removable.",
      "The public wenlan.app website uses separate privacy-limited analytics; installed Wenlan still has no cloud sync or product telemetry by default.",
    ],
    sections: [
      {
        heading: "Quick answer: what stays local",
        body: [
          "Wenlan's durable memory store, daemon database, Markdown pages, session handoffs, and project status files live on your machine by default.",
          "There is no Wenlan cloud sync or telemetry path by default. Connected AI clients may still send prompts to their own providers, so treat memory content as sensitive project data.",
        ],
      },
      {
        heading: "Public website analytics",
        body: [
          "The public wenlan.app website is separate from the installed Wenlan runtime. It uses Vercel Web Analytics for aggregate website visits. Optional Umami and first-party collection can record bounded website actions such as downloads, GitHub links, setup links, release subscriptions, video-play clicks, example choices, source expansion, comparisons, and product-image views. These operation counts are not unique visitors, completed downloads, installations, or proof that a channel caused an action.",
          "The Umami tracker is restricted to wenlan.app, excludes URL search parameters, and respects the browser's Do Not Track setting. Events carry placement, locale, content context, and a fixed destination category. Known launch links may also carry a predefined campaign, source, and medium; direct release-asset clicks include the public asset ID and release tag. Arbitrary query strings, memory content, code, commands, user file paths, names, email addresses, and stable account identifiers are not sent as event properties. A video-play click records intent to play, not viewing duration or completion.",
          "The website stores a sanitized first landing path, referrer host, and UTM source, medium, and campaign in per-tab sessionStorage. It reuses that context for 30 minutes, then replaces it on the next capture; this is not a persistent visitor ID. Optional capture is skipped for Do Not Track. The form sends the submitted email to Resend. When acquisition properties are enabled, those fields and the signup locale are stored with the contact. Only predefined launch campaign labels, not the contact or arbitrary attribution fields, can be included in Umami events. GitHub's cumulative release download counters remain separate from individual contacts.",
          "This website measurement does not add cloud sync or telemetry to installed Wenlan.",
          "When enabled, the first-party endpoint stores daily aggregate operation counts in a dedicated Postgres database without automatic expiration. It accepts only known public page paths, finite event and source labels, language, placement, predefined interaction choices, and current release-asset identifiers. It does not store raw event timelines, submitted email, arbitrary referrer URLs, URL query strings, IP addresses, user-agent strings, cookies, or persistent visitor IDs in its analytics records. Infrastructure providers still process network requests under their own policies. The client respects Do Not Track and Global Privacy Control. Collection can be blocked, unavailable or rate-limited; reports disclose missing coverage and limits instead of treating missing data as zero. Source labels are client-reported context, not verified attribution.",
        ],
      },
      {
        heading: "Where data lives",
        body: [
          "Wenlan exposes human-facing artifacts under ~/.wenlan. The daemon database lives under the operating system's application data directory and is linked from ~/.wenlan/db for convenience.",
          "The important files are readable without a special app: pages are Markdown, session logs are Markdown, and project status is stored beside the session records.",
        ],
        bullets: [
          "~/.wenlan/pages/: distilled wiki pages.",
          "~/.wenlan/sessions/: session handoff logs.",
          "~/.wenlan/sessions/_status/: current project status records.",
          "~/.wenlan/bin/: installed Wenlan CLI, daemon, and MCP connector binaries.",
          "~/.wenlan/db/: link to the daemon's local database store.",
          "macOS: ~/Library/Application Support/wenlan/.",
          "Linux: ~/.local/share/wenlan/ or $XDG_DATA_HOME/wenlan/.",
          "Windows: %LOCALAPPDATA%\\origin\\ (current runtime legacy directory).",
        ],
      },
      {
        heading: "Readable artifacts and retrieval",
        body: [
          "Raw captures and recall live in the daemon-owned store. Pages, session logs, and project status are readable Markdown projections under ~/.wenlan.",
          "This keeps search fast and structured while giving people inspectable artifacts for pages, handoffs, and status without pretending every memory is a Markdown file.",
        ],
      },
      {
        heading: "Local memory setup",
        body: [
          "Wenlan stores, embeds, deduplicates, and serves hybrid search without requiring a local model download or Anthropic API key.",
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
      "Back up Wenlan's readable artifacts and daemon data together, then verify the restored runtime before trusting recall.",
    metaTitle: "Wenlan Backup and Migration | Docs",
    metaDescription:
      "Learn what to back up for Wenlan, how readable ~/.wenlan artifacts relate to daemon data, and how to verify a restored or migrated install.",
    keywords: [
      "Wenlan backup",
      "Wenlan migration",
      "backup AI memory",
      "migrate Wenlan",
      "Wenlan data directory",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "~/.wenlan contains readable artifacts, but the daemon data directory also matters for a complete backup.",
      "After moving or restoring Wenlan, verify with status, doctor, and a capture/recall round trip from the client you use.",
    ],
    sections: [
      {
        heading: "What to back up",
        body: [
          "Back up the readable artifacts and the daemon application data together. The readable side gives you pages, sessions, status records, and local git history. The daemon data side keeps the database, index, config, and service-facing state.",
          "A backup that only includes ~/.wenlan may preserve useful Markdown, but it should not be treated as a complete live runtime restore.",
        ],
        code: {
          label: "Paths",
          code: backupPaths,
        },
      },
      {
        heading: "Keep backups private",
        body: [
          "Wenlan memory can contain project decisions, private preferences, client names, sensitive repo details, and old versions preserved by local git history.",
          "Do not put backups in a shared cloud folder, public issue, or team drive unless that is an intentional data-governance decision.",
        ],
      },
      {
        heading: "Before moving machines",
        body: [
          "Install the Wenlan runtime on the new machine first, then restore the backed-up data into the matching platform locations.",
          "MCP client settings may contain absolute paths to wenlan-mcp. After migration, rerun wenlan connect for each client instead of assuming old settings still point to the right binary.",
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
          "If you cannot restore the daemon immediately, the projected Markdown under ~/.wenlan is still useful as a human-readable fallback.",
          "That fallback does not provide capture, recall, distill, review, forget, or index updates. Treat it as readable continuity, not a full Wenlan runtime.",
        ],
      },
      {
        heading: "Deletion is separate",
        body: [
          "Uninstalling Wenlan's service does not delete memory data. Deleting memory data is a separate decision because it can remove the only local record of project history.",
          "When removing Wenlan permanently, review what is in ~/.wenlan and the daemon data directory first. For normal troubleshooting, keep the data and use doctor output to diagnose the install.",
        ],
      },
    ],
    nextSlug: "configuration",
  },
  {
    slug: "configuration",
    group: "Reference",
    eyebrow: "Configuration",
    title: "Wenlan Configuration",
    description:
      "Configure Wenlan spaces, MCP clients, daemon bind address, local paths, models, and keys without editing the database by hand.",
    metaTitle: "Wenlan Configuration: Spaces, MCP, Daemon, Keys | Docs",
    metaDescription:
      "Configure Wenlan with /setup, wenlan setup, wenlan connect, WENLAN_SPACE, WENLAN_BIND_ADDR, local paths, models, API keys, and doctor checks.",
    keywords: [
      "Wenlan configuration",
      "Wenlan settings",
      "WENLAN_SPACE",
      "WENLAN_BIND_ADDR",
      "wenlan spaces.toml",
    ],
    publishedAt: "2026-06-01",
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Configure Wenlan through /setup, npx setup, wenlan connect, wenlan spaces, wenlan models, and wenlan keys before editing files by hand.",
      "Most users only need WENLAN_SPACE for context separation and, rarely, WENLAN_BIND_ADDR for Docker or VM access.",
      "Run wenlan doctor after configuration changes to verify daemon health, MCP wiring, local paths, model state, and key state.",
    ],
    sections: [
      {
        heading: "Configuration quick path",
        body: [
          "The safest way to configure Wenlan is command-driven: run /setup in Claude Code, npx -y wenlan setup for other MCP clients, then let wenlan connect write the client-specific MCP configuration.",
          "After changing spaces, MCP clients, daemon binding, models, or keys, run wenlan doctor. It checks the daemon, local runtime, MCP connector, model state, key state, and common path issues before you debug by hand.",
        ],
        code: {
          label: "Setup checks",
          code: "/setup\nnpx -y wenlan setup\n~/.wenlan/bin/wenlan connect cursor\n~/.wenlan/bin/wenlan doctor",
        },
        link: {
          label: "Read the Claude Code memory guide",
          href: "/learn/claude-code-memory",
        },
      },
      {
        heading: "Spaces",
        body: [
          "Spaces separate work, personal, client, and project memory without requiring multiple Wenlan installs. Set a space for a shell session with WENLAN_SPACE, or define stable spaces in ~/.wenlan/spaces.toml.",
          "Use wenlan spaces commands when you want the CLI to list, create, inspect, or move spaces instead of editing the file directly.",
        ],
        code: {
          label: "Space config",
          code: "WENLAN_SPACE=client-a claude\nwenlan spaces list\nwenlan spaces add client-a",
        },
      },
      {
        heading: "MCP client wiring",
        body: [
          "MCP clients need to launch the same local wenlan-mcp connector. The normal path is wenlan connect because each client stores MCP config differently.",
          "If a client requires manual JSON, use wenlan connect --dry-run to inspect the command path for your machine, then paste the generated shape into that client's settings.",
        ],
        code: {
          label: "Client config",
          code: mcpConnectCommand,
        },
      },
      {
        heading: "Daemon bind address",
        body: [
          "The daemon binds to 127.0.0.1:7878 by default. That is the right setting for normal laptop use because the memory API stays local to the machine.",
          "Only change WENLAN_BIND_ADDR when you deliberately need a non-loopback bind, such as a Docker or VM environment. Exposing the daemon is a privacy decision, not a normal setup step.",
        ],
        code: {
          label: "Environment",
          code: configurationKnobs,
        },
      },
      {
        heading: "Local files",
        body: [
          "Human-facing Wenlan artifacts live under ~/.wenlan. The daemon-owned database and platform service files live under the OS application data location.",
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
          "Wenlan works in local memory mode without a model download or API key. Configure a model or Anthropic key only when you want daemon-side language work such as richer extraction, recaps, or page synthesis.",
          "Treat keys as an explicit opt-in. The connected AI client may already call its own provider during chat; Wenlan's model and key settings only cover daemon-side work.",
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
      "Know which Wenlan environment variables are normal configuration, which are development-only, and which belong to eval or Windows repair paths.",
    metaTitle: "Wenlan Environment Variables | Docs",
    metaDescription:
      "Reference Wenlan environment variables including WENLAN_SPACE, WENLAN_BIND_ADDR, WENLAN_PORT, WENLAN_DATA_DIR, ORT_DYLIB_PATH, ANTHROPIC_API_KEY, and eval cache variables.",
    keywords: [
      "Wenlan environment variables",
      "WENLAN_SPACE",
      "WENLAN_BIND_ADDR",
      "WENLAN_DATA_DIR",
      "ORT_DYLIB_PATH",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Most users should configure Wenlan with /setup, wenlan setup, wenlan connect, wenlan models, wenlan keys, and wenlan spaces.",
      "Environment variables are for scoped overrides: spaces, daemon networking, dev isolation, Windows runtime repair, and eval runs.",
    ],
    sections: [
      {
        heading: "Use commands first",
        body: [
          "Wenlan's normal configuration path is command-driven. Use /setup or npx setup for installation, wenlan connect for clients, wenlan spaces for spaces, and wenlan keys or wenlan models for optional language features.",
          "Reach for environment variables when you need a temporary override, a scripted run, or a development/eval setup that should not become the default for every session.",
        ],
      },
      {
        heading: "Normal runtime overrides",
        body: [
          "WENLAN_SPACE selects the active memory bucket for the current shell or process. WENLAN_HOST points the CLI at a daemon URL when you are not using the default local address.",
          "WENLAN_BIND_ADDR changes where the daemon listens and should stay loopback unless you intentionally expose the daemon in Docker or a VM.",
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
          "If Windows cannot load the bundled ONNX Runtime library, point ORT_DYLIB_PATH at the onnxruntime.dll inside the Wenlan install directory before starting the daemon.",
          "This is a repair path, not a normal setup step. Start with wenlan doctor when the daemon fails to start.",
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
          "Environment variables can change where Wenlan listens, where it stores data, and which provider keys it can use. Treat those values like operational configuration, not copy-paste snippets.",
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
      "Connect Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, ChatGPT, Claude.ai, and other MCP clients to Wenlan.",
    metaTitle: "Connect MCP Clients to Wenlan | Docs",
    metaDescription:
      "Connect local clients with wenlan connect, or connect ChatGPT and Claude.ai through Wenlan's Streamable HTTP MCP Remote Access path.",
    keywords: [
      "MCP client setup",
      "Claude Code MCP",
      "Cursor MCP",
      "Codex MCP",
      "Gemini CLI MCP",
      "ChatGPT MCP",
      "Streamable HTTP MCP",
      "wenlan-mcp",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "Wenlan's daemon owns the source-backed wiki and retrieval boundary; wenlan-mcp exposes it over stdio for local clients and Streamable HTTP for web clients.",
      "Claude Code and Codex have plugin paths, local clients use wenlan connect, and ChatGPT or Claude.ai use a Remote Access URL.",
    ],
    sections: [
      {
        heading: "How the pieces connect",
        body: [
          "The daemon runs locally and owns captures, source-backed pages, sessions, and retrieval. wenlan-mcp is the connector clients use when they need Wenlan tools.",
          "Local clients launch wenlan-mcp over stdio. ChatGPT and Claude.ai use its Streamable HTTP endpoint through a temporary HTTPS tunnel URL. Remote Access launches the loopback server with --no-auth, so possession of the URL grants access. Both paths reach the same daemon.",
        ],
      },
      {
        heading: "Set up the local runtime",
        body: [
          "Run this once before wiring another MCP client. It prepares the local Wenlan runtime that wenlan-mcp talks to.",
        ],
        code: {
          label: "Terminal",
          code: wenlanSetupCommand,
        },
      },
      {
        heading: "Add a client",
        body: [
          "After setup, ask the Wenlan CLI to write a local client's MCP configuration with wenlan connect <client>. It uses the local wenlan-mcp binary installed beside the CLI, with npm as a fallback when needed.",
        ],
        code: {
          label: "Terminal",
          code: mcpConnectCommand,
        },
      },
      {
        heading: "Manual config fallback",
        body: [
          "If a client only accepts a raw JSON configuration, point it at the local MCP connector that setup installed. Use wenlan connect --dry-run to see the exact path for your machine.",
          "If the daemon is running on a non-default local URL for development, wenlan-mcp also accepts --origin-url. Keep normal users on the default 127.0.0.1:7878 path.",
        ],
        code: {
          label: "mcpServers",
          code: mcpConfig,
        },
      },
      {
        heading: "Non-default daemon URL",
        body: [
          "Most users should not need this. It is for development or isolated testing when wenlan-server is intentionally running on a different local port.",
          "Use it together with isolated data so an MCP client does not accidentally talk to the wrong daemon.",
        ],
        code: {
          label: "MCP connector",
          code: mcpWenlanUrlCommand,
        },
      },
      {
        heading: "Claude Code",
        body: [
          "The Claude Code plugin is the most complete path because it includes slash commands, setup checks, and the daily workflow around the MCP server.",
          "After installing the plugin, restart Claude Code if prompted, then run /setup.",
        ],
        code: {
          label: "Claude Code",
          code: "/plugin marketplace add 7xuanlu/claude-plugins\n/plugin install wenlan@7xuanlu\n/setup",
        },
      },
      {
        heading: "Codex",
        body: [
          "Codex can use the Codex plugin shipped in plugin-codex, or connect directly through the local MCP path. The direct path does not require a Wenlan source checkout.",
        ],
        code: {
          label: "Terminal",
          code: "npx -y wenlan setup\n~/.wenlan/bin/wenlan connect codex",
        },
      },
      {
        heading: "ChatGPT and Claude.ai",
        body: [
          "The guided path is Wenlan desktop app > Remote Access. It starts the released Streamable HTTP MCP server with --no-auth on loopback, creates a temporary HTTPS tunnel URL, and shows the connection steps for both web clients. Possession of the URL grants access.",
          "In ChatGPT, open Settings > Plugins, create a New Plugin, choose Server URL under Connection, paste the Remote Access URL, and set Authentication to None. In Claude.ai, install Wenlan from the 7xuanlu/wenlan marketplace through Directory > Plugins; the desktop app can also run that setup when the connector is not detected.",
          "This is a custom MCP connection to your own Wenlan runtime. It does not mean Wenlan is publicly listed in the ChatGPT Apps Directory. Stop Remote Access when you are not using it.",
        ],
        link: {
          label: "Read desktop Remote Access status",
          href: "/docs/desktop-app",
        },
      },
      {
        heading: "Other local clients",
        body: [
          "Cursor, Claude Desktop, Gemini CLI, VS Code, and other supported local MCP clients use wenlan connect <client>.",
          "The settings screen differs by client. The important part is that the client launches the Wenlan MCP connector installed by setup.",
        ],
      },
      {
        heading: "Verify the connection",
        body: [
          "After connecting a client, run its available Wenlan doctor or recall tool. Then capture one small durable fact and recall it from another session or client.",
          "If that round trip works, the client is reaching the same Wenlan daemon and source-backed wiki.",
        ],
      },
    ],
    nextSlug: "agent-profiles",
  },
  {
    slug: "agent-profiles",
    group: "Reference",
    eyebrow: "Agents",
    title: "Wenlan Agent Profiles and Client Attribution",
    description:
      "See which AI client wrote a Wenlan memory, inspect source_agent attribution, and manage trust or enabled state.",
    metaTitle: "Wenlan Agent Profiles and source_agent | Docs",
    metaDescription:
      "Inspect Claude Code, Codex, Cursor, and local tool attribution in Wenlan with source_agent, agent profiles, trust, enabled state, and CLI commands.",
    keywords: [
      "Wenlan agent profiles",
      "wenlan agents command",
      "source_agent",
      "AI client trust",
      "MCP agent memory",
    ],
    updatedAt: "2026-07-10",
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "Quick answer: agent profiles identify which AI client or local tool produced a memory through source_agent attribution.",
      "Use them to inspect trust and enabled state; use spaces separately to decide which work context owns the capture.",
    ],
    sections: [
      {
        heading: "Quick answer: what an agent profile identifies",
        body: [
          "An agent profile represents a writer or client that uses the local daemon: Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, or a local script.",
          "Profiles make source attribution explicit. When memory has a source_agent value, later review and diagnostics can show where it came from.",
        ],
      },
      {
        heading: "Inspect registered agents",
        body: [
          "Use the CLI when you want to see which agents Wenlan knows about or inspect one profile in detail.",
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
          "Trust is a signal for how Wenlan should treat a known writer; it is not a replacement for reviewing uncertain memory.",
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
          "Keep both dimensions. A trusted Claude Code profile can still write into the wrong space if the workspace resolver or WENLAN_SPACE is wrong.",
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
    metaTitle: "Wenlan Troubleshooting | Docs",
    metaDescription:
      "Troubleshoot Wenlan setup issues with the daemon, MCP connection, Claude Code plugin commands, wenlan connect, port 7878, and memory recall.",
    keywords: [
      "Wenlan troubleshooting",
      "daemon not running",
      "MCP connection issues",
      "port 7878",
      "doctor command",
    ],
    updatedAt: "2026-07-24",
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Start with /setup in Claude Code, wenlan doctor in the terminal, or the doctor tool in an MCP client.",
      "Most issues are one of three things: daemon not reachable, MCP server not configured, or the client needs a restart.",
    ],
    sections: [
      {
        heading: "Claude Code commands are missing",
        body: [
          "If /brief, /capture, or /handoff do not appear after installing the plugin, restart Claude Code once.",
          "Then run /setup. It should verify the plugin, daemon, MCP route, and memory round trip.",
        ],
        code: {
          label: "Claude Code",
          code: "/setup",
        },
      },
      {
        heading: "Daemon is not reachable",
        body: [
          "Wenlan's daemon listens locally on port 7878. If a client cannot reach it, use /setup from Claude Code or the doctor tool from an MCP client to check the daemon state.",
          "For non-Claude clients, rerun npx -y wenlan setup if the local runtime was never installed or status verification failed.",
          "Only one daemon should own the local database. If you have been developing Wenlan locally, make sure an old daemon from another checkout is not still running.",
        ],
      },
      {
        heading: "MCP client is not connected",
        body: [
          "Check that you ran npx -y wenlan setup first, then ran ~/.wenlan/bin/wenlan connect for that client. Some clients require a full restart after changing MCP settings.",
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
          "If the memory exists but is stale or duplicated, use /curate for pending queues and /distill when a topic deserves a clearer page.",
        ],
      },
      {
        heading: "When to open an issue",
        body: [
          "If /setup or doctor reports a daemon, MCP, or install failure you cannot resolve, open a GitHub issue with the client name, command you ran, and the diagnostic output.",
          "Avoid pasting private memory contents into public issues. Describe the setup failure and redact project-specific details.",
        ],
        link: {
          label: "Open a GitHub issue",
          href: "https://github.com/7xuanlu/wenlan/issues",
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
    metaTitle: "Wenlan Diagnostics and Issue Reports | Docs",
    metaDescription:
      "Use /setup, wenlan status, wenlan doctor, MCP dry-run output, and port checks to diagnose Wenlan setup issues before opening a redacted GitHub issue.",
    keywords: [
      "Wenlan diagnostics",
      "wenlan doctor",
      "Wenlan issue report",
      "Wenlan logs",
      "MCP diagnostics",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Start diagnostics with /setup, wenlan status, wenlan doctor, and an MCP dry-run for the client that fails.",
      "Good issue reports include environment and redacted diagnostics, not private memory contents or full ~/.wenlan archives.",
    ],
    sections: [
      {
        heading: "Run the short checklist",
        body: [
          "Use the smallest command set that separates daemon health, client wiring, and port conflicts.",
          "If you are in Claude Code, start with /setup. If you are in another client, use the terminal commands and the client's MCP status UI.",
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
          "If the daemon is healthy but the client has no tools, focus on MCP configuration, client restarts, and whether the client is launching the expected wenlan-mcp path.",
        ],
      },
      {
        heading: "Port 7878 conflicts",
        body: [
          "Only one Wenlan daemon should own the local database. A stale daemon from another checkout can make setup look broken even when the current install is fine.",
          "If port 7878 is occupied, identify what process is listening before restarting clients or changing configuration.",
        ],
      },
      {
        heading: "What to include in an issue",
        body: [
          "Include the client name, operating system, install path you used, exact command, expected behavior, actual behavior, and redacted diagnostic output.",
          "Mention whether /setup or wenlan doctor passed, and whether a small capture/recall round trip works from any client.",
        ],
        bullets: [
          "Client: Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, VS Code, or other.",
          "Platform: macOS, Linux, Windows, Docker, VM, or WSL if relevant.",
          "Runtime: plugin setup, npx setup, source build, or migrated install.",
          "Diagnostics: /setup output, wenlan status, wenlan doctor, and MCP dry-run output after redaction.",
        ],
        link: {
          label: "Open a GitHub issue",
          href: "https://github.com/7xuanlu/wenlan/issues",
        },
      },
      {
        heading: "What to redact",
        body: [
          "Do not paste private captures, client names, repo names, API keys, tokens, full session logs, or full ~/.wenlan archives into public issues.",
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
      "Short answers to the adoption questions people ask before and after installing Wenlan.",
    metaTitle: "Wenlan FAQ | Docs",
    metaDescription:
      "Answer common Wenlan questions about product positioning, install paths, desktop app status, local data, Markdown artifacts, uninstall behavior, and verification.",
    keywords: [
      "Wenlan FAQ",
      "what is Wenlan",
      "Wenlan install path",
      "Wenlan desktop app",
      "Wenlan local data",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "Wenlan is a local-first LLM wiki for AI work: agents capture what they learn, sources ground the result, and the daemon keeps pages usable across clients and sessions.",
      "Use this page when you need the short answer, then follow the linked docs for setup, data, packages, troubleshooting, or project scope.",
    ],
    sections: [
      {
        heading: "Is Wenlan just memory?",
        body: [
          "Wenlan includes a local memory substrate, but that is not the product headline. The product is a source-backed LLM wiki where decisions, context, handoffs, and pages remain useful across sessions and tools.",
          "That distinction matters because Wenlan is designed around the work loop: brief, capture, recall, handoff, distill, inspect, and keep going.",
        ],
        link: {
          label: "Read project scope",
          href: "/docs/project-scope",
        },
      },
      {
        heading: "Which install path should I use?",
        body: [
          "Use the Claude Code plugin if Claude Code is your main work surface. It gives you /setup, /brief, /capture, /handoff, /distill, and the plugin-level workflow.",
          "Use npx -y wenlan setup when you want Wenlan from Codex, Cursor, Claude Desktop, Gemini CLI, VS Code, or another MCP client.",
        ],
        link: {
          label: "Compare package names",
          href: "/docs/packages-and-registries",
        },
      },
      {
        heading: "Do I need the desktop app?",
        body: [
          "No. The daemon, CLI, and MCP connector are the product path. The desktop app is optional and lives in the main repository's AGPL-3.0-only app/ crate.",
          "If you only want agents to use Wenlan, install the plugin or runtime setup and verify the MCP route. You do not need a GUI.",
        ],
        link: {
          label: "Read desktop status",
          href: "/docs/desktop-app",
        },
      },
      {
        heading: "Where does data live?",
        body: [
          "Wenlan keeps the daemon database in the operating system's application data directory and keeps readable artifacts under ~/.wenlan.",
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
          "No. Wenlan uses a local database and index for retrieval, graph context, pages, and daemon state. Markdown artifacts are the human-readable projection, not the whole storage system.",
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
          "No. wenlan background off stops Wenlan and removes the per-user service registration. It does not delete ~/.wenlan or the daemon data directory.",
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
          "Run /setup in Claude Code or wenlan doctor from the terminal. Then capture one small durable fact and recall it from the client you plan to use.",
          "If daemon health passes and a capture/recall round trip works, the client is connected to the same Wenlan daemon.",
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
      "Report Wenlan vulnerabilities privately, redact diagnostic output, and understand the local daemon security boundary.",
    metaTitle: "Wenlan Security and Vulnerability Reporting | Docs",
    metaDescription:
      "Learn how to report Wenlan security issues privately, use security.txt, avoid leaking private memory contents, and keep the local daemon on the intended boundary.",
    keywords: [
      "Wenlan security",
      "Wenlan vulnerability reporting",
      "Wenlan security policy",
      "AI memory security",
      "local memory privacy",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "Quick answer: use GitHub Issues for normal bugs, but report vulnerabilities through the private advisory or email path.",
      "Redact private memory contents, API keys, client names, daemon databases, and ~/.wenlan archives before sharing diagnostics.",
    ],
    sections: [
      {
        heading: "Quick answer: where to report",
        body: [
          "Normal setup bugs, docs issues, and feature requests belong in GitHub Issues with redacted diagnostic output.",
          "If you discover a vulnerability, do not open a public issue. Use the private GitHub Security Advisory path or the email address in SECURITY.md with the description, reproduction steps, affected version, and potential impact.",
        ],
        bullets: [
          "Public bugs: include client, OS, command, expected behavior, actual behavior, and redacted /setup, doctor, or wenlan status output.",
          "Security reports: include impact, reproduction steps, affected version or commit, and only the minimum redacted data needed to reproduce.",
          "Never attach ~/.wenlan, the daemon database, private captures, API keys, or unredacted project logs to a public issue.",
        ],
        link: {
          label: "Open a private advisory",
          href: "https://github.com/7xuanlu/wenlan/security/advisories/new",
        },
      },
      {
        heading: "Local-first boundary",
        body: [
          "Wenlan keeps its working data local by default: daemon, database, Markdown artifacts, sessions, and git history live on your machine.",
          "That does not make every connected workflow offline. Your AI client may send prompts to its own provider, and Wenlan can optionally use configured model or API paths for daemon-side language work.",
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
          "Changing WENLAN_BIND_ADDR to a non-loopback address is an explicit security decision. Do it only for deliberate Docker, VM, or development scenarios where you understand who can reach the daemon.",
        ],
      },
      {
        heading: "Security policy",
        body: [
          "The public website publishes /.well-known/security.txt for automated discovery. The source repository's security policy commits to acknowledgment within 48 hours and a fix timeline within 7 days. The latest released version is supported (the current stable 0.18.5 line); older releases are best-effort.",
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
      "What Wenlan's published retrieval numbers mean, how they are generated, and what they do not claim.",
    metaTitle: "Wenlan Evaluation and Benchmarks | Docs",
    metaDescription:
      "Read Wenlan's benchmark methodology, current LME_Oracle and LME_S retrieval snapshot, eval scope, and how to rerun LongMemEval locally.",
    keywords: [
      "Wenlan evaluation",
      "Wenlan benchmarks",
      "LongMemEval",
      "LME_S",
      "AI memory retrieval benchmark",
    ],
    updatedAt: "2026-07-24",
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "The public numbers are retrieval metrics, not end-to-end answer quality claims.",
      "The current CE-reranker retrieval snapshot reports LME_Oracle at 93.6% Recall@5 / 0.857 MRR / 0.883 NDCG@10 and LME_S at 87.7% Recall@5 / 0.815 MRR / 0.822 NDCG@10.",
    ],
    sections: [
      {
        heading: "Current snapshot",
        body: [
          "Wenlan publishes a compact retrieval snapshot for the shipped hybrid retrieval path. The snapshot uses BGE-Base-EN-v1.5-Q embeddings, FTS5, Reciprocal Rank Fusion, and the local BGE reranker when enabled.",
          "The numbers below should be read as retrieval-only metrics over the stated fixtures. LME_S is the deep LongMemEval substrate; the current representative snapshot uses the stratified N=90 fixture, with 84 gradeable retrieval rows.",
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
          "This is useful because Wenlan's job is to bring the right memories, pages, decisions, and graph context into the next agent session. It does not prove that a downstream model will always answer correctly.",
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
          "The eval harness lives in crates/wenlan-core/src/eval. The workflow docs live in docs/eval in the Wenlan repository.",
          "Slow GPU or API-backed evals are manual. Normal CI avoids running heavy model benchmarks because hosted runners do not provide the right hardware, secrets, or cost profile.",
        ],
        bullets: [
          "LongMemEval retrieval runs use Recall@5, MRR, and NDCG@10 headline fields. The LME_S row comes from docs/eval/results/lme_s_90_bge_base_pool20.summary.json in the Wenlan repo.",
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
          href: "https://github.com/7xuanlu/wenlan/tree/main/docs/eval",
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
      "Understand how the optional Wenlan desktop app relates to the daemon, plugins, source-backed wiki, and Remote Access for ChatGPT and Claude.ai.",
    metaTitle: "Wenlan Desktop App Status | Docs",
    metaDescription:
      "Learn whether the Wenlan desktop app is required, how it ships from the main Wenlan repo, and which license boundary applies.",
    keywords: [
      "Wenlan desktop app",
      "Wenlan GUI",
      "Wenlan app",
      "Wenlan Tauri",
      "Wenlan desktop status",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "4 min read",
    summary: [
      "The core Wenlan product path is the local daemon, CLI, MCP server, Claude Code plugin, and Codex plugin; the desktop app now ships from the same versioned monorepo.",
      "The desktop app is optional, provides the richest human wiki view, and remains AGPL-3.0-only inside the otherwise Apache-2.0 workspace.",
    ],
    sections: [
      {
        heading: "Is the desktop app required?",
        body: [
          "No. Wenlan's main workflow works through Claude Code or Codex commands, MCP tools, and the wenlan CLI. The local daemon owns captures, pages, sessions, and retrieval either way.",
          "Use the desktop app when you want the richest source-cited wiki view, graphical review and curation, or guided Remote Access for web AI clients.",
        ],
      },
      {
        heading: "What the main repo owns",
        body: [
          "The main Wenlan repo owns the daemon, business logic, CLI, MCP server, shared wire types, Claude Code plugin, Codex plugin, and the app/ desktop crate.",
          "That is the runtime path documented on this website: setup, capture, recall, handoff, distill, pages, data paths, diagnostics, and releases.",
        ],
      },
      {
        heading: "Where the desktop app lives",
        body: [
          "The desktop app now lives under app/ in the main Wenlan repository and is version-locked to the workspace release train. The older split wenlan-app repository is historical, not the current release source.",
          "The app crate owns the Tauri 2 desktop shell, sidecar packaging, app-to-daemon bridge, updater metadata, source integrations, and Remote Access controls. Release artifacts and updater metadata now come from the unified Wenlan release.",
        ],
        link: {
          label: "Open the app source",
          href: "https://github.com/7xuanlu/wenlan/tree/v0.18.5/app",
        },
      },
      {
        heading: "Remote Access for ChatGPT and Claude.ai",
        body: [
          "The released desktop app starts wenlan-mcp in Streamable HTTP mode with --no-auth on loopback and exposes it through a temporary HTTPS tunnel. Possession of the URL grants access. The Remote Access panel gives you the URL, connection health, reconnect controls, and the exact setup path for ChatGPT and Claude.ai; stop Remote Access when you are not using it.",
          "ChatGPT uses a New Plugin configured with the Remote Access Server URL and Authentication set to None. Claude.ai uses Wenlan from the 7xuanlu/wenlan marketplace. Treat both as direct access to your own runtime, not proof of a public ChatGPT Apps Directory listing.",
        ],
        link: {
          label: "Connect web MCP clients",
          href: "/docs/mcp-clients",
        },
      },
      {
        heading: "Data model",
        body: [
          "The desktop app should be treated as a client over the daemon, not a second source of truth. The daemon owns the database, pages, sessions, and retrieval behavior.",
          "That boundary is what lets Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, ChatGPT, Claude.ai, terminal commands, and the optional GUI build on the same source-backed wiki.",
        ],
      },
      {
        heading: "License boundary",
        body: [
          "The main daemon, CLI, MCP server, core, shared types, and plugin files are Apache-2.0.",
          "The optional app/ desktop crate is AGPL-3.0-only inside the same repository. Check the crate license before reusing app code or contributing across that boundary.",
        ],
      },
    ],
    nextSlug: "changelog",
  },
  {
    slug: "changelog",
    group: "Project",
    eyebrow: "Releases",
    title: "Wenlan Changelog and Releases",
    description:
      "See the current Wenlan release, shipped changes, recent milestones, and how to distinguish tagged releases from unreleased main work.",
    metaTitle: "Wenlan Changelog and Current Release | Docs",
    metaDescription:
      "Check Wenlan's current stable version, shipped changes, release dates, recent milestones, and the canonical GitHub changelog.",
    keywords: [
      "Wenlan changelog",
      "Wenlan releases",
      "Wenlan version 0.18.5",
      "wenlan-mcp release notes",
    ],
    updatedAt: "2026-09-08",
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Quick answer: the current stable release in the repository changelog is v0.18.5, dated 2026-09-09.",
      "The unified release publishes native runtime archives plus macOS Apple Silicon and Windows x64 desktop builds and updater artifacts.",
    ],
    sections: [
      {
        heading: "Current stable release",
        body: [
          "Wenlan v0.18.5 is the current stable release recorded in CHANGELOG.md and GitHub Releases. It improves graph exploration and desktop update controls. See the release notes for the exact shipped changes.",
          "The website keeps public install and product claims aligned to the stable release unless a page explicitly labels a feature as unreleased or on main.",
        ],
      },
      {
        heading: "v0.18.4 to v0.18.5 highlights",
        body: [
          "These patches improve graph exploration and desktop update controls, add recovery for a stale background service after an update, and prevent overlapping recovery prompts.",
        ],
        bullets: [
          "Graph exploration and desktop update UX improvements shipped in v0.18.5.",
          "Background service recovery and tray stop controls shipped in v0.18.4.",
          "Idle detected entities are archived by default.",
        ],
      },
      {
        heading: "v0.18.1 to v0.18.3 highlights",
        body: [
          "These patches improve import visibility and entity housekeeping, make milestone notifications dismissible, and fix local-provider and shared Claude/Codex harness behavior.",
        ],
        bullets: [
          "Import reports real phase progress and batch status.",
          "Entity housekeeping gains an idle-archive rule; detected entities are presented as an index rather than a to-do list.",
          "Milestone notifications support explicit and automatic dismissal.",
          "Local provider presets can send an API key; upstream LLM refusals return a 502 response.",
          "Shared Claude/Codex hook and runner gaps are closed.",
          "These releases shipped through 2026-09-08.",
        ],
      },
      {
        heading: "v0.18.0 highlights",
        body: [
          "The v0.18.0 release improves the desktop home around the library you are actually viewing, removes the \"Where AI looked\" section, fits the empty-state ghost cards at the default window size, keeps startup moving when a global shortcut is occupied, and holds the window in place with a starting status until the daemon answers.",
        ],
        bullets: [
          "Each library gets one home page with an honest empty state when it has no pages yet.",
          "The home page no longer shows a \"Where AI looked\" section.",
          "Empty-state ghost cards fit at the default window size.",
          "Startup continues when another app already owns the global shortcut.",
          "The window stays still after launch and shows a starting status until the daemon answers.",
          "Stable release date: 2026-09-04.",
        ],
      },
      {
        heading: "v0.17.5 highlights",
        body: [
          "The v0.17.5 patch release keeps the v0.17.4 desktop and runtime improvements and hardens Remote Access by stopping its secret from being written to the app log.",
        ],
        bullets: [
          "Remote Access no longer writes its secret into the app log.",
          "The v0.17.4 desktop and runtime improvements remain part of the current release line: notarized macOS Apple Silicon DMG, source-opening citations, signed cloudflared updates, and the open and relay security fixes.",
          "The v0.17 line still includes verified exact-release installation, source-revision write fences, and the Atlas knowledge view.",
          "Stable release date: 2026-08-30.",
        ],
      },
      {
        heading: "v0.17.4 highlights",
        body: [
          "The v0.17.4 release notarized the macOS DMG, made document citations open their backing file, prevented cloudflared from replacing its signed binary, and closed the remaining open and relay security findings.",
        ],
        bullets: [
          "The macOS Apple Silicon DMG opens with a normal first launch.",
          "Document citations can show and open the file path behind the cited source.",
          "The app keeps the signed cloudflared binary from replacing itself during updates.",
          "Open and relay paths closed the three remaining security-audit findings, and five transitive npm packages moved past their advisories.",
        ],
      },
      {
        heading: "v0.14.x highlights",
        body: [
          "The v0.14.x releases strengthen the write and review lifecycle for source-backed pages while making model routing explicit and vendor-neutral.",
        ],
        bullets: [
          "Every Page write routes through one gate, including a draft lifecycle and wire contract.",
          "Page Map v1 adds schema, accessors, routes, and an improve pass.",
          "Per-job source pins and a resolved-routing endpoint avoid vendor privilege.",
          "Read scopes and approval-gated lint repair are enforced.",
          "v0.14.1 preserves the exact canonical page source.",
          "Stable release date: 2026-07-20.",
        ],
      },
      {
        heading: "v0.13.x highlights",
        body: [
          "The v0.13.x releases expanded diagnostics and external-LLM configuration while hardening release and maintenance behavior.",
        ],
        bullets: [
          "External-LLM API key, config hot-swap, and external status.",
          "Whole-system and deep semantic lint diagnostics.",
          "Directory sync keeps the daemon responsive.",
          "Evidence-driven lint maintenance paths are hardened.",
        ],
      },
      {
        heading: "v0.12.0 highlights",
        body: [
          "The v0.12.0 release reworks how wiki pages are synthesized and cited. Distill becomes one refresh operation with canonical PageWrite births, and synthesis is gated on citations so page claims stay traceable to sources.",
        ],
        bullets: [
          "Distill redesign: one refresh op, canonical PageWrite births, citation-gated synthesis.",
          "Per-claim verified citations for wiki pages.",
          "Loopback daemon guarded against cross-origin browser access.",
          "Server binds its port before any data-dir work.",
          "Release date: 2026-07-08.",
        ],
      },
      {
        heading: "v0.10.0 to v0.11.0 highlights",
        body: [
          "The v0.10.x and v0.11.0 releases focused on getting documents into the store and letting them talk back to it.",
        ],
        bullets: [
          "Folder and multi-format document ingest.",
          "Doc-grounded revisions: documents propose rewrites to conflicting captures.",
          "Pages skill ported to the Codex plugin.",
        ],
      },
      {
        heading: "v0.9.1 to v0.9.6 highlights",
        body: [
          "The rest of the v0.9.x line covered the public Wenlan cutover cleanup and made distilled wiki pages first-class across recall and search surfaces, with CLI-first browsing through wenlan pages and a reworked /curate revision queue.",
        ],
        bullets: [
          "Public rename cleanup completed across docs, plugin, and scripts.",
          "Distilled wiki pages surfaced across recall and search, space and tier gated.",
          "wenlan pages CLI and CLI-first /pages and /curate browsing.",
        ],
      },
      {
        heading: "v0.9.0 highlights",
        body: [
          "The v0.9.0 release is the first stable Wenlan-branded release after the public rename. It moves distribution identities to Wenlan while preserving the local-first daemon, CLI, MCP connector, and Claude Code plugin workflow.",
        ],
        bullets: [
          "Public package, binary, crate, and repository names now use Wenlan identities.",
          "The Claude Code plugin and setup path install through wenlan package names.",
          "WENLAN_RERANKER_MODE became configurable in this release; the current CLI path is wenlan models reranker <off|lite|full>.",
        ],
      },
      {
        heading: "v0.7.0 highlights",
        body: [
          "The v0.7.0 release broadened Wenlan from a macOS-first runtime into a cross-platform local daemon with explicit spaces and stronger evaluation discipline.",
        ],
        bullets: [
          "Cross-platform runtime support for macOS, Linux, and Windows.",
          "Space subcommands and doctor resolver state; the current CLI path is wenlan spaces.",
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
          "After v0.18.5, main-branch work should be treated as unreleased until a release entry publishes it. Earlier 0.8.x work included opt-in retrieval, refinery, and read-time experiments such as query decomposition, graph activation gates, FTS hardening, temporal filters, session diversification, salience priors, fact channels, k-hop graph traversal, global preludes, background reflection debounce, CoT retrieval, and LLM read-time routing.",
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
          href: "https://github.com/7xuanlu/wenlan/blob/main/CHANGELOG.md",
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
      "Understand how Wenlan turns merged work into tagged releases, package versions, binaries, npm packages, and crates.",
    metaTitle: "Wenlan Releases and Versioning | Docs",
    metaDescription:
      "Learn Wenlan's release-please flow, pre-1.0 version bump rules, package publishing surfaces, and how users should distinguish released behavior from main-branch work.",
    keywords: [
      "Wenlan releases",
      "Wenlan versioning",
      "release-please Wenlan",
      "wenlan-mcp npm release",
      "Wenlan crates.io release",
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
          "Wenlan uses release-please to maintain a release PR from merged commits. When that release PR is merged, tag-based workflows build and publish the local runtime.",
          "The release workflow ships the daemon CLI, wenlan-server, wenlan-mcp, standalone binaries, npm packages, crates, Homebrew tap updates, and the optional desktop app from the unified Wenlan repository.",
        ],
        code: {
          label: "Release flow",
          code: releaseFlow,
        },
      },
      {
        heading: "Version bump rules",
        body: [
          "Wenlan is pre-1.0, so release bump semantics are intentionally conservative. In this repo, feat commits bump the minor version before 1.0; fix commits bump patch.",
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
          "The release pipeline publishes the pieces users install: wenlan for the Claude Code plugin and setup path, wenlan-mcp for MCP clients, wenlan-types for Rust consumers, release archives, and Homebrew artifacts.",
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
          "Users should read the changelog, rerun npx setup or /setup, verify wenlan doctor, and restart MCP clients after package or connector changes.",
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
      "How to read Wenlan's current direction without confusing released features, main-branch work, and future bets.",
    metaTitle: "Wenlan Roadmap and Status | Docs",
    metaDescription:
      "Understand Wenlan's roadmap themes: reliable retrieval, provenance, local control, cross-client setup, eval discipline, and release status.",
    keywords: [
      "Wenlan roadmap",
      "Wenlan project status",
      "AI work memory roadmap",
      "Wenlan future releases",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "Wenlan's roadmap is centered on making AI work compound: better retrieval, better provenance, better handoffs, and safer local control.",
      "Roadmap items are directional, not promises. Stable release notes remain the source of truth for what shipped.",
    ],
    sections: [
      {
        heading: "Status model",
        body: [
          "Wenlan uses three practical status buckets: released, on main, and planned. Released means it appears in CHANGELOG.md or the current README install path. On main means merged but not necessarily released. Planned means a product direction, not a promise.",
          "This distinction matters because the repository moves quickly. The website should help users understand what they can rely on today without hiding where the project is going.",
        ],
      },
      {
        heading: "Released now",
        body: [
          "The released public shape is a local-first, source-backed LLM wiki: Claude Code and Codex plugins, local and remote MCP, CLI setup, daemon, hybrid retrieval, spaces, Markdown artifacts, source-backed pages, git versioning, and cross-platform runtime support.",
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
          "The project avoids a broad workflow-suite shape. The goal is a focused, source-backed LLM wiki for serious AI work, not a general productivity operating system.",
        ],
        link: {
          label: "Open current GitHub issues",
          href: "https://github.com/7xuanlu/wenlan/issues",
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
      "What Wenlan is for, what it deliberately avoids, and how to decide whether it fits your AI work.",
    metaTitle: "Wenlan Project Scope | Docs",
    metaDescription:
      "Understand what Wenlan is and is not: local-first AI work memory, not a life OS, not a workflow suite, not a memory SDK, and not for one-off chats.",
    keywords: [
      "Wenlan project scope",
      "what Wenlan is not",
      "AI work memory scope",
      "local memory tool",
      "MCP memory scope",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Wenlan focuses on AI work context that spans sessions, projects, tools, and weeks.",
      "It deliberately avoids becoming a life OS, broad workflow suite, hosted memory SDK, or transcript archive.",
    ],
    sections: [
      {
        heading: "What Wenlan is for",
        body: [
          "Wenlan is for serious AI work where decisions, lessons, gotchas, project constraints, and handoffs need to survive beyond one chat.",
          "The product shape is narrow on purpose: one local daemon, shared memory across MCP clients, source-backed pages, review before trust, and readable local artifacts.",
        ],
      },
      {
        heading: "Not a life OS",
        body: [
          "Wenlan does not try to own habits, calendars, journaling, personal planning, or a full life-management system.",
          "Those domains can produce useful memories, but Wenlan's scope is the AI work artifact: what an agent needs to continue work correctly.",
        ],
      },
      {
        heading: "Not a workflow suite",
        body: [
          "Wenlan is not trying to bundle dozens of agents, research loops, and productivity workflows. It gives those workflows a source-backed place to capture, refine, inspect, and recall what matters.",
          "That tradeoff keeps the product easier to understand: capture, recall, handoff, distill, inspect, and continue.",
        ],
      },
      {
        heading: "Not a memory SDK",
        body: [
          "Wenlan exposes a local daemon and MCP connector, but it is not positioned as backend infrastructure for other apps to add cloud memory features.",
          "The intended user is someone using AI tools daily who wants local, inspectable, shared work context.",
        ],
      },
      {
        heading: "Not for one-off chats",
        body: [
          "If a conversation is disposable, Wenlan may add more ceremony than value. The product starts paying off when work crosses sessions, tools, people, or weeks.",
          "A simple test: if the next agent should know it without you explaining it again, it probably belongs in Wenlan.",
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
      "Build the Wenlan daemon, CLI, MCP server, shared types, core crate, and plugin from the public repository.",
    metaTitle: "Build Wenlan from Source | Docs",
    metaDescription:
      "Learn how to build Wenlan from source, run the daemon locally, understand workspace crates, and run contributor verification commands.",
    keywords: [
      "build Wenlan from source",
      "Wenlan development setup",
      "wenlan-server cargo build",
      "Wenlan Rust workspace",
      "contribute to Wenlan",
    ],
    updatedAt: "2026-07-26",
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "The main repo is a Rust workspace with wenlan-core, wenlan-server, wenlan CLI, wenlan-mcp, and wenlan-types.",
      "Use the source build path for development; most users should install through the plugin or npx setup.",
    ],
    sections: [
      {
        heading: "When to build",
        body: [
          "Build from source when you are developing Wenlan, testing a branch, debugging the daemon, or preparing a contribution.",
          "If you only want to use Wenlan, install through the Claude Code plugin or npx setup instead. The release path installs prebuilt binaries into ~/.wenlan/bin.",
        ],
      },
      {
        heading: "Workspace build",
        body: [
          "The repository is a Cargo workspace. First builds can take several minutes, especially on macOS where llama.cpp compiles with Metal support.",
          "Run the daemon directly during development. For product-path testing, build release binaries and use wenlan setup, background on, status, and doctor.",
        ],
        code: {
          label: "Source build",
          code: buildFromSourceCommands,
        },
      },
      {
        heading: "Crate boundaries",
        body: [
          "wenlan-core owns business logic and must stay free of Axum and Tauri dependencies. wenlan-server frames HTTP requests. wenlan-types stays lightweight because downstream clients consume it.",
          "wenlan-mcp bridges MCP clients to the daemon. wenlan CLI manages setup, background service state, recall, search, capture, memories, spaces, models, keys, and doctor checks.",
        ],
      },
      {
        heading: "Platform notes",
        body: [
          "Wenlan's current prebuilt runtime supports macOS Apple Silicon, Linux x86_64/aarch64 with glibc, and Windows x86_64. macOS Intel has source/dev paths but no current prebuilt runtime. The service manager differs by platform: launchd, systemd user units, or a Task Scheduler logon task.",
          "Linux builds are CPU-only by default. macOS keeps Metal acceleration for local model paths, while v0.15.0 bundles the Vulkan loader for supported Windows GPU acceleration.",
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
          href: "https://github.com/7xuanlu/wenlan/blob/main/CONTRIBUTING.md",
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
      "Understand which Wenlan checks run locally, which run in GitHub Actions, and which evals stay manual.",
    metaTitle: "Wenlan Testing and CI | Docs",
    metaDescription:
      "Learn Wenlan's local test workflow, pre-commit and pre-push hooks, PR CI, coverage policy, manual eval boundaries, and verification expectations for contributors.",
    keywords: [
      "Wenlan tests",
      "Wenlan CI",
      "Wenlan contributor checks",
      "Wenlan coverage",
      "Wenlan eval tests",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Wenlan splits checks by cost and signal: fast local checks gate development; heavy evals stay manual.",
      "PR CI must prove daemon correctness, but retrieval-quality claims need separate eval discipline.",
    ],
    sections: [
      {
        heading: "Why checks are layered",
        body: [
          "Wenlan is a local daemon, CLI, MCP server, core library, and shared type crate. A single slow mega-check would make normal contribution work worse.",
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
      "Codebase rules that keep Wenlan's daemon, CLI, MCP connector, shared types, and core logic maintainable.",
    metaTitle: "Wenlan Development Conventions | Docs",
    metaDescription:
      "Learn Wenlan contributor conventions for crate boundaries, SQL safety, async state snapshots, typed MCP wrappers, dev/prod isolation, and worktree gotchas.",
    keywords: [
      "Wenlan development conventions",
      "Wenlan crate boundaries",
      "Wenlan SQL safety",
      "Wenlan async locks",
      "Wenlan MCP wrappers",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Wenlan's maintainer rules keep the local daemon simple, testable, and careful around private work context.",
      "Use these conventions when you change daemon behavior, MCP tools, storage, typed clients, or release-facing paths.",
    ],
    sections: [
      {
        heading: "Why conventions matter",
        body: [
          "Wenlan's daemon owns the local store that multiple AI clients read from and write to. A small boundary mistake can leak framework dependencies into core logic, change a public response shape, or make private data harder to inspect safely.",
          "The conventions are intentionally practical: keep business logic in the core crate, keep public wire types stable, keep state snapshots short-lived, and keep user data out of public bug reports.",
        ],
      },
      {
        heading: "Crate boundaries",
        body: [
          "wenlan-core owns storage, retrieval, graph logic, pages, evals, and other business behavior. It should not depend on Axum or Tauri. wenlan-server should frame HTTP requests and call core logic instead of becoming a second business layer.",
          "wenlan-types stays lightweight because it is shared by the daemon, MCP connector, CLI-adjacent tooling, desktop app, and downstream Rust clients. wenlan-mcp should deserialize daemon responses into typed structs so envelope drift fails loudly.",
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
          "A source checkout can talk to the same product daemon and data directory that your installed Wenlan uses. For isolated development, run the daemon on a different port with a temporary data directory.",
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
      "How to contribute useful bug reports, docs, eval cases, and code changes to Wenlan.",
    metaTitle: "Contributing to Wenlan | Docs",
    metaDescription:
      "Learn how to contribute to Wenlan: development setup, architecture boundaries, tests, linting, PR process, licensing, and useful issue reports.",
    keywords: [
      "contribute to Wenlan",
      "Wenlan open source",
      "Wenlan development setup",
      "Wenlan GitHub issues",
    ],
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Bug reports, docs, eval cases, and focused code changes are welcome in the Apache-2.0 Wenlan repo.",
      "The daemon, CLI, MCP server, core, shared types, and Claude Code plugin live in the main repo; the desktop app lives separately.",
    ],
    sections: [
      {
        heading: "What belongs in the main repo",
        body: [
          "The main Wenlan repo contains wenlan-server, wenlan-core, wenlan CLI, wenlan-mcp, wenlan-types, and the Claude Code plugin. Runtime, memory behavior, MCP tooling, docs, evals, and release infrastructure belong there.",
          "The desktop app is the AGPL-3.0-only app/ crate in the main repository. If an issue is about the local runtime, CLI, MCP server, plugin, or desktop interface, the Wenlan repository is the right place.",
        ],
      },
      {
        heading: "Useful contributions",
        body: [
          "The most useful contributions are focused and evidence-backed. A good issue includes the client, operating system, exact command, expected behavior, actual behavior, and redacted diagnostic output from /setup, doctor, or wenlan status.",
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
          "Wenlan is a Rust workspace. You need Rust stable and the platform build tools for your OS. macOS builds may take several minutes on the first run while llama.cpp compiles for Metal.",
          "For local development, build the workspace and run wenlan-server directly. To test the product path, build the release binaries and use wenlan setup, background on, status, and doctor.",
        ],
        code: {
          label: "Local development",
          code: "git clone https://github.com/7xuanlu/wenlan.git\ncd wenlan\ncargo build --workspace\ncargo run -p wenlan-server",
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
          "Keep the core crate framework-independent, keep wenlan-types lightweight, deserialize MCP responses into typed structs, and avoid holding long-lived locks across awaits.",
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
          "The desktop app lives under app/ in the unified Wenlan repository, and that crate is AGPL-3.0-only. Check this license boundary when contributing to the desktop app.",
        ],
        link: {
          label: "Read CONTRIBUTING.md",
          href: "https://github.com/7xuanlu/wenlan/blob/main/CONTRIBUTING.md",
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
          href: "https://github.com/7xuanlu/wenlan/blob/main/CODE_OF_CONDUCT.md",
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
