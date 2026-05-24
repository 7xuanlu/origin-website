export const SITE_URL = "https://useorigin.app";
export const DEFAULT_AUTHOR = "Qi-Xuan Lu";
export const DEFAULT_AUTHOR_URL = "https://github.com/7xuanlu";
export const DEFAULT_AUTHOR_SAME_AS = ["https://github.com/7xuanlu"];

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

export type ComparisonRow = {
  dimension: string;
  origin: string;
  competitor: string;
};

export type ComparisonTable = {
  competitorName: string;
  rows: ComparisonRow[];
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
  comparisonTable?: ComparisonTable;
  faqs: LearnArticleFaq[];
  relatedSlugs: string[];
  officialReferences?: OfficialReference[];
  cta: {
    heading: string;
    body: string;
  };
};

const updatedAt = "2026-05-24";

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
      "This page reflects Basic Memory's public docs and Origin v0.6.1 as of 2026-05-24. If something has shifted on either side, please open an issue.",
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
      {
        heading: "How the storage models differ in practice",
        body: [
          "Basic Memory keeps your notes as Markdown files in a vault. When the AI reads context, it reads the file content; when a human edits a note, the file changes; the vault is the source.",
          "Origin keeps notes as Markdown under `~/.origin/` for human reading, and the daemon also indexes them in a libSQL store for retrieval. Every write becomes a git commit in `~/.origin/.git/`, so `git log path/to/memory.md` shows the full history of a single fact.",
          "The split matters at two scales. Search: a five-thousand-memory store needs vector plus FTS retrieval to answer 'what did I decide about token budgets last sprint' in under a second; Markdown-only search degrades fast past a few thousand notes. Audit: when an AI references a memory, you usually want the commit that created the claim, not just the current file content.",
        ],
        bullets: [
          "Basic Memory: vault is the source. AI reads and writes Markdown directly.",
          "Origin: libSQL is the retrieval source, Markdown is the human projection. Daemon writes both atomically.",
          "Origin git history is per-write, not per-edit-session. Capture and distill cycles each leave a traceable commit.",
        ],
      },
      {
        heading: "A concrete walkthrough: distilling a week of sessions",
        body: [
          "Here is what a week with Origin looks like in my own work. Monday I capture three decisions inside Claude Code via the MCP `/capture` tool. Tuesday two more land from a Cursor session. Wednesday I run `/handoff` at the end of the day, and the daemon pulls the week's captures into a distill cycle. The result is a wiki page that quotes the original captures with mandatory source IDs.",
          "Friday I open the projected Markdown at `~/.origin/pages/auth.md`. The page reads like a coherent doc, not a chat log. Each claim has a source comment that links back to the originating capture commit. The next AI session that asks 'what did we decide about retry strategy' gets the distilled answer, not five overlapping captures the model has to reconcile on the fly.",
          "Basic Memory's analog would be writing the wiki page myself, or asking the AI to draft it inside the vault. That works fine for a knowledge base. It is not a work-loop optimization, and the difference compounds across months.",
        ],
      },
      {
        heading: "When Basic Memory is the better call",
        body: [
          "I want to be specific about this. If your problem is 'I have hundreds of Markdown notes and I want AI to read and write to them naturally,' Basic Memory is closer to the shape of your problem. The vault is the product. AI is a citizen of the vault.",
          "If your problem is 'AI conversations keep losing context across sessions and tools,' Origin is closer. The work session is the product. Markdown is a projection for human readability.",
          "Both can run in parallel. The MCP layer does not care if two memory servers are registered. I have tested this; the practical limit is the human overhead of remembering which content belongs in which store. Most people end up picking one as primary within a couple of weeks.",
        ],
      },
      {
        heading: "Migration shape, if you decide to switch",
        body: [
          "Importing a Basic Memory vault into Origin: the daemon has an Obsidian-style importer at `origin import vault <path>` that reads Markdown files, chunks them, embeds them, and writes them as memories with `kind: imported`. Wikilinks are preserved as graph edges between entities. The import is non-destructive; nothing in the original vault is moved or deleted.",
          "Going the other way is simpler. Origin's projected Markdown under `~/.origin/` is already a vault structure. Point Obsidian or Basic Memory at it and they read it as a knowledge base. You lose the live distill cycle, but the static record is portable, and that is a feature: your memory does not get locked inside a product if the product disappears.",
        ],
      },
    ],
    comparisonTable: {
      competitorName: "Basic Memory",
      rows: [
        {
          dimension: "Center of gravity",
          origin:
            "AI work session loop: capture, handoff, distill, recall across MCP clients.",
          competitor:
            "Markdown knowledge base humans and AI both read and edit.",
        },
        {
          dimension: "Storage",
          origin:
            "Local libSQL + Markdown projection in ~/.origin/, every write is a git commit in ~/.origin/.git/.",
          competitor: "Markdown files in a local Obsidian-style vault.",
        },
        {
          dimension: "Retrieval",
          origin:
            "Hybrid: vector (BGE-Base-EN-v1.5-Q 768-dim) + FTS5 + reciprocal-rank fusion + knowledge-graph neighbors. 88% Recall@5 on LongMemEval (oracle, 500 Q), 67% on LoCoMo.",
          competitor:
            "Semantic + FTS over Markdown notes; emphasis on note linking, not benchmark retrieval.",
        },
        {
          dimension: "Provenance",
          origin:
            "Mandatory source_memory_ids on every distilled page. Daemon rejects pages with no source (HTTP 422). Pages refresh as new memories arrive without losing the citation chain.",
          competitor:
            "Wikilinks between notes; provenance is whatever the author writes by hand.",
        },
        {
          dimension: "Versioning",
          origin:
            "Real git in ~/.origin/.git/. git log, git checkout, branch, blame.",
          competitor:
            "File mtime; bring-your-own git if you want history.",
        },
        {
          dimension: "License",
          origin: "Apache-2.0 daemon, CLI, MCP server.",
          competitor: "AGPL-3.0 (Basic Memory open-source repo).",
        },
      ],
    },
    faqs: [
      {
        question: "Is Basic Memory a competitor to Origin?",
        answer:
          "They overlap around AI-readable memory and Markdown, but the product shapes differ. Basic Memory is closer to a Markdown knowledge base; Origin is closer to a local AI work memory loop.",
      },
      {
        question: "Can someone use both?",
        answer:
          "Yes, through MCP. Each registers as a distinct memory server with the AI client. The friction is human: you decide which one owns which kind of content. Most people pick one as primary within a few weeks.",
      },
      {
        question: "Does Origin work without the daemon running?",
        answer:
          "Reads of the projected Markdown under `~/.origin/` work without the daemon since the files are plain text. Anything that needs retrieval, capture, or distillation needs the daemon process. I run it as a launchd user service on macOS so I never think about it; the equivalents on Linux (systemd user unit) and Windows (Task Scheduler ONLOGON) ship in v0.6.1.",
      },
      {
        question: "How does Origin handle wikilinks compared to Basic Memory?",
        answer:
          "Origin extracts wikilinks during capture and creates explicit graph edges in the knowledge-graph layer, alongside the Markdown link. That lets hybrid retrieval traverse neighbors at query time. Basic Memory treats wikilinks primarily as Markdown links between notes.",
      },
      {
        question: "How fresh is this comparison?",
        answer:
          "Reflects Basic Memory's public docs and Origin v0.6.1 as of 2026-05-24. If something material changes on either side, please open an issue on github.com/7xuanlu/origin and I will update.",
      },
    ],
    relatedSlugs: [
      "origin-vs-claude-mem",
      "origin-vs-superlocal-memory",
      "markdown-local-index-ai-memory",
      "ai-work-memory",
      "mcp-memory-server",
      "local-first-ai-memory",
    ],
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
      "Both products are early. This page covers the claude-mem npm package and Origin v0.6.1 as of 2026-05-24.",
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
      {
        heading: "What 'observer mode' means in practice",
        body: [
          "claude-mem watches your Claude Code session and extracts memorable context without you naming it. The promise is low friction: keep working, memory accumulates on its own.",
          "Two trade-offs show up over weeks of use. First, false positives: an observer cannot reliably tell which 'decision' is durable versus which is the start of an idea you will revise an hour later. Second, attribution: when the AI later cites memory, you usually want to know whether it came from your considered handoff or from a sentence you typed while still figuring out the problem.",
          "Origin defaults to explicit capture for that reason. `/capture` is one keystroke during flow. `/handoff` at session end pulls every flagged item into a distill cycle. Background distillation still happens, and a periodic refinery phase rethinks older memories. The high-confidence layer is the one you marked. The model-guessed layer is clearly separated.",
        ],
      },
      {
        heading: "What happens at session end",
        body: [
          "claude-mem's session-end pattern, as documented, summarizes the Claude Code session into memory entries automatically. That summary lives in claude-mem's store and gets retrieved on the next session via MCP.",
          "Origin's session-end pattern is the `/handoff` flow. You write one to three sentences about what happened, what is blocked, and what is next. The daemon attaches that to your session captures, runs deduplication against existing memories, links related entities, and commits the new state to `~/.origin/.git/`. The next session starts with a handoff brief plus relevant prior context, not a chat-log summary.",
          "Both reduce repeated context across sessions. The difference is who decides what is worth carrying forward: the model (claude-mem) or you with model help (Origin).",
        ],
        bullets: [
          "claude-mem: automatic session summary, model picks what is durable.",
          "Origin: explicit `/capture` plus `/handoff`, human picks; background distill cycles supplement.",
          "Both expose recall via MCP. Origin also exposes `origin recall <id>` and the projected Markdown for direct human reading.",
        ],
      },
      {
        heading: "Cross-tool: Cursor, Codex, Claude Desktop, Gemini CLI",
        body: [
          "claude-mem's positioning is Claude Code first. MCP exposure exists so other clients can read the store, but the workflow shape (observer of Claude Code sessions) is the product.",
          "Origin's positioning is MCP first, Claude Code as one of many clients. One daemon at `127.0.0.1:7878` serves any MCP-compatible runtime. In my own work I switch between Cursor for refactors, Claude Code for greenfield, and Codex for shell-heavy tasks; the memory is the same memory.",
          "If you live 100% inside Claude Code, this difference is theoretical. If you context-switch between tools across a typical week, it is the difference between one memory layer and three disjoint ones.",
        ],
      },
      {
        heading: "When claude-mem is the better call",
        body: [
          "If your AI work is entirely inside Claude Code, you want zero capture friction, and you are comfortable letting an observer pick what is memorable, claude-mem is shaped exactly for that. Single-tool by design, not by oversight.",
          "If you want explicit human control over what enters memory, multiple AI clients sharing one memory layer, or git-versioned audit on every write, those are not claude-mem's headline features. Use Origin.",
          "Cost: claude-mem ships as an npm package under MIT. Origin's daemon, CLI, and MCP server are Apache-2.0. Both are free to self-host. The optional Origin desktop app lives in a separate repo under AGPL-3.0 if you want a GUI on top.",
        ],
      },
    ],
    comparisonTable: {
      competitorName: "claude-mem",
      rows: [
        {
          dimension: "Center of gravity",
          origin:
            "Local memory layer for AI work across MCP clients: Claude Code, Cursor, Codex, Claude Desktop, VS Code, Gemini CLI.",
          competitor:
            "Observer-style memory assistant centered on Claude Code sessions.",
        },
        {
          dimension: "Capture mode",
          origin:
            "Explicit /capture in flow, /handoff at session end, plus background distill cycles. Low-confidence and contradicting captures surface for review.",
          competitor:
            "Automatic observer of Claude Code sessions; less explicit human control over what enters memory.",
        },
        {
          dimension: "Retrieval",
          origin:
            "Hybrid retrieval (vector + FTS5 + RRF + graph). 88% Recall@5 on LongMemEval, 67% on LoCoMo. ~168 tokens per recall query.",
          competitor:
            "Semantic recall via MCP scoped to past Claude Code sessions; no published benchmark.",
        },
        {
          dimension: "Cross-tool reach",
          origin:
            "One daemon serves any MCP client. Same memory across coding agents, chat tools, and CLI runtimes.",
          competitor:
            "Claude Code first. MCP exposure exists, but the workflow is tuned for the Claude Code surface.",
        },
        {
          dimension: "Provenance + versioning",
          origin:
            "Mandatory source IDs on distilled pages; every memory write is a git commit in ~/.origin/.git/.",
          competitor:
            "Session-attributed captures; no per-write git history by default.",
        },
        {
          dimension: "License",
          origin: "Apache-2.0 daemon, CLI, MCP server.",
          competitor: "MIT (per claude-mem npm package).",
        },
      ],
    },
    faqs: [
      {
        question: "Is Origin only for Claude Code?",
        answer:
          "No. Origin ships a Claude Code plugin, but it also exposes memory through MCP so other compatible tools can use the same local memory layer. Cursor, Codex, Claude Desktop, and Gemini CLI all work out of the box.",
      },
      {
        question: "Is claude-mem more automatic than Origin?",
        answer:
          "claude-mem is framed around observer-style capture for Claude Code. Origin has capture and distill cycles, but it emphasizes inspectable memory, handoffs, provenance, and cross-tool use. Less automatic at capture time, more controllable at recall time.",
      },
      {
        question: "Can I migrate from claude-mem to Origin?",
        answer:
          "There is no automated importer at the moment. claude-mem's memories are accessible through MCP, so a one-off script that reads them and POSTs to Origin's `/api/ingest/memory` endpoint would do the job. If demand picks up I would ship an importer. So far, manual capture during normal work has been faster than building one.",
      },
      {
        question: "Is automatic capture really lower-friction in the long run?",
        answer:
          "Friction at capture time is one form. Friction at recall time is another: a store filled with low-signal observations is one the AI has to wade through. Explicit capture front-loads the work; observer mode back-loads it. Origin uses explicit capture plus background distillation as the balance.",
      },
      {
        question: "Does Origin watch my Claude Code session in the background?",
        answer:
          "Not by default. There is no observer process. The daemon sees only what you capture or what you import. Session-level observation could be a build target later, but it is not a current feature, and the lack of it is intentional.",
      },
    ],
    relatedSlugs: [
      "claude-code-memory",
      "mcp-memory-server",
      "ai-agent-handoff-loop",
      "origin-vs-basic-memory",
      "origin-vs-superlocal-memory",
      "ai-work-memory",
    ],
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
      "Numbers, links, and product framing are accurate to 2026-05-24. Check both project pages for newer releases before deciding.",
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
      {
        heading: "Reading the Superlocal LoCoMo number honestly",
        body: [
          "Superlocal Memory reports ~74.8% on LoCoMo in their zero-LLM (pure-math) retrieval configuration. Origin's published number on LoCoMo is 67% Recall@5. That is a 7.8-point gap on that specific benchmark, and it is real.",
          "Two things to read alongside it. First, benchmark mix: LongMemEval (LME) is a more recent and more rigorous evaluation, especially for time-aware questions and contradiction handling. Origin reports 88% Recall@5 on LME oracle, 500 questions. Superlocal Memory has not published LME numbers at the time of writing. The leaderboard story is incomplete without both.",
          "Second, configuration: 'zero-LLM' means retrieval only, no answer generation. Origin's number is also retrieval-only, but Origin's product is designed to feed memories into an LLM for answer composition, not to be a SOTA retrieval algorithm in isolation. Different products optimize for different downstream tasks.",
          "If LoCoMo top score is the deciding factor for you, Superlocal currently wins on that benchmark. If the question is 'which tool helps me carry AI work across sessions,' the benchmark is one input, not the answer.",
        ],
      },
      {
        heading: "Where Origin focuses instead of leaderboards",
        body: [
          "I picked LME oracle as Origin's primary benchmark because the workload matches what actually breaks AI sessions: multi-turn conversations with implicit time references, contradictions across turns, references to facts established weeks ago. LoCoMo is closer to a corpus-search problem and easier to game with pure-math retrieval.",
          "The product gaps I notice in daily use are not retrieval ceiling. They are things like: did the AI capture the decision when I made it, is the wiki page distilled cleanly, can I open `~/.origin/pages/auth.md` and read it as prose, can I `git blame` a fact, does the same memory show up in Cursor and Claude Code.",
          "Those are workflow features, not benchmark features. Origin trades 7 points on LoCoMo for explicit capture, MCP-first cross-tool reach, projected Markdown, git-versioned writes, and mandatory provenance. If those things matter to your work, the trade is worth it. If they do not, look at Superlocal.",
        ],
      },
      {
        heading: "The 10-second inspectability test",
        body: [
          "Try this on any memory layer you are evaluating, including Origin. Open the tool. Find one memory the AI stored about you in the last week. Now answer five questions in under 10 seconds: can you see the verbatim text, can you see when it was stored, can you see what generated it, can you see what changes have been made to it since, can you delete it without an admin panel.",
          "Origin scores high on this test by design. Every memory has a Markdown file under `~/.origin/`. Every write is a commit in `~/.origin/.git/`. `origin recall <id>` shows verbatim text. Deletion is `origin forget <id>`, or `rm` plus a daemon resync.",
          "Superlocal Memory's internals are not public to me at the time of writing. The reliability-engineering framing suggests correctness matters to them, but the public materials do not commit to the same level of human-readable artifact layer. Run the test yourself before deciding.",
        ],
        bullets: [
          "Verbatim text visible? `origin recall <id>` in Origin.",
          "When was it stored? Git commit timestamp in Origin.",
          "What generated it? Source IDs on distilled pages, mandatory.",
          "Change history? `git log path/to/memory.md` in Origin.",
          "Delete without an admin panel? `origin forget <id>` or `rm` in Origin.",
        ],
      },
      {
        heading: "How I would actually evaluate both",
        body: [
          "If I were picking a memory layer from scratch today, I would run a two-week parallel trial. Week one: install both, point an MCP-capable AI client at each, and use them for real work. No synthesized traffic. Real captures only.",
          "End of week one, run three queries against each: 'what did I decide about X last Monday,' 'who did I have a conversation with about Y,' 'what is the current status of Z.' Compare not just accuracy, but readability of the response and traceability of where it came from.",
          "Week two, deliberately try to break each one. Introduce a contradiction by capturing two conflicting facts on consecutive days. Use a different MCP client. Kill the daemon mid-session and restart it. The product that recovers cleanly and surfaces the contradiction is the one I would keep.",
          "I am biased; I built Origin. This trial shape will surface real differences faster than reading either product page, including this one.",
        ],
      },
    ],
    comparisonTable: {
      competitorName: "Superlocal Memory",
      rows: [
        {
          dimension: "Center of gravity",
          origin:
            "Local AI work loop: sessions, handoffs, distilled wiki pages, provenance, Markdown records.",
          competitor:
            "Memory for AI reliability engineering. Modes, IDE integrations, benchmark-led positioning.",
        },
        {
          dimension: "Retrieval",
          origin:
            "Hybrid: vector (BGE-Base-EN-v1.5-Q) + FTS5 + reciprocal-rank fusion + knowledge-graph context. 88% Recall@5 on LongMemEval (oracle, 500 Q), 67% on LoCoMo.",
          competitor:
            "Pure-math retrieval emphasized in public materials. Reports ~74.8% on LoCoMo in their zero-LLM configuration, currently ahead of Origin on that specific benchmark.",
        },
        {
          dimension: "Human-readable records",
          origin:
            "Markdown projection under ~/.origin/, symlinkable into Obsidian; pages and session logs are plain text.",
          competitor:
            "Less emphasis on plain Markdown artifacts as the primary surface.",
        },
        {
          dimension: "Provenance + audit",
          origin:
            "Mandatory source_memory_ids; daemon returns HTTP 422 on empty source. Low-confidence captures and contradictions surface for review.",
          competitor:
            "Reliability-mode framing; specific provenance enforcement not publicly documented.",
        },
        {
          dimension: "Versioning",
          origin:
            "Every memory write is a git commit in ~/.origin/.git/. git log, git checkout, branch, blame.",
          competitor:
            "No public commitment to per-write git history.",
        },
        {
          dimension: "License + openness",
          origin:
            "Apache-2.0 daemon, CLI, MCP server. Repo: github.com/7xuanlu/origin.",
          competitor:
            "Closed-source positioning at time of writing; check the official site for current terms.",
        },
      ],
    },
    faqs: [
      {
        question: "Do Origin and Superlocal Memory solve the same problem?",
        answer:
          "They overlap around local-first AI memory and retrieval for coding workflows. The difference is framing: Superlocal Memory emphasizes reliability engineering, Origin emphasizes the AI work loop and transparent local records.",
      },
      {
        question: "Why does Origin talk about Markdown and indexes?",
        answer:
          "Origin keeps human-readable artifacts in Markdown and uses the local libSQL store for retrieval indexes. That makes memory easier to inspect (you can open the file in any editor) while still giving agents fast hybrid search.",
      },
      {
        question: "Why does Origin not lead with the LoCoMo number?",
        answer:
          "Because Origin is behind on it: 67% vs Superlocal's reported ~74.8% in their zero-LLM config. Leading with a benchmark Origin does not win is misleading. The 88% LME oracle number is the one I am willing to defend as primary. The LoCoMo number is published for honesty, not as a headline.",
      },
      {
        question: "Is Superlocal Memory open-source?",
        answer:
          "At the time of writing, the public positioning is closed-source. Check the official site for current licensing terms before deciding. Origin's daemon, CLI, and MCP server are Apache-2.0 with source on github.com/7xuanlu/origin.",
      },
      {
        question: "How often do these numbers get re-run?",
        answer:
          "Origin's eval harness lives under `crates/origin-core/src/eval/` and runs locally on demand against the same fixtures the published numbers use. Anyone can re-run them. I refresh the published number when a release changes it materially. Last refresh: v0.6.1 on 2026-05-24.",
      },
    ],
    relatedSlugs: [
      "local-first-ai-memory",
      "markdown-local-index-ai-memory",
      "ai-agent-handoff-loop",
      "origin-vs-basic-memory",
      "origin-vs-claude-mem",
      "ai-work-memory",
    ],
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
