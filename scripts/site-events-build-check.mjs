#!/usr/bin/env node

import {
  checkSiteEventsHealth,
  getSiteEventsConfig,
} from "../src/lib/site-events-store.ts";

function isProductionEnabled(env) {
  return env.VERCEL_ENV === "production" && env.SITE_EVENTS_ENABLED === "1";
}

function validHealth(health) {
  return health !== null
    && typeof health === "object"
    && !Array.isArray(health)
    && health.schemaVersion === 1
    && health.storage === "postgres"
    && health.ready === true;
}

export async function runSiteEventsBuildCheck({
  env = process.env,
  healthCheck = checkSiteEventsHealth,
  log = () => {},
} = {}) {
  if (!isProductionEnabled(env)) {
    log("[site-events-build-check] skip: non-production or disabled");
    return { status: "skipped" };
  }

  if (env.NEXT_PUBLIC_SITE_EVENTS_ENABLED !== "1") {
    throw new Error("site-events build check failed: client build flag is disabled");
  }

  const config = getSiteEventsConfig(env);
  if (!config.available) {
    throw new Error("site-events build check failed: server storage authentication is unavailable");
  }

  let health;
  try {
    health = await healthCheck({ env });
  } catch {
    throw new Error("site-events build check failed: schema health check failed");
  }
  if (!validHealth(health)) {
    throw new Error("site-events build check failed: schema health check failed");
  }

  log("[site-events-build-check] production storage health passed");
  return { status: "passed" };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSiteEventsBuildCheck({ log: console.log }).catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
