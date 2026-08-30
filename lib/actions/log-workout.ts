"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Intensity, MuscleGroup } from "@/lib/types/domain";

export async function logWorkout(
  muscleGroup: MuscleGroup,
  intensity: Intensity,
  performedOn: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("workout_logs")
    .insert({ muscle_group: muscleGroup, intensity, performed_on: performedOn });

  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/insights");
}
