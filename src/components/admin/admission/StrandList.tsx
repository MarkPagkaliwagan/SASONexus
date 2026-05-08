"use client";

import { useState } from "react";
import { toggleStrand, deleteStrand } from "@/lib/actions";
import { FiTrash2 } from "react-icons/fi";
import { ConfirmModal } from "./ConfirmModal";

interface Strand {
  id: number;
  name: string;
  code: string | null;
  isActive: boolean;
}

export function StrandList({ strands }: { strands: Strand[] }) {
  const [toggling, setToggling] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleToggle(id: number) {
    setToggling(id);
    await toggleStrand(id);
    setToggling(null);
  }

  async function handleDelete() {
    if (deleteConfirm === null) return;
    setDeleting(true);
    await deleteStrand(deleteConfirm);
    setDeleting(false);
    setDeleteConfirm(null);
  }

  if (strands.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No strands yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Strands ({strands.length})</h2>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {strands.map((strand) => (
          <div key={strand.id} className="px-6 py-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{strand.name}</span>
              {strand.code && <span className="ml-2 text-xs text-gray-400">{strand.code}</span>}
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${strand.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
              {strand.isActive ? "Active" : "Inactive"}
            </span>
            <button onClick={() => handleToggle(strand.id)} disabled={toggling === strand.id} className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50">
              {toggling === strand.id ? "..." : strand.isActive ? "Deactivate" : "Activate"}
            </button>
            <button onClick={() => setDeleteConfirm(strand.id)} disabled={deleting} className="text-red-400 hover:text-red-600 transition disabled:opacity-50">
              <FiTrash2 className="text-sm" />
            </button>
          </div>
        ))}
      </div>
      <ConfirmModal
        open={deleteConfirm !== null}
        title="Delete Strand"
        message="Are you sure you want to delete this strand? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteConfirm(null); setDeleting(false); }}
      />
    </div>
  );
}
