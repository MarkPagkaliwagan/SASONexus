"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaClipboardList, FaArrowLeft, FaArrowRight, FaUser, FaBook, FaHeart, FaSmile, FaUsers,
  FaMoneyBillWave, FaBriefcase, FaMedkit, FaHandsHelping, FaCommentDots, FaChevronDown,
  FaChevronUp, FaCheckCircle, FaTimes, FaExclamationTriangle, FaKey, FaCheck,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step = "choose" | "lookup" | "verify" | "form";

const SectionCard = ({ title, icon, children, defaultOpen }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen ?? true);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 md:p-6 bg-gray-50/80 hover:bg-gray-100 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#007848]/10 flex items-center justify-center">{icon}</div>
          <h3 className="font-bold text-gray-800 text-sm md:text-base">{title}</h3>
        </div>
        {open ? <FaChevronUp className="text-gray-400 text-xs" /> : <FaChevronDown className="text-gray-400 text-xs" />}
      </button>
      {open && <div className="p-5 md:p-6 border-t border-gray-100">{children}</div>}
    </div>
  );
};

const FormField = ({ label, type, placeholder, options, value, onChange, error, name, rows, disabled, hint }: {
  label: string; type?: string; placeholder?: string; options?: string[]; value?: string;
  onChange?: (val: string) => void; error?: string; name?: string; rows?: number; disabled?: boolean; hint?: string;
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label} <span className="text-red-400">*</span></label>
    {type === "select" ? (
      <select value={value || ""} onChange={(e) => onChange?.(e.target.value)} disabled={disabled}
        className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none bg-white transition ${error ? "border-red-400 bg-red-50 ring-2 ring-red-100" : "border-gray-200 focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300"}`}>
        <option value="">Select</option>
        {options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : type === "textarea" ? (
      <textarea rows={rows || 3} value={value || ""} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
        className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none transition resize-none ${error ? "border-red-400 bg-red-50 ring-2 ring-red-100" : "border-gray-200 focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300"}`} />
    ) : type === "radio" ? (
      <div className={`pt-1 ${error ? "p-3 bg-red-50 border-2 border-red-300 rounded-xl" : ""}`}>
        <div className="flex flex-wrap gap-4">
          {options?.map((o) => (
            <label key={o} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name={name} checked={value === o} onChange={() => onChange?.(o)} className="accent-[#007848]" />
              <span className="text-sm text-gray-700">{o}</span>
            </label>
          ))}
        </div>
      </div>
    ) : (
      <input type={type || "text"} value={value || ""} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} disabled={disabled}
        className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none transition ${error ? "border-red-400 bg-red-50 ring-2 ring-red-100" : "border-gray-200 focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300"}`} />
    )}
    {hint && !error && <p className="text-[11px] text-gray-400 italic mt-1">{hint}</p>}
    {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
  </div>
);

interface FormData {
  studentId: string; schoolId: string; academicYear: string; department: string; courseOrStrand: string;
  fullName: string; email: string; contactNumber: string; birthday: string; age: string; address: string;
  academicDifficultSubjects: string; academicStudyHabits: string; academicLearningDifficulties: string; academicConcerns: string;
  personalProblems: string; personalAdjustment: string; personalFamilyConcerns: string;
  emotionalStressLevel: string; emotionalAnxiety: string; emotionalMotivation: string; emotionalSelfConfidence: string;
  socialClassmates: string; socialFriendships: string; socialCommunication: string; socialBullying: string;
  financialAllowance: string; financialExpenses: string; financialScholarship: string;
  careerGoal: string; careerUncertainty: string; careerSkills: string;
  healthMedical: string; healthPhysicalLimitations: string;
  supportCounseling: boolean; supportAcademic: boolean; supportScholarship: boolean; supportCareer: boolean;
  supportOther: string; otherConcerns: string;
}

const defaultForm: FormData = {
  studentId: "", schoolId: "", academicYear: "", department: "", courseOrStrand: "",
  fullName: "", email: "", contactNumber: "", birthday: "", age: "", address: "",
  academicDifficultSubjects: "", academicStudyHabits: "", academicLearningDifficulties: "", academicConcerns: "",
  personalProblems: "", personalAdjustment: "", personalFamilyConcerns: "",
  emotionalStressLevel: "", emotionalAnxiety: "", emotionalMotivation: "", emotionalSelfConfidence: "",
  socialClassmates: "", socialFriendships: "", socialCommunication: "", socialBullying: "",
  financialAllowance: "", financialExpenses: "", financialScholarship: "",
  careerGoal: "", careerUncertainty: "", careerSkills: "",
  healthMedical: "", healthPhysicalLimitations: "",
  supportCounseling: false, supportAcademic: false, supportScholarship: false, supportCareer: false,
  supportOther: "", otherConcerns: "",
};

export default function StudentNeedsAssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose");
  const [mode, setMode] = useState<"new" | "existing" | null>(null);

  // Lookup
  const [lookupId, setLookupId] = useState("");
  const [lookedUpStudent, setLookedUpStudent] = useState<any>(null);
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  // Verification
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [verifySent, setVerifySent] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  // Form
  const [form, setForm] = useState<FormData>({ ...defaultForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Dropdown data
  const [academicYears, setAcademicYears] = useState<{ year: string }[]>([]);
  const [collegeCourses, setCollegeCourses] = useState<{ name: string; code?: string | null }[]>([]);
  const [shsStrands, setShsStrands] = useState<{ name: string; code?: string | null }[]>([]);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then(setCollegeCourses)
      .catch(() => {});
    fetch("/api/strands")
      .then((r) => r.json())
      .then(setShsStrands)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { getCrfFormData } = await import("@/lib/actions");
        const data = await getCrfFormData();
        setAcademicYears(data.years || []);
      } catch {}
    };
    load();
  }, []);

  const updateForm = (key: keyof FormData) => (val: string) => setForm((p) => ({ ...p, [key]: val }));

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    const allFields: { key: keyof FormData; label: string }[] = [
      { key: "academicYear", label: "Academic Year" },
      { key: "department", label: "Department" },
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "contactNumber", label: "Contact Number" },
      { key: "birthday", label: "Birthday" },
      { key: "age", label: "Age" },
      { key: "academicDifficultSubjects", label: "Subjects na hirap ka" },
      { key: "academicStudyHabits", label: "Study habits" },
      { key: "academicLearningDifficulties", label: "Learning difficulties" },
      { key: "academicConcerns", label: "Academic concerns" },
      { key: "personalProblems", label: "Personal problems" },
      { key: "personalAdjustment", label: "Adjustment issues" },
      { key: "personalFamilyConcerns", label: "Family concerns" },
      { key: "emotionalAnxiety", label: "Emotional concerns" },
      { key: "emotionalMotivation", label: "Motivation issues" },
      { key: "emotionalSelfConfidence", label: "Self-confidence concerns" },
      { key: "socialClassmates", label: "Relationship with classmates" },
      { key: "socialFriendships", label: "Friendships" },
      { key: "socialCommunication", label: "Communication" },
      { key: "socialBullying", label: "Bullying concerns" },
      { key: "financialAllowance", label: "Allowance concerns" },
      { key: "financialExpenses", label: "School expenses" },
      { key: "financialScholarship", label: "Scholarship needs" },
      { key: "careerGoal", label: "Career goal" },
      { key: "careerUncertainty", label: "Course uncertainty" },
      { key: "careerSkills", label: "Skills or interests" },
      { key: "healthMedical", label: "Medical condition" },
      { key: "healthPhysicalLimitations", label: "Physical limitations" },
      { key: "supportOther", label: "Other support" },
      { key: "otherConcerns", label: "Other concerns" },
    ];
    for (const { key, label } of allFields) {
      if (key === "emotionalStressLevel") continue;
      if (typeof form[key] === "string" && !(form[key] as string).trim()) newErrors[key] = `${label} is required`;
    }
    if (!form.emotionalStressLevel) newErrors.emotionalStressLevel = "Stress level is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (form.contactNumber && !/^0\d{9,10}$/.test(form.contactNumber.replace(/[\s-]/g, ""))) newErrors.contactNumber = "Invalid format (e.g. 09XXXXXXXXX)";
    setErrors(newErrors);
    return true; // show errors but never block — empty fields become "N/A" on submit
  }

  useEffect(() => {
    if (errors) {
      const cleared = { ...errors };
      let changed = false;
      for (const key of Object.keys(cleared)) {
        if (typeof form[key as keyof FormData] === "string" && (form[key as keyof FormData] as string).trim()) {
          delete cleared[key];
          changed = true;
        }
      }
      if (changed) setErrors(cleared);
    }
  }, [form]);

  async function handleLookup() {
    if (!lookupId.trim()) { setLookupError("Enter a Student ID"); return; }
    setLookupLoading(true);
    setLookupError("");
    try {
      const { lookupStudentForSna } = await import("@/lib/actions");
      const student = await lookupStudentForSna(lookupId.trim());
      if (!student) { setLookupError("No student found with that ID."); return; }
      setLookedUpStudent(student);
      setVerifyEmail(student.email || "");
      if (!student.email) { setLookupError("No email on record. Contact the Guidance Office."); return; }
      setStep("verify");
    } catch (e: any) {
      setLookupError(e.message || "Lookup failed");
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSendCode() {
    setVerifyLoading(true);
    setVerifyError("");
    try {
      const { sendCumulativeRecordCode } = await import("@/lib/actions");
      await sendCumulativeRecordCode(verifyEmail, lookupId);
      setVerifySent(true);
    } catch (e: any) {
      setVerifyError(e.message || "Failed to send code");
    } finally {
      setVerifyLoading(false);
    }
  }

  async function handleVerifyCode() {
    if (verifyCode.length < 6) { setVerifyError("Enter the 6-digit code"); return; }
    setVerifyLoading(true);
    setVerifyError("");
    try {
      const { verifyCumulativeRecordCode, getStudentNeedsAssessment } = await import("@/lib/actions");
      const ok = await verifyCumulativeRecordCode(verifyEmail, verifyCode);
      if (!ok) { setVerifyError("Invalid or expired code"); return; }
      if (lookedUpStudent) {
        const lookupVal = lookedUpStudent.studentId || lookedUpStudent.schoolId || lookupId.trim();
        const existing = await getStudentNeedsAssessment(lookupVal);
        if (existing) {
          setForm({
            studentId: existing.studentId || "",
            schoolId: existing.schoolId || "",
            academicYear: existing.academicYear || "",
            department: existing.department || "",
            courseOrStrand: existing.courseOrStrand || "",
            fullName: existing.fullName || "",
            email: existing.email || "",
            contactNumber: existing.contactNumber || "",
            birthday: existing.birthday || "",
            age: existing.age || "",
            address: existing.address || "",
            academicDifficultSubjects: existing.academicDifficultSubjects || "",
            academicStudyHabits: existing.academicStudyHabits || "",
            academicLearningDifficulties: existing.academicLearningDifficulties || "",
            academicConcerns: existing.academicConcerns || "",
            personalProblems: existing.personalProblems || "",
            personalAdjustment: existing.personalAdjustment || "",
            personalFamilyConcerns: existing.personalFamilyConcerns || "",
            emotionalStressLevel: existing.emotionalStressLevel || "",
            emotionalAnxiety: existing.emotionalAnxiety || "",
            emotionalMotivation: existing.emotionalMotivation || "",
            emotionalSelfConfidence: existing.emotionalSelfConfidence || "",
            socialClassmates: existing.socialClassmates || "",
            socialFriendships: existing.socialFriendships || "",
            socialCommunication: existing.socialCommunication || "",
            socialBullying: existing.socialBullying || "",
            financialAllowance: existing.financialAllowance || "",
            financialExpenses: existing.financialExpenses || "",
            financialScholarship: existing.financialScholarship || "",
            careerGoal: existing.careerGoal || "",
            careerUncertainty: existing.careerUncertainty || "",
            careerSkills: existing.careerSkills || "",
            healthMedical: existing.healthMedical || "",
            healthPhysicalLimitations: existing.healthPhysicalLimitations || "",
            supportCounseling: existing.supportCounseling || false,
            supportAcademic: existing.supportAcademic || false,
            supportScholarship: existing.supportScholarship || false,
            supportCareer: existing.supportCareer || false,
            supportOther: existing.supportOther || "",
            otherConcerns: existing.otherConcerns || "",
          });
        } else {
          setForm((p) => ({
            ...p,
            studentId: lookedUpStudent.studentId || "",
            schoolId: lookedUpStudent.schoolId || lookedUpStudent.studentId || "",
            fullName: lookedUpStudent.fullName || "",
            email: lookedUpStudent.email || "",
            contactNumber: lookedUpStudent.contact || "",
          }));
        }
      }
      setStep("form");
    } catch (e: any) {
      setVerifyError(e.message || "Verification failed");
    } finally {
      setVerifyLoading(false);
    }
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaveLoading(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const fd = new FormData();
      for (const [key, val] of Object.entries(form)) {
        if (typeof val === "boolean") {
          fd.set(key, val ? "on" : "off");
        } else {
          fd.append(key, val || "");
        }
      }
      const { saveStudentNeedsAssessment } = await import("@/lib/actions");
      await saveStudentNeedsAssessment(fd);
      setSaveSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setSaveError(e.message || "Failed to submit");
    } finally {
      setSaveLoading(false);
    }
  }

  function resetAll() {
    setStep("choose");
    setMode(null);
    setLookupId("");
    setLookedUpStudent(null);
    setLookupError("");
    setVerifyEmail("");
    setVerifyCode("");
    setVerifySent(false);
    setVerifyError("");
    setForm({ ...defaultForm });
    setErrors({});
    setSaveSuccess(false);
    setSaveError("");
  }

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

        {/* ── Choose Step ── */}
        {step === "choose" && (
          <section className="py-12 px-4 max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">How would you like to proceed?</h2>
              <p className="text-gray-500 text-sm">Choose whether this is your first time or you&apos;re continuing a previous assessment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button onClick={() => { setMode("new"); setStep("form"); }}
                className="group text-center p-8 md:p-10 rounded-2xl border-2 border-gray-200 hover:border-[#007848] hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer bg-white">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#007848] to-[#00a864] flex items-center justify-center shadow-lg shadow-[#007848]/20 mb-5 group-hover:scale-110 transition-transform">
                  <FaClipboardList className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">New Assessment</h3>
                <p className="text-sm text-gray-500">Start a fresh needs assessment form.</p>
              </button>
              <button onClick={() => { setMode("existing"); setStep("lookup"); }}
                className="group text-center p-8 md:p-10 rounded-2xl border-2 border-gray-200 hover:border-[#007848] hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer bg-white">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#007848] to-[#00a864] flex items-center justify-center shadow-lg shadow-[#007848]/20 mb-5 group-hover:scale-110 transition-transform">
                  <FaUser className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Existing Record</h3>
                <p className="text-sm text-gray-500">Look up your previous assessment to update or view.</p>
              </button>
            </div>
          </section>
        )}

        {/* ── Lookup Step ── */}
        {step === "lookup" && (
          <section className="py-12 px-4 max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <button onClick={() => setStep("choose")} className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5 mb-6 cursor-pointer">
                <FaArrowLeft className="text-xs" /> Back
              </button>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Student Lookup</h3>
              <p className="text-sm text-gray-500 mb-6">Enter your Student ID to retrieve your information.</p>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Student ID</label>
                <input value={lookupId} onChange={(e) => setLookupId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  placeholder="Enter your student ID" autoFocus
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300 transition" />
              </div>
              {lookupError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                  <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{lookupError}</p>
                </div>
              )}
              <button onClick={handleLookup} disabled={lookupLoading}
                className="w-full px-5 py-3 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-sm font-bold rounded-xl hover:from-[#005f3a] hover:to-[#008f56] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#007848]/20 disabled:opacity-70">
                {lookupLoading ? "Searching..." : <>Search <FaArrowRight className="text-xs" /></>}
              </button>
            </div>
          </section>
        )}

        {/* ── Verify Step ── */}
        {step === "verify" && (
          <section className="py-12 px-4 max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              {!verifySent ? (
                <>
                  <button onClick={() => setStep("lookup")} className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5 mb-6 cursor-pointer">
                    <FaArrowLeft className="text-xs" /> Back
                  </button>
                  {lookedUpStudent && (
                    <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                      <FaCheckCircle className="text-green-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">Student Found</p>
                        <p className="text-xs text-green-600">{lookedUpStudent.fullName}</p>
                      </div>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Verify Your Email</h3>
                  <p className="text-sm text-gray-500 mb-6">We&apos;ll send a verification code to <strong>{verifyEmail}</strong></p>
                  {verifyError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                      <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-700">{verifyError}</p>
                    </div>
                  )}
                  <button onClick={handleSendCode} disabled={verifyLoading}
                    className="w-full px-5 py-3 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-sm font-bold rounded-xl hover:from-[#005f3a] hover:to-[#008f56] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#007848]/20 disabled:opacity-70">
                    {verifyLoading ? "Sending..." : <>Send Verification Code</>}
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#007848] to-[#00a864] flex items-center justify-center shadow-lg shadow-[#007848]/20 mb-4">
                      <FaKey className="text-xl text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Enter Verification Code</h3>
                    <p className="text-sm text-gray-500 mt-1">Check <strong>{verifyEmail}</strong> for the code.</p>
                  </div>
                  <input value={verifyCode} onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))} onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                    placeholder="000000" maxLength={6} autoFocus
                    className="w-full text-center text-2xl tracking-[10px] font-bold px-4 py-4 border-2 border-gray-200 rounded-xl outline-none focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 transition" />
                  {verifyError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                      <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-700">{verifyError}</p>
                    </div>
                  )}
                  <button onClick={handleVerifyCode} disabled={verifyLoading}
                    className="w-full mt-4 px-5 py-3 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-sm font-bold rounded-xl hover:from-[#005f3a] hover:to-[#008f56] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#007848]/20 disabled:opacity-70">
                    {verifyLoading ? "Verifying..." : <>Verify <FaCheck className="text-xs" /></>}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-4">
                    Didn&apos;t receive the code?{" "}
                    <button onClick={() => { setVerifySent(false); setVerifyError(""); }} className="text-[#007848] hover:underline cursor-pointer font-semibold">Resend</button>
                  </p>
                </>
              )}
            </div>
          </section>
        )}

        {/* ── Form Step ── */}
        {step === "form" && (
          <section className="py-12 px-4 max-w-5xl mx-auto space-y-5">
            <div className="flex items-center justify-between">
              <button onClick={resetAll} className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5 cursor-pointer">
                <FaArrowLeft className="text-xs" /> Start Over
              </button>
              {mode === "existing" && lookedUpStudent && (
                <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">{lookedUpStudent.fullName}</span>
              )}
            </div>

            {saveSuccess && (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 flex items-start gap-3">
                <FaCheckCircle className="text-green-600 text-lg mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800 text-sm">Assessment Submitted</h3>
                  <p className="text-xs text-green-600 mt-0.5">Your responses have been recorded. The Guidance Office will review them.</p>
                </div>
              </div>
            )}

            {saveError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">{saveError}</p>
              </div>
            )}

            {/* ── Basic Student Profile ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Basic Student Profile / School Information</h2>
              <p className="text-xs text-gray-500 mb-5">Fill in the basic student details to begin.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Current Academic Year (A.Y.)" type="select" options={academicYears.map((y) => y.year)} value={form.academicYear} onChange={updateForm("academicYear")} error={errors.academicYear} />
                <FormField label="Department" type="select" options={["GS", "JHS", "SHS", "College"]} value={form.department} onChange={updateForm("department")} error={errors.department} />
                {form.department === "College" && (
                  <FormField label="Course / Program" type="select" options={collegeCourses.map((c) => c.name)} value={form.courseOrStrand} onChange={updateForm("courseOrStrand")} />
                )}
                {form.department === "SHS" && (
                  <FormField label="Strand" type="select" options={shsStrands.map((s) => s.name)} value={form.courseOrStrand} onChange={updateForm("courseOrStrand")} />
                )}
                {form.department === "GS" && (
                  <FormField label="Grade Level" type="select" options={["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"]} value={form.courseOrStrand} onChange={updateForm("courseOrStrand")} />
                )}
                {form.department === "JHS" && (
                  <FormField label="Grade Level" type="select" options={["Grade 7", "Grade 8", "Grade 9", "Grade 10"]} value={form.courseOrStrand} onChange={updateForm("courseOrStrand")} />
                )}
                <FormField label="School ID (Student ID Number)" value={form.schoolId} onChange={updateForm("schoolId")} placeholder="Enter student ID" />
              </div>
            </div>

            {/* ── Personal Information ── */}
            <SectionCard title="Personal Information" icon={<FaUser className="text-[#007848] text-sm" />} defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Full Name" value={form.fullName} onChange={updateForm("fullName")} placeholder="Enter full name" error={errors.fullName} />
                <FormField label="Email Address" value={form.email} onChange={updateForm("email")} placeholder="your@email.com" error={errors.email} />
                <FormField label="Address" value={form.address} onChange={updateForm("address")} placeholder="Enter complete address" />
                <FormField label="Contact Number" value={form.contactNumber} onChange={updateForm("contactNumber")} placeholder="09XXXXXXXXX" error={errors.contactNumber} />
                <FormField label="Birthday" type="date" value={form.birthday} onChange={updateForm("birthday")} error={errors.birthday} />
                <FormField label="Age" value={form.age} onChange={updateForm("age")} placeholder="e.g. 18" error={errors.age} />
              </div>
            </SectionCard>

            {/* ── 2. Academic Needs ── */}
            <SectionCard title="2. Academic Needs" icon={<FaBook className="text-[#007848] text-sm" />}>
              <div className="space-y-4">
                <FormField label="Subjects na hirap ka o need ng help" type="textarea" rows={2} placeholder="e.g. Math, Science, English..." value={form.academicDifficultSubjects} onChange={updateForm("academicDifficultSubjects")} error={errors.academicDifficultSubjects} hint="Type N/A if not applicable" />
                <FormField label="Study habits (hal. kulang sa time management, focus, etc.)" type="textarea" rows={2} placeholder="Describe your study habits and areas for improvement" value={form.academicStudyHabits} onChange={updateForm("academicStudyHabits")} error={errors.academicStudyHabits} hint="Type N/A if not applicable" />
                <FormField label="Learning difficulties (reading, writing, math, etc.)" type="textarea" rows={2} placeholder="Any learning difficulties you experience" value={form.academicLearningDifficulties} onChange={updateForm("academicLearningDifficulties")} error={errors.academicLearningDifficulties} hint="Type N/A if not applicable" />
                <FormField label="Academic concerns (grades, performance, requirements)" type="textarea" rows={2} placeholder="Concerns about your grades or academic performance" value={form.academicConcerns} onChange={updateForm("academicConcerns")} error={errors.academicConcerns} hint="Type N/A if not applicable" />
              </div>
            </SectionCard>

            {/* ── 3. Personal Needs / Concerns ── */}
            <SectionCard title="3. Personal Needs / Concerns" icon={<FaHeart className="text-[#007848] text-sm" />}>
              <div className="space-y-4">
                <FormField label="Personal problems affecting studies" type="textarea" rows={2} placeholder="Share any personal concerns affecting your studies" value={form.personalProblems} onChange={updateForm("personalProblems")} error={errors.personalProblems} hint="Type N/A if not applicable" />
                <FormField label="Adjustment issues (new school, new environment, etc.)" type="textarea" rows={2} placeholder="How are you adjusting to school?" value={form.personalAdjustment} onChange={updateForm("personalAdjustment")} error={errors.personalAdjustment} hint="Type N/A if not applicable" />
                <FormField label="Family concerns (kung meron at willing i-share)" type="textarea" rows={2} placeholder="Optional: share any family-related concerns" value={form.personalFamilyConcerns} onChange={updateForm("personalFamilyConcerns")} error={errors.personalFamilyConcerns} hint="Type N/A if not applicable" />
              </div>
            </SectionCard>

            {/* ── 4. Emotional Needs ── */}
            <SectionCard title="4. Emotional Needs" icon={<FaSmile className="text-[#007848] text-sm" />}>
              <div className="space-y-4">
                <FormField label="Stress level" type="radio" options={["Low", "Moderate", "High"]} value={form.emotionalStressLevel} onChange={updateForm("emotionalStressLevel")} name="emotionalStressLevel" error={errors.emotionalStressLevel} />
                <FormField label="Feelings of anxiety, sadness, pressure" type="textarea" rows={2} placeholder="Describe any emotional concerns you're experiencing" value={form.emotionalAnxiety} onChange={updateForm("emotionalAnxiety")} error={errors.emotionalAnxiety} hint="Type N/A if not applicable" />
                <FormField label="Motivation issues" type="textarea" rows={2} placeholder="Any issues with motivation or drive" value={form.emotionalMotivation} onChange={updateForm("emotionalMotivation")} error={errors.emotionalMotivation} hint="Type N/A if not applicable" />
                <FormField label="Self-confidence concerns" type="textarea" rows={2} placeholder="Concerns about self-confidence or self-esteem" value={form.emotionalSelfConfidence} onChange={updateForm("emotionalSelfConfidence")} error={errors.emotionalSelfConfidence} hint="Type N/A if not applicable" />
              </div>
            </SectionCard>

            {/* ── 5. Social Needs ── */}
            <SectionCard title="5. Social Needs" icon={<FaUsers className="text-[#007848] text-sm" />}>
              <div className="space-y-4">
                <FormField label="Relationship with classmates" type="textarea" rows={2} placeholder="Describe your relationship with classmates" value={form.socialClassmates} onChange={updateForm("socialClassmates")} error={errors.socialClassmates} hint="Type N/A if not applicable" />
                <FormField label="Friendships / Peer interaction" type="textarea" rows={2} placeholder="How are your friendships and peer interactions?" value={form.socialFriendships} onChange={updateForm("socialFriendships")} error={errors.socialFriendships} hint="Type N/A if not applicable" />
                <FormField label="Communication difficulties" type="textarea" rows={2} placeholder="Any difficulty communicating with others" value={form.socialCommunication} onChange={updateForm("socialCommunication")} error={errors.socialCommunication} hint="Type N/A if not applicable" />
                <FormField label="Bullying concerns (kung meron)" type="textarea" rows={2} placeholder="Optional: share any bullying concerns" value={form.socialBullying} onChange={updateForm("socialBullying")} error={errors.socialBullying} hint="Type N/A if not applicable" />
              </div>
            </SectionCard>

            {/* ── 6. Financial Needs ── */}
            <SectionCard title="6. Financial Needs (optional / if applicable)" icon={<FaMoneyBillWave className="text-[#007848] text-sm" />}>
              <div className="space-y-4">
                <FormField label="Allowance concerns" type="textarea" rows={2} placeholder="Any concerns about your daily allowance" value={form.financialAllowance} onChange={updateForm("financialAllowance")} error={errors.financialAllowance} hint="Type N/A if not applicable" />
                <FormField label="School expenses difficulty" type="textarea" rows={2} placeholder="Difficulty with school expenses" value={form.financialExpenses} onChange={updateForm("financialExpenses")} error={errors.financialExpenses} hint="Type N/A if not applicable" />
                <FormField label="Scholarship needs" type="textarea" rows={2} placeholder="Are you looking for scholarship opportunities?" value={form.financialScholarship} onChange={updateForm("financialScholarship")} error={errors.financialScholarship} hint="Type N/A if not applicable" />
              </div>
            </SectionCard>

            {/* ── 7. Career / Future Plans ── */}
            <SectionCard title="7. Career / Future Plans" icon={<FaBriefcase className="text-[#007848] text-sm" />}>
              <div className="space-y-4">
                <FormField label="Career goal or course interest" type="textarea" rows={2} placeholder="What career or course are you interested in?" value={form.careerGoal} onChange={updateForm("careerGoal")} error={errors.careerGoal} hint="Type N/A if not applicable" />
                <FormField label="Uncertainty sa kukuning course" type="textarea" rows={2} placeholder="Are you unsure about what course to take?" value={form.careerUncertainty} onChange={updateForm("careerUncertainty")} error={errors.careerUncertainty} hint="Type N/A if not applicable" />
                <FormField label="Skills or interests" type="textarea" rows={2} placeholder="What skills or interests do you have?" value={form.careerSkills} onChange={updateForm("careerSkills")} error={errors.careerSkills} hint="Type N/A if not applicable" />
              </div>
            </SectionCard>

            {/* ── 8. Health / Physical Needs ── */}
            <SectionCard title="8. Health / Physical Needs (if applicable)" icon={<FaMedkit className="text-[#007848] text-sm" />}>
              <div className="space-y-4">
                <FormField label="Medical condition (if any)" type="textarea" rows={2} placeholder="Any medical condition we should know about" value={form.healthMedical} onChange={updateForm("healthMedical")} error={errors.healthMedical} hint="Type N/A if not applicable" />
                <FormField label="Physical limitations affecting study" type="textarea" rows={2} placeholder="Any physical limitations affecting your studies" value={form.healthPhysicalLimitations} onChange={updateForm("healthPhysicalLimitations")} error={errors.healthPhysicalLimitations} hint="Type N/A if not applicable" />
              </div>
            </SectionCard>

            {/* ── 9. Support Needed from School ── */}
            <SectionCard title="9. Support Needed from School" icon={<FaHandsHelping className="text-[#007848] text-sm" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: "supportCounseling", label: "Counseling session" },
                    { name: "supportAcademic", label: "Academic assistance" },
                    { name: "supportScholarship", label: "Scholarship guidance" },
                    { name: "supportCareer", label: "Career orientation" },
                  ].map(({ name, label }) => (
                    <label key={name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-[#007848]/5 transition-colors">
                      <input type="checkbox" name={name} checked={form[name as keyof FormData] as boolean} onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.checked }))} className="accent-[#007848] w-4 h-4" />
                      <span className="text-sm text-gray-700 font-medium">{label}</span>
                    </label>
                  ))}
                </div>
                <FormField label="Other support you need" type="textarea" rows={2} placeholder="Any other type of support you need from the school" value={form.supportOther} onChange={updateForm("supportOther")} error={errors.supportOther} hint="Type N/A if not applicable" />
              </div>
            </SectionCard>

            {/* ── 10. Other Concerns ── */}
            <SectionCard title="10. Other Concerns" icon={<FaCommentDots className="text-[#007848] text-sm" />}>
              <FormField label="Anything else na gusto i-share sa Guidance Office" type="textarea" rows={4} placeholder="Share any other thoughts, concerns, or feedback..." value={form.otherConcerns} onChange={updateForm("otherConcerns")} error={errors.otherConcerns} hint="Type N/A if not applicable" />
            </SectionCard>

            {/* ── Actions ── */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={handleSubmit} disabled={saveLoading}
                className="px-8 py-3.5 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-sm font-bold rounded-xl hover:from-[#005f3a] hover:to-[#008f56] transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#007848]/20 disabled:opacity-70">
                {saveLoading ? (
                  <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Submitting...</>
                ) : (
                  <><FaClipboardList className="text-xs" /> Submit Assessment</>
                )}
              </button>
              <button onClick={resetAll} className="px-8 py-3.5 border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-2">
                <FaArrowLeft className="text-xs" /> Cancel
              </button>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <FaClipboardList className="text-blue-600 text-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 text-sm">Confidentiality</h3>
                  <p className="text-xs text-blue-600 mt-1">All assessment responses are kept confidential and will only be used to improve guidance and support services for students. Your honesty helps us serve you better.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </>
  );
}
