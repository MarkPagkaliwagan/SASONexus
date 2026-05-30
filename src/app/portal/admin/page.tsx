export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/db";
import {
  staffAccounts, sasoUnits, personnel, documentClaims,
  preAdmissions, cumulativeRecords, studentNeedsAssessment,
  announcements, handbooksPillars, collegeCourses, shsStrands,
  academicYears, admissionSchedules, interviewAppointments,
} from "@/db/schema";
import { count, eq } from "drizzle-orm";
import {
  FiUsers, FiUserPlus, FiChevronRight, FiTrendingUp,
  FiDollarSign, FiEdit3, FiClipboard, FiCalendar,
  FiShield, FiGrid, FiUserCheck,
} from "react-icons/fi";
import { DeptChart } from "./DeptChart";
import { ReportsGrid } from "./ReportsGrid";

const unitColors = ["#007848", "#00a35e", "#f59e0b", "#8b5cf6", "#ef4444"];

export default async function AdminDashboard() {
  const [
    [sc], [dc], [asc], [pr], [pc], [pa], [cr], [sn],
    [an], [hp], [co], [st], [yr], [sch], [int],
    dBreakdown, rStaff,
  ] = await Promise.all([
    db.select({ count: count() }).from(staffAccounts).where(eq(staffAccounts.role, "staff")),
    db.select({ count: count() }).from(sasoUnits),
    db.select({ count: count() }).from(staffAccounts).where(eq(staffAccounts.isActive, true)),
    db.select({ count: count() }).from(personnel).where(eq(personnel.isActive, true)),
    db.select({ count: count() }).from(documentClaims).where(eq(documentClaims.status, "pending")),
    db.select({ count: count() }).from(preAdmissions),
    db.select({ count: count() }).from(cumulativeRecords),
    db.select({ count: count() }).from(studentNeedsAssessment),
    db.select({ count: count() }).from(announcements),
    db.select({ count: count() }).from(handbooksPillars),
    db.select({ count: count() }).from(collegeCourses),
    db.select({ count: count() }).from(shsStrands),
    db.select({ count: count() }).from(academicYears),
    db.select({ count: count() }).from(admissionSchedules),
    db.select({ count: count() }).from(interviewAppointments),
    db.select({ deptName: sasoUnits.name, deptSlug: sasoUnits.slug, total: count() })
      .from(sasoUnits).leftJoin(staffAccounts, eq(staffAccounts.unitId, sasoUnits.id)).groupBy(sasoUnits.id, sasoUnits.name, sasoUnits.slug).orderBy(sasoUnits.name),
    db.query.staffAccounts.findMany({
      where: eq(staffAccounts.role, "staff"),
      with: { unit: true, position: true },
      orderBy: (s, { desc }) => [desc(s.createdAt)],
      limit: 6,
    }),
  ]);

  const stats = {
    staff: sc?.count ?? 0,
    activeStaff: asc?.count ?? 0,
    personnel: pr?.count ?? 0,
    pendingClaims: pc?.count ?? 0,
    preAdmissions: pa?.count ?? 0,
    snaCount: sn?.count ?? 0,
    interviews: int?.count ?? 0,
    crCount: cr?.count ?? 0,
    hpCount: hp?.count ?? 0,
    depts: dc?.count ?? 0,
  };

  const deptChartData = dBreakdown.map((d, i) => ({
    name: d.deptName, label: d.deptSlug, value: d.total,
    color: unitColors[i % unitColors.length],
  }));

  const inactiveStaff = stats.staff - stats.activeStaff;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 -m-6 p-6">
      {/* ── Header ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-1">
            <span>Dashboard</span>
            <FiChevronRight className="text-[10px]" />
            <span className="text-gray-600 dark:text-gray-300 font-medium">Overview</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time overview of all SASO modules and key metrics.
          </p>
        </div>
        <Link
          href="/portal/admin/staff"
          className="inline-flex items-center gap-2 bg-[#007848] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#005f38] transition shadow-lg shadow-[#007848]/20"
        >
          <FiUserPlus className="text-sm" />
          New Staff Account
        </Link>
      </div>

      {/* ── Premium Metric Cards ────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard
          icon={<FiShield />}
          label="Personnel"
          value={stats.personnel}
          trend={12}
          href="/portal/admin/personnel"
          color="emerald"
        />
        <MetricCard
          icon={<FiUsers />}
          label="Staff Accounts"
          value={stats.staff}
          sub={`${stats.activeStaff} active, ${inactiveStaff} inactive`}
          href="/portal/admin/staff"
          color="blue"
        />
        <MetricCard
          icon={<FiDollarSign />}
          label="Pending Claims"
          value={stats.pendingClaims}
          trend={-3}
          href="/portal/admin/handbooks-pillars"
          color="amber"
        />
        <MetricCard
          icon={<FiEdit3 />}
          label="SNA Records"
          value={stats.snaCount}
          trend={8}
          href="/portal/admin/student-needs-assessment"
          color="violet"
        />
        <MetricCard
          icon={<FiClipboard />}
          label="Pre-Admissions"
          value={stats.preAdmissions}
          trend={18}
          href="/portal/admin/admission"
          color="cyan"
        />
        <MetricCard
          icon={<FiCalendar />}
          label="Interviews"
          value={stats.interviews}
          trend={5}
          href="/portal/admin/interview"
          color="rose"
        />
      </div>

      {/* ── Charts Row ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <FiTrendingUp className="text-sm text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Staff Distribution by Unit</h2>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">{stats.depts} operational units</p>
                </div>
              </div>
            </div>
            <DeptChart data={deptChartData} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-400" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <FiGrid className="text-sm text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Summary</h2>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">Key module totals</p>
              </div>
            </div>
            <div className="space-y-2.5">
              <SummaryRow label="Active Personnel" value={stats.personnel} />
              <SummaryRow label="Cumulative Records" value={stats.crCount} />
              <SummaryRow label="Handbooks & Pillars" value={stats.hpCount} />
              <SummaryRow label="Staff Active Rate" value={`${Math.round((stats.activeStaff / Math.max(stats.staff, 1)) * 100)}%`} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Staff ────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-400" />
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20">
              <FiUserCheck className="text-sm text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Staff Members</h2>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">Latest account creations</p>
            </div>
          </div>
          <Link
            href="/portal/admin/staff"
            className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
          {rStaff.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUsers className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">No staff accounts yet</p>
            </div>
          ) : (
            rStaff.map((staff: any) => (
              <div key={staff.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#007848] to-[#00a35e] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-sm font-bold text-white">{staff.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{staff.name}</p>
                  <p className="text-[12px] text-gray-400 dark:text-gray-500 truncate">
                    {staff.unit?.name ?? "Unassigned"}
                    {staff.position ? ` \u00b7 ${staff.position.name}` : ""}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                  <span className={`w-2 h-2 rounded-full ${staff.isActive ? "bg-emerald-500 shadow-sm shadow-emerald-500/30" : "bg-red-400"}`} />
                  {staff.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Reports & Analytics ─────────────────── */}
      <ReportsGrid />
    </div>
  );
}

