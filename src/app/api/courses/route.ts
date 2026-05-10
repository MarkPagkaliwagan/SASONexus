import { db } from "@/db";
import { collegeCourses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const department = request.nextUrl.searchParams.get("department");
  let courses;

  if (department) {
    courses = await db
      .select({ id: collegeCourses.id, name: collegeCourses.name, code: collegeCourses.code })
      .from(collegeCourses)
      .where(eq(collegeCourses.department, department));
  } else {
    courses = await db
      .select({ id: collegeCourses.id, name: collegeCourses.name, code: collegeCourses.code })
      .from(collegeCourses);
  }

  return NextResponse.json(courses);
}
