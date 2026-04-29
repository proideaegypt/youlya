create table if not exists public.last_product_recommendations (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null,
  slot_number integer not null,
  shopify_product_id text not null,
  shopify_variant_id text not null,
  title text not null,
  price numeric(12,2) not null,
  image_url text,
  size_asked text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.last_product_recommendations
  add column if not exists slot_number integer,
  add column if not exists shopify_product_id text,
  add column if not exists shopify_variant_id text,
  add column if not exists title text,
  add column if not exists price numeric(12,2),
  add column if not exists size_asked text;

create index if not exists idx_last_product_recommendations_conversation_id
  on public.last_product_recommendations (conversation_id);

alter table public.last_product_recommendations DISABLE ROW LEVEL SECURITY;
