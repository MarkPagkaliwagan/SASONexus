import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { staffAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import ThemeProvider from "@/components/ThemeProvider";
import AdminShell from "@/components/admin/AdminShell";

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
      <AdminShell
        userName={session.user.name ?? "Admin"}
        userInitial={session.user.name?.charAt(0) ?? "A"}
        adminAvatar={adminAvatar}
      >
        {children}
      </AdminShell>
    </ThemeProvider>
  );
}
