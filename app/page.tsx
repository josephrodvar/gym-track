import { createClient } from "@/lib/supabase/server";
import { getMuscleGroupStatus } from "@/lib/queries";
import DashboardCards from "@/components/dashboard-cards";

export default async function DashboardPage() {
  const supabase = await createClient();
  const statuses = await getMuscleGroupStatus(supabase);

  return (
    <main className="p-4 space-y-6 max-w-lg mx-auto">
      <header>
        <h1 className="text-lg font-semibold">Gym Track</h1>
        <p className="text-sm text-ink-muted">Tap a muscle group to log a session.</p>
      </header>

      <DashboardCards statuses={statuses} />
    </main>
  );
}
