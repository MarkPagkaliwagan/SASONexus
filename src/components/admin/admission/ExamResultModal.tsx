"use client";

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

interface CollegeData {
  cfit: { rs: string; iq: string; percentile: string; classification: string };
  cqt: { verbal: string; numerical: string; total: string; percentile: string; classification: string };
  gwa: { rs: string; percentile: string; classification: string };
  remarks: string;
}

interface ShsData {
  cfit: { rs: string; iq: string; pc: string; classification: string };
  olsat: {
    verbal: { rs: string; ss: string; percentile: string; stanine: string; classification: string };
    nonVerbal: { rs: string; ss: string; pc: string; stanine: string; classification: string };
    total: { rs: string; ss: string; pc: string; stanine: string; classification: string };
  };
  remarks: string;
}

interface JhsData {
  verbal: {
    vc: { rs: string; pc: string };
    vr: { rs: string; pc: string };
  };
  nonVerbal: {
    fr: { rs: string; pc: string };
    qr: { rs: string; pc: string };
  };
  totals: {
    verbalTotal: { rs: string; pc: string };
    nonVerbalTotal: { rs: string; pc: string };
    overallTotal: { rs: string; pc: string };
  };
  remarks: string;
}

interface GsData {
  remarks: string;
  comments: string;
}

const defaultCollege: CollegeData = {
  cfit: { rs: "", iq: "", percentile: "", classification: "" },
  cqt: { verbal: "", numerical: "", total: "", percentile: "", classification: "" },
  gwa: { rs: "", percentile: "", classification: "" },
  remarks: "",
};

const defaultShs: ShsData = {
  cfit: { rs: "", iq: "", pc: "", classification: "" },
  olsat: {
    verbal: { rs: "", ss: "", percentile: "", stanine: "", classification: "" },
    nonVerbal: { rs: "", ss: "", pc: "", stanine: "", classification: "" },
    total: { rs: "", ss: "", pc: "", stanine: "", classification: "" },
  },
  remarks: "",
};

const defaultJhs: JhsData = {
  verbal: { vc: { rs: "", pc: "" }, vr: { rs: "", pc: "" } },
  nonVerbal: { fr: { rs: "", pc: "" }, qr: { rs: "", pc: "" } },
  totals: {
    verbalTotal: { rs: "", pc: "" },
    nonVerbalTotal: { rs: "", pc: "" },
    overallTotal: { rs: "", pc: "" },
  },
  remarks: "",
};

const defaultGs: GsData = {
  remarks: "",
  comments: "",
};

function Input({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007848]"
      />
    </div>
  );
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {children}
      </div>
    </div>
  );
}

function SubSectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-100 dark:border-gray-700/50 rounded-lg p-3 bg-gray-50/50 dark:bg-gray-800/30">
      <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">{title}</h5>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {children}
      </div>
    </div>
  );
}

