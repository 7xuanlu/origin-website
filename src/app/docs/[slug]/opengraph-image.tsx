import { ImageResponse } from "next/og";
import { docPages, getDocPage } from "../docs";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const alt = "Origin docs page";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return docPages.map((page) => ({ slug: page.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Params) {
  const { slug } = await params;
  const page = getDocPage(slug);
  const title = page?.title ?? "Origin Docs";
  const description = page?.description ?? "Local-first memory for AI work.";
  const eyebrow = page?.eyebrow ?? "Docs";

  return new ImageResponse(
    (
      <OgTemplate
        eyebrow={eyebrow}
        title={title}
        description={description}
        footerLeft={[
          "useorigin.app/docs",
          "Local-first memory for AI work",
        ]}
        footerRight="Apache-2.0"
        titleSize={72}
      />
    ),
    size,
  );
}
