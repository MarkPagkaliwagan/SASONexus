"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import {
  FaUserFriends, FaUsers, FaClinicMedical, FaChurch, FaRunning,
  FaBook, FaStar, FaCheck, FaCheckCircle, FaTimes, FaArrowRight, FaArrowLeft, FaUpload, FaClock, FaExclamationCircle, FaChevronDown, FaFolder, FaClipboardList
} from "react-icons/fa";
import { submitInterviewAppointment, checkStudentNoShow, checkStudentAnyNoShow, fetchStudentDetails } from "@/lib/actions";
import { jsPDF } from "jspdf";

const units = [
  { name: "Guidance Office", icon: FaUserFriends },
  { name: "Student Formation and Development Unit (SFDU)", icon: FaUsers },
  { name: "School Clinic", icon: FaClinicMedical },
  { name: "Campus Ministry", icon: FaChurch },
  { name: "Sports Development Unit", icon: FaRunning },
];

const ModalProgress = ({ step, stepLabels, progressPercent }: { step: number; stepLabels: string[]; progressPercent: number }) => (
  <div className="flex md:flex-col gap-0 md:gap-0">
    {stepLabels.map((label, i) => {
      const n = i + 1;
      const isCurrent = step === n;
      const isDone = step > n;
      return (
        <div key={label} className="flex items-center gap-2 md:gap-4 md:items-start flex-1 md:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold transition-all duration-300 shrink-0 ${isCurrent ? "bg-[#007848] text-white shadow-lg shadow-[#007848]/30 scale-110" : isDone ? "bg-[#007848] text-white" : "bg-gray-100 text-gray-400"}`}>
              {isDone ? <FaCheck className="text-[8px] md:text-xs" /> : n}
            </div>
            {i < stepLabels.length - 1 && (
              <div className={`w-0.5 h-6 md:h-10 transition-colors duration-300 hidden md:block ${isDone ? "bg-[#007848]" : "bg-gray-200"}`} />
            )}
          </div>
          <div className={`pt-0 md:pt-1.5 transition-all duration-300 ${isCurrent ? "opacity-100" : isDone ? "opacity-60" : "opacity-40"}`}>
            <p className={`text-xs md:text-sm font-semibold ${isCurrent ? "text-[#007848]" : "text-gray-600"}`}>{label}</p>
            <p className="text-[10px] md:text-xs text-gray-400 hidden md:block">{isCurrent ? "In progress" : isDone ? "Completed" : "Pending"}</p>
          </div>
          {i < stepLabels.length - 1 && (
            <div className={`w-6 md:hidden h-0.5 self-center transition-colors duration-300 ${isDone ? "bg-[#007848]" : "bg-gray-200"}`} />
          )}
        </div>
      );
    })}
  </div>
);

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">{children}</div>
);

