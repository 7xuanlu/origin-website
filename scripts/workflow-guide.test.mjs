import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCoreContent } from "../src/i18n/content/index.ts";
import { getWorkflowGuideCopy } from "../src/i18n/workflow-guide.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const painsSource = fs.readFileSync(path.join(repoRoot, "src/components/home/pains.tsx"), "utf8");
const guideSource = fs.readFileSync(path.join(repoRoot, "src/components/learn/workflow-comparison-guide.tsx"), "utf8");
const englishLearnPage = fs.readFileSync(path.join(repoRoot, "src/app/(en)/learn/[slug]/page.tsx"), "utf8");
const localizedLearnPage = fs.readFileSync(path.join(repoRoot, "src/app/[locale]/learn/[slug]/page.tsx"), "utf8");
const homeSource = fs.readFileSync(path.join(repoRoot, "src/app/_pages/home.tsx"), "utf8");

const rowIds = [
  "wiki-graveyard",
  "llm-wiki-workflow",
  "llm-wiki-1",
  "vault-agents",
  "notebooklm",
];
const locales = ["en", "zh-TW", "zh-CN"];

test("every localized comparison has setup and two-sided choice guidance", () => {
  for (const locale of locales) {
    const guide = getWorkflowGuideCopy(locale);
    assert.deepEqual(Object.keys(guide.rows).sort(), [...rowIds].sort());
    for (const value of [guide.title, guide.intro, guide.setupTitle, guide.keepTitle, guide.addTitle]) {
      assert.ok(value.trim().length > 0);
    }
    for (const [id, choice] of Object.entries(guide.rows)) {
      for (const key of ["setup", "keep", "add"]) {
        assert.ok(choice[key].length > 20, `${locale}/${id}/${key}: concrete choice guidance`);
      }
    }
  }
});

test("homepage routes the selected alternative to the localized owner and keeps the native chooser", () => {
  assert.match(homeSource, /<PainsSection copy=\{redesign\.pains\} locale=\{locale\}/);
  assert.match(painsSource, /<LocalizedLink/);
  assert.match(painsSource, /href=\{`\/learn\/choose-ai-knowledge-base-tool#workflow-\$\{row\.id\}`\}/);
  assert.doesNotMatch(painsSource, /<details\b/);
  assert.match(painsSource, /<table\b/);
  assert.match(painsSource, /<input className="workflow-choice sr-only" type="radio"/);
  assert.match(painsSource, /<WorkflowHelp/);
});

test("the detail guide is conditional on the existing owner article", () => {
  assert.match(englishLearnPage, /article\.slug === "choose-ai-knowledge-base-tool"\s*&&\s*<WorkflowComparisonGuide locale="en"\s*\/>/);
  assert.match(localizedLearnPage, /article\.slug === "choose-ai-knowledge-base-tool"\s*&&\s*<WorkflowComparisonGuide locale=\{resolvedLocale\}\s*\/\>/);
  assert.match(englishLearnPage, /import \{ WorkflowComparisonGuide \} from "@\/components\/learn\/workflow-comparison-guide"/);
  assert.match(localizedLearnPage, /import \{ WorkflowComparisonGuide \} from "@\/components\/learn\/workflow-comparison-guide"/);
  assert.doesNotMatch(guideSource, /useState|useEffect|use client/);
});

test("the guide exposes dated sources and every alternative anchor", () => {
  assert.match(guideSource, /id="workflow-comparisons"/);
  assert.match(guideSource, /copy\.sourcesChecked/);
  assert.match(guideSource, /getWorkflowGuideCopy\(locale\)/);
  assert.match(guideSource, /guideCopy\.rows\[rowId\]/);
  assert.match(guideSource, /copy\.current\.body/);
  assert.match(guideSource, /copy\.current\.highlights\.map/);
  assert.match(guideSource, /row\.summary/);
  assert.match(guideSource, /row\.body/);
  assert.match(guideSource, /row\.sources/);
  assert.match(guideSource, /\/docs\/get-started/);
  assert.match(guideSource, /\/docs\/review-and-trust/);
  assert.match(guideSource, /\/#knowledge-workflows/);

  for (const locale of locales) {
    const copy = getCoreContent(locale).home.content.redesign.pains;
    assert.match(copy.sourcesChecked, /2026-09-07/);
    assert.equal(copy.generations.length, rowIds.length, `${locale}: five comparison alternatives`);
    for (const id of rowIds) {
      const row = copy.generations.find((candidate) => candidate.id === id);
      assert.ok(row, `${locale}: missing ${id}`);
      assert.ok(row.sources.length > 0, `${locale}/${id}: source links`);
      for (const source of row.sources) {
        assert.match(source.href, /^https?:\/\//, `${locale}/${id}: absolute source URL`);
      }
    }
    assert.ok(copy.current.sources.length > 0, `${locale}: Wenlan source links`);
    for (const source of copy.current.sources) {
      assert.match(source.href, /^https?:\/\//, `${locale}: absolute Wenlan source URL`);
    }
  }
});

test("reordering alternatives keeps anchors, choices, and sources keyed by row identity", () => {
  assert.match(painsSource, /const choiceId = `workflow-choice-\$\{row\.id\}`/);
  assert.match(painsSource, /href=\{`\/learn\/choose-ai-knowledge-base-tool#workflow-\$\{row\.id\}`\}/);
  assert.match(guideSource, /href=\{`#workflow-\$\{row\.id\}`/);
  assert.match(guideSource, /<section id=\{`workflow-\$\{row\.id\}`\} key=\{row\.id\}/);
  assert.match(guideSource, /<SourceLinks sources=\{row\.sources\}/);
  assert.doesNotMatch(guideSource, /row\.sources\[index\]|copy\.generations\[index\]/);
});
