import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { getCoreContent } from "../src/i18n/content/index.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const homeSource = fs.readFileSync(path.join(repoRoot, "src/app/_pages/home.tsx"), "utf8");
const proofSource = fs.existsSync(path.join(repoRoot, "src/components/home/task-proof.tsx"))
  ? fs.readFileSync(path.join(repoRoot, "src/components/home/task-proof.tsx"), "utf8")
  : "";
const painsSource = fs.readFileSync(path.join(repoRoot, "src/components/home/pains.tsx"), "utf8");
const workflowGuideSource = fs.existsSync(path.join(repoRoot, "src/components/learn/workflow-comparison-guide.tsx"))
  ? fs.readFileSync(path.join(repoRoot, "src/components/learn/workflow-comparison-guide.tsx"), "utf8")
  : "";
const pipelineSource = fs.readFileSync(path.join(repoRoot, "src/components/home/pipeline.tsx"), "utf8");
const downloadSource = fs.readFileSync(path.join(repoRoot, "src/components/home/download.tsx"), "utf8");

test("homepage restores core demonstrations without presenting synthetic live proof", () => {
  assert.match(homeSource, /function MetricBar/);
  assert.match(homeSource, /redesign\.metrics\.bars\.map/);
  assert.match(homeSource, /168 \/ 4505 \* 100/);
  assert.doesNotMatch(homeSource, /HeroLivingPage/);
  assert.doesNotMatch(homeSource, /UseCasesSection/);
  assert.match(homeSource, /<BentoSection\b/);
  assert.match(homeSource, /<StorageSection\b/);
  assert.match(homeSource, /<HeroScenarios\b/);
  assert.match(homeSource, /content\.metrics\.rows\.map/);
});

test("homepage keeps shared brand icons without preview or assurance chrome", () => {
  assert.doesNotMatch(homeSource, /^(<<<<<<<|=======|>>>>>>>)/m);
  assert.match(homeSource, /ArrowRightIcon/);
  assert.match(homeSource, /GitHubLogoIcon/);
  for (const icon of [
    "ClaudeBrandIcon",
    "CursorBrandIcon",
    "ObsidianBrandIcon",
    "OpenAiBrandIcon",
    "VSCodeBrandIcon",
  ]) {
    assert.match(homeSource, new RegExp(icon));
  }
  assert.doesNotMatch(homeSource, /previewBadge|hero\.assurances|assuranceAccents/);
  assert.match(homeSource, /<HeroScenarios\b/);
});

test("homepage retains a hero download path and places full download after evidence", () => {
  const downloadIndex = homeSource.indexOf("<DownloadSection");
  const demoIndex = homeSource.indexOf('id="demo"');

  assert.notEqual(downloadIndex, -1, "download section should remain on the homepage");
  assert.notEqual(demoIndex, -1, "recorded demo section should have a stable #demo anchor");
  assert.ok(downloadIndex > homeSource.indexOf('id="retrieval-evidence"'));
  assert.ok(downloadIndex < homeSource.indexOf('{content.faqs.title}'));
  assert.match(homeSource.slice(0, demoIndex), /HomeCta link=\{content\.hero\.primaryCta\}/);
});

