-- Shopify Product + Variant Sync Schema
-- Purpose: production-safe cache of Shopify products and variants
-- Safety rules:
-- 1) create-if-not-exists only
-- 2) add indexes if missing
-- 3) no drops/truncates/deletes
-- 4) every queryable table includes store_id

-- ============================================
-- products
-- ============================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id text not null default 'youlya',
  shopify_product_id text not null,
  shopify_product_gid text,
  shopify_title text not null,
  shopify_handle text,
  vendor text,
  product_type text,
  status text not null default 'active',
  tags text[],
  image_url text,
  ai_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_synced_at timestamptz not null default now()
);

-- Composite unique on store + shopify product id
do $$
begin
  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and tablename = 'products'
      and indexname = 'idx_products_store_shopify_product_id_unique'
  ) then
    create unique index idx_products_store_shopify_product_id_unique
      on public.products (store_id, shopify_product_id);
  end if;
end $$;

create index if not exists idx_products_store_id on public.products (store_id);
create index if not exists idx_products_status on public.products (status);
create index if not exists idx_products_ai_visible on public.products (ai_visible) where ai_visible = true;
create index if not exists idx_products_last_synced_at on public.products (last_synced_at desc);

-- RLS policies for products
alter table public.products enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'products'
      and policyname = 'products_service_role_all'
  ) then
    create policy products_service_role_all
      on public.products
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end $$;

-- ============================================
-- product_variants
-- ============================================
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  store_id text not null default 'youlya',
  product_id uuid references public.products(id),
  shopify_variant_id text not null,
  shopify_variant_gid text,
  shopify_product_id text not null,
  sku text,
  barcode text,
  variant_title text,
  option1_name text,
  option1_value text,
  option2_name text,
  option2_value text,
  option3_name text,
  option3_value text,
  size text,
  color text,
  price numeric(12,2),
  currency text not null default 'EGP',
  inventory_quantity integer not null default 0,
  inventory_policy text default 'deny',
  available_for_ai boolean not null default true,
  code_missing boolean not null default false,
  last_inventory_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_synced_at timestamptz not null default now()
);

-- Composite unique on store + shopify variant id
do $$
begin
  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and tablename = 'product_variants'
      and indexname = 'idx_product_variants_store_shopify_variant_id_unique'
  ) then
    create unique index idx_product_variants_store_shopify_variant_id_unique
      on public.product_variants (store_id, shopify_variant_id);
  end if;
end $$;

create index if not exists idx_product_variants_store_id on public.product_variants (store_id);
create index if not exists idx_product_variants_product_id on public.product_variants (product_id);
create index if not exists idx_product_variants_available_for_ai on public.product_variants (available_for_ai) where available_for_ai = true;
create index if not exists idx_product_variants_sku on public.product_variants (sku);
create index if not exists idx_product_variants_code_missing on public.product_variants (code_missing) where code_missing = true;
create index if not exists idx_product_variants_last_synced_at on public.product_variants (last_synced_at desc);

-- RLS policies for product_variants
alter table public.product_variants enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_variants'
      and policyname = 'product_variants_service_role_all'
  ) then
    create policy product_variants_service_role_all
      on public.product_variants
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end $$;

-- ============================================
-- last_product_recommendations (augment)
-- ============================================
-- Add missing columns to existing table if not present
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'last_product_recommendations'
      and column_name = 'store_id'
  ) then
    alter table public.last_product_recommendations add column store_id text not null default 'youlya';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'last_product_recommendations'
      and column_name = 'expires_at'
  ) then
    alter table public.last_product_recommendations add column expires_at timestamptz not null default now() + interval '2 hours';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'last_product_recommendations'
      and column_name = 'customer_id'
  ) then
    alter table public.last_product_recommendations add column customer_id text;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'last_product_recommendations'
      and column_name = 'shopify_handle'
  ) then
    alter table public.last_product_recommendations add column shopify_handle text;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'last_product_recommendations'
      and column_name = 'sku'
  ) then
    alter table public.last_product_recommendations add column sku text;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'last_product_recommendations'
      and column_name = 'code_missing'
  ) then
    alter table public.last_product_recommendations add column code_missing boolean not null default false;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'last_product_recommendations'
      and column_name = 'size'
  ) then
    alter table public.last_product_recommendations add column size text;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'last_product_recommendations'
      and column_name = 'color'
  ) then
    alter table public.last_product_recommendations add column color text;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'last_product_recommendations'
      and column_name = 'inventory_at_show_time'
  ) then
    alter table public.last_product_recommendations add column inventory_at_show_time integer;
  end if;
end $$;

create index if not exists idx_last_product_recommendations_store_conversation
  on public.last_product_recommendations (store_id, conversation_id);
