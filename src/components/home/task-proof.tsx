import { LocalizedLink } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locales";

type TaskProofCopy = {
  readonly eyebrow: string;
  readonly title: string;
  readonly intro: string;
  readonly authoredLabel: string;
  readonly stepsLabel: string;
  readonly steps: readonly string[];
  readonly sourcesHeading: string;
  readonly sources: readonly { readonly label: string; readonly detail: string }[];
  readonly answerLabel: string;
  readonly answer: string;
  readonly unresolvedLabel: string;
  readonly unresolved: string;
  readonly checkLabel: string;
  readonly checkBody: string;
  readonly guideLabel: string;
};

const copy: Record<Locale, TaskProofCopy> = {
  en: {
    eyebrow: "Illustrative task",
    title: "Three notes, one answer you can re-check.",
    intro: "A small example of what a source-backed page can preserve across sessions.",
    authoredLabel: "Authored illustrative reference · no real product output",
    stepsLabel: "Example path",
    steps: ["Collect three source notes", "Link them into a page", "Check what changed"],
    sourcesHeading: "Source notes",
    sources: [
      { label: "api-v1.md", detail: "API retry rule" },
      { label: "decision-07.md", detail: "Client decision" },
      { label: "runbook-v1.md", detail: "Logging and timeouts" },
    ],
    answerLabel: "Linked wiki answer",
    answer: "Retry failed GET requests up to 3 times [1][2]; never retry POST automatically [1][2].",
    unresolvedLabel: "Still open",
    unresolved: "Timeout not specified. [3]",
    checkLabel: "Trace it back",
    checkBody: "Check each claim against its sources; missing details remain unresolved.",
    guideLabel: "Read the worked example",
  },
  "zh-TW": {
    eyebrow: "示意任務",
    title: "三則筆記，一個可以重新查證的答案。",
    intro: "一個來源可追溯頁面的簡短示意：跨工作階段保留脈絡。",
    authoredLabel: "作者撰寫的示意參考・沒有真實產品輸出",
    stepsLabel: "示意路徑",
    steps: ["收集三則來源筆記", "將它們連成一頁", "確認哪些內容改變"],
    sourcesHeading: "來源筆記",
    sources: [
      { label: "api-v1.md", detail: "API 重試規則" },
      { label: "decision-07.md", detail: "客戶決策" },
      { label: "runbook-v1.md", detail: "記錄與逾時" },
    ],
    answerLabel: "連結後的 wiki 答案",
    answer: "失敗的 GET 請求最多重試 3 次 [1][2]；不要自動重試 POST [1][2]。",
    unresolvedLabel: "仍待確認",
    unresolved: "未指定逾時時間。 [3]",
    checkLabel: "回溯來源",
    checkBody: "依據可回查；缺少的資訊標為待確認。",
    guideLabel: "閱讀完整示例",
  },
  "zh-CN": {
    eyebrow: "示意任务",
    title: "三条笔记，一个可以重新核对的答案。",
    intro: "一个来源可追溯页面的简短示意：在不同工作阶段保留上下文。",
    authoredLabel: "作者撰写的示意参考・没有真实产品输出",
    stepsLabel: "示意路径",
    steps: ["收集三条来源笔记", "将它们连接成一页", "确认哪些内容发生变化"],
    sourcesHeading: "来源笔记",
    sources: [
      { label: "api-v1.md", detail: "API 重试规则" },
      { label: "decision-07.md", detail: "客户决策" },
      { label: "runbook-v1.md", detail: "日志与超时" },
    ],
    answerLabel: "链接后的 wiki 答案",
    answer: "失败的 GET 请求最多重试 3 次 [1][2]；不要自动重试 POST [1][2]。",
    unresolvedLabel: "仍待确认",
    unresolved: "未指定超时时间。 [3]",
    checkLabel: "回溯来源",
    checkBody: "依据可回查；缺少的信息标为待确认。",
    guideLabel: "阅读完整示例",
  },
};

export function TaskProof({ locale }: { locale: Locale }) {
  const task = copy[locale];

  return (
    <section
      aria-labelledby="task-proof-title"
      className="relative mx-auto w-full max-w-[34rem] pt-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] text-[var(--o-warm)] uppercase">
            {task.eyebrow}
          </p>
          <h2 id="task-proof-title" className="mt-3 max-w-md font-serif text-2xl leading-tight font-medium text-balance sm:text-3xl">
            {task.title}
          </h2>
          <p className="mt-2 font-mono text-[10px] leading-snug tracking-wide text-[var(--o-text-muted)] uppercase">
            {task.authoredLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--o-text-muted)] uppercase">
            {task.sourcesHeading}
          </p>
          <ul className="mt-3 space-y-2">
            {task.sources.map((source, index) => (
              <li key={source.label} className="flex items-baseline gap-2 text-sm">
                <span className="font-mono text-[10px] text-[var(--o-text-muted)]">[{index + 1}]</span>
                <span className="min-w-0">
                  <code className="block break-words text-sm text-[var(--o-text)]">{source.label}</code>
                  <span className="mt-1 block text-xs leading-relaxed text-[var(--o-text-muted)]">{source.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-l border-[var(--o-border-subtle)] pl-5">
          <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--o-text-muted)] uppercase">
            {task.answerLabel}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--o-text)]">
            {task.answer.split(/(?<=[;；])\s*/).map((clause, clauseIndex) => (
              <span key={`clause-${clauseIndex}`} className="block">
                {clause.split(/(\[\d+\](?:\[\d+\])*)/g).map((part, index) =>
                  /^\[\d+\](?:\[\d+\])*$/.test(part) ? (
                    <span key={`citation-${index}`} className="whitespace-nowrap">
                      {part}
                    </span>
                  ) : (
                    part
                  ),
                )}
              </span>
            ))}
          </p>
          <p className="mt-4 text-sm text-[var(--o-text-muted)]">
            <span className="font-mono text-[10px] tracking-wide uppercase">{task.unresolvedLabel}: </span>
            {task.unresolved}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3 pt-4 text-sm leading-relaxed text-[var(--o-text-secondary)]">
        <p>
          <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--o-warm)] uppercase">{task.checkLabel}: </span>
          {task.checkBody}
        </p>
        <LocalizedLink
          href="/learn/distilled-wiki-pages-ai-memory#worked-example"
          locale={locale}
          className="inline-flex font-medium text-[var(--o-text)] underline decoration-[var(--o-warm)]/60 underline-offset-4 transition-colors hover:text-[var(--o-warm)]"
        >
          {task.guideLabel}
        </LocalizedLink>
      </div>
    </section>
  );
}
