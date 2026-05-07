import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AnnouncementPage() {
  const announcements = [
    {
      date: "May 15, 2026",
      title: "Enrollment for Academic Year 2026-2027 Now Open",
      category: "Enrollment",
      content: "The Student Affairs Office announces the opening of enrollment for the upcoming academic year. All continuing students are advised to settle their accounts and complete their enrollment requirements before the deadline.",
      isNew: true,
    },
    {
      date: "May 10, 2026",
      title: "Schedule of Comprehensive Examinations",
      category: "Academics",
      content: "The schedule for comprehensive examinations for graduating students has been released. Please check the examination portal for your assigned date, time, and venue.",
      isNew: true,
    },
    {
      date: "May 5, 2026",
      title: "Student Organization Recognition Week",
      category: "Activities",
      content: "The annual Student Organization Recognition Week will be held from May 20-24, 2026. All recognized student organizations are required to participate in the activities.",
      isNew: false,
    },
    {
      date: "May 1, 2026",
      title: "Scholarship Application Deadline Extended",
      category: "Scholarship",
      content: "The deadline for scholarship applications has been extended until May 30, 2026. Interested students may submit their requirements to the Student Affairs Office.",
      isNew: false,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="bg-[#007848] text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Announcements</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Official announcements and updates from the Student Affairs and Services Office.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <span className="text-sm text-gray-500">{announcement.date}</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full w-fit ${
                    announcement.category === "Enrollment" ? "bg-blue-100 text-blue-700" :
                    announcement.category === "Academics" ? "bg-purple-100 text-purple-700" :
                    announcement.category === "Activities" ? "bg-orange-100 text-orange-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {announcement.category}
                  </span>
                  {announcement.isNew && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full w-fit">
                      New
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{announcement.title}</h3>
                <p className="text-gray-600 leading-relaxed">{announcement.content}</p>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
