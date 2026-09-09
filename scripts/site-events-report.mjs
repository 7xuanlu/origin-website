// Plain ESM: the weekly pipeline can consume an export without loading Next.js.
const FIELDS = new Set(["event", "placement", "locale", "context", "page", "source", "detail", "asset_id", "release_tag"]);
const DISPLAY_LOCALES = ["en", "zh-TW", "zh-CN"];
const count = (value) => Number.isSafeInteger(value) && value >= 0;
const fail = (reason) => { throw new Error(`First-party events: ${reason}`); };
const heading = "## First-party Website Events\n\n";

export function makeSiteEventsMarkdown(metadata, { reportDate, gscRange } = {}) {
  if (!metadata) return `${heading}Not enabled or not collected; operations unavailable. No zero or visitor estimate is inferred.\n\n`;
  if (metadata.schemaVersion !== 1 || metadata.scope !== "wenlan.app" || metadata.source !== "Wenlan first-party event aggregates") fail("unsupported source");
  if (metadata.reportDate !== reportDate) fail("report date mismatch");
  const { window, coverage, days, caps, native } = metadata;
  const end = new Date(`${reportDate}T00:00:00Z`);
  if (!Number.isFinite(end.valueOf())) fail("invalid report date");
  const dates = Array.from({ length: 28 }, (_, i) => new Date(end.valueOf() - (28 - i) * 86400000).toISOString().slice(0, 10));
  if (window?.timezone !== "UTC" || window.days !== 28 || window.startDate !== dates[0] || window.endDate !== dates.at(-1)) fail("invalid complete-day window");
  const range = `${window.startDate} to ${window.endDate}`;
  if (gscRange !== range) fail("GSC range must match exactly");
  if (!coverage || coverage.complete !== false) fail("key presence cannot prove completeness");
  if (!days || Object.keys(days).length !== 28 || dates.some((date) => !Object.hasOwn(days, date))) fail("invalid day coverage");
  if (!Number.isFinite(Date.parse(metadata.generatedAt))) fail("invalid capture timestamp");
  const byEvent = new Map();
  const bySource = new Map();
  const locales = new Set(DISPLAY_LOCALES);
  const missing = [];
  const saturated = [];
  let observed = 0;
  let downloadClicks = 0;
  for (const date of dates) {
    const day = days[date];
    if (day?.available === false) {
      if (day.acceptedEvents !== null || day.counters !== null || native?.acceptedEventsByDay?.[date] !== null) fail("missing day must be unavailable");
      missing.push(date);
      continue;
    }
    if (day?.available !== true || !day.counters || typeof day.counters !== "object" || Array.isArray(day.counters)) fail("malformed day");
    if (typeof day.saturated?.minute !== "boolean" || typeof day.saturated.day !== "boolean") fail("invalid saturation flags");
    if (day.saturated.minute || day.saturated.day) saturated.push(date);
    let sum = 0;
    for (const [key, value] of Object.entries(day.counters)) {
      let field;
      try { field = JSON.parse(key); } catch { fail("malformed counter"); }
      if (!field || typeof field !== "object" || Array.isArray(field) || Object.keys(field).some((name) => !FIELDS.has(name)) || typeof field.event !== "string" || typeof field.locale !== "string" || typeof field.source !== "string" || !count(value)) fail("invalid counter");
      locales.add(field.locale);
      const row = byEvent.get(field.event) ?? new Map();
      row.set(field.locale, (row.get(field.locale) ?? 0) + value);
      byEvent.set(field.event, row);
      bySource.set(field.source, (bySource.get(field.source) ?? 0) + value);
      if (field.event === "github_outbound" && field.asset_id) downloadClicks += value;
      sum += value;
    }
    if (!count(sum) || day.acceptedEvents !== sum || native?.acceptedEventsByDay?.[date] !== sum) fail("counter total mismatch");
    observed += sum;
  }
  if (!count(observed) || coverage.requestedDays !== 28 || coverage.availableDays !== 28 - missing.length || JSON.stringify(coverage.missingDays) !== JSON.stringify(missing) || coverage.allDayKeysPresent !== (missing.length === 0)) fail("coverage mismatch");
  if (caps?.perMinute !== 60 || caps.perDay !== 1000 || JSON.stringify(caps.saturatedDays) !== JSON.stringify(saturated)) fail("cap mismatch");
  if (native.acceptedEvents !== (missing.length === 0 ? observed : null)) fail("full-window total mismatch");
  if (native.observedAcceptedEvents !== observed && !(missing.length === 28 && native.observedAcceptedEvents === null)) fail("observed total mismatch");
  const validStatus = saturated.length ? "capped" : missing.length ? "partial" : "observed";
  if (metadata.status !== validStatus && !(metadata.status === "unavailable" && missing.length === 28)) fail("status mismatch");
  const value = missing.length === 28 ? "unavailable" : observed;
  const localeColumns = [...DISPLAY_LOCALES, ...[...locales].filter((locale) => !DISPLAY_LOCALES.includes(locale)).sort()];
  const table = byEvent.size ? `\nCounts below cover available day keys only; zeros are not claims about unavailable days.\n\n| Event | ${localeColumns.join(" | ")} |\n| --- | ${localeColumns.map(() => "---:").join(" | ")} |\n${[...byEvent].sort(([a], [b]) => a.localeCompare(b)).map(([event, values]) => `| ${event} | ${localeColumns.map((locale) => values.get(locale) ?? 0).join(" | ")} |`).join("\n")}\n\nCoarse client-reported source labels (accepted operations, not people): ${[...bySource].sort(([a], [b]) => a.localeCompare(b)).map(([source, value]) => `${source} ${value}`).join("; ")}.\n` : "";
  return `${heading}| Field | Value |\n| --- | --- |\n| Source | Wenlan first-party event aggregates |\n| Capture | ${new Date(metadata.generatedAt).toISOString()} |\n| Window | ${range} (UTC) |\n| Status | ${metadata.status} |\n| Coverage | ${28 - missing.length} day keys; ${missing.length} unavailable days |\n| Observed accepted operations | ${value} |\n| Download-link activations in observed keys | ${missing.length === 28 ? "unavailable" : downloadClicks} |\n| Cap-affected days | ${saturated.length} |\n\nDay-key presence does not prove uptime. Missing keys, storage errors, privacy opt-outs and caps prevent a completeness claim. The Postgres store has no automatic retention expiry; this report does not infer an operational retention policy. These are client-reported operations, not visitors, sessions, completed downloads, installations, new subscribers, or GitHub stars. Repeat activity and forged requests are possible. No CTA rate, conversion funnel, source-to-page session join, or causal claim is calculated. Resend contacts and GitHub asset download counters remain separate evidence.${table}\n`;
}
