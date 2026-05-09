"use client";

import { useState } from "react";
import { toggleAnnouncement, deleteAnnouncement } from "@/lib/actions";
import { FiTrash2 } from "react-icons/fi";
import { ConfirmModal } from "../ConfirmModal";

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  image: string | null;
  isActive: boolean;
  createdAt: Date;
}

const categoryColors: Record<string, string> = {
  Enrollment: "bg-blue-100 text-blue-700",
  Academics: "bg-purple-100 text-purple-700",
  Activities: "bg-orange-100 text-orange-700",
  Scholarship: "bg-green-100 text-green-700",
  General: "bg-gray-100 text-gray-700",
  Event: "bg-pink-100 text-pink-700",
  Advisory: "bg-yellow-100 text-yellow-700",
};

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  const [toggling, setToggling] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleToggle(id: number) {
    setToggling(id);
    await toggleAnnouncement(id);
    setToggling(null);
  }

  async function handleDelete() {
    if (deleteConfirm === null) return;
    setDeleting(true);
    await deleteAnnouncement(deleteConfirm);
    setDeleting(false);
    setDeleteConfirm(null);
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No announcements yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((a) => (
        <div key={a.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start gap-4">
            {a.image && (
              <img src={a.image} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[a.category] || categoryColors.General}`}>
                  {a.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${a.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {a.isActive ? "Visible" : "Hidden"}
                </span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{a.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{a.content}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => handleToggle(a.id)} disabled={toggling === a.id} className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50">
                {toggling === a.id ? "..." : a.isActive ? "Hide" : "Show"}
              </button>
              <button onClick={() => setDeleteConfirm(a.id)} disabled={deleting} className="text-red-400 hover:text-red-600 transition disabled:opacity-50">
                <FiTrash2 className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      ))}
      <ConfirmModal
        open={deleteConfirm !== null}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteConfirm(null); setDeleting(false); }}
      />
    </div>
  );
}
