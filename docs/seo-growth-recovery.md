# SEO 改善工作：先決定值得解的問題

更新：2026-09-05。這是目前工作與下一個決定的短索引，不取代 `PLAN.md`
受保護目標、歷史紀錄或 scenario JSON。完整證據見
[09-04 診斷](seo-audits/2026-09-04-seo-growth-diagnosis.md)。

目前整合工作樹：`/private/tmp/wenlan-task-first-site-sync`，分支
`codex/task-first-site-sync`，以遠端 `origin/main`
`b6eb76c6be2a58345de178771412ed18dc0d3a65` 為底。原改版工作樹
`/private/tmp/wenlan-launch-measurement` 未覆寫；tracked 改動另外保留在本地
`codex/backup-task-first-before-sync`（snapshot `95c466958eb4301b6592d87e4e60d9f14c4f14a7`）。
九個 untracked 文件／元件／測試已完整帶入新工作樹，原本的九個檔案仍保留。
同步只取回遠端更新並作本地整合，沒有把此批改版 push 或 deploy。

遠端 #174 的來源真實性修正、#175 三語配樂影片、#176 下載平台偵測及 release
工具、#177 共用圖示／移除 PREVIEW 與 assurances 已保留。六個衝突檔逐項合併，
不是全檔選 ours/theirs；靜態任務示例與 FAQ 保留，舊模擬動畫不重新掛回。
此處只記同步來源；整合後測試與預覽證據另記於下方，不套用原 HEAD 的 PASS。

## 方向與授權

使用者要求逐步處理全部診斷問題，先問對需求、受眾、替代方案與流量來源，
再決定技術 HOW。本輪執行本地研究、準備、修復與驗證；不涵蓋 commit、push、
PR、merge、部署、外部發布、付費、indexing 或指標變更。目標、截止日與
final window 不變，不回填舊實驗成功或移動其測量邊界。

原生 App Goal 上次實讀為 `blocked`；本文件沒有改變它。目前是本聊天執行
已批准工作，不宣稱原生 Goal 已恢復，也不另建 campaign／weekly automation。

## 沒人看，改善內容有用嗎？

有可能帶來新增搜尋流量，不只是服務已來訪的人；但不是自動或保證。
Google 可以在 crawl 後評估內容與相關性，有用成果也可能被引用。然而本站
目前沒有對照證據能量化「補完整」的增量，不能把品質缺陷直接判成最高回報。

分開驗證兩件事：

- 搜尋：既有 EN LLM Wiki page 最新 weekly 有 86 impressions／2 clicks，
  並非完全沒人看。Google 讀到新版後，是否得到更多相關 query/page 曝光？
- 觸達：這份成果能否讓一個已有相關受眾的入口願意分享，並帶來真實閱讀？
  自有連結、外部投稿、獨立接受、referral、stars 分開記錄。

