"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaUserFriends, FaUsers, FaClinicMedical, FaChurch, FaRunning,
  FaBook, FaStar, FaCheck, FaCheckCircle, FaTimes, FaArrowRight, FaArrowLeft, FaUpload, FaClock
} from "react-icons/fa";

const units = [
  { name: "Guidance Office", icon: FaUserFriends },
  { name: "Student Formation and Development Unit (SFDU)", icon: FaUsers },
  { name: "School Clinic", icon: FaClinicMedical },
  { name: "Campus Ministry", icon: FaChurch },
  { name: "Sports Development Unit", icon: FaRunning },
];

export default function ServicesPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [interviewType, setInterviewType] = useState<"initial" | "exit" | null>(null);
  const [studentType, setStudentType] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [strand, setStrand] = useState("");
  const [section, setSection] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");

  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [strands, setStrands] = useState<{ id: number; name: string }[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);

  useEffect(() => {
    if (showModal) {
      fetch("/api/departments").then((r) => r.json()).then(setDepartments);
      fetch("/api/strands").then((r) => r.json()).then(setStrands);
    }
  }, [showModal]);

  useEffect(() => {
    if (department) {
      fetch(`/api/courses?department=${encodeURIComponent(department)}`)
        .then((r) => r.json()).then(setCourses);
    } else {
      setCourses([]);
    }
  }, [department]);

  useEffect(() => {
    if (!showModal || !interviewType) return;
    const scheduleStep = interviewType === "initial" ? 3 : 4;
    if (step === scheduleStep) {
      fetch(`/api/interview-schedules?type=${interviewType}`)
        .then((r) => r.json()).then(setSchedules);
      setSelectedSchedule(null);
    }
  }, [step, showModal, interviewType]);

  const totalSteps = interviewType === "initial" ? 3 : interviewType === "exit" ? 4 : 1;
  const stepLabels = interviewType === "initial"
    ? ["Type", "Details", "Schedule"]
    : interviewType === "exit"
    ? ["Type", "Level", "Details", "Schedule"]
    : ["Type"];

  const resetModal = () => {
    setShowModal(false);
    setStep(1);
    setInterviewType(null);
    setStudentType("");
    setAcademicLevel("");
    setFullName("");
    setStudentId("");
    setEmail("");
    setContact("");
    setGradeLevel("");
    setStrand("");
    setSection("");
    setDepartment("");
    setCourse("");
    setSchedules([]);
    setSelectedSchedule(null);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

  const ModalProgress = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        {stepLabels.map((label, i) => (
          <span key={label} className={`text-xs font-medium transition-colors ${step === i + 1 ? "text-[#007848]" : step > i + 1 ? "text-[#007848]/60" : "text-gray-400"}`}>
            {label}
          </span>
        ))}
      </div>
      <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#007848] to-[#00a864] rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={resetModal}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Schedule for Interview</h3>
            <button onClick={resetModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <FaTimes className="text-gray-400" />
            </button>
          </div>
          <div className="p-5">
            <ModalProgress />

            {step === 1 && (
              <div>
                <p className="text-sm text-gray-600 mb-4">Select the type of interview you need:</p>
                <div className="space-y-3">
                  <button
                    onClick={() => { setInterviewType("initial"); setStudentType(""); }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                      interviewType === "initial" ? "border-[#007848] bg-[#007848]/5" : "border-gray-200 hover:border-[#007848]/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <FaUserFriends className="text-blue-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Initial Interview</span>
                        <p className="text-xs text-gray-500 mt-0.5">For freshmen and transferees</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setInterviewType("exit"); setStudentType(""); nextStep(); }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                      interviewType === "exit" ? "border-[#007848] bg-[#007848]/5" : "border-gray-200 hover:border-[#007848]/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        <FaStar className="text-orange-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Exit Interview</span>
                        <p className="text-xs text-gray-500 mt-0.5">For graduating students (Gr6, Gr10, Gr12, College)</p>
                      </div>
                    </div>
                  </button>
                </div>

                {interviewType === "initial" && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-3">Select your student type:</p>
                    <div className="space-y-3">
                      {["Freshmen", "Transferee"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setStudentType(type)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                            studentType === type ? "border-[#007848] bg-[#007848]/5" : "border-gray-200 hover:border-[#007848]/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                              <FaUsers className="text-green-600" />
                            </div>
                            <span className="font-semibold text-gray-800">{type}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={nextStep}
                        disabled={!studentType}
                        className="px-5 py-2 bg-[#007848] text-white text-sm font-medium rounded-lg hover:bg-[#005f3a] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        Next <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && interviewType === "exit" && (
              <div>
                <p className="text-sm text-gray-600 mb-4">Select your current level:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "GS", label: "Grade School", sub: "Gr6" },
                    { value: "JHS", label: "Junior High", sub: "Gr10" },
                    { value: "SHS", label: "Senior High", sub: "Gr12" },
                    { value: "college", label: "College", sub: "Graduating" },
                  ].map(({ value, label, sub }) => (
                    <button
                      key={value}
                      onClick={() => { setStudentType(value); nextStep(); }}
                      className="text-center p-4 rounded-xl border-2 border-gray-200 hover:border-[#007848]/30 transition-all cursor-pointer group"
                    >
                      <span className="font-semibold text-gray-800 block">{label}</span>
                      <span className="text-xs text-gray-500">{sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {((step === 2 && interviewType === "initial") || (step === 3 && interviewType === "exit")) && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Please provide your personal details:</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007848]/20 focus:border-[#007848] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter your student ID"
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007848]/20 focus:border-[#007848] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007848]/20 focus:border-[#007848] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact No.</label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="09XXXXXXXXX"
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007848]/20 focus:border-[#007848] outline-none"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {(studentType === "GS" || studentType === "JHS" || academicLevel === "GS" || academicLevel === "JHS") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      placeholder="Enter your section"
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007848]/20 focus:border-[#007848] outline-none"
                    />
                  </div>
                )}

                {(studentType === "SHS" || academicLevel === "SHS") && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                        <select
                          value={gradeLevel}
                          onChange={(e) => setGradeLevel(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007848]/20 focus:border-[#007848] outline-none"
                        >
                          <option value="">Select</option>
                          <option value="Grade 11">Grade 11</option>
                          <option value="Grade 12">Grade 12</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Strand</label>
                        <select
                          value={strand}
                          onChange={(e) => setStrand(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007848]/20 focus:border-[#007848] outline-none"
                        >
                          <option value="">Select</option>
                          {strands.map((s) => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                      <input
                        type="text"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="Enter your section"
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007848]/20 focus:border-[#007848] outline-none"
                      />
                    </div>
                  </div>
                )}

                {(studentType === "college" || academicLevel === "college") && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                          value={department}
                          onChange={(e) => { setDepartment(e.target.value); setCourse(""); }}
                          className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007848]/20 focus:border-[#007848] outline-none"
                        >
                          <option value="">Select department</option>
                          {departments.map((d) => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                        <select
                          value={course}
                          onChange={(e) => setCourse(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007848]/20 focus:border-[#007848] outline-none"
                          disabled={!department}
                        >
                          <option value="">Select course</option>
                          {courses.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                    </div>
                  </div>
                )}

                {studentType === "Freshmen" || studentType === "Transferee" ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Current Level</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "GS", label: "Grade School" },
                        { value: "JHS", label: "Junior High" },
                        { value: "SHS", label: "Senior High" },
                        { value: "college", label: "College" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setAcademicLevel(value)}
                          className={`text-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                            academicLevel === value ? "border-[#007848] bg-[#007848]/5" : "border-gray-200 hover:border-[#007848]/30"
                          }`}
                        >
                          <span className="font-semibold text-gray-800 text-sm">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex justify-between pt-2">
                  <button onClick={prevStep} className="px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2">
                    <FaArrowLeft className="text-xs" /> Back
                  </button>
                  <button onClick={nextStep} className="px-5 py-2 bg-[#007848] text-white text-sm font-medium rounded-lg hover:bg-[#005f3a] transition-colors cursor-pointer flex items-center gap-2">
                    Next <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            )}

            {((step === 3 && interviewType === "initial") || (step === 4 && interviewType === "exit")) && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Select your preferred schedule:</p>
                {schedules.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
                    <FaClock className="mx-auto text-3xl text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm font-medium">No schedules available</p>
                    <p className="text-xs text-gray-400 mt-1">Schedules will be available once posted by the admin.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {schedules.map((s) => {
                      const available = s.slots - s.booked;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSchedule(s.id)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedSchedule === s.id
                              ? "border-[#007848] bg-[#007848]/5"
                              : "border-gray-200 hover:border-[#007848]/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-gray-800 text-sm">{s.title}</span>
                              <div className="flex gap-3 mt-1">
                                <span className="text-xs text-gray-500">{s.date}</span>
                                <span className="text-xs text-gray-500">{s.timeStart} - {s.timeEnd}</span>
                              </div>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              available <= 3 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                            }`}>
                              {available} left
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="flex justify-between pt-2">
                  <button onClick={prevStep} className="px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2">
                    <FaArrowLeft className="text-xs" /> Back
                  </button>
                  <button
                    disabled={!selectedSchedule}
                    className={`px-5 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                      selectedSchedule
                        ? "bg-[#007848] text-white hover:bg-[#005f3a] cursor-pointer"
                        : "bg-gray-300 text-white cursor-not-allowed"
                    }`}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16 md:pt-20">
        <section className="bg-gradient-to-br from-[#007848] via-[#008f56] to-[#00a864] text-white pt-4 pb-16 md:py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Comprehensive support services designed to enhance student success and development.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Student Affairs & Services Office</h2>
            <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full" />
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex">
                <div className="w-2 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
                <div className="p-6 md:p-8 flex-1">
                   <div className="flex items-start gap-3 mb-4">
                    <div className="p-3 bg-[#007848]/10 rounded-xl">
                      <FaUserFriends className="text-xl text-[#007848]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">Guidance and Career Services Unit</h3>
                      <p className="text-xs text-gray-500 font-medium tracking-wider">GCSU</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setShowModal(true); }, 600); }}
                        disabled={loading}
                        className="px-4 py-1.5 bg-[#007848] text-white text-xs font-medium rounded-md hover:bg-[#005f3a] transition-colors cursor-pointer whitespace-nowrap border border-[#007848] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        {loading ? (
                          <><svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Loading...</>
                        ) : (
                          <><FaClock className="text-[10px]" /> Schedule for Interview</>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Facilitates the process of acquiring the self-actualization of the student in his/her pursuit of becoming a fully functioning individual blessed with intellectual, emotional, spiritual, and social strengths.
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">To attain its goals the following services are offered:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        "Counseling",
                        "Testing and Measurement and Individual Appraisal Services",
                        "Information Service/Enrichment Program",
                        "Peer Facilitators Program",
                      ].map((service) => (
                        <div key={service} className="flex items-start gap-2">
                          <div className="mt-1 p-1 bg-[#007848]/10 rounded-full">
                            <FaCheck className="text-[8px] text-[#007848]" />
                          </div>
                          <span className="text-gray-700 text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">
                    Located on the Second Floor of Eala Bldg., the Guidance and Counseling Office has a centralized organization set up which caters to all the levels of the institution.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex">
                <div className="w-2 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#007848]/10 rounded-xl">
                      <FaUsers className="text-xl text-[#007848]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Student Formation and Development Unit</h3>
                      <p className="text-xs text-gray-500 font-medium tracking-wider">SFDU</p>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">Student Activities</h4>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    SPC provides wholesome activities and opportunities for students to enhance their skills in the following areas:
                  </p>
                  <div className="mb-4 pl-4">
                    <p className="text-gray-700 text-sm mb-1">a. Co-Curricular Program</p>
                    <p className="text-gray-700 text-sm mb-3">b. Extra-Curricular Program</p>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    SPC believes that the educational development of students shall not be limited to the four corners of the classroom. They shall be encouraged to involve themselves in co-curricular and extra-curricular activities to foster social attitudes of cooperation, responsibility, creativity, and leadership.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Unit credits shall be given to students who participate in co-curricular and extra-curricular activities as part of the grading criteria.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex">
                <div className="w-2 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#007848]/10 rounded-xl">
                      <FaClinicMedical className="text-xl text-[#007848]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Medical and Dental Clinics</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Protects, maintains, and promotes the health of school children, adolescents, collegiate students, and personnel to attain the maximum state of well-being. This concern is through the cooperative effort of the Medical and Dental team.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Situated near the Food Laboratory are these two auxiliary services of the OSA. Both clinics shall be responsible for the timely medical aid as well as the maintenance of proper dental health for the school population during official working hours.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Staffed by a full-time physician and a dentist with their respective clerks, the clinics are open daily from 7:00 a.m. to 8:00 p.m. and 8:00 to 5:00 p.m. on Saturdays.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    A part of the school is the San Pablo Colleges Medical Center (SPCMC). It is designed to serve the medical needs of the SPC Community and to provide a place for actual training for its medical courses. All students are granted a 10% discount on their hospitalization for room and board.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex">
                <div className="w-2 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#007848]/10 rounded-xl">
                      <FaChurch className="text-xl text-[#007848]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Youth Campus Ministry</h3>
                      <p className="text-xs text-gray-500 font-medium tracking-wider">YCM</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Implements the institutionalized religious/spiritual activities and programs of the college for students to become better Christians.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Education and personality development include spiritual formation. Religious education cannot be excluded from wholesome and complete personality development. Important for the student's life is that he/she not only develops his/her intellectual ability but that he/she also grows as a person who knows his/her responsibilities to God and his/her community.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Such a unit is designed to increase the faith of the community so that each student would become a better Christian through different spiritual activities such as:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {[
                      "Retreats, Recollection",
                      "Catholic Life in the Spirit Seminar (CLSS)",
                      "Masses",
                      "Novenas",
                      "Christ Youth in Action (CYA)",
                      "Other related church activities",
                    ].map((activity) => (
                      <div key={activity} className="flex items-start gap-2">
                        <div className="mt-1 p-1 bg-[#007848]/10 rounded-full">
                          <FaCheck className="text-[8px] text-[#007848]" />
                        </div>
                        <span className="text-gray-700 text-sm">{activity}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Concerning this, a College Chaplain or laypersons may also be consulted for spiritual advice.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex">
                <div className="w-2 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#007848]/10 rounded-xl">
                      <FaRunning className="text-xl text-[#007848]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Sports Development Program</h3>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-800 text-sm mb-3">Eligibility Discount</h4>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#007848]/10">
                          <th className="text-left p-2 font-semibold text-gray-700">Category</th>
                          <th className="text-left p-2 font-semibold text-gray-700">Requirement</th>
                          <th className="text-left p-2 font-semibold text-gray-700">Discount</th>
                          <th className="text-left p-2 font-semibold text-gray-700">Perks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { cat: "Team", req: "No failing grades", disc: "5%-100% discount on TF", perks: "With allowance and free uniform and seminar" },
                          { cat: "Dual", req: "No failing grades", disc: "5%-50% discount on TF", perks: "With allowance and free uniform and seminar" },
                          { cat: "Individual", req: "No failing grades", disc: "5%-50% discount on TF", perks: "With allowance and free uniform and seminar" },
                        ].map((row) => (
                          <tr key={row.cat} className="border-t border-gray-100">
                            <td className="p-2 font-medium text-gray-800">{row.cat}</td>
                            <td className="p-2 text-gray-600">{row.req}</td>
                            <td className="p-2 text-gray-600">{row.disc}</td>
                            <td className="p-2 text-gray-600">{row.perks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h4 className="font-semibold text-gray-800 text-sm mb-3">Discount Privileges for Siblings</h4>
                  <p className="text-gray-600 leading-relaxed text-sm mb-3">
                    Siblings shall be granted discount privileges. Discounts shall be given to the member with the lowest fee.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#007848]/10">
                          <th className="text-left p-2 font-semibold text-gray-700">Eligibility</th>
                          <th className="text-left p-2 font-semibold text-gray-700">Discount In charge</th>
                          <th className="text-left p-2 font-semibold text-gray-700">Discount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { elig: "Three (3) enrolled siblings", charge: "Youngest among sibling", disc: "25% discount on TF" },
                          { elig: "Four (4) enrolled siblings", charge: "Youngest among sibling", disc: "50% discount on TF" },
                        ].map((row) => (
                          <tr key={row.elig} className="border-t border-gray-100">
                            <td className="p-2 font-medium text-gray-800">{row.elig}</td>
                            <td className="p-2 text-gray-600">{row.charge}</td>
                            <td className="p-2 text-gray-600">{row.disc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#007848] text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Student Handbook | Pillars</h2>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Available Handbook</h2>
            <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full" />
          </div>
          <div className="space-y-6">
            {[
              { title: "College Handbook 2021-2026", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
              { title: "Senior High School Handbook 2022-2026", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
            ].map((hb) => (
              <div key={hb.title} className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex">
                  <div className="w-1.5 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-xs font-semibold rounded-full shadow-sm">
                        <FaBook className="text-[10px]" />
                        <span>Handbook</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#007848] transition-colors">{hb.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{hb.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Available Pillars</h2>
            <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full" />
          </div>
          <div className="space-y-6">
            {[
              { title: "AY 21-22", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
              { title: "AY 22-23", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
              { title: "AY 23-24", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
              { title: "AY 24-25", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
              { title: "AY 25-26", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
            ].map((pillar) => (
              <div key={pillar.title} className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex">
                  <div className="w-1.5 bg-gradient-to-b from-[#b8860b] to-[#ffc107] flex-shrink-0" />
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#b8860b] to-[#ffc107] text-white text-xs font-semibold rounded-full shadow-sm">
                        <FaStar className="text-[10px]" />
                        <span>Pillar</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#b8860b] transition-colors">{pillar.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{pillar.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {renderModal()}
        <Footer />
      </main>
    </>
  );
}
