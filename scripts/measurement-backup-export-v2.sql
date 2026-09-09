-- READ-ONLY. Use only after the app-events migration is installed.
-- Includes four private application tables, not all provider data.
-- Keep the exported result outside Git. No email or network operation runs.
select jsonb_build_object(
  'schema_version', 2, 'scope', 'wenlan-site-owned-tables-v2', 'captured_at', now(),
  'tables', jsonb_build_object(
    'site_event_daily', (select coalesce(jsonb_agg(to_jsonb(s) order by day), '[]'::jsonb)
      from measurement_private.site_event_daily s),
    'welcome_delivery', (select coalesce(jsonb_agg(to_jsonb(w) order by audience_id, contact_id), '[]'::jsonb)
      from subscription_private.welcome_delivery w),
    'welcome_budget', (select coalesce(jsonb_agg(to_jsonb(b) order by day), '[]'::jsonb)
      from subscription_private.welcome_budget b),
    'app_event_daily', (select coalesce(jsonb_agg(to_jsonb(a) order by day), '[]'::jsonb)
      from app_measurement_private.app_event_daily a)
  )
) as backup;
