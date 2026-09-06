import type { WenlanReleaseAssetId } from "./releases";

export type ClientHintData = {
  readonly platform?: string;
  readonly architecture?: string;
  readonly bitness?: string;
  readonly mobile?: boolean;
};

export type NavigatorLike = {
  readonly userAgent?: string;
  readonly userAgentData?: {
    readonly platform?: string;
    getHighEntropyValues?: (
      hints: readonly string[],
    ) => Promise<ClientHintData>;
  };
};

/**
 * Maps Client Hints (`navigator.userAgentData`) to a published release asset.
 * This resolves cases the UA string cannot, notably Apple Silicon Macs, which
 * report `Intel Mac OS X` in the user agent for compatibility.
 */
export function recommendedReleaseAssetIdFromClientHints(
  hints: ClientHintData,
): WenlanReleaseAssetId | null {
  if (!hints || hints.mobile) {
    return null;
  }

  const platform = (hints.platform ?? "").toLowerCase();
  const architecture = (hints.architecture ?? "").toLowerCase();

  if (platform === "windows") {
    return hints.bitness === "32" ? null : "windows-x64";
  }

  if (platform === "macos") {
    // Only Apple Silicon has a published macOS build; Intel Macs report
    // architecture "x86" and must fall through to the full download list.
    return architecture === "arm" ? "macos-arm64" : null;
  }

  if (platform === "linux") {
    if (architecture === "arm") {
      return "linux-arm64";
    }
    return architecture === "x86" && hints.bitness !== "32"
      ? "linux-x64"
      : null;
  }

  return null;
}

export type InstallPlatformKey = "macos" | "windows" | "linux";

/**
 * Reduces a release asset id to its OS family for install-step ordering.
 * Unknown or null ids stay null so callers keep copy order.
 */
export function platformKeyForAssetId(
  id: WenlanReleaseAssetId | null,
): InstallPlatformKey | null {
  if (!id) {
    return null;
  }
  if (id.startsWith("windows")) {
    return "windows";
  }
  if (id.startsWith("macos")) {
    return "macos";
  }
  if (id.startsWith("linux")) {
    return "linux";
  }
  return null;
}

const INSTALL_COMMAND_MARKERS: Record<InstallPlatformKey, RegExp> = {
  macos: /macos|mac os|darwin/i,
  windows: /windows|win64/i,
  linux: /linux/i,
};

function installCommandHead(command: string): string {
  return command.split("\n")[0] ?? command;
}

/**
 * Orders runtime install command blocks so the visitor's platform comes
 * first and the rest keep copy order. Matching reads each block's own
 * header line (e.g. "# macOS Apple silicon"), so a copy reorder cannot
 * silently misassign a block; unrecognized input keeps copy order.
 */
export function orderInstallCommands(
  commands: readonly string[],
  platform: InstallPlatformKey | null,
): readonly string[] {
  if (!platform) {
    return commands;
  }
  const marker = INSTALL_COMMAND_MARKERS[platform];
  const matched = commands.filter((command) =>
    marker.test(installCommandHead(command)),
  );
  if (matched.length === 0) {
    return commands;
  }
  const rest = commands.filter(
    (command) => !marker.test(installCommandHead(command)),
  );
  return [...matched, ...rest];
}

/**
 * Upgrades a headless runtime build to the desktop installer for the same
 * OS when the release publishes one. Unknown ids pass through unchanged.
 * (macOS Apple silicon resolves straight to the DMG build, so only
 * Windows needs the upgrade.)
 */
export function preferDesktopBuild(
  id: WenlanReleaseAssetId | null,
): WenlanReleaseAssetId | null {
  if (id === "windows-x64") return "windows-desktop-x64";
  return id;
}

/**
 * Whether the id is a desktop installer. The hero card skips the generic
 * package-contents line for these because their description already
 * covers what is inside.
 */
export function isDesktopApp(id: WenlanReleaseAssetId | null): boolean {
  return id === "windows-desktop-x64" || id === "macos-arm64";
}

/**
 * Detects the visitor's download, preferring the desktop installer where
 * the release publishes one. Client Hints win when the browser exposes
 * them; UA-string parsing is the fallback (Safari and Firefox without
 * Client Hints, bots, curl).
 */
export async function detectReleaseAssetId(
  navigatorLike: NavigatorLike,
): Promise<WenlanReleaseAssetId | null> {
  const userAgentData = navigatorLike.userAgentData;
  if (typeof userAgentData?.getHighEntropyValues === "function") {
    try {
      const hints =
        await userAgentData.getHighEntropyValues([
          "platform",
          "architecture",
          "bitness",
          "mobile",
        ]);
      const mapped = recommendedReleaseAssetIdFromClientHints(hints ?? {});
      if (mapped) {
        return preferDesktopBuild(mapped);
      }
      if (
        typeof hints?.platform === "string" &&
        hints.platform.length > 0
      ) {
        // Hints identified the platform and it has no published build.
        return null;
      }
    } catch {
      // Client Hints unavailable or denied; fall through to UA parsing.
    }
  }
  return preferDesktopBuild(
    recommendedReleaseAssetId(navigatorLike.userAgent ?? ""),
  );
}

export function recommendedReleaseAssetId(
  userAgent: string,
): WenlanReleaseAssetId | null {
  if (!userAgent || /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)) {
    return null;
  }

  if (/Windows NT/i.test(userAgent)) {
    return /Win64|x64|WOW64|amd64/i.test(userAgent)
      ? "windows-desktop-x64"
      : null;
  }

  if (/Macintosh|Mac OS X/i.test(userAgent)) {
    return /arm64|aarch64/i.test(userAgent) ? "macos-arm64" : null;
  }

  if (/Linux/i.test(userAgent)) {
    if (/aarch64|arm64/i.test(userAgent)) {
      return "linux-arm64";
    }
    if (/x86_64|x64|amd64/i.test(userAgent)) {
      return "linux-x64";
    }
  }

  return null;
}
