import { db } from "@/db";
import { shsStrands } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const strands = await db
    .select({ id: shsStrands.id, name: shsStrands.name })
    .from(shsStrands)
    .where(eq(shsStrands.isActive, true));

  return NextResponse.json(strands);
}
