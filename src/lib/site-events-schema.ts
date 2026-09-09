import { WENLAN_RELEASE } from "@/lib/releases";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";
import { stripLocalePrefix, SITE_URL } from "@/i18n/routing";
import sitemap from "@/app/sitemap";
import history from "./site-events-v1-history.json";

export const SITE_EVENTS_MAX_BODY_BYTES = 2048;

export const SITE_EVENT_NAMES = [
  "get_started_click",
  "github_outbound",
  "learn_article_click",
  "setup_path_click",
  "waitlist_signup",
  "video_play_click",
  "waitlist_error",
  "scenario_select",
  "comparison_select",
  "product_view_select",
  "source_expand",
  "product_image_open",
] as const;

export type SiteEventName = (typeof SITE_EVENT_NAMES)[number];

export const SITE_EVENT_PLACEMENTS = [
  "home-hero",
  "home-acquisition",
  "home-download",
  "home-footer",
  "home-demo",
  "download-page",
  "learn-search-path",
  "learn-grid",
  "learn-footer",
  "learn-article",
  "docs-get-started",
  "docs-article",
  "home-scenario",
  "home-comparison",
  "home-product-views",
] as const;

export type SiteEventPlacement = (typeof SITE_EVENT_PLACEMENTS)[number];

export const SITE_EVENT_CONTEXTS = [
  "home",
  "concepts",
  "comparisons",
  "workflows",
  "setup",
] as const;

export type SiteEventContext = (typeof SITE_EVENT_CONTEXTS)[number];

export const SITE_EVENT_SOURCES = [
  "direct",
  "google",
  "bing",
  "github",
  "chatgpt",
  "claude",
  "gemini",
  "reddit",
  "youtube",
  "social",
  "other",
] as const;

export type SiteEventSource = (typeof SITE_EVENT_SOURCES)[number];

export const SITE_EVENT_DETAILS = {
  scenario_select: ["engineering", "client", "learning"],
  source_expand: ["engineering", "client", "learning"],
  comparison_select: ["files", "llm-wiki", "obsidian", "notion", "notebooklm"],
  product_view_select: ["graph", "wiki", "review"],
  product_image_open: ["graph", "wiki", "review"],
  waitlist_error: ["required", "invalid", "notConfigured", "unknown"],
} as const;

export type SiteEventDetail =
  (typeof SITE_EVENT_DETAILS)[keyof typeof SITE_EVENT_DETAILS][number];

export type SiteEventInput = {
  event: SiteEventName;
  placement: SiteEventPlacement;
  locale: Locale;
  context: SiteEventContext;
  page: string;
  source: SiteEventSource;
  detail?: SiteEventDetail;
  asset_id?: string;
  release_tag?: string;
};

export type ValidatedSiteEvent = Readonly<SiteEventInput> & {
  readonly field: string;
};

export type SiteEventValidationFailure = {
  readonly ok: false;
  readonly code:
    | "invalid_json_shape"
    | "unknown_field"
    | "invalid_value"
    | "invalid_page"
    | "invalid_release";
  readonly message: string;
};

export type SiteEventValidationOptions = {
  readonly pages?: ReadonlyMap<string, Locale>;
  /** Allow semver release tags retained in historical aggregate exports. */
  readonly allowHistoricalReleaseTag?: boolean;
  /** Use the frozen v1 vocabulary while parsing an export. */
  readonly allowHistoricalVocabulary?: boolean;
};

export type SiteEventValidationResult =
  | { readonly ok: true; readonly event: ValidatedSiteEvent }
  | SiteEventValidationFailure;

const LOCALE_SET = new Set<string>(SUPPORTED_LOCALES);
const RELEASE_ASSET_SET = new Set<string>(WENLAN_RELEASE.assets.map((asset) => asset.id));
const HISTORY_PAGE_MAP = new Map<string, Locale>(
  Object.entries(history.paths).map(([pathname, locale]) => [pathname, locale as Locale]),
);
const HISTORY_ASSET_SET = new Set<string>(history.assetIds);
const HISTORY_EVENT_SET = new Set<string>(history.events);
const HISTORY_PLACEMENT_SET = new Set<string>(history.placements);
const HISTORY_CONTEXT_SET = new Set<string>(history.contexts);
const HISTORY_SOURCE_SET = new Set<string>(history.sources);
const HISTORY_DETAIL_MAP = new Map<string, ReadonlySet<string>>(
  Object.entries(history.details).map(([event, details]) => [event, new Set(details)]),
);
const BASE_FIELDS = ["event", "placement", "locale", "context", "page", "source"] as const;
const ALL_FIELDS = new Set<string>([
  ...BASE_FIELDS,
  "detail",
  "asset_id",
  "release_tag",
]);

