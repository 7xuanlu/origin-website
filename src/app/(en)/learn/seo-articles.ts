import type {
  ComparisonTable,
  LearnArticle,
  LearnArticleCategory,
  OfficialReference,
} from "./articles";

const UPDATED_AT = "2026-06-06";
const AUTHOR = "Qi-Xuan Lu";

type BaseSpec = {
  slug: string;
  eyebrow: string;
  category: LearnArticleCategory;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: string;
  audience: string;
  heroBullets: [string, string, string];
  quickAnswer: string;
  quickAnswerLink?: {
    label: string;
    href: string;
  };
  problem: string;
  wenlanFit: string;
  actionHeading: string;
  actionIntro: string;
  actionBullets: string[];
  code?: {
    label: string;
    code: string;
  };
  caution: string;
  faq: [string, string, string, string];
  relatedSlugs: string[];
  officialReferences?: OfficialReference[];
  comparisonTable?: ComparisonTable;
  productEvidence?: LearnArticle["productEvidence"];
  cta?: LearnArticle["cta"];
};

function makeArticle(spec: BaseSpec): LearnArticle {
  return {
    slug: spec.slug,
    eyebrow: spec.eyebrow,
    category: spec.category,
    title: spec.title,
    description: spec.description,
    metaTitle: spec.metaTitle,
    metaDescription: spec.metaDescription,
    keywords: spec.keywords,
    publishedAt: spec.publishedAt,
    updatedAt: spec.updatedAt ?? UPDATED_AT,
    author: AUTHOR,
    readingTime: spec.readingTime ?? "5 min read",
    audience: spec.audience,
    heroBullets: spec.heroBullets,
    sections: [
      {
        heading: "Quick answer",
        body: [spec.quickAnswer, spec.wenlanFit],
        link: spec.quickAnswerLink,
      },
      {
        heading: "When this problem appears",
        body: [spec.problem],
      },
      {
        heading: spec.actionHeading,
        body: [spec.actionIntro],
        bullets: spec.actionBullets,
        code: spec.code,
      },
      {
        heading: "What to check next",
        body: [spec.caution],
      },
    ],
    comparisonTable: spec.comparisonTable,
    productEvidence: spec.productEvidence,
    faqs: [
      {
        question: spec.faq[0],
        answer: spec.faq[1],
      },
      {
        question: spec.faq[2],
        answer: spec.faq[3],
      },
    ],
    relatedSlugs: spec.relatedSlugs,
    officialReferences: spec.officialReferences,
    cta: spec.cta ?? {
      heading: "Try the local memory loop",
      body: "Install Wenlan, connect your AI client, and verify that capture, recall, and handoff work on your machine.",
    },
  };
}

const setupArticles: BaseSpec[] = [
  {
    slug: "where-wenlan-stores-claude-code-memory",
    eyebrow: "Setup",
    category: "Workflows",
    title: "Where Wenlan Stores Claude Code Memory",
    description:
      "Find the local files Wenlan writes when Claude Code captures memories, handoffs, and distilled pages.",
    metaTitle: "Where Wenlan Stores Claude Code Memory | ~/.wenlan",
    metaDescription:
      "Find Wenlan's local Claude Code memory artifacts under ~/.wenlan: pages, sessions, status files, database symlinks, and git history.",
    keywords: [
      "where does Claude Code store memory",
      "Claude Code memory location",
      "Wenlan memory location",
      "~/.wenlan",
      "Wenlan ~/.wenlan pages",
      "Claude Code local memory",
    ],
    audience: "Claude Code users checking where memory lives on disk",
    heroBullets: [
      "Wenlan writes readable artifacts under ~/.wenlan instead of hiding memory inside a chat profile.",
      "Distilled pages live under ~/.wenlan/pages and session handoffs live under ~/.wenlan/sessions.",
      "Readable pages and session handoffs are versioned in ~/.wenlan/.git.",
    ],
    quickAnswer:
      "Wenlan stores its local runtime and readable artifacts under ~/.wenlan. That is separate from Claude Code's own CLAUDE.md and auto-memory systems: Claude Code runs the plugin and calls MCP tools, while Wenlan's daemon owns the local memory store.",
    problem:
      "This question usually comes up after a user installs the Claude Code plugin and wants to know whether memories are trapped inside Claude Code, stored in the cloud, or written somewhere they can inspect.",
    wenlanFit:
      "Wenlan's answer is deliberately boring: the memory layer is local. Memories live in the daemon database, while pages, handoffs, project status, and local git history are exposed as readable artifacts.",
    actionHeading: "Inspect the local artifacts",
    actionIntro:
      "After setup, use the filesystem and CLI to confirm what Wenlan wrote.",
    actionBullets: [
      "Check ~/.wenlan/pages for distilled Markdown pages.",
      "Check ~/.wenlan/sessions for handoffs and project status.",
      "Check ~/.wenlan/db on macOS or Linux for the convenience symlink to the libSQL store.",
      "Run ~/.wenlan/bin/wenlan status to verify the daemon.",
      "Inspect ~/.wenlan/.git when you need history for readable artifact writes.",
    ],
    code: {
      label: "Local artifact checks",
      code: "ls ~/.wenlan\nls ~/.wenlan/pages\nls ~/.wenlan/sessions\n~/.wenlan/bin/wenlan status\ngit -C ~/.wenlan log --oneline -5",
    },
    caution:
      "Do not edit the database directly. MCP memories live in the daemon DB; distilled pages and session handoffs are the readable projection. Use Wenlan commands and tools for memory writes, review, distill, and delete.",
    faq: [
      "Is Claude Code itself storing the memory?",
      "No. Claude Code runs the plugin and calls MCP tools. Wenlan's local daemon owns the memory store and readable artifacts.",
      "Can I symlink Wenlan pages into Obsidian?",
      "Yes. The Markdown projection under ~/.wenlan/pages is designed to stay readable, so you can link it into another local knowledge tool if that helps your workflow.",
    ],
    relatedSlugs: ["claude-code-memory", "markdown-local-index-ai-memory", "local-git-history-ai-memory"],
    officialReferences: [
      {
        label: "Claude Code memory docs",
        href: "https://code.claude.com/docs/en/memory",
      },
      {
        label: "Wenlan daemon data layout",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-server/README.md",
      },
    ],
  },
  {
    slug: "how-to-add-memory-to-claude-code",
    eyebrow: "Setup",
    category: "Workflows",
    title: "How to Add Memory to Claude Code",
    description:
      "Install Wenlan's Claude Code plugin, run /setup, and verify a local memory round trip.",
    metaTitle: "How to Add Memory to Claude Code | Wenlan",
    metaDescription:
      "Add local-first AI work memory to Claude Code with the Wenlan plugin, /setup, /brief, /capture, /recall, and /handoff.",
    keywords: [
      "add memory to Claude Code",
      "Claude Code memory plugin",
      "Claude Code persistent memory",
      "Wenlan Claude Code setup",
      "Claude Code MCP memory",
    ],
    audience: "Claude Code users who want persistent project context",
    heroBullets: [
      "Install the Wenlan Claude Code plugin from the marketplace.",
      "Run /setup once to verify the daemon, MCP wiring, and first memory round trip.",
      "Use /brief, /capture, /recall, and /handoff as the daily loop.",
    ],
    quickAnswer:
      "Use the Claude Code plugin path: /plugin marketplace add 7xuanlu/claude-plugins, then /plugin install wenlan@7xuanlu, then /setup. Restart Claude Code once if prompted before running /setup.",
    problem:
      "Claude Code can do substantial work in one session, but the next session starts cold unless the decisions, gotchas, and project state are stored somewhere durable.",
    wenlanFit:
      "Wenlan adds that durable layer without turning Claude Code into a new app. The plugin gives slash commands; the daemon keeps local memory; MCP lets other clients share the same context.",
    actionHeading: "Install and verify",
    actionIntro:
      "Run the plugin setup first, then prove the loop with one harmless capture.",
    actionBullets: [
      "Run /plugin marketplace add 7xuanlu/claude-plugins.",
      "Run /plugin install wenlan@7xuanlu.",
      "Restart Claude Code if it asks, then run /setup and wait for the daemon, MCP, and local memory checks to pass.",
      "Run /capture with one durable project fact, then /recall with a specific query.",
      "End a real work session with /handoff.",
    ],
    code: {
      label: "Claude Code commands",
      code: "/plugin marketplace add 7xuanlu/claude-plugins\n/plugin install wenlan@7xuanlu\n/setup\n/capture Wenlan test: this project uses Wenlan for local AI work memory.\n/recall Wenlan local AI work memory",
    },
    caution:
      "Do not start by capturing full logs or command output. Wenlan works best when each memory is one durable idea with why it matters.",
    faq: [
      "Do I need an API key to add memory to Claude Code?",
      "No for the core local memory loop. Optional model or API-key paths add richer extraction and page refresh work, but setup and daily capture/recall do not start there.",
      "Is MCP-only setup enough for Claude Code?",
      "It can be enough for raw tools, but the plugin is the richer path because it adds slash commands like /brief, /handoff, /distill, and /setup.",
    ],
    relatedSlugs: ["claude-code-memory-command-vs-wenlan", "wenlan-for-claude-code", "claude-code-memory"],
    officialReferences: [
      {
        label: "Wenlan Claude Code plugin",
        href: "https://github.com/7xuanlu/wenlan/tree/main/plugin",
      },
      {
        label: "Wenlan get started docs",
        href: "https://wenlan.app/docs/get-started",
      },
    ],
  },
  {
    slug: "claude-code-memory-command-vs-wenlan",
    eyebrow: "Claude Code",
    category: "Workflows",
    title: "Claude Code /memory vs Wenlan: Native Memory or Shared Local Context?",
    description:
      "Use Claude Code /memory for native project memory inspection, and use Wenlan when context needs provenance, handoff, and cross-tool MCP access.",
    metaTitle: "Claude Code /memory vs Wenlan | Local MCP Memory",
    metaDescription:
      "Understand Claude Code /memory, CLAUDE.md, auto memory, and when Wenlan adds local MCP memory shared with Cursor, Codex, and other tools.",
    keywords: [
      "Claude Code /memory",
      "Claude Code memory command",
      "Claude Code memory vs Wenlan",
      "Claude Code MCP memory",
      "Claude Code shared memory",
    ],
    audience: "Claude Code users deciding whether native memory is enough",
    heroBullets: [
      "Claude Code /memory helps inspect and edit what Claude Code has loaded.",
      "CLAUDE.md and auto memory are the right place for stable project instructions and repeated corrections.",
      "Wenlan is for source-backed, local, cross-tool work memory that should also reach Cursor, Codex, and other MCP clients.",
    ],
    quickAnswer:
      "Start with Claude Code's native memory. Use /memory to inspect loaded memories, CLAUDE.md for stable project instructions, and auto memory for repeated preferences and corrections. Add Wenlan when the memory should become a local, reviewable work layer shared through MCP.",
    problem:
      "This question appears when Claude Code remembers some things but still loses session state, decisions, gotchas, or handoffs that matter outside the current chat. The risk is adding another memory layer before understanding what native Claude Code memory already solves.",
    wenlanFit:
      "Wenlan should not duplicate CLAUDE.md. Wenlan fits the evolving layer: decisions, lessons, gotchas, project status, source-backed pages, and handoffs that need provenance and cross-client recall.",
    actionHeading: "Choose the right memory surface",
    actionIntro:
      "Use the smallest memory surface that solves the job, then add Wenlan when the work needs to outgrow Claude Code's native memory boundary.",
    actionBullets: [
      "Use CLAUDE.md for durable project rules, commands, and conventions.",
      "Use /memory when you need to inspect or edit what Claude Code has loaded.",
      "Use Claude Code auto memory for repeated corrections and preferences Claude discovers.",
      "Use Wenlan /capture for one source-backed decision, gotcha, or project fact that should be searchable later.",
      "Use Wenlan /handoff when the next session or another agent needs current project state.",
      "Use Wenlan MCP setup when Cursor, Codex, Claude Desktop, or another client should share the same local memory.",
    ],
    code: {
      label: "Native first, Wenlan when shared",
      code: "/memory\n# Check CLAUDE.md for stable instructions.\n\n/capture We chose <decision> because <reason>; verify with <command>.\n/handoff",
    },
    caution:
      "Do not copy everything from /memory into Wenlan. Keep Claude Code instructions in Claude Code, and store only durable work context that benefits from provenance, search, handoff, or cross-tool access.",
    faq: [
      "Does Wenlan replace Claude Code /memory?",
      "No. /memory is Claude Code's native inspection and editing surface. Wenlan adds a local work-memory layer for source-backed context and MCP sharing.",
      "When should I use both?",
      "Use both when Claude Code needs its own instructions and your broader AI workflow also needs local, reviewable context across tools.",
    ],
    relatedSlugs: ["claude-code-memory", "how-to-add-memory-to-claude-code", "wenlan-for-claude-code"],
    officialReferences: [
      {
        label: "Claude Code memory docs",
        href: "https://code.claude.com/docs/en/memory",
      },
      {
        label: "Claude Code MCP docs",
        href: "https://code.claude.com/docs/en/mcp",
      },
      {
        label: "Wenlan Claude Code workflow",
        href: "https://wenlan.app/learn/wenlan-for-claude-code",
      },
    ],
  },
  {
    slug: "how-to-give-codex-persistent-memory",
    eyebrow: "Setup",
    category: "Workflows",
    title: "How to Give Codex Persistent Memory",
    description:
      "Connect Codex to Wenlan through MCP so sessions can recall local project context instead of starting from scratch.",
    metaTitle: "How to Give Codex Persistent Memory | Wenlan",
    metaDescription:
      "Use Wenlan with Codex by installing the local runtime, adding the Codex MCP client config, and verifying context, capture, and recall.",
    keywords: [
      "Codex persistent memory",
      "Codex MCP memory",
      "memory for Codex",
      "Wenlan Codex setup",
      "AI coding agent memory Codex",
    ],
    audience: "Codex users working across repeated coding sessions",
    heroBullets: [
      "Install the Wenlan runtime before configuring Codex as an MCP client.",
      "Run ~/.wenlan/bin/wenlan connect codex to write the client config when supported.",
      "Use MCP context, capture, recall, and doctor tools from Codex.",
    ],
    quickAnswer:
      "Set up Wenlan, then run ~/.wenlan/bin/wenlan connect codex. Restart Codex if its MCP settings require a reload, then verify with doctor or a capture/recall round trip.",
    problem:
      "Codex sessions are useful for implementation work, but project decisions, review lessons, and setup gotchas disappear if they only live in the chat transcript.",
    wenlanFit:
      "Wenlan gives Codex a source-backed wiki and shared local context that complement native Codex memories, AGENTS.md, skills, and MCP. The same Wenlan daemon can also serve other clients.",
    actionHeading: "Connect Codex through MCP",
    actionIntro:
      "Use the direct MCP path below when you want Codex working without a Wenlan source checkout. The Wenlan repository also ships a Codex plugin with the shared slash workflow.",
    actionBullets: [
      "Install the local runtime with the current setup path for your operating system.",
      "Run ~/.wenlan/bin/wenlan connect codex.",
      "Restart Codex if the client does not pick up MCP changes live.",
      "Call the doctor tool or run a small capture/recall test.",
      "Use handoff-like captures at the end of serious Codex sessions.",
    ],
    code: {
      label: "Codex MCP setup",
      code: "npx -y wenlan setup\n~/.wenlan/bin/wenlan connect codex",
    },
    caution:
      "The direct MCP path exposes tools such as context and capture. The Codex plugin adds Wenlan slash skills such as /brief and /handoff; do not confuse the two interfaces.",
    faq: [
      "Does Codex share memory with Claude Code in Wenlan?",
      "Yes, when both clients point at the same local Wenlan daemon. The clients differ, but the daemon is the source of truth.",
      "Should I store every Codex transcript?",
      "No. Store the durable parts: decisions, lessons, gotchas, project facts, and handoff context future sessions need.",
    ],
    relatedSlugs: ["mcp-memory-server", "wenlan-codex-workflow", "codex-claude-code-shared-memory"],
    officialReferences: [
      {
        label: "Codex customization docs",
        href: "https://developers.openai.com/codex/concepts/customization",
      },
      {
        label: "OpenAI Docs MCP quickstart",
        href: "https://developers.openai.com/learn/docs-mcp",
      },
    ],
  },
  {
    slug: "how-to-add-mcp-memory-to-cursor",
    eyebrow: "Setup",
    category: "Workflows",
    title: "Cursor Memory MCP: How to Add Local AI Work Memory",
    description:
      "Wire Cursor to Wenlan's local MCP memory server so coding sessions can capture and recall project context.",
    metaTitle: "Cursor Memory MCP Setup | Wenlan",
    metaDescription:
      "Add local-first MCP memory to Cursor with Wenlan setup, wenlan connect cursor, client restart checks, and a capture/recall verification loop.",
    keywords: [
      "Cursor MCP memory",
      "Cursor persistent memory",
      "Cursor AI memory",
      "Cursor memory MCP",
      "Wenlan Cursor setup",
      "MCP memory Cursor",
    ],
    audience: "Cursor users who want local project memory across coding sessions",
    heroBullets: [
      "Wenlan setup installs the local daemon and MCP connector.",
      "wenlan connect cursor writes the Cursor-side MCP configuration when supported.",
      "Cursor can then use Wenlan context, capture, recall, and doctor tools.",
    ],
    quickAnswer:
      "Install Wenlan, then run ~/.wenlan/bin/wenlan connect cursor. Restart Cursor if needed, then verify that Wenlan tools appear and can recall a test capture.",
    problem:
      "Cursor has its own project-scoped Memories and Rules, but those are Cursor-native. The gap appears when you want the same work context available to Claude Code, Codex, Claude Desktop, or another MCP client.",
    wenlanFit:
      "Wenlan keeps durable context in its own local daemon while making it available to Cursor. That keeps the same source-backed context portable to Claude Code, Codex, and other clients later.",
    actionHeading: "Add Cursor as a client",
    actionIntro:
      "Treat Cursor as an MCP client connected to one local Wenlan daemon.",
    actionBullets: [
      "Install the Wenlan runtime once with the current setup path for your operating system.",
      "Run ~/.wenlan/bin/wenlan connect cursor.",
      "The generated Cursor config writes a global ~/.cursor/mcp.json entry.",
      "Restart Cursor if the MCP tools do not appear.",
      "Run the Wenlan doctor tool or a capture/recall round trip.",
      "Capture decisions and handoff context, not raw chat history.",
    ],
    code: {
      label: "Cursor MCP setup",
      code: "npx -y wenlan setup\n~/.wenlan/bin/wenlan connect cursor\n~/.wenlan/bin/wenlan doctor",
    },
    caution:
      "If Cursor and another client both write memory, use spaces when contexts should stay separate. Richer distillation and page synthesis may need a configured local model or API-key path.",
    faq: [
      "Can Cursor and Claude Code use the same Wenlan memory?",
      "Yes. The shared daemon is the point: each configured client can read and write the same Wenlan context.",
      "Does Wenlan require Cursor to upload memory to a cloud service?",
      "No. Wenlan's default model is local-first. Optional model or API-key paths are separate choices for richer distillation.",
    ],
    relatedSlugs: ["mcp-memory-server", "wenlan-cursor-workflow", "cursor-claude-code-shared-memory"],
    officialReferences: [
      {
        label: "Cursor MCP docs",
        href: "https://docs.cursor.com/en/context/model-context-protocol",
      },
      {
        label: "Cursor Memories docs",
        href: "https://docs.cursor.com/en/context/memories",
      },
    ],
  },
  {
    slug: "claude-desktop-mcp-memory-setup",
    eyebrow: "Setup",
    category: "Workflows",
    title: "Claude Desktop MCP Memory Setup with Wenlan",
    description:
      "Connect Claude Desktop to Wenlan's local memory daemon through MCP and verify the first memory loop.",
    metaTitle: "Claude Desktop MCP Memory Setup | Wenlan",
    metaDescription:
      "Set up Claude Desktop with Wenlan MCP memory using the local runtime, wenlan connect claude-desktop, and a doctor/capture/recall check.",
    keywords: [
      "Claude Desktop MCP memory",
      "Claude Desktop memory server",
      "Claude Desktop Wenlan setup",
      "MCP memory Claude Desktop",
      "persistent memory Claude Desktop",
    ],
    audience: "Claude Desktop users adding local MCP memory",
    heroBullets: [
      "Use the MCP-only setup path for Claude Desktop on supported local setups.",
      "Wenlan's daemon remains local on your machine.",
      "Verify with doctor, then capture and recall a harmless durable fact.",
    ],
    quickAnswer:
      "On macOS, install Wenlan and run ~/.wenlan/bin/wenlan connect claude-desktop to write the Claude Desktop MCP config. Restart Claude Desktop, then use Wenlan's doctor and capture/recall tools to verify the local daemon connection.",
    problem:
      "Claude Desktop MCP users often add tools one by one, but memory only becomes useful when captures, retrieval, and maintenance all point at the same local store.",
    wenlanFit:
      "Wenlan gives Claude Desktop a local memory server while preserving the same daemon and artifacts used by coding clients. That makes desktop research or planning available to later coding sessions.",
    actionHeading: "Connect Claude Desktop",
    actionIntro:
      "Use the CLI-generated configuration first; use manual config only when a client needs raw JSON.",
    actionBullets: [
      "Install the local runtime with the current setup path for your operating system.",
      "Run ~/.wenlan/bin/wenlan connect claude-desktop.",
      "Use ~/.wenlan/bin/wenlan connect claude-desktop --dry-run if you want to inspect the JSON before writing it.",
      "Restart Claude Desktop after MCP config changes.",
      "Use the Wenlan MCP doctor tool or the wenlan doctor CLI if tools fail to call the daemon.",
      "Recall a known capture before trusting the setup for real work.",
    ],
    code: {
      label: "Claude Desktop MCP setup",
      code: "npx -y wenlan setup\n~/.wenlan/bin/wenlan connect claude-desktop\n~/.wenlan/bin/wenlan connect claude-desktop --dry-run",
    },
    caution:
      "Do not expose the local daemon beyond loopback unless you are intentionally doing development or self-hosted networking work. Normal desktop setup should stay local.",
    faq: [
      "Is Claude Desktop the same setup as the Claude Code plugin?",
      "No. Claude Desktop uses MCP-only setup. The Claude Code plugin adds slash commands and /setup on top of MCP.",
      "Can Claude Desktop create distilled pages?",
      "It can call Wenlan MCP tools for page distillation when configured. Richer background extraction and page synthesis require a local model or explicit API-key path; readable pages are still written by the local Wenlan daemon.",
    ],
    relatedSlugs: ["wenlan-claude-desktop-workflow", "mcp-memory-server", "local-first-ai-memory"],
    officialReferences: [
      {
        label: "Claude Desktop local MCP docs",
        href: "https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop",
      },
      {
        label: "Anthropic remote MCP connector docs",
        href: "https://support.anthropic.com/en/articles/11175166-getting-started-with-custom-integrations-using-remote-mcp",
      },
    ],
  },
  {
    slug: "ai-agent-memory-local-vs-cloud",
    eyebrow: "Decision",
    category: "Concepts",
    title: "AI Agent Memory: Local vs Cloud",
    description:
      "Choose between local-first memory and hosted memory based on privacy, portability, collaboration, and operational needs.",
    metaTitle: "AI Agent Memory: Local vs Cloud | Wenlan",
    metaDescription:
      "Compare local-first AI agent memory with hosted memory services and learn when Wenlan's local daemon is the right fit.",
    keywords: [
      "local AI agent memory",
      "cloud AI memory",
      "private AI memory",
      "local-first AI work memory",
      "AI memory privacy",
    ],
    audience: "Developers and teams choosing a memory architecture",
    heroBullets: [
      "Local memory keeps project context on your machine by default.",
      "Cloud memory can simplify multi-device collaboration but changes the trust boundary.",
      "Wenlan optimizes for local control, readable artifacts, and MCP portability.",
    ],
    quickAnswer:
      "Use local-first memory when the context is private, project-specific, or needs human-readable control. Use a hosted memory service when centralized collaboration and managed infrastructure matter more than local ownership.",
    problem:
      "Memory contains the parts of work that matter: decisions, preferences, debugging lessons, client context, and project constraints. The storage boundary is therefore a product decision, not an implementation detail.",
    wenlanFit:
      "Wenlan chooses the local-first side. It keeps the daemon, database, Markdown projection, and git history on your machine unless you opt into external model/API paths for richer maintenance.",
    actionHeading: "Choose the boundary",
    actionIntro:
      "Decide based on the sensitivity and collaboration shape of the work.",
    actionBullets: [
      "Choose local-first for private repos, client work, personal preferences, and inspectable artifacts.",
      "Choose hosted memory when many users need central access with account-level governance.",
      "Use MCP when you want many clients to talk to one memory boundary.",
      "Document what leaves the machine before adding API keys or cloud sync.",
      "Compare backup, export, deletion, offline access, team sharing, and lock-in before deciding.",
    ],
    caution:
      "Local-first keeps Wenlan's memory layer local by default, but connected AI tools may still send prompts and retrieved context to their own model providers. You still need backup, migration, and delete habits if the memory becomes important.",
    faq: [
      "Is local-first memory always better?",
      "No. It is better for control and privacy, but hosted systems may be better for managed team collaboration.",
      "Does Wenlan sync memory to the cloud by default?",
      "No. Wenlan has no cloud sync or telemetry by default. Optional models and API keys are explicit choices.",
    ],
    relatedSlugs: ["local-first-ai-memory", "wenlan-vs-chatgpt-memory", "wenlan-vs-mem0"],
    officialReferences: [
      {
        label: "Wenlan data and privacy docs",
        href: "https://wenlan.app/docs/data-and-privacy",
      },
    ],
  },
  {
    slug: "ai-coding-agent-loses-context",
    eyebrow: "Problem",
    category: "Concepts",
    title: "Why AI Coding Agents Lose Context Between Sessions",
    description:
      "Diagnose context loss after a fresh session, compaction, or tool switch, then choose resume, project instructions, handoffs, or durable memory.",
    metaTitle: "AI Coding Agent Context Loss: Causes and Fixes | Wenlan",
    metaDescription:
      "Diagnose why AI coding agents lose context between sessions and choose the right fix: resume, project instructions, handoffs, or durable memory.",
    keywords: [
      "AI coding agent loses context",
      "AI coding agent context loss",
      "Claude Code loses context",
      "Claude Code context between sessions",
      "Claude Code auto memory",
      "AI agent session handoff",
    ],
    publishedAt: "2026-06-06",
    updatedAt: "2026-07-25",
    audience: "Developers diagnosing repeated AI session warmup",
    heroBullets: [
      "Resume recovers one saved conversation; it does not create shared knowledge across tools.",
      "Project instructions and native auto memory solve different problems from handoffs.",
      "Diagnose the missing layer before adding more prompt text or transcript storage.",
    ],
    quickAnswer:
      "First identify what disappeared. If you need the exact previous conversation, resume the native session. If a persistent rule or architecture fact is missing, verify the client’s project instructions or native memory. If decisions, failed paths, and open work must survive a fresh session or tool switch, write a handoff and store the durable knowledge.",
    problem:
      "Context loss is not one failure. A fresh session starts without the prior conversation. Compaction can summarize away decision rationale or failed paths. Native project memory may be scoped to one client, repository, or machine. Source files show what changed but often not why, while an overloaded memory file can bury the fact the agent needs.",
    wenlanFit:
      "Wenlan does not replace a client’s resume command or project instructions. It provides a shared memory boundary for durable decisions, lessons, gotchas, handoffs, and maintained pages that multiple configured clients can reach through the same local daemon.",
    actionHeading: "Run the context-loss diagnosis",
    actionIntro:
      "Match the symptom to the smallest recovery path before storing more text.",
    actionBullets: [
      "Exact conversation missing: resume the saved native session before reconstructing it from memory.",
      "Persistent instruction missing: verify that the client loaded the correct project instructions, rules, or native memory files.",
      "Compaction lost rationale: persist the decision, failed path, or open thread before the active context is summarized.",
      "Tool switch lost knowledge: use a shared memory boundary instead of copying one client’s private session store.",
      "Repository state is clear but the why is missing: retrieve the decision or handoff rather than asking the agent to infer history from the diff.",
      "Recall returns stale or noisy context: check scope and provenance, then correct or supersede the durable fact instead of adding another duplicate.",
    ],
    code: {
      label: "Wenlan continuity loop",
      code: "/brief\n/recall <specific decision or gotcha>\n/capture <one durable fact and why it matters>\n/handoff",
    },
    caution:
      "Do not use durable memory as a second transcript archive. Native resume is the strongest recovery path for one exact conversation; project instructions are the right home for standing behavior; durable memory should keep only context that remains useful after the session ends.",
    faq: [
      "Should I resume a session or use durable memory?",
      "Resume when you need the exact conversation and tool history. Use durable memory for decisions, lessons, constraints, and open work that should remain useful in later sessions or other configured clients.",
      "Can Claude Code auto memory replace a shared memory layer?",
      "Claude Code auto memory is useful native project memory and is shared across worktrees of the same repository. It does not automatically become a shared memory boundary for Cursor, Codex, or other MCP clients.",
    ],
    relatedSlugs: [
      "claude-code-memory",
      "claude-code-session-handoff",
      "persistent-project-context-for-ai-agents",
      "ai-agent-memory-types",
    ],
    officialReferences: [
      {
        label: "Claude Code memory",
        href: "https://code.claude.com/docs/en/memory",
      },
      {
        label: "Claude Code sessions",
        href: "https://code.claude.com/docs/en/sessions",
      },
      {
        label: "Wenlan daily workflow",
        href: "https://wenlan.app/docs/daily-workflow",
      },
      {
        label: "Wenlan capture quality",
        href: "https://wenlan.app/docs/capture-quality",
      },
      {
        label: "Wenlan MCP clients",
        href: "https://wenlan.app/docs/mcp-clients",
      },
    ],
  },
  {
    slug: "persistent-project-context-for-ai-agents",
    eyebrow: "Concept",
    category: "Concepts",
    title: "Persistent Project Context for AI Agents",
    description:
      "Keep project decisions, constraints, and handoffs available across Claude Code, Cursor, Codex, and other AI tools.",
    metaTitle: "Persistent Project Context for AI Agents | Wenlan",
    metaDescription:
      "Learn what persistent project context means for AI agents and how Wenlan keeps decisions, lessons, handoffs, and pages available locally.",
    keywords: [
      "persistent project context",
      "AI agent project context",
      "persistent context AI agents",
      "project memory AI coding",
      "Wenlan project context",
    ],
    audience: "Developers using multiple local AI tools on multi-session projects",
    heroBullets: [
      "Persistent context is more than a saved prompt.",
      "It includes decisions, constraints, gotchas, project status, and source-backed pages.",
      "Wenlan keeps that context local and retrievable through MCP.",
    ],
    quickAnswer:
      "Persistent project context is the durable working state an AI agent needs to continue a project later: what changed, what was decided, what to avoid, and where the source of truth lives.",
    problem:
      "Projects rarely fail because the agent forgot generic programming knowledge. They fail because it forgot local decisions: which tradeoff won, which migration was risky, which command proved the fix, or which feature is out of scope.",
    wenlanFit:
      "Wenlan stores that local work context as memories, session handoffs, project status, and distilled pages. It is not full transcript archival; MCP clients retrieve the relevant pieces instead of forcing the user to paste a project briefing every time.",
    actionHeading: "Capture project context",
    actionIntro:
      "Focus memory on a project context packet a future agent cannot infer cheaply.",
    actionBullets: [
      "Start with /brief in Claude Code or Wenlan context from an MCP client.",
      "Capture decisions and why they were chosen.",
      "Capture gotchas that would waste time if rediscovered.",
      "Capture source-of-truth files, current status, stale facts, and constraints when they are not obvious from the repo.",
      "Use /recall for specific prior decisions instead of asking the model to guess.",
      "Capture project status at session end with /handoff or a handoff-style MCP capture.",
      "Distill repeated clusters into pages when a topic keeps returning.",
    ],
    code: {
      label: "Claude Code daily loop",
      code: "/brief\n/capture <one durable project fact and why it matters>\n/recall <specific prior decision or gotcha>\n/handoff",
    },
    caution:
      "Do not store facts that the repo can read directly unless the important part is the reasoning behind them.",
    faq: [
      "Is persistent project context a README replacement?",
      "No. README files document public or contributor-facing facts. Wenlan carries session-level working context that changes while AI work happens.",
      "Can multiple tools share one project context?",
      "Yes, when they are configured to use the same local Wenlan daemon. That means local cross-tool continuity, not automatic cloud or team sync.",
    ],
    relatedSlugs: ["mcp-memory-server", "ai-agent-project-status-handoff", "source-backed-wiki-pages-ai-work"],
    officialReferences: [
      {
        label: "Wenlan daily workflow docs",
        href: "https://wenlan.app/docs/daily-workflow",
      },
      {
        label: "Wenlan core concepts docs",
        href: "https://wenlan.app/docs/core-concepts",
      },
      {
        label: "Wenlan MCP clients docs",
        href: "https://wenlan.app/docs/mcp-clients",
      },
    ],
  },
  {
    slug: "mcp-memory-server-localhost-7878",
    eyebrow: "Setup",
    category: "Concepts",
    title: "MCP Memory Server on localhost:7878: What to Check",
    description:
      "Understand the local daemon boundary behind Wenlan's MCP memory tools and how to troubleshoot port 7878.",
    metaTitle: "MCP Memory Server on localhost:7878 | Wenlan",
    metaDescription:
      "Debug Wenlan's local MCP memory server on 127.0.0.1:7878: daemon status, wenlan-mcp config, client restart, and doctor checks.",
    keywords: [
      "127.0.0.1 7878 Wenlan",
      "Wenlan daemon port",
      "MCP memory server localhost",
      "MCP server localhost 7878",
      "wenlan-mcp 7878",
      "wenlan-server 7878",
      "Wenlan doctor",
    ],
    audience: "Developers debugging MCP memory setup",
    heroBullets: [
      "The daemon is the local source of truth.",
      "MCP clients talk through wenlan-mcp to reach that daemon.",
      "doctor and status are the first checks when port 7878 fails.",
    ],
    quickAnswer:
      "Wenlan's daemon listens on 127.0.0.1:7878 by default. MCP clients do not talk to the database directly; they launch wenlan-mcp, and wenlan-mcp talks to the local daemon.",
    problem:
      "When MCP memory setup fails, users often see only a missing tool or a connection error. The real issue is usually daemon reachability, MCP configuration, or a client restart requirement.",
    wenlanFit:
      "Wenlan keeps this boundary explicit. The daemon owns storage and retrieval, while Claude Code, Cursor, Codex, and other clients call tools through the MCP connector.",
    actionHeading: "Debug port 7878",
    actionIntro:
      "Check the daemon before changing every client setting.",
    actionBullets: [
      "Run ~/.wenlan/bin/wenlan status.",
      "Run ~/.wenlan/bin/wenlan doctor for a fuller setup report.",
      "Run ~/.wenlan/bin/wenlan connect <client> --dry-run to inspect the wenlan-mcp command the client should launch.",
      "Run lsof -nP -iTCP:7878 -sTCP:LISTEN and identify which process owns the port before changing client settings.",
      "Restart the MCP client after config changes.",
      "Make sure another development daemon is not owning the wrong data directory.",
    ],
    code: {
      label: "Daemon and MCP checks",
      code: "~/.wenlan/bin/wenlan status\n~/.wenlan/bin/wenlan doctor\n~/.wenlan/bin/wenlan connect codex --dry-run\nlsof -nP -iTCP:7878 -sTCP:LISTEN",
    },
    caution:
      "Loopback avoids LAN exposure, but 127.0.0.1:7878 is still sensitive local access to a memory API. Do not bind the daemon to a non-loopback address unless you are intentionally doing development or self-hosted networking, and redact memory contents from diagnostics.",
    faq: [
      "Can I change the daemon port?",
      "Yes for development, but the daemon port, bind address, CLI target, and MCP connector target are separate settings. Non-default ports should update the daemon and connector together, usually with an isolated data dir.",
      "Why not let each MCP client store its own memory?",
      "Because separate stores fragment context. Wenlan uses one daemon so tools share the same source of truth.",
    ],
    relatedSlugs: ["mcp-memory-server", "how-to-give-codex-persistent-memory", "how-to-add-mcp-memory-to-cursor"],
    officialReferences: [
      {
        label: "Wenlan CLI and service docs",
        href: "https://wenlan.app/docs/cli-and-service",
      },
      {
        label: "Wenlan MCP clients docs",
        href: "https://wenlan.app/docs/mcp-clients",
      },
      {
        label: "Wenlan troubleshooting docs",
        href: "https://wenlan.app/docs/troubleshooting",
      },
      {
        label: "Wenlan configuration docs",
        href: "https://wenlan.app/docs/configuration",
      },
      {
        label: "Wenlan security docs",
        href: "https://wenlan.app/docs/security",
      },
    ],
  },
  {
    slug: "what-to-capture-in-ai-work-memory",
    eyebrow: "Capture",
    category: "Concepts",
    title: "What to Capture in AI Work Memory",
    description:
      "Use a simple test for deciding what belongs in Wenlan and what should stay out of memory.",
    metaTitle: "What to Capture in AI Work Memory | Wenlan",
    metaDescription:
      "Capture decisions, lessons, gotchas, preferences, constraints, and durable facts in Wenlan. Skip logs, filler, and facts the repo can derive.",
    keywords: [
      "what to capture in AI memory",
      "AI work memory capture",
      "Wenlan capture",
      "Claude Code capture",
      "memory capture quality",
    ],
    audience: "Wenlan users building better memory habits",
    heroBullets: [
      "Capture one durable idea at a time.",
      "Include why the fact matters for future sessions.",
      "Skip raw logs, filler, and temporary status.",
    ],
    quickAnswer:
      "Capture something when a future AI session would waste time or make a worse decision without it. Good captures are durable, atomic, specific, and include the reason.",
    problem:
      "Most memory systems get noisy when users store everything. AI work memory should not become a junk drawer of transcripts, logs, and temporary todos.",
    wenlanFit:
      "Wenlan's canonical memory types are identity, preference, decision, lesson, gotcha, and fact. Constraints and corrections are still valid capture content, but they usually become one of those types: a project constraint may be a fact or decision, and a correction should name what it supersedes.",
    actionHeading: "Use the capture test",
    actionIntro:
      "Before capturing, ask whether this fact will change a future AI session.",
    actionBullets: [
      "Capture decisions and why the chosen path won.",
      "Capture gotchas that would cause repeated debugging.",
      "Capture corrections when previous memory is stale or wrong.",
      "Capture project constraints that are not obvious from source files.",
      "Skip raw output; capture the durable conclusion, root cause, error signature, or command that proved the fix when future agents need it.",
    ],
    code: {
      label: "Capture examples",
      code: "/capture We chose source-backed pages because summaries need provenance.\n/capture Gotcha: wenlan-mcp must talk to the local daemon on 127.0.0.1:7878.\n/capture Supersedes mem_abc123: Windows setup now uses a Task Scheduler ONLOGON task.\n\nBad: /capture worked on repo\nBetter: /capture Wenlan docs now separate Learn SEO articles from product setup docs because users need different navigation paths.\n\nBad: /capture tests failed\nBetter: /capture Gotcha: pnpm build fails if Learn relatedSlugs point to missing article slugs; run the slug audit before build.",
    },
    caution:
      "If a source file is already the authority, do not duplicate the file into memory. Capture the reasoning or consequence instead.",
    faq: [
      "Should I capture every meeting note or chat summary?",
      "No. Capture the durable decisions, constraints, and follow-ups that should affect future AI work.",
      "What if I captured the wrong thing?",
      "Recall or find the old memory ID, capture a corrected self-contained statement, and name what it supersedes. Use forget only when the old record should not remain.",
    ],
    relatedSlugs: ["persistent-project-context-for-ai-agents", "review-before-trust-ai-memory", "ai-memory-provenance"],
    officialReferences: [
      {
        label: "Wenlan capture quality docs",
        href: "https://wenlan.app/docs/capture-quality",
      },
      {
        label: "Wenlan daily workflow docs",
        href: "https://wenlan.app/docs/daily-workflow",
      },
    ],
  },
];

