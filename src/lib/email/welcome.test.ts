import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { buildWelcomeEmail } from "./welcome";

const EXPECTED_LINKS = [
  "https://wenlan.app/zh-TW",
  "https://wenlan.app/zh-TW/docs",
  "https://wenlan.app/zh-TW/docs/get-started",
  "https://github.com/7xuanlu/wenlan",
] as const;

const LOCALE_EXPECTATIONS = {
  en: {
    subject: "Welcome to Wenlan",
    htmlLang: "en",
    links: [
      "https://wenlan.app/",
      "https://wenlan.app/docs",
      "https://wenlan.app/docs/get-started",
      "https://github.com/7xuanlu/wenlan",
    ],
    content: [
      "Welcome to Wenlan",
      "Thanks for joining Wenlan.",
      "Get started",
      "Browse docs",
      "Wenlan · LLM wiki for AI work",
    ],
    unsubscribeLabel: "Unsubscribe",
    testFooter: "This is the welcome email test you requested; automatic sending is not enabled.",
    separator: ":",
  },
  "zh-TW": {
    subject: "歡迎來到文瀾｜Wenlan 文瀾",
    htmlLang: "zh-Hant",
    links: [...EXPECTED_LINKS],
    content: [
      "歡迎來到文瀾",
      "謝謝你來到 Wenlan 文瀾。",
      "開始使用",
      "瀏覽文件",
      "Wenlan 文瀾 · AI 工作的 LLM wiki",
    ],
    unsubscribeLabel: "取消訂閱",
    testFooter: "這封信是你要求的歡迎郵件測試，未啟用自動群發。",
    separator: "：",
  },
  "zh-CN": {
    subject: "欢迎来到文澜｜Wenlan 文澜",
    htmlLang: "zh-Hans",
    links: [
      "https://wenlan.app/zh-CN",
      "https://wenlan.app/zh-CN/docs",
      "https://wenlan.app/zh-CN/docs/get-started",
      "https://github.com/7xuanlu/wenlan",
    ],
    content: [
      "欢迎来到文澜",
      "谢谢你来到 Wenlan 文澜。",
      "开始使用",
      "浏览文档",
      "Wenlan 文澜 · AI 工作的 LLM wiki",
    ],
    unsubscribeLabel: "取消订阅",
    testFooter: "这封信是你要求的欢迎邮件测试，未启用自动群发。",
    separator: "：",
  },
} as const;

