"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramsOfferedSection from "@/components/ProgramsOfferedSection";

// ── Icons ──
import {
  FaUserGraduate, FaExchangeAlt, FaGlobeAmericas, FaGavel, FaGraduationCap,
  FaCheckCircle, FaCalendarAlt, FaChartBar, FaClock, FaChevronRight,
  FaShieldAlt, FaTimes,
} from "react-icons/fa";

// ── Types ──
interface RequirementGroup {
  title: string;
  items: string[];
}

interface Tab {
  id: string;
  label: string;
  icon: typeof FaUserGraduate;
}

interface Step {
  step: string;
  title: string;
  description: string;
}

interface OfficeHour {
  day: string;
  time: string;
}

// ── Data ──
const TABS: Tab[] = [
  { id: "freshmen", label: "Freshmen", icon: FaUserGraduate },
  { id: "transferees", label: "Transferees", icon: FaExchangeAlt },
  { id: "foreign", label: "Foreign Students", icon: FaGlobeAmericas },
  { id: "law", label: "Juris Doctor", icon: FaGavel },
  { id: "graduate", label: "Graduate School", icon: FaGraduationCap },
];

const REQUIREMENTS: Record<string, RequirementGroup[]> = {
  freshmen: [
    {
      title: "Admission Test",
      items: [
        "Applicants should take the SPC Admission Test (SPCAT)",
        "SPCAT Result",
      ],
    },
    {
      title: "Academic Documents",
      items: [
        "Original and Photocopy of Form 138 (SHS Grade 12 Card)",
        "Original and Photocopy of Form 137 (JHS Grade 7-10 Student Permanent Record)",
        "National Career Assessment Examination (NCAE) result, if any",
      ],
    },
    {
      title: "Personal Documents",
      items: [
        "Four (4) 2x2 ID pictures - colored, white background, with name tag",
        "Certificate of Good Moral Character signed by SHS Principal/Guidance Counselor",
        "PSA authenticated Birth Certificate (or one issued by the Local Civil Registrar if not readable)",
        "For female married applicants: Photocopy of PSA authenticated Marriage Contract",
      ],
    },
  ],
  transferees: [
    {
      title: "Admission Test",
      items: [
        "Applicants should take the SPC Admission Test (SPCAT)",
        "SPCAT Result",
      ],
    },
    {
      title: "Academic Documents",
      items: [
        "Transfer Credential Form (Honorable Dismissal Form)",
        "Certification of Grades for evaluation purposes",
        "Original Transcript of Records with remark 'Copy for San Pablo Colleges'",
      ],
    },
    {
      title: "Personal Documents",
      items: [
        "Certification of Good Moral Character",
        "PSA authenticated Birth Certificate",
        "For female married applicants: Photocopy of PSA authenticated Marriage Contract",
      ],
    },
  ],
  foreign: [
    {
      title: "Special Instructions",
      items: [
        "Please refer to the leaflet for Foreign Students / Filipinos residing abroad available at the Registrar's Office.",
      ],
    },
  ],
  law: [
    {
      title: "Admission Test",
      items: [
        "Applicants shall take the SPC College of Law Admission Test (SPCCLAT)",
      ],
    },
    {
      title: "Academic Requirements",
      items: [
        "Must have earned 18 units of English, 6 units of Math, and 18 units of Social Science in bachelor's degree",
        "Certificate of General Weighted Average of 2.5 (80%) or above",
        "C-1 Certificate of Eligibility in the Law Course",
        "Certification of Grades for evaluation purposes",
        "Original Transcript of Records with remark 'Copy for San Pablo Colleges'",
      ],
    },
    {
      title: "Personal Documents",
      items: [
        "PSA authenticated Birth Certificate",
        "For female married applicants: Photocopy of Marriage Contract",
      ],
    },
  ],
  graduate: [
    {
      title: "Program-Specific Requirements",
      items: [
        "MBA: BSBA/BSA graduate; otherwise, complete 18 units of Professional Business Education Subjects",
        "MA: BSED/BEED graduate; otherwise, complete 18 units of Professional Education Subjects + Photocopy of Valid PRC ID (LET)",
        "MA in Guidance Counseling: AB Psych, BS Psych, or BSEd in Guidance and Counseling; otherwise, complete 18 units of Professional Subjects",
        "MAN: Bachelor's degree in Nursing + Photocopy of Valid PRC ID (NLE)",
        "EdD: MA degree holder with Thesis; otherwise, subject to evaluation of unit requirement in Professional Education Subjects",
        "DBA: MBA/MM degree holder with Thesis; otherwise, take MBA 113a (Position Paper)",
      ],
    },
    {
      title: "General Requirements",
      items: [
        "Interview by the Dean of Graduate School",
        "Certification of Grades for evaluation purposes",
        "Original Transcript of Records with remark 'Copy for San Pablo Colleges'",
        "PSA authenticated Birth Certificate",
      ],
    },
  ],
};

