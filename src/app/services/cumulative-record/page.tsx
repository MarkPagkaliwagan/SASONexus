"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaFolder, FaArrowLeft, FaDownload, FaPrint } from "react-icons/fa";
import Link from "next/link";

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

        <section className="py-12 px-4 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex">
              <div className="w-2 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
              <div className="p-6 md:p-8 flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Student Cumulative Record</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  The Cumulative Record Folder contains the academic history, personal information, and developmental progress of each student throughout their stay at the institution. This form allows you to request access to your cumulative record.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">Personal Information</h3>
                    <p className="text-xs text-gray-500">Full Name, Student ID, Date of Birth, Contact Details</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">Academic History</h3>
                    <p className="text-xs text-gray-500">Grades, Subjects, Year Levels, School Transfers</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">Assessment Results</h3>
                    <p className="text-xs text-gray-500">Test Scores, Aptitude Results, Career Assessment</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">Developmental Record</h3>
                    <p className="text-xs text-gray-500">Counseling Notes, Behavioral Records, Progress Reports</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="px-6 py-3 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-sm font-semibold rounded-xl hover:from-[#005f3a] hover:to-[#008f56] transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#007848]/20">
                    <FaDownload className="text-xs" /> Request Copy
                  </button>
                  <button className="px-6 py-3 border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-2">
                    <FaPrint className="text-xs" /> Print Form
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
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
