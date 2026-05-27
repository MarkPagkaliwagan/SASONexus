import { db } from "@/db";
import { cumulativeRecords } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { CumulativeRecordsList } from "./CumulativeRecordsList";

export default async function CumulativeRecordsPage() {
  const records = await db
    .select()
    .from(cumulativeRecords)
    .orderBy(desc(cumulativeRecords.updatedAt));

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Cumulative Records</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cumulative Records</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage student cumulative record folder submissions.</p>
      </div>

      <CumulativeRecordsList records={records} />
    </>
  );
}
