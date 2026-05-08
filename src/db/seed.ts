import "dotenv/config";
import { db } from "./index";
import { departments, positions, staffAccounts } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  await db.delete(staffAccounts);
  await db.delete(positions);
  await db.delete(departments);

  const deps = await db.insert(departments).values([
    { name: "Guidance Office", slug: "guidance", description: "Provides guidance, counseling, and mental health support services." },
    { name: "Student Formation and Development Unit (SFDU)", slug: "sfdu", description: "Oversees student organizations, formation programs, and development activities." },
    { name: "School Clinic", slug: "clinic", description: "Manages student health concerns, medical records, and first aid services." },
    { name: "Campus Ministry", slug: "ministry", description: "Coordinates spiritual formation, liturgical activities, and pastoral services." },
    { name: "Sports Development Unit", slug: "sports", description: "Develops athletic programs, manages sports facilities, and oversees varsity teams." },
  ]).returning();

  console.log("Departments created:", deps.length);

  const posData = [
    { name: "Guidance Director", departmentId: deps[0].id },
    { name: "Guidance Counselor", departmentId: deps[0].id },
    { name: "Psychometrician", departmentId: deps[0].id },
    { name: "Guidance Staff", departmentId: deps[0].id },
    { name: "Director of SFDU", departmentId: deps[1].id },
    { name: "Student Formation Coordinator", departmentId: deps[1].id },
    { name: "Organization Adviser", departmentId: deps[1].id },
    { name: "SFDU Staff", departmentId: deps[1].id },
    { name: "School Nurse", departmentId: deps[2].id },
    { name: "Clinic Assistant", departmentId: deps[2].id },
    { name: "Dentist", departmentId: deps[2].id },
    { name: "Campus Minister", departmentId: deps[3].id },
    { name: "Ministry Coordinator", departmentId: deps[3].id },
    { name: "Ministry Staff", departmentId: deps[3].id },
    { name: "Sports Director", departmentId: deps[4].id },
    { name: "Coach", departmentId: deps[4].id },
    { name: "Sports Coordinator", departmentId: deps[4].id },
    { name: "Sports Staff", departmentId: deps[4].id },
  ];

  const pos = await db.insert(positions).values(posData).returning();
  console.log("Positions created:", pos.length);

  const hashedPassword = await bcrypt.hash("Admin@123", 10);
  const superAdmins = await db.insert(staffAccounts).values([
    {
      name: "Super Admin",
      email: "admin@saso.edu.ph",
      password: hashedPassword,
      role: "super_admin",
    },
    {
      name: "Super Admin 2",
      email: "superadmin@saso.edu.ph",
      password: hashedPassword,
      role: "super_admin",
    },
  ]).returning();

  console.log("Super admins created:", superAdmins.length);
  console.log("Seeding complete!");
}

seed().catch(console.error);
