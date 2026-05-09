"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/admission", label: "Admission" },
    { href: "/announcement", label: "Announcement" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
  ]

  const isHome = pathname === "/"

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className={`absolute inset-0 backdrop-blur-sm border-b transition-colors duration-300 ${
        isHome ? "bg-transparent border-white/10" : "bg-white/80 border-gray-100 shadow-sm"
      }`} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-1.5">
              <img src="/SPCLOGO.png" alt="SPC" className="w-8 h-8 md:w-9 md:h-9 object-contain" />
              <img src="/SASOLOGO.png" alt="SASO" className="w-7 h-7 md:w-8 md:h-8 object-contain" />
            </div>
            <div className={`flex flex-col leading-tight pl-3 transition-colors duration-300 ${
              isHome ? "border-l border-white/20" : "border-l border-gray-200"
            }`}>
              <span className={`text-sm font-bold transition-colors duration-300 ${
                isHome ? "text-white drop-shadow-sm" : "text-gray-900"
              }`}>San Pablo Colleges</span>
              <span className={`text-[10px] hidden sm:block tracking-wide transition-colors duration-300 ${
                isHome ? "text-white/60" : "text-gray-500"
              }`}>Student Affairs & Services Office</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-all duration-200 py-2 ${
                  isActive(link.href)
                    ? isHome ? "text-white" : "text-[#007848]"
                    : isHome ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className={`absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full ${
                    isHome ? "bg-white" : "bg-[#007848]"
                  }`} />
                )}
              </Link>
            ))}
            <Link
              href="/login"
              className="px-5 py-2.5 bg-[#007848] text-white text-sm font-semibold rounded-xl hover:bg-[#005a36] active:scale-[0.97] transition-all duration-200"
            >
              Login
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2.5 rounded-xl transition-colors ${
              isHome ? "text-white/70 hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className={`md:hidden backdrop-blur-xl border-b shadow-lg ${
          isHome ? "bg-black/40 border-white/10" : "bg-white border-gray-100"
        }`}>
          <div className="px-4 py-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? isHome ? "bg-white/10 text-white" : "bg-[#007848]/10 text-[#007848]"
                    : isHome ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/login"
                className="block px-4 py-3 text-white bg-[#007848] rounded-xl font-semibold text-center hover:bg-[#005a36] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
