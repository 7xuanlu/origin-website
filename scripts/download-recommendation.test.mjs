import assert from "node:assert/strict";
import test from "node:test";

import {
  detectReleaseAssetId,
  isDesktopApp,
  preferDesktopBuild,
  recommendedReleaseAssetId,
  recommendedReleaseAssetIdFromClientHints,
} from "../src/lib/platform-recommendation.ts";

test("desktop user agents map to one explicit published release asset", () => {
  assert.equal(
    recommendedReleaseAssetId(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ),
    "windows-desktop-x64",
  );
  assert.equal(
    recommendedReleaseAssetId(
      "Mozilla/5.0 (Macintosh; arm64 Mac OS X 14_6) AppleWebKit/605.1.15",
    ),
    "macos-arm64",
  );
  assert.equal(
    recommendedReleaseAssetId(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    ),
    "linux-x64",
  );
  assert.equal(
    recommendedReleaseAssetId(
      "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36",
    ),
    "linux-arm64",
  );
});

test("mobile, architecture-ambiguous, and unknown user agents fall back to the complete download hub", () => {
  assert.equal(
    recommendedReleaseAssetId(
      "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36",
    ),
    null,
  );
  assert.equal(
    recommendedReleaseAssetId(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
    ),
    null,
  );
  assert.equal(
    recommendedReleaseAssetId(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
    ),
    null,
  );
  assert.equal(
    recommendedReleaseAssetId(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
    ),
    null,
  );
  assert.equal(
    recommendedReleaseAssetId(
      "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36",
    ),
    null,
  );
  assert.equal(recommendedReleaseAssetId("curl/8.0"), null);
  assert.equal(recommendedReleaseAssetId(""), null);
});

test("client hints map desktop platforms to published release assets", () => {
  assert.equal(
    recommendedReleaseAssetIdFromClientHints({
      platform: "macOS",
      architecture: "arm",
      bitness: "64",
      mobile: false,
    }),
    "macos-arm64",
  );
  assert.equal(
    recommendedReleaseAssetIdFromClientHints({
      platform: "Windows",
      architecture: "x86",
      bitness: "64",
      mobile: false,
    }),
    "windows-x64",
  );
  assert.equal(
    recommendedReleaseAssetIdFromClientHints({
      platform: "Linux",
      architecture: "x86",
      bitness: "64",
      mobile: false,
    }),
    "linux-x64",
  );
  assert.equal(
    recommendedReleaseAssetIdFromClientHints({
      platform: "Linux",
      architecture: "arm",
      bitness: "64",
      mobile: false,
    }),
    "linux-arm64",
  );
});

test("client hints without a published build fall back to the download hub", () => {
  assert.equal(
    recommendedReleaseAssetIdFromClientHints({
      platform: "macOS",
      architecture: "x86",
      bitness: "64",
      mobile: false,
    }),
    null,
  );
  assert.equal(
    recommendedReleaseAssetIdFromClientHints({
      platform: "Windows",
      architecture: "x86",
      bitness: "32",
      mobile: false,
    }),
    null,
  );
  assert.equal(
    recommendedReleaseAssetIdFromClientHints({
      platform: "Android",
      architecture: "arm",
      bitness: "64",
      mobile: true,
    }),
    null,
  );
  assert.equal(recommendedReleaseAssetIdFromClientHints({}), null);
});

test("desktop app detection covers installers only", () => {
  assert.equal(isDesktopApp("windows-desktop-x64"), true);
  assert.equal(isDesktopApp("macos-arm64"), true);
  assert.equal(isDesktopApp("windows-x64"), false);
  assert.equal(isDesktopApp("macos-runtime-arm64"), false);
  assert.equal(isDesktopApp("linux-arm64"), false);
  assert.equal(isDesktopApp(null), false);
});

