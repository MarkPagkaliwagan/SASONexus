import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16 md:pt-20">
        <section className="relative bg-[#007848] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-6 pt-4 pb-16 md:py-20 text-center">
            <p className="text-green-300 text-sm font-semibold uppercase tracking-widest mb-3">San Pablo Colleges</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">About Our Office</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              The Student Affairs and Services Office — dedicated to your holistic development and success.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Office Overview</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The Student Affairs and Services Office (SASO) is a vital unit of San Pablo Colleges
                dedicated to providing comprehensive support services that enhance the holistic development
                of students. We are committed to creating a nurturing environment that fosters academic
                excellence, personal growth, and social responsibility.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our office serves as the primary liaison between students and the institution,
                ensuring that student concerns are addressed promptly and effectively while promoting
                a positive campus culture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-[#007848]/5 p-8 rounded-xl border border-[#007848]/10">
                <h3 className="text-2xl font-bold text-[#007848] mb-4">Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To provide quality student services that promote holistic development, academic
                  success, and meaningful campus life experiences through innovative programs and
                  responsive support systems.
                </p>
              </div>
              <div className="bg-[#007848]/5 p-8 rounded-xl border border-[#007848]/10">
                <h3 className="text-2xl font-bold text-[#007848] mb-4">Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  To be a center of excellence in student affairs and services, producing
                  well-rounded professionals who are competent, compassionate, and socially
                  responsible members of society.
                </p>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Core Values</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Integrity", desc: "Upholding honesty and ethical standards" },
                  { title: "Excellence", desc: "Striving for the highest quality in service" },
                  { title: "Compassion", desc: "Showing genuine care and understanding" },
                  { title: "Innovation", desc: "Embracing new ideas and approaches" },
                ].map((value) => (
                  <div key={value.title} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                    <h4 className="text-lg font-semibold text-[#007848] mb-2">{value.title}</h4>
                    <p className="text-gray-600 text-sm">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Admission and Registration Services",
                  "Guidance and Counseling Services",
                  "Student Activities and Organizations",
                  "Scholarship and Financial Assistance",
                  "Career Guidance and Placement",
                  "Student Discipline and Grievance Handling",
                  "Health and Wellness Programs",
                  "Student Leadership Development",
                ].map((service) => (
                  <div key={service} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <div className="w-2 h-2 bg-[#007848] rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Office Information</h2>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Location</h4>
                  <p className="text-gray-600">Student Affairs Office, Second Floor<br/>San Pablo Colleges</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Office Hours</h4>
                  <p className="text-gray-600">Monday - Saturday: 8:00 AM - 5:00 PM</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                  <p className="text-gray-600">saso@sanpablocolleges.edu.ph</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                  <p className="text-gray-600">(049) 123-4567 loc. 205</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