const SelectionButton = ({ selected, onClick, icon, title, subtitle, color }: {
  selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; subtitle?: string; color?: string;
}) => (
  <button onClick={onClick} className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer group ${selected ? "border-[#007848] bg-gradient-to-r from-[#007848]/5 to-[#00a864]/5 shadow-md shadow-[#007848]/10" : "border-gray-200 hover:border-[#007848]/40 hover:shadow-md hover:bg-gray-50/50"}`}>
    <div className="flex items-center gap-4">
      <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${selected ? "bg-gradient-to-br from-[#007848] to-[#00a864] text-white shadow-lg shadow-[#007848]/30 scale-110" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:scale-105"}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`font-bold text-sm md:text-base block truncate ${selected ? "text-[#007848]" : "text-gray-800"}`}>{title}</span>
        {subtitle && <p className={`text-xs mt-0.5 ${selected ? "text-[#007848]/70" : "text-gray-500"}`}>{subtitle}</p>}
      </div>
      {selected && (
        <div className="w-7 h-7 rounded-full bg-[#007848] flex items-center justify-center">
          <FaCheck className="text-white text-xs" />
        </div>
      )}
    </div>
  </button>
);

const FormInput = ({ label, type, value, onChange, onFocus, onBlur, placeholder, disabled, autoComplete, error, required, children }: {
  label: string;
  type?: string;
  value?: any;
  onChange?: (e: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  error?: string;
  required?: boolean;
  children?: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    {type === "select" ? (
      <select value={value} onChange={onChange} disabled={disabled} className={`w-full px-4 py-3 border-2 rounded-xl text-sm outline-none bg-white transition-all ${error ? "border-red-400 bg-red-50 ring-2 ring-red-100" : "border-gray-200 focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300"}`}>
        {children}
      </select>
    ) : (
      <input type={type} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder={placeholder} disabled={disabled} autoComplete={autoComplete} className={`w-full px-4 py-3 border-2 rounded-xl text-sm outline-none transition-all ${error ? "border-red-400 bg-red-50 ring-2 ring-red-100" : "border-gray-200 focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 hover:border-gray-300"}`} />
    )}
    {error && <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1"><FaExclamationCircle />{error}</p>}
  </div>
);

export default function ServicesPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [interviewType, setInterviewType] = useState<"initial" | "exit" | null>(null);
  const [studentType, setStudentType] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [strand, setStrand] = useState("");
  const [section, setSection] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");

  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [strands, setStrands] = useState<{ id: number; name: string }[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [studentSuggestions, setStudentSuggestions] = useState<{ studentId: string; fullName: string; email: string; contact: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingStudent, setIsSearchingStudent] = useState(false);
  const [hasPreviousNoShow, setHasPreviousNoShow] = useState(false);
  const [noShowReason, setNoShowReason] = useState("");
  const [noShowCustomReason, setNoShowCustomReason] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedData, setConfirmedData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const clearError = (field: string) => setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  function validateDetails(): boolean {
    const errs: Record<string, string> = {};
    if (!studentId || studentId.trim().length < 2) errs.studentId = "School ID is required";
    if (!fullName || fullName.trim().length < 2) errs.fullName = "Full name is required";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email is required";
    if (!contact || !/^09\d{9}$/.test(contact)) errs.contact = "Valid PH mobile (09XXXXXXXXX) is required";
    const level = studentType === "Freshmen" || studentType === "Transferee" ? academicLevel : studentType;
    if (level === "GS" || level === "JHS") {
      if (!section || section.trim().length < 1) errs.section = "Section is required";
    }
    if (level === "SHS") {
      if (!gradeLevel) errs.gradeLevel = "Grade level is required";
      if (!strand) errs.strand = "Strand is required";
      if (!section || section.trim().length < 1) errs.section = "Section is required";
    }
    if (level === "college") {
      if (!department) errs.department = "Department is required";
      if (!course) errs.course = "Course is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }



  useEffect(() => {
    if (showModal) {
      fetch("/api/departments").then((r) => r.json()).then(setDepartments);
      fetch("/api/strands").then((r) => r.json()).then(setStrands);
    }
  }, [showModal]);

  useEffect(() => {
    if (department) {
      fetch(`/api/courses?department=${encodeURIComponent(department)}`)
        .then((r) => r.json()).then(setCourses);
    } else {
      setCourses([]);
    }
  }, [department]);

  useEffect(() => {
    if (!showModal || !interviewType) return;
    const scheduleStep = interviewType === "initial" ? 3 : 4;
    if (step === scheduleStep) {
      const level = interviewType === "exit" ? studentType : academicLevel;
      const deptParam = level && level !== "college" ? level : level === "college" ? "College" : "";
      fetch(`/api/interview-schedules?type=${interviewType}${deptParam ? `&department=${deptParam}` : ""}`)
        .then((r) => r.json()).then(setSchedules);
      setSelectedSchedule(null);
    }
  }, [step, showModal, interviewType, studentType, academicLevel]);

  useEffect(() => {
    if (!studentId || studentId.length < 2) {
      setStudentSuggestions([]);
      setShowSuggestions(false);
      setIsSearchingStudent(false);
      return;
    }
    setIsSearchingStudent(true);
    const timer = setTimeout(() => {
      fetch(`/api/students?q=${encodeURIComponent(studentId)}`)
        .then((r) => r.json())
        .then((data) => {
          setStudentSuggestions(data);
          setShowSuggestions(data.length > 0);
          setIsSearchingStudent(false);
          if (data.length > 0) {
            const match = data.find((s: any) => s.studentId === studentId);
            if (match) {
              setFullName(match.fullName);
              setEmail(match.email);
              setContact(match.contact);
            }
          }
        });
    }, 200);
    return () => { clearTimeout(timer); setIsSearchingStudent(false); };
  }, [studentId]);

  useEffect(() => {
    if (!studentId || studentId.length < 2) {
      setHasPreviousNoShow(false);
      return;
    }
    const timer = setTimeout(async () => {
      const details = await fetchStudentDetails(studentId);
      if (details) {
        setFullName(details.fullName || "");
        setEmail(details.email || "");
        setContact(details.contact || "");
      }
      if (interviewType) {
        const noShow = await checkStudentNoShow(studentId, interviewType);
        setHasPreviousNoShow(!!noShow);
        if (!noShow) {
          setNoShowReason("");
          setNoShowCustomReason("");
        }
      } else {
        const anyNoShow = await checkStudentAnyNoShow(studentId);
        if (anyNoShow) {
          setInterviewType(anyNoShow.interviewType as "initial" | "exit");
          setHasPreviousNoShow(true);
          const schedStep = anyNoShow.interviewType === "initial" ? 3 : 4;
          setStep(schedStep);
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [studentId, interviewType]);

  const selectStudentSuggestion = (s: { studentId: string; fullName: string; email: string; contact: string }) => {
    setStudentId(s.studentId);
    setFullName(s.fullName);
    setEmail(s.email);
    setContact(s.contact);
    setShowSuggestions(false);
    if (interviewType && s.studentId) {
      checkStudentNoShow(s.studentId, interviewType).then((hasNoShow) => {
        setHasPreviousNoShow(!!hasNoShow);
        if (!hasNoShow) {
          setNoShowReason("");
          setNoShowCustomReason("");
        }
      });
    }
  };

  const totalSteps = interviewType === "initial" ? 3 : interviewType === "exit" ? 4 : 1;
  const stepLabels = interviewType === "initial"
    ? ["Type", "Details", "Schedule"]
    : interviewType === "exit"
    ? ["Type", "Level", "Details", "Schedule"]
    : ["Type"];

  async function handleSubmitAppointment() {
    if (!selectedSchedule) return;
    setSubmitting(true);
    setSubmitMessage(null);
    try {
      const fd = new FormData();
      fd.set("scheduleId", String(selectedSchedule));
      fd.set("interviewType", interviewType || "");
      fd.set("studentType", studentType);
      fd.set("academicLevel", academicLevel);
      fd.set("fullName", fullName);
      fd.set("studentId", studentId);
      fd.set("email", email);
      fd.set("contact", contact);
      fd.set("gradeLevel", gradeLevel);
      fd.set("strand", strand);
      fd.set("section", section);
      fd.set("department", department);
      fd.set("course", course);
      if (hasPreviousNoShow) {
        const reason = noShowReason === "Others" ? noShowCustomReason : noShowReason;
        fd.set("noShowReason", reason);
      }
      await submitInterviewAppointment(fd);
      const schedule = schedules.find((s) => s.id === selectedSchedule);
      setConfirmedData({
        fullName,
        studentId,
        email,
        contact,
        interviewType,
        studentType,
        academicLevel,
        gradeLevel,
        strand,
        section,
        department,
        course,
        scheduleTitle: schedule?.title || "",
        scheduleDate: schedule?.date || "",
        scheduleTimeStart: schedule?.timeStart || "",
        scheduleTimeEnd: schedule?.timeEnd || "",
        location: "EALA Building - Second Floor",
        isNoShowReschedule: hasPreviousNoShow,
      });
      setShowConfirmation(true);
    } catch (err) {
      setSubmitMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to submit" });
    } finally {
      setSubmitting(false);
    }
  }

  const resetModal = () => {
    setShowModal(false);
    setStep(1);
    setInterviewType(null);
    setStudentType("");
    setAcademicLevel("");
    setFullName("");
    setStudentId("");
    setEmail("");
    setContact("");
    setGradeLevel("");
    setStrand("");
    setSection("");
    setDepartment("");
    setCourse("");
    setSchedules([]);
    setSelectedSchedule(null);
    setSubmitMessage(null);
    setShowConfirmation(false);
    setConfirmedData(null);
    setStudentSuggestions([]);
    setShowSuggestions(false);
    setHasPreviousNoShow(false);
    setNoShowReason("");
    setNoShowCustomReason("");
    setErrors({});
  };

  const downloadConfirmation = () => {
    const d = confirmedData;
    if (!d) return;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = 210;
    const margin = 20;
    let y = margin;

    pdf.setFillColor(0, 120, 72);
    pdf.rect(0, 0, pageW, 40, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("INTERVIEW APPOINTMENT", pageW / 2, 18, { align: "center" });
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("CONFIRMATION", pageW / 2, 30, { align: "center" });

    y = 55;
    pdf.setDrawColor(0, 120, 72);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageW - margin, y);
    y += 8;

    pdf.setTextColor(0, 120, 72);
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text("STUDENT INFORMATION", margin, y);
    y += 10;

    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    const lines = [
      ["Full Name:", d.fullName],
      ["Student ID:", d.studentId || "N/A"],
      ["Email:", d.email || "N/A"],
      ["Contact No.:", d.contact || "N/A"],
    ];
    if (d.gradeLevel) lines.push(["Grade Level:", d.gradeLevel]);
    if (d.strand) lines.push(["Strand:", d.strand]);
    if (d.section) lines.push(["Section:", d.section]);
    if (d.department) lines.push(["Department:", d.department]);
    if (d.course) lines.push(["Course:", d.course]);

    for (const [label, value] of lines) {
      pdf.setFont("helvetica", "bold");
      pdf.text(label, margin, y);
      pdf.setFont("helvetica", "normal");
      const lw = pdf.getTextWidth(label);
      pdf.text(` ${value}`, margin + lw + 1, y);
      y += 7;
    }

    y += 3;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, y, pageW - margin, y);
    y += 8;

    pdf.setTextColor(0, 120, 72);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text("INTERVIEW DETAILS", margin, y);
    y += 10;

    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(10);
    const details = [
      ["Interview Type:", `${d.interviewType.charAt(0).toUpperCase() + d.interviewType.slice(1)} Interview`],
      ["Student Type:", d.studentType ? d.studentType.charAt(0).toUpperCase() + d.studentType.slice(1) : "N/A"],
    ];
    if (d.academicLevel && d.academicLevel !== d.studentType) {
      details.push(["Academic Level:", d.academicLevel.charAt(0).toUpperCase() + d.academicLevel.slice(1)]);
    }
    details.push(
      ["Schedule:", d.scheduleTitle],
      ["Date:", d.scheduleDate],
      ["Time:", `${d.scheduleTimeStart} - ${d.scheduleTimeEnd}`],
      ["Location:", d.location],
      ["Status:", "Pending"],
    );
    for (const [label, value] of details) {
      pdf.setFont("helvetica", "bold");
      pdf.text(label, margin, y);
      pdf.setFont("helvetica", "normal");
      const lw = pdf.getTextWidth(label);
      pdf.text(` ${value}`, margin + lw + 1, y);
      y += 7;
    }

    y += 5;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, y, pageW - margin, y);
    y += 8;

    pdf.setTextColor(102, 102, 102);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "italic");
    pdf.text("Present this confirmation to the Guidance Office on your scheduled date.", pageW / 2, y, { align: "center" });
    y += 6;
    pdf.text("EALA Building - Second Floor", pageW / 2, y, { align: "center" });

    pdf.save(`interview-confirmation-${(d.fullName || "scheduled").replace(/\s+/g, "-")}.pdf`);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
        onClick={resetModal}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className="relative bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-hidden transition-all duration-300 ease-out md:scale-100 md:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-[#007848] to-[#00a864] px-5 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <FaClock className="text-white text-sm" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-white">Schedule for Interview</h3>
                <p className="text-xs text-green-100">Book your appointment with GCSU</p>
              </div>
            </div>
            <button
              onClick={resetModal}
              className="p-2 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
            >
              <FaTimes className="text-white/80" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row h-full max-h-[calc(95vh-68px)] md:max-h-[calc(90vh-68px)] overflow-hidden">
            <div className="md:w-56 md:min-w-56 bg-gray-50/80 md:border-r border-gray-200 p-5 md:p-6 md:overflow-y-auto">
              <ModalProgress step={step} stepLabels={stepLabels} progressPercent={progressPercent} />
              <div className="mt-6 p-3 bg-white rounded-xl border border-gray-100 hidden md:block">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Need help?</p>
                <p className="text-xs text-gray-400">Contact GCSU at the EALA Building - Second Floor</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 md:p-8">
            {showConfirmation && confirmedData ? (
              <div>
                <div id="confirmation-card" className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
                  <div className={`p-6 md:p-8 text-white text-center ${confirmedData.isNoShowReschedule ? "bg-gradient-to-r from-orange-500 to-orange-400" : "bg-gradient-to-r from-[#007848] to-[#00a864]"}`}>
                    {confirmedData.isNoShowReschedule ? (
                      <><FaCheckCircle className="text-4xl mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-white">No-Show Rescheduled</h3>
                      <p className="text-sm mt-1 text-orange-100">Your reason has been noted. Proceed with your new schedule.</p></>
                    ) : (
                      <><FaCheckCircle className="text-4xl mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-white">Interview Scheduled!</h3>
                      <p className="text-sm mt-1 text-green-100">Your appointment has been confirmed.</p></>
                    )}
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      {[
                        { l: "Name", v: confirmedData.fullName, b: true },
                        { l: "Student ID", v: confirmedData.studentId || "N/A" },
                        { l: "Email", v: confirmedData.email || "N/A" },
                        { l: "Contact", v: confirmedData.contact || "N/A" },
                        { l: "Interview", v: `${confirmedData.interviewType} Interview`, cap: true },
                        ...(confirmedData.studentType ? [{ l: "Student Type", v: confirmedData.studentType, cap: true }] : []),
                        ...(confirmedData.academicLevel && confirmedData.academicLevel !== confirmedData.studentType ? [{ l: "Academic Level", v: confirmedData.academicLevel, cap: true }] : []),
                        ...(confirmedData.gradeLevel ? [{ l: "Grade Level", v: confirmedData.gradeLevel }] : []),
                        ...(confirmedData.strand ? [{ l: "Strand", v: confirmedData.strand }] : []),
                        ...(confirmedData.section ? [{ l: "Section", v: confirmedData.section }] : []),
                        ...(confirmedData.department ? [{ l: "Department", v: confirmedData.department }] : []),
                        ...(confirmedData.course ? [{ l: "Course", v: confirmedData.course }] : []),
                        { l: "Schedule", v: confirmedData.scheduleTitle },
                        { l: "Date", v: confirmedData.scheduleDate },
                        { l: "Time", v: `${confirmedData.scheduleTimeStart} - ${confirmedData.scheduleTimeEnd}` },
                        { l: "Location", v: confirmedData.location, b: true },
                      ].map(({ l, v, cap, b }) => (
                        <div key={l} className="flex items-baseline gap-2">
                          <span className="text-gray-500 shrink-0 min-w-[90px]">{l}:</span>
                          <span className={`text-gray-800 ${b ? "font-semibold" : ""} ${cap ? "capitalize" : ""}`}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <p className="text-xs text-center text-gray-400">Present this confirmation to the Guidance Office on your scheduled date.</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={downloadConfirmation}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-sm font-semibold rounded-xl hover:from-[#005f3a] hover:to-[#008f56] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#007848]/20"
                  >
                    <FaUpload className="text-xs" /> Download Confirmation
                  </button>
                  <button
                    onClick={resetModal}
                    className="px-6 py-3 border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
            <>
            
            {step === 1 && (
              <SectionCard>
                <div className="relative mb-5">
                  <FormInput
                    label="Student ID"
                    type="text"
                    value={studentId}
                    onChange={(e: any) => { setStudentId(e.target.value); setShowSuggestions(true); clearError("studentId"); }}
                    onFocus={() => { if (studentSuggestions.length > 0) setShowSuggestions(true); }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Enter your student ID"
                    autoComplete="off"
                    required
                    error={errors.studentId}
                  />
                  {isSearchingStudent && (
                    <p className="text-xs text-gray-400 mt-1">Fetching...</p>
                  )}
                  {showSuggestions && studentSuggestions.length > 0 && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {studentSuggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onMouseDown={() => selectStudentSuggestion(s)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-[#007848]/5 hover:text-[#007848] transition-colors cursor-pointer border-b last:border-b-0 border-gray-100"
                        >
                          <span className="font-semibold text-gray-800">{s.fullName}</span>
                          <span className="text-gray-400 ml-2">({s.studentId})</span>
                          {s.email && <span className="text-gray-400 text-xs ml-2">{s.email}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-[#007848] rounded-full"></span>Select the type of interview you need</p>
                <div className="space-y-3">
                  <SelectionButton
                    selected={interviewType === "initial"}
                    onClick={() => { setInterviewType("initial"); setStudentType(""); }}
                    icon={<FaUserFriends />}
                    title="Initial Interview"
                    subtitle="For freshmen and transferees"
                    color="[#007848]"
                  />
                  <SelectionButton
                    selected={interviewType === "exit"}
                    onClick={() => { setInterviewType("exit"); setStudentType(""); }}
                    icon={<FaStar />}
                    title="Exit Interview"
                    subtitle="For graduating students (Gr6, Gr10, Gr12, College)"
                    color="[#007848]"
                  />
                </div>

                {interviewType === "initial" && (
                  <div className="mt-5 pt-5 border-t border-gray-200">
                    <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><span className="w-1.5 h-5 bg-[#007848] rounded-full"></span>Select your student type</p>
                    <div className="space-y-2">
                      {["Freshmen", "Transferee"].map((type) => (
                        <SelectionButton
                          key={type}
                          selected={studentType === type}
                          onClick={() => setStudentType(type)}
                          icon={<FaUsers />}
                          title={type}
                          color="[#007848]"
                        />
                      ))}
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => {
                          if (!studentId || studentId.trim().length < 2) {
                            setErrors((prev) => ({ ...prev, studentId: "School ID is required" }));
                            return;
                          }
                          clearError("studentId");
                          nextStep();
                        }}
                        disabled={!studentType || (hasPreviousNoShow && (!noShowReason || (noShowReason === "Others" && !noShowCustomReason)))}
                        className={`px-6 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm ${
                          !studentType || (hasPreviousNoShow && (!noShowReason || (noShowReason === "Others" && !noShowCustomReason)))
                            ? "bg-gray-300 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-[#007848] to-[#00a864] text-white hover:from-[#005f3a] hover:to-[#008f56] cursor-pointer shadow-md shadow-[#007848]/20 hover:shadow-lg hover:shadow-[#007848]/30"
                        }`}
                      >
                        Next <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                )}
                {interviewType === "exit" && (
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => {
                        if (!studentId || studentId.trim().length < 2) {
                          setErrors((prev) => ({ ...prev, studentId: "School ID is required" }));
                          return;
                        }
                        clearError("studentId");
                        nextStep();
                      }}
                      className="px-6 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm bg-gradient-to-r from-[#007848] to-[#00a864] text-white hover:from-[#005f3a] hover:to-[#008f56] cursor-pointer shadow-md shadow-[#007848]/20 hover:shadow-lg hover:shadow-[#007848]/30"
                    >
                      Next <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                )}
              </SectionCard>
            )}

            {step === 2 && interviewType === "exit" && (
              <SectionCard>
                <p className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-[#007848] rounded-full"></span>Select your current level</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "GS", label: "Grade School", sub: "Gr6" },
                    { value: "JHS", label: "Junior High", sub: "Gr10" },
                    { value: "SHS", label: "Senior High", sub: "Gr12" },
                    { value: "college", label: "College", sub: "Graduating" },
                  ].map(({ value, label, sub }) => (
                    <button
                      key={value}
                      onClick={() => { setStudentType(value); nextStep(); }}
                      className={`text-center p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                        studentType === value
                          ? "border-[#007848] bg-gradient-to-b from-[#007848]/5 to-[#00a864]/5 shadow-md shadow-[#007848]/10"
                          : "border-gray-100 hover:border-[#007848]/40 hover:shadow-md hover:bg-gray-50/50"
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                        studentType === value ? "bg-gradient-to-br from-[#007848] to-[#00a864] text-white shadow-lg shadow-[#007848]/30 scale-110" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                      }`}>
                        <FaUsers className="text-lg" />
                      </div>
                      <span className={`font-bold block text-sm md:text-base ${studentType === value ? "text-[#007848]" : "text-gray-800"}`}>
                        {label}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 block">{sub}</span>
                    </button>
                  ))}
                </div>
              </SectionCard>
            )}

            {((step === 2 && interviewType === "initial") || (step === 3 && interviewType === "exit")) && (
              <SectionCard>
                <p className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-[#007848] rounded-full"></span>Please provide your personal details</p>
                <div className="space-y-3 md:space-y-4">
                  <FormInput
                    label="Full Name"
                    type="text"
                    value={fullName}
                    onChange={(e: any) => { setFullName(e.target.value); clearError("fullName"); }}
                    placeholder="Enter your full name"
                    required
                    error={errors.fullName}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormInput
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e: any) => { setEmail(e.target.value); clearError("email"); }}
                      placeholder="your@email.com"
                      required
                      error={errors.email}
                    />
                    <FormInput
                      label="Contact No."
                      type="text"
                      value={contact}
                      onChange={(e: any) => { setContact(e.target.value); clearError("contact"); }}
                      placeholder="09XXXXXXXXX"
                      required
                      error={errors.contact}
                    />
                  </div>

                  {(studentType === "GS" || studentType === "JHS" || academicLevel === "GS" || academicLevel === "JHS") && (
                    <FormInput
                      label="Section"
                      type="text"
                      value={section}
                      onChange={(e: any) => { setSection(e.target.value); clearError("section"); }}
                      placeholder="Enter your section"
                      required
                      error={errors.section}
                    />
                  )}

                  {(studentType === "SHS" || academicLevel === "SHS") && (
                    <div className="space-y-3 pt-2 border-t border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormInput label="Grade Level" type="select" value={gradeLevel} onChange={(e: any) => { setGradeLevel(e.target.value); clearError("gradeLevel"); }} required error={errors.gradeLevel}>
                          <option value="">Select</option>
                          <option value="Grade 11">Grade 11</option>
                          <option value="Grade 12">Grade 12</option>
                        </FormInput>
                        <FormInput label="Strand" type="select" value={strand} onChange={(e: any) => { setStrand(e.target.value); clearError("strand"); }} required error={errors.strand}>
                          <option value="">Select</option>
                          {strands.map((s) => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                          ))}
                        </FormInput>
                      </div>
                      <FormInput
                        label="Section"
                        type="text"
                        value={section}
                        onChange={(e: any) => { setSection(e.target.value); clearError("section"); }}
                        placeholder="Enter your section"
                        required
                        error={errors.section}
                      />
                    </div>
                  )}

                  {(studentType === "college" || academicLevel === "college") && (
                    <div className="space-y-3 pt-2 border-t border-gray-200">
                      <FormInput label="Department" type="select" value={department} onChange={(e: any) => { setDepartment(e.target.value); setCourse(""); clearError("department"); }} required error={errors.department}>
                        <option value="">Select department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </FormInput>
                      <FormInput label="Course" type="select" value={course} onChange={(e: any) => { setCourse(e.target.value); clearError("course"); }} disabled={!department} required error={errors.course}>
                        <option value="">Select course</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </FormInput>
                    </div>
                  )}

                  {studentType === "Freshmen" || studentType === "Transferee" ? (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm font-bold text-gray-800 mb-3">Current Level</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "GS", label: "Grade School" },
                          { value: "JHS", label: "Junior High" },
                          { value: "SHS", label: "Senior High" },
                          { value: "college", label: "College" },
                        ].map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={() => setAcademicLevel(value)}
                            className={`text-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                              academicLevel === value ? "border-[#007848] bg-gradient-to-b from-[#007848]/5 to-[#00a864]/5 shadow-md shadow-[#007848]/10" : "border-gray-100 hover:border-[#007848]/40 hover:shadow-md"
                            }`}
                          >
                            <span className={`font-bold text-sm ${academicLevel === value ? "text-[#007848]" : "text-gray-700"}`}>
                              {label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex justify-between pt-3">
                    <button onClick={prevStep} className="px-5 py-2.5 border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer flex items-center gap-2">
                      <FaArrowLeft className="text-xs" /> Back
                    </button>
                    <button
                      onClick={() => { if (validateDetails()) nextStep(); }}
                      className="px-6 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm bg-gradient-to-r from-[#007848] to-[#00a864] text-white hover:from-[#005f3a] hover:to-[#008f56] cursor-pointer shadow-md shadow-[#007848]/20 hover:shadow-lg hover:shadow-[#007848]/30"
                    >
                      Next <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                </div>
              </SectionCard>
            )}

            {((step === 3 && interviewType === "initial") || (step === 4 && interviewType === "exit")) && (
              <SectionCard>
                  {hasPreviousNoShow && (
                    <div className="mb-6 p-5 bg-amber-50 border-2 border-amber-200 rounded-2xl">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <FaExclamationCircle className="text-amber-600" />
                        </div>
                        <p className="text-sm font-bold text-amber-800">Reason for No-Show</p>
                      </div>
                      <p className="text-xs text-amber-600 mb-4">You missed your previous interview. Tell us why and pick a new schedule.</p>
                      <select
                        value={noShowReason}
                        onChange={(e) => setNoShowReason(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl text-sm bg-white outline-none focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 text-gray-900 transition"
                      >
                      <option value="">Select a reason</option>
                      <option value="Student forgot the schedule">Student forgot the schedule</option>
                      <option value="Student had a class conflict">Student had a class conflict</option>
                      <option value="Student had a personal emergency">Student had a personal emergency</option>
                      <option value="Student had a medical emergency">Student had a medical emergency</option>
                      <option value="Student had a transportation issue">Student had a transportation issue</option>
                      <option value="Student did not receive the notification">Student did not receive the notification</option>
                      <option value="Student was absent from school">Student was absent from school</option>
                      <option value="Student had a family obligation">Student had a family obligation</option>
                      <option value="Scheduling conflict with other activities">Scheduling conflict with other activities</option>
                      <option value="Student was not ready for the interview">Student was not ready for the interview</option>
                      <option value="Others">Others</option>
                    </select>
                    {noShowReason === "Others" && (
                      <textarea
                        value={noShowCustomReason}
                        onChange={(e) => setNoShowCustomReason(e.target.value)}
                        placeholder="Please specify..."
                        rows={2}
                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl text-sm bg-white outline-none focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 text-gray-900 transition resize-none mt-3"
                      />
                    )}
                  </div>
                )}
                <p className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-[#007848] rounded-full"></span>Select your preferred schedule</p>
                {schedules.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <FaClock className="text-3xl text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-semibold">No schedules available</p>
                    <p className="text-xs text-gray-400 mt-1.5">Schedules will appear once posted by the admin.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                    {schedules.map((s) => {
                      const available = s.slots - s.booked;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSchedule(s.id)}
                          className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                            selectedSchedule === s.id
                              ? "border-[#007848] bg-gradient-to-r from-[#007848]/5 to-[#00a864]/5 shadow-md shadow-[#007848]/10"
                              : "border-gray-100 hover:border-[#007848]/30 hover:shadow-md hover:bg-gray-50/50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <span className={`font-bold text-sm block truncate ${selectedSchedule === s.id ? "text-[#007848]" : "text-gray-800"}`}>
                                {s.title}
                              </span>
                              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                <span className="text-xs text-gray-500 flex items-center gap-1"><FaClock className="text-[10px]" />{s.date}</span>
                                <span className="text-xs text-gray-300">|</span>
                                <span className="text-xs text-gray-500">{s.timeStart} - {s.timeEnd}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                                available <= 3 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-green-50 text-green-700 border border-green-200"
                              }`}>
                                {available} slot{available !== 1 ? "s" : ""} left
                              </span>
                              {selectedSchedule === s.id && (
                                <div className="w-7 h-7 rounded-full bg-[#007848] flex items-center justify-center">
                                  <FaCheck className="text-white text-xs" />
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {submitMessage && (
                  <div className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                    submitMessage.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-600"
                  }`}>
                    {submitMessage.type === "error" ? <FaExclamationCircle /> : <FaCheckCircle />}
                    {submitMessage.text}
                  </div>
                )}
                <div className="flex justify-between pt-4">
                  <button onClick={prevStep} className="px-5 py-2.5 border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer flex items-center gap-2">
                    <FaArrowLeft className="text-xs" /> Back
                  </button>
                  <button
                    disabled={!selectedSchedule || submitting || (hasPreviousNoShow && (!noShowReason || (noShowReason === "Others" && !noShowCustomReason)))}
                    onClick={() => { if (validateDetails()) handleSubmitAppointment(); }}
                    className={`px-6 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm ${
                      selectedSchedule && !submitting && !(hasPreviousNoShow && (!noShowReason || (noShowReason === "Others" && !noShowCustomReason)))
                        ? "bg-gradient-to-r from-[#007848] to-[#00a864] text-white hover:from-[#005f3a] hover:to-[#008f56] cursor-pointer shadow-md shadow-[#007848]/20 hover:shadow-lg hover:shadow-[#007848]/30"
                        : "bg-gray-300 text-white cursor-not-allowed"
                    }`}
                  >
                    {submitting ? (
                      <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Submitting...</>
                    ) : (
                      <><FaCheckCircle className="text-sm" /> Submit</>
                    )}
                  </button>
                </div>
              </SectionCard>
            )}
            </>)}
            </div>
          </div>
        </div>

      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16 md:pt-20">
        <section className="bg-gradient-to-br from-[#007848] via-[#008f56] to-[#00a864] text-white pt-4 pb-16 md:py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Comprehensive support services designed to enhance student success and development.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Student Affairs & Services Office</h2>
            <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full" />
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex">
                <div className="w-2 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
                <div className="p-6 md:p-8 flex-1">
                    <div className="flex flex-wrap items-start gap-3 mb-4">
                     <div className="p-3 bg-[#007848]/10 rounded-xl">
                       <FaUserFriends className="text-xl text-[#007848]" />
                     </div>
                     <div className="flex-1 min-w-[200px]">
                       <h3 className="text-xl font-bold text-gray-800">Guidance and Career Services Unit</h3>
                       <p className="text-xs text-gray-500 font-medium tracking-wider">GCSU</p>
                     </div>
                      <div className="flex flex-col gap-2 w-full sm:w-auto relative">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setShowModal(true); }, 600); }}
                            disabled={loading}
                            className="px-4 py-1.5 bg-[#007848] text-white text-xs font-medium rounded-md hover:bg-[#005f3a] transition-colors cursor-pointer whitespace-nowrap border border-[#007848] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                          >
                            {loading ? (
                              <><svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Loading...</>
                            ) : (
                              <><FaClock className="text-[10px]" /> Schedule for Interview</>
                            )}
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setShowDropdown(!showDropdown)}
                              className="px-3 py-1.5 bg-[#007848] text-white text-xs font-medium rounded-md hover:bg-[#005f3a] transition-colors cursor-pointer border border-[#007848] flex items-center gap-1.5"
                            >
                              <FaFolder className="text-[10px]" /> Forms <FaChevronDown className="text-[8px]" />
                            </button>
                            {showDropdown && (
                              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                                <button
                                  onClick={() => { setShowDropdown(false); router.push("/services/cumulative-record"); }}
                                  className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#007848]/5 hover:text-[#007848] transition-colors cursor-pointer border-b border-gray-100 flex items-center gap-3"
                                >
                                  <FaFolder className="text-[#007848] text-xs" />
                                  Cumulative Record Folder
                                </button>
                                <button
                                  onClick={() => { setShowDropdown(false); router.push("/services/student-needs-assessment"); }}
                                  className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#007848]/5 hover:text-[#007848] transition-colors cursor-pointer flex items-center gap-3"
                                >
                                  <FaClipboardList className="text-[#007848] text-xs" />
                                  Student Needs Assessment
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                   </div>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Facilitates the process of acquiring the self-actualization of the student in his/her pursuit of becoming a fully functioning individual blessed with intellectual, emotional, spiritual, and social strengths.
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">To attain its goals the following services are offered:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        "Counseling",
                        "Testing and Measurement and Individual Appraisal Services",
                        "Information Service/Enrichment Program",
                        "Peer Facilitators Program",
                      ].map((service) => (
                        <div key={service} className="flex items-start gap-2">
                          <div className="mt-1 p-1 bg-[#007848]/10 rounded-full">
                            <FaCheck className="text-[8px] text-[#007848]" />
                          </div>
                          <span className="text-gray-700 text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">
                    Located on the Second Floor of Eala Bldg., the Guidance and Counseling Office has a centralized organization set up which caters to all the levels of the institution.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex">
                <div className="w-2 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#007848]/10 rounded-xl">
                      <FaUsers className="text-xl text-[#007848]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Student Formation and Development Unit</h3>
                      <p className="text-xs text-gray-500 font-medium tracking-wider">SFDU</p>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">Student Activities</h4>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    SPC provides wholesome activities and opportunities for students to enhance their skills in the following areas:
                  </p>
                  <div className="mb-4 pl-4">
                    <p className="text-gray-700 text-sm mb-1">a. Co-Curricular Program</p>
                    <p className="text-gray-700 text-sm mb-3">b. Extra-Curricular Program</p>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    SPC believes that the educational development of students shall not be limited to the four corners of the classroom. They shall be encouraged to involve themselves in co-curricular and extra-curricular activities to foster social attitudes of cooperation, responsibility, creativity, and leadership.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Unit credits shall be given to students who participate in co-curricular and extra-curricular activities as part of the grading criteria.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex">
                <div className="w-2 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#007848]/10 rounded-xl">
                      <FaClinicMedical className="text-xl text-[#007848]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Medical and Dental Clinics</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Protects, maintains, and promotes the health of school children, adolescents, collegiate students, and personnel to attain the maximum state of well-being. This concern is through the cooperative effort of the Medical and Dental team.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Situated near the Food Laboratory are these two auxiliary services of the OSA. Both clinics shall be responsible for the timely medical aid as well as the maintenance of proper dental health for the school population during official working hours.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Staffed by a full-time physician and a dentist with their respective clerks, the clinics are open daily from 7:00 a.m. to 8:00 p.m. and 8:00 to 5:00 p.m. on Saturdays.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    A part of the school is the San Pablo Colleges Medical Center (SPCMC). It is designed to serve the medical needs of the SPC Community and to provide a place for actual training for its medical courses. All students are granted a 10% discount on their hospitalization for room and board.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex">
                <div className="w-2 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#007848]/10 rounded-xl">
                      <FaChurch className="text-xl text-[#007848]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Youth Campus Ministry</h3>
                      <p className="text-xs text-gray-500 font-medium tracking-wider">YCM</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Implements the institutionalized religious/spiritual activities and programs of the college for students to become better Christians.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Education and personality development include spiritual formation. Religious education cannot be excluded from wholesome and complete personality development. Important for the student's life is that he/she not only develops his/her intellectual ability but that he/she also grows as a person who knows his/her responsibilities to God and his/her community.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    Such a unit is designed to increase the faith of the community so that each student would become a better Christian through different spiritual activities such as:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {[
                      "Retreats, Recollection",
                      "Catholic Life in the Spirit Seminar (CLSS)",
                      "Masses",
                      "Novenas",
                      "Christ Youth in Action (CYA)",
                      "Other related church activities",
                    ].map((activity) => (
                      <div key={activity} className="flex items-start gap-2">
                        <div className="mt-1 p-1 bg-[#007848]/10 rounded-full">
                          <FaCheck className="text-[8px] text-[#007848]" />
                        </div>
                        <span className="text-gray-700 text-sm">{activity}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Concerning this, a College Chaplain or laypersons may also be consulted for spiritual advice.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex">
                <div className="w-2 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#007848]/10 rounded-xl">
                      <FaRunning className="text-xl text-[#007848]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Sports Development Program</h3>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-800 text-sm mb-3">Eligibility Discount</h4>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#007848]/10">
                          <th className="text-left p-2 font-semibold text-gray-700">Category</th>
                          <th className="text-left p-2 font-semibold text-gray-700">Requirement</th>
                          <th className="text-left p-2 font-semibold text-gray-700">Discount</th>
                          <th className="text-left p-2 font-semibold text-gray-700">Perks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { cat: "Team", req: "No failing grades", disc: "5%-100% discount on TF", perks: "With allowance and free uniform and seminar" },
                          { cat: "Dual", req: "No failing grades", disc: "5%-50% discount on TF", perks: "With allowance and free uniform and seminar" },
                          { cat: "Individual", req: "No failing grades", disc: "5%-50% discount on TF", perks: "With allowance and free uniform and seminar" },
                        ].map((row) => (
                          <tr key={row.cat} className="border-t border-gray-100">
                            <td className="p-2 font-medium text-gray-800">{row.cat}</td>
                            <td className="p-2 text-gray-600">{row.req}</td>
                            <td className="p-2 text-gray-600">{row.disc}</td>
                            <td className="p-2 text-gray-600">{row.perks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h4 className="font-semibold text-gray-800 text-sm mb-3">Discount Privileges for Siblings</h4>
                  <p className="text-gray-600 leading-relaxed text-sm mb-3">
                    Siblings shall be granted discount privileges. Discounts shall be given to the member with the lowest fee.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#007848]/10">
                          <th className="text-left p-2 font-semibold text-gray-700">Eligibility</th>
                          <th className="text-left p-2 font-semibold text-gray-700">Discount In charge</th>
                          <th className="text-left p-2 font-semibold text-gray-700">Discount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { elig: "Three (3) enrolled siblings", charge: "Youngest among sibling", disc: "25% discount on TF" },
                          { elig: "Four (4) enrolled siblings", charge: "Youngest among sibling", disc: "50% discount on TF" },
                        ].map((row) => (
                          <tr key={row.elig} className="border-t border-gray-100">
                            <td className="p-2 font-medium text-gray-800">{row.elig}</td>
                            <td className="p-2 text-gray-600">{row.charge}</td>
                            <td className="p-2 text-gray-600">{row.disc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#007848] text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Student Handbook | Pillars</h2>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Available Handbook</h2>
            <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full" />
          </div>
          <div className="space-y-6">
            {[
              { title: "College Handbook 2021-2026", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
              { title: "Senior High School Handbook 2022-2026", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
            ].map((hb) => (
              <div key={hb.title} className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex">
                  <div className="w-1.5 bg-gradient-to-b from-[#007848] to-[#00a864] flex-shrink-0" />
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-xs font-semibold rounded-full shadow-sm">
                        <FaBook className="text-[10px]" />
                        <span>Handbook</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#007848] transition-colors">{hb.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{hb.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Available Pillars</h2>
            <div className="w-16 h-1 bg-[#007848] mx-auto rounded-full" />
          </div>
          <div className="space-y-6">
            {[
              { title: "AY 21-22", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
              { title: "AY 22-23", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
              { title: "AY 23-24", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
              { title: "AY 24-25", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
              { title: "AY 25-26", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
            ].map((pillar) => (
              <div key={pillar.title} className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex">
                  <div className="w-1.5 bg-gradient-to-b from-[#b8860b] to-[#ffc107] flex-shrink-0" />
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#b8860b] to-[#ffc107] text-white text-xs font-semibold rounded-full shadow-sm">
                        <FaStar className="text-[10px]" />
                        <span>Pillar</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#b8860b] transition-colors">{pillar.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{pillar.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {renderModal()}
        <Footer />
      </main>
    </>
  );
}
