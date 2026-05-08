"use client";

import { useState } from "react";
import { toggleSchedule, deleteSchedule, updateScheduleSlots } from "@/lib/actions";
import { FiTrash2, FiRefreshCw } from "react-icons/fi";

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

  async function handleToggle(id: number) {
    setToggling(id);
    await toggleSchedule(id);
    setToggling(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this schedule slot?")) return;
    await deleteSchedule(id);
  }

  async function handleReset(id: number, maxSlots: number) {
    await updateScheduleSlots(id, maxSlots);
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
            <div key={s.id} className="px-6 py-4 flex items-center gap-4">
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

              <button onClick={() => handleReset(s.id, s.maxSlots)} title="Reset slots" className="text-blue-400 hover:text-blue-600 transition">
                <FiRefreshCw className="text-sm" />
              </button>

              <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600 transition">
                <FiTrash2 className="text-sm" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
