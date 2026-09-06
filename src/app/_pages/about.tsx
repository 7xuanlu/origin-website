import { ArticleHalo, MemoryIndex } from "../(en)/learn/article-visuals";
import { getCoreContent, type LinkContent } from "@/i18n/content";
import { LOCALE_CONFIG, type Locale } from "@/i18n/locales";
import { LocalizedLink } from "@/i18n/navigation";
import { canonicalUrl } from "@/i18n/routing";

export function AboutPage({ locale }: { locale: Locale }) {
  const dictionary = getCoreContent(locale);
  const content = dictionary.about.content;
  const chrome = dictionary.chrome.content;
  const [whySection, builderSection, statusSection] = content.sections;
  const homeUrl = canonicalUrl(locale, "/");
  const aboutUrl = canonicalUrl(locale, "/about");

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
        item: aboutUrl,
      },
    ],
  };

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: content.schema.name,
    description: content.schema.description,
    url: aboutUrl,
    inLanguage: LOCALE_CONFIG[locale].hreflang,
    mainEntity: {
      "@id": "https://wenlan.app/#organization",
    },
    author: {
      "@id": "https://wenlan.app/#qixuan-lu",
    },
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://wenlan.app/#qixuan-lu",
    name: "Qi-Xuan Lu",
    alternateName: "7xuanlu",
    url: "https://github.com/7xuanlu",
    sameAs: [
      "https://github.com/7xuanlu",
      "https://github.com/7xuanlu/wenlan",
      "https://www.npmjs.com/package/wenlan",
      "https://www.npmjs.com/package/wenlan-mcp",
      "https://crates.io/crates/wenlan-mcp",
      "https://crates.io/crates/wenlan-types",
    ],
    knowsAbout: [
      "AI work memory",
      "local-first software",
      "Model Context Protocol",
      "knowledge graphs",
      "hybrid retrieval",
      "Rust",
      "libSQL",
    ],
    worksFor: { "@id": "https://wenlan.app/#organization" },
    mainEntityOfPage: aboutUrl,
  };

  return (
    <main className="grain min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <article>
        <header className="relative border-b border-[var(--o-border-subtle)] px-6 py-24 sm:py-32">
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
            <div className="mt-12 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div className="min-w-0">
                <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
                  {content.hero.eyebrow}
                </p>
                <h1 className="warm-glow max-w-full break-words font-serif text-5xl leading-[1.05] font-medium [overflow-wrap:anywhere] sm:text-7xl">
                  {content.hero.title}
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--o-text-secondary)]">
                  {content.hero.description}
                </p>
              </div>
              <MemoryIndex
                label={content.hero.statusLabel}
                items={[...content.hero.statusItems]}
              />
            </div>
          </div>
        </header>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,680px)_1fr]">
            <div className="space-y-14">
              {whySection && <ArticleTextSection section={whySection} />}

              <section>
                <div>
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                    {content.principles.title}
                  </h2>
                  <div className="mt-6 space-y-8">
                    {content.principles.items.map((principle) => (
                      <div
                        key={principle.id}
                        className="grid gap-3 sm:grid-cols-[180px_1fr]"
                      >
                        <h3 className="font-serif text-xl font-medium tracking-tight text-[var(--o-text)]">
                          {principle.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[var(--o-text-muted)]">
                          {principle.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {builderSection && <ArticleTextSection section={builderSection} withAuthorLink />}
              {statusSection && (
                <ArticleTextSection section={statusSection}>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <LocalizedLink
                      href={content.cta.primary.href}
                      locale={locale}
                      className="rounded-xl bg-[var(--o-text)] px-5 py-3 text-center text-sm font-semibold text-[var(--o-bg)] transition-all hover:shadow-[0_0_28px_var(--o-glow-warm)]"
                    >
                      {content.cta.primary.label}
                    </LocalizedLink>
                    <ExternalLink
                      link={content.cta.secondary}
                      className="rounded-xl border border-[var(--o-border)] px-5 py-3 text-center text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
                    />
                  </div>
                </ArticleTextSection>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                  {content.projectLinksHeading}
                </p>
                <div className="mt-4 space-y-4">
                  {content.projectLinks.map((link) => (
                    <ExternalLink
                      key={link.id}
                      link={link}
                      className="block text-sm leading-relaxed text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                  {content.help.eyebrow}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--o-text-muted)]">
                  {content.help.bodyPrefix}{" "}
                  <LocalizedLink
                    href={content.help.securityLink.href}
                    locale={locale}
                    className="underline decoration-[var(--o-warm)]/60 underline-offset-4 transition-colors hover:text-[var(--o-warm)]"
                  >
                    {content.help.securityLink.label}
                  </LocalizedLink>
                  {content.help.bodySuffix}
                </p>
              </div>
            </aside>
          </div>
        </section>
      </article>
    </main>
  );
}

type ArticleSection = ReturnType<typeof getCoreContent>["about"]["content"]["sections"][number];

function ArticleTextSection({
  children,
  section,
  withAuthorLink = false,
}: {
  children?: React.ReactNode;
  section: ArticleSection;
  withAuthorLink?: boolean;
}) {
  return (
    <section>
      <div>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
          {section.title}
        </h2>
        <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--o-text-secondary)]">
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>
              {withAuthorLink && paragraph.includes("@7xuanlu") ? (
                <AuthorParagraph paragraph={paragraph} />
              ) : (
                paragraph
              )}
            </p>
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}

function AuthorParagraph({ paragraph }: { paragraph: string }) {
  const [before, after] = paragraph.split("@7xuanlu");

  return (
    <>
      {before}
      <a
        href="https://github.com/7xuanlu"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--o-text)] underline decoration-[var(--o-warm)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--o-warm)]"
      >
        @7xuanlu
      </a>
      {after}
    </>
  );
}

function ExternalLink({ className, link }: { className: string; link: LinkContent }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {link.label}
    </a>
  );
}
