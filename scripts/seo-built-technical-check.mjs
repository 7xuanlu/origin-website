#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const CANONICAL_ORIGIN = "https://wenlan.app";
const BRIDGE_HOST_REDIRECTS = [
  "www.wenlan.app",
  "useorigin.app",
  "www.useorigin.app",
].map((host) => ({
  source: "/:path*",
  destination: `${CANONICAL_ORIGIN}/:path*`,
  statusCode: 308,
  has: [{ type: "host", value: host }],
}));

const REBRAND_REDIRECTS = [
  { source: "/learn/origin-for-claude-code", destination: "/learn/wenlan-for-claude-code", statusCode: 308 },
  {
    source: "/learn/claude-code-memory-command-vs-origin",
    destination: "/learn/claude-code-memory-command-vs-wenlan",
    statusCode: 308,
  },
  {
    source: "/learn/where-origin-stores-claude-code-memory",
    destination: "/learn/where-wenlan-stores-claude-code-memory",
    statusCode: 308,
  },
  { source: "/learn/origin-vs-basic-memory", destination: "/learn/wenlan-vs-basic-memory", statusCode: 308 },
  { source: "/learn/origin-vs-claude-mem", destination: "/learn/wenlan-vs-claude-mem", statusCode: 308 },
  {
    source: "/learn/origin-vs-superlocal-memory",
    destination: "/learn/wenlan-vs-superlocal-memory",
    statusCode: 308,
  },
  { source: "/learn/origin-codex-workflow", destination: "/learn/wenlan-codex-workflow", statusCode: 308 },
  { source: "/learn/origin-cursor-workflow", destination: "/learn/wenlan-cursor-workflow", statusCode: 308 },
  {
    source: "/learn/origin-claude-desktop-workflow",
    destination: "/learn/wenlan-claude-desktop-workflow",
    statusCode: 308,
  },
  {
    source: "/learn/origin-gemini-cli-workflow",
    destination: "/learn/wenlan-gemini-cli-workflow",
    statusCode: 308,
  },
  {
    source: "/learn/origin-vscode-mcp-workflow",
    destination: "/learn/wenlan-vscode-mcp-workflow",
    statusCode: 308,
  },
  {
    source: "/learn/origin-vs-mcp-memory-service",
    destination: "/learn/wenlan-vs-mcp-memory-service",
    statusCode: 308,
  },
  {
    source: "/learn/origin-vs-chatgpt-memory",
    destination: "/learn/wenlan-vs-chatgpt-memory",
    statusCode: 308,
  },
  {
    source: "/learn/origin-vs-obsidian-ai-memory",
    destination: "/learn/wenlan-vs-obsidian-ai-memory",
    statusCode: 308,
  },
  { source: "/learn/origin-vs-notion-ai", destination: "/learn/wenlan-vs-notion-ai", statusCode: 308 },
  { source: "/learn/origin-vs-mem0", destination: "/learn/wenlan-vs-mem0", statusCode: 308 },
];

const REQUIRED_REDIRECTS = [
  ...BRIDGE_HOST_REDIRECTS,
  ...REBRAND_REDIRECTS,
  { source: "/learn/ai-memory-app", destination: "/learn/ai-work-memory", statusCode: 308 },
  { source: "/guides", destination: "/learn", statusCode: 308 },
  { source: "/guides/:slug", destination: "/learn/:slug", statusCode: 308 },
  { source: "/docs/guides", destination: "/learn", statusCode: 308 },
  { source: "/docs/guides/:slug", destination: "/learn/:slug", statusCode: 308 },
  { source: "/guides/ai-memory-app", destination: "/learn/ai-work-memory", statusCode: 308 },
  {
    source: "/docs/guides/ai-memory-app",
    destination: "/learn/ai-work-memory",
    statusCode: 308,
  },
];

const REQUIRED_NOINDEX_HEADERS = [
  { source: "/examples/:path*", value: "noindex" },
  { source: "/llms.txt", value: "noindex, follow" },
  { source: "/llms-full.txt", value: "noindex, follow" },
  { source: "/feed.xml", value: "noindex, follow" },
  { source: "/humans.txt", value: "noindex, follow" },
  { source: "/manifest.webmanifest", value: "noindex, follow" },
  { source: "/.well-known/security.txt", value: "noindex, follow" },
  { source: "/_next/static/media/:path*", value: "noindex" },
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
  "https://wenlan.app/learn/wenlan-vs-superlocal-memory",
  "https://wenlan.app/docs/configuration",
  "https://wenlan.app/docs/product-matrix",
];
const REQUIRED_ROBOTS_SITEMAP = "https://wenlan.app/sitemap.xml";

