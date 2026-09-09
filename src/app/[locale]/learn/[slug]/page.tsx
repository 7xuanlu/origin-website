import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedLink } from "@/i18n/navigation";
import {
  getLocalizedLearnArticle,
  isTranslatedLearnSlug,
  localizedLearnArticlePath,
  TRANSLATED_LEARN_SLUGS,
  translatedLearnStaticParams,
} from "@/i18n/learn-articles";
import { LOCALE_CONFIG, type TranslatedLocale } from "@/i18n/locales";
import { resolveLocalizedRouteLocale } from "@/i18n/resolve-locale";
import { alternateUrls, canonicalUrl, SITE_URL } from "@/i18n/routing";
import {
  DEFAULT_AUTHOR_SAME_AS,
  DEFAULT_AUTHOR_URL,
  formatArticleDate,
  getArticle,
  type LearnArticle,
} from "../../../(en)/learn/articles";
import { ArticleHalo, MemoryIndex } from "../../../(en)/learn/article-visuals";
import { TrackedLink, TrackedLocalizedLink } from "@/components/tracked-link";
import { getScenarioPacket } from "@/lib/scenario-examples";
import { ScenarioWorkedExample } from "@/components/learn/scenario-worked-example";
import { ProductEvidencePanel } from "@/components/learn/product-evidence-panel";
import { WorkflowComparisonGuide } from "@/components/learn/workflow-comparison-guide";
import { RecordedWorkflowProof } from "@/components/learn/recorded-workflow-proof";
import { buildSectionIds } from "./section-ids";

type LocalizedLearnArticlePageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

const chromeByLocale = {
  "zh-TW": {
    home: "Wenlan",
    learn: "學習指南",
    updated: "更新",
    articlePacket: "關於這篇指南",
    inThisArticle: "本文段落",
    officialReferences: "官方資料",
    relatedArticles: "相關文章",
    faq: "常見問題",
    getStarted: "開始使用",
    github: "在 GitHub 查看",
  },
  "zh-CN": {
    home: "Wenlan",
    learn: "学习指南",
    updated: "更新",
    articlePacket: "关于这篇指南",
    inThisArticle: "本文段落",
    officialReferences: "官方资料",
    relatedArticles: "相关文章",
    faq: "常见问题",
    getStarted: "开始使用",
    github: "在 GitHub 查看",
  },
} as const satisfies Record<TranslatedLocale, Record<string, string>>;

