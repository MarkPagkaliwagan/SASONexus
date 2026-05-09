"use client";

import { useState } from "react";
import { toggleCourse, deleteCourse, updateCollegeDepartment, deleteCollegeDepartment } from "@/lib/actions";
import { FiTrash2, FiEdit2, FiX } from "react-icons/fi";
import { ConfirmModal } from "./ConfirmModal";
import { EditCourseModal } from "./EditCourseModal";

interface Course {
  id: number;
  name: string;
  code: string | null;
  department: string;
  isActive: boolean;
}

export function CourseList({ courses, departments, deptLogos }: { courses: Course[]; departments: string[]; deptLogos: Record<string, string | null> }) {
  const [toggling, setToggling] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingDept, setEditingDept] = useState<string | null>(null);
  const [deptEditName, setDeptEditName] = useState("");
  const [deptEditFile, setDeptEditFile] = useState<File | null>(null);
  const [deptEditPreview, setDeptEditPreview] = useState("");
  const [deptEditLoading, setDeptEditLoading] = useState(false);
  const [deleteDeptConfirm, setDeleteDeptConfirm] = useState<string | null>(null);
  const [deleteDeptLoading, setDeleteDeptLoading] = useState(false);

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

  async function handleEditDeptStart(dept: string) {
    setEditingDept(dept);
    setDeptEditName(dept);
    setDeptEditFile(null);
    setDeptEditPreview("");
  }

  async function handleEditDeptSave() {
    if (!editingDept) return;
    setDeptEditLoading(true);
    try {
      let b64 = "";
      if (deptEditFile) {
        b64 = await fileToBase64(deptEditFile);
      }
      await updateCollegeDepartment(editingDept, deptEditName, b64 || null);
      setEditingDept(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setDeptEditLoading(false);
    }
  }

  async function handleDeleteDept() {
    if (!deleteDeptConfirm) return;
    setDeleteDeptLoading(true);
    try {
      await deleteCollegeDepartment(deleteDeptConfirm);
      setDeleteDeptConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setDeleteDeptLoading(false);
    }
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function getDeptLogo(dept: string): string | null {
    return deptLogos[dept] || null;
  }

  if (courses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No courses yet.</p>
      </div>
    );
  }

  const grouped = courses.reduce<Record<string, Course[]>>((acc, course) => {
    if (!acc[course.department]) acc[course.department] = [];
    acc[course.department].push(course);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([department, deptCourses]) => {
        const logo = getDeptLogo(department);
        return (
          <div key={department} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
              {logo ? (
                <img src={logo} alt={department} className="w-8 h-8 rounded-lg object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#007848]/10 flex items-center justify-center text-xs font-bold text-[#007848] uppercase shrink-0">
                  {department.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{department}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{deptCourses.length} course{deptCourses.length > 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => handleEditDeptStart(department)} className="text-blue-400 hover:text-blue-600 transition p-1" title="Edit department">
                <FiEdit2 className="text-sm" />
              </button>
              <button onClick={() => setDeleteDeptConfirm(department)} className="text-red-400 hover:text-red-600 transition p-1" title="Delete department">
                <FiTrash2 className="text-sm" />
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {deptCourses.map((course) => (
                <div key={course.id} className="px-6 py-3.5 flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{course.name}</span>
                      {course.code && <span className="text-xs text-gray-400">({course.code})</span>}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${course.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {course.isActive ? "Active" : "Inactive"}
                  </span>
                  <button onClick={() => handleToggle(course.id)} disabled={toggling === course.id} className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50">
                    {toggling === course.id ? "..." : course.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => setEditingCourse(course)} className="text-blue-400 hover:text-blue-600 transition">
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button onClick={() => setDeleteConfirm(course.id)} disabled={deleting} className="text-red-400 hover:text-red-600 transition disabled:opacity-50">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Dept Edit Modal */}
      {editingDept !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Department</h2>
              <button onClick={() => setEditingDept(null)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department Name</label>
                <input
                  type="text"
                  value={deptEditName}
                  onChange={(e) => setDeptEditName(e.target.value)}
                  disabled={deptEditLoading}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo (leave empty to keep current)</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={deptEditLoading}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setDeptEditFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setDeptEditPreview(reader.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setDeptEditPreview("");
                    }
                  }}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#007848]/10 file:text-[#007848] file:text-sm file:font-medium hover:file:bg-[#007848]/20 transition disabled:opacity-50"
                />
                {(deptEditPreview || getDeptLogo(editingDept)) && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={deptEditPreview || getDeptLogo(editingDept)!} alt="Logo" className="w-8 h-8 rounded-lg object-contain border border-gray-200" />
                    <span className="text-xs text-gray-400">{deptEditPreview ? "New logo" : "Current logo"}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setEditingDept(null)} disabled={deptEditLoading} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={handleEditDeptSave} disabled={deptEditLoading} className="flex-1 py-2.5 bg-[#007848] text-white font-semibold rounded-xl hover:bg-[#005f38] transition flex items-center justify-center gap-2 disabled:opacity-50">
                  {deptEditLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteDeptConfirm !== null}
        title="Delete Department"
        message={`Are you sure you want to delete department "${deleteDeptConfirm}"? This can only be done if it has no courses.`}
        loading={deleteDeptLoading}
        onConfirm={handleDeleteDept}
        onCancel={() => { setDeleteDeptConfirm(null); setDeleteDeptLoading(false); }}
      />

      <ConfirmModal
        open={deleteConfirm !== null}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteConfirm(null); setDeleting(false); }}
      />
      <EditCourseModal
        course={editingCourse}
        departments={departments}
        open={editingCourse !== null}
        onClose={() => setEditingCourse(null)}
      />
    </div>
  );
}
