-- gym-track initial schema: muscle groups, equipment, exercises, logs.
-- Single-user app: RLS policies grant full access to any authenticated
-- session (no per-row ownership columns needed).

create table public.muscle_groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  definition  text not null,
  created_at  timestamptz not null default now()
);

create table public.muscle_group_references (
  id               uuid primary key default gen_random_uuid(),
  muscle_group_id  uuid not null references public.muscle_groups(id) on delete cascade,
  title            text not null,
  url              text not null,
  kind             text not null default 'link' check (kind in ('link', 'video', 'image')),
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  unique (muscle_group_id, url)
);
create index on public.muscle_group_references (muscle_group_id);

create table public.equipment (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  is_available  boolean not null default true,
  created_at    timestamptz not null default now()
);

create table public.exercises (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  description   text,
  equipment_id  uuid references public.equipment(id) on delete set null,
  is_favorite   boolean not null default false,
  is_available  boolean not null default true,
  created_at    timestamptz not null default now()
);
create index on public.exercises (equipment_id);

create table public.exercise_muscle_groups (
  exercise_id      uuid not null references public.exercises(id) on delete cascade,
  muscle_group_id  uuid not null references public.muscle_groups(id) on delete cascade,
  role             text not null default 'primary' check (role in ('primary', 'secondary')),
  primary key (exercise_id, muscle_group_id)
);
create index on public.exercise_muscle_groups (muscle_group_id);

-- Logs are historical record; exercise_id uses `restrict` so a logged
-- exercise can't be hard-deleted (retire it via is_available instead).
create table public.workout_logs (
  id            uuid primary key default gen_random_uuid(),
  exercise_id   uuid not null references public.exercises(id) on delete restrict,
  performed_on  date not null default current_date,
  created_at    timestamptz not null default now()
);
create index on public.workout_logs (performed_on);
create index on public.workout_logs (exercise_id, performed_on);

-- Derived availability: excluded if the exercise itself, or its equipment,
-- is marked unavailable. security_invoker so the view respects the
-- querying user's RLS rather than the view owner's.
create view public.exercise_availability
with (security_invoker = true) as
select
  e.*,
  (e.is_available and coalesce(eq.is_available, true)) as is_effectively_available
from public.exercises e
left join public.equipment eq on eq.id = e.equipment_id;

-- 14-day muscle-group training score: primary role counts full, secondary
-- half, so incidental involvement doesn't fully offset a real gap.
create or replace function public.get_muscle_group_gap_scores()
returns table (muscle_group_id uuid, name text, training_score numeric)
language sql
stable
as $$
  with window_logs as (
    select wl.id as log_id, emg.muscle_group_id, emg.role
    from public.workout_logs wl
    join public.exercise_muscle_groups emg on emg.exercise_id = wl.exercise_id
    where wl.performed_on >= (current_date - interval '13 days')
  ),
  scores as (
    select muscle_group_id,
           sum(case when role = 'primary' then 1.0 else 0.5 end) as training_score
    from window_logs
    group by muscle_group_id
  )
  select mg.id, mg.name, coalesce(s.training_score, 0) as training_score
  from public.muscle_groups mg
  left join scores s on s.muscle_group_id = mg.id
  order by training_score asc;
$$;

grant execute on function public.get_muscle_group_gap_scores() to authenticated;

alter table public.muscle_groups enable row level security;
alter table public.muscle_group_references enable row level security;
alter table public.equipment enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_muscle_groups enable row level security;
alter table public.workout_logs enable row level security;

create policy "authenticated_full_access" on public.muscle_groups
  for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on public.muscle_group_references
  for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on public.equipment
  for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on public.exercises
  for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on public.exercise_muscle_groups
  for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on public.workout_logs
  for all to authenticated using (true) with check (true);

-- RLS alone is not enough: with Data API auto-expose off, newly created
-- tables get no default table-level GRANTs to anon/authenticated, and
-- Postgres checks table privileges before RLS. Grant explicitly so the
-- policies above actually take effect.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.muscle_groups to authenticated;
grant select, insert, update, delete on public.muscle_group_references to authenticated;
grant select, insert, update, delete on public.equipment to authenticated;
grant select, insert, update, delete on public.exercises to authenticated;
grant select, insert, update, delete on public.exercise_muscle_groups to authenticated;
grant select, insert, update, delete on public.workout_logs to authenticated;
grant select on public.exercise_availability to authenticated;
