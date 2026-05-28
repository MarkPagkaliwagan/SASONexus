"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramsOfferedSection from "@/components/ProgramsOfferedSection";
import {
  FaUserGraduate, FaExchangeAlt, FaGlobeAmericas, FaGavel, FaGraduationCap,
  FaCheckCircle, FaCalendarAlt, FaChartBar, FaClock, FaChevronRight,
  FaShieldAlt, FaTimes, FaArrowRight, FaClipboardList, FaFileAlt,
  FaUserCheck, FaHandshake,
} from "react-icons/fa";

interface HeroData {
  heading: string;
  subheading: string;
  buttonText: string;
}

interface RequirementGroup {
  title: string;
  items: string[];
}

interface RequirementTab {
  tab: string;
  label: string;
  groups: RequirementGroup[];
}

interface Step {
  step: string;
  title: string;
  description: string;
}

interface BasisItem {
  label: string;
  value: string;
}

interface HourItem {
  day: string;
  time: string;
}

interface Props {
  hero: HeroData;
  requirements: RequirementTab[];
  steps: Step[];
  basis: BasisItem[];
  hours: HourItem[];
}

const TAB_ICONS = [FaUserGraduate, FaExchangeAlt, FaGlobeAmericas, FaGavel, FaGraduationCap] as const;
const STEP_ICONS = [FaFileAlt, FaFileAlt, FaClipboardList, FaUserCheck, FaHandshake] as const;

function HeroSection({ hero, onStart }: { hero: HeroData; onStart: () => void }) {
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
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">{hero.heading}</h1>
        <p className="text-green-100 text-lg max-w-2xl mx-auto">{hero.subheading}</p>
        <button onClick={onStart} className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#007848] font-bold rounded-lg shadow-lg hover:bg-green-50 transition-colors cursor-pointer">
          {hero.buttonText}
          <FaChevronRight className="text-sm" />
        </button>
      </div>
    </section>
  );
}

