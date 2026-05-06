-- Admin Control Plane: Shipping, AI, Channels, Roles, and Profile Settings
-- Safe forward-only migration
-- Date: 2026-05-06

-- ============================================================
-- 1. user_profiles
-- ============================================================
create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  username text,
  display_name text,
  preferred_language text default 'ar',
  preferred_theme text default 'light',
  preferred_color_theme text default 'pink',
  sidebar_collapsed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'user_profiles_select_own'
  ) then
    create policy user_profiles_select_own on public.user_profiles for select to authenticated using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'user_profiles_update_own'
  ) then
    create policy user_profiles_update_own on public.user_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'user_profiles_insert_own'
  ) then
    create policy user_profiles_insert_own on public.user_profiles for insert to authenticated with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'user_profiles_service_role_all'
  ) then
    create policy user_profiles_service_role_all on public.user_profiles for all to service_role using (true) with check (true);
  end if;
end $$;

create index if not exists idx_user_profiles_user_id on public.user_profiles(user_id);

-- ============================================================
-- 2. user_roles (extend existing if present)
-- ============================================================
-- Note: users_roles already exists from 20260429213000_users_roles.sql
-- We extend the role check to include super_admin, moderator, customer_service
-- but do NOT alter the existing constraint to avoid breaking existing data.
-- Instead, we create a new store_user_roles table with the new role set.

create table if not exists public.store_user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  store_id text not null,
  role text not null check (role in ('super_admin', 'moderator', 'customer_service')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, store_id)
);

alter table public.store_user_roles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'store_user_roles' and policyname = 'store_user_roles_service_role_all'
  ) then
    create policy store_user_roles_service_role_all on public.store_user_roles for all to service_role using (true) with check (true);
  end if;
end $$;

create index if not exists idx_store_user_roles_user_id on public.store_user_roles(user_id);
create index if not exists idx_store_user_roles_store_id on public.store_user_roles(store_id);

-- ============================================================
-- 3. store_shipping_settings
-- ============================================================
create table if not exists public.store_shipping_settings (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  free_shipping_threshold_egp numeric default 1400,
  default_currency text default 'EGP',
  unknown_area_policy text default 'ask_clarify' check (unknown_area_policy in ('ask_clarify', 'use_default', 'reject')),
  default_shipping_fee_egp numeric default 70,
  updated_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(store_id)
);

alter table public.store_shipping_settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'store_shipping_settings' and policyname = 'store_shipping_settings_service_role_all'
  ) then
    create policy store_shipping_settings_service_role_all on public.store_shipping_settings for all to service_role using (true) with check (true);
  end if;
end $$;

create index if not exists idx_store_shipping_settings_store_id on public.store_shipping_settings(store_id);

-- ============================================================
-- 4. shipping_zones
-- ============================================================
create table if not exists public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  governorate text not null,
  district text,
  aliases text[] default '{}',
  shipping_fee_egp numeric not null,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.shipping_zones enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'shipping_zones' and policyname = 'shipping_zones_service_role_all'
  ) then
    create policy shipping_zones_service_role_all on public.shipping_zones for all to service_role using (true) with check (true);
  end if;
end $$;

create index if not exists idx_shipping_zones_store_id on public.shipping_zones(store_id);
create index if not exists idx_shipping_zones_governorate on public.shipping_zones(governorate);

-- Seed default zones only if no zones exist for store 'youlya'
insert into public.shipping_zones (store_id, governorate, district, aliases, shipping_fee_egp, active)
select 'youlya', 'Cairo', 'Nasr City', '{"مدينة نصر","Nasr City","Madinet Nasr"}', 70, true
where not exists (select 1 from public.shipping_zones where store_id = 'youlya');

insert into public.shipping_zones (store_id, governorate, district, aliases, shipping_fee_egp, active)
select 'youlya', 'Cairo', null, '{"القاهرة","Cairo"}', 70, true
where not exists (select 1 from public.shipping_zones where store_id = 'youlya' and governorate = 'Cairo' and district is null);

