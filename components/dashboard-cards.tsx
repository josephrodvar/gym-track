"use client";

import { useState } from "react";
import LogMuscleGroupDialog from "@/components/log-muscle-group-dialog";
import UpdateWeightDialog from "@/components/update-weight-dialog";
import type { MuscleGroupStatus } from "@/lib/queries";

function lastTrainedLabel(status: MuscleGroupStatus) {
  if (status.daysSinceLast === null) return "Never logged";
  if (status.daysSinceLast === 0) return "Today";
  if (status.daysSinceLast === 1) return "Yesterday";
  return `${status.daysSinceLast} days ago`;
}

export default function DashboardCards({
  statuses,
}: {
  statuses: MuscleGroupStatus[];
}) {
  const [active, setActive] = useState<MuscleGroupStatus | null>(null);
  const [weightOpen, setWeightOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {statuses.map((status) => (
          <button
            key={status.id}
            type="button"
            onClick={() => setActive(status)}
            className="rounded-xl border border-border bg-surface p-4 text-left space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{status.label}</span>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  status.isFresh ? "bg-status-good" : "bg-status-critical"
                }`}
                aria-label={status.isFresh ? "Fresh" : "Running low"}
              />
            </div>
            <p className="text-xs text-ink-muted">{lastTrainedLabel(status)}</p>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setWeightOpen(true)}
        className="w-full rounded-xl border border-border bg-surface py-3 text-sm font-medium text-ink-secondary"
      >
        Update weight
      </button>

      {active && (
        <LogMuscleGroupDialog
          muscleGroup={active.id}
          label={active.label}
          onClose={() => setActive(null)}
        />
      )}
      {weightOpen && <UpdateWeightDialog onClose={() => setWeightOpen(false)} />}
    </div>
  );
}
