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
import { alternateUrls, isTranslatedLearnPath } from "@/i18n/routing";
import { TrackedLink } from "@/components/tracked-link";
import { ProductEvidencePanel } from "@/components/learn/product-evidence-panel";
import { WorkflowComparisonGuide } from "@/components/learn/workflow-comparison-guide";

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

  const pathname = `/learn/${article.slug}`;

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical: pathname,
      ...(isTranslatedLearnPath(pathname)
        ? {
            languages: alternateUrls(pathname),
          }
        : {}),
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      url: articleUrl(article.slug),
      siteName: "Wenlan",
      publishedTime: article.publishedAt ?? article.updatedAt,
      modifiedTime: article.updatedAt,
      authors: [DEFAULT_AUTHOR_URL],
      tags: article.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
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
      "@id": "https://wenlan.app/#qixuan-lu",
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
      "@id": "https://wenlan.app/#organization",
    },
    datePublished: article.publishedAt ?? article.updatedAt,
    dateModified: article.updatedAt,
    image: `${SITE_URL}/og.png`,
    mainEntityOfPage: articleUrl(article.slug),
    isPartOf: { "@id": "https://wenlan.app/learn#collection" },
    audience: { "@type": "Audience", audienceType: article.audience },
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
      url: `${articleUrl(article.slug)}#${section.id ?? sectionId(section.heading)}`,
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
              "@id": "https://wenlan.app/#software",
              name: "Wenlan",
              applicationCategory: "DeveloperApplication",
              url: "https://wenlan.app",
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

      <article>
        <header className="relative border-b border-[var(--o-border-subtle)] px-6 py-24 sm:py-32">
          <ArticleHalo />
          <div className="relative z-10 mx-auto max-w-5xl">
            <nav className="flex items-center gap-3 font-mono text-xs text-[var(--o-text-muted)]">
              <Link
                href="/"
                className="transition-colors hover:text-[var(--o-text-secondary)]"
              >
                Wenlan
              </Link>
              <span>/</span>
              <Link
                href="/learn"
                className="transition-colors hover:text-[var(--o-text-secondary)]"
              >
                Learn
              </Link>
            </nav>
            <div className="mt-12 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div className="min-w-0">
                <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
                  {article.eyebrow}
                </p>
                <h1 className="warm-glow max-w-full font-serif text-[2rem] leading-[1.08] font-medium tracking-tight [overflow-wrap:anywhere] [word-break:normal] sm:[overflow-wrap:break-word] sm:[word-break:keep-all] sm:text-7xl sm:leading-[1.05]">
                  {article.title}
                </h1>
                <p className="mt-8 max-w-2xl break-words text-lg leading-relaxed text-[var(--o-text-secondary)]">
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
                {article.productEvidence && (
                  <a
                    href={article.productEvidence.action.href}
                    className="mt-7 inline-flex rounded-xl border border-[var(--o-border)] px-5 py-3 text-sm font-semibold text-[var(--o-text)] transition-colors hover:border-[var(--o-warm)] hover:text-[var(--o-warm)]"
                  >
                    {article.productEvidence.action.label}
                  </a>
                )}
                {article.slug === "distilled-wiki-pages-ai-memory" && (
                  <a href="#worked-example" className="mt-7 inline-flex rounded-md border border-[var(--o-border)] px-5 py-3 text-sm font-semibold hover:text-[var(--o-warm)]">
                    Try the complete source-to-wiki example
                  </a>
                )}
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
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
              {article.heroBullets.map((bullet, index) => (
                <div key={bullet} className="card-wenlan rounded-xl p-5">
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

        {article.productEvidence && (
          <ProductEvidencePanel evidence={article.productEvidence} />
        )}

        {article.slug === "choose-ai-knowledge-base-tool" && <WorkflowComparisonGuide locale="en" />}

        <section className="px-6 pb-20">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,680px)_1fr]">
            <div className="min-w-0 space-y-14">
              {article.sections.map((section, index) => (
                <section
                  id={section.id ?? sectionId(section.heading)}
                  key={section.heading}
                  className="grid scroll-mt-24 gap-5 sm:grid-cols-[72px_1fr]"
                >
                  <p className="font-mono text-[11px] text-[var(--o-warm)]">
                    {(index + 1).toString().padStart(2, "0")}
                  </p>
                  <div className="min-w-0">
                    <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                      {section.heading}
                    </h2>
                    <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--o-text-secondary)]">
                      {section.body.map((paragraph) => (
                        <p key={paragraph} className={section.id?.startsWith("worked-example") ? "text-pretty" : undefined}>{paragraph}</p>
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
                      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)]">
                        <p className="border-b border-[var(--o-border-subtle)] px-4 py-3 font-mono text-[10px] tracking-[0.18em] text-[var(--o-text-muted)] uppercase">
                          {section.code.label}
                        </p>
                        <pre className={`overflow-x-auto p-4 text-sm leading-relaxed text-[var(--o-text-secondary)] ${section.id?.startsWith("worked-example") ? "whitespace-pre-wrap break-words" : ""}`}>
                          <code>{section.code.code}</code>
                        </pre>
                      </div>
                    )}
                    {section.link && (
                      <Link
                        href={section.link.href}
                        className="mt-6 inline-flex rounded-xl border border-[var(--o-border)] px-5 py-3 text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
                      >
                        {section.link.label}
                      </Link>
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
                    Practical dimensions. Where {article.comparisonTable.competitorName} leads, we say so.
                  </p>
                  <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--o-border)]">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-[var(--o-border)] bg-[var(--o-card-bg)] text-left font-mono text-[11px] tracking-[0.2em] text-[var(--o-text-muted)] uppercase">
                          <th className="px-5 py-4 align-top">Dimension</th>
                          <th className="px-5 py-4 align-top text-[var(--o-warm)]">Wenlan</th>
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
                              {row.wenlan}
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
                  <TrackedLink
                    href="/docs/get-started"
                    eventName="get_started_click"
                    placement="learn-article"
                    locale="en"
                    context={article.category === "Comparisons" ? "comparisons" : article.category === "Workflows" ? "workflows" : "concepts"}
                    className="rounded-xl bg-[var(--o-text)] px-5 py-3 text-center text-sm font-semibold text-[var(--o-bg)] transition-all hover:shadow-[0_0_28px_var(--o-glow-warm)]"
                  >
                    Get started
                  </TrackedLink>
                  <TrackedLink
                    href="https://github.com/7xuanlu/wenlan"
                    eventName="github_outbound"
                    placement="learn-article"
                    locale="en"
                    context={article.category === "Comparisons" ? "comparisons" : article.category === "Workflows" ? "workflows" : "concepts"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-[var(--o-border)] px-5 py-3 text-center text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
                  >
                    View on GitHub
                  </TrackedLink>
                </div>
              </section>
            </div>

            <aside className="min-w-0 space-y-6 lg:sticky lg:top-20 lg:self-start">
              <nav aria-label="On this page" className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                  In this article
                </p>
                <div className="mt-4 space-y-3">
                  {article.sections.map((section, index) => (
                    <a
                      key={section.heading}
                      href={`#${section.id ?? sectionId(section.heading)}`}
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
