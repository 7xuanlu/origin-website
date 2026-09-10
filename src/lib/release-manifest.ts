import { WENLAN_RELEASE } from "./releases";

export const RELEASE_API =
  "https://api.github.com/repos/7xuanlu/wenlan/releases/latest";
export const RELEASE_REVALIDATE_SECONDS = 300;

const RELEASE_REPOSITORY = "https://github.com/7xuanlu/wenlan";
const RELEASE_DOWNLOAD_BASE = `${RELEASE_REPOSITORY}/releases/download`;
const STABLE_TAG_PATTERN = /^v(0|[1-9]\d{0,4})\.(0|[1-9]\d{0,4})\.(0|[1-9]\d{0,4})$/;

export const RELEASE_ASSET_IDS = [
  "windows-desktop-x64",
  "windows-x64",
  "macos-arm64",
  "macos-runtime-arm64",
  "linux-x64",
  "linux-arm64",
] as const;

export type WenlanReleaseAssetId = (typeof RELEASE_ASSET_IDS)[number];

export interface WenlanReleaseAsset {
  id: WenlanReleaseAssetId;
  href: string;
  format: string;
  size: string;
  guideHref?: string;
}

export interface WenlanRelease {
  version: string;
  tag: string;
  publishedAt: string;
  releaseUrl: string;
  setupGuideUrl: string;
  assets: readonly WenlanReleaseAsset[];
}

export interface ReleaseDownloadInference {
  asset_id: WenlanReleaseAssetId;
  release_tag: string;
}

interface PublishedAsset {
  name: string;
  browser_download_url: string;
  size: number;
  state: string;
}

interface AssetDefinition {
  id: WenlanReleaseAssetId;
  format: string;
  fileName: (version: string) => string;
}

const ASSET_DEFINITIONS: readonly AssetDefinition[] = [
  {
    id: "windows-desktop-x64",
    format: "EXE",
    fileName: (version) => `Wenlan_${version}_x64-setup.exe`,
  },
  {
    id: "windows-x64",
    format: "ZIP",
    fileName: () => "wenlan-windows-x64.zip",
  },
  {
    id: "macos-arm64",
    format: "DMG",
    fileName: (version) => `Wenlan_${version}_aarch64.dmg`,
  },
  {
    id: "macos-runtime-arm64",
    format: "TAR.GZ",
    fileName: () => "wenlan-darwin-arm64.tar.gz",
  },
  {
    id: "linux-x64",
    format: "TAR.GZ",
    fileName: () => "wenlan-linux-x64.tar.gz",
  },
  {
    id: "linux-arm64",
    format: "TAR.GZ",
    fileName: () => "wenlan-linux-arm64.tar.gz",
  },
];

const SUPPORT_ASSET_NAMES = (version: string) => [
  "latest.json",
  "SHA256SUMS",
  "Wenlan_aarch64.app.tar.gz",
  "Wenlan_aarch64.app.tar.gz.sig",
  `Wenlan_${version}_x64-setup.exe.sig`,
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function invalid(message: string): never {
  throw new Error(`Invalid GitHub release manifest: ${message}`);
}

function isPublishedTimestamp(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
    Number.isFinite(Date.parse(value))
  );
}

function bundledAsset(id: WenlanReleaseAssetId) {
  const asset = WENLAN_RELEASE.assets.find((candidate) => candidate.id === id);
  if (!asset) invalid(`bundled asset ${id} is missing`);
  return asset as WenlanReleaseAsset;
}

function bundledFileName(href: string): string {
  const fileName = href.slice(href.lastIndexOf("/") + 1);
  if (!fileName || fileName.includes("?")) invalid("bundled asset URL is malformed");
  return fileName;
}

function replaceBundledTag(url: string, tag: string): string {
  const pattern = /\/v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\//;
  if (!pattern.test(url)) invalid("bundled guide URL does not contain a stable release tag");
  return url.replace(pattern, `/${tag}/`);
}

function validateBundledAssetContract(): void {
  const bundledIds = WENLAN_RELEASE.assets.map((asset) => asset.id);
  if (
    !STABLE_TAG_PATTERN.test(WENLAN_RELEASE.tag) ||
    WENLAN_RELEASE.version !== WENLAN_RELEASE.tag.slice(1)
  ) {
    invalid("bundled release version/tag is not stable vN.N.N");
  }
  if (
    WENLAN_RELEASE.releaseUrl !==
    `${RELEASE_REPOSITORY}/releases/tag/${WENLAN_RELEASE.tag}`
  ) {
    invalid("bundled release URL does not match its tag");
  }
  if (
    !isPublishedTimestamp(WENLAN_RELEASE.publishedAt)
  ) {
    invalid("bundled published timestamp is invalid");
  }
  if (
    bundledIds.length !== RELEASE_ASSET_IDS.length ||
    RELEASE_ASSET_IDS.some((id) => !bundledIds.includes(id))
  ) {
    invalid("bundled release asset IDs do not match the six website assets");
  }
  for (const definition of ASSET_DEFINITIONS) {
    const asset = bundledAsset(definition.id);
    if (asset.format !== definition.format) {
      invalid(`bundled asset format differs for ${definition.id}`);
    }
    const expectedName = definition.fileName(WENLAN_RELEASE.version);
    if (bundledFileName(asset.href) !== expectedName) {
      invalid(`bundled asset filename differs for ${definition.id}`);
    }
    if (
      asset.href !==
      `${RELEASE_DOWNLOAD_BASE}/${WENLAN_RELEASE.tag}/${expectedName}`
    ) {
      invalid(`bundled asset URL differs for ${definition.id}`);
    }
    if (!/^\d+(?:\.\d)? MiB$/.test(asset.size) || Number.parseFloat(asset.size) <= 0) {
      invalid(`bundled asset size is invalid for ${definition.id}`);
    }
    if (
      asset.guideHref !== undefined &&
      !asset.guideHref.startsWith(`${RELEASE_REPOSITORY}/blob/${WENLAN_RELEASE.tag}/`)
    ) {
      invalid(`bundled guide URL differs for ${definition.id}`);
    }
  }
  if (
    !WENLAN_RELEASE.setupGuideUrl.startsWith(
      `${RELEASE_REPOSITORY}/blob/${WENLAN_RELEASE.tag}/`,
    )
  ) {
    invalid("bundled setup guide URL differs from its tag");
  }
}

