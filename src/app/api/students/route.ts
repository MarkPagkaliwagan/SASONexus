import { db } from "@/db";
import { students } from "@/db/schema";
import { or, like, ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const results = await db
    .select({
      studentId: students.studentId,
      givenName: students.givenName,
      familyName: students.familyName,
      middleName: students.middleName,
      email: students.email,
      mobileNo: students.mobileNo,
    })
    .from(students)
    .where(
      or(
        ilike(students.studentId, `%${q}%`),
        ilike(students.givenName, `%${q}%`),
        ilike(students.familyName, `%${q}%`),
      ),
    )
    .limit(10);

  return NextResponse.json(
    results.map((s) => ({
      studentId: s.studentId || "",
      fullName: `${s.givenName} ${s.middleName ? s.middleName + " " : ""}${s.familyName}`,
      email: s.email || "",
      contact: s.mobileNo || "",
    })),
  );
}
