"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaFolder, FaArrowLeft, FaUser, FaBook, FaFileAlt, FaIdCard, FaShieldAlt, FaPhoneAlt, FaChevronDown, FaChevronUp, FaSearch, FaEnvelope, FaKey, FaSpinner, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import { useState, useRef, FormEvent, useEffect } from "react";

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

const FormField = ({ label, type, placeholder, options, rows, value, onChange, name, error }: {
  label: string; type?: string; placeholder?: string; options?: string[]; rows?: number;
  value?: string; onChange?: (val: string) => void; name?: string; error?: string;
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    {type === "select" ? (
      <select name={name} value={value || ""} onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none transition bg-white ${error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300"}`}>
        <option value="">Select</option>
        {options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : type === "textarea" ? (
      <textarea name={name} rows={rows || 3} placeholder={placeholder} value={value || ""} onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none transition resize-none ${error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300"}`} />
    ) : (
      <input name={name} type={type || "text"} placeholder={placeholder} value={value || ""} onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none transition ${error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300"}`} />
    )}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const FileUpload = ({ label, description, value, onChange, name }: {
  label: string; description: string; value?: string; onChange?: (file: File | null) => void; name?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
        {fileName && <p className="text-xs text-[#007848] mt-1">{fileName}</p>}
      </div>
      <div>
        <input ref={inputRef} name={name} type="file" accept="image/*,.pdf" className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setFileName(file ? file.name : "");
            onChange?.(file);
          }} />
        <button type="button" onClick={() => inputRef.current?.click()}
          className="px-4 py-2 text-xs font-semibold bg-[#007848] text-white rounded-xl hover:bg-[#005f3a] transition cursor-pointer">
          {fileName ? "Change" : "Upload"}
        </button>
      </div>
    </div>
  );
};

type Step = "choose" | "lookup" | "verify" | "form";

interface FormDataState {
  studentId: string; academicYear: string; department: string; schoolId: string; courseOrStrand: string;
  fullName: string; address: string; contactNumber: string; email: string;
  birthday: string; age: string; nationality: string;
  elemSchool: string; elemYear: string; jhsSchool: string; jhsYear: string;
  shsSchool: string; shsYear: string; collegeProgram: string; collegeYearLevel: string;
  parentName: string; parentRelationship: string; parentContact: string;
  emergencyPerson: string; emergencyRelationship: string; emergencyContact: string;
}

export default function CumulativeRecordPage() {
  const [step, setStep] = useState<Step>("choose");
  const [mode, setMode] = useState<"new" | "existing" | null>(null);
  const [lookupId, setLookupId] = useState("");
  const [lookedUpStudent, setLookedUpStudent] = useState<any>(null);
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [verifySent, setVerifySent] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [existingRecord, setExistingRecord] = useState<any>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [academicYears, setAcademicYears] = useState<{ year: string }[]>([]);
  const [collegeCourses, setCollegeCourses] = useState<{ name: string; code?: string | null }[]>([]);
  const [shsStrands, setShsStrands] = useState<{ name: string; code?: string | null }[]>([]);

  useEffect(() => {
    if (step === "form") {
      import("@/lib/actions").then(({ getCrfFormData }) =>
        getCrfFormData().then((data) => {
          setAcademicYears(data.years);
          setCollegeCourses(data.courses);
          setShsStrands(data.strands);
        })
      );
    }
  }, [step]);

  const [form, setForm] = useState<FormDataState>({
    studentId: "", academicYear: "", department: "", schoolId: "", courseOrStrand: "",
    fullName: "", address: "", contactNumber: "", email: "",
    birthday: "", age: "", nationality: "",
    elemSchool: "", elemYear: "", jhsSchool: "", jhsYear: "",
    shsSchool: "", shsYear: "", collegeProgram: "", collegeYearLevel: "",
    parentName: "", parentRelationship: "", parentContact: "",
    emergencyPerson: "", emergencyRelationship: "", emergencyContact: "",
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateForm = (key: keyof FormDataState) => (val: string) => setForm(prev => ({ ...prev, [key]: val }));

  async function handleLookup() {
    if (!lookupId.trim()) return;
    setLookupLoading(true);
    setLookupError("");
    setLookedUpStudent(null);
    try {
      const { lookupStudentByStudentId } = await import("@/lib/actions");
      const student = await lookupStudentByStudentId(lookupId.trim());
      if (!student) {
        setLookupError("No student found with that ID. Please try again or choose New Record.");
        return;
      }
      setLookedUpStudent(student);
      setVerifyEmail(student.email || "");
      if (!student.email) {
        setLookupError("No email on record for this student. Please contact the Guidance Office.");
        return;
      }
    } catch (e: any) {
      setLookupError(e.message || "Lookup failed");
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSendCode() {
    if (!verifyEmail) return;
    setVerifyLoading(true);
    setVerifyError("");
    try {
      const { sendCumulativeRecordCode } = await import("@/lib/actions");
      await sendCumulativeRecordCode(verifyEmail, lookupId.trim());
      setVerifySent(true);
    } catch (e: any) {
      setVerifyError(e.message || "Failed to send code");
    } finally {
      setVerifyLoading(false);
    }
  }

  async function handleVerifyCode() {
    if (!verifyCode.trim()) return;
    setVerifyLoading(true);
    setVerifyError("");
    try {
      const { verifyCumulativeRecordCode, getCumulativeRecord } = await import("@/lib/actions");
      await verifyCumulativeRecordCode(verifyEmail, verifyCode.trim());
      setCodeVerified(true);
      const existing = await getCumulativeRecord(lookupId.trim());
      const student = lookedUpStudent;
      if (existing) {
        setExistingRecord(existing);
        setForm({
          studentId: existing.studentId || student?.studentId || "",
          academicYear: existing.academicYear || "", department: existing.department || "",
          schoolId: existing.schoolId || student?.studentId || "",
          courseOrStrand: existing.collegeProgram || "",
          fullName: existing.fullName || `${student?.givenName || ""} ${student?.middleName || ""} ${student?.familyName || ""}`.trim(),
          address: existing.address || "",
          contactNumber: existing.contactNumber || "",
          email: existing.email || student?.email || "",
          birthday: existing.birthday || "", age: existing.age || "", nationality: existing.nationality || "",
          elemSchool: existing.elemSchool || "", elemYear: existing.elemYear || "",
          jhsSchool: existing.jhsSchool || "", jhsYear: existing.jhsYear || "",
          shsSchool: existing.shsSchool || "", shsYear: existing.shsYear || "",
          collegeProgram: existing.collegeProgram || "", collegeYearLevel: existing.collegeYearLevel || "",
          parentName: existing.parentName || "", parentRelationship: existing.parentRelationship || "",
          parentContact: existing.parentContact || "", emergencyPerson: existing.emergencyPerson || "",
          emergencyRelationship: existing.emergencyRelationship || "", emergencyContact: existing.emergencyContact || "",
        });
      } else {
        setForm(prev => ({
          ...prev,
          studentId: student?.studentId || "",
          schoolId: student?.studentId || "",
          fullName: `${student?.givenName || ""} ${student?.middleName || ""} ${student?.familyName || ""}`.trim(),
          email: student?.email || "",
        }));
      }
      setStep("form");
    } catch (e: any) {
      setVerifyError(e.message || "Verification failed");
    } finally {
      setVerifyLoading(false);
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    const baseRequired: { key: keyof FormDataState; label: string }[] = [
      { key: "academicYear", label: "Academic Year" },
      { key: "department", label: "Department" },
      { key: "schoolId", label: "School ID" },
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email Address" },
      { key: "address", label: "Address" },
      { key: "contactNumber", label: "Contact Number" },
      { key: "birthday", label: "Birthday" },
      { key: "age", label: "Age" },
      { key: "nationality", label: "Nationality" },
      { key: "parentName", label: "Parent/Guardian Name" },
      { key: "parentRelationship", label: "Parent Relationship" },
      { key: "parentContact", label: "Parent Contact" },
      { key: "emergencyPerson", label: "Emergency Contact Person" },
      { key: "emergencyRelationship", label: "Emergency Relationship" },
      { key: "emergencyContact", label: "Emergency Contact Number" },
    ];
    const dept = form.department;
    const eduRequired: { key: keyof FormDataState; label: string }[] = [];
    if (dept === "JHS" || dept === "SHS" || dept === "College") {
      eduRequired.push(
        { key: "elemSchool", label: "Elementary School Name" },
        { key: "elemYear", label: "Elementary Year Graduated" },
      );
    }
    if (dept === "SHS" || dept === "College") {
      eduRequired.push(
        { key: "jhsSchool", label: "JHS School Name" },
        { key: "jhsYear", label: "JHS Year Graduated" },
      );
    }
    if (dept === "College") {
      eduRequired.push(
        { key: "shsSchool", label: "SHS School Name" },
        { key: "shsYear", label: "SHS Year Graduated" },
      );
    }
    for (const { key, label } of [...baseRequired, ...eduRequired]) {
      if (!form[key]?.trim()) {
        newErrors[key] = `${label} is required`;
      }
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (form.contactNumber && !/^0\d{9,10}$/.test(form.contactNumber.replace(/[\s-]/g, ""))) {
      newErrors.contactNumber = "Invalid contact number (e.g. 09XXXXXXXXX)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  useEffect(() => {
    if (errors) {
      const cleared = { ...errors };
      let changed = false;
      for (const key of Object.keys(cleared)) {
        if (form[key as keyof FormDataState]?.trim()) {
          delete cleared[key];
          changed = true;
        }
      }
      if (changed) setErrors(cleared);
    }
  }, [form]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaveLoading(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val || ""));
      if (!form.studentId && lookedUpStudent) {
        formData.set("studentId", lookedUpStudent.studentId);
      }
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });
      const { saveCumulativeRecord } = await import("@/lib/actions");
      const result = await saveCumulativeRecord(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e: any) {
      setSaveError(e.message || "Failed to save record");
    } finally {
      setSaveLoading(false);
    }
  }

  function handleNewRecord() {
    setMode("new");
    setStep("form");
  }

  function handleExistingRecord() {
    setMode("existing");
    setStep("lookup");
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
    setCodeVerified(false);
    setVerifyError("");
    setSaveSuccess(false);
    setSaveError("");
    setExistingRecord(null);
    setFiles({});
    setForm({
      studentId: "", academicYear: "", department: "", schoolId: "", courseOrStrand: "",
      fullName: "", address: "", contactNumber: "", email: "",
      birthday: "", age: "", nationality: "",
      elemSchool: "", elemYear: "", jhsSchool: "", jhsYear: "",
      shsSchool: "", shsYear: "", collegeProgram: "", collegeYearLevel: "",
      parentName: "", parentRelationship: "", parentContact: "",
      emergencyPerson: "", emergencyRelationship: "", emergencyContact: "",
    });
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
          {/* ── Choose New/Existing ── */}
          {step === "choose" && (
            <div className="max-w-lg mx-auto">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Welcome to your Cumulative Record</h2>
              <p className="text-sm text-gray-500 text-center mb-8">Choose an option to continue</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={handleNewRecord}
                  className="p-8 rounded-2xl border-2 border-gray-100 hover:border-[#007848] hover:bg-[#007848]/5 transition-all cursor-pointer text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-[#007848]/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FaFileAlt className="text-xl text-[#007848]" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">New Record</h3>
                  <p className="text-xs text-gray-500">Create a new cumulative record for a student</p>
                </button>
                <button onClick={handleExistingRecord}
                  className="p-8 rounded-2xl border-2 border-gray-100 hover:border-[#007848] hover:bg-[#007848]/5 transition-all cursor-pointer text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-[#007848]/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FaSearch className="text-xl text-[#007848]" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Existing Record</h3>
                  <p className="text-xs text-gray-500">Look up and update an existing record</p>
                </button>
              </div>
            </div>
          )}

          {/* ── Lookup Student ── */}
          {step === "lookup" && (
            <div className="max-w-md mx-auto">
              <button onClick={() => { setStep("choose"); setMode(null); setLookupError(""); }}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6 text-sm cursor-pointer">
                <FaArrowLeft className="text-xs" /> Back
              </button>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="w-12 h-12 rounded-2xl bg-[#007848]/10 flex items-center justify-center mb-4">
                  <FaSearch className="text-lg text-[#007848]" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Find Your Record</h2>
                <p className="text-xs text-gray-500 mb-6">Enter your Student ID number to look up your record.</p>
                <input value={lookupId} onChange={(e) => setLookupId(e.target.value)} placeholder="Enter Student ID"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 mb-4 transition" />
                {lookupError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-xl mb-4">
                    <FaExclamationTriangle className="text-red-500 text-xs mt-0.5 shrink-0" />
                    <p className="text-xs text-red-700">{lookupError}</p>
                  </div>
                )}
                <button onClick={handleLookup} disabled={lookupLoading || !lookupId.trim()}
                  className="w-full py-3 bg-[#007848] text-white text-sm font-bold rounded-xl hover:bg-[#005f3a] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center gap-2">
                  {lookupLoading ? <><FaSpinner className="animate-spin" /> Searching...</> : "Search"}
                </button>
              </div>

              {lookedUpStudent && !lookupError && !verifySent && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <FaCheckCircle className="text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Student Found</p>
                      <p className="text-xs text-gray-500">{lookedUpStudent.givenName} {lookedUpStudent.middleName || ""} {lookedUpStudent.familyName}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">A verification code will be sent to <strong>{verifyEmail}</strong></p>
                  <button onClick={handleSendCode} disabled={verifyLoading}
                    className="w-full py-3 bg-[#007848] text-white text-sm font-bold rounded-xl hover:bg-[#005f3a] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center gap-2">
                    {verifyLoading ? <><FaSpinner className="animate-spin" /> Sending...</> : <><FaEnvelope /> Send Verification Code</>}
                  </button>
                </div>
              )}

              {verifySent && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mt-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#007848]/10 flex items-center justify-center mb-4">
                    <FaKey className="text-lg text-[#007848]" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1">Enter Verification Code</h2>
                  <p className="text-xs text-gray-500 mb-4">A 6-digit code was sent to <strong>{verifyEmail}</strong></p>
                  <input value={verifyCode} onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000" maxLength={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 mb-4 text-center text-2xl font-bold tracking-[8px] transition" />
                  {verifyError && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-xl mb-4">
                      <FaExclamationTriangle className="text-red-500 text-xs mt-0.5 shrink-0" />
                      <p className="text-xs text-red-700">{verifyError}</p>
                    </div>
                  )}
                  <button onClick={handleVerifyCode} disabled={verifyLoading || verifyCode.length < 6}
                    className="w-full py-3 bg-[#007848] text-white text-sm font-bold rounded-xl hover:bg-[#005f3a] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center gap-2">
                    {verifyLoading ? <><FaSpinner className="animate-spin" /> Verifying...</> : "Verify"}
                  </button>
                  <button onClick={handleSendCode} disabled={verifyLoading}
                    className="w-full mt-2 py-2 text-xs text-[#007848] font-semibold hover:underline cursor-pointer disabled:opacity-50">
                    Resend Code
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── The Form ── */}
          {step === "form" && (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between">
                <button type="button" onClick={resetAll}
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm cursor-pointer">
                  <FaArrowLeft className="text-xs" /> {mode === "existing" ? "Start Over" : "Back"}
                </button>
                {mode === "existing" && lookedUpStudent && (
                  <p className="text-xs text-gray-500">Student: <span className="font-semibold text-gray-700">{lookedUpStudent.givenName} {lookedUpStudent.familyName}</span></p>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Basic Student Profile / School Information</h2>
                <p className="text-xs text-gray-500 mb-5">Fill in the basic student details to begin.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Current Academic Year (A.Y.)" type="select" name="academicYear" options={academicYears.map(y => y.year)} value={form.academicYear} onChange={updateForm("academicYear")} error={errors.academicYear} />
                  <FormField label="Department" type="select" name="department" options={["GS", "JHS", "SHS", "College"]} value={form.department} onChange={updateForm("department")} error={errors.department} />
                  {form.department === "College" && (
                    <FormField label="Course / Program" type="select" name="courseOrStrand" options={collegeCourses.map(c => c.name)} value={form.courseOrStrand} onChange={updateForm("courseOrStrand")} error={errors.courseOrStrand} />
                  )}
                  {form.department === "SHS" && (
                    <FormField label="Strand" type="select" name="courseOrStrand" options={shsStrands.map(s => s.name)} value={form.courseOrStrand} onChange={updateForm("courseOrStrand")} error={errors.courseOrStrand} />
                  )}
                  {form.department === "GS" && (
                    <FormField label="Grade Level" type="select" name="courseOrStrand" options={["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"]} value={form.courseOrStrand} onChange={updateForm("courseOrStrand")} error={errors.courseOrStrand} />
                  )}
                  {form.department === "JHS" && (
                    <FormField label="Grade Level" type="select" name="courseOrStrand" options={["Grade 7", "Grade 8", "Grade 9", "Grade 10"]} value={form.courseOrStrand} onChange={updateForm("courseOrStrand")} error={errors.courseOrStrand} />
                  )}
                  <FormField label="School ID (Student ID Number)" name="schoolId" placeholder="Enter student ID" value={form.schoolId} onChange={updateForm("schoolId")} error={errors.schoolId} />
                </div>
              </div>

              <SectionCard title="1. Personal Information" icon={<FaUser className="text-[#007848] text-sm" />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Full Name" name="fullName" placeholder="Enter full name" value={form.fullName} onChange={updateForm("fullName")} error={errors.fullName} />
                  <FormField label="Email Address" name="email" placeholder="Enter email address" value={form.email} onChange={updateForm("email")} error={errors.email} />
                  <FormField label="Address" name="address" placeholder="Enter complete address" value={form.address} onChange={updateForm("address")} error={errors.address} />
                  <FormField label="Contact Number" name="contactNumber" placeholder="09XXXXXXXXX" value={form.contactNumber} onChange={updateForm("contactNumber")} error={errors.contactNumber} />
                  <FormField label="Birthday" type="date" name="birthday" value={form.birthday} onChange={updateForm("birthday")} error={errors.birthday} />
                  <FormField label="Age" name="age" placeholder="e.g. 18" value={form.age} onChange={updateForm("age")} error={errors.age} />
                  <FormField label="Nationality" name="nationality" placeholder="e.g. Filipino" value={form.nationality} onChange={updateForm("nationality")} error={errors.nationality} />
                </div>
              </SectionCard>

              <SectionCard title="2. Educational Background" icon={<FaBook className="text-[#007848] text-sm" />}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-700 md:col-span-2">Elementary School</h4>
                    <FormField label="School Name" name="elemSchool" placeholder="Enter school name" value={form.elemSchool} onChange={updateForm("elemSchool")} error={errors.elemSchool} />
                    <FormField label="Year Graduated" name="elemYear" placeholder="e.g. 2020" value={form.elemYear} onChange={updateForm("elemYear")} error={errors.elemYear} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-700 md:col-span-2">Junior High School</h4>
                    <FormField label="School Name" name="jhsSchool" placeholder="Enter school name" value={form.jhsSchool} onChange={updateForm("jhsSchool")} error={errors.jhsSchool} />
                    <FormField label="Year Graduated" name="jhsYear" placeholder="e.g. 2024" value={form.jhsYear} onChange={updateForm("jhsYear")} error={errors.jhsYear} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-700 md:col-span-2">Senior High School</h4>
                    <FormField label="School Name" name="shsSchool" placeholder="Enter school name" value={form.shsSchool} onChange={updateForm("shsSchool")} error={errors.shsSchool} />
                    <FormField label="Year Graduated" name="shsYear" placeholder="e.g. 2026" value={form.shsYear} onChange={updateForm("shsYear")} error={errors.shsYear} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-700 md:col-span-2">College</h4>
                    <FormField label="Program / Course" name="collegeProgram" placeholder="e.g. BS Information Technology" value={form.collegeProgram} onChange={updateForm("collegeProgram")} />
                    <FormField label="Year Level" name="collegeYearLevel" placeholder="e.g. 1st Year" value={form.collegeYearLevel} onChange={updateForm("collegeYearLevel")} />
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="3. Admission / Enrollment Records" icon={<FaFileAlt className="text-[#007848] text-sm" />}>
                <div className="space-y-4">
                  <FileUpload label="Certificate of Registration (COR)" description="Upload your latest COR" name="corUpload" onChange={(f) => setFiles(prev => ({ ...prev, corUpload: f }))} />
                  <FileUpload label="Enrollment Form / Admission Form" description="Upload enrollment or admission form" name="enrollmentFormUpload" onChange={(f) => setFiles(prev => ({ ...prev, enrollmentFormUpload: f }))} />
                  <FileUpload label="Student Admission/Registration Record" description="Upload admission record if applicable" name="admissionRecordUpload" onChange={(f) => setFiles(prev => ({ ...prev, admissionRecordUpload: f }))} />
                </div>
              </SectionCard>

              <SectionCard title="4. Academic Records" icon={<FaBook className="text-[#007848] text-sm" />}>
                <div className="space-y-4">
                  <FileUpload label="Report Card / Grades (Form 138 or equivalent)" description="Upload your report card" name="reportCardUpload" onChange={(f) => setFiles(prev => ({ ...prev, reportCardUpload: f }))} />
                  <FileUpload label="Transcript of Records (Form 137 or equivalent)" description="Upload TOR if applicable" name="torUpload" onChange={(f) => setFiles(prev => ({ ...prev, torUpload: f }))} />
                  <FileUpload label="Subject Load / Class Schedule" description="Upload your class schedule" name="subjectLoadUpload" onChange={(f) => setFiles(prev => ({ ...prev, subjectLoadUpload: f }))} />
                </div>
              </SectionCard>

              <SectionCard title="5. Personal Documents" icon={<FaIdCard className="text-[#007848] text-sm" />}>
                <div className="space-y-4">
                  <FileUpload label="Photocopy of Birth Certificate (PSA)" description="Upload PSA birth certificate" name="psaBirthCertUpload" onChange={(f) => setFiles(prev => ({ ...prev, psaBirthCertUpload: f }))} />
                  <FileUpload label="2x2 ID Picture" description="Upload recent 2x2 ID picture" name="idPictureUpload" onChange={(f) => setFiles(prev => ({ ...prev, idPictureUpload: f }))} />
                  <FileUpload label="Valid School ID / Student ID Copy" description="Upload a copy of your school ID" name="schoolIdUpload" onChange={(f) => setFiles(prev => ({ ...prev, schoolIdUpload: f }))} />
                </div>
              </SectionCard>

              <SectionCard title="6. Character and Conduct" icon={<FaShieldAlt className="text-[#007848] text-sm" />}>
                <div className="space-y-4">
                  <FileUpload label="Good Moral Certificate" description="Upload or request good moral certificate" name="goodMoralUpload" onChange={(f) => setFiles(prev => ({ ...prev, goodMoralUpload: f }))} />
                  <FileUpload label="Discipline / Conduct Record" description="Upload conduct record if applicable" name="conductRecordUpload" onChange={(f) => setFiles(prev => ({ ...prev, conductRecordUpload: f }))} />
                </div>
              </SectionCard>

              <SectionCard title="7. Emergency Information" icon={<FaPhoneAlt className="text-[#007848] text-sm" />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Parent/Guardian Name" name="parentName" placeholder="Enter parent/guardian name" value={form.parentName} onChange={updateForm("parentName")} error={errors.parentName} />
                  <FormField label="Relationship" name="parentRelationship" placeholder="e.g. Mother, Father" value={form.parentRelationship} onChange={updateForm("parentRelationship")} error={errors.parentRelationship} />
                  <FormField label="Parent/Guardian Contact" name="parentContact" placeholder="09XXXXXXXXX" value={form.parentContact} onChange={updateForm("parentContact")} error={errors.parentContact} />
                  <FormField label="Emergency Contact Person" name="emergencyPerson" placeholder="Enter contact person name" value={form.emergencyPerson} onChange={updateForm("emergencyPerson")} error={errors.emergencyPerson} />
                  <FormField label="Relationship" name="emergencyRelationship" placeholder="e.g. Aunt, Uncle" value={form.emergencyRelationship} onChange={updateForm("emergencyRelationship")} error={errors.emergencyRelationship} />
                  <FormField label="Emergency Contact Number" name="emergencyContact" placeholder="09XXXXXXXXX" value={form.emergencyContact} onChange={updateForm("emergencyContact")} error={errors.emergencyContact} />
                </div>
              </SectionCard>

              {saveSuccess && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <FaCheckCircle className="text-green-600 shrink-0" />
                  <p className="text-sm text-green-700 font-semibold">Record saved successfully!</p>
                </div>
              )}
              {saveError && (
                <div className="flex items-start gap-2 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <FaExclamationTriangle className="text-red-500 text-xs mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{saveError}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" disabled={saveLoading}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-sm font-bold rounded-xl hover:from-[#005f3a] hover:to-[#008f56] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#007848]/20">
                  {saveLoading ? <><FaSpinner className="animate-spin" /> Saving...</> : <><FaFolder className="text-xs" /> Save Record</>}
                </button>
                <button type="button" onClick={resetAll}
                  className="px-8 py-3.5 border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-2">
                  <FaArrowLeft className="text-xs" /> Cancel
                </button>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
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
            </form>
          )}
        </section>

        <Footer />
      </main>
    </>
  );
}
