"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaFolder, FaArrowLeft, FaUser, FaBook, FaFileAlt, FaClipboardList, FaIdCard, FaHeartbeat, FaShieldAlt, FaPhoneAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

const SectionCard = ({ title, icon, children, defaultOpen }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen ?? true);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 md:p-6 bg-gray-50/80 hover:bg-gray-100 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#007848]/10 flex items-center justify-center">{icon}</div>
          <h3 className="font-bold text-gray-800 text-sm md:text-base">{title}</h3>
        </div>
        {open ? <FaChevronUp className="text-gray-400 text-xs" /> : <FaChevronDown className="text-gray-400 text-xs" />}
      </button>
      {open && <div className="p-5 md:p-6 border-t border-gray-100">{children}</div>}
    </div>
  );
};

const FormField = ({ label, type, placeholder, options, rows }: { label: string; type?: string; placeholder?: string; options?: string[]; rows?: number }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    {type === "select" ? (
      <select className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300 bg-white transition">
        <option value="">Select</option>
        {options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : type === "textarea" ? (
      <textarea rows={rows || 3} placeholder={placeholder} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300 transition resize-none" />
    ) : (
      <input type={type || "text"} placeholder={placeholder} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300 transition" />
    )}
  </div>
);

export default function CumulativeRecordPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16 md:pt-20">
        <section className="bg-gradient-to-br from-[#007848] via-[#008f56] to-[#00a864] text-white pt-4 pb-16 md:py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <Link href="/services" className="inline-flex items-center gap-2 text-green-100 hover:text-white transition-colors mb-6 text-sm">
              <FaArrowLeft className="text-xs" /> Back to Services
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <FaFolder className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Cumulative Record Folder</h1>
                <p className="text-green-100 text-sm mt-1">Guidance and Career Services Unit</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 max-w-5xl mx-auto space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Basic Student Profile / School Information</h2>
            <p className="text-xs text-gray-500 mb-5">Fill in the basic student details to begin.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Current Academic Year (A.Y.)" type="select" options={["2025-2026", "2026-2027", "2027-2028"]} />
              <FormField label="Department" type="select" options={["GS", "JHS", "SHS", "College"]} />
              <FormField label="School ID (Student ID Number)" placeholder="Enter student ID" />
            </div>
          </div>

          <SectionCard title="1. Personal Information" icon={<FaUser className="text-[#007848] text-sm" />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Full Name" placeholder="Enter full name" />
              <FormField label="Student Number" placeholder="Enter student number" />
              <FormField label="Address" placeholder="Enter complete address" />
              <FormField label="Contact Number" placeholder="09XXXXXXXXX" />
              <FormField label="Birthday / Age" type="date" />
              <FormField label="Nationality" placeholder="e.g. Filipino" />
            </div>
          </SectionCard>

          <SectionCard title="2. Educational Background" icon={<FaBook className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 md:col-span-2">Elementary School</h4>
                <FormField label="School Name" placeholder="Enter school name" />
                <FormField label="Year Graduated" placeholder="e.g. 2020" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 md:col-span-2">Junior High School</h4>
                <FormField label="School Name" placeholder="Enter school name" />
                <FormField label="Year Graduated" placeholder="e.g. 2024" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 md:col-span-2">Senior High School</h4>
                <FormField label="School Name" placeholder="Enter school name" />
                <FormField label="Year Graduated" placeholder="e.g. 2026" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 md:col-span-2">College</h4>
                <FormField label="Program / Course" placeholder="e.g. BS Information Technology" />
                <FormField label="Year Level" placeholder="e.g. 1st Year" />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="3. Admission / Enrollment Records" icon={<FaFileAlt className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Certificate of Registration (COR)</p>
                  <p className="text-xs text-gray-500">Upload your latest COR</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold bg-[#007848] text-white rounded-xl hover:bg-[#005f3a] transition cursor-pointer">Upload</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Enrollment Form / Admission Form</p>
                  <p className="text-xs text-gray-500">Upload enrollment or admission form</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold bg-[#007848] text-white rounded-xl hover:bg-[#005f3a] transition cursor-pointer">Upload</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Student Admission/Registration Record</p>
                  <p className="text-xs text-gray-500">Upload admission record if applicable</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold bg-[#007848] text-white rounded-xl hover:bg-[#005f3a] transition cursor-pointer">Upload</button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="4. Academic Records" icon={<FaBook className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Report Card / Grades (Form 138 or equivalent)</p>
                  <p className="text-xs text-gray-500">Upload your report card</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold bg-[#007848] text-white rounded-xl hover:bg-[#005f3a] transition cursor-pointer">Upload</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Transcript of Records (Form 137 or equivalent)</p>
                  <p className="text-xs text-gray-500">Upload TOR if applicable</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold bg-[#007848] text-white rounded-xl hover:bg-[#005f3a] transition cursor-pointer">Upload</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Subject Load / Class Schedule</p>
                  <p className="text-xs text-gray-500">Upload your class schedule</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold bg-[#007848] text-white rounded-xl hover:bg-[#005f3a] transition cursor-pointer">Upload</button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="5. Personal Documents" icon={<FaIdCard className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Photocopy of Birth Certificate (PSA)</p>
                  <p className="text-xs text-gray-500">Upload PSA birth certificate</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold bg-[#007848] text-white rounded-xl hover:bg-[#005f3a] transition cursor-pointer">Upload</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">2x2 ID Picture</p>
                  <p className="text-xs text-gray-500">Upload recent 2x2 ID picture</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold bg-[#007848] text-white rounded-xl hover:bg-[#005f3a] transition cursor-pointer">Upload</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Valid School ID / Student ID Copy</p>
                  <p className="text-xs text-gray-500">Upload a copy of your school ID</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold bg-[#007848] text-white rounded-xl hover:bg-[#005f3a] transition cursor-pointer">Upload</button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="6. Guidance and Student Development Records" icon={<FaHeartbeat className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Student Information Sheet</p>
                  <p className="text-xs text-gray-500">View or update your information sheet</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold border-2 border-[#007848] text-[#007848] rounded-xl hover:bg-[#007848]/5 transition cursor-pointer">View</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Student Needs Assessment Form</p>
                  <p className="text-xs text-gray-500">View your assessment results</p>
                </div>
                <Link href="/services/student-needs-assessment" className="px-4 py-2 text-xs font-semibold bg-[#007848] text-white rounded-xl hover:bg-[#005f3a] transition cursor-pointer inline-block">Go to Form</Link>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Counseling / Interview Records</p>
                  <p className="text-xs text-gray-500">Records of counseling sessions and interviews</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold border-2 border-[#007848] text-[#007848] rounded-xl hover:bg-[#007848]/5 transition cursor-pointer">View</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Personality or Career Assessment Results</p>
                  <p className="text-xs text-gray-500">View assessment results if any</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold border-2 border-[#007848] text-[#007848] rounded-xl hover:bg-[#007848]/5 transition cursor-pointer">View</button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="7. Character and Conduct" icon={<FaShieldAlt className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Good Moral Certificate</p>
                  <p className="text-xs text-gray-500">Upload or request good moral certificate</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold bg-[#007848] text-white rounded-xl hover:bg-[#005f3a] transition cursor-pointer">Upload</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Discipline / Conduct Record</p>
                  <p className="text-xs text-gray-500">Upload conduct record if applicable</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition cursor-pointer">Upload</button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="8. Emergency Information" icon={<FaPhoneAlt className="text-[#007848] text-sm" />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Parent/Guardian Name" placeholder="Enter parent/guardian name" />
              <FormField label="Relationship" placeholder="e.g. Mother, Father" />
              <FormField label="Parent/Guardian Contact" placeholder="09XXXXXXXXX" />
              <FormField label="Emergency Contact Person" placeholder="Enter contact person name" />
              <FormField label="Relationship" placeholder="e.g. Aunt, Uncle" />
              <FormField label="Emergency Contact Number" placeholder="09XXXXXXXXX" />
            </div>
          </SectionCard>

          <div className="flex flex-wrap gap-3 pt-2">
            <button className="px-8 py-3.5 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-sm font-bold rounded-xl hover:from-[#005f3a] hover:to-[#008f56] transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#007848]/20">
              <FaFolder className="text-xs" /> Save Record
            </button>
            <button className="px-8 py-3.5 border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-2">
              <FaArrowLeft className="text-xs" /> Cancel
            </button>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <FaFolder className="text-amber-600 text-sm" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 text-sm">Note</h3>
                <p className="text-xs text-amber-600 mt-1">Cumulative records are confidential documents. Access is restricted to authorized personnel and the student concerned. Please coordinate with the Guidance Office for processing requests.</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
