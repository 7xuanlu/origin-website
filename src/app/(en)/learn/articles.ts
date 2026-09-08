import { seoArticles } from "./seo-articles";
import { workedExampleSections } from "@/lib/llm-wiki-worked-example";

export const SITE_URL = "https://wenlan.app";
export const DEFAULT_AUTHOR = "Qi-Xuan Lu";
export const DEFAULT_AUTHOR_URL = "https://github.com/7xuanlu";
export const DEFAULT_AUTHOR_SAME_AS = ["https://github.com/7xuanlu"];

export const articleCategories = ["Concepts", "Comparisons", "Workflows"] as const;

export type LearnArticleCategory = (typeof articleCategories)[number];

export type LearnArticleSection = {
  id?: string;
  heading: string;
  body: string[];
  bullets?: string[];
  code?: {
    label: string;
    code: string;
  };
  link?: {
    label: string;
    href: string;
  };
};

export type LearnArticleFaq = {
  question: string;
  answer: string;
};

export type OfficialReference = {
  label: string;
  href: string;
};

export type ComparisonRow = {
  dimension: string;
  wenlan: string;
  competitor: string;
};

export type ComparisonTable = {
  competitorName: string;
  rows: ComparisonRow[];
};

export type ProductEvidence = {
  heading: string;
  summary: string;
  image: {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
  };
  workflow: Array<{
    label: string;
    detail: string;
  }>;
  artifactHeading: string;
  artifactNote: string;
  artifactRows: Array<{
    label: string;
    detail: string;
  }>;
  action: {
    label: string;
    href: string;
  };
};

export type LearnArticle = {
  slug: string;
  eyebrow: string;
  category: LearnArticleCategory;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  publishedAt?: string;
  updatedAt: string;
  author: string;
  readingTime: string;
  audience: string;
  heroBullets: string[];
  sections: LearnArticleSection[];
  comparisonTable?: ComparisonTable;
  faqs: LearnArticleFaq[];
  relatedSlugs: string[];
  officialReferences?: OfficialReference[];
  productEvidence?: ProductEvidence;
  cta: {
    heading: string;
    body: string;
  };
};

const updatedAt = "2026-06-24";

