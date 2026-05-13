import { db } from "@/db";
import { sasoUnits } from "@/db/schema";
import { PersonnelManager } from "@/components/admin/PersonnelManager";
import { FiChevronRight } from "react-icons/fi";

export default async function PersonnelManagementPage() {
  const units = await db.query.sasoUnits.findMany({
    with: {
      positions: true,
    },
  });

  const allPersonnel = await db.query.personnel.findMany({
    with: {
      unit: true,
    },
    orderBy: (personnel, { desc }) => [desc(personnel.createdAt)],
  });

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Admin</span>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-600 dark:text-gray-300">Personnel</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Personnel</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage personnel displayed on the About Us page.
          </p>
        </div>
      </div>

      <PersonnelManager units={units} personnel={allPersonnel} />
    </>
  );
}
