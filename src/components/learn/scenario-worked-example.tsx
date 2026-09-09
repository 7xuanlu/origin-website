import type { ReactNode } from "react";
import type { ScenarioPacket } from "@/lib/scenario-examples";
import type { Locale } from "@/i18n/locales";
import { EvidenceImage } from "./evidence-image";

type ScenarioWorkedExampleProps = {
  packet: ScenarioPacket;
  locale: Locale;
};

const labels = {
  en: {
    eyebrow: "Worked example",
    task: "Try this task",
    expected: "Expected reasoning",
    comparison: "Why keep this connected",
    review: "Review boundary",
    sources: "Source files",
    sourceHint: "Open a file to read its complete authored Markdown.",
    reference: "Reference answer",
    changed: "Changed source",
    changeExpected: "Expected update after this change",
    download: "Download this example",
    dataset: "The source files are the same authored English dataset in all three locale views.",
  },
  "zh-TW": {
    eyebrow: "完整示範",
    task: "試做這個任務",
    expected: "預期推理",
    comparison: "為什麼要保持這些內容連結",
    review: "審查邊界",
    sources: "來源檔案",
    sourceHint: "打開檔案即可閱讀完整的人工編寫 Markdown。",
    reference: "參考答案",
    changed: "變更後的來源",
    changeExpected: "這項變更後的預期更新",
    download: "下載這個範例",
    dataset: "三種語言檢視使用相同的人工編寫英文來源資料集。",
  },
  "zh-CN": {
    eyebrow: "完整示例",
    task: "试做这个任务",
    expected: "预期推理",
    comparison: "为什么要保持这些内容关联",
    review: "审核边界",
    sources: "来源文件",
    sourceHint: "打开文件即可阅读完整的人工编写 Markdown。",
    reference: "参考答案",
    changed: "变更后的来源",
    changeExpected: "这项变更后的预期更新",
    download: "下载这个示例",
    dataset: "三种语言视图使用相同的人工编写英文来源数据集。",
  },
} as const satisfies Record<Locale, {
  eyebrow: string;
  task: string;
  expected: string;
  comparison: string;
  review: string;
  sources: string;
  sourceHint: string;
  reference: string;
  changed: string;
  changeExpected: string;
  download: string;
  dataset: string;
}>;

const proofLabels = {
  en: {
    title: "Inspect the example in Wenlan",
    context: "Wenlan v0.18.3 interface displaying data read back from an isolated test run. The sources are fictional and the reference answer was written for this exercise. No automatic AI generation or approval is shown.",
    page: "The reference page still contains the original answer and links to its three sources.",
    source: "Following the citation opens the changed source. Compare it with the answer that still needs review.",
    observed: "After the cited source changed, Wenlan marked the page as out of date and kept its original text. The ‘updating…’ label indicates a pending rebuild here; it does not show a completed correction. Review the changed source before rebuilding and accepting a new answer.",
  },
  "zh-TW": {
    title: "在 Wenlan 裡查看這個範例",
    context: "Wenlan v0.18.3 介面，呈現隔離測試後讀回的資料。來源是虛構教學資料，參考答案為這次練習人工編寫；畫面沒有展示 AI 自動生成或審批完成。",
    page: "參考頁仍保留原本答案，並連結到三份來源。",
    source: "點進引用後，可看到變更後的來源，對照仍待審查的答案。",
    observed: "引用的來源變更後，Wenlan 將頁面標記為過期，正文仍保留原文。這裡的「updating…」表示等待重建，不代表已完成修正。請先檢查變更的來源，再重建並審查新答案。",
  },
  "zh-CN": {
    title: "在 Wenlan 中查看这个示例",
    context: "Wenlan v0.18.3 界面，呈现隔离测试后读回的数据。来源是虚构教学数据，参考答案为这次练习人工编写；画面没有展示 AI 自动生成或审批完成。",
    page: "参考页仍保留原来的答案，并关联到三份来源。",
    source: "点击引用后，可以看到变更后的来源，对照仍待审核的答案。",
    observed: "引用的来源变更后，Wenlan 将页面标记为过期，正文仍保留原文。这里的「updating…」表示等待重建，不代表已完成修正。请先检查变更的来源，再重建并审核新答案。",
  },
} as const;

type ReferenceBlock =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; lines: string[] }
  | { kind: "list"; items: string[] };

