"use client";

import { useState, useRef, useEffect } from "react";
import { createPersonnel, updatePersonnel } from "@/lib/actions";
import { FiCamera, FiLoader, FiX } from "react-icons/fi";

interface Position {
  id: number;
  name: string;
}

interface SasoUnit {
  id: number;
  name: string;
  slug: string;
  positions?: Position[];
}

interface EditingPersonnel {
  id: number;
  name: string;
  position: string | null;
  email: string | null;
  contact: string | null;
  avatarUrl: string | null;
  unitId: number | null;
  isHead: boolean;
}

interface Props {
  units: SasoUnit[];
  editingPersonnel?: EditingPersonnel | null;
  onCancelEdit?: () => void;
}

export function PersonnelForm({ units, editingPersonnel, onCancelEdit }: Props) {
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [customPosition, setCustomPosition] = useState("");
  const [useCustomPosition, setUseCustomPosition] = useState(false);
  const [isHead, setIsHead] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!editingPersonnel;

  useEffect(() => {
    if (editingPersonnel) {
      setSelectedUnit(editingPersonnel.unitId ? String(editingPersonnel.unitId) : "");
      setSelectedPosition(editingPersonnel.position || "");
      setUseCustomPosition(false);
      setCustomPosition("");
      setIsHead(editingPersonnel.isHead);
      setPreview(editingPersonnel.avatarUrl);
      setMessage(null);
    }
  }, [editingPersonnel]);

  const selectedSasoUnit = selectedUnit ? units.find(
    (u) => u.id === parseInt(selectedUnit)
  ) : null;
  const positions = selectedSasoUnit?.positions || [];
  const selectedPosObj = selectedPosition ? positions.find((p) => p.name === selectedPosition) : null;
  const hasCustomPosition = useCustomPosition || (!!selectedPosition && !selectedPosObj);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function resetForm() {
    formRef.current?.reset();
    setSelectedUnit("");
    setSelectedPosition("");
    setCustomPosition("");
    setUseCustomPosition(false);
    setPreview(null);
    setMessage(null);
    onCancelEdit?.();
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    try {
      if (isEditing && editingPersonnel) {
        formData.set("id", String(editingPersonnel.id));
        await updatePersonnel(formData);
        setMessage({ type: "success", text: "Personnel updated successfully!" });
      } else {
        await createPersonnel(formData);
        setMessage({ type: "success", text: "Personnel added successfully!" });
      }
      if (!isEditing) resetForm();
      formRef.current?.reset();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save personnel",
      });
    } finally {
      setLoading(false);
    }
  }

  function handlePositionSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val === "__other__") {
      setUseCustomPosition(true);
      setSelectedPosition("");
    } else {
      setUseCustomPosition(false);
      setSelectedPosition(val);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isEditing ? "Edit Personnel" : "Add Personnel"}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <FiX className="text-lg" />
          </button>
        )}
      </div>

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

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={editingPersonnel?.name || ""}
            placeholder="Juan Dela Cruz"
            disabled={loading}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={editingPersonnel?.email || ""}
            placeholder="personnel@sanpablocolleges.edu.ph"
            disabled={loading}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contact Number
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            defaultValue={editingPersonnel?.contact || ""}
            placeholder="09123456789"
            disabled={loading}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="unitId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            SASO Unit {!isHead && <span className="text-red-500">*</span>}
          </label>
          <select
            id="unitId"
            name="unitId"
            required={!isHead}
            disabled={loading || isHead}
            value={selectedUnit}
            onChange={(e) => { setSelectedUnit(e.target.value); setSelectedPosition(""); setUseCustomPosition(false); }}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">{isHead ? "Not required for SASO Head" : "Select SASO unit..."}</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 p-3 bg-[#007848]/5 dark:bg-[#007848]/10 rounded-xl border border-[#007848]/10">
          <input
            id="isHead"
            name="isHead"
            type="checkbox"
            checked={isHead}
            onChange={(e) => setIsHead(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 rounded border-gray-300 text-[#007848] focus:ring-[#007848] cursor-pointer"
          />
          <label htmlFor="isHead" className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer select-none">
            Mark as SASO Head
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Position
          </label>
          {!useCustomPosition ? (
            <select
              value={selectedPosition}
              onChange={handlePositionSelect}
              disabled={loading || !selectedSasoUnit}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {positions.length > 0 ? "Select position..." : "No positions available"}
              </option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.name}>
                  {pos.name}
                </option>
              ))}
              {positions.length > 0 && (
                <option value="__other__">Other (type custom position)</option>
              )}
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                name="position"
                type="text"
                value={customPosition}
                onChange={(e) => setCustomPosition(e.target.value)}
                placeholder="Type custom position..."
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] dark:focus:border-[#00a35e] focus:ring-4 focus:ring-[#007848]/10 dark:focus:ring-[#00a35e]/20 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => { setUseCustomPosition(false); setCustomPosition(""); }}
                disabled={loading}
                className="px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Back
              </button>
            </div>
          )}
          {useCustomPosition && (
            <input type="hidden" name="position" value={customPosition} />
          )}
          {!useCustomPosition && (
            <input type="hidden" name="position" value={selectedPosition} />
          )}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#007848] text-white font-semibold py-2.5 rounded-xl hover:bg-[#005f38] transition focus:outline-none focus:ring-4 focus:ring-[#007848]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <><FiLoader className="animate-spin" /> {isEditing ? "Saving..." : "Adding..."}</>
          ) : (
            isEditing ? "Save Changes" : "Add Personnel"
          )}
        </button>
      </form>
    </div>
  );
}
