#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const DEFAULT_OUTPUT = "/tmp/wenlan-seo/github-metadata.json";
const DEFAULT_API_BASE_URL = "https://api.github.com";
const DEFAULT_SITE_URL = "https://wenlan.app";
const REPOSITORY = "7xuanlu/wenlan";
const REPOSITORY_URL = `https://github.com/${REPOSITORY}`;
const MAX_RELEASE_PAGES = 10;
const RELEASE_ASSETS = [
  ["windows-desktop-x64", (version) => `Wenlan_${version}_x64-setup.exe`],
  ["windows-x64", () => "wenlan-windows-x64.zip"],
  ["macos-arm64", (version) => `Wenlan_${version}_aarch64.dmg`],
  ["macos-runtime-arm64", () => "wenlan-darwin-arm64.tar.gz"],
  ["linux-x64", () => "wenlan-linux-x64.tar.gz"],
  ["linux-arm64", () => "wenlan-linux-arm64.tar.gz"],
];
const DESKTOP_GUIDE_ASSETS = new Set(["windows-desktop-x64", "macos-arm64"]);
const execFileAsync = promisify(execFile);

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    if (!arg.startsWith("--")) throw new Error(`Unexpected argument: ${arg}`);

    const key = arg.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    args[key] = value;
    index += 1;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date ?? "")) {
    throw new Error("Missing or invalid --date; expected YYYY-MM-DD");
  }

  return {
    date: args.date,
    outputPath: resolve(args.output || DEFAULT_OUTPUT),
    apiBaseUrl: (args["api-base-url"] || DEFAULT_API_BASE_URL).replace(/\/$/, ""),
    siteUrl: args["site-url"] || DEFAULT_SITE_URL,
  };
}

export function releaseContract(source) {
  const tag = source.match(/\btag:\s*"([^"]+)"/)?.[1];
  const websiteAssetNames = [
    ...source.matchAll(/\$\{WENLAN_RELEASE_DOWNLOAD_BASE\}\/([^`]+)`/g),
  ].map((match) => match[1]);

  if (!tag || websiteAssetNames.length === 0) {
    throw new Error("Could not read the current release contract from src/lib/releases.ts");
  }

  return { tag, websiteAssetNames };
}

function requireManifestObject(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new Error("Site release manifest must be an object");
  }
  const version = manifest.version;
  const tag = manifest.tag;
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version ?? "")) {
    throw new Error("Site release manifest version must be stable semver");
  }
  if (tag !== `v${version}`) {
    throw new Error("Site release manifest tag must match version");
  }
  if (typeof manifest.publishedAt !== "string" || !Number.isFinite(Date.parse(manifest.publishedAt))) {
    throw new Error("Site release manifest publishedAt must be a timestamp");
  }
  if (manifest.releaseUrl !== `${REPOSITORY_URL}/releases/tag/${tag}`) {
    throw new Error("Site release manifest releaseUrl must point to the exact repository tag");
  }
  if (manifest.setupGuideUrl !== `${REPOSITORY_URL}/blob/${tag}/docs/setup-with-ai.md#install-the-runtime`) {
    throw new Error("Site release manifest setupGuideUrl must point to the exact repository tag");
  }
  if (!Array.isArray(manifest.assets)) {
    throw new Error("Site release manifest assets must be an array");
  }
  return manifest;
}

export function releaseContractFromManifest(input) {
  const manifest = requireManifestObject(input);
  if (manifest.assets.length !== RELEASE_ASSETS.length) {
    throw new Error(`Site release manifest must contain exactly ${RELEASE_ASSETS.length} website assets`);
  }

  const websiteAssetNames = [];
  for (const [assetId, filenameForVersion] of RELEASE_ASSETS) {
    const assets = manifest.assets.filter((asset) => asset?.id === assetId);
    if (assets.length !== 1) {
      throw new Error(`Site release manifest must contain exactly one asset ${assetId}`);
    }
    const expectedName = filenameForVersion(manifest.version);
    const expectedHref = `${REPOSITORY_URL}/releases/download/${manifest.tag}/${expectedName}`;
    if (assets[0].href !== expectedHref) {
      throw new Error(`Site release asset ${assetId} has the wrong download URL`);
    }
    if (assets[0].guideHref !== undefined) {
      const expectedGuideHref = `${REPOSITORY_URL}/blob/${manifest.tag}/README.md#desktop-app`;
      if (!DESKTOP_GUIDE_ASSETS.has(assetId) || assets[0].guideHref !== expectedGuideHref) {
        throw new Error(`Site release asset ${assetId} has the wrong guide URL`);
      }
    }
    websiteAssetNames.push(expectedName);
  }
  return { tag: manifest.tag, websiteAssetNames };
}

function siteEndpoint(siteUrl) {
  let url;
  try {
    url = new URL(siteUrl);
  } catch {
    throw new Error("--site-url must be an absolute http(s) URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:" || url.search || url.hash) {
    throw new Error("--site-url must be an absolute http(s) URL without query or fragment");
  }
  url.pathname = "/api/release";
  return url.href;
}

export async function fetchSiteReleaseManifest(siteUrl, fetchImpl = fetch) {
  const endpoint = siteEndpoint(siteUrl);
  const response = await fetchImpl(endpoint, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response?.ok) {
    throw new Error(`Deployed release manifest unavailable: HTTP ${response?.status ?? "unknown"} for ${endpoint}`);
  }
  const manifest = await response.json();
  releaseContractFromManifest(manifest);
  const source = response.headers?.get("x-wenlan-release-source");
  const resolutionSource = ["github-cache", "bundled-fallback"].includes(source)
    ? source : "unavailable";
  return { manifest, endpoint, resolutionSource };
}

export function githubHeaders(url) {
  const isOfficialApi = new URL(url).origin === new URL(DEFAULT_API_BASE_URL).origin;
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "wenlan-site-seo-github-fetch",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(process.env.GITHUB_TOKEN && isOfficialApi
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  };
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: githubHeaders(url) });
  if (!response.ok) {
    throw new Error(`GitHub REST ${response.status} for ${url}`);
  }
  return response.json();
}

