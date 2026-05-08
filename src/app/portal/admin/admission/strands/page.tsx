import { db } from "@/db";
import { shsStrands } from "@/db/schema";
import { StrandForm } from "@/components/admin/admission/StrandForm";
import { StrandList } from "@/components/admin/admission/StrandList";
import { FiChevronRight } from "react-icons/fi";

export default async function StrandsPage() {
  const strands = await db.query.shsStrands.findMany({
    orderBy: (s, { desc }) => [desc(s.createdAt)],
  });

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Admission</span>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-600 dark:text-gray-300">SHS Strands</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SHS Strands</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage senior high school strands for pre-admission.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <StrandForm />
        </div>
        <div className="lg:col-span-2">
          <StrandList strands={strands} />
        </div>
      </div>
    </>
  );
}