依據：[Google 內容指南](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)、
[Search Essentials](https://developers.google.com/search/docs/essentials)、
[流量診斷](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops)。
這些支持判斷原則，不是本站成效試驗，也沒有固定排名改善保證。

## 當前決策

### 09-05 採納的改版方向（本地批准，未發布）

使用者已批准依根因診斷實作，不必等真人測試才能修正網站；真人現行方法
對照及後續回用由使用者親自進行。第一批是三語首頁、共用 footer 核心入口
與三語既有 LLM Wiki 核心文章，不新建搜尋 URL，不把範例冒稱產品實測。
已存 Wenlan page `page_662404f4-0a4f-4015-9407-0195990fedd8`，三筆決策來源
已核對；建立時 self-retrieval 有警告，不能宣稱檢索已通過。

- 對誰：反覆使用專案文件與決策、已使用 AI 工具的人；這是待驗證優先群體，
  不是已證實唯一市場。以重複任務區分，不再靠職称數量擴張首頁。
- 交付：首頁清楚說明輸入、可檢查 wiki 結果與限制；核心文章提供完整無敏感
  資料的教學來源、參考答案、缺失資訊與來源變更，不只放 placeholder。
- 選擇理由：公平承認 plain files + agent、Obsidian 和來源型 notebook 的用途。
  撤下「其他工具沒有來源／維護」及普遍省 96% token 的主承諾。
- 第一批讀者：既有 LLM Wiki 搜尋入口和首頁核心內鏈；準備能分享的完整範例。
  外部候選是原需求討論的相關讀者，不代表已獲准回覆或已有引用。發送前仍要
  核對當時規則、參與價值與明確批准，不能用發布數當觸及。
- 為何先做：修正既有誤導主張是信任底線；完善已有相關搜尋曝光的核心 owner，
  比再加入未證明差異的角色頁更能檢验文章是否交付承諾。不預估增量 clicks。
- 改變決策的證據：若真人使用 plain files 更容易得到同樣結果，就縮小 Wenlan
  適用範圍；若已有滿意結果但沒有持續回用，不把問題全部歸咎流量。相反地，
  若回用成立但缺相關觸及，下一批投入明確渠道，不繼續大改相同文案。

本地改版不移動舊實驗的 production/crawl boundary；若要發布，再列 exact diff
及受影響 owner 的 attribution supersession。使用者不需要記住不同階段。

六個必答問題只存一處：
[產品證據標準](seo-product-evidence-standard.md#demand-decision-before-implementation)。
Verifier 只能保護問題不被刪除，不能證明答案正確。

### 09-05 使用者校正：簡化版面，不等於隱藏核心能力

使用者認同先讓訪客認出自己的任務，同時指出 WHY／WHAT／HOW 與原有核心
能力在首批改版中變得不明顯。保留此校正，不能把「避免空泛與誇大」解讀成
「少說產品價值」，也不能把測試通過視為定位有效。

- 本輪已授權的實作僅移除首頁重複裝飾橫線，保留導覽、按鈕、FAQ 與比較列
  的必要邊界；不藉此改文案、IA、URL、analytics 或發布。
  已完成本地實作：focused tests 先 9 pass／1 fail，再 10/10 pass；lint、build、
  goal verifier、diff check 通過，IndexNow skipped。三語 × 393/1440 × light/dark
  共 12 狀態的 section horizontal borders 均為 0px、無水平溢出；已逐張檢視
  首屏截圖及檢查 FAQ 展開。預覽仍為 localhost:3096，未發布。
  截圖位於既有 visualization 根目錄下 `2026-09-05-separators/`；只用
  `*-viewport.png`，full-page capture 有拼接重複，不能當成有效視覺證據。
  這是分隔線變更驗收，不是全站 copy／CJK、無障礙或 Lighthouse 認證。
- 後續內容提案（尚未實作）：WHY 從反覆讀取與來源改變後的信任問題切入；
  WHAT 說明持久、有來源、可維護的知識頁；HOW 用同一案例與真實產品畫面
  串起保存、整理、查詢及變更後的檢查，不只列指令名稱。
- 應恢復清楚可見的能力：已連結來源變動的 stale 訊號及 review、已設定
  clients 的共用查詢、可讀 Markdown 與版本記錄。能力與使用者結果對應，
  不直接重新掛載全部舊卡片或把 mock 動畫當產品證據。
- 限制應緊鄰相應能力、說清必要條件；不是每段都先否定自己。來源連結不
  保證語義正確，stale 訊號不等於自動重寫，跨工具依賴 setup／permissions。
  不恢復普遍省 96% token、競品沒有來源／維護等無法支持的主承諾。

| 路徑 | 已知支持 | 還必須回答 | 現在做什麼 |
| --- | --- | --- | --- |
| 改善已有核心 owner | LLM Wiki 有相關 GSC click，現有示例交付不足 | 相同任務的現有答案是否已更簡單？Wenlan 是否徒增安裝步驟？ | 優先驗證一份真實成品和三語 brief，不先重寫整個家族 |
| 新增不同搜尋任務 | 外部需求可先於本站 GSC 出現 | 104 Learn 頁是否已有 owner？族群是否只是新包裝？ | 保留研究資格；無乾淨缺口不新增，不把年輕頁直接判失敗 |
| 分發現有／改良成果 | 獨立推薦薄弱，更多頁數不能保證被看见 | 哪個既有受眾入口允許並需要這份成果？它真的值得分享嗎？ | 與原型共同準備一個 exact audience/path；不批量投稿 |

首個待驗任務：**已有 Claude Code／Codex 與 Markdown／Obsidian 文件，如何
得到一份可核對的 wiki 答案，並在來源改變後知道哪些結論不能繼續相信？**
AI 知識庫、Karpathy／LLM Wiki 維持同一核心，不改回 generic memory。

Plain files + agent 是必須認真比較的替代方案，不預設 Wenlan 勝出。
若它已能更容易完成任務，就縮小 Wenlan 的主張或換下一個問題，不加宣傳
補洞。下一個高資訊價值的工作是三語最近似答案的完整對比與同一份來源測試，
不是再累積一百個搜尋結果或直接開始另一篇文章。

## 09-04 需求查驗

這是 bounded observation，不是完整市場研究或搜尋量。沿用既有 weekly，
沒有重試用完額度的 OpenSEO／Ubersuggest。下列新觀察不寫入 GSC。

| 語言／地域邊界 | 來源 | 支持與限制 |
| --- | --- | --- |
| English／地區未知 | [05-07 Reddit 原問題](https://www.reddit.com/r/ClaudeCode/comments/1t62d07/how_do_you_all_manage_your_project_specific/) | 問 project 文件與 Obsidian 如何同步、管理。回覆指向定位資料與长期漂移，而非只有連線。單一討論，不代表頻率或最佳架構。 |
| English／地區未知 | [07-15 Reddit 討論](https://www.reddit.com/r/ClaudeAI/comments/1uwrxbo/claude_code_and_obsidian_as_an_aimaintained/) | 展示 ingest/query，也有人指出過期事實及維護成本。r/AIGuild 的同文不重複算佐證；votes 不換算 searches。 |
| Traditional Chinese／網頁語言，不推定使用者地區 | [建立 AI 知識庫教學](https://gigaai.studio/learning/obsidian/9-2.html) | 已有資料夾、CLAUDE.md、測試對話和練習；新答案需要額外實用價值。本輪先讀到搜尋摘錄，完整對比未完成。 |
| Traditional Chinese／作者所在地未驗 | [08-11 個人 LLM Wiki 介紹](https://murmurpaper.heitang.info/2026/08/11/llm-wiki-intro/) | 是公開工作流候選，需詳讀；不當作已驗證 Wenlan 能力。 |
| Simplified Chinese／中文平台 | [TRAE LLM Wiki skill 討論](https://forum.trae.cn/t/topic/17978) | 摘錄涉及來源更新、過期知識及不要直接覆蓋正式條目。完整閱讀未完成，不宣布簡中 gate 全通過。 |
| Simplified Chinese／產品文件 | [KnowFlow LLM Wiki](https://www.knowflowchat.cn/docs/product-usage/retrieval-enhancement/llm-wiki) | 競品自述含文件變 wiki 與過期引用。不是獨立需求，也不能聲稱競品都沒有維護能力。 |

## 全部問題的處理隊列

完成以實際产物與驗證為準；發布和成效分開。使用者不需要記住階段。

| 工作 | 目前狀態 | 下一個交付／驗收 |
| --- | --- | --- |
| 問對問題，而非只列 HOW | 本地完成 | 六問加入既有標準與刪除回歸測試；不新增分數系統 |
| 核心內容交付不足 | v0.18.0 隔離實測完成；三語事實修正已由 PR #174 發布 | 實測證明引用 ID 不等於語義支持、linked-source update 會標 stale，而另存 supersedes 紀錄不會自動讓舊連結頁過期；新 attribution boundary 為 2026-09-05T01:39:51Z |
| 中文目錄重複 IDs | 本地修復與 root render 完成，未發布 | 8 個受影響 routes 的 TOC／section／schema 共用唯一 IDs；不改文案、日期、URL 或 layout |
| 公開內部 SEO 文案及中文 chrome | 待處理 | 移除內部指令，保留必要產品限制；不擴成全站美化 |
| 核心內鏈／footer | 待 owner 決策 | 優先導向真正可完成任務的頁，提出三語 exact diff，不以 link 數驗收增長 |
| 獨立受眾／authority | 待精準路徑 | 一份確實有用的分享＋明確受眾、規則、維護狀態；自有 README 不算獨立背書 |
| TW crawl／sitemap freshness | 有診斷，待定向讀取 | 只讀必要 native state，不重複 indexing request，不將不同日期庫存相減 |
| 品牌誤命中／query 分類 | 待修正 | fixture 區分中文品牌、同名噪音、qualified queries；語義 owner 仍須人工判斷 |
| 原生 Goal／過時 current state／weekly 保存 | 本地索引建立，原生未改 | 保留歷史，最小 current-state／contract diff；不得把未達標 Goal 標完成 |
| OpenSEO／Vercel／Umami | 邊界已查驗 | 免費可用欄位先用；舊 audit 不算新全站審查；事件缺口不虛報解決 |
| 手機／PageSpeed | 待精確測試 | pin route、deployment、實際 viewport；無 field data 不宣稱 CWV 通過或失敗 |
| 最終成效 | 持續，未完成 | 原生窗口與 visibility gap；inconclusive 後仍指出下一項能降低不確定性的工作 |

## 不默默繞過原規則

PLAN 已允許 factual／security／accessibility／technical 修復早於 cooldown，
目錄 bug 依此執行。重大 copy／internal-link 實驗仍受原條款限制。
若原型支持提早改核心頁，再提出有界 supersession diff：舊版 attribution
何時截止、新版何時開始、歷史及 final window 如何保留。不能把內容重寫
冒稱 technical fix，或偷偷移除 20／3／28。

原生 Goal 恢復必須有工具回報；不以新文件假裝完成，也不為繞過 blocked
另建重複 Goal。這不妨礙本聊天繼續已批准的本地修復與研究。

## 本輪驗證

### 2026-09-05 遠端同步：整合完成，仍為本地未發布狀態

- 新整合位置 `/private/tmp/wenlan-task-first-site-sync`，分支
  `codex/task-first-site-sync`；HEAD 與本輪最後核對的 origin/main 均為
  `b6eb76c6be2a58345de178771412ed18dc0d3a65`。本地改版維持 unstaged dirty
  working state，未 commit、push、PR、merge-to-main、部署或 request indexing。
- 原 `/private/tmp/wenlan-launch-measurement` 工作檔完整保留；非破壞性 tracked
  snapshot 為 `95c466958eb4301b6592d87e4e60d9f14c4f14a7`，保存在本地
  `codex/backup-task-first-before-sync`；九個 untracked 檔案亦保留並複製到整合位置。
- 六個衝突逐項整合：保留遠端音樂版影片、desktop-first 下載與平台偵測、
  release-bump 工具及共用圖示，同時保留本地三語任務導向 copy、靜態教學範例、
  FAQ 與文章修改。沒有使用全檔 ours/theirs 覆蓋任一方。
- 實際 render 發現並局部修正中文下載 architecture 標籤與教學引用編號斷行；
  沒有改變下載行為、可見文字或增加引用連結。先確認 regression tests 失敗，
  修正後 focused tests 21/21 PASS。
- 最終驗證：`test:seo` 304/304、`test:i18n` 82/82、`test:goal` 55/55、
  `lint`、`seo:goal:check`、`seo:scenario:check`、`git diff --check` 全部通過。
  SEO suite 使用真實 Wenlan／wenlan-app repo-root 環境變數。
  Production build 287 static pages PASS，IndexNow 明確跳過；built technical
  PASS：26 redirects、7 noindex checks、168 sitemap URLs、24 HTML checks，
  172 HTML pages 無 FAQPage。
- 同一 preview `http://127.0.0.1:3096/zh-TW` 已切換至整合後 production build。
  Isolated headless Chromium 驗證三語首頁、LLM Wiki、下載共九 routes ×
  393/1440 CSS px × dark/light = 36 states；全部直接 200，無水平溢出、壞圖、
  pageerror、console messages、重複 section IDs 或 FAQPage。FAQ、範例與目錄
  跳轉、下載面板展開／收合通過。Root 檢視三語受影響區域與兩項斷行修正。
  未播放影片、下載安裝檔、提交 email 或傳送 analytics；未驗證實體裝置／Safari。
- Render source SHA-256：
  `d8a1bdb5e3bd4a1755de3c4f9517792b7269df8dff83469fae8e84b48087e853`。
  截圖與 `state.json`／`checks.json` 位於
  `/Users/lucian/.codex/visualizations/2026/07/17/019f70d0-90c0-72e0-a213-32f69be1c6c2/2026-09-05-remote-sync/`。
  這是本地整合證據，不代表正式站已發布或流量增加；PLAN、原 attribution 與
  production/crawl boundaries 未因同步而重設。

### 2026-09-05 範例排版與首頁說明修正：本地預覽已更新

- 基於 `codex/task-first-site-sync` HEAD
  `b6eb76c6be2a58345de178771412ed18dc0d3a65` 的既有 dirty working state。
  保留所有同步及改版內容；本輪沒有 commit、push、PR、merge、部署或 indexing。
- 使用者截圖確實是上一輪分隔線清理後的版本，不是快取問題。先前只完成
  分隔線清理，不能稱字體及中文斷行也已驗收。
- 「用得上、查得清」較口語，但失去原「值得信任的活 wiki」的產品辨識度；
  沒有證據證明新標題效果更好。本輪保持標題不動，下一次標題決策需保留
  living-wiki 核心，同時修正原副標普遍自動維護／始終最新的過度承諾。
- 範例答案由 serif 20px 改為 sans 14px，與來源檔名一致；來源檔名與說明
  分行、GET／POST 規則分行、引用編號保持完整。底部回查說明和連結各佔一行，
  繁簡中文說明縮短以避免落單尾字。保留作者示意標記及所有來源／限制。
- 三語 Obsidian 說明改為正向的讀取而不改原文協作說明；繁中為
  「可讀取 Obsidian 筆記，保留原文。」只移除首頁下載文案的 notarized／
  已公證的／已公证的，其他安裝及安全文件中的真實公證資訊保留。
- 先見失敗測試，再修正：layout 11/11、i18n 82/82、focused home-claims、
  lint、goal verifier 通過；最後 production build 287 static pages 通過，
  IndexNow 跳過。本輪沒有重跑完整 SEO suite，不挪用先前的全套結果。
- 最終 production build 經三語 × 393/1440 CSS px × light/dark 共 12 states
  檢查與實際截圖檢視：答案及來源檔名 14px、兩條規則分行、底部說明分行、
  無水平溢出、舊 Obsidian 否定句及首頁公證行銷文字均不存在。
  視覺驗收僅涵蓋本次區域，不代表全站、實體裝置／Safari 或流量成效。
- 最終截圖僅使用下列目錄內的 `*-proof.png` 及 `checks.json`；同目錄不帶
  `-proof` 的圖片是修正前第一輪，不可作最終證據：
  `/Users/lucian/.codex/visualizations/2026/07/17/019f70d0-90c0-72e0-a213-32f69be1c6c2/2026-09-05-proof-type/`。
- 已還原 browser viewport 並重新載入使用者原 tab：
  `http://127.0.0.1:3096/zh-TW`，直接核對新文字、14px 與 light theme。
  這是本地預覽，不是正式站發布。

### 2026-09-05 首批三語任務導向改版：本地完成，未發布

- 整合位置 `/private/tmp/wenlan-launch-measurement`，基於 HEAD
  `2b4f5837a935ef9cf1ae3db5770e802ffc3a9c70` 的 dirty working state。
  保留本輪之前的控制面、文章與中文 section-ID 修改；未 commit、push、PR、
  merge、部署或 request indexing。下方舊驗證記錄仍保留，不能代替本次狀態。
- 三語首頁改為任務、來源及可核對結果；靜態教學參考取代模擬產品活動。
  撤下普遍省 token／自動維護／競品沒有來源等主承諾，公平列替代方案。
  收斂職業卡片與功能堆疊，FAQ 使用原生可展開元件；下載仍在影片之前。
  Footer 的核心入口已調整，原有下載、影片 IDs、email 與 analytics 接線保留。
- 三語既有 LLM Wiki owner 補入三份完整虛構來源、可直接使用的 prompt、
  參考答案、未知資訊及來源衝突案例。明確標記為作者教學範例，不是 Wenlan
  執行／客戶結果／效能比較；不安裝 Wenlan 也能完成。沒有新增 canonical URL。
  原 datePublished 保留，本地 dateModified 為 2026-09-05；尚無新 production boundary。
- 分工：兩個 native workers 負責已定義的三語 leaf copy、layout、測試與建置；
  root 負責主張與策略、整合、中文校訂及實際 production-build render QA。
  真人比較、持續回用與優勢驗證仍由 Lucian 執行，不以這份教學範例替代。
- 檢查通過：`seo:goal:check`、`seo:scenario:check`（18 families／168 sitemap
  owners）、`test:goal` 55/55、`test:i18n` 82/82、`test:seo` 283/283、`lint`。
  Production build 首次因 sandbox 無法下載 Google Fonts 失敗；獲准唯讀字體下載
  後同一命令成功，沒有換字體或依賴；`VERCEL_ENV=development INDEXNOW_FORCE=0`
  確認跳過 IndexNow。`seo:technical:built` PASS：26 redirects、7 noindex checks、
  168 sitemap locations、24 HTML checks，172 HTML 中沒有 FAQPage。
- Root 用既有 isolated headless Chromium 檢查本地 production server：EN／zh-TW／
  zh-CN 的首頁與 LLM Wiki 共六 routes × 393/1440 CSS px × dark/light = 24 states。
  直接 200，沒有水平溢出、壞圖、pageerror、重複 section IDs 或 FAQPage；
  首個 FAQ 展開／收合及 worked-example 跳轉通過。逐語檢視首屏、教學範例、
  來源變更與補充比較／工作流程截圖。未播放影片、提交 email 或傳送 analytics。
  這是 Chromium 視窗驗收，不是實體 iPhone/Safari、全站無障礙或 CWV 認證。
- Render 對應 source SHA-256：
  `8345959389751157ae3ec5a7d32c340605b3cd1c2bc87bd5893f49ce92191954`。
  截圖、`checks.json` 與 `state.json` 保存於
  `/Users/lucian/.codex/visualizations/2026/07/17/019f70d0-90c0-72e0-a213-32f69be1c6c2/2026-09-05-redesign/`。
- 尚未完成：其他文章的內部 SEO chrome／中文術語清理、真正獨立受眾的渠道
  路徑與觸及、真人比較及回用結果。主張更誠實、內容更可操作不等於新增流量。
  發布前仍須檢視 exact diff、處理受影響 owner 的 attribution supersession 並取得
  本批發布批准；原生 blocked Goal 未被工具恢復，目標數字與 final window 未改。

- 完整分段讀取現行 4,778 行 PLAN，改動前 `seo:goal:check` PASS。
- 六問先寫入 standard，刪除 mutation 證明舊 verifier 未攔截（exit 1）；
  補入既有 verifier 後 `pnpm test:goal` 55/55 PASS。
- 本地錨點修復：i18n 82/82、lint、production build PASS；完整 SEO suite
  273/273 PASS，built technical check PASS（168 sitemap URLs）。
- Root 在 Chrome 逐頁檢查 8 個受影響繁簡 routes 的唯一 IDs，點擊桌面
  修正後目錄並核對目標段落；另逐頁檢視實際 `innerWidth=393` 的手機截圖。
  頁面沒有水平溢出，原有長 code block 維持內部捲動；沒有改動 CSS。
  Browser viewport 參數受既有縮放影響，輸入 393 得到 314 CSS px；調整為
  492 後才量到 393 CSS px，完成後已還原。手機截圖是有限可讀性檢查，
  不代表整站視覺／效能驗收；現有不自然標題斷行和內部術語仍在上方隊列。
- `seo:goal:check` 和 `git diff --check` PASS。未 commit、push、PR、merge
  或部署，因此不代表正式站 bug 已消失；修復也不算 SEO 增長成果。
