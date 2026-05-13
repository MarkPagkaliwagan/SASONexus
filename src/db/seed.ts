import "dotenv/config";
import { db } from "./index";
import { sasoUnits, positions, staffAccounts } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  await db.delete(staffAccounts);
  await db.delete(positions);
  await db.delete(sasoUnits);

  const units = await db.insert(sasoUnits).values([
    { name: "Guidance Office", slug: "guidance", description: "Provides guidance, counseling, and mental health support services." },
    { name: "Student Formation and Development Unit (SFDU)", slug: "sfdu", description: "Oversees student organizations, formation programs, and development activities." },
    { name: "School Clinic", slug: "clinic", description: "Manages student health concerns, medical records, and first aid services." },
    { name: "Campus Ministry", slug: "ministry", description: "Coordinates spiritual formation, liturgical activities, and pastoral services." },
    { name: "Sports Development Unit", slug: "sports", description: "Develops athletic programs, manages sports facilities, and oversees varsity teams." },
  ]).returning();

  console.log("SASO Units created:", units.length);

  const posData = [
    { name: "Guidance Director", unitId: units[0].id },
    { name: "Guidance Counselor", unitId: units[0].id },
    { name: "Psychometrician", unitId: units[0].id },
    { name: "Guidance Staff", unitId: units[0].id },
    { name: "Guidance Associate", unitId: units[0].id },
    { name: "Director of SFDU", unitId: units[1].id },
    { name: "Student Formation Coordinator", unitId: units[1].id },
    { name: "Organization Adviser", unitId: units[1].id },
    { name: "SFDU Staff", unitId: units[1].id },
    { name: "School Nurse", unitId: units[2].id },
    { name: "Clinic Assistant", unitId: units[2].id },
    { name: "Dentist", unitId: units[2].id },
    { name: "Campus Minister", unitId: units[3].id },
    { name: "Ministry Coordinator", unitId: units[3].id },
    { name: "Ministry Staff", unitId: units[3].id },
    { name: "Sports Director", unitId: units[4].id },
    { name: "Coach", unitId: units[4].id },
    { name: "Sports Coordinator", unitId: units[4].id },
    { name: "Sports Staff", unitId: units[4].id },
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
