"use client";

import { useState, useMemo } from "react";
import { FiSearch, FiUser, FiPhone, FiX, FiEye, FiTrash2, FiCheck, FiAlertCircle } from "react-icons/fi";
import { deleteInterviewAppointment, updateInterviewAppointmentStatus } from "@/lib/actions";

interface Appointment {
  id: number;
  scheduleId: number;
  interviewType: string;
  studentType: string | null;
  academicLevel: string | null;
  fullName: string;
  studentId: string | null;
  email: string | null;
  contact: string | null;
  gradeLevel: string | null;
  strand: string | null;
  section: string | null;
  department: string | null;
  course: string | null;
  status: string;
  createdAt: Date | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function InterviewAppointments({ appointments }: { appointments: Appointment[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "initial" | "exit">("all");
  const [detailModal, setDetailModal] = useState<Appointment | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: number; action: string } | null>(null);

  async function handleDelete(id: number) {
    await deleteInterviewAppointment(id);
    setConfirmAction(null);
  }

  async function handleStatusUpdate(id: number, status: string) {
    await updateInterviewAppointmentStatus(id, status);
    setConfirmAction(null);
  }

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchesSearch = !search || a.fullName.toLowerCase().includes(search.toLowerCase()) ||
        (a.studentId && a.studentId.toLowerCase().includes(search.toLowerCase())) ||
        (a.email && a.email.toLowerCase().includes(search.toLowerCase())) ||
        (a.contact && a.contact.includes(search));
      const matchesType = typeFilter === "all" || a.interviewType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [appointments, search, typeFilter]);

  const initialAppointments = filtered.filter((a) => a.interviewType === "initial");
  const exitAppointments = filtered.filter((a) => a.interviewType === "exit");

  function renderTable(data: Appointment[]) {
    if (data.length === 0) {
      return (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">
          No appointments found.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Student</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hidden sm:table-cell">ID</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hidden md:table-cell">Contact</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hidden lg:table-cell">Level</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {data.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#007848]/10 flex items-center justify-center flex-shrink-0">
                      <FiUser className="text-[#007848] text-xs" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm block truncate max-w-[160px]">{a.fullName}</span>
                      {a.email && <span className="text-xs text-gray-400 truncate max-w-[160px] block">{a.email}</span>}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-600 dark:text-gray-400 text-xs hidden sm:table-cell">{a.studentId || "—"}</td>
                <td className="py-3 px-3 hidden md:table-cell">
                  {a.contact ? (
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <FiPhone className="text-[10px]" /> {a.contact}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="py-3 px-3 text-xs text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                  {a.academicLevel || a.gradeLevel || a.department || a.course || a.strand || "—"}
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[a.status] || "bg-gray-100 text-gray-700"}`}>
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-3 text-xs text-gray-400 hidden lg:table-cell whitespace-nowrap">
                  {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-2 sm:gap-3">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <button
                        onClick={() => setDetailModal(a)}
                        className="p-1.5 sm:px-2 sm:py-1 rounded-md text-gray-400 hover:text-[#007848] hover:bg-[#007848]/10 transition-colors cursor-pointer text-xs font-medium"
                      >
                        <FiEye size={14} className="sm:hidden" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => setConfirmAction({ id: a.id, action: "delete" })}
                        className="p-1.5 sm:px-2 sm:py-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer text-xs font-medium"
                      >
                        <FiTrash2 size={14} className="sm:hidden" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                    {a.status === "pending" && (
                      <>
                        <span className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <button
                            onClick={() => setConfirmAction({ id: a.id, action: "completed" })}
                            className="p-1.5 sm:px-2 sm:py-1 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer text-xs font-medium"
                          >
                            <FiCheck size={14} className="sm:hidden" />
                            <span className="hidden sm:inline">Finish</span>
                          </button>
                          <button
                            onClick={() => setConfirmAction({ id: a.id, action: "no-show" })}
                            className="p-1.5 sm:px-2 sm:py-1 rounded-md text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer text-xs font-medium"
                          >
                            <FiAlertCircle size={14} className="sm:hidden" />
                            <span className="hidden sm:inline">No Show</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Interview Appointments</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Submitted interview requests from students.</p>
        </div>
        {filtered.length > 0 && (
          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">{filtered.length} total</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, email, or contact..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 outline-none focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {(["all", "initial", "exit"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                typeFilter === t
                  ? "bg-white dark:bg-gray-700 text-[#007848] dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {t === "all" ? "All" : t === "initial" ? "Initial" : "Exit"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {typeFilter === "all" || typeFilter === "initial" ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Initial Interviews</h3>
              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{initialAppointments.length}</span>
            </div>
            {renderTable(initialAppointments)}
          </div>
        ) : null}

        {typeFilter === "all" || typeFilter === "exit" ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Exit Interviews</h3>
              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{exitAppointments.length}</span>
            </div>
            {renderTable(exitAppointments)}
          </div>
        ) : null}
      </div>
    </div>

      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setDetailModal(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Appointment Details</h3>
              <button onClick={() => setDetailModal(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"><FiX size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Full Name</p><p className="text-sm font-medium text-gray-900 dark:text-white">{detailModal.fullName}</p></div>
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Student ID</p><p className="text-sm text-gray-700 dark:text-gray-300">{detailModal.studentId || "—"}</p></div>
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Interview Type</p><p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{detailModal.interviewType}</p></div>
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Student Type</p><p className="text-sm text-gray-700 dark:text-gray-300">{detailModal.studentType || "—"}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-400 uppercase tracking-wider">Email</p><p className="text-sm text-gray-700 dark:text-gray-300">{detailModal.email || "—"}</p></div>
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Contact</p><p className="text-sm text-gray-700 dark:text-gray-300">{detailModal.contact || "—"}</p></div>
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Status</p><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${statusColors[detailModal.status] || "bg-gray-100 text-gray-700"}`}>{detailModal.status.charAt(0).toUpperCase() + detailModal.status.slice(1)}</span></div>
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Academic Level</p><p className="text-sm text-gray-700 dark:text-gray-300">{detailModal.academicLevel || "—"}</p></div>
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Grade Level</p><p className="text-sm text-gray-700 dark:text-gray-300">{detailModal.gradeLevel || "—"}</p></div>
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Strand</p><p className="text-sm text-gray-700 dark:text-gray-300">{detailModal.strand || "—"}</p></div>
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Section</p><p className="text-sm text-gray-700 dark:text-gray-300">{detailModal.section || "—"}</p></div>
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Department</p><p className="text-sm text-gray-700 dark:text-gray-300">{detailModal.department || "—"}</p></div>
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Course</p><p className="text-sm text-gray-700 dark:text-gray-300">{detailModal.course || "—"}</p></div>
                <div><p className="text-xs text-gray-400 uppercase tracking-wider">Submitted At</p><p className="text-sm text-gray-700 dark:text-gray-300">{detailModal.createdAt ? new Date(detailModal.createdAt).toLocaleString() : "—"}</p></div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button onClick={() => setDetailModal(null)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setConfirmAction(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-800 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
              {confirmAction.action === "delete" ? "Delete Appointment" : confirmAction.action === "completed" ? "Mark as Finished" : "Mark as No Show"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {confirmAction.action === "delete"
                ? "Are you sure you want to delete this appointment? This action cannot be undone."
                : confirmAction.action === "completed"
                ? "Confirm that this student has completed the interview."
                : "Confirm that this student did not show up for the interview."}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">Cancel</button>
              <button
                onClick={() => {
                  if (confirmAction.action === "delete") handleDelete(confirmAction.id);
                  else handleStatusUpdate(confirmAction.id, confirmAction.action);
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition cursor-pointer ${
                  confirmAction.action === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : confirmAction.action === "completed"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {confirmAction.action === "delete" ? "Delete" : confirmAction.action === "completed" ? "Finish" : "No Show"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
