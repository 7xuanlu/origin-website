import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "./theme-provider";
import { SiteFooter } from "@/components/site-footer";
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
  "Origin is local-first memory for AI work. Hybrid retrieval (88% Recall@5 on LongMemEval), real git versioning of every memory write, mandatory provenance on distilled pages, and one daemon across Claude Code, Cursor, Codex, Claude Desktop, and other MCP clients.";

const siteTitle = "Origin | Local-First Memory for AI Work";

export const metadata: Metadata = {
  metadataBase: new URL("https://useorigin.app"),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Origin Learn RSS feed" },
      ],
    },
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
    images: [
      {
        url: "/og.png",
        alt: "Origin. Where AI work compounds.",
      },
    ],
  },
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  authors: [
    {
      name: "Qi-Xuan Lu",
      url: "https://github.com/7xuanlu",
    },
  ],
  creator: "Qi-Xuan Lu",
  publisher: "Qi-Xuan Lu",
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
              applicationCategory: "DeveloperApplication",
              operatingSystem: ["macOS", "Linux", "Windows"],
              softwareVersion: "0.6.1",
              softwareRequirements:
                "macOS arm64 or x64, Linux x86_64 or aarch64 (glibc), Windows x86_64",
              installUrl: "https://github.com/7xuanlu/origin#quickstart",
              downloadUrl: "https://github.com/7xuanlu/origin/releases",
              screenshot: "https://useorigin.app/og.png",
              featureList: [
                "Hybrid retrieval on libSQL: vector + FTS5 + reciprocal-rank fusion + knowledge-graph context. 88% Recall@5 on LongMemEval (oracle, 500 Q), 67% on LoCoMo.",
                "Real git versioning: every memory write is a git commit in ~/.origin/.git/. Inspect with git log, revert with git checkout, branch and blame as needed.",
                "Mandatory refreshable provenance: distilled wiki pages cite source memory IDs. The daemon rejects pages with empty source_memory_ids (HTTP 422). Pages refresh as new memories arrive without losing the citation chain.",
                "Auditable memory: low-confidence captures, contradictions, supersession chains, and protected-memory conflicts surface for review instead of silently entering context.",
                "Composition over storage: memories distill into pages. Sessions track workflow. An entity graph links people, projects, tools, and relations. ~30 MCP tools across one daemon, not 100+ skills bolted on.",
                "Explicit spaces: tag memories, pages, and recalls with space=work | personal | client-X. Auto-detected from current repo or workspace.",
                "Cross-platform daemon: macOS arm64/x64, Linux x86_64/aarch64, Windows x86_64. Native installer per OS.",
                "MCP-native: works with Claude Code, Cursor, Codex, Claude Desktop, VS Code, Gemini CLI, and other MCP clients.",
                "No cloud sync or telemetry by default. Local models and Anthropic keys are opt-in for automatic distill cycles.",
                "Markdown artifacts you can read: pages in ~/.origin/pages/, session logs and project status under ~/.origin/sessions/. Symlink into Obsidian.",
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
              "@type": "WebSite",
              "@id": "https://useorigin.app/#website",
              name: "Origin",
              alternateName: "useorigin.app",
              url: "https://useorigin.app",
              description: siteDescription,
              inLanguage: "en-US",
              publisher: { "@id": "https://useorigin.app/#organization" },
              copyrightHolder: { "@id": "https://useorigin.app/#qixuan-lu" },
              copyrightYear: 2026,
              license: "https://github.com/7xuanlu/origin/blob/main/LICENSE",
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
              founder: {
                "@type": "Person",
                "@id": "https://useorigin.app/#qixuan-lu",
                name: "Qi-Xuan Lu",
                url: "https://github.com/7xuanlu",
                sameAs: ["https://github.com/7xuanlu"],
              },
              sameAs: [
                "https://github.com/7xuanlu/origin",
                "https://github.com/7xuanlu",
                "https://www.npmjs.com/package/@7xuanlu/origin",
                "https://www.npmjs.com/package/origin-mcp",
                "https://crates.io/crates/origin-mcp",
                "https://crates.io/crates/origin-types",
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-[var(--o-text)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-[var(--o-bg)] focus:outline focus:outline-2 focus:outline-[var(--o-warm)]"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <div id="main-content">{children}</div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
