create table if not exists public.order_idempotency_keys (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  key text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (store_id, key)
);

alter table public.order_idempotency_keys ENABLE ROW LEVEL SECURITY;

drop policy if exists order_idempotency_keys_store_isolation on public.order_idempotency_keys;
create policy order_idempotency_keys_store_isolation
on public.order_idempotency_keys
for all
using (store_id = (auth.jwt() ->> 'store_id')::uuid)
with check (store_id = (auth.jwt() ->> 'store_id')::uuid);

create index if not exists idx_order_idempotency_keys_store_created
on public.order_idempotency_keys (store_id, created_at desc);

