import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const alt = "Origin. Where AI work compounds.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return new ImageResponse(
    (
      <OgTemplate
        eyebrow="Origin"
        title="Where AI work compounds."
        description="Local-first memory for AI work. Hybrid retrieval, real git versioning of every memory write, mandatory provenance, one daemon across MCP-compatible AI tools."
        footerLeft={[
          "88% Recall@5 on LongMemEval",
          "macOS · Linux · Windows",
          "Apache-2.0",
        ]}
        footerRight="by Qi-Xuan Lu"
        titleSize={92}
      />
    ),
    size,
  );
}
