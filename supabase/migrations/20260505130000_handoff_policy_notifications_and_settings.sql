-- Forward-only migration for explicit two-case human handoff policy and dashboard notifications.
-- Rules: create-if-not-exists, add-if-not-exists, no drops/truncates/deletes.

alter table if exists public.haidi_settings
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
  add column if not exists handoff_type text,
  add column if not exists problem_summary text,
  add column if not exists ai_paused boolean not null default false,
  add column if not exists returned_to_ai_at timestamptz,
  add column if not exists returned_to_ai_by text;

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

create unique index if not exists idx_handoff_notifications_ticket_id
  on public.handoff_notifications (handoff_ticket_id);

create index if not exists idx_handoff_notifications_store_status_created
  on public.handoff_notifications (store_id, status, created_at desc);

alter table public.handoff_notifications disable row level security;

comment on table public.handoff_notifications is 'Internal dashboard notifications for handoff tickets.';
