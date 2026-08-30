"use client";

import { useState, useTransition } from "react";
import { logWeight } from "@/lib/actions/log-weight";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function UpdateWeightDialog({ onClose }: { onClose: () => void }) {
  const [weight, setWeight] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    const value = Number(weight);
    if (!weight || Number.isNaN(value) || value <= 0) return;
    startTransition(async () => {
      await logWeight(value, todayISO());
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
        <h2 className="text-base font-medium">Update weight</h2>

        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          autoFocus
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-3 text-lg"
        />

        <button
          type="button"
          disabled={isPending}
          onClick={submit}
          className="w-full rounded-lg bg-accent text-accent-ink font-medium py-3 disabled:opacity-60"
        >
          Save
        </button>

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
