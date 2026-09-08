import { ArrowRightIcon } from "@/components/icons";
import { getCoreContent, type HomeContent } from "@/i18n/content";
import { getWorkflowGuideCopy } from "@/i18n/workflow-guide";
import type { Locale } from "@/i18n/locales";
import { LocalizedLink } from "@/i18n/navigation";

type PainsCopy = HomeContent["redesign"]["pains"];
type Source = PainsCopy["current"]["sources"][number];

const guideLabels = {
  en: {
    eyebrow: "Workflow comparison guide",
    commonHeading: "Wenlan setup, model, and lineage",
    commonIntro: "The shared setup and evidence boundary behind Wenlan’s column.",
    alternativesLabel: "Compare each alternative",
    sourcesLabel: "Sources",
    continueLabel: "Continue with Wenlan",
    getStarted: "Get started",
    reviewAndTrust: "Review and trust",
    backToComparison: "Back to workflow comparison",
  },
  "zh-TW": {
    eyebrow: "工作流程比較指南",
    commonHeading: "Wenlan 的設定、模型與脈絡",
    commonIntro: "Wenlan 欄位背後共用的設定與證據邊界。",
    alternativesLabel: "比較各種替代方式",
    sourcesLabel: "來源",
    continueLabel: "繼續了解 Wenlan",
    getStarted: "開始使用",
    reviewAndTrust: "審查與信任",
    backToComparison: "回到工作流程比較",
  },
  "zh-CN": {
    eyebrow: "工作流比较指南",
    commonHeading: "Wenlan 的配置、模型与脉络",
    commonIntro: "Wenlan 栏位背后共用的配置与证据边界。",
    alternativesLabel: "比较各种替代方式",
    sourcesLabel: "来源",
    continueLabel: "继续了解 Wenlan",
    getStarted: "开始使用",
    reviewAndTrust: "审核与信任",
    backToComparison: "回到工作流比较",
  },
} as const satisfies Record<Locale, {
  eyebrow: string;
  commonHeading: string;
  commonIntro: string;
  alternativesLabel: string;
  sourcesLabel: string;
  continueLabel: string;
  getStarted: string;
  reviewAndTrust: string;
  backToComparison: string;
}>;

function splitNarrative(text: string): string[] {
  const sentences = text.match(/[^.!?。！？]+(?:[.!?。！？]+|$)/g)?.map((part) => part.trim()).filter(Boolean) ?? [text];
  if (sentences.length <= 2) {
    return [text];
  }

  const paragraphs: string[] = [];
  for (let index = 0; index < sentences.length; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(" "));
  }
  return paragraphs;
}

function Narrative({ text, className = "" }: { readonly text: string; readonly className?: string }) {
  return (
    <div className={`space-y-4 text-base leading-relaxed text-[var(--o-text-secondary)] ${className}`}>
      {splitNarrative(text).map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)}
    </div>
  );
}

function SourceLinks({ sources, label }: { readonly sources: readonly Source[]; readonly label: string }) {
  return (
    <div className="mt-6">
      <h4 className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">{label}</h4>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {sources.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-[var(--o-text-secondary)] underline decoration-[var(--o-border)] underline-offset-4 hover:text-[var(--o-warm)] hover:decoration-[var(--o-warm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--o-warm)]"
            >
              {source.label}
              <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 -rotate-45" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChoiceGuidance({
  rowId,
  guideCopy,
}: {
  readonly rowId: string;
  readonly guideCopy: ReturnType<typeof getWorkflowGuideCopy>;
}) {
  const choice = guideCopy.rows[rowId];

  return (
    <dl className="mt-7 space-y-5 border-t border-[var(--o-border)] pt-5">
      <div>
        <dt className="text-sm font-semibold text-[var(--o-warm)]">{guideCopy.setupTitle}</dt>
        <dd className="mt-1 text-sm leading-7 text-[var(--o-text-secondary)]">{choice.setup}</dd>
      </div>
      <div>
        <dt className="text-sm font-semibold text-[var(--o-warm)]">{guideCopy.keepTitle}</dt>
        <dd className="mt-1 text-sm leading-7 text-[var(--o-text-secondary)]">{choice.keep}</dd>
      </div>
      <div>
        <dt className="text-sm font-semibold text-[var(--o-warm)]">{guideCopy.addTitle}</dt>
        <dd className="mt-1 text-sm leading-7 text-[var(--o-text-secondary)]">{choice.add}</dd>
      </div>
    </dl>
  );
}

