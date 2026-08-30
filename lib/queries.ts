import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import type { Intensity, MuscleGroup } from "@/lib/types/domain";

export const MUSCLE_GROUPS: { id: MuscleGroup; label: string }[] = [
  { id: "back", label: "Back" },
  { id: "shoulders", label: "Shoulders" },
  { id: "chest", label: "Chest" },
  { id: "legs", label: "Legs" },
  { id: "biceps", label: "Biceps" },
  { id: "triceps", label: "Triceps" },
  { id: "cardio", label: "Cardio" },
];

export const FRESHNESS_WINDOW_DAYS = 14;

function daysAgoISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export interface MuscleGroupStatus {
  id: MuscleGroup;
  label: string;
  lastPerformedOn: string | null;
  daysSinceLast: number | null;
  isFresh: boolean;
}

export async function getMuscleGroupStatus(
  supabase: SupabaseClient<Database>
): Promise<MuscleGroupStatus[]> {
  const { data, error } = await supabase
    .from("workout_logs")
    .select("muscle_group, performed_on")
    .order("performed_on", { ascending: false });

  if (error) throw error;

  const lastByGroup = new Map<MuscleGroup, string>();
  for (const row of data ?? []) {
    if (!lastByGroup.has(row.muscle_group)) {
      lastByGroup.set(row.muscle_group, row.performed_on);
    }
  }

  const today = new Date();
  return MUSCLE_GROUPS.map(({ id, label }) => {
    const lastPerformedOn = lastByGroup.get(id) ?? null;
    let daysSinceLast: number | null = null;
    if (lastPerformedOn) {
      const last = new Date(lastPerformedOn + "T00:00:00");
      daysSinceLast = Math.floor(
        (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
    return {
      id,
      label,
      lastPerformedOn,
      daysSinceLast,
      isFresh: daysSinceLast !== null && daysSinceLast <= FRESHNESS_WINDOW_DAYS,
    };
  });
}

export interface WeightPoint {
  recordedOn: string;
  weight: number;
}

export async function getWeightHistory(
  supabase: SupabaseClient<Database>
): Promise<WeightPoint[]> {
  const { data, error } = await supabase
    .from("weight_logs")
    .select("recorded_on, weight")
    .order("recorded_on", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    recordedOn: row.recorded_on,
    weight: row.weight,
  }));
}

export interface MuscleGroupSessionCounts {
  id: MuscleGroup;
  label: string;
  light: number;
  heavy: number;
}

export async function getSessionsPerMuscleGroup(
  supabase: SupabaseClient<Database>,
  days = FRESHNESS_WINDOW_DAYS
): Promise<MuscleGroupSessionCounts[]> {
  const { data, error } = await supabase
    .from("workout_logs")
    .select("muscle_group, intensity")
    .gte("performed_on", daysAgoISO(days));

  if (error) throw error;

  const counts = new Map<MuscleGroup, { light: number; heavy: number }>();
  for (const row of data ?? []) {
    const entry = counts.get(row.muscle_group) ?? { light: 0, heavy: 0 };
    entry[row.intensity as Intensity]++;
    counts.set(row.muscle_group, entry);
  }

  return MUSCLE_GROUPS.map(({ id, label }) => {
    const entry = counts.get(id) ?? { light: 0, heavy: 0 };
    return { id, label, light: entry.light, heavy: entry.heavy };
  });
}
