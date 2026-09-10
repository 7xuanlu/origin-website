import assert from "node:assert/strict";
import test from "node:test";
import { captureSignupAttribution, currentSignupAttribution, ATTRIBUTION_KEY, ATTRIBUTION_TTL_MS } from "../src/lib/signup-attribution.ts";
import { LAUNCH_CHANNELS, LAUNCH_LOCALES, launchCampaign, launchUrl, launchEventProperties } from "../src/lib/launch-campaign.ts";
import { TrackedLink, trackAnalyticsEvent } from "../src/components/tracked-link.tsx";
import { WENLAN_RELEASE } from "../src/lib/releases.ts";
import { sourceReferrers } from "./seo-referrers.mjs";
import { githubTrafficSnapshot } from "./seo-github-traffic.mjs";

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}

test("first landing campaign survives article to homepage navigation", () => {
  const s = storage();
  const first = captureSignupAttribution("https://wenlan.app/zh-TW/learn?utm_source=x&utm_medium=social&utm_campaign=wenlan-launch", "https://t.co/secret", s, 1000);
  const next = captureSignupAttribution("https://wenlan.app/zh-TW/", "https://wenlan.app/zh-TW/learn", s, 2000);
  assert.deepEqual(next, first);
  assert.equal(next.signup_landing_path, "/zh-TW/learn");
  assert.equal(next.signup_referrer_host, "t.co");
  assert.equal(next.signup_utm_source, "x");
});

test("attribution expires and corrupt storage cannot break signup", () => {
  const s = storage();
  captureSignupAttribution("https://wenlan.app/?utm_source=x", "", s, 1000);
  assert.equal(captureSignupAttribution("https://wenlan.app/?utm_source=reddit", "", s, 1000 + ATTRIBUTION_TTL_MS).signup_utm_source, "reddit");
  s.setItem(ATTRIBUTION_KEY, "not json");
  assert.doesNotThrow(() => captureSignupAttribution("https://wenlan.app/", "", s, 2000));
  const denied = { getItem() { throw Error("denied"); }, setItem() { throw Error("denied"); } };
  assert.equal(captureSignupAttribution("https://wenlan.app/?utm_source=x", "", denied).signup_utm_source, "x");
});

test("storage never persists email-like campaign values or referrer query strings", () => {
  const s = storage();
  captureSignupAttribution("https://wenlan.app/?utm_source=person@example.com&utm_campaign=launch", "https://reddit.com/path?token=private", s, 1000);
  assert.doesNotMatch(s.getItem(ATTRIBUTION_KEY), /person|example|private|token/);
});

test("every prepared channel has valid locale URLs and bounded event metadata", () => {
  assert.equal(launchCampaign("en"), "wenlan-v0.17.7-launch-en-demo", "this launch ID must not drift with future download releases");
  for (const source of Object.keys(LAUNCH_CHANNELS)) for (const locale of LAUNCH_LOCALES) {
    const url = new URL(launchUrl(source, locale));
    assert.equal(url.origin, "https://wenlan.app");
    assert.equal(url.pathname, locale === "en" ? "/" : `/${locale}/`);
    assert.equal(launchEventProperties(source, url.searchParams.get("utm_medium"), url.searchParams.get("utm_campaign")).campaign, launchCampaign(locale));
  }
  assert.deepEqual(launchEventProperties("x", "social", "person@example.com"), {});
  assert.deepEqual(launchEventProperties("unknown", "social", launchCampaign("en")), {});
});

test("known asset clicks carry asset identity, and a failed tracker never blocks navigation", t => {
  const previous = globalThis.window;
  const calls = [];
  globalThis.window = { umami: { track: (...args) => calls.push(args) } };
  t.after(() => { globalThis.window = previous; });
  const asset = WENLAN_RELEASE.assets[0];
  const link = TrackedLink({ href: asset.href, eventName: "github_outbound", placement: "download-page", locale: "en", context: "setup" });
  link.props.onClick();
  assert.equal(calls[0][1].asset_id, asset.id);
  assert.equal(calls[0][1].release_tag, WENLAN_RELEASE.tag);
  globalThis.window.umami.track = () => { throw Error("tracker offline"); };
  assert.doesNotThrow(() => link.props.onClick());
});

