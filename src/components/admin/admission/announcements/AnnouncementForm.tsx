"use client";

import { useState, useRef } from "react";
import { createAnnouncement } from "@/lib/actions";
import { FiLoader, FiImage } from "react-icons/fi";

const CATEGORIES = ["Enrollment", "Academics", "Activities", "Scholarship", "General", "Event", "Advisory"];

export function AnnouncementForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const formData = new FormData(e.currentTarget);
      const fileInput = e.currentTarget.querySelector<HTMLInputElement>('input[type="file"]');
      if (fileInput?.files?.[0]) {
        const b64 = await fileToBase64(fileInput.files[0]);
        formData.set("image", b64);
      }
      await createAnnouncement(formData);
      setMessage({ type: "success", text: "Announcement posted!" });
      formRef.current?.reset();
      setImagePreview("");
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Post Announcement</h2>
      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${message.type === "success" ? "bg-green-50 dark:bg-green-900/30 border border-green-200 text-green-700" : "bg-red-50 dark:bg-red-900/30 border border-red-200 text-red-600"}`}>
          {message.text}
        </div>
      )}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <input type="text" name="title" required placeholder="e.g. Enrollment Now Open" disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white placeholder-gray-400 transition disabled:opacity-50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
          <textarea name="content" required rows={4} placeholder="Write announcement details..." disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white placeholder-gray-400 transition disabled:opacity-50 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select name="category" disabled={loading} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition disabled:opacity-50 appearance-none">
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image (optional)</label>
          <input type="file" accept="image/*" disabled={loading} onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => setImagePreview(reader.result as string);
              reader.readAsDataURL(file);
            } else {
              setImagePreview("");
            }
          }} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#007848]/10 file:text-[#007848] file:text-sm file:font-medium hover:file:bg-[#007848]/20 transition disabled:opacity-50" />
          {imagePreview && (
            <div className="mt-2 flex items-center gap-2">
              <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
              <span className="text-xs text-gray-400">Image preview</span>
            </div>
          )}
        </div>
        <button type="submit" disabled={loading} className="w-full bg-[#007848] text-white font-semibold py-2.5 rounded-xl hover:bg-[#005f38] transition flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <><FiLoader className="animate-spin" /> Posting...</> : "Post Announcement"}
        </button>
      </form>
    </div>
  );
}
