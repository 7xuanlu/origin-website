import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  canonicalSitemapPages,
  validateSiteEvent,
} from "../src/lib/site-events-schema.ts";
import {
  createSiteEventsStore,
  getSiteEventsConfig,
  siteEventsStorageMetadata,
} from "../src/lib/site-events-store.ts";

const DEFAULT_OUTPUT = "/tmp/wenlan-seo/site-events-metadata.json";
const WINDOW_DAYS = 28;
const RESERVED_FIELDS = new Set(["__saturated_minute", "__saturated_day"]);

function parseArgs(argv) {
  const args = {};
  const known = new Set(["date", "output"]);
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--") continue;
    if (!token.startsWith("--")) throw new Error("unknown argument");
    const key = token.slice(2);
    if (!known.has(key) || Object.hasOwn(args, key)) throw new Error("unknown argument");
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error("missing argument value");
    args[key] = value;
    index += 1;
  }
  return args;
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function dateToday() {
  return new Date().toISOString().slice(0, 10);
}

function previousUtcDay(reportDate) {
  const date = new Date(`${reportDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

function datesThrough(endDate) {
  const end = new Date(`${endDate}T00:00:00.000Z`);
  return Array.from({ length: WINDOW_DAYS }, (_, index) => {
    const date = new Date(end);
    date.setUTCDate(end.getUTCDate() - (WINDOW_DAYS - 1 - index));
    return date.toISOString().slice(0, 10);
  });
}

function emptyDay() {
  return {
    available: false,
    acceptedEvents: null,
    counters: null,
    saturated: { minute: null, day: null },
  };
}

/**
 * Parse one store readDay response. The Supabase-backed store preserves the
 * flat alternating field/count shape so aggregate JSON keys can be validated
 * and re-normalized before entering the export.
 */
export function parseHash(values, pages = canonicalSitemapPages()) {
  if (!Array.isArray(values) || values.length === 0 || values.length % 2 !== 0) return null;
  if (!values.every((value) => typeof value === "string")) return null;

  const counters = {};
  const seenKeys = new Set();
  let acceptedEvents = 0;
  let minuteSaturated = false;
  let daySaturated = false;

  for (let index = 0; index < values.length; index += 2) {
    const key = values[index];
    const rawValue = values[index + 1];
    if (seenKeys.has(key)) return null;
    seenKeys.add(key);

    if (RESERVED_FIELDS.has(key)) {
      if (rawValue !== "1") return null;
      if (key === "__saturated_minute") minuteSaturated = true;
      else daySaturated = true;
      continue;
    }
    if (key.startsWith("__")) return null;
    if (!/^(0|[1-9]\d*)$/.test(rawValue)) return null;
    const count = Number(rawValue);
    if (!Number.isSafeInteger(count) || count < 0) return null;

    let parsed;
    try {
      parsed = JSON.parse(key);
    } catch {
      return null;
    }
    const validation = validateSiteEvent(parsed, {
      pages,
      allowHistoricalReleaseTag: true,
    });
    if (!validation.ok) return null;

    const normalizedKey = validation.event.field;
    const nextCount = (counters[normalizedKey] ?? 0) + count;
    if (!Number.isSafeInteger(nextCount)) return null;
    counters[normalizedKey] = nextCount;
    acceptedEvents += count;
    if (!Number.isSafeInteger(acceptedEvents)) return null;
  }

  return {
    available: true,
    acceptedEvents,
    counters,
    saturated: { minute: minuteSaturated, day: daySaturated },
  };
}

export function buildSiteEventsMetadata({
  reportDate = dateToday(),
  days,
  generatedAt = new Date().toISOString(),
  config = getSiteEventsConfig(),
} = {}) {
  const dates = days ?? datesThrough(previousUtcDay(reportDate));
  const byDay = Object.fromEntries(dates.map((date) => [date, emptyDay()]));
  const saturatedDays = [];
  const acceptedEventsByDay = Object.fromEntries(dates.map((date) => [date, null]));

  return {
    schemaVersion: 1,
    source: "Wenlan first-party event aggregates",
    scope: "wenlan.app",
    reportDate,
    generatedAt,
    window: {
      timezone: "UTC",
      startDate: dates[0],
      endDate: dates.at(-1),
      days: dates.length,
    },
    status: config.available ? "partial" : "unavailable",
    coverage: {
      requestedDays: dates.length,
      availableDays: 0,
      missingDays: dates,
      allDayKeysPresent: false,
      complete: false,
    },
    caps: {
      ...siteEventsStorageMetadata().globalCaps,
      saturatedDays,
    },
    native: {
      acceptedEventsByDay,
      observedAcceptedEvents: config.available ? 0 : null,
      acceptedEvents: null,
    },
    days: byDay,
    limitations: [
      "Counts are native accepted-event aggregates from the first-party store.",
      "Missing Postgres day records are unavailable, not zero.",
      "The Postgres store has no automatic retention expiry; operational retention is a separate policy.",
      "All-day key presence does not establish collection completeness or uptime.",
      "Global minute/day caps are abuse bounds, not bot detection, person verification, or unique counts.",
      "Accepted-event caps are ingestion abuse bounds, not cost caps.",
      "This export contains no visitors, rates, identity, or causal joins.",
    ],
  };
}

export async function fetchSiteEventsMetadata({
  reportDate,
  env = process.env,
  fetchImpl,
  generatedAt = new Date().toISOString(),
} = {}) {
  if (typeof reportDate !== "string" || !validDate(reportDate)) {
    throw new Error("date must be YYYY-MM-DD");
  }
  if (reportDate > dateToday()) throw new Error("date is in the future");

  const config = getSiteEventsConfig(env);
  const metadata = buildSiteEventsMetadata({ reportDate, generatedAt, config });
  if (!config.available) return metadata;

  const store = createSiteEventsStore({ env, fetchImpl });
  const dates = Object.keys(metadata.days);
  const pages = canonicalSitemapPages();
  for (const date of dates) {
    let values;
    try {
      values = await store.readDay(date);
    } catch {
      continue;
    }
    const parsed = parseHash(values, pages);
    if (!parsed) continue;
    metadata.days[date] = parsed;
    metadata.coverage.availableDays += 1;
    metadata.coverage.missingDays = metadata.coverage.missingDays.filter((missing) => missing !== date);
    metadata.native.acceptedEventsByDay[date] = parsed.acceptedEvents;
    metadata.native.observedAcceptedEvents += parsed.acceptedEvents;
    if (parsed.saturated.minute || parsed.saturated.day) metadata.caps.saturatedDays.push(date);
  }
  metadata.coverage.allDayKeysPresent = metadata.coverage.availableDays === metadata.coverage.requestedDays;
  metadata.coverage.complete = false;
  if (metadata.caps.saturatedDays.length > 0) metadata.status = "capped";
  else if (metadata.coverage.allDayKeysPresent) metadata.status = "observed";
  else metadata.status = "partial";
  const acceptedValues = Object.values(metadata.native.acceptedEventsByDay);
  metadata.native.acceptedEvents = acceptedValues.every((value) => value !== null)
    ? acceptedValues.reduce((sum, value) => sum + value, 0)
    : null;
  return metadata;
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv);
  if (typeof args.date !== "string") throw new Error("--date is required");
  const output = resolve(typeof args.output === "string" ? args.output : DEFAULT_OUTPUT);
  const metadata = await fetchSiteEventsMetadata({ reportDate: args.date, env });
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ status: metadata.status, output })}\n`);
  return metadata;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(() => {
    // Keep CLI failures generic; never print configuration or bearer tokens.
    process.stderr.write("site events export failed\n");
    process.exitCode = 1;
  });
}
