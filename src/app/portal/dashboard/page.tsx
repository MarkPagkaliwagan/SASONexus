import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";
import ThemeProvider from "@/components/ThemeProvider";
import Link from "next/link";

const MODULE_LINKS: Record<string, { label: string; description: string }> = {
  personnel: { label: "Personnel", description: "Manage personnel directory" },
  announcements: { label: "Announcements", description: "Manage announcements" },
  "academic-setup": { label: "Academic Setup", description: "Academic years, courses, strands" },
  "cumulative-records": { label: "Cumulative Records", description: "View CRF submissions" },
  "student-needs-assessment": { label: "Student Needs Assessment", description: "View SNA submissions" },
  "handbooks-pillars": { label: "Handbooks & Pillars", description: "Manage content" },
  admission: { label: "Admission", description: "Manage admission content" },
  interview: { label: "Interview", description: "Manage interview schedules" },
  "document-claims": { label: "Document Claims", description: "Track document claims" },
};

export default async function StaffDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const permissions = session.user.permissions ?? [];

  if (session.user.role === "super_admin" || permissions.length > 0) {
    redirect("/portal/admin");
  }

  const { name, unitName, positionName } = session.user;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#007848] to-[#005a36] rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">
                  {name?.charAt(0).toUpperCase() ?? "S"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">{unitName ?? "SASO"}</span>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">{positionName ?? "Staff"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{name}</span>
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <SignOutButton className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium cursor-pointer" />
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-[#007848]/10 dark:bg-[#007848]/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#007848] dark:text-[#00a35e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome, {name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {unitName} &middot; {positionName}
            </p>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Your account has no module access. Contact your administrator to assign permissions.
              </p>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
