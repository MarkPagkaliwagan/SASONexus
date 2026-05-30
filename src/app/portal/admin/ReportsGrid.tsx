"use client";

import { useEffect, useState } from "react";
import { FiBarChart2, FiPieChart, FiTrendingUp, FiTarget } from "react-icons/fi";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, ComposedChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar, Legend,
} from "recharts";
import { getDashboardChartData } from "@/lib/actions";

const COLORS = ["#007848", "#00a35e", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#f97316", "#ec4899"];

interface ChartRow {
  name: string;
  value: number;
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-pulse">
          <div className="h-1 bg-gray-200 dark:bg-gray-700" />
          <div className="p-5 space-y-4">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-44 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PremiumTooltip({ active, payload, label, color }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-lg font-bold" style={{ color: entry.stroke || entry.fill || color || "#007848" }}>{entry.value}</p>
      ))}
    </div>
  );
}

function ChartCard({ title, subtitle, accent, children }: {
  title: string; subtitle?: string; accent: string; children: React.ReactNode;
}) {
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      <div className={`h-1 ${accent}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        {subtitle && <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-4">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

// ─── 1. ComposedChart — bar + trend line ────────
function ComposedChartCard({ data }: { data: ChartRow[] }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <ChartCard title="Applications by Year" subtitle={`${total} total applications`} accent="bg-gradient-to-r from-emerald-500 to-emerald-400">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="composedBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007848" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#00a35e" stopOpacity={0.25} />
              </linearGradient>
              <linearGradient id="composedLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<PremiumTooltip color="#007848" />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="url(#composedBar)" maxBarSize={40} animationDuration={800} />
            <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: "#f59e0b", stroke: "#fff", strokeWidth: 2, r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// ─── 2. Horizontal Bar ──────────────────────────
function HorizontalBarChartCard({ data }: { data: ChartRow[] }) {
  return (
    <ChartCard title="Applications by Level" subtitle="Distribution across student levels" accent="bg-gradient-to-r from-violet-500 to-violet-400">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="hBarGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<PremiumTooltip color="#8b5cf6" />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="url(#hBarGrad)" maxBarSize={24} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// ─── 3. Donut ───────────────────────────────────
function DonutChartCard({ data, title, subtitle }: {
  data: ChartRow[]; title: string; subtitle?: string;
}) {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <ChartCard title={title} subtitle={subtitle} accent="bg-gradient-to-r from-amber-500 to-amber-400">
      <div className="h-56 flex items-center justify-center">
        {data.length === 0 ? (
          <p className="text-sm text-gray-400">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {data.map((_, i) => (
                  <linearGradient key={i} id={`donutGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.4} />
                  </linearGradient>
                ))}
              </defs>
              <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" animationDuration={800}>
                {data.map((_, i) => (
                  <Cell key={i} fill={`url(#donutGrad${i})`} stroke={COLORS[i % COLORS.length]} strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const item = payload[0];
                const pct = ((item.value as number) / total * 100).toFixed(1);
                return (
                  <div className="bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-xl px-4 py-3 shadow-2xl">
                    <p className="text-xs font-medium text-gray-400 mb-1">{item.name}</p>
                    <p className="text-lg font-bold" style={{ color: item.payload.fill || COLORS[0] }}>{item.value}</p>
                    <p className="text-[11px] text-gray-400">{pct}% of total</p>
                  </div>
                );
              }} />
              <text x="50%" y="47%" textAnchor="middle" className="text-2xl font-bold fill-gray-900 dark:fill-white tabular-nums">{total}</text>
              <text x="50%" y="59%" textAnchor="middle" className="text-[11px] fill-gray-400">total</text>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1 text-[11px] bg-gray-50 dark:bg-gray-800/50 rounded-lg px-2.5 py-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-gray-500 dark:text-gray-400">{d.name}</span>
            <span className="font-semibold text-gray-900 dark:text-white ml-1">{d.value}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

// ─── 4. Radar ───────────────────────────────────
function RadarChartCard({ data }: { data: ChartRow[] }) {
  return (
    <ChartCard title="Students by Level" subtitle="Enrolled distribution" accent="bg-gradient-to-r from-cyan-500 to-cyan-400">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <radialGradient id="radarFill" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#007848" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#007848" stopOpacity={0.05} />
              </radialGradient>
            </defs>
            <PolarGrid stroke="#374151" strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <PolarRadiusAxis angle={30} domain={[0, "auto"]} tick={{ fontSize: 9, fill: "#6b7280" }} axisLine={false} />
            <Radar name="Students" dataKey="value" stroke="#007848" strokeWidth={2.5} fill="url(#radarFill)" dot={{ fill: "#007848", stroke: "#fff", strokeWidth: 2, r: 3 }} animationDuration={800} />
            <Tooltip content={<PremiumTooltip color="#007848" />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// ─── 5. Area ────────────────────────────────────
function AreaChartCard({ data }: { data: ChartRow[] }) {
  return (
    <ChartCard title="Personnel by Unit" subtitle="Staff headcount per SASO unit" accent="bg-gradient-to-r from-orange-500 to-orange-400">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="areaGradPersonnel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<PremiumTooltip color="#f59e0b" />} />
            <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fill="url(#areaGradPersonnel)" dot={{ fill: "#f59e0b", stroke: "#fff", strokeWidth: 2.5, r: 4 }} animationDuration={800} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// ─── 6. RadialBar ───────────────────────────────
function RadialBarChartCard({ data }: { data: ChartRow[] }) {
  const chartData = data.map((d, i) => ({
    ...d,
    fill: COLORS[i % COLORS.length],
  }));
  return (
    <ChartCard title="Support Needs (SNA)" subtitle="Types of support requested" accent="bg-gradient-to-r from-rose-500 to-rose-400">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="15%" outerRadius="90%" barSize={18} data={chartData} startAngle={180} endAngle={-180}>
            <defs>
              {chartData.map((d, i) => (
                <linearGradient key={i} id={`radialGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={d.fill} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={d.fill} stopOpacity={0.3} />
                </linearGradient>
              ))}
            </defs>
            <RadialBar dataKey="value" cornerRadius={8} animationDuration={800} animationEasing="ease-out">
              {chartData.map((d, i) => (
                <Cell key={i} fill={`url(#radialGrad${i})`} />
              ))}
            </RadialBar>
            <Legend
              iconType="circle"
              verticalAlign="bottom"
              height={28}
              formatter={(value: string) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>}
            />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const item = payload[0];
              return (
                <div className="bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-xl px-4 py-3 shadow-2xl">
                  <p className="text-xs font-medium text-gray-400 mb-1">{item.payload.name}</p>
                  <p className="text-lg font-bold" style={{ color: item.payload.fill }}>{item.value}</p>
                </div>
              );
            }} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// ─── Main ───────────────────────────────────────
export function ReportsGrid() {
  const [data, setData] = useState<{
    admissionsByYear: ChartRow[]; admissionsByLevel: ChartRow[];
    personnelByUnit: ChartRow[]; claimsByStatus: ChartRow[];
    studentsByLevel: ChartRow[]; snaSupport: ChartRow[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardChartData().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (!data) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#007848] to-[#00a35e] flex items-center justify-center shadow-md shadow-[#007848]/20">
          <FiBarChart2 className="text-sm text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">Real-time insights across all SASO modules</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ComposedChartCard data={data.admissionsByYear} />
        <HorizontalBarChartCard data={data.admissionsByLevel} />
        <DonutChartCard title="Document Claims" subtitle="Pending vs claimed" data={data.claimsByStatus} />
        <RadarChartCard data={data.studentsByLevel} />
        <AreaChartCard data={data.personnelByUnit} />
        <RadialBarChartCard data={data.snaSupport} />
      </div>
    </div>
  );
}
