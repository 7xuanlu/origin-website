import { workedExampleSections } from "@/lib/llm-wiki-worked-example";
import type { Locale } from "@/i18n/locales";

function appendBlankLine(lines: string[]): void {
  if (lines[lines.length - 1] !== "") {
    lines.push("");
  }
}

/**
 * Serialize the authored worked example into a downloadable Markdown packet.
 * The article sections remain the single source of truth for this artifact.
 */
export function serializeLlmWikiWorkedExample(locale: Locale): string {
  const sections = workedExampleSections(locale);
  const lines: string[] = [`# ${sections[0]?.heading ?? "Wenlan worked example"}`, ""];

  for (const [index, section] of sections.entries()) {
    if (index > 0) {
      lines.push(`## ${section.heading}`, "");
    }

    for (const paragraph of section.body) {
      lines.push(paragraph, "");
    }

    for (const bullet of section.bullets ?? []) {
      lines.push(`- ${bullet}`);
    }
    if (section.bullets?.length) {
      lines.push("");
    }

    if (section.code) {
      lines.push(`### ${section.code.label}`, "", "```text", section.code.code, "```", "");
    }

    if (section.link) {
      lines.push(`[${section.link.label}](${new URL(section.link.href, "https://wenlan.app").href})`, "");
    }
  }

  appendBlankLine(lines);
  return `${lines.join("\n")}\n`;
}
