-- Forward-only migration: haidi_settings table for AI behavior configuration
-- Date: 2026-05-04
-- Rules: create-if-not-exists, safe defaults, no drops/truncates

create table if not exists public.haidi_settings (
  store_id text primary key default 'youlya',
  default_language text not null default 'ar-EG' check (default_language in ('ar-EG','en','auto')),
  tone text not null default 'warm' check (tone in ('warm','premium','playful','concise','supportive')),
  emoji_level text not null default 'normal' check (emoji_level in ('none','light','normal')),
  reply_length text not null default 'balanced' check (reply_length in ('short','balanced','detailed')),
  upsell_mode text not null default 'soft' check (upsell_mode in ('off','soft','normal')),
  max_upsells_per_conversation integer not null default 1 check (max_upsells_per_conversation in (0,1,2)),
  recommend_alternatives_when_oos boolean not null default true,
  recommend_complementary_products boolean not null default true,
  use_urgency_only_from_real_stock boolean not null default true,
  use_social_proof_only_from_real_data boolean not null default true,
  max_products_shown_per_reply integer not null default 3 check (max_products_shown_per_reply between 1 and 10),
  max_search_results_internal integer not null default 10 check (max_search_results_internal between 1 and 50),
  handoff_on_human_request boolean not null default true,
  handoff_after_unclear_count integer not null default 3 check (handoff_after_unclear_count in (2,3)),
  handoff_on_angry_tone boolean not null default true,
  global_ai_paused boolean not null default false,
  orders_paused boolean not null default false,
  prompt_version text not null default 'v1',
  updated_at timestamptz not null default now(),
  updated_by text
);

insert into public.haidi_settings (store_id)
values ('youlya')
on conflict (store_id) do nothing;

alter table public.haidi_settings disable row level security;

comment on table public.haidi_settings is 'Haidi AI behavior settings per store. Mutable only via dashboard or admin API.';
