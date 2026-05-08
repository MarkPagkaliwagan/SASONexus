"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { updatePreAdmissionStatus, deletePreAdmission } from "@/lib/actions";
import { FiTrash2, FiEye, FiX, FiSearch } from "react-icons/fi";
import { ConfirmModal } from "./ConfirmModal";

interface PreAdmissionItem {
  id: number;
  applicationLevel: string;
  academicYear: string | null;
  semester: string | null;
  gradeLevel: string | null;
  firstChoice: string | null;
  secondChoice: string | null;
  familyName: string;
  givenName: string;
  middleName: string | null;
  gender: string | null;
  birthDate: string | null;
  age: string | null;
  placeOfBirth: string | null;
  religion: string | null;
  civilStatus: string | null;
  citizenship: string | null;
  houseNo: string | null;
  province: string | null;
  cityMunicipality: string | null;
  barangay: string | null;
  zipCode: string | null;
  telNo: string | null;
  mobileNo: string | null;
  email: string | null;
  residence: string | null;
  pictureUrl: string | null;
  fatherName: string | null;
  fatherAddress: string | null;
  fatherTel: string | null;
  fatherCitizenship: string | null;
  fatherOccupation: string | null;
  fatherOfficeAddress: string | null;
  fatherOfficeTel: string | null;
  fatherEducation: string | null;
  fatherLastSchool: string | null;
  fatherAlumnus: string | null;
  motherName: string | null;
  motherAddress: string | null;
  motherTel: string | null;
  motherCitizenship: string | null;
  motherOccupation: string | null;
  motherOfficeAddress: string | null;
  motherOfficeTel: string | null;
  motherEducation: string | null;
  motherLastSchool: string | null;
  motherAlumnus: string | null;
  lrnNo: string | null;
  lastSchoolAttended: string | null;
  schoolAddress: string | null;
  track: string | null;
  strand: string | null;
  schoolYearAttended: string | null;
  dateOfGraduation: string | null;
  honorsAwards: string | null;
  isTransferee: string | null;
  freePreAdmission: string | null;
  previousSchool: string | null;
  stabCode: string | null;
  preferredSchedule: string | null;
  privacyAgreed: boolean;
  examResult: string | null;
  status: string;
  submittedAt: Date;
}

