# Wenlan SEO 增長診斷 — 2026-09-04

本報告回應「目前 SEO 品質與效果是否足以達到 Goal」。這是唯讀診斷及本地存檔，不是網站、Goal 或發布批准。沒有修改頁面、提交 indexing、購買服務或發布外部訊息。

## 1. 結論

**技術與流程已做了不少，但尚未建立足以支撐目標的自然搜尋競爭力。** 不是完全沒有成效：最近完整一週的 GSC impressions 從前一週 285 增至 409，clicks 從 2 增至 7。不過小樣本改善遠不足以證明目前節奏可以達標。

主要瓶頸不是「沒有 sitemap／沒有 schema」，也不能概括成「文章太少」。目前更有證據的問題是：

1. 核心查詢的實際搜尋能見度仍低；重要的 build/how-to 頁面沒有充分交付可重現的成品，難以形成選擇 Wenlan 的理由。
2. 獨立第三方曝光薄弱；大量 backlink 是自有舊網域遷移，並不是新受眾或編輯推薦。
3. 內鏈、中文閱讀體驗及控制規則未完全跟上 AI 知識庫／LLM Wiki 定位。部分檢查只能證明欄位存在，不能證明搜尋意圖或內容品質合格。

這是對可觀察產物與流程的診斷，不是把結果歸咎於某個模型。搜尋演算法沒有提供這個網站的完整因果解釋，下面分開列出已證實的事實與判斷。

## 2. 目標、目前位置與速度

目標不變：2026-09-21 截止，最終窗口固定為 2026-08-24..2026-09-20 的 28 個完整日。GSC 延遲只延後讀取，不移動窗口。

| 指標 | 最新可用觀察 | 目標 | 觀察窗口／限制 |
| --- | ---: | ---: | --- |
| GSC property clicks | 12 | 100 | 最新 28 個完整 GSC 日：08-06..09-02 |
| GSC property impressions | 1,092 | 10,000 | 同上；不是本週報告的原始窗口 |
| Vercel visitors | 570 | 2,000 | 08-07..09-03，完整 UTC 日 |
| GitHub total stars | 62 | 100 | 09-04T22:36:15.280Z，即時總量 |

這些窗口不同，不合成分數，也不把訪客、clicks 和 stars 換算成彼此。

### GSC 的真實近期方向

| 完整 7 日 | Property clicks | Property impressions |
| --- | ---: | ---: |
| 08-06..08-12 | 2 | 212 |
| 08-13..08-19 | 1 | 186 |
| 08-20..08-26 | 2 | 285 |
| 08-27..09-02 | 7 | 409 |

最新週 impressions 比前週多 43.5%。這是正面訊號，但 clicks 的基數只有 2，不能把 2→7 當成穩定成長率。

最終窗口目前已觀察到的 08-24..09-02 是 **8 clicks／580 impressions**。其餘 18 日需要補上 92 clicks／9,420 impressions，平均每天約 **5.11 clicks／523.33 impressions**。最近完整週是每天 **1 click／58.43 impressions**。

所以剩餘時間需要約 **5.1 倍的每日 clicks、9.0 倍的每日 impressions**。若只是沿用最近完整週的日均速度，固定最終窗口的算術情境約為 **26 clicks／1,632 impressions**。這不是預測模型、機率估計或新的 Goal；它用來說明現有速度與目標的差距。

## 3. 證據來源與不能混用的數字

### 最新成功 weekly capture

重用 09-04 Friday 的 authenticated GSC／Vercel 輸出，不重跑整套 weekly pipeline：

- GSC requested range：08-07..09-03；property **12 clicks／1,066 impressions**，CTR **1.13%**，property average position **23.75**。
- Visible-query table：**2 clicks／262 impressions**。
- Query visibility gap：**10 clicks／804 impressions**，約 **75.4%** 的 property impressions 沒有對應到可見 query rows。
- Page table：**12 clicks／1,396 impressions**。By-page aggregation 可以高於 property total，不是計算錯誤，也不能加回 property total。
- Vercel：**570 visitors／1,040 pageviews**；capture 09-04T16:03:54.836Z。
- URL Inspection：09-04T16:07:06.406Z 的 9 個抽樣 URL。

