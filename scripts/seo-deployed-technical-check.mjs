#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const PRODUCTION_ORIGIN = "https://wenlan.app";
const DEFAULT_TIMEOUT_MS = 15_000;
const SITEMAP_CHECK_CONCURRENCY = 8;
const MAX_SITEMAP_LOCS = 500;
const MAX_SITEMAP_XML_BYTES = 1_000_000;
const MAX_SITEMAP_HTML_BYTES = 1_000_000;
const BRIDGE_HOST_REDIRECTS = [
  "https://www.wenlan.app",
  "https://useorigin.app",
  "https://www.useorigin.app",
].flatMap((origin) => [
  { source: `${origin}/`, destinationPath: "/" },
  { source: `${origin}/learn`, destinationPath: "/learn" },
]);

const REQUIRED_SITEMAP_LOCS = [
  "https://wenlan.app",
  "https://wenlan.app/download",
  "https://wenlan.app/zh-TW/download",
  "https://wenlan.app/zh-CN/download",
  "https://wenlan.app/learn",
  "https://wenlan.app/learn/claude-code-memory",
  "https://wenlan.app/learn/mcp-memory-server",
  "https://wenlan.app/learn/how-to-add-mcp-memory-to-cursor",
  "https://wenlan.app/learn/ai-work-memory",
  "https://wenlan.app/zh-TW/learn/distilled-wiki-pages-ai-memory",
  "https://wenlan.app/zh-CN/learn/distilled-wiki-pages-ai-memory",
  "https://wenlan.app/zh-TW/learn/source-backed-wiki-pages-ai-work",
  "https://wenlan.app/zh-CN/learn/source-backed-wiki-pages-ai-work",
  "https://wenlan.app/zh-TW/learn/wenlan-vs-obsidian-ai-memory",
  "https://wenlan.app/zh-CN/learn/wenlan-vs-obsidian-ai-memory",
  "https://wenlan.app/learn/build-local-ai-knowledge-base-from-documents",
  "https://wenlan.app/zh-TW/learn/build-local-ai-knowledge-base-from-documents",
  "https://wenlan.app/zh-CN/learn/build-local-ai-knowledge-base-from-documents",
  "https://wenlan.app/learn/choose-ai-knowledge-base-tool",
  "https://wenlan.app/zh-TW/learn/choose-ai-knowledge-base-tool",
  "https://wenlan.app/zh-CN/learn/choose-ai-knowledge-base-tool",
  "https://wenlan.app/learn/verify-ai-knowledge-base-citations",
  "https://wenlan.app/zh-TW/learn/verify-ai-knowledge-base-citations",
  "https://wenlan.app/zh-CN/learn/verify-ai-knowledge-base-citations",
  "https://wenlan.app/learn/test-ai-knowledge-base-retrieval-after-changes",
  "https://wenlan.app/zh-TW/learn/test-ai-knowledge-base-retrieval-after-changes",
  "https://wenlan.app/zh-CN/learn/test-ai-knowledge-base-retrieval-after-changes",
  "https://wenlan.app/learn/wenlan-vs-superlocal-memory",
  "https://wenlan.app/docs/configuration",
  "https://wenlan.app/docs/product-matrix",
];

