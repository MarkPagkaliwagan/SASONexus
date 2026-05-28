"use client";

import { useState } from "react";
import { FiSave, FiPlus, FiTrash2, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { updateAdmissionContent } from "@/lib/actions";

interface Props {
  contentMap: Record<string, string>;
}

type Section = "hero" | "requirements" | "steps" | "basis" | "hours";

const SECTION_LABELS: Record<Section, string> = {
  hero: "Hero Section",
  requirements: "Pre-Admission Requirements",
  steps: "Registration Steps",
  basis: "Admission Basis",
  hours: "Office Hours",
};

export function AdmissionContentEditor({ contentMap }: Props) {
  const [activeSection, setActiveSection] = useState<Section>("hero");

  const parsed = {
    hero: contentMap.hero ? JSON.parse(contentMap.hero) : { heading: "", subheading: "", buttonText: "" },
    requirements: contentMap.requirements ? JSON.parse(contentMap.requirements) : [],
    steps: contentMap.steps ? JSON.parse(contentMap.steps) : [],
    basis: contentMap.basis ? JSON.parse(contentMap.basis) : [],
    hours: contentMap.hours ? JSON.parse(contentMap.hours) : [],
  };

  const [hero, setHero] = useState(parsed.hero);
  const [requirements, setRequirements] = useState(parsed.requirements);
  const [steps, setSteps] = useState(parsed.steps);
  const [basis, setBasis] = useState(parsed.basis);
  const [hours, setHours] = useState(parsed.hours);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function saveSection(section: Section) {
    setSaving(true);
    setMessage(null);
    try {
      let content = "";
      if (section === "hero") content = JSON.stringify(hero);
      else if (section === "requirements") content = JSON.stringify(requirements);
      else if (section === "steps") content = JSON.stringify(steps);
      else if (section === "basis") content = JSON.stringify(basis);
      else if (section === "hours") content = JSON.stringify(hours);
      await updateAdmissionContent(section, content);
      setMessage("Saved successfully!");
    } catch {
      setMessage("Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  const sections: Section[] = ["hero", "requirements", "steps", "basis", "hours"];

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
              activeSection === s
                ? "bg-[#007848] text-white border-[#007848]"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#007848]/30"
            }`}
          >
            {SECTION_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        {activeSection === "hero" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Heading</label>
              <input
                value={hero.heading}
                onChange={(e) => setHero({ ...hero, heading: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Subheading</label>
              <textarea
                value={hero.subheading}
                onChange={(e) => setHero({ ...hero, subheading: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Button Text</label>
              <input
                value={hero.buttonText}
                onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] focus:ring-4 focus:ring-[#007848]/10 text-gray-900 dark:text-white transition"
              />
            </div>
          </div>
        )}

        {activeSection === "requirements" && (
          <div className="space-y-6">
            {requirements.map((tab: any, ti: number) => (
              <div key={ti} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    value={tab.label}
                    onChange={(e) => {
                      const next = [...requirements];
                      next[ti] = { ...next[ti], label: e.target.value };
                      setRequirements(next);
                    }}
                    className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-sm font-semibold outline-none focus:border-[#007848] text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => setRequirements(requirements.filter((_: any, i: number) => i !== ti))}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                {tab.groups.map((group: any, gi: number) => (
                  <div key={gi} className="ml-4 mb-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        value={group.title}
                        onChange={(e) => {
                          const next = [...requirements];
                          next[ti].groups[gi] = { ...next[ti].groups[gi], title: e.target.value };
                          setRequirements(next);
                        }}
                        className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium outline-none focus:border-[#007848] text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => {
                          const next = [...requirements];
                          next[ti].groups = next[ti].groups.filter((_: any, i: number) => i !== gi);
                          setRequirements(next);
                        }}
                        className="p-1 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {group.items.map((item: string, ii: number) => (
                      <div key={ii} className="flex items-center gap-2 ml-4 mb-1">
                        <input
                          value={item}
                          onChange={(e) => {
                            const next = [...requirements];
                            next[ti].groups[gi].items[ii] = e.target.value;
                            setRequirements(next);
                          }}
                          className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm outline-none focus:border-[#007848] text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => {
                            const next = [...requirements];
                            next[ti].groups[gi].items = next[ti].groups[gi].items.filter((_: any, i: number) => i !== ii);
                            setRequirements(next);
                          }}
                          className="p-1 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const next = [...requirements];
                        next[ti].groups[gi].items.push("");
                        setRequirements(next);
                      }}
                      className="ml-4 mt-2 flex items-center gap-1 text-xs font-semibold text-[#007848] hover:text-[#005a36] transition cursor-pointer"
                    >
                      <FiPlus className="w-3 h-3" /> Add Item
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const next = [...requirements];
                    next[ti].groups.push({ title: "", items: [""] });
                    setRequirements(next);
                  }}
                  className="ml-4 flex items-center gap-1 text-xs font-semibold text-[#007848] hover:text-[#005a36] transition cursor-pointer"
                >
                  <FiPlus className="w-3 h-3" /> Add Group
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setRequirements([...requirements, { tab: "", label: "", groups: [{ title: "", items: [""] }] }])
              }
              className="flex items-center gap-2 px-4 py-2 bg-[#007848] text-white text-sm font-semibold rounded-xl hover:bg-[#005a36] transition cursor-pointer"
            >
              <FiPlus className="w-4 h-4" /> Add Applicant Tab
            </button>
          </div>
        )}

        {activeSection === "steps" && (
          <div className="space-y-4">
            {steps.map((step: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="flex flex-col gap-1 pt-1">
                  <button onClick={() => {
                    if (i === 0) return;
                    const next = [...steps];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    setSteps(next);
                  }} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" disabled={i === 0}><FiChevronUp className="w-3 h-3" /></button>
                  <button onClick={() => {
                    if (i === steps.length - 1) return;
                    const next = [...steps];
                    [next[i], next[i + 1]] = [next[i + 1], next[i]];
                    setSteps(next);
                  }} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" disabled={i === steps.length - 1}><FiChevronDown className="w-3 h-3" /></button>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={step.step}
                      onChange={(e) => {
                        const next = [...steps];
                        next[i] = { ...next[i], step: e.target.value };
                        setSteps(next);
                      }}
                      className="w-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 text-sm text-center font-bold outline-none focus:border-[#007848] text-gray-900 dark:text-white"
                      placeholder="01"
                    />
                    <input
                      value={step.title}
                      onChange={(e) => {
                        const next = [...steps];
                        next[i] = { ...next[i], title: e.target.value };
                        setSteps(next);
                      }}
                      className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-sm font-semibold outline-none focus:border-[#007848] text-gray-900 dark:text-white"
                    />
                  </div>
                  <textarea
                    value={step.description}
                    onChange={(e) => {
                      const next = [...steps];
                      next[i] = { ...next[i], description: e.target.value };
                      setSteps(next);
                    }}
                    rows={2}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-sm outline-none focus:border-[#007848] text-gray-900 dark:text-white resize-none"
                  />
                </div>
                <button
                  onClick={() => setSteps(steps.filter((_: any, j: number) => j !== i))}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setSteps([...steps, { step: String(steps.length + 1).padStart(2, "0"), title: "", description: "" }])}
              className="flex items-center gap-2 px-4 py-2 bg-[#007848] text-white text-sm font-semibold rounded-xl hover:bg-[#005a36] transition cursor-pointer"
            >
              <FiPlus className="w-4 h-4" /> Add Step
            </button>
          </div>
        )}

        {activeSection === "basis" && (
          <div className="space-y-4 max-w-lg">
            {basis.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={item.label}
                  onChange={(e) => {
                    const next = [...basis];
                    next[i] = { ...next[i], label: e.target.value };
                    setBasis(next);
                  }}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] text-gray-900 dark:text-white"
                />
                <input
                  value={item.value}
                  onChange={(e) => {
                    const next = [...basis];
                    next[i] = { ...next[i], value: e.target.value };
                    setBasis(next);
                  }}
                  className="w-24 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm text-center outline-none focus:border-[#007848] text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => setBasis(basis.filter((_: any, j: number) => j !== i))}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setBasis([...basis, { label: "", value: "" }])}
              className="flex items-center gap-2 px-4 py-2 bg-[#007848] text-white text-sm font-semibold rounded-xl hover:bg-[#005a36] transition cursor-pointer"
            >
              <FiPlus className="w-4 h-4" /> Add Criterion
            </button>
          </div>
        )}

        {activeSection === "hours" && (
          <div className="space-y-4 max-w-lg">
            {hours.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={item.day}
                  onChange={(e) => {
                    const next = [...hours];
                    next[i] = { ...next[i], day: e.target.value };
                    setHours(next);
                  }}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-[#007848] text-gray-900 dark:text-white"
                  placeholder="Day"
                />
                <input
                  value={item.time}
                  onChange={(e) => {
                    const next = [...hours];
                    next[i] = { ...next[i], time: e.target.value };
                    setHours(next);
                  }}
                  className="w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm text-center outline-none focus:border-[#007848] text-gray-900 dark:text-white"
                  placeholder="Time"
                />
                <button
                  onClick={() => setHours(hours.filter((_: any, j: number) => j !== i))}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setHours([...hours, { day: "", time: "" }])}
              className="flex items-center gap-2 px-4 py-2 bg-[#007848] text-white text-sm font-semibold rounded-xl hover:bg-[#005a36] transition cursor-pointer"
            >
              <FiPlus className="w-4 h-4" /> Add Hour Entry
            </button>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => saveSection(activeSection)}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#007848] text-white text-sm font-bold rounded-xl hover:bg-[#005a36] disabled:opacity-50 transition cursor-pointer"
          >
            <FiSave className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </button>
          {message && (
            <span className={`text-sm font-semibold ${message === "Saved successfully!" ? "text-green-600" : "text-red-600"}`}>
              {message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