原始輸入仍在 `/tmp/wenlan-seo/`，不加入 git。Weekly 的來源與結果另有 automation memory；原本 ff5f worktree 的報告路徑目前已不存在。本報告保存這次使用的必要解讀，避免只留下失效路徑。

另讀 GSC daily property API，capture **09-04T22:34:57.960Z**，requested 07-10..09-03，dimension `date`、`byProperty`、`dataState=all`。回傳 `firstIncompleteDate=2026-09-03`，因此本報告的完整日計算只到 09-02。這是補充日期完整性與趨勢診斷，不是用新結果覆寫 weekly。

09-04 早上另一次 launch capture 是 **11 clicks／975 impressions**，較晚 weekly 是 **12／1,066**。同一 requested range 的不同擷取時間含有 GSC backfill，不應宣稱是部署帶來的當日增長。

### Vercel 與星星

| Vercel referrer | Visitors | Pageviews |
| --- | ---: | ---: |
| Direct | 537 | 999 |
| Google | 31 | 31 |
| Bing | 2 | 2 |
| GitHub | 2 | 5 |
| DuckDuckGo | 1 | 2 |
| Gemini | 1 | 1 |
| Kagi | 1 | 1 |

Direct 的數值相當於 property visitors 約 94.2%，但 referrer 類別的獨立訪客不保證互斥，不可相加推導新總量。也不能據此判定都是機器人、自己造訪或沒有價值。

重點是：**570 raw visitors 並不代表 570 次搜尋獲客；Google referral 只有 31。** 相較先前 248 visitors、Google 30 的觀察，raw visitors 上升沒有伴隨相同比例的 Google referral 增長；窗口重疊，不能作為因果實驗。

最新 weekly 有 authenticated source-to-page aggregate（metadata 記錄 22 rows），因此不是所有來源與頁面都完全無法交叉。但這仍是彙總資料，不是個人 session 路徑，也不能串接到每一顆 star。

先前 GitHub 原生 traffic capture 為 08-20..09-02：182 views、58 unique visitors；t.co 15 unique、GitHub 12、Threads 5、Google 1。08-30..08-31 的星星集中增加和這些 referrer 只能構成線索，無法證明哪個來源帶來哪顆 star，更不能外推為固定每日成長。

## 4. 搜尋發現與排名：不是全站沒被收錄

本週檢查的 9 個 URL 均回報 indexed、fetch successful、canonical 一致。正式站既有檢查也通過：168 sitemap URLs、30 key pages、6 utility noindex、25 redirects、6 bridge-host cases，沒有 FAQPage JSON-LD。

Live GSC Manual actions 顯示 **No issues detected**。這只排除當下顯示的人工處置，不排除演算法評估或其他品質問題。Security issues 沒有在本次另行完整檢查。

有必要跟進的 discovery 新鮮度：

- Indexing 報表：128 indexed／35 excluded，資料更新至 08-27；不能與今天 168 sitemap URLs 相減後宣布「40 頁未收錄」。
- Sitemap API 最後讀取 08-02T14:21:23.612Z，記錄 120 submitted URLs，0 warnings／errors。後來仍有新頁在 08-30／08-31 被 crawl，故不能說新頁全部沒有被發現。
- 繁中 LLM Wiki 頁的 last crawl 是 **07-29T01:10:28Z**，早於後續改版；英文與簡中同家族已是 08-29 crawl。三語不能共用「Google 已讀到新版」結論。

### 核心 query 的直接證據

| GSC 可見 query | Impressions | Clicks | Query average position |
| --- | ---: | ---: | ---: |
| `llm wiki` | 9 | 1 | 35.1 |
| `karpathy llm wiki` | 7 | 0 | 56.3 |
| `agent knowledge base` | 14 | 0 | 62.7 |
| `superlocalmemory` | 7 | 0 | 8.7 |

以上是該期間、不同搜尋條件的平均值，不是每個人今天看到的精確名次。它們足以說明：**尚無資料支持 Wenlan 已在核心 AI 知識庫／LLM Wiki 查詢建立領先能見度。**

英文 LLM Wiki page 有 86 impressions／2 clicks、page average position 30.7。相較之下 `/learn` 有 199 impressions／0 clicks、position 49.5；其中 `fusellm` 就有 44 個 query impressions，並不是應照單全收的 Wenlan 需求。