const STEPS: Step[] = [
  {
    step: "01",
    title: "Submit Requirements",
    description: "Submit your SHS Grade 12 Report Card, Certificate of Good Moral Character, and two (2) identical 2x2 colored pictures with white background.",
  },
  {
    step: "02",
    title: "Screening & Entrance Exam",
    description: "Compliant applicants are screened by the concerned department. Pay the admission fee at the Cashier's Office before taking the SPCAT.",
  },
  {
    step: "03",
    title: "Secure Admission Kit",
    description: "Obtain the Admission Kit from the Admission Office. It includes two (2) Admission Forms, the SPC Primer with Academic Information, and Enrollment Procedures.",
  },
  {
    step: "04",
    title: "Accomplish Admission Form",
    description: "Fill out the Admission Form in duplicate, attach two (2) 2x2 pictures, and schedule your SPCAT at the Guidance Unit. Results are released three days after the exam.",
  },
  {
    step: "05",
    title: "Interview",
    description: "Applicants who have submitted all requirements including F-138, Certificate of Good Moral, and Exam Result will be scheduled for an interview with the respective Department Dean.",
  },
];

const ADMISSION_BASIS = [
  { label: "Scholastic Standing", value: "33.33%" },
  { label: "Entrance Examination", value: "33.33%" },
  { label: "Interview Result", value: "33.33%" },
];

const OFFICE_HOURS: OfficeHour[] = [
  { day: "Monday - Saturday", time: "8:00 AM - 5:00 PM" },
  { day: "Sunday", time: "Closed" },
];

// ── Sub-components ──

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative bg-[#007848] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 pt-4 pb-16 md:py-20 text-center">
        <p className="text-green-300 text-sm font-semibold uppercase tracking-widest mb-3">San Pablo Colleges</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">Admission Office</h1>
        <p className="text-green-100 text-lg max-w-2xl mx-auto">
          Begin your academic journey at SPC. Review all requirements and follow the registration procedures.
        </p>
        <button onClick={onStart} className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#007848] font-bold rounded-lg shadow-lg hover:bg-green-50 transition-colors cursor-pointer">
          Start Your Application
          <FaChevronRight className="text-sm" />
        </button>
      </div>
    </section>
  );
}

