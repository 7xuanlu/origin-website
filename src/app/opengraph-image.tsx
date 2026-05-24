import { ImageResponse } from "next/og";

export const alt = "Origin. Where AI work compounds.";
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
            Origin
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#a8a8b3",
              letterSpacing: "0.05em",
            }}
          >
            useorigin.app
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div
            style={{
              fontSize: "104px",
              lineHeight: 0.98,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              color: "#fefcf9",
              maxWidth: "1040px",
            }}
          >
            Where AI work compounds.
          </div>
          <div
            style={{
              fontSize: "28px",
              lineHeight: 1.35,
              color: "#a8a8b3",
              maxWidth: "960px",
            }}
          >
            Local-first memory for AI work. Hybrid retrieval, real git versioning of every memory write, mandatory provenance, one daemon across MCP-compatible AI tools.
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
            <span>88% Recall@5 on LongMemEval</span>
            <span>·</span>
            <span>macOS · Linux · Windows</span>
            <span>·</span>
            <span>Apache-2.0</span>
          </div>
          <div>by Qi-Xuan Lu</div>
        </div>
      </div>
    ),
    size,
  );
}