SuperLocalMemory 比較頁雖有 110 page impressions，只有 15 個可見 joined-query impressions，其中 6 是 `site:useorigin.app`。不能據 page total 宣稱 110 次高意圖「尋找替代品」需求。

**判斷：目前要先擴大相關查詢的可見度與競爭力，不是把所有零 click 都視為 title／CTA 問題。** 沒有足夠前列曝光時，微調 CTR 無法填滿 impressions 的九倍缺口。

## 5. 內容品質：核心問題是沒有充分交付，不是字數不夠

### A. 「Build」頁面仍像概念介紹

`/learn/source-backed-wiki-pages-ai-work` 的標題承諾建立 source-backed AI knowledge base，實際主要是 Sources／Memories／Pages 的概念、六個步驟及六個帶 placeholder 的 slash commands。

缺少可跟做的一組輸入文件、安裝／執行前提、實際輸出頁面、具體 citation 核對，以及來源改變後的 before／after。讀者理解了設計原則，仍未必能完成標題承諾的任務。

來源：`src/app/(en)/learn/seo-articles.ts:2971` 起。這不是要求增加形容詞或湊長文；應把一個真實任務從輸入做到可驗收結果。

### B. 核心 LLM Wiki 指南已有有用骨架，但可操作證據不足

`/learn/distilled-wiki-pages-ai-memory` 有 starter schema、驗收清單與維護概念，不能說沒有內容。但「five-minute protocol」仍要求讀者已具備 Wenlan 環境，指令中的 topic／question／decision 沒有完整實例，source→page 示範仍偏概念。

文章把「smallest dependable design」描述為 source storage／durable memory／maintained pages／selective retrieval 四個平面（`articles.ts:702`）；Karpathy 原始構想是 raw sources／wiki／schema 三層。四平面可作 Wenlan 的實作解釋，但應明確標成 **Wenlan 的設計選擇**，不要讓讀者誤以為 durable memory 是所有 LLM Wiki 的必要前提。

對照可檢查的內容交付：