insert into public.shipping_zones (store_id, governorate, district, aliases, shipping_fee_egp, active)
select 'youlya', 'Alexandria', null, '{"الإسكندرية","Alexandria","Alex"}', 90, true
where not exists (select 1 from public.shipping_zones where store_id = 'youlya' and governorate = 'Alexandria');

-- ============================================================
-- 5. ai_agent_settings
-- ============================================================
create table if not exists public.ai_agent_settings (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  agent_name text default 'Youlya AI',
  provider text default 'openai' check (provider in ('openai', 'anthropic', 'gemini', 'custom')),
  model text,
  api_key_encrypted text,
  api_key_last4 text,
  connection_status text default 'unknown',
  last_tested_at timestamptz,
  active boolean default true,
  updated_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(store_id)
);

alter table public.ai_agent_settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'ai_agent_settings' and policyname = 'ai_agent_settings_service_role_all'
  ) then
    create policy ai_agent_settings_service_role_all on public.ai_agent_settings for all to service_role using (true) with check (true);
  end if;
end $$;

create index if not exists idx_ai_agent_settings_store_id on public.ai_agent_settings(store_id);

-- ============================================================
-- 6. channel_integrations
-- ============================================================
create table if not exists public.channel_integrations (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  provider text not null check (provider in ('evolution_whatsapp', 'meta_whatsapp', 'instagram', 'facebook')),
  display_name text,
  active boolean default false,
  credentials_encrypted text,
  credential_last4 text,
  webhook_secret_encrypted text,
  connection_status text default 'unknown',
  last_checked_at timestamptz,
  updated_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.channel_integrations enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'channel_integrations' and policyname = 'channel_integrations_service_role_all'
  ) then
    create policy channel_integrations_service_role_all on public.channel_integrations for all to service_role using (true) with check (true);
  end if;
end $$;

create index if not exists idx_channel_integrations_store_id on public.channel_integrations(store_id);

-- ============================================================
-- 7. channel_accounts
-- ============================================================
create table if not exists public.channel_accounts (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  channel_integration_id uuid not null references public.channel_integrations(id) on delete cascade,
  provider text not null,
  account_name text,
  external_account_id text,
  phone_number text,
  phone_number_masked text,
  evolution_instance text,
  status text default 'disconnected',
  qr_status text default 'unknown',
  is_default boolean default false,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.channel_accounts enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'channel_accounts' and policyname = 'channel_accounts_service_role_all'
  ) then
    create policy channel_accounts_service_role_all on public.channel_accounts for all to service_role using (true) with check (true);
  end if;
end $$;

create index if not exists idx_channel_accounts_store_id on public.channel_accounts(store_id);
create index if not exists idx_channel_accounts_integration_id on public.channel_accounts(channel_integration_id);

-- ============================================================
-- 8. settings_audit_logs
-- ============================================================
create table if not exists public.settings_audit_logs (
  id uuid primary key default gen_random_uuid(),
  store_id uuid,
  actor_user_id uuid,
  action text not null,
  entity_type text not null,
  entity_id text,
  before_summary jsonb,
  after_summary jsonb,
  created_at timestamptz default now()
);

alter table public.settings_audit_logs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'settings_audit_logs' and policyname = 'settings_audit_logs_service_role_all'
  ) then
    create policy settings_audit_logs_service_role_all on public.settings_audit_logs for all to service_role using (true) with check (true);
  end if;
end $$;

create index if not exists idx_settings_audit_logs_store_id on public.settings_audit_logs(store_id);
create index if not exists idx_settings_audit_logs_created_at on public.settings_audit_logs(created_at desc);

-- ============================================================
-- Seed default store_shipping_settings if not exists
-- ============================================================
insert into public.store_shipping_settings (store_id, free_shipping_threshold_egp, default_currency, unknown_area_policy, default_shipping_fee_egp)
select 'youlya', 1400, 'EGP', 'ask_clarify', 70
where not exists (select 1 from public.store_shipping_settings where store_id = 'youlya');
