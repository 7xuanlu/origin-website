import { handleAppEventsRequest } from "@/lib/app-events-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleAppEventsRequest(request);
}
