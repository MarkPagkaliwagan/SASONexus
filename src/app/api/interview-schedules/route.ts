import { db } from "@/db";
import { interviewSchedules } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") || "initial";

  const schedules = await db
    .select()
    .from(interviewSchedules)
    .where(
      and(
        eq(interviewSchedules.type, type),
        eq(interviewSchedules.isActive, true),
        gt(interviewSchedules.slots, interviewSchedules.booked),
      ),
    )
    .orderBy(interviewSchedules.date, interviewSchedules.timeStart);

  return NextResponse.json(schedules);
}
