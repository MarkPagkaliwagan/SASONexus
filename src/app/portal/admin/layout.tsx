import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db";
import { staffAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import ThemeProvider from "@/components/ThemeProvider";
import AdminShell from "@/components/admin/AdminShell";
import { getRequiredPermission } from "@/lib/admin-permissions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "super_admin" && !session.user.permissions?.length) {
    redirect("/login");
  }

  // Page-level guard: check current route against session permissions
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  if (session.user.role !== "super_admin" && pathname) {
    const allowedPaths = ["/portal/admin", "/portal/admin/profile"];
    const isAllowed = allowedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (!isAllowed) {
      const required = getRequiredPermission(pathname);
      if (required) {
        const perms = (session.user.permissions ?? []) as string[];
        if (!perms.includes(required)) {
          redirect("/portal/admin");
        }
      } else {
        redirect("/portal/admin");
      }
    }
  }

  const adminData = await db
    .select()
    .from(staffAccounts)
    .where(eq(staffAccounts.email, session.user.email ?? ""))
    .limit(1);
  const record = adminData[0];
  const adminAvatar = record?.avatarUrl ?? null;
  const isSuperAdmin = session.user.role === "super_admin";
  const permissions = (record?.permissions ?? session.user.permissions ?? []) as string[];

  return (
    <ThemeProvider>
      <AdminShell
        userName={session.user.name ?? "Admin"}
        userInitial={session.user.name?.charAt(0) ?? "A"}
        adminAvatar={adminAvatar}
        isSuperAdmin={isSuperAdmin}
        permissions={permissions}
      >
        {children}
      </AdminShell>
    </ThemeProvider>
  );
}
