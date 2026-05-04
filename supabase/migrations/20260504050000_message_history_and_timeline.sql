-- Forward-only migration: message history and conversation timeline
-- Date: 2026-05-04
-- Rules: create-if-not-exists, add columns safely, no drops/truncates

create extension if not exists pgcrypto;

-- 1) Conversations: add missing columns for dashboard timeline
alter table if exists public.conversations
  add column if not exists ai_paused boolean not null default false,
  add column if not exists assigned_to text,
  add column if not exists last_message_at timestamptz,
  add column if not exists external_conversation_id text;

-- Ensure index on last_message_at for dashboard sorting
create index if not exists idx_conversations_last_message_at
  on public.conversations (last_message_at desc);

create index if not exists idx_conversations_status
  on public.conversations (status);

create index if not exists idx_conversations_store_status
  on public.conversations (store_id, status);

-- 2) Messages: add missing columns for full message history
alter table if exists public.messages
  add column if not exists direction text not null default 'inbound'
    check (direction in ('inbound','outbound','system')),
  add column if not exists transcript text,
  add column if not exists image_caption text,
  add column if not exists ai_agent_draft text,
  add column if not exists final_reply text,
  add column if not exists status text not null default 'delivered'
    check (status in ('pending','delivered','failed','blocked')),
  add column if not exists n8n_execution_id text,
  add column if not exists evolution_message_id text,
  add column if not exists error_code text,
  add column if not exists text text,
  add column if not exists updated_at timestamptz not null default now();

-- Migrate existing body -> text for consistency
update public.messages
set text = body
where text is null and body is not null;

-- Expand message_type check
alter table if exists public.messages
  drop constraint if exists messages_message_type_check;

-- Only add the constraint if it doesn't already exist with the wider set
do $$
begin
  alter table public.messages
    add constraint messages_message_type_check
    check (message_type in ('text','audio','image','system','voice'));
exception when duplicate_table then
  null;
end $$;

create index if not exists idx_messages_conversation_id
  on public.messages (conversation_id);

create index if not exists idx_messages_provider_message_id
  on public.messages (provider_message_id);

create index if not exists idx_messages_created_at
  on public.messages (created_at desc);

create index if not exists idx_messages_store_conversation
  on public.messages (store_id, conversation_id, created_at desc);

-- 3) Conversation events: AI actions, tool calls, handoffs, errors
create table if not exists public.conversation_events (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  conversation_id text not null,
  event_type text not null
    check (event_type in ('tool_call','handoff','error','ai_reply','human_reply','system','status_change','cart_update')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_conversation_events_conversation_id
  on public.conversation_events (conversation_id, created_at desc);

create index if not exists idx_conversation_events_store_conversation
  on public.conversation_events (store_id, conversation_id, created_at desc);

create index if not exists idx_conversation_events_event_type
  on public.conversation_events (event_type);

alter table public.conversation_events disable row level security;
