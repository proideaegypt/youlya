create table if not exists public.conversation_state (
  conversation_id text primary key,
  stage text not null default 'idle' check (stage in ('idle','collecting_size','collecting_address','awaiting_confirmation','ordered','cancelled')),
  cart_json jsonb not null default '[]'::jsonb,
  customer_name text,
  customer_phone text,
  customer_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_conversation_state_conversation_id on public.conversation_state(conversation_id);
