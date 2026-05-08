import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { staffAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import ThemeProvider from "@/components/ThemeProvider";
import Sidebar from "@/components/admin/Sidebar";
import { FiChevronRight } from "react-icons/fi";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "super_admin") {
    redirect("/login");
  }

  const adminData = await db
    .select()
    .from(staffAccounts)
    .where(eq(staffAccounts.email, session.user.email ?? ""))
    .limit(1);
  const adminAvatar = adminData[0]?.avatarUrl ?? null;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
        <Sidebar
          userName={session.user.name ?? "Admin"}
          userInitial={session.user.name?.charAt(0) ?? "A"}
          adminAvatar={adminAvatar}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 gap-4 sticky top-0 z-10">
            <FiChevronRight className="text-gray-300 dark:text-gray-600 text-sm" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {session.user.name?.split(" ")[0] ? `${session.user.name.split(" ")[0]}'s Panel` : "Admin Panel"}
            </span>
          </header>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
