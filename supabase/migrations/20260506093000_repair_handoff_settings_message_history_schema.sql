-- Forward-only emergency repair for production schema drift after WhatsApp freeze.
-- Allowed operations only: CREATE TABLE IF NOT EXISTS, ALTER TABLE ADD COLUMN IF NOT EXISTS,
-- CREATE INDEX IF NOT EXISTS, COMMENT ON.

create table if not exists public.handoff_notifications (
  id text primary key,
  store_id text not null,
  type text not null default 'handoff_created',
  title text not null,
  summary text not null,
  handoff_type text not null,
  priority text not null,
  conversation_id text not null,
  handoff_ticket_id text not null,
  status text not null default 'unread',
  created_at timestamptz not null default now()
);

alter table if exists public.haidi_settings
  add column if not exists global_ai_paused boolean not null default false,
  add column if not exists human_handoff_enabled boolean not null default true,
  add column if not exists handoff_customer_service_enabled boolean not null default true,
  add column if not exists handoff_manager_request_enabled boolean not null default true,
  add column if not exists pause_ai_after_handoff boolean not null default true,
  add column if not exists send_handoff_acknowledgement boolean not null default true,
  add column if not exists notify_human_team boolean not null default true,
  add column if not exists default_handoff_assignee text,
  add column if not exists customer_service_reply_template_ar text not null default 'تمام يا فندم، هسجل طلبك وهيتواصل معاكي حد من الفريق حالًا.',
  add column if not exists manager_request_reply_template_ar text not null default 'تمام يا فندم، هسجل طلبك كطلب تواصل مع الإدارة وهيتواصل معاكي حد من الفريق حالًا.',
  add column if not exists handoff_final_ack_template_ar text not null default 'تم تسجيل الطلب، وسيتواصل معاكي حد من الفريق.';

alter table if exists public.handoff_tickets
  add column if not exists handoff_type text default 'customer_service',
  add column if not exists problem_summary text,
  add column if not exists last_customer_message text,
  add column if not exists ai_paused boolean not null default false,
  add column if not exists returned_to_ai_at timestamptz,
  add column if not exists contacted_at timestamptz,
  add column if not exists resolved_at timestamptz,
  add column if not exists priority text default 'normal',
  add column if not exists assigned_to text,
  add column if not exists notes text;

alter table if exists public.messages
  add column if not exists body text,
  add column if not exists text text,
  add column if not exists final_reply text,
  add column if not exists direction text,
  add column if not exists channel text,
  add column if not exists provider_message_id text,
  add column if not exists n8n_execution_id text,
  add column if not exists evolution_message_id text,
  add column if not exists status text;

create unique index if not exists idx_handoff_notifications_ticket_id
  on public.handoff_notifications (handoff_ticket_id);

create index if not exists idx_handoff_notifications_store_status_created
  on public.handoff_notifications (store_id, status, created_at desc);

create index if not exists idx_handoff_tickets_store_status_created
  on public.handoff_tickets (store_id, status, created_at desc);

create index if not exists idx_messages_store_direction_created
  on public.messages (store_id, direction, created_at desc);

comment on table public.handoff_notifications is 'Internal dashboard notifications for handoff tickets.';
comment on column public.handoff_tickets.handoff_type is 'Explicit handoff type: customer_service or manager_request.';
comment on column public.handoff_tickets.problem_summary is 'Short summary used in handoff dashboard and notifications.';
comment on column public.messages.body is 'Readable message text/caption used by dashboard history fallback.';
