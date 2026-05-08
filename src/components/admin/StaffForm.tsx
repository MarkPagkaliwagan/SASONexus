"use client";

import { useState, useRef } from "react";
import { createStaffAccount } from "@/lib/actions";
import { FiCamera, FiLoader } from "react-icons/fi";

interface Department {
  id: number;
  name: string;
  slug: string;
  positions: { id: number; name: string }[];
}

export function StaffForm({ departments }: { departments: Department[] }) {
  const [selectedDept, setSelectedDept] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedDepartment = departments.find(
    (d) => d.id === parseInt(selectedDept)
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
      setSelectedDept("");
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
          <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Department
          </label>
          <select
            id="departmentId"
            name="departmentId"
            required
            disabled={loading}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select department...</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
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
            disabled={loading || !selectedDepartment}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {selectedDepartment ? "Select position..." : "Select department first"}
            </option>
            {selectedDepartment?.positions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.name}
              </option>
            ))}
          </select>
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
