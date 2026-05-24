import type { ReactElement } from "react";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

export type OgTemplateProps = {
  eyebrow: string;
  title: string;
  description: string;
  footerLeft: string[];
  footerRight: string;
  titleSize?: number;
};

export function OgTemplate({
  eyebrow,
  title,
  description,
  footerLeft,
  footerRight,
  titleSize = 64,
}: OgTemplateProps): ReactElement {
  return (
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
          {eyebrow}
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
            fontSize: `${titleSize}px`,
            lineHeight: 1.05,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "#fefcf9",
            maxWidth: "1040px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "24px",
            lineHeight: 1.4,
            color: "#a8a8b3",
            maxWidth: "920px",
          }}
        >
          {description}
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
          {footerLeft.map((item, i) => (
            <div key={`${i}-${item}`} style={{ display: "flex", gap: "24px" }}>
              <span>{item}</span>
              {i < footerLeft.length - 1 && <span>·</span>}
            </div>
          ))}
        </div>
        <div>{footerRight}</div>
      </div>
    </div>
  );
}
