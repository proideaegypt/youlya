create table if not exists public.ai_tool_calls (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  conversation_id text not null,
  tool_name text not null,
  input_summary jsonb not null default '{}'::jsonb,
  output_summary jsonb not null default '{}'::jsonb,
  status text not null,
  latency_ms integer,
  error_code text,
  created_at timestamptz not null default now()
);

alter table public.ai_tool_calls ENABLE ROW LEVEL SECURITY;

drop policy if exists ai_tool_calls_store_isolation on public.ai_tool_calls;
create policy ai_tool_calls_store_isolation
on public.ai_tool_calls
for all
using (store_id = (auth.jwt() ->> 'store_id')::uuid)
with check (store_id = (auth.jwt() ->> 'store_id')::uuid);

create index if not exists idx_ai_tool_calls_store_conversation_created
on public.ai_tool_calls (store_id, conversation_id, created_at desc);

