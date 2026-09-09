-- Additive, separate from anonymous analytics. Never stores an email address.
begin;
create schema if not exists subscription_private;
revoke all on schema subscription_private from public, anon, authenticated;
create table if not exists subscription_private.welcome_delivery (
  audience_id uuid not null,
  contact_id uuid not null,
  attempt_id uuid,
  state text not null check (state in ('claimed','sent','failed','suppressed')),
  suppressed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  provider_id uuid,
  primary key (audience_id, contact_id)
);
create table if not exists subscription_private.welcome_budget (
  day date primary key,
  attempts integer not null check (attempts between 0 and 50)
);
create index if not exists welcome_delivery_created_idx on subscription_private.welcome_delivery(created_at) where attempt_id is not null;
alter table subscription_private.welcome_delivery enable row level security;
alter table subscription_private.welcome_budget enable row level security;
revoke all on all tables in schema subscription_private from public, anon, authenticated, service_role;

create or replace function public.claim_welcome_v1(p_audience uuid, p_contact uuid, p_attempt uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare v_day date := (now() at time zone 'UTC')::date; v_count integer;
begin
  if p_audience is null or p_contact is null or p_attempt is null then raise exception 'invalid claim'; end if;
  -- Serialize the short claim transaction, never the network send.
  perform pg_advisory_xact_lock(20260909, 1);
  if exists (select 1 from subscription_private.welcome_delivery where audience_id=p_audience and contact_id=p_contact) then return 'duplicate'; end if;
  insert into subscription_private.welcome_budget(day, attempts) values(v_day, 0) on conflict do nothing;
  select attempts into v_count from subscription_private.welcome_budget where day=v_day for update;
  if v_count >= 50 then return 'capped'; end if;
  if (select count(*) from subscription_private.welcome_delivery where created_at > now()-interval '1 minute' and attempt_id is not null) >= 10 then return 'capped'; end if;
  insert into subscription_private.welcome_delivery(audience_id,contact_id,attempt_id,state)
    values(p_audience,p_contact,p_attempt,'claimed');
  update subscription_private.welcome_budget set attempts=attempts+1 where day=v_day;
  return 'claimed';
end $$;

create or replace function public.finish_welcome_v1(p_audience uuid, p_contact uuid, p_attempt uuid, p_state text, p_provider uuid default null)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_state not in ('sent','failed') or (p_state='sent' and p_provider is null) then raise exception 'invalid outcome'; end if;
  update subscription_private.welcome_delivery set state=p_state, provider_id=p_provider, updated_at=now()
    where audience_id=p_audience and contact_id=p_contact and attempt_id=p_attempt and state='claimed';
  return found;
end $$;

create or replace function public.suppress_welcome_v1(p_audience uuid, p_contact uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(20260909, 1);
  -- Consent and delivery are independent: keep late provider receipts and failures.
  insert into subscription_private.welcome_delivery(audience_id,contact_id,state,suppressed) values(p_audience,p_contact,'suppressed',true)
    on conflict(audience_id,contact_id) do update set suppressed=true,updated_at=now();
  return true;
end $$;

create or replace function public.welcome_allowed_v1(p_audience uuid, p_contact uuid, p_attempt uuid)
returns boolean language sql security definer set search_path = '' as $$
  select exists(select 1 from subscription_private.welcome_delivery where audience_id=p_audience and contact_id=p_contact and attempt_id=p_attempt and state='claimed' and not suppressed);
$$;

create or replace function public.welcome_status_v1()
returns jsonb language sql security definer set search_path = '' as $$
  select jsonb_build_object('schemaVersion',1,'claimed',(select count(*) from subscription_private.welcome_delivery where state='claimed'),
    'sent',(select count(*) from subscription_private.welcome_delivery where state='sent'),
    'failed',(select count(*) from subscription_private.welcome_delivery where state='failed'),
    'suppressed',(select count(*) from subscription_private.welcome_delivery where suppressed));
$$;
revoke all on function public.claim_welcome_v1(uuid,uuid,uuid), public.finish_welcome_v1(uuid,uuid,uuid,text,uuid), public.suppress_welcome_v1(uuid,uuid), public.welcome_allowed_v1(uuid,uuid,uuid), public.welcome_status_v1() from public, anon, authenticated;
grant execute on function public.claim_welcome_v1(uuid,uuid,uuid), public.finish_welcome_v1(uuid,uuid,uuid,text,uuid), public.suppress_welcome_v1(uuid,uuid), public.welcome_allowed_v1(uuid,uuid,uuid), public.welcome_status_v1() to service_role;
commit;
