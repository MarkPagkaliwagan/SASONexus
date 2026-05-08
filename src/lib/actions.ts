"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import {
  staffAccounts, preAdmissions, students,
  academicYears, semesters, collegeCourses, shsStrands, admissionSchedules
} from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createStaffAccount(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const departmentId = parseInt(formData.get("departmentId") as string);
  const positionId = parseInt(formData.get("positionId") as string);
  const avatar = formData.get("avatar") as File | null;

  if (!name || !email || !password || !departmentId || !positionId) {
    throw new Error("All fields are required");
  }

  let avatarUrl: string | null = null;
  if (avatar && avatar.size > 0 && avatar.size < 2 * 1024 * 1024) {
    const buffer = Buffer.from(await avatar.arrayBuffer());
    avatarUrl = `data:${avatar.type};base64,${buffer.toString("base64")}`;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(staffAccounts).values({
    name,
    email,
    password: hashedPassword,
    role: "staff",
    departmentId,
    positionId,
    avatarUrl,
  });

  revalidatePath("/portal/admin/staff");
}

export async function submitPreAdmission(formData: FormData) {
  const fields: Record<string, string | boolean | null> = {};
  const textFields = [
    "applicationLevel", "academicYear", "semester", "gradeLevel",
    "firstChoice", "secondChoice", "familyName", "givenName", "middleName",
    "gender", "birthDate", "age", "placeOfBirth", "religion", "civilStatus",
    "citizenship", "houseNo", "province", "cityMunicipality", "barangay",
    "zipCode", "telNo", "mobileNo", "email", "residence",
    "fatherName", "fatherAddress", "fatherTel", "fatherCitizenship",
    "fatherOccupation", "fatherOfficeAddress", "fatherOfficeTel",
    "fatherEducation", "fatherLastSchool", "fatherAlumnus",
    "motherName", "motherAddress", "motherTel", "motherCitizenship",
    "motherOccupation", "motherOfficeAddress", "motherOfficeTel",
    "motherEducation", "motherLastSchool", "motherAlumnus",
    "lrnNo", "lastSchoolAttended", "schoolAddress", "track", "strand",
    "schoolYearAttended", "dateOfGraduation", "honorsAwards", "isTransferee",
    "freePreAdmission", "previousSchool", "stabCode", "preferredSchedule",
  ];

  for (const key of textFields) {
    const val = formData.get(key);
    fields[key] = typeof val === "string" ? val : null;
  }

  const privacyAgreed = formData.get("privacyAgreed");
  fields["privacyAgreed"] = privacyAgreed === "true" || privacyAgreed === "on";

  const picture = formData.get("picture") as File | null;
  let pictureUrl: string | null = null;
  if (picture && picture.size > 0 && picture.size < 2 * 1024 * 1024) {
    const buffer = Buffer.from(await picture.arrayBuffer());
    pictureUrl = `data:${picture.type};base64,${buffer.toString("base64")}`;
  }

  await db.insert(preAdmissions).values({
    ...fields as any,
    pictureUrl,
  });

  const scheduleId = parseInt(fields["preferredSchedule"] as string);
  if (scheduleId) {
    const schedule = await db.select().from(admissionSchedules).where(eq(admissionSchedules.id, scheduleId)).limit(1);
    if (schedule[0] && schedule[0].availableSlots > 0) {
      const newSlots = schedule[0].availableSlots - 1;
      await db.update(admissionSchedules).set({
        availableSlots: newSlots,
        isAvailable: newSlots > 0,
      }).where(eq(admissionSchedules.id, scheduleId));
    }
  }

  revalidatePath("/admission/pre-admission");
}

export async function deactivateStaff(id: number) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  await db
    .update(staffAccounts)
    .set({ isActive: false })
    .where(eq(staffAccounts.id, id));

  revalidatePath("/portal/admin/staff");
}

export async function activateStaff(id: number) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  await db
    .update(staffAccounts)
    .set({ isActive: true })
    .where(eq(staffAccounts.id, id));

  revalidatePath("/portal/admin/staff");
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "super_admin") throw new Error("Unauthorized");
}

// ── Academic Years ──

export async function createAcademicYear(formData: FormData) {
  await requireAdmin();
  const year = formData.get("year") as string;
  if (!year) throw new Error("Year is required");
  await db.insert(academicYears).values({ year });
  revalidatePath("/portal/admin/admission/academic-years");
}

export async function toggleAcademicYear(id: number) {
  await requireAdmin();
  const item = await db.select().from(academicYears).where(eq(academicYears.id, id)).limit(1);
  if (!item[0]) throw new Error("Not found");
  await db.update(academicYears).set({ isActive: !item[0].isActive }).where(eq(academicYears.id, id));
  revalidatePath("/portal/admin/admission/academic-years");
}

export async function deleteAcademicYear(id: number) {
  await requireAdmin();
  await db.delete(academicYears).where(eq(academicYears.id, id));
  revalidatePath("/portal/admin/admission/academic-years");
}

