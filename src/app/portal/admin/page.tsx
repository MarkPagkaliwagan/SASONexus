export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/db";
import {
  staffAccounts, sasoUnits, personnel, documentClaims,
  preAdmissions, cumulativeRecords, studentNeedsAssessment,
} from "@/db/schema";
import { count, eq } from "drizzle-orm";
import {
  FiUsers, FiGrid, FiUserCheck, FiFolder, FiEdit3, FiFileText,
  FiUserPlus, FiChevronRight, FiActivity, FiShield, FiDollarSign, FiClock,
} from "react-icons/fi";
import { DeptChart } from "./DeptChart";
import { QuickNav } from "./QuickNav";

const unitColors = ["#007848", "#00a35e", "#f59e0b", "#8b5cf6", "#ef4444"];

export default async function AdminDashboard() {
  const [
    [staffCountResult], [deptCountResult], [activeStaffResult],
    [personnelResult], [pendingClaimsResult], [preAdmissionsResult],
    [crCountResult], [snaCountResult],
    deptBreakdown, recentStaff,
  ] = await Promise.all([
    db.select({ count: count() }).from(staffAccounts).where(eq(staffAccounts.role, "staff")),
    db.select({ count: count() }).from(sasoUnits),
    db.select({ count: count() }).from(staffAccounts).where(eq(staffAccounts.isActive, true)),
    db.select({ count: count() }).from(personnel).where(eq(personnel.isActive, true)),
    db.select({ count: count() }).from(documentClaims).where(eq(documentClaims.status, "pending")),
    db.select({ count: count() }).from(preAdmissions),
    db.select({ count: count() }).from(cumulativeRecords),
    db.select({ count: count() }).from(studentNeedsAssessment),
    db.select({
      deptName: sasoUnits.name,
      deptSlug: sasoUnits.slug,
      total: count(),
    }).from(sasoUnits)
      .leftJoin(staffAccounts, eq(staffAccounts.unitId, sasoUnits.id))
      .groupBy(sasoUnits.id, sasoUnits.name, sasoUnits.slug)
      .orderBy(sasoUnits.name),
    db.query.staffAccounts.findMany({
      where: eq(staffAccounts.role, "staff"),
      with: { unit: true, position: true },
      orderBy: (s, { desc }) => [desc(s.createdAt)],
      limit: 5,
    }),
  ]);

  const stats = {
    staff: staffCountResult?.count ?? 0,
    depts: deptCountResult?.count ?? 0,
    activeStaff: activeStaffResult?.count ?? 0,
    personnel: personnelResult?.count ?? 0,
    pendingClaims: pendingClaimsResult?.count ?? 0,
    preAdmissions: preAdmissionsResult?.count ?? 0,
    crCount: crCountResult?.count ?? 0,
    snaCount: snaCountResult?.count ?? 0,
  };

  const deptChartData = deptBreakdown.map((d, i) => ({
    name: d.deptName,
    label: d.deptSlug,
    value: d.total,
    color: unitColors[i % unitColors.length],
  }));

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
        <span>Dashboard</span>
        <FiChevronRight className="text-[10px]" />
        <span className="text-gray-600 dark:text-gray-300 font-medium">Overview</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time overview of SASO operations and key metrics.
          </p>
        </div>
        <Link
          href="/portal/admin/staff"
          className="inline-flex items-center gap-2 bg-[#007848] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#005f38] transition shadow-sm shadow-[#007848]/20"
        >
          <FiUserPlus className="text-sm" />
          New Staff Account
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard icon={<FiUsers />} label="Total Staff" value={stats.staff} subtext={`${stats.activeStaff} active`} color="emerald" />
        <KpiCard icon={<FiShield />} label="Personnel" value={stats.personnel} subtext="Active members" color="blue" />
        <KpiCard icon={<FiGrid />} label="SASO Units" value={stats.depts} subtext="Departments" color="violet" />
        <KpiCard icon={<FiDollarSign />} label="Pending Claims" value={stats.pendingClaims} subtext="Document claims" color="amber" />
        <KpiCard icon={<FiFileText />} label="Pre-Admissions" value={stats.preAdmissions} subtext="Total applications" color="rose" />
        <KpiCard icon={<FiFolder />} label="Records" value={stats.crCount + stats.snaCount} subtext="CRF + SNA" color="cyan" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#007848]/10 dark:bg-[#007848]/20 flex items-center justify-center">
                <FiGrid className="text-xs text-[#007848] dark:text-[#00a35e]" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Staff Distribution by Unit</h2>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">{stats.depts} units</span>
          </div>
          <DeptChart data={deptChartData} />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <FiClock className="text-xs text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Staff</h2>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {recentStaff.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FiUsers className="text-gray-400 dark:text-gray-500 text-sm" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No staff accounts yet</p>
              </div>
            ) : (
              recentStaff.map((staff) => (
                <div key={staff.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#007848] to-[#00a35e] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {staff.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{staff.name}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                      {staff.unit?.name ?? "Unassigned"}
                      {staff.position ? ` · ${staff.position.name}` : ""}
                    </p>
                  </div>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${staff.isActive ? "bg-green-500 shadow-sm shadow-green-500/30" : "bg-red-400"}`} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Department Bar Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#007848]/10 dark:bg-[#007848]/20 flex items-center justify-center">
              <FiActivity className="text-xs text-[#007848] dark:text-[#00a35e]" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Department Staff Count</h2>
          </div>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">{stats.staff} total staff</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {deptBreakdown.map((dept) => {
            const maxStaff = Math.max(...deptBreakdown.map((d) => d.total), 1);
            const pct = Math.round((dept.total / maxStaff) * 100);
            return (
              <div key={dept.deptSlug} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{dept.deptName}</p>
                  <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{dept.total}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-[#007848] to-[#00a35e] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation */}
      <QuickNav />

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MiniStat icon={<FiFileText />} label="Pre-Admissions" value={stats.preAdmissions} />
        <MiniStat icon={<FiEdit3 />} label="SNA Records" value={stats.snaCount} />
        <MiniStat icon={<FiFolder />} label="Cumulative Records" value={stats.crCount} />
        <MiniStat icon={<FiShield />} label="Active Personnel" value={stats.personnel} />
      </div>
    </div>
  );
}

function KpiCard({
  icon, label, value, subtext, color,
}: {
  icon: React.ReactNode; label: string; value: number; subtext?: string; color: "emerald" | "blue" | "violet" | "amber" | "rose" | "cyan";
}) {
  const colors: Record<string, { bg: string; icon: string; glow: string }> = {
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", glow: "shadow-emerald-500/10" },
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600 dark:text-blue-400", glow: "shadow-blue-500/10" },
    violet: { bg: "bg-violet-50 dark:bg-violet-900/20", icon: "text-violet-600 dark:text-violet-400", glow: "shadow-violet-500/10" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", glow: "shadow-amber-500/10" },
    rose: { bg: "bg-rose-50 dark:bg-rose-900/20", icon: "text-rose-600 dark:text-rose-400", glow: "shadow-rose-500/10" },
    cyan: { bg: "bg-cyan-50 dark:bg-cyan-900/20", icon: "text-cyan-600 dark:text-cyan-400", glow: "shadow-cyan-500/10" },
  };
  const c = colors[color];
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md ${c.glow} transition-all duration-200`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center ${c.icon}`}>
          <span className="text-sm">{icon}</span>
        </div>
      </div>
      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">{value}</p>
      {subtext && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{subtext}</p>}
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{value}</p>
      </div>
    </div>
  );
}