test("desktop upgrades keep the CLI mapping for headless-only platforms", () => {
  assert.equal(preferDesktopBuild("windows-x64"), "windows-desktop-x64");
  assert.equal(preferDesktopBuild("macos-arm64"), "macos-arm64");
  assert.equal(preferDesktopBuild("macos-runtime-arm64"), "macos-runtime-arm64");
  assert.equal(preferDesktopBuild("linux-x64"), "linux-x64");
  assert.equal(preferDesktopBuild("linux-arm64"), "linux-arm64");
  assert.equal(preferDesktopBuild(null), null);
});

test("detection resolves Apple Silicon Macs that report Intel in the user agent", async () => {
  assert.equal(
    await detectReleaseAssetId({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      userAgentData: {
        platform: "macOS",
        getHighEntropyValues: async () => ({
          platform: "macOS",
          architecture: "arm",
          bitness: "64",
          mobile: false,
        }),
      },
    }),
    "macos-arm64",
  );
});

test("detection prefers the desktop installer on Windows", async () => {
  assert.equal(
    await detectReleaseAssetId({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      userAgentData: {
        platform: "Windows",
        getHighEntropyValues: async () => ({
          platform: "Windows",
          architecture: "x86",
          bitness: "64",
          mobile: false,
        }),
      },
    }),
    "windows-desktop-x64",
  );
});

test("detection keeps the headless archive where no desktop build exists", async () => {
  assert.equal(
    await detectReleaseAssetId({
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      userAgentData: {
        platform: "Linux",
        getHighEntropyValues: async () => ({
          platform: "Linux",
          architecture: "x86",
          bitness: "64",
          mobile: false,
        }),
      },
    }),
    "linux-x64",
  );
});

test("detection falls back to user-agent parsing without client hints", async () => {
  assert.equal(
    await detectReleaseAssetId({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    }),
    null,
  );
  assert.equal(
    await detectReleaseAssetId({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      userAgentData: {
        platform: "Windows",
        getHighEntropyValues: async () => {
          throw new Error("denied");
        },
      },
    }),
    "windows-desktop-x64",
  );
});

test("detection keeps Intel Macs on the download hub when hints are conclusive", async () => {
  assert.equal(
    await detectReleaseAssetId({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      userAgentData: {
        platform: "macOS",
        getHighEntropyValues: async () => ({
          platform: "macOS",
          architecture: "x86",
          bitness: "64",
          mobile: false,
        }),
      },
    }),
    null,
  );
});

test("asset ids reduce to install platform families", async () => {
  const { platformKeyForAssetId } = await import(
    "../src/lib/platform-recommendation.ts"
  );
  assert.equal(platformKeyForAssetId("windows-desktop-x64"), "windows");
  assert.equal(platformKeyForAssetId("windows-x64"), "windows");
  assert.equal(platformKeyForAssetId("macos-arm64"), "macos");
  assert.equal(platformKeyForAssetId("macos-runtime-arm64"), "macos");
  assert.equal(platformKeyForAssetId("linux-x64"), "linux");
  assert.equal(platformKeyForAssetId("linux-arm64"), "linux");
  assert.equal(platformKeyForAssetId(null), null);
});

test("install commands lead with the visitor platform", async () => {
  const { orderInstallCommands } = await import(
    "../src/lib/platform-recommendation.ts"
  );
  const commands = [
    "# macOS Apple silicon\nnpx -y wenlan setup",
    "# Linux x64 or ARM64\ncurl -fsSL https://example.com/install.sh | bash",
    "# Windows x64\nwenlan setup --basic",
  ];
  assert.deepEqual(orderInstallCommands(commands, "windows"), [
    commands[2],
    commands[0],
    commands[1],
  ]);
  assert.deepEqual(orderInstallCommands(commands, "macos"), commands);
  assert.deepEqual(orderInstallCommands(commands, "linux"), [
    commands[1],
    commands[0],
    commands[2],
  ]);
  assert.deepEqual(orderInstallCommands(commands, null), commands);
  assert.deepEqual(
    orderInstallCommands(["echo a", "echo b"], "windows"),
    ["echo a", "echo b"],
  );
  assert.equal(commands.length, 3);
});
