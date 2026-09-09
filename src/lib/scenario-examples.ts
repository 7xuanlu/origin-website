import type { Locale } from "@/i18n/locales";
import competitor from "../../public/examples/scenarios/competitor.json";
import course from "../../public/examples/scenarios/course.json";
import metrics from "../../public/examples/scenarios/metrics.json";
import prd from "../../public/examples/scenarios/prd.json";
import sre from "../../public/examples/scenarios/sre.json";
import supplier from "../../public/examples/scenarios/supplier.json";
import support from "../../public/examples/scenarios/support.json";

export type ScenarioSource = {
  filename: string;
  title: string;
  content: string;
};

export type ScenarioLocaleCopy = {
  title: string;
  intro: string;
  task: string;
  expected: string;
  review: string;
  comparison: string;
};

export type ScenarioPacket = {
  id: string;
  slug: string;
  title: string;
  question: string;
  sources: ScenarioSource[];
  referenceTitle: string;
  referenceSummary: string;
  referenceMarkdown: string;
  change: {
    filename: string;
    content: string;
    expected: string;
  };
  locales: Record<Locale, ScenarioLocaleCopy>;
};

export const scenarioPackets: ScenarioPacket[] = [
  competitor,
  course,
  metrics,
  prd,
  sre,
  supplier,
  support,
];

export function getScenarioPacket(slug: string): ScenarioPacket | undefined {
  return scenarioPackets.find((packet) => packet.slug === slug);
}

const sectionLabels: Record<
  Locale,
  {
    task: string;
    expectedReasoning: string;
    sourcePacket: string;
    changedSource: string;
    expectedChange: string;
    reviewBoundary: string;
    comparison: string;
    readPage: string;
  }
> = {
  en: {
    task: "Task",
    expectedReasoning: "Expected reasoning",
    sourcePacket: "Complete source packet",
    changedSource: "Changed source",
    expectedChange: "Expected change",
    reviewBoundary: "Review boundary",
    comparison: "Comparison",
    readPage: "Read the localized page",
  },
  "zh-TW": {
    task: "任務",
    expectedReasoning: "預期推理",
    sourcePacket: "完整來源資料包",
    changedSource: "變更後來源",
    expectedChange: "變更預期",
    reviewBoundary: "審查邊界",
    comparison: "比較",
    readPage: "閱讀本地化頁面",
  },
  "zh-CN": {
    task: "任务",
    expectedReasoning: "预期推理",
    sourcePacket: "完整来源资料包",
    changedSource: "变更后来源",
    expectedChange: "变更预期",
    reviewBoundary: "审核边界",
    comparison: "对比",
    readPage: "阅读本地化页面",
  },
};

function assertScenarioPacket(packet: ScenarioPacket, locale: Locale): ScenarioLocaleCopy {
  const hasText = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

  if (!packet || typeof packet !== "object") {
    throw new Error("Invalid scenario packet");
  }
  if (!hasText(packet.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(packet.id)) {
    throw new Error("Invalid scenario packet id");
  }
  if (!hasText(packet.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(packet.slug)) {
    throw new Error("Invalid scenario packet slug");
  }
  if (!Array.isArray(packet.sources) || packet.sources.length !== 3) {
    throw new Error("Scenario packet must contain exactly three sources");
  }
  if (
    !packet.sources.every(
      (source) => hasText(source.filename) && hasText(source.title) && hasText(source.content),
    )
  ) {
    throw new Error("Scenario packet contains an incomplete source");
  }
  if (
    !packet.change ||
    typeof packet.change !== "object" ||
    !hasText(packet.change.filename) ||
    !hasText(packet.change.content) ||
    !hasText(packet.change.expected)
  ) {
    throw new Error("Scenario packet contains an incomplete source change");
  }
  if (!packet.sources.some((source) => source.filename === packet.change.filename)) {
    throw new Error("Scenario change does not identify a source packet file");
  }

  if (!packet.locales || typeof packet.locales !== "object") {
    throw new Error("Scenario packet contains no locale copy");
  }
  const copy = packet.locales[locale];
  if (!copy || Object.values(copy).some((value) => !hasText(value))) {
    throw new Error(`Scenario packet has no copy for locale: ${locale}`);
  }
  return copy;
}

function appendSection(lines: string[], heading: string, body: string): void {
  lines.push(`## ${heading}`, "", body.trim(), "");
}

export function scenarioExampleMarkdown(packet: ScenarioPacket, locale: Locale): string {
  const copy = assertScenarioPacket(packet, locale);
  const labels = sectionLabels[locale];
  const learnPath = locale === "en" ? `/learn/${packet.slug}` : `/${locale}/learn/${packet.slug}`;
  const learnUrl = `https://wenlan.app${learnPath}`;
  const lines: string[] = [`# ${copy.title}`, "", copy.intro.trim(), ""];

  appendSection(lines, labels.task, copy.task);
  appendSection(lines, labels.expectedReasoning, copy.expected);
  lines.push(`## ${labels.sourcePacket}`, "");
  for (const source of packet.sources) {
    lines.push(`### ${source.title} — ${source.filename}`, "", "```markdown", source.content.trim(), "```", "");
  }

  appendSection(lines, packet.referenceTitle, packet.referenceSummary);
  lines.push(packet.referenceMarkdown.trim(), "");

  lines.push(`## ${labels.changedSource}`, "", `### ${packet.change.filename}`, "", "```markdown", packet.change.content.trim(), "```", "");
  appendSection(lines, labels.expectedChange, packet.change.expected);
  appendSection(lines, labels.reviewBoundary, copy.review);
  appendSection(lines, labels.comparison, copy.comparison);
  lines.push(`## ${labels.readPage}`, "", learnUrl, "");

  return `${lines.join("\n").trimEnd()}\n`;
}
