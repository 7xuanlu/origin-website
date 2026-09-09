import {
  APP_EVENTS_MAX_BODY_BYTES,
  validateAppEvent,
  type AppEventValidationResult,
} from "@/lib/app-events-schema";
import { createAppEventsStore, type AppEventsStore } from "@/lib/app-events-store";
import { SITE_URL } from "@/i18n/routing";

const RESPONSE_HEADERS = {
  "cache-control": "no-store",
  "x-robots-tag": "noindex, nofollow",
};

export type AppEventsRouteOptions = {
  readonly env?: NodeJS.ProcessEnv;
  readonly store?: AppEventsStore;
};

function response(status: number, headers: Record<string, string> = {}): Response {
  return new Response(null, { status, headers: { ...RESPONSE_HEADERS, ...headers } });
}

function isLoopback(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

function requestHostAllowed(request: Request, env: NodeJS.ProcessEnv): boolean {
  try {
    const url = new URL(request.url);
    if (url.origin === SITE_URL) return true;
    return env.NODE_ENV === "development" && !env.VERCEL && isLoopback(url.hostname);
  } catch {
    return false;
  }
}

function requestOriginAllowed(request: Request, env: NodeJS.ProcessEnv): boolean {
  if (!requestHostAllowed(request, env)) return false;
  // Native clients intentionally have no Origin. An explicit Origin is not an
  // authentication proof and is rejected to keep browser traffic separate.
  return request.headers.get("origin") === null;
}

async function readJsonBody(request: Request): Promise<{ ok: true; value: unknown } | { ok: false; tooLarge?: boolean }> {
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
      if (total > APP_EVENTS_MAX_BODY_BYTES) {
        try { await reader.cancel(); } catch { /* best effort */ }
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
    try { reader.releaseLock(); } catch { /* broken streams are generic 400s */ }
  }
}

function isPrivacyOptOut(request: Request): boolean {
  return request.headers.get("dnt")?.trim() === "1" || request.headers.get("sec-gpc")?.trim() === "1";
}

function isJsonContentType(request: Request): boolean {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  return contentType === "application/json";
}

function invalidEventResponse(result: AppEventValidationResult): Response {
  void result;
  return response(400);
}

export async function handleAppEventsRequest(request: Request, options: AppEventsRouteOptions = {}): Promise<Response> {
  const env = options.env ?? process.env;
  if (request.method !== "POST") return response(405, { allow: "POST" });
  if (!requestOriginAllowed(request, env)) return response(403);
  if (isPrivacyOptOut(request)) return response(204);
  if (!isJsonContentType(request)) return response(415);

  const body = await readJsonBody(request);
  if (!body.ok) return response(body.tooLarge ? 413 : 400);
  const validation = validateAppEvent(body.value);
  if (!validation.ok) return invalidEventResponse(validation);

  const store = options.store ?? createAppEventsStore({ env });
  if (!store.config.available) return response(503);
  const result = await store.record(validation.event);
  if (result.status === "accepted") return response(204);
  if (result.status === "capped") return response(429);
  return response(503);
}
