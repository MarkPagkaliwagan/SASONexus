"use client";

import { useState } from "react";
import { createCourse, upsertCollegeDepartment } from "@/lib/actions";
import { FiLoader } from "react-icons/fi";

const ADD_NEW = "__add_new__";

export function CourseForm({ departments }: { departments: string[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [isNewDepartment, setIsNewDepartment] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      if (isNewDepartment) {
        const deptName = formData.get("department") as string;
        const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
        let b64 = "";
        if (fileInput?.files?.[0]) {
          b64 = await fileToBase64(fileInput.files[0]);
        }
        await upsertCollegeDepartment(deptName, b64 || null);
      }

      await createCourse(formData);
      setMessage({ type: "success", text: "Course added!" });
      form.reset();
      setSelectedDept("");
      setIsNewDepartment(false);
      setLogoPreview("");
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
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

  function handleDepartmentChange(value: string) {
    setSelectedDept(value);
    setIsNewDepartment(value === ADD_NEW);
    if (value !== ADD_NEW) setLogoPreview("");
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Add College Course</h2>
      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${message.type === "success" ? "bg-green-50 dark:bg-green-900/30 border border-green-200 text-green-700" : "bg-red-50 dark:bg-red-900/30 border border-red-200 text-red-600"}`}>
          {message.text}
        </div>
      )}
      <form id="course-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
          <select
            value={selectedDept}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            disabled={loading}
            required
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition disabled:opacity-50 appearance-none"
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
            <option value={ADD_NEW}>+ Add New</option>
          </select>
        </div>

        {isNewDepartment && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Department Name</label>
              <input type="text" name="department" required placeholder="e.g. College of Engineering" disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white placeholder-gray-400 transition disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department Logo (optional)</label>
              <input type="file" accept="image/*" disabled={loading} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setLogoPreview(reader.result as string);
                  reader.readAsDataURL(file);
                } else {
                  setLogoPreview("");
                }
              }} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#007848]/10 file:text-[#007848] file:text-sm file:font-medium hover:file:bg-[#007848]/20 transition disabled:opacity-50" />
              {logoPreview && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={logoPreview} alt="Preview" className="w-8 h-8 rounded-lg object-contain border border-gray-200" />
                  <span className="text-xs text-gray-400">Logo preview</span>
                </div>
              )}
            </div>
          </>
        )}

        {!isNewDepartment && selectedDept && (
          <input type="hidden" name="department" value={selectedDept} />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Name</label>
          <input type="text" name="name" required placeholder="e.g. Bachelor of Science in Nursing" disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white placeholder-gray-400 transition disabled:opacity-50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code (optional)</label>
          <input type="text" name="code" placeholder="e.g. BSN" disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white placeholder-gray-400 transition disabled:opacity-50" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-[#007848] text-white font-semibold py-2.5 rounded-xl hover:bg-[#005f38] transition flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <><FiLoader className="animate-spin" /> Adding...</> : "Add Course"}
        </button>
      </form>
    </div>
  );
}
