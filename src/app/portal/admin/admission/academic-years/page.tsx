import { db } from "@/db";
import { academicYears, semesters } from "@/db/schema";
import { AcademicYearForm } from "@/components/admin/admission/AcademicYearForm";
import { AcademicYearList } from "@/components/admin/admission/AcademicYearList";
import { eq } from "drizzle-orm";
import { FiChevronRight } from "react-icons/fi";

export default async function AcademicYearsPage() {
  const years = await db.query.academicYears.findMany({
    with: { semesters: true },
    orderBy: (y, { desc }) => [desc(y.createdAt)],
  });

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Admission</span>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-600 dark:text-gray-300">Academic Years</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Years</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage academic years and their semesters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AcademicYearForm />
        </div>
        <div className="lg:col-span-2">
          <AcademicYearList years={years} />
        </div>
      </div>
    </>
  );
}
