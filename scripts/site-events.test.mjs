import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { handleSiteEventsRequest } from "../src/lib/site-events-handler.ts";
import {
  SITE_EVENTS_MAX_BODY_BYTES,
  SITE_EVENT_CONTEXTS,
  SITE_EVENT_DETAILS,
  SITE_EVENT_NAMES,
  SITE_EVENT_PLACEMENTS,
  SITE_EVENT_SOURCES,
  assertHistoricalSiteEventVocabularyComplete,
  canonicalSitemapPages,
  historicalReleaseAssetIds,
  historicalSiteEventVocabulary,
  historicalSitemapPages,
  validateSiteEvent,
} from "../src/lib/site-events-schema.ts";
import {
  checkSiteEventsHealth,
  createSiteEventsStore,
  getSiteEventsConfig,
  siteEventsStorageMetadata,
} from "../src/lib/site-events-store.ts";
import {
  buildSiteEventsMetadata,
  fetchSiteEventsMetadata,
  main as fetchSiteEventsMain,
  parseHash,
} from "./seo-site-events-fetch.mjs";
import { WENLAN_RELEASE } from "../src/lib/releases.ts";

const pages = new Map([
  ["/", "en"],
  ["/zh-TW", "zh-TW"],
  ["/learn/example", "en"],
  ["/zh-TW/learn/example", "zh-TW"],
]);

const baseEvent = {
  event: "video_play_click",
  placement: "home-demo",
  locale: "en",
  context: "home",
  page: "/",
  source: "direct",
};

