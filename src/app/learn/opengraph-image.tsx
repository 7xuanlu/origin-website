import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const alt = "Origin Learn";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return new ImageResponse(
    (
      <OgTemplate
        eyebrow="Learn"
        title="Before you add AI memory."
        description="Articles on AI work memory, MCP memory servers, local-first control, distilled wiki pages, Claude Code workflows, and Origin comparisons."
        footerLeft={[
          "useorigin.app/learn",
          "Local-first memory for AI work",
        ]}
        footerRight="by Qi-Xuan Lu"
        titleSize={80}
      />
    ),
    size,
  );
}
