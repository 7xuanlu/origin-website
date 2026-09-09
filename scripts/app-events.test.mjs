import test from "node:test";
import assert from "node:assert/strict";

import { handleAppEventsRequest } from "../src/lib/app-events-handler.ts";
import {
  APP_EVENTS_MAX_BODY_BYTES,
  validateAppEvent,
} from "../src/lib/app-events-schema.ts";
import {
  appEventsStorageMetadata,
  checkAppEventsHealth,
  createAppEventsStore,
  getAppEventsConfig,
} from "../src/lib/app-events-store.ts";

const validEvent = {
  schema_version: 1,
  app_version: "0.18.0",
  platform: "macos",
  counters: { daemon_ready: 1, save_success: 2, search_nonempty: 3 },
};

const enabledEnv = {
  NODE_ENV: "production",
  APP_EVENTS_ENABLED: "1",
  SUPABASE_URL: "https://test.supabase.co",
  SUPABASE_SECRET_KEY: "sb_secret_test",
};

function request(body = validEvent, headers = {}, url = "https://wenlan.app/api/app-events") {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function acceptedStore() {
  return {
    config: { available: true, url: "https://test.supabase.co", token: "sb_secret_test", auth: "opaque" },
    record: async () => ({ status: "accepted" }),
    readDay: async () => null,
  };
}

test("schema accepts the exact aggregate contract and rejects unknown fields, dates, and IDs", () => {
  assert.equal(validateAppEvent(validEvent).ok, true);
  for (const invalid of [
    { ...validEvent, date: "2026-09-08" },
    { ...validEvent, event_id: "abc" },
    { ...validEvent, client_id: "abc" },
    { ...validEvent, app_version: "v0.18.0" },
    { ...validEvent, app_version: "0.18.0-beta" },
    { ...validEvent, app_version: "0.18.0+build" },
    { ...validEvent, app_version: "000.18.0" },
    { ...validEvent, platform: "darwin" },
    { ...validEvent, counters: {} },
    { ...validEvent, counters: { daemon_ready: 0 } },
    { ...validEvent, counters: { daemon_ready: 1.5 } },
    { ...validEvent, counters: { daemon_ready: 1001 } },
    { ...validEvent, counters: { daemon_ready: 1000, save_success: 1 } },
    { ...validEvent, counters: { unknown_counter: 1 } },
  ]) {
    assert.equal(validateAppEvent(invalid).ok, false, JSON.stringify(invalid));
  }
  assert.equal(validateAppEvent({ ...validEvent, app_version: "999.999.999" }).ok, true);
  assert.equal(validateAppEvent({ ...validEvent, schema_version: 2 }).ok, false);
});

test("receiver accepts native no-Origin calls but rejects explicit Origin and preview hosts", async () => {
  assert.equal((await handleAppEventsRequest(request(), { env: enabledEnv, store: acceptedStore() })).status, 204);
  assert.equal((await handleAppEventsRequest(request(validEvent, { origin: "https://wenlan.app" }), { env: enabledEnv, store: acceptedStore() })).status, 403);
  assert.equal((await handleAppEventsRequest(request(validEvent, {}, "https://preview.wenlan.app/api/app-events"), { env: enabledEnv, store: acceptedStore() })).status, 403);
});

test("development loopback is allowed only outside Vercel", async () => {
  const dev = { ...enabledEnv, NODE_ENV: "development" };
  assert.equal((await handleAppEventsRequest(request(validEvent, {}, "http://localhost:3000/api/app-events"), { env: dev, store: acceptedStore() })).status, 204);
  assert.equal((await handleAppEventsRequest(request(validEvent, {}, "http://127.0.0.1:3000/api/app-events"), { env: { ...dev, VERCEL: "1" }, store: acceptedStore() })).status, 403);
  assert.equal((await handleAppEventsRequest(request(validEvent, {}, "http://localhost:3000/api/app-events"), { env: enabledEnv, store: acceptedStore() })).status, 403);
});

test("privacy opt-outs skip storage without requiring a body or content type", async () => {
  const store = {
    ...acceptedStore(),
    record: async () => { throw new Error("must not record opt-out"); },
  };
  const empty = new Request("https://wenlan.app/api/app-events", { method: "POST", headers: { dnt: "1" } });
  const gpc = new Request("https://wenlan.app/api/app-events", { method: "POST", headers: { "sec-gpc": "1" } });
  assert.equal((await handleAppEventsRequest(empty, { env: enabledEnv, store })).status, 204);
  assert.equal((await handleAppEventsRequest(gpc, { env: enabledEnv, store })).status, 204);
});

test("receiver enforces JSON MIME, streamed UTF-8 byte cap, and malformed JSON", async () => {
  assert.equal((await handleAppEventsRequest(request(validEvent, { "content-type": "text/plain" }), { env: enabledEnv, store: acceptedStore() })).status, 415);
  const oversized = new Uint8Array(APP_EVENTS_MAX_BODY_BYTES + 1).fill(0x20);
  const overRequest = new Request("https://wenlan.app/api/app-events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: oversized,
  });
  assert.equal((await handleAppEventsRequest(overRequest, { env: enabledEnv, store: acceptedStore() })).status, 413);
  const invalidUtf8 = new Request("https://wenlan.app/api/app-events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: new Uint8Array([0xc3, 0x28]),
  });
  assert.equal((await handleAppEventsRequest(invalidUtf8, { env: enabledEnv, store: acceptedStore() })).status, 400);
  assert.equal((await handleAppEventsRequest(new Request("https://wenlan.app/api/app-events", { method: "POST", headers: { "content-type": "application/json" }, body: "{} trailing" }), { env: enabledEnv, store: acceptedStore() })).status, 400);
});

