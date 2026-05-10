"use client";

import { useState, useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { createInterviewSchedule } from "@/lib/actions";

interface Course {
  id: number;
  name: string;
  code: string | null;
}

export function InterviewForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [type, setType] = useState("initial");
  const [department, setDepartment] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (department === "College") {
      fetch("/api/courses")
        .then((r) => r.json())
        .then(setCourses);
    } else {
      setCourses([]);
    }
  }, [department]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    try {
      await createInterviewSchedule(formData);
      setMessage({ type: "success", text: "Schedule added!" });
      (document.getElementById("interview-form") as HTMLFormElement)?.reset();
      setType("initial");
      setDepartment("");
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Add Schedule Slot</h2>
      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${message.type === "success" ? "bg-green-50 dark:bg-green-900/30 border border-green-200 text-green-700" : "bg-red-50 dark:bg-red-900/30 border border-red-200 text-red-600"}`}>
          {message.text}
        </div>
      )}
      <form id="interview-form" action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
          <select name="type" value={type} onChange={(e) => setType(e.target.value)} required disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition disabled:opacity-50">
            <option value="initial">Initial Interview</option>
            <option value="exit">Exit Interview</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
          <select name="department" value={department} onChange={(e) => setDepartment(e.target.value)} required disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition disabled:opacity-50">
            <option value="">Select department</option>
            <option value="GS">GS</option>
            <option value="JHS">JHS</option>
            <option value="SHS">SHS</option>
            <option value="College">College</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{department === "College" ? "Course" : "Grade Level"}</label>
          <select name="gradeLevel" required disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition disabled:opacity-50">
            <option value="">Select {department === "College" ? "course" : "grade level"}</option>
            {department === "College"
              ? courses.map((c) => <option key={c.id} value={c.code || c.name}>{c.code || c.name}</option>)
              : department === "GS"
                ? (type === "initial" ? [1,2,3,4,5,6] : [6]).map((n) => <option key={n} value={n}>{n}</option>)
                : department === "JHS"
                  ? (type === "initial" ? [6,7,8,9,10] : [10]).map((n) => <option key={n} value={n}>{n}</option>)
                  : department === "SHS"
                    ? (type === "initial" ? [11,12] : [12]).map((n) => <option key={n} value={n}>{n}</option>)
                    : null
            }
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
          <input type="date" name="date" required disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition disabled:opacity-50" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Start</label>
            <input type="time" name="timeStart" required disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition disabled:opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time End</label>
            <input type="time" name="timeEnd" required disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition disabled:opacity-50" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available Slots</label>
          <input type="number" name="slots" defaultValue={10} min={1} disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition disabled:opacity-50" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-[#007848] text-white font-semibold py-2.5 rounded-xl hover:bg-[#005f38] transition flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <><FiLoader className="animate-spin" /> Adding...</> : "Add Schedule"}
        </button>
      </form>
    </div>
  );
}