const REBRAND_REDIRECTS = [
  { source: "/learn/origin-for-claude-code", destination: "/learn/wenlan-for-claude-code" },
  {
    source: "/learn/claude-code-memory-command-vs-origin",
    destination: "/learn/claude-code-memory-command-vs-wenlan",
  },
  {
    source: "/learn/where-origin-stores-claude-code-memory",
    destination: "/learn/where-wenlan-stores-claude-code-memory",
  },
  { source: "/learn/origin-vs-basic-memory", destination: "/learn/wenlan-vs-basic-memory" },
  { source: "/learn/origin-vs-claude-mem", destination: "/learn/wenlan-vs-claude-mem" },
  {
    source: "/learn/origin-vs-superlocal-memory",
    destination: "/learn/wenlan-vs-superlocal-memory",
  },
  { source: "/learn/origin-codex-workflow", destination: "/learn/wenlan-codex-workflow" },
  { source: "/learn/origin-cursor-workflow", destination: "/learn/wenlan-cursor-workflow" },
  {
    source: "/learn/origin-claude-desktop-workflow",
    destination: "/learn/wenlan-claude-desktop-workflow",
  },
  { source: "/learn/origin-gemini-cli-workflow", destination: "/learn/wenlan-gemini-cli-workflow" },
  { source: "/learn/origin-vscode-mcp-workflow", destination: "/learn/wenlan-vscode-mcp-workflow" },
  {
    source: "/learn/origin-vs-mcp-memory-service",
    destination: "/learn/wenlan-vs-mcp-memory-service",
  },
  { source: "/learn/origin-vs-chatgpt-memory", destination: "/learn/wenlan-vs-chatgpt-memory" },
  {
    source: "/learn/origin-vs-obsidian-ai-memory",
    destination: "/learn/wenlan-vs-obsidian-ai-memory",
  },
  { source: "/learn/origin-vs-notion-ai", destination: "/learn/wenlan-vs-notion-ai" },
  { source: "/learn/origin-vs-mem0", destination: "/learn/wenlan-vs-mem0" },
];

const OLD_SITEMAP_URL_PATTERNS = [
  /^https:\/\/useorigin\.app(?:\/|$)/,
  /^https:\/\/wenlan\.app\/guides(?:\/|$)/,
  /^https:\/\/wenlan\.app\/docs\/guides(?:\/|$)/,
  /^https:\/\/wenlan\.app\/learn\/ai-memory-app$/,
  ...REBRAND_REDIRECTS.map(
    ({ source }) => new RegExp(`^https://wenlan\\.app${source.replaceAll("/", "\\/")}$`),
  ),
];

