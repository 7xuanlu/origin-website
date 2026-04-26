export const SITE_URL = "https://useorigin.app";

export type GuideSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type GuideFaq = {
  question: string;
  answer: string;
};

export type Guide = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  updatedAt: string;
  readingTime: string;
  audience: string;
  heroBullets: string[];
  sections: GuideSection[];
  faqs: GuideFaq[];
  relatedSlugs: string[];
  cta: {
    heading: string;
    body: string;
  };
};

const updatedAt = "2026-04-25";

export const guides: Guide[] = [
  {
    slug: "ai-memory-app",
    eyebrow: "Category guide",
    title: "What Is an AI Memory App?",
    description:
      "An AI memory app gives assistants durable, inspectable context across conversations, tools, and weeks of work.",
    metaTitle: "What Is an AI Memory App? | Origin",
    metaDescription:
      "Learn what an AI memory app does, when built-in memory is not enough, and how Origin makes AI memory local, visible, editable, and MCP-native.",
    keywords: [
      "AI memory app",
      "personal AI memory",
      "AI memory layer",
      "persistent memory for AI assistants",
      "Origin AI memory",
    ],
    updatedAt,
    readingTime: "5 min read",
    audience: "AI power users, knowledge workers, and developers",
    heroBullets: [
      "Captures decisions, preferences, gotchas, and project knowledge from AI work.",
      "Makes memory visible and editable instead of hiding it inside a model profile.",
      "Lets multiple AI tools recall the same durable context through MCP.",
    ],
    sections: [
      {
        heading: "The short definition",
        body: [
          "An AI memory app is software that stores useful context from your work with AI assistants and makes it available later when the assistant needs it.",
          "That context can include decisions, facts, project constraints, personal preferences, lessons learned, and relationships between ideas. The goal is simple: your AI should not rediscover the same knowledge from scratch every session.",
        ],
      },
      {
        heading: "Why built-in AI memory is not enough",
        body: [
          "Built-in memory is convenient, but it is usually opaque. The assistant decides what matters, stores a compressed version, and may retrieve it later without showing you why. That works for lightweight preferences, but it becomes risky for real work.",
          "Knowledge workers and developers need memory they can inspect, correct, delete, and trace back to source conversations. Bad memory is worse than no memory when it contains stale decisions or wrong assumptions.",
        ],
        bullets: [
          "You need to see what the assistant remembers.",
          "You need provenance for important claims and decisions.",
          "You need memory to move across tools, not stay trapped in one chat product.",
          "You need contradictions and duplicates to be managed over time.",
        ],
      },
      {
        heading: "What a useful AI memory app should do",
        body: [
          "The core job is not hoarding transcripts. A useful memory app distills noisy conversations into compact knowledge and retrieves the right pieces later.",
          "That usually means combining semantic search, full-text search, metadata, and some kind of knowledge graph. It also means letting the user curate the memory instead of trusting a black box.",
        ],
        bullets: [
          "Store concise memories instead of replaying entire conversations.",
          "Search by meaning and exact words.",
          "Connect entities, projects, decisions, and observations.",
          "Expose every memory for review and correction.",
          "Work with the tools where people already use AI.",
        ],
      },
      {
        heading: "How Origin approaches AI memory",
        body: [
          "Origin is a local-first AI memory app for Claude Code, Cursor, Claude Desktop, ChatGPT, Gemini CLI, and other MCP-compatible agents.",
          "It stores memory locally, makes every memory visible and editable, and uses a hybrid memory engine that combines vector search, full-text search, and a knowledge graph. The product is built for compounding understanding rather than passive transcript storage.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is an AI memory app the same as a notes app?",
        answer:
          "No. A notes app is mainly for human writing and retrieval. An AI memory app turns conversation history into structured context that assistants can recall while they work.",
      },
      {
        question: "Does an AI memory app replace ChatGPT or Claude memory?",
        answer:
          "It can complement or replace parts of built-in memory. The main difference is control: Origin makes memories visible, editable, traceable, and available across MCP-compatible tools.",
      },
    ],
    relatedSlugs: ["mcp-memory-server", "local-first-ai-memory", "claude-code-memory"],
    cta: {
      heading: "Make your AI work compound",
      body: "Origin captures what you figure out with AI and turns it into memory your agents can actually use later.",
    },
  },
  {
    slug: "mcp-memory-server",
    eyebrow: "Protocol guide",
    title: "MCP Memory Server: Persistent Memory for AI Tools",
    description:
      "An MCP memory server gives Claude Code, Cursor, ChatGPT, and other agents a shared place to store and recall durable context.",
    metaTitle: "MCP Memory Server for Claude Code and Cursor | Origin",
    metaDescription:
      "Learn what an MCP memory server is, how it gives AI tools persistent context, and how Origin adds local-first memory with visibility and provenance.",
    keywords: [
      "MCP memory server",
      "memory MCP",
      "Claude MCP memory",
      "Cursor MCP memory",
      "persistent memory for AI agents",
    ],
    updatedAt,
    readingTime: "6 min read",
    audience: "Developers and AI power users connecting multiple MCP clients",
    heroBullets: [
      "MCP lets AI tools call external memory tools instead of relying only on chat history.",
      "A memory server can store, search, and package context across sessions.",
      "Origin adds local storage, curation, provenance, and a product UI around the memory layer.",
    ],
    sections: [
      {
        heading: "What an MCP memory server does",
        body: [
          "The Model Context Protocol gives AI clients a standard way to call external tools. An MCP memory server exposes memory operations through that protocol, usually tools for storing, searching, recalling, and deleting memories.",
          "Instead of pasting the same background into every prompt, the assistant can ask the memory server for relevant context when it needs it.",
        ],
      },
      {
        heading: "Why MCP is useful for memory",
        body: [
          "Memory is more useful when it is not trapped inside one interface. Claude Code, Claude Desktop, Cursor, ChatGPT, and Gemini CLI can all participate in the same workflow if they speak MCP.",
          "That makes MCP a natural boundary for persistent AI memory. The AI tool handles the conversation. The memory server handles durable context.",
        ],
        bullets: [
          "One memory layer can serve multiple AI clients.",
          "Memory tools can be installed and updated independently.",
          "Local servers can keep sensitive context on your machine.",
          "The protocol gives developers a clear integration surface.",
        ],
      },
      {
        heading: "Local vs hosted memory servers",
        body: [
          "Hosted memory servers are easy to start, but they require sending memory to someone else's infrastructure. Local memory servers take more care, but they keep private project context, preferences, and decisions under your control.",
          "Origin is built around the local-first path. The daemon runs on your machine, owns the database, and serves memory to MCP clients through origin-mcp.",
        ],
      },
      {
        heading: "How Origin fits",
        body: [
          "Origin is more than a bare MCP store. It is a desktop product and daemon that distills AI conversations into memories, links related knowledge, detects contradictions, and gives you a UI for inspection and correction.",
          "The MCP server is the bridge: AI tools read and write memory, while Origin keeps the memory visible, searchable, and locally owned.",
        ],
      },
      {
        heading: "Basic setup shape",
        body: [
          "The common setup is to install origin-mcp in your MCP client, then let it connect to the local Origin daemon. The daemon stores memory on your machine and serves it to whichever compatible AI tool you use.",
          "For detailed commands and the latest package behavior, use the GitHub README as the source of truth.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Origin just an MCP memory server?",
        answer:
          "No. Origin includes an MCP server path, but the product also includes local storage, refinement, contradiction detection, provenance, search, and a desktop UI.",
      },
      {
        question: "Can one MCP memory server work with multiple AI tools?",
        answer:
          "Yes, if those tools support MCP and are configured to use the same server. Origin is designed for that shared-memory workflow.",
      },
    ],
    relatedSlugs: ["claude-code-memory", "ai-memory-app", "local-first-ai-memory"],
    cta: {
      heading: "Give every agent the same memory",
      body: "Origin connects MCP-compatible tools to one local memory layer instead of scattering context across chat silos.",
    },
  },
  {
    slug: "local-first-ai-memory",
    eyebrow: "Privacy guide",
    title: "Local-First AI Memory: Keep Context on Your Machine",
    description:
      "Local-first AI memory keeps sensitive project knowledge, decisions, and preferences under your control while still making them useful to assistants.",
    metaTitle: "Local-First AI Memory | Origin",
    metaDescription:
      "Learn why local-first AI memory matters for privacy, ownership, and long-running work. Origin keeps AI memory visible, editable, and on your machine.",
    keywords: [
      "local-first AI memory",
      "private AI memory",
      "on-device AI memory",
      "open source AI memory",
      "self-hosted AI memory",
    ],
    updatedAt,
    readingTime: "5 min read",
    audience: "People using AI with sensitive work, client context, or private knowledge",
    heroBullets: [
      "Your memory database stays on your Mac by default.",
      "On-device intelligence processes memory without making cloud storage the default.",
      "Every memory remains visible, editable, and traceable.",
    ],
    sections: [
      {
        heading: "What local-first means for AI memory",
        body: [
          "Local-first AI memory means the durable context your assistants rely on is owned and stored primarily on your device. Cloud services may still be useful in some workflows, but they are not the default source of truth.",
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
          "Origin chooses local-first because the memory layer should be durable infrastructure you trust, not another opaque profile maintained by a platform.",
        ],
        bullets: [
          "Local database for your memory layer.",
          "On-device LLM processing on Apple Silicon.",
          "Open-source implementation you can inspect.",
          "MCP access for tools without giving up local ownership.",
        ],
      },
      {
        heading: "How Origin keeps memory useful",
        body: [
          "Local-first does not mean inert. Origin combines vector search, full-text search, and a knowledge graph so assistants can retrieve the right memories without replaying everything.",
          "It also makes memory inspectable. You can see what was learned, trace it back to source conversations, and correct it when your understanding changes.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does local-first mean no AI model can use the memory?",
        answer:
          "No. Local-first means the memory layer is owned locally. MCP-compatible AI tools can still access relevant context through the local Origin daemon.",
      },
      {
        question: "Is Origin fully self-hosted?",
        answer:
          "Origin is local-first on macOS Apple Silicon. The daemon and database run locally, and the product is open source. Optional integrations may depend on the AI tools you connect.",
      },
    ],
    relatedSlugs: ["ai-memory-app", "mcp-memory-server", "claude-code-memory"],
    cta: {
      heading: "Keep your context where your work lives",
      body: "Origin gives AI tools useful memory without making your accumulated work context cloud-first by default.",
    },
  },
  {
    slug: "claude-code-memory",
    eyebrow: "Developer guide",
    title: "Claude Code Memory: Persistent Project Context Across Sessions",
    description:
      "Claude Code memory helps coding agents remember project decisions, gotchas, conventions, and prior work instead of rediscovering them every session.",
    metaTitle: "Claude Code Memory and Persistent Context | Origin",
    metaDescription:
      "Learn how Claude Code memory works, where CLAUDE.md helps, and how Origin adds shared MCP memory across coding sessions and AI tools.",
    keywords: [
      "Claude Code memory",
      "Claude Code persistent memory",
      "Claude Code MCP memory",
      "Claude Code project context",
      "AI coding agent memory",
    ],
    updatedAt,
    readingTime: "6 min read",
    audience: "Developers using Claude Code, Cursor, and other AI coding agents",
    heroBullets: [
      "Keep project decisions and conventions available after the chat ends.",
      "Use CLAUDE.md for stable project instructions and Origin for evolving learned context.",
      "Share memory across Claude Code, Cursor, Claude Desktop, and other MCP-compatible tools.",
    ],
    sections: [
      {
        heading: "Why Claude Code needs durable memory",
        body: [
          "Claude Code is strongest when it understands the project: architecture, conventions, pitfalls, release process, and the reasoning behind prior decisions. But sessions end, context windows fill, and important discoveries get lost.",
          "Persistent memory closes that gap. It lets the coding agent recover what has already been learned instead of asking you to repeat background every time.",
        ],
      },
      {
        heading: "CLAUDE.md is necessary but not sufficient",
        body: [
          "CLAUDE.md is excellent for stable, project-level instructions: build commands, architecture notes, style rules, and long-lived conventions. It should not become a dumping ground for every transient observation from every coding session.",
          "Origin is designed for the evolving layer: facts, decisions, gotchas, follow-ups, and relationships learned while working. The two are complementary.",
        ],
        bullets: [
          "Use CLAUDE.md for stable project guidance.",
          "Use Origin for learned context that changes as work happens.",
          "Let MCP give Claude Code access to the relevant memories when needed.",
          "Keep memory inspectable so stale coding assumptions can be fixed.",
        ],
      },
      {
        heading: "What Claude Code memory should contain",
        body: [
          "Useful coding memory is specific and grounded. It should capture why a decision was made, what tradeoffs were considered, what commands verify a change, and which files or modules own a behavior.",
          "It should not merely store chat transcripts. The point is to make future sessions faster and less error-prone.",
        ],
      },
      {
        heading: "How Origin works with Claude Code",
        body: [
          "Origin exposes memory through MCP via origin-mcp. Claude Code can write what it learns and recall relevant project context later. The same memory can also be available to Cursor, Claude Desktop, ChatGPT, and Gemini CLI when configured.",
          "That makes Origin a shared memory layer for AI-assisted development rather than a single-client note file.",
        ],
      },
      {
        heading: "A practical workflow",
        body: [
          "Start with your project instructions in CLAUDE.md. Add Origin as an MCP server. Let Claude Code store durable findings as work happens: preferences, architecture decisions, debugging lessons, and follow-up tasks.",
          "When a later session starts, the assistant can retrieve the relevant memory instead of starting from zero.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should Claude Code memory replace CLAUDE.md?",
        answer:
          "No. CLAUDE.md is best for stable project instructions. Origin is best for evolving memory across sessions, tools, and projects.",
      },
      {
        question: "Can Cursor use the same memory?",
        answer:
          "Yes. Origin is MCP-native, so multiple MCP-compatible tools can connect to the same local memory layer when configured.",
      },
    ],
    relatedSlugs: ["mcp-memory-server", "ai-memory-app", "local-first-ai-memory"],
    cta: {
      heading: "Stop re-explaining the same codebase",
      body: "Origin helps Claude Code and other coding agents carry project knowledge across sessions.",
    },
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function guideUrl(slug: string): string {
  return `${SITE_URL}/guides/${slug}`;
}
