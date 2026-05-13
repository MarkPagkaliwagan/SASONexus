"use client";

import { useState } from "react";
import { deactivatePersonnel, activatePersonnel, deletePersonnel } from "@/lib/actions";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

interface PersonnelMember {
  id: number;
  name: string;
  position: string | null;
  email: string | null;
  contact: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  isHead: boolean;
  unitId: number | null;
  unit: { name: string } | null;
}

interface Props {
  personnel: PersonnelMember[];
  onEdit?: (member: PersonnelMember) => void;
}

export function PersonnelList({ personnel, onEdit }: Props) {
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleToggle(member: PersonnelMember) {
    setTogglingId(member.id);
    try {
      if (member.isActive) {
        await deactivatePersonnel(member.id);
      } else {
        await activatePersonnel(member.id);
      }
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this personnel?")) return;
    setDeletingId(id);
    try {
      await deletePersonnel(id);
    } finally {
      setDeletingId(null);
    }
  }

  if (personnel.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No Personnel Yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add personnel using the form on the left.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Personnel ({personnel.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {personnel.map((member) => (
          <div key={member.id} className="px-6 py-4 flex items-center gap-4 flex-wrap">
            <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-[#007848]/10 dark:bg-[#007848]/20 flex items-center justify-center">
              {member.avatarUrl ? (
                <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-[#007848] dark:text-[#00a35e]">
                  {member.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {member.name}
                </span>
                {member.isHead && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#007848]/10 text-[#007848] dark:bg-[#007848]/20 dark:text-[#00a35e]">
                    SASO Head
                  </span>
                )}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    member.isActive
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {member.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{member.email || member.contact || "—"}</p>
              <div className="flex gap-3 mt-1">
                {member.unit && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">{member.unit.name}</span>
                )}
                {member.position && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">&middot; {member.position}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(member)}
                  disabled={togglingId === member.id}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                >
                  <FiEdit2 className="text-sm" />
                </button>
              )}
              <button
                onClick={() => handleToggle(member)}
                disabled={togglingId === member.id}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  member.isActive
                    ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                    : "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {togglingId === member.id ? "..." : member.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                disabled={deletingId === member.id}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition disabled:opacity-50"
              >
                <FiTrash2 className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
