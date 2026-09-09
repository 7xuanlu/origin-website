import { ArticleHalo } from "../(en)/learn/article-visuals";
import { getCoreContent } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { LocalizedLink } from "@/i18n/navigation";
import { canonicalUrl, isTranslatedPath } from "@/i18n/routing";
import { Spotlight } from "@/components/spotlight";
import { DocItemIcon } from "@/components/docs/doc-icons";

export function DocsIndexPage({ locale }: { locale: Locale }) {
  const dictionary = getCoreContent(locale);
  const content = dictionary.docs.content;
  const chrome = dictionary.chrome.content;
  const docsSections = content.sections.items;
  const docsItems = docsSections.flatMap((section) => section.items);
  const homeUrl = canonicalUrl(locale, "/");
  const docsUrl = canonicalUrl(locale, "/docs");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: content.breadcrumbs.home,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: content.breadcrumbs.current,
        item: docsUrl,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${docsUrl}#collection`,
    name: content.schema.name,
    description: content.schema.description,
    url: docsUrl,
    isPartOf: { "@id": "https://wenlan.app/#website" },
    publisher: { "@id": "https://wenlan.app/#organization" },
    inLanguage: locale === "en" ? "en-US" : locale,
    hasPart: docsItems.map((item) => ({
      "@type": item.href === "/docs/get-started" ? "WebPage" : "TechArticle",
      name: item.title,
      url: canonicalUrl(locale, item.href),
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
          <nav aria-label={chrome.breadcrumbAriaLabel} className="flex items-center gap-3 font-mono text-xs text-[var(--o-text-muted)]">
            <LocalizedLink
              href="/"
              locale={locale}
              className="transition-colors hover:text-[var(--o-text-secondary)]"
            >
              {content.breadcrumbs.home}
            </LocalizedLink>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--o-text-secondary)]" aria-current="page">
              {content.breadcrumbs.current}
            </span>
          </nav>
          <div className="mt-12 max-w-3xl">
            <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
              {content.hero.eyebrow}
            </p>
            <h1 className="warm-glow max-w-[11ch] font-serif text-[2rem] leading-[1.08] font-medium tracking-tight sm:max-w-none sm:text-7xl sm:leading-[1.05]">
              {content.hero.title}
            </h1>
            <p className="mt-8 max-w-[20rem] text-lg leading-relaxed text-[var(--o-text-secondary)] sm:max-w-2xl">
              {content.hero.description}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="py-2">
            <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)]/80 uppercase">
              {content.intro.eyebrow}
            </p>
            <p className="mt-3 max-w-[20rem] text-sm leading-relaxed text-[var(--o-text-secondary)] sm:max-w-2xl">
              {content.intro.body}
            </p>
          </div>

          <Spotlight className="mt-14 space-y-16">
            {docsSections.map((section) => (
              <section key={section.id}>
                <div className="mb-6">
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                    {section.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--o-text-muted)]">
                    {section.description}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {section.items.map((item) => (
                    <LocalizedLink
                      key={item.href}
                      href={item.href}
                      locale={locale}
                      className={`card-wenlan p-6 sm:p-7${item.id === "get-started" ? " card-wenlan-featured md:col-span-2" : ""}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="icon-tile" aria-hidden="true">
                          <DocItemIcon id={item.id} />
                        </span>
                        <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)]/80 uppercase">
                          {item.label}
                        </p>
                      </div>
                      <h3 className="mt-5 font-serif text-2xl font-medium tracking-tight text-[var(--o-text)]">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-[var(--o-text-muted)]">
                        {item.description}
                      </p>
                      <div className="mt-6 border-t border-[var(--o-border-subtle)] pt-5">
                        {locale !== "en" && !isTranslatedPath(locale, item.href) && (
                          <p className="mb-2 text-xs text-[var(--o-text-secondary)]">{locale === "zh-TW" ? "開啟英文文件" : "打开英文文档"}</p>
                        )}
                        <p className="font-mono text-[10px] text-[var(--o-text-muted)]">
                          {item.meta}
                        </p>
                      </div>
                    </LocalizedLink>
                  ))}
                </div>
              </section>
            ))}
          </Spotlight>

          <section className="mt-20 rounded-lg border border-[var(--o-border)] bg-[var(--o-card-bg)] p-8 sm:flex sm:items-center sm:gap-12">
            <div className="sm:flex-1">
              <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/70 uppercase">
                {content.cta.eyebrow}
              </p>
              <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
                {content.cta.title}
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--o-text-secondary)]">
                {content.cta.body}
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-4 sm:mt-0 sm:w-56 sm:flex-none">
              <LocalizedLink
                href={content.cta.primary.href}
                locale={locale}
                className="btn-wenlan btn-wenlan-primary"
              >
                {content.cta.primary.label}
              </LocalizedLink>
              <a
                href={content.cta.secondary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wenlan btn-wenlan-secondary"
              >
                {content.cta.secondary.label}
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
