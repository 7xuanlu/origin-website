import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import test from "node:test";
import ts from "typescript";
import { promisify } from "node:util";
import { selectedReleaseTag } from "./release-check.mjs";

const repoRoot = resolve(import.meta.dirname, "..");
const execFileAsync = promisify(execFile);
const publicScanIgnoredNames = new Set([
  ".claude",
  ".git",
  ".next",
  ".omo",
  ".codegraph",
  ".worktrees",
  "node_modules",
  "pnpm-lock.yaml",
]);

const englishRouteGroupAliases = new Map([
  ["src/app/layout.tsx", "src/app/root-document.tsx"],
  ["src/app/page.tsx", "src/app/(en)/page.tsx"],
  ["src/app/opengraph-image.tsx", "src/app/(en)/opengraph-image.tsx"],
  ["src/app/feed.xml/route.ts", "src/app/(en)/feed.xml/route.ts"],
  ["src/app/llms-full.txt/route.ts", "src/app/(en)/llms-full.txt/route.ts"],
]);

const publicCommandGuidancePaths = [
  "public/llms.txt",
  "src/i18n/content/en.ts",
  "src/i18n/content/zh-CN.ts",
  "src/i18n/content/zh-TW.ts",
  "src/app/docs/docs.ts",
  "src/app/learn/articles.ts",
  "src/app/learn/seo-articles.ts",
  "docs/seo-measurement.md",
];

function sourcePath(path) {
  if (englishRouteGroupAliases.has(path)) {
    return englishRouteGroupAliases.get(path);
  }
  if (path.startsWith("src/app/about/")) {
    return path.replace("src/app/about/", "src/app/(en)/about/");
  }
  if (path.startsWith("src/app/docs/")) {
    return path.replace("src/app/docs/", "src/app/(en)/docs/");
  }
  if (path.startsWith("src/app/learn/")) {
    return path.replace("src/app/learn/", "src/app/(en)/learn/");
  }

  return path;
}

async function readRepo(path) {
  return readFile(resolve(repoRoot, sourcePath(path)), "utf8");
}

async function currentWenlanRelease() {
  const wenlanRoot = process.env.WENLAN_REPO_ROOT
    ? resolve(process.env.WENLAN_REPO_ROOT)
    : resolve(repoRoot, "../wenlan");
  const taggedRelease = await currentWenlanTaggedRelease(wenlanRoot);
  return taggedRelease;
}

async function currentWenlanTaggedRelease(wenlanRoot) {
  try {
    const tag = selectedReleaseTag();

    const [{ stdout: versionStdout }, { stdout: changelog }] = await Promise.all([
      execFileAsync("git", ["-C", wenlanRoot, "show", `${tag}:version.txt`]),
      execFileAsync("git", ["-C", wenlanRoot, "show", `${tag}:CHANGELOG.md`]),
    ]);
    assert.equal(`v${versionStdout.trim()}`, tag, "Selected tag and source version differ");

    return parseRelease({
      version: versionStdout.trim(),
      changelog,
      changelogPath: `${wenlanRoot}:${tag}:CHANGELOG.md`,
    });
  } catch (error) {
    throw new Error(`Cannot validate selected release ${selectedReleaseTag()} in ${wenlanRoot}; fetch that tag before running source contracts`, { cause: error });
  }
}

function parseRelease({ version, changelog, changelogPath }) {
  const releasePattern = new RegExp(
    `^## \\[${escapeRegExp(version)}\\].*\\((\\d{4}-\\d{2}-\\d{2})\\)`,
    "m",
  );
  const releaseMatch = changelog.match(releasePattern);
  const releaseHeading = releaseMatch?.[0];
  const releaseDate = releaseMatch?.[1];

  assert.ok(
    releaseHeading,
    `Could not find ${version} release heading in ${changelogPath}`,
  );
  assert.ok(releaseDate, `Could not parse ${version} release date in ${changelogPath}`);

  return {
    version,
    date: releaseDate,
  };
}

async function* walkTextFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (shouldSkipPublicScanEntry(entry.name)) {
      continue;
    }

    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkTextFiles(fullPath);
      continue;
    }

    if (/\.(tsx?|mjs|md|txt|json|webmanifest|svg)$/.test(entry.name)) {
      yield fullPath;
    }
  }
}

function shouldSkipPublicScanEntry(name) {
  return publicScanIgnoredNames.has(name);
}

async function collectMatches(pattern) {
  const matches = [];
  for await (const file of walkTextFiles(repoRoot)) {
    const rel = relative(repoRoot, file);
    if (rel === "scripts/brand-contract.test.mjs") continue;
    if (
      rel === "PLAN.md" ||
      rel === "EXPERIMENTS.md" ||
      rel.startsWith("docs/seo-audits/")
    ) {
      continue;
    }
    const text = await readFile(file, "utf8");
    for (const match of text.matchAll(pattern)) {
      matches.push(`${rel}:${lineForOffset(text, match.index)}:${match[0]}`);
    }
  }
  return matches;
}