interface ScheduleInfo {
  id: number;
  level: string;
  date: string | null;
  time: string | null;
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="col-span-2 text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3 pb-1 border-b border-gray-200 dark:border-gray-700">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailModal({ item, onClose, scheduleMap }: { item: PreAdmissionItem; onClose: () => void; scheduleMap: Record<string, ScheduleInfo> }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-[#007848]/10 dark:bg-[#007848]/20 flex items-center justify-center">
              {item.pictureUrl ? (
                <img src={item.pictureUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-[#007848] dark:text-[#00a35e]">
                  {item.givenName.charAt(0)}{item.familyName.charAt(0)}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {item.givenName} {item.familyName}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <FiX className="text-xl" />
          </button>
        </div>
        <div className="px-6 py-4">
          <DetailSection title="Application">
            <DetailRow label="Level" value={item.applicationLevel} />
            <DetailRow label="Academic Year" value={item.academicYear} />
            <DetailRow label="Semester" value={item.semester} />
            <DetailRow label="Grade Level" value={item.gradeLevel} />
            <DetailRow label="First Choice" value={item.firstChoice} />
            <DetailRow label="Second Choice" value={item.secondChoice} />
            <DetailRow label="Status" value={item.status} />
            <DetailRow label="Submitted" value={item.submittedAt ? new Date(item.submittedAt).toLocaleString() : null} />
          </DetailSection>

          <DetailSection title="Personal Information">
            <DetailRow label="Full Name" value={`${item.givenName} ${item.middleName || ""} ${item.familyName}`} />
            <DetailRow label="Gender" value={item.gender} />
            <DetailRow label="Birth Date" value={item.birthDate} />
            <DetailRow label="Age" value={item.age} />
            <DetailRow label="Place of Birth" value={item.placeOfBirth} />
            <DetailRow label="Religion" value={item.religion} />
            <DetailRow label="Civil Status" value={item.civilStatus} />
            <DetailRow label="Citizenship" value={item.citizenship} />
            <DetailRow label="Mobile No." value={item.mobileNo} />
            <DetailRow label="Tel No." value={item.telNo} />
            <DetailRow label="Email" value={item.email} />
            <DetailRow label="Residence" value={item.residence} />
          </DetailSection>

          <DetailSection title="Address">
            <DetailRow label="House No." value={item.houseNo} />
            <DetailRow label="Barangay" value={item.barangay} />
            <DetailRow label="City/Municipality" value={item.cityMunicipality} />
            <DetailRow label="Province" value={item.province} />
            <DetailRow label="ZIP Code" value={item.zipCode} />
          </DetailSection>

          <DetailSection title="Father&apos;s Information">
            <DetailRow label="Name" value={item.fatherName} />
            <DetailRow label="Address" value={item.fatherAddress} />
            <DetailRow label="Tel No." value={item.fatherTel} />
            <DetailRow label="Citizenship" value={item.fatherCitizenship} />
            <DetailRow label="Occupation" value={item.fatherOccupation} />
            <DetailRow label="Office Address" value={item.fatherOfficeAddress} />
            <DetailRow label="Office Tel" value={item.fatherOfficeTel} />
            <DetailRow label="Education" value={item.fatherEducation} />
            <DetailRow label="Last School" value={item.fatherLastSchool} />
            <DetailRow label="Alumnus" value={item.fatherAlumnus} />
          </DetailSection>

          <DetailSection title="Mother&apos;s Information">
            <DetailRow label="Name" value={item.motherName} />
            <DetailRow label="Address" value={item.motherAddress} />
            <DetailRow label="Tel No." value={item.motherTel} />
            <DetailRow label="Citizenship" value={item.motherCitizenship} />
            <DetailRow label="Occupation" value={item.motherOccupation} />
            <DetailRow label="Office Address" value={item.motherOfficeAddress} />
            <DetailRow label="Office Tel" value={item.motherOfficeTel} />
            <DetailRow label="Education" value={item.motherEducation} />
            <DetailRow label="Last School" value={item.motherLastSchool} />
            <DetailRow label="Alumnus" value={item.motherAlumnus} />
          </DetailSection>

          <DetailSection title="Educational Background">
            <DetailRow label="LRN No." value={item.lrnNo} />
            <DetailRow label="Last School Attended" value={item.lastSchoolAttended} />
            <DetailRow label="School Address" value={item.schoolAddress} />
            <DetailRow label="Track" value={item.track} />
            <DetailRow label="Strand" value={item.strand} />
            <DetailRow label="School Year Attended" value={item.schoolYearAttended} />
            <DetailRow label="Date of Graduation" value={item.dateOfGraduation} />
            <DetailRow label="Honors/Awards" value={item.honorsAwards} />
            <DetailRow label="Transferee" value={item.isTransferee} />
          </DetailSection>

          <DetailSection title="Additional Info">
            <DetailRow label="Free Pre-Admission" value={item.freePreAdmission} />
            <DetailRow label="Previous School" value={item.previousSchool} />
            <DetailRow label="STAB Code" value={item.stabCode} />
            <DetailRow label="Preferred Schedule" value={
              item.preferredSchedule && scheduleMap[item.preferredSchedule]
                ? `${scheduleMap[item.preferredSchedule].date || ""} ${scheduleMap[item.preferredSchedule].time || ""}`.trim()
                : item.preferredSchedule
            } />
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

function StatusDropdown({ item, onStatusChange, updating }: { item: PreAdmissionItem; onStatusChange: (id: number, status: string) => void; updating: boolean }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
  }, [open]);

  return (
    <div>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(!open)}
        disabled={updating}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
          statusColors[item.status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
        }`}
      >
        {updating ? "..." : statusLabels[item.status] || item.status}
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            style={{ position: "fixed", top: pos.top, left: pos.left }}
            className="z-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg py-1 min-w-[130px]"
          >
            {["pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { onStatusChange(item.id, s); setOpen(false); }}
                className={`block w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                  item.status === s ? "text-[#007848] dark:text-[#00a35e]" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function PreAdmissionList({ items, scheduleMap = {}, academicYearOptions = [] }: { items: PreAdmissionItem[]; scheduleMap?: Record<string, ScheduleInfo>; academicYearOptions?: string[] }) {
  const [updating, setUpdating] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<PreAdmissionItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [academicYear, setAcademicYear] = useState("all");

  const filtered = useMemo(() => {
    let result = items;

    if (academicYear !== "all") {
      result = result.filter((item) => item.academicYear === academicYear);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          `${item.givenName} ${item.familyName}`.toLowerCase().includes(q) ||
          item.applicationLevel.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "newest": return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case "oldest": return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        case "name-asc": return `${a.givenName} ${a.familyName}`.localeCompare(`${b.givenName} ${b.familyName}`);
        case "name-desc": return `${b.givenName} ${b.familyName}`.localeCompare(`${a.givenName} ${a.familyName}`);
        case "status": return a.status.localeCompare(b.status);
        default: return 0;
      }
    });

    return result;
  }, [items, search, sort]);

  async function handleStatus(id: number, status: string) {
    setUpdating(id);
    await updatePreAdmissionStatus(id, status);
    setUpdating(null);
  }

  async function handleDelete() {
    if (deleteConfirm === null) return;
    setDeleting(true);
    await deletePreAdmission(deleteConfirm);
    setDeleting(false);
    setDeleteConfirm(null);
  }

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No pre-admission applications yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Applications ({filtered.length})</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007848] w-48"
                />
              </div>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007848]"
              >
                <option value="all">All A.Y.</option>
                {academicYearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007848]"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Level</th>
                <th className="px-6 py-3 font-medium">Submitted</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No results found.</td>
                </tr>
              ) : filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-[#007848]/10 dark:bg-[#007848]/20 flex items-center justify-center">
                        {item.pictureUrl ? (
                          <img src={item.pictureUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold text-[#007848] dark:text-[#00a35e]">
                            {item.givenName.charAt(0)}{item.familyName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.givenName} {item.familyName}
                        </span>
                        {item.middleName && (
                          <span className="text-gray-400 ml-1">{item.middleName}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {item.applicationLevel}
                    {item.gradeLevel && <span className="text-gray-400 ml-1">- {item.gradeLevel}</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusDropdown item={item} onStatusChange={handleStatus} updating={updating === item.id} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setDetailItem(item)}
                        className="text-blue-400 hover:text-blue-600 transition p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="View details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        disabled={deleting}
                        className="text-red-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                        title="Delete"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detailItem && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} scheduleMap={scheduleMap} />}
      <ConfirmModal
        open={deleteConfirm !== null}
        title="Delete Pre-Admission"
        message="Are you sure you want to delete this pre-admission application? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteConfirm(null); setDeleting(false); }}
      />
    </>
  );
}
