"use client";

import { useState, useEffect } from "react";
import { getCollegeDepartmentsWithCourses } from "@/lib/actions";
import { FaGraduationCap, FaBookOpen, FaChevronDown } from "react-icons/fa";

interface Course {
  id: number;
  name: string;
  code: string | null;
  department: string;
  isActive: boolean;
}

interface DepartmentWithCourses {
  id: number;
  name: string;
  logo: string | null;
  createdAt: Date;
  courses: Course[];
}

export default function ProgramsOfferedSection() {
  const [departments, setDepartments] = useState<DepartmentWithCourses[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollegeDepartmentsWithCourses().then((data) => {
      setDepartments(data.filter((d) => d.courses.length > 0));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 bg-gray-300 rounded-full mx-auto" />
            <div className="h-8 w-64 bg-gray-300 rounded-lg mx-auto" />
            <div className="h-4 w-48 bg-gray-300 rounded-full mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (departments.length === 0) return null;

  return (
    <section className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[#007848] text-xs font-bold uppercase tracking-widest bg-[#007848]/10 px-4 py-1.5 rounded-full mb-3">
            <FaGraduationCap className="w-3.5 h-3.5" />
            Programs Offered
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">College Programs</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Explore our diverse range of undergraduate programs across various colleges and departments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept) => {
            const isOpen = expanded === dept.id;
            return (
              <div
                key={dept.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : dept.id)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  {dept.logo ? (
                    <img src={dept.logo} alt={dept.name} className="w-12 h-12 rounded-xl object-contain border border-gray-100 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#007848]/10 flex items-center justify-center text-lg font-bold text-[#007848] shrink-0">
                      {dept.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{dept.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{dept.courses.length} program{dept.courses.length > 1 ? "s" : ""}</p>
                  </div>
                  <FaChevronDown className={`text-gray-300 text-sm shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {dept.courses.map((course) => (
                      <div key={course.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                        <FaBookOpen className="text-[#007848]/60 text-xs shrink-0" />
                        <span className="text-sm text-gray-700">{course.name}</span>
                        {course.code && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-auto shrink-0">
                            {course.code}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
