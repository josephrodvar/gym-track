import { createClient } from "@/lib/supabase/server";
import {
  getMuscleGroupStatus,
  getSessionsPerMuscleGroup,
  getWeightHistory,
} from "@/lib/queries";
import WeightTrendChart from "@/components/charts/weight-trend-chart";
import MuscleGroupFreshness from "@/components/charts/muscle-group-freshness";
import SessionsBarChart from "@/components/charts/sessions-bar-chart";

export default async function InsightsPage() {
  const supabase = await createClient();
  const [statuses, weightHistory, sessionCounts] = await Promise.all([
    getMuscleGroupStatus(supabase),
    getWeightHistory(supabase),
    getSessionsPerMuscleGroup(supabase),
  ]);

  return (
    <main className="p-4 space-y-8 max-w-lg mx-auto">
      <header>
        <h1 className="text-lg font-semibold">Insights</h1>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-ink-secondary">Weight trend</h2>
        <div className="rounded-xl border border-border bg-surface p-3">
          <WeightTrendChart points={weightHistory} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-ink-secondary">
          Muscle group freshness
        </h2>
        <MuscleGroupFreshness statuses={statuses} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-ink-secondary">
          Sessions in the last 14 days
        </h2>
        <div className="rounded-xl border border-border bg-surface p-3">
          <SessionsBarChart counts={sessionCounts} />
        </div>
      </section>
    </main>
  );
}
