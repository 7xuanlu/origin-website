import { getCoreContent } from "@/i18n/content";
import { buildPageMetadata } from "@/i18n/metadata";
import { resolveLocalizedRouteLocale } from "@/i18n/resolve-locale";
import type { Metadata } from "next";
import { HomePage } from "../_pages/home";
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
    "/",
    getCoreContent(resolvedLocale).home.content.seo,
  );
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<LocalePageParams>;
}) {
  const { locale } = await params;
  return <HomePage locale={resolveLocalizedRouteLocale(locale)} release={await getLatestRelease()} />;
}
