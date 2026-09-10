import assert from "node:assert/strict";
import test from "node:test";
import {
  SITE_DOWNLOAD_PATHS,
  selectedReleaseTag,
  verifyDownloadHtml,
  verifyPublishedRelease,
  verifyResolvedRelease,
  verifySiteRelease,
} from "./release-check.mjs";

const release = {
  version: "1.2.3", tag: "v1.2.3", publishedAt: "2026-09-04T20:31:03Z",
  releaseUrl: "https://github.com/7xuanlu/wenlan/releases/tag/v1.2.3",
  assets: [{ id: "desktop", href: "https://github.com/7xuanlu/wenlan/releases/download/v1.2.3/desktop.dmg", size: "1.0 MiB" }],
};
function published() {
  return {
    tag_name: release.tag, draft: false, prerelease: false,
    published_at: release.publishedAt, html_url: release.releaseUrl,
    assets: [
      { name: "desktop.dmg", browser_download_url: release.assets[0].href, size: 1048576, state: "uploaded" },
      ...["latest.json", "SHA256SUMS", "Wenlan_aarch64.app.tar.gz", "Wenlan_aarch64.app.tar.gz.sig", "Wenlan_1.2.3_x64-setup.exe.sig"].map(name => ({ name, size: 100, state: "uploaded" })),
    ],
  };
}
test("local source selection uses the website version, independent of newer repository tags", () => {
  assert.equal(selectedReleaseTag(release), "v1.2.3");
  assert.throws(() => selectedReleaseTag({ ...release, tag: "v1.2.4" }));
});
test("live check accepts a complete stable release and rejects draft, prerelease, or newer latest", () => {
  verifyPublishedRelease(published(), release);
  assert.throws(() => verifyPublishedRelease({ ...published(), draft: true }, release), /draft/);
  assert.throws(() => verifyPublishedRelease({ ...published(), prerelease: true }, release), /prerelease/);
  assert.throws(() => verifyPublishedRelease({ ...published(), tag_name: "v1.2.4" }, release), /latest stable/);
});
test("live check rejects missing, incomplete, or differently sized downloads", () => {
  const missing = published(); missing.assets.shift();
  assert.throws(() => verifyPublishedRelease(missing, release), /Missing published download/);
  const pending = published(); pending.assets[0].state = "new";
  assert.throws(() => verifyPublishedRelease(pending, release), /not uploaded/);
  const wrongSize = published(); wrongSize.assets[0].size *= 2;
  assert.throws(() => verifyPublishedRelease(wrongSize, release), /size differs/);
  const noUpdater = published(); noUpdater.assets = noUpdater.assets.filter(a => a.name !== "latest.json");
  assert.throws(() => verifyPublishedRelease(noUpdater, release), /Missing release support asset/);
});

test("site validation compares the deployed manifest and all localized download pages to the latest release", async () => {
  const calls = [];
  const page = `<span>Stable ${release.tag}</span><a href="${release.assets[0].href}">download</a><script type="application/ld+json">${JSON.stringify({ "@type": "SoftwareApplication", softwareVersion: release.version, downloadUrl: release.releaseUrl })}</script>`;
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url.endsWith("/api/release")) return Response.json(release);
    return new Response(page, { status: 200, headers: { "content-type": "text/html" } });
  };

  verifyResolvedRelease(release, release);
  verifyDownloadHtml(page, "/download", release);
  const evidence = await verifySiteRelease("https://wenlan.example", release, fetchImpl);
  assert.deepEqual(evidence.pages.map(({ path }) => path), SITE_DOWNLOAD_PATHS);
  assert.deepEqual(calls, [
    "https://wenlan.example/api/release",
    ...SITE_DOWNLOAD_PATHS.map((path) => `https://wenlan.example${path}`),
  ]);
});

test("site validation rejects a manifest or page that drifts from GitHub latest", async () => {
  assert.throws(
    () => verifyResolvedRelease({ ...release, tag: "v1.2.4" }, release),
    /tag differs/,
  );
  const page = `<span>Stable v1.2.4</span><a href="${release.assets[0].href}">download</a><script type="application/ld+json">${JSON.stringify({ "@type": "SoftwareApplication", softwareVersion: "1.2.4", downloadUrl: release.releaseUrl })}</script>`;
  assert.throws(() => verifyDownloadHtml(page, "/download", release), /selected release tag/);
});