const workflowArticles: BaseSpec[] = [
  {
    slug: "wenlan-codex-workflow",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "Wenlan Workflow for Codex",
    description:
      "Use Wenlan with Codex for session context, durable captures, recall, and cross-tool handoff.",
    metaTitle: "Wenlan Workflow for Codex | Persistent AI Work Memory",
    metaDescription:
      "A practical Wenlan workflow for Codex users: connect MCP, load context, capture decisions, recall project memory, and hand off to future sessions.",
    keywords: [
      "Wenlan Codex workflow",
      "Codex memory workflow",
      "Codex MCP memory",
      "persistent context Codex",
      "Codex handoff",
    ],
    audience: "Codex users who want repeated sessions to compound",
    heroBullets: [
      "Use MCP context at the start of a Codex session.",
      "Capture durable project facts while implementation choices are fresh.",
      "Recall and capture handoff-style context through Wenlan so future Codex or Claude Code sessions can continue.",
    ],
    quickAnswer:
      "In Codex, use Wenlan to load context, capture decisions and gotchas, recall specific prior work, and leave a handoff before ending. The plugin and direct MCP paths reach the same daemon.",
    problem:
      "Codex can inspect a repo, but it cannot infer why prior sessions chose a tradeoff or which external constraint mattered unless that context is recorded.",
    wenlanFit:
      "Wenlan gives Codex a local shared context layer rather than a Codex-only note. Native Codex Memories and AGENTS.md help Codex itself; Wenlan MCP memory is the shared daemon layer that Claude Code, Cursor, and other clients can also use.",
    actionHeading: "Run the Codex loop",
    actionIntro:
      "Keep the loop short enough to use during real work.",
    actionBullets: [
      "Call context when starting a task or switching topics.",
      "Capture decisions, gotchas, and project constraints as atomic memories.",
      "Use recall with project names and failure modes.",
      "Capture a handoff before stopping if work remains open.",
    ],
    caution:
      "Avoid generic captures such as 'worked on repo.' Name the concrete decision, file area, or gotcha that future Codex sessions should know.",
    faq: [
      "Can Codex write the same memory store as Claude Code?",
      "Yes. Both can use the same local daemon when configured.",
      "Does Codex get /brief and /handoff slash commands?",
      "No. Codex uses MCP tools. The slash-command workflow belongs to the Claude Code plugin.",
    ],
    relatedSlugs: ["coding-agent-source-backed-knowledge-base", "how-to-give-codex-persistent-memory", "codex-claude-code-shared-memory", "what-to-capture-in-ai-work-memory"],
    officialReferences: [
      {
        label: "Codex Memories docs",
        href: "https://developers.openai.com/codex/memories",
      },
      {
        label: "Codex MCP docs",
        href: "https://developers.openai.com/codex/mcp",
      },
    ],
  },
  {
    slug: "coding-agent-source-backed-knowledge-base",
    eyebrow: "Coding agent knowledge",
    category: "Workflows",
    title: "How to Give Codex a Source-Backed Project Knowledge Base",
    description:
      "Keep repository rules, source-of-truth documents, and maintained project knowledge separate so Codex can retrieve evidence without loading everything.",
    metaTitle: "Codex Source-Backed Project Knowledge Base | Wenlan",
    metaDescription:
      "Build a source-backed project knowledge base for Codex or another coding agent with AGENTS.md, maintained docs, citations, retrieval, and verification.",
    keywords: [
      "Codex knowledge base",
      "coding agent knowledge base",
      "Codex project knowledge",
      "source backed knowledge base for AI agents",
      "AGENTS.md knowledge base",
      "Claude Code project knowledge base",
    ],
    publishedAt: "2026-08-23",
    updatedAt: "2026-09-04",
    audience: "Developers who want Codex or another coding agent to reuse trustworthy project knowledge",
    heroBullets: [
      "Keep AGENTS.md or CLAUDE.md short and reserve it for instructions the agent must load every time.",
      "Keep code, tests, specifications, and maintained documents as the source of truth.",
      "Retrieve only the relevant cited page, then verify the conclusion against the repository and tests.",
    ],
    quickAnswer:
      "Use AGENTS.md or CLAUDE.md for short operating instructions, keep repository files as the source of truth for current facts, and use a source-backed knowledge base for decisions and explanations that must remain cited, reviewable, and reusable across sessions.",
    problem:
      "A giant instruction file consumes context and becomes stale, while raw repository search repeatedly rediscovers the same architecture decisions and external constraints. A coding agent needs a small always-loaded contract plus an on-demand, source-backed project knowledge layer.",
    wenlanFit:
      "Wenlan keeps Sources, atomic knowledge, and maintained Pages separate. Codex can connect to the local daemon, retrieve a relevant Page, inspect its citations, and share the same reviewed project knowledge with Claude Code or another MCP client.",
    actionHeading: "Use AGENTS.md and the knowledge base for different jobs",
    actionIntro:
      "Start with one bounded project topic and one inspectable document set. The slash commands below require the Wenlan Codex plugin: install it and run /setup once. The wenlan connect codex command configures the MCP connection only; MCP-only clients should use the equivalent Wenlan tools instead of slash commands. Then prove the complete read, cite, verify, and refresh loop before adding more material.",
    actionBullets: [
      "Put build commands, repository boundaries, and non-obvious rules in AGENTS.md or CLAUDE.md.",
      "Keep code, tests, specifications, and first-party docs authoritative; do not copy facts the agent can read directly.",
      "Add only supported Markdown, text, text-extractable PDF, or Obsidian sources to the maintained knowledge layer.",
      "Distill one repeated question into a Page, then verify that each important claim is actually supported by the cited passage; a valid source ID is only a pointer, not proof.",
      "Change one source the Page already cites and verify that the Page becomes stale before trusting the workflow. Adding a separate superseding record can preserve history without updating that Page, so lint and review are still required.",
    ],
    code: {
      label: "One bounded Codex knowledge workflow",
      code: "wenlan status\nwenlan connect codex\nwenlan sources add ~/project/docs\n/distill <project topic>\n/pages <project topic>\n/lint\n/curate",
    },
    caution:
      "Do not turn the knowledge base into a second copy of the repository. If the answer is already clear in current code or tests, link to that source; maintain only the reasoning, external constraint, or cross-file conclusion that is expensive to reconstruct.",
    faq: [
      "Should AGENTS.md contain the whole project knowledge base?",
      "No. Keep it short and always relevant. Put longer explanations in maintained documents or on-demand knowledge pages so they do not crowd out the task and current code.",
      "Can the knowledge base override the repository?",
      "No. Current code, tests, specifications, and approved first-party documents remain authoritative. A citation does not prove that the prose follows from its source. When a cited source changes, verify that the Page is marked stale, then rebuild and review it before reuse.",
    ],
    relatedSlugs: [
      "wenlan-codex-workflow",
      "source-backed-wiki-pages-ai-work",
      "build-local-ai-knowledge-base-from-documents",
      "when-ai-agent-should-query-knowledge-base",
      "review-before-trust-ai-memory",
    ],
    officialReferences: [
      {
        label: "OpenAI harness engineering",
        href: "https://openai.com/index/harness-engineering/",
      },
      {
        label: "AGENTS.md open format",
        href: "https://agents.md/",
      },
      {
        label: "Wenlan setup with AI clients",
        href: "https://github.com/7xuanlu/wenlan/blob/main/docs/setup-with-ai.md",
      },
      {
        label: "Wenlan source-backed Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Wenlan review and trust",
        href: "https://wenlan.app/docs/review-and-trust",
      },
    ],
    cta: {
      heading: "Give Codex one project topic it can verify",
      body: "Connect Codex, add one inspectable source set, and prove that the resulting Page stays cited, reviewable, and subordinate to the repository.",
    },
  },
  {
    slug: "wenlan-cursor-workflow",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "Wenlan Workflow for Cursor",
    description:
      "Use Wenlan from Cursor to keep project memory available across edits, branches, and future AI sessions.",
    metaTitle: "Wenlan Workflow for Cursor | Local AI Work Memory",
    metaDescription:
      "A Cursor workflow for Wenlan: connect MCP, load context, capture decisions, recall prior work, and share memory with Claude Code or Codex.",
    keywords: [
      "Wenlan Cursor workflow",
      "Cursor memory workflow",
      "Cursor MCP memory",
      "persistent Cursor context",
      "Cursor AI work memory",
    ],
    audience: "Cursor users working on projects over multiple sessions",
    heroBullets: [
      "Connect Cursor to Wenlan's MCP connector, which talks to the local daemon.",
      "Capture decisions while editing instead of after the context is gone.",
      "Use the same memory from Claude Code or Codex later.",
    ],
    quickAnswer:
      "Use Wenlan in Cursor as a local project-memory companion outside the editor: ask Cursor Agent to use Wenlan context, capture durable changes, recall previous decisions, and keep handoff facts available for other tools.",
    problem:
      "Cursor has native Memories and Rules for Cursor-scoped context. Wenlan's role is different: keep inspectable local work memory available to Cursor, Claude Code, Codex, and other MCP clients through one daemon.",
    wenlanFit:
      "Wenlan fills that gap with a source-backed system outside the editor. Cursor can use the same decisions, pages, and handoffs as other MCP clients.",
    actionHeading: "Use Cursor with a memory habit",
    actionIntro:
      "Add memory at the points where future confusion is likely.",
    actionBullets: [
      "Ask Cursor Agent to use Wenlan context before a meaningful feature or bugfix, approving the MCP tool call if prompted.",
      "Capture why a design path was chosen.",
      "Capture build, CI, or setup gotchas after verifying them.",
      "Recall by feature name, error string, or project decision.",
      "Use spaces if Cursor projects should not share context.",
    ],
    caution:
      "Do not make Wenlan a second task tracker. Store durable context for future agents, not every temporary edit in the current branch.",
    faq: [
      "Why use Wenlan if Cursor can read files?",
      "Cursor-native memory helps inside Cursor. Wenlan keeps inspectable, local, cross-client work memory outside the editor so Claude Code, Codex, and other MCP clients can use the same context.",
      "Can Cursor use distilled pages?",
      "Yes, once pages have been created through Wenlan's distill/page workflow. Cursor can retrieve them through Wenlan MCP.",
    ],
    relatedSlugs: ["how-to-add-mcp-memory-to-cursor", "cursor-claude-code-shared-memory", "mcp-memory-server-localhost-7878"],
    officialReferences: [
      {
        label: "Cursor MCP docs",
        href: "https://cursor.com/docs/mcp",
      },
      {
        label: "Cursor Memories docs",
        href: "https://docs.cursor.com/en/context/memories",
      },
    ],
  },
  {
    slug: "wenlan-claude-desktop-workflow",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "Wenlan Workflow for Claude Desktop",
    description:
      "Use Claude Desktop with Wenlan MCP memory for planning, research, and handoff context that later coding agents can reuse.",
    metaTitle: "Wenlan Workflow for Claude Desktop | MCP Memory",
    metaDescription:
      "Claude Desktop can use Wenlan through MCP to capture planning decisions, recall local context, and share memory with coding tools.",
    keywords: [
      "Wenlan Claude Desktop workflow",
      "Claude Desktop memory workflow",
      "Claude Desktop MCP memory",
      "Claude Desktop persistent memory",
      "Wenlan MCP Claude Desktop",
    ],
    audience: "Claude Desktop users who plan or research before coding",
    heroBullets: [
      "Use Claude Desktop for planning while Wenlan stores durable decisions locally.",
      "Capture research outcomes that coding agents should use later.",
      "Recall captured decisions or existing distilled pages instead of asking future sessions to reread everything.",
    ],
    quickAnswer:
      "Claude Desktop works best with Wenlan after it is connected to the same local daemon and relevant space as your coding clients. Capture planning outcomes and project decisions that later coding sessions should inherit.",
    problem:
      "Planning often happens in Claude Desktop, while implementation happens in Claude Code, Cursor, or Codex. Without shared memory, the handoff depends on manual copy-paste.",
    wenlanFit:
      "Wenlan makes planning output available through the local daemon. A later coding agent can recall the same decision record or existing distilled page when it is configured against the same daemon and space.",
    actionHeading: "Capture planning context",
    actionIntro:
      "Use Claude Desktop for high-level reasoning, then save the durable results.",
    actionBullets: [
      "First connect Claude Desktop with npx -y wenlan setup, ~/.wenlan/bin/wenlan connect claude-desktop, a Claude Desktop restart, and doctor/capture/recall verification.",
      "Capture selected plans and rejected alternatives.",
      "Capture constraints that implementation agents must respect.",
      "Distill repeated research into a page when page synthesis is configured and the topic will guide future work.",
      "Recall from the coding client before implementation begins.",
    ],
    caution:
      "Do not capture every paragraph of a planning conversation. Save the outcome, assumptions, and consequences.",
    faq: [
      "Is Claude Desktop required for Wenlan?",
      "No. It is one MCP client path. Wenlan can also serve Claude Code, Cursor, Codex, Gemini CLI, VS Code, and others.",
      "Does Claude Desktop support Wenlan slash commands?",
      "No. Claude Desktop uses MCP tools. Wenlan slash commands like /brief, /handoff, /distill, and /setup are part of the Claude Code plugin workflow.",
    ],
    relatedSlugs: ["claude-desktop-mcp-memory-setup", "persistent-project-context-for-ai-agents", "what-to-capture-in-ai-work-memory"],
    officialReferences: [
      {
        label: "Claude Desktop local MCP docs",
        href: "https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop",
      },
      {
        label: "Anthropic remote MCP connector docs",
        href: "https://support.anthropic.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp",
      },
    ],
  },
  {
    slug: "wenlan-gemini-cli-workflow",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "Wenlan Workflow for Gemini CLI",
    description:
      "Connect Gemini CLI as an MCP client and use Wenlan for local capture, recall, and handoff-style notes.",
    metaTitle: "Wenlan Workflow for Gemini CLI | MCP Memory",
    metaDescription:
      "Use Wenlan's local MCP path with Gemini CLI for context, capture, recall, and cross-session handoffs.",
    keywords: [
      "Gemini CLI memory",
      "Gemini CLI MCP memory",
      "Wenlan Gemini CLI",
      "persistent memory Gemini CLI",
      "AI CLI memory workflow",
    ],
    audience: "Gemini CLI users adding persistent local memory",
    heroBullets: [
      "Gemini CLI can use the same Wenlan daemon through MCP.",
      "Capture durable facts from command-line work.",
      "Recall context from other Wenlan-connected clients.",
    ],
    quickAnswer:
      "Set up Wenlan, add Gemini CLI as an MCP client, verify with gemini mcp list or /mcp list, and ask Gemini to use the Wenlan MCP tools for context, capture, recall, and doctor checks.",
    problem:
      "CLI sessions are especially easy to lose. A useful command, setup gotcha, or verified diagnosis disappears unless it is captured while the evidence is fresh.",
    wenlanFit:
      "Wenlan keeps those durable lessons in the same local store used by GUI and coding clients, so terminal work can feed later AI sessions.",
    actionHeading: "Use Gemini CLI with Wenlan",
    actionIntro:
      "Treat the CLI as another surface over the same Wenlan daemon.",
    actionBullets: [
      "Run Wenlan setup before adding the client.",
      "Make sure Gemini CLI is installed and on PATH.",
      "Add Gemini CLI with ~/.wenlan/bin/wenlan connect gemini.",
      "Verify with gemini mcp list or /mcp list inside Gemini CLI.",
      "Ask Gemini to use Wenlan MCP tools such as mcp_wenlan_context or mcp_wenlan_capture.",
      "Capture verified setup and debugging lessons.",
      "Recall by command, error string, or project name.",
      "Capture a concise handoff-style note before ending a CLI session that future agents may continue.",
    ],
    code: {
      label: "Gemini CLI MCP setup",
      code: "npx -y wenlan setup\n~/.wenlan/bin/wenlan connect gemini\ngemini mcp list",
    },
    caution:
      "Avoid capturing raw terminal output. Store the conclusion and the command that proved it when that matters. Wenlan uses Gemini's user-scope MCP setup; use project-scope or manual Gemini config only for isolated experiments.",
    faq: [
      "Can Gemini CLI share memory with Cursor or Codex?",
      "Yes, if all clients are configured to use the same Wenlan daemon.",
      "What should command-line sessions capture?",
      "Capture verified commands, setup gotchas, environment constraints, and handoff notes that future agents need.",
    ],
    relatedSlugs: ["mcp-memory-server", "mcp-memory-server-localhost-7878", "what-to-capture-in-ai-work-memory"],
    officialReferences: [
      {
        label: "Gemini CLI MCP server docs",
        href: "https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md",
      },
      {
        label: "Gemini CLI configuration docs",
        href: "https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md",
      },
      {
        label: "Wenlan MCP clients docs",
        href: "https://wenlan.app/docs/mcp-clients",
      },
    ],
  },
  {
    slug: "wenlan-vscode-mcp-workflow",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "Wenlan Workflow for VS Code MCP Clients",
    description:
      "Use Wenlan as a local memory server from VS Code surfaces that support MCP.",
    metaTitle: "Wenlan Workflow for VS Code MCP Clients | Wenlan",
    metaDescription:
      "Connect VS Code MCP clients to Wenlan and use one source-backed context system for capture, recall, and project handoff.",
    keywords: [
      "VS Code MCP memory",
      "VS Code AI memory",
      "Wenlan VS Code workflow",
      "persistent memory VS Code",
      "MCP memory VS Code",
    ],
    audience: "VS Code users with MCP-compatible AI tools",
    heroBullets: [
      "Wenlan treats VS Code as another MCP client surface.",
      "The daemon remains local and shared with other tools.",
      "Use capture and recall around real project decisions.",
    ],
    quickAnswer:
      "If your VS Code AI surface supports MCP, connect it to Wenlan with the MCP-only setup path and use the same memory loop as other clients.",
    problem:
      "VS Code is often the center of coding work, but the AI context still fragments when terminal sessions, Claude Code runs, and editor chats each remember different things.",
    wenlanFit:
      "Wenlan keeps context in its local daemon instead of any one interface. VS Code can participate without becoming the only place where context exists.",
    actionHeading: "Connect the VS Code surface",
    actionIntro:
      "Use the supported MCP client path rather than hand-editing memory.",
    actionBullets: [
      "Run npx -y wenlan setup.",
      "From the workspace root, run ~/.wenlan/bin/wenlan connect vscode; it writes .vscode/mcp.json with servers.wenlan.",
      "Use ~/.wenlan/bin/wenlan connect vscode --dry-run to preview the workspace config before writing.",
      "In VS Code, confirm MCP server trust, use MCP: List Servers to start or restart the server, and enable/select Wenlan tools in Chat or Agent mode.",
      "Verify with doctor or capture/recall.",
      "Use spaces for separate project buckets.",
    ],
    code: {
      label: "VS Code workspace MCP setup",
      code: "npx -y wenlan setup\n~/.wenlan/bin/wenlan connect vscode\n~/.wenlan/bin/wenlan connect vscode --dry-run",
    },
    caution:
      "Client MCP support changes over time. Prefer Wenlan's generated config or dry-run output over copying stale snippets from old docs. VS Code Remote and Dev Containers run MCP servers where configured; install or configure Wenlan in the remote environment or handle localhost forwarding intentionally.",
    faq: [
      "Does Wenlan replace VS Code settings or workspace files?",
      "No. Wenlan adds a memory service that AI clients can call. It does not replace source-controlled project documentation.",
      "Can VS Code memories be inspected later?",
      "Raw captures are inspectable through Wenlan tools. Generated pages and handoffs are readable under ~/.wenlan and versioned locally.",
    ],
    relatedSlugs: ["mcp-memory-server", "persistent-project-context-for-ai-agents", "mcp-memory-server-localhost-7878"],
    officialReferences: [
      {
        label: "VS Code MCP configuration",
        href: "https://code.visualstudio.com/docs/agents/reference/mcp-configuration",
      },
      {
        label: "VS Code MCP server management",
        href: "https://code.visualstudio.com/docs/agent-customization/mcp-servers",
      },
    ],
  },
  {
    slug: "claude-code-session-handoff",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "Claude Code Session Handoff with Wenlan",
    description:
      "Close Claude Code sessions with enough context for the next agent to resume without replaying the chat.",
    metaTitle: "Claude Code Session Handoff | Wenlan",
    metaDescription:
      "Use Wenlan /handoff in Claude Code to preserve decisions, lessons, gotchas, open threads, and project status for the next session.",
    keywords: [
      "Claude Code handoff",
      "Claude Code session handoff",
      "Wenlan handoff",
      "AI agent handoff",
      "Claude Code project status",
    ],
    audience: "Claude Code users doing multi-session work",
    heroBullets: [
      "/handoff writes a Markdown session log and updates project status.",
      "Durable decisions, lessons, gotchas, and facts become MCP captures.",
      "/brief reads the handoff-maintained status file before loading Wenlan context.",
    ],
    quickAnswer:
      "Run /handoff before ending meaningful Claude Code work. It writes a Markdown session log, updates project status, and stores durable decisions, lessons, gotchas, and facts as MCP captures.",
    problem:
      "A session can end with working code but no durable explanation. The next agent may repeat old investigation or miss the reason a path was chosen.",
    wenlanFit:
      "Wenlan turns session ending into a concrete artifact boundary. The session log preserves the narrative thread, the status file tracks Active and Backlog work, and granular captures become searchable memory.",
    actionHeading: "Write a useful handoff",
    actionIntro:
      "Keep it action-oriented and grounded in what changed.",
    actionBullets: [
      "Let /handoff preview pending captures from the current session before closing.",
      "Confirm the resolved space so the next session searches the right project context.",
      "Let the skill scan git context since the last handoff when the cwd is a repo.",
      "State the goal and current status.",
      "Capture decisions and why they were made.",
      "Record gotchas or failed paths future agents should avoid.",
      "Name open threads, Active work, Backlog items, and next steps.",
      "Mention files or commands only when they orient the next agent and are not obvious from git.",
      "Start the next session with /brief; it reads the handoff-maintained status file, then loads relevant Wenlan context.",
    ],
    code: {
      label: "What /handoff writes",
      code: "~/.wenlan/sessions/<date>-<slug>.md\n~/.wenlan/sessions/_status/<project>.md\n~/.wenlan/sessions/_status/handoff-<project>.json\nWenlan MCP captures in the daemon DB",
    },
    caution:
      "A handoff is not a victory lap or a full transcript. It should make the next session easier to start.",
    faq: [
      "Should every Claude Code session end with /handoff?",
      "No. Use it for meaningful work that will continue later.",
      "Is this the same as Claude Code resume?",
      "No. Use Claude Code resume or continue when you want the same transcript. Use Wenlan /handoff for durable project status and cross-session or cross-tool context.",
    ],
    relatedSlugs: ["ai-agent-handoff-loop", "wenlan-for-claude-code", "how-to-add-memory-to-claude-code"],
    officialReferences: [
      {
        label: "Wenlan daily workflow docs",
        href: "https://wenlan.app/docs/daily-workflow",
      },
      {
        label: "Wenlan data and privacy docs",
        href: "https://wenlan.app/docs/data-and-privacy",
      },
      {
        label: "Claude Code sessions docs",
        href: "https://code.claude.com/docs/en/agent-sdk/sessions",
      },
    ],
  },
  {
    slug: "cursor-claude-code-shared-memory",
    updatedAt: "2026-07-17",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "How to Share Memory Between Cursor and Claude Code",
    description:
      "Connect Cursor and Claude Code to one local Wenlan daemon so both tools can recall the same source-backed decisions and handoffs.",
    metaTitle: "Share Memory Between Cursor and Claude Code | Wenlan",
    metaDescription:
      "Connect Cursor through MCP and Claude Code through the Wenlan plugin so both AI coding tools share one local, source-backed memory store.",
    keywords: [
      "Cursor Claude Code shared memory",
      "shared AI coding memory",
      "Claude Code Cursor memory",
      "MCP shared memory",
      "Wenlan shared memory",
    ],
    audience: "Developers switching between Cursor and Claude Code",
    heroBullets: [
      "One local daemon prevents tool-specific memory silos.",
      "Claude Code gets the plugin workflow; Cursor gets MCP tools.",
      "Both can recall the same decisions and handoffs.",
    ],
    quickAnswer:
      "To share memory between Cursor and Claude Code, point both clients at the same Wenlan daemon, data directory, and space. Use the Claude Code plugin and Cursor's Wenlan MCP connection; a capture in either tool can then be recalled from the other.",
    problem:
      "Many developers plan in one tool and edit in another. If each tool has separate memory, the user becomes the synchronization layer.",
    wenlanFit:
      "Wenlan makes the daemon the shared boundary. The interface changes by client, but memory, pages, spaces, and git history stay in one local place.",
    actionHeading: "Set up both clients",
    actionIntro:
      "Use the richest path for each client while keeping one daemon.",
    actionBullets: [
      "Install the Claude Code plugin and run /setup.",
      "After /setup succeeds, run ~/.wenlan/bin/wenlan connect cursor, or wenlan connect cursor if ~/.wenlan/bin is on PATH.",
      "Verify capture in one client and recall in the other with the same daemon, data dir, and space.",
      "Use the same space for the same project; Cursor should pass the same space in Wenlan MCP calls or lock WENLAN_SPACE in ~/.cursor/mcp.json.",
      "Use /handoff in Claude Code when ending work that Cursor will continue.",
    ],
    code: {
      label: "Cursor and Claude Code smoke test",
      code: "/setup\n~/.wenlan/bin/wenlan connect cursor\n# Capture a harmless fact in Cursor with the same Wenlan space.\n# Recall that fact from Claude Code with /recall.\n# Then capture in Claude Code and recall from Cursor.",
    },
    caution:
      "If the tools appear to disagree, check space selection, daemon URL, and data directory before assuming memory is missing. The prebuilt runtime supports macOS, Linux glibc, and Windows; Claude Code on Windows may involve WSL or Git Bash caveats.",
    faq: [
      "Can Cursor read a Claude Code handoff?",
      "Yes, through Wenlan's local daemon and retrieval tools when both clients share the same store.",
      "Do I need to duplicate captures in both tools?",
      "No. Capture once in the right space; later clients can recall it.",
    ],
    relatedSlugs: ["how-to-add-mcp-memory-to-cursor", "how-to-add-memory-to-claude-code", "claude-code-session-handoff"],
    officialReferences: [
      {
        label: "Cursor MCP docs",
        href: "https://docs.cursor.com/context/model-context-protocol",
      },
      {
        label: "Claude Code plugins docs",
        href: "https://code.claude.com/docs/en/plugins",
      },
      {
        label: "Claude Code MCP docs",
        href: "https://code.claude.com/docs/en/mcp",
      },
    ],
  },
  {
    slug: "codex-claude-code-shared-memory",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "Shared Memory Between Codex and Claude Code",
    description:
      "Use Wenlan to carry implementation context between Codex sessions and Claude Code plugin workflows.",
    metaTitle: "Shared Memory Between Codex and Claude Code | Wenlan",
    metaDescription:
      "Wenlan lets Codex and Claude Code share one local, source-backed system for decisions, gotchas, handoffs, and project context.",
    keywords: [
      "Codex Claude Code shared memory",
      "Codex Claude Code handoff",
      "shared memory AI coding agents",
      "Wenlan Codex Claude Code",
      "MCP shared memory Codex",
    ],
    audience: "Developers using both Codex and Claude Code",
    heroBullets: [
      "Codex connects through MCP-only setup.",
      "Claude Code gets plugin commands and the same daemon.",
      "Handoffs make cross-tool continuation explicit.",
    ],
    quickAnswer:
      "Use Wenlan as the shared store: configure Codex through MCP, configure Claude Code through the plugin, and verify that a capture from one can be recalled from the other with the same daemon, data dir, and space.",
    problem:
      "Codex may handle one coding pass while Claude Code handles another. Codex native Memories and AGENTS.md still help Codex itself, but they do not automatically become Claude Code memory.",
    wenlanFit:
      "Wenlan keeps decisions, lessons, pages, and handoffs independent of the tool that produced them. That lets Codex and Claude Code participate in one work history.",
    actionHeading: "Verify cross-tool memory",
    actionIntro:
      "Do a small round trip before trusting the workflow.",
    actionBullets: [
      "Set up Wenlan once.",
      "Add Codex with ~/.wenlan/bin/wenlan connect codex.",
      "Install the Claude Code plugin with /plugin marketplace add 7xuanlu/claude-plugins, /plugin install wenlan@7xuanlu, then /setup.",
      "Capture a harmless project fact in Codex with space X.",
      "Recall that fact from Claude Code with the same space.",
      "Reverse the smoke test: capture in Claude Code, then recall from Codex.",
    ],
    code: {
      label: "Codex and Claude Code smoke test",
      code: "~/.wenlan/bin/wenlan connect codex\n/plugin marketplace add 7xuanlu/claude-plugins\n/plugin install wenlan@7xuanlu\n/setup\n# Use the same Wenlan space for both clients during capture and recall.",
    },
    caution:
      "Do not use different daemons, data directories, or spaces unless you intentionally want isolated memory stores. MCP-only Claude Code is tools-only; the plugin path is what provides /setup, /brief, and /handoff.",
    faq: [
      "Which tool should write handoffs?",
      "Use the tool ending the work. In Claude Code, /handoff is the easiest path; in Codex, capture a handoff-style memory.",
      "Can both tools write at the same time?",
      "They can use the same daemon, but keep captures atomic and scoped so review remains clear.",
    ],
    relatedSlugs: ["how-to-give-codex-persistent-memory", "how-to-add-memory-to-claude-code", "wenlan-codex-workflow"],
    officialReferences: [
      {
        label: "Codex MCP docs",
        href: "https://developers.openai.com/codex/mcp",
      },
      {
        label: "Codex Memories docs",
        href: "https://developers.openai.com/codex/memories",
      },
      {
        label: "Wenlan Claude Code plugin",
        href: "https://github.com/7xuanlu/wenlan/tree/main/plugin",
      },
    ],
  },
  {
    slug: "multi-agent-memory-workflow",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "A Multi-Agent Memory Workflow That Stays Local",
    description:
      "Coordinate multiple AI clients through one local, source-backed Wenlan system without turning project context into a cloud black box.",
    metaTitle: "Multi-Agent Memory Workflow That Stays Local | Wenlan",
    metaDescription:
      "Use Wenlan's daemon, MCP tools, spaces, capture, recall, handoff, and distill to coordinate multi-agent AI work locally.",
    keywords: [
      "multi-agent memory workflow",
      "local multi-agent memory",
      "AI agents shared memory",
      "MCP multi-agent memory",
      "Wenlan multi-agent workflow",
    ],
    audience: "Builders using several AI tools on the same body of work",
    heroBullets: [
      "Shared memory needs the same daemon, data directory, and active space.",
      "Use agent profiles and spaces to keep source and context visible.",
      "Distill repeated work into pages instead of growing a pile of raw memories.",
    ],
    quickAnswer:
      "A practical multi-agent memory workflow only works when every client is intentionally pointed at the same daemon, data directory, and active space, with source-agent attribution visible.",
    problem:
      "Multi-agent workflows become fragile when each agent writes its own private scratchpad. The user then has to reconcile conflicting state by hand.",
    wenlanFit:
      "Wenlan makes the daemon the shared local store. Agents can write captures, recall context, and read distilled pages while source attribution and review keep trust visible.",
    actionHeading: "Keep coordination simple",
    actionIntro:
      "Do not invent a complex protocol before the memory loop works.",
    actionBullets: [
      "Connect each MCP client to the same daemon and data directory for shared work.",
      "Use the same active space for collaborating agents; use separate spaces only when you intentionally want isolation.",
      "Capture decisions and lessons, not every intermediate thought.",
      "Use handoffs when one agent's output becomes another agent's starting point.",
      "Distill repeated topics into pages.",
    ],
    caution:
      "Shared memory is not automatic truth. Review contradictions and stale context before letting old records steer important work.",
    faq: [
      "Does Wenlan assign tasks to agents?",
      "No. Wenlan captures, refines, and recalls source-backed context. Your agent workflow decides task assignment.",
      "How do I avoid cross-project leakage?",
      "Use spaces intentionally. Run wenlan doctor from the terminal to inspect resolver state, then verify with a same-space capture/recall round trip.",
    ],
    relatedSlugs: [
      "prevent-multi-agent-knowledge-conflicts",
      "codex-claude-code-shared-memory",
      "mcp-memory-server",
      "review-before-trust-ai-memory",
    ],
    officialReferences: [
      {
        label: "Wenlan MCP clients docs",
        href: "https://wenlan.app/docs/mcp-clients",
      },
      {
        label: "Wenlan spaces docs",
        href: "https://wenlan.app/docs/spaces",
      },
      {
        label: "Wenlan agent profiles docs",
        href: "https://wenlan.app/docs/agent-profiles",
      },
    ],
  },
  {
    slug: "ai-agent-project-status-handoff",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "AI Agent Project Status Handoff",
    description:
      "Keep project status usable for the next AI session without bloating memory with transient todos.",
    metaTitle: "AI Agent Project Status Handoff | Wenlan",
    metaDescription:
      "Use Wenlan handoffs and captures to preserve project status, open threads, decisions, and next steps for future AI agents.",
    keywords: [
      "AI agent project status",
      "AI project handoff",
      "AI session status",
      "Wenlan project status",
      "handoff for AI agents",
    ],
    audience: "Users who want AI sessions to resume work cleanly",
    heroBullets: [
      "Project status is the live ledger that /brief reads before memory context.",
      "Active and Backlog keep next moves separate from parked work.",
      "Session logs, status files, and durable captures each do different jobs.",
    ],
    quickAnswer:
      "A project status handoff is the per-project status file maintained by /handoff: Last session, Active work, Backlog, blockers, open questions, and the next useful action.",
    problem:
      "Without a status handoff, the next AI session spends its first minutes asking what happened, scanning files, or repeating old checks.",
    wenlanFit:
      "Wenlan's handoff loop writes a session log, updates the per-project status md/json files, and stores durable captures. /brief reads the status file first as the authoritative what-next ledger before loading MCP context.",
    actionHeading: "Write status for the next agent",
    actionIntro:
      "Focus on resumption, not narration.",
    actionBullets: [
      "State the current goal.",
      "List completed changes, decisions made, and verified outcomes.",
      "Name blockers or unresolved questions.",
      "Keep fresh next-move candidates in Active and older parked work in Backlog.",
      "Demote stale Active items when they have not been touched recently; promote Backlog items only when work resumes.",
      "Point to relevant files, commands, or docs only when useful.",
      "Flag stale memory drift; capture the durable correction only when it should survive future sessions.",
    ],
    code: {
      label: "Status file shape",
      code: "# <Project> - Current Status\n\n## Last session (<date>)\n- <accomplished bullet>\n\n## Active\n- <fresh next-move candidate> (added <YYYY-MM-DD>)\n- <blocked item> (added <YYYY-MM-DD>) (gated: <trigger>)\n\n## Backlog\n- <older parked item> (added <YYYY-MM-DD>)",
    },
    caution:
      "Temporary todos belong in task tools. Wenlan should keep the durable status that matters when the chat is gone.",
    faq: [
      "Should project status include test output?",
      "Only summarize the verified result and command. Do not store long logs.",
      "How often should I write a status handoff?",
      "After meaningful work that another session may continue.",
    ],
    relatedSlugs: ["claude-code-session-handoff", "what-to-capture-in-ai-work-memory", "persistent-project-context-for-ai-agents"],
    officialReferences: [
      {
        label: "Wenlan daily workflow docs",
        href: "https://wenlan.app/docs/daily-workflow",
      },
      {
        label: "Wenlan data and privacy docs",
        href: "https://wenlan.app/docs/data-and-privacy",
      },
    ],
  },
  {
    slug: "build-local-ai-knowledge-base-from-documents",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "How to Build a Local AI Knowledge Base from Markdown, PDFs, and Obsidian",
    description:
      "Use supported document sources, repeatable sync, source-backed pages, and verification to build a local AI knowledge base for coding agents.",
    metaTitle: "Build a Local AI Knowledge Base from Documents | Wenlan",
    metaDescription:
      "Build a local AI knowledge base from Markdown, text files, text PDFs, folders, or an Obsidian vault, then verify sources and maintained pages.",
    keywords: [
      "build AI knowledge base",
      "local AI knowledge base",
      "AI knowledge base builder",
      "open source AI knowledge base",
      "Markdown AI knowledge base",
      "PDF AI knowledge base",
      "Obsidian AI knowledge base",
      "AI knowledge base for coding agents",
    ],
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-01",
    audience: "People building a local document knowledge base for Claude Code, Codex, Cursor, or another AI agent",
    heroBullets: [
      "Start with one bounded folder or file instead of importing everything.",
      "Use Markdown, text, text-extractable PDFs, or an Obsidian vault as inspectable sources.",
      "Verify source sync and page citations before trusting generated answers.",
    ],
    quickAnswer:
      "Follow Wenlan's platform and client setup guide, then point `wenlan sources add <path>` at one Markdown or text file, a text-extractable PDF, a folder, or an Obsidian vault. Re-running the same command resyncs an already registered path. In a client with the Wenlan plugin, distill one repeated topic into a maintained Page; in an MCP-only client, use the Wenlan tools exposed by that client.",
    wenlanFit:
      "Wenlan keeps registered Sources separate from atomic Memories and maintained Pages. Regular files and folders can sync incrementally; an Obsidian vault remains read-only and resyncs on demand. The resulting Page stays readable as Markdown and keeps inspectable source support.",
    problem:
      "A folder search is not yet a knowledge base, while a one-time AI summary becomes detached from the documents that support it. The useful middle is a small source boundary, repeatable sync, a maintained answer for one real question, and a check that every important claim can still reach its evidence.",
    actionHeading: "Build one document-to-page loop",
    actionIntro:
      "Use one topic and a small source set so failures stay visible.",
    actionBullets: [
      "Install the runtime for your operating system, connect the current AI client, and verify the connection before importing documents.",
      "Choose one folder, file, or Obsidian vault that answers a repeated work question.",
      "Keep supported inputs to `.md`, `.txt`, and text-extractable `.pdf`; put unrelated material outside the source boundary.",
      "Run `wenlan sources add <path>` and inspect the found, ingested, skipped, and error counts.",
      "Re-run the same command after a source changes; registration is idempotent and the path is resynced.",
      "In Claude Code or Codex with the Wenlan plugin, use `/distill <topic>` only after the source set can answer the topic, then open it with `/pages <topic>`.",
      "Run `/lint` and `/curate` in a plugin client, or use the equivalent Wenlan tools exposed by an MCP-only client, before relying on the Page.",
    ],
    code: {
      label: "After platform and client setup",
      code: "wenlan status\nwenlan sources add ~/Knowledge/project-docs",
    },
    caution:
      "Image-only or scanned PDFs need OCR before Wenlan can extract their text, and Directory Sources do not ingest arbitrary source-code files. Keep code, tests, and native project docs authoritative; use this workflow for supported documents and maintained synthesis.",
    faq: [
      "Does Wenlan copy or rewrite my Obsidian vault?",
      "No. Wenlan reads an Obsidian vault as a source and keeps the original Markdown human-owned. Page export or a symlink into the vault is a separate choice.",
      "Is this the same as uploading files to a chatbot?",
      "No. A chatbot upload is usually session-scoped. This workflow registers a reusable local source, resyncs it, and builds a maintained Page whose support can be inspected and reviewed.",
    ],
    relatedSlugs: [
      "prevent-multi-agent-knowledge-conflicts",
      "fix-pdf-ingestion-ai-knowledge-base",
      "coding-agent-source-backed-knowledge-base",
      "source-backed-wiki-pages-ai-work",
      "source-backed-research-knowledge-base",
      "build-client-project-knowledge-base-for-consulting",
      "build-investment-research-knowledge-base",
      "build-product-research-knowledge-base-for-prd",
      "build-sre-incident-knowledge-base",
      "distilled-wiki-pages-ai-memory",
      "wenlan-vs-obsidian-ai-memory",
      "build-ict-supplier-due-diligence-evidence-pack",
      "build-customer-support-answer-knowledge-base",
      "build-course-wiki-from-lecture-notes",
    ],
    officialReferences: [
      {
        label: "Wenlan platform and client setup",
        href: "https://github.com/7xuanlu/wenlan/blob/main/docs/setup-with-ai.md",
      },
      {
        label: "Wenlan supported document sources",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan sources add CLI",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-cli/README.md#wenlan-sources-add-path",
      },
      {
        label: "Wenlan source-backed Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
    ],
    cta: {
      heading: "Build one local knowledge-base loop",
      body: "Install Wenlan, add one inspectable document set, then verify sync, Pages, citations, and review before expanding.",
    },
  },
  {
    slug: "source-backed-research-knowledge-base",
    eyebrow: "Research workflow",
    category: "Workflows",
    title: "Build a Research Knowledge Base from Papers and PDFs",
    description:
      "Turn a bounded paper set into inspectable research notes that preserve claims, methods, limitations, contradictions, citations, and source updates.",
    metaTitle: "Build a Research Knowledge Base from Papers & PDFs",
    metaDescription:
      "Build a source-backed research knowledge base from papers and text PDFs with a literature matrix, exact citations, contradictions, limitations, and updates.",
    keywords: [
      "build research knowledge base from papers",
      "source backed literature review workflow",
      "AI research notes with citations",
      "PDF research knowledge base",
      "literature matrix AI",
      "research knowledge management",
    ],
    publishedAt: "2026-08-27",
    updatedAt: "2026-08-27",
    readingTime: "8 min read",
    audience:
      "Students and researchers who already have a bounded paper set and need inspectable synthesis rather than automatic paper discovery or writing",
    heroBullets: [
      "Begin with one research question and papers you have already selected.",
      "Track each claim, method, sample, result, and limitation back to an exact source location.",
      "Keep agreement, contradiction, and unknowns separate as new papers arrive.",
    ],
    quickAnswer:
      "Start with one research question and a bounded set of papers you already have. Keep the papers authoritative, extract only readable text, and build a literature matrix with one row per important claim: method, sample, result, limitation, exact source location, and current verification state.",
    wenlanFit:
      "Wenlan can register Markdown, text, text-extractable PDFs, folders, and read-only Obsidian sources, then maintain source-backed Pages with citations, stale state, revisions, lint, and human review. It does not search scholarly databases, discover papers, format bibliographies, or judge whether a study is academically valid.",
    problem:
      "A folder of PDFs is difficult to compare, while a smooth AI summary can erase disagreements, omit study limitations, or invent support. The useful research artifact preserves the question, evidence table, contradiction record, and exact passage behind every consequential synthesis so another reader can reproduce the reasoning.",
    actionHeading: "Build one inspectable paper-to-synthesis loop",
    actionIntro:
      "Use papers already acquired for one question. Keep the first pass small enough to verify every row.",
    actionBullets: [
      "Write one research question and freeze a bounded initial paper set; record the inclusion boundary instead of asking an assistant to discover an unknown corpus.",
      "Keep original papers authoritative. Use text-extractable PDFs or derived Markdown and text; run OCR outside Wenlan before adding scanned or image-only PDFs.",
      "Create a literature matrix with claim, method, sample, result, limitation, exact page or section, paper version, and verification status.",
      "Group agreement, contradiction, and unknowns separately. Do not flatten conflicting findings into one consensus paragraph.",
      "Open the cited passage for every important claim and verify numbers, scope, attribution, negation, and current source version.",
      "When a new or revised paper arrives, resync the source and refresh only the affected synthesis; preserve the earlier revision for review.",
      "Export or retain a readable research note. A human researcher remains responsible for interpretation, study-quality assessment, citations, and final writing.",
    ],
    code: {
      label: "After Wenlan and the AI client are configured",
      code: "wenlan status\nwenlan sources add ~/Research/papers\n# In a Wenlan plugin client:\n/distill <research question>\n/pages <research question>\n/lint\n/curate",
    },
    caution:
      "This workflow is not scholarly search, DOI discovery, Zotero import, reference formatting, automatic literature-review writing, or proof that a cited paper is true. Wenlan reads text-extractable PDFs; scanned PDFs require OCR first, and study quality, statistics, and academic integrity still require human review.",
    faq: [
      "Can Wenlan find papers or write my literature review?",
      "No. Begin with papers you already selected. Wenlan can help maintain an inspectable source-backed research artifact, but it does not replace scholarly search, source selection, interpretation, citation formatting, or authorship.",
      "How should I handle papers that disagree?",
      "Keep separate matrix rows for each result, scope, method, and limitation. Record the contradiction explicitly and leave the synthesis unresolved until the evidence supports a narrower conclusion.",
    ],
    relatedSlugs: [
      "build-local-ai-knowledge-base-from-documents",
      "verify-ai-knowledge-base-citations",
      "source-backed-wiki-pages-ai-work",
      "choose-ai-knowledge-base-tool",
      "build-ict-supplier-due-diligence-evidence-pack",
      "build-course-wiki-from-lecture-notes",
    ],
    officialReferences: [
      {
        label: "Wenlan supported document sources",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan source-backed Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "National Taiwan University AI research guidance",
        href: "https://www.lib.ntu.edu.tw/img/tulblog/HELP/HELP_20260525_AI.pdf",
      },
      {
        label: "Distill research workspace",
        href: "https://github.com/luisalarcon-gauntlet/Distill",
      },
      {
        label: "UReKA research knowledge workflow",
        href: "https://github.com/Agents4Academia-AI/UReKA",
      },
    ],
    cta: {
      heading: "Build one inspectable research artifact",
      body: "Add a bounded paper set, create a literature matrix, and verify every important synthesis against the current source before expanding.",
    },
  },
  {
    slug: "choose-ai-knowledge-base-tool",
    eyebrow: "Selection guide",
    category: "Workflows",
    title: "How to Choose an AI Knowledge Base Tool: 8 Tests That Matter",
    description:
      "Choose an AI knowledge base by testing sources, freshness, review, ownership, privacy, agent access, input limits, and real answer quality.",
    metaTitle: "How to Choose an AI Knowledge Base Tool | 8 Tests",
    metaDescription:
      "Use eight practical tests to choose an AI knowledge base tool for documents, RAG, local notes, or maintained knowledge across AI agents.",
    keywords: [
      "AI knowledge base tools",
      "AI knowledge base software",
      "choose AI knowledge base",
      "best AI knowledge base tool",
      "local AI knowledge base tool",
      "open source AI knowledge base",
      "AI knowledge base for agents",
      "AI knowledge base evaluation",
    ],
    publishedAt: "2026-08-02",
    updatedAt: "2026-09-07",
    audience:
      "People choosing a document, local-note, RAG, or maintained knowledge system for AI agents",
    heroBullets: [
      "Choose the operating model before comparing feature lists.",
      "Test whether answers stay traceable and current when sources change.",
      "Run the same acceptance test on every candidate with your own documents.",
    ],
    quickAnswer:
      "First decide which job you need: a one-session document upload, RAG over a document set, AI access to a note editor or Markdown vault, or maintained source-backed knowledge shared across agents and sessions. Then test every candidate against the same eight criteria instead of trusting a generic best-tools list.",
    wenlanFit:
      "Wenlan fits the fourth model. It keeps local Sources, atomic knowledge, and maintained Pages separate; exposes them to Claude Code, Codex, Cursor, ChatGPT, and other clients through plugins or MCP; and keeps citations, stale state, revisions, and human review visible.",
    problem:
      "AI knowledge base products often use the same label for different jobs. A chatbot upload may answer questions for one session, a RAG service may retrieve document chunks, a notes tool may give an agent direct file access, and a maintained wiki may preserve reviewed answers over time. Comparing them as one feature list produces the wrong choice.",
    actionHeading: "Run these eight tests",
    actionIntro:
      "Use one small, representative document set and write down the expected result before testing a tool.",
    actionBullets: [
      "Source traceability: can every important answer open the exact supporting source or citation?",
      "Freshness: after a source changes, can you see what is stale and what needs to refresh?",
      "Conflict and review: does contradictory evidence become a visible review decision instead of a silent rewrite?",
      "Ownership and export: can you keep or export readable files and history without depending on one vendor?",
      "Privacy boundary: which files, prompts, retrieved passages, and model calls stay local, and which leave the machine?",
      "Agent interoperability: can the same knowledge serve the AI clients you actually use without copying it into each one?",
      "Input limits: which formats, scanned documents, folders, vaults, and source sizes are really supported?",
      "Acceptance test: ask an answerable question, an unanswerable question, and a cross-source question; then edit one source and repeat all three.",
    ],
    code: {
      label: "Wenlan proof loop after setup",
      code: "wenlan status\nwenlan sources add ~/Knowledge/evaluation-set\n# In a Wenlan plugin client:\n/distill <tested topic>\n/pages <tested topic>\n/lint\n/curate",
    },
    caution:
      "Do not choose from a leaderboard alone. Product capabilities and pricing change, while your source quality, privacy boundary, maintenance effort, and acceptance questions determine whether a knowledge base is trustworthy for your work.",
    faq: [
      "Is the best AI knowledge base always a RAG tool?",
      "No. RAG is useful for retrieving source fragments, but some workflows need only a temporary document reader while others need reviewed, reusable answers that stay current across sessions and agents.",
      "Should I test with my entire archive?",
      "No. Start with a small set containing one clean source, one outdated source, one contradiction, and one question the sources cannot answer. Expand only after the tool handles that set correctly.",
    ],
    relatedSlugs: [
      "fix-pdf-ingestion-ai-knowledge-base",
      "build-local-ai-knowledge-base-from-documents",
      "source-backed-wiki-pages-ai-work",
      "distilled-wiki-pages-ai-memory",
      "verify-ai-knowledge-base-citations",
      "test-ai-knowledge-base-retrieval-after-changes",
    ],
    officialReferences: [
      {
        label: "Wenlan knowledge model",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan supported document sources",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan MCP clients",
        href: "https://wenlan.app/docs/mcp-clients",
      },
      {
        label: "Wenlan review and trust",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "Wenlan data and privacy",
        href: "https://wenlan.app/docs/data-and-privacy",
      },
    ],
    cta: {
      heading: "Run the same eight tests on Wenlan",
      body: "Use one bounded source set, verify citations and refresh behavior, then decide whether a maintained local knowledge layer fits your workflow.",
    },
  },
];

const consultantClientProjectArticle: BaseSpec = {
  slug: "build-client-project-knowledge-base-for-consulting",
  eyebrow: "Consulting workflow",
  category: "Workflows",
  title: "How to Build a Client Project Knowledge Base for Consulting",
  description:
    "Keep one consulting engagement's sources, research, decisions, deliverables, and handoff context in a traceable client-project knowledge base.",
  metaTitle: "Build a Client Project Knowledge Base for Consulting",
  metaDescription:
    "Build a client-scoped consulting knowledge base for sources, research, decisions, deliverables, stale evidence, and project handoff.",
  keywords: [
    "consultant client knowledge base",
    "consulting engagement knowledge base",
    "client project knowledge handoff",
    "consulting research knowledge base",
    "client deliverable source tracking",
  ],
  publishedAt: "2026-08-28",
  updatedAt: "2026-08-28",
  readingTime: "8 min read",
  audience:
    "Independent consultants, boutique consulting teams, and research analysts delivering client engagements",
  heroBullets: [
    "Keep each client in a separate source boundary instead of mixing engagements.",
    "Trace findings, decisions, and deliverable claims back to current client-approved sources.",
    "Leave a reviewable handoff that records open questions, stale evidence, and the next owner.",
  ],
  quickAnswer:
    "Create one client-scoped knowledge base per engagement. Register only the approved project sources, keep a decision and open-question log, distill reusable findings into a source-backed Page, and verify every deliverable claim before handoff.",
  wenlanFit:
    "Wenlan can keep Sources, atomic Memories, and maintained Pages inside a client Space, with source references, revisions, stale state, lint, and review. It does not provide CRM ingestion, email or calendar sync, role-based access control, automatic redaction, legal compliance, billing, or project management.",
  problem:
    "A consultant often starts the next proposal, workshop, deliverable, or handoff by reconstructing context from folders, interview notes, slide decks, chats, and personal memory. The risk is not only wasted time: evidence from another client can leak into the engagement, an old decision can look current, and a polished claim can lose its source.",
  actionHeading: "Build one client-to-handoff loop",
  actionIntro:
    "Start with a non-sensitive sample engagement. Use the client's contractual and security controls before adding confidential material.",
  actionBullets: [
    "Create one Space and one source folder for a single client engagement; never use a shared catch-all client corpus.",
    "Register the approved proposal, scope, research, interview notes, source documents, decisions, and current deliverables with `wenlan sources add <path>`.",
    "Record each important decision with its date, owner, evidence, alternatives, and what would reopen it; keep unanswered questions separate.",
    "Distill one repeated project question into a maintained Page, then verify the cited source and revision before copying a claim into a deliverable.",
    "When a source changes, resync it and review only the affected Pages; mark unresolved claims stale instead of silently preserving them.",
    "Before handoff, record current scope, accepted decisions, open questions, deliverables, source boundaries, risks, and the next responsible person.",
    "Run lint and review before sharing. Keep confidential or regulated material out unless the engagement's approved controls permit it.",
  ],
  code: {
    label: "After Wenlan and the AI client are configured",
    code: "wenlan status\nwenlan sources add ~/Clients/acme-approved-sources\n# In a Wenlan plugin client:\n/distill <client project question>\n/pages <client project question>\n/lint\n/curate\n/handoff",
  },
  caution:
    "Local-first storage does not replace a consulting agreement, client consent, access control, retention policy, redaction, or a secure document system. Start with non-sensitive sample data, keep each client isolated, and withhold any claim whose current source cannot be verified.",
  faq: [
    "Should all consulting clients share one knowledge base?",
    "No. Give each engagement its own source boundary and Space. Reuse only explicitly approved general methods or templates, never another client's facts, files, or decisions.",
    "Does Wenlan manage client confidentiality or permissions for me?",
    "No. Wenlan keeps local, source-backed knowledge inspectable, but it is not a CRM, document access-control system, redaction tool, or legal-compliance service. Apply the client's approved security and retention controls first.",
  ],
  relatedSlugs: [
    "source-backed-wiki-pages-ai-work",
    "build-local-ai-knowledge-base-from-documents",
    "verify-ai-knowledge-base-citations",
    "source-backed-research-knowledge-base",
    "prevent-multi-agent-knowledge-conflicts",
  ],
  officialReferences: [
    {
      label: "Wenlan knowledge model and Spaces",
      href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
    },
    {
      label: "Wenlan daily workflow",
      href: "https://github.com/7xuanlu/wenlan#daily-workflow",
    },
    {
      label: "Cogni Consult client-delivery workspace",
      href: "https://github.com/cogni-work/insight-wave/tree/main/cogni-consult",
    },
    {
      label: "AI Consulting Methodology engagement lifecycle",
      href: "https://github.com/mardy123/AI-Consulting-Methodology-Toolkit/blob/main/06_Delivery/ENGAGEMENT_LIFECYCLE.md",
    },
    {
      label: "Market research workflow reference",
      href: "https://github.com/genli-ai/market-research-skills/blob/main/skills/analyst-research/references/workflow_medium.zh.md",
    },
  ],
  cta: {
    heading: "Build one inspectable client handoff",
    body: "Create a client-scoped source boundary, verify one deliverable claim, and leave a handoff another consultant can reproduce.",
  },
};

workflowArticles.push(consultantClientProjectArticle);

const investmentResearchKnowledgeBaseArticle: BaseSpec = {
  slug: "build-investment-research-knowledge-base",
  eyebrow: "Investment research workflow",
  category: "Workflows",
  title: "How to Build an Investment Research Knowledge Base",
  description:
    "Turn annual reports, filings, earnings-call notes, and research questions into a source-backed company dossier that stays reviewable as evidence changes.",
  metaTitle: "Build an Investment Research Knowledge Base | Wenlan",
  metaDescription:
    "Build a source-backed investment research knowledge base from filings, annual reports, and earnings calls with citations, thesis changes, and stale-evidence review.",
  keywords: [
    "investment research knowledge base",
    "AI investment research workflow",
    "annual report research workflow",
    "earnings call research notes",
    "source backed equity research",
    "financial research knowledge management",
  ],
  publishedAt: "2026-08-28",
  updatedAt: "2026-08-28",
  readingTime: "9 min read",
  audience:
    "Equity research analysts, independent investors, and finance professionals working from company filings and earnings materials",
  heroBullets: [
    "Keep one company and reporting period inside an explicit source boundary.",
    "Trace every material claim to the current filing, annual report, or earnings-call passage.",
    "Record what changed, what contradicts the thesis, and which questions remain open.",
  ],
  quickAnswer:
    "Create one company-scoped research knowledge base from documents you are allowed to use. Register the current annual report, filings, earnings releases, presentation, and your dated call notes; then maintain a source register, metric-and-guidance change log, thesis ledger, contradiction log, and open-question list.",
  wenlanFit:
    "Wenlan can ingest Markdown, text, text-extractable PDFs, folders, and read-only Obsidian sources, then maintain source-backed Pages with citations, revisions, stale state, lint, and human review. It does not fetch live market data, parse XBRL or tables reliably, calculate valuation, monitor portfolios, produce trading signals, or provide investment advice.",
  problem:
    "Company research becomes unreliable when each quarter adds another filing, transcript, model note, and management claim. A polished summary can silently mix periods, preserve superseded guidance, or turn an analyst inference into a sourced fact. The useful artifact preserves the exact document, reporting period, page or section, revision, and reviewer behind every consequential conclusion.",
  actionHeading: "Build one filing-to-thesis update loop",
  actionIntro:
    "Use one company and one reporting cycle first. Keep calculations in a spreadsheet or financial model and use the knowledge base for source-backed qualitative research and change tracking.",
  actionBullets: [
    "Create one company folder and source register with document type, reporting period, publication date, revision, authority, and local filename.",
    "Add the current annual report or 10-K, latest interim filing, earnings release, investor presentation, and dated earnings-call notes only when you have lawful access.",
    "Extract a compact Page for business model, segments, key metrics, guidance, risks, catalysts, management claims, and unresolved questions; cite the exact source location for every material statement.",
    "Keep reported facts, your calculations, and investment judgments in separate fields. Never let a Page turn an inference into a company statement.",
    "Compare the new period with the previous source set. Record changed guidance, newly disclosed risks, metric-definition changes, contradictions, and thesis implications.",
    "When a filing or transcript is corrected, resync the source and review only affected Pages. Mark unsupported or superseded claims stale instead of preserving them.",
    "Open the cited passage before using a claim in a memo. A citation proves a path exists, not that the claim, number, or interpretation is correct.",
  ],
  code: {
    label: "After Wenlan and the AI client are configured",
    code: "wenlan status\nwenlan sources add ~/Research/companies/acme\n# In a Wenlan plugin client:\n/distill <company and reporting-period question>\n/pages <company research topic>\n/lint\n/curate",
  },
  caution:
    "This workflow is for organizing user-provided, text-extractable research sources. Scanned PDFs require external OCR; tables, financial statements, and calculations must be checked against the original filing and a deterministic model. It is not investment advice and does not replace licensed data, compliance review, or professional judgment.",
  faq: [
    "Can Wenlan fetch SEC filings, market data, or earnings transcripts for me?",
    "No. Bring documents you are allowed to use. Wenlan does not provide a live financial-data feed, transcript license, XBRL pipeline, valuation engine, or portfolio monitor.",
    "How do I keep an investment thesis from going stale?",
    "Attach each thesis claim to a dated source and invalidation condition. After every filing or earnings call, compare the new source set, mark superseded claims stale, and preserve the prior revision for review.",
  ],
  relatedSlugs: [
    "build-local-ai-knowledge-base-from-documents",
    "verify-ai-knowledge-base-citations",
    "source-backed-wiki-pages-ai-work",
    "source-backed-research-knowledge-base",
    "test-ai-knowledge-base-retrieval-after-changes",
  ],
  officialReferences: [
    {
      label: "Wenlan supported document sources",
      href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
    },
    {
      label: "Wenlan source-backed Pages",
      href: "https://wenlan.app/docs/source-backed-pages",
    },
    {
      label: "Anthropic equity-research earnings workflow",
      href: "https://github.com/anthropics/financial-services/blob/main/plugins/vertical-plugins/equity-research/commands/earnings.md",
    },
    {
      label: "AI4Finance finance research resources",
      href: "https://github.com/AI4Finance-Foundation/Awesome_AI4Finance",
    },
    {
      label: "Investor Harness evidence-led research workflow",
      href: "https://github.com/joansongjr/investor-harness",
    },
  ],
  cta: {
    heading: "Build one inspectable company dossier",
    body: "Add one reporting cycle, verify every material claim, and preserve what changed before expanding the research set.",
  },
};

workflowArticles.push(investmentResearchKnowledgeBaseArticle);

const comparisonArticles: BaseSpec[] = [
  {
    slug: "wenlan-vs-mcp-memory-service",
    eyebrow: "Comparison",
    category: "Comparisons",
    title: "Wenlan vs mcp-memory-service: Local AI Work Memory or Agent Pipeline Backend?",
    description:
      "Compare Wenlan with mcp-memory-service across user workflow, transports, storage control, and agent-pipeline scope.",
    metaTitle: "Wenlan vs mcp-memory-service | AI Memory Comparison",
    metaDescription:
      "Wenlan focuses on local AI work memory for users. mcp-memory-service is a broad self-hosted memory service for MCP, HTTP, and agent workflows.",
    keywords: [
      "Wenlan vs mcp-memory-service",
      "mcp-memory-service alternative",
      "MCP memory service comparison",
      "local AI work memory comparison",
      "agent pipeline memory",
    ],
    audience: "Developers comparing MCP-native memory tools",
    heroBullets: [
      "Wenlan is a user-facing, source-backed LLM wiki for AI work.",
      "mcp-memory-service is a broad self-hosted service with REST, MCP, dashboard, OAuth, remote/browser scenarios, and agent-framework scope.",
      "Choose based on whether your primary job is daily AI work continuity or backend memory infrastructure.",
    ],
    quickAnswer:
      "Choose Wenlan when you want local memory for your own AI work loop: capture, recall, handoff, pages, git history, and MCP clients. Choose mcp-memory-service when you want a self-hosted memory service for agent frameworks, HTTP clients, MCP tool users, remote/browser scenarios, and broader service operations.",
    problem:
      "Both tools speak to persistent memory, but their center of gravity is different. Confusing them leads to the wrong setup: a personal work loop may take on operational overhead it does not need, while an agent backend may need transports Wenlan does not optimize for.",
    wenlanFit:
      "Wenlan is deliberately not a memory infrastructure SDK. It is for people using AI daily who want local, inspectable, source-backed work context across tools.",
    actionHeading: "Choose by operating model",
    actionIntro:
      "Ask what you are trying to run.",
    actionBullets: [
      "Choose Wenlan for Claude Code slash workflows, local handoffs, spaces, git history, and readable pages.",
      "Choose mcp-memory-service for agent-framework backend needs, HTTP clients, web dashboards, OAuth, remote MCP, and browser/remote-client scenarios.",
      "Compare setup complexity against the actual job.",
      "Run a two-week trial with real captures instead of judging from feature checklists.",
    ],
    caution:
      "This comparison uses public project descriptions. Check the upstream repositories before relying on details that may change quickly.",
    faq: [
      "Is mcp-memory-service a direct Wenlan replacement?",
      "Not exactly. It overlaps on persistent memory, but it is more backend/service oriented while Wenlan is centered on local AI work continuity.",
      "Can both be useful?",
      "Yes. A team could use a backend memory service for agent infrastructure and still prefer Wenlan for personal local AI work sessions.",
    ],
    relatedSlugs: ["mcp-memory-server", "multi-agent-memory-workflow", "project-scope-ai-memory"],
    officialReferences: [
      {
        label: "mcp-memory-service GitHub repository",
        href: "https://github.com/doobidoo/mcp-memory-service",
      },
      {
        label: "Wenlan MCP clients docs",
        href: "https://wenlan.app/docs/mcp-clients",
      },
      {
        label: "Wenlan HTTP API docs",
        href: "https://wenlan.app/docs/http-api",
      },
      {
        label: "Wenlan project scope docs",
        href: "https://wenlan.app/docs/project-scope",
      },
    ],
    comparisonTable: {
      competitorName: "mcp-memory-service",
      rows: [
        {
          dimension: "Primary user",
          wenlan: "Individual AI power users and developers carrying work context across sessions.",
          competitor: "Builders operating a self-hosted memory service for agents, MCP clients, HTTP clients, and remote/browser use.",
        },
        {
          dimension: "Workflow surface",
          wenlan: "Claude Code plugin, MCP clients, CLI, handoff loop, pages, spaces.",
          competitor: "REST API, MCP, CLI, dashboard, OAuth, and framework-oriented integrations.",
        },
        {
          dimension: "API surface",
          wenlan: "Local daemon HTTP API on 127.0.0.1:7878 for CLI, MCP, desktop, and local scripts; not positioned as a hosted SDK surface.",
          competitor: "REST and MCP are first-class integration surfaces for agent and app backends.",
        },
        {
          dimension: "Artifacts and indexes",
          wenlan: "Readable Markdown pages, session logs, source trails, local git history, and local DB indexes.",
          competitor: "Service-managed records, tags, graph, dashboard, and APIs.",
        },
        {
          dimension: "Best fit",
          wenlan: "Personal or project AI work memory that should stay local and inspectable.",
          competitor: "Shared agent infrastructure where service operations are expected.",
        },
      ],
    },
  },
  {
    slug: "wenlan-vs-chatgpt-memory",
    eyebrow: "Comparison",
    category: "Comparisons",
    title: "Wenlan vs ChatGPT Memory: Built-In Personalization or Local AI Work Memory?",
    description:
      "Compare built-in assistant memory with Wenlan's local, inspectable, cross-tool work-memory layer.",
    metaTitle: "Wenlan vs ChatGPT Memory | Local AI Work Memory",
    metaDescription:
      "ChatGPT memory can personalize one assistant. Wenlan keeps AI work memory local, source-backed, inspectable, and usable across MCP clients.",
    keywords: [
      "Wenlan vs ChatGPT memory",
      "ChatGPT memory alternative",
      "local alternative to ChatGPT memory",
      "AI work memory vs assistant memory",
      "cross tool AI memory",
    ],
    audience: "Users deciding between built-in assistant memory and local work memory",
    heroBullets: [
      "Built-in memory is convenient for ChatGPT-scoped personalization.",
      "Wenlan is for durable work context across tools and sessions.",
      "Local artifacts, provenance, and git history make the memory inspectable.",
    ],
    quickAnswer:
      "Use ChatGPT memory for personalization inside ChatGPT: saved memories, reference chat history, memory summary and sources, and optional personalization from files or connected apps where available. Use Wenlan when work context needs to be local, inspectable, source-backed, and available to Claude Code, Cursor, Codex, Claude Desktop, and other MCP clients.",
    problem:
      "Built-in memory can help an assistant remember preferences, but serious work often needs traceability: where did this fact come from, when did it change, and which tools should be allowed to use it?",
    wenlanFit:
      "Wenlan treats memory as a local work artifact managed by the local daemon, not as state managed inside ChatGPT's UI. That makes it better suited for source-backed project decisions, handoffs, wiki pages, and multi-tool AI work.",
    actionHeading: "Pick the memory boundary",
    actionIntro:
      "Use the tool that matches the risk and portability of the context.",
    actionBullets: [
      "Use built-in memory for simple assistant preferences.",
      "Use ChatGPT memory when past chats, saved memories, memory summary/sources, or connected-app personalization should improve ChatGPT itself.",
      "Use Wenlan for project decisions, gotchas, client context, and handoffs.",
      "Use Wenlan when multiple AI clients should share context.",
      "Use Wenlan when you need local files and provenance.",
    ],
    caution:
      "Do not put sensitive project context into any memory system without understanding where it is stored, how to delete it, and which tools can retrieve it. For ChatGPT, turning Memory off does not delete existing saved memories, deleting a chat does not remove saved memories, and full cleanup may require deleting saved memories plus source chats, files, or connected-app sources. OpenAI says deleted saved-memory logs may be retained for up to 30 days, and content may be used for model improvement when that setting applies.",
    faq: [
      "Does Wenlan replace built-in assistant memory?",
      "It can replace parts of the work-memory use case, but built-in memory may still be useful for lightweight personalization inside one assistant.",
      "Why not just paste project context each time?",
      "Manual paste works for occasional chats. It breaks down when work spans weeks, tools, and repeated sessions.",
    ],
    relatedSlugs: ["ai-work-memory", "ai-memory-provenance", "ai-agent-memory-local-vs-cloud"],
    officialReferences: [
      {
        label: "OpenAI ChatGPT Memory help",
        href: "https://help.openai.com/en/articles/8590148-memory-faq",
      },
      {
        label: "Wenlan data and privacy docs",
        href: "https://wenlan.app/docs/data-and-privacy",
      },
      {
        label: "Wenlan core concepts docs",
        href: "https://wenlan.app/docs/core-concepts",
      },
      {
        label: "Wenlan security docs",
        href: "https://wenlan.app/docs/security",
      },
    ],
    comparisonTable: {
      competitorName: "ChatGPT memory",
      rows: [
        {
          dimension: "Scope",
          wenlan: "Local AI work memory across MCP-compatible tools.",
          competitor: "Built-in memory and saved context inside ChatGPT.",
        },
        {
          dimension: "Inspectability",
          wenlan: "Readable local artifacts, source-backed pages, and git history.",
          competitor: "Managed through product UI and account settings.",
        },
        {
          dimension: "Best fit",
          wenlan: "Project decisions, handoffs, local context, and cross-tool reuse.",
          competitor: "Personalization and continuity inside ChatGPT using past chats, saved memories, and supported file or connected-app sources.",
        },
        {
          dimension: "Control boundary",
          wenlan: "Local daemon and ~/.wenlan artifacts by default.",
          competitor: "Hosted product memory controlled through account settings.",
        },
      ],
    },
  },
  {
    slug: "wenlan-vs-obsidian-ai-memory",
    eyebrow: "Comparison",
    category: "Comparisons",
    title:
      "Obsidian + Claude Code: Vault Access, MCP, and a Durable AI Knowledge Base",
    description:
      "Use Obsidian with Claude Code through direct vault files, live editor context, or MCP—and add a source-backed knowledge lifecycle only when access is not enough.",
    metaTitle: "Obsidian + Claude Code: MCP & AI Knowledge | Wenlan",
    metaDescription:
      "Learn when Claude Code can use an Obsidian vault directly, what IDE and MCP bridges add, and when durable source-backed knowledge needs a separate lifecycle.",
    keywords: [
      "obsidian claude code",
      "claude code obsidian",
      "obsidian claude",
      "obsidian mcp",
      "obsidian claude code mcp",
      "claude code obsidian vault",
      "Obsidian AI knowledge base",
      "Wenlan vs Obsidian",
    ],
    publishedAt: "2026-06-06",
    updatedAt: "2026-07-29",
    audience:
      "Obsidian users deciding how Claude Code should access and maintain vault knowledge",
    heroBullets: [
      "If Claude Code can reach your local Markdown vault, direct filesystem access is the smallest useful integration.",
      "An IDE bridge adds the active file and selection; an Obsidian MCP server can add structured vault operations or another client surface.",
      "Access is not maintenance: a durable AI knowledge base also needs sources, provenance, refresh rules, and review.",
    ],
    quickAnswer:
      "Start with direct filesystem access: run Claude Code from the vault or give it access to the specific Markdown folders it needs. Add an Obsidian IDE bridge when the active file and selection should follow your editor. Add Obsidian MCP when you need structured vault operations, Obsidian-specific commands, or another supported client. None of those connection layers automatically creates a maintained, source-backed AI knowledge base.",
    quickAnswerLink: {
      label: "Compare the LLM-wiki architecture and workflow",
      href: "/learn/distilled-wiki-pages-ai-memory",
    },
    problem:
      "“Obsidian + Claude Code” hides several different jobs. Claude Code can already read and edit accessible Markdown files. An IDE bridge supplies live editor context. An MCP server exposes structured tools or more client connections. An embedded plugin puts an assistant inside Obsidian. Choose by the missing capability, not by installing every layer. Then decide separately whether the notes merely need access or need an evidence-backed lifecycle that survives sessions and agents.",
    wenlanFit:
      "Wenlan can register an Obsidian vault as a read-only Source and resync its Markdown on demand. It can combine those Sources with captured decisions into maintained Pages with citations, staleness, revisions, and human review. Obsidian remains the human-owned writing surface; Wenlan supplies the cross-session knowledge lifecycle when that extra layer is useful.",
    actionHeading: "Choose the smallest integration layer that solves the job",
    actionIntro:
      "Treat file access, editor context, vault tools, and knowledge maintenance as separate decisions.",
    actionBullets: [
      "Start with direct filesystem access for ordinary Markdown read, search, and edit tasks. Scope Claude Code to the vault or folders it actually needs.",
      "Add a Claude Code IDE bridge when the missing input is the active file and selection, not another retrieval system.",
      "Add Obsidian MCP when the job needs structured vault operations, Obsidian commands, workspace context, or a supported non-IDE client.",
      "Choose an embedded assistant only when working inside the Obsidian UI is itself the desired experience.",
      "Add Wenlan when decisions must move across clients and sessions, stay tied to Sources, compile into maintained Pages, and wait for review when human writing would change.",
      "Verify the boundary with a small task before broadening access: read one note, edit a disposable note, confirm the active-file context, and inspect which process owns each write.",
    ],
    caution:
      "A connection is not a governance policy. Check which process can read or write the vault, what context is sent to the model provider, whether a bridge is localhost-only, how writes are approved, and how the vault is backed up. Keep human-authored notes as the source of truth; add a knowledge lifecycle only for conclusions that need provenance, refresh, handoff, or reuse outside Obsidian.",
    faq: [
      "Do I need MCP to use Claude Code with Obsidian?",
      "No. For plain Markdown files, direct filesystem access may be enough. Use an IDE bridge for live editor context and MCP for structured Obsidian operations or another supported client.",
      "Does connecting Claude Code turn an Obsidian vault into a durable AI knowledge base?",
      "Not by itself. The connection gives an agent access or tools. Durable knowledge also needs explicit source boundaries, provenance, refresh behavior, conflict handling, review, and a way to carry current conclusions across sessions.",
    ],
    relatedSlugs: [
      "distilled-wiki-pages-ai-memory",
      "markdown-local-index-ai-memory",
      "source-backed-wiki-pages-ai-work",
      "ai-work-memory-vs-knowledge-base",
    ],
    officialReferences: [
      {
        label: "Obsidian data storage docs",
        href: "https://obsidian.md/help/data-storage",
      },
      {
        label: "Obsidian plugins docs",
        href: "https://obsidian.md/help/plugins",
      },
      {
        label: "obsidian-claude-code embedded assistant",
        href: "https://github.com/Roasbeef/obsidian-claude-code",
      },
      {
        label: "Claude Code IDE bridge for Obsidian",
        href: "https://github.com/petersolopov/obsidian-claude-ide",
      },
      {
        label: "Obsidian Claude Code MCP bridge",
        href: "https://github.com/iansinnott/obsidian-claude-code-mcp",
      },
      {
        label: "Wenlan maintained knowledge model",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan daily workflow",
        href: "https://github.com/7xuanlu/wenlan#daily-workflow",
      },
      {
        label: "Wenlan data and privacy docs",
        href: "https://wenlan.app/docs/data-and-privacy",
      },
    ],
    comparisonTable: {
      competitorName: "Obsidian + Claude Code integrations",
      rows: [
        {
          dimension: "Direct vault access",
          wenlan: "Can read an Obsidian vault as a read-only Source and resync its Markdown on demand.",
          competitor: "Claude Code can read and edit accessible Markdown files directly through the filesystem.",
        },
        {
          dimension: "Editor context",
          wenlan: "Does not try to be an Obsidian editor bridge.",
          competitor: "A Claude Code IDE plugin can share the active file and selection while file edits remain direct.",
        },
        {
          dimension: "Structured tool surface",
          wenlan: "MCP tools expose capture, recall, Sources, Pages, handoff, distillation, and review across supported clients.",
          competitor: "An Obsidian MCP bridge can expose vault files, workspace context, and Obsidian-specific operations.",
        },
        {
          dimension: "Knowledge lifecycle",
          wenlan: "Sources and captured decisions support cited Pages with staleness, refresh, revisions, and human review.",
          competitor: "The vault remains a durable Markdown store; provenance, refresh, and review semantics depend on the chosen project and workflow.",
        },
        {
          dimension: "Best fit",
          wenlan: "Knowledge that should stay current and reusable across sessions and multiple AI clients.",
          competitor: "Working with vault files, live Obsidian editor context, or Obsidian-specific actions from Claude Code.",
        },
      ],
    },
  },
  {
    slug: "wenlan-vs-notion-ai",
    eyebrow: "Comparison",
    category: "Comparisons",
    title: "Wenlan vs Notion AI: Local AI Work Memory or Team Workspace AI?",
    description:
      "Compare Wenlan's local AI work memory with Notion AI's workspace, agents, meetings, and enterprise search features.",
    metaTitle: "Wenlan vs Notion AI | Local AI Work Memory",
    metaDescription:
      "Notion AI works from hosted workspace content and Notion MCP. Wenlan stores the AI work memory layer locally by default for MCP clients.",
    keywords: [
      "Wenlan vs Notion AI",
      "Notion AI memory alternative",
      "local AI work memory",
      "Notion AI agents comparison",
      "AI workspace memory",
    ],
    audience: "Teams and builders comparing workspace AI with local agent memory",
    heroBullets: [
      "Notion AI is built around the Notion workspace.",
      "Wenlan is built around local AI work context across tools.",
      "The right choice depends on whether the source of truth is a team workspace or your local agent workflow.",
    ],
    quickAnswer:
      "Use Notion AI when your work lives in Notion and you need workspace agents, AI Meeting Notes, enterprise search, hosted Notion MCP, and team governance. Use Wenlan when the memory layer should be stored locally by default and move across coding agents and MCP clients.",
    problem:
      "Workspace AI and agent memory can sound similar because both answer questions from context. The difference is where the context lives and what the AI is trying to continue.",
    wenlanFit:
      "Wenlan is not a company workspace. It is a local, source-backed LLM wiki for AI work: captures, handoffs, cited pages, and retrieval context across Claude Code, Codex, Cursor, Claude Desktop, ChatGPT, and other clients.",
    actionHeading: "Choose by source of truth",
    actionIntro:
      "Ask whether the memory belongs to a workspace or to a local AI work loop.",
    actionBullets: [
      "Choose Notion AI for Notion pages, databases, AI Meeting Notes, workspace search, Notion MCP, and team automation.",
      "Choose Wenlan for local project memory, code-agent handoffs, MCP clients, and inspectable ~/.wenlan artifacts.",
      "Use both if Notion is your team workspace and Wenlan is your AI coding memory layer.",
      "Do not duplicate everything across both; capture the consequence that future AI work needs.",
    ],
    caution:
      "Team workspace governance and local-first control solve different problems. Wenlan stores the memory layer locally by default, but connected AI clients may still send retrieved context to their model providers.",
    faq: [
      "Can Notion AI replace Wenlan for coding-agent memory?",
      "Not directly. Notion MCP can connect external AI tools to Notion workspace content, but the source of truth remains the hosted workspace. Wenlan is designed around a local daemon and ~/.wenlan artifacts.",
      "Can Wenlan replace Notion?",
      "No. Wenlan is not a workspace, docs database, calendar, or project-management suite.",
    ],
    relatedSlugs: ["ai-work-memory-vs-knowledge-base", "local-first-ai-memory", "wenlan-vs-obsidian-ai-memory"],
    officialReferences: [
      {
        label: "Notion AI official product page",
        href: "https://www.notion.com/product/ai",
      },
      {
        label: "Notion MCP docs",
        href: "https://developers.notion.com/guides/mcp/overview",
      },
      {
        label: "Wenlan data and privacy docs",
        href: "https://wenlan.app/docs/data-and-privacy",
      },
    ],
    comparisonTable: {
      competitorName: "Notion AI",
      rows: [
        {
          dimension: "Primary context",
          wenlan: "Local AI work memory, sessions, pages, and MCP clients.",
          competitor: "Notion workspace pages, databases, connected apps, meetings, and agents.",
        },
        {
          dimension: "Control boundary",
          wenlan: "Local daemon and artifacts by default.",
          competitor: "Hosted workspace with admin, security, and enterprise controls.",
        },
        {
          dimension: "Best fit",
          wenlan: "Coding-agent continuity and personal/local work memory.",
          competitor: "Team workspace automation, search, docs, and meeting memory.",
        },
        {
          dimension: "Integration shape",
          wenlan: "MCP clients and local CLI/plugin workflows.",
          competitor: "Notion AI, hosted Notion MCP, and workspace/app connections.",
        },
      ],
    },
  },
  {
    slug: "wenlan-vs-mem0",
    eyebrow: "Comparison",
    category: "Comparisons",
    title: "Wenlan vs Mem0: Personal AI Work Memory or App Memory Infrastructure?",
    description:
      "Compare Wenlan's local AI work-memory loop with Mem0's memory infrastructure for AI agents and applications.",
    metaTitle: "Wenlan vs Mem0 | AI Memory Comparison",
    metaDescription:
      "Mem0 is memory infrastructure for agents and apps. Wenlan is a local-first personal knowledge library for AI work across Claude Code, Cursor, Codex, and MCP clients.",
    keywords: [
      "Wenlan vs Mem0",
      "Mem0 alternative",
      "AI memory layer comparison",
      "local AI work memory",
      "memory infrastructure vs work memory",
    ],
    audience: "Developers comparing app memory infrastructure with personal AI work memory",
    heroBullets: [
      "Mem0 offers Platform, Open Source, and MCP/OpenMemory paths.",
      "Wenlan positions as a local-first personal knowledge library for AI work.",
      "Choose by whether you need managed/app memory, self-hosted infrastructure, or a local personal work loop.",
    ],
    quickAnswer:
      "Choose Mem0 Platform when you are adding managed memory to an AI application or agent product, Mem0 Open Source when you want to self-host that stack, and Mem0 MCP/OpenMemory when you want Mem0 memory through coding agents. Choose Wenlan when you want a local daemon, source-backed pages, handoffs, readable artifacts, and git/provenance for your own AI work sessions.",
    problem:
      "The phrase AI memory layer can mean two different things: infrastructure an app developer embeds, or a local work-memory layer an AI power user lives with every day.",
    wenlanFit:
      "Wenlan deliberately avoids being a generic memory infrastructure SDK. It is a source-backed LLM wiki for people using Claude Code, Codex, Cursor, Claude Desktop, ChatGPT, and other MCP clients against their own daemon.",
    actionHeading: "Choose by builder role",
    actionIntro:
      "Ask whether you are building memory into an app or using memory for your own work.",
    actionBullets: [
      "Choose Mem0 Platform for managed product/application memory infrastructure.",
      "Choose Mem0 Open Source when you want self-hosted Mem0 infrastructure.",
      "Choose Mem0 MCP/OpenMemory when Mem0's coding-agent MCP path fits your workflow.",
      "Choose Wenlan for local AI work continuity and inspectable artifacts.",
      "Use Wenlan when handoffs, spaces, pages, and local git history matter.",
      "Use app-memory infrastructure when end users need memory inside your product.",
    ],
    caution:
      "Do not judge only by feature names. The operational model and intended user are different.",
    faq: [
      "Is Wenlan an SDK for app developers?",
      "No. Wenlan is for people using AI daily, not as a backend for other apps building memory features.",
      "Can a developer use both?",
      "Yes. A developer might use Mem0 in an app and Wenlan for their own coding-agent work loop.",
    ],
    relatedSlugs: ["ai-agent-memory-local-vs-cloud", "project-scope-ai-memory", "wenlan-vs-mcp-memory-service"],
    officialReferences: [
      {
        label: "Mem0 official site",
        href: "https://mem0.ai/",
      },
      {
        label: "Mem0 MCP docs",
        href: "https://docs.mem0.ai/platform/mem0-mcp",
      },
      {
        label: "Mem0 Open Source overview",
        href: "https://docs.mem0.ai/open-source/overview",
      },
      {
        label: "Wenlan data and privacy docs",
        href: "https://wenlan.app/docs/data-and-privacy",
      },
      {
        label: "Wenlan core concepts docs",
        href: "https://wenlan.app/docs/core-concepts",
      },
    ],
    comparisonTable: {
      competitorName: "Mem0",
      rows: [
        {
          dimension: "Primary user",
          wenlan: "AI power users and developers carrying their own work context.",
          competitor: "Developers adding memory to AI agents/apps, plus coding-agent users using Mem0 MCP/OpenMemory.",
        },
        {
          dimension: "Product shape",
          wenlan: "Local daemon, MCP connector, Claude Code plugin, pages, git history.",
          competitor: "Managed Platform, Open Source self-hosted stack, SDK/API surfaces, and hosted MCP/OpenMemory integrations.",
        },
        {
          dimension: "MCP boundary",
          wenlan: "Wenlan MCP talks to a local daemon and local store.",
          competitor: "Mem0 MCP exposes Mem0 memory through a hosted HTTP MCP path tied to Platform/API-key flows, with OSS/self-hosted options available separately.",
        },
        {
          dimension: "Best fit",
          wenlan: "Cross-tool personal/project work memory.",
          competitor: "Application-level persistent context or Mem0-managed coding-agent memory.",
        },
        {
          dimension: "Default trust model",
          wenlan: "Local-first, inspectable artifacts by default.",
          competitor: "Mem0 Platform is hosted; Mem0 Open Source is self-hosted; Mem0 MCP/OpenMemory uses Mem0's MCP memory path.",
        },
      ],
    },
  },
];

const trustArticles: BaseSpec[] = [
  {
    slug: "prevent-multi-agent-knowledge-conflicts",
    eyebrow: "Shared knowledge maintenance",
    category: "Workflows",
    title: "How to Prevent Multi-Agent Knowledge Conflicts and Stale Conclusions",
    description:
      "Prevent AI agents from overwriting shared knowledge, promoting unsupported claims, or reusing conclusions after their sources change.",
    metaTitle: "Prevent Multi-Agent Knowledge Conflicts | Wenlan",
    metaDescription:
      "Use evidence, candidate claims, version checks, review, and history to prevent stale or conflicting knowledge from spreading across AI agents.",
    keywords: [
      "multi agent shared knowledge conflict",
      "prevent stale agent knowledge",
      "AI agent memory conflict resolution",
      "multiple agents overwrite shared memory",
      "multi agent knowledge base governance",
      "shared agent knowledge provenance",
    ],
    publishedAt: "2026-08-24",
    updatedAt: "2026-08-24",
    audience:
      "Teams whose coding, research, or operations agents read from and write to the same project knowledge",
    heroBullets: [
      "Do not let every agent write directly into accepted shared knowledge.",
      "Keep evidence, candidate claims, and accepted conclusions as separate states.",
      "Detect stale writes before acceptance, review contradictions, and preserve the history they replace.",
    ],
    quickAnswer:
      "Prevent multi-agent knowledge conflicts by treating every agent write as a candidate claim, not immediate shared truth. Store its source, writer, scope, captured time, and expected version; re-read the target before acceptance; if it changed, do not publish the stale candidate. Compare contradictions with the current source, then let a reviewer promote, replace, or leave the claim unresolved. Preserve the replaced conclusion and its provenance so later agents can see why it changed.",
    problem:
      "The failure appears when one agent reads version A, another changes the source or conclusion, and the first agent later writes from its stale snapshot. It also appears when two plausible summaries contradict each other or an agent records a claimed completion without a verifiable result. A shared file or vector store makes the information visible, but does not decide which statement is current or supported.",
    wenlanFit:
      "Wenlan separates Sources, atomic Memories, and maintained Pages. Captures keep provenance; explicit replacements preserve a supersedes chain; stale Pages can be rebuilt from current support; machine changes to human-owned writing become reviewable revisions; and an optional reconcile pass can queue protected conflicts instead of overwriting history. That pass is off by default and does not replace source review.",
    actionHeading: "Use a staged write and review loop",
    actionIntro:
      "Use one small conflict fixture before several agents depend on the same knowledge base. The slash-command recipe below requires the Wenlan Codex plugin after `/setup`.",
    actionBullets: [
      "Define the authoritative source and the write scope for the fact or Page. Agent identity alone is not authority.",
      "Record the evidence, candidate claim, writer, source revision, captured time, and expected version together.",
      "Before accepting a write, re-read the source and target and compare them with the version recorded by the agent. A mismatch should stop the workflow before `write_page` and force a fresh read.",
      "Compare competing claims with the original evidence. Mark them supported, contradicted, stale, replaced, or unresolved; do not let recency alone decide.",
      "Promote only reviewed claims into accepted shared knowledge. Preserve the previous conclusion, its citations, and the replacement reason.",
      "Run the same recall from a second agent and verify that it sees the accepted state, the current source, and any unresolved conflict rather than a silent last write.",
    ],
    code: {
      label: "Wenlan Codex plugin: inspect, capture, distill, and review",
      code: "/pages <shared topic>\n/capture <candidate claim + source + why it matters>\n/distill <shared topic>\n/lint\n/curate",
    },
    caution:
      "Wenlan is not a multi-agent scheduler, distributed lock service, or automatic consensus engine. Repository files, tests, specifications, and maintained first-party documents remain authoritative. The current public MCP `write_page` does not accept `expected_version`, so this recipe performs the source-and-version comparison before the write instead of claiming an atomic stale-write rejection. Human-owned Page refreshes become reviewable revisions. Agents without the Codex plugin can use local MCP tools (`recall`, `capture`, `distill`, `lint`, and `list_pending_revisions`) or the local CLI (`wenlan pages`, `wenlan capture`, `wenlan lint`, and `wenlan curate revisions`). Local Page refresh is available only through local stdio MCP; semantic conflicts still require evidence and review.",
    faq: [
      "Should every agent write to the same shared Page?",
      "No. Agents can capture atomic evidence and candidate claims, but accepted Pages should have a defined scope and review path so one agent cannot silently overwrite another's supported conclusion.",
      "Does the optional reconcile pass resolve every contradiction automatically?",
      "No. It can queue protected conflicts for review and preserve supersession, but it is off by default and cannot decide whether the underlying source is correct.",
    ],
    relatedSlugs: [
      "multi-agent-memory-workflow",
      "source-backed-wiki-pages-ai-work",
      "verify-ai-knowledge-base-citations",
      "build-business-metric-definition-knowledge-base",
      "distilled-wiki-pages-ai-memory",
    ],
    officialReferences: [
      {
        label: "Wenlan knowledge lifecycle",
        href: "https://github.com/7xuanlu/wenlan#how-knowledge-stays-current",
      },
      {
        label: "Wenlan review and trust guide",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "Governed Shared Memory for Multi-Agent LLM Systems",
        href: "https://arxiv.org/abs/2606.24535",
      },
      {
        label: "MemTX transactional belief commit",
        href: "https://arxiv.org/abs/2607.23929",
      },
      {
        label: "Hindsight multi-agent shared-memory discussion",
        href: "https://github.com/vectorize-io/hindsight/discussions/1576",
      },
      {
        label: "Anthropic SDK multi-agent memory discussion",
        href: "https://github.com/anthropics/anthropic-sdk-python/discussions/1419",
      },
    ],
    cta: {
      heading: "Test one conflicting conclusion",
      body: "Connect two agents to Wenlan, stage one conflicting claim with its source, and verify that review and history stay visible before either agent reuses it.",
    },
  },
  {
    slug: "fix-pdf-ingestion-ai-knowledge-base",
    eyebrow: "Ingestion troubleshooting",
    category: "Workflows",
    title: "PDF Failed to Ingest into Your AI Knowledge Base? Diagnose It First",
    description:
      "Diagnose empty, skipped, malformed, oversized, or image-only PDFs before trusting an AI knowledge base or RAG answer.",
    metaTitle: "AI Knowledge Base PDF Ingestion Failed? Fix It",
    metaDescription:
      "Troubleshoot AI knowledge-base PDF ingestion: check the text layer, OCR scanned pages, file limits, parser errors, and extracted evidence.",
    keywords: [
      "AI knowledge base PDF ingestion failed",
      "scanned PDF AI knowledge base OCR",
      "PDF RAG empty chunks",
      "AI knowledge base document parsing error",
      "PDF text extraction failed",
      "knowledge base skipped PDF",
    ],
    publishedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    audience:
      "People whose AI knowledge-base import reports success, skip, or error but produces empty, incomplete, or unusable PDF content",
    heroBullets: [
      "First distinguish a text PDF from a scanned or image-only PDF.",
      "Treat found, ingested, skipped, and error counts as diagnostics, not proof that usable text reached retrieval.",
      "Verify one known answer and its exact source before trusting the document set.",
    ],
    quickAnswer:
      "If a PDF produces no usable knowledge, first try selecting and copying text from the file. An image-only scan needs OCR before Wenlan can ingest it; Wenlan has no OCR in v1. Next check that the PDF is at most 10 MB, is not malformed, and contains enough real text. Run `wenlan sources add <path>`, inspect the found, ingested, skipped, and error counts, then verify that a known passage can be retrieved and cited. A successful registration or batch summary alone does not prove that extraction succeeded.",
    problem:
      "PDF ingestion can fail loudly with a parser error or quietly with an empty text layer. The dangerous case is an import that looks complete while the knowledge base contains no useful chunks, loses layout relationships, or cannot cite the passage a user expects.",
    wenlanFit:
      "Wenlan accepts `.md`, `.txt`, and text-extractable `.pdf` Sources. Its current source connector caps PDFs at 10 MB, skips image-only or near-empty extraction, reports malformed PDF parsing as an error, and continues processing the rest of a folder. It does not perform OCR in v1.",
    actionHeading: "Diagnose the file before changing retrieval",
    actionIntro:
      "Work from the source inward. Do not tune embeddings or prompts until you know the expected text actually entered the index.",
    actionBullets: [
      "Classify the PDF: if text cannot be selected or copied, treat it as a scan or image-only document.",
      "OCR scanned pages outside Wenlan, then save a text-extractable PDF or a clean `.md` or `.txt` file. Spot-check names, dates, numbers, tables, and page order against the original.",
      "Check the input boundary: folder Sources accept `.md`, `.txt`, and `.pdf`; PDFs over 10 MB, unsupported extensions, hidden files, symlinks, and skipped directories do not enter the normal folder scan.",
      "Run `wenlan sources add <path>` and record the found, ingested, skipped, and error counts. An error suggests read or parse failure; a skip can mean unchanged content, no extractable text, or content below the minimum quality floor.",
      "Wait for document processing, then retrieve a distinctive sentence that definitely exists in the source. Confirm the result opens the intended file or source reference.",
      "Ask one answerable question and one question the document cannot answer. The first should cite supporting text; the second should remain unknown.",
      "If extraction is incomplete, simplify the source to Markdown or plain text and re-run the same acceptance test. Do not hide missing tables or scanned pages behind a fluent summary.",
    ],
    code: {
      label: "Register or resync one diagnostic source",
      code: "wenlan status\nwenlan sources add ~/Knowledge/pdf-diagnostic",
    },
    caution:
      "OCR can introduce wrong characters, reading order, and table structure. A searchable PDF is not automatically a faithful PDF. Compare important passages with the rendered page and keep the original file authoritative.",
    faq: [
      "Why was my PDF found but no useful text appeared?",
      "The file may be image-only, contain too little extractable text, fail parsing, or still be processing. Check the text layer and source result, then retrieve a distinctive known sentence instead of trusting the batch summary.",
      "Does Wenlan OCR scanned PDFs?",
      "No. The current v1 document connector extracts an existing text layer; scan or image-only PDFs need OCR before import.",
    ],
    relatedSlugs: [
      "build-local-ai-knowledge-base-from-documents",
      "choose-ai-knowledge-base-tool",
      "verify-ai-knowledge-base-citations",
      "source-backed-wiki-pages-ai-work",
    ],
    officialReferences: [
      {
        label: "Wenlan supported document sources",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan directory ingestion source and limits",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-core/src/sources/directory.rs",
      },
      {
        label: "Wenlan folder-ingestion acceptance test",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-core/tests/folder_ingest_e2e.rs",
      },
      {
        label: "Google Cloud PDF OCR and layout parsing",
        href: "https://cloud.google.com/generative-ai-app-builder/docs/parse-chunk-documents",
      },
      {
        label: "DeepTutor scanned-PDF empty-document issue",
        href: "https://github.com/HKUDS/DeepTutor/issues/431",
      },
      {
        label: "Kodit silent PDF extraction failure issue",
        href: "https://github.com/helixml/kodit/issues/553",
      },
    ],
    cta: {
      heading: "Verify one PDF before importing the archive",
      body: "Install Wenlan, add one controlled document, and prove that its text, source, and citations survive the complete ingestion path.",
    },
  },
  {
    slug: "when-ai-agent-should-query-knowledge-base",
    eyebrow: "Retrieval policy",
    category: "Workflows",
    title: "When Should an AI Agent Query a Knowledge Base?",
    description:
      "Use a query-or-skip policy so AI agents retrieve authoritative knowledge when needed without repeatedly loading irrelevant documents into context.",
    metaTitle: "When Should an AI Agent Query a Knowledge Base?",
    metaDescription:
      "Decide when an AI agent should query a knowledge base, skip retrieval, inspect an index, or open the exact source without wasting context.",
    keywords: [
      "when should AI agent query knowledge base",
      "AI agent knowledge retrieval policy",
      "reduce AI agent context token cost",
      "avoid rereading documents AI agent",
      "just in time context retrieval",
      "progressive disclosure AI agent",
    ],
    publishedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    audience:
      "Developers operating AI agents over documentation that is consulted repeatedly across tasks or sessions",
    heroBullets: [
      "Query when the answer depends on current, private, project-specific, or citable evidence.",
      "Skip retrieval when the exact authoritative source is already in context or the task does not depend on the corpus.",
      "Use an index to choose a source, then open the smallest exact passage needed to verify the answer.",
    ],
    quickAnswer:
      "An AI agent should query a knowledge base when the task depends on current, organization-specific, private, or citable information that is not already available in its context. It should skip retrieval for greetings, fixed control flow, or a task whose exact authoritative source is already open. When retrieval is needed, inspect a compact index first, load the smallest relevant page, and return to the cited source for consequential claims.",
    problem:
      "Always injecting a document collection adds irrelevant text, latency, and attention pressure. Never retrieving forces the agent to guess or repeatedly rediscover project decisions. The useful boundary is a reproducible task-level policy, not a promise that every retrieval saves a fixed number of tokens.",
    wenlanFit:
      "Wenlan keeps Sources, atomic knowledge, and maintained Pages separate. An agent can recall a narrow topic or open a relevant Page, inspect its citations, and return to the current source instead of replaying a whole archive; Wenlan does not replace direct code, test, policy, or document verification.",
    actionHeading: "Use this query-or-skip decision policy",
    actionIntro:
      "Classify the task before searching, then increase context only when the previous layer cannot support the answer. The slash-command example requires the Wenlan Codex plugin: install it and run /setup once. The wenlan connect codex command configures only the MCP connection; MCP-only clients should call Wenlan recall and inspect the Page results it returns. Use the local wenlan pages <topic> CLI when you need to list or open Pages without the plugin.",
    actionBullets: [
      "Query: the answer depends on current project facts, private material, organizational policy, exact numbers, or a citation.",
      "Pre-retrieve: every valid answer must use one controlled source, such as a compliance rule or operating procedure.",
      "Let the agent decide: only some requests in the workflow need the corpus, and the tool description states its scope and exclusions.",
      "Skip: the task is a greeting, static routing step, deterministic operation, or the exact authoritative file is already open.",
      "Progressively disclose: inspect titles, paths, abstracts, or a maintained index before loading the full page or document.",
      "Verify: open the exact cited passage for important claims and mark unavailable evidence unknown rather than filling the gap from memory.",
      "Measure: record retrieved tokens, latency, answer quality, and failed searches on your own workload; do not reuse another system's savings percentage as a guarantee.",
    ],
    code: {
      label: "Retrieve a narrow topic, then inspect its maintained page",
      code: "# Wenlan plugin:\n/recall <topic>\n/pages <topic>\n\n# MCP-only client: call Wenlan recall and inspect returned Page results.\n# Local CLI for Page listing or opening:\nwenlan pages <topic>",
    },
    caution:
      "Smaller context is not automatically better. A skipped lookup can save tokens and still produce a wrong answer; an eager lookup can add irrelevant chunks and reduce focus. Keep the authoritative source boundary explicit and measure retrieval behavior with representative tasks.",
    faq: [
      "Should an AI agent query the knowledge base for every question?",
      "No. Always-on retrieval is appropriate only when every answer must use a controlled source. Otherwise expose a clearly scoped tool and let the workflow or agent query only when the task depends on that corpus.",
      "Does a knowledge base guarantee lower token cost?",
      "No. A compact index and selective retrieval can reduce repeated document reading, but embeddings, tool calls, returned chunks, and failed searches also cost time or tokens. Measure the complete workflow on your own tasks.",
    ],
    relatedSlugs: [
      "ai-work-memory-vs-knowledge-base",
      "coding-agent-source-backed-knowledge-base",
      "source-backed-wiki-pages-ai-work",
      "verify-ai-knowledge-base-citations",
    ],
    officialReferences: [
      {
        label: "Anthropic context engineering for AI agents",
        href: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      },
      {
        label: "CareerWise knowledge-search tool-use case",
        href: "https://www.cythilya.tw/2026/07/16/careerwise-search-knowledge-tool/",
      },
      {
        label: "JitAI scenario-based knowledge-base retrieval",
        href: "https://jit.pro/zh/docs/devguide/knowledge-base/integrate-knowledge-base-into-agent",
      },
      {
        label: "OpenViking progressive context layers",
        href: "https://docs.openviking.ai/zh/concepts/03-context-layers",
      },
      {
        label: "Wenlan source-backed pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
    ],
    comparisonTable: {
      competitorName: "Retrieval action",
      rows: [
        {
          dimension: "Current, private, or citable fact",
          wenlan: "Query a narrow topic, then open the cited current source.",
          competitor: "Query",
        },
        {
          dimension: "Mandatory controlled evidence",
          wenlan: "Pre-retrieve the required source and keep later source access available.",
          competitor: "Pre-retrieve",
        },
        {
          dimension: "Exact authoritative file already open",
          wenlan: "Read and verify that file directly; do not add a redundant search.",
          competitor: "Skip retrieval",
        },
        {
          dimension: "Large or unfamiliar corpus",
          wenlan: "Inspect the index or maintained page before loading exact source sections.",
          competitor: "Progressive disclosure",
        },
      ],
    },
    cta: {
      heading: "Test one retrieval boundary",
      body: "Connect Wenlan, choose one repeated project question, and compare always-load, query-on-demand, and direct-source workflows without assuming a token-saving result.",
    },
  },
  {
    slug: "verify-ai-knowledge-base-citations",
    eyebrow: "Trust check",
    category: "Workflows",
    title: "How to Verify AI Knowledge Base Citations and Unsupported Claims",
    description:
      "Audit a RAG or AI knowledge-base answer claim by claim to find wrong pages, mismatched chunks, stale sources, and unsupported conclusions.",
    metaTitle: "Verify AI Knowledge Base Citations | Wenlan",
    metaDescription:
      "Check AI knowledge-base citations claim by claim. Diagnose wrong pages, mismatched chunks, stale revisions, and unsupported RAG answers.",
    keywords: [
      "verify AI knowledge base citations",
      "RAG wrong page citations",
      "RAG citation faithfulness",
      "unsupported claims RAG",
      "AI knowledge base provenance",
      "citation verification checklist",
    ],
    publishedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    audience:
      "People debugging AI knowledge-base answers that look grounded but cite the wrong page, chunk, version, or source",
    heroBullets: [
      "A citation marker proves that a source was attached, not that the source supports the claim.",
      "Check each important claim against the exact page, chunk, and source revision.",
      "Classify the result as supported, partial, unsupported, or stale before reusing the answer.",
    ],
    quickAnswer:
      "To verify an AI knowledge-base answer, split it into testable claims, open the exact cited page or chunk for each claim, and record whether the current source fully supports it. Treat missing, broken, wrong-page, mismatched, and stale citations as different failures instead of one generic hallucination score.",
    problem:
      "An answer can be factually plausible while its citation points to the first retrieved source, an unrelated chunk, or an older document revision. The failure stays hidden when reviewers check only that citation markers exist instead of comparing each claim with the cited evidence.",
    wenlanFit:
      "Wenlan keeps Sources, atomic knowledge, and maintained Pages separate. Page citations, source IDs, revisions, stale state, lint, and human review make the evidence trail inspectable, but Wenlan does not automatically prove that every source is true or replace review of important claims.",
    actionHeading: "Run a claim-to-evidence audit",
    actionIntro:
      "Start with one suspect answer. Keep the audit small enough that another person can reproduce every decision.",
    actionBullets: [
      "Copy the answer into separate factual claims; ignore transitions and opinions that make no factual assertion.",
      "For each claim, record the citation marker, source ID, document title, page or section, and source revision when available.",
      "Open the cited location and check whether it supports the whole claim, only part of it, a different claim, or nothing at all.",
      "Mark the claim supported, partial, unsupported, or stale; do not convert a missing row or unavailable source into a pass.",
      "Check numbers, negations, attribution, scope, and dates separately because a nearby passage can still contradict the answer.",
      "Correct the answer or keep the conclusion unknown before refreshing a maintained page.",
      "Run lint and human review, then repeat the same question to confirm the repaired answer returns to the intended source.",
    ],
    code: {
      label: "Inspect and review one Wenlan Page",
      code: "/pages <topic>\n/lint\n/curate",
    },
    caution:
      "This workflow is a diagnostic checklist, not an automatic RAG benchmark. A cited source may itself be wrong, outdated, or non-authoritative, so consequential claims still require the maintained first-party source and appropriate human review.",
    faq: [
      "Does a citation mean the answer is grounded?",
      "No. It means a source reference exists. The cited location must still support the exact claim, scope, number, attribution, and current version.",
      "What should I do when the citation points to the wrong page?",
      "Record it as a mismatched citation, locate the actual supporting source if one exists, and correct or withhold the claim. Do not silently keep the answer because it sounds plausible.",
    ],
    relatedSlugs: [
      "fix-pdf-ingestion-ai-knowledge-base",
      "source-backed-wiki-pages-ai-work",
      "choose-ai-knowledge-base-tool",
      "distilled-wiki-pages-ai-memory",
      "when-ai-agent-should-query-knowledge-base",
      "ai-memory-provenance",
      "test-ai-knowledge-base-retrieval-after-changes",
      "source-backed-research-knowledge-base",
      "build-client-project-knowledge-base-for-consulting",
      "build-investment-research-knowledge-base",
      "build-product-research-knowledge-base-for-prd",
      "build-sre-incident-knowledge-base",
      "build-ict-supplier-due-diligence-evidence-pack",
      "build-customer-support-answer-knowledge-base",
      "build-business-metric-definition-knowledge-base",
    ],
    officialReferences: [
      {
        label: "Anthropic citations documentation",
        href: "https://platform.claude.com/docs/en/build-with-claude/citations",
      },
      {
        label: "Open WebUI wrong-source issue",
        href: "https://github.com/open-webui/open-webui/issues/12655",
      },
      {
        label: "Open WebUI identical-chunk citation issue",
        href: "https://github.com/open-webui/open-webui/issues/20435",
      },
      {
        label: "Wenlan review and trust guide",
        href: "https://wenlan.app/docs/review-and-trust",
      },
    ],
    cta: {
      heading: "Verify one answer before expanding the knowledge base",
      body: "Use Wenlan to inspect the Page, source IDs, stale state, lint findings, and review path, then keep only claims the current evidence supports.",
    },
  },
  {
    slug: "source-backed-wiki-pages-ai-work",
    eyebrow: "Trust",
    category: "Concepts",
    title: "Build a Source-Backed AI Knowledge Base for Agents",
    description:
      "Build a source-backed AI knowledge base by connecting trusted sources, atomic knowledge, maintained LLM-wiki pages, citations, review, and refresh state.",
    metaTitle: "Build a Source-Backed AI Knowledge Base | Wenlan",
    metaDescription:
      "Build a source-backed AI knowledge base with trusted sources, atomic knowledge, maintained LLM-wiki pages, citations, review, and refresh.",
    keywords: [
      "source backed AI knowledge base",
      "AI knowledge base for agents",
      "maintained LLM wiki",
      "local AI knowledge base",
      "knowledge base provenance",
    ],
    publishedAt: "2026-06-06",
    updatedAt: "2026-09-08",
    audience: "Teams building a local AI knowledge base that agents and people can inspect",
    heroBullets: [
      "Trusted sources remain separate from the knowledge derived from them.",
      "Atomic knowledge preserves precise evidence before it becomes a page.",
      "Maintained pages carry citations, review, revisions, and refresh state.",
    ],
    quickAnswer:
      "To build a source-backed AI knowledge base, keep trusted sources, atomic knowledge, and maintained LLM-wiki pages separate. Connect them with citations, review, revisions, and refresh state so agents retrieve current answers and people can inspect why those answers are trusted.",
    problem:
      "Raw document dumps and one-off summaries both decay. A dump makes agents search too much context; a detached summary can become stale without showing which source supported it or what should refresh it.",
    wenlanFit:
      "Wenlan separates Sources, Memories, and Pages. Source IDs connect maintained pages to supporting knowledge, while revision, stale-reason, review, and refresh flows keep the knowledge base inspectable instead of silently rewriting it.",
    actionHeading: "Build the smallest maintainable loop",
    actionIntro:
      "Prove one topic end to end before importing a large archive.",
    actionBullets: [
      "Register or scope the trusted source that should support the topic.",
      "Capture one atomic fact with its source and why it matters.",
      "Distill only after a topic repeats or needs a reusable answer.",
      "Open the page and inspect the source IDs behind its claims.",
      "Run lint to find thin, stale, conflicting, or unsupported knowledge.",
      "Curate revisions and refresh the page when its evidence changes.",
    ],
    code: {
      label: "Wenlan knowledge-base loop",
      code: "/brief <topic>\n/capture <fact + source + why>\n/distill <topic>\n/pages <topic>\n/lint\n/curate",
    },
    caution:
      "A maintained page is still a claim, not ground truth. Verify important conclusions against the cited source, and mark the page stale when the source or operating context changes.",
    faq: [
      "Is an AI knowledge base the same as RAG?",
      "No. RAG retrieves source fragments at question time. A maintained knowledge base also keeps reusable answers, citations, review, and refresh state; it may use retrieval underneath.",
      "Should I import every note before starting?",
      "No. Start with one repeated, high-value topic and prove its source, capture, distill, inspection, lint, and review loop before expanding.",
    ],
    relatedSlugs: ["distilled-wiki-pages-ai-memory", "coding-agent-source-backed-knowledge-base", "when-ai-agent-should-query-knowledge-base", "verify-ai-knowledge-base-citations", "build-business-metric-definition-knowledge-base", "test-ai-knowledge-base-retrieval-after-changes", "prevent-multi-agent-knowledge-conflicts", "source-backed-research-knowledge-base", "build-client-project-knowledge-base-for-consulting", "build-investment-research-knowledge-base", "build-product-research-knowledge-base-for-prd", "build-sre-incident-knowledge-base", "review-before-trust-ai-memory", "ai-memory-provenance"],
    officialReferences: [
      {
        label: "Wenlan knowledge model",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan daily workflow",
        href: "https://github.com/7xuanlu/wenlan#daily-workflow",
      },
      {
        label: "Wenlan review and trust guide",
        href: "https://wenlan.app/docs/review-and-trust",
      },
    ],
  },
  {
    slug: "ai-memory-provenance",
    eyebrow: "Trust",
    category: "Concepts",
    title: "AI Memory Provenance: Why Source IDs Matter",
    description:
      "Understand why AI memory needs source trails, supersession, and review before old context steers new work.",
    metaTitle: "AI Memory Provenance: Why Source IDs Matter | Wenlan",
    metaDescription:
      "AI memory needs provenance so humans can inspect where facts came from, what superseded them, and whether pages are source-backed.",
    keywords: [
      "AI memory provenance",
      "source IDs AI memory",
      "traceable AI memory",
      "AI memory trust",
      "Wenlan provenance",
    ],
    audience: "Users who need memory they can trust, inspect, and correct",
    heroBullets: [
      "Provenance answers where a memory came from.",
      "Supersession answers what changed.",
      "Review answers whether a record should guide future context.",
    ],
    quickAnswer:
      "AI memory provenance is the trail that connects a remembered fact to source memory IDs, page source lists, source-agent metadata, and supersession or revision state. Session logs are useful context, but they are not per-fact provenance.",
    problem:
      "Without provenance, memory becomes a black box. An assistant may retrieve a stale claim, but the user cannot tell when it was created, what supported it, or whether it was superseded.",
    wenlanFit:
      "Wenlan keeps source_memory_ids with page records, exposes source memories through page-source APIs, tracks revisions, and writes local git history for readable artifacts so memory work stays inspectable.",
    actionHeading: "Prefer traceable memory",
    actionIntro:
      "Make memory useful without making it mysterious.",
    actionBullets: [
      "Capture why a fact matters.",
      "Use corrections when facts change.",
      "Use review for low-confidence or conflicting records.",
      "Use source-backed pages for synthesis.",
      "Use source IDs, page sources, revisions, review, and forget flows for atomic memory inspection.",
      "Use local git history for readable artifact changes.",
    ],
    caution:
      "Provenance does not make every memory true. It makes claims inspectable so stale or wrong records can be corrected.",
    faq: [
      "Is provenance only for compliance?",
      "No. It is practical debugging for memory: where did this belief come from and should it still guide work?",
      "Where do I find the source IDs?",
      "Use Wenlan page-source views or APIs for page sources, and use recall/review surfaces for atomic memory records and corrections.",
    ],
    relatedSlugs: [
      "source-backed-wiki-pages-ai-work",
      "ai-work-memory-vs-knowledge-base",
      "review-before-trust-ai-memory",
      "local-git-history-ai-memory",
    ],
  },
  {
    slug: "local-git-history-ai-memory",
    eyebrow: "Trust",
    category: "Concepts",
    title: "Local Git History for AI Memory Artifacts",
    description:
      "Why Wenlan versions readable memory artifacts in a local git repository under ~/.wenlan/.git.",
    metaTitle: "Local Git History for AI Memory Artifacts | Wenlan",
    metaDescription:
      "Wenlan keeps real local git history for readable pages, session logs, and project status Markdown so AI work artifacts can be inspected and recovered.",
    keywords: [
      "git history AI memory artifacts",
      "versioned AI memory artifacts",
      "Wenlan git history",
      "~/.wenlan .git",
      "recover AI memory artifacts",
    ],
    audience: "Developers who want memory changes to be auditable",
    heroBullets: [
      "Readable memory artifacts are not invisible mutations.",
      "Wenlan commits local artifacts into ~/.wenlan/.git.",
      "Git history makes diffs and recovery familiar.",
    ],
    quickAnswer:
      "Wenlan uses real local git history so readable pages, session logs, and project status Markdown can be inspected over time instead of silently changing. Raw memory captures remain in the daemon database.",
    problem:
      "AI memory often changes in ways users cannot inspect. That is risky when memory steers future coding, product, or client decisions.",
    wenlanFit:
      "Wenlan uses a familiar developer primitive for auditability. The memory database powers retrieval, while git history makes local artifacts easier to inspect and recover.",
    actionHeading: "Inspect memory changes",
    actionIntro:
      "Use git when the timeline matters.",
    actionBullets: [
      "Run git -C ~/.wenlan log --oneline for the local artifact timeline.",
      "Run git -C ~/.wenlan diff when you need to inspect readable artifact changes.",
      "Inspect page and session changes as normal diffs.",
      "Use correction before destructive deletion when history matters.",
      "Back up git history with the rest of ~/.wenlan.",
    ],
    caution:
      "Do not edit daemon-owned state behind Wenlan's back. Git history is an inspection and recovery surface, not a replacement for memory APIs.",
    faq: [
      "Is Wenlan using git as the database?",
      "No. The daemon owns the database and indexes. Git versions readable artifacts such as pages, session logs, and tracked project status Markdown.",
      "Can I revert a bad memory change?",
      "You can inspect and recover readable artifacts with git, but use Wenlan commands for normal memory correction, review, and forget flows.",
    ],
    relatedSlugs: ["local-first-ai-memory", "ai-memory-provenance", "markdown-local-index-ai-memory"],
  },
  {
    slug: "review-before-trust-ai-memory",
    eyebrow: "Trust",
    category: "Concepts",
    title: "How to Fix Stale AI Agent Memory",
    description:
      "A practical diagnostic for stale, contradictory, or wrong AI agent memory: inspect the source, preserve corrections, and delete only when necessary.",
    metaTitle: "Fix Stale AI Agent Memory: Diagnose & Correct | Wenlan",
    metaDescription:
      "Fix stale AI agent memory by tracing the source, checking scope, reviewing contradictions, preserving corrections, and deleting only records that should not remain.",
    keywords: [
      "stale AI agent memory",
      "contradictory agent memory",
      "fix AI memory",
      "AI memory debugging",
      "AI memory drift",
    ],
    updatedAt: "2026-07-24",
    audience: "AI-agent users debugging stale, conflicting, or wrong recalled context",
    heroBullets: [
      "Reproduce the bad recall before changing stored memory.",
      "Verify the current source and scope before deciding what is stale.",
      "Preserve corrections; permanently delete only what should not remain.",
    ],
    quickAnswer:
      "To fix stale AI agent memory, first reproduce the wrong recall and find the record that supplied it. Check the current source and scope, then decide whether the memory is outdated, contradictory, scoped to the wrong project, or simply false. Preserve useful history by capturing the current fact and reviewing the resulting revision; permanently delete only records that should not remain.",
    problem:
      "The failure is not always forgetting. An agent can confidently retrieve an old decision, mix facts from two projects, surface duplicate rules, or return both sides of a changed fact. That stale or contradictory agent memory can steer new work in the wrong direction while still looking plausible.",
    wenlanFit:
      "Wenlan keeps this workflow inspectable: /recall finds matching memories and source IDs, /lint deep can surface semantic contradiction candidates without changing data, and /curate revisions lets you accept or dismiss staged updates. /forget permanently deletes one explicit source ID and cannot be undone.",
    actionHeading: "Diagnose before you delete",
    actionIntro:
      "Treat stale memory like a debugging problem: reproduce it, trace it, correct it, and verify the same retrieval again.",
    actionBullets: [
      "Repeat the query that returned stale context and write down the expected current fact.",
      "Use /recall to inspect the matching content, source ID, revision state, and active project space.",
      "Check current source code, documentation, or the recorded decision before changing memory.",
      "Run /lint deep when you need a read-only pass over possible contradictions or duplicates.",
      "Capture the corrected current fact; if Wenlan stages a revision, inspect it with /curate revisions before accepting or dismissing it.",
      "Repeat the original recall and verify that current context now ranks ahead of obsolete context.",
      "Use /forget only for an explicit record that is wrong, sensitive, or should not remain in local history.",
    ],
    code: {
      label: "Stale-memory diagnostic",
      code: "/recall <stale topic>\n/lint deep\n/capture <current fact + why>\n/curate revisions\n/recall <same topic>\n# Destructive; cannot be undone:\n/forget <source_id>",
    },
    caution:
      "Do not delete every contradiction. It may show that a decision changed or that two contexts were mixed. Plain /lint and /lint deep are read-only; repair is a separate approval-gated workflow. Verify the source and scope before changing any record.",
    faq: [
      "Should I delete every stale or contradictory memory?",
      "No. Preserve ordinary changes as corrections or accepted revisions so the history remains inspectable. Delete only records that are wrong, sensitive, or should not be retained.",
      "Does /lint deep fix stale memory automatically?",
      "No. It is a read-only diagnostic. Review the evidence first, then use an explicit correction, revision decision, or destructive forget action.",
    ],
    relatedSlugs: ["ai-memory-provenance", "local-git-history-ai-memory", "source-backed-wiki-pages-ai-work"],
    officialReferences: [
      {
        label: "Wenlan review and trust docs",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "Wenlan curate workflow",
        href: "https://github.com/7xuanlu/wenlan/blob/main/plugin/skills/curate/SKILL.md",
      },
      {
        label: "Wenlan lint workflow",
        href: "https://github.com/7xuanlu/wenlan/blob/main/plugin/skills/lint/SKILL.md",
      },
      {
        label: "Wenlan forget workflow",
        href: "https://github.com/7xuanlu/wenlan/blob/main/plugin/skills/forget/SKILL.md",
      },
    ],
  },
  {
    slug: "project-scope-ai-memory",
    eyebrow: "Trust",
    category: "Concepts",
    title: "Project Scope for AI Memory in Wenlan",
    description:
      "Understand how Wenlan scopes local AI work memory with spaces, project context, and deliberate product boundaries.",
    metaTitle: "Project Scope for AI Memory | Wenlan",
    metaDescription:
      "Wenlan scopes to local-first AI work memory. It is not a life OS, workflow suite, generic memory infrastructure SDK, or one-off chat tool.",
    keywords: [
      "what Wenlan is not",
      "AI memory scope",
      "Wenlan project scope",
      "local AI work memory scope",
      "AI memory not life OS",
    ],
    audience: "Users deciding whether Wenlan fits their actual problem",
    heroBullets: [
      "Wenlan scopes to AI work artifacts and project spaces.",
      "It does not try to become a life OS or full workflow suite.",
      "It is for repeated AI work, not one-off chats.",
    ],
    quickAnswer:
      "Wenlan is local-first memory for repeated AI work. Use spaces as project/client buckets, not account permissions or team governance. It is not a life OS, not a general workflow suite, not a generic memory infrastructure SDK, and not needed for one-off chats.",
    problem:
      "Many AI tools blur scope until users cannot tell what problem they solve. Clear boundaries make Wenlan easier to choose and easier to reject.",
    wenlanFit:
      "Wenlan focuses on decisions, lessons, gotchas, project context, handoffs, source-backed pages, and retrieval across MCP clients configured against the same daemon, data dir, and active space.",
    actionHeading: "Use Wenlan when the scope matches",
    actionIntro:
      "Choose Wenlan for repeated work that needs continuity.",
    actionBullets: [
      "Use Wenlan for multi-session AI work.",
      "Use Wenlan when local, inspectable memory matters.",
      "Use spaces for project, client, or context buckets that should not automatically inform each other.",
      "Do not use Wenlan as a calendar, habit tracker, or full personal OS.",
      "Do not use Wenlan as a generic backend SDK for app memory.",
      "Skip Wenlan for one-off chats with no future context.",
    ],
    caution:
      "A narrow scope is a product feature. Local-first keeps Wenlan's memory layer local by default, but connected AI clients may still send retrieved context to their own model providers.",
    faq: [
      "Why state what Wenlan is not?",
      "Because honest scope prevents bad installs and makes the product easier to trust.",
      "Can Wenlan still work beside broader tools?",
      "Yes. Use Wenlan for local AI work memory and other tools for notes, tasks, calendars, or app infrastructure.",
    ],
    relatedSlugs: [
      "ai-work-memory",
      "ai-work-memory-vs-knowledge-base",
      "wenlan-vs-mem0",
      "persistent-project-context-for-ai-agents",
    ],
    officialReferences: [
      {
        label: "Wenlan project scope docs",
        href: "https://wenlan.app/docs/project-scope",
      },
      {
        label: "Wenlan spaces docs",
        href: "https://wenlan.app/docs/spaces",
      },
    ],
  },
];

const retrievalRegressionArticle: LearnArticle = {
  slug: "test-ai-knowledge-base-retrieval-after-changes",
  eyebrow: "Retrieval regression",
  category: "Workflows",
  title: "How to Regression-Test AI Knowledge Base Retrieval After Changes",
  description:
    "Use a versioned golden query set to find RAG retrieval regressions after corpus, embedding, chunking, hybrid search, or reranker changes.",
  metaTitle: "RAG Retrieval Regression Testing | Wenlan",
  metaDescription:
    "Regression-test AI knowledge-base retrieval with golden queries, expected sources, Recall@k, MRR, no-answer cases, failure triage, and rollback.",
  keywords: [
    "RAG retrieval regression testing",
    "RAG golden dataset",
    "AI knowledge base retrieval evaluation",
    "embedding change retrieval regression",
    "chunking regression test RAG",
    "reranker regression testing",
  ],
  publishedAt: "2026-08-26",
  updatedAt: "2026-08-26",
  author: AUTHOR,
  readingTime: "8 min read",
  audience:
    "Developers changing an AI knowledge base corpus, embedding model, chunking, hybrid retrieval, or reranker",
  heroBullets: [
    "Freeze representative questions and their expected sources before changing retrieval.",
    "Change one factor, then compare retrieval before evaluating answer generation.",
    "Inspect every regression and keep rollback available until the new baseline is justified.",
  ],
  sections: [
    {
      heading: "Quick answer",
      body: [
        "To regression-test an AI knowledge base, version a small golden query set with expected source IDs or documents, no-answer cases, and a baseline manifest. Run the same set before and after one corpus or retrieval change, compare retrieval-only results first, inspect every lost or newly introduced source, and accept the change only when the differences are understood.",
        "This is different from citation verification. Citation verification starts with one produced answer and checks whether its evidence supports each claim. Retrieval regression starts before generation and asks whether the same questions still retrieve the intended evidence after the system changes.",
      ],
    },
    {
      heading: "Run the test whenever retrieval inputs change",
      body: [
        "Re-run the suite after adding, deleting, or revising source documents; changing embeddings or chunk size; adjusting lexical-vector fusion; replacing a reranker; or changing filters and metadata. A fluent demo query is not enough because a change can improve one topic while silently removing evidence for another.",
      ],
      bullets: [
        "Include frequent real questions, known failures, edge cases, and questions the corpus should not answer.",
        "Keep the authoritative source revision beside each expected result so an intentional corpus change can invalidate the old label explicitly.",
        "Do not refresh the golden set merely because the new system disagrees with it; investigate the disagreement first.",
      ],
    },
    {
      heading: "Define a versioned golden query set",
      body: [
        "Each case needs a stable ID, the natural user question, expected source IDs or documents, optional excluded sources, whether no answer is valid, and the reason the case matters. Store the corpus revision and retrieval configuration separately so two runs remain comparable.",
      ],
      code: {
        label: "Minimal product-neutral golden-set record",
        code: "version: 1\ncorpus_revision: docs-2026-08-26\ncases:\n  - id: install-windows\n    query: Which Windows package includes the desktop app?\n    expected_sources: [release-v0.16.0]\n    excluded_sources: [runtime-zip]\n    no_answer: false\n  - id: unsupported-pricing\n    query: What is the enterprise price?\n    expected_sources: []\n    no_answer: true",
      },
    },
    {
      heading: "Freeze the baseline, then change one factor",
      body: [
        "Record the corpus revision, embedding model, chunker and parameters, filters, hybrid weights, reranker version, top-k, and runtime environment. Change one factor at a time when possible. Otherwise the result may reveal drift without showing which change caused it.",
        "Compare source-level Recall@k or Hit@k first, then MRR or NDCG when rank order matters. Keep no-answer cases and latency visible, but do not combine every measure into one score that hides a lost critical source.",
      ],
    },
    {
      heading: "Inspect regressions before judging generated answers",
      body: [
        "For every failed case, inspect the rewritten query, retrieved chunks, scores, source IDs, filters, fusion result, reranker output, and final ordering. Separate missing documents, wrong labels, extraction defects, metadata filters, embedding drift, chunk-boundary loss, and reranker changes. A bad expected-source label can make the test wrong, while a good aggregate score can still hide one dangerous regression.",
        "Only after the expected evidence is available should you evaluate grounding or answer quality. Retrieval success does not prove that a model will use the evidence correctly; citation verification remains a separate downstream check.",
      ],
    },
    {
      heading: "Use Wenlan's maintainer drift test honestly",
      body: [
        "Wenlan's repository maintains labeled retrieval fixtures, retrieval-only Recall@5, MRR, and NDCG@10 snapshots, frozen ranking goldens, and an ignored ranking-drift test used by the main canary. The test detects drift, not correctness: it compares the current ranking with a trusted reference.",
        "This is a Wenlan maintainer workflow, not a released `wenlan eval` end-user command or hosted CI feature. Users can still apply the product-neutral golden-set method above to any knowledge base and keep the exact source and rollback decision in their own repository.",
      ],
      code: {
        label: "Wenlan repository maintainer-only drift check",
        code: "cargo test -p wenlan-core --lib \\\n  eval::retrieval_drift::tests::ranking_drift_vs_golden \\\n  -- --ignored --nocapture",
      },
    },
  ],
  faqs: [
    {
      question: "How large should a RAG golden dataset be?",
      answer:
        "Start with enough representative questions to cover important sources, known failures, and no-answer behavior. A small reviewed set is better than a large unverified one; expand it from real failures and record why each case belongs.",
    },
    {
      question: "Should I update the golden set after the corpus changes?",
      answer:
        "Only when the source contract intentionally changed. Review the old expectation against the new authoritative source, record the reason, and version the update instead of silently blessing the new result.",
    },
    {
      question: "Does a passing retrieval regression test prove answer quality?",
      answer:
        "No. It proves that the tested retrieval behavior stayed within its declared contract. Generation, citation faithfulness, and source correctness require separate checks.",
    },
  ],
  relatedSlugs: [
    "verify-ai-knowledge-base-citations",
    "source-backed-wiki-pages-ai-work",
    "choose-ai-knowledge-base-tool",
    "fix-pdf-ingestion-ai-knowledge-base",
    "when-ai-agent-should-query-knowledge-base",
    "build-customer-support-answer-knowledge-base",
  ],
  officialReferences: [
    {
      label: "Wenlan evaluation methodology",
      href: "https://wenlan.app/docs/evaluation",
    },
    {
      label: "Wenlan retrieval drift source",
      href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-core/src/eval/retrieval_drift.rs",
    },
    {
      label: "Haystack retrieval debugging discussion",
      href: "https://github.com/deepset-ai/haystack/discussions/11697",
    },
    {
      label: "RAG evaluation and golden-set guide",
      href: "https://dataaspirant.com/blog/rag-evaluation/",
    },
    {
      label: "Merged retrieval regression implementation",
      href: "https://github.com/inherent-prime/inherent/pull/140",
    },
  ],
  cta: {
    heading: "Freeze one retrieval baseline",
    body: "Choose representative project questions, record their expected sources, and keep the baseline beside the source revisions before changing retrieval.",
  },
};

const sreIncidentKnowledgeBaseArticle: BaseSpec = {
  slug: "build-sre-incident-knowledge-base",
  eyebrow: "SRE knowledge workflow",
  category: "Workflows",
  title: "How to Build an SRE Incident Knowledge Base",
  description:
    "Turn runbooks, postmortems, and approved incident notes into current, source-backed operational knowledge for on-call engineers.",
  metaTitle: "Build an SRE Incident Knowledge Base | Wenlan",
  metaDescription:
    "Build a source-backed SRE incident knowledge base from runbooks and postmortems, with current revisions, verification steps, stale-state review, and clear safety limits.",
  keywords: [
    "SRE incident knowledge base",
    "runbook knowledge base",
    "postmortem knowledge base",
    "on-call operational knowledge",
    "AI SRE runbook",
    "incident learning workflow",
  ],
  publishedAt: "2026-08-29",
  updatedAt: "2026-09-08",
  readingTime: "9 min read",
  audience:
    "SRE, platform engineering, and on-call teams maintaining runbooks and post-incident knowledge",
  heroBullets: [
    "Keep one service, environment, and incident class inside a clear source boundary.",
    "Trace each diagnostic step, mitigation, and verification signal to a current runbook or postmortem.",
    "Review stale steps after every incident instead of letting old operational advice stay silently active.",
  ],
  quickAnswer:
    "Build one incident knowledge base per service or operational boundary. Register approved runbooks, postmortems, architecture notes, and incident summaries; then maintain one reviewable Page for the incident class with symptoms, preconditions, diagnostic steps, mitigation limits, abort conditions, verification signals, owner, and review date.",
  quickAnswerLink: {
    label: "See the incident evidence workflow",
    href: "#product-evidence",
  },
  wenlanFit:
    "Wenlan can keep supported documents connected to source-backed Pages, citations, revisions, stale state, lint, and human review. It does not monitor production, receive alerts, ingest live telemetry, execute runbooks, approve changes, or replace an incident-management system.",
  problem:
    "The failure appears when an engineer is paged for a problem the team has seen before, but the useful context is split across an old runbook, a postmortem, chat history, architecture notes, and somebody's memory. A plausible AI summary can make this worse if it hides the service version, environment, source revision, risk, or evidence behind a command.",
  actionHeading: "Build one incident-to-runbook review loop",
  actionIntro:
    "Start after the incident is stable. Use sanitized, approved documents and keep live credentials, customer data, raw secrets, and unreviewed production commands outside the knowledge base.",
  actionBullets: [
    "Choose one service, environment, and incident class. Record what is included, what stays in the monitoring or incident system, and who owns the operational knowledge.",
    "Register the current runbook, relevant postmortem, architecture note, and sanitized incident summary with their dates, versions, owners, and source locations.",
    "Create one maintained Page with symptoms, scope, preconditions, read-only checks, mitigation boundaries, escalation triggers, abort conditions, verification signals, and the next review date.",
    "Keep observed facts, hypotheses, mitigations, and confirmed causes separate. Do not rewrite a postmortem into a single neat cause when the evidence shows several contributing factors.",
    "After an incident or system change, resync the approved sources and mark affected steps stale until an owner verifies them against the current service and environment.",
    "Run a tabletop or staging exercise. Record which steps were reproducible, which links or commands were outdated, and what evidence was missing before the page is trusted for on-call use.",
    "Open the exact source before acting. A retrieved runbook is context for a qualified engineer, not permission to execute a production change.",
  ],
  code: {
    label: "After Wenlan and the AI client are configured",
    code: "wenlan status\nwenlan sources add ~/Ops/approved-incident-knowledge\n# In a Wenlan plugin client:\n/distill <service and incident class>\n/pages <service incident runbook>\n/lint\n/curate",
  },
  caution:
    "Keep monitoring, alert routing, telemetry, incident command, credentials, change approvals, rollback execution, and emergency access in their purpose-built systems. Wenlan does not validate a command against production or guarantee that a runbook is safe. A named owner must review service version, environment, permissions, risk, expected output, abort conditions, and rollback before operational use.",
  productEvidence: {
    heading: "Inspect the source and review state before trusting a runbook",
    summary:
      "This genuine Wenlan desktop capture comes from the app's deterministic test fixture, not an incident or customer workspace. It shows maintained Pages with source counts and a review queue, the same product surfaces an SRE can use to keep source changes and unresolved conflicts visible.",
    image: {
      src: "/images/product-evidence/wenlan-space-review-fixture.png",
      alt: "Wenlan desktop Space showing maintained Pages with source counts and a review queue for source conflicts and newly available evidence.",
      caption:
        "Genuine Wenlan app capture from a deterministic test fixture. Source counts and the review queue remain visible; the screenshot is a general product example, not production incident evidence.",
      width: 1586,
      height: 992,
    },
    workflow: [
      {
        label: "Bound the incident knowledge",
        detail:
          "Select one service, environment, incident class, and approved source set instead of importing an unrestricted operational archive.",
      },
      {
        label: "Distill a reviewable runbook Page",
        detail:
          "Keep symptoms, evidence, read-only checks, mitigations, risks, abort conditions, and verification signals attached to current sources.",
      },
      {
        label: "Review after change or incident",
        detail:
          "Recheck the cited revision, stale state, and unresolved conflicts, then test the procedure in an approved non-production exercise.",
      },
    ],
    artifactHeading: "Worked incident knowledge packet",
    artifactNote:
      "This example defines the fields a reviewer should inspect. Replace every row with approved evidence for one service and incident class.",
    artifactRows: [
      {
        label: "Evidence input",
        detail:
          "A current runbook, dated postmortem, architecture note, or sanitized incident summary with owner and revision.",
      },
      {
        label: "Operational claim",
        detail:
          "One symptom, diagnostic step, mitigation boundary, or verification signal linked to the exact supporting passage.",
      },
      {
        label: "Review result",
        detail:
          "Current, contradicted, stale, unsafe, or unresolved, with the service version, environment, reviewer, and next test recorded.",
      },
    ],
    action: {
      label: "See the incident evidence workflow",
      href: "#product-evidence",
    },
  },
  faq: [
    "Can Wenlan monitor incidents or run remediation commands?",
    "No. Wenlan does not receive alerts, ingest live telemetry, execute runbooks, approve changes, or replace monitoring and incident-management systems. It keeps approved operational knowledge source-backed and reviewable.",
    "How do we stop an old runbook from misleading on-call engineers?",
    "Give each Page a source revision, service and environment scope, owner, review date, expected signals, and abort conditions. After a source or system change, mark affected guidance stale until an approved exercise verifies it again.",
  ],
  relatedSlugs: [
    "build-local-ai-knowledge-base-from-documents",
    "source-backed-wiki-pages-ai-work",
    "verify-ai-knowledge-base-citations",
    "test-ai-knowledge-base-retrieval-after-changes",
    "prevent-multi-agent-knowledge-conflicts",
  ],
  officialReferences: [
    {
      label: "Wenlan supported document sources",
      href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
    },
    {
      label: "Wenlan review and trust",
      href: "https://wenlan.app/docs/review-and-trust",
    },
    {
      label: "Microsoft Azure SRE Agent knowledge documents",
      href: "https://learn.microsoft.com/en-us/azure/sre-agent/tutorial-upload-knowledge-document",
    },
    {
      label: "AWS playbooks for failure investigation",
      href: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_testing_resiliency_playbook_resiliency.html",
    },
    {
      label: "Operate First incident and postmortem process",
      href: "https://github.com/operate-first/sre/blob/main/process/incident_management.md",
    },
  ],
  cta: {
    heading: "Make one incident lesson reproducible",
    body: "Choose one service and incident class, connect the current runbook and postmortem, then review every operational claim before the next on-call shift.",
  },
};

workflowArticles.push(sreIncidentKnowledgeBaseArticle);

const competitiveIntelligenceKnowledgeBaseArticle: BaseSpec = {
  slug: "build-competitive-intelligence-knowledge-base",
  eyebrow: "Competitive intelligence workflow",
  category: "Workflows",
  title: "How to Build a Source-Backed Competitive Intelligence Knowledge Base",
  description:
    "Keep competitor research current with a bounded source register, dated evidence, explicit uncertainty, and reviewable knowledge-base Pages.",
  metaTitle: "Build a Source-Backed Competitive Intelligence Knowledge Base | Wenlan",
  metaDescription:
    "Organize competitor research from permitted documents with source dates, revisions, stale claims, contradictions, and a human review loop.",
  keywords: [
    "competitive intelligence knowledge base",
    "competitor research knowledge base",
    "how to organize competitor research",
    "source-backed competitor research",
    "competitive intelligence workflow",
    "competitor information update",
    "AI knowledge base for product research",
  ],
  publishedAt: "2026-08-30",
  updatedAt: "2026-09-08",
  readingTime: "9 min read",
  audience:
    "Product marketing managers, founders, and product, strategy, or market researchers maintaining competitor evidence",
  heroBullets: [
    "Start with one decision and a bounded set of competitors instead of an unreviewed market archive.",
    "Register each source with its date, revision, scope, and next review so stale claims stay visible.",
    "Separate observations, inferences, assumptions, and unknowns before a battlecard or product decision uses them.",
  ],
  quickAnswer:
    "Build one competitor dossier for one decision, review question, or product area. Register user-collected and permitted product docs, manuals, release notes, and research notes with source, date, revision, scope, and review owner. Then maintain a source-backed Page that separates observations from inferences, preserves contradictions, and marks stale claims before anyone uses the dossier.",
  wenlanFit:
    "Wenlan can connect supported Markdown, text, text-extractable PDFs, folders, and read-only Obsidian sources to source-backed Pages, citations, revisions, stale state, lint, and human review. It does not crawl competitor sites, scrape reviews, monitor live pricing, discover competitors, send alerts, score vendors, make recommendations, or decide legal or commercial strategy.",
  problem:
    "A competitor spreadsheet or battlecard goes stale when product pages, documentation, releases, and positioning change but nobody can tell which claim came from which revision. A polished AI summary can hide that gap. A useful competitive intelligence knowledge base keeps a small, inspectable evidence chain so a researcher can tell what was observed, what was inferred, what is unknown, and what needs another check.",
  actionHeading: "Build one competitor dossier that can be reviewed",
  actionIntro:
    "Use one decision and a small source boundary first. The workflow remains useful without Wenlan because the source register and claim classifications are the durable practice.",
  actionBullets: [
    "Name the decision, review question, competitors, date range, source types, and excluded material. Do not ask an assistant to discover an unrestricted market corpus.",
    "Collect only permitted, user-provided sources such as product documentation, user manuals, release notes, dated research notes, or a read-only Obsidian vault. Keep credentials, private customer data, and restricted material outside the boundary.",
    "Record each source URL or file, publication or access date, version or revision, competitor, scope, authority, allowed use, and next review date.",
    "Classify every important statement as observation, inference, assumption, contradiction, or unknown. Preserve the exact passage and do not turn an inference into a competitor fact.",
    "Compare one product question or module at a time across the same source class. Record missing evidence instead of filling a row with generic market language.",
    "When a release or source changes, resync the affected source and mark dependent claims stale or contradicted until a reviewer checks the new revision.",
    "Before using a battlecard, positioning update, or product decision, open the source, check its scope and date, and leave the unresolved questions visible.",
  ],
  code: {
    label: "A bounded competitor-evidence workflow",
    code: "wenlan status\nwenlan sources add ~/Research/competitors\n# In a Wenlan plugin client:\n/distill <competitor research question>\n/pages <competitor topic>\n/lint\n/curate",
  },
  caution:
    "This is not automated market intelligence. Wenlan does not crawl or scrape competitor sites, monitor live websites or pricing, ingest reviews, discover competitors, run alerts, score products, generate recommendations, or make legal or commercial decisions. It only organizes supported sources you are allowed to use; verify public facts, permissions, dates, and strategic conclusions with the responsible human reviewer.",
  productEvidence: {
    heading: "Inspect the evidence and review state before using a dossier",
    summary:
      "This genuine Wenlan desktop capture comes from the app's deterministic test fixture, not a competitor workspace or customer data. It shows maintained Pages with source counts and a review queue, the product surfaces used to keep source changes and unresolved evidence visible.",
    image: {
      src: "/images/product-evidence/wenlan-space-review-fixture.png",
      alt: "Wenlan desktop Space showing maintained Pages with source counts and a review queue for source conflicts and newly available evidence.",
      caption:
        "Genuine Wenlan app capture from a deterministic test fixture. It is a general product example, not competitor research evidence; source counts and review state remain directly inspectable.",
      width: 1586,
      height: 992,
    },
    workflow: [
      {
        label: "Bound the research question",
        detail:
          "Choose one decision, product question, competitor set, time range, and permitted source boundary instead of importing an unrestricted market archive.",
      },
      {
        label: "Distill a source-backed dossier",
        detail:
          "Keep observations, inferences, contradictions, stale claims, and unknowns connected to dated source revisions in a maintained Page.",
      },
      {
        label: "Review before reuse",
        detail:
          "Open the cited passage, confirm its scope and revision, and leave unresolved evidence visible before a battlecard or product decision uses it.",
      },
    ],
    artifactHeading: "Worked competitor evidence packet",
    artifactNote:
      "This is a product-neutral structure, not a claim about any competitor. Replace every row with permitted, dated evidence from the decision you are reviewing.",
    artifactRows: [
      {
        label: "Evidence input",
        detail:
          "A product document, manual, release note, or dated research note with source location, revision, scope, and allowed-use status.",
      },
      {
        label: "Claim classification",
        detail:
          "An observation, inference, assumption, contradiction, or unknown linked to the exact passage rather than a polished summary alone.",
      },
      {
        label: "Review result",
        detail:
          "Current, stale, contradicted, or unresolved, with reviewer, next check, and the decision context recorded before reuse.",
      },
    ],
    action: {
      label: "See the evidence review workflow",
      href: "#product-evidence",
    },
  },
  faq: [
    "Can Wenlan monitor competitors or track live pricing?",
    "No. Wenlan does not crawl or scrape competitor sites, monitor live pricing or reviews, discover competitors, or send alerts. Add only supported sources you are permitted to use, then review their dates and scope yourself.",
    "Should an AI agent automatically write the final competitor recommendation?",
    "No. Wenlan can organize source-backed observations and surface stale or conflicting claims, but a responsible human must interpret the evidence and make product, positioning, legal, or commercial decisions.",
  ],
  relatedSlugs: [
    "source-backed-research-knowledge-base",
    "verify-ai-knowledge-base-citations",
    "build-local-ai-knowledge-base-from-documents",
    "test-ai-knowledge-base-retrieval-after-changes",
    "build-product-research-knowledge-base-for-prd",
  ],
  officialReferences: [
    {
      label: "Wenlan supported document sources",
      href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
    },
    {
      label: "Wenlan source-backed Pages",
      href: "https://wenlan.app/docs/source-backed-pages",
    },
    {
      label: "Wenlan review and trust",
      href: "https://wenlan.app/docs/review-and-trust",
    },
    {
      label: "How to Build a Competitive Intelligence Program",
      href: "https://www.aqute.com/blog/build-competitive-intelligence-program",
    },
    {
      label: "Competitive intelligence source guidance (Taiwan Marketing Research)",
      href: "https://tmrmds.co/article-business/21696/",
    },
    {
      label: "竞品调研 workflow case (人人都是产品经理)",
      href: "https://www.woshipm.com/pd/6395378.html",
    },
  ],
  cta: {
    heading: "Make one competitor decision traceable",
    body: "Choose a bounded question, connect permitted sources, and review every consequential claim before it reaches a battlecard or product decision.",
  },
};

workflowArticles.push(competitiveIntelligenceKnowledgeBaseArticle);

const ictSupplierDueDiligenceArticle: BaseSpec = {
  slug: "build-ict-supplier-due-diligence-evidence-pack",
  eyebrow: "Supplier review workflow",
  category: "Workflows",
  title: "How to Build an ICT Supplier Due Diligence Evidence Pack",
  description:
    "Organize approved software-supplier documents into a source-backed evidence pack with provenance, scope, gaps, owners, and review dates.",
  metaTitle: "Build an ICT Supplier Due Diligence Evidence Pack | Wenlan",
  metaDescription:
    "Build a source-backed ICT supplier due diligence evidence pack for software vendor security review, with provenance, scope, gaps, and re-review dates.",
  keywords: [
    "ICT supplier due diligence",
    "software vendor security assessment",
    "supplier cybersecurity evidence pack",
    "third party risk assessment documents",
    "vendor due diligence checklist",
    "supplier security review",
  ],
  publishedAt: "2026-08-30",
  updatedAt: "2026-09-08",
  readingTime: "9 min read",
  audience:
    "Procurement, security, and IT owners reviewing one ICT or software supplier before approval or renewal",
  heroBullets: [
    "Keep every supplier claim attached to an approved document, date, revision, and evidence scope.",
    "Record data access, resilience, foundational security evidence, dependencies, and unanswered questions separately.",
    "Give the packet an owner and re-review date instead of turning old questionnaire answers into permanent truth.",
  ],
  quickAnswer:
    "Build one evidence pack for one ICT or software supplier. Register only approved source documents, then record each claim's provenance, revision, data-access scope, resilience and security evidence, dependencies, gaps, owner, and review date. Mark unsupported or stale claims as unverified and keep the final approval decision with procurement, security, legal, and privacy reviewers.",
  quickAnswerLink: {
    label: "See the supplier evidence workflow",
    href: "#product-evidence",
  },
  wenlanFit:
    "Wenlan can connect supported Markdown, text, text-extractable PDFs, folders, and read-only Obsidian sources to source-backed Pages, citations, revisions, stale state, lint, and human review. It does not validate certifications, crawl vendor sites, monitor suppliers, scan vulnerabilities, score risk, or approve procurement.",
  problem:
    "Supplier reviews often mix a current security policy, an old questionnaire, an architecture diagram, a certification claim, and an email clarification into one spreadsheet. Without source dates and scope, a confident summary can hide which statement is current, which applies only to one service, and which still lacks evidence.",
  actionHeading: "Build one reviewable supplier evidence pack",
  actionIntro:
    "Start with one supplier and one procurement or renewal decision. The source register and review fields remain useful even if the team does not use Wenlan.",
  actionBullets: [
    "Define the supplier, product or service, decision, business owner, review team, date range, approved source set, and excluded confidential material.",
    "Register current policies, architecture and data-flow documents, resilience material, subprocessors or dependencies, completed questionnaires, and dated clarifications only when your organization has approved their use.",
    "For every important claim, record the exact source passage, document revision, service scope, data-access profile, evidence owner, and next review date.",
    "Separate supplied evidence, reviewer interpretation, residual risk, missing evidence, contradictions, and open questions. Never turn an unanswered questionnaire row into an affirmative control claim.",
    "Map dependencies and supplier tiers explicitly. A downstream service, subprocessor, or hosting dependency may need its own evidence and owner.",
    "When a document or service scope changes, resync the affected source and mark dependent claims stale until a qualified reviewer checks the new revision.",
    "Before approval or renewal, open the cited source and let procurement, security, legal, and privacy owners make the decision under the organization's existing controls.",
  ],
  code: {
    label: "A bounded supplier-evidence workflow",
    code: "wenlan status\nwenlan sources add ~/Reviews/approved-supplier-docs\n# In a Wenlan plugin client:\n/distill <supplier and review scope>\n/pages <supplier evidence pack>\n/lint\n/curate",
  },
  caution:
    "A questionnaire or evidence pack is not a security guarantee. Wenlan does not validate certifications, perform legal or privacy review, discover vendors, crawl websites, monitor live supplier changes, scan vulnerabilities, score risk, or approve or reject a supplier. Keep sensitive material inside your organization's approved access controls and use qualified human reviewers.",
  productEvidence: {
    heading: "Inspect source and review state before reusing a supplier claim",
    summary:
      "This genuine Wenlan desktop capture comes from the app's deterministic test fixture, not a supplier review or customer workspace. It shows maintained Pages with source counts and a review queue, the product surfaces used to keep source changes and unresolved evidence visible.",
    image: {
      src: "/images/product-evidence/wenlan-space-review-fixture.png",
      alt: "Wenlan desktop Space showing maintained Pages with source counts and a review queue for source conflicts and newly available evidence.",
      caption:
        "Genuine Wenlan app capture from a deterministic test fixture. It is a general product example, not supplier security evidence; source counts and review state remain directly inspectable.",
      width: 1586,
      height: 992,
    },
    workflow: [
      {
        label: "Bound the supplier review",
        detail:
          "Choose one supplier, service, decision, approved source set, and responsible reviewers before adding material.",
      },
      {
        label: "Build a cited evidence register",
        detail:
          "Keep provenance, revision, data-access scope, resilience and security evidence, dependencies, gaps, and questions attached to exact sources.",
      },
      {
        label: "Re-review before a decision",
        detail:
          "Open the cited passage, inspect stale or conflicting evidence, and leave approval with the organization's qualified procurement, security, legal, and privacy owners.",
      },
    ],
    artifactHeading: "Worked supplier evidence packet",
    artifactNote:
      "This is a vendor-neutral review structure, not a certification or procurement decision. Replace every row with approved evidence for one supplier and service scope.",
    artifactRows: [
      {
        label: "Evidence input",
        detail:
          "An approved policy, architecture or data-flow document, resilience plan, questionnaire, subprocessor record, or dated clarification with revision and owner.",
      },
      {
        label: "Review statement",
        detail:
          "One supplied fact, reviewer interpretation, residual risk, contradiction, missing item, or open question linked to the exact passage and service scope.",
      },
      {
        label: "Review state",
        detail:
          "Current, stale, contradicted, unsupported, or pending, with evidence owner, reviewer, dependency, and next review date recorded.",
      },
    ],
    action: {
      label: "See the supplier evidence workflow",
      href: "#product-evidence",
    },
  },
  faq: [
    "Can Wenlan validate a supplier's certification or approve the vendor?",
    "No. Wenlan does not validate certifications, score supplier risk, or approve procurement. It helps keep approved documents, claims, gaps, revisions, and review state inspectable for qualified reviewers.",
    "Is a completed vendor questionnaire enough evidence?",
    "No. Treat each answer as one supplied claim. Record its source, date, scope, owner, supporting document, contradictions, and next review date; leave unsupported answers explicitly unverified.",
  ],
  relatedSlugs: [
    "build-local-ai-knowledge-base-from-documents",
    "verify-ai-knowledge-base-citations",
    "source-backed-research-knowledge-base",
    "choose-ai-knowledge-base-tool",
    "build-competitive-intelligence-knowledge-base",
  ],
  officialReferences: [
    {
      label: "Wenlan supported document sources",
      href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
    },
    {
      label: "Wenlan source-backed Pages",
      href: "https://wenlan.app/docs/source-backed-pages",
    },
    {
      label: "Wenlan review and trust",
      href: "https://wenlan.app/docs/review-and-trust",
    },
    {
      label: "NIST SP 1326 ICT supplier due diligence guide",
      href: "https://www.nist.gov/publications/nist-cybersecurity-supply-chain-management-due-diligence-assessment-quick-start-guide",
    },
    {
      label: "Microsoft Supplier Security and Privacy Assurance",
      href: "https://learn.microsoft.com/en-us/compliance/assurance/assurance-supplier-security-and-privacy-assurance-program",
    },
  ],
  cta: {
    heading: "Make one supplier review traceable",
    body: "Choose one supplier and service scope, connect approved evidence, and leave every unsupported or stale claim visible before the decision meeting.",
  },
};

workflowArticles.push(ictSupplierDueDiligenceArticle);

const customerSupportAnswerKnowledgeBaseArticle: BaseSpec = {
  slug: "build-customer-support-answer-knowledge-base",
  eyebrow: "Support answer workflow",
  category: "Workflows",
  title: "How to Build a Customer Support Answer Knowledge Base",
  description:
    "Keep customer-support answers reviewable after product or policy changes with approved sources, explicit scope, prohibited promises, owners, and review dates.",
  metaTitle: "Build a Customer Support Answer Knowledge Base | Wenlan",
  metaDescription:
    "Build a source-backed customer-support answer knowledge base from approved product and policy documents, with scope, prohibited promises, escalation, owners, and review dates.",
  keywords: [
    "customer support knowledge base",
    "customer service knowledge base",
    "support answer knowledge base",
    "how to keep support knowledge base updated",
    "source-backed support answers",
    "customer support content workflow",
  ],
  publishedAt: "2026-08-31",
  updatedAt: "2026-09-08",
  readingTime: "8 min read",
  audience:
    "Support operations, technical writers, product support, and customer-success content owners maintaining approved customer answers",
  heroBullets: [
    "Start with one approved product or policy change and the support questions it affects.",
    "Record the supported answer, scope, prohibited promises, escalation condition, source revision, owner, and next review date.",
    "Keep stale or unsupported answers visible for human review instead of publishing or sending them automatically.",
  ],
  quickAnswer:
    "Build one answer pack for one support area and an approved set of product or policy documents. For each customer question, record the supported answer, scope, prohibited promise, escalation condition, source revision, human owner, and next review date. When a source changes, mark dependent answers stale or unresolved until the owner reviews the current passage.",
  quickAnswerLink: {
    label: "See the support answer evidence workflow",
    href: "#product-evidence",
  },
  wenlanFit:
    "Wenlan can connect supported Markdown, text, text-extractable PDFs, folders, and read-only Obsidian sources to source-backed Pages, citations, revisions, stale state, lint, and human review. It does not ingest help-desk tickets, CRM records, or raw customer conversations; it does not handle PII; it does not connect to support channels; it does not publish customer-facing answers; it does not generate replies; it does not synchronize channels; it does not automatically escalate.",
  problem:
    "The failure appears after a product release or policy change: a support answer still sounds plausible, but its scope, effective date, exception, or promise no longer matches the approved source. A shared document or polished AI summary hides which revision supports the answer and who must review it. A useful support knowledge base keeps each answer small enough to check and leaves unsupported questions visible rather than filling them with confident language.",
  actionHeading: "Build one question-to-answer review loop",
  actionIntro:
    "Start with one support area and a small set of approved product or policy documents. Keep customer conversations, tickets, CRM records, personal data, and any material you are not authorized to use outside the source boundary.",
  actionBullets: [
    "Name the product or policy area, effective date, support audience, included documents, excluded material, and human content owner.",
    "Register the approved Markdown, text, text-extractable PDF, folder, or read-only Obsidian source with its title, revision, date, and allowed scope.",
    "Create one answer record per recurring customer question. Separate the supported answer from applicability, prohibited promises, escalation conditions, and unresolved exceptions.",
    "Connect each important answer statement to the exact source passage and keep the source revision beside the record.",
    "When a release or policy changes, resync the affected source and mark dependent answers stale or unsupported until the owner checks the new revision.",
    "Before an answer is reused, have the owner open the source, confirm scope and effective date, and record the next review date. This workflow does not publish or send a reply.",
  ],
  code: {
    label: "Wenlan workflow and a neutral support answer record",
    code: "wenlan status\nwenlan sources add ~/Support/approved-product-policy\n# In a Wenlan plugin client:\n/distill <support answer topic>\n/pages <support answer topic>\n/lint\n/curate\n\nquestion: Can an existing subscription change plans immediately?\nsupported_answer: <answer supported by the approved policy>\nscope: <plan, region, account state, and effective date>\ndo_not_promise: <actions or outcomes the source does not authorize>\nescalate_when: <conditions requiring a human owner>\nsource_revision: <document ID, section, and revision>\nowner: <human content owner>\nnext_review: <date or product-change trigger>",
  },
  caution:
    "This is a source-backed content review workflow, not a help desk or customer-support automation system. Wenlan does not handle PII or promise redaction, provide team permissions, run support analytics, approve policies automatically, publish customer-facing answers, generate or deliver replies, synchronize channels, or automatically escalate a case. A qualified human owner must decide what an approved answer means and when it can be reused.",
  productEvidence: {
    heading: "Inspect source and review state before reusing an answer",
    summary:
      "This genuine Wenlan desktop capture comes from the app's deterministic test fixture, not a customer-support workspace or customer conversation. It shows maintained Pages with source counts and a review queue, the product surfaces used to keep source changes and unresolved evidence visible.",
    image: {
      src: "/images/product-evidence/wenlan-space-review-fixture.png",
      alt: "Wenlan desktop Space showing maintained Pages with source counts and a review queue for source conflicts and newly available evidence.",
      caption:
        "Genuine Wenlan app capture from a deterministic test fixture. It is a general product example, not customer-support evidence; source counts and review state remain directly inspectable.",
      width: 1586,
      height: 992,
    },
    workflow: [
      {
        label: "Bound the answer pack",
        detail:
          "Choose one support area, approved source set, effective date, and human content owner before drafting answers.",
      },
      {
        label: "Distill a cited answer record",
        detail:
          "Keep the question, supported answer, scope, prohibited promise, escalation condition, source revision, and next review attached to exact sources.",
      },
      {
        label: "Review before reuse",
        detail:
          "Open the cited passage, inspect stale or conflicting evidence, and leave publication or reply delivery outside this workflow.",
      },
    ],
    artifactHeading: "Worked support answer record",
    artifactNote:
      "This neutral template is not a customer promise. Replace every placeholder with an approved source and a named human owner before reuse.",
    artifactRows: [
      {
        label: "Question and answer",
        detail:
          "One customer question paired with the shortest answer the approved product or policy source actually supports.",
      },
      {
        label: "Scope and boundaries",
        detail:
          "Applicable plan, region, account state, effective date, prohibited promises, exceptions, and conditions that require escalation.",
      },
      {
        label: "Review ownership",
        detail:
          "Source document and revision, human owner, current review state, and next review date or product-change trigger.",
      },
    ],
    action: {
      label: "See the support answer evidence workflow",
      href: "#product-evidence",
    },
  },
  faq: [
    "Can Wenlan ingest support tickets or send customer replies?",
    "No. This workflow uses approved documents you can inspect. Wenlan does not ingest help-desk tickets, CRM records, or raw customer conversations, and it does not publish, generate, deliver, or synchronize customer replies.",
    "What should happen when a product or policy changes?",
    "Resync the approved source, mark dependent answers stale or unresolved, and have the named owner review the current passage, scope, prohibited promises, escalation condition, source revision, and next review date before reuse.",
  ],
  relatedSlugs: [
    "build-local-ai-knowledge-base-from-documents",
    "verify-ai-knowledge-base-citations",
    "test-ai-knowledge-base-retrieval-after-changes",
  ],
  officialReferences: [
    {
      label: "Wenlan supported document sources",
      href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
    },
    {
      label: "Wenlan sources add CLI",
      href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-cli/README.md#wenlan-sources-add-path",
    },
    {
      label: "Wenlan source-backed Pages",
      href: "https://wenlan.app/docs/source-backed-pages",
    },
    {
      label: "Wenlan review and trust",
      href: "https://wenlan.app/docs/review-and-trust",
    },
  ],
  cta: {
    heading: "Make one support answer reviewable",
    body: "Choose an approved product or policy source, record one bounded answer, and keep its revision, owner, limitations, and next review visible before anyone reuses it.",
  },
};

workflowArticles.push(customerSupportAnswerKnowledgeBaseArticle);

const courseWikiFromLectureNotesArticle: BaseSpec = {
  slug: "build-course-wiki-from-lecture-notes",
  eyebrow: "Course wiki workflow",
  category: "Workflows",
  title: "How to Build a Course Wiki from Lecture Notes and PDFs",
  description:
    "Turn one course's readable lecture slides, notes, and PDFs into a maintained wiki with exact sources, prerequisite links, revisions, and review state.",
  metaTitle: "Build a Course Wiki from Lecture Notes and PDFs | Wenlan",
  metaDescription:
    "Build a source-backed course wiki from lecture slides, notes, and readable PDFs, with concept pages, prerequisites, citations, source revisions, and review state.",
  keywords: [
    "course wiki from lecture notes",
    "turn lecture slides into a wiki",
    "source backed AI study notes",
    "student LLM wiki",
    "lecture notes knowledge base",
    "course PDF knowledge base",
  ],
  publishedAt: "2026-08-31",
  updatedAt: "2026-09-08",
  readingTime: "8 min read",
  audience:
    "Students, independent learners, and educators organizing one course's readable lecture slides, notes, and PDFs",
  heroBullets: [
    "Start with one course and an approved folder of readable lecture materials.",
    "Create one concept page at a time with exact sources, prerequisite links, and open questions.",
    "Track source revisions and review state so revised slides do not leave polished but stale notes behind.",
  ],
  quickAnswer:
    "Create one source boundary for one course, register its readable lecture slides, notes, and text-extractable PDFs, then maintain one page per durable concept. Each concept page should name its prerequisite concepts, cite the exact lecture or page, record the source revision, and show whether the explanation is current, stale, contradicted, or awaiting review.",
  quickAnswerLink: {
    label: "See the course-wiki evidence workflow",
    href: "#product-evidence",
  },
  wenlanFit:
    "Wenlan can sync supported course documents, distill source-backed Pages, preserve citations and wikilinks, surface stale dependencies, and keep revisions reviewable. It is not equivalent to NotebookLM and does not generate flashcards, create quizzes, transcribe audio, run OCR, grade work, tutor students, solve homework, plan exams, or make academic judgments.",
  problem:
    "Lecture materials accumulate by week, but the durable ideas do not follow the same structure. A definition may live in week two, its prerequisite in week one, a correction in a later slide deck, and an exception in a reading note. A one-time summary hides those relationships and can stay fluent after the instructor revises the source. A useful course wiki keeps the explanation small, linked, and traceable to the current material.",
  actionHeading: "Build one course-material to concept-page loop",
  actionIntro:
    "Use materials you are allowed to store and inspect. Begin with one course, one term or version, and a small source set so that every concept page can still be checked against its lecture material.",
  actionBullets: [
    "Name the course, term, source owner, included folders, excluded material, and the learner or educator responsible for review.",
    "Register readable Markdown, text, or text-extractable PDFs. Keep scanned PDFs outside the workflow until an external OCR step produces text you can verify.",
    "Create one page per durable concept instead of one giant course summary. Give every page a question it answers and a short current explanation.",
    "Link prerequisite concepts explicitly and record unresolved terms, conflicting explanations, and examples that belong to another page.",
    "Attach important statements to the exact lecture, page, section, or source ID and record the source revision or course-material date.",
    "When slides or notes change, resync the source, mark dependent pages stale or unresolved, and review the cited passage before accepting the new explanation.",
  ],
  code: {
    label: "Wenlan workflow and a neutral course concept record",
    code: "wenlan status\nwenlan sources add ~/Courses/distributed-systems/materials\n# In a Wenlan plugin client:\n/distill <course concept>\n/pages <course concept>\n/lint\n/curate\n\nconcept: leader election\nquestion: Why can two nodes not both remain leader in the same term?\nprerequisites: terms; quorum intersection\nanswer: <short explanation supported by the course material>\nsources: <lecture, slide or page, and source ID>\nsource_revision: <term, file revision, or material date>\nreview_state: <current | stale | contradicted | unresolved>\nreviewer: <student or educator>\nnext_review: <source-change trigger or date>",
  },
  caution:
    "This is a source-backed study organization workflow, not an AI tutor or assessment system. Wenlan does not generate flashcards, does not create quizzes, does not transcribe audio, does not run OCR, does not grade work, does not tutor students, does not solve homework, does not plan exams, and is not equivalent to NotebookLM. The learner or educator remains responsible for source rights, interpretation, academic integrity, and review.",
  productEvidence: {
    heading: "Inspect source and review state before trusting a concept page",
    summary:
      "This genuine Wenlan desktop capture comes from the app's deterministic test fixture, not a school, course, or student workspace. It shows maintained Pages with source counts and a review queue, the same product surfaces used to keep revised course material and unresolved evidence visible.",
    image: {
      src: "/images/product-evidence/wenlan-space-review-fixture.png",
      alt: "Wenlan desktop Space showing maintained Pages with source counts and a review queue for changed and conflicting evidence.",
      caption:
        "Genuine Wenlan app capture from a deterministic test fixture. It is a general product example, not course data or a student record.",
      width: 1586,
      height: 992,
    },
    workflow: [
      {
        label: "Bound one course",
        detail:
          "Choose one course, term, readable source set, excluded material, and named reviewer before creating concept pages.",
      },
      {
        label: "Distill linked concepts",
        detail:
          "Keep each concept, prerequisite, explanation, source location, revision, and open question together in a reviewable record.",
      },
      {
        label: "Review after source changes",
        detail:
          "Open the cited lecture passage, inspect stale or conflicting support, and update the page only after the current material is understood.",
      },
    ],
    artifactHeading: "Worked course concept record",
    artifactNote:
      "This neutral template is not an answer key. Replace every placeholder with material you are allowed to use and a named reviewer.",
    artifactRows: [
      {
        label: "Concept and question",
        detail:
          "One durable course concept, the question it answers, and the shortest explanation the current material supports.",
      },
      {
        label: "Prerequisites and sources",
        detail:
          "Required concepts, exact lecture or page references, source IDs, material date, and source revision.",
      },
      {
        label: "Review state",
        detail:
          "Current, stale, contradicted, or unresolved, with a learner or educator reviewer and the next review trigger.",
      },
    ],
    action: {
      label: "See the course-wiki evidence workflow",
      href: "#product-evidence",
    },
  },
  faq: [
    "Can Wenlan turn scanned slides, audio, or video into study notes?",
    "No. Wenlan supports Markdown, text, and text-extractable PDFs for this workflow. Scanned or image-only files need external OCR, and audio or video needs an external transcription process before you can verify the resulting text.",
    "Is a course wiki the same as a study guide or an AI tutor?",
    "No. A course wiki maintains inspectable concept explanations, prerequisites, sources, and revision state. It does not generate an answer key, grade work, tutor a learner, create quizzes or flashcards, or decide what will appear on an exam.",
  ],
  relatedSlugs: [
    "build-local-ai-knowledge-base-from-documents",
    "distilled-wiki-pages-ai-memory",
    "source-backed-research-knowledge-base",
    "verify-ai-knowledge-base-citations",
  ],
  officialReferences: [
    {
      label: "Wenlan supported document sources",
      href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
    },
    {
      label: "Wenlan source-backed Pages",
      href: "https://wenlan.app/docs/source-backed-pages",
    },
    {
      label: "Wenlan review and trust",
      href: "https://wenlan.app/docs/review-and-trust",
    },
    {
      label: "Karpathy's LLM-wiki note",
      href: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f",
    },
  ],
  cta: {
    heading: "Build one inspectable course concept",
    body: "Add a small approved source set, maintain one concept page with prerequisites and exact sources, then revise it only after checking the changed material.",
  },
};

workflowArticles.push(courseWikiFromLectureNotesArticle);

const businessMetricDefinitionKnowledgeBaseArticle: BaseSpec = {
  slug: "build-business-metric-definition-knowledge-base",
  eyebrow: "Data dictionary workflow",
  category: "Workflows",
  title: "How to Build a Business Metric Definition Knowledge Base",
  description:
    "Turn approved KPI specifications into a source-backed data dictionary with formula text, grain, exclusions, owners, revisions, and review state.",
  metaTitle: "Build a Business Metric Definition Knowledge Base | Wenlan",
  metaDescription:
    "Build a reviewable metric-definition knowledge base from approved files, with formulas, grain, exclusions, owners, citations, revisions, and supersession.",
  keywords: [
    "business metric data dictionary",
    "metric definition knowledge base",
    "business glossary for AI agents",
    "KPI definition template",
    "metric glossary",
    "source backed data dictionary",
  ],
  publishedAt: "2026-09-01",
  updatedAt: "2026-09-08",
  readingTime: "8 min read",
  audience:
    "Data, analytics, product, finance, and operations teams resolving conflicting KPI definitions for people and AI agents",
  heroBullets: [
    "Start with approved metric specifications, not dashboards or inferred formulas.",
    "Keep formula text, grain, dimensions, exclusions, owner, and source revision in one record.",
    "Supersede stale definitions explicitly instead of letting agents blend them together.",
  ],
  quickAnswer:
    "Create one reviewed record per business metric. Record the business definition, formula as non-executable text, grain, dimensions, exclusions, owner, exact source IDs and revisions, review state, and which older definition it supersedes. When two approved sources disagree, preserve the conflict until a named reviewer resolves it; do not let an AI agent invent one blended definition.",
  quickAnswerLink: {
    label: "See the metric-definition evidence workflow",
    href: "#product-evidence",
  },
  wenlanFit:
    "Wenlan can read approved Markdown, text, and text-extractable PDFs, maintain source-backed Pages, preserve citations and source revisions, run provenance lint, and leave an exact revision for human review. It does not ingest CSV or YAML, does not run SQL, does not connect to a warehouse or BI tool, does not compute metrics, does not provide lineage, does not monitor data quality, does not manage permissions, does not approve definitions, and does not automatically reconcile conflicts.",
  problem:
    "A metric name such as active customer or net revenue can appear in a finance memo, analytics specification, product dashboard note, and operations handbook with different formulas, grains, exclusions, or owners. A polished summary can hide those differences. A useful data dictionary keeps each approved definition traceable, makes conflicts visible, and states which version is current without pretending to calculate the metric.",
  actionHeading: "Build one approved-specification to metric-record loop",
  actionIntro:
    "Begin with one metric family and a small set of approved definition files. The goal is a definition lookup and conflict-resolution record, not a live catalog of every table and dashboard.",
  actionBullets: [
    "Name the metric, business question, accountable owner, included files, excluded sources, and reviewer before synthesis.",
    "Register approved Markdown, text, or text-extractable PDF specifications. Keep CSV, YAML, SQL, warehouse metadata, and dashboard APIs outside this workflow.",
    "Write the formula as reviewable text and record its grain, dimensions, time window, inclusions, exclusions, and known edge cases.",
    "Attach each important field to the exact source ID, heading or page, source revision, and effective date.",
    "When approved sources disagree, keep both definitions and mark the record contradicted or unresolved instead of averaging or merging them.",
    "After a reviewer selects a current definition, record which version it supersedes, retain the earlier revision, and set the next review trigger.",
  ],
  code: {
    label: "Wenlan workflow and a neutral metric-definition record",
    code: "wenlan status\nwenlan sources add ~/Metrics/approved-specifications\n# In a Wenlan plugin client:\n/distill <metric definition>\n/pages <metric name>\n/lint\n/curate\n\nmetric: activated customer\nbusiness_definition: <what the approved sources mean>\nformula_text: <non-executable formula from the approved spec>\ngrain: <account | workspace | user | event>\ndimensions: <allowed breakdowns>\ninclusions: <included states or events>\nexclusions: <excluded states, events, or time windows>\nowner: <accountable team or reviewer>\nsources: <source IDs and exact locations>\nsource_revision: <version or effective date>\nreview_state: <current | stale | contradicted | unresolved>\nsupersedes: <previous definition or none>\nnext_review: <source-change trigger or date>",
  },
  caution:
    "This workflow maintains reviewed definition records; it is not a data catalog, semantic layer, metric store, governance platform, or calculation engine. Wenlan does not ingest CSV, does not run SQL, does not connect to a warehouse or BI system, does not compute metrics, does not provide lineage, does not monitor data quality, does not manage permissions, does not approve definitions, and does not automatically reconcile conflicting formulas. A named domain owner remains responsible for the business decision.",
  productEvidence: {
    heading: "Inspect source revision and review state before trusting a metric",
    summary:
      "This genuine Wenlan desktop capture comes from the app's deterministic test fixture, not a company's analytics or finance workspace. It shows maintained Pages with source counts and a review queue, the same product surfaces used to keep conflicting or revised metric evidence visible.",
    image: {
      src: "/images/product-evidence/wenlan-space-review-fixture.png",
      alt: "Wenlan desktop Space showing maintained Pages with source counts and a review queue for changed and conflicting evidence.",
      caption:
        "Genuine Wenlan app capture from a deterministic test fixture. It is a general product example, not a live data catalog or company metric record.",
      width: 1586,
      height: 992,
    },
    workflow: [
      {
        label: "Bound the approved specifications",
        detail:
          "Choose one metric family, allowed definition files, excluded systems, accountable owner, and named reviewer.",
      },
      {
        label: "Distill one definition record",
        detail:
          "Keep definition, formula text, grain, dimensions, exclusions, citations, source revision, and conflicts in one reviewable Page.",
      },
      {
        label: "Review before superseding",
        detail:
          "Open the cited source, inspect contradictions and stale state, then mark the current definition and retain the superseded revision.",
      },
    ],
    artifactHeading: "Worked business metric record",
    artifactNote:
      "This neutral template does not calculate a KPI. Replace every placeholder with approved specifications and a named domain reviewer.",
    artifactRows: [
      {
        label: "Meaning and formula text",
        detail:
          "Business definition, non-executable formula, grain, dimensions, inclusions, exclusions, and edge cases.",
      },
      {
        label: "Owner and sources",
        detail:
          "Accountable owner, exact source IDs and locations, source revisions, and effective dates.",
      },
      {
        label: "Review and supersession",
        detail:
          "Current, stale, contradicted, or unresolved, plus the reviewer, superseded version, and next review trigger.",
      },
    ],
    action: {
      label: "See the metric-definition evidence workflow",
      href: "#product-evidence",
    },
  },
  faq: [
    "Does this connect to a warehouse, BI tool, or metric store?",
    "No. This workflow uses approved Markdown, text, and text-extractable PDF specifications. Wenlan does not discover tables, run SQL, calculate KPIs, or synchronize a warehouse, BI tool, semantic layer, or metric store.",
    "What should happen when two approved metric definitions disagree?",
    "Keep both cited definitions, record their formula, grain, exclusions, owner, and revision, and mark the record contradicted or unresolved. A named domain reviewer decides which definition becomes current and records what it supersedes.",
  ],
  relatedSlugs: [
    "source-backed-wiki-pages-ai-work",
    "verify-ai-knowledge-base-citations",
    "prevent-multi-agent-knowledge-conflicts",
    "build-investment-research-knowledge-base",
  ],
  officialReferences: [
    {
      label: "Wenlan supported document sources",
      href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
    },
    {
      label: "Wenlan source-backed Pages",
      href: "https://wenlan.app/docs/source-backed-pages",
    },
    {
      label: "Wenlan review and trust",
      href: "https://wenlan.app/docs/review-and-trust",
    },
    {
      label: "DataHub business glossary documentation",
      href: "https://github.com/datahub-project/datahub/blob/master/docs/glossary/business-glossary.md",
    },
  ],
  cta: {
    heading: "Make one metric definition inspectable",
    body: "Start with approved specification files, preserve conflicts and exact sources, and supersede an older definition only after a named reviewer checks it.",
  },
};

workflowArticles.push(businessMetricDefinitionKnowledgeBaseArticle);

const productResearchArticle: LearnArticle = {
  slug: "build-product-research-knowledge-base-for-prd",
  eyebrow: "Product research workflow",
  category: "Workflows",
  title: "Build a Product Research Knowledge Base Before Writing a PRD",
  description:
    "Turn approved research notes, support and sales signals, and prior decisions into a source-backed evidence base for a defensible PRD.",
  metaTitle: "Build a Product Research Knowledge Base Before a PRD | Wenlan",
  metaDescription:
    "Connect user research to a defensible PRD with dated sources, traceable requirements, contradictions, assumptions, open questions, and decision history.",
  keywords: [
    "product research knowledge base",
    "user research to PRD",
    "source-backed product decisions",
    "evidence-based PRD",
    "UX research knowledge base",
    "product operations knowledge base",
    "product discovery evidence",
  ],
  publishedAt: "2026-08-28",
  updatedAt: "2026-09-08",
  author: "Qi-Xuan Lu",
  readingTime: "8 min read",
  audience:
    "Product managers, UX researchers, and product operations teams preparing a PRD or roadmap review",
  heroBullets: [
    "Start with one product decision and its approved evidence boundary.",
    "Trace each requirement to dated research, support, sales, or decision sources.",
    "Keep observations, interpretations, assumptions, contradictions, and open questions separate.",
  ],
  productEvidence: {
    heading: "See the source-backed workspace a reviewer inspects",
    summary:
      "The product proof below is a genuine Wenlan desktop capture from the app's deterministic test fixture. It shows recently refined Pages with source counts plus a review queue for conflicts and newly available sources. The fixture is not customer data; the same review surface supports product-research evidence.",
    image: {
      src: "/images/product-evidence/wenlan-space-review-fixture.png",
      alt: "Wenlan desktop Space view showing recently refined Pages with source counts and a review queue for a source conflict and newly available sources.",
      caption:
        "Genuine Wenlan app capture from a deterministic test fixture: a general product example, not the output of a product-research project. Page rows show source counts; the review queue shows a source conflict and new sources.",
      width: 1586,
      height: 992,
    },
    workflow: [
      {
        label: "Approve the source boundary",
        detail:
          "Include only dated research notes, support or sales passages, and prior decisions the product team is allowed to inspect.",
      },
      {
        label: "Distill one product decision",
        detail:
          "Build one maintained Page for the question under review, with source IDs and contradictions attached to each consequential claim.",
      },
      {
        label: "Review before drafting",
        detail:
          "Open the cited passage, check the current revision and stale state, then carry only supported or explicitly unresolved requirements into the PRD.",
      },
    ],
    artifactHeading: "Worked PRD evidence packet",
    artifactNote:
      "This is an example structure, not a claim about your users. Replace every row with approved evidence from the product decision you are reviewing.",
    artifactRows: [
      {
        label: "Evidence input",
        detail:
          "A dated interview observation, support passage, sales note, or prior decision with an exact source location.",
      },
      {
        label: "Requirement candidate",
        detail:
          "One reviewable statement that separates the observed problem from interpretation, scope, and assumptions.",
      },
      {
        label: "Review result",
        detail:
          "Supported, contradicted, stale, or unresolved, with the reviewer and next check recorded before PRD approval.",
      },
    ],
    action: {
      label: "See evidence workflow",
      href: "#product-evidence",
    },
  },
  sections: [
    {
      heading: "Start with one product decision, not a company-wide archive",
      body: [
        "Before drafting a PRD, build one product-scoped evidence base for the decision under review. Collect only approved interview notes, support or sales notes, research artifacts, and prior decisions that the team can inspect; the goal is to make each requirement traceable, not to create a generic repository of every conversation.",
        "Wenlan can keep those supported Markdown, text, text-extractable PDF, folder, and read-only Obsidian sources connected to source-backed Pages, citations, revisions, stale state, and review. It does not decide the roadmap or turn a source into an approved product requirement.",
      ],
    },
    {
      heading: "Freeze the source boundary before synthesis",
      body: [
        "Write down the product area, review question, date range, included source types, and excluded material before asking an agent to synthesize. A narrow boundary makes it possible to tell whether a requirement is supported by an observed user need, a team interpretation, an assumption, or a decision that needs to be revisited.",
        "Keep source dates, document versions, and exact headings or passages in a small source register. If a note is incomplete or a source is not approved for this product decision, record it as unavailable rather than silently filling the gap.",
      ],
      bullets: [
        "Approved interview or research notes: preserve the observation and its source location.",
        "Support or sales notes: separate a repeated problem signal from an unverified request.",
        "Prior decisions: record the decision date, rationale, scope, and evidence available then.",
        "Assumptions and open questions: keep them visible instead of presenting them as user facts.",
      ],
    },
    {
      heading: "Build the evidence chain from note to requirement",
      body: [
        "Use one row or Page section per important requirement. Link the requirement to dated source passages, distinguish reported observations from your interpretation, and record contradictory evidence before deciding whether the requirement should remain, narrow, or stay unresolved.",
        "The same chain should survive a PRD review: a reviewer can open the source, see the current revision, understand which assumptions remain, and follow how a prior decision changed. If a source changes, refresh only the affected Page and leave the previous revision available for review.",
      ],
      bullets: [
        "Record the product question, source ID, date, exact location, and scope.",
        "Classify each statement as observation, interpretation, assumption, decision, or open question.",
        "Attach acceptance or rejection rationale to the evidence, not just to a meeting outcome.",
        "Compare conflicting signals and preserve the contradiction when the evidence cannot resolve it.",
        "Mark unsupported or stale requirements before they enter a PRD draft.",
      ],
      code: {
        label: "A bounded product-research knowledge workflow",
        code: "wenlan status\nwenlan sources add ~/Research/product-notes\n/distill <product decision>\n/pages <product decision>\n/lint\n/curate",
      },
    },
    {
      heading: "Draft the PRD only after the evidence is inspectable",
      body: [
        "A PRD can summarize the evidence base, but it should not hide the evidence behind polished prose. Before the review, check that every requirement has a source path or an explicit unresolved label, every important assumption has an owner or next check, and every prior decision still matches the current source set.",
        "This makes the document useful even without Wenlan: a small evidence register, requirement-to-source map, contradiction log, assumption list, and decision history are a repeatable product-research practice rather than a vendor-specific format.",
      ],
    },
    {
      heading: "Know what this workflow does not automate",
      body: [
        "Wenlan does not transcribe meetings, redact personally identifiable information, recruit participants, ingest analytics, connect Jira, Linear, Slack, or a CRM, automatically prioritize opportunities, generate a complete PRD, choose a roadmap, or claim a product outcome. Use maintained sources and human review for those decisions and controls.",
        "It also cannot make an unsupported request true. Keep the source, claim, date, limitation, and review state visible so an agent can help organize evidence without replacing the product team's judgment.",
      ],
    },
  ],
  faqs: [
    {
      question: "Can Wenlan turn user research directly into a PRD?",
      answer:
        "No. It can help maintain a source-backed evidence base and a traceable requirement map from approved notes, but product managers and researchers still interpret evidence, resolve priorities, and write and approve the PRD.",
    },
    {
      question: "What if interview notes and support requests disagree?",
      answer:
        "Keep both dated sources, state their scope, and record the contradiction or unresolved question. Do not merge a support request, an observation, and a product decision into one unsupported requirement.",
    },
    {
      question: "Does this connect to Jira, Linear, Slack, or a CRM?",
      answer:
        "Not in this workflow. Use supported Markdown, text, text-extractable PDFs, folders, or a read-only Obsidian source, and explicitly maintain any exports or notes you are allowed to use.",
    },
  ],
  relatedSlugs: [
    "build-local-ai-knowledge-base-from-documents",
    "verify-ai-knowledge-base-citations",
    "source-backed-wiki-pages-ai-work",
    "source-backed-research-knowledge-base",
    "build-client-project-knowledge-base-for-consulting",
  ],
  officialReferences: [
    {
      label: "Wenlan supported document sources",
      href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
    },
    {
      label: "Wenlan source-backed Pages",
      href: "https://wenlan.app/docs/source-backed-pages",
    },
    {
      label: "Wenlan review and trust",
      href: "https://wenlan.app/docs/review-and-trust",
    },
    {
      label: "Wenlan daily workflow",
      href: "https://github.com/7xuanlu/wenlan#daily-workflow",
    },
  ],
  cta: {
    heading: "Make one product decision traceable",
    body: "Start with an approved source set, map requirements to dated evidence, and keep contradictions and open questions visible before the PRD review.",
  },
};

export const seoArticles: LearnArticle[] = [
  ...setupArticles,
  ...workflowArticles,
  ...comparisonArticles,
  ...trustArticles,
].map(makeArticle).concat(retrievalRegressionArticle, productResearchArticle);