- [Karpathy 原始筆記](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)：直接定義結構，以及 ingest／query／lint 的操作。
- [Microsoft llmwiki](https://github.com/microsoft/llmwiki)：有介面圖、前置條件、安裝與執行步驟。
- [LLMWikis.org](https://llmwikis.org/)：提供 starter bundle 與組裝入口。這是競品內容形式觀察，不是認證其排名、流量或自稱的標準地位。

可超越的方向是 **真實且可下載的 source→wiki→citation→source change→review 成品**，而不是再重述「可追溯、可維護」。

### C. 場景擴張快於每頁的獨立交付

08-23..09-01 新增 16 個三語家族，共 48 個 URL。這些頁目前很年輕，不能判為 SEO 失敗；但部分顧問／課程等場景套用相似的 scope、六個 commands、限制清單，缺少該族群真正要帶走的成品。

例如課程頁應展示一份實際概念頁和可核對的講義引用，而不是只展示一個含 placeholder 的回答格式。顧問頁應展示一份可交接的 client brief／decision record，並避免把私人客戶材料公開。

7 個場景家族的 21 個 locale 版本共用 `wenlan-space-review-fixture.png`。這張图是明確標示的真實測試 fixture，並非偽造客戶案例；問題是它不能獨自证明每個不同場景的完成結果。

顧問 candidate 記錄甚至把「未來可另行批准的 first-party README link」當作 authority path 通過依據。這可以是自有傳播入口，卻不是已取得第三方推薦或受眾觸達。

此外，`knowledge base consulting` 的外部搜尋結果包含選擇知識管理顧問服務與名為 KnowledgeBase Consulting 的公司；不等於顧問在找整理客戶資料的工具。[APQC 的服務選擇頁](https://www.apqc.org/What-Should-I-Look-for-When-Choosing-a-Knowledge-Base-Consulting-Firm)與 [XWiki 的合作公告](https://xwiki.com/en/Blog/XWiki-partners-with-KnowledgeBaseConsulting/)呈現了這個歧義。

**存在一個合理使用情境，不等於已有足夠該詞的搜尋需求，更不等於我們的頁面匹配該 SERP。**

### D. 內部 SEO 語言漏進讀者內容

`src/i18n/learn-articles.ts:309` 的公開文字包括「不是產品的搜尋入口」。這是在對內說明定位，不是在幫使用者完成任務。

中文 article chrome 還有「文章封包」、未翻譯的 `Concepts`，以及把繁體中文使用者當作 audience 的表述。應用自然的閱讀語言，說明讀者的工作與成果，不是 locale 分類。

Google 的 [people-first content 指南](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)支持直接、有原創價值、能充分解決任務的內容；它沒有給出本站必須達到某字數才有價值的門檻。這裡的批評針對承諾與交付落差，不是字數分數。

## 6. 三語與 UX：有頁面不代表同等獲客能力

目前 sitemap 168 URLs：英文 6 core／46 docs／62 Learn；繁中與簡中各 6 core／21 Learn。

| Learn locale | 現有頁數 | 本週 page export 有列的頁數 | By-page impressions | Clicks | 未出現在 export 的頁數 |
| --- | ---: | ---: | ---: | ---: | ---: |
| English | 62 | 41 | 661 | 3 | 21 |
| zh-TW | 21 | 6 | 14 | 0 | 15 |
| zh-CN | 21 | 12 | 34 | 2 | 9 |

未出現的 rows 是 unavailable，不能當作零需求或未收錄。三語全部 Learn 共有 4 個 URL 在這個窗口有 click；新頁年齡不同，不能用相同成熟度衡量。

### 可重現的程式缺陷

`src/app/[locale]/learn/[slug]/page.tsx:59–65` 把中文標題移除非 ASCII 字元後當作 section ID。多個不同標題只剩同一個 `ai`／`pdf`／`agent`／`wenlan` 時，沒有去重。

Built HTML 查到以下 4 個 slug 的繁簡版本，共 **8 頁**有重複 ID：

- `distilled-wiki-pages-ai-memory`：`ai`
- `fix-pdf-ingestion-ai-knowledge-base`：`pdf`
- `prevent-multi-agent-knowledge-conflicts`：`agent`
- `source-backed-wiki-pages-ai-work`：`ai`、`wenlan`

繁中 LLM Wiki 正式頁的目錄也顯示不同章節連到同一個 `#ai`。會造成頁內導航定位錯誤；既有測試全綠沒有抓到。應做唯一且穩定的 IDs，並補真實重複中文標題的 regression test。不能聲稱這一個 bug 造成整體流量低迷。

### 取樣的實際閱讀體驗

本次查看首頁與 EN／zh-TW／zh-CN LLM Wiki 的 desktop production renders。文章第一屏以大標題、裝飾圖形和 metadata packet 為主，可操作答案及成品較晚出現。首頁的 living wiki 定位、下載與 GitHub 入口清楚，但 broad second-brain 文案與抽象圖仍不如直接展示任務成果。

建議不是推倒重設，而是將短答案、能完成的結果、前置條件與一個真實成品提前，減少自我描述及裝飾佔位。

本次 Chrome 的 393px viewport 設定沒有實際生效，DOM 寬度仍為 1382px；因此**不宣稱完成本次手機 QA**。先前 PR #173 的手機驗證只適用其已記錄的發布範圍。

## 7. 內鏈與外部推薦

### 內鏈優先序仍偏向舊 memory 比較

Footer Learn links（`src/i18n/content/en.ts:1493–1502`）主要是 Learn hub、Basic Memory、claude-mem、SuperLocalMemory。中文 footer 也連向英文比較頁。

GSC internal links 前列有 Basic Memory 比較頁 77、Learn 69，與取得大量全站入口的 docs 頁；核心 LLM Wiki 未列在前十。這與「AI 知識庫／LLM Wiki 為主、三語並行」的策略不完全一致。

英文文章 `sections.link` 欄位的範圍內，核心 source-backed 頁只有 1 個 contextual inbound source，coding-agent 頁為 0；另有 related cards、hub 與其他入口，因此不能稱為孤兒頁。實際調整應檢查所有入口，把相關任務中的正文連結導向最合適的主頁，不只是增加頁尾卡片數。

### GSC backlinks 不能直接讀成 authority

Live Links report：342 external links、12 linking sites。`useorigin.app` 佔 **290 links**，約 84.8%。這是自有舊網域遷移，不是 290 個新推薦。

其他來源包括 GitHub 16、claude-updates.com 8、libraries.io 8、mcpservers.org 5、agentindex.app 3、docs.rs 3、metahub.ai 3、agentery.com 2、x.com 2、claudeskills.info 1、skillindex.io 1。剩下的 52 links 也含自有 GitHub／套件索引，不是 52 個獨立編輯背書。

本次只讀核對兩條既有 directory 路徑：

- awesome-selfhosted-data #2955：closed，沒有 merged。
- DhanushNehru/awesome-mcp-servers #52：08-24T10:01:32Z merged，且 [upstream README 的 Productivity & Collaboration](https://github.com/DhanushNehru/awesome-mcp-servers#productivity--collaboration)能看到 Wenlan。這是一條真實 placement，並不保證大量受眾。

**判斷：內容與獨立分發必須共同補強。** 自有 README、套件清單、發文準備或 PR open 不能被報成已取得有效權威。Google [Search Essentials](https://developers.google.com/search/docs/essentials)也包含讓相關社群知道內容、使用可理解的文字與可爬連結；但不能因此保證排名或鼓勵垃圾連結。

## 8. OpenSEO、其他工具與需求趨勢

### OpenSEO：確實已連接，不再沿用舊的未連接結論

本次以已登入 Qi-Xuan Lu 的介面確認 Wenlan project 有 GSC Insights。Dashboard 顯示 last 28 days 11 clicks／1,076 impressions，但畫面沒有可核對的固定日期，不能混入 weekly 的數據。

- Credits 已用完。
- Site audit 是 **08-23、50 pages**，不是目前 168 URLs 的新完整審查。
- Backlinks 是 08-01 的旧 capture。
- Rank tracking：**No tracked domains yet**。

所以目前有「接上工具」，沒有「正在以最新資料完整監測排名與全站品質」。OpenSEO 能輔助問題線索，但不能用這次舊 audit 證明当前內容品質或取代 GSC。沒有購買或變更任何設定。

### Ubersuggest：輔助估計有用，但額度和不一致必須攤開

US English `llm wiki` 回傳估計 monthly volume 6,600、difficulty 23；月份估計 May 22,200、June／July 14,800、August 6,600。這是第三方估計單位，不是 Wenlan impressions、Google Trends index 或可獲得流量承諾。

下一個 AI knowledge base 查詢遇到 daily report limit 403，未重試繞過或升級。不能稱已做完三語 volume 比較。

Backlink summary 顯示 DA 1，但 summary 與 detail 的 follow 欄位不一致。DA 不是 Google 指標，不以它精算排名，也不因出現垃圾域名就推論遭到處罰或建議 disavow。

PageSpeed 回傳 desktop LCP 997ms、mobile LCP 4.2s、CLS 0，但沒有可核對的 audit timestamp／完整 route；只能作為待驗的 lab 線索，不能稱為這個部署的實測 Core Web Vitals 結果。GSC 目前無足夠 field data。

### Google Trends：核心類別有訊號，但不能期待沿用早夏熱度

本次 09-04 現場讀取，保留原始 0–100 index，沒有轉成 volume：

| 查詢設定 | 畫面結果與限制 |
| --- | --- |
| US；Search terms `llm wiki`、`AI knowledge base`；Web Search；All categories；UI Past 90 days（table 06-04..09-04） | 平均 index 33、31。早期高於最近資料；09-04 可能未完整。 |
| TW；Search terms `AI 知識庫`、`AI 筆記`、`LLM Wiki`；Web Search；All categories；固定 06-04..09-03 | 平均 index 1、8、3。稀疏且有尖峰，不能換算每月人數。 |

可查 URL：

- [US comparison](https://trends.google.com/trends/explore?date=today%203-m&geo=US&q=llm%20wiki,AI%20knowledge%20base&hl=en)
- [TW fixed-range comparison](https://trends.google.com/trends/explore?date=2026-06-04%202026-09-03&geo=TW&q=AI%20%E7%9F%A5%E8%AD%98%E5%BA%AB,AI%20%E7%AD%86%E8%A8%98,LLM%20Wiki&hl=en)

原始 table 的取樣值如下，並非完整 CSV export：

| US date | llm wiki index | AI knowledge base index |
| --- | ---: | ---: |
| 06-04 | 51 | 51 |
| 06-10 | 86 | 85 |
| 07-03 | 51 | 53 |
| 08-21 | 11 | 7 |
| 08-31 | 10 | 6 |
| 09-03 | 11 | 8 |

| TW date | AI 知識庫 index | AI 筆記 index | LLM Wiki index |
| --- | ---: | ---: | ---: |
| 08-21 | 6 | 23 | 18 |
| 08-28 | 9 | 28 | 15 |
| 08-31 | 7 | 26 | 13 |
| 09-01 | 9 | 32 | 18 |
| 09-02 | 6 | 36 | 17 |
| 09-03 | 6 | 43 | 13 |

推論限於：在這些比較設定下，US 相對關注低於早夏；TW AI 筆記有訊號。**不是說核心類別沒有市場，也不是要把定位改回 generic memory。** AI 筆記還包含會議記錄、轉錄等不同任務，必須排除 Wenlan 不能交付的需求；related queries 的無關詞也不能直接進 candidate。

簡中查詢另透過 SERP／OSS 觀察，沒有把 US／TW Trends 數值當作中國大陸搜尋量。本次沒有完成新的大規模 Reddit／簡中社群採樣，不冒稱「所有用戶需求已研究完整」。

## 9. 控制面：嚴格不等於抓到真正的品質

`pnpm seo:goal:check` 本次 PASS，表示它所驗證的 contract 沒有缺失，不代表 Goal 已恢復、內容有效或策略足以達標。

### 三個不同問題

1. **實際 Goal status 是 blocked。** Prompt 還保留準備 08-28 decision matrix、等待期間限縮 lanes 的描述；獨立 heartbeat 與 weekly 仍 active。不能因為還有工作在發生，就宣稱 campaign controller 狀態正常。
2. **讀取負擔與報告保存問題。** PLAN 約 300KB、EXPERIMENTS 約 668KB、backlog JSON 約 292KB。歷史不可丟，但當前決策被大量累積敘事稀釋；最新 weekly report 還留在已移除的 worktree 路徑。應保留歷史、維持精簡 current index 和可持久化報告，不是再疊一套 ritual。
3. **驗證意圖的範圍被高估。** `seo-intent-map.mjs` 取 `keywords[0]` 作 primaryQuery，檢查正規化後字串是否重複。這驗證欄位與完全相同詞的 owner，不能證明不同用詞的 SERP 不重疊、沒有 cannibalization 或讀者任務被充分回答。

每頁一個主要任務不等於每頁只能排一個 keyword。Google 的 [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)強調可理解的內容與標題，而非把 meta keywords／固定字數當作排名機制。

### 既有門檻應修正用途，不應偷改或假裝不存在

現有頁需 post-deploy crawl、20 target-page impressions、3 joined qualified-query impressions、28 complete-day cooldown 等条件。這些是本專案的實驗規則，不是 Google 規定。

當約 75% query impressions 不可見，又把 post-crawl cooldown 用成所有修正的前提，一些頁就很難取得「准許改善」的門票。例如以 08-29 crawl 起算 28 日已晚於 09-21 目標截止。

建議分開：

- 明確 bug、錯誤事實、失效步驟、缺少標題已承諾交付的內容：經批准修正，記錄實際變更邊界，必要時結束舊版 attribution。
- 為了排名反覆改標題／正文的 SEO 實驗：保留事先聲明的窗口和曝光門檻。
- 通過外部需求 gate 的乾淨新任務：不能被不相關頁的等待條件阻止。

這是規則修正提案，**本次沒有改 contract 或 Goal**。Google 的[搜尋流量診斷指南](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops)要求按證據觀察與合理等待，並沒有保證等待足夠天數就會改善。

Query classifier 也需維護：Brand 規則主要識別 Wenlan／useorigin，中文品牌會掉到 Other；`wenlan web3/payment` 等可能是同名誤命中。報表 top actions 必須經人工核對，不能把分類器結果視為搜尋需求判決。

## 10. 下一步：三項優先工作，而不是再等或繼續堆頁數

| 優先 | 工作 | 為什麼先做 | 完成的驗收方式 |
| --- | --- | --- | --- |
| 1 | 三語核心 LLM Wiki／source-backed AI knowledge base 內容真正交付一個可重現範例 | 已有相關曝光、定位吻合；最核心 build 承諾目前交付不足 | 真實來源小包、前置條件、可執行操作、實際輸出／引用、來源改變後的 review；Wenlan 特有選擇和通用方法分開；三語自然適配 |
| 2 | 給這份實際成品一條可確認的獨立受眾路徑 | 自有遷移連結佔大宗；新文章沒有被看見的路徑，靠 crawl 等待不足 | exact audience／URL／投稿規則／獨立實用價值；另行批准後發布；記錄是否 rendered upstream、referral 與 GSC 變化，不能把 open PR 當成功 |
| 3 | 修正讀者導航與控制面，讓後續品質改善可執行、可驗證 | 真實 anchor bug、舊 memory footer、blocked Goal、字串 owner 假保證 | 8 頁 unique anchor tests；三語核心任務入口；明確 current Goal／report index；最小 contract diff 分開 correctness fix 和 SEO attribution |

第三項中不牽涉內容假說的 bug 與報告修正可以先準備；第一項需要先提最小 contract／experiment boundary 修正，不能假裝舊規則不存在。所有 commit／push／PR／merge／deploy／indexing／external publication 仍需對應批准。

核心頁如何分工應由 task 與 SERP 決定：LLM Wiki 頁解答模式、Karpathy 架構與 starter；source-backed 頁交付帶證據及維護的端到端做法。若進一步查驗它們其實完全競逐同一個任務，才提出合併／重定向方案；本報告沒有證明必須立刻合併或改 URL。

### 不建議做

- 不因流量低就刪除 48 個年輕頁，或反過來繼續無差別新增職業頁。
- 不宣稱 104 個 Learn URLs、全部有 owner、測試通過即代表 SEO 完成。
- 不把所有更新都鎖在 28 日等待後，也不在沒有新證據時每天改標題。
- 不優先買另一個工具、加 FAQPage、製造 synthetic events 或反覆 request indexing。
- 不承諾靠上述修正就一定達成 09-21 的 10,000 impressions；需持續用完整原生數據檢驗速度。

Google [AI 搜尋內容建議](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)更重視不可被簡單重述取代的實用內容與相關視覺證據，而不是把可能的 query variants 各生成一頁；[AI features 文件](https://developers.google.com/search/docs/appearance/ai-features)也沒有要求新增特殊 AI schema／文字檔才能進入 Google 的 AI 搜尋體驗。現階段「更有用的成果」比「更多 GEO 標記」有優先性。

## 11. 驗證與限制

- 檢查基準：`codex/launch-measurement-video`，HEAD `2b4f5837a935ef9cf1ae3db5770e802ffc3a9c70`；與本次已合併的 origin/main `62cbba830e5fa3afbed2e23785079ef305ace6b5` 樹內容一致。
- `pnpm seo:goal:check`：本次 PASS。另重用 PR #173 已通過的 lint／273 SEO tests／81 i18n tests／build／built technical 與正式站技術驗證；沒有把文件診斷當作重新跑完所有驗證。
- 已發布的 v0.18.0 下載及三語 demo 不列為待修的舊版本問題。
- 本次是全站資料／結構盤點，加上重點頁深讀與 4 個 desktop production views；不是逐頁讀完 104 篇文章的完整語言審校，也沒有完成新的 exact-393px QA。
- GSC 約 75% query impressions 隱藏；不能推算完整 non-brand intent、source-to-star 因果或所有頁的實際 query distribution。
- 新增場景多數沒有完整 28 post-crawl 日；低曝光標為不足，不直接判失敗。
- Vercel custom events 仍 account-gated（HTTP 402）；Umami 既有 property 登入未解決；Resend 既有兩位聯絡人沒有 historical attribution。沒有購買付費方案或製造測試轉換。
- 現有資料能辨識瓶頸與錯誤，不能精算 Google 演算法給每一項的權重。

**本次交付是診斷、證據及可批准的優先修正方向；網站、Goal 與外部狀態皆未修改。**
