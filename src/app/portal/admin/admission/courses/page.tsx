import { db } from "@/db";
import { collegeCourses } from "@/db/schema";
import { CourseForm } from "@/components/admin/admission/CourseForm";
import { CourseList } from "@/components/admin/admission/CourseList";
import { FiChevronRight } from "react-icons/fi";

export default async function CoursesPage() {
  const courses = await db.query.collegeCourses.findMany({
    orderBy: (c, { desc }) => [desc(c.createdAt)],
  });

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Admission</span>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-600 dark:text-gray-300">College Courses</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">College Courses</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage college program offerings for pre-admission.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CourseForm />
        </div>
        <div className="lg:col-span-2">
          <CourseList courses={courses} />
        </div>
      </div>
    </>
  );
}
