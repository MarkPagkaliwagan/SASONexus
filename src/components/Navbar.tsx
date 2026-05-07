"use client"

import { useState } from "react"
import Link from "next/link"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/admission", label: "Admission" },
    { href: "/announcement", label: "Announcement" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-18 h-10 bg-[#007848] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SASO</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#007848]">San Pablo Colleges</span>
              <span className="text-[10px] text-gray-500 -mt-0.5 hidden sm:block">Student Affairs & Services Office</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-[#007848]/10 hover:text-[#007848] transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="ml-2 px-5 py-2 bg-[#007848] text-white text-sm font-medium rounded-lg hover:bg-[#00613a] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#007848">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#007848">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-gray-600 hover:bg-[#007848]/10 hover:text-[#007848] rounded-lg transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="block px-4 py-2.5 text-white bg-[#007848] rounded-lg font-medium text-center mt-2"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
