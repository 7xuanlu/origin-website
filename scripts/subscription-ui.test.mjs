import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const repoRoot = resolve(import.meta.dirname, "..");

async function read(relativePath) {
  return readFile(resolve(repoRoot, relativePath), "utf8");
}

test("release-update subscription form exposes an accessible, bounded email field", async () => {
  const source = await read("src/app/waitlist-form.tsx");

  assert.match(source, /<label\s+htmlFor=\{emailInputId\}/);
  assert.match(source, /\{copy\.emailLabel\}/);
  assert.match(source, /autoComplete="email"/);
  assert.match(source, /maxLength=\{254\}/);
  assert.match(source, /value=\{email\}/, "retain the address after a retryable server error");
  assert.match(source, /aria-describedby=\{describedBy\}/);
  assert.match(source, /aria-invalid=\{errorMessage \? true : undefined\}/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /role="alert"/);
  assert.match(source, /min-w-0/);
  assert.match(source, /flex-wrap/);
});

test("subscription form keeps analytics tuple unchanged and avoids email values", async () => {
  const source = await read("src/app/waitlist-form.tsx");
  const trackingCall = source.match(/trackAnalyticsEvent\(\{[\s\S]*?\}\);/)?.[0];

  assert.ok(trackingCall);
  assert.match(trackingCall, /eventName: "waitlist_signup"/);
  assert.match(trackingCall, /placement: "home-footer"/);
  assert.match(trackingCall, /context: "home"/);
  assert.doesNotMatch(trackingCall, /email|utm|referrer/i);
});

test("all locales describe a saved release-update subscription without waitlist promises", async () => {
  const expectedCopy = {
    "src/i18n/content/en.ts": [
      "Subscribe to Wenlan release updates.",
      "Your subscription details have been saved.",
      "Used only for Wenlan release updates.",
    ],
    "src/i18n/content/zh-TW.ts": [
      "訂閱 Wenlan 的版本更新。",
      "訂閱資料已儲存。",
      "僅用於 Wenlan 版本更新。",
    ],
    "src/i18n/content/zh-CN.ts": [
      "订阅 Wenlan 的版本更新。",
      "订阅资料已保存。",
      "仅用于 Wenlan 版本更新。",
    ],
  };

  for (const [file, strings] of Object.entries(expectedCopy)) {
    const source = await read(file);
    for (const string of strings) assert.match(source, new RegExp(string));
    const subscriptionCopy = source.match(
      /waitlistHeading:[\s\S]*?errors:\s*\{[\s\S]*?\n\s*\},\n\s*\},/,
    )?.[0];
    assert.ok(subscriptionCopy, `${file} should define the subscription copy block`);
    assert.doesNotMatch(
      subscriptionCopy.replaceAll(/waitlistHeading|waitlist/g, ""),
      /候補名單|候补名单/i,
    );
  }
});