function parseReference(markdown: string): ReferenceBlock[] {
  const blocks: ReferenceBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: "paragraph", lines: paragraph });
      paragraph = [];
    }
};

  const flushList = () => {
    if (list.length > 0) {
      blocks.push({ kind: "list", items: list });
      list = [];
    }
  };

  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "heading", level: heading[1].length, text: heading[2] });
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      list.push(bullet[1]);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return blocks;
}

function sourceAnchor(filename: string, index: number): string {
  const safeName = filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `scenario-source-${index + 1}-${safeName || "file"}`;
}

function renderInline(
  text: string,
  anchors: ReadonlyMap<string, string>,
  keyPrefix: string,
): ReactNode[] {
  const parts: ReactNode[] = [];
  const citationPattern = /\[\[([^\]]+)\]\]/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = citationPattern.exec(text)) !== null) {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index));
    }

    const filename = match[1];
    const anchor = anchors.get(filename);
    parts.push(
      anchor ? (
        <a
          key={`${keyPrefix}-${match.index}`}
          href={`#${anchor}`}
          className="break-words font-mono text-[var(--o-warm)] underline decoration-[var(--o-warm)]/50 underline-offset-4 hover:decoration-[var(--o-warm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--o-warm)]"
        >
          {filename}
        </a>
      ) : (
        match[0]
      ),
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

function ReferenceContent({
  markdown,
  anchors,
}: {
  readonly markdown: string;
  readonly anchors: ReadonlyMap<string, string>;
}) {
  return (
    <div className="space-y-5 text-sm leading-relaxed text-[var(--o-text-secondary)]">
      {parseReference(markdown).map((block, index) => {
        if (block.kind === "heading") {
          const Heading = block.level <= 2 ? "h3" : "h4";
          return (
            <Heading
              key={`heading-${index}`}
              className="font-serif text-xl font-medium tracking-tight text-[var(--o-text)]"
            >
              {renderInline(block.text, anchors, `heading-${index}`)}
            </Heading>
          );
        }

        if (block.kind === "list") {
          return (
            <ul key={`list-${index}`} className="list-disc space-y-2 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={`item-${itemIndex}`}>
                  {renderInline(item, anchors, `list-${index}-${itemIndex}`)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`paragraph-${index}`}>
            {block.lines.map((line, lineIndex) => (
              <span key={`line-${lineIndex}`}>
                {lineIndex > 0 && " "}
                {renderInline(line, anchors, `paragraph-${index}-${lineIndex}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function ScenarioWorkedExample({ packet, locale }: ScenarioWorkedExampleProps) {
  const copy = labels[locale];
  const localized = packet.locales[locale];
  const proof = proofLabels[locale];
  const sourceAnchors = new Map(
    packet.sources.map((source, index) => [source.filename, sourceAnchor(source.filename, index)]),
  );
  const changeAnchor = `scenario-change-${packet.id}`;

  return (
    <section
      id="product-evidence"
      aria-labelledby="product-evidence-heading"
      className="scroll-mt-24 px-6 pb-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.28em] text-[var(--o-warm)]/80 uppercase">
            {copy.eyebrow}
          </p>
          <h2
            id="product-evidence-heading"
            className="mt-4 font-serif text-3xl font-medium tracking-tight text-[var(--o-text)] sm:text-4xl"
          >
            {localized.title}
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-[var(--o-text-secondary)]">
            {localized.intro}
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
          <div className="rounded-2xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-6 sm:p-8">
            <h3 className="font-serif text-2xl font-medium tracking-tight text-[var(--o-text)]">
              {copy.task}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-[var(--o-text-secondary)]">
              {localized.task}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--o-warm)]/35 bg-[var(--o-warm)]/[0.07] p-6 sm:p-8">
            <h3 className="font-serif text-2xl font-medium tracking-tight text-[var(--o-text)]">
              {copy.expected}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-[var(--o-text-secondary)]">
              {localized.expected}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h3 className="font-serif text-2xl font-medium tracking-tight text-[var(--o-text)]">
              {copy.comparison}
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--o-text-secondary)]">
              {localized.comparison}
            </p>
            <div className="mt-5 border-t border-[var(--o-border-subtle)] pt-4">
              <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--o-text-muted)] uppercase">
                {copy.review}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--o-text-muted)]">
                {localized.review}
              </p>
            </div>
          </div>
          <a
            href={`/scenario-example/${encodeURIComponent(packet.id)}/${encodeURIComponent(locale)}`}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-[var(--o-warm)] bg-[var(--o-warm)] px-5 py-3 text-sm font-semibold text-[var(--o-bg)] transition-colors hover:bg-[var(--o-text)] hover:text-[var(--o-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--o-warm)]"
          >
            {copy.download}
          </a>
        </div>

        <section className="mt-12" aria-labelledby={`${packet.id}-proof-heading`}>
          <h3 id={`${packet.id}-proof-heading`} className="font-serif text-2xl font-medium text-[var(--o-text)]">{proof.title}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--o-text-secondary)]">{proof.context}</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {(["app", "source"] as const).map((view) => (
              <figure key={view} className="min-w-0 overflow-hidden rounded-xl border border-[var(--o-border)]">
                <EvidenceImage locale={locale} image={{
                  src: `/images/product-evidence/wenlan-${packet.id}-${view}.png`,
                  alt: `${localized.title} — ${view === "app" ? proof.page : proof.source}`,
                  width: 1440,
                  height: 1100,
                }} />
                <figcaption className="border-t border-[var(--o-border)] p-4 text-sm leading-relaxed text-[var(--o-text-secondary)]">{view === "app" ? proof.page : proof.source}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[var(--o-text-secondary)]">{proof.observed}</p>
        </section>

        <section className="mt-12" aria-labelledby={`${packet.id}-sources-heading`}>
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--o-border)] pb-4">
            <div>
              <h3
                id={`${packet.id}-sources-heading`}
                className="font-serif text-2xl font-medium tracking-tight text-[var(--o-text)]"
              >
                {copy.sources}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--o-text-muted)]">
                {copy.sourceHint}
              </p>
            </div>
            <p className="text-xs leading-relaxed text-[var(--o-text-muted)]">{copy.dataset}</p>
          </div>

          <ol className="mt-5 space-y-3">
            {packet.sources.map((source, index) => {
              const anchor = sourceAnchors.get(source.filename);
              return (
                <li key={source.filename}>
                  <details
                    className="scroll-mt-24 rounded-xl border border-[var(--o-border)] bg-[var(--o-card-bg)]"
                  >
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-[var(--o-text)] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--o-warm)] [&::-webkit-details-marker]:hidden"
                    >
                      <span className="min-w-0">
                        <span className="mr-3 font-mono text-[11px] text-[var(--o-warm)]">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="break-all">{source.filename}</span>
                        <span className="mt-1 block text-xs font-normal text-[var(--o-text-muted)] sm:ml-9">
                          {source.title}
                        </span>
                      </span>
                      <span aria-hidden="true" className="font-mono text-lg text-[var(--o-warm)]">
                        +
                      </span>
                    </summary>
                    <pre id={anchor} className="scroll-mt-24 overflow-x-auto border-t border-[var(--o-border-subtle)] px-5 py-5 whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--o-text-secondary)]">
                      {source.content}
                    </pre>
                  </details>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mt-12 rounded-2xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-6 sm:p-8" aria-labelledby={`${packet.id}-reference-heading`}>
          <h3 id={`${packet.id}-reference-heading`} className="font-serif text-2xl font-medium tracking-tight text-[var(--o-text)]">
            {copy.reference}
          </h3>
          <p className="mt-4 text-base font-medium leading-relaxed text-[var(--o-text)]">
            {packet.referenceTitle}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--o-text-secondary)]">
            {packet.referenceSummary}
          </p>
          <div className="mt-6">
            <ReferenceContent markdown={packet.referenceMarkdown} anchors={sourceAnchors} />
          </div>
        </section>

        <section className="mt-8" aria-labelledby={`${packet.id}-change-heading`}>
          <details id={changeAnchor} className="scroll-mt-24 rounded-2xl border border-[var(--o-border)] bg-[var(--o-card-bg)]">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 break-words px-6 py-4 font-serif text-2xl font-medium tracking-tight text-[var(--o-text)] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--o-warm)] [&::-webkit-details-marker]:hidden">
              <span className="min-w-0" id={`${packet.id}-change-heading`}>{copy.changed}: {packet.change.filename}</span>
              <span aria-hidden="true" className="font-mono text-lg text-[var(--o-warm)]">+</span>
            </summary>
            <div className="border-t border-[var(--o-border-subtle)] px-6 py-6 sm:px-8">
              <h4 className="text-sm font-semibold text-[var(--o-warm)]">{copy.changeExpected}</h4>
              <p className="mt-3 text-sm leading-relaxed text-[var(--o-text-secondary)]">{packet.change.expected}</p>
              <pre className="mt-6 overflow-x-auto rounded-lg border border-[var(--o-border-subtle)] bg-[var(--o-bg)] p-5 whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--o-text-secondary)]">
                {packet.change.content}
              </pre>
            </div>
          </details>
        </section>
      </div>
    </section>
  );
}
