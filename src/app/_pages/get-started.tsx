import { ArticleHalo, MemoryIndex } from "../(en)/learn/article-visuals";
import { RuntimeInstallBlock } from "@/components/docs/runtime-install-block";
import { getCoreContent } from "@/i18n/content";
import { LOCALE_CONFIG, type Locale } from "@/i18n/locales";
import { LocalizedLink } from "@/i18n/navigation";
import { canonicalUrl } from "@/i18n/routing";
import { TrackedLocalizedLink } from "@/components/tracked-link";

export function GetStartedPage({ locale }: { locale: Locale }) {
  const dictionary = getCoreContent(locale);
  const content = dictionary.getStarted.content;
  const chrome = dictionary.chrome.content;
  const homeUrl = canonicalUrl(locale, "/");
  const docsUrl = canonicalUrl(locale, "/docs");
  const getStartedUrl = canonicalUrl(locale, "/docs/get-started");

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
        name: content.breadcrumbs.docs,
        item: docsUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: content.hero.eyebrow,
        item: getStartedUrl,
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: content.schema.name,
    description: content.schema.description,
    url: getStartedUrl,
    inLanguage: LOCALE_CONFIG[locale].hreflang,
    step: content.steps.map((step) => ({
      "@type": "HowToStep",
      name: step.title,
      text: [...step.paragraphs, ...step.commands].join("\n"),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
              <span>/</span>
              <LocalizedLink
                href="/docs"
                locale={locale}
                className="transition-colors hover:text-[var(--o-text-secondary)]"
              >
                {content.breadcrumbs.docs}
              </LocalizedLink>
            </nav>
            <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div>
                <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
                  {content.hero.eyebrow}
                </p>
                <h1 className="warm-glow break-keep font-serif text-[2rem] leading-[1.08] font-medium tracking-tight sm:text-7xl sm:leading-[1.05]">
                  {content.hero.title}
                </h1>
                <p className="mt-8 max-w-[20rem] break-keep text-lg leading-relaxed text-[var(--o-text-secondary)] sm:max-w-2xl">
                  {content.hero.description}
                </p>
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-[var(--o-text-muted)]">
                  {content.hero.meta.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <MemoryIndex
                label={content.hero.setupPathLabel}
                items={[...content.hero.setupPathItems]}
              />
            </div>
          </div>
        </header>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,680px)_1fr]">
            <div className="min-w-0 space-y-14">
              {content.steps.map((step) => (
                <section
                  key={step.id}
                  className="grid min-w-0 gap-5 border-t border-[var(--o-border-subtle)] pt-10 sm:grid-cols-[72px_minmax(0,1fr)]"
                >
                  <p className="font-mono text-[11px] text-[var(--o-warm)]">
                    {step.number}
                  </p>
                  <div className="min-w-0">
                    <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">
                      {step.title}
                    </h2>
                    {step.paragraphs.map((paragraph, index) => (
                      <p
                        key={paragraph}
                        className={`${index === 0 ? "mt-5 text-base text-[var(--o-text-secondary)]" : "mt-4 text-sm text-[var(--o-text-muted)]"} leading-relaxed`}
                      >
                        {paragraph}
                      </p>
                    ))}
                    {step.id === "install-runtime" ? (
                      <RuntimeInstallBlock
                        commands={step.commands}
                        ctas={step.ctas}
                        locale={locale}
                      />
                    ) : (
                      <>
                        {step.commands.map((command) => (
                          <pre
                            key={command}
                            className="mt-6 overflow-x-auto rounded-xl border border-[var(--o-border)] bg-[var(--o-bg-deep)] p-5 font-mono text-sm leading-relaxed text-[var(--o-text-secondary)]"
                          >
                            <code>{command}</code>
                          </pre>
                        ))}
                        {step.ctas.length > 0 && (
                      <div className="mt-7 flex min-w-0 flex-col gap-3 sm:flex-row">
                        {step.ctas.map((cta, index) => (
                          <TrackedLocalizedLink
                            key={cta.id}
                            href={cta.href}
                            locale={locale}
                            eventName="setup_path_click"
                            placement="docs-get-started"
                            context="setup"
                            className={
                              index === 0
                                ? "min-w-0 break-words rounded-xl bg-[var(--o-text)] px-5 py-3 text-center text-sm font-semibold text-[var(--o-bg)] transition-all hover:shadow-[0_0_28px_var(--o-glow-warm)]"
                                : "min-w-0 break-words rounded-xl border border-[var(--o-border)] px-5 py-3 text-center text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
                            }
                          >
                            {cta.label}
                          </TrackedLocalizedLink>
                        ))}
                      </div>
                        )}
                      </>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                  {content.sidebar.eyebrow}
                </p>
                <div className="mt-4 space-y-3">
                  {content.sidebar.items.map((item, index) => (
                    <p
                      key={item.id}
                      className="grid grid-cols-[28px_1fr] gap-2 text-sm text-[var(--o-text-secondary)]"
                    >
                      <span className="font-mono text-[10px] text-[var(--o-text-dim)]">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span>{item.label}</span>
                    </p>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </article>
    </main>
  );
}
