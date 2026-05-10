import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaGraduationCap, FaEye, FaBullseye, FaHeart, FaHandshake,
  FaSearch, FaLightbulb, FaUserFriends, FaUsers, FaClinicMedical,
  FaChurch, FaRunning, FaMapMarkerAlt, FaClock, FaEnvelope, FaPhone
} from "react-icons/fa";

const goals = [
  { title: "Holistic Activities", desc: "To organize holistic activities for the spiritual, intellectual, social, emotional, and physical development of the students.", icon: FaHeart },
  { title: "Coordination", desc: "To coordinate with academic departments in carrying out extra and co-curricular activities of students.", icon: FaHandshake },
  { title: "Evaluation", desc: "To evaluate the effects of extra and co-curricular activities on students' development inside and outside the classroom.", icon: FaSearch },
  { title: "Recommendations", desc: "To recommend changes and improvements to students' extra and co-curricular activities.", icon: FaLightbulb },
];

const units = [
  { name: "Guidance Office", icon: FaUserFriends },
  { name: "Student Formation and Development Unit (SFDU)", icon: FaUsers },
  { name: "School Clinic", icon: FaClinicMedical },
  { name: "Campus Ministry", icon: FaChurch },
  { name: "Sports Development Unit", icon: FaRunning },
];

const officeInfo = [
  { label: "Location", value: ["Student Affairs Office, Second Floor", "Eala Building"], icon: FaMapMarkerAlt },
  { label: "Office Hours", value: ["Monday - Saturday", "8:00 AM - 5:00 PM"], icon: FaClock },
  { label: "Email", value: ["saso@sanpablocolleges.edu.ph"], icon: FaEnvelope },
  { label: "Phone", value: ["(049) 123-4567 loc. 205"], icon: FaPhone },
];

export default function AboutPage() {
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
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
              <FaGraduationCap className="text-green-200 text-lg" />
              <span className="text-green-200 text-sm font-semibold uppercase tracking-widest">San Pablo Colleges</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight animate-fade-in">
              Student Affairs and <br className="hidden md:block" />Services Office
            </h1>
            <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in">
              The Student Affairs and Services Office — dedicated to your holistic development and success.
            </p>
            <div className="mt-8 flex justify-center gap-3 animate-fade-in">
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Units of SASO</h2>
                <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {units.map(({ name, icon: Icon }) => (
                  <div key={name} className="group flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    <div className="p-3 bg-[#007848]/10 rounded-xl group-hover:bg-[#007848] transition-colors duration-300">
                      <Icon className="text-lg text-[#007848] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-[#007848] transition-colors duration-300">{name}</span>
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
