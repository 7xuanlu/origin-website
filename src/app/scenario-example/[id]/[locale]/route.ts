import { isSupportedLocale, SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";
import {
  scenarioExampleMarkdown,
  scenarioPackets,
} from "@/lib/scenario-examples";

export const dynamic = "force-static";
export const dynamicParams = false;

function filenameFor(packetId: string, locale: Locale): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(packetId)) {
    throw new Error("Invalid scenario packet id");
  }
  return `wenlan-scenario-${packetId}-${locale}.md`;
}

export function generateStaticParams() {
  return scenarioPackets.flatMap((packet) =>
    SUPPORTED_LOCALES.map((locale) => ({ id: packet.id, locale })),
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; locale: string }> },
) {
  const { id, locale: localeParam } = await params;
  if (!isSupportedLocale(localeParam)) {
    return new Response("Not Found", { status: 404 });
  }

  const packet = scenarioPackets.find((candidate) => candidate.id === id);
  if (!packet) {
    return new Response("Not Found", { status: 404 });
  }

  const locale = localeParam as Locale;
  return new Response(scenarioExampleMarkdown(packet, locale), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filenameFor(packet.id, locale)}"`,
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
