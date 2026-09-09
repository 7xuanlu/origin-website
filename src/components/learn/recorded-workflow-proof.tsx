import type { Locale } from "@/i18n/locales";
import { EvidenceImage } from "./evidence-image";

const copy = {
  en: {
    title: "Inspect a citation and a proposed revision in Wenlan",
    context: "These are real Wenlan app recordings using Tally, a demonstration invoicing project. Enlarge the screens to follow a source reference and inspect a proposed page revision.",
    steps: [
      {
        title: "1. Follow the SQLite claim back to its source",
        body: "The wiki says Tally uses SQLite for a single-user app. The open citation shows the source titled ‘SQLite for Single-User App’, its summary, and an ‘Open memory’ action. Compare the sentence with that source before reusing the decision.",
        alt: "Recorded Wenlan Tally wiki with the SQLite citation open, showing the source summary and Open memory action.",
        caption: "Tally demo recording: wiki page and source popover. A source link makes a claim inspectable; you still need to check whether the source supports it.",
      },
      {
        title: "2. Read the proposed change before approving it",
        body: "The Project notes revision removes the undecided database wording and proposes a SQLite decision. Added and removed text, an earlier version, and Skip / Approve controls are visible. Check the revised wording and its sources before choosing what to keep.",
        alt: "Recorded Wenlan Project notes revision with added and removed text, an earlier version, and Skip and Approve controls.",
        caption: "Tally demo recording: a proposed page revision. This frame does not show an approved result or prove that every changed sentence is correct.",
      },
    ],
  },
  "zh-TW": {
    title: "在實際畫面中，核對引用與修訂",
    context: "以下來自 Wenlan App 的 Tally 發票專案示範錄影。放大實際畫面，查看一條引用如何回到來源，以及頁面修訂提出了哪些改變。",
    steps: [
      {
        title: "1. 從 SQLite 結論回到原始依據",
        body: "Wiki 說明 Tally 為單人應用選擇 SQLite。打開的引用顯示「SQLite for Single-User App」來源、摘要與「Open memory」入口。再次使用這個決策前，先比較句子和來源是否一致。",
        alt: "Wenlan 實際錄製的 Tally Wiki，SQLite 引用已展開，顯示來源摘要與 Open memory 入口。",
        caption: "Tally 示範錄影：Wiki 頁面與來源浮層。來源連結讓結論可檢查；是否真的支持該句話，仍要親自核對。",
      },
      {
        title: "2. 先看增刪內容，再決定是否接受",
        body: "Project notes 修訂刪除「資料庫尚未決定」的舊文字，提出使用 SQLite 的新敘述。畫面保留增刪差異、先前版本，以及 Skip／Approve 操作。先檢查新文字和引用，再決定保留哪些內容。",
        alt: "Wenlan 實際錄製的 Project notes 修訂，顯示增刪文字、先前版本，以及 Skip 和 Approve 操作。",
        caption: "Tally 示範錄影：一項待審查的頁面修訂。這張畫面沒有顯示已核准成果，也不能證明每句修改都正確。",
      },
    ],
  },
  "zh-CN": {
    title: "在实际画面中，核对引用与修订",
    context: "以下来自 Wenlan App 的 Tally 发票项目演示录像。放大实际画面，查看一条引用如何回到来源，以及页面修订提出了哪些变化。",
    steps: [
      {
        title: "1. 从 SQLite 结论回到原始依据",
        body: "Wiki 说明 Tally 为单人应用选择 SQLite。展开的引用显示「SQLite for Single-User App」来源、摘要和「Open memory」入口。再次使用这个决策前，先比较句子与来源是否一致。",
        alt: "Wenlan 实际录制的 Tally Wiki，SQLite 引用已展开，显示来源摘要和 Open memory 入口。",
        caption: "Tally 演示录像：Wiki 页面与来源浮层。来源链接让结论可检查；是否真正支持该句，仍需亲自核对。",
      },
      {
        title: "2. 先看增删内容，再决定是否接受",
        body: "Project notes 修订删除「数据库尚未决定」的旧文字，提出使用 SQLite 的新表述。画面保留增删差异、先前版本，以及 Skip／Approve 操作。先检查新文字和引用，再决定保留哪些内容。",
        alt: "Wenlan 实际录制的 Project notes 修订，显示增删文字、先前版本，以及 Skip 和 Approve 操作。",
        caption: "Tally 演示录像：一项待审核的页面修订。这张画面没有显示已批准的结果，也不能证明每句修改都正确。",
      },
    ],
  },
} as const;

const images = [
  "/images/product-evidence/wenlan-recorded-wiki-source-hover.webp",
  "/images/product-evidence/wenlan-recorded-page-review.webp",
];

export function RecordedWorkflowProof({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return (
    <section id="recorded-workflow" aria-labelledby="recorded-workflow-heading" className="scroll-mt-24 px-6 pb-20">
      <div className="mx-auto max-w-5xl">
        <h2 id="recorded-workflow-heading" className="max-w-3xl text-balance font-serif text-3xl font-medium tracking-tight sm:text-4xl">{text.title}</h2>
        <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-[var(--o-text-secondary)]">{text.context}</p>
        <div className="mt-10 space-y-12">
          {text.steps.map((step, index) => (
            <div key={images[index]}>
              <h3 className="text-pretty text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 max-w-3xl text-pretty text-base leading-relaxed text-[var(--o-text-secondary)]">{step.body}</p>
              <figure className="mt-5">
                <EvidenceImage image={{ src: images[index], width: 2880, height: 1800, alt: step.alt, caption: step.caption }} locale={locale} />
                <figcaption className="mt-3 max-w-3xl text-pretty text-sm leading-relaxed text-[var(--o-text-muted)]">{step.caption}</figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