test("receiver reports disabled, storage errors, and caps without claiming success", async () => {
  assert.equal((await handleAppEventsRequest(request(), { env: { NODE_ENV: "production" } })).status, 503);
  const failing = { ...acceptedStore(), record: async () => ({ status: "error" }) };
  assert.equal((await handleAppEventsRequest(request(), { env: enabledEnv, store: failing })).status, 503);
  const capped = { ...acceptedStore(), record: async () => ({ status: "capped", cap: "operations_day" }) };
  assert.equal((await handleAppEventsRequest(request(), { env: enabledEnv, store: capped })).status, 429);
});

test("app config maps only APP_EVENTS_ENABLED and keeps server Supabase validation", () => {
  assert.deepEqual(getAppEventsConfig({ SITE_EVENTS_ENABLED: "1" }), { available: false, reason: "disabled" });
  assert.deepEqual(getAppEventsConfig({ APP_EVENTS_ENABLED: "1", SUPABASE_URL: "http://test.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" }), { available: false, reason: "misconfigured" });
  assert.deepEqual(getAppEventsConfig(enabledEnv), { available: true, url: "https://test.supabase.co", token: "sb_secret_test", auth: "opaque" });
});

test("store sends aggregate counters through one bounded RPC and never follows redirects", async () => {
  const calls = [];
  const store = createAppEventsStore({
    env: enabledEnv,
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ status: "accepted" }), { status: 200 });
    },
  });
  const validated = validateAppEvent(validEvent);
  assert.equal(validated.ok, true);
  assert.deepEqual(await store.record(validated.event), { status: "accepted" });
  assert.equal(calls[0].url, "https://test.supabase.co/rest/v1/rpc/record_app_event_v1");
  assert.equal(calls[0].init.redirect, "error");
  assert.equal(calls[0].init.headers.apikey, "sb_secret_test");
  assert.equal(Object.hasOwn(calls[0].init.headers, "authorization"), false);
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    p_app_version: "0.18.0",
    p_platform: "macos",
    p_counters: { daemon_ready: 1, save_success: 2, search_nonempty: 3 },
  });
});

test("store maps exact cap results and health/read RPCs", async () => {
  const validated = validateAppEvent(validEvent);
  assert.equal(validated.ok, true);
  for (const cap of ["minute", "batch_day", "operations_day", "version_day"]) {
    const store = createAppEventsStore({ env: enabledEnv, fetchImpl: async () => new Response(JSON.stringify({ status: "capped", cap }), { status: 200 }) });
    assert.deepEqual(await store.record(validated.event), { status: "capped", cap });
  }
  const day = { day: "2026-09-08", version_buckets: { "0.18.0": { macos: { daemon_ready: 2 } } }, batch_count: 1, operation_count: 2, saturated_minute: false, saturated_batch_day: false, saturated_operation_day: false, saturated_version_day: false };
  const calls = [];
  const store = createAppEventsStore({ env: enabledEnv, fetchImpl: async (url, init) => {
    calls.push({ url, init });
    if (url.endsWith("health_v1")) return new Response(JSON.stringify({ schemaVersion: 1, storage: "postgres", ready: true }), { status: 200 });
    return new Response(JSON.stringify(day), { status: 200 });
  } });
  assert.deepEqual(await store.readDay("2026-09-08"), day);
  assert.deepEqual(await checkAppEventsHealth({ env: enabledEnv, fetchImpl: async () => new Response(JSON.stringify({ schemaVersion: 1, storage: "postgres", ready: true }), { status: 200 }) }), { schemaVersion: 1, storage: "postgres", ready: true });
  assert.equal(calls[0].init.redirect, "error");
});

test("store timeout is four seconds and degrades to an unavailable result", async () => {
  const validated = validateAppEvent(validEvent);
  assert.equal(validated.ok, true);
  let aborted = false;
  const store = createAppEventsStore({
    env: enabledEnv,
    fetchImpl: async (_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener("abort", () => { aborted = true; reject(new Error("aborted")); }, { once: true });
    }),
  });
  assert.deepEqual(await store.record(validated.event), { status: "error" });
  assert.equal(aborted, true);
});

test("metadata states that app values are aggregates, not people or website counters", () => {
  assert.deepEqual(appEventsStorageMetadata(), {
    namespace: "app-measurement:v1",
    storage: "supabase-postgres",
    retentionDays: null,
    caps: { batchesPerMinute: 60, batchesPerDay: 1000, operationsPerDay: 100000, versionBucketsPerDay: 20 },
  });
});
