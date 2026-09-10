import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import {
  fetchPublishedRelease,
  RELEASE_API,
} from "../src/lib/release-manifest.ts";
import { WENLAN_RELEASE } from "../src/lib/releases.ts";

export { RELEASE_API };

export const SITE_DOWNLOAD_PATHS = [
  "/download",
  "/zh-TW/download",
  "/zh-CN/download",
];

const REQUEST_TIMEOUT_MS = 30_000;

// Local contracts inspect the selected source tag. Only the live check proves
// published/stable status: a newer Git tag may still be a prerelease.
export function selectedReleaseTag(release = WENLAN_RELEASE) {
  assert.match(release.version, /^\d+\.\d+\.\d+$/);
  assert.equal(release.tag, `v${release.version}`);
  return release.tag;
}

export function verifyPublishedRelease(published, release = WENLAN_RELEASE) {
  assert.equal(published.draft, false, "GitHub release is a draft");
  assert.equal(published.prerelease, false, "GitHub release is a prerelease");
  assert.equal(published.tag_name, selectedReleaseTag(release), "Website does not match GitHub latest stable release");
  assert.equal(published.published_at, release.publishedAt, "Release publication timestamp differs");
  assert.equal(published.html_url, release.releaseUrl, "Release URL differs");
  for (const asset of release.assets) {
    const upstream = published.assets.find((item) => item.browser_download_url === asset.href);
    assert.ok(upstream, `Missing published download: ${asset.id}`);
    assert.equal(upstream.state, "uploaded", `Download is not uploaded: ${asset.id}`);
    assert.ok(upstream.size > 0, `Empty download: ${asset.id}`);
    assert.equal(`${(upstream.size / 1024 ** 2).toFixed(1)} MiB`, asset.size, `Download size differs: ${asset.id}`);
  }
  for (const name of ["latest.json", "SHA256SUMS", "Wenlan_aarch64.app.tar.gz", "Wenlan_aarch64.app.tar.gz.sig", `Wenlan_${release.version}_x64-setup.exe.sig`]) {
    assert.ok(published.assets.some((asset) => asset.name === name && asset.state === "uploaded" && asset.size > 0), `Missing release support asset: ${name}`);
  }
}

function requireHttpUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be an absolute http(s) URL`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${label} must be an absolute http(s) URL`);
  }
  if (url.search || url.hash) {
    throw new Error(`${label} must not include a query or fragment`);
  }
  return url;
}

function siteEndpoint(siteUrl, pathname) {
  const url = requireHttpUrl(siteUrl, "--site");
  url.pathname = pathname;
  return url.href;
}

function responseJson(response, endpoint) {
  if (!response || typeof response.ok !== "boolean") {
    throw new Error(`Site response for ${endpoint} is invalid`);
  }
  if (!response.ok) {
    throw new Error(`Site release evidence unavailable: HTTP ${response.status} for ${endpoint}`);
  }
  return response.json();
}

async function responseText(response, endpoint) {
  if (!response || typeof response.ok !== "boolean") {
    throw new Error(`Site response for ${endpoint} is invalid`);
  }
  if (!response.ok) {
    throw new Error(`Site release evidence unavailable: HTTP ${response.status} for ${endpoint}`);
  }
  return response.text();
}

