"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { submitPreAdmission, getSchedulesByLevel, getAcademicYears, getCollegeCourses, getShsStrands } from "@/lib/actions";
import { FaUser, FaUsers, FaGraduationCap, FaCalendarAlt, FaShieldAlt, FaImage, FaSpinner } from "react-icons/fa";

const steps = [
  { id: 1, name: "Application Type", icon: FaUser },
  { id: 2, name: "Personal Data", icon: FaUser },
  { id: 3, name: "Family Background", icon: FaUsers },
  { id: 4, name: "Education", icon: FaGraduationCap },
  { id: 5, name: "Schedule", icon: FaCalendarAlt },
  { id: 6, name: "Data Privacy", icon: FaShieldAlt },
];

const religions = ["Roman Catholic", "Christian", "Muslim", "Iglesia ni Cristo", "Buddhist", "Others"];
const civilStatuses = ["Single", "Married", "Widowed", "Separated"];
const citizenships = ["Filipino", "Dual Citizen", "Foreign National"];
const residences = ["Own House", "Rented", "Living with Relatives", "Dormitory/Boarding House"];
const educationalAttainment = ["Elementary Undergraduate", "Elementary Graduate", "High School Undergraduate", "High School Graduate", "Senior High School Graduate", "College Undergraduate", "College Graduate", "Post Graduate / Master's", "Post Graduate / Doctorate"];
const occupations = ["Employed", "Self-Employed / Business", "Professional", "Government Employee", "OFW", "Housewife / Homemaker", "Unemployed", "Retired", "Deceased", "Others"];

