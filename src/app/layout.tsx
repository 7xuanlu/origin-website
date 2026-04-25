import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "./theme-provider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://useorigin.app"),
  title: "Origin — The AI Memory App Where Understanding Compounds",
  description:
    "Local-first AI memory app. Captures knowledge, decisions, and insights from every AI conversation. Open-source, on-device, MCP-native.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Origin — The AI Memory App Where Understanding Compounds",
    description:
      "Local-first AI memory app. Captures knowledge, decisions, and insights from every AI conversation. Open-source, on-device, MCP-native.",
    type: "website",
    url: "https://useorigin.app",
    siteName: "Origin",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1280,
        height: 720,
        alt: "Origin — The AI Memory App Where Understanding Compounds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Origin — The AI Memory App Where Understanding Compounds",
    description:
      "Local-first AI memory app. Captures knowledge, decisions, and insights from every AI conversation. Open-source, on-device, MCP-native.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
    { media: "(prefers-color-scheme: light)", color: "#fefcf9" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://cloud.umami.is/script.js"}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("origin-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);else if(window.matchMedia("(prefers-color-scheme:light)").matches)document.documentElement.setAttribute("data-theme","light")}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Origin",
              description:
                "A local-first memory app that captures knowledge, decisions, and insights from every AI conversation. Everything you've figured out, compounding instead of disappearing.",
              url: "https://useorigin.app",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "macOS",
              softwareVersion: "0.2.0",
              softwareRequirements: "macOS 14+ on Apple Silicon (M1 or later)",
              downloadUrl: "https://github.com/7xuanlu/origin/releases",
              screenshot: "https://useorigin.app/og.png",
              featureList: [
                "Self-Evolving — deduplicates, links related memories, detects contradictions",
                "Hybrid Memory Engine — vector search, full-text search, and knowledge graph unified via Reciprocal Rank Fusion",
                "Associative Recall — entity and relation links surface related context beyond keyword matching",
                "On-Device Intelligence — Qwen3-4B and Qwen3.5-9B run on Apple Silicon Metal GPU",
                "MCP-Native — works with Claude Code, Claude Desktop, Cursor, ChatGPT, Gemini CLI",
                "Memory Lineage — every memory traces back to the conversation it came from",
              ],
              license:
                "https://github.com/7xuanlu/origin/blob/main/LICENSE",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: { "@id": "https://useorigin.app/#organization" },
              codeRepository: "https://github.com/7xuanlu/origin",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://useorigin.app/#organization",
              name: "Origin",
              url: "https://useorigin.app",
              logo: "https://useorigin.app/og.png",
              sameAs: ["https://github.com/7xuanlu/origin"],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
