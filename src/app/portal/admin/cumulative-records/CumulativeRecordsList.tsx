"use client";

import { useState, useMemo } from "react";
import { FiSearch, FiChevronUp, FiChevronDown, FiEye, FiX, FiDownload, FiFileText } from "react-icons/fi";
import { generateCrfPdf } from "@/lib/crf-pdf";

interface CrfRecord {
  id: number;
  studentId: string | null;
  academicYear: string | null;
  department: string | null;
  schoolId: string | null;
  fullName: string | null;
  email: string | null;
  contactNumber: string | null;
  address: string | null;
  birthday: string | null;
  age: string | null;
  nationality: string | null;
  elemSchool: string | null;
  elemYear: string | null;
  jhsSchool: string | null;
  jhsYear: string | null;
  shsSchool: string | null;
  shsYear: string | null;
  collegeProgram: string | null;
  collegeYearLevel: string | null;
  corUpload: string | null;
  enrollmentFormUpload: string | null;
  admissionRecordUpload: string | null;
  reportCardUpload: string | null;
  torUpload: string | null;
  subjectLoadUpload: string | null;
  psaBirthCertUpload: string | null;
  idPictureUpload: string | null;
  schoolIdUpload: string | null;
  goodMoralUpload: string | null;
  conductRecordUpload: string | null;
  parentName: string | null;
  parentRelationship: string | null;
  parentContact: string | null;
  emergencyPerson: string | null;
  emergencyRelationship: string | null;
  emergencyContact: string | null;
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

type SortKey = "fullName" | "schoolId" | "academicYear" | "department" | "updatedAt";

export function CumulativeRecordsList({ records }: { records: CrfRecord[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [viewRecord, setViewRecord] = useState<CrfRecord | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter((r) =>
      !q ||
      (r.fullName && r.fullName.toLowerCase().includes(q)) ||
      (r.schoolId && r.schoolId.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.academicYear && r.academicYear.toLowerCase().includes(q)) ||
      (r.department && r.department.toLowerCase().includes(q))
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

  async function handleDownloadPdf(r: CrfRecord) {
    const doc = await generateCrfPdf(r);
    doc.save(`CRF_${r.schoolId || r.id}_${r.fullName?.replace(/\s+/g, "_") || "student"}.pdf`);
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
              placeholder="Search by name, ID, email..."
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
                  <th className="text-left px-4 py-3"><SortHeader label="Last Updated" sortKey="updatedAt" /></th>
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
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                      {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) : "—"}
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
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cumulative Record</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => handleDownloadPdf(viewRecord)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#007848] dark:text-[#00a35e] bg-[#007848]/10 dark:bg-[#007848]/20 rounded-xl hover:bg-[#007848]/20 dark:hover:bg-[#007848]/30 transition cursor-pointer">
                  <FiDownload /> Download PDF
                </button>
                <button onClick={() => setViewRecord(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <Section title="Basic Information">
                <Field label="Full Name" value={viewRecord.fullName} />
                <Field label="School ID" value={viewRecord.schoolId} />
                <Field label="Academic Year" value={viewRecord.academicYear} />
                <Field label="Department" value={viewRecord.department} />
                <Field label="Course / Strand / Grade Level" value={viewRecord.collegeProgram} />
              </Section>

              {/* Personal Info */}
              <Section title="Personal Information">
                <Field label="Email" value={viewRecord.email} />
                <Field label="Address" value={viewRecord.address} />
                <Field label="Contact Number" value={viewRecord.contactNumber} />
                <Field label="Birthday" value={viewRecord.birthday} />
                <Field label="Age" value={viewRecord.age} />
                <Field label="Nationality" value={viewRecord.nationality} />
              </Section>

              {/* Educational Background */}
              <Section title="Educational Background">
                <Field label="Elementary School" value={viewRecord.elemSchool} />
                <Field label="Elem. Year Graduated" value={viewRecord.elemYear} />
                <Field label="Junior High School" value={viewRecord.jhsSchool} />
                <Field label="JHS Year Graduated" value={viewRecord.jhsYear} />
                <Field label="Senior High School" value={viewRecord.shsSchool} />
                <Field label="SHS Year Graduated" value={viewRecord.shsYear} />
                <Field label="College Program" value={viewRecord.collegeProgram} />
                <Field label="College Year Level" value={viewRecord.collegeYearLevel} />
              </Section>

              {/* Uploads */}
              <Section title="Uploaded Documents">
                {viewRecord.corUpload && <DocLink label="Certificate of Registration (COR)" url={viewRecord.corUpload} />}
                {viewRecord.enrollmentFormUpload && <DocLink label="Enrollment / Admission Form" url={viewRecord.enrollmentFormUpload} />}
                {viewRecord.admissionRecordUpload && <DocLink label="Admission Record" url={viewRecord.admissionRecordUpload} />}
                {viewRecord.reportCardUpload && <DocLink label="Report Card (Form 138)" url={viewRecord.reportCardUpload} />}
                {viewRecord.torUpload && <DocLink label="Transcript of Records (Form 137)" url={viewRecord.torUpload} />}
                {viewRecord.subjectLoadUpload && <DocLink label="Subject Load / Schedule" url={viewRecord.subjectLoadUpload} />}
                {viewRecord.psaBirthCertUpload && <DocLink label="PSA Birth Certificate" url={viewRecord.psaBirthCertUpload} />}
                {viewRecord.idPictureUpload && <DocLink label="2x2 ID Picture" url={viewRecord.idPictureUpload} />}
                {viewRecord.schoolIdUpload && <DocLink label="School ID Copy" url={viewRecord.schoolIdUpload} />}
                {viewRecord.goodMoralUpload && <DocLink label="Good Moral Certificate" url={viewRecord.goodMoralUpload} />}
                {viewRecord.conductRecordUpload && <DocLink label="Discipline / Conduct Record" url={viewRecord.conductRecordUpload} />}
                {!viewRecord.corUpload && !viewRecord.enrollmentFormUpload && !viewRecord.admissionRecordUpload &&
                 !viewRecord.reportCardUpload && !viewRecord.torUpload && !viewRecord.subjectLoadUpload &&
                 !viewRecord.psaBirthCertUpload && !viewRecord.idPictureUpload && !viewRecord.schoolIdUpload &&
                 !viewRecord.goodMoralUpload && !viewRecord.conductRecordUpload && (
                  <p className="text-sm text-gray-400 dark:text-gray-500">No documents uploaded.</p>
                )}
              </Section>

              {/* Emergency */}
              <Section title="Emergency Contact">
                <Field label="Parent/Guardian Name" value={viewRecord.parentName} />
                <Field label="Relationship" value={viewRecord.parentRelationship} />
                <Field label="Contact" value={viewRecord.parentContact} />
                <Field label="Emergency Person" value={viewRecord.emergencyPerson} />
                <Field label="Relationship" value={viewRecord.emergencyRelationship} />
                <Field label="Contact" value={viewRecord.emergencyContact} />
              </Section>
            </div>
          </div>
        </div>
      )}
    </>
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
      <p className="text-sm text-gray-900 dark:text-white mt-0.5">{value || "—"}</p>
    </div>
  );
}

function DocLink({ label, url }: { label: string; url: string }) {
  const isImage = url.startsWith("data:image/");
  const isPdf = url.startsWith("data:application/pdf") || url.endsWith(".pdf");
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <a href={url} download className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#007848] dark:text-[#00a35e] bg-[#007848]/10 dark:bg-[#007848]/20 rounded-xl hover:bg-[#007848]/20 dark:hover:bg-[#007848]/30 transition cursor-pointer">
        <FiDownload /> {isImage ? "View" : isPdf ? "Download PDF" : "Download"}
      </a>
    </div>
  );
}
