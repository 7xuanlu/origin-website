import type { Locale } from "./locales";

type Choice = { setup: string; keep: string; add: string };
type GuideCopy = {
  title: string;
  intro: string;
  setupTitle: string;
  keepTitle: string;
  addTitle: string;
  rows: Record<string, Choice>;
};

const guides: Record<Locale, GuideCopy> = {
  en: {
    title: "What changes in your everyday workflow?",
    intro: "Start with the work you want to keep doing, then decide what to hand off. These recommendations interpret documented workflows; they are not a usability benchmark or proof that one product suits everyone.",
    setupTitle: "What you set up first",
    keepTitle: "Keep this approach when…",
    addTitle: "Consider adding Wenlan when…",
    rows: {
      "llm-wiki-workflow": {
        setup: "For nashsu/llm_wiki, install the App, create a project, configure a model, and add sources. Folder watching can automate later ingest; MCP has its own connection setup.",
        keep: "You want documents and useful answers compiled into a Markdown Wiki, and its App, project structure, and MCP workflow already suit you. It is a product with automation, not merely a research recipe.",
        add: "For example, a saved delivery-date decision changes from September to October. You want the system to find the affected knowledge pages, not just save another note. In Wenlan, accepting the replacement revision links page evidence to the new memory and flags those pages for refresh. Background refresh still needs an available model; pages you edited receive a revision for review.",
      },
      "llm-wiki-1": {
        setup: "Create or open a vault and write your notes. AI is optional: choose a plugin or external tool, then check its model, file access, and backup requirements.",
        keep: "Writing and arranging your own notes is part of how you think, and your existing search, links, and extensions already do enough.",
        add: "You want to leave the vault untouched while maintaining a separate, source-backed Wiki for later AI work. Wenlan needs its own source and model setup; it does not remove that initial work or replace your note editor.",
      },
      "vault-agents": {
        setup: "Set up workspace pages and permissions. For unattended Custom Agent tasks, choose a suitable plan and configure instructions, triggers, and access.",
        keep: "Shared pages, team coordination, databases, and workspace permissions are central to your work. Notion’s Agents can automate tasks inside that workspace.",
        add: "You need a local knowledge base outside the workspace, used from connected AI tools, with source tracking and a defined page-review flow. Wenlan is not a replacement for Notion’s team workspace or project-management features.",
      },
      notebooklm: {
        setup: "Create a notebook and select sources. Eligible Google Drive imports can sync when you open it; uploaded files remain imported copies. Check supported formats and sharing settings.",
        keep: "Your main job is understanding a bounded set of materials through source-based questions, summaries, and study outputs, including use in Gemini.",
        add: "Conclusions need to become knowledge for later work: preserve new decisions, maintain related Wiki pages, and retrieve them from connected AI tools. This is a different job from producing study materials, not a claim that NotebookLM cannot reuse sources.",
      },
      "wiki-graveyard": {
        setup: "Choose files and an AI tool that supports their formats. Confirm which version it can read and whether it can edit originals; a full knowledge base may be unnecessary.",
        keep: "You have a small, stable set of files and your current tool can already find and read what each task needs.",
        add: "A specification changes, and you want the knowledge pages citing it queued for upkeep, not just the new file read on your next question. Wenlan supplies the source links, stale-page tracking, and review flow instead of asking you to implement that layer with scripts. Connect supported sources and configure a model first; eligible pages can refresh in the background, while pages you edited receive a revision for review.",
      },
    },
  },
  "zh-TW": {
    title: "換一種工具，平常的工作會怎麼變？",
    intro: "先看哪些工作想保留，再決定哪些交給工具。以下依公開文件整理適用情況，不是易用性實測，也不是每個人都該換工具的結論。",
    setupTitle: "一開始要做什麼",
    keepTitle: "什麼情況下，繼續用它就好",
    addTitle: "什麼情況下，值得加入 Wenlan",
    rows: {
      "llm-wiki-workflow": {
        setup: "nashsu/llm_wiki 要先安裝 App、建立專案、設定模型並加入來源；之後可用資料夾監看自動編整，MCP 則另行連接。",
        keep: "你想把文件與有用的回答編成 Markdown Wiki，而且它的 App、專案結構與 MCP 流程已經合用。它已有產品介面與自動化，不只是研究配方。",
        add: "例如，已保存的交付日期從九月改為十月，你希望系統找出受影響的知識頁，而不只多存一則筆記。Wenlan 接受取代修訂後，會把頁面依據接到新記憶並標記待更新；背景刷新仍需可用模型，你改過的頁面則先提出修訂讓你審核。",
      },
      "llm-wiki-1": {
        setup: "開啟 vault、撰寫筆記即可開始。AI 是選配：挑選外掛或外部工具，再確認模型、檔案權限與備份需求。",
        keep: "自己撰寫與整理筆記，就是你思考的一部分；現有搜尋、連結與外掛也已經夠用。",
        add: "你希望保留原本的 vault 不動，另外維護一份有來源、供後續 AI 工作取用的 Wiki。Wenlan 仍需連接來源與設定模型，不會省掉所有初始設定，也不取代你的筆記編輯器。",
      },
      "vault-agents": {
        setup: "先安排工作區頁面與權限。若要 Custom Agent 無人值守執行，再確認方案、設定指示、觸發條件與存取範圍。",
        keep: "共享頁面、團隊協作、資料庫與工作區權限是主要需求；Notion 的 Agent 也能自動處理工作區任務。",
        add: "你需要一份不依附工作區的本機知識庫，讓已連接的 AI 工具取用，並有內建的來源追蹤與頁面審核流程。Wenlan 不取代 Notion 的團隊工作區或專案管理功能。",
      },
      notebooklm: {
        setup: "建立筆記本、選定來源。支援的 Google Drive 匯入會在開啟筆記本時同步，上傳檔案則保留匯入副本；先確認格式與分享設定。",
        keep: "主要任務是讀懂一組材料，根據來源提問、摘要或製作學習材料，也會在 Gemini 使用這些來源。",
        add: "閱讀結論要接回後續工作：保存新的決策、維護相關 Wiki 頁，再從已連接 AI 工具找回。這和製作學習材料是不同任務，不是說 NotebookLM 不能重用來源。",
      },
      "wiki-graveyard": {
        setup: "選好文件與支援格式的 AI 工具，確認讀到哪個版本、能否改原檔；不一定需要先建立完整知識庫。",
        keep: "文件少而穩定，現有工具已能找到並讀取每次任務需要的資料。",
        add: "某份規格改了，你希望引用它的知識頁也進入更新流程，而不只在下次提問時讀到新版。Wenlan 已內建來源關聯、過期追蹤與修訂審核，不必自己用腳本搭出這一層。先連接支援的來源、設定模型；符合條件的頁面可在背景刷新，你編輯過的頁面則先提出修訂讓你審核。",
      },
    },
  },
  "zh-CN": {
    title: "换一种工具，日常工作会怎么变？",
    intro: "先看哪些工作想保留，再决定哪些交给工具。以下根据公开文档整理适用情况，不是易用性实测，也不意味着每个人都该换工具。",
    setupTitle: "开始前要做什么",
    keepTitle: "什么情况下，继续用它就好",
    addTitle: "什么情况下，值得加入 Wenlan",
    rows: {
      "llm-wiki-workflow": {
        setup: "nashsu/llm_wiki 需要先安装 App、创建项目、配置模型并添加来源；之后可以通过文件夹监控自动整理，MCP 则单独连接。",
        keep: "你希望把文档与有用的回答编成 Markdown Wiki，而且它的 App、项目结构和 MCP 流程已经合用。它已有产品界面与自动化，不只是研究配方。",
        add: "例如，已保存的交付日期从九月改为十月，你希望系统找出受影响的知识页，而不只多存一条笔记。Wenlan 接受替代修订后，会把页面依据连到新记忆并标记待更新；后台刷新仍需可用模型，你改过的页面则先提出修订供你审核。",
      },
      "llm-wiki-1": {
        setup: "打开 vault、撰写笔记即可开始。AI 是可选项：选择插件或外部工具，再确认模型、文件权限和备份需求。",
        keep: "自己撰写和整理笔记，就是你思考的一部分；现有搜索、链接与插件也已经够用。",
        add: "你想保留原来的 vault 不动，另外维护一份有来源、供后续 AI 工作使用的 Wiki。Wenlan 仍需连接来源与配置模型，不会省掉所有初始设置，也不取代你的笔记编辑器。",
      },
      "vault-agents": {
        setup: "先安排工作区页面与权限。如果需要 Custom Agent 无人值守执行，再确认方案，配置指示、触发条件和访问范围。",
        keep: "共享页面、团队协作、数据库和工作区权限是主要需求；Notion 的 Agent 也能自动处理工作区任务。",
        add: "你需要一份独立于工作区的本地知识库，让已连接的 AI 工具使用，并有内置的来源跟踪和页面审核流程。Wenlan 不取代 Notion 的团队工作区或项目管理功能。",
      },
      notebooklm: {
        setup: "创建笔记本、选择来源。支持的 Google Drive 导入会在打开笔记本时同步，上传文件则保留导入副本；先确认格式和分享设置。",
        keep: "主要任务是理解一组材料，根据来源提问、摘要或制作学习材料，也会在 Gemini 使用这些来源。",
        add: "阅读结论需要接回后续工作：保存新的决策、维护相关 Wiki 页面，再从已连接的 AI 工具中找回。这和制作学习材料是不同任务，不是说 NotebookLM 不能复用来源。",
      },
      "wiki-graveyard": {
        setup: "选择文件与支持格式的 AI 工具，确认读取的版本以及能否修改原文件；不一定需要先建立完整知识库。",
        keep: "文件少而稳定，现有工具已能找到并读取每次任务需要的资料。",
        add: "某份规范改了，你希望引用它的知识页也进入更新流程，而不只在下次提问时读到新版。Wenlan 已内置来源关联、过期追踪与修订审核，不必自己用脚本搭出这一层。先连接支持的来源、配置模型；符合条件的页面可在后台刷新，你编辑过的页面则先提出修订让你审核。",
      },
    },
  },
};

export function getWorkflowGuideCopy(locale: Locale): GuideCopy {
  return guides[locale];
}
