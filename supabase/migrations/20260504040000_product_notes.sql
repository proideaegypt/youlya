-- Optional: product_notes table for manual/internal notes on products
-- Safe forward-only migration; no drops or destructive changes

create table if not exists public.product_notes (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  product_id uuid null,
  shopify_product_id text not null,
  note text not null,
  note_type text not null default 'manual',
  visible_to_ai boolean not null default false,
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_product_notes_store_id on public.product_notes (store_id);
create index if not exists idx_product_notes_product_id on public.product_notes (product_id);
create index if not exists idx_product_notes_shopify_product_id on public.product_notes (shopify_product_id);

alter table public.product_notes enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_notes'
      and policyname = 'product_notes_service_role_all'
  ) then
    create policy product_notes_service_role_all
      on public.product_notes
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end $$;
