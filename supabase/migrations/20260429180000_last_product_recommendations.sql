-- Phase 0: DB-backed product mapping repository
-- NOTE: This migration enforces the canonical contract for last_product_recommendations.

create table if not exists public.last_product_recommendations (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id),
  conversation_id uuid not null,
  customer_id uuid not null,
  search_id uuid,
  "index" integer not null,
  product_id uuid not null,
  variant_id text not null,
  displayed_title text,
  displayed_size_options jsonb,
  displayed_price numeric,
  inventory_at_show_time integer,
  image_url text,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

alter table public.last_product_recommendations ENABLE ROW LEVEL SECURITY;

drop policy if exists last_product_recommendations_store_isolation on public.last_product_recommendations;
create policy last_product_recommendations_store_isolation
on public.last_product_recommendations
for all
using (store_id = (auth.jwt() ->> 'store_id')::uuid)
with check (store_id = (auth.jwt() ->> 'store_id')::uuid);

create unique index if not exists idx_lpr_store_conversation_index_unique
on public.last_product_recommendations (store_id, conversation_id, "index");

create index if not exists idx_lpr_store_conversation_expires
on public.last_product_recommendations (store_id, conversation_id, expires_at);

