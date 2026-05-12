import { db } from "@/db";
import { interviewSchedules } from "@/db/schema";
import { eq, and, gt, ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") || "initial";
  const department = request.nextUrl.searchParams.get("department") || "";

  const conditions = [
    eq(interviewSchedules.type, type),
    eq(interviewSchedules.isActive, true),
    gt(interviewSchedules.slots, interviewSchedules.booked),
  ];

  if (department) {
    conditions.push(ilike(interviewSchedules.title, `%${department}%`));
  }

  const schedules = await db
    .select()
    .from(interviewSchedules)
    .where(and(...conditions))
    .orderBy(interviewSchedules.date, interviewSchedules.timeStart);

  return NextResponse.json(schedules);
}