validateBundledAssetContract();

function expectedAsset(definition: AssetDefinition, version: string, tag: string) {
  const name = definition.fileName(version);
  return {
    name,
    href: `${RELEASE_DOWNLOAD_BASE}/${tag}/${name}`,
  };
}

function requirePublishedAsset(
  assets: readonly unknown[],
  name: string,
  href: string,
  label: string,
): PublishedAsset {
  const matches = assets.filter(
    (candidate): candidate is Record<string, unknown> =>
      isRecord(candidate) && candidate.name === name,
  );
  if (matches.length !== 1) {
    invalid(`missing or duplicate ${label} asset ${name}`);
  }
  const asset = matches[0];
  if (asset.state !== "uploaded") invalid(`${label} asset ${name} is not uploaded`);
  if (asset.browser_download_url !== href) {
    invalid(`${label} asset ${name} has an unexpected download URL`);
  }
  const size = asset.size;
  if (typeof size !== "number" || !Number.isSafeInteger(size) || size <= 0) {
    invalid(`${label} asset ${name} must have a positive integer size`);
  }
  return {
    name: asset.name as string,
    browser_download_url: asset.browser_download_url as string,
    size,
    state: asset.state as string,
  };
}

function bytesToMiB(bytes: number): string {
  return `${(bytes / 1024 ** 2).toFixed(1)} MiB`;
}

export function normalizePublishedRelease(input: unknown): WenlanRelease {
  if (!isRecord(input)) invalid("response is not an object");

  const tag = input.tag_name;
  if (typeof tag !== "string" || !STABLE_TAG_PATTERN.test(tag)) {
    invalid("tag_name is not a stable tag vN.N.N");
  }
  const version = tag.slice(1);

  if (input.draft !== false) invalid("release is a draft");
  if (input.prerelease !== false) invalid("release is a prerelease");
  if (!isPublishedTimestamp(input.published_at)) {
    invalid("published_at is not a valid timestamp");
  }

  const releaseUrl = `${RELEASE_REPOSITORY}/releases/tag/${tag}`;
  if (input.html_url !== releaseUrl) invalid("html_url does not match the release tag");
  if (!Array.isArray(input.assets)) invalid("assets is not an array");

  const assets = input.assets;
  const manifestAssets: WenlanReleaseAsset[] = [];
  for (const definition of ASSET_DEFINITIONS) {
    const expected = expectedAsset(definition, version, tag);
    const published = requirePublishedAsset(assets, expected.name, expected.href, definition.id);
    const source = bundledAsset(definition.id);
    manifestAssets.push({
      ...source,
      href: expected.href,
      size: bytesToMiB(published.size),
      ...(source.guideHref ? { guideHref: replaceBundledTag(source.guideHref, tag) } : {}),
    });
  }

  for (const name of SUPPORT_ASSET_NAMES(version)) {
    requirePublishedAsset(
      assets,
      name,
      `${RELEASE_DOWNLOAD_BASE}/${tag}/${name}`,
      "support",
    );
  }

  return {
    version,
    tag,
    publishedAt: input.published_at,
    releaseUrl,
    setupGuideUrl: replaceBundledTag(WENLAN_RELEASE.setupGuideUrl, tag),
    assets: manifestAssets,
  };
}

export function inferReleaseDownload(href: unknown): ReleaseDownloadInference | null {
  if (typeof href !== "string" || href.length === 0) return null;

  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }

  if (
    url.href !== href ||
    url.protocol !== "https:" ||
    url.hostname !== "github.com" ||
    url.username !== "" ||
    url.password !== "" ||
    url.port !== "" ||
    url.pathname.startsWith("//") ||
    url.search !== "" ||
    url.hash !== ""
  ) {
    return null;
  }

  const match = url.pathname.match(
    /^\/7xuanlu\/wenlan\/releases\/download\/(v[^/]+)\/([^/]+)$/,
  );
  if (!match || !STABLE_TAG_PATTERN.test(match[1])) return null;

  const releaseTag = match[1];
  const version = releaseTag.slice(1);
  const definition = ASSET_DEFINITIONS.find(
    (candidate) => candidate.fileName(version) === match[2],
  );
  if (!definition) return null;

  return { asset_id: definition.id, release_tag: releaseTag };
}

export async function fetchPublishedRelease(
  fetchImpl: typeof fetch = fetch,
): Promise<WenlanRelease> {
  const response = await fetchImpl(RELEASE_API, {
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "wenlan-site-release-manifest",
    },
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) {
    throw new Error(`GitHub release manifest unavailable: HTTP ${response.status}`);
  }
  return normalizePublishedRelease(await response.json());
}
