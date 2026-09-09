import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildSectionIds } from "../src/app/[locale]/learn/[slug]/section-ids.ts";
import { getLocalizedLearnArticles } from "../src/i18n/learn-articles.ts";

const repoRoot = resolve(import.meta.dirname, "..");

test("localized learn section ids remain unique and deterministic", () => {
  assert.deepEqual(
    buildSectionIds(["AI", "AI", "AI 2", "!!!", "section 5", "!!!"]),
    ["ai", "ai-2", "ai-2-2", "section-4", "section-5", "section-6"],
  );
  assert.deepEqual(buildSectionIds(["!!!", "section 1"]), ["section-1", "section-1-2"]);

  for (const locale of ["zh-TW", "zh-CN"]) {
    for (const article of getLocalizedLearnArticles(locale)) {
      const ids = buildSectionIds(article.sections.map((section) => section.heading), article.sections.map((section) => section.id));
      assert.equal(
        new Set(ids).size,
        ids.length,
        `${locale}/${article.slug} section ids should be unique`,
      );
    }
  }
});

let modulesPromise;

async function loadI18nModules() {
  modulesPromise ??= Promise.all([
    import("../src/i18n/locales.ts"),
    import("../src/i18n/routing-config.ts"),
    import("../src/i18n/routing.ts"),
    import("../src/i18n/navigation.tsx"),
    import("../src/i18n/hash.ts"),
    import("../src/i18n/protected-tokens.ts"),
    import("../src/i18n/content/index.ts"),
    import("../src/i18n/metadata.ts"),
  ]).then(
    ([
      locales,
      routingConfig,
      routing,
      navigation,
      hash,
      protectedTokens,
      content,
      metadata,
    ]) => ({
      locales,
      routingConfig,
      routing,
      navigation,
      hash,
      protectedTokens,
      content,
      metadata,
    }),
  );

  return modulesPromise;
}

function contentShape(value) {
  if (typeof value === "string") return "string";
  if (Array.isArray(value)) return value.map(contentShape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, contentShape(value[key])]),
    );
  }
  return typeof value;
}

function contentShapesByKey(dictionary) {
  return Object.fromEntries(
    Object.keys(dictionary)
      .sort()
      .map((key) => [key, contentShape(dictionary[key].content)]),
  );
}

function leafCountsByKey(dictionary, flattenLeafStrings) {
  return Object.fromEntries(
    Object.keys(dictionary)
      .sort()
      .map((key) => [key, flattenLeafStrings(dictionary[key].content).length]),
  );
}

function hasNonProtectedText(value, protectedTokens) {
  const unprotected = protectedTokens
    .extractProtectedTokens(value)
    .reduce((remaining, token) => remaining.replaceAll(token, ""), value);

  return /[A-Za-z0-9]/.test(unprotected);
}

const allowedUnchangedLeafValues = new Set([
  "Apache-2.0",
  "Apple silicon",
  "ARM64 · glibc",
  "GitHub",
  "Linux",
  "macOS",
  "Qi-Xuan Lu",
  "Wenlan",
  "Windows",
  "x64",
  "x64 · glibc",
  "7xuanlu",
]);

const allowedUnchangedLeafPaths = new Set(["notFound.eyebrow"]);

// Named products and format identifiers are not untranslated UI prose.
const comparisonIdentifiers = new Set(["LLM Wiki", "LLM Wiki · nashsu", "NotebookLM", "Google · Gemini Notebook", "Word · PDF · PPT · Markdown"]);

function findHiddenFallbackLeaves(
  unitKey,
  englishContent,
  translatedContent,
  flattenLeafStrings,
  protectedTokens,
) {
  const translatedLeavesByPath = new Map(
    flattenLeafStrings(translatedContent).map(({ path, value }) => [path, value]),
  );

  return flattenLeafStrings(englishContent)
    .filter(({ path, value }) => {
      if (translatedLeavesByPath.get(path) !== value) return false;
      return requiresTranslatedDifference(unitKey, path, value, protectedTokens);
    })
    .map(({ path, value }) => ({
      path: unitKey ? `${unitKey}.${path}` : path,
      value,
    }));
}

function requiresTranslatedDifference(unitKey, path, value, protectedTokens) {
  if (!hasNonProtectedText(value, protectedTokens)) return false;
  return !isAllowedUnchangedLeaf(unitKey, path, value);
}

function isAllowedUnchangedLeaf(unitKey, path, value) {
  if (unitKey === "home" && /^redesign\.pains\.generations\[\d+\]\.tabLabel$/.test(path) && value === "LLM Wiki") return true;
  if (unitKey === "home" && /^redesign\.pains\.generations\[\d+\]\.(name|eyebrow)$/.test(path) && comparisonIdentifiers.has(value)) return true;
  if (isIdLeafPath(path)) return true;
  if (isHrefLeafPath(path)) return true;
  if (isCommandLeafPath(path)) return true;
  if (isOrdinalLeafPath(path)) return true;
  if (isUrlOnlyValue(value)) return true;
  if (allowedUnchangedLeafValues.has(value)) return true;
  return allowedUnchangedLeafPaths.has(unitKey ? `${unitKey}.${path}` : path);
}

function isIdLeafPath(path) {
  return path === "id" || path.endsWith(".id");
}

function isHrefLeafPath(path) {
  return path === "href" || path.endsWith(".href");
}

function isCommandLeafPath(path) {
  return path === "command" || path.includes(".commands[");
}

function isOrdinalLeafPath(path) {
  return path === "number" || path.endsWith(".number");
}

function isUrlOnlyValue(value) {
  return /^https?:\/\/[^\s]+$/.test(value);
}

function assertArrayItemsHaveStableIds(items, label) {
  assert.ok(Array.isArray(items), `${label} should be an array`);
  assert.ok(items.length > 0, `${label} should not be empty`);
  assert.deepEqual(
    items.map((item) => typeof item.id),
    Array.from({ length: items.length }, () => "string"),
    `${label} item ids`,
  );
  assert.equal(
    new Set(items.map((item) => item.id)).size,
    items.length,
    `${label} item ids should be unique`,
  );
}

async function fileExists(path) {
  try {
    await access(resolve(repoRoot, path));
    return true;
  } catch {
    return false;
  }
}

async function assertFileExists(path) {
  assert.equal(await fileExists(path), true, `${path} should exist`);
}

async function assertFileMissing(path) {
  assert.equal(await fileExists(path), false, `${path} should not exist`);
}

