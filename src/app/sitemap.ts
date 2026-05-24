import type { MetadataRoute } from "next";
import { docPages, docUrl } from "./docs/docs";
import { articles, articleUrl, SITE_URL } from "./learn/articles";

const ABOUT_UPDATED_AT = "2026-05-24";
const GET_STARTED_UPDATED_AT = "2026-05-15";

function maxDate(values: Array<string | Date>): Date {
  return new Date(
    Math.max(...values.map((value) => new Date(value).getTime())),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const latestArticle = maxDate(articles.map((article) => article.updatedAt));
  const latestDoc = maxDate(docPages.map((page) => page.updatedAt));
  const latestSiteUpdate = maxDate([
    latestArticle,
    latestDoc,
    ABOUT_UPDATED_AT,
    GET_STARTED_UPDATED_AT,
  ]);

  const sharedImages = [`${SITE_URL}/og.png`, `${SITE_URL}/logo.svg`];

  return [
    {
      url: SITE_URL,
      lastModified: latestSiteUpdate,
      changeFrequency: "weekly",
      priority: 1,
      images: sharedImages,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: latestDoc,
      changeFrequency: "weekly",
      priority: 0.9,
      images: sharedImages,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(ABOUT_UPDATED_AT),
      changeFrequency: "monthly",
      priority: 0.85,
      images: sharedImages,
    },
    {
      url: `${SITE_URL}/docs/get-started`,
      lastModified: new Date(GET_STARTED_UPDATED_AT),
      changeFrequency: "weekly",
      priority: 0.8,
      images: sharedImages,
    },
    ...docPages.map((page) => ({
      url: docUrl(page.slug),
      lastModified: new Date(page.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.78,
      images: sharedImages,
    })),
    {
      url: `${SITE_URL}/learn`,
      lastModified: latestArticle,
      changeFrequency: "weekly",
      priority: 0.75,
      images: sharedImages,
    },
    ...articles.map((article) => ({
      url: articleUrl(article.slug),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: sharedImages,
    })),
  ];
}
