import type { LearnArticle } from "@/app/(en)/learn/articles";
import { workedExampleSections } from "@/lib/llm-wiki-worked-example";
import {
  isTranslatedLearnSlug,
  TRANSLATED_LEARN_SLUGS,
  TRANSLATED_LEARN_SLUGS_BY_LOCALE,
  translatedLearnStaticParams,
  type TranslatedLearnSlug,
} from "./learn-availability";
import type { TranslatedLocale } from "./locales";

export {
  isTranslatedLearnSlug,
  TRANSLATED_LEARN_SLUGS,
  TRANSLATED_LEARN_SLUGS_BY_LOCALE,
  translatedLearnStaticParams,
  type TranslatedLearnSlug,
} from "./learn-availability";

const zhTWArticles = {
  "prevent-multi-agent-knowledge-conflicts": {
    slug: "prevent-multi-agent-knowledge-conflicts",
    eyebrow: "共享知識維護",
    category: "Workflows",
    title: "多個 AI Agent 共用知識衝突？避免覆寫與過期結論",
    description:
      "避免多個 AI Agent 覆寫共享知識、採用缺乏證據的主張，或在來源改變後繼續使用過期結論。",
    metaTitle: "多個 AI Agent 共用知識衝突與過期結論 | Wenlan",
    metaDescription:
      "用證據、候選主張、版本檢查、人工審查與歷史記錄，避免多個 AI Agent 傳播衝突或過期的共享知識。",
    keywords: [
      "多個 AI Agent 共用知識衝突",
      "避免共享 AI 知識過期",
      "AI Agent 記憶衝突",
      "多代理知識寫入衝突",
      "AI 知識庫版本衝突",
      "共享知識來源追蹤",
    ],
    publishedAt: "2026-08-24",
    updatedAt: "2026-08-24",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "讓多個 coding、研究或營運 Agent 讀寫同一份專案知識的團隊",
    heroBullets: [
      "不要讓每個 Agent 直接把輸出寫成已接受的共享知識。",
      "把原始證據、候選主張與已接受結論分成三個狀態。",
      "在接受前辨識過期寫入、審查矛盾，並保留被取代結論的歷史。",
    ],
    sections: [
      {
        heading: "先說結論：Agent 寫入只是候選主張",
        body: [
          "多個 AI Agent 共用知識時，不要採用最後寫入者自動勝出的規則。每次寫入先保留來源、寫入者、適用範圍、擷取時間與預期版本；只有重新檢查目前來源並完成審查後，候選主張才能成為已接受的共享知識。",
          "若目標版本已變，就在呼叫 `write_page` 前停止流程並重新讀取；若兩個結論互相矛盾，就保留衝突，不用新文字靜默覆蓋舊歷史。",
        ],
      },
      {
        heading: "先分清五種失敗",
        body: [
          "共享檔案、向量庫或記憶服務只能讓 Agent 看到同一批資料，不能自動判斷哪一條是目前正確的知識。先把失敗分類，才能選擇版本檢查、來源重讀或人工審查。",
        ],
        bullets: [
          "覆寫：Agent B 的最後寫入把 Agent A 有證據的內容直接蓋掉。",
          "過期：Agent 依照舊版來源產生結論，寫入前來源已經改變。",
          "矛盾：兩個主張都看似合理，但內容、範圍或時間互不相容。",
          "範圍污染：一個 Agent 的專案、角色或個人資料流入不該共享的空間。",
          "假完成：Agent 記錄工作已完成，卻沒有測試、檔案或可重現結果。",
        ],
      },
      {
        heading: "使用候選、驗證、接受三階段流程",
        body: [
          "先指定事實或 Page 的權威來源與寫入範圍。Agent 身分本身不是權威；程式、測試、規格與維護中的第一方文件仍優先。",
          "審查時回到原始證據，把主張標記為 supported、contradicted、stale、replaced 或 unresolved。資訊較新不代表一定正確；證據不足時，保留未解狀態。",
          "下列斜線命令只適用於已透過 `/setup` 安裝 Wenlan Codex plugin 的 Codex。其他 Agent 可使用本機 MCP 的 `recall`、`capture`、`distill`、`lint`、`list_pending_revisions`，或本機 CLI 的 `wenlan pages`、`wenlan capture`、`wenlan lint`、`wenlan curate revisions`。",
        ],
        code: {
          label: "Wenlan Codex plugin：檢查、保存、整理與審查",
          code: "/pages <共享主題>\n/capture <候選主張 + 來源 + 為何重要>\n/distill <共享主題>\n/lint\n/curate",
        },
      },
      {
        heading: "Wenlan 能做什麼，以及不能做什麼",
        body: [
          "Wenlan 把 Sources、原子 Memories 與維護型 Pages 分開。明確取代會保留 supersedes 鏈；stale Page 可依目前證據重建；機器要改寫人工擁有的內容時，會先成為可審查修訂。可選的 Reconcile 流程能把受保護衝突排入審查，但預設關閉。",
          "Wenlan 不是 Agent 排程器、分散式鎖服務或自動共識引擎。目前公開的 MCP `write_page` 不接受 `expected_version`，所以這個流程必須在寫入前自行重讀並比較來源與版本，不能宣稱 Wenlan 會原子化拒絕過期的機器 Page 更新。人工擁有的 Page 更新會進入可審查修訂；本機 Page refresh 只支援本機 stdio MCP，語意衝突仍要靠來源與判斷處理。",
        ],
      },
      {
        heading: "用兩個 Agent 做最小驗收",
        body: [
          "準備一份來源與兩個互相矛盾的候選結論。讓第一個 Agent 保存有來源的主張，再修改來源或 Page；第二個 Agent 使用舊版本時，寫入前檢查應發現版本已變並停止，或把人工擁有的 Page 更新送進審查，而不是靜默蓋掉新內容。",
          "最後從另一個 Agent 重新查詢，確認它看到已接受狀態、目前來源與未解衝突，並能追查被取代的結論及原因。即使不用 Wenlan，這組驗收也適用於其他共享知識系統。",
        ],
      },
    ],
    faqs: [
      {
        question: "所有 Agent 都應該直接寫入同一個 Page 嗎？",
        answer:
          "不應該。Agent 可以保存原子證據與候選主張，但已接受的 Page 應有明確範圍與審查路徑，避免任何 Agent 靜默覆寫結論。",
      },
      {
        question: "可選的 Reconcile 會自動解決所有矛盾嗎？",
        answer:
          "不會。它能把受保護衝突排入審查並保留取代關係，但預設關閉，也無法替你判斷原始來源是否正確。",
      },
      {
        question: "只用 Git 就能避免共享知識衝突嗎？",
        answer:
          "Git 能保留檔案歷史與顯示文字衝突，但不會自動發現跨檔案的語意矛盾或過期證據；仍需來源版本、驗證規則與審查。",
      },
    ],
    relatedSlugs: [
      "source-backed-wiki-pages-ai-work",
      "verify-ai-knowledge-base-citations",
      "build-business-metric-definition-knowledge-base",
      "distilled-wiki-pages-ai-memory",
      "choose-ai-knowledge-base-tool",
    ],
    officialReferences: [
      {
        label: "Wenlan 知識生命週期",
        href: "https://github.com/7xuanlu/wenlan#how-knowledge-stays-current",
      },
      {
        label: "Wenlan 審查與信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "Governed Shared Memory 論文",
        href: "https://arxiv.org/abs/2606.24535",
      },
      {
        label: "iThome 多代理協作衝突報導",
        href: "https://www.ithome.com.tw/news/178146",
      },
      {
        label: "繁體中文多 Agent 證據衝突處理",
        href: "https://github.com/bojieli/ai-agent-book/blob/main/book-zhtw/chapter3.zhtw.md",
      },
      {
        label: "Hindsight 多 Agent 共享記憶討論",
        href: "https://github.com/vectorize-io/hindsight/discussions/1576",
      },
    ],
    cta: {
      heading: "先測一個互相矛盾的結論",
      body: "讓兩個 Agent 連接 Wenlan，保存一條有來源的衝突主張，確認審查與歷史在重用前都看得見。",
    },
  },
  "distilled-wiki-pages-ai-memory": {
    slug: "distilled-wiki-pages-ai-memory",
    eyebrow: "概念",
    category: "Concepts",
    title: "Karpathy LLM Wiki：如何搭建有來源的 AI 知識庫",
    description:
      "Karpathy LLM Wiki 模式把可信來源、原子知識與維護頁面分開，建立讓 AI 代理按需讀取的知識庫。",
    metaTitle: "Karpathy LLM Wiki 與 AI 知識庫 | Wenlan",
    metaDescription:
      "了解 Karpathy LLM Wiki 的架構、它和 RAG 的差異，以及來源頁面、Obsidian、驗證與持續更新如何配合。",
    keywords: [
      "LLM Wiki 知識庫",
      "Karpathy LLM Wiki",
      "Andrej Karpathy LLM Wiki",
      "AI 知識庫",
      "本地 AI 知識庫",
      "RAG vs LLM Wiki",
      "LLM Wiki 搭建",
      "AI 維護知識庫",
      "有來源的知識庫",
      "Claude Code 知識庫",
      "Obsidian AI 知識庫",
      "Wenlan 文瀾",
    ],
    publishedAt: "2026-07-04",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "9 分鐘閱讀",
    audience: "正在搭建可由 AI 代理讀取、更新並檢查來源的本地知識庫的繁體中文使用者",
    heroBullets: [
      "Karpathy LLM Wiki 模式維護可重用的目前答案，不把聊天紀錄、檢索片段或筆記直接當成成品知識。",
      "可靠架構會分開原始來源、原子事實、維護頁面與按需檢索。",
      "頁面需要保留 source IDs、過期原因和可檢查的修訂，而不是靜默覆蓋。",
    ],
    sections: [
      {
        heading: "Karpathy LLM Wiki 是什麼",
        body: [
          "Andrej Karpathy 用 LLM Wiki 描述一種把原始知識整理成精選、互相連結頁面的模式，讓 AI 代理只在需要時載入相關內容。本文把他的公開說明當作可維護來源，不代表 Karpathy 為 Wenlan 背書。",
          "實作上，LLM Wiki 是供 AI 代理使用、也讓人能檢查的維護型 AI 知識庫。它把文件、對話和檔案等來源整理成主題頁面，不必反覆重播整個資料庫或聊天紀錄。",
          "它不只是讓 LLM 自動寫出一批 Markdown 筆記。真正有用的系統會把原始證據、可重用事實與目前解釋分開，保留來源和更新狀態；即使讀者不安裝 Wenlan，這套判斷標準也能用來評估自己的知識庫。",
        ],
        link: {
          label: "先試完整範例，不必安裝",
          href: "#worked-example",
        },
      },
      {
        heading: "可靠 AI 知識庫的四層架構",
        body: [
          "最小可維護架構包含四層：Raw Sources 保存可檢查的原始材料；Atomic Knowledge 保存一次決策、修正或經驗；Wiki Pages 彙整目前答案；Schema 與 Index 負責按主題定位所需內容。",
          "常見流程可以概括為 Ingest、Query、Lint：Ingest 註冊來源而不急著改寫結論；Query 只取目前問題所需的頁面和證據；Lint 檢查缺少來源、重複、矛盾、過期依賴與不可維護的頁面。",
        ],
        bullets: [
          "Raw Sources：保存文件、網頁、檔案和對話等原始材料。",
          "Atomic Knowledge：保留一個完整事實、決策、經驗或修正及其來源。",
          "Wiki Pages：把相關證據編成一個可讀、可維護的目前答案。",
          "Schema 與 Index：記錄主題、依賴和狀態，並只載入相關內容。",
        ],
      },
      {
        heading: "LLM Wiki 知識庫和 RAG 有什麼不同",
        body: [
          "RAG 通常在提問時檢索原始片段；LLM Wiki 則維護可重複使用的答案、支援它的來源，以及需要刷新的狀態。知識庫可以在底層使用 RAG，但只有檢索還不會自動維護結論。",
          "Obsidian 是由人掌控的資料庫和寫作介面，可以承載或查看 Markdown wiki 頁面；但把 vault 開放給代理讀取，不等於已經處理選擇性檢索、來源、過期狀態和自動修改邊界。兩者可以配合，不必互相取代。",
        ],
        bullets: [
          "RAG：為這次問題尋找相關來源片段。",
          "LLM Wiki：維護日後還能重用的答案、引用和刷新狀態。",
          "Obsidian：保留人可讀、可編輯的 Markdown 知識面。",
          "Agent memory：保存工作中可重用的事實和決策，作為頁面原料之一。",
        ],
      },
      ...workedExampleSections("zh-TW"),
      {
        heading: "一份最小可用的 LLM Wiki Schema",
        body: [
          "讓固定載入的合約保持精簡。CLAUDE.md 或 AGENTS.md 只需說明知識庫的用途、不可靜默改變的邊界，以及需要時才按需載入的操作流程；不要把整個 wiki 或所有維護指令都塞進每次 context。",
          "這是工具無關的資訊與維護合約，不強迫特定資料夾或產品儲存格式；可以調整名稱，但每個邊界都應該能被檢查。",
        ],
        bullets: [
          "用途與範圍：哪些重複問題或決策屬於這個 wiki，哪些不屬於。",
          "不可變來源邊界：原始證據放在哪裡，以及自動化絕不能改寫哪些檔案。",
          "頁面所有權：哪些頁面由機器維護、人擁有，或只能透過審查修改。",
          "命名與連結規則：穩定主題、別名、頁面連結和最小 routing index。",
          "引用要求：重要說法必須能回到可檢查來源。",
          "Ingest、Query、Lint 與維護紀錄：分開按需載入的流程，加上 append-only 變更紀錄。",
          "過期與審查行為：來源改變、證據衝突或人擁有文字時要怎麼處理。",
        ],
        code: {
          label: "精簡 client 合約",
          code: [
            "# LLM Wiki",
            "用途：<這個 wiki 維護的重複決策>",
            "來源：<不可變來源邊界>",
            "頁面：<所有權、命名、連結、引用>",
            "索引：<最小主題路由；頁面按需載入>",
            "流程：ingest | query | lint | review",
            "紀錄：<append-only 維護紀錄>",
            "過期規則：<來源改變 -> stale 或 review>",
          ].join("\n"),
        },
      },
      {
        heading: "正式使用前的最小驗收測試",
        body: [
          "檔案存在不代表 template 已經可用。先用一個無風險主題做端到端測試，而且必須包含一次來源變更，再匯入私人或重要資料。",
          "這套驗收可用於資料夾加 prompt、Obsidian 工作流或專門的 LLM Wiki 工具；預期結果是人能檢查的證據，不只是一段流暢回答。",
        ],
        bullets: [
          "匯入一份無風險來源，確認原始內容沒有被改寫。",
          "回答一個問題，並替重要說法引用來源。",
          "執行 lint，確認缺少引用、斷鏈或重複能被看見。",
          "修改來源，再問一次相同問題。",
          "確認舊答案進入 stale 或 review，而不是被靜默覆蓋。",
        ],
      },
      {
        heading: "如何搭建會持續更新的 AI 知識庫",
        body: [
          "先選一個低風險的小主題，不要一開始就匯入整個 vault。註冊可檢查的來源，捕捉一條完整事實，再把相關內容蒸餾成主題頁面；接著用同一問題重新檢索，並從頁面回到 source IDs 檢查證據。",
          "發布第一版不是結束。來源改變時，系統應該標記受影響頁面、記錄 stale reason，並產生可審查的修訂；對於由人掌控的文字，自動化不應靜默覆蓋。",
        ],
        code: {
          label: "Wenlan 工作流：需先安裝並連接客戶端",
          code: `/brief <主題>
/recall <問題>
/capture <結論 + 原因>
/handoff
/distill <主題>
/pages <主題>`,
        },
        link: {
          label: "查看完整日常工作流",
          href: "/docs/daily-workflow",
        },
      },
      {
        heading: "如何驗證知識庫真的可用",
        body: [
          "不要只看命令是否回傳成功。真正的驗收是：下一次會話能找回正確內容，人能在聊天之外閱讀頁面，而且重要說法可以追溯到來源。",
          "如果檢查失敗，先維持測試內容的低風險範圍，修復連線、來源或重複問題，再用同一主題重測；不要靠繼續生成更多頁面掩蓋故障。",
        ],
        bullets: [
          "相同主題可以再次找到剛才保存的事實。",
          "頁面是可讀 Markdown，並顯示重要說法對應的 source IDs。",
          "後續檢索只載入相關頁面或來源片段，而不是整個資料庫。",
          "來源變化會產生可檢查的過期原因或修訂，不會靜默覆蓋。",
          "Lint 能揭露缺少來源、重複、矛盾或過期依賴。",
        ],
        link: {
          label: "查看審查與修復流程",
          href: "/docs/review-and-trust",
        },
      },
      {
        heading: "Wenlan 如何實作本地 LLM Wiki",
        body: [
          "Wenlan 把 Sources、Memories 和 Pages 分成三種耐久角色：Sources 保存原始材料，Memories 保存工作中產生的原子事實，Pages 編成有來源的目前解釋。本地 daemon 負責檢索，Markdown 頁面和 git 歷史讓結果保持可見。",
          "每個蒸餾頁面都要保留 source IDs。頁面可以隨著新證據過期、刷新或進入審查；記憶在這裡保存支撐頁面的知識與狀態，方便回查與更新。",
          "Wenlan 不要求使用者自訂 Page schema。typed Memory fields 與內建 Page 規則已管理來源、引用、刷新、所有權和審查；上面的 starter schema 是可攜的 client 與流程驗收合約。",
        ],
        link: {
          label: "檢查有來源頁面模型",
          href: "/learn/source-backed-wiki-pages-ai-work",
        },
      },
      {
        heading: "什麼時候不需要 LLM Wiki",
        body: [
          "一次性聊天、很小且長期穩定的文件集，或團隊已經維護良好的普通 wiki，不一定需要額外系統。目前程式碼、測試結果和工具官方文件也永遠比知識庫裡的舊解釋更權威。",
          "當多個 AI 工具需要共享同一套檢索、來源、交接和審查規則，而且答案會隨專案持續變化時，維護型 LLM Wiki 才開始產生獨立價值。",
        ],
        link: {
          label: "查看 Wenlan 的層級邊界",
          href: "/docs/architecture",
        },
      },
    ],
    faqs: [
      {
        question: "Karpathy LLM Wiki 的核心想法是什麼？",
        answer:
          "Andrej Karpathy 描述的是一組經過整理、彼此連結，並能由代理按需讀取的個人 wiki 頁面。重點是維護有用頁面及其結構，而不是每次載入沒有區分的完整資料庫；引用他的說明不代表他為 Wenlan 背書。",
      },
      {
        question: "LLM Wiki 和 RAG 是同一種東西嗎？",
        answer:
          "不是。RAG 在提問時檢索來源片段；LLM Wiki 維護可重用的答案、引用和刷新狀態。LLM Wiki 可以使用 RAG，但檢索本身不會維護答案。",
      },
      {
        question: "Obsidian 可以直接當 AI 知識庫嗎？",
        answer:
          "Obsidian 很適合當作由人掌控的 Markdown vault 和閱讀介面。要讓它成為代理可依賴的知識庫，還需要選擇性檢索、來源、過期處理和安全的自動修改邊界。",
      },
      {
        question: "本地 AI 知識庫一定要匯入所有筆記嗎？",
        answer:
          "不用。先從一個會重複使用的小主題開始，只註冊必要來源並檢索最小相關集合。整庫注入會增加 token 成本、雜訊和過期內容風險。",
      },
      {
        question: "Wenlan 的蒸餾頁面只是摘要嗎？",
        answer:
          "不是。摘要通常壓縮單一來源；蒸餾頁面會組合相關事實與來源，保留 source IDs、修訂狀態和過期原因，並能隨著新證據更新。",
      },
    ],
    officialReferences: [
      {
        label: "Wenlan 的 Source、Memory 與 Page 模型",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan 日常工作流",
        href: "https://github.com/7xuanlu/wenlan#daily-workflow",
      },
      {
        label: "Karpathy 的 LLM Wiki 說明",
        href: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f",
      },
      {
        label: "jackwener LLM Wiki 實作",
        href: "https://github.com/jackwener/llm-wiki",
      },
      {
        label: "LLM Wiki CLAUDE.md template",
        href: "https://hjarni.com/blog/llm-wiki-claude-md-template",
      },
      {
        label: "LLM Wiki v2 提案",
        href: "https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2",
      },
    ],
    relatedSlugs: [
      "prevent-multi-agent-knowledge-conflicts",
      "coding-agent-source-backed-knowledge-base",
      "wenlan-vs-obsidian-ai-memory",
      "source-backed-wiki-pages-ai-work",
      "verify-ai-knowledge-base-citations",
      "ai-memory-provenance",
      "local-git-history-ai-memory",
    ],
    cta: {
      heading: "搭建可維護的本地 LLM Wiki",
      body: "用 Wenlan 把來源與工作事實蒸餾成可檢查、可刷新，並讓下一個 AI 會話按需讀取的知識頁面。",
    },
  },
  "source-backed-wiki-pages-ai-work": {
    slug: "source-backed-wiki-pages-ai-work",
    eyebrow: "信任",
    category: "Concepts",
    title: "有來源的 AI 知識庫：來源、更新與審查方法",
    description:
      "用 Wenlan 將來源、原子知識與可維護頁面分開，建立能追溯、能刷新、能審查的本地 AI 知識庫。",
    metaTitle: "有來源的 AI 知識庫：來源、更新與審查 | Wenlan",
    metaDescription:
      "建立有來源的 AI 知識庫：分開可信來源、原子知識與 LLM Wiki 頁面，並用 Wenlan 保留引用、更新與審查狀態。",
    keywords: [
      "AI 知識庫",
      "有來源的 AI 知識庫",
      "本地 AI 知識庫",
      "LLM Wiki",
      "知識庫維護",
      "Wenlan 文瀾",
    ],
    publishedAt: "2026-07-04",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "7 分鐘閱讀",
    audience: "想讓 AI agent 使用本地知識，但仍能檢查來源、更新與審查狀態的繁體中文使用者",
    heroBullets: [
      "可信來源不和模型產生的結論混在一起。",
      "原子知識保留細粒度證據，再組成可重用頁面。",
      "頁面保存引用、修訂、過期原因與審查狀態。",
    ],
    sections: [
      {
        heading: "一句話答案",
        body: [
          "有來源的 AI 知識庫會把可信來源、原子知識與維護型 LLM Wiki 頁面分開。Agent 取得的是可重用答案，人仍能沿著引用回到來源、檢查修訂，並在證據變化時刷新頁面。",
          "Wenlan 在本機連接這三層，讓知識不只是搜尋片段或脫離來源的摘要。",
        ],
        link: {
          label: "查看 LLM Wiki 的完整生命週期",
          href: "/learn/distilled-wiki-pages-ai-memory",
        },
      },
      {
        heading: "AI 知識庫為什麼必須保留來源",
        body: [
          "直接丟入大量文件會讓 agent 每次都重新搜尋；只留下摘要，又會失去支持結論的證據。來源一旦更新，沒有人知道哪些答案也必須重算。",
          "可維護的知識庫必須回答三件事：這個結論來自哪裡、現在是否仍有效、發生衝突時誰來審查。",
        ],
      },
      {
        heading: "三層最小架構：Sources、Atomic Knowledge、Pages",
        body: [
          "Sources 是可檢查的原始資料；Atomic Knowledge 是帶著來源與理由的單一事實；Pages 則把重複、高價值的知識整理成 agent 可以按需讀取的答案。",
          "不要跳過中間層。原子知識讓頁面保持可追溯，也讓新證據只修正受影響的事實，而不是重寫整個知識庫。",
        ],
      },
      {
        heading: "Wenlan 的實際工作流程",
        body: [
          "先用一個會重複查詢的主題驗證閉環，不要一開始就匯入整個筆記庫。記錄一個帶來源與理由的事實，累積到值得重用時再蒸餾成頁面。",
        ],
        bullets: [
          "用 /capture 保存單一事實、來源與它為何重要。",
          "用 /distill 把重複主題整理成維護型頁面。",
          "用 /pages 開啟頁面並核對支持它的來源。",
          "用 /lint 找出薄弱、衝突或過期的知識。",
          "用 /curate 審查修訂，再決定是否刷新頁面。",
        ],
        code: {
          label: "Wenlan 知識庫維護迴圈",
          code: "/brief <主題>\n/capture <事實 + 來源 + 為何重要>\n/distill <主題>\n/pages <主題>\n/lint\n/curate",
        },
      },
      {
        heading: "如何處理過期與衝突",
        body: [
          "來源或工作條件改變時，不要讓新舊答案並排。把舊結論標成過期、記錄替代關係，再依最新證據刷新頁面。",
          "對高影響結論保留人工審查。自動蒸餾能加快整理，但不應把沒有支持來源的文字升級成可信知識。",
        ],
      },
      {
        heading: "如何驗收 AI 知識庫",
        body: [
          "先用一個主題做小型驗收。Agent 應該能找到目前答案，人應該能回到來源，證據變更後則能看見過期狀態並完成刷新。",
        ],
        bullets: [
          "頁面中的重要結論能追到來源 ID 或維護中的文件。",
          "重新開啟 AI client 後，仍能按需取得相同主題。",
          "加入衝突證據時，lint 或 review 流程能把問題暴露出來。",
          "刷新後保留修訂紀錄，而不是靜默覆寫舊答案。",
        ],
      },
      {
        heading: "Wenlan 如何對應這套架構",
        body: [
          "Wenlan 的 Sources、Memories 與 Pages 對應來源、原子知識與維護型頁面。頁面記錄保留 source IDs、版本、changelog、stale reason 與來源數量。",
          "這套設計讓 Claude Code、Codex、Cursor 等 MCP client 共用同一個本地知識層，同時保留人可以檢查與修正的路徑。",
        ],
        link: {
          label: "閱讀 Wenlan 的審查與信任指南",
          href: "/docs/review-and-trust",
        },
      },
    ],
    faqs: [
      {
        question: "AI 知識庫和 RAG 是同一件事嗎？",
        answer:
          "不是。RAG 在提問時找來源片段；維護型知識庫還保存可重用答案、引用、審查與刷新狀態，也可以在底層使用檢索。",
      },
      {
        question: "開始前要匯入全部筆記嗎？",
        answer:
          "不用。先挑一個高價值、會重複查詢的主題，驗證來源、capture、distill、pages、lint 與 curate 的完整閉環。",
      },
      {
        question: "Wenlan Pages 可以給人閱讀嗎？",
        answer:
          "可以。頁面會成為可讀的 Markdown，同時在 page record 中保留支持它的來源與修訂狀態。",
      },
    ],
    relatedSlugs: [
      "prevent-multi-agent-knowledge-conflicts",
      "coding-agent-source-backed-knowledge-base",
      "wenlan-vs-obsidian-ai-memory",
      "distilled-wiki-pages-ai-memory",
      "when-ai-agent-should-query-knowledge-base",
      "verify-ai-knowledge-base-citations",
      "build-business-metric-definition-knowledge-base",
      "source-backed-research-knowledge-base",
      "build-client-project-knowledge-base-for-consulting",
      "build-investment-research-knowledge-base",
      "build-product-research-knowledge-base-for-prd",
      "build-sre-incident-knowledge-base",
      "review-before-trust-ai-memory",
      "ai-memory-provenance",
      "test-ai-knowledge-base-retrieval-after-changes",
    ],
    officialReferences: [
      {
        label: "Wenlan 的知識模型",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan 日常工作流程",
        href: "https://github.com/7xuanlu/wenlan#daily-workflow",
      },
      {
        label: "Wenlan 審查與信任指南",
        href: "https://wenlan.app/docs/review-and-trust",
      },
    ],
    cta: {
      heading: "先建立一個可驗證的 AI 知識庫主題",
      body: "用 Wenlan 把來源、原子知識與維護型頁面連成小型閉環，再逐步擴大到其他 AI 工具與專案。",
    },
  },
  "wenlan-vs-obsidian-ai-memory": {
    slug: "wenlan-vs-obsidian-ai-memory",
    eyebrow: "比較",
    category: "Comparisons",
    title: "Obsidian + Claude Code：檔案、MCP 與可維護的 AI 知識庫",
    description:
      "比較直接讀取 Obsidian vault、即時編輯器 context、MCP 與有來源的知識維護，選出 Claude Code 真正需要的最小整合層。",
    metaTitle: "Obsidian + Claude Code：MCP 與 AI 知識庫 | Wenlan",
    metaDescription:
      "了解 Claude Code 何時直接讀 Obsidian vault 就夠、IDE 與 MCP bridge 增加什麼，以及 AI 知識庫何時需要來源、更新與審查流程。",
    keywords: [
      "Obsidian Claude Code",
      "Claude Code Obsidian",
      "Obsidian MCP",
      "Obsidian Claude Code MCP",
      "Obsidian AI 知識庫",
      "Claude Code 知識庫",
      "AI 知識庫",
      "Wenlan 文瀾",
    ],
    publishedAt: "2026-07-22",
    updatedAt: "2026-08-01",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "使用 Obsidian vault 的繁體中文 Claude Code 使用者",
    heroBullets: [
      "Claude Code 能存取本地 Markdown 時，直接讀取 vault 通常是最小且最清楚的起點。",
      "IDE bridge 補上目前檔案與選取內容；Obsidian MCP 補上結構化 vault 操作或其他 client surface。",
      "能連上 vault 不等於會維護知識；來源、過期、修訂與審查仍是另一個決策。",
    ],
    sections: [
      {
        heading: "先給答案：從最小整合層開始",
        body: [
          "如果 Claude Code 已能存取你的 Markdown 資料夾，先讓它直接讀取需要的 vault 路徑。當缺少的是目前檔案與選取內容，再加 IDE bridge；當需要 Obsidian 指令、結構化 vault 操作或另一個支援的 client，再考慮 MCP。",
          "這些連線都能改善存取，但不會自動建立可維護的 AI 知識庫。當答案要跨 session 與工具重用，還需要來源、provenance、刷新規則、衝突處理與人工審查。",
        ],
        link: {
          label: "比較 LLM Wiki 的架構與流程",
          href: "/learn/distilled-wiki-pages-ai-memory",
        },
      },
      {
        heading: "四種 Obsidian + Claude Code 整合層",
        body: [
          "把直接檔案、編輯器 context、MCP 與內嵌 assistant 分開看，才能避免為同一件事安裝四套工具。選擇標準應該是目前缺少的能力，而不是哪個工具名稱最熱門。",
        ],
        bullets: [
          "直接檔案：Claude Code 讀寫它有權限存取的 Markdown；最適合一般搜尋、整理與修改。",
          "IDE bridge：把 Obsidian 目前檔案與選取內容傳給 Claude Code，檔案操作仍可保持直接。",
          "Obsidian MCP：提供結構化 vault tools、workspace context、Obsidian 指令或其他支援的 client。",
          "內嵌 assistant：只有當你想在 Obsidian UI 裡直接對話與操作時才需要。",
        ],
      },
      {
        heading: "連得上 vault，不等於有可維護的 AI 知識庫",
        body: [
          "Vault access 解決的是 agent 如何看到或修改筆記；知識 lifecycle 解決的是哪個答案目前有效、它來自哪裡、來源改變時要刷新哪一頁，以及衝突是否需要人審。兩者可以組合，但不能互相冒充。",
          "Obsidian 應繼續是人擁有的寫作與 Markdown 知識面。只有會影響未來 AI 工作的結論，才需要進入可追溯、可刷新、能跨 session 重用的知識層。",
        ],
        link: {
          label: "查看 Obsidian 的資料儲存方式",
          href: "https://obsidian.md/help/data-storage",
        },
      },
      {
        heading: "用 Wenlan 把 vault 當來源，而不是複製品",
        body: [
          "Wenlan 可以把 Obsidian vault 註冊為 read-only Source，按需重新同步 Markdown，再把來源與工作中確認的決策編成有引用、過期狀態與修訂記錄的 Pages。它不需要接管 Obsidian，也不應靜默覆寫人寫的 vault。",
          "當同一份知識還要給 Codex、Cursor、ChatGPT 或其他 MCP client 使用時，Wenlan 提供的是共用的 knowledge lifecycle；Obsidian 仍保留人最容易閱讀與編輯的知識面。",
        ],
        bullets: [
          "原始 Markdown 留在 read-only vault；Wenlan 按需重新掃描、分段並索引目前內容。",
          "Atomic knowledge 保存會影響未來工作的事實、決策與修正。",
          "Pages 把相關證據編成目前答案，並保留引用與刷新狀態。",
          "Lint 與 review 暴露缺少來源、衝突、過期依賴與不安全的改寫。",
        ],
      },
      {
        heading: "一個最小的 Obsidian AI 知識庫流程",
        body: [
          "先選一個無風險的小主題，而不是導入整個 vault。確認 Claude Code 能讀到一篇來源筆記，再捕捉一個會影響未來工作的結論，蒸餾成頁面，最後從頁面回到來源檢查證據。",
          "如果只需要查找與改寫 Markdown，到這裡可以停在 Obsidian。只有當答案需要跨 session、跨 client 保持一致，才增加 Wenlan 的 distill、lint 與 review 流程。",
        ],
        code: {
          label: "最小驗證循環",
          code: [
            "/brief Obsidian AI 知識庫",
            "/capture <結論 + 來源 + 為什麼重要>",
            "/handoff",
            "/distill Obsidian AI 知識庫",
            "/pages Obsidian AI 知識庫",
            "/lint",
          ].join("\n"),
        },
      },
      {
        heading: "如何驗證整合真的可用",
        body: [
          "不要只看 plugin 或 MCP 是否顯示 connected。用一個 disposable note 做端到端驗收：確認誰能讀、誰能寫、目前檔案是否正確傳入、來源是否可追溯，以及失敗時哪個 process 擁有每一次寫入。",
          "同時檢查 vault backup、模型供應商會收到哪些 context、bridge 是否只綁 localhost，以及自動化是否會改寫人擁有的筆記。連線能力不是 governance policy。",
        ],
        bullets: [
          "讀取一篇指定筆記，確認沒有把整個 vault 送進 context。",
          "修改一篇 disposable note，確認權限與寫入者符合預期。",
          "加入衝突來源，確認 lint 或 review 能把問題暴露出來。",
          "重新開啟 client，確認目前答案能被找到並回到原始來源。",
        ],
      },
    ],
    comparisonTable: {
      competitorName: "Obsidian + Claude Code 整合",
      rows: [
        {
          dimension: "直接 vault 存取",
          wenlan: "把 Obsidian vault 當 read-only Source，按需重新同步 Markdown。",
          competitor: "Claude Code 可直接讀寫有權限存取的 Markdown 檔案。",
        },
        {
          dimension: "編輯器 context",
          wenlan: "不嘗試成為 Obsidian editor bridge。",
          competitor: "IDE bridge 可分享目前檔案與選取內容，檔案修改仍可直接完成。",
        },
        {
          dimension: "結構化工具",
          wenlan:
            "Wenlan runtime 管理 Sources；MCP 提供 capture、recall、distill、Page 與 review 工具，plugin 再補上 /handoff 等工作流程。",
          competitor: "Obsidian MCP 可提供 vault 檔案、workspace context 與 Obsidian 操作。",
        },
        {
          dimension: "知識 lifecycle",
          wenlan: "Sources 與確認過的決策編成有引用、過期、修訂與審查的 Pages。",
          competitor: "Vault 是耐久 Markdown；來源、刷新與審查語意取決於所選專案與流程。",
        },
        {
          dimension: "最適合",
          wenlan: "需要跨 session 與多個 AI client 保持目前、可追溯的知識。",
          competitor: "讓 Claude Code 使用 vault 檔案、Obsidian 目前 context 或特定指令。",
        },
      ],
    },
    faqs: [
      {
        question: "使用 Claude Code 搭配 Obsidian 一定需要 MCP 嗎？",
        answer:
          "不一定。一般 Markdown 讀寫先用直接檔案存取即可；需要目前檔案與選取內容時用 IDE bridge，需要結構化 Obsidian 操作或其他 client 時再加 MCP。",
      },
      {
        question: "連上 Claude Code 後，Obsidian 就是耐久 AI 知識庫嗎？",
        answer:
          "不是。連線只提供檔案或工具存取；耐久知識還需要清楚的來源邊界、provenance、刷新、衝突處理、審查，以及跨 session 保存目前結論的方法。",
      },
      {
        question: "Wenlan 會覆寫我的 Obsidian vault 嗎？",
        answer:
          "Wenlan 可以把 vault 註冊為 read-only Source 並重新同步 Markdown。人寫的 vault 繼續是來源；Wenlan 把有來源的 Pages 與其他 artifacts 投影在自己的本地空間，不應靜默覆寫 vault。",
      },
    ],
    relatedSlugs: [
      "distilled-wiki-pages-ai-memory",
      "source-backed-wiki-pages-ai-work",
      "ai-work-memory-vs-knowledge-base",
    ],
    officialReferences: [
      {
        label: "Obsidian 的資料儲存說明",
        href: "https://obsidian.md/help/data-storage",
      },
      {
        label: "Obsidian plugins 說明",
        href: "https://obsidian.md/help/plugins",
      },
      {
        label: "obsidian-claude-code 內嵌 assistant",
        href: "https://github.com/Roasbeef/obsidian-claude-code",
      },
      {
        label: "Obsidian 的 Claude Code IDE bridge",
        href: "https://github.com/petersolopov/obsidian-claude-ide",
      },
      {
        label: "Obsidian Claude Code MCP repository",
        href: "https://github.com/iansinnott/obsidian-claude-code-mcp",
      },
      {
        label: "Wenlan 維護型知識模型",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan 日常工作流程",
        href: "https://wenlan.app/docs/daily-workflow",
      },
      {
        label: "Wenlan 資料與隱私",
        href: "https://wenlan.app/docs/data-and-privacy",
      },
    ],
    cta: {
      heading: "讓 vault 與 AI 知識庫各司其職",
      body: "保留 Obsidian 作為人類可讀的知識面；答案需跨工具保持目前、可追溯且可審查時，再用 Wenlan 維護具引用的 Pages。",
    },
  },
  "coding-agent-source-backed-knowledge-base": {
    slug: "coding-agent-source-backed-knowledge-base",
    eyebrow: "Coding agent 知識",
    category: "Workflows",
    title: "如何讓 Codex 使用有來源的專案知識庫",
    description:
      "把 AGENTS.md、原始程式與文件、維護型知識頁分工，讓 Codex 按需取得有來源、可審查的專案知識。",
    metaTitle: "Codex 有來源專案知識庫工作流 | Wenlan",
    metaDescription:
      "用 AGENTS.md、專案文件、引用、按需檢索與驗證，為 Codex、Claude Code 或其他 coding agent 建立有來源的專案知識庫。",
    keywords: [
      "Codex 知識庫",
      "Codex 專案知識",
      "coding agent 知識庫",
      "AI agent 專案知識庫",
      "AGENTS.md 知識庫",
      "Claude Code 知識庫",
      "有來源的專案知識庫",
    ],
    publishedAt: "2026-08-23",
    updatedAt: "2026-09-04",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "希望 Codex、Claude Code 或其他 coding agent 能重用可信專案知識的開發者",
    heroBullets: [
      "AGENTS.md 或 CLAUDE.md 只放每次都必須載入的短規則。",
      "程式、測試、規格與第一方文件繼續作為單一事實來源。",
      "維護型知識頁只保存需要跨檔整理、附來源並反覆重用的結論。",
    ],
    sections: [
      {
        heading: "一句話做法",
        body: [
          "把 coding agent 的專案知識分成三層：AGENTS.md 或 CLAUDE.md 放短而穩定的操作規則；程式、測試、規格與文件保留為單一事實來源；有來源的知識庫保存需要跨檔整理、引用與審查的目前答案。",
          "Agent 接到任務時先讀最小規則，再按問題取用一個相關 Page，最後回到引用、程式與測試驗證。這比把全部內容塞進 instruction file，或每次重掃整個 repo 更容易保持目前與可檢查。",
        ],
      },
      {
        heading: "AGENTS.md、CLAUDE.md 與知識庫各做什麼",
        body: [
          "AGENTS.md 適合放 build、test、branch、權限與禁區等 agent 無法只靠讀 code 推出的規則；Claude Code 使用者可用 CLAUDE.md 表達同一類專案指引。檔案越長，越容易擠掉目前任務真正需要的 context。",
          "知識庫不應複製 repo。架構理由、外部限制、跨檔結論、決策歷史與已驗證的操作手冊，才是適合維護成有引用 Page 的內容。程式與測試一旦改變，Page 應進入 stale 或 review，而不是繼續假裝正確。",
        ],
        bullets: [
          "每次載入：非顯而易見的專案規則與安全邊界。",
          "單一事實來源：目前程式、測試、規格與第一方文件。",
          "按需知識：有來源、可審查、需要跨會話重用的結論。",
        ],
      },
      {
        heading: "建立 coding agent 可用的有來源工作流",
        body: [
          "先選一個會重複詢問的小主題，例如 release 流程或資料遷移邊界。完成 Wenlan 與 Codex 連線後，只加入能回答該主題的 Markdown、文字或可擷取文字 PDF；不要一開始匯入整個 repository。",
          "把來源蒸餾成 Page 後，檢查重要說法能回到來源，再跑 lint 與 review。只有 MCP 連線的 client 應使用該 client 顯示的 Wenlan tools；下列 slash commands 適用於已安裝 Wenlan plugin 的 client。",
        ],
        code: {
          label: "一個有界的 Codex 專案知識流程",
          code: "wenlan status\nwenlan connect codex\nwenlan sources add ~/project/docs\n/distill <專案主題>\n/pages <專案主題>\n/lint\n/curate",
        },
      },
      {
        heading: "每次任務只取用足夠的 context",
        body: [
          "不要在每次 session 開始時重播全部文件。先用任務名稱、錯誤症狀或模組查詢最相關的 Page，再沿引用打開真正需要的來源。若答案直接存在目前 code 或 test，就讓 agent 讀原檔，不要多繞一層摘要。",
          "任務結束時只保存能影響未來工作的決策、限制、修正或交接。聊天摘要、暫時探索與 agent 自己可以從 repo 推出的內容，不應自動升格為專案知識。",
        ],
      },
      {
        heading: "如何驗證引用與不支援的答案",
        body: [
          "準備一個來源中有答案的問題、一個必須跨兩份文件才能回答的問題，以及一個來源沒有答案的問題。前兩者不只要顯示來源 ID，還要確認引用段落真的支持每個說法；最後一個應保持未知，不應因為文字流暢就補成確定結論。",
          "更新該 Page 已引用的一份來源，再確認 Page 明確進入 stale、refresh 或 review。另存一筆帶 supersedes 的新紀錄可以保留歷史，但不能假設它會自動讓仍連到舊來源的 Page 過期；重建後仍要人工審查。",
        ],
      },
      {
        heading: "什麼時候不需要另一套知識庫",
        body: [
          "如果資訊已在一份短而目前的 README、規格或測試裡，coding agent 直接讀來源通常更準。只有當同一問題跨多個來源、反覆出現，且重建答案的成本明顯時，才值得維護額外的 source-backed Page。",
          "這條邊界即使不使用 Wenlan 也成立：先維持權威來源，再決定哪些結論值得做成可查詢、可引用、可刷新的專案知識。",
        ],
      },
    ],
    faqs: [
      {
        question: "AGENTS.md 應該放完整專案知識嗎？",
        answer:
          "不應該。它只需放 agent 每次都要知道、又無法從 repo 自己推出的規則。較長的架構說明、決策與外部限制應留在權威文件或按需知識頁。",
      },
      {
        question: "知識庫可以取代程式與測試嗎？",
        answer:
          "不可以。程式、測試、規格與核准的第一方文件仍是權威；來源 ID 只是指標，不代表頁面說法已被來源證明。更新被引用的來源後，應確認知識頁真的進入 stale，再重建與審查。",
      },
      {
        question: "Claude Code 也能用同一套方法嗎？",
        answer:
          "可以。工具的指令入口不同，但短規則、權威來源、按需 Page、引用與驗證的分層相同；Wenlan 也能讓多個已連接 client 使用同一套本地知識。",
      },
    ],
    relatedSlugs: [
      "source-backed-wiki-pages-ai-work",
      "build-local-ai-knowledge-base-from-documents",
      "choose-ai-knowledge-base-tool",
      "when-ai-agent-should-query-knowledge-base",
      "distilled-wiki-pages-ai-memory",
    ],
    officialReferences: [
      {
        label: "OpenAI harness engineering",
        href: "https://openai.com/index/harness-engineering/",
      },
      {
        label: "AGENTS.md 開放格式",
        href: "https://agents.md/",
      },
      {
        label: "Wenlan 與 AI client 設定",
        href: "https://github.com/7xuanlu/wenlan/blob/main/docs/setup-with-ai.md",
      },
      {
        label: "Wenlan 有來源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Wenlan 審查與信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
    ],
    cta: {
      heading: "先讓 Codex 驗證一個專案主題",
      body: "連接 Codex、加入一組可檢查來源，再確認 Page 的引用、刷新與審查都從屬於目前 repo。",
    },
  },
  "build-local-ai-knowledge-base-from-documents": {
    slug: "build-local-ai-knowledge-base-from-documents",
    eyebrow: "實作",
    category: "Workflows",
    title: "如何用 Markdown、PDF 與 Obsidian 建立本地 AI 知識庫",
    description:
      "從一個文件範圍開始，用可重複同步的 Sources、有來源的 Pages 與驗證步驟，建立 AI agent 真正能重用的本地知識庫。",
    metaTitle: "用 Markdown、PDF 與 Obsidian 建立 AI 知識庫 | Wenlan",
    metaDescription:
      "用 Markdown、文字檔、文字型 PDF、資料夾或 Obsidian vault 建立本地 AI 知識庫，並驗證同步、來源與維護型頁面。",
    keywords: [
      "建立 AI 知識庫",
      "本地 AI 知識庫",
      "AI 知識庫搭建",
      "開源 AI 知識庫",
      "Markdown AI 知識庫",
      "PDF AI 知識庫",
      "Obsidian AI 知識庫",
      "AI agent 知識庫",
      "Wenlan 文瀾",
    ],
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-01",
    author: "Qi-Xuan Lu",
    readingTime: "7 分鐘閱讀",
    audience: "想讓 Claude Code、Codex、Cursor 或其他 AI agent 使用本地文件的繁體中文使用者",
    heroBullets: [
      "先選一個檔案或資料夾，不要一次匯入全部資料。",
      "支援 Markdown、文字檔、可擷取文字的 PDF 與 Obsidian vault。",
      "先驗證同步與來源，再信任 AI 整理出的頁面。",
    ],
    sections: [
      {
        heading: "一句話做法",
        body: [
          "先依作業系統安裝 Wenlan runtime、連接目前使用的 AI 客戶端並驗證連線，再對一個 `.md`、`.txt`、可擷取文字的 `.pdf`、資料夾或 Obsidian vault 執行 `wenlan sources add <path>`。同一路徑再次執行會重新同步。",
          "來源能回答真實問題後，在已安裝 Wenlan plugin 的 Claude Code 或 Codex 使用 `/distill <主題>`、`/pages`、`/lint` 與 `/curate`；只有 MCP 連線的客戶端則使用該客戶端顯示的 Wenlan 工具完成同一流程。",
        ],
      },
      {
        heading: "先劃定支援的來源範圍",
        body: [
          "Wenlan 的 Directory Source 會讀取單一檔案或遞迴掃描資料夾，支援 `.md`、`.txt` 與能直接擷取文字的 `.pdf`。Obsidian vault 可作為唯讀 Markdown 來源，人寫的原始檔仍由 vault 管理。",
          "掃描型 PDF 必須先做 OCR；任意程式碼檔案目前不屬於 Directory Source 的支援範圍。程式碼、測試與專案原生文件仍應是權威，知識庫負責維護可檢查的綜合答案。",
        ],
      },
      {
        heading: "建立最小文件到頁面流程",
        body: [
          "先選一個會重複詢問的主題和一小組文件，讓錯誤、跳過與缺少來源都看得見。",
        ],
        bullets: [
          "執行 sources add，確認 found、ingested、skipped 與 errors 數量。",
          "修改來源後重跑同一指令，確認同步結果符合預期。",
          "來源足夠時才 distill，不用把每份文件都變成 Page。",
          "開啟 Page，核對重要結論能回到來源或引用。",
          "執行 lint 與 curate，處理薄弱、衝突、過期或待審查內容。",
        ],
        code: {
          label: "完成平台與客戶端設定後",
          code: "wenlan status\nwenlan sources add ~/Knowledge/project-docs",
        },
      },
      {
        heading: "如何驗收，而不是只看匯入成功",
        body: [
          "用一個來源中存在的問題和一個來源中不存在的問題測試。前者應能找到支持材料，後者不應被補成確定答案。接著修改一份文件、重新同步，確認 Page 能顯示需要刷新或產生可審查修訂。",
          "驗收重點是來源邊界、同步結果、引用與修訂，不是一次匯入多少檔案。這讓知識庫即使不使用 Wenlan，也有可重複的品質判準。",
        ],
      },
      {
        heading: "何時再擴大資料範圍",
        body: [
          "只有當一個主題能完成來源、同步、Page、lint 與 review 閉環後，才加入下一個資料夾或 vault。這能避免同名文件、過期版本與無關內容一起進入檢索結果。",
        ],
        link: {
          label: "了解有來源 AI 知識庫的維護架構",
          href: "/learn/source-backed-wiki-pages-ai-work",
        },
      },
    ],
    faqs: [
      {
        question: "Wenlan 會改寫我的 Obsidian vault 嗎？",
        answer:
          "不會。vault 會作為唯讀來源重新掃描與索引，原始 Markdown 仍由你管理；Pages 匯出或 symlink 是另一個明確選擇。",
      },
      {
        question: "掃描型 PDF 可以直接加入嗎？",
        answer:
          "不行。PDF 必須能直接擷取文字；只有影像的掃描型 PDF 需要先經過 OCR，再把可讀文字納入來源。",
      },
      {
        question: "這和把文件上傳到聊天機器人有什麼不同？",
        answer:
          "聊天附件通常只服務當次對話；這個流程會保留可重複同步的本地來源，並建立能檢查引用、過期狀態與修訂的維護型 Page。",
      },
    ],
    relatedSlugs: [
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
        label: "Wenlan 平台與客戶端設定",
        href: "https://github.com/7xuanlu/wenlan/blob/main/docs/setup-with-ai.md",
      },
      {
        label: "Wenlan 支援的文件來源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "wenlan sources add CLI",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-cli/README.md#wenlan-sources-add-path",
      },
      {
        label: "Wenlan 有來源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
    ],
    cta: {
      heading: "先用一個資料夾驗證完整閉環",
      body: "安裝 Wenlan，加入一組可檢查的文件，再驗證同步、Page、引用與審查流程。",
    },
  },
  "choose-ai-knowledge-base-tool": {
    slug: "choose-ai-knowledge-base-tool",
    eyebrow: "選型指南",
    category: "Workflows",
    title: "如何選 AI 知識庫工具：8 個真正重要的檢查",
    description:
      "先分清文件問答、RAG、筆記工具與維護型知識庫，再用來源、更新、審查、資料控制與實測結果選擇工具。",
    metaTitle: "如何選 AI 知識庫工具：8 個檢查 | Wenlan",
    metaDescription:
      "用 8 個實際測試選擇 AI 知識庫工具，比較文件問答、RAG、本地筆記與跨 AI agent 維護知識的差異。",
    keywords: [
      "AI 知識庫工具",
      "AI 知識庫軟體推薦",
      "如何選 AI 知識庫",
      "本地 AI 知識庫工具",
      "開源 AI 知識庫",
      "AI agent 知識庫",
      "AI 知識庫比較",
      "Wenlan 文瀾",
    ],
    publishedAt: "2026-08-02",
    updatedAt: "2026-09-07",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "正在選擇文件問答、RAG、本地筆記或跨 AI agent 知識系統的繁體中文使用者",
    heroBullets: [
      "先選操作模式，再比較功能清單。",
      "用來源改變與衝突測試答案是否仍可追溯、可更新。",
      "用自己的小型文件集對每個候選工具執行同一套驗收。",
    ],
    sections: [
      {
        heading: "先分清你需要哪一種 AI 知識庫",
        body: [
          "不要先問哪個工具最好。先判斷需要的是當次會話的文件上傳、針對一組文件的 RAG 問答、讓 AI 直接讀取筆記或 Markdown vault，還是跨會話與多個 agent 維護有來源的目前答案。",
          "這四種模式可以組合，但解決的問題不同。把它們放在同一張功能表比較，通常會買到不符合實際工作方式的產品。",
        ],
      },
      {
        heading: "8 個真正重要的檢查",
        body: ["用一小組具代表性的文件，先寫下預期答案，再對每個候選工具做相同測試。"],
        bullets: [
          "來源可追溯：重要答案能否開啟支持它的確切來源或引用？",
          "更新狀態：來源改變後，哪些答案過期、哪些需要刷新是否看得見？",
          "衝突與審查：矛盾證據會進入明確審查，還是被模型靜默改寫？",
          "資料所有權與匯出：能否保留或匯出可讀檔案與歷史，不被單一服務綁住？",
          "隱私邊界：哪些檔案、提示、檢索片段與模型呼叫會離開電腦？",
          "Agent 互通：同一份知識能否供實際使用的 Claude Code、Codex、Cursor 或 ChatGPT 讀取？",
          "輸入限制：真正支援哪些格式、掃描文件、資料夾、vault 與檔案大小？",
          "可重複驗收：工具能否處理可回答、不可回答、跨來源三種問題，並在來源修改後得到正確結果？",
        ],
      },
      {
        heading: "一組能揭露問題的驗收資料",
        body: [
          "不要一開始匯入整個資料庫。準備一份乾淨來源、一份過期版本、一組互相矛盾的說法，以及一個資料中沒有答案的問題。好的工具應該暴露不確定性和衝突，而不是只產生流暢文字。",
          "修改其中一份來源後重跑相同問題。若答案不會顯示過期、引用仍指向舊內容，或無法判斷哪些頁面需要更新，這套系統就還不適合承擔長期知識。",
        ],
      },
      {
        heading: "Wenlan 適合哪一種模式",
        body: [
          "Wenlan 對應維護型、具來源的本地知識層。Sources、原子知識與 Pages 分開保存；Claude Code、Codex、Cursor、ChatGPT 等客戶端透過 plugin 或 MCP 使用同一套知識；引用、過期狀態、修訂與人工審查保持可見。",
          "完成平台與客戶端設定後，可用一個小型來源集驗證，而不是只相信產品描述。",
        ],
        code: {
          label: "Wenlan 驗證流程",
          code: "wenlan status\nwenlan sources add ~/Knowledge/evaluation-set\n/distill <測試主題>\n/pages <測試主題>\n/lint\n/curate",
        },
      },
      {
        heading: "何時不該增加另一套知識庫",
        body: [
          "如果只是讀一份短文件、現有 wiki 已由團隊穩定維護，或 AI 不需要跨會話重用答案，直接文件閱讀或目前的筆記工具可能已經足夠。",
          "選擇的標準不是功能最多，而是以最低維護成本通過你的來源、更新、衝突、隱私與可重複驗收。",
        ],
      },
    ],
    faqs: [
      {
        question: "最好的 AI 知識庫一定是 RAG 工具嗎？",
        answer:
          "不一定。RAG 很適合在提問時找來源片段，但有些需求只要臨時讀文件，另一些則需要跨會話維護可審查、可重用的答案。",
      },
      {
        question: "測試時應該匯入全部資料嗎？",
        answer:
          "不用。先用包含乾淨來源、過期版本、衝突與無答案問題的小型資料集。工具通過後再逐步擴大。",
      },
      {
        question: "開源就代表資料一定不會離開本機嗎？",
        answer:
          "不代表。仍要檢查儲存位置、模型供應商、embedding 與 reranking 呼叫，以及遠端同步或遙測設定。",
      },
    ],
    relatedSlugs: [
      "fix-pdf-ingestion-ai-knowledge-base",
      "coding-agent-source-backed-knowledge-base",
      "build-local-ai-knowledge-base-from-documents",
      "source-backed-wiki-pages-ai-work",
      "distilled-wiki-pages-ai-memory",
      "verify-ai-knowledge-base-citations",
      "test-ai-knowledge-base-retrieval-after-changes",
    ],
    officialReferences: [
      {
        label: "Wenlan 知識模型",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan 支援的文件來源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan MCP 客戶端",
        href: "https://wenlan.app/docs/mcp-clients",
      },
      {
        label: "Wenlan 審查與信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "Wenlan 資料與隱私",
        href: "https://wenlan.app/docs/data-and-privacy",
      },
    ],
    cta: {
      heading: "用同一套 8 項檢查測試 Wenlan",
      body: "從一組小型來源開始，驗證引用、更新與審查，再判斷維護型本地知識層是否適合你的工作流。",
    },
  },
  "fix-pdf-ingestion-ai-knowledge-base": {
    slug: "fix-pdf-ingestion-ai-knowledge-base",
    eyebrow: "匯入排錯",
    category: "Workflows",
    title: "AI 知識庫匯入 PDF 失敗？先判斷掃描檔、文字層與解析錯誤",
    description:
      "從文字層、OCR、檔案大小、解析錯誤與實際引用逐步排查 AI 知識庫的 PDF 匯入問題。",
    metaTitle: "AI 知識庫 PDF 匯入失敗？完整排錯清單",
    metaDescription:
      "排查 AI 知識庫 PDF 匯入失敗：辨識掃描型 PDF、OCR、檔案限制、解析錯誤與空內容，並驗證來源。",
    keywords: [
      "AI 知識庫 PDF 匯入失敗",
      "掃描 PDF AI 知識庫 OCR",
      "PDF 文字擷取失敗",
      "RAG PDF 空內容",
      "知識庫文件解析錯誤",
      "PDF 匯入排錯",
    ],
    publishedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "PDF 顯示已匯入、被略過或出錯，但知識庫裡沒有完整可用內容的繁體中文使用者",
    heroBullets: [
      "先分清文字型 PDF 與掃描型 PDF，不要先調 embedding。",
      "found、ingested、skipped 與 error 是排錯訊號，不是內容可用的證明。",
      "用一段確定存在的文字與其來源，驗證完整匯入路徑。",
    ],
    sections: [
      {
        heading: "先說結論：確認 PDF 真的有文字層",
        body: [
          "先在 PDF 閱讀器中選取並複製一段文字。如果整頁只能當成圖片選取，這是掃描型或 image-only PDF，必須先做 OCR；Wenlan v1 不會自行 OCR。",
          "完成 OCR 後，另存成可擷取文字的 PDF，或轉成乾淨的 `.md` / `.txt`。先抽查姓名、日期、數字、表格與閱讀順序，再交給知識庫；搜尋得到文字不代表 OCR 結果一定正確。",
        ],
      },
      {
        heading: "把失敗分成五種，不要全部叫做上傳失敗",
        body: [
          "Wenlan 的資料夾來源只處理 `.md`、`.txt` 與 `.pdf`。文字檔上限為 1 MB，PDF 上限為 10 MB；隱藏檔、symlink 與已排除的資料夾不會進入一般掃描。不同結果要用不同修法。",
        ],
        bullets: [
          "完全找不到檔案：先檢查副檔名、大小、隱藏檔、symlink 與資料夾範圍。",
          "found 但沒有內容：檢查是否為掃描型 PDF、空文字層或只有極少可用文字。",
          "skipped：可能是檔案未變、沒有可擷取文字，或內容未通過最低品質門檻。",
          "error：可能是讀取失敗、截斷、損壞或 PDF parser 無法解析；先用原閱讀器重新匯出一份乾淨副本。",
          "有文字但回答錯：抽查多欄、表格、頁碼與段落順序，確認錯誤不是在解析階段就發生。",
        ],
      },
      {
        heading: "用一個最小來源重跑 Wenlan",
        body: [
          "不要用整個文件庫測試。複製一份無敏感資料的代表性 PDF 到單獨資料夾，完成平台與 client 設定後，註冊或重新同步這個路徑。",
          "記錄 found、ingested、skipped 與 error，但不要停在批次摘要。文件處理完成後，搜尋一段只會出現在該 PDF 的句子，確認結果能回到正確檔案或來源。",
        ],
        code: {
          label: "註冊或重新同步一個排錯來源",
          code: "wenlan status\nwenlan sources add ~/Knowledge/pdf-diagnostic",
        },
      },
      {
        heading: "用可回答與不可回答問題驗收",
        body: [
          "準備一個文件中確實有答案的問題，以及一個來源完全沒有答案的問題。第一個答案應能指出支持內容；第二個應保持未知，不能用流暢文字掩蓋缺少證據。",
          "若 Markdown 或純文字版本能通過，但原 PDF 不能，問題就在 PDF 擷取路徑，不是 embedding 或提示詞。若兩者都失敗，再檢查來源範圍、同步、檢索與引用。",
        ],
      },
      {
        heading: "何時該停下來而不是硬救 PDF",
        body: [
          "對重要合約、報表或表格，OCR 與重新匯出仍可能破壞數字或結構。若無法用抽查證明結果可靠，就保留原 PDF 為權威來源，改用人工校驗的 Markdown 或文字摘要，並清楚記錄其來源與限制。",
        ],
      },
    ],
    faqs: [
      {
        question: "為什麼 PDF 顯示已處理，知識庫卻找不到內容？",
        answer:
          "可能是檔案只有圖片、抽出的文字太少、解析失敗，或批次摘要只代表註冊／排程完成。用一段確定存在的文字驗證實際檢索結果。",
      },
      {
        question: "Wenlan 會自動對掃描型 PDF 做 OCR 嗎？",
        answer: "不會。現行 v1 只擷取已有文字層的 PDF；掃描檔需先在外部完成 OCR。",
      },
      {
        question: "空內容時應該先換 embedding 模型嗎？",
        answer: "不用。沒有成功擷取的文字無法靠 embedding 補回來；先修正或轉換來源，再重跑同一組驗收。",
      },
    ],
    relatedSlugs: [
      "build-local-ai-knowledge-base-from-documents",
      "choose-ai-knowledge-base-tool",
      "verify-ai-knowledge-base-citations",
      "source-backed-wiki-pages-ai-work",
    ],
    officialReferences: [
      {
        label: "Wenlan 支援的文件來源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan Directory Source 與檔案限制",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-core/src/sources/directory.rs",
      },
      {
        label: "Wenlan 資料夾匯入驗收測試",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-core/tests/folder_ingest_e2e.rs",
      },
      {
        label: "Google Cloud PDF OCR 與版面解析",
        href: "https://docs.cloud.google.com/gemini/enterprise/docs/parse-chunk-documents?hl=zh-tw",
      },
      {
        label: "DeepTutor 掃描 PDF 空文件 issue",
        href: "https://github.com/HKUDS/DeepTutor/issues/431",
      },
      {
        label: "Cherry Studio 雙層 PDF 空內容 issue",
        href: "https://github.com/CherryHQ/cherry-studio/issues/688",
      },
    ],
    cta: {
      heading: "先驗證一份 PDF，再擴大文件庫",
      body: "連接 Wenlan、加入一份可控文件，確認文字、來源與引用都通過後再匯入其他資料。",
    },
  },
  "when-ai-agent-should-query-knowledge-base": {
    slug: "when-ai-agent-should-query-knowledge-base",
    eyebrow: "檢索策略",
    category: "Workflows",
    title: "AI Agent 何時該查知識庫？按需讀取文件",
    description:
      "用查詢或略過的判斷流程，讓 AI Agent 在需要證據時讀知識庫，也避免反覆把無關文件塞進上下文。",
    metaTitle: "AI Agent 何時該查知識庫？| Wenlan",
    metaDescription:
      "判斷 AI Agent 何時查知識庫、略過檢索、先看索引或打開確切來源，減少無關上下文又保留證據。",
    keywords: [
      "AI Agent 何時查知識庫",
      "AI 知識庫檢索策略",
      "AI 知識庫 token 成本",
      "避免 AI 重複讀取文件",
      "按需載入上下文",
      "AI Agent 上下文管理",
    ],
    publishedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "需要讓 AI Agent 反覆查閱大型文件、專案資料或內部規範的開發者",
    heroBullets: [
      "答案依賴最新、私有、專案特定或必須引用的資訊時才查。",
      "確切權威檔案已在上下文，或任務根本不靠文件時就略過。",
      "先用索引選來源，再只打開足以驗證答案的確切段落。",
    ],
    sections: [
      {
        heading: "先回答：知識庫不用每題都查",
        body: [
          "當答案依賴目前版本的專案事實、私有資料、組織規範、精確數字或可引用證據，而且這些內容還不在上下文時，AI Agent 才應查知識庫。打招呼、固定流程、純資料操作，或確切權威檔案已經打開時，不必再做一次相同檢索。",
          "需要查詢時，先讀標題、路徑、摘要或維護型索引，確認方向後再載入最小的相關頁面，最後回到引用的原文驗證重要主張。省 Token 不能變成略過證據的理由。",
        ],
      },
      {
        heading: "為什麼一直查與完全不查都會失敗",
        body: [
          "每輪強制注入整批文件，會增加無關文字、延遲與注意力壓力；完全不查，又會讓 Agent 猜測目前事實或反覆重新發現相同決策。真正需要的是每個任務都能重複使用的查詢邊界。",
          "台灣的 CareerWise 實作把四種 intent 分開，只有需要其職涯知識的路徑開放知識庫工具；這是具體設計案例，不是 Wenlan 的固定 Token 節省保證。",
        ],
      },
      {
        heading: "用這張查詢或略過清單",
        body: [
          "先判斷答案是否依賴外部證據，再決定預先檢索、讓 Agent 自主查詢、直接讀來源，或完全略過。每次只增加完成任務需要的下一層資訊。",
          "下方 slash commands 需要先安裝 Wenlan Codex plugin 並執行一次 /setup；wenlan connect codex 只設定 MCP 連線。只有 MCP 連線的客戶端，請使用 Wenlan recall 並檢查它回傳的 Page 結果；若未安裝 plugin 但要列出或打開 Pages，請改用本地 wenlan pages <主題> CLI。",
        ],
        bullets: [
          "查詢：需要最新專案事實、私有資料、組織政策、精確數字或引用。",
          "預先檢索：每個有效答案都必須根據同一受控來源，例如法規、作業程序或產品手冊。",
          "自主查詢：只有部分問題需要文件，而且工具描述清楚寫出資料範圍與不適用情況。",
          "略過：問候、固定路由、確定性操作，或確切權威檔案已經在眼前。",
          "漸進揭露：先看索引或 Page，再打開相關段落，不一次載入整個 vault 或文件集。",
          "驗證：重要結論回到確切引用；找不到資料時標示未知，不用模型記憶補答案。",
          "量測：在自己的工作負載記錄檢索 Token、延遲、答案品質與失敗搜尋。",
        ],
        code: {
          label: "先查窄主題，再檢查維護型 Page",
          code: "# Wenlan plugin：\n/recall <主題>\n/pages <主題>\n\n# 只有 MCP：呼叫 Wenlan recall 並檢查回傳的 Page。\n# 本地 CLI 列出或打開 Page：\nwenlan pages <主題>",
        },
      },
      {
        heading: "Wenlan 在這個流程負責什麼",
        body: [
          "Wenlan 把 Sources、原子知識與維護型 Pages 分開。Agent 可以先 recall 一個窄主題或打開相關 Page，檢查引用後再回到目前的原始文件，不用每次重播整個資料庫。",
          "Wenlan 不會取代程式碼、測試、政策或目前文件的直接驗證，也不保證一定降低 Token。較小的上下文仍可能漏掉關鍵內容；無關檢索也可能讓答案更差，因此要用代表性任務比較完整流程。",
        ],
      },
    ],
    comparisonTable: {
      competitorName: "檢索動作",
      rows: [
        {
          dimension: "最新、私有或需引用的事實",
          wenlan: "查窄主題，再打開目前引用來源。",
          competitor: "查詢",
        },
        {
          dimension: "每次都必須依據受控文件",
          wenlan: "預先帶入必要來源，並保留後續來源查閱。",
          competitor: "預先檢索",
        },
        {
          dimension: "權威檔案已經打開",
          wenlan: "直接讀檔驗證，不增加重複搜尋。",
          competitor: "略過檢索",
        },
        {
          dimension: "大型或陌生文件集",
          wenlan: "先看索引或 Page，再載入確切來源段落。",
          competitor: "漸進揭露",
        },
      ],
    },
    faqs: [
      {
        question: "AI Agent 每次回答都應該查知識庫嗎？",
        answer:
          "不應該。只有每個答案都必須依據受控來源時才適合固定預先檢索；其他流程應讓任務或 Agent 在確實依賴該資料時才查。",
      },
      {
        question: "使用知識庫就一定能降低 Token 嗎？",
        answer:
          "不一定。索引與選擇性檢索可以減少重讀文件，但 embedding、工具呼叫、回傳片段與失敗搜尋也有成本，必須用自己的任務量測完整流程。",
      },
      {
        question: "什麼時候必須回到原始文件？",
        answer:
          "精確數字、否定條件、合規規則、目前程式行為與其他重要結論，都應打開確切引用位置驗證；Page 或檢索摘要只能幫你找到來源。",
      },
    ],
    relatedSlugs: [
      "ai-work-memory-vs-knowledge-base",
      "coding-agent-source-backed-knowledge-base",
      "source-backed-wiki-pages-ai-work",
      "verify-ai-knowledge-base-citations",
    ],
    officialReferences: [
      {
        label: "Anthropic AI Agent 上下文工程",
        href: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      },
      {
        label: "CareerWise 知識庫搜尋 Tool Use 實作",
        href: "https://www.cythilya.tw/2026/07/16/careerwise-search-knowledge-tool/",
      },
      {
        label: "JitAI 按場景查閱知識庫",
        href: "https://jit.pro/zh/docs/devguide/knowledge-base/integrate-knowledge-base-into-agent",
      },
      {
        label: "OpenViking 上下文層級",
        href: "https://docs.openviking.ai/zh/concepts/03-context-layers",
      },
      {
        label: "Wenlan source-backed Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
    ],
    cta: {
      heading: "先測一條檢索邊界",
      body: "連接 Wenlan，選一個會重複出現的專案問題，比較整批載入、按需查詢與直接讀來源，不預設一定省 Token。",
    },
  },
  "test-ai-knowledge-base-retrieval-after-changes": {
    slug: "test-ai-knowledge-base-retrieval-after-changes",
    eyebrow: "檢索回歸測試",
    category: "Workflows",
    title: "AI 知識庫改版後，怎麼做 RAG 檢索回歸測試？",
    description:
      "用版本化黃金資料集，比較語料、embedding、切塊、混合檢索或 reranker 改動前後，是否仍找得到預期來源。",
    metaTitle: "RAG 檢索回歸測試與黃金資料集 | Wenlan",
    metaDescription:
      "用黃金問題、預期來源、Recall@k、MRR、無答案案例、失敗分類與回滾，驗證 AI 知識庫改版後的檢索品質。",
    keywords: [
      "RAG 檢索回歸測試",
      "RAG 黃金資料集",
      "AI 知識庫召回準確率怎麼測",
      "換 embedding 後怎麼驗證",
      "RAG reranker 測試",
      "AI 知識庫檢索評估",
    ],
    publishedAt: "2026-08-26",
    updatedAt: "2026-08-26",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "正在更換 AI 知識庫語料、embedding、切塊、混合檢索或 reranker 的開發者",
    heroBullets: [
      "改檢索前，先固定代表性問題與預期來源。",
      "一次改一個因素，先比較檢索，再評估生成回答。",
      "逐筆檢查退步案例，原因未釐清前保留回滾能力。",
    ],
    sections: [
      {
        heading: "先說結論",
        body: [
          "要驗證 AI 知識庫改版後的檢索品質，先建立一份有版本的黃金資料集：每題記錄自然提問、預期 source ID 或文件、無答案案例與基準設定。改動一項語料或檢索因素後，重跑同一批問題，先比較檢索結果，再檢查遺失或新增的來源，差異能被解釋才接受新版本。",
          "這和引用驗證不同。引用驗證從一個已產生的回答出發，檢查來源是否支持每個主張；檢索回歸測試在生成回答之前，確認改版後是否仍取回原本應該出現的證據。",
        ],
      },
      {
        heading: "哪些改動之後要重跑？",
        body: [
          "新增、刪除或更新來源文件，更換 embedding，調整 chunk size、metadata filter、BM25 與向量權重、top-k 或 reranker，都可能讓某些問題變好、另一些問題卻找不到原本的證據。不要只用一題 demo 判定整體成功。",
        ],
        bullets: [
          "收錄常見真實問題、已知失敗、邊界案例，以及知識庫不該回答的問題。",
          "每個預期結果旁保留權威來源版本，來源真的改變時才明確更新標籤。",
          "新系統與黃金答案不同時，先調查原因，不要直接把新結果 bless 成正確。",
        ],
      },
      {
        heading: "黃金資料集至少要記什麼？",
        body: [
          "每個案例需要穩定 ID、使用者自然問題、預期來源、禁止出現的來源、是否允許無答案，以及這題為何重要。語料版本與檢索設定要另外保存，否則兩次結果無法公平比較。",
        ],
        code: {
          label: "最小黃金案例",
          code: "version: 1\ncorpus_revision: docs-2026-08-26\ncases:\n  - id: windows-installer\n    query: Windows 桌面版應下載哪個檔案？\n    expected_sources: [release-v0.16.0]\n    excluded_sources: [runtime-zip]\n    no_answer: false\n  - id: enterprise-price\n    query: 企業版價格是多少？\n    expected_sources: []\n    no_answer: true",
        },
      },
      {
        heading: "固定基準，一次只改一個因素",
        body: [
          "記錄語料 revision、embedding 模型、切塊參數、filter、混合檢索權重、reranker 版本、top-k 與執行環境。能一次只改一項最好；同時改很多項時，測試可能看得出 drift，卻無法指出原因。",
          "先比較 source-level Recall@k 或 Hit@k；排序重要時再看 MRR 或 NDCG。無答案案例與 latency 要分開保留，不要把所有數字合成一個分數，掩蓋關鍵來源消失。",
        ],
      },
      {
        heading: "先查檢索失敗，再看回答好不好",
        body: [
          "對每個失敗案例，依序檢查 query rewrite、取回片段、分數、source ID、filter、融合結果、reranker 與最後排序。把文件缺失、錯誤標籤、擷取失敗、metadata filter、embedding drift、切塊邊界與 reranker 變化分開。",
          "預期來源本身也可能標錯；相反地，整體平均分數很好，也可能漏掉一個高風險問題。只有預期證據確實被取回後，才進一步評估 grounding、回答品質與引用。",
        ],
      },
      {
        heading: "誠實使用 Wenlan 的 maintainer drift test",
        body: [
          "Wenlan repository 維護有標籤的檢索 fixtures、只針對 retrieval 的 Recall@5、MRR、NDCG@10 快照、固定 ranking goldens，以及 main canary 使用的 ignored drift test。它偵測的是相對可信基準的漂移，不是絕對正確性。",
          "這是 Wenlan 維護者工作流，不是已發布的 `wenlan eval` 使用者命令，也不是 hosted CI 功能。即使不用 Wenlan，你仍可把黃金資料集、來源版本與回滾決策放在自己的 repository。",
        ],
        code: {
          label: "僅供 Wenlan repository 維護者使用",
          code: "cargo test -p wenlan-core --lib \\\n  eval::retrieval_drift::tests::ranking_drift_vs_golden \\\n  -- --ignored --nocapture",
        },
      },
    ],
    faqs: [
      {
        question: "RAG 黃金資料集要準備多少題？",
        answer:
          "先涵蓋重要來源、常見問題、已知失敗與無答案行為。少量但經過人工驗證的案例，比大量錯誤標籤更有用；之後再從真實失敗持續加入。",
      },
      {
        question: "語料改變後，可以直接更新黃金答案嗎？",
        answer:
          "只有權威來源的契約真的改變時才更新。先對照新舊來源、記錄理由並建立新版本，不能因為新檢索結果不同就靜默 bless。",
      },
      {
        question: "檢索回歸測試通過，就代表回答一定正確嗎？",
        answer:
          "不代表。它只證明測試範圍內的檢索符合契約；生成品質、引用是否支持主張，以及來源本身是否正確，都要另外檢查。",
      },
    ],
    relatedSlugs: [
      "verify-ai-knowledge-base-citations",
      "source-backed-wiki-pages-ai-work",
      "choose-ai-knowledge-base-tool",
      "fix-pdf-ingestion-ai-knowledge-base",
      "when-ai-agent-should-query-knowledge-base",
      "build-customer-support-answer-knowledge-base",
      "build-course-wiki-from-lecture-notes",
    ],
    officialReferences: [
      {
        label: "Wenlan 評估方法",
        href: "https://wenlan.app/docs/evaluation",
      },
      {
        label: "Wenlan retrieval drift source",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-core/src/eval/retrieval_drift.rs",
      },
      {
        label: "小丁的 RAG 檢索準確率除錯實錄",
        href: "https://blog.tomting.com/2026/08/13/rag-retrieval-accuracy-eval-debug/",
      },
      {
        label: "小丁的 BM25、切塊與 reranker ablation",
        href: "https://blog.tomting.com/2026/08/15/rag-ablation-bm25-chunksize-reranker/",
      },
      {
        label: "Microsoft zh-TW RAG 評估指南",
        href: "https://learn.microsoft.com/zh-tw/azure/architecture/ai-ml/guide/rag/rag-llm-evaluation-phase",
      },
    ],
    cta: {
      heading: "先固定一份檢索基準",
      body: "挑選代表性專案問題，記錄預期來源與版本，再開始改 embedding、切塊或 reranker。",
    },
  },
  "verify-ai-knowledge-base-citations": {
    slug: "verify-ai-knowledge-base-citations",
    eyebrow: "引用除錯",
    category: "Workflows",
    title: "AI 知識庫引用對不上？逐項驗證來源與無依據回答",
    description:
      "把 RAG 或 AI 知識庫回答拆成可檢查主張，找出錯頁、錯片段、過期來源與沒有證據支持的結論。",
    metaTitle: "AI 知識庫引用對不上？驗證來源與回答 | Wenlan",
    metaDescription:
      "逐項驗證 AI 知識庫引用，診斷錯頁、錯片段、過期版本與無依據回答，並建立可重複的來源檢查流程。",
    keywords: [
      "AI 知識庫引用對不上",
      "驗證 AI 知識庫引用",
      "AI 知識庫回答沒有依據",
      "RAG 引用錯誤",
      "引用來源可追溯",
      "AI 知識庫來源驗證",
    ],
    publishedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    author: "Qi-Xuan Lu",
    readingTime: "7 分鐘閱讀",
    audience: "看到 AI 回答附了引用，卻發現頁碼、片段、版本或內容對不上的繁體中文使用者",
    heroBullets: [
      "有引用標記，只代表系統附上來源，不代表來源真的支持這句話。",
      "每個重要主張都要回到確切頁面、片段與文件版本檢查。",
      "檢查結果分成支持、部分支持、無依據與過期，不用一個模糊分數帶過。",
    ],
    sections: [
      {
        heading: "先回答：引用存在，不等於回答有依據",
        body: [
          "驗證 AI 知識庫回答時，先把文字拆成可單獨判斷的事實主張，再逐項打開它引用的頁面或片段。只有目前版本的來源完整支持主張的內容、範圍、數字與歸屬，這一項才算通過。",
          "如果引用打不開、指向錯頁、只支持半句、引用的是舊版本，或來源根本沒說這件事，就要分別記錄。不要因為回答讀起來合理，或頁尾列了三個來源，就把它當成已驗證。",
        ],
      },
      {
        heading: "先分清楚五種引用失敗",
        body: [
          "缺少引用、連結失效、引用錯頁、來源不支持主張，以及來源已過期，是五個不同問題。分類正確，才知道應該修檢索、metadata、文件版本，還是直接撤回結論。",
        ],
        bullets: [
          "缺少：重要事實沒有任何可檢查來源。",
          "失效：source ID、連結、頁碼或片段已無法開啟。",
          "錯配：來源存在，但指向另一頁、另一段或另一個主張。",
          "無依據：來源內容沒有支持回答所下的結論。",
          "過期：舊版本曾支持，但目前文件、程式或政策已改變。",
        ],
      },
      {
        heading: "逐項做 claim-to-evidence 檢查",
        body: [
          "從一個可疑回答開始，替每個事實主張記下引用標記、source ID、文件名稱、頁碼或段落，以及能取得的版本。打開原文後，判斷它是完整支持、部分支持、無依據或過期。",
          "數字、否定詞、適用範圍、作者歸屬與日期要分開檢查。相鄰段落看起來很像，也可能剛好否定回答；缺資料時應標示未知，不能把 unavailable 當成通過。",
        ],
        code: {
          label: "檢查一個 Wenlan Page",
          code: "/pages <主題>\n/lint\n/curate",
        },
      },
      {
        heading: "修正後要用同一個問題重測",
        body: [
          "找到錯頁或無依據主張後，先修正來源 metadata、刪除錯誤結論，或把 Page 標記為需要刷新與審查。接著用同一個問題重跑，確認答案回到預期來源，而不是換一個看似合理的錯誤片段。",
          "Wenlan 會把 Sources、原子知識與維護型 Pages 分開，並提供 source IDs、修訂、stale 狀態、lint 與人工審查；這讓證據路徑可檢查，但不會自動保證來源本身正確。",
        ],
      },
      {
        heading: "這不是自動化真實性分數",
        body: [
          "這套方法是可重複的除錯清單，不是宣稱一個分數就能證明整套 RAG 正確。高風險結論仍要回到目前的第一方來源，必要時由熟悉領域的人審查。",
          "即使不使用 Wenlan，也可以用相同表格記錄 claim、來源位置、版本、判定與修正結果；它的獨立價值在於讓『哪一句沒有依據』變得具體。",
        ],
      },
    ],
    faqs: [
      {
        question: "回答有引用，就代表沒有幻覺嗎？",
        answer:
          "不代表。引用可能指向錯頁、錯片段、舊版本，或只支持部分內容；每個重要主張仍需對照原文。",
      },
      {
        question: "引用頁面不對時應該怎麼修？",
        answer:
          "先記錄為引用錯配，再尋找真正支持主張的目前來源。找不到就撤回或標示未知，不要因為回答聽起來合理而保留。",
      },
      {
        question: "Wenlan 能自動證明來源一定正確嗎？",
        answer:
          "不能。Wenlan 讓來源、source IDs、修訂與審查可見，但來源的權威性與重要結論仍需人工判斷。",
      },
    ],
    relatedSlugs: [
      "prevent-multi-agent-knowledge-conflicts",
      "fix-pdf-ingestion-ai-knowledge-base",
      "source-backed-wiki-pages-ai-work",
      "choose-ai-knowledge-base-tool",
      "distilled-wiki-pages-ai-memory",
      "when-ai-agent-should-query-knowledge-base",
      "coding-agent-source-backed-knowledge-base",
      "test-ai-knowledge-base-retrieval-after-changes",
      "source-backed-research-knowledge-base",
      "build-client-project-knowledge-base-for-consulting",
      "build-investment-research-knowledge-base",
      "build-product-research-knowledge-base-for-prd",
      "build-sre-incident-knowledge-base",
      "build-ict-supplier-due-diligence-evidence-pack",
      "build-customer-support-answer-knowledge-base",
      "build-business-metric-definition-knowledge-base",
      "build-course-wiki-from-lecture-notes",
    ],
    officialReferences: [
      {
        label: "Anthropic 繁體中文引用文件",
        href: "https://platform.claude.com/docs/zh-TW/build-with-claude/citations",
      },
      {
        label: "Open WebUI 引用錯誤來源 issue",
        href: "https://github.com/open-webui/open-webui/issues/12655",
      },
      {
        label: "Open WebUI 重複片段引用 issue",
        href: "https://github.com/open-webui/open-webui/issues/20435",
      },
      {
        label: "Wenlan 審查與信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
    ],
    cta: {
      heading: "先驗證一個回答，再擴大知識庫",
      body: "用 Wenlan 打開 Page、來源、過期狀態、lint 與審查路徑，只保留目前證據真的支持的主張。",
    },
  },
  "source-backed-research-knowledge-base": {
    slug: "source-backed-research-knowledge-base",
    eyebrow: "研究工作流",
    category: "Workflows",
    title: "如何用論文與 PDF 建立可追溯的研究知識庫",
    description:
      "從一組已選定的論文建立研究知識庫，保留文獻矩陣、方法、限制、矛盾、引用與來源更新。",
    metaTitle: "用論文與 PDF 建立可追溯研究知識庫 | Wenlan",
    metaDescription:
      "用已選定的論文與文字型 PDF 建立研究知識庫，保留文獻矩陣、精確引用、矛盾、限制與來源更新。",
    keywords: [
      "用論文 PDF 建立研究知識庫",
      "AI 論文筆記保留引用",
      "論文大腦 文獻回顧",
      "可追溯來源的研究筆記",
      "文獻矩陣 AI",
      "研究知識管理",
    ],
    publishedAt: "2026-08-27",
    updatedAt: "2026-08-27",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "已經選好一組論文，希望整理文獻又不失去引用、矛盾與研究限制的學生及研究者",
    heroBullets: [
      "先固定一個研究問題與一組已取得的論文，不把自動找文獻混進同一工作。",
      "每個主張、方法、樣本、結果與限制都回到確切頁面或段落。",
      "新論文加入時分開更新共識、矛盾與未知，不重寫成一段順暢結論。",
    ],
    sections: [
      {
        heading: "先回答：研究知識庫要保存什麼",
        body: [
          "從一個研究問題和一組已選定的論文開始。原始論文保持權威，研究知識庫保存可檢查的文獻矩陣：主張、方法、樣本、結果、限制、確切來源位置與目前驗證狀態。",
          "這不是請 AI 代寫文獻回顧。真正有用的產物會把同意、矛盾與未知分開，讓下一位讀者能從每個綜合結論回到原文重做判斷。",
        ],
      },
      {
        heading: "先把來源範圍縮到能逐項驗證",
        body: [
          "只加入目前研究問題需要的論文。Wenlan 可讀 Markdown、文字檔、可直接擷取文字的 PDF、資料夾與唯讀 Obsidian vault；影像型或掃描 PDF 必須先在外部完成 OCR。",
          "Wenlan 不會搜尋學術資料庫、找 DOI、匯入 Zotero、替引用排格式或判斷研究品質。選文、方法評估、統計判讀與學術誠信仍由研究者負責。",
        ],
      },
      {
        heading: "建立可重做的文獻矩陣",
        body: [
          "每個重要結果各佔一列，不要先寫成一段總結。欄位至少包含 paper、claim、method、sample、result、limitation、page 或 section、版本與驗證狀態。",
        ],
        bullets: [
          "研究問題與納入範圍：說明這一輪包含與排除哪些論文。",
          "方法與樣本：避免把不同設計和母體直接合併。",
          "結果與限制：把作者實際報告和你的解讀分開。",
          "引用位置：保存頁碼、段落、source ID 與可取得的版本。",
          "證據狀態：標記支持、部分支持、無依據、矛盾或待查。",
        ],
        code: {
          label: "完成 Wenlan 與 AI 客戶端設定後",
          code: "wenlan status\nwenlan sources add ~/Research/papers\n/distill <研究問題>\n/pages <研究問題>\n/lint\n/curate",
        },
      },
      {
        heading: "不要把矛盾與限制磨成假共識",
        body: [
          "兩篇論文結果不同時，先比較樣本、方法、時間、適用範圍與限制，再決定是否能形成更窄的結論。證據不足就保留未知，不要為了讓筆記好讀而補成一致答案。",
          "重要數字、否定詞、作者歸屬和範圍都要打開引用段落核對。引用存在只代表有路徑，不代表來源本身正確，也不代表它完整支持這句話。",
        ],
        link: {
          label: "查看逐項引用驗證工作流",
          href: "/learn/verify-ai-knowledge-base-citations",
        },
      },
      {
        heading: "新論文加入時只刷新受影響的綜合",
        body: [
          "加入新論文或替換修訂版後，重新同步來源，標出哪些矩陣列和結論受影響，再產生可審查的 Page 修訂。保留舊版本與變更原因，才能看出知識如何改變。",
          "最後保留一份人能直接閱讀的研究筆記。Wenlan 可以維護來源、Page、引用、stale 狀態與修訂，但研究者仍負責解讀、引用格式與最終寫作。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 可以幫我找論文或直接寫文獻回顧嗎？",
        answer:
          "不行。請先用適合的學術搜尋工具選好論文。Wenlan 負責維護可檢查的來源與研究綜合，不取代檢索、選文、引用格式、解讀或作者責任。",
      },
      {
        question: "不同論文互相矛盾時怎麼處理？",
        answer:
          "分開保留每篇研究的方法、樣本、結果、限制與來源位置，再明確標記矛盾。只有證據支持時才寫成更窄的綜合，否則保持未知。",
      },
      {
        question: "掃描型 PDF 能直接加入嗎？",
        answer:
          "不能。PDF 必須能直接擷取文字；只有影像的掃描檔要先做 OCR，再將可讀文字納入研究來源。",
      },
    ],
    relatedSlugs: [
      "build-local-ai-knowledge-base-from-documents",
      "verify-ai-knowledge-base-citations",
      "source-backed-wiki-pages-ai-work",
      "choose-ai-knowledge-base-tool",
      "build-ict-supplier-due-diligence-evidence-pack",
    ],
    officialReferences: [
      {
        label: "Wenlan 支援的文件來源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan 有來源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "臺大生成式 AI 研究與引用指南",
        href: "https://www.lib.ntu.edu.tw/img/tulblog/HELP/HELP_20260525_AI.pdf",
      },
      {
        label: "Distill 研究工作區",
        href: "https://github.com/luisalarcon-gauntlet/Distill",
      },
      {
        label: "UReKA 研究知識工作流",
        href: "https://github.com/Agents4Academia-AI/UReKA",
      },
    ],
    cta: {
      heading: "先建立一份可逐項檢查的研究筆記",
      body: "加入一組有界論文、建立文獻矩陣，再確認每個重要綜合都能回到目前來源。",
    },
  },
  "build-client-project-knowledge-base-for-consulting": {
    slug: "build-client-project-knowledge-base-for-consulting",
    eyebrow: "顧問工作流",
    category: "Workflows",
    title: "顧問如何建立客戶專案知識庫：從研究到交接",
    description:
      "把單一顧問案的來源、研究、決策、交付物與交接脈絡整理成可追溯、可更新的客戶專案知識庫。",
    metaTitle: "顧問如何建立客戶專案知識庫 | Wenlan",
    metaDescription:
      "建立單一客戶範圍的顧問專案知識庫，管理研究來源、決策、交付物、過期證據與專案交接。",
    keywords: [
      "顧問 客戶專案 知識庫",
      "顧問案 研究資料 交接",
      "客戶研究 知識庫 引用",
      "顧問 專案知識管理",
      "顧問案 交付物 來源",
    ],
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "需要交付研究、建議與專案交接的獨立顧問、小型顧問團隊與研究分析人員",
    heroBullets: [
      "每個客戶使用獨立來源邊界，不把不同顧問案混在一起。",
      "研究、決策與交付物主張都能回到客戶已核准的目前來源。",
      "交接時留下待辦、過期證據、風險與下一位負責人。",
    ],
    sections: [
      {
        heading: "先回答：一個客戶，一個可檢查的知識邊界",
        body: [
          "每個顧問案建立獨立的客戶專案知識庫。只加入這次合作核准使用的提案、範圍、訪談筆記、研究來源、決策與交付物，並把待確認問題分開保存。",
          "重點不是把所有檔案交給 AI，而是讓下一份簡報、報告或交接中的重要主張，都能回到目前來源、決策日期與負責人。",
        ],
      },
      {
        heading: "先切開客戶、方法與機密資料",
        body: [
          "客戶事實與檔案不得進入共用資料夾。可以重用的通用方法、範本與公開研究應放在另一個明確邊界，並確認合約允許重用。",
          "先用不敏感的範例驗證流程。Wenlan 的本地優先儲存不會取代客戶同意、權限控管、保留政策、遮罩、法遵或安全文件系統。",
        ],
      },
      {
        heading: "建立來源、決策與交付物閉環",
        body: [
          "為每個重要決策記錄日期、負責人、依據、替代方案，以及什麼新證據會重新開啟它。交付物中的數字、結論與建議，要逐項核對來源與版本。",
        ],
        bullets: [
          "建立一個客戶 Space 與一個核准來源資料夾。",
          "加入 scope、研究、訪談筆記、決策紀錄與目前交付物。",
          "將重複使用的專案問題整理成有來源 Page。",
          "來源改變時只刷新受影響 Page，無法確認的主張標成 stale。",
          "分享前執行 lint 與人工審查。",
        ],
        code: {
          label: "完成 Wenlan 與 AI 客戶端設定後",
          code: "wenlan status\nwenlan sources add ~/Clients/acme-approved-sources\n/distill <客戶專案問題>\n/pages <客戶專案問題>\n/lint\n/curate\n/handoff",
        },
      },
      {
        heading: "交接要讓下一位顧問可以重做判斷",
        body: [
          "交接至少包含目前範圍、已接受決策、未決問題、交付物狀態、來源邊界、過期證據、已知風險與下一位負責人。不要只留一段流暢摘要。",
          "Wenlan 可以維護 Sources、Memories、Pages、引用、修訂、stale 狀態與審查，但不會自動連接 CRM、電子郵件或行事曆，也不提供 RBAC、自動遮罩、計費或專案管理。",
        ],
      },
    ],
    faqs: [
      {
        question: "所有客戶可以共用同一個知識庫嗎？",
        answer:
          "不應該。每個顧問案要有獨立來源邊界與 Space；只有明確允許重用的通用方法或範本可以放在另一個共用範圍。",
      },
      {
        question: "Wenlan 會替我處理客戶機密與權限嗎？",
        answer:
          "不會。Wenlan 讓本地、有來源的知識可檢查，但不是 CRM、文件權限、遮罩或法遵系統；必須先套用客戶核准的安全與保留規則。",
      },
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
        label: "Wenlan 知識模型與 Spaces",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan 日常工作流程",
        href: "https://github.com/7xuanlu/wenlan#daily-workflow",
      },
      {
        label: "Cogni Consult 客戶交付工作區",
        href: "https://github.com/cogni-work/insight-wave/tree/main/cogni-consult",
      },
      {
        label: "AI Consulting Methodology 顧問案生命週期",
        href: "https://github.com/mardy123/AI-Consulting-Methodology-Toolkit/blob/main/06_Delivery/ENGAGEMENT_LIFECYCLE.md",
      },
      {
        label: "市場研究工作流參考",
        href: "https://github.com/genli-ai/market-research-skills/blob/main/skills/analyst-research/references/workflow_medium.zh.md",
      },
    ],
    cta: {
      heading: "先建立一份可檢查的客戶交接",
      body: "切開客戶來源、驗證一個交付物主張，再留下下一位顧問能重做判斷的交接。",
    },
  },
  "build-investment-research-knowledge-base": {
    slug: "build-investment-research-knowledge-base",
    eyebrow: "投資研究工作流",
    category: "Workflows",
    title: "如何建立投資研究知識庫：從財報、法說會到投資論點",
    description:
      "把財報、法說會資料與研究問題整理成可追溯的公司研究檔案，並在新證據出現時更新論點。",
    metaTitle: "如何建立投資研究知識庫 | Wenlan",
    metaDescription:
      "用財報、年報與法說會資料建立有來源的投資研究知識庫，保留引用、論點變更與過期證據審查。",
    keywords: [
      "投資研究知識庫",
      "AI 財報研究工作流",
      "年報 法說會 研究筆記",
      "公司研究 來源引用",
      "投研資料 知識管理",
    ],
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    author: "Qi-Xuan Lu",
    readingTime: "9 分鐘閱讀",
    audience: "使用財報、法說會與公司公告做研究的證券研究員、獨立投資人與財務專業人員",
    heroBullets: [
      "一家公司與一個報告期間使用明確來源邊界。",
      "每個重要主張都回到目前財報、年報或法說會段落。",
      "記錄哪些證據改變、哪些與論點矛盾，以及哪些問題仍未解答。",
    ],
    sections: [
      {
        heading: "先回答：研究檔案要能從論點回到原始資料",
        body: [
          "為每家公司建立獨立的投資研究知識庫，只加入你有權使用的目前年報、財報、重大訊息、法說會簡報與有日期的逐字稿或筆記。至少維護來源登錄表、指標與展望變更紀錄、投資論點、矛盾紀錄和待查問題。",
          "Wenlan 可以維護有來源 Page、引用、修訂、stale 狀態、lint 與人工審查；它不提供即時行情、付費逐字稿、XBRL 或表格解析、估值計算、投資組合監控、交易訊號或投資建議。",
        ],
      },
      {
        heading: "先固定公司、期間與來源版本",
        body: [
          "來源登錄表至少記錄公司、文件類型、報告期間、發布日期、修訂版、權威來源與本機檔名。將公司報告的事實、自己的計算與投資判斷分開，不要把分析推論寫成公司原話。",
          "掃描 PDF 必須先在外部完成 OCR。財務報表、表格與計算仍應回到原始申報資料和可重做的試算表或模型核對。",
        ],
      },
      {
        heading: "建立一個財報到論點的更新閉環",
        body: [
          "先用一家公司與一個報告週期驗證流程；重要數字、風險、展望和管理階層說法都保存準確頁碼或段落。",
        ],
        bullets: [
          "加入目前年報或財報、最新季報、法說會簡報與有日期的研究筆記。",
          "整理商業模式、部門、關鍵指標、展望、風險、催化劑與待查問題。",
          "將新期間和前一期逐項比較，標出展望、指標定義、風險與管理說法的改變。",
          "每個論點記錄來源、日期、信心、反證與失效條件。",
          "來源修訂後只更新受影響 Page，無法再支持的主張標成 stale。",
        ],
        code: {
          label: "完成 Wenlan 與 AI 客戶端設定後",
          code: "wenlan status\nwenlan sources add ~/Research/companies/acme\n/distill <公司與報告期間問題>\n/pages <公司研究主題>\n/lint\n/curate",
        },
      },
      {
        heading: "引用存在，不等於分析正確",
        body: [
          "使用主張前要打開引用段落，核對數字、單位、期間、否定詞與管理階層歸屬。引用只證明有路徑，不證明來源本身正確，也不證明你的解讀成立。",
          "這個流程不是投資建議，也不能取代授權資料、法遵審查、估值模型或專業判斷。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 會自動抓財報、行情或法說會逐字稿嗎？",
        answer:
          "不會。請加入你有權使用的文件。Wenlan 不提供即時金融資料、逐字稿授權、XBRL 管線、估值引擎或投資組合監控。",
      },
      {
        question: "如何避免投資論點在新財報後過期？",
        answer:
          "每個論點都連到有日期的來源和失效條件。新財報或法說會後比較來源組，將已被取代的主張標成 stale，並保留舊修訂供審查。",
      },
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
        label: "Wenlan 支援的文件來源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan 有來源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Anthropic 股票研究財報工作流",
        href: "https://github.com/anthropics/financial-services/blob/main/plugins/vertical-plugins/equity-research/commands/earnings.md",
      },
      {
        label: "數位時代：券商分析師 AI 研究工作流",
        href: "https://www.bnext.com.tw/article/91590/notebooklm-gemini-claude-ai-research-workflow",
      },
      {
        label: "Investor Harness 證據導向投研工作流",
        href: "https://github.com/joansongjr/investor-harness",
      },
    ],
    cta: {
      heading: "先建立一份可檢查的公司研究檔案",
      body: "加入一個報告週期、核對每個重要主張，再保存哪些證據與論點發生改變。",
    },
  },
  "build-product-research-knowledge-base-for-prd": {
    slug: "build-product-research-knowledge-base-for-prd",
    eyebrow: "產品研究工作流",
    category: "Workflows",
    title: "建立產品研究知識庫，再開始寫 PRD",
    description:
      "把核准的研究筆記、客服與業務訊號、過往決策整理成有來源的證據庫，支援可辯護的 PRD 審查。",
    metaTitle: "建立產品研究知識庫，再開始寫 PRD | Wenlan",
    metaDescription:
      "把使用者研究連到可辯護的 PRD：保留有日期的來源、可追溯需求、矛盾、假設、待解問題與決策歷史。",
    keywords: [
      "產品研究知識庫",
      "使用者研究到 PRD",
      "產品決策來源",
      "有證據的 PRD",
      "UX 研究知識庫",
      "產品營運知識庫",
      "產品探索證據",
    ],
    publishedAt: "2026-08-28",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "準備 PRD 或路線圖審查的產品經理、UX 研究員與產品營運團隊",
    heroBullets: [
      "從一個產品決策和核准的證據邊界開始。",
      "讓每個需求都能回到有日期的研究、客服、業務或決策來源。",
      "分開保存觀察、解讀、假設、矛盾與待解問題。",
    ],
    productEvidence: {
      heading: "看看審查者實際檢查的有來源工作區",
      summary:
        "下方是 Wenlan App 從確定性測試資料擷取的真實桌面畫面。畫面列出有來源數量的近期 Pages，也讓來源衝突與新來源等待審查。這不是客戶資料；同一個審查介面也支援產品研究證據。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 畫面，顯示近期整理的 Pages、各頁來源數量，以及來源衝突與新來源的審查佇列。",
        caption:
          "Wenlan App 的真實測試畫面：這是通用產品示例，不是產品研究專案的完成成果。Page 列表顯示來源數量，審查佇列保留來源衝突與待處理的新來源。",
        width: 1586,
        height: 992,
      },
      workflow: [
        {
          label: "核准來源邊界",
          detail: "只加入團隊可以檢查、允許用於這次產品決策的研究與決策來源。",
        },
        {
          label: "整理一個產品決策",
          detail: "把觀察、解讀、假設、矛盾與待解問題分開，並讓重要主張連回來源。",
        },
        {
          label: "寫 PRD 前先審查",
          detail: "打開引用與原始記錄，確認需求有依據，過期或無法證明的內容保持可見。",
        },
      ],
      artifactHeading: "PRD 證據封包範例",
      artifactNote:
        "這是可檢查輸出的結構範例，不代表任何特定使用者研究或真實產品決策。",
      artifactRows: [
        {
          label: "證據輸入",
          detail: "有日期的訪談段落、客服訊號與已核准的過往決策。",
        },
        {
          label: "候選需求",
          detail: "把一項需求連回來源，並分開記錄團隊解讀、假設與衝突證據。",
        },
        {
          label: "審查結果",
          detail: "保留、縮小或維持未解；決定時留下理由、目前修訂與待補證據。",
        },
      ],
      action: {
        label: "查看證據工作流",
        href: "#product-evidence",
      },
    },
    sections: [
      {
        heading: "先從一個產品決策開始，不是公司檔案庫",
        body: [
          "開始寫 PRD 前，先為正在審查的決策建立一個產品範圍內的證據庫。只收集團隊可以檢查的核准訪談筆記、客服或業務筆記、研究資料與過往決策；目標是讓每個需求都可追溯，不是把所有對話做成一個泛用資料夾。",
          "Wenlan 可以把支援的 Markdown、文字、可擷取文字的 PDF、資料夾與唯讀 Obsidian 來源，連到有來源的 Pages、引用、修訂、過期狀態與審查。它不會替你決定產品路線，也不會把來源自動變成已核准的產品需求。",
        ],
      },
      {
        heading: "綜合前先固定來源邊界",
        body: [
          "在請 Agent 綜合前，先寫下產品範圍、審查問題、日期區間、納入的來源類型與排除的資料。一個窄邊界能幫你分辨需求是來自使用者觀察、團隊解讀、假設，還是需要重新檢視的決策。",
          "在小型來源登錄表中保存來源日期、文件版本與確切標題或段落。如果筆記不完整，或來源沒有獲准用於這個產品決策，應記錄為無法取得，不要默默補上缺口。",
        ],
        bullets: [
          "核准的訪談或研究筆記：保留觀察與來源位置。",
          "客服或業務筆記：把重複出現的問題訊號和未驗證的要求分開。",
          "過往決策：記錄決策日期、理由、範圍，以及當時可用的證據。",
          "假設與待解問題：保持可見，不要把它們寫成使用者事實。",
        ],
      },
      {
        heading: "把筆記連成需求的證據鏈",
        body: [
          "每個重要需求使用一列或一個 Page 段落。把需求連到有日期的來源段落，分開記錄原始觀察和你的解讀，並在判斷需求應保留、縮小或維持未解前，先留下互相矛盾的證據。",
          "同一條證據鏈應能通過 PRD 審查：審查者可以打開來源，看見目前修訂，理解仍存在的假設，並追蹤過往決策如何改變。來源變動時，只刷新受影響的 Page，並保留舊修訂供審查。",
        ],
        bullets: [
          "記錄產品問題、source ID、日期、確切位置與適用範圍。",
          "把每句話分類為觀察、解讀、假設、決策或待解問題。",
          "把接受或拒絕的理由連到證據，不只連到會議結論。",
          "比較衝突訊號；證據無法解決時就保留矛盾。",
          "需求進入 PRD 草稿前，先標記無依據或已過期的內容。",
        ],
        code: {
          label: "有界的產品研究知識工作流",
          code: "wenlan status\nwenlan sources add ~/Research/product-notes\n/distill <產品決策>\n/pages <產品決策>\n/lint\n/curate",
        },
      },
      {
        heading: "證據可檢查後才開始寫 PRD",
        body: [
          "PRD 可以整理證據庫，但不應用流暢文字遮住證據。審查前確認每個需求都有來源路徑或明確的未解標記，每個重要假設都有負責人或下一個檢查，每個過往決策仍符合目前的來源集合。",
          "即使不使用 Wenlan，這仍是一套實用的產品研究方法：小型證據登錄表、需求到來源的對照、矛盾記錄、假設清單與決策歷史，都能讓審查者重做判斷。",
        ],
      },
      {
        heading: "知道這個工作流不會自動化什麼",
        body: [
          "Wenlan 不會轉錄會議、遮蔽個人識別資訊、招募研究參與者、匯入分析資料、連接 Jira、Linear、Slack 或 CRM，也不會自動排序機會、產生完整 PRD、選擇路線圖或聲稱產品結果。這些決策與控制仍需要維護中的來源和人工審查。",
          "它也不能讓沒有依據的要求變成事實。保持來源、主張、日期、限制與審查狀態可見，讓 Agent 協助整理證據，但不要取代產品團隊的判斷。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 能把使用者研究直接變成 PRD 嗎？",
        answer:
          "不能。它能協助維護有來源的證據庫，以及從核准筆記到可追溯需求的對照；產品經理和研究員仍須解讀證據、處理優先順序，並撰寫和核准 PRD。",
      },
      {
        question: "訪談筆記和客服要求互相矛盾時怎麼辦？",
        answer:
          "保留兩個有日期的來源，說明各自範圍，並記錄矛盾或待解問題。不要把客服要求、使用者觀察和產品決策合併成一個沒有依據的需求。",
      },
      {
        question: "這會連接 Jira、Linear、Slack 或 CRM 嗎？",
        answer:
          "不會。請使用支援的 Markdown、文字、可擷取文字的 PDF、資料夾或唯讀 Obsidian 來源，並明確維護你獲准使用的匯出檔或筆記。",
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
        label: "Wenlan 支援的文件來源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan 有來源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Wenlan 審查與信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "Wenlan 日常工作流",
        href: "https://github.com/7xuanlu/wenlan#daily-workflow",
      },
    ],
    cta: {
      heading: "讓一個產品決策可追溯",
      body: "從核准的來源集合開始，把需求連到有日期的證據，並在 PRD 審查前保留矛盾與待解問題。",
    },
  },
  "build-sre-incident-knowledge-base": {
    slug: "build-sre-incident-knowledge-base",
    eyebrow: "SRE 知識工作流",
    category: "Workflows",
    title: "建立 SRE 事故知識庫：整理 runbook 與事故復盤",
    description:
      "把 runbook、事故復盤與核准的事件筆記整理成有來源、可審查且不會默默過期的值班知識。",
    metaTitle: "建立 SRE 事故知識庫與 runbook 工作流 | Wenlan",
    metaDescription:
      "用 runbook 與事故復盤建立有來源的 SRE 事故知識庫，保留修訂、驗證訊號、過期狀態與安全邊界。",
    keywords: [
      "SRE 事故知識庫",
      "runbook 知識庫",
      "事故復盤 知識沉澱",
      "值班操作知識",
      "SRE runbook 維護",
      "事件後知識整理",
    ],
    publishedAt: "2026-08-29",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "9 分鐘閱讀",
    audience: "維護 runbook、事故復盤與值班知識的 SRE、平台工程與 on-call 團隊",
    heroBullets: [
      "用一個服務、環境與事故類型固定來源邊界。",
      "讓診斷步驟、緩解限制與驗證訊號回到目前 runbook 或事故復盤。",
      "每次事故或系統變更後審查過期步驟，不讓舊建議默默留在值班流程。",
    ],
    productEvidence: {
      heading: "信任 runbook 前，先檢查來源與審查狀態",
      summary:
        "這是 Wenlan App 確定性測試資料的真實桌面畫面，不是事故或客戶工作區。畫面顯示有來源數量的 Pages 與審查佇列；SRE 可以用相同介面讓來源變動與未解衝突保持可見。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 畫面，顯示有來源數量的 Pages，以及來源衝突與新證據的審查佇列。",
        caption:
          "Wenlan App 確定性測試資料的真實畫面。這是一般產品範例，不是正式站事故證據；來源數量與審查狀態仍可直接檢查。",
        width: 1586,
        height: 992,
      },
      workflow: [
        {
          label: "固定事故知識邊界",
          detail: "選定一個服務、環境、事故類型與核准來源，不匯入不受控的操作檔案庫。",
        },
        {
          label: "整理可審查的 runbook Page",
          detail: "保存症狀、證據、唯讀檢查、緩解限制、停止條件與驗證訊號，並連回目前來源。",
        },
        {
          label: "事故或變更後再驗證",
          detail: "檢查引用修訂、stale 狀態與未解衝突，再於核准的非生產環境演練。",
        },
      ],
      artifactHeading: "事故知識封包範例",
      artifactNote: "這是審查欄位的結構範例，請以一個服務與事故類型的核准證據取代每一列。",
      artifactRows: [
        {
          label: "證據輸入",
          detail: "目前 runbook、有日期的事故復盤、架構筆記或去識別事件摘要，並附負責人與修訂。",
        },
        {
          label: "操作主張",
          detail: "一個症狀、診斷步驟、緩解邊界或驗證訊號，連到確切支持段落。",
        },
        {
          label: "審查結果",
          detail: "目前有效、互相矛盾、已過期、不安全或仍未解，並記錄服務版本、環境、審查者與下次測試。",
        },
      ],
      action: {
        label: "查看事故證據工作流",
        href: "#product-evidence",
      },
    },
    sections: [
      {
        heading: "先回答：一個事故類型維護一份可重做的知識",
        body: [
          "每個服務或操作邊界建立一份事故知識庫。只加入核准的 runbook、事故復盤、架構筆記與去識別事件摘要；維護症狀、前置條件、唯讀診斷、緩解限制、停止條件、驗證訊號、負責人與審查日期。",
          "Wenlan 能讓支援的文件連到有來源 Pages、引用、修訂、stale 狀態、lint 與人工審查。它不會監控正式環境、接收告警、匯入即時 telemetry、執行 runbook、核准變更或取代事故管理系統。",
        ],
      },
      {
        heading: "事故穩定後，再整理來源",
        body: [
          "從一個服務、環境與事故類型開始。把即時監控、原始 log、憑證、客戶資料與變更核准留在專用系統，只把經核准且可引用的文件加入來源邊界。",
          "保存每份來源的日期、修訂、負責人與適用環境。把觀察事實、假設、緩解措施與確認原因分開，不要為了寫出順暢摘要而把多個 contributing factors 壓成一個原因。",
        ],
      },
      {
        heading: "建立事故到 runbook 的審查閉環",
        body: [
          "每次事故或系統變更後，只刷新受影響的知識，並讓負責人重新驗證步驟。",
        ],
        bullets: [
          "記錄服務、環境、事故類型、來源修訂與知識負責人。",
          "保存症狀、適用條件、唯讀檢查、風險、停止條件與驗證訊號。",
          "來源或系統改變時，先把受影響內容標成 stale。",
          "在 staging 或 tabletop 演練中測試步驟、連結、預期輸出與回復方式。",
          "值班使用前打開確切來源；檢索到 runbook 不等於獲准執行正式變更。",
        ],
        code: {
          label: "完成 Wenlan 與 AI 客戶端設定後",
          code: "wenlan status\nwenlan sources add ~/Ops/approved-incident-knowledge\n/distill <服務與事故類型>\n/pages <服務事故 runbook>\n/lint\n/curate",
        },
      },
      {
        heading: "保留正式操作的安全邊界",
        body: [
          "監控、告警分派、telemetry、事故指揮、權限、變更核准、rollback 執行與緊急存取仍應留在專用系統。Wenlan 不會對正式環境驗證命令，也不能保證 runbook 安全。",
          "操作前由具名負責人核對服務版本、環境、權限、風險、預期輸出、停止條件與 rollback。這份知識提供可檢查情境，不是自動執行授權。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 會監控事故或自動執行修復命令嗎？",
        answer: "不會。Wenlan 不接收告警、不匯入即時 telemetry、不執行 runbook，也不取代監控與事故管理系統。",
      },
      {
        question: "如何避免過期 runbook 誤導值班工程師？",
        answer: "為每個 Page 保存來源修訂、服務與環境範圍、負責人、審查日期、預期訊號與停止條件。來源或系統改變後先標成 stale，直到核准演練重新驗證。",
      },
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
        label: "Wenlan 支援的文件來源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan 審查與信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "Microsoft Azure SRE Agent 知識文件教學",
        href: "https://learn.microsoft.com/zh-tw/azure/sre-agent/tutorial-upload-knowledge-document",
      },
      {
        label: "AWS 失敗調查 playbook 指南",
        href: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_testing_resiliency_playbook_resiliency.html",
      },
      {
        label: "Operate First 事故與 postmortem 流程",
        href: "https://github.com/operate-first/sre/blob/main/process/incident_management.md",
      },
    ],
    cta: {
      heading: "讓一個事故教訓能被重做",
      body: "選定一個服務與事故類型，連接目前 runbook 與事故復盤，再於下一次值班前審查每個操作主張。",
    },
  },
  "build-competitive-intelligence-knowledge-base": {
    slug: "build-competitive-intelligence-knowledge-base",
    eyebrow: "競品研究工作流",
    category: "Workflows",
    title: "如何建立有來源依據的競品研究知識庫",
    description:
      "用有界的來源登錄表、日期與修訂，整理可審查的競品研究，讓過期主張與矛盾保持可見。",
    metaTitle: "如何建立有來源依據的競品研究知識庫 | Wenlan",
    metaDescription:
      "從獲准的文件、產品手冊與 release notes 建立競品研究知識庫，保留來源日期、修訂、過期主張與人工審查。",
    keywords: [
      "競品分析知識庫",
      "競品研究知識庫",
      "競爭情報資料整理",
      "競品資料更新",
      "有來源的競品研究",
      "AI 知識庫產品研究",
    ],
    publishedAt: "2026-08-30",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "9 分鐘閱讀",
    audience: "維護競品證據的產品行銷經理、創業者，以及產品、策略或市場研究員",
    heroBullets: [
      "先從一個決策與有限的競品集合開始，不建立未審查的市場資料庫。",
      "為每個來源保留日期、修訂、範圍與下次審查時間，讓過期主張可見。",
      "在 battlecard 或產品決策使用前，分開觀察、解讀、假設與未知。",
    ],
    sections: [
      {
        heading: "先說結論：一個決策配一份有界的競品檔案",
        body: [
          "為一個產品問題、競品檢視或定位更新建立一份競品檔案。只加入你已取得且獲准使用的產品文件、使用手冊、release notes、研究筆記或唯讀 Obsidian 來源，並記錄來源、日期、修訂、範圍與審查負責人。",
          "Wenlan 可以把支援的 Markdown、文字、可擷取文字的 PDF、資料夾與唯讀 Obsidian 來源，連到有來源的 Pages、引用、修訂、過期狀態、lint 與人工審查。它不會爬取競品網站、抓取評論、監控即時價格、發現競品、發送告警、評分產品、提出建議，也不替你做法律或商業決策。",
        ],
      },
      {
        heading: "競品研究為什麼會過期",
        body: [
          "試算表或 battlecard 常把競品事實、研究員推論與團隊假設混在一起。當文件、產品頁或版本變更，沒有人知道哪一句來自哪一個修訂；流暢的 AI 摘要還可能把缺少證據的推論寫得像事實。",
          "有用的競品研究知識庫保留小而可檢查的證據鏈。研究員能分辨觀察、解讀、假設、矛盾與未知，也能看出哪項主張需要重新檢查。即使不使用 Wenlan，來源登錄表和這些分類仍然有用。",
        ],
      },
      {
        heading: "建立一份可審查的競品檔案",
        body: [
          "先寫下檢視問題、競品集合、日期範圍、來源類型與排除項目。比較同一個產品問題時，盡量使用相同來源類型；證據不足時標為未知，不要用泛泛的市場語言填滿空白。",
        ],
        bullets: [
          "來源登錄：保存 URL 或檔案、發布或存取日期、版本、競品、範圍、權威性、允許用途與下次審查日期。",
          "主張分類：把每句重要話分成觀察、解讀、假設、矛盾或未知，並連到確切段落。",
          "變更追蹤：來源或 release 改變時，只重新同步受影響的來源，把依賴它的主張標為過期或矛盾。",
          "使用前審查：打開來源、確認範圍與修訂，再把結果帶入 battlecard、定位更新或產品決策。",
        ],
        code: {
          label: "有界的競品證據工作流",
          code: "wenlan status\nwenlan sources add ~/Research/competitors\n# 在 Wenlan plugin client 中：\n/distill <競品研究問題>\n/pages <競品主題>\n/lint\n/curate",
        },
      },
      {
        heading: "Wenlan 能做什麼，以及不能做什麼",
        body: [
          "Wenlan 能整理獲准的來源，維護有來源的 Page，並讓引用、修訂、過期狀態、矛盾與審查保持可見。支援的輸入包括 Markdown、文字、可擷取文字的 PDF、資料夾與唯讀 Obsidian；自訂整合也可以傳入你已準備好的網頁內容。",
          "這不是自動化的市場情報系統。Wenlan 不會爬取或抓取競品網站、不會監控即時網站、價格或評論、不會發現競品、執行告警、評分產品或自動產生建議。請由負責人確認資料權限、公共事實、日期與策略結論。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 會監控競品或追蹤即時價格嗎？",
        answer:
          "不會。Wenlan 不會爬取或抓取競品網站、不會監控即時價格或評論、不會發現競品，也不會發送告警。只加入你獲准使用的支援來源，再自行檢查日期與範圍。",
      },
      {
        question: "可以讓 AI Agent 自動寫出最後的競品建議嗎？",
        answer:
          "不應該。Wenlan 能整理有來源的觀察、顯示過期或互相矛盾的主張，但負責任的人仍要解讀證據，並作出產品、定位、法律或商業決策。",
      },
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
        label: "Wenlan 支援的文件來源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan 有來源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Wenlan 審查與信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "How to Build a Competitive Intelligence Program",
        href: "https://www.aqute.com/blog/build-competitive-intelligence-program",
      },
      {
        label: "競爭情報資料來源（臺灣行銷研究）",
        href: "https://tmrmds.co/article-business/21696/",
      },
      {
        label: "競品調研 workflow 案例（人人都是產品經理）",
        href: "https://www.woshipm.com/pd/6395378.html",
      },
    ],
    productEvidence: {
      heading: "使用競品檔案前先檢查證據與審查狀態",
      summary:
        "這是真實的 Wenlan 桌面畫面，來自 App 的確定性測試 fixture，不是競品或客戶資料。它顯示帶有來源數量的維護型 Pages 與審查佇列；同樣的產品介面可用來讓來源變化和未解決證據保持可見。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 顯示帶有來源數量的維護型 Pages，以及來源衝突和新證據的審查佇列。",
        caption:
          "Wenlan App 確定性測試 fixture 的真實畫面。這是通用產品示例，不是競品研究證據；來源數量與審查狀態仍可直接檢查。",
        width: 1586,
        height: 992,
      },
      workflow: [
        {
          label: "固定研究問題邊界",
          detail: "選定一個決策、產品問題、競品集合、時間範圍與獲准來源，不要匯入不受控的市場資料庫。",
        },
        {
          label: "整理有來源的競品檔案",
          detail: "把觀察、解讀、矛盾、過期主張與未知連到有日期的來源修訂，放在可維護的 Page 中。",
        },
        {
          label: "重用前先審查",
          detail: "打開引用段落，確認範圍與修訂，再把仍未解決的證據留在 battlecard 或產品決策旁。",
        },
      ],
      artifactHeading: "競品證據封包示例",
      artifactNote:
        "這是產品無關的結構示例，不代表任何競品。請用正在審查的決策中獲准且有日期的證據替換每一列。",
      artifactRows: [
        {
          label: "證據輸入",
          detail: "產品文件、手冊、release note 或研究筆記，附來源位置、修訂、範圍與允許用途狀態。",
        },
        {
          label: "主張分類",
          detail: "觀察、解讀、假設、矛盾或未知，連到確切段落，不只保留一段潤飾過的摘要。",
        },
        {
          label: "審查結果",
          detail: "目前有效、過期、互相矛盾或仍未解決，並記錄審查人、下次檢查與決策情境。",
        },
      ],
      action: {
        label: "查看證據審查工作流",
        href: "#product-evidence",
      },
    },
    cta: {
      heading: "讓一個競品決策可追溯",
      body: "選定有界問題，連接獲准來源，並在 battlecard 或產品決策使用前審查每個重要主張。",
    },
  },
  "build-ict-supplier-due-diligence-evidence-pack": {
    slug: "build-ict-supplier-due-diligence-evidence-pack",
    eyebrow: "供應商審查工作流",
    category: "Workflows",
    title: "如何建立 ICT 供應商資安盡職調查證據包",
    description:
      "把核准的軟體供應商文件整理成可追溯的證據包，清楚標示來源、適用範圍、缺口、負責人與複審日期。",
    metaTitle: "建立 ICT 供應商資安盡職調查證據包 | Wenlan",
    metaDescription:
      "建立軟體供應商資安盡職調查證據包，保存文件來源、服務範圍、風險缺口、待確認事項與複審日期。",
    keywords: [
      "ICT 供應商資安盡職調查",
      "軟體供應商資安評估",
      "供應商風險評估問卷",
      "資通服務採購資安佐證",
      "第三方供應商風險評估",
      "供應商資安證據包",
    ],
    publishedAt: "2026-08-30",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "9 分鐘閱讀",
    audience: "在採購或續約前審查單一 ICT 或軟體供應商的採購、資安與 IT 負責人",
    heroBullets: [
      "讓每個供應商主張都連回核准文件、日期、修訂與適用服務範圍。",
      "分開記錄資料存取、營運韌性、資安佐證、依賴關係與尚未回答的問題。",
      "為證據包指定負責人與複審日期，不把舊問卷答案當成永久事實。",
    ],
    sections: [
      {
        heading: "先說結論：一次審查只處理一個供應商與服務範圍",
        body: [
          "先固定供應商、產品或服務、採購或續約決策、資料存取範圍、審查人員與核准來源。證據包至少要記錄來源文件、修訂、適用範圍、韌性與資安佐證、相依服務、缺口、待確認事項、負責人與複審日期。",
          "無法由來源支持或已過期的主張要明確標為未驗證。最後的採購判斷仍由組織內的採購、資安、法務與隱私負責人依既有制度作出。",
        ],
      },
      {
        heading: "把問卷、政策與架構文件拆成可檢查的證據",
        body: [
          "供應商審查常把現行資安政策、舊問卷、架構圖、驗證聲明與郵件補充混在同一張表。若沒有日期與適用範圍，摘要再流暢也無法回答某項控制是否適用於正在採購的服務。",
        ],
        bullets: [
          "建立來源登錄：保存文件名稱、版本、日期、提供者、適用服務與允許使用範圍。",
          "逐項記錄主張：連到確切段落，分開供應商陳述、審查者解讀、殘餘風險、矛盾與缺件。",
          "標示資料與系統存取：記錄資料類型、權限、儲存位置、保留方式與次處理者或關鍵依賴。",
          "設定複審：來源或服務範圍改變時，先把依賴該證據的結論標為過期，再交由具名負責人確認。",
        ],
        code: {
          label: "有界的供應商證據工作流",
          code: "wenlan status\nwenlan sources add ~/Reviews/approved-supplier-docs\n# 在 Wenlan plugin client 中：\n/distill <供應商與審查範圍>\n/pages <供應商證據包>\n/lint\n/curate",
        },
      },
      {
        heading: "一份可複審的供應商證據包應包含什麼",
        body: [
          "把每一項內容標為目前有效、過期、互相矛盾、缺乏支持或待補件，並保留證據負責人、審查者、相依服務與下次複審日期。問卷答案只能算供應商提供的一項主張，不能直接等同控制已有效落實。",
          "即使不使用 Wenlan，這份來源登錄、缺口清單與複審欄位仍可作為採購會議中的獨立工作產物。",
        ],
      },
      {
        heading: "Wenlan 的能力與安全邊界",
        body: [
          "Wenlan 能把核准的 Markdown、文字、可擷取文字的 PDF、資料夾與唯讀 Obsidian 來源，整理成有來源的 Pages，並顯示引用、修訂、過期狀態、lint 與人工審查。",
          "Wenlan 不會驗證認證真偽、不提供法律或隱私意見、不發現供應商、不爬取網站、不做即時監控或弱點掃描、不自動評分，也不核准或拒絕採購。敏感文件仍須留在組織核准的存取控制中。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 可以驗證供應商認證或直接核准採購嗎？",
        answer:
          "不可以。Wenlan 不驗證認證、不評分供應商，也不做採購決策；它只讓核准文件、主張、缺口、修訂與審查狀態可追溯。",
      },
      {
        question: "完成供應商風險評估問卷就足夠嗎？",
        answer:
          "不夠。每個答案都要附來源、日期、適用範圍、負責人與支持文件；缺乏佐證、互相矛盾或已過期的答案必須明確標示。",
      },
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
        label: "Wenlan 支援的文件來源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan 有來源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Wenlan 審查與信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "NIST SP 1326 ICT 供應商盡職調查指南",
        href: "https://www.nist.gov/publications/nist-cybersecurity-supply-chain-management-due-diligence-assessment-quick-start-guide",
      },
      {
        label: "臺灣資安服務廠商評鑑機制（NICS）",
        href: "https://www.nics.nat.gov.tw/core_business/information_security_information_sharing/Cybersecurity_Service_Provider_Evaluation/",
      },
    ],
    productEvidence: {
      heading: "重用供應商主張前，先檢查來源與審查狀態",
      summary:
        "這是 Wenlan App 確定性測試資料的真實桌面畫面，不是供應商或客戶工作區。畫面顯示有來源數量的 Pages 與審查佇列，可用同一介面讓來源變動與未解證據保持可見。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 顯示有來源數量的 Pages，以及來源衝突與新證據的審查佇列。",
        caption:
          "Wenlan App 確定性測試資料的真實畫面。這是一般產品範例，不是供應商資安證據。",
        width: 1586,
        height: 992,
      },
      workflow: [
        { label: "固定審查邊界", detail: "選定一個供應商、服務、決策、核准來源與具名審查人員。" },
        { label: "建立有引用的證據登錄", detail: "把修訂、資料存取、韌性、資安佐證、依賴、缺口與問題連到確切來源。" },
        { label: "決策前複審", detail: "打開引用段落，檢查過期或矛盾證據，再由採購、資安、法務與隱私負責人判斷。" },
      ],
      artifactHeading: "供應商證據包範例",
      artifactNote: "這是中立的審查結構，不是認證或採購結論。請以單一供應商與服務範圍的核准證據替換每一列。",
      artifactRows: [
        { label: "證據輸入", detail: "政策、架構或資料流程文件、韌性計畫、問卷、次處理者清單或有日期的補充說明。" },
        { label: "審查陳述", detail: "供應商主張、審查解讀、殘餘風險、矛盾、缺件或待確認問題，連到確切段落。" },
        { label: "審查狀態", detail: "目前有效、過期、矛盾、缺乏支持或待處理，附負責人、審查者與複審日期。" },
      ],
      action: { label: "查看供應商證據工作流", href: "#product-evidence" },
    },
    cta: {
      heading: "讓一次供應商審查可追溯",
      body: "選定一個供應商與服務範圍，連接核准證據，並在決策會議前保留所有過期或缺乏支持的主張。",
    },
  },
  "build-customer-support-answer-knowledge-base": {
    slug: "build-customer-support-answer-knowledge-base",
    eyebrow: "客服回答工作流",
    category: "Workflows",
    title: "如何建立客服答案知識庫：讓支援回答可追溯",
    description:
      "產品或政策變更後，用核准來源、適用範圍、不可承諾、轉人工條件、負責人與複審日期維護可檢查的客服答案。",
    metaTitle: "建立客服答案知識庫與可追溯回答 | Wenlan",
    metaDescription:
      "從核准的產品與政策文件建立客服答案知識庫，保留問題、支持的回答、適用範圍、不可承諾、轉人工條件、來源修訂、負責人與複審日期。",
    keywords: [
      "客服知識庫",
      "客服話術知識庫",
      "客服知識庫更新",
      "客服答案管理",
      "有來源客服回答",
      "客服內容審查工作流",
    ],
    publishedAt: "2026-08-31",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "維護核准客服回答的客服營運、技術寫作者、產品支援與客戶成功內容負責人",
    heroBullets: [
      "先從一項核准的產品或政策變更，以及受影響的客服問題開始。",
      "記錄支持的回答、適用範圍、不可承諾、轉人工條件、來源修訂、負責人與下次複審日期。",
      "讓過期或缺乏支持的回答留在人工審查中，不自動發布或回覆客戶。",
    ],
    sections: [
      {
        heading: "先說結論：一個客服問題配一筆可審查答案",
        body: [
          "為一個支援主題和一組核准的產品或政策文件建立答案知識庫。每個客服問題都要記錄支持的回答、適用範圍、不可承諾、需要轉人工的條件、來源修訂、具名負責人與下次複審日期；來源改變時，先把相關回答標為過期或未解決。",
          "Wenlan 可以把核准的 Markdown、文字、可擷取文字的 PDF、資料夾與唯讀 Obsidian 來源連到有來源的 Pages、引用、修訂、過期狀態、lint 與人工審查。它不會導入客服工單、CRM 紀錄或原始客戶對話，也不會處理個資、連接支援渠道、發布面向客戶的答案、產生回覆、同步渠道或自動轉人工。",
        ],
        link: {
          label: "查看客服答案證據工作流",
          href: "#product-evidence",
        },
      },
      {
        heading: "產品或政策變動時，為什麼答案會失效",
        body: [
          "產品發布或政策異動後，原本聽起來合理的回答可能已不符合適用方案、生效日期、例外條件或承諾邊界。若共用文件或潤飾過的 AI 摘要沒有保留來源修訂，就很難知道哪一句仍受支持、哪一句需要負責人重審。",
          "可重用的客服內容應把問題、回答、範圍、不可承諾與轉人工條件拆開；支持不足時保留未知，不用流暢文字補齊答案。即使不使用 Wenlan，這份欄位清楚的答案登錄也能作為獨立的內容審查成果。",
        ],
      },
      {
        heading: "建立一個問題到回答的審查閉環",
        body: [
          "先選一個客服主題與少量核准文件，讓每一筆答案都能回到確切來源段落。把原始來源的說法、內容負責人的解讀、不能承諾的事項與必須交給人的例外分開保存。",
        ],
        bullets: [
          "寫下產品或政策主題、生效日期、客服讀者、納入文件、排除資料與內容負責人。",
          "登錄核准的 Markdown、文字、可擷取文字 PDF、資料夾或唯讀 Obsidian 來源，保存標題、日期、修訂與適用範圍。",
          "每個常見問題建立一筆答案紀錄，分開支持的回答、適用範圍、不可承諾、例外與轉人工條件。",
          "把重要回答連回確切來源段落，並在紀錄旁保留來源修訂。",
          "產品或政策變更後重新同步受影響來源，把相關答案標為過期或未解決，直到負責人檢查新修訂。",
          "重用前由負責人打開來源，確認範圍與生效日期，再寫下下次複審日期；這個工作流不發布答案，也不傳送回覆。",
        ],
        code: {
          label: "完成 Wenlan 與 AI 客戶端設定後",
          code: "wenlan status\nwenlan sources add ~/Support/approved-product-policy\n# 在 Wenlan plugin client 中：\n/distill <客服答案主題>\n/pages <客服答案主題>\n/lint\n/curate",
        },
      },
      {
        heading: "客服答案紀錄應該記什麼？",
        body: [
          "下面的中立範本把一個可回答的問題與它的限制放在同一筆紀錄。答案不是承諾；只有來源和負責人確認後，才可以在適用範圍內重用。",
        ],
        code: {
          label: "中立的客服答案紀錄範本",
          code: "question: 現有訂閱可以立即更換方案嗎？\nsupported_answer: <核准政策真正支持的回答>\nscope: <方案、地區、帳戶狀態與生效日期>\ndo_not_promise: <來源沒有授權的動作或結果>\nescalate_when: <必須交給人工負責人的條件>\nsource_revision: <文件 ID、段落與修訂>\nowner: <內容負責人>\nnext_review: <日期或產品變更觸發條件>",
        },
      },
      {
        heading: "知道這個工作流不會自動化什麼",
        body: [
          "Wenlan 不會處理個資或宣稱替你遮蔽個資，不提供團隊權限，不做客服分析，不自動核准政策，不會發布面向客戶的答案，不會自動回覆或傳送回覆，不會同步 LINE、Email 或其他渠道，也不會自動轉人工。內容負責人仍要判斷來源是否適用、答案能否重用，以及何時需要交給適當的人。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 會導入客服工單或替我發送回覆嗎？",
        answer:
          "不會。這個工作流只使用你能檢查的核准文件；Wenlan 不會導入客服工單、CRM 紀錄或原始客戶對話，也不會發布、產生、傳送或同步客戶回覆。",
      },
      {
        question: "產品或政策變更後，舊客服答案應該怎麼辦？",
        answer:
          "重新同步核准來源，把受影響答案標為過期或未解決，再由具名負責人檢查目前段落、適用範圍、不可承諾、轉人工條件、來源修訂與下次複審日期。",
      },
    ],
    relatedSlugs: [
      "build-local-ai-knowledge-base-from-documents",
      "verify-ai-knowledge-base-citations",
      "test-ai-knowledge-base-retrieval-after-changes",
    ],
    officialReferences: [
      {
        label: "Wenlan 支援的文件來源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan sources add CLI",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-cli/README.md#wenlan-sources-add-path",
      },
      {
        label: "Wenlan 有來源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Wenlan 審查與信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
    ],
    productEvidence: {
      heading: "重用回答前先檢查來源與審查狀態",
      summary:
        "這是 Wenlan App 確定性測試資料的真實桌面畫面，不是客服工作區或客戶對話。畫面顯示有來源數量的 Pages 與審查佇列，可用同一產品介面讓來源變動與未解證據保持可見。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 顯示有來源數量的 Pages，以及來源衝突與新證據的審查佇列。",
        caption:
          "Wenlan App 確定性測試資料的真實畫面。這是一般產品範例，不是客服證據；來源數量與審查狀態仍可直接檢查。",
        width: 1586,
        height: 992,
      },
      workflow: [
        {
          label: "固定答案範圍",
          detail: "選定一個客服主題、核准來源、生效日期與內容負責人，再開始整理回答。",
        },
        {
          label: "整理有引用的答案紀錄",
          detail: "把問題、支持的回答、適用範圍、不可承諾、轉人工條件、來源修訂與下次複審連到確切來源。",
        },
        {
          label: "重用前先審查",
          detail: "打開引用段落，檢查過期或矛盾證據，並把發布或回覆傳送留在本工作流之外。",
        },
      ],
      artifactHeading: "客服答案紀錄示例",
      artifactNote:
        "這是中立範本，不是對任何客戶的承諾。重用前請以核准來源和具名內容負責人替換每個欄位。",
      artifactRows: [
        {
          label: "問題與回答",
          detail: "一個客服問題，以及核准產品或政策來源真正支持的最短回答。",
        },
        {
          label: "範圍與邊界",
          detail: "適用方案、地區、帳戶狀態、生效日期、不可承諾、例外與需要轉人工的條件。",
        },
        {
          label: "審查與負責人",
          detail: "來源文件與修訂、內容負責人、目前審查狀態，以及下次複審日期或產品變更觸發條件。",
        },
      ],
      action: {
        label: "查看客服答案證據工作流",
        href: "#product-evidence",
      },
    },
    cta: {
      heading: "讓一個客服答案可審查",
      body: "選定核准的產品或政策來源，記錄一個有界回答，並在重用前讓修訂、負責人、限制與下次複審保持可見。",
    },
  },
  "build-course-wiki-from-lecture-notes": {
    slug: "build-course-wiki-from-lecture-notes",
    eyebrow: "課程 Wiki 工作流",
    category: "Workflows",
    title: "把課堂講義與 PDF 整理成課程 Wiki",
    description:
      "把一門課的可讀講義、課件與 PDF 整理成有來源的課程 Wiki，保留概念、先備知識、來源修訂與複核狀態。",
    metaTitle: "課堂講義與 PDF 如何整理成課程 Wiki | Wenlan",
    metaDescription:
      "從課堂講義、課件與可擷取文字的 PDF 建立有來源課程 Wiki，維護概念頁、先備知識、引用、來源修訂與複核狀態。",
    keywords: [
      "把課堂講義整理成 AI 知識庫",
      "講義 PDF 轉學習筆記",
      "學生 LLM Wiki",
      "課程 Wiki",
      "可追溯學習筆記",
      "課件知識庫",
    ],
    publishedAt: "2026-08-31",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "已有一門課的可讀課堂講義、課件或 PDF，想維護可檢查學習 Wiki 的學生、自學者與教師",
    heroBullets: [
      "先固定一門課與一組有權使用的可讀課程資料。",
      "每個概念各自成頁，連回確切來源與先備知識。",
      "記錄來源修訂與複核狀態，避免課件改版後筆記仍看似正確。",
    ],
    sections: [
      {
        heading: "先說結論：一個概念配一頁與一組確切來源",
        body: [
          "先為一門課建立明確來源邊界，登錄可讀的課堂講義、筆記與可擷取文字 PDF，再把每個可重用概念維護成獨立頁面。每頁都要回答一個問題、列出先備知識、引用確切講次或頁碼、記錄來源修訂，並標示目前有效、過期、矛盾或待複核。",
          "Wenlan 可以同步支援的文件來源、建立有來源 Pages、保留引用與 wikilink、顯示過期依賴並留下可審查修訂。它不等同 NotebookLM，不會產生單字卡、不會自動出題、不會轉錄音訊、不會執行 OCR、不會評分、不會當家教、不會解題，也不會規劃考試。",
        ],
        link: { label: "查看課程 Wiki 證據工作流", href: "#product-evidence" },
      },
      {
        heading: "為什麼一份大摘要很快就會過期",
        body: [
          "一個定義可能在第二週講義，先備概念在第一週，修正在後續課件，例外又藏在閱讀筆記裡。一次性摘要會把這些關係壓成流暢文字，也可能在教師更新來源後繼續保留舊答案。",
          "可維護的課程 Wiki 應該讓概念、來源與修訂保持分離，讓學習者能看出哪一段受哪份資料支持，以及哪一頁需要重新複核。即使不用 Wenlan，這種結構也能作為獨立、可檢查的學習成果。",
        ],
      },
      {
        heading: "建立課程資料到概念頁的閉環",
        body: [
          "先用少量資料驗證流程。只納入你有權儲存與閱讀的內容，並指定課程版本、學期、來源擁有者、排除資料與複核人員。",
        ],
        bullets: [
          "登錄 Markdown、文字與可擷取文字的 PDF；掃描或純圖片 PDF 先在外部完成 OCR，再人工核對文字。",
          "每個概念頁只回答一個穩定問題，不要把整門課壓成一份巨型摘要。",
          "明確連結先備知識、相鄰概念、矛盾說法、例題與尚未解決的問題。",
          "每個重要主張附上講次、頁碼、段落或 source ID，並保存學期、檔案版本或資料日期。",
          "講義或課件更新後重新同步，把受影響概念標為過期或待複核，再打開新來源確認。",
          "最後執行 lint 與人工審查；來源不足時保留未知，不用 AI 自動補答案。",
        ],
        code: {
          label: "完成 Wenlan 與 AI 客戶端設定後",
          code: "wenlan status\nwenlan sources add ~/Courses/distributed-systems/materials\n# 在 Wenlan plugin client 中：\n/distill <課程概念>\n/pages <課程概念>\n/lint\n/curate",
        },
      },
      {
        heading: "概念頁應該記錄什麼",
        body: [
          "下面的中立範本不是答案卡，而是一筆可檢查的學習紀錄。每個欄位都要回到有權使用的課程資料與具名複核人員。",
        ],
        code: {
          label: "中立的課程概念紀錄",
          code: "concept: leader election\nquestion: 為什麼同一個 term 不能長期存在兩個 leader？\nprerequisites: term；quorum intersection\nanswer: <目前課程資料真正支持的短答>\nsources: <講次、投影片或頁碼與 source ID>\nsource_revision: <學期、檔案修訂或資料日期>\nreview_state: <目前有效｜過期｜矛盾｜未解>\nreviewer: <學生或教師>\nnext_review: <來源變更觸發條件或日期>",
        },
      },
      {
        heading: "知道這不是 AI 家教或考試工具",
        body: [
          "這個工作流只整理有來源的課程概念。Wenlan 不會製作單字卡或測驗，不會轉錄影音，不會對掃描檔執行 OCR，不會評分、代寫、解題、預測考題或安排複習進度。學生或教師仍要負責來源權利、理解、學術誠信與最後複核。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 能直接把掃描講義、錄音或影片變成學習筆記嗎？",
        answer: "不能。這個流程使用 Markdown、文字與可擷取文字的 PDF。掃描檔需要外部 OCR，錄音或影片需要外部轉錄，再由你核對結果後才能作為來源。",
      },
      {
        question: "課程 Wiki 等於讀書摘要或 AI 家教嗎？",
        answer: "不等於。課程 Wiki 維護可追溯的概念解釋、先備知識、來源與修訂狀態；它不產生答案卡、不評分、不代寫，也不決定考試重點。",
      },
    ],
    relatedSlugs: [
      "build-local-ai-knowledge-base-from-documents",
      "distilled-wiki-pages-ai-memory",
      "source-backed-research-knowledge-base",
      "verify-ai-knowledge-base-citations",
    ],
    officialReferences: [
      { label: "Wenlan 支援的文件來源", href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in" },
      { label: "Wenlan 有來源 Pages", href: "https://wenlan.app/docs/source-backed-pages" },
      { label: "Wenlan 審查與信任", href: "https://wenlan.app/docs/review-and-trust" },
      { label: "Karpathy 的 LLM-wiki 筆記", href: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f" },
    ],
    productEvidence: {
      heading: "信任概念頁前，先檢查來源與複核狀態",
      summary: "這是 Wenlan App 確定性測試資料的真實桌面畫面，不是學校、課程或學生工作區。畫面顯示有來源數量的 Pages 與審查佇列，可用同一產品介面讓課件修訂與未解證據保持可見。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 顯示有來源數量的 Pages，以及來源變動與矛盾證據的審查佇列。",
        caption: "Wenlan App 確定性測試資料的真實畫面。這是一般產品範例，不是課程資料或學生紀錄。",
        width: 1586,
        height: 992,
      },
      workflow: [
        { label: "固定一門課", detail: "先選定課程、學期、可讀來源、排除資料與具名複核人員。" },
        { label: "整理有連結的概念", detail: "把概念、先備知識、解釋、來源位置、修訂與開放問題放在同一筆可審查紀錄。" },
        { label: "來源變動後再複核", detail: "打開引用講義，檢查過期或矛盾支持，理解目前資料後才更新概念頁。" },
      ],
      artifactHeading: "課程概念紀錄範例",
      artifactNote: "這是中立範本，不是答案卡。請以有權使用的課程資料與具名複核人員替換每個欄位。",
      artifactRows: [
        { label: "概念與問題", detail: "一個可重用概念、它回答的問題，以及目前資料支持的最短解釋。" },
        { label: "先備知識與來源", detail: "必要概念、確切講次或頁碼、source ID、資料日期與來源修訂。" },
        { label: "複核狀態", detail: "目前有效、過期、矛盾或未解，附學生或教師複核人員與下次觸發條件。" },
      ],
      action: { label: "查看課程 Wiki 證據工作流", href: "#product-evidence" },
    },
    cta: {
      heading: "先建立一頁可檢查的課程概念",
      body: "加入一小組核准來源，維護一頁有先備知識與確切來源的概念，再於課件變動後複核。",
    },
  },
  "build-business-metric-definition-knowledge-base": {
    slug: "build-business-metric-definition-knowledge-base",
    eyebrow: "指標定義工作流",
    category: "Workflows",
    title: "建立商業指標定義知識庫",
    description:
      "把核准的 KPI 規格整理成有來源的資料字典，保留公式文字、粒度、維度、排除條件、負責人、來源修訂與複核狀態。",
    metaTitle: "如何建立商業指標定義知識庫與資料字典 | Wenlan",
    metaDescription:
      "從核准檔案建立可複核的指標定義知識庫，記錄公式、粒度、維度、排除條件、負責人、引用、版本與取代關係。",
    keywords: [
      "建立商業指標定義知識庫",
      "資料字典 指標口徑",
      "AI agent 指標定義",
      "KPI 定義範本",
      "商業詞彙表",
      "有來源資料字典",
    ],
    publishedAt: "2026-09-01",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "8 分鐘閱讀",
    audience: "需要為人員與 AI agent 解決 KPI 定義衝突的資料、分析、產品、財務與營運團隊",
    heroBullets: [
      "從核准的指標規格開始，不從儀表板或推測公式開始。",
      "把公式文字、粒度、維度、排除條件、負責人與來源修訂放在同一筆紀錄。",
      "明確取代過期定義，不讓 AI agent 把衝突版本混成一個答案。",
    ],
    sections: [
      {
        heading: "先說結論：一個指標配一筆有來源、可取代的定義紀錄",
        body: [
          "每個商業指標維護一筆可複核紀錄：商業定義、不可執行的公式文字、粒度、維度、納入與排除條件、負責人、確切來源與來源修訂、複核狀態，以及它取代的舊定義。兩份核准來源互相衝突時，先保留衝突並交給具名負責人判斷，不讓 AI 自動調和。",
          "Wenlan 可以讀取核准的 Markdown、文字與可擷取文字 PDF，建立有來源 Pages、保留引用與來源修訂、執行 provenance lint 並留下可審查版本。它不會導入 CSV 或 YAML、不會執行 SQL、不會連接資料倉儲或 BI、不會計算指標、不會提供血緣、不會監控資料品質、不會管理權限、不會自動核准，也不會自動調和衝突。",
        ],
        link: { label: "查看指標定義證據工作流", href: "#product-evidence" },
      },
      {
        heading: "為什麼同名 KPI 仍可能不是同一件事",
        body: [
          "活躍客戶、淨收入或轉換率可能同時出現在財務備忘錄、分析規格、產品儀表板說明與營運手冊，但公式、粒度、時間窗、排除條件或負責人各不相同。把它們整理成一段流暢摘要，反而會隱藏真正需要決策的差異。",
          "可維護的資料字典應該讓每個版本回到確切來源，清楚標記目前有效、過期、矛盾或未解，並在新版核准後保留舊版本與取代關係。即使不用 Wenlan，這也是可獨立採用的指標治理基本紀錄。",
        ],
      },
      {
        heading: "建立核准規格到指標紀錄的閉環",
        body: [
          "先選一組指標與少量核准檔案。這個工作流只負責定義查找與衝突處理，不建立所有資料表、儀表板或即時運算的目錄。",
        ],
        bullets: [
          "先記錄指標名稱、商業問題、核准來源、排除系統、具名負責人與複核人。",
          "只加入核准的 Markdown、文字或可擷取文字 PDF；CSV、YAML、SQL、資料倉儲 metadata 與 API 不在這個流程。",
          "把公式寫成可複核文字，並記錄粒度、維度、時間窗、納入、排除與例外。",
          "每個重要欄位連回 source ID、確切標題或頁碼、來源修訂與生效日期。",
          "來源衝突時保留兩個版本，標成矛盾或未解，不自行平均或合併。",
          "負責人選定目前版本後，記錄取代的舊定義、保留歷史版本並設定下次複核條件。",
        ],
        code: {
          label: "完成 Wenlan 與 AI 用戶端設定後",
          code: "wenlan status\nwenlan sources add ~/Metrics/approved-specifications\n# 在 Wenlan plugin client 中：\n/distill <指標定義>\n/pages <指標名稱>\n/lint\n/curate\n\nmetric: activated customer\nbusiness_definition: <核准來源真正定義的意義>\nformula_text: <不可執行的公式文字>\ngrain: <帳戶 | workspace | 使用者 | 事件>\ndimensions: <允許的拆分維度>\ninclusions: <納入狀態或事件>\nexclusions: <排除狀態、事件或時間窗>\nowner: <負責團隊或複核人>\nsources: <source ID 與確切位置>\nsource_revision: <版本或生效日期>\nreview_state: <目前有效 | 過期 | 矛盾 | 未解>\nsupersedes: <舊定義或無>\nnext_review: <來源變更條件或日期>",
        },
      },
      {
        heading: "指標紀錄應該保留什麼",
        body: [
          "一筆可用紀錄不只是一句定義。它要讓讀者知道公式文字在什麼粒度成立、哪些狀態被排除、誰有權決定目前版本，以及這個版本依據哪份來源。",
        ],
      },
      {
        heading: "知道這不是資料目錄、BI 或計算引擎",
        body: [
          "Wenlan 不會導入 CSV、不會執行 SQL、不會連接資料倉儲、不會同步 BI 或 semantic layer、不會計算 KPI、不會提供欄位血緣、不會監控資料品質、不會管理權限、不會自動核准定義，也不會自動調和衝突公式。具名領域負責人仍要做商業判斷與最終複核。",
        ],
      },
    ],
    faqs: [
      {
        question: "這會連接資料倉儲、BI 或 metric store 嗎？",
        answer: "不會。這個流程使用核准的 Markdown、文字與可擷取文字 PDF。Wenlan 不會探索資料表、不會執行 SQL、不會計算 KPI，也不會同步資料倉儲、BI、semantic layer 或 metric store。",
      },
      {
        question: "兩份核准指標定義互相衝突時怎麼辦？",
        answer: "保留兩份有引用的定義，記錄公式、粒度、排除條件、負責人與來源修訂，並標成矛盾或未解。由具名領域負責人決定哪個版本成為目前定義，並記錄它取代的舊版本。",
      },
    ],
    relatedSlugs: [
      "source-backed-wiki-pages-ai-work",
      "verify-ai-knowledge-base-citations",
      "prevent-multi-agent-knowledge-conflicts",
      "build-investment-research-knowledge-base",
    ],
    officialReferences: [
      { label: "Wenlan 支援的文件來源", href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in" },
      { label: "Wenlan 有來源 Pages", href: "https://wenlan.app/docs/source-backed-pages" },
      { label: "Wenlan 複核與信任", href: "https://wenlan.app/docs/review-and-trust" },
      { label: "台灣資料集詮釋資料標準指引", href: "https://file.data.gov.tw/content/%E8%B3%87%E6%96%99%E9%9B%86%E8%A9%AE%E9%87%8B%E8%B3%87%E6%96%99%E6%A8%99%E6%BA%96%E6%8C%87%E5%BC%95.pdf" },
    ],
    productEvidence: {
      heading: "信任指標前，先檢查來源修訂與複核狀態",
      summary: "這是 Wenlan App 確定性測試資料的真實桌面畫面，不是公司的分析或財務工作區。畫面顯示帶有來源數量的 Pages 與複核佇列，可用同一產品介面讓衝突或修訂後的指標證據保持可見。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 顯示帶有來源數量的 Pages，以及來源變更與矛盾證據的複核佇列。",
        caption: "Wenlan App 確定性測試資料的真實畫面。這是通用產品示例，不是即時資料目錄或公司指標紀錄。",
        width: 1586,
        height: 992,
      },
      workflow: [
        { label: "固定核准規格", detail: "選定一組指標、允許的定義檔、排除系統、具名負責人與複核人。" },
        { label: "整理一筆定義", detail: "把定義、公式文字、粒度、維度、排除條件、引用、來源修訂與衝突放在同一頁。" },
        { label: "複核後再取代", detail: "打開引用來源，檢查矛盾與過期狀態，再標記目前定義並保留被取代版本。" },
      ],
      artifactHeading: "商業指標紀錄示例",
      artifactNote: "這個中立範本不會計算 KPI。請用核准規格與具名領域複核人替換每個欄位。",
      artifactRows: [
        { label: "意義與公式文字", detail: "商業定義、不可執行公式、粒度、維度、納入、排除與例外。" },
        { label: "負責人與來源", detail: "負責人、確切 source ID 與位置、來源修訂和生效日期。" },
        { label: "複核與取代", detail: "目前有效、過期、矛盾或未解，附複核人、被取代版本與下次複核條件。" },
      ],
      action: { label: "查看指標定義證據工作流", href: "#product-evidence" },
    },
    cta: {
      heading: "讓一個指標定義可檢查",
      body: "從核准規格開始，保留衝突與確切來源，只在具名負責人複核後取代舊定義。",
    },
  },
} satisfies Partial<Record<TranslatedLearnSlug, LearnArticle>>;

const zhCNArticles = {
  "prevent-multi-agent-knowledge-conflicts": {
    slug: "prevent-multi-agent-knowledge-conflicts",
    eyebrow: "共享知识维护",
    category: "Workflows",
    title: "多智能体共享知识冲突？避免覆盖与过期结论",
    description:
      "避免多个 AI Agent 覆盖共享知识、采用缺乏证据的主张，或在来源变化后继续使用过期结论。",
    metaTitle: "多智能体共享知识冲突与过期结论 | Wenlan",
    metaDescription:
      "用证据、候选主张、版本检查、人工审核与历史记录，避免多个 AI Agent 传播冲突或过期的共享知识。",
    keywords: [
      "多智能体共享知识冲突",
      "避免共享 AI 知识过期",
      "AI Agent 记忆冲突",
      "多 Agent 知识写入冲突",
      "AI 知识库版本冲突",
      "共享知识来源追踪",
    ],
    publishedAt: "2026-08-24",
    updatedAt: "2026-08-24",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "让多个 coding、研究或运营 Agent 读写同一份项目知识的团队",
    heroBullets: [
      "不要让每个 Agent 直接把输出写成已接受的共享知识。",
      "把原始证据、候选主张与已接受结论分成三种状态。",
      "在接受前发现过期写入、审核矛盾，并保留被取代结论的历史。",
    ],
    sections: [
      {
        heading: "先说结论：Agent 写入只是候选主张",
        body: [
          "多智能体共享知识时，不要采用最后写入者自动胜出的规则。每次写入先保留来源、写入者、适用范围、采集时间与预期版本；只有重新检查当前来源并完成审核后，候选主张才能成为已接受的共享知识。",
          "如果目标版本已经变化，就在调用 `write_page` 前停止流程并重新读取；如果两个结论互相矛盾，就保留冲突，不要用新文字静默覆盖旧历史。",
        ],
      },
      {
        heading: "先分清五种失败",
        body: [
          "共享文件、向量库或记忆服务只能让 Agent 看到同一批数据，不能自动判断哪一条是当前正确的知识。先把失败分类，才能选择版本检查、来源重读或人工审核。",
        ],
        bullets: [
          "覆盖：Agent B 的最后写入把 Agent A 有证据的内容直接盖掉。",
          "过期：Agent 按旧版来源生成结论，写入前来源已经改变。",
          "矛盾：两个主张都看似合理，但内容、范围或时间互不相容。",
          "范围污染：一个 Agent 的项目、角色或个人数据流入不该共享的空间。",
          "假完成：Agent 记录工作已完成，却没有测试、文件或可复现结果。",
        ],
      },
      {
        heading: "使用候选、验证、接受三阶段流程",
        body: [
          "先指定事实或 Page 的权威来源与写入范围。Agent 身份本身不是权威；代码、测试、规格与维护中的第一方文档仍然优先。",
          "审核时回到原始证据，把主张标记为 supported、contradicted、stale、replaced 或 unresolved。信息更新不代表一定正确；证据不足时，保留未解决状态。",
          "下面的斜线命令只适用于已经通过 `/setup` 安装 Wenlan Codex plugin 的 Codex。其他 Agent 可以使用本地 MCP 的 `recall`、`capture`、`distill`、`lint`、`list_pending_revisions`，或本地 CLI 的 `wenlan pages`、`wenlan capture`、`wenlan lint`、`wenlan curate revisions`。",
        ],
        code: {
          label: "Wenlan Codex plugin：检查、保存、整理与审核",
          code: "/pages <共享主题>\n/capture <候选主张 + 来源 + 为什么重要>\n/distill <共享主题>\n/lint\n/curate",
        },
      },
      {
        heading: "Wenlan 能做什么，以及不能做什么",
        body: [
          "Wenlan 把 Sources、原子 Memories 与维护型 Pages 分开。明确取代会保留 supersedes 链；stale Page 可以按当前证据重建；机器要改写人工拥有的内容时，会先成为可审核修订。可选的 Reconcile 流程能把受保护冲突排入审核，但默认关闭。",
          "Wenlan 不是 Agent 调度器、分布式锁服务或自动共识引擎。目前公开的 MCP `write_page` 不接受 `expected_version`，所以这个流程必须在写入前自行重读并比较来源与版本，不能宣称 Wenlan 会原子化拒绝过期的机器 Page 更新。人工拥有的 Page 更新会进入可审核修订；本地 Page refresh 只支持本地 stdio MCP，语义冲突仍要靠来源与判断处理。",
        ],
      },
      {
        heading: "用两个 Agent 做最小验收",
        body: [
          "准备一份来源与两个互相矛盾的候选结论。让第一个 Agent 保存有来源的主张，再修改来源或 Page；第二个 Agent 使用旧版本时，写入前检查应该发现版本已经变化并停止，或把人工拥有的 Page 更新送进审核，而不是静默盖掉新内容。",
          "最后从另一个 Agent 重新查询，确认它看到已接受状态、当前来源与未解决冲突，并能追查被取代的结论及原因。即使不用 Wenlan，这组验收也适用于其他共享知识系统。",
        ],
      },
    ],
    faqs: [
      {
        question: "所有 Agent 都应该直接写入同一个 Page 吗？",
        answer:
          "不应该。Agent 可以保存原子证据与候选主张，但已接受的 Page 应有明确范围与审核路径，避免任何 Agent 静默覆盖结论。",
      },
      {
        question: "可选的 Reconcile 会自动解决所有矛盾吗？",
        answer:
          "不会。它能把受保护冲突排入审核并保留取代关系，但默认关闭，也无法替你判断原始来源是否正确。",
      },
      {
        question: "只用 Git 就能避免共享知识冲突吗？",
        answer:
          "Git 能保留文件历史并显示文本冲突，但不会自动发现跨文件的语义矛盾或过期证据；仍需要来源版本、验证规则与审核。",
      },
    ],
    relatedSlugs: [
      "source-backed-wiki-pages-ai-work",
      "verify-ai-knowledge-base-citations",
      "build-business-metric-definition-knowledge-base",
      "distilled-wiki-pages-ai-memory",
      "choose-ai-knowledge-base-tool",
    ],
    officialReferences: [
      {
        label: "Wenlan 知识生命周期",
        href: "https://github.com/7xuanlu/wenlan#how-knowledge-stays-current",
      },
      {
        label: "Wenlan 审核与信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "Governed Shared Memory 论文",
        href: "https://arxiv.org/abs/2606.24535",
      },
      {
        label: "DeerFlow 多智能体记忆污染 bug",
        href: "https://github.com/bytedance/deer-flow/issues/4802",
      },
      {
        label: "多 Agent 共享文件并发冲突",
        href: "https://github.com/bojieli/ai-agent-book/blob/main/book/chapter10.md",
      },
      {
        label: "AutoGen 长期多智能体记忆讨论",
        href: "https://github.com/microsoft/autogen/discussions/7794",
      },
    ],
    cta: {
      heading: "先测试一个互相矛盾的结论",
      body: "让两个 Agent 连接 Wenlan，保存一条有来源的冲突主张，确认审核与历史在复用前都能看见。",
    },
  },
  "fix-pdf-ingestion-ai-knowledge-base": {
    slug: "fix-pdf-ingestion-ai-knowledge-base",
    eyebrow: "导入排错",
    category: "Workflows",
    title: "AI 知识库导入 PDF 失败？先判断扫描件、文本层与解析错误",
    description:
      "从文本层、OCR、文件大小、解析错误和实际引用逐步排查 AI 知识库的 PDF 导入问题。",
    metaTitle: "AI 知识库 PDF 导入失败？完整排错清单",
    metaDescription:
      "排查 AI 知识库 PDF 导入失败：识别扫描件、OCR、文件限制、解析错误与空内容，并验证来源。",
    keywords: [
      "AI 知识库 PDF 导入失败",
      "扫描 PDF AI 知识库 OCR",
      "PDF 文本提取失败",
      "RAG PDF 空内容",
      "知识库文档解析错误",
      "PDF 导入排错",
    ],
    publishedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "PDF 显示已导入、被跳过或报错，但知识库里没有完整可用内容的简体中文用户",
    heroBullets: [
      "先分清文本型 PDF 与扫描型 PDF，不要先调 embedding。",
      "found、ingested、skipped 与 error 是排错信号，不是内容可用的证明。",
      "用一段确定存在的文字及其来源，验证完整导入路径。",
    ],
    sections: [
      {
        heading: "先说结论：确认 PDF 真的有文本层",
        body: [
          "先在 PDF 阅读器里选中并复制一段文字。如果整页只能作为图片选中，这就是扫描型或 image-only PDF，必须先做 OCR；Wenlan v1 不会自行 OCR。",
          "完成 OCR 后，另存为可提取文字的 PDF，或转成干净的 `.md` / `.txt`。先抽查姓名、日期、数字、表格和阅读顺序，再交给知识库；能搜到文字不代表 OCR 结果一定正确。",
        ],
      },
      {
        heading: "把失败分成五类，不要都叫上传失败",
        body: [
          "Wenlan 的文件夹来源只处理 `.md`、`.txt` 和 `.pdf`。文本文件上限为 1 MB，PDF 上限为 10 MB；隐藏文件、symlink 和被排除的文件夹不会进入常规扫描。不同结果需要不同修法。",
        ],
        bullets: [
          "完全找不到文件：先检查扩展名、大小、隐藏文件、symlink 和文件夹范围。",
          "found 但没有内容：检查是否为扫描型 PDF、空文本层或只有极少可用文字。",
          "skipped：可能是文件未变化、没有可提取文字，或内容未通过最低质量门槛。",
          "error：可能是读取失败、截断、损坏或 PDF parser 无法解析；先用原阅读器重新导出一份干净副本。",
          "有文字但回答错误：抽查多栏、表格、页码和段落顺序，确认问题不是解析阶段造成的。",
        ],
      },
      {
        heading: "用一个最小来源重跑 Wenlan",
        body: [
          "不要用整个文档库测试。复制一份无敏感信息的代表性 PDF 到单独文件夹，完成平台与客户端设置后，注册或重新同步这个路径。",
          "记录 found、ingested、skipped 与 error，但不要停在批次摘要。文档处理完成后，搜索一段只会出现在该 PDF 的句子，确认结果能回到正确文件或来源。",
        ],
        code: {
          label: "注册或重新同步一个排错来源",
          code: "wenlan status\nwenlan sources add ~/Knowledge/pdf-diagnostic",
        },
      },
      {
        heading: "用可回答和不可回答问题验收",
        body: [
          "准备一个文档中确实有答案的问题，以及一个来源完全没有答案的问题。第一个答案应能指出支持内容；第二个应保持未知，不能用流畅文字掩盖缺少证据。",
          "如果 Markdown 或纯文本版本能通过，但原 PDF 不能，问题就在 PDF 提取路径，不是 embedding 或提示词。如果两者都失败，再检查来源范围、同步、检索和引用。",
        ],
      },
      {
        heading: "什么时候该停止硬救 PDF",
        body: [
          "对于重要合同、报表或表格，OCR 与重新导出仍可能破坏数字或结构。如果无法通过抽查证明结果可靠，就保留原 PDF 作为权威来源，改用人工校验的 Markdown 或文本摘要，并清楚记录来源和限制。",
        ],
      },
    ],
    faqs: [
      {
        question: "为什么 PDF 显示已处理，知识库却找不到内容？",
        answer:
          "可能是文件只有图片、提取文字太少、解析失败，或批次摘要只代表注册／排程完成。用一段确定存在的文字验证实际检索结果。",
      },
      {
        question: "Wenlan 会自动对扫描型 PDF 做 OCR 吗？",
        answer: "不会。当前 v1 只提取已有文本层的 PDF；扫描件需要先在外部完成 OCR。",
      },
      {
        question: "空内容时应该先换 embedding 模型吗？",
        answer: "不用。没有成功提取的文字无法靠 embedding 补回来；先修正或转换来源，再重跑同一组验收。",
      },
    ],
    relatedSlugs: [
      "build-local-ai-knowledge-base-from-documents",
      "choose-ai-knowledge-base-tool",
      "verify-ai-knowledge-base-citations",
      "source-backed-wiki-pages-ai-work",
    ],
    officialReferences: [
      {
        label: "Wenlan 支持的文档来源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan Directory Source 与文件限制",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-core/src/sources/directory.rs",
      },
      {
        label: "Wenlan 文件夹导入验收测试",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-core/tests/folder_ingest_e2e.rs",
      },
      {
        label: "Google Cloud PDF OCR 与版面解析",
        href: "https://cloud.google.com/generative-ai-app-builder/docs/parse-chunk-documents?hl=zh-cn",
      },
      {
        label: "DeepTutor 扫描 PDF 空文档 issue",
        href: "https://github.com/HKUDS/DeepTutor/issues/431",
      },
      {
        label: "FastGPT PDF 空内容 issue",
        href: "https://github.com/labring/FastGPT/issues/1852",
      },
    ],
    cta: {
      heading: "先验证一份 PDF，再扩大文档库",
      body: "连接 Wenlan、加入一份可控文档，确认文字、来源和引用都通过后再导入其他资料。",
    },
  },
  "when-ai-agent-should-query-knowledge-base": {
    slug: "when-ai-agent-should-query-knowledge-base",
    eyebrow: "检索策略",
    category: "Workflows",
    title: "AI Agent 何时该查知识库？按需读取文档",
    description:
      "用查询或跳过的判断流程，让 AI Agent 在需要证据时查知识库，也避免反复把无关文档塞进上下文。",
    metaTitle: "AI Agent 什么时候该查知识库？| Wenlan",
    metaDescription:
      "判断 AI Agent 何时查知识库、跳过检索、先看索引或打开准确来源，减少无关上下文并保留证据。",
    keywords: [
      "AI Agent 什么时候查询知识库",
      "AI 知识库检索策略",
      "AI 知识库上下文成本",
      "避免 AI 重复读取文档",
      "按需加载上下文",
      "AI Agent token 成本",
    ],
    publishedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "需要让 AI Agent 反复查阅大型文档、项目资料或内部制度的开发者",
    heroBullets: [
      "答案依赖最新、私有、项目特定或必须引用的信息时才查询。",
      "准确权威文件已在上下文，或任务不依赖文档时就跳过。",
      "先用索引选择来源，再只打开足以验证答案的准确段落。",
    ],
    sections: [
      {
        heading: "先说结论：知识库不用每题都查",
        body: [
          "当答案依赖当前版本的项目事实、私有资料、组织制度、精确数字或可引用证据，而且这些内容还不在上下文时，AI Agent 才应查询知识库。问候、固定流程、纯数据操作，或准确权威文件已经打开时，不必再做一次相同检索。",
          "需要查询时，先读标题、路径、摘要或维护型索引，确认方向后再加载最小的相关页面，最后回到引用原文验证重要主张。省 Token 不能成为跳过证据的理由。",
        ],
      },
      {
        heading: "为什么每次都查和完全不查都会失败",
        body: [
          "每轮强制注入整批文档，会增加无关文本、延迟和注意力压力；完全不查，又会让 Agent 猜测当前事实或反复重新发现同一个决定。真正需要的是每个任务都能重复执行的查询边界。",
          "JitAI 文档把智能、自定义和禁用三种知识库模式分开，并继续区分 Agent 自主查询与每轮预检索；这说明检索方式取决于任务，不是所有问题共用一个开关。",
        ],
      },
      {
        heading: "使用这份查询或跳过清单",
        body: [
          "先判断答案是否依赖外部证据，再决定预检索、让 Agent 自主查询、直接读取来源，或完全跳过。每次只增加完成任务所需的下一层信息。",
          "下方 slash commands 需要先安装 Wenlan Codex plugin 并执行一次 /setup；wenlan connect codex 只配置 MCP 连接。只有 MCP 连接的客户端，请使用 Wenlan recall 并检查它返回的 Page 结果；若未安装 plugin 但要列出或打开 Pages，请改用本地 wenlan pages <主题> CLI。",
        ],
        bullets: [
          "查询：需要最新项目事实、私有资料、组织制度、精确数字或引用。",
          "预检索：每个有效答案都必须依据同一个受控来源，例如合规条款、标准流程或产品手册。",
          "自主查询：只有部分问题需要文档，而且工具描述清楚写明资料范围与不适用情况。",
          "跳过：问候、固定路由、确定性操作，或准确权威文件已经在眼前。",
          "渐进披露：先看索引或 Page，再打开相关段落，不一次加载整个知识库或文档集。",
          "验证：重要结论回到准确引用；找不到资料时标记未知，不用模型记忆补答案。",
          "测量：在自己的工作负载记录检索 Token、延迟、回答质量与失败搜索。",
        ],
        code: {
          label: "先查窄主题，再检查维护型 Page",
          code: "# Wenlan plugin：\n/recall <主题>\n/pages <主题>\n\n# 只有 MCP：调用 Wenlan recall 并检查返回的 Page。\n# 本地 CLI 列出或打开 Page：\nwenlan pages <主题>",
        },
      },
      {
        heading: "Wenlan 在这个流程负责什么",
        body: [
          "Wenlan 把 Sources、原子知识和维护型 Pages 分开。Agent 可以先 recall 一个窄主题或打开相关 Page，检查引用后再回到当前原始文档，不必每次重放整个资料库。",
          "Wenlan 不会取代代码、测试、制度或当前文档的直接验证，也不保证一定降低 Token。更小的上下文仍可能漏掉关键信息；无关检索也可能让回答变差，因此要用代表性任务比较完整流程。",
        ],
      },
    ],
    comparisonTable: {
      competitorName: "检索动作",
      rows: [
        {
          dimension: "最新、私有或需要引用的事实",
          wenlan: "查询窄主题，再打开当前引用来源。",
          competitor: "查询",
        },
        {
          dimension: "每次都必须依据受控文档",
          wenlan: "预先带入必要来源，并保留后续来源访问。",
          competitor: "预检索",
        },
        {
          dimension: "权威文件已经打开",
          wenlan: "直接读取并验证，不增加重复搜索。",
          competitor: "跳过检索",
        },
        {
          dimension: "大型或陌生文档集",
          wenlan: "先看索引或 Page，再加载准确来源段落。",
          competitor: "渐进披露",
        },
      ],
    },
    faqs: [
      {
        question: "AI Agent 每次回答都应该查知识库吗？",
        answer:
          "不应该。只有每个答案都必须依据受控来源时才适合固定预检索；其他流程应让任务或 Agent 在确实依赖这些资料时再查询。",
      },
      {
        question: "使用知识库就一定能降低 Token 吗？",
        answer:
          "不一定。索引与选择性检索可以减少重复读取文档，但 embedding、工具调用、返回片段和失败搜索也有成本，必须用自己的任务测量完整流程。",
      },
      {
        question: "什么时候必须回到原始文档？",
        answer:
          "精确数字、否定条件、合规规则、当前代码行为和其他重要结论，都应打开准确引用位置验证；Page 或检索摘要只能帮助找到来源。",
      },
    ],
    relatedSlugs: [
      "ai-work-memory-vs-knowledge-base",
      "coding-agent-source-backed-knowledge-base",
      "source-backed-wiki-pages-ai-work",
      "verify-ai-knowledge-base-citations",
    ],
    officialReferences: [
      {
        label: "Anthropic AI Agent 上下文工程",
        href: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      },
      {
        label: "JitAI 按场景查阅知识库",
        href: "https://jit.pro/zh/docs/devguide/knowledge-base/integrate-knowledge-base-into-agent",
      },
      {
        label: "OpenViking 上下文层级",
        href: "https://docs.openviking.ai/zh/concepts/03-context-layers",
      },
      {
        label: "CareerWise 知识库搜索 Tool Use 案例",
        href: "https://www.cythilya.tw/2026/07/16/careerwise-search-knowledge-tool/",
      },
      {
        label: "Wenlan source-backed Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
    ],
    cta: {
      heading: "先测试一条检索边界",
      body: "连接 Wenlan，选择一个会重复出现的项目问题，比较整批加载、按需查询和直接读取来源，不预设一定省 Token。",
    },
  },
  "distilled-wiki-pages-ai-memory": {
    ...zhTWArticles["distilled-wiki-pages-ai-memory"],
    title: "Karpathy LLM Wiki：如何搭建有来源的 AI 知识库",
    description:
      "Karpathy LLM Wiki 模式把可信来源、原子知识与维护页面分开，建立让 AI 代理按需读取的知识库。",
    metaTitle: "Karpathy LLM Wiki 与 AI 知识库 | Wenlan",
    metaDescription:
      "了解 Karpathy LLM Wiki 的架构、它和 RAG 的区别，以及来源页面、Obsidian、校验与持续更新如何配合。",
    keywords: [
      "LLM Wiki 知识库",
      "Karpathy LLM Wiki",
      "Andrej Karpathy LLM Wiki",
      "AI 知识库",
      "本地 AI 知识库",
      "RAG vs LLM Wiki",
      "LLM Wiki 搭建",
      "AI 维护知识库",
      "有来源的知识库",
      "Claude Code 知识库",
      "Obsidian AI 知识库",
      "Wenlan 文澜",
    ],
    publishedAt: "2026-07-04",
    updatedAt: "2026-09-08",
    readingTime: "9 分钟阅读",
    audience: "正在搭建可由 AI 代理读取、更新并检查来源的本地知识库的中文用户",
    heroBullets: [
      "Karpathy LLM Wiki 模式维护可复用的当前答案，不把聊天记录、检索片段或笔记直接当成成品知识。",
      "可靠架构会分开原始来源、原子事实、维护页面与按需检索。",
      "页面需要保留 source IDs、变旧原因和可检查的修订，而不是静默覆盖。",
    ],
    sections: [
      {
        heading: "Karpathy LLM Wiki 是什么",
        body: [
          "Andrej Karpathy 用 LLM Wiki 描述一种把原始知识整理成精选、互相连接页面的模式，让 AI 代理只在需要时加载相关内容。本文把他的公开说明作为可维护来源，不代表 Karpathy 为 Wenlan 背书。",
          "实现上，LLM Wiki 是给 AI 代理使用、也让人能够检查的维护型 AI 知识库。它把文档、对话和文件等来源整理成主题页面，不必反复重放整个资料库或聊天历史。",
          "它不只是让 LLM 自动写一批 Markdown 笔记。真正有用的系统会把原始证据、可复用事实与当前解释分开，保留来源和更新状态；即使读者不安装 Wenlan，这套判断标准也能用来评估自己的知识库。",
        ],
        link: {
          label: "先试完整示例，不必安装",
          href: "#worked-example",
        },
      },
      {
        heading: "一个可靠 AI 知识库的四层架构",
        body: [
          "最小可维护架构包含四层：Raw Sources 保存可检查的原始材料；Atomic Knowledge 保存一次决策、纠正或经验；Wiki Pages 汇总当前答案；Schema 与 Index 负责按主题定位所需内容。",
          "常见流程可以概括为 Ingest、Query、Lint：Ingest 注册来源而不急着改写结论；Query 只取当前问题所需的页面和证据；Lint 检查缺失来源、重复、矛盾、过期依赖与不可维护的页面。",
        ],
        bullets: [
          "Raw Sources：保存文档、网页、文件和对话等原始材料。",
          "Atomic Knowledge：保留一个完整事实、决策、经验或纠正及其来源。",
          "Wiki Pages：把相关证据编成一个可读、可维护的当前答案。",
          "Schema 与 Index：记录主题、依赖和状态，并只加载相关内容。",
        ],
      },
      {
        heading: "LLM Wiki 知识库和 RAG 有什么不同",
        body: [
          "RAG 通常在提问时检索原始片段；LLM Wiki 则维护一个可重复使用的答案、支持它的来源以及需要刷新的状态。知识库可以在底层使用 RAG，但只有检索还不会自动维护结论。",
          "Obsidian 是人拥有的资料库和写作界面，可以承载或查看 Markdown wiki 页面；但开放 vault 给代理读取，并不等于已经处理选择性检索、来源、过期状态和自动修改边界。两者可以配合，不需要互相替代。",
        ],
        bullets: [
          "RAG：为这次问题寻找相关来源片段。",
          "LLM Wiki：维护以后还能复用的答案、引用和刷新状态。",
          "Obsidian：保留人可读、可编辑的 Markdown 知识面。",
          "Agent memory：保存工作中可复用的事实和决策，作为页面原料之一。",
        ],
      },
      ...workedExampleSections("zh-CN"),
      {
        heading: "一份最小可用的 LLM Wiki Schema",
        body: [
          "让固定加载的契约保持精简。CLAUDE.md 或 AGENTS.md 只需说明知识库的用途、不可静默改变的边界，以及需要时才按需加载的操作流程；不要把整个 wiki 或所有维护指令都塞进每次 context。",
          "这是工具无关的信息与维护契约，不强迫特定文件夹或产品存储格式；可以调整名称，但每个边界都应该能够检查。",
        ],
        bullets: [
          "用途与范围：哪些重复问题或决策属于这个 wiki，哪些不属于。",
          "不可变来源边界：原始证据放在哪里，以及自动化绝不能改写哪些文件。",
          "页面所有权：哪些页面由机器维护、人拥有，或只能通过审核修改。",
          "命名与链接规则：稳定主题、别名、页面链接和最小 routing index。",
          "引用要求：重要说法必须能够回到可检查来源。",
          "Ingest、Query、Lint 与维护记录：分开按需加载的流程，加上 append-only 变更记录。",
          "过期与审核行为：来源改变、证据冲突或人拥有文字时要如何处理。",
        ],
        code: {
          label: "精简 client 契约",
          code: [
            "# LLM Wiki",
            "用途：<这个 wiki 维护的重复决策>",
            "来源：<不可变来源边界>",
            "页面：<所有权、命名、链接、引用>",
            "索引：<最小主题路由；页面按需加载>",
            "流程：ingest | query | lint | review",
            "记录：<append-only 维护记录>",
            "过期规则：<来源改变 -> stale 或 review>",
          ].join("\n"),
        },
      },
      {
        heading: "正式使用前的最小验收测试",
        body: [
          "文件存在不代表 template 已经可用。先用一个无风险主题做端到端测试，而且必须包含一次来源变更，再导入私人或重要资料。",
          "这套验收可用于文件夹加 prompt、Obsidian 工作流或专门的 LLM Wiki 工具；预期结果是人能检查的证据，不只是一段流畅回答。",
        ],
        bullets: [
          "导入一份无风险来源，确认原始内容没有被改写。",
          "回答一个问题，并为重要说法引用来源。",
          "运行 lint，确认缺失引用、断链或重复能够被看见。",
          "修改来源，再问一次相同问题。",
          "确认旧答案进入 stale 或 review，而不是被静默覆盖。",
        ],
      },
      {
        heading: "如何搭建一个会持续更新的 AI 知识库",
        body: [
          "先选一个无风险的小主题，不要一开始就导入整个 vault。注册可检查的来源，捕捉一条完整事实，再把相关内容蒸馏成主题页面；随后用同一问题重新检索，并从页面回到 source IDs 检查证据。",
          "发布第一版不是结束。来源改变时，系统应该标记受影响页面、记录 stale reason，并产生可审查的修订；对于人拥有的文字，自动化不应静默覆盖。",
        ],
        code: {
          label: "Wenlan 工作流：需先安装并连接客户端",
          code: `/brief <主题>
/recall <问题>
/capture <结论 + 原因>
/handoff
/distill <主题>
/pages <主题>`,
        },
        link: {
          label: "查看完整日常工作流",
          href: "/docs/daily-workflow",
        },
      },
      {
        heading: "如何验证知识库真的可用",
        body: [
          "不要只看命令是否返回成功。真正的验收是：下一次会话能找回正确内容，人能在聊天之外阅读页面，而且重要说法可以追溯到来源。",
          "如果检查失败，先保留测试内容的低风险范围，修复连接、来源或重复问题，再用同一主题复测；不要靠继续生成更多页面掩盖故障。",
        ],
        bullets: [
          "相同主题可以再次找到刚才保存的事实。",
          "页面是可读 Markdown，并显示重要说法对应的 source IDs。",
          "后续检索只加载相关页面或来源片段，而不是整个资料库。",
          "来源变化会产生可检查的过期原因或修订，不会静默覆盖。",
          "Lint 能暴露缺失来源、重复、矛盾或过期依赖。",
        ],
        link: {
          label: "查看审查与修复流程",
          href: "/docs/review-and-trust",
        },
      },
      {
        heading: "Wenlan 如何实现本地 LLM Wiki",
        body: [
          "Wenlan 把 Sources、Memories 和 Pages 分成三种耐久角色：Sources 保存原始材料，Memories 保存工作中产生的原子事实，Pages 编成有来源的当前解释。本地 daemon 负责检索，Markdown 页面和 git 历史让结果保持可见。",
          "每个蒸馏页面都要保留 source IDs。页面可以随着新证据变旧、刷新或进入审查；记忆在这里保存支撑页面的知识与状态，便于回查和更新。",
          "Wenlan 不要求用户自定义 Page schema。typed Memory fields 与内置 Page 规则已经管理来源、引用、刷新、所有权和审核；上面的 starter schema 是可移植的 client 与流程验收契约。",
        ],
        link: {
          label: "检查有来源页面模型",
          href: "/learn/source-backed-wiki-pages-ai-work",
        },
      },
      {
        heading: "什么时候不需要 LLM Wiki",
        body: [
          "一次性聊天、很小且长期稳定的文档集，或团队已经维护良好的普通 wiki，不一定需要额外系统。当前代码、测试结果和工具官方文档也始终比知识库里的旧解释更权威。",
          "当多个 AI 工具需要共享同一套检索、来源、交接和审查规则，而且答案会随项目持续变化时，维护型 LLM Wiki 才开始产生独立价值。",
        ],
        link: {
          label: "查看 Wenlan 的层级边界",
          href: "/docs/architecture",
        },
      },
    ],
    faqs: [
      {
        question: "Karpathy LLM Wiki 的核心想法是什么？",
        answer:
          "Andrej Karpathy 描述的是一组经过整理、彼此连接，并能由代理按需读取的个人 wiki 页面。重点是维护有用页面及其结构，而不是每次加载没有区分的完整资料库；引用他的说明不代表他为 Wenlan 背书。",
      },
      {
        question: "LLM Wiki 和 RAG 是同一种东西吗？",
        answer:
          "不是。RAG 在提问时检索来源片段；LLM Wiki 维护可复用的答案、引用和刷新状态。LLM Wiki 可以使用 RAG，但检索本身不会维护答案。",
      },
      {
        question: "Obsidian 可以直接当 AI 知识库吗？",
        answer:
          "Obsidian 很适合做人拥有的 Markdown vault 和阅读界面。要让它成为代理可依赖的知识库，还需要选择性检索、来源、过期处理和安全的自动修改边界。",
      },
      {
        question: "本地 AI 知识库一定要导入所有笔记吗？",
        answer:
          "不用。先从一个会重复使用的小主题开始，只注册必要来源并检索最小相关集合。整库注入会增加 token 成本、噪音和过期内容风险。",
      },
      {
        question: "Wenlan 的蒸馏页面只是摘要吗？",
        answer:
          "不是。摘要通常压缩单一来源；蒸馏页面会组合相关事实与来源，保留 source IDs、修订状态和变旧原因，并能随着新证据更新。",
      },
    ],
    officialReferences: [
      {
        label: "Wenlan 的 Source、Memory 与 Page 模型",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan 日常工作流",
        href: "https://github.com/7xuanlu/wenlan#daily-workflow",
      },
      {
        label: "Karpathy 的 LLM Wiki 说明",
        href: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f",
      },
      {
        label: "jackwener LLM Wiki 实现",
        href: "https://github.com/jackwener/llm-wiki",
      },
      {
        label: "LLM Wiki CLAUDE.md template",
        href: "https://hjarni.com/blog/llm-wiki-claude-md-template",
      },
      {
        label: "LLM Wiki v2 提案",
        href: "https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2",
      },
    ],
    cta: {
      heading: "搭建可维护的本地 LLM Wiki",
      body: "用 Wenlan 把来源与工作事实蒸馏成可检查、可刷新、让下一个 AI 会话按需读取的知识页面。",
    },
  },
  "source-backed-wiki-pages-ai-work": {
    slug: "source-backed-wiki-pages-ai-work",
    eyebrow: "信任",
    category: "Concepts",
    title: "有来源的 AI 知识库：来源、更新与审核方法",
    description:
      "用 Wenlan 把来源、原子知识与可维护页面分开，建立能追溯、能刷新、能审核的本地 AI 知识库。",
    metaTitle: "有来源的 AI 知识库：来源、更新与审核 | Wenlan",
    metaDescription:
      "建立有来源的 AI 知识库：分开可信来源、原子知识与 LLM Wiki 页面，并用 Wenlan 保留引用、更新与审核状态。",
    keywords: [
      "AI 知识库",
      "有来源的 AI 知识库",
      "本地 AI 知识库",
      "LLM Wiki",
      "知识库维护",
      "Wenlan 文澜",
    ],
    publishedAt: "2026-07-04",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "7 分钟阅读",
    audience: "想让 AI agent 使用本地知识，但仍能检查来源、更新与审核状态的简体中文用户",
    heroBullets: [
      "可信来源不和模型产生的结论混在一起。",
      "原子知识保留细粒度证据，再组成可复用页面。",
      "页面保存引用、修订、过期原因与审核状态。",
    ],
    sections: [
      {
        heading: "一句话答案",
        body: [
          "有来源的 AI 知识库会把可信来源、原子知识与维护型 LLM Wiki 页面分开。Agent 取得的是可复用答案，人仍能沿着引用回到来源、检查修订，并在证据变化时刷新页面。",
          "Wenlan 在本地连接这三层，让知识不只是搜索片段或脱离来源的摘要。",
        ],
        link: {
          label: "查看 LLM Wiki 的完整生命周期",
          href: "/learn/distilled-wiki-pages-ai-memory",
        },
      },
      {
        heading: "AI 知识库为什么必须保留来源",
        body: [
          "直接放入大量文档会让 agent 每次都重新搜索；只留下摘要，又会失去支持结论的证据。来源一旦更新，没有人知道哪些答案也必须重算。",
          "可维护的知识库必须回答三件事：这个结论来自哪里、现在是否仍然有效、发生冲突时由谁审核。",
        ],
      },
      {
        heading: "三层最小架构：Sources、Atomic Knowledge、Pages",
        body: [
          "Sources 是可检查的原始资料；Atomic Knowledge 是带着来源和理由的单一事实；Pages 则把重复、高价值的知识整理成 agent 可以按需读取的答案。",
          "不要跳过中间层。原子知识让页面保持可追溯，也让新证据只修正受影响的事实，而不是重写整个知识库。",
        ],
      },
      {
        heading: "Wenlan 的实际工作流程",
        body: [
          "先用一个会重复查询的主题验证闭环，不要一开始就导入整个笔记库。记录一个带来源与理由的事实，积累到值得复用时再蒸馏成页面。",
        ],
        bullets: [
          "用 /capture 保存单一事实、来源和它为什么重要。",
          "用 /distill 把重复主题整理成维护型页面。",
          "用 /pages 打开页面并核对支持它的来源。",
          "用 /lint 找出薄弱、冲突或过期的知识。",
          "用 /curate 审核修订，再决定是否刷新页面。",
        ],
        code: {
          label: "Wenlan 知识库维护循环",
          code: "/brief <主题>\n/capture <事实 + 来源 + 为什么重要>\n/distill <主题>\n/pages <主题>\n/lint\n/curate",
        },
      },
      {
        heading: "如何处理过期与冲突",
        body: [
          "来源或工作条件改变时，不要让新旧答案并排。把旧结论标成过期、记录替代关系，再按最新证据刷新页面。",
          "对高影响结论保留人工审核。自动蒸馏能加快整理，但不应把没有支持来源的文字升级成可信知识。",
        ],
      },
      {
        heading: "如何验收 AI 知识库",
        body: [
          "先用一个主题做小型验收。Agent 应该能找到当前答案，人应该能回到来源，证据变更后则能看到过期状态并完成刷新。",
        ],
        bullets: [
          "页面中的重要结论能追到来源 ID 或维护中的文档。",
          "重新打开 AI client 后，仍能按需取得相同主题。",
          "加入冲突证据时，lint 或 review 流程能把问题暴露出来。",
          "刷新后保留修订记录，而不是静默覆盖旧答案。",
        ],
      },
      {
        heading: "Wenlan 如何对应这套架构",
        body: [
          "Wenlan 的 Sources、Memories 与 Pages 对应来源、原子知识与维护型页面。页面记录保留 source IDs、版本、changelog、stale reason 与来源数量。",
          "这套设计让 Claude Code、Codex、Cursor 等 MCP client 共用同一个本地知识层，同时保留人可以检查和修正的路径。",
        ],
        link: {
          label: "阅读 Wenlan 的审核与信任指南",
          href: "/docs/review-and-trust",
        },
      },
    ],
    faqs: [
      {
        question: "AI 知识库和 RAG 是同一件事吗？",
        answer:
          "不是。RAG 在提问时找来源片段；维护型知识库还保存可复用答案、引用、审核与刷新状态，也可以在底层使用检索。",
      },
      {
        question: "开始前要导入全部笔记吗？",
        answer:
          "不用。先选一个高价值、会重复查询的主题，验证来源、capture、distill、pages、lint 与 curate 的完整闭环。",
      },
      {
        question: "Wenlan Pages 可以给人阅读吗？",
        answer:
          "可以。页面会成为可读的 Markdown，同时在 page record 中保留支持它的来源与修订状态。",
      },
    ],
    relatedSlugs: [
      "prevent-multi-agent-knowledge-conflicts",
      "coding-agent-source-backed-knowledge-base",
      "wenlan-vs-obsidian-ai-memory",
      "distilled-wiki-pages-ai-memory",
      "when-ai-agent-should-query-knowledge-base",
      "verify-ai-knowledge-base-citations",
      "build-business-metric-definition-knowledge-base",
      "source-backed-research-knowledge-base",
      "build-client-project-knowledge-base-for-consulting",
      "build-investment-research-knowledge-base",
      "build-product-research-knowledge-base-for-prd",
      "build-sre-incident-knowledge-base",
      "review-before-trust-ai-memory",
      "ai-memory-provenance",
      "test-ai-knowledge-base-retrieval-after-changes",
    ],
    officialReferences: [
      {
        label: "Wenlan 的知识模型",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan 日常工作流程",
        href: "https://github.com/7xuanlu/wenlan#daily-workflow",
      },
      {
        label: "Wenlan 审核与信任指南",
        href: "https://wenlan.app/docs/review-and-trust",
      },
    ],
    cta: {
      heading: "先建立一个可验证的 AI 知识库主题",
      body: "用 Wenlan 把来源、原子知识与维护型页面连成小型闭环，再逐步扩大到其他 AI 工具和项目。",
    },
  },
  "wenlan-vs-obsidian-ai-memory": {
    slug: "wenlan-vs-obsidian-ai-memory",
    eyebrow: "比较",
    category: "Comparisons",
    title: "Obsidian + Claude Code：文件、MCP 与可维护的 AI 知识库",
    description:
      "比较直接读取 Obsidian vault、实时编辑器 context、MCP 与有来源的知识维护，选择 Claude Code 真正需要的最小集成层。",
    metaTitle: "Obsidian + Claude Code：MCP 与 AI 知识库 | Wenlan",
    metaDescription:
      "了解 Claude Code 何时直接读取 Obsidian vault 就够、IDE 与 MCP bridge 增加什么，以及 AI 知识库何时需要来源、更新与审核流程。",
    keywords: [
      "Obsidian Claude Code",
      "Claude Code Obsidian",
      "Obsidian MCP",
      "Obsidian Claude Code MCP",
      "Obsidian AI 知识库",
      "Claude Code 知识库",
      "AI 知识库",
      "本地 AI 知识库",
      "Wenlan 文澜",
    ],
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-01",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "使用 Obsidian vault 的简体中文 Claude Code 用户",
    heroBullets: [
      "Claude Code 能访问本地 Markdown 时，直接读取 vault 通常是最小且最清楚的起点。",
      "IDE bridge 补上当前文件与选中内容；Obsidian MCP 补上结构化 vault 操作或其他 client surface。",
      "能连接 vault 不等于会维护知识；来源、过期、修订与审核仍是另一个决策。",
    ],
    sections: [
      {
        heading: "先给答案：从最小集成层开始",
        body: [
          "如果 Claude Code 已能访问你的 Markdown 文件夹，先让它直接读取需要的 vault 路径。缺少当前文件与选中内容时再加 IDE bridge；需要 Obsidian 命令、结构化 vault 操作或另一个支持的 client 时再考虑 MCP。",
          "这些连接都会改善访问，但不会自动建立可维护的 AI 知识库。答案要跨 session 与工具复用时，还需要来源、provenance、刷新规则、冲突处理与人工审核。",
        ],
        link: {
          label: "比较 LLM Wiki 的架构与流程",
          href: "/learn/distilled-wiki-pages-ai-memory",
        },
      },
      {
        heading: "四种 Obsidian + Claude Code 集成层",
        body: [
          "把直接文件、编辑器 context、MCP 与内嵌 assistant 分开看，才能避免为同一件事安装四套工具。选择标准应该是当前缺少的能力，而不是哪个工具名字最热门。",
        ],
        bullets: [
          "直接文件：Claude Code 读写它有权限访问的 Markdown；适合普通搜索、整理与修改。",
          "IDE bridge：把 Obsidian 当前文件与选中内容传给 Claude Code，文件操作仍可保持直接。",
          "Obsidian MCP：提供结构化 vault tools、workspace context、Obsidian 命令或其他支持的 client。",
          "内嵌 assistant：只有想在 Obsidian UI 中直接对话与操作时才需要。",
        ],
      },
      {
        heading: "能连接 vault，不等于有可维护的 AI 知识库",
        body: [
          "Vault access 解决 agent 如何看到或修改笔记；knowledge lifecycle 解决哪个答案当前有效、它来自哪里、来源变化时要刷新哪一页，以及冲突是否需要人审。两者可以组合，但不能互相冒充。",
          "Obsidian 应继续是人拥有的写作与 Markdown 知识面。只有会影响未来 AI 工作的结论，才需要进入可追溯、可刷新、能跨 session 复用的知识层。",
        ],
        link: {
          label: "查看 Obsidian 的数据存储方式",
          href: "https://obsidian.md/help/data-storage",
        },
      },
      {
        heading: "用 Wenlan 把 vault 当来源，而不是复制品",
        body: [
          "Wenlan 可以把 Obsidian vault 注册为 read-only Source，按需重新同步 Markdown，再把来源与工作中确认的决策编成带引用、过期状态与修订记录的 Pages。它不需要接管 Obsidian，也不应静默覆盖人写的 vault。",
          "同一份知识还要给 Codex、Cursor、ChatGPT 或其他 MCP client 使用时，Wenlan 提供共用的 knowledge lifecycle；Obsidian 仍保留人最容易阅读和编辑的知识面。",
        ],
        bullets: [
          "原始 Markdown 保留在只读 vault；Wenlan 按需重新扫描、分块并索引当前内容。",
          "Atomic knowledge 保存会影响未来工作的事实、决策与纠正。",
          "Pages 把相关证据编成当前答案，并保留引用与刷新状态。",
          "Lint 与 review 暴露缺少来源、冲突、过期依赖与不安全的改写。",
        ],
      },
      {
        heading: "一个最小的 Obsidian AI 知识库流程",
        body: [
          "先选一个无风险的小主题，不要导入整个 vault。确认 Claude Code 能读到一篇来源笔记，再捕捉一个会影响未来工作的结论，蒸馏成页面，最后从页面回到来源检查证据。",
          "如果只需要查找和改写 Markdown，到这里可以停在 Obsidian。只有答案需要跨 session、跨 client 保持一致时，才增加 Wenlan 的 distill、lint 与 review 流程。",
        ],
        code: {
          label: "最小验证循环",
          code: [
            "/brief Obsidian AI 知识库",
            "/capture <结论 + 来源 + 为什么重要>",
            "/handoff",
            "/distill Obsidian AI 知识库",
            "/pages Obsidian AI 知识库",
            "/lint",
          ].join("\n"),
        },
      },
      {
        heading: "如何验证集成真的可用",
        body: [
          "不要只看 plugin 或 MCP 是否显示 connected。用一个 disposable note 做端到端验收：确认谁能读、谁能写、当前文件是否正确传入、来源是否可追溯，以及失败时哪个 process 拥有每一次写入。",
          "同时检查 vault backup、模型提供商会收到哪些 context、bridge 是否只绑定 localhost，以及自动化是否会改写人拥有的笔记。连接能力不是 governance policy。",
        ],
        bullets: [
          "读取一篇指定笔记，确认没有把整个 vault 发送到 context。",
          "修改一篇 disposable note，确认权限与写入者符合预期。",
          "加入冲突来源，确认 lint 或 review 能暴露问题。",
          "重新打开 client，确认当前答案能被找到并回到原始来源。",
        ],
      },
    ],
    comparisonTable: {
      competitorName: "Obsidian + Claude Code 集成",
      rows: [
        {
          dimension: "直接 vault 访问",
          wenlan: "把 Obsidian vault 当 read-only Source，按需重新同步 Markdown。",
          competitor: "Claude Code 可直接读写有权限访问的 Markdown 文件。",
        },
        {
          dimension: "编辑器 context",
          wenlan: "不尝试成为 Obsidian editor bridge。",
          competitor: "IDE bridge 可共享当前文件与选中内容，文件修改仍可直接完成。",
        },
        {
          dimension: "结构化工具",
          wenlan:
            "Wenlan runtime 管理 Sources；MCP 提供 capture、recall、distill、Page 与 review 工具，plugin 再补上 /handoff 等工作流程。",
          competitor: "Obsidian MCP 可提供 vault 文件、workspace context 与 Obsidian 操作。",
        },
        {
          dimension: "知识 lifecycle",
          wenlan: "Sources 与确认过的决策编成带引用、过期、修订与审核的 Pages。",
          competitor: "Vault 是持久 Markdown；来源、刷新与审核语义取决于所选项目和流程。",
        },
        {
          dimension: "最适合",
          wenlan: "需要跨 session 与多个 AI client 保持当前、可追溯的知识。",
          competitor: "让 Claude Code 使用 vault 文件、Obsidian 当前 context 或特定命令。",
        },
      ],
    },
    faqs: [
      {
        question: "Claude Code 搭配 Obsidian 一定需要 MCP 吗？",
        answer:
          "不一定。普通 Markdown 读写先用直接文件访问即可；需要当前文件与选中内容时用 IDE bridge，需要结构化 Obsidian 操作或其他 client 时再加 MCP。",
      },
      {
        question: "连接 Claude Code 后，Obsidian 就是持久 AI 知识库吗？",
        answer:
          "不是。连接只提供文件或工具访问；持久知识还需要清楚的来源边界、provenance、刷新、冲突处理、审核，以及跨 session 保存当前结论的方法。",
      },
      {
        question: "Wenlan 会覆盖我的 Obsidian vault 吗？",
        answer:
          "Wenlan 可以把 vault 注册为 read-only Source 并重新同步 Markdown。人写的 vault 继续作为来源；Wenlan 把有来源的 Pages 与其他 artifacts 投影在自己的本地空间，不应静默覆盖 vault。",
      },
    ],
    relatedSlugs: [
      "distilled-wiki-pages-ai-memory",
      "source-backed-wiki-pages-ai-work",
      "ai-work-memory-vs-knowledge-base",
    ],
    officialReferences: [
      {
        label: "Obsidian 数据存储说明",
        href: "https://obsidian.md/help/data-storage",
      },
      {
        label: "Obsidian plugins 说明",
        href: "https://obsidian.md/help/plugins",
      },
      {
        label: "obsidian-claude-code 内嵌 assistant",
        href: "https://github.com/Roasbeef/obsidian-claude-code",
      },
      {
        label: "Obsidian 的 Claude Code IDE bridge",
        href: "https://github.com/petersolopov/obsidian-claude-ide",
      },
      {
        label: "Obsidian Claude Code MCP repository",
        href: "https://github.com/iansinnott/obsidian-claude-code-mcp",
      },
      {
        label: "Wenlan 维护型知识模型",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan 日常工作流程",
        href: "https://wenlan.app/docs/daily-workflow",
      },
      {
        label: "Wenlan 数据与隐私",
        href: "https://wenlan.app/docs/data-and-privacy",
      },
    ],
    cta: {
      heading: "让 vault 与 AI 知识库各司其职",
      body: "保留 Obsidian 作为人可读的知识面；答案需跨工具保持当前、可追溯且可审核时，再用 Wenlan 维护带引用的 Pages。",
    },
  },
  "coding-agent-source-backed-knowledge-base": {
    slug: "coding-agent-source-backed-knowledge-base",
    eyebrow: "Coding agent 知识",
    category: "Workflows",
    title: "如何让 Codex 使用有来源的项目知识库",
    description:
      "让 AGENTS.md、源代码与文档、维护型知识页面分工，使 Codex 按需获取有来源、可审核的项目知识。",
    metaTitle: "Codex 有来源项目知识库工作流 | Wenlan",
    metaDescription:
      "用 AGENTS.md、项目文档、引用、按需检索与验证，为 Codex、Claude Code 或其他 coding agent 建立有来源的项目知识库。",
    keywords: [
      "Codex 知识库",
      "Codex 项目知识",
      "code agent 知识库",
      "coding agent 知识库",
      "AI agent 项目知识库",
      "AGENTS.md 知识库",
      "Claude Code 知识库",
      "有来源的项目知识库",
    ],
    publishedAt: "2026-08-23",
    updatedAt: "2026-09-04",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "希望 Codex、Claude Code 或其他 coding agent 能复用可信项目知识的开发者",
    heroBullets: [
      "AGENTS.md 或 CLAUDE.md 只放每次都必须加载的短规则。",
      "代码、测试、规范与第一方文档继续作为单一事实来源。",
      "维护型知识页面只保存需要跨文件整理、有引用并反复复用的结论。",
    ],
    sections: [
      {
        heading: "一句话做法",
        body: [
          "把 coding agent 的项目知识分成三层：AGENTS.md 或 CLAUDE.md 放短而稳定的操作规则；代码、测试、规范与文档保留为单一事实来源；有来源的知识库保存需要跨文件整理、引用与审核的当前答案。",
          "Agent 接到任务时先读最小规则，再按问题获取一个相关 Page，最后回到引用、代码与测试验证。这比把全部内容塞进 instruction file，或每次重扫整个 repo 更容易保持当前与可检查。",
        ],
      },
      {
        heading: "AGENTS.md、CLAUDE.md 与知识库各做什么",
        body: [
          "AGENTS.md 适合放 build、test、branch、权限与禁区等 agent 无法只靠读 code 推出的规则；Claude Code 用户可用 CLAUDE.md 表达同一类项目指引。文件越长，越容易挤掉当前任务真正需要的 context。",
          "知识库不应复制 repo。架构理由、外部限制、跨文件结论、决策历史与已验证的操作手册，才适合维护成有引用的 Page。代码与测试一旦改变，Page 应进入 stale 或 review，而不是继续假装正确。",
        ],
        bullets: [
          "每次加载：不明显的项目规则与安全边界。",
          "单一事实来源：当前代码、测试、规范与第一方文档。",
          "按需知识：有来源、可审核、需要跨会话复用的结论。",
        ],
      },
      {
        heading: "建立 coding agent 可用的有来源工作流",
        body: [
          "先选一个会重复询问的小主题，例如 release 流程或数据迁移边界。完成 Wenlan 与 Codex 连接后，只加入能回答该主题的 Markdown、文本或可提取文字的 PDF；不要一开始导入整个 repository。",
          "把来源蒸馏成 Page 后，检查重要说法能回到来源，再运行 lint 与 review。只有 MCP 连接的 client 应使用该 client 显示的 Wenlan tools；下列 slash commands 适用于已安装 Wenlan plugin 的 client。",
        ],
        code: {
          label: "一个有界的 Codex 项目知识流程",
          code: "wenlan status\nwenlan connect codex\nwenlan sources add ~/project/docs\n/distill <项目主题>\n/pages <项目主题>\n/lint\n/curate",
        },
      },
      {
        heading: "每次任务只获取足够的 context",
        body: [
          "不要在每次 session 开始时重放全部文档。先用任务名称、错误症状或模块查询最相关的 Page，再沿引用打开真正需要的来源。如果答案直接存在当前 code 或 test，就让 agent 读原文件，不要多绕一层摘要。",
          "任务结束时只保存能影响未来工作的决策、限制、修正或交接。聊天摘要、临时探索与 agent 自己可以从 repo 推出的内容，不应自动升级为项目知识。",
        ],
      },
      {
        heading: "如何验证引用与不支持的答案",
        body: [
          "准备一个来源中有答案的问题、一个必须跨两份文档才能回答的问题，以及一个来源没有答案的问题。前两者不只要显示来源 ID，还要确认引用段落确实支持每个说法；最后一个应保持未知，不应因为文字流畅就补成确定结论。",
          "更新该 Page 已引用的一份来源，再确认 Page 明确进入 stale、refresh 或 review。另存一条带 supersedes 的新记录可以保留历史，但不能假设它会自动让仍连接旧来源的 Page 过期；重建后仍需人工审核。",
        ],
      },
      {
        heading: "什么时候不需要另一套知识库",
        body: [
          "如果信息已在一份短而当前的 README、规范或测试里，coding agent 直接读来源通常更准。只有当同一问题跨多个来源、反复出现，且重建答案的成本明显时，才值得维护额外的 source-backed Page。",
          "这条边界即使不使用 Wenlan 也成立：先维护权威来源，再决定哪些结论值得做成可查询、可引用、可刷新的项目知识。",
        ],
      },
    ],
    faqs: [
      {
        question: "AGENTS.md 应该放完整项目知识吗？",
        answer:
          "不应该。它只需放 agent 每次都要知道、又无法从 repo 自己推出的规则。较长的架构说明、决策与外部限制应留在权威文档或按需知识页面。",
      },
      {
        question: "知识库可以取代代码与测试吗？",
        answer:
          "不可以。代码、测试、规范与批准的第一方文档仍是权威；来源 ID 只是指针，不代表页面说法已被来源证明。更新被引用的来源后，应确认知识页面确实进入 stale，再重建与审核。",
      },
      {
        question: "Claude Code 也能用同一套方法吗？",
        answer:
          "可以。工具的命令入口不同，但短规则、权威来源、按需 Page、引用与验证的分层相同；Wenlan 也能让多个已连接 client 使用同一套本地知识。",
      },
    ],
    relatedSlugs: [
      "source-backed-wiki-pages-ai-work",
      "build-local-ai-knowledge-base-from-documents",
      "choose-ai-knowledge-base-tool",
      "when-ai-agent-should-query-knowledge-base",
      "distilled-wiki-pages-ai-memory",
    ],
    officialReferences: [
      {
        label: "OpenAI harness engineering",
        href: "https://openai.com/index/harness-engineering/",
      },
      {
        label: "AGENTS.md 开放格式",
        href: "https://agents.md/",
      },
      {
        label: "Wenlan 与 AI client 设置",
        href: "https://github.com/7xuanlu/wenlan/blob/main/docs/setup-with-ai.md",
      },
      {
        label: "Wenlan 有来源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Wenlan 审核与信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
    ],
    cta: {
      heading: "先让 Codex 验证一个项目主题",
      body: "连接 Codex、加入一组可检查来源，再确认 Page 的引用、刷新与审核都从属于当前 repo。",
    },
  },
  "build-local-ai-knowledge-base-from-documents": {
    slug: "build-local-ai-knowledge-base-from-documents",
    eyebrow: "实作",
    category: "Workflows",
    title: "如何用 Markdown、PDF 与 Obsidian 建立本地 AI 知识库",
    description:
      "从一个文档范围开始，用可重复同步的 Sources、有来源的 Pages 与验证步骤，建立 AI agent 真正能复用的本地知识库。",
    metaTitle: "用 Markdown、PDF 与 Obsidian 建立 AI 知识库 | Wenlan",
    metaDescription:
      "用 Markdown、文本文件、文本型 PDF、文件夹或 Obsidian vault 搭建本地 AI 知识库，并验证同步、来源与维护型页面。",
    keywords: [
      "搭建 AI 知识库",
      "本地 AI 知识库",
      "AI 知识库搭建",
      "开源 AI 知识库",
      "Markdown AI 知识库",
      "PDF AI 知识库",
      "Obsidian AI 知识库",
      "AI agent 知识库",
      "Wenlan 文澜",
    ],
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-01",
    author: "Qi-Xuan Lu",
    readingTime: "7 分钟阅读",
    audience: "想让 Claude Code、Codex、Cursor 或其他 AI agent 使用本地文档的简体中文用户",
    heroBullets: [
      "先选一个文件或文件夹，不要一次导入全部资料。",
      "支持 Markdown、文本文件、可提取文字的 PDF 与 Obsidian vault。",
      "先验证同步与来源，再信任 AI 整理出的页面。",
    ],
    sections: [
      {
        heading: "一句话做法",
        body: [
          "先按操作系统安装 Wenlan runtime、连接当前使用的 AI 客户端并验证连接，再对一个 `.md`、`.txt`、可提取文字的 `.pdf`、文件夹或 Obsidian vault 执行 `wenlan sources add <path>`。同一路径再次执行会重新同步。",
          "来源能回答真实问题后，在已安装 Wenlan plugin 的 Claude Code 或 Codex 使用 `/distill <主题>`、`/pages`、`/lint` 与 `/curate`；只有 MCP 连接的客户端则使用该客户端显示的 Wenlan 工具完成同一流程。",
        ],
      },
      {
        heading: "先划定支持的来源范围",
        body: [
          "Wenlan 的 Directory Source 会读取单一文件或递归扫描文件夹，支持 `.md`、`.txt` 与能直接提取文字的 `.pdf`。Obsidian vault 可作为只读 Markdown 来源，人写的原始文件仍由 vault 管理。",
          "扫描型 PDF 必须先做 OCR；任意源代码文件目前不属于 Directory Source 的支持范围。代码、测试与项目原生文档仍应是权威，知识库负责维护可检查的综合答案。",
        ],
      },
      {
        heading: "建立最小文档到页面流程",
        body: [
          "先选一个会重复询问的主题和一小组文档，让错误、跳过与缺少来源都看得见。",
        ],
        bullets: [
          "执行 sources add，确认 found、ingested、skipped 与 errors 数量。",
          "修改来源后重跑同一命令，确认同步结果符合预期。",
          "来源足够时才 distill，不用把每份文档都变成 Page。",
          "打开 Page，核对重要结论能回到来源或引用。",
          "执行 lint 与 curate，处理薄弱、冲突、过期或待审核内容。",
        ],
        code: {
          label: "完成平台与客户端设置后",
          code: "wenlan status\nwenlan sources add ~/Knowledge/project-docs",
        },
      },
      {
        heading: "如何验收，而不是只看导入成功",
        body: [
          "用一个来源中存在的问题和一个来源中不存在的问题测试。前者应能找到支持材料，后者不应被补成确定答案。接着修改一份文档、重新同步，确认 Page 能显示需要刷新或产生可审核修订。",
          "验收重点是来源边界、同步结果、引用与修订，不是一次导入多少文件。这让知识库即使不使用 Wenlan，也有可重复的质量标准。",
        ],
      },
      {
        heading: "何时再扩大资料范围",
        body: [
          "只有当一个主题能完成来源、同步、Page、lint 与 review 闭环后，才加入下一个文件夹或 vault。这能避免同名文档、过期版本与无关内容一起进入检索结果。",
        ],
        link: {
          label: "了解有来源 AI 知识库的维护架构",
          href: "/learn/source-backed-wiki-pages-ai-work",
        },
      },
    ],
    faqs: [
      {
        question: "Wenlan 会改写我的 Obsidian vault 吗？",
        answer:
          "不会。vault 会作为只读来源重新扫描与索引，原始 Markdown 仍由你管理；Pages 导出或 symlink 是另一个明确选择。",
      },
      {
        question: "扫描型 PDF 可以直接加入吗？",
        answer:
          "不行。PDF 必须能直接提取文字；只有图片的扫描型 PDF 需要先经过 OCR，再把可读文本纳入来源。",
      },
      {
        question: "这和把文档上传到聊天机器人有什么不同？",
        answer:
          "聊天附件通常只服务当次对话；这个流程会保留可重复同步的本地来源，并建立能检查引用、过期状态与修订的维护型 Page。",
      },
    ],
    relatedSlugs: [
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
        label: "Wenlan 平台与客户端设置",
        href: "https://github.com/7xuanlu/wenlan/blob/main/docs/setup-with-ai.md",
      },
      {
        label: "Wenlan 支持的文档来源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "wenlan sources add CLI",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-cli/README.md#wenlan-sources-add-path",
      },
      {
        label: "Wenlan 有来源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
    ],
    cta: {
      heading: "先用一个文件夹验证完整闭环",
      body: "安装 Wenlan，加入一组可检查的文档，再验证同步、Page、引用与审核流程。",
    },
  },
  "choose-ai-knowledge-base-tool": {
    slug: "choose-ai-knowledge-base-tool",
    eyebrow: "选型指南",
    category: "Workflows",
    title: "如何选 AI 知识库工具：8 个真正重要的检查",
    description:
      "先分清文档问答、RAG、笔记工具与维护型知识库，再用来源、更新、审核、数据控制与实测结果选择工具。",
    metaTitle: "如何选 AI 知识库工具：8 个检查 | Wenlan",
    metaDescription:
      "用 8 个实际测试选择 AI 知识库工具，比较文档问答、RAG、本地笔记与跨 AI agent 维护知识的区别。",
    keywords: [
      "AI 知识库工具",
      "AI 知识库软件推荐",
      "如何选 AI 知识库",
      "本地 AI 知识库工具",
      "开源 AI 知识库",
      "AI agent 知识库",
      "AI 知识库比较",
      "Wenlan 文澜",
    ],
    publishedAt: "2026-08-02",
    updatedAt: "2026-09-07",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "正在选择文档问答、RAG、本地笔记或跨 AI agent 知识系统的简体中文用户",
    heroBullets: [
      "先选运行模式，再比较功能列表。",
      "用来源变化与冲突测试答案是否仍可追溯、可更新。",
      "用自己的小型文档集对每个候选工具执行同一套验收。",
    ],
    sections: [
      {
        heading: "先分清你需要哪一种 AI 知识库",
        body: [
          "不要先问哪个工具最好。先判断需要的是当次会话的文档上传、针对一组文档的 RAG 问答、让 AI 直接读取笔记或 Markdown vault，还是跨会话与多个 agent 维护有来源的当前答案。",
          "这四种模式可以组合，但解决的问题不同。把它们放在同一张功能表比较，通常会选到不符合实际工作方式的产品。",
        ],
      },
      {
        heading: "8 个真正重要的检查",
        body: ["用一小组有代表性的文档，先写下预期答案，再对每个候选工具做相同测试。"],
        bullets: [
          "来源可追溯：重要答案能否打开支持它的确切来源或引用？",
          "更新状态：来源变化后，哪些答案过期、哪些需要刷新是否看得见？",
          "冲突与审核：矛盾证据会进入明确审核，还是被模型静默改写？",
          "数据所有权与导出：能否保留或导出可读文件与历史，不被单一服务绑定？",
          "隐私边界：哪些文件、提示、检索片段与模型调用会离开电脑？",
          "Agent 互通：同一份知识能否供实际使用的 Claude Code、Codex、Cursor 或 ChatGPT 读取？",
          "输入限制：真正支持哪些格式、扫描文档、文件夹、vault 与文件大小？",
          "可重复验收：工具能否处理可回答、不可回答、跨来源三种问题，并在来源修改后得到正确结果？",
        ],
      },
      {
        heading: "一组能暴露问题的验收资料",
        body: [
          "不要一开始导入整个资料库。准备一份干净来源、一份过期版本、一组互相矛盾的说法，以及一个资料中没有答案的问题。好的工具应该暴露不确定性和冲突，而不是只生成流畅文字。",
          "修改其中一份来源后重跑相同问题。如果答案不会显示过期、引用仍指向旧内容，或无法判断哪些页面需要更新，这套系统就还不适合承担长期知识。",
        ],
      },
      {
        heading: "Wenlan 适合哪一种模式",
        body: [
          "Wenlan 对应维护型、有来源的本地知识层。Sources、原子知识与 Pages 分开保存；Claude Code、Codex、Cursor、ChatGPT 等客户端通过 plugin 或 MCP 使用同一套知识；引用、过期状态、修订与人工审核保持可见。",
          "完成平台与客户端设置后，可以用一个小型来源集验证，而不是只相信产品描述。",
        ],
        code: {
          label: "Wenlan 验证流程",
          code: "wenlan status\nwenlan sources add ~/Knowledge/evaluation-set\n/distill <测试主题>\n/pages <测试主题>\n/lint\n/curate",
        },
      },
      {
        heading: "什么时候不该增加另一套知识库",
        body: [
          "如果只是阅读一份短文档、现有 wiki 已由团队稳定维护，或 AI 不需要跨会话复用答案，直接文档阅读或当前笔记工具可能已经足够。",
          "选择标准不是功能最多，而是以最低维护成本通过你的来源、更新、冲突、隐私与可重复验收。",
        ],
      },
    ],
    faqs: [
      {
        question: "最好的 AI 知识库一定是 RAG 工具吗？",
        answer:
          "不一定。RAG 很适合在提问时找来源片段，但有些需求只要临时读文档，另一些则需要跨会话维护可审核、可复用的答案。",
      },
      {
        question: "测试时应该导入全部资料吗？",
        answer:
          "不用。先用包含干净来源、过期版本、冲突与无答案问题的小型资料集。工具通过后再逐步扩大。",
      },
      {
        question: "开源就代表数据一定不会离开本机吗？",
        answer:
          "不代表。仍要检查存储位置、模型提供方、embedding 与 reranking 调用，以及远程同步或遥测设置。",
      },
    ],
    relatedSlugs: [
      "fix-pdf-ingestion-ai-knowledge-base",
      "coding-agent-source-backed-knowledge-base",
      "build-local-ai-knowledge-base-from-documents",
      "source-backed-wiki-pages-ai-work",
      "distilled-wiki-pages-ai-memory",
      "verify-ai-knowledge-base-citations",
      "test-ai-knowledge-base-retrieval-after-changes",
    ],
    officialReferences: [
      {
        label: "Wenlan 知识模型",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan 支持的文档来源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan MCP 客户端",
        href: "https://wenlan.app/docs/mcp-clients",
      },
      {
        label: "Wenlan 审核与信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "Wenlan 数据与隐私",
        href: "https://wenlan.app/docs/data-and-privacy",
      },
    ],
    cta: {
      heading: "用同一套 8 项检查测试 Wenlan",
      body: "从一组小型来源开始，验证引用、更新与审核，再判断维护型本地知识层是否适合你的工作流。",
    },
  },
  "test-ai-knowledge-base-retrieval-after-changes": {
    slug: "test-ai-knowledge-base-retrieval-after-changes",
    eyebrow: "召回回归测试",
    category: "Workflows",
    title: "AI 知识库改版后，怎么做 RAG 召回回归测试？",
    description:
      "用版本化黄金评测集，对比语料、Embedding、切块、混合检索或 reranker 改动前后，是否仍能召回预期来源。",
    metaTitle: "RAG 召回回归测试与黄金评测集 | Wenlan",
    metaDescription:
      "用黄金问题、预期来源、Recall@k、MRR、无答案案例、失败分类与回滚，验证 AI 知识库改版后的召回质量。",
    keywords: [
      "RAG 召回回归测试",
      "RAG 黄金评测集",
      "知识库检索怎么评测",
      "Embedding 升级召回漂移",
      "RAG reranker 测试",
      "AI 知识库检索评估",
    ],
    publishedAt: "2026-08-26",
    updatedAt: "2026-08-26",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "正在更换 AI 知识库语料、Embedding、切块、混合检索或 reranker 的开发者",
    heroBullets: [
      "改检索前，先固定代表性问题与预期来源。",
      "一次改一个因素，先对比召回，再评估生成回答。",
      "逐条检查退步案例，原因没查清前保留回滚能力。",
    ],
    sections: [
      {
        heading: "先说结论",
        body: [
          "要验证 AI 知识库改版后的检索质量，先建立一份有版本的黄金评测集：每题记录自然提问、预期 source ID 或文档、无答案案例与基准配置。改动一项语料或检索因素后，重跑同一批问题，先对比召回结果，再检查丢失或新增的来源，差异能够解释才接受新版本。",
          "这和引用校验不同。引用校验从一个已经生成的回答出发，检查来源是否支持每个主张；召回回归测试发生在生成之前，确认改版后是否仍能取回原本应该出现的证据。",
        ],
      },
      {
        heading: "哪些改动之后要重跑？",
        body: [
          "新增、删除或更新来源文档，更换 Embedding，调整 chunk size、metadata filter、BM25 与向量权重、top-k 或 reranker，都可能让部分问题变好，却让另一些问题找不到原来的证据。不要只用一道 demo 题判断整体成功。",
        ],
        bullets: [
          "收录常见真实问题、已知失败、边界案例，以及知识库不应该回答的问题。",
          "每个预期结果旁保留权威来源版本，来源真的改变时才明确更新标签。",
          "新系统与黄金答案不同时，先调查原因，不要直接把新结果 bless 成正确。",
        ],
      },
      {
        heading: "黄金评测集至少记录什么？",
        body: [
          "每个案例需要稳定 ID、用户自然问题、预期来源、禁止出现的来源、是否允许无答案，以及这道题为什么重要。语料版本与检索配置要单独保存，否则两次结果无法公平比较。",
        ],
        code: {
          label: "最小黄金案例",
          code: "version: 1\ncorpus_revision: docs-2026-08-26\ncases:\n  - id: windows-installer\n    query: Windows 桌面版应该下载哪个文件？\n    expected_sources: [release-v0.16.0]\n    excluded_sources: [runtime-zip]\n    no_answer: false\n  - id: enterprise-price\n    query: 企业版价格是多少？\n    expected_sources: []\n    no_answer: true",
        },
      },
      {
        heading: "固定基线，一次只改一个因素",
        body: [
          "记录语料 revision、Embedding 模型、切块参数、filter、混合检索权重、reranker 版本、top-k 与运行环境。能一次只改一项最好；同时改很多项时，测试也许看得出 drift，却无法指出原因。",
          "先对比 source-level Recall@k 或 Hit@k；排序重要时再看 MRR 或 NDCG。无答案案例与 latency 要分开保留，不要把所有数字合成一个分数，掩盖关键来源消失。",
        ],
      },
      {
        heading: "先查召回失败，再看回答好不好",
        body: [
          "对每个失败案例，依次检查 query rewrite、召回片段、分数、source ID、filter、融合结果、reranker 与最终排序。把文档缺失、错误标签、提取失败、metadata filter、Embedding drift、切块边界与 reranker 变化分开。",
          "预期来源本身也可能标错；反过来，整体平均分数很好，也可能漏掉一个高风险问题。只有预期证据确实被取回后，才继续评估 grounding、回答质量与引用。",
        ],
      },
      {
        heading: "诚实使用 Wenlan 的 maintainer drift test",
        body: [
          "Wenlan repository 维护了带标签的检索 fixtures、仅针对 retrieval 的 Recall@5、MRR、NDCG@10 快照、固定 ranking goldens，以及 main canary 使用的 ignored drift test。它检测的是相对可信基线的漂移，不是绝对正确性。",
          "这是 Wenlan 维护者工作流，不是已发布的 `wenlan eval` 用户命令，也不是 hosted CI 功能。即使不用 Wenlan，你仍可把黄金评测集、来源版本与回滚决策保存在自己的 repository。",
        ],
        code: {
          label: "仅供 Wenlan repository 维护者使用",
          code: "cargo test -p wenlan-core --lib \\\n  eval::retrieval_drift::tests::ranking_drift_vs_golden \\\n  -- --ignored --nocapture",
        },
      },
    ],
    faqs: [
      {
        question: "RAG 黄金评测集需要准备多少题？",
        answer:
          "先覆盖重要来源、常见问题、已知失败与无答案行为。少量但经过人工验证的案例，比大量错误标签更有用；之后再从真实失败持续补充。",
      },
      {
        question: "语料改变后，可以直接更新黄金答案吗？",
        answer:
          "只有权威来源契约确实改变时才更新。先对照新旧来源、记录理由并创建新版本，不能因为新召回结果不同就静默 bless。",
      },
      {
        question: "召回回归测试通过，就代表回答一定正确吗？",
        answer:
          "不代表。它只证明测试范围内的检索符合契约；生成质量、引用是否支持主张，以及来源本身是否正确，都要单独检查。",
      },
    ],
    relatedSlugs: [
      "verify-ai-knowledge-base-citations",
      "source-backed-wiki-pages-ai-work",
      "choose-ai-knowledge-base-tool",
      "fix-pdf-ingestion-ai-knowledge-base",
      "when-ai-agent-should-query-knowledge-base",
      "build-customer-support-answer-knowledge-base",
      "build-course-wiki-from-lecture-notes",
    ],
    officialReferences: [
      {
        label: "Wenlan 评估方法",
        href: "https://wenlan.app/docs/evaluation",
      },
      {
        label: "Wenlan retrieval drift source",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-core/src/eval/retrieval_drift.rs",
      },
      {
        label: "RAG 知识库召回调试指南",
        href: "https://www.promptnet.cn/2026/06/09/rag-knowledge-base-retrieval-debugging/",
      },
      {
        label: "Embedding 升级召回漂移指南",
        href: "https://segmentfault.com/a/1190000048058746",
      },
      {
        label: "CRUD-RAG 评测基准",
        href: "https://github.com/IAAR-Shanghai/CRUD_RAG",
      },
    ],
    cta: {
      heading: "先固定一份召回基线",
      body: "选择代表性项目问题，记录预期来源与版本，再开始更换 Embedding、切块或 reranker。",
    },
  },
  "verify-ai-knowledge-base-citations": {
    slug: "verify-ai-knowledge-base-citations",
    eyebrow: "引用排错",
    category: "Workflows",
    title: "AI 知识库引用对不上？逐项验证来源与无依据回答",
    description:
      "把 RAG 或 AI 知识库回答拆成可检查的主张，找出错页、错片段、过期来源与没有证据支持的结论。",
    metaTitle: "AI 知识库引用对不上？验证来源与回答 | Wenlan",
    metaDescription:
      "逐项验证 AI 知识库引用，诊断错页、错片段、过期版本与无依据回答，并建立可重复的来源检查流程。",
    keywords: [
      "AI 知识库引用对不上",
      "验证 AI 知识库引用",
      "知识库回答无依据",
      "RAG 引用错误",
      "引用溯源",
      "AI 知识库来源校验",
    ],
    publishedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    author: "Qi-Xuan Lu",
    readingTime: "7 分钟阅读",
    audience: "看到 AI 回答附了引用，却发现页码、片段、版本或内容对不上的简体中文用户",
    heroBullets: [
      "有引用标记，只代表系统附上来源，不代表来源真的支持这句话。",
      "每个重要主张都要回到准确页面、片段与文档版本检查。",
      "检查结果分成支持、部分支持、无依据与过期，不用一个模糊分数带过。",
    ],
    sections: [
      {
        heading: "先说结论：引用存在，不等于回答有依据",
        body: [
          "验证 AI 知识库回答时，先把文字拆成可单独判断的事实主张，再逐项打开它引用的页面或片段。只有当前版本的来源完整支持主张的内容、范围、数字与归属，这一项才算通过。",
          "如果引用打不开、指向错页、只支持半句话、引用的是旧版本，或来源根本没说这件事，就要分别记录。不要因为回答读起来合理，或页尾列了三个来源，就把它当成已验证。",
        ],
      },
      {
        heading: "先分清五种引用失败",
        body: [
          "缺少引用、链接失效、引用错页、来源不支持主张，以及来源已过期，是五个不同问题。分类正确，才知道应该修检索、metadata、文档版本，还是直接撤回结论。",
        ],
        bullets: [
          "缺少：重要事实没有任何可检查来源。",
          "失效：source ID、链接、页码或片段已经无法打开。",
          "错配：来源存在，但指向另一页、另一段或另一个主张。",
          "无依据：来源内容没有支持回答得出的结论。",
          "过期：旧版本曾支持，但当前文档、代码或政策已经变化。",
        ],
      },
      {
        heading: "逐项做 claim-to-evidence 校验",
        body: [
          "从一个可疑回答开始，为每个事实主张记录引用标记、source ID、文档名称、页码或段落，以及能取得的版本。打开原文后，判断它是完整支持、部分支持、无依据还是过期。",
          "数字、否定词、适用范围、作者归属与日期要分开检查。相邻段落看起来很像，也可能正好否定回答；缺数据时应标记未知，不能把 unavailable 当成通过。",
        ],
        code: {
          label: "检查一个 Wenlan Page",
          code: "/pages <主题>\n/lint\n/curate",
        },
      },
      {
        heading: "修正后用同一个问题重测",
        body: [
          "找到错页或无依据主张后，先修正来源 metadata、删除错误结论，或把 Page 标记为需要刷新与审核。接着用同一个问题重跑，确认答案回到预期来源，而不是换一个看似合理的错误片段。",
          "Wenlan 把 Sources、原子知识与维护型 Pages 分开，并提供 source IDs、修订、stale 状态、lint 与人工审核；这让证据路径可检查，但不会自动保证来源本身正确。",
        ],
      },
      {
        heading: "这不是自动化真实性分数",
        body: [
          "这套方法是可重复的排错清单，不是宣称一个分数就能证明整套 RAG 正确。高风险结论仍要回到当前第一方来源，必要时由熟悉领域的人审核。",
          "即使不使用 Wenlan，也可以用同一张表记录 claim、来源位置、版本、判定与修正结果；它的独立价值在于让『哪一句没有依据』变得具体。",
        ],
      },
    ],
    faqs: [
      {
        question: "回答有引用，就代表没有幻觉吗？",
        answer:
          "不代表。引用可能指向错页、错片段、旧版本，或只支持部分内容；每个重要主张仍需对照原文。",
      },
      {
        question: "引用页面不对时应该怎么修？",
        answer:
          "先记录为引用错配，再寻找真正支持主张的当前来源。找不到就撤回或标记未知，不要因为回答听起来合理而保留。",
      },
      {
        question: "Wenlan 能自动证明来源一定正确吗？",
        answer:
          "不能。Wenlan 让来源、source IDs、修订与审核可见，但来源的权威性与重要结论仍需人工判断。",
      },
    ],
    relatedSlugs: [
      "prevent-multi-agent-knowledge-conflicts",
      "fix-pdf-ingestion-ai-knowledge-base",
      "source-backed-wiki-pages-ai-work",
      "choose-ai-knowledge-base-tool",
      "distilled-wiki-pages-ai-memory",
      "when-ai-agent-should-query-knowledge-base",
      "coding-agent-source-backed-knowledge-base",
      "test-ai-knowledge-base-retrieval-after-changes",
      "source-backed-research-knowledge-base",
      "build-client-project-knowledge-base-for-consulting",
      "build-investment-research-knowledge-base",
      "build-product-research-knowledge-base-for-prd",
      "build-sre-incident-knowledge-base",
      "build-ict-supplier-due-diligence-evidence-pack",
      "build-customer-support-answer-knowledge-base",
      "build-business-metric-definition-knowledge-base",
      "build-course-wiki-from-lecture-notes",
    ],
    officialReferences: [
      {
        label: "Anthropic 简体中文引用文档",
        href: "https://platform.claude.com/docs/zh-CN/build-with-claude/citations",
      },
      {
        label: "Open WebUI 引用错误来源 issue",
        href: "https://github.com/open-webui/open-webui/issues/12655",
      },
      {
        label: "Open WebUI 重复片段引用 issue",
        href: "https://github.com/open-webui/open-webui/issues/20435",
      },
      {
        label: "Wenlan 审核与信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
    ],
    cta: {
      heading: "先验证一个回答，再扩大知识库",
      body: "用 Wenlan 打开 Page、来源、过期状态、lint 与审核路径，只保留当前证据真正支持的主张。",
    },
  },
  "source-backed-research-knowledge-base": {
    slug: "source-backed-research-knowledge-base",
    eyebrow: "研究工作流",
    category: "Workflows",
    title: "如何用论文与 PDF 建立可追溯的研究知识库",
    description:
      "从一组已经选定的论文建立研究知识库，保留文献矩阵、方法、局限、矛盾、引用与来源更新。",
    metaTitle: "用论文与 PDF 建立可追溯研究知识库 | Wenlan",
    metaDescription:
      "用已经选定的论文与文本型 PDF 建立研究知识库，保留文献矩阵、准确引用、矛盾、局限与来源更新。",
    keywords: [
      "用论文 PDF 建立研究知识库",
      "AI 论文笔记保留引用",
      "论文知识库 文献综述",
      "可追溯来源的研究笔记",
      "文献矩阵 AI",
      "研究知识管理",
    ],
    publishedAt: "2026-08-27",
    updatedAt: "2026-08-27",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "已经选好一组论文，希望整理文献又不丢失引用、矛盾与研究局限的学生和研究者",
    heroBullets: [
      "先固定一个研究问题和一组已经取得的论文，不把自动找文献混入同一工作。",
      "每个主张、方法、样本、结果与局限都回到准确页面或段落。",
      "新论文加入时分别更新共识、矛盾与未知，不重写成一段流畅结论。",
    ],
    sections: [
      {
        heading: "先回答：研究知识库应该保存什么",
        body: [
          "从一个研究问题和一组已经选定的论文开始。原始论文保持权威，研究知识库保存可检查的文献矩阵：主张、方法、样本、结果、局限、准确来源位置与当前验证状态。",
          "这不是请 AI 代写文献综述。真正有用的产物会把一致、矛盾与未知分开，让下一位读者能从每个综合结论回到原文重新判断。",
        ],
      },
      {
        heading: "先把来源范围缩到能逐项验证",
        body: [
          "只加入当前研究问题需要的论文。Wenlan 可以读取 Markdown、文本文件、可直接提取文字的 PDF、文件夹与只读 Obsidian vault；图片型或扫描 PDF 必须先在外部完成 OCR。",
          "Wenlan 不会搜索学术数据库、查找 DOI、导入 Zotero、设置参考文献格式或判断研究质量。选文、方法评估、统计解读与学术诚信仍由研究者负责。",
        ],
      },
      {
        heading: "建立可以重做的文献矩阵",
        body: [
          "每个重要结果各占一行，不要先写成一段总结。字段至少包含 paper、claim、method、sample、result、limitation、page 或 section、版本与验证状态。",
        ],
        bullets: [
          "研究问题与纳入范围：说明这一轮包含和排除了哪些论文。",
          "方法与样本：避免把不同设计和人群直接合并。",
          "结果与局限：把作者实际报告和你的解读分开。",
          "引用位置：保存页码、段落、source ID 与能取得的版本。",
          "证据状态：标记支持、部分支持、无依据、矛盾或待查。",
        ],
        code: {
          label: "完成 Wenlan 与 AI 客户端设置后",
          code: "wenlan status\nwenlan sources add ~/Research/papers\n/distill <研究问题>\n/pages <研究问题>\n/lint\n/curate",
        },
      },
      {
        heading: "不要把矛盾与局限磨成假共识",
        body: [
          "两篇论文结果不同时，先比较样本、方法、时间、适用范围与局限，再判断能否形成更窄的结论。证据不足就保留未知，不要为了让笔记好读而补成一致答案。",
          "重要数字、否定词、作者归属和范围都要打开引用段落核对。引用存在只代表有路径，不代表来源本身正确，也不代表它完整支持这句话。",
        ],
        link: {
          label: "查看逐项引用校验工作流",
          href: "/learn/verify-ai-knowledge-base-citations",
        },
      },
      {
        heading: "新论文加入时只刷新受影响的综合",
        body: [
          "加入新论文或替换修订版后，重新同步来源，标出哪些矩阵行和结论受到影响，再生成可审核的 Page 修订。保留旧版本与变更原因，才能看出知识如何变化。",
          "最后保留一份人能直接阅读的研究笔记。Wenlan 可以维护来源、Page、引用、stale 状态与修订，但研究者仍负责解读、引用格式与最终写作。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 可以帮我找论文或直接写文献综述吗？",
        answer:
          "不可以。请先用适合的学术搜索工具选好论文。Wenlan 负责维护可检查的来源与研究综合，不取代检索、选文、引用格式、解读或作者责任。",
      },
      {
        question: "不同论文互相矛盾时怎么处理？",
        answer:
          "分别保留每篇研究的方法、样本、结果、局限与来源位置，再明确标记矛盾。只有证据支持时才写成更窄的综合，否则保持未知。",
      },
      {
        question: "扫描型 PDF 能直接加入吗？",
        answer:
          "不能。PDF 必须能直接提取文字；只有图片的扫描文件要先做 OCR，再把可读文本纳入研究来源。",
      },
    ],
    relatedSlugs: [
      "build-local-ai-knowledge-base-from-documents",
      "verify-ai-knowledge-base-citations",
      "source-backed-wiki-pages-ai-work",
      "choose-ai-knowledge-base-tool",
      "build-ict-supplier-due-diligence-evidence-pack",
    ],
    officialReferences: [
      {
        label: "Wenlan 支持的文档来源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan 有来源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "台湾大学生成式 AI 研究与引用指南",
        href: "https://www.lib.ntu.edu.tw/img/tulblog/HELP/HELP_20260525_AI.pdf",
      },
      {
        label: "Distill 研究工作区",
        href: "https://github.com/luisalarcon-gauntlet/Distill",
      },
      {
        label: "UReKA 研究知识工作流",
        href: "https://github.com/Agents4Academia-AI/UReKA",
      },
    ],
    cta: {
      heading: "先建立一份能逐项检查的研究笔记",
      body: "加入一组有界论文、建立文献矩阵，再确认每个重要综合都能回到当前来源。",
    },
  },
  "build-client-project-knowledge-base-for-consulting": {
    slug: "build-client-project-knowledge-base-for-consulting",
    eyebrow: "咨询工作流",
    category: "Workflows",
    title: "咨询顾问如何建立客户项目知识库：从调研到交接",
    description:
      "把单一咨询项目的来源、调研、决策、交付物与交接信息整理成可追溯、可更新的客户项目知识库。",
    metaTitle: "咨询顾问如何建立客户项目知识库 | Wenlan",
    metaDescription:
      "建立单一客户范围的咨询项目知识库，管理调研来源、决策、交付物、过期证据与项目交接。",
    keywords: [
      "咨询顾问 客户项目 知识库",
      "咨询项目 调研资料 交付",
      "客户研究 知识库 来源引用",
      "咨询 项目知识管理",
      "咨询交付物 来源追溯",
    ],
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "需要交付调研、建议与项目交接的独立顾问、小型咨询团队和研究分析人员",
    heroBullets: [
      "每个客户使用独立来源边界，不把不同咨询项目混在一起。",
      "调研、决策与交付物主张都能回到客户已批准的当前来源。",
      "交接时留下待办、过期证据、风险与下一位负责人。",
    ],
    sections: [
      {
        heading: "先回答：一个客户，一个可检查的知识边界",
        body: [
          "每个咨询项目建立独立的客户项目知识库。只加入本次合作批准使用的提案、范围、访谈记录、调研来源、决策与交付物，并把待确认问题分开保存。",
          "重点不是把所有文件交给 AI，而是让下一份演示、报告或交接中的重要主张，都能回到当前来源、决策日期与负责人。",
        ],
      },
      {
        heading: "先分开客户、方法与敏感资料",
        body: [
          "客户事实与文件不得进入共享文件夹。可以复用的通用方法、模板与公开研究应放在另一个明确边界，并确认合同允许复用。",
          "先用非敏感示例验证流程。Wenlan 的本地优先存储不会替代客户同意、权限控制、保留政策、脱敏、合规或安全文档系统。",
        ],
      },
      {
        heading: "建立来源、决策与交付物闭环",
        body: [
          "为每个重要决策记录日期、负责人、依据、替代方案，以及什么新证据会重新开启它。交付物中的数字、结论与建议，要逐项核对来源与版本。",
        ],
        bullets: [
          "建立一个客户 Space 与一个批准来源文件夹。",
          "加入 scope、调研、访谈记录、决策记录与当前交付物。",
          "把重复使用的项目问题整理成有来源 Page。",
          "来源改变时只刷新受影响 Page，无法确认的主张标为 stale。",
          "分享前执行 lint 与人工审核。",
        ],
        code: {
          label: "完成 Wenlan 与 AI 客户端设置后",
          code: "wenlan status\nwenlan sources add ~/Clients/acme-approved-sources\n/distill <客户项目问题>\n/pages <客户项目问题>\n/lint\n/curate\n/handoff",
        },
      },
      {
        heading: "交接要让下一位顾问能够重做判断",
        body: [
          "交接至少包含当前范围、已接受决策、未决问题、交付物状态、来源边界、过期证据、已知风险与下一位负责人。不要只留一段流畅摘要。",
          "Wenlan 可以维护 Sources、Memories、Pages、引用、修订、stale 状态与审核，但不会自动连接 CRM、邮件或日历，也不提供 RBAC、自动脱敏、计费或项目管理。",
        ],
      },
    ],
    faqs: [
      {
        question: "所有客户可以共用同一个知识库吗？",
        answer:
          "不应该。每个咨询项目要有独立来源边界与 Space；只有明确允许复用的通用方法或模板可以放在另一个共享范围。",
      },
      {
        question: "Wenlan 会替我处理客户机密与权限吗？",
        answer:
          "不会。Wenlan 让本地、有来源的知识可检查，但不是 CRM、文档权限、脱敏或合规系统；必须先应用客户批准的安全与保留规则。",
      },
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
        label: "Wenlan 知识模型与 Spaces",
        href: "https://github.com/7xuanlu/wenlan#what-does-wenlan-build",
      },
      {
        label: "Wenlan 日常工作流程",
        href: "https://github.com/7xuanlu/wenlan#daily-workflow",
      },
      {
        label: "Cogni Consult 客户交付工作区",
        href: "https://github.com/cogni-work/insight-wave/tree/main/cogni-consult",
      },
      {
        label: "AI Consulting Methodology 咨询项目生命周期",
        href: "https://github.com/mardy123/AI-Consulting-Methodology-Toolkit/blob/main/06_Delivery/ENGAGEMENT_LIFECYCLE.md",
      },
      {
        label: "市场研究工作流参考",
        href: "https://github.com/genli-ai/market-research-skills/blob/main/skills/analyst-research/references/workflow_medium.zh.md",
      },
    ],
    cta: {
      heading: "先建立一份可检查的客户交接",
      body: "分开客户来源、验证一个交付物主张，再留下下一位顾问能重做判断的交接。",
    },
  },
  "build-investment-research-knowledge-base": {
    slug: "build-investment-research-knowledge-base",
    eyebrow: "投资研究工作流",
    category: "Workflows",
    title: "如何建立投资研究知识库：从财报、公告到投资论点",
    description:
      "把财报、公告、业绩说明会材料和研究问题整理成可追溯的公司研究档案，并在新证据出现时更新论点。",
    metaTitle: "如何建立投资研究知识库 | Wenlan",
    metaDescription:
      "用财报、年报、公告和业绩说明材料建立有来源的投资研究知识库，保留引用、论点变化与过期证据审核。",
    keywords: [
      "AI 投研知识库",
      "财报 研报 公告 知识库",
      "投资研究知识库",
      "投研资料 可追溯",
      "公司研究 来源引用",
    ],
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    author: "Qi-Xuan Lu",
    readingTime: "9 分钟阅读",
    audience: "使用财报、公告和业绩说明材料做研究的证券研究员、独立投资者和财务专业人员",
    heroBullets: [
      "一家公司和一个报告期使用明确来源边界。",
      "每个重要主张都回到当前财报、公告或业绩说明材料。",
      "记录哪些证据变化、哪些与论点矛盾，以及哪些问题仍未解决。",
    ],
    sections: [
      {
        heading: "先回答：研究档案要能从论点回到原始材料",
        body: [
          "为每家公司建立独立的投资研究知识库，只加入你有权使用的当前年报、财报、公司公告、业绩说明材料和有日期的会议笔记。至少维护来源登记表、指标与指引变化、投资论点、矛盾记录和待查问题。",
          "Wenlan 可以维护有来源 Page、引用、修订、stale 状态、lint 和人工审核；它不提供实时行情、付费研报或逐字稿、XBRL 或表格解析、估值计算、投资组合监控、交易信号或投资建议。",
        ],
      },
      {
        heading: "先固定公司、报告期和来源版本",
        body: [
          "来源登记表至少记录公司、文件类型、报告期、发布日期、修订版、权威来源和本地文件名。将公司披露事实、自己的计算和投资判断分开，不要把分析推断写成公司表述。",
          "扫描 PDF 必须先在外部完成 OCR。财务报表、表格和计算仍应回到原始披露材料和可复算的表格或模型核对。",
        ],
      },
      {
        heading: "建立一个财报到论点的更新闭环",
        body: [
          "先用一家公司和一个报告周期验证流程；重要数字、风险、指引和管理层说法都保留准确页码或段落。",
        ],
        bullets: [
          "加入当前年报或财报、最新季报、公司公告、业绩说明材料和有日期的研究笔记。",
          "整理商业模式、业务分部、关键指标、指引、风险、催化剂和待查问题。",
          "将新报告期与上一期逐项比较，标出指引、指标定义、风险和管理层表述的变化。",
          "每个论点记录来源、日期、信心、反证和失效条件。",
          "来源修订后只更新受影响 Page，无法继续支持的主张标成 stale。",
        ],
        code: {
          label: "完成 Wenlan 与 AI 客户端设置后",
          code: "wenlan status\nwenlan sources add ~/Research/companies/acme\n/distill <公司与报告期问题>\n/pages <公司研究主题>\n/lint\n/curate",
        },
      },
      {
        heading: "引用存在，不等于分析正确",
        body: [
          "使用主张前要打开引用段落，核对数字、单位、报告期、否定词和管理层归属。引用只证明有路径，不证明来源本身正确，也不证明你的解读成立。",
          "这个流程不是投资建议，也不能替代授权数据、合规审核、估值模型或专业判断。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 会自动抓取财报、行情或业绩说明逐字稿吗？",
        answer:
          "不会。请加入你有权使用的文件。Wenlan 不提供实时金融数据、逐字稿授权、XBRL 管线、估值引擎或投资组合监控。",
      },
      {
        question: "如何避免投资论点在新财报后过期？",
        answer:
          "每个论点都连接到有日期的来源和失效条件。新财报或业绩说明后比较来源集，将已被取代的主张标成 stale，并保留旧修订供审核。",
      },
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
        label: "Wenlan 支持的文档来源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan 有来源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Anthropic 股票研究财报工作流",
        href: "https://github.com/anthropics/financial-services/blob/main/plugins/vertical-plugins/equity-research/commands/earnings.md",
      },
      {
        label: "大禹投研智能体",
        href: "https://github.com/huangbochn/dayu-agent",
      },
      {
        label: "Investor Harness 证据导向投研工作流",
        href: "https://github.com/joansongjr/investor-harness",
      },
    ],
    cta: {
      heading: "先建立一份能检查的公司研究档案",
      body: "加入一个报告周期、核对每个重要主张，再保存哪些证据和论点发生变化。",
    },
  },
  "build-product-research-knowledge-base-for-prd": {
    slug: "build-product-research-knowledge-base-for-prd",
    eyebrow: "产品研究工作流",
    category: "Workflows",
    title: "建立产品研究知识库，再开始写 PRD",
    description:
      "把批准的研究笔记、客服与销售信号、过往决策整理成有来源的证据库，支持可辩护的 PRD 评审。",
    metaTitle: "建立产品研究知识库，再开始写 PRD | Wenlan",
    metaDescription:
      "把用户研究连接到可辩护的 PRD：保留有日期的来源、可追溯需求、矛盾、假设、待解问题与决策历史。",
    keywords: [
      "产品研究知识库",
      "用户研究到 PRD",
      "产品决策依据",
      "有证据的 PRD",
      "UX 研究知识库",
      "产品运营知识库",
      "产品探索证据",
    ],
    publishedAt: "2026-08-28",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "准备 PRD 或路线图评审的产品经理、UX 研究员与产品运营团队",
    heroBullets: [
      "从一个产品决策和批准的证据边界开始。",
      "让每个需求都能回到有日期的研究、客服、销售或决策来源。",
      "分开保存观察、解读、假设、矛盾与待解问题。",
    ],
    productEvidence: {
      heading: "看看评审者实际检查的有来源工作区",
      summary:
        "下方是 Wenlan App 从确定性测试数据截取的真实桌面画面。画面列出带来源数量的近期 Pages，也让来源冲突与新来源等待评审。这不是客户数据；同一个评审界面也支持产品研究证据。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 画面，显示近期整理的 Pages、各页来源数量，以及来源冲突与新来源的评审队列。",
        caption:
          "Wenlan App 的真实测试画面：这是通用产品示例，不是产品研究项目的完成成果。Page 列表显示来源数量，评审队列保留来源冲突和待处理的新来源。",
        width: 1586,
        height: 992,
      },
      workflow: [
        {
          label: "批准来源边界",
          detail: "只加入团队可以检查、允许用于这次产品决策的研究与决策来源。",
        },
        {
          label: "整理一个产品决策",
          detail: "把观察、解读、假设、矛盾与待解问题分开，并让重要主张连接回来源。",
        },
        {
          label: "写 PRD 前先评审",
          detail: "打开引用与原始记录，确认需求有依据，过期或无法证明的内容保持可见。",
        },
      ],
      artifactHeading: "PRD 证据包示例",
      artifactNote:
        "这是可检查输出的结构示例，不代表任何特定用户研究或真实产品决策。",
      artifactRows: [
        {
          label: "证据输入",
          detail: "有日期的访谈段落、客服信号与已批准的过往决策。",
        },
        {
          label: "候选需求",
          detail: "把一项需求连接回来源，并分开记录团队解读、假设与冲突证据。",
        },
        {
          label: "评审结果",
          detail: "保留、缩小或保持未解；决定时留下理由、当前修订与待补证据。",
        },
      ],
      action: {
        label: "查看证据工作流",
        href: "#product-evidence",
      },
    },
    sections: [
      {
        heading: "先从一个产品决策开始，不是公司档案库",
        body: [
          "开始写 PRD 前，先为正在评审的决策建立一个产品范围内的证据库。只收集团队可以检查的批准访谈笔记、客服或销售笔记、研究资料与过往决策；目标是让每个需求都可追溯，而不是把所有对话做成一个通用文件夹。",
          "Wenlan 可以把支持的 Markdown、文本、可提取文本的 PDF、文件夹与只读 Obsidian 来源，连接到有来源的 Pages、引用、修订、过期状态与审核。它不会替你决定产品路线，也不会把来源自动变成已批准的产品需求。",
        ],
      },
      {
        heading: "综合前先固定来源边界",
        body: [
          "在请 Agent 综合前，先写下产品范围、评审问题、日期区间、纳入的来源类型与排除的资料。一个窄边界能帮你分辨需求来自用户观察、团队解读、假设，还是需要重新检查的决策。",
          "在小型来源登记表中保存来源日期、文档版本与准确标题或段落。如果笔记不完整，或来源没有获准用于这个产品决策，应记录为无法取得，不要默默填补缺口。",
        ],
        bullets: [
          "批准的访谈或研究笔记：保留观察与来源位置。",
          "客服或销售笔记：把重复出现的问题信号和未验证的请求分开。",
          "过往决策：记录决策日期、理由、范围，以及当时可用的证据。",
          "假设与待解问题：保持可见，不要把它们写成用户事实。",
        ],
      },
      {
        heading: "把笔记连成需求的证据链",
        body: [
          "每个重要需求使用一行或一个 Page 段落。把需求连接到有日期的来源段落，分开记录原始观察和你的解读，并在判断需求应保留、缩小或保持未解前，先留下互相矛盾的证据。",
          "同一条证据链应能通过 PRD 评审：评审者可以打开来源，看见当前修订，理解仍存在的假设，并追踪过往决策如何改变。来源变动时，只刷新受影响的 Page，并保留旧修订供审核。",
        ],
        bullets: [
          "记录产品问题、source ID、日期、准确位置与适用范围。",
          "把每句话分类为观察、解读、假设、决策或待解问题。",
          "把接受或拒绝的理由连接到证据，而不只是会议结论。",
          "比较冲突信号；证据无法解决时就保留矛盾。",
          "需求进入 PRD 草稿前，先标记无依据或已经过期的内容。",
        ],
        code: {
          label: "有界的产品研究知识工作流",
          code: "wenlan status\nwenlan sources add ~/Research/product-notes\n/distill <产品决策>\n/pages <产品决策>\n/lint\n/curate",
        },
      },
      {
        heading: "证据可检查后才开始写 PRD",
        body: [
          "PRD 可以整理证据库，但不应用流畅文字遮住证据。评审前确认每个需求都有来源路径或明确的未解标记，每个重要假设都有负责人或下一项检查，每个过往决策仍符合当前来源集合。",
          "即使不使用 Wenlan，这仍是一套实用的产品研究方法：小型证据登记表、需求到来源的对照、矛盾记录、假设清单与决策历史，都能让评审者重做判断。",
        ],
      },
      {
        heading: "知道这个工作流不会自动化什么",
        body: [
          "Wenlan 不会转录会议、遮蔽个人身份信息、招募研究参与者、导入分析数据、连接 Jira、Linear、Slack 或 CRM，也不会自动排序机会、生成完整 PRD、选择路线图或声称产品结果。这些决策与控制仍需要维护中的来源和人工审核。",
          "它也不能让没有依据的请求变成事实。保持来源、主张、日期、限制与审核状态可见，让 Agent 协助整理证据，但不要取代产品团队的判断。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 能把用户研究直接变成 PRD 吗？",
        answer:
          "不能。它能协助维护有来源的证据库，以及从批准笔记到可追溯需求的对照；产品经理和研究员仍须解读证据、处理优先顺序，并撰写和批准 PRD。",
      },
      {
        question: "访谈笔记和客服请求互相矛盾时怎么办？",
        answer:
          "保留两个有日期的来源，说明各自范围，并记录矛盾或待解问题。不要把客服请求、用户观察和产品决策合并成一个没有依据的需求。",
      },
      {
        question: "这会连接 Jira、Linear、Slack 或 CRM 吗？",
        answer:
          "不会。请使用支持的 Markdown、文本、可提取文本的 PDF、文件夹或只读 Obsidian 来源，并明确维护你获准使用的导出文件或笔记。",
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
        label: "Wenlan 支持的文档来源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan 有来源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Wenlan 审核与信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "Wenlan 日常工作流",
        href: "https://github.com/7xuanlu/wenlan#daily-workflow",
      },
    ],
    cta: {
      heading: "让一个产品决策可追溯",
      body: "从批准的来源集合开始，把需求连接到有日期的证据，并在 PRD 评审前保留矛盾与待解问题。",
    },
  },
  "build-sre-incident-knowledge-base": {
    slug: "build-sre-incident-knowledge-base",
    eyebrow: "SRE 知识工作流",
    category: "Workflows",
    title: "建立 SRE 故障知识库：整理 runbook 与故障复盘",
    description:
      "把 runbook、故障复盘与批准的事件笔记整理成有来源、可审核且不会悄悄过期的值班知识。",
    metaTitle: "建立 SRE 故障知识库与 runbook 工作流 | Wenlan",
    metaDescription:
      "用 runbook 与故障复盘建立有来源的 SRE 故障知识库，保留修订、验证信号、过期状态与安全边界。",
    keywords: [
      "SRE 故障知识库",
      "runbook 知识库",
      "故障复盘 知识沉淀",
      "值班运行手册",
      "SRE runbook 维护",
      "故障知识管理",
    ],
    publishedAt: "2026-08-29",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "9 分钟阅读",
    audience: "维护 runbook、故障复盘与值班知识的 SRE、平台工程与 on-call 团队",
    heroBullets: [
      "用一个服务、环境与故障类型固定来源边界。",
      "让诊断步骤、缓解限制与验证信号回到当前 runbook 或故障复盘。",
      "每次故障或系统变更后审核过期步骤，不让旧建议悄悄留在值班流程。",
    ],
    productEvidence: {
      heading: "信任 runbook 前，先检查来源与审核状态",
      summary:
        "这是 Wenlan App 确定性测试数据的真实桌面画面，不是故障或客户工作区。画面显示带来源数量的 Pages 与审核队列；SRE 可以用同一个界面让来源变化与未解决冲突保持可见。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 画面，显示带来源数量的 Pages，以及来源冲突与新证据的审核队列。",
        caption:
          "Wenlan App 确定性测试数据的真实画面。这是通用产品示例，不是生产故障证据；来源数量与审核状态仍可直接检查。",
        width: 1586,
        height: 992,
      },
      workflow: [
        {
          label: "固定故障知识边界",
          detail: "选定一个服务、环境、故障类型与批准来源，不导入不受控的运维资料库。",
        },
        {
          label: "整理可审核的 runbook Page",
          detail: "保存症状、证据、只读检查、缓解限制、停止条件与验证信号，并连接到当前来源。",
        },
        {
          label: "故障或变更后再验证",
          detail: "检查引用修订、stale 状态与未解决冲突，再在批准的非生产环境演练。",
        },
      ],
      artifactHeading: "故障知识包示例",
      artifactNote: "这是审核字段的结构示例，请用一个服务与故障类型的批准证据替换每一行。",
      artifactRows: [
        {
          label: "证据输入",
          detail: "当前 runbook、有日期的故障复盘、架构笔记或脱敏事件摘要，并附负责人和修订。",
        },
        {
          label: "运维主张",
          detail: "一个症状、诊断步骤、缓解边界或验证信号，连接到准确支持段落。",
        },
        {
          label: "审核结果",
          detail: "当前有效、互相矛盾、已经过期、不安全或仍未解决，并记录服务版本、环境、审核人和下次测试。",
        },
      ],
      action: {
        label: "查看故障证据工作流",
        href: "#product-evidence",
      },
    },
    sections: [
      {
        heading: "先回答：一个故障类型维护一份可复现的知识",
        body: [
          "每个服务或运维边界建立一份故障知识库。只加入批准的 runbook、故障复盘、架构笔记与脱敏事件摘要；维护症状、前置条件、只读诊断、缓解限制、停止条件、验证信号、负责人和审核日期。",
          "Wenlan 能让支持的文档连接到有来源 Pages、引用、修订、stale 状态、lint 与人工审核。它不会监控生产环境、接收告警、导入实时 telemetry、执行 runbook、批准变更或替代故障管理系统。",
        ],
      },
      {
        heading: "故障稳定后，再整理来源",
        body: [
          "从一个服务、环境与故障类型开始。把实时监控、原始日志、凭证、客户数据与变更批准留在专用系统，只把经过批准且可以引用的文档加入来源边界。",
          "保存每份来源的日期、修订、负责人和适用环境。把观察事实、假设、缓解措施与确认原因分开，不要为了写出顺畅摘要而把多个 contributing factors 压成一个原因。",
        ],
      },
      {
        heading: "建立故障到 runbook 的审核闭环",
        body: [
          "每次故障或系统变更后，只刷新受影响的知识，并让负责人重新验证步骤。",
        ],
        bullets: [
          "记录服务、环境、故障类型、来源修订与知识负责人。",
          "保存症状、适用条件、只读检查、风险、停止条件与验证信号。",
          "来源或系统改变时，先把受影响内容标成 stale。",
          "在 staging 或桌面演练中测试步骤、链接、预期输出与回退方式。",
          "值班使用前打开准确来源；检索到 runbook 不等于获准执行生产变更。",
        ],
        code: {
          label: "完成 Wenlan 与 AI 客户端设置后",
          code: "wenlan status\nwenlan sources add ~/Ops/approved-incident-knowledge\n/distill <服务与故障类型>\n/pages <服务故障 runbook>\n/lint\n/curate",
        },
      },
      {
        heading: "保留生产操作的安全边界",
        body: [
          "监控、告警分派、telemetry、故障指挥、权限、变更批准、rollback 执行与紧急访问仍应留在专用系统。Wenlan 不会对生产环境验证命令，也不能保证 runbook 安全。",
          "操作前由具名负责人核对服务版本、环境、权限、风险、预期输出、停止条件与 rollback。这份知识提供可检查上下文，不是自动执行授权。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 会监控故障或自动执行修复命令吗？",
        answer: "不会。Wenlan 不接收告警、不导入实时 telemetry、不执行 runbook，也不替代监控与故障管理系统。",
      },
      {
        question: "如何避免过期 runbook 误导值班工程师？",
        answer: "为每个 Page 保存来源修订、服务与环境范围、负责人、审核日期、预期信号与停止条件。来源或系统改变后先标成 stale，直到批准演练重新验证。",
      },
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
        label: "Wenlan 支持的文档来源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan 审核与信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "Microsoft Azure SRE Agent 知识文档教程",
        href: "https://learn.microsoft.com/zh-cn/azure/sre-agent/tutorial-upload-knowledge-document",
      },
      {
        label: "AWS 失效调查 playbook 指南",
        href: "https://docs.aws.amazon.com/zh_cn/wellarchitected/latest/reliability-pillar/rel_testing_resiliency_playbook_resiliency.html",
      },
      {
        label: "SRE 实践白皮书故障复盘流程",
        href: "https://docs.sre-elite.com/SRE-White-Paper-v1.0.5.pdf",
      },
    ],
    cta: {
      heading: "让一个故障教训能够复现",
      body: "选定一个服务与故障类型，连接当前 runbook 与故障复盘，再在下一次值班前审核每个运维主张。",
    },
  },
  "build-competitive-intelligence-knowledge-base": {
    slug: "build-competitive-intelligence-knowledge-base",
    eyebrow: "竞品调研工作流",
    category: "Workflows",
    title: "如何建立有来源依据的竞品调研知识库",
    description:
      "用有边界的来源登记表、日期与修订，整理可审核的竞品调研，让过期主张与矛盾保持可见。",
    metaTitle: "如何建立有来源依据的竞品调研知识库 | Wenlan",
    metaDescription:
      "从获准的文档、产品手册与 release notes 建立竞品调研知识库，保留来源日期、修订、过期主张与人工审核。",
    keywords: [
      "竞品分析知识库",
      "竞品调研资料库",
      "竞品信息更新",
      "竞争情报资料整理",
      "有来源的竞品调研",
      "AI 知识库产品研究",
    ],
    publishedAt: "2026-08-30",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "9 分钟阅读",
    audience: "维护竞品证据的产品营销经理、创业者，以及产品、战略或市场研究员",
    heroBullets: [
      "先从一个决策与有限的竞品集合开始，不建立未经审核的市场资料库。",
      "为每个来源保留日期、修订、范围与下次审核时间，让过期主张可见。",
      "在 battlecard 或产品决策使用前，分开观察、解读、假设与未知。",
    ],
    sections: [
      {
        heading: "先说结论：一个决策配一份有边界的竞品档案",
        body: [
          "为一个产品问题、竞品评审或定位更新建立一份竞品档案。只加入你已经取得且获准使用的产品文档、用户手册、release notes、研究笔记或只读 Obsidian 来源，并记录来源、日期、修订、范围与审核负责人。",
          "Wenlan 可以把支持的 Markdown、文本、可提取文本的 PDF、文件夹与只读 Obsidian 来源，连接到有来源的 Pages、引用、修订、过期状态、lint 与人工审核。它不会爬取竞品网站、抓取评论、监控实时价格、发现竞品、发送告警、给产品评分、提出建议，也不替你做法律或商业决策。",
        ],
      },
      {
        heading: "竞品调研为什么会过期",
        body: [
          "电子表格或 battlecard 常常把竞品事实、研究员推论与团队假设混在一起。当文档、产品页面或版本变化时，没有人知道哪句话来自哪一次修订；流畅的 AI 摘要还可能把缺少证据的推论写成事实。",
          "有用的竞品调研知识库保留小而可检查的证据链。研究员能分辨观察、解读、假设、矛盾与未知，也能看出哪项主张需要重新检查。即使不使用 Wenlan，来源登记表和这些分类仍然有用。",
        ],
      },
      {
        heading: "建立一份可审核的竞品档案",
        body: [
          "先写下评审问题、竞品集合、日期范围、来源类型与排除项。比较同一个产品问题时，尽量使用相同来源类型；证据不足时标为未知，不要用泛泛的市场语言填满空白。",
        ],
        bullets: [
          "来源登记：保存 URL 或文件、发布或访问日期、版本、竞品、范围、权威性、允许用途与下次审核日期。",
          "主张分类：把每句重要话分成观察、解读、假设、矛盾或未知，并连接到准确段落。",
          "变更追踪：来源或 release 改变时，只重新同步受影响的来源，把依赖它的主张标为过期或矛盾。",
          "使用前审核：打开来源、确认范围与修订，再把结果带入 battlecard、定位更新或产品决策。",
        ],
        code: {
          label: "有边界的竞品证据工作流",
          code: "wenlan status\nwenlan sources add ~/Research/competitors\n# 在 Wenlan plugin client 中：\n/distill <竞品调研问题>\n/pages <竞品主题>\n/lint\n/curate",
        },
      },
      {
        heading: "Wenlan 能做什么，以及不能做什么",
        body: [
          "Wenlan 能整理获准的来源，维护有来源的 Page，并让引用、修订、过期状态、矛盾与审核保持可见。支持的输入包括 Markdown、文本、可提取文本的 PDF、文件夹与只读 Obsidian；自定义集成也可以传入你已经准备好的网页内容。",
          "这不是自动化的市场情报系统。Wenlan 不会爬取或抓取竞品网站、不会监控实时网站、价格或评论、不会发现竞品、执行告警、给产品评分或自动生成建议。请由负责人确认数据权限、公共事实、日期与策略结论。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 会监控竞品或跟踪实时价格吗？",
        answer:
          "不会。Wenlan 不会爬取或抓取竞品网站、不会监控实时价格或评论、不会发现竞品，也不会发送告警。只加入你获准使用的支持来源，再自行检查日期与范围。",
      },
      {
        question: "可以让 AI Agent 自动写出最后的竞品建议吗？",
        answer:
          "不应该。Wenlan 能整理有来源的观察、显示过期或互相矛盾的主张，但负责的人仍要解读证据，并作出产品、定位、法律或商业决策。",
      },
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
        label: "Wenlan 支持的文档来源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan 有来源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Wenlan 审核与信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "How to Build a Competitive Intelligence Program",
        href: "https://www.aqute.com/blog/build-competitive-intelligence-program",
      },
      {
        label: "竞争情报资料来源（台湾营销研究）",
        href: "https://tmrmds.co/article-business/21696/",
      },
      {
        label: "竞品调研 workflow 案例（人人都是产品经理）",
        href: "https://www.woshipm.com/pd/6395378.html",
      },
    ],
    productEvidence: {
      heading: "使用竞品档案前先检查证据与审核状态",
      summary:
        "这是来自 Wenlan App 确定性测试 fixture 的真实桌面画面，不是竞品或客户数据。它显示带有来源数量的维护型 Pages 与审核队列；同一个产品界面可用于让来源变化和未解决证据保持可见。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 显示带有来源数量的维护型 Pages，以及来源冲突和新证据的审核队列。",
        caption:
          "Wenlan App 确定性测试 fixture 的真实画面。这是通用产品示例，不是竞品调研证据；来源数量与审核状态仍可直接检查。",
        width: 1586,
        height: 992,
      },
      workflow: [
        {
          label: "固定调研问题边界",
          detail: "选定一个决策、产品问题、竞品集合、时间范围与获准来源，不要导入不受控的市场资料库。",
        },
        {
          label: "整理有来源的竞品档案",
          detail: "把观察、解读、矛盾、过期主张与未知连接到有日期的来源修订，放在可维护的 Page 中。",
        },
        {
          label: "重用前先审核",
          detail: "打开引用段落，确认范围与修订，再把仍未解决的证据留在 battlecard 或产品决策旁。",
        },
      ],
      artifactHeading: "竞品证据包示例",
      artifactNote:
        "这是产品无关的结构示例，不代表任何竞品。请用正在审核的决策中获准且有日期的证据替换每一行。",
      artifactRows: [
        {
          label: "证据输入",
          detail: "产品文档、手册、release note 或研究笔记，附来源位置、修订、范围与允许用途状态。",
        },
        {
          label: "主张分类",
          detail: "观察、解读、假设、矛盾或未知，连接到准确段落，而不只保留一段润色后的摘要。",
        },
        {
          label: "审核结果",
          detail: "当前有效、过期、互相矛盾或仍未解决，并记录审核人、下次检查与决策情境。",
        },
      ],
      action: {
        label: "查看证据审核工作流",
        href: "#product-evidence",
      },
    },
    cta: {
      heading: "让一个竞品决策可追溯",
      body: "选定有边界的问题，连接获准来源，并在 battlecard 或产品决策使用前审核每个重要主张。",
    },
  },
  "build-ict-supplier-due-diligence-evidence-pack": {
    slug: "build-ict-supplier-due-diligence-evidence-pack",
    eyebrow: "供应商审核工作流",
    category: "Workflows",
    title: "如何建立 ICT 供应商安全尽职调查证据包",
    description:
      "把获准的软件供应商资料整理成可追溯的证据包，明确标注来源、适用范围、缺口、负责人和复审日期。",
    metaTitle: "建立 ICT 供应商安全尽职调查证据包 | Wenlan",
    metaDescription:
      "建立软件供应商安全尽职调查证据包，保留文件来源、服务范围、风险缺口、待确认事项与复审日期。",
    keywords: [
      "ICT 供应商安全尽职调查",
      "软件供应商安全评估",
      "供应商风险评估问卷",
      "第三方供应商风险评估",
      "供应商信息安全证据",
      "软件采购尽职调查资料",
    ],
    publishedAt: "2026-08-30",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "9 分钟阅读",
    audience: "在采购或续约前审核单个 ICT 或软件供应商的采购、安全与 IT 负责人",
    heroBullets: [
      "让每个供应商主张都连接到获准文件、日期、修订和适用服务范围。",
      "分别记录数据访问、业务韧性、安全证据、依赖关系和尚未回答的问题。",
      "为证据包指定负责人和复审日期，不把旧问卷答案当成永久事实。",
    ],
    sections: [
      {
        heading: "先说结论：一次审核只处理一个供应商和服务范围",
        body: [
          "先固定供应商、产品或服务、采购或续约决策、数据访问范围、审核人员与获准来源。证据包至少要记录来源文件、修订、适用范围、韧性与安全证据、依赖服务、缺口、待确认事项、负责人和复审日期。",
          "无法由来源支持或已经过期的主张要明确标为未验证。最终采购判断仍由组织内的采购、安全、法务和隐私负责人按照现有制度作出。",
        ],
      },
      {
        heading: "把问卷、政策和架构资料拆成可检查的证据",
        body: [
          "供应商审核经常把现行安全政策、旧问卷、架构图、认证声明和邮件补充混在一张表里。没有日期和适用范围，再流畅的摘要也无法说明某项控制是否适用于正在采购的服务。",
        ],
        bullets: [
          "建立来源登记：保存文件名、版本、日期、提供者、适用服务和允许使用范围。",
          "逐项记录主张：连接到准确段落，区分供应商陈述、审核解读、残余风险、矛盾和缺件。",
          "标注数据与系统访问：记录数据类型、权限、存储位置、保留方式和分包商或关键依赖。",
          "设置复审：来源或服务范围变化时，先把依赖该证据的结论标为过期，再交给具名负责人确认。",
        ],
        code: {
          label: "有边界的供应商证据工作流",
          code: "wenlan status\nwenlan sources add ~/Reviews/approved-supplier-docs\n# 在 Wenlan plugin client 中：\n/distill <供应商与审核范围>\n/pages <供应商证据包>\n/lint\n/curate",
        },
      },
      {
        heading: "一份可复审的供应商证据包应包含什么",
        body: [
          "把每项内容标为当前有效、过期、互相矛盾、缺乏支持或待补件，并保留证据负责人、审核人、依赖服务和下次复审日期。问卷答案只能算供应商提供的一项主张，不能直接等同控制已经有效落实。",
          "即使不使用 Wenlan，这份来源登记、缺口清单和复审字段仍可作为采购会议中的独立工作成果。",
        ],
      },
      {
        heading: "Wenlan 的能力与安全边界",
        body: [
          "Wenlan 能把获准的 Markdown、文本、可提取文本的 PDF、文件夹与只读 Obsidian 来源整理成有来源的 Pages，并显示引用、修订、过期状态、lint 和人工审核。",
          "Wenlan 不会验证认证真伪、不提供法律或隐私意见、不发现供应商、不爬取网站、不做实时监控或漏洞扫描、不自动评分，也不批准或拒绝采购。敏感资料仍须留在组织批准的访问控制中。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 可以验证供应商认证或直接批准采购吗？",
        answer:
          "不可以。Wenlan 不验证认证、不为供应商打分，也不做采购决策；它只让获准资料、主张、缺口、修订和审核状态可追溯。",
      },
      {
        question: "完成供应商风险评估问卷就足够吗？",
        answer:
          "不够。每个答案都要附来源、日期、适用范围、负责人和支持文件；缺乏证据、互相矛盾或已经过期的答案必须明确标注。",
      },
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
        label: "Wenlan 支持的文档来源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan 有来源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Wenlan 审核与信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
      {
        label: "NIST SP 1326 ICT 供应商尽职调查指南",
        href: "https://www.nist.gov/publications/nist-cybersecurity-supply-chain-management-due-diligence-assessment-quick-start-guide",
      },
      {
        label: "Microsoft 供应商安全和隐私保证计划",
        href: "https://learn.microsoft.com/en-us/compliance/assurance/assurance-supplier-security-and-privacy-assurance-program",
      },
    ],
    productEvidence: {
      heading: "复用供应商主张前，先检查来源与审核状态",
      summary:
        "这是来自 Wenlan App 确定性测试资料的真实桌面画面，不是供应商或客户工作区。画面显示带有来源数量的 Pages 和审核队列，可用同一界面让来源变化与未解决证据保持可见。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 显示带有来源数量的 Pages，以及来源冲突和新证据的审核队列。",
        caption:
          "Wenlan App 确定性测试资料的真实画面。这是通用产品示例，不是供应商安全证据。",
        width: 1586,
        height: 992,
      },
      workflow: [
        { label: "固定审核边界", detail: "选定一个供应商、服务、决策、获准来源和具名审核人员。" },
        { label: "建立有引用的证据登记", detail: "把修订、数据访问、韧性、安全证据、依赖、缺口和问题连接到准确来源。" },
        { label: "决策前复审", detail: "打开引用段落，检查过期或矛盾证据，再由采购、安全、法务与隐私负责人判断。" },
      ],
      artifactHeading: "供应商证据包示例",
      artifactNote: "这是中立的审核结构，不是认证或采购结论。请使用单个供应商与服务范围的获准证据替换每一行。",
      artifactRows: [
        { label: "证据输入", detail: "政策、架构或数据流文档、韧性计划、问卷、分包商清单或有日期的补充说明。" },
        { label: "审核陈述", detail: "供应商主张、审核解读、残余风险、矛盾、缺件或待确认问题，连接到准确段落。" },
        { label: "审核状态", detail: "当前有效、过期、矛盾、缺乏支持或待处理，附负责人、审核人和复审日期。" },
      ],
      action: { label: "查看供应商证据工作流", href: "#product-evidence" },
    },
    cta: {
      heading: "让一次供应商审核可追溯",
      body: "选定一个供应商与服务范围，连接获准证据，并在决策会议前保留所有过期或缺乏支持的主张。",
    },
  },
  "build-customer-support-answer-knowledge-base": {
    slug: "build-customer-support-answer-knowledge-base",
    eyebrow: "客服回答工作流",
    category: "Workflows",
    title: "如何建立客服答案知识库：让客服回答可追溯",
    description:
      "产品或政策变化后，用获准来源、适用范围、禁止承诺、转人工条件、负责人和复审日期维护可检查的客服答案。",
    metaTitle: "建立客服答案知识库与可追溯回答 | Wenlan",
    metaDescription:
      "从获准的产品与政策文档建立客服答案知识库，保留问题、支持的客服回答、适用范围、禁止承诺、转人工条件、来源修订、负责人和复审日期。",
    keywords: [
      "客服知识库",
      "客服话术知识库",
      "客服知识库更新",
      "客服答案管理",
      "有来源客服回答",
      "客服内容审核工作流",
    ],
    publishedAt: "2026-08-31",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "维护获准客服回答的客服运营、技术写作者、产品支持与客户成功内容负责人",
    heroBullets: [
      "先从一项获准的产品或政策变更，以及受影响的客服问题开始。",
      "记录支持的客服回答、适用范围、禁止承诺、转人工条件、来源修订、负责人和下次复审日期。",
      "让过期或缺乏支持的回答留在人工审核中，不自动发布或回复客户。",
    ],
    sections: [
      {
        heading: "先说结论：一个客服问题配一笔可审核答案",
        body: [
          "为一个支持主题和一组获准的产品或政策文档建立答案知识库。每个客服问题都要记录支持的客服回答、适用范围、禁止承诺、需要转人工的条件、来源修订、具名负责人和下次复审日期；来源变化时，先把相关回答标为过期或未解决。",
          "Wenlan 可以把获准的 Markdown、文本、可提取文本的 PDF、文件夹与只读 Obsidian 来源连接到有来源的 Pages、引用、修订、过期状态、lint 与人工审核。它不会导入客服工单、CRM 记录或原始客户对话，也不会处理个人信息、连接支持渠道、发布面向客户的答案、生成回复、同步渠道或自动转人工。",
        ],
        link: {
          label: "查看客服答案证据工作流",
          href: "#product-evidence",
        },
      },
      {
        heading: "产品或政策变化时，为什么答案会失效",
        body: [
          "产品发布或政策变化后，原本听起来合理的回答可能已经不符合适用方案、生效日期、例外条件或承诺边界。如果共享文档或润色过的 AI 摘要没有保留来源修订，就很难知道哪一句仍受支持、哪一句需要负责人重新审核。",
          "可复用的客服内容应该把问题、回答、范围、禁止承诺与转人工条件拆开；支持不足时保留未知，不用流畅文字补齐答案。即使不使用 Wenlan，这份字段清楚的答案登记也能作为独立的内容审核成果。",
        ],
      },
      {
        heading: "建立一个问题到回答的审核闭环",
        body: [
          "先选择一个客服主题和少量获准文档，让每一笔答案都能回到准确来源段落。把原始来源的说法、内容负责人的解读、不能承诺的事项和必须交给人的例外分开保存。",
        ],
        bullets: [
          "写下产品或政策主题、生效日期、客服读者、纳入文档、排除资料和内容负责人。",
          "登记获准的 Markdown、文本、可提取文本 PDF、文件夹或只读 Obsidian 来源，保存标题、日期、修订和适用范围。",
          "每个常见问题建立一笔答案记录，分开支持的回答、适用范围、禁止承诺、例外与转人工条件。",
          "把重要回答连回准确来源段落，并在记录旁保留来源修订。",
          "产品或政策变化后重新同步受影响来源，把相关答案标为过期或未解决，直到负责人检查新修订。",
          "复用前由负责人打开来源，确认范围和生效日期，再写下下次复审日期；这个工作流不发布答案，也不发送回复。",
        ],
        code: {
          label: "完成 Wenlan 与 AI 客户端设置后",
          code: "wenlan status\nwenlan sources add ~/Support/approved-product-policy\n# 在 Wenlan plugin client 中：\n/distill <客服答案主题>\n/pages <客服答案主题>\n/lint\n/curate",
        },
      },
      {
        heading: "客服答案记录应该记什么？",
        body: [
          "下面的中立模板把一个可回答的问题与它的限制放在同一笔记录。答案不是承诺；只有来源和负责人确认后，才可以在适用范围内复用。",
        ],
        code: {
          label: "中立的客服答案记录模板",
          code: "question: 现有订阅可以立即更换方案吗？\nsupported_answer: <获准政策真正支持的回答>\nscope: <方案、地区、账户状态与生效日期>\ndo_not_promise: <来源没有授权的动作或结果>\nescalate_when: <必须交给人工负责人的条件>\nsource_revision: <文档 ID、段落与修订>\nowner: <内容负责人>\nnext_review: <日期或产品变化触发条件>",
        },
      },
      {
        heading: "知道这个工作流不会自动化什么",
        body: [
          "Wenlan 不会处理个人信息或宣称替你遮蔽个人信息，不提供团队权限，不做客服分析，不自动批准政策，不会发布面向客户的答案，不会自动回复或发送回复，不会同步 LINE、Email 或其他渠道，也不会自动转人工。内容负责人仍要判断来源是否适用、答案能否复用，以及何时需要交给适当的人。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 会导入客服工单或替我发送回复吗？",
        answer:
          "不会。这个工作流只使用你能检查的获准文档；Wenlan 不会导入客服工单、CRM 记录或原始客户对话，也不会发布、生成、发送或同步客户回复。",
      },
      {
        question: "产品或政策变化后，旧客服答案应该怎么办？",
        answer:
          "重新同步获准来源，把受影响答案标为过期或未解决，再由具名负责人检查当前段落、适用范围、禁止承诺、转人工条件、来源修订和下次复审日期。",
      },
    ],
    relatedSlugs: [
      "build-local-ai-knowledge-base-from-documents",
      "verify-ai-knowledge-base-citations",
      "test-ai-knowledge-base-retrieval-after-changes",
    ],
    officialReferences: [
      {
        label: "Wenlan 支持的文档来源",
        href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in",
      },
      {
        label: "Wenlan sources add CLI",
        href: "https://github.com/7xuanlu/wenlan/blob/main/crates/wenlan-cli/README.md#wenlan-sources-add-path",
      },
      {
        label: "Wenlan 有来源 Pages",
        href: "https://wenlan.app/docs/source-backed-pages",
      },
      {
        label: "Wenlan 审核与信任",
        href: "https://wenlan.app/docs/review-and-trust",
      },
    ],
    productEvidence: {
      heading: "复用回答前先检查来源与审核状态",
      summary:
        "这是 Wenlan App 确定性测试资料的真实桌面画面，不是客服工作区或客户对话。画面显示带有来源数量的 Pages 与审核队列，可用同一产品界面让来源变化与未解决证据保持可见。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 显示带有来源数量的 Pages，以及来源冲突与新证据的审核队列。",
        caption:
          "Wenlan App 确定性测试资料的真实画面。这是通用产品示例，不是客服证据；来源数量与审核状态仍可直接检查。",
        width: 1586,
        height: 992,
      },
      workflow: [
        {
          label: "固定答案范围",
          detail: "选定一个客服主题、获准来源、生效日期和内容负责人，再开始整理回答。",
        },
        {
          label: "整理有引用的答案记录",
          detail: "把问题、支持的回答、适用范围、禁止承诺、转人工条件、来源修订和下次复审连到准确来源。",
        },
        {
          label: "复用前先审核",
          detail: "打开引用段落，检查过期或矛盾证据，并把发布或回复发送留在本工作流之外。",
        },
      ],
      artifactHeading: "客服答案记录示例",
      artifactNote:
        "这是中立模板，不是对任何客户的承诺。复用前请以获准来源和具名内容负责人替换每个字段。",
      artifactRows: [
        {
          label: "问题与回答",
          detail: "一个客服问题，以及获准产品或政策来源真正支持的最短回答。",
        },
        {
          label: "范围与边界",
          detail: "适用方案、地区、账户状态、生效日期、禁止承诺、例外与需要转人工的条件。",
        },
        {
          label: "审核与负责人",
          detail: "来源文档与修订、内容负责人、当前审核状态，以及下次复审日期或产品变化触发条件。",
        },
      ],
      action: {
        label: "查看客服答案证据工作流",
        href: "#product-evidence",
      },
    },
    cta: {
      heading: "让一个客服答案可审核",
      body: "选定获准的产品或政策来源，记录一个有界回答，并在复用前让修订、负责人、限制和下次复审保持可见。",
    },
  },
  "build-course-wiki-from-lecture-notes": {
    slug: "build-course-wiki-from-lecture-notes",
    eyebrow: "课程 Wiki 工作流",
    category: "Workflows",
    title: "把课程讲义与 PDF 整理成课程 Wiki",
    description:
      "把一门课的可读讲义、课件与 PDF 整理成有来源的课程 Wiki，保留概念、前置知识、来源修订和审核状态。",
    metaTitle: "课程讲义与 PDF 如何整理成课程 Wiki | Wenlan",
    metaDescription:
      "从课程讲义、课件与可提取文本的 PDF 建立有来源课程 Wiki，维护概念页、前置知识、引用、来源修订和审核状态。",
    keywords: [
      "把课程讲义整理成 AI 知识库",
      "课件 PDF 转学习笔记",
      "学生 LLM Wiki",
      "课程 Wiki",
      "可追溯学习笔记",
      "课件知识库",
    ],
    publishedAt: "2026-08-31",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "已有一门课的可读课程讲义、课件或 PDF，想维护可检查学习 Wiki 的学生、自学者与教师",
    heroBullets: [
      "先固定一门课和一组有权使用的可读课程资料。",
      "每个概念单独成页，连接到准确来源和前置知识。",
      "记录来源修订和审核状态，避免课件更新后笔记仍看似正确。",
    ],
    sections: [
      {
        heading: "先说结论：一个概念配一页和一组准确来源",
        body: [
          "先为一门课建立明确来源边界，登记可读的课程讲义、笔记和可提取文本 PDF，再把每个可复用概念维护成独立页面。每页都要回答一个问题、列出前置知识、引用准确讲次或页码、记录来源修订，并标注当前有效、过期、矛盾或待审核。",
          "Wenlan 可以同步支持的文档来源、建立有来源 Pages、保留引用和 wikilink、显示过期依赖并留下可审核修订。它不等同 NotebookLM，不会生成闪卡、不会自动出题、不会转录音频、不会执行 OCR、不会评分、不会当家教、不会解题，也不会规划考试。",
        ],
        link: { label: "查看课程 Wiki 证据工作流", href: "#product-evidence" },
      },
      {
        heading: "为什么一份大摘要很快就会过期",
        body: [
          "一个定义可能在第二周讲义，前置概念在第一周，修正在后续课件，例外又藏在阅读笔记里。一次性摘要会把这些关系压成流畅文字，也可能在教师更新来源后继续保留旧答案。",
          "可维护的课程 Wiki 应该让概念、来源和修订保持分离，让学习者能看出哪一段受哪份资料支持，以及哪一页需要重新审核。即使不用 Wenlan，这种结构也能作为独立、可检查的学习成果。",
        ],
      },
      {
        heading: "建立课程资料到概念页的闭环",
        body: [
          "先用少量资料验证流程。只纳入你有权存储和阅读的内容，并指定课程版本、学期、来源所有者、排除资料和审核人员。",
        ],
        bullets: [
          "登记 Markdown、文本和可提取文本的 PDF；扫描或纯图片 PDF 先在外部完成 OCR，再人工核对文字。",
          "每个概念页只回答一个稳定问题，不要把整门课压成一份巨型摘要。",
          "明确连接前置知识、相邻概念、矛盾说法、例题和尚未解决的问题。",
          "每个重要主张附上讲次、页码、段落或 source ID，并保存学期、文件版本或资料日期。",
          "讲义或课件更新后重新同步，把受影响概念标为过期或待审核，再打开新来源确认。",
          "最后执行 lint 和人工审核；来源不足时保留未知，不用 AI 自动补答案。",
        ],
        code: {
          label: "完成 Wenlan 与 AI 客户端设置后",
          code: "wenlan status\nwenlan sources add ~/Courses/distributed-systems/materials\n# 在 Wenlan plugin client 中：\n/distill <课程概念>\n/pages <课程概念>\n/lint\n/curate",
        },
      },
      {
        heading: "概念页应该记录什么",
        body: [
          "下面的中立模板不是答案卡，而是一笔可检查的学习记录。每个字段都要回到有权使用的课程资料和具名审核人员。",
        ],
        code: {
          label: "中立的课程概念记录",
          code: "concept: leader election\nquestion: 为什么同一个 term 不能长期存在两个 leader？\nprerequisites: term；quorum intersection\nanswer: <当前课程资料真正支持的短答>\nsources: <讲次、幻灯片或页码和 source ID>\nsource_revision: <学期、文件修订或资料日期>\nreview_state: <当前有效｜过期｜矛盾｜未解决>\nreviewer: <学生或教师>\nnext_review: <来源变化触发条件或日期>",
        },
      },
      {
        heading: "知道这不是 AI 家教或考试工具",
        body: [
          "这个工作流只整理有来源的课程概念。Wenlan 不会制作闪卡或测验，不会转录音视频，不会对扫描文件执行 OCR，不会评分、代写、解题、预测考题或安排复习进度。学生或教师仍要负责来源权利、理解、学术诚信和最终审核。",
        ],
      },
    ],
    faqs: [
      {
        question: "Wenlan 能直接把扫描讲义、录音或视频变成学习笔记吗？",
        answer: "不能。这个流程使用 Markdown、文本和可提取文本的 PDF。扫描文件需要外部 OCR，录音或视频需要外部转录，再由你核对结果后才能作为来源。",
      },
      {
        question: "课程 Wiki 等于复习摘要或 AI 家教吗？",
        answer: "不等于。课程 Wiki 维护可追溯的概念解释、前置知识、来源和修订状态；它不生成答案卡、不评分、不代写，也不决定考试重点。",
      },
    ],
    relatedSlugs: [
      "build-local-ai-knowledge-base-from-documents",
      "distilled-wiki-pages-ai-memory",
      "source-backed-research-knowledge-base",
      "verify-ai-knowledge-base-citations",
    ],
    officialReferences: [
      { label: "Wenlan 支持的文档来源", href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in" },
      { label: "Wenlan 有来源 Pages", href: "https://wenlan.app/docs/source-backed-pages" },
      { label: "Wenlan 审核与信任", href: "https://wenlan.app/docs/review-and-trust" },
      { label: "Karpathy 的 LLM-wiki 笔记", href: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f" },
    ],
    productEvidence: {
      heading: "信任概念页前，先检查来源和审核状态",
      summary: "这是 Wenlan App 确定性测试资料的真实桌面画面，不是学校、课程或学生工作区。画面显示带有来源数量的 Pages 和审核队列，可用同一产品界面让课件修订与未解决证据保持可见。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 显示带有来源数量的 Pages，以及来源变化与矛盾证据的审核队列。",
        caption: "Wenlan App 确定性测试资料的真实画面。这是通用产品示例，不是课程资料或学生记录。",
        width: 1586,
        height: 992,
      },
      workflow: [
        { label: "固定一门课", detail: "先选定课程、学期、可读来源、排除资料和具名审核人员。" },
        { label: "整理有关联的概念", detail: "把概念、前置知识、解释、来源位置、修订和开放问题放在同一笔可审核记录。" },
        { label: "来源变化后再审核", detail: "打开引用讲义，检查过期或矛盾支持，理解当前资料后才更新概念页。" },
      ],
      artifactHeading: "课程概念记录示例",
      artifactNote: "这是中立模板，不是答案卡。请使用有权使用的课程资料和具名审核人员替换每个字段。",
      artifactRows: [
        { label: "概念与问题", detail: "一个可复用概念、它回答的问题，以及当前资料支持的最短解释。" },
        { label: "前置知识与来源", detail: "必要概念、准确讲次或页码、source ID、资料日期和来源修订。" },
        { label: "审核状态", detail: "当前有效、过期、矛盾或未解决，附学生或教师审核人员和下次触发条件。" },
      ],
      action: { label: "查看课程 Wiki 证据工作流", href: "#product-evidence" },
    },
    cta: {
      heading: "先建立一页可检查的课程概念",
      body: "加入一小组获准来源，维护一页带有前置知识和准确来源的概念，再在课件变化后审核。",
    },
  },
  "build-business-metric-definition-knowledge-base": {
    slug: "build-business-metric-definition-knowledge-base",
    eyebrow: "指标定义工作流",
    category: "Workflows",
    title: "建立业务指标定义知识库",
    description:
      "把获准的 KPI 规范整理成有来源的数据字典，保留公式文本、粒度、维度、排除条件、负责人、来源修订和审核状态。",
    metaTitle: "如何建立业务指标定义知识库和数据字典 | Wenlan",
    metaDescription:
      "从获准文件建立可审核的指标定义知识库，记录公式、粒度、维度、排除条件、负责人、引用、版本和替代关系。",
    keywords: [
      "建立业务指标定义知识库",
      "数据字典 指标口径",
      "AI agent 指标定义",
      "KPI 定义模板",
      "业务术语表",
      "有来源数据字典",
    ],
    publishedAt: "2026-09-01",
    updatedAt: "2026-09-08",
    author: "Qi-Xuan Lu",
    readingTime: "8 分钟阅读",
    audience: "需要为人员和 AI agent 解决 KPI 定义冲突的数据、分析、产品、财务和运营团队",
    heroBullets: [
      "从获准的指标规范开始，不从仪表盘或推测公式开始。",
      "把公式文本、粒度、维度、排除条件、负责人和来源修订放在同一条记录。",
      "明确替代过期定义，不让 AI agent 把冲突版本混成一个答案。",
    ],
    sections: [
      {
        heading: "先说结论：一个指标配一条有来源、可替代的定义记录",
        body: [
          "每个业务指标维护一条可审核记录：业务定义、不可执行的公式文本、粒度、维度、纳入和排除条件、负责人、准确来源和来源修订、审核状态，以及它替代的旧定义。两份获准来源互相冲突时，先保留冲突并交给具名负责人判断，不让 AI 自动协调。",
          "Wenlan 可以读取获准的 Markdown、文本和可提取文本 PDF，建立有来源 Pages、保留引用和来源修订、执行 provenance lint 并留下可审核版本。它不会导入 CSV 或 YAML、不会执行 SQL、不会连接数据仓库或 BI、不会计算指标、不会提供血缘、不会监控数据质量、不会管理权限、不会自动批准，也不会自动协调冲突。",
        ],
        link: { label: "查看指标定义证据工作流", href: "#product-evidence" },
      },
      {
        heading: "为什么同名 KPI 仍可能不是同一件事",
        body: [
          "活跃客户、净收入或转化率可能同时出现在财务备忘录、分析规范、产品仪表盘说明和运营手册中，但公式、粒度、时间窗、排除条件或负责人各不相同。把它们整理成一段流畅摘要，反而会隐藏真正需要决策的差异。",
          "可维护的数据字典应让每个版本回到准确来源，清楚标记当前有效、过期、矛盾或未解决，并在新版批准后保留旧版本和替代关系。即使不用 Wenlan，这也是可以独立采用的指标治理基本记录。",
        ],
      },
      {
        heading: "建立获准规范到指标记录的闭环",
        body: [
          "先选择一组指标和少量获准文件。这个工作流只负责定义查找和冲突处理，不建立所有数据表、仪表盘或实时计算的目录。",
        ],
        bullets: [
          "先记录指标名称、业务问题、获准来源、排除系统、具名负责人和审核人。",
          "只加入获准的 Markdown、文本或可提取文本 PDF；CSV、YAML、SQL、数据仓库 metadata 和 API 不在这个流程。",
          "把公式写成可审核文本，并记录粒度、维度、时间窗、纳入、排除和例外。",
          "每个重要字段连接到 source ID、准确标题或页码、来源修订和生效日期。",
          "来源冲突时保留两个版本，标成矛盾或未解决，不自行平均或合并。",
          "负责人选定当前版本后，记录替代的旧定义、保留历史版本并设置下次审核条件。",
        ],
        code: {
          label: "完成 Wenlan 与 AI 客户端设置后",
          code: "wenlan status\nwenlan sources add ~/Metrics/approved-specifications\n# 在 Wenlan plugin client 中：\n/distill <指标定义>\n/pages <指标名称>\n/lint\n/curate\n\nmetric: activated customer\nbusiness_definition: <获准来源真正定义的含义>\nformula_text: <不可执行的公式文本>\ngrain: <账户 | workspace | 用户 | 事件>\ndimensions: <允许的拆分维度>\ninclusions: <纳入状态或事件>\nexclusions: <排除状态、事件或时间窗>\nowner: <负责团队或审核人>\nsources: <source ID 和准确位置>\nsource_revision: <版本或生效日期>\nreview_state: <当前有效 | 过期 | 矛盾 | 未解决>\nsupersedes: <旧定义或无>\nnext_review: <来源变化条件或日期>",
        },
      },
      {
        heading: "指标记录应该保留什么",
        body: [
          "一条可用记录不只是一句定义。它要让读者知道公式文本在什么粒度成立、哪些状态被排除、谁有权决定当前版本，以及这个版本依据哪份来源。",
        ],
      },
      {
        heading: "知道这不是数据目录、BI 或计算引擎",
        body: [
          "Wenlan 不会导入 CSV、不会执行 SQL、不会连接数据仓库、不会同步 BI 或 semantic layer、不会计算 KPI、不会提供字段血缘、不会监控数据质量、不会管理权限、不会自动批准定义，也不会自动协调冲突公式。具名领域负责人仍要做业务判断和最终审核。",
        ],
      },
    ],
    faqs: [
      {
        question: "这会连接数据仓库、BI 或 metric store 吗？",
        answer: "不会。这个流程使用获准的 Markdown、文本和可提取文本 PDF。Wenlan 不会探索数据表、不会执行 SQL、不会计算 KPI，也不会同步数据仓库、BI、semantic layer 或 metric store。",
      },
      {
        question: "两份获准指标定义互相冲突时怎么办？",
        answer: "保留两份有引用的定义，记录公式、粒度、排除条件、负责人和来源修订，并标成矛盾或未解决。由具名领域负责人决定哪个版本成为当前定义，并记录它替代的旧版本。",
      },
    ],
    relatedSlugs: [
      "source-backed-wiki-pages-ai-work",
      "verify-ai-knowledge-base-citations",
      "prevent-multi-agent-knowledge-conflicts",
      "build-investment-research-knowledge-base",
    ],
    officialReferences: [
      { label: "Wenlan 支持的文档来源", href: "https://github.com/7xuanlu/wenlan#what-can-i-bring-in" },
      { label: "Wenlan 有来源 Pages", href: "https://wenlan.app/docs/source-backed-pages" },
      { label: "Wenlan 审核与信任", href: "https://wenlan.app/docs/review-and-trust" },
      { label: "银行业数据字典指引", href: "https://www.china-cba.net/Index/show/catid/251/id/45936.html" },
    ],
    productEvidence: {
      heading: "信任指标前，先检查来源修订和审核状态",
      summary: "这是 Wenlan App 确定性测试资料的真实桌面画面，不是公司的分析或财务工作区。画面显示带有来源数量的 Pages 和审核队列，可以用同一产品界面让冲突或修订后的指标证据保持可见。",
      image: {
        src: "/images/product-evidence/wenlan-space-review-fixture.png",
        alt: "Wenlan 桌面 Space 显示带有来源数量的 Pages，以及来源变化和矛盾证据的审核队列。",
        caption: "Wenlan App 确定性测试资料的真实画面。这是通用产品示例，不是实时数据目录或公司指标记录。",
        width: 1586,
        height: 992,
      },
      workflow: [
        { label: "固定获准规范", detail: "选定一组指标、允许的定义文件、排除系统、具名负责人和审核人。" },
        { label: "整理一条定义", detail: "把定义、公式文本、粒度、维度、排除条件、引用、来源修订和冲突放在同一页面。" },
        { label: "审核后再替代", detail: "打开引用来源，检查矛盾和过期状态，再标记当前定义并保留被替代版本。" },
      ],
      artifactHeading: "业务指标记录示例",
      artifactNote: "这个中立模板不会计算 KPI。请用获准规范和具名领域审核人替换每个字段。",
      artifactRows: [
        { label: "含义与公式文本", detail: "业务定义、不可执行公式、粒度、维度、纳入、排除和例外。" },
        { label: "负责人和来源", detail: "负责人、准确 source ID 和位置、来源修订和生效日期。" },
        { label: "审核与替代", detail: "当前有效、过期、矛盾或未解决，附审核人、被替代版本和下次审核条件。" },
      ],
      action: { label: "查看指标定义证据工作流", href: "#product-evidence" },
    },
    cta: {
      heading: "让一个指标定义可检查",
      body: "从获准规范开始，保留冲突和准确来源，只在具名负责人审核后替代旧定义。",
    },
  },
} satisfies Partial<Record<TranslatedLearnSlug, LearnArticle>>;

export const localizedLearnArticlesByLocale: Record<
  TranslatedLocale,
  Partial<Record<TranslatedLearnSlug, LearnArticle>>
> = {
  "zh-TW": zhTWArticles,
  "zh-CN": zhCNArticles,
};

export function getLocalizedLearnArticle(
  locale: TranslatedLocale,
  slug: string,
): LearnArticle | null {
  if (!isTranslatedLearnSlug(slug)) return null;
  return localizedLearnArticlesByLocale[locale][slug] ?? null;
}

export function getLocalizedLearnArticles(locale: TranslatedLocale): readonly LearnArticle[] {
  return TRANSLATED_LEARN_SLUGS_BY_LOCALE[locale].flatMap((slug) => {
    const article = localizedLearnArticlesByLocale[locale][slug];
    return article ? [article] : [];
  });
}

export function localizedLearnArticlePath(slug: TranslatedLearnSlug): `/learn/${TranslatedLearnSlug}` {
  return `/learn/${slug}`;
}
