import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const migrationPath = resolve("supabase/migrations/20260908000000_site_events.sql");

test("site-event migration keeps the aggregate storage and RPC security boundary", async () => {
  const sql = await readFile(migrationPath, "utf8");

  assert.match(sql, /create schema if not exists measurement_private/i);
  assert.match(sql, /create table if not exists measurement_private\.site_event_daily/i);
  assert.match(sql, /day date primary key/i);
  assert.match(sql, /counts jsonb not null/i);
  assert.match(sql, /total_count bigint not null/i);
  assert.match(sql, /minute_count bigint not null/i);
  assert.match(sql, /alter table measurement_private\.site_event_daily enable row level security/i);
  assert.doesNotMatch(sql, /create policy/i);
  assert.doesNotMatch(sql, /\bexpire\b|\bttl\b|delete from/i);

  for (const functionName of [
    "record_site_event_v1",
    "read_site_event_day_v1",
    "site_events_health_v1",
  ]) {
    assert.match(sql, new RegExp(`security definer[\\s\\S]*?set search_path = ''`, "i"));
    assert.match(sql, new RegExp(`grant execute on function (?:measurement_private|public)\\.${functionName}`, "i"));
    assert.match(sql, new RegExp(`revoke all on function (?:measurement_private|public)\\.${functionName}`, "i"));
  }

  assert.match(sql, /revoke all on table measurement_private\.site_event_daily from public, anon, authenticated, service_role/i);
  assert.match(sql, /grant execute on function public\.record_site_event_v1\(text\) to service_role/i);
  assert.match(sql, /grant execute on function public\.read_site_event_day_v1\(date\) to service_role/i);
  assert.match(sql, /grant execute on function public\.site_events_health_v1\(\) to service_role/i);
  assert.match(sql, /clock_timestamp\(\)/i);
  assert.match(sql, /for update/i);
  assert.match(sql, /v_total >= 1000/i);
  assert.match(sql, /v_minute_count >= 60/i);
  assert.match(sql, /octet_length\(p_field\) > 2048/i);
  assert.match(sql, /jsonb_typeof\(v_field\) <> 'object'/i);
});