const baseArticles: LearnArticle[] = [
  {
    slug: "ai-work-memory",
    eyebrow: "Concept",
    category: "Concepts",
    title: "What Is AI Work Memory?",
    description:
      "AI work memory carries sessions, decisions, lessons, project context, and wiki pages across tools and time.",
    metaTitle: "What Is AI Work Memory? | Wenlan",
    metaDescription:
      "Learn what AI work memory is, when built-in memory is not enough, and how Wenlan keeps work context local, visible, correctable, and MCP-native.",
    keywords: [
      "AI work memory",
      "memory for AI work",
      "LLM wiki for AI work",
      "durable AI work context",
      "Wenlan AI work",
    ],
    updatedAt,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    audience: "AI power users, knowledge workers, and developers",
    heroBullets: [
      "Captures decisions, preferences, gotchas, and project knowledge from AI work.",
      "Makes memory visible and correctable instead of hiding it inside a model profile.",
      "Lets multiple AI tools recall the same durable context through MCP.",
    ],
    sections: [
      {
        heading: "The short definition",
        body: [
          "AI work memory is durable context from real work with AI agents, made available when a later session needs it.",
          "That context can include decisions, facts, project constraints, personal preferences, lessons learned, handoffs, wiki pages, and relationships between ideas. The goal is simple: your AI should not rediscover the same knowledge from scratch every session.",
        ],
      },
      {
        heading: "Why built-in memory is not enough",
        body: [
          "Built-in memory is convenient, but it is usually opaque. The assistant decides what matters, stores a compressed version, and may retrieve it later without showing you why.",
          "For real work, people need memory they can inspect, correct, delete, and trace back to source conversations. Bad memory is worse than no memory when it contains stale decisions or wrong assumptions.",
        ],
        bullets: [
          "You need to see what the assistant remembers.",
          "You need provenance for important claims and decisions.",
          "You need memory to move across tools, not stay trapped in one chat product.",
          "You need contradictions and duplicates to be managed over time.",
        ],
      },
      {
        heading: "What useful AI work memory should do",
        body: [
          "The core job is not hoarding transcripts. Useful memory distills noisy conversations into compact knowledge and retrieves the right pieces later.",
          "That usually means combining semantic search, full-text search, metadata, and a knowledge graph. It also means letting people curate memory instead of trusting a black box.",
        ],
      },
      {
        heading: "How Wenlan approaches AI work memory",
        body: [
          "Wenlan is a local-first, source-backed LLM wiki for AI work in Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, ChatGPT, Claude.ai, and other MCP-compatible tools.",
          "Wenlan stores useful context locally, makes memory visible and correctable, writes handoffs, distills source-backed wiki pages, and uses hybrid retrieval that combines vector search, full-text search, and graph context.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is AI work memory the same as a notes app?",
        answer:
          "No. A notes app is mainly for human writing and retrieval. AI work memory turns sessions, decisions, lessons, and project context into structured context that assistants can recall while they work.",
      },
      {
        question: "Does AI work memory replace ChatGPT or Claude memory?",
        answer:
          "It can complement or replace parts of built-in memory. The main difference is control: Wenlan makes memories visible, correctable, traceable, and available across MCP-compatible tools.",
      },
    ],
    relatedSlugs: ["mcp-memory-server", "local-first-ai-memory", "wenlan-vs-basic-memory"],
    cta: {
      heading: "Make your AI work compound",
      body: "Wenlan turns decisions, lessons, handoffs, and project context into memory and wiki pages your agents can use later.",
    },
  },
  {
    slug: "mcp-memory-server",
    eyebrow: "Protocol",
    category: "Concepts",
    title: "MCP Knowledge Base Server for AI Agents",
    description:
      "Connect Claude Code, Codex, ChatGPT, Cursor, and other AI clients to a local, source-backed knowledge base through MCP.",
    metaTitle: "MCP Knowledge Base Server for AI Agents | Wenlan",
    metaDescription:
      "Learn what an MCP knowledge base server should expose, how it differs from session memory, and how to verify sources, citations, and freshness across AI clients.",
    keywords: [
      "MCP knowledge base server",
      "MCP knowledge server",
      "knowledge base MCP",
      "MCP knowledge base for AI agents",
      "MCP memory server",
      "Claude Code knowledge base",
      "Codex knowledge base",
      "ChatGPT MCP knowledge base",
      "Cursor MCP knowledge base",
    ],
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-13",
    author: DEFAULT_AUTHOR,
    readingTime: "8 min read",
    audience: "Developers connecting AI agents to a shared knowledge base",
    heroBullets: [
      "MCP gives AI clients a standard way to query knowledge, call tools, and retrieve resources.",
      "A useful knowledge-base server preserves sources, citations, maintained answers, and freshness—not just chat history.",
      "Wenlan connects coding tools locally and ChatGPT or Claude.ai through Streamable HTTP MCP, backed by the same source-aware knowledge system.",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "An MCP knowledge base server lets AI clients query durable project knowledge through a standard connection. The useful version does more than return remembered snippets: it keeps the original sources inspectable, returns citations or source IDs, and makes stale answers reviewable.",
          "Wenlan provides that local-first route. Claude Code, Codex, Cursor, ChatGPT, Claude.ai, and other MCP clients can reach the same source-backed memories and maintained wiki pages without copying the whole knowledge base into every prompt.",
        ],
        bullets: [
          "Use MCP when several AI clients need the same knowledge through one standard interface.",
          "Keep sources and citations when an answer must remain auditable after the source changes.",
          "Use a local server when private project documents and decisions should stay on your machine.",
        ],
      },
      {
        heading: "What MCP adds to a knowledge base",
        body: [
          "The Model Context Protocol lets servers expose tools, resources, and prompts to AI applications. A knowledge-base server can therefore offer search and retrieval without forcing each host application to invent a custom connector.",
          "That boundary matters across Claude Code, Codex, ChatGPT, Cursor, and other clients. The client handles the current task; the server owns durable sources, retrieval, and the maintained knowledge that should survive one session or tool.",
        ],
      },
      {
        heading: "What an MCP knowledge-base server should expose",
        body: [
          "A useful server needs a narrow query path, inspectable sources, citations or stable source IDs, and a way to tell whether an answer is current. Write access should be explicit, and stale or contradictory knowledge should enter review instead of silently replacing a trusted source.",
          "Wenlan exposes context, capture, recall, distillation, page access, review, forget, and diagnostic paths through its CLI, plugins, and MCP connector. Atomic memories retain provenance while maintained pages turn reviewed evidence into reusable answers.",
        ],
      },
      {
        heading: "MCP memory server vs knowledge base",
        body: [
          "An MCP memory server usually focuses on facts or context carried across sessions. An MCP knowledge base goes further: it connects those facts to documents, source boundaries, citations, maintained pages, and a refresh or review lifecycle.",
          "The two can share one server. In Wenlan, small durable memories help agents recall context, while source-backed pages organize reviewed knowledge into human-readable answers. Neither layer makes the source code or original document unnecessary.",
        ],
      },
      {
        heading: "Local vs hosted knowledge base",
        body: [
          "Hosted servers can be convenient, but private documents and project decisions leave your machine. A local knowledge base takes more setup while keeping its store, sources, and review trail under your control.",
          "Wenlan uses a local daemon and local MCP connector for coding tools. Its optional Streamable HTTP route is for web clients such as ChatGPT and Claude.ai; enabling remote access is a separate choice rather than the default storage model.",
        ],
      },
      {
        heading: "Install path",
        body: [
          "Claude Code and Codex have Wenlan plugin paths. For local MCP clients, run Wenlan setup, then use wenlan connect <client> to write the client-specific configuration.",
          "ChatGPT and Claude.ai use Streamable HTTP MCP. The desktop app's Remote Access panel creates the URL and shows the web-client setup steps.",
        ],
        code: {
          label: "MCP client setup",
          code: "npx -y wenlan setup\n~/.wenlan/bin/wenlan connect cursor\n~/.wenlan/bin/wenlan connect codex\n# or: claude-desktop, vscode, gemini",
        },
        link: {
          label: "Read all MCP client setup paths",
          href: "/docs/mcp-clients",
        },
      },
      {
        heading: "Verify the MCP knowledge-base route",
        body: [
          "Do not trust a knowledge-base connection because the client merely reports that an MCP server is configured. Test retrieval, provenance, and cross-client consistency with a harmless source before relying on it for real work.",
        ],
        bullets: [
          "List the server tools from one MCP client and confirm the expected read path is available.",
          "Query one harmless source and inspect the citation or source ID behind the answer.",
          "Change the source, then verify that stale knowledge is refreshed or enters review.",
          "Confirm a second client can retrieve the same maintained answer without copying the source into its prompt.",
        ],
        link: {
          label: "See the source-backed LLM-wiki workflow",
          href: "/learn/distilled-wiki-pages-ai-memory",
        },
      },
    ],
    faqs: [
      {
        question: "Is an MCP knowledge base the same as RAG?",
        answer:
          "No. MCP is the connection protocol. RAG is one retrieval pattern a server may use. A dependable knowledge base also needs inspectable sources, citations, freshness checks, and a maintenance path.",
      },
      {
        question: "Can one MCP knowledge base work with multiple AI tools?",
        answer:
          "Yes, if the tools support the server's MCP transport and are configured for the same knowledge base. Wenlan supports local coding clients and an optional Streamable HTTP route for compatible web clients.",
      },
      {
        question: "Does Wenlan replace the original documents or codebase?",
        answer:
          "No. Wenlan keeps sources, memories, and maintained pages separate. Agents should still inspect the current source code or original document when the task depends on exact implementation or wording.",
      },
    ],
    relatedSlugs: [
      "prevent-multi-agent-knowledge-conflicts",
      "source-backed-wiki-pages-ai-work",
      "build-local-ai-knowledge-base-from-documents",
      "distilled-wiki-pages-ai-memory",
      "cursor-claude-code-shared-memory",
    ],
    officialReferences: [
      {
        label: "MCP server concepts",
        href: "https://modelcontextprotocol.io/docs/learn/server-concepts",
      },
      {
        label: "MCP client concepts",
        href: "https://modelcontextprotocol.io/docs/learn/client-concepts",
      },
      {
        label: "MCP Knowledge Base package",
        href: "https://pypi.org/project/mcp-kb/",
      },
      {
        label: "Claude Code MCP setup",
        href: "https://code.claude.com/docs/en/mcp",
      },
      {
        label: "Wenlan on GitHub",
        href: "https://github.com/7xuanlu/wenlan",
      },
    ],
    cta: {
      heading: "Connect a source-backed knowledge base",
      body: "Install Wenlan, connect one MCP client, and verify retrieval, citations, freshness, and cross-client access before using it for real work.",
    },
  },
  {
    slug: "local-first-ai-memory",
    eyebrow: "Privacy",
    category: "Concepts",
    title: "Local-First AI Work Memory: Keep Context on Your Machine",
    description:
      "Local-first AI work memory keeps sensitive project knowledge, decisions, and preferences under your control while still making them useful to assistants.",
    metaTitle: "Local-First AI Work Memory | Wenlan",
    metaDescription:
      "Learn why local-first AI work memory matters for privacy, ownership, and long-running work. Wenlan keeps work context visible, correctable, and on your machine.",
    keywords: [
      "local-first AI work memory",
      "private AI work memory",
      "on-device AI work memory",
      "open source AI work memory",
      "self-hosted AI work memory",
    ],
    updatedAt,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    audience: "People using AI with sensitive work, client context, or private knowledge",
    heroBullets: [
      "Your memory database stays on your machine by default.",
      "On-device intelligence processes memory without making cloud storage the default.",
      "Every memory remains visible, correctable, and traceable.",
    ],
    sections: [
      {
        heading: "What local-first means for AI work memory",
        body: [
          "Local-first AI work memory means the durable context your assistants rely on is owned and stored primarily on your device. Cloud services may still be useful in some workflows, but they are not the default source of truth.",
          "For memory, that distinction matters. The data can include client names, strategy decisions, personal preferences, private codebase details, and the accumulated reasoning behind your work.",
        ],
      },
      {
        heading: "Why memory is more sensitive than prompts",
        body: [
          "A single prompt may be sensitive. A memory layer is sensitive in a different way because it accumulates. Over time it becomes a compact map of what you care about, what you are building, where you got stuck, and what decisions you made.",
          "That makes visibility and control non-negotiable. You should be able to inspect, correct, export, and delete what your AI remembers.",
        ],
      },
      {
        heading: "The tradeoff",
        body: [
          "Cloud memory can be easier to access across devices. Local-first memory gives stronger ownership, simpler privacy boundaries, and better fit for work that cannot casually leave your machine.",
          "Wenlan chooses local-first because the memory layer should be something you trust, not another opaque profile maintained by a platform.",
        ],
      },
      {
        heading: "How Wenlan keeps memory useful",
        body: [
          "Local-first does not mean inert. Wenlan combines vector search, full-text search, and a knowledge graph so assistants can retrieve the right work context without replaying everything.",
          "It also makes memory inspectable. You can see what was learned, trace it back to source conversations, and correct it when your understanding changes.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does local-first mean no AI model can use the memory?",
        answer:
          "No. Local-first means the memory layer is owned locally. MCP-compatible AI tools can still access relevant context through the local Wenlan daemon.",
      },
      {
        question: "Is Wenlan fully self-hosted?",
        answer:
          "Wenlan is local-first on macOS, Linux, and Windows. The daemon and database run locally, and optional integrations may depend on the AI tools you connect.",
      },
    ],
    relatedSlugs: ["ai-work-memory", "mcp-memory-server", "markdown-local-index-ai-memory"],
    cta: {
      heading: "Keep your context where your work lives",
      body: "Wenlan gives AI tools useful memory without making your accumulated work context cloud-first by default.",
    },
  },
  {
    slug: "claude-code-memory",
    eyebrow: "Developer workflow",
    category: "Workflows",
    title: "Claude Code Memory: CLAUDE.md, /memory, and MCP Context",
    description:
      "Understand CLAUDE.md, Claude Code auto memory, /memory, and when to add Wenlan's local MCP memory for shared project context.",
    metaTitle: "Claude Code Memory: CLAUDE.md, /memory, MCP | Wenlan",
    metaDescription:
      "Use CLAUDE.md, auto memory, and /memory well. Add Wenlan when Claude Code needs local, source-backed memory shared with Cursor and Codex.",
    keywords: [
      "Claude Code memory",
      "Claude Code persistent memory",
      "Claude Code /memory",
      "Claude Code memory plugin",
      "Claude Code memory repo",
      "Claude Code MCP memory",
      "Claude Code project context",
      "AI coding agent memory",
    ],
    publishedAt: "2026-06-07",
    updatedAt: "2026-07-18",
    author: DEFAULT_AUTHOR,
    readingTime: "7 min read",
    audience: "Developers using Claude Code, Cursor, and other AI coding agents",
    heroBullets: [
      "Use CLAUDE.md for stable project instructions and auto memory for assistant-learned corrections and preferences.",
      "Use /memory to inspect and edit native memory before adding another memory layer.",
      "Add Wenlan when work context must be source-backed, reviewable, and shared with Cursor, Codex, and other MCP clients.",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Start with Claude Code's native memory. Use CLAUDE.md for instructions you maintain, auto memory for learnings Claude saves, and /memory to inspect or edit both surfaces.",
          "Auto memory is per repository and shared across worktrees. Claude Code loads the first 200 lines or 25 KB of its MEMORY.md entrypoint, whichever comes first, at the start of each conversation.",
          "Add Wenlan only when the problem extends beyond native memory: evolving work context needs provenance, review, handoff, or access from Cursor, Codex, and other MCP-compatible tools.",
        ],
        bullets: [
          "Put stable rules, commands, and project architecture in CLAUDE.md.",
          "Use Claude Code auto memory for repeated corrections and preferences Claude discovers.",
          "Use Wenlan for source-backed decisions, gotchas, handoffs, wiki pages, and shared MCP memory.",
        ],
      },
      {
        heading: "How Claude Code memory works",
        body: [
          "Each Claude Code session starts with a fresh context window. Claude Code carries knowledge forward through CLAUDE.md files and auto memory, and both are loaded into new conversations as context.",
          "Auto memory is machine-local. Worktrees and subdirectories in the same Git repository share one auto memory directory, while separate repositories do not.",
          "Only the first 200 lines or 25 KB of auto memory's MEMORY.md loads at session start. Keep that index concise; detailed topic files can be read on demand.",
        ],
      },
      {
        heading: "Use CLAUDE.md for stable instructions",
        body: [
          "CLAUDE.md is excellent for project-level instructions: build commands, test commands, architecture notes, coding standards, and long-lived conventions the whole team should share.",
          "It should not become a dumping ground for every transient observation from every coding session. When the file gets too large or contradictory, Claude has more context to scan and less room for the current task.",
        ],
      },
      {
        heading: "Use native memory before another layer",
        body: [
          "If Claude Code seems to forget something, run /memory first. It lists memory locations, opens files for review, and lets you inspect or toggle auto memory.",
          "Use /context to verify which CLAUDE.md files loaded. The problem may be a missing file, the wrong scope, conflicting instructions, or an oversized memory index rather than a need for another tool.",
        ],
      },
      {
        heading: "When Wenlan adds value",
        body: [
          "Use Wenlan when project context needs provenance, review, deletion, handoff, distillation, and access from more than one MCP-compatible tool.",
          "Useful Wenlan captures are specific and grounded: why a decision was made, what tradeoffs were considered, what command verifies a change, which module owns a behavior, or what gotcha should not be rediscovered next week.",
        ],
        link: {
          label: "Turn Claude Code memory into an LLM wiki",
          href: "/learn/distilled-wiki-pages-ai-memory",
        },
      },
      {
        heading: "Install path for Claude Code",
        body: [
          "The Claude Code plugin is the most complete Wenlan path because it adds /setup, /brief, /capture, /recall, /handoff, /distill, and review workflows around the local daemon and MCP connector.",
          "After installing, restart Claude Code if prompted, run /setup once, then verify a harmless capture and recall before relying on Wenlan for real project memory.",
        ],
        code: {
          label: "Claude Code plugin",
          code: "/plugin marketplace add 7xuanlu/wenlan\n/plugin install wenlan@7xuanlu-wenlan\n/setup\n/capture This project uses Wenlan for local AI work memory.\n/recall local AI work memory",
        },
      },
      {
        heading: "Share memory with Cursor and Codex",
        body: [
          "Wenlan exposes memory through its MCP server. Claude Code can write what it learns and recall relevant project context later. The same work context can also be available to Cursor, Codex, Claude Desktop, Gemini CLI, and other MCP clients when configured.",
          "That makes Wenlan a shared local layer for AI-assisted development rather than a single-client note file.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should Claude Code memory replace CLAUDE.md?",
        answer:
          "No. CLAUDE.md is best for stable project instructions. Wenlan is best for evolving memory across sessions, tools, and projects.",
      },
      {
        question: "Can Cursor use the same memory?",
        answer:
          "Yes. Wenlan is MCP-native, so multiple compatible tools can connect to the same local daemon and source-backed wiki when configured.",
      },
    ],
    relatedSlugs: ["claude-code-memory-command-vs-wenlan", "wenlan-for-claude-code", "mcp-memory-server"],
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
        label: "Wenlan on GitHub",
        href: "https://github.com/7xuanlu/wenlan",
      },
    ],
    cta: {
      heading: "Verify Claude Code memory locally",
      body: "Install the Wenlan plugin, run /setup, then test one capture and recall before adding real project context.",
    },
  },
  {
    slug: "wenlan-for-claude-code",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "Wenlan for Claude Code Memory: The Daily /brief and /handoff Loop",
    description:
      "Use Wenlan inside Claude Code with /setup, /brief, /capture, /recall, /handoff, and /distill so coding context carries across sessions.",
    metaTitle: "Wenlan for Claude Code Memory | Daily Workflow",
    metaDescription:
      "Install the Wenlan Claude Code plugin, run /setup, start with /brief, capture durable decisions, and hand off sessions with local AI work memory.",
    keywords: [
      "Wenlan Claude Code",
      "Claude Code Wenlan plugin",
      "Claude Code memory workflow",
      "Claude Code handoff",
      "Claude Code persistent context",
    ],
    updatedAt: "2026-06-07",
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    audience: "Claude Code users who want project context to survive long work sessions",
    heroBullets: [
      "Install from the Claude Code plugin marketplace, then run /setup once.",
      "Start real sessions with /brief and capture durable context during work.",
      "End with /handoff so the next agent starts from current project state.",
    ],
    sections: [
      {
        heading: "Install once, then verify the loop",
        body: [
          "Wenlan's Claude Code path starts with the plugin marketplace: `/plugin marketplace add 7xuanlu/claude-plugins`, `/plugin install wenlan@7xuanlu`, then `/setup` after the restart Claude Code requests.",
          "`/setup` handles daemon setup, MCP wiring, local memory setup, and a first round-trip check. The goal is not to add another manual note-taking habit. The goal is to make the memory route available at the moment work happens.",
        ],
        code: {
          label: "Claude Code setup",
          code: "/plugin marketplace add 7xuanlu/claude-plugins\n/plugin install wenlan@7xuanlu\n/setup",
        },
      },
      {
        heading: "Start with /brief",
        body: [
          "`/brief [topic]` loads project status, recent handoffs, preferences, and topic-relevant memories before edits begin.",
          "That makes Claude Code less dependent on the current chat window. The agent walks into the session with the context Wenlan has already earned.",
        ],
      },
      {
        heading: "Capture decisions while they are fresh",
        body: [
          "`/capture` is for durable work knowledge: decisions, lessons, gotchas, project constraints, corrections, and preferences.",
          "A good capture includes why the fact matters. One atomic memory is easier to search, supersede, inspect, and distill than a paragraph that mixes five ideas.",
        ],
      },
      {
        heading: "Close with /handoff, then distill when needed",
        body: [
          "`/handoff` writes what changed, what remains open, and what the next agent should know. It also gives Wenlan better source material than a raw transcript.",
          "When a theme repeats across sessions, `/distill` turns related captures into source-backed wiki pages. The page record keeps source memory IDs, and pages can be refreshed as the work changes.",
        ],
        bullets: [
          "/brief: orient the agent before work.",
          "/capture: save one durable idea.",
          "/recall: look up a specific past thread.",
          "/handoff: preserve the session boundary.",
          "/distill: compose accumulated memories into wiki pages.",
        ],
        code: {
          label: "Daily loop",
          code: "/brief\n/capture <one durable project fact and why it matters>\n/recall <specific prior decision or gotcha>\n/handoff",
        },
      },
    ],
    faqs: [
      {
        question: "Do I need to use every command every session?",
        answer:
          "No. Most serious sessions need /brief and /handoff. Use /capture when something durable happens, /recall when history matters, and /distill when repeated captures deserve a page.",
      },
      {
        question: "Can the same Wenlan memory work outside Claude Code?",
        answer:
          "Yes. Claude Code gets the richest slash-command workflow, but Wenlan also exposes the same local memory through MCP for Cursor, Codex, Claude Desktop, VS Code, Gemini CLI, and other clients.",
      },
    ],
    relatedSlugs: ["claude-code-memory", "claude-code-memory-command-vs-wenlan", "how-to-add-memory-to-claude-code"],
    officialReferences: [
      {
        label: "Claude Code memory docs",
        href: "https://code.claude.com/docs/en/memory",
      },
      {
        label: "Claude Code plugin marketplace",
        href: "https://code.claude.com/docs/en/discover-plugins",
      },
      {
        label: "Wenlan plugin source",
        href: "https://github.com/7xuanlu/wenlan/tree/main/plugin",
      },
    ],
    cta: {
      heading: "Make Claude Code sessions compound",
      body: "Install Wenlan, run /setup, then use /brief and /handoff around real work.",
    },
  },
  {
    slug: "distilled-wiki-pages-ai-memory",
    eyebrow: "Concept",
    category: "Concepts",
    title: "Karpathy LLM Wiki: Build a Source-Backed AI Knowledge Base",
    description:
      "The Karpathy LLM Wiki pattern turns trusted sources into maintained AI knowledge-base pages that agents can load on demand.",
    metaTitle: "Karpathy LLM Wiki & AI Knowledge Base | Wenlan",
    metaDescription:
      "Learn the Karpathy LLM Wiki pattern, how it differs from RAG, and how source-backed pages, Obsidian, checks, and refreshes fit together.",
    keywords: [
      "LLM wiki",
      "Karpathy LLM wiki",
      "Andrej Karpathy LLM wiki",
      "AI knowledge base",
      "source-backed AI knowledge base",
      "LLM wiki for AI agents",
      "LLM wiki for AI work",
      "LLM wiki architecture",
      "LLM wiki setup",
      "LLM wiki vs RAG",
      "LLM wiki Obsidian",
      "Claude Code LLM wiki",
      "source-backed AI work wiki",
      "distilled wiki pages",
      "AI work wiki",
    ],
    publishedAt: "2026-06-24",
    updatedAt: "2026-09-05",
    author: DEFAULT_AUTHOR,
    readingTime: "12 min read",
    audience: "People designing a maintained knowledge layer for Claude Code, Codex, Cursor, and other AI agents",
    heroBullets: [
      "The Karpathy LLM Wiki pattern maintains useful answers instead of treating raw notes, retrieved chunks, or chat logs as finished knowledge.",
      "The architecture separates source material, atomic memory, maintained pages, and the index that loads only relevant context.",
      "A practical loop needs observable checks and repairs for stale links, contradictions, context bloat, and human edits.",
    ],
    sections: [
      {
        heading: "The Karpathy LLM Wiki pattern",
        body: [
          "Andrej Karpathy described an LLM Wiki pattern for turning raw knowledge into curated, interconnected pages that an AI agent can load on demand. This article uses his public note as a maintained source for the pattern; it does not imply that Karpathy endorses Wenlan.",
          "In practical terms, an LLM wiki is a maintained AI knowledge base. It turns source material and durable work context into topic pages with enough provenance and maintenance state for a person to inspect why the current answer exists.",
          "It is not simply a folder of AI-written notes. A useful LLM wiki separates raw evidence from reusable facts and maintained explanations, then gives each layer a different update rule. The result should remain useful even when the reader never installs the product used to build it.",
        ],
        bullets: [
          "Sources preserve documents, conversations, files, and other inspectable evidence.",
          "Atomic memories preserve one decision, lesson, correction, preference, or fact learned during work.",
          "Maintained pages compile the current answer and cite the support behind it.",
          "A routing index finds the relevant page without loading the entire wiki into every prompt.",
        ],
        link: {
          label: "Try the complete example without installing anything",
          href: "#worked-example",
        },
      },
      {
        heading: "The architecture behind a useful LLM wiki",
        body: [
          "The smallest dependable design has four planes: source storage, durable memory, maintained pages, and selective retrieval. Keeping them separate prevents a polished page from losing its evidence and prevents a raw event log from masquerading as the current answer.",
          "Maintenance is part of the architecture, not a later cleanup job. When support changes, the system needs to mark the affected page stale, propose or perform a refresh according to ownership, and keep the revision inspectable.",
        ],
        bullets: [
          "Ingest: register source material without rewriting it into a conclusion.",
          "Capture: keep one complete, reusable idea with scope and provenance.",
          "Distill: compose related support into a maintained topic page.",
          "Retrieve: load the smallest useful page or memory set for the current task.",
          "Refresh and review: expose stale reasons, contradictions, citations, and revisions.",
        ],
      },
      ...workedExampleSections("en"),
      {
        id: "the-five-minute-llm-wiki-protocol",
        heading: "The LLM-wiki workflow in Wenlan",
        body: [
          "Start only after Wenlan is installed and connected to the AI client. Use one harmless topic first. The protocol below exercises session startup, targeted retrieval, one durable write, a session boundary, page distillation, and human-readable output.",
          "The commands are separate on purpose: recall should not silently write, capture should not rewrite a whole page, and distillation should not overwrite human-owned content without a review path.",
        ],
        code: {
          label: "Wenlan workflow — requires an installed, connected client",
          code: `/brief <topic>
/recall <question>
/capture <decision + why>
/handoff
/distill <topic>
/pages <topic>`,
        },
        link: {
          label: "Use the complete daily workflow",
          href: "/docs/daily-workflow",
        },
      },
      {
        heading: "A minimum LLM-wiki starter schema",
        body: [
          "Keep the always-loaded contract small. A CLAUDE.md or AGENTS.md should describe what the wiki is for, what never changes silently, and which procedures the agent should load on demand. It should not contain the whole wiki or a long copy of every maintenance instruction.",
          "This is a vendor-neutral information and maintenance contract, not a required folder layout or product database. Adapt the names to your tools while keeping every boundary observable.",
        ],
        bullets: [
          "Purpose and scope: which decisions or questions belong in this wiki, and which do not.",
          "Immutable source boundary: where raw evidence lives and which files automation must never rewrite.",
          "Page ownership: which pages are machine-maintained, human-owned, or changed only through review.",
          "Naming and linking rules: stable topics, aliases, page links, and the smallest routing index.",
          "Citation requirement: important claims point back to an inspectable source.",
          "Ingest, query, lint, and maintenance log: separate on-demand procedures plus an append-only record of changes.",
          "Stale and review behavior: what happens when a source changes, support conflicts, or a person owns the prose.",
        ],
        code: {
          label: "Compact client contract",
          code: [
            "# LLM Wiki",
            "Purpose: <the repeated decisions this wiki maintains>",
            "Sources: <immutable evidence locations>",
            "Pages: <ownership, naming, links, citations>",
            "Index: <small topic router; load pages on demand>",
            "Procedures: ingest | query | lint | review",
            "Log: <append-only maintenance record>",
            "Stale rule: <source change -> stale or review>",
          ].join("\n"),
        },
      },
      {
        heading: "A small acceptance test before real use",
        body: [
          "A template is not proven when the files merely exist. Test one harmless topic end to end, including a source change, before importing private or business-critical material.",
          "This test works for a folder-and-prompts setup, an Obsidian workflow, or a dedicated LLM-wiki product. The expected result is evidence you can inspect, not just a fluent answer.",
        ],
        bullets: [
          "Ingest one harmless source and confirm the original remains unchanged.",
          "Answer one question and cite the source for the important claim.",
          "Run lint and confirm missing citations, broken links, or duplicates are visible.",
          "Change the source, then repeat the same question.",
          "Confirm the old answer becomes stale or reviewable instead of being silently overwritten.",
        ],
      },
      {
        heading: "How to verify the loop",
        body: [
          "Do not stop at a successful command. Verify the artifacts and the next retrieval. A trustworthy setup proves that the agent can recover the intended context later and that a person can inspect the maintained result outside the chat.",
          "If any check fails, keep the test capture harmless, diagnose the connection or source boundary, and repeat the same topic before adding real project knowledge.",
        ],
        bullets: [
          "The capture returns or exposes a durable record you can find again with the same topic.",
          "The handoff records what changed and what the next session should do.",
          "The page opens as readable Markdown and shows source IDs or citations for important claims.",
          "A later recall or brief loads the relevant page or memory without pasting the full archive.",
          "A changed source produces an inspectable stale reason, refresh, or reviewable revision instead of a silent overwrite.",
        ],
        link: {
          label: "Review the trust and repair workflow",
          href: "/docs/review-and-trust",
        },
      },
      {
        heading: "Example: from source to maintained answer",
        body: [
          "Suppose a release document establishes which platforms are actually supported. The source document remains inspectable, an atomic memory preserves the release decision and why it matters, and a maintained page compiles the current install answer. When the release document changes, the page should become stale or receive a reviewable revision.",
          "This evidence trail is more useful than a detached summary because each layer has a clear owner and failure mode.",
        ],
        code: {
          label: "Expected evidence trail",
          code: `source document
  -> atomic memory: decision + why + source_id
  -> maintained page: current answer + citations

source changes
  -> stale reason or reviewable revision
  -> refreshed page`,
        },
      },
      {
        heading: "Failure modes and repairs",
        body: [
          "The hard part is not generating the first page. It is keeping the wiki small enough to retrieve, current enough to trust, and explicit enough that people can repair it.",
          "These failure modes repeat across real LLM-wiki, Obsidian, Claude Code, and agent-memory workflows:",
        ],
        bullets: [
          "Context bloat or index truncation: keep the routing index short and load topic pages on demand instead of injecting the full vault.",
          "Stale links and contradictions: retain provenance, mark affected pages stale, and review replacements rather than stacking another answer beside the old one.",
          "Human-authored pages overwritten by automation: keep machine refreshes reviewable when a person owns the prose.",
          "Token-heavy full-vault loading: retrieve the smallest relevant pages, memories, and source excerpts for the current question.",
          "Cross-session blank starts: pair a compact brief with a handoff instead of depending on the previous chat window.",
        ],
      },
      {
        heading: "LLM wiki vs RAG, Obsidian, and agent memory",
        body: [
          "These tools can work together, but they do not own the same layer. The useful question is not which label wins; it is where evidence, current answers, human writing, and cross-session context should live.",
        ],
        bullets: [
          "RAG retrieves source chunks for a question. An LLM wiki maintains a reusable answer, its support, and its refresh state.",
          "Obsidian is a human-owned vault and writing surface. It can host or inspect wiki pages, but vault access alone does not define agent-memory policy or page maintenance.",
          "Agent memory preserves reusable context from work. An LLM wiki composes selected memories and sources into a maintained explanation.",
          "A plain folder plus prompts can be enough for a small, stable corpus. Add a daemon or MCP layer when several agents need the same retrieval, handoff, provenance, and review rules.",
        ],
      },
      {
        heading: "What an LLM wiki does not replace",
        body: [
          "An LLM wiki does not replace codebase search, repository maps, current source code, test output, or the native documentation for a tool. Those surfaces remain authoritative for what the software does now.",
          "It is also unnecessary for one-off chats or a small set of stable documents that people already maintain well. Use the wiki when repeated work needs a current, inspectable answer across sessions or tools.",
        ],
        link: {
          label: "See how Wenlan separates the layers",
          href: "/docs/architecture",
        },
      },
      {
        heading: "How Wenlan maps the architecture",
        body: [
          "Wenlan implements the pattern with three durable roles: Sources preserve inspectable material, Memories preserve atomic knowledge from work, and Pages compile maintained explanations. The local daemon owns retrieval while readable Markdown keeps pages and session artifacts visible.",
          "The page lifecycle is explicit: distill support, cite it, track dependencies, refresh when needed, and review ownership-sensitive changes. That is the difference between a generated note and a maintained LLM wiki.",
          "Wenlan does not require a user-authored Page schema. Typed Memory fields and built-in Page rules already govern provenance, citations, refresh, ownership, and review; the starter schema above remains a portable evaluation contract for the client and workflow.",
        ],
        link: {
          label: "Inspect the source-backed page model",
          href: "/learn/source-backed-wiki-pages-ai-work",
        },
      },
    ],
    faqs: [
      {
        question: "What is the Karpathy LLM Wiki idea?",
        answer:
          "Andrej Karpathy described a personal LLM wiki made of curated, interconnected pages that an agent can retrieve as needed. The durable idea is to maintain useful pages and their structure instead of repeatedly loading an undifferentiated archive. Citing his note does not imply an endorsement of Wenlan.",
      },
      {
        question: "What is an LLM wiki?",
        answer:
          "An LLM wiki is a maintained knowledge layer that turns inspectable sources and durable work context into topic pages AI agents can load on demand. Useful implementations retain provenance, stale state, and a human review path.",
      },
      {
        question: "Is an LLM wiki the same as RAG?",
        answer:
          "No. RAG retrieves source chunks for a question. An LLM wiki maintains a reusable explanation with citations and refresh state. A wiki can use RAG underneath, but retrieval alone does not maintain the answer.",
      },
      {
        question: "Can Obsidian be an LLM wiki?",
        answer:
          "Obsidian can be the human-owned vault and readable page surface. To behave as an agent LLM wiki, the workflow still needs selective retrieval, provenance, maintenance rules, stale handling, and a safe boundary for automated edits.",
      },
      {
        question: "Should an LLM wiki replace repository search?",
        answer:
          "No. Use current source code, repository search, tests, and tool documentation to verify software behavior. Use the LLM wiki for maintained explanations, decisions, lessons, provenance, and cross-session context.",
      },
    ],
    relatedSlugs: [
      "source-backed-wiki-pages-ai-work",
      "verify-ai-knowledge-base-citations",
      "build-course-wiki-from-lecture-notes",
      "ai-work-memory-vs-knowledge-base",
      "wenlan-vs-obsidian-ai-memory",
      "ai-memory-provenance",
      "local-git-history-ai-memory",
    ],
    officialReferences: [
      {
        label: "Wenlan Source, Memory, and Page model",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan daily workflow",
        href: "https://github.com/7xuanlu/wenlan#daily-workflow",
      },
      {
        label: "Karpathy's LLM-wiki note",
        href: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f",
      },
      {
        label: "jackwener LLM-wiki implementation",
        href: "https://github.com/jackwener/llm-wiki",
      },
      {
        label: "Hjarni's CLAUDE.md template",
        href: "https://hjarni.com/blog/llm-wiki-claude-md-template",
      },
      {
        label: "Rohitg00's LLM Wiki v2 proposal",
        href: "https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2",
      },
    ],
    cta: {
      heading: "Turn memory into an LLM wiki",
      body: "Wenlan distills repeated captures into source-backed wiki pages your next AI session can actually use.",
    },
  },
  {
    slug: "ai-work-memory-vs-knowledge-base",
    eyebrow: "Comparison",
    category: "Comparisons",
    title: "AI Work Memory vs Knowledge Base: What’s the Difference?",
    description:
      "A knowledge base maintains what is currently known. AI work memory preserves the decisions, lessons, corrections, and handoffs that agents need while working.",
    metaTitle: "AI Work Memory vs Knowledge Base: The Difference",
    metaDescription:
      "Compare AI work memory and AI knowledge bases: what each stores, when agents use it, and why durable AI work needs both atomic memory and maintained pages.",
    keywords: [
      "AI work memory vs knowledge base",
      "AI knowledge base",
      "AI work context",
      "agent memory workflow",
      "AI memory system",
    ],
    publishedAt: "2026-05-27",
    updatedAt: "2026-07-24",
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    audience: "People designing durable context for AI agents and knowledge work",
    heroBullets: [
      "A knowledge base maintains current explanations, reference material, and source-backed pages.",
      "AI work memory preserves atomic decisions, lessons, corrections, preferences, and handoffs from real work.",
      "Agents often need both: memory carries the work forward, while pages compile the current answer.",
    ],
    sections: [
      {
        heading: "Short answer",
        body: [
          "AI work memory and an AI knowledge base solve different parts of the same problem. Memory preserves what happened during work: a decision, lesson, correction, preference, or handoff. A knowledge base turns current evidence into maintained explanations that people and agents can reuse.",
          "Choose memory when agents keep starting cold. Choose a knowledge base when the current answer is scattered across notes and documents. For durable AI work, the useful design is usually both with a clear boundary between them.",
        ],
      },
      {
        heading: "What each layer should own",
        body: [
          "A source should preserve material you can inspect: a document, imported conversation, or registered file. A memory should preserve one complete thing learned from work. A page should compile the current understanding from relevant sources and memories.",
          "Keeping those roles distinct prevents two common failures: treating every chat transcript as knowledge, or rewriting a polished page every time one small fact changes.",
        ],
        link: {
          label: "See Wenlan's source-backed page model",
          href: "/docs/source-backed-pages",
        },
      },
      {
        heading: "When a knowledge base is enough",
        body: [
          "Use a conventional knowledge base when the main job is authoring durable documents, organizing reference material, and browsing a corpus. Product docs, research notes, meeting records, policies, and stable project explanations fit this shape.",
          "It can still be AI-enabled. Search, chat, and MCP access do not by themselves turn a document collection into work memory. The deciding question is whether the system captures what agents learn between sessions and can return it during later work.",
        ],
      },
      {
        heading: "When AI work memory is the missing layer",
        body: [
          "Use AI work memory when the recurring failure is session loss. An agent fixed a bug yesterday, learned a project constraint in another tool, or received a correction last week, but the next session starts without that context.",
          "The useful unit is often smaller than a document: one decision and why it was made, one gotcha, one preference, or one explicit replacement for a stale fact. Those memories need provenance and retrieval cues so an agent can use them without loading the full history.",
        ],
        link: {
          label: "See the AI work memory model",
          href: "/learn/ai-work-memory",
        },
      },
      {
        heading: "How memory becomes a maintained answer",
        body: [
          "A practical loop starts by recalling relevant knowledge, captures new decisions or lessons while work is happening, and closes with a handoff. Repeated or related material can then be distilled into a maintained page.",
          "That page is not a raw memory dump. It should state the current answer, cite its support, and be refreshable when a source changes or a later memory supersedes an earlier conclusion.",
        ],
        bullets: [
          "Recall the smallest relevant context at the start of work.",
          "Capture one durable decision, lesson, correction, preference, or fact at a time.",
          "Write a handoff that records what changed and what remains open.",
          "Distill related sources and memories into a page that can be reviewed and refreshed.",
        ],
        link: {
          label: "See the complete LLM-wiki workflow",
          href: "/learn/distilled-wiki-pages-ai-memory",
        },
      },
      {
        heading: "How Wenlan combines the two",
        body: [
          "Wenlan uses one knowledge system with three roles: traceable sources, atomic memories from AI work, and maintained source-backed pages. Memories preserve how knowledge changed; pages compile what is currently supported.",
          "Retrieval uses a local index for exact terms, semantic similarity, and graph context. Durable synthesis remains readable Markdown under ~/.wenlan, with citations, revisions, and local git history available for inspection.",
          "This does not mean every team needs another note editor. Wenlan can read existing document sources and coexist with Obsidian. Its job is to keep the agent work loop and the maintained knowledge layer connected without hiding either one.",
        ],
      },
    ],
    comparisonTable: {
      competitorName: "Knowledge base",
      rows: [
        {
          dimension: "Unit of knowledge",
          wenlan: "Atomic memory: one decision, lesson, correction, preference, fact, or handoff.",
          competitor: "Document, note, page, record, or collection.",
        },
        {
          dimension: "Primary trigger",
          wenlan: "An agent learns something during work or needs context in a later session.",
          competitor: "A person or process authors, imports, or updates reference material.",
        },
        {
          dimension: "Main job",
          wenlan: "Carry useful context across sessions, tools, projects, and time.",
          competitor: "Maintain and browse the current body of knowledge.",
        },
        {
          dimension: "Change history",
          wenlan: "Provenance, corrections, and explicit supersession preserve how a conclusion changed.",
          competitor: "Document revisions preserve how the maintained answer changed.",
        },
        {
          dimension: "Best combined pattern",
          wenlan: "Feed durable work lessons into source-backed pages.",
          competitor: "Give agents a maintained answer backed by inspectable sources and memories.",
        },
      ],
    },
    faqs: [
      {
        question: "Is Wenlan a knowledge base?",
        answer:
          "Yes, but not only a document store. Wenlan combines traceable sources, atomic AI work memories, and maintained source-backed pages. The memory layer captures what work teaches; the page layer compiles the current answer.",
      },
      {
        question: "Does AI work memory replace a knowledge base?",
        answer:
          "No. Memory is good at preserving decisions, lessons, corrections, and handoffs. A knowledge base is good at maintaining explanations and reference material. The two layers work better when each has a clear role.",
      },
      {
        question: "Can Wenlan work with Obsidian or an existing knowledge base?",
        answer:
          "Yes. Wenlan can read document sources, index an Obsidian vault, and project maintained pages as Markdown under ~/.wenlan. You can keep your existing knowledge base while using Wenlan for cross-session agent memory and source-backed synthesis.",
      },
    ],
    relatedSlugs: ["ai-work-memory", "distilled-wiki-pages-ai-memory", "wenlan-vs-obsidian-ai-memory"],
    officialReferences: [
      {
        label: "Wenlan source, memory, and page model",
        href: "https://github.com/7xuanlu/wenlan#what-is-this",
      },
      {
        label: "Wenlan daily workflow",
        href: "https://github.com/7xuanlu/wenlan#daily-workflow",
      },
      {
        label: "Karpathy's LLM Wiki foundation",
        href: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f",
      },
    ],
    cta: {
      heading: "Connect memory to maintained knowledge",
      body: "Wenlan carries decisions and lessons across agent sessions, then turns supported context into source-backed pages you can inspect.",
    },
  },
  {
    slug: "wenlan-vs-basic-memory",
    eyebrow: "Comparison",
    category: "Comparisons",
    title: "Wenlan vs Basic Memory: Source-Backed AI Work vs Shared Markdown Knowledge",
    description:
      "Compare Wenlan and Basic Memory across Markdown, MCP, local-first control, workflow fit, and how each product helps AI tools use durable context.",
    metaTitle: "Wenlan vs Basic Memory | AI Memory Comparison",
    metaDescription:
      "Compare Wenlan and Basic Memory for local AI work memory, Markdown knowledge bases, MCP workflows, human control, and long-running AI sessions.",
    keywords: [
      "Wenlan vs Basic Memory",
      "Basic Memory alternative",
      "AI memory markdown",
      "MCP memory knowledge base",
      "local AI work memory",
    ],
    publishedAt: "2026-05-14",
    updatedAt: "2026-07-25",
    author: DEFAULT_AUTHOR,
    readingTime: "8 min read",
    audience: "People choosing a memory layer for AI-assisted work",
    heroBullets: [
      "Basic Memory v0.22.1 is a human-readable Markdown knowledge base with local or hosted deployment paths, one knowledge base across MCP clients, and optional Team workspaces.",
      "Wenlan v0.14.1 is a local-first Sources, Memories, and Pages system built around capture, handoff, curation, source-backed Pages, and reviewable distillation.",
      "Choose between a shared Markdown knowledge base and a source-backed AI-work workflow—not between “memory” and “no memory.”",
      "This page pins Basic Memory's source, release, and documentation on 2026-07-25 and reflects Wenlan v0.14.1 as of 2026-07-20. If either product changes, the source links below make the comparison auditable.",
    ],
    officialReferences: [
      {
        label: "Basic Memory v0.22.1 release",
        href: "https://github.com/basicmachines-co/basic-memory/releases/tag/v0.22.1",
      },
      {
        label: "Basic Memory source snapshot",
        href: "https://github.com/basicmachines-co/basic-memory/tree/5d444f0974476645f904c1446998c0a938a6e7f7",
      },
      {
        label: "Basic Memory documentation snapshot",
        href: "https://github.com/basicmachines-co/docs.basicmemory.com/tree/1c670035987b21f0a93d4e45ea1eed1487775f74",
      },
      {
        label: "What is Basic Memory?",
        href: "https://docs.basicmemory.com/start-here/what-is-basic-memory",
      },
      {
        label: "Basic Memory technical information",
        href: "https://docs.basicmemory.com/reference/technical-information",
      },
      {
        label: "Basic Memory Cloud guide",
        href: "https://docs.basicmemory.com/cloud/cloud-guide",
      },
      {
        label: "Basic Memory Teams",
        href: "https://docs.basicmemory.com/teams/about",
      },
      {
        label: "Basic Memory AI assistant guide",
        href: "https://docs.basicmemory.com/reference/ai-assistant-guide",
      },
      {
        label: "Wenlan v0.14.1 source and documentation",
        href: "https://github.com/7xuanlu/wenlan/tree/v0.14.1",
      },
    ],
    sections: [
      {
        heading: "Short answer",
        body: [
          "Choose Basic Memory if you want people and AI assistants to work in the same Markdown knowledge base. You can keep it local, add Basic Memory Cloud for hosted access and sync, or use Team workspaces for shared knowledge.",
          "Choose Wenlan if the harder problem is turning AI work into maintained knowledge: capture decisions across sessions, hand work off between agents, and distill supported context into source-backed Pages that remain reviewable.",
          "Both expose context through MCP, keep important material human-readable, and support semantic search. The meaningful difference is the operating model around that context.",
        ],
      },
      {
        heading: "Basic Memory today: local, Cloud, and Teams",
        body: [
          "Basic Memory's open-source path stores human-readable Markdown files and builds a secondary index for search and graph operations. Its MCP server lets supported AI clients read and write that knowledge base, while the files remain usable in editors such as Obsidian or VS Code.",
          "Basic Memory Cloud is the hosted path. It adds remote MCP access, a web editor, optional local sync, snapshots, and file history. Team workspaces add shared projects, membership, collaborative editing, activity, and per-file history.",
          "Current Basic Memory also provides semantic search, graph traversal, `build_context`, and Agent Skills that teach assistants to search before answering, capture durable knowledge, link related notes, and maintain the knowledge base. It is no longer accurate to describe the product as only a local vault or as having no work-loop guidance.",
        ],
      },
      {
        heading: "Wenlan today: Sources, Memories, and Pages",
        body: [
          "Wenlan starts from the work an AI agent is doing. Agents explicitly capture decisions, lessons, and corrections as Memories; `/handoff` preserves the state of an unfinished session; `/distill` turns repeated, supported context into Pages; `/curate` and `/lint` make review and repair visible.",
          "Sources are the evidence layer. Memories retain durable working context. Pages synthesize that context into readable knowledge with source IDs, citations, and revision history. The distinction is deliberate: recalled fragments and maintained wiki pages do not silently become the same thing.",
          "The local daemon provides retrieval across MCP clients. Readable Pages, sessions, and status artifacts are projected under `~/.wenlan/` with local git history, while capture and retrieval remain backed by the daemon-owned store.",
        ],
      },
      {
        heading: "The decision in one workflow",
        body: [
          "Imagine that three coding agents investigate the same authentication problem over a week. With Basic Memory, the durable object is the shared knowledge base: agents search existing notes, add observations, link related entities, and update a Markdown document that the team can also edit.",
          "With Wenlan, the durable path is evidence to maintained knowledge: each agent captures the decisions or gotchas it learned, hands off unfinished state, and later distills supported memories into a Page whose source chain can be inspected and revised.",
          "Basic Memory is the more direct fit when the shared note is the product. Wenlan is the more direct fit when you need to see how session evidence became a maintained answer.",
        ],
      },
      {
        heading: "Storage, sync, and history are separate choices",
        body: [
          "For local Basic Memory, Markdown files are the primary human-readable record and a database acts as a derived search index. File history depends on the local tools you choose. Basic Memory Cloud adds managed sync, snapshots, and hosted per-file history; Teams extends that hosted model to collaborators.",
          "Wenlan keeps raw captures in its local daemon store for recall and projects readable Pages, sessions, and status Markdown under `~/.wenlan/`. Those projected artifacts are versioned locally in `~/.wenlan/.git/`, so Page revisions can be inspected without turning the projection into the retrieval database.",
          "Neither shape is automatically better. Basic Memory favors a file-first knowledge base that can gain hosted collaboration. Wenlan favors a local retrieval store plus human-readable, source-linked outputs.",
        ],
        bullets: [
          "Basic Memory local: Markdown files plus a derived search index.",
          "Basic Memory Cloud and Teams: hosted MCP, sync, snapshots, file history, and collaboration.",
          "Wenlan: local retrieval store plus Markdown projections with source links and local git history.",
        ],
      },
      {
        heading: "Search and maintenance",
        body: [
          "Basic Memory combines text and semantic search with graph traversal over observations and relations. Its `build_context` tool assembles connected knowledge, and its Agent Skills give assistants an explicit search, capture, and maintenance routine.",
          "Wenlan combines full-text and embedding retrieval, weighted fusion, eligible graph context, and optional reranking. Its plugin workflow separates `/recall`, `/capture`, `/handoff`, `/distill`, `/curate`, and `/lint`, so retrieval, capture, synthesis, review, and repair remain distinct actions.",
          "The products publish different retrieval evidence, so this page does not turn unmatched benchmarks into a winner. Test each system with the same real task: recover an old decision, update it after a correction, and inspect why the final answer should be trusted.",
        ],
      },
      {
        heading: "The provenance boundary",
        body: [
          "Basic Memory makes notes and their relationships inspectable. A team can read the Markdown, follow links, inspect Cloud history, and decide what belongs in its shared knowledge base.",
          "Wenlan adds a stricter boundary between working memory and a distilled Page. A Page record carries source memory IDs, citations, provenance state, and revisions, and the daemon rejects a Page with no source. That is useful when the question is not only “what does the note say?” but “which captured evidence supports this maintained claim?”",
          "Basic Memory can still hold source citations, and Wenlan Pages remain editable and reviewable. The difference is which provenance behavior the system requires rather than what a careful author could add manually.",
        ],
      },
      {
        heading: "When Basic Memory is the better call",
        body: [
          "Choose Basic Memory when you already think in Markdown notes, want AI assistants to share that knowledge base, or need a hosted web and Team path without building your own sync layer.",
          "It is also the clearer fit when people and agents should directly co-edit the same durable notes and the knowledge base—not session provenance—is the primary unit of work.",
        ],
      },
      {
        heading: "When Wenlan is the better call",
        body: [
          "Choose Wenlan when context is scattered across AI sessions and tools, and you want explicit capture and handoff before that context is promoted into maintained knowledge.",
          "It is the clearer fit when source-backed distillation, reviewable revisions, local operation, and a visible repair loop matter more than hosted team collaboration.",
        ],
      },
      {
        heading: "Migration shape, if you decide to switch",
        body: [
          "Moving from Basic Memory to Wenlan is selective today. Choose the durable notes that should become Sources or Memories, capture them through the CLI or MCP workflow, and distill only the claims whose source chain you want Wenlan to maintain. Wenlan does not currently advertise a one-command Basic Memory vault importer.",
          "Moving Wenlan's readable output into another knowledge base is straightforward at the file level: Pages and sessions under `~/.wenlan/` are Markdown. That preserves readable content, but not Wenlan's live recall, provenance state, curation, or distillation behavior.",
          "Using both is technically possible because each exposes an MCP server. If you do, assign ownership clearly—for example, Basic Memory for shared team notes and Wenlan for source-backed personal AI-work history—so agents do not create conflicting copies.",
        ],
      },
    ],
    comparisonTable: {
      competitorName: "Basic Memory",
      rows: [
        {
          dimension: "Center of gravity",
          wenlan: "Source-backed AI-work loop: capture, recall, handoff, distill, curate, and lint across MCP clients.",
          competitor:
            "Human-readable Markdown knowledge base that people and AI assistants read, edit, link, and maintain.",
        },
        {
          dimension: "Deployment",
          wenlan: "Local-first daemon, CLI, MCP server, plugins, and readable local artifacts.",
          competitor:
            "Open-source local server or hosted Basic Memory Cloud with remote MCP and optional local sync.",
        },
        {
          dimension: "Collaboration",
          wenlan: "Personal local knowledge workflow in v0.14.1; no hosted team workspace is claimed.",
          competitor:
            "Team workspaces with membership, collaborative editing, activity, snapshots, and file history.",
        },
        {
          dimension: "Storage",
          wenlan: "Local daemon-owned retrieval store plus Markdown projections in ~/.wenlan/; readable artifacts are tracked in local git.",
          competitor:
            "File-first Markdown with a derived local index; Cloud adds hosted storage, sync, snapshots, and history.",
        },
        {
          dimension: "Retrieval",
          wenlan: "Full-text and embedding retrieval, weighted fusion, eligible graph context, and optional reranking.",
          competitor:
            "Text and semantic search, graph traversal, and build_context over notes, observations, and relations.",
        },
        {
          dimension: "Maintenance workflow",
          wenlan: "Separate capture, handoff, distill, curate, and lint actions keep working memory, synthesis, review, and repair visible.",
          competitor:
            "Agent Skills teach search-before-answer, capture, linking, and knowledge-base maintenance.",
        },
        {
          dimension: "Provenance and history",
          wenlan: "Distilled Pages require source memory IDs and retain citations, provenance state, revisions, and local git history for readable artifacts.",
          competitor:
            "Readable notes and links; local history uses the user's tools, while Cloud provides snapshots and per-file history.",
        },
        {
          dimension: "License",
          wenlan: "Apache-2.0 daemon, CLI, MCP server.",
          competitor:
            "AGPL-3.0 open-source server and client; Cloud and Teams are hosted product paths.",
        },
      ],
    },
    faqs: [
      {
        question: "Is Basic Memory a competitor to Wenlan?",
        answer:
          "They overlap around MCP, AI-readable memory, Markdown, search, and durable context. Basic Memory centers a knowledge base that people and agents maintain together. Wenlan centers a source-backed workflow from session memory to reviewable Pages.",
      },
      {
        question: "Can someone use both?",
        answer:
          "Yes. Each can register as a separate MCP server. Define ownership first—for example, Basic Memory for shared team notes and Wenlan for source-backed personal AI-work history—so an agent does not maintain conflicting copies.",
      },
      {
        question: "Is Basic Memory local or hosted?",
        answer:
          "Both paths exist. The open-source server works with local Markdown files and a derived index. Basic Memory Cloud adds hosted MCP access, web editing, optional local sync, snapshots, and history. Team workspaces add shared collaboration.",
      },
      {
        question: "What is the main provenance difference?",
        answer:
          "Basic Memory makes the note, its links, and—on Cloud—its file history inspectable. Wenlan additionally requires a distilled Page record to name source memory IDs, retaining citations, provenance state, and revisions between captured evidence and the maintained Page.",
      },
      {
        question: "How fresh is this comparison?",
        answer:
          "The Basic Memory side is pinned to v0.22.1, source commit 5d444f0, and documentation commit 1c67003, checked on 2026-07-25. The Wenlan side is pinned to v0.14.1, released on 2026-07-20. The maintained source links above are the authority if either product changes.",
      },
    ],
    relatedSlugs: [
      "wenlan-vs-claude-mem",
      "wenlan-vs-superlocal-memory",
      "markdown-local-index-ai-memory",
      "ai-work-memory",
      "mcp-memory-server",
      "local-first-ai-memory",
    ],
    cta: {
      heading: "Try the AI work memory loop",
      body: "Wenlan is built for sessions, handoffs, provenance, and local retrieval across MCP-compatible AI tools.",
    },
  },
  {
    slug: "wenlan-vs-claude-mem",
    eyebrow: "Comparison",
    category: "Comparisons",
    title: "Wenlan vs claude-mem: Explicit vs Automatic Agent Memory",
    description:
      "Compare Wenlan and claude-mem for automatic session capture, explicit source-backed memory, progressive retrieval, cross-agent support, and local control.",
    metaTitle: "Wenlan vs claude-mem: Explicit vs Automatic AI Memory",
    metaDescription:
      "Compare Wenlan and claude-mem for automatic session capture, explicit source-backed memory, progressive retrieval, cross-agent workflows, and local control.",
    keywords: [
      "Wenlan vs claude-mem",
      "claude-mem alternative",
      "automatic AI memory",
      "Claude Code memory",
      "AI agent memory",
    ],
    updatedAt: "2026-07-24",
    author: DEFAULT_AUTHOR,
    readingTime: "7 min read",
    audience: "AI coding-agent users choosing an automatic or explicit memory workflow",
    heroBullets: [
      "claude-mem automatically captures agent sessions, compresses observations, and injects relevant history later.",
      "Wenlan defaults to explicit source-backed capture, handoffs, review, and maintained wiki pages.",
      "Both support Claude Code, Codex, and cross-agent retrieval; the real difference is how knowledge enters and stays inspectable.",
      "This page checks claude-mem v13.12.4 and commit 132b4634 against Wenlan v0.14.1 and commit 93451bf0.",
    ],
    officialReferences: [
      {
        label: "claude-mem official website",
        href: "https://claude-mem.ai/",
      },
      {
        label: "claude-mem v13.12.4 release",
        href: "https://github.com/thedotmack/claude-mem/releases/tag/v13.12.4",
      },
      {
        label: "claude-mem architecture at the reviewed commit",
        href: "https://github.com/thedotmack/claude-mem/blob/132b46343e60ecf4057c427736c57b08f7615dfe/docs/public/architecture/overview.mdx",
      },
      {
        label: "claude-mem installation guide at the reviewed commit",
        href: "https://github.com/thedotmack/claude-mem/blob/132b46343e60ecf4057c427736c57b08f7615dfe/docs/public/installation.mdx",
      },
      {
        label: "claude-mem search workflow at the reviewed commit",
        href: "https://github.com/thedotmack/claude-mem/blob/132b46343e60ecf4057c427736c57b08f7615dfe/docs/public/usage/search-tools.mdx",
      },
      {
        label: "claude-mem Codex hooks at the reviewed commit",
        href: "https://github.com/thedotmack/claude-mem/blob/132b46343e60ecf4057c427736c57b08f7615dfe/plugin/hooks/codex-hooks.json",
      },
      {
        label: "Wenlan workflow at the reviewed commit",
        href: "https://github.com/7xuanlu/wenlan/blob/93451bf0ef58399e08400e3b4ac613942adcfec8/README.md",
      },
    ],
    sections: [
      {
        heading: "Short answer",
        body: [
          "Choose claude-mem when you want agent sessions observed automatically, compressed into searchable history, and surfaced through a progressive disclosure flow with little capture-time effort.",
          "Choose Wenlan when you want durable facts, decisions, handoffs, and pages to be explicit, source-backed, reviewable, and readable outside the agent that captured them.",
          "Do not choose between them on the old assumption that only Wenlan works across agents. Current claude-mem source includes Codex hooks and other integrations; current Wenlan uses one local daemon plus MCP and native plugin paths. The useful decision is automatic session history versus deliberately maintained work knowledge.",
        ],
      },
      {
        heading: "What current claude-mem emphasizes",
        body: [
          "claude-mem v13.12.4 is an automatic memory-compression system. Hooks capture prompts and tool activity, a local worker processes observations, and later sessions receive compact context or fetch more through search, timeline, and observation-detail steps.",
          "The maintained source uses SQLite with FTS5, optional Chroma semantic search, a worker UI, citations by observation ID, and progressive disclosure so an agent can inspect an index before loading full history.",
          "Its roots remain in Claude Code, but its current repository also includes Codex hooks, adapters, and integrations for other agents. It is no longer accurate to describe claude-mem as a single-tool store.",
        ],
      },
      {
        heading: "What Wenlan emphasizes",
        body: [
          "Wenlan treats memory as maintained work knowledge. `/capture` records one durable fact, decision, correction, preference, or lesson with provenance; `/handoff` records what changed and what comes next; `/distill` deliberately creates or refreshes source-backed pages.",
          "Recall and storage run through one local daemon. Claude Code and Codex have plugin paths, while Cursor, Claude Desktop, Gemini CLI, VS Code, and other clients can reach the same knowledge through MCP.",
          "The default workflow is explicit, but not frozen in manual mode: optional model-backed passes can enrich captures, connect entities, and propose page revisions. `/brief`, `/curate`, and read-only `/lint` keep those proposals and knowledge-health findings inspectable.",
        ],
      },
      {
        heading: "How to decide",
        body: [
          "Start with the capture contract, not the client list. If missing a useful event is the main risk, automatic observation is attractive. If preserving only deliberate, attributable knowledge is the main risk, explicit capture and review are easier to audit.",
          "Then inspect the artifact you want to own. claude-mem centers a searchable session timeline and compressed observations. Wenlan centers atomic memories plus maintained Markdown pages, citations, revisions, and local git history.",
        ],
        bullets: [
          "Choose claude-mem for automatic session observation and low capture-time friction.",
          "Choose Wenlan for explicit durable knowledge, human review, and maintained pages.",
          "Test both with your real correction, retrieval, and handoff workflow before migrating history.",
        ],
      },
      {
        heading: "Automatic capture changes where the work happens",
        body: [
          "Automatic capture moves effort away from the moment of work. claude-mem records activity and uses an AI processor to compress it, so users do not have to label every useful event in real time.",
          "The later responsibility is retrieval and trust: decide which extracted observation is current, which is merely historical, and how much detail to load. claude-mem exposes observation IDs, citations, search filters, timeline context, and privacy tags to support that review.",
          "Wenlan front-loads more intent. A user or agent chooses what deserves `/capture`, records a focused `/handoff`, and uses `/distill` only when repeated evidence deserves a maintained page. Proposed revisions and conflicts can then be accepted or dismissed rather than silently replacing the source-backed layer.",
        ],
      },
      {
        heading: "What happens at session end",
        body: [
          "claude-mem's hooks generate observations and session summaries automatically. Future sessions receive a compact index and can progressively fetch a timeline or full observation details.",
          "Wenlan's `/handoff` asks for a concise record of what changed, what is blocked, and what comes next. The next session can combine that status with relevant atomic memories and maintained pages.",
          "Both reduce repeated setup. claude-mem preserves a compressed history of what the agent observed; Wenlan preserves the durable knowledge and handoff state that a user or agent chose to keep.",
        ],
        bullets: [
          "claude-mem: hook-driven observations, summaries, and progressive history retrieval.",
          "Wenlan: explicit `/capture`, `/handoff`, deliberate `/distill`, and optional reviewed enrichment.",
          "Both keep local stores and expose identifiers that let a reader trace retrieved context.",
        ],
      },
      {
        heading: "Cross-agent support is no longer the dividing line",
        body: [
          "Current claude-mem source includes Codex hooks and adapters. Its pinned installation guide lists Claude Code, Cursor, Windsurf, OpenCode, Codex CLI, Antigravity CLI, and OpenClaw as supported IDEs. The exact capture depth depends on each integration, so inspect the maintained setup path for the client you use.",
          "Wenlan exposes one local source of truth through Claude Code and Codex plugins plus MCP connectors for other clients. Its cross-client promise is shared access to the same atomic memories and pages, not automatic observation of every client by default.",
          "For a mixed-agent workflow, compare what each client can write, what it can only read, and how failures degrade. A logo list is not enough.",
        ],
      },
      {
        heading: "When claude-mem is the better call",
        body: [
          "Choose claude-mem when automatic observation is the feature, not a compromise: you want session history captured with little interruption, summarized by an AI processor, browsable in a viewer, and retrieved in layers.",
          "Choose Wenlan when the durable unit should be an explicit fact, decision, correction, handoff, or maintained page with review and provenance. It is also the clearer fit when readable Markdown and local git history are part of the ownership contract.",
          "Both projects use Apache-2.0 for the compared open-source core. Wenlan's optional desktop app is maintained separately under AGPL-3.0. Licensing therefore is not the useful differentiator; capture and artifact models are.",
        ],
      },
    ],
    comparisonTable: {
      competitorName: "claude-mem",
      rows: [
        {
          dimension: "Center of gravity",
          wenlan: "Explicit, source-backed work knowledge: atomic memories, handoffs, reviewed revisions, and maintained pages.",
          competitor:
            "Automatic session observation, AI compression, searchable history, and progressive context injection.",
        },
        {
          dimension: "Capture mode",
          wenlan: "Explicit /capture and /handoff, deliberate /distill, plus optional model-backed enrichment and revision proposals.",
          competitor:
            "Agent hooks capture prompts and tool activity; a local worker processes observations and summaries automatically.",
        },
        {
          dimension: "Retrieval flow",
          wenlan: "Recall over atomic memories and pages, with source IDs, graph context, and direct human-readable artifacts.",
          competitor:
            "SQLite/FTS5 plus optional Chroma; progressive disclosure through search, timeline, and full observation details.",
        },
        {
          dimension: "Cross-tool reach",
          wenlan: "Claude Code and Codex plugins plus MCP connectors share one local daemon and knowledge store.",
          competitor:
            "Claude Code roots plus maintained hooks or adapters for Codex and other agents; capture depth varies by integration.",
        },
        {
          dimension: "Provenance + versioning",
          wenlan: "Source IDs, citations, revisions, readable pages, and local git history for projected artifacts.",
          competitor:
            "Session-attributed observation IDs, citations, SQLite history, and a viewer; no per-write git history by default.",
        },
        {
          dimension: "License",
          wenlan: "Apache-2.0 runtime, CLI, MCP server, and plugin files.",
          competitor: "Apache-2.0 repository and current open-source core.",
        },
      ],
    },
    faqs: [
      {
        question: "Is Wenlan only for Claude Code?",
        answer:
          "No. Wenlan ships Claude Code and Codex plugins, local MCP setup for Cursor, Claude Desktop, Gemini CLI, and VS Code, and Streamable HTTP MCP Remote Access for ChatGPT and Claude.ai.",
      },
      {
        question: "Is claude-mem more automatic than Wenlan?",
        answer:
          "Yes, automatic session observation and compression are central to claude-mem. Wenlan defaults to explicit capture and handoff, with optional model-backed enrichment and page-refresh proposals that remain reviewable.",
      },
      {
        question: "Does claude-mem support Codex?",
        answer:
          "Yes. The reviewed claude-mem source includes Codex hooks and adapters. Check its maintained setup documentation for the current write and read behavior rather than assuming every integration captures the same lifecycle events.",
      },
      {
        question: "Can I migrate from claude-mem to Wenlan?",
        answer:
          "There is no maintained one-command importer. Export or retrieve the small set of durable items you still trust, then capture them into Wenlan with provenance and review the result. Do not bulk-copy an automatic history without deciding what remains current.",
      },
      {
        question: "Is automatic capture really lower-friction in the long run?",
        answer:
          "It is lower-friction at capture time. The later work is reviewing retrieval quality, stale observations, scope, and correction behavior. Explicit capture spends more attention up front. Test both costs on a real multi-session project.",
      },
      {
        question: "Does Wenlan watch my Claude Code session in the background?",
        answer:
          "Not by default. Wenlan stores what a user or agent explicitly captures, imports, or hands off. Optional model-backed passes can enrich that material and propose page work, but they do not silently turn every tool event into durable memory.",
      },
    ],
    relatedSlugs: [
      "claude-code-memory",
      "mcp-memory-server",
      "ai-agent-handoff-loop",
      "wenlan-vs-basic-memory",
      "wenlan-vs-superlocal-memory",
      "ai-work-memory",
    ],
    cta: {
      heading: "Carry Claude Code context beyond one session",
      body: "Wenlan helps Claude Code and other MCP clients use the same local work memory.",
    },
  },
  {
    slug: "wenlan-vs-superlocal-memory",
    eyebrow: "Comparison",
    category: "Comparisons",
    title: "Wenlan vs SuperLocalMemory v3.8.3: Local AI Memory Compared",
    description:
      "Compare Wenlan and SuperLocalMemory v3.8.3 across local agent memory, temporal retrieval, auditability, team controls, MCP workflows, and source-backed pages.",
    metaTitle: "Wenlan vs SuperLocalMemory v3.8.3 | Local AI Memory",
    metaDescription:
      "Compare Wenlan with SuperLocalMemory v3.8.3: local agent memory, temporal retrieval, team controls, MCP workflows, auditability, and source-backed pages.",
    keywords: [
      "Wenlan vs SuperLocalMemory",
      "SuperLocalMemory alternative",
      "super local memory",
      "local AI agent memory",
      "local-first agent memory",
    ],
    publishedAt: "2026-05-27",
    updatedAt: "2026-07-24",
    author: DEFAULT_AUTHOR,
    readingTime: "7 min read",
    audience: "Developers and teams comparing local-first memory systems for AI agents",
    heroBullets: [
      "SuperLocalMemory v3.8.3 is a broad local-first control plane for agent memory, temporal retrieval, team access, audit, cache, compression, and bounded loops.",
      "Wenlan v0.14.1 is a source-backed LLM wiki workflow for explicit capture, handoff, review, retrieval, and maintained readable pages.",
      "Choose by operating boundary: automated memory operations and team controls, or deliberate knowledge work with inspectable artifacts.",
      "The comparison is pinned to both projects' maintained sources on 2026-07-24; benchmark numbers retain their original protocol scopes.",
    ],
    officialReferences: [
      {
        label: "SuperLocalMemory v3.8.3 source",
        href: "https://github.com/qualixar/superlocalmemory/tree/v3.8.3",
      },
      {
        label: "SuperLocalMemory v3.8.3 README",
        href: "https://github.com/qualixar/superlocalmemory/blob/893e6d7d521cef6013d35f0ea468eca3005916de/README.md",
      },
      {
        label: "SuperLocalMemory v3.8.3 changelog",
        href: "https://github.com/qualixar/superlocalmemory/blob/893e6d7d521cef6013d35f0ea468eca3005916de/CHANGELOG.md",
      },
      {
        label: "SuperLocalMemory official website",
        href: "https://www.superlocalmemory.com/",
      },
      {
        label: "Wenlan v0.14.1 source",
        href: "https://github.com/7xuanlu/wenlan/tree/v0.14.1",
      },
    ],
    sections: [
      {
        heading: "Short answer",
        body: [
          "Choose SuperLocalMemory when you want a local-first agent memory control plane with automated ingestion, temporal and graph-aware retrieval, personal and team scopes, a dashboard, cache and compression controls, bounded loops, and framework adapters.",
          "Choose Wenlan when you want an LLM wiki for AI work: explicit capture, handoffs between sessions, reviewable memories, source-backed pages, local hybrid retrieval, and readable artifacts that can sit beside an Obsidian vault.",
          "Both are local-first and MCP-capable. The useful distinction is not whether either product has retrieval; it is whether you want a broad operational control plane or a deliberate, inspectable knowledge workflow.",
        ],
      },
      {
        heading: "What changed in SuperLocalMemory v3.8.3",
        body: [
          "The maintained v3.8.3 README now describes SuperLocalMemory as an enterprise-oriented, local-first agent memory control plane rather than only a retrieval and optimization layer. SQLite and sqlite-vec remain canonical; optional CozoDB and LanceDB projections stay behind parity checks.",
          "Its current retrieval path combines semantic, BM25 lexical, temporal retrieval, Hopfield associative, and spreading-activation candidates before fusion and optional reranking. The release also exposes provenance, memory inspection, personal, shared, and global scopes, multi-workspace isolation, role-based access, retention and erasure controls, a hash-chained audit trail, and a dashboard.",
          "The control plane also covers exact caching, opt-in compression, trusted-peer coordination, bounded loops, and nine framework adapters. Provider-backed enrichment, cloud modes, connectors, and networked adapters remain explicit operator choices rather than requirements of the local core.",
        ],
      },
      {
        heading: "What Wenlan emphasizes",
        body: [
          "Wenlan focuses on turning AI work into a maintained, source-backed LLM wiki. Agents explicitly capture durable facts, write handoffs, retrieve prior context, curate revisions, and distill selected memories into readable pages.",
          "Its local daemon combines FTS5, BGE embeddings, weighted reciprocal-rank fusion, eligible graph context, and optional reranking. The same memory is available across MCP clients, while projected Markdown pages, citations, revisions, session artifacts, and local git history keep the maintained knowledge layer inspectable.",
          "Wenlan is not trying to be a team access-control plane, an LLM proxy, or a framework runtime. Its narrower boundary is useful when the primary job is preserving why work changed and keeping the resulting knowledge readable by people.",
        ],
      },
      {
        heading: "How to decide",
        body: [
          "Start with the artifact you need at the end. If you need a governed operational memory service for several agents or people, test SuperLocalMemory's profiles, scopes, role gates, audit surfaces, cache, compression, and framework adapters.",
          "If you need a durable project record that an agent can retrieve and a person can open, review, cite, revise, and carry across tools, test Wenlan's capture, handoff, recall, curate, distill, and page workflows.",
          "A team can reasonably use both boundaries. The comparison matters when choosing which product should own the durable memory and which one, if any, should own optimization or operational controls.",
        ],
      },
      {
        heading: "Read the benchmark scopes before comparing scores",
        body: [
          "SuperLocalMemory's maintained README separates three LoCoMo results. Mode A Raw reports 60.4% across 10 conversations and 1,276 scored questions with local retrieval and zero-LLM answer construction. Mode A Retrieval reports 74.8% on the same question count, but uses GPT-4.1-mini answer synthesis after local retrieval. Mode C reports 87.7% on one conversation and 81 scored questions with cloud embeddings, answer generation, and judging.",
          "Wenlan publishes retrieval-only LongMemEval rows: LME_Oracle at 93.6% Recall@5 / 0.857 MRR / 0.883 NDCG@10 on 500 questions, and LME_S at 87.7% Recall@5 / 0.815 MRR / 0.822 NDCG@10 on a stratified 90-question deep-retrieval snapshot.",
          "Those percentages are not a head-to-head leaderboard. The datasets, sample sizes, answer-construction steps, models, and metrics differ. Use each result to inspect its own retrieval contract, then rerun both products on the same workload if benchmark performance determines the decision.",
        ],
      },
      {
        heading: "Run an inspectability and recovery test",
        body: [
          "Install both against disposable test data. Store a decision, its source, and a later correction. Ask a time-qualified question, inspect which evidence was retrieved, verify the correction, delete the original, restart the service, and repeat from a second MCP client.",
          "In SuperLocalMemory, inspect the operation receipt, provenance, scope, audit event, profile boundary, recall trace, and dashboard record. In Wenlan, inspect the recalled memory, source IDs, curated revision, distilled Markdown page, session handoff, and local git history.",
          "Then test the failure paths you actually care about: low-confidence recall, conflicting facts, unavailable enrichment, a busy daemon, a profile or Space boundary, and recovery after restart. This produces a decision you can audit instead of a feature-count vote.",
        ],
        bullets: [
          "Can you see the verbatim record, capture time, source, scope, and retrieval trace?",
          "Can you distinguish a stored assertion from a query-relative ranking score?",
          "Can you correct or delete one item and prove the old state no longer returns?",
          "Can another client retrieve the intended record without crossing the wrong workspace boundary?",
          "Can a person read the durable knowledge artifact without the original chat client?",
        ],
      },
      {
        heading: "A fair two-week evaluation",
        body: [
          "During week one, use real work rather than synthetic prompts. Record capture effort, recall usefulness, source traceability, false positives, and how often a person must repair the memory. Keep SuperLocalMemory's optional cloud modes and Wenlan's optional enrichment settings fixed and documented.",
          "During week two, test time, contradiction, deletion, restart, and cross-client behavior. If you need team governance, add two profiles and verify read, write, and delete boundaries. If you need a maintained knowledge base, require each system to produce or support a readable project summary with citations.",
          "I built Wenlan, so treat this page as a source-linked test plan rather than a neutral verdict. The pinned references above are there so you can check every moving product claim before choosing.",
        ],
      },
    ],
    comparisonTable: {
      competitorName: "SuperLocalMemory v3.8.3",
      rows: [
        {
          dimension: "Center of gravity",
          wenlan: "Source-backed LLM wiki workflow: explicit capture, handoff, review, recall, distillation, and readable maintained pages.",
          competitor:
            "Local-first agent memory control plane: ingestion, retrieval, scopes, audit, operations, cache, compression, coordination, and adapters.",
        },
        {
          dimension: "Retrieval",
          wenlan: "FTS5 + local BGE embeddings + weighted RRF, with eligible graph context and optional reranking.",
          competitor:
            "Semantic, BM25, temporal, Hopfield, and spreading-activation candidates, followed by fusion, optional reranking, and graph score enhancement.",
        },
        {
          dimension: "Durable artifact",
          wenlan: "Local libSQL is retrieval authority; projected Markdown pages, citations, revisions, session artifacts, and git history stay readable.",
          competitor:
            "SQLite + sqlite-vec are canonical; the dashboard, CLI, MCP, traces, and audit surfaces expose and operate the control-plane records.",
        },
        {
          dimension: "Team boundaries",
          wenlan: "Spaces and read scopes separate memory contexts; the public product is centered on an individual local knowledge workflow.",
          competitor:
            "Profiles, personal/shared/global memory, role-based access, workspace isolation, and optional sign-in for shared deployments.",
        },
        {
          dimension: "Provenance + audit",
          wenlan: "Source IDs on distilled pages, review queues, revisions, corrections, and git history for projected readable artifacts.",
          competitor:
            "Operation receipts, provenance, recall traces, retention/erasure controls, and a hash-chained audit trail.",
        },
        {
          dimension: "Optimization + automation",
          wenlan: "Does not own the primary LLM request path; focuses on memory, handoffs, review, retrieval, and maintained pages.",
          competitor:
            "Exact cache, opt-in compression, proxy/MCP/skill surfaces, bounded loops, peer coordination, and framework adapters.",
        },
        {
          dimension: "License",
          wenlan: "Apache-2.0 for the daemon, CLI, MCP server, and plugin source.",
          competitor:
            "AGPL v3 family licensing in the maintained repository and package metadata; a separate commercial-license file is published.",
        },
      ],
    },
    faqs: [
      {
        question: "Do Wenlan and SuperLocalMemory solve the same problem?",
        answer:
          "They overlap around local-first agent memory, retrieval, MCP clients, provenance, and durable context. SuperLocalMemory v3.8.3 has the broader operational control-plane boundary; Wenlan has the narrower source-backed LLM wiki and work-memory boundary.",
      },
      {
        question: "Which is better for team access controls?",
        answer:
          "SuperLocalMemory v3.8.3 explicitly documents profiles, role-based access, personal/shared/global scopes, workspace isolation, optional sign-in, and governance controls. Wenlan uses Spaces and read scopes, but its public workflow is centered on source-backed local knowledge rather than a multi-user access-control plane.",
      },
      {
        question: "Can I compare the published benchmark percentages directly?",
        answer:
          "No. SuperLocalMemory publishes protocol-scoped LoCoMo answer results, while Wenlan publishes retrieval metrics on LongMemEval snapshots. The datasets, sample sizes, models, answer-construction steps, and metrics differ, so the numbers are not a head-to-head leaderboard.",
      },
      {
        question: "Is SuperLocalMemory open source?",
        answer:
          "Yes. The v3.8.3 repository and package publish AGPL v3 family licensing and also include a commercial-license file. Wenlan's daemon, CLI, MCP server, and plugin source are Apache-2.0.",
      },
      {
        question: "What versions does this comparison cover?",
        answer:
          "This page pins SuperLocalMemory v3.8.3 and Wenlan v0.14.1 using maintained first-party source captured on 2026-07-24. Last release alignment: v0.14.1 on 2026-07-20. Check the linked changelog and tagged source before relying on a moving product claim.",
      },
    ],
    relatedSlugs: [
      "local-first-ai-memory",
      "markdown-local-index-ai-memory",
      "ai-agent-handoff-loop",
      "wenlan-vs-basic-memory",
      "wenlan-vs-claude-mem",
      "review-before-trust-ai-memory",
    ],
    cta: {
      heading: "Build a source-backed LLM wiki",
      body: "Wenlan keeps AI work context local, reviewable, and available across MCP-compatible tools.",
    },
  },
  {
    slug: "markdown-local-index-ai-memory",
    eyebrow: "Architecture",
    category: "Concepts",
    title: "Why Wenlan Uses Readable Artifacts plus a Local Store",
    description:
      "Wenlan keeps raw captures in a daemon-owned local store and projects readable artifacts, so AI memory stays inspectable and useful.",
    metaTitle: "Readable Artifacts plus Local Store for AI Memory | Wenlan",
    metaDescription:
      "Learn why Wenlan combines a daemon-owned local retrieval store with human-readable artifacts instead of hiding AI memory inside an opaque database.",
    keywords: [
      "readable AI memory",
      "local store AI memory",
      "AI memory database",
      "human-readable AI memory",
      "transparent AI memory",
    ],
    updatedAt,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    audience: "People who want AI memory they can inspect and trust",
    heroBullets: [
      "Raw captures live in the daemon-owned local store that powers recall.",
      "Readable pages, sessions, and status files are projected under ~/.wenlan for inspection.",
      "This split keeps memory useful to agents without making it opaque to humans.",
    ],
    sections: [
      {
        heading: "The problem with black-box memory",
        body: [
          "A memory layer can become risky when the only record lives inside a database or model profile that users cannot inspect. If the assistant retrieves stale or wrong context, it is hard to know where the mistake came from.",
          "For long-running work, memory needs to be readable by people and searchable by agents.",
        ],
      },
      {
        heading: "Readable artifacts are the projection",
        body: [
          "Wenlan projects pages, session logs, and project status as readable Markdown so people can open them, read them, export them, and reason about them without a special UI.",
          "That does not mean every raw capture is a Markdown file. It means the human-facing artifacts remain inspectable while the daemon keeps the retrieval store authoritative.",
        ],
      },
      {
        heading: "The daemon store powers recall",
        body: [
          "Agents still need fast retrieval. Wenlan uses a local daemon store for captures, vector search, full-text search, graph context, provenance, and other metadata that make memories useful during an AI session.",
          "The store is not a cloud black box. It is local application data, and the pages, sessions, and status artifacts give people a readable view into the work loop.",
        ],
      },
      {
        heading: "Why the split matters",
        body: [
          "The readable-artifact-plus-local-store design gives both sides what they need: humans get inspection and portability, while agents get retrieval speed and context packaging.",
          "That is the basis for Wenlan's trust story. Memory can be powerful without becoming invisible.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why not store everything only in Markdown?",
        answer:
          "Markdown is excellent for human-readable artifacts, but agents need daemon-owned indexes for fast semantic and full-text retrieval. Wenlan uses both.",
      },
      {
        question: "Why not store everything only in a database?",
        answer:
          "A database-only memory layer can become opaque. Wenlan keeps readable artifacts available so people can inspect and correct what AI tools rely on.",
      },
    ],
    relatedSlugs: [
      "local-first-ai-memory",
      "ai-work-memory-vs-knowledge-base",
      "wenlan-vs-basic-memory",
      "ai-work-memory",
    ],
    cta: {
      heading: "Keep memory readable and searchable",
      body: "Wenlan pairs readable artifacts with a local retrieval store so memory stays useful to agents and visible to people.",
    },
  },
  {
    slug: "ai-agent-memory-types",
    eyebrow: "Architecture",
    category: "Concepts",
    title:
      "AI Agent Memory Types: Working, Episodic, Semantic, and Procedural",
    description:
      "Learn what the four AI agent memory types do, where each should live, and why facts, events, current context, and procedures need different lifecycles.",
    metaTitle: "AI Agent Memory Types: 4 Layers Explained | Wenlan",
    metaDescription:
      "Compare working, episodic, semantic, and procedural memory for AI agents, with a practical guide to storage, retrieval, and updates.",
    keywords: [
      "AI agent memory types",
      "working memory AI agents",
      "episodic memory AI agents",
      "semantic memory AI agents",
      "procedural memory AI agents",
      "agent memory architecture",
    ],
    publishedAt: "2026-07-25",
    updatedAt: "2026-07-25",
    author: DEFAULT_AUTHOR,
    readingTime: "7 min read",
    audience: "Developers designing durable memory for AI agents",
    heroBullets: [
      "Working memory holds the active task, observations, and temporary state.",
      "Episodic and semantic memory preserve what happened and what is known.",
      "Procedural memory controls how the agent behaves and should be updated like instructions, not facts.",
    ],
    sections: [
      {
        heading: "Short answer",
        body: [
          "An AI agent needs different memory roles because current task state, past events, durable knowledge, and operating instructions do not age or change in the same way. Working memory is temporary. Episodic memory records what happened. Semantic memory stores what is known. Procedural memory controls how work is done.",
          "These are architectural roles, not four required database tables. One system may use a context window, event log, knowledge store, and versioned skills; another may share infrastructure while keeping separate write, retrieval, and update rules.",
        ],
      },
      {
        heading: "The four AI agent memory types",
        body: [
          "The CoALA model separates an agent's short-term working memory from long-term episodic, semantic, and procedural memory. The useful distinction is not the label on a storage engine. It is what the information means and how the system should maintain it.",
        ],
        bullets: [
          "Working memory: the active goal, recent observations, intermediate results, and current tool state needed for the task in front of the agent.",
          "Episodic memory: records of events and outcomes, such as a debugging session, a deployment, a user interaction, or a handoff between agents.",
          "Semantic memory: durable facts, concepts, preferences, decisions, and maintained knowledge that can be reused outside the event that produced them.",
          "Procedural memory: instructions for how to act, including prompts, policies, rules, skills, tools, and code.",
        ],
      },
      {
        heading: "Where each memory type should live",
        body: [
          "Place information according to its lifecycle and consumer. Current state should be cheap to replace; event records need time and outcome context; durable knowledge needs correction and provenance; behavior needs versioning and tests.",
        ],
        bullets: [
          "Working memory belongs in the current context window or session state. Keep only what the active task needs, then discard or compress it when the task ends.",
          "Episodic memory belongs in timestamped session history and handoffs. Preserve what happened, what changed, the outcome, and links to relevant artifacts.",
          "Semantic memory belongs in durable facts and maintained knowledge. Give important claims source links, scope, correction paths, and a way to supersede stale versions.",
          "Procedural memory belongs in versioned prompts, rules, skills, or code. Review it as behavior, test important paths, and retain why a procedure changed.",
        ],
      },
      {
        heading: "Why one vector store is not enough",
        body: [
          "Putting every transcript, fact, event, and instruction into one retrieval index hides the differences that matter. A stale fact should be corrected or superseded. An old event may remain historically true. A failed procedure should be revised and tested. Temporary task state should usually disappear.",
          "Retrieval can still span multiple roles, but the write and maintenance rules should stay explicit. Otherwise the agent may retrieve an obsolete workflow as if it were a current fact, or treat a one-time event as a lasting rule.",
        ],
      },
      {
        heading: "How Wenlan fits without changing the taxonomy",
        body: [
          "Wenlan is the durable work-memory and source-backed knowledge layer, not the entire agent architecture. The AI client owns working context. Wenlan can preserve useful session handoffs, durable facts, decisions, lessons, and maintained Pages. Prompts, project rules, skills, and executable code remain the procedural layer.",
          "Wenlan's identity, preference, decision, lesson, gotcha, and fact are capture metadata, not the four cognitive layers. They help classify a durable capture inside Wenlan; they do not relabel working, episodic, semantic, and procedural memory.",
        ],
        link: {
          label: "See how semantic memory becomes a maintained page",
          href: "/learn/distilled-wiki-pages-ai-memory",
        },
      },
    ],
    faqs: [
      {
        question: "Are the four AI agent memory types four separate databases?",
        answer:
          "No. They are roles with different lifecycles. A system may share storage, but it should keep the write, retrieval, correction, retention, and versioning rules distinct.",
      },
      {
        question: "Should procedural memory go into a vector database?",
        answer:
          "A system can retrieve procedures dynamically, but important behavior should remain inspectable and versioned as prompts, rules, skills, or code. Treating a procedure as an ordinary fact makes changes and failures harder to review.",
      },
    ],
    relatedSlugs: [
      "ai-work-memory",
      "what-to-capture-in-ai-work-memory",
      "ai-agent-handoff-loop",
      "source-backed-wiki-pages-ai-work",
    ],
    officialReferences: [
      {
        label: "CoALA: Cognitive Architectures for Language Agents",
        href: "https://arxiv.org/abs/2309.02427",
      },
      {
        label: "LangChain memory overview",
        href: "https://docs.langchain.com/oss/python/concepts/memory",
      },
      {
        label: "Letta context hierarchy",
        href: "https://docs.letta.com/guides/core-concepts/memory/context-hierarchy",
      },
      {
        label: "Wenlan memory types",
        href: "https://wenlan.app/docs/memory-types",
      },
    ],
    cta: {
      heading: "Keep durable agent memory inspectable",
      body: "Wenlan preserves decisions, lessons, handoffs, and source-backed knowledge while your agent keeps current context and procedures in the right layers.",
    },
  },
  {
    slug: "ai-agent-handoff-loop",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "The AI Agent Handoff Loop: How Work Carries Across Sessions",
    description:
      "A practical model for carrying decisions, lessons, gotchas, and next steps from one AI work session into the next.",
    metaTitle: "AI Agent Handoff Loop | Wenlan",
    metaDescription:
      "Learn how the AI agent handoff loop helps coding agents and AI tools carry decisions, lessons, project context, and next steps across sessions.",
    keywords: [
      "AI agent handoff",
      "AI work sessions",
      "persistent context AI agents",
      "coding agent memory",
      "AI session handoff",
    ],
    updatedAt,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    audience: "Developers and AI power users running multi-session work",
    heroBullets: [
      "Session start: load relevant context before work begins.",
      "During work: capture durable facts, decisions, gotchas, and follow-ups.",
      "Session end: write a handoff so the next run knows what changed.",
    ],
    sections: [
      {
        heading: "Why sessions need handoffs",
        body: [
          "AI work often fails at the boundary between sessions. The assistant did useful work, but the next run does not know what changed, what was decided, or where to continue.",
          "A handoff loop turns that boundary into a habit. The next agent starts with the right context instead of replaying a full chat history.",
        ],
      },
      {
        heading: "The loop",
        body: [
          "Wenlan follows a simple rhythm: load context when a session starts, capture durable knowledge during work, write a handoff when the session ends, refine memory between sessions, and retrieve the right context next time.",
          "The loop is deliberately practical. It focuses on what future agents need to act well: decisions, lessons, constraints, unresolved threads, and source provenance.",
        ],
      },
      {
        heading: "What belongs in a handoff",
        body: [
          "A good handoff is not a transcript. It should say what changed, what matters, what remains open, and which files, commands, or project areas are relevant.",
          "The point is to compress the state of work into something useful for the next session.",
        ],
        bullets: [
          "Decision made and why it was chosen.",
          "Lesson or gotcha discovered while debugging.",
          "Follow-up that should not be lost.",
          "Project context the next agent needs before editing.",
        ],
      },
      {
        heading: "How Wenlan supports it",
        body: [
          "Wenlan gives agents a place to save the durable parts of the session and a way to recall them through MCP later.",
          "Between sessions, Wenlan keeps captures, handoffs, related entities, and source-backed pages connected. Manual `/distill` turns repeated context into readable pages, while optional local models or API keys can add background page work.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a handoff the same as summarizing a chat?",
        answer:
          "No. A handoff is action-oriented. It captures what the next session needs to continue the work, not everything that happened.",
      },
      {
        question: "Does every AI session need a handoff?",
        answer:
          "No. One-off chats may not need one. Handoffs matter most when work spans days, projects, tools, or multiple AI sessions.",
      },
    ],
    relatedSlugs: ["claude-code-memory", "mcp-memory-server", "markdown-local-index-ai-memory"],
    cta: {
      heading: "Stop restarting from zero",
      body: "Wenlan makes handoffs, decisions, and project context available when the next AI session begins.",
    },
  },
];

export const articles: LearnArticle[] = [...baseArticles, ...seoArticles];

export function getArticle(slug: string): LearnArticle | undefined {
  return articles.find((article) => article.slug === slug);
}

export function articleUrl(slug: string): string {
  return `${SITE_URL}/learn/${slug}`;
}

export function formatArticleDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
