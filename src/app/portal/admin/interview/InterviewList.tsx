"use client";

import { useState } from "react";
import { toggleInterviewSchedule, deleteInterviewSchedule } from "@/lib/actions";
import { FiTrash2 } from "react-icons/fi";
import { ConfirmModal } from "@/components/admin/admission/ConfirmModal";

interface InterviewSchedule {
  id: number;
  title: string;
  type: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  slots: number;
  booked: number;
  isActive: boolean;
  createdAt: Date | null;
}

const typeColors: Record<string, string> = {
  initial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  exit: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export function InterviewList({ schedules }: { schedules: InterviewSchedule[] }) {
  const [toggling, setToggling] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleToggle(id: number) {
    setToggling(id);
    await toggleInterviewSchedule(id);
    setToggling(null);
  }

  async function handleDelete() {
    if (deleteConfirm === null) return;
    setDeleting(true);
    await deleteInterviewSchedule(deleteConfirm);
    setDeleting(false);
    setDeleteConfirm(null);
  }

  if (schedules.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No interview schedules yet.</p>
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
          const isFull = s.booked >= s.slots;
          const available = s.slots - s.booked;
          return (
            <div key={s.id} className="px-6 py-4 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[s.type] || "bg-gray-100 text-gray-700"}`}>
                  {s.type === "initial" ? "Initial" : "Exit"}
                </span>
                <div className="font-medium text-gray-900 dark:text-white text-sm mt-1">{s.title}</div>
                <div className="flex gap-3 mt-0.5">
                  <span className="text-xs text-gray-400">{s.date}</span>
                  <span className="text-xs text-gray-400">{s.timeStart} - {s.timeEnd}</span>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className={`font-semibold ${isFull ? "text-red-500" : available <= 3 ? "text-yellow-500" : "text-green-500"}`}>
                  {available}/{s.slots}
                </span>
                <div className="text-gray-400">slots left</div>
              </div>

              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.isActive && !isFull ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                {isFull ? "Full" : s.isActive ? "Open" : "Closed"}
              </span>

              <button onClick={() => handleToggle(s.id)} disabled={toggling === s.id} className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50">
                {toggling === s.id ? "..." : s.isActive ? "Close" : "Open"}
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
        message="Are you sure you want to delete this interview schedule? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteConfirm(null); setDeleting(false); }}
      />
    </div>
  );
}
