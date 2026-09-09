-- Run as an authorized database operator in a READ-ONLY SQL console.
-- Last 28 complete UTC days, plus today explicitly marked partial.
-- These are client-reported operations, not people, crashes, installs, or
-- website interactions. Missing and capped days are not silently zero-filled.
--
-- Local test-day exclusions are intentionally empty by default. An authorized
-- operator may edit the typed DATE/reason VALUES row for a private readout,
-- then save the exact query and receipt privately; do not commit real dates or
-- receipts here. Duplicate dates are surfaced as invalid configuration.
-- Eligible values below are for complete calendar-day comparisons only; they
-- do not claim complete collection, organic activity, users, sessions, or
-- installs.
with bounds as (
  select (current_timestamp at time zone 'UTC')::date as today
), days as (
  select b.today - i as day, b.today
  from bounds b cross join generate_series(0, 28) as i
), excluded_days(day, exclusion_reason) as (
  select v.day, v.exclusion_reason
  from (values
    -- (date 'YYYY-MM-DD', 'local reason')
    (null::date, null::text)
  ) as v(day, exclusion_reason)
  where v.day is not null
), duplicate_excluded_days as (
  select e.day
  from excluded_days e
  group by e.day
  having count(*) > 1
), normalized_excluded_days as (
  select e.day, max(e.exclusion_reason) as exclusion_reason
  from excluded_days e
  group by e.day
), exclusion_config as (
  select case when exists (select 1 from duplicate_excluded_days)
              then 'invalid_duplicate_dates'
              else 'valid'
         end as exclusion_config_state
)
select
  d.day,
  case when d.day = d.today then 'partial_today' else 'complete_calendar_day' end as window_state,
  case when a.day is null then 'unavailable'
       when a.saturated_minute or a.saturated_batch_day or a.saturated_operation_day or a.saturated_version_day then 'capped'
       else 'observed_not_complete' end as collection_state,
  a.batch_count as accepted_batches,
  a.operation_count as accepted_operations,
  a.version_buckets,
  a.saturated_minute,
  a.saturated_batch_day,
  a.saturated_operation_day,
  a.saturated_version_day,
  case when e.day is null then 'not_excluded' else 'excluded' end as exclusion_state,
  e.exclusion_reason,
  c.exclusion_config_state,
  case
    when c.exclusion_config_state <> 'valid' then 'invalid_exclusion_configuration'
    when e.day is not null then 'excluded'
    when d.day = d.today then 'partial_today'
    when a.day is null then 'unavailable'
    when a.saturated_minute or a.saturated_batch_day or a.saturated_operation_day or a.saturated_version_day then 'capped'
    else 'eligible_complete_day'
  end as eligible_state,
  case
    when c.exclusion_config_state = 'valid'
      and e.day is null
      and d.day <> d.today
      and a.day is not null
      and not (a.saturated_minute or a.saturated_batch_day or a.saturated_operation_day or a.saturated_version_day)
    then a.batch_count
    else null
  end as eligible_accepted_batches,
  case
    when c.exclusion_config_state = 'valid'
      and e.day is null
      and d.day <> d.today
      and a.day is not null
      and not (a.saturated_minute or a.saturated_batch_day or a.saturated_operation_day or a.saturated_version_day)
    then a.operation_count
    else null
  end as eligible_accepted_operations,
  'unknown_contamination_possible'::text as contamination_boundary,
  'client_reported_operations_not_people_sessions_installs_crashes'::text as unit_boundary
from days d
left join app_measurement_private.app_event_daily a on a.day = d.day
left join normalized_excluded_days e on e.day = d.day
cross join exclusion_config c
order by d.day;
