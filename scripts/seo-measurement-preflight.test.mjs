import assert from "node:assert/strict";
import test from "node:test";
import { parseArgs, runMeasurementPreflight } from "./seo-measurement-preflight.mjs";

const enabledEnv = {
  RESEND_API_KEY: "re_test_secret",
  RESEND_AUDIENCE_ID: "audience-secret",
  RESEND_ACQUISITION_PROPERTIES_ENABLED: "1",
  SITE_EVENTS_ENABLED: "1",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SECRET_KEY: "sb_secret_test_secret",
};

const fixedNow = () => new Date("2026-09-08T12:34:56.000Z");

test("missing configuration is redacted and does not attempt live probes", async () => {
  const calls = [];
  const result = await runMeasurementPreflight({
    env: {},
    live: true,
    now: fixedNow,
    fetchImpl: async (...args) => {
      calls.push(args);
      throw new Error("network must not be called");
    },
  });

  assert.equal(calls.length, 0);
  assert.equal(result.resend.configuration.status, "unchecked");
  assert.equal(result.siteEvents.configuration.status, "disabled");
  assert.equal(result.resend.domains.status, "unchecked");
  assert.equal(result.resend.contactProperties.missing, null);
  assert.equal(result.status, "unchecked");
  assert.doesNotMatch(JSON.stringify(result), /re_test_secret|audience-secret|sb_secret_test_secret/);
});

test("CLI live flag accepts the pnpm separator form and rejects duplicates", () => {
  assert.deepEqual(parseArgs(["--", "--live", "true", "--output", "/tmp/evidence.json"]), {
    live: true,
    output: "/tmp/evidence.json",
  });
  assert.throws(() => parseArgs(["--live", "true", "--live", "false"]), /unknown argument/);
});

test("offline is the default and never calls fetch", async () => {
  let calls = 0;
  const result = await runMeasurementPreflight({
    env: enabledEnv,
    now: fixedNow,
    fetchImpl: async () => {
      calls += 1;
      throw new Error("network must not be called");
    },
  });

  assert.equal(calls, 0);
  assert.equal(result.mode, "offline");
  assert.equal(result.resend.configuration.status, "configured");
  assert.equal(result.resend.domains.status, "unchecked");
  assert.equal(result.siteEvents.ping.status, "unchecked");
  assert.equal(result.resend.contactProperties.missing, null);
  assert.equal(result.status, "configured");
  assert.equal(result.summary.readiness, "not_assessed");
});

test("live probes are bounded, redacted, and separate readable contacts from delivery", async () => {
  const calls = [];
  const responses = [
    {
      data: [{ id: "domain-secret", name: "secret.example", status: "verified" }],
      has_more: false,
    },
    {
      data: [
        { id: "property-secret", key: "signup_locale" },
        { id: "property-secret-2", key: "signup_landing_path" },
        { id: "property-secret-3", key: "signup_referrer_host" },
        { id: "property-secret-4", key: "signup_utm_source" },
        { id: "property-secret-5", key: "signup_utm_medium" },
        { id: "property-secret-6", key: "signup_utm_campaign" },
        { id: "private-extra", key: "do-not-output" },
      ],
      has_more: false,
    },
    { data: [{ id: "contact-secret", email: "person@example.com" }], has_more: true },
    { schemaVersion: 1, storage: "postgres", ready: true },
  ];
  const result = await runMeasurementPreflight({
    env: enabledEnv,
    live: true,
    now: fixedNow,
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return new Response(JSON.stringify(responses[calls.length - 1]), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    },
  });

  assert.equal(calls.length, 4);
  assert.deepEqual(calls.map(({ url }) => url), [
    "https://api.resend.com/domains?limit=100",
    "https://api.resend.com/contact-properties?limit=100",
    "https://api.resend.com/audiences/audience-secret/contacts?limit=1",
    "https://example.supabase.co/rest/v1/rpc/site_events_health_v1",
  ]);
  assert.equal(calls[0].options.method, "GET");
  assert.equal(calls[0].options.redirect, "error");
  assert.equal(calls[0].options.headers.authorization, "Bearer re_test_secret");
  assert.equal(calls[3].options.method, "POST");
  assert.deepEqual(JSON.parse(calls[3].options.body), {});
  assert.equal(calls[3].options.headers.apikey, "sb_secret_test_secret");
  assert.equal(calls[3].options.headers.authorization, undefined);
  assert.equal(result.siteEvents.ping.status, "successful");
  assert.equal(result.resend.domains.statuses[0], "verified");
  assert.deepEqual(result.resend.contactProperties.present, [
    "signup_locale",
    "signup_landing_path",
    "signup_referrer_host",
    "signup_utm_source",
    "signup_utm_medium",
    "signup_utm_campaign",
  ]);
  assert.equal(result.resend.contacts.readable, true);
  assert.equal(result.resend.contacts.hasAny, true);
  assert.equal(result.resend.contacts.has_more, true);
  assert.equal(result.resend.contacts.incomplete, true);
  assert.equal(result.resend.contacts.email, undefined);
  assert.deepEqual(result.resend.contactProperties.missing, []);
  assert.match(result.limitations.join(" "), /not an email delivery/i);
  assert.doesNotMatch(JSON.stringify(result), /secret|person@example\.com|do-not-output/);
});