test("homepage explains relevance and differentiation before workflow and full feature detail", () => {
  const order = ['<HeroScenarios', 'id="demo"', '<PainsSection', 'id="integrations"', '<PipelineSection', '<ProductShowcase', '<BentoSection', '<StorageSection', 'id="retrieval-evidence"', '<DownloadSection'];
  const positions = order.map((marker) => homeSource.indexOf(marker));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test("the preserved worked example remains localized and source-linked", () => {
  assert.match(proofSource, /\/learn\/distilled-wiki-pages-ai-memory#worked-example/);
  for (const filename of ["api-v1.md", "decision-07.md", "runbook-v1.md"]) {
    assert.match(proofSource, new RegExp(filename.replace(".", "\\.")));
  }
  assert.match(proofSource, /Retry failed GET requests up to 3 times \[1\]\[2\]; never retry POST automatically \[1\]\[2\]/);
  assert.match(proofSource, /Timeout not specified\. \[3\]/);
  assert.match(proofSource, /en:/);
  assert.match(proofSource, /"zh-TW":/);
  assert.match(proofSource, /"zh-CN":/);
  assert.match(proofSource, /Authored illustrative reference|no real product output/i);
});

test("workflow chooser keeps all evidence server rendered without adding client state", () => {
  assert.doesNotMatch(painsSource, /["']use client["']/);
  assert.doesNotMatch(painsSource, /useEffect|useRef|useState|IntersectionObserver/);
  assert.doesNotMatch(painsSource, /generationEras|generationVerbs|superseded|gen 2 and beyond|>current<|line-through|transition-/);
  assert.match(painsSource, /copy\.generations/);
  assert.match(painsSource, /rows\.map/);
  assert.match(painsSource, /copy\.current/);
  assert.match(painsSource, /data-wenlan-featured/);
  assert.match(painsSource, /text-\[var\(--o-warm\)\]/);
  assert.doesNotMatch(painsSource, /<details\b/);
  assert.match(workflowGuideSource, /copy\.current\.highlights\.map/);
  assert.match(workflowGuideSource, /copy\.current\.body/);
});

test("workflow comparison uses native keyboard controls and matched table rows", () => {
  const choiceSource = fs.readFileSync(path.join(repoRoot, "src/components/home/workflow-choice.tsx"), "utf8");
  assert.match(painsSource, /data-workflow-comparison/);
  assert.match(painsSource, /<fieldset\b/);
  assert.match(painsSource, /<legend\b/);
  assert.match(choiceSource, /type="radio"/);
  assert.match(painsSource, /selected=\{index === 0\}/);
  assert.match(choiceSource, /defaultChecked=\{selected\}/);
  assert.match(painsSource, /htmlFor=\{choiceId\}/);
  assert.match(painsSource, /\{row\.tabLabel \?\? row\.name\}/);
  assert.match(choiceSource, /aria-controls="workflow-comparison-panel"/);
  assert.equal((painsSource.match(/<table\b/g) ?? []).length, 1, "one shared table preserves row geometry across choices");
  assert.match(painsSource, /<table\b/);
  assert.match(painsSource, /scope="col"/);
  assert.match(painsSource, /scope="row"/);
  assert.match(painsSource, /copy\.dimensions\.map/);
  assert.match(painsSource, /workflow-pair-summary/);
  assert.match(painsSource, /<p>\{row\.summary\}<\/p>/, "show the concrete paired difference, not only overlapping feature lists");
  assert.match(painsSource, /row\.wenlan\.profile\[index\]/);
  assert.match(painsSource, /label=\{row\.wenlan\.labels\[index\]\}/);
  assert.match(painsSource, /label=\{row\.profileLabels\[index\]\}/);
  assert.match(painsSource, /<strong>\{label\}<\/strong><p>\{detail\}<\/p>/);
  assert.match(painsSource, /row\.profile/);
  assert.match(painsSource, /<TrackedLocalizedLink/);
  assert.match(painsSource, /copy\.detailsLabel/);
  assert.match(painsSource, /#workflow-\$\{row\.id\}/);
  assert.match(painsSource, /focus-visible:/);
  assert.doesNotMatch(painsSource, /overflow-x-auto|table-fixed|aria-hidden="true"[^>]*>.*LLM Wiki/);
  const css = fs.readFileSync(path.join(repoRoot, "src/components/home/workflow-comparison.css"), "utf8");
  assert.match(css, /\.workflow-alternative\s*\{[^}]*grid-area:\s*1\s*\/\s*1[^}]*visibility:\s*hidden/s);
  assert.match(css, /:has\(#workflow-choice-llm-wiki-workflow:checked\)/);
  assert.match(css, /:has\(#workflow-choice-notebooklm:checked\)/);
  assert.doesNotMatch(css, /:checked\s*\+\s*\.workflow-option\s*\{[^}]*font-weight/s);
  assert.doesNotMatch(css, /thead \.workflow-wenlan\s*\{\s*font-size/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media/);
  assert.match(css, /\.workflow-comparison\s*\{[^}]*text-align:\s*center/s);
  assert.doesNotMatch(css, /vertical-align:\s*middle/);
  assert.match(css, /\.workflow-comparison tbody tr\s*\{[^}]*grid-template-rows:\s*auto auto/s);
  assert.match(css, /\.workflow-comparison tbody td,[\s\S]*?\.workflow-comparison tbody \.workflow-answer\s*\{[^}]*grid-template-rows:\s*subgrid/s);
  assert.match(css, /\.workflow-answer strong\s*\{[^}]*align-self:\s*start/s);
  assert.match(css, /\.workflow-option\s*\{[^}]*justify-content:\s*center[^}]*text-align:\s*center/s);
  assert.match(css, /\.workflow-comparison tbody td\s*\{[^}]*grid-row:\s*2\s*\/\s*span 2/s);
});

test("workflow comparison defaults to the first data row without positional identity coupling", () => {
  const rows = getCoreContent("en").home.content.redesign.pains.generations;
  assert.equal(rows[0]?.id, "wiki-graveyard", "the first data entry is the AI files workflow");
  assert.match(painsSource, /rows\.map\(\(row, index\) =>/);
  assert.match(painsSource, /selected=\{index === 0\}/);
  assert.doesNotMatch(painsSource, /defaultChecked=\{[^}]*wiki-graveyard/);
  assert.match(painsSource, /const choiceId = `workflow-choice-\$\{row\.id\}`/);
  assert.match(painsSource, /#workflow-\$\{row\.id\}/);
});

test("comparison identifies named projects with keyboard and touch accessible background", () => {
  assert.match(painsSource, /row\.eyebrow/);
  assert.match(painsSource, /copy\.current\.tagline/);
  assert.match(painsSource, /WorkflowHelp/);
  assert.match(painsSource, /copy\.accessNote/);
  const help = fs.readFileSync(path.join(repoRoot, "src/components/home/workflow-help.tsx"), "utf8");
  for (const contract of [/popover="auto"/, /onFocus=\{show\}/, /onClick=\{show\}/, /onPointerEnter=\{show\}/, /Escape/, /aria-describedby/, /role="tooltip"/]) assert.match(help, contract);
});

test("pipeline preserves semantic workflow and configured-processing boundaries", () => {
  assert.match(pipelineSource, /<ol\b/);
  assert.match(pipelineSource, /copy\.stages\.map/);
  assert.match(pipelineSource, /copy\.distillNote/);
  assert.match(pipelineSource, /copy\.arcLabel/);
  assert.match(pipelineSource, /solution\.note/);
});

test("homepage FAQ keeps answers in native collapsed details", () => {
  assert.match(homeSource, /<details\b/);
  assert.match(homeSource, /<summary[\s\S]*?min-h-11/);
  assert.match(homeSource, /content\.faqs\.items\.map/);
  assert.match(homeSource, /faq\.q/);
  assert.match(homeSource, /faq\.a/);
  assert.match(homeSource, /max-w-4xl/);
});

test("homepage removes redundant horizontal separators while retaining intentional boundaries", () => {
  assert.doesNotMatch(homeSource, /<section\b[^>]*\b(?:border-b|border-t|border-y)\b/);
  assert.doesNotMatch(homeSource, /mt-16[^\n]*\bborder-t\b/);
  assert.doesNotMatch(homeSource, /<nav\b(?![^>]*fixed top-0)[^>]*\bborder-b\b/);
  assert.match(homeSource, /<nav className="fixed top-0[^\"]*\bborder-b\b/);
  assert.doesNotMatch(homeSource, /<details\b[^>]*\bborder-y\b/);
  assert.match(homeSource, /<details\b[^>]*\bborder-b\b/);

  assert.doesNotMatch(proofSource, /\bborder-t(?:-2)?\b/);
  assert.match(proofSource, /\bborder-l\b/);

  assert.doesNotMatch(painsSource, /<section\b[^>]*\b(?:border-b|border-t|border-y)\b/);
  assert.doesNotMatch(painsSource, /\bdivide-y\b[^\n]*\bborder-y\b/);
  assert.doesNotMatch(painsSource, /\bborder-t\b/);

  assert.doesNotMatch(pipelineSource, /<section\b[^>]*\b(?:border-b|border-t|border-y)\b/);
  assert.doesNotMatch(pipelineSource, /\bgrid\b[^\n]*\bborder-y\b/);
  assert.doesNotMatch(pipelineSource, /\bborder-t\b/);

  assert.doesNotMatch(downloadSource, /<section\b[^>]*\b(?:border-b|border-t|border-y)\b/);
});

test("hero icons link to detailed integrations without relabeling Obsidian as a client", () => {
  const hero = homeSource.slice(homeSource.indexOf("{/* Hero:"), homeSource.indexOf('id="demo"'));
  assert.match(hero, /data-hero-tools/);
  assert.match(hero, /worksWithClients\.filter\(\(\{ id \}\) => id !== "claude-desktop"\)\.map/);
  assert.match(hero, /ObsidianBrandIcon/);
  assert.match(hero, /href="#integrations"/);
  assert.match(homeSource, /id="integrations"/);
  assert.match(homeSource, /ObsidianBrandIcon[^\n]*\/>Obsidian<\/span>/);
  assert.doesNotMatch(homeSource, /id: "obsidian", label: "Obsidian", Icon: ObsidianBrandIcon/);
});

test("import brands share a general source guide and Antigravity keeps a clean monochrome label", () => {
  const sources = homeSource.slice(homeSource.indexOf("<div data-integration-sources>"), homeSource.indexOf("<div data-integration-clients>"));
  const clients = homeSource.slice(homeSource.indexOf("<div data-integration-clients>"), homeSource.indexOf("<PipelineSection"));
  assert.match(sources, /OpenAiBrandIcon[\s\S]*?>ChatGPT<\/span>/);
  assert.match(sources, /ClaudeBrandIcon[\s\S]*?>Claude<\/span>/);
  assert.doesNotMatch(clients, /ChatGPT|Claude\.ai|Gemini CLI|integrations\.remote/);
  assert.match(clients, /AntigravityBrandIcon/);
  assert.match(clients, /https:\/\/antigravity\.google\/docs\/mcp/);
  assert.doesNotMatch(clients, /integrations\.manualMcp/);
  assert.match(sources, /href="\/learn\/build-local-ai-knowledge-base-from-documents"/);
  assert.doesNotMatch(sources, /worksWithNote|href="\/learn\/wenlan-vs-obsidian/);
  const icons = fs.readFileSync(path.join(repoRoot, "src/components/icons.tsx"), "utf8");
  assert.match(icons, /bg-current \[mask-image:url\('\/images\/antigravity-icon-monochrome\.png'\)\]/);
});

test("homepage leads with the main-branch bars and keeps the full table in details", () => {
  assert.match(homeSource, /data-retrieval-bars/);
  assert.match(homeSource, /<details[^>]*data-retrieval-details/);
  assert.match(homeSource, /93\.6%/);
  assert.match(homeSource, /<table/);
  assert.match(homeSource, /<th scope="col"/);
  assert.match(homeSource, /dateTime="2026-06-24"/);
  assert.match(homeSource, /<ProductShowcase locale=\{locale\}/);
  const scenarios = fs.readFileSync(path.join(repoRoot, "src/components/home/hero-scenarios.tsx"), "utf8");
  assert.match(scenarios, /home-panel rounded-lg/);
});

test("recorded product evidence remains a real, hashed asset with a native enlarged view", () => {
  const media = JSON.parse(fs.readFileSync(path.join(repoRoot, "docs/homepage-media-provenance.json"), "utf8"));
  assert.equal(media.benchmarkDate.displayed, "2026-06-24");
  assert.equal(media.benchmarkDate.rerunPerformed, false);
  assert.equal(media.assets.length, 3);
  const scenarioMedia = JSON.parse(fs.readFileSync(path.join(repoRoot, "docs/scenario-media-provenance.json"), "utf8"));
  assert.deepEqual(
    fs.readdirSync(path.join(repoRoot, "public/images/product-evidence")).sort(),
    // The existing Learn fixture has its own provenance/locale contract in i18n-contract.test.mjs.
    [...media.assets.map((asset) => path.basename(asset.path)), ...scenarioMedia.assets.map((asset) => path.basename(asset.path)), "wenlan-space-review-fixture.png"].sort(),
    "Only inventoried homepage and scenario captures and the existing Learn fixture may be publicly served",
  );
  assert.deepEqual(media.showcaseOrder, ["knowledge-graph", "wiki-source-hover", "page-review"]);
  for (const asset of media.assets) {
    assert.ok(fs.statSync(path.join(repoRoot, asset.path)).size > 10000);
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);
    assert.equal(createHash("sha256").update(fs.readFileSync(path.join(repoRoot, asset.path))).digest("hex"), asset.sha256);
  }
  const product = fs.readFileSync(path.join(repoRoot, "src/components/home/product-showcase.tsx"), "utf8");
  assert.match(product, /<dialog/);
  assert.match(product, /showModal/);
  assert.match(product, /aria-controls/);
  assert.match(product, /非即時連線/);
  assert.match(product, /<figcaption[\s\S]*?copy\.descriptions\[i\][\s\S]*?copy\.notes\[i\][\s\S]*?copy\.expand/);
  assert.match(product, /wenlan-recorded-wiki-source-hover\.webp/);
  assert.match(product, /wenlan-recorded-page-review\.webp/);
  assert.ok(product.indexOf('src: "/images/product-evidence/wenlan-live-knowledge-graph') < product.indexOf('src: "/images/product-evidence/wenlan-recorded-wiki'));
  assert.match(product, /useState\(0\)/);
  assert.match(product, /images\.length - 1/);
  assert.match(product, /% images\.length/);
  assert.match(product, /max-w-full flex-wrap/);
  assert.match(product, /width: 2880, height: 1800/);
  assert.match(product, /wenlan-live-knowledge-graph-20260906\.webp/);
  assert.match(product, /width: 3456, height: 1950/);
  assert.equal(media.assets[1].sourceSha256, "587fdd4a755e64cbc1090d1e42e821c91b90056b52948b6f1f002e4f91f02a69");
  assert.deepEqual(media.assets[1].dimensions, [3456, 1950]);
});

test("product evidence offers readable zoom, native panning and the original image", () => {
  const product = fs.readFileSync(path.join(repoRoot, "src/components/home/product-showcase.tsx"), "utf8");
  assert.match(product, /changeZoom\(true\)/);
  assert.match(product, /width: enlarged \? 1600 : "auto"/);
  assert.match(product, /maxWidth: enlarged \? "none" : "100%"/);
  assert.match(product, /maxHeight: enlarged \? "none" : "68dvh"/);
  assert.match(product, /aria-pressed=\{enlarged === zoom\}/);
  assert.match(product, /role="region"[\s\S]*?tabIndex=\{0\}[\s\S]*?overflow-auto overscroll-contain/);
  assert.match(product, /viewport\.scrollTo\(\{/);
  assert.match(product, /1600 \* focus\.x - viewport\.clientWidth \/ 2/);
  assert.match(product, /<Image[\s\S]*?unoptimized/);
  assert.match(product, /href=\{images\[active\]\.src\} target="_blank" rel="noopener noreferrer"/);
  assert.match(product, /<form method="dialog"><button autoFocus/);
  assert.match(product, /onClose=\{\(\) => setEnlarged\(false\)\}/);
});

test("homepage finishing keeps short CJK units intact and tool names consistent", () => {
  const readable = fs.readFileSync(path.join(repoRoot, "src/components/home/readable-text.tsx"), "utf8");
  const bentoSource = fs.readFileSync(path.join(repoRoot, "src/components/home/bento.tsx"), "utf8");
  for (const phrase of ["存取", "還原", "結果", "结果", "有什麼不同", "有什么不同"]) assert.ok(readable.includes(phrase));
  assert.match(readable, /children\.split\(keptPhrases\)/);
  assert.match(readable, /className="whitespace-nowrap"/);
  assert.match(homeSource, /<HomeReadableText>\{integrations\.clientsBody\}/);
  assert.match(homeSource, /text-balance"><HomeReadableText>\{faq\.q\}/);
  assert.match(bentoSource, /<HomeReadableText>\{body\}/);
  assert.match(pipelineSource, /<HomeReadableText>\{copy\.distillNote\}/);
  assert.doesNotMatch(bentoSource, /Gemini CLI/);
  assert.equal((bentoSource.match(/"Antigravity"/g) ?? []).length, 3);
});

test("task proof stays compact without a rendered intro or step rail", () => {
  assert.doesNotMatch(proofSource, /\{task\.intro\}|\{task\.steps\.map/);
  assert.match(proofSource, /\{task\.authoredLabel\}/);
});

test("product screenshots remain uncropped and MCP content fits within each card", () => {
  const product = fs.readFileSync(path.join(repoRoot, "src/components/home/product-showcase.tsx"), "utf8");
  const bento = fs.readFileSync(path.join(repoRoot, "src/components/home/bento.tsx"), "utf8");
  assert.doesNotMatch(product, /group-hover:scale/);
  assert.match(bento, /data-mcp-flow/);
  assert.doesNotMatch(bento, /onPointerMove|radial-gradient/);
});

test("task proof keeps citation groups together on narrow widths", () => {
  assert.match(proofSource, /task\.answer\.split/);
  assert.match(proofSource, /whitespace-nowrap/);
  assert.match(proofSource, /\\\[\\d\+\\\]/);
});

test("task proof uses body-sized answers and gives supporting copy its own rows", () => {
  assert.doesNotMatch(proofSource, /mt-3 font-serif text-xl/);
  assert.match(proofSource, /<p className="mt-3 text-sm leading-relaxed text-\[var\(--o-text\)\]">/);
  assert.match(proofSource, /<code className="block[^\"]*text-sm/);
  assert.match(proofSource, /<span className="mt-1 block text-xs leading-relaxed/);
  assert.doesNotMatch(proofSource, /sm:flex-row sm:items-baseline sm:justify-between/);
  assert.match(proofSource, /mt-5 space-y-3 pt-4 text-sm/);
});
