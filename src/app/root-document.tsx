import { SiteFooter } from "@/components/site-footer";
import { AcquisitionCapture } from "@/components/acquisition-capture";
import { getCoreContent } from "@/i18n/content";
import { LOCALE_CONFIG, type Locale } from "@/i18n/locales";
import { rootHomeSeo } from "@/i18n/metadata";
import { Analytics } from "@vercel/analytics/next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { softwareApplicationSchema } from "./structured-data";
import { getLatestRelease } from "@/lib/release-server";
import { ThemeProvider } from "./theme-provider";

const vercelAnalyticsEnabled = process.env.VERCEL === "1";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
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

export default async function RootDocument({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const release = await getLatestRelease();
  const siteDescription = rootHomeSeo(locale).description;
  const chrome = getCoreContent(locale).chrome.content;

  return (
    <html
      lang={LOCALE_CONFIG[locale].htmlLang}
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        <link rel="me" href="https://github.com/7xuanlu" />
        <link rel="author" href="https://github.com/7xuanlu" />
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://cloud.umami.is/script.js"}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            data-domains="wenlan.app"
            data-exclude-search="true"
            data-do-not-track="true"
          />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("wenlan-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);else if(window.matchMedia("(prefers-color-scheme:light)").matches)document.documentElement.setAttribute("data-theme","light")}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationSchema(locale, release)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://wenlan.app/#website",
              name: "Wenlan",
              alternateName: "wenlan.app",
              url: "https://wenlan.app",
              description: siteDescription,
              inLanguage: LOCALE_CONFIG[locale].hreflang,
              publisher: { "@id": "https://wenlan.app/#organization" },
              copyrightHolder: { "@id": "https://wenlan.app/#qixuan-lu" },
              copyrightYear: 2026,
              license: "https://github.com/7xuanlu/wenlan/blob/main/LICENSE",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://wenlan.app/#organization",
              name: "Wenlan",
              alternateName: [
                "Wenlan AI",
                "Wenlan AI Work Memory",
                "Wenlan Local AI Work Memory",
              ],
              url: "https://wenlan.app",
              logo: "https://wenlan.app/logo.svg",
              founder: {
                "@type": "Person",
                "@id": "https://wenlan.app/#qixuan-lu",
                name: "Qi-Xuan Lu",
                url: "https://github.com/7xuanlu",
                sameAs: ["https://github.com/7xuanlu"],
              },
              sameAs: [
                "https://github.com/7xuanlu/wenlan",
                "https://github.com/7xuanlu",
                "https://www.npmjs.com/package/wenlan",
                "https://www.npmjs.com/package/wenlan-mcp",
                "https://crates.io/crates/wenlan-mcp",
                "https://crates.io/crates/wenlan-types",
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <AcquisitionCapture />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-[var(--o-text)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-[var(--o-bg)] focus:outline focus:outline-2 focus:outline-[var(--o-warm)]"
        >
          {chrome.skipLinkLabel}
        </a>
        <ThemeProvider>
          <div id="main-content">{children}</div>
          <SiteFooter locale={locale} />
        </ThemeProvider>
        {vercelAnalyticsEnabled ? <Analytics /> : null}
      </body>
    </html>
  );
}