test("builds a recipient-free Traditional Chinese welcome email", () => {
  const email = buildWelcomeEmail();

  assert.equal(email.subject, "歡迎來到文瀾｜Wenlan 文瀾");
  assert.match(email.html, /<h1[^>]*>歡迎來到文瀾<\/h1>/);
  assert.match(email.html, /Wenlan 文瀾/);
  assert.match(email.html, /role="presentation"/);
  assert.match(email.html, /max-width:600px/);
  assert.match(email.html, /@media[\s\S]+max-width: 640px/);
  assert.match(email.html, /有來源依據/);
  assert.match(email.html, /來源與修訂脈絡自行核對/);
  assert.match(email.text, /歡迎來到文瀾/);
  assert.match(email.text, /Wenlan 文瀾/);
  assert.match(email.text, /有來源依據/);
  assert.match(email.text, /來源與修訂脈絡自行核對/);
  assert.doesNotMatch(email.html, /自動替你保證正確性/);
  assert.doesNotMatch(email.text, /自動替你保證正確性/);

  for (const link of EXPECTED_LINKS) {
    assert.match(email.html, new RegExp(link.replaceAll("/", "\\/")));
    assert.match(email.text, new RegExp(link.replaceAll("/", "\\/")));
  }

  assert.doesNotMatch(email.html, /<script\b/i);
  assert.doesNotMatch(email.html, /@import|url\(/i);
  assert.doesNotMatch(email.html, /取消訂閱|unsubscribe/i);
  assert.doesNotMatch(email.html, /\{\{|\}\}|\[recipient\]/i);
  assert.doesNotMatch(email.text, /\{\{|\}\}|\[recipient\]/i);
});

test("keeps the Traditional Chinese default byte-compatible with its explicit locale", () => {
  assert.deepEqual(buildWelcomeEmail(), buildWelcomeEmail({ locale: "zh-TW" }));
});

test("builds localized copy with locale-specific site and docs links", () => {
  for (const [locale, expected] of Object.entries(LOCALE_EXPECTATIONS)) {
    const email = buildWelcomeEmail({ locale: locale as keyof typeof LOCALE_EXPECTATIONS });

    assert.equal(email.subject, expected.subject, locale);
    assert.match(email.html, new RegExp(`<html lang="${expected.htmlLang}">`), locale);
    for (const link of expected.links) {
      assert.ok(email.html.includes(link), `${locale}: HTML link ${link}`);
      assert.ok(email.text.includes(link), `${locale}: text link ${link}`);
    }
    for (const content of expected.content) {
      assert.ok(email.html.includes(content), `${locale}: HTML content ${content}`);
      assert.ok(email.text.includes(content), `${locale}: text content ${content}`);
    }
    assert.equal(email.attachments.length, 1, `${locale}: preserves logo attachment`);
  }
});

test("embeds the original App logo with a matching CID attachment", () => {
  const email = buildWelcomeEmail();
  assert.equal(email.attachments.length, 1);
  const logo = email.attachments[0];
  assert.equal(logo.filename, "wenlan-logo.png");
  assert.match(email.html, new RegExp(`src="cid:${logo.contentId}"`));
  assert.match(email.html, /width="48" height="48" alt="文瀾標誌"/);
  assert.equal(createHash("sha256").update(Buffer.from(logo.content, "base64")).digest("hex"),
    "5976a45561f16e2050a1085063b99df09e7c245b7a3dc91b5250617caf0e7baa");
  assert.doesNotMatch(email.html, /<img[^>]+src="https?:/);
});

test("uses App light and dark palettes instead of the retired yellow template", () => {
  const light = buildWelcomeEmail();
  const dark = buildWelcomeEmail({ theme: "dark" });
  for (const color of ["#FCFCFB", "#1A1A2E", "#586174", "#5E58C8"]) assert.ok(light.html.includes(color));
  for (const color of ["#11131A", "#171A23", "#F1EFE8", "#8FB3EA"]) assert.ok(dark.html.includes(color));
  for (const email of [light, dark]) assert.doesNotMatch(email.html, /#f4efe6|#fffdf8|#b8674c|#f3e1d8/i);
  assert.equal(light.text, dark.text);
  assert.equal(light.subject, dark.subject);
});

test("adds an escaped unsubscribe link only when explicitly configured", () => {
  const email = buildWelcomeEmail({
    unsubscribeUrl: "https://example.com/unsubscribe?token=abc&next=/zh-TW",
  });

  assert.match(
    email.html,
    /href="https:\/\/example\.com\/unsubscribe\?token=abc&amp;next=\/zh-TW"/,
  );
  assert.match(email.html, /取消訂閱/);
  assert.match(
    email.text,
    /取消訂閱： https:\/\/example\.com\/unsubscribe\?token=abc&next=\/zh-TW/,
  );
});

test("localizes unsubscribe and test footer copy for every locale", () => {
  for (const [locale, expected] of Object.entries(LOCALE_EXPECTATIONS)) {
    const unsubscribeUrl = `https://example.com/unsubscribe?locale=${locale}`;
    const email = buildWelcomeEmail({
      locale: locale as keyof typeof LOCALE_EXPECTATIONS,
      unsubscribeUrl,
      includeTestFooter: true,
    });

    assert.ok(email.html.includes(expected.unsubscribeLabel), `${locale}: HTML unsubscribe label`);
    assert.ok(email.text.includes(`${expected.unsubscribeLabel}${expected.separator} ${unsubscribeUrl}`), `${locale}: text unsubscribe label`);
    assert.ok(email.html.includes(expected.testFooter), `${locale}: HTML test footer`);
    assert.ok(email.text.includes(expected.testFooter), `${locale}: text test footer`);
  }
});

test("rejects unsafe or malformed unsubscribe URLs", () => {
  for (const unsubscribeUrl of [
    "javascript:alert(1)",
    "mailto:unsubscribe@example.com",
    "/unsubscribe",
    "https://user:password@example.com/unsubscribe",
    "https://example.com/unsubscribe\nX-Header: injected",
  ]) {
    assert.throws(
      () => buildWelcomeEmail({ unsubscribeUrl }),
      /unsubscribeUrl must be an absolute HTTP\(S\) URL/,
      unsubscribeUrl,
    );
  }
});

test("marks previews explicitly without inventing unsubscribe behavior", () => {
  const email = buildWelcomeEmail({ includeTestFooter: true });

  assert.match(email.html, /這封信是你要求的歡迎郵件測試，未啟用自動群發。/);
  assert.match(email.text, /這封信是你要求的歡迎郵件測試，未啟用自動群發。/);
  assert.doesNotMatch(email.html, /取消訂閱|unsubscribe/i);
  assert.doesNotMatch(email.text, /取消訂閱|unsubscribe/i);
});
