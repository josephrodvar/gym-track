# gym-track

Personal gym-tracking Progressive Web App. Browse muscle groups, log workouts, and get a
rolling 14-day gap analysis with exercise recommendations.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Postgres, Auth, RLS)
- Deployed on Vercel

## Getting Started

```bash
npm install
npm run dev
```

Requires a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Database

Schema lives in `supabase/migrations/`. Apply with the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase db push
```

Seed starter data (muscle groups, equipment, exercises) once after migrating:

```bash
psql "$DATABASE_URL" -f supabase/seed.sql
```

The single user account is created via the Supabase Dashboard (Authentication → Users) — there is no sign-up flow.
