"use client";

import Link from "next/link";
import {
  FiUsers, FiUserCheck, FiVolume2,
  FiBookOpen, FiFolder, FiEdit3, FiBook,
  FiClipboard, FiCalendar, FiGrid,
} from "react-icons/fi";

const links = [
  { href: "/portal/admin/personnel", label: "Personnel", desc: "Manage about page team", icon: FiUsers, color: "emerald" },
  { href: "/portal/admin/staff", label: "Staff Accounts", desc: "Create & manage accounts", icon: FiUserCheck, color: "blue" },
  { href: "/portal/admin/admission/announcements", label: "Announcements", desc: "Post public updates", icon: FiVolume2, color: "amber" },
  { href: "/portal/admin/academic-setup", label: "Academic Setup", desc: "Years, semesters, courses", icon: FiBookOpen, color: "violet" },
  { href: "/portal/admin/cumulative-records", label: "Cumulative Records", desc: "Student CRF records", icon: FiFolder, color: "cyan" },
  { href: "/portal/admin/student-needs-assessment", label: "SNA", desc: "Needs assessment data", icon: FiEdit3, color: "orange" },
  { href: "/portal/admin/handbooks-pillars", label: "Handbooks & Pillars", desc: "Content & document claims", icon: FiBook, color: "teal" },
  { href: "/portal/admin/admission", label: "Admission", desc: "Full admission panel", icon: FiClipboard, color: "indigo" },
  { href: "/portal/admin/interview", label: "Interview", desc: "Schedule & appointments", icon: FiCalendar, color: "pink" },
];

const colorMap: Record<string, { bg: string; icon: string; hover: string; border: string }> = {
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", hover: "hover:border-emerald-200 dark:hover:border-emerald-800", border: "border-emerald-100 dark:border-emerald-900/30" },
  blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600 dark:text-blue-400", hover: "hover:border-blue-200 dark:hover:border-blue-800", border: "border-blue-100 dark:border-blue-900/30" },
  amber: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", hover: "hover:border-amber-200 dark:hover:border-amber-800", border: "border-amber-100 dark:border-amber-900/30" },
  rose: { bg: "bg-rose-50 dark:bg-rose-900/20", icon: "text-rose-600 dark:text-rose-400", hover: "hover:border-rose-200 dark:hover:border-rose-800", border: "border-rose-100 dark:border-rose-900/30" },
  violet: { bg: "bg-violet-50 dark:bg-violet-900/20", icon: "text-violet-600 dark:text-violet-400", hover: "hover:border-violet-200 dark:hover:border-violet-800", border: "border-violet-100 dark:border-violet-900/30" },
  cyan: { bg: "bg-cyan-50 dark:bg-cyan-900/20", icon: "text-cyan-600 dark:text-cyan-400", hover: "hover:border-cyan-200 dark:hover:border-cyan-800", border: "border-cyan-100 dark:border-cyan-900/30" },
  orange: { bg: "bg-orange-50 dark:bg-orange-900/20", icon: "text-orange-600 dark:text-orange-400", hover: "hover:border-orange-200 dark:hover:border-orange-800", border: "border-orange-100 dark:border-orange-900/30" },
  teal: { bg: "bg-teal-50 dark:bg-teal-900/20", icon: "text-teal-600 dark:text-teal-400", hover: "hover:border-teal-200 dark:hover:border-teal-800", border: "border-teal-100 dark:border-teal-900/30" },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/20", icon: "text-indigo-600 dark:text-indigo-400", hover: "hover:border-indigo-200 dark:hover:border-indigo-800", border: "border-indigo-100 dark:border-indigo-900/30" },
  pink: { bg: "bg-pink-50 dark:bg-pink-900/20", icon: "text-pink-600 dark:text-pink-400", hover: "hover:border-pink-200 dark:hover:border-pink-800", border: "border-pink-100 dark:border-pink-900/30" },
};

export function QuickNav() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <FiGrid className="text-xs text-gray-400 dark:text-gray-500" />
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Navigation</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {links.map((link) => {
          const c = colorMap[link.color];
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group bg-white dark:bg-gray-900 rounded-xl border ${c.border} ${c.hover} p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
            >
              <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-2.5 ${c.icon} group-hover:scale-110 transition-transform`}>
                <Icon className="text-sm" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#007848] dark:group-hover:text-[#00a35e] transition-colors">{link.label}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{link.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