function RequirementsTabs() {
  const [activeTab, setActiveTab] = useState("freshmen");
  const groups = REQUIREMENTS[activeTab];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 text-[#007848] text-xs font-bold uppercase tracking-widest bg-[#007848]/10 px-4 py-1.5 rounded-full mb-3">
          <FaCheckCircle className="w-3.5 h-3.5" />
          Step 1
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Pre-Admission Requirements</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Select your applicant type to view the specific documents you need to prepare.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
              activeTab === tab.id
                ? "bg-[#007848] text-white border-[#007848] shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#007848] hover:text-[#007848]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaCheckCircle className="w-5 h-5 text-[#007848]" />
              {group.title}
            </h3>
            <ul className="space-y-3">
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-[#007848] rounded-full mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function RegistrationSteps() {
  return (
    <section className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[#007848] text-xs font-bold uppercase tracking-widest bg-[#007848]/10 px-4 py-1.5 rounded-full mb-3">
            <FaCalendarAlt className="w-3.5 h-3.5" />
            Step 2
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">On-Site Registration Procedures</h2>
          <p className="text-gray-500 max-w-lg mx-auto">Follow these steps sequentially when you visit the campus.</p>
        </div>

        <div className="space-y-6">
          {STEPS.map((step, index) => (
            <div key={index} className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-20 h-20 bg-[#007848] rounded-xl flex flex-col items-center justify-center shadow-md">
                <span className="text-[10px] font-bold text-green-200 tracking-widest">STEP</span>
                <span className="text-xl font-extrabold text-white">{step.step}</span>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex-1">
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BasisAndHours({ onApply }: { onApply: () => void }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center gap-2 mb-2">
            <FaChartBar className="text-[#007848] text-lg" />
            <h3 className="text-lg font-extrabold text-gray-900">Basis for Admitting Students</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">All three criteria carry equal weight in the final evaluation.</p>
          <div className="space-y-5">
            {ADMISSION_BASIS.map((basis, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                  <span>{basis.label}</span>
                  <span className="text-[#007848]">{basis.value}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#007848] rounded-full" style={{ width: basis.value }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#007848] rounded-xl p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaClock className="text-green-300 text-lg" />
              <h3 className="text-lg font-extrabold">Office Hours</h3>
            </div>
            <p className="text-green-200 text-sm mb-6">Admission Office - San Pablo Colleges</p>
            <div className="space-y-4">
              {OFFICE_HOURS.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-white/20 pb-3 last:border-0 last:pb-0">
                  <span className="text-green-100 text-sm">{item.day}</span>
                  <span className={`font-semibold text-sm ${item.time === "Closed" ? "text-green-400" : "text-white"}`}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onApply} className="mt-8 inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-[#007848] font-bold rounded-lg hover:bg-green-50 transition-colors shadow-md cursor-pointer">
            Apply Online
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>
    </section>
  );
}

function PrivacyModal({ open, onAccept, onDecline }: { open: boolean; onAccept: () => void; onDecline: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative">
        <button onClick={onDecline} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <FaTimes className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <FaShieldAlt className="text-[#007848] text-xl" />
          <h2 className="text-2xl font-extrabold text-gray-900">Data Privacy Consent</h2>
        </div>
        <div className="text-sm text-gray-600 space-y-3 mb-6 max-h-60 overflow-y-auto">
          <p>
            In compliance with the Data Privacy Act of 2012 (RA 10173), San Pablo Colleges
            respects and values your data privacy rights. The information you provide in this
            pre-admission form will be collected, processed, and stored for the following purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Processing your admission application</li>
            <li>Evaluating your qualifications for your desired program</li>
            <li>Communicating important updates regarding your application</li>
            <li>Complying with academic and regulatory requirements</li>
          </ul>
          <p>
            Your personal data will be kept confidential and will not be shared with third
            parties without your consent, except as required by law. By proceeding, you hereby
            give your full consent to San Pablo Colleges to process your personal information
            in accordance with our Data Privacy Policy.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onDecline} className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            Decline
          </button>
          <button onClick={onAccept} className="flex-1 py-3 bg-[#007848] text-white font-bold rounded-lg hover:bg-[#005a36] transition-colors cursor-pointer">
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──

export default function AdmissionPage() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleAcceptPrivacy = () => {
    setShowPrivacyModal(false);
    window.location.href = "/admission/pre-admission";
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <HeroSection onStart={() => setShowPrivacyModal(true)} />
        <RequirementsTabs />
        <ProgramsOfferedSection />
        <RegistrationSteps />
        <BasisAndHours onApply={() => setShowPrivacyModal(true)} />
        <Footer />
      </main>
      <PrivacyModal
        open={showPrivacyModal}
        onAccept={handleAcceptPrivacy}
        onDecline={() => setShowPrivacyModal(false)}
      />
    </>
  );
}