test("source-page reporting includes social/video channels, not only search engines", () => {
  assert.deepEqual(sourceReferrers(["t.co", "l.threads.com", "youtube.com", "google.com", "", "direct", "x' or 1=1", "t.co"].map(label => ({ label }))), ["t.co", "l.threads.com", "youtube.com", "google.com"]);
});

test("a future stable download records its actual version without a website rebuild", t => {
  const previous = globalThis.window;
  const calls = [];
  globalThis.window = { umami: { track: (...args) => calls.push(args) } };
  t.after(() => { globalThis.window = previous; });
  trackAnalyticsEvent({ eventName: "github_outbound", placement: "download-page", locale: "zh-TW", context: "setup",
    href: "https://github.com/7xuanlu/wenlan/releases/download/v0.99.1/Wenlan_0.99.1_aarch64.dmg" });
  assert.equal(calls[0][1].asset_id, "macos-arm64");
  assert.equal(calls[0][1].release_tag, "v0.99.1");
  trackAnalyticsEvent({ eventName: "github_outbound", placement: "download-page", locale: "en", context: "setup",
    href: "https://github.com/7xuanlu/wenlan/releases/download/v0.99.1/Wenlan_0.18.5_aarch64.dmg" });
  assert.equal(calls[1][1].asset_id, undefined);
  assert.equal(calls[1][1].release_tag, undefined);
});

test("Do Not Track skips optional storage and events without breaking navigation", t => {
  const previous = globalThis.window;
  t.after(() => { globalThis.window = previous; });
  globalThis.window = { navigator: { doNotTrack: "1" }, get sessionStorage() { throw Error("must not read"); }, umami: { track() { assert.fail("must not track"); } } };
  assert.equal(currentSignupAttribution().signup_utm_source, "");
  assert.doesNotThrow(() => trackAnalyticsEvent({ eventName: "video_play_click", placement: "home-demo", context: "home", locale: "en" }));
});

test("event campaign uses the original landing after internal navigation", t => {
  const previous = globalThis.window;
  const previousDocument = globalThis.document;
  t.after(() => { globalThis.window = previous; globalThis.document = previousDocument; });
  const s = storage();
  captureSignupAttribution(launchUrl("youtube", "zh-TW"), "https://youtube.com/watch?v=example", s);
  const calls = [];
  globalThis.document = { referrer: "https://wenlan.app/zh-TW/" };
  globalThis.window = { location: { href: "https://wenlan.app/zh-TW/download" }, sessionStorage: s, umami: { track: (...args) => calls.push(args) } };
  trackAnalyticsEvent({ eventName: "video_play_click", placement: "home-demo", context: "home", locale: "zh-TW" });
  assert.equal(calls[0][1].campaign_source, "youtube");
  assert.equal(calls[0][1].campaign, launchCampaign("zh-TW"));
  assert.equal(calls[0][0], "video_play_click");
  assert.equal(calls[0][1].signup_landing_path, undefined);
});

test("missing GitHub traffic remains unavailable while stars preserve native dates", async () => {
  const snapshot = await githubTrafficSnapshot(async path => {
    if (path.includes("stargazers")) return [{ starred_at: "2026-09-01T01:00:00Z", user: { login: "never-store-this" } }];
    throw Error("403");
  }, "2026-09-04T00:00:00Z");
  assert.equal(snapshot.observations.views.status, "unavailable");
  assert.equal(snapshot.observations.views.data, undefined);
  assert.deepEqual(snapshot.observations.stargazers.perDayUTC, { "2026-09-01": 1 });
  assert.doesNotMatch(JSON.stringify(snapshot), /never-store-this/);
});
