import assert from "node:assert/strict";
import test from "node:test";
import { runSiteEventsBuildCheck } from "./site-events-build-check.mjs";

const enabledProduction = {
  VERCEL_ENV: "production",
  SITE_EVENTS_ENABLED: "1",
  NEXT_PUBLIC_SITE_EVENTS_ENABLED: "1",
  SUPABASE_URL: "https://test.supabase.co",
  SUPABASE_SECRET_KEY: "sb_secret_test",
};

const healthy = { schemaVersion: 1, storage: "postgres", ready: true };

test("non-production builds skip without checking storage", async () => {
  let calls = 0;
  const result = await runSiteEventsBuildCheck({
    env: { ...enabledProduction, VERCEL_ENV: "preview" },
    healthCheck: async () => { calls += 1; return healthy; },
  });
  assert.deepEqual(result, { status: "skipped" });
  assert.equal(calls, 0);
});

test("disabled production collection skips without requiring client flag or auth", async () => {
  let calls = 0;
  const result = await runSiteEventsBuildCheck({
    env: { VERCEL_ENV: "production", SITE_EVENTS_ENABLED: "0" },
    healthCheck: async () => { calls += 1; return healthy; },
  });
  assert.deepEqual(result, { status: "skipped" });
  assert.equal(calls, 0);
});

test("enabled production collection requires the client build flag", async () => {
  let calls = 0;
  await assert.rejects(
    () => runSiteEventsBuildCheck({
      env: { ...enabledProduction, NEXT_PUBLIC_SITE_EVENTS_ENABLED: "0" },
      healthCheck: async () => { calls += 1; return healthy; },
    }),
    /client build flag is disabled/,
  );
  assert.equal(calls, 0);
});

test("enabled production collection requires server storage authentication", async () => {
  let calls = 0;
  await assert.rejects(
    () => runSiteEventsBuildCheck({
      env: { ...enabledProduction, SUPABASE_SECRET_KEY: undefined },
      healthCheck: async () => { calls += 1; return healthy; },
    }),
    /server storage authentication is unavailable/,
  );
  assert.equal(calls, 0);
});

test("enabled production collection fails closed on unhealthy or malformed responses", async () => {
  for (const health of [
    null,
    { schemaVersion: 1, storage: "postgres", ready: false },
    { schemaVersion: 2, storage: "postgres", ready: true },
    { schemaVersion: 1, storage: "redis", ready: true },
  ]) {
    await assert.rejects(
      () => runSiteEventsBuildCheck({ env: enabledProduction, healthCheck: async () => health }),
      /schema health check failed/,
    );
  }
});

test("enabled production collection passes only after authenticated schema health", async () => {
  const calls = [];
  const result = await runSiteEventsBuildCheck({
    env: enabledProduction,
    healthCheck: async (options) => {
      calls.push(options);
      return healthy;
    },
  });
  assert.deepEqual(result, { status: "passed" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].env, enabledProduction);
});

test("health errors are generic and do not expose credentials", async () => {
  await assert.rejects(
    () => runSiteEventsBuildCheck({
      env: enabledProduction,
      healthCheck: async () => { throw new Error("sb_secret_private-response"); },
    }),
    (error) => {
      assert.equal(error.message, "site-events build check failed: schema health check failed");
      assert.doesNotMatch(error.message, /sb_secret_private-response/);
      return true;
    },
  );
});
