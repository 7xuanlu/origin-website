import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const componentPath = path.join(process.cwd(), "src/components/home/hero-scenarios.tsx");
const source = fs.readFileSync(componentPath, "utf8");

function localeBlock(locale) {
  const marker = locale === "en" ? "  en: {" : `  \"${locale}\": {`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `missing ${locale} copy block`);
  const nextLocale = source.slice(start + marker.length).search(/\n  (?:\"zh-TW\"|\"zh-CN\"): \{/);
  return source.slice(start, nextLocale === -1 ? source.length : start + marker.length + nextLocale);
}

test("hero scenarios provide all three ordered scenes in every locale", () => {
  assert.match(source, /const copy: Record<Locale, HeroScenariosCopy>/);

  for (const locale of ["en", "zh-TW", "zh-CN"]) {
    const block = localeBlock(locale);
    const ids = [...block.matchAll(/\n        id: "(engineering|client|learning)"/g)].map((match) => match[1]);
    assert.deepEqual(ids, ["engineering", "client", "learning"], `${locale} scene order`);
    assert.match(block, /Illustrative workflow|流程示意/);
  }
});

test("engineering scene keeps the approved retry rule and unresolved timeout boundary", () => {
  const engineering = localeBlock("en").slice(0, localeBlock("en").indexOf('id: "client"'));
  assert.match(engineering, /Retry failed GET requests up to 3 times/);
  assert.match(engineering, /never retry POST automatically/);
  assert.match(engineering, /timeout boundary is still unspecified/);
  assert.match(engineering, /does not specify a timeout duration/);
  assert.doesNotMatch(engineering, /timeout (?:is|of) \d|\d+\s*ms|\d+\s*seconds/i);
  assert.match(source, /const workedExampleHref = "\/learn\/distilled-wiki-pages-ai-memory#worked-example"/);
  assert.match(source, /<LocalizedLink[\s\S]*?href=\{workedExampleHref\}[\s\S]*?locale=\{locale\}/);
});

test("each locale uses concrete workflow inputs rather than placeholder research copy", () => {
  const requiredCopy = {
    en: [
      'title: "API retry policy"',
      'title: "Client delivery scope"',
      'title: "Comparing research methods"',
      "Phase one covers sign-in and payments; data export is a separate discussion.",
      "The last comparison used different question sets for the two search tests.",
      "search-test-a.md",
      "comparison-notes.md",
    ],
    "zh-TW": [
      'title: "API 重試規則"',
      'title: "客戶交付範圍"',
      'title: "研究方法比較"',
      "第一期只做登入與付款，資料匯出另議。",
      "上次比較時，兩份搜尋測試使用了不同題組。",
      "search-test-a.md",
      "comparison-notes.md",
    ],
    "zh-CN": [
      'title: "API 重试规则"',
      'title: "客户交付范围"',
      'title: "研究方法比较"',
      "第一期只做登录和付款，数据导出另议。",
      "上次比较时，两套搜索测试使用了不同的题组。",
      "search-test-a.md",
      "comparison-notes.md",
    ],
  };

  for (const [locale, expected] of Object.entries(requiredCopy)) {
    const block = localeBlock(locale);
    for (const value of expected) {
      assert.ok(block.includes(value), `${locale} should include ${value}`);
    }
  }
  assert.doesNotMatch(source, /Passage retained for comparison|保留供比對的段落|保留供比对的段落/);
});

test("citations resolve to readable supplied source excerpts", () => {
  assert.match(source, /<sup[\s\S]*?scene\.sentenceSources\[sentenceIndex\]\.map[\s\S]*?home-scenario-citation/);
  assert.match(source, /<p[^>]*>[\s\S]*?<ScenarioAnswer scene=\{scene\} locale=\{locale\} idPrefix=\{idPrefix\}/);
  assert.equal((source.match(/sentenceSources: \[\[1, 2\], \[3\]\]/g) ?? []).length, 3);
  assert.equal((source.match(/sentenceSources: \[\[2\], \[1, 3\]\]/g) ?? []).length, 3);
  assert.equal((source.match(/sentenceSources: \[\[3\], \[1, 2\]\]/g) ?? []).length, 3);
  assert.doesNotMatch(source, /<span[^>]*>\{scene\.capturedLabel\}<\/span>|\{strings\.questionLabel\}/);
  assert.match(source, /href=\{`#\$\{sourceAnchorId\(idPrefix, scene\.id, source\.id\)\}`\}/);
  assert.match(source, /const anchorId = sourceAnchorId\(idPrefix, scene\.id, source\.id\)/);
  assert.match(source, /<details[\s\S]*?id=\{anchorId\}/);
  assert.match(source, /<summary[\s\S]*?source\.label/);
  assert.doesNotMatch(source, /<details[^>]*\bopen(?:\s|=|>)/);
  assert.match(source, /<blockquote[\s\S]*?<SourceExcerpt text=\{source\.excerpt\} locale=\{locale\}/);
  assert.match(source, /sourcesInCitationOrder\(scene\)\.map\(\(source, sourceIndex\)/);
  assert.match(source, /\{sourceIndex \+ 1\}/);
});

test("reference numbers and source rows follow first citation appearance without changing evidence IDs", () => {
  assert.match(source, /new Set\(scene\.sentenceSources\.flat\(\)\)/);
  assert.match(source, /scene\.sources\[sourceNumber - 1\]/);
  assert.match(source, /orderedSources\.findIndex\(\(item\) => item\.id === source\.id\) \+ 1/);
  assert.match(source, /data-source-number=\{number\}/);
});

test("compact superscript references attach to the claim before terminal punctuation", () => {
  assert.match(source, /const body = sentence\.replace/);
  assert.match(source, /const punctuation = sentence\.slice\(body\.length\)/);
  assert.match(source, /body\.split\(matcher\)/);
  assert.match(source, /<sup className="relative -top-\[0\.3em\][^"]*align-baseline/);
  assert.match(source, /<\/sup>\s*\{punctuation\}/);
  assert.doesNotMatch(source, /<sup className="[^"]*ml-/);
});

