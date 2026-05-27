"use client";

import { useState, useMemo } from "react";
import { FiSearch, FiChevronUp, FiChevronDown, FiEye, FiX, FiCheckCircle, FiClock, FiFileText, FiDownload } from "react-icons/fi";
import { updateNeedsAssessmentStatus } from "@/lib/actions";
import { generateNeedsAssessmentPdf } from "@/lib/needs-assessment-pdf";

interface AssessmentRecord {
  id: number;
  studentId: string | null;
  schoolId: string | null;
  academicYear: string | null;
  department: string | null;
  courseOrStrand: string | null;
  fullName: string | null;
  email: string | null;
  contactNumber: string | null;
  birthday: string | null;
  age: string | null;
  address: string | null;
  academicDifficultSubjects: string | null;
  academicStudyHabits: string | null;
  academicLearningDifficulties: string | null;
  academicConcerns: string | null;
  personalProblems: string | null;
  personalAdjustment: string | null;
  personalFamilyConcerns: string | null;
  emotionalStressLevel: string | null;
  emotionalAnxiety: string | null;
  emotionalMotivation: string | null;
  emotionalSelfConfidence: string | null;
  socialClassmates: string | null;
  socialFriendships: string | null;
  socialCommunication: string | null;
  socialBullying: string | null;
  financialAllowance: string | null;
  financialExpenses: string | null;
  financialScholarship: string | null;
  careerGoal: string | null;
  careerUncertainty: string | null;
  careerSkills: string | null;
  healthMedical: string | null;
  healthPhysicalLimitations: string | null;
  supportCounseling: boolean | null;
  supportAcademic: boolean | null;
  supportScholarship: boolean | null;
  supportCareer: boolean | null;
  supportOther: string | null;
  otherConcerns: string | null;
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

type SortKey = "fullName" | "schoolId" | "academicYear" | "department" | "status" | "updatedAt";

export function StudentNeedsAssessmentList({ records }: { records: AssessmentRecord[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [viewRecord, setViewRecord] = useState<AssessmentRecord | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function handleDownloadPdf(r: AssessmentRecord) {
    const doc = await generateNeedsAssessmentPdf(r);
    doc.save(`NeedsAssessment_${r.schoolId || r.id}_${r.fullName?.replace(/\s+/g, "_") || "student"}.pdf`);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter((r) =>
      !q ||
      (r.fullName && r.fullName.toLowerCase().includes(q)) ||
      (r.schoolId && r.schoolId.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.academicYear && r.academicYear.toLowerCase().includes(q)) ||
      (r.department && r.department.toLowerCase().includes(q)) ||
      (r.status && r.status.toLowerCase().includes(q))
    );
  }, [records, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const aVal = (a[sortKey] ?? "") as string;
      const bVal = (b[sortKey] ?? "") as string;
      const cmp = aVal.localeCompare(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  async function handleStatusUpdate(id: number, newStatus: string) {
    setUpdatingId(id);
    try {
      await updateNeedsAssessmentStatus(id, newStatus);
      if (viewRecord && viewRecord.id === id) {
        setViewRecord({ ...viewRecord, status: newStatus });
      }
      window.location.reload();
    } catch (e: any) {
      alert("Failed to update status: " + e.message);
    } finally {
      setUpdatingId(null);
    }
  }

  function SortHeader({ label, sortKey: sk }: { label: string; sortKey: SortKey }) {
    const active = sortKey === sk;
    return (
      <button onClick={() => toggleSort(sk)} className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 transition cursor-pointer">
        {label}
        {active && (sortDir === "asc" ? <FiChevronUp className="text-[10px]" /> : <FiChevronDown className="text-[10px]" />)}
      </button>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, email, status..."
              className="w-full pl-9 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition"
            />
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">No records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-4 py-3"><SortHeader label="Student Name" sortKey="fullName" /></th>
                  <th className="text-left px-4 py-3"><SortHeader label="School ID" sortKey="schoolId" /></th>
                  <th className="text-left px-4 py-3"><SortHeader label="A.Y." sortKey="academicYear" /></th>
                  <th className="text-left px-4 py-3"><SortHeader label="Dept" sortKey="department" /></th>
                  <th className="text-left px-4 py-3"><SortHeader label="Status" sortKey="status" /></th>
                  <th className="text-left px-4 py-3"><SortHeader label="Submitted" sortKey="updatedAt" /></th>
                  <th className="text-right px-4 py-3"><span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</span></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{r.fullName || "—"}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.schoolId || "—"}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.academicYear || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-[#007848]/10 dark:bg-[#007848]/20 text-[#007848] dark:text-[#00a35e] rounded-lg">{r.department || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDownloadPdf(r)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">
                          <FiFileText /> PDF
                        </button>
                        <button onClick={() => setViewRecord(r)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#007848] dark:text-[#00a35e] bg-[#007848]/10 dark:bg-[#007848]/20 rounded-xl hover:bg-[#007848]/20 dark:hover:bg-[#007848]/30 transition cursor-pointer">
                          <FiEye /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500">
          {sorted.length} of {records.length} record{sorted.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* View Modal */}
      {viewRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto" onClick={() => setViewRecord(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl mx-4 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Student Needs Assessment</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDownloadPdf(viewRecord)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#007848] dark:text-[#00a35e] bg-[#007848]/10 dark:bg-[#007848]/20 rounded-xl hover:bg-[#007848]/20 dark:hover:bg-[#007848]/30 transition cursor-pointer">
                    <FiDownload /> Download PDF
                  </button>
                  <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Status:</span>
                  <select
                    value={viewRecord.status || "submitted"}
                    onChange={(e) => handleStatusUpdate(viewRecord.id, e.target.value)}
                    disabled={updatingId === viewRecord.id}
                    className="text-xs font-semibold border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-[#007848] dark:focus:border-[#00a35e] cursor-pointer"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <button onClick={() => setViewRecord(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <Section title="Basic Information">
                <Field label="Full Name" value={viewRecord.fullName} />
                <Field label="Student ID" value={viewRecord.studentId} />
                <Field label="School ID" value={viewRecord.schoolId} />
                <Field label="Email" value={viewRecord.email} />
                <Field label="Contact Number" value={viewRecord.contactNumber} />
                <Field label="Birthday" value={viewRecord.birthday} />
                <Field label="Age" value={viewRecord.age} />
                <Field label="Address" value={viewRecord.address} />
              </Section>

              <Section title="School Information">
                <Field label="Academic Year" value={viewRecord.academicYear} />
                <Field label="Department" value={viewRecord.department} />
                <Field label="Course / Strand / Grade Level" value={viewRecord.courseOrStrand} />
              </Section>

              <Section title="Academic Concerns">
                <Field label="Difficult Subjects" value={viewRecord.academicDifficultSubjects} />
                <Field label="Study Habits" value={viewRecord.academicStudyHabits} />
                <Field label="Learning Difficulties" value={viewRecord.academicLearningDifficulties} />
                <Field label="Other Academic Concerns" value={viewRecord.academicConcerns} />
              </Section>

              <Section title="Personal Concerns">
                <Field label="Personal Problems" value={viewRecord.personalProblems} />
                <Field label="Adjustment" value={viewRecord.personalAdjustment} />
                <Field label="Family Concerns" value={viewRecord.personalFamilyConcerns} />
              </Section>

              <Section title="Emotional">
                <Field label="Stress Level" value={viewRecord.emotionalStressLevel} />
                <Field label="Anxiety / Sadness / Pressure" value={viewRecord.emotionalAnxiety} />
                <Field label="Motivation Issues" value={viewRecord.emotionalMotivation} />
                <Field label="Self-Confidence" value={viewRecord.emotionalSelfConfidence} />
              </Section>

              <Section title="Social">
                <Field label="Relationship with Classmates" value={viewRecord.socialClassmates} />
                <Field label="Friendships / Peer Interaction" value={viewRecord.socialFriendships} />
                <Field label="Communication Difficulties" value={viewRecord.socialCommunication} />
                <Field label="Bullying Concerns" value={viewRecord.socialBullying} />
              </Section>

              <Section title="Financial">
                <Field label="Allowance Concerns" value={viewRecord.financialAllowance} />
                <Field label="School Expenses Difficulty" value={viewRecord.financialExpenses} />
                <Field label="Scholarship Needs" value={viewRecord.financialScholarship} />
              </Section>

              <Section title="Career">
                <Field label="Career Goal / Course Interest" value={viewRecord.careerGoal} />
                <Field label="Uncertainty sa Course" value={viewRecord.careerUncertainty} />
                <Field label="Skills or Interests" value={viewRecord.careerSkills} />
              </Section>

              <Section title="Health">
                <Field label="Medical Condition" value={viewRecord.healthMedical} />
                <Field label="Physical Limitations" value={viewRecord.healthPhysicalLimitations} />
              </Section>

              <Section title="Support Needed">
                <div className="flex flex-wrap gap-2 mb-3">
                  {viewRecord.supportCounseling && <SupportBadge label="Counseling" />}
                  {viewRecord.supportAcademic && <SupportBadge label="Academic Support" />}
                  {viewRecord.supportScholarship && <SupportBadge label="Scholarship Assistance" />}
                  {viewRecord.supportCareer && <SupportBadge label="Career Guidance" />}
                  {!viewRecord.supportCounseling && !viewRecord.supportAcademic && !viewRecord.supportScholarship && !viewRecord.supportCareer && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">None selected</span>
                  )}
                </div>
                <Field label="Other Support Needed" value={viewRecord.supportOther} />
              </Section>

              <Section title="Other">
                <Field label="Other Concerns" value={viewRecord.otherConcerns} />
              </Section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status || "submitted";
  const styles: Record<string, string> = {
    submitted: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
    reviewed: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    "in-progress": "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
    resolved: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-lg ${styles[s] || styles.submitted}`}>
      {s === "resolved" ? <FiCheckCircle className="text-[10px]" /> : <FiClock className="text-[10px]" />}
      {s}
    </span>
  );
}

function SupportBadge({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-[#007848]/10 dark:bg-[#007848]/20 text-[#007848] dark:text-[#00a35e] rounded-lg">
      {label}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-900 dark:text-white mt-0.5 break-words">{value || "—"}</p>
    </div>
  );
}
