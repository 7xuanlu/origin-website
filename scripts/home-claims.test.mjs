import assert from "node:assert/strict";
import test from "node:test";
import { enContent } from "../src/i18n/content/en.ts";
import { zhCNContent } from "../src/i18n/content/zh-CN.ts";
import { zhTWContent } from "../src/i18n/content/zh-TW.ts";
import { assertProtectedTokensPreserved } from "../src/i18n/protected-tokens.ts";

const dictionaryByLocale = {
  en: enContent,
  "zh-TW": zhTWContent,
  "zh-CN": zhCNContent,
};

test("all comparison translations preserve product identifiers, source URLs and configuration tokens", () => {
  for (const [locale, dictionary] of Object.entries(dictionaryByLocale)) {
    assertProtectedTokensPreserved(enContent.home.content.redesign.pains, dictionary.home.content.redesign.pains, locale);
  }
});

test("workflow comparison uses the same three dimensions and separates the LLM Wiki pattern from products", () => {
  const expectedDimensions = {
    en: ["How do you use it day to day?", "What upkeep happens automatically?", "When do I decide?"],
    "zh-TW": ["平常怎麼用？", "哪些整理會自動做？", "什麼時候要我決定？"],
    "zh-CN": ["平常怎么用？", "哪些整理会自动做？", "什么时候要我决定？"],
  };
  for (const [locale, dictionary] of Object.entries(dictionaryByLocale)) {
    const copy = dictionary.home.content.redesign.pains;
    assert.deepEqual(copy.dimensions, expectedDimensions[locale], `${locale}: shared comparison dimensions`);
    assert.deepEqual(copy.generations.map(({ id }) => id), ["wiki-graveyard", "llm-wiki-workflow", "llm-wiki-1", "vault-agents", "notebooklm"], `${locale}: files first, then named project, Obsidian, Notion, and source notebook`);
    assert.equal(copy.generations[0]?.id, "wiki-graveyard", `${locale}: first comparison choice is the AI files workflow`);
    assert.match(copy.scopeNote, /Wenlan.*LLM Wiki/);
    assert.ok(copy.detailsLabel.length > 0);
    assert.ok(copy.selectorLabel.length > 0);
    assert.match(copy.sourcesChecked, /2026-09-07/);
    assert.ok(copy.current.sources.length >= 2);
    assert.equal(new Set(copy.generations.map((row) => JSON.stringify(row.wenlan?.profile))).size, 5, `${locale}: Wenlan answers each comparator specifically`);
    assert.match(copy.accessNote, /plugin.*CLI.*daemon/);
    assert.ok(copy.helpLabel && copy.current.tagline);
    for (const row of copy.generations) {
      assert.equal(row.profile.length, 3, `${locale}/${row.id}: complete profile`);
      assert.equal(row.profileLabels.length, 3, `${locale}/${row.id}: scannable comparator labels`);
      assert.equal(row.wenlan.labels.length, 3, `${locale}/${row.id}: scannable Wenlan labels`);
      assert.ok([...row.profileLabels, ...row.wenlan.labels].every((value) => value.trim().length > 0));
      assert.ok(row.eyebrow.length > 0);
      assert.ok(row.profile.every((value) => value.trim().length > 0));
      assert.equal(row.wenlan?.profile.length, 3, `${locale}/${row.id}: matched Wenlan answers`);
      assert.ok(row.wenlan.profile.every((value) => value.trim().length > 0));
      for (const emphasis of row.wenlan.emphasis) {
        assert.ok(row.wenlan.profile.some((cell) => cell.includes(emphasis)), `${locale}/${row.id}: emphasis exists in this comparison`);
      }
      assert.ok(row.summary.trim().length > 0);
      assert.ok(row.sources.length > 0);
      for (const source of row.sources) {
        assert.equal(new URL(source.href).protocol, "https:");
        assert.ok(source.label.length > 0);
      }
    }
    const llmWiki = copy.generations.find(({ id }) => id === "llm-wiki-workflow");
    assert.ok(llmWiki);
    assert.equal(llmWiki.name, "LLM Wiki · nashsu");
    assert.equal(llmWiki.tabLabel, "LLM Wiki");
    assert.match(llmWiki.body, /Karpathy/);
    assert.match(llmWiki.body, /nashsu\/llm_wiki/);
    assert.match(llmWiki.body, /citation|引用/i);
    assert.match(llmWiki.body, /review|審核|审核/i);
    assert.match(llmWiki.body, /MCP/);
    const requiredLlmWikiSources = [
      "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f",
      "https://github.com/nashsu/llm_wiki",
      "https://github.com/nashsu/llm_wiki/blob/main/src/lib/ingest.ts",
      "https://github.com/nashsu/llm_wiki/blob/main/mcp-server/README.md",
      "https://github.com/nashsu/llm_wiki/blob/main/src/lib/templates.ts",
    ];
    for (const href of requiredLlmWikiSources) {
      assert.ok(llmWiki.sources.some((source) => source.href === href));
    }
    assert.match(llmWiki.eyebrow, /nashsu\/llm_wiki/);
    assert.doesNotMatch(llmWiki.name, /v1|self-built|自行搭建|自行搭建/i);
    assert.match(llmWiki.profile[2], /writes pages|先寫(?:入)?頁面|先写(?:入)?页面/i);
    assert.match(llmWiki.wenlan.profile[2], /pages? you.*(writ|wrote|edit)|你親自寫過|你亲自写过/i);
    assert.match(llmWiki.profile[0], /desktop App|desktop app|\bApp\b/i);
    const notebook = copy.generations.find(({ id }) => id === "notebooklm");
    assert.match(notebook.profile[1], /Google Drive/);
    assert.match(notebook.body, /Gemini Notebook/);
    const files = copy.generations.find(({ id }) => id === "wiki-graveyard");
    assert.match(files.eyebrow, /Word.*PDF.*PPT.*Markdown/);
    assert.match(files.body, /exported|匯出|导出/);
    assert.match(files.body, /scanned PDF/);
    assert.match(files.body, /OCR/);
  }
});

