"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = useState<string>("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="relative bg-[#007848] text-white">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#007848] via-[#00a35e] to-[#00c86f]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <img src="/SPCLOGO.png" alt="SPC" className="w-9 h-9 object-contain" />
              <span className="w-px h-8 bg-white/20" />
              <img src="/SASOLOGO.png" alt="SASO" className="w-8 h-8 object-contain" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">San Pablo Colleges</h3>
            <p className="text-sm text-white/65 leading-relaxed max-w-sm">
              Student Affairs & Services Office — providing quality student services that foster holistic development, academic success, and meaningful campus life.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/admission", label: "Admission" },
                { href: "/announcement", label: "Announcements" },
                { href: "/services", label: "Services" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-5">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-white/50 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-white/70">San Pablo City, Laguna, Philippines</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-white/50 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-white/70">saso@sanpablocolleges.edu.ph</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              &copy; {year || "2026"} San Pablo Colleges. All rights reserved.
            </p>
            <p className="text-xs text-white/40">
              Student Affairs & Services Office
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
