"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleAcceptPrivacy = () => {
    setShowPrivacyModal(false);
    window.location.href = "/admission/pre-admission";
  };
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#007848] to-[#005a36] text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Student Affairs and Services Office
            </h1>
            <p className="text-xl md:text-2xl mb-2 text-green-100">
              San Pablo Colleges
            </p>
            <p className="max-w-2xl mx-auto text-green-50 mb-8 leading-relaxed">
              Committed to providing quality student services that foster holistic development,
              academic success, and meaningful campus life experiences.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
            <button
                 onClick={() => setShowPrivacyModal(true)}
                 className="px-6 py-3 bg-white text-[#007848] font-semibold rounded-lg hover:bg-green-50 transition-colors shadow-lg cursor-pointer"
               >
                 Apply Now
               </button>
              <a
                href="/services"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Our Services
              </a>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Quick Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={() => setShowPrivacyModal(true)} className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 text-left w-full cursor-pointer">
                <div className="w-12 h-12 bg-[#007848]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#007848] transition-colors">
                  <svg className="w-6 h-6 text-[#007848] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Admission</h3>
                <p className="text-gray-600">Apply for admission and check requirements for new students.</p>
              </button>

              <a href="/announcement" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-[#007848]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#007848] transition-colors">
                  <svg className="w-6 h-6 text-[#007848] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Announcements</h3>
                <p className="text-gray-600">Stay updated with the latest news and announcements.</p>
              </a>

              <a href="/services" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-[#007848]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#007848] transition-colors">
                  <svg className="w-6 h-6 text-[#007848] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Services</h3>
                <p className="text-gray-600">Explore the various student services we offer.</p>
              </a>
            </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  About Our Office
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  The Student Affairs and Services Office (SASO) is dedicated to supporting
                  students throughout their academic journey. We provide comprehensive services
                  that address academic, social, and personal development needs.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our mission is to create a supportive environment that enables students
                  to achieve their full potential and become responsible members of society.
                </p>
                <a
                  href="/about"
                  className="inline-flex items-center gap-2 text-[#007848] font-semibold hover:gap-3 transition-all"
                >
                  Learn More About Us
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              <div className="flex-1">
                <div className="bg-[#007848]/5 rounded-2xl p-8 border border-[#007848]/10">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Office Hours</h3>
                  <div className="space-y-3">
                     <div className="flex justify-between">
                       <span className="text-gray-600">Monday - Saturday</span>
                       <span className="font-medium text-gray-800">8:00 AM - 5:00 PM</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">Sunday</span>
                       <span className="font-medium text-gray-800">Closed</span>
                     </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-[#007848]/10">
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium text-gray-800">Location:</span> Student Affairs Office, San Pablo Colleges
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      <span className="font-medium text-gray-800">Contact:</span> saso@sanpablocolleges.edu.ph
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {/* Privacy Consent Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Data Privacy Consent</h2>
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
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAcceptPrivacy}
                className="flex-1 py-3 bg-[#007848] text-white font-bold rounded-lg hover:bg-[#005a36] transition-colors"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
