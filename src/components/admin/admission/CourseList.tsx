"use client";

import { useState } from "react";
import { toggleCourse, deleteCourse } from "@/lib/actions";
import { FiTrash2 } from "react-icons/fi";
import { ConfirmModal } from "./ConfirmModal";

interface Course {
  id: number;
  name: string;
  code: string | null;
  isActive: boolean;
}

export function CourseList({ courses }: { courses: Course[] }) {
  const [toggling, setToggling] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleToggle(id: number) {
    setToggling(id);
    await toggleCourse(id);
    setToggling(null);
  }

  async function handleDelete() {
    if (deleteConfirm === null) return;
    setDeleting(true);
    await deleteCourse(deleteConfirm);
    setDeleting(false);
    setDeleteConfirm(null);
  }

  if (courses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No courses yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Courses ({courses.length})</h2>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {courses.map((course) => (
          <div key={course.id} className="px-6 py-4 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{course.name}</span>
              {course.code && <span className="ml-2 text-xs text-gray-400">({course.code})</span>}
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${course.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
              {course.isActive ? "Active" : "Inactive"}
            </span>
            <button onClick={() => handleToggle(course.id)} disabled={toggling === course.id} className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50">
              {toggling === course.id ? "..." : course.isActive ? "Deactivate" : "Activate"}
            </button>
            <button onClick={() => setDeleteConfirm(course.id)} disabled={deleting} className="text-red-400 hover:text-red-600 transition disabled:opacity-50">
              <FiTrash2 className="text-sm" />
            </button>
          </div>
        ))}
      </div>
      <ConfirmModal
        open={deleteConfirm !== null}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteConfirm(null); setDeleting(false); }}
      />
    </div>
  );
}