// ── Semesters ──

export async function createSemester(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const academicYearId = parseInt(formData.get("academicYearId") as string);
  if (!name || !academicYearId) throw new Error("Name and academic year are required");
  await db.insert(semesters).values({ name, academicYearId });
  revalidatePath("/portal/admin/admission/academic-years");
}

export async function toggleSemester(id: number) {
  await requireAdmin();
  const item = await db.select().from(semesters).where(eq(semesters.id, id)).limit(1);
  if (!item[0]) throw new Error("Not found");
  await db.update(semesters).set({ isActive: !item[0].isActive }).where(eq(semesters.id, id));
  revalidatePath("/portal/admin/admission/academic-years");
}

export async function deleteSemester(id: number) {
  await requireAdmin();
  await db.delete(semesters).where(eq(semesters.id, id));
  revalidatePath("/portal/admin/admission/academic-years");
}

// ── College Courses ──

export async function createCourse(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  if (!name) throw new Error("Course name is required");
  await db.insert(collegeCourses).values({ name, code: code || null });
  revalidatePath("/portal/admin/admission/courses");
}

export async function toggleCourse(id: number) {
  await requireAdmin();
  const item = await db.select().from(collegeCourses).where(eq(collegeCourses.id, id)).limit(1);
  if (!item[0]) throw new Error("Not found");
  await db.update(collegeCourses).set({ isActive: !item[0].isActive }).where(eq(collegeCourses.id, id));
  revalidatePath("/portal/admin/admission/courses");
}

export async function deleteCourse(id: number) {
  await requireAdmin();
  await db.delete(collegeCourses).where(eq(collegeCourses.id, id));
  revalidatePath("/portal/admin/admission/courses");
}

// ── SHS Strands ──

export async function createStrand(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  if (!name) throw new Error("Strand name is required");
  await db.insert(shsStrands).values({ name, code: code || null });
  revalidatePath("/portal/admin/admission/strands");
}

export async function toggleStrand(id: number) {
  await requireAdmin();
  const item = await db.select().from(shsStrands).where(eq(shsStrands.id, id)).limit(1);
  if (!item[0]) throw new Error("Not found");
  await db.update(shsStrands).set({ isActive: !item[0].isActive }).where(eq(shsStrands.id, id));
  revalidatePath("/portal/admin/admission/strands");
}

export async function deleteStrand(id: number) {
  await requireAdmin();
  await db.delete(shsStrands).where(eq(shsStrands.id, id));
  revalidatePath("/portal/admin/admission/strands");
}

const levelMap: Record<string, string> = {
  "College": "COLLEGE",
  "Senior High School": "SHS",
  "Junior High School": "JHS",
  "Grade School": "GS",
};

export async function getSchedulesByLevel(applicationLevel: string) {
  const dbLevel = levelMap[applicationLevel];
  if (!dbLevel) return [];
  return db.query.admissionSchedules.findMany({
    where: (s, { eq, and, gt }) => and(eq(s.level, dbLevel), eq(s.isAvailable, true), gt(s.availableSlots, 0)),
    orderBy: (s, { asc }) => [asc(s.date), asc(s.time)],
  });
}

export async function getAcademicYears() {
  return db.query.academicYears.findMany({
    where: (y, { eq }) => eq(y.isActive, true),
    with: { semesters: true },
    orderBy: (y, { desc }) => [desc(y.year)],
  });
}

export async function getCollegeCourses() {
  return db.query.collegeCourses.findMany({
    where: (c, { eq }) => eq(c.isActive, true),
    orderBy: (c, { asc }) => [asc(c.name)],
  });
}

export async function getShsStrands() {
  return db.query.shsStrands.findMany({
    where: (s, { eq }) => eq(s.isActive, true),
    orderBy: (s, { asc }) => [asc(s.name)],
  });
}

// ── Admission Schedules ──

export async function createSchedule(formData: FormData) {
  await requireAdmin();
  const level = formData.get("level") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const maxSlots = parseInt(formData.get("maxSlots") as string) || 30;
  if (!level) throw new Error("Level is required");
  await db.insert(admissionSchedules).values({ level, date: date || null, time: time || null, maxSlots, availableSlots: maxSlots });
  revalidatePath("/portal/admin/admission/schedules");
}

export async function updateScheduleSlots(id: number, maxSlots: number) {
  await requireAdmin();
  await db.update(admissionSchedules).set({ maxSlots, availableSlots: maxSlots }).where(eq(admissionSchedules.id, id));
  revalidatePath("/portal/admin/admission/schedules");
}

export async function toggleSchedule(id: number) {
  await requireAdmin();
  const item = await db.select().from(admissionSchedules).where(eq(admissionSchedules.id, id)).limit(1);
  if (!item[0]) throw new Error("Not found");
  await db.update(admissionSchedules).set({ isAvailable: !item[0].isAvailable }).where(eq(admissionSchedules.id, id));
  revalidatePath("/portal/admin/admission/schedules");
}

