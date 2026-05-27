import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { sasoUnits, personnel } from "@/db/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import {
  FaGraduationCap, FaEye, FaBullseye, FaHeart, FaHandshake,
  FaSearch, FaLightbulb, FaUserFriends, FaUsers,
  FaEnvelope as FaEnvelopeIcon, FaPhoneAlt, FaStar, FaQuoteLeft
} from "react-icons/fa";

const goals = [
  { title: "Holistic Activities", desc: "To organize holistic activities for the spiritual, intellectual, social, emotional, and physical development of the students.", icon: FaHeart },
  { title: "Coordination", desc: "To coordinate with academic departments in carrying out extra and co-curricular activities of students.", icon: FaHandshake },
  { title: "Evaluation", desc: "To evaluate the effects of extra and co-curricular activities on students' development inside and outside the classroom.", icon: FaSearch },
  { title: "Recommendations", desc: "To recommend changes and improvements to students' extra and co-curricular activities.", icon: FaLightbulb },
];

const unitIcons: Record<string, React.ComponentType> = {
  guidance: FaUsers,
  sfdu: FaUserFriends,
  clinic: FaHeart,
  ministry: FaStar,
  sports: FaUsers,
};

async function getUnitsWithStaff() {
  const sasoHead = await db
    .select({
      id: personnel.id, name: personnel.name, email: personnel.email,
      avatarUrl: personnel.avatarUrl, positionName: personnel.position,
      contact: personnel.contact,
    })
    .from(personnel)
    .where(and(eq(personnel.isHead, true), eq(personnel.isActive, true)))
    .limit(1);

  const units = await db
    .select()
    .from(sasoUnits)
    .orderBy(
      sql`CASE WHEN ${sasoUnits.slug} = 'guidance' THEN 0 ELSE 1 END`,
      asc(sasoUnits.name)
    );

  const result = [];
  for (const unit of units) {
    const staff = await db
      .select({
        id: personnel.id, name: personnel.name, email: personnel.email,
        avatarUrl: personnel.avatarUrl, positionName: personnel.position,
        contact: personnel.contact,
      })
      .from(personnel)
      .where(and(eq(personnel.unitId, unit.id), eq(personnel.isActive, true)))
      .orderBy(
        sql`CASE WHEN ${personnel.position} = 'Student Assistant' THEN 1 ELSE 0 END`,
        asc(personnel.name)
      );
    result.push({ ...unit, staff });
  }
  return { sasoHead: sasoHead[0] || null, unitsWithStaff: result };
}

function UnitIcon({ slug }: { slug: string }) {
  const Icon = unitIcons[slug] || FaUsers;
  return <Icon />;
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">{children}</div>;
}

