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
        <BarChart data={data} margin={{ top: 20, right: 5, left: -20, bottom: 0 }}>
          <defs>
            {data.map((entry, idx) => (
              <linearGradient key={idx} id={`deptGrad${idx}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={entry.color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={entry.color} stopOpacity={0.25} />
              </linearGradient>
            ))}
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null;
              const item = data.find((d) => d.label === label);
              return (
                <div className="bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-xl px-4 py-3 shadow-2xl">
                  <p className="text-xs font-semibold text-gray-100 mb-1">{item?.name ?? label}</p>
                  <p className="text-lg font-bold" style={{ color: item?.color }}>{payload[0].value}</p>
                  <p className="text-[11px] text-gray-400">staff members</p>
                </div>
              );
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56} animationDuration={800} animationEasing="ease-out">
            {data.map((entry, idx) => (
              <Cell key={idx} fill={`url(#deptGrad${idx})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
