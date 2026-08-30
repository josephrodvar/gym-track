import type { MuscleGroupStatus } from "@/lib/queries";

function lastTrainedLabel(status: MuscleGroupStatus) {
  if (status.daysSinceLast === null) return "Never logged";
  if (status.daysSinceLast === 0) return "Today";
  if (status.daysSinceLast === 1) return "Yesterday";
  return `${status.daysSinceLast} days ago`;
}

export default function MuscleGroupFreshness({
  statuses,
}: {
  statuses: MuscleGroupStatus[];
}) {
  return (
    <ul className="space-y-2">
      {statuses.map((status) => (
        <li
          key={status.id}
          className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                status.isFresh ? "bg-status-good" : "bg-status-critical"
              }`}
              aria-hidden
            />
            <span className="text-sm font-medium">{status.label}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={
                status.isFresh
                  ? "text-status-good"
                  : "text-status-critical font-medium"
              }
            >
              {status.isFresh ? "On track" : "Running low"}
            </span>
            <span className="text-ink-muted">· {lastTrainedLabel(status)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
