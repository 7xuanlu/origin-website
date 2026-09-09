import type { CoreContent } from "./schema";

const claudeCommands = [
  "/plugin marketplace add 7xuanlu/claude-plugins",
  "/plugin install wenlan@7xuanlu",
  "/setup",
] as const;

export const enContent = {
  chrome: {
    status: "translated",
    sourceHash: null,
    content: {
      skipLinkLabel: "Skip to content",
      breadcrumbAriaLabel: "Breadcrumb",
    },
  },
  home: {
    status: "translated",
    sourceHash: null,
    content: {
      seo: {
        title: "Wenlan | LLM Wiki for AI Work",
        description:
          "Wenlan is a source-backed AI knowledge base and LLM wiki for AI work: organize documents and decisions into pages you can find, inspect, and review.",
      },
      nav: {
        schemaName: "Wenlan site navigation",
        brand: "Wenlan",
        githubAriaLabel: "Wenlan on GitHub",
        themeToggle: {
          lightLabel: "Switch to light theme",
          darkLabel: "Switch to dark theme",
        },
        links: [
          { id: "download", href: "/download", label: "Download" },
          { id: "docs", href: "/docs", label: "Docs" },
          { id: "learn", href: "/learn", label: "Learn" },
          { id: "about", href: "/about", label: "About" },
          { id: "github", href: "https://github.com/7xuanlu/wenlan", label: "GitHub" },
        ],
      },
      hero: {
        title: "Wenlan",
        description:
          "After setup, save useful decisions, build sourced Pages, and find them again through your configured AI tools.",
        primaryCta: { id: "download", href: "#download", label: "Download Wenlan" },
        secondaryCta: {
          id: "github",
          href: "https://github.com/7xuanlu/wenlan",
          label: "View on GitHub",
        },
        metaText: [
          { id: "agent-plugins", label: "Claude Code + Codex plugins" },
          { id: "chatgpt-mcp", label: "ChatGPT via remote MCP" },
          { id: "local-daemon", label: "Local daemon" },
        ],
        metaLinks: [
          {
            id: "llm-wiki",
            href: "/learn/distilled-wiki-pages-ai-memory",
            label: "LLM wiki guide",
          },
          {
            id: "ai-knowledge-base",
            href: "/learn/source-backed-wiki-pages-ai-work",
            label: "AI knowledge base guide",
          },
          {
            id: "ai-knowledge-base-tool",
            href: "/learn/choose-ai-knowledge-base-tool",
            label: "Choose an AI knowledge base tool",
          },
        ],
      },
      demo: {
        title: "Wenlan demo",
        playLabel: "Play Wenlan demo",
      },
      download: {
        eyebrow: "Download",
        title: "Download Wenlan for your system.",
        description:
          "Wenlan v0.18.3 ships a Windows x64 desktop build and a macOS Apple silicon DMG, plus headless runtime builds for Windows, macOS, and Linux.",
        stableLabel: "Stable",
        releaseNotesLabel: "Release notes",
        packageIncludesLabel: "CLI · daemon · MCP connector",
        recommendation: {
          label: "Recommended for this device",
          fallbackTitle: "Choose the right build",
          fallbackDescription:
            "We could not identify a supported desktop build in this browser.",
          fallbackActionLabel: "View all downloads",
          allDownloadsLabel: "All downloads and setup",
          architectureNote:
            "Check the operating system and architecture before downloading.",
        },
        platforms: [
          {
            id: "windows-desktop-x64",
            name: "Wenlan Desktop",
            architecture: "Windows · x64",
            description:
              "Install the desktop app with its bundled daemon, CLI, MCP connector, and runtime libraries. No WSL or Rust toolchain required.",
            actionLabel: "Download Windows desktop",
            packageIncludesLabel: "Desktop app · bundled runtime",
            guideLabel: "Open the desktop setup guide",
            setupSteps: [
              "Download and run the x64 setup executable.",
              "If Windows SmartScreen appears, choose More info, then Run anyway.",
              "Open Wenlan. The app starts its bundled daemon and offers to connect detected AI clients.",
              "Check the app status or run wenlan doctor to verify the local runtime.",
            ],
          },
          {
            id: "windows-x64",
            name: "Windows runtime",
            architecture: "x64 · headless",
            description:
              "A complete native archive with ONNX Runtime and the Vulkan loader for supported GPUs. No WSL or Rust toolchain required.",
            actionLabel: "Download Windows runtime",
            setupSteps: [
              "Download and extract the ZIP. Keep every included file together.",
              "Add the extracted directory to PATH.",
              "Open a new terminal and run wenlan doctor.",
            ],
          },
          {
            id: "macos-arm64",
            name: "Wenlan Desktop",
            architecture: "macOS · Apple silicon",
            description:
              "The fastest way to read Pages and inspect their sources.",
            actionLabel: "Download macOS desktop",
            packageIncludesLabel: "Desktop app · bundled runtime",
            guideLabel: "Open the safe installer guide",
            setupSteps: [
              "Download the DMG and drag Wenlan to Applications.",
              "Open Wenlan from Applications and verify that it connects to the local daemon.",
              "If installation fails, use the inspectable installer guide to verify the exact GitHub release.",
            ],
          },
          {
            id: "macos-runtime-arm64",
            name: "macOS runtime",
            architecture: "Apple silicon · headless",
            description: "CLI, daemon, and MCP connector with Metal support for local model paths.",
            actionLabel: "Download macOS runtime",
            setupSteps: [
              "Download and extract the TAR.GZ archive.",
              "Move the binaries to a directory on PATH.",
              "Run wenlan doctor to verify the local runtime.",
            ],
          },
          {
            id: "linux-x64",
            name: "Linux",
            architecture: "x64 · glibc",
            description: "Prebuilt runtime for common x86_64 Linux systems.",
            actionLabel: "Download Linux x64",
            setupSteps: [
              "Download and extract the TAR.GZ archive.",
              "Move the binaries to a directory on PATH.",
              "Run wenlan doctor to verify the local runtime.",
            ],
          },
          {
            id: "linux-arm64",
            name: "Linux",
            architecture: "ARM64 · glibc",
            description: "Prebuilt runtime for aarch64 Linux systems.",
            actionLabel: "Download Linux ARM64",
            setupSteps: [
              "Download and extract the TAR.GZ archive.",
              "Move the binaries to a directory on PATH.",
              "Run wenlan doctor to verify the local runtime.",
            ],
          },
        ],
        setup: {
          title: "Install and verify",
          description:
            "Use the guided setup or follow the exact steps for your platform.",
          command: "npx -y wenlan setup",
          guideLabel: "Open the setup guide",
        },
        page: {
          seo: {
            title: "Download Wenlan for Windows, macOS, and Linux",
            description:
              "Download the Wenlan desktop app for Windows x64 or macOS Apple silicon, or install the headless CLI, local daemon, and MCP connector for Windows, macOS, and Linux.",
          },
          breadcrumbs: {
            home: "Home",
            current: "Download",
          },
          eyebrow: "Wenlan runtime",
          title: "Download Wenlan",
          description:
            "Choose one published build, keep its files together, and verify the local runtime before connecting an AI tool.",
          buildsTitle: "Choose your build",
          buildsDescription:
            "The current release provides desktop builds for Windows x64 and macOS Apple silicon plus four native headless runtime archives.",
          verifyTitle: "Verify before you connect",
          verifyDescription:
            "Run the diagnostic after installation. It checks the local runtime and reports the next repair step.",
          releaseSourceLabel: "View release source",
          setupGuideLabel: "Read the full setup guide",
          getStartedLabel: "Continue to get started",
        },
      },
      useCases: {
        eyebrow: "Use cases",
        title: "LLM wiki for\ncode, clients,\nand research.",
        description:
          "Wenlan turns repo facts, client constraints, source trails, and study notes into source-cited pages agents can brief, recall, and hand off.",
        evidenceLabel: "Pages agents cite",
        outcomeLabel: "Citable page",
        actionsLabel: "Agent actions",
        index: {
          title: "Wenlan Wiki Index",
          activeViewLabel: "Active view",
          pagesTitle: "Pages agents cite",
          pagesLabel: "pages",
          sourcesLabel: "sources",
          statusLabel: "status",
          sourceBackedLabel: "Source-backed",
          citationLabel: "Agent citation",
          citingLabel: "Citing page",
        },
        scenarios: [
          {
            id: "dev-codebase",
            label: "Dev & codebase",
            railLabel: "Code",
            summary: "living engineering docs",
            lead: "Keep the codebase docs engineers actually update.",
            body: "Wenlan can turn repo facts into source-backed engineering Pages: architecture maps, runbooks, migration plans, integration notes, and debugging logs. Refresh behavior depends on your configured processing and source changes.",
            evidence: [
              {
                id: "architecture",
                label: "Architecture map",
                detail: "Service boundaries, data flow, ownership, runtime constraints, and diagrams that drift as code changes.",
              },
              {
                id: "failed-paths",
                label: "Runbook",
                detail: "How to reproduce, release, rollback, monitor, or operate a system without asking the last engineer.",
              },
              {
                id: "dependency-research",
                label: "Migration plan",
                detail: "Schema moves, API migrations, rollout phases, blocked paths, and cleanup tasks that span sessions.",
              },
              {
                id: "open-threads",
                label: "Integration note",
                detail: "Dependency quirks, version limits, adapter decisions, and upstream issues linked to source docs.",
              },
            ],
            outcome: "The next agent can open an engineering Page and inspect its sources.",
          },
          {
            id: "product-customers",
            label: "Product & client work",
            railLabel: "Client work",
            summary: "calls, constraints, proposals",
            lead: "Keep client context ready for the next proposal.",
            body: "Before the next proposal, product teams, consultants, and freelancers can recall the objection, client constraint, and tradeoff that changed the plan.",
            evidence: [
              {
                id: "customer-voice",
                label: "Client objection",
                detail: "Recurring needs and objections from interviews, support, and sales notes.",
              },
              {
                id: "client-constraints",
                label: "Client constraint",
                detail: "Brand, budget, approval, legal, or delivery limits for each client space.",
              },
              {
                id: "decision-rationale",
                label: "Proposal tradeoff",
                detail: "Why a roadmap, proposal, or pricing tradeoff won over alternatives.",
              },
              {
                id: "follow-up-threads",
                label: "Follow-up owner",
                detail: "Loose questions, promised next steps, and owners before the next meeting.",
              },
            ],
            outcome: "The next proposal starts with the client's objection, constraint, tradeoff, and owner already cited.",
          },
          {
            id: "research-writing",
            label: "Research & writing",
            railLabel: "Research",
            summary: "sources, cited pages, next outline",
            lead: "Turn research trails into cited wiki pages.",
            body: "After papers, docs, transcripts, and links pile up, the next draft starts from trusted quotes, stale claims, and a cited outline.",
            evidence: [
              {
                id: "trusted-sources",
                label: "Trusted quote",
                detail: "Papers, docs, transcripts, and links you already decided to trust.",
              },
              {
                id: "comparison-notes",
                label: "Comparison note",
                detail: "What changed between tools, claims, or standards, with the source trail intact.",
              },
              {
                id: "outline-decisions",
                label: "Next draft outline",
                detail: "The argument, section order, and open questions for the next draft.",
              },
              {
                id: "stale-claims",
                label: "Stale claim",
                detail: "Facts that need re-checking before they appear in public copy.",
              },
            ],
            outcome: "Writing resumes from a cited working page, not a pile of tabs.",
          },
          {
            id: "learning-study",
            label: "Learning & study",
            railLabel: "Learning",
            summary: "concepts, prerequisites, reviews",
            lead: "Turn study sessions into pages that teach the next one.",
            body: "Explanations that finally clicked become concept pages with prerequisites linked, so the next session reviews understanding instead of scrolling back through chat.",
            evidence: [
              {
                id: "concept-pages",
                label: "Concept page",
                detail: "The explanation that finally made sense, kept with the sources that earned it.",
              },
              {
                id: "prerequisite-links",
                label: "Prerequisite link",
                detail: "What each concept builds on, linked so gaps surface before they cost you.",
              },
              {
                id: "review-notes",
                label: "Review note",
                detail: "What you got wrong last time and the correction that fixed it.",
              },
              {
                id: "study-plan",
                label: "Study plan",
                detail: "What to tackle next, ordered by the prerequisites you already hold.",
              },
            ],
            outcome: "The next study session opens the concept page, not last week's chat scroll.",
          },
        ],
      },
      sections: {
        problem: {
          eyebrow: "The problem",
          title: "A new AI session can start cold.",
          body: "The work happened, but context may not carry over. Decisions, fixes, and project instincts can stay trapped in old chats instead of helping the next agent.",
          note: "A missing handoff can make the next conversation repeat the last one.",
        },
        solution: {
          eyebrow: "What Wenlan brings",
          title: "A handoff loop for AI work.",
          body: "After setup, Wenlan can capture decisions, lessons, and next steps as work happens, then make a handoff available when the next agent starts.",
          note: "The next conversation can start from the handoff instead of reconstructing the past.",
          visualLabels: {
            start: "START",
            capture: "CAPTURE",
            handoff: "HANDOFF",
            resume: "RESUME",
          },
        },
        memoryDistillery: {
          eyebrow: "Deliberate distillation",
          title: "Wenlan turns repeated context into an LLM wiki.",
          body: "Run /distill when repeated captures should become a readable, source-backed wiki page. Optional model or API-key paths can add background extraction and page refresh work.",
          note: "A configured next run can start from cited context, not transcript residue.",
          visualLabels: {
            merged: "MERGED",
            linked: "LINKED",
            refined: "REFINED",
          },
        },
        features: {
          eyebrow: "Knowledge pages",
          title: "The work becomes reusable pages.",
          body: "Cleaned decisions and lessons become durable pages instead of buried chat logs. They are organized enough for agents to use and concrete enough for humans to read.",
          note: "Your work stops being transcript history and starts becoming project knowledge.",
        },
        humanControl: {
          eyebrow: "Hybrid storage",
          title: "The daemon owns recall. Readable artifacts stay inspectable.",
          body: "Wenlan keeps raw captures in the local daemon store for retrieval, then projects pages, handoffs, and status files you can open, diff, and move.",
          note: "Agents recall from the daemon. You inspect the readable files.",
        },
        openSourceCta: {
          eyebrow: "Open source",
          title: "Open code. Make it yours.",
          body: "From the local runtime to the desktop app, you can inspect the code and build Wenlan yourself.",
          note: "Runtime and plugins: Apache-2.0. Desktop app: AGPL-3.0-only.",
          primaryCta: { id: "download", href: "#download", label: "Download Wenlan" },
          secondaryCta: {
            id: "github",
            href: "https://github.com/7xuanlu/wenlan",
            label: "View on GitHub",
          },
          waitlistHeading: "Subscribe to Wenlan release updates.",
          waitlist: {
            successMessage:
              "Your subscription details have been saved.",
            pendingLabel: "Saving...",
            submitLabel: "Subscribe",
            emailLabel: "Email address",
            purpose: "Used only for Wenlan release updates.",
            emailPlaceholder: "you@example.com",
            fallbackError: "Something went wrong. Please try again.",
            errors: {
              required: "Email address is required.",
              invalid: "Please enter a valid email address.",
              notConfigured: "Subscriptions are not available yet.",
              unknown: "Something went wrong. Please try again.",
            },
          },
        },
      },
      metrics: {
        eyebrow: "Hybrid retrieval, measured",
        title: "How much context does a query need?",
        description:
          "A fixed 500-question retrieval test compares full conversation replay with the context Wenlan retrieves.",
        headers: {
          surface: "Surface",
          scope: "Scope",
          result: "Result",
        },
        rows: [
          {
            id: "full-replay",
            surface: "Full replay",
            scope: "No retrieval",
            result: "4,505 tokens / query",
          },
          {
            id: "lme-oracle",
            surface: "LME_Oracle",
            scope: "CE-reranked, 500 Q",
            result: "168 tokens / query · 93.6% R@5 · 0.883 NDCG@10",
          },
          {
            id: "lme-s",
            surface: "LME_S",
            scope: "CE-reranked, N=90 deep-S",
            result: "168 tokens / query · 87.7% R@5 · 0.822 NDCG@10",
          },
        ],
        note:
          "Retrieval-only snapshots on fixed fixtures. LME_Oracle also records 0.857 MRR; LME_S records 0.815 MRR on 84 gradeable rows from the 90-question deep-S fixture. This is not a general time or token-saving guarantee and does not compare Wenlan with other tools. Token comparison is full replay vs retrieved context within this retrieval test.",
        link: {
          id: "harness",
          href: "https://github.com/7xuanlu/wenlan/tree/main/crates/wenlan-core/src/eval",
          label: "Run the harness yourself.",
        },
      },
      faqs: {
        eyebrow: "FAQ",
        title: "Common questions.",
        items: [
          {
            id: "what-is-wenlan",
            q: "What is Wenlan?",
            a: "Wenlan is a local AI knowledge base and LLM wiki. Connect your AI client to save decisions and find them again. Page generation needs a configured model or AI client. Inspect the supporting sources before relying on an answer.",
          },
          {
            id: "built-in-memory",
            q: "How is Wenlan different from built-in AI memory?",
            a: "Built-in memory behavior varies by tool. Compare export, sources, editing, and cross-client access in the tool you use. Wenlan keeps memory local and offers inspectable Pages with the source memory IDs used to make them.",
          },
          {
            id: "retrieval-quality",
            q: "What retrieval quality does Wenlan reach?",
            a: "Hybrid retrieval combines vector search (BGE-Base-EN-v1.5-Q, 768-dim), FTS5, reciprocal-rank fusion, knowledge-graph context, and the local BGE reranker. LME_Oracle is 93.6% Recall@5, 0.857 MRR, and 0.883 NDCG@10 on the 500-question snapshot. LME_S is 87.7% Recall@5, 0.815 MRR, and 0.822 NDCG@10 on the stratified N=90 deep-S snapshot. These fixture-specific scores do not establish correctness or prove every claim. The eval harness ships in the repo at crates/wenlan-core/src/eval/.",
          },
          {
            id: "privacy",
            q: "Is my data private?",
            a: "Yes. Wenlan runs on your machine and stores its database locally. No cloud sync or telemetry by default. Local memory setup works without a model or API key. On-device models or an Anthropic key are opt-in for automatic page distillation, recaps, and richer graph work.",
          },
          {
            id: "memory-mcp",
            q: "Is Wenlan just another memory MCP?",
            a: "No. The MCP server is the connector. Wenlan also includes the local daemon, manual /distill, optional model-backed extraction and Page work, local retrieval, source references, review surfaces, real git versioning for memory, Page, and session artifacts, and readable Markdown export paths.",
          },
          {
            id: "tools",
            q: "What AI tools work with Wenlan?",
            a: "Claude Code and Codex have plugin paths. Cursor, Claude Desktop, VS Code, Antigravity, and other supported local clients connect through Wenlan's MCP server. ChatGPT and Claude.ai connect through Streamable HTTP MCP, with Remote Access in the desktop app providing the guided path. Obsidian is a read-only source workflow, not an MCP client in this list. Remote Access has no authentication; anyone with the URL can access Wenlan, so stop Remote Access when unused.",
          },
          {
            id: "not-notes",
            q: "Is Wenlan a replacement for Notion or Obsidian?",
            a: "No. Wenlan is not a notes app. It can register Markdown, text, text-extractable PDF, folders, and an Obsidian vault as sources. Obsidian input is read-only and resyncs on demand; Wenlan's own Pages remain readable Markdown under ~/.wenlan/.",
          },
          {
            id: "setup",
            q: "How do I set it up?",
            a: "Install the runtime and connect the client first. Claude Code uses the marketplace plugin and /setup. Codex can run Wenlan through its plugin or through wenlan connect codex. Other local clients use wenlan connect <client>. ChatGPT and Claude.ai use the desktop app's Remote Access URL through Streamable HTTP MCP. Local capture and retrieval can work without a model or API key; automatic Page distillation and background processing require a configured on-device model or provider API key. The URL has no authentication, so treat it as a secret and stop Remote Access when unused.",
          },
          {
            id: "platforms",
            q: "Does Wenlan work on Windows or Linux?",
            a: "Yes. The current prebuilt daemon release covers macOS Apple Silicon, Linux (x86_64, aarch64; glibc), and Windows (x86_64). macOS Intel has source/dev paths but no current prebuilt macOS Intel runtime. Service registration uses launchd on macOS, systemd-user on Linux, and Task Scheduler (schtasks) on Windows.",
          },
          {
            id: "spaces",
            q: "Can I keep work and personal memory separate?",
            a: "Yes. Memories, pages, and recalls belong to a space (for example, work, personal, or client-X). Set the active space per shell with WENLAN_SPACE, or declare them in ~/.wenlan/spaces.toml. The auto-detector also picks a space from the current repo or workspace.",
          },
          {
            id: "free",
            q: "Is Wenlan free?",
            a: "Yes. Wenlan is open-source. The local runtime, CLI, MCP server, Claude Code plugin, and Codex plugin files in the Wenlan repo are Apache-2.0.",
          },
        ],
      },
      redesign: {
        hero: {
          eyebrow: "A living wiki for you and your AI",
          headline: { pre: "Your notes keep growing.", emphasis: "Still starting from scratch?", post: "" },
          description:
            "Wenlan turns documents, notes, and decisions into a source-backed wiki that evolves with your work. You and your AI can build on what you already know, not just find what you saved.",
          worksWithLabel: "Works with",
          worksWithNote: "Read from your Obsidian vault without changing your notes.",
        },
        pains: {
          "title": "Choose the knowledge workflow that fits.",
          "intro": "Compare more than features: see where you work day to day, what you can hand off, and which decisions remain yours.",
          "scopeNote": "Wenlan is also an LLM Wiki implementation. These approaches can work together.",
          "dimensions": [
            "How do you use it day to day?",
            "What upkeep happens automatically?",
            "When do I decide?"
          ],
          "detailsLabel": "How it works & sources",
          "helpLabel": "More background",
          "accessNote": "Wenlan first needs connected sources and a model, then an initial set of Pages. After that, use the desktop App, or continue with the plugin / CLI and local daemon.",
          "generations": [
            {
              "id": "wiki-graveyard",
              "name": "AI + files",
              "eyebrow": "Word · PDF · PPT · Markdown",
              "summary": "AI handles the files; Wenlan supplies the source tracking, Wiki upkeep, and revision review. Your work leaves more than another answer: a knowledge base maintained for later use.",
              "profileLabels": [
                "Work directly with files and answers",
                "Knowledge upkeep needs additional logic",
                "File controls; knowledge-review rules are extra"
              ],
              "profile": [
                "AI reads, answers, and edits. Save outputs for reuse; a maintained, cross-source Wiki needs a separate system.",
                "Tools can read new versions and retain memory. Tracking changed sources, stale pages, and refreshes requires additional upkeep logic.",
                "Permissions and diffs control file edits. Automatic refresh versus review of human-edited knowledge pages needs separate rules and checks."
              ],
              "body": "This compares direct AI file work before adding a Wiki-maintenance system, not every AI product. Claude Code has auto memory across sessions; its documentation distinguishes remembered context from enforced controls. hooks can run your own automation. Source-to-page links, stale-page detection, and review routing still require implemented, tested logic; a prompt alone does not supply that system. Wenlan integrates these mechanisms, while generated content still needs evidence and version checking. Direct directory sources support Markdown, text, and text-extractable PDFs; Word and PowerPoint need to be exported to text/Markdown or a text-extractable PDF, and scanned PDFs need external OCR. New topics do not automatically become Wiki pages; background refresh needs a configured, available model.",
              "sources": [
                {
                  "label": "Markdown format",
                  "href": "https://commonmark.org/help/"
                },
                {
                  "label": "Claude Code file context",
                  "href": "https://code.claude.com/docs/en/memory"
                },
                {
                  "label": "Claude Code automation hooks",
                  "href": "https://code.claude.com/docs/en/hooks-guide"
                },
                {
                  "label": "Build a local AI knowledge base",
                  "href": "https://wenlan.app/learn/build-local-ai-knowledge-base-from-documents"
                }
              ],
              "wenlan": {
                "labels": [
                  "An AI knowledge base with upkeep built in",
                  "Keep related knowledge up to date",
                  "Keep originals; approve edits to your writing"
                ],
                "profile": [
                  "Documents and saved decisions become a cited Wiki. Retrieve prior conclusions and their evidence from connected AI tools, then continue the work.",
                  "New decisions can enrich existing pages. After connected files or memory content change, background processing refreshes eligible affected pages.",
                  "Source files stay unchanged. AI proposes a revision before updating pages you edited; you accept or reject it, with change history available."
                ],
                "emphasis": []
              }
            },
            {
              "id": "llm-wiki-workflow",
              "name": "LLM Wiki · nashsu",
              "tabLabel": "LLM Wiki",
              "eyebrow": "nashsu/llm_wiki · open-source project",
              "summary": "Both watch folders and handle more than files. Wenlan also tracks individual knowledge records and the pages that rely on them; LLM Wiki centers upkeep on sources and Wiki pages.",
              "profileLabels": [
                "Work from a desktop Wiki project",
                "Upkeep works on sources and Wiki pages",
                "Keep ingest moving; review follow-ups separately"
              ],
              "profile": [
                "Import documents, ask questions, and save answers in the App. External AI tools can connect through MCP while the App is running.",
                "Source-file changes or answers saved back to the Wiki can trigger automatic page compilation. Research results are also saved as pages.",
                "Ingest writes pages first; Review lists follow-ups such as further research or new pages without blocking ingest."
              ],
              "body": "This compares nashsu/llm_wiki, not Karpathy’s method or the broader LLM Wiki category. It supports citations, Review, MCP, and skills. With an ingest model configured, choosing Save to Wiki can automatically compile a saved answer. DeepResearch writes a cited query page without re-entering source ingest. Deleting a source also cleans up affected pages and links. Its Business template includes status and supersedes on decision pages. Wenlan instead keeps decisions as independent records: editing, deleting, or accepting a replacement revision flags the pages citing that record; accepting the revision also links their evidence to the replacement. New records can enrich matching existing pages. Background refresh needs an available model and eligible pages; changes to human-edited pages become revisions for approval. nashsu’s ingest writes pages before listing Review follow-ups. These are implementation differences, not proof of easier use or guaranteed factual accuracy.",
              "sources": [
                {
                  "label": "Karpathy’s LLM Wiki method",
                  "href": "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f"
                },
                {
                  "label": "nashsu/llm_wiki",
                  "href": "https://github.com/nashsu/llm_wiki"
                },
                {
                  "label": "llm_wiki ingest flow",
                  "href": "https://github.com/nashsu/llm_wiki/blob/main/src/lib/ingest.ts"
                },
                {
                  "label": "llm_wiki MCP server",
                  "href": "https://github.com/nashsu/llm_wiki/blob/main/mcp-server/README.md"
                },
                {
                  "label": "llm_wiki page templates",
                  "href": "https://github.com/nashsu/llm_wiki/blob/main/src/lib/templates.ts"
                },
                {
                  "label": "llm_wiki saved-answer compilation",
                  "href": "https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/components/chat/chat-message.tsx#L547-L626"
                },
                {
                  "label": "llm_wiki DeepResearch output",
                  "href": "https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/lib/deep-research.ts#L505-L545"
                },
                {
                  "label": "llm_wiki source-deletion cleanup",
                  "href": "https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/lib/source-lifecycle.ts#L457-L574"
                },
                {
                  "label": "Wenlan per-memory page dependencies",
                  "href": "https://github.com/7xuanlu/wenlan/blob/af646ddcf705ee7450335a8772a8cb196f89a3a1/crates/wenlan-core/src/db.rs#L31034-L31143"
                }
              ],
              "wenlan": {
                "labels": [
                  "Keep your AI tools; no extra App to open",
                  "Changed knowledge flags affected pages",
                  "Pages you write: review before changes"
                ],
                "profile": [
                  "After setup, save and retrieve knowledge from connected AI tools. The local background service runs without the desktop App.",
                  "Editing or deleting a memory, or accepting its replacement revision, flags the existing pages that cite it. Background work then refreshes eligible pages.",
                  "When AI wants to update a page you wrote, it proposes a revision; the original waits for your approval."
                ],
                "emphasis": []
              }
            },
            {
              "id": "llm-wiki-1",
              "name": "Obsidian",
              "eyebrow": "Obsidian · local Markdown vault",
              "summary": "Keep writing notes in Obsidian, let Wenlan read the originals, and maintain a separate Wiki for you and your AI.",
              "profileLabels": [
                "Write your own Markdown notes directly",
                "Let selected plugins handle it",
                "You decide what tools can change"
              ],
              "profile": [
                "Write notes and link ideas in a vault; connect a plugin or external tool when you need AI.",
                "Hand AI search, rewriting, or organization to plugins; choose features, set rules, and maintain them.",
                "You keep the vault; choose plugins and backups, and check whether AI can write to original notes."
              ],
              "body": "For writing, organizing and linking your own notes, with Markdown files stored on your device. Add plugins or connect AI tools when you want AI search, summaries or rewriting. Plugins and optional sync can change where data is sent; a local vault alone does not make every AI integration local.",
              "sources": [
                {
                  "label": "How Obsidian stores data",
                  "href": "https://obsidian.md/help/data-storage"
                },
                {
                  "label": "Community plugins",
                  "href": "https://obsidian.md/help/community-plugins"
                },
                {
                  "label": "Plugin security and data access",
                  "href": "https://obsidian.md/help/plugin-security"
                }
              ],
              "wenlan": {
                "labels": [
                  "Keep the vault; maintain a separate Wiki",
                  "Note changes, knowledge pages follow",
                  "Original notes stay untouched; review drafts first"
                ],
                "profile": [
                  "Connect the vault as a read-only source; keep writing originals while Wenlan builds pages for you and AI.",
                  "After Wenlan is configured, background tracking follows connected sources and refreshes eligible pages without rewriting your vault.",
                  "Wenlan does not write back to the vault; pages you edit also get a revision first, then you decide."
                ],
                "emphasis": []
              }
            },
            {
              "id": "vault-agents",
              "name": "Notion",
              "eyebrow": "Notion · cloud workspace",
              "summary": "Notion lets you configure Agents for workspace tasks; Wenlan makes source tracking, page upkeep, and edit review an integrated flow. Both can run automatically.",
              "profileLabels": [
                "Arrange work in a shared workspace",
                "You set tasks; Agent runs them automatically",
                "You control rules and workspace permissions"
              ],
              "profile": [
                "Organize personal or team work with pages, databases, and permissions; Notion Agent can create and edit.",
                "Custom Agents can run on schedules or events; set instructions, triggers, and access permissions first.",
                "Set the Agent’s access, inspect activity logs, and use Notion’s history and reversal controls."
              ],
              "body": "Notion is a cloud workspace for personal and team work, not just a database or passive notebook. Notion Agent can search, create, and edit; Custom Agents can run in the background on events or schedules, including knowledge upkeep. Use a template or set instructions, triggers, and access permissions yourself, then inspect activity logs and use Notion’s history and reversal controls. Official docs list Custom Agents for Business or Enterprise plans. Cloud content can be downloaded for offline use or exported as backups. The difference is general workspace automation versus Wenlan’s built-in knowledge-maintenance flow, not that Notion lacks automation or cannot connect external tools.",
              "sources": [
                {
                  "label": "Notion Agent",
                  "href": "https://www.notion.com/help/notion-agent"
                },
                {
                  "label": "Custom Agents: triggers, permissions, and review",
                  "href": "https://www.notion.com/help/custom-agents"
                },
                {
                  "label": "Offline pages",
                  "href": "https://www.notion.com/help/use-pages-offline"
                },
                {
                  "label": "Export backups",
                  "href": "https://www.notion.com/help/back-up-your-data"
                }
              ],
              "wenlan": {
                "labels": [
                  "No need to move into a new workspace",
                  "Knowledge maintenance is built in",
                  "Personal edits: ask before changing"
                ],
                "profile": [
                  "Save and find knowledge in connected AI tools; documents and decisions stay local without changing editors.",
                  "When sources change, background tracking refreshes affected pages; pages you wrote become proposed revisions.",
                  "You decide whether to accept a page revision; machine-maintained pages update as configured and keep history."
                ],
                "emphasis": []
              }
            },
            {
              "id": "notebooklm",
              "name": "NotebookLM",
              "eyebrow": "Google · Gemini Notebook",
              "summary": "NotebookLM helps you understand a set of sources; Wenlan builds those materials and work decisions into a Wiki that connected AI tools can use later.",
              "profileLabels": [
                "Ask from sources and make study materials",
                "Drive updates sync sources automatically",
                "You choose sources and sharing"
              ],
              "profile": [
                "Ask questions, summarize, or make study materials from selected sources; notebooks can also be used in Gemini conversations.",
                "Eligible Google Drive sources sync when you open the notebook; uploaded files are copies made at import.",
                "Choose which sources to cite and who can access the notebook; original Drive files are not written back."
              ],
              "body": "NotebookLM is the familiar product now labeled Gemini Notebook in Google’s official docs. It offers source-based Q&A, summaries, and study materials, and notebooks can be used in Gemini conversations; it is not limited to a separate App. Eligible Google Drive sources sync when you open the notebook; uploaded files are imported copies. You choose cited sources and cloud sharing permissions, and it does not rewrite the original Drive files. Source syncing does not guarantee that every previously generated study material will be regenerated.",
              "sources": [
                {
                  "label": "Gemini Notebook Help",
                  "href": "https://support.google.com/gemininotebook/answer/16215270?hl=en"
                },
                {
                  "label": "Automatic Drive syncing",
                  "href": "https://workspaceupdates.googleblog.com/2026/05/keep-your-sources-up-to-date-with-automatic-drive-syncing-in-NotebookLM.html"
                }
              ],
              "wenlan": {
                "labels": [
                  "Bring reading back into work",
                  "More than sync: update knowledge pages",
                  "You decide whether important edits land"
                ],
                "profile": [
                  "Save conclusions and decisions in a local knowledge base, then find them through connected AI tools for the next task.",
                  "Background tracking follows source changes and refreshes eligible existing Wiki pages, not just another source copy.",
                  "Pages you wrote keep their original text while AI proposes a revision; you choose whether to accept or keep it."
                ],
                "emphasis": []
              }
            }
          ],
          "current": {
            "name": "Wenlan",
            "tagline": "AI-native knowledge base",
            "summary": "A shared knowledge base for you and AI, built up through work.",
            "body": "Wenlan turns source documents, saved decisions, and lessons from work into a source-backed Living Wiki. Its Sources, Memories, and Pages model keeps decisions, lessons, and corrections as independent source-backed records; explicit supersession can link new knowledge to what it replaces. Those records and documents jointly support Pages. This knowledge lifecycle is discussed in the community Rohitg00 LLM Wiki v2 proposal; that is not an official version certification. First connect sources, specify a background model, and build an initial set of pages; after that, the local daemon syncs changes in connected folders, refreshes eligible existing pages, and keeps a change history. New topics are not guaranteed to become pages automatically; updates pause when the model is unavailable or source or citation checks fail. Pages you write or edit first receive a revision for review, and the original changes only after approval; not every AI write requires approval. People and connected tools share the selected Space through plugin / CLI / MCP, without opening the desktop App. Data is stored locally; model processing can use local or cloud services according to your settings.",
            "highlights": [
              {
                "label": "Documents + independent decisions",
                "body": "Source documents and independent decisions, lessons, and corrections jointly support Pages."
              },
              {
                "label": "Maintained Pages",
                "body": "Machine-maintained pages can rebuild from their current supporting evidence."
              },
              {
                "label": "Review + history",
                "body": "Changes to human writing wait for review. Page revisions remain inspectable."
              },
              {
                "label": "Shared across AI tools",
                "body": "Connected MCP clients reuse the same local knowledge instead of separate copies."
              }
            ],
            "sources": [
              {
                "label": "Source-backed Pages",
                "href": "https://wenlan.app/docs/source-backed-pages"
              },
              {
                "label": "Review and trust",
                "href": "https://wenlan.app/docs/review-and-trust"
              },
              {
                "label": "Models and keys",
                "href": "https://wenlan.app/docs/models-and-keys"
              },
              {
                "label": "Local Git history",
                "href": "https://wenlan.app/docs/local-git-history"
              },
              {
                "label": "Rohitg00 LLM Wiki v2 community proposal",
                "href": "https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2"
              },
              {
                "label": "Wenlan repository: what is this?",
                "href": "https://github.com/7xuanlu/wenlan#what-is-this"
              }
            ]
          },
          "closer": {
            "pre": "Keep what matters, with ",
            "emphasis": "review",
            "post": " in the loop."
          },
          "selectorLabel": "How do you manage knowledge today?",
          "sourcesChecked": "Sources checked 2026-09-07 · Documentation and source-code review, not a hands-on benchmark."
        },
        pipeline: {
          intro:
            "After provider and client setup, Wenlan can save useful decisions, build sourced Pages when configured processing runs, and help the next session find them.",
          stages: [
            { id: "capture", step: "/capture · during the session", title: "Save useful decisions" },
            { id: "distill", step: "/distill · between sessions", title: "Build a sourced page" },
            { id: "brief", step: "/brief · next session", title: "Find it next time" },
          ],
          distillNote: "Agents can also create Pages directly when a topic deserves one right away; provider and client setup still apply.",
          arcLabel: "/handoff closes each pass",
        },
        bento: {
          cells: [
            {
              id: "pages",
              title: "Readable by humans, organized for agents",
              body: "Cleaned decisions and lessons become durable pages instead of buried chat logs.",
            },
            {
              id: "graph",
              title: "Find the answer with its context",
              body: "Configured retrieval can bring back people, projects, and Pages with links to source memories and related items.",
            },
            {
              id: "citations",
              title: "Follow the source",
              body: "Wenlan records source links on distilled Pages so you can inspect supporting memories. Source links do not prove every claim by themselves.",
            },
            {
              id: "review",
              title: "Review before you rely",
              body: "Configured review flows can surface low-confidence captures and contradictions. You decide what is worth trusting in future context.",
            },
            {
              id: "nurture",
              title: "See what needs another look",
              body: "With background processing configured, batches can link entities, update matching Pages, and flag stale memories for attention.",
            },
            {
              id: "spaces",
              title: "Spaces keep work apart",
              body: "Tag captures and recalls with a space; when the client and active space are configured, different contexts can stay separate.",
            },
            {
              id: "git",
              title: "Versioned like code",
              body: "Memory, pages, and session artifacts live in real git history. Inspect, diff, revert.",
            },
            {
              id: "mcp",
              title: "Bring knowledge across tools",
              body: "Configured MCP clients can read local memory through one daemon; setup and client permissions determine what they can access.",
            },
          ],
        },
        storage: {
          title: "Remember the idea,\nnot the exact words?",
          intro:
            "Hybrid Retrieval combines keyword, semantic, and graph context to help find relevant knowledge. Configured Page work turns sources into Markdown you can read, check, and keep.",
          indexLabel: "Index · working memory for agents",
          filesLabel: "Markdown · lasting record for you",
          fusionNote: "Files, an index, and Page work solve different needs. Choose the boundary your workflow can maintain.",
          distillCaption: "staging becomes pages",
          ingestCaption: "pages indexed for recall",
          tradeoffs: [
            {
              id: "files-alone",
              title: "Plain files",
              body: "A fit for a small, stable set that you or an agent can search directly. As it grows or changes, you may need explicit retrieval and review.",
            },
            {
              id: "db-alone",
              title: "An index",
              body: "Useful for fast lookup across configured sources; pair it with readable artifacts and a review path when people need to inspect changes.",
            },
            {
              id: "index-files",
              title: "Index plus files",
              body: "Combine lookup with readable, versioned artifacts. Whether it fits depends on your source boundary and maintenance workflow.",
            },
          ],
        },
        metrics: {
          title: "Retrieval snapshot scope.",
          bars: [
            {
              id: "full-replay",
              label: "Full chat replay",
              value: "4,505 tokens / query",
              sub: "No retrieval, whole transcript in context",
            },
            {
              id: "wenlan",
              label: "Wenlan retrieval",
              value: "168 tokens / query",
              sub: "CE-reranked, 500-question snapshot",
            },
          ],
          footnote:
            "Retrieval-only snapshots on fixed fixtures. LME_S records 87.7% R@5 and 0.815 MRR on the stratified N=90 deep-S fixture. This is not a general time or token-saving guarantee and does not compare Wenlan with other tools. Token comparison is full replay vs retrieved context within this retrieval test.",
        },
      },
    },
  },
  about: {
    status: "translated",
    sourceHash: null,
    content: {
      seo: {
        title: "About Wenlan | LLM Wiki for AI Work",
        description:
          "Wenlan is an open-source, local-first LLM wiki for AI work, built by agents and grounded in its sources.",
      },
      breadcrumbs: {
        home: "Wenlan",
        current: "About",
      },
      hero: {
        eyebrow: "About",
        title: "An LLM wiki for AI work.",
        description:
          "Agents capture what they learn, you add sources you trust, and Wenlan keeps source-backed wiki pages current across AI work.",
        statusLabel: "Project status",
        statusItems: ["v0.18.3", "macOS, Linux, Windows", "Apache-2.0", "Built by Qi-Xuan Lu"],
      },
      sections: [
        {
          id: "why",
          number: "01",
          title: "Why Wenlan exists",
          paragraphs: [
            "AI work has become serious work, but most sessions still end like disposable conversations. Decisions, debugging lessons, project constraints, and handoffs get buried in old chats.",
            "Wenlan is built so the work can compound into an LLM wiki. Agents can save what matters, recall it later, and keep refined, source-backed context available across MCP-compatible tools.",
          ],
        },
        {
          id: "builder",
          number: "03",
          title: "Built by Qi-Xuan Lu",
          paragraphs: [
            "Wenlan is built and maintained by Qi-Xuan Lu (GitHub @7xuanlu). Background in AI infrastructure, knowledge graphs, and local-first systems.",
            "The work focuses on an LLM wiki agents can build and humans can inspect: hybrid retrieval on libSQL, real git versioning for readable pages, session handoffs and status artifacts, mandatory provenance on distilled pages, and one daemon serving multiple AI tools.",
            "Project channels: GitHub Issues for bugs and feature requests, SECURITY.md for vulnerabilities, and the Wenlan release notes for changes.",
          ],
        },
        {
          id: "status",
          number: "04",
          title: "Current status",
          paragraphs: [
            "Wenlan v0.18.3 ships a notarized macOS Apple Silicon DMG and a Windows x64 desktop setup executable, plus native headless runtime artifacts for macOS, Linux (x86_64, aarch64; glibc), and Windows (x86_64). Windows users can choose the desktop setup executable or the headless runtime ZIP. The daemon, CLI, MCP server, Claude Code plugin, and Codex plugin are Apache-2.0; the desktop app crate is AGPL-3.0-only.",
          ],
        },
      ],
      principles: {
        title: "Design principles",
        items: [
          {
            id: "local-first",
            title: "Local-first",
            body: "Memory starts on your machine. Cloud sync, telemetry, local models, and API keys are opt-in choices rather than the default source of truth.",
          },
          {
            id: "human-readable",
            title: "Human-readable",
            body: "Memory, page, and session writes leave Markdown artifacts in local git. The daemon database powers retrieval, while the source-backed artifacts stay inspectable.",
          },
          {
            id: "session-rhythm",
            title: "Session rhythm",
            body: "Wenlan follows how AI work actually happens: load context, capture durable facts, write handoffs, and bring the right context into the next run.",
          },
          {
            id: "deliberate-distillation",
            title: "Deliberate distillation",
            body: "Between sessions, Wenlan deduplicates repeat facts and links related ideas. Run /distill when a topic deserves a source-backed page; local models or API keys can add automatic page distillation and richer graph work.",
          },
        ],
      },
      projectLinksHeading: "Open source",
      projectLinks: [
        {
          id: "repository",
          href: "https://github.com/7xuanlu/wenlan",
          label: "GitHub repository",
        },
        {
          id: "license",
          href: "https://github.com/7xuanlu/wenlan/blob/main/LICENSE",
          label: "Apache-2.0 license",
        },
        {
          id: "contributing",
          href: "https://github.com/7xuanlu/wenlan/blob/main/CONTRIBUTING.md",
          label: "Contributing guide",
        },
        {
          id: "security",
          href: "https://github.com/7xuanlu/wenlan/blob/main/SECURITY.md",
          label: "Security policy",
        },
      ],
      help: {
        eyebrow: "Help",
        bodyPrefix: "For bugs and feature requests, use GitHub Issues. For vulnerabilities, follow the",
        securityLink: {
          id: "security-reporting-guide",
          href: "/docs/security",
          label: "security reporting guide",
        },
        bodySuffix: ".",
      },
      cta: {
        primary: { id: "get-started", href: "/docs/get-started", label: "Get started" },
        secondary: {
          id: "github",
          href: "https://github.com/7xuanlu/wenlan",
          label: "View on GitHub",
        },
      },
      schema: {
        name: "About Wenlan",
        description:
          "Wenlan is an open-source, local-first LLM wiki for AI work, built by Qi-Xuan Lu.",
      },
    },
  },
  docs: {
    status: "translated",
    sourceHash: null,
    content: {
      seo: {
        title: "Wenlan Docs | LLM Wiki for AI Work",
        description:
          "Install Wenlan, learn the AI work memory loop, and understand how source-backed wiki pages, provenance, retrieval, and MCP clients fit together.",
      },
      breadcrumbs: {
        home: "Wenlan",
        current: "Docs",
      },
      hero: {
        eyebrow: "Docs",
        title: "Start using Wenlan.",
        description:
          "Install Wenlan, connect the AI tools you use, and build a source-backed LLM wiki that stays readable, searchable, and under your control.",
      },
      intro: {
        eyebrow: "Start here",
        body: "New users should install first, run setup for their client, then read the daily workflow and core concepts. The project docs cover source-backed pages, architecture, reference paths, evals, releases, scope, source builds, roadmap, development conventions, and contribution paths.",
      },
      sections: {
        items: [
          {
            id: "start-here",
            title: "Start here",
            description: "Install Wenlan and verify the first memory round trip.",
            items: [
              {
                id: "get-started",
                href: "/docs/get-started",
                label: "Setup",
                title: "Get started with Wenlan",
                description:
                  "Choose the Claude Code, Codex, ChatGPT, or local MCP path, then confirm the first capture and recall round trip works.",
                meta: "Wenlan team · Updated Jul 9, 2026 · 4 min setup",
              },
            ],
          },
          {
            id: "after-setup",
            title: "After setup",
            description:
              "Turn the install into a working habit: start warm, capture useful context, review what should be trusted, and hand off before context goes cold.",
            items: [
              {
                id: "daily-workflow",
                href: "/docs/daily-workflow",
                label: "Workflow",
                title: "Daily Workflow",
                description:
                  "Start with context, capture what matters, recall when needed, and hand off before context goes cold.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "capture-quality",
                href: "/docs/capture-quality",
                label: "Capture",
                title: "Capture Quality",
                description:
                  "Decide what belongs in Wenlan: durable facts, decisions, lessons, gotchas, corrections, and project context.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "review-and-trust",
                href: "/docs/review-and-trust",
                label: "Trust",
                title: "Review and Trust",
                description:
                  "Understand how Wenlan keeps uncertain memory visible: pending captures, revisions, contradictions, rejections, confirm, and forget.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "core-concepts",
                href: "/docs/core-concepts",
                label: "Concepts",
                title: "Core Concepts",
                description:
                  "Understand the pieces behind Wenlan: memories, sessions, handoffs, pages, the daemon, MCP, Markdown, and the local index.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 6 min read",
              },
            ],
          },
          {
            id: "reference",
            title: "Reference",
            description:
              "Memory types, glossary, architecture, commands, Claude Code and Codex plugins, CLI/service management, updates, upgrade notes, package names, platform support, HTTP API, API examples, typed clients, spaces, graph context, pages, import paths, git history, retrieval status, experimental flags, local data, backup paths, configuration, environment variables, local and web MCP clients, agent profiles, diagnostics, FAQ, and repair paths.",
            items: [
              {
                id: "memory-types",
                href: "/docs/memory-types",
                label: "Memory",
                title: "Wenlan Memory Types and memory_type Values",
                description:
                  "Choose identity, preference, decision, lesson, gotcha, or fact based on why a capture should matter later.",
                meta: "Qi-Xuan Lu · Updated Jul 10, 2026 · 5 min read",
              },
              {
                id: "glossary",
                href: "/docs/glossary",
                label: "Glossary",
                title: "Glossary",
                description:
                  "A quick map of Wenlan terms: memory, handoff, page, space, daemon, MCP, local index, provenance, and eval language.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "architecture",
                href: "/docs/architecture",
                label: "Architecture",
                title: "Architecture",
                description:
                  "How Wenlan is put together: one local daemon, thin clients, shared wire types, local artifacts, and retrieval owned by wenlan-core.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 7 min read",
              },
              {
                id: "product-matrix",
                href: "/docs/product-matrix",
                label: "Matrix",
                title: "Product Matrix",
                description:
                  "Compare Wenlan's daemon, CLI, MCP connector, plugins, desktop app, repositories, platform artifacts, and release boundaries.",
                meta: "Qi-Xuan Lu · Updated Jul 9, 2026 · 6 min read",
              },
              {
                id: "commands",
                href: "/docs/commands",
                label: "Reference",
                title: "Commands and Tools",
                description:
                  "The essential Claude Code and Codex plugin commands, CLI commands, and MCP tools for running Wenlan day to day.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "claude-code-plugin",
                href: "/docs/claude-code-plugin",
                label: "Plugin",
                title: "Claude Code Plugin",
                description:
                  "Use Wenlan's richest Claude Code workflow: setup, brief, capture, recall, lint diagnostics, curate, distill, pages, and handoff.",
                meta: "Qi-Xuan Lu · Updated Jul 17, 2026 · 6 min read",
              },
              {
                id: "cli-and-service",
                href: "/docs/cli-and-service",
                label: "CLI",
                title: "Wenlan CLI Commands and Service Management",
                description:
                  "Use the Wenlan CLI for setup, daemon status, doctor diagnostics, background service management, memory search, and MCP client wiring.",
                meta: "Qi-Xuan Lu · Updated Jul 10, 2026 · 5 min read",
              },
              {
                id: "updates-and-uninstall",
                href: "/docs/updates-and-uninstall",
                label: "Lifecycle",
                title: "Updates and Uninstall",
                description:
                  "Refresh Wenlan's local runtime, verify version health, restart MCP clients, and remove the service without losing data by accident.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 4 min read",
              },
              {
                id: "upgrade-notes",
                href: "/docs/upgrade-notes",
                label: "Upgrade",
                title: "Upgrade Notes",
                description:
                  "Read the practical upgrade path for Wenlan releases: what to rerun, what to verify, and what changed in the current public runtime shape.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "packages-and-registries",
                href: "/docs/packages-and-registries",
                label: "Packages",
                title: "Packages and Registries",
                description:
                  "Know which Wenlan package name maps to the plugin, runtime setup, MCP connector, Rust crates, and release binaries.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 4 min read",
              },
              {
                id: "platforms",
                href: "/docs/platforms",
                label: "Platforms",
                title: "Platform Support",
                description:
                  "Understand how Wenlan runs on macOS, Linux, and Windows: service managers, local data paths, model backends, and Docker/VM caveats.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "http-api",
                href: "/docs/http-api",
                label: "API",
                title: "HTTP API",
                description:
                  "Know the local daemon surfaces that the CLI, MCP connector, plugin, and local tools call under the hood.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "api-examples",
                href: "/docs/api-examples",
                label: "API",
                title: "API Examples",
                description:
                  "Use the local daemon HTTP API from scripts when the CLI or MCP tools are not the right fit.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 6 min read",
              },
              {
                id: "typed-clients",
                href: "/docs/typed-clients",
                label: "Types",
                title: "Typed Clients",
                description:
                  "Use wenlan-types when a Rust tool needs to call the local daemon without relying on untyped JSON shapes.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 4 min read",
              },
              {
                id: "spaces",
                href: "/docs/spaces",
                label: "Spaces",
                title: "Spaces",
                description:
                  "Separate work, personal, client, and project memory, and understand how Wenlan resolves the active space.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 6 min read",
              },
              {
                id: "knowledge-graph",
                href: "/docs/knowledge-graph",
                label: "Graph",
                title: "Knowledge Graph",
                description:
                  "Understand how Wenlan links people, projects, tools, observations, and relations so recall can recover context through more than text similarity.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "source-backed-pages",
                href: "/docs/source-backed-pages",
                label: "Pages",
                title: "Source-Backed Pages",
                description:
                  "Understand how Wenlan turns atomic captures into readable pages with source memory IDs, revision state, and refresh paths.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "import-and-portability",
                href: "/docs/import-and-portability",
                label: "Portability",
                title: "Import and Portability",
                description:
                  "Move selected durable context into Wenlan and keep Wenlan's readable artifacts portable outside the daemon.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "local-git-history",
                href: "/docs/local-git-history",
                label: "Versioning",
                title: "Local Git History",
                description:
                  "Inspect the real git history Wenlan keeps for readable page, session, handoff, and status artifacts.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "models-and-keys",
                href: "/docs/models-and-keys",
                label: "Models",
                title: "Models and Keys",
                description:
                  "Choose between local memory mode, optional on-device models, and optional Anthropic API keys for richer extraction, page synthesis, recaps, and graph work.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "advanced-retrieval",
                href: "/docs/advanced-retrieval",
                label: "Retrieval",
                title: "Advanced Retrieval Status",
                description:
                  "Understand Wenlan's shipped retrieval path and the opt-in main-branch experiments behind newer retrieval work.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 6 min read",
              },
              {
                id: "experimental-flags",
                href: "/docs/experimental-flags",
                label: "Experiments",
                title: "Experimental Flags",
                description:
                  "How to read Wenlan's opt-in main-branch flags without mistaking them for released defaults.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 6 min read",
              },
              {
                id: "data-and-privacy",
                href: "/docs/data-and-privacy",
                label: "Local control",
                title: "Wenlan Local Data and Privacy",
                description:
                  "See where Wenlan stores local AI work memory, what stays on your machine, and when connected model providers may see prompts.",
                meta: "Qi-Xuan Lu · Updated Jul 10, 2026 · 5 min read",
              },
              {
                id: "backup-and-migration",
                href: "/docs/backup-and-migration",
                label: "Backup",
                title: "Backup and Migration",
                description:
                  "Back up Wenlan's readable artifacts and daemon data together, then verify the restored runtime before trusting recall.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "configuration",
                href: "/docs/configuration",
                label: "Configuration",
                title: "Wenlan Configuration",
                description:
                  "Configure Wenlan spaces, MCP clients, daemon bind address, local paths, models, and keys without editing the database by hand.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "environment-variables",
                href: "/docs/environment-variables",
                label: "Config",
                title: "Environment Variables",
                description:
                  "Know which Wenlan environment variables are normal configuration, which are development-only, and which belong to eval or Windows repair paths.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "mcp-clients",
                href: "/docs/mcp-clients",
                label: "MCP",
                title: "Connect MCP Clients",
                description:
                  "Connect Claude Code, Codex, Cursor, Claude Desktop, Gemini CLI, ChatGPT, Claude.ai, and other MCP clients to Wenlan.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 4 min read",
              },
              {
                id: "agent-profiles",
                href: "/docs/agent-profiles",
                label: "Agents",
                title: "Wenlan Agent Profiles and Client Attribution",
                description:
                  "See which AI client wrote a memory, inspect source_agent attribution, and manage trust or enabled state.",
                meta: "Qi-Xuan Lu · Updated Jul 10, 2026 · 4 min read",
              },
              {
                id: "troubleshooting",
                href: "/docs/troubleshooting",
                label: "Repair",
                title: "Troubleshooting",
                description:
                  "Fix the common setup issues: daemon not running, MCP not connected, missing Claude commands, stale context, and support escalation.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "diagnostics-and-issue-reports",
                href: "/docs/diagnostics-and-issue-reports",
                label: "Diagnostics",
                title: "Diagnostics and Issue Reports",
                description:
                  "Run the right checks before asking for help, separate daemon problems from client problems, and share only redacted output.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "faq",
                href: "/docs/faq",
                label: "FAQ",
                title: "FAQ",
                description:
                  "Short answers to the adoption questions people ask before and after installing Wenlan.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 4 min read",
              },
            ],
          },
          {
            id: "project",
            title: "Project",
            description:
              "Security reporting, evaluation, desktop status, changelog, release/versioning, roadmap, project scope, source builds, testing, CI, development conventions, and contribution paths for people deciding whether Wenlan is credible enough to adopt or contribute to.",
            items: [
              {
                id: "security",
                href: "/docs/security",
                label: "Security",
                title: "Security and Reporting",
                description:
                  "Report Wenlan vulnerabilities privately, redact diagnostic output, and understand the local daemon security boundary.",
                meta: "Qi-Xuan Lu · Updated Jul 10, 2026 · 4 min read",
              },
              {
                id: "evaluation",
                href: "/docs/evaluation",
                label: "Evaluation",
                title: "Evaluation",
                description:
                  "What Wenlan's published retrieval numbers mean, how they are generated, and what they do not claim.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 6 min read",
              },
              {
                id: "desktop-app",
                href: "/docs/desktop-app",
                label: "Desktop",
                title: "Desktop App Status",
                description:
                  "Understand how the optional Wenlan desktop app relates to the daemon, plugins, source-backed wiki, and Remote Access for ChatGPT and Claude.ai.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 4 min read",
              },
              {
                id: "changelog",
                href: "/docs/changelog",
                label: "Releases",
                title: "Wenlan Changelog and Releases",
                description:
                  "See the current Wenlan release, shipped changes, and how to distinguish tagged releases from unreleased main work.",
                meta: "Qi-Xuan Lu · Updated Sep 4, 2026 · 5 min read",
              },
              {
                id: "releases-and-versioning",
                href: "/docs/releases-and-versioning",
                label: "Releases",
                title: "Releases and Versioning",
                description:
                  "Understand how Wenlan turns merged work into tagged releases, package versions, binaries, npm packages, and crates.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "roadmap",
                href: "/docs/roadmap",
                label: "Roadmap",
                title: "Roadmap and Status",
                description:
                  "How to read Wenlan's current direction without confusing released features, main-branch work, and future bets.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 6 min read",
              },
              {
                id: "project-scope",
                href: "/docs/project-scope",
                label: "Scope",
                title: "Project Scope",
                description:
                  "What Wenlan is for, what it deliberately avoids, and how to decide whether it fits your AI work.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "build-from-source",
                href: "/docs/build-from-source",
                label: "Development",
                title: "Build from Source",
                description:
                  "Build the Wenlan daemon, CLI, MCP server, shared types, core crate, and plugin from the public repository.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "testing-and-ci",
                href: "/docs/testing-and-ci",
                label: "Quality",
                title: "Testing and CI",
                description:
                  "Understand which Wenlan checks run locally, which run in GitHub Actions, and which evals stay manual.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "development-conventions",
                href: "/docs/development-conventions",
                label: "Development",
                title: "Development Conventions",
                description:
                  "Codebase rules that keep Wenlan's daemon, CLI, MCP connector, shared types, and core logic maintainable.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
              {
                id: "contributing",
                href: "/docs/contributing",
                label: "Open source",
                title: "Contributing",
                description:
                  "How to contribute useful bug reports, docs, eval cases, and code changes to Wenlan.",
                meta: "Qi-Xuan Lu · Updated Jun 24, 2026 · 5 min read",
              },
            ],
          },
        ],
      },
      cta: {
        eyebrow: "Already installed?",
        title: "Make the memory loop habitual.",
        body: "Start with the daily workflow, then use the reference docs when you need commands, MCP setup, or repair steps.",
        primary: { id: "daily-workflow", href: "/docs/daily-workflow", label: "Daily workflow" },
        secondary: {
          id: "github",
          href: "https://github.com/7xuanlu/wenlan",
          label: "GitHub",
        },
      },
      schema: {
        name: "Wenlan Docs",
        description: "Product documentation for Wenlan, the source-backed LLM wiki for AI work.",
      },
    },
  },
  getStarted: {
    status: "translated",
    sourceHash: null,
    content: {
      seo: {
        title: "Install Wenlan for Claude Code, Codex, ChatGPT, and MCP",
        description:
          "Install Wenlan, connect Claude Code, Codex, ChatGPT, Claude.ai, or another MCP client, then verify the first capture and recall round trip.",
      },
      breadcrumbs: {
        home: "Wenlan",
        docs: "Docs",
      },
      hero: {
        eyebrow: "Get started",
        title: "Install Wenlan and connect your AI client.",
        description:
          "Choose one client path, connect it to the same local daemon, then verify a capture and recall round trip.",
        meta: ["Wenlan team", "Updated Jul 31, 2026", "5 min setup"],
        setupPathLabel: "Setup path",
        setupPathItems: ["Runtime", "Claude Code", "Codex", "Local + remote MCP"],
      },
      steps: [
        {
          id: "install-runtime",
          number: "01",
          title: "Install the runtime for your system",
          paragraphs: [
            "Wenlan v0.18.3 ships native runtime packages for Windows x64, macOS Apple silicon, and Linux x64 or ARM64 with glibc. Every runtime archive contains the CLI, daemon, and MCP connector.",
            "On Windows, extract wenlan-windows-x64.zip as one unit into a user-owned directory on PATH. Keep onnxruntime.dll and vulkan-1.dll beside the three executables.",
          ],
          commands: [
            "# macOS Apple silicon\nnpx -y wenlan setup",
            "# Linux x64 or ARM64\ncurl -fsSL https://raw.githubusercontent.com/7xuanlu/wenlan/main/install.sh | bash\nwenlan setup --basic\nwenlan background on\nwenlan status",
            "# Windows x64, after extracting the ZIP and adding it to PATH\nwenlan setup --basic\nwenlan background on\nwenlan status",
          ],
          ctas: [
            {
              id: "windows-download",
              href: "https://github.com/7xuanlu/wenlan/releases/download/v0.18.3/wenlan-windows-x64.zip",
              label: "Download Windows x64",
            },
            {
              id: "all-downloads",
              href: "https://github.com/7xuanlu/wenlan/releases/tag/v0.18.3",
              label: "All v0.18.3 downloads",
            },
          ],
        },
        {
          id: "claude-code-plugin",
          number: "02",
          title: "Claude Code plugin",
          paragraphs: [
            "This is the fastest path. The plugin handles daemon setup, MCP wiring, local memory setup, and the first round-trip check.",
            "If Claude Code asks for a restart after installing, restart once, then run /setup.",
          ],
          commands: claudeCommands,
          ctas: [],
        },
        {
          id: "codex",
          number: "03",
          title: "Codex",
          paragraphs: [
            "Run Wenlan setup, then connect Codex to the local MCP server. The main Wenlan repository also ships a Codex plugin for users installing from a checkout; wenlan connect codex is the direct no-checkout client path.",
          ],
          commands: ["wenlan connect codex"],
          ctas: [],
        },
        {
          id: "chatgpt-web",
          number: "04",
          title: "ChatGPT and Claude.ai",
          paragraphs: [
            "Open Remote Access in the Wenlan desktop app to create a temporary HTTPS URL for Streamable HTTP MCP. The app starts wenlan-mcp with --no-auth on loopback and exposes it through the tunnel, so possession of the URL grants access. In ChatGPT, open Settings > Plugins, create a New Plugin, choose Server URL under Connection, paste the URL, and set Authentication to None. In Claude.ai, install Wenlan from the 7xuanlu/wenlan marketplace through Directory > Plugins.",
            "This is a custom MCP connection to your own Wenlan runtime, not a claim that Wenlan is listed in the public ChatGPT Apps Directory. Stop Remote Access when you are not using it.",
          ],
          commands: [],
          ctas: [],
        },
        {
          id: "other-mcp-clients",
          number: "05",
          title: "Other local MCP clients",
          paragraphs: [
            "For Cursor, Claude Desktop, Gemini CLI, VS Code, and other supported local MCP clients, set up the Wenlan runtime first. Then let the CLI write the client-specific MCP configuration.",
            "Wenlan setup installs the CLI, daemon, and MCP connector, registers the daemon with your operating system's user service manager, and verifies status.",
          ],
          commands: ["wenlan connect cursor\n# or: claude-desktop, vscode, gemini"],
          ctas: [],
        },
        {
          id: "try-first",
          number: "06",
          title: "What to try first",
          paragraphs: [
            "Store one durable project fact, then ask another session or client to recall it. Wenlan should surface the fact and keep its source available to the wiki and review flow.",
          ],
          commands: [],
          ctas: [
            { id: "daily-workflow", href: "/docs/daily-workflow", label: "Start daily workflow" },
            { id: "learn", href: "/learn", label: "Read articles" },
          ],
        },
      ],
      sidebar: {
        eyebrow: "You get",
        items: [
          { id: "source-backed-wiki", label: "Source-backed LLM wiki" },
          { id: "local-daemon", label: "Local daemon" },
          { id: "agent-plugins", label: "Claude Code + Codex" },
          { id: "mcp-server", label: "Local + remote MCP" },
        ],
      },
      schema: {
        name: "Get started with Wenlan",
        description:
          "Connect Wenlan through Claude Code, Codex, ChatGPT, Claude.ai, or another MCP client.",
      },
    },
  },
  notFound: {
    status: "translated",
    sourceHash: null,
    content: {
      eyebrow: "404",
      title: "This page does not exist.",
      description:
        "If you followed a link, it may be outdated. If you typed the URL, check for a typo. Below are common starting points.",
      primaryCta: "Back to home",
      secondaryCta: "Browse articles",
      popularHeading: "Popular destinations",
      popularDestinations: [
        {
          id: "get-started",
          href: "/docs/get-started",
          label: "Get started",
          description: "Install Wenlan and verify the first local memory loop.",
        },
        {
          id: "daily-workflow",
          href: "/docs/daily-workflow",
          label: "Daily workflow",
          description: "Capture, handoff, distill across AI sessions.",
        },
        {
          id: "ai-work-memory",
          href: "/learn/ai-work-memory",
          label: "AI work memory",
          description: "What changes when AI sessions carry context across days.",
        },
        {
          id: "mcp-memory-server",
          href: "/learn/mcp-memory-server",
          label: "MCP memory server",
          description: "How Wenlan exposes memory through MCP.",
        },
        {
          id: "basic-memory",
          href: "/learn/wenlan-vs-basic-memory",
          label: "Wenlan vs Basic Memory",
          description: "Markdown knowledge base vs AI work-session memory layer.",
        },
        {
          id: "about",
          href: "/about",
          label: "About",
          description: "Project background, principles, and the person behind Wenlan.",
        },
      ],
    },
  },
  footer: {
    status: "translated",
    sourceHash: null,
    content: {
      ariaLabel: "Site footer",
      brand: "Wenlan",
      tagline: "Source-backed LLM wiki for AI work.",
      groups: [
        {
          id: "product",
          title: "Product",
          links: [
            { id: "get-started", href: "/docs/get-started", label: "Get started" },
            { id: "daily-workflow", href: "/docs/daily-workflow", label: "Daily workflow" },
            { id: "capture-quality", href: "/docs/capture-quality", label: "Capture quality" },
            { id: "core-concepts", href: "/docs/core-concepts", label: "Core concepts" },
            { id: "data-and-privacy", href: "/docs/data-and-privacy", label: "Data and privacy" },
            { id: "configuration", href: "/docs/configuration", label: "Configuration" },
            { id: "updates", href: "/docs/updates-and-uninstall", label: "Updates" },
            { id: "platforms", href: "/docs/platforms", label: "Platforms" },
            { id: "docs", href: "/docs", label: "Docs" },
          ],
        },
        {
          id: "learn",
          title: "Learn",
          links: [
            { id: "llm-wiki", href: "/learn/distilled-wiki-pages-ai-memory", label: "LLM wiki guide" },
            { id: "ai-knowledge-base", href: "/learn/source-backed-wiki-pages-ai-work", label: "AI knowledge base guide" },
            { id: "tool-selection", href: "/learn/choose-ai-knowledge-base-tool", label: "AI knowledge base tool selection" },
            { id: "obsidian", href: "/learn/wenlan-vs-obsidian-ai-memory", label: "Obsidian and AI work" },
          ],
        },
        {
          id: "project",
          title: "Project",
          links: [
            { id: "about", href: "/about", label: "About" },
            { id: "architecture", href: "/docs/architecture", label: "Architecture" },
            { id: "evaluation", href: "/docs/evaluation", label: "Evaluation" },
            { id: "changelog", href: "/docs/changelog", label: "Changelog" },
            { id: "roadmap", href: "/docs/roadmap", label: "Roadmap" },
            { id: "project-scope", href: "/docs/project-scope", label: "Project scope" },
            { id: "security", href: "/docs/security", label: "Security" },
            { id: "github", href: "https://github.com/7xuanlu/wenlan", label: "GitHub" },
            { id: "rss", href: "/feed.xml", label: "RSS feed" },
            {
              id: "license",
              href: "https://github.com/7xuanlu/wenlan/blob/main/LICENSE",
              label: "Apache-2.0",
            },
          ],
        },
      ],
      signature: {
        brand: "Wenlan",
        tagline: "Source-backed LLM wiki",
        builtByPrefix: "Built by",
        author: "Qi-Xuan Lu",
        authorUrl: "https://github.com/7xuanlu",
      },
    },
  },
} as const satisfies CoreContent;
