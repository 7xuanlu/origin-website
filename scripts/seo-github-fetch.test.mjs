import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import { WENLAN_RELEASE } from "../src/lib/releases.ts";
import {
  buildGithubMetadata,
  collectReleasePages,
  fetchSiteReleaseManifest,
  githubHeaders,
  releaseContractFromManifest,
  releaseContract,
} from "./seo-github-fetch.mjs";

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const fixtureRoot = resolve(__dirname, "fixtures/seo-weekly");

const currentAssets = [
  ["wenlan-cli-darwin-arm64.tar.gz", 0],
  ["wenlan-darwin-arm64.tar.gz", 7],
  ["wenlan-linux-arm64.tar.gz", 3],
  ["wenlan-linux-x64.tar.gz", 11],
  ["wenlan-mcp-darwin-arm64.tar.gz", 2],
  ["wenlan-windows-x64.zip", 4],
  [`Wenlan_${WENLAN_RELEASE.version}_aarch64.dmg`, 2],
  [`Wenlan_${WENLAN_RELEASE.version}_x64-setup.exe`, 1],
].map(([name, download_count], index) => ({
  name,
  size: 1_000 + index,
  download_count,
}));

test("deployed manifest evidence distinguishes fallback, cache, and missing provenance", async () => {
  for (const source of ["github-cache", "bundled-fallback", null, "unexpected"]) {
    const evidence = await fetchSiteReleaseManifest("https://wenlan.app", async () =>
      Response.json(WENLAN_RELEASE, { headers: source ? { "X-Wenlan-Release-Source": source } : {} }),
    );
    assert.equal(evidence.resolutionSource,
      ["github-cache", "bundled-fallback"].includes(source) ? source : "unavailable");
  }
});

test("deployed release manifests define the website-linked asset contract", () => {
  const manifest = {
    version: "9.8.7",
    tag: "v9.8.7",
    publishedAt: "2026-09-10T12:34:56Z",
    releaseUrl: "https://github.com/7xuanlu/wenlan/releases/tag/v9.8.7",
    setupGuideUrl: "https://github.com/7xuanlu/wenlan/blob/v9.8.7/docs/setup-with-ai.md#install-the-runtime",
    assets: [
      ["windows-desktop-x64", "Wenlan_9.8.7_x64-setup.exe"],
      ["windows-x64", "wenlan-windows-x64.zip"],
      ["macos-arm64", "Wenlan_9.8.7_aarch64.dmg"],
      ["macos-runtime-arm64", "wenlan-darwin-arm64.tar.gz"],
      ["linux-x64", "wenlan-linux-x64.tar.gz"],
      ["linux-arm64", "wenlan-linux-arm64.tar.gz"],
    ].map(([id, name]) => ({
      id,
      href: `https://github.com/7xuanlu/wenlan/releases/download/v9.8.7/${name}`,
      format: "ZIP",
      size: "1.0 MiB",
    })),
  };

  assert.deepEqual(releaseContractFromManifest(manifest), {
    tag: "v9.8.7",
    websiteAssetNames: [
      "Wenlan_9.8.7_x64-setup.exe",
      "wenlan-windows-x64.zip",
      "Wenlan_9.8.7_aarch64.dmg",
      "wenlan-darwin-arm64.tar.gz",
      "wenlan-linux-x64.tar.gz",
      "wenlan-linux-arm64.tar.gz",
    ],
  });

  assert.throws(
    () => releaseContractFromManifest({ ...manifest, releaseUrl: "https://github.com/other/repo/releases/tag/v9.8.7" }),
    /releaseUrl/,
  );
  assert.throws(
    () => releaseContractFromManifest({
      ...manifest,
      assets: manifest.assets.map((asset, index) => index === 0
        ? { ...asset, href: asset.href.replace("Wenlan_9.8.7_x64-setup.exe", "wrong.exe") }
        : asset),
    }),
    /asset|download/i,
  );
});

