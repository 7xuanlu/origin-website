-- Run as an authorized database operator in a READ-ONLY SQL console.
-- Last 28 complete UTC days, plus today explicitly marked partial.
-- No contact tables, identities, DDL, writes, or secret values are read.
with bounds as (
  select (current_timestamp at time zone 'UTC')::date as today
), days as (
  select b.today - i as day, b.today
  from bounds b cross join generate_series(0, 28) as i
)
select
  d.day,
  case when d.day = d.today then 'partial_today' else 'complete_calendar_day' end as window_state,
  case when s.day is null then 'unavailable'
       when s.saturated_day or s.saturated_minute then 'capped'
       else 'observed_not_complete' end as collection_state,
  s.total_count as accepted_operations,
  s.saturated_minute,
  s.saturated_day,
  s.counts as operation_counters,
  'unknown_not_identifiable'::text as owner_test_contamination,
  'operations_not_people_sessions_installs_or_new_subscribers'::text as unit_boundary
from days d
left join measurement_private.site_event_daily s on s.day = d.day
order by d.day;
