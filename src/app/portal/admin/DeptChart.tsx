"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface DeptData {
  label: string;
  value: number;
  color: string;
  name: string;
}

export function DeptChart({ data }: { data: DeptData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400 dark:text-gray-500">
        No staff data available
      </div>
    );
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={{ stroke: "#374151" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "12px",
              fontSize: "12px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
            labelStyle={{ color: "#e5e7eb", fontWeight: 600, marginBottom: 4 }}
            itemStyle={{ color: "#d1d5db" }}
            formatter={(value: number) => [value, "Staff"]}
            labelFormatter={(label) => {
              const item = data.find((d) => d.label === label);
              return item?.name ?? label;
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
