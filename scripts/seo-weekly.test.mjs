import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const fixtureRoot = resolve(__dirname, "fixtures/seo-weekly");
const builtCheckerScript = resolve(repoRoot, "scripts/seo-built-technical-check.mjs");
const deployedCheckerScript = resolve(repoRoot, "scripts/seo-deployed-technical-check.mjs");
const aiVisibilityScript = resolve(repoRoot, "scripts/seo-ai-visibility-worksheet.mjs");
const gscFetchScript = resolve(repoRoot, "scripts/seo-gsc-fetch.mjs");
const englishRouteGroupAliases = new Map([
  ["src/app/layout.tsx", "src/app/root-document.tsx"],
  ["src/app/page.tsx", "src/app/(en)/page.tsx"],
  ["src/app/opengraph-image.tsx", "src/app/(en)/opengraph-image.tsx"],
  ["src/app/feed.xml/route.ts", "src/app/(en)/feed.xml/route.ts"],
  ["src/app/llms-full.txt/route.ts", "src/app/(en)/llms-full.txt/route.ts"],
]);

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

async function runWeeklyFixture(
  outputPath,
  {
    queriesPath = resolve(fixtureRoot, "gsc-queries.csv"),
    pagesPath = resolve(fixtureRoot, "gsc-pages.csv"),
  } = {},
) {
  await execFileAsync(
    process.execPath,
    [
      resolve(repoRoot, "scripts/seo-weekly.mjs"),
      "--",
      "--queries",
      queriesPath,
      "--pages",
      pagesPath,
      "--date",
      "2026-06-13",
      "--output",
      outputPath,
    ],
    { cwd: repoRoot },
  );
}

const rebrandRedirectPairs = [
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
const canonicalOrigin = "https://wenlan.app";
const bridgeHosts = [
  "www.wenlan.app",
  "useorigin.app",
  "www.useorigin.app",
];
const requiredBuiltBridgeRedirects = bridgeHosts.map((host) => ({
  source: "/:path*",
  destination: `${canonicalOrigin}/:path*`,
  statusCode: 308,
  has: [{ type: "host", value: host }],
}));
const requiredBuiltRedirects = [
  ...requiredBuiltBridgeRedirects,
  ...rebrandRedirectPairs.map(([source, destination]) => ({
    source,
    destination,
    statusCode: 308,
  })),
  { source: "/learn/ai-memory-app", destination: "/learn/ai-work-memory", statusCode: 308 },
  { source: "/guides/ai-memory-app", destination: "/learn/ai-work-memory", statusCode: 308 },
  { source: "/guides", destination: "/learn", statusCode: 308 },
  { source: "/guides/:slug", destination: "/learn/:slug", statusCode: 308 },
  { source: "/docs/guides", destination: "/learn", statusCode: 308 },
  {
    source: "/docs/guides/ai-memory-app",
    destination: "/learn/ai-work-memory",
    statusCode: 308,
  },
  { source: "/docs/guides/:slug", destination: "/learn/:slug", statusCode: 308 },
];
const requiredBuiltHeaders = [
  {
    source: "/llms.txt",
    headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
  },
  {
    source: "/llms-full.txt",
    headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
  },
  {
    source: "/feed.xml",
    headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
  },
  {
    source: "/humans.txt",
    headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
  },
  {
    source: "/manifest.webmanifest",
    headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
  },
  {
    source: "/.well-known/security.txt",
    headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
  },
  {
    source: "/_next/static/media/:path*",
    headers: [{ key: "X-Robots-Tag", value: "noindex" }],
  },
];
const requiredLocalizedLearnPaths = [
  "/zh-TW/learn/distilled-wiki-pages-ai-memory",
  "/zh-CN/learn/distilled-wiki-pages-ai-memory",
  "/zh-TW/learn/source-backed-wiki-pages-ai-work",
  "/zh-CN/learn/source-backed-wiki-pages-ai-work",
  "/zh-TW/learn/wenlan-vs-obsidian-ai-memory",
  "/zh-CN/learn/wenlan-vs-obsidian-ai-memory",
  "/zh-TW/learn/build-local-ai-knowledge-base-from-documents",
  "/zh-CN/learn/build-local-ai-knowledge-base-from-documents",
  "/zh-TW/learn/choose-ai-knowledge-base-tool",
  "/zh-CN/learn/choose-ai-knowledge-base-tool",
  "/zh-TW/learn/verify-ai-knowledge-base-citations",
  "/zh-CN/learn/verify-ai-knowledge-base-citations",
  "/zh-TW/learn/test-ai-knowledge-base-retrieval-after-changes",
  "/zh-CN/learn/test-ai-knowledge-base-retrieval-after-changes",
];
const requiredLocalizedLearnLocs = requiredLocalizedLearnPaths.map(
  (path) => `https://wenlan.app${path}`,
);
const expectedArticleDates = new Map([
  [
    "/learn/test-ai-knowledge-base-retrieval-after-changes",
    { datePublished: "2026-08-26", dateModified: "2026-08-26" },
  ],
  [
    "/zh-TW/learn/test-ai-knowledge-base-retrieval-after-changes",
    { datePublished: "2026-08-26", dateModified: "2026-08-26" },
  ],
  [
    "/zh-CN/learn/test-ai-knowledge-base-retrieval-after-changes",
    { datePublished: "2026-08-26", dateModified: "2026-08-26" },
  ],
  [
    "/learn/verify-ai-knowledge-base-citations",
    { datePublished: "2026-08-23", dateModified: "2026-08-23" },
  ],
  [
    "/learn/choose-ai-knowledge-base-tool",
    { datePublished: "2026-08-02", dateModified: "2026-09-07" },
  ],
  [
    "/learn/build-local-ai-knowledge-base-from-documents",
    { datePublished: "2026-08-01", dateModified: "2026-08-01" },
  ],
  [
    "/zh-TW/learn/wenlan-vs-obsidian-ai-memory",
    { datePublished: "2026-07-22", dateModified: "2026-08-01" },
  ],
  [
    "/zh-CN/learn/wenlan-vs-obsidian-ai-memory",
    { datePublished: "2026-08-01", dateModified: "2026-08-01" },
  ],
  [
    "/zh-TW/learn/build-local-ai-knowledge-base-from-documents",
    { datePublished: "2026-08-01", dateModified: "2026-08-01" },
  ],
  [
    "/zh-CN/learn/build-local-ai-knowledge-base-from-documents",
    { datePublished: "2026-08-01", dateModified: "2026-08-01" },
  ],
  [
    "/zh-TW/learn/choose-ai-knowledge-base-tool",
    { datePublished: "2026-08-02", dateModified: "2026-09-07" },
  ],
  [
    "/zh-CN/learn/choose-ai-knowledge-base-tool",
    { datePublished: "2026-08-02", dateModified: "2026-09-07" },
  ],
  [
    "/zh-TW/learn/verify-ai-knowledge-base-citations",
    { datePublished: "2026-08-23", dateModified: "2026-08-23" },
  ],
  [
    "/zh-CN/learn/verify-ai-knowledge-base-citations",
    { datePublished: "2026-08-23", dateModified: "2026-08-23" },
  ],
]);
const builtArticleDates = new Map(expectedArticleDates);
const requiredLocalizedBuiltHtmlPages = requiredLocalizedLearnPaths.map((path) => ({
  path: `${path.slice(1)}.html`,
  canonical: `https://wenlan.app${path}`,
  type: "Article",
  ...builtArticleDates.get(path),
}));
const requiredBuiltSitemapLocs = [
  "https://wenlan.app",
  "https://wenlan.app/download",
  "https://wenlan.app/zh-TW/download",
  "https://wenlan.app/zh-CN/download",
  "https://wenlan.app/learn",
  "https://wenlan.app/learn/claude-code-memory",
  "https://wenlan.app/learn/mcp-memory-server",
  "https://wenlan.app/learn/how-to-add-mcp-memory-to-cursor",
  "https://wenlan.app/learn/ai-work-memory",
  "https://wenlan.app/learn/wenlan-vs-superlocal-memory",
  "https://wenlan.app/learn/build-local-ai-knowledge-base-from-documents",
  "https://wenlan.app/learn/choose-ai-knowledge-base-tool",
  "https://wenlan.app/learn/verify-ai-knowledge-base-citations",
  "https://wenlan.app/learn/test-ai-knowledge-base-retrieval-after-changes",
  ...requiredLocalizedLearnLocs,
  "https://wenlan.app/docs/configuration",
  "https://wenlan.app/docs/product-matrix",
];
const requiredBuiltHtmlPages = [
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
    path: "learn/wenlan-vs-superlocal-memory.html",
    canonical: "https://wenlan.app/learn/wenlan-vs-superlocal-memory",
    type: "Article",
  },
  {
    path: "learn/build-local-ai-knowledge-base-from-documents.html",
    canonical: "https://wenlan.app/learn/build-local-ai-knowledge-base-from-documents",
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
    path: "learn/verify-ai-knowledge-base-citations.html",
    canonical: "https://wenlan.app/learn/verify-ai-knowledge-base-citations",
    type: "Article",
    datePublished: "2026-08-23",
    dateModified: "2026-08-23",
  },
  {
    path: "learn/test-ai-knowledge-base-retrieval-after-changes.html",
    canonical: "https://wenlan.app/learn/test-ai-knowledge-base-retrieval-after-changes",
    type: "Article",
    datePublished: "2026-08-26",
    dateModified: "2026-08-26",
  },
  ...requiredLocalizedBuiltHtmlPages,
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
const allowedRobotsTxt = "User-agent: *\nAllow: /\nSitemap: https://wenlan.app/sitemap.xml\n";
const requiredDeployedUrls = [
  "/",
  "/download",
  "/zh-TW/download",
  "/zh-CN/download",
  "/learn",
  "/learn/claude-code-memory",
  "/learn/mcp-memory-server",
  "/learn/how-to-add-mcp-memory-to-cursor",
  "/learn/ai-work-memory",
  "/learn/wenlan-vs-superlocal-memory",
  "/learn/build-local-ai-knowledge-base-from-documents",
  "/learn/choose-ai-knowledge-base-tool",
  "/learn/verify-ai-knowledge-base-citations",
  "/learn/test-ai-knowledge-base-retrieval-after-changes",
  ...requiredLocalizedLearnPaths,
  "/docs/configuration",
  "/docs/product-matrix",
];
const requiredDeployedUtilityUrls = [
  "/llms.txt",
  "/llms-full.txt",
  "/feed.xml",
  "/humans.txt",
  "/manifest.webmanifest",
  "/.well-known/security.txt",
];
const deployedRedirects = [
  ...rebrandRedirectPairs,
  ["/learn/ai-memory-app", "/learn/ai-work-memory"],
  ["/guides", "/learn"],
  ["/guides/claude-code-memory", "/learn/claude-code-memory"],
  ["/guides/mcp-memory-server", "/learn/mcp-memory-server"],
  ["/guides/local-first-ai-memory", "/learn/local-first-ai-memory"],
  ["/guides/ai-memory-app", "/learn/ai-work-memory"],
  ["/docs/guides", "/learn"],
  ["/docs/guides/claude-code-memory", "/learn/claude-code-memory"],
  ["/docs/guides/ai-memory-app", "/learn/ai-work-memory"],
];

function builtHtmlPage(page, overrides = {}) {
  const { canonical, type, requiredLinks = [] } = page;
  const typeName = overrides.type ?? type;
  const canonicalHref = overrides.canonical ?? canonical;
  const robots = overrides.robots ?? "index, follow";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": typeName,
    ...(overrides.datePublished ?? page.datePublished
      ? { datePublished: overrides.datePublished ?? page.datePublished }
      : {}),
    ...(overrides.dateModified ?? page.dateModified
      ? { dateModified: overrides.dateModified ?? page.dateModified }
      : {}),
  };
  const extraSchema = overrides.extraSchema ?? "";
  const extraHead = overrides.extraHead ?? "";
  const body =
    overrides.body ??
    (requiredLinks.length
      ? requiredLinks
          .map((link) => `<a href="${link.href}">${link.label}</a>`)
          .join("")
      : "ok");

  return [
    "<!DOCTYPE html><html><head>",
    `<link rel="canonical" href="${canonicalHref}"/>`,
    `<meta name="robots" content="${robots}"/>`,
    `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`,
    extraSchema,
    extraHead,
    `</head><body>${body}</body></html>`,
  ].join("");
}

function deployedHtmlPage(path, overrides = {}) {
  const canonical =
    overrides.canonical ??
    `https://wenlan.app${path === "/" ? "" : path}`;
  const robots = overrides.robots ?? "index, follow";
  const type =
    overrides.type ??
    (path === "/"
      ? "SoftwareApplication"
      : path === "/download" || path.endsWith("/download")
        ? "WebPage"
      : path === "/learn"
        ? "CollectionPage"
        : path === "/docs/configuration" || path === "/docs/product-matrix"
          ? "TechArticle"
          : "Article");
  const requiredLinks = {
    "/learn/mcp-memory-server": [
      '<a href="/learn/claude-code-memory">Read the Claude Code memory guide</a>',
    ],
    "/docs/configuration": [
      '<a href="/learn/claude-code-memory">Read the Claude Code memory guide</a>',
    ],
  };
  const body = overrides.body ?? (requiredLinks[path] ?? ["ok"]).join("");
  const extraSchema = overrides.extraSchema ?? "";
  const extraHead = overrides.extraHead ?? "";
  const expectedDates = expectedArticleDates.get(path) ?? {};
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": type,
    ...(overrides.datePublished ?? expectedDates.datePublished
      ? { datePublished: overrides.datePublished ?? expectedDates.datePublished }
      : {}),
    ...(overrides.dateModified ?? expectedDates.dateModified
      ? { dateModified: overrides.dateModified ?? expectedDates.dateModified }
      : {}),
  };

  return [
    "<!DOCTYPE html><html><head>",
    `<link rel="canonical" href="${canonical}"/>`,
    `<meta name="robots" content="${robots}"/>`,
    `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`,
    extraSchema,
    extraHead,
    `</head><body>${body}</body></html>`,
  ].join("");
}

function deployedSitemap(overrides = {}) {
  const locs =
    overrides.locs ??
    requiredDeployedUrls.map((path) => `https://wenlan.app${path === "/" ? "" : path}`);

  return ["<urlset>", ...locs.map((loc) => `<url><loc>${loc}</loc></url>`), "</urlset>"].join(
    "",
  );
}

