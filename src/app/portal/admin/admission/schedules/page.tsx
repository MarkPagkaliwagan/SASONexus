import { db } from "@/db";
import { admissionSchedules } from "@/db/schema";
import { ScheduleForm } from "@/components/admin/admission/ScheduleForm";
import { ScheduleList } from "@/components/admin/admission/ScheduleList";
import { FiChevronRight } from "react-icons/fi";

export default async function SchedulesPage() {
  const schedules = await db.query.admissionSchedules.findMany({
    orderBy: (s, { desc }) => [desc(s.createdAt)],
  });

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Admission</span>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-600 dark:text-gray-300">Schedules</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admission Schedules</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage schedule slots for pre-admission applicants.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ScheduleForm />
        </div>
        <div className="lg:col-span-2">
          <ScheduleList schedules={schedules} />
        </div>
      </div>
    </>
  );
}
