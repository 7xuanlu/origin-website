import { ArticleHalo, MemoryIndex } from "../(en)/learn/article-visuals";
import { TrackedLink, TrackedLocalizedLink } from "@/components/tracked-link";
import { getLocalizedLearnArticles } from "@/i18n/learn-articles";
import { localizedLearnIndexContent } from "@/i18n/learn-index";
import { LOCALE_CONFIG, type TranslatedLocale } from "@/i18n/locales";
import { LocalizedLink } from "@/i18n/navigation";
import { canonicalUrl } from "@/i18n/routing";

export function LocalizedLearnIndexPage({ locale }: { locale: TranslatedLocale }) {
  const content = localizedLearnIndexContent[locale];
  const articles = getLocalizedLearnArticles(locale);
  const learnUrl = canonicalUrl(locale, "/learn");
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Wenlan",
        item: canonicalUrl(locale, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: content.breadcrumb,
        item: learnUrl,
      },
    ],
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${learnUrl}#collection`,
    name: content.seo.title,
    description: content.seo.description,
    url: learnUrl,
    isPartOf: { "@id": "https://wenlan.app/#website" },
    publisher: { "@id": "https://wenlan.app/#organization" },
    inLanguage: LOCALE_CONFIG[locale].hreflang,
    mainEntity: articles.map((article) => ({
      "@type": "Article",
      headline: article.title,
      description: article.description,
      url: canonicalUrl(locale, `/learn/${article.slug}`),
      author: { "@id": "https://wenlan.app/#qixuan-lu" },
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
        <ArticleHalo />
        <div className="relative z-10 mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-3 font-mono text-xs text-[var(--o-text-muted)]">
            <LocalizedLink href="/" locale={locale} className="transition-colors hover:text-[var(--o-text-secondary)]">
              Wenlan
            </LocalizedLink>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--o-text-secondary)]" aria-current="page">
              {content.breadcrumb}
            </span>
          </nav>
          <div className="mt-12 grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="min-w-0">
              <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
                {content.eyebrow}
              </p>
              <h1 className="warm-glow font-serif text-5xl leading-[1.08] font-medium tracking-tight [word-break:keep-all] [overflow-wrap:break-word] sm:text-7xl">
                {content.title}
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--o-text-secondary)]">
                {content.description}
              </p>
            </div>
            <MemoryIndex label={content.topicLabel} items={[...content.topics]} />
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)]/80 uppercase">
            {content.startEyebrow}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--o-text-secondary)]">
            {content.startDescription}
          </p>
          <div className="mt-10 flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
              {content.articlesHeading}
            </h2>
            <p className="font-mono text-[11px] text-[var(--o-text-dim)]">
              {articles.length} {content.articleCountLabel}
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {articles.map((article) => (
              <TrackedLocalizedLink
                key={article.slug}
                href={`/learn/${article.slug}`}
                eventName="learn_article_click"
                placement="learn-grid"
                locale={locale}
                context="concepts"
                className="card-wenlan group p-7"
              >
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)]/80 uppercase">
                  {article.eyebrow}
                </p>
                <h3 className="mt-6 font-serif text-2xl font-medium tracking-tight text-[var(--o-text)] [word-break:keep-all] [overflow-wrap:break-word]">
                  {article.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--o-text-muted)]">
                  {article.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--o-border-subtle)] pt-5 font-mono text-[10px] text-[var(--o-text-muted)]">
                  <span>{article.author}</span>
                  <time dateTime={article.updatedAt}>{article.updatedAt}</time>
                  <span>{article.readingTime}</span>
                </div>
              </TrackedLocalizedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--o-border-subtle)] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/70 uppercase">
            {content.ctaEyebrow}
          </p>
          <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
            {content.ctaTitle}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[var(--o-text-secondary)] sm:text-lg">
            {content.ctaDescription}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <TrackedLocalizedLink
              href="/docs/get-started"
              eventName="get_started_click"
              placement="learn-footer"
              locale={locale}
              context="setup"
              className="rounded-xl bg-[var(--o-text)] px-6 py-3 text-sm font-semibold text-[var(--o-bg)] transition-all duration-150 hover:opacity-90"
            >
              {content.getStarted}
            </TrackedLocalizedLink>
            <TrackedLink
              href="https://github.com/7xuanlu/wenlan"
              eventName="github_outbound"
              placement="learn-footer"
              locale={locale}
              context="setup"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[var(--o-border)] px-6 py-3 text-sm font-medium text-[var(--o-text-secondary)] transition-all duration-150 hover:border-[var(--o-text-dim)] hover:text-[var(--o-text)]"
            >
              {content.github}
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
