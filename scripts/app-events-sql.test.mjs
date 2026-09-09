import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const migrationPath = resolve("supabase/migrations/20260909010000_app_events.sql");

test("app-event migration is private, aggregate-only, and server-RPC-only", async () => {
  const sql = await readFile(migrationPath, "utf8");
  const statements = sql.replace(/--[^\n]*/g, "");
  assert.match(sql, /create schema if not exists app_measurement_private/i);
  assert.match(sql, /create table if not exists app_measurement_private\.app_event_daily/i);
  assert.match(sql, /day date primary key/i);
  assert.match(sql, /version_buckets jsonb not null/i);
  assert.match(sql, /batch_count bigint not null/i);
  assert.match(sql, /operation_count bigint not null/i);
  assert.match(sql, /alter table app_measurement_private\.app_event_daily enable row level security/i);
  assert.doesNotMatch(sql, /create policy/i);
  assert.doesNotMatch(statements, /uuid|client[_ ]?id|dedup|contact/i);
  assert.match(sql, /revoke all on table app_measurement_private\.app_event_daily from public, anon, authenticated, service_role/i);
  for (const fn of ["record_app_event_v1", "read_app_event_day_v1", "app_events_health_v1"]) {
    assert.match(sql, new RegExp(`security definer[\\s\\S]*?set search_path = ''`, "i"));
    assert.match(sql, new RegExp(`revoke all on function (?:app_measurement_private|public)\\.${fn}`, "i"));
    assert.match(sql, new RegExp(`grant execute on function (?:app_measurement_private|public)\\.${fn}`, "i"));
  }
  assert.match(sql, /grant execute on function public\.record_app_event_v1\(text, text, jsonb\) to service_role/i);
  assert.match(sql, /grant execute on function public\.read_app_event_day_v1\(date\) to service_role/i);
  assert.match(sql, /grant execute on function public\.app_events_health_v1\(\) to service_role/i);
  assert.match(sql, /relrowsecurity/i);
  assert.match(sql, /has_table_privilege/i);
  assert.match(sql, /has_schema_privilege/i);
  assert.match(sql, /has_function_privilege/i);
  assert.match(sql, /to_regprocedure\(f\.signature\)/i);
  assert.match(sql, /coalesce\(p\.prosecdef, false\)/i);
  assert.match(sql, /proconfig @> array\['search_path=""'\]/i);
});

test("app-event migration validates payload shape and applies independent atomic caps", async () => {
  const sql = await readFile(migrationPath, "utf8");
  assert.match(sql, /p_app_version text/);
  assert.match(sql, /p_platform text/);
  assert.match(sql, /p_counters jsonb/);
  assert.match(sql, /jsonb_typeof\(p_counters\) <> 'object'/i);
  assert.match(sql, /v_operation_batch < 1/i);
  assert.match(sql, /v_operation_batch > 1000/i);
  assert.match(sql, /v_batch_count >= 1000/i);
  assert.match(sql, /v_operation_count \+ v_operation_batch > 100000/i);
  assert.match(sql, /v_minute_count >= 60/i);
  assert.match(sql, /from pg_catalog\.jsonb_object_keys\(v_buckets\)/i);
  assert.match(sql, /clock_timestamp\(\)/i);
  assert.match(sql, /for update/i);
  assert.match(sql, /at time zone 'UTC'/i);
  assert.match(sql, /on conflict \(day\) do nothing/i);
});

test("operator readout is read-only and labels partial, unavailable, capped, and unknown evidence", async () => {
  const sql = await readFile(resolve("scripts/app-events-operations.sql"), "utf8");
  const statements = sql.replace(/--[^\n]*/g, "");
  assert.doesNotMatch(statements, /\b(insert|update|delete|create|drop|alter|grant|revoke|truncate)\b/i);
  assert.doesNotMatch(statements, /contact|email|website_event|site_event/i);
  assert.match(sql, /generate_series\(0, 28\)/);
  assert.match(sql, /at time zone 'UTC'/);
  assert.match(sql, /partial_today/);
  assert.match(sql, /unavailable/);
  assert.match(sql, /unknown_contamination_possible/);
  assert.match(sql, /client_reported_operations_not_people_sessions_installs_crashes/);
  assert.match(sql, /excluded_days\s*\(\s*day\s*,\s*exclusion_reason\s*\)/i);
  assert.match(sql, /null::date\s*,\s*null::text/i);
  assert.match(sql, /having count\(\*\)\s*>\s*1/i);
  assert.match(sql, /exclusion_state/i);
  assert.match(sql, /exclusion_reason/i);
  assert.match(sql, /eligible_accepted_batches/i);
  assert.match(sql, /eligible_accepted_operations/i);
});