async function withDeployedFixture(overrides, callback) {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-deployed-fixture-"));
  const responses = {};

  for (const [source, destination] of overrides.redirects ?? deployedRedirects) {
    responses[source] = {
      status: 308,
      headers: { location: destination },
      body: "",
    };
  }

  for (const host of bridgeHosts) {
    responses[`${host}/`] = {
      status: 308,
      headers: { location: `${canonicalOrigin}/` },
      body: "",
    };
    responses[`${host}/learn`] = {
      status: 308,
      headers: { location: `${canonicalOrigin}/learn` },
      body: "",
    };
  }
  Object.assign(responses, overrides.bridgeResponses ?? {});

  responses["/robots.txt"] = {
    status: 200,
    headers: { "content-type": "text/plain" },
    body:
      overrides.robotsTxt ??
      allowedRobotsTxt,
  };

  responses["/sitemap.xml"] = {
    status: 200,
    headers: {
      "content-type": "application/xml",
      ...(overrides.sitemapHeaders ?? {}),
    },
    body: overrides.sitemap ?? deployedSitemap(overrides),
  };

  for (const path of requiredDeployedUtilityUrls) {
    responses[path] = {
      status: 200,
      headers: overrides.utilityHeaders?.[path] ?? {
        "x-robots-tag": "noindex, follow",
      },
      body: "ok",
    };
  }

  const deployedPagePaths = [
    ...new Set([
      ...requiredDeployedUrls,
      ...(overrides.locs ?? []).map((loc) => new URL(loc).pathname || "/"),
      ...(overrides.redirects ?? deployedRedirects).map(([, destination]) => destination),
    ]),
  ];

  for (const path of deployedPagePaths) {
    if (responses[path]) continue;
    const pageOverrides = overrides.pages?.[path] ?? {};
    responses[path] = {
      status: pageOverrides.status ?? 200,
      headers: pageOverrides.headers ?? {},
      body: deployedHtmlPage(path, pageOverrides),
      delayMs: pageOverrides.delayMs ?? 0,
    };
  }
  Object.assign(responses, overrides.additionalResponses ?? {});

  await writeFile(
    join(outputRoot, "responses.json"),
    JSON.stringify(responses, null, 2),
    "utf8",
  );

  try {
    return await callback(outputRoot);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
}

async function writePipelineGscInput(inputDir, metadataOverrides = {}) {
  await mkdir(inputDir, { recursive: true });
  await Promise.all([
    writeFile(
      join(inputDir, "gsc-queries.csv"),
      await readFile(resolve(fixtureRoot, "gsc-queries.csv"), "utf8"),
      "utf8",
    ),
    writeFile(
      join(inputDir, "gsc-pages.csv"),
      await readFile(resolve(fixtureRoot, "gsc-pages.csv"), "utf8"),
      "utf8",
    ),
  ]);
  await writeFile(
    join(inputDir, "gsc-metadata.json"),
    JSON.stringify(
      {
        siteUrl: "sc-domain:wenlan.app",
        startDate: "2026-05-10",
        endDate: "2026-06-06",
        source: "Search Console API",
        propertyTotals: {
          clicks: 3,
          impressions: 70,
          ctr: 3 / 70,
          position: 10.2,
          aggregationType: "byProperty",
        },
        ...metadataOverrides,
      },
      null,
      2,
    ),
    "utf8",
  );
}

async function writeBuiltSeoFixture(outputRoot, overrides = {}) {
  const buildDir = join(outputRoot, ".next");
  await mkdir(join(buildDir, "server/app"), { recursive: true });
  await writeFile(
    join(buildDir, "routes-manifest.json"),
    JSON.stringify({
      redirects: overrides.redirects ?? requiredBuiltRedirects,
      headers: overrides.headers ?? requiredBuiltHeaders,
    }),
    "utf8",
  );
  await writeFile(
    join(buildDir, "server/app/sitemap.xml.body"),
    [
      "<urlset>",
      ...(overrides.locs ?? requiredBuiltSitemapLocs).map(
        (loc) => `<url><loc>${loc}</loc></url>`,
      ),
      "</urlset>",
    ].join(""),
    "utf8",
  );
  await writeFile(
    join(buildDir, "server/app/robots.txt.body"),
    overrides.robotsTxt ?? allowedRobotsTxt,
    "utf8",
  );
  for (const page of requiredBuiltHtmlPages) {
    const pageOverrides = overrides.htmlPages?.[page.path] ?? {};
    const htmlPath = join(buildDir, "server/app", page.path);
    await mkdir(dirname(htmlPath), { recursive: true });
    await writeFile(htmlPath, builtHtmlPage(page, pageOverrides), "utf8");
  }
  await writeFile(
    join(buildDir, "server/app/_not-found.html"),
    overrides.notFoundHtml ?? "<!DOCTYPE html><html><body>This page does not exist.</body></html>",
    "utf8",
  );
  return buildDir;
}

test("weekly SEO template separates property totals from visible table metrics", async () => {
  const template = await readFile(
    resolve(repoRoot, "docs/seo-audits/weekly-template.md"),
    "utf8",
  );

  assert.match(template, /\| Property clicks \| - \|/);
  assert.match(template, /\| Property impressions \| - \|/);
  assert.match(template, /\| Visible query table clicks \| - \|/);
  assert.match(template, /\| Visible query table impressions \| - \|/);
  assert.match(template, /\| Query visibility gap \| - \|/);
  assert.doesNotMatch(template, /\| Total (clicks|impressions) \|/);
  assert.doesNotMatch(template, /\| Average (CTR|position) \|/);
});

test("package scripts include AI visibility worksheet generator", async () => {
  const packageJson = JSON.parse(await readFile(resolve(repoRoot, "package.json"), "utf8"));

  assert.equal(
    packageJson.scripts["seo:ai-visibility"],
    "node scripts/seo-ai-visibility-worksheet.mjs",
  );
});

test("package scripts include GSC API fetcher", async () => {
  const packageJson = JSON.parse(await readFile(resolve(repoRoot, "package.json"), "utf8"));

  assert.equal(packageJson.scripts["seo:gsc:fetch"], "node scripts/seo-gsc-fetch.mjs");
});

test("package scripts include Vercel Web Analytics fetcher", async () => {
  const packageJson = JSON.parse(await readFile(resolve(repoRoot, "package.json"), "utf8"));

  assert.equal(packageJson.scripts["seo:vercel:fetch"], "node scripts/seo-vercel-fetch.mjs");
});

test("GSC API fetcher defaults to the Wenlan temporary input directory", async () => {
  const script = await readFile(gscFetchScript, "utf8");

  assert.match(script, /const DEFAULT_OUTPUT_DIR = "\/tmp\/wenlan-seo";/);
  assert.doesNotMatch(script, /const DEFAULT_OUTPUT_DIR = "\/tmp\/origin-seo";/);
});

test("package SEO sample writes to Wenlan temporary output", async () => {
  const packageJson = JSON.parse(await readFile(resolve(repoRoot, "package.json"), "utf8"));

  assert.match(packageJson.scripts["seo:weekly:sample"], /\/tmp\/wenlan-weekly-seo-sample\.md/);
  assert.match(packageJson.scripts["seo:weekly:sample"], /--allow-fixture-input true/);
  assert.doesNotMatch(packageJson.scripts["seo:weekly:sample"], /\/tmp\/origin-weekly-seo-sample\.md/);
  assert.equal(packageJson.scripts["seo:weekly"], "node scripts/seo-weekly-pipeline.mjs");
});

test("GSC API fetcher normalizes search analytics fixture rows into weekly CSVs", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-gsc-fetch-"));
  try {
    const fixtureDir = join(outputRoot, "fixtures");
    const outputDir = join(outputRoot, "exports");
    await mkdir(fixtureDir, { recursive: true });
    await writeFile(
      join(fixtureDir, "searchanalytics-query.json"),
      JSON.stringify({
        rows: [
          {
            keys: ["claude code memory"],
            clicks: 1,
            impressions: 12,
            ctr: 1 / 12,
            position: 12.34,
          },
        ],
      }),
      "utf8",
    );
    await writeFile(
      join(fixtureDir, "searchanalytics-page.json"),
      JSON.stringify({
        rows: [
          {
            keys: ["https://wenlan.app/learn/claude-code-memory"],
            clicks: 0,
            impressions: 37,
            ctr: 0,
            position: 33.12,
          },
        ],
      }),
      "utf8",
    );
    await writeFile(
      join(fixtureDir, "searchanalytics-query-page.json"),
      JSON.stringify({
        rows: [
          {
            keys: [
              "claude code memory",
              "https://wenlan.app/learn/claude-code-memory",
            ],
            clicks: 1,
            impressions: 11,
            ctr: 1 / 11,
            position: 12.45,
          },
        ],
        responseAggregationType: "byPage",
      }),
      "utf8",
    );
    await writeFile(
      join(fixtureDir, "searchanalytics-property.json"),
      JSON.stringify({
        rows: [
          {
            clicks: 3,
            impressions: 67,
            ctr: 3 / 67,
            position: 10.223880597,
          },
        ],
        responseAggregationType: "byProperty",
      }),
      "utf8",
    );
    await writeFile(
      join(fixtureDir, "sitemaps.json"),
      JSON.stringify({ sitemap: [{ path: "https://wenlan.app/sitemap.xml" }] }),
      "utf8",
    );

    const { stdout } = await execFileAsync(
      process.execPath,
      [
        gscFetchScript,
        "--",
        "--start-date",
        "2026-05-25",
        "--end-date",
        "2026-06-21",
        "--fixture-dir",
        fixtureDir,
        "--output-dir",
        outputDir,
      ],
      { cwd: repoRoot },
    );

    assert.match(stdout, /"queryRows": 1/);
    assert.match(stdout, /"pageRows": 1/);
    assert.match(stdout, /"queryPageRows": 1/);
    assert.match(stdout, /"sitemapCount": 1/);

    const queriesCsv = await readFile(join(outputDir, "gsc-queries.csv"), "utf8");
    const pagesCsv = await readFile(join(outputDir, "gsc-pages.csv"), "utf8");
    const queryPages = JSON.parse(
      await readFile(join(outputDir, "gsc-query-pages.json"), "utf8"),
    );
    const metadata = JSON.parse(await readFile(join(outputDir, "gsc-metadata.json"), "utf8"));

    assert.match(
      queriesCsv,
      /^Query,Clicks,Impressions,CTR,Position,Start date,End date,Source/m,
    );
    assert.match(
      queriesCsv,
      /claude code memory,1,12,8\.33%,12\.3,2026-05-25,2026-06-21,Search Console API fixture/,
    );
    assert.match(
      pagesCsv,
      /https:\/\/wenlan\.app\/learn\/claude-code-memory,0,37,0\.00%,33\.1,2026-05-25,2026-06-21,Search Console API fixture/,
    );
    assert.equal(queryPages.siteUrl, "sc-domain:wenlan.app");
    assert.equal(queryPages.startDate, "2026-05-25");
    assert.equal(queryPages.endDate, "2026-06-21");
    assert.deepEqual(queryPages.dimensions, ["query", "page"]);
    assert.deepEqual(queryPages.nativeUnits, {
      clicks: "clicks",
      impressions: "impressions",
      ctr: "ratio",
      position: "average position",
    });
    assert.equal(queryPages.responseAggregationType, "byPage");
    assert.equal(queryPages.rowCount, 1);
    assert.deepEqual(queryPages.rows[0].keys, [
      "claude code memory",
      "https://wenlan.app/learn/claude-code-memory",
    ]);
    assert.equal(metadata.siteUrl, "sc-domain:wenlan.app");
    assert.equal(metadata.source, "Search Console API fixture");
    assert.equal(metadata.queryPageRows, 1);
    assert.deepEqual(metadata.propertyTotals, {
      clicks: 3,
      impressions: 67,
      ctr: 3 / 67,
      position: 10.223880597,
      aggregationType: "byProperty",
    });
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("GSC API fetcher derives the last 28 complete days from report date", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-gsc-fetch-date-"));
  try {
    const fixtureDir = join(outputRoot, "fixtures");
    const outputDir = join(outputRoot, "exports");
    await mkdir(fixtureDir, { recursive: true });
    await writeFile(
      join(fixtureDir, "searchanalytics-query.json"),
      JSON.stringify({
        rows: [
          {
            keys: ["claude code memory"],
            clicks: 1,
            impressions: 12,
            ctr: 1 / 12,
            position: 12.34,
          },
        ],
      }),
      "utf8",
    );
    await writeFile(
      join(fixtureDir, "searchanalytics-page.json"),
      JSON.stringify({
        rows: [
          {
            keys: ["https://wenlan.app/learn/claude-code-memory"],
            clicks: 0,
            impressions: 37,
            ctr: 0,
            position: 33.12,
          },
        ],
      }),
      "utf8",
    );
    await writeFile(
      join(fixtureDir, "searchanalytics-query-page.json"),
      JSON.stringify({
        rows: [],
        responseAggregationType: "byPage",
      }),
      "utf8",
    );
    await writeFile(
      join(fixtureDir, "searchanalytics-property.json"),
      JSON.stringify({ rows: [], responseAggregationType: "byProperty" }),
      "utf8",
    );
    await writeFile(join(fixtureDir, "sitemaps.json"), JSON.stringify({}), "utf8");

    await execFileAsync(
      process.execPath,
      [
        gscFetchScript,
        "--",
        "--date",
        "2026-06-22",
        "--fixture-dir",
        fixtureDir,
        "--output-dir",
        outputDir,
      ],
      { cwd: repoRoot },
    );

    const metadata = JSON.parse(await readFile(join(outputDir, "gsc-metadata.json"), "utf8"));
    const queriesCsv = await readFile(join(outputDir, "gsc-queries.csv"), "utf8");

    assert.equal(metadata.startDate, "2026-05-25");
    assert.equal(metadata.endDate, "2026-06-21");
    assert.match(queriesCsv, /2026-05-25,2026-06-21,Search Console API fixture/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("GSC API fetcher rejects mixed report date and explicit date range", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-gsc-fetch-mixed-date-"));
  try {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          gscFetchScript,
          "--",
          "--date",
          "2026-06-22",
          "--start-date",
          "2026-05-25",
          "--end-date",
          "2026-06-21",
          "--output-dir",
          outputRoot,
        ],
        {
          cwd: repoRoot,
          env: { ...process.env, GSC_ACCESS_TOKEN: "" },
        },
      ),
      /Use either --date or --start-date\/--end-date, not both/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("GSC API fetcher falls back to ADC and sends the quota project header", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-gsc-fetch-adc-"));
  try {
    const binDir = join(outputRoot, "bin");
    const exportDir = join(outputRoot, "exports");
    const fetchLogPath = join(outputRoot, "fetch-log.jsonl");
    const gcloudLogPath = join(outputRoot, "gcloud-log.txt");
    const fetchMockPath = join(outputRoot, "mock-fetch.mjs");
    await mkdir(binDir, { recursive: true });
    await writeFile(
      join(binDir, "gcloud"),
      [
        "#!/bin/sh",
        `printf '%s\\n' "$*" > ${JSON.stringify(gcloudLogPath)}`,
        "if [ \"$*\" = \"auth application-default print-access-token\" ]; then",
        "  printf '%s\\n' adc-token-from-gcloud",
        "  exit 0",
        "fi",
        "exit 2",
        "",
      ].join("\n"),
      { mode: 0o755 },
    );
    await writeFile(
      fetchMockPath,
      [
        "import { appendFileSync } from 'node:fs';",
        "const logPath = process.env.GSC_FETCH_TEST_LOG;",
        "globalThis.fetch = async (url, options = {}) => {",
        "  appendFileSync(logPath, JSON.stringify({ url: String(url), headers: options.headers ?? {}, body: options.body ?? null }) + '\\n');",
        "  const request = JSON.parse(options.body ?? '{}');",
        "  const body = String(url).endsWith('/sitemaps')",
        "    ? { sitemap: [{ path: 'https://wenlan.app/sitemap.xml' }] }",
        "    : request.aggregationType === 'byProperty'",
        "      ? { rows: [{ clicks: 3, impressions: 67, ctr: 3 / 67, position: 10.2 }], responseAggregationType: 'byProperty' }",
        "      : { rows: [{ keys: ['wenlan'], clicks: 1, impressions: 2, ctr: 0.5, position: 3.25 }], responseAggregationType: 'byPage' };",
        "  return { ok: true, status: 200, statusText: 'OK', text: async () => JSON.stringify(body) };",
        "};",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        gscFetchScript,
        "--",
        "--start-date",
        "2026-06-06",
        "--end-date",
        "2026-07-03",
        "--site",
        "sc-domain:wenlan.app",
        "--output-dir",
        exportDir,
      ],
      {
        cwd: repoRoot,
        env: {
          ...process.env,
          GSC_ACCESS_TOKEN: "",
          GSC_QUOTA_PROJECT: "",
          GOOGLE_CLOUD_QUOTA_PROJECT: "",
          GSC_FETCH_TEST_LOG: fetchLogPath,
          NODE_OPTIONS: `--import ${fetchMockPath}`,
          PATH: `${binDir}:${process.env.PATH}`,
        },
      },
    );

    assert.equal(
      await readFile(gcloudLogPath, "utf8"),
      "auth application-default print-access-token\n",
    );

    const calls = (await readFile(fetchLogPath, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(calls.length, 5);
    for (const call of calls) {
      assert.equal(call.headers.authorization, "Bearer adc-token-from-gcloud");
      assert.equal(call.headers["x-goog-user-project"], "wenlan-500502");
    }

    const metadata = JSON.parse(await readFile(join(exportDir, "gsc-metadata.json"), "utf8"));
    assert.equal(metadata.siteUrl, "sc-domain:wenlan.app");
    assert.equal(metadata.propertyTotals.impressions, 67);
    const analyticsBodies = calls
      .filter((call) => !call.url.endsWith("/sitemaps"))
      .map((call) => JSON.parse(call.body));
    assert.equal(
      analyticsBodies.filter((body) => body.aggregationType === "byProperty").length,
      2,
    );
    assert.equal(
      analyticsBodies.filter(
        (body) => body.aggregationType === "byProperty" && !body.dimensions,
      ).length,
      1,
    );
    assert.equal(
      analyticsBodies.filter(
        (body) => body.aggregationType === "byProperty" && body.dimensions?.[0] === "query",
      ).length,
      1,
    );
    assert.equal(
      analyticsBodies.filter(
        (body) =>
          body.aggregationType === "byPage" &&
          body.dimensions?.join(",") === "query,page",
      ).length,
      1,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("GSC API fetcher uses GSC_ACCESS_TOKEN before ADC when present", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-gsc-fetch-env-token-"));
  try {
    const binDir = join(outputRoot, "bin");
    const exportDir = join(outputRoot, "exports");
    const fetchLogPath = join(outputRoot, "fetch-log.jsonl");
    const fetchMockPath = join(outputRoot, "mock-fetch.mjs");
    await mkdir(binDir, { recursive: true });
    await writeFile(
      join(binDir, "gcloud"),
      ["#!/bin/sh", "exit 42", ""].join("\n"),
      { mode: 0o755 },
    );
    await writeFile(
      fetchMockPath,
      [
        "import { appendFileSync } from 'node:fs';",
        "const logPath = process.env.GSC_FETCH_TEST_LOG;",
        "globalThis.fetch = async (url, options = {}) => {",
        "  appendFileSync(logPath, JSON.stringify({ url: String(url), headers: options.headers ?? {} }) + '\\n');",
        "  const request = JSON.parse(options.body ?? '{}');",
        "  const body = String(url).endsWith('/sitemaps')",
        "    ? { sitemap: [] }",
        "    : request.aggregationType === 'byProperty'",
        "      ? { rows: [], responseAggregationType: 'byProperty' }",
        "      : { rows: [], responseAggregationType: 'byPage' };",
        "  return { ok: true, status: 200, statusText: 'OK', text: async () => JSON.stringify(body) };",
        "};",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        gscFetchScript,
        "--",
        "--date",
        "2026-07-04",
        "--output-dir",
        exportDir,
      ],
      {
        cwd: repoRoot,
        env: {
          ...process.env,
          GSC_ACCESS_TOKEN: "explicit-token",
          GSC_QUOTA_PROJECT: "custom-quota-project",
          GSC_FETCH_TEST_LOG: fetchLogPath,
          NODE_OPTIONS: `--import ${fetchMockPath}`,
          PATH: `${binDir}:${process.env.PATH}`,
        },
      },
    );

    const calls = (await readFile(fetchLogPath, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(calls.length, 5);
    for (const call of calls) {
      assert.equal(call.headers.authorization, "Bearer explicit-token");
      assert.equal(call.headers["x-goog-user-project"], "custom-quota-project");
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("GSC API fetcher sends configured quota project header", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-gsc-fetch-quota-"));
  try {
    const fetchLogPath = join(outputRoot, "fetch-log.jsonl");
    const fetchMockPath = join(outputRoot, "mock-fetch.mjs");
    const apiBaseUrl = "https://gsc-test.invalid/webmasters/v3";
    await writeFile(
      fetchMockPath,
      [
        "import { appendFileSync } from 'node:fs';",
        "const logPath = process.env.GSC_FETCH_TEST_LOG;",
        "globalThis.fetch = async (url, options = {}) => {",
        "  appendFileSync(logPath, JSON.stringify({ url: String(url), headers: options.headers ?? {}, body: options.body ?? null }) + '\\n');",
        "  const request = JSON.parse(options.body ?? '{}');",
        "  const body = String(url).endsWith('/sitemaps')",
        "    ? { sitemap: [{ path: 'https://wenlan.app/sitemap.xml' }] }",
        "    : request.aggregationType === 'byProperty'",
        "      ? { rows: [], responseAggregationType: 'byProperty' }",
        "      : { rows: [], responseAggregationType: 'byPage' };",
        "  return { ok: true, status: 200, statusText: 'OK', text: async () => JSON.stringify(body) };",
        "};",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        gscFetchScript,
        "--",
        "--date",
        "2026-07-03",
        "--output-dir",
        outputRoot,
      ],
      {
        cwd: repoRoot,
        env: {
          ...process.env,
          GSC_ACCESS_TOKEN: "test-token",
          GSC_QUOTA_PROJECT: "wenlan-500502",
          GSC_API_BASE_URL: apiBaseUrl,
          GSC_FETCH_TEST_LOG: fetchLogPath,
          NODE_OPTIONS: `--import ${fetchMockPath}`,
        },
      },
    );

    const requests = (await readFile(fetchLogPath, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(requests.length, 5);
    for (const request of requests) {
      assert.match(request.url, new RegExp(`^${apiBaseUrl}/`));
      assert.equal(request.headers.authorization, "Bearer test-token");
      assert.equal(request.headers["x-goog-user-project"], "wenlan-500502");
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("AI visibility worksheet generator turns measurement prompts into manual rows", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-ai-visibility-"));
  try {
    const promptsDoc = join(outputRoot, "measurement.md");
    const outputPath = join(outputRoot, "ai-visibility.md");

    await writeFile(
      promptsDoc,
      [
        "# Measurement",
        "",
        "## AI Visibility Prompts",
        "",
        "Run the same prompts monthly.",
        "",
        "1. What is the best AI work memory for people who use Claude Code and Cursor?",
        "2. What MCP memory server should I use for persistent memory across Claude Code and Cursor?",
        "",
        "## Next Section",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        aiVisibilityScript,
        "--",
        "--date",
        "2026-06-13",
        "--prompts-doc",
        promptsDoc,
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const worksheet = await readFile(outputPath, "utf8");

    assert.match(worksheet, /^# AI Visibility Worksheet — 2026-06-13/m);
    assert.match(worksheet, /Do not infer results/);
    assert.match(worksheet, /Wenlan appears\?/);
    assert.doesNotMatch(worksheet, new RegExp("Or" + "igin appears\\?"));
    assert.match(
      worksheet,
      /\| 1 \| What is the best AI work memory for people who use Claude Code and Cursor\? \| Claude \| manual \| manual \| manual \| manual \| manual \| manual \|/,
    );
    assert.match(
      worksheet,
      /\| 2 \| What MCP memory server should I use for persistent memory across Claude Code and Cursor\? \| Perplexity \| manual \| manual \| manual \| manual \| manual \| manual \|/,
    );
    assert.doesNotMatch(worksheet, /\| 3 \|/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("AI visibility worksheet generator rejects docs with no prompts", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-ai-visibility-empty-"));
  try {
    const promptsDoc = join(outputRoot, "measurement.md");
    await writeFile(promptsDoc, "# Measurement\n\n## AI Visibility Prompts\n\n", "utf8");

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          aiVisibilityScript,
          "--",
          "--date",
          "2026-06-13",
          "--prompts-doc",
          promptsDoc,
          "--output",
          join(outputRoot, "ai-visibility.md"),
        ],
        { cwd: repoRoot },
      ),
      /No AI visibility prompts found/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("AI visibility worksheet generator requires an explicit date", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-ai-visibility-date-"));
  try {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          aiVisibilityScript,
          "--",
          "--output",
          join(outputRoot, "ai-visibility.md"),
        ],
        { cwd: repoRoot },
      ),
      /Missing required --date/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("AI visibility worksheet generator does not overwrite existing worksheets without force", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-ai-visibility-clobber-"));
  try {
    const outputPath = join(outputRoot, "ai-visibility.md");
    await writeFile(outputPath, "filled manual results\n", "utf8");

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          aiVisibilityScript,
          "--",
          "--date",
          "2026-06-13",
          "--output",
          outputPath,
        ],
        { cwd: repoRoot },
      ),
      /Refusing to overwrite existing worksheet/,
    );

    assert.equal(await readFile(outputPath, "utf8"), "filled manual results\n");
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("AI visibility worksheet generator supports explicit force overwrite", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-ai-visibility-force-"));
  try {
    const outputPath = join(outputRoot, "ai-visibility.md");
    await writeFile(outputPath, "filled manual results\n", "utf8");

    await execFileAsync(
      process.execPath,
      [
        aiVisibilityScript,
        "--",
        "--date",
        "2026-06-13",
        "--output",
        outputPath,
        "--force",
        "true",
      ],
      { cwd: repoRoot },
    );

    const worksheet = await readFile(outputPath, "utf8");
    assert.match(worksheet, /^# AI Visibility Worksheet — 2026-06-13/m);
    assert.doesNotMatch(worksheet, /filled manual results/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("AI visibility worksheet generator rejects non-contiguous prompt numbering", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-ai-visibility-numbering-"));
  try {
    const promptsDoc = join(outputRoot, "measurement.md");
    await writeFile(
      promptsDoc,
      [
        "# Measurement",
        "",
        "## AI Visibility Prompts",
        "",
        "1. First prompt?",
        "3. Third prompt?",
        "",
      ].join("\n"),
      "utf8",
    );

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          aiVisibilityScript,
          "--",
          "--date",
          "2026-06-13",
          "--prompts-doc",
          promptsDoc,
          "--output",
          join(outputRoot, "ai-visibility.md"),
        ],
        { cwd: repoRoot },
      ),
      /AI visibility prompt numbering must be contiguous/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("AI visibility worksheet generator reads the current 28-prompt measurement list", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-ai-visibility-current-"));
  try {
    const outputPath = join(outputRoot, "ai-visibility.md");

    await execFileAsync(
      process.execPath,
      [
        aiVisibilityScript,
        "--",
        "--date",
        "2026-06-13",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const worksheet = await readFile(outputPath, "utf8");
    const rows = worksheet
      .split("\n")
      .filter((line) => /^\| \d+ \|/.test(line));

    assert.equal(rows.length, 112);
    assert.match(worksheet, /Generated from `docs\/seo-measurement\.md`\./);
    assert.doesNotMatch(worksheet, new RegExp(repoRoot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(worksheet, /\| 28 \| What should I capture in AI work memory\? \| Perplexity \|/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("package scripts include deployed technical SEO checker", async () => {
  const packageJson = JSON.parse(await readFile(resolve(repoRoot, "package.json"), "utf8"));

  assert.equal(
    packageJson.scripts["seo:technical:deployed"],
    "node scripts/seo-deployed-technical-check.mjs",
  );
});

test("deployed technical SEO checker verifies robots, sitemap, key pages, utilities, and redirects", async () => {
  await withDeployedFixture({}, async (fixtureDir) => {
    const { stdout } = await execFileAsync(
      process.execPath,
      [
        deployedCheckerScript,
        "--",
        "--fixture-dir",
        fixtureDir,
      ],
      { cwd: repoRoot },
    );

    assert.match(stdout, /robots ok/);
    assert.match(stdout, /sitemap locs ok: 30/);
    assert.match(stdout, /key pages ok: 30/);
    assert.match(stdout, /utility noindex headers ok: 6/);
    assert.match(stdout, /redirects ok: 25/);
    assert.match(stdout, /bridge host redirects ok: 6/);
    assert.match(stdout, /old URLs absent from sitemap/);
  });
});

test("deployed technical SEO checker accepts www.useorigin.app bridge through apex", async () => {
  await withDeployedFixture(
    {
      bridgeResponses: {
        "www.useorigin.app/": {
          status: 301,
          headers: { location: "https://useorigin.app/" },
          body: "",
        },
        "www.useorigin.app/learn": {
          status: 301,
          headers: { location: "https://useorigin.app/learn" },
          body: "",
        },
      },
    },
    async (fixtureDir) => {
      const { stdout } = await execFileAsync(
        process.execPath,
        [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
        { cwd: repoRoot },
      );

      assert.match(stdout, /bridge host redirects ok: 6/);
    },
  );
});

test("deployed technical SEO checker rejects robots.txt that disallows crawlers", async () => {
  await withDeployedFixture(
    {
      robotsTxt: "User-agent: *\nDisallow: /\nSitemap: https://wenlan.app/sitemap.xml\n",
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /robots\.txt blocks crawling with Disallow: \//,
      );
    },
  );
});

test("deployed technical SEO checker rejects robots.txt without the production sitemap", async () => {
  await withDeployedFixture(
    {
      robotsTxt: "User-agent: *\nAllow: /\n",
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /robots\.txt missing production sitemap URL/,
      );
    },
  );
});

test("deployed technical SEO checker does not require unshipped local internal links", async () => {
  await withDeployedFixture(
    {
      pages: {
        "/learn/mcp-memory-server": {
          body: "currently deployed MCP memory article",
        },
        "/docs/configuration": {
          body: "currently deployed configuration docs",
        },
      },
    },
    async (fixtureDir) => {
      const { stdout } = await execFileAsync(
        process.execPath,
        [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
        { cwd: repoRoot },
      );

      assert.match(stdout, /key pages ok: 30/);
    },
  );
});

test("deployed technical SEO checker rejects old guide URLs in the sitemap", async () => {
  await withDeployedFixture(
    {
      locs: [
        ...requiredBuiltSitemapLocs,
        "https://wenlan.app/guides/claude-code-memory",
      ],
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /old sitemap URLs present: https:\/\/wenlan\.app\/guides\/claude-code-memory/,
      );
    },
  );
});

test("deployed technical SEO checker rejects docs guide URLs and legacy learn URLs in the sitemap", async () => {
  const oldUrlCases = [
    "https://wenlan.app/docs/guides/claude-code-memory",
    "https://wenlan.app/learn/ai-memory-app",
  ];

  for (const oldUrl of oldUrlCases) {
    await withDeployedFixture(
      {
        locs: [
          ...requiredBuiltSitemapLocs,
          oldUrl,
        ],
      },
      async (fixtureDir) => {
        await assert.rejects(
          execFileAsync(
            process.execPath,
            [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
            { cwd: repoRoot },
          ),
          new RegExp(`old sitemap URLs present: ${oldUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
        );
      },
    );
  }
});

test("deployed technical SEO checker rejects network-path sitemap URLs", async () => {
  await withDeployedFixture(
    {
      locs: [
        ...requiredBuiltSitemapLocs,
        "https://wenlan.app//169.254.169.254/latest/meta-data",
      ],
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /sitemap URL path invalid: \/\/169\.254\.169\.254\/latest\/meta-data/,
      );
    },
  );
});

test("deployed technical SEO checker rejects key pages with blocking robots signals or FAQPage schema", async () => {
  await withDeployedFixture(
    {
      pages: {
        "/learn": {
          robots: "noindex, nofollow",
          extraSchema:
            '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage"}</script>',
        },
      },
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /page robots invalid: \/learn/,
      );
    },
  );
});

test("deployed technical SEO checker rejects FAQPage JSON-LD without a robots failure", async () => {
  await withDeployedFixture(
    {
      pages: {
        "/learn": {
          extraSchema:
            '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage"}</script>',
        },
      },
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /FAQPage JSON-LD present: \/learn/,
      );
    },
  );
});

test("deployed technical SEO checker rejects changed localized article dates", async () => {
  await withDeployedFixture(
    {
      pages: {
        "/zh-TW/learn/wenlan-vs-obsidian-ai-memory": {
          datePublished: "2026-08-01",
        },
      },
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /page schema dates invalid: \/zh-TW\/learn\/wenlan-vs-obsidian-ai-memory/,
      );
    },
  );
});

test("deployed technical SEO checker rejects FAQPage JSON-LD on an unlisted sitemap page", async () => {
  const path = "/learn/unlisted-sitemap-page";
  await withDeployedFixture(
    {
      locs: [
        ...requiredBuiltSitemapLocs,
        `https://wenlan.app${path}`,
      ],
      pages: {
        [path]: {
          extraSchema:
            '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage"}</script>',
        },
      },
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /FAQPage JSON-LD present: \/learn\/unlisted-sitemap-page/,
      );
    },
  );
});

test("deployed technical SEO checker requires key pages to return a direct 200", async () => {
  await withDeployedFixture(
    {
      pages: {
        "/learn": {
          status: 308,
          headers: { location: "/learn/claude-code-memory" },
        },
      },
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /page returned 308: \/learn/,
      );
    },
  );
});

test("deployed technical SEO checker scans query-bearing key sitemap URLs", async () => {
  const url = "https://wenlan.app/learn?view=faq";
  await withDeployedFixture(
    {
      locs: [...requiredBuiltSitemapLocs, url],
      additionalResponses: {
        "/learn?view=faq": {
          status: 200,
          headers: {},
          body: deployedHtmlPage("/learn", {
            extraSchema:
              '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage"}</script>',
          }),
        },
      },
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /FAQPage JSON-LD present: \/learn\?view=faq/,
      );
    },
  );
});

test("deployed technical SEO checker bounds sitemap page concurrency", async () => {
  const extraPaths = Array.from({ length: 17 }, (_, index) => `/learn/concurrency-${index}`);
  await withDeployedFixture(
    {
      locs: [
        ...requiredBuiltSitemapLocs,
        ...extraPaths.map((path) => `https://wenlan.app${path}`),
      ],
      pages: Object.fromEntries(extraPaths.map((path) => [path, { delayMs: 100 }])),
    },
    async (fixtureDir) => {
      const { stdout } = await execFileAsync(
        process.execPath,
        [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
        { cwd: repoRoot },
      );

      assert.match(
        stdout,
        new RegExp(
          `sitemap FAQPage absent ok: ${requiredBuiltSitemapLocs.length + extraPaths.length}; max concurrency: 8`,
        ),
      );
      const events = stdout
        .split("\n")
        .filter((line) => line.startsWith("[seo-deployed-fixture] "))
        .map((line) => JSON.parse(line.slice("[seo-deployed-fixture] ".length)))
        .filter(({ path }) => extraPaths.includes(path))
        .sort((left, right) => {
          const a = BigInt(left.at);
          const b = BigInt(right.at);
          return a < b ? -1 : a > b ? 1 : 0;
        });
      let active = 0;
      let observedPeak = 0;
      for (const event of events) {
        active += event.event === "start" ? 1 : -1;
        observedPeak = Math.max(observedPeak, active);
      }
      assert.equal(observedPeak, 8);
    },
  );
});

test("deployed technical SEO checker rejects oversized sitemap XML", async () => {
  await withDeployedFixture(
    { sitemap: `<urlset>${" ".repeat(1_000_001)}</urlset>` },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot, maxBuffer: 4 * 1024 * 1024 },
        ),
        /sitemap XML exceeds 1000000 bytes/,
      );
    },
  );
});

test("deployed technical SEO checker rejects oversized sitemaps", async () => {
  const extraLocs = Array.from(
    { length: 501 },
    (_, index) => `https://wenlan.app/learn/sitemap-limit-${index}`,
  );
  await withDeployedFixture(
    { locs: [...requiredBuiltSitemapLocs, ...extraLocs] },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /sitemap has too many URLs:/,
      );
    },
  );
});

test("deployed technical SEO checker rejects oversized sitemap HTML", async () => {
  const path = "/learn/oversized-html";
  await withDeployedFixture(
    {
      locs: [...requiredBuiltSitemapLocs, `https://wenlan.app${path}`],
      pages: { [path]: { body: "x".repeat(1_000_001) } },
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot, maxBuffer: 4 * 1024 * 1024 },
        ),
        /sitemap page HTML: \/learn\/oversized-html exceeds 1000000 bytes/,
      );
    },
  );
});

test("deployed technical SEO checker rejects oversized key-page HTML", async () => {
  await withDeployedFixture(
    { pages: { "/learn": { body: "x".repeat(1_000_001) } } },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot, maxBuffer: 4 * 1024 * 1024 },
        ),
        /key page HTML: \/learn exceeds 1000000 bytes/,
      );
    },
  );
});

test("deployed technical SEO checker rejects utility URLs without noindex headers", async () => {
  await withDeployedFixture(
    {
      utilityHeaders: {
        "/llms.txt": {},
      },
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /utility X-Robots-Tag invalid: \/llms\.txt/,
      );
    },
  );
});

test("deployed technical SEO checker rejects humans.txt without noindex headers", async () => {
  await withDeployedFixture(
    {
      utilityHeaders: {
        "/humans.txt": {},
      },
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /utility X-Robots-Tag invalid: \/humans\.txt/,
      );
    },
  );
});

test("deployed technical SEO checker rejects old guide redirects that miss the canonical destination", async () => {
  await withDeployedFixture(
    {
      redirects: deployedRedirects.map(([source, destination]) =>
        source === "/guides/mcp-memory-server" ? [source, "/learn/wrong"] : [source, destination],
      ),
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /redirect final destination invalid: \/guides\/mcp-memory-server -> \/learn\/wrong/,
      );
    },
  );
});

test("deployed technical SEO checker rejects old guide redirects to a different origin", async () => {
  await withDeployedFixture(
    {
      redirects: deployedRedirects.map(([source, destination]) =>
        source === "/guides/mcp-memory-server"
          ? [source, "https://wrong.example/learn/mcp-memory-server"]
          : [source, destination],
      ),
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
          { cwd: repoRoot },
        ),
        /redirect origin invalid: \/guides\/mcp-memory-server -> https:\/\/wrong\.example\/learn\/mcp-memory-server/,
      );
    },
  );
});

test("deployed technical SEO checker allows legacy ai-memory redirect hops by default", async () => {
  await withDeployedFixture(
    {
      redirects: deployedRedirects.map(([source, destination]) =>
        source === "/guides/ai-memory-app" ? [source, "/learn/ai-memory-app"] : [source, destination],
      ),
    },
    async (fixtureDir) => {
      const { stdout } = await execFileAsync(
        process.execPath,
        [deployedCheckerScript, "--", "--fixture-dir", fixtureDir],
        { cwd: repoRoot },
      );

      assert.match(stdout, /redirects ok: 25/);
    },
  );
});

test("deployed technical SEO checker strict mode requires changed ai-memory redirects to be direct", async () => {
  await withDeployedFixture(
    {
      redirects: deployedRedirects.map(([source, destination]) =>
        source === "/guides/ai-memory-app" || source === "/docs/guides/ai-memory-app"
          ? [source, "/learn/ai-memory-app"]
          : [source, destination],
      ),
    },
    async (fixtureDir) => {
      await assert.rejects(
        execFileAsync(
          process.execPath,
          [
            deployedCheckerScript,
            "--",
            "--fixture-dir",
            fixtureDir,
            "--require-direct-changed-redirects",
            "true",
          ],
          { cwd: repoRoot },
        ),
        /redirect should be direct after deployment: \/guides\/ai-memory-app -> \/learn\/ai-work-memory/,
      );
    },
  );
});

test("deployed technical SEO checker strict mode passes when changed ai-memory redirects are direct", async () => {
  await withDeployedFixture({}, async (fixtureDir) => {
    const { stdout } = await execFileAsync(
      process.execPath,
      [
        deployedCheckerScript,
        "--",
        "--fixture-dir",
        fixtureDir,
        "--require-direct-changed-redirects",
        "true",
      ],
      { cwd: repoRoot },
    );

    assert.match(stdout, /direct changed redirects ok: 18/);
  });
});

test("built technical SEO checker verifies compiled redirects, headers, and sitemap", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-check-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot);

    const { stdout } = await execFileAsync(
      process.execPath,
      [
        builtCheckerScript,
        "--",
        "--build-dir",
        buildDir,
      ],
      { cwd: repoRoot },
    );

    assert.match(stdout, /redirects ok: 26/);
    assert.match(stdout, /global 404 ok/);
    assert.match(stdout, /noindex headers ok: 7/);
    assert.match(stdout, /sitemap required locs ok: 24/);
    assert.match(stdout, /html page checks ok: 24/);
    assert.match(stdout, /all html FAQPage absent ok: 31/);
    assert.match(stdout, /old URLs absent from sitemap/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects compiled routes without inspectable html", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-route-group-root-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot);
    await rm(join(buildDir, "server/app/index.html"));
    await rm(join(buildDir, "server/app/learn.html"));
    await writeFile(
      join(buildDir, "app-path-routes-manifest.json"),
      JSON.stringify({ "/(en)/page": "/", "/(en)/learn/page": "/learn" }),
      "utf8",
    );

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          builtCheckerScript,
          "--",
          "--build-dir",
          buildDir,
        ],
        { cwd: repoRoot },
      ),
      /page output missing: index\.html/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker requires Product Matrix html", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "wenlan-seo-built-product-matrix-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot);
    const productMatrixPath = join(buildDir, "server/app/docs/product-matrix.html");
    await mkdir(dirname(productMatrixPath), { recursive: true });
    await writeFile(
      productMatrixPath,
      builtHtmlPage({
        path: "docs/product-matrix.html",
        canonical: "https://wenlan.app/docs/product-matrix",
        type: "TechArticle",
      }),
      "utf8",
    );
    await rm(productMatrixPath);

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /page output missing: docs\/product-matrix\.html/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects robots.txt output that disallows crawlers", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-robots-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot, {
      robotsTxt: "User-agent: *\nDisallow: /\nSitemap: https://wenlan.app/sitemap.xml\n",
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /robots\.txt blocks crawling with Disallow: \//,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects robots.txt output without the production sitemap", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-robots-sitemap-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot, {
      robotsTxt: "User-agent: *\nAllow: /\n",
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /robots\.txt missing production sitemap URL/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects the generic global 404 artifact", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-global-404-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot, {
      notFoundHtml: "<!DOCTYPE html><html><body>404: This page could not be found.</body></html>",
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /global unmatched-route 404 invalid/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects stale build output", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-stale-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot);
    const sourceRoot = join(outputRoot, "source");
    const sourcePath = join(sourceRoot, "src/app/page.tsx");
    await mkdir(dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, "export default function Page() { return null; }\n", "utf8");

    const future = new Date(Date.now() + 60_000);
    await utimes(sourcePath, future, future);

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          builtCheckerScript,
          "--",
          "--build-dir",
          buildDir,
          "--source-root",
          sourceRoot,
        ],
        { cwd: repoRoot },
      ),
      /stale build output: run `pnpm build` before `pnpm seo:technical:built`/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects generic guide redirects before specific legacy redirects", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-order-"));
  try {
    const redirects = [
      ...requiredBuiltBridgeRedirects,
      ...rebrandRedirectPairs.map(([source, destination]) => ({
        source,
        destination,
        statusCode: 308,
      })),
      { source: "/learn/ai-memory-app", destination: "/learn/ai-work-memory", statusCode: 308 },
      { source: "/guides", destination: "/learn", statusCode: 308 },
      { source: "/guides/:slug", destination: "/learn/:slug", statusCode: 308 },
      { source: "/guides/ai-memory-app", destination: "/learn/ai-work-memory", statusCode: 308 },
      { source: "/docs/guides", destination: "/learn", statusCode: 308 },
      { source: "/docs/guides/:slug", destination: "/learn/:slug", statusCode: 308 },
      {
        source: "/docs/guides/ai-memory-app",
        destination: "/learn/ai-work-memory",
        statusCode: 308,
      },
    ];
    const buildDir = await writeBuiltSeoFixture(outputRoot, { redirects });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /redirect order invalid/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker requires the legacy learn ai-memory-app redirect", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-learn-redirect-"));
  try {
    const redirects = requiredBuiltRedirects.filter(
      (redirect) => redirect.source !== "/learn/ai-memory-app",
    );
    const buildDir = await writeBuiltSeoFixture(outputRoot, { redirects });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /required redirects missing: \/learn\/ai-memory-app -> \/learn\/ai-work-memory/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects empty or incomplete sitemaps", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-sitemap-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot, {
      locs: ["https://wenlan.app"],
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /required sitemap URLs missing:/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects key pages with wrong canonical URLs", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-canonical-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot, {
      htmlPages: {
        "learn/claude-code-memory.html": {
          canonical: "https://wenlan.app/learn/wrong",
        },
      },
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /page canonical invalid: learn\/claude-code-memory\.html/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects changed localized article dates", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-article-dates-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot, {
      htmlPages: {
        "zh-CN/learn/wenlan-vs-obsidian-ai-memory.html": {
          dateModified: "2026-07-31",
        },
      },
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /page schema dates invalid: zh-CN\/learn\/wenlan-vs-obsidian-ai-memory\.html/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects FAQPage JSON-LD on checked pages", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-faqpage-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot, {
      htmlPages: {
        "learn.html": {
          extraSchema:
            '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage"}</script>',
        },
      },
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /FAQPage JSON-LD present: learn\.html/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects FAQPage JSON-LD on any built HTML page", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-faqpage-any-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot);
    const uncheckedHtmlPath = join(buildDir, "server/app/docs/faq.html");
    await mkdir(dirname(uncheckedHtmlPath), { recursive: true });
    await writeFile(
      uncheckedHtmlPath,
      [
        "<!DOCTYPE html><html><head>",
        '<link rel="canonical" href="https://wenlan.app/docs/faq"/>',
        '<meta name="robots" content="index, follow"/>',
        '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage"}</script>',
        "</head><body>faq</body></html>",
      ].join(""),
      "utf8",
    );

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /FAQPage JSON-LD present: docs\/faq\.html/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects FAQPage JSON-LD outside app HTML", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-faqpage-pages-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot);
    const legacyHtmlPath = join(buildDir, "server/pages/404.html");
    await mkdir(dirname(legacyHtmlPath), { recursive: true });
    await writeFile(
      legacyHtmlPath,
      [
        "<!DOCTYPE html><html><head>",
        '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage"}</script>',
        "</head><body>not found</body></html>",
      ].join(""),
      "utf8",
    );

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /FAQPage JSON-LD present: pages\/404\.html/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects blocking X-Robots-Tag headers on key pages", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-header-block-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot, {
      headers: [
        ...requiredBuiltHeaders,
        {
          source: "/:path*",
          headers: [{ key: "X-Robots-Tag", value: "noindex" }],
        },
      ],
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /blocking X-Robots-Tag header on key pages:/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects schema type strings outside JSON-LD", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-schema-text-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot, {
      htmlPages: {
        "learn.html": {
          type: "BreadcrumbList",
          body: '"@type":"CollectionPage"',
        },
      },
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /page schema missing CollectionPage: learn\.html/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker rejects duplicate conflicting canonical and robots tags", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-duplicates-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot, {
      htmlPages: {
        "learn/mcp-memory-server.html": {
          extraHead:
            '<link rel="canonical" href="https://wenlan.app/learn/wrong"/><meta name="robots" content="noindex, nofollow"/>',
        },
      },
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /page canonical invalid: learn\/mcp-memory-server\.html/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker requires configuration docs to link to Claude Code memory", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-internal-link-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot, {
      htmlPages: {
        "docs/configuration.html": {
          body: "configuration page without the guide link",
        },
      },
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /required internal link missing: docs\/configuration\.html -> \/learn\/claude-code-memory/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("built technical SEO checker requires the MCP article to link to complete client setup", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-built-mcp-link-"));
  try {
    const buildDir = await writeBuiltSeoFixture(outputRoot, {
      htmlPages: {
        "learn/mcp-memory-server.html": {
          body: "MCP article without the complete client setup link",
        },
      },
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [builtCheckerScript, "--", "--build-dir", buildDir],
        { cwd: repoRoot },
      ),
      /required internal link missing: learn\/mcp-memory-server\.html -> \/docs\/mcp-clients/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator turns GSC exports into a ranked Markdown action report", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-weekly-"));
  try {
    const outputPath = join(outputRoot, "2026-06-07-weekly-seo.md");

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        resolve(fixtureRoot, "gsc-queries.csv"),
        "--pages",
        resolve(fixtureRoot, "gsc-pages.csv"),
        "--date",
        "2026-06-07",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(report, /^# Weekly SEO\/GEO Audit — 2026-06-07/m);
    assert.match(report, /\| Property clicks \| manual \/ unavailable \|/);
    assert.match(report, /\| Visible query table clicks \| 1 \|/);
    assert.match(report, /\| Visible query table impressions \| 69 \|/);
    assert.match(report, /\| Visible query table CTR \| 1\.45% \|/);
    assert.match(report, /\| Visible query table average position \| 16\.0 \|/);
    assert.doesNotMatch(report, /\| Total impressions \|/);

    assert.match(report, /## Top Actions/);
    assert.match(report, /title-meta-refresh/);
    assert.match(report, /internal-link-refresh/);
    assert.match(report, /new-article-candidate/);
    assert.match(report, /technical-check/);

    assert.match(
      report,
      /\| `claude code memory` \| Claude Code \| `\/learn\/claude-code-memory` \| 12 \| 0 \| 0\.00% \| 12\.4 \| title-meta-refresh \|/,
    );
    assert.match(
      report,
      /\| `cursor memory mcp` \| Cursor\/Codex workflows \| `\/learn\/how-to-add-mcp-memory-to-cursor` \| 6 \| 0 \| 0\.00% \| 18\.2 \| title-meta-refresh \|/,
    );
    assert.match(
      report,
      /\| `origin vs basic memory` \| Comparisons \| `\/learn\/wenlan-vs-basic-memory` \| 5 \| 0 \| 0\.00% \| 14\.0 \| title-meta-refresh \|/,
    );
    assert.match(
      report,
      /\| `unknown agent recall` \| Other \| - \| 3 \| 0 \| 0\.00% \| 31\.5 \| new-article-candidate \|/,
    );
    assert.match(
      report,
      /\| `\/guides\/mcp-memory-server` \| 6 \| 0 \| 0\.00% \| 18\.5 \| technical-check \| Old guide URL should remain redirected; verify canonical Learn URL is indexed\. \|/,
    );

    assert.match(report, /Do not create a new Learn page unless/);
    assert.match(report, /Record pre-change GSC snapshot for changed pages in this worksheet\./);
    assert.match(report, /Record post-change GSC snapshot after deployment and the next GSC read\./);
    assert.match(
      report,
      /Run `pnpm seo:technical:deployed` to verify deployed robots, sitemap, canonicals, redirects, noindex headers, and checked-page schema\./,
    );
    assert.match(
      report,
      /Run `pnpm build` and `pnpm seo:technical:built` to verify local built robots, sitemap, redirects, noindex headers, canonicals, and schema\./,
    );
    assert.match(
      report,
      /Verify old `\/guides\/\*` and `\/docs\/guides\/\*` URLs redirect to canonical `\/learn\/\*` URLs\./,
    );
    assert.match(
      report,
      /Recheck changed redirects after deployment with `pnpm seo:technical:deployed -- --require-direct-changed-redirects true`\./,
    );
    assert.match(
      report,
      /Run `pnpm seo:vercel:fetch -- --date YYYY-MM-DD` before the weekly report; keep custom CTA events marked account-gated when the Vercel plan blocks them\./,
    );
    assert.match(
      report,
      /Generate `pnpm seo:ai-visibility -- --date YYYY-MM-DD` and manually check whether AI assistants mention Wenlan accurately for the tracked prompts in `docs\/seo-measurement\.md`\./,
    );
    assert.doesNotMatch(report, /Record before\/after GSC snapshot for changed pages\./);
    assert.doesNotMatch(report, /Verify `\/sitemap\.xml` includes changed canonical URLs\./);
    assert.doesNotMatch(report, /gsc-queries\.csv/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator separates observed query pages from configured targets", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "wenlan-seo-query-page-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const metadataPath = join(outputRoot, "gsc-metadata.json");
    const queryPagesPath = join(outputRoot, "gsc-query-pages.json");
    const outputPath = join(outputRoot, "2026-07-31-weekly-seo.md");

    await Promise.all([
      writeFile(
        queriesPath,
        [
          "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
          "llm wiki 2.0,0,3,0%,13.0,2026-07-03,2026-07-30,Search Console API",
          "ai knowledge base,0,1,0%,22.0,2026-07-03,2026-07-30,Search Console API",
        ].join("\n"),
        "utf8",
      ),
      writeFile(
        pagesPath,
        [
          "Page,Clicks,Impressions,CTR,Position,Start date,End date,Source",
          "https://wenlan.app/zh-TW,0,3,0%,13.0,2026-07-03,2026-07-30,Search Console API",
        ].join("\n"),
        "utf8",
      ),
      writeFile(
        metadataPath,
        JSON.stringify({
          siteUrl: "sc-domain:wenlan.app",
          startDate: "2026-07-03",
          endDate: "2026-07-30",
          source: "Search Console API",
          queryRows: 2,
          pageRows: 1,
          queryPageRows: 3,
          propertyTotals: {
            clicks: 0,
            impressions: 4,
            ctr: 0,
            position: 15.25,
            aggregationType: "byProperty",
          },
        }),
        "utf8",
      ),
      writeFile(
        queryPagesPath,
        JSON.stringify({
          siteUrl: "sc-domain:wenlan.app",
          startDate: "2026-07-03",
          endDate: "2026-07-30",
          source: "Search Console API",
          dimensions: ["query", "page"],
          nativeUnits: {
            clicks: "clicks",
            impressions: "impressions",
            ctr: "ratio",
            position: "average position",
          },
          responseAggregationType: "byPage",
          rowCount: 3,
          rows: [
            {
              keys: ["llm wiki 2.0", "https://wenlan.app/zh-TW"],
              clicks: 0,
              impressions: 2,
              ctr: 0,
              position: 13,
            },
            {
              keys: ["llm wiki 2.0", "https://wenlan.app/learn"],
              clicks: 0,
              impressions: 1,
              ctr: 0,
              position: 17,
            },
            {
              keys: [
                "ai knowledge base",
                "https://wenlan.app/learn/ai-work-memory-vs-knowledge-base",
              ],
              clicks: 0,
              impressions: 1,
              ctr: 0,
              position: 22,
            },
          ],
        }),
        "utf8",
      ),
    ]);

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--gsc-metadata",
        metadataPath,
        "--query-pages",
        queryPagesPath,
        "--date",
        "2026-07-31",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");
    assert.match(
      report,
      /\| Query \| Query group \| Observed GSC page \| Configured target \|/,
    );
    assert.match(
      report,
      /\| `llm wiki 2\.0` \| AI knowledge base \/ wiki \| `\/zh-TW` \(2\)<br>`\/learn` \(1\) \| `\/learn\/distilled-wiki-pages-ai-memory` \|/,
    );
    assert.match(report, /Observed GSC page differs from configured target/);
    assert.match(report, /## Acquisition Hierarchy Validation/);
    assert.match(
      report,
      /\| Core acquisition \| `llm wiki 2\.0` \| `\/zh-TW` \(2\)<br>`\/learn` \(1\) \| `\/learn\/distilled-wiki-pages-ai-memory` \| 3 \| 3 \| 0 \| visible split \| query-page-review \|/,
    );
    assert.match(
      report,
      /A split or mismatch is a routing-review signal, not proof of cannibalization/,
    );
    assert.match(
      report,
      /\| Core acquisition \| `ai knowledge base` \| `\/learn\/ai-work-memory-vs-knowledge-base` \| `\/learn\/ai-work-memory-vs-knowledge-base` \| 1 \| 1 \| 0 \| visible aligned \| wait — below 3-impression joined floor \|/,
    );
    assert.match(report, /## GSC Click Opportunity Queue/);
    assert.match(report, /`\/zh-TW` \| eligible .*`llm wiki 2\.0`/);
    assert.doesNotMatch(
      report,
      /\| `llm wiki 2\.0` \| AI knowledge base \/ wiki \| `\/learn\/distilled-wiki-pages-ai-memory` \| 3 \|/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("click opportunities use qualified-query position instead of page position", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "wenlan-seo-qualified-position-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const metadataPath = join(outputRoot, "gsc-metadata.json");
    const queryPagesPath = join(outputRoot, "gsc-query-pages.json");
    const outputPath = join(outputRoot, "2026-07-31-weekly-seo.md");

    await Promise.all([
      writeFile(
        queriesPath,
        [
          "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
          "super local memory,0,1,0%,45.0,2026-07-03,2026-07-30,Search Console API",
        ].join("\n"),
        "utf8",
      ),
      writeFile(
        pagesPath,
        [
          "Page,Clicks,Impressions,CTR,Position,Start date,End date,Source",
          "https://wenlan.app/learn/wenlan-vs-superlocal-memory,0,42,0%,7.7,2026-07-03,2026-07-30,Search Console API",
        ].join("\n"),
        "utf8",
      ),
      writeFile(
        metadataPath,
        JSON.stringify({
          siteUrl: "sc-domain:wenlan.app",
          startDate: "2026-07-03",
          endDate: "2026-07-30",
          source: "Search Console API",
          queryRows: 1,
          pageRows: 1,
          queryPageRows: 1,
          propertyTotals: {
            clicks: 0,
            impressions: 42,
            ctr: 0,
            position: 7.7,
            aggregationType: "byProperty",
          },
        }),
        "utf8",
      ),
      writeFile(
        queryPagesPath,
        JSON.stringify({
          siteUrl: "sc-domain:wenlan.app",
          startDate: "2026-07-03",
          endDate: "2026-07-30",
          source: "Search Console API",
          dimensions: ["query", "page"],
          nativeUnits: {
            clicks: "clicks",
            impressions: "impressions",
            ctr: "ratio",
            position: "average position",
          },
          responseAggregationType: "byPage",
          rowCount: 1,
          rows: [
            {
              keys: [
                "super local memory",
                "https://wenlan.app/learn/wenlan-vs-superlocal-memory",
              ],
              clicks: 0,
              impressions: 1,
              ctr: 0,
              position: 45,
            },
          ],
        }),
        "utf8",
      ),
    ]);

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--gsc-metadata",
        metadataPath,
        "--query-pages",
        queryPagesPath,
        "--date",
        "2026-07-31",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");
    assert.match(
      report,
      /\| Page avg position \| Qualified avg position \|/,
    );
    assert.match(
      report,
      /\| `\/learn\/wenlan-vs-superlocal-memory` \| measuring-only \| 42 \| 0 \| 0\.00% \| 7\.7 \| 45\.0 \| 1 \| `super local memory` \(1\) \| evidence-gap-review \| Qualified visible demand is below the 3-impression joined floor\./,
    );
    assert.doesNotMatch(
      report,
      /`\/learn\/wenlan-vs-superlocal-memory`[^\n]+(?:serp-intent-review|internal-link-refresh)/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

+test("click opportunities do not pool different search intents into one action floor", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "wenlan-seo-intent-floor-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const metadataPath = join(outputRoot, "gsc-metadata.json");
    const queryPagesPath = join(outputRoot, "gsc-query-pages.json");
    const outputPath = join(outputRoot, "weekly-seo.md");
    const rows = [
      ["llm wiki v2", 50],
      ["mcp memory server", 45],
      ["claude code memory", 40],
    ];

    await Promise.all([
      writeFile(
        queriesPath,
        [
          "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
          ...rows.map(
            ([query, position]) =>
              `${query},0,1,0%,${position}.0,2026-07-24,2026-08-20,Search Console API`,
          ),
        ].join("\n"),
        "utf8",
      ),
      writeFile(
        pagesPath,
        [
          "Page,Clicks,Impressions,CTR,Position,Start date,End date,Source",
          "https://wenlan.app/learn,0,140,0%,35.8,2026-07-24,2026-08-20,Search Console API",
        ].join("\n"),
        "utf8",
      ),
      writeFile(
        metadataPath,
        JSON.stringify({
          siteUrl: "sc-domain:wenlan.app",
          startDate: "2026-07-24",
          endDate: "2026-08-20",
          source: "Search Console API",
          queryRows: 3,
          pageRows: 1,
          queryPageRows: 3,
          propertyTotals: {
            clicks: 0,
            impressions: 140,
            ctr: 0,
            position: 35.8,
            aggregationType: "byProperty",
          },
        }),
        "utf8",
      ),
      writeFile(
        queryPagesPath,
        JSON.stringify({
          siteUrl: "sc-domain:wenlan.app",
          startDate: "2026-07-24",
          endDate: "2026-08-20",
          source: "Search Console API",
          dimensions: ["query", "page"],
          responseAggregationType: "byPage",
          rowCount: 3,
          rows: rows.map(([query, position]) => ({
            keys: [query, "https://wenlan.app/learn"],
            clicks: 0,
            impressions: 1,
            ctr: 0,
            position,
          })),
        }),
        "utf8",
      ),
    ]);

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--gsc-metadata",
        metadataPath,
        "--query-pages",
        queryPagesPath,
        "--date",
        "2026-08-21",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");
    assert.match(
      report,
      /`\/learn`[^\n]+evidence-gap-review[^\n]+No single configured owner reaches the 3-impression joined floor\./,
    );
    assert.doesNotMatch(report, /`\/learn`[^\n]+query-page-review/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly report separates property totals from visible query and page rows", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-property-totals-"));
  try {
    const inputDir = join(outputRoot, "input");
    const outputPath = join(outputRoot, "2026-06-07-weekly-seo.md");
    await writePipelineGscInput(inputDir);

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
        "--",
        "--input-dir",
        inputDir,
        "--date",
        "2026-06-07",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");
    assert.match(report, /\| Property clicks \| 3 \|/);
    assert.match(report, /\| Property impressions \| 70 \|/);
    assert.match(report, /\| Property CTR \| 4\.29% \|/);
    assert.match(report, /\| Property average position \| 10\.2 \|/);
    assert.match(report, /\| Visible query table clicks \| 1 \|/);
    assert.match(report, /\| Visible query table impressions \| 69 \|/);
    assert.match(report, /\| Query visibility gap \| 2 clicks; 1 impressions \|/);
    assert.match(report, /\| Visible page table clicks \| 1 \|/);
    assert.match(report, /\| Visible page table impressions \| 99 \|/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline automatically consumes authenticated query-page evidence", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "wenlan-seo-query-page-pipeline-"));
  try {
    const inputDir = join(outputRoot, "input");
    const outputPath = join(outputRoot, "2026-06-07-weekly-seo.md");
    await writePipelineGscInput(inputDir, { queryPageRows: 1 });
    await writeFile(
      join(inputDir, "gsc-query-pages.json"),
      JSON.stringify({
        siteUrl: "sc-domain:wenlan.app",
        startDate: "2026-05-10",
        endDate: "2026-06-06",
        source: "Search Console API",
        dimensions: ["query", "page"],
        nativeUnits: {
          clicks: "clicks",
          impressions: "impressions",
          ctr: "ratio",
          position: "average position",
        },
        responseAggregationType: "byPage",
        rowCount: 1,
        rows: [
          {
            keys: ["claude code memory", "https://wenlan.app/learn"],
            clicks: 0,
            impressions: 12,
            ctr: 0,
            position: 12.4,
          },
        ],
      }),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
        "--",
        "--input-dir",
        inputDir,
        "--date",
        "2026-06-07",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");
    assert.match(
      report,
      /\| `claude code memory` \| Claude Code \| `\/learn` \| `\/learn\/claude-code-memory` \|/,
    );
    assert.match(report, /Observed GSC page differs from configured target/);
    assert.match(report, /## GSC Click Opportunity Queue/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator rejects a stale query-page evidence range", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "wenlan-seo-stale-query-page-"));
  try {
    const inputDir = join(outputRoot, "input");
    await writePipelineGscInput(inputDir, { queryPageRows: 0 });
    const queryPagesPath = join(inputDir, "gsc-query-pages.json");
    await writeFile(
      queryPagesPath,
      JSON.stringify({
        siteUrl: "sc-domain:wenlan.app",
        startDate: "2026-05-09",
        endDate: "2026-06-05",
        source: "Search Console API",
        dimensions: ["query", "page"],
        responseAggregationType: "byPage",
        rowCount: 0,
        rows: [],
      }),
      "utf8",
    );

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly.mjs"),
          "--",
          "--queries",
          join(inputDir, "gsc-queries.csv"),
          "--pages",
          join(inputDir, "gsc-pages.csv"),
          "--gsc-metadata",
          join(inputDir, "gsc-metadata.json"),
          "--query-pages",
          queryPagesPath,
          "--date",
          "2026-06-07",
        ],
        { cwd: repoRoot },
      ),
      /GSC query-page date range disagrees with report evidence/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline trigger runs from a standard input directory", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-pipeline-"));
  try {
    const outputPath = join(outputRoot, "2026-06-07-weekly-seo.md");

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
        "--",
        "--input-dir",
        fixtureRoot,
        "--allow-fixture-input",
        "true",
        "--date",
        "2026-06-07",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot, env: { ...process.env, npm_lifecycle_event: "seo:weekly:sample" } },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(report, /^# Weekly SEO\/GEO Audit — 2026-06-07/m);
    assert.match(report, /\| Visible query table impressions \| 69 \|/);
    assert.match(report, /origin vs basic memory/);
    assert.match(report, /Do not create a new Learn page unless/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline rejects fixture bypass outside the sample lifecycle", async () => {
  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
        "--",
        "--input-dir",
        fixtureRoot,
        "--allow-fixture-input",
        "true",
        "--date",
        "2026-06-07",
      ],
      { cwd: repoRoot },
    ),
    /fixture input is reserved for pnpm seo:weekly:sample/,
  );
});

test("seo weekly pipeline rejects metadata-free input outside fixture mode", async () => {
  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
        "--",
        "--input-dir",
        fixtureRoot,
        "--date",
        "2026-06-07",
      ],
      { cwd: repoRoot },
    ),
    /Missing GSC metadata/,
  );
});

test("seo weekly pipeline rejects GSC metadata for another property", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-wrong-property-"));
  try {
    const inputDir = join(outputRoot, "input");
    await writePipelineGscInput(inputDir, { siteUrl: "sc-domain:example.com" });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
          "--",
          "--input-dir",
          inputDir,
          "--date",
          "2026-06-07",
        ],
        { cwd: repoRoot },
      ),
      /GSC property must be sc-domain:wenlan\.app/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline rejects unsupported provenance labels", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-forged-source-"));
  try {
    const inputDir = join(outputRoot, "input");
    await writePipelineGscInput(inputDir, { source: "synthetic fixture" });
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
          "--",
          "--input-dir",
          inputDir,
          "--date",
          "2026-06-07",
        ],
        { cwd: repoRoot },
      ),
      /GSC metadata source must be one of:/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline rejects sidecar row counts that disagree with CSVs", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-row-count-mismatch-"));
  try {
    const inputDir = join(outputRoot, "input");
    await writePipelineGscInput(inputDir, { queryRows: 999, pageRows: 999 });
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
          "--",
          "--input-dir",
          inputDir,
          "--date",
          "2026-06-07",
        ],
        { cwd: repoRoot },
      ),
      /GSC query row count disagrees with metadata/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline rejects malformed sidecar row counts", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-invalid-row-count-"));
  try {
    const inputDir = join(outputRoot, "input");
    await writePipelineGscInput(inputDir, { queryRows: "unknown" });
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
          "--",
          "--input-dir",
          inputDir,
          "--date",
          "2026-06-07",
        ],
        { cwd: repoRoot },
      ),
      /GSC metadata queryRows must be a non-negative integer/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly rejects contradictory property totals at both entry points", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-property-totals-invalid-"));
  try {
    const inputDir = join(outputRoot, "input");
    const metadataPath = join(inputDir, "gsc-metadata.json");
    await writePipelineGscInput(inputDir, {
      propertyTotals: {
        clicks: 3,
        impressions: 70,
        ctr: 0.5,
        position: 10.2,
        aggregationType: "byProperty",
      },
    });

    for (const command of [
      [
        resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
        "--",
        "--input-dir",
        inputDir,
        "--date",
        "2026-06-07",
      ],
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        join(inputDir, "gsc-queries.csv"),
        "--pages",
        join(inputDir, "gsc-pages.csv"),
        "--gsc-metadata",
        metadataPath,
        "--date",
        "2026-06-07",
        "--output",
        join(outputRoot, "weekly.md"),
      ],
    ]) {
      await assert.rejects(
        execFileAsync(process.execPath, command, { cwd: repoRoot }),
        /propertyTotals CTR must equal clicks divided by impressions/,
      );
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline rejects a stale evidence range", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-stale-range-"));
  try {
    const inputDir = join(outputRoot, "input");
    await writePipelineGscInput(inputDir, {
      startDate: "2026-04-01",
      endDate: "2026-04-28",
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
          "--",
          "--input-dir",
          inputDir,
          "--date",
          "2026-06-07",
        ],
        { cwd: repoRoot },
      ),
      /GSC evidence range must be 2026-05-10 to 2026-06-06/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline allows an explicit manual evidence range", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-manual-range-"));
  try {
    const inputDir = join(outputRoot, "input");
    const outputPath = join(outputRoot, "weekly-seo.md");
    await writePipelineGscInput(inputDir, {
      startDate: "2026-04-01",
      endDate: "2026-04-28",
    });

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
        "--",
        "--input-dir",
        inputDir,
        "--allow-manual-date-range",
        "true",
        "--date",
        "2026-06-07",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");
    assert.match(report, /\| Date range \| 2026-04-01 to 2026-04-28 \|/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline rejects sidecar metadata that disagrees with CSV rows", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-row-metadata-mismatch-"));
  try {
    const inputDir = join(outputRoot, "input");
    await writePipelineGscInput(inputDir);
    await writeFile(
      join(inputDir, "gsc-queries.csv"),
      [
        "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
        "claude code memory,0,12,0%,12.4,2026-04-01,2026-04-28,stale export",
        "",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      join(inputDir, "gsc-pages.csv"),
      [
        "Page,Clicks,Impressions,CTR,Position,Start date,End date,Source",
        "https://wenlan.app/learn/claude-code-memory,0,12,0%,12.4,2026-04-01,2026-04-28,stale export",
        "",
      ].join("\n"),
      "utf8",
    );

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
          "--",
          "--input-dir",
          inputDir,
          "--date",
          "2026-06-07",
        ],
        { cwd: repoRoot },
      ),
      /GSC queries date range disagrees with metadata/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline rejects impossible manual dates", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-invalid-manual-range-"));
  try {
    const inputDir = join(outputRoot, "input");
    await writePipelineGscInput(inputDir, {
      startDate: "2026-02-30",
      endDate: "2026-03-29",
    });

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
          "--",
          "--input-dir",
          inputDir,
          "--allow-manual-date-range",
          "true",
          "--date",
          "2026-06-07",
        ],
        { cwd: repoRoot },
      ),
      /GSC metadata startDate must be a valid YYYY-MM-DD date/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline defaults to the Wenlan temporary input directory", async () => {
  const script = await readFile(resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"), "utf8");

  assert.match(script, /const DEFAULT_INPUT_DIR = "\/tmp\/wenlan-seo";/);
  assert.doesNotMatch(script, /const DEFAULT_INPUT_DIR = "\/tmp\/origin-seo";/);
});

test("seo weekly generator summarizes optional Umami CSV exports", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-umami-"));
  try {
    const umamiPagesPath = join(outputRoot, "umami-pages.csv");
    const umamiReferrersPath = join(outputRoot, "umami-referrers.csv");
    const umamiEventsPath = join(outputRoot, "umami-events.csv");
    const outputPath = join(outputRoot, "2026-06-07-weekly-seo.md");

    await writeFile(
      umamiPagesPath,
      [
        "Path,Views",
        "/learn,42",
        "/learn/claude-code-memory,31",
        "/llms.txt,4",
        "",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      umamiReferrersPath,
      [
        "Referrer,Visitors",
        "chatgpt.com,8",
        "perplexity.ai,7",
        "reddit.com,9",
        "google.com,22",
        "",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      umamiEventsPath,
      ["Event,URL,Count", "request,/llms-full.txt,3", ""].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        resolve(fixtureRoot, "gsc-queries.csv"),
        "--pages",
        resolve(fixtureRoot, "gsc-pages.csv"),
        "--umami-pages",
        umamiPagesPath,
        "--umami-referrers",
        umamiReferrersPath,
        "--umami-events",
        umamiEventsPath,
        "--date",
        "2026-06-07",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(report, /\| Umami data source \| local CSV exports \|/);
    assert.match(report, /\| Umami landing page views \| 77 across 3 rows \|/);
    assert.match(report, /\| AI referrals \| 15 visits from 2 referrers \|/);
    assert.match(report, /\| Reddit referrals \| 9 visits from 1 referrer \|/);
    assert.match(report, /\| llms\.txt hits \| 7 \|/);
    assert.match(report, /## Umami Evidence/);
    assert.match(report, /\| `\/learn` \| 42 \|/);
    assert.match(report, /\| chatgpt\.com \| 8 \| AI referral \|/);
    assert.match(report, /\| reddit\.com \| 9 \| Reddit \|/);
    assert.doesNotMatch(report, /\| Umami sessions \| manual \|/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator prefers Vercel Web Analytics evidence and records event gating", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "wenlan-seo-vercel-"));
  try {
    const pagesPath = join(outputRoot, "vercel-pages.csv");
    const referrersPath = join(outputRoot, "vercel-referrers.csv");
    const sourcePagesPath = join(outputRoot, "vercel-source-pages.csv");
    const metadataPath = join(outputRoot, "vercel-metadata.json");
    const outputPath = join(outputRoot, "2026-06-07-weekly-seo.md");
    await writeFile(
      pagesPath,
      ["Path,Visitors,Pageviews", "/,46,53", "/learn,3,5", ""].join("\n"),
      "utf8",
    );
    await writeFile(
      referrersPath,
      ["Referrer,Visitors,Pageviews", "google.com,6,6", "chatgpt.com,1,1", ""].join("\n"),
      "utf8",
    );
    await writeFile(
      sourcePagesPath,
      [
        "Source,Path,Visitors,Pageviews",
        "google.com,/learn,5,5",
        "chatgpt.com,/learn/source-backed-wiki-pages-ai-work,1,1",
        "",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      metadataPath,
      JSON.stringify({
        source: "Vercel Web Analytics API",
        projectId: "prj_test",
        projectName: "wenlan-site",
        startDate: "2026-05-10",
        endDate: "2026-06-06",
        totals: { visitors: 153, pageviews: 192 },
        sourcePageBreakdown: {
          status: "available",
          referrers: ["google.com", "chatgpt.com"],
          rows: 2,
        },
        customEvents: { status: "account-gated", reason: "Pro or Enterprise plan required" },
      }),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        resolve(fixtureRoot, "gsc-queries.csv"),
        "--pages",
        resolve(fixtureRoot, "gsc-pages.csv"),
        "--vercel-pages",
        pagesPath,
        "--vercel-referrers",
        referrersPath,
        "--vercel-source-pages",
        sourcePagesPath,
        "--vercel-metadata",
        metadataPath,
        "--date",
        "2026-06-07",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");
    assert.match(report, /\| Analytics data source \| Vercel Web Analytics API \|/);
    assert.match(report, /\| Analytics visitors \| 153 \|/);
    assert.match(report, /\| Analytics pageviews \| 192 \|/);
    assert.match(report, /\| AI referrals \| 1 visit from 1 referrer \|/);
    assert.match(report, /\| CTA custom events \| account-gated: Pro or Enterprise plan required \|/);
    assert.match(report, /## Vercel Analytics Evidence/);
    assert.match(report, /\| `\/learn` \| 3 \| 5 \|/);
    assert.match(report, /### Acquisition source → page/);
    assert.match(report, /\| google\.com \| `\/learn` \| 5 \| 5 \|/);
    assert.match(
      report,
      /\| chatgpt\.com \| `\/learn\/source-backed-wiki-pages-ai-work` \| 1 \| 1 \|/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator rejects source-page CSVs without a matching authenticated sidecar", async (t) => {
  const outputRoot = await mkdtemp(join(tmpdir(), "wenlan-seo-vercel-source-page-proof-"));
  try {
    const pagesPath = join(outputRoot, "vercel-pages.csv");
    const referrersPath = join(outputRoot, "vercel-referrers.csv");
    const sourcePagesPath = join(outputRoot, "vercel-source-pages.csv");
    const metadataPath = join(outputRoot, "vercel-metadata.json");
    const outputPath = join(outputRoot, "weekly-seo.md");
    await writeFile(pagesPath, ["Path,Visitors,Pageviews", "/learn,5,5", ""].join("\n"), "utf8");
    await writeFile(
      referrersPath,
      ["Referrer,Visitors,Pageviews", "google.com,5,5", ""].join("\n"),
      "utf8",
    );
    await writeFile(
      sourcePagesPath,
      ["Source,Path,Visitors,Pageviews", "google.com,/learn,5,5", ""].join("\n"),
      "utf8",
    );

    const baseMetadata = {
      source: "Vercel Web Analytics API",
      startDate: "2026-05-10",
      endDate: "2026-06-06",
      totals: { visitors: 5, pageviews: 5 },
    };
    const cases = [
      {
        name: "missing sidecar",
        metadata: baseMetadata,
        error: /requires metadata\.sourcePageBreakdown\.status=available/,
      },
      {
        name: "unavailable sidecar",
        metadata: {
          ...baseMetadata,
          sourcePageBreakdown: { status: "account-gated", referrers: ["google.com"], rows: 1 },
        },
        error: /requires metadata\.sourcePageBreakdown\.status=available/,
      },
      {
        name: "row mismatch",
        metadata: {
          ...baseMetadata,
          sourcePageBreakdown: { status: "available", referrers: ["google.com"], rows: 2 },
        },
        error: /row count must match the validated CSV rows/,
      },
      {
        name: "source outside allowlist",
        metadata: {
          ...baseMetadata,
          sourcePageBreakdown: { status: "available", referrers: ["chatgpt.com"], rows: 1 },
        },
        error: /outside the metadata referrer allowlist/,
      },
    ];

    for (const entry of cases) {
      await t.test(entry.name, async () => {
        await writeFile(metadataPath, JSON.stringify(entry.metadata), "utf8");
        await assert.rejects(
          execFileAsync(
            process.execPath,
            [
              resolve(repoRoot, "scripts/seo-weekly.mjs"),
              "--",
              "--queries",
              resolve(fixtureRoot, "gsc-queries.csv"),
              "--pages",
              resolve(fixtureRoot, "gsc-pages.csv"),
              "--vercel-pages",
              pagesPath,
              "--vercel-referrers",
              referrersPath,
              "--vercel-source-pages",
              sourcePagesPath,
              "--vercel-metadata",
              metadataPath,
              "--date",
              "2026-06-07",
              "--output",
              outputPath,
            ],
            { cwd: repoRoot },
          ),
          entry.error,
        );
      });
    }

    await writeFile(metadataPath, JSON.stringify(baseMetadata), "utf8");
    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        resolve(fixtureRoot, "gsc-queries.csv"),
        "--pages",
        resolve(fixtureRoot, "gsc-pages.csv"),
        "--vercel-pages",
        pagesPath,
        "--vercel-referrers",
        referrersPath,
        "--vercel-metadata",
        metadataPath,
        "--date",
        "2026-06-07",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );
    const unavailableReport = await readFile(outputPath, "utf8");
    assert.match(unavailableReport, /\| manual \/ unavailable \| - \| - \| - \|/);
    assert.doesNotMatch(unavailableReport, /\| manual \/ unavailable \| - \| 0 \| 0 \|/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator reports zero AI and Reddit referrals from Umami exports", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-umami-zero-"));
  try {
    const umamiPagesPath = join(outputRoot, "umami-pages.csv");
    const umamiReferrersPath = join(outputRoot, "umami-referrers.csv");
    const outputPath = join(outputRoot, "2026-06-07-weekly-seo.md");

    await writeFile(umamiPagesPath, ["Path,Views", "/learn,10", ""].join("\n"), "utf8");
    await writeFile(
      umamiReferrersPath,
      ["Referrer,Visitors", "google.com,22", ""].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        resolve(fixtureRoot, "gsc-queries.csv"),
        "--pages",
        resolve(fixtureRoot, "gsc-pages.csv"),
        "--umami-pages",
        umamiPagesPath,
        "--umami-referrers",
        umamiReferrersPath,
        "--date",
        "2026-06-07",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(report, /\| Umami data source \| local CSV exports \|/);
    assert.match(report, /\| AI referrals \| 0 visits from 0 referrers \|/);
    assert.match(report, /\| Reddit referrals \| 0 visits from 0 referrers \|/);
    assert.doesNotMatch(report, /\| AI referrals \| manual \|/);
    assert.doesNotMatch(report, /\| Reddit referrals \| manual \|/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator keeps referrer metrics manual when only Umami page exports exist", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-umami-pages-only-"));
  try {
    const umamiPagesPath = join(outputRoot, "umami-pages.csv");
    const outputPath = join(outputRoot, "2026-06-07-weekly-seo.md");

    await writeFile(
      umamiPagesPath,
      ["Path,Views", "/learn,10", "/llms.txt,2", ""].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        resolve(fixtureRoot, "gsc-queries.csv"),
        "--pages",
        resolve(fixtureRoot, "gsc-pages.csv"),
        "--umami-pages",
        umamiPagesPath,
        "--date",
        "2026-06-07",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(report, /\| Umami data source \| local CSV exports \|/);
    assert.match(report, /\| Umami landing page views \| 12 across 2 rows \|/);
    assert.match(report, /\| AI referrals \| manual \|/);
    assert.match(report, /\| Reddit referrals \| manual \|/);
    assert.match(report, /\| llms\.txt hits \| 2 \|/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator keeps referrer metrics manual for unparseable Umami referrer exports", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-umami-referrers-unparseable-"));
  try {
    const umamiReferrersPath = join(outputRoot, "umami-referrers.csv");
    const outputPath = join(outputRoot, "2026-06-07-weekly-seo.md");

    await writeFile(
      umamiReferrersPath,
      ["Referrer,Percentage", "chatgpt.com,40%", "reddit.com,20%", ""].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        resolve(fixtureRoot, "gsc-queries.csv"),
        "--pages",
        resolve(fixtureRoot, "gsc-pages.csv"),
        "--umami-referrers",
        umamiReferrersPath,
        "--date",
        "2026-06-07",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(report, /\| Umami data source \| local CSV exports \|/);
    assert.match(report, /\| Umami landing page views \| manual \|/);
    assert.match(report, /\| AI referrals \| manual \|/);
    assert.match(report, /\| Reddit referrals \| manual \|/);
    assert.match(report, /### Referrers\n\nManual \/ not exported or missing a recognized metric column\./);
    assert.doesNotMatch(report, /\| AI referrals \| 0 visits from 0 referrers \|/);
    assert.doesNotMatch(report, /\| Reddit referrals \| 0 visits from 0 referrers \|/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator keeps referrer metrics manual for malformed Umami metric cells", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-umami-referrers-malformed-"));
  try {
    const cases = [
      {
        name: "all-malformed",
        rows: ["Referrer,Visitors", "chatgpt.com,n/a", "reddit.com,unknown", ""],
      },
      {
        name: "mixed-valid-malformed",
        rows: ["Referrer,Visitors", "chatgpt.com,8", "reddit.com,n/a", ""],
      },
      {
        name: "percent-not-count",
        rows: ["Referrer,Visitors", "chatgpt.com,40%", "reddit.com,20%", ""],
      },
      {
        name: "negative-not-count",
        rows: ["Referrer,Visitors", "chatgpt.com,-1", "reddit.com,2", ""],
      },
    ];

    for (const malformedCase of cases) {
      const caseRoot = join(outputRoot, malformedCase.name);
      await mkdir(caseRoot, { recursive: true });
      const umamiReferrersPath = join(caseRoot, "umami-referrers.csv");
      const outputPath = join(caseRoot, "2026-06-07-weekly-seo.md");

      await writeFile(umamiReferrersPath, malformedCase.rows.join("\n"), "utf8");

      await execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly.mjs"),
          "--",
          "--queries",
          resolve(fixtureRoot, "gsc-queries.csv"),
          "--pages",
          resolve(fixtureRoot, "gsc-pages.csv"),
          "--umami-referrers",
          umamiReferrersPath,
          "--date",
          "2026-06-07",
          "--output",
          outputPath,
        ],
        { cwd: repoRoot },
      );

      const report = await readFile(outputPath, "utf8");

      assert.match(report, /\| Umami data source \| local CSV exports \|/);
      assert.match(report, /\| AI referrals \| manual \|/);
      assert.match(report, /\| Reddit referrals \| manual \|/);
      assert.match(report, /### Referrers\n\nManual \/ not exported or missing a recognized metric column\./);
      assert.doesNotMatch(report, /\| AI referrals \| 0 visits from 0 referrers \|/);
      assert.doesNotMatch(report, /\| Reddit referrals \| 0 visits from 0 referrers \|/);
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator keeps llms hits manual when any contributing Umami export is malformed", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-umami-llms-malformed-"));
  try {
    const cases = [
      {
        name: "malformed-event",
        eventCount: "n/a",
      },
      {
        name: "percent-event",
        eventCount: "40%",
      },
      {
        name: "negative-event",
        eventCount: "-1",
      },
    ];

    for (const malformedCase of cases) {
      const caseRoot = join(outputRoot, malformedCase.name);
      await mkdir(caseRoot, { recursive: true });
      const umamiPagesPath = join(caseRoot, "umami-pages.csv");
      const umamiEventsPath = join(caseRoot, "umami-events.csv");
      const outputPath = join(caseRoot, "2026-06-07-weekly-seo.md");

      await writeFile(
        umamiPagesPath,
        ["Path,Views", "/llms.txt,4", ""].join("\n"),
        "utf8",
      );
      await writeFile(
        umamiEventsPath,
        ["Event,URL,Count", `request,/llms-full.txt,${malformedCase.eventCount}`, ""].join("\n"),
        "utf8",
      );

      await execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly.mjs"),
          "--",
          "--queries",
          resolve(fixtureRoot, "gsc-queries.csv"),
          "--pages",
          resolve(fixtureRoot, "gsc-pages.csv"),
          "--umami-pages",
          umamiPagesPath,
          "--umami-events",
          umamiEventsPath,
          "--date",
          "2026-06-07",
          "--output",
          outputPath,
        ],
        { cwd: repoRoot },
      );

      const report = await readFile(outputPath, "utf8");

      assert.match(report, /\| Umami data source \| local CSV exports \|/);
      assert.match(report, /\| Umami landing page views \| 4 across 1 row \|/);
      assert.match(report, /\| llms\.txt hits \| manual \|/);
      assert.doesNotMatch(report, /\| llms\.txt hits \| 4 \|/);
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline trigger auto-detects optional Umami CSV exports", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-pipeline-umami-"));
  try {
    const inputDir = join(outputRoot, "input");
    const outputPath = join(outputRoot, "2026-06-07-weekly-seo.md");
    await writePipelineGscInput(inputDir);
    await writeFile(
      join(inputDir, "umami-pages.csv"),
      ["Page,Views", "/learn,10", "/llms.txt,2", ""].join("\n"),
      "utf8",
    );
    await writeFile(
      join(inputDir, "umami-referrers.csv"),
      ["Source,Visits", "claude.ai,5", "old.reddit.com,4", ""].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
        "--",
        "--input-dir",
        inputDir,
        "--date",
        "2026-06-07",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(report, /## Umami Evidence/);
    assert.match(report, /\| Umami landing page views \| 12 across 2 rows \|/);
    assert.match(report, /\| AI referrals \| 5 visits from 1 referrer \|/);
    assert.match(report, /\| Reddit referrals \| 4 visits from 1 referrer \|/);
    assert.match(report, /\| llms\.txt hits \| 2 \|/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly pipeline accepts empty GSC API exports with metadata", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-pipeline-empty-api-"));
  try {
    const inputDir = join(outputRoot, "input");
    const outputPath = join(outputRoot, "2026-07-03-weekly-seo.md");
    await mkdir(inputDir, { recursive: true });
    await writeFile(
      join(inputDir, "gsc-queries.csv"),
      "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source\n",
      "utf8",
    );
    await writeFile(
      join(inputDir, "gsc-pages.csv"),
      "Page,Clicks,Impressions,CTR,Position,Start date,End date,Source\n",
      "utf8",
    );
    await writeFile(
      join(inputDir, "gsc-metadata.json"),
      JSON.stringify(
        {
          siteUrl: "sc-domain:wenlan.app",
          startDate: "2026-06-05",
          endDate: "2026-07-02",
          source: "Search Console API",
          queryRows: 0,
          pageRows: 0,
          propertyTotals: {
            clicks: 0,
            impressions: 0,
            ctr: null,
            position: null,
            aggregationType: "byProperty",
          },
          sitemaps: {
            sitemap: [
              {
                path: "https://wenlan.app/sitemap.xml",
                warnings: "0",
                errors: "0",
              },
            ],
          },
        },
        null,
        2,
      ),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly-pipeline.mjs"),
        "--",
        "--input-dir",
        inputDir,
        "--date",
        "2026-07-03",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(report, /Generated from Search Console API/);
    assert.match(report, /\| Date range \| 2026-06-05 to 2026-07-02 \|/);
    assert.match(report, /\| GSC data source \| Search Console API \|/);
    assert.match(report, /\| Property clicks \| 0 \|/);
    assert.match(report, /\| Property impressions \| 0 \|/);
    assert.match(report, /\| Property CTR \| manual \/ unavailable \|/);
    assert.match(report, /\| Property average position \| manual \/ unavailable \|/);
    assert.match(report, /\| Visible query table clicks \| 0 \|/);
    assert.match(report, /\| Visible query table impressions \| 0 \|/);
    assert.match(report, /\| Top page \| - \|/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator reports CSV evidence source and date range when available", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-metadata-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");
    const source =
      "authenticated GSC UI normalized; CSV download unavailable in Codex in-app Browser";

    await writeFile(
      queriesPath,
      [
        "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
        `claude code memory,0,12,0%,12.4,2026-05-15,2026-06-11,${source}`,
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position,Start date,End date,Source",
        `https://wenlan.app/learn,0,54,0%,4.2,2026-05-15,2026-06-11,${source}`,
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--date",
        "2026-06-13",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(report, new RegExp(`Generated from ${source}`));
    assert.match(report, /\| Date range \| 2026-05-15 to 2026-06-11 \|/);
    assert.match(report, new RegExp(`\\| GSC data source \\| ${source} \\|`));
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator rejects mismatched GSC query and page date ranges", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-mismatch-range-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await writeFile(
      queriesPath,
      [
        "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
        "claude code memory,0,12,0%,12.4,2026-05-15,2026-06-11,normalized GSC export",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position,Start date,End date,Source",
        "https://wenlan.app/learn,0,54,0%,4.2,2026-05-01,2026-05-28,normalized GSC export",
      ].join("\n"),
      "utf8",
    );

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly.mjs"),
          "--",
          "--queries",
          queriesPath,
          "--pages",
          pagesPath,
          "--date",
          "2026-06-13",
          "--output",
          outputPath,
        ],
        { cwd: repoRoot },
      ),
      /Mismatched GSC date ranges: queries=2026-05-15 to 2026-06-11; pages=2026-05-01 to 2026-05-28/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator rejects one-sided GSC date metadata", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-one-sided-range-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await writeFile(
      queriesPath,
      [
        "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
        "claude code memory,0,12,0%,12.4,2026-05-15,2026-06-11,normalized GSC export",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position,Source",
        "https://wenlan.app/learn,0,54,0%,4.2,normalized GSC export",
      ].join("\n"),
      "utf8",
    );

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly.mjs"),
          "--",
          "--queries",
          queriesPath,
          "--pages",
          pagesPath,
          "--date",
          "2026-06-13",
          "--output",
          outputPath,
        ],
        { cwd: repoRoot },
      ),
      /One-sided GSC date metadata: queries=2026-05-15 to 2026-06-11; pages=unknown/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator rejects mismatched GSC source metadata", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-mismatch-source-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await writeFile(
      queriesPath,
      [
        "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
        "claude code memory,0,12,0%,12.4,2026-05-15,2026-06-11,normalized GSC export",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position,Start date,End date,Source",
        "https://wenlan.app/learn,0,54,0%,4.2,2026-05-15,2026-06-11,visible UI copy",
      ].join("\n"),
      "utf8",
    );

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly.mjs"),
          "--",
          "--queries",
          queriesPath,
          "--pages",
          pagesPath,
          "--date",
          "2026-06-13",
          "--output",
          outputPath,
        ],
        { cwd: repoRoot },
      ),
      /Mismatched GSC data sources: queries=normalized GSC export; pages=visible UI copy/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator rejects one-sided GSC source metadata", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-one-sided-source-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await writeFile(
      queriesPath,
      [
        "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
        "claude code memory,0,12,0%,12.4,2026-05-15,2026-06-11,normalized GSC export",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position,Start date,End date",
        "https://wenlan.app/learn,0,54,0%,4.2,2026-05-15,2026-06-11",
      ].join("\n"),
      "utf8",
    );

    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          resolve(repoRoot, "scripts/seo-weekly.mjs"),
          "--",
          "--queries",
          queriesPath,
          "--pages",
          pagesPath,
          "--date",
          "2026-06-13",
          "--output",
          outputPath,
        ],
        { cwd: repoRoot },
      ),
      /One-sided GSC source metadata: queries=normalized GSC export; pages=unknown/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator rejects partial and mixed GSC metadata within one export", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-internal-metadata-"));
  try {
    const pagesCsv = [
      "Page,Clicks,Impressions,CTR,Position,Start date,End date,Source",
      "https://wenlan.app/learn,0,54,0%,4.2,2026-05-15,2026-06-11,normalized GSC export",
    ].join("\n");

    const cases = [
      {
        name: "partial-date",
        queryRows: [
          "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
          "claude code memory,0,12,0%,12.4,2026-05-15,2026-06-11,normalized GSC export",
          "mcp memory server,0,3,0%,3.3,,,normalized GSC export",
        ],
        error: /Partial GSC date metadata in queries export/,
      },
      {
        name: "mixed-date",
        queryRows: [
          "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
          "claude code memory,0,12,0%,12.4,2026-05-15,2026-06-11,normalized GSC export",
          "mcp memory server,0,3,0%,3.3,2026-05-01,2026-05-28,normalized GSC export",
        ],
        error: /Mixed GSC date ranges in queries export: 2026-05-01 to 2026-05-28; 2026-05-15 to 2026-06-11/,
      },
      {
        name: "partial-source",
        queryRows: [
          "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
          "claude code memory,0,12,0%,12.4,2026-05-15,2026-06-11,normalized GSC export",
          "mcp memory server,0,3,0%,3.3,2026-05-15,2026-06-11,",
        ],
        error: /Partial GSC source metadata in queries export/,
      },
      {
        name: "mixed-source",
        queryRows: [
          "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
          "claude code memory,0,12,0%,12.4,2026-05-15,2026-06-11,normalized GSC export",
          "mcp memory server,0,3,0%,3.3,2026-05-15,2026-06-11,visible UI copy",
        ],
        error: /Mixed GSC source metadata in queries export: normalized GSC export; visible UI copy/,
      },
    ];

    for (const metadataCase of cases) {
      const caseRoot = join(outputRoot, metadataCase.name);
      await mkdir(caseRoot, { recursive: true });
      const queriesPath = join(caseRoot, "gsc-queries.csv");
      const pagesPath = join(caseRoot, "gsc-pages.csv");
      const outputPath = join(caseRoot, "2026-06-13-weekly-seo.md");
      await writeFile(queriesPath, metadataCase.queryRows.join("\n"), "utf8");
      await writeFile(pagesPath, pagesCsv, "utf8");

      await assert.rejects(
        execFileAsync(
          process.execPath,
          [
            resolve(repoRoot, "scripts/seo-weekly.mjs"),
            "--",
            "--queries",
            queriesPath,
            "--pages",
            pagesPath,
            "--date",
            "2026-06-13",
            "--output",
            outputPath,
          ],
          { cwd: repoRoot },
        ),
        metadataCase.error,
      );
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator rejects malformed GSC metric cells", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-malformed-gsc-"));
  try {
    const validQueries = [
      "Query,Clicks,Impressions,CTR,Position",
      "claude code memory,0,12,0%,12.4",
      "",
    ].join("\n");
    const validPages = [
      "Page,Clicks,Impressions,CTR,Position",
      "https://wenlan.app/learn,0,54,0%,4.2",
      "",
    ].join("\n");
    const cases = [
      {
        name: "query-clicks-na",
        queries: ["Query,Clicks,Impressions,CTR,Position", "claude code memory,n/a,12,0%,12.4", ""].join("\n"),
        pages: validPages,
        error: /Invalid GSC queries clicks metric "n\/a"/,
      },
      {
        name: "query-impressions-percent",
        queries: ["Query,Clicks,Impressions,CTR,Position", "claude code memory,0,12%,0%,12.4", ""].join("\n"),
        pages: validPages,
        error: /Invalid GSC queries impressions metric "12%"/,
      },
      {
        name: "query-position-missing",
        queries: ["Query,Clicks,Impressions,CTR,Position", "claude code memory,0,12,0%,", ""].join("\n"),
        pages: validPages,
        error: /Missing GSC queries position metric/,
      },
      {
        name: "page-clicks-negative",
        queries: validQueries,
        pages: ["Page,Clicks,Impressions,CTR,Position", "https://wenlan.app/learn,-1,54,0%,4.2", ""].join("\n"),
        error: /Invalid GSC pages clicks metric "-1"/,
      },
      {
        name: "page-position-negative",
        queries: validQueries,
        pages: ["Page,Clicks,Impressions,CTR,Position", "https://wenlan.app/learn,0,54,0%,-4.2", ""].join("\n"),
        error: /Invalid GSC pages position metric "-4.2"/,
      },
    ];

    for (const malformedCase of cases) {
      const caseRoot = join(outputRoot, malformedCase.name);
      await mkdir(caseRoot, { recursive: true });
      const queriesPath = join(caseRoot, "gsc-queries.csv");
      const pagesPath = join(caseRoot, "gsc-pages.csv");
      const outputPath = join(caseRoot, "2026-06-13-weekly-seo.md");

      await writeFile(queriesPath, malformedCase.queries, "utf8");
      await writeFile(pagesPath, malformedCase.pages, "utf8");

      await assert.rejects(
        execFileAsync(
          process.execPath,
          [
            resolve(repoRoot, "scripts/seo-weekly.mjs"),
            "--",
            "--queries",
            queriesPath,
            "--pages",
            pagesPath,
            "--date",
            "2026-06-13",
            "--output",
            outputPath,
          ],
          { cwd: repoRoot },
        ),
        malformedCase.error,
      );
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator rejects empty GSC exports", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-empty-gsc-"));
  try {
    const validQueries = [
      "Query,Clicks,Impressions,CTR,Position",
      "claude code memory,0,12,0%,12.4",
      "",
    ].join("\n");
    const validPages = [
      "Page,Clicks,Impressions,CTR,Position",
      "https://wenlan.app/learn,0,54,0%,4.2",
      "",
    ].join("\n");
    const cases = [
      {
        name: "blank-queries",
        queries: "",
        pages: validPages,
        error: /GSC queries export has no data rows/,
      },
      {
        name: "header-only-queries",
        queries: "Query,Clicks,Impressions,CTR,Position\n",
        pages: validPages,
        error: /GSC queries export has no data rows/,
      },
      {
        name: "blank-pages",
        queries: validQueries,
        pages: "",
        error: /GSC pages export has no data rows/,
      },
      {
        name: "header-only-pages",
        queries: validQueries,
        pages: "Page,Clicks,Impressions,CTR,Position\n",
        error: /GSC pages export has no data rows/,
      },
    ];

    for (const emptyCase of cases) {
      const caseRoot = join(outputRoot, emptyCase.name);
      await mkdir(caseRoot, { recursive: true });
      const queriesPath = join(caseRoot, "gsc-queries.csv");
      const pagesPath = join(caseRoot, "gsc-pages.csv");
      const outputPath = join(caseRoot, "2026-06-13-weekly-seo.md");

      await writeFile(queriesPath, emptyCase.queries, "utf8");
      await writeFile(pagesPath, emptyCase.pages, "utf8");

      await assert.rejects(
        execFileAsync(
          process.execPath,
          [
            resolve(repoRoot, "scripts/seo-weekly.mjs"),
            "--",
            "--queries",
            queriesPath,
            "--pages",
            pagesPath,
            "--date",
            "2026-06-13",
            "--output",
            outputPath,
          ],
          { cwd: repoRoot },
        ),
        emptyCase.error,
      );
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator preserves manual audit sections when regenerating", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-preserve-manual-"));
  try {
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await runWeeklyFixture(outputPath);
    const generated = await readFile(outputPath, "utf8");
    await writeFile(
      outputPath,
      generated.replace(
        "## Follow-Up",
        [
        "## Account-Gated Evidence Notes",
        "",
        "- Preserve captured GSC indexing details.",
        "",
        "## Deployed Technical SEO Checks",
        "",
        "- Preserve deployed robots and canonical checks.",
        "",
        "## Local Changes Made",
        "",
        "- Preserve local change notes.",
        "",
          "## Follow-Up",
        ].join("\n"),
      ),
      "utf8",
    );

    await runWeeklyFixture(outputPath);

    const report = await readFile(outputPath, "utf8");

    assert.match(report, /^# Weekly SEO\/GEO Audit — 2026-06-13/m);
    assert.match(report, /## Account-Gated Evidence Notes\n\n- Preserve captured GSC indexing details\./);
    assert.match(report, /## Deployed Technical SEO Checks\n\n- Preserve deployed robots and canonical checks\./);
    assert.match(report, /## Local Changes Made\n\n- Preserve local change notes\./);
    assert.ok(report.indexOf("## Do Not Write Yet Gate") < report.indexOf("## Local Changes Made"));
    assert.ok(report.indexOf("## Local Changes Made") < report.indexOf("## Follow-Up"));
    assert.equal(report.match(/## Account-Gated Evidence Notes/g)?.length, 1);
    assert.equal(report.match(/## Deployed Technical SEO Checks/g)?.length, 1);
    assert.equal(report.match(/## Local Changes Made/g)?.length, 1);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator preserves report-specific manual sections in source order", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-preserve-report-manual-"));
  try {
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await runWeeklyFixture(outputPath);
    const generated = await readFile(outputPath, "utf8");
    await writeFile(
      outputPath,
      generated.replace(
        /## Follow-Up[\s\S]*$/,
        [
        "## Authenticated Indexing Snapshot",
        "",
        "- Preserve indexed and excluded counts.",
        "",
        "## English and Mandarin Coverage",
        "",
        "- Preserve locale coverage checks.",
        "",
        "## Change Decision",
        "",
        "- Preserve the evidence-backed change decision.",
        "",
        "## Verification Run",
        "",
        "- Preserve completed verification.",
        "",
        "## Follow-Up",
        "",
        "- [x] Run `pnpm build` and `pnpm seo:technical:built` to verify local built robots, sitemap, redirects, noindex headers, canonicals, and schema.",
        "- [ ] Run `pnpm build` and inspect bundle size.",
        "- [x] Run `pnpm seo:vercel:fetch -- --date 2026-06-13` before the weekly report; keep custom CTA events marked account-gated when the Vercel plan blocks them.",
        "- [x] Generate `pnpm seo:ai-visibility -- --date 2026-06-13`.",
        "- [ ] Manually check whether AI assistants mention Wenlan accurately.",
        "- [x] Preserve completed follow-up state.",
        "",
        ].join("\n"),
      ),
      "utf8",
    );

    await runWeeklyFixture(outputPath);

    const report = await readFile(outputPath, "utf8");
    const manualHeadings = [
      "## Authenticated Indexing Snapshot",
      "## English and Mandarin Coverage",
      "## Change Decision",
      "## Verification Run",
    ];

    for (const heading of manualHeadings) {
      assert.equal(report.match(new RegExp(heading, "g"))?.length, 1);
    }
    assert.match(report, /- Preserve indexed and excluded counts\./);
    assert.match(report, /- Preserve locale coverage checks\./);
    assert.match(report, /- Preserve the evidence-backed change decision\./);
    assert.match(report, /- Preserve completed verification\./);
    assert.match(report, /- \[x\] Preserve completed follow-up state\./);
    assert.match(
      report,
      /- \[x\] Run `pnpm build` and `pnpm seo:technical:built`/,
    );
    assert.match(
      report,
      /- \[ \] Run `pnpm build` and inspect bundle size\./,
    );
    assert.match(
      report,
      /- \[ \] Run `pnpm seo:technical:deployed` to verify deployed robots/,
    );
    assert.match(
      report,
      /- \[x\] Run `pnpm seo:vercel:fetch -- --date 2026-06-13`/,
    );
    assert.match(
      report,
      /- \[ \] Generate `pnpm seo:ai-visibility -- --date YYYY-MM-DD` and manually check/,
    );
    assert.match(
      report,
      /- \[x\] Generate `pnpm seo:ai-visibility -- --date 2026-06-13`\./,
    );
    assert.ok(
      manualHeadings.every((heading, index) => {
        if (index === 0) return true;
        return report.indexOf(manualHeadings[index - 1]) < report.indexOf(heading);
      }),
    );
    assert.ok(report.indexOf("## Verification Run") < report.indexOf("## Follow-Up"));
    assert.equal(report.match(/## Follow-Up/g)?.length, 1);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator ignores fenced and commented H2 examples while preserving manual sections", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-preserve-fenced-h2-"));
  try {
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await runWeeklyFixture(outputPath);
    const generated = await readFile(outputPath, "utf8");
    const manualSection = [
      "## Verification Notes",
      "",
      "```md",
      "```js",
      "## Snapshot",
      "",
      "This heading follows a same-character fence prefix with an info string.",
      "```",
      "",
      "<!--",
      "## Top Actions",
      "This commented heading is also not a report section.",
      "-->",
      "",
      "- Preserve the text after both examples.",
    ].join("\n");
    await writeFile(
      outputPath,
      generated.replace(
        "## Follow-Up",
        `${manualSection}\n\n## Follow-Up`,
      ),
      "utf8",
    );

    await runWeeklyFixture(outputPath);

    const report = await readFile(outputPath, "utf8");
    assert.match(report, new RegExp(manualSection.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(report, /- Preserve the text after both examples\./);
    assert.equal(report.match(/^## Verification Notes$/gm)?.length, 1);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator drops manual sections when same-range evidence rows change", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-fingerprint-change-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await runWeeklyFixture(outputPath);
    const generated = await readFile(outputPath, "utf8");
    const initialFingerprint = generated.match(
      /\| Evidence fingerprint \| ([^|]+) \|/,
    )?.[1];
    await writeFile(
      outputPath,
      generated.replace(
        "## Follow-Up",
        [
          "## Account-Gated Evidence Notes",
          "",
          "- This note belongs only to the original evidence rows.",
          "",
          "## Follow-Up",
        ].join("\n"),
      ),
      "utf8",
    );
    const queryFixture = await readFile(
      resolve(fixtureRoot, "gsc-queries.csv"),
      "utf8",
    );
    await writeFile(
      queriesPath,
      queryFixture.replace("origin app,0,19,0%,22.1", "origin app,0,18,0%,22.1"),
      "utf8",
    );

    await runWeeklyFixture(outputPath, { queriesPath });

    const report = await readFile(outputPath, "utf8");
    const currentFingerprint = report.match(
      /\| Evidence fingerprint \| ([^|]+) \|/,
    )?.[1];

    assert.ok(initialFingerprint);
    assert.ok(currentFingerprint);
    assert.notEqual(currentFingerprint, initialFingerprint);
    assert.doesNotMatch(report, /This note belongs only to the original evidence rows/);
    assert.doesNotMatch(report, /## Account-Gated Evidence Notes/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator drops preserved manual sections when old report lacks evidence metadata", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-metadata-less-manual-"));
  try {
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await writeFile(
      outputPath,
      [
        "# Weekly SEO/GEO Audit — 2026-06-13",
        "",
        "## Account-Gated Evidence Notes",
        "",
        "- stale metadata-less manual note",
        "",
        "## Local Changes Made",
        "",
        "- stale metadata-less change note",
        "",
        "## Do Not Write Yet Gate",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        resolve(fixtureRoot, "gsc-queries.csv"),
        "--pages",
        resolve(fixtureRoot, "gsc-pages.csv"),
        "--date",
        "2026-06-13",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.doesNotMatch(report, /stale metadata-less manual note/);
    assert.doesNotMatch(report, /stale metadata-less change note/);
    assert.doesNotMatch(report, /## Account-Gated Evidence Notes/);
    assert.doesNotMatch(report, /## Local Changes Made/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator drops preserved manual sections when evidence metadata changes", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-stale-manual-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await writeFile(
      queriesPath,
      [
        "Query,Clicks,Impressions,CTR,Position,Start date,End date,Source",
        "claude code memory,0,12,0%,12.4,2026-05-15,2026-06-11,fresh full GSC CSV export",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position,Start date,End date,Source",
        "https://wenlan.app/learn,0,54,0%,4.2,2026-05-15,2026-06-11,fresh full GSC CSV export",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      outputPath,
      [
        "# Weekly SEO/GEO Audit — 2026-06-13",
        "",
        "## Snapshot",
        "",
        "| Field | Value |",
        "| --- | --- |",
        "| Date range | 2026-04-01 to 2026-04-28 |",
        "| GSC data source | stale visible UI copy |",
        "",
        "## Account-Gated Evidence Notes",
        "",
        "- stale visible-row caveat",
        "",
        "## Do Not Write Yet Gate",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--date",
        "2026-06-13",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(report, /\| Date range \| 2026-05-15 to 2026-06-11 \|/);
    assert.match(report, /\| GSC data source \| fresh full GSC CSV export \|/);
    assert.doesNotMatch(report, /stale visible-row caveat/);
    assert.doesNotMatch(report, /## Account-Gated Evidence Notes/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator maps Superlocal queries to the Superlocal comparison page", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-superlocal-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await writeFile(
      queriesPath,
      [
        "Query,Clicks,Impressions,CTR,Position",
        "superlocal memory,0,3,0%,9.0",
        "super local memory,0,1,0%,37.0",
        "super local app,0,1,0%,31.0",
        "",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position",
        "https://wenlan.app/learn/wenlan-vs-superlocal-memory,0,3,0%,9.0",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--date",
        "2026-06-13",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(
      report,
      /\| `superlocal memory` \| Comparisons \| `\/learn\/wenlan-vs-superlocal-memory` \| 3 \| 0 \| 0\.00% \| 9\.0 \| title-meta-refresh \|/,
    );
    assert.match(
      report,
      /\| `super local memory` \| Comparisons \| `\/learn\/wenlan-vs-superlocal-memory` \| 1 \| 0 \| 0\.00% \| 37\.0 \| wait \|/,
    );
    assert.match(
      report,
      /\| `super local app` \| Other \| - \| 1 \| 0 \| 0\.00% \| 31\.0 \| wait \|/,
    );
    assert.doesNotMatch(report, /superlocal memory` \| Comparisons \| `\/learn\/wenlan-vs-basic-memory`/);
    assert.doesNotMatch(report, /super local memory` \| Other \| -/);
    assert.doesNotMatch(report, /super local app` \| Comparisons/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator maps AI knowledge-base and wiki demand before memory-adjacent groups", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "wenlan-seo-knowledge-base-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await writeFile(
      queriesPath,
      [
        "Query,Clicks,Impressions,CTR,Position",
        "build local ai knowledge base,0,2,0%,15.0",
        "markdown ai knowledge base,0,2,0%,16.0",
        "build ai knowledge base from obsidian,0,2,0%,16.5",
        "建立本地 AI 知識庫,0,2,0%,17.0",
        "Markdown AI 知識庫,0,2,0%,18.0",
        "如何用 Obsidian 建立 AI 知識庫,0,2,0%,18.5",
        "搭建本地 AI 知识库,0,2,0%,19.0",
        "文档 AI 知识库,0,2,0%,20.0",
        "用 Obsidian 搭建 AI 知识库,0,2,0%,20.5",
        "best ai knowledge base tool,0,4,0%,14.0",
        "如何選 AI 知識庫工具,0,4,0%,15.0",
        "可靠的 AI 知识库,0,4,0%,16.0",
        "llm wiki 2.0,0,3,0%,13.0",
        "source-backed wiki for ai agents,0,2,0%,18.0",
        "ai knowledge base for agents,0,4,0%,9.0",
        "obsidian knowledge base,0,4,0%,17.0",
        "obsidian claude code,0,3,0%,11.0",
        "obsidian,0,10,0%,12.0",
        "agent memory,0,10,0%,12.0",
        "AI 知識庫,0,1,0%,21.0",
        "AI 知识库,0,1,0%,19.0",
        "",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position",
        "https://wenlan.app/learn/ai-work-memory-vs-knowledge-base,0,4,0%,9.0",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--date",
        "2026-06-13",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");
    const topActions = report.match(
      /## Top Actions\n\n([\s\S]*?)\n\n## Query Action Queue/,
    )?.[1];

    assert.ok(topActions);
    assert.match(
      report,
      /\| `build local ai knowledge base` \| AI knowledge base \/ wiki \| `\/learn\/build-local-ai-knowledge-base-from-documents` \| 2 \|/,
    );
    assert.match(
      report,
      /\| `markdown ai knowledge base` \| AI knowledge base \/ wiki \| `\/learn\/build-local-ai-knowledge-base-from-documents` \| 2 \|/,
    );
    assert.match(
      report,
      /\| `build ai knowledge base from obsidian` \| AI knowledge base \/ wiki \| `\/learn\/build-local-ai-knowledge-base-from-documents` \| 2 \|/,
    );
    assert.match(
      report,
      /\| `建立本地 AI 知識庫` \| AI knowledge base \/ wiki \| `\/zh-TW\/learn\/build-local-ai-knowledge-base-from-documents` \| 2 \|/,
    );
    assert.match(
      report,
      /\| `Markdown AI 知識庫` \| AI knowledge base \/ wiki \| `\/zh-TW\/learn\/build-local-ai-knowledge-base-from-documents` \| 2 \|/,
    );
    assert.match(
      report,
      /\| `如何用 Obsidian 建立 AI 知識庫` \| AI knowledge base \/ wiki \| `\/zh-TW\/learn\/build-local-ai-knowledge-base-from-documents` \| 2 \|/,
    );
    assert.match(
      report,
      /\| `搭建本地 AI 知识库` \| AI knowledge base \/ wiki \| `\/zh-CN\/learn\/build-local-ai-knowledge-base-from-documents` \| 2 \|/,
    );
    assert.match(
      report,
      /\| `文档 AI 知识库` \| AI knowledge base \/ wiki \| `\/zh-CN\/learn\/build-local-ai-knowledge-base-from-documents` \| 2 \|/,
    );
    assert.match(
      report,
      /\| `用 Obsidian 搭建 AI 知识库` \| AI knowledge base \/ wiki \| `\/zh-CN\/learn\/build-local-ai-knowledge-base-from-documents` \| 2 \|/,
    );
    assert.match(
      report,
      /\| `best ai knowledge base tool` \| AI knowledge base \/ wiki \| `\/learn\/choose-ai-knowledge-base-tool` \| 4 \|/,
    );
    assert.match(
      report,
      /\| `如何選 AI 知識庫工具` \| AI knowledge base \/ wiki \| `\/zh-TW\/learn\/choose-ai-knowledge-base-tool` \| 4 \|/,
    );
    assert.match(
      report,
      /\| `可靠的 AI 知识库` \| AI knowledge base \/ wiki \| `\/zh-CN\/learn\/choose-ai-knowledge-base-tool` \| 4 \|/,
    );
    assert.match(
      report,
      /\| `llm wiki 2\.0` \| AI knowledge base \/ wiki \| `\/learn\/distilled-wiki-pages-ai-memory` \| 3 \|/,
    );
    assert.match(
      report,
      /\| `source-backed wiki for ai agents` \| AI knowledge base \/ wiki \| `\/learn\/source-backed-wiki-pages-ai-work` \| 2 \|/,
    );
    assert.match(
      report,
      /\| `ai knowledge base for agents` \| AI knowledge base \/ wiki \| `\/learn\/ai-work-memory-vs-knowledge-base` \| 4 \|/,
    );
    assert.match(
      report,
      /\| `obsidian knowledge base` \| Obsidian\/knowledge-base adjacent \| `\/learn\/wenlan-vs-obsidian-ai-memory` \| 4 \|/,
    );
    assert.match(
      report,
      /\| `obsidian claude code` \| Obsidian\/knowledge-base adjacent \| `\/learn\/wenlan-vs-obsidian-ai-memory` \| 3 \|/,
    );
    assert.match(
      report,
      /\| `AI 知識庫` \| AI knowledge base \/ wiki \| `\/zh-TW\/learn\/distilled-wiki-pages-ai-memory` \| 1 \|/,
    );
    assert.match(
      report,
      /\| `AI 知识库` \| AI knowledge base \/ wiki \| `\/zh-CN\/learn\/distilled-wiki-pages-ai-memory` \| 1 \|/,
    );
    assert.doesNotMatch(report, /`llm wiki 2\.0` \| Other \| -/);
    assert.doesNotMatch(report, /`ai knowledge base for agents` \| Obsidian/);
    assert.match(
      report,
      /\| `agent memory` \| AI work memory \| `\/learn\/ai-work-memory` \| 10 \|/,
    );
    assert.match(topActions, /obsidian claude code/);
    assert.doesNotMatch(topActions, /obsidian knowledge base/);
    assert.doesNotMatch(topActions, /\*\*[^*]+\*\* — `obsidian`:/);
    assert.doesNotMatch(topActions, /agent memory/);
    assert.match(
      report,
      /The campaign may still act earlier when inspectable Trends, independent corroboration, a clean coverage gap, maintained Wenlan proof, and standalone utility pass the complete candidate gate\./,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator maps named comparison products to their canonical pages", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "wenlan-seo-comparison-targets-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await writeFile(
      queriesPath,
      [
        "Query,Clicks,Impressions,CTR,Position",
        "basic memory,0,1,0%,20.0",
        "mempalace vs claude-mem,0,1,0%,44.0",
        "wenlan vs mem0,0,1,0%,30.0",
        "chatgpt memory alternative,0,1,0%,25.0",
        "obsidian vs wenlan,0,1,0%,18.0",
        "notion ai vs wenlan,0,1,0%,22.0",
        "",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position",
        "https://wenlan.app/learn/wenlan-vs-basic-memory,0,1,0%,20.0",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--date",
        "2026-06-13",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(
      report,
      /\| `basic memory` \| Comparisons \| `\/learn\/wenlan-vs-basic-memory` \|/,
    );
    assert.match(
      report,
      /\| `mempalace vs claude-mem` \| Comparisons \| `\/learn\/wenlan-vs-claude-mem` \|/,
    );
    assert.match(
      report,
      /\| `wenlan vs mem0` \| Comparisons \| `\/learn\/wenlan-vs-mem0` \|/,
    );
    assert.match(
      report,
      /\| `chatgpt memory alternative` \| Comparisons \| `\/learn\/wenlan-vs-chatgpt-memory` \|/,
    );
    assert.match(
      report,
      /\| `obsidian vs wenlan` \| Comparisons \| `\/learn\/wenlan-vs-obsidian-ai-memory` \|/,
    );
    assert.match(
      report,
      /\| `notion ai vs wenlan` \| Comparisons \| `\/learn\/wenlan-vs-notion-ai` \|/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

+test("seo weekly generator routes specific intent variants to their page owners", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "wenlan-seo-intent-owners-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "weekly-seo.md");

    await Promise.all([
      writeFile(
        queriesPath,
        [
          "Query,Clicks,Impressions,CTR,Position",
          "types of ai agent memory,0,11,0%,82.6",
          "ai agent memory glossary,0,3,0%,88.7",
          "obsidian 筆記,0,1,0%,35.0",
          "obsidian 笔记,0,1,0%,36.0",
          "stevenstavrakis/obsidian-mcp,0,1,0%,46.0",
          "",
        ].join("\n"),
        "utf8",
      ),
      writeFile(
        pagesPath,
        [
          "Page,Clicks,Impressions,CTR,Position",
          "https://wenlan.app/learn/ai-agent-memory-types,0,14,0%,84.0",
          "https://wenlan.app/zh-TW/learn/wenlan-vs-obsidian-ai-memory,0,1,0%,35.0",
          "https://wenlan.app/zh-CN/learn/wenlan-vs-obsidian-ai-memory,0,1,0%,36.0",
          "",
        ].join("\n"),
        "utf8",
      ),
    ]);

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--date",
        "2026-08-22",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");
    assert.match(
      report,
      /\| `types of ai agent memory` \| AI work memory \| `\/learn\/ai-agent-memory-types` \| 11 \|/,
    );
    assert.match(
      report,
      /\| `ai agent memory glossary` \| AI work memory \| `\/learn\/ai-agent-memory-types` \| 3 \|/,
    );
    assert.match(
      report,
      /\| `obsidian 筆記` \| Obsidian\/knowledge-base adjacent \| `\/zh-TW\/learn\/wenlan-vs-obsidian-ai-memory` \| 1 \|/,
    );
    assert.match(
      report,
      /\| `obsidian 笔记` \| Obsidian\/knowledge-base adjacent \| `\/zh-CN\/learn\/wenlan-vs-obsidian-ai-memory` \| 1 \|/,
    );
    assert.match(
      report,
      /\| `stevenstavrakis\/obsidian-mcp` \| Obsidian\/knowledge-base adjacent \| `\/learn\/wenlan-vs-obsidian-ai-memory` \| 1 \|/,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator treats guide root URLs as redirect technical checks", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-guides-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await writeFile(
      queriesPath,
      ["Query,Clicks,Impressions,CTR,Position", "origin guides,0,1,0%,12.0", ""].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position",
        "https://wenlan.app/guides,0,7,0%,12.0",
        "https://wenlan.app/docs/guides,0,2,0%,14.0",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--date",
        "2026-06-13",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(
      report,
      /\| `\/guides` \| 7 \| 0 \| 0\.00% \| 12\.0 \| technical-check \| Old guide URL should remain redirected; verify canonical Learn URL is indexed\. \|/,
    );
    assert.match(
      report,
      /\| `\/docs\/guides` \| 2 \| 0 \| 0\.00% \| 14\.0 \| technical-check \| Old guide URL should remain redirected; verify canonical Learn URL is indexed\. \|/,
    );
    assert.doesNotMatch(report, /`\/guides` .* title-meta-refresh/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator flags strong-rank no-click Learn hub pages for SERP copy refresh", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-learn-hub-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await writeFile(
      queriesPath,
      ["Query,Clicks,Impressions,CTR,Position", "origin memory,1,3,33.3%,5.7", ""].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position",
        "https://wenlan.app/learn,0,54,0%,4.2",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--date",
        "2026-06-13",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(
      report,
      /\| `\/learn` \| 54 \| 0 \| 0\.00% \| 4\.2 \| quick-answer-refresh \| Learn hub ranks strongly but earns no clicks\. Sharpen SERP title, description, and first-screen search-path copy\. \|/,
    );
    assert.match(
      report,
      /quick-answer-refresh.*`\/learn`: Learn hub ranks strongly but earns no clicks\./,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator flags high-impression weak-rank Learn pages for internal links", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-weak-learn-page-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    await writeFile(
      queriesPath,
      ["Query,Clicks,Impressions,CTR,Position", "claude code memory,0,6,0%,41.2", ""].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position",
        "https://wenlan.app/learn/claude-code-memory,0,37,0%,33.1",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--date",
        "2026-06-13",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(
      report,
      /\| `\/learn\/claude-code-memory` \| 37 \| 0 \| 0\.00% \| 33\.1 \| internal-link-refresh \| Existing Learn page has search demand but weak ranking\. Add links from stronger related pages before rewriting content\. \|/,
    );
    const topActions = report.match(
      /## Top Actions\n\n([\s\S]*?)\n\n## Query Action Queue/,
    )?.[1];
    assert.ok(topActions);
    assert.doesNotMatch(topActions, /claude-code-memory/);
    assert.match(
      report,
      /Generic memory rows remain visible evidence and measuring cohorts, but they do not nominate the next acquisition experiment\./,
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seo weekly generator maps existing AI memory app and filtered brand queries", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "origin-seo-brand-"));
  try {
    const queriesPath = join(outputRoot, "gsc-queries.csv");
    const pagesPath = join(outputRoot, "gsc-pages.csv");
    const outputPath = join(outputRoot, "2026-06-13-weekly-seo.md");

    const filteredBrandQuery =
      '"origin app" -"blue origin" -"a trusted origin" -site:reddit.com';

    await writeFile(
      queriesPath,
      [
        "Query,Clicks,Impressions,CTR,Position",
        "ai memory app,0,1,0%,98.0",
        "claude code memory,0,6,0%,41.2",
        "wenlan mcp,1,3,33.3%,4.0",
        `"${filteredBrandQuery.replace(/"/g, '""')}",0,19,0%,1.7`,
        "",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      pagesPath,
      [
        "Page,Clicks,Impressions,CTR,Position",
        "https://wenlan.app/learn/ai-work-memory,0,1,0%,98.0",
        "https://wenlan.app/,0,19,0%,1.7",
        "https://wenlan.app/,1,3,33.3%,4.0",
        "",
      ].join("\n"),
      "utf8",
    );

    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--",
        "--queries",
        queriesPath,
        "--pages",
        pagesPath,
        "--date",
        "2026-06-13",
        "--output",
        outputPath,
      ],
      { cwd: repoRoot },
    );

    const report = await readFile(outputPath, "utf8");

    assert.match(
      report,
      /\| `ai memory app` \| AI work memory \| `\/learn\/ai-work-memory` \| 1 \| 0 \| 0\.00% \| 98\.0 \| wait \|/,
    );
    assert.match(
      report,
      /\| `claude code memory` \| Claude Code \| `\/learn\/claude-code-memory` \| 6 \| 0 \| 0\.00% \| 41\.2 \| wait \|/,
    );
    assert.match(
      report,
      /\| `"origin app" -"blue origin" -"a trusted origin" -site:reddit\.com` \| Brand\/entity \| `\/` \| 19 \| 0 \| 0\.00% \| 1\.7 \| wait \|/,
    );
    assert.match(
      report,
      /\| `wenlan mcp` \| Brand\/entity \| `\/` \| 3 \| 1 \| 33\.33% \| 4\.0 \| wait \|/,
    );
    assert.doesNotMatch(report, /`ai memory app` \| Other \| -/);
    assert.doesNotMatch(report, /`wenlan mcp` \| Other \| -/);
    assert.doesNotMatch(report, /`"origin app" .* \| Architecture\/trust \| `\/learn\/local-first-ai-memory`/);
    assert.doesNotMatch(report, /visibility is weak/i);
    assert.doesNotMatch(report, /distribution/i);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("guide ai-memory-app redirects stay ahead of generic guide catchalls", async () => {
  const config = await readFile(resolve(repoRoot, "next.config.ts"), "utf8");

  const guidesSpecific = config.indexOf('source: "/guides/ai-memory-app"');
  const guidesCatchall = config.indexOf('source: "/guides/:slug"');
  const docsSpecific = config.indexOf('source: "/docs/guides/ai-memory-app"');
  const docsCatchall = config.indexOf('source: "/docs/guides/:slug"');

  assert.notEqual(guidesSpecific, -1);
  assert.notEqual(guidesCatchall, -1);
  assert.notEqual(docsSpecific, -1);
  assert.notEqual(docsCatchall, -1);
  assert.ok(guidesSpecific < guidesCatchall);
  assert.ok(docsSpecific < docsCatchall);
  assert.match(
    config.slice(guidesSpecific, guidesCatchall),
    /destination: "\/learn\/ai-work-memory"/,
  );
  assert.match(
    config.slice(docsSpecific, docsCatchall),
    /destination: "\/learn\/ai-work-memory"/,
  );
});

test("refreshed SEO pages preserve original publication dates", async () => {
  const learnArticles = await readRepo("src/app/learn/articles.ts");
  const docs = await readRepo("src/app/docs/docs.ts");
  const learnTemplate = await readRepo("src/app/learn/[slug]/page.tsx");
  const docsTemplate = await readRepo("src/app/docs/[slug]/page.tsx");

  assert.match(
    learnArticles,
    /slug: "wenlan-vs-superlocal-memory"[\s\S]*publishedAt: "2026-05-27",[\s\S]*updatedAt: "2026-07-24"/,
  );
  assert.match(
    docs,
    /slug: "configuration"[\s\S]*publishedAt: "2026-06-01",[\s\S]*updatedAt: DOCS_UPDATED_AT/,
  );
  assert.match(learnTemplate, /publishedTime: article\.publishedAt \?\? article\.updatedAt/);
  assert.match(learnTemplate, /datePublished: article\.publishedAt \?\? article\.updatedAt/);
  assert.match(learnTemplate, /modifiedTime: article\.updatedAt/);
  assert.match(learnTemplate, /dateModified: article\.updatedAt/);
  assert.match(docsTemplate, /publishedTime: page\.publishedAt \?\? page\.updatedAt/);
  assert.match(docsTemplate, /datePublished: page\.publishedAt \?\? page\.updatedAt/);
  assert.match(docsTemplate, /modifiedTime: page\.updatedAt/);
  assert.match(docsTemplate, /dateModified: page\.updatedAt/);
});

test("rss feed uses original publication dates for refreshed articles", async () => {
  const feedRoute = await readRepo("src/app/feed.xml/route.ts");

  assert.match(
    feedRoute,
    /<pubDate>\$\{rfc822Date\(article\.publishedAt \?\? article\.updatedAt\)\}<\/pubDate>/,
  );
  assert.match(feedRoute, /const latest = sorted\[0\]\?\.updatedAt/);
});

test("SuperLocalMemory comparison pins current benchmark protocols to checked sources", async () => {
  const learnArticles = await readRepo("src/app/learn/articles.ts");
  const marker = 'slug: "wenlan-vs-superlocal-memory"';
  const start = learnArticles.indexOf(marker);
  const end = learnArticles.indexOf('\n  {\n    slug: "', start + marker.length);
  const article = learnArticles.slice(start, end);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  assert.match(
    article,
    /Mode A Raw reports 60\.4% across 10 conversations and 1,276 scored questions with local retrieval and zero-LLM answer construction/,
  );
  assert.match(
    article,
    /Mode A Retrieval reports 74\.8% on the same question count, but uses GPT-4\.1-mini answer synthesis after local retrieval/,
  );
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
  assert.doesNotMatch(article, /zero-LLM \(pure-math\) retrieval configuration/);
  assert.doesNotMatch(article, /2026-06-24 source check/);
});

test("Learn index SERP copy leads with the source-backed AI knowledge-base and LLM-wiki category", async () => {
  const learnPage = await readRepo("src/app/learn/page.tsx");
  const learnOgImage = await readRepo("src/app/learn/opengraph-image.tsx");
  const normalizedLearnPage = learnPage.replace(/\s+/g, " ");

  assert.match(
    learnPage,
    /title: "LLM Wiki & AI Knowledge Base Guides \| Wenlan"/,
  );
  assert.match(
    learnPage,
    /Build a source-backed AI knowledge base with maintained LLM wiki pages, citations, review, refresh state, and local workflows for AI agents\./,
  );
  assert.match(learnPage, />\s*LLM wiki and AI knowledge base guides that stay current\.\s*</);
  assert.match(learnPage, />\s*Quick answer\s*</);
  assert.match(
    normalizedLearnPage,
    /An AI knowledge base stores and retrieves trusted sources\. A maintained LLM wiki adds reusable pages, citations, review, and refresh state\. Wenlan combines those layers locally for AI agents\./,
  );
  assert.match(learnPage, /AI knowledge base for agents/);
  assert.match(learnPage, /Claude Code memory/);
  assert.match(learnPage, /Basic Memory comparison/);
  assert.match(learnPage, /MCP memory server/);
  assert.match(learnPage, /Karpathy LLM wiki for AI agents/);
  assert.match(learnPage, /AI work memory vs knowledge base/);
  assert.match(learnPage, /Obsidian AI memory/);
  assert.doesNotMatch(learnPage, /Before you add memory to AI work\./);
  assert.match(learnOgImage, /title="Wenlan LLM wiki guides\."/);
  assert.doesNotMatch(learnOgImage, /Before you add memory to AI work\./);
});

test("homepage acquisition links expose the three-locale tool-selection guide", async () => {
  const [homePageComponent, ...homepages] = await Promise.all([
    readRepo("src/app/_pages/home.tsx"),
    ...["en", "zh-TW", "zh-CN"].map((locale) =>
      readRepo(`src/i18n/content/${locale}.ts`),
    ),
  ]);

  for (const homepage of homepages) {
    assert.match(homepage, /href:\s*"\/learn\/distilled-wiki-pages-ai-memory"/);
    assert.match(homepage, /href:\s*"\/learn\/source-backed-wiki-pages-ai-work"/);
    assert.match(homepage, /href:\s*"\/learn\/choose-ai-knowledge-base-tool"/);
  }

  assert.match(homepages[0], /Choose an AI knowledge base tool/);
  assert.match(homepages[1], /AI 知識庫選型/);
  assert.match(homepages[2], /AI 知识库选型/);
  assert.match(
    homePageComponent,
    /link\.id === "ai-knowledge-base-tool"[\s\S]*"w-full sm:w-auto"/,
  );
});

test("configuration docs link to the Claude Code memory guide", async () => {
  const docs = await readRepo("src/app/docs/docs.ts");

  assert.match(
    docs,
    /slug: "configuration"[\s\S]*label: "Read the Claude Code memory guide"[\s\S]*href: "\/learn\/claude-code-memory"/,
  );
});

test("MCP article links contextually to the complete client setup guide", async () => {
  const articles = await readRepo("src/app/learn/articles.ts");
  const articlePage = await readRepo("src/app/learn/[slug]/page.tsx");

  assert.match(
    articles,
    /slug: "mcp-memory-server"[\s\S]*label: "Read all MCP client setup paths"[\s\S]*href: "\/docs\/mcp-clients"/,
  );
  assert.match(articles, /export type LearnArticleSection = \{[\s\S]*link\?: \{/);
  assert.match(articlePage, /\{section\.link && \(/);
  assert.match(articlePage, /href=\{section\.link\.href\}/);
});

test("root layout declares intentional smooth scroll behavior", async () => {
  const layout = await readRepo("src/app/layout.tsx");
  const globals = await readFile(resolve(repoRoot, "src/app/globals.css"), "utf8");

  assert.match(globals, /scroll-behavior:\s*smooth/);
  assert.match(layout, /data-scroll-behavior="smooth"/);
});

test("learn article layout allows comparison content to shrink on mobile", async () => {
  const articlePage = await readRepo("src/app/learn/[slug]/page.tsx");

  assert.match(articlePage, /className="min-w-0 space-y-14"/);
  assert.match(articlePage, /className="min-w-0 space-y-6 lg:sticky/);
});
