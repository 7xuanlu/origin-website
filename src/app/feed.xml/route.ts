import { articles, articleUrl, SITE_URL } from "../learn/articles";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822Date(iso: string): string {
  return new Date(iso).toUTCString();
}

export function GET() {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const latest = sorted[0]?.updatedAt ?? new Date().toISOString();

  const items = sorted
    .map((article) => {
      const url = articleUrl(article.slug);
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.description)}</description>
      <author>noreply@useorigin.app (${escapeXml(article.author)})</author>
      <category>${escapeXml(article.category)}</category>
      <pubDate>${rfc822Date(article.updatedAt)}</pubDate>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Origin Learn</title>
    <link>${SITE_URL}/learn</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Articles on AI work memory, MCP memory servers, local-first AI memory, distilled wiki pages, Claude Code workflows, and Origin comparisons. Authored by Qi-Xuan Lu.</description>
    <language>en-US</language>
    <lastBuildDate>${rfc822Date(latest)}</lastBuildDate>
    <managingEditor>noreply@useorigin.app (Qi-Xuan Lu)</managingEditor>
    <webMaster>noreply@useorigin.app (Qi-Xuan Lu)</webMaster>
    <generator>Origin website (Next.js)</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
