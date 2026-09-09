import { type ValidatedSiteEvent } from "@/lib/site-events-schema";

export const SITE_EVENTS_NAMESPACE = "site-events:v1";
/** Retention is intentionally database-managed; this store does not expire rows. */
export const SITE_EVENTS_RETENTION_SECONDS: null = null;
export const SITE_EVENTS_GLOBAL_PER_MINUTE = 60;
export const SITE_EVENTS_GLOBAL_PER_DAY = 1000;

const REQUEST_TIMEOUT_MS = 4000;
const SUPABASE_HOST = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\.supabase\.co$/i;
const SUPABASE_URL_SHAPE = /^https:\/\/(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\.supabase\.co\/?$/i;
const JWT_HEADER = /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/;

type SiteEventsAuth = "opaque" | "legacy-jwt";

export type SiteEventsConfig =
  | {
      readonly available: true;
      readonly url: string;
      readonly token: string;
      readonly auth: SiteEventsAuth;
    }
  | { readonly available: false; readonly reason: "disabled" | "misconfigured" };

export type SiteEventsStoreResult =
  | { readonly status: "accepted" }
  | { readonly status: "capped"; readonly cap: "minute" | "day" }
  | { readonly status: "unavailable" }
  | { readonly status: "error" };

export type SiteEventsStore = {
  readonly config: SiteEventsConfig;
  record(event: ValidatedSiteEvent, now?: Date): Promise<SiteEventsStoreResult>;
  readDay(date: string): Promise<ReadonlyArray<string>>;
};

export type SiteEventsStoreOptions = {
  readonly env?: NodeJS.ProcessEnv;
  readonly fetchImpl?: typeof fetch;
};

export type SiteEventsHealth = {
  readonly schemaVersion: 1;
  readonly storage: "postgres";
  readonly ready: boolean;
};

type AvailableConfig = Extract<SiteEventsConfig, { available: true }>;

function isValidSupabaseUrl(raw: string): boolean {
  if (!SUPABASE_URL_SHAPE.test(raw)) return false;
  try {
    const url = new URL(raw);
    return (
      url.protocol === "https:" &&
      SUPABASE_HOST.test(url.hostname) &&
      !url.username &&
      !url.password &&
      !url.port &&
      url.pathname === "/" &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  if (!JWT_HEADER.test(token)) return null;
  try {
    const encoded = token.split(".")[1];
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), "=");
    const value: unknown = JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
    return value !== null && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function classifyToken(token: string): SiteEventsAuth | null {
  if (token.startsWith("sb_publishable_")) return null;
  if (!JWT_HEADER.test(token)) return /^sb_secret_[A-Za-z0-9_-]+$/.test(token) ? "opaque" : null;
  const payload = decodeJwtPayload(token);
  return payload?.role === "service_role" ? "legacy-jwt" : null;
}

export function getSiteEventsConfig(
  env: NodeJS.ProcessEnv = process.env,
): SiteEventsConfig {
  if (env.SITE_EVENTS_ENABLED !== "1") {
    return { available: false, reason: "disabled" };
  }

  const url = env.SUPABASE_URL ?? "";
  // SUPABASE_SERVICE_ROLE_KEY is retained only as a migration alias. New
  // deployments should use the server-only SUPABASE_SECRET_KEY variable.
  const token = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const auth = classifyToken(token);
  if (
    !isValidSupabaseUrl(url) ||
    token.length === 0 ||
    token.trim() !== token ||
    auth === null
  ) {
    return { available: false, reason: "misconfigured" };
  }
  return { available: true, url, token, auth };
}

function rpcUrl(config: AvailableConfig, functionName: string): string {
  return `${config.url.replace(/\/$/, "")}/rest/v1/rpc/${functionName}`;
}

async function supabaseRpc(
  config: AvailableConfig,
  fetchImpl: typeof fetch,
  functionName: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const headers: Record<string, string> = {
      apikey: config.token,
      "content-type": "application/json",
    };
    // New sb_secret_* keys are intentionally sent as apikey only. The
    // Authorization header is reserved for validated legacy service_role JWTs.
    if (config.auth === "legacy-jwt") headers.authorization = `Bearer ${config.token}`;
    const response = await fetchImpl(rpcUrl(config, functionName), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      redirect: "error",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("storage request failed");
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function unwrapRpcJson(value: unknown): unknown {
  // PostgREST returns a scalar JSON value directly for a jsonb function. Keep
  // accepting the one-row representation so a harmless API setting change
  // cannot turn a valid aggregate into an unavailable day.
  if (Array.isArray(value) && value.length === 1) return value[0];
  return value;
}

function parseRecordResult(value: unknown): SiteEventsStoreResult {
  const payload = unwrapRpcJson(value);
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    return { status: "error" };
  }
  const result = payload as Record<string, unknown>;
  if (result.status === "accepted" && Object.keys(result).length === 1) {
    return { status: "accepted" };
  }
  if (
    result.status === "capped" &&
    (result.cap === "minute" || result.cap === "day") &&
    Object.keys(result).length === 2
  ) {
    return { status: "capped", cap: result.cap };
  }
  return { status: "error" };
}

function parseDayResult(value: unknown): ReadonlyArray<string> {
  const payload = unwrapRpcJson(value);
  if (payload === null) return [];
  if (typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("storage day response malformed");
  }

  const result: string[] = [];
  for (const [key, rawValue] of Object.entries(payload)) {
    if (key === "__saturated_minute" || key === "__saturated_day") {
      if (!(rawValue === 1 || rawValue === "1" || rawValue === true)) {
        throw new Error("storage saturation response malformed");
      }
      result.push(key, "1");
      continue;
    }
    if (
      !(
        (typeof rawValue === "number" && Number.isSafeInteger(rawValue) && rawValue >= 0) ||
        (typeof rawValue === "string" && /^(0|[1-9]\d*)$/.test(rawValue) && Number.isSafeInteger(Number(rawValue)))
      )
    ) {
      throw new Error("storage count response malformed");
    }
    result.push(key, String(rawValue));
  }
  return result;
}

export function createSiteEventsStore(options: SiteEventsStoreOptions = {}): SiteEventsStore {
  const config = getSiteEventsConfig(options.env ?? process.env);
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    config,
    async record(event): Promise<SiteEventsStoreResult> {
      if (!config.available) return { status: "unavailable" };
      try {
        return parseRecordResult(
          await supabaseRpc(config, fetchImpl, "record_site_event_v1", {
            p_field: event.field,
          }),
        );
      } catch {
        return { status: "error" };
      }
    },
    async readDay(date: string): Promise<ReadonlyArray<string>> {
      if (!config.available) throw new Error("storage unavailable");
      return parseDayResult(
        await supabaseRpc(config, fetchImpl, "read_site_event_day_v1", {
          p_day: date,
        }),
      );
    },
  };
}

export async function checkSiteEventsHealth(
  options: SiteEventsStoreOptions = {},
): Promise<SiteEventsHealth | null> {
  const config = getSiteEventsConfig(options.env ?? process.env);
  if (!config.available) return null;
  try {
    const value = unwrapRpcJson(
      await supabaseRpc(config, options.fetchImpl ?? fetch, "site_events_health_v1", {}),
    );
    if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
    const result = value as Record<string, unknown>;
    if (
      result.schemaVersion !== 1 ||
      result.storage !== "postgres" ||
      typeof result.ready !== "boolean" ||
      Object.keys(result).some((key) => !["schemaVersion", "storage", "ready"].includes(key))
    ) {
      return null;
    }
    return {
      schemaVersion: 1,
      storage: "postgres",
      ready: result.ready,
    };
  } catch {
    return null;
  }
}

export function siteEventsStorageMetadata(): {
  readonly namespace: string;
  readonly storage: "supabase-postgres";
  readonly retentionDays: null;
  readonly globalCaps: { readonly perMinute: number; readonly perDay: number };
} {
  return {
    namespace: SITE_EVENTS_NAMESPACE,
    storage: "supabase-postgres",
    retentionDays: null,
    globalCaps: {
      perMinute: SITE_EVENTS_GLOBAL_PER_MINUTE,
      perDay: SITE_EVENTS_GLOBAL_PER_DAY,
    },
  };
}
