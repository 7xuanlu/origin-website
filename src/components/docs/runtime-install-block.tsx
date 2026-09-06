"use client";

import { useEffect, useState } from "react";
import { TrackedLocalizedLink } from "@/components/tracked-link";
import type { Locale } from "@/i18n/locales";
import {
  detectReleaseAssetId,
  orderInstallCommands,
  platformKeyForAssetId,
  recommendedReleaseAssetId,
  type InstallPlatformKey,
  type NavigatorLike,
} from "@/lib/platform-recommendation";

type RuntimeCta = {
  id: string;
  href: string;
  label: string;
};

/**
 * Step 01 of get-started: the runtime install. Leads with the visitor's
 * own platform instead of showing every platform to everyone, and only
 * offers the Windows-only download to Windows visitors. Server render
 * keeps copy order, so no-JS visitors lose nothing.
 */
export function RuntimeInstallBlock({
  commands,
  ctas,
  locale,
}: {
  commands: readonly string[];
  ctas: readonly RuntimeCta[];
  locale: Locale;
}) {
  const [platform, setPlatform] = useState<InstallPlatformKey | null>(null);

  useEffect(() => {
    let cancelled = false;
    const nav = navigator as unknown as NavigatorLike;
    // Synchronous UA baseline keeps first paint consistent; Client Hints
    // then refine it (notably Apple Silicon Macs, which report Intel UA).
    setPlatform(
      platformKeyForAssetId(recommendedReleaseAssetId(nav.userAgent ?? "")),
    );
    detectReleaseAssetId(nav).then((id) => {
      if (!cancelled) {
        setPlatform(platformKeyForAssetId(id));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const orderedCommands = orderInstallCommands(commands, platform);
  const visibleCtas = ctas.filter(
    (cta) => cta.id !== "windows-download" || platform === "windows",
  );

  return (
    <>
      {orderedCommands.map((command) => (
        <pre
          key={command}
          className="mt-6 overflow-x-auto rounded-xl border border-[var(--o-border)] bg-[var(--o-bg-deep)] p-5 font-mono text-sm leading-relaxed text-[var(--o-text-secondary)]"
        >
          <code>{command}</code>
        </pre>
      ))}
      {visibleCtas.length > 0 && (
        <div className="mt-7 flex min-w-0 flex-col gap-3 sm:flex-row">
          {visibleCtas.map((cta, index) => (
            <TrackedLocalizedLink
              key={cta.id}
              href={cta.href}
              locale={locale}
              eventName="setup_path_click"
              placement="docs-get-started"
              context="setup"
              className={
                index === 0
                  ? "min-w-0 break-words rounded-xl bg-[var(--o-text)] px-5 py-3 text-center text-sm font-semibold text-[var(--o-bg)] transition-all hover:shadow-[0_0_28px_var(--o-glow-warm)]"
                  : "min-w-0 break-words rounded-xl border border-[var(--o-border)] px-5 py-3 text-center text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
              }
            >
              {cta.label}
            </TrackedLocalizedLink>
          ))}
        </div>
      )}
    </>
  );
}
