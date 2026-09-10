import assert from "node:assert/strict";
import test from "node:test";
import { WENLAN_RELEASE } from "../src/lib/releases.ts";

import {
  RELEASE_API,
  RELEASE_REVALIDATE_SECONDS,
  fetchPublishedRelease,
  inferReleaseDownload,
  normalizePublishedRelease,
} from "../src/lib/release-manifest.ts";

const REPOSITORY = "https://github.com/7xuanlu/wenlan";
const DOWNLOAD_BASE = `${REPOSITORY}/releases/download`;

const ASSETS = [
  ["windows-desktop-x64", (version) => `Wenlan_${version}_x64-setup.exe`, "EXE", 2],
  ["windows-x64", () => "wenlan-windows-x64.zip", "ZIP", 3],
  ["macos-arm64", (version) => `Wenlan_${version}_aarch64.dmg`, "DMG", 4],
  ["macos-runtime-arm64", () => "wenlan-darwin-arm64.tar.gz", "TAR.GZ", 5],
  ["linux-x64", () => "wenlan-linux-x64.tar.gz", "TAR.GZ", 6],
  ["linux-arm64", () => "wenlan-linux-arm64.tar.gz", "TAR.GZ", 7],
];

function assetPayload(version, tag, name, size = 1) {
  return {
    name,
    browser_download_url: `${DOWNLOAD_BASE}/${tag}/${name}`,
    size,
    state: "uploaded",
  };
}

function publishedRelease({
  version = "1.2.3",
  publishedAt = "2026-09-10T12:34:56Z",
  overrides = {},
} = {}) {
  const tag = `v${version}`;
  const assets = ASSETS.map(([, fileName]) => assetPayload(version, tag, fileName(version), 2 * 1024 * 1024));
  assets.push(
    assetPayload(version, tag, "latest.json"),
    assetPayload(version, tag, "SHA256SUMS"),
    assetPayload(version, tag, "Wenlan_aarch64.app.tar.gz"),
    assetPayload(version, tag, "Wenlan_aarch64.app.tar.gz.sig"),
    assetPayload(version, tag, `Wenlan_${version}_x64-setup.exe.sig`),
  );
  return {
    tag_name: tag,
    draft: false,
    prerelease: false,
    published_at: publishedAt,
    html_url: `${REPOSITORY}/releases/tag/${tag}`,
    assets,
    ...overrides,
  };
}

test("release constants keep the API and cache contract stable", () => {
  assert.equal(RELEASE_API, "https://api.github.com/repos/7xuanlu/wenlan/releases/latest");
  assert.equal(RELEASE_REVALIDATE_SECONDS, 300);
});

test("latest equal to the bundled snapshot is valid, not a failed rewrite", () => {
  const release = normalizePublishedRelease(publishedRelease({version: WENLAN_RELEASE.version}));
  assert.equal(release.tag, WENLAN_RELEASE.tag);
  assert.equal(release.setupGuideUrl, WENLAN_RELEASE.setupGuideUrl);
});

test("normalization atomically selects a newer stable release and formats its complete manifest", () => {
  const release = normalizePublishedRelease(publishedRelease({ version: "9.8.7" }));

  assert.equal(release.version, "9.8.7");
  assert.equal(release.tag, "v9.8.7");
  assert.equal(release.publishedAt, "2026-09-10T12:34:56Z");
  assert.equal(release.releaseUrl, `${REPOSITORY}/releases/tag/v9.8.7`);
  assert.equal(release.setupGuideUrl, `${REPOSITORY}/blob/v9.8.7/docs/setup-with-ai.md#install-the-runtime`);
  assert.deepEqual(release.assets.map(({ id }) => id), ASSETS.map(([id]) => id));
  assert.deepEqual(
    release.assets.map(({ href, format, size }) => ({ href, format, size })),
    ASSETS.map(([, fileName, format]) => ({
      href: `${DOWNLOAD_BASE}/v9.8.7/${fileName("9.8.7")}`,
      format,
      size: "2.0 MiB",
    })),
  );
  assert.equal(release.assets[0].guideHref, `${REPOSITORY}/blob/v9.8.7/README.md#desktop-app`);
  assert.equal(release.assets[2].guideHref, `${REPOSITORY}/blob/v9.8.7/README.md#desktop-app`);
});

test("download inference accepts only exact website assets for any stable release tag", () => {
  for (const [asset_id, fileName] of ASSETS) {
    const href = `${DOWNLOAD_BASE}/v9.8.7/${fileName("9.8.7")}`;
    assert.deepEqual(inferReleaseDownload(href), { asset_id, release_tag: "v9.8.7" });
  }
});

