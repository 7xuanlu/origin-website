import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleHalo } from "../../learn/article-visuals";
import { docPages, docUrl, formatDocDate, getDocPage } from "../docs";
import { SITE_URL } from "../../learn/articles";

type DocsArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return docPages.map((page) => ({
    slug: page.slug,
  }));
}

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function generateMetadata({
  params,
}: DocsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `/docs/${page.slug}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: "article",
      url: docUrl(page.slug),
      siteName: "Origin",
      images: [
        { url: "/og.png", width: 1280, height: 720, alt: page.title },
      ],
      publishedTime: page.updatedAt,
      modifiedTime: page.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [{ url: "/og.png", alt: page.title }],
    },
  };
}

export default async function DocsArticlePage({ params }: DocsArticlePageProps) {
  const { slug } = await params;
  const page = getDocPage(slug);

  if (!page) {
    notFound();
  }

  const nextPage = page.nextSlug ? getDocPage(page.nextSlug) : undefined;

  const articleBody = page.sections
    .flatMap((section) => section.body)
    .join("\n\n");
  const wordCount = articleBody.split(/\s+/).filter(Boolean).length;
  const articleBodySnippet =
    page.sections[0]?.body[0]?.slice(0, 500) ?? page.description;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: page.title,
    description: page.description,
    author: {
      "@id": "https://useorigin.app/#organization",
      name: page.author,
    },
    publisher: {
      "@id": "https://useorigin.app/#organization",
    },
    datePublished: page.updatedAt,
    dateModified: page.updatedAt,
    image: `${SITE_URL}/og.png`,
    mainEntityOfPage: docUrl(page.slug),
    isPartOf: { "@id": "https://useorigin.app/docs#collection" },
    inLanguage: "en-US",
    isAccessibleForFree: true,
    wordCount,
    articleBody: articleBodySnippet,
    proficiencyLevel: "Beginner",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2"],
    },
    hasPart: page.sections.map((section, index) => ({
      "@type": "WebPageElement",
      name: section.heading,
      position: index + 1,
      url: `${docUrl(page.slug)}#${sectionId(section.heading)}`,
    })),
  };

  const howToSchema = page.howTo
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: page.title,
        description: page.description,
        totalTime: `PT${(parseInt(page.readingTime) || 5)}M`,
        step: page.sections.map((section, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: section.heading,
          text: section.body.join(" "),
          url: `${docUrl(page.slug)}#${sectionId(section.heading)}`,
        })),
      }
    : null;

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
        name: "Docs",
        item: `${SITE_URL}/docs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.title,
        item: docUrl(page.slug),
      },
    ],
  };

  return (
    <main className="grain min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      <article>
        <header className="relative border-b border-[var(--o-border-subtle)] px-6 py-16 sm:py-20">
          <ArticleHalo />
          <div className="relative z-10 mx-auto max-w-5xl">
            <nav className="flex items-center gap-3 font-mono text-xs text-[var(--o-text-muted)]">
              <Link
                href="/"
                className="transition-colors hover:text-[var(--o-text-secondary)]"
              >
                Origin
              </Link>
              <span>/</span>
              <Link
                href="/docs"
                className="transition-colors hover:text-[var(--o-text-secondary)]"
              >
                Docs
              </Link>
            </nav>
            <div className="mt-10 max-w-4xl">
              <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
                {page.eyebrow}
              </p>
              <h1 className="warm-glow font-serif text-[2rem] leading-[1.08] font-medium tracking-tight sm:text-6xl sm:leading-[1.05]">
                {page.title}
              </h1>
              <p className="mt-6 max-w-[20rem] text-base leading-relaxed text-[var(--o-text-secondary)] sm:max-w-2xl sm:text-lg">
                {page.description}
              </p>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-[var(--o-text-muted)]">
                <span>{page.author}</span>
                <span>
                  Updated{" "}
                  <time dateTime={page.updatedAt}>
                    {formatDocDate(page.updatedAt)}
                  </time>
                </span>
                <span>{page.readingTime}</span>
              </div>
            </div>
          </div>
        </header>

        <section className="px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-[700px] rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-6">
              <p className="mb-6 font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)]/80 uppercase">
                At a glance
              </p>
              <div className="space-y-4">
                {page.summary.map((item, index) => (
                  <div key={item} className="grid grid-cols-[32px_1fr] gap-3">
                    <p className="font-mono text-[11px] text-[var(--o-warm)]">
                      {(index + 1).toString().padStart(2, "0")}
                    </p>
                    <p className="text-sm leading-relaxed text-[var(--o-text-secondary)]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,700px)_220px]">
            <div className="space-y-14">
              {page.sections.map((section, index) => (
                <section
                  id={sectionId(section.heading)}
                  key={section.heading}
                  className="grid scroll-mt-24 gap-5 sm:grid-cols-[72px_1fr]"
                >
                  <p className="font-mono text-[11px] text-[var(--o-warm)]">
                    {(index + 1).toString().padStart(2, "0")}
                  </p>
                  <div>
                    <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                      {section.heading}
                    </h2>
                    <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--o-text-secondary)]">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {section.bullets && (
                      <ul className="mt-6 space-y-3 border-l border-[var(--o-border)] pl-5">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="text-sm leading-relaxed text-[var(--o-text-muted)]"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.code && (
                      <div className="mt-6">
                        <p className="mb-2 font-mono text-[10px] tracking-[0.2em] text-[var(--o-text-dim)] uppercase">
                          {section.code.label}
                        </p>
                        <pre className="overflow-x-auto rounded-xl border border-[var(--o-border)] bg-[var(--o-bg-deep)] p-5 font-mono text-sm leading-relaxed text-[var(--o-text-secondary)]">
                          <code>{section.code.code}</code>
                        </pre>
                      </div>
                    )}
                    {section.link && (
                      <a
                        href={section.link.href}
                        className="mt-6 inline-flex rounded-xl border border-[var(--o-border)] px-5 py-3 text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
                      >
                        {section.link.label}
                      </a>
                    )}
                  </div>
                </section>
              ))}

              {nextPage && (
                <section>
                  <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                    Next
                  </p>
                  <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight">
                    {nextPage.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--o-text-secondary)]">
                    {nextPage.description}
                  </p>
                  <Link
                    href={`/docs/${nextPage.slug}`}
                    className="mt-6 inline-flex rounded-xl bg-[var(--o-text)] px-5 py-3 text-sm font-semibold text-[var(--o-bg)] transition-all hover:opacity-90"
                  >
                    Read next
                  </Link>
                </section>
              )}
            </div>

            <aside className="border-t border-[var(--o-border-subtle)] pt-8 lg:sticky lg:top-20 lg:self-start lg:border-t-0 lg:pt-1">
              <nav aria-label="On this page">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                  On this page
                </p>
                <div className="mt-4 space-y-3">
                  {page.sections.map((section, index) => (
                    <a
                      key={section.heading}
                      href={`#${sectionId(section.heading)}`}
                      className="grid grid-cols-[28px_1fr] gap-2 text-sm leading-relaxed text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                    >
                      <span className="font-mono text-[10px] text-[var(--o-text-dim)]">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span>{section.heading}</span>
                    </a>
                  ))}
                </div>
              </nav>
            </aside>
          </div>
        </section>
      </article>
    </main>
  );
}
