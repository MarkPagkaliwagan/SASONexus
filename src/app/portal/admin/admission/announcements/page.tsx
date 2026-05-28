import { db } from "@/db";
import { announcements } from "@/db/schema";
import { desc } from "drizzle-orm";
import { AnnouncementForm } from "@/components/admin/admission/announcements/AnnouncementForm";
import { AnnouncementList } from "@/components/admin/admission/announcements/AnnouncementList";
import { FiChevronRight } from "react-icons/fi";

export default async function AnnouncementsPage() {
  const allAnnouncements = await db.query.announcements.findMany({
    orderBy: (a, { desc }) => [desc(a.createdAt)],
  });

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Admission</span>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-600 dark:text-gray-300">Announcements</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage announcements displayed on the public page.</p>
      </div>

      <div className="space-y-8">
        <AnnouncementForm />
        <AnnouncementList announcements={allAnnouncements} />
      </div>
    </>
  );
}
