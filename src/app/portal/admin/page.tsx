import Link from "next/link";
import { db } from "@/db";
import { staffAccounts, departments } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import {
  FiUsers,
  FiGrid,
  FiUserCheck,
  FiUserPlus,
  FiActivity,
  FiChevronRight,
} from "react-icons/fi";

export default async function AdminDashboard() {
  const [[staffCountResult], [deptCountResult], [activeStaffResult]] = await Promise.all([
    db.select({ count: count() }).from(staffAccounts).where(eq(staffAccounts.role, "staff")),
    db.select({ count: count() }).from(departments),
    db.select({ count: count() }).from(staffAccounts).where(eq(staffAccounts.isActive, true)),
  ]);

  const staffCount = staffCountResult?.count ?? 0;
  const deptCount = deptCountResult?.count ?? 0;
  const activeStaff = activeStaffResult?.count ?? 0;

  const deptBreakdown = await db
    .select({
      deptName: departments.name,
      deptSlug: departments.slug,
      total: count(),
    })
    .from(departments)
    .leftJoin(staffAccounts, eq(staffAccounts.departmentId, departments.id))
    .groupBy(departments.id, departments.name, departments.slug)
    .orderBy(departments.name);

  const recentStaff = await db.query.staffAccounts.findMany({
    where: eq(staffAccounts.role, "staff"),
    with: { department: true, position: true },
    orderBy: (staff, { desc }) => [desc(staff.createdAt)],
    limit: 5,
  });

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Dashboard</span>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-600 dark:text-gray-300">Overview</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here&apos;s what&apos;s happening across SASO today.</p>
        </div>
        <Link
          href="/portal/admin/staff"
          className="inline-flex items-center gap-2 bg-[#007848] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#005f38] transition shadow-sm"
        >
          <FiUserPlus />
          Create Staff Account
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon={<FiUsers className="text-lg" />}
          label="Total Staff"
          value={staffCount}
          color="emerald"
        />
        <StatCard
          icon={<FiGrid className="text-lg" />}
          label="Departments"
          value={deptCount}
          color="blue"
        />
        <StatCard
          icon={<FiUserCheck className="text-lg" />}
          label="Active Staff"
          value={activeStaff}
          color="amber"
          subtext={staffCount > 0 ? `${Math.round((activeStaff / staffCount) * 100)}% active rate` : undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiGrid className="text-[#007848] dark:text-[#00a35e] text-sm" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Department Breakdown</h2>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">{deptCount} departments</span>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {deptBreakdown.map((dept) => {
              const maxStaff = Math.max(...deptBreakdown.map((d) => d.total), 1);
              const barWidth = (dept.total / maxStaff) * 100;
              return (
                <div key={dept.deptSlug} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{dept.deptName}</p>
                    <div className="mt-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#007848] to-[#00a35e] h-2 rounded-full transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tabular-nums">{dept.total}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <FiActivity className="text-[#007848] dark:text-[#00a35e] text-sm" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Staff</h2>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {recentStaff.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiUsers className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No staff accounts yet</p>
                <Link
                  href="/portal/admin/staff"
                  className="text-sm text-[#007848] dark:text-[#00a35e] font-medium mt-2 inline-block hover:underline"
                >
                  Create your first staff
                </Link>
              </div>
            ) : (
              recentStaff.map((staff) => (
                <div key={staff.id} className="px-6 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#007848]/10 dark:bg-[#007848]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-[#007848] dark:text-[#00a35e]">
                      {staff.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{staff.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {staff.department?.name ?? "Unassigned"}
                      {staff.position ? ` · ${staff.position.name}` : ""}
                    </p>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      staff.isActive ? "bg-green-500" : "bg-red-400"
                    }`}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          href="/portal/admin/staff"
          className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:border-[#007848]/20 dark:hover:border-[#00a35e]/20 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#007848]/10 dark:bg-[#007848]/20 rounded-xl flex items-center justify-center group-hover:bg-[#007848] dark:group-hover:bg-[#00a35e] transition-colors">
              <FiUsers className="text-lg text-[#007848] dark:text-[#00a35e] group-hover:text-white dark:group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#007848] dark:group-hover:text-[#00a35e] transition-colors">
                Manage Staff Accounts
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Create, activate, or deactivate staff members
              </p>
            </div>
            <FiChevronRight className="text-gray-300 dark:text-gray-600 group-hover:text-[#007848] dark:group-hover:text-[#00a35e] ml-auto transition-colors" />
          </div>
        </Link>

        <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors">
              <FiActivity className="text-lg text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">System Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                View reports and system-wide statistics
              </p>
            </div>
            <FiChevronRight className="text-gray-300 dark:text-gray-600 ml-auto" />
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "emerald" | "blue" | "amber";
  subtext?: string;
}) {
  const colorMap = {
    emerald: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">{value}</p>
      {subtext && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}
