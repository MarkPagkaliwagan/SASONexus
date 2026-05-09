"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Admission",
    description: "Apply for admission and check requirements for new students.",
    action: "apply",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    title: "Announcements",
    description: "Stay updated with the latest news and announcements from SASO.",
    href: "/announcement",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Student Services",
    description: "Explore the various student services we offer to support your journey.",
    href: "/services",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "About SASO",
    description: "Learn about our mission, vision, and the team behind student affairs.",
    href: "/about",
  },
];

const values = [
  {
    number: "F",
    title: "Faith",
    description:
      "Fidelity to and being grounded in the faithfulness of God, realizing that there is more to life thereby committing their lives in the service of mankind and the salvation of souls.",
  },
  {
    number: "S",
    title: "Stewardship",
    description:
      "Willingness to shape services to meet the changing needs of all learners and stakeholders, thus, making significant contributions to the larger community.",
  },
  {
    number: "P",
    title: "Passion for Learning",
    description:
      "Strong and harmonious engagement among learners considers everyone as self-determined individuals who are capable of recreating themselves to improve teaching and learning.",
  },
  {
    number: "C",
    title: "Caring Community",
    description:
      "Expression of genuine relationship between self and others, thus, inspiring and sharing one's success and significance with larger community that goes beyond giving respect to the worth and dignity of all.",
  },
  {
    number: "S",
    title: "Sense of Pride",
    description:
      "Delighting in one's success and continuously seeking for challenging experiences, while enhancing one's feelings of pride and self-worth and staying connected and proud of being identified as an SPCian.",
  },
];

