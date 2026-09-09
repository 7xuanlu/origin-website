#!/usr/bin/env node

import {
  checkAppEventsHealth,
  getAppEventsConfig,
} from "../src/lib/app-events-store.ts";

function isProductionEnabled(env) {
  return env.VERCEL_ENV === "production" && env.APP_EVENTS_ENABLED === "1";
}

function validHealth(health) {
  return health !== null
    && typeof health === "object"
    && !Array.isArray(health)
    && health.schemaVersion === 1
    && health.storage === "postgres"
    && health.ready === true
    && Object.keys(health).every((key) => ["schemaVersion", "storage", "ready"].includes(key));
}

export async function runAppEventsBuildCheck({
  env = process.env,
  healthCheck = checkAppEventsHealth,
  log = () => {},
} = {}) {
  if (!isProductionEnabled(env)) {
    log("[app-events-build-check] skip: non-production or disabled");
    return { status: "skipped" };
  }

  const config = getAppEventsConfig(env);
  if (!config.available) {
    throw new Error("app-events build check failed: server storage authentication is unavailable");
  }

  let health;
  try {
    health = await healthCheck({ env });
  } catch {
    throw new Error("app-events build check failed: schema health check failed");
  }
  if (!validHealth(health)) {
    throw new Error("app-events build check failed: schema health check failed");
  }

  log("[app-events-build-check] production storage health passed");
  return { status: "passed" };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runAppEventsBuildCheck({ log: console.log }).catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
