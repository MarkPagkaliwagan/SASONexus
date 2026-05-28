"use client";

import { useState } from "react";
import { FiBookOpen, FiFileText, FiClock, FiClipboard } from "react-icons/fi";
import { AdmissionContentEditor } from "./AdmissionContentEditor";
import { PreAdmissionList } from "@/components/admin/admission/PreAdmissionList";
import { ScheduleForm } from "@/components/admin/admission/ScheduleForm";
import { ScheduleList } from "@/components/admin/admission/ScheduleList";
import { ExamResultsList } from "@/components/admin/admission/ExamResultsList";

interface Schedule {
  id: number;
  level: string;
  date: string | null;
  time: string | null;
  maxSlots: number;
  availableSlots: number;
  isAvailable: boolean;
}

interface PreAdmissionItem {
  id: number;
  applicationLevel: string;
  academicYear: string | null;
  semester: string | null;
  gradeLevel: string | null;
  firstChoice: string | null;
  secondChoice: string | null;
  familyName: string;
  givenName: string;
  middleName: string | null;
  gender: string | null;
  birthDate: string | null;
  age: string | null;
  placeOfBirth: string | null;
  religion: string | null;
  civilStatus: string | null;
  citizenship: string | null;
  houseNo: string | null;
  province: string | null;
  cityMunicipality: string | null;
  barangay: string | null;
  zipCode: string | null;
  telNo: string | null;
  mobileNo: string | null;
  email: string | null;
  residence: string | null;
  pictureUrl: string | null;
  fatherName: string | null;
  fatherAddress: string | null;
  fatherTel: string | null;
  fatherCitizenship: string | null;
  fatherOccupation: string | null;
  fatherOfficeAddress: string | null;
  fatherOfficeTel: string | null;
  fatherEducation: string | null;
  fatherLastSchool: string | null;
  fatherAlumnus: string | null;
  motherName: string | null;
  motherAddress: string | null;
  motherTel: string | null;
  motherCitizenship: string | null;
  motherOccupation: string | null;
  motherOfficeAddress: string | null;
  motherOfficeTel: string | null;
  motherEducation: string | null;
  motherLastSchool: string | null;
  motherAlumnus: string | null;
  lrnNo: string | null;
  lastSchoolAttended: string | null;
  schoolAddress: string | null;
  track: string | null;
  strand: string | null;
  schoolYearAttended: string | null;
  dateOfGraduation: string | null;
  honorsAwards: string | null;
  isTransferee: string | null;
  freePreAdmission: string | null;
  previousSchool: string | null;
  stabCode: string | null;
  preferredSchedule: string | null;
  privacyAgreed: boolean;
  examResult: string | null;
  status: string;
  submittedAt: Date;
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

interface PreAdmissionData {
  id: number;
  applicationLevel: string;
  academicYear: string | null;
  gradeLevel: string | null;
  firstChoice: string | null;
  secondChoice: string | null;
  strand: string | null;
}

interface Props {
  contentMap: Record<string, string>;
  preAdmissionItems: PreAdmissionItem[];
  scheduleMap: Record<number, Schedule>;
  schedules: Schedule[];
  students: Student[];
  preAdmissionMap: Record<number, PreAdmissionData>;
  academicYearOptions: string[];
}

const tabs = [
  { id: "content", label: "Content", icon: FiBookOpen },
  { id: "application", label: "Application", icon: FiFileText },
  { id: "schedules", label: "Schedules", icon: FiClock },
  { id: "exam-results", label: "Exam Results", icon: FiClipboard },
];

export function AdmissionManager({
  contentMap,
  preAdmissionItems,
  scheduleMap,
  schedules,
  students,
  preAdmissionMap,
  academicYearOptions,
}: Props) {
  const [tab, setTab] = useState("content");

  return (
    <div>
      <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-gray-800">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
                active
                  ? "border-[#007848] text-[#007848] dark:text-[#00a35e] dark:border-[#00a35e]"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Icon className="text-base" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "content" && <AdmissionContentEditor contentMap={contentMap} />}
      {tab === "application" && (
        <PreAdmissionList items={preAdmissionItems} scheduleMap={scheduleMap} academicYearOptions={academicYearOptions} />
      )}
      {tab === "schedules" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ScheduleForm />
          </div>
          <div className="lg:col-span-2">
            <ScheduleList schedules={schedules} />
          </div>
        </div>
      )}
      {tab === "exam-results" && (
        <ExamResultsList students={students} preAdmissionMap={preAdmissionMap} academicYearOptions={academicYearOptions} />
      )}
    </div>
  );
}
