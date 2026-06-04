import "dotenv/config";
import { db } from "../src/db";
import { staffAccounts } from "../src/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  const email = "admin@mrkyboy.com";
  const password = "Admin@123";
  const name = "Admin";

  const existing = await db.select({ id: staffAccounts.id }).from(staffAccounts).where(eq(staffAccounts.email, email)).limit(1);
  if (existing.length > 0) {
    console.log("Admin already exists — skipping.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(staffAccounts).values({
    name,
    email,
    password: hashedPassword,
    role: "super_admin",
  });

  console.log(`Super admin created: ${email} / ${password}`);
}

seedAdmin().catch(console.error);