export async function collectReleasePages(fetchPage) {
  const releases = [];
  for (let page = 1; page <= MAX_RELEASE_PAGES; page += 1) {
    const batch = await fetchPage(page);
    if (!Array.isArray(batch)) {
      throw new Error("GitHub releases response must be an array");
    }
    releases.push(...batch);
    if (batch.length < 100) return releases;
  }
  throw new Error(
    `GitHub release count exceeds the ${MAX_RELEASE_PAGES * 100} release safety cap`,
  );
}

async function fetchAllReleases(apiBaseUrl) {
  return collectReleasePages((page) =>
    fetchJson(
      `${apiBaseUrl}/repos/${REPOSITORY}/releases?per_page=100&page=${page}`,
    ),
  );
}

async function ghApiJson(endpoint) {
  const { stdout } = await execFileAsync(
    "gh",
    ["api", endpoint],
    { maxBuffer: 8 * 1024 * 1024 },
  );
  return JSON.parse(stdout);
}

async function fetchAllReleasesWithGh() {
  return collectReleasePages((page) =>
    ghApiJson(`repos/${REPOSITORY}/releases?per_page=100&page=${page}`),
  );
}

async function fetchGithubEvidence(apiBaseUrl) {
  try {
    return await Promise.all([
      fetchJson(`${apiBaseUrl}/repos/${REPOSITORY}`),
      fetchAllReleases(apiBaseUrl),
    ]);
  } catch (error) {
    if (
      apiBaseUrl !== DEFAULT_API_BASE_URL ||
      process.env.GITHUB_TOKEN ||
      !/^GitHub REST 403\b/.test(error.message)
    ) {
      throw error;
    }

    console.warn(
      "[seo-github] anonymous REST returned 403; retrying through authenticated gh CLI",
    );
    const [repository, releases] = await Promise.all([
      ghApiJson(`repos/${REPOSITORY}`),
      fetchAllReleasesWithGh(),
    ]);
    return [repository, releases];
  }
}

function safeCount(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer`);
  }
  return value;
}

export function buildGithubMetadata({
  repository,
  releases,
  contract,
  date,
  capturedAt,
  siteRelease,
}) {
  const currentRelease = releases.find((release) => release.tag_name === contract.tag);
  if (!currentRelease) {
    throw new Error(`GitHub release ${contract.tag} was not returned`);
  }

  const websiteAssetSet = new Set(contract.websiteAssetNames);
  const assets = currentRelease.assets.map((asset) => ({
    name: asset.name,
    size: safeCount(asset.size, `asset ${asset.name} size`),
    downloadCount: safeCount(
      asset.download_count,
      `asset ${asset.name} download_count`,
    ),
    websiteLinked: websiteAssetSet.has(asset.name),
  }));
  const returnedWebsiteAssets = new Set(
    assets.filter((asset) => asset.websiteLinked).map((asset) => asset.name),
  );
  const missingAssets = contract.websiteAssetNames.filter(
    (name) => !returnedWebsiteAssets.has(name),
  );
  if (missingAssets.length > 0) {
    throw new Error(`GitHub release is missing website assets: ${missingAssets.join(", ")}`);
  }

  const allReleaseAssets = releases.flatMap((release) => release.assets ?? []);
  return {
    schemaVersion: 1,
    source: "GitHub REST API",
    repository: REPOSITORY,
    reportDate: date,
    capturedAt,
    stars: safeCount(repository.stargazers_count, "repository stargazers_count"),
    releaseCount: releases.length,
    allReleaseAssetCount: allReleaseAssets.length,
    allReleaseAssetDownloads: allReleaseAssets.reduce(
      (sum, asset) =>
        sum + safeCount(asset.download_count, `asset ${asset.name} download_count`),
      0,
    ),
    currentRelease: {
      tag: currentRelease.tag_name,
      publishedAt: currentRelease.published_at,
      assetDownloads: assets.reduce((sum, asset) => sum + asset.downloadCount, 0),
      websiteAssetDownloads: assets
        .filter((asset) => asset.websiteLinked)
        .reduce((sum, asset) => sum + asset.downloadCount, 0),
      assets,
    },
    ...(siteRelease ? { siteRelease } : {}),
  };
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const capturedAt = new Date().toISOString();
  const { manifest, endpoint: siteManifestUrl, resolutionSource } = await fetchSiteReleaseManifest(args.siteUrl);
  const contract = releaseContractFromManifest(manifest);
  const [repository, releases] = await fetchGithubEvidence(args.apiBaseUrl);
  const metadata = buildGithubMetadata({
    repository,
    releases,
    contract,
    date: args.date,
    capturedAt,
    siteRelease: {
      source: "Wenlan deployed release manifest",
      resolutionSource,
      url: siteManifestUrl,
      capturedAt,
      manifest,
    },
  });

  await mkdir(dirname(args.outputPath), { recursive: true });
  await writeFile(args.outputPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
  console.log(
    `[seo-github] wrote ${args.outputPath}: ${metadata.currentRelease.websiteAssetDownloads} website-linked ${metadata.currentRelease.tag} downloads; ${metadata.stars} stars`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch((error) => {
    console.error(`[seo-github] ${error.message}`);
    process.exit(1);
  });
}
