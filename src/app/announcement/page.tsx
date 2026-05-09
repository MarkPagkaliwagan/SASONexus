import { db } from "@/db";
import { announcements } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementCards from "@/components/AnnouncementCards";

export default async function AnnouncementPage() {
  const allAnnouncements = await db.query.announcements.findMany({
    where: eq(announcements.isActive, true),
    orderBy: [desc(announcements.createdAt)],
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-gray-950 pt-16 md:pt-20">
        <section className="relative bg-[#007848] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
          </div>
          <div className="relative max-w-7xl mx-auto px-6 pt-4 pb-16 md:py-20 text-center">
            <p className="text-green-300 text-sm font-semibold uppercase tracking-widest mb-3">San Pablo Colleges</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">Announcements</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Official announcements and updates from the Student Affairs and Services Office.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-7xl mx-auto">
          <AnnouncementCards announcements={allAnnouncements} />
        </section>
        <Footer />
      </main>
    </>
  );
}
