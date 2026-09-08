import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const alt = "About Wenlan";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return new ImageResponse(
    (
      <OgTemplate
        eyebrow="About"
        title="LLM wiki for AI work."
        description="Open-source, local-first AI work memory built by agents and grounded in source-backed pages. Built by Qi-Xuan Lu."
        footerLeft={["wenlan.app/about", "v0.18.3 · Apache-2.0"]}
        footerRight="by Qi-Xuan Lu"
        titleSize={76}
      />
    ),
    size,
  );
}
