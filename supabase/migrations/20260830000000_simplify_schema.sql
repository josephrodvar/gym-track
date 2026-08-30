-- Simplify gym-track to two tables: muscle-group session logs (fixed group
-- list, intensity only) and body-weight readings. Drops the earlier
-- exercise/equipment/favorites catalog and gap-analysis machinery, which
-- never held real user data.

drop function if exists public.get_muscle_group_gap_scores();
drop view if exists public.exercise_availability;
drop table if exists public.workout_logs;
drop table if exists public.exercise_muscle_groups;
drop table if exists public.exercises;
drop table if exists public.equipment;
drop table if exists public.muscle_group_references;
drop table if exists public.muscle_groups;

create type public.muscle_group as enum ('back', 'shoulders', 'chest', 'legs', 'cardio');
create type public.intensity as enum ('light', 'heavy');

create table public.workout_logs (
  id            uuid primary key default gen_random_uuid(),
  muscle_group  public.muscle_group not null,
  intensity     public.intensity not null,
  performed_on  date not null default current_date,
  created_at    timestamptz not null default now()
);
create index on public.workout_logs (muscle_group, performed_on);

create table public.weight_logs (
  id            uuid primary key default gen_random_uuid(),
  weight        numeric(5,1) not null,
  recorded_on   date not null default current_date,
  created_at    timestamptz not null default now()
);
create index on public.weight_logs (recorded_on);

alter table public.workout_logs enable row level security;
alter table public.weight_logs enable row level security;

create policy "authenticated_full_access" on public.workout_logs
  for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on public.weight_logs
  for all to authenticated using (true) with check (true);

-- RLS alone is not enough: with Data API auto-expose off, newly created
-- tables get no default table-level GRANTs to anon/authenticated, and
-- Postgres checks table privileges before RLS. Grant explicitly so the
-- policies above actually take effect.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.workout_logs to authenticated;
grant select, insert, update, delete on public.weight_logs to authenticated;
