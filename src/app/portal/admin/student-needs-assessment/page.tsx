import { db } from "@/db";
import { studentNeedsAssessment } from "@/db/schema";
import { desc } from "drizzle-orm";
import { StudentNeedsAssessmentList } from "./StudentNeedsAssessmentList";

export default async function StudentNeedsAssessmentPage() {
  const records = await db
    .select()
    .from(studentNeedsAssessment)
    .orderBy(desc(studentNeedsAssessment.updatedAt));

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Student Needs Assessment</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Needs Assessment</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage student needs assessment form submissions.</p>
      </div>

      <StudentNeedsAssessmentList records={records} />
    </>
  );
}
