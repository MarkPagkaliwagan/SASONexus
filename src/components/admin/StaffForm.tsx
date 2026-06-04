"use client";

import { useState, useRef } from "react";
import { createStaffAccount } from "@/lib/actions";
import { FiCamera, FiLoader, FiCheck } from "react-icons/fi";

const PERMISSION_OPTIONS = [
  { key: "personnel", label: "Personnel" },
  { key: "announcements", label: "Announcements" },
  { key: "academic-setup", label: "Academic Setup" },
  { key: "cumulative-records", label: "Cumulative Records" },
  { key: "student-needs-assessment", label: "Student Needs Assessment" },
  { key: "handbooks-pillars", label: "Handbooks & Pillars" },
  { key: "admission", label: "Admission" },
  { key: "interview", label: "Interview" },
  { key: "document-claims", label: "Document Claims" },
];

interface SasoUnit {
  id: number;
  name: string;
  slug: string;
  positions: { id: number; name: string }[];
}

export function StaffForm({ units }: { units: SasoUnit[] }) {
  const [selectedUnit, setSelectedUnit] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedSasoUnit = units.find(
    (u) => u.id === parseInt(selectedUnit)
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    try {
      await createStaffAccount(formData);
      setMessage({ type: "success", text: "Staff account created successfully!" });
      (document.getElementById("staff-form") as HTMLFormElement)?.reset();
      setSelectedUnit("");
      setPreview(null);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to create staff account",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Create Staff Account</h2>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form id="staff-form" action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Juan Dela Cruz"
            disabled={loading}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={loading}
            placeholder="staff@sanpablocolleges.edu.ph"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            disabled={loading}
            placeholder="Min. 8 characters"
            minLength={8}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Profile Picture
          </label>
          <button
            type="button"
            disabled={loading}
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-4 text-center hover:border-[#007848] dark:hover:border-[#00a35e] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-20 h-20 rounded-full object-cover mx-auto" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <FiCamera className="text-xl text-gray-400" />
                <span className="text-xs text-gray-400">Click to upload photo</span>
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div>
          <label htmlFor="unitId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            SASO Unit
          </label>
          <select
            id="unitId"
            name="unitId"
            required
            disabled={loading}
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select SASO unit...</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="positionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Position / Role
          </label>
          <select
            id="positionId"
            name="positionId"
            required
            disabled={loading || !selectedSasoUnit}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {selectedSasoUnit ? "Select position..." : "Select SASO unit first"}
            </option>
            {selectedSasoUnit?.positions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Module Access
          </label>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Select which modules this staff can access.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PERMISSION_OPTIONS.map((perm) => (
              <label
                key={perm.key}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-[#007848] dark:hover:border-[#00a35e] transition has-checked:bg-[#007848]/5 dark:has-checked:bg-[#00a35e]/10 has-checked:border-[#007848] dark:has-checked:border-[#00a35e]"
              >
                <input
                  type="checkbox"
                  name="permissions"
                  value={perm.key}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center peer-checked:bg-[#007848] peer-checked:border-[#007848] dark:peer-checked:bg-[#00a35e] dark:peer-checked:border-[#00a35e] transition">
                  <FiCheck className="text-white text-[10px] hidden peer-checked:block" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{perm.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#007848] text-white font-semibold py-2.5 rounded-xl hover:bg-[#005f38] transition focus:outline-none focus:ring-4 focus:ring-[#007848]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <><FiLoader className="animate-spin" /> Creating...</>
          ) : (
            "Create Staff Account"
          )}
        </button>
      </form>
    </div>
  );
}
