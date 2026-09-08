import type { LearnArticleSection } from "@/app/(en)/learn/articles";
import type { Locale } from "@/i18n/locales";

// Authored teaching fixtures and reference answers, not captured product output.
const sources = `# api-v1.md — fictional API specification, revision 1
GET /reports: after a failed first attempt, allow up to 3 retries.
POST /payments: do not retry automatically.

# decision-07.md — fictional client decision
Use the API's GET retry cap of 3 to limit repeated requests.
Automatic POST retries are disabled because duplicate payments are unsafe.

# runbook-v1.md — fictional operator note
Record the endpoint, attempt number, and final failure in the local test log.
The request timeout has not been decided.`;

const reference = `# Request retry policy — reference answer, revision 1
GET: at most 3 retries after the first attempt (4 attempts total).
Source: api-v1.md; decision-07.md.
POST: no automatic retry.
Source: api-v1.md; decision-07.md.
Log: endpoint, attempt number, final failure.
Source: runbook-v1.md.
Timeout: not specified. Ask the owner; do not invent a value.
Source: runbook-v1.md.

# api-v2.md — fictional replacement for api-v1.md
GET /reports: after a failed first attempt, allow at most 1 retry.
POST /payments: do not retry automatically.

# Review note — before accepting a revised answer
The old GET answer is stale: api-v2.md now allows only 1 retry.
decision-07.md still says 3. Preserve and flag this conflict.
Do not report the old 3-retry policy as settled current guidance.
POST, logging, and the unknown timeout are unchanged.
Ask the decision owner to reconcile decision-07.md with api-v2.md.`;