test("LLM Wiki upkeep compares non-file events with Wenlan per-memory dependency maintenance", () => {
  for (const [locale, dictionary] of Object.entries(dictionaryByLocale)) {
    const row = dictionary.home.content.redesign.pains.generations.find(({ id }) => id === "llm-wiki-workflow");
    assert.match(row.summary, /both.*watch|兩者都有.*監看|两者都有.*监控/i, `${locale}: folder watching is shared`);
    assert.match(row.profile[1], /save.*answer|answers? saved|回答.*存回/i, `${locale}: competitor's non-file answer action is visible`);
    assert.match(row.profileLabels[1], /sources.*Wiki pages|來源與 Wiki 頁面|来源与 Wiki 页面/i, `${locale}: the maintained unit is explicit`);
    assert.match(row.body, /DeepResearch/);
    assert.match(row.body, /without.*source ingest|不再.*來源匯入|不再.*来源导入/i, `${locale}: research writes a page without recursive source ingest`);
    assert.match(row.body, /delet.*source|刪除來源|删除来源/i, `${locale}: competitor source-lifecycle cleanup is acknowledged`);
    assert.match(row.wenlan.profile[1], /editing.*deleting|修改.*刪除|修改.*删除/i, `${locale}: actual record lifecycle events`);
    assert.match(row.wenlan.profile[1], /accepting.*replacement revision|接受取代修訂|接受替代修订/i, `${locale}: verified acceptance path, not every supersession path`);
    assert.match(row.wenlan.profile[1], /flags|標記|标记/i, `${locale}: invalidation is distinct from completed refresh`);
    assert.match(row.wenlan.profile[1], /cite|引用/i, `${locale}: dependency is the cited memory, not arbitrary related content`);
    for (const suffix of ["src/components/chat/chat-message.tsx#L547-L626", "src/lib/deep-research.ts#L505-L545", "src/lib/source-lifecycle.ts#L457-L574", "crates/wenlan-core/src/db.rs#L31034-L31143"]) {
      assert.ok(row.sources.some(({ href }) => href.endsWith(suffix)), `${locale}: inspectable lifecycle source ${suffix}`);
    }
  }
});