function lineForOffset(text, offset) {
  return text.slice(0, offset).split("\n").length;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function collectTypescriptStringValues(path) {
  const sourceText = await readRepo(path);
  const sourceFile = ts.createSourceFile(
    path,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const values = [];

  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      values.push({
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
        value: node.text,
      });
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return values;
}

async function readPublicCommandGuidance() {
  return Promise.all(
    publicCommandGuidancePaths.map(async (path) => [path, await readRepo(path)]),
  );
}

async function renderedGuidanceFor(path, source) {
  return path.endsWith(".ts")
    ? (await collectTypescriptStringValues(path)).map(({ value }) => value).join("\n")
    : source;
}

test("package metadata uses the wenlan-site identity", async () => {
  const packageJson = JSON.parse(await readRepo("package.json"));

  assert.equal(packageJson.name, "wenlan-site");
  assert.equal(packageJson.description, "Public website and SEO/GEO surface for Wenlan, an LLM wiki for AI work.");
  assert.equal(packageJson.repository.url, "git+https://github.com/7xuanlu/wenlan-site.git");
  assert.equal(packageJson.bugs.url, "https://github.com/7xuanlu/wenlan-site/issues");
  assert.equal(packageJson.homepage, "https://wenlan.app");
  assert.match(packageJson.scripts["seo:weekly:sample"], /\/tmp\/wenlan-weekly-seo-sample\.md$/);
});

test("knowledge graph docs answer the AI-agent knowledge-base job without replacing sources", async () => {
  const docs = await readRepo("src/app/docs/docs.ts");
  const knowledgeGraph = docs.match(
    /slug: "knowledge-graph",[\s\S]*?(?=\n  \{\n    slug: "source-backed-pages")/,
  )?.[0];

  assert.ok(knowledgeGraph, "expected the knowledge-graph docs record");
  assert.match(knowledgeGraph, /AI Agent Knowledge Graph/);
  assert.match(knowledgeGraph, /source-backed AI knowledge base/i);
  assert.match(knowledgeGraph, /Quick answer:/);
  assert.match(knowledgeGraph, /entities, relations, and observations/i);
  assert.match(knowledgeGraph, /source memories and maintained pages/i);
  assert.match(knowledgeGraph, /supporting evidence/i);
  assert.match(knowledgeGraph, /publishedAt:\s*"2026-07-09"/);
  assert.match(knowledgeGraph, /updatedAt:\s*"2026-08-13"/);
  assert.doesNotMatch(knowledgeGraph, /graph context (?:is|becomes) (?:the )?authority/i);
});

test("root document includes Vercel Web Analytics only on Vercel", async () => {
  const packageJson = JSON.parse(await readRepo("package.json"));
  const rootDocument = await readRepo("src/app/root-document.tsx");

  assert.ok(packageJson.dependencies["@vercel/analytics"]);
  assert.match(rootDocument, /import\s+\{\s*Analytics\s*\}\s+from\s+"@vercel\/analytics\/next"/);
  assert.match(rootDocument, /const vercelAnalyticsEnabled = process\.env\.VERCEL === "1"/);
  assert.match(rootDocument, /vercelAnalyticsEnabled\s*\?\s*<Analytics\s*\/>\s*:\s*null/);
});

test("primary acquisition links emit bounded provider-neutral Umami CTA events", async () => {
  const trackedLink = await readRepo("src/components/tracked-link.tsx");
  const rootDocument = await readRepo("src/app/root-document.tsx");
  const home = await readRepo("src/app/_pages/home.tsx");
  const learnIndex = await readRepo("src/app/learn/page.tsx");
  const learnArticle = await readRepo("src/app/learn/[slug]/page.tsx");
  const docsArticle = await readRepo("src/app/(en)/docs/[slug]/page.tsx");
  const getStarted = await readRepo("src/app/_pages/get-started.tsx");
  const docs = await readRepo("src/app/docs/docs.ts");

  assert.doesNotMatch(trackedLink, /from\s+"@vercel\/analytics"/);
  assert.match(trackedLink, /"get_started_click"/);
  assert.match(trackedLink, /"github_outbound"/);
  assert.match(trackedLink, /"learn_article_click"/);
  assert.match(trackedLink, /"setup_path_click"/);
  assert.match(trackedLink, /window\.umami\?\.track\(eventName,\s*\{/);
  assert.match(trackedLink, /destination_category:/);
  assert.doesNotMatch(
    trackedLink,
    /track\([^)]*\{[^}]*(?:query|email|url|href|name|account_id)\s*:/s,
  );
  assert.match(rootDocument, /data-domains="wenlan\.app"/);
  assert.match(rootDocument, /data-exclude-search="true"/);
  assert.match(rootDocument, /data-do-not-track="true"/);
  assert.match(home, /TrackedLink/);
  assert.match(learnIndex, /TrackedLink/);
  assert.match(learnArticle, /TrackedLink/);
  assert.match(docsArticle, /TrackedLink/);
  assert.match(docsArticle, /href="https:\/\/github\.com\/7xuanlu\/wenlan"/);
  assert.match(docsArticle, /placement="docs-article"/);
  assert.match(docsArticle, /eventName="github_outbound"/);
  assert.match(docsArticle, /locale="en"/);
  assert.match(docsArticle, /context="setup"/);
  assert.match(docsArticle, /target="_blank"/);
  assert.match(docsArticle, /rel="noopener noreferrer"/);
  assert.match(docsArticle, /Open GitHub/);
  assert.match(getStarted, /TrackedLocalizedLink/);
  assert.match(docs, /heading: "Public website analytics"/);
  assert.match(docs, /Vercel Web Analytics/);
  assert.match(docs, /Umami/);
  assert.match(docs, /Do Not Track/);
});

test("all evidence-backed no-click Docs targets have refreshed SERP copy and quick answers", async () => {
  const docs = await readRepo("src/app/docs/docs.ts");
  const englishContent = await readRepo("src/i18n/content/en.ts");

  for (const slug of [
    "data-and-privacy",
    "cli-and-service",
    "security",
    "agent-profiles",
    "memory-types",
  ]) {
    assert.match(
      docs,
      new RegExp(`slug: "${slug}"[\\s\\S]*summary: \\[[\\s\\S]*"Quick answer:`),
      slug,
    );
  }

  assert.match(
    englishContent,
    /title: "Install Wenlan for Claude Code, Codex, ChatGPT, and MCP"/,
  );
  assert.match(
    englishContent,
    /Choose one client path, connect it to the same local daemon, then verify a capture and recall round trip\./,
  );
});

test("agent guidance tracks the wenlan.app canonical launch property", async () => {
  const agents = await readRepo("AGENTS.md");
  const claude = await readRepo("CLAUDE.md");

  assert.match(agents, /canonical public site is https:\/\/wenlan\.app/);
  assert.match(agents, /useorigin\.app.*legacy redirect bridge/);
  assert.doesNotMatch(agents, /current deployed public property is still https:\/\/useorigin\.app/);
  assert.match(claude, /Single-page marketing site for \[Wenlan\]\(https:\/\/wenlan\.app\)/);
});

test("root metadata describes Wenlan on the current release surface", async () => {
  const { version } = await currentWenlanRelease();
  const metadata = await readRepo("src/i18n/metadata.ts");
  const englishContent = await readRepo("src/i18n/content/en.ts");
  const rootDocument = await readRepo("src/app/root-document.tsx");
  const structuredData = await readRepo("src/app/structured-data.ts");
  const releases = await readRepo("src/lib/releases.ts");

  assert.match(englishContent, /title:\s*"Wenlan \|/);
  assert.match(metadata, /export function buildRootMetadata/);
  assert.match(metadata, /locale: LOCALE_CONFIG\[locale\]\.openGraphLocale/);
  assert.match(rootDocument, /softwareApplicationSchema\(locale\)/);
  assert.match(structuredData, /name: "Wenlan"/);
  assert.match(structuredData, /softwareVersion: WENLAN_RELEASE\.version/);
  assert.match(structuredData, /downloadUrl: WENLAN_RELEASE\.releaseUrl/);
  assert.match(releases, new RegExp(`version: "${escapeRegExp(version)}"`));
  assert.match(structuredData, /installUrl: "https:\/\/github\.com\/7xuanlu\/wenlan#quickstart"/);
  assert.match(structuredData, /codeRepository: "https:\/\/github\.com\/7xuanlu\/wenlan"/);
});

test("public machine-readable surfaces use Wenlan names and packages", async () => {
  const manifest = JSON.parse(await readRepo("public/manifest.webmanifest"));
  const llms = await readRepo("public/llms.txt");
  const llmsFull = await readRepo("src/app/llms-full.txt/route.ts");

  assert.equal(manifest.name, "Wenlan");
  assert.equal(manifest.short_name, "Wenlan");
  assert.match(llms, /^# Wenlan/m);
  assert.match(llms, /LLM wiki for AI work/);
  assert.match(llms, /github\.com\/7xuanlu\/wenlan/);
  assert.match(llms, /wenlan-mcp/);
  assert.match(llms, /wenlan-types/);
  assert.match(llmsFull, /LLM wiki for AI work/);
  assert.doesNotMatch(llmsFull, /Wenlan is local-first memory for AI work/);
});

test("LLM wiki acquisition surfaces route demand into one canonical hub", async () => {
  const hub = await readRepo("src/app/learn/articles.ts");
  const support = await readRepo("src/app/learn/seo-articles.ts");
  const home = await readRepo("src/i18n/content/en.ts");
  const learnIndex = await readRepo("src/app/learn/page.tsx");
  const structuredData = await readRepo("src/app/structured-data.ts");
  const seoMeasurement = await readRepo("docs/seo-measurement.md");
  const llms = await readRepo("public/llms.txt");
  const llmsFull = await readRepo("src/app/llms-full.txt/route.ts");
  const articleStart = hub.indexOf('slug: "distilled-wiki-pages-ai-memory"');
  const articleEnd = hub.indexOf("\n  {\n    slug:", articleStart);
  const article = hub.slice(articleStart, articleEnd);
  const supportStart = support.indexOf('slug: "source-backed-wiki-pages-ai-work"');
  const supportEnd = support.indexOf("\n  {\n    slug:", supportStart);
  const supportArticle = support.slice(supportStart, supportEnd);
  const obsidianStart = support.indexOf('slug: "wenlan-vs-obsidian-ai-memory"');
  const obsidianEnd = support.indexOf("\n  {\n    slug:", obsidianStart);
  const obsidianArticle = support.slice(obsidianStart, obsidianEnd);
  const mcpStart = hub.indexOf('slug: "mcp-memory-server"');
  const mcpEnd = hub.indexOf("\n  {\n    slug:", mcpStart);
  const mcpArticle = hub.slice(mcpStart, mcpEnd);
  const claudeStart = hub.indexOf('slug: "claude-code-memory"');
  const claudeEnd = hub.indexOf("\n  {\n    slug:", claudeStart);
  const claudeArticle = hub.slice(claudeStart, claudeEnd);
  const knowledgeBaseStart = hub.indexOf(
    'slug: "ai-work-memory-vs-knowledge-base"',
  );
  const knowledgeBaseEnd = hub.indexOf("\n  {\n    slug:", knowledgeBaseStart);
  const knowledgeBaseArticle = hub.slice(knowledgeBaseStart, knowledgeBaseEnd);
  const memoryTypesStart = hub.indexOf('slug: "ai-agent-memory-types"');
  const memoryTypesEnd = hub.indexOf("\n  {\n    slug:", memoryTypesStart);
  const memoryTypesArticle = hub.slice(memoryTypesStart, memoryTypesEnd);

  assert.notEqual(articleStart, -1);
  assert.notEqual(supportStart, -1);
  assert.notEqual(obsidianStart, -1);
  assert.notEqual(mcpStart, -1);
  assert.notEqual(claudeStart, -1);
  assert.notEqual(knowledgeBaseStart, -1);
  assert.notEqual(memoryTypesStart, -1);
  assert.match(
    article,
    /title:\s*"Karpathy LLM Wiki: Build a Source-Backed AI Knowledge Base"/,
  );
  assert.match(
    article,
    /metaTitle:\s*"Karpathy LLM Wiki & AI Knowledge Base \| Wenlan"/,
  );
  assert.match(article, /publishedAt:\s*"2026-06-24"/);
  assert.match(article, /updatedAt:\s*"2026-09-05"/);
  assert.match(article, /heading:\s*"The Karpathy LLM Wiki pattern"/);
  assert.match(article, /does not imply that Karpathy endorses Wenlan/);
  assert.match(article, /heading:\s*"The LLM-wiki workflow in Wenlan"/);
  assert.match(article, /id:\s*"the-five-minute-llm-wiki-protocol"/);
  assert.match(article, /\/brief <topic>/);
  assert.match(article, /\/recall <question>/);
  assert.match(article, /\/capture <decision \+ why>/);
  assert.match(article, /\/handoff/);
  assert.match(article, /\/distill <topic>/);
  assert.match(article, /\/pages <topic>/);
  assert.match(article, /heading:\s*"How to verify the loop"/);
  assert.match(article, /source IDs or citations/);
  assert.match(article, /heading:\s*"A minimum LLM-wiki starter schema"/);
  assert.match(article, /Purpose and scope/);
  assert.match(article, /Immutable source boundary/);
  assert.match(article, /Naming and linking rules/);
  assert.match(article, /Ingest, query, lint, and maintenance log/);
  assert.match(article, /CLAUDE\.md or AGENTS\.md/);
  assert.match(article, /load on demand/);
  assert.match(article, /heading:\s*"A small acceptance test before real use"/);
  assert.match(article, /Ingest one harmless source/);
  assert.match(article, /Answer one question and cite the source/);
  assert.match(article, /Change the source/);
  assert.match(article, /stale or review/);
  assert.match(article, /Wenlan does not require a user-authored Page schema/);
  assert.match(article, /heading:\s*"Failure modes and repairs"/);
  assert.match(article, /context bloat/i);
  assert.match(article, /stale links and contradictions/i);
  assert.match(article, /human-authored pages/i);
  assert.match(
    article,
    /heading:\s*"LLM wiki vs RAG, Obsidian, and agent memory"/,
  );
  assert.match(article, /RAG retrieves source chunks/i);
  assert.match(article, /Obsidian is a human-owned vault/i);
  assert.match(article, /agent memory preserves reusable context/i);
  assert.match(article, /source document[\s\S]*atomic memory[\s\S]*maintained page/);
  assert.match(article, /does not replace codebase search/);
  assert.match(article, /current source code/);
  assert.match(article, /href:\s*"#worked-example"/);
  assert.match(article, /href:\s*"\/docs\/daily-workflow"/);
  assert.match(article, /href:\s*"\/docs\/review-and-trust"/);
  assert.match(article, /https:\/\/github\.com\/7xuanlu\/wenlan#what-does-wenlan-build/);
  assert.match(article, /https:\/\/github\.com\/7xuanlu\/wenlan#daily-workflow/);
  assert.match(article, /https:\/\/gist\.github\.com\/karpathy\/442a6bf555914893e9891c11519de94f/);
  assert.match(
    article,
    /relatedSlugs:\s*\[\s*"source-backed-wiki-pages-ai-work",\s*"verify-ai-knowledge-base-citations",\s*"build-course-wiki-from-lecture-notes",\s*"ai-work-memory-vs-knowledge-base",\s*"wenlan-vs-obsidian-ai-memory",\s*"ai-memory-provenance",\s*"local-git-history-ai-memory",?\s*\]/,
  );
  assert.match(
    supportArticle,
    /title:\s*"Build a Source-Backed AI Knowledge Base for Agents"/,
  );
  assert.match(
    supportArticle,
    /metaTitle:\s*"Build a Source-Backed AI Knowledge Base \| Wenlan"/,
  );
  assert.match(
    supportArticle,
    /metaDescription:\s*\n\s*"Build a source-backed AI knowledge base with trusted sources, atomic knowledge, maintained LLM-wiki pages, citations, review, and refresh\.",/,
  );
  assert.match(supportArticle, /publishedAt:\s*"2026-06-06"/);
  assert.match(supportArticle, /updatedAt:\s*"2026-08-08"/);
  assert.match(
    supportArticle,
    /quickAnswer:\s*\n\s*"To build a source-backed AI knowledge base, keep trusted sources, atomic knowledge, and maintained LLM-wiki pages separate/,
  );
  assert.match(supportArticle, /actionHeading:\s*"Build the smallest maintainable loop"/);
  assert.match(supportArticle, /\/capture <fact \+ source \+ why>/);
  assert.match(supportArticle, /\/distill <topic>/);
  assert.match(supportArticle, /\/pages <topic>/);
  assert.match(supportArticle, /\/lint/);
  assert.match(supportArticle, /\/curate/);
  assert.match(supportArticle, /https:\/\/github\.com\/7xuanlu\/wenlan#what-does-wenlan-build/);
  assert.match(supportArticle, /https:\/\/github\.com\/7xuanlu\/wenlan#daily-workflow/);
  assert.match(
    supportArticle,
    /relatedSlugs:\s*\["distilled-wiki-pages-ai-memory"/,
  );
  assert.match(
    obsidianArticle,
    /relatedSlugs:\s*\[\s*"distilled-wiki-pages-ai-memory",\s*"markdown-local-index-ai-memory",\s*"source-backed-wiki-pages-ai-work",\s*"ai-work-memory-vs-knowledge-base",?\s*\]/,
  );
  assert.match(
    obsidianArticle,
    /quickAnswerLink:\s*\{[\s\S]*href:\s*"\/learn\/distilled-wiki-pages-ai-memory"/,
  );
  for (const inboundArticle of [
    mcpArticle,
    claudeArticle,
    knowledgeBaseArticle,
    memoryTypesArticle,
  ]) {
    assert.match(
      inboundArticle,
      /href:\s*"\/learn\/distilled-wiki-pages-ai-memory"/,
    );
  }
  assert.doesNotMatch(supportArticle, /LLM Wiki for AI Agents/);
  assert.match(home, /id:\s*"llm-wiki"/);
  assert.match(home, /href:\s*"\/learn\/distilled-wiki-pages-ai-memory"/);
  assert.match(learnIndex, /LLM wiki and AI knowledge base/);
  assert.match(structuredData, /LLM wiki for AI work/);
  assert.match(llms, /LLM wiki for AI work/);
  assert.match(llmsFull, /LLM wiki for AI work/);
  assert.match(seoMeasurement, /What is an LLM wiki for AI work\?/);
  assert.match(seoMeasurement, /What is the best LLM wiki for AI agents\?/);
  assert.match(seoMeasurement, /AI 工作的 LLM wiki 是什麼/);
  assert.match(seoMeasurement, /适合 AI 工作的 LLM wiki 是什么/);
});

test("AI work memory comparison answers the knowledge-base role question directly", async () => {
  const articles = await readRepo("src/app/learn/articles.ts");
  const supportingArticles = await readRepo("src/app/learn/seo-articles.ts");
  const start = articles.indexOf('slug: "ai-work-memory-vs-knowledge-base"');
  const end = articles.indexOf("\n  {\n    slug:", start);
  const article = articles.slice(start, end);

  const relatedSources = [
    [articles, "markdown-local-index-ai-memory"],
    [supportingArticles, "ai-memory-provenance"],
    [supportingArticles, "project-scope-ai-memory"],
  ];

  assert.notEqual(start, -1);
  assert.match(
    article,
    /title: "AI Work Memory vs Knowledge Base: What’s the Difference\?"/,
  );
  assert.match(
    article,
    /metaDescription:\s*"Compare AI work memory and AI knowledge bases: what each stores, when agents use it, and why durable AI work needs both atomic memory and maintained pages\."/,
  );
  assert.match(article, /publishedAt: "2026-05-27"/);
  assert.match(article, /updatedAt: "2026-07-24"/);
  assert.match(article, /heading: "Short answer"/);
  assert.match(article, /competitorName: "Knowledge base"/);
  assert.match(article, /dimension: "Unit of knowledge"/);
  assert.match(article, /label: "Wenlan source, memory, and page model"/);

  for (const [sourceFile, slug] of relatedSources) {
    const sourceStart = sourceFile.indexOf(`slug: "${slug}"`);
    const sourceEnd = sourceFile.indexOf("\n  {\n    slug:", sourceStart);
    const source = sourceFile.slice(sourceStart, sourceEnd);

    assert.notEqual(sourceStart, -1);
    assert.match(
      source,
      /relatedSlugs:\s*\[[^\]]*"ai-work-memory-vs-knowledge-base"[^\]]*\]/,
    );
  }

  const page = await readRepo("src/app/learn/[slug]/page.tsx");
  assert.match(page, /Practical dimensions\./);
  assert.doesNotMatch(page, /Quantified dimensions\./);
});

test("AI coding agent context-loss page separates native session recovery from durable memory", async () => {
  const articles = await readRepo("src/app/learn/seo-articles.ts");
  const marker = 'slug: "ai-coding-agent-loses-context"';
  const start = articles.indexOf(marker);
  const end = articles.indexOf('\n  {\n    slug: "', start + marker.length);
  const article = articles.slice(start, end);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  assert.match(articles, /publishedAt: spec\.publishedAt/);
  assert.match(article, /title: "Why AI Coding Agents Lose Context Between Sessions"/);
  assert.match(article, /publishedAt: "2026-06-06"/);
  assert.match(article, /updatedAt: "2026-07-25"/);
  assert.match(
    article,
    /metaTitle: "AI Coding Agent Context Loss: Causes and Fixes \| Wenlan"/,
  );
  assert.match(article, /resume the native session/);
  assert.match(article, /project instructions/);
  assert.match(article, /durable decisions/);
  assert.match(article, /shared memory boundary/);
  assert.ok(
    article.includes(
      'code: "/brief\\n/recall <specific decision or gotcha>\\n/capture <one durable fact and why it matters>\\n/handoff"',
    ),
  );
  assert.match(
    article,
    /href: "https:\/\/code\.claude\.com\/docs\/en\/memory"/,
  );
  assert.match(
    article,
    /href: "https:\/\/code\.claude\.com\/docs\/en\/sessions"/,
  );
  assert.match(article, /"ai-agent-memory-types"/);
});

test("AI agent memory types page separates cognitive roles from Wenlan capture metadata", async () => {
  const articles = await readRepo("src/app/learn/articles.ts");
  const marker = 'slug: "ai-agent-memory-types"';
  const start = articles.indexOf(marker);
  const end = articles.indexOf('\n  {\n    slug: "', start + marker.length);
  const article = articles.slice(start, end);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  assert.match(
    article,
    /title:\s*\n\s*"AI Agent Memory Types: Working, Episodic, Semantic, and Procedural"/,
  );
  assert.match(article, /publishedAt: "2026-07-25"/);
  assert.match(article, /updatedAt: "2026-07-25"/);
  assert.match(article, /Working memory/);
  assert.match(article, /Episodic memory/);
  assert.match(article, /Semantic memory/);
  assert.match(article, /Procedural memory/);
  assert.match(article, /current context window or session state/);
  assert.match(article, /timestamped session history and handoffs/);
  assert.match(article, /durable facts and maintained knowledge/);
  assert.match(article, /versioned prompts, rules, skills, or code/);
  assert.match(
    article,
    /identity, preference, decision, lesson, gotcha, and fact are capture metadata/,
  );
  assert.match(article, /not four required database tables/);
  assert.match(
    article,
    /href: "https:\/\/arxiv\.org\/abs\/2309\.02427"/,
  );
  assert.match(
    article,
    /href: "https:\/\/docs\.langchain\.com\/oss\/python\/concepts\/memory"/,
  );
  assert.match(
    article,
    /href: "https:\/\/docs\.letta\.com\/guides\/core-concepts\/memory\/context-hierarchy"/,
  );
  assert.match(
    article,
    /href: "https:\/\/wenlan\.app\/docs\/memory-types"/,
  );
});

test("AI agent memory Trends evidence preserves the raw request-relative series", async () => {
  const csv = await readRepo(
    "docs/seo-audits/data/2026-07-25-ai-agent-memory-trends.csv",
  );
  const metadata = JSON.parse(
    await readRepo(
      "docs/seo-audits/data/2026-07-25-ai-agent-memory-trends.metadata.json",
    ),
  );
  const rows = csv
    .trim()
    .split(/\r?\n/)
    .slice(3)
    .map((line) => {
      const [week, aiAgentMemory, agentMemory] = line.split(",");
      return {
        week,
        aiAgentMemory: Number(aiAgentMemory),
        agentMemory: Number(agentMemory),
      };
    });
  const average = (values) =>
    values.reduce((sum, value) => sum + value, 0) / values.length;

  assert.equal(metadata.captured_at, "2026-07-25T01:42:25Z");
  assert.deepEqual(metadata.queries, ["AI agent memory", "agent memory"]);
  assert.equal(metadata.geography, "Worldwide");
  assert.equal(metadata.period, "Past 12 months");
  assert.equal(metadata.unit, "Google request-relative 0-100 index");
  assert.equal(metadata.row_count, 53);
  assert.equal(rows.length, 53);
  assert.equal(rows[0].week, "2025-07-20");
  assert.equal(rows.at(-1).week, "2026-07-19");
  assert.equal(
    createHash("sha256").update(csv).digest("hex"),
    metadata.download_sha256,
  );
  assert.equal(average(rows.slice(0, 13).map((row) => row.aiAgentMemory)).toFixed(1), "3.7");
  assert.equal(average(rows.slice(-13).map((row) => row.aiAgentMemory)).toFixed(1), "26.9");
  assert.equal(average(rows.slice(0, 13).map((row) => row.agentMemory)).toFixed(1), "11.7");
  assert.equal(average(rows.slice(-13).map((row) => row.agentMemory)).toFixed(1), "73.1");
});

test("Basic Memory comparison reflects current local, cloud, and team boundaries", async () => {
  const articles = await readRepo("src/app/learn/articles.ts");
  const marker = 'slug: "wenlan-vs-basic-memory"';
  const start = articles.indexOf(marker);
  const end = articles.indexOf('\n  {\n    slug: "', start + marker.length);
  const article = articles.slice(start, end);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  assert.match(
    article,
    /title: "Wenlan vs Basic Memory: Source-Backed AI Work vs Shared Markdown Knowledge"/,
  );
  assert.match(article, /publishedAt: "2026-05-14"/);
  assert.match(article, /updatedAt: "2026-07-25"/);
  assert.match(article, /Basic Memory v0\.22\.1/);
  assert.match(article, /local or hosted/);
  assert.match(article, /Team workspaces/);
  assert.match(article, /semantic search/);
  assert.match(article, /Agent Skills/);
  assert.match(article, /source-backed Pages/);
  assert.match(article, /AGPL-3\.0/);
  assert.match(
    article,
    /href: "https:\/\/github\.com\/basicmachines-co\/basic-memory\/releases\/tag\/v0\.22\.1"/,
  );
  assert.match(
    article,
    /href: "https:\/\/github\.com\/basicmachines-co\/basic-memory\/tree\/5d444f0974476645f904c1446998c0a938a6e7f7"/,
  );
  assert.match(
    article,
    /href: "https:\/\/github\.com\/basicmachines-co\/docs\.basicmemory\.com\/tree\/1c670035987b21f0a93d4e45ea1eed1487775f74"/,
  );
  assert.match(article, /href: "https:\/\/docs\.basicmemory\.com\/cloud\/cloud-guide"/);
  assert.match(article, /href: "https:\/\/docs\.basicmemory\.com\/teams\/about"/);
  assert.match(
    article,
    /href: "https:\/\/docs\.basicmemory\.com\/reference\/ai-assistant-guide"/,
  );
  assert.match(article, /does not turn unmatched benchmarks into a winner/);
  assert.doesNotMatch(article, /LME_Oracle|LME_S/);
  assert.doesNotMatch(article, /Markdown-only search degrades/);
  assert.doesNotMatch(article, /File mtime; bring-your-own git/);
  assert.doesNotMatch(article, /It is not a work-loop optimization/);
  assert.doesNotMatch(article, /2026-07-02 source check/);
});

test("claude-mem comparison reflects current automatic and cross-agent boundaries", async () => {
  const articles = await readRepo("src/app/learn/articles.ts");
  const marker = 'slug: "wenlan-vs-claude-mem"';
  const start = articles.indexOf(marker);
  const end = articles.indexOf('\n  {\n    slug: "', start + marker.length);
  const article = articles.slice(start, end);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  assert.match(
    article,
    /title: "Wenlan vs claude-mem: Explicit vs Automatic Agent Memory"/,
  );
  assert.match(
    article,
    /metaTitle: "Wenlan vs claude-mem: Explicit vs Automatic AI Memory"/,
  );
  assert.match(article, /claude-mem v13\.12\.4/);
  assert.match(article, /Codex hooks/);
  assert.match(article, /progressive disclosure/);
  assert.match(article, /Both projects use Apache-2\.0/);
  assert.match(
    article,
    /href: "https:\/\/github\.com\/thedotmack\/claude-mem\/releases\/tag\/v13\.12\.4"/,
  );
  assert.match(
    article,
    /href: "https:\/\/github\.com\/thedotmack\/claude-mem\/blob\/132b46343e60ecf4057c427736c57b08f7615dfe\/docs\/public\/architecture\/overview\.mdx"/,
  );
  assert.match(
    article,
    /Claude Code, Cursor, Windsurf, OpenCode, Codex CLI, Antigravity CLI, and OpenClaw/,
  );
  assert.match(
    article,
    /href: "https:\/\/github\.com\/thedotmack\/claude-mem\/blob\/132b46343e60ecf4057c427736c57b08f7615dfe\/docs\/public\/installation\.mdx"/,
  );
  assert.doesNotMatch(article, /Single-tool by design/);
  assert.doesNotMatch(article, /three disjoint stores/);
  assert.doesNotMatch(article, /MIT \(per claude-mem npm package\)/);
  assert.doesNotMatch(article, /POSTs to Wenlan's `\/api\/memory\/store`/);
});

test("SuperLocalMemory comparison reflects the current control-plane boundary and benchmark scopes", async () => {
  const articles = await readRepo("src/app/learn/articles.ts");
  const marker = 'slug: "wenlan-vs-superlocal-memory"';
  const start = articles.indexOf(marker);
  const end = articles.indexOf('\n  {\n    slug: "', start + marker.length);
  const article = articles.slice(start, end);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  assert.match(
    article,
    /title: "Wenlan vs SuperLocalMemory v3\.8\.3: Local AI Memory Compared"/,
  );
  assert.match(
    article,
    /metaTitle: "Wenlan vs SuperLocalMemory v3\.8\.3 \| Local AI Memory"/,
  );
  assert.match(article, /local-first agent memory control plane/);
  assert.match(article, /temporal retrieval/);
  assert.match(article, /personal, shared, and global/);
  assert.match(article, /role-based access/);
  assert.match(article, /bounded loops/);
  assert.match(article, /Mode A Raw.*60\.4%/);
  assert.match(article, /Mode A Retrieval.*74\.8%/);
  assert.match(article, /GPT-4\.1-mini answer synthesis/);
  assert.match(
    article,
    /Mode C reports 87\.7% on one conversation and 81 scored questions with cloud embeddings, answer generation, and judging/,
  );
  assert.match(article, /AGPL v3 family licensing/);
  assert.match(article, /a separate commercial-license file is published/);
  assert.match(
    article,
    /href: "https:\/\/github\.com\/qualixar\/superlocalmemory\/tree\/v3\.8\.3"/,
  );
  assert.match(
    article,
    /href: "https:\/\/github\.com\/qualixar\/superlocalmemory\/blob\/893e6d7d521cef6013d35f0ea468eca3005916de\/README\.md"/,
  );
  assert.doesNotMatch(article, /zero-LLM \(pure-math\) retrieval configuration/);
  assert.doesNotMatch(article, /2026-06-24 source check/);
  assert.doesNotMatch(article, /No public commitment to per-write git history/);
});

test("postbuild URL discovery reads moved English route-group source files", async () => {
  const indexNow = await readRepo("scripts/indexnow-ping.mjs");

  assert.match(indexNow, /src\/app\/\(en\)\/learn\/articles\.ts/);
  assert.match(indexNow, /src\/app\/\(en\)\/docs\/docs\.ts/);
  assert.doesNotMatch(indexNow, /src\/app\/learn\/articles\.ts/);
  assert.doesNotMatch(indexNow, /src\/app\/docs\/docs\.ts/);
});

test("public eval surfaces publish the latest LME oracle and LME-S framing", async () => {
  const fullMetricSurfaces = [
    "public/llms.txt",
    "src/app/llms-full.txt/route.ts",
    "src/app/structured-data.ts",
    "src/i18n/content/en.ts",
    "src/app/docs/docs.ts",
    "src/app/learn/articles.ts",
    "docs/seo-measurement.md",
  ];

  for (const path of fullMetricSurfaces) {
    const source = await readRepo(path);
    assert.match(source, /LME_Oracle/, path);
    assert.match(source, /93\.6%/, path);
    assert.match(source, /0\.857/, path);
    assert.match(source, /0\.883/, path);
    assert.match(source, /LME_S/, path);
    assert.match(source, /(?:N=90|90-question)/, path);
    assert.match(source, /87\.7%/, path);
    assert.match(source, /0\.815/, path);
    assert.match(source, /0\.822/, path);
    assert.doesNotMatch(source, /Retrieval aggregate pending/, path);
  }

  const homepageContent = await readRepo("src/i18n/content/en.ts");
  assert.match(homepageContent, /Full replay/, "src/i18n/content/en.ts");
  assert.match(homepageContent, /No retrieval/, "src/i18n/content/en.ts");
  assert.match(homepageContent, /168 tokens \/ query/, "src/i18n/content/en.ts");

  const headlineMetricSurfaces = [
    "src/app/opengraph-image.tsx",
  ];

  for (const path of headlineMetricSurfaces) {
    const source = await readRepo(path);
    assert.match(source, /LME_Oracle/, path);
    assert.match(source, /93\.6/, path);
    assert.match(source, /0\.857/, path);
    assert.match(source, /0\.883/, path);
    assert.match(source, /LME_S/, path);
    assert.match(source, /N=90/, path);
    assert.match(source, /87\.7/, path);
    assert.match(source, /0\.815/, path);
    assert.match(source, /0\.822/, path);
  }

  const publicSources = (await Promise.all([
    ...fullMetricSurfaces,
    ...headlineMetricSurfaces,
  ].map((path) => readRepo(path)))).join("\n");

  assert.doesNotMatch(publicSources, /59\.5%/);
  assert.doesNotMatch(publicSources, /0\.589/);
  assert.doesNotMatch(publicSources, /0\.626/);
  assert.doesNotMatch(publicSources, /0\.747/);
  assert.doesNotMatch(publicSources, /0\.614/);
  assert.doesNotMatch(publicSources, /N=31/);
  assert.doesNotMatch(publicSources, /LME_oracle/);
  assert.doesNotMatch(publicSources, /70\.0%/);
  assert.doesNotMatch(publicSources, /4\.8[- ]points?/i);
});

test("public source contains no stale Origin package, repo, install, or local-path surfaces", async () => {
  const forbidden = [
    /@7xuanlu\/origin/g,
    /origin@7xuanlu/g,
    /github\.com\/7xuanlu\/origin(?!-app|-website)/g,
    /~\/\.origin/g,
    /\borigin-mcp\b/g,
    /\borigin-types\b/g,
    /\borigin-server\b/g,
    /\borigin-core\b/g,
    /\borigin-cli\b/g,
    /\bORIGIN_SPACE\b/g,
    /\bORIGIN_HOST\b/g,
    /\bORIGIN_BIND_ADDR\b/g,
    /\bORIGIN_DATA_DIR\b/g,
  ];

  const failures = [];
  for (const pattern of forbidden) {
    failures.push(...(await collectMatches(pattern)));
  }

  assert.deepEqual(failures, []);
});

test("public prose displays Wenlan instead of stale Origin branding", async () => {
  const matches = await collectMatches(/\bOrigin\b/g);
  const allowed = matches.filter((match) =>
    /wenlan-site|Origin header|allowed Origin|HTTP Origin/.test(match),
  );
  const failures = matches.filter((match) => !allowed.includes(match));

  assert.deepEqual(failures, []);
});

test("public TypeScript string literals do not render stale Origin copy", async () => {
  const files = ["src/app/docs/docs.ts", "src/app/learn/seo-articles.ts"];
  const forbidden = [
    /\bOrigin MCP\b/,
    /\borigin space\b/,
    /\borigin spaces\.toml\b/,
    /\borigin list --limit 10\b/,
    /\borigin forget <id>\b/,
  ];
  const failures = [];

  for (const file of files) {
    const strings = await collectTypescriptStringValues(file);
    for (const { line, value } of strings) {
      if (forbidden.some((pattern) => pattern.test(value))) {
        failures.push(`${file}:${line}:${value}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});

test("Cursor and Claude Code search page answers shared-memory setup explicitly", async () => {
  const articles = await readRepo("src/app/learn/seo-articles.ts");

  assert.match(articles, /title: "How to Share Memory Between Cursor and Claude Code"/);
  assert.match(articles, /metaTitle: "Share Memory Between Cursor and Claude Code \| Wenlan"/);
  assert.match(
    articles,
    /point both clients at the same Wenlan daemon, data directory, and space/,
  );
  assert.match(articles, /updatedAt: spec\.updatedAt \?\? UPDATED_AT/);
  assert.match(
    articles,
    /slug: "cursor-claude-code-shared-memory"[\s\S]*?updatedAt: "2026-07-17"/,
  );
});

test("stale AI agent memory page exposes a source-backed diagnostic workflow", async () => {
  const articles = await readRepo("src/app/learn/seo-articles.ts");
  const marker = 'slug: "review-before-trust-ai-memory"';
  const start = articles.indexOf(marker);
  const end = articles.indexOf('\n  {\n    slug: "', start + marker.length);
  const article = articles.slice(start, end);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  assert.match(article, /title: "How to Fix Stale AI Agent Memory"/);
  assert.match(article, /metaTitle: "Fix Stale AI Agent Memory: Diagnose & Correct \| Wenlan"/);
  assert.match(article, /updatedAt: "2026-07-24"/);
  assert.match(article, /stale AI agent memory/);
  assert.match(article, /contradictory agent memory/);
  assert.match(article, /\/recall <stale topic>/);
  assert.match(article, /\/lint deep/);
  assert.match(article, /\/capture <current fact \+ why>/);
  assert.match(article, /\/curate revisions/);
  assert.match(article, /\/forget <source_id>/);
  assert.match(article, /Destructive; cannot be undone/);
  assert.match(article, /Plain \/lint and \/lint deep are read-only/);
  assert.match(article, /href: "https:\/\/wenlan\.app\/docs\/review-and-trust"/);
  assert.match(
    article,
    /href: "https:\/\/github\.com\/7xuanlu\/wenlan\/blob\/main\/plugin\/skills\/curate\/SKILL\.md"/,
  );
  assert.match(
    article,
    /href: "https:\/\/github\.com\/7xuanlu\/wenlan\/blob\/main\/plugin\/skills\/lint\/SKILL\.md"/,
  );
  assert.match(
    article,
    /href: "https:\/\/github\.com\/7xuanlu\/wenlan\/blob\/main\/plugin\/skills\/forget\/SKILL\.md"/,
  );
});

test("MCP memory article exposes the Cursor and Claude Code shared-memory workflow", async () => {
  const articles = await readRepo("src/app/learn/articles.ts");
  const marker = 'slug: "mcp-memory-server"';
  const start = articles.indexOf(marker);
  const end = articles.indexOf('\n  {\n    slug: "', start + marker.length);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  assert.match(
    articles.slice(start, end),
    /relatedSlugs:\s*\[[^\]]*"cursor-claude-code-shared-memory"[^\]]*\]/,
  );
});

test("MCP article answers knowledge-base server intent with a source-backed validation loop", async () => {
  const articles = await readRepo("src/app/learn/articles.ts");
  const marker = 'slug: "mcp-memory-server"';
  const start = articles.indexOf(marker);
  const end = articles.indexOf('\n  {\n    slug: "', start + marker.length);
  const article = articles.slice(start, end);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  assert.match(article, /title: "MCP Knowledge Base Server for AI Agents"/);
  assert.match(
    article,
    /metaTitle: "MCP Knowledge Base Server for AI Agents \| Wenlan"/,
  );
  assert.match(article, /"MCP knowledge base server"/);
  assert.match(article, /publishedAt: "2026-06-07"/);
  assert.match(article, /updatedAt: "2026-08-13"/);
  assert.match(article, /heading: "What MCP adds to a knowledge base"/);
  assert.match(
    article,
    /heading: "What an MCP knowledge-base server should expose"/,
  );
  assert.match(article, /heading: "MCP memory server vs knowledge base"/);
  assert.match(article, /heading: "Verify the MCP knowledge-base route"/);
  assert.match(article, /List the server tools from one MCP client/);
  assert.match(article, /Query one harmless source and inspect the citation/);
  assert.match(
    article,
    /Confirm a second client can retrieve the same maintained answer/,
  );
  assert.match(
    article,
    /relatedSlugs:\s*\[[^\]]*"source-backed-wiki-pages-ai-work"[^\]]*"build-local-ai-knowledge-base-from-documents"[^\]]*"distilled-wiki-pages-ai-memory"[^\]]*\]/,
  );
});

test("security docs align with the current Wenlan site policy", async () => {
  const { version } = await currentWenlanRelease();
  const docs = await readRepo("src/app/docs/docs.ts");

  assert.doesNotMatch(docs, /acknowledgement within 48 hours/);
  assert.doesNotMatch(docs, /7-day fix-timeline/);
  assert.doesNotMatch(docs, /supported 0\.7\.x/);
  assert.match(docs, /acknowledgment within 72 hours/);
  assert.match(docs, new RegExp(`current stable ${escapeRegExp(version)}`));
});


test("public current-release surfaces track the selected Wenlan release source", async () => {
  const { version, date } = await currentWenlanRelease();
  const structuredData = await readRepo("src/app/structured-data.ts");
  const releases = await readRepo("src/lib/releases.ts");
  const downloadSection = await readRepo("src/components/home/download.tsx");
  const englishContent = await readRepo("src/i18n/content/en.ts");
  const simplifiedContent = await readRepo("src/i18n/content/zh-CN.ts");
  const traditionalContent = await readRepo("src/i18n/content/zh-TW.ts");
  const aboutOg = await readRepo("src/app/about/opengraph-image.tsx");
  const docs = await readRepo("src/app/docs/docs.ts");
  const sitemap = await readRepo("src/app/sitemap.ts");

  const escapedVersion = escapeRegExp(version);

  assert.match(structuredData, /softwareVersion: WENLAN_RELEASE\.version/);
  assert.match(structuredData, /downloadUrl: WENLAN_RELEASE\.releaseUrl/);
  assert.match(releases, new RegExp(`version: "${escapedVersion}"`));
  assert.match(releases, new RegExp(`tag: "v${escapedVersion}"`));
  assert.match(
    releases,
    new RegExp(`publishedAt: "${escapeRegExp(date)}(?:T|")`),
  );
  assert.match(releases, /wenlan-windows-x64\.zip/);
  assert.match(releases, /wenlan-darwin-arm64\.tar\.gz/);
  assert.match(releases, /wenlan-linux-x64\.tar\.gz/);
  assert.match(releases, /wenlan-linux-arm64\.tar\.gz/);
  assert.match(
    releases,
    new RegExp(`Wenlan_${escapedVersion}_aarch64\\.dmg`),
  );
  assert.match(releases, /id: "macos-runtime-arm64"/);
  assert.doesNotMatch(releases, /Wenlan_aarch64\.app\.tar\.gz/);
  assert.match(downloadSection, /id="download"/);
  assert.match(downloadSection, /placement="home-download"/);
  assert.match(englishContent, new RegExp(`"v${escapedVersion}"`));
  assert.match(englishContent, new RegExp(`Wenlan v${escapedVersion} ships`));
  assert.match(simplifiedContent, new RegExp(`"版本 v${escapedVersion}"`));
  assert.match(simplifiedContent, new RegExp(`Wenlan v${escapedVersion} 提供`));
  assert.match(traditionalContent, new RegExp(`"版本 v${escapedVersion}"`));
  assert.match(traditionalContent, new RegExp(`Wenlan v${escapedVersion} 提供`));
  assert.match(englishContent, /Download macOS desktop/);
  assert.match(traditionalContent, /下載 macOS 桌面版/);
  assert.match(simplifiedContent, /下载 macOS 桌面版/);
  assert.doesNotMatch(englishContent, /preview is not yet notarized/);
  assert.doesNotMatch(traditionalContent, /預覽版尚未完成 notarization/);
  assert.doesNotMatch(simplifiedContent, /预览版尚未完成 notarization/);
  assert.match(aboutOg, new RegExp(`v${escapedVersion} · Apache-2\\.0`));
  assert.match(docs, new RegExp(`current stable ${escapedVersion}`));
  assert.match(docs, new RegExp(`Wenlan version ${escapedVersion}`));
  assert.match(docs, new RegExp(`v${escapedVersion}.*${escapeRegExp(date)}`));
  assert.match(sitemap, new RegExp(`ABOUT_UPDATED_AT = "${escapeRegExp(date)}"`));
  const getStartedDate = sitemap.match(/GET_STARTED_UPDATED_AT = "(\d{4}-\d{2}-\d{2})"/)?.[1];
  assert.ok(getStartedDate, "sitemap must declare GET_STARTED_UPDATED_AT");
  assert.ok(
    new Date(getStartedDate) >= new Date(date),
    "get-started sitemap date must not predate the current release",
  );
});

test("public release surfaces expose the verified v0.18.0 artifacts and highlights", async () => {
  const { WENLAN_RELEASE } = await import("../src/lib/releases.ts");
  const docs = await readRepo("src/app/docs/docs.ts");
  const structuredData = await readRepo("src/app/structured-data.ts");
  const aboutOg = await readRepo("src/app/about/opengraph-image.tsx");
  const llms = await readRepo("public/llms.txt");

  assert.equal(WENLAN_RELEASE.version, "0.18.0");
  assert.equal(WENLAN_RELEASE.tag, "v0.18.0");
  assert.equal(WENLAN_RELEASE.publishedAt, "2026-09-04T20:31:03Z");
  assert.equal(
    WENLAN_RELEASE.releaseUrl,
    "https://github.com/7xuanlu/wenlan/releases/tag/v0.18.0",
  );
  assert.equal(
    WENLAN_RELEASE.setupGuideUrl,
    "https://github.com/7xuanlu/wenlan/blob/v0.18.0/docs/setup-with-ai.md#install-the-runtime",
  );
  assert.deepEqual(
    WENLAN_RELEASE.assets.map(({ id, href, format, size }) => ({ id, href, format, size })),
    [
      {
        id: "windows-desktop-x64",
        href: "https://github.com/7xuanlu/wenlan/releases/download/v0.18.0/Wenlan_0.18.0_x64-setup.exe",
        format: "EXE",
        size: "59.3 MiB",
      },
      {
        id: "windows-x64",
        href: "https://github.com/7xuanlu/wenlan/releases/download/v0.18.0/wenlan-windows-x64.zip",
        format: "ZIP",
        size: "73.7 MiB",
      },
      {
        id: "macos-arm64",
        href: "https://github.com/7xuanlu/wenlan/releases/download/v0.18.0/Wenlan_0.18.0_aarch64.dmg",
        format: "DMG",
        size: "83.6 MiB",
      },
      {
        id: "macos-runtime-arm64",
        href: "https://github.com/7xuanlu/wenlan/releases/download/v0.18.0/wenlan-darwin-arm64.tar.gz",
        format: "TAR.GZ",
        size: "50.0 MiB",
      },
      {
        id: "linux-x64",
        href: "https://github.com/7xuanlu/wenlan/releases/download/v0.18.0/wenlan-linux-x64.tar.gz",
        format: "TAR.GZ",
        size: "62.6 MiB",
      },
      {
        id: "linux-arm64",
        href: "https://github.com/7xuanlu/wenlan/releases/download/v0.18.0/wenlan-linux-arm64.tar.gz",
        format: "TAR.GZ",
        size: "62.8 MiB",
      },
    ],
  );
  assert.match(docs, /v0\.18\.0 highlights/);
  assert.match(docs, /one home page with an honest empty state/);
  assert.match(docs, /removes the .*Where AI looked.* section/);
  assert.match(docs, /global shortcut is occupied/);
  assert.match(docs, /window stays still after launch/);
  assert.match(structuredData, /tree\/v0\.18\.0\/app/);
  assert.match(aboutOg, /v0\.18\.0 · Apache-2\.0/);
  assert.match(llms, /tree\/v0\.18\.0\/app/);
});

test("download information architecture keeps the homepage compact and the full matrix on a localized hub", async () => {
  const homeDownload = await readRepo("src/components/home/download.tsx");
  const recommendation = await readRepo(
    "src/components/home/download-recommendation.tsx",
  );
  const downloadPage = await readRepo("src/app/_pages/download.tsx");
  const downloadPlatforms = await readRepo(
    "src/components/download/download-platforms.tsx",
  );
  const englishRoute = await readRepo("src/app/(en)/download/page.tsx");
  const localizedRoute = await readRepo("src/app/[locale]/download/page.tsx");
  const routing = await readRepo("src/i18n/routing.ts");
  const sitemap = await readRepo("src/app/sitemap.ts");

  assert.match(homeDownload, /id="download"/);
  assert.match(homeDownload, /<DownloadRecommendation/);
  assert.match(homeDownload, /href="\/download"/);
  assert.doesNotMatch(homeDownload, /WENLAN_RELEASE\.assets\.map/);
  assert.doesNotMatch(homeDownload, /copy\.eyebrow/);
  assert.doesNotMatch(homeDownload, /copy\.releaseNotesLabel/);
  assert.doesNotMatch(homeDownload, /copy\.stableLabel/);
  assert.match(recommendation, /^"use client";/);
  assert.match(recommendation, /recommendedReleaseAssetId\(navigator\.userAgent\)/);
  assert.match(recommendation, /placement="home-download"/);
  assert.match(downloadPage, /WENLAN_RELEASE\.assets\.map/);
  assert.match(downloadPage, /<DownloadPlatforms/);
  assert.match(downloadPage, /min-h-\[100dvh\]/);
  assert.doesNotMatch(downloadPage, /content\.eyebrow/);
  assert.match(downloadPlatforms, /^"use client";/);
  assert.match(
    downloadPlatforms,
    /recommendedReleaseAssetId\(navigator\.userAgent\)/,
  );
  assert.match(downloadPlatforms, /otherPlatforms/);
  assert.match(downloadPlatforms, /<details/);
  assert.match(downloadPlatforms, /open=\{index === 0/);
  assert.match(downloadPlatforms, /placement="download-page"/);
  assert.match(downloadPlatforms, /copy\.packageIncludesLabel/);
  assert.match(downloadPlatforms, /platform\.packageIncludesLabel/);
  assert.match(downloadPlatforms, /platform\.guideHref/);
  assert.match(downloadPlatforms, /platform\.guideLabel/);
  assert.match(downloadPage, /"@type": "BreadcrumbList"/);
  assert.match(downloadPage, /wenlan doctor/);
  assert.match(englishRoute, /buildPageMetadata\(\s*"en",\s*"\/download"/s);
  assert.match(localizedRoute, /resolveLocalizedRouteLocale/);
  assert.match(localizedRoute, /buildPageMetadata\(\s*resolvedLocale,\s*"\/download"/s);
  assert.match(routing, /CORE_TRANSLATED_PATHS[\s\S]*"\/download"/);
  assert.match(sitemap, /pathname: "\/download"/);
});

test("public docs expose a product readiness matrix for users and platform boundaries", async () => {
  const docs = await readRepo("src/app/docs/docs.ts");
  const llms = await readRepo("public/llms.txt");
  const localizedIndexes = [
    [
      "src/i18n/content/en.ts",
      await readRepo("src/i18n/content/en.ts"),
      /id:\s*"product-matrix"[\s\S]*?Updated Jul 9, 2026 · 6 min read/,
    ],
    [
      "src/i18n/content/zh-CN.ts",
      await readRepo("src/i18n/content/zh-CN.ts"),
      /id:\s*"product-matrix"[\s\S]*?更新于 2026 年 7 月 9 日 · 6 分钟阅读/,
    ],
    [
      "src/i18n/content/zh-TW.ts",
      await readRepo("src/i18n/content/zh-TW.ts"),
      /id:\s*"product-matrix"[\s\S]*?更新於 2026 年 7 月 9 日 · 6 分鐘閱讀/,
    ],
  ];

  assert.match(docs, /slug:\s*"product-matrix"/);
  assert.match(docs, /title:\s*"Product Matrix"/);
  assert.match(llms, /\[Product Matrix\]\(https:\/\/wenlan\.app\/docs\/product-matrix\)/);
  for (const [path, source, metadataPattern] of localizedIndexes) {
    assert.match(source, /id:\s*"product-matrix"[\s\S]*?href:\s*"\/docs\/product-matrix"/, path);
    assert.match(source, metadataPattern, path);
  }

  for (const route of [
    "/docs/get-started",
    "/docs/daily-workflow",
    "/docs/core-concepts",
    "/docs/architecture",
    "/docs/packages-and-registries",
    "/docs/platforms",
    "/docs/mcp-clients",
    "/docs/desktop-app",
    "/docs/troubleshooting",
    "/docs/releases-and-versioning",
  ]) {
    assert.match(docs, new RegExp(`href: "${escapeRegExp(route)}"`), route);
  }

  for (const publicSurface of [
    "daemon/runtime",
    "CLI",
    "MCP connector",
    "Claude Code plugin",
    "Codex plugin",
    "ChatGPT and Claude.ai remote MCP",
    "other MCP clients",
    "optional desktop app",
    "source build",
    "eval/docs provenance",
  ]) {
    assert.match(docs, new RegExp(escapeRegExp(publicSurface), "i"), publicSurface);
  }

  assert.match(docs, /macOS Apple Silicon/);
  assert.match(docs, /macOS Intel.*no current prebuilt runtime/i);
  assert.match(docs, /Linux x86_64/);
  assert.match(docs, /Linux aarch64 glibc/);
  assert.match(docs, /Windows x86_64/);
  assert.match(docs, /desktop app.*aarch64-apple-darwin/is);
  assert.match(docs, /daemon owns the database, pages, sessions, and retrieval behavior/i);
});

test("public onboarding is Wenlan-first and distinguishes plugin, local MCP, and web MCP paths", async () => {
  const wenlanRoot = process.env.WENLAN_REPO_ROOT
    ? resolve(process.env.WENLAN_REPO_ROOT)
    : resolve(repoRoot, "../wenlan");
  const mcpMain = await readFile(resolve(wenlanRoot, "crates/wenlan-mcp/src/main.rs"), "utf8");
  const englishContent = await readRepo("src/i18n/content/en.ts");
  const simplifiedContent = await readRepo("src/i18n/content/zh-CN.ts");
  const traditionalContent = await readRepo("src/i18n/content/zh-TW.ts");
  const docs = await readRepo("src/app/docs/docs.ts");
  const structuredData = await readRepo("src/app/structured-data.ts");
  const llms = await readRepo("public/llms.txt");
  const llmsFull = await readRepo("src/app/llms-full.txt/route.ts");

  assert.match(mcpMain, /Streamable HTTP MCP server for remote clients \(claude\.ai, ChatGPT\)/);
  assert.doesNotMatch(englishContent, /Install the local memory layer/);
  assert.doesNotMatch(simplifiedContent, /安装本地 memory layer/);
  assert.doesNotMatch(traditionalContent, /安裝本地 memory layer/);

  for (const [path, source] of [
    ["src/i18n/content/en.ts", englishContent],
    ["src/i18n/content/zh-CN.ts", simplifiedContent],
    ["src/i18n/content/zh-TW.ts", traditionalContent],
  ]) {
    assert.match(source, /Claude Code/, path);
    assert.match(source, /Codex/, path);
    assert.match(source, /ChatGPT/, path);
  }

  assert.match(docs, /Claude Code plugin/);
  assert.match(docs, /Codex plugin/);
  assert.match(docs, /ChatGPT/);
  assert.match(docs, /Streamable HTTP MCP/);
  assert.match(docs, /Settings > Plugins/);
  assert.match(docs, /Server URL/);
  assert.match(docs, /Authentication to None/);
  assert.doesNotMatch(docs, /Developer mode/);
  assert.match(structuredData, /ChatGPT/);
  assert.match(structuredData, /Streamable HTTP MCP/);
  assert.match(llms, /ChatGPT/);
  assert.match(llms, /Streamable HTTP MCP/);
  assert.match(llms, /possession of the URL grants access/);
  assert.match(llms, /Stop Remote Access when unused/);
  assert.match(llmsFull, /ChatGPT/);
});

test("public framing stays LLM-wiki-first across footer, social images, and the current demo", async () => {
  const surfaces = [
    ["src/i18n/content/en.ts", await readRepo("src/i18n/content/en.ts")],
    ["src/app/learn/opengraph-image.tsx", await readRepo("src/app/learn/opengraph-image.tsx")],
    ["src/app/learn/[slug]/opengraph-image.tsx", await readRepo("src/app/learn/[slug]/opengraph-image.tsx")],
    ["src/app/docs/[slug]/opengraph-image.tsx", await readRepo("src/app/docs/[slug]/opengraph-image.tsx")],
  ];

  for (const [path, source] of surfaces) {
    assert.doesNotMatch(source, /Living personal knowledge library/, path);
    assert.match(source, /LLM wiki/, path);
  }

  assert.match(surfaces[0][1], /title: "Wenlan demo"/);
  assert.doesNotMatch(surfaces[0][1], /Historical Wenlan demo v0\.9/);
  assert.match(surfaces[1][1], /ChatGPT/);
});

test("public client setup tracks the released wenlan connect command", async () => {
  const wenlanRoot = process.env.WENLAN_REPO_ROOT
    ? resolve(process.env.WENLAN_REPO_ROOT)
    : resolve(repoRoot, "../wenlan");
  const cliMain = await readFile(resolve(wenlanRoot, "crates/wenlan-cli/src/main.rs"), "utf8");
  const surfaces = await readPublicCommandGuidance();

  assert.match(cliMain, /Connect\(commands::mcp::ConnectArgs\)/);
  for (const [path, source] of surfaces) {
    const renderedGuidance = await renderedGuidanceFor(path, source);
    assert.doesNotMatch(renderedGuidance, /\bwenlan mcp add\b/, path);
  }

  const publicGuidance = surfaces.map(([, source]) => source).join("\n");
  assert.match(publicGuidance, /wenlan connect codex/);
  assert.match(publicGuidance, /wenlan connect cursor/);
  assert.match(publicGuidance, /wenlan connect claude-desktop/);
});

test("public CLI guidance tracks the current top-level command surface", async () => {
  const wenlanRoot = process.env.WENLAN_REPO_ROOT
    ? resolve(process.env.WENLAN_REPO_ROOT)
    : resolve(repoRoot, "../wenlan");
  const cliSource = await readFile(
    resolve(wenlanRoot, "crates/wenlan-cli/src/main.rs"),
    "utf8",
  );

  for (const command of ["Background", "Capture", "Memories", "Spaces", "Models", "Keys"]) {
    assert.match(cliSource, new RegExp(`\\b${command}\\b`), command);
  }

  const surfaces = await Promise.all(
    publicCommandGuidancePaths.map(async (path) => [path, await readRepo(path)]),
  );
  const publicGuidance = surfaces.map(([path, source]) => `// ${path}\n${source}`).join("\n");

  for (const staleCommand of [
    /\bwenlan install\b/,
    /\bwenlan uninstall\b/,
    /\bwenlan store\b/,
    /\bwenlan list\b/,
    /\bwenlan space\b/,
    /\bwenlan model\b/,
    /\bwenlan key\b/,
    /\bwenlan reranker\b/,
  ]) {
    assert.doesNotMatch(publicGuidance, staleCommand, staleCommand.source);
  }

  for (const staleCliDescription of [
    /wenlan CLI[^"\n]*\bstore\b/,
    /wenlan CLI[^"\n]*\bmodel\b/,
    /wenlan CLI[^"\n]*\bkey\b/,
    /The CLI uses[^"\n]*\b(store|list|model|key)\b/,
    /The CLI can[^"\n]*\b(store|list)\b/,
    /use wenlan setup, install/,
  ]) {
    assert.doesNotMatch(publicGuidance, staleCliDescription, staleCliDescription.source);
  }

  for (const currentCommand of [
    /wenlan background on/,
    /wenlan background off/,
    /wenlan capture/,
    /wenlan memories/,
    /wenlan spaces/,
    /wenlan models/,
    /wenlan keys/,
    /wenlan models reranker/,
  ]) {
    assert.match(publicGuidance, currentCommand, currentCommand.source);
  }
});

test("public command guidance tracks the current plugin contract", async () => {
  const wenlanRoot = process.env.WENLAN_REPO_ROOT
    ? resolve(process.env.WENLAN_REPO_ROOT)
    : resolve(repoRoot, "../wenlan");
  const contract = JSON.parse(
    await readFile(resolve(wenlanRoot, "plugin-contract.json"), "utf8"),
  );
  const sharedCommands = contract.skills
    .filter((skill) => skill.status === "shared_now")
    .map((skill) => skill.name)
    .sort();
  const surfaces = await readPublicCommandGuidance();
  const publicGuidance = surfaces.map(([, source]) => source).join("\n");

  assert.deepEqual(sharedCommands, [
    "brief",
    "capture",
    "curate",
    "distill",
    "forget",
    "handoff",
    "help",
    "lint",
    "pages",
    "recall",
    "setup",
  ]);
  for (const [path, source] of surfaces) {
    const renderedGuidance = await renderedGuidanceFor(path, source);
    assert.doesNotMatch(
      renderedGuidance,
      /(?<![A-Za-z0-9_-])\/(?:init|review|read|debrief)\b/,
      path,
    );
  }
  for (const command of sharedCommands) {
    assert.match(publicGuidance, new RegExp(`/${escapeRegExp(command)}\\b`), command);
  }
  const docs = surfaces.find(([path]) => path === "src/app/docs/docs.ts")?.[1] ?? "";
  assert.doesNotMatch(docs, /\/pages[^"\n]*(?:preview|inside the agent session|without leaving)/i);
  assert.match(docs, /\/pages: list recent pages or open a matching page in your editor\./);
  assert.doesNotMatch(docs, /review, distill, read, and handoff/);
});

test("Claude Code memory acquisition page tracks native limits and the direct plugin path", async () => {
  const articles = await readRepo("src/app/learn/articles.ts");
  const start = articles.indexOf('slug: "claude-code-memory"');
  const end = articles.indexOf('\n  {\n    slug:', start + 1);
  assert.notEqual(start, -1, "Claude Code memory article is missing");
  const article = articles.slice(start, end === -1 ? articles.length : end);

  assert.match(article, /publishedAt: "2026-06-07"/);
  assert.match(article, /updatedAt: "2026-07-18"/);
  assert.match(article, /first 200 lines or 25 KB/);
  assert.match(article, /per repository and shared across worktrees/);
  assert.match(article, /Start with Claude Code's native memory/);
  assert.match(article, /\/plugin marketplace add 7xuanlu\/wenlan/);
  assert.match(article, /\/plugin install wenlan@7xuanlu-wenlan/);
  assert.match(article, /\/memory/);
});

test("public-copy scans exclude private work artifacts", async () => {
  assert.equal(shouldSkipPublicScanEntry(".omo"), true);
  assert.equal(shouldSkipPublicScanEntry(".codegraph"), true);
  assert.equal(shouldSkipPublicScanEntry("src"), false);
});

test("public platform surfaces track current release artifact boundaries", async () => {
  const surfaces = [
    ["src/app/structured-data.ts", await readRepo("src/app/structured-data.ts")],
    ["public/llms.txt", await readRepo("public/llms.txt")],
    ["src/app/llms-full.txt/route.ts", await readRepo("src/app/llms-full.txt/route.ts")],
    ["src/i18n/content/en.ts", await readRepo("src/i18n/content/en.ts")],
    ["src/i18n/content/zh-CN.ts", await readRepo("src/i18n/content/zh-CN.ts")],
    ["src/i18n/content/zh-TW.ts", await readRepo("src/i18n/content/zh-TW.ts")],
    ["src/app/docs/docs.ts", await readRepo("src/app/docs/docs.ts")],
  ];

  for (const [path, source] of surfaces) {
    assert.doesNotMatch(source, /macOS\s*\(arm64,\s*x64\)/i, path);
    assert.doesNotMatch(source, /macOS\s+arm64\/x64/i, path);
  }

  const structuredData = surfaces[0][1];
  const llms = surfaces[1][1];
  const llmsFull = surfaces[2][1];
  const englishContent = surfaces[3][1];
  const simplifiedContent = surfaces[4][1];
  const traditionalContent = surfaces[5][1];
  const docs = surfaces[6][1];

  assert.match(structuredData, /macOS Apple Silicon/);
  assert.match(structuredData, /Linux x86_64 or aarch64 \(glibc\)/);
  assert.match(structuredData, /Windows x86_64/);
  assert.match(llms, /macOS Apple Silicon/);
  assert.match(llms, /Linux \(x86_64, aarch64; glibc\)/);
  assert.match(llmsFull, /macOS Apple Silicon/);
  assert.match(llmsFull, /Linux \(x86_64, aarch64; glibc\)/);
  assert.match(englishContent, /macOS Apple Silicon/);
  assert.match(englishContent, /no current prebuilt macOS Intel runtime/i);
  assert.match(simplifiedContent, /macOS Apple Silicon/);
  assert.match(simplifiedContent, /目前没有 macOS Intel 预编译运行时/);
  assert.match(traditionalContent, /macOS Apple Silicon/);
  assert.match(traditionalContent, /目前沒有 macOS Intel 預編譯執行環境/);
  assert.match(docs, /macOS Apple Silicon, Linux x86_64\/aarch64 with glibc, and Windows x86_64/);
  assert.match(docs, /macOS Intel.*no current prebuilt runtime/i);
});

test("public source has no stale Wenlan product assertions", async () => {
  const forbidden = [
    /softwareVersion` `0\.7\.0`/g,
    /softwareVersion: "0\.(?:7|9)\.0"/g,
    /Wenlan is local-first memory for AI work/g,
    /Local-first memory for AI work/g,
    /where AI work compounds/g,
    /visible, editable/g,
    /visible and editable/g,
    /current stable 0\.9\.0/g,
    /current stable release in the repository changelog is v0\.9\.0/g,
    /Recent main-branch work after v0\.9\.0/g,
    /After v0\.9\.0, main-branch work should be treated/g,
    /Wenlan version 0\.9\.0/g,
    /Wenlan v0\.9\.0 ships/g,
    /Wenlan v0\.9\.0 as of 2026-05-27/g,
    /Last refresh: v0\.9\.0 on 2026-05-27/g,
    /Wenlan v0\.7 upgrade/g,
    /v0\.7\.x runtime shape/g,
    /v0\.7-era runtime shape/g,
    /After v0\.7\.0, main received/g,
    /real git versioning of every memory write/g,
    /readable artifact history/g,
    /Every write is a git commit/g,
    /every memory write is a git commit/g,
    /Every memory has a Markdown file/g,
    /git log path\/to\/memory\.md/g,
    /full history of a single fact/g,
    /commit that created the claim/g,
    /git-versioned audit on every write/g,
    /wenlan import vault/g,
    /Wenlan can import Markdown-style vault content/g,
    /vault import path reads Markdown files/g,
    /Obsidian-style importer/g,
    /\/api\/ingest\/memory/g,
    /Background distillation still happens/g,
    /Background distillery/g,
    /background distill cycles supplement/g,
    /background distill cycles/g,
    /daemon pulls the week's captures into a distill cycle/g,
    /periodic refinery phase/g,
    /memory chores between sessions/g,
    /Between sessions, Wenlan deduplicates repeat facts, links related ideas, distills wiki pages/g,
    /The database is the index\. Markdown is the record/g,
    /Markdown as the human-readable record/g,
    /Markdown is the record you can read/g,
    /Markdown is the durable record people can read/g,
    /Wenlan stores human-readable Markdown records/g,
    /human-readable records, MCP clients/g,
    /wenlan mcp add/g,
    /git blame`? a fact/g,
    /Markdown remains the human-readable record\. The local database is the index/g,
  ];

  const failures = [];
  for (const pattern of forbidden) {
    failures.push(...(await collectMatches(pattern)));
  }

  assert.deepEqual(failures, []);
});

test("TypeScript public-copy literals have no stale Wenlan assertions", async () => {
  const files = [
    "src/app/layout.tsx",
    "src/app/opengraph-image.tsx",
    "src/app/about/opengraph-image.tsx",
    "src/app/docs/opengraph-image.tsx",
    "src/app/docs/[slug]/opengraph-image.tsx",
    "src/app/learn/opengraph-image.tsx",
    "src/app/learn/[slug]/opengraph-image.tsx",
    "src/app/about/page.tsx",
    "src/app/llms-full.txt/route.ts",
    "src/app/docs/docs.ts",
    "src/app/learn/articles.ts",
    "src/app/learn/seo-articles.ts",
    "src/components/sections.tsx",
  ];
  const forbidden = [
    /0\.7-era runtime shape/,
    /Wenlan v0\.7 upgrade/,
    /current stable 0\.9\.0/,
    /Wenlan is local-first memory for AI work/,
    /Local-first memory for AI work/,
    /where AI work compounds/,
    /visible, editable/,
    /visible and editable/,
    /Wenlan version 0\.9\.0/,
    /real git versioning of every memory write/,
    /readable artifact history/,
    /every memory write is a git commit/,
    /Every memory has a Markdown file/,
    /commit that created the claim/,
    /git-versioned audit on every write/,
    /wenlan import vault/,
    /Obsidian-style importer/,
    /Background distillation still happens/,
    /Background distillery/,
    /background distill cycles/,
    /periodic refinery phase/,
    /memory chores between sessions/,
    /The database is the index\. Markdown is the record/,
    /Markdown as the human-readable record/,
    /Markdown is the record you can read/,
    /Markdown is the durable record people can read/,
    /Wenlan stores human-readable Markdown records/,
    /human-readable records, MCP clients/,
    /git blame`? a fact/,
    /Markdown remains the human-readable record\. The local database is the index/,
  ];
  const failures = [];

  for (const file of files) {
    const strings = await collectTypescriptStringValues(file);
    for (const { line, value } of strings) {
      if (forbidden.some((pattern) => pattern.test(value))) {
        failures.push(`${file}:${line}:${value}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});

test("Wenlan route slugs replace old Origin slugs with direct redirects", async () => {
  const articleSources = [
    await readRepo("src/app/learn/articles.ts"),
    await readRepo("src/app/learn/seo-articles.ts"),
  ].join("\n");
  const slugMatches = [...articleSources.matchAll(/\bslug:\s*"([^"]+)"/g)].map(
    (match) => match[1],
  );
  const staleSlugs = slugMatches.filter((slug) => /\borigin\b/.test(slug));

  assert.deepEqual(staleSlugs, []);

  const nextConfig = await readRepo("next.config.ts");
  const requiredRedirects = [
    ["/learn/origin-for-claude-code", "/learn/wenlan-for-claude-code"],
    [
      "/learn/claude-code-memory-command-vs-origin",
      "/learn/claude-code-memory-command-vs-wenlan",
    ],
    [
      "/learn/where-origin-stores-claude-code-memory",
      "/learn/where-wenlan-stores-claude-code-memory",
    ],
    ["/learn/origin-vs-basic-memory", "/learn/wenlan-vs-basic-memory"],
    ["/learn/origin-vs-claude-mem", "/learn/wenlan-vs-claude-mem"],
    ["/learn/origin-vs-superlocal-memory", "/learn/wenlan-vs-superlocal-memory"],
    ["/learn/origin-codex-workflow", "/learn/wenlan-codex-workflow"],
    ["/learn/origin-cursor-workflow", "/learn/wenlan-cursor-workflow"],
    [
      "/learn/origin-claude-desktop-workflow",
      "/learn/wenlan-claude-desktop-workflow",
    ],
    ["/learn/origin-gemini-cli-workflow", "/learn/wenlan-gemini-cli-workflow"],
    ["/learn/origin-vscode-mcp-workflow", "/learn/wenlan-vscode-mcp-workflow"],
    ["/learn/origin-vs-mcp-memory-service", "/learn/wenlan-vs-mcp-memory-service"],
    ["/learn/origin-vs-chatgpt-memory", "/learn/wenlan-vs-chatgpt-memory"],
    ["/learn/origin-vs-obsidian-ai-memory", "/learn/wenlan-vs-obsidian-ai-memory"],
    ["/learn/origin-vs-notion-ai", "/learn/wenlan-vs-notion-ai"],
    ["/learn/origin-vs-mem0", "/learn/wenlan-vs-mem0"],
  ];

  for (const [source, destination] of requiredRedirects) {
    assert.match(nextConfig, new RegExp(`source:\\s*"${source}"`));
    assert.match(nextConfig, new RegExp(`destination:\\s*"${destination}"`));
  }
});

test("public internal links point to Wenlan route slugs", async () => {
  const linkSources = [
    await readRepo("src/components/site-footer.tsx"),
    await readRepo("src/app/(en)/not-found.tsx"),
    await readRepo("src/app/learn/page.tsx"),
  ].join("\n");

  assert.doesNotMatch(linkSources, /href=["{]?"\/learn\/origin-/);
  assert.doesNotMatch(linkSources, /href=["{]?"\/learn\/claude-code-memory-command-vs-origin/);
  assert.doesNotMatch(linkSources, /href=["{]?"\/learn\/where-origin-stores/);
});

test("public docs and assets do not expose stale lower-case Origin surfaces", async () => {
  const checks = [
    ["src/app/docs/docs.ts", /"origin":\s*{/],
    ["src/app/docs/docs.ts", /~\/\.local\/share\/origin/],
    ["src/app/docs/docs.ts", /origin list --limit 10/],
    ["src/app/docs/docs.ts", /origin forget <id>/],
    ["src/app/docs/docs.ts", /\bservers\.origin\b/],
    ["src/app/docs/docs.ts", /\bmcp_origin_/],
    ["src/app/docs/docs.ts", /\bcd origin\b/],
    ["src/app/docs/docs.ts", /ORIGIN_[A-Z0-9_]+/],
    ["src/app/learn/articles.ts", /origin forget <id>/],
    ["src/app/learn/seo-articles.ts", /\bservers\.origin\b/],
    ["src/app/learn/seo-articles.ts", /\bmcp_origin_/],
    ["src/app/globals.css", /\borigin-(warm|amber|gold|indigo|sage)\b/],
    ["src/app/globals.css", /\bcard-origin\b/],
    // Detect malformed class/id pseudo-selectors, not valid `(hover: hover)` media features.
    ["src/app/globals.css", /[.#][\w-]+:\s+hover\b/],
    ["src/app/about/opengraph-image.tsx", /\bv0\.7\.0\b/],
    ["src/app/about/page.tsx", /"v0\.7\.0"|Wenlan v0\.7\.0 ships/],
  ];

  const failures = [];
  for (const [path, pattern] of checks) {
    const text = await readRepo(path);
    if (pattern.test(text)) {
      failures.push(`${path}: ${pattern}`);
    }
  }

  assert.deepEqual(failures, []);
});

test("comparison row data model names the Wenlan column directly", async () => {
  const articleSources = [
    await readRepo("src/app/learn/articles.ts"),
    await readRepo("src/app/learn/seo-articles.ts"),
    await readRepo("src/app/learn/[slug]/page.tsx"),
    await readRepo("src/app/llms-full.txt/route.ts"),
  ].join("\n");

  assert.match(articleSources, /\bwenlan:\s*string;/);
  assert.doesNotMatch(articleSources, /\borigin:\s*string;/);
  assert.doesNotMatch(articleSources, /\borigin:\s*"/);
  assert.doesNotMatch(articleSources, /\brow\.origin\b/);
});

test("TypeScript article AST uses Wenlan fit identifiers", async () => {
  const sourceText = await readRepo("src/app/learn/seo-articles.ts");
  const sourceFile = ts.createSourceFile(
    "src/app/learn/seo-articles.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const identifiers = [];

  function visit(node) {
    if (ts.isIdentifier(node)) {
      identifiers.push(node.text);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  assert.equal(identifiers.includes("originFit"), false);
  assert.equal(identifiers.includes("wenlanFit"), true);
});

test("Learn article headers keep long Wenlan titles inside mobile viewports", async () => {
  const page = await readRepo("src/app/learn/[slug]/page.tsx");

  assert.match(page, /mt-12 grid min-w-0/);
  assert.match(page, /<div className="min-w-0">/);
  assert.match(page, /<h1 className="[^"]*text-\[2rem\][^"]*\[overflow-wrap:anywhere\][^"]*\[word-break:normal\][^"]*sm:\[overflow-wrap:break-word\][^"]*sm:\[word-break:keep-all\][^"]*sm:text-7xl/);

  const visuals = await readRepo("src/app/learn/article-visuals.tsx");
  assert.match(visuals, /grid min-w-0 grid-cols-\[32px_minmax\(0,1fr\)\]/);
  assert.match(visuals, /<div className="w-full min-w-0 max-w-full/);
  assert.match(visuals, /<p className="min-w-0[^"]*\[overflow-wrap:anywhere\][^"]*\[word-break:normal\][^"]*sm:\[overflow-wrap:break-word\][^"]*sm:\[word-break:keep-all\]/);
});

test("Obsidian acquisition page answers Claude Code and MCP intent without changing its canonical seam", async () => {
  const support = await readRepo("src/app/learn/seo-articles.ts");
  const start = support.indexOf('slug: "wenlan-vs-obsidian-ai-memory"');
  const end = support.indexOf("\n  {\n    slug:", start);
  const article = support.slice(start, end);

  assert.notEqual(start, -1);
  assert.match(
    article,
    /title:\s*"Obsidian \+ Claude Code: Vault Access, MCP, and a Durable AI Knowledge Base"/,
  );
  assert.match(
    article,
    /metaTitle:\s*"Obsidian \+ Claude Code: MCP & AI Knowledge \| Wenlan"/,
  );
  assert.match(article, /publishedAt:\s*"2026-06-06"/);
  assert.match(article, /updatedAt:\s*"2026-07-29"/);
  for (const query of [
    "obsidian claude code",
    "claude code obsidian",
    "obsidian claude",
    "obsidian mcp",
    "obsidian claude code mcp",
  ]) {
    assert.match(article.toLowerCase(), new RegExp(`"${query}"`));
  }
  assert.match(article, /direct filesystem access/i);
  assert.match(article, /active file and selection/i);
  assert.match(article, /structured vault operations/i);
  assert.match(article, /source-backed AI knowledge base/i);
  assert.match(
    article,
    /actionHeading:\s*"Choose the smallest integration layer that solves the job"/,
  );
  assert.match(
    article,
    /https:\/\/github\.com\/Roasbeef\/obsidian-claude-code/,
  );
  assert.match(
    article,
    /https:\/\/github\.com\/petersolopov\/obsidian-claude-ide/,
  );
  assert.match(
    article,
    /https:\/\/github\.com\/iansinnott\/obsidian-claude-code-mcp/,
  );
  assert.match(article, /https:\/\/github\.com\/7xuanlu\/wenlan#daily-workflow/);
  assert.doesNotMatch(
    article,
    /title:\s*"Wenlan vs Obsidian AI Memory/,
  );
});