const REQUIRED_HTML_PAGES = [
  { path: "index.html", canonical: "https://wenlan.app", type: "SoftwareApplication" },
  { path: "download.html", canonical: "https://wenlan.app/download", type: "WebPage" },
  {
    path: "zh-TW/download.html",
    canonical: "https://wenlan.app/zh-TW/download",
    type: "WebPage",
  },
  {
    path: "zh-CN/download.html",
    canonical: "https://wenlan.app/zh-CN/download",
    type: "WebPage",
  },
  { path: "learn.html", canonical: "https://wenlan.app/learn", type: "CollectionPage" },
  {
    path: "learn/claude-code-memory.html",
    canonical: "https://wenlan.app/learn/claude-code-memory",
    type: "Article",
  },
  {
    path: "learn/mcp-memory-server.html",
    canonical: "https://wenlan.app/learn/mcp-memory-server",
    type: "Article",
    requiredLinks: [
      {
        href: "/docs/mcp-clients",
        label: "Read all MCP client setup paths",
      },
    ],
  },
  {
    path: "learn/how-to-add-mcp-memory-to-cursor.html",
    canonical: "https://wenlan.app/learn/how-to-add-mcp-memory-to-cursor",
    type: "Article",
  },
  {
    path: "learn/ai-work-memory.html",
    canonical: "https://wenlan.app/learn/ai-work-memory",
    type: "Article",
  },
  {
    path: "zh-TW/learn/distilled-wiki-pages-ai-memory.html",
    canonical: "https://wenlan.app/zh-TW/learn/distilled-wiki-pages-ai-memory",
    type: "Article",
  },
  {
    path: "zh-CN/learn/distilled-wiki-pages-ai-memory.html",
    canonical: "https://wenlan.app/zh-CN/learn/distilled-wiki-pages-ai-memory",
    type: "Article",
  },
  {
    path: "zh-TW/learn/source-backed-wiki-pages-ai-work.html",
    canonical: "https://wenlan.app/zh-TW/learn/source-backed-wiki-pages-ai-work",
    type: "Article",
  },
  {
    path: "zh-CN/learn/source-backed-wiki-pages-ai-work.html",
    canonical: "https://wenlan.app/zh-CN/learn/source-backed-wiki-pages-ai-work",
    type: "Article",
  },
  {
    path: "zh-TW/learn/wenlan-vs-obsidian-ai-memory.html",
    canonical: "https://wenlan.app/zh-TW/learn/wenlan-vs-obsidian-ai-memory",
    type: "Article",
    datePublished: "2026-07-22",
    dateModified: "2026-08-01",
  },
  {
    path: "zh-CN/learn/wenlan-vs-obsidian-ai-memory.html",
    canonical: "https://wenlan.app/zh-CN/learn/wenlan-vs-obsidian-ai-memory",
    type: "Article",
    datePublished: "2026-08-01",
    dateModified: "2026-08-01",
  },
  {
    path: "learn/build-local-ai-knowledge-base-from-documents.html",
    canonical: "https://wenlan.app/learn/build-local-ai-knowledge-base-from-documents",
    type: "Article",
    datePublished: "2026-08-01",
    dateModified: "2026-08-01",
  },
  {
    path: "zh-TW/learn/build-local-ai-knowledge-base-from-documents.html",
    canonical: "https://wenlan.app/zh-TW/learn/build-local-ai-knowledge-base-from-documents",
    type: "Article",
    datePublished: "2026-08-01",
    dateModified: "2026-08-01",
  },
  {
    path: "zh-CN/learn/build-local-ai-knowledge-base-from-documents.html",
    canonical: "https://wenlan.app/zh-CN/learn/build-local-ai-knowledge-base-from-documents",
    type: "Article",
    datePublished: "2026-08-01",
    dateModified: "2026-08-01",
  },
  {
    path: "learn/choose-ai-knowledge-base-tool.html",
    canonical: "https://wenlan.app/learn/choose-ai-knowledge-base-tool",
    type: "Article",
    datePublished: "2026-08-02",
    dateModified: "2026-09-07",
  },
  {
    path: "zh-TW/learn/choose-ai-knowledge-base-tool.html",
    canonical: "https://wenlan.app/zh-TW/learn/choose-ai-knowledge-base-tool",
    type: "Article",
    datePublished: "2026-08-02",
    dateModified: "2026-09-07",
  },
  {
    path: "zh-CN/learn/choose-ai-knowledge-base-tool.html",
    canonical: "https://wenlan.app/zh-CN/learn/choose-ai-knowledge-base-tool",
    type: "Article",
    datePublished: "2026-08-02",
    dateModified: "2026-09-07",
  },
  {
    path: "learn/wenlan-vs-superlocal-memory.html",
    canonical: "https://wenlan.app/learn/wenlan-vs-superlocal-memory",
    type: "Article",
  },
  {
    path: "docs/configuration.html",
    canonical: "https://wenlan.app/docs/configuration",
    type: "TechArticle",
    requiredLinks: [
      {
        href: "/learn/claude-code-memory",
        label: "Read the Claude Code memory guide",
      },
    ],
  },
  {
    path: "docs/product-matrix.html",
    canonical: "https://wenlan.app/docs/product-matrix",
    type: "TechArticle",
  },
];

