"use client";

import { useEffect, useState } from "react";
import { TrackedLink, TrackedLocalizedLink } from "@/components/tracked-link";
import type { HomeContent } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import {
  detectReleaseAssetId,
  recommendedReleaseAssetId,
  type NavigatorLike,
} from "@/lib/platform-recommendation";
import type { WenlanReleaseAssetId } from "@/lib/releases";

type PlatformCopy = HomeContent["download"]["platforms"][number];

export type DownloadRecommendationPlatform = PlatformCopy & {
  href: string;
  format: string;
  size: string;
};

export function DownloadRecommendation({
  copy,
  locale,
  platforms,
}: {
  copy: HomeContent["download"]["recommendation"];
  locale: Locale;
  platforms: readonly DownloadRecommendationPlatform[];
}) {
  const [recommendedId, setRecommendedId] =
    useState<WenlanReleaseAssetId | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Synchronous UA baseline keeps first paint consistent; Client Hints
    // then refine it (notably Apple Silicon Macs, which report Intel UA).
    setRecommendedId(recommendedReleaseAssetId(navigator.userAgent));
    detectReleaseAssetId(navigator as unknown as NavigatorLike).then((id) => {
      if (!cancelled) {
        setRecommendedId(id);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const platform = platforms.find((item) => item.id === recommendedId);

  return (
    <div
      className="relative min-h-[250px] overflow-hidden rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-6 sm:p-8"
      aria-live="polite"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-2/5 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--o-warm) 1px, transparent 1px), linear-gradient(90deg, var(--o-warm) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to left, black, transparent)",
        }}
      />
      <div className="relative flex min-h-[200px] flex-col">
        <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)] uppercase">
          {copy.label}
        </p>

        {platform ? (
          <>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-serif text-3xl font-medium">{platform.name}</h3>
              <span className="font-mono text-xs text-[var(--o-text-muted)]">
                {platform.architecture}
              </span>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--o-text-secondary)]">
              {platform.description}
            </p>
            <p className="mt-3 font-mono text-xs text-[var(--o-text-secondary)]">
              {platform.format} · {platform.size}
            </p>
            <TrackedLink
              href={platform.href}
              eventName="github_outbound"
              placement="home-download"
              locale={locale}
              context="home"
              className="mt-auto inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-lg bg-[var(--o-text)] px-5 py-3 text-sm font-semibold text-[var(--o-bg)] press-wenlan focus-wenlan sm:w-fit"
            >
              {platform.actionLabel}
            </TrackedLink>
          </>
        ) : (
          <>
            <h3 className="mt-4 font-serif text-3xl font-medium">
              {copy.fallbackTitle}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--o-text-secondary)]">
              {copy.fallbackDescription}
            </p>
            <TrackedLocalizedLink
              href="/download"
              eventName="setup_path_click"
              placement="home-download"
              locale={locale}
              context="setup"
              className="mt-auto inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-lg bg-[var(--o-text)] px-5 py-3 text-sm font-semibold text-[var(--o-bg)] press-wenlan focus-wenlan sm:w-fit"
            >
              {copy.fallbackActionLabel}
            </TrackedLocalizedLink>
          </>
        )}
      </div>
    </div>
  );
}
