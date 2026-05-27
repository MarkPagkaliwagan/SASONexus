"use client";

import { useState, useRef } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiBook, FiStar } from "react-icons/fi";
import { createHandbookPillar, updateHandbookPillar, deleteHandbookPillar } from "@/lib/actions";

interface Item {
  id: number;
  type: string;
  title: string;
  content: string;
  image: string | null;
  sortOrder: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export function HandbooksPillarsManager({ items }: { items: Item[] }) {
  const [editing, setEditing] = useState<Item | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("handbook");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert("Image must be smaller than 2MB"); e.target.value = ""; return; }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function resetForm() {
    setType("handbook");
    setTitle("");
    setContent("");
    setSortOrder(0);
    setImageFile(null);
    setImagePreview(null);
    setEditing(null);
    setShowForm(false);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setType(item.type);
    setTitle(item.title);
    setContent(item.content);
    setSortOrder(item.sortOrder || 0);
    setImagePreview(item.image);
    setImageFile(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    if (editing) fd.set("id", String(editing.id));
    fd.set("type", type);
    fd.set("title", title);
    fd.set("content", content);
    fd.set("sortOrder", String(sortOrder));
    if (imageFile) {
      const b64 = await fileToBase64(imageFile);
      fd.set("image", b64);
    }
    try {
      if (editing) {
        await updateHandbookPillar(fd);
      } else {
        await createHandbookPillar(fd);
      }
      resetForm();
      window.location.reload();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteHandbookPillar(id);
      window.location.reload();
    } catch (e: any) {
      alert(e.message);
    }
  }

  const handbooks = items.filter((i) => i.type === "handbook");
  const pillars = items.filter((i) => i.type === "pillar");

  return (
    <div className="space-y-8">
      {/* Add Button */}
      <button
        onClick={() => { resetForm(); setShowForm(true); }}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#007848] rounded-xl hover:bg-[#005f3a] transition cursor-pointer"
      >
        <FiPlus /> Add New
      </button>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 pb-10 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editing ? "Edit" : "Add"} Handbook / Pillar</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                <FiX className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
                <div className="flex gap-4">
                  {["handbook", "pillar"].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="accent-[#007848]" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#007848] bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={5}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#007848] bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-y" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Sort Order</label>
                <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                  className="w-24 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#007848] bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Image (optional)</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#007848]/10 file:text-[#007848] hover:file:bg-[#007848]/20 cursor-pointer" />
                {imagePreview && (
                  <div className="mt-2 relative inline-block">
                    <img src={imagePreview} alt="Preview" className="h-24 rounded-lg border border-gray-200 object-cover" />
                    <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-red-600">
                      <FiX />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[#007848] rounded-xl hover:bg-[#005f3a] transition cursor-pointer">
                  {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Handbooks List */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiBook className="text-[#007848]" /> Handbooks ({handbooks.length})
        </h2>
        {handbooks.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No handbooks yet.</p>
        ) : (
          <div className="space-y-3">
            {handbooks.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-start gap-4">
                {item.image && (
                  <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-100 dark:border-gray-700 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.content}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Order: {item.sortOrder ?? 0}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-[#007848] hover:bg-[#007848]/10 rounded-lg transition cursor-pointer">
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pillars List */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiStar className="text-[#b8860b]" /> Pillars ({pillars.length})
        </h2>
        {pillars.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No pillars yet.</p>
        ) : (
          <div className="space-y-3">
            {pillars.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-start gap-4">
                {item.image && (
                  <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-100 dark:border-gray-700 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.content}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Order: {item.sortOrder ?? 0}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-[#b8860b] hover:bg-[#b8860b]/10 rounded-lg transition cursor-pointer">
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