const REQUIRED_HTML_PAGES = [
  { path: "/", canonical: "https://wenlan.app", type: "SoftwareApplication" },
  { path: "/download", canonical: "https://wenlan.app/download", type: "WebPage" },
  {
    path: "/zh-TW/download",
    canonical: "https://wenlan.app/zh-TW/download",
    type: "WebPage",
  },
  {
    path: "/zh-CN/download",
    canonical: "https://wenlan.app/zh-CN/download",
    type: "WebPage",
  },
  { path: "/learn", canonical: "https://wenlan.app/learn", type: "CollectionPage" },
  {
    path: "/learn/claude-code-memory",
    canonical: "https://wenlan.app/learn/claude-code-memory",
    type: "Article",
  },
  {
    path: "/learn/mcp-memory-server",
    canonical: "https://wenlan.app/learn/mcp-memory-server",
    type: "Article",
  },
  {
    path: "/learn/how-to-add-mcp-memory-to-cursor",
    canonical: "https://wenlan.app/learn/how-to-add-mcp-memory-to-cursor",
    type: "Article",
  },
  {
    path: "/learn/ai-work-memory",
    canonical: "https://wenlan.app/learn/ai-work-memory",
    type: "Article",
  },
  {
    path: "/zh-TW/learn/distilled-wiki-pages-ai-memory",
    canonical: "https://wenlan.app/zh-TW/learn/distilled-wiki-pages-ai-memory",
    type: "Article",
  },
  {
    path: "/zh-CN/learn/distilled-wiki-pages-ai-memory",
    canonical: "https://wenlan.app/zh-CN/learn/distilled-wiki-pages-ai-memory",
    type: "Article",
  },
  {
    path: "/zh-TW/learn/source-backed-wiki-pages-ai-work",
    canonical: "https://wenlan.app/zh-TW/learn/source-backed-wiki-pages-ai-work",
    type: "Article",
  },
  {
    path: "/zh-CN/learn/source-backed-wiki-pages-ai-work",
    canonical: "https://wenlan.app/zh-CN/learn/source-backed-wiki-pages-ai-work",
    type: "Article",
  },
  {
    path: "/zh-TW/learn/wenlan-vs-obsidian-ai-memory",
    canonical: "https://wenlan.app/zh-TW/learn/wenlan-vs-obsidian-ai-memory",
    type: "Article",
    datePublished: "2026-07-22",
    dateModified: "2026-08-01",
  },
  {
    path: "/zh-CN/learn/wenlan-vs-obsidian-ai-memory",
    canonical: "https://wenlan.app/zh-CN/learn/wenlan-vs-obsidian-ai-memory",
    type: "Article",
    datePublished: "2026-08-01",
    dateModified: "2026-08-01",
  },
  {
    path: "/learn/build-local-ai-knowledge-base-from-documents",
    canonical: "https://wenlan.app/learn/build-local-ai-knowledge-base-from-documents",
    type: "Article",
    datePublished: "2026-08-01",
    dateModified: "2026-08-01",
  },
  {
    path: "/zh-TW/learn/build-local-ai-knowledge-base-from-documents",
    canonical: "https://wenlan.app/zh-TW/learn/build-local-ai-knowledge-base-from-documents",
    type: "Article",
    datePublished: "2026-08-01",
    dateModified: "2026-08-01",
  },
  {
    path: "/zh-CN/learn/build-local-ai-knowledge-base-from-documents",
    canonical: "https://wenlan.app/zh-CN/learn/build-local-ai-knowledge-base-from-documents",
    type: "Article",
    datePublished: "2026-08-01",
    dateModified: "2026-08-01",
  },
  {
    path: "/learn/choose-ai-knowledge-base-tool",
    canonical: "https://wenlan.app/learn/choose-ai-knowledge-base-tool",
    type: "Article",
    datePublished: "2026-08-02",
    dateModified: "2026-09-07",
  },
  {
    path: "/zh-TW/learn/choose-ai-knowledge-base-tool",
    canonical: "https://wenlan.app/zh-TW/learn/choose-ai-knowledge-base-tool",
    type: "Article",
    datePublished: "2026-08-02",
    dateModified: "2026-09-07",
  },
  {
    path: "/zh-CN/learn/choose-ai-knowledge-base-tool",
    canonical: "https://wenlan.app/zh-CN/learn/choose-ai-knowledge-base-tool",
    type: "Article",
    datePublished: "2026-08-02",
    dateModified: "2026-09-07",
  },
  {
    path: "/learn/verify-ai-knowledge-base-citations",
    canonical: "https://wenlan.app/learn/verify-ai-knowledge-base-citations",
    type: "Article",
    datePublished: "2026-08-23",
    dateModified: "2026-08-23",
  },
  {
    path: "/zh-TW/learn/verify-ai-knowledge-base-citations",
    canonical: "https://wenlan.app/zh-TW/learn/verify-ai-knowledge-base-citations",
    type: "Article",
    datePublished: "2026-08-23",
    dateModified: "2026-08-23",
  },
  {
    path: "/zh-CN/learn/verify-ai-knowledge-base-citations",
    canonical: "https://wenlan.app/zh-CN/learn/verify-ai-knowledge-base-citations",
    type: "Article",
    datePublished: "2026-08-23",
    dateModified: "2026-08-23",
  },
  {
    path: "/learn/test-ai-knowledge-base-retrieval-after-changes",
    canonical: "https://wenlan.app/learn/test-ai-knowledge-base-retrieval-after-changes",
    type: "Article",
    datePublished: "2026-08-26",
    dateModified: "2026-08-26",
  },
  {
    path: "/zh-TW/learn/test-ai-knowledge-base-retrieval-after-changes",
    canonical: "https://wenlan.app/zh-TW/learn/test-ai-knowledge-base-retrieval-after-changes",
    type: "Article",
    datePublished: "2026-08-26",
    dateModified: "2026-08-26",
  },
  {
    path: "/zh-CN/learn/test-ai-knowledge-base-retrieval-after-changes",
    canonical: "https://wenlan.app/zh-CN/learn/test-ai-knowledge-base-retrieval-after-changes",
    type: "Article",
    datePublished: "2026-08-26",
    dateModified: "2026-08-26",
  },
  {
    path: "/learn/wenlan-vs-superlocal-memory",
    canonical: "https://wenlan.app/learn/wenlan-vs-superlocal-memory",
    type: "Article",
  },
  {
    path: "/docs/configuration",
    canonical: "https://wenlan.app/docs/configuration",
    type: "TechArticle",
  },
  {
    path: "/docs/product-matrix",
    canonical: "https://wenlan.app/docs/product-matrix",
    type: "TechArticle",
  },
];

