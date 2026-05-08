import { db } from "@/db";
import { academicYears } from "@/db/schema";
import { StudentsTable } from "@/components/admin/admission/StudentsTable";
import { FiChevronRight } from "react-icons/fi";

export default async function StudentsPage() {
  const [items, academicYearList] = await Promise.all([
    db.query.students.findMany({
      orderBy: (s, { desc }) => [desc(s.enrolledAt)],
    }),
    db.query.academicYears.findMany({
      orderBy: (y, { desc }) => [desc(y.year)],
    }),
  ]);
  const academicYearOptions = academicYearList.map((y) => y.year);

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Admission</span>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-600 dark:text-gray-300">Admitted Students</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admitted Students</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Students who have completed the pre-admission process.</p>
      </div>

      <StudentsTable items={items} academicYearOptions={academicYearOptions} />
    </>
  );
}
