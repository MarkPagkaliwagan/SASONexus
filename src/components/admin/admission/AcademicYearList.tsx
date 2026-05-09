"use client";

import { useState } from "react";
import { toggleAcademicYear, deleteAcademicYear, createSemester, toggleSemester, deleteSemester } from "@/lib/actions";
import { FiChevronDown, FiChevronRight, FiLoader, FiPlus, FiTrash2 } from "react-icons/fi";
import { ConfirmModal } from "./ConfirmModal";

interface Semester {
  id: number;
  name: string;
  isActive: boolean;
}

interface AcademicYear {
  id: number;
  year: string;
  isActive: boolean;
  semesters: Semester[];
}

export function AcademicYearList({ years }: { years: AcademicYear[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);
  const [semLoading, setSemLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [semToggling, setSemToggling] = useState<number | null>(null);
  const [semDeleteConfirm, setSemDeleteConfirm] = useState<{ id: number } | null>(null);
  const [semDeleting, setSemDeleting] = useState(false);

  async function handleToggle(id: number) {
    setToggling(id);
    await toggleAcademicYear(id);
    setToggling(null);
  }

  async function handleDelete() {
    if (deleteConfirm === null) return;
    setDeleting(true);
    await deleteAcademicYear(deleteConfirm);
    setDeleting(false);
    setDeleteConfirm(null);
  }

  async function handleAddSemester(formData: FormData) {
    setSemLoading(true);
    await createSemester(formData);
    setSemLoading(false);
    setOpenId(null);
  }

  async function handleSemDelete() {
    if (semDeleteConfirm === null) return;
    setSemDeleting(true);
    await deleteSemester(semDeleteConfirm.id);
    setSemDeleting(false);
    setSemDeleteConfirm(null);
  }

  return (
    <div className="space-y-4">
      {years.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No academic years yet.</p>
        </div>
      )}
      {years.map((year) => (
        <div key={year.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-4 flex-wrap">
            <button onClick={() => setOpenId(openId === year.id ? null : year.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              {openId === year.id ? <FiChevronDown /> : <FiChevronRight />}
            </button>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{year.year}</span>
              <span className={`ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${year.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                {year.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <button onClick={() => handleToggle(year.id)} disabled={toggling === year.id} className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50">
              {toggling === year.id ? "..." : year.isActive ? "Deactivate" : "Activate"}
            </button>
            <button onClick={() => setDeleteConfirm(year.id)} disabled={deleting} className="text-red-400 hover:text-red-600 transition disabled:opacity-50">
              <FiTrash2 className="text-sm" />
            </button>
          </div>

          {openId === year.id && (
            <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-950/50 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Semesters</p>
              {year.semesters.length === 0 && <p className="text-sm text-gray-400">No semesters yet.</p>}
              {year.semesters.map((sem) => (
                <div key={sem.id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{sem.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sem.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {sem.isActive ? "Active" : "Inactive"}
                  </span>
                  <button onClick={async () => { setSemToggling(sem.id); await toggleSemester(sem.id); setSemToggling(null); }} disabled={semToggling === sem.id} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline disabled:opacity-50">
                    {semToggling === sem.id ? "..." : "Toggle"}
                  </button>
                  <button onClick={() => setSemDeleteConfirm({ id: sem.id })} disabled={semDeleting} className="text-xs text-red-400 hover:text-red-600 underline disabled:opacity-50">Delete</button>
                </div>
              ))}
              <form action={handleAddSemester} className="flex gap-2 pt-2">
                <input type="hidden" name="academicYearId" value={year.id} />
                <input type="text" name="name" required placeholder="e.g. 1st Semester" disabled={semLoading} className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm outline-none focus:border-[#007848] text-gray-900 dark:text-white placeholder-gray-400" />
                <button type="submit" disabled={semLoading} className="flex items-center gap-1 text-xs font-semibold bg-[#007848] text-white px-3 py-1.5 rounded-lg hover:bg-[#005f38] transition disabled:opacity-50">
                  {semLoading ? <FiLoader className="animate-spin" /> : <FiPlus />} Add
                </button>
              </form>
            </div>
          )}
        </div>
      ))}
      <ConfirmModal
        open={deleteConfirm !== null}
        title="Delete Academic Year"
        message="Are you sure you want to delete this academic year? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteConfirm(null); setDeleting(false); }}
      />
      <ConfirmModal
        open={semDeleteConfirm !== null}
        title="Delete Semester"
        message="Are you sure you want to delete this semester? This action cannot be undone."
        confirmLabel="Delete"
        loading={semDeleting}
        onConfirm={handleSemDelete}
        onCancel={() => { setSemDeleteConfirm(null); setSemDeleting(false); }}
      />
    </div>
  );
}
