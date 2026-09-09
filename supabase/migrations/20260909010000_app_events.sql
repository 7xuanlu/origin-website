-- Native-app first-party measurement aggregates.
--
-- This is deliberately separate from website interaction aggregates. It stores
-- only client-reported operation counters by UTC day, release version, and
-- platform. There are no identity fields, timestamps supplied by clients, or
-- raw event rows.

create schema if not exists app_measurement_private;

create table if not exists app_measurement_private.app_event_daily (
  day date primary key,
  version_buckets jsonb not null default '{}'::jsonb,
  batch_count bigint not null default 0,
  operation_count bigint not null default 0,
  minute_window_start timestamp without time zone,
  minute_batch_count bigint not null default 0,
  saturated_minute boolean not null default false,
  saturated_batch_day boolean not null default false,
  saturated_operation_day boolean not null default false,
  saturated_version_day boolean not null default false,
  constraint app_event_daily_version_buckets_object check (jsonb_typeof(version_buckets) = 'object'),
  constraint app_event_daily_batch_nonnegative check (batch_count >= 0 and batch_count <= 1000),
  constraint app_event_daily_operation_nonnegative check (operation_count >= 0 and operation_count <= 100000),
  constraint app_event_daily_minute_nonnegative check (minute_batch_count >= 0 and minute_batch_count <= 60)
);

alter table app_measurement_private.app_event_daily enable row level security;

-- No direct table/schema access, including service_role. The public RPC
-- wrappers below are the only server entry point and execute as the owner.
revoke all on schema app_measurement_private from public, anon, authenticated, service_role;
revoke all on table app_measurement_private.app_event_daily from public, anon, authenticated, service_role;

