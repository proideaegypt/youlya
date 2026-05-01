-- Phase E schema reconciliation
-- Purpose: forward-only, non-destructive alignment of production schema with app table usage.
-- Safety rules:
-- 1) create-if-not-exists only
-- 2) add indexes/policies if missing
-- 3) no drops/truncates/type rewrites

create extension if not exists pgcrypto;

-- Incoming provider idempotency ledger used by lib/middleware/idempotency.ts
create table if not exists public.processed_messages (
  provider_message_id text primary key,
  conversation_id uuid not null,
  processed_at timestamptz not null default now(),
  result_action text
);
create index if not exists idx_processed_messages_conversation_id
  on public.processed_messages (conversation_id);
alter table public.processed_messages disable row level security;

-- Order confirmation idempotency table used by lib/services/idempotency-service.ts
create table if not exists public.order_idempotency_keys (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  key text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (store_id, key)
);
create index if not exists idx_order_idempotency_keys_store_created
  on public.order_idempotency_keys (store_id, created_at desc);
alter table public.order_idempotency_keys enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'order_idempotency_keys'
      and policyname = 'order_idempotency_keys_store_isolation'
  ) then
    create policy order_idempotency_keys_store_isolation
    on public.order_idempotency_keys
    for all
    using (store_id = (auth.jwt() ->> 'store_id')::uuid)
    with check (store_id = (auth.jwt() ->> 'store_id')::uuid);
  end if;
end $$;

-- Dead-letter capture table used by lib/services/dead-letter-service.ts
create table if not exists public.dead_letter_log (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid,
  provider_message_id text,
  raw_input jsonb not null,
  error_message text not null,
  error_stack text,
  created_at timestamptz not null default now(),
  retry_count integer not null default 0
);
create index if not exists idx_dead_letter_log_conversation_id
  on public.dead_letter_log (conversation_id);
create index if not exists idx_dead_letter_log_provider_message_id
  on public.dead_letter_log (provider_message_id);
alter table public.dead_letter_log disable row level security;

-- AI setting + handoff queue used by ai-settings and handoff services
create table if not exists public.ai_settings (
  store_id text primary key default 'youlya',
  ai_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by text
);
insert into public.ai_settings (store_id, ai_enabled)
values ('youlya', true)
on conflict (store_id) do nothing;
alter table public.ai_settings disable row level security;

create table if not exists public.human_handoffs (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  reason text not null,
  requested_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by text,
  notes text
);
create index if not exists idx_human_handoffs_open
  on public.human_handoffs (requested_at desc)
  where resolved_at is null;
create index if not exists idx_human_handoffs_conversation_id
  on public.human_handoffs (conversation_id);
alter table public.human_handoffs disable row level security;

-- Dashboard/store access table referenced by require-store-context middleware
create table if not exists public.store_users (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('owner', 'admin', 'agent', 'viewer')),
  created_at timestamptz not null default now(),
  unique (store_id, user_id)
);
create index if not exists idx_store_users_store_id on public.store_users(store_id);
create index if not exists idx_store_users_user_id on public.store_users(user_id);
alter table public.store_users enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'store_users'
      and policyname = 'store_users_select_own'
  ) then
    create policy store_users_select_own
    on public.store_users
    for select
    using (auth.uid() = user_id);
  end if;
end $$;

-- Legacy roles table referenced by later migrations; kept for compatibility.
create table if not exists public.users_roles (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null,
  user_id uuid not null,
  role text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (store_id, user_id)
);
alter table public.users_roles enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users_roles'
      and policyname = 'users_roles_service_role_all'
  ) then
    create policy users_roles_service_role_all
    on public.users_roles
    for all
    to service_role
    using (true)
    with check (true);
  end if;
end $$;