const UTILITY_NOINDEX_PATHS = [
  "/llms.txt",
  "/llms-full.txt",
  "/feed.xml",
  "/humans.txt",
  "/manifest.webmanifest",
  "/.well-known/security.txt",
];

const REQUIRED_REDIRECTS = [
  ...REBRAND_REDIRECTS,
  { source: "/learn/ai-memory-app", destination: "/learn/ai-work-memory" },
  { source: "/guides", destination: "/learn" },
  { source: "/guides/claude-code-memory", destination: "/learn/claude-code-memory" },
  { source: "/guides/mcp-memory-server", destination: "/learn/mcp-memory-server" },
  { source: "/guides/local-first-ai-memory", destination: "/learn/local-first-ai-memory" },
  { source: "/guides/ai-memory-app", destination: "/learn/ai-work-memory" },
  { source: "/docs/guides", destination: "/learn" },
  { source: "/docs/guides/claude-code-memory", destination: "/learn/claude-code-memory" },
  { source: "/docs/guides/ai-memory-app", destination: "/learn/ai-work-memory" },
];

const CHANGED_DIRECT_REDIRECT_SOURCES = new Set([
  ...REBRAND_REDIRECTS.map(({ source }) => source),
  "/guides/ai-memory-app",
  "/docs/guides/ai-memory-app",
]);

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") continue;
    if (!arg.startsWith("--")) throw new Error(`Unexpected argument: ${arg}`);

    const key = arg.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
    args[key] = value;
    i += 1;
  }

  const timeoutMs = Number(args["timeout-ms"] ?? DEFAULT_TIMEOUT_MS);
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error("--timeout-ms must be a positive integer");
  }
  if (
    args["require-direct-changed-redirects"] &&
    !["true", "false"].includes(args["require-direct-changed-redirects"])
  ) {
    throw new Error("--require-direct-changed-redirects must be true or false");
  }

  return {
    baseUrl: new URL(args["base-url"] ?? PRODUCTION_ORIGIN).origin,
    fixtureDir: args["fixture-dir"] ? resolve(process.cwd(), args["fixture-dir"]) : null,
    requireDirectChangedRedirects: args["require-direct-changed-redirects"] === "true",
    timeoutMs,
  };
}

function headerValue(headers, name) {
  if (!headers) return null;
  if (typeof headers.get === "function") return headers.get(name);

  const wanted = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === wanted) return Array.isArray(value) ? value.join(", ") : value;
  }
  return null;
}

function normalizeFixtureHeaders(headers = {}) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), String(value)]),
  );
}

