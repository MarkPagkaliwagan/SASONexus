import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { staffAccounts, sasoUnits, positions } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const [user] = await db
    .select()
    .from(staffAccounts)
    .where(eq(staffAccounts.email, session.user.email))
    .limit(1);
  if (!user) redirect("/login");

  let unitName: string | null = null;
  let positionName: string | null = null;
  if (user.unitId) {
    const [unit] = await db.select().from(sasoUnits).where(eq(sasoUnits.id, user.unitId)).limit(1);
    unitName = unit?.name ?? null;
  }
  if (user.positionId) {
    const [pos] = await db.select().from(positions).where(eq(positions.id, user.positionId)).limit(1);
    positionName = pos?.name ?? null;
  }

  return (
    <ProfileClient
      name={user.name}
      email={user.email}
      avatarUrl={user.avatarUrl}
      role={user.role}
      unitName={unitName}
      positionName={positionName}
      createdAt={user.createdAt}
    />
  );
}
