import { getReleaseResolution } from "@/lib/release-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Read-only source-native snapshot for release verification/reporting. Share the
// validated server cache with rendered pages; no second CDN cache or events.
export async function GET() {
  const { release, source } = await getReleaseResolution();
  return Response.json(release, {
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Wenlan-Release-Source": source,
    },
  });
}
