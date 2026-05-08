import Link from "next/link";
import { db } from "@/db";
import { students, preAdmissions, academicYears } from "@/db/schema";
import { AdmissionList } from "@/components/admin/admission/AdmissionList";
import { FiCalendar, FiBook, FiLayers, FiClock, FiArrowRight } from "react-icons/fi";

const sections = [
  { href: "/portal/admin/admission/academic-years", label: "Academic Years", desc: "Manage academic years and semesters", icon: FiCalendar },
  { href: "/portal/admin/admission/courses", label: "College Courses", desc: "Manage college program offerings", icon: FiBook },
  { href: "/portal/admin/admission/strands", label: "SHS Strands", desc: "Manage senior high school strands", icon: FiLayers },
  { href: "/portal/admin/admission/schedules", label: "Schedules", desc: "Manage admission schedule slots", icon: FiClock },
];

export default async function AdmissionPage() {
  const [items, preAdmissionList, academicYearList] = await Promise.all([
    db.query.students.findMany({
      orderBy: (s, { desc }) => [desc(s.enrolledAt)],
    }),
    db.query.preAdmissions.findMany(),
    db.query.academicYears.findMany({
      orderBy: (y, { desc }) => [desc(y.year)],
    }),
  ]);
  const preAdmissionMap = Object.fromEntries(
    preAdmissionList.map((p) => [p.id, p])
  );
  const academicYearOptions = academicYearList.map((y) => y.year);

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <span>Admission</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admission Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage reference data for the pre-admission application form.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.href} href={s.href} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-[#007848] dark:hover:border-[#00a35e] hover:shadow-lg hover:shadow-[#007848]/5 dark:hover:shadow-[#00a35e]/5 transition-all duration-200 cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-[#007848]/10 dark:bg-[#007848]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#007848] dark:group-hover:bg-[#007848] transition-colors duration-200">
                  <Icon className="text-xl text-[#007848] dark:text-[#00a35e] group-hover:text-white transition-colors duration-200" />
                </div>
                <FiArrowRight className="text-gray-300 dark:text-gray-600 group-hover:text-[#007848] dark:group-hover:text-[#00a35e] group-hover:translate-x-1 transition-all duration-200" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{s.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
            </Link>
          );
        })}
      </div>

      <AdmissionList students={items} preAdmissionMap={preAdmissionMap} academicYearOptions={academicYearOptions} />
    </>
  );
}