async function readBodyChunk(reader, deadline, label) {
  const remainingMs = deadline - Date.now();
  if (remainingMs <= 0) throw new Error(`${label} timed out while reading response body`);

  let timeout;
  try {
    return await Promise.race([
      reader.read(),
      new Promise((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error(`${label} timed out while reading response body`)),
          remainingMs,
        );
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}

async function readTextWithLimit(response, { label, maxBytes, timeoutMs }) {
  const contentLength = Number(headerValue(response.headers, "content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new Error(`${label} exceeds ${maxBytes} bytes`);
  }
  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks = [];
  const deadline = Date.now() + timeoutMs;
  let bytesRead = 0;
  try {
    while (true) {
      const { done, value } = await readBodyChunk(reader, deadline, label);
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > maxBytes) throw new Error(`${label} exceeds ${maxBytes} bytes`);
      chunks.push(decoder.decode(value, { stream: true }));
    }
  } catch (error) {
    await reader.cancel(error).catch(() => {});
    throw error;
  }
  chunks.push(decoder.decode());
  return chunks.join("");
}

async function createRequester({ baseUrl, fixtureDir, timeoutMs }) {
  if (!fixtureDir) {
    return async function request(path, options = {}) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(new URL(path, baseUrl), {
          redirect: options.redirect ?? "follow",
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }
    };
  }

  const responses = JSON.parse(await readFile(resolve(fixtureDir, "responses.json"), "utf8"));
  return async function request(path) {
    const requestUrl = new URL(path, baseUrl);
    const requestPath = `${requestUrl.pathname}${requestUrl.search}`;
    const fixture = responses[`${requestUrl.host}${requestPath}`] ??
      responses[requestPath] ??
      responses[`${requestUrl.host}${requestUrl.pathname}`] ??
      responses[requestUrl.pathname] ?? {
      status: 404,
      headers: {},
      body: `missing fixture response for ${requestUrl.href}`,
    };
    console.log(
      `[seo-deployed-fixture] ${JSON.stringify({ event: "start", path: requestPath, at: process.hrtime.bigint().toString() })}`,
    );
    try {
      if (fixture.delayMs) {
        await new Promise((resolveDelay) => setTimeout(resolveDelay, fixture.delayMs));
      }
      return new Response(fixture.body ?? "", {
        status: fixture.status,
        headers: normalizeFixtureHeaders(fixture.headers),
      });
    } finally {
      console.log(
        `[seo-deployed-fixture] ${JSON.stringify({ event: "end", path: requestPath, at: process.hrtime.bigint().toString() })}`,
      );
    }
  };
}

function extractLocs(sitemap) {
  return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

function parseAttrs(tag) {
  const attrs = {};
  for (const match of tag.matchAll(/\s([a-zA-Z:-]+)(?:="([^"]*)")?/g)) {
    attrs[match[1].toLowerCase()] = match[2] ?? "";
  }
  return attrs;
}

function extractCanonicalTags(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => parseAttrs(match[0]))
    .filter((attrs) => attrs.rel === "canonical")
    .map((attrs) => attrs.href ?? "");
}

function extractRobotsTags(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => parseAttrs(match[0]))
    .filter((attrs) => attrs.name === "robots")
    .map((attrs) => attrs.content ?? "");
}

function collectJsonLdNodes(value, nodes = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectJsonLdNodes(item, nodes);
    return nodes;
  }

  if (!value || typeof value !== "object") return nodes;

  nodes.push(value);

  for (const nested of Object.values(value)) {
    collectJsonLdNodes(nested, nodes);
  }

  return nodes;
}

function nodeHasJsonLdType(node, expectedType) {
  const type = node["@type"];
  return Array.isArray(type) ? type.includes(expectedType) : type === expectedType;
}

function collectJsonLdTypes(value, types = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectJsonLdTypes(item, types);
    return types;
  }

  if (!value || typeof value !== "object") return types;

  const type = value["@type"];
  if (Array.isArray(type)) {
    types.push(...type);
  } else if (typeof type === "string") {
    types.push(type);
  }

  for (const nested of Object.values(value)) {
    collectJsonLdTypes(nested, types);
  }

  return types;
}

function extractJsonLdNodes(html, pagePath) {
  const nodes = [];

  for (const match of html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      nodes.push(...collectJsonLdNodes(JSON.parse(match[1])));
    } catch {
      throw new Error(`invalid JSON-LD: ${pagePath}`);
    }
  }

  return nodes;
}

function isNoindex(value) {
  return /\bnoindex\b/i.test(value ?? "");
}

function isNoindexFollow(value) {
  return /\bnoindex\b/i.test(value ?? "") && /\bfollow\b/i.test(value ?? "");
}

