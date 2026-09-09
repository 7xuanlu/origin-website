import assert from "node:assert/strict";
import test from "node:test";

import { createAppEventsStore } from "../src/lib/app-events-store.ts";
import { runAppEventsBuildCheck } from "./app-events-build-check.mjs";

const enabledProduction = {
  VERCEL_ENV: "production",
  APP_EVENTS_ENABLED: "1",
  // Site collection has its own independent flag and must not be required.
  SITE_EVENTS_ENABLED: "0",
  SUPABASE_URL: "https://test.supabase.co",
  SUPABASE_SECRET_KEY: "sb_secret_test",
};

const healthy = { schemaVersion: 1, storage: "postgres", ready: true };

test("non-production and disabled app collection skip without checking storage", async () => {
  let calls = 0;
  const healthCheck = async () => { calls += 1; return healthy; };
  assert.deepEqual(
    await runAppEventsBuildCheck({ env: { ...enabledProduction, VERCEL_ENV: "preview" }, healthCheck }),
    { status: "skipped" },
  );
  assert.deepEqual(
    await runAppEventsBuildCheck({ env: { VERCEL_ENV: "production", APP_EVENTS_ENABLED: "0" }, healthCheck }),
    { status: "skipped" },
  );
  assert.equal(calls, 0);
});

test("enabled production app collection requires authenticated server storage", async () => {
  let calls = 0;
  await assert.rejects(
    () => runAppEventsBuildCheck({
      env: { ...enabledProduction, SUPABASE_SECRET_KEY: undefined },
      healthCheck: async () => { calls += 1; return healthy; },
    }),
    /server storage authentication is unavailable/,
  );
  assert.equal(calls, 0);
});

test("enabled production app collection passes only after ready Postgres schema health", async () => {
  const calls = [];
  const result = await runAppEventsBuildCheck({
    env: enabledProduction,
    healthCheck: async (options) => { calls.push(options); return healthy; },
  });
  assert.deepEqual(result, { status: "passed" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].env, enabledProduction);
});

test("unhealthy, malformed, or extra health fields fail closed with generic errors", async () => {
  for (const health of [
    null,
    { schemaVersion: 1, storage: "postgres", ready: false },
    { schemaVersion: 2, storage: "postgres", ready: true },
    { schemaVersion: 1, storage: "redis", ready: true },
    { schemaVersion: 1, storage: "postgres", ready: true, secret: "sb_secret_private-response" },
  ]) {
    await assert.rejects(
      () => runAppEventsBuildCheck({ env: enabledProduction, healthCheck: async () => health }),
      (error) => error.message === "app-events build check failed: schema health check failed",
    );
  }
  await assert.rejects(
    () => runAppEventsBuildCheck({
      env: enabledProduction,
      healthCheck: async () => { throw new Error("sb_secret_private-response"); },
    }),
    (error) => {
      assert.equal(error.message, "app-events build check failed: schema health check failed");
      assert.doesNotMatch(error.message, /sb_secret_private-response/);
      return true;
    },
  );
});

test("readDay rejects aggregate buckets whose native counters do not sum to operation_count", async () => {
  const store = createAppEventsStore({
    env: enabledProduction,
    fetchImpl: async () => new Response(JSON.stringify({
      day: "2026-09-08",
      version_buckets: { "0.18.0": { macos: { daemon_ready: 2 } } },
      batch_count: 1,
      operation_count: 3,
      saturated_minute: false,
      saturated_batch_day: false,
      saturated_operation_day: false,
      saturated_version_day: false,
    }), { status: 200 }),
  });
  await assert.rejects(() => store.readDay("2026-09-08"), /malformed/);
});
