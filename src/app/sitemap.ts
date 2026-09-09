import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/i18n/locales";
import { getLocalizedLearnArticle } from "@/i18n/learn-articles";
import {
  alternateUrls,
  canonicalUrl,
  type CORE_TRANSLATED_PATHS,
  isTranslatedLearnPath,
  SITE_URL,
  translatedLocalesForLearnPath,
} from "@/i18n/routing";
import { docPages, docUrl } from "./(en)/docs/docs";
import { articles, articleUrl } from "./(en)/learn/articles";

const ABOUT_UPDATED_AT = "2026-09-09";
const DOWNLOAD_UPDATED_AT = "2026-09-09";
const GET_STARTED_UPDATED_AT = "2026-09-09";

type CoreTranslatedPath = (typeof CORE_TRANSLATED_PATHS)[number];
type SitemapEntry = MetadataRoute.Sitemap[number];

type CoreSitemapEntryConfig = Pick<
  SitemapEntry,
  "changeFrequency" | "lastModified" | "priority"
> & {
  pathname: CoreTranslatedPath;
};

function maxDate(values: Array<string | Date>): Date {
  return new Date(
    Math.max(...values.map((value) => new Date(value).getTime())),
  );
}

function localizedCoreEntries(
  config: CoreSitemapEntryConfig,
  images: string[],
): SitemapEntry[] {
  return SUPPORTED_LOCALES.map((locale) => ({
    url: canonicalUrl(locale, config.pathname),
    lastModified: config.lastModified,
    changeFrequency: config.changeFrequency,
    priority: config.priority,
    images,
    alternates: {
      languages: alternateUrls(config.pathname),
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const latestArticle = maxDate(articles.map((article) => article.updatedAt));
  const latestDoc = maxDate(docPages.map((page) => page.updatedAt));
  const latestSiteUpdate = maxDate([
    latestArticle,
    latestDoc,
    ABOUT_UPDATED_AT,
    DOWNLOAD_UPDATED_AT,
    GET_STARTED_UPDATED_AT,
  ]);

  const sharedImages = [`${SITE_URL}/og.png`, `${SITE_URL}/logo.svg`];
  const translatedLearnArticles = articles.filter((article) =>
    isTranslatedLearnPath(`/learn/${article.slug}`),
  );
  const coreEntries: CoreSitemapEntryConfig[] = [
    {
      pathname: "/",
      lastModified: latestSiteUpdate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      pathname: "/download",
      lastModified: new Date(DOWNLOAD_UPDATED_AT),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      pathname: "/docs",
      lastModified: latestDoc,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      pathname: "/about",
      lastModified: new Date(ABOUT_UPDATED_AT),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      pathname: "/docs/get-started",
      lastModified: new Date(GET_STARTED_UPDATED_AT),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      pathname: "/learn",
      lastModified: latestArticle,
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ];

  return [
    ...coreEntries.flatMap((entry) => localizedCoreEntries(entry, sharedImages)),
    ...docPages.map((page) => ({
      url: docUrl(page.slug),
      lastModified: new Date(page.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.78,
      images: sharedImages,
    })),
    ...articles.map((article) => {
      const pathname = `/learn/${article.slug}`;

      return {
        url: articleUrl(article.slug),
        lastModified: new Date(article.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        images: sharedImages,
        ...(isTranslatedLearnPath(pathname)
          ? {
              alternates: {
                languages: alternateUrls(pathname),
              },
            }
          : {}),
      };
    }),
    ...translatedLearnArticles.flatMap((article) => {
      const pathname = `/learn/${article.slug}`;

      return translatedLocalesForLearnPath(pathname).map((locale) => ({
        url: canonicalUrl(locale, pathname),
        lastModified: new Date(
          getLocalizedLearnArticle(locale, article.slug)?.updatedAt ??
            article.updatedAt,
        ),
        changeFrequency: "monthly" as const,
        priority: 0.68,
        images: sharedImages,
        alternates: {
          languages: alternateUrls(pathname),
        },
      }));
    }),
  ];
}
