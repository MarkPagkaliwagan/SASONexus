"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sendStaffLoginOtp } from "@/lib/actions";
import { FaUser, FaLock, FaEnvelope, FaShieldAlt, FaCheckCircle, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (step === "otp") {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { sendStaffLoginOtp } = await import("@/lib/actions");
      const result = await sendStaffLoginOtp(email, password);

      if (!result.ok) {
        setError(result.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      setStep("otp");
      setLoading(false);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;
    setError("");
    setLoading(true);

    try {
      const signInResult = await signIn("credentials", {
        email,
        password,
        otp: code,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Invalid or expired verification code");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/session");
      const session = await res.json();
      const role = session?.user?.role;

      if (role === "super_admin") {
        router.push("/portal/admin");
      } else {
        router.push("/portal/dashboard");
      }
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      const { sendStaffLoginOtp } = await import("@/lib/actions");
      const result = await sendStaffLoginOtp(email, password);
      if (!result.ok) {
        setError(result.error || "Failed to resend code");
      }
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch {
      setError("Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-10 flex items-center justify-center pt-16 md:pt-20">
        <div className="w-full max-w-5xl">
          <div className="grid overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:grid-cols-2">
            {/* Left Panel */}
            <section className="relative flex flex-col justify-between bg-[#007848] p-8 text-white md:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />

              <div className="relative">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  {step === "otp" ? <FaKey className="text-xl text-white" /> : <FaUser className="text-xl text-white" />}
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
                  <span>Secure access to staff portal</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                    <FaCheckCircle className="text-[10px]" />
                  </span>
                  <span>Department-specific dashboard</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                    <FaCheckCircle className="text-[10px]" />
                  </span>
                  <span>Manage student services efficiently</span>
                </div>
              </div>
            </section>

            {/* Right Panel */}
            <section className="p-8 md:p-12">
              {step === "login" ? (
                <>
                  <div className="mb-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                      <FaShieldAlt className="text-[10px] text-[#007848]" />
                      Staff Secure Sign In
                    </div>
                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                      Welcome back
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Enter your staff credentials to access the portal.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@sanpablocolleges.edu.ph"
                          required
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#007848] focus:bg-white focus:ring-4 focus:ring-[#007848]/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#007848] focus:bg-white focus:ring-4 focus:ring-[#007848]/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-[#007848] py-3 text-sm font-semibold text-white transition hover:bg-[#005f38] focus:outline-none focus:ring-4 focus:ring-[#007848]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Signing in..." : "Sign in"}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                      <FaKey className="text-[10px] text-[#007848]" />
                      Two-Factor Verification
                    </div>
                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                      Check your email
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      A verification code was sent to <strong className="text-gray-700">{email}</strong>. Enter the 6-digit code below.
                    </p>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    {error && (
                      <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="mb-3 block text-sm font-medium text-gray-700 text-center">
                        Verification Code
                      </label>
                      <div className="flex items-center justify-center gap-2.5">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => { otpRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-11 h-13 rounded-xl border-2 border-gray-200 bg-gray-50 text-center text-xl font-bold text-gray-900 outline-none transition focus:border-[#007848] focus:bg-white focus:ring-4 focus:ring-[#007848]/10"
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.join("").length !== 6}
                      className="w-full rounded-2xl bg-[#007848] py-3 text-sm font-semibold text-white transition hover:bg-[#005f38] focus:outline-none focus:ring-4 focus:ring-[#007848]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Verifying..." : "Verify & Sign In"}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="text-sm font-medium text-[#007848] hover:text-[#005f38] transition disabled:opacity-50 cursor-pointer"
                      >
                        {resending ? "Resending..." : "Resend code"}
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => { setStep("login"); setOtp(["", "", "", "", "", ""]); setError(""); }}
                        className="text-sm text-gray-400 hover:text-gray-600 transition cursor-pointer"
                      >
                        Back to sign in
                      </button>
                    </div>
                  </form>
                </>
              )}

              <div className="mt-8 border-t border-gray-100 pt-5">
                <p className="text-center text-sm text-gray-500">
                  This portal is for authorized SASO staff only.{" "}
                  <Link href="/admission" className="font-semibold text-[#007848] transition hover:text-[#005a36]">
                    Apply now
                  </Link>
                </p>
              </div>
            </section>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} San Pablo Colleges. All rights reserved.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
