import { DemoVideo } from "../demo-video";
import { WaitlistForm } from "../waitlist-form";
import { ThemeToggle } from "../theme-toggle";
import { BrandWordmark } from "@/components/brand-wordmark";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  ArrowRightIcon,
  AntigravityBrandIcon,
  ClaudeBrandIcon,
  CursorBrandIcon,
  GitHubLogoIcon,
  ObsidianBrandIcon,
  OpenAiBrandIcon,
  VSCodeBrandIcon,
} from "@/components/icons";
import { DownloadSection } from "@/components/home/download";
import { PainsSection } from "@/components/home/pains";
import { PipelineSection } from "@/components/home/pipeline";
import { HeroScenarios } from "@/components/home/hero-scenarios";
import { BentoSection } from "@/components/home/bento";
import { StorageSection } from "@/components/home/storage";
import { ProductShowcase } from "@/components/home/product-showcase";
import { HomeMotion } from "@/components/home/home-motion";
import { HomeReadableText } from "@/components/home/readable-text";
import { TrackedLink, TrackedLocalizedLink } from "@/components/tracked-link";
import { getCoreContent, type HomeContent, type LinkContent } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { LocalizedLink, localizedHrefForLocale } from "@/i18n/navigation";
import { SITE_URL } from "@/i18n/routing";
import { demoVideoForLocale } from "@/lib/demo-video";

function WenlanMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="size-7">
      <defs>
        <linearGradient id="nav-ring" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" style={{ stopColor: "var(--o-logo-start)" }} />
          <stop offset="50%" style={{ stopColor: "var(--o-logo-mid)" }} />
          <stop offset="100%" style={{ stopColor: "var(--o-logo-end)" }} />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="10" stroke="url(#nav-ring)" strokeWidth="5" />
      <circle cx="20" cy="10" r="3" fill="var(--o-logo-orb)" opacity="0.9" />
    </svg>
  );
}

/* The works-with strip pairs each client's official mark with its name for
   screen readers. Client names are product names and stay English in every
   locale. Claude Code and Claude Desktop share the Claude mark. Codex ships
   under OpenAI, so it carries the OpenAI mark. */
const worksWithClients = [
  { id: "claude-code", label: "Claude Code", Icon: ClaudeBrandIcon },
  { id: "cursor", label: "Cursor", Icon: CursorBrandIcon },
  { id: "codex", label: "Codex", Icon: OpenAiBrandIcon },
  { id: "claude-desktop", label: "Claude Desktop", Icon: ClaudeBrandIcon },
  { id: "vscode", label: "VS Code", Icon: VSCodeBrandIcon },
] as const;

const integrationCopy = {
  en: {
    title: "Your sources. Your tools. One place to build on.",
    sourcesTitle: "Start with what you already have",
    sourcesBody: "Bring your past conversations, research notes, and project documents into Wenlan. Start with ChatGPT or Claude export ZIPs, Markdown, text, text-extractable PDFs, or a folder of supported files.",
    sourceLink: "Build a knowledge base from your documents",
    clientsTitle: "Bring it into your next session",
    clientsBody: "Connect your AI tools to find the decisions and source-backed Pages you kept. Each client needs its own setup and access permissions.",
    clientsLink: "Connect your tools",
    metricsLink: "Inspect the retrieval measurements",
  },
  "zh-TW": {
    title: "接上你的資料，\n也接上工作的工具。",
    sourcesTitle: "從你已經有的資料開始",
    sourcesBody: "把過去的對話、研究筆記與專案文件帶進 Wenlan。支援 ChatGPT、Claude 匯出的 ZIP，以及 Markdown、文字、可擷取文字的 PDF，或包含這些檔案的資料夾。",
    sourceLink: "用現有文件建立知識庫",
    clientsTitle: "帶進下一次工作",
    clientsBody: "連接 AI 工具，找回留下的決策與有來源的知識頁面。各工具仍需完成連線設定，並依權限存取。",
    clientsLink: "設定工具連線",
    metricsLink: "查看檢索評測與適用範圍",
  },
  "zh-CN": {
    title: "接上你的资料，\n也接上工作的工具。",
    sourcesTitle: "从你已经有的资料开始",
    sourcesBody: "把过去的对话、研究笔记与项目文档带进 Wenlan。支持 ChatGPT、Claude 导出的 ZIP，以及 Markdown、文本、可提取文本的 PDF，或包含这些文件的文件夹。",
    sourceLink: "用现有文档建立知识库",
    clientsTitle: "带进下一次工作",
    clientsBody: "连接 AI 工具，找回留下的决策与有来源的知识页面。各工具仍需完成连接配置，并按权限访问。",
    clientsLink: "配置工具连接",
    metricsLink: "查看检索评测与适用范围",
  },
} as const;

