"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function logWeight(weight: number, recordedOn: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("weight_logs")
    .insert({ weight, recorded_on: recordedOn });

  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/insights");
}
