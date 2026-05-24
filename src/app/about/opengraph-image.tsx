import { ImageResponse } from "next/og";

export const alt = "About Origin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #14141a 50%, #1a1a2e 100%)",
          color: "#fefcf9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#ff9b6a",
            }}
          >
            About
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#fefcf9",
              letterSpacing: "-0.01em",
            }}
          >
            Origin
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div
            style={{
              fontSize: "84px",
              lineHeight: 1.05,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "#fefcf9",
              maxWidth: "1040px",
            }}
          >
            Local-first memory for AI work.
          </div>
          <div
            style={{
              fontSize: "24px",
              lineHeight: 1.4,
              color: "#a8a8b3",
              maxWidth: "920px",
            }}
          >
            An open-source memory layer for AI work across Claude Code, Cursor, Codex, and MCP-compatible tools. Built by Qi-Xuan Lu.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: "18px",
            color: "#7a7a85",
          }}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            <span>useorigin.app/about</span>
            <span>·</span>
            <span>v0.6.1 · Apache-2.0</span>
          </div>
          <div>by Qi-Xuan Lu</div>
        </div>
      </div>
    ),
    size,
  );
}
