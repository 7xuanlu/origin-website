import {
  SITE_EVENTS_MAX_BODY_BYTES,
  validateSiteEvent,
  type SiteEventValidationResult,
} from "@/lib/site-events-schema";
import {
  createSiteEventsStore,
  type SiteEventsStore,
} from "@/lib/site-events-store";
import { SITE_URL } from "@/i18n/routing";

const RESPONSE_HEADERS = {
  "cache-control": "no-store",
  "x-robots-tag": "noindex, nofollow",
};

export type SiteEventsRouteOptions = {
  readonly env?: NodeJS.ProcessEnv;
  readonly store?: SiteEventsStore;
  readonly now?: () => Date;
};

function response(status: number, headers: Record<string, string> = {}): Response {
  return new Response(null, {
    status,
    headers: { ...RESPONSE_HEADERS, ...headers },
  });
}

function requestOriginAllowed(request: Request, env: NodeJS.ProcessEnv): boolean {
  const origin = request.headers.get("origin");
  try {
    const requestUrl = new URL(request.url);
    if (origin === SITE_URL) {
      return requestUrl.origin === SITE_URL;
    }

    if (env.NODE_ENV !== "development" || env.VERCEL) return false;
    const isLocalHost = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
    return (
      isLocalHost &&
      (requestUrl.protocol === "http:" || requestUrl.protocol === "https:") &&
      origin === requestUrl.origin
    );
  } catch {
    return false;
  }
}

async function readJsonBody(
  request: Request,
): Promise<{ ok: true; value: unknown } | { ok: false; tooLarge?: boolean }> {
  if (!request.body) return { ok: false };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > SITE_EVENTS_MAX_BODY_BYTES) {
        try {
          await reader.cancel();
        } catch {
          // The body is already over the hard cap; cancellation is best effort.
        }
        return { ok: false, tooLarge: true };
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false };
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // A broken request stream is still reported as a generic 400.
    }
  }
}

function isPrivacyOptOut(request: Request): boolean {
  return request.headers.get("dnt")?.trim() === "1" || request.headers.get("sec-gpc")?.trim() === "1";
}

function isJsonContentType(request: Request): boolean {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  return contentType === "application/json";
}

function invalidEventResponse(result: SiteEventValidationResult): Response {
  // Do not return validation details: they are not useful to a browser and
  // would turn this endpoint into a field oracle.
  void result;
  return response(400);
}

export async function handleSiteEventsRequest(
  request: Request,
  options: SiteEventsRouteOptions = {},
): Promise<Response> {
  const env = options.env ?? process.env;
  if (request.method !== "POST") return response(405, { allow: "POST" });
  if (!requestOriginAllowed(request, env)) return response(403);
  if (isPrivacyOptOut(request)) return response(204);

  const store = options.store ?? createSiteEventsStore({ env });
  if (!store.config.available) return response(503);
  if (!isJsonContentType(request)) return response(415);

  const body = await readJsonBody(request);
  if (!body.ok) return response(body.tooLarge ? 413 : 400);

  const validation = validateSiteEvent(body.value);
  if (!validation.ok) return invalidEventResponse(validation);

  const result = await store.record(validation.event, options.now?.() ?? new Date());
  if (result.status === "accepted") return response(204);
  if (result.status === "capped") return response(429);
  return response(503);
}