export function ExamResultModal({
  isOpen,
  onClose,
  applicationLevel,
  examResult,
  onSave,
  saving,
}: {
  isOpen: boolean;
  onClose: () => void;
  applicationLevel: string;
  examResult: string | null;
  onSave: (data: string) => void;
  saving: boolean;
}) {
  const [college, setCollege] = useState<CollegeData>(defaultCollege);
  const [shs, setShs] = useState<ShsData>(defaultShs);
  const [jhs, setJhs] = useState<JhsData>(defaultJhs);
  const [gs, setGs] = useState<GsData>(defaultGs);

  useEffect(() => {
    if (!examResult) {
      setCollege(defaultCollege);
      setShs(defaultShs);
      setJhs(defaultJhs);
      setGs(defaultGs);
      return;
    }
    try {
      const parsed = JSON.parse(examResult);
      const level = applicationLevel.toLowerCase();
      if (level === "college") setCollege({ ...defaultCollege, ...parsed });
      else if (level.includes("senior") || level === "shs") setShs({ ...defaultShs, ...parsed });
      else if (level.includes("junior") || level === "jhs") setJhs({ ...defaultJhs, ...parsed });
      else setGs({ ...defaultGs, ...parsed });
    } catch {
      setCollege({ ...defaultCollege, remarks: examResult });
      setShs({ ...defaultShs, remarks: examResult });
      setJhs({ ...defaultJhs, remarks: examResult });
      setGs({ ...defaultGs, remarks: examResult });
    }
  }, [examResult, applicationLevel]);

  function updateCollege(path: string, value: string) {
    setCollege((prev) => {
      const next = { ...prev };
      const parts = path.split(".");
      let obj: any = next;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      return next;
    });
  }

  function updateShs(path: string, value: string) {
    setShs((prev) => {
      const next = { ...prev };
      const parts = path.split(".");
      let obj: any = next;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      return next;
    });
  }

  function updateJhs(path: string, value: string) {
    setJhs((prev) => {
      const next = { ...prev };
      const parts = path.split(".");
      let obj: any = next;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      return next;
    });
  }

  function handleSave() {
    const level = applicationLevel.toLowerCase();
    let data: any;
    if (level === "college") data = college;
    else if (level.includes("senior") || level === "shs") data = shs;
    else if (level.includes("junior") || level === "jhs") data = jhs;
    else data = gs;
    onSave(JSON.stringify(data));
  }

  if (!isOpen) return null;

  const level = applicationLevel.toLowerCase();
  const isCollege = level === "college";
  const isShs = level.includes("senior") || level === "shs";
  const isJhs = level.includes("junior") || level === "jhs";
  const isGs = !isCollege && !isShs && !isJhs;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 pb-6">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between z-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Exam Result — {applicationLevel}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {isCollege && (
            <>
              <SectionBox title="CFIT">
                <Input label="RS" value={college.cfit.rs} onChange={(v) => updateCollege("cfit.rs", v)} />
                <Input label="IQ" value={college.cfit.iq} onChange={(v) => updateCollege("cfit.iq", v)} />
                <Input label="%ile" value={college.cfit.percentile} onChange={(v) => updateCollege("cfit.percentile", v)} />
                <Input label="Classification" value={college.cfit.classification} onChange={(v) => updateCollege("cfit.classification", v)} />
              </SectionBox>
              <SectionBox title="CQT">
                <Input label="Verbal" value={college.cqt.verbal} onChange={(v) => updateCollege("cqt.verbal", v)} />
                <Input label="Numerical" value={college.cqt.numerical} onChange={(v) => updateCollege("cqt.numerical", v)} />
                <Input label="Total" value={college.cqt.total} onChange={(v) => updateCollege("cqt.total", v)} />
                <Input label="%ile" value={college.cqt.percentile} onChange={(v) => updateCollege("cqt.percentile", v)} />
                <Input label="Classification" value={college.cqt.classification} onChange={(v) => updateCollege("cqt.classification", v)} />
              </SectionBox>
              <SectionBox title="GWA">
                <Input label="RS" value={college.gwa.rs} onChange={(v) => updateCollege("gwa.rs", v)} />
                <Input label="%ile" value={college.gwa.percentile} onChange={(v) => updateCollege("gwa.percentile", v)} />
                <Input label="Classification" value={college.gwa.classification} onChange={(v) => updateCollege("gwa.classification", v)} />
              </SectionBox>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Remarks / Comments</label>
                <textarea
                  value={college.remarks}
                  onChange={(e) => updateCollege("remarks", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007848] resize-none"
                />
              </div>
            </>
          )}

          {isShs && (
            <>
              <SectionBox title="CFIT">
                <Input label="RS" value={shs.cfit.rs} onChange={(v) => updateShs("cfit.rs", v)} />
                <Input label="IQ" value={shs.cfit.iq} onChange={(v) => updateShs("cfit.iq", v)} />
                <Input label="PC" value={shs.cfit.pc} onChange={(v) => updateShs("cfit.pc", v)} />
                <Input label="Classification" value={shs.cfit.classification} onChange={(v) => updateShs("cfit.classification", v)} />
              </SectionBox>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">OLSAT</h4>
                <div className="space-y-3">
                  <SubSectionBox title="Verbal">
                    <Input label="RS" value={shs.olsat.verbal.rs} onChange={(v) => updateShs("olsat.verbal.rs", v)} />
                    <Input label="SS" value={shs.olsat.verbal.ss} onChange={(v) => updateShs("olsat.verbal.ss", v)} />
                    <Input label="%ILE" value={shs.olsat.verbal.percentile} onChange={(v) => updateShs("olsat.verbal.percentile", v)} />
                    <Input label="Stanine" value={shs.olsat.verbal.stanine} onChange={(v) => updateShs("olsat.verbal.stanine", v)} />
                    <Input label="Classification" value={shs.olsat.verbal.classification} onChange={(v) => updateShs("olsat.verbal.classification", v)} />
                  </SubSectionBox>
                  <SubSectionBox title="Non-Verbal">
                    <Input label="RS" value={shs.olsat.nonVerbal.rs} onChange={(v) => updateShs("olsat.nonVerbal.rs", v)} />
                    <Input label="SS" value={shs.olsat.nonVerbal.ss} onChange={(v) => updateShs("olsat.nonVerbal.ss", v)} />
                    <Input label="PC" value={shs.olsat.nonVerbal.pc} onChange={(v) => updateShs("olsat.nonVerbal.pc", v)} />
                    <Input label="Stanine" value={shs.olsat.nonVerbal.stanine} onChange={(v) => updateShs("olsat.nonVerbal.stanine", v)} />
                    <Input label="Classification" value={shs.olsat.nonVerbal.classification} onChange={(v) => updateShs("olsat.nonVerbal.classification", v)} />
                  </SubSectionBox>
                  <SubSectionBox title="Total">
                    <Input label="RS" value={shs.olsat.total.rs} onChange={(v) => updateShs("olsat.total.rs", v)} />
                    <Input label="SS" value={shs.olsat.total.ss} onChange={(v) => updateShs("olsat.total.ss", v)} />
                    <Input label="PC" value={shs.olsat.total.pc} onChange={(v) => updateShs("olsat.total.pc", v)} />
                    <Input label="Stanine" value={shs.olsat.total.stanine} onChange={(v) => updateShs("olsat.total.stanine", v)} />
                    <Input label="Classification" value={shs.olsat.total.classification} onChange={(v) => updateShs("olsat.total.classification", v)} />
                  </SubSectionBox>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Remarks / Comments</label>
                <textarea
                  value={shs.remarks}
                  onChange={(e) => updateShs("remarks", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007848] resize-none"
                />
              </div>
            </>
          )}

          {isJhs && (
            <>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Verbal</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <SubSectionBox title="VC">
                    <Input label="RS" value={jhs.verbal.vc.rs} onChange={(v) => updateJhs("verbal.vc.rs", v)} />
                    <Input label="PC" value={jhs.verbal.vc.pc} onChange={(v) => updateJhs("verbal.vc.pc", v)} />
                  </SubSectionBox>
                  <SubSectionBox title="VR">
                    <Input label="RS" value={jhs.verbal.vr.rs} onChange={(v) => updateJhs("verbal.vr.rs", v)} />
                    <Input label="PC" value={jhs.verbal.vr.pc} onChange={(v) => updateJhs("verbal.vr.pc", v)} />
                  </SubSectionBox>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Non-Verbal</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <SubSectionBox title="FR">
                    <Input label="RS" value={jhs.nonVerbal.fr.rs} onChange={(v) => updateJhs("nonVerbal.fr.rs", v)} />
                    <Input label="PC" value={jhs.nonVerbal.fr.pc} onChange={(v) => updateJhs("nonVerbal.fr.pc", v)} />
                  </SubSectionBox>
                  <SubSectionBox title="QR">
                    <Input label="RS" value={jhs.nonVerbal.qr.rs} onChange={(v) => updateJhs("nonVerbal.qr.rs", v)} />
                    <Input label="PC" value={jhs.nonVerbal.qr.pc} onChange={(v) => updateJhs("nonVerbal.qr.pc", v)} />
                  </SubSectionBox>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Totals</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <SubSectionBox title="Verbal Total">
                    <Input label="RS" value={jhs.totals.verbalTotal.rs} onChange={(v) => updateJhs("totals.verbalTotal.rs", v)} />
                    <Input label="PC" value={jhs.totals.verbalTotal.pc} onChange={(v) => updateJhs("totals.verbalTotal.pc", v)} />
                  </SubSectionBox>
                  <SubSectionBox title="Non-Verbal Total">
                    <Input label="RS" value={jhs.totals.nonVerbalTotal.rs} onChange={(v) => updateJhs("totals.nonVerbalTotal.rs", v)} />
                    <Input label="PC" value={jhs.totals.nonVerbalTotal.pc} onChange={(v) => updateJhs("totals.nonVerbalTotal.pc", v)} />
                  </SubSectionBox>
                  <SubSectionBox title="Overall Total">
                    <Input label="RS" value={jhs.totals.overallTotal.rs} onChange={(v) => updateJhs("totals.overallTotal.rs", v)} />
                    <Input label="PC" value={jhs.totals.overallTotal.pc} onChange={(v) => updateJhs("totals.overallTotal.pc", v)} />
                  </SubSectionBox>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Remarks / Comments</label>
                <textarea
                  value={jhs.remarks}
                  onChange={(e) => updateJhs("remarks", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007848] resize-none"
                />
              </div>
            </>
          )}

          {isGs && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Remarks</label>
                <textarea
                  value={gs.remarks}
                  onChange={(e) => setGs({ ...gs, remarks: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007848] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Comments</label>
                <textarea
                  value={gs.comments}
                  onChange={(e) => setGs({ ...gs, comments: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007848] resize-none"
                />
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium bg-[#007848] text-white rounded-lg hover:bg-[#005a36] transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Exam Result"}
          </button>
        </div>
      </div>
    </div>
  );
}