function renderProtectedCjkTerms(text: string) {
  return text
    .split(/(Karpathy LLM Wiki：|課程 Wiki|课程 Wiki|課堂講義|课程讲义|先備知識|前置知识|指標定義|指标定义|資料字典|数据字典|來源修訂|来源修订|供應商盡職調查|供应商尽职调查|證據包|证据包|複審|复审|SRE 事故知識庫|SRE 故障知识库|與事故復盤|与故障复盘|事故復盤|故障复盘|客戶專案知識庫|客户项目知识库|競品檔案|竞品档案|顧問案|咨询项目|研究知識庫|研究知识库|產品研究|产品研究|產品決策|产品决策|論文 PDF|论文 PDF|文獻矩陣|文献矩阵|AI 知識庫|AI 知识库|客服答案知識庫|客服答案知识库|知識庫|知识库|驗收資料|验收资料|證據|证据|追溯|8 項|8 项|來源|来源|記什麼？|记录什么？|不可承諾|不可承诺|禁止承诺|轉人工|转人工)/g)
    .map((part, index) =>
      part === "Karpathy LLM Wiki：" ||
      part === "課程 Wiki" ||
      part === "课程 Wiki" ||
      part === "課堂講義" ||
      part === "课程讲义" ||
      part === "先備知識" ||
      part === "前置知识" ||
      part === "指標定義" ||
      part === "指标定义" ||
      part === "資料字典" ||
      part === "数据字典" ||
      part === "來源修訂" ||
      part === "来源修订" ||
      part === "供應商盡職調查" ||
      part === "供应商尽职调查" ||
      part === "證據包" ||
      part === "证据包" ||
      part === "複審" ||
      part === "复审" ||
      part === "SRE 事故知識庫" ||
      part === "SRE 故障知识库" ||
      part === "與事故復盤" ||
      part === "与故障复盘" ||
      part === "事故復盤" ||
      part === "故障复盘" ||
      part === "客戶專案知識庫" ||
      part === "客户项目知识库" ||
      part === "競品檔案" ||
      part === "竞品档案" ||
      part === "顧問案" ||
      part === "咨询项目" ||
      part === "研究知識庫" ||
      part === "研究知识库" ||
      part === "產品研究" ||
      part === "产品研究" ||
      part === "產品決策" ||
      part === "产品决策" ||
      part === "論文 PDF" ||
      part === "论文 PDF" ||
      part === "文獻矩陣" ||
      part === "文献矩阵" ||
      part === "AI 知識庫" ||
      part === "AI 知识库" ||
      part === "知識庫" ||
      part === "知识库" ||
      part === "驗收資料" ||
      part === "验收资料" ||
      part === "證據" ||
      part === "证据" ||
      part === "追溯" ||
      part === "8 項" ||
      part === "8 项" ||
      part === "來源" ||
      part === "来源" ||
      part === "記什麼？" ||
      part === "记录什么？" ||
      part === "客服答案知識庫" ||
      part === "客服答案知识库" ||
      part === "不可承諾" ||
      part === "不可承诺" ||
      part === "禁止承诺" ||
      part === "轉人工" ||
      part === "转人工" ? (
        <span
          key={`${part}-${index}`}
          className="whitespace-nowrap max-[360px]:whitespace-normal"
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
}

function translatedArticleOrNotFound(locale: string, slug: string) {
  const resolvedLocale = resolveLocalizedRouteLocale(locale);
  const article = getLocalizedLearnArticle(resolvedLocale, slug);

  if (!article) {
    notFound();
  }

  return { locale: resolvedLocale, article };
}

function articleHref(slug: string): string {
  if (isTranslatedLearnSlug(slug)) {
    return localizedLearnArticlePath(slug);
  }

  return `/learn/${slug}`;
}

function relatedArticleForLocale(locale: TranslatedLocale, slug: string): LearnArticle | null {
  return getLocalizedLearnArticle(locale, slug) ?? getArticle(slug) ?? null;
}

export function generateStaticParams() {
  return translatedLearnStaticParams();
}

export async function generateMetadata({
  params,
}: LocalizedLearnArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedLocale = resolveLocalizedRouteLocale(locale);
  const article = getLocalizedLearnArticle(resolvedLocale, slug);

  if (!article || !isTranslatedLearnSlug(slug)) {
    return {};
  }

  const pathname = localizedLearnArticlePath(slug);
  const url = canonicalUrl(resolvedLocale, pathname);

  return {
    metadataBase: new URL(SITE_URL),
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical: url,
      languages: alternateUrls(pathname),
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      url,
      siteName: "Wenlan",
      locale: LOCALE_CONFIG[resolvedLocale].openGraphLocale,
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

export default async function LocalizedLearnSlugPage({
  params,
}: LocalizedLearnArticlePageProps) {
  const { locale, slug } = await params;
  const { locale: resolvedLocale, article } = translatedArticleOrNotFound(locale, slug);
  const chrome = chromeByLocale[resolvedLocale];
  const renderArticleText =
    article.slug === "wenlan-vs-obsidian-ai-memory" ||
    article.slug === "distilled-wiki-pages-ai-memory" ||
    article.slug === "choose-ai-knowledge-base-tool" ||
    article.slug === "test-ai-knowledge-base-retrieval-after-changes" ||
    article.slug === "coding-agent-source-backed-knowledge-base" ||
    article.slug === "fix-pdf-ingestion-ai-knowledge-base" ||
    article.slug === "prevent-multi-agent-knowledge-conflicts" ||
    article.slug === "source-backed-research-knowledge-base" ||
    article.slug === "build-client-project-knowledge-base-for-consulting" ||
    article.slug === "build-investment-research-knowledge-base" ||
    article.slug === "build-product-research-knowledge-base-for-prd" ||
    article.slug === "build-sre-incident-knowledge-base" ||
    article.slug === "build-competitive-intelligence-knowledge-base" ||
    article.slug === "build-ict-supplier-due-diligence-evidence-pack" ||
    article.slug === "build-customer-support-answer-knowledge-base" ||
    article.slug === "build-course-wiki-from-lecture-notes" ||
    article.slug === "build-business-metric-definition-knowledge-base"
      ? renderProtectedCjkTerms
      : (text: string) => text;

  const relatedArticles = article.relatedSlugs
    .map((relatedSlug) => relatedArticleForLocale(resolvedLocale, relatedSlug))
    .filter(
      (relatedArticle): relatedArticle is NonNullable<typeof relatedArticle> =>
        Boolean(relatedArticle),
    );

  const pathname = `/learn/${article.slug}`;
  const url = canonicalUrl(resolvedLocale, pathname);
  const sectionIds = buildSectionIds(
    article.sections.map((section) => section.heading),
    article.sections.map((section) => section.id),
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
        "LLM wiki",
        "Model Context Protocol",
        "source-backed memory",
        "knowledge graphs",
      ],
    },
    publisher: {
      "@id": "https://wenlan.app/#organization",
    },
    datePublished: article.publishedAt ?? article.updatedAt,
    dateModified: article.updatedAt,
    image: `${SITE_URL}/og.png`,
    mainEntityOfPage: url,
    isPartOf: { "@id": `${canonicalUrl(resolvedLocale, "/learn")}#collection` },
    audience: { "@type": "Audience", audienceType: article.audience },
    keywords: article.keywords.join(", "),
    inLanguage: LOCALE_CONFIG[resolvedLocale].hreflang,
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
      url: `${url}#${sectionIds[index]}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: chrome.home,
        item: canonicalUrl(resolvedLocale, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: chrome.learn,
        item: canonicalUrl(resolvedLocale, "/learn"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: url,
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
              <LocalizedLink
                href="/"
                locale={resolvedLocale}
                className="transition-colors hover:text-[var(--o-text-secondary)]"
              >
                {chrome.home}
              </LocalizedLink>
              <span>/</span>
              <LocalizedLink
                href="/learn"
                locale={resolvedLocale}
                className="transition-colors hover:text-[var(--o-text-secondary)]"
              >
                {chrome.learn}
              </LocalizedLink>
            </nav>
            <div className="mt-12 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end [&_p]:text-pretty">
              <div className="min-w-0">
                <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/80 uppercase">
                  {article.eyebrow}
                </p>
                <h1 className="warm-glow max-w-full font-serif text-[2rem] leading-[1.08] font-medium tracking-tight [overflow-wrap:anywhere] [word-break:normal] sm:[overflow-wrap:break-word] sm:[word-break:keep-all] sm:text-7xl sm:leading-[1.05]">
                  {renderArticleText(article.title)}
                </h1>
                <p className="mt-8 max-w-2xl break-words text-lg leading-relaxed text-[var(--o-text-secondary)]">
                  {renderArticleText(article.description)}
                </p>
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-[var(--o-text-muted)]">
                  <span>{article.author}</span>
                  <span>
                    {chrome.updated}{" "}
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
                    {renderArticleText(article.productEvidence.action.label)}
                  </a>
                )}
                {article.slug === "distilled-wiki-pages-ai-memory" && (
                  <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#worked-example" className="inline-flex rounded-md border border-[var(--o-border)] px-5 py-3 text-sm font-semibold hover:text-[var(--o-warm)]">
                    {locale === "zh-TW" ? "試做：從三份來源到一頁 Wiki" : "试做：从三份来源到一页 Wiki"}
                  </a>
                  <a href={`/learn-example/${resolvedLocale}`} download className="inline-flex items-center px-2 py-3 text-sm font-semibold text-[var(--o-warm)] underline underline-offset-4">{locale === "zh-TW" ? "下載練習材料（.md）" : "下载练习材料（.md）"}</a>
                  </div>
                )}
                {["distilled-wiki-pages-ai-memory", "source-backed-wiki-pages-ai-work"].includes(article.slug) && (
                  <a href="#recorded-workflow" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--o-warm)] underline underline-offset-4">{locale === "zh-TW" ? "查看實際操作畫面" : "查看实际操作画面"}</a>
                )}
              </div>
              <MemoryIndex
                label={chrome.articlePacket}
                items={[
                  (resolvedLocale === "zh-TW" ? { Concepts: "概念", Comparisons: "工具比較", Workflows: "工作流程" } : { Concepts: "概念", Comparisons: "工具对比", Workflows: "工作流程" })[article.category],
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
                <div key={bullet} className="card-wenlan p-5">
                  <p className="mb-5 font-mono text-[11px] text-[var(--o-warm)]">
                    {(index + 1).toString().padStart(2, "0")}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--o-text-secondary)]">
                    {renderArticleText(bullet)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {getScenarioPacket(article.slug) ? (
          <ScenarioWorkedExample packet={getScenarioPacket(article.slug)!} locale={resolvedLocale} />
        ) : article.productEvidence && (
          <ProductEvidencePanel
            evidence={article.productEvidence}
            locale={resolvedLocale}
            renderText={renderArticleText}
          />
        )}

        {article.slug === "choose-ai-knowledge-base-tool" && <WorkflowComparisonGuide locale={resolvedLocale} />}

        <section className="px-6 pb-20">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,680px)_1fr]">
            <div className="min-w-0 space-y-14">
              {article.sections.map((section, index) => (
                <section
                  id={sectionIds[index]}
                  key={sectionIds[index]}
                  className="grid scroll-mt-24 gap-5 sm:grid-cols-[72px_1fr]"
                >
                  <p className="font-mono text-[11px] text-[var(--o-warm)]">
                    {(index + 1).toString().padStart(2, "0")}
                  </p>
                  <div className="min-w-0">
                    <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)] [word-break:keep-all] [overflow-wrap:break-word]">
                      {renderArticleText(section.heading)}
                    </h2>
                    <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--o-text-secondary)]">
                      {section.body.map((paragraph) => (
                        <p key={paragraph} className={section.id?.startsWith("worked-example") ? "text-pretty" : undefined}>{renderArticleText(paragraph)}</p>
                      ))}
                    </div>
                    {section.bullets && (
                      <ul className="mt-6 space-y-3 border-l border-[var(--o-border)] pl-5">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="text-sm leading-relaxed text-[var(--o-text-muted)]"
                          >
                            {renderArticleText(bullet)}
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
                      <LocalizedLink
                        href={section.link.href}
                        locale={resolvedLocale}
                        className="mt-6 inline-flex rounded-xl border border-[var(--o-border)] px-5 py-3 text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
                      >
                        {renderArticleText(section.link.label)}
                      </LocalizedLink>
                    )}
                  </div>
                </section>
              ))}

              <section className="relative overflow-hidden rounded-2xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-8 shadow-[0_18px_70px_rgba(0,0,0,0.18)]">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-[var(--o-border-subtle)] opacity-50" />
                <h2 className="font-serif text-3xl font-medium tracking-tight [word-break:keep-all] [overflow-wrap:break-word]">
                  {renderArticleText(article.cta.heading)}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[var(--o-text-secondary)]">
                  {renderArticleText(article.cta.body)}
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <TrackedLocalizedLink
                    href="/docs/get-started"
                    locale={resolvedLocale}
                    eventName="get_started_click"
                    placement="learn-article"
                    context={article.category === "Comparisons" ? "comparisons" : article.category === "Workflows" ? "workflows" : "concepts"}
                    className="rounded-xl bg-[var(--o-text)] px-5 py-3 text-center text-sm font-semibold text-[var(--o-bg)] transition-all hover:shadow-[0_0_28px_var(--o-glow-warm)]"
                  >
                    {chrome.getStarted}
                  </TrackedLocalizedLink>
                  <TrackedLink
                    href="https://github.com/7xuanlu/wenlan"
                    eventName="github_outbound"
                    placement="learn-article"
                    locale={resolvedLocale}
                    context={article.category === "Comparisons" ? "comparisons" : article.category === "Workflows" ? "workflows" : "concepts"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-[var(--o-border)] px-5 py-3 text-center text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
                  >
                    {chrome.github}
                  </TrackedLink>
                </div>
              </section>
            </div>

            <aside className="min-w-0 space-y-6 lg:sticky lg:top-20 lg:self-start">
              <nav
                aria-label={chrome.inThisArticle}
                className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5"
              >
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                  {chrome.inThisArticle}
                </p>
                <div className="mt-4 space-y-3">
                  {article.sections.map((section, index) => (
                    <a
                      key={sectionIds[index]}
                      href={`#${sectionIds[index]}`}
                      className="grid grid-cols-[28px_1fr] gap-2 text-sm leading-relaxed text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                    >
                      <span className="font-mono text-[10px] text-[var(--o-text-dim)]">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span>{renderArticleText(section.heading)}</span>
                    </a>
                  ))}
                </div>
              </nav>

              {article.officialReferences && (
                <div className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                  <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                    {chrome.officialReferences}
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
                        {renderArticleText(reference.label)}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
                  {chrome.relatedArticles}
                </p>
                <div className="mt-4 space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <LocalizedLink
                      key={relatedArticle.slug}
                      href={articleHref(relatedArticle.slug)}
                      locale={resolvedLocale}
                      scroll
                      className="block text-sm leading-relaxed text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                    >
                      {renderArticleText(relatedArticle.title)}
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        {["distilled-wiki-pages-ai-memory", "source-backed-wiki-pages-ai-work"].includes(article.slug) && <RecordedWorkflowProof locale={resolvedLocale} />}

        <section className="border-t border-[var(--o-border-subtle)] px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">
              {chrome.faq}
            </p>
            <div className="divide-y divide-[var(--o-border-subtle)] rounded-xl border border-[var(--o-border)]">
              {article.faqs.map((faq) => (
                <details key={faq.question} className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 font-serif text-sm font-medium text-[var(--o-text)] transition-colors duration-150 hover:text-[var(--o-text-secondary)] [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0">{renderArticleText(faq.question)}</span>
                    <span className="ml-4 text-[var(--o-text-muted)] transition-transform duration-150 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-sm leading-relaxed text-[var(--o-text-muted)]">
                    {renderArticleText(faq.answer)}
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
