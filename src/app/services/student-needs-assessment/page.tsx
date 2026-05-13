"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaClipboardList, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

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

        <section className="py-12 px-4 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex">
              <div className="w-2 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
              <div className="p-6 md:p-8 flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Assessment Overview</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  The Student Needs Assessment helps the Guidance Office identify the developmental needs, concerns, and areas where students require support. This assessment covers academic, personal, social, and career domains.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[#007848]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheckCircle className="text-[#007848] text-xs" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">Academic Domain</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Study habits, learning environment, academic performance, subject preferences</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[#007848]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheckCircle className="text-[#007848] text-xs" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">Personal Domain</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Self-concept, emotional well-being, personal concerns, stress management</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[#007848]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheckCircle className="text-[#007848] text-xs" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">Social Domain</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Peer relationships, family dynamics, social skills, extracurricular involvement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[#007848]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheckCircle className="text-[#007848] text-xs" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">Career Domain</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Career awareness, decision-making, job readiness, further education plans</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="px-6 py-3 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-sm font-semibold rounded-xl hover:from-[#005f3a] hover:to-[#008f56] transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#007848]/20">
                    <FaClipboardList className="text-xs" /> Take Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <FaClipboardList className="text-blue-600 text-sm" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 text-sm">Confidentiality</h3>
                <p className="text-xs text-blue-600 mt-1">All assessment responses are kept confidential and will only be used to improve guidance and support services for students.</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
