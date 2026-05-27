"use client";

import { useState, useRef, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiBook, FiStar } from "react-icons/fi";
import { FaBook, FaStar, FaCheckCircle, FaClock, FaSearch, FaDownload, FaTimes, FaUser, FaFileInvoice, FaCalendar, FaBuilding, FaGraduationCap } from "react-icons/fa";
import { createHandbookPillar, updateHandbookPillar, deleteHandbookPillar, updateDocumentClaimStatus } from "@/lib/actions";

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

type Claim = {
  id: number;
  type: string;
  orNumber: string;
  fullName: string;
  status: string;
  academicYear: string | null;
  department: string | null;
  course: string | null;
  strand: string | null;
  level: string | null;
  pillarYear: string | null;
  createdAt: Date;
};

export function HandbooksPillarsManager({ items, claims }: { items: Item[]; claims: Claim[] }) {
  const [tab, setTab] = useState<"content" | "claims">("content");
  const [editing, setEditing] = useState<Item | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("handbook");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "handbook" | "yearbook">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "claimed">("all");
  const [selected, setSelected] = useState<Claim | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);
  const [revertTarget, setRevertTarget] = useState<Claim | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) setShowRevertConfirm(false);
  }, [selected]);

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
      setAlertMessage(e.message);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteHandbookPillar(deleteTarget);
      window.location.reload();
    } catch (e: any) {
      setAlertMessage(e.message);
    } finally {
      setDeleteTarget(null);
    }
  }

  const handleStatusToggle = async (c: Claim) => {
    setUpdating(c.id);
    try {
      const newStatus = c.status === "pending" ? "claimed" : "pending";
      await updateDocumentClaimStatus(c.id, newStatus as "pending" | "claimed");
      c.status = newStatus;
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const handbooks = items.filter((i) => i.type === "handbook");
  const pillars = items.filter((i) => i.type === "pillar");

  const filtered = claims.filter((c) => {
    if (filterType !== "all" && c.type !== filterType) return false;
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    const q = search.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.orNumber.toLowerCase().includes(q) ||
      (c.academicYear || "").toLowerCase().includes(q) ||
      (c.department || "").toLowerCase().includes(q)
    );
  });

  const formatDate = (d: Date) => new Date(d).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const pendingCount = claims.filter((c) => c.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setTab("content")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            tab === "content"
              ? "border-[#007848] text-[#007848]"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setTab("claims")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer inline-flex items-center gap-2 ${
            tab === "claims"
              ? "border-[#007848] text-[#007848]"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Document Claims
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{pendingCount}</span>
          )}
        </button>
      </div>

      {/* Content Tab */}
      {tab === "content" && (
        <div className="space-y-8">
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#007848] rounded-xl hover:bg-[#005f3a] transition cursor-pointer"
          >
            <FiPlus /> Add New
          </button>

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
                        <button onClick={() => setDeleteTarget(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer">
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                        <button onClick={() => setDeleteTarget(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer">
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Claims Tab */}
      {tab === "claims" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, OR, year..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#007848] focus:ring-2 focus:ring-[#007848]/10 bg-white dark:bg-gray-900 dark:text-white transition-all"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "handbook", "yearbook"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterType === t
                      ? t === "handbook" ? "bg-[#007848]/10 text-[#007848] ring-2 ring-[#007848]/20" : t === "yearbook" ? "bg-[#b8860b]/10 text-[#b8860b] ring-2 ring-[#b8860b]/20" : "bg-gray-800 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {t === "all" ? "All" : t === "handbook" ? "Handbook" : "Yearbook"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(["all", "pending", "claimed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
                    filterStatus === s
                      ? s === "claimed" ? "bg-green-100 text-green-700 ring-2 ring-green-200" : s === "pending" ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200" : "bg-gray-800 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {s === "all" ? "All Status" : s === "pending" ? "Pending" : "Claimed"}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-400 text-xs">Status</th>
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-400 text-xs">Type</th>
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-400 text-xs">Full Name</th>
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-400 text-xs">OR Number</th>
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-400 text-xs">Academic Year</th>
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-400 text-xs">Level / Dept</th>
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-400 text-xs">Claimed At</th>
                  <th className="text-right p-3 font-semibold text-gray-600 dark:text-gray-400 text-xs">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === "claimed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {c.status === "claimed" ? <FaCheckCircle className="text-[8px]" /> : <FaClock className="text-[8px]" />}
                        {c.status === "claimed" ? "Claimed" : "Pending"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.type === "handbook" ? "bg-[#007848]/10 text-[#007848]" : "bg-[#b8860b]/10 text-[#b8860b]"
                      }`}>
                        {c.type === "handbook" ? <FaBook className="text-[9px]" /> : <FaStar className="text-[9px]" />}
                        {c.type === "handbook" ? "Handbook" : "Yearbook"}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-gray-800 dark:text-white">{c.fullName}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400 font-mono text-xs">{c.orNumber}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">{c.academicYear || "—"}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400 text-xs">
                      {c.level || "—"}
                      {c.department && <span className="block text-[10px] text-gray-400">{c.department}{c.course ? ` / ${c.course}` : ""}</span>}
                      {c.strand && <span className="block text-[10px] text-gray-400">Strand: {c.strand}</span>}
                    </td>
                    <td className="p-3 text-gray-500 dark:text-gray-500 text-xs">{formatDate(c.createdAt)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelected(c)}
                          className="px-3 py-1.5 bg-[#007848]/10 text-[#007848] text-[10px] font-bold rounded-lg hover:bg-[#007848]/20 transition-all cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            if (c.status === "claimed") { setRevertTarget(c); return; }
                            handleStatusToggle(c);
                          }}
                          disabled={updating === c.id}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                            c.status === "claimed"
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {updating === c.id ? "..." : c.status === "claimed" ? "Revert" : "Claim"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400 text-sm">No claims found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selected && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={() => setSelected(null)}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              <div
                className="relative bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg max-h-[95vh] overflow-y-auto animate-slide-up"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`relative overflow-hidden ${selected.type === "handbook" ? "bg-gradient-to-br from-[#007848] via-[#008f56] to-[#00a864]" : "bg-gradient-to-br from-[#b8860b] via-[#d49a1a] to-[#ffc107]"}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="relative px-6 pt-6 pb-8">
                    <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm">
                      <FaTimes className="text-white text-[10px]" />
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-black/10 ring-2 ring-white/20">
                        {selected.type === "handbook" ? <FaBook className="text-white text-xl" /> : <FaDownload className="text-white text-xl" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white tracking-tight capitalize">{selected.type} Claim</h3>
                        <div className="flex items-center gap-2.5 mt-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold ${
                            selected.status === "claimed" ? "bg-green-300/25 text-green-100" : "bg-yellow-300/25 text-yellow-100"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${selected.status === "claimed" ? "bg-green-300" : "bg-yellow-300"}`} />
                            {selected.status === "claimed" ? "Claimed" : "Pending"}
                          </span>
                          <span className="text-[11px] text-white/60 font-medium">#{selected.id.toString().padStart(4, "0")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 -mt-4">
                  <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#007848] to-[#00a864]" />
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Personal Information</p>
                    </div>
                    <div className="grid gap-4">
                      <InfoTile
                        icon={<FaUser />}
                        iconColor="text-blue-600 bg-blue-50"
                        label="Full Name"
                        value={selected.fullName}
                      />
                      <InfoTile
                        icon={<FaFileInvoice />}
                        iconColor="text-purple-600 bg-purple-50"
                        label="OR Number"
                        value={selected.orNumber}
                        mono
                      />
                      <InfoTile
                        icon={<FaCalendar />}
                        iconColor="text-amber-600 bg-amber-50"
                        label="Academic Year"
                        value={selected.academicYear || "—"}
                      />
                    </div>
                  </div>
                </div>

                {(selected.level || selected.department || selected.course || selected.strand || selected.pillarYear) && (
                  <div className="px-6 mt-3">
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#b8860b] to-[#ffc107]" />
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Academic Details</p>
                      </div>
                      <div className="grid gap-4">
                        {selected.level && (
                          <InfoTile
                            icon={<FaGraduationCap />}
                            iconColor="text-emerald-600 bg-emerald-50"
                            label="Level"
                            value={selected.level}
                          />
                        )}
                        {selected.department && (
                          <InfoTile
                            icon={<FaBuilding />}
                            iconColor="text-indigo-600 bg-indigo-50"
                            label="Department"
                            value={selected.department}
                          />
                        )}
                        {selected.course && (
                          <InfoTile
                            icon={<FaGraduationCap />}
                            iconColor="text-sky-600 bg-sky-50"
                            label="Course"
                            value={selected.course}
                          />
                        )}
                        {selected.strand && (
                          <InfoTile
                            icon={<FaStar />}
                            iconColor="text-rose-600 bg-rose-50"
                            label="Strand"
                            value={selected.strand}
                          />
                        )}
                        {selected.pillarYear && (
                          <InfoTile
                            icon={<FaCalendar />}
                            iconColor="text-teal-600 bg-teal-50"
                            label="Pillar Year"
                            value={selected.pillarYear}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="px-6 mt-3">
                  <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-5">
                    <InfoTile
                      icon={<FaClock />}
                      iconColor="text-gray-600 bg-gray-100"
                      label="Submitted"
                      value={formatDate(selected.createdAt)}
                    />
                  </div>
                </div>

                <div className="px-6 pb-6 mt-4">
                  {selected.status === "pending" ? (
                    <button
                      onClick={async () => {
                        await handleStatusToggle(selected);
                        setSelected({ ...selected, status: "claimed" });
                      }}
                      disabled={updating === selected.id}
                      className="w-full px-5 py-3.5 bg-gradient-to-r from-[#007848] to-[#00a864] text-white text-sm font-bold rounded-2xl hover:from-[#005f3a] hover:to-[#008f56] transition-all shadow-lg shadow-[#007848]/25 hover:shadow-xl hover:shadow-[#007848]/30 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2.5"
                    >
                      {updating === selected.id ? (
                        <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</span>
                      ) : (
                        <><FaCheckCircle className="text-sm" /> Mark as Claimed</>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowRevertConfirm(true)}
                      disabled={updating === selected.id}
                      className="w-full px-5 py-3.5 bg-gradient-to-r from-[#b8860b] to-[#ffc107] text-white text-sm font-bold rounded-2xl hover:from-[#a07509] hover:to-[#e0a800] transition-all shadow-lg shadow-[#b8860b]/25 hover:shadow-xl hover:shadow-[#b8860b]/30 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2.5"
                    >
                      {updating === selected.id ? (
                        <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</span>
                      ) : (
                        <><FaClock className="text-sm" /> Revert to Pending</>
                      )}
                    </button>
                  )}
                </div>

                {showRevertConfirm && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex items-center justify-center p-6 z-10">
                    <div className="text-center max-w-xs">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                        <FaClock className="text-2xl text-amber-500" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">Revert to Pending?</h4>
                      <p className="text-sm text-gray-500 mb-6">This claim will be moved back to pending status.</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowRevertConfirm(false)}
                          className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            setShowRevertConfirm(false);
                            await handleStatusToggle(selected);
                            setSelected({ ...selected, status: "pending" });
                          }}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#b8860b] to-[#ffc107] text-white text-sm font-bold rounded-xl hover:from-[#a07509] hover:to-[#e0a800] transition-all shadow-lg shadow-[#b8860b]/25 cursor-pointer"
                        >
                          Revert
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {revertTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setRevertTarget(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-2xl text-amber-500" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Revert to Pending?</h4>
              <p className="text-sm text-gray-500 mb-6">This claim will be moved back to pending status.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setRevertTarget(null)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const target = revertTarget;
                    setRevertTarget(null);
                    await handleStatusToggle(target);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#b8860b] to-[#ffc107] text-white text-sm font-bold rounded-xl hover:from-[#a07509] hover:to-[#e0a800] transition-all shadow-lg shadow-[#b8860b]/25 cursor-pointer"
                >
                  Revert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center" onClick={() => setDeleteTarget(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="text-2xl text-red-500" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Delete this item?</h4>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-lg shadow-red-500/25 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {alertMessage && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center" onClick={() => setAlertMessage(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <FiX className="text-2xl text-red-500" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Error</h4>
              <p className="text-sm text-gray-500 mb-6">{alertMessage}</p>
              <button
                onClick={() => setAlertMessage(null)}
                className="w-full px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoTile({ icon, iconColor, label, value, mono }: { icon: React.ReactNode; iconColor: string; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3.5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
        <span className="text-xs">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">{label}</p>
        <p className={`text-sm font-bold text-gray-900 mt-0.5 ${mono ? "font-mono tracking-wide" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

