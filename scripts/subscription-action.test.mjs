import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { joinWaitlist } from "../src/app/actions.ts";
const { workAsyncStorage } = createRequire(import.meta.url)("next/dist/server/app-render/work-async-storage.external.js");

function setup(t) {
  const oldFetch = globalThis.fetch;
  const oldLog = console.error;
  const oldKey = process.env.RESEND_API_KEY;
  const oldAudience = process.env.RESEND_AUDIENCE_ID;
  const oldWelcome = process.env.WELCOME_EMAIL_ENABLED;
  const logs = [];
  console.error = (...args) => logs.push(args);
  process.env.RESEND_API_KEY = "re_local-test-only";
  process.env.RESEND_AUDIENCE_ID = "00000000-0000-0000-0000-000000000001";
  process.env.WELCOME_EMAIL_ENABLED = "0";
  t.after(() => {
    globalThis.fetch = oldFetch; console.error = oldLog;
    for (const [key, value] of [["RESEND_API_KEY", oldKey], ["RESEND_AUDIENCE_ID", oldAudience], ["WELCOME_EMAIL_ENABLED", oldWelcome]]) {
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

test("with welcome disabled, contact save does not send email or override unsubscribe preference", async t => {
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

test("saved subscription returns before deferred welcome delivery starts", async t => {
  setup(t);
  process.env.WELCOME_EMAIL_ENABLED = "1";
  const queued = [];
  t.mock.method(workAsyncStorage, "getStore", () => ({ afterContext: { after: task => queued.push(task) } }));
  let requests = 0;
  globalThis.fetch = async () => { requests++; return Response.json({ id: "11111111-1111-4111-8111-111111111111" }); };
  assert.deepEqual(await joinWaitlist(null, form()), { success: true });
  assert.equal(requests, 1);
  assert.equal(queued.length, 1);
  assert.equal(typeof queued[0], "function");
  process.env.WELCOME_EMAIL_ENABLED = "0";
  await queued[0]();
  assert.equal(requests, 1);
});

test("post-response scheduling failure cannot undo a saved subscription", async t => {
  const logs = setup(t);
  process.env.WELCOME_EMAIL_ENABLED = "1";
  t.mock.method(workAsyncStorage, "getStore", () => undefined);
  globalThis.fetch = async () => Response.json({ id: "11111111-1111-4111-8111-111111111111" });
  assert.deepEqual(await joinWaitlist(null, form()), { success: true });
  assert.match(JSON.stringify(logs), /could not be scheduled/);
  assert.doesNotMatch(JSON.stringify(logs), /subscriber@example/);
});
