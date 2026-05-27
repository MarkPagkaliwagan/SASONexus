"use client";

import { useState, useMemo } from "react";
import { deactivatePersonnel, activatePersonnel, deletePersonnel } from "@/lib/actions";
import { FiTrash2, FiEdit2, FiSearch, FiX } from "react-icons/fi";

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

type SortKey = "name" | "unit" | "position" | "status";

export function PersonnelList({ personnel, onEdit }: Props) {
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = q
      ? personnel.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            (m.position && m.position.toLowerCase().includes(q)) ||
            (m.email && m.email.toLowerCase().includes(q)) ||
            (m.unit && m.unit.name.toLowerCase().includes(q))
        )
      : [...personnel];

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "unit":
          cmp = (a.unit?.name || "").localeCompare(b.unit?.name || "");
          break;
        case "position":
          cmp = (a.position || "").localeCompare(b.position || "");
          break;
        case "status":
          cmp = Number(a.isActive) - Number(b.isActive);
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [personnel, search, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

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
          Add personnel using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Personnel ({filtered.length})
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, position, email, or unit..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FiX />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs">
            {(["name", "unit", "position", "status"] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => toggleSort(key)}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  sortKey === key
                    ? "bg-[#007848] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)} {sortKey === key ? (sortAsc ? "↑" : "↓") : ""}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
        {filtered.map((member) => (
          <div key={member.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="h-32 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center overflow-hidden">
              {member.avatarUrl ? (
                <img src={member.avatarUrl} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="text-4xl font-bold text-gray-300 dark:text-gray-600">
                  {member.name.charAt(0)}
                </span>
              )}
              {member.isHead && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#007848]/90 text-white backdrop-blur-sm">
                  SASO Head
                </span>
              )}
              <span
                className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                  member.isActive
                    ? "bg-green-500/90 text-white"
                    : "bg-red-500/90 text-white"
                } backdrop-blur-sm`}
              >
                {member.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="p-3.5 flex-1 flex flex-col">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate leading-snug">{member.name}</h3>
              <div className="mt-1 space-y-0.5 text-xs text-gray-500 dark:text-gray-400 leading-snug">
                {member.position && <p className="truncate">{member.position}</p>}
                {member.unit && <p className="truncate">{member.unit.name}</p>}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">{member.email || member.contact || "—"}</p>
              <div className="flex items-center gap-1.5 mt-auto pt-2.5">
                {onEdit && (
                  <button
                    onClick={() => onEdit(member)}
                    disabled={togglingId === member.id}
                    className="flex-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition disabled:opacity-50 cursor-pointer"
                  >
                    <FiEdit2 className="inline mr-1 text-[10px]" /> Edit
                  </button>
                )}
                <button
                  onClick={() => handleToggle(member)}
                  disabled={togglingId === member.id}
                  className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50 cursor-pointer ${
                    member.isActive
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  {togglingId === member.id ? "..." : member.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  disabled={deletingId === member.id}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50 cursor-pointer"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
