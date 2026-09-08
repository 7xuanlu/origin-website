const WENLAN_RELEASE_DOWNLOAD_BASE =
  "https://github.com/7xuanlu/wenlan/releases/download/v0.18.3";

export const WENLAN_RELEASE = {
  version: "0.18.3",
  tag: "v0.18.3",
  publishedAt: "2026-09-08T00:52:58Z",
  releaseUrl: "https://github.com/7xuanlu/wenlan/releases/tag/v0.18.3",
  setupGuideUrl:
    "https://github.com/7xuanlu/wenlan/blob/v0.18.3/docs/setup-with-ai.md#install-the-runtime",
  assets: [
    {
      id: "windows-desktop-x64",
      href: `${WENLAN_RELEASE_DOWNLOAD_BASE}/Wenlan_0.18.3_x64-setup.exe`,
      format: "EXE",
      size: "59.9 MiB",
      guideHref:
        "https://github.com/7xuanlu/wenlan/blob/v0.18.3/README.md#desktop-app",
    },
    {
      id: "windows-x64",
      href: `${WENLAN_RELEASE_DOWNLOAD_BASE}/wenlan-windows-x64.zip`,
      format: "ZIP",
      size: "74.0 MiB",
    },
    {
      id: "macos-arm64",
      href: `${WENLAN_RELEASE_DOWNLOAD_BASE}/Wenlan_0.18.3_aarch64.dmg`,
      format: "DMG",
      size: "84.0 MiB",
      guideHref:
        "https://github.com/7xuanlu/wenlan/blob/v0.18.3/README.md#desktop-app",
    },
    {
      id: "macos-runtime-arm64",
      href: `${WENLAN_RELEASE_DOWNLOAD_BASE}/wenlan-darwin-arm64.tar.gz`,
      format: "TAR.GZ",
      size: "50.3 MiB",
    },
    {
      id: "linux-x64",
      href: `${WENLAN_RELEASE_DOWNLOAD_BASE}/wenlan-linux-x64.tar.gz`,
      format: "TAR.GZ",
      size: "62.9 MiB",
    },
    {
      id: "linux-arm64",
      href: `${WENLAN_RELEASE_DOWNLOAD_BASE}/wenlan-linux-arm64.tar.gz`,
      format: "TAR.GZ",
      size: "63.1 MiB",
    },
  ],
} as const;

export type WenlanReleaseAssetId =
  (typeof WENLAN_RELEASE.assets)[number]["id"];