test("comparison explains daily actions, automatic triggers and intervention without false manual-only competitors", () => {
  for (const [locale, dictionary] of Object.entries(dictionaryByLocale)) {
    const copy = dictionary.home.content.redesign.pains;
    assert.match(copy.accessNote, /model|模型/i, `${locale}: setup condition stays visible`);
    assert.match(copy.accessNote, /page|頁面|页面/i, `${locale}: initial pages are not promised as automatic`);
    const llmWiki = copy.generations.find(({ id }) => id === "llm-wiki-workflow");
    assert.match(llmWiki.profile[1], /automat|自動|自动/i, `${locale}: source-watch automation acknowledged`);
    assert.match(llmWiki.summary, /both|兩者|两者/i, `${locale}: shared capabilities explicitly acknowledged`);
    assert.match(llmWiki.wenlan.profile[1], /eligible|符合條件|符合条件/i, `${locale}: refresh is bounded`);
    const notion = copy.generations.find(({ id }) => id === "vault-agents");
    assert.match(notion.profile[1], /Custom Agents/);
    assert.match(notion.profile[1], /schedule|排程|定时|计划/i);
    assert.match(notion.profile[1], /permission|access|權限|权限/i);
    assert.ok(notion.sources.some(({ href }) => href === "https://www.notion.com/help/custom-agents"));
    assert.match(notion.body, /Business.*Enterprise/);
    assert.equal(new Set(copy.generations.map(({ summary }) => summary)).size, 5);
    for (const row of copy.generations) {
      assert.match(row.wenlan.profile[2], /revis|修訂|修订/i, `${locale}/${row.id}: intervention names an actual revision decision`);
      assert.doesNotMatch(row.summary, /only.*automat|唯一.*自動|唯一.*自动/i);
    }
  }
});

test("LLM Wiki detail retains decision records and v2 lineage while its first row compares everyday access", () => {
  for (const [locale, dictionary] of Object.entries(dictionaryByLocale)) {
    const copy = dictionary.home.content.redesign.pains;
    const row = copy.generations.find(({ id }) => id === "llm-wiki-workflow");
    assert.match(copy.current.body, /independent|獨立|独立/i, `${locale}: detail retains independent decision records`);
    assert.match(copy.current.body, /supersed|supersession|取代|替代/i, `${locale}: detail retains revised knowledge relationships`);
    assert.match(row.wenlan.profile[0], /background service|背景服務|后台服务/i, `${locale}: Wenlan still needs a running service`);
    assert.match(row.wenlan.profile[0], /without the desktop App|不必開桌面 App|不必打开桌面 App/i, `${locale}: headless access is explicit`);
    assert.match(row.profile[0], /MCP/, `${locale}: external-tool access is shared`);
    assert.match(row.profile[0], /App is running|App 需保持運作|App 需要保持运行/i, `${locale}: named competitor's runtime requirement is explicit`);
    assert.match(row.wenlan.profile[1], /existing|既有|已有/i, `${locale}: matched page growth is bounded`);
    assert.match(row.profile[0], /documents|文件|文档/i);
    assert.match(row.profile[0], /answers|回答/i, `${locale}: competitor can save answers, not only import documents`);
    assert.match(row.body, /Business/);
    assert.match(row.body, /supersedes/);
    assert.match(copy.current.body, /Rohitg00|rohitg00/);
    assert.match(copy.current.body, /proposal|提案/i);
    assert.ok(copy.current.sources.some(({ href }) => href === "https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2"));
    assert.doesNotMatch(`${row.name} ${row.summary}`, /\bv[123]\b/i, `${locale}: no misleading version ranking`);
  }
});