function hasOwn(value: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function failure(
  code: SiteEventValidationFailure["code"],
  message: string,
): SiteEventValidationFailure {
  return { ok: false, code, message };
}

function currentVocabulary() {
  return {
    events: new Set<string>(SITE_EVENT_NAMES),
    placements: new Set<string>(SITE_EVENT_PLACEMENTS),
    contexts: new Set<string>(SITE_EVENT_CONTEXTS),
    sources: new Set<string>(SITE_EVENT_SOURCES),
    details: new Map<string, ReadonlySet<string>>(
      Object.entries(SITE_EVENT_DETAILS).map(([event, details]) => [event, new Set(details)]),
    ),
  };
}

function assertSubset(
  label: string,
  current: ReadonlySet<string>,
  historical: ReadonlySet<string>,
): void {
  for (const value of current) {
    if (!historical.has(value)) {
      throw new Error(`site event history is missing current ${label}: ${value}`);
    }
  }
}

/** Guard the frozen v1 snapshot against losing a newly collected value. */
export function assertHistoricalSiteEventVocabularyComplete(): void {
  const current = currentVocabulary();
  assertSubset("event", current.events, HISTORY_EVENT_SET);
  assertSubset("placement", current.placements, HISTORY_PLACEMENT_SET);
  assertSubset("context", current.contexts, HISTORY_CONTEXT_SET);
  assertSubset("source", current.sources, HISTORY_SOURCE_SET);
  for (const [event, details] of current.details) {
    const historical = HISTORY_DETAIL_MAP.get(event);
    if (!historical) throw new Error(`site event history is missing details for current event: ${event}`);
    assertSubset(`detail for ${event}`, details, historical);
  }
}

export function historicalSiteEventVocabulary(): {
  readonly events: ReadonlySet<string>;
  readonly placements: ReadonlySet<string>;
  readonly contexts: ReadonlySet<string>;
  readonly sources: ReadonlySet<string>;
  readonly details: ReadonlyMap<string, ReadonlySet<string>>;
} {
  return {
    events: new Set(HISTORY_EVENT_SET),
    placements: new Set(HISTORY_PLACEMENT_SET),
    contexts: new Set(HISTORY_CONTEXT_SET),
    sources: new Set(HISTORY_SOURCE_SET),
    details: new Map([...HISTORY_DETAIL_MAP].map(([event, details]) => [event, new Set(details)])),
  };
}

assertHistoricalSiteEventVocabularyComplete();

/**
 * The sitemap is the server-owned page allow-list. It is intentionally
 * computed from the same source as the generated sitemap rather than from a
 * client-provided list or an independently maintained route list.
 */
export function canonicalSitemapPages(): ReadonlyMap<string, Locale> {
  const pages = new Map<string, Locale>();
  for (const entry of sitemap()) {
    const url = new URL(String(entry.url));
    if (url.origin !== SITE_URL || url.search || url.hash) continue;
    const { locale } = stripLocalePrefix(url.pathname);
    pages.set(normalizePagePath(url.pathname), locale);
  }
  return pages;
}

export function historicalSitemapPages(): ReadonlyMap<string, Locale> {
  return HISTORY_PAGE_MAP;
}

export function historicalReleaseAssetIds(): ReadonlySet<string> {
  return HISTORY_ASSET_SET;
}

function normalizePagePath(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
}

function stringField(value: unknown, allowed: ReadonlySet<string>): value is string {
  return typeof value === "string" && allowed.has(value);
}

/**
 * Validate and normalize one event. The returned field has stable property
 * order so Postgres stores aggregate counters, never raw per-request rows.
 */
export function validateSiteEvent(
  value: unknown,
  options: SiteEventValidationOptions = {},
): SiteEventValidationResult {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return failure("invalid_json_shape", "event must be a JSON object");
  }

  const input = value as Record<string, unknown>;
  for (const key of Object.keys(input)) {
    if (!ALL_FIELDS.has(key)) return failure("unknown_field", "unknown event field");
  }
  for (const key of BASE_FIELDS) {
    if (!hasOwn(input, key)) return failure("invalid_json_shape", "missing event field");
  }

  const allowHistorical = options.allowHistoricalVocabulary === true || options.allowHistoricalReleaseTag === true;
  const current = currentVocabulary();
  const eventSet = allowHistorical
    ? new Set([...current.events, ...HISTORY_EVENT_SET])
    : current.events;
  const placementSet = allowHistorical
    ? new Set([...current.placements, ...HISTORY_PLACEMENT_SET])
    : current.placements;
  const contextSet = allowHistorical
    ? new Set([...current.contexts, ...HISTORY_CONTEXT_SET])
    : current.contexts;
  const sourceSet = allowHistorical
    ? new Set([...current.sources, ...HISTORY_SOURCE_SET])
    : current.sources;
  const detailMap = allowHistorical
    ? new Map([...HISTORY_DETAIL_MAP, ...current.details].map(([event, details]) => [
        event,
        new Set([...(HISTORY_DETAIL_MAP.get(event) ?? []), ...details]),
      ]))
    : current.details;

  if (!stringField(input.event, eventSet)) return failure("invalid_value", "invalid event");
  if (!stringField(input.placement, placementSet)) {
    return failure("invalid_value", "invalid placement");
  }
  if (!stringField(input.locale, LOCALE_SET)) return failure("invalid_value", "invalid locale");
  if (!stringField(input.context, contextSet)) return failure("invalid_value", "invalid context");
  if (!stringField(input.source, sourceSet)) return failure("invalid_value", "invalid source");

  if (typeof input.page !== "string" || !input.page.startsWith("/") || input.page.includes("?") || input.page.includes("#")) {
    return failure("invalid_page", "invalid page");
  }
  const currentPages = options.pages ?? canonicalSitemapPages();
  const pages = allowHistorical
    ? new Map([...HISTORY_PAGE_MAP, ...currentPages])
    : currentPages;
  const page = normalizePagePath(input.page);
  if (pages.get(page) !== input.locale) {
    return failure("invalid_page", "page is not a canonical sitemap path for locale");
  }

  const event = input.event as SiteEventName;
  const detailPresent = hasOwn(input, "detail");
  const detailValues = detailMap.get(event);
  if (detailValues) {
    if (!detailPresent || typeof input.detail !== "string" || !detailValues.has(input.detail)) {
      return failure("invalid_value", "invalid event detail");
    }
  } else if (detailPresent) {
    return failure("invalid_value", "detail is not allowed for this event");
  }

  const assetPresent = hasOwn(input, "asset_id");
  const releasePresent = hasOwn(input, "release_tag");
  if (assetPresent !== releasePresent) {
    return failure("invalid_release", "release asset and tag must be supplied together");
  }
  if (assetPresent) {
    const historicalReleaseTag =
      allowHistorical &&
      typeof input.release_tag === "string" &&
      /^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(input.release_tag);
    const allowedAssetIds = allowHistorical
      ? new Set([...RELEASE_ASSET_SET, ...HISTORY_ASSET_SET])
      : RELEASE_ASSET_SET;
    if (
      event !== "github_outbound" ||
      typeof input.asset_id !== "string" ||
      !allowedAssetIds.has(input.asset_id) ||
      (input.release_tag !== WENLAN_RELEASE.tag && !historicalReleaseTag)
    ) {
      return failure("invalid_release", "invalid release metadata");
    }
  }

  const normalized: Record<string, string> = {
    event,
    placement: input.placement,
    locale: input.locale,
    context: input.context,
    page,
    source: input.source,
  };
  if (detailValues) normalized.detail = input.detail as string;
  if (assetPresent) {
    normalized.asset_id = input.asset_id as string;
    normalized.release_tag = input.release_tag as string;
  }

  return {
    ok: true,
    event: {
      ...(normalized as SiteEventInput),
      field: JSON.stringify(normalized),
    },
  };
}
