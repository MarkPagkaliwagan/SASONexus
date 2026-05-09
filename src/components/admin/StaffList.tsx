"use client";

import { useState } from "react";
import { activateStaff, deactivateStaff } from "@/lib/actions";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  department: { name: string } | null;
  position: { name: string } | null;
}

export function StaffList({ staff }: { staff: StaffMember[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function handleToggle(staffMember: StaffMember) {
    setLoadingId(staffMember.id);
    try {
      if (staffMember.isActive) {
        await deactivateStaff(staffMember.id);
      } else {
        await activateStaff(staffMember.id);
      }
    } finally {
      setLoadingId(null);
    }
  }

  if (staff.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No Staff Yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create your first staff account using the form.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Staff Accounts ({staff.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {staff.map((member) => (
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
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{member.email}</p>
              <div className="flex gap-3 mt-1">
                {member.department && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">{member.department.name}</span>
                )}
                {member.position && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">&middot; {member.position.name}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => handleToggle(member)}
              disabled={loadingId === member.id}
              className={`ml-4 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                member.isActive
                  ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                  : "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loadingId === member.id ? "Processing..." : member.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
