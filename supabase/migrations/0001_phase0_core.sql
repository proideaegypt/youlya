-- Youlya AI Commerce OS — Phase 0 core schema
-- Shopify is source of truth. This DB is operational cache/state.

create extension if not exists pgcrypto;

create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  ai_enabled boolean not null default true,
  kill_switch_enabled boolean not null default false,
  ai_order_creation_enabled boolean not null default true,
  require_sku_for_ai_visibility boolean not null default false,
  max_cart_items integer not null default 5,
  free_shipping_threshold_egp integer not null default 1200,
  shipping_cairo_egp integer not null default 70,
  shipping_alexandria_egp integer not null default 90,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists store_integrations (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  provider text not null,
  status text not null default 'inactive',
  config jsonb not null default '{}'::jsonb,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, provider)
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  channel text not null,
  external_customer_id text,
  phone text,
  name text,
  city text,
  address text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, channel, external_customer_id)
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  channel text not null,
  external_thread_id text,
  status text not null default 'ai_active',
  last_intent text,
  handoff_required boolean not null default false,
  handoff_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, channel, external_thread_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  direction text not null check (direction in ('inbound','outbound','internal')),
  channel text not null,
  provider_message_id text,
  message_type text not null default 'text',
  body text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (store_id, channel, provider_message_id)
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  shopify_product_id text not null,
  shopify_product_gid text,
  shopify_title text not null,
  shopify_handle text not null,
  vendor text,
  product_type text,
  status text,
  tags text[] not null default '{}',
  image_url text,
  ai_visible boolean not null default true,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, shopify_product_id)
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  shopify_variant_id text not null,
  shopify_variant_gid text,
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
  price numeric(12,2) not null default 0,
  currency text not null default 'EGP',
  inventory_quantity integer,
  inventory_policy text,
  available_for_ai boolean not null default true,
  code_missing boolean not null default false,
  last_inventory_checked_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, shopify_variant_id)
);

create table if not exists last_product_recommendations (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  recommendation_index integer not null,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  shopify_product_id text not null,
  shopify_product_title text not null,
  shopify_handle text,
  shopify_variant_id text,
  sku text,
  code_missing boolean not null default false,
  size text,
  color text,
  price numeric(12,2),
  currency text not null default 'EGP',
  inventory_at_show_time integer,
  image_url text,
  used_at timestamptz,
  expires_at timestamptz not null default (now() + interval '2 hours'),
  created_at timestamptz not null default now()
);

create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  status text not null default 'open',
  subtotal numeric(12,2) not null default 0,
  shipping_fee numeric(12,2),
  total numeric(12,2),
  city text,
  address text,
  customer_name text,
  phone text,
  final_summary_message_id uuid references messages(id) on delete set null,
  explicit_confirmation_message_id uuid references messages(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  shopify_product_id text not null,
  shopify_product_title text not null,
  shopify_variant_id text not null,
  sku text,
  code_missing boolean not null default false,
  size text,
  color text,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null,
  currency text not null default 'EGP',
  stock_checked_at timestamptz,
  stock_quantity_at_check integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete set null,
  customer_id uuid references customers(id) on delete set null,
  cart_id uuid references carts(id) on delete set null,
  shopify_order_id text,
  shopify_order_gid text,
  shopify_order_name text,
  status text not null default 'pending',
  payment_method text not null default 'cod',
  subtotal numeric(12,2),
  shipping_fee numeric(12,2),
  total numeric(12,2),
  currency text not null default 'EGP',
  confirmation_message_id uuid references messages(id) on delete set null,
  idempotency_key text,
  raw_shopify_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, idempotency_key),
  unique (store_id, shopify_order_id)
);

create table if not exists idempotency_keys (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  key text not null,
  scope text not null,
  status text not null default 'started',
  result jsonb,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, key)
);

create table if not exists ai_tool_calls (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete set null,
  tool_name text not null,
  input_summary jsonb not null default '{}'::jsonb,
  output_summary jsonb not null default '{}'::jsonb,
  status text not null,
  latency_ms integer,
  error_code text,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  actor_type text not null,
  actor_id text,
  action text not null,
  entity_type text not null,
  entity_id text,
  before jsonb,
  after jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists handoff_tickets (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  reason text not null,
  summary text,
  status text not null default 'open',
  assigned_to uuid,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists webhook_events (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  provider text not null,
  provider_event_id text,
  provider_message_id text,
  event_type text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'received',
  duplicate_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique (store_id, provider, provider_event_id)
);

create table if not exists failed_events (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  provider text,
  source text not null,
  error_code text,
  error_message text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'open',
  retry_count integer not null default 0,
  next_retry_at timestamptz,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- Indexes
create index if not exists idx_customers_store_phone on customers(store_id, phone);
create index if not exists idx_conversations_store_customer on conversations(store_id, customer_id);
create index if not exists idx_messages_conversation_created on messages(conversation_id, created_at);
create index if not exists idx_products_store_title on products(store_id, shopify_title);
create index if not exists idx_variants_store_sku on product_variants(store_id, sku);
create index if not exists idx_variants_store_shopify on product_variants(store_id, shopify_variant_id);
create index if not exists idx_recommendations_conversation_index on last_product_recommendations(conversation_id, recommendation_index, expires_at);
create index if not exists idx_carts_conversation_status on carts(conversation_id, status);
create index if not exists idx_orders_store_status on orders(store_id, status, created_at);
create index if not exists idx_tool_calls_conversation on ai_tool_calls(conversation_id, created_at);
create index if not exists idx_audit_store_entity on audit_logs(store_id, entity_type, entity_id, created_at);
create index if not exists idx_failed_events_status on failed_events(status, next_retry_at);

-- Enable RLS. Phase 2 must add authenticated dashboard policies.
alter table stores enable row level security;
alter table store_integrations enable row level security;
alter table customers enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table last_product_recommendations enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table idempotency_keys enable row level security;
alter table ai_tool_calls enable row level security;
alter table audit_logs enable row level security;
alter table handoff_tickets enable row level security;
alter table webhook_events enable row level security;
alter table failed_events enable row level security;

comment on table last_product_recommendations is 'Safety mapping: resolves customer index selections to Shopify product/variant data. Never replace with LLM memory.';
comment on table idempotency_keys is 'Prevents duplicate order creation from duplicate webhooks or repeated confirmations.';
comment on table ai_tool_calls is 'Operational trace of AI/tool actions. Mask PII/secrets before writing.';
comment on table audit_logs is 'Audit trail for every mutation. Add dashboard RLS policies in Phase 2.';
