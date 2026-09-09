import { handleSiteEventsRequest } from "@/lib/site-events-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleSiteEventsRequest(request);
}
