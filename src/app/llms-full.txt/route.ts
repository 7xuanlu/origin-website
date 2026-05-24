import { articles, articleUrl, SITE_URL } from "../learn/articles";
import { docPages, docUrl } from "../docs/docs";

export const dynamic = "force-static";

function formatArticle(article: (typeof articles)[number]): string {
  const lines: string[] = [];
  lines.push(`## ${article.title}`);
  lines.push(``);
  lines.push(`URL: ${articleUrl(article.slug)}`);
  lines.push(`Updated: ${article.updatedAt}`);
  lines.push(`Author: ${article.author}`);
  lines.push(`Reading time: ${article.readingTime}`);
  lines.push(``);
  lines.push(`> ${article.description}`);
  lines.push(``);
  for (const bullet of article.heroBullets) {
    lines.push(`- ${bullet}`);
  }
  lines.push(``);
  for (const section of article.sections) {
    lines.push(`### ${section.heading}`);
    lines.push(``);
    for (const paragraph of section.body) {
      lines.push(paragraph);
      lines.push(``);
    }
    if (section.bullets) {
      for (const bullet of section.bullets) {
        lines.push(`- ${bullet}`);
      }
      lines.push(``);
    }
  }
  if (article.comparisonTable) {
    lines.push(`### Side-by-side: Origin vs ${article.comparisonTable.competitorName}`);
    lines.push(``);
    for (const row of article.comparisonTable.rows) {
      lines.push(`**${row.dimension}**`);
      lines.push(`- Origin: ${row.origin}`);
      lines.push(`- ${article.comparisonTable.competitorName}: ${row.competitor}`);
      lines.push(``);
    }
  }
  if (article.faqs.length > 0) {
    lines.push(`### FAQ`);
    lines.push(``);
    for (const faq of article.faqs) {
      lines.push(`**Q: ${faq.question}**`);
      lines.push(``);
      lines.push(`A: ${faq.answer}`);
      lines.push(``);
    }
  }
  return lines.join("\n");
}

function formatDoc(page: (typeof docPages)[number]): string {
  const lines: string[] = [];
  lines.push(`## ${page.title}`);
  lines.push(``);
  lines.push(`URL: ${docUrl(page.slug)}`);
  lines.push(`Updated: ${page.updatedAt}`);
  lines.push(`Author: ${page.author}`);
  lines.push(`Reading time: ${page.readingTime}`);
  lines.push(``);
  lines.push(`> ${page.description}`);
  lines.push(``);
  lines.push(`### Summary`);
  lines.push(``);
  for (const item of page.summary) {
    lines.push(`- ${item}`);
  }
  lines.push(``);
  for (const section of page.sections) {
    lines.push(`### ${section.heading}`);
    lines.push(``);
    for (const paragraph of section.body) {
      lines.push(paragraph);
      lines.push(``);
    }
    if (section.bullets) {
      for (const bullet of section.bullets) {
        lines.push(`- ${bullet}`);
      }
      lines.push(``);
    }
    if (section.code) {
      lines.push("```");
      lines.push(`${section.code.label}: ${section.code.code}`);
      lines.push("```");
      lines.push(``);
    }
    if (section.link) {
      lines.push(`Link: ${section.link.label} (${section.link.href})`);
      lines.push(``);
    }
  }
  return lines.join("\n");
}

export function GET() {
  const header = [
    `# Origin (full content)`,
    ``,
    `> Origin is local-first memory for AI work. Hybrid retrieval (88% Recall@5 on LongMemEval oracle, 67% on LoCoMo), real git versioning of every memory write in ~/.origin/.git/, mandatory provenance on distilled wiki pages, and one daemon serving Claude Code, Cursor, Codex, Claude Desktop, Gemini CLI, and other MCP-compatible AI tools. Cross-platform on macOS (arm64, x64), Linux (x86_64, aarch64; glibc), and Windows (x86_64). Apache-2.0. Source at github.com/7xuanlu/origin.`,
    ``,
    `This file is the long-form companion to /llms.txt. It contains the full body of every public Origin article and doc page so an LLM can ingest the full corpus in one fetch. Generated from source at build time; canonical URL for each entry is included with the entry.`,
    ``,
    `Site: ${SITE_URL}`,
    `Generated: ${new Date().toISOString().split("T")[0]}`,
    ``,
    `# Learn articles`,
    ``,
  ];

  const learnSection = articles.map(formatArticle).join("\n\n---\n\n");

  const docHeader = [``, `# Docs`, ``];

  const docSection = docPages.map(formatDoc).join("\n\n---\n\n");

  const body = [
    ...header,
    learnSection,
    ...docHeader,
    docSection,
    ``,
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
