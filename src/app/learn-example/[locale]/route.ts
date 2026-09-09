import { serializeLlmWikiWorkedExample } from "@/lib/llm-wiki-example-download";
import { isSupportedLocale, SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";

export const dynamic = "force-static";
export const dynamicParams = false;

const filenameByLocale: Record<Locale, string> = {
  en: "wenlan-worked-example-en.md",
  "zh-TW": "wenlan-worked-example-zh-TW.md",
  "zh-CN": "wenlan-worked-example-zh-CN.md",
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(serializeLlmWikiWorkedExample(locale), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filenameByLocale[locale]}"`,
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