test("tabs are manual, keyboard-accessible, SSR-render all panels, and respect reduced motion", () => {
  assert.match(source, /useId\(\)/);
  assert.match(source, /role="tablist"/);
  assert.match(source, /role="tab"/);
  assert.match(source, /role="tabpanel"/);
  assert.match(source, /aria-selected=\{selected\}/);
  assert.match(source, /aria-controls=\{panelId\}/);
  assert.match(source, /case "ArrowRight"/);
  assert.match(source, /case "ArrowLeft"/);
  assert.match(source, /case "Home"/);
  assert.match(source, /case "End"/);
  assert.match(source, /motion-reduce:/);
  assert.match(source, /strings\.scenes\.map\(\(scene, index\)/);
  assert.doesNotMatch(source, /setInterval|setTimeout|addEventListener|onScroll|requestAnimationFrame/);
});

test("illustrations do not claim live customer or product evidence", () => {
  assert.match(source, /Illustrative workflow · not live product output/);
  assert.match(source, /流程示意，非即時產品輸出/);
  assert.match(source, /流程示意，非实时产品输出/);
  assert.doesNotMatch(source, /customer testimonial|real customer output|measured customer|production result/i);
});

test("question-led scenario hierarchy keeps source interactions native and touch friendly", () => {
  assert.match(source, /<h2[^>]*>[\s\S]*?\{scene\.question\}/);
  assert.match(source, /home-scenario-tab-indicator/);
  assert.match(source, /name=\{`\$\{idPrefix\}-\$\{scene\.id\}-sources`\}/);
  // Inline prose links use the inline-target exception; the equivalent source
  // disclosure remains a full-width 44px touch target below the answer.
  assert.doesNotMatch(source, /home-scenario-citation[^\"]*min-[hw]-11/);
  assert.match(source, /data-source-number=\{number\}/);
  assert.match(source, /<summary[^\"]*className="[^"]*min-h-11/);
  assert.match(source, /event\.preventDefault\(\)/);
  const styles = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
  assert.match(styles, /prefers-reduced-motion: reduce[\s\S]*?home-scenario-tab-indicator/);
  assert.match(styles, /:has\(\.home-scenario-source:nth-child\(1\)\[open\]\)/);
});
