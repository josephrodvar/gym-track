"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MuscleGroupSessionCounts } from "@/lib/queries";

export default function SessionsBarChart({
  counts,
}: {
  counts: MuscleGroupSessionCounts[];
}) {
  const data = counts.map((c) => ({
    label: c.label,
    Light: c.light,
    Heavy: c.heavy,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          axisLine
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--ink-secondary)" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--ink-secondary)" }} />
        <Bar
          dataKey="Heavy"
          stackId="sessions"
          className="fill-accent"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="Light"
          stackId="sessions"
          className="fill-ink-muted"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
