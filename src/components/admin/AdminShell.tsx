"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { SignOutIconButton } from "@/components/SignOutButton";
import { FiGrid, FiUsers, FiBookOpen, FiVolume2, FiClipboard, FiMenu, FiX, FiChevronRight, FiCalendar, FiUserCheck, FiFolder, FiEdit3, FiBook } from "react-icons/fi";

const allNavItems = [
  { href: "/portal/admin", label: "Dashboard", icon: FiGrid, permission: null },
  { href: "/portal/admin/personnel", label: "Personnel", icon: FiUsers, permission: "personnel" },
  { href: "/portal/admin/staff", label: "Staff Accounts", icon: FiUserCheck, permission: null },
  { href: "/portal/admin/admission/announcements", label: "Announcements", icon: FiVolume2, permission: "announcements" },
  { href: "/portal/admin/academic-setup", label: "Academic Setup", icon: FiBookOpen, permission: "academic-setup" },
  { href: "/portal/admin/cumulative-records", label: "Cumulative Records", icon: FiFolder, permission: "cumulative-records" },
  { href: "/portal/admin/student-needs-assessment", label: "Student Needs Assessment", icon: FiEdit3, permission: "student-needs-assessment" },
  { href: "/portal/admin/handbooks-pillars", label: "Handbooks & Pillars", icon: FiBook, permission: "handbooks-pillars" },
  { href: "/portal/admin/admission", label: "Admission", icon: FiClipboard, permission: "admission" },
  { href: "/portal/admin/interview", label: "Interview", icon: FiCalendar, permission: "interview" },
];

interface Props {
  children: React.ReactNode;
  userName: string;
  userInitial: string;
  adminAvatar: string | null;
  isSuperAdmin?: boolean;
  permissions?: string[];
}

export default function AdminShell({ children, userName, userInitial, adminAvatar, isSuperAdmin = false, permissions = [] }: Props) {

  const navItems = allNavItems.filter((item) => {
    if (isSuperAdmin) return true;
    if (item.permission === null) return item.href === "/portal/admin";
    return permissions.includes(item.permission);
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (pathname === href) return true;
    if (href === "/portal/admin") return false;
    if (href === "/portal/admin/academic-setup") {
      return pathname.startsWith("/portal/admin/admission/academic-years") ||
             pathname.startsWith("/portal/admin/admission/courses") ||
             pathname.startsWith("/portal/admin/admission/strands");
    }
    if (pathname.startsWith(href + "/")) {
      if (href === "/portal/admin/admission") {
        if (pathname === "/portal/admin/admission") return true;
        if (pathname.startsWith("/portal/admin/admission/announcements")) return false;
        if (pathname.startsWith("/portal/admin/admission/academic-years")) return false;
        if (pathname.startsWith("/portal/admin/admission/courses")) return false;
        if (pathname.startsWith("/portal/admin/admission/strands")) return false;
        return true;
      }
      return true;
    }
    return false;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar drawer (mobile) / static sidebar (desktop) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          flex flex-col flex-shrink-0
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100 dark:border-gray-800">
          <div className="w-9 h-9 bg-gradient-to-br from-[#007848] to-[#005a36] rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div className="flex-1">
            <span className="font-semibold text-gray-900 dark:text-white">SASO Admin</span>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">Management Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <FiX className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-[#007848]/10 dark:bg-[#007848]/20 text-[#007848] dark:text-[#00a35e]"
                    : "text-gray-600 dark:text-gray-400 hover:bg-[#007848]/5 dark:hover:bg-gray-800 hover:text-[#007848] dark:hover:text-[#00a35e]"
                }`}
              >
                <Icon className="text-lg" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <ThemeToggle />
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden bg-[#007848]/10 dark:bg-[#007848]/20 flex items-center justify-center">
              {adminAvatar ? (
                <img src={adminAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-[#007848] dark:text-[#00a35e]">{userInitial}</span>
              )}
            </div>
            <Link href="/portal/admin/profile" className="flex-1 min-w-0 hover:opacity-80 transition">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userName}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{isSuperAdmin ? "Super Admin" : "Staff"}</p>
            </Link>
          </div>
          <SignOutIconButton className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Open menu"
          >
            <FiMenu className="text-xl" />
          </button>
          <FiChevronRight className="text-gray-300 dark:text-gray-600 text-sm hidden sm:block" />
          <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {userName.split(" ")[0] ? `${userName.split(" ")[0]}'s Panel` : "Admin Panel"}
          </span>
        </header>
        <div className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </div>
      </main>


    </div>
  );
}
