import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    title: "Admission Services",
    description: "Facilitates the admission process for incoming freshmen, transferees, and graduate students. Provides assistance with enrollment procedures, document evaluation, and student records management.",
    features: ["Application Processing", "Document Verification", "Enrollment Assistance", "Student Records"],
  },
  {
    title: "Guidance and Counseling",
    description: "Provides professional counseling services to help students address academic, personal, social, and career-related concerns through individual and group counseling sessions.",
    features: ["Individual Counseling", "Group Counseling", "Psychological Testing", "Crisis Intervention"],
  },
  {
    title: "Student Activities",
    description: "Organizes and supports extracurricular activities, student organizations, and leadership development programs that enhance the student experience.",
    features: ["Organization Recognition", "Activity Planning", "Leadership Training", "Event Management"],
  },
  {
    title: "Scholarship Programs",
    description: "Administers various scholarship and financial assistance programs to support deserving students in their academic pursuits.",
    features: ["Scholarship Application", "Financial Aid", "Grant Processing", "Student Support"],
  },
  {
    title: "Career Services",
    description: "Provides career guidance, job placement assistance, and internship coordination to help students transition from academic life to professional careers.",
    features: ["Career Counseling", "Job Placement", "Internship Programs", "Career Fairs"],
  },
  {
    title: "Student Discipline",
    description: "Implements the student code of conduct and handles disciplinary cases to maintain a safe and conducive learning environment for all students.",
    features: ["Code of Conduct", "Disciplinary Procedures", "Conflict Resolution", "Grievance Handling"],
  },
];

const units = [
  {
    title: "Guidance Office",
    description: "Provides academic, personal, and career guidance to help students make informed decisions and achieve their full potential.",
    features: ["Academic Guidance", "Personal Counseling", "Career Planning", "Testing Services"],
  },
  {
    title: "Student Formation and Development Unit (SFDU)",
    description: "Facilitates holistic student development through formation programs, values education, and character-building activities.",
    features: ["Formation Programs", "Values Education", "Character Building", "Student Development"],
  },
  {
    title: "School Clinic",
    description: "Provides basic healthcare services, emergency care, and health education to promote the well-being of students and staff.",
    features: ["Basic Healthcare", "Emergency Care", "Health Education", "Medical Records"],
  },
  {
    title: "Campus Ministry",
    description: "Nurtures spiritual growth and development through religious activities, retreats, and community service programs.",
    features: ["Spiritual Activities", "Retreats", "Community Service", "Religious Education"],
  },
  {
    title: "Sports Development Unit",
    description: "Promotes physical fitness and sports excellence through athletic programs, sports clinics, and inter-collegiate competitions.",
    features: ["Athletic Programs", "Sports Clinics", "Competitions", "Fitness Training"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-20">
        <section className="bg-[#007848] text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Comprehensive support services designed to enhance student success and development.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-[#007848]/20">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <div className="space-y-2">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#007848] rounded-full"></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#007848]/5 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Need Assistance?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our office is here to support you. Visit us during office hours or contact us through the information below.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="font-semibold text-gray-800 mb-2">Visit Us</h4>
                <p className="text-sm text-gray-600">Student Affairs Office<br/>San Pablo Colleges</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="font-semibold text-gray-800 mb-2">Email Us</h4>
                <p className="text-sm text-gray-600">saso@sanpablocolleges.edu.ph</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="font-semibold text-gray-800 mb-2">Call Us</h4>
                <p className="text-sm text-gray-600">(049) 123-4567 loc. 205</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-yellow-600 text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Units</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Dedicated units committed to providing specialized services for student welfare and development.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {units.map((unit) => (
              <div key={unit.title} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-[#1a365d]/20">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{unit.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{unit.description}</p>
                <div className="space-y-2">
                  {unit.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1a365d] rounded-full"></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
