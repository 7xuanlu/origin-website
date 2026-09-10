import { DownloadRecommendation } from "@/components/home/download-recommendation";
import { TrackedLocalizedLink } from "@/components/tracked-link";
import type { HomeContent } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { WENLAN_RELEASE } from "@/lib/releases";
import type { WenlanRelease } from "@/lib/release-manifest";

export function DownloadSection({
  copy,
  locale,
  release = WENLAN_RELEASE,
}: {
  copy: HomeContent["download"];
  locale: Locale;
  release?: WenlanRelease;
}) {
  const platforms = copy.platforms.map((platform) => {
    const asset = release.assets.find((item) => item.id === platform.id);
    if (!asset) {
      throw new Error(`Missing release asset for ${platform.id}`);
    }
    return { ...asset, ...platform };
  });

  return (
    <section
      id="download"
      className="scroll-mt-20 px-6 py-14 sm:py-16"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,1.18fr)] lg:items-center">
        <div>
          <h2 className="max-w-xl font-serif text-3xl font-medium tracking-tight text-balance sm:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-[var(--o-text-secondary)]">
            {copy.description.replace(/\bv\d+\.\d+\.\d+\b/g, release.tag)}
          </p>
          <div className="mt-5">
            <TrackedLocalizedLink
              href="/download"
              eventName="setup_path_click"
              placement="home-download"
              locale={locale}
              context="setup"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--o-text)] underline decoration-[var(--o-warm)]/60 underline-offset-4 transition-colors hover:text-[var(--o-warm)] focus-wenlan"
            >
              {copy.recommendation.allDownloadsLabel}
            </TrackedLocalizedLink>
          </div>
        </div>

        <DownloadRecommendation
          copy={copy.recommendation}
          locale={locale}
          platforms={platforms}
        />
      </div>
    </section>
  );
}
