import assert from "node:assert/strict";
import test from "node:test";
import { joinWaitlist } from "../src/app/actions.ts";

function setup(t) {
  const oldFetch = globalThis.fetch;
  const oldLog = console.error;
  const oldKey = process.env.RESEND_API_KEY;
  const oldAudience = process.env.RESEND_AUDIENCE_ID;
  const logs = [];
  console.error = (...args) => logs.push(args);
  process.env.RESEND_API_KEY = "re_local-test-only";
  process.env.RESEND_AUDIENCE_ID = "00000000-0000-0000-0000-000000000001";
  t.after(() => {
    globalThis.fetch = oldFetch; console.error = oldLog;
    for (const [key, value] of [["RESEND_API_KEY", oldKey], ["RESEND_AUDIENCE_ID", oldAudience]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  });
  return logs;
}

function form(email = "subscriber@example.com") {
  const data = new FormData(); data.set("email", email); data.set("locale", "zh-TW"); return data;
}

test("invalid or unconfigured submissions never call Resend", async t => {
  setup(t);
  globalThis.fetch = () => { assert.fail("No network should be attempted"); };
  for (const email of ["", "not-an-email", "a".repeat(65) + "@example.com", "a\u0000b@example.com"]) {
    assert.equal((await joinWaitlist(null, form(email))).success, false);
  }
  delete process.env.RESEND_API_KEY;
  assert.deepEqual(await joinWaitlist(null, form()), { success: false, errorCode: "notConfigured" });
});

test("successful contact save does not send email or override unsubscribe preference", async t => {
  setup(t);
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return Response.json({ object: "contact", id: "saved-contact" });
  };
  assert.deepEqual(await joinWaitlist(null, form()), { success: true });
  assert.equal(requests.length, 1);
  assert.match(String(requests[0].url), /^https:\/\/api\.resend\.com\/audiences\/[^/]+\/contacts$/);
  const body = JSON.parse(requests[0].options.body);
  assert.equal(body.email, "subscriber@example.com");
  assert.equal(body.unsubscribed, undefined);
  assert.doesNotMatch(String(requests[0].url), /\/emails/);
});

test("provider failures cannot expose email in logs or claim success", async t => {
  const logs = setup(t);
  globalThis.fetch = async () => Response.json({ name: "validation_error", message: "subscriber@example.com rejected" }, { status: 400 });
  assert.equal((await joinWaitlist(null, form())).success, false);
  assert.doesNotMatch(JSON.stringify(logs), /subscriber|@|re_local/);
  globalThis.fetch = async () => Response.json({ object: "contact" });
  assert.equal((await joinWaitlist(null, form())).success, false);
});
