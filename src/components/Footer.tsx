"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [year, setYear] = useState<string>("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="bg-[#007848] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">San Pablo Colleges</h3>
            <p className="text-sm text-white/80">
              Student Affairs & Services Office
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/admission" className="hover:text-white/80 transition-colors">Admission</a></li>
              <li><a href="/announcement" className="hover:text-white/80 transition-colors">Announcement</a></li>
              <li><a href="/services" className="hover:text-white/80 transition-colors">Services</a></li>
              <li><a href="/about" className="hover:text-white/80 transition-colors">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-white/80">
              San Pablo City, Laguna<br />
              Philippines
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/70">
          © {year || "2026"} San Pablo Colleges. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
