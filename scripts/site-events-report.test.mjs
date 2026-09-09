import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { buildSiteEventsMetadata } from "./seo-site-events-fetch.mjs";
import { makeSiteEventsMarkdown } from "./site-events-report.mjs";

function capture() {
  return buildSiteEventsMetadata({ reportDate: "2026-09-08", generatedAt: "2026-09-08T12:00:00Z", config: { available: false } });
}
const options = { reportDate: "2026-09-08", gscRange: "2026-08-11 to 2026-09-07" };

test("missing or disabled capture is unavailable, never zero", () => {
  assert.match(makeSiteEventsMarkdown(null, options), /not collected/);
  const text = makeSiteEventsMarkdown(capture(), options);
  assert.match(text, /unavailable/);
  assert.doesNotMatch(text, /accepted operations \| 0/);
});

test("partial operations stay separate from visitors, downloads, and CTA rates", () => {
  const metadata = capture();
  const date = metadata.window.endDate;
  const key = JSON.stringify({ event: "github_outbound", placement: "home-download", locale: "zh-TW", context: "home", page: "/zh-TW", source: "google" });
  metadata.days[date] = { available: true, acceptedEvents: 2, counters: { [key]: 2 }, saturated: { minute: false, day: false } };
  metadata.coverage.availableDays = 1;
  metadata.coverage.missingDays.pop();
  metadata.native.acceptedEventsByDay[date] = 2;
  metadata.native.observedAcceptedEvents = 2;
  metadata.status = "partial";
  const text = makeSiteEventsMarkdown(metadata, options);
  assert.match(text, /Observed accepted operations \| 2/);
  assert.match(text, /github_outbound \| 0 \| 2 \| 0/);
  assert.match(text, /not visitors, sessions, completed downloads, installations/);
  assert.match(text, /no automatic retention expiry/);
  assert.match(text, /27 unavailable days/);
  assert.match(text, /does not prove uptime/);
  metadata.days[date].saturated.minute = true;
  metadata.caps.saturatedDays = [date];
  metadata.status = "capped";
  assert.match(makeSiteEventsMarkdown(metadata, options), /Cap-affected days \| 1/);
});

test("report preserves retained event and source labels without a second vocabulary gate", () => {
  const metadata = capture();
  const date = metadata.window.endDate;
  const key = JSON.stringify({
    event: "legacy_event_renamed",
    placement: "legacy-placement",
    locale: "en",
    context: "legacy-context",
    page: "/",
    source: "legacy-source",
    detail: "legacy-detail",
  });
  metadata.days[date] = { available: true, acceptedEvents: 1, counters: { [key]: 1 }, saturated: { minute: false, day: false } };
  metadata.coverage.availableDays = 1;
  metadata.coverage.missingDays.pop();
  metadata.native.acceptedEventsByDay[date] = 1;
  metadata.native.observedAcceptedEvents = 1;
  metadata.status = "partial";
  const text = makeSiteEventsMarkdown(metadata, options);
  assert.match(text, /legacy_event_renamed \| 1 \| 0 \| 0/);
  assert.match(text, /legacy-source 1/);
});

test("mismatched windows, malformed counters, and private fields fail closed", () => {
  assert.throws(() => makeSiteEventsMarkdown(capture(), { ...options, reportDate: "2026-09-09" }), /report date/);
  assert.throws(() => makeSiteEventsMarkdown(capture(), { ...options, gscRange: "2026-08-10 to 2026-09-06" }), /GSC range/);
  const metadata = capture();
  metadata.coverage.complete = true;
  assert.throws(() => makeSiteEventsMarkdown(metadata, options), /completeness/);
  const bad = capture();
  bad.days[bad.window.endDate] = { available: true, acceptedEvents: 1, counters: { '{"event":"github_outbound","email":"private@example.com"}': 1 }, saturated: { minute: false, day: false } };
  assert.throws(() => makeSiteEventsMarkdown(bad, options), /counter/);
});

test("weekly generator includes the optional export in one report and fingerprints it", () => {
  const dir = mkdtempSync(join(tmpdir(), "wenlan-event-weekly-fixture-"));
  const root = resolve(import.meta.dirname, "..");
  try {
    const metadata = capture();
    writeFileSync(join(dir, "events.json"), JSON.stringify(metadata));
    writeFileSync(join(dir, "gsc.json"), JSON.stringify({ siteUrl: "sc-domain:wenlan.app", source: "Search Console API", startDate: metadata.window.startDate, endDate: metadata.window.endDate }));
    const args = ["scripts/seo-weekly.mjs", "--queries", "scripts/fixtures/seo-weekly/gsc-queries.csv", "--pages", "scripts/fixtures/seo-weekly/gsc-pages.csv", "--gsc-metadata", join(dir, "gsc.json"), "--date", metadata.reportDate, "--output", join(dir, "report.md"), "--site-events-metadata", join(dir, "events.json")];
    execFileSync(process.execPath, args, { cwd: root });
    const first = readFileSync(join(dir, "report.md"), "utf8");
    assert.match(first, /## First-party Website Events/);
    assert.match(first, /Observed accepted operations \| unavailable/);
    metadata.generatedAt = "2026-09-08T12:01:00Z";
    writeFileSync(join(dir, "events.json"), JSON.stringify(metadata));
    execFileSync(process.execPath, args, { cwd: root });
    const second = readFileSync(join(dir, "report.md"), "utf8");
    assert.notEqual(first.match(/Evidence fingerprint \| ([^|]+)/)?.[1], second.match(/Evidence fingerprint \| ([^|]+)/)?.[1]);
    assert.equal((second.match(/## First-party Website Events/g) ?? []).length, 1);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