function RequirementsTabs({ requirements }: { requirements: RequirementTab[] }) {
  const [activeTab, setActiveTab] = useState(requirements[0]?.tab || "freshmen");
  const activeGroups = requirements.find((t) => t.tab === activeTab)?.groups || [];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 text-[#007848] text-xs font-bold uppercase tracking-widest bg-[#007848]/10 px-4 py-1.5 rounded-full mb-3">
          <FaClipboardList className="w-3.5 h-3.5" />
          Step 1
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Pre-Admission Requirements</h2>
        <p className="text-gray-400 max-w-lg mx-auto">Select your applicant type to view the specific documents you need to prepare.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {requirements.map((tab, i) => {
          const Icon = TAB_ICONS[i] || FaUserGraduate;
          const isActive = activeTab === tab.tab;
          return (
            <button
              key={tab.tab}
              onClick={() => setActiveTab(tab.tab)}
              className={`group flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-[#007848] text-white border-[#007848] shadow-lg shadow-[#007848]/20 scale-105"
                  : "bg-white text-gray-500 border-gray-100 hover:border-[#007848]/30 hover:text-[#007848] hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeGroups.map((group, index) => (
          <div key={index} className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-7 hover:shadow-xl hover:border-[#007848]/20 hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#007848]/10 flex items-center justify-center group-hover:bg-[#007848] group-hover:shadow-lg group-hover:shadow-[#007848]/25 transition-all duration-500">
                <FaCheckCircle className="w-5 h-5 text-[#007848] group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="font-bold text-gray-800">{group.title}</h3>
            </div>
            <ul className="space-y-3">
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3 text-sm text-gray-500 leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-[#007848]/60 rounded-full mt-2 flex-shrink-0 group-hover:bg-[#007848] transition-colors duration-500" />
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

function RegistrationSteps({ steps }: { steps: Step[] }) {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[#007848] text-xs font-bold uppercase tracking-widest bg-[#007848]/10 px-4 py-1.5 rounded-full mb-3">
            <FaCalendarAlt className="w-3.5 h-3.5" />
            Step 2
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">On-Site Registration Procedures</h2>
          <p className="text-gray-400 max-w-lg mx-auto">Follow these steps sequentially when you visit the campus.</p>
        </div>

        <div className="relative">
          <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-[#007848]/40 via-[#007848]/20 to-transparent hidden md:block" />
          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[index] || FaArrowRight;
              return (
                <div key={index} className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm p-7 hover:shadow-xl hover:border-[#007848]/20 hover:-translate-y-1 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#007848] flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-[#007848]/30 transition-all duration-500">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-black text-[#007848]/10 group-hover:text-[#007848]/20 transition-colors duration-500">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#007848] transition-colors duration-500">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                  <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#007848]/0 group-hover:text-[#007848] transition-all duration-500">
                    <span>Step {index + 1}</span>
                    <FaArrowRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function BasisAndHours({ basis, hours, onApply }: { basis: BasisItem[]; hours: HourItem[]; onApply: () => void }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 text-[#007848] text-xs font-bold uppercase tracking-widest bg-[#007848]/10 px-4 py-1.5 rounded-full mb-3">
          <FaChartBar className="w-3.5 h-3.5" />
          Evaluation
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Admission Basis & Office Hours</h2>
        <p className="text-gray-400 max-w-lg mx-auto">How applications are evaluated and when to reach us.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-xl hover:border-[#007848]/20 hover:-translate-y-1 transition-all duration-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#007848]/10 flex items-center justify-center group-hover:bg-[#007848] transition-all duration-500">
              <FaChartBar className="text-[#007848] group-hover:text-white transition-colors duration-500" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">Basis for Admitting Students</h3>
          </div>
          <p className="text-sm text-gray-400 mb-7 ml-[52px]">All three criteria carry equal weight.</p>
          <div className="space-y-6 ml-[52px]">
            {basis.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                  <span>{item.label}</span>
                  <span className="text-[#007848]">{item.value}</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#007848] to-[#00a85a] rounded-full transition-all duration-700" style={{ width: item.value }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="group bg-[#007848] rounded-2xl p-8 text-white flex flex-col justify-between hover:shadow-2xl hover:shadow-[#007848]/20 transition-all duration-500">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-500">
                <FaClock className="text-green-300" />
              </div>
              <h3 className="text-lg font-extrabold">Office Hours</h3>
            </div>
            <p className="text-green-200 text-sm mb-7 ml-[52px]">Admission Office - San Pablo Colleges</p>
            <div className="space-y-4 ml-[52px]">
              {hours.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  <span className="text-green-100/80 text-sm">{item.day}</span>
                  <span className={`font-semibold text-sm ${item.time === "Closed" ? "text-green-400" : "text-white"}`}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onApply} className="mt-8 inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-white text-[#007848] font-bold rounded-xl hover:bg-green-50 hover:shadow-lg hover:gap-3 transition-all duration-300 cursor-pointer">
            Apply Online
            <FaArrowRight className="text-sm" />
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
          <p>In compliance with the Data Privacy Act of 2012 (RA 10173), San Pablo Colleges respects and values your data privacy rights. The information you provide in this pre-admission form will be collected, processed, and stored for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Processing your admission application</li>
            <li>Evaluating your qualifications for your desired program</li>
            <li>Communicating important updates regarding your application</li>
            <li>Complying with academic and regulatory requirements</li>
          </ul>
          <p>Your personal data will be kept confidential and will not be shared with third parties without your consent, except as required by law. By proceeding, you hereby give your full consent to San Pablo Colleges to process your personal information in accordance with our Data Privacy Policy.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onDecline} className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">Decline</button>
          <button onClick={onAccept} className="flex-1 py-3 bg-[#007848] text-white font-bold rounded-lg hover:bg-[#005a36] transition-colors cursor-pointer">I Agree</button>
        </div>
      </div>
    </div>
  );
}

export default function AdmissionPageClient({ hero, requirements, steps, basis, hours }: Props) {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleAcceptPrivacy = () => {
    setShowPrivacyModal(false);
    window.location.href = "/admission/pre-admission";
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <HeroSection hero={hero} onStart={() => setShowPrivacyModal(true)} />
        {requirements.length > 0 && <RequirementsTabs requirements={requirements} />}
        <ProgramsOfferedSection />
        {steps.length > 0 && <RegistrationSteps steps={steps} />}
        <BasisAndHours basis={basis} hours={hours} onApply={() => setShowPrivacyModal(true)} />
        <Footer />
      </main>
      <PrivacyModal open={showPrivacyModal} onAccept={handleAcceptPrivacy} onDecline={() => setShowPrivacyModal(false)} />
    </>
  );
}
