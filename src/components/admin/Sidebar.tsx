import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { SignOutIconButton } from "@/components/SignOutButton";
import { FiGrid, FiUsers, FiBookOpen, FiFileText, FiVolume2 } from "react-icons/fi";

interface SidebarProps {
  userName: string;
  userInitial: string;
  adminAvatar: string | null;
}

const navItems = [
  { href: "/portal/admin", label: "Dashboard", icon: FiGrid },
  { href: "/portal/admin/staff", label: "Staff Accounts", icon: FiUsers },
  { href: "/portal/admin/admission/announcements", label: "Announcements", icon: FiVolume2 },
  { href: "/portal/admin/admission/pre-admissions", label: "Application", icon: FiFileText },
  { href: "/portal/admin/admission", label: "Admission", icon: FiBookOpen },
];

export default function Sidebar({ userName, userInitial, adminAvatar }: SidebarProps) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-9 h-9 bg-gradient-to-br from-[#007848] to-[#005a36] rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <div>
          <span className="font-semibold text-gray-900 dark:text-white">SASO Admin</span>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">Management Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-[#007848]/5 dark:hover:bg-gray-800 hover:text-[#007848] dark:hover:text-[#00a35e] transition"
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
              <span className="text-xs font-semibold text-[#007848] dark:text-[#00a35e]">
                {userInitial}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userName}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">Super Admin</p>
          </div>
        </div>
        <SignOutIconButton className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full" />
      </div>
    </aside>
  );
}
