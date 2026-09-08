import type { CoreContent } from "./schema";

const claudeCommands = [
  "/plugin marketplace add 7xuanlu/claude-plugins",
  "/plugin install wenlan@7xuanlu",
  "/setup",
] as const;

export const zhTWContent = {
  chrome: {
    status: "translated",
    sourceHash: "bda0fd8a846d006539eab9c685b3be1e51df3f019c837c06e79900eb774faa57",
    content: {
      skipLinkLabel: "跳到主要內容",
      breadcrumbAriaLabel: "麵包屑",
    },
  },
  home: {
    status: "translated",
    sourceHash: "ecb28045ccda785f090943e43796541ecdfa097003fb5a6b1ab8b215e1331003",
    content: {
      seo: {
        title: "Wenlan 文瀾 | AI 工作的 LLM wiki",
        description:
          "Wenlan 文瀾是有來源依據的 AI 知識庫，也是 AI 工作的 LLM wiki：整理文件與決策，讓你和 AI 能查找、核對與審查頁面。",
      },
      nav: {
        schemaName: "Wenlan 文瀾網站導覽",
        brand: "Wenlan 文瀾",
        githubAriaLabel: "在 GitHub 查看 Wenlan",
        themeToggle: {
          lightLabel: "切換到淺色主題",
          darkLabel: "切換到深色主題",
        },
        links: [
          { id: "download", href: "/download", label: "下載" },
          { id: "docs", href: "/docs", label: "文件" },
          { id: "learn", href: "/learn", label: "學習" },
          { id: "about", href: "/about", label: "關於" },
          { id: "github", href: "https://github.com/7xuanlu/wenlan", label: "GitHub" },
        ],
      },
      hero: {
        title: "Wenlan 文瀾",
        description:
          "保存有用決策，建立有來源的頁面，再透過已連接的 AI 工具找回。",
        primaryCta: { id: "download", href: "#download", label: "下載 Wenlan" },
        secondaryCta: {
          id: "github",
          href: "https://github.com/7xuanlu/wenlan",
          label: "在 GitHub 查看",
        },
        metaText: [
          { id: "agent-plugins", label: "Claude Code + Codex 外掛" },
          { id: "chatgpt-mcp", label: "ChatGPT 透過遠端 MCP" },
          { id: "local-daemon", label: "本地 daemon" },
        ],
        metaLinks: [
          {
            id: "llm-wiki",
            href: "/learn/distilled-wiki-pages-ai-memory",
            label: "LLM wiki 導覽",
          },
          {
            id: "ai-knowledge-base",
            href: "/learn/source-backed-wiki-pages-ai-work",
            label: "AI 知識庫導覽",
          },
          {
            id: "ai-knowledge-base-tool",
            href: "/learn/choose-ai-knowledge-base-tool",
            label: "AI 知識庫選型",
          },
        ],
      },
      demo: {
        title: "Wenlan 產品示範",
        playLabel: "播放 Wenlan 產品示範",
      },
      download: {
        eyebrow: "下載",
        title:
          "下\u2060載\u2060適\u2060合\u2060你\u2060系\u2060統\u2060的 Wenlan。",
        description:
          "Wenlan v0.18.0 提供 Windows x64 桌面版與 macOS Apple silicon DMG，以及 Windows、macOS、Linux 的 headless runtime 套件。",
        stableLabel: "穩定版",
        releaseNotesLabel: "版本說明",
        packageIncludesLabel: "內含 CLI、daemon 與 MCP connector",
        recommendation: {
          label: "推薦給這台裝置",
          fallbackTitle: "選擇正確版本",
          fallbackDescription: "瀏覽器無法辨識這台裝置支援的桌面版本。",
          fallbackActionLabel: "查看全部下載",
          allDownloadsLabel: "全部下載與安裝步驟",
          architectureNote: "下載前請確認作業系統與處理器架構。",
        },
        platforms: [
          {
            id: "windows-desktop-x64",
            name: "Wenlan 桌面版",
            architecture: "Windows · x64 桌面版",
            description:
              "安裝內建 daemon、CLI、MCP connector 與所需 runtime libraries 的桌面 App；不\u2060需\u2060要 WSL 或 Rust toolchain。",
            actionLabel: "下載 Windows 桌面版",
            packageIncludesLabel: "桌面 App · 內建 runtime",
            guideLabel: "開啟桌面版安裝指南",
            setupSteps: [
              "下載並執行 x64 setup 安裝檔。",
              "如果出現 SmartScreen，依次選擇更多資訊與仍要執行。",
              "開啟 Wenlan；App 會啟動內建 daemon，並提供連接偵測到的 AI 用戶端。",
              "查看 App 狀態，或執行 wenlan doctor 驗證本地 runtime。",
            ],
          },
          {
            id: "windows-x64",
            name: "Windows 執行環境",
            architecture: "x64 · 無介面",
            description:
              "完整原生套件，包含 ONNX Runtime 與供支援 GPU 使用的 Vulkan loader。不\u2060需\u2060要 WSL 或 Rust toolchain。",
            actionLabel: "下載 Windows runtime",
            setupSteps: [
              "下載並解壓縮 ZIP，保留所有檔案在同一個目錄。",
              "把解壓縮後的目錄加入 PATH。",
              "開啟新的終端機並執行 wenlan doctor。",
            ],
          },
          {
            id: "macos-arm64",
            name: "Wenlan 桌面版",
            architecture: "macOS · Apple silicon 桌面版",
            description: "最快開始閱讀 Page 與檢查來源的方式。",
            actionLabel: "下載 macOS 桌面版",
            packageIncludesLabel: "桌面 App · 內含本地 runtime",
            guideLabel: "開啟安全安裝指南",
            setupSteps: [
              "下載 DMG，並將 Wenlan 拖入 Applications。",
              "從 Applications 開啟 Wenlan，並確認它能連接本地 daemon。",
              "若安裝失敗，請使用可檢查的安全安裝指南驗證確切 GitHub release。",
            ],
          },
          {
            id: "macos-runtime-arm64",
            name: "macOS 執行環境",
            architecture: "Apple silicon · 無介面",
            description: "CLI、daemon 與 MCP connector；本地 model 路徑支援 Metal。",
            actionLabel: "下載 macOS runtime",
            setupSteps: [
              "下載並解壓縮 TAR.GZ。",
              "把執行檔移到 PATH 內的目錄。",
              "執行 wenlan doctor 驗證本地 runtime。",
            ],
          },
          {
            id: "linux-x64",
            name: "Linux",
            architecture: "x64 · glibc",
            description: "適用於常見 x86_64 Linux 系統的預編譯 runtime。",
            actionLabel: "下載 Linux x64",
            setupSteps: [
              "下載並解壓縮 TAR.GZ。",
              "把執行檔移到 PATH 內的目錄。",
              "執行 wenlan doctor 驗證本地 runtime。",
            ],
          },
          {
            id: "linux-arm64",
            name: "Linux",
            architecture: "ARM64 · glibc",
            description: "適用於 aarch64 Linux 系統的預編譯 runtime。",
            actionLabel: "下載 Linux ARM64",
            setupSteps: [
              "下載並解壓縮 TAR.GZ。",
              "把執行檔移到 PATH 內的目錄。",
              "執行 wenlan doctor 驗證本地 runtime。",
            ],
          },
        ],
        setup: {
          title: "安裝並驗證",
          description: "使用引導式安裝，或依照平台的完整步驟操作。",
          command: "npx -y wenlan setup",
          guideLabel: "開啟安裝指南",
        },
        page: {
          seo: {
            title: "下載 Wenlan Windows、macOS 與 Linux 版",
            description:
              "下載 Windows x64 或 macOS Apple silicon 的 Wenlan 桌面 App，或安裝支援 Windows、macOS 與 Linux 的 headless CLI、本地 daemon 與 MCP connector。",
          },
          breadcrumbs: {
            home: "首頁",
            current: "下載",
          },
          eyebrow: "Wenlan 本地執行環境",
          title: "下載 Wenlan",
          description:
            "選擇一個正式發布的版本、保留套件內全部檔案，再驗證本地 runtime，之後才連接 AI 工具。",
          buildsTitle: "選擇你的版本",
          buildsDescription: "目前 release 提供 Windows x64 與 macOS Apple silicon 桌面版，以及四個原生 headless runtime 套件。",
          verifyTitle: "連接前先驗證",
          verifyDescription:
            "安裝後執行診斷。它會檢查本地 runtime，並告訴你下一個修復步驟。",
          releaseSourceLabel: "查看 release 來源",
          setupGuideLabel: "閱讀完整安裝指南",
          getStartedLabel: "繼續開始使用",
        },
      },
      useCases: {
        eyebrow: "使用場景",
        title: "給 code、客戶工作、研究用的\nLLM wiki。",
        description:
          "Wenlan 把 repo 事實、客戶限制、source trails 和讀書筆記變成 agent 能簡報、召回、交接的 source-cited 頁面。",
        evidenceLabel: "Agent 可引用的頁面",
        outcomeLabel: "可引用頁面",
        actionsLabel: "Agent 動作",
        index: {
          title: "Wenlan Wiki 索引",
          activeViewLabel: "目前視圖",
          pagesTitle: "Agent 可引用的頁面",
          pagesLabel: "頁面",
          sourcesLabel: "來源",
          statusLabel: "狀態",
          sourceBackedLabel: "有來源",
          citationLabel: "Agent 引用",
          citingLabel: "引用中的頁面",
        },
        scenarios: [
          {
            id: "dev-codebase",
            label: "Dev / codebase 工作",
            railLabel: "程式",
            summary: "會持續更新的工程文件",
            lead: "維護工程師真的會更新的 codebase 文件。",
            body: "Wenlan 可以把 repo 事實整理成有來源的工程 Pages：架構地圖、runbook、migration plan、integration note、debugging log。更新情況取決於已設定的處理流程與來源變更。",
            evidence: [
              {
                id: "architecture",
                label: "架構地圖",
                detail: "服務邊界、資料流、owner、runtime constraints，以及會隨程式碼改變的 diagrams。",
              },
              {
                id: "failed-paths",
                label: "操作手冊",
                detail: "如何重現、release、rollback、監控或操作系統，不必再問上一位工程師。",
              },
              {
                id: "dependency-research",
                label: "Migration 計畫",
                detail: "Schema 變更、API migration、rollout 階段、blocked paths，以及跨 session 的 cleanup tasks。",
              },
              {
                id: "open-threads",
                label: "整合筆記",
                detail: "Dependency quirks、版本限制、adapter decisions，以及連到 source docs 的 upstream issues。",
              },
            ],
            outcome: "下一個 agent 可以開啟工程 Page，檢查它的來源。",
          },
          {
            id: "product-customers",
            label: "Product / 客戶工作",
            railLabel: "客戶工作",
            summary: "通話、限制、proposal",
            lead: "讓下一份 proposal 帶著客戶 context 開始。",
            body:
              "下一份 proposal 前，產品團隊、顧問與自由工作者可以召回客戶反對點、client constraint，以及真正改變方案的取捨。",
            evidence: [
              {
                id: "customer-voice",
                label: "客戶反對點",
                detail: "訪談、support、sales notes 中反覆出現的需求和反對理由。",
              },
              {
                id: "client-constraints",
                label: "Client 限制",
                detail: "每個 client space 的品牌、預算、審批、法務或交付限制。",
              },
              {
                id: "decision-rationale",
                label: "Proposal 取捨",
                detail: "為什麼某個 roadmap、proposal 或 pricing 取捨勝過其他選項。",
              },
              {
                id: "follow-up-threads",
                label: "後續 owner",
                detail: "下一次會議前要追的問題、承諾的下一步，以及負責人。",
              },
            ],
            outcome: "下一份 proposal 從客戶反對點、限制、取捨和 owner 開始。",
          },
          {
            id: "research-writing",
            label: "Research / 寫作",
            railLabel: "研究",
            summary: "sources、有引用的頁面、下一版 outline",
            lead: "把研究脈絡變成可引用的 wiki 頁面。",
            body: "Papers、docs、transcripts 和 links 堆起來後，下一稿可以從可信 quote、待重查 claim，以及有引用的 outline 接續。",
            evidence: [
              {
                id: "trusted-sources",
                label: "可信 quote",
                detail: "你已經決定信任的 papers、docs、transcripts 和 links。",
              },
              {
                id: "comparison-notes",
                label: "比較 note",
                detail: "工具、主張或標準之間哪裡改變，並保留完整 source trail。",
              },
              {
                id: "outline-decisions",
                label: "下一稿 outline",
                detail: "下一稿要延續的論點、段落順序和開放問題。",
              },
              {
                id: "stale-claims",
                label: "待重查 claim",
                detail: "放進公開文案前，需要重新確認的事實。",
              },
            ],
            outcome: "寫作從有引用的 working page 接續，而不是從一堆 tabs 重開。",
          },
          {
            id: "learning-study",
            label: "學習與讀書",
            railLabel: "學習",
            summary: "概念、前置知識、複習",
            lead: "把讀書 session 變成能教下一次的頁面。",
            body: "終於想通的解釋會變成概念頁面，前置知識也連結好，下一次 session 是在複習理解，而不是回頭滑聊天記錄。",
            evidence: [
              {
                id: "concept-pages",
                label: "概念頁面",
                detail: "那個終於說通的解釋，連同讓它成立的來源一起留下。",
              },
              {
                id: "prerequisite-links",
                label: "前置連結",
                detail: "每個概念建立在什麼之上，先連好，讓知識缺口在造成代價前現形。",
              },
              {
                id: "review-notes",
                label: "複習筆記",
                detail: "上次哪裡想錯，以及修正它的那個更正。",
              },
              {
                id: "study-plan",
                label: "讀書計畫",
                detail: "接下來該讀什麼，依你已掌握的前置知識排序。",
              },
            ],
            outcome: "下一次讀書 session 打開的是概念頁面，不是上週的聊天捲動。",
          },
        ],
      },
      sections: {
        problem: {
          eyebrow: "問題",
          title: "新的 AI session 可能從冷啟動開始。",
          body: "工作已經發生，但 context 可能沒有留下來。決策、修 bug 的教訓和專案直覺可能困在舊聊天裡，沒有幫到下一個 agent。",
          note: "少了一次 handoff，下一段對話可能就會重跑上一段工作。",
        },
        solution: {
          eyebrow: "Wenlan 帶來什麼",
          title: "讓這次的工作，下次接得上。",
          body: "完成設定後，Wenlan 可以在工作發生時捕捉決策、教訓和下一步，並在下一個 agent 開始時提供 handoff。",
          note: "下一段對話可以先讀交接紀錄，再決定要查哪些來源，不必只靠回想之前聊過什麼。",
          visualLabels: {
            start: "開始",
            capture: "捕捉",
            handoff: "交接",
            resume: "接續",
          },
        },
        memoryDistillery: {
          eyebrow: "刻意蒸餾",
          title: "Wenlan 把重複出現的 context 變成 LLM wiki。",
          body: "當重複捕捉的內容值得變成可讀的 wiki 頁面時，執行 /distill。可選的本地模型或 API key 路徑可以加入背景擷取與頁面更新。",
          note: "已設定的下一次執行可以從有引用的 context 開始，而不是從 transcript 殘留開始。",
          visualLabels: {
            merged: "合併",
            linked: "連結",
            refined: "精煉",
          },
        },
        features: {
          eyebrow: "知識頁面",
          title: "工作會變成可重用的頁面。",
          body: "整理過的決策與教訓會成為耐用頁面，而不是被埋在聊天記錄裡。它們足夠有組織，agent 能使用；也足夠具體，人可以閱讀。",
          note: "你的工作不再只是 transcript 歷史，而是開始變成專案知識。",
        },
        humanControl: {
          eyebrow: "混合儲存",
          title: "daemon 負責 recall，可讀 artifacts 仍然可檢查。",
          body: "Wenlan 把原始 captures 保存在本地 daemon store 供 retrieval 使用，再投射出你可以開啟、diff、移動的 pages、handoffs 和 status files。",
          note: "Agents 從 daemon recall。你檢查可讀檔案。",
        },
        openSourceCta: {
          eyebrow: "開源",
          title: "程式碼公開，讓你自由探索。",
          body: "從本地執行核心到桌面 App，你都能查看原始碼，也能自行建置 Wenlan。",
          note: "執行核心與 plugins：Apache-2.0。桌面 App：AGPL-3.0-only。",
          primaryCta: { id: "download", href: "#download", label: "下載 Wenlan" },
          secondaryCta: {
            id: "github",
            href: "https://github.com/7xuanlu/wenlan",
            label: "在 GitHub 查看",
          },
          waitlistHeading: "取得 release 更新。",
          waitlist: {
            successMessage: "你已加入。我們會持續通知你。",
            pendingLabel: "加入中...",
            submitLabel: "取得更新",
            emailPlaceholder: "you@email.com",
            fallbackError: "發生錯誤，請再試一次。",
            errors: {
              required: "請輸入 email。",
              invalid: "請輸入有效的 email。",
              notConfigured: "候補名單尚未設定。",
              unknown: "發生錯誤，請再試一次。",
            },
          },
        },
      },
      metrics: {
        eyebrow: "Hybrid retrieval，實測",
        title: "每次查詢，需要帶回多少內容？",
        description: "在固定的 500 題檢索測試中，比較完整對話重播與 Wenlan 取回的上下文。",
        headers: {
          surface: "表面",
          scope: "範圍",
          result: "結果",
        },
        rows: [
          {
            id: "full-replay",
            surface: "完整重播",
            scope: "不使用 retrieval",
            result: "每次查詢 4,505 tokens / query",
          },
          {
            id: "lme-oracle",
            surface: "LME_Oracle",
            scope: "CE-reranked，500 Q",
            result: "每次查詢 168 tokens / query · 93.6% R@5 · 0.883 NDCG@10",
          },
          {
            id: "lme-s",
            surface: "LME_S",
            scope: "CE-reranked，N=90 deep-S",
            result: "每次查詢 168 tokens / query · 87.7% R@5 · 0.822 NDCG@10",
          },
        ],
        note:
          "固定 fixture 上的 retrieval-only snapshots。LME_Oracle 也記錄 0.857 MRR；LME_S 在 90-question deep-S fixture 的 84 個可評分 rows 上記錄 0.815 MRR。這不是一般的時間或 token 節省保證，也不是 Wenlan 與其他工具的比較。Token 比較只限於這項 retrieval 測試中的完整重播與 retrieved context。",
        link: {
          id: "harness",
          href: "https://github.com/7xuanlu/wenlan/tree/main/crates/wenlan-core/src/eval",
          label: "自己執行 harness。",
        },
      },
      faqs: {
        eyebrow: "常見問題",
        title: "常見問題。",
        items: [
          {
            id: "what-is-wenlan",
            q: "Wenlan 是什麼？",
            a: "Wenlan 是本地 AI 知識庫與 LLM wiki。連接 AI 工具後，可以保存決策並再次找回；產生頁面需要已設定的模型或 AI 工具。使用答案前，仍要核對它引用的來源。",
          },
          {
            id: "built-in-memory",
            q: "Wenlan 和 AI 工具內建的記憶有什麼不同？",
            a: "內建記憶的行為因工具而異，請實際比較匯出、來源、編輯及跨工具存取。Wenlan 把知識留在本地，提供可檢查的頁面，並保留建立頁面時使用的來源紀錄 ID。",
          },
          {
            id: "retrieval-quality",
            q: "怎麼看 Wenlan 的檢索評測？",
            a: "Hybrid retrieval 結合 vector search (BGE-Base-EN-v1.5-Q, 768-dim)、FTS5、reciprocal-rank fusion、knowledge-graph context 和本地 BGE reranker。LME_Oracle 在 500-question snapshot 上是 93.6% Recall@5、0.857 MRR、0.883 NDCG@10。LME_S 在 stratified N=90 deep-S snapshot 上是 87.7% Recall@5、0.815 MRR、0.822 NDCG@10。這些 fixture-specific 分數不代表正確性，也不能證明每個 claim。Eval harness 放在 repo 的 crates/wenlan-core/src/eval/。",
          },
          {
            id: "privacy",
            q: "我的資料是私密的嗎？",
            a: "是。Wenlan 在你的機器上執行，資料庫也存放在本地。預設沒有 cloud sync 或 telemetry。本地 memory setup 不需要模型或 API key。On-device models 或 Anthropic key 只有在你選擇啟用 automatic page distillation、recaps 和更豐富 graph work 時才會使用。",
          },
          {
            id: "memory-mcp",
            q: "Wenlan 只是另一個 memory MCP 嗎？",
            a: "不是。MCP server 是 connector。Wenlan 也包含本地 daemon、manual /distill、可選的 model-backed extraction 與 Page work、本地 retrieval、source references、review surfaces、memory、Page 和 session artifacts 的真實 git versioning，以及可讀的 Markdown export paths。",
          },
          {
            id: "tools",
            q: "哪些 AI 工具可以搭配 Wenlan？",
            a: "Claude Code 和 Codex 有 plugin 路徑。Cursor、Claude Desktop、VS Code、Antigravity 和其他支援的本地 clients 透過 Wenlan 的 MCP server 連接。ChatGPT 和 Claude.ai 使用 Streamable HTTP MCP，desktop app 的 Remote Access 提供引導式路徑。Obsidian 是唯讀的來源工作流程，不是這份清單中的 MCP 用戶端。Remote Access 沒有驗證；任何拿到 URL 的人都能存取 Wenlan，因此不用時請停止 Remote Access。",
          },
          {
            id: "not-notes",
            q: "Wenlan 能取代 Notion 或 Obsidian 嗎？",
            a: "不能。Wenlan 不是 notes app。它可以把 Markdown、text、可抽取文字的 PDF、資料夾和 Obsidian vault 登錄為來源。Obsidian 輸入是唯讀，按需求重新同步；Wenlan 自己的 Pages 仍是 ~/.wenlan/ 底下可讀的 Markdown。",
          },
          {
            id: "setup",
            q: "我要怎麼設定？",
            a: "先安裝 runtime 並連接 client。Claude Code 使用 marketplace plugin 和 /setup。Codex 可以使用 Wenlan plugin，或執行 wenlan connect codex。其他本地 clients 使用 wenlan connect <client>。ChatGPT 和 Claude.ai 透過 desktop app 的 Remote Access URL 使用 Streamable HTTP MCP。本地 capture 與 retrieval 可以不使用 model 或 API key；automatic Page distillation 和背景處理需要已設定的 on-device model 或 provider API key。該 URL 沒有驗證，請視同秘密，並在不用時停止 Remote Access。",
          },
          {
            id: "platforms",
            q: "Wenlan 支援 Windows 或 Linux 嗎？",
            a: "支援。當前預編譯 daemon release 覆蓋 macOS Apple Silicon、Linux (x86_64, aarch64; glibc) 和 Windows (x86_64)。macOS Intel 仍可走 source/dev 路徑，但目前沒有 macOS Intel 預編譯執行環境。Service registration 在 macOS 使用 launchd、Linux 使用 systemd-user、Windows 使用 Task Scheduler (schtasks)。",
          },
          {
            id: "spaces",
            q: "我可以把工作和個人 memory 分開嗎？",
            a: "可以。Memories、pages 和 recalls 都屬於一個 space，例如 work、personal 或 client-X。你可以用 WENLAN_SPACE 在每個 shell 設定 active space，或在 ~/.wenlan/spaces.toml 宣告。Auto-detector 也會從目前 repo 或 workspace 選擇 space。",
          },
          {
            id: "free",
            q: "Wenlan 免費嗎？",
            a: "是。Wenlan 是 open-source。Wenlan repo 裡的本地 runtime、CLI、MCP server、Claude Code plugin 和 Codex plugin files 都是 Apache-2.0。",
          },
        ],
      },
      redesign: {
        hero: {
          eyebrow: "你與 AI 共用的 Living Wiki",
          headline: { pre: "筆記一直在累積，", emphasis: "工作卻還得從頭來？", post: "" },
          description:
            "文瀾把文件、筆記與工作中累積的決策，整理成有來源、能持續更新的 Wiki。讓你和 AI 不只找回資料，更能沿著已有的理解，接著往前做。",
          worksWithLabel: "可搭配",
          worksWithNote: "可讀取 Obsidian 筆記，保留原文。",
        },
        pains: {
          "title": "選擇適合你的知識工作流程。",
          "intro": "不只比較功能：看看平常在哪裡工作、哪些整理能交出去、哪些決定仍由你做。",
          "scopeNote": "Wenlan 也是 LLM Wiki 的一種實作；不同方式可以搭配使用。",
          "dimensions": [
            "平常怎麼用？",
            "哪些整理會自動做？",
            "什麼時候要我決定？"
          ],
          "detailsLabel": "工作方式與來源",
          "helpLabel": "更多背景",
          "accessNote": "Wenlan 需先連接來源與模型、建立首批頁面。之後可用桌面 App，或 plugin／CLI 與本機 daemon 接著使用。",
          "generations": [
            {
              "id": "wiki-graveyard",
              "name": "AI 工具＋文件",
              "eyebrow": "Word · PDF · PPT · Markdown",
              "summary": "AI 能替你讀寫文件；Wenlan 再把來源追蹤、知識頁更新與修訂審核整合好，讓工作留下的不只是回答，而是一份持續維護的知識庫。",
              "profileLabels": [
                "直接讀寫文件，完成交辦任務",
                "更新相關知識，需另建機制",
                "檔案有控管，知識審核另建"
              ],
              "profile": [
                "AI 讀檔、問答或改稿，產出可保存再用；跨來源 Wiki 與維護流程需另外建立。",
                "可讀新版、保留記憶；追蹤來源變更、找出過時頁面並刷新，需另外建置機制。",
                "用權限與差異檢視控管改檔；哪些知識頁可自動更新、哪些需審核，仍需另建規則。"
              ],
              "body": "這裡比較原生 AI 直接處理文件、尚未另外建置 Wiki 維護系統的做法，不代表每種 AI 產品。Claude Code 有跨對話的 auto memory；官方將記憶上下文與強制執行機制分開。hooks 可執行自訂自動化，但來源與頁面的關聯、過期判定及修訂分流，仍需實作與驗證，不是一段提示詞就提供的系統。Wenlan 已整合這些機制；產出仍需核對依據與內容版本。直接目錄來源支援 Markdown、text（純文字）與 text-extractable PDF；Word 與 PowerPoint 先匯出為 text/Markdown 或 text-extractable PDF，scanned PDF 另做 OCR。新主題不保證自動建頁；背景刷新需要已設定且可用的模型。",
              "sources": [
                {
                  "label": "Markdown 格式",
                  "href": "https://commonmark.org/help/"
                },
                {
                  "label": "Claude Code 文件脈絡",
                  "href": "https://code.claude.com/docs/en/memory"
                },
                {
                  "label": "Claude Code 自動化 hooks",
                  "href": "https://code.claude.com/docs/en/hooks-guide"
                },
                {
                  "label": "從文件建立本機 AI 知識庫",
                  "href": "https://wenlan.app/learn/build-local-ai-knowledge-base-from-documents"
                }
              ],
              "wenlan": {
                "labels": [
                  "內建維護流程的 AI 知識庫",
                  "相關知識，隨來源一起維護",
                  "原檔保留，你寫的內容先審再改"
                ],
                "profile": [
                  "文件與保存的決策編成附引用的 Wiki；從已連接的 AI 工具找回前次結論與依據，接著工作。",
                  "新決策可補入既有頁面；已連接檔案或記憶內容修改後，背景模型刷新符合條件的受影響頁面。",
                  "來源檔不回寫；AI 更新你編輯過的知識頁前先提出修訂，由你接受或拒絕，變更歷程可查。"
                ],
                "emphasis": []
              }
            },
            {
              "id": "llm-wiki-workflow",
              "name": "LLM Wiki · nashsu",
              "tabLabel": "LLM Wiki",
              "eyebrow": "nashsu/llm_wiki · 開源專案",
              "summary": "兩者都有資料夾監看，也不只處理文件。Wenlan 還追蹤每則知識與引用它的頁面；LLM Wiki 則以來源與 Wiki 頁面的編整為主。",
              "profileLabels": [
                "以桌面 Wiki 專案為中心",
                "以來源與 Wiki 頁面為單位",
                "編整繼續，審核待辦另列"
              ],
              "profile": [
                "在 App 匯入文件、提問與保存回答；外部 AI 工具也能透過 MCP 連接，但 App 需保持運作。",
                "來源檔變更或回答存回 Wiki 後，可自動編整頁面；研究結果也直接存成頁面。",
                "匯入會先寫頁面；Review 另列補充研究或新增頁面等事項，不會卡住匯入。"
              ],
              "body": "此處比較 nashsu/llm_wiki，不是 Karpathy 的方法或整個 LLM Wiki 類別。它已有引用、Review、MCP 與 skills。設定匯入模型後，把回答「存回 Wiki」也能自動編整；DeepResearch 直接寫入附引用的問答頁，不再進入來源匯入流程。刪除來源時，也會清理受影響的頁面與連結。Business 範本則在決策頁記錄狀態與 supersedes。Wenlan 把決策存成獨立紀錄：修改、刪除或接受取代修訂後，標記引用該紀錄的頁面待更新；接受修訂時，也把頁面的依據接到新記憶。新紀錄還可補入匹配的既有頁面。背景刷新需要可用模型與符合條件的頁面；人改過的頁面先提出修訂，批准才改原文。nashsu 的匯入則先寫頁面，再列 Review 待辦。這些是實作差異，不等於易用性或內容正確性的保證。",
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
                  "label": "llm_wiki MCP 伺服器",
                  "href": "https://github.com/nashsu/llm_wiki/blob/main/mcp-server/README.md"
                },
                {
                  "label": "llm_wiki 頁面範本",
                  "href": "https://github.com/nashsu/llm_wiki/blob/main/src/lib/templates.ts"
                },
                {
                  "label": "llm_wiki 回答存回後的編整",
                  "href": "https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/components/chat/chat-message.tsx#L547-L626"
                },
                {
                  "label": "llm_wiki DeepResearch 輸出",
                  "href": "https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/lib/deep-research.ts#L505-L545"
                },
                {
                  "label": "llm_wiki 刪除來源後的清理",
                  "href": "https://github.com/nashsu/llm_wiki/blob/e8082119649e6a8e1cf85eaf289adcabfdf39d4e/src/lib/source-lifecycle.ts#L457-L574"
                },
                {
                  "label": "Wenlan 單元記憶與頁面依據",
                  "href": "https://github.com/7xuanlu/wenlan/blob/af646ddcf705ee7450335a8772a8cb196f89a3a1/crates/wenlan-core/src/db.rs#L31034-L31143"
                }
              ],
              "wenlan": {
                "labels": [
                  "沿用 AI 工具，不必另開 App",
                  "改一則知識，找出受影響的頁面",
                  "你寫的頁面，先審再改"
                ],
                "profile": [
                  "設定完成後，在已連接的 AI 工具保存、查找知識；本機背景服務運作，不必開桌面 App。",
                  "修改、刪除記憶或接受取代修訂後，自動標記引用它的既有頁面；背景服務再刷新符合條件的頁面。",
                  "AI 想更新你親自寫過的頁面時，先提出修訂，原文等你批准才改。"
                ],
                "emphasis": []
              }
            },
            {
              "id": "llm-wiki-1",
              "name": "Obsidian",
              "eyebrow": "Obsidian · 本機 Markdown vault",
              "summary": "你可以繼續用 Obsidian 寫筆記，再讓 Wenlan 讀取原文，另外建立並維護一份給你和 AI 共用的 Wiki。",
              "profileLabels": [
                "直接寫自己的 Markdown 筆記",
                "由選用的外掛接手",
                "你決定工具能怎麼改"
              ],
              "profile": [
                "在 vault 裡寫筆記、連結想法；需要 AI 時，再接外掛或外部工具。",
                "AI 搜尋、改寫或整理可交給外掛；你選擇功能、設定規則並維護外掛。",
                "vault 由你保管；選擇外掛與備份方式，確認 AI 是否能寫入原筆記。"
              ],
              "body": "適合想自己撰寫、整理與連結筆記的人，Markdown 檔案存放在自己的裝置。需要 AI 搜尋、摘要或改寫時，可以另外安裝外掛或接上 AI 工具。外掛與同步服務可能把資料傳到其他服務；筆記存在本機，不代表所有 AI 處理都在本機。",
              "sources": [
                {
                  "label": "Obsidian 如何儲存資料",
                  "href": "https://obsidian.md/help/data-storage"
                },
                {
                  "label": "社群外掛",
                  "href": "https://obsidian.md/help/community-plugins"
                },
                {
                  "label": "外掛安全與資料存取",
                  "href": "https://obsidian.md/help/plugin-security"
                }
              ],
              "wenlan": {
                "labels": [
                  "保留 vault，另外維護 Wiki",
                  "筆記變更，知識頁跟著更新",
                  "原筆記不動，改稿先看"
                ],
                "profile": [
                  "把 vault 接成唯讀來源；原筆記照寫，Wenlan 另建給你和 AI 使用的知識頁。",
                  "完成 Wenlan 設定後，背景追蹤已連接來源、刷新符合條件的頁面，不改寫原本的 vault。",
                  "Wenlan 不回寫 vault；你親自改過的文瀾頁面，也先提出修訂再決定。"
                ],
                "emphasis": []
              }
            },
            {
              "id": "vault-agents",
              "name": "Notion",
              "eyebrow": "Notion · 雲端工作區",
              "summary": "Notion 讓你設定 Agent 處理工作區任務；Wenlan 把來源追蹤、知識頁更新與修改審核做成內建流程。兩者都能自動執行。",
              "profileLabels": [
                "在共享工作區裡安排工作",
                "你定任務，Agent 自動跑",
                "你管規則與工作區權限"
              ],
              "profile": [
                "用頁面、資料庫與權限組織個人或團隊工作，也能讓 Notion Agent 建立與編輯。",
                "Custom Agents 可依排程或事件執行；你先設定指示、觸發條件與存取權限。",
                "設定 Agent 的存取範圍、查看活動紀錄，再使用 Notion 的歷史與還原功能。"
              ],
              "body": "Notion 是個人與團隊共用的雲端工作區，不只是資料庫或被動筆記。Notion Agent 可搜尋、建立與編輯；Custom Agents 更能按事件或排程在背景執行，包括知識維護。你可用範本或自行設定指示、觸發條件與存取權限，再查看活動紀錄，使用 Notion 的歷史與還原功能。官方文件列 Custom Agents 需 Business 或 Enterprise 方案。雲端內容可下載指定頁面離線使用，也能匯出備份。差異在通用工作區自動化與 Wenlan 內建的知識維護流程，不是 Notion 沒有自動化或不能接外部工具。",
              "sources": [
                {
                  "label": "Notion Agent 說明",
                  "href": "https://www.notion.com/help/notion-agent"
                },
                {
                  "label": "Custom Agents：觸發、權限與審核",
                  "href": "https://www.notion.com/help/custom-agents"
                },
                {
                  "label": "離線頁面",
                  "href": "https://www.notion.com/help/use-pages-offline"
                },
                {
                  "label": "匯出備份",
                  "href": "https://www.notion.com/help/back-up-your-data"
                }
              ],
              "wenlan": {
                "labels": [
                  "不必先搬進新工作區",
                  "知識維護是內建流程",
                  "親筆內容，改之前先問"
                ],
                "profile": [
                  "在已連接的 AI 工具保存、取用知識；文件與決策留在本機，不必換編輯器。",
                  "來源變更後，背景追蹤受影響頁面並刷新；你寫過的頁面轉成待審修訂。",
                  "你判斷是否接受頁面修訂；機器維護頁面照設定更新，保留變更歷程。"
                ],
                "emphasis": []
              }
            },
            {
              "id": "notebooklm",
              "name": "NotebookLM",
              "eyebrow": "Google · Gemini Notebook",
              "summary": "NotebookLM 幫你讀懂一組來源；Wenlan 把資料與工作決策累積成 Wiki，讓已連接的 AI 工具在後續工作取用。",
              "profileLabels": [
                "帶著來源提問、做學習材料",
                "Drive 更新，來源自動同步",
                "你挑來源與分享對象"
              ],
              "profile": [
                "選定來源後提問、摘要或製作學習材料；也能在 Gemini 對話中使用筆記本。",
                "支援的 Google Drive 來源會在開啟筆記本時同步；上傳檔案則是匯入時的副本。",
                "選擇這次要引用哪些來源、誰能存取筆記本；不會回寫原始 Drive 文件。"
              ],
              "body": "NotebookLM 是大家熟悉的產品；Google 官方文件現在將它標為 Gemini Notebook。它提供來源問答、摘要與學習材料，筆記本也可用在 Gemini 對話，不能說只能待在一個獨立 App。支援的 Google Drive 來源會在開啟筆記本時同步；本機上傳檔是匯入副本。你選擇提問引用的來源與雲端分享權限，它不會改寫原始 Drive 文件。來源同步不等於保證先前產生的每份學習材料都會重新生成。",
              "sources": [
                {
                  "label": "Gemini Notebook 說明",
                  "href": "https://support.google.com/gemininotebook/answer/16215270?hl=en"
                },
                {
                  "label": "Drive 自動同步",
                  "href": "https://workspaceupdates.googleblog.com/2026/05/keep-your-sources-up-to-date-with-automatic-drive-syncing-in-NotebookLM.html"
                }
              ],
              "wenlan": {
                "labels": [
                  "把閱讀結果接回工作",
                  "不只同步，還更新知識頁",
                  "你決定是否採用重要修改"
                ],
                "profile": [
                  "將結論與決策存進本機知識庫，再由已連接的 AI 工具找回，用於下一次工作。",
                  "背景追蹤來源變化，刷新符合條件的既有 Wiki 頁，而不只是換一份來源副本。",
                  "你親自寫過的頁面先保留原文，AI 提出修訂，由你選擇接受或保留。"
                ],
                "emphasis": []
              }
            }
          ],
          "current": {
            "name": "Wenlan",
            "tagline": "AI 原生知識庫",
            "summary": "讓你和 AI，共用隨工作累積的知識。",
              "body": "Wenlan 把來源文件與工作中保存的決策、經驗，編成有來源的 Living Wiki。Sources、Memories、Pages 模型把決策、經驗與修正存成獨立的知識紀錄；需要修正舊知識時，可記錄明確的取代關係，再與文件共同支撐知識頁。這個知識生命週期延伸自社群 Rohitg00 LLM Wiki v2 提案所討論的方向，但不是官方版本認證。先連接來源、指定背景模型並建立首批頁面；之後本機 daemon 同步已連接資料夾的變更，刷新符合條件的既有頁面，保留變更歷程。新主題不保證自動建頁；模型不可用、來源或引用檢查未通過時，更新會暫停。你親自撰寫或修改的頁面先提出修訂，審核通過才改原文；不是每一筆 AI 寫入都需要批准。人與已連接工具可透過 plugin／CLI／MCP 共用所選 Space 的知識，不必開桌面 App。資料儲存在本機，模型處理可依設定使用本機或雲端服務。",
            "highlights": [
              {
                "label": "文件＋獨立決策",
                "body": "來源文件與獨立保存的決策、經驗、修正，共同支撐知識頁面。"
              },
              {
                "label": "持續維護的 Wiki",
                "body": "機器維護的頁面，能依目前支持它的來源重建。"
              },
              {
                "label": "審核＋變更歷程",
                "body": "你寫的內容先審再改，頁面版本始終可查。"
              },
              {
                "label": "跨 AI 工具共用",
                "body": "接好 MCP 的工具共用本機知識，不必各留一份。"
              }
            ],
            "sources": [
              {
                "label": "有來源的頁面",
                "href": "https://wenlan.app/docs/source-backed-pages"
              },
              {
                "label": "審核與信任",
                "href": "https://wenlan.app/docs/review-and-trust"
              },
              {
                "label": "模型與金鑰",
                "href": "https://wenlan.app/docs/models-and-keys"
              },
              {
                "label": "本機 Git 歷程",
                "href": "https://wenlan.app/docs/local-git-history"
              },
              {
                "label": "Rohitg00 LLM Wiki v2 社群提案",
                "href": "https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2"
              },
              {
                "label": "Wenlan 儲存庫：這是什麼？",
                "href": "https://github.com/7xuanlu/wenlan#what-is-this"
              }
            ]
          },
          "closer": {
            "pre": "讓重要內容留下，並把",
            "emphasis": "審核",
            "post": "放進流程。"
          },
          "selectorLabel": "你現在怎麼管理知識？",
          "sourcesChecked": "來源核對：2026-09-07 · 依官方文件與原始碼整理，並非實機效能評比。"
        },
        pipeline: {
          intro:
            "連接 AI 工具後，用 Wenlan 保存有用決策，再用已設定的模型建立有來源的頁面；下次遇到相關問題，再把頁面與依據找回。",
          stages: [
            { id: "capture", step: "/capture · 工作當下", title: "保存有用決策" },
            { id: "distill", step: "/distill · 整理來源", title: "建立有來源的頁面" },
            { id: "brief", step: "/brief · 下次開始", title: "下次把它找回來" },
          ],
          distillNote: "AI 代理也能直接建立主題頁；請先連接工具，確認產生內容所需的模型設定，並檢查實際結果。",
          arcLabel: "/handoff 收尾每一輪",
        },
        bento: {
          cells: [
            {
              id: "pages",
              title: "留下能接著用的知識頁面",
              body: "將決策與經驗整理成你能閱讀、AI 能使用的頁面，不再只留在聊天記錄裡。",
            },
            {
              id: "graph",
              title: "找回答案，也找回脈絡",
              body: "設定檢索後，可一併找回相關人物、專案與知識頁面，再沿著連結檢查來源紀錄。",
            },
            {
              id: "citations",
              title: "答案從哪來，看得見",
              body: "Wenlan 整理出的頁面附有來源連結，方便回查支持它的紀錄。來源連結本身不代表每個主張都已被證明。",
            },
            {
              id: "review",
              title: "先看變更，再決定採用",
              body: "已設定的審核流程可提出信心不足或互相矛盾的紀錄，由你判斷哪些內容能用在後續工作。",
            },
            {
              id: "nurture",
              title: "知道哪些內容需要重查",
              body: "設定背景處理後，可批次建立關聯、更新相符頁面，並標記過時紀錄供你檢查。",
            },
            {
              id: "spaces",
              title: "不同工作的知識，分開管理",
              body: "用 Spaces 區分工作、個人或客戶專案。工具與使用中的空間需正確設定，才能按空間保存及檢索。",
            },
            {
              id: "git",
              title: "像程式碼一樣有版本",
              body: "紀錄、頁面與工作階段產物保存在真正的 Git 歷史裡，可以查看差異，也可以還原。",
            },
            {
              id: "mcp",
              title: "不同工具，接著同一份知識",
              body: "已設定的 MCP 工具可透過同一個本地服務讀取紀錄；連線設定與工具權限決定能存取的範圍。",
            },
          ],
        },
        storage: {
          title: "記得意思，\n卻忘了當時怎麼寫？",
          intro:
            "Hybrid Retrieval 結合關鍵字、語意與關聯脈絡，協助找回相關知識。設定好的頁面處理流程，再將來源整理成能閱讀、核對與保存的 Markdown。",
          indexLabel: "索引 · agents 的工作記憶",
          filesLabel: "Markdown · 屬於你的長期紀錄",
          fusionNote: "索引幫你找回資料，頁面讓你閱讀與核對；兩者各有用途。",
          distillCaption: "整理成頁",
          ingestCaption: "索引頁面",
          tradeoffs: [
            {
              id: "files-alone",
              title: "純檔案",
              body: "適合你或 agent 能直接搜尋的小型、穩定集合。集合變大或變動後，可能需要明確的 retrieval 和審核。",
            },
            {
              id: "db-alone",
              title: "索引",
              body: "適合對已設定來源快速查找；若人需要檢查變更，應搭配可讀 artifacts 和審核路徑。",
            },
            {
              id: "index-files",
              title: "索引加檔案",
              body: "把查找與可讀、有版本的 artifacts 放在一起。合適與否取決於來源邊界和維護流程。",
            },
          ],
        },
        metrics: {
          title: "Retrieval snapshot 範圍。",
          bars: [
            {
              id: "full-replay",
              label: "完整聊天重播",
              value: "每次查詢 4,505 tokens / query",
              sub: "不使用 retrieval，整份 transcript 進 context",
            },
            {
              id: "wenlan",
              label: "Wenlan 檢索",
              value: "每次查詢 168 tokens / query",
              sub: "CE-reranked，500 題 snapshot",
            },
          ],
          footnote:
            "固定 fixture 上的 retrieval-only snapshots。LME_S 在 stratified N=90 deep-S fixture 上記錄 87.7% R@5 和 0.815 MRR。這不是一般的時間或 token 節省保證，也不是 Wenlan 與其他工具的比較。Token 比較只限於這項 retrieval 測試中的完整重播與 retrieved context。",
        },
      },
    },
  },
  about: {
    status: "translated",
    sourceHash: "05bf0f253730ae4524c7b143d582c68bd57389ea9598e81646b47d8c97eaa7b3",
    content: {
      seo: {
        title: "關於 Wenlan | AI 工作的 LLM wiki",
        description:
          "Wenlan 是 open-source、local-first 的 AI 工作 LLM wiki，由 AI 代理建立，並以來源為根基。",
      },
      breadcrumbs: {
        home: "Wenlan",
        current: "關於",
      },
      hero: {
        eyebrow: "關於",
        title: "AI 工作的 LLM\u00a0wiki。",
        description:
          "AI 代理捕捉學到的內容，你加入信任來源，Wenlan 讓有來源依據的 wiki 頁面在 AI 工作中保持最新。",
        statusLabel: "專案狀態",
        statusItems: ["版本 v0.18.0", "支援 macOS、Linux、Windows", "Apache-2.0", "Qi-Xuan Lu 建置"],
      },
      sections: [
        {
          id: "why",
          number: "01",
          title: "為什麼 Wenlan 存在",
          paragraphs: [
            "AI 工作已經變成嚴肅工作，但大多數 sessions 仍像一次性對話一樣結束。決策、debugging lessons、專案限制和 handoffs 都被埋在舊 chats 裡。",
            "Wenlan 是為了讓工作累積成 LLM wiki 而建。AI 代理可以保存重要內容，之後 recall，並讓有來源依據的 refined context 跨 MCP-compatible tools 持續可用。",
          ],
        },
        {
          id: "builder",
          number: "03",
          title: "由 Qi-Xuan Lu 建置",
          paragraphs: [
            "Wenlan 由 Qi-Xuan Lu (GitHub @7xuanlu) 建置與維護。背景涵蓋 AI infrastructure、knowledge graphs 和 local-first systems。",
            "這項工作聚焦在 agent 能建構、使用者能檢查的 LLM wiki：libSQL 上的 hybrid retrieval、可讀頁面的真實 git versioning、session handoffs、status artifacts、distilled pages 的 mandatory provenance，以及一個 daemon 服務多種 AI tools。",
            "專案渠道：bugs 和 feature requests 用 GitHub Issues，vulnerabilities 看 SECURITY.md，變更則看 Wenlan release notes。",
          ],
        },
        {
          id: "status",
          number: "04",
          title: "目前狀態",
          paragraphs: [
            "Wenlan v0.18.0 提供已公證的 macOS Apple Silicon DMG 與 Windows x64 桌面版，以及 macOS、Linux (x86_64, aarch64; glibc) 和 Windows (x86_64) 原生 headless runtime 套件。Windows 使用者可以選擇桌面版 setup 安裝檔或 headless runtime ZIP。daemon、CLI、MCP server、Claude Code plugin 與 Codex plugin 採 Apache-2.0；桌面 App crate 採 AGPL-3.0-only。",
          ],
        },
      ],
      principles: {
        title: "設計原則",
        items: [
          {
            id: "local-first",
            title: "本地優先",
            body: "Memory 從你的機器開始。Cloud sync、telemetry、本地模型和 API keys 都是 opt-in，而不是預設的 source of truth。",
          },
          {
            id: "human-readable",
            title: "人可閱讀",
            body: "Memory、page 和 session writes 會在本地 git 留下 Markdown artifacts。daemon database 負責 retrieval，而有來源引用的 artifacts 仍可檢查。",
          },
          {
            id: "session-rhythm",
            title: "Session 節奏",
            body: "Wenlan 順著 AI 工作實際發生的方式：載入 context、捕捉 durable facts、寫 handoffs，並把正確 context 帶進下一次執行。",
          },
          {
            id: "deliberate-distillation",
            title: "刻意蒸餾",
            body: "Sessions 之間，Wenlan 會 deduplicate 重複 facts 並連結相關 ideas。當一個 topic 值得成為 source-backed page 時，執行 /distill；本地模型或 API keys 可以加入 automatic page distillation 和更豐富的 graph work。",
          },
        ],
      },
      projectLinksHeading: "開源",
      projectLinks: [
        {
          id: "repository",
          href: "https://github.com/7xuanlu/wenlan",
          label: "GitHub 程式碼庫",
        },
        {
          id: "license",
          href: "https://github.com/7xuanlu/wenlan/blob/main/LICENSE",
          label: "Apache-2.0 授權",
        },
        {
          id: "contributing",
          href: "https://github.com/7xuanlu/wenlan/blob/main/CONTRIBUTING.md",
          label: "貢獻指南",
        },
        {
          id: "security",
          href: "https://github.com/7xuanlu/wenlan/blob/main/SECURITY.md",
          label: "安全政策",
        },
      ],
      help: {
        eyebrow: "協助",
        bodyPrefix: "Bugs 和 feature requests 請使用 GitHub Issues。Vulnerabilities 請遵循",
        securityLink: {
          id: "security-reporting-guide",
          href: "/docs/security",
          label: "安全回報指南",
        },
        bodySuffix: "。",
      },
      cta: {
        primary: { id: "get-started", href: "/docs/get-started", label: "開始使用" },
        secondary: {
          id: "github",
          href: "https://github.com/7xuanlu/wenlan",
          label: "在 GitHub 查看",
        },
      },
      schema: {
        name: "關於 Wenlan",
        description:
          "Wenlan 是 open-source、local-first 的 AI 工作 LLM wiki，由 Qi-Xuan Lu 建置。",
      },
    },
  },
  docs: {
    status: "translated",
    sourceHash: "e21926e641813121b13ad92603d66fca7d97494042cca9bf3bdb51157e0c8527",
    content: {
      seo: {
        title: "Wenlan 文件 | AI 工作的 LLM wiki",
        description:
          "安裝 Wenlan，學習 AI 工作記憶循環，理解有來源依據的 wiki 頁面、provenance、retrieval 和 MCP clients 如何配合。",
      },
      breadcrumbs: {
        home: "Wenlan",
        current: "文件",
      },
      hero: {
        eyebrow: "文件",
        title: "開始使用 Wenlan。",
        description:
          "安裝 Wenlan、連接你使用的 AI tools，並建立可讀、可搜尋、由你掌控的 source-backed LLM wiki。",
      },
      intro: {
        eyebrow: "從這裡開始",
        body: "新使用者應該先安裝，為自己的 client 執行 setup，接著閱讀 daily workflow 和 core concepts。Project docs 涵蓋 source-backed pages、architecture、reference paths、evals、releases、scope、source builds、roadmap、development conventions 和 contribution paths。",
      },
      sections: {
        items: [
          {
            id: "start-here",
            title: "從這裡開始",
            description: "安裝 Wenlan，並驗證第一次 memory round trip。",
            items: [
              {
                id: "get-started",
                href: "/docs/get-started",
                label: "設定",
                title: "開始使用 Wenlan",
                description:
                  "選擇 Claude Code、Codex、ChatGPT 或本地 MCP 路徑，然後確認第一次 capture 與 recall round trip 可以運作。",
                meta: "Wenlan 團隊 · 更新於 2026 年 7 月 9 日 · 4 分鐘設定",
              },
            ],
          },
          {
            id: "after-setup",
            title: "安裝之後",
            description:
              "把安裝變成工作習慣：帶著 context 開始、捕捉有用內容、檢查哪些內容應該被信任，並在 context 變冷前 hand off。",
            items: [
              {
                id: "daily-workflow",
                href: "/docs/daily-workflow",
                label: "工作流程",
                title: "每日 Workflow",
                description:
                  "帶著 context 開始，捕捉重要內容，需要時 recall，並在 context 變冷前 hand off。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "capture-quality",
                href: "/docs/capture-quality",
                label: "捕捉",
                title: "捕捉品質",
                description:
                  "判斷什麼該進 Wenlan：durable facts、decisions、lessons、gotchas、corrections 和 project context。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "review-and-trust",
                href: "/docs/review-and-trust",
                label: "信任",
                title: "檢視與信任",
                description:
                  "了解 Wenlan 如何讓不確定的 memory 可見：pending captures、revisions、contradictions、rejections、confirm 和 forget。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "core-concepts",
                href: "/docs/core-concepts",
                label: "概念",
                title: "核心概念",
                description:
                  "了解 Wenlan 背後的元件：memories、sessions、handoffs、pages、daemon、MCP、Markdown 和 local index。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 6 分鐘閱讀",
              },
            ],
          },
          {
            id: "reference",
            title: "參考資料",
            description:
              "Memory types、glossary、architecture、commands、Claude Code 和 Codex plugins、CLI/service management、updates、upgrade notes、package names、platform support、HTTP API、API examples、typed clients、spaces、graph context、pages、import paths、git history、retrieval status、experimental flags、local data、backup paths、configuration、environment variables、本地與 web MCP clients、agent profiles、diagnostics、FAQ 和 repair paths。",
            items: [
              {
                id: "memory-types",
                href: "/docs/memory-types",
                label: "記憶",
                title: "Wenlan Memory 類型與 memory_type 值",
                description:
                  "依據 capture 日後為何重要，選擇 identity、preference、decision、lesson、gotcha 或 fact。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 7 月 10 日 · 5 分鐘閱讀",
              },
              {
                id: "glossary",
                href: "/docs/glossary",
                label: "詞彙表",
                title: "詞彙表",
                description:
                  "快速對照 Wenlan 術語：memory、handoff、page、space、daemon、MCP、local index、provenance 和 eval language。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "architecture",
                href: "/docs/architecture",
                label: "架構",
                title: "架構",
                description:
                  "Wenlan 的組成方式：一個本地 daemon、薄 client、shared wire types、本地 artifacts，以及由 wenlan-core 負責的 retrieval。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 7 分鐘閱讀",
              },
              {
                id: "product-matrix",
                href: "/docs/product-matrix",
                label: "矩陣",
                title: "產品矩陣",
                description:
                  "對照 Wenlan 的 daemon、CLI、MCP connector、plugins、desktop app、程式碼庫、平台 artifacts 和 release 邊界。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 7 月 9 日 · 6 分鐘閱讀",
              },
              {
                id: "commands",
                href: "/docs/commands",
                label: "指令參考",
                title: "Commands 與 Tools",
                description:
                  "日常使用 Wenlan 時最重要的 Claude Code 與 Codex plugin commands、CLI commands 和 MCP tools。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "claude-code-plugin",
                href: "/docs/claude-code-plugin",
                label: "外掛",
                title: "Claude Code 外掛",
                description:
                  "在 Claude Code 中使用 Wenlan 最完整的 workflow：setup、brief、capture、recall、lint diagnostics、curate、distill、pages 和 handoff。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 7 月 17 日 · 6 分鐘閱讀",
              },
              {
                id: "cli-and-service",
                href: "/docs/cli-and-service",
                label: "CLI 管理",
                title: "Wenlan CLI 指令與 Service 管理",
                description:
                  "使用 Wenlan CLI 做 setup、daemon status、doctor diagnostics、background service management、memory search，並連接 MCP clients。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 7 月 10 日 · 5 分鐘閱讀",
              },
              {
                id: "updates-and-uninstall",
                href: "/docs/updates-and-uninstall",
                label: "生命週期",
                title: "更新與解除安裝",
                description:
                  "刷新 Wenlan 本地 runtime、驗證版本健康、重啟 MCP clients，並在不意外遺失資料的前提下移除 service。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 4 分鐘閱讀",
              },
              {
                id: "upgrade-notes",
                href: "/docs/upgrade-notes",
                label: "升級",
                title: "升級筆記",
                description:
                  "閱讀 Wenlan releases 的實用升級路徑：要重跑什麼、驗證什麼，以及目前 public runtime shape 改了什麼。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "packages-and-registries",
                href: "/docs/packages-and-registries",
                label: "Packages 套件",
                title: "Packages 與 Registries",
                description:
                  "了解 Wenlan package name 如何對應到 plugin、runtime setup、MCP connector、Rust crates 和 release binaries。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 4 分鐘閱讀",
              },
              {
                id: "platforms",
                href: "/docs/platforms",
                label: "平台",
                title: "平台支援",
                description:
                  "了解 Wenlan 如何在 macOS、Linux 和 Windows 上執行：service managers、local data paths、model backends，以及 Docker/VM caveats。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "http-api",
                href: "/docs/http-api",
                label: "API 參考",
                title: "HTTP API 參考",
                description:
                  "了解 CLI、MCP connector、plugin 和 local tools 背後呼叫的本地 daemon surfaces。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "api-examples",
                href: "/docs/api-examples",
                label: "API 範例",
                title: "API 範例",
                description:
                  "當 CLI 或 MCP tools 不是合適選擇時，從 scripts 使用本地 daemon HTTP API。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 6 分鐘閱讀",
              },
              {
                id: "typed-clients",
                href: "/docs/typed-clients",
                label: "Types 參考",
                title: "Typed Clients 型別客戶端",
                description:
                  "當 Rust tool 需要呼叫本地 daemon、又不想依賴 untyped JSON shapes 時，使用 wenlan-types。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 4 分鐘閱讀",
              },
              {
                id: "spaces",
                href: "/docs/spaces",
                label: "Spaces 管理",
                title: "Spaces 空間",
                description:
                  "分開 work、personal、client 和 project memory，並了解 Wenlan 如何解析 active space。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 6 分鐘閱讀",
              },
              {
                id: "knowledge-graph",
                href: "/docs/knowledge-graph",
                label: "Graph 圖譜",
                title: "Knowledge Graph 知識圖譜",
                description:
                  "了解 Wenlan 如何連結 people、projects、tools、observations 和 relations，讓 recall 不只靠文字相似度也能找回 context。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "source-backed-pages",
                href: "/docs/source-backed-pages",
                label: "Pages 頁面",
                title: "有來源支撐的 Pages",
                description:
                  "了解 Wenlan 如何把 atomic captures 變成含 source memory IDs、revision state 和 refresh paths 的可讀 pages。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "import-and-portability",
                href: "/docs/import-and-portability",
                label: "可攜性",
                title: "Import 與 Portability",
                description:
                  "把選定的 durable context 移入 Wenlan，並讓 Wenlan 的可讀 artifacts 在 daemon 之外也保持 portable。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "local-git-history",
                href: "/docs/local-git-history",
                label: "版本",
                title: "本地 Git History",
                description:
                  "檢查 Wenlan 為可讀 page、session、handoff 和 status artifacts 保留的真實 git history。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "models-and-keys",
                href: "/docs/models-and-keys",
                label: "模型",
                title: "Models 與 Keys",
                description:
                  "在 local memory mode、可選 on-device models 和可選 Anthropic API keys 之間選擇，用於更豐富的 extraction、page synthesis、recaps 和 graph work。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "advanced-retrieval",
                href: "/docs/advanced-retrieval",
                label: "Retrieval 檢索",
                title: "進階 Retrieval 狀態",
                description:
                  "了解 Wenlan 已發布的 retrieval path，以及新版 retrieval work 背後那些 opt-in main-branch experiments。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 6 分鐘閱讀",
              },
              {
                id: "experimental-flags",
                href: "/docs/experimental-flags",
                label: "Experiments 實驗",
                title: "Experimental Flags 實驗旗標",
                description:
                  "了解如何閱讀 Wenlan 的 opt-in main-branch flags，而不把它們誤認為 released defaults。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 6 分鐘閱讀",
              },
              {
                id: "data-and-privacy",
                href: "/docs/data-and-privacy",
                label: "本地控制",
                title: "Wenlan 本地資料與隱私",
                description:
                  "了解 Wenlan 把 AI work memory 存在哪裡、哪些資料留在你的機器上，以及 connected model providers 何時可能看到 prompts。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 7 月 10 日 · 5 分鐘閱讀",
              },
              {
                id: "backup-and-migration",
                href: "/docs/backup-and-migration",
                label: "備份",
                title: "備份與遷移",
                description:
                  "一起備份 Wenlan 的可讀 artifacts 和 daemon data，並在信任 recall 前驗證還原後的 runtime。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "configuration",
                href: "/docs/configuration",
                label: "設定",
                title: "Wenlan 設定",
                description:
                  "設定 Wenlan spaces、MCP clients、daemon bind address、local paths、models 和 keys，不需要手動編輯 database。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "environment-variables",
                href: "/docs/environment-variables",
                label: "Config 變數",
                title: "Environment Variables 環境變數",
                description:
                  "了解哪些 Wenlan environment variables 是一般 configuration、哪些只用於 development，以及哪些屬於 eval 或 Windows repair paths。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "mcp-clients",
                href: "/docs/mcp-clients",
                label: "MCP 連接",
                title: "連接 MCP Clients",
                description:
                  "把 Claude Code、Codex、Cursor、Claude Desktop、Gemini CLI、ChatGPT、Claude.ai 和其他 MCP clients 連接到 Wenlan。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 4 分鐘閱讀",
              },
              {
                id: "agent-profiles",
                href: "/docs/agent-profiles",
                label: "Agents 管理",
                title: "Wenlan Agent Profiles 與 Client Attribution",
                description:
                  "查看是哪個 AI client 寫入 memory、檢查 source_agent attribution，並管理 trust 或 enabled state。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 7 月 10 日 · 4 分鐘閱讀",
              },
              {
                id: "troubleshooting",
                href: "/docs/troubleshooting",
                label: "修復",
                title: "疑難排解",
                description:
                  "修正常見 setup issues：daemon 未執行、MCP 未連上、Claude commands 缺失、stale context，以及 support escalation。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "diagnostics-and-issue-reports",
                href: "/docs/diagnostics-and-issue-reports",
                label: "診斷",
                title: "診斷與 Issue 回報",
                description:
                  "求助前先跑正確 checks，分開 daemon problems 與 client problems，並只分享 redacted output。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "faq",
                href: "/docs/faq",
                label: "常見問題",
                title: "FAQ 常見問題",
                description:
                  "安裝 Wenlan 前後常見 adoption questions 的短答案。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 4 分鐘閱讀",
              },
            ],
          },
          {
            id: "project",
            title: "專案",
            description:
              "Security reporting、evaluation、desktop status、changelog、release/versioning、roadmap、project scope、source builds、testing、CI、development conventions，以及協助判斷 Wenlan 是否可信到值得採用或貢獻的 contribution paths。",
            items: [
              {
                id: "security",
                href: "/docs/security",
                label: "安全",
                title: "安全與回報",
                description:
                  "私下回報 Wenlan vulnerabilities、讓 diagnostic output 保持 redacted，並了解 local daemon security boundary。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 7 月 10 日 · 4 分鐘閱讀",
              },
              {
                id: "evaluation",
                href: "/docs/evaluation",
                label: "評估",
                title: "Evaluation 評估",
                description:
                  "了解 Wenlan 公開 retrieval numbers 代表什麼、如何產生，以及沒有聲稱什麼。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 6 分鐘閱讀",
              },
              {
                id: "desktop-app",
                href: "/docs/desktop-app",
                label: "桌面版",
                title: "Desktop App 狀態",
                description:
                  "了解可選的 Wenlan desktop app 與 daemon、plugins、source-backed wiki，以及 ChatGPT 和 Claude.ai Remote Access 的關係。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 4 分鐘閱讀",
              },
              {
                id: "changelog",
                href: "/docs/changelog",
                label: "版本",
                title: "Wenlan Changelog 與版本記錄",
                description:
                  "查看 Wenlan 目前版本、已發布變更，以及如何區分 tagged releases 與 main 上尚未發布的工作。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 9 月 4 日 · 5 分鐘閱讀",
              },
              {
                id: "releases-and-versioning",
                href: "/docs/releases-and-versioning",
                label: "發布",
                title: "Releases 與 Versioning",
                description:
                  "了解 Wenlan 如何把 merged work 變成 tagged releases、package versions、binaries、npm packages 和 crates。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "roadmap",
                href: "/docs/roadmap",
                label: "路線圖",
                title: "Roadmap 與 Status",
                description:
                  "了解 Wenlan 目前方向，同時不混淆 released features、main-branch work 和 future bets。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 6 分鐘閱讀",
              },
              {
                id: "project-scope",
                href: "/docs/project-scope",
                label: "範疇",
                title: "Project Scope 專案範疇",
                description:
                  "Wenlan 適合什麼、刻意避開什麼，以及如何判斷它是否適合你的 AI work。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "build-from-source",
                href: "/docs/build-from-source",
                label: "開發",
                title: "從 Source Build",
                description:
                  "從 public repository build Wenlan daemon、CLI、MCP server、shared types、core crate 和 plugin。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "testing-and-ci",
                href: "/docs/testing-and-ci",
                label: "品質",
                title: "Testing 與 CI",
                description:
                  "了解哪些 Wenlan checks 在本地執行、哪些在 GitHub Actions 執行，以及哪些 evals 保持 manual。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "development-conventions",
                href: "/docs/development-conventions",
                label: "開發慣例",
                title: "Development Conventions 開發慣例",
                description:
                  "讓 Wenlan daemon、CLI、MCP connector、shared types 和 core logic 維持可維護的 codebase rules。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
              {
                id: "contributing",
                href: "/docs/contributing",
                label: "開源貢獻",
                title: "Contributing 貢獻",
                description:
                  "如何為 Wenlan 貢獻有用的 bug reports、docs、eval cases 和 code changes。",
                meta: "Qi-Xuan Lu · 更新於 2026 年 6 月 24 日 · 5 分鐘閱讀",
              },
            ],
          },
        ],
      },
      cta: {
        eyebrow: "已經安裝了？",
        title: "把 memory loop 變成習慣。",
        body: "先從 daily workflow 開始；需要 commands、MCP setup 或 repair steps 時，再使用 reference docs。",
        primary: { id: "daily-workflow", href: "/docs/daily-workflow", label: "每日工作流程" },
        secondary: {
          id: "github",
          href: "https://github.com/7xuanlu/wenlan",
          label: "GitHub",
        },
      },
      schema: {
        name: "Wenlan 文件",
        description: "Wenlan 這套 source-backed AI 工作 LLM wiki 的產品文件。",
      },
    },
  },
  getStarted: {
    status: "translated",
    sourceHash: "b05b606fee5b581cc398bfd36201f904fcac4037f88c515a43f9354f8ed412c5",
    content: {
      seo: {
        title: "安裝 Wenlan：Claude Code、Codex、ChatGPT 與 MCP",
        description:
          "安裝 Wenlan，連接 Claude Code、Codex、ChatGPT、Claude.ai 或其他 MCP client，再驗證第一次 capture 與 recall round trip。",
      },
      breadcrumbs: {
        home: "Wenlan",
        docs: "文件",
      },
      hero: {
        eyebrow: "開始使用",
        title: "安裝 Wenlan，連接你的\u00a0AI\u00a0工具。",
        description:
          "選擇一條 client 路徑，連到同一個 local daemon，再驗證一次 capture 與 recall round trip。",
        meta: ["Wenlan 團隊", "更新於 2026 年 7 月 31 日", "5 分鐘設定"],
        setupPathLabel: "設定路徑",
        setupPathItems: ["執行環境", "Claude Code", "Codex", "本地 + 遠端 MCP"],
      },
      steps: [
        {
          id: "install-runtime",
          number: "01",
          title: "安裝適合你系統的 runtime",
          paragraphs: [
            "Wenlan v0.18.0 提供 Windows x64、macOS Apple silicon，以及 Linux x64 或 ARM64 glibc 的原生 runtime 套件。每份 runtime archive 都包含 CLI、daemon 與 MCP connector。",
            "在 Windows 上，請把 wenlan-windows-x64.zip 當成一個整體解壓到使用者擁有且已加入 PATH 的目錄。onnxruntime.dll、vulkan-1.dll 與三個執行檔必須放在一起。",
          ],
          commands: [
            "# macOS Apple silicon\nnpx -y wenlan setup",
            "# Linux x64 或 ARM64\ncurl -fsSL https://raw.githubusercontent.com/7xuanlu/wenlan/main/install.sh | bash\nwenlan setup --basic\nwenlan background on\nwenlan status",
            "# Windows x64：解壓 ZIP 並加入 PATH 後\nwenlan setup --basic\nwenlan background on\nwenlan status",
          ],
          ctas: [
            {
              id: "windows-download",
              href: "https://github.com/7xuanlu/wenlan/releases/download/v0.18.0/wenlan-windows-x64.zip",
              label: "下載 Windows x64",
            },
            {
              id: "all-downloads",
              href: "https://github.com/7xuanlu/wenlan/releases/tag/v0.18.0",
              label: "全部 v0.18.0 下載",
            },
          ],
        },
        {
          id: "claude-code-plugin",
          number: "02",
          title: "Claude Code 外掛",
          paragraphs: [
            "這是最快的路徑。plugin 會處理 daemon setup、MCP wiring、本地 memory setup，以及第一次 round-trip check。",
            "如果 Claude Code 在安裝後要求 restart，重啟一次，然後執行 /setup。",
          ],
          commands: claudeCommands,
          ctas: [],
        },
        {
          id: "codex",
          number: "03",
          title: "Codex 設定",
          paragraphs: [
            "先執行 Wenlan setup，再把 Codex 連接到本地 MCP server。主要 Wenlan repo 也提供 Codex plugin 給從 checkout 安裝的使用者；wenlan connect codex 是不需要 checkout 的直接 client 路徑。",
          ],
          commands: ["wenlan connect codex"],
          ctas: [],
        },
        {
          id: "chatgpt-web",
          number: "04",
          title: "ChatGPT 和 Claude.ai",
          paragraphs: [
            "在 Wenlan desktop app 開啟 Remote Access，為 Streamable HTTP MCP 建立暫時的 HTTPS URL。App 會在 loopback 以 --no-auth 啟動 wenlan-mcp，再透過 tunnel 暴露；任何拿到 URL 的人都能存取。在 ChatGPT 開啟 Settings > Plugins，建立 New Plugin，在 Connection 下選擇 Server URL，貼上 URL，並把 Authentication 設為 None。Claude.ai 則透過 Directory > Plugins 從 7xuanlu/wenlan marketplace 安裝 Wenlan。",
            "這是連接到你自己 Wenlan runtime 的 custom MCP，不代表 Wenlan 已列入公開 ChatGPT Apps Directory。不使用時請停止 Remote Access。",
          ],
          commands: [],
          ctas: [],
        },
        {
          id: "other-mcp-clients",
          number: "05",
          title: "其他本地 MCP clients",
          paragraphs: [
            "Cursor、Claude Desktop、Gemini CLI、VS Code 和其他受支援的本地 MCP clients，要先設定 Wenlan runtime，再讓 CLI 寫入 client-specific MCP configuration。",
            "Wenlan setup 會安裝 CLI、daemon 和 MCP connector，向作業系統的 user service manager 註冊 daemon，並驗證狀態。",
          ],
          commands: ["wenlan connect cursor\n# 或：claude-desktop, vscode, gemini"],
          ctas: [],
        },
        {
          id: "try-first",
          number: "06",
          title: "先試什麼",
          paragraphs: [
            "保存一個 durable project fact，再請另一個 session 或 client recall。Wenlan 應該能找回這個 fact，並把來源保留給 wiki 與 review flow。",
          ],
          commands: [],
          ctas: [
            { id: "daily-workflow", href: "/docs/daily-workflow", label: "開始 daily workflow" },
            { id: "learn", href: "/learn", label: "閱讀文章" },
          ],
        },
      ],
      sidebar: {
        eyebrow: "你會得到",
        items: [
          { id: "source-backed-wiki", label: "有來源依據的 LLM wiki" },
          { id: "local-daemon", label: "本地 daemon" },
          { id: "agent-plugins", label: "Claude Code + Codex 外掛" },
          { id: "mcp-server", label: "本地 + 遠端 MCP" },
        ],
      },
      schema: {
        name: "開始使用 Wenlan",
        description:
          "透過 Claude Code、Codex、ChatGPT、Claude.ai 或其他 MCP client 連接 Wenlan。",
      },
    },
  },
  notFound: {
    status: "translated",
    sourceHash: "58391d595516d6d5c9ccfe9b619b16eadab552459334ae9fefd950899b332dc5",
    content: {
      eyebrow: "404",
      title: "這個頁面不存在。",
      description:
        "如果你是從連結進來，連結可能已經過期。如果你手動輸入 URL，請檢查是否有錯字。下面是常用起點。",
      primaryCta: "回到首頁",
      secondaryCta: "瀏覽文章",
      popularHeading: "常用目的地",
      popularDestinations: [
        {
          id: "get-started",
          href: "/docs/get-started",
          label: "開始使用",
          description: "安裝 Wenlan，並驗證第一次本地 memory loop。",
        },
        {
          id: "daily-workflow",
          href: "/docs/daily-workflow",
          label: "每日工作流程",
          description: "在 AI sessions 之間 capture、handoff、distill。",
        },
        {
          id: "ai-work-memory",
          href: "/learn/ai-work-memory",
          label: "AI 工作記憶",
          description: "當 AI sessions 能跨天帶著 context，工作會有什麼改變。",
        },
        {
          id: "mcp-memory-server",
          href: "/learn/mcp-memory-server",
          label: "MCP 記憶伺服器",
          description: "Wenlan 如何透過 MCP 暴露 memory。",
        },
        {
          id: "basic-memory",
          href: "/learn/wenlan-vs-basic-memory",
          label: "Wenlan 與 Basic Memory 比較",
          description: "Markdown knowledge base 與 AI work-session memory layer 的差異。",
        },
        {
          id: "about",
          href: "/about",
          label: "關於",
          description: "專案背景、原則，以及 Wenlan 背後的人。",
        },
      ],
    },
  },
  footer: {
    status: "translated",
    sourceHash: "558ca7745c25cdaa3abd7bde264e12bbdcb08277e2415857775db600912c7978",
    content: {
      ariaLabel: "網站頁尾",
      brand: "Wenlan",
      tagline: "AI 工作的 LLM wiki。",
      groups: [
        {
          id: "product",
          title: "產品",
          links: [
            { id: "get-started", href: "/docs/get-started", label: "開始使用" },
            { id: "daily-workflow", href: "/docs/daily-workflow", label: "每日工作流程" },
            { id: "capture-quality", href: "/docs/capture-quality", label: "捕捉品質" },
            { id: "core-concepts", href: "/docs/core-concepts", label: "核心概念" },
            { id: "data-and-privacy", href: "/docs/data-and-privacy", label: "資料與隱私" },
            { id: "configuration", href: "/docs/configuration", label: "設定" },
            { id: "updates", href: "/docs/updates-and-uninstall", label: "更新" },
            { id: "platforms", href: "/docs/platforms", label: "平台" },
            { id: "docs", href: "/docs", label: "文件" },
          ],
        },
        {
          id: "learn",
          title: "學習",
          links: [
            { id: "llm-wiki", href: "/learn/distilled-wiki-pages-ai-memory", label: "LLM wiki 導覽" },
            { id: "ai-knowledge-base", href: "/learn/source-backed-wiki-pages-ai-work", label: "AI 知識庫導覽" },
            { id: "tool-selection", href: "/learn/choose-ai-knowledge-base-tool", label: "AI 知識庫工具選擇" },
            { id: "obsidian", href: "/learn/wenlan-vs-obsidian-ai-memory", label: "Obsidian 與 AI 工作" },
          ],
        },
        {
          id: "project",
          title: "專案",
          links: [
            { id: "about", href: "/about", label: "關於" },
            { id: "architecture", href: "/docs/architecture", label: "架構" },
            { id: "evaluation", href: "/docs/evaluation", label: "評估" },
            { id: "changelog", href: "/docs/changelog", label: "變更記錄" },
            { id: "roadmap", href: "/docs/roadmap", label: "路線圖" },
            { id: "project-scope", href: "/docs/project-scope", label: "專案範疇" },
            { id: "security", href: "/docs/security", label: "安全" },
            { id: "github", href: "https://github.com/7xuanlu/wenlan", label: "GitHub" },
            { id: "rss", href: "/feed.xml", label: "RSS 訂閱" },
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
