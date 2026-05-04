create table if not exists public.haidi_lab_scenarios (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  title text not null,
  input_text text not null,
  expected_intent text null,
  expected_tone text null,
  must_include text[] not null default '{}',
  must_not_include text[] not null default '{}',
  created_by text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.haidi_lab_runs (
  id uuid primary key default gen_random_uuid(),
  store_id text not null,
  scenario_id uuid not null references public.haidi_lab_scenarios(id) on delete cascade,
  actual_intent text not null,
  actual_reply text not null,
  score int not null,
  mismatches text[] not null default '{}',
  run_by text null,
  created_at timestamptz not null default now()
);

create index if not exists idx_haidi_lab_scenarios_store on public.haidi_lab_scenarios(store_id, created_at desc);
create index if not exists idx_haidi_lab_runs_store on public.haidi_lab_runs(store_id, scenario_id, created_at desc);

alter table public.haidi_lab_scenarios enable row level security;
alter table public.haidi_lab_runs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'haidi_lab_scenarios' and policyname = 'haidi_lab_scenarios_service_role_all'
  ) then
    create policy haidi_lab_scenarios_service_role_all on public.haidi_lab_scenarios for all to service_role using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'haidi_lab_runs' and policyname = 'haidi_lab_runs_service_role_all'
  ) then
    create policy haidi_lab_runs_service_role_all on public.haidi_lab_runs for all to service_role using (true) with check (true);
  end if;
end $$;