function request(body = baseEvent, headers = {}) {
  return new Request("https://wenlan.app/api/site-events", {
    method: "POST",
    headers: {
      origin: "https://wenlan.app",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function acceptedStore() {
  return {
    config: { available: true, url: "https://test.supabase.co", token: "sb_secret_test", auth: "opaque" },
    record: async () => ({ status: "accepted" }),
    readDay: async () => [],
  };
}

test("schema rejects PII-shaped and unknown fields", () => {
  assert.equal(validateSiteEvent({ ...baseEvent, email: "person@example.com" }, { pages }).ok, false);
  assert.equal(validateSiteEvent({ ...baseEvent, referrer: "https://example.com" }, { pages }).ok, false);
  assert.equal(validateSiteEvent({ ...baseEvent, visitor_id: "abc" }, { pages }).ok, false);
});

test("v1 history contains every current sitemap page and release asset", () => {
  const historyPages = historicalSitemapPages();
  for (const [pathname, locale] of canonicalSitemapPages()) {
    assert.equal(historyPages.get(pathname), locale, pathname);
  }
  for (const asset of WENLAN_RELEASE.assets) {
    assert.equal(historicalReleaseAssetIds().has(asset.id), true, asset.id);
  }
});

test("v1 history captures the complete current vocabulary append-only", () => {
  assert.doesNotThrow(() => assertHistoricalSiteEventVocabularyComplete());
  const historyVocabulary = historicalSiteEventVocabulary();
  for (const value of SITE_EVENT_NAMES) assert.equal(historyVocabulary.events.has(value), true, value);
  for (const value of SITE_EVENT_PLACEMENTS) assert.equal(historyVocabulary.placements.has(value), true, value);
  for (const value of SITE_EVENT_CONTEXTS) assert.equal(historyVocabulary.contexts.has(value), true, value);
  for (const value of SITE_EVENT_SOURCES) assert.equal(historyVocabulary.sources.has(value), true, value);
  for (const [event, details] of Object.entries(SITE_EVENT_DETAILS)) {
    assert.deepEqual([...historyVocabulary.details.get(event)].sort(), [...details].sort(), event);
  }
});

test("historical exports survive current vocabulary removal or detail rename", () => {
  const removeFrom = (values, value, callback) => {
    const index = values.indexOf(value);
    assert.notEqual(index, -1, value);
    values.splice(index, 1, "renamed_current_value");
    try {
      return callback();
    } finally {
      values.splice(index, 1, value);
    }
  };
  const historicalOptions = { pages, allowHistoricalVocabulary: true };
  const historicalAlias = { pages, allowHistoricalReleaseTag: true };
  assert.equal(removeFrom(SITE_EVENT_NAMES, "video_play_click", () => validateSiteEvent(baseEvent, { pages }).ok), false);
  assert.equal(removeFrom(SITE_EVENT_NAMES, "video_play_click", () => validateSiteEvent(baseEvent, historicalOptions).ok), true);
  assert.equal(removeFrom(SITE_EVENT_PLACEMENTS, "home-demo", () => validateSiteEvent(baseEvent, { pages }).ok), false);
  assert.equal(removeFrom(SITE_EVENT_PLACEMENTS, "home-demo", () => validateSiteEvent(baseEvent, historicalAlias).ok), true);
  assert.equal(removeFrom(SITE_EVENT_CONTEXTS, "home", () => validateSiteEvent(baseEvent, { pages }).ok), false);
  assert.equal(removeFrom(SITE_EVENT_CONTEXTS, "home", () => validateSiteEvent(baseEvent, historicalOptions).ok), true);
  assert.equal(removeFrom(SITE_EVENT_SOURCES, "direct", () => validateSiteEvent(baseEvent, { pages }).ok), false);
  assert.equal(removeFrom(SITE_EVENT_SOURCES, "direct", () => validateSiteEvent(baseEvent, historicalOptions).ok), true);

  const scenarioDetails = SITE_EVENT_DETAILS.scenario_select;
  const detailIndex = scenarioDetails.indexOf("engineering");
  (scenarioDetails).splice(detailIndex, 1, "renamed_detail");
  try {
    const scenario = { ...baseEvent, event: "scenario_select", placement: "home-scenario", detail: "engineering" };
    assert.equal(validateSiteEvent(scenario, { pages }).ok, false);
    assert.equal(validateSiteEvent(scenario, historicalOptions).ok, true);
  } finally {
    scenarioDetails.splice(detailIndex, 1, "engineering");
  }
});

test("schema enforces page, locale, detail, and release contracts", () => {
  assert.equal(validateSiteEvent({ ...baseEvent, page: "https://wenlan.app/" }, { pages }).ok, false);
  assert.equal(validateSiteEvent({ ...baseEvent, locale: "zh-TW" }, { pages }).ok, false);
  assert.equal(validateSiteEvent({ ...baseEvent, detail: "engineering" }, { pages }).ok, false);
  assert.equal(validateSiteEvent({ ...baseEvent, event: "scenario_select", placement: "home-scenario", detail: "engineering" }, { pages }).ok, true);
  assert.equal(validateSiteEvent({ ...baseEvent, event: "scenario_select", placement: "home-scenario" }, { pages }).ok, false);
  assert.equal(validateSiteEvent({ ...baseEvent, asset_id: "macos-arm64" }, { pages }).ok, false);
  assert.equal(validateSiteEvent({ ...baseEvent, event: "github_outbound", asset_id: "macos-arm64", release_tag: WENLAN_RELEASE.tag }, { pages }).ok, true);
});

test("site endpoint has privacy, origin, method, and body-size guards", async () => {
  assert.equal((await handleSiteEventsRequest(request(), { store: acceptedStore(), env: { NODE_ENV: "production" }, now: () => new Date("2026-09-08T00:00:00Z") })).status, 204);
  assert.equal((await handleSiteEventsRequest(request(baseEvent, { dnt: "1" }), { env: { NODE_ENV: "production" } })).status, 204);
  assert.equal((await handleSiteEventsRequest(request(baseEvent, { "sec-gpc": "1" }), { env: { NODE_ENV: "production" } })).status, 204);
  assert.equal((await handleSiteEventsRequest(new Request("https://wenlan.app/api/site-events", { method: "GET", headers: { origin: "https://wenlan.app" } }), { env: { NODE_ENV: "production" } })).status, 405);
  assert.equal((await handleSiteEventsRequest(request(baseEvent, { origin: "https://evil.example" }), { store: acceptedStore(), env: { NODE_ENV: "production" } })).status, 403);
  const oversize = { ...baseEvent, page: `/${"a".repeat(SITE_EVENTS_MAX_BODY_BYTES)}` };
  assert.equal((await handleSiteEventsRequest(request(oversize), { store: acceptedStore(), env: { NODE_ENV: "production" } })).status, 413);
  assert.equal((await handleSiteEventsRequest(new Request("https://preview.example/api/site-events", { method: "POST", headers: { origin: "https://wenlan.app", "content-type": "application/json" }, body: JSON.stringify(baseEvent) }), { store: acceptedStore(), env: { NODE_ENV: "production" } })).status, 403);
});

test("local origin is strict and broken streams are generic bad requests", async () => {
  const local = new Request("http://localhost:3000/api/site-events", { method: "POST", headers: { origin: "http://localhost:3000", "content-type": "application/json" }, body: JSON.stringify({ ...baseEvent, page: "/zh-TW/" }) });
  const localEvent = { ...baseEvent, locale: "zh-TW", page: "/zh-TW/" };
  const localRequest = new Request("http://localhost:3000/api/site-events", { method: "POST", headers: { origin: "http://localhost:3000", "content-type": "application/json" }, body: JSON.stringify(localEvent) });
  assert.equal((await handleSiteEventsRequest(localRequest, { store: acceptedStore(), env: { NODE_ENV: "development" } })).status, 204);
  assert.equal(local.bodyUsed, false);
  const stream = new ReadableStream({ pull() { throw new Error("broken"); } });
  const broken = new Request("https://wenlan.app/api/site-events", { method: "POST", headers: { origin: "https://wenlan.app", "content-type": "application/json" }, body: stream, duplex: "half" });
  assert.equal((await handleSiteEventsRequest(broken, { store: acceptedStore(), env: { NODE_ENV: "production" } })).status, 400);
});

test("endpoint does not claim success when disabled or storage fails", async () => {
  assert.equal((await handleSiteEventsRequest(request(), { env: { NODE_ENV: "production" } })).status, 503);
  const failing = { ...acceptedStore(), record: async () => ({ status: "error" }) };
  assert.equal((await handleSiteEventsRequest(request(), { store: failing, env: { NODE_ENV: "production" } })).status, 503);
  const capped = { ...acceptedStore(), record: async () => ({ status: "capped", cap: "day" }) };
  assert.equal((await handleSiteEventsRequest(request(), { store: capped, env: { NODE_ENV: "production" } })).status, 429);
});

test("production config requires an exact Supabase endpoint and server-only key", () => {
  assert.deepEqual(getSiteEventsConfig({ SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "http://test.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" }), { available: false, reason: "misconfigured" });
  assert.deepEqual(getSiteEventsConfig({ SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co/path", SUPABASE_SECRET_KEY: "sb_secret_test" }), { available: false, reason: "misconfigured" });
  assert.deepEqual(getSiteEventsConfig({ SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co:443", SUPABASE_SECRET_KEY: "sb_secret_test" }), { available: false, reason: "misconfigured" });
  assert.deepEqual(getSiteEventsConfig({ SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: " sb_secret_test" }), { available: false, reason: "misconfigured" });
  assert.deepEqual(getSiteEventsConfig({ SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: "sb_publishable_test" }), { available: false, reason: "misconfigured" });
  assert.deepEqual(getSiteEventsConfig({ SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: "garbage" }), { available: false, reason: "misconfigured" });
  assert.deepEqual(getSiteEventsConfig({ SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" }), { available: true, url: "https://test.supabase.co", token: "sb_secret_test", auth: "opaque" });
});

test("store sends one RPC aggregate request and maps accepted response", async () => {
  const calls = [];
  const fakeFetch = async (url, init) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ status: "accepted" }), { status: 200 });
  };
  const store = createSiteEventsStore({
    env: { SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" },
    fetchImpl: fakeFetch,
  });
  const validated = validateSiteEvent(baseEvent, { pages });
  assert.equal(validated.ok, true);
  assert.deepEqual(await store.record(validated.event, new Date("2026-09-08T12:34:00Z")), { status: "accepted" });
  assert.equal(calls[0].url, "https://test.supabase.co/rest/v1/rpc/record_site_event_v1");
  assert.equal(calls[0].init.headers.apikey, "sb_secret_test");
  assert.equal(Object.hasOwn(calls[0].init.headers, "authorization"), false);
  assert.deepEqual(JSON.parse(calls[0].init.body), { p_field: validated.event.field });
});

test("store accepts only exact RPC result shapes and preserves cap reasons", async () => {
  const env = { SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" };
  const validated = validateSiteEvent(baseEvent, { pages });
  assert.equal(validated.ok, true);
  for (const [reply, expected] of [
    [[0, "minute"], { status: "capped", cap: "minute" }],
    [[0, "day"], { status: "capped", cap: "day" }],
  ]) {
    const store = createSiteEventsStore({ env, fetchImpl: async () => new Response(JSON.stringify({ status: "capped", cap: reply[1] }), { status: 200 }) });
    assert.deepEqual(await store.record(validated.event), expected);
  }
  for (const reply of [null, { status: "accepted", extra: true }, { status: "capped", cap: "other" }, [], [{ status: "accepted" }, { status: "accepted" }]]) {
    const store = createSiteEventsStore({ env, fetchImpl: async () => new Response(JSON.stringify(reply), { status: 200 }) });
    assert.deepEqual(await store.record(validated.event), { status: "error" });
  }
});

test("legacy service-role JWTs are validated and receive the only allowed bearer header", async () => {
  const token = "eyJhbGciOiJub25lIn0.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.signature";
  const config = getSiteEventsConfig({
    SITE_EVENTS_ENABLED: "1",
    SUPABASE_URL: "https://test.supabase.co",
    SUPABASE_SECRET_KEY: token,
  });
  assert.deepEqual(config, {
    available: true,
    url: "https://test.supabase.co",
    token,
    auth: "legacy-jwt",
  });
  const calls = [];
  const store = createSiteEventsStore({
    env: { SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: token },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ status: "accepted" }), { status: 200 });
    },
  });
  const validated = validateSiteEvent(baseEvent, { pages });
  assert.equal(validated.ok, true);
  await store.record(validated.event);
  assert.equal(calls[0].init.headers.apikey, token);
  assert.equal(calls[0].init.headers.authorization, `Bearer ${token}`);
});

test("readDay converts the JSON count map to the legacy flat alternating format", async () => {
  const field = JSON.stringify(baseEvent);
  const store = createSiteEventsStore({
    env: { SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" },
    fetchImpl: async (_url, init) => {
      assert.deepEqual(JSON.parse(init.body), { p_day: "2026-09-08" });
      return new Response(JSON.stringify({ [field]: 2, __saturated_minute: 1, __saturated_day: 1 }), { status: 200 });
    },
  });
  assert.deepEqual(await store.readDay("2026-09-08"), [field, "2", "__saturated_minute", "1", "__saturated_day", "1"]);

  const missing = createSiteEventsStore({
    env: { SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" },
    fetchImpl: async () => new Response("null", { status: 200 }),
  });
  assert.deepEqual(await missing.readDay("2026-09-07"), []);

  const malformed = createSiteEventsStore({
    env: { SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" },
    fetchImpl: async () => new Response(JSON.stringify({ [field]: -1 }), { status: 200 }),
  });
  await assert.rejects(() => malformed.readDay("2026-09-08"), /malformed/);
});

test("health RPC is read-only at the client contract and requires an exact response", async () => {
  const calls = [];
  const env = { SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" };
  const result = await checkSiteEventsHealth({
    env,
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ schemaVersion: 1, storage: "postgres", ready: true }), { status: 200 });
    },
  });
  assert.deepEqual(result, { schemaVersion: 1, storage: "postgres", ready: true });
  assert.equal(calls[0].url, "https://test.supabase.co/rest/v1/rpc/site_events_health_v1");
  assert.deepEqual(JSON.parse(calls[0].init.body), {});
  assert.equal(Object.hasOwn(calls[0].init.headers, "authorization"), false);

  const extra = await checkSiteEventsHealth({
    env,
    fetchImpl: async () => new Response(JSON.stringify({ schemaVersion: 1, storage: "postgres", ready: true, writes: 0 }), { status: 200 }),
  });
  assert.equal(extra, null);
  assert.equal(siteEventsStorageMetadata().retentionDays, null);
});

test("metadata export keeps missing days unavailable rather than zero", async () => {
  const metadata = await fetchSiteEventsMetadata({
    reportDate: "2026-09-08",
    env: { SITE_EVENTS_ENABLED: "1", SUPABASE_URL: "https://test.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" },
    fetchImpl: async () => new Response(JSON.stringify({ result: [] }), { status: 200 }),
    generatedAt: "2026-09-08T00:00:00.000Z",
  });
  assert.equal(metadata.status, "partial");
  assert.equal(metadata.coverage.availableDays, 0);
  assert.equal(metadata.native.acceptedEvents, null);
  assert.equal(metadata.days["2026-09-07"].acceptedEvents, null);
  assert.equal(metadata.reportDate, "2026-09-08");
  assert.equal(metadata.window.endDate, "2026-09-07");
  assert.equal(metadata.coverage.complete, false);
  assert.equal(metadata.native.observedAcceptedEvents, 0);
  assert.equal(buildSiteEventsMetadata({ reportDate: "2026-09-08", config: { available: false, reason: "disabled" } }).status, "unavailable");
});

test("metadata rejects malformed or unvalidated Redis hash fields", () => {
  const validField = JSON.stringify(baseEvent);
  assert.equal(parseHash([validField, "1", "odd"]), null);
  assert.equal(parseHash([validField, "1", "not-json", "1"]), null);
  assert.equal(parseHash([JSON.stringify({ ...baseEvent, email: "private@example.com" }), "1"]), null);
  assert.equal(parseHash([validField, "9007199254740992"]), null);
  assert.equal(parseHash(["__saturated_day", "0"]), null);
  assert.equal(parseHash([JSON.stringify({ ...baseEvent, event: "github_outbound", asset_id: "macos-arm64", release_tag: "v0.17.0" }), "1"])?.acceptedEvents, 1);
});

test("CLI requires a report date and rejects future dates or unknown flags", async (t) => {
  const outputDir = await mkdtemp(join(tmpdir(), "wenlan-site-events-test-"));
  t.after(() => rm(outputDir, { recursive: true, force: true }));
  const output = join(outputDir, "metadata.json");
  const now = new Date();
  const future = new Date(now);
  future.setUTCDate(future.getUTCDate() + 1);
  const futureDate = future.toISOString().slice(0, 10);
  const reportDate = now.toISOString().slice(0, 10);
  await assert.rejects(() => fetchSiteEventsMain(["--output", output], {}), /--date is required/);
  await assert.rejects(() => fetchSiteEventsMain(["--date", futureDate, "--output", output], {}), /future/);
  await assert.rejects(() => fetchSiteEventsMain(["--date", reportDate, "--wat", "value", "--output", output], {}), /unknown argument/);
});