/* ───────────────────────────────────────────────
   Metric Card — premium SaaS-style stat card
   ─────────────────────────────────────────────── */
function MetricCard({
  icon, label, value, trend, sub, href, color,
}: {
  icon: React.ReactNode; label: string; value: number; trend?: number; sub?: string; href?: string; color: string;
}) {
  const themes: Record<string, { bar: string; iconBg: string; iconColor: string }> = {
    emerald: { bar: "bg-emerald-500", iconBg: "bg-emerald-100 dark:bg-emerald-900/40", iconColor: "text-emerald-600 dark:text-emerald-400" },
    blue: { bar: "bg-blue-500", iconBg: "bg-blue-100 dark:bg-blue-900/40", iconColor: "text-blue-600 dark:text-blue-400" },
    amber: { bar: "bg-amber-500", iconBg: "bg-amber-100 dark:bg-amber-900/40", iconColor: "text-amber-600 dark:text-amber-400" },
    violet: { bar: "bg-violet-500", iconBg: "bg-violet-100 dark:bg-violet-900/40", iconColor: "text-violet-600 dark:text-violet-400" },
    cyan: { bar: "bg-cyan-500", iconBg: "bg-cyan-100 dark:bg-cyan-900/40", iconColor: "text-cyan-600 dark:text-cyan-400" },
    rose: { bar: "bg-rose-500", iconBg: "bg-rose-100 dark:bg-rose-900/40", iconColor: "text-rose-600 dark:text-rose-400" },
  };
  const t = themes[color] || themes.emerald;

  const card = (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer">
      <div className={`absolute top-0 left-0 w-full h-1 ${t.bar}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl ${t.iconBg} flex items-center justify-center ${t.iconColor} ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-base">{icon}</span>
          </div>
          {trend !== undefined && (
            <span className={`inline-flex items-center gap-0.5 text-[12px] font-semibold px-2 py-0.5 rounded-lg ${
              trend >= 0
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"
            }`}>
              <FiTrendingUp className={`text-[10px] ${trend < 0 ? "rotate-180" : ""}`} />
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums tracking-tight">{value}</p>
        {sub && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">{sub}</p>}
      </div>
    </div>
  );
  if (href) return <Link href={href} className="block">{card}</Link>;
  return card;
}

/* ───────────────────────────────────────────────
   Summary Row — mini progress bar
   ─────────────────────────────────────────────── */
function SummaryRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-sm py-1.5">
      <span className="text-gray-500 dark:text-gray-400 text-[13px]">{label}</span>
      <span className="font-semibold text-gray-900 dark:text-white text-[13px] tabular-nums">{value}</span>
    </div>
  );
}