test("GitHub metadata links downloads to the deployed manifest rather than the bundled snapshot", () => {
  const manifest = {
    version: "9.8.7",
    tag: "v9.8.7",
    publishedAt: "2026-09-10T12:34:56Z",
    releaseUrl: "https://github.com/7xuanlu/wenlan/releases/tag/v9.8.7",
    setupGuideUrl: "https://github.com/7xuanlu/wenlan/blob/v9.8.7/docs/setup-with-ai.md#install-the-runtime",
    assets: [
      ["windows-desktop-x64", "Wenlan_9.8.7_x64-setup.exe"],
      ["windows-x64", "wenlan-windows-x64.zip"],
      ["macos-arm64", "Wenlan_9.8.7_aarch64.dmg"],
      ["macos-runtime-arm64", "wenlan-darwin-arm64.tar.gz"],
      ["linux-x64", "wenlan-linux-x64.tar.gz"],
      ["linux-arm64", "wenlan-linux-arm64.tar.gz"],
    ].map(([id, name], index) => ({
      id,
      href: `https://github.com/7xuanlu/wenlan/releases/download/v9.8.7/${name}`,
      format: "ZIP",
      size: "1.0 MiB",
      ...(index === 0 || index === 2 ? { guideHref: "https://github.com/7xuanlu/wenlan/blob/v9.8.7/README.md#desktop-app" } : {}),
    })),
  };
  const contract = releaseContractFromManifest(manifest);
  const dynamicAssets = manifest.assets.map((asset, index) => ({
    name: asset.href.split("/").pop(),
    browser_download_url: asset.href,
    size: 1_000 + index,
    download_count: index + 1,
  }));
  const metadata = buildGithubMetadata({
    repository: { stargazers_count: 1 },
    releases: [{ tag_name: manifest.tag, published_at: manifest.publishedAt, assets: dynamicAssets }],
    contract,
    date: "2026-09-10",
    capturedAt: "2026-09-10T15:00:00.000Z",
    siteRelease: {
      source: "Wenlan deployed release manifest",
      url: "https://wenlan.example/api/release",
      capturedAt: "2026-09-10T15:00:00.000Z",
      manifest,
    },
  });

  assert.equal(metadata.currentRelease.tag, "v9.8.7");
  assert.equal(metadata.currentRelease.websiteAssetDownloads, 21);
  assert.equal(metadata.siteRelease.manifest.tag, "v9.8.7");
  assert.equal(metadata.siteRelease.url, "https://wenlan.example/api/release");
});

test("GitHub fetch records stars and cumulative website release downloads", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "wenlan-github-evidence-"));
  try {
    const source = await readFile(resolve(repoRoot, "src/lib/releases.ts"), "utf8");
    const metadata = buildGithubMetadata({
      repository: { stargazers_count: 47 },
      releases: [
          {
            tag_name: WENLAN_RELEASE.tag,
            published_at: WENLAN_RELEASE.publishedAt,
            assets: currentAssets,
          },
          {
            tag_name: "v0.15.1",
            published_at: "2026-07-30T00:00:00Z",
            assets: [{ name: "older.zip", size: 100, download_count: 5 }],
          },
        ],
      contract: releaseContract(source),
      date: "2026-08-01",
      capturedAt: "2026-08-01T15:00:00.000Z",
    });
    const metadataPath = join(outputRoot, "github-metadata.json");
    await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
    assert.equal(metadata.stars, 47);
    assert.equal(metadata.currentRelease.tag, WENLAN_RELEASE.tag);
    assert.equal(metadata.currentRelease.websiteAssetDownloads, 28);
    assert.equal(metadata.currentRelease.assetDownloads, 30);
    assert.equal(metadata.allReleaseAssetDownloads, 35);

    const reportPath = join(outputRoot, "weekly.md");
    await execFileAsync(
      process.execPath,
      [
        resolve(repoRoot, "scripts/seo-weekly.mjs"),
        "--queries",
        resolve(fixtureRoot, "gsc-queries.csv"),
        "--pages",
        resolve(fixtureRoot, "gsc-pages.csv"),
        "--date",
        "2026-08-01",
        "--github-metadata",
        metadataPath,
        "--output",
        reportPath,
      ],
      { cwd: repoRoot },
    );
    const report = await readFile(reportPath, "utf8");
    assert.match(report, /GitHub stars \| 47/);
    assert.ok(report.includes(`Website-linked ${WENLAN_RELEASE.tag} asset downloads | 28`));
    assert.match(report, /All release asset downloads \| 35/);
    assert.match(report, /GitHub Release Evidence/);
    assert.match(report, /cumulative point-in-time counters/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("GitHub credentials are attached only to the official API origin", () => {
  const previousToken = process.env.GITHUB_TOKEN;
  process.env.GITHUB_TOKEN = "must-not-leak";
  try {
    assert.equal(
      githubHeaders("https://api.github.com/repos/7xuanlu/wenlan").Authorization,
      "Bearer must-not-leak",
    );
    assert.equal(
      githubHeaders("https://example.com/repos/7xuanlu/wenlan").Authorization,
      undefined,
    );
  } finally {
    if (previousToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = previousToken;
  }
});

test("GitHub release pagination fails closed at the safety cap", async () => {
  let calls = 0;
  await assert.rejects(
    collectReleasePages(async () => {
      calls += 1;
      return Array.from({ length: 100 }, (_, index) => ({ id: index }));
    }),
    /exceeds the 1000 release safety cap/,
  );
  assert.equal(calls, 10);
});
