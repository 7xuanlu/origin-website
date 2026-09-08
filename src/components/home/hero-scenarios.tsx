"use client";

import { useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { LocalizedLink } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locales";

type ScenarioId = "engineering" | "client" | "learning";

type ScenarioSource = {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly excerpt: string;
};

type Scenario = {
  readonly id: ScenarioId;
  readonly tabLabel: string;
  readonly title: string;
  readonly capturedLabel: string;
  readonly captured: string;
  readonly questionLabel: string;
  readonly question: string;
  readonly nextStepLabel: string;
  readonly nextStep: string;
  readonly sentenceSources: readonly (readonly number[])[];
  readonly sourcesLabel: string;
  readonly sourcesHint: string;
  readonly sources: readonly ScenarioSource[];
};

type HeroScenariosCopy = {
  readonly sectionLabel: string;
  readonly eyebrow: string;
  readonly disclaimer: string;
  readonly tablistLabel: string;
  readonly citationLabel: string;
  readonly sourceExcerptLabel: string;
  readonly workedExampleLabel: string;
  readonly scenes: readonly Scenario[];
};

const workedExampleHref = "/learn/distilled-wiki-pages-ai-memory#worked-example";

const copy: Record<Locale, HeroScenariosCopy> = {
  en: {
    sectionLabel: "Source-backed scenario view",
    eyebrow: "Illustrative scenarios",
    disclaimer: "Illustrative workflow · not live product output",
    tablistLabel: "Choose an illustrative scenario",
    citationLabel: "Jump to supplied source",
    sourceExcerptLabel: "Supplied excerpt",
    workedExampleLabel: "Read the worked example",
    scenes: [
      {
        id: "engineering",
        tabLabel: "Engineering",
        title: "API retry policy",
        capturedLabel: "Previously",
        captured: "We already confirmed that reads and writes need different retry rules.",
        questionLabel: "This time",
        question: "This request failed. How should we retry it?",
        nextStepLabel: "Build on it",
        nextStep:
          "Retry failed GET requests up to 3 times; never retry POST automatically. The timeout boundary is still unspecified.",
        sentenceSources: [[1, 2], [3]],
        sourcesLabel: "Trace the sources",
        sourcesHint: "Expand to read the excerpts",
        sources: [
          {
            id: "api-v1",
            label: "api-v1.md",
            detail: "API retry rule",
            excerpt: "GET requests may be retried up to 3 times; POST requests must not be retried automatically.",
          },
          {
            id: "decision-07",
            label: "decision-07.md",
            detail: "Client decision",
            excerpt: "Treat idempotent reads and writes differently when recovering from a transient failure.",
          },
          {
            id: "runbook-v1",
            label: "runbook-v1.md",
            detail: "Logging and timeouts",
            excerpt: "Record timeout behavior in the runbook; this note does not specify a timeout duration.",
          },
        ],
      },
      {
        id: "client",
        tabLabel: "Client / project",
        title: "Client delivery scope",
        capturedLabel: "Previously",
        captured: "Phase one covers sign-in and payments; data export is a separate discussion.",
        questionLabel: "This time",
        question: "The client asked about data export again. Did we promise it?",
        nextStepLabel: "Build on it",
        nextStep: "Not committed yet. Treat export as new scope; confirm the boundary and delivery window first.",
        sentenceSources: [[2], [1, 3]],
        sourcesLabel: "Trace the sources",
        sourcesHint: "Expand to read the excerpts",
        sources: [
          {
            id: "scope-v2",
            label: "scope-v2.md",
            detail: "Scope boundary",
            excerpt: "Phase one includes sign-in and payments; data export is outside this scope.",
          },
          {
            id: "meeting-notes",
            label: "meeting-notes.md",
            detail: "Meeting note",
            excerpt: "The client asked whether data export could be added; delivery is not confirmed.",
          },
          {
            id: "decision-log",
            label: "decision-log.md",
            detail: "Decision log",
            excerpt: "New scope needs the project owner’s approval; delivery timing for the added item is not decided.",
          },
        ],
      },
      {
        id: "learning",
        tabLabel: "Learning / research",
        title: "Comparing research methods",
        capturedLabel: "Previously",
        captured: "The last comparison used different question sets for the two search tests.",
        questionLabel: "This time",
        question: "Which of these two methods fits our work better?",
        nextStepLabel: "Build on it",
        nextStep: "We cannot rank them yet. Keep the question-set difference visible, then retest with the same questions.",
        sentenceSources: [[3], [1, 2]],
        sourcesLabel: "Trace the sources",
        sourcesHint: "Expand to read the excerpts",
        sources: [
          {
            id: "search-test-a",
            label: "search-test-a.md",
            detail: "Search test A",
            excerpt: "This test only used exact keywords that appeared in the source text.",
          },
          {
            id: "search-test-b",
            label: "search-test-b.md",
            detail: "Search test B",
            excerpt: "This test only used rephrased queries and did not use test A’s question set.",
          },
          {
            id: "comparison-notes",
            label: "comparison-notes.md",
            detail: "Comparison note",
            excerpt: "The two tests did not control for question-set differences, so do not judge one method better yet.",
          },
        ],
      },
    ],
  },
  "zh-TW": {
    sectionLabel: "有來源依據的情境檢視",
    eyebrow: "示意情境",
    disclaimer: "流程示意，非即時產品輸出",
    tablistLabel: "選擇示意情境",
    citationLabel: "跳至提供的來源",
    sourceExcerptLabel: "提供的摘錄",
    workedExampleLabel: "閱讀完整示例",
    scenes: [
      {
        id: "engineering",
        tabLabel: "工程",
        title: "API 重試規則",
        capturedLabel: "上次留下",
        captured: "上次已確認讀取與寫入要用不同的重試規則。",
        questionLabel: "這次要做",
        question: "這次請求失敗，該怎麼重試？",
        nextStepLabel: "接著往前",
        nextStep: "失敗的 GET 請求最多重試 3 次；不要自動重試 POST。逾時邊界仍未指定。",
        sentenceSources: [[1, 2], [3]],
        sourcesLabel: "回查來源",
        sourcesHint: "展開閱讀原文",
        sources: [
          {
            id: "api-v1",
            label: "api-v1.md",
            detail: "API 重試規則",
            excerpt: "GET 請求最多可以重試 3 次；POST 請求不得自動重試。",
          },
          {
            id: "decision-07",
            label: "decision-07.md",
            detail: "客戶端決定",
            excerpt: "從暫時性失敗復原時，應區分具冪等性的讀取與寫入。",
          },
          {
            id: "runbook-v1",
            label: "runbook-v1.md",
            detail: "記錄與逾時",
            excerpt: "在 runbook 記錄逾時行為；這則筆記沒有指定逾時長度。",
          },
        ],
      },
      {
        id: "client",
        tabLabel: "客戶／專案",
        title: "客戶交付範圍",
        capturedLabel: "上次留下",
        captured: "第一期只做登入與付款，資料匯出另議。",
        questionLabel: "這次要做",
        question: "客戶又問資料匯出，我們答應過嗎？",
        nextStepLabel: "接著往前",
        nextStep: "尚未承諾。將匯出列為新增需求，先確認範圍與交期。",
        sentenceSources: [[2], [1, 3]],
        sourcesLabel: "回查來源",
        sourcesHint: "展開閱讀原文",
        sources: [
          {
            id: "scope-v2",
            label: "scope-v2.md",
            detail: "範圍界線",
            excerpt: "第一期包含登入與付款；資料匯出不在這次範圍。",
          },
          {
            id: "meeting-notes",
            label: "meeting-notes.md",
            detail: "會議筆記",
            excerpt: "客戶詢問能否加入資料匯出，目前沒有確認交付。",
          },
          {
            id: "decision-log",
            label: "decision-log.md",
            detail: "決策記錄",
            excerpt: "新增範圍需專案負責人確認；新增項目的交期尚未決定。",
          },
        ],
      },
      {
        id: "learning",
        tabLabel: "學習／研究",
        title: "研究方法比較",
        capturedLabel: "上次留下",
        captured: "上次比較時，兩份搜尋測試使用了不同題組。",
        questionLabel: "這次要做",
        question: "這兩套方法，哪一套比較適合我們？",
        nextStepLabel: "接著往前",
        nextStep: "目前不能直接排名。先保留題組差異，再用同一組問題重測。",
        sentenceSources: [[3], [1, 2]],
        sourcesLabel: "回查來源",
        sourcesHint: "展開閱讀原文",
        sources: [
          {
            id: "search-test-a",
            label: "search-test-a.md",
            detail: "搜尋測試 A",
            excerpt: "這次只測原文中出現的精確關鍵字。",
          },
          {
            id: "search-test-b",
            label: "search-test-b.md",
            detail: "搜尋測試 B",
            excerpt: "這次只測換個說法的查詢，未使用測試 A 的題組。",
          },
          {
            id: "comparison-notes",
            label: "comparison-notes.md",
            detail: "比較筆記",
            excerpt: "兩份測試未控制題組差異，暫不判定方法優劣。",
          },
        ],
      },
    ],
  },
  "zh-CN": {
    sectionLabel: "有来源依据的情境查看",
    eyebrow: "示意情境",
    disclaimer: "流程示意，非实时产品输出",
    tablistLabel: "选择示意情境",
    citationLabel: "跳至提供的来源",
    sourceExcerptLabel: "提供的摘录",
    workedExampleLabel: "阅读完整示例",
    scenes: [
      {
        id: "engineering",
        tabLabel: "工程",
        title: "API 重试规则",
        capturedLabel: "上次留下",
        captured: "上次已经确认读取和写入要使用不同的重试规则。",
        questionLabel: "这次要做",
        question: "这次请求失败，该怎么重试？",
        nextStepLabel: "接着往前",
        nextStep: "失败的 GET 请求最多重试 3 次；不要自动重试 POST。超时边界仍未指定。",
        sentenceSources: [[1, 2], [3]],
        sourcesLabel: "回查来源",
        sourcesHint: "展开阅读原文",
        sources: [
          {
            id: "api-v1",
            label: "api-v1.md",
            detail: "API 重试规则",
            excerpt: "GET 请求最多可以重试 3 次；POST 请求不得自动重试。",
          },
          {
            id: "decision-07",
            label: "decision-07.md",
            detail: "客户端决定",
            excerpt: "从暂时性失败恢复时，应区分幂等的读取和写入。",
          },
          {
            id: "runbook-v1",
            label: "runbook-v1.md",
            detail: "日志与超时",
            excerpt: "在 runbook 中记录超时行为；这条笔记没有指定超时时长。",
          },
        ],
      },
      {
        id: "client",
        tabLabel: "客户／项目",
        title: "客户交付范围",
        capturedLabel: "上次留下",
        captured: "第一期只做登录和付款，数据导出另议。",
        questionLabel: "这次要做",
        question: "客户又问数据导出，我们答应过吗？",
        nextStepLabel: "接着往前",
        nextStep: "尚未承诺。将导出列为新增需求，先确认范围与交付时间。",
        sentenceSources: [[2], [1, 3]],
        sourcesLabel: "回查来源",
        sourcesHint: "展开阅读原文",
        sources: [
          {
            id: "scope-v2",
            label: "scope-v2.md",
            detail: "范围界线",
            excerpt: "第一期包含登录和付款；数据导出不在这次范围。",
          },
          {
            id: "meeting-notes",
            label: "meeting-notes.md",
            detail: "会议笔记",
            excerpt: "客户询问能否加入数据导出，目前没有确认交付。",
          },
          {
            id: "decision-log",
            label: "decision-log.md",
            detail: "决策记录",
            excerpt: "新增范围需项目负责人确认；新增项目的交付时间尚未决定。",
          },
        ],
      },
      {
        id: "learning",
        tabLabel: "学习／研究",
        title: "研究方法比较",
        capturedLabel: "上次留下",
        captured: "上次比较时，两套搜索测试使用了不同的题组。",
        questionLabel: "这次要做",
        question: "这两套方法，哪一套更适合我们？",
        nextStepLabel: "接着往前",
        nextStep: "目前不能直接排名。先保留题组差异，再用同一组问题重测。",
        sentenceSources: [[3], [1, 2]],
        sourcesLabel: "回查来源",
        sourcesHint: "展开阅读原文",
        sources: [
          {
            id: "search-test-a",
            label: "search-test-a.md",
            detail: "搜索测试 A",
            excerpt: "这次只测原文中出现的精确关键词。",
          },
          {
            id: "search-test-b",
            label: "search-test-b.md",
            detail: "搜索测试 B",
            excerpt: "这次只测换个说法的查询，未使用测试 A 的题组。",
          },
          {
            id: "comparison-notes",
            label: "comparison-notes.md",
            detail: "比较笔记",
            excerpt: "两份测试未控制题组差异，暂不判定方法优劣。",
          },
        ],
      },
    ],
  },
};

function sourceAnchorId(prefix: string, sceneId: ScenarioId, sourceId: string): string {
  return `${prefix}-${sceneId}-source-${sourceId}`;
}

// Number references by their first appearance in the answer, not input-file order.
// Keep the source IDs unchanged so each claim still opens its original evidence.
function sourcesInCitationOrder(scene: Scenario): readonly ScenarioSource[] {
  return [...new Set(scene.sentenceSources.flat())].map((number) => scene.sources[number - 1]);
}

const answerHighlights: Record<Locale, Record<ScenarioId, readonly string[]>> = {
  en: { engineering: ["GET requests", "3 times", "never retry POST"], client: ["Not committed yet."], learning: ["cannot rank them yet."] },
  "zh-TW": { engineering: ["GET 請求", "重試 3 次", "不要自動重試 POST"], client: ["尚未承諾"], learning: ["不能直接排名", "同一組問題"] },
  "zh-CN": { engineering: ["GET 请求", "重试 3 次", "不要自动重试 POST"], client: ["尚未承诺"], learning: ["不能直接排名", "同一组问题"] },
};

const cjkWordSegmenter = new Intl.Segmenter("zh", { granularity: "word" });

function SourceExcerpt({ text, locale }: { text: string; locale: Locale }) {
  if (locale === "en") return text;
  return Array.from(cjkWordSegmenter.segment(text), ({ segment, index, isWordLike }) =>
    isWordLike ? <span key={index} className="whitespace-nowrap">{segment}</span> : segment);
}

function ScenarioAnswer({ scene, locale, idPrefix, citationLabel }: {
  scene: Scenario; locale: Locale; idPrefix: string; citationLabel: string;
}) {
  const orderedSources = sourcesInCitationOrder(scene);
  const highlights = answerHighlights[locale][scene.id].map((phrase) => phrase.replace(/[.!?。！？]$/u, ""));
  const matcher = new RegExp(`(${highlights.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return scene.nextStep.split(/(?<=[.!?。！？])\s*/u).filter(Boolean).map((sentence, sentenceIndex) => {
    const body = sentence.replace(/[.!?。！？]$/u, "");
    const punctuation = sentence.slice(body.length);
    return (
    <span key={sentenceIndex} data-answer-sentence className={locale !== "en" && sentence.length <= 14 ? "whitespace-nowrap" : undefined}>
      {sentenceIndex > 0 && locale === "en" ? " " : null}
      {body.split(matcher).map((part, index) => highlights.includes(part)
        ? <span key={index} className="whitespace-nowrap font-medium text-[var(--o-warm)]">{part}</span>
        : <SourceExcerpt key={index} text={part} locale={locale} />)}
      {"\u2060"}
      <sup className="relative -top-[0.3em] whitespace-nowrap align-baseline text-[0.75em] leading-none">
        {scene.sentenceSources[sentenceIndex].map((sourceNumber) => {
          const source = scene.sources[sourceNumber - 1];
          const number = orderedSources.findIndex((item) => item.id === source.id) + 1;
          return (
            <a
              key={source.id}
              href={`#${sourceAnchorId(idPrefix, scene.id, source.id)}`}
              data-source-number={number}
              onClick={(event) => {
                event.preventDefault();
                const sourceElement = document.getElementById(sourceAnchorId(idPrefix, scene.id, source.id));
                if (sourceElement instanceof HTMLDetailsElement) {
                  sourceElement.open = true;
                  sourceElement.querySelector("summary")?.focus({ preventScroll: true });
                  sourceElement.scrollIntoView({ block: "nearest" });
                }
              }}
              className="home-scenario-citation rounded-sm px-px font-mono text-[var(--o-warm)] first:pl-0 last:pr-0 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--o-warm)]"
              aria-label={`[${number}] ${citationLabel}: ${source.label}`}
            >[{number}]</a>
          );
        })}
      </sup>
      {punctuation}
    </span>
    );
  });
}

