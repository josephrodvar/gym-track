"use client";

import { useState, useTransition } from "react";
import { logWorkout } from "@/lib/actions/log-workout";
import type { Intensity, MuscleGroup } from "@/lib/types/domain";

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function LogMuscleGroupDialog({
  muscleGroup,
  label,
  onClose,
}: {
  muscleGroup: MuscleGroup;
  label: string;
  onClose: () => void;
}) {
  const [intensity, setIntensity] = useState<Intensity>("heavy");
  const [date, setDate] = useState(yesterdayISO());
  const [isPending, startTransition] = useTransition();

  function submit(performedOn: string) {
    startTransition(async () => {
      await logWorkout(muscleGroup, intensity, performedOn);
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl border border-border bg-surface p-5 space-y-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-medium">{label}</h2>

        <div className="space-y-2">
          <p className="text-xs text-ink-muted">Intensity</p>
          <div className="flex gap-2">
            {(["light", "heavy"] as Intensity[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setIntensity(option)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize ${
                  intensity === option
                    ? "border-accent bg-accent text-accent-ink font-medium"
                    : "border-border text-ink-secondary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={() => submit(todayISO())}
          className="w-full rounded-lg bg-accent text-accent-ink font-medium py-3 disabled:opacity-60"
        >
          Did it today!
        </button>

        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-xs text-ink-muted">Or log a different day</p>
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              type="button"
              disabled={isPending}
              onClick={() => submit(date)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              Log
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-center text-sm text-ink-muted py-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
