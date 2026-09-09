import assert from "node:assert/strict";
import test from "node:test";
import { eventSource, sendSiteEvent, SITE_EVENTS_DISABLED_STORAGE_KEY } from "../src/lib/site-event-client.ts";
import { trackAnalyticsEvent } from "../src/components/tracked-link.tsx";
import { LAUNCH_CHANNELS } from "../src/lib/launch-campaign.ts";

const event = { event: "github_outbound", placement: "home-hero", locale: "en", context: "home" };
const attribution = { signup_landing_path: "/", signup_referrer_host: "www.google.com", signup_utm_source: "", signup_utm_medium: "", signup_utm_campaign: "" };

function setup(t, href = "https://wenlan.app/?email=private@example.com#secret") {
  const previous = { window: globalThis.window, document: globalThis.document, fetch: globalThis.fetch, enabled: process.env.NEXT_PUBLIC_SITE_EVENTS_ENABLED };
  const calls = [];
  globalThis.window = { location: new URL(href), navigator: {}, umami: { track() { throw Error("offline"); } } };
  globalThis.document = { referrer: "https://www.google.com/private?token=not-for-events" };
  globalThis.fetch = async (...args) => { calls.push(args); return new Response(null, { status: 204 }); };
  process.env.NEXT_PUBLIC_SITE_EVENTS_ENABLED = "1";
  t.after(() => {
    globalThis.window = previous.window; globalThis.document = previous.document; globalThis.fetch = previous.fetch;
    if (previous.enabled === undefined) delete process.env.NEXT_PUBLIC_SITE_EVENTS_ENABLED;
    else process.env.NEXT_PUBLIC_SITE_EVENTS_ENABLED = previous.enabled;
  });
  return calls;
}

test("first-party events remove URL queries and never include attribution fields or identifiers", t => {
  const calls = setup(t);
  sendSiteEvent(event, attribution);
  assert.equal(calls.length, 1);
  const [url, request] = calls[0];
  assert.equal(url, "/api/site-events");
  assert.equal(request.credentials, "omit");
  assert.equal(request.keepalive, true);
  assert.deepEqual(JSON.parse(request.body), { ...event, page: "/", source: "google" });
  assert.doesNotMatch(request.body, /private|token|referrer|utm|email|session|visitor|secret/);
});

test("disabled, preview, DNT and GPC do not emit first-party events", t => {
  const calls = setup(t);
  process.env.NEXT_PUBLIC_SITE_EVENTS_ENABLED = "0";
  sendSiteEvent(event, attribution);
  process.env.NEXT_PUBLIC_SITE_EVENTS_ENABLED = "1";
  globalThis.window.location = new URL("https://preview.vercel.app");
  sendSiteEvent(event, attribution);
  globalThis.window.location = new URL("https://wenlan.app");
  globalThis.window.navigator.doNotTrack = "1";
  sendSiteEvent(event, attribution);
  delete globalThis.window.navigator.doNotTrack;
  globalThis.window.navigator.globalPrivacyControl = true;
  sendSiteEvent(event, attribution);
  assert.equal(calls.length, 0);
});

test("local opt-out suppresses first-party events", t => {
  assert.equal(SITE_EVENTS_DISABLED_STORAGE_KEY, "wenlan-site-events-disabled");
  const calls = setup(t);
  globalThis.window.localStorage = {
    getItem(key) {
      assert.equal(key, SITE_EVENTS_DISABLED_STORAGE_KEY);
      return "1";
    },
  };
  sendSiteEvent(event, attribution);
  assert.equal(calls.length, 0);
});

test("local opt-out does not block the original analytics action", t => {
  const calls = setup(t);
  let umamiCalls = 0;
  globalThis.window.localStorage = { getItem: () => "1" };
  globalThis.window.umami.track = () => { umamiCalls++; };
  assert.doesNotThrow(() => trackAnalyticsEvent({ eventName: "github_outbound", placement: "home-hero", locale: "en", context: "home" }));
  assert.equal(calls.length, 0);
  assert.equal(umamiCalls, 1);
});

test("removing the local opt-out resumes collection without a reload", t => {
  const calls = setup(t);
  let optedOut = true;
  globalThis.window.localStorage = {
    getItem(key) {
      assert.equal(key, SITE_EVENTS_DISABLED_STORAGE_KEY);
      return optedOut ? "1" : null;
    },
    removeItem(key) {
      assert.equal(key, SITE_EVENTS_DISABLED_STORAGE_KEY);
      optedOut = false;
    },
  };
  sendSiteEvent(event, attribution);
  assert.equal(calls.length, 0);
  globalThis.window.localStorage.removeItem(SITE_EVENTS_DISABLED_STORAGE_KEY);
  sendSiteEvent(event, attribution);
  assert.equal(calls.length, 1);
});

test("storage access exceptions fail closed for first-party events", t => {
  const calls = setup(t);
  globalThis.window.localStorage = {
    getItem() {
      throw Error("storage unavailable");
    },
  };
  assert.doesNotThrow(() => sendSiteEvent(event, attribution));
  assert.equal(calls.length, 0);
});

test("first-party collection does not depend on Umami availability", t => {
  const calls = setup(t);
  trackAnalyticsEvent({ eventName: "github_outbound", placement: "home-hero", locale: "en", context: "home" });
  assert.equal(calls.length, 1);
  assert.equal(JSON.parse(calls[0][1].body).event, "github_outbound");
});

test("failed collection never blocks or retries a user action", async t => {
  setup(t);
  let count = 0;
  globalThis.fetch = () => { count++; return Promise.reject(Error("offline")); };
  assert.doesNotThrow(() => sendSiteEvent(event, attribution));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(count, 1);
});

test("source labels remain finite even with user supplied URLs or prototype keys", () => {
  for (const value of ["private@example.com", "https://foo.com/token", "__proto__", "constructor"]) {
    assert.equal(eventSource({ ...attribution, signup_referrer_host: value, signup_utm_source: value }), "other");
  }
  assert.equal(eventSource(null), "direct");
  assert.equal(eventSource({ ...attribution, signup_utm_source: "youtube" }), "youtube");
});

test("declared launch channels never collapse to direct without a referrer", () => {
  const expected = {
    x: "social",
    threads: "social",
    reddit: "reddit",
    producthunt: "other",
    hackernews: "other",
    linkedin: "social",
    wechat: "social",
    zhihu: "social",
    xiaohongshu: "social",
    github: "github",
    email: "other",
    directory: "other",
    youtube: "youtube",
    bilibili: "social",
  };
  for (const channel of Object.keys(LAUNCH_CHANNELS)) {
    const source = eventSource({ ...attribution, signup_referrer_host: "", signup_utm_source: channel });
    assert.notEqual(source, "direct", channel);
    assert.equal(source, expected[channel], channel);
  }
  assert.equal(eventSource({ ...attribution, signup_referrer_host: "", signup_utm_source: "unmapped-campaign" }), "other");
});
