import { db } from "@/db";
import { academicYears } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const years = await db.select({ id: academicYears.id, year: academicYears.year }).from(academicYears).orderBy(academicYears.year);
  return NextResponse.json(years);
}
