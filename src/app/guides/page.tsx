import type { Metadata } from "next";
import Link from "next/link";
import { guideUrl, guides, SITE_URL } from "./guides";
import { GuideHalo, MemoryIndex } from "./guide-visuals";

export const metadata: Metadata = {
  title: "AI Memory Guides | Origin",
  description:
    "Evergreen guides to AI memory apps, MCP memory servers, local-first AI memory, and Claude Code persistent memory.",
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    title: "AI Memory Guides | Origin",
    description:
      "Learn how AI memory apps, MCP memory servers, and local-first memory help AI tools carry context across sessions.",
    type: "website",
    url: `${SITE_URL}/guides`,
    siteName: "Origin",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Memory Guides | Origin",
    description:
      "Learn how AI memory apps, MCP memory servers, and local-first memory help AI tools carry context across sessions.",
    images: ["/og.png"],
  },
};

export default function GuidesPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: `${SITE_URL}/guides`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Memory Guides",
    description:
      "Guides to AI memory apps, MCP memory servers, local-first AI memory, and Claude Code memory.",
    url: `${SITE_URL}/guides`,
    mainEntity: guides.map((guide) => ({
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: guideUrl(guide.slug),
    })),
  };

  return (
    <main className="grain min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <section className="relative border-b border-[var(--o-border-subtle)] px-6 py-24 sm:py-32">
        <GuideHalo />
        <div className="relative z-10 mx-auto max-w-5xl">
          <Link
            href="/"
            className="font-mono text-xs text-[var(--o-text-muted)] transition-colors hover:text-[var(--o-text-secondary)]"
          >
            Origin
          </Link>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
                Learn
              </p>
              <h1 className="warm-glow font-serif text-5xl leading-[1.05] font-medium tracking-tight sm:text-7xl">
                Questions worth answering before you add AI memory.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--o-text-secondary)]">
                Origin is a local-first AI memory app for Claude Code, Cursor,
                ChatGPT, and other MCP-compatible agents. These guides explain
                the category in plain language, then show where Origin fits.
              </p>
            </div>
            <MemoryIndex
              label="Category map"
              items={[
                "AI memory app",
                "MCP memory server",
                "Local-first memory",
                "Claude Code memory",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {guides.map((guide, index) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              scroll
              className="card-origin group relative overflow-hidden rounded-xl p-7 transition-transform duration-150 hover:-translate-y-1"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full border border-[var(--o-border-subtle)] opacity-50 transition-transform duration-300 group-hover:scale-110" />
              <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)]/80 uppercase">
                {guide.eyebrow}
              </p>
              <p className="mt-6 font-mono text-[11px] text-[var(--o-text-dim)]">
                {(index + 1).toString().padStart(2, "0")}
              </p>
              <h2 className="mt-4 font-serif text-2xl font-medium tracking-tight text-[var(--o-text)]">
                {guide.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--o-text-muted)]">
                {guide.description}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-[var(--o-border-subtle)] pt-5">
                <span className="font-mono text-[11px] text-[var(--o-text-muted)]">
                  {guide.readingTime}
                </span>
                <span className="text-sm text-[var(--o-text-secondary)] transition-colors group-hover:text-[var(--o-warm)]">
                  Read answer
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
