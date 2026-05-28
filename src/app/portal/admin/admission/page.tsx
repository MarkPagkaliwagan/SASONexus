import { db } from "@/db";
import { students, preAdmissions, admissionSchedules, academicYears, admissionContent } from "@/db/schema";
import { ne, desc } from "drizzle-orm";
import { AdmissionManager } from "./AdmissionManager";

export default async function AdmissionPage() {
  const [
    contentRows,
    preAdmissionItems,
    scheduleList,
    studentList,
    preAdmissionList,
    academicYearList,
  ] = await Promise.all([
    db.select().from(admissionContent),
    db.query.preAdmissions.findMany({
      where: (p) => ne(p.status, "approved"),
      orderBy: (p) => desc(p.submittedAt),
    }),
    db.query.admissionSchedules.findMany({
      orderBy: (s) => desc(s.createdAt),
    }),
    db.query.students.findMany({
      orderBy: (s) => desc(s.enrolledAt),
    }),
    db.query.preAdmissions.findMany(),
    db.query.academicYears.findMany({
      orderBy: (y) => desc(y.year),
    }),
  ]);

  const contentMap: Record<string, string> = {};
  for (const row of contentRows) contentMap[row.section] = row.content;

  const scheduleMap = Object.fromEntries(
    scheduleList.map((s) => [String(s.id), s])
  );
  const preAdmissionMap = Object.fromEntries(
    preAdmissionList.map((p) => [p.id, p])
  );
  const academicYearOptions = academicYearList.map((y) => y.year);

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Admission</span>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admission Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage admission content, applications, schedules, and exam results.</p>
      </div>
      <AdmissionManager
        contentMap={contentMap}
        preAdmissionItems={preAdmissionItems}
        scheduleMap={scheduleMap}
        schedules={scheduleList}
        students={studentList}
        preAdmissionMap={preAdmissionMap}
        academicYearOptions={academicYearOptions}
      />
    </>
  );
}