export default function PreAdmissionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [provinces, setProvinces] = useState<{code: string, name: string}[]>([]);
  const [cities, setCities] = useState<{code: string, name: string}[]>([]);
  const [municipalities, setMunicipalities] = useState<{code: string, name: string}[]>([]);
  const [barangays, setBarangays] = useState<{code: string, name: string}[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [schedules, setSchedules] = useState<{ id: number; level: string; date: string | null; time: string | null; availableSlots: number }[]>([]);
  const [years, setYears] = useState<{ id: number; year: string; semesters: { id: number; name: string; isActive: boolean }[] }[]>([]);
  const [courses, setCourses] = useState<{ id: number; name: string; code: string | null }[]>([]);
  const [strands, setStrands] = useState<{ id: number; name: string; code: string | null }[]>([]);
  const [formData, setFormData] = useState({
    applicationLevel: "",
    academicYear: "",
    semester: "",
    gradeLevel: "",
    firstChoice: "",
    secondChoice: "",
    familyName: "",
    givenName: "",
    middleName: "",
    gender: "",
    houseNo: "",
    province: "",
    cityMunicipality: "",
    barangay: "",
    zipCode: "",
    telNo: "",
    mobileNo: "",
    email: "",
    birthDate: "",
    placeOfBirth: "",
    age: "",
    religion: "",
    civilStatus: "",
    citizenship: "",
    residence: "",
    fatherName: "",
    fatherAddress: "",
    fatherTel: "",
    fatherCitizenship: "",
    fatherOccupation: "",
    fatherOfficeAddress: "",
    fatherOfficeTel: "",
    fatherEducation: "",
    fatherLastSchool: "",
    fatherAlumnus: "",
    motherName: "",
    motherAddress: "",
    motherTel: "",
    motherCitizenship: "",
    motherOccupation: "",
    motherOfficeAddress: "",
    motherOfficeTel: "",
    motherEducation: "",
    motherLastSchool: "",
    motherAlumnus: "",
    lrnNo: "",
    lastSchoolAttended: "",
    schoolAddress: "",
    track: "",
    strand: "",
    schoolYearAttended: "",
    dateOfGraduation: "",
    honorsAwards: "",
    isTransferee: "",
    freePreAdmission: "",
    previousSchool: "",
    stabCode: "",
    preferredSchedule: "",
    privacyAgreed: false,
  });

  useEffect(() => {
    fetch("https://psgc.gitlab.io/api/provinces/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch(() => setProvinces([]));
  }, []);

  useEffect(() => {
    getAcademicYears().then(setYears);
    getCollegeCourses().then(setCourses);
    getShsStrands().then(setStrands);
  }, []);

  useEffect(() => {
    if (formData.applicationLevel) {
      getSchedulesByLevel(formData.applicationLevel).then(setSchedules);
    } else {
      setSchedules([]);
    }
  }, [formData.applicationLevel]);

  const fetchCitiesMunicipalities = (provinceCode: string) => {
    setLoadingLocation(true);
    setCities([]);
    setMunicipalities([]);
    setBarangays([]);
    Promise.all([
      fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities/`).then((r) => r.json()).catch(() => []),
      fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/municipalities/`).then((r) => r.json()).catch(() => []),
    ]).then(([citiesData, munisData]) => {
      setCities(citiesData);
      setMunicipalities(munisData);
      setLoadingLocation(false);
    });
  };

  const fetchBarangays = (code: string) => {
    setLoadingLocation(true);
    setBarangays([]);
    fetch(`https://psgc.gitlab.io/api/cities/${code}/barangays/`)
      .then((r) => r.json())
      .then((data) => {
        if (data.length === 0) {
          return fetch(`https://psgc.gitlab.io/api/municipalities/${code}/barangays/`).then((r2) => r2.json());
        }
        return data;
      })
      .then((data) => {
        setBarangays(data);
        setLoadingLocation(false);
      })
      .catch(() => {
        setBarangays([]);
        setLoadingLocation(false);
      });
  };

  const sanitizeInput = (name: string, value: string) => {
    switch (name) {
      case "telNo":
      case "mobileNo":
      case "fatherTel":
      case "fatherOfficeTel":
      case "motherTel":
      case "motherOfficeTel":
        return value.replace(/[^\d\-\(\)\s]/g, "");
      case "zipCode":
      case "lrnNo":
      case "age":
        return value.replace(/\D/g, "");
      case "familyName":
      case "givenName":
      case "middleName":
      case "fatherName":
      case "motherName":
      case "fatherCitizenship":
      case "motherCitizenship":
        return value.replace(/[^a-zA-Z\s.'\-]/g, "");
      default:
        return value;
    }
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        break;
      case "mobileNo":
      case "telNo":
      case "fatherTel":
      case "fatherOfficeTel":
      case "motherTel":
      case "motherOfficeTel":
        if (value && !/^[\d\-\(\)\s]+$/.test(value)) return "Numbers only";
        break;
      case "zipCode":
        if (value && !/^\d+$/.test(value)) return "Numbers only";
        break;
      case "lrnNo":
        if (value && !/^\d+$/.test(value)) return "Numbers only";
        break;
      case "familyName":
      case "givenName":
      case "middleName":
      case "fatherName":
      case "motherName":
        if (value && !/^[a-zA-Z\s.'\-]+$/.test(value)) return "Letters only";
        break;
      case "fatherCitizenship":
      case "motherCitizenship":
        if (value && !/^[a-zA-Z\s.'\-]+$/.test(value)) return "Letters only";
        break;
      case "age":
        if (value && !/^\d+$/.test(value)) return "Numbers only";
        break;
      case "placeOfBirth":
      case "houseNo":
      case "barangay":
      case "province":
      case "cityMunicipality":
      case "fatherAddress":
      case "motherAddress":
      case "fatherOccupation":
      case "motherOccupation":
      case "fatherOfficeAddress":
      case "motherOfficeAddress":
      case "fatherEducation":
      case "motherEducation":
      case "fatherLastSchool":
      case "motherLastSchool":
      case "lastSchoolAttended":
      case "schoolAddress":
        if (!value) return "This field is required";
        break;
      case "schoolYearAttended":
        if (value && !/^\d{4}-\d{4}$/.test(value)) return "Format: YYYY-YYYY";
        break;
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    let value: string | boolean = target.type === "checkbox" ? target.checked : target.value;
    if (typeof value === "string") {
      value = sanitizeInput(target.name, value);
    }
    setFormData({ ...formData, [target.name]: value });
    if (typeof value === "string" && target.name !== "applicationLevel") {
      const error = validateField(target.name, value);
      setErrors({ ...errors, [target.name]: error });
    }
  };

  const getInputClassName = (name: string, baseClass: string = "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#007848] outline-none text-gray-900") => {
    if (!formData[name as keyof typeof formData]) return `${baseClass} border-gray-300`;
    return errors[name] ? `${baseClass} border-red-500 bg-red-50` : `${baseClass} border-green-500`;
  };

  const getLocationName = (type: "province" | "cityMunicipality" | "barangay", code: string) => {
    if (!code) return "";
    if (type === "province") return provinces.find((p) => p.code === code)?.name || "";
    if (type === "cityMunicipality") {
      return cities.find((c) => c.code === code)?.name || municipalities.find((m) => m.code === code)?.name || "";
    }
    return barangays.find((b) => b.code === code)?.name || "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPicturePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age.toString();
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormData({ ...formData, birthDate: date, age: calculateAge(date) });
  };

  const nextStep = () => { if (currentStep < 6) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      for (const [key, val] of Object.entries(formData)) {
        fd.set(key, String(val));
      }
      if (pictureFile) fd.set("picture", pictureFile);
      await submitPreAdmission(fd);
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (name: string, type: string, placeholder: string, required: boolean = false) => {
    const fieldError = errors[name];
    return (
      <>
        <input
          type={type}
          name={name}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={getInputClassName(name)}
        />
        {fieldError && <p className="text-xs text-red-500 mt-1">{fieldError}</p>}
      </>
    );
  };

  if (submitted) {
    return (
      <>
        <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16 md:pt-20">
          <section className="relative bg-[#007848] shadow-lg overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: "radial-gradient(circle at 30% 70%, #fff 1.5px, transparent 1.5px), radial-gradient(circle at 70% 30%, #fff 1.5px, transparent 1.5px)",
                backgroundSize: "50px 50px",
              }} />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 md:py-8">
              <div className="flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-6 pt-3 md:pt-0">
                <div className="flex items-center gap-3 md:gap-4 shrink-0">
                  <img src="/SPCLOGO.png" alt="SPC" className="w-8 h-8 md:w-14 md:h-14 object-contain" />
                  <img src="/SASOLOGO.png" alt="SASO" className="w-7 h-7 md:w-12 md:h-12 object-contain" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-green-200 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em]">San Pablo Colleges</p>
                  <h1 className="text-lg md:text-3xl font-extrabold text-white mt-1">Application For Pre-Admission</h1>
                  <p className="text-green-300/80 text-[10px] md:text-xs mt-2 leading-relaxed">
                    Hermanos Belen St., San Pablo City<br className="md:hidden" /> | (049) 562-4688 | www.sanpablocolleges.edu.ph
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="py-12 md:py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                <p className="text-gray-600">Your pre-admission application has been received. Please wait for further instructions from the admission office.</p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16 md:pt-20">
          <section className="relative bg-[#007848] shadow-lg overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: "radial-gradient(circle at 30% 70%, #fff 1.5px, transparent 1.5px), radial-gradient(circle at 70% 30%, #fff 1.5px, transparent 1.5px)",
                backgroundSize: "50px 50px",
              }} />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 md:py-8">
              <div className="flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-6 pt-3 md:pt-0">
                <div className="flex items-center gap-3 md:gap-4 shrink-0">
                  <img src="/SPCLOGO.png" alt="SPC" className="w-8 h-8 md:w-14 md:h-14 object-contain" />
                  <img src="/SASOLOGO.png" alt="SASO" className="w-7 h-7 md:w-12 md:h-12 object-contain" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-green-200 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em]">San Pablo Colleges</p>
                  <h1 className="text-lg md:text-3xl font-extrabold text-white mt-1">Application For Pre-Admission</h1>
                  <p className="text-green-300/80 text-[10px] md:text-xs mt-2 leading-relaxed">
                    Hermanos Belen St., San Pablo City<br className="md:hidden" /> | (049) 562-4688 | www.sanpablocolleges.edu.ph
                  </p>
                </div>
              </div>
            </div>
          </section>
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center relative z-10" style={{ width: `${100 / steps.length}%` }}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${currentStep >= step.id ? "bg-[#007848] text-white" : "bg-gray-200 text-gray-400"}`}>
                    {currentStep > step.id ? "\u2713" : <step.icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs mt-2 font-medium text-center ${currentStep >= step.id ? "text-[#007848]" : "text-gray-400"}`}>
                    {step.name}
                  </span>
                </div>
              ))}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-0">
                <div className="h-full bg-[#007848] transition-all duration-300" style={{ width: `${((currentStep - 1) / 5) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            {/* Step 1: Application Type */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">APPLICATION TYPE</h2>
                <p className="text-gray-600 text-sm mb-2">Select a level to show its fields.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {["College", "Senior High School", "Junior High School", "Grade School"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, applicationLevel: level, firstChoice: "", secondChoice: "", gradeLevel: "" })}
                      className={`p-4 border-2 rounded-xl text-center font-semibold transition-all ${formData.applicationLevel === level ? "border-[#007848] bg-[#007848] text-white" : "border-gray-200 text-gray-700 hover:border-[#007848]"}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>

                {formData.applicationLevel === "College" && (
                  <div className="bg-[#007848]/5 rounded-xl p-6 border border-[#007848]/20">
                    <p className="font-bold text-[#007848] mb-4">This is an application for: College Level</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                        <select name="academicYear" value={formData.academicYear} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                          <option value="">{years.length === 0 ? "No data available" : "Select Academic Year"}</option>
                          {years.map((y) => <option key={y.id} value={y.year}>{y.year}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
                        <select name="semester" value={formData.semester} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                          <option value="">Select Semester</option>
                          <option value="1st Semester">1st Semester</option>
                          <option value="2nd Semester">2nd Semester</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">1st Choice</label>
                        <select name="firstChoice" value={formData.firstChoice} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                          <option value="">{courses.length === 0 ? "No data available" : "1st Choice"}</option>
                          {courses.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">2nd Choice</label>
                        <select name="secondChoice" value={formData.secondChoice} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                          <option value="">{courses.length === 0 ? "No data available" : "2nd Choice"}</option>
                          {courses.filter((c) => c.name !== formData.firstChoice).map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {formData.applicationLevel === "Senior High School" && (
                  <div className="bg-[#007848]/5 rounded-xl p-6 border border-[#007848]/20">
                    <p className="font-bold text-[#007848] mb-4">This is an application for: Senior High School Level</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                        <select name="academicYear" value={formData.academicYear} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                          <option value="">{years.length === 0 ? "No data available" : "Select Academic Year"}</option>
                          {years.map((y) => <option key={y.id} value={y.year}>{y.year}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Grade Level</label>
                        <select name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                          <option value="">Select Grade Level</option>
                          <option value="Grade 11">Grade 11</option>
                          <option value="Grade 12">Grade 12</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">1st Choice (Strand)</label>
                        <select name="firstChoice" value={formData.firstChoice} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                          <option value="">{strands.length === 0 ? "No data available" : "Select Strand"}</option>
                          {strands.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {(formData.applicationLevel === "Junior High School" || formData.applicationLevel === "Grade School") && (
                  <div className="bg-[#007848]/5 rounded-xl p-6 border border-[#007848]/20">
                    <p className="font-bold text-[#007848] mb-4">This is an application for: {formData.applicationLevel} Level</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                        <select name="academicYear" value={formData.academicYear} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                          <option value="">{years.length === 0 ? "No data available" : "Select Academic Year"}</option>
                          {years.map((y) => <option key={y.id} value={y.year}>{y.year}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Grade Level</label>
                        <select name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                          <option value="">Select Grade Level</option>
                          {formData.applicationLevel === "Junior High School" ? (
                            <>
                              <option value="Grade 7">Grade 7</option>
                              <option value="Grade 8">Grade 8</option>
                              <option value="Grade 9">Grade 9</option>
                              <option value="Grade 10">Grade 10</option>
                            </>
                          ) : (
                            <>
                              <option value="Grade 1">Grade 1</option>
                              <option value="Grade 2">Grade 2</option>
                              <option value="Grade 3">Grade 3</option>
                              <option value="Grade 4">Grade 4</option>
                              <option value="Grade 5">Grade 5</option>
                              <option value="Grade 6">Grade 6</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Personal Data */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">PERSONAL DATA</h2>

                <div className="flex items-start gap-6 mb-8">
                  <div className="w-32 h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                    {picturePreview ? (
                      <img src={picturePreview} alt="2x2" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <FaImage className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">2x2 Preview</span>
                        <p className="text-[10px] text-gray-400">(white background)</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Upload 2x2 Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#007848] file:text-white file:font-semibold hover:file:bg-[#005a36] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Family Name <span className="text-gray-400 text-xs">Ex. Pagkaliwagan</span></label>
                    {renderField("familyName", "text", "Family Name", true)}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Given Name <span className="text-gray-400 text-xs">Ex. Mark Jeus</span></label>
                    {renderField("givenName", "text", "Given Name", true)}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name <span className="text-gray-400 text-xs">Ex. Marco</span></label>
                    {renderField("middleName", "text", "Middle Name")}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth <span className="text-gray-400 text-xs">dd/mm/yyyy</span></label>
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleBirthDateChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                    <input type="text" name="age" value={formData.age} readOnly className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Place of Birth</label>
                    {renderField("placeOfBirth", "text", "Place of Birth", true)}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Religion</label>
                    <select name="religion" value={formData.religion} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                      <option value="">Select Religion</option>
                      {religions.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Civil Status</label>
                    <select name="civilStatus" value={formData.civilStatus} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                      <option value="">Select Civil Status</option>
                      {civilStatuses.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Citizenship</label>
                    <select name="citizenship" value={formData.citizenship} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                      <option value="">Select Citizenship</option>
                      {citizenships.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Permanent Address</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">House No., Street</label>
                      {renderField("houseNo", "text", "House no., Street", true)}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Province</label>
                      <select
                        value={formData.province}
                        onChange={(e) => {
                          setFormData({ ...formData, province: e.target.value, cityMunicipality: "", barangay: "" });
                          if (e.target.value) fetchCitiesMunicipalities(e.target.value);
                          else { setCities([]); setMunicipalities([]); setBarangays([]); }
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900"
                      >
                        <option value="">Select Province</option>
                        {provinces.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">City / Municipality</label>
                      <select
                        value={formData.cityMunicipality}
                        onChange={(e) => {
                          setFormData({ ...formData, cityMunicipality: e.target.value, barangay: "" });
                          if (e.target.value) fetchBarangays(e.target.value);
                          else setBarangays([]);
                        }}
                        disabled={!formData.province || loadingLocation}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">
                          {!formData.province ? "Select Province First" : loadingLocation ? "Loading..." : "Select City / Municipality"}
                        </option>
                        {cities.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                        {municipalities.map((m) => <option key={m.code} value={m.code}>{m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Barangay</label>
                      <select
                        value={formData.barangay}
                        onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                        disabled={!formData.cityMunicipality || loadingLocation}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">
                          {!formData.cityMunicipality ? "Select City/Municipality First" : loadingLocation ? "Loading..." : "Select Barangay"}
                        </option>
                        {barangays.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Zip Code</label>
                      {renderField("zipCode", "text", "Zip Code", true)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tel. No.</label>
                    {renderField("telNo", "tel", "Tel. No.")}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile No. <span className="text-gray-400 text-xs">09XXXXXXXXX</span></label>
                    {renderField("mobileNo", "tel", "09XXXXXXXXX", true)}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail Address</label>
                    {renderField("email", "email", "E-mail Address", true)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Residence</label>
                  <select name="residence" value={formData.residence} onChange={handleChange} required className="w-full md:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                    <option value="">Select</option>
                    {residences.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Family Background */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">FAMILY BACKGROUND</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">FATHER</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      {renderField("fatherName", "text", "Father's Full Name")}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Home Address</label>
                      {renderField("fatherAddress", "text", "Home Address")}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tel/Mobile</label>
                      {renderField("fatherTel", "tel", "Tel/Mobile")}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Citizenship</label>
                      {renderField("fatherCitizenship", "text", "Citizenship")}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                      <select name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                        <option value="">Select Occupation</option>
                        {occupations.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Office Address</label>
                      {renderField("fatherOfficeAddress", "text", "Office Address")}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Office Tel</label>
                      {renderField("fatherOfficeTel", "tel", "Office Tel")}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Educational Attainment</label>
                      <select name="fatherEducation" value={formData.fatherEducation} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                        <option value="">Select Educational Attainment</option>
                        {educationalAttainment.map((e) => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last School Attended</label>
                      {renderField("fatherLastSchool", "text", "Last School Attended")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Is your father an alumnus of San Pablo Colleges?</p>
                      <div className="flex gap-3">
                        {["Yes", "No"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData({ ...formData, fatherAlumnus: opt })}
                            className={`px-6 py-2 border-2 rounded-lg font-semibold transition-all ${formData.fatherAlumnus === opt ? "border-[#007848] bg-[#007848] text-white" : "border-gray-200 text-gray-600"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">MOTHER</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      {renderField("motherName", "text", "Mother's Full Name")}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Home Address</label>
                      {renderField("motherAddress", "text", "Home Address")}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tel/Mobile</label>
                      {renderField("motherTel", "tel", "Tel/Mobile")}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Citizenship</label>
                      {renderField("motherCitizenship", "text", "Citizenship")}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                      <select name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                        <option value="">Select Occupation</option>
                        {occupations.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Office Address</label>
                      {renderField("motherOfficeAddress", "text", "Office Address")}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Office Tel</label>
                      {renderField("motherOfficeTel", "tel", "Office Tel")}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Educational Attainment</label>
                      <select name="motherEducation" value={formData.motherEducation} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                        <option value="">Select Educational Attainment</option>
                        {educationalAttainment.map((e) => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last School Attended</label>
                      {renderField("motherLastSchool", "text", "Last School Attended")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Is your mother an alumnus of San Pablo Colleges?</p>
                      <div className="flex gap-3">
                        {["Yes", "No"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData({ ...formData, motherAlumnus: opt })}
                            className={`px-6 py-2 border-2 rounded-lg font-semibold transition-all ${formData.motherAlumnus === opt ? "border-[#007848] bg-[#007848] text-white" : "border-gray-200 text-gray-600"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Educational Background */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">EDUCATIONAL BACKGROUND</h2>
                <p className="text-gray-600 text-sm mb-6">General Information</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">LRN No.</label>
                    {renderField("lrnNo", "text", "LRN No.")}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Are you a transferee?</label>
                    <div className="flex gap-4 mt-2">
                      {["Yes", "No"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData({ ...formData, isTransferee: opt })}
                          className={`px-6 py-2 border-2 rounded-lg font-semibold transition-all ${formData.isTransferee === opt ? "border-[#007848] bg-[#007848] text-white" : "border-gray-200 text-gray-600"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name of School Last Attended</label>
                    {renderField("lastSchoolAttended", "text", "School Name", true)}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">School Address</label>
                    {renderField("schoolAddress", "text", "School Address", true)}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Track</label>
                    <select name="track" value={formData.track} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                      <option value="">No data available</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Strand</label>
                    <select name="strand" value={formData.strand} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                      <option value="">{strands.length === 0 ? "No data available" : "Select Strand"}</option>
                      {strands.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">School Year Attended</label>
                    {renderField("schoolYearAttended", "text", "e.g. 2023-2024")}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Graduation</label>
                    <input type="date" name="dateOfGraduation" value={formData.dateOfGraduation} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none text-gray-900" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">List of Honors/Awards</label>
                  <textarea name="honorsAwards" value={formData.honorsAwards} onChange={handleChange} rows={3} placeholder="Write N/A if none" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none text-gray-900"></textarea>
                </div>
              </div>
            )}

            {/* Step 5: Schedule */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">SCHEDULE & ADMISSION TYPE</h2>

                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Is this a free pre-admission?</p>
                  <div className="flex gap-3">
                    {["Yes", "No"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData({ ...formData, freePreAdmission: opt, previousSchool: opt === "No" ? "" : formData.previousSchool })}
                        className={`px-6 py-2 border-2 rounded-lg font-semibold transition-all ${formData.freePreAdmission === opt ? "border-[#007848] bg-[#007848] text-white" : "border-gray-200 text-gray-600"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.freePreAdmission === "Yes" && (
                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">From what school?</label>
                      <input
                        type="text"
                        name="previousSchool"
                        value={formData.previousSchool}
                        onChange={handleChange}
                        placeholder="Enter school name"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">STAB Code</label>
                      <input
                        type="text"
                        name="stabCode"
                        value={formData.stabCode}
                        onChange={handleChange}
                        placeholder="Enter STAB code"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none text-gray-900"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Schedule</label>
                  {!formData.applicationLevel ? (
                    <p className="text-sm text-gray-400">Please select an application type first (Step 1).</p>
                  ) : (
                    <select name="preferredSchedule" value={formData.preferredSchedule} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007848] outline-none bg-white text-gray-900">
                      <option value="">{schedules.length === 0 ? "No schedules available" : "Select a schedule..."}</option>
                      {schedules.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.date && s.time ? `${s.date} - ${s.time}` : s.date || s.time || `Slot ${s.id}`} ({s.availableSlots} slots left)
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Declaration of Consent */}
            {currentStep === 6 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">DECLARATION OF CONSENT</h2>
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    I express consent for the school to collect, store, and process my personal data. I understand that my consent does not preclude the existence of other criteria for lawful processing of personal data, and does not waive any of my rights under the Data Privacy Act of 2012 and other applicable laws. Furthermore, I certify that the information given herein is correct and complete.
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="privacyAgreed"
                    checked={formData.privacyAgreed}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-[#007848] border-gray-300 rounded focus:ring-[#007848]"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I have read and fully understood the above declaration and give my consent.
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${currentStep === 1 ? "invisible" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              >
                Previous
              </button>
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-[#007848] text-white font-bold rounded-lg hover:bg-[#005a36] transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.privacyAgreed || submitting}
                  className={`px-8 py-3 font-bold rounded-lg transition-colors flex items-center gap-2 ${formData.privacyAgreed && !submitting ? "bg-[#007848] text-white hover:bg-[#005a36]" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                  {submitting ? <><FaSpinner className="animate-spin" /> Submitting...</> : "Submit Application"}
                </button>
              )}
            </div>
          </form>
        </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
