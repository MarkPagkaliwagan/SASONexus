"use client";

import { useState, useMemo } from "react";

interface StudentItem {
  id: number;
  studentId: string | null;
  familyName: string;
  givenName: string;
  middleName: string | null;
  applicationLevel: string;
  gradeLevel: string | null;
  academicYear: string | null;
  pictureUrl: string | null;
  enrolledAt: Date;
}

export function StudentsTable({ items, academicYearOptions = [] }: { items: StudentItem[]; academicYearOptions?: string[] }) {
  const [academicYear, setAcademicYear] = useState("all");

  const filtered = useMemo(() => {
    if (academicYear === "all") return items;
    return items.filter((s) => s.academicYear === academicYear);
  }, [items, academicYear]);

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No admitted students yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Students ({filtered.length})</h2>
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007848]"
          >
            <option value="all">All A.Y.</option>
            {academicYearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Level</th>
              <th className="px-6 py-3 font-medium">A.Y.</th>
              <th className="px-6 py-3 font-medium">Student ID</th>
              <th className="px-6 py-3 font-medium">Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No results found.
                </td>
              </tr>
            ) : filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-[#007848]/10 dark:bg-[#007848]/20 flex items-center justify-center">
                      {item.pictureUrl ? (
                        <img src={item.pictureUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-semibold text-[#007848] dark:text-[#00a35e]">
                          {item.givenName.charAt(0)}{item.familyName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.givenName} {item.familyName}
                      </span>
                      {item.middleName && (
                        <span className="text-gray-400 ml-1">{item.middleName}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {item.applicationLevel}
                  {item.gradeLevel && <span className="text-gray-400 ml-1">- {item.gradeLevel}</span>}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{item.academicYear || "—"}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono">
                  {item.studentId || "—"}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {item.enrolledAt ? new Date(item.enrolledAt).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
