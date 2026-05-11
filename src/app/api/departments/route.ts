import { db } from "@/db";
import { collegeDepartments } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const departments = await db.select({ id: collegeDepartments.id, name: collegeDepartments.name }).from(collegeDepartments);
  return NextResponse.json(departments);
}