test("operator readout applies local exclusions without changing raw rows or double-counting", async (t) => {
  const packagePath = "/private/tmp/wenlan-mail-sql-qa/node_modules/@electric-sql/pglite/dist/index.js";
  try {
    await access(packagePath);
  } catch {
    t.skip("PGlite QA fixture is not installed");
    return;
  }

  const { PGlite } = await import(pathToFileURL(packagePath).href);
  const db = new PGlite("memory://app-events-operations-test");
  t.after(async () => db.close());
  await db.exec(`
    create schema app_measurement_private;
    create table app_measurement_private.app_event_daily (
      day date primary key,
      version_buckets jsonb not null default '{}'::jsonb,
      batch_count bigint not null,
      operation_count bigint not null,
      saturated_minute boolean not null default false,
      saturated_batch_day boolean not null default false,
      saturated_operation_day boolean not null default false,
      saturated_version_day boolean not null default false
    );
    insert into app_measurement_private.app_event_daily (
      day, version_buckets, batch_count, operation_count,
      saturated_minute, saturated_batch_day, saturated_operation_day, saturated_version_day
    ) values
      ((current_timestamp at time zone 'UTC')::date - 1, '{}'::jsonb, 12, 34, false, false, false, false),
      ((current_timestamp at time zone 'UTC')::date - 3, '{}'::jsonb, 5, 6, true, false, false, false),
      ((current_timestamp at time zone 'UTC')::date - 4, '{}'::jsonb, 4, 9, false, false, false, false),
      ((current_timestamp at time zone 'UTC')::date, '{}'::jsonb, 7, 11, false, false, false, false);
  `);

  const operationsPath = resolve("scripts/app-events-operations.sql");
  const operationsSql = await readFile(operationsPath, "utf8");
  const withExclusion = operationsSql.replace(
    "(null::date, null::text)",
    "((current_timestamp at time zone 'UTC')::date - 4, 'local app telemetry test day')",
  );
  const { rows } = await db.query(withExclusion);
  assert.equal(rows.length, 29, "the generated 29-day window must remain one row per day");

  const normalizeDay = (value) => typeof value === "string" ? value : value.toISOString().slice(0, 10);
  const rawToday = (await db.query("select (current_timestamp at time zone 'UTC')::date as day")).rows[0].day;
  const today = normalizeDay(rawToday);
  const dayAt = (offset) => {
    const value = new Date(`${today}T00:00:00Z`);
    value.setUTCDate(value.getUTCDate() - offset);
    return value.toISOString().slice(0, 10);
  };
  const byDay = new Map(rows.map((row) => [normalizeDay(row.day), row]));

  const excluded = byDay.get(dayAt(4));
  assert.equal(excluded.accepted_batches, 4, "excluded raw batch count is retained");
  assert.equal(excluded.accepted_operations, 9, "excluded raw operation count is retained");
  assert.equal(excluded.exclusion_state, "excluded");
  assert.equal(excluded.exclusion_reason, "local app telemetry test day");
  assert.equal(excluded.eligible_state, "excluded");
  assert.equal(excluded.eligible_accepted_batches, null);
  assert.equal(excluded.eligible_accepted_operations, null);

  const normal = byDay.get(dayAt(1));
  assert.equal(normal.collection_state, "observed_not_complete");
  assert.equal(normal.exclusion_state, "not_excluded");
  assert.equal(normal.eligible_state, "eligible_complete_day");
  assert.equal(normal.eligible_accepted_batches, 12);
  assert.equal(normal.eligible_accepted_operations, 34);

  const missing = byDay.get(dayAt(2));
  assert.equal(missing.collection_state, "unavailable");
  assert.equal(missing.eligible_state, "unavailable");
  assert.equal(missing.eligible_accepted_batches, null);
  assert.equal(missing.eligible_accepted_operations, null);

  const partial = byDay.get(dayAt(0));
  assert.equal(partial.window_state, "partial_today");
  assert.equal(partial.eligible_state, "partial_today");
  assert.equal(partial.eligible_accepted_batches, null);
  assert.equal(partial.eligible_accepted_operations, null);

  const capped = byDay.get(dayAt(3));
  assert.equal(capped.collection_state, "capped");
  assert.equal(capped.eligible_state, "capped");
  assert.equal(capped.eligible_accepted_batches, null);
  assert.equal(capped.eligible_accepted_operations, null);

  const withDuplicateExclusion = operationsSql.replace(
    "(null::date, null::text)",
    "((current_timestamp at time zone 'UTC')::date - 4, 'first reason'), ((current_timestamp at time zone 'UTC')::date - 4, 'duplicate reason')",
  );
  const duplicateResult = await db.query(withDuplicateExclusion);
  assert.equal(duplicateResult.rows.length, 29, "duplicate exclusion dates must not duplicate report rows");
  assert.equal(duplicateResult.rows.filter((row) => normalizeDay(row.day) === dayAt(4)).length, 1);
  assert.equal(duplicateResult.rows[0].exclusion_config_state, "invalid_duplicate_dates");
  assert.equal(duplicateResult.rows.find((row) => normalizeDay(row.day) === dayAt(1)).eligible_accepted_operations, null);
});