async function assertNotFoundRouteSource(path, options = {}) {
  await assertFileExists(path);

  const source = await readFile(resolve(repoRoot, path), "utf8");
  assert.match(source, /from\s+["']next\/navigation["']/, path);
  assert.match(source, /\bnotFound\(\)/, path);

  if (options.simpleRuntimeNotFound) {
    assert.doesNotMatch(source, /\bdynamicParams\b/, path);
    assert.doesNotMatch(source, /\bgenerateStaticParams\b/, path);
  }
}

async function loadStructuredDataModule() {
  try {
    return await import("../src/app/structured-data.ts");
  } catch (error) {
    assert.fail(`structured data helper missing or invalid: ${error.message}`);
  }
}

function renderJsonLd(Component, locale) {
  const html = renderToStaticMarkup(React.createElement(Component, { locale }));
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
    (match) => JSON.parse(match[1]),
  );
}

function schemaByType(schemas, type) {
  const schema = schemas.find((item) => item["@type"] === type);
  assert.ok(schema, `${type} schema should exist`);
  return schema;
}

function assertBreadcrumbItems(schema, expectedItems, label) {
  assert.deepEqual(
    schema.itemListElement.map((item) => item.item),
    expectedItems,
    label,
  );
}

test("app root layouts are split between English and translated locale roots", async () => {
  await assertFileMissing("src/app/layout.tsx");
  await assertFileExists("src/app/root-document.tsx");
  await assertFileExists("src/app/(en)/layout.tsx");
  await assertFileExists("src/app/[locale]/layout.tsx");

  const rootDocumentSource = await readFile(
    resolve(repoRoot, "src/app/root-document.tsx"),
    "utf8",
  );
  assert.match(rootDocumentSource, /<html\b/);
  assert.match(rootDocumentSource, /lang=\{LOCALE_CONFIG\[locale\]\.htmlLang\}/);

  const englishLayoutSource = await readFile(
    resolve(repoRoot, "src/app/(en)/layout.tsx"),
    "utf8",
  );
  assert.match(englishLayoutSource, /<RootDocument\s+locale="en"/);
  assert.match(englishLayoutSource, /buildRootMetadata\("en"\)/);
  assert.match(englishLayoutSource, /export\s+\{\s*viewport\s*\}/);

  const localizedLayoutSource = await readFile(
    resolve(repoRoot, "src/app/[locale]/layout.tsx"),
    "utf8",
  );
  assert.match(localizedLayoutSource, /generateStaticParams/);
  assert.match(localizedLayoutSource, /TRANSLATED_LOCALES/);
  assert.match(localizedLayoutSource, /notFound/);
});

test("Chinese locales keep the Latin display face and use CJK sans glyphs", async () => {
  const source = await readFile(resolve(repoRoot, "src/app/globals.css"), "utf8");

  assert.match(source, /html:lang\(zh-Hant\)/);
  assert.match(source, /html:lang\(zh-Hans\)/);
  assert.match(source, /PingFang TC/);
  assert.match(source, /PingFang SC/);
  assert.match(source, /Microsoft JhengHei/);
  assert.match(source, /Microsoft YaHei/);
  assert.match(source, /Noto Sans TC/);
  assert.match(source, /Noto Sans SC/);
  assert.ok(source.indexOf('"PingFang TC"') < source.indexOf('"Noto Sans TC"'));
  assert.ok(source.indexOf('"PingFang SC"') < source.indexOf('"Noto Sans SC"'));
  assert.match(
    source,
    /html:lang\(zh-Hant\)\s*\{[\s\S]*?--font-serif:\s*var\(--font-fraunces\),\s*var\(--font-cjk-sans-tc\);/,
  );
  assert.match(
    source,
    /html:lang\(zh-Hans\)\s*\{[\s\S]*?--font-serif:\s*var\(--font-fraunces\),\s*var\(--font-cjk-sans-sc\);/,
  );
  assert.doesNotMatch(source, /--font-cjk-serif/);
  assert.doesNotMatch(source, /Songti|PMingLiU|SimSun|Noto Serif/);
});

test("bilingual Wenlan wordmark keeps Latin Fraunces and Chinese sans paired", async () => {
  const wordmarkSource = await readFile(
    resolve(repoRoot, "src/components/brand-wordmark.tsx"),
    "utf8",
  );
  assert.match(wordmarkSource, /function\s+splitBrandLabel/);
  assert.match(wordmarkSource, /brand-wordmark__latin/);
  assert.match(wordmarkSource, /brand-wordmark__divider/);
  assert.match(wordmarkSource, /brand-wordmark__cjk/);
  assert.doesNotMatch(wordmarkSource, /brand-wordmark__latin[^>]*aria-hidden/);
  assert.doesNotMatch(wordmarkSource, /brand-wordmark__cjk[^>]*aria-hidden/);

  const homeSource = await readFile(resolve(repoRoot, "src/app/_pages/home.tsx"), "utf8");
  assert.match(homeSource, /<BrandWordmark\s+label=\{content\.nav\.brand\}\s+variant="nav"\s+\/>/);
  assert.match(homeSource, /\{redesign\.hero\.eyebrow\}/);

  const footerSource = await readFile(resolve(repoRoot, "src/components/site-footer.tsx"), "utf8");
  assert.match(footerSource, /<BrandWordmark\s+label=\{content\.signature\.brand\}\s+variant="footer"\s+\/>/);

  const cssSource = await readFile(resolve(repoRoot, "src/app/globals.css"), "utf8");
  assert.match(cssSource, /--font-brand-latin:\s*var\(--font-fraunces\)/);
  assert.match(cssSource, /\.brand-wordmark__latin\s*{/);
  assert.match(cssSource, /font-variation-settings:\s*"SOFT" 18,\s*"WONK" 0/);
  assert.match(cssSource, /\.brand-wordmark__cjk\s*{/);
  assert.match(cssSource, /\.brand-wordmark--hero \.brand-wordmark__cjk\s*{\s*font-size:\s*0\.8em;\s*translate:\s*0\.04em -0\.04em;\s*}/);
  assert.doesNotMatch(cssSource, /\.brand-wordmark__cjk[\s\S]*Noto Serif/);
  assert.doesNotMatch(cssSource, /\.brand-wordmark__cjk[\s\S]*Songti/);
});

test("home nav exposes a route-preserving locale switcher", async () => {
  const source = await readFile(resolve(repoRoot, "src/app/_pages/home.tsx"), "utf8");
  const switcher = await readFile(resolve(repoRoot, "src/components/language-switcher.tsx"), "utf8");

  assert.match(source, /import \{ LanguageSwitcher \} from "@\/components\/language-switcher"/);
  assert.match(source, /<LanguageSwitcher\s+locale=\{locale\}\s+href="\/"\s+\/>/);
  assert.match(switcher, /SUPPORTED_LOCALES\.map/);
  assert.match(switcher, /localizedHrefForLocale\(targetLocale,\s*href\)/);
  assert.match(switcher, /aria-current=\{active \? "true" : undefined\}/);
  assert.match(switcher, /<details\b/);
  assert.match(switcher, /<summary\b/);
  assert.match(switcher, /hrefLang=\{hreflangByLocale\[targetLocale\]\}/);
  assert.match(switcher, /event\.key !== "Escape"/);
  assert.match(switcher, /removeEventListener\("pointerdown"/);
  assert.doesNotMatch(switcher, /role="menu/);
});

test("root SoftwareApplication JSON-LD keeps English featureList off translated locales", async () => {
  const { locales, routing } = await loadI18nModules();
  const { softwareApplicationSchema } = await loadStructuredDataModule();

  const englishSchema = softwareApplicationSchema("en");
  assert.equal(englishSchema.url, routing.canonicalUrl("en", "/"));
  assert.equal(englishSchema.inLanguage, locales.LOCALE_CONFIG.en.hreflang);
  assert.ok(Array.isArray(englishSchema.featureList), "English featureList");
  assert.match(
    englishSchema.featureList.join("\n"),
    /Hybrid retrieval on libSQL/,
    "English featureList keeps current product proof copy",
  );

  for (const locale of ["zh-TW", "zh-CN"]) {
    const schema = softwareApplicationSchema(locale);

    assert.equal(schema.url, routing.canonicalUrl(locale, "/"), `${locale}.url`);
    assert.equal(
      schema.inLanguage,
      locales.LOCALE_CONFIG[locale].hreflang,
      `${locale}.inLanguage`,
    );
    assert.equal(
      Object.hasOwn(schema, "featureList"),
      false,
      `${locale}.featureList`,
    );
  }
});

test("root document delegates SoftwareApplication schema to the locale-aware helper", async () => {
  const source = await readFile(
    resolve(repoRoot, "src/app/root-document.tsx"),
    "utf8",
  );

  assert.match(source, /softwareApplicationSchema\(locale\)/);
  assert.doesNotMatch(source, /featureList\s*:\s*\[/);
  assert.doesNotMatch(source, /Hybrid retrieval on libSQL/);
});

test("global unmatched-route 404 is explicitly enabled and branded", async () => {
  await assertFileExists("src/app/global-not-found.tsx");

  const nextConfigSource = await readFile(resolve(repoRoot, "next.config.ts"), "utf8");
  assert.match(nextConfigSource, /experimental\s*:\s*{/);
  assert.match(nextConfigSource, /globalNotFound\s*:\s*true/);

  const globalNotFoundSource = await readFile(
    resolve(repoRoot, "src/app/global-not-found.tsx"),
    "utf8",
  );
  assert.match(globalNotFoundSource, /^import\s+["']\.\/globals\.css["'];/m);
  assert.match(globalNotFoundSource, /\sfrom\s+["']next\/font\/google["'];/);
  assert.match(globalNotFoundSource, /<html\b/);
  assert.match(globalNotFoundSource, /<body\b/);
  assert.match(globalNotFoundSource, /lang=(?:"en"|'en'|\{"en"\})/);
  assert.match(globalNotFoundSource, /This page does not exist\./);
});

test("English app routes live under the unprefixed route group", async () => {
  for (const path of [
    "src/app/(en)/page.tsx",
    "src/app/(en)/about/page.tsx",
    "src/app/(en)/download/page.tsx",
    "src/app/(en)/docs/page.tsx",
    "src/app/(en)/docs/get-started/page.tsx",
    "src/app/(en)/docs/[slug]/page.tsx",
    "src/app/(en)/learn/page.tsx",
    "src/app/(en)/learn/[slug]/page.tsx",
    "src/app/(en)/feed.xml/route.ts",
    "src/app/(en)/llms-full.txt/route.ts",
    "src/app/(en)/not-found.tsx",
  ]) {
    await assertFileExists(path);
  }
});

test("localized core page wrappers and shared page modules exist", async () => {
  for (const path of [
    "src/app/_pages/home.tsx",
    "src/app/_pages/about.tsx",
    "src/app/_pages/download.tsx",
    "src/app/_pages/docs-index.tsx",
    "src/app/_pages/get-started.tsx",
    "src/app/_pages/not-found.tsx",
    "src/app/[locale]/page.tsx",
    "src/app/[locale]/about/page.tsx",
    "src/app/[locale]/download/page.tsx",
    "src/app/[locale]/docs/page.tsx",
    "src/app/[locale]/docs/get-started/page.tsx",
    "src/app/[locale]/not-found.tsx",
  ]) {
    await assertFileExists(path);
  }
});

test("localized home hero allows long words to wrap on mobile", async () => {
  const source = await readFile(resolve(repoRoot, "src/app/_pages/home.tsx"), "utf8");

  assert.match(source, /className="[^"]*\bmin-w-0 lg:col-span-6\b[^"]*"/);
  assert.match(source, /className=\{`[^`]*\bbreak-words\b[^`]*`\}/);
});

test("home renders direct localized acquisition links to the core wiki guides", async () => {
  const { HomePage } = await import("../src/app/_pages/home.tsx");
  const expectedByLocale = {
    en: [
      "/learn/distilled-wiki-pages-ai-memory",
      "/learn/source-backed-wiki-pages-ai-work",
    ],
    "zh-TW": [
      "/zh-TW/learn/distilled-wiki-pages-ai-memory",
      "/zh-TW/learn/source-backed-wiki-pages-ai-work",
    ],
    "zh-CN": [
      "/zh-CN/learn/distilled-wiki-pages-ai-memory",
      "/zh-CN/learn/source-backed-wiki-pages-ai-work",
    ],
  };

  for (const [locale, expectedHrefs] of Object.entries(expectedByLocale)) {
    const html = renderToStaticMarkup(React.createElement(HomePage, { locale }));

    for (const href of expectedHrefs) {
      assert.match(html, new RegExp(`href="${href}"`), `${locale}.${href}`);
    }
  }
});

test("localized about hero allows translated text to wrap on mobile", async () => {
  const source = await readFile(resolve(repoRoot, "src/app/_pages/about.tsx"), "utf8");

  assert.match(source, /className="mt-12 grid min-w-0 gap-10/);
  assert.match(source, /<div className="min-w-0">/);
  assert.match(source, /className="[^"]*\bbreak-words\b[^"]*\[overflow-wrap:anywhere\][^"]*"/);
});

test("localized get-started layout allows mobile content columns to shrink", async () => {
  const source = await readFile(resolve(repoRoot, "src/app/_pages/get-started.tsx"), "utf8");

  assert.match(source, /className="min-w-0 space-y-14"/);
  assert.match(source, /className="grid min-w-0 gap-5/);
  assert.match(source, /<div className="min-w-0">/);
  assert.match(source, /<h1 className="[^"]*\bbreak-keep\b[^"]*"/);
});

test("localized untranslated docs slugs hard 404 while the Learn index is translated", async () => {
  await assertNotFoundRouteSource("src/app/[locale]/docs/[slug]/page.tsx", {
    simpleRuntimeNotFound: true,
  });
  const source = await readFile(
    resolve(repoRoot, "src/app/[locale]/learn/page.tsx"),
    "utf8",
  );
  const pageSource = await readFile(
    resolve(repoRoot, "src/app/_pages/localized-learn-index.tsx"),
    "utf8",
  );
  assert.match(source, /generateMetadata/);
  assert.match(source, /LocalizedLearnIndexPage/);
  assert.match(pageSource, /getLocalizedLearnArticles/);
  assert.doesNotMatch(source, /notFound\(\)/);
});

test("built i18n checker treats Mandarin Learn hubs and translated articles as public routes", async () => {
  const source = await readFile(
    resolve(repoRoot, "scripts/i18n-built-check.mjs"),
    "utf8",
  );
  const okRoutes = source.match(/const expectedOkRoutes = \[([\s\S]*?)\];/)?.[1] ?? "";
  const notFoundRoutes =
    source.match(/const expectedNotFoundRoutes = \[([\s\S]*?)\];/)?.[1] ?? "";

  for (const route of [
    "/zh-TW/learn",
    "/zh-CN/learn",
    "/zh-TW/learn/distilled-wiki-pages-ai-memory",
    "/zh-CN/learn/source-backed-wiki-pages-ai-work",
    "/zh-TW/learn/wenlan-vs-obsidian-ai-memory",
    "/zh-CN/learn/wenlan-vs-obsidian-ai-memory",
  ]) {
    assert.match(okRoutes, new RegExp(`"${route}"`), route);
  }
  assert.doesNotMatch(
    notFoundRoutes,
    /"\/zh-CN\/learn\/wenlan-vs-obsidian-ai-memory"/,
  );
  assert.doesNotMatch(
    notFoundRoutes,
    /"\/zh-(?:TW|CN)\/learn",/,
  );
});

test("localized Learn slug route supports per-locale acquisition page availability", async () => {
  const { routing } = await loadI18nModules();
  const source = await readFile(
    resolve(repoRoot, "src/app/[locale]/learn/[slug]/page.tsx"),
    "utf8",
  );

  assert.deepEqual(routing.TRANSLATED_LEARN_PATHS, [
    "/learn/distilled-wiki-pages-ai-memory",
    "/learn/source-backed-wiki-pages-ai-work",
    "/learn/wenlan-vs-obsidian-ai-memory",
    "/learn/build-local-ai-knowledge-base-from-documents",
    "/learn/choose-ai-knowledge-base-tool",
    "/learn/coding-agent-source-backed-knowledge-base",
    "/learn/verify-ai-knowledge-base-citations",
    "/learn/when-ai-agent-should-query-knowledge-base",
    "/learn/fix-pdf-ingestion-ai-knowledge-base",
    "/learn/prevent-multi-agent-knowledge-conflicts",
    "/learn/test-ai-knowledge-base-retrieval-after-changes",
    "/learn/source-backed-research-knowledge-base",
    "/learn/build-client-project-knowledge-base-for-consulting",
    "/learn/build-investment-research-knowledge-base",
    "/learn/build-product-research-knowledge-base-for-prd",
    "/learn/build-sre-incident-knowledge-base",
    "/learn/build-competitive-intelligence-knowledge-base",
    "/learn/build-ict-supplier-due-diligence-evidence-pack",
    "/learn/build-customer-support-answer-knowledge-base",
    "/learn/build-course-wiki-from-lecture-notes",
    "/learn/build-business-metric-definition-knowledge-base",
  ]);
  assert.match(source, /getLocalizedLearnArticle/);
  assert.match(source, /TRANSLATED_LEARN_SLUGS/);
  assert.match(source, /\bnotFound\(\)/);
  assert.doesNotMatch(source, /simpleRuntimeNotFound/);
});

test("localized Learn articles render inspectable official references when provided", async () => {
  const source = await readFile(
    resolve(repoRoot, "src/app/[locale]/learn/[slug]/page.tsx"),
    "utf8",
  );

  assert.match(source, /officialReferences:\s*"官方資料"/);
  assert.match(source, /article\.officialReferences\s*&&/);
  assert.match(source, /article\.officialReferences\.map/);
  assert.match(source, /rel="noopener noreferrer external"/);
});

test("localized Learn article BreadcrumbList uses the localized Learn ancestor", async () => {
  const source = await readFile(
    resolve(repoRoot, "src/app/[locale]/learn/[slug]/page.tsx"),
    "utf8",
  );
  const schemaStart = source.indexOf("const breadcrumbSchema = {");
  const schemaEnd = source.indexOf("\n  return (", schemaStart);
  const breadcrumbSchema = source.slice(schemaStart, schemaEnd);

  assert.notEqual(schemaStart, -1);
  assert.notEqual(schemaEnd, -1);
  assert.match(
    breadcrumbSchema,
    /position:\s*2,[\s\S]*?name:\s*chrome\.learn,[\s\S]*?item:\s*canonicalUrl\(resolvedLocale,\s*"\/learn"\)/,
  );
  assert.doesNotMatch(
    breadcrumbSchema,
    /name:\s*chrome\.learn,[\s\S]*?item:\s*`\$\{SITE_URL\}\/learn`/,
  );
});

test("locale model exposes only the supported app locales and metadata", async () => {
  const { locales } = await loadI18nModules();

  assert.equal(locales.DEFAULT_LOCALE, "en");
  assert.deepEqual(locales.SUPPORTED_LOCALES, ["en", "zh-TW", "zh-CN"]);
  assert.deepEqual(locales.TRANSLATED_LOCALES, ["zh-TW", "zh-CN"]);
  assert.deepEqual(locales.htmlLangByLocale, {
    en: "en",
    "zh-TW": "zh-Hant",
    "zh-CN": "zh-Hans",
  });
  assert.deepEqual(locales.hreflangByLocale, {
    en: "en-US",
    "zh-TW": "zh-TW",
    "zh-CN": "zh-CN",
  });
  assert.deepEqual(locales.openGraphLocaleByLocale, {
    en: "en_US",
    "zh-TW": "zh_TW",
    "zh-CN": "zh_CN",
  });
  assert.equal(locales.isSupportedLocale("zh-TW"), true);
  assert.equal(locales.isSupportedLocale("zh-Hant"), false);
});

test("next-intl routing uses as-needed prefixes without locale detection", async () => {
  const { locales, routingConfig } = await loadI18nModules();

  assert.deepEqual(routingConfig.routing.locales, locales.SUPPORTED_LOCALES);
  assert.equal(routingConfig.routing.defaultLocale, "en");
  assert.deepEqual(routingConfig.routing.localePrefix, {
    mode: "as-needed",
    prefixes: {
      "zh-TW": "/zh-TW",
      "zh-CN": "/zh-CN",
    },
  });
  assert.equal(routingConfig.routing.localeDetection, false);
});

test("localized route helpers keep English canonical and prefix translated core routes", async () => {
  const { routing } = await loadI18nModules();

  assert.equal(routing.SITE_URL, "https://wenlan.app");
  assert.deepEqual(routing.CORE_TRANSLATED_PATHS, [
    "/",
    "/about",
    "/download",
    "/docs",
    "/docs/get-started",
    "/learn",
  ]);
  assert.equal(routing.localizePath("en", "/docs/get-started"), "/docs/get-started");
  assert.equal(routing.localizePath("zh-TW", "/"), "/zh-TW");
  assert.equal(
    routing.localizePath("zh-TW", "/download"),
    "/zh-TW/download",
  );
  assert.equal(
    routing.localizePath("zh-TW", "/docs/get-started"),
    "/zh-TW/docs/get-started",
  );
  assert.equal(routing.localizePath("zh-CN", "/about"), "/zh-CN/about");
  assert.equal(routing.localizePath("zh-TW", "/learn"), "/zh-TW/learn");
  assert.equal(
    routing.localizePath("zh-TW", "/learn/distilled-wiki-pages-ai-memory"),
    "/zh-TW/learn/distilled-wiki-pages-ai-memory",
  );
  assert.equal(
    routing.localizePath("zh-CN", "/learn/source-backed-wiki-pages-ai-work"),
    "/zh-CN/learn/source-backed-wiki-pages-ai-work",
  );
  assert.equal(
    routing.localizePath("zh-TW", "/learn/wenlan-vs-obsidian-ai-memory"),
    "/zh-TW/learn/wenlan-vs-obsidian-ai-memory",
  );
  assert.equal(
    routing.localizePath("zh-CN", "/learn/wenlan-vs-obsidian-ai-memory"),
    "/zh-CN/learn/wenlan-vs-obsidian-ai-memory",
  );
  assert.deepEqual(routing.stripLocalePrefix("/zh-TW/docs/get-started"), {
    locale: "zh-TW",
    pathname: "/docs/get-started",
  });
  assert.deepEqual(
    routing.stripLocalePrefix("/zh-CN/learn/distilled-wiki-pages-ai-memory"),
    {
      locale: "zh-CN",
      pathname: "/learn/distilled-wiki-pages-ai-memory",
    },
  );
  assert.deepEqual(routing.stripLocalePrefix("/docs/get-started"), {
    locale: "en",
    pathname: "/docs/get-started",
  });
  assert.equal(
    routing.canonicalUrl("zh-TW", "/docs/get-started"),
    "https://wenlan.app/zh-TW/docs/get-started",
  );
  assert.equal(routing.canonicalUrl("en", "/"), "https://wenlan.app");
  assert.equal(routing.isTranslatedPath("zh-TW", "/docs/get-started"), true);
  assert.equal(routing.isTranslatedPath("zh-CN", "/download"), true);
  assert.equal(routing.isTranslatedPath("zh-CN", "/about"), true);
  assert.equal(routing.isTranslatedPath("zh-TW", "/learn"), true);
  assert.equal(
    routing.isTranslatedPath("zh-TW", "/learn/distilled-wiki-pages-ai-memory"),
    true,
  );
  assert.equal(
    routing.isTranslatedPath("zh-CN", "/learn/source-backed-wiki-pages-ai-work"),
    true,
  );
  assert.equal(
    routing.isTranslatedPath("zh-TW", "/learn/wenlan-vs-obsidian-ai-memory"),
    true,
  );
  assert.equal(
    routing.isTranslatedPath("zh-CN", "/learn/wenlan-vs-obsidian-ai-memory"),
    true,
  );
  assert.equal(
    routing.isTranslatedPath("zh-TW", "/learn/wenlan-vs-basic-memory"),
    false,
  );
  assert.equal(routing.isTranslatedPath("zh-CN", "/docs/daily-workflow"), false);
});

test("localized navigation helper localizes translated internal hrefs only", async () => {
  const { navigation } = await loadI18nModules();

  assert.equal(navigation.localizedHrefForLocale("zh-TW", "/about"), "/zh-TW/about");
  assert.equal(
    navigation.localizedHrefForLocale("zh-CN", "/download"),
    "/zh-CN/download",
  );
  assert.equal(
    navigation.localizedHrefForLocale("zh-CN", "/docs/get-started?from=nav#install"),
    "/zh-CN/docs/get-started?from=nav#install",
  );
  assert.equal(
    navigation.localizedHrefForLocale("zh-TW", "/learn/distilled-wiki-pages-ai-memory"),
    "/zh-TW/learn/distilled-wiki-pages-ai-memory",
  );
  assert.equal(
    navigation.localizedHrefForLocale("zh-CN", "/learn/source-backed-wiki-pages-ai-work"),
    "/zh-CN/learn/source-backed-wiki-pages-ai-work",
  );
  assert.equal(navigation.localizedHrefForLocale("zh-TW", "/learn"), "/zh-TW/learn");
  assert.equal(
    navigation.localizedHrefForLocale("zh-TW", "https://wenlan.app/docs"),
    "https://wenlan.app/docs",
  );
});

test("alternate URLs are reciprocal and include x-default for core translated paths", async () => {
  const { locales, routing } = await loadI18nModules();

  for (const pathname of routing.CORE_TRANSLATED_PATHS) {
    const alternates = routing.alternateUrls(pathname);

    assert.deepEqual(Object.keys(alternates).sort(), [
      "en-US",
      "x-default",
      "zh-CN",
      "zh-TW",
    ]);
    assert.equal(alternates["x-default"], routing.canonicalUrl("en", pathname));
    assert.equal(alternates["en-US"], routing.canonicalUrl("en", pathname));
    assert.equal(alternates["zh-TW"], routing.canonicalUrl("zh-TW", pathname));
    assert.equal(alternates["zh-CN"], routing.canonicalUrl("zh-CN", pathname));

    for (const locale of locales.SUPPORTED_LOCALES) {
      assert.deepEqual(
        routing.alternateUrls(routing.localizePath(locale, pathname)),
        alternates,
        `${locale} ${pathname}`,
      );
    }
  }

  for (const pathname of routing.TRANSLATED_LEARN_PATHS) {
    const alternates = routing.alternateUrls(pathname);
    const translatedLocales = routing.translatedLocalesForLearnPath(pathname);

    assert.deepEqual(
      Object.keys(alternates).sort(),
      [
        "en-US",
        "x-default",
        ...translatedLocales.map((locale) => locales.hreflangByLocale[locale]),
      ].sort(),
    );
    assert.equal(alternates["x-default"], routing.canonicalUrl("en", pathname));
    assert.equal(alternates["en-US"], routing.canonicalUrl("en", pathname));
    for (const locale of translatedLocales) {
      assert.equal(
        alternates[locales.hreflangByLocale[locale]],
        routing.canonicalUrl(locale, pathname),
      );
    }
  }

  assert.deepEqual(
    routing.alternateUrls("/learn/wenlan-vs-obsidian-ai-memory"),
    {
      "en-US": "https://wenlan.app/learn/wenlan-vs-obsidian-ai-memory",
      "zh-TW":
        "https://wenlan.app/zh-TW/learn/wenlan-vs-obsidian-ai-memory",
      "zh-CN":
        "https://wenlan.app/zh-CN/learn/wenlan-vs-obsidian-ai-memory",
      "x-default":
        "https://wenlan.app/learn/wenlan-vs-obsidian-ai-memory",
    },
  );
});

test("page metadata helper emits localized canonical, alternates, and Open Graph locale", async () => {
  const { content, metadata, routing } = await loadI18nModules();
  assert.equal(typeof metadata.buildPageMetadata, "function");

  const pageMetadata = metadata.buildPageMetadata(
    "zh-TW",
    "/about",
    content.localizedContentByLocale["zh-TW"].about.content.seo,
  );
  const canonical = "https://wenlan.app/zh-TW/about";

  assert.equal(pageMetadata.metadataBase.href, "https://wenlan.app/");
  assert.equal(pageMetadata.alternates.canonical, canonical);
  assert.deepEqual(pageMetadata.alternates.languages, {
    "en-US": "https://wenlan.app/about",
    "zh-TW": canonical,
    "zh-CN": "https://wenlan.app/zh-CN/about",
    "x-default": "https://wenlan.app/about",
  });
  assert.deepEqual(
    pageMetadata.alternates.languages,
    routing.alternateUrls("/about"),
  );
  assert.equal(pageMetadata.openGraph.url, canonical);
  assert.equal(pageMetadata.openGraph.locale, "zh_TW");
});

test("root metadata includes reciprocal alternates for translated home locales", async () => {
  const { metadata, routing } = await loadI18nModules();

  for (const locale of ["zh-TW", "zh-CN"]) {
    const rootMetadata = metadata.buildRootMetadata(locale);

    assert.equal(rootMetadata.alternates.canonical, routing.canonicalUrl(locale, "/"));
    assert.deepEqual(rootMetadata.alternates.languages, routing.alternateUrls("/"));
    assert.deepEqual(Object.keys(rootMetadata.alternates.languages).sort(), [
      "en-US",
      "x-default",
      "zh-CN",
      "zh-TW",
    ]);
  }
});

test("localized Learn metadata emits Mandarin canonical alternates for acquisition pages", async () => {
  const { routing } = await loadI18nModules();
  const localizedLearnSlug = await import("../src/app/[locale]/learn/[slug]/page.tsx");

  assert.equal(typeof localizedLearnSlug.generateStaticParams, "function");
  assert.deepEqual(localizedLearnSlug.generateStaticParams(), [
    { locale: "zh-TW", slug: "distilled-wiki-pages-ai-memory" },
    { locale: "zh-CN", slug: "distilled-wiki-pages-ai-memory" },
    { locale: "zh-TW", slug: "source-backed-wiki-pages-ai-work" },
    { locale: "zh-CN", slug: "source-backed-wiki-pages-ai-work" },
    { locale: "zh-TW", slug: "wenlan-vs-obsidian-ai-memory" },
    { locale: "zh-CN", slug: "wenlan-vs-obsidian-ai-memory" },
    { locale: "zh-TW", slug: "build-local-ai-knowledge-base-from-documents" },
    { locale: "zh-CN", slug: "build-local-ai-knowledge-base-from-documents" },
    { locale: "zh-TW", slug: "choose-ai-knowledge-base-tool" },
    { locale: "zh-CN", slug: "choose-ai-knowledge-base-tool" },
    { locale: "zh-TW", slug: "coding-agent-source-backed-knowledge-base" },
    { locale: "zh-CN", slug: "coding-agent-source-backed-knowledge-base" },
    { locale: "zh-TW", slug: "verify-ai-knowledge-base-citations" },
    { locale: "zh-CN", slug: "verify-ai-knowledge-base-citations" },
    { locale: "zh-TW", slug: "when-ai-agent-should-query-knowledge-base" },
    { locale: "zh-CN", slug: "when-ai-agent-should-query-knowledge-base" },
    { locale: "zh-TW", slug: "fix-pdf-ingestion-ai-knowledge-base" },
    { locale: "zh-CN", slug: "fix-pdf-ingestion-ai-knowledge-base" },
    { locale: "zh-TW", slug: "prevent-multi-agent-knowledge-conflicts" },
    { locale: "zh-CN", slug: "prevent-multi-agent-knowledge-conflicts" },
    {
      locale: "zh-TW",
      slug: "test-ai-knowledge-base-retrieval-after-changes",
    },
    {
      locale: "zh-CN",
      slug: "test-ai-knowledge-base-retrieval-after-changes",
    },
    { locale: "zh-TW", slug: "source-backed-research-knowledge-base" },
    { locale: "zh-CN", slug: "source-backed-research-knowledge-base" },
    {
      locale: "zh-TW",
      slug: "build-client-project-knowledge-base-for-consulting",
    },
    {
      locale: "zh-CN",
      slug: "build-client-project-knowledge-base-for-consulting",
    },
    {
      locale: "zh-TW",
      slug: "build-investment-research-knowledge-base",
    },
    {
      locale: "zh-CN",
      slug: "build-investment-research-knowledge-base",
    },
    {
      locale: "zh-TW",
      slug: "build-product-research-knowledge-base-for-prd",
    },
    {
      locale: "zh-CN",
      slug: "build-product-research-knowledge-base-for-prd",
    },
    {
      locale: "zh-TW",
      slug: "build-sre-incident-knowledge-base",
    },
    {
      locale: "zh-CN",
      slug: "build-sre-incident-knowledge-base",
    },
    {
      locale: "zh-TW",
      slug: "build-competitive-intelligence-knowledge-base",
    },
    {
      locale: "zh-CN",
      slug: "build-competitive-intelligence-knowledge-base",
    },
    {
      locale: "zh-TW",
      slug: "build-ict-supplier-due-diligence-evidence-pack",
    },
    {
      locale: "zh-CN",
      slug: "build-ict-supplier-due-diligence-evidence-pack",
    },
    {
      locale: "zh-TW",
      slug: "build-customer-support-answer-knowledge-base",
    },
    {
      locale: "zh-CN",
      slug: "build-customer-support-answer-knowledge-base",
    },
    {
      locale: "zh-TW",
      slug: "build-course-wiki-from-lecture-notes",
    },
    {
      locale: "zh-CN",
      slug: "build-course-wiki-from-lecture-notes",
    },
    {
      locale: "zh-TW",
      slug: "build-business-metric-definition-knowledge-base",
    },
    {
      locale: "zh-CN",
      slug: "build-business-metric-definition-knowledge-base",
    },
  ]);

  const metadata = await localizedLearnSlug.generateMetadata({
    params: Promise.resolve({
      locale: "zh-TW",
      slug: "distilled-wiki-pages-ai-memory",
    }),
  });

  assert.equal(
    metadata.title,
    "Karpathy LLM Wiki 與 AI 知識庫 | Wenlan",
  );
  assert.equal(
    metadata.alternates.canonical,
    "https://wenlan.app/zh-TW/learn/distilled-wiki-pages-ai-memory",
  );
  assert.deepEqual(
    metadata.alternates.languages,
    routing.alternateUrls("/learn/distilled-wiki-pages-ai-memory"),
  );
  assert.equal(metadata.openGraph.locale, "zh_TW");
  assert.equal(
    metadata.openGraph.url,
    "https://wenlan.app/zh-TW/learn/distilled-wiki-pages-ai-memory",
  );

  const obsidianMetadata = await localizedLearnSlug.generateMetadata({
    params: Promise.resolve({
      locale: "zh-TW",
      slug: "wenlan-vs-obsidian-ai-memory",
    }),
  });
  assert.equal(
    obsidianMetadata.alternates.canonical,
    "https://wenlan.app/zh-TW/learn/wenlan-vs-obsidian-ai-memory",
  );
  assert.deepEqual(
    obsidianMetadata.alternates.languages,
    routing.alternateUrls("/learn/wenlan-vs-obsidian-ai-memory"),
  );

  const zhCNObsidianMetadata = await localizedLearnSlug.generateMetadata({
    params: Promise.resolve({
      locale: "zh-CN",
      slug: "wenlan-vs-obsidian-ai-memory",
    }),
  });
  assert.equal(
    zhCNObsidianMetadata.title,
    "Obsidian + Claude Code：MCP 与 AI 知识库 | Wenlan",
  );
  assert.equal(
    zhCNObsidianMetadata.alternates.canonical,
    "https://wenlan.app/zh-CN/learn/wenlan-vs-obsidian-ai-memory",
  );
  assert.deepEqual(
    zhCNObsidianMetadata.alternates.languages,
    routing.alternateUrls("/learn/wenlan-vs-obsidian-ai-memory"),
  );
});

test("consultant client-project family owns one distinct trilingual engagement workflow", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "build-client-project-knowledge-base-for-consulting";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English consultant client-project article");
  assert.match(english.title, /Client Project Knowledge Base.*Consulting/i);
  assert.match(JSON.stringify(english), /one client|client-scoped/i);
  assert.match(JSON.stringify(english), /decision log|open question/i);
  assert.match(JSON.stringify(english), /handoff/i);
  assert.match(JSON.stringify(english), /sensitive|confidential/i);
  assert.match(
    english.sections.map((section) => section.code?.code ?? "").join("\n"),
    /wenlan sources add[\s\S]*\/distill[\s\S]*\/lint[\s\S]*\/curate/,
  );

  for (const [locale, titlePattern, workflowPattern] of [
    ["zh-TW", /顧問.*客戶專案知識庫/, /一個客戶|單一客戶/],
    ["zh-CN", /咨询.*客户项目知识库/, /一个客户|单一客户/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} consultant client-project article`);
    assert.match(article.title, titlePattern);
    assert.match(JSON.stringify(article), workflowPattern);
    assert.match(JSON.stringify(article), locale === "zh-TW" ? /交接/ : /交接/);
    assert.equal(article.publishedAt, "2026-08-28");
    assert.equal(article.updatedAt, "2026-08-28");
    assert.ok(article.officialReferences?.length >= 4);
  }

  for (const owner of [
    "source-backed-wiki-pages-ai-work",
    "build-local-ai-knowledge-base-from-documents",
    "verify-ai-knowledge-base-citations",
  ]) {
    assert.ok(
      articles.find((article) => article.slug === owner)?.relatedSlugs.includes(slug),
      `${owner} must link to ${slug}`,
    );
    for (const locale of ["zh-TW", "zh-CN"]) {
      assert.ok(
        getLocalizedLearnArticle(locale, owner)?.relatedSlugs.includes(slug),
        `${locale} ${owner} must link to ${slug}`,
      );
    }
  }
});

test("investment-research family owns one distinct trilingual filing-to-thesis workflow", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "build-investment-research-knowledge-base";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English investment-research article");
  assert.match(english.title, /Investment Research Knowledge Base/i);
  assert.match(JSON.stringify(english), /annual report|filing/i);
  assert.match(JSON.stringify(english), /earnings call/i);
  assert.match(JSON.stringify(english), /thesis|open question/i);
  assert.match(JSON.stringify(english), /not investment advice/i);
  assert.match(
    JSON.stringify(english),
    /does not provide|does not fetch|no live market data/i,
  );

  for (const [locale, titlePattern, workflowPattern] of [
    ["zh-TW", /投資研究知識庫|投研知識庫/, /財報|法說會/],
    ["zh-CN", /投资研究知识库|投研知识库/, /财报|公告/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} investment-research article`);
    assert.match(article.title, titlePattern);
    assert.match(JSON.stringify(article), workflowPattern);
    assert.equal(article.publishedAt, "2026-08-28");
    assert.equal(article.updatedAt, "2026-08-28");
    assert.ok(article.officialReferences?.length >= 4);
  }

  for (const owner of [
    "build-local-ai-knowledge-base-from-documents",
    "verify-ai-knowledge-base-citations",
    "source-backed-wiki-pages-ai-work",
  ]) {
    assert.ok(
      articles.find((article) => article.slug === owner)?.relatedSlugs.includes(slug),
      `${owner} must link to ${slug}`,
    );
    for (const locale of ["zh-TW", "zh-CN"]) {
      assert.ok(
        getLocalizedLearnArticle(locale, owner)?.relatedSlugs.includes(slug),
        `${locale} ${owner} must link to ${slug}`,
      );
    }
  }
});

test("product-research family owns one distinct trilingual evidence-to-PRD workflow", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "build-product-research-knowledge-base-for-prd";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English product-research article");
  assert.match(english.title, /Product Research Knowledge Base.*PRD/i);
  assert.match(JSON.stringify(english), /interview notes|support and sales/i);
  assert.match(JSON.stringify(english), /requirement|evidence chain/i);
  assert.match(JSON.stringify(english), /assumption|open question|decision history/i);
  assert.match(JSON.stringify(english), /does not transcribe|does not.*Jira|does not.*roadmap/i);
  assert.match(
    english.sections.map((section) => section.code?.code ?? "").join("\n"),
    /wenlan sources add[\s\S]*\/distill[\s\S]*\/lint[\s\S]*\/curate/,
  );

  for (const [locale, titlePattern, workflowPattern] of [
    ["zh-TW", /產品研究知識庫.*PRD/, /訪談筆記|客服|業務/],
    ["zh-CN", /产品研究知识库.*PRD/, /访谈笔记|客服|销售/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} product-research article`);
    assert.match(article.title, titlePattern);
    assert.match(JSON.stringify(article), workflowPattern);
    assert.match(JSON.stringify(article), /假設|假设/);
    assert.match(JSON.stringify(article), /待解問題|待解问题/);
    assert.equal(article.publishedAt, "2026-08-28");
    assert.equal(article.updatedAt, "2026-09-08");
    assert.ok(article.officialReferences?.length >= 4);
  }

  for (const owner of [
    "build-local-ai-knowledge-base-from-documents",
    "verify-ai-knowledge-base-citations",
    "source-backed-wiki-pages-ai-work",
  ]) {
    assert.ok(
      articles.find((article) => article.slug === owner)?.relatedSlugs.includes(slug),
      `${owner} must link to ${slug}`,
    );
    for (const locale of ["zh-TW", "zh-CN"]) {
      assert.ok(
        getLocalizedLearnArticle(locale, owner)?.relatedSlugs.includes(slug),
        `${locale} ${owner} must link to ${slug}`,
      );
    }
  }
});

test("product-research family carries the reusable product-evidence landing-page contract", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "build-product-research-knowledge-base-for-prd";
  const assetPath = "public/images/product-evidence/wenlan-space-review-fixture.png";
  const renderers = await Promise.all([
    readFile(resolve(repoRoot, "src/app/(en)/learn/[slug]/page.tsx"), "utf8"),
    readFile(resolve(repoRoot, "src/app/[locale]/learn/[slug]/page.tsx"), "utf8"),
  ]);

  for (const [locale, article] of [
    ["en", articles.find((candidate) => candidate.slug === slug)],
    ["zh-TW", getLocalizedLearnArticle("zh-TW", slug)],
    ["zh-CN", getLocalizedLearnArticle("zh-CN", slug)],
  ]) {
    assert.ok(article, `${locale} product-research article`);
    assert.ok(article.productEvidence, `${locale} product evidence`);
    assert.equal(
      article.productEvidence.image.src,
      "/images/product-evidence/wenlan-space-review-fixture.png",
    );
    assert.equal(article.productEvidence.image.width, 1586);
    assert.equal(article.productEvidence.image.height, 992);
    assert.ok(article.productEvidence.image.alt.length >= 30);
    assert.ok(article.productEvidence.image.caption.length >= 40);
    assert.equal(article.productEvidence.workflow.length, 3);
    assert.equal(article.productEvidence.artifactRows.length, 3);
    assert.match(article.productEvidence.action.href, /^#product-evidence$/);
  }

  await access(resolve(repoRoot, assetPath));
  const asset = await readFile(resolve(repoRoot, assetPath));
  assert.equal(asset.includes(Buffer.from("trainedAlgorithmicMedia")), false);
  assert.equal(asset.includes(Buffer.from("OpenAI Media Service API")), false);
  for (const renderer of renderers) {
    assert.match(renderer, /ProductEvidencePanel/);
    assert.match(renderer, /article\.productEvidence/);
  }
  assert.match(renderers[1], /renderText=\{renderArticleText\}/);
});

test("SRE incident family owns one distinct trilingual runbook knowledge task", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "build-sre-incident-knowledge-base";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English SRE incident article");
  assert.match(english.title, /SRE Incident Knowledge Base/i);
  assert.match(JSON.stringify(english), /runbook|postmortem/i);
  assert.match(JSON.stringify(english), /stale|outdated/i);
  assert.match(
    JSON.stringify(english),
    /does not.*monitor|does not.*execute|not an incident-management/i,
  );
  assert.ok(english.productEvidence, "English SRE product evidence");

  for (const [locale, titlePattern, workflowPattern] of [
    ["zh-TW", /SRE.*事故.*知識庫/, /runbook|事故復盤|值班/],
    ["zh-CN", /SRE.*故障.*知识库/, /runbook|故障复盘|值班/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} SRE incident article`);
    assert.match(article.title, titlePattern);
    assert.match(JSON.stringify(article), workflowPattern);
    assert.equal(article.publishedAt, "2026-08-29");
    assert.equal(article.updatedAt, "2026-09-08");
    assert.ok(article.officialReferences?.length >= 4);
    assert.ok(article.productEvidence, `${locale} SRE product evidence`);
    assert.equal(article.productEvidence.workflow.length, 3);
    assert.equal(article.productEvidence.artifactRows.length, 3);
    assert.equal(article.productEvidence.action.href, "#product-evidence");
  }
});

test("coding-agent knowledge-base family owns one distinct trilingual integration task", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "coding-agent-source-backed-knowledge-base";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English coding-agent knowledge-base article");
  assert.match(english.title, /Codex.*Source-Backed Project Knowledge Base/);
  assert.match(english.sections.map((section) => section.heading).join("\n"), /AGENTS\.md.*knowledge base/);
  assert.match(
    english.sections.flatMap((section) => section.body).join("\n"),
    /source of truth/i,
  );
  assert.match(
    english.sections.map((section) => section.code?.code ?? "").join("\n"),
    /wenlan connect codex[\s\S]*wenlan sources add/,
  );
  assert.match(
    english.sections.flatMap((section) => section.body).join("\n"),
    /slash commands below require the Wenlan Codex plugin[\s\S]*connect codex.*MCP connection only/i,
  );

  for (const [locale, titlePattern, sourcePattern] of [
    ["zh-TW", /Codex.*有來源的專案知識庫/, /單一事實來源/],
    ["zh-CN", /Codex.*有来源的项目知识库/, /单一事实来源/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} coding-agent knowledge-base article`);
    assert.match(article.title, titlePattern);
    assert.match(article.sections.flatMap((section) => section.body).join("\n"), sourcePattern);
    assert.match(
      article.sections.map((section) => section.code?.code ?? "").join("\n"),
      /wenlan connect codex[\s\S]*wenlan sources add/,
    );
    assert.equal(article.sections.length, 6);
  }

  const englishInboundOwners = [
    "wenlan-codex-workflow",
    "source-backed-wiki-pages-ai-work",
    "build-local-ai-knowledge-base-from-documents",
  ];
  for (const owner of englishInboundOwners) {
    assert.ok(
      articles.find((article) => article.slug === owner)?.relatedSlugs.includes(slug),
      `${owner} must link to ${slug}`,
    );
  }
  const localizedInboundOwners = [
    "source-backed-wiki-pages-ai-work",
    "build-local-ai-knowledge-base-from-documents",
    "choose-ai-knowledge-base-tool",
  ];
  for (const owner of localizedInboundOwners) {
    for (const locale of ["zh-TW", "zh-CN"]) {
      assert.ok(
        getLocalizedLearnArticle(locale, owner)?.relatedSlugs.includes(slug),
        `${locale} ${owner} must link to ${slug}`,
      );
    }
  }
});

test("citation verification family owns one distinct trilingual diagnostic task", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "verify-ai-knowledge-base-citations";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English citation-verification article");
  assert.match(english.title, /Verify AI Knowledge Base Citations/);
  assert.match(JSON.stringify(english), /wrong page|unsupported claim/i);
  assert.match(JSON.stringify(english), /supported|partial|unsupported|stale/i);
  assert.equal(english.publishedAt, "2026-08-23");
  assert.equal(english.updatedAt, "2026-08-23");

  for (const [locale, titlePattern, evidencePattern] of [
    ["zh-TW", /AI 知識庫引用對不上/, /無依據|過期/],
    ["zh-CN", /AI 知识库引用对不上/, /无依据|过期/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} citation-verification article`);
    assert.match(article.title, titlePattern);
    assert.match(JSON.stringify(article), evidencePattern);
    assert.equal(article.publishedAt, "2026-08-23");
    assert.equal(article.updatedAt, "2026-08-23");
    assert.ok(article.officialReferences?.length >= 4);
  }

  const inboundOwners = [
    "source-backed-wiki-pages-ai-work",
    "choose-ai-knowledge-base-tool",
    "distilled-wiki-pages-ai-memory",
  ];
  for (const owner of inboundOwners) {
    assert.ok(
      articles.find((article) => article.slug === owner)?.relatedSlugs.includes(slug),
      `${owner} must link to ${slug}`,
    );
    for (const locale of ["zh-TW", "zh-CN"]) {
      assert.ok(
        getLocalizedLearnArticle(locale, owner)?.relatedSlugs.includes(slug),
        `${locale} ${owner} must link to ${slug}`,
      );
    }
  }
});

test("retrieval regression family owns one distinct trilingual before-and-after task", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "test-ai-knowledge-base-retrieval-after-changes";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English retrieval-regression article");
  assert.match(english.title, /Regression-Test AI Knowledge Base Retrieval/);
  assert.match(JSON.stringify(english), /golden query set|expected source/i);
  assert.match(JSON.stringify(english), /Recall@k|MRR|no-answer/i);
  assert.match(JSON.stringify(english), /detects drift, not correctness/i);
  assert.match(JSON.stringify(english), /not a released.*wenlan eval/i);
  assert.equal(english.publishedAt, "2026-08-26");
  assert.equal(english.updatedAt, "2026-08-26");

  for (const [locale, titlePattern, workflowPattern] of [
    ["zh-TW", /AI 知識庫改版後.*RAG 檢索回歸測試/, /黃金資料集|預期來源/],
    ["zh-CN", /AI 知识库改版后.*RAG 召回回归测试/, /黄金评测集|预期来源/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} retrieval-regression article`);
    assert.match(article.title, titlePattern);
    assert.match(JSON.stringify(article), workflowPattern);
    assert.match(JSON.stringify(article), /Recall@k|MRR/);
    assert.equal(article.publishedAt, "2026-08-26");
    assert.equal(article.updatedAt, "2026-08-26");
    assert.ok(article.officialReferences?.length >= 4);
  }

  for (const owner of [
    "verify-ai-knowledge-base-citations",
    "source-backed-wiki-pages-ai-work",
    "choose-ai-knowledge-base-tool",
  ]) {
    assert.ok(
      articles.find((article) => article.slug === owner)?.relatedSlugs.includes(slug),
      `${owner} must link to ${slug}`,
    );
    for (const locale of ["zh-TW", "zh-CN"]) {
      assert.ok(
        getLocalizedLearnArticle(locale, owner)?.relatedSlugs.includes(slug),
        `${locale} ${owner} must link to ${slug}`,
      );
    }
  }
});

test("research knowledge-base family owns one bounded trilingual paper workflow", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "source-backed-research-knowledge-base";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English research knowledge-base article");
  assert.match(english.title, /Research Knowledge Base.*Papers.*PDFs/i);
  assert.match(JSON.stringify(english), /literature matrix/i);
  assert.match(JSON.stringify(english), /contradiction/i);
  assert.match(JSON.stringify(english), /limitation/i);
  assert.match(JSON.stringify(english), /text-extractable/i);
  assert.doesNotMatch(JSON.stringify(english), /Wenlan (searches|discovers) papers/i);

  for (const [locale, titlePattern, workflowPattern] of [
    ["zh-TW", /論文.*研究知識庫/, /文獻矩陣/],
    ["zh-CN", /论文.*研究知识库/, /文献矩阵/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} research knowledge-base article`);
    assert.match(article.title, titlePattern);
    assert.match(JSON.stringify(article), workflowPattern);
    assert.match(JSON.stringify(article), locale === "zh-TW" ? /矛盾|限制/ : /矛盾|局限/);
    assert.ok(article.officialReferences?.length >= 4);
  }

  for (const owner of [
    "build-local-ai-knowledge-base-from-documents",
    "verify-ai-knowledge-base-citations",
    "source-backed-wiki-pages-ai-work",
  ]) {
    const englishOwner = articles.find((article) => article.slug === owner);
    assert.ok(
      englishOwner?.relatedSlugs.includes(slug),
      `${owner} must link to ${slug}`,
    );
    assert.equal(
      new Set(englishOwner.relatedSlugs).size,
      englishOwner.relatedSlugs.length,
      `${owner} relatedSlugs must be unique`,
    );
    for (const locale of ["zh-TW", "zh-CN"]) {
      const localizedOwner = getLocalizedLearnArticle(locale, owner);
      assert.ok(
        localizedOwner?.relatedSlugs.includes(slug),
        `${locale} ${owner} must link to ${slug}`,
      );
      assert.equal(
        new Set(localizedOwner.relatedSlugs).size,
        localizedOwner.relatedSlugs.length,
        `${locale} ${owner} relatedSlugs must be unique`,
      );
    }
  }
});

test("knowledge retrieval policy family owns one audience-trigger-task-outcome intent", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "when-ai-agent-should-query-knowledge-base";
  const english = articles.find((article) => article.slug === slug);
  const scenarioBacklog = JSON.parse(
    await readFile(resolve(repoRoot, "docs/seo-scenario-backlog.json"), "utf8"),
  );
  const scenario = scenarioBacklog.families.find(
    (family) => family.id === "knowledge-retrieval-context-token-cost",
  );

  assert.deepEqual(
    {
      audience: scenario.audience,
      trigger: scenario.trigger,
      userTask: scenario.userTask,
      desiredOutcome: scenario.desiredOutcome,
    },
    {
      audience:
        "Developers operating AI agents over large documentation sets that are consulted repeatedly across tasks or sessions",
      trigger:
        "The agent repeatedly reloads the same raw documents, consumes too much context, or retrieves knowledge even when the authoritative file is already available",
      userTask:
        "Decide when an AI agent should query a knowledge base and reduce repeated document context or token cost",
      desiredOutcome:
        "Use a clear retrieval policy that opens exact sources only when needed, avoids redundant context, and never treats token savings as permission to skip authoritative evidence",
    },
  );

  assert.ok(english, "English retrieval-policy article");
  assert.match(english.title, /When Should an AI Agent Query a Knowledge Base/);
  assert.match(JSON.stringify(english), /Query|Skip retrieval|Pre-retrieve|Progressive disclosure/);
  assert.match(JSON.stringify(english), /does not guarantee lower token cost|do not reuse another system's savings percentage/i);
  assert.equal(english.publishedAt, "2026-08-23");
  assert.ok(english.officialReferences?.length >= 5);

  for (const [locale, titlePattern, policyPattern] of [
    ["zh-TW", /AI Agent 何時該查知識庫/, /預先檢索|略過檢索|漸進揭露/],
    ["zh-CN", /AI Agent 何时该查知识库/, /预检索|跳过检索|渐进披露/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} retrieval-policy article`);
    assert.match(article.title, titlePattern);
    assert.match(JSON.stringify(article), policyPattern);
    assert.match(JSON.stringify(article), /Token/);
    assert.equal(article.sections.length, 4);
    assert.ok(article.officialReferences?.length >= 5);
  }

  const [{ default: EnglishPage }, { default: LocalizedPage }] = await Promise.all([
    import("../src/app/(en)/learn/[slug]/page.tsx"),
    import("../src/app/[locale]/learn/[slug]/page.tsx"),
  ]);
  const rendered = {
    en: renderToStaticMarkup(
      await EnglishPage({ params: Promise.resolve({ slug }) }),
    ),
    "zh-TW": renderToStaticMarkup(
      await LocalizedPage({
        params: Promise.resolve({ locale: "zh-TW", slug }),
      }),
    ),
    "zh-CN": renderToStaticMarkup(
      await LocalizedPage({
        params: Promise.resolve({ locale: "zh-CN", slug }),
      }),
    ),
  };

  assert.match(rendered.en, /Developers operating AI agents over documentation/);
  assert.match(rendered.en, /repeatedly loading irrelevant documents|Always injecting a document collection/);
  assert.match(rendered.en, /Use this query-or-skip decision policy/);
  assert.match(rendered.en, /open the smallest exact passage needed/);
  assert.match(rendered.en, /slash-command example requires the Wenlan Codex plugin/);
  assert.match(rendered.en, /MCP-only clients should call Wenlan recall/);
  assert.match(rendered.en, /wenlan pages &lt;topic&gt;/);
  assert.match(rendered["zh-TW"], /反覆把無關文件塞進上下文|每輪強制注入整批文件/);
  assert.match(rendered["zh-TW"], /查詢或略過清單/);
  assert.match(rendered["zh-TW"], /確切引用|確切權威檔案/);
  assert.match(rendered["zh-TW"], /需要先安裝 Wenlan Codex plugin/);
  assert.match(rendered["zh-TW"], /Wenlan recall 並檢查它回傳的 Page/);
  assert.match(rendered["zh-TW"], /wenlan pages &lt;主題&gt;/);
  assert.match(rendered["zh-CN"], /反复把无关文档塞进上下文|每轮强制注入整批文件/);
  assert.match(rendered["zh-CN"], /查询或跳过清单/);
  assert.match(rendered["zh-CN"], /准确引用|准确权威文件/);
  assert.match(rendered["zh-CN"], /需要先安装 Wenlan Codex plugin/);
  assert.match(rendered["zh-CN"], /Wenlan recall 并检查它返回的 Page/);
  assert.match(rendered["zh-CN"], /wenlan pages &lt;主题&gt;/);

  for (const owner of [
    "source-backed-wiki-pages-ai-work",
    "coding-agent-source-backed-knowledge-base",
    "verify-ai-knowledge-base-citations",
  ]) {
    assert.ok(
      articles.find((article) => article.slug === owner)?.relatedSlugs.includes(slug),
      `${owner} must link to ${slug}`,
    );
    for (const locale of ["zh-TW", "zh-CN"]) {
      assert.ok(
        getLocalizedLearnArticle(locale, owner)?.relatedSlugs.includes(slug),
        `${locale} ${owner} must link to ${slug}`,
      );
    }
  }
});

test("Mandarin Obsidian guides own the Claude Code, MCP, and AI knowledge-base intent", async () => {
  const { getLocalizedLearnArticle } = await import("../src/i18n/learn-articles.ts");

  for (const [locale, script] of [
    ["zh-TW", "traditional"],
    ["zh-CN", "simplified"],
  ]) {
    const article = getLocalizedLearnArticle(locale, "wenlan-vs-obsidian-ai-memory");
    assert.ok(article, `${locale} article`);
    assert.match(article.title, /Obsidian \+ Claude Code/);
    assert.match(article.title, script === "traditional" ? /AI 知識庫/ : /AI 知识库/);
    assert.equal(
      article.publishedAt,
      locale === "zh-TW" ? "2026-07-22" : "2026-08-01",
    );
    assert.equal(article.updatedAt, "2026-08-01");
    assert.ok(article.keywords.includes("Obsidian MCP"));
    assert.equal(article.sections.length, 6);

    const articleText = JSON.stringify(article);
    for (const expected of [
      "read-only Source",
      "IDE bridge",
      "MCP",
      "provenance",
      "/distill",
      "/pages",
      "/lint",
      "Roasbeef/obsidian-claude-code",
      "petersolopov/obsidian-claude-ide",
      "iansinnott/obsidian-claude-code-mcp",
    ]) {
      assert.match(articleText, new RegExp(expected.replaceAll("/", "\\/")), `${locale}: ${expected}`);
    }
  }
});

test("zh-TW LLM Wiki guide owns the Karpathy v2 and AI knowledge-base intent", async () => {
  const { getLocalizedLearnArticle } = await import("../src/i18n/learn-articles.ts");
  const article = getLocalizedLearnArticle(
    "zh-TW",
    "distilled-wiki-pages-ai-memory",
  );

  assert.ok(article);
  assert.match(article.title, /Karpathy LLM Wiki/);
  assert.match(article.title, /AI 知識庫/);
  assert.match(article.metaTitle, /Karpathy LLM Wiki/);
  assert.match(article.metaTitle, /AI 知識庫/);
  assert.equal(article.publishedAt, "2026-07-04");
  assert.equal(article.updatedAt, "2026-09-08");
  assert.match(article.sections[0].heading, /Karpathy LLM Wiki/);
  assert.match(JSON.stringify(article), /不代表 Karpathy 為 Wenlan 背書/);
  assert.ok(article.keywords.includes("AI 知識庫"));
  assert.ok(article.keywords.includes("本地 AI 知識庫"));
  assert.ok(article.keywords.includes("RAG vs LLM Wiki"));

  const headings = article.sections.map((section) => section.heading);
  assert.equal(headings.length, 11);
  assert.ok(headings.includes("LLM Wiki 知識庫和 RAG 有什麼不同"));
  assert.ok(headings.includes("如何搭建會持續更新的 AI 知識庫"));
  assert.ok(headings.includes("如何驗證知識庫真的可用"));
  assert.ok(headings.includes("一份最小可用的 LLM Wiki Schema"));
  assert.ok(headings.includes("正式使用前的最小驗收測試"));

  const articleText = JSON.stringify(article);
  for (const expected of [
    "Ingest",
    "Query",
    "Lint",
    "/brief",
    "/recall",
    "/capture",
    "/handoff",
    "/distill",
    "/pages",
    "source IDs",
    "Karpathy",
    "LLM Wiki v2",
    "CLAUDE.md",
    "AGENTS.md",
    "按需載入",
    "不可變來源邊界",
    "Wenlan 不要求使用者自訂 Page schema",
  ]) {
    assert.match(articleText, new RegExp(expected.replace("/", "\\/")));
  }
});

test("zh-CN LLM wiki guide owns the AI knowledge-base search intent", async () => {
  const { getLocalizedLearnArticle } = await import("../src/i18n/learn-articles.ts");
  const article = getLocalizedLearnArticle(
    "zh-CN",
    "distilled-wiki-pages-ai-memory",
  );

  assert.ok(article);
  assert.match(article.title, /Karpathy LLM Wiki/);
  assert.match(article.metaTitle, /AI 知识库/);
  assert.equal(article.publishedAt, "2026-07-04");
  assert.equal(article.updatedAt, "2026-09-08");
  assert.match(article.sections[0].heading, /Karpathy LLM Wiki/);
  assert.match(JSON.stringify(article), /不代表 Karpathy 为 Wenlan 背书/);
  assert.ok(article.keywords.includes("AI 知识库"));
  assert.ok(article.keywords.includes("本地 AI 知识库"));
  assert.ok(article.keywords.includes("RAG vs LLM Wiki"));

  const headings = article.sections.map((section) => section.heading);
  assert.ok(headings.includes("LLM Wiki 知识库和 RAG 有什么不同"));
  assert.ok(headings.includes("如何搭建一个会持续更新的 AI 知识库"));
  assert.ok(headings.includes("一份最小可用的 LLM Wiki Schema"));
  assert.ok(headings.includes("正式使用前的最小验收测试"));

  const articleText = JSON.stringify(article);
  for (const expected of [
    "Ingest",
    "Query",
    "Lint",
    "/distill",
    "source IDs",
    "CLAUDE.md",
    "AGENTS.md",
    "按需加载",
    "不可变来源边界",
    "Wenlan 不要求用户自定义 Page schema",
  ]) {
    assert.match(articleText, new RegExp(expected.replace("/", "\\/")));
  }
});

test("localized Learn hubs and source-backed pages lead with AI knowledge-base intent", async () => {
  const { localizedLearnIndexContent } = await import(
    "../src/i18n/learn-index.ts"
  );
  const { getLocalizedLearnArticle } = await import(
    "../src/i18n/learn-articles.ts"
  );

  assert.match(localizedLearnIndexContent["zh-TW"].seo.title, /AI 知識庫/);
  assert.match(localizedLearnIndexContent["zh-TW"].title, /LLM Wiki.*AI 知識庫/);
  assert.ok(localizedLearnIndexContent["zh-TW"].topics.includes("AI 知識庫"));
  assert.match(localizedLearnIndexContent["zh-CN"].seo.title, /AI 知识库/);
  assert.match(localizedLearnIndexContent["zh-CN"].title, /LLM Wiki.*AI 知识库/);
  assert.ok(localizedLearnIndexContent["zh-CN"].topics.includes("AI 知识库"));

  const expectations = {
    "zh-TW": {
      title: "有來源的 AI 知識庫：來源、更新與審查方法",
      keyword: "AI 知識庫",
      workflow: "Wenlan 的實際工作流程",
      verification: "如何驗收 AI 知識庫",
    },
    "zh-CN": {
      title: "有来源的 AI 知识库：来源、更新与审核方法",
      keyword: "AI 知识库",
      workflow: "Wenlan 的实际工作流程",
      verification: "如何验收 AI 知识库",
    },
  };

  for (const [locale, expected] of Object.entries(expectations)) {
    const article = getLocalizedLearnArticle(
      locale,
      "source-backed-wiki-pages-ai-work",
    );
    assert.ok(article);
    assert.equal(article.title, expected.title);
    assert.equal(article.publishedAt, "2026-07-04");
    assert.equal(article.updatedAt, "2026-09-08");
    assert.ok(article.keywords.includes(expected.keyword));
    const headings = article.sections.map((section) => section.heading);
    assert.ok(headings.includes(expected.workflow));
    assert.ok(headings.includes(expected.verification));
    assert.ok(article.officialReferences?.length >= 3);
    const articleText = JSON.stringify(article);
    for (const command of ["/capture", "/distill", "/pages", "/lint", "/curate"]) {
      assert.match(articleText, new RegExp(command.replace("/", "\\/")));
    }
  }
});

test("localized document-to-knowledge-base guides keep supported source boundaries", async () => {
  const { getLocalizedLearnArticle } = await import(
    "../src/i18n/learn-articles.ts"
  );
  const expectations = {
    "zh-TW": {
      title: "如何用 Markdown、PDF 與 Obsidian 建立本地 AI 知識庫",
      keyword: "建立 AI 知識庫",
      unsupportedPdf: "掃描型 PDF",
    },
    "zh-CN": {
      title: "如何用 Markdown、PDF 与 Obsidian 建立本地 AI 知识库",
      keyword: "搭建 AI 知识库",
      unsupportedPdf: "扫描型 PDF",
    },
  };

  for (const [locale, expected] of Object.entries(expectations)) {
    const article = getLocalizedLearnArticle(
      locale,
      "build-local-ai-knowledge-base-from-documents",
    );
    assert.ok(article);
    assert.equal(article.title, expected.title);
    assert.equal(article.publishedAt, "2026-08-01");
    assert.equal(article.updatedAt, "2026-08-01");
    assert.ok(article.keywords.includes(expected.keyword));
    assert.match(JSON.stringify(article), /wenlan sources add/);
    assert.match(JSON.stringify(article), /\.md/);
    assert.match(JSON.stringify(article), /\.txt/);
    assert.match(JSON.stringify(article), /\.pdf/);
    assert.match(JSON.stringify(article), new RegExp(expected.unsupportedPdf));
    assert.ok(article.officialReferences?.length >= 3);
  }
});

test("English document-to-knowledge-base guide owns the implementation gap", async () => {
  const { getArticle } = await import("../src/app/(en)/learn/articles.ts");
  const article = getArticle("build-local-ai-knowledge-base-from-documents");

  assert.ok(article);
  assert.equal(
    article.title,
    "How to Build a Local AI Knowledge Base from Markdown, PDFs, and Obsidian",
  );
  assert.equal(article.publishedAt, "2026-08-01");
  assert.equal(article.updatedAt, "2026-08-01");
  assert.ok(article.keywords.includes("AI knowledge base builder"));
  const text = JSON.stringify(article);
  assert.match(text, /wenlan sources add/);
  assert.match(text, /Image-only or scanned PDFs need OCR/);
  assert.match(text, /do not ingest arbitrary source-code files/);
  assert.match(article.cta.heading, /knowledge-base loop/);
  assert.ok(article.officialReferences?.length >= 3);
});

test("PDF ingestion troubleshooting guide owns a distinct three-locale diagnostic task", async () => {
  const { getArticle } = await import("../src/app/(en)/learn/articles.ts");
  const { getLocalizedLearnArticle } = await import(
    "../src/i18n/learn-articles.ts"
  );
  const slug = "fix-pdf-ingestion-ai-knowledge-base";
  const english = getArticle(slug);

  assert.ok(english);
  assert.equal(
    english.title,
    "PDF Failed to Ingest into Your AI Knowledge Base? Diagnose It First",
  );
  assert.equal(english.publishedAt, "2026-08-23");
  assert.equal(english.updatedAt, "2026-08-23");
  assert.ok(english.keywords.includes("AI knowledge base PDF ingestion failed"));
  assert.match(JSON.stringify(english), /10 MB/);
  assert.match(JSON.stringify(english), /no OCR in v1/);
  assert.match(JSON.stringify(english), /wenlan sources add/);
  assert.match(JSON.stringify(english), /found, ingested, skipped, and error/);
  assert.ok(english.officialReferences?.length >= 5);

  const expectations = {
    "zh-TW": {
      title: "AI 知識庫匯入 PDF 失敗？先判斷掃描檔、文字層與解析錯誤",
      keyword: "AI 知識庫 PDF 匯入失敗",
      scan: "掃描型 PDF",
      error: "解析錯誤",
    },
    "zh-CN": {
      title: "AI 知识库导入 PDF 失败？先判断扫描件、文本层与解析错误",
      keyword: "AI 知识库 PDF 导入失败",
      scan: "扫描型 PDF",
      error: "解析错误",
    },
  };

  for (const [locale, expected] of Object.entries(expectations)) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article);
    assert.equal(article.title, expected.title);
    assert.equal(article.publishedAt, "2026-08-23");
    assert.equal(article.updatedAt, "2026-08-23");
    assert.ok(article.keywords.includes(expected.keyword));
    assert.match(JSON.stringify(article), new RegExp(expected.scan));
    assert.match(JSON.stringify(article), new RegExp(expected.error));
    assert.match(JSON.stringify(article), /wenlan sources add/);
    assert.ok(article.officialReferences?.length >= 5);
  }
});

test("multi-agent knowledge conflict guide owns a distinct three-locale maintenance task", async () => {
  const { getArticle } = await import("../src/app/(en)/learn/articles.ts");
  const { getLocalizedLearnArticle } = await import(
    "../src/i18n/learn-articles.ts"
  );
  const slug = "prevent-multi-agent-knowledge-conflicts";
  const english = getArticle(slug);

  assert.ok(english);
  assert.equal(
    english.title,
    "How to Prevent Multi-Agent Knowledge Conflicts and Stale Conclusions",
  );
  assert.equal(english.publishedAt, "2026-08-24");
  assert.equal(english.updatedAt, "2026-08-24");
  assert.ok(english.keywords.includes("multi agent shared knowledge conflict"));
  assert.match(JSON.stringify(english), /candidate claim/);
  assert.match(JSON.stringify(english), /accepted shared knowledge/);
  assert.match(JSON.stringify(english), /expected version/);
  assert.match(
    JSON.stringify(english),
    /current public MCP `write_page` does not accept `expected_version`/,
  );
  assert.match(JSON.stringify(english), /Codex plugin/);
  assert.match(JSON.stringify(english), /local MCP/);
  assert.match(JSON.stringify(english), /wenlan pages/);
  assert.match(JSON.stringify(english), /optional reconcile pass/);
  assert.ok(english.officialReferences?.length >= 5);

  const expectations = {
    "zh-TW": {
      title: "多個 AI Agent 共用知識衝突？避免覆寫與過期結論",
      keyword: "多個 AI Agent 共用知識衝突",
      candidate: "候選主張",
      stale: "過期結論",
      localMcp: "本機 MCP",
    },
    "zh-CN": {
      title: "多智能体共享知识冲突？避免覆盖与过期结论",
      keyword: "多智能体共享知识冲突",
      candidate: "候选主张",
      stale: "过期结论",
      localMcp: "本地 MCP",
    },
  };

  for (const [locale, expected] of Object.entries(expectations)) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article);
    assert.equal(article.title, expected.title);
    assert.equal(article.publishedAt, "2026-08-24");
    assert.equal(article.updatedAt, "2026-08-24");
    assert.ok(article.keywords.includes(expected.keyword));
    assert.match(JSON.stringify(article), new RegExp(expected.candidate));
    assert.match(JSON.stringify(article), new RegExp(expected.stale));
    assert.match(JSON.stringify(article), /Codex plugin/);
    assert.match(JSON.stringify(article), new RegExp(expected.localMcp));
    assert.match(JSON.stringify(article), /wenlan pages/);
    assert.match(JSON.stringify(article), /不接受 `expected_version`/);
    assert.match(JSON.stringify(article), /\/lint/);
    assert.match(JSON.stringify(article), /\/curate/);
    assert.ok(article.officialReferences?.length >= 5);
  }
});

test("AI knowledge-base tool-selection guide is available in all acquisition locales", async () => {
  const { getArticle } = await import("../src/app/(en)/learn/articles.ts");
  const { getLocalizedLearnArticle } = await import(
    "../src/i18n/learn-articles.ts"
  );
  const english = getArticle("choose-ai-knowledge-base-tool");

  assert.ok(english);
  assert.equal(
    english.title,
    "How to Choose an AI Knowledge Base Tool: 8 Tests That Matter",
  );
  assert.equal(english.publishedAt, "2026-08-02");
  assert.equal(english.updatedAt, "2026-09-07");
  assert.ok(english.keywords.includes("AI knowledge base tools"));
  assert.equal(english.heroBullets.length, 3);
  assert.equal(english.sections[2]?.bullets?.length, 8);
  assert.match(JSON.stringify(english), /Source traceability/);
  assert.match(JSON.stringify(english), /Acceptance test/);
  assert.match(JSON.stringify(english), /wenlan sources add/);
  assert.ok(english.officialReferences?.length >= 5);

  const expectations = {
    "zh-TW": {
      title: "如何選 AI 知識庫工具：8 個真正重要的檢查",
      keyword: "AI 知識庫工具",
      source: "來源可追溯",
      review: "衝突與審查",
    },
    "zh-CN": {
      title: "如何选 AI 知识库工具：8 个真正重要的检查",
      keyword: "AI 知识库工具",
      source: "来源可追溯",
      review: "冲突与审核",
    },
  };

  for (const [locale, expected] of Object.entries(expectations)) {
    const article = getLocalizedLearnArticle(
      locale,
      "choose-ai-knowledge-base-tool",
    );
    assert.ok(article);
    assert.equal(article.title, expected.title);
    assert.equal(article.publishedAt, "2026-08-02");
    assert.equal(article.updatedAt, "2026-09-07");
    assert.ok(article.keywords.includes(expected.keyword));
    const text = JSON.stringify(article);
    assert.match(text, new RegExp(expected.source));
    assert.match(text, new RegExp(expected.review));
    assert.match(text, /wenlan sources add/);
    assert.match(text, /Claude Code/);
    assert.match(text, /Codex/);
    assert.match(text, /ChatGPT/);
    assert.ok(article.officialReferences?.length >= 5);
  }
});

test("localized Learn renderer exposes article code blocks", async () => {
  const source = await readFile(
    resolve(repoRoot, "src/app/[locale]/learn/[slug]/page.tsx"),
    "utf8",
  );

  assert.match(source, /\{section\.code && \(/);
  assert.match(source, /\{section\.code\.label\}/);
  assert.match(source, /<code>\{section\.code\.code\}<\/code>/);
  assert.match(source, /\[word-break:keep-all\]/);
});

test("localized acquisition copy keeps CJK semantic phrases together on mobile", async () => {
  const source = await readFile(
    resolve(repoRoot, "src/app/[locale]/learn/[slug]/page.tsx"),
    "utf8",
  );

  const protectedHeadings = source.match(/<h2 className="[^"]*\[word-break:keep-all\][^"]*\[overflow-wrap:break-word\][^"]*"/g) ?? [];
  assert.equal(protectedHeadings.length, 2);
  assert.match(
    source,
    /split\(\/\(Karpathy LLM Wiki：\|課程 Wiki\|课程 Wiki\|課堂講義\|课程讲义\|先備知識\|前置知识\|指標定義\|指标定义\|資料字典\|数据字典\|來源修訂\|来源修订\|供應商盡職調查\|供应商尽职调查\|證據包\|证据包\|複審\|复审\|SRE 事故知識庫\|SRE 故障知识库\|與事故復盤\|与故障复盘\|事故復盤\|故障复盘\|客戶專案知識庫\|客户项目知识库\|競品檔案\|竞品档案\|顧問案\|咨询项目\|研究知識庫\|研究知识库\|產品研究\|产品研究\|產品決策\|产品决策\|論文 PDF\|论文 PDF\|文獻矩陣\|文献矩阵\|AI 知識庫\|AI 知识库\|客服答案知識庫\|客服答案知识库\|知識庫\|知识库\|驗收資料\|验收资料\|證據\|证据\|追溯\|8 項\|8 项\|來源\|来源\|記什麼？\|记录什么？\|不可承諾\|不可承诺\|禁止承诺\|轉人工\|转人工\)\/g\)/,
  );
  assert.match(
    source,
    /<h1 className="[^"]*\[overflow-wrap:anywhere\][^"]*\[word-break:normal\][^"]*sm:\[overflow-wrap:break-word\][^"]*sm:\[word-break:keep-all\][^"]*"/,
  );
  assert.match(
    source,
    /article\.slug === "wenlan-vs-obsidian-ai-memory"[\s\S]*article\.slug === "distilled-wiki-pages-ai-memory"[\s\S]*article\.slug === "choose-ai-knowledge-base-tool"[\s\S]*article\.slug === "test-ai-knowledge-base-retrieval-after-changes"[\s\S]*article\.slug === "coding-agent-source-backed-knowledge-base"[\s\S]*article\.slug === "source-backed-research-knowledge-base"[\s\S]*article\.slug === "build-client-project-knowledge-base-for-consulting"[\s\S]*article\.slug === "build-sre-incident-knowledge-base"/,
  );
  assert.ok((source.match(/\{renderArticleText\(/g)?.length ?? 0) >= 12);
  assert.match(source, /<span className="min-w-0">\{renderArticleText\(faq\.question\)\}<\/span>/);
});

test("Learn article hero grids use shrinkable mobile tracks", async () => {
  for (const relativePath of [
    "src/app/(en)/learn/[slug]/page.tsx",
    "src/app/[locale]/learn/[slug]/page.tsx",
  ]) {
    const source = await readFile(resolve(repoRoot, relativePath), "utf8");

    assert.match(
      source,
      /className="mt-12 grid min-w-0 grid-cols-\[minmax\(0,1fr\)\] gap-10 lg:grid-cols-\[minmax\(0,1fr\)_320px\]/,
      `${relativePath} must not let the implicit mobile grid track expand past 393px`,
    );
    assert.match(
      source,
      /className="grid min-w-0 grid-cols-\[minmax\(0,1fr\)\] gap-4 md:grid-cols-3"/,
      `${relativePath} hero bullets must remain shrinkable on mobile`,
    );
  }
});

test("core route wrappers export localized metadata for translated pages", async () => {
  const { routing } = await loadI18nModules();
  const routeModules = [
    {
      pathname: "/",
      english: await import("../src/app/(en)/page.tsx"),
      localized: await import("../src/app/[locale]/page.tsx"),
    },
    {
      pathname: "/about",
      english: await import("../src/app/(en)/about/page.tsx"),
      localized: await import("../src/app/[locale]/about/page.tsx"),
    },
    {
      pathname: "/download",
      english: await import("../src/app/(en)/download/page.tsx"),
      localized: await import("../src/app/[locale]/download/page.tsx"),
    },
    {
      pathname: "/docs",
      english: await import("../src/app/(en)/docs/page.tsx"),
      localized: await import("../src/app/[locale]/docs/page.tsx"),
    },
    {
      pathname: "/docs/get-started",
      english: await import("../src/app/(en)/docs/get-started/page.tsx"),
      localized: await import("../src/app/[locale]/docs/get-started/page.tsx"),
    },
  ];

  for (const { pathname, english, localized } of routeModules) {
    assert.deepEqual(
      english.metadata.alternates.languages,
      routing.alternateUrls(pathname),
      `en ${pathname}`,
    );
    assert.equal(
      english.metadata.openGraph.locale,
      "en_US",
      `en ${pathname} Open Graph locale`,
    );

    assert.equal(typeof localized.generateMetadata, "function", pathname);
    const zhMetadata = await localized.generateMetadata({
      params: Promise.resolve({ locale: "zh-TW" }),
    });

    assert.equal(
      zhMetadata.alternates.canonical,
      routing.canonicalUrl("zh-TW", pathname),
      `zh-TW ${pathname} canonical`,
    );
    assert.deepEqual(
      zhMetadata.alternates.languages,
      routing.alternateUrls(pathname),
      `zh-TW ${pathname} alternates`,
    );
    assert.equal(
      zhMetadata.openGraph.url,
      routing.canonicalUrl("zh-TW", pathname),
      `zh-TW ${pathname} Open Graph URL`,
    );
    assert.equal(
      zhMetadata.openGraph.locale,
      "zh_TW",
      `zh-TW ${pathname} Open Graph locale`,
    );
  }
});

test("sitemap includes localized core and Mandarin acquisition routes", async () => {
  const { locales, routing } = await loadI18nModules();
  const { default: sitemap } = await import("../src/app/sitemap.ts");
  const entries = sitemap();
  const urls = new Set(entries.map((entry) => entry.url));
  assert.equal(entries.length, urls.size, "sitemap URLs must be unique");

  for (const pathname of routing.CORE_TRANSLATED_PATHS) {
    for (const locale of locales.SUPPORTED_LOCALES) {
      assert.ok(
        urls.has(routing.canonicalUrl(locale, pathname)),
        `${locale} ${pathname}`,
      );
    }
  }

  assert.equal(urls.has("https://wenlan.app/zh-TW/learn"), true);
  assert.equal(urls.has("https://wenlan.app/zh-CN/learn"), true);
  for (const pathname of routing.TRANSLATED_LEARN_PATHS) {
    assert.ok(urls.has(routing.canonicalUrl("en", pathname)), pathname);
    for (const locale of routing.translatedLocalesForLearnPath(pathname)) {
      assert.ok(urls.has(routing.canonicalUrl(locale, pathname)), `${locale} ${pathname}`);
    }
  }
  assert.equal(
    urls.has("https://wenlan.app/zh-TW/learn/wenlan-vs-obsidian-ai-memory"),
    true,
  );
  assert.equal(
    urls.has("https://wenlan.app/zh-CN/learn/wenlan-vs-obsidian-ai-memory"),
    true,
  );
  assert.equal(
    urls.has("https://wenlan.app/zh-TW/learn/wenlan-vs-basic-memory"),
    false,
  );
  assert.equal(
    urls.has("https://wenlan.app/zh-CN/learn/wenlan-vs-basic-memory"),
    false,
  );
  const zhTWLLMWiki = entries.find(
    (entry) =>
      entry.url ===
      "https://wenlan.app/zh-TW/learn/distilled-wiki-pages-ai-memory",
  );
  assert.ok(zhTWLLMWiki);
  assert.equal(
    new Date(zhTWLLMWiki.lastModified).toISOString().slice(0, 10),
    "2026-09-08",
  );
  assert.equal(urls.has("https://wenlan.app/zh-TW/docs/daily-workflow"), false);
  assert.equal(urls.has("https://wenlan.app/zh-CN/docs/daily-workflow"), false);
});

test("sitemap route alternates are reciprocal for every localized entry", async () => {
  const { locales, routing } = await loadI18nModules();
  const { default: sitemap } = await import("../src/app/sitemap.ts");
  const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

  for (const pathname of [
    ...routing.CORE_TRANSLATED_PATHS,
  ]) {
    const expectedAlternates = routing.alternateUrls(pathname);

    for (const locale of locales.SUPPORTED_LOCALES) {
      const url = routing.canonicalUrl(locale, pathname);
      const entry = entriesByUrl.get(url);

      assert.ok(entry, url);
      assert.deepEqual(
        entry.alternates?.languages,
        expectedAlternates,
        `${locale} ${pathname}`,
      );
    }
  }

  for (const pathname of routing.TRANSLATED_LEARN_PATHS) {
    const expectedAlternates = routing.alternateUrls(pathname);
    const localesForPath = [
      "en",
      ...routing.translatedLocalesForLearnPath(pathname),
    ];

    for (const locale of localesForPath) {
      const url = routing.canonicalUrl(locale, pathname);
      const entry = entriesByUrl.get(url);

      assert.ok(entry, url);
      assert.deepEqual(
        entry.alternates?.languages,
        expectedAlternates,
        `${locale} ${pathname}`,
      );
    }
  }
});

test("localized core page JSON-LD uses localized absolute URLs and languages for translated routes", async () => {
  const { locales, routing } = await loadI18nModules();
  const [{ AboutPage }, { DownloadPage }, { DocsIndexPage }, { GetStartedPage }] = await Promise.all([
    import("../src/app/_pages/about.tsx"),
    import("../src/app/_pages/download.tsx"),
    import("../src/app/_pages/docs-index.tsx"),
    import("../src/app/_pages/get-started.tsx"),
  ]);

  for (const locale of ["zh-TW", "zh-CN"]) {
    const expectedLanguage = locales.LOCALE_CONFIG[locale].hreflang;
    const homeUrl = routing.canonicalUrl(locale, "/");
    const aboutUrl = routing.canonicalUrl(locale, "/about");
    const downloadUrl = routing.canonicalUrl(locale, "/download");
    const docsUrl = routing.canonicalUrl(locale, "/docs");
    const getStartedUrl = routing.canonicalUrl(locale, "/docs/get-started");

    const aboutSchemas = renderJsonLd(AboutPage, locale);
    assertBreadcrumbItems(
      schemaByType(aboutSchemas, "BreadcrumbList"),
      [homeUrl, aboutUrl],
      `${locale}.about.breadcrumbs`,
    );
    const aboutSchema = schemaByType(aboutSchemas, "AboutPage");
    assert.equal(aboutSchema.url, aboutUrl);
    assert.equal(aboutSchema.inLanguage, expectedLanguage);
    assert.equal(schemaByType(aboutSchemas, "Person").mainEntityOfPage, aboutUrl);

    const downloadSchemas = renderJsonLd(DownloadPage, locale);
    assertBreadcrumbItems(
      schemaByType(downloadSchemas, "BreadcrumbList"),
      [homeUrl, downloadUrl],
      `${locale}.download.breadcrumbs`,
    );
    const downloadSchema = schemaByType(downloadSchemas, "WebPage");
    assert.equal(downloadSchema.url, downloadUrl);
    assert.equal(downloadSchema.inLanguage, expectedLanguage);

    const docsSchemas = renderJsonLd(DocsIndexPage, locale);
    assertBreadcrumbItems(
      schemaByType(docsSchemas, "BreadcrumbList"),
      [homeUrl, docsUrl],
      `${locale}.docs.breadcrumbs`,
    );
    const collectionSchema = schemaByType(docsSchemas, "CollectionPage");
    assert.equal(collectionSchema["@id"], `${docsUrl}#collection`);
    assert.equal(collectionSchema.url, docsUrl);
    assert.equal(collectionSchema.inLanguage, expectedLanguage);
    assert.ok(
      collectionSchema.hasPart.some((part) => part.url === getStartedUrl),
      `${locale}.docs.hasPart.getStarted`,
    );
    assert.ok(
      collectionSchema.hasPart.some(
        (part) => part.url === routing.canonicalUrl("en", "/docs/daily-workflow"),
      ),
      `${locale}.docs.hasPart.untranslatedDailyWorkflow`,
    );
    assert.equal(
      collectionSchema.hasPart.some(
        (part) => part.url === `${homeUrl}/docs/daily-workflow`,
      ),
      false,
      `${locale}.docs.hasPart.untranslatedDailyWorkflowLocalized`,
    );

    const getStartedSchemas = renderJsonLd(GetStartedPage, locale);
    assertBreadcrumbItems(
      schemaByType(getStartedSchemas, "BreadcrumbList"),
      [homeUrl, docsUrl, getStartedUrl],
      `${locale}.getStarted.breadcrumbs`,
    );
    const howToSchema = schemaByType(getStartedSchemas, "HowTo");
    assert.equal(howToSchema.url, getStartedUrl);
    assert.equal(howToSchema.inLanguage, expectedLanguage);
  }
});

test("content dictionaries keep exact core keys, content shapes, and leaf counts", async () => {
  const { content, hash } = await loadI18nModules();
  const expectedKeys = ["about", "chrome", "docs", "footer", "getStarted", "home", "notFound"];

  assert.deepEqual(Object.keys(content.enContent).sort(), expectedKeys);
  assert.deepEqual(Object.keys(content.zhTWContent).sort(), expectedKeys);
  assert.deepEqual(Object.keys(content.zhCNContent).sort(), expectedKeys);
  assert.deepEqual(content.localizedContentByLocale.en, content.enContent);
  assert.deepEqual(content.localizedContentByLocale["zh-TW"], content.zhTWContent);
  assert.deepEqual(content.localizedContentByLocale["zh-CN"], content.zhCNContent);

  assert.deepEqual(contentShapesByKey(content.zhTWContent), contentShapesByKey(content.enContent));
  assert.deepEqual(contentShapesByKey(content.zhCNContent), contentShapesByKey(content.enContent));
  assert.deepEqual(
    leafCountsByKey(content.zhTWContent, hash.flattenLeafStrings),
    leafCountsByKey(content.enContent, hash.flattenLeafStrings),
  );
  assert.deepEqual(
    leafCountsByKey(content.zhCNContent, hash.flattenLeafStrings),
    leafCountsByKey(content.enContent, hash.flattenLeafStrings),
  );
});

test("core content dictionaries cover first-release localized page surfaces", async () => {
  const { content } = await loadI18nModules();

  for (const [locale, dictionary] of Object.entries(content.coreContentByLocale)) {
    const home = dictionary.home.content;
    assert.ok(home.nav?.links?.length >= 4, `${locale}.home.content.nav.links`);
    assert.ok(home.hero?.primaryCta?.label, `${locale}.home.content.hero.primaryCta`);
    assert.equal(home.useCases?.scenarios?.length, 4, `${locale}.home.content.useCases.scenarios`);
    assert.ok(home.metrics?.rows?.length >= 3, `${locale}.home.content.metrics.rows`);
    assert.ok(home.faqs?.items?.length >= 10, `${locale}.home.content.faqs.items`);

    for (const key of [
      "problem",
      "solution",
      "memoryDistillery",
      "humanControl",
      "features",
      "openSourceCta",
    ]) {
      assert.ok(home.sections?.[key]?.title, `${locale}.home.content.sections.${key}.title`);
      assert.ok(home.sections?.[key]?.body, `${locale}.home.content.sections.${key}.body`);
    }
    assert.ok(home.sections.solution.visualLabels?.start, `${locale}.home.content.sections.solution.visualLabels.start`);
    assert.ok(home.sections.solution.visualLabels?.capture, `${locale}.home.content.sections.solution.visualLabels.capture`);
    assert.ok(home.sections.solution.visualLabels?.handoff, `${locale}.home.content.sections.solution.visualLabels.handoff`);
    assert.ok(home.sections.solution.visualLabels?.resume, `${locale}.home.content.sections.solution.visualLabels.resume`);
    assert.ok(home.sections.memoryDistillery.visualLabels?.merged, `${locale}.home.content.sections.memoryDistillery.visualLabels.merged`);
    assert.ok(home.sections.memoryDistillery.visualLabels?.linked, `${locale}.home.content.sections.memoryDistillery.visualLabels.linked`);
    assert.ok(home.sections.memoryDistillery.visualLabels?.refined, `${locale}.home.content.sections.memoryDistillery.visualLabels.refined`);

    const waitlistCopy = home.sections.openSourceCta.waitlist;
    for (const key of ["emailPlaceholder", "fallbackError"]) {
      assert.ok(waitlistCopy?.[key], `${locale}.home.content.sections.openSourceCta.waitlist.${key}`);
    }
    for (const key of ["required", "invalid", "notConfigured", "unknown"]) {
      assert.ok(waitlistCopy?.errors?.[key], `${locale}.home.content.sections.openSourceCta.waitlist.errors.${key}`);
    }

    assert.ok(dictionary.about.content.principles?.items?.length >= 4, `${locale}.about.content.principles.items`);
    assert.ok(dictionary.docs.content.sections?.items?.length >= 4, `${locale}.docs.content.sections.items`);
    for (const section of dictionary.docs.content.sections.items) {
      assert.ok(section.items?.length > 0, `${locale}.docs.content.sections.${section.id}.items`);
      for (const item of section.items) {
        assert.ok(item.href, `${locale}.docs.content.sections.${section.id}.items.${item.id}.href`);
        assert.ok(item.label, `${locale}.docs.content.sections.${section.id}.items.${item.id}.label`);
        assert.ok(item.title, `${locale}.docs.content.sections.${section.id}.items.${item.id}.title`);
        assert.ok(item.description, `${locale}.docs.content.sections.${section.id}.items.${item.id}.description`);
        assert.ok(item.meta, `${locale}.docs.content.sections.${section.id}.items.${item.id}.meta`);
      }
    }
    assert.ok(dictionary.getStarted.content.steps?.length >= 3, `${locale}.getStarted.content.steps`);
    assert.ok(dictionary.notFound.content.title, `${locale}.notFound.content.title`);
    assert.ok(dictionary.footer.content.ariaLabel, `${locale}.footer.content.ariaLabel`);
    assert.ok(dictionary.footer.content.groups?.length >= 3, `${locale}.footer.content.groups`);
  }

  assertArrayItemsHaveStableIds(content.enContent.home.content.nav.links, "home.nav.links");
  assertArrayItemsHaveStableIds(content.enContent.home.content.useCases.scenarios, "home.useCases.scenarios");
  for (const scenario of content.enContent.home.content.useCases.scenarios) {
    assertArrayItemsHaveStableIds(scenario.evidence, `home.useCases.scenarios.${scenario.id}.evidence`);
  }
  assertArrayItemsHaveStableIds(content.enContent.home.content.metrics.rows, "home.metrics.rows");
  assertArrayItemsHaveStableIds(content.enContent.home.content.faqs.items, "home.faqs.items");
  assertArrayItemsHaveStableIds(content.enContent.about.content.principles.items, "about.principles.items");
  assertArrayItemsHaveStableIds(content.enContent.docs.content.sections.items, "docs.sections.items");
  for (const section of content.enContent.docs.content.sections.items) {
    assertArrayItemsHaveStableIds(section.items, `docs.sections.${section.id}.items`);
  }
  assertArrayItemsHaveStableIds(content.enContent.getStarted.content.steps, "getStarted.steps");
  assertArrayItemsHaveStableIds(content.enContent.footer.content.groups, "footer.groups");
});

test("home use cases frame Wenlan as an LLM wiki for code, product, and research jobs", async () => {
  const { content } = await loadI18nModules();
  const useCases = content.enContent.home.content.useCases;

  assert.equal(useCases.title, "LLM wiki for\ncode, clients,\nand research.");
  assert.match(useCases.description, /source-cited pages agents can brief, recall, and hand off/i);
  assert.equal(useCases.index.title, "Wenlan Wiki Index");
  assert.equal(useCases.index.activeViewLabel, "Active view");
  assert.deepEqual(
    useCases.scenarios.map((scenario) => scenario.id),
    ["dev-codebase", "product-customers", "research-writing", "learning-study"],
  );

  const [devScenario, productScenario, researchScenario] = useCases.scenarios;
  assert.equal(devScenario.railLabel, "Code");
  assert.match(devScenario.lead, /docs engineers actually update/i);
  assert.match(devScenario.body, /source-backed engineering pages/i);
  assert.match(devScenario.body, /architecture maps, runbooks, migration plans, integration notes/i);
  assert.doesNotMatch(devScenario.body, /\bhandoff\b/i);
  assert.match(
    devScenario.evidence.map((item) => `${item.label} ${item.detail}`).join("\n"),
    /Architecture map[\s\S]*Runbook[\s\S]*Migration plan[\s\S]*Integration note/i,
  );
  assert.match(productScenario.label, /Product & client work/);
  assert.equal(productScenario.railLabel, "Client work");
  assert.match(productScenario.lead, /client context/i);
  assert.match(productScenario.body, /client constraint/i);
  assert.match(researchScenario.label, /Research & writing/);
  assert.equal(researchScenario.railLabel, "Research");
  assert.match(researchScenario.lead, /cited wiki pages/i);
  assert.match(researchScenario.body, /trusted quotes/i);
});

test("Chinese home surfaces include script-specific Wenlan Chinese names", async () => {
  const { content } = await loadI18nModules();
  const expectedNames = {
    "zh-TW": "文瀾",
    "zh-CN": "文澜",
  };

  for (const [locale, chineseName] of Object.entries(expectedNames)) {
    const home = content.localizedContentByLocale[locale].home.content;

    for (const [label, value] of Object.entries({
      seoTitle: home.seo.title,
      seoDescription: home.seo.description,
      navBrand: home.nav.brand,
      heroTitle: home.hero.title,
    })) {
      assert.match(value, /Wenlan/, `${locale}.${label}.Wenlan`);
      assert.match(value, new RegExp(chineseName), `${locale}.${label}.${chineseName}`);
    }
  }
});

test("home SEO copy presents LLM wiki positioning in English and Mandarin", async () => {
  const { content } = await loadI18nModules();

  assert.equal(
    content.enContent.home.content.seo.title,
    "Wenlan | LLM Wiki for AI Work",
  );
  assert.equal(
    content.enContent.home.content.seo.description,
    "Wenlan is a source-backed AI knowledge base and LLM wiki for AI work: organize documents and decisions into pages you can find, inspect, and review.",
  );
  assert.match(
    content.enContent.home.content.redesign.hero.eyebrow,
    /living wiki/i,
  );

  const expected = {
    "zh-TW": {
      name: "文瀾",
      sourceBacked: "有來源依據",
      staleHomePhrase: /活個人知識庫|AI-native/,
      hero: {
        eyebrow: /Living Wiki/,
        notes: /筆記一直在累積/,
        continuation: /工作.*從頭來/,
        sourceBacked: /有來源、能持續更新的 Wiki/,
        buildOn: /接著往前做/,
      },
    },
    "zh-CN": {
      name: "文澜",
      sourceBacked: "有来源依据",
      staleHomePhrase: /活个人知识库|AI-native/,
      hero: {
        eyebrow: /Living Wiki/,
        notes: /笔记一直在积累/,
        continuation: /工作.*从头来/,
        sourceBacked: /有来源、能持续更新的 Wiki/,
        buildOn: /接着往前做/,
      },
    },
  };

  for (const [locale, localeExpected] of Object.entries(expected)) {
    const home = content.localizedContentByLocale[locale].home.content;
    const renderedHome = JSON.stringify(home);

    assert.match(home.seo.title, /AI 工作的 LLM wiki/, `${locale}.home.seo.title`);
    assert.match(home.seo.description, /AI 工作的 LLM wiki/, `${locale}.home.seo.description`);
    assert.match(home.seo.description, new RegExp(localeExpected.name), `${locale}.home.seo.description.name`);
    assert.match(
      home.seo.description,
      new RegExp(localeExpected.sourceBacked),
      `${locale}.home.seo.description.sourceBacked`,
    );
    assert.match(home.redesign.hero.eyebrow, localeExpected.hero.eyebrow, `${locale}.home.hero.category`);
    assert.match(home.redesign.hero.headline.pre, localeExpected.hero.notes, `${locale}.home.hero.notes`);
    assert.match(home.redesign.hero.headline.emphasis, localeExpected.hero.continuation, `${locale}.home.hero.continuation`);
    assert.match(home.redesign.hero.description, localeExpected.hero.sourceBacked, `${locale}.home.hero.description.sourceBacked`);
    assert.match(home.redesign.hero.description, localeExpected.hero.buildOn, `${locale}.home.hero.description.continuation`);
    assert.match(home.faqs.items[0].a, /LLM wiki/, `${locale}.home.faq.whatIsWenlan`);
    assert.doesNotMatch(renderedHome, localeExpected.staleHomePhrase, `${locale}.home.stale`);
  }
});

test("Chinese hero copy preserves the continuation promise and setup keeps short AI compounds together", async () => {
  const { content } = await loadI18nModules();

  for (const locale of ["zh-TW", "zh-CN"]) {
    const dictionary = content.localizedContentByLocale[locale];

    assert.match(
      dictionary.home.content.redesign.hero.description,
      /有來源、能持續更新的 Wiki|有来源、能持续更新的 Wiki/,
      `${locale}.home.hero.description.sourceBacked`,
    );
    assert.match(
      dictionary.getStarted.content.hero.title,
      /你的\u00a0AI\u00a0工具/,
      `${locale}.getStarted.hero.title`,
    );
    assert.doesNotMatch(
      dictionary.getStarted.content.hero.title,
      /AI tools/,
      `${locale}.getStarted.hero.title.EnglishNoun`,
    );
  }
});

test("Remote Access discovery copy states the no-auth boundary", async () => {
  const { content } = await loadI18nModules();
  const expected = {
    en: {
      noAuth: /no authentication/i,
      stop: /stop Remote Access when unused/i,
    },
    "zh-TW": {
      noAuth: /沒有驗證/,
      stop: /不用時.*停止 Remote Access/,
    },
    "zh-CN": {
      noAuth: /没有身份验证/,
      stop: /不用时.*停止 Remote Access/,
    },
  };

  for (const [locale, localeExpected] of Object.entries(expected)) {
    const faqs = content.localizedContentByLocale[locale].home.content.faqs.items;

    for (const id of ["tools", "setup"]) {
      const answer = faqs.find((item) => item.id === id)?.a ?? "";
      assert.match(answer, localeExpected.noAuth, `${locale}.home.faq.${id}.noAuth`);
      assert.match(answer, localeExpected.stop, `${locale}.home.faq.${id}.stop`);
    }
  }
});

test("waitlist client-visible copy is dictionary driven", async () => {
  const formSource = await readFile(
    resolve(repoRoot, "src/app/waitlist-form.tsx"),
    "utf8",
  );
  assert.match(formSource, /emailPlaceholder/);
  assert.match(formSource, /copy\.errors\[/);
  assert.match(formSource, /copy\.fallbackError/);
  assert.doesNotMatch(formSource, /placeholder="you@email\.com"/);
  assert.doesNotMatch(formSource, /\{state\.error\}/);

  const actionSource = await readFile(resolve(repoRoot, "src/app/actions.ts"), "utf8");
  assert.match(actionSource, /errorCode/);
  for (const literal of [
    "Email is required.",
    "Please enter a valid email.",
    "Waitlist is not configured yet.",
    "Something went wrong. Please try again.",
  ]) {
    assert.doesNotMatch(actionSource, new RegExp(literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("problem-solution visible SVG labels are supplied by localized content", async () => {
  const source = await readFile(
    resolve(repoRoot, "src/components/problem-solution.tsx"),
    "utf8",
  );
  assert.match(source, /visualLabels/);
  for (const label of ["START", "CAPTURE", "HANDOFF", "RESUME", "MERGED", "LINKED", "REFINED"]) {
    assert.doesNotMatch(source, new RegExp(`>${label}<|label:\\s*["']${label}["']`), label);
  }
});

test("footer aria label is localized content", async () => {
  const source = await readFile(
    resolve(repoRoot, "src/components/site-footer.tsx"),
    "utf8",
  );
  assert.match(source, /aria-label=\{content\.ariaLabel\}/);
  assert.doesNotMatch(source, /aria-label="Site footer"/);
});

test("shared accessibility navigation copy is localized content", async () => {
  const { content } = await loadI18nModules();

  assert.equal(content.enContent.chrome?.content?.skipLinkLabel, "Skip to content");
  assert.equal(content.enContent.chrome?.content?.breadcrumbAriaLabel, "Breadcrumb");
  assert.equal(content.zhTWContent.chrome?.content?.skipLinkLabel, "跳到主要內容");
  assert.equal(content.zhTWContent.chrome?.content?.breadcrumbAriaLabel, "麵包屑");
  assert.equal(content.zhCNContent.chrome?.content?.skipLinkLabel, "跳到主要内容");
  assert.equal(content.zhCNContent.chrome?.content?.breadcrumbAriaLabel, "面包屑");
});

test("localized shared modules do not hardcode English accessibility navigation copy", async () => {
  const rootDocumentSource = await readFile(
    resolve(repoRoot, "src/app/root-document.tsx"),
    "utf8",
  );
  assert.match(rootDocumentSource, /getCoreContent\(locale\)\.chrome\.content/);
  assert.match(rootDocumentSource, /skipLinkLabel/);
  assert.doesNotMatch(rootDocumentSource, />\s*Skip to content\s*</);

  for (const path of [
    "src/app/_pages/about.tsx",
    "src/app/_pages/docs-index.tsx",
    "src/app/_pages/get-started.tsx",
  ]) {
    const source = await readFile(resolve(repoRoot, path), "utf8");
    assert.match(source, /chrome\.breadcrumbAriaLabel/, path);
    assert.doesNotMatch(source, /aria-label="Breadcrumb"/, path);
  }
});

test("docs index visible cards come from localized docs content", async () => {
  const { content } = await loadI18nModules();

  for (const locale of ["zh-TW", "zh-CN"]) {
    const sections = content.localizedContentByLocale[locale].docs.content.sections.items;
    const afterSetup = sections.find((section) => section.id === "after-setup");
    const reference = sections.find((section) => section.id === "reference");
    const project = sections.find((section) => section.id === "project");

    assert.ok(Array.isArray(afterSetup?.items), `${locale}.docs.after-setup.items`);
    assert.ok(Array.isArray(reference?.items), `${locale}.docs.reference.items`);
    assert.ok(Array.isArray(project?.items), `${locale}.docs.project.items`);
    assert.ok(afterSetup?.items.some((item) => item.id === "daily-workflow"), `${locale}.docs.after-setup.daily-workflow`);
    assert.ok(reference?.items.some((item) => item.id === "architecture"), `${locale}.docs.reference.architecture`);
    assert.ok(project?.items.some((item) => item.id === "changelog"), `${locale}.docs.project.changelog`);
    for (const section of sections) {
      for (const item of section.items) {
        assert.match(item.href, /^\/docs\//, `${locale}.${section.id}.${item.id}.href`);
        assert.doesNotMatch(item.meta, /\bUpdated\b/, `${locale}.${section.id}.${item.id}.meta`);
      }
    }
  }

  const source = await readFile(
    resolve(repoRoot, "src/app/_pages/docs-index.tsx"),
    "utf8",
  );
  assert.doesNotMatch(source, /formatDocDate/);
  assert.doesNotMatch(source, /\bUpdated\b/);
  assert.doesNotMatch(source, /title:\s*page\.title/);
  assert.doesNotMatch(source, /description:\s*page\.description/);
});

test("Chinese core content cannot hide English fallback copies", async () => {
  const { content, hash, protectedTokens } = await loadI18nModules();
  assert.ok(content.coreContentByLocale, "coreContentByLocale export");

  const englishDictionary = content.coreContentByLocale.en;

  for (const locale of ["zh-TW", "zh-CN"]) {
    const dictionary = content.coreContentByLocale[locale];

    for (const key of Object.keys(englishDictionary)) {
      const englishUnit = englishDictionary[key];
      const translatedUnit = dictionary[key];
      const englishLeaves = hash.flattenLeafStrings(englishUnit.content);
      const translatedLeaves = hash.flattenLeafStrings(translatedUnit.content);
      const hiddenFallbackLeaves = findHiddenFallbackLeaves(
        key,
        englishUnit.content,
        translatedUnit.content,
        hash.flattenLeafStrings,
        protectedTokens,
      );

      assert.equal(translatedUnit.status, "translated", `${locale}.${key}.status`);
      assert.notDeepEqual(
        translatedLeaves,
        englishLeaves,
        `${locale}.${key}.content`,
      );
      assert.deepEqual(
        hiddenFallbackLeaves,
        [],
        `${locale}.${key}.content`,
      );
    }
  }
});

test("hidden fallback helper catches a copied normal English UI label", async () => {
  const { content, hash, protectedTokens } = await loadI18nModules();
  const copiedFooter = structuredClone(content.zhTWContent.footer.content);
  copiedFooter.groups[0].links[2].label = "Capture quality";

  assert.deepEqual(
    findHiddenFallbackLeaves(
      "footer",
      content.enContent.footer.content,
      copiedFooter,
      hash.flattenLeafStrings,
      protectedTokens,
    ),
    [{ path: "footer.groups[0].links[2].label", value: "Capture quality" }],
  );
});

test("English core content records the current SEO title and description subset", async () => {
  const { content } = await loadI18nModules();

  assert.equal(
    content.enContent.home.content.seo.title,
    "Wenlan | LLM Wiki for AI Work",
  );
  assert.equal(
    content.enContent.home.content.seo.description,
    "Wenlan is a source-backed AI knowledge base and LLM wiki for AI work: organize documents and decisions into pages you can find, inspect, and review.",
  );
  assert.equal(
    content.enContent.about.content.seo.title,
    "About Wenlan | LLM Wiki for AI Work",
  );
  assert.equal(
    content.enContent.docs.content.seo.title,
    "Wenlan Docs | LLM Wiki for AI Work",
  );
  assert.equal(
    content.enContent.getStarted.content.seo.title,
    "Install Wenlan for Claude Code, Codex, ChatGPT, and MCP",
  );
});

test("footer and root document pass locale through localized links", async () => {
  const siteFooterSource = await readFile(
    resolve(repoRoot, "src/components/site-footer.tsx"),
    "utf8",
  );
  assert.match(siteFooterSource, /type\s+SiteFooterProps\s*=\s*{\s*locale:\s*Locale\s*;/s);
  assert.match(siteFooterSource, /function\s+SiteFooter\s*\(\s*{\s*locale\s*}/);
  assert.match(siteFooterSource, /getCoreContent\(locale\)\.footer\.content/);
  assert.match(siteFooterSource, /LocalizedLink/);

  const rootDocumentSource = await readFile(
    resolve(repoRoot, "src/app/root-document.tsx"),
    "utf8",
  );
  assert.match(rootDocumentSource, /<SiteFooter\s+locale=\{locale\}\s*\/>/);
});

test("localized core wrappers reject unsupported and English locale params through the shared resolver", async () => {
  await assertFileExists("src/i18n/resolve-locale.ts");
  const resolverSource = await readFile(
    resolve(repoRoot, "src/i18n/resolve-locale.ts"),
    "utf8",
  );
  assert.match(resolverSource, /resolveLocalizedRouteLocale/);
  assert.match(resolverSource, /TRANSLATED_LOCALES/);
  assert.match(resolverSource, /notFound\(\)/);

  for (const path of [
    "src/app/[locale]/page.tsx",
    "src/app/[locale]/about/page.tsx",
    "src/app/[locale]/docs/page.tsx",
    "src/app/[locale]/docs/get-started/page.tsx",
  ]) {
    const source = await readFile(resolve(repoRoot, path), "utf8");
    assert.match(source, /resolveLocalizedRouteLocale/, path);
    assert.match(source, /await\s+params/, path);
  }

  const localizedNotFoundSource = await readFile(
    resolve(repoRoot, "src/app/[locale]/not-found.tsx"),
    "utf8",
  );
  assert.match(localizedNotFoundSource, /useParams/, "src/app/[locale]/not-found.tsx");
  assert.match(localizedNotFoundSource, /TRANSLATED_LOCALES/, "src/app/[locale]/not-found.tsx");
});

test("hashing normalizes whitespace, sorts leaves, and detects English content drift", async () => {
  const { hash } = await loadI18nModules();

  assert.equal(hash.normalizeForHash("  A\r\n  B\t\tC  "), "A B C");
  assert.deepEqual(hash.flattenLeafStrings({ b: "two", a: { z: "last", a: "first" } }), [
    { path: "a.a", value: "first" },
    { path: "a.z", value: "last" },
    { path: "b", value: "two" },
  ]);

  const baseHash = hash.hashEnglishContentUnit({
    seo: {
      description: "A living\r\npersonal   library.",
      title: "Wenlan",
    },
  });
  const reorderedSameHash = hash.hashEnglishContentUnit({
    seo: {
      title: "Wenlan",
      description: " A living personal library. ",
    },
  });
  const changedHash = hash.hashEnglishContentUnit({
    seo: {
      description: "A living personal library!",
      title: "Wenlan",
    },
  });

  assert.equal(baseHash, reorderedSameHash);
  assert.notEqual(baseHash, changedHash);
});

test("Chinese dictionaries store fixed source hashes equal to current English content", async () => {
  const { content, hash } = await loadI18nModules();

  for (const [locale, dictionary] of [
    ["zh-TW", content.zhTWContent],
    ["zh-CN", content.zhCNContent],
  ]) {
    for (const key of Object.keys(content.enContent)) {
      assert.match(
        dictionary[key].sourceHash,
        /^[a-f0-9]{64}$/,
        `${locale}.${key}.sourceHash`,
      );
      assert.equal(
        dictionary[key].sourceHash,
        hash.hashEnglishContentUnit(content.enContent[key].content),
        `${locale}.${key}.sourceHash`,
      );
    }
  }

  for (const path of ["src/i18n/content/zh-TW.ts", "src/i18n/content/zh-CN.ts"]) {
    const source = await readFile(resolve(repoRoot, path), "utf8");
    assert.doesNotMatch(source, /enContent|hashEnglishContentUnit|node:crypto/, path);
  }
});

test("translated content dictionaries preserve protected tokens from English content", async () => {
  const { content, protectedTokens } = await loadI18nModules();

  for (const locale of ["zh-TW", "zh-CN"]) {
    const dictionary = content.localizedContentByLocale[locale];

    for (const key of Object.keys(content.enContent)) {
      assert.doesNotThrow(
        () =>
          protectedTokens.assertProtectedTokensPreserved(
            content.enContent[key].content,
            dictionary[key].content,
            `${locale}.${key}`,
          ),
        `${locale}.${key}`,
      );
    }
  }
});

test("localized hero brand aliases stay script-specific and required", async () => {
  const { content, protectedTokens } = await loadI18nModules();
  const aliases = {
    "zh-TW": { expected: "文瀾", wrong: "文澜" },
    "zh-CN": { expected: "文澜", wrong: "文瀾" },
  };

  for (const [locale, { expected, wrong }] of Object.entries(aliases)) {
    const source = content.enContent.home.content;
    const intact = structuredClone(content.localizedContentByLocale[locale].home.content);
    assert.doesNotThrow(() =>
      protectedTokens.assertProtectedTokensPreserved(source, intact, `${locale}.home`),
    );

    const missing = structuredClone(intact);
    missing.redesign.hero.description = missing.redesign.hero.description.replace(expected, "");
    assert.throws(
      () => protectedTokens.assertProtectedTokensPreserved(source, missing, `${locale}.home`),
      new RegExp(`${locale}\\.home.*redesign\\.hero\\.description.*Wenlan`, "s"),
    );

    const wrongScript = structuredClone(intact);
    wrongScript.redesign.hero.description = wrongScript.redesign.hero.description.replace(expected, wrong);
    assert.throws(
      () => protectedTokens.assertProtectedTokensPreserved(source, wrongScript, `${locale}.home`),
      new RegExp(`${locale}\\.home.*redesign\\.hero\\.description.*Wenlan`, "s"),
    );
  }
});

test("protected token extraction preserves commands, URLs, packages, env vars, metrics, license, and names", async () => {
  const { protectedTokens } = await loadI18nModules();
  const source = [
    "`/plugin marketplace add 7xuanlu/claude-plugins`",
    "`/plugin install wenlan@7xuanlu`",
    "`/setup`",
    "`/distill`",
    "`npx -y wenlan setup`",
    "`~/.wenlan/bin/wenlan connect codex`",
    "`~/.wenlan/.git/` and `crates/wenlan-core/src/eval/`",
    "Wenlan and GitHub stay branded.",
    "See https://github.com/7xuanlu/wenlan and @7xuanlu/wenlan.",
    "Keep release v0.9.1 and daemon version 0.9.1 exact.",
    "Set WENLAN_RERANKER_ENABLED before reading LME_Oracle at 168 tokens / query, 93.6% / 0.857.",
    "Apache-2.0, Qi-Xuan Lu, and 7xuanlu stay exact.",
  ].join("\n");
  const translated = [
    "執行 `/plugin marketplace add 7xuanlu/claude-plugins`。",
    "再執行 `/plugin install wenlan@7xuanlu` 與 `/setup`。",
    "需要時執行 `/distill`。",
    "也可以執行 `npx -y wenlan setup`。",
    "MCP 指令是 `~/.wenlan/bin/wenlan connect codex`。",
    "本地路徑包含 `~/.wenlan/.git/` 和 `crates/wenlan-core/src/eval/`。",
    "Wenlan 和 GitHub 保持品牌寫法。",
    "參考 https://github.com/7xuanlu/wenlan 和 @7xuanlu/wenlan。",
    "release v0.9.1 和 daemon version 0.9.1 必須保留。",
    "先設定 WENLAN_RERANKER_ENABLED，再閱讀 LME_Oracle 的 168 tokens / query、93.6% / 0.857。",
    "Apache-2.0、Qi-Xuan Lu、7xuanlu 必須保留。",
  ].join("\n");

  const extractedTokens = protectedTokens.extractProtectedTokens(source);
  for (const token of [
    "/plugin marketplace add 7xuanlu/claude-plugins",
    "/plugin install wenlan@7xuanlu",
    "/setup",
    "/distill",
    "npx -y wenlan setup",
    "~/.wenlan/bin/wenlan connect codex",
    "~/.wenlan/.git/",
    "crates/wenlan-core/src/eval/",
    "Wenlan",
    "GitHub",
    "https://github.com/7xuanlu/wenlan",
    "@7xuanlu/wenlan",
    "v0.9.1",
    "0.9.1",
    "WENLAN_RERANKER_ENABLED",
    "LME_Oracle",
    "168 tokens / query",
    "93.6%",
    "0.857",
    "Apache-2.0",
    "Qi-Xuan Lu",
    "7xuanlu",
  ]) {
    assert.ok(extractedTokens.includes(token), token);
  }
  assert.doesNotThrow(() =>
    protectedTokens.assertProtectedTokensPreserved(source, translated, "protected sample"),
  );
  assert.throws(
    () =>
      protectedTokens.assertProtectedTokensPreserved(
        source,
        translated.replace("0.857", "0.856"),
        "protected sample",
      ),
    /protected sample.*0\.857/s,
  );
  assert.throws(
    () =>
      protectedTokens.assertProtectedTokensPreserved(
        source,
        translated.replace("v0.9.1", "v0.9.2"),
        "protected sample",
      ),
    /protected sample.*v0\.9\.1/s,
  );
});

test("protected token guard rejects changed translated href leaves", async () => {
  const { content, protectedTokens } = await loadI18nModules();
  const translated = structuredClone(content.zhTWContent.notFound.content);
  translated.popularDestinations[0].href = "/zh-TW/docs/get-started";

  assert.throws(
    () =>
      protectedTokens.assertProtectedTokensPreserved(
        content.enContent.notFound.content,
        translated,
        "zh-TW.notFound",
      ),
    /zh-TW\.notFound.*popularDestinations\[0\]\.href.*\/docs\/get-started/s,
  );
});

test("protected token guard rejects translated product names", async () => {
  const { content, protectedTokens } = await loadI18nModules();
  const translated = structuredClone(content.zhTWContent.home.content);
  translated.seo.title = translated.seo.title.replace("Wenlan", "文瀾");

  assert.throws(
    () =>
      protectedTokens.assertProtectedTokensPreserved(
        content.enContent.home.content,
        translated,
        "zh-TW.home",
      ),
    /zh-TW\.home.*seo\.title.*Wenlan/s,
  );
});

test("competitive intelligence knowledge-base article owns one trilingual scenario", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "build-competitive-intelligence-knowledge-base";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English competitive-intelligence article");
  assert.equal(english.title, "How to Build a Source-Backed Competitive Intelligence Knowledge Base");
  assert.equal(english.publishedAt, "2026-08-30");
  assert.equal(english.updatedAt, "2026-09-08");
  assert.match(JSON.stringify(english), /source|date|revision|stale|contradict|observation|inference/i);
  assert.match(JSON.stringify(english), /does not crawl|does not monitor|scrap|automatic scoring|recommend/i);
  assert.ok(english.productEvidence, "English product evidence");
  assert.equal(
    english.productEvidence.image.src,
    "/images/product-evidence/wenlan-space-review-fixture.png",
  );
  assert.match(english.sections.map((section) => section.code?.code ?? "").join("\n"), /wenlan status/);
  assert.ok(english.relatedSlugs.length >= 3);

  for (const [locale, titlePattern] of [
    ["zh-TW", /如何建立有來源依據的競品研究知識庫/],
    ["zh-CN", /如何建立有来源依据的竞品调研知识库/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} competitive-intelligence article`);
    assert.match(article.title, titlePattern);
    assert.equal(article.publishedAt, "2026-08-30");
    assert.equal(article.updatedAt, "2026-09-08");
    assert.match(JSON.stringify(article), /来源|來源|source|日期|日期|修订|修訂|过期|過期/i);
    assert.match(JSON.stringify(article), /不会爬取|不會爬取|不会监控|不會監控|scrap|自动评分|自動評分/i);
    assert.ok(article.productEvidence, `${locale} product evidence`);
    assert.equal(
      article.productEvidence.image.src,
      "/images/product-evidence/wenlan-space-review-fixture.png",
    );
    assert.ok(article.relatedSlugs.length >= 3);
  }

  const renderer = await readFile(
    resolve(repoRoot, "src/app/[locale]/learn/[slug]/page.tsx"),
    "utf8",
  );
  assert.match(renderer, /article\.slug === "build-competitive-intelligence-knowledge-base"/);
  for (const protectedTerm of ["競品檔案", "竞品档案", "證據", "证据", "追溯"]) {
    assert.match(
      renderer,
      new RegExp(`part === "${protectedTerm}"`),
      `protected CJK phrase: ${protectedTerm}`,
    );
  }
});

test("ICT supplier due-diligence article owns one bounded trilingual evidence-pack scenario", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "build-ict-supplier-due-diligence-evidence-pack";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English ICT supplier due-diligence article");
  assert.equal(english.title, "How to Build an ICT Supplier Due Diligence Evidence Pack");
  assert.equal(english.publishedAt, "2026-08-30");
  assert.equal(english.updatedAt, "2026-09-08");
  assert.match(JSON.stringify(english), /provenance|data-access|resilience|security evidence|review date/i);
  assert.match(
    JSON.stringify(english),
    /does not validate certifications|does not crawl|does not monitor|vulnerability scan|does not score|approval/i,
  );
  assert.ok(english.productEvidence, "English product evidence");
  assert.equal(
    english.productEvidence.image.src,
    "/images/product-evidence/wenlan-space-review-fixture.png",
  );
  assert.equal(english.productEvidence.workflow.length, 3);
  assert.equal(english.productEvidence.artifactRows.length, 3);
  assert.equal(english.productEvidence.action.href, "#product-evidence");
  assert.ok(english.relatedSlugs.length >= 3);

  for (const [locale, titlePattern] of [
    ["zh-TW", /建立 ICT 供應商資安盡職調查證據包/],
    ["zh-CN", /建立 ICT 供应商安全尽职调查证据包/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} ICT supplier due-diligence article`);
    assert.match(article.title, titlePattern);
    assert.equal(article.publishedAt, "2026-08-30");
    assert.equal(article.updatedAt, "2026-09-08");
    assert.match(JSON.stringify(article), /來源|来源|資料範圍|数据范围|韌性|韧性|證據|证据|複審|复审/i);
    assert.match(JSON.stringify(article), /不會驗證|不会验证|不會爬取|不会爬取|弱點掃描|漏洞扫描|自動評分|自动评分/i);
    assert.ok(article.productEvidence, `${locale} product evidence`);
    assert.equal(
      article.productEvidence.image.src,
      "/images/product-evidence/wenlan-space-review-fixture.png",
    );
    assert.equal(article.productEvidence.workflow.length, 3);
    assert.equal(article.productEvidence.artifactRows.length, 3);
    assert.equal(article.productEvidence.action.href, "#product-evidence");
    assert.ok(article.relatedSlugs.length >= 3);
  }

  const renderer = await readFile(
    resolve(repoRoot, "src/app/[locale]/learn/[slug]/page.tsx"),
    "utf8",
  );
  assert.match(renderer, /article\.slug === "build-ict-supplier-due-diligence-evidence-pack"/);
  for (const protectedTerm of ["供應商盡職調查", "供应商尽职调查", "證據包", "证据包", "複審", "复审"]) {
    assert.match(
      renderer,
      new RegExp(`part === "${protectedTerm}"`),
      `protected CJK phrase: ${protectedTerm}`,
    );
  }
});

test("customer-support answer article owns one bounded trilingual answer-pack scenario", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "build-customer-support-answer-knowledge-base";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English customer-support answer article");
  assert.equal(english.title, "How to Build a Customer Support Answer Knowledge Base");
  assert.equal(english.publishedAt, "2026-08-31");
  assert.equal(english.updatedAt, "2026-09-08");
  assert.match(JSON.stringify(english), /question|supported answer|scope|prohibited|escalat|source revision|owner|next review/i);
  assert.match(
    JSON.stringify(english),
    /does not ingest|does not handle PII|does not connect|does not publish|does not generate replies|does not synchronize|does not automatically escalate/i,
  );
  assert.ok(english.productEvidence, "English product evidence");
  assert.equal(
    english.productEvidence.image.src,
    "/images/product-evidence/wenlan-space-review-fixture.png",
  );
  assert.equal(english.productEvidence.workflow.length, 3);
  assert.equal(english.productEvidence.artifactRows.length, 3);
  assert.equal(english.productEvidence.action.href, "#product-evidence");
  assert.match(
    english.sections.map((section) => section.code?.code ?? "").join("\n"),
    /question:[\s\S]*supported_answer:[\s\S]*scope:[\s\S]*do_not_promise:[\s\S]*escalate_when:[\s\S]*source_revision:[\s\S]*owner:[\s\S]*next_review:/,
  );
  assert.ok(english.relatedSlugs.length >= 3);

  for (const [locale, titlePattern] of [
    ["zh-TW", /如何建立客服答案知識庫/],
    ["zh-CN", /如何建立客服答案知识库/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} customer-support answer article`);
    assert.match(article.title, titlePattern);
    assert.equal(article.publishedAt, "2026-08-31");
    assert.equal(article.updatedAt, "2026-09-08");
    assert.match(JSON.stringify(article), /問題|问题|回答|答案|適用範圍|适用范围|不可承諾|不可承诺|轉人工|转人工|來源|来源|負責人|负责人|複審|复审/i);
    assert.match(JSON.stringify(article), /不會導入|不会导入|不會處理個資|不会处理个人信息|不會發布|不会发布|不會自動回覆|不会自动回复|不會同步|不会同步|不會自動轉人工|不会自动转人工/i);
    assert.ok(article.productEvidence, `${locale} product evidence`);
    assert.equal(
      article.productEvidence.image.src,
      "/images/product-evidence/wenlan-space-review-fixture.png",
    );
    assert.equal(article.productEvidence.workflow.length, 3);
    assert.equal(article.productEvidence.artifactRows.length, 3);
    assert.equal(article.productEvidence.action.href, "#product-evidence");
    assert.ok(article.relatedSlugs.length >= 3);
  }

  const renderer = await readFile(
    resolve(repoRoot, "src/app/[locale]/learn/[slug]/page.tsx"),
    "utf8",
  );
  assert.match(renderer, /article\.slug === "build-customer-support-answer-knowledge-base"/);
  for (const protectedTerm of ["客服答案知識庫", "客服答案知识库", "不可承諾", "不可承诺", "禁止承诺", "轉人工", "转人工"]) {
    assert.match(
      renderer,
      new RegExp(`part === "${protectedTerm}"`),
      `protected CJK phrase: ${protectedTerm}`,
    );
  }
});

test("course wiki article owns one bounded trilingual lecture-material scenario", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "build-course-wiki-from-lecture-notes";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English course wiki article");
  assert.equal(english.title, "How to Build a Course Wiki from Lecture Notes and PDFs");
  assert.equal(english.publishedAt, "2026-08-31");
  assert.equal(english.updatedAt, "2026-09-08");
  assert.match(
    JSON.stringify(english),
    /lecture slides|lecture notes|course PDF|concept page|prerequisite|source revision|review state/i,
  );
  assert.match(
    JSON.stringify(english),
    /does not generate flashcards|does not create quizzes|does not transcribe|does not run OCR|does not grade|does not tutor|does not solve homework|does not plan exams|not equivalent to NotebookLM/i,
  );
  assert.ok(english.productEvidence, "English product evidence");
  assert.equal(
    english.productEvidence.image.src,
    "/images/product-evidence/wenlan-space-review-fixture.png",
  );
  assert.equal(english.productEvidence.workflow.length, 3);
  assert.equal(english.productEvidence.artifactRows.length, 3);
  assert.ok(english.relatedSlugs.length >= 3);

  for (const [locale, titlePattern] of [
    ["zh-TW", /把課堂講義與 PDF 整理成課程 Wiki/],
    ["zh-CN", /把课程讲义与 PDF 整理成课程 Wiki/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} course wiki article`);
    assert.match(article.title, titlePattern);
    assert.equal(article.publishedAt, "2026-08-31");
    assert.equal(article.updatedAt, "2026-09-08");
    assert.match(
      JSON.stringify(article),
      /課堂講義|课程讲义|課件|课件|概念頁|概念页|先備知識|前置知识|來源修訂|来源修订|複核狀態|审核状态/i,
    );
    assert.match(
      JSON.stringify(article),
      /不會產生單字卡|不会生成闪卡|不會自動出題|不会自动出题|不會轉錄|不会转录|不會執行 OCR|不会执行 OCR|不會評分|不会评分|不會解題|不会解题|不等同 NotebookLM/i,
    );
    assert.ok(article.productEvidence, `${locale} product evidence`);
    assert.equal(
      article.productEvidence.image.src,
      "/images/product-evidence/wenlan-space-review-fixture.png",
    );
    assert.ok(article.relatedSlugs.length >= 3);
  }

  const renderer = await readFile(
    resolve(repoRoot, "src/app/[locale]/learn/[slug]/page.tsx"),
    "utf8",
  );
  assert.match(renderer, /article\.slug === "build-course-wiki-from-lecture-notes"/);
  for (const protectedTerm of [
    "課程 Wiki",
    "课程 Wiki",
    "課堂講義",
    "课程讲义",
    "先備知識",
    "前置知识",
    "來源修訂",
    "来源修订",
  ]) {
    assert.match(
      renderer,
      new RegExp(`part === "${protectedTerm}"`),
      `protected CJK phrase: ${protectedTerm}`,
    );
  }
});

test("business metric definition article owns one bounded trilingual data-dictionary task", async () => {
  const [{ articles }, { getLocalizedLearnArticle }] = await Promise.all([
    import("../src/app/(en)/learn/articles.ts"),
    import("../src/i18n/learn-articles.ts"),
  ]);
  const slug = "build-business-metric-definition-knowledge-base";
  const english = articles.find((article) => article.slug === slug);

  assert.ok(english, "English business metric definition article");
  assert.equal(english.title, "How to Build a Business Metric Definition Knowledge Base");
  assert.equal(english.publishedAt, "2026-09-01");
  assert.equal(english.updatedAt, "2026-09-08");
  assert.match(
    JSON.stringify(english),
    /data dictionary|metric definition|formula|grain|dimensions|exclusions|owner|source revision|review state|supersedes/i,
  );
  assert.match(
    JSON.stringify(english),
    /does not ingest CSV|does not run SQL|does not connect to a warehouse|does not compute metrics|does not provide lineage|does not monitor data quality|does not manage permissions|does not approve|does not automatically reconcile/i,
  );
  assert.ok(english.productEvidence, "English product evidence");
  assert.equal(
    english.productEvidence.image.src,
    "/images/product-evidence/wenlan-space-review-fixture.png",
  );
  assert.equal(english.productEvidence.workflow.length, 3);
  assert.equal(english.productEvidence.artifactRows.length, 3);
  assert.ok(english.relatedSlugs.length >= 3);

  for (const [locale, titlePattern] of [
    ["zh-TW", /建立商業指標定義知識庫/],
    ["zh-CN", /建立业务指标定义知识库/],
  ]) {
    const article = getLocalizedLearnArticle(locale, slug);
    assert.ok(article, `${locale} business metric definition article`);
    assert.match(article.title, titlePattern);
    assert.equal(article.publishedAt, "2026-09-01");
    assert.equal(article.updatedAt, "2026-09-08");
    assert.match(
      JSON.stringify(article),
      /資料字典|数据字典|指標定義|指标定义|公式|粒度|維度|维度|排除|負責人|负责人|來源修訂|来源修订|複核|审核|取代|替代/i,
    );
    assert.match(
      JSON.stringify(article),
      /不會導入 CSV|不会导入 CSV|不會執行 SQL|不会执行 SQL|不會連接資料倉儲|不会连接数据仓库|不會計算指標|不会计算指标|不會提供血緣|不会提供血缘|不會監控資料品質|不会监控数据质量|不會管理權限|不会管理权限|不會自動核准|不会自动批准|不會自動調和|不会自动协调/i,
    );
    assert.ok(article.productEvidence, `${locale} product evidence`);
    assert.equal(
      article.productEvidence.image.src,
      "/images/product-evidence/wenlan-space-review-fixture.png",
    );
    assert.ok(article.relatedSlugs.length >= 3);
  }

  const renderer = await readFile(
    resolve(repoRoot, "src/app/[locale]/learn/[slug]/page.tsx"),
    "utf8",
  );
  assert.match(renderer, /article\.slug === "build-business-metric-definition-knowledge-base"/);
  for (const protectedTerm of [
    "指標定義",
    "指标定义",
    "資料字典",
    "数据字典",
    "來源修訂",
    "来源修订",
  ]) {
    assert.match(
      renderer,
      new RegExp(`part === "${protectedTerm}"`),
      `protected CJK phrase: ${protectedTerm}`,
    );
  }
});