export default function Home() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleAcceptPrivacy = () => {
    setShowPrivacyModal(false);
    window.location.href = "/admission/pre-admission";
  };

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* ════════════════ HERO ════════════════ */}
        <section className="relative overflow-hidden min-h-screen flex items-center bg-fixed max-sm:bg-scroll" style={{ backgroundImage: "url('/hero-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-44 pb-16 md:pb-28">
            <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
              <img src="/SPCLOGO.png" alt="San Pablo Colleges Logo" className="w-16 md:w-36 h-auto" />
              <img src="/SASOLOGO.png" alt="SASO Logo" className="w-14 md:w-28 h-auto" />
            </div>

            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white leading-[1.1] mb-3 tracking-tight sm:whitespace-nowrap">
                San Pablo{" "}
                <span className="text-green-300">
                  Colleges
                </span>
              </h1>

              <p className="text-sm md:text-base text-white/50 uppercase tracking-[0.25em] font-medium mb-6">
                Student Affairs &amp; Services Office
              </p>

              <p className="text-base md:text-lg text-white/50 mb-10 max-w-xl leading-relaxed">
                Committed to providing quality student services that foster holistic development,
                academic success, and meaningful campus life experiences.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="group px-9 py-3.5 bg-white text-[#007848] font-semibold text-base rounded-xl hover:bg-green-50 hover:shadow-2xl hover:shadow-white/10 active:scale-[0.97] transition-all duration-300 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    Apply Now
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
                <a
                  href="/services"
                  className="group px-9 py-3.5 border border-white/20 text-white/80 font-medium text-base rounded-xl hover:bg-white/5 hover:border-white/40 hover:text-white transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Our Services
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </section>

        {/* ════════════════ SERVICES ════════════════ */}
        <section className="py-16 md:py-20 px-4 relative overflow-hidden bg-gray-50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(0,120,72,0.03)_0%,_transparent_50%)]" />
          <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #007848 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #007848 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#007848]/10 rounded-full text-[#007848] text-sm font-semibold mb-5">
                Quick Access
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Everything You Need
              </h2>
              <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto">
                Access the tools and information you need as a student, all in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="group relative bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-6 md:p-8 hover:shadow-2xl hover:border-[#007848]/20 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#007848]/10 to-[#007848]/5 rounded-2xl flex items-center justify-center mb-6 text-[#007848] group-hover:from-[#007848] group-hover:to-[#005a36] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#007848]/25 transition-all duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">{service.description}</p>
                  {"action" in service ? (
                    <button
                      onClick={() => setShowPrivacyModal(true)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#007848] group-hover:gap-3 transition-all cursor-pointer"
                    >
                      Apply Now
                      <div className="w-8 h-8 rounded-full bg-[#007848]/10 flex items-center justify-center group-hover:bg-[#007848] group-hover:text-white transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </button>
                  ) : (
                    <a
                      href={service.href}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#007848] group-hover:gap-3 transition-all"
                    >
                      Learn More
                      <div className="w-8 h-8 rounded-full bg-[#007848]/10 flex items-center justify-center group-hover:bg-[#007848] group-hover:text-white transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ ABOUT ════════════════ */}
        <section className="relative overflow-hidden py-16 md:py-20 px-4 bg-fixed" style={{ backgroundImage: "url('/hero-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,120,72,0.15)_0%,_transparent_60%)]" />

          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 text-green-300 text-sm font-semibold mb-6">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 bg-green-300 rounded-full animate-ping" />
                    <span className="relative bg-green-300 rounded-full w-2 h-2" />
                  </span>
                  Who We Are
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                  About{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-emerald-200">Our Office</span>
                </h2>

                <div className="space-y-4 mb-10">
                  <div className="flex items-start gap-4 p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      SASO is dedicated to supporting students throughout their academic journey. We provide comprehensive services that address academic, social, and personal development needs.
                    </p>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      Our mission is to create a supportive environment that enables students to achieve their full potential and become responsible members of society.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-sm font-semibold text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Est. 1940s
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-sm font-semibold text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Quality Education
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-sm font-semibold text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Student-Centered
                  </div>
                </div>

                <a
                  href="/about"
                  className="group inline-flex items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-white text-[#007848] font-bold text-base md:text-lg rounded-xl md:rounded-2xl hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-white/10 hover:-translate-y-0.5"
                >
                  Learn More About Us
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

              {/* Right */}
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/10 p-6 md:p-10">
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">Office Hours</h3>
                      <p className="text-sm text-white/50">We are here to serve you</p>
                    </div>
                  </div>

                  <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 py-3 md:py-4 px-4 md:px-5 bg-white/10 rounded-xl md:rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
                        <span className="text-sm md:text-base text-white/80 font-medium">Monday — Saturday</span>
                      </div>
                      <span className="text-sm md:text-base font-bold text-white ml-5 sm:ml-0">8:00 AM – 5:00 PM</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 py-3 md:py-4 px-4 md:px-5 bg-white/10 rounded-xl md:rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full shrink-0" />
                        <span className="text-sm md:text-base text-white/80 font-medium">Sunday</span>
                      </div>
                      <span className="text-sm md:text-base font-bold text-red-300 ml-5 sm:ml-0">Closed</span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-8 space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-0.5">Location</p>
                        <p className="font-semibold text-white/90">Student Affairs Office, San Pablo Colleges</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-0.5">Email</p>
                        <p className="font-semibold text-white/90">saso@sanpablocolleges.edu.ph</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ VALUES / PILLARS ════════════════ */}
        <section className="py-16 md:py-20 px-4 relative overflow-hidden bg-gray-50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(0,120,72,0.04)_0%,_transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#007848]/10 rounded-full text-[#007848] text-sm font-semibold mb-5">
                <span className="w-1.5 h-1.5 bg-[#007848] rounded-full" />
                SPC Core Values
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Our{" "}
                <span className="text-[#007848]">Core Values</span>
              </h2>
              <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto">
                The principles that define the San Pablo Colleges community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="group relative bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-6 md:p-10 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#007848]/[0.02] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#007848]/[0.04] transition-colors" />
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="text-4xl md:text-6xl font-black text-[#007848]/10 group-hover:text-[#007848]/20 transition-colors leading-none select-none">
                      {v.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-[#007848] transition-colors">{v.title}</h3>
                      <p className="text-sm md:text-base text-gray-500 leading-relaxed">{v.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ CTA ════════════════ */}
        <section className="relative overflow-hidden py-16 md:py-24 px-4 bg-scroll md:bg-fixed" style={{ backgroundImage: "url('/hero-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,120,72,0.1)_0%,_transparent_60%)]" />

          <div className="hidden md:block absolute top-10 left-10 w-64 h-64 border border-white/5 rounded-full animate-float" />
          <div className="hidden md:block absolute bottom-10 right-10 w-80 h-80 border border-white/5 rounded-full animate-float-delayed" />

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 md:px-5 py-1.5 md:py-2 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs md:text-sm font-medium mb-6 md:mb-8 border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Get Started Today
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight tracking-tight">
              Ready to Start Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-emerald-200">
                Journey?
              </span>
            </h2>
            <p className="text-base md:text-xl text-white/70 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              Take the first step toward a brighter future. Apply now and become part of the San Pablo Colleges community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="group relative px-8 md:px-12 py-3.5 md:py-4 bg-white text-[#007848] font-bold text-base md:text-lg rounded-xl md:rounded-2xl hover:bg-green-50 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 active:scale-[0.97] cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Apply Now
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              <a
                href="/about"
                className="group px-8 md:px-12 py-3.5 md:py-4 border-2 border-white/30 text-white font-semibold text-base md:text-lg rounded-xl md:rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  Learn More
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#007848] via-[#00a35e] to-[#00c86f]" />
        </section>

        <Footer />
      </main>

      {/* ════════════════ PRIVACY MODAL ════════════════ */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 px-0 sm:px-4 backdrop-blur-md">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 sm:p-10 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#007848]/10 to-[#007848]/5 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#007848]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Data Privacy Consent</h2>
                <p className="text-sm text-gray-400">RA 10173 Compliance</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-3 mb-8 max-h-60 overflow-y-auto pr-2 leading-relaxed">
              <p>
                In compliance with the Data Privacy Act of 2012 (RA 10173), San Pablo Colleges
                respects and values your data privacy rights. The information you provide in this
                pre-admission form will be collected, processed, and stored for the following purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
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
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-bold rounded-xl sm:rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Decline
              </button>
              <button
                onClick={handleAcceptPrivacy}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#007848] to-[#005a36] text-white font-bold rounded-xl sm:rounded-2xl hover:from-[#005a36] hover:to-[#004d2e] transition-all shadow-lg shadow-[#007848]/25"
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
