"use client";

import { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";

interface PreAdmissionData {
  id: number;
  applicationLevel: string;
  academicYear: string | null;
  gradeLevel: string | null;
  firstChoice: string | null;
  secondChoice: string | null;
  strand: string | null;
}

interface Student {
  id: number;
  preAdmissionId: number;
  familyName: string;
  givenName: string;
  middleName: string | null;
  applicationLevel: string;
  academicYear: string | null;
  pictureUrl: string | null;
  examResult: string | null;
}

interface Props {
  students: Student[];
  preAdmissionMap: Record<number, PreAdmissionData>;
  academicYearOptions: string[];
}

const LEVEL_ORDER = ["College", "Senior High School", "Junior High School", "Grade School"];

function Avatar({ s }: { s: Student }) {
  return (
    <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-[#007848]/10 dark:bg-[#007848]/20 flex items-center justify-center">
      {s.pictureUrl ? (
        <img src={s.pictureUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-xs font-semibold text-[#007848] dark:text-[#00a35e]">
          {s.givenName.charAt(0)}{s.familyName.charAt(0)}
        </span>
      )}
    </div>
  );
}

function NameCell({ s }: { s: Student }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar s={s} />
      <div>
        <span className="font-medium text-gray-900 dark:text-white">{s.givenName} {s.familyName}</span>
        {s.middleName && <span className="text-gray-400 ml-1">{s.middleName}</span>}
      </div>
    </div>
  );
}

export function ExamResultsList({ students, preAdmissionMap, academicYearOptions }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [academicYear, setAcademicYear] = useState("all");

  const filtered = useMemo(() => {
    let result = students;
    if (academicYear !== "all") result = result.filter((s) => s.academicYear === academicYear);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          `${s.givenName} ${s.familyName}`.toLowerCase().includes(q) ||
          s.applicationLevel.toLowerCase().includes(q) ||
          (s.academicYear || "").toLowerCase().includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      const aN = `${a.givenName} ${a.familyName}`.toLowerCase();
      const bN = `${b.givenName} ${b.familyName}`.toLowerCase();
      return sort === "name-desc" ? bN.localeCompare(aN) : aN.localeCompare(bN);
    });
    return result;
  }, [students, search, sort, academicYear]);

  const grouped = useMemo(() => {
    const map: Record<string, Student[]> = {};
    for (const s of filtered) {
      if (!map[s.applicationLevel]) map[s.applicationLevel] = [];
      map[s.applicationLevel].push(s);
    }
    return map;
  }, [filtered]);

  function renderTable(level: string, items: Student[]) {
    if (!items.length) return null;

    let cols: { label: string; key: string; w: string }[] = [];
    let cellsFor: (json: string | null) => Record<string, string> = () => ({});

    switch (level) {
      case "College":
        cols = [
          { label: "CFIT RS", key: "cfitRs", w: "w-14" },
          { label: "IQ", key: "cfitIq", w: "w-12" },
          { label: "%ile", key: "cfitPc", w: "w-12" },
          { label: "Class", key: "cfitClass", w: "w-16" },
          { label: "CQT V", key: "cqtV", w: "w-14" },
          { label: "N", key: "cqtN", w: "w-10" },
          { label: "T", key: "cqtT", w: "w-10" },
          { label: "%ile", key: "cqtPc", w: "w-12" },
          { label: "Class", key: "cqtClass", w: "w-16" },
          { label: "GWA RS", key: "gwaRs", w: "w-14" },
          { label: "%ile", key: "gwaPc", w: "w-12" },
          { label: "Class", key: "gwaClass", w: "w-16" },
          { label: "Remarks", key: "remarks", w: "w-24" },
        ];
        cellsFor = (json) => {
          if (!json) return Object.fromEntries(cols.map((c) => [c.key, "—"]));
          try {
            const d = JSON.parse(json);
            return {
              cfitRs: d.cfit?.rs ?? "—", cfitIq: d.cfit?.iq ?? "—", cfitPc: d.cfit?.percentile ?? "—", cfitClass: d.cfit?.classification ?? "—",
              cqtV: d.cqt?.verbal ?? "—", cqtN: d.cqt?.numerical ?? "—", cqtT: d.cqt?.total ?? "—", cqtPc: d.cqt?.percentile ?? "—", cqtClass: d.cqt?.classification ?? "—",
              gwaRs: d.gwa?.rs ?? "—", gwaPc: d.gwa?.percentile ?? "—", gwaClass: d.gwa?.classification ?? "—",
              remarks: d.remarks ?? "—",
            };
          } catch { return Object.fromEntries(cols.map((c) => [c.key, "—"])); }
        };
        break;
      case "Senior High School":
        cols = [
          { label: "CFIT RS", key: "cfitRs", w: "w-14" },
          { label: "IQ", key: "cfitIq", w: "w-12" },
          { label: "PC", key: "cfitPc", w: "w-10" },
          { label: "Class", key: "cfitClass", w: "w-16" },
          { label: "OLSAT V RS", key: "olsatVRs", w: "w-14" },
          { label: "V SS", key: "olsatVSs", w: "w-12" },
          { label: "V %ile", key: "olsatVPc", w: "w-14" },
          { label: "V Stan", key: "olsatVStan", w: "w-14" },
          { label: "V Class", key: "olsatVClass", w: "w-16" },
          { label: "NV RS", key: "olsatNvRs", w: "w-14" },
          { label: "NV SS", key: "olsatNvSs", w: "w-12" },
          { label: "NV PC", key: "olsatNvPc", w: "w-12" },
          { label: "NV Stan", key: "olsatNvStan", w: "w-14" },
          { label: "NV Class", key: "olsatNvClass", w: "w-16" },
          { label: "T RS", key: "olsatTRs", w: "w-14" },
          { label: "T SS", key: "olsatTSs", w: "w-12" },
          { label: "T PC", key: "olsatTPc", w: "w-12" },
          { label: "T Stan", key: "olsatTStan", w: "w-14" },
          { label: "T Class", key: "olsatTClass", w: "w-16" },
          { label: "Remarks", key: "remarks", w: "w-24" },
        ];
        cellsFor = (json) => {
          if (!json) return Object.fromEntries(cols.map((c) => [c.key, "—"]));
          try {
            const d = JSON.parse(json);
            return {
              cfitRs: d.cfit?.rs ?? "—", cfitIq: d.cfit?.iq ?? "—", cfitPc: d.cfit?.pc ?? "—", cfitClass: d.cfit?.classification ?? "—",
              olsatVRs: d.olsat?.verbal?.rs ?? "—", olsatVSs: d.olsat?.verbal?.ss ?? "—", olsatVPc: d.olsat?.verbal?.percentile ?? "—", olsatVStan: d.olsat?.verbal?.stanine ?? "—", olsatVClass: d.olsat?.verbal?.classification ?? "—",
              olsatNvRs: d.olsat?.nonVerbal?.rs ?? "—", olsatNvSs: d.olsat?.nonVerbal?.ss ?? "—", olsatNvPc: d.olsat?.nonVerbal?.pc ?? "—", olsatNvStan: d.olsat?.nonVerbal?.stanine ?? "—", olsatNvClass: d.olsat?.nonVerbal?.classification ?? "—",
              olsatTRs: d.olsat?.total?.rs ?? "—", olsatTSs: d.olsat?.total?.ss ?? "—", olsatTPc: d.olsat?.total?.pc ?? "—", olsatTStan: d.olsat?.total?.stanine ?? "—", olsatTClass: d.olsat?.total?.classification ?? "—",
              remarks: d.remarks ?? "—",
            };
          } catch { return Object.fromEntries(cols.map((c) => [c.key, "—"])); }
        };
        break;
      case "Junior High School":
        cols = [
          { label: "VC RS", key: "vcRs", w: "w-12" },
          { label: "PC", key: "vcPc", w: "w-10" },
          { label: "VR RS", key: "vrRs", w: "w-12" },
          { label: "PC", key: "vrPc", w: "w-10" },
          { label: "FR RS", key: "frRs", w: "w-12" },
          { label: "PC", key: "frPc", w: "w-10" },
          { label: "QR RS", key: "qrRs", w: "w-12" },
          { label: "PC", key: "qrPc", w: "w-10" },
          { label: "V.T RS", key: "vtRs", w: "w-14" },
          { label: "PC", key: "vtPc", w: "w-10" },
          { label: "NV.T RS", key: "nvRs", w: "w-14" },
          { label: "PC", key: "nvPc", w: "w-10" },
          { label: "O.T RS", key: "otRs", w: "w-14" },
          { label: "PC", key: "otPc", w: "w-10" },
          { label: "Remarks", key: "remarks", w: "w-24" },
        ];
        cellsFor = (json) => {
          if (!json) return Object.fromEntries(cols.map((c) => [c.key, "—"]));
          try {
            const d = JSON.parse(json);
            return {
              vcRs: d.verbal?.vc?.rs ?? "—", vcPc: d.verbal?.vc?.pc ?? "—",
              vrRs: d.verbal?.vr?.rs ?? "—", vrPc: d.verbal?.vr?.pc ?? "—",
              frRs: d.nonVerbal?.fr?.rs ?? "—", frPc: d.nonVerbal?.fr?.pc ?? "—",
              qrRs: d.nonVerbal?.qr?.rs ?? "—", qrPc: d.nonVerbal?.qr?.pc ?? "—",
              vtRs: d.totals?.verbalTotal?.rs ?? "—", vtPc: d.totals?.verbalTotal?.pc ?? "—",
              nvRs: d.totals?.nonVerbalTotal?.rs ?? "—", nvPc: d.totals?.nonVerbalTotal?.pc ?? "—",
              otRs: d.totals?.overallTotal?.rs ?? "—", otPc: d.totals?.overallTotal?.pc ?? "—",
              remarks: d.remarks ?? "—",
            };
          } catch { return Object.fromEntries(cols.map((c) => [c.key, "—"])); }
        };
        break;
      case "Grade School":
        cols = [
          { label: "Remarks", key: "remarks", w: "w-32" },
          { label: "Comments", key: "comments", w: "w-32" },
        ];
        cellsFor = (json) => {
          if (!json) return { remarks: "—", comments: "—" };
          try {
            const d = JSON.parse(json);
            return { remarks: d.remarks ?? "—", comments: d.comments ?? "—" };
          } catch { return { remarks: "—", comments: "—" }; }
        };
        break;
    }

    return (
      <div key={level} className="mb-8 last:mb-0">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
          {level}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">({items.length})</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">A.Y.</th>
                {level === "College" && <th className="px-3 py-3 font-medium">Program</th>}
                {level === "Senior High School" && <><th className="px-3 py-3 font-medium">Grade</th><th className="px-3 py-3 font-medium">Strand</th></>}
                {(level === "Junior High School" || level === "Grade School") && <th className="px-3 py-3 font-medium">Grade</th>}
                {cols.map((c) => (
                  <th key={c.key} className={`px-1 py-3 font-medium text-center ${c.w}`}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.map((s) => {
                const p = preAdmissionMap[s.preAdmissionId];
                const cells = cellsFor(s.examResult);
                return (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3"><NameCell s={s} /></td>
                    <td className="px-3 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{s.academicYear || "—"}</td>
                    {level === "College" && <td className="px-3 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{p?.firstChoice || "—"}</td>}
                    {level === "Senior High School" && <><td className="px-3 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{p?.gradeLevel || "—"}</td><td className="px-3 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{p?.strand || "—"}</td></>}
                    {(level === "Junior High School" || level === "Grade School") && <td className="px-3 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{p?.gradeLevel || "—"}</td>}
                    {cols.map((c) => (
                      <td key={c.key} className="px-1 py-3 text-gray-600 dark:text-gray-400 text-center whitespace-nowrap">{cells[c.key]}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const hasAny = filtered.length > 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Student Exam Results ({filtered.length})</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007848] w-40 sm:w-48" />
            </div>
            <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007848]">
              <option value="all">All A.Y.</option>
              {academicYearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007848]">
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {!hasAny ? (
        <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
          {academicYear !== "all" ? `No data found for A.Y. ${academicYear}.` : "No results found."}
        </div>
      ) : (
        LEVEL_ORDER.map((level) => renderTable(level, grouped[level] || []))
      )}
    </div>
  );
}