test("download inference rejects foreign, ambiguous, and mismatched URLs", () => {
  const rejected = [
    `${DOWNLOAD_BASE}/v9.8.7/Wenlan_9.8.7_x64-setup.exe?download=1`,
    `${DOWNLOAD_BASE}/v9.8.7/Wenlan_9.8.7_x64-setup.exe#fragment`,
    "http://github.com/7xuanlu/wenlan/releases/download/v9.8.7/Wenlan_9.8.7_x64-setup.exe",
    `https://github.com.evil.example/7xuanlu/wenlan/releases/download/v9.8.7/Wenlan_9.8.7_x64-setup.exe`,
    `https://github.com/other/wenlan/releases/download/v9.8.7/Wenlan_9.8.7_x64-setup.exe`,
    `${DOWNLOAD_BASE}/latest/Wenlan_9.8.7_x64-setup.exe`,
    `${DOWNLOAD_BASE}/v9.8/Wenlan_9.8.7_x64-setup.exe`,
    `${DOWNLOAD_BASE}/v9.8.7-beta/Wenlan_9.8.7_x64-setup.exe`,
    `${DOWNLOAD_BASE}/v09.8.7/Wenlan_9.8.7_x64-setup.exe`,
    `${DOWNLOAD_BASE}/v9.8.7/Wenlan_9.8.6_x64-setup.exe`,
    `${DOWNLOAD_BASE}/v9.8.7/Wenlan_9.8.7_aarch64.pkg`,
    `${DOWNLOAD_BASE}/v9.8.7/latest.json`,
    `${DOWNLOAD_BASE}/v9.8.7/wenlan-windows-x64.zip/extra`,
    `${DOWNLOAD_BASE}/v9.8.7%2FWenlan_9.8.7_x64-setup.exe`,
    `https://user:pass@github.com/7xuanlu/wenlan/releases/download/v9.8.7/Wenlan_9.8.7_x64-setup.exe`,
  ];
  for (const href of rejected) assert.equal(inferReleaseDownload(href), null, href);
  assert.equal(inferReleaseDownload(null), null);
  assert.equal(inferReleaseDownload(""), null);
});

test("normalization rejects unstable, malformed, incomplete, and misdirected releases", () => {
  const cases = [
    ["draft", { draft: true }, /draft/],
    ["prerelease", { prerelease: true }, /prerelease/],
    ["invalid tag", { tag_name: "release-9.8.7" }, /stable tag/],
    ["invalid publication time", { published_at: "not-a-timestamp" }, /published_at/],
    ["wrong repository URL", { html_url: "https://github.com/other/repo/releases/tag/v9.8.7" }, /html_url/],
    ["missing API assets", { assets: undefined }, /assets/],
  ];
  for (const [label, overrides, message] of cases) {
    assert.throws(() => normalizePublishedRelease(publishedRelease({ overrides })), message, label);
  }

  const missingMain = publishedRelease();
  missingMain.assets = missingMain.assets.filter(({ name }) => name !== "wenlan-linux-x64.tar.gz");
  assert.throws(() => normalizePublishedRelease(missingMain), /linux-x64/);

  const badMain = publishedRelease();
  badMain.assets[0].state = "new";
  assert.throws(() => normalizePublishedRelease(badMain), /uploaded/);

  for (const [label, size] of [["zero", 0], ["negative", -1], ["fractional", 1.5], ["string", "2"]]) {
    const badSize = publishedRelease();
    badSize.assets[0].size = size;
    assert.throws(() => normalizePublishedRelease(badSize), /positive integer size/, label);
  }

  const wrongMainUrl = publishedRelease();
  wrongMainUrl.assets[0].browser_download_url = `${DOWNLOAD_BASE}/v9.8.7/Wenlan_9.8.6_x64-setup.exe`;
  assert.throws(() => normalizePublishedRelease(wrongMainUrl), /download URL/);

  for (const name of ["latest.json", "SHA256SUMS", "Wenlan_aarch64.app.tar.gz", "Wenlan_aarch64.app.tar.gz.sig", "Wenlan_1.2.3_x64-setup.exe.sig"]) {
    const missingSupport = publishedRelease();
    missingSupport.assets = missingSupport.assets.filter((asset) => asset.name !== name);
    assert.throws(() => normalizePublishedRelease(missingSupport), /support asset/);
  }
});

test("fetchPublishedRelease validates injected successful responses and bounds the request", async () => {
  const calls = [];
  const release = await fetchPublishedRelease(async (input, init) => {
    calls.push([input, init]);
    return new Response(JSON.stringify(publishedRelease({ version: "3.4.5" })), { status: 200 });
  });

  assert.equal(release.tag, "v3.4.5");
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], RELEASE_API);
  assert.equal(calls[0][1].cache, "no-store");
  assert.equal(calls[0][1].headers.Accept, "application/vnd.github+json");
  assert.equal(calls[0][1].headers["User-Agent"], "wenlan-site-release-manifest");
  assert.ok(calls[0][1].signal instanceof AbortSignal);
});

test("fetchPublishedRelease propagates network, HTTP, JSON, and candidate validation failures", async () => {
  await assert.rejects(
    fetchPublishedRelease(async () => {
      throw new Error("offline");
    }),
    /offline/,
  );
  await assert.rejects(
    fetchPublishedRelease(async () => new Response("unavailable", { status: 503 })),
    /HTTP 503/,
  );
  await assert.rejects(
    fetchPublishedRelease(async () => new Response("{", { status: 200 })),
    SyntaxError,
  );
  await assert.rejects(
    fetchPublishedRelease(async () => new Response(JSON.stringify(publishedRelease({ overrides: { prerelease: true } })), { status: 200 })),
    /prerelease/,
  );
});
