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

const siteDescription =
  "Origin is local-first memory for AI work, carrying sessions, decisions, project context, and wiki pages across Claude Code, Cursor, Codex, and MCP tools.";

const siteTitle = "Origin | Local-First Memory for AI Work";

export const metadata: Metadata = {
  metadataBase: new URL("https://useorigin.app"),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    url: "https://useorigin.app",
    siteName: "Origin",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1280,
        height: 720,
        alt: "Origin. Where AI work compounds.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
              alternateName: [
                "Origin AI Work Memory",
                "Origin Local AI Work Memory",
                "Origin MCP",
              ],
              description: siteDescription,
              url: "https://useorigin.app",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "macOS",
              softwareVersion: "0.6.0",
              softwareRequirements: "macOS 14+ on Apple Silicon (M1 or later)",
              installUrl: "https://github.com/7xuanlu/origin#quickstart",
              downloadUrl: "https://github.com/7xuanlu/origin/releases",
              screenshot: "https://useorigin.app/og.png",
              featureList: [
                "Claude Code plugin: marketplace install with setup, MCP wiring, and first round-trip check",
                "Other MCP clients: npx -y @7xuanlu/origin setup installs the local runtime before origin-mcp connects",
                "Daemon memory chores: stores what matters, deduplicates repeat facts, links ideas, distills wiki pages, and preserves provenance",
                "Hybrid memory engine: vector search, full-text search, and knowledge graph signals",
                "Associative recall: related context beyond keyword matching",
                "No model required: storage, embeddings, hybrid search, and MCP recall work without an LLM or API key",
                "MCP-native: works with Claude Code, Cursor, Codex, Claude Desktop, Gemini CLI, and other MCP clients",
                "Memory lineage: every memory traces back to where it came from",
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
              alternateName: [
                "Origin AI",
                "Origin AI Work Memory",
                "Origin Local AI Work Memory",
              ],
              url: "https://useorigin.app",
              logo: "https://useorigin.app/logo.svg",
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