// The two bars share a zero baseline and the same token scale. Retrieval
// quality remains a separate measurement, not part of the bar lengths.
const metricBarChrome: Record<string, { tone: "muted" | "warm"; widthPercent: number }> = {
  "full-replay": { tone: "muted", widthPercent: 100 },
  wenlan: { tone: "warm", widthPercent: 168 / 4505 * 100 },
};

function MetricBar({ label, sub, tone, value, widthPercent }: {
  label: string; sub: string; tone: "muted" | "warm"; value: string; widthPercent: number;
}) {
  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <p className="text-base font-medium">{label}</p>
        <p className="font-mono text-base tabular-nums" style={{ color: tone === "warm" ? "var(--o-warm)" : "var(--o-text-secondary)" }}>{value}</p>
      </div>
      <div aria-hidden="true" className="mt-3 h-3 overflow-hidden rounded-sm bg-[var(--o-surface)]">
        <div data-retrieval-bar className="h-full rounded-sm" style={{ width: `${widthPercent}%`, background: tone === "warm" ? "var(--o-warm)" : "var(--o-text-muted)" }} />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[var(--o-text-muted)]">{sub}</p>
    </div>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const content = getCoreContent(locale).home.content;
  const siteNavigationSchema = buildSiteNavigationSchema(locale, content.nav);
  const redesign = content.redesign;
  const cta = content.sections.openSourceCta;
  const demoVideo = demoVideoForLocale(locale);
  const integrations = integrationCopy[locale];

  return (
    <main className="home-page grain relative min-h-screen">
      <HomeMotion />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
      />
      <nav className="fixed top-0 z-40 w-full border-b border-[var(--o-border-subtle)] bg-[var(--o-nav-bg)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <WenlanMark />
            <BrandWordmark label={content.nav.brand} variant="nav" />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {content.nav.links
              .filter((link) => link.id !== "github")
              .map((link) => (
                <LocalizedLink
                  key={link.id}
                  href={link.href}
                  locale={locale}
                  className="hidden text-sm text-[var(--o-text-secondary)] transition-colors duration-150 hover:text-[var(--o-text)] sm:inline"
                >
                  {link.label}
                </LocalizedLink>
              ))}
            <LanguageSwitcher locale={locale} href="/" />
            <a
              href="https://github.com/7xuanlu/wenlan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={content.nav.githubAriaLabel}
              className="hidden items-center gap-2 text-sm text-[var(--o-text-secondary)] transition-colors duration-150 hover:text-[var(--o-text)] sm:flex"
            >
              <GitHubLogoIcon className="size-5" />
            </a>
            <div className="hidden sm:block">
              <ThemeToggle
                darkLabel={content.nav.themeToggle.darkLabel}
                lightLabel={content.nav.themeToggle.lightLabel}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero: a work-continuation promise paired with labeled, source-readable scenarios. */}
      <section className="relative px-6 pt-28 pb-12 sm:pt-32 lg:pt-24 lg:pb-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="@container min-w-0 lg:col-span-6">
            <p className="animate-fade-up motion-reduce:animate-none text-sm font-medium tracking-wide text-[var(--o-warm)]">
              {redesign.hero.eyebrow}
            </p>
            <h1 className={`animate-fade-up motion-reduce:animate-none delay-100 mt-5 font-serif leading-[1.2] font-medium tracking-tight break-words ${locale === "en" ? "text-[clamp(1.5rem,7.6cqw,3rem)]" : "text-[2.15rem] sm:text-5xl xl:text-[3.5rem]"}`}>
              <span className="block">{redesign.hero.headline.pre}</span>
              <span className="block text-[var(--o-warm)]">{redesign.hero.headline.emphasis}</span>
              {redesign.hero.headline.post}
            </h1>
            <p className="animate-fade-up motion-reduce:animate-none delay-200 mt-6 max-w-lg text-base leading-relaxed text-pretty text-[var(--o-text-secondary)] sm:text-lg">
              {redesign.hero.description}
            </p>
            <div className="animate-fade-up motion-reduce:animate-none delay-200 mt-8 flex flex-wrap items-center gap-4">
              <HomeCta link={content.hero.primaryCta} locale={locale} placement="home-hero" variant="primary" />
              <HomeCta link={content.hero.secondaryCta} locale={locale} placement="home-hero" variant="secondary" />
            </div>
            <div data-hero-tools className="animate-fade-up motion-reduce:animate-none delay-300 mt-8 flex flex-wrap items-center gap-2" aria-label={redesign.hero.worksWithLabel}>
              {worksWithClients.filter(({ id }) => id !== "claude-desktop").map(({ id, label, Icon }) => (
                <a key={id} href="#integrations" aria-label={label} title={label} className="home-tool-mark inline-flex size-11 items-center justify-center rounded-lg text-[var(--o-text-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--o-warm)]">
                  <Icon className="size-6" />
                </a>
              ))}
              <a href="#integrations" aria-label="Obsidian" title="Obsidian" className="home-tool-mark inline-flex size-11 items-center justify-center rounded-lg text-[var(--o-text-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--o-warm)]"><ObsidianBrandIcon className="size-6" /></a>
            </div>
          </div>
          <div className="animate-fade-up motion-reduce:animate-none delay-300 pt-6 lg:col-span-6 lg:pt-0">
            <HeroScenarios locale={locale} />
          </div>
        </div>
      </section>

      <nav
        aria-label={content.nav.links.find((link) => link.id === "learn")?.label}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4">
          {content.hero.metaLinks.map((link) => (
            <TrackedLocalizedLink
              key={link.id}
              href={link.href}
              locale={locale}
              eventName="learn_article_click"
              placement="home-acquisition"
              context="concepts"
              className={`inline-flex min-w-0 items-center gap-2 text-sm font-medium text-[var(--o-text-secondary)] transition-colors duration-150 hover:text-[var(--o-warm)] ${
                link.id === "ai-knowledge-base-tool" ? "w-full sm:w-auto" : ""
              }`}
            >
              <span className="break-keep">{link.label}</span>
              <ArrowRightIcon className="size-4" />
            </TrackedLocalizedLink>
          ))}
        </div>
      </nav>

      <section id="demo" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-[var(--o-border)] shadow-[var(--o-shadow-media)]">
            <div className="relative aspect-video bg-[var(--o-bg-deep)]">
              <DemoVideo
                locale={locale}
                embedUrl={demoVideo.embedUrl}
                posterUrl={demoVideo.posterUrl}
                playLabel={content.demo.playLabel}
                title={content.demo.title}
              />
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[var(--o-text-muted)]">
            {demoCaption(locale)}
          </p>
        </div>
      </section>

      <PainsSection copy={redesign.pains} locale={locale} />

      <section id="integrations" data-home-reveal className="scroll-mt-24 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl whitespace-pre-line font-serif text-3xl font-medium tracking-tight text-balance sm:text-5xl">{integrations.title}</h2>
          <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
            <div data-integration-sources>
              <h3 className="text-xl font-medium">{integrations.sourcesTitle}</h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--o-text-secondary)]">{integrations.sourcesBody}</p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--o-text-secondary)]">
                <span className="inline-flex items-center gap-2"><OpenAiBrandIcon className="size-5 shrink-0" />ChatGPT</span>
                <span className="inline-flex items-center gap-2"><ClaudeBrandIcon className="size-5 shrink-0" />Claude</span>
                <span className="inline-flex items-center gap-2"><ObsidianBrandIcon className="size-5 shrink-0" />Obsidian</span>
              </div>
              <LocalizedLink href="/learn/build-local-ai-knowledge-base-from-documents" locale={locale} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--o-warm)] underline decoration-[var(--o-border)] underline-offset-4 hover:decoration-current">
                {integrations.sourceLink}<ArrowRightIcon className="size-4 shrink-0" />
              </LocalizedLink>
            </div>
            <div data-integration-clients>
              <h3 className="text-xl font-medium">{integrations.clientsTitle}</h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-pretty text-[var(--o-text-secondary)]"><HomeReadableText>{integrations.clientsBody}</HomeReadableText></p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4" aria-label={redesign.hero.worksWithLabel}>
                {worksWithClients.map(({ id, label, Icon }) => (
                  <span key={id} className="inline-flex items-center gap-2 text-sm text-[var(--o-text-secondary)]"><Icon className="size-5 shrink-0" /><span>{label}</span></span>
                ))}
                <a href="https://antigravity.google/docs/mcp" className="inline-flex min-h-11 flex-wrap items-center gap-x-2 text-sm text-[var(--o-text-secondary)] underline decoration-[var(--o-border)] underline-offset-4 hover:decoration-current">
                  <AntigravityBrandIcon className="size-5 shrink-0" /><span>Antigravity</span>
                </a>
              </div>
              <LocalizedLink href="/docs" locale={locale} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--o-warm)] underline decoration-[var(--o-border)] underline-offset-4 hover:decoration-current">
                {integrations.clientsLink}<ArrowRightIcon className="size-4 shrink-0" />
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>

      <PipelineSection copy={redesign.pipeline} solution={content.sections.solution} locale={locale} />
      <ProductShowcase locale={locale} />
      <BentoSection cells={redesign.bento.cells} title={content.sections.features.title} locale={locale} />
      <StorageSection copy={redesign.storage} locale={locale} />

      <section id="retrieval-evidence" data-home-reveal className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-5xl">{content.metrics.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--o-text-secondary)]">{content.metrics.description}</p>
              <p className="mt-4 text-xs leading-relaxed text-[var(--o-text-muted)]">
            {locale === "en" ? "Evaluation snapshot" : locale === "zh-TW" ? "評測快照" : "评测快照"}: <time dateTime="2026-06-24">2026-06-24</time>
            <span className="ml-2">{locale === "en" ? "(published date; exact run time not recorded)" : locale === "zh-TW" ? "（來源記錄日期，未記錄精確執行時間）" : "（来源记录日期，未记录精确执行时间）"}</span>
              </p>
            </div>
            <div className="home-panel rounded-lg border border-[var(--o-border)] bg-[var(--o-bg-alt)] p-6 sm:p-8 lg:col-span-8">
              <div data-retrieval-bars className="space-y-7">
                {redesign.metrics.bars.map((bar) => <MetricBar key={bar.id} label={bar.label} sub={bar.sub} value={bar.value} {...metricBarChrome[bar.id]} />)}
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--o-border-subtle)] pt-5 font-mono text-xs tabular-nums text-[var(--o-text-secondary)]">
                <span><span className="text-[var(--o-text)]">93.6%</span> Recall@5</span>
                <span><span className="text-[var(--o-text)]">0.883</span> NDCG@10</span>
                <span><span className="text-[var(--o-text)]">0.857</span> MRR</span>
              </div>
              <p className="mt-3 text-xs text-[var(--o-text-muted)]">LME_Oracle · CE-reranked · 500 Q</p>
            </div>
          </div>
          <details data-retrieval-details className="group mt-7">
            <summary className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-[var(--o-text-secondary)] focus-visible:outline-2 focus-visible:outline-[var(--o-warm)]"><span aria-hidden="true" className="font-mono text-lg transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>{locale === "en" ? "Full results and test scope" : locale === "zh-TW" ? "完整數據與測試範圍" : "完整数据与测试范围"}</summary>
          <div className="home-panel mt-8 overflow-x-auto rounded-lg border border-[var(--o-border)]" role="region" aria-label={integrations.metricsLink} tabIndex={0}>
            <table className="home-metrics-table w-full min-w-[700px] text-left text-sm">
              <thead className="bg-[var(--o-surface)] text-[var(--o-text-secondary)]">
                <tr><th scope="col" className="px-6 py-5 font-medium">{content.metrics.headers.surface}</th><th scope="col" className="px-6 py-5 font-medium">{content.metrics.headers.scope}</th><th scope="col" className="px-6 py-5 font-medium">{content.metrics.headers.result}</th></tr>
              </thead>
              <tbody>
              {content.metrics.rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--o-border-subtle)]">
                  <th scope="row" className="px-6 py-6 font-medium">{row.surface}</th>
                  <td className="px-6 py-6 text-[var(--o-text-secondary)]">{row.scope}</td>
                  <td className="px-6 py-6 font-mono leading-relaxed text-[var(--o-text)] tabular-nums">{row.result}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 max-w-4xl">
            <p className="text-sm leading-relaxed text-[var(--o-text-secondary)]">{content.metrics.note}</p>
            <a href={content.metrics.link.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--o-warm)] underline underline-offset-4">{content.metrics.link.label}<ArrowRightIcon className="size-4" /></a>
          </div>
          </details>
        </div>
      </section>

      <DownloadSection copy={content.download} locale={locale} />

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-5xl">{content.faqs.title}</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {content.faqs.items.map((faq) => (
              <details key={faq.id} className="group border-b border-[var(--o-border-subtle)]">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left font-serif text-xl font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--o-warm)] [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 text-balance"><HomeReadableText>{faq.q}</HomeReadableText></span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-lg font-normal text-[var(--o-text-muted)] transition-transform duration-150 group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <div className="pb-5 pr-8 text-base leading-relaxed text-[var(--o-text-secondary)]">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA: stands out structurally — a hard rule in the page's own
          ink and an asymmetric split — no glow, no wash. */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mb-4 font-mono text-[12px] tracking-[0.3em] text-[var(--o-warm)] uppercase">
              {cta.eyebrow}
            </p>
            <h2 className="font-serif text-4xl font-medium tracking-tight text-balance sm:text-6xl">
              {locale === "en" ? cta.title : cta.title.split(/(?<=，)/).map((phrase) => <span key={phrase} className="inline-block">{phrase}</span>)}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--o-text-secondary)] sm:text-xl">
              {cta.body}
            </p>
            <p className="mt-3 max-w-lg text-xs leading-relaxed text-[var(--o-text-muted)]"><HomeReadableText>{cta.note}</HomeReadableText></p>
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-[var(--o-border-subtle)] lg:pl-10">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <HomeCta link={cta.primaryCta} locale={locale} placement="home-footer" variant="primary" />
              <HomeCta link={cta.secondaryCta} locale={locale} placement="home-footer" variant="secondary" showGithubIcon />
            </div>
            <div className="mt-9 max-w-md">
              <p className="mb-3 text-sm text-[var(--o-text-muted)]">
                {cta.waitlistHeading}
              </p>
              <WaitlistForm copy={cta.waitlist} locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const demoCaptions: Record<Locale, string> = {
  en: "Recorded product demonstration. It shows one workflow, not proof of every Wenlan workflow.",
  "zh-TW": "錄製的產品示範。影片展示一個工作流程，不代表 Wenlan 的所有工作流程。",
  "zh-CN": "录制的产品演示。视频展示一个工作流程，不代表 Wenlan 的所有工作流程。",
};

