create table if not exists public.handoff_tickets (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  conversation_id uuid not null,
  reason text not null,
  priority text not null,
  status text not null default 'open',
  assigned_user_id uuid,
  ai_summary text,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

alter table public.handoff_tickets enable row level security;

drop policy if exists handoff_tickets_store_isolation on public.handoff_tickets;
create policy handoff_tickets_store_isolation
on public.handoff_tickets
for all
using (store_id = (auth.jwt() ->> 'store_id')::uuid)
with check (store_id = (auth.jwt() ->> 'store_id')::uuid);

create unique index if not exists idx_handoff_store_conversation_open
on public.handoff_tickets (store_id, conversation_id, status);

