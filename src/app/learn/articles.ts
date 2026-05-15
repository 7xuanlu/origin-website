export const SITE_URL = "https://useorigin.app";
export const DEFAULT_AUTHOR = "Origin team";

export const articleCategories = ["Concepts", "Comparisons", "Workflows"] as const;

export type LearnArticleCategory = (typeof articleCategories)[number];

export type LearnArticleSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type LearnArticleFaq = {
  question: string;
  answer: string;
};

export type OfficialReference = {
  label: string;
  href: string;
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
  updatedAt: string;
  author: string;
  readingTime: string;
  audience: string;
  heroBullets: string[];
  sections: LearnArticleSection[];
  faqs: LearnArticleFaq[];
  relatedSlugs: string[];
  officialReferences?: OfficialReference[];
  cta: {
    heading: string;
    body: string;
  };
};

const updatedAt = "2026-05-15";

export const articles: LearnArticle[] = [
  {
    slug: "ai-work-memory",
    eyebrow: "Concept",
    category: "Concepts",
    title: "What Is AI Work Memory?",
    description:
      "AI work memory carries sessions, decisions, lessons, project context, and wiki pages across tools and time.",
    metaTitle: "What Is AI Work Memory? | Origin",
    metaDescription:
      "Learn what AI work memory is, when built-in memory is not enough, and how Origin keeps work context local, visible, editable, and MCP-native.",
    keywords: [
      "AI work memory",
      "memory for AI work",
      "local-first memory for AI work",
      "durable AI work context",
      "Origin AI work",
    ],
    updatedAt,
    author: DEFAULT_AUTHOR,
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
        heading: "How Origin approaches AI work memory",
        body: [
          "Origin is local-first memory for AI work in Claude Code, Cursor, Codex, Claude Desktop, Gemini CLI, and other MCP-compatible tools.",
          "Origin stores useful context locally, makes memory visible and editable, writes handoffs, distills wiki pages, and uses hybrid retrieval that combines vector search, full-text search, and graph context.",
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
          "It can complement or replace parts of built-in memory. The main difference is control: Origin makes memories visible, editable, traceable, and available across MCP-compatible tools.",
      },
    ],
    relatedSlugs: ["mcp-memory-server", "local-first-ai-memory", "origin-vs-basic-memory"],
    cta: {
      heading: "Make your AI work compound",
      body: "Origin turns decisions, lessons, handoffs, and project context into memory and wiki pages your agents can use later.",
    },
  },
  {
    slug: "mcp-memory-server",
    eyebrow: "Protocol",
    category: "Concepts",
    title: "MCP Memory Server: Persistent Memory for AI Tools",
    description:
      "An MCP memory server gives Claude Code, Cursor, Codex, and other MCP-compatible agents a shared place to store and recall durable context.",
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
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    audience: "Developers and AI power users connecting multiple MCP clients",
    heroBullets: [
      "MCP lets AI tools call external memory tools instead of relying only on chat history.",
      "A memory server can store, search, and package context across sessions.",
      "Origin adds local storage, curation, provenance, wiki pages, and setup workflows around the memory layer.",
    ],
    sections: [
      {
        heading: "What an MCP memory server does",
        body: [
          "The Model Context Protocol gives AI clients a standard way to call external tools. An MCP memory server exposes memory operations through that protocol: store, search, recall, and delete.",
          "Instead of pasting the same background into every prompt, the assistant can ask the memory server for relevant context when it needs it.",
        ],
      },
      {
        heading: "Why MCP is useful for memory",
        body: [
          "Memory is more useful when it is not trapped inside one interface. Claude Code, Claude Desktop, Cursor, Codex, Gemini CLI, and other MCP clients can participate in the same workflow.",
          "That makes MCP a natural boundary for persistent AI memory. The AI tool handles the conversation. The memory server handles durable context.",
        ],
      },
      {
        heading: "Local vs hosted memory servers",
        body: [
          "Hosted memory servers are easy to start, but they require sending memory to someone else's infrastructure. Local memory servers take more care, but they keep private project context, preferences, and decisions under your control.",
          "Origin is built around the local-first path. The daemon runs on your machine, owns the database, and serves memory to MCP clients through Origin's MCP server.",
        ],
      },
      {
        heading: "How Origin fits",
        body: [
          "Origin is more than a bare MCP store. It is a local runtime and Claude Code plugin that carries work context forward, links related knowledge, detects contradictions, and keeps wiki pages and provenance attached.",
          "The MCP server is the bridge: AI tools read and write memory, while Origin keeps the broader work context visible, searchable, and locally owned.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Origin just an MCP memory server?",
        answer:
          "No. Origin includes an MCP server path, but the product also includes local storage, distill cycles, contradiction detection, provenance, search, and wiki pages.",
      },
      {
        question: "Can one MCP memory server work with multiple AI tools?",
        answer:
          "Yes, if those tools support MCP and are configured to use the same server. Origin is designed for that shared-memory workflow.",
      },
    ],
    relatedSlugs: ["claude-code-memory", "ai-work-memory", "origin-vs-claude-mem"],
    cta: {
      heading: "Give every agent the same memory",
      body: "Origin connects MCP-compatible tools to one local context layer instead of scattering decisions and lessons across chat silos.",
    },
  },
  {
    slug: "local-first-ai-memory",
    eyebrow: "Privacy",
    category: "Concepts",
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
    author: DEFAULT_AUTHOR,
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
          "Origin chooses local-first because the memory layer should be something you trust, not another opaque profile maintained by a platform.",
        ],
      },
      {
        heading: "How Origin keeps memory useful",
        body: [
          "Local-first does not mean inert. Origin combines vector search, full-text search, and a knowledge graph so assistants can retrieve the right work context without replaying everything.",
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
          "Origin is local-first on macOS Apple Silicon. The daemon and database run locally, and optional integrations may depend on the AI tools you connect.",
      },
    ],
    relatedSlugs: ["ai-work-memory", "mcp-memory-server", "markdown-local-index-ai-memory"],
    cta: {
      heading: "Keep your context where your work lives",
      body: "Origin gives AI tools useful memory without making your accumulated work context cloud-first by default.",
    },
  },
  {
    slug: "claude-code-memory",
    eyebrow: "Developer workflow",
    category: "Workflows",
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
    author: DEFAULT_AUTHOR,
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
          "Origin exposes memory through its MCP server. Claude Code can write what it learns and recall relevant project context later. The same work context can also be available to Cursor, Codex, Claude Desktop, Gemini CLI, and other MCP clients when configured.",
          "That makes Origin a shared local layer for AI-assisted development rather than a single-client note file.",
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
    relatedSlugs: ["mcp-memory-server", "ai-agent-handoff-loop", "origin-vs-claude-mem"],
    cta: {
      heading: "Stop re-explaining the same codebase",
      body: "Origin helps Claude Code and other coding agents carry project knowledge across sessions.",
    },
  },
  {
    slug: "origin-vs-basic-memory",
    eyebrow: "Comparison",
    category: "Comparisons",
    title: "Origin vs Basic Memory: Local AI Work Memory vs Markdown Knowledge Base",
    description:
      "Compare Origin and Basic Memory across Markdown, MCP, local-first control, workflow fit, and how each product helps AI tools use durable context.",
    metaTitle: "Origin vs Basic Memory | AI Memory Comparison",
    metaDescription:
      "Compare Origin and Basic Memory for local AI work memory, Markdown knowledge bases, MCP workflows, human control, and long-running AI sessions.",
    keywords: [
      "Origin vs Basic Memory",
      "Basic Memory alternative",
      "AI memory markdown",
      "MCP memory knowledge base",
      "local AI work memory",
    ],
    updatedAt,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    audience: "People choosing a memory layer for AI-assisted work",
    heroBullets: [
      "Basic Memory is strongest as a Markdown-centered knowledge base with AI access.",
      "Origin is designed around the AI work loop: sessions, handoffs, distillation, provenance, and shared MCP memory.",
      "Both value human-readable memory; the right fit depends on whether you want a knowledge base or a work-session memory layer.",
    ],
    officialReferences: [
      {
        label: "Basic Memory documentation",
        href: "https://docs.basicmemory.com/",
      },
    ],
    sections: [
      {
        heading: "Short answer",
        body: [
          "Choose Basic Memory if you want a Markdown-first knowledge base that humans and AI can both read and update.",
          "Choose Origin if your main problem is making AI work carry across sessions, tools, projects, and weeks without turning memory into a black box.",
        ],
      },
      {
        heading: "What Basic Memory emphasizes",
        body: [
          "Basic Memory presents itself around readable Markdown files, semantic structure, a knowledge graph, MCP access, and a web editor. That is a strong fit for people who want a knowledge base that AI can work with.",
          "The center of gravity is the knowledge base: notes, links, entities, and human-readable project knowledge.",
        ],
      },
      {
        heading: "What Origin emphasizes",
        body: [
          "Origin starts from the AI work session. It captures decisions, lessons, gotchas, handoffs, and project context, then refines them between sessions through deduplication, linking, wiki page distillation, and provenance.",
          "Markdown remains the human-readable record. The local database is the index and retrieval layer, not the only place where meaning lives.",
        ],
      },
      {
        heading: "How to decide",
        body: [
          "If you mainly want a persistent Markdown knowledge base with AI access, Basic Memory may fit naturally. If you want a local memory loop for coding agents and MCP clients, Origin is more directly shaped around that workflow.",
          "The practical question is not which product has the word memory. It is whether your bottleneck is maintaining a knowledge base or carrying work context from one AI session into the next.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Basic Memory a competitor to Origin?",
        answer:
          "They overlap around AI-readable memory and Markdown, but the product shapes differ. Basic Memory is closer to a Markdown knowledge base; Origin is closer to a local AI work memory loop.",
      },
      {
        question: "Can someone use both?",
        answer:
          "Potentially, yes. The overlap means many people will choose one primary memory layer, but a Markdown knowledge base and an AI session memory layer can complement each other in some workflows.",
      },
    ],
    relatedSlugs: ["markdown-local-index-ai-memory", "ai-work-memory", "mcp-memory-server"],
    cta: {
      heading: "Try the AI work memory loop",
      body: "Origin is built for sessions, handoffs, provenance, and local retrieval across MCP-compatible AI tools.",
    },
  },
  {
    slug: "origin-vs-claude-mem",
    eyebrow: "Comparison",
    category: "Comparisons",
    title: "Origin vs claude-mem: Which Claude Memory Workflow Fits Your Work?",
    description:
      "Compare Origin and claude-mem for Claude Code memory, observer-style capture, MCP access, local control, and work that spans tools.",
    metaTitle: "Origin vs claude-mem | Claude Memory Comparison",
    metaDescription:
      "Compare Origin and claude-mem for Claude Code memory workflows, observer capture, MCP memory, local control, and cross-tool AI work context.",
    keywords: [
      "Origin vs claude-mem",
      "claude-mem alternative",
      "Claude Code memory",
      "Claude memory workflow",
      "AI work memory",
    ],
    updatedAt,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    audience: "Claude Code users choosing a memory workflow",
    heroBullets: [
      "claude-mem focuses on automatically observing Claude Code sessions and extracting useful context.",
      "Origin focuses on a shared local memory layer for AI work across Claude Code and other MCP clients.",
      "Both aim to reduce repeated context, but they choose different centers of gravity.",
    ],
    officialReferences: [
      {
        label: "claude-mem official website",
        href: "https://claude-mem.ai/",
      },
    ],
    sections: [
      {
        heading: "Short answer",
        body: [
          "Choose claude-mem if your primary need is an observer-style memory workflow tightly centered on Claude Code sessions.",
          "Choose Origin if you want a local-first memory layer that can serve Claude Code, Cursor, Codex, Claude Desktop, Gemini CLI, and other MCP-compatible tools.",
        ],
      },
      {
        heading: "What claude-mem emphasizes",
        body: [
          "claude-mem presents itself as a memory sidekick for Claude Code. Its core idea is watching work happen, capturing decisions and context, and retrieving that context later with useful scoping.",
          "That is compelling when the main product surface is Claude Code and the desired experience is automatic memory capture around that tool.",
        ],
      },
      {
        heading: "What Origin emphasizes",
        body: [
          "Origin treats memory as a local layer for AI work, not a single-client feature. Claude Code is important, but Origin also works through MCP so other clients can share the same context.",
          "Origin's workflow includes handoffs, background distillation, wiki pages, Markdown records, local indexes, and provenance attached to durable memories.",
        ],
      },
      {
        heading: "How to decide",
        body: [
          "If you live entirely in Claude Code and want an observer-style assistant for that environment, claude-mem is directly aimed at that habit.",
          "If your work moves across coding agents, chat tools, projects, and sessions, Origin is designed to make the memory layer portable across those surfaces.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Origin only for Claude Code?",
        answer:
          "No. Origin ships a Claude Code plugin, but it also exposes memory through MCP so other compatible tools can use the same local memory layer.",
      },
      {
        question: "Is claude-mem more automatic than Origin?",
        answer:
          "claude-mem is framed around observer-style capture for Claude Code. Origin has capture and distill cycles, but it emphasizes inspectable memory, handoffs, provenance, and cross-tool use.",
      },
    ],
    relatedSlugs: ["claude-code-memory", "mcp-memory-server", "ai-agent-handoff-loop"],
    cta: {
      heading: "Carry Claude Code context beyond one session",
      body: "Origin helps Claude Code and other MCP clients use the same local work memory.",
    },
  },
  {
    slug: "origin-vs-superlocal-memory",
    eyebrow: "Comparison",
    category: "Comparisons",
    title: "Origin vs Superlocal Memory: Local-First AI Memory for Work That Spans Tools",
    description:
      "Compare Origin and Superlocal Memory across local-first memory, retrieval quality, workflow design, integrations, and trust.",
    metaTitle: "Origin vs Superlocal Memory | Local AI Memory",
    metaDescription:
      "Compare Origin and Superlocal Memory for local-first AI memory, retrieval quality, AI coding workflows, MCP clients, and durable context.",
    keywords: [
      "Origin vs Superlocal Memory",
      "Superlocal Memory alternative",
      "local-first AI memory",
      "AI memory reliability",
      "AI coding memory",
    ],
    updatedAt,
    author: DEFAULT_AUTHOR,
    readingTime: "6 min read",
    audience: "Developers evaluating local-first memory for AI coding tools",
    heroBullets: [
      "Superlocal Memory emphasizes AI reliability engineering, local-first retrieval, IDE integrations, and benchmark-backed memory quality.",
      "Origin emphasizes the AI work loop: capture, handoff, distill, retrieve, and keep Markdown records inspectable.",
      "The best fit depends on whether you want a research-heavy reliability layer or a product workflow for compounding AI work.",
    ],
    officialReferences: [
      {
        label: "Superlocal Memory official website",
        href: "https://www.superlocalmemory.com/",
      },
    ],
    sections: [
      {
        heading: "Short answer",
        body: [
          "Choose Superlocal Memory if its reliability-engineering framing, modes, benchmark positioning, and IDE integration story match your workflow.",
          "Choose Origin if you want local-first memory centered on sessions, handoffs, human-readable records, MCP clients, and background distillation.",
        ],
      },
      {
        heading: "What Superlocal Memory emphasizes",
        body: [
          "Superlocal Memory presents itself as memory for AI reliability engineering. Its public positioning emphasizes local-first retrieval, memory modes, IDE integrations, and benchmark-oriented claims.",
          "That makes the product feel oriented toward people evaluating memory as a reliability system for AI coding workflows.",
        ],
      },
      {
        heading: "What Origin emphasizes",
        body: [
          "Origin focuses on the loop around real AI work: sessions start, work happens, handoffs are written, memory is distilled, and the next session receives relevant context.",
          "The design keeps Markdown as the human-readable record while the local database provides search indexes, graph context, and hybrid retrieval.",
        ],
      },
      {
        heading: "How to decide",
        body: [
          "If you want a reliability-oriented product with its own memory modes and integration claims, Superlocal Memory may be the natural thing to inspect.",
          "If you want the memory layer to feel like a transparent local record of your work across MCP-compatible tools, Origin is the closer fit.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do Origin and Superlocal Memory solve the same problem?",
        answer:
          "They overlap around local-first AI memory and retrieval for coding workflows. The difference is framing: Superlocal Memory emphasizes reliability engineering, while Origin emphasizes the AI work loop and transparent local records.",
      },
      {
        question: "Why does Origin talk about Markdown and indexes?",
        answer:
          "Origin keeps human-readable artifacts in Markdown and uses the local database for retrieval indexes. That makes memory easier to inspect while still giving agents fast search.",
      },
    ],
    relatedSlugs: ["local-first-ai-memory", "markdown-local-index-ai-memory", "ai-agent-handoff-loop"],
    cta: {
      heading: "Build memory around the work loop",
      body: "Origin keeps AI work context local, inspectable, and available to MCP-compatible tools.",
    },
  },
  {
    slug: "markdown-local-index-ai-memory",
    eyebrow: "Architecture",
    category: "Concepts",
    title: "Why Origin Uses Markdown plus a Local Index",
    description:
      "Origin stores human-readable Markdown records and uses a local database as the retrieval index, so AI memory stays inspectable and useful.",
    metaTitle: "Markdown plus Local Index for AI Memory | Origin",
    metaDescription:
      "Learn why Origin combines human-readable Markdown with a local retrieval index instead of hiding AI memory inside an opaque database.",
    keywords: [
      "Markdown AI memory",
      "local index AI memory",
      "AI memory database",
      "human-readable AI memory",
      "transparent AI memory",
    ],
    updatedAt,
    author: DEFAULT_AUTHOR,
    readingTime: "5 min read",
    audience: "People who want AI memory they can inspect and trust",
    heroBullets: [
      "Markdown is the durable record people can read, edit, export, and review.",
      "The database stores retrieval indexes, graph structure, and search metadata.",
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
        heading: "Markdown is the record",
        body: [
          "Origin keeps memory artifacts in Markdown so people can open them, read them, correct them, export them, and reason about them without a special UI.",
          "That does not mean Markdown has to be the only system. It means the human-readable artifact remains the source people can trust.",
        ],
      },
      {
        heading: "The local database is the index",
        body: [
          "Agents still need fast retrieval. Origin uses a local database for vector search, full-text search, graph context, provenance, and other metadata that make memories useful during an AI session.",
          "The database helps find the right context. It should not be the only place where meaning is locked away.",
        ],
      },
      {
        heading: "Why the split matters",
        body: [
          "The Markdown-plus-index design gives both sides what they need: humans get control and readability, while agents get retrieval speed and context packaging.",
          "That is the basis for Origin's trust story. Memory can be powerful without becoming invisible.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why not store everything only in Markdown?",
        answer:
          "Markdown is excellent for human-readable records, but agents need indexes for fast semantic and full-text retrieval. Origin uses both.",
      },
      {
        question: "Why not store everything only in a database?",
        answer:
          "A database-only memory layer can become opaque. Origin keeps readable artifacts available so people can inspect and correct what AI tools rely on.",
      },
    ],
    relatedSlugs: ["local-first-ai-memory", "origin-vs-basic-memory", "ai-work-memory"],
    cta: {
      heading: "Keep memory readable and searchable",
      body: "Origin pairs Markdown records with a local retrieval index so memory stays useful to agents and visible to people.",
    },
  },
  {
    slug: "ai-agent-handoff-loop",
    eyebrow: "Workflow",
    category: "Workflows",
    title: "The AI Agent Handoff Loop: How Work Carries Across Sessions",
    description:
      "A practical model for carrying decisions, lessons, gotchas, and next steps from one AI work session into the next.",
    metaTitle: "AI Agent Handoff Loop | Origin",
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
          "Origin follows a simple rhythm: load context when a session starts, capture durable knowledge during work, write a handoff when the session ends, refine memory between sessions, and retrieve the right context next time.",
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
        heading: "How Origin supports it",
        body: [
          "Origin gives agents a place to save the durable parts of the session and a way to recall them through MCP later.",
          "Between sessions, Origin deduplicates repeat facts, links related ideas, distills wiki pages, and keeps provenance attached so the memory gets better instead of merely larger.",
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
      body: "Origin makes handoffs, decisions, and project context available when the next AI session begins.",
    },
  },
];

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
