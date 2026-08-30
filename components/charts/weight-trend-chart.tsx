"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeightPoint } from "@/lib/queries";

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function WeightTrendChart({ points }: { points: WeightPoint[] }) {
  if (points.length === 0) {
    return (
      <p className="text-sm text-ink-muted py-8 text-center">
        No weight logged yet.
      </p>
    );
  }

  const data = points.map((p) => ({ date: p.recordedOn, weight: p.weight }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fill: "var(--ink-muted)", fontSize: 11 }}
          axisLine={{ stroke: "var(--border)" }}
          tickLine={false}
        />
        <YAxis
          domain={["auto", "auto"]}
          tick={{ fill: "var(--ink-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          formatter={(value) => [`${value}`, "Weight"]}
          labelFormatter={(label) => formatDate(String(label))}
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--ink-secondary)" }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="var(--accent)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--accent)", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
