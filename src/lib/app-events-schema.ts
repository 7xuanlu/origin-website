/**
 * The native-app event wire contract. Keep this intentionally small: the
 * endpoint accepts aggregate operation counts, never identities or event
 * timestamps.
 */
export const APP_EVENTS_MAX_BODY_BYTES = 2048;

export const APP_EVENT_PLATFORMS = ["macos", "windows", "linux", "other"] as const;
export type AppEventPlatform = (typeof APP_EVENT_PLATFORMS)[number];

export const APP_EVENT_COUNTER_NAMES = [
  "daemon_ready",
  "save_success",
  "search_nonempty",
  "search_empty",
  "wiki_generated",
  "save_error",
  "search_error",
  "wiki_error",
] as const;
export type AppEventCounterName = (typeof APP_EVENT_COUNTER_NAMES)[number];
export type AppEventCounters = Readonly<Partial<Record<AppEventCounterName, number>>>;

export type AppEventInput = {
  readonly schema_version: 1;
  readonly app_version: string;
  readonly platform: AppEventPlatform;
  readonly counters: AppEventCounters;
};

export type ValidatedAppEvent = Readonly<AppEventInput> & {
  readonly operation_count: number;
};

export type AppEventValidationFailure = {
  readonly ok: false;
  readonly code: "invalid_json_shape" | "unknown_field" | "invalid_value";
  readonly message: string;
};

export type AppEventValidationResult =
  | { readonly ok: true; readonly event: ValidatedAppEvent }
  | AppEventValidationFailure;

const PLATFORM_SET = new Set<string>(APP_EVENT_PLATFORMS);
const COUNTER_SET = new Set<string>(APP_EVENT_COUNTER_NAMES);
const APP_VERSION_PATTERN = /^(?:0|[1-9]\d{0,2})\.(?:0|[1-9]\d{0,2})\.(?:0|[1-9]\d{0,2})$/;
const TOP_LEVEL_FIELDS = new Set(["schema_version", "app_version", "platform", "counters"]);

function failure(
  code: AppEventValidationFailure["code"],
  message: string,
): AppEventValidationFailure {
  return { ok: false, code, message };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Validate the exact v1 payload accepted by the app receiver. */
export function validateAppEvent(value: unknown): AppEventValidationResult {
  if (!isPlainObject(value)) return failure("invalid_json_shape", "event must be a JSON object");

  for (const key of Object.keys(value)) {
    if (!TOP_LEVEL_FIELDS.has(key)) return failure("unknown_field", "unknown event field");
  }
  if (
    value.schema_version !== 1 ||
    typeof value.app_version !== "string" ||
    typeof value.platform !== "string" ||
    !Object.hasOwn(value, "counters")
  ) {
    return failure("invalid_json_shape", "event fields are incomplete");
  }
  if (!APP_VERSION_PATTERN.test(value.app_version)) {
    return failure("invalid_value", "app_version must be a plain release semver");
  }
  if (!PLATFORM_SET.has(value.platform)) {
    return failure("invalid_value", "invalid platform");
  }
  if (!isPlainObject(value.counters)) {
    return failure("invalid_value", "counters must be a non-empty object");
  }

  const keys = Object.keys(value.counters);
  if (keys.length === 0) return failure("invalid_value", "counters must be a non-empty object");
  let operationCount = 0;
  const counters: Record<string, number> = {};
  for (const key of keys) {
    if (!COUNTER_SET.has(key)) return failure("unknown_field", "unknown counter");
    const counter = value.counters[key];
    if (typeof counter !== "number" || !Number.isSafeInteger(counter) || counter < 1 || counter > 1000) {
      return failure("invalid_value", "counter must be an integer from 1 through 1000");
    }
    operationCount += counter;
    if (operationCount > 1000) {
      return failure("invalid_value", "counter total exceeds 1000");
    }
    counters[key] = counter;
  }

  return {
    ok: true,
    event: {
      schema_version: 1,
      app_version: value.app_version,
      platform: value.platform as AppEventPlatform,
      counters: counters as AppEventCounters,
      operation_count: operationCount,
    },
  };
}

export function isPlainReleaseSemver(value: string): boolean {
  return APP_VERSION_PATTERN.test(value);
}