export function workedExampleSections(locale: Locale): LearnArticleSection[] {
  const copy = {
    en: {
      heading: "Try a complete example before installing anything",
      intro: "Can your wiki answer a project question, show its evidence, and notice when that answer stops being safe to reuse? Try this small, fictional source packet with your existing AI tool first. These are authored teaching inputs and reference answers, not a Wenlan run, a customer result, or a performance comparison.",
      instructions: "Save the three blocks below as separate Markdown files with the displayed filenames in a new, disposable folder. Give your agent read-only access to those files. Keep any generated answer in a separate wiki file; do not let it edit the sources.",
      sourceLabel: "Complete source packet — save these three files",
      prompt: 'Ask: “Using only api-v1.md, decision-07.md, and runbook-v1.md, write a short retry-policy wiki page. Cite the filename for every rule, distinguish retries from total attempts, and list unanswered questions. Do not fill gaps from general knowledge.”',
      resultHeading: "Check the answer, then change one source",
      resultIntro: "Compare your result with this reference. The point is not matching the wording: all four claims must have the right support, and the timeout must stay unknown. Open each cited file yourself; a plausible citation is not evidence that it supports the sentence.",
      change: "Next add api-v2.md using the replacement text below. Explicitly tell your agent it replaces api-v1.md, while decision-07.md remains unchanged. Repeat the same question. A useful workflow exposes the 1-versus-3 retry conflict and the old answer's stale state instead of silently rewriting the decision or presenting an invented resolution.",
      resultLabel: "Reference answer, changed source, and expected review note",
      boundary: "If plain files and your agent already handle this clearly, keep that simpler workflow. Consider Wenlan when maintaining source-linked pages and shared lookup across your AI tools is recurring work. Its source links do not verify meaning, and adding a replacement source is not the same as updating an already linked source: review the actual page state. This exercise does not establish Wenlan's accuracy, time savings, automatic maintenance, or your later reuse.",
      next: "Check Wenlan's source and review boundaries",
    },
    "zh-TW": {
      heading: "先用完整範例試做，不必先安裝",
      intro: "你的 wiki 能回答專案問題、指出依據，並在來源改變時提醒舊答案不能照用嗎？先拿這組虛構資料，用你原本的 AI 工具試一次。以下是人工編寫的教學輸入與參考答案，不是 Wenlan 執行紀錄、客戶成果或效能比較。",
      instructions: "在一個可丟棄的新資料夾，依下方檔名分別存成三個 Markdown 檔，讓 Agent 唯讀存取。產生的 wiki 答案另外存檔，不要讓 Agent 修改原始來源。API 名稱與英文測試資料保持一致，方便三語讀者核對同一個問題。",
      sourceLabel: "完整測試資料：分別存成這三個檔案",
      prompt: "提問：「只根據 api-v1.md、decision-07.md 與 runbook-v1.md，整理一頁重試規則。每條規則標明來源檔名，分清重試次數與總嘗試次數，列出還不知道的事。不要用常識補齊文件沒寫的內容。」",
      resultHeading: "核對答案，再改一份來源",
      resultIntro: "對照下方參考答案，不必逐字相同，但四項結論都要有正確依據；逾時時間必須保留「尚未指定」。親自打開被引用的檔案：看起來合理的引用，不代表真的支持那句話。",
      change: "接著依下方內容新增 api-v2.md，明確告訴 Agent 它取代 api-v1.md，但 decision-07.md 沒有改。再次提問。合格的工作流應指出「最多重試 1 次」與舊決策「3 次」的矛盾，標示舊答案需重新審查，而不是擅自改決策或假裝已解決衝突。",
      resultLabel: "參考答案、更新後來源與應有的審查紀錄",
      boundary: "如果普通檔案加上你的 Agent 已經能清楚完成，就保留這個簡單方法。當維護來源頁面、讓多個 AI 工具共用查詢成為反覆工作時，再評估 Wenlan。來源連結不等於語意已驗證；另存替代來源也不等於更新已連結來源，仍要查看實際頁面狀態。這個練習不能證明 Wenlan 的準確率、省時幅度、自動維護效果或日後回用。",
      next: "查看 Wenlan 的來源與審查邊界",
    },
    "zh-CN": {
      heading: "先用完整示例试做，不必先安装",
      intro: "你的 wiki 能回答项目问题、指出依据，并在来源变化时提醒旧答案不能照用吗？先用这组虚构资料，在你现有的 AI 工具中试一次。以下是人工编写的教学输入与参考答案，不是 Wenlan 运行记录、客户成果或性能对比。",
      instructions: "新建一个可随时删除的测试文件夹，按下方文件名分别保存三个 Markdown 文件，让 Agent 只读访问。生成的 wiki 答案另存，不要让 Agent 修改原始来源。API 名称与英文测试数据保持一致，便于三种语言的读者核对同一个问题。",
      sourceLabel: "完整测试资料：分别保存这三个文件",
      prompt: "提问：“只根据 api-v1.md、decision-07.md 和 runbook-v1.md，整理一页重试规则。每条规则标明来源文件名，区分重试次数与总尝试次数，列出尚未确定的信息。不要用常识补齐文档没写的内容。”",
      resultHeading: "核对答案，再改一份来源",
      resultIntro: "对照下面的参考答案，不必逐字相同，但四项结论都要有正确依据；超时时间必须保留“尚未指定”。亲自打开被引用的文件：看似合理的引用，不代表真的支持那句话。",
      change: "然后按下方内容新增 api-v2.md，明确告诉 Agent 它替代 api-v1.md，但 decision-07.md 没有改变。再次提问。合格的工作流应指出“最多重试 1 次”与旧决策“3 次”的矛盾，标明旧答案需要重新审核，而不是擅自改决策或假装冲突已解决。",
      resultLabel: "参考答案、更新后的来源与应有的审核记录",
      boundary: "如果普通文件加上你的 Agent 已经能清楚完成，就保留这个简单方法。当维护来源页面、让多个 AI 工具共享查询成为重复工作时，再评估 Wenlan。来源链接不等于语义已验证；另存替代来源也不等于更新已链接来源，仍要查看实际页面状态。这个练习不能证明 Wenlan 的准确率、节省时间、自动维护效果或今后复用。",
      next: "查看 Wenlan 的来源与审核边界",
    },
  }[locale];
  return [
    { id: "worked-example", heading: copy.heading, body: [copy.intro, copy.instructions, copy.prompt], code: { label: copy.sourceLabel, code: sources } },
    { id: "worked-example-review", heading: copy.resultHeading, body: [copy.resultIntro, copy.change, copy.boundary], code: { label: copy.resultLabel, code: reference }, link: { label: copy.next, href: "/docs/review-and-trust" } },
  ];
}
