import Link from "next/link";
import { FaUser, FaLock, FaEnvelope, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="grid overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:grid-cols-2">
            {/* Left Panel */}
            <section className="relative flex flex-col justify-between bg-[#007848] p-8 text-white md:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />

              <div className="relative">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <FaUser className="text-xl text-white" />
                </div>

                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  SASO Portal
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                  Student Affairs and Services Office
                </p>
              </div>

              <div className="relative mt-10 space-y-4">
                <div className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                    <FaCheckCircle className="text-[10px]" />
                  </span>
                  <span>Secure access to your student services</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                    <FaCheckCircle className="text-[10px]" />
                  </span>
                  <span>Track application and request status</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                    <FaCheckCircle className="text-[10px]" />
                  </span>
                  <span>Official portal for enrolled students</span>
                </div>
              </div>
            </section>

            {/* Right Panel */}
            <section className="p-8 md:p-12">
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                  <FaShieldAlt className="text-[10px] text-[#007848]" />
                  Secure Sign In
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Enter your credentials to continue to the portal.
                </p>
              </div>

              <form className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@sanpablocolleges.edu.ph"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#007848] focus:bg-white focus:ring-4 focus:ring-[#007848]/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#007848] focus:bg-white focus:ring-4 focus:ring-[#007848]/10"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-[#007848] focus:ring-[#007848]"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-[#007848] transition hover:text-[#005a36]"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#007848] py-3 text-sm font-semibold text-white transition hover:bg-[#005f38] focus:outline-none focus:ring-4 focus:ring-[#007848]/20"
                >
                  Sign in
                </button>
              </form>

              <div className="mt-8 border-t border-gray-100 pt-5">
                <p className="text-center text-sm text-gray-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/admission"
                    className="font-semibold text-[#007848] transition hover:text-[#005a36]"
                  >
                    Apply now
                  </Link>
                </p>
              </div>
            </section>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} San Pablo Colleges. All rights reserved.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}