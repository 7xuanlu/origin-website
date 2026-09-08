# LLM Wiki：替代方案與產品證據，進行中

Captured 2026-09-04 UTC. Local research only; no publication or performance claim.

## 現在必須回答的問題

已有 coding agent 與 Markdown／Obsidian 的人，何時需要額外的知識庫產品？
維護、引用、review 都不是 Wenlan 獨有。要比較實際強制的條件，而不是
拿競品沒有寫出的行為當作不存在。現有 owner 已涵蓋此任務，不新增 URL。

## 三語完整答案比較

以下為本輪讀取的原始正文；單位是 qualitative workflow observation，
不是搜尋量、排名、獨立需求人數或已執行的競品 benchmark。
Language 不推定作者／搜尋者所在地。網頁未提供日期時不補造日期。

| 語言 | 可檢查來源 | 已有答案與限制 |
| --- | --- | --- |
| EN | [Karpathy 原始 gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f), 2026-04-04 | raw/wiki/schema、ingest/query/lint、矛盾與 stale claims；讀完 idea 正文，不宣稱讀完全部留言，也無 Wenlan endorsement。 |
| EN / 中文模板 | [jingw2/llm-wiki-template](https://github.com/jingw2/llm-wiki-template) | README 提供初始化、source_files、progressive retrieval、health check；腳本未執行，不判為較優產品。 |
| zh-TW | [建立你的 AI 知識庫](https://gigaai.studio/learning/obsidian/9-2.html), undated | 資料夾、CLAUDE 模板、來源路徑、測試對話；商業課程答案，不是獨立成效證據。 |
| zh-TW | [四天 LLM Wiki 使用紀錄](https://murmurpaper.heitang.info/2026/08/11/llm-wiki-intro/), 2026-08-11 | 人工審核、矛盾狀態、歷史紀錄與限制；短期自述且 raw imports 為零，不能當文件來源更新測試。 |
| zh-CN | [TRAE LLM Wiki workflow](https://forum.trae.cn/t/topic/17978), 2026-05-16 | inbox draft、promote、來源欄位、supersedes；讀了規則，未執行其實作。 |
| zh-CN | [KnowFlow LLM Wiki](https://www.knowflowchat.cn/docs/product-usage/retrieval-enhancement/llm-wiki), 文件標示 2.4.3 | 增量更新、刪除傳播、WikiLint、重建；供應商產品文件，不是独立實測。 |

本輪 Exa 一次搜尋、5 個 result slots，加上述已知 URL 正文讀取。
Reddit 05-07 原問題本輪 fetch unavailable；既有研究紀錄不得冒充新抓取。
沒有重跑 GSC/Vercel，也沒有把上述 observation 寫入其輸入檔。

## Wenlan v0.18.0 隔離實測

Installed CLI/server report 0.18.0. Read source at tag v0.18.0,
`95ddbe988572b03a670c2d66ca7bea39a3359795`; checkout HEAD is older and not
used as release proof. Binary version matching is not a binary reproducibility claim.

Daemon: 127.0.0.1:17891, explicit WENLAN_DATA_DIR
`/tmp/wenlan-seo-proof-20260904`; GET /api/knowledge/path confirmed its
`pages` directory. Clipboard, screen capture, remote access and model providers
disabled. Existing embedding cache was reused; HOME was not fully isolated.
No personal knowledge database or production daemon was used.

Fixture is deliberately fictional Cedar workshop policies, not user data.
All page text was explicitly supplied by this agent, NOT automatically distilled
by a configured LLM. Store responses said `enrichment: paused`, `extraction_method: none`.

| Probe | Actual result | What it establishes |
| --- | --- | --- |
| POST /api/memory/store: reservation for 7 days; refunds unspecified | 200, `mem_c076b94498df` | Raw capture works without a synthesis provider. |
| POST /api/pages with that one source, default creation kind | 422: `distilled page requires at least 3 distinct source memories (got 1)` | This distilled-page path enforces source count; not a claim every SOURCE page needs three files. |
| Add independent check-in and guest-registration fixture policies | 200, `mem_f839919672f5`, `mem_b604303be7b9`; near-duplicate warnings also returned | Three scoped fictional facts exist; warnings must not be hidden. |
| POST /api/pages with all three, supported answer | 200, `page_f6cb6eaf-1387-4830-bb4b-7943eb93ea7b` | Created distilled page v1, unconfirmed, active. Warning: not in top-10 self-retrieval results. Creation does not prove retrieval quality. |
| GET page and /sources | 200, exact three source bodies | References are inspectable. This alone does not verify each sentence follows from them. |
| PUT page with real IDs but deliberately unsupported full-refund/fee-waiver assertion | 200, `{"ok":true}` | This write response did not reject the unsupported statement. Persistence, any asynchronous evaluation and user-facing warning remain to inspect; do not generalize to all product paths. |
| Read back page, revisions and sources | Unsupported refund claim persisted in page v2; review status remained `unconfirmed`, `stale_reason: null`; revision recorded the edit but no semantic warning | On this tested refresh path, valid reference IDs and a revision trail are not evidence that the prose is entailed by the sources. |
| Store a new memory with `supersedes: mem_c076b94498df` | 200, version chain linked v1 to `mem_77484d580746`; dependent page stayed unchanged with `sources_updated_count: 0` | Explicit supersession preserved history but did not, by itself on this path, invalidate the page linked to the predecessor. Do not teach these as equivalent operations. |
| PUT the linked source `mem_c076b94498df` from 7 to 14 days | 200; dependent page immediately reported `stale_reason: source_updated`, `sources_updated_count: 1`, `pending_rebuild: evidence updated, prose rebuild pending` | In-place mutation of a cited source enforces a visible stale-page state. The stale prose remains readable until rebuilt; this is detection, not automatic factual correction. |

## Fair plain-files control

The same current policy was saved as one Markdown file in the isolated scratch
directory. A direct text read returned “14 days,” marked the old seven-day rule
obsolete, and said refunds and cancellation fees are unspecified. For this small,
single-source task, plain files plus a coding agent are simpler and sufficient.

This is a capability control, not a latency, token, accuracy, or ranking benchmark.
Its limitation appears only when a separately maintained derived answer is reused:
the file alone does not keep a claim-to-source dependency or mark that old answer
stale. Wenlan adds value when a repeated conclusion genuinely spans sources and
the team benefits from inspectable provenance plus a stale signal. It still does
not remove the need to check whether each claim is supported and to review rebuilt
prose.

## Remaining bounded work

1. Test registered folder change/sync with a functioning enrichment configuration
   before calling this automatic document-change detection. The completed direct
   API test is narrower.
2. Turn the completed fair control and source-change result into one compact,
   copyable example rather than a claimed benchmark.
3. Produce one usable source-change example for an existing owner; state exactly
   what Wenlan checks and what still needs human/agent judgment.

No content rewrite is justified solely by this probe. Existing 20/3/post-crawl
cooldown gates and publication approval remain in force. A useful neutral test
fixture is a candidate shareable asset, not an acquired backlink or growth result.

## Owner decision and local factual correction

The task is already owned by the trilingual
`coding-agent-source-backed-knowledge-base` family. The Obsidian comparison owns
integration choice, while `test-ai-knowledge-base-retrieval-after-changes` owns
retrieval regression testing. A new canonical would duplicate intent.

Latest stored weekly evidence shows the English owner at 33 GSC page impressions
and 0 clicks, but the visible qualified-query and post-crawl/cooldown gates are not
all proven here. Therefore this patch does not change title, meta description,
positioning, URL, internal links, or page structure.

Prepared local correction only:

- English, zh-TW and zh-CN now say that a source ID is a pointer, not semantic
  proof that the source supports the prose.
- The acceptance test says to mutate a source the Page already cites and verify
  an actual stale state. It distinguishes that from creating a separate
  superseding memory, which preserved history but did not invalidate the
  predecessor-linked Page in this v0.18.0 probe.
- The Page still requires rebuild and review; stale detection is not automatic
  factual correction.
- `updatedAt` is prepared as 2026-09-04, but nothing is published. A deployment
  would start a new attribution boundary and requires separate approval.

This is treated as a narrow factual-boundary correction permitted by PLAN, not
an early CTR/content experiment. If deterministic checks fail, it is not ready.

## Publication receipt

The user approved this exact factual correction. PR
[174](https://github.com/7xuanlu/wenlan-site/pull/174) merged at
2026-09-05T01:39:00Z as
`ab3b191a8d67493e4206f4613c37b684519e1a13`; Vercel reported the production
deployment complete at 2026-09-05T01:39:51Z. The PR contained only the English
and shared Mandarin article data files.

Integrated verification passed Goal, 81 i18n, 273 SEO, TypeScript, production
build (287 pages), and built technical checks. The deployed audit passed with
168 sitemap URLs, 30 key pages, six utility noindex surfaces, no FAQPage on
168 sitemap pages, 25 redirects and six bridge-host redirects. All three live
routes returned 200 with exact canonicals, the new text, rebuild/review boundary,
`dateModified: 2026-09-04`, and reciprocal en-US/zh-TW/zh-CN/x-default alternates.

This is the new copy-attribution boundary. Observations after
2026-09-05T01:39:51Z must not be attributed solely to the original 2026-08-23
copy. No request indexing, GSC validation, external post, analytics mutation or
new search experiment was performed.