export function HeroScenarios({ locale }: { readonly locale: Locale }) {
  const strings = copy[locale];
  const idPrefix = useId().replaceAll(":", "");
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function selectScene(index: number, focus = true) {
    const nextIndex = (index + strings.scenes.length) % strings.scenes.length;
    setActiveIndex(nextIndex);
    if (focus) {
      tabRefs.current[nextIndex]?.focus();
    }
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        selectScene(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        selectScene(index - 1);
        break;
      case "Home":
        event.preventDefault();
        selectScene(0);
        break;
      case "End":
        event.preventDefault();
        selectScene(strings.scenes.length - 1);
        break;
    }
  }

  return (
    <section
      aria-label={strings.sectionLabel}
      data-hero-scenarios="true"
      className="w-full max-w-[38rem] font-sans"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <p className="font-mono text-xs tracking-[0.18em] text-[var(--o-warm)] uppercase">{strings.eyebrow}</p>
        <p className="text-xs leading-relaxed text-[var(--o-text-muted)]">{strings.disclaimer}</p>
      </div>

      <div
        role="tablist"
        aria-label={strings.tablistLabel}
        className="home-scenario-tabs relative mt-4 grid grid-cols-3 rounded-lg bg-[var(--o-bg-alt)] p-1"
        style={{ "--active-scene": activeIndex } as CSSProperties}
      >
        <span aria-hidden="true" className="home-scenario-tab-indicator pointer-events-none absolute bottom-1 left-1 top-1 rounded-md" />
        {strings.scenes.map((scene, index) => {
          const selected = index === activeIndex;
          const tabId = `${idPrefix}-tab-${scene.id}`;
          const panelId = `${idPrefix}-panel-${scene.id}`;
          return (
            <button
              key={scene.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-controls={panelId}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectScene(index, false)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`relative min-h-11 rounded-md px-2 py-2 text-center text-sm leading-tight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--o-warm)] motion-reduce:transition-none sm:px-3 ${
                selected
                  ? "font-medium text-[var(--o-text)]"
                  : "text-[var(--o-text-muted)] hover:text-[var(--o-text-secondary)]"
              }`}
            >
              {scene.tabLabel}
            </button>
          );
        })}
      </div>

      <div className="relative mt-3">
        {strings.scenes.map((scene, index) => {
          const selected = index === activeIndex;
          const tabId = `${idPrefix}-tab-${scene.id}`;
          const panelId = `${idPrefix}-panel-${scene.id}`;
          return (
            <article
              key={scene.id}
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId}
              aria-hidden={!selected}
              inert={!selected}
              data-scene-id={scene.id}
              className={`home-scenario-panel w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                selected
                  ? "relative translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-x-0 top-0 translate-y-1 opacity-0"
              }`}
            >
              <div className="home-panel rounded-lg border border-[var(--o-border)] bg-[var(--o-bg-alt)] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--o-text-muted)]">
                  <p>{scene.title}</p>
                </div>
                <h2 className="mt-2 text-[1.25rem] leading-[1.45] font-medium tracking-tight text-pretty text-[var(--o-text)] sm:text-[1.4rem]">
                  {scene.question}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-[var(--o-text-muted)]">
                  {scene.captured}
                </p>

                <div className="home-scenario-answer mt-3 border-t border-[var(--o-border-subtle)] pt-3">
                  <p className="text-xs font-medium text-[var(--o-warm)]">{scene.nextStepLabel}</p>
                  <p className="mt-1.5 text-sm leading-[1.7] text-pretty text-[var(--o-text)]">
                    <ScenarioAnswer scene={scene} locale={locale} idPrefix={idPrefix} citationLabel={strings.citationLabel} />
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-sm font-medium text-[var(--o-text)]">{scene.sourcesLabel}</p>
                  <div className="home-scenario-sources">
                    {sourcesInCitationOrder(scene).map((source, sourceIndex) => {
                      const anchorId = sourceAnchorId(idPrefix, scene.id, source.id);
                      return (
                        <details
                          key={source.id}
                          id={anchorId}
                          name={`${idPrefix}-${scene.id}-sources`}
                          className="home-scenario-source group scroll-mt-24 rounded-md px-2 transition-colors motion-reduce:transition-none"
                        >
                          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-2 text-sm text-[var(--o-text-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--o-warm)] [&::-webkit-details-marker]:hidden">
                            <span className="flex min-w-0 items-start gap-2">
                              <span className="pt-0.5 font-mono text-xs text-[var(--o-warm)]">[{sourceIndex + 1}]</span>
                              <span className="min-w-0">
                                <code className="break-words text-xs text-[var(--o-text)] sm:text-sm">{source.label}</code>
                                <span className="ml-2 inline-block text-xs text-[var(--o-text-muted)]">{source.detail}</span>
                              </span>
                            </span>
                            <span className="shrink-0 text-lg leading-none text-[var(--o-text-muted)] transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true">
                              +
                            </span>
                          </summary>
                          <blockquote className="home-scenario-excerpt pb-4 pl-6 pr-2 text-sm leading-relaxed text-[var(--o-text-secondary)]">
                            <span className="mb-1 block text-xs text-[var(--o-warm)]">
                              {strings.sourceExcerptLabel}
                            </span>
                            <SourceExcerpt text={source.excerpt} locale={locale} />
                          </blockquote>
                        </details>
                      );
                    })}
                  </div>
                </div>

                {scene.id === "engineering" && <LocalizedLink
                  href={workedExampleHref}
                  locale={locale}
                  className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-[var(--o-text)] underline decoration-[var(--o-warm)]/60 underline-offset-4 transition-colors hover:text-[var(--o-warm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--o-warm)]"
                >
                  {strings.workedExampleLabel}
                </LocalizedLink>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
