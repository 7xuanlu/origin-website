import { ImageResponse } from "next/og";
import { articles, getArticle } from "../articles";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const alt = "Origin Learn article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Params) {
  const { slug } = await params;
  const article = getArticle(slug);
  const title = article?.title ?? "Origin Learn";
  const description = article?.description ?? "Local-first memory for AI work.";
  const eyebrow = article?.eyebrow ?? "Learn";

  return new ImageResponse(
    (
      <OgTemplate
        eyebrow={eyebrow}
        title={title}
        description={description}
        footerLeft={[
          "useorigin.app",
          "Local-first memory for AI work",
        ]}
        footerRight="by Qi-Xuan Lu"
      />
    ),
    size,
  );
}
