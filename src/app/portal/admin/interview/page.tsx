import { db } from "@/db";
import { interviewSchedules } from "@/db/schema";
import { desc } from "drizzle-orm";
import { FiChevronRight, FiCalendar } from "react-icons/fi";
import { InterviewForm } from "./InterviewForm";
import { InterviewList } from "./InterviewList";

export default async function InterviewPage() {
  const schedules = await db
    .select()
    .from(interviewSchedules)
    .orderBy(desc(interviewSchedules.createdAt));

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Interview</span>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-600 dark:text-gray-300">Schedules</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Schedules</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage interview schedules with available slots for Initial and Exit interviews.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <InterviewForm />
        </div>
        <div className="lg:col-span-2">
          <InterviewList schedules={schedules} />
        </div>
      </div>
    </>
  );
}
