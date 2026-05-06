-- Forward-only migration: haidi_prompt_state table for editable Haidi prompt drafts/published state
-- Date: 2026-05-05
-- Rules: keep repo prompt as fallback, dashboard publishes only after tests, no destructive changes

create table if not exists public.haidi_prompt_state (
  store_id text primary key default 'youlya',
  source text not null default 'repo' check (source in ('repo', 'db')),
  draft_prompt text null,
  draft_version text null,
  draft_updated_at timestamptz null,
  draft_updated_by text null,
  published_prompt text null,
  published_version text null,
  published_updated_at timestamptz null,
  published_updated_by text null,
  previous_published_prompt text null,
  previous_published_version text null,
  previous_published_updated_at timestamptz null,
  previous_published_updated_by text null,
  last_test_run_id text null,
  last_test_score integer null,
  last_tested_at timestamptz null,
  updated_at timestamptz not null default now()
);

insert into public.haidi_prompt_state (store_id)
values ('youlya')
on conflict (store_id) do nothing;

alter table public.haidi_prompt_state disable row level security;

comment on table public.haidi_prompt_state is 'Editable Haidi prompt draft/publish state. Repo file remains the fallback default.';
