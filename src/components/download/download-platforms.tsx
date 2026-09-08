"use client";

import { useEffect, useState } from "react";
import { TrackedLink } from "@/components/tracked-link";
import type { HomeContent } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import {
  detectReleaseAssetId,
  isDesktopApp,
  recommendedReleaseAssetId,
  type NavigatorLike,
} from "@/lib/platform-recommendation";
import type { WenlanReleaseAssetId } from "@/lib/releases";

type DownloadCopy = HomeContent["download"];
type PlatformCopy = DownloadCopy["platforms"][number];

export type DownloadPlatform = PlatformCopy & {
  href: string;
  format: string;
  size: string;
  guideHref?: string;
};

function GuideLink({
  href,
  label,
  locale,
}: {
  href: string;
  label: string;
  locale: Locale;
}) {
  return (
    <TrackedLink
      href={href}
      eventName="get_started_click"
      placement="download-page"
      locale={locale}
      context="setup"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--o-text-secondary)] underline decoration-[var(--o-border)] underline-offset-4 transition-colors hover:text-[var(--o-warm)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--o-warm)]"
    >
      {label}
    </TrackedLink>
  );
}

export function DownloadPlatforms({
  copy,
  locale,
  platforms,
  releaseTag,
  releaseUrl,
}: {
  copy: DownloadCopy;
  locale: Locale;
  platforms: readonly DownloadPlatform[];
  releaseTag: string;
  releaseUrl: string;
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

  const recommendedPlatform =
    platforms.find((platform) => platform.id === recommendedId) ?? null;
  const otherPlatforms = recommendedPlatform
    ? platforms.filter((platform) => platform.id !== recommendedId)
    : [...platforms];

  return (
    <>
      <section className="px-5 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
              {copy.page.buildsTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--o-text-secondary)]">
              {copy.page.buildsDescription}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="font-mono text-xs text-[var(--o-text-secondary)]">
                {copy.stableLabel} {releaseTag}
              </span>
              <TrackedLink
                href={releaseUrl}
                eventName="github_outbound"
                placement="download-page"
                locale={locale}
                context="setup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--o-text-secondary)] underline decoration-[var(--o-border)] underline-offset-4 transition-colors hover:text-[var(--o-warm)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--o-warm)]"
              >
                {copy.page.releaseSourceLabel}
              </TrackedLink>
            </div>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-[var(--o-text-muted)]">
              {copy.recommendation.architectureNote}
            </p>
          </div>

          <div
            className="flex min-h-[280px] flex-col rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-6 sm:min-h-[300px] sm:p-8"
            aria-live="polite"
          >
            {recommendedPlatform ? (
              <>
                <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--o-warm)] uppercase">
                  {copy.recommendation.label}
                </p>
                <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-serif text-3xl font-medium">
                    {recommendedPlatform.name}
                  </h3>
                  <span className="font-mono text-xs text-[var(--o-text-muted)]">
                    {recommendedPlatform.architecture}
                  </span>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--o-text-secondary)]">
                  {recommendedPlatform.description}
                </p>
                <p className="mt-3 font-mono text-xs text-[var(--o-text-secondary)]">
                  {recommendedPlatform.format} · {recommendedPlatform.size}
                </p>
                <TrackedLink
                  href={recommendedPlatform.href}
                  eventName="github_outbound"
                  placement="download-page"
                  locale={locale}
                  context="setup"
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-lg bg-[var(--o-text)] px-5 py-3 text-center text-sm font-semibold text-[var(--o-bg)] transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--o-warm)] sm:w-fit"
                >
                  {recommendedPlatform.actionLabel}
                </TrackedLink>
                {isDesktopApp(recommendedPlatform.id) ? null : (
                  <p className="mt-3 text-xs leading-relaxed text-[var(--o-text-secondary)]">
                    {recommendedPlatform.packageIncludesLabel ??
                      copy.packageIncludesLabel}
                  </p>
                )}
                {recommendedPlatform.guideHref &&
                recommendedPlatform.guideLabel ? (
                  <div className="mt-2">
                    <GuideLink
                      href={recommendedPlatform.guideHref}
                      label={recommendedPlatform.guideLabel}
                      locale={locale}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <h3 className="mt-1 font-serif text-3xl font-medium">
                  {copy.recommendation.fallbackTitle}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--o-text-secondary)]">
                  {copy.recommendation.fallbackDescription}
                </p>
                <a
                  href="#all-builds"
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-lg bg-[var(--o-text)] px-5 py-3 text-center text-sm font-semibold text-[var(--o-bg)] transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--o-warm)] sm:w-fit"
                >
                  {copy.recommendation.fallbackActionLabel}
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      <section
        id="all-builds"
        className="scroll-mt-24 border-y border-[var(--o-border-subtle)] bg-[var(--o-bg-alt)] px-5 py-12 sm:px-6 sm:py-16"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
            {copy.recommendation.allDownloadsLabel}
          </h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--o-border)] bg-[var(--o-bg)]">
            {otherPlatforms.map((platform, index) => (
              <details
                key={platform.id}
                id={platform.id}
                open={index === 0 || undefined}
                className="group scroll-mt-24 border-b border-[var(--o-border-subtle)] last:border-b-0"
              >
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--o-warm)] sm:px-6 [&::-webkit-details-marker]:hidden">
                  <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-serif text-xl font-medium">
                      {platform.name}
                    </span>
                    <span className="inline-block whitespace-nowrap font-mono text-xs text-[var(--o-text-secondary)]">
                      {platform.architecture}
                    </span>
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="hidden font-mono text-xs text-[var(--o-text-muted)] sm:inline">
                      {platform.format} · {platform.size}
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-xl text-[var(--o-warm)]"
                    >
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">-</span>
                    </span>
                  </span>
                </summary>
                <div className="space-y-4 px-5 pb-6 sm:px-6">
                  <p className="max-w-xl text-sm leading-relaxed text-[var(--o-text-secondary)]">
                    {platform.description}
                  </p>
                  {isDesktopApp(platform.id) ? null : (
                    <p className="font-mono text-xs text-[var(--o-text-secondary)]">
                      {platform.packageIncludesLabel ??
                        copy.packageIncludesLabel}
                    </p>
                  )}
                  <TrackedLink
                    href={platform.href}
                    eventName="github_outbound"
                    placement="download-page"
                    locale={locale}
                    context="setup"
                    className="inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-lg border border-[var(--o-border)] px-5 py-3 text-center text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:border-[var(--o-text-dim)] hover:text-[var(--o-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--o-warm)] sm:w-fit"
                  >
                    {platform.actionLabel}
                  </TrackedLink>
                  {platform.guideHref && platform.guideLabel ? (
                    <div>
                      <GuideLink
                        href={platform.guideHref}
                        label={platform.guideLabel}
                        locale={locale}
                      />
                    </div>
                  ) : null}
                  <ol className="space-y-4">
                    {platform.setupSteps.map((step, stepIndex) => (
                      <li
                        key={step}
                        className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 text-sm leading-relaxed text-[var(--o-text-secondary)]"
                      >
                        <span className="font-mono text-xs text-[var(--o-warm)]">
                          {String(stepIndex + 1).padStart(2, "0")}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