create or replace function app_measurement_private.record_app_event_v1(
  p_app_version text,
  p_platform text,
  p_counters jsonb
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  v_now timestamptz;
  v_day date;
  v_minute timestamp without time zone;
  v_buckets jsonb;
  v_batch_count bigint;
  v_operation_count bigint;
  v_minute_start timestamp without time zone;
  v_minute_count bigint;
  v_operation_batch bigint := 0;
  v_key text;
  v_value jsonb;
  v_count bigint;
  v_version_count bigint;
  v_platform_counts jsonb;
begin
  if p_app_version is null or p_app_version !~ '^(0|[1-9][0-9]{0,2})\.(0|[1-9][0-9]{0,2})\.(0|[1-9][0-9]{0,2})$' then
    raise exception 'invalid app event version';
  end if;
  if p_platform is null or p_platform not in ('macos', 'windows', 'linux', 'other') then
    raise exception 'invalid app event platform';
  end if;
  if p_counters is null or pg_catalog.jsonb_typeof(p_counters) <> 'object' then
    raise exception 'invalid app event counters';
  end if;

  -- Validate counter names and integer values before taking the aggregate row
  -- lock. JSON numbers with decimals or exponents are intentionally rejected.
  for v_key, v_value in select e.key, e.value from pg_catalog.jsonb_each(p_counters) as e loop
    if v_key not in (
      'daemon_ready', 'save_success', 'search_nonempty', 'search_empty',
      'wiki_generated', 'save_error', 'search_error', 'wiki_error'
    ) then
      raise exception 'invalid app event counter';
    end if;
    if pg_catalog.jsonb_typeof(v_value) <> 'number' or v_value::text !~ '^(0|[1-9][0-9]*)$' then
      raise exception 'invalid app event counter value';
    end if;
    begin
      v_count := v_value::text::bigint;
    exception when others then
      raise exception 'invalid app event counter value';
    end;
    if v_count < 1 or v_count > 1000 then
      raise exception 'invalid app event counter value';
    end if;
    v_operation_batch := v_operation_batch + v_count;
    if v_operation_batch > 1000 then
      raise exception 'app event batch exceeds 1000 operations';
    end if;
  end loop;
  if v_operation_batch < 1 then
    raise exception 'app event counters must not be empty';
  end if;

  -- Database time and a locked UTC row make all caps atomic. The clock is read
  -- again after the lock so a request straddling midnight cannot update an old
  -- day's row with a new day's minute window.
  v_now := pg_catalog.clock_timestamp();
  v_day := (v_now at time zone 'UTC')::date;
  insert into app_measurement_private.app_event_daily (day)
  values (v_day)
  on conflict (day) do nothing;

  select d.version_buckets, d.batch_count, d.operation_count,
         d.minute_window_start, d.minute_batch_count
    into v_buckets, v_batch_count, v_operation_count,
         v_minute_start, v_minute_count
    from app_measurement_private.app_event_daily as d
   where d.day = v_day
   for update;

  v_now := pg_catalog.clock_timestamp();
  if (v_now at time zone 'UTC')::date <> v_day then
    v_day := (v_now at time zone 'UTC')::date;
    insert into app_measurement_private.app_event_daily (day)
    values (v_day)
    on conflict (day) do nothing;
    select d.version_buckets, d.batch_count, d.operation_count,
           d.minute_window_start, d.minute_batch_count
      into v_buckets, v_batch_count, v_operation_count,
           v_minute_start, v_minute_count
      from app_measurement_private.app_event_daily as d
     where d.day = v_day
     for update;
  end if;
  v_minute := pg_catalog.date_trunc('minute', v_now at time zone 'UTC');

  if v_batch_count >= 1000 then
    update app_measurement_private.app_event_daily
       set saturated_batch_day = true
     where day = v_day;
    return pg_catalog.jsonb_build_object('status', 'capped', 'cap', 'batch_day');
  end if;
  if v_operation_count + v_operation_batch > 100000 then
    update app_measurement_private.app_event_daily
       set saturated_operation_day = true
     where day = v_day;
    return pg_catalog.jsonb_build_object('status', 'capped', 'cap', 'operations_day');
  end if;
  if v_minute_start is distinct from v_minute then
    v_minute_count := 0;
  end if;
  if v_minute_count >= 60 then
    update app_measurement_private.app_event_daily
       set minute_window_start = v_minute,
           minute_batch_count = v_minute_count,
           saturated_minute = true
     where day = v_day;
    return pg_catalog.jsonb_build_object('status', 'capped', 'cap', 'minute');
  end if;
  select count(*) into v_version_count
    from pg_catalog.jsonb_object_keys(v_buckets);
  if not (v_buckets ? p_app_version) and v_version_count >= 20 then
    update app_measurement_private.app_event_daily
       set saturated_version_day = true
     where day = v_day;
    return pg_catalog.jsonb_build_object('status', 'capped', 'cap', 'version_day');
  end if;

  v_platform_counts := coalesce(v_buckets -> p_app_version -> p_platform, '{}'::jsonb);
  for v_key, v_value in select e.key, e.value from pg_catalog.jsonb_each(p_counters) as e loop
    v_count := v_value::text::bigint;
    v_platform_counts := v_platform_counts || pg_catalog.jsonb_build_object(
      v_key,
      coalesce((v_platform_counts ->> v_key)::bigint, 0) + v_count
    );
  end loop;
  -- jsonb_set does not create missing intermediate objects, so merge the
  -- platform object into its version object explicitly.
  v_buckets := v_buckets || pg_catalog.jsonb_build_object(
    p_app_version,
    coalesce(v_buckets -> p_app_version, '{}'::jsonb)
      || pg_catalog.jsonb_build_object(p_platform, v_platform_counts)
  );

  update app_measurement_private.app_event_daily
     set version_buckets = v_buckets,
         batch_count = v_batch_count + 1,
         operation_count = v_operation_count + v_operation_batch,
         minute_window_start = v_minute,
         minute_batch_count = v_minute_count + 1
   where day = v_day;

  return pg_catalog.jsonb_build_object('status', 'accepted');
end;
$function$;

create or replace function app_measurement_private.read_app_event_day_v1(p_day date)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  select pg_catalog.jsonb_build_object(
    'day', d.day,
    'version_buckets', d.version_buckets,
    'batch_count', d.batch_count,
    'operation_count', d.operation_count,
    'saturated_minute', d.saturated_minute,
    'saturated_batch_day', d.saturated_batch_day,
    'saturated_operation_day', d.saturated_operation_day,
    'saturated_version_day', d.saturated_version_day
  )
    from app_measurement_private.app_event_daily as d
   where d.day = p_day;
$function$;

create or replace function app_measurement_private.app_events_health_v1()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  with table_ref as (
    select
      pg_catalog.to_regclass('app_measurement_private.app_event_daily') as table_oid,
      pg_catalog.to_regnamespace('app_measurement_private') as schema_oid
  ), table_checks as (
    select
      t.table_oid is not null as table_exists,
      t.schema_oid is not null as schema_exists,
      case when t.table_oid is null then false else coalesce(c.relrowsecurity, false) end as rls_enabled,
      case when t.table_oid is null then false else not pg_catalog.has_table_privilege('anon', t.table_oid, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') end as anon_table_closed,
      case when t.table_oid is null then false else not pg_catalog.has_table_privilege('authenticated', t.table_oid, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') end as authenticated_table_closed,
      case when t.table_oid is null then false else not pg_catalog.has_table_privilege('service_role', t.table_oid, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') end as service_role_table_closed
    from table_ref as t
    left join pg_catalog.pg_class as c on c.oid = t.table_oid
  ), schema_checks as (
    select
      case when t.schema_oid is null then false else not pg_catalog.has_schema_privilege('anon', t.schema_oid, 'USAGE') end as anon_schema_closed,
      case when t.schema_oid is null then false else not pg_catalog.has_schema_privilege('authenticated', t.schema_oid, 'USAGE') end as authenticated_schema_closed,
      case when t.schema_oid is null then false else not pg_catalog.has_schema_privilege('service_role', t.schema_oid, 'USAGE') end as service_role_schema_closed
    from table_ref as t
  ), function_specs(signature, public_rpc) as (
    values
      ('app_measurement_private.record_app_event_v1(text,text,jsonb)', false),
      ('app_measurement_private.read_app_event_day_v1(date)', false),
      ('app_measurement_private.app_events_health_v1()', false),
      ('public.record_app_event_v1(text,text,jsonb)', true),
      ('public.read_app_event_day_v1(date)', true),
      ('public.app_events_health_v1()', true)
  ), function_checks as (
    select
      f.public_rpc,
      p.oid is not null as function_exists,
      coalesce(p.prosecdef, false) as security_definer,
      coalesce(p.proconfig @> array['search_path=""'], false) as fixed_search_path,
      coalesce(pg_catalog.has_function_privilege('service_role', p.oid, 'EXECUTE'), false) as service_role_execute,
      coalesce(pg_catalog.has_function_privilege('anon', p.oid, 'EXECUTE'), false) as anon_execute,
      coalesce(pg_catalog.has_function_privilege('authenticated', p.oid, 'EXECUTE'), false) as authenticated_execute
    from function_specs as f
    left join pg_catalog.pg_proc as p
      on p.oid = pg_catalog.to_regprocedure(f.signature)
  )
  select pg_catalog.jsonb_build_object(
    'schemaVersion', 1,
    'storage', 'postgres',
    'ready',
      coalesce((select t.table_exists and t.schema_exists and t.rls_enabled
        and t.anon_table_closed and t.authenticated_table_closed and t.service_role_table_closed
        from table_checks as t), false)
      and coalesce((select s.anon_schema_closed and s.authenticated_schema_closed and s.service_role_schema_closed
        from schema_checks as s), false)
      and coalesce((select pg_catalog.bool_and(
        f.function_exists and f.security_definer and f.fixed_search_path
        and not f.anon_execute and not f.authenticated_execute
        and (not f.public_rpc or f.service_role_execute)
      ) from function_checks as f), false)
  );
$function$;

-- PostgREST exposes functions from public by default. The wrappers retain a
-- private data schema while keeping one server-only RPC surface.
create or replace function public.record_app_event_v1(
  p_app_version text,
  p_platform text,
  p_counters jsonb
)
returns jsonb
language sql
volatile
security definer
set search_path = ''
as $function$
  select app_measurement_private.record_app_event_v1(p_app_version, p_platform, p_counters);
$function$;

create or replace function public.read_app_event_day_v1(p_day date)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  select app_measurement_private.read_app_event_day_v1(p_day);
$function$;

create or replace function public.app_events_health_v1()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  select app_measurement_private.app_events_health_v1();
$function$;

revoke all on function app_measurement_private.record_app_event_v1(text, text, jsonb) from public, anon, authenticated;
revoke all on function app_measurement_private.read_app_event_day_v1(date) from public, anon, authenticated;
revoke all on function app_measurement_private.app_events_health_v1() from public, anon, authenticated;
revoke all on function public.record_app_event_v1(text, text, jsonb) from public, anon, authenticated;
revoke all on function public.read_app_event_day_v1(date) from public, anon, authenticated;
revoke all on function public.app_events_health_v1() from public, anon, authenticated;

grant execute on function app_measurement_private.record_app_event_v1(text, text, jsonb) to service_role;
grant execute on function app_measurement_private.read_app_event_day_v1(date) to service_role;
grant execute on function app_measurement_private.app_events_health_v1() to service_role;
grant execute on function public.record_app_event_v1(text, text, jsonb) to service_role;
grant execute on function public.read_app_event_day_v1(date) to service_role;
grant execute on function public.app_events_health_v1() to service_role;
