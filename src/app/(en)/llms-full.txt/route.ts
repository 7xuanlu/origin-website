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
    if (section.code) {
      lines.push("```bash");
      lines.push(section.code.code);
      lines.push("```");
      lines.push(``);
    }
  }
  if (article.comparisonTable) {
    lines.push(`### Side-by-side: Wenlan vs ${article.comparisonTable.competitorName}`);
    lines.push(``);
    for (const row of article.comparisonTable.rows) {
      lines.push(`**${row.dimension}**`);
      lines.push(`- Wenlan: ${row.wenlan}`);
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
    `# Wenlan (full content)`,
    ``,
    `> Wenlan is an LLM wiki for AI work, built by agents and grounded in its sources. Hybrid retrieval publishes CE-reranker snapshots for LME_Oracle at 93.6% Recall@5 / 0.857 MRR / 0.883 NDCG@10 (500 Q) and LME_S at 87.7% Recall@5 / 0.815 MRR / 0.822 NDCG@10 (deep, N=90). Retrieval uses ~168 tokens per recall query versus full replay at 4,505 tokens per query. Real git versioning for readable pages, sessions, handoffs, and status artifacts under ~/.wenlan/.git/, mandatory provenance on source-backed wiki pages, Claude Code and Codex plugins, local MCP for Cursor and other clients, and Streamable HTTP MCP for ChatGPT and Claude.ai. Current prebuilt runtime artifacts cover macOS Apple Silicon, Linux (x86_64, aarch64; glibc), and Windows (x86_64); current desktop builds cover a notarized macOS Apple Silicon DMG and Windows x64; macOS Intel is source/dev-only until a public release workflow publishes that artifact again. Apache-2.0. Source at github.com/7xuanlu/wenlan. Desktop app source at github.com/7xuanlu/wenlan/tree/v0.18.5/app.`,
    ``,
    `This file is the long-form companion to /llms.txt. It contains the full body of every public Wenlan article and doc page so an LLM can ingest the full corpus in one fetch. Generated from source at build time; canonical URL for each entry is included with the entry.`,
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
