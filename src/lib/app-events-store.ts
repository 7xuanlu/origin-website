import {
  APP_EVENT_COUNTER_NAMES,
  APP_EVENT_PLATFORMS,
  isPlainReleaseSemver,
  type AppEventCounters,
  type AppEventCounterName,
  type AppEventPlatform,
  type ValidatedAppEvent,
} from "@/lib/app-events-schema";
import { getSiteEventsConfig, type SiteEventsConfig } from "@/lib/site-events-store";

export const APP_EVENTS_NAMESPACE = "app-measurement:v1";
export const APP_EVENTS_REQUEST_TIMEOUT_MS = 4000;
export const APP_EVENTS_BATCHES_PER_MINUTE = 60;
export const APP_EVENTS_BATCHES_PER_DAY = 1000;
export const APP_EVENTS_OPERATIONS_PER_DAY = 100000;
export const APP_EVENTS_VERSION_BUCKETS_PER_DAY = 20;

export type AppEventsConfig = SiteEventsConfig;

export type AppEventsStoreResult =
  | { readonly status: "accepted" }
  | { readonly status: "capped"; readonly cap: "minute" | "batch_day" | "operations_day" | "version_day" }
  | { readonly status: "unavailable" }
  | { readonly status: "error" };

export type AppEventDay = {
  readonly day: string;
  readonly version_buckets: Readonly<
    Record<string, Readonly<Partial<Record<AppEventPlatform, AppEventCounters>>>>
  >;
  readonly batch_count: number;
  readonly operation_count: number;
  readonly saturated_minute: boolean;
  readonly saturated_batch_day: boolean;
  readonly saturated_operation_day: boolean;
  readonly saturated_version_day: boolean;
};

export type AppEventsStore = {
  readonly config: AppEventsConfig;
  record(event: ValidatedAppEvent): Promise<AppEventsStoreResult>;
  readDay(date: string): Promise<AppEventDay | null>;
};

export type AppEventsStoreOptions = {
  readonly env?: NodeJS.ProcessEnv;
  readonly fetchImpl?: typeof fetch;
};

export type AppEventsHealth = {
  readonly schemaVersion: 1;
  readonly storage: "postgres";
  readonly ready: boolean;
};

type AvailableConfig = Extract<AppEventsConfig, { available: true }>;

/** Reuse the existing server-only Supabase validation with an app-specific gate. */
export function getAppEventsConfig(env: NodeJS.ProcessEnv = process.env): AppEventsConfig {
  return getSiteEventsConfig({ ...env, SITE_EVENTS_ENABLED: env.APP_EVENTS_ENABLED });
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
  const timeout = setTimeout(() => controller.abort(), APP_EVENTS_REQUEST_TIMEOUT_MS);
  try {
    const headers: Record<string, string> = {
      apikey: config.token,
      "content-type": "application/json",
    };
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
  return Array.isArray(value) && value.length === 1 ? value[0] : value;
}

function parseRecordResult(value: unknown): AppEventsStoreResult {
  const payload = unwrapRpcJson(value);
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    return { status: "error" };
  }
  const result = payload as Record<string, unknown>;
  if (result.status === "accepted" && Object.keys(result).length === 1) return { status: "accepted" };
  if (
    result.status === "capped" &&
    ["minute", "batch_day", "operations_day", "version_day"].includes(String(result.cap)) &&
    Object.keys(result).length === 2
  ) {
    return { status: "capped", cap: result.cap as "minute" | "batch_day" | "operations_day" | "version_day" };
  }
  return { status: "error" };
}

function safeCount(value: unknown, max: number): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= max;
}

function parseVersionBuckets(value: unknown): AppEventDay["version_buckets"] | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  const result: Record<string, Record<string, Record<string, number>>> = {};
  const versions = Object.entries(value);
  if (versions.length > APP_EVENTS_VERSION_BUCKETS_PER_DAY) return null;
  for (const [version, rawPlatforms] of versions) {
    if (!isPlainReleaseSemverForRead(version) || rawPlatforms === null || typeof rawPlatforms !== "object" || Array.isArray(rawPlatforms)) return null;
    const platforms: Record<string, Record<string, number>> = {};
    for (const [platform, rawCounters] of Object.entries(rawPlatforms)) {
      if (!APP_EVENT_PLATFORMS.includes(platform as AppEventPlatform) || rawCounters === null || typeof rawCounters !== "object" || Array.isArray(rawCounters)) return null;
      const counters: Record<string, number> = {};
      for (const [counter, count] of Object.entries(rawCounters)) {
        if (!APP_EVENT_COUNTER_NAMES.includes(counter as AppEventCounterName) || !safeCount(count, APP_EVENTS_OPERATIONS_PER_DAY)) return null;
        counters[counter] = count;
      }
      platforms[platform] = counters;
    }
    result[version] = platforms;
  }
  return result as AppEventDay["version_buckets"];
}