test("migration executes in PGlite when the repository QA fixture is available", async (t) => {
  const packagePath = "/private/tmp/wenlan-mail-sql-qa/node_modules/@electric-sql/pglite/dist/index.js";
  try {
    await access(packagePath);
  } catch {
    t.skip("PGlite QA fixture is not installed");
    return;
  }

  const { PGlite } = await import(pathToFileURL(packagePath).href);
  const db = new PGlite("memory://app-events-test");
  t.after(async () => db.close());
  await db.exec("create role anon; create role authenticated; create role service_role;");
  const migration = await readFile(migrationPath, "utf8");
  await db.exec(migration);
  await db.exec(migration);

  const accepted = await db.query("select app_measurement_private.record_app_event_v1($1, $2, $3::jsonb) as value", [
    "0.18.0", "macos", JSON.stringify({ daemon_ready: 2, save_success: 1 }),
  ]);
  assert.deepEqual(accepted.rows[0].value, { status: "accepted" });
  const day = await db.query("select app_measurement_private.read_app_event_day_v1((select max(day) from app_measurement_private.app_event_daily)) as value");
  assert.equal(day.rows[0].value.batch_count, 1);
  assert.equal(day.rows[0].value.operation_count, 3);
  assert.deepEqual(day.rows[0].value.version_buckets, { "0.18.0": { macos: { daemon_ready: 2, save_success: 1 } } });
  const health = await db.query("select app_measurement_private.app_events_health_v1() as value");
  assert.deepEqual(health.rows[0].value, { schemaVersion: 1, storage: "postgres", ready: true });

  const healthValue = async () => (await db.query("select app_measurement_private.app_events_health_v1() as value")).rows[0].value;
  const beforeHealthRows = (await db.query("select count(*)::int as count from app_measurement_private.app_event_daily")).rows[0].count;
  await db.exec("drop function public.record_app_event_v1(text, text, jsonb)");
  assert.equal((await healthValue()).ready, false);
  await db.exec(migration);
  assert.equal((await healthValue()).ready, true);
  await db.exec("alter table app_measurement_private.app_event_daily disable row level security");
  assert.equal((await healthValue()).ready, false);
  await db.exec("alter table app_measurement_private.app_event_daily enable row level security");
  await db.exec("grant select on app_measurement_private.app_event_daily to anon");
  assert.equal((await healthValue()).ready, false);
  await db.exec("revoke select on app_measurement_private.app_event_daily from anon");
  await db.exec("grant select on app_measurement_private.app_event_daily to service_role");
  assert.equal((await healthValue()).ready, false);
  await db.exec("revoke select on app_measurement_private.app_event_daily from service_role");
  await db.exec("grant usage on schema app_measurement_private to authenticated");
  assert.equal((await healthValue()).ready, false);
  await db.exec("revoke usage on schema app_measurement_private from authenticated");
  await db.exec("grant execute on function public.record_app_event_v1(text, text, jsonb) to anon");
  assert.equal((await healthValue()).ready, false);
  await db.exec("revoke execute on function public.record_app_event_v1(text, text, jsonb) from anon");
  assert.equal((await healthValue()).ready, true);
  const afterHealthRows = (await db.query("select count(*)::int as count from app_measurement_private.app_event_daily")).rows[0].count;
  assert.equal(afterHealthRows, beforeHealthRows);

  await db.exec("set role anon");
  await assert.rejects(
    db.query("select public.record_app_event_v1('0.18.0', 'macos', '{\"daemon_ready\":1}'::jsonb)"),
    /permission denied/,
  );
  await db.exec("reset role; set role service_role");
  await assert.rejects(db.query("select * from app_measurement_private.app_event_daily"), /permission denied/);
  await db.exec("reset role");

  const callRecord = async (counters = { daemon_ready: 1 }) => (
    await db.query("select app_measurement_private.record_app_event_v1($1, $2, $3::jsonb) as value", [
      "0.18.0", "macos", JSON.stringify(counters),
    ])
  ).rows[0].value;
  await db.query("update app_measurement_private.app_event_daily set minute_window_start = date_trunc('minute', clock_timestamp() at time zone 'UTC'), minute_batch_count = 60");
  assert.deepEqual(await callRecord(), { status: "capped", cap: "minute" });
  await db.query("update app_measurement_private.app_event_daily set minute_batch_count = 0, batch_count = 1000");
  assert.deepEqual(await callRecord(), { status: "capped", cap: "batch_day" });
  await db.query("update app_measurement_private.app_event_daily set batch_count = 0, operation_count = 100000");
  assert.deepEqual(await callRecord(), { status: "capped", cap: "operations_day" });
  const versions = Object.fromEntries(Array.from({ length: 20 }, (_, index) => [`1.0.${index}`, { macos: { daemon_ready: 1 } }]));
  await db.query("update app_measurement_private.app_event_daily set operation_count = 0, version_buckets = $1::jsonb", [JSON.stringify(versions)]);
  assert.deepEqual(await callRecord(), { status: "capped", cap: "version_day" });
});