test("workflow summaries expose everyday actions and qualify file and sync behavior", () => {
  for (const [locale, dictionary] of Object.entries(dictionaryByLocale)) {
    const rows = dictionary.home.content.redesign.pains.generations;
    const llmWiki = rows.find(({ id }) => id === "llm-wiki-workflow");
    assert.match(llmWiki.wenlan.profile[0], /connected.*tools?|已連接.*工具|已连接.*工具/i, `${locale}: daily action includes where knowledge is reused`);
    const obsidian = rows.find(({ id }) => id === "llm-wiki-1");
    assert.ok(obsidian.sources.some(({ href }) => href.endsWith('/plugin-security')));
    const notebook = rows.find(({ id }) => id === "notebooklm");
    assert.match(notebook.profile[1], /eligible|支援.*Google Drive|支持.*Google Drive/i);
    const files = rows.find(({ id }) => id === "wiki-graveyard");
    assert.match(files.name, /AI.*(?:files|文件)/i, `${locale}: tab names AI-assisted file work, not only a file format`);
    assert.match(files.body, /before adding a Wiki-maintenance system|尚未另外建置 Wiki 維護系統|尚未额外构建 Wiki 维护系统/i, `${locale}: supporting explanation scopes the comparison to a direct-file workflow, not all AI tools`);
    assert.match(files.profile[1], /memory|記憶|记忆/i, `${locale}: native persistent memory is acknowledged, not dismissed as manual-only`);
    assert.match(files.body, /Markdown.*PDF/i, `${locale}: supported formats stay in the files workflow explanation`);
  }
});

test("AI files comparison distinguishes a supplied knowledge system from custom upkeep logic", () => {
  const acceptedFirstDescriptions = {
    en: "Documents and saved decisions become a cited Wiki. Retrieve prior conclusions and their evidence from connected AI tools, then continue the work.",
    "zh-TW": "文件與保存的決策編成附引用的 Wiki；從已連接的 AI 工具找回前次結論與依據，接著工作。",
    "zh-CN": "文档与保存的决策整理成带引用的 Wiki；从已连接的 AI 工具找回上次结论与依据，接着工作。",
  };
  for (const [locale, dictionary] of Object.entries(dictionaryByLocale)) {
    const files = dictionary.home.content.redesign.pains.generations[0];
    assert.equal(files.id, "wiki-graveyard");
    assert.equal(files.wenlan.profile[0], acceptedFirstDescriptions[locale], `${locale}: preserve the user-approved explanation`);
    assert.match(files.wenlan.labels[0], /knowledge base|知識庫|知识库/i, `${locale}: lead with the knowledge system, not generic cross-session memory`);
    assert.match(files.profile[1], /source|來源|来源/i);
    assert.match(files.profile[1], /pages|頁面|页面/i);
    assert.match(files.profile[1], /additional.*logic|另外建置.*機制|额外构建.*机制/i, `${locale}: explain the missing implementation, not a vague settings difference`);
    assert.match(files.body, /hooks/);
    assert.match(files.body, /prompt|提示詞|提示词/i);
    assert.ok(files.sources.some(({ href }) => href === "https://code.claude.com/docs/en/hooks-guide"));
    assert.doesNotMatch(files.profile.join(" "), /depends on the tool|取決於選用工具|取决于选用工具/i);
    for (const detail of files.profile) {
      const length = locale === "en" ? detail.split(/\s+/).length : [...detail].length;
      assert.ok(length <= (locale === "en" ? 25 : 46), `${locale}: comparator cells stay concise without clipping content`);
    }
  }
});

test("open-source copy states the runtime and desktop license split in all locales", () => {
  for (const dictionary of Object.values(dictionaryByLocale)) {
    const copy = dictionary.home.content.sections.openSourceCta;
    assert.match(copy.note, /Apache-2\.0/);
    assert.match(copy.note, /AGPL-3\.0-only/);
    assert.doesNotMatch(copy.title, /where it matters|重要的地方/);
  }
});

const acquisitionLinks = [
  { id: "llm-wiki", href: "/learn/distilled-wiki-pages-ai-memory" },
  { id: "ai-knowledge-base", href: "/learn/source-backed-wiki-pages-ai-work" },
  { id: "ai-knowledge-base-tool", href: "/learn/choose-ai-knowledge-base-tool" },
];

const comparisonLinks = [
  "/learn/distilled-wiki-pages-ai-memory",
  "/learn/source-backed-wiki-pages-ai-work",
  "/learn/choose-ai-knowledge-base-tool",
  "/learn/wenlan-vs-obsidian-ai-memory",
];

