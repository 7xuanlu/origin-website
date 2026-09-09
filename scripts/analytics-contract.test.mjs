import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  TrackedLink,
  trackAnalyticsEvent,
} from "../src/components/tracked-link.tsx";
import {
  browserSignupAttribution,
  resendSignupProperties,
} from "../src/lib/signup-attribution.ts";

const cases = [
  ["github_outbound", "github"],
  ["get_started_click", "setup"],
  ["learn_article_click", "learn"],
  ["setup_path_click", "setup"],
];

test("TrackedLink preserves normalized bounded legacy Umami events", (t) => {
  const previousWindow = globalThis.window;
  const calls = [];
  globalThis.window = {
    umami: {
      track: (...args) => calls.push(args),
    },
  };
  t.after(() => {
    globalThis.window = previousWindow;
  });

  for (const [eventName, destinationCategory] of cases) {
    const link = TrackedLink({
      href: eventName === "github_outbound" ? "https://github.com/7xuanlu/wenlan" : "/learn",
      eventName,
      placement: "learn-article",
      locale: "en",
      context: "comparisons",
      children: eventName,
    });

    link.props.onClick();

    assert.deepEqual(calls.at(-1), [
      eventName,
      {
        placement: "learn-article",
        locale: "en",
        context: "comparisons",
        destination_category: destinationCategory,
      },
    ]);
  }
});

test("TrackedLink click remains safe when Umami is unavailable", (t) => {
  const previousWindow = globalThis.window;
  globalThis.window = {};
  t.after(() => {
    globalThis.window = previousWindow;
  });

  const link = TrackedLink({
    href: "https://github.com/7xuanlu/wenlan",
    eventName: "github_outbound",
    placement: "home-footer",
    locale: "zh-TW",
    context: "home",
    children: "GitHub",
  });

  assert.doesNotThrow(() => link.props.onClick());
});

test("successful waitlist tracking stays anonymous and bounded", (t) => {
  const previousWindow = globalThis.window;
  const calls = [];
  globalThis.window = {
    umami: {
      track: (...args) => calls.push(args),
    },
  };
  t.after(() => {
    globalThis.window = previousWindow;
  });

  trackAnalyticsEvent({
    eventName: "waitlist_signup",
    placement: "home-footer",
    locale: "zh-TW",
    context: "home",
  });

  assert.deepEqual(calls, [
    [
      "waitlist_signup",
      {
        placement: "home-footer",
        locale: "zh-TW",
        context: "home",
        destination_category: "email",
      },
    ],
  ]);
  assert.doesNotMatch(JSON.stringify(calls), /email@|utm_|referrer/i);
});

test("signup attribution keeps bounded campaign fields out of Umami", () => {
  const attribution = browserSignupAttribution(
    "https://wenlan.app/zh-TW/?utm_source=reddit&utm_medium=post&utm_campaign=llm%20wiki",
    "https://www.reddit.com/r/LocalLLaMA/comments/example?secret=ignored",
  );
  assert.deepEqual(attribution, {
    signup_landing_path: "/zh-TW/",
    signup_referrer_host: "www.reddit.com",
    signup_utm_source: "reddit",
    signup_utm_medium: "post",
    signup_utm_campaign: "llm wiki",
  });

  const formData = new FormData();
  for (const [key, value] of Object.entries(attribution)) {
    formData.set(key, value);
  }
  assert.deepEqual(resendSignupProperties(formData, "zh-TW"), {
    signup_locale: "zh-TW",
    ...attribution,
  });

  formData.set("signup_landing_path", "https://attacker.example/private");
  formData.set("signup_referrer_host", "attacker.example/path");
  formData.set("signup_utm_campaign", "person@example.com");
  assert.deepEqual(resendSignupProperties(formData, "zh-TW"), {
    signup_locale: "zh-TW",
    signup_utm_source: "reddit",
    signup_utm_medium: "post",
  });

  formData.set("signup_landing_path", "/download?token=example-secret");
  formData.set("signup_referrer_host", "reddit.com");
  formData.set("signup_utm_campaign", "user@例子.中国");
  assert.deepEqual(resendSignupProperties(formData, "zh-TW"), {
    signup_locale: "zh-TW",
    signup_referrer_host: "reddit.com",
    signup_utm_source: "reddit",
    signup_utm_medium: "post",
  });
});

test("waitlist source keeps Resend opt-in and Umami email exclusion explicit", async () => {
  const [actionSource, formSource] = await Promise.all([
    readFile(new URL("../src/app/actions.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/app/waitlist-form.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(actionSource, /RESEND_ACQUISITION_PROPERTIES_ENABLED === "1"/);
  assert.match(actionSource, /if \(result\.error\)/);
  assert.match(formSource, /eventName: "waitlist_signup"/);
  assert.match(formSource, /name="locale"/);
  const trackingCall = formSource.match(/trackAnalyticsEvent\(\{[\s\S]*?\}\);/)?.[0];
  assert.ok(trackingCall);
  assert.doesNotMatch(trackingCall, /email|utm|referrer/i);
});

test("homepage acquisition links preserve their exact analytics tuple", async () => {
  const homeSource = await readFile(
    new URL("../src/app/_pages/home.tsx", import.meta.url),
    "utf8",
  );
  const acquisitionNav = homeSource.match(
    /<nav[\s\S]*?content\.hero\.metaLinks\.map[\s\S]*?<\/nav>/,
  )?.[0];

  assert.ok(acquisitionNav, "homepage acquisition nav must render hero meta links");
  assert.match(acquisitionNav, /eventName="learn_article_click"/);
  assert.match(acquisitionNav, /placement="home-acquisition"/);
  assert.match(acquisitionNav, /context="concepts"/);
});

test("download-page placement preserves the bounded outbound event shape", (t) => {
  const previousWindow = globalThis.window;
  const calls = [];
  globalThis.window = {
    umami: {
      track: (...args) => calls.push(args),
    },
  };
  t.after(() => {
    globalThis.window = previousWindow;
  });

  const link = TrackedLink({
    href: "https://github.com/7xuanlu/wenlan/releases/download/v0.15.0/example.zip",
    eventName: "github_outbound",
    placement: "download-page",
    locale: "zh-TW",
    context: "setup",
    children: "下載 Windows x64",
  });

  link.props.onClick();
  assert.deepEqual(calls, [
    [
      "github_outbound",
      {
        placement: "download-page",
        locale: "zh-TW",
        context: "setup",
        destination_category: "github",
      },
    ],
  ]);
});

test("docs-article placement preserves the bounded outbound event shape", (t) => {
  const previousWindow = globalThis.window;
  const calls = [];
  globalThis.window = {
    umami: {
      track: (...args) => calls.push(args),
    },
  };
  t.after(() => {
    globalThis.window = previousWindow;
  });

  const link = TrackedLink({
    href: "https://github.com/7xuanlu/wenlan",
    eventName: "github_outbound",
    placement: "docs-article",
    locale: "en",
    context: "setup",
    children: "Open GitHub",
  });

  link.props.onClick();
  assert.deepEqual(calls, [
    [
      "github_outbound",
      {
        placement: "docs-article",
        locale: "en",
        context: "setup",
        destination_category: "github",
      },
    ],
  ]);
});