export async function deleteSchedule(id: number) {
  await requireAdmin();
  await db.delete(admissionSchedules).where(eq(admissionSchedules.id, id));
  revalidatePath("/portal/admin/admission/schedules");
}

// ── Pre-Admissions ──

export async function updatePreAdmissionStatus(id: number, status: string) {
  await requireAdmin();

  const [item] = await db.select().from(preAdmissions).where(eq(preAdmissions.id, id)).limit(1);
  if (!item) throw new Error("Not found");

  await db.update(preAdmissions).set({ status }).where(eq(preAdmissions.id, id));

  if (status === "approved") {
    const existing = await db.select().from(students).where(eq(students.preAdmissionId, id)).limit(1);
    if (!existing[0]) {
      await db.insert(students).values({
        preAdmissionId: id,
        familyName: item.familyName,
        givenName: item.givenName,
        middleName: item.middleName,
        applicationLevel: item.applicationLevel,
        gradeLevel: item.gradeLevel,
        academicYear: item.academicYear,
        gender: item.gender ?? "",
        birthDate: item.birthDate ?? "",
        mobileNo: item.mobileNo,
        email: item.email,
        pictureUrl: item.pictureUrl,
      });
    }
  }

  revalidatePath("/portal/admin/admission/pre-admissions");
  revalidatePath("/portal/admin/admission");
}

// ── Admissions (Students) ──

export async function updateStudentResult(id: number, value: string) {
  await requireAdmin();
  const col = value === "took-exam" || value === "no-show" ? { status: value } : { examResult: value };
  await db.update(students).set(col).where(eq(students.id, id));
  revalidatePath("/portal/admin/admission");
}

export async function rescheduleStudent(id: number, scheduleId: string) {
  await requireAdmin();

  const [item] = await db.select().from(students).where(eq(students.id, id)).limit(1);
  if (!item) throw new Error("Not found");

  const newSchedule = await db.select().from(admissionSchedules).where(eq(admissionSchedules.id, parseInt(scheduleId))).limit(1);
  if (!newSchedule[0] || newSchedule[0].availableSlots <= 0) throw new Error("Schedule full or not found");

  await db.update(admissionSchedules).set({
    availableSlots: newSchedule[0].availableSlots - 1,
    isAvailable: newSchedule[0].availableSlots - 1 > 0,
  }).where(eq(admissionSchedules.id, newSchedule[0].id));

  await db.update(students).set({
    rescheduleDate: scheduleId,
    status: "took-exam",
  }).where(eq(students.id, id));

  revalidatePath("/portal/admin/admission");
}

export async function deleteStudent(id: number) {
  await requireAdmin();
  await db.delete(students).where(eq(students.id, id));
  revalidatePath("/portal/admin/admission");
}

export async function deletePreAdmission(id: number) {
  await requireAdmin();
  await db.delete(preAdmissions).where(eq(preAdmissions.id, id));
  revalidatePath("/portal/admin/admission/pre-admissions");
}

export async function updateExamResult(id: number, examResult: string) {
  await requireAdmin();
  await db.update(preAdmissions).set({ examResult }).where(eq(preAdmissions.id, id));
  revalidatePath("/portal/admin/admission/pre-admissions");
}

export async function saveStudentExamResult(id: number, examResult: string) {
  await requireAdmin();
  await db.update(students).set({ examResult, status: "took-exam" }).where(eq(students.id, id));
  revalidatePath("/portal/admin/admission");
}

export async function reschedulePreAdmission(id: number, scheduleId: string) {
  await requireAdmin();

  const [item] = await db.select().from(preAdmissions).where(eq(preAdmissions.id, id)).limit(1);
  if (!item) throw new Error("Not found");

  const oldScheduleId = item.preferredSchedule;
  if (oldScheduleId) {
    const oldSchedule = await db.select().from(admissionSchedules).where(eq(admissionSchedules.id, parseInt(oldScheduleId))).limit(1);
    if (oldSchedule[0]) {
      await db.update(admissionSchedules).set({
        availableSlots: oldSchedule[0].availableSlots + 1,
        isAvailable: true,
      }).where(eq(admissionSchedules.id, oldSchedule[0].id));
    }
  }

  const newSchedule = await db.select().from(admissionSchedules).where(eq(admissionSchedules.id, parseInt(scheduleId))).limit(1);
  if (!newSchedule[0] || newSchedule[0].availableSlots <= 0) throw new Error("Schedule full or not found");

  await db.update(admissionSchedules).set({
    availableSlots: newSchedule[0].availableSlots - 1,
    isAvailable: newSchedule[0].availableSlots - 1 > 0,
  }).where(eq(admissionSchedules.id, newSchedule[0].id));

  await db.update(preAdmissions).set({
    preferredSchedule: scheduleId,
    status: "pending",
  }).where(eq(preAdmissions.id, id));

  revalidatePath("/portal/admin/admission/pre-admissions");
}
