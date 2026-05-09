"use client";

import { useState } from "react";
import { toggleSchedule, deleteSchedule, updateScheduleSlots } from "@/lib/actions";
import { FiTrash2, FiRefreshCw } from "react-icons/fi";
import { ConfirmModal } from "./ConfirmModal";

interface Schedule {
  id: number;
  level: string;
  date: string | null;
  time: string | null;
  maxSlots: number;
  availableSlots: number;
  isAvailable: boolean;
}

const levelColors: Record<string, string> = {
  COLLEGE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SHS: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  JHS: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  GS: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

export function ScheduleList({ schedules }: { schedules: Schedule[] }) {
  const [toggling, setToggling] = useState<number | null>(null);
  const [resetting, setResetting] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleToggle(id: number) {
    setToggling(id);
    await toggleSchedule(id);
    setToggling(null);
  }

  async function handleDelete() {
    if (deleteConfirm === null) return;
    setDeleting(true);
    await deleteSchedule(deleteConfirm);
    setDeleting(false);
    setDeleteConfirm(null);
  }

  async function handleReset(id: number, maxSlots: number) {
    setResetting(id);
    await updateScheduleSlots(id, maxSlots);
    setResetting(null);
  }

  if (schedules.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No schedule slots yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Schedules ({schedules.length})</h2>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {schedules.map((s) => {
          const isFull = s.availableSlots <= 0;
          return (
            <div key={s.id} className="px-6 py-4 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${levelColors[s.level] || "bg-gray-100 text-gray-700"}`}>
                  {s.level}
                </span>
                <div className="flex gap-3 mt-1.5">
                  {s.date && <span className="text-xs text-gray-400">{s.date}</span>}
                  {s.time && <span className="text-xs text-gray-400">{s.time}</span>}
                </div>
              </div>

              <div className="text-right text-xs">
                <span className={`font-semibold ${isFull ? "text-red-500" : s.availableSlots <= 5 ? "text-yellow-500" : "text-green-500"}`}>
                  {s.availableSlots}/{s.maxSlots}
                </span>
                <div className="text-gray-400">slots left</div>
              </div>

              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.isAvailable && !isFull ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                {isFull ? "Full" : s.isAvailable ? "Open" : "Closed"}
              </span>

              <button onClick={() => handleToggle(s.id)} disabled={toggling === s.id} className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50">
                {toggling === s.id ? "..." : s.isAvailable ? "Close" : "Open"}
              </button>

              <button onClick={() => handleReset(s.id, s.maxSlots)} disabled={resetting === s.id} title="Reset slots" className="text-blue-400 hover:text-blue-600 transition disabled:opacity-50">
                {resetting === s.id ? <FiRefreshCw className="text-sm animate-spin" /> : <FiRefreshCw className="text-sm" />}
              </button>

              <button onClick={() => setDeleteConfirm(s.id)} disabled={deleting} className="text-red-400 hover:text-red-600 transition disabled:opacity-50">
                <FiTrash2 className="text-sm" />
              </button>
            </div>
          );
        })}
      </div>
      <ConfirmModal
        open={deleteConfirm !== null}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule slot? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteConfirm(null); setDeleting(false); }}
      />
    </div>
  );
}
