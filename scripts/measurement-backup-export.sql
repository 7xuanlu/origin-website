-- Authorized operator only, READ-ONLY console. One statement = one snapshot.
-- Contains private subscription contact identifiers: never commit the output.
-- This is the three application-owned tables, NOT all Supabase platform data.
select jsonb_build_object(
  'schema_version', 1, 'scope', 'wenlan-site-owned-tables-v1', 'captured_at', now(),
  'tables', jsonb_build_object(
    'site_event_daily', (select coalesce(jsonb_agg(to_jsonb(s) order by day), '[]'::jsonb)
      from measurement_private.site_event_daily s),
    'welcome_delivery', (select coalesce(jsonb_agg(to_jsonb(w) order by audience_id, contact_id), '[]'::jsonb)
      from subscription_private.welcome_delivery w),
    'welcome_budget', (select coalesce(jsonb_agg(to_jsonb(b) order by day), '[]'::jsonb)
      from subscription_private.welcome_budget b)
  )
) as backup;
