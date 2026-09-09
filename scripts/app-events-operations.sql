-- Run as an authorized database operator in a READ-ONLY SQL console.
-- Last 28 complete UTC days, plus today explicitly marked partial.
-- These are client-reported operations, not people, crashes, installs, or
-- website interactions. Missing and capped days are not silently zero-filled.
with bounds as (
  select (current_timestamp at time zone 'UTC')::date as today
), days as (
  select b.today - i as day, b.today
  from bounds b cross join generate_series(0, 28) as i
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
  'unknown_contamination_possible'::text as contamination_boundary,
  'client_reported_operations_not_people_sessions_installs_crashes'::text as unit_boundary
from days d
left join app_measurement_private.app_event_daily a on a.day = d.day
order by d.day;