const REDIRECT_ORDER_RULES = [
  {
    before: "/guides/ai-memory-app",
    after: "/guides/:slug",
  },
  {
    before: "/docs/guides/ai-memory-app",
    after: "/docs/guides/:slug",
  },
];

const BUILD_AFFECTING_SOURCE_PATHS = ["next.config.ts", "src", "public"];
const FRESHNESS_TOLERANCE_MS = 1_000;

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") continue;
    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${arg}`);
    }

    const key = arg.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }

    args[key] = value;
    i += 1;
  }

  return {
    buildDir: resolve(process.cwd(), args["build-dir"] ?? ".next"),
    sourceRoot: resolve(process.cwd(), args["source-root"] ?? "."),
  };
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function maybeStat(path) {
  try {
    return await stat(path);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

function hasRedirect(redirects, expected) {
  return redirectIndex(redirects, expected) !== -1;
}

function redirectIndex(redirects, expected) {
  return redirects.findIndex(
    (redirect) =>
      redirect.source === expected.source &&
      redirect.destination === expected.destination &&
      redirect.statusCode === expected.statusCode &&
      hasMatchingConditions(redirect, expected),
  );
}

function hasMatchingConditions(redirect, expected) {
  if (!expected.has) return true;

  return expected.has.every((expectedCondition) =>
    redirect.has?.some(
      (condition) =>
        condition.type === expectedCondition.type &&
        condition.value === expectedCondition.value,
    ),
  );
}

function redirectIndexBySource(redirects, source) {
  return redirects.findIndex((redirect) => redirect.source === source);
}

function hasHeader(headers, expected) {
  return headers.some(
    (entry) =>
      entry.source === expected.source &&
      entry.headers?.some(
        (header) =>
          header.key.toLowerCase() === "x-robots-tag" &&
          header.value === expected.value,
      ),
  );
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
  const invalidScripts = [];

  for (const match of html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      nodes.push(...collectJsonLdNodes(JSON.parse(match[1])));
    } catch {
      invalidScripts.push(pagePath);
    }
  }

  if (invalidScripts.length) {
    throw new Error(`invalid JSON-LD: ${invalidScripts.join(", ")}`);
  }

  return nodes;
}

function routeSourceMatchesPath(source, path) {
  if (source === path) return true;

  const pattern = source
    .split("/")
    .map((part) => {
      if (!part) return "";
      if (part.startsWith(":") && part.endsWith("*")) return "(?:/.*)?";
      if (part.startsWith(":") && part.endsWith("+")) return "/.+";
      if (part.startsWith(":")) return "/[^/]+";
      return `/${part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`;
    })
    .join("");

  return new RegExp(`^${pattern || "/"}$`).test(path);
}

function routePathFromCanonical(canonical) {
  return new URL(canonical).pathname || "/";
}

function isBlockingRobotsValue(value) {
  return /\bnoindex\b/i.test(value);
}

function blocksAllCrawlers(robotsTxt) {
  return /^\s*disallow\s*:\s*\/\s*(?:#.*)?$/im.test(robotsTxt);
}

function displayHtmlPath(path) {
  return path.startsWith("app/") ? path.slice(4) : path;
}

function blockingHeaderMatchesPage(headerEntry, pagePath) {
  if (!routeSourceMatchesPath(headerEntry.source, pagePath)) return false;

  return headerEntry.headers?.some(
    (header) =>
      header.key.toLowerCase() === "x-robots-tag" &&
      isBlockingRobotsValue(header.value),
  );
}

async function listHtmlFiles(root, current = root) {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(root, path)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(relative(root, path));
    }
  }

  return files;
}

async function newestFile(root, current = root, newest = null) {
  const entries = await readdir(current, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(current, entry.name);
    if (entry.isDirectory()) {
      newest = await newestFile(root, path, newest);
    } else if (entry.isFile()) {
      const stats = await stat(path);
      if (!newest || stats.mtimeMs > newest.mtimeMs) {
        newest = {
          path,
          mtimeMs: stats.mtimeMs,
        };
      }
    }
  }

  return newest;
}

async function newestBuildAffectingSource(sourceRoot) {
  let newest = null;

  for (const sourcePath of BUILD_AFFECTING_SOURCE_PATHS) {
    const absolutePath = resolve(sourceRoot, sourcePath);
    const stats = await maybeStat(absolutePath);
    if (!stats) continue;

    if (stats.isDirectory()) {
      newest = await newestFile(sourceRoot, absolutePath, newest);
    } else if (stats.isFile() && (!newest || stats.mtimeMs > newest.mtimeMs)) {
      newest = {
        path: absolutePath,
        mtimeMs: stats.mtimeMs,
      };
    }
  }

  return newest;
}

async function assertFreshBuild({ buildDir, sourceRoot }) {
  const buildMarkerPath = resolve(buildDir, "routes-manifest.json");
  const buildMarkerStats = await stat(buildMarkerPath);
  const newestSource = await newestBuildAffectingSource(sourceRoot);

  if (
    newestSource &&
    newestSource.mtimeMs > buildMarkerStats.mtimeMs + FRESHNESS_TOLERANCE_MS
  ) {
    throw new Error(
      [
        "stale build output: run `pnpm build` before `pnpm seo:technical:built`",
        `${relative(sourceRoot, newestSource.path)} is newer than ${relative(
          buildDir,
          buildMarkerPath,
        )}`,
      ].join("; "),
    );
  }
}

function assertNoMissing(label, missing) {
  if (missing.length) {
    throw new Error(`${label} missing: ${missing.join(", ")}`);
  }
}

function assertNone(label, values) {
  if (values.length) {
    throw new Error(`${label}: ${values.join(", ")}`);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasAnchor(html, { href, label }) {
  return new RegExp(
    `<a\\b(?=[^>]*\\bhref="${escapeRegExp(href)}")[^>]*>${escapeRegExp(label)}</a>`,
  ).test(html);
}

async function readRequiredPageHtml({ buildDir }, page) {
  const htmlPath = resolve(buildDir, "server/app", page.path);
  try {
    return await readFile(htmlPath, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }

  throw new Error(`page output missing: ${page.path}`);
}

function assertGlobalNotFoundHtml(html) {
  const failures = [];

  if (!html.includes("This page does not exist.")) {
    failures.push("missing branded Wenlan fallback copy");
  }
  if (html.includes("404: This page could not be found.")) {
    failures.push("contains generic Next.js fallback copy");
  }

  assertNone("global unmatched-route 404 invalid", failures);
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  await assertFreshBuild(args);
  const globalNotFoundHtml = await readFile(
    resolve(args.buildDir, "server/app/_not-found.html"),
    "utf8",
  );
  assertGlobalNotFoundHtml(globalNotFoundHtml);

  const routesManifest = await readJson(resolve(args.buildDir, "routes-manifest.json"));
  const sitemap = await readFile(
    resolve(args.buildDir, "server/app/sitemap.xml.body"),
    "utf8",
  );
  const robotsTxt = await readFile(
    resolve(args.buildDir, "server/app/robots.txt.body"),
    "utf8",
  );

  const missingRedirects = REQUIRED_REDIRECTS
    .filter((expected) => !hasRedirect(routesManifest.redirects ?? [], expected))
    .map((redirect) => `${redirect.source} -> ${redirect.destination}`);
  assertNoMissing("required redirects", missingRedirects);

  const redirectOrderFailures = REDIRECT_ORDER_RULES.filter((rule) => {
    const beforeIndex = redirectIndexBySource(routesManifest.redirects ?? [], rule.before);
    const afterIndex = redirectIndexBySource(routesManifest.redirects ?? [], rule.after);
    return beforeIndex === -1 || afterIndex === -1 || beforeIndex > afterIndex;
  }).map((rule) => `${rule.before} must appear before ${rule.after}`);
  assertNone("redirect order invalid", redirectOrderFailures);

  const missingHeaders = REQUIRED_NOINDEX_HEADERS
    .filter((expected) => !hasHeader(routesManifest.headers ?? [], expected))
    .map((header) => `${header.source} ${header.value}`);
  assertNoMissing("required noindex headers", missingHeaders);

  const locs = extractLocs(sitemap);
  const missingLocs = REQUIRED_SITEMAP_LOCS.filter((loc) => !locs.includes(loc));
  assertNoMissing("required sitemap URLs", missingLocs);

  const oldUrls = locs.filter((loc) =>
    OLD_SITEMAP_URL_PATTERNS.some((pattern) => pattern.test(loc)),
  );
  assertNone("old sitemap URLs present", oldUrls);

  if (!new RegExp(`Sitemap:\\s*${escapeRegExp(REQUIRED_ROBOTS_SITEMAP)}`, "i").test(robotsTxt)) {
    throw new Error("robots.txt missing production sitemap URL");
  }
  if (blocksAllCrawlers(robotsTxt)) {
    throw new Error("robots.txt blocks crawling with Disallow: /");
  }

  const pageFailures = [];
  for (const page of REQUIRED_HTML_PAGES) {
    const html = await readRequiredPageHtml(args, page);

    const canonicals = extractCanonicalTags(html);
    const robotsTags = extractRobotsTags(html);
    const schemaNodes = extractJsonLdNodes(html, page.path);
    const schemaTypes = collectJsonLdTypes(schemaNodes);
    const pageRoutePath = routePathFromCanonical(page.canonical);

    if (canonicals.length !== 1 || canonicals[0] !== page.canonical) {
      pageFailures.push(`page canonical invalid: ${page.path}`);
    }
    if (robotsTags.length !== 1 || robotsTags[0] !== "index, follow") {
      pageFailures.push(`page robots invalid: ${page.path}`);
    }
    if (!schemaTypes.includes(page.type)) {
      pageFailures.push(`page schema missing ${page.type}: ${page.path}`);
    }
    if (page.datePublished || page.dateModified) {
      const articleNode = schemaNodes.find((node) => nodeHasJsonLdType(node, page.type));
      if (
        !articleNode ||
        articleNode.datePublished !== page.datePublished ||
        articleNode.dateModified !== page.dateModified
      ) {
        pageFailures.push(`page schema dates invalid: ${page.path}`);
      }
    }
    if (schemaTypes.includes("FAQPage")) {
      pageFailures.push(`FAQPage JSON-LD present: ${page.path}`);
    }
    for (const link of page.requiredLinks ?? []) {
      if (!hasAnchor(html, link)) {
        pageFailures.push(`required internal link missing: ${page.path} -> ${link.href}`);
      }
    }
    if (
      (routesManifest.headers ?? []).some((headerEntry) =>
        blockingHeaderMatchesPage(headerEntry, pageRoutePath),
      )
    ) {
      pageFailures.push(`blocking X-Robots-Tag header on key pages: ${page.path}`);
    }
  }

  const htmlRoot = resolve(args.buildDir, "server");
  const allHtmlFiles = await listHtmlFiles(htmlRoot);
  for (const htmlPath of allHtmlFiles) {
    const html = await readFile(resolve(htmlRoot, htmlPath), "utf8");
    const displayedHtmlPath = displayHtmlPath(htmlPath);
    const schemaTypes = collectJsonLdTypes(extractJsonLdNodes(html, displayedHtmlPath));
    if (schemaTypes.includes("FAQPage")) {
      pageFailures.push(`FAQPage JSON-LD present: ${displayedHtmlPath}`);
    }
  }

  assertNone("page SEO invalid", pageFailures);

  console.log("[seo-built] global 404 ok");
  console.log(`[seo-built] redirects ok: ${REQUIRED_REDIRECTS.length}`);
  console.log(`[seo-built] noindex headers ok: ${REQUIRED_NOINDEX_HEADERS.length}`);
  console.log(`[seo-built] sitemap locs ok: ${locs.length}`);
  console.log(`[seo-built] sitemap required locs ok: ${REQUIRED_SITEMAP_LOCS.length}`);
  console.log("[seo-built] robots ok");
  console.log(`[seo-built] html page checks ok: ${REQUIRED_HTML_PAGES.length}`);
  console.log(`[seo-built] all html FAQPage absent ok: ${allHtmlFiles.length}`);
  console.log("[seo-built] old URLs absent from sitemap");
}

run().catch((err) => {
  console.error(`[seo-built] ${err.message}`);
  process.exit(1);
});
