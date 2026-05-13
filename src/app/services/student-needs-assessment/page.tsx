"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaClipboardList, FaArrowLeft, FaUser, FaBook, FaHeart, FaSmile, FaUsers, FaMoneyBillWave, FaBriefcase, FaMedkit, FaHandsHelping, FaCommentDots, FaChevronDown, FaChevronUp } from "react-icons/fa";
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
    ) : type === "radio" ? (
      <div className="flex flex-wrap gap-4 pt-1">
        {options?.map((o) => (
          <label key={o} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={label} className="accent-[#007848]" />
            <span className="text-sm text-gray-700">{o}</span>
          </label>
        ))}
      </div>
    ) : (
      <input type={type || "text"} placeholder={placeholder} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300 transition" />
    )}
  </div>
);

export default function StudentNeedsAssessmentPage() {
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
                <FaClipboardList className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Student Needs Assessment</h1>
                <p className="text-green-100 text-sm mt-1">Guidance and Career Services Unit</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 max-w-5xl mx-auto space-y-5">
          <div className="bg-gradient-to-r from-[#007848]/5 to-[#00a864]/5 rounded-2xl border border-[#007848]/20 p-5 md:p-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              This assessment helps the Guidance Office identify the developmental needs, concerns, and areas where you require support.
              Your responses are <strong>confidential</strong> and will only be used to improve guidance services.
            </p>
          </div>

          <SectionCard title="1. Basic Student Information" icon={<FaUser className="text-[#007848] text-sm" />} defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Full Name" placeholder="Enter your full name" />
              <FormField label="Student Number" placeholder="Enter student number" />
              <FormField label="Department" type="select" options={["GS", "JHS", "SHS", "College"]} />
              <FormField label="Year Level / Section" placeholder="e.g. Grade 11 - A" />
              <FormField label="Age / Birthday" type="date" />
              <FormField label="Contact Number" placeholder="09XXXXXXXXX" />
            </div>
          </SectionCard>

          <SectionCard title="2. Academic Needs" icon={<FaBook className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <FormField label="Subjects na hirap ka o need ng help" type="textarea" rows={2} placeholder="e.g. Math, Science, English..." />
              <FormField label="Study habits (hal. kulang sa time management, focus, etc.)" type="textarea" rows={2} placeholder="Describe your study habits and areas for improvement" />
              <FormField label="Learning difficulties (reading, writing, math, etc.)" type="textarea" rows={2} placeholder="Any learning difficulties you experience" />
              <FormField label="Academic concerns (grades, performance, requirements)" type="textarea" rows={2} placeholder="Concerns about your grades or academic performance" />
            </div>
          </SectionCard>

          <SectionCard title="3. Personal Needs / Concerns" icon={<FaHeart className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <FormField label="Personal problems affecting studies" type="textarea" rows={2} placeholder="Share any personal concerns affecting your studies" />
              <FormField label="Adjustment issues (new school, new environment, etc.)" type="textarea" rows={2} placeholder="How are you adjusting to school?" />
              <FormField label="Family concerns (kung meron at willing i-share)" type="textarea" rows={2} placeholder="Optional: share any family-related concerns" />
            </div>
          </SectionCard>

          <SectionCard title="4. Emotional Needs" icon={<FaSmile className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <FormField label="Stress level" type="radio" options={["Low", "Moderate", "High"]} />
              <FormField label="Feelings of anxiety, sadness, pressure" type="textarea" rows={2} placeholder="Describe any emotional concerns you're experiencing" />
              <FormField label="Motivation issues" type="textarea" rows={2} placeholder="Any issues with motivation or drive" />
              <FormField label="Self-confidence concerns" type="textarea" rows={2} placeholder="Concerns about self-confidence or self-esteem" />
            </div>
          </SectionCard>

          <SectionCard title="5. Social Needs" icon={<FaUsers className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <FormField label="Relationship with classmates" type="textarea" rows={2} placeholder="Describe your relationship with classmates" />
              <FormField label="Friendships / Peer interaction" type="textarea" rows={2} placeholder="How are your friendships and peer interactions?" />
              <FormField label="Communication difficulties" type="textarea" rows={2} placeholder="Any difficulty communicating with others" />
              <FormField label="Bullying concerns (kung meron)" type="textarea" rows={2} placeholder="Optional: share any bullying concerns" />
            </div>
          </SectionCard>

          <SectionCard title="6. Financial Needs (optional / if applicable)" icon={<FaMoneyBillWave className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <FormField label="Allowance concerns" type="textarea" rows={2} placeholder="Any concerns about your daily allowance" />
              <FormField label="School expenses difficulty" type="textarea" rows={2} placeholder="Difficulty with school expenses" />
              <FormField label="Scholarship needs" type="textarea" rows={2} placeholder="Are you looking for scholarship opportunities?" />
            </div>
          </SectionCard>

          <SectionCard title="7. Career / Future Plans" icon={<FaBriefcase className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <FormField label="Career goal or course interest" type="textarea" rows={2} placeholder="What career or course are you interested in?" />
              <FormField label="Uncertainty sa kukuning course" type="textarea" rows={2} placeholder="Are you unsure about what course to take?" />
              <FormField label="Skills or interests" type="textarea" rows={2} placeholder="What skills or interests do you have?" />
            </div>
          </SectionCard>

          <SectionCard title="8. Health / Physical Needs (if applicable)" icon={<FaMedkit className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <FormField label="Medical condition (if any)" type="textarea" rows={2} placeholder="Any medical condition we should know about" />
              <FormField label="Physical limitations affecting study" type="textarea" rows={2} placeholder="Any physical limitations affecting your studies" />
            </div>
          </SectionCard>

          <SectionCard title="9. Support Needed from School" icon={<FaHandsHelping className="text-[#007848] text-sm" />}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Counseling session", "Academic assistance", "Scholarship guidance", "Career orientation"].map((item) => (
                  <label key={item} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-[#007848]/5 transition-colors">
                    <input type="checkbox" className="accent-[#007848] w-4 h-4" />
                    <span className="text-sm text-gray-700 font-medium">{item}</span>
                  </label>
                ))}
              </div>
              <FormField label="Other support you need" type="textarea" rows={2} placeholder="Any other type of support you need from the school" />
            </div>
          </SectionCard>

          <SectionCard title="10. Other Concerns" icon={<FaCommentDots className="text-[#007848] text-sm" />}>
            <FormField label="Anything else na gusto i-share sa Guidance Office" type="textarea" rows={4} placeholder="Share any other thoughts, concerns, or feedback..." />
          </SectionCard>

          <div className="flex flex-wrap gap-3 pt-2">
            <button className="px-8 py-3.5 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-sm font-bold rounded-xl hover:from-[#005f3a] hover:to-[#008f56] transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#007848]/20">
              <FaClipboardList className="text-xs" /> Submit Assessment
            </button>
            <button className="px-8 py-3.5 border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-2">
              <FaArrowLeft className="text-xs" /> Cancel
            </button>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <FaClipboardList className="text-blue-600 text-sm" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 text-sm">Confidentiality</h3>
                <p className="text-xs text-blue-600 mt-1">All assessment responses are kept confidential and will only be used to improve guidance and support services for students. Your honesty helps us serve you better.</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
