import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

test("explicit example anchors do not renumber existing Mandarin fragments", async () => {
  const { buildSectionIds } = await import("../src/app/[locale]/learn/[slug]/section-ids.ts");
  assert.deepEqual(buildSectionIds(["第一段", "完整範例", "第二段"], [undefined, "worked-example", undefined]), ["section-1", "worked-example", "section-2"]);
});

test("all three LLM-wiki owners provide an explicitly authored complete example", async () => {
  const { workedExampleSections } = await import("../src/lib/llm-wiki-worked-example.ts");
  for (const locale of ["en", "zh-TW", "zh-CN"]) {
    const sections = workedExampleSections(locale);
    assert.equal(sections[0].id, "worked-example");
    const code = sections.map((section) => section.code?.code ?? "").join("\n");
    assert.match(code, /api-v1\.md/);
    assert.match(code, /decision-07\.md/);
    assert.match(code, /runbook-v1\.md/);
    assert.match(code, /POST/);
    assert.match(code, /3/);
    assert.match(code, /at most 1 retry/);
    assert.doesNotMatch(code, /<[^>]+>/);
    assert.ok(sections.every((section) => section.body.length > 0));
  }
  const en = readFileSync(new URL("../src/app/(en)/learn/articles.ts", import.meta.url), "utf8");
  const translated = readFileSync(new URL("../src/i18n/learn-articles.ts", import.meta.url), "utf8");
  assert.match(en, /\.\.\.workedExampleSections\("en"\)/);
  assert.match(translated, /\.\.\.workedExampleSections\("zh-TW"\)/);
  assert.match(translated, /\.\.\.workedExampleSections\("zh-CN"\)/);
});
