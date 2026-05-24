import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  articleUrl,
  articles,
  DEFAULT_AUTHOR_SAME_AS,
  DEFAULT_AUTHOR_URL,
  formatArticleDate,
  getArticle,
  SITE_URL,
} from "../articles";
import { ArticleHalo, MemoryIndex } from "../article-visuals";

function sectionId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type LearnArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: LearnArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical: `/learn/${article.slug}`,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      url: articleUrl(article.slug),
      siteName: "Origin",
      images: [
        {
          url: "/og.png",
          width: 1280,
          height: 720,
          alt: article.title,
        },
      ],
      publishedTime: article.updatedAt,
      modifiedTime: article.updatedAt,
      authors: [DEFAULT_AUTHOR_URL],
      tags: article.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
      images: [{ url: "/og.png", alt: article.title }],
    },
  };
}

export default async function LearnArticlePage({ params }: LearnArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = article.relatedSlugs
    .map((relatedSlug) => getArticle(relatedSlug))
    .filter(
      (relatedArticle): relatedArticle is NonNullable<typeof relatedArticle> =>
        Boolean(relatedArticle),
    );

  const articleBody = article.sections
    .flatMap((section) => section.body)
    .join("\n\n");
  const wordCount = articleBody.split(/\s+/).filter(Boolean).length;
  const articleBodySnippet =
    article.sections[0]?.body[0]?.slice(0, 500) ?? article.description;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      "@id": "https://useorigin.app/#qixuan-lu",
      name: article.author,
      url: DEFAULT_AUTHOR_URL,
      sameAs: DEFAULT_AUTHOR_SAME_AS,
      knowsAbout: [
        "AI work memory",
        "local-first software",
        "Model Context Protocol",
        "knowledge graphs",
        "hybrid retrieval",
      ],
    },
    publisher: {
      "@id": "https://useorigin.app/#organization",
    },
    datePublished: article.updatedAt,
    dateModified: article.updatedAt,
    image: `${SITE_URL}/og.png`,
    mainEntityOfPage: articleUrl(article.slug),
    isPartOf: { "@id": "https://useorigin.app/learn#collection" },
    keywords: article.keywords.join(", "),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    wordCount,
    articleBody: articleBodySnippet,
    about: article.keywords.map((keyword) => ({
      "@type": "Thing",
      name: keyword,
    })),
    hasPart: article.sections.map((section, index) => ({
      "@type": "WebPageElement",
      name: section.heading,
      position: index + 1,
      url: `${articleUrl(article.slug)}#${sectionId(section.heading)}`,
    })),
    ...(article.comparisonTable
      ? {
          mentions: [
            {
              "@type": "SoftwareApplication",
              name: article.comparisonTable.competitorName,
              applicationCategory: "DeveloperApplication",
              ...(article.officialReferences?.[0]?.href
                ? { url: article.officialReferences[0].href }
                : {}),
            },
            {
              "@type": "SoftwareApplication",
              "@id": "https://useorigin.app/#software",
              name: "Origin",
              applicationCategory: "DeveloperApplication",
              url: "https://useorigin.app",
            },
          ],
        }
      : {}),
  };

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
        name: "Learn",
        item: `${SITE_URL}/learn`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl(article.slug),
      },
    ],
  };

  const faqSchema =
    article.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["h1", "h2", "summary"],
          },
          mainEntity: article.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article>
        <header className="relative border-b border-[var(--o-border-subtle)] px-6 py-24 sm:py-32">
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
                href="/learn"
                className="transition-colors hover:text-[var(--o-text-secondary)]"
              >
                Learn
              </Link>
            </nav>
            <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div>
                <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
                  {article.eyebrow}
                </p>
                <h1 className="warm-glow font-serif text-5xl leading-[1.05] font-medium tracking-tight sm:text-7xl">
                  {article.title}
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--o-text-secondary)]">
                  {article.description}
                </p>
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-[var(--o-text-muted)]">
                  <span>{article.author}</span>
                  <span>
                    Updated{" "}
                    <time dateTime={article.updatedAt}>
                      {formatArticleDate(article.updatedAt)}
                    </time>
                  </span>
                  <span>{article.readingTime}</span>
                </div>
              </div>
              <MemoryIndex
                label="Article packet"
                items={[
                  article.category,
                  article.audience,
                  article.readingTime,
                ]}
              />
            </div>
          </div>
        </header>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 md:grid-cols-3">
              {article.heroBullets.map((bullet, index) => (
                <div key={bullet} className="card-origin rounded-xl p-5">
                  <p className="mb-5 font-mono text-[11px] text-[var(--o-warm)]">
                    {(index + 1).toString().padStart(2, "0")}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--o-text-secondary)]">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,680px)_1fr]">
            <div className="space-y-14">
              {article.sections.map((section, index) => (
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
                  </div>
                </section>
              ))}

              {article.comparisonTable && (
                <section>
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                    Side-by-side
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--o-text-muted)]">
                    Quantified dimensions. Where {article.comparisonTable.competitorName} leads, we say so.
                  </p>
                  <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--o-border)]">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-[var(--o-border)] bg-[var(--o-card-bg)] text-left font-mono text-[11px] tracking-[0.2em] text-[var(--o-text-muted)] uppercase">
                          <th className="px-5 py-4 align-top">Dimension</th>
                          <th className="px-5 py-4 align-top text-[var(--o-warm)]">Origin</th>
                          <th className="px-5 py-4 align-top">
                            {article.comparisonTable.competitorName}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {article.comparisonTable.rows.map((row) => (
                          <tr
                            key={row.dimension}
                            className="border-b border-[var(--o-border-subtle)] last:border-b-0 align-top"
                          >
                            <th
                              scope="row"
                              className="px-5 py-4 text-left align-top font-medium text-[var(--o-text)]"
                            >
                              {row.dimension}
                            </th>
                            <td className="px-5 py-4 align-top text-[var(--o-text-secondary)]">
                              {row.origin}
                            </td>
                            <td className="px-5 py-4 align-top text-[var(--o-text-muted)]">
                              {row.competitor}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              <section className="relative overflow-hidden rounded-2xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-8 shadow-[0_18px_70px_rgba(0,0,0,0.18)]">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-[var(--o-border-subtle)] opacity-50" />
                <h2 className="font-serif text-3xl font-medium tracking-tight">
                  {article.cta.heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[var(--o-text-secondary)]">
                  {article.cta.body}
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/docs/get-started"
                    className="rounded-xl bg-[var(--o-text)] px-5 py-3 text-center text-sm font-semibold text-[var(--o-bg)] transition-all hover:shadow-[0_0_28px_var(--o-glow-warm)]"
                  >
                    Get started
                  </Link>
                  <a
                    href="https://github.com/7xuanlu/origin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-[var(--o-border)] px-5 py-3 text-center text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
                  >
                    View on GitHub
                  </a>
                </div>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
              <nav aria-label="On this page" className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                  In this article
                </p>
                <div className="mt-4 space-y-3">
                  {article.sections.map((section, index) => (
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

              {article.officialReferences && (
                <div className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                  <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                    Official references
                  </p>
                  <div className="mt-4 space-y-4">
                    {article.officialReferences.map((reference) => (
                      <a
                        key={reference.href}
                        href={reference.href}
                        target="_blank"
                        rel="noopener noreferrer external"
                        className="block text-sm leading-relaxed text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                      >
                        {reference.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                  Related articles
                </p>
                <div className="mt-4 space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.slug}
                      href={`/learn/${relatedArticle.slug}`}
                      scroll
                      className="block text-sm leading-relaxed text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                    >
                      {relatedArticle.title}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-t border-[var(--o-border-subtle)] px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">
              FAQ
            </p>
            <div className="divide-y divide-[var(--o-border-subtle)] rounded-xl border border-[var(--o-border)]">
              {article.faqs.map((faq) => (
                <details key={faq.question} className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 font-serif text-sm font-medium text-[var(--o-text)] transition-colors duration-150 hover:text-[var(--o-text-secondary)] [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span className="ml-4 text-[var(--o-text-muted)] transition-transform duration-150 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-sm leading-relaxed text-[var(--o-text-muted)]">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