function blocksAllCrawlers(robotsTxt) {
  return /^\s*disallow\s*:\s*\/\s*(?:#.*)?$/im.test(robotsTxt);
}

function assertOk(response, label) {
  if (!response.ok) {
    throw new Error(`${label} returned ${response.status}`);
  }
}

function assertNone(label, values) {
  if (values.length) throw new Error(`${label}: ${values.join(", ")}`);
}

function assertNoMissing(label, values) {
  if (values.length) throw new Error(`${label} missing: ${values.join(", ")}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function assertRobots(request) {
  const response = await request("/robots.txt");
  assertOk(response, "/robots.txt");
  const body = await response.text();

  const expectedSitemap = new URL("/sitemap.xml", PRODUCTION_ORIGIN).href;
  if (!new RegExp(`Sitemap:\\s*${escapeRegExp(expectedSitemap)}`, "i").test(body)) {
    throw new Error("robots.txt missing production sitemap URL");
  }
  if (blocksAllCrawlers(body)) {
    throw new Error("robots.txt blocks crawling with Disallow: /");
  }
}

async function assertSitemap(request, timeoutMs) {
  const response = await request("/sitemap.xml");
  assertOk(response, "/sitemap.xml");

  const xRobots = headerValue(response.headers, "x-robots-tag");
  if (isNoindex(xRobots)) {
    throw new Error("/sitemap.xml has blocking X-Robots-Tag");
  }

  const sitemapXml = await readTextWithLimit(response, {
    label: "sitemap XML",
    maxBytes: MAX_SITEMAP_XML_BYTES,
    timeoutMs,
  });
  const locs = extractLocs(sitemapXml);
  if (locs.length > MAX_SITEMAP_LOCS) {
    throw new Error(`sitemap has too many URLs: ${locs.length} > ${MAX_SITEMAP_LOCS}`);
  }
  const missingLocs = REQUIRED_SITEMAP_LOCS.filter((loc) => !locs.includes(loc));
  assertNoMissing("required sitemap URLs", missingLocs);

  const oldUrls = locs.filter((loc) =>
    OLD_SITEMAP_URL_PATTERNS.some((pattern) => pattern.test(loc)),
  );
  assertNone("old sitemap URLs present", oldUrls);

  return locs;
}

async function assertHtmlPages(request, timeoutMs) {
  const failures = [];

  for (const page of REQUIRED_HTML_PAGES) {
    const response = await request(page.path, { redirect: "manual" });
    if (response.status !== 200) {
      failures.push(`page returned ${response.status}: ${page.path}`);
      continue;
    }

    const xRobots = headerValue(response.headers, "x-robots-tag");
    if (isNoindex(xRobots)) {
      failures.push(`blocking X-Robots-Tag header on key page: ${page.path}`);
    }

    let html;
    try {
      html = await readTextWithLimit(response, {
        label: `key page HTML: ${page.path}`,
        maxBytes: MAX_SITEMAP_HTML_BYTES,
        timeoutMs,
      });
    } catch (error) {
      failures.push(error.message);
      continue;
    }
    const canonicals = extractCanonicalTags(html);
    const robotsTags = extractRobotsTags(html);
    const schemaNodes = extractJsonLdNodes(html, page.path);
    const schemaTypes = collectJsonLdTypes(schemaNodes);

    if (canonicals.length !== 1 || canonicals[0] !== page.canonical) {
      failures.push(`page canonical invalid: ${page.path}`);
    }
    if (robotsTags.length !== 1 || robotsTags[0] !== "index, follow") {
      failures.push(`page robots invalid: ${page.path}`);
    }
    if (!schemaTypes.includes(page.type)) {
      failures.push(`page schema missing ${page.type}: ${page.path}`);
    }
    if (page.datePublished || page.dateModified) {
      const articleNode = schemaNodes.find((node) => nodeHasJsonLdType(node, page.type));
      if (
        !articleNode ||
        articleNode.datePublished !== page.datePublished ||
        articleNode.dateModified !== page.dateModified
      ) {
        failures.push(`page schema dates invalid: ${page.path}`);
      }
    }
    if (schemaTypes.includes("FAQPage")) {
      failures.push(`FAQPage JSON-LD present: ${page.path}`);
    }
  }

  assertNone("page SEO invalid", failures);
}

async function assertSitemapFaqPageAbsent(request, locs, timeoutMs) {
  const failures = [];
  let activeRequests = 0;
  let peakRequests = 0;
  const keyUrls = new Set(
    REQUIRED_HTML_PAGES.map(({ path }) => new URL(path, PRODUCTION_ORIGIN).href),
  );
  const pages = locs
    .map((loc) => new URL(loc))
    .filter((url) => {
      if (url.origin !== PRODUCTION_ORIGIN) {
        failures.push(`sitemap URL origin invalid: ${url.href}`);
        return false;
      }
      if (url.pathname.startsWith("//")) {
        failures.push(`sitemap URL path invalid: ${url.pathname}`);
        return false;
      }
      return !keyUrls.has(url.href);
    })
    .map((url) => ({ href: url.href, path: `${url.pathname || "/"}${url.search}` }));

  for (let index = 0; index < pages.length; index += SITEMAP_CHECK_CONCURRENCY) {
    const chunk = pages.slice(index, index + SITEMAP_CHECK_CONCURRENCY);
    await Promise.all(
      chunk.map(async ({ href, path }) => {
        activeRequests += 1;
        peakRequests = Math.max(peakRequests, activeRequests);
        try {
          const response = await request(href, { redirect: "manual" });
          if (response.status !== 200) {
            failures.push(`sitemap page returned ${response.status}: ${path}`);
            return;
          }
          const html = await readTextWithLimit(response, {
            label: `sitemap page HTML: ${path}`,
            maxBytes: MAX_SITEMAP_HTML_BYTES,
            timeoutMs,
          });
          const schemaTypes = collectJsonLdTypes(extractJsonLdNodes(html, path));
          if (schemaTypes.includes("FAQPage")) {
            failures.push(`FAQPage JSON-LD present: ${path}`);
          }
        } finally {
          activeRequests -= 1;
        }
      }),
    );
  }

  assertNone("sitemap page SEO invalid", failures);
  return peakRequests;
}

async function assertUtilities(request) {
  const failures = [];

  for (const path of UTILITY_NOINDEX_PATHS) {
    const response = await request(path);
    if (!response.ok || !isNoindexFollow(headerValue(response.headers, "x-robots-tag"))) {
      failures.push(`utility X-Robots-Tag invalid: ${path}`);
    }
  }

  assertNone("utility SEO invalid", failures);
}

async function followRedirect(request, baseUrl, source) {
  const visited = [];
  let current = source;

  for (let hop = 0; hop < 6; hop += 1) {
    visited.push(current);
    const response = await request(current, { redirect: "manual" });

    if (response.status < 300 || response.status >= 400) {
      return {
        finalPath: current,
        status: response.status,
        chain: visited,
      };
    }

    const location = headerValue(response.headers, "location");
    if (!location) throw new Error(`redirect missing Location: ${current}`);
    const nextUrl = new URL(location, baseUrl);
    if (nextUrl.origin !== baseUrl) {
      return {
        finalPath: nextUrl.pathname || "/",
        invalidOriginUrl: nextUrl.href,
        status: response.status,
        chain: visited,
      };
    }
    current = nextUrl.pathname || "/";
  }

  throw new Error(`redirect loop or too many hops: ${source}`);
}

async function assertRedirects(request, baseUrl, { requireDirectChangedRedirects }) {
  const failures = [];

  for (const redirect of REQUIRED_REDIRECTS) {
    const result = await followRedirect(request, baseUrl, redirect.source);
    if (result.invalidOriginUrl) {
      failures.push(`redirect origin invalid: ${redirect.source} -> ${result.invalidOriginUrl}`);
      continue;
    }
    if (result.finalPath !== redirect.destination) {
      failures.push(
        `redirect final destination invalid: ${redirect.source} -> ${result.finalPath}`,
      );
    }
    if (result.status !== 200) {
      failures.push(`redirect final status invalid: ${redirect.source} -> ${result.status}`);
    }
    if (
      requireDirectChangedRedirects &&
      CHANGED_DIRECT_REDIRECT_SOURCES.has(redirect.source) &&
      result.chain.length > 2
    ) {
      failures.push(
        `redirect should be direct after deployment: ${redirect.source} -> ${redirect.destination}`,
      );
    }
  }

  assertNone("redirects invalid", failures);
}

async function assertBridgeHostRedirects(request, baseUrl) {
  const failures = [];
  const allowedBridgeOrigins = new Set([
    baseUrl,
    ...BRIDGE_HOST_REDIRECTS.map(({ source }) => new URL(source).origin),
  ]);

  for (const redirect of BRIDGE_HOST_REDIRECTS) {
    const expected = new URL(redirect.destinationPath, baseUrl).href;
    let current = redirect.source;
    let resolved = false;

    for (let hop = 0; hop < 6; hop += 1) {
      const currentUrl = new URL(current, baseUrl);
      const response = await request(currentUrl.href, { redirect: "manual" });

      if (response.status < 300 || response.status >= 400) {
        resolved = true;
        if (currentUrl.href !== expected) {
          failures.push(`bridge host final destination invalid: ${redirect.source} -> ${currentUrl.href}`);
        }
        if (response.status !== 200) {
          failures.push(`bridge host final status invalid: ${redirect.source} -> ${response.status}`);
        }
        break;
      }

      if (response.status !== 308 && response.status !== 301) {
        failures.push(`bridge host status invalid: ${redirect.source} -> ${response.status}`);
        resolved = true;
        break;
      }

      const location = headerValue(response.headers, "location");
      if (!location) {
        failures.push(`bridge host location invalid: ${redirect.source} -> <missing>`);
        resolved = true;
        break;
      }

      const nextUrl = new URL(location, currentUrl);
      if (!allowedBridgeOrigins.has(nextUrl.origin)) {
        failures.push(`bridge host origin invalid: ${redirect.source} -> ${nextUrl.href}`);
        resolved = true;
        break;
      }

      current = nextUrl.href;
    }

    if (!resolved) {
      failures.push(`bridge host redirect loop or too many hops: ${redirect.source}`);
    }
  }

  assertNone("bridge host redirects invalid", failures);
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const request = await createRequester(args);

  await assertRobots(request);
  const sitemapLocs = await assertSitemap(request, args.timeoutMs);
  await assertHtmlPages(request, args.timeoutMs);
  const sitemapPeakConcurrency = await assertSitemapFaqPageAbsent(
    request,
    sitemapLocs,
    args.timeoutMs,
  );
  await assertUtilities(request);
  await assertRedirects(request, args.baseUrl, args);
  await assertBridgeHostRedirects(request, args.baseUrl);

  console.log("[seo-deployed] robots ok");
  console.log(`[seo-deployed] sitemap locs ok: ${sitemapLocs.length}`);
  console.log(`[seo-deployed] key pages ok: ${REQUIRED_HTML_PAGES.length}`);
  console.log(`[seo-deployed] utility noindex headers ok: ${UTILITY_NOINDEX_PATHS.length}`);
  console.log(
    `[seo-deployed] sitemap FAQPage absent ok: ${sitemapLocs.length}; max concurrency: ${sitemapPeakConcurrency}`,
  );
  console.log(`[seo-deployed] redirects ok: ${REQUIRED_REDIRECTS.length}`);
  console.log(`[seo-deployed] bridge host redirects ok: ${BRIDGE_HOST_REDIRECTS.length}`);
  if (args.requireDirectChangedRedirects) {
    console.log(`[seo-deployed] direct changed redirects ok: ${CHANGED_DIRECT_REDIRECT_SOURCES.size}`);
  }
  console.log("[seo-deployed] old URLs absent from sitemap");
}

run().catch((err) => {
  console.error(`[seo-deployed] ${err.message}`);
  process.exit(1);
});
