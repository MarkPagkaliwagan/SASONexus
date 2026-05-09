import { db } from "@/db";
import { staffAccounts, sasoUnits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { StaffForm } from "@/components/admin/StaffForm";
import { StaffList } from "@/components/admin/StaffList";
import { FiChevronRight } from "react-icons/fi";

export default async function StaffManagementPage() {
  const units = await db.query.sasoUnits.findMany({
    with: {
      positions: true,
    },
  });

  const allStaff = await db.query.staffAccounts.findMany({
    where: eq(staffAccounts.role, "staff"),
    with: {
      unit: true,
      position: true,
    },
    orderBy: (staff, { desc }) => [desc(staff.createdAt)],
  });

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Staff</span>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-600 dark:text-gray-300">All Accounts</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage staff accounts across all SASO units.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <StaffForm units={units} />
        </div>
        <div className="lg:col-span-2">
          <StaffList staff={allStaff} />
        </div>
      </div>
    </>
  );
}
