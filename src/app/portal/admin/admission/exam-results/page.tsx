import { db } from "@/db";
import { students, preAdmissions, academicYears } from "@/db/schema";
import { ExamResultsList } from "@/components/admin/admission/ExamResultsList";

export default async function ExamResultsPage() {
  const [items, preAdmissionList, academicYearList] = await Promise.all([
    db.query.students.findMany({
      orderBy: (s, { desc }) => [desc(s.enrolledAt)],
    }),
    db.query.preAdmissions.findMany(),
    db.query.academicYears.findMany({
      orderBy: (y, { desc }) => [desc(y.year)],
    }),
  ]);

  const preAdmissionMap = Object.fromEntries(
    preAdmissionList.map((p) => [p.id, p])
  );
  const academicYearOptions = academicYearList.map((y) => y.year);

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Admission</span>
        <span>/</span>
        <span>Student Exam Results</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Exam Results</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage exam results for all admitted students.</p>
      </div>

      <ExamResultsList students={items} preAdmissionMap={preAdmissionMap} academicYearOptions={academicYearOptions} />
    </>
  );
}
