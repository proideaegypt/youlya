alter table if exists public.handoff_tickets add column if not exists notes text;

alter table if exists public.conversation_state add column if not exists ai_paused boolean not null default false;

-- Ensure status enum-like constraint on handoff_tickets
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'handoff_tickets_status_check'
  ) then
    alter table public.handoff_tickets add constraint handoff_tickets_status_check
      check (status in ('open', 'assigned', 'resolved'));
  end if;
end
$$;