export function verifyResolvedRelease(siteRelease, latestRelease) {
  assert.ok(siteRelease && typeof siteRelease === "object", "Site release manifest must be an object");
  assert.equal(siteRelease.version, latestRelease.version, "Site release version differs from latest stable release");
  assert.equal(siteRelease.tag, latestRelease.tag, "Site release tag differs from latest stable release");
  assert.equal(siteRelease.publishedAt, latestRelease.publishedAt, "Site release publication timestamp differs");
  assert.equal(siteRelease.releaseUrl, latestRelease.releaseUrl, "Site release URL differs from latest stable release");
  assert.equal(siteRelease.setupGuideUrl, latestRelease.setupGuideUrl, "Site setup guide URL differs from latest stable release");
  assert.ok(Array.isArray(siteRelease.assets), "Site release manifest assets must be an array");
  assert.equal(siteRelease.assets.length, latestRelease.assets.length, "Site release asset count differs from latest stable release");

  for (const expected of latestRelease.assets) {
    const actual = siteRelease.assets.find((asset) => asset?.id === expected.id);
    assert.ok(actual, `Site release is missing asset: ${expected.id}`);
    assert.equal(actual.href, expected.href, `Site release download URL differs: ${expected.id}`);
    assert.equal(actual.format, expected.format, `Site release asset format differs: ${expected.id}`);
    assert.equal(actual.size, expected.size, `Site release asset size differs: ${expected.id}`);
    if (expected.guideHref === undefined) {
      assert.equal(actual.guideHref, undefined, `Unexpected site asset guide URL: ${expected.id}`);
    } else {
      assert.equal(actual.guideHref, expected.guideHref, `Site release guide URL differs: ${expected.id}`);
    }
  }
  return siteRelease;
}

function htmlText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function jsonLdSchemas(html) {
  const schemas = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      schemas.push(JSON.parse(match[1]));
    } catch {
      throw new Error("Download page contains invalid JSON-LD");
    }
  }
  return schemas;
}

export function verifyDownloadHtml(html, pagePath, release) {
  assert.equal(typeof html, "string", `Download page ${pagePath} must be HTML`);
  const text = htmlText(html);
  assert.ok(text.includes(release.tag), `${pagePath} does not display the selected release tag ${release.tag}`);

  for (const asset of release.assets) {
    assert.ok(
      html.includes(`href="${asset.href}"`) || html.includes(`href='${asset.href}'`),
      `${pagePath} is missing release download ${asset.id}`,
    );
  }

  const schema = jsonLdSchemas(html).find((item) => item?.["@type"] === "SoftwareApplication");
  assert.ok(schema, `${pagePath} is missing SoftwareApplication JSON-LD`);
  assert.equal(schema.softwareVersion, release.version, `${pagePath} schema softwareVersion differs`);
  assert.equal(schema.downloadUrl, release.releaseUrl, `${pagePath} schema downloadUrl differs`);
  return true;
}

export async function fetchSiteReleaseEvidence(siteUrl, fetchImpl = fetch) {
  const manifestEndpoint = siteEndpoint(siteUrl, "/api/release");
  const response = await fetchImpl(manifestEndpoint, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  return {
    manifest: await responseJson(response, manifestEndpoint),
    manifestEndpoint,
  };
}

export async function verifySiteRelease(siteUrl, latestRelease, fetchImpl = fetch) {
  const { manifest, manifestEndpoint } = await fetchSiteReleaseEvidence(siteUrl, fetchImpl);
  verifyResolvedRelease(manifest, latestRelease);
  const pages = [];
  for (const pagePath of SITE_DOWNLOAD_PATHS) {
    const endpoint = siteEndpoint(siteUrl, pagePath);
    const response = await fetchImpl(endpoint, {
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const html = await responseText(response, endpoint);
    verifyDownloadHtml(html, pagePath, latestRelease);
    pages.push({ path: pagePath, endpoint });
  }
  return { manifest, manifestEndpoint, pages };
}

export function parseArgs(argv) {
  let site;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    if (arg !== "--site") throw new Error(`Unexpected argument: ${arg}`);
    site = argv[index + 1];
    if (!site || site.startsWith("--")) throw new Error("Missing value for --site");
    index += 1;
  }
  return { site };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const latestRelease = await fetchPublishedRelease();
    if (args.site) {
      await verifySiteRelease(args.site, latestRelease);
    }
    console.log(`[release-check] PASS ${latestRelease.tag}: stable release, ${latestRelease.assets.length} website downloads and updater/checksum assets verified via ${RELEASE_API} at ${new Date().toISOString()}${args.site ? `; site ${args.site} checked` : ""}`);
  } catch (error) {
    console.error(`[release-check] FAIL ${error.message}`);
    process.exitCode = 1;
  }
}
