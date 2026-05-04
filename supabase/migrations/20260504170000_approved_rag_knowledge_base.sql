create table if not exists public.knowledge_base (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  title text not null,
  content text not null,
  source_type text not null default 'manual',
  source_ref text null,
  tags text[] not null default '{}',
  status text not null default 'published',
  published_at timestamptz null,
  created_by text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_versions (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  knowledge_id uuid not null references public.knowledge_base(id) on delete cascade,
  version_no int not null,
  content text not null,
  change_note text null,
  created_by text null,
  created_at timestamptz not null default now(),
  unique (knowledge_id, version_no)
);

create table if not exists public.knowledge_suggestions (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  title text not null,
  suggestion_text text not null,
  source_type text not null default 'learning',
  source_ref text null,
  status text not null default 'pending',
  reviewer_note text null,
  approved_by text null,
  approved_at timestamptz null,
  rejected_by text null,
  rejected_at timestamptz null,
  published_knowledge_id uuid null references public.knowledge_base(id) on delete set null,
  published_at timestamptz null,
  created_by text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_knowledge_base_store_status on public.knowledge_base(store_id, status);
create index if not exists idx_knowledge_versions_store on public.knowledge_versions(store_id, knowledge_id, version_no desc);
create index if not exists idx_knowledge_suggestions_store_status on public.knowledge_suggestions(store_id, status, created_at desc);

alter table public.knowledge_base enable row level security;
alter table public.knowledge_versions enable row level security;
alter table public.knowledge_suggestions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'knowledge_base' and policyname = 'knowledge_base_service_role_all'
  ) then
    create policy knowledge_base_service_role_all on public.knowledge_base for all to service_role using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'knowledge_versions' and policyname = 'knowledge_versions_service_role_all'
  ) then
    create policy knowledge_versions_service_role_all on public.knowledge_versions for all to service_role using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'knowledge_suggestions' and policyname = 'knowledge_suggestions_service_role_all'
  ) then
    create policy knowledge_suggestions_service_role_all on public.knowledge_suggestions for all to service_role using (true) with check (true);
  end if;
end $$;
