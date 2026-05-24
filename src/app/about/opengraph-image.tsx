import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const alt = "About Origin";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return new ImageResponse(
    (
      <OgTemplate
        eyebrow="About"
        title="Local-first memory for AI work."
        description="An open-source memory layer for AI work across Claude Code, Cursor, Codex, and MCP-compatible tools. Built by Qi-Xuan Lu."
        footerLeft={["useorigin.app/about", "v0.6.1 · Apache-2.0"]}
        footerRight="by Qi-Xuan Lu"
        titleSize={76}
      />
    ),
    size,
  );
}
