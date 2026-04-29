create extension if not exists pgcrypto;

create table if not exists store_users (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('owner', 'admin', 'agent', 'viewer')),
  created_at timestamptz not null default now(),
  unique (store_id, user_id)
);

alter table store_users ENABLE ROW LEVEL SECURITY;

drop policy if exists store_users_select_own on store_users;
create policy store_users_select_own
on store_users
for select
using (auth.uid() = user_id);

create index if not exists idx_store_users_store_id on store_users(store_id);
create index if not exists idx_store_users_user_id on store_users(user_id);