test("redirects and forbidden Supabase URLs are rejected without fetch", async () => {
  const calls = [];
  const result = await runMeasurementPreflight({
    env: {
      ...enabledEnv,
      SUPABASE_URL: "http://evil.example/redirect",
    },
    live: true,
    fetchImpl: async (...args) => {
      calls.push(args);
      throw new Error("network must not be called");
    },
  });

  assert.equal(calls.length, 3);
  assert.equal(result.siteEvents.configuration.status, "unchecked");
  assert.equal(result.siteEvents.configuration.reason, "misconfigured");
  assert.equal(result.siteEvents.ping.status, "unchecked");
  assert.doesNotMatch(JSON.stringify(result), /evil|sb_secret_test_secret|redirect/);
});

test("legacy service-role JWTs receive Authorization while new secret keys do not", async () => {
  const calls = [];
  const legacyJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.signature";
  const result = await runMeasurementPreflight({
    env: {
      SITE_EVENTS_ENABLED: "1",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SECRET_KEY: legacyJwt,
    },
    live: true,
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return new Response(JSON.stringify({ schemaVersion: 1, storage: "postgres", ready: true }));
    },
  });

  assert.equal(result.siteEvents.ping.status, "successful");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.headers.apikey, legacyJwt);
  assert.equal(calls[0].options.headers.authorization, `Bearer ${legacyJwt}`);
  assert.doesNotMatch(JSON.stringify(result), /service_role|signature/);
});

test("empty domains and missing acquisition properties remain successful but explicit", async () => {
  const result = await runMeasurementPreflight({
    env: enabledEnv,
    live: true,
    fetchImpl: async (url) => {
      const path = new URL(url).pathname;
      if (path === "/domains") return new Response(JSON.stringify({ data: [], has_more: false }));
      if (path === "/contact-properties") {
        return new Response(JSON.stringify({
          data: [{ id: "one", key: "signup_locale" }],
          has_more: false,
        }));
      }
      if (path.includes("/contacts")) return new Response(JSON.stringify({ data: [], has_more: false }));
      return new Response(JSON.stringify({ schemaVersion: 1, storage: "postgres", ready: true }));
    },
  });

  assert.equal(result.resend.domains.status, "successful");
  assert.deepEqual(result.resend.domains.statuses, []);
  assert.equal(result.resend.domains.hasAny, false);
  assert.equal(result.resend.contactProperties.status, "successful");
  assert.deepEqual(result.resend.contactProperties.missing, [
    "signup_landing_path",
    "signup_referrer_host",
    "signup_utm_source",
    "signup_utm_medium",
    "signup_utm_campaign",
  ]);
  assert.equal(result.resend.contacts.status, "successful");
  assert.equal(result.resend.contacts.hasAny, false);
  assert.equal(result.siteEvents.clientConfiguration.scope, "build_time_only");
  assert.equal(result.siteEvents.clientConfiguration.deployed, null);
});

test("provider failures and malformed responses are summaries, not thrown bodies", async () => {
  const result = await runMeasurementPreflight({
    env: enabledEnv,
    live: true,
    fetchImpl: async (url) => {
      if (new URL(url).pathname === "/domains") {
        return new Response("provider-secret-body", { status: 503 });
      }
      return new Response(JSON.stringify({ unexpected: true }), { status: 200 });
    },
  });

  assert.equal(result.resend.domains.status, "failed");
  assert.equal(result.resend.domains.exercised, true);
  assert.equal(result.resend.domains.httpStatus, 503);
  assert.equal(result.resend.contactProperties.status, "unchecked");
  assert.equal(result.resend.contactProperties.missing, null);
  assert.equal(result.siteEvents.ping.status, "unchecked");
  assert.doesNotMatch(JSON.stringify(result), /provider-secret-body|sb_secret_test_secret|re_test_secret/);
});

test("unknown domain statuses and contact rows are unchecked without echoing provider data", async () => {
  const result = await runMeasurementPreflight({
    env: enabledEnv,
    live: true,
    fetchImpl: async (url) => {
      const path = new URL(url).pathname;
      if (path === "/domains") {
        return new Response(JSON.stringify({
          data: [{ id: "domain-secret", status: "provider-secret" }],
          has_more: false,
        }));
      }
      if (path === "/contact-properties") {
        return new Response(JSON.stringify({ data: [], has_more: false }));
      }
      if (path.includes("/contacts")) {
        return new Response(JSON.stringify({
          data: [{ id: "contact-secret" }],
          has_more: false,
        }));
      }
      return new Response(JSON.stringify({ schemaVersion: 1, storage: "postgres", ready: true }));
    },
  });

  assert.equal(result.resend.domains.status, "unchecked");
  assert.deepEqual(result.resend.domains.statuses, []);
  assert.equal(result.resend.contacts.status, "unchecked");
  assert.equal(result.resend.contacts.hasAny, null);
  assert.doesNotMatch(JSON.stringify(result), /provider-secret|contact-secret|person@example\.com/);
});

test("a bounded property page never turns unseen names into missing names", async () => {
  const result = await runMeasurementPreflight({
    env: enabledEnv,
    live: true,
    fetchImpl: async (url) => {
      const path = new URL(url).pathname;
      if (path === "/domains") return new Response(JSON.stringify({ data: [], has_more: false }));
      if (path === "/contact-properties") {
        return new Response(JSON.stringify({
          data: [{ id: "property-one", key: "signup_locale" }],
          has_more: true,
        }));
      }
      if (path.includes("/contacts")) return new Response(JSON.stringify({ data: [], has_more: false }));
      return new Response(JSON.stringify({ schemaVersion: 1, storage: "postgres", ready: true }));
    },
  });

  assert.equal(result.resend.contactProperties.status, "available");
  assert.equal(result.resend.contactProperties.has_more, true);
  assert.equal(result.resend.contactProperties.incomplete, true);
  assert.deepEqual(result.resend.contactProperties.present, ["signup_locale"]);
  assert.equal(result.resend.contactProperties.missing, null);
});
