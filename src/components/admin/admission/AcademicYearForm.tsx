"use client";

import { useState } from "react";
import { createAcademicYear } from "@/lib/actions";
import { FiLoader } from "react-icons/fi";

export function AcademicYearForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    try {
      await createAcademicYear(formData);
      setMessage({ type: "success", text: "Academic year added!" });
      (document.getElementById("ay-form") as HTMLFormElement)?.reset();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Add Academic Year</h2>
      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${message.type === "success" ? "bg-green-50 dark:bg-green-900/30 border border-green-200 text-green-700" : "bg-red-50 dark:bg-red-900/30 border border-red-200 text-red-600"}`}>
          {message.text}
        </div>
      )}
      <form id="ay-form" action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Academic Year</label>
          <input type="text" name="year" required placeholder="e.g. 2025-2026" disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white placeholder-gray-400 transition disabled:opacity-50" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-[#007848] text-white font-semibold py-2.5 rounded-xl hover:bg-[#005f38] transition flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <><FiLoader className="animate-spin" /> Adding...</> : "Add Academic Year"}
        </button>
      </form>
    </div>
  );
}
