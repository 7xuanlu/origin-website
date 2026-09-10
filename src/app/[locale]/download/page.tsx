import { getCoreContent } from "@/i18n/content";
import { buildPageMetadata } from "@/i18n/metadata";
import { resolveLocalizedRouteLocale } from "@/i18n/resolve-locale";
import type { Metadata } from "next";
import { DownloadPage } from "../../_pages/download";
import { getLatestRelease } from "@/lib/release-server";

type LocalePageParams = {
  locale: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<LocalePageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolveLocalizedRouteLocale(locale);

  return buildPageMetadata(
    resolvedLocale,
    "/download",
    getCoreContent(resolvedLocale).home.content.download.page.seo,
  );
}

export default async function LocalizedDownloadPage({
  params,
}: {
  params: Promise<LocalePageParams>;
}) {
  const { locale } = await params;
  return <DownloadPage locale={resolveLocalizedRouteLocale(locale)} release={await getLatestRelease()} />;
}
