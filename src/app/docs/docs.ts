import { DEFAULT_AUTHOR, SITE_URL } from "../learn/articles";

export const DOCS_UPDATED_AT = "2026-05-15";

export type DocGroup = "After setup" | "Reference";

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
  updatedAt: string;
  author: string;
  readingTime: string;
  summary: string[];
  sections: DocSection[];
  nextSlug?: string;
};

const mcpConfig = `{
  "mcpServers": {
    "origin": {
      "command": "npx",
      "args": ["-y", "origin-mcp"]
    }
  }
}`;

export const docPages: DocPage[] = [
  {
    slug: "daily-workflow",
    group: "After setup",
    eyebrow: "Workflow",
    title: "Daily Workflow",
    description:
      "Use Origin as a session rhythm: brief, work, capture, recall, and hand off before context goes cold.",
    metaTitle: "Origin Daily Workflow | Docs",
    metaDescription:
      "Learn the daily Origin loop after setup: /brief, /capture, /recall, /handoff, plus review and distillation when needed.",
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "Origin works best as a lightweight habit around AI work, not as a place where you manually file every note.",
      "Start sessions with context, capture durable facts while working, recall when the agent needs history, and end with a handoff.",
      "Scoped /review and /distill are optional maintenance passes, not commands you need to run after every message.",
    ],
    sections: [
      {
        heading: "Start with context",
        body: [
          "At the beginning of a real work session, run /brief. Origin loads relevant identity, preferences, project facts, recent handoffs, decisions, and distilled pages so the agent does not start cold.",
          "If this is your first time in a client, run /init first. It verifies the daemon, plugin, MCP route, and memory round trip.",
        ],
        code: {
          label: "Claude Code",
          code: "/brief",
        },
      },
      {
        heading: "Capture only durable knowledge",
        body: [
          "Use /capture for knowledge that should survive the current chat: decisions, lessons, gotchas, project constraints, user preferences, and facts future agents would otherwise rediscover.",
          "Keep each capture atomic. One idea per memory is easier to search, merge, correct, and cite later.",
        ],
        bullets: [
          "Good: We chose the default local setup because this project needs local search without model setup.",
          "Good: The website should describe Origin as AI work memory, not just a memory app.",
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
          "/review is the deep audit path for pending captures and revisions. /distill is for turning related memories into wiki pages that are easier for humans and agents to read.",
          "You do not need to run these constantly. Use them after meaningful project work, before a new phase, or when recall starts surfacing repeated or stale context.",
        ],
        bullets: [
          "/review captures: walk unconfirmed memories when you want the full queue.",
          "/review revisions: accept or dismiss pending memory revisions.",
          "/distill: link, dedupe, and synthesize related memories into readable pages.",
          "/read: preview a distilled page without leaving the agent session.",
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
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "7 min read",
    summary: [
      "Origin is local-first memory for AI work, not a chat UI or a notes app replacement.",
      "The daemon owns storage and retrieval; plugins and MCP clients are thin ways for agents to read and write context.",
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
          "Origin does not try to preserve every token as the primary interface. It helps extract the durable parts and makes them searchable later.",
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
          "The local daemon is the source of truth. It owns the database, search, background refinement, provenance, and API.",
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
      "Reference the daily Origin Claude Code commands and MCP tools: /init, /brief, /capture, /recall, /handoff, scoped /review, /distill, and doctor.",
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "Most users mainly need setup plus four daily commands: /init, /brief, /capture, /recall, and /handoff.",
      "Review and distillation commands are for maintenance and synthesis.",
      "MCP clients use tools with the same shape: context, capture, recall, distill, list pending, confirm memory, forget, and doctor.",
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
          "context: load a useful context packet.",
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
          "If you are starting work, use /brief. If you learned something durable, use /capture. If the agent needs history, use /recall. If you are ending work, use /handoff.",
          "Reach for /review captures, /review revisions, /distill, and /read when the memory layer needs maintenance or a topic has become important enough to deserve a page.",
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
      "Understand Origin local storage, the default local setup, optional model/API paths, Markdown records, the local index, and deletion controls.",
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "7 min read",
    summary: [
      "Origin is local-first: the memory layer is owned by the daemon on your machine.",
      "The default local setup does not require a local model or cloud API key.",
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
        heading: "Default local setup",
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
      "Configure MCP-compatible clients to use Origin through npx -y origin-mcp and share one local AI work memory layer across tools.",
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    summary: [
      "Origin's daemon is the local source of truth; origin-mcp is the bridge MCP clients launch.",
      "Multiple clients can connect to the same memory layer instead of each keeping a separate context silo.",
      "Claude Code users should start with the plugin. Other clients can use the MCP server config directly.",
    ],
    sections: [
      {
        heading: "How the pieces connect",
        body: [
          "The daemon runs locally and owns memory. The MCP server is a separate process the client can spawn with npx.",
          "Once connected, the client can call Origin tools to capture, recall, distill, confirm, forget, and diagnose memory.",
        ],
      },
      {
        heading: "Generic MCP config",
        body: [
          "Use this shape in any MCP-compatible client that accepts a JSON mcpServers configuration.",
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
          "Codex, Cursor, Claude Desktop, Gemini CLI, Windsurf, and other MCP clients can use the generic config when they support local MCP servers.",
          "The exact settings screen differs by client. The important part is that the command is npx and the args are -y and origin-mcp.",
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
      "Troubleshoot Origin setup issues with the daemon, MCP connection, Claude Code plugin commands, npx -y origin-mcp, port 7878, and memory recall.",
    updatedAt: DOCS_UPDATED_AT,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    summary: [
      "Start with /init in Claude Code or the doctor tool in an MCP client.",
      "Most issues are one of three things: daemon not reachable, MCP server not configured, or the client needs a restart.",
      "If the setup checks pass but recall feels weak, improve the query and inspect pending memory before changing configuration.",
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
          "Only one daemon should own the local database. If you have been developing Origin locally, make sure an old daemon from another checkout is not still running.",
        ],
      },
      {
        heading: "MCP client is not connected",
        body: [
          "Check that the client config uses command npx and args -y plus origin-mcp. Some clients require a full restart after changing MCP settings.",
          "If the client shows the server but tools fail, run doctor. It reports whether the daemon is reachable and which memory mode is active.",
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
          "If the memory exists but is stale or duplicated, use /review captures or /review revisions for pending queues and /distill when a topic deserves a clearer page.",
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