function LinkList({ locale, labels }: { readonly locale: Locale; readonly labels: typeof guideLabels[Locale] }) {
  return (
    <nav aria-label={labels.continueLabel} className="mt-12 border-t border-[var(--o-border-subtle)] pt-6">
      <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">{labels.continueLabel}</p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <LocalizedLink href="/docs/get-started" locale={locale} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--o-text-secondary)] hover:text-[var(--o-warm)]">
          {labels.getStarted}<ArrowRightIcon className="h-4 w-4" />
        </LocalizedLink>
        <LocalizedLink href="/docs/review-and-trust" locale={locale} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--o-text-secondary)] hover:text-[var(--o-warm)]">
          {labels.reviewAndTrust}<ArrowRightIcon className="h-4 w-4" />
        </LocalizedLink>
        <LocalizedLink href="/#knowledge-workflows" locale={locale} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--o-text-secondary)] hover:text-[var(--o-warm)]">
          {labels.backToComparison}<ArrowRightIcon className="h-4 w-4" />
        </LocalizedLink>
      </div>
    </nav>
  );
}

export function WorkflowComparisonGuide({ locale }: { readonly locale: Locale }) {
  const copy = getCoreContent(locale).home.content.redesign.pains;
  const guideCopy = getWorkflowGuideCopy(locale);
  const labels = guideLabels[locale];
  const rows = copy.generations;

  return (
    <section id="workflow-comparisons" className="scroll-mt-24 px-6 py-16 sm:py-20" data-workflow-guide>
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="font-mono text-[11px] tracking-[0.28em] text-[var(--o-warm)]/80 uppercase">{labels.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-serif text-3xl font-medium tracking-tight text-[var(--o-text)] sm:text-5xl">{guideCopy.title}</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--o-text-secondary)]">{guideCopy.intro}</p>
          <p className="mt-4 text-xs leading-6 text-[var(--o-text-tertiary)]">{copy.sourcesChecked}</p>
        </header>

        <nav aria-label={labels.alternativesLabel} className="mt-8 rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5">
          <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">{labels.alternativesLabel}</p>
          <ol className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {rows.map((row, index) => (
              <li key={row.id}>
                <a href={`#workflow-${row.id}`} className="grid min-h-11 grid-cols-[28px_1fr] items-center gap-2 text-sm leading-relaxed text-[var(--o-text-secondary)] hover:text-[var(--o-warm)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--o-warm)]">
                  <span className="font-mono text-[10px] text-[var(--o-text-dim)]">{(index + 1).toString().padStart(2, "0")}</span>
                  <span>{row.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="workflow-wenlan" className="mt-14 scroll-mt-24 border-t border-[var(--o-border-subtle)] pt-10">
          <p className="font-mono text-[11px] text-[var(--o-warm)]">01</p>
          <h3 className="mt-3 font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">{labels.commonHeading}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--o-text-muted)]">{labels.commonIntro}</p>
          <p className="mt-5 text-base font-medium leading-7 text-[var(--o-text)]">{copy.current.summary}</p>
          <Narrative text={copy.current.body} className="mt-5" />
          <dl className="mt-7 space-y-5 border-t border-[var(--o-border)] pt-5">
            {copy.current.highlights.map((item) => (
              <div key={item.label}>
                <dt className="text-sm font-semibold text-[var(--o-warm)]">{item.label}</dt>
                <dd className="mt-1 text-sm leading-7 text-[var(--o-text-secondary)]">{item.body}</dd>
              </div>
            ))}
          </dl>
          <SourceLinks sources={copy.current.sources} label={labels.sourcesLabel} />
        </section>

        <div className="mt-14 space-y-14">
          {rows.map((row, index) => (
            <section id={`workflow-${row.id}`} key={row.id} className="scroll-mt-24 border-t border-[var(--o-border-subtle)] pt-10">
              <p className="font-mono text-[11px] text-[var(--o-warm)]">{(index + 2).toString().padStart(2, "0")}</p>
              <h3 className="mt-3 font-serif text-3xl font-medium tracking-tight text-[var(--o-text)]">{row.name}</h3>
              <p className="mt-4 text-base font-medium leading-7 text-[var(--o-text)]">{row.summary}</p>
              <ChoiceGuidance rowId={row.id} guideCopy={guideCopy} />
              <a href="#workflow-wenlan" className="mt-5 inline-flex min-h-11 items-center text-sm text-[var(--o-warm)] underline underline-offset-4">
                {labels.commonHeading}
              </a>
              <Narrative text={row.body} className="mt-7" />
              <SourceLinks sources={row.sources} label={labels.sourcesLabel} />
            </section>
          ))}
        </div>

        <LinkList locale={locale} labels={labels} />
      </div>
    </section>
  );
}