export default async function AboutPage() {
  const { sasoHead, unitsWithStaff } = await getUnitsWithStaff();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-16 md:pt-20">

        {/* ── HERO ── */}
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

        {/* ── OFFICE OVERVIEW ── */}
        <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 text-center">
              <span className="text-[#007848] text-sm font-semibold uppercase tracking-[0.2em]">About Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-3 mb-4">Office Overview</h2>
              <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full mb-8" />
              <div className="relative">
                <FaQuoteLeft className="absolute -top-4 -left-2 text-[#007848]/10 text-5xl" />
                <p className="text-gray-600 leading-relaxed mb-4 max-w-3xl mx-auto text-lg pl-6 border-l-4 border-[#007848]/20 italic font-light">
                  The Student Affairs and Services Office (SASO) is a vital unit of San Pablo Colleges
                  dedicated to providing comprehensive support services that enhance the holistic development
                  of students. We are committed to creating a nurturing environment that fosters academic
                  excellence, personal growth, and social responsibility.
                </p>
                <p className="text-gray-500 leading-relaxed max-w-3xl mx-auto text-lg pl-6 font-light">
                  Our office serves as the primary liaison between students and the institution,
                  ensuring that student concerns are addressed promptly and effectively while promoting
                  a positive campus culture.
                </p>
              </div>
            </div>

            {/* ── VISION & MISSION ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              <SectionCard>
                <div className="group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#007848]/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-[#007848]/10 transition-colors duration-300" />
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#007848] to-[#00a864] rounded-xl flex items-center justify-center mb-5 shadow-md">
                      <FaEye className="text-white text-lg" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#007848] mb-4">Our Vision</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      A support system committed to delivering high-quality and excellent school services
                      based on the Christian Catholic outlook.
                    </p>
                  </div>
                </div>
              </SectionCard>
              <SectionCard>
                <div className="group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#007848]/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-[#007848]/10 transition-colors duration-300" />
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#007848] to-[#00a864] rounded-xl flex items-center justify-center mb-5 shadow-md">
                      <FaBullseye className="text-white text-lg" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#007848] mb-4">Our Mission</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      To provide students with activities that will enrich/enhance them into a total person
                      inside and outside the classroom setting.
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ── GOALS ── */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <span className="text-[#007848] text-sm font-semibold uppercase tracking-[0.2em]">What We Aim For</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-3 mb-4">SASO Goals</h2>
                <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map(({ title, desc, icon: Icon }, i) => (
                  <SectionCard key={title}>
                    <div className="group relative overflow-hidden">
                      <span className="text-5xl font-black text-gray-100 group-hover:text-[#007848]/5 transition-colors duration-500 absolute top-0 right-0 leading-none select-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-[#007848]/10 to-[#00a864]/10 rounded-xl group-hover:from-[#007848] group-hover:to-[#00a864] transition-all duration-500">
                          <Icon className="text-xl text-[#007848] group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">{title}</h4>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </SectionCard>
                ))}
              </div>
            </div>

            {/* ── SASO HEAD ── */}
            {sasoHead && (
              <div className="mb-28">
                <div className="text-center mb-16">
                  <span className="text-[#007848] text-sm font-semibold uppercase tracking-[0.2em]">Leadership</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-3 mb-4">SASO Head</h2>
                  <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full" />
                </div>
                <div className="max-w-5xl mx-auto">
                  <div className="relative bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#007848]/[0.04] to-transparent rounded-full -mr-32 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-[#00a864]/[0.04] to-transparent rounded-full -ml-24 -mb-24 pointer-events-none" />
                    <div className="relative flex flex-col md:flex-row">
                      <div className="md:w-80 shrink-0 h-72 md:h-auto overflow-hidden relative">
                        {sasoHead.avatarUrl ? (
                          <>
                            <img src={sasoHead.avatarUrl} alt={sasoHead.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#007848]/5 to-[#00a864]/5 flex items-center justify-center">
                            <span className="text-9xl font-bold text-[#007848]/10">{sasoHead.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                        <div className="space-y-1 mb-6">
                          <span className="inline-flex items-center gap-2 text-xs text-[#007848] font-semibold uppercase tracking-[0.2em]">
                            <span className="w-4 h-[2px] bg-[#007848] rounded-full" />
                            Office of the
                          </span>
                          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">{sasoHead.name}</h3>
                          <div className="flex items-center gap-3 pt-1.5">
                            <div className="h-[3px] w-8 bg-gradient-to-r from-[#007848] to-[#00a864] rounded-full" />
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-[#007848]/5 text-[#007848] border border-[#007848]/10">
                              {sasoHead.positionName || "SASO Head"}
                            </span>
                          </div>
                        </div>
                        <div className="relative pl-6 border-l-2 border-gray-100 mb-6">
                          <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-[#007848] -translate-x-[5px] ring-2 ring-[#007848]/10" />
                          <p className="text-gray-500 leading-relaxed text-[15px]">
                            The SASO Head oversees the strategic direction and daily operations of the Student Affairs
                            and Services Office, ensuring that all units deliver quality support services aligned with
                            the institution&apos;s mission and Catholic Christian values.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-5 pt-6 border-t border-gray-100">
                          {sasoHead.email && (
                            <a href={`mailto:${sasoHead.email}`} className="group/contact flex items-center gap-3.5">
                              <div className="w-11 h-11 rounded-xl bg-[#007848]/5 flex items-center justify-center group-hover/contact:bg-[#007848] transition-all duration-300">
                                <FaEnvelopeIcon className="text-sm text-[#007848] group-hover/contact:text-white transition-colors duration-300" />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.12em]">Email</p>
                                <p className="text-sm text-gray-600 group-hover/contact:text-[#007848] transition-colors">{sasoHead.email}</p>
                              </div>
                            </a>
                          )}
                          {sasoHead.contact && (
                            <a href={`tel:${sasoHead.contact}`} className="group/contact flex items-center gap-3.5">
                              <div className="w-11 h-11 rounded-xl bg-[#007848]/5 flex items-center justify-center group-hover/contact:bg-[#007848] transition-all duration-300">
                                <FaPhoneAlt className="text-sm text-[#007848] group-hover/contact:text-white transition-colors duration-300" />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.12em]">Contact</p>
                                <p className="text-sm text-gray-600 group-hover/contact:text-[#007848] transition-colors">{sasoHead.contact}</p>
                              </div>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── UNITS & PERSONNEL ── */}
            <div>
              <div className="text-center mb-12">
                <span className="text-[#007848] text-sm font-semibold uppercase tracking-[0.2em]">Per Unit</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-3 mb-4">Personnel</h2>
                <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full" />
              </div>
              <div className="space-y-6">
                {unitsWithStaff.map((unit) => (
                  <SectionCard key={unit.id}>
                    <div className="flex items-center gap-4 px-0 py-0 border-b border-gray-100 pb-4 mb-4">
                      <div className="w-11 h-11 bg-gradient-to-br from-[#007848]/10 to-[#00a864]/10 rounded-xl flex items-center justify-center shrink-0">
                        <div className="text-[#007848] text-lg"><UnitIcon slug={unit.slug} /></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800 truncate">{unit.name}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <span>{unit.staff.length}</span>
                        <span className="hidden sm:inline">{unit.staff.length === 1 ? "member" : "members"}</span>
                      </div>
                    </div>
                    {unit.staff.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unit.staff.map((person) => (
                          <div key={person.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#007848]/20 transition-all duration-300 group">
                            <div className="h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
                              {person.avatarUrl ? (
                                <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-5xl font-bold text-gray-300">{person.name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="p-4">
                              <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#007848] transition-colors">{person.name}</h4>
                              <p className="text-xs text-[#007848] font-medium mt-0.5">{person.positionName || "Staff"}</p>
                              {person.email && (
                                <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                                  <FaEnvelopeIcon className="text-[10px] shrink-0" />
                                  <span className="text-[11px] truncate">{person.email}</span>
                                </div>
                              )}
                              {person.contact && (
                                <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                                  <FaPhoneAlt className="text-[10px] shrink-0" />
                                  <span className="text-[11px] truncate">{person.contact}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center bg-gray-50/50 rounded-xl">
                        <FaUsers className="text-gray-200 text-3xl mx-auto mb-3" />
                        <p className="text-sm text-gray-400">No personnel assigned yet</p>
                      </div>
                    )}
                  </SectionCard>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
