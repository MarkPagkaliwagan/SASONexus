import { db } from "@/db";
import { handbooksPillars } from "@/db/schema";
import { asc } from "drizzle-orm";
import { HandbooksPillarsManager } from "./HandbooksPillarsManager";

export default async function HandbooksPillarsPage() {
  const items = await db
    .select()
    .from(handbooksPillars)
    .orderBy(asc(handbooksPillars.sortOrder));

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Handbooks &amp; Pillars</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Handbooks &amp; Pillars</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage Student Handbook and Pillars content displayed on the Services page.</p>
      </div>

      <HandbooksPillarsManager items={items} />
    </>
  );
}