const expectedWorksWithNotes = {
  en: "Read from your Obsidian vault without changing your notes.",
  "zh-TW": "可讀取 Obsidian 筆記，保留原文。",
  "zh-CN": "可读取 Obsidian 笔记，保留原文。",
};

const oldClaims = {
  en: [
    "every claim cited",
    "stale facts superseded",
    "Every page stays cited, linked, and current",
    "No sources, no recall, no upkeep",
    "enriched while you sleep",
    "Every claim keeps its source",
    "every distilled claim cites",
    "never bleeds",
    "Every MCP client reads",
    "96% fewer tokens",
  ],
  "zh-TW": [
    "每個 claim 都有引用",
    "過時事實自動被取代",
    "每一頁都保持有引用、有連結、跟得上現況",
    "沒有來源、沒有 recall、沒有維護",
    "在你睡覺時持續 enrich",
    "每個 claim 都留著來源",
    "每個蒸餾出的 claim 都引用",
    "永遠不會滲進",
    "每個 MCP client 都透過",
    "少 96% tokens",
  ],
  "zh-CN": [
    "每个 claim 都有引用",
    "过时事实自动被取代",
    "每一页都保持有引用、有链接、跟得上现况",
    "没有来源、没有 recall、没有维护",
    "在你睡觉时持续 enrich",
    "每个 claim 都留着来源",
    "每个蒸馏出的 claim 都引用",
    "永远不会渗进",
    "每个 MCP client 都通过",
    "少 96% tokens",
  ],
};

test("hero pairs growing-note pain with the living-wiki mechanism in all locales", () => {
  const expected = {
    en: ["Your notes keep growing.", "Still starting from scratch?"],
    "zh-TW": ["筆記一直在累積，", "工作卻還得從頭來？"],
    "zh-CN": ["笔记一直在积累，", "工作却还得从头来？"],
  };
  for (const [locale, dictionary] of Object.entries(dictionaryByLocale)) {
    const hero = dictionary.home.content.redesign.hero;
    assert.deepEqual([hero.headline.pre, hero.headline.emphasis], expected[locale]);
    assert.match(hero.description, /source-backed wiki|有來源、能持續更新的 Wiki|有来源、能持续更新的 Wiki/);
  }
});

function faqById(home, id) {
  return home.faqs.items.find((item) => item.id === id);
}

