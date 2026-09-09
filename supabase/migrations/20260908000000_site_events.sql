-- First-party site-event aggregates.
--
-- The table is deliberately private and stores only aggregate counters. The
-- public RPC wrappers are the only API surface; no table or anonymous access
-- is granted. Rows have no expiry in this migration.

create schema if not exists measurement_private;

create table if not exists measurement_private.site_event_daily (
  day date primary key,
  counts jsonb not null default '{}'::jsonb,
  total_count bigint not null default 0,
  minute_window_start timestamp without time zone,
  minute_count bigint not null default 0,
  saturated_minute boolean not null default false,
  saturated_day boolean not null default false,
  constraint site_event_daily_counts_object check (jsonb_typeof(counts) = 'object'),
  constraint site_event_daily_total_nonnegative check (total_count >= 0),
  constraint site_event_daily_minute_nonnegative check (minute_count >= 0)
);

alter table measurement_private.site_event_daily enable row level security;

revoke all on schema measurement_private from public, anon, authenticated, service_role;
revoke all on table measurement_private.site_event_daily from public, anon, authenticated, service_role;

create or replace function measurement_private.record_site_event_v1(p_field text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  v_field jsonb;
  v_now timestamptz;
  v_day date;
  v_minute timestamp without time zone;
  v_counts jsonb;
  v_total bigint;
  v_minute_start timestamp without time zone;
  v_minute_count bigint;
begin
  if p_field is null or pg_catalog.octet_length(p_field) > 2048 then
    raise exception 'invalid site event field';
  end if;

  begin
    v_field := p_field::jsonb;
  exception when others then
    raise exception 'invalid site event field';
  end;
  if pg_catalog.jsonb_typeof(v_field) <> 'object' then
    raise exception 'invalid site event field';
  end if;

  -- Use the database clock, not a client-provided timestamp. The row lock
  -- makes the minute/day cap and counter update one atomic operation.
  v_now := pg_catalog.clock_timestamp();
  v_day := (v_now at time zone 'UTC')::date;

  insert into measurement_private.site_event_daily (day)
  values (v_day)
  on conflict (day) do nothing;

  select d.counts, d.total_count, d.minute_window_start, d.minute_count
    into v_counts, v_total, v_minute_start, v_minute_count
    from measurement_private.site_event_daily as d
   where d.day = v_day
   for update;

  -- A request can wait on a busy row across a UTC minute/day boundary. Read
  -- the database clock again after the lock so an older timestamp can never
  -- reset the current minute counter backwards. If midnight passed, lock the
  -- new day's row before applying the event.
  v_now := pg_catalog.clock_timestamp();
  if (v_now at time zone 'UTC')::date <> v_day then
    v_day := (v_now at time zone 'UTC')::date;
    insert into measurement_private.site_event_daily (day)
    values (v_day)
    on conflict (day) do nothing;
    select d.counts, d.total_count, d.minute_window_start, d.minute_count
      into v_counts, v_total, v_minute_start, v_minute_count
      from measurement_private.site_event_daily as d
     where d.day = v_day
     for update;
  end if;
  v_minute := pg_catalog.date_trunc('minute', v_now at time zone 'UTC');

  if v_total >= 1000 then
    update measurement_private.site_event_daily
       set saturated_day = true
     where day = v_day;
    return pg_catalog.jsonb_build_object('status', 'capped', 'cap', 'day');
  end if;

  if v_minute_start is distinct from v_minute then
    v_minute_count := 0;
  end if;
  if v_minute_count >= 60 then
    update measurement_private.site_event_daily
       set minute_window_start = v_minute,
           minute_count = v_minute_count,
           saturated_minute = true
     where day = v_day;
    return pg_catalog.jsonb_build_object('status', 'capped', 'cap', 'minute');
  end if;

  v_counts := v_counts || pg_catalog.jsonb_build_object(
    p_field,
    coalesce((v_counts ->> p_field)::bigint, 0) + 1
  );
  update measurement_private.site_event_daily
     set counts = v_counts,
         total_count = v_total + 1,
         minute_window_start = v_minute,
         minute_count = v_minute_count + 1
   where day = v_day;

  return pg_catalog.jsonb_build_object('status', 'accepted');
end;
$function$;

create or replace function measurement_private.read_site_event_day_v1(p_day date)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  select d.counts
    || case when d.saturated_minute
       then pg_catalog.jsonb_build_object('__saturated_minute', 1)
       else '{}'::jsonb end
    || case when d.saturated_day
       then pg_catalog.jsonb_build_object('__saturated_day', 1)
       else '{}'::jsonb end
    from measurement_private.site_event_daily as d
   where d.day = p_day;
$function$;

create or replace function measurement_private.site_events_health_v1()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  select pg_catalog.jsonb_build_object(
    'schemaVersion', 1,
    'storage', 'postgres',
    'ready', pg_catalog.to_regclass('measurement_private.site_event_daily') is not null
  );
$function$;

-- PostgREST exposes functions from public by default. These wrappers keep the
-- data schema private while retaining one tightly scoped RPC surface.
create or replace function public.record_site_event_v1(p_field text)
returns jsonb
language sql
volatile
security definer
set search_path = ''
as $function$
  select measurement_private.record_site_event_v1(p_field);
$function$;

create or replace function public.read_site_event_day_v1(p_day date)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  select measurement_private.read_site_event_day_v1(p_day);
$function$;

create or replace function public.site_events_health_v1()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  select measurement_private.site_events_health_v1();
$function$;

revoke all on function measurement_private.record_site_event_v1(text) from public, anon, authenticated;
revoke all on function measurement_private.read_site_event_day_v1(date) from public, anon, authenticated;
revoke all on function measurement_private.site_events_health_v1() from public, anon, authenticated;
revoke all on function public.record_site_event_v1(text) from public, anon, authenticated;
revoke all on function public.read_site_event_day_v1(date) from public, anon, authenticated;
revoke all on function public.site_events_health_v1() from public, anon, authenticated;

grant execute on function measurement_private.record_site_event_v1(text) to service_role;
grant execute on function measurement_private.read_site_event_day_v1(date) to service_role;
grant execute on function measurement_private.site_events_health_v1() to service_role;
grant execute on function public.record_site_event_v1(text) to service_role;
grant execute on function public.read_site_event_day_v1(date) to service_role;
grant execute on function public.site_events_health_v1() to service_role;
