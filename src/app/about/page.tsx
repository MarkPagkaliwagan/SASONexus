import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { sasoUnits, staffAccounts, positions } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import {
  FaGraduationCap, FaEye, FaBullseye, FaHeart, FaHandshake,
  FaSearch, FaLightbulb, FaUserFriends, FaUsers, FaClinicMedical,
  FaChurch, FaRunning, FaMapMarkerAlt, FaClock, FaEnvelope, FaPhone,
  FaEnvelope as FaEnvelopeIcon, FaPhoneAlt
} from "react-icons/fa";

const goals = [
  { title: "Holistic Activities", desc: "To organize holistic activities for the spiritual, intellectual, social, emotional, and physical development of the students.", icon: FaHeart },
  { title: "Coordination", desc: "To coordinate with academic departments in carrying out extra and co-curricular activities of students.", icon: FaHandshake },
  { title: "Evaluation", desc: "To evaluate the effects of extra and co-curricular activities on students' development inside and outside the classroom.", icon: FaSearch },
  { title: "Recommendations", desc: "To recommend changes and improvements to students' extra and co-curricular activities.", icon: FaLightbulb },
];

const officeInfo = [
  { label: "Location", value: ["Student Affairs Office, Second Floor", "Eala Building"], icon: FaMapMarkerAlt },
  { label: "Office Hours", value: ["Monday - Saturday", "8:00 AM - 5:00 PM"], icon: FaClock },
  { label: "Email", value: ["saso@sanpablocolleges.edu.ph"], icon: FaEnvelope },
  { label: "Phone", value: ["(049) 123-4567 loc. 205"], icon: FaPhone },
];

async function getUnitsWithStaff() {
  const units = await db
    .select()
    .from(sasoUnits)
    .orderBy(asc(sasoUnits.name));

  const result = [];
  for (const unit of units) {
    const staff = await db
      .select({
        id: staffAccounts.id,
        name: staffAccounts.name,
        email: staffAccounts.email,
        avatarUrl: staffAccounts.avatarUrl,
        positionName: positions.name,
      })
      .from(staffAccounts)
      .leftJoin(positions, eq(staffAccounts.positionId, positions.id))
      .where(
        and(
          eq(staffAccounts.unitId, unit.id),
          eq(staffAccounts.isActive, true),
        ),
      )
      .orderBy(asc(staffAccounts.name));

    result.push({ ...unit, staff });
  }
  return result;
}

export default async function AboutPage() {
  const unitsWithStaff = await getUnitsWithStaff();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-16 md:pt-20">
        <section className="relative bg-gradient-to-br from-[#007848] via-[#008f56] to-[#00a864] overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <FaGraduationCap className="text-green-200 text-lg" />
              <span className="text-green-200 text-sm font-semibold uppercase tracking-widest">San Pablo Colleges</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Student Affairs and <br className="hidden md:block" />Services Office
            </h1>
            <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              The Student Affairs and Services Office — dedicated to your holistic development and success.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Office Overview</h2>
              <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full mb-8" />
              <p className="text-gray-600 leading-relaxed mb-4 max-w-3xl mx-auto text-lg">
                The Student Affairs and Services Office (SASO) is a vital unit of San Pablo Colleges
                dedicated to providing comprehensive support services that enhance the holistic development
                of students. We are committed to creating a nurturing environment that fosters academic
                excellence, personal growth, and social responsibility.
              </p>
              <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto text-lg">
                Our office serves as the primary liaison between students and the institution,
                ensuring that student concerns are addressed promptly and effectively while promoting
                a positive campus culture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              <div className="group relative bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#007848]/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-[#007848]/10 transition-colors duration-300" />
                <FaEye className="text-[#007848] text-3xl mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-[#007848] mb-4">Vision</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  A support system committed to delivering high-quality and excellent school services
                  based on the Christian Catholic outlook.
                </p>
              </div>
              <div className="group relative bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#007848]/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-[#007848]/10 transition-colors duration-300" />
                <FaBullseye className="text-[#007848] text-3xl mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-[#007848] mb-4">Mission</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To provide students with activities that will enrich/enhance them into a total person
                  inside and outside the classroom setting.
                </p>
              </div>
            </div>

            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">SASO Goals</h2>
                <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map(({ title, desc, icon: Icon }) => (
                  <div key={title} className="group bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-[#007848]/10 rounded-xl group-hover:bg-[#007848] transition-colors duration-300">
                        <Icon className="text-xl text-[#007848] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800">{title}</h4>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Units of SASO and Personnel</h2>
                <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full" />
              </div>
              <div className="space-y-8">
                {unitsWithStaff.map((unit) => (
                  <div key={unit.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#007848]/5 to-[#00a864]/5 border-b border-gray-100">
                      <div className="p-2.5 bg-[#007848]/10 rounded-xl">
                        <FaUsers className="text-lg text-[#007848]" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">{unit.name}</h3>
                    </div>
                    {unit.staff.length > 0 ? (
                      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unit.staff.map((person) => (
                          <div key={person.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:border-[#007848]/20 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#007848]/10 flex items-center justify-center shrink-0">
                              {person.avatarUrl ? (
                                <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-sm font-bold text-[#007848]">{person.name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-gray-800 truncate">{person.name}</p>
                              <p className="text-xs text-[#007848] font-medium truncate">{person.positionName || "Staff"}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <FaEnvelopeIcon className="text-[10px] text-gray-400" />
                                <span className="text-[11px] text-gray-500 truncate">{person.email}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-sm text-gray-400">No personnel assigned yet</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 md:py-24 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Office Information</h2>
            <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full mb-12" />
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {officeInfo.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="group flex items-start gap-4 text-left">
                    <div className="p-3 bg-[#007848]/10 rounded-xl flex-shrink-0 group-hover:bg-[#007848] transition-colors duration-300">
                      <Icon className="text-xl text-[#007848] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">{label}</h4>
                      {value.map((line, i) => (
                        <p key={i} className="text-gray-600">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
