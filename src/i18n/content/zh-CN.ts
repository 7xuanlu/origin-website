import type { CoreContent } from "./schema";

const claudeCommands = [
  "/plugin marketplace add 7xuanlu/claude-plugins",
  "/plugin install wenlan@7xuanlu",
  "/setup",
] as const;

export const zhCNContent = {
  chrome: {
    status: "translated",
    sourceHash: "bda0fd8a846d006539eab9c685b3be1e51df3f019c837c06e79900eb774faa57",
    content: {
      skipLinkLabel: "跳到主要内容",
      breadcrumbAriaLabel: "面包屑",
    },
  },
  home: {
    status: "translated",
    sourceHash: "4df0d0a9ebddbd003e1e3550d4ee2d99e09e522e18014323bf749d745fe825be",
    content: {
      seo: {
        title: "Wenlan 文澜 | AI 工作的 LLM wiki",
        description:
          "Wenlan 文澜是有来源依据的 AI 知识库，也是 AI 工作的 LLM wiki：整理文档与决策，让你和 AI 能查找、核对与审核页面。",
      },
      nav: {
        schemaName: "Wenlan 文澜网站导航",
        brand: "Wenlan 文澜",
        githubAriaLabel: "在 GitHub 查看 Wenlan",
        themeToggle: {
          lightLabel: "切换到浅色主题",
          darkLabel: "切换到深色主题",
        },
        links: [
          { id: "download", href: "/download", label: "下载" },
          { id: "docs", href: "/docs", label: "文档" },
          { id: "learn", href: "/learn", label: "学习" },
          { id: "about", href: "/about", label: "关于" },
          { id: "github", href: "https://github.com/7xuanlu/wenlan", label: "GitHub" },
        ],
      },
      hero: {
        title: "Wenlan 文澜",
        description:
          "保存有用决策，建立有来源的页面，再通过已连接的 AI 工具找回。",
        primaryCta: { id: "download", href: "#download", label: "下载 Wenlan" },
        secondaryCta: {
          id: "github",
          href: "https://github.com/7xuanlu/wenlan",
          label: "在 GitHub 查看",
        },
        metaText: [
          { id: "agent-plugins", label: "Claude Code + Codex 插件" },
          { id: "chatgpt-mcp", label: "ChatGPT 通过远程 MCP" },
          { id: "local-daemon", label: "本地 daemon" },
        ],
        metaLinks: [
          {
            id: "llm-wiki",
            href: "/learn/distilled-wiki-pages-ai-memory",
            label: "LLM wiki 导览",
          },
          {
            id: "ai-knowledge-base",
            href: "/learn/source-backed-wiki-pages-ai-work",
            label: "AI 知识库导览",
          },
          {
            id: "ai-knowledge-base-tool",
            href: "/learn/choose-ai-knowledge-base-tool",
            label: "AI 知识库选型",
          },
        ],
      },
      demo: {
        title: "Wenlan 产品演示",
        playLabel: "播放 Wenlan 产品演示",
      },
      download: {
        eyebrow: "下载",
        title:
          "下\u2060载\u2060适\u2060合\u2060你\u2060系\u2060统\u2060的 Wenlan。",
        description:
          "Wenlan v0.18.5 提供 Windows x64 桌面版与 macOS Apple silicon DMG，以及 Windows、macOS、Linux 的 headless runtime 包。",
        stableLabel: "稳定版",
        releaseNotesLabel: "版本说明",
        packageIncludesLabel: "内含 CLI、daemon 与 MCP connector",
        recommendation: {
          label: "推荐给这台设备",
          fallbackTitle: "选择正确版本",
          fallbackDescription: "浏览器无法识别这台设备支持的桌面版本。",
          fallbackActionLabel: "查看全部下载",
          allDownloadsLabel: "全部下载与安装步骤",
          architectureNote: "下载前请确认操作系统与处理器架构。",
        },
        platforms: [
          {
            id: "windows-desktop-x64",
            name: "Wenlan 桌面版",
            architecture: "Windows · x64 桌面版",
            description:
              "安装内置 daemon、CLI、MCP connector 与所需 runtime libraries 的桌面 App；不\u2060需\u2060要 WSL 或 Rust toolchain。",
            actionLabel: "下载 Windows 桌面版",
            packageIncludesLabel: "桌面 App · 内置 runtime",
            guideLabel: "打开桌面版安装指南",
            setupSteps: [
              "下载并运行 x64 setup 安装程序。",
              "如果出现 SmartScreen，选择更多信息，然后选择仍要运行。",
              "打开 Wenlan；App 会启动内置 daemon，并提供连接检测到的 AI 客户端。",
              "查看 App 状态，或运行 wenlan doctor 验证本地 runtime。",
            ],
          },
          {
            id: "windows-x64",
            name: "Windows 运行环境",
            architecture: "x64 · 无界面",
            description:
              "完整原生包，包含 ONNX Runtime 与供受支持 GPU 使用的 Vulkan loader。不\u2060需\u2060要 WSL 或 Rust toolchain。",
            actionLabel: "下载 Windows runtime",
            setupSteps: [
              "下载并解压 ZIP，把所有文件保留在同一个目录。",
              "把解压后的目录加入 PATH。",
              "打开新的终端并运行 wenlan doctor。",
            ],
          },
          {
            id: "macos-arm64",
            name: "Wenlan 桌面版",
            architecture: "macOS · Apple silicon 桌面版",
            description: "最快开始阅读 Page 与检查来源的方式。",
            actionLabel: "下载 macOS 桌面版",
            packageIncludesLabel: "桌面 App · 内含本地 runtime",
            guideLabel: "打开安全安装指南",
            setupSteps: [
              "下载 DMG，并将 Wenlan 拖入 Applications。",
              "从 Applications 打开 Wenlan，并确认它能连接本地 daemon。",
              "若安装失败，请使用可检查的安全安装指南验证准确的 GitHub release。",
            ],
          },
          {
            id: "macos-runtime-arm64",
            name: "macOS 运行环境",
            architecture: "Apple silicon · 无界面",
            description: "CLI、daemon 与 MCP connector；本地 model 路径支持 Metal。",
            actionLabel: "下载 macOS runtime",
            setupSteps: [
              "下载并解压 TAR.GZ。",
              "把可执行文件移到 PATH 内的目录。",
              "运行 wenlan doctor 验证本地 runtime。",
            ],
          },
          {
            id: "linux-x64",
            name: "Linux",
            architecture: "x64 · glibc",
            description: "适用于常见 x86_64 Linux 系统的预编译 runtime。",
            actionLabel: "下载 Linux x64",
            setupSteps: [
              "下载并解压 TAR.GZ。",
              "把可执行文件移到 PATH 内的目录。",
              "运行 wenlan doctor 验证本地 runtime。",
            ],
          },
          {
            id: "linux-arm64",
            name: "Linux",
            architecture: "ARM64 · glibc",
            description: "适用于 aarch64 Linux 系统的预编译 runtime。",
            actionLabel: "下载 Linux ARM64",
            setupSteps: [
              "下载并解压 TAR.GZ。",
              "把可执行文件移到 PATH 内的目录。",
              "运行 wenlan doctor 验证本地 runtime。",
            ],
          },
        ],
        setup: {
          title: "安装并验证",
          description: "使用引导式安装，或按照平台的完整步骤操作。",
          command: "npx -y wenlan setup",
          guideLabel: "打开安装指南",
        },
        page: {
          seo: {
            title: "下载 Wenlan Windows、macOS 与 Linux 版",
            description:
              "下载 Windows x64 或 macOS Apple silicon 的 Wenlan 桌面 App，或安装支持 Windows、macOS 与 Linux 的 headless CLI、本地 daemon 与 MCP connector。",
          },
          breadcrumbs: {
            home: "首页",
            current: "下载",
          },
          eyebrow: "Wenlan 本地运行环境",
          title: "下载 Wenlan",
          description:
            "选择一个正式发布的版本、保留包内全部文件，再验证本地 runtime，之后才连接 AI 工具。",
          buildsTitle: "选择你的版本",
          buildsDescription: "当前 release 提供 Windows x64 与 macOS Apple silicon 桌面版，以及四个原生 headless runtime 包。",
          verifyTitle: "连接前先验证",
          verifyDescription:
            "安装后运行诊断。它会检查本地 runtime，并告诉你下一个修复步骤。",
          releaseSourceLabel: "查看 release 来源",
          setupGuideLabel: "阅读完整安装指南",
          getStartedLabel: "继续开始使用",
        },
      },
      useCases: {
        eyebrow: "使用场景",
        title: "给 code、客户工作、研究用的\nLLM wiki。",
        description:
          "Wenlan 把 repo 事实、客户限制、source trails 和读书笔记变成 agent 能简报、召回、交接的 source-cited 页面。",
        evidenceLabel: "Agent 可引用的页面",
        outcomeLabel: "可引用页面",
        actionsLabel: "Agent 动作",
        index: {
          title: "Wenlan Wiki 索引",
          activeViewLabel: "当前视图",
          pagesTitle: "Agent 可引用的页面",
          pagesLabel: "页面",
          sourcesLabel: "来源",
          statusLabel: "状态",
          sourceBackedLabel: "有来源",
          citationLabel: "Agent 引用",
          citingLabel: "引用中的页面",
        },
        scenarios: [
          {
            id: "dev-codebase",
            label: "Dev / codebase 工作",
            railLabel: "代码",
            summary: "会持续更新的工程文档",
            lead: "维护工程师真的会更新的 codebase 文档。",
            body: "Wenlan 可以把 repo 事实整理成有来源的工程 Pages：架构地图、runbook、migration plan、integration note、debugging log。更新情况取决于已配置的处理流程与来源变更。",
            evidence: [
              {
                id: "architecture",
                label: "架构地图",
                detail: "服务边界、数据流、owner、runtime constraints，以及会随代码改变的 diagrams。",
              },
              {
                id: "failed-paths",
                label: "操作手册",
                detail: "如何重现、release、rollback、监控或操作系统，不必再问上一位工程师。",
              },
              {
                id: "dependency-research",
                label: "Migration 计划",
                detail: "Schema 变更、API migration、rollout 阶段、blocked paths，以及跨 session 的 cleanup tasks。",
              },
              {
                id: "open-threads",
                label: "集成笔记",
                detail: "Dependency quirks、版本限制、adapter decisions，以及连到 source docs 的 upstream issues。",
              },
            ],
            outcome: "下一个 agent 可以打开工程 Page，检查它的来源。",
          },
          {
            id: "product-customers",
            label: "Product / 客户工作",
            railLabel: "客户工作",
            summary: "通话、限制、proposal",
            lead: "让下一份 proposal 带着客户 context 开始。",
            body:
              "下一份 proposal 前，产品团队、顾问和自由工作者可以召回客户反对点、client constraint，以及真正改变方案的取舍。",
            evidence: [
              {
                id: "customer-voice",
                label: "客户反对点",
                detail: "访谈、support、sales notes 中反复出现的需求和反对理由。",
              },
              {
                id: "client-constraints",
                label: "Client 限制",
                detail: "每个 client space 的品牌、预算、审批、法务或交付限制。",
              },
              {
                id: "decision-rationale",
                label: "Proposal 取舍",
                detail: "为什么某个 roadmap、proposal 或 pricing 取舍胜过其他选项。",
              },
              {
                id: "follow-up-threads",
                label: "后续 owner",
                detail: "下一次会议前要追的问题、承诺的下一步，以及负责人。",
              },
            ],
            outcome: "下一份 proposal 从客户反对点、限制、取舍和 owner 开始。",
          },
          {
            id: "research-writing",
            label: "Research / 写作",
            railLabel: "研究",
            summary: "sources、有引用的页面、下一版 outline",
            lead: "把研究脉络变成可引用的 wiki 页面。",
            body: "Papers、docs、transcripts 和 links 堆起来后，下一稿可以从可信 quote、待重查 claim，以及有引用的 outline 接续。",
            evidence: [
              {
                id: "trusted-sources",
                label: "可信 quote",
                detail: "你已经决定信任的 papers、docs、transcripts 和 links。",
              },
              {
                id: "comparison-notes",
                label: "比较 note",
                detail: "工具、主张或标准之间哪里改变，并保留完整 source trail。",
              },
              {
                id: "outline-decisions",
                label: "下一稿 outline",
                detail: "下一稿要延续的论点、段落顺序和开放问题。",
              },
              {
                id: "stale-claims",
                label: "待重查 claim",
                detail: "放进公开文案前，需要重新确认的事实。",
              },
            ],
            outcome: "写作从有引用的 working page 接续，而不是从一堆 tabs 重开。",
          },
          {
            id: "learning-study",
            label: "学习与读书",
            railLabel: "学习",
            summary: "概念、前置知识、复习",
            lead: "把读书 session 变成能教下一次的页面。",
            body: "终于想通的解释会变成概念页面，前置知识也链接好，下一次 session 是在复习理解，而不是回头翻聊天记录。",
            evidence: [
              {
                id: "concept-pages",
                label: "概念页面",
                detail: "那个终于说通的解释，连同让它成立的来源一起留下。",
              },
              {
                id: "prerequisite-links",
                label: "前置链接",
                detail: "每个概念建立在什么之上，先链好，让知识缺口在造成代价前现形。",
              },
              {
                id: "review-notes",
                label: "复习笔记",
                detail: "上次哪里想错，以及修正它的那个更正。",
              },
              {
                id: "study-plan",
                label: "读书计划",
                detail: "接下来该读什么，按你已掌握的前置知识排序。",
              },
            ],
            outcome: "下一次读书 session 打开的是概念页面，不是上周的聊天滚动。",
          },
        ],
      },
      sections: {
        problem: {
          eyebrow: "问题",
          title: "新的 AI session 可能从冷启动开始。",
          body: "工作已经发生，但 context 可能没有留下来。决策、修 bug 的教训和项目直觉可能困在旧聊天里，没有帮到下一个 agent。",
          note: "少了一次 handoff，下一段对话可能就会重跑上一段工作。",
        },
        solution: {
          eyebrow: "Wenlan 带来什么",
          title: "让这次的工作，下次接得上。",
          body: "完成设置后，Wenlan 可以在工作发生时捕捉决策、教训和下一步，并在下一个 agent 开始时提供 handoff。",
          note: "下一段对话可以先读交接记录，再决定要查哪些来源，不必只靠回想之前聊过什么。",
          visualLabels: {
            start: "开始",
            capture: "捕捉",
            handoff: "交接",
            resume: "接续",
          },
        },
        memoryDistillery: {
          eyebrow: "刻意蒸馏",
          title: "Wenlan 把重复出现的 context 变成 LLM wiki。",
          body: "当重复捕捉的内容值得变成可读的 wiki 页面时，运行 /distill。可选的本地模型或 API key 路径可以加入背景提取与页面更新。",
          note: "已配置的下一次运行可以从有引用的 context 开始，而不是从 transcript 残留开始。",
          visualLabels: {
            merged: "合并",
            linked: "连接",
            refined: "精炼",
          },
        },
        features: {
          eyebrow: "知识页面",
          title: "工作会变成可重用的页面。",
          body: "整理过的决策与教训会成为耐用页面，而不是被埋在聊天记录里。它们足够有组织，agent 能使用；也足够具体，人可以阅读。",
          note: "你的工作不再只是 transcript 历史，而是开始变成项目知识。",
        },
        humanControl: {
          eyebrow: "混合存储",
          title: "daemon 负责 recall，可读 artifacts 仍然可检查。",
          body: "Wenlan 把原始 captures 保存在本地 daemon store 供 retrieval 使用，再投射出你可以打开、diff、移动的 pages、handoffs 和 status files。",
          note: "Agents 从 daemon recall。你检查可读文件。",
        },
        openSourceCta: {
          eyebrow: "开源",
          title: "代码公开，让你自由探索。",
          body: "从本地运行核心到桌面 App，你都能查看源代码，也能自行构建 Wenlan。",
          note: "运行核心与 plugins：Apache-2.0。桌面 App：AGPL-3.0-only。",
          primaryCta: { id: "download", href: "#download", label: "下载 Wenlan" },
          secondaryCta: {
            id: "github",
            href: "https://github.com/7xuanlu/wenlan",
            label: "在 GitHub 查看",
          },
          waitlistHeading: "订阅 Wenlan 的版本更新。",
          waitlist: {
            successMessage: "订阅资料已保存。",
            pendingLabel: "保存中…",
            submitLabel: "订阅更新",
            emailLabel: "电子邮件地址",
            purpose: "仅用于 Wenlan 版本更新。",
            emailPlaceholder: "you@example.com",
            fallbackError: "发生错误，请再试一次。",
            errors: {
              required: "请输入电子邮件地址。",
              invalid: "请输入有效的电子邮件地址。",
              notConfigured: "订阅功能尚未开放。",
              unknown: "发生错误，请再试一次。",
            },
          },
        },
      },
      metrics: {
        eyebrow: "Hybrid retrieval，实测",
        title: "每次查询，需要带回多少内容？",
        description: "在固定的 500 道检索测试题中，对比完整对话重放与 Wenlan 检索到的上下文。",
        headers: {
          surface: "表面",
          scope: "范围",
          result: "结果",
        },
        rows: [
          {
            id: "full-replay",
            surface: "完整重放",
            scope: "不使用 retrieval",
            result: "每次查询 4,505 tokens / query",
          },
          {
            id: "lme-oracle",
            surface: "LME_Oracle",
            scope: "CE-reranked，500 Q",
            result: "每次查询 168 tokens / query · 93.6% R@5 · 0.883 NDCG@10",
          },
          {
            id: "lme-s",
            surface: "LME_S",
            scope: "CE-reranked，N=90 deep-S",
            result: "每次查询 168 tokens / query · 87.7% R@5 · 0.822 NDCG@10",
          },
        ],
        note:
          "固定 fixture 上的 retrieval-only snapshots。LME_Oracle 也记录 0.857 MRR；LME_S 在 90-question deep-S fixture 的 84 个可评分 rows 上记录 0.815 MRR。这不是一般的时间或 token 节省保证，也不是 Wenlan 与其他工具的比较。Token 对比只限于这项 retrieval 测试中的完整重放与 retrieved context。",
        link: {
          id: "harness",
          href: "https://github.com/7xuanlu/wenlan/tree/main/crates/wenlan-core/src/eval",
          label: "自己运行 harness。",
        },
      },
      faqs: {
        eyebrow: "常见问题",
        title: "常见问题。",
        items: [
          {
            id: "what-is-wenlan",
            q: "Wenlan 是什么？",
            a: "Wenlan 是本地 AI 知识库与 LLM wiki。连接 AI 工具后，可以保存决策并再次找回；生成页面需要已配置的模型或 AI 工具。使用答案前，仍要核对它引用的来源。",
          },
          {
            id: "built-in-memory",
            q: "Wenlan 和 AI 工具内置的记忆有什么不同？",
            a: "内置记忆的行为因工具而异，请实际比较导出、来源、编辑及跨工具访问。Wenlan 把知识留在本地，提供可检查的页面，并保留生成页面时使用的来源记录 ID。",
          },
          {
            id: "retrieval-quality",
            q: "怎么看 Wenlan 的检索评测？",
            a: "Hybrid retrieval 结合 vector search (BGE-Base-EN-v1.5-Q, 768-dim)、FTS5、reciprocal-rank fusion、knowledge-graph context 和本地 BGE reranker。LME_Oracle 在 500-question snapshot 上是 93.6% Recall@5、0.857 MRR、0.883 NDCG@10。LME_S 在 stratified N=90 deep-S snapshot 上是 87.7% Recall@5、0.815 MRR、0.822 NDCG@10。这些 fixture-specific 分数不代表正确性，也不能证明每个 claim。Eval harness 放在 repo 的 crates/wenlan-core/src/eval/。",
          },
          {
            id: "privacy",
            q: "我的数据是私密的吗？",
            a: "是。Wenlan 在你的机器上运行，数据库也存放在本地。默认没有 cloud sync 或 telemetry。本地 memory setup 不需要模型或 API key。On-device models 或 Anthropic key 只有在你选择启用 automatic page distillation、recaps 和更丰富 graph work 时才会使用。",
          },
          {
            id: "memory-mcp",
            q: "Wenlan 只是另一个 memory MCP 吗？",
            a: "不是。MCP server 是 connector。Wenlan 也包含本地 daemon、manual /distill、可选的 model-backed extraction 与 Page work、本地 retrieval、source references、review surfaces、memory、Page 和 session artifacts 的真实 git versioning，以及可读的 Markdown export paths。",
          },
          {
            id: "tools",
            q: "哪些 AI 工具可以搭配 Wenlan？",
            a: "Claude Code 和 Codex 有 plugin 路径。Cursor、Claude Desktop、VS Code、Antigravity 和其他支持的本地 clients 通过 Wenlan 的 MCP server 连接。ChatGPT 和 Claude.ai 使用 Streamable HTTP MCP，desktop app 的 Remote Access 提供引导式路径。Obsidian 是只读的来源工作流，不是这份清单中的 MCP 客户端。Remote Access 没有身份验证；任何拿到 URL 的人都能访问 Wenlan，因此不用时请停止 Remote Access。",
          },
          {
            id: "not-notes",
            q: "Wenlan 能取代 Notion 或 Obsidian 吗？",
            a: "不能。Wenlan 不是 notes app。它可以把 Markdown、text、可提取文字的 PDF、文件夹和 Obsidian vault 登记为来源。Obsidian 输入是只读，按需重新同步；Wenlan 自己的 Pages 仍是 ~/.wenlan/ 底下可读的 Markdown。",
          },
          {
            id: "setup",
            q: "我要怎么设置？",
            a: "先安装 runtime 并连接 client。Claude Code 使用 marketplace plugin 和 /setup。Codex 可以使用 Wenlan plugin，或运行 wenlan connect codex。其他本地 clients 使用 wenlan connect <client>。ChatGPT 和 Claude.ai 通过 desktop app 的 Remote Access URL 使用 Streamable HTTP MCP。本地 capture 与 retrieval 可以不使用 model 或 API key；automatic Page distillation 和后台处理需要已配置的 on-device model 或 provider API key。该 URL 没有身份验证，请视为秘密，并在不用时停止 Remote Access。",
          },
          {
            id: "platforms",
            q: "Wenlan 支持 Windows 或 Linux 吗？",
            a: "支持。当前预编译 daemon release 覆盖 macOS Apple Silicon、Linux (x86_64, aarch64; glibc) 和 Windows (x86_64)。macOS Intel 仍可走 source/dev 路径，但目前没有 macOS Intel 预编译运行时。Service registration 在 macOS 使用 launchd、Linux 使用 systemd-user、Windows 使用 Task Scheduler (schtasks)。",
          },
          {
            id: "spaces",
            q: "我可以把工作和个人 memory 分开吗？",
            a: "可以。Memories、pages 和 recalls 都属于一个 space，例如 work、personal 或 client-X。你可以用 WENLAN_SPACE 在每个 shell 设置 active space，或在 ~/.wenlan/spaces.toml 声明。Auto-detector 也会从当前 repo 或 workspace 选择 space。",
          },
          {
            id: "free",
            q: "Wenlan 免费吗？",
            a: "是。Wenlan 是 open-source。Wenlan repo 里的本地 runtime、CLI、MCP server、Claude Code plugin 和 Codex plugin files 都是 Apache-2.0。",
          },
        ],
      },
      redesign: {
        hero: {
          eyebrow: "你与 AI 共用的 Living Wiki",
          headline: { pre: "笔记一直在积累，", emphasis: "工作却还得从头来？", post: "" },
          description:
            "文澜把文档、笔记与工作中积累的决策，整理成有来源、能持续更新的 Wiki。让你和 AI 不只是找回资料，更能基于已有的理解，接着往前做。",
          worksWithLabel: "可搭配",
          worksWithNote: "可读取 Obsidian 笔记，保留原文。",
        },
        pains: {
          "title": "选择适合你的知识工作流。",
          "intro": "不只比较功能：看看平常在哪里工作、哪些整理可以交出去、哪些决定仍由你做。",
          "scopeNote": "Wenlan 也是 LLM Wiki 的一种实现；不同方式可以搭配使用。",
          "dimensions": [
            "平常怎么用？",
            "哪些整理会自动做？",
            "什么时候要我决定？"
          ],
          "detailsLabel": "工作方式与来源",
          "helpLabel": "更多背景",
          "accessNote": "Wenlan 需要先连接来源和模型，再建立首批页面。之后可使用桌面 App，也可继续使用 plugin／CLI 与本地 daemon。",
          "generations": [
            {
              "id": "wiki-graveyard",
              "name": "AI 工具＋文件",
              "eyebrow": "Word · PDF · PPT · Markdown",
              "summary": "AI 能替你读写文件；Wenlan 再把来源追踪、知识页更新与修订审核整合好，让工作留下的不只是回答，而是一份持续维护的知识库。",
              "profileLabels": [
                "直接读写文件，完成交办任务",
                "更新相关知识，需另建机制",
                "文件有管控，知识审核另建"
              ],
              "profile": [
                "AI 读文件、问答或改稿，产出可保存复用；跨来源 Wiki 与维护流程需额外构建。",
                "可读新版、保留记忆；追踪来源变化、找出过时页面并刷新，需额外构建机制。",
                "用权限与差异检查管控改文件；哪些知识页可自动更新、哪些需审核，仍需另建规则。"
              ],
              "body": "这里比较原生 AI 直接处理文件、尚未额外构建 Wiki 维护系统的做法，不代表每种 AI 产品。Claude Code 有跨对话的 auto memory；官方将记忆上下文与强制执行机制分开。hooks 可执行自定义自动化，但来源与页面的关联、过期判定及修订分流，仍需实现与验证，不是一段提示词就能提供的系统。Wenlan 已整合这些机制；产出仍需核对依据与内容版本。直接目录来源支持 Markdown、text（纯文本）与 text-extractable PDF；Word 与 PowerPoint 先导出为 text/Markdown 或 text-extractable PDF，scanned PDF 单独做 OCR。新主题不保证自动建页；后台刷新需要已配置且可用的模型。",
              "sources": [
                {
                  "label": "Markdown 格式",
                  "href": "https://commonmark.org/help/"
                },
                {
                  "label": "Claude Code 文档上下文",
                  "href": "https://code.claude.com/docs/en/memory"
                },
                {
                  "label": "Claude Code 自动化 hooks",
                  "href": "https://code.claude.com/docs/en/hooks-guide"
                },
                {
                  "label": "从文档建立本地 AI 知识库",
                  "href": "https://wenlan.app/learn/build-local-ai-knowledge-base-from-documents"
                }
              ],
              "wenlan": {
                "labels": [
                  "内置维护流程的 AI 知识库",
                  "相关知识，随来源一起维护",
                  "原文件保留，你写的内容先审再改"
                ],
                "profile": [
                  "文档与保存的决策整理成带引用的 Wiki；从已连接的 AI 工具找回上次结论与依据，接着工作。",
                  "新决策可以补入既有页面；已连接文件或记忆内容修改后，后台模型刷新符合条件的受影响页面。",
                  "来源文件不回写；AI 更新你编辑过的知识页前先提出修订，由你接受或拒绝，变更历史可查。"
                ],
                "emphasis": []
              }
            },
            {
              "id": "llm-wiki-workflow",
              "name": "LLM Wiki · nashsu",
              "tabLabel": "LLM Wiki",
              "eyebrow": "nashsu/llm_wiki · 开源项目",
              "summary": "两者都有文件夹监控，也不只处理文档。Wenlan 还跟踪每条知识与引用它的页面；LLM Wiki 则以来源与 Wiki 页面的整理为主。",
              "profileLabels": [
                "以桌面 Wiki 项目为中心",
                "以来源与 Wiki 页面为单位",
                "导入继续，审核事项另列"
              ],
              "profile": [
                "在 App 导入文档、提问与保存回答；外部 AI 工具也能通过 MCP 连接，但 App 需要保持运行。",
                "来源文件变化或回答存回 Wiki 后，可以自动整理页面；研究结果也直接存成页面。",
                "导入先写入页面；Review 列出补充研究或新建页面等事项，不会阻塞导入。"
              ],
              "body": "这里比较 nashsu/llm_wiki，不是 Karpathy 的方法或整个 LLM Wiki 类别。它支持引用、Review、MCP 和 skills。配置导入模型后，把回答「存回 Wiki」也能自动整理；DeepResearch 直接写入附引用的问答页，不再进入来源导入流程。删除来源时，也会清理受影响的页面与链接。Business 模板则在决策页记录状态与 supersedes。Wenlan 把决策保存为独立记录：修改、删除或接受替代修订后，标记引用该记录的页面待更新；接受修订时，也把页面的依据连到新记忆。新记录还可补入匹配的既有页面。后台刷新需要可用模型与符合条件的页面；人改过的页面先提出修订，批准后才修改原文。nashsu 的导入则先写入页面，再列出 Review 待办。这些是实现差异，不等于易用性或内容正确性的保证。",
              "sources": [
                {
                  "label": "Karpathy 的 LLM Wiki 方法",
                  "href": "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f"
                },
                {
                  "label": "nashsu/llm_wiki",
                  "href": "https://github.com/nashsu/llm_wiki"
                },
                {
                  "label": "llm_wiki ingest 流程",
                  "href": "https://github.com/nashsu/llm_wiki/blob/main/src/lib/ingest.ts"
                },
                {
                  "label": "llm_wiki MCP 服务器",
                  "href": "https://github.com/nashsu/llm_wiki/blob/main/mcp-server/README.md"
                },
                {
                  "label": "llm_wiki 页面模板",
                  "href": "https://github.com/nashsu/llm_wiki/blob/main/src/lib/templates.ts"
                },
                {
                  "label": "llm_wiki 回答存回后的整理",
                  "href": "https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/components/chat/chat-message.tsx#L547-L626"
                },
                {
                  "label": "llm_wiki DeepResearch 输出",
                  "href": "https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/lib/deep-research.ts#L505-L545"
                },
                {
                  "label": "llm_wiki 删除来源后的清理",
                  "href": "https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/lib/source-lifecycle.ts#L457-L574"
                },
                {
                  "label": "Wenlan 单元记忆与页面依据",
                  "href": "https://github.com/7xuanlu/wenlan/blob/af646ddcf705ee7450335a8772a8cb196f89a3a1/crates/wenlan-core/src/db.rs#L31034-L31143"
                }
              ],
              "wenlan": {
                "labels": [
                  "沿用 AI 工具，不必另开 App",
                  "改一条知识，找出受影响的页面",
                  "你写的页面，先审再改"
                ],
                "profile": [
                  "设置完成后，在已连接的 AI 工具中保存、查找知识；本地后台服务运行，不必打开桌面 App。",
                  "修改、删除记忆或接受替代修订后，自动标记引用它的既有页面；后台服务再刷新符合条件的页面。",
                  "AI 想更新你亲自写过的页面时，先提出修订；原文等你批准后才修改。"
                ],
                "emphasis": []
              }
            },
            {
              "id": "llm-wiki-1",
              "name": "Obsidian",
              "eyebrow": "Obsidian · 本地 Markdown vault",
              "summary": "你可以继续用 Obsidian 写笔记，让 Wenlan 读取原文，另外维护一份给你和 AI 共用的 Wiki。",
              "profileLabels": [
                "直接写自己的 Markdown 笔记",
                "交给选用的插件处理",
                "由你决定工具能改什么"
              ],
              "profile": [
                "在 vault 中写笔记、连接想法；需要 AI 时，再连接插件或外部工具。",
                "把 AI 搜索、改写或整理交给插件；由你选择功能、设置规则并维护插件。",
                "vault 由你保管；选择插件与备份方式，确认 AI 是否能写入原笔记。"
              ],
              "body": "适合想自己撰写、整理与连接笔记的人，Markdown 文件保存在自己的设备上。需要 AI 搜索、摘要或改写时，可以另外安装插件或连接 AI 工具。插件与同步服务可能将数据传到其他服务；笔记保存在本地，不代表所有 AI 处理都在本地。",
              "sources": [
                {
                  "label": "Obsidian 如何存储数据",
                  "href": "https://obsidian.md/help/data-storage"
                },
                {
                  "label": "社区插件",
                  "href": "https://obsidian.md/help/community-plugins"
                },
                {
                  "label": "插件安全与数据访问",
                  "href": "https://obsidian.md/help/plugin-security"
                }
              ],
              "wenlan": {
                "labels": [
                  "保留 vault，另外维护 Wiki",
                  "笔记变化，知识页跟着更新",
                  "原笔记不动，修改先审核"
                ],
                "profile": [
                  "将 vault 作为只读来源；继续写原笔记，Wenlan 另建供你和 AI 使用的知识页。",
                  "完成 Wenlan 配置后，后台跟踪已连接来源，刷新符合条件的页面，不改写原来的 vault。",
                  "Wenlan 不写回 vault；你改过的页面也先提出修订，再由你决定。"
                ],
                "emphasis": []
              }
            },
            {
              "id": "vault-agents",
              "name": "Notion",
              "eyebrow": "Notion · 云端工作区",
              "summary": "Notion 让你为工作区任务配置 Agent；Wenlan 把来源跟踪、知识页维护和修改审核做成内置流程。两者都能自动运行。",
              "profileLabels": [
                "在共享工作区中安排工作",
                "你设定任务，Agent 自动运行",
                "你掌握规则与工作区权限"
              ],
              "profile": [
                "用页面、数据库和权限组织个人或团队工作；Notion Agent 可以创建和编辑。",
                "Custom Agents 可以按计划或事件运行；先设置指示、触发条件和访问权限。",
                "设置 Agent 的访问范围，查看活动日志，再使用 Notion 的历史与还原功能。"
              ],
              "body": "Notion 是个人与团队共用的云端工作区，不只是数据库或被动笔记。Notion Agent 可以搜索、创建和编辑；Custom Agents 还能按事件或计划在后台运行，包括知识维护。你可以使用模板或自行设置指示、触发条件和访问权限，再查看活动日志，使用 Notion 的历史与还原功能。官方文档列出 Custom Agents 需要 Business 或 Enterprise 方案。云端内容可以下载离线使用或导出备份。差别在于通用工作区自动化与 Wenlan 内置的知识维护流程，而不是 Notion 没有自动化或不能连接外部工具。",
              "sources": [
                {
                  "label": "Notion Agent 说明",
                  "href": "https://www.notion.com/help/notion-agent"
                },
                {
                  "label": "Custom Agents：触发、权限与审核",
                  "href": "https://www.notion.com/help/custom-agents"
                },
                {
                  "label": "离线页面",
                  "href": "https://www.notion.com/help/use-pages-offline"
                },
                {
                  "label": "导出备份",
                  "href": "https://www.notion.com/help/back-up-your-data"
                }
              ],
              "wenlan": {
                "labels": [
                  "不必先搬进新工作区",
                  "知识维护是内置流程",
                  "亲笔内容，修改前先询问"
                ],
                "profile": [
                  "在已连接的 AI 工具中保存、查找知识；文档与决策留在本地，不必更换编辑器。",
                  "来源变化后，后台跟踪受影响页面并刷新；你写过的页面会变成待审修订。",
                  "你决定是否接受页面修订；机器维护页面按配置更新，并保留变更历史。"
                ],
                "emphasis": []
              }
            },
            {
              "id": "notebooklm",
              "name": "NotebookLM",
              "eyebrow": "Google · Gemini Notebook",
              "summary": "NotebookLM 帮你理解一组来源；Wenlan 把资料与工作决策积累成 Wiki，让已连接的 AI 工具在后续工作中使用。",
              "profileLabels": [
                "围绕来源提问、制作学习材料",
                "Drive 更新，来源自动同步",
                "你选择来源与分享对象"
              ],
              "profile": [
                "选定来源后提问、摘要或制作学习材料；笔记本也能用于 Gemini 对话。",
                "支持的 Google Drive 来源会在打开笔记本时同步；上传文件则是导入时生成的副本。",
                "选择这次要引用的来源和谁能访问笔记本；不会写回原始 Drive 文档。"
              ],
              "body": "NotebookLM 是大家熟悉的产品；Google 官方文档现在将它标为 Gemini Notebook。它提供基于来源的问答、摘要和学习材料，笔记本也能用于 Gemini 对话，不能说只能停留在一个独立 App 中。支持的 Google Drive 来源会在打开笔记本时同步；本地上传文件是导入副本。你选择提问引用的来源与云端分享权限，它不会改写原始 Drive 文档。来源同步不等于保证先前生成的每份学习材料都会重新生成。",
              "sources": [
                {
                  "label": "Gemini Notebook 说明",
                  "href": "https://support.google.com/gemininotebook/answer/16215270?hl=en"
                },
                {
                  "label": "Drive 自动同步",
                  "href": "https://workspaceupdates.googleblog.com/2026/05/keep-your-sources-up-to-date-with-automatic-drive-syncing-in-NotebookLM.html"
                }
              ],
              "wenlan": {
                "labels": [
                  "把阅读结果接回工作",
                  "不只同步，还更新知识页",
                  "由你决定重要修改是否落地"
                ],
                "profile": [
                  "将结论与决策存入本地知识库，再由已连接的 AI 工具找回，用于下一次工作。",
                  "后台跟踪来源变化，刷新符合条件的既有 Wiki 页面，而不只是换一份来源副本。",
                  "你写过的页面先保留原文，AI 提出修订，由你选择接受或保留。"
                ],
                "emphasis": []
              }
            }
          ],
          "current": {
            "name": "Wenlan",
            "tagline": "AI 原生知识库",
            "summary": "为你和 AI 共用、在工作中逐步积累的知识库。",
            "body": "Wenlan 把来源文档与工作中保存的决策、经验，编成有来源的 Living Wiki。Sources、Memories、Pages 模型将决策、经验与修正保存为独立的知识记录；需要修正旧知识时，可以记录明确的替代关系，再与文档共同支撑知识页。这个知识生命周期延伸自社群 Rohitg00 LLM Wiki v2 提案讨论的方向，但不是官方版本认证。先连接来源、指定后台模型并建立首批页面；之后本地 daemon 同步已连接文件夹的变化，刷新符合条件的既有页面，并保留变更历史。新主题不保证自动建页；模型不可用、来源或引用检查未通过时，更新会暂停。你亲自编写或修改的页面先提出修订，审核通过后才修改原文；不是每一笔 AI 写入都需要批准。人与已连接的工具可通过 plugin／CLI／MCP 共用所选 Space 的知识，不必打开桌面 App。数据保存在本地；模型处理可按设置使用本地或云端服务。",
            "highlights": [
              {
                "label": "文档＋独立决策",
                "body": "来源文档与独立保存的决策、经验、修正，共同支撑知识页面。"
              },
              {
                "label": "持续维护的 Wiki",
                "body": "机器维护的页面，能根据当前支持它的来源重建。"
              },
              {
                "label": "审核＋变更历史",
                "body": "你写的内容先审再改，页面版本始终可查。"
              },
              {
                "label": "跨 AI 工具共用",
                "body": "连接好 MCP 的工具共用本地知识，不必各留一份。"
              }
            ],
            "sources": [
              {
                "label": "有来源的页面",
                "href": "https://wenlan.app/docs/source-backed-pages"
              },
              {
                "label": "审核与信任",
                "href": "https://wenlan.app/docs/review-and-trust"
              },
              {
                "label": "模型与密钥",
                "href": "https://wenlan.app/docs/models-and-keys"
              },
              {
                "label": "本地 Git 历史",
                "href": "https://wenlan.app/docs/local-git-history"
              },
              {
                "label": "Rohitg00 LLM Wiki v2 社群提案",
                "href": "https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2"
              },
              {
                "label": "Wenlan 仓库：这是什么？",
                "href": "https://github.com/7xuanlu/wenlan#what-is-this"
              }
            ]
          },
          "closer": {
            "pre": "让重要内容留下，并把",
            "emphasis": "审核",
            "post": "放进流程。"
          },
          "selectorLabel": "你现在怎样管理知识？",
          "sourcesChecked": "来源核对：2026-09-07 · 根据官方文档与源代码整理，并非实机性能评测。"
        },
        pipeline: {
          intro:
            "连接 AI 工具后，用 Wenlan 保存有用决策，再用已配置的模型生成有来源的页面；下次遇到相关问题，再把页面与依据找回。",
          stages: [
            { id: "capture", step: "/capture · 工作当下", title: "保存有用决策" },
            { id: "distill", step: "/distill · 整理来源", title: "生成有来源的页面" },
            { id: "brief", step: "/brief · 下次开始", title: "下次把它找回来" },
          ],
          distillNote: "AI 代理也能直接创建主题页；请先连接工具，确认生成内容所需的模型配置，并检查实际结果。",
          arcLabel: "/handoff 收尾每一轮",
        },
        bento: {
          cells: [
            {
              id: "pages",
              title: "留下能接着用的知识页面",
              body: "将决策与经验整理成你能阅读、AI 能使用的页面，不再只留在聊天记录里。",
            },
            {
              id: "graph",
              title: "找回答案，也找回脉络",
              body: "配置检索后，可一并找回相关人物、项目与知识页面，再沿着链接检查来源记录。",
            },
            {
              id: "citations",
              title: "答案从哪来，看得见",
              body: "Wenlan 整理出的页面附有来源链接，方便回查支持它的记录。来源链接本身不代表每个主张都已被证明。",
            },
            {
              id: "review",
              title: "先看变更，再决定采用",
              body: "已配置的审核流程可提出信心不足或互相矛盾的记录，由你判断哪些内容能用在后续工作。",
            },
            {
              id: "nurture",
              title: "知道哪些内容需要重查",
              body: "配置后台处理后，可批量建立关联、更新匹配页面，并标记过时记录供你检查。",
            },
            {
              id: "spaces",
              title: "不同工作的知识，分开管理",
              body: "用 Spaces 区分工作、个人或客户项目。工具与使用中的空间需正确配置，才能按空间保存及检索。",
            },
            {
              id: "git",
              title: "像代码一样有版本",
              body: "记录、页面与会话产物保存在真正的 Git 历史里，可以查看差异，也可以还原。",
            },
            {
              id: "mcp",
              title: "不同工具，接着同一份知识",
              body: "已配置的 MCP 工具可通过同一个本地服务读取记录；连接配置与工具权限决定可访问的范围。",
            },
          ],
        },
        storage: {
          title: "记得意思，\n却忘了当时怎么写？",
          intro:
            "Hybrid Retrieval 结合关键词、语义与关联脉络，帮助找回相关知识。配置好的页面处理流程，再将来源整理成能阅读、核对与保存的 Markdown。",
          indexLabel: "索引 · agents 的工作记忆",
          filesLabel: "Markdown · 属于你的长期记录",
          fusionNote: "索引帮你找回资料，页面让你阅读与核对；两者各有用途。",
          distillCaption: "整理成页",
          ingestCaption: "索引页面",
          tradeoffs: [
            {
              id: "files-alone",
              title: "纯文件",
              body: "适合你或 agent 能直接搜索的小型、稳定集合。集合变大或变动后，可能需要明确的 retrieval 和审核。",
            },
            {
              id: "db-alone",
              title: "索引",
              body: "适合对已配置来源快速查找；如果人需要检查变更，应搭配可读 artifacts 和审核路径。",
            },
            {
              id: "index-files",
              title: "索引加文件",
              body: "把查找与可读、有版本的 artifacts 放在一起。是否适合取决于来源边界和维护流程。",
            },
          ],
        },
        metrics: {
          title: "Retrieval snapshot 范围。",
          bars: [
            {
              id: "full-replay",
              label: "完整聊天重播",
              value: "每次查询 4,505 tokens / query",
              sub: "不使用 retrieval，整份 transcript 进 context",
            },
            {
              id: "wenlan",
              label: "Wenlan 检索",
              value: "每次查询 168 tokens / query",
              sub: "CE-reranked，500 题 snapshot",
            },
          ],
          footnote:
            "固定 fixture 上的 retrieval-only snapshots。LME_S 在 stratified N=90 deep-S fixture 上记录 87.7% R@5 和 0.815 MRR。这不是一般的时间或 token 节省保证，也不是 Wenlan 与其他工具的比较。Token 对比只限于这项 retrieval 测试中的完整重放与 retrieved context。",
        },
      },
    },
  },
  about: {
    status: "translated",
    sourceHash: "44266d4638cfe5dad5251ef0fc23d3bcfda504f00bad1a0d397fecc0efae93bb",
    content: {
      seo: {
        title: "关于 Wenlan | AI 工作的 LLM wiki",
        description:
          "Wenlan 是 open-source、local-first 的 AI 工作 LLM wiki，由 AI 代理建立，并以来源为根基。",
      },
      breadcrumbs: {
        home: "Wenlan",
        current: "关于",
      },
      hero: {
        eyebrow: "关于",
        title: "AI 工作的 LLM\u00a0wiki。",
        description:
          "AI 代理捕捉学到的内容，你加入信任来源，Wenlan 让有来源依据的 wiki 页面在 AI 工作中保持最新。",
        statusLabel: "项目状态",
        statusItems: ["版本 v0.18.5", "支持 macOS、Linux、Windows", "Apache-2.0", "Qi-Xuan Lu 构建"],
      },
      sections: [
        {
          id: "why",
          number: "01",
          title: "为什么 Wenlan 存在",
          paragraphs: [
            "AI 工作已经变成严肃工作，但大多数 sessions 仍像一次性对话一样结束。决策、debugging lessons、项目限制和 handoffs 都被埋在旧 chats 里。",
            "Wenlan 是为了让工作积累成 LLM wiki 而建。AI 代理可以保存重要内容，之后 recall，并让有来源依据的 refined context 跨 MCP-compatible tools 持续可用。",
          ],
        },
        {
          id: "builder",
          number: "03",
          title: "由 Qi-Xuan Lu 构建",
          paragraphs: [
            "Wenlan 由 Qi-Xuan Lu (GitHub @7xuanlu) 构建与维护。背景涵盖 AI infrastructure、knowledge graphs 和 local-first systems。",
            "这项工作聚焦在 agent 能构建、用户能检查的 LLM wiki：libSQL 上的 hybrid retrieval、可读页面的真实 git versioning、session handoffs、status artifacts、distilled pages 的 mandatory provenance，以及一个 daemon 服务多种 AI tools。",
            "项目渠道：bugs 和 feature requests 用 GitHub Issues，vulnerabilities 看 SECURITY.md，变更则看 Wenlan release notes。",
          ],
        },
        {
          id: "status",
          number: "04",
          title: "当前状态",
          paragraphs: [
            "Wenlan v0.18.5 提供已公证的 macOS Apple Silicon DMG 与 Windows x64 桌面版，以及 macOS、Linux (x86_64, aarch64; glibc) 和 Windows (x86_64) 原生 headless runtime 包。Windows 用户可以选择桌面版 setup 安装程序或 headless runtime ZIP。daemon、CLI、MCP server、Claude Code plugin 与 Codex plugin 采用 Apache-2.0；桌面 App crate 采用 AGPL-3.0-only。",
          ],
        },
      ],
      principles: {
        title: "设计原则",
        items: [
          {
            id: "local-first",
            title: "本地优先",
            body: "Memory 从你的机器开始。Cloud sync、telemetry、本地模型和 API keys 都是 opt-in，而不是默认的 source of truth。",
          },
          {
            id: "human-readable",
            title: "人可阅读",
            body: "Memory、page 和 session writes 会在本地 git 留下 Markdown artifacts。daemon database 负责 retrieval，而有来源引用的 artifacts 仍可检查。",
          },
          {
            id: "session-rhythm",
            title: "Session 节奏",
            body: "Wenlan 顺着 AI 工作实际发生的方式：加载 context、捕捉 durable facts、写 handoffs，并把正确 context 带进下一次运行。",
          },
          {
            id: "deliberate-distillation",
            title: "刻意蒸馏",
            body: "Sessions 之间，Wenlan 会 deduplicate 重复 facts 并连接相关 ideas。当一个 topic 值得成为 source-backed page 时，运行 /distill；本地模型或 API keys 可以加入 automatic page distillation 和更丰富的 graph work。",
          },
        ],
      },
      projectLinksHeading: "开源",
      projectLinks: [
        {
          id: "repository",
          href: "https://github.com/7xuanlu/wenlan",
          label: "GitHub 代码库",
        },
        {
          id: "license",
          href: "https://github.com/7xuanlu/wenlan/blob/main/LICENSE",
          label: "Apache-2.0 授权",
        },
        {
          id: "contributing",
          href: "https://github.com/7xuanlu/wenlan/blob/main/CONTRIBUTING.md",
          label: "贡献指南",
        },
        {
          id: "security",
          href: "https://github.com/7xuanlu/wenlan/blob/main/SECURITY.md",
          label: "安全政策",
        },
      ],
      help: {
        eyebrow: "帮助",
        bodyPrefix: "Bugs 和 feature requests 请使用 GitHub Issues。Vulnerabilities 请遵循",
        securityLink: {
          id: "security-reporting-guide",
          href: "/docs/security",
          label: "安全报告指南",
        },
        bodySuffix: "。",
      },
      cta: {
        primary: { id: "get-started", href: "/docs/get-started", label: "开始使用" },
        secondary: {
          id: "github",
          href: "https://github.com/7xuanlu/wenlan",
          label: "在 GitHub 查看",
        },
      },
      schema: {
        name: "关于 Wenlan",
        description:
          "Wenlan 是 open-source、local-first 的 AI 工作 LLM wiki，由 Qi-Xuan Lu 构建。",
      },
    },
  },
  docs: {
    status: "translated",
    sourceHash: "e21926e641813121b13ad92603d66fca7d97494042cca9bf3bdb51157e0c8527",
    content: {
      seo: {
        title: "Wenlan 文档 | AI 工作的 LLM wiki",
        description:
          "安装 Wenlan，学习 AI 工作记忆循环，理解有来源依据的 wiki 页面、provenance、retrieval 和 MCP clients 如何配合。",
      },
      breadcrumbs: {
        home: "Wenlan",
        current: "文档",
      },
      hero: {
        eyebrow: "文档",
        title: "开始使用 Wenlan。",
        description:
          "安装 Wenlan、连接你使用的 AI tools，并构建可读、可搜索、由你掌控的 source-backed LLM wiki。",
      },
      intro: {
        eyebrow: "从这里开始",
        body: "新用户应该先安装，为自己的 client 运行 setup，接着阅读 daily workflow 和 core concepts。Project docs 涵盖 source-backed pages、architecture、reference paths、evals、releases、scope、source builds、roadmap、development conventions 和 contribution paths。",
      },
      sections: {
        items: [
          {
            id: "start-here",
            title: "从这里开始",
            description: "安装 Wenlan，并验证第一次 memory round trip。",
            items: [
              {
                id: "get-started",
                href: "/docs/get-started",
                label: "设置",
                title: "开始使用 Wenlan",
                description:
                  "选择 Claude Code、Codex、ChatGPT 或本地 MCP 路径，然后确认第一次 capture 与 recall round trip 可以工作。",
                meta: "Wenlan 团队 · 更新于 2026 年 7 月 9 日 · 4 分钟设置",
              },
            ],
          },
          {
            id: "after-setup",
            title: "安装之后",
            description:
              "把安装变成工作习惯：带着 context 开始、捕捉有用内容、检查哪些内容应该被信任，并在 context 变冷前 hand off。",
            items: [
              {
                id: "daily-workflow",
                href: "/docs/daily-workflow",
                label: "工作流",
                title: "每日 Workflow",
                description:
                  "带着 context 开始，捕捉重要内容，需要时 recall，并在 context 变冷前 hand off。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "capture-quality",
                href: "/docs/capture-quality",
                label: "捕捉",
                title: "捕捉质量",
                description:
                  "判断什么该进 Wenlan：durable facts、decisions、lessons、gotchas、corrections 和 project context。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "review-and-trust",
                href: "/docs/review-and-trust",
                label: "信任",
                title: "检查与信任",
                description:
                  "了解 Wenlan 如何让不确定的 memory 可见：pending captures、revisions、contradictions、rejections、confirm 和 forget。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "core-concepts",
                href: "/docs/core-concepts",
                label: "概念",
                title: "核心概念",
                description:
                  "了解 Wenlan 背后的组件：memories、sessions、handoffs、pages、daemon、MCP、Markdown 和 local index。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 6 分钟阅读",
              },
            ],
          },
          {
            id: "reference",
            title: "参考资料",
            description:
              "Memory types、glossary、architecture、commands、Claude Code 和 Codex plugins、CLI/service management、updates、upgrade notes、package names、platform support、HTTP API、API examples、typed clients、spaces、graph context、pages、import paths、git history、retrieval status、experimental flags、local data、backup paths、configuration、environment variables、本地与 web MCP clients、agent profiles、diagnostics、FAQ 和 repair paths。",
            items: [
              {
                id: "memory-types",
                href: "/docs/memory-types",
                label: "记忆",
                title: "Wenlan Memory 类型与 memory_type 值",
                description:
                  "根据 capture 日后为何重要，选择 identity、preference、decision、lesson、gotcha 或 fact。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 7 月 10 日 · 5 分钟阅读",
              },
              {
                id: "glossary",
                href: "/docs/glossary",
                label: "术语表",
                title: "术语表",
                description:
                  "快速对照 Wenlan 术语：memory、handoff、page、space、daemon、MCP、local index、provenance 和 eval language。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "architecture",
                href: "/docs/architecture",
                label: "架构",
                title: "架构",
                description:
                  "Wenlan 的组成方式：一个本地 daemon、薄 client、shared wire types、本地 artifacts，以及由 wenlan-core 负责的 retrieval。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 7 分钟阅读",
              },
              {
                id: "product-matrix",
                href: "/docs/product-matrix",
                label: "矩阵",
                title: "产品矩阵",
                description:
                  "对照 Wenlan 的 daemon、CLI、MCP connector、plugins、desktop app、代码仓库、平台 artifacts 和 release 边界。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 7 月 9 日 · 6 分钟阅读",
              },
              {
                id: "commands",
                href: "/docs/commands",
                label: "命令参考",
                title: "Commands 与 Tools",
                description:
                  "日常使用 Wenlan 时最重要的 Claude Code 与 Codex plugin commands、CLI commands 和 MCP tools。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "claude-code-plugin",
                href: "/docs/claude-code-plugin",
                label: "插件",
                title: "Claude Code 插件",
                description:
                  "在 Claude Code 中使用 Wenlan 最完整的 workflow：setup、brief、capture、recall、lint diagnostics、curate、distill、pages 和 handoff。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 7 月 17 日 · 6 分钟阅读",
              },
              {
                id: "cli-and-service",
                href: "/docs/cli-and-service",
                label: "CLI 管理",
                title: "Wenlan CLI 命令与 Service 管理",
                description:
                  "使用 Wenlan CLI 做 setup、daemon status、doctor diagnostics、background service management、memory search，并连接 MCP clients。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 7 月 10 日 · 5 分钟阅读",
              },
              {
                id: "updates-and-uninstall",
                href: "/docs/updates-and-uninstall",
                label: "生命周期",
                title: "更新与卸载",
                description:
                  "刷新 Wenlan 本地 runtime、验证版本健康、重启 MCP clients，并在不意外丢失数据的前提下移除 service。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 4 分钟阅读",
              },
              {
                id: "upgrade-notes",
                href: "/docs/upgrade-notes",
                label: "升级",
                title: "升级笔记",
                description:
                  "阅读 Wenlan releases 的实用升级路径：要重跑什么、验证什么，以及当前 public runtime shape 改了什么。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "packages-and-registries",
                href: "/docs/packages-and-registries",
                label: "Packages 包",
                title: "Packages 与 Registries",
                description:
                  "了解 Wenlan package name 如何对应到 plugin、runtime setup、MCP connector、Rust crates 和 release binaries。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 4 分钟阅读",
              },
              {
                id: "platforms",
                href: "/docs/platforms",
                label: "平台",
                title: "平台支持",
                description:
                  "了解 Wenlan 如何在 macOS、Linux 和 Windows 上运行：service managers、local data paths、model backends，以及 Docker/VM caveats。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "http-api",
                href: "/docs/http-api",
                label: "API 参考",
                title: "HTTP API 参考",
                description:
                  "了解 CLI、MCP connector、plugin 和 local tools 背后调用的本地 daemon surfaces。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "api-examples",
                href: "/docs/api-examples",
                label: "API 示例",
                title: "API 示例",
                description:
                  "当 CLI 或 MCP tools 不是合适选择时，从 scripts 使用本地 daemon HTTP API。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 6 分钟阅读",
              },
              {
                id: "typed-clients",
                href: "/docs/typed-clients",
                label: "Types 参考",
                title: "Typed Clients 类型客户端",
                description:
                  "当 Rust tool 需要调用本地 daemon、又不想依赖 untyped JSON shapes 时，使用 wenlan-types。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 4 分钟阅读",
              },
              {
                id: "spaces",
                href: "/docs/spaces",
                label: "Spaces 管理",
                title: "Spaces 空间",
                description:
                  "分开 work、personal、client 和 project memory，并了解 Wenlan 如何解析 active space。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 6 分钟阅读",
              },
              {
                id: "knowledge-graph",
                href: "/docs/knowledge-graph",
                label: "Graph 图谱",
                title: "Knowledge Graph 知识图谱",
                description:
                  "了解 Wenlan 如何连接 people、projects、tools、observations 和 relations，让 recall 不只靠文本相似度也能找回 context。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "source-backed-pages",
                href: "/docs/source-backed-pages",
                label: "Pages 页面",
                title: "有来源支撑的 Pages",
                description:
                  "了解 Wenlan 如何把 atomic captures 变成含 source memory IDs、revision state 和 refresh paths 的可读 pages。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "import-and-portability",
                href: "/docs/import-and-portability",
                label: "可移植性",
                title: "Import 与 Portability",
                description:
                  "把选定的 durable context 移入 Wenlan，并让 Wenlan 的可读 artifacts 在 daemon 之外也保持 portable。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "local-git-history",
                href: "/docs/local-git-history",
                label: "版本",
                title: "本地 Git History",
                description:
                  "检查 Wenlan 为可读 page、session、handoff 和 status artifacts 保留的真实 git history。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "models-and-keys",
                href: "/docs/models-and-keys",
                label: "模型",
                title: "Models 与 Keys",
                description:
                  "在 local memory mode、可选 on-device models 和可选 Anthropic API keys 之间选择，用于更丰富的 extraction、page synthesis、recaps 和 graph work。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "advanced-retrieval",
                href: "/docs/advanced-retrieval",
                label: "Retrieval 检索",
                title: "进阶 Retrieval 状态",
                description:
                  "了解 Wenlan 已发布的 retrieval path，以及新版 retrieval work 背后那些 opt-in main-branch experiments。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 6 分钟阅读",
              },
              {
                id: "experimental-flags",
                href: "/docs/experimental-flags",
                label: "Experiments 实验",
                title: "Experimental Flags 实验标志",
                description:
                  "了解如何阅读 Wenlan 的 opt-in main-branch flags，而不把它们误认为 released defaults。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 6 分钟阅读",
              },
              {
                id: "data-and-privacy",
                href: "/docs/data-and-privacy",
                label: "本地控制",
                title: "Wenlan 本地数据与隐私",
                description:
                  "了解 Wenlan 把 AI work memory 存在哪里、哪些数据留在你的机器上，以及 connected model providers 何时可能看到 prompts。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 7 月 10 日 · 5 分钟阅读",
              },
              {
                id: "backup-and-migration",
                href: "/docs/backup-and-migration",
                label: "备份",
                title: "备份与迁移",
                description:
                  "一起备份 Wenlan 的可读 artifacts 和 daemon data，并在信任 recall 前验证还原后的 runtime。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "configuration",
                href: "/docs/configuration",
                label: "配置",
                title: "Wenlan 配置",
                description:
                  "配置 Wenlan spaces、MCP clients、daemon bind address、local paths、models 和 keys，不需要手动编辑 database。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "environment-variables",
                href: "/docs/environment-variables",
                label: "Config 变量",
                title: "Environment Variables 环境变量",
                description:
                  "了解哪些 Wenlan environment variables 是一般 configuration、哪些只用于 development，以及哪些属于 eval 或 Windows repair paths。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "mcp-clients",
                href: "/docs/mcp-clients",
                label: "MCP 连接",
                title: "连接 MCP Clients",
                description:
                  "把 Claude Code、Codex、Cursor、Claude Desktop、Gemini CLI、ChatGPT、Claude.ai 和其他 MCP clients 连接到 Wenlan。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 4 分钟阅读",
              },
              {
                id: "agent-profiles",
                href: "/docs/agent-profiles",
                label: "Agents 管理",
                title: "Wenlan Agent Profiles 与 Client Attribution",
                description:
                  "查看是哪个 AI client 写入 memory、检查 source_agent attribution，并管理 trust 或 enabled state。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 7 月 10 日 · 4 分钟阅读",
              },
              {
                id: "troubleshooting",
                href: "/docs/troubleshooting",
                label: "修复",
                title: "故障排查",
                description:
                  "修正常见 setup issues：daemon 未运行、MCP 未连上、Claude commands 缺失、stale context，以及 support escalation。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "diagnostics-and-issue-reports",
                href: "/docs/diagnostics-and-issue-reports",
                label: "诊断",
                title: "诊断与 Issue 报告",
                description:
                  "求助前先跑正确 checks，分开 daemon problems 与 client problems，并只分享 redacted output。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "faq",
                href: "/docs/faq",
                label: "常见问题",
                title: "FAQ 常见问题",
                description:
                  "安装 Wenlan 前后常见 adoption questions 的短答案。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 4 分钟阅读",
              },
            ],
          },
          {
            id: "project",
            title: "项目",
            description:
              "Security reporting、evaluation、desktop status、changelog、release/versioning、roadmap、project scope、source builds、testing、CI、development conventions，以及帮助判断 Wenlan 是否可信到值得采用或贡献的 contribution paths。",
            items: [
              {
                id: "security",
                href: "/docs/security",
                label: "安全",
                title: "安全与报告",
                description:
                  "私下报告 Wenlan vulnerabilities、让 diagnostic output 保持 redacted，并了解 local daemon security boundary。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 7 月 10 日 · 4 分钟阅读",
              },
              {
                id: "evaluation",
                href: "/docs/evaluation",
                label: "评估",
                title: "Evaluation 评估",
                description:
                  "了解 Wenlan 公开 retrieval numbers 代表什么、如何产生，以及没有声称什么。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 6 分钟阅读",
              },
              {
                id: "desktop-app",
                href: "/docs/desktop-app",
                label: "桌面版",
                title: "Desktop App 状态",
                description:
                  "了解可选的 Wenlan desktop app 与 daemon、plugins、source-backed wiki，以及 ChatGPT 和 Claude.ai Remote Access 的关系。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 4 分钟阅读",
              },
              {
                id: "changelog",
                href: "/docs/changelog",
                label: "版本",
                title: "Wenlan Changelog 与版本记录",
                description:
                  "查看 Wenlan 当前版本、已发布变更，以及如何区分 tagged releases 与 main 上尚未发布的工作。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 9 月 4 日 · 5 分钟阅读",
              },
              {
                id: "releases-and-versioning",
                href: "/docs/releases-and-versioning",
                label: "发布",
                title: "Releases 与 Versioning",
                description:
                  "了解 Wenlan 如何把 merged work 变成 tagged releases、package versions、binaries、npm packages 和 crates。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "roadmap",
                href: "/docs/roadmap",
                label: "路线图",
                title: "Roadmap 与 Status",
                description:
                  "了解 Wenlan 当前方向，同时不混淆 released features、main-branch work 和 future bets。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 6 分钟阅读",
              },
              {
                id: "project-scope",
                href: "/docs/project-scope",
                label: "范围",
                title: "Project Scope 项目范围",
                description:
                  "Wenlan 适合什么、刻意避开什么，以及如何判断它是否适合你的 AI work。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "build-from-source",
                href: "/docs/build-from-source",
                label: "开发",
                title: "从 Source Build",
                description:
                  "从 public repository build Wenlan daemon、CLI、MCP server、shared types、core crate 和 plugin。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "testing-and-ci",
                href: "/docs/testing-and-ci",
                label: "质量",
                title: "Testing 与 CI",
                description:
                  "了解哪些 Wenlan checks 在本地运行、哪些在 GitHub Actions 运行，以及哪些 evals 保持 manual。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "development-conventions",
                href: "/docs/development-conventions",
                label: "开发惯例",
                title: "Development Conventions 开发惯例",
                description:
                  "让 Wenlan daemon、CLI、MCP connector、shared types 和 core logic 维持可维护的 codebase rules。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
              {
                id: "contributing",
                href: "/docs/contributing",
                label: "开源贡献",
                title: "Contributing 贡献",
                description:
                  "如何为 Wenlan 贡献有用的 bug reports、docs、eval cases 和 code changes。",
                meta: "Qi-Xuan Lu · 更新于 2026 年 6 月 24 日 · 5 分钟阅读",
              },
            ],
          },
        ],
      },
      cta: {
        eyebrow: "已经安装了？",
        title: "把 memory loop 变成习惯。",
        body: "先从 daily workflow 开始；需要 commands、MCP setup 或 repair steps 时，再使用 reference docs。",
        primary: { id: "daily-workflow", href: "/docs/daily-workflow", label: "每日工作流程" },
        secondary: {
          id: "github",
          href: "https://github.com/7xuanlu/wenlan",
          label: "GitHub",
        },
      },
      schema: {
        name: "Wenlan 文档",
        description: "Wenlan 这套 source-backed AI 工作 LLM wiki 的产品文档。",
      },
    },
  },
  getStarted: {
    status: "translated",
    sourceHash: "37d7019d5d22678f32e0b325492d1ae9134b0c28b88214bc5b0a60ae263a40ea",
    content: {
      seo: {
        title: "安装 Wenlan：Claude Code、Codex、ChatGPT 与 MCP",
        description:
          "安装 Wenlan，连接 Claude Code、Codex、ChatGPT、Claude.ai 或其他 MCP client，再验证第一次 capture 与 recall round trip。",
      },
      breadcrumbs: {
        home: "Wenlan",
        docs: "文档",
      },
      hero: {
        eyebrow: "开始使用",
        title: "安装 Wenlan，连接你的\u00a0AI\u00a0工具。",
        description:
          "选择一条 client 路径，连到同一个 local daemon，再验证一次 capture 与 recall round trip。",
        meta: ["Wenlan 团队", "更新于 2026 年 7 月 31 日", "5 分钟设置"],
        setupPathLabel: "设置路径",
        setupPathItems: ["运行环境", "Claude Code", "Codex", "本地 + 远程 MCP"],
      },
      steps: [
        {
          id: "install-runtime",
          number: "01",
          title: "安装适合你系统的 runtime",
          paragraphs: [
            "Wenlan v0.18.5 提供 Windows x64、macOS Apple silicon，以及 Linux x64 或 ARM64 glibc 的原生 runtime 包。每份 runtime archive 都包含 CLI、daemon 与 MCP connector。",
            "在 Windows 上，请把 wenlan-windows-x64.zip 当成一个整体解压到用户拥有且已加入 PATH 的目录。onnxruntime.dll、vulkan-1.dll 与三个可执行文件必须放在一起。",
          ],
          commands: [
            "# macOS Apple silicon\nnpx -y wenlan setup",
            "# Linux x64 或 ARM64\ncurl -fsSL https://raw.githubusercontent.com/7xuanlu/wenlan/main/install.sh | bash\nwenlan setup --basic\nwenlan background on\nwenlan status",
            "# Windows x64：解压 ZIP 并加入 PATH 后\nwenlan setup --basic\nwenlan background on\nwenlan status",
          ],
          ctas: [
            {
              id: "windows-download",
              href: "https://github.com/7xuanlu/wenlan/releases/download/v0.18.5/wenlan-windows-x64.zip",
              label: "下载 Windows x64",
            },
            {
              id: "all-downloads",
              href: "https://github.com/7xuanlu/wenlan/releases/tag/v0.18.5",
              label: "全部 v0.18.5 下载",
            },
          ],
        },
        {
          id: "claude-code-plugin",
          number: "02",
          title: "Claude Code 插件",
          paragraphs: [
            "这是最快的路径。plugin 会处理 daemon setup、MCP wiring、本地 memory setup，以及第一次 round-trip check。",
            "如果 Claude Code 在安装后要求 restart，重启一次，然后运行 /setup。",
          ],
          commands: claudeCommands,
          ctas: [],
        },
        {
          id: "codex",
          number: "03",
          title: "Codex 设置",
          paragraphs: [
            "先运行 Wenlan setup，再把 Codex 连接到本地 MCP server。主要 Wenlan repo 也提供 Codex plugin 给从 checkout 安装的用户；wenlan connect codex 是不需要 checkout 的直接 client 路径。",
          ],
          commands: ["wenlan connect codex"],
          ctas: [],
        },
        {
          id: "chatgpt-web",
          number: "04",
          title: "ChatGPT 和 Claude.ai",
          paragraphs: [
            "在 Wenlan desktop app 打开 Remote Access，为 Streamable HTTP MCP 创建临时的 HTTPS URL。App 会在 loopback 以 --no-auth 启动 wenlan-mcp，再通过 tunnel 暴露；任何拿到 URL 的人都能访问。在 ChatGPT 打开 Settings > Plugins，创建 New Plugin，在 Connection 下选择 Server URL，粘贴 URL，并把 Authentication 设为 None。Claude.ai 则通过 Directory > Plugins 从 7xuanlu/wenlan marketplace 安装 Wenlan。",
            "这是连接到你自己 Wenlan runtime 的 custom MCP，不代表 Wenlan 已列入公开 ChatGPT Apps Directory。不使用时请停止 Remote Access。",
          ],
          commands: [],
          ctas: [],
        },
        {
          id: "other-mcp-clients",
          number: "05",
          title: "其他本地 MCP clients",
          paragraphs: [
            "Cursor、Claude Desktop、Gemini CLI、VS Code 和其他受支持的本地 MCP clients，要先设置 Wenlan runtime，再让 CLI 写入 client-specific MCP configuration。",
            "Wenlan setup 会安装 CLI、daemon 和 MCP connector，向操作系统的 user service manager 注册 daemon，并验证状态。",
          ],
          commands: ["wenlan connect cursor\n# 或：claude-desktop, vscode, gemini"],
          ctas: [],
        },
        {
          id: "try-first",
          number: "06",
          title: "先试什么",
          paragraphs: [
            "保存一个 durable project fact，再请另一个 session 或 client recall。Wenlan 应该能找回这个 fact，并把来源保留给 wiki 与 review flow。",
          ],
          commands: [],
          ctas: [
            { id: "daily-workflow", href: "/docs/daily-workflow", label: "开始 daily workflow" },
            { id: "learn", href: "/learn", label: "阅读文章" },
          ],
        },
      ],
      sidebar: {
        eyebrow: "你会得到",
        items: [
          { id: "source-backed-wiki", label: "有来源依据的 LLM wiki" },
          { id: "local-daemon", label: "本地 daemon" },
          { id: "agent-plugins", label: "Claude Code + Codex 插件" },
          { id: "mcp-server", label: "本地 + 远程 MCP" },
        ],
      },
      schema: {
        name: "开始使用 Wenlan",
        description:
          "通过 Claude Code、Codex、ChatGPT、Claude.ai 或其他 MCP client 连接 Wenlan。",
      },
    },
  },
  notFound: {
    status: "translated",
    sourceHash: "58391d595516d6d5c9ccfe9b619b16eadab552459334ae9fefd950899b332dc5",
    content: {
      eyebrow: "404",
      title: "这个页面不存在。",
      description:
        "如果你是从链接进入，链接可能已经过期。如果你手动输入 URL，请检查是否有错字。下面是常用起点。",
      primaryCta: "回到首页",
      secondaryCta: "浏览文章",
      popularHeading: "常用目的地",
      popularDestinations: [
        {
          id: "get-started",
          href: "/docs/get-started",
          label: "开始使用",
          description: "安装 Wenlan，并验证第一次本地 memory loop。",
        },
        {
          id: "daily-workflow",
          href: "/docs/daily-workflow",
          label: "每日工作流程",
          description: "在 AI sessions 之间 capture、handoff、distill。",
        },
        {
          id: "ai-work-memory",
          href: "/learn/ai-work-memory",
          label: "AI 工作记忆",
          description: "当 AI sessions 能跨天带着 context，工作会有什么改变。",
        },
        {
          id: "mcp-memory-server",
          href: "/learn/mcp-memory-server",
          label: "MCP 记忆服务器",
          description: "Wenlan 如何通过 MCP 暴露 memory。",
        },
        {
          id: "basic-memory",
          href: "/learn/wenlan-vs-basic-memory",
          label: "Wenlan 与 Basic Memory 对比",
          description: "Markdown knowledge base 与 AI work-session memory layer 的差异。",
        },
        {
          id: "about",
          href: "/about",
          label: "关于",
          description: "项目背景、原则，以及 Wenlan 背后的人。",
        },
      ],
    },
  },
  footer: {
    status: "translated",
    sourceHash: "558ca7745c25cdaa3abd7bde264e12bbdcb08277e2415857775db600912c7978",
    content: {
      ariaLabel: "网站页脚",
      brand: "Wenlan",
      tagline: "AI 工作的 LLM wiki。",
      groups: [
        {
          id: "product",
          title: "产品",
          links: [
            { id: "get-started", href: "/docs/get-started", label: "开始使用" },
            { id: "daily-workflow", href: "/docs/daily-workflow", label: "每日工作流程" },
            { id: "capture-quality", href: "/docs/capture-quality", label: "捕捉质量" },
            { id: "core-concepts", href: "/docs/core-concepts", label: "核心概念" },
            { id: "data-and-privacy", href: "/docs/data-and-privacy", label: "数据与隐私" },
            { id: "configuration", href: "/docs/configuration", label: "配置" },
            { id: "updates", href: "/docs/updates-and-uninstall", label: "更新" },
            { id: "platforms", href: "/docs/platforms", label: "平台" },
            { id: "docs", href: "/docs", label: "文档" },
          ],
        },
        {
          id: "learn",
          title: "学习",
          links: [
            { id: "llm-wiki", href: "/learn/distilled-wiki-pages-ai-memory", label: "LLM wiki 导览" },
            { id: "ai-knowledge-base", href: "/learn/source-backed-wiki-pages-ai-work", label: "AI 知识库导览" },
            { id: "tool-selection", href: "/learn/choose-ai-knowledge-base-tool", label: "AI 知识库工具选择" },
            { id: "obsidian", href: "/learn/wenlan-vs-obsidian-ai-memory", label: "Obsidian 与 AI 工作" },
          ],
        },
        {
          id: "project",
          title: "项目",
          links: [
            { id: "about", href: "/about", label: "关于" },
            { id: "architecture", href: "/docs/architecture", label: "架构" },
            { id: "evaluation", href: "/docs/evaluation", label: "评估" },
            { id: "changelog", href: "/docs/changelog", label: "更新日志" },
            { id: "roadmap", href: "/docs/roadmap", label: "路线图" },
            { id: "project-scope", href: "/docs/project-scope", label: "项目范围" },
            { id: "security", href: "/docs/security", label: "安全" },
            { id: "github", href: "https://github.com/7xuanlu/wenlan", label: "GitHub" },
            { id: "rss", href: "/feed.xml", label: "RSS 订阅" },
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
        tagline: "LLM wiki",
        builtByPrefix: "作者",
        author: "Qi-Xuan Lu",
        authorUrl: "https://github.com/7xuanlu",
      },
    },
  },
} as const satisfies CoreContent;
