import { db } from "@/db";
import { preAdmissions, admissionSchedules, academicYears } from "@/db/schema";
import { PreAdmissionList } from "@/components/admin/admission/PreAdmissionList";
import { FiChevronRight } from "react-icons/fi";
import { ne } from "drizzle-orm";

export default async function PreAdmissionsPage() {
  const [items, schedules, academicYearList] = await Promise.all([
    db.query.preAdmissions.findMany({
      where: (p, { ne }) => ne(p.status, "approved"),
      orderBy: (p, { desc }) => [desc(p.submittedAt)],
    }),
    db.select().from(admissionSchedules),
    db.query.academicYears.findMany({
      orderBy: (y, { desc }) => [desc(y.year)],
    }),
  ]);
  const academicYearOptions = academicYearList.map((y) => y.year);

  const scheduleMap = Object.fromEntries(
    schedules.map((s) => [String(s.id), s])
  );

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Admission</span>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-600 dark:text-gray-300">Pre-Admissions</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pre-Admissions</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage pre-admission applications submitted by students.</p>
      </div>

      <PreAdmissionList items={items} scheduleMap={scheduleMap} academicYearOptions={academicYearOptions} />
    </>
  );
}