function isPlainReleaseSemverForRead(value: string): boolean {
  return isPlainReleaseSemver(value);
}

function sumVersionBucketCounters(buckets: AppEventDay["version_buckets"]): number {
  let total = 0;
  for (const platforms of Object.values(buckets)) {
    for (const counters of Object.values(platforms)) {
      for (const count of Object.values(counters)) {
        if (typeof count === "number") total += count;
      }
    }
  }
  return total;
}

function parseDayResult(value: unknown): AppEventDay | null {
  if (Array.isArray(value) && value.length === 0) return null;
  const payload = unwrapRpcJson(value);
  if (payload === null) return null;
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) throw new Error("storage day response malformed");
  const result = payload as Record<string, unknown>;
  const expected = [
    "day",
    "version_buckets",
    "batch_count",
    "operation_count",
    "saturated_minute",
    "saturated_batch_day",
    "saturated_operation_day",
    "saturated_version_day",
  ];
  if (Object.keys(result).some((key) => !expected.includes(key)) || expected.some((key) => !Object.hasOwn(result, key))) {
    throw new Error("storage day response malformed");
  }
  if (typeof result.day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(result.day)) throw new Error("storage day response malformed");
  const versionBuckets = parseVersionBuckets(result.version_buckets);
  if (
    versionBuckets === null ||
    !safeCount(result.batch_count, APP_EVENTS_BATCHES_PER_DAY) ||
    !safeCount(result.operation_count, APP_EVENTS_OPERATIONS_PER_DAY) ||
    typeof result.saturated_minute !== "boolean" ||
    typeof result.saturated_batch_day !== "boolean" ||
    typeof result.saturated_operation_day !== "boolean" ||
    typeof result.saturated_version_day !== "boolean"
  ) {
    throw new Error("storage day response malformed");
  }
  if (sumVersionBucketCounters(versionBuckets) !== result.operation_count) {
    throw new Error("storage day response malformed");
  }
  return {
    day: result.day,
    version_buckets: versionBuckets,
    batch_count: result.batch_count,
    operation_count: result.operation_count,
    saturated_minute: result.saturated_minute,
    saturated_batch_day: result.saturated_batch_day,
    saturated_operation_day: result.saturated_operation_day,
    saturated_version_day: result.saturated_version_day,
  };
}

export function createAppEventsStore(options: AppEventsStoreOptions = {}): AppEventsStore {
  const config = getAppEventsConfig(options.env ?? process.env);
  const fetchImpl = options.fetchImpl ?? fetch;
  return {
    config,
    async record(event): Promise<AppEventsStoreResult> {
      if (!config.available) return { status: "unavailable" };
      try {
        return parseRecordResult(
          await supabaseRpc(config, fetchImpl, "record_app_event_v1", {
            p_app_version: event.app_version,
            p_platform: event.platform,
            p_counters: event.counters,
          }),
        );
      } catch {
        return { status: "error" };
      }
    },
    async readDay(date): Promise<AppEventDay | null> {
      if (!config.available) throw new Error("storage unavailable");
      return parseDayResult(await supabaseRpc(config, fetchImpl, "read_app_event_day_v1", { p_day: date }));
    },
  };
}

export async function checkAppEventsHealth(options: AppEventsStoreOptions = {}): Promise<AppEventsHealth | null> {
  const config = getAppEventsConfig(options.env ?? process.env);
  if (!config.available) return null;
  try {
    const value = unwrapRpcJson(await supabaseRpc(config, options.fetchImpl ?? fetch, "app_events_health_v1", {}));
    if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
    const result = value as Record<string, unknown>;
    if (
      result.schemaVersion !== 1 ||
      result.storage !== "postgres" ||
      typeof result.ready !== "boolean" ||
      Object.keys(result).some((key) => !["schemaVersion", "storage", "ready"].includes(key))
    ) return null;
    return { schemaVersion: 1, storage: "postgres", ready: result.ready };
  } catch {
    return null;
  }
}

export function appEventsStorageMetadata() {
  return {
    namespace: APP_EVENTS_NAMESPACE,
    storage: "supabase-postgres" as const,
    retentionDays: null,
    caps: {
      batchesPerMinute: APP_EVENTS_BATCHES_PER_MINUTE,
      batchesPerDay: APP_EVENTS_BATCHES_PER_DAY,
      operationsPerDay: APP_EVENTS_OPERATIONS_PER_DAY,
      versionBucketsPerDay: APP_EVENTS_VERSION_BUCKETS_PER_DAY,
    },
  };
}