function demoCaption(locale: Locale): string {
  return demoCaptions[locale];
}

function HomeCta({
  link,
  locale,
  placement,
  showGithubIcon = false,
  variant,
}: {
  link: LinkContent;
  locale: Locale;
  placement: "home-hero" | "home-footer";
  showGithubIcon?: boolean;
  variant: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "flex items-center gap-2 rounded-xl bg-[var(--o-text)] px-6 py-3 text-sm font-semibold text-[var(--o-bg)] transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98]"
      : "flex items-center gap-2 rounded-xl border border-[var(--o-border)] px-6 py-3 text-sm font-medium text-[var(--o-text-secondary)] transition-all duration-150 hover:border-[var(--o-text-dim)] hover:text-[var(--o-text)]";

  const children = (
    <>
      {showGithubIcon && <GitHubLogoIcon className="size-5" />}
      {link.label}
      {!showGithubIcon && <ArrowRightIcon className="size-4" />}
    </>
  );

  if (isExternalHref(link.href)) {
    return (
      <TrackedLink
        href={link.href}
        eventName="github_outbound"
        placement={placement}
        locale={locale}
        context="home"
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </TrackedLink>
    );
  }

  return (
    <TrackedLocalizedLink
      href={link.href}
      eventName={link.id === "download" ? "setup_path_click" : "get_started_click"}
      placement={placement}
      locale={locale}
      context="home"
      className={className}
    >
      {children}
    </TrackedLocalizedLink>
  );
}

function buildSiteNavigationSchema(locale: Locale, nav: HomeContent["nav"]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: nav.schemaName,
    itemListElement: nav.links.map((link, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: link.label,
      url: isExternalHref(link.href)
        ? link.href
        : `${SITE_URL}${localizedHrefForLocale(locale, link.href) === "/" ? "" : localizedHrefForLocale(locale, link.href)}`,
    })),
  };
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}