test("homepage copy makes bounded claims and describes fair alternatives in every locale", () => {
  for (const [locale, dictionary] of Object.entries(dictionaryByLocale)) {
    const home = dictionary.home.content;
    const serialized = JSON.stringify(home);
    for (const claim of oldClaims[locale]) {
      assert.doesNotMatch(
        serialized,
        new RegExp(claim.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")),
        `${locale} still contains: ${claim}`,
      );
    }

    assert.deepEqual(
      home.hero.metaLinks.map(({ id, href }) => ({ id, href })),
      acquisitionLinks,
      `${locale} acquisition links changed`,
    );
    // Approved two-sentence hero explains the wiki mechanism, not only the pain.
    assert.equal(home.redesign.hero.description.split(/\s+/).filter(Boolean).length <= 40, true);
    assert.equal(home.redesign.hero.worksWithNote, expectedWorksWithNotes[locale]);
    assert.match(home.redesign.hero.worksWithNote, /Obsidian/);
    assert.match(home.redesign.hero.worksWithNote, /without changing|保留原文/i);
    assert.doesNotMatch(
      home.download.description,
      /notarized|已公證的|已公证的/i,
      `${locale} homepage download description contains notarized marketing`,
    );

    const alternativeText = home.redesign.pains.generations
      .map((generation) => `${generation.name} ${generation.body}`)
      .join(" ");
    assert.match(alternativeText, /Markdown/);
    assert.match(alternativeText, /Obsidian/);
    assert.match(alternativeText, /Notion/);
    assert.doesNotMatch(alternativeText, /Source-based notebook|來源型問答筆記工具|来源型问答笔记工具/);
    assert.equal(home.redesign.pains.current.highlights.length, 4);
    assert.match(alternativeText, /cloud|雲端|云端/);
    assert.match(alternativeText, /offline|離線|离线/);
    assert.match(alternativeText, /export(?:ed)?(?: as)? backups|匯出備份|导出备份/);
    assert.match(alternativeText, /version checking|內容版本|内容版本/i);
    assert.doesNotMatch(alternativeText, /depend on the workflow|要看你選擇的工作流程|要看你选择的工作流/);
    assert.doesNotMatch(home.redesign.pains.generations[0].name, /agent|代理/i);

    const currentBody = home.redesign.pains.current.body;
    assert.match(currentBody, /source-backed|有來源|有来源/i);
    assert.match(currentBody, /review|審核|审核/);
    assert.match(currentBody, /Living Wiki/);
    assert.match(currentBody, /write|撰寫|编写/i);
    assert.match(currentBody, /update|更新/i);
    assert.match(currentBody, /connected|已連接|已连接/i);
    assert.match(currentBody, /documents|來源文件|来源文档/);
    assert.match(currentBody, /decisions|決策|决策/);
    assert.match(currentBody, /change history|變更歷程|变更历史/);
    assert.doesNotMatch(currentBody, /does not guarantee correctness|不保證內容正確|不保证内容正确|eliminate upkeep|消除維護工作|消除维护工作/i);

    assert.deepEqual(
      home.redesign.pipeline.stages.map((stage) => stage.id),
      ["capture", "distill", "brief"],
      `${locale} pipeline stage IDs changed`,
    );
    const pipelineTitles = home.redesign.pipeline.stages.map((stage) => stage.title).join(" ");
    assert.match(pipelineTitles, /decision|決策|决策/i);
    assert.match(pipelineTitles, /page|頁面|页面/i);
    assert.match(pipelineTitles, /next|下一|下一个|下次/i);
    assert.match(home.redesign.pipeline.intro, /setup|設定|配置/);

    const bentoText = home.redesign.bento.cells.map((cell) => `${cell.title} ${cell.body}`).join(" ");
    assert.match(bentoText, /source|來源|来源/i);
    assert.match(bentoText, /review|審核|审核/);
    assert.match(bentoText, /configured|設定|配置/);
    assert.match(bentoText, /source link.*prove every claim|來源連結本身不代表每個主張|来源链接本身不代表每个主张/i);

    const tradeoffText = home.redesign.storage.tradeoffs
      .map((tradeoff) => `${tradeoff.title} ${tradeoff.body}`)
      .join(" ");
    assert.match(tradeoffText, /small|穩定|稳定|小型/);
    assert.match(tradeoffText, /source|來源|来源/i);
    assert.match(tradeoffText, /review|審核|审核/);
    assert.doesNotMatch(tradeoffText, /database alone|只有資料庫|只有数据库/);

    assert.match(home.redesign.metrics.title, /retrieval|檢索|检索/i);
    assert.doesNotMatch(home.redesign.metrics.title, /96%/);
    assert.match(home.redesign.metrics.footnote, /retrieval-only|Retrieval-only/);
    assert.match(home.redesign.metrics.footnote, /general|一般|通用/);
    assert.match(home.redesign.metrics.footnote, /compare|比較|比较/);

    const setupFaq = faqById(home, "setup");
    const notesFaq = faqById(home, "not-notes");
    const builtInFaq = faqById(home, "built-in-memory");
    assert.ok(setupFaq && notesFaq && builtInFaq, `${locale} setup, Obsidian, and memory FAQs are required`);
    assert.match(setupFaq.a, /model|模型|模型/);
    assert.match(setupFaq.a, /client|用戶端|客户端/);
    assert.match(notesFaq.a, /read-only|唯讀|只读/);
    assert.match(notesFaq.a, /Markdown|\.pdf|PDF/);
    assert.match(builtInFaq.a, /varies by tool|因工具而異|因工具而异/);
    assert.doesNotMatch(builtInFaq.a, /usually cannot trace|通常無法追蹤|通常无法追踪/);

    const learnLinks = dictionary.footer.content.groups.find((group) => group.id === "learn")?.links ?? [];
    assert.deepEqual(learnLinks.map((link) => link.href), comparisonLinks, `${locale} footer comparison links changed`);
  }
});
