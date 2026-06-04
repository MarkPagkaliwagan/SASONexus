"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import {
  staffAccounts, preAdmissions, students,
  academicYears, semesters, collegeCourses, collegeDepartments, shsStrands, admissionSchedules,
  announcements, interviewSchedules, interviewAppointments, personnel,
  cumulativeRecords, verificationCodes, studentNeedsAssessment, handbooksPillars, documentClaims, admissionContent, sasoUnits,
} from "@/db/schema";
import { eq, ne, and, or, desc, sql, isNotNull, count } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "super_admin") throw new Error("Unauthorized");
}

export async function createStaffAccount(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const unitId = parseInt(formData.get("unitId") as string);
  const positionId = parseInt(formData.get("positionId") as string);
  const avatar = formData.get("avatar") as File | null;

  if (!name || !email || !password || !unitId || !positionId) {
    throw new Error("All fields are required");
  }

  let avatarUrl: string | null = null;
  if (avatar && avatar.size > 0 && avatar.size < 2 * 1024 * 1024) {
    const buffer = Buffer.from(await avatar.arrayBuffer());
    avatarUrl = `data:${avatar.type};base64,${buffer.toString("base64")}`;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await db.select({ id: staffAccounts.id })
    .from(staffAccounts)
    .where(eq(staffAccounts.email, email))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("A staff account with this email already exists.");
  }

  await db.insert(staffAccounts).values({
    name,
    email,
    password: hashedPassword,
    role: "staff",
    unitId,
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
  await requireAdmin();

  await db
    .update(staffAccounts)
    .set({ isActive: false })
    .where(eq(staffAccounts.id, id));

  revalidatePath("/portal/admin/staff");
}

export async function activateStaff(id: number) {
  await requireAdmin();

  await db
    .update(staffAccounts)
    .set({ isActive: true })
    .where(eq(staffAccounts.id, id));

  revalidatePath("/portal/admin/staff");
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
  const department = formData.get("department") as string;
  if (!name) throw new Error("Course name is required");
  if (!department) throw new Error("Department is required");
  await db.insert(collegeCourses).values({ name, code: code || null, department });
  revalidatePath("/portal/admin/admission/courses");
}

export async function upsertCollegeDepartment(name: string, logo: string | null) {
  await requireAdmin();
  const existing = await db.select().from(collegeDepartments).where(eq(collegeDepartments.name, name)).limit(1);
  if (existing[0]) {
    if (logo) {
      await db.update(collegeDepartments).set({ logo }).where(eq(collegeDepartments.name, name));
    }
  } else {
    await db.insert(collegeDepartments).values({ name, logo });
  }
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

export async function updateCourse(id: number, formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const department = formData.get("department") as string;
  if (!name) throw new Error("Course name is required");
  if (!department) throw new Error("Department is required");
  await db
    .update(collegeCourses)
    .set({ name, code: code || null, department })
    .where(eq(collegeCourses.id, id));
  revalidatePath("/portal/admin/admission/courses");
}

export async function updateCollegeDepartment(oldName: string, newName: string, logo: string | null) {
  await requireAdmin();
  const existing = await db.select().from(collegeDepartments).where(eq(collegeDepartments.name, oldName)).limit(1);
  if (!existing[0]) throw new Error("Department not found");
  await db.update(collegeDepartments).set({ name: newName, logo: logo ?? existing[0].logo }).where(eq(collegeDepartments.name, oldName));
  if (oldName !== newName) {
    await db.update(collegeCourses).set({ department: newName }).where(eq(collegeCourses.department, oldName));
  }
  revalidatePath("/portal/admin/admission/courses");
}

export async function deleteCollegeDepartment(name: string) {
  await requireAdmin();
  const courses = await db.select().from(collegeCourses).where(eq(collegeCourses.department, name)).limit(1);
  if (courses[0]) throw new Error("Cannot delete department with existing courses. Remove or reassign courses first.");
  await db.delete(collegeDepartments).where(eq(collegeDepartments.name, name));
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

export async function getCollegeDepartmentsWithCourses() {
  const departments = await db.query.collegeDepartments.findMany({
    orderBy: (d, { asc }) => [asc(d.name)],
  });
  const courses = await db.query.collegeCourses.findMany({
    where: (c, { eq }) => eq(c.isActive, true),
    orderBy: (c, { asc }) => [asc(c.name)],
  });
  return departments.map((dept) => ({
    ...dept,
    courses: courses.filter((c) => c.department === dept.name),
  }));
}

export async function getShsStrands() {
  return db.query.shsStrands.findMany({
    where: (s, { eq }) => eq(s.isActive, true),
    orderBy: (s, { asc }) => [asc(s.name)],
  });
}

// ── Announcements ──

export async function getAnnouncements() {
  return db.query.announcements.findMany({
    orderBy: (a, { desc }) => [desc(a.createdAt)],
  });
}

export async function getActiveAnnouncements() {
  return db.query.announcements.findMany({
    where: (a, { eq }) => eq(a.isActive, true),
    orderBy: (a, { desc }) => [desc(a.createdAt)],
  });
}

export async function createAnnouncement(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as string;
  if (!title || !content) throw new Error("Title and content are required");
  await db.insert(announcements).values({
    title,
    content,
    category: category || "General",
    image: image || null,
  });
  revalidatePath("/portal/admin/admission/announcements");
}

export async function toggleAnnouncement(id: number) {
  await requireAdmin();
  const item = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
  if (!item[0]) throw new Error("Not found");
  await db.update(announcements).set({ isActive: !item[0].isActive }).where(eq(announcements.id, id));
  revalidatePath("/portal/admin/admission/announcements");
}

export async function deleteAnnouncement(id: number) {
  await requireAdmin();
  await db.delete(announcements).where(eq(announcements.id, id));
  revalidatePath("/portal/admin/admission/announcements");
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

// ── Interview Schedules ──

export async function createInterviewSchedule(formData: FormData) {
  await requireAdmin();
  const type = formData.get("type") as string;
  const department = formData.get("department") as string;
  const gradeLevel = formData.get("gradeLevel") as string;
  const date = formData.get("date") as string;
  const timeStart = formData.get("timeStart") as string;
  const timeEnd = formData.get("timeEnd") as string;
  const slots = parseInt(formData.get("slots") as string) || 1;
  if (!department || !gradeLevel || !date || !timeStart || !timeEnd) throw new Error("All fields are required");
  const label = type === "exit" ? "Exit Interview" : "Initial Interview";
  const title = `${label} - ${department} - ${gradeLevel}`;
  await db.insert(interviewSchedules).values({ title, type: type || "initial", date, timeStart, timeEnd, slots, booked: 0 });
  revalidatePath("/portal/admin/interview");
}

export async function toggleInterviewSchedule(id: number) {
  await requireAdmin();
  const item = await db.select().from(interviewSchedules).where(eq(interviewSchedules.id, id)).limit(1);
  if (!item[0]) throw new Error("Not found");
  await db.update(interviewSchedules).set({ isActive: !item[0].isActive }).where(eq(interviewSchedules.id, id));
  revalidatePath("/portal/admin/interview");
}

export async function deleteInterviewSchedule(id: number) {
  await requireAdmin();
  await db.delete(interviewSchedules).where(eq(interviewSchedules.id, id));
  revalidatePath("/portal/admin/interview");
}

export async function checkStudentNoShow(studentId: string, interviewType: string) {
  if (!studentId) return null;
  const existing = await db
    .select({ id: interviewAppointments.id, interviewType: interviewAppointments.interviewType })
    .from(interviewAppointments)
    .where(
      and(
        eq(interviewAppointments.studentId, studentId),
        eq(interviewAppointments.interviewType, interviewType),
        eq(interviewAppointments.status, "no-show"),
      ),
    )
    .limit(1);
  if (existing.length > 0) return existing[0];
  return null;
}

export async function checkStudentAnyNoShow(studentId: string) {
  if (!studentId) return null;
  const existing = await db
    .select({ id: interviewAppointments.id, interviewType: interviewAppointments.interviewType })
    .from(interviewAppointments)
    .where(
      and(
        eq(interviewAppointments.studentId, studentId),
        eq(interviewAppointments.status, "no-show"),
      ),
    )
    .limit(1);
  if (existing.length > 0) return existing[0];
  return null;
}

export async function fetchStudentDetails(studentId: string) {
  if (!studentId || studentId.length < 2) return null;
  const fromStudents = await db
    .select({
      fullName: sql<string>`${students.givenName} || ' ' || COALESCE(${students.middleName} || ' ', '') || ${students.familyName}`,
      email: students.email,
      contact: students.mobileNo,
    })
    .from(students)
    .where(eq(students.studentId, studentId))
    .limit(1);
  if (fromStudents.length > 0) return fromStudents[0];
  const fromAppointments = await db
    .select({
      fullName: interviewAppointments.fullName,
      email: interviewAppointments.email,
      contact: interviewAppointments.contact,
    })
    .from(interviewAppointments)
    .where(eq(interviewAppointments.studentId, studentId))
    .orderBy(desc(interviewAppointments.createdAt))
    .limit(1);
  if (fromAppointments.length > 0) return fromAppointments[0];
  return null;
}

export async function submitInterviewAppointment(formData: FormData) {
  const scheduleId = parseInt(formData.get("scheduleId") as string);
  const interviewType = formData.get("interviewType") as string;
  const studentType = formData.get("studentType") as string;
  const academicLevel = formData.get("academicLevel") as string;
  const fullName = formData.get("fullName") as string;
  const studentId = formData.get("studentId") as string;
  const email = formData.get("email") as string;
  const contact = formData.get("contact") as string;
  const gradeLevel = formData.get("gradeLevel") as string;
  const strand = formData.get("strand") as string;
  const section = formData.get("section") as string;
  const department = formData.get("department") as string;
  const course = formData.get("course") as string;
  const noShowReason = formData.get("noShowReason") as string;

  if (!scheduleId || !fullName) throw new Error("Schedule and full name are required");

  if (studentId && !noShowReason) {
    const existing = await db
      .select({ id: interviewAppointments.id })
      .from(interviewAppointments)
      .where(
        and(
          eq(interviewAppointments.studentId, studentId),
          eq(interviewAppointments.interviewType, interviewType),
          eq(interviewAppointments.status, "pending"),
        ),
      )
      .limit(1);
    if (existing.length > 0) throw new Error("You already have a pending appointment for this interview type.");
  }

  if (noShowReason && studentId) {
    const prevNoShow = await db
      .select({ id: interviewAppointments.id, scheduleId: interviewAppointments.scheduleId })
      .from(interviewAppointments)
      .where(
        and(
          eq(interviewAppointments.studentId, studentId),
          eq(interviewAppointments.interviewType, interviewType),
          eq(interviewAppointments.status, "no-show"),
        ),
      )
      .limit(1);

    if (prevNoShow.length > 0) {
      await db.update(interviewAppointments)
        .set({ noShowReason, status: "rescheduled" })
        .where(eq(interviewAppointments.id, prevNoShow[0].id));

      const oldSchedule = await db.select().from(interviewSchedules).where(eq(interviewSchedules.id, prevNoShow[0].scheduleId)).limit(1);
      if (oldSchedule[0]) {
        await db.update(interviewSchedules)
          .set({ booked: sql`${interviewSchedules.booked} - 1` })
          .where(eq(interviewSchedules.id, prevNoShow[0].scheduleId));
      }
    }
  }

  await db.insert(interviewAppointments).values({
    scheduleId, interviewType, studentType, academicLevel,
    fullName, studentId, email, contact, gradeLevel, strand, section,
    department, course, status: "pending",
  });

  await db.update(interviewSchedules)
    .set({ booked: sql`${interviewSchedules.booked} + 1` })
    .where(eq(interviewSchedules.id, scheduleId));

  revalidatePath("/services");
}

export async function deleteInterviewAppointment(id: number) {
  await db.delete(interviewAppointments).where(eq(interviewAppointments.id, id));
  revalidatePath("/portal/admin/interview");
}

export async function updateInterviewAppointmentStatus(id: number, status: string) {
  await db.update(interviewAppointments)
    .set({ status })
    .where(eq(interviewAppointments.id, id));
  revalidatePath("/portal/admin/interview");
}

export async function markNoShowWithReason(id: number, reason: string, newScheduleId?: number) {
  await db.update(interviewAppointments)
    .set({ status: "no-show", noShowReason: reason })
    .where(eq(interviewAppointments.id, id));

  if (newScheduleId) {
    const original = await db.select().from(interviewAppointments).where(eq(interviewAppointments.id, id)).limit(1);
    if (original[0]) {
      await db.insert(interviewAppointments).values({
        scheduleId: newScheduleId,
        interviewType: original[0].interviewType,
        studentType: original[0].studentType,
        academicLevel: original[0].academicLevel,
        fullName: original[0].fullName,
        studentId: original[0].studentId,
        email: original[0].email,
        contact: original[0].contact,
        gradeLevel: original[0].gradeLevel,
        strand: original[0].strand,
        section: original[0].section,
        department: original[0].department,
        course: original[0].course,
        status: "rescheduled",
      });
      await db.update(interviewSchedules)
        .set({ booked: sql`${interviewSchedules.booked} + 1` })
        .where(eq(interviewSchedules.id, newScheduleId));
    }
  }

  revalidatePath("/portal/admin/interview");
}

// ── Personnel ──

export async function createPersonnel(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const email = formData.get("email") as string;
  const contact = formData.get("contact") as string;
  const unitIdStr = formData.get("unitId") as string;
  const unitId = unitIdStr ? parseInt(unitIdStr) : null;
  const isHead = formData.get("isHead") === "on";
  const avatarDataUrl = formData.get("avatarDataUrl") as string | null;

  if (!name) {
    throw new Error("Name is required");
  }

  if (!isHead && !unitId) {
    throw new Error("Unit is required for non-head personnel");
  }

  if (isHead) {
    await db.update(personnel).set({ isHead: false }).where(eq(personnel.isHead, true));
  }

  let avatarUrl: string | null = null;
  if (avatarDataUrl) {
    avatarUrl = avatarDataUrl;
  }

  await db.insert(personnel).values({
    name,
    position: position || null,
    email: email || null,
    contact: contact || null,
    unitId,
    isHead,
    avatarUrl,
  });

  revalidatePath("/portal/admin/personnel");
}

export async function deactivatePersonnel(id: number) {
  await requireAdmin();
  await db.update(personnel).set({ isActive: false }).where(eq(personnel.id, id));
  revalidatePath("/portal/admin/personnel");
}

export async function activatePersonnel(id: number) {
  await requireAdmin();
  await db.update(personnel).set({ isActive: true }).where(eq(personnel.id, id));
  revalidatePath("/portal/admin/personnel");
}

export async function deletePersonnel(id: number) {
  await requireAdmin();
  await db.delete(personnel).where(eq(personnel.id, id));
  revalidatePath("/portal/admin/personnel");
}

// ── Cumulative Record ──

export async function getCrfFormData() {
  const [years, courses, strands] = await Promise.all([
    db.query.academicYears.findMany({
      where: (y, { eq }) => eq(y.isActive, true),
      orderBy: (y, { desc }) => [desc(y.year)],
    }),
    db.query.collegeCourses.findMany({
      where: (c, { eq }) => eq(c.isActive, true),
      orderBy: (c, { asc }) => [asc(c.name)],
    }),
    db.query.shsStrands.findMany({
      where: (s, { eq }) => eq(s.isActive, true),
      orderBy: (s, { asc }) => [asc(s.name)],
    }),
  ]);
  return { years, courses, strands };
}

export async function lookupStudentByStudentId(studentId: string) {
  if (!studentId || studentId.length < 2) return null;
  const fromStudents = await db
    .select({
      id: students.id,
      studentId: students.studentId,
      familyName: students.familyName,
      givenName: students.givenName,
      middleName: students.middleName,
      email: students.email,
      applicationLevel: students.applicationLevel,
      gradeLevel: students.gradeLevel,
      academicYear: students.academicYear,
    })
    .from(students)
    .where(eq(students.studentId, studentId))
    .limit(1);
  if (fromStudents[0]) return fromStudents[0];
  const fromRecords = await db
    .select({
      id: cumulativeRecords.id,
      studentId: cumulativeRecords.schoolId,
      familyName: cumulativeRecords.fullName,
      givenName: cumulativeRecords.fullName,
      middleName: sql<string>`NULL`,
      email: cumulativeRecords.email,
      applicationLevel: sql<string>`NULL`,
      gradeLevel: sql<string>`NULL`,
      academicYear: cumulativeRecords.academicYear,
    })
    .from(cumulativeRecords)
    .where(eq(cumulativeRecords.schoolId, studentId))
    .limit(1);
  return fromRecords[0] || null;
}

export async function lookupStudentForSna(studentId: string) {
  if (!studentId || studentId.length < 2) return null;
  const fromSna = await db
    .select({
      id: studentNeedsAssessment.id,
      studentId: studentNeedsAssessment.studentId,
      schoolId: studentNeedsAssessment.schoolId,
      fullName: studentNeedsAssessment.fullName,
      email: studentNeedsAssessment.email,
      contact: studentNeedsAssessment.contactNumber,
      academicYear: studentNeedsAssessment.academicYear,
      department: studentNeedsAssessment.department,
      courseOrStrand: studentNeedsAssessment.courseOrStrand,
    })
    .from(studentNeedsAssessment)
    .where(or(
      eq(studentNeedsAssessment.schoolId, studentId),
      eq(studentNeedsAssessment.studentId, studentId),
    ))
    .limit(1);
  return fromSna[0] || null;
}

export async function sendStaffLoginOtp(email: string, password: string) {
  const [user] = await db
    .select()
    .from(staffAccounts)
    .where(and(eq(staffAccounts.email, email), eq(staffAccounts.isActive, true)))
    .limit(1);
  if (!user) return { ok: false, error: "Invalid email or password" };
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) return { ok: false, error: "Invalid email or password" };
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const { sendStaffOtpEmail } = await import("@/lib/email");
  await sendStaffOtpEmail(email, code);
  await db.insert(verificationCodes).values({ email, code, expiresAt });
  return { ok: true };
}

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  return session;
}

export async function updateStaffProfileName(name: string) {
  const session = await requireSession();
  await db.update(staffAccounts).set({ name }).where(eq(staffAccounts.email, session.user.email!));
  revalidatePath("/portal/admin/profile");
}

export async function updateStaffProfileAvatar(avatarBase64: string) {
  const session = await requireSession();
  await db.update(staffAccounts).set({ avatarUrl: avatarBase64 }).where(eq(staffAccounts.email, session.user.email!));
  revalidatePath("/portal/admin/profile");
}

export async function sendProfileChangeOtp() {
  const session = await requireSession();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const { sendStaffOtpEmail } = await import("@/lib/email");
  await sendStaffOtpEmail(session.user.email!, code);
  await db.insert(verificationCodes).values({ email: session.user.email!, code, expiresAt });
}

export async function updateStaffEmail(newEmail: string, otp: string) {
  const session = await requireSession();
  const [record] = await db
    .select()
    .from(verificationCodes)
    .where(and(eq(verificationCodes.email, session.user.email!), eq(verificationCodes.code, otp), eq(verificationCodes.used, false)))
    .orderBy(desc(verificationCodes.createdAt))
    .limit(1);
  if (!record) throw new Error("Invalid or expired OTP");
  if (new Date() > record.expiresAt) throw new Error("OTP has expired");
  const existing = await db.select().from(staffAccounts).where(eq(staffAccounts.email, newEmail)).limit(1);
  if (existing[0]) throw new Error("Email already in use");
  await db.update(staffAccounts).set({ email: newEmail }).where(eq(staffAccounts.email, session.user.email!));
  await db.update(verificationCodes).set({ used: true }).where(eq(verificationCodes.id, record.id));
  revalidatePath("/portal/admin/profile");
}

export async function updateStaffPassword(currentPassword: string, newPassword: string, otp: string) {
  const session = await requireSession();
  const [user] = await db.select().from(staffAccounts).where(eq(staffAccounts.email, session.user.email!)).limit(1);
  if (!user) throw new Error("User not found");
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new Error("Current password is incorrect");
  const [record] = await db
    .select()
    .from(verificationCodes)
    .where(and(eq(verificationCodes.email, session.user.email!), eq(verificationCodes.code, otp), eq(verificationCodes.used, false)))
    .orderBy(desc(verificationCodes.createdAt))
    .limit(1);
  if (!record) throw new Error("Invalid or expired OTP");
  if (new Date() > record.expiresAt) throw new Error("OTP has expired");
  const hashed = await bcrypt.hash(newPassword, 10);
  await db.update(staffAccounts).set({ password: hashed }).where(eq(staffAccounts.email, session.user.email!));
  await db.update(verificationCodes).set({ used: true }).where(eq(verificationCodes.id, record.id));
  revalidatePath("/portal/admin/profile");
}

export async function sendCumulativeRecordCode(email: string, studentId: string) {
  if (!email) throw new Error("Email is required");
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const { sendVerificationCode } = await import("@/lib/email");
  await sendVerificationCode(email, code);
  await db.insert(verificationCodes).values({ email, code, expiresAt });
  return true;
}

export async function verifyCumulativeRecordCode(email: string, code: string) {
  if (!email || !code) throw new Error("Email and code are required");
  const [record] = await db
    .select()
    .from(verificationCodes)
    .where(and(eq(verificationCodes.email, email), eq(verificationCodes.code, code), eq(verificationCodes.used, false)))
    .orderBy(desc(verificationCodes.createdAt))
    .limit(1);
  if (!record) throw new Error("Invalid code");
  if (new Date() > record.expiresAt) throw new Error("Code has expired. Please request a new one.");
  await db.update(verificationCodes).set({ used: true }).where(eq(verificationCodes.id, record.id));
  return true;
}

export async function getCumulativeRecord(studentId: string) {
  if (!studentId) return null;
  const [record] = await db
    .select()
    .from(cumulativeRecords)
    .where(
      or(
        eq(cumulativeRecords.studentId, studentId),
        eq(cumulativeRecords.schoolId, studentId),
      ),
    )
    .orderBy(desc(cumulativeRecords.updatedAt))
    .limit(1);
  return record || null;
}

export async function saveCumulativeRecord(formData: FormData) {
  const fields: Record<string, string | null> = {};
  const textFields = [
    "studentId", "academicYear", "department", "schoolId",
    "fullName", "address", "contactNumber", "email",
    "birthday", "age", "nationality",
    "elemSchool", "elemYear", "jhsSchool", "jhsYear",
    "shsSchool", "shsYear", "collegeProgram", "collegeYearLevel",
    "courseOrStrand",
    "parentName", "parentRelationship", "parentContact",
    "emergencyPerson", "emergencyRelationship", "emergencyContact",
  ];
  for (const key of textFields) {
    const val = formData.get(key);
    fields[key] = typeof val === "string" ? val : null;
  }
  if (fields["courseOrStrand"] && !fields["collegeProgram"]) {
    fields["collegeProgram"] = fields["courseOrStrand"];
  }
  const uploadFields = [
    "corUpload", "enrollmentFormUpload", "admissionRecordUpload",
    "reportCardUpload", "torUpload", "subjectLoadUpload",
    "psaBirthCertUpload", "idPictureUpload", "schoolIdUpload",
    "goodMoralUpload", "conductRecordUpload",
  ];
  for (const key of uploadFields) {
    const file = formData.get(key) as File | null;
    if (file && file.size > 0 && file.size < 5 * 1024 * 1024) {
      const buffer = Buffer.from(await file.arrayBuffer());
      fields[key] = `data:${file.type};base64,${buffer.toString("base64")}`;
    }
  }
  if (!fields.studentId && fields.schoolId) {
    fields.studentId = fields.schoolId;
  }
  const lookupId = fields.studentId || fields.schoolId;
  if (lookupId) {
    const existing = await db
      .select({ id: cumulativeRecords.id })
      .from(cumulativeRecords)
      .where(
        or(
          eq(cumulativeRecords.studentId, lookupId),
          eq(cumulativeRecords.schoolId, lookupId),
        ),
      )
      .limit(1);
    if (existing[0]) {
      await db.update(cumulativeRecords).set({ ...fields, updatedAt: new Date() }).where(eq(cumulativeRecords.id, existing[0].id));
      return { id: existing[0].id, mode: "updated" };
    }
  }
  const [inserted] = await db.insert(cumulativeRecords).values(fields as any).returning({ id: cumulativeRecords.id });
  return { id: inserted.id, mode: "created" };
}

export async function updatePersonnel(formData: FormData) {
  await requireAdmin();

  const id = parseInt(formData.get("id") as string);
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const email = formData.get("email") as string;
  const contact = formData.get("contact") as string;
  const unitIdStr = formData.get("unitId") as string;
  const unitId = unitIdStr ? parseInt(unitIdStr) : null;
  const isHead = formData.get("isHead") === "on";
  const avatarDataUrl = formData.get("avatarDataUrl") as string | null;

  if (!id || !name) {
    throw new Error("ID and name are required");
  }

  if (!isHead && !unitId) {
    throw new Error("Unit is required for non-head personnel");
  }

  if (isHead) {
    await db.update(personnel).set({ isHead: false }).where(and(eq(personnel.isHead, true), ne(personnel.id, id)));
  }

  let avatarUrl: string | null | undefined = undefined;
  if (avatarDataUrl) {
    avatarUrl = avatarDataUrl;
  }

  await db.update(personnel)
    .set({
      name,
      position: position || null,
      email: email || null,
      contact: contact || null,
      unitId,
      isHead,
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
    })
    .where(eq(personnel.id, id));

  revalidatePath("/portal/admin/personnel");
}

export async function saveStudentNeedsAssessment(formData: FormData) {
  const textFields: Record<string, string | null> = {};
  const fieldList = [
    "studentId", "schoolId", "academicYear", "department", "courseOrStrand",
    "fullName", "email", "contactNumber", "birthday", "age", "address",
    "academicDifficultSubjects", "academicStudyHabits", "academicLearningDifficulties", "academicConcerns",
    "personalProblems", "personalAdjustment", "personalFamilyConcerns",
    "emotionalStressLevel", "emotionalAnxiety", "emotionalMotivation", "emotionalSelfConfidence",
    "socialClassmates", "socialFriendships", "socialCommunication", "socialBullying",
    "financialAllowance", "financialExpenses", "financialScholarship",
    "careerGoal", "careerUncertainty", "careerSkills",
    "healthMedical", "healthPhysicalLimitations",
    "supportOther", "otherConcerns",
  ];
  for (const key of fieldList) {
    const val = formData.get(key);
    textFields[key] = typeof val === "string" ? val : null;
  }

  const boolFields: Record<string, boolean> = {};
  for (const key of ["supportCounseling", "supportAcademic", "supportScholarship", "supportCareer"]) {
    boolFields[key] = formData.get(key) === "on";
  }

  if (textFields.schoolId && !textFields.studentId) {
    textFields.studentId = textFields.schoolId;
  }

  const lookupId = textFields.studentId || textFields.schoolId;
  if (lookupId) {
    const existing = await db
      .select({ id: studentNeedsAssessment.id })
      .from(studentNeedsAssessment)
      .where(
        or(
          eq(studentNeedsAssessment.studentId, lookupId),
          eq(studentNeedsAssessment.schoolId, lookupId),
        ),
      )
      .limit(1);
    if (existing[0]) {
      await db.update(studentNeedsAssessment).set({
        ...textFields,
        ...boolFields,
        academicYear: textFields.academicYear || undefined,
        updatedAt: new Date(),
      } as any).where(eq(studentNeedsAssessment.id, existing[0].id));
      return { id: existing[0].id, mode: "updated" };
    }
  }

  const [inserted] = await db.insert(studentNeedsAssessment).values({
    ...textFields,
    ...boolFields,
  } as any).returning({ id: studentNeedsAssessment.id });
  return { id: inserted.id, mode: "created" };
}

export async function getStudentNeedsAssessment(studentId: string) {
  if (!studentId) return null;
  const [existing] = await db
    .select()
    .from(studentNeedsAssessment)
    .where(
      or(
        eq(studentNeedsAssessment.studentId, studentId),
        eq(studentNeedsAssessment.schoolId, studentId),
      ),
    )
    .orderBy(desc(studentNeedsAssessment.updatedAt))
    .limit(1);
  return existing || null;
}

export async function updateNeedsAssessmentStatus(id: number, status: string) {
  await requireAdmin();
  await db.update(studentNeedsAssessment).set({ status, updatedAt: new Date() }).where(eq(studentNeedsAssessment.id, id));
  revalidatePath("/portal/admin/student-needs-assessment");
}

export async function getHandbooksPillars(type?: "handbook" | "pillar") {
  const conditions = type ? [eq(handbooksPillars.type, type)] : [];
  return await db
    .select()
    .from(handbooksPillars)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(handbooksPillars.sortOrder);
}

export async function createHandbookPillar(formData: FormData) {
  await requireAdmin();

  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  if (!type || !title || !content) throw new Error("Type, title, and content are required");

  await db.insert(handbooksPillars).values({ type, title, content, image: image || null, sortOrder } as any);
  revalidatePath("/portal/admin/handbooks-pillars");
  revalidatePath("/services");
}

export async function updateHandbookPillar(formData: FormData) {
  await requireAdmin();

  const id = parseInt(formData.get("id") as string);
  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as string;
  const removeImage = formData.get("removeImage") === "true";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  if (!id || !type || !title || !content) throw new Error("All fields are required");

  const updateData: any = { type, title, content, sortOrder, updatedAt: new Date() };
  if (removeImage) updateData.image = null;
  else if (image) updateData.image = image;

  await db.update(handbooksPillars).set(updateData).where(eq(handbooksPillars.id, id));
  revalidatePath("/portal/admin/handbooks-pillars");
  revalidatePath("/services");
}

export async function deleteHandbookPillar(id: number) {
  await requireAdmin();

  await db.delete(handbooksPillars).where(eq(handbooksPillars.id, id));
  revalidatePath("/portal/admin/handbooks-pillars");
  revalidatePath("/services");
}

export async function submitDocumentClaim(data: {
  type: "handbook" | "yearbook";
  orNumber: string;
  fullName: string;
  academicYear?: string;
  department?: string;
  course?: string;
  strand?: string;
  level?: string;
  pillarYear?: string;
}) {
  if (!data.orNumber || !data.fullName) throw new Error("OR Number and Full Name are required");

  const existing = await db
    .select()
    .from(documentClaims)
    .where(and(eq(documentClaims.type, data.type), eq(documentClaims.orNumber, data.orNumber)))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("This OR number has already been used to claim a " + data.type);
  }

  await db.insert(documentClaims).values({
    type: data.type,
    orNumber: data.orNumber,
    fullName: data.fullName,
    academicYear: data.academicYear || null,
    department: data.department || null,
    course: data.course || null,
    strand: data.strand || null,
    level: data.level || null,
    pillarYear: data.pillarYear || null,
  });
}

export async function getDocumentClaims() {
  await requireAdmin();

  return await db
    .select()
    .from(documentClaims)
    .orderBy(desc(documentClaims.createdAt));
}

export async function updateDocumentClaimStatus(id: number, status: "pending" | "claimed") {
  await requireAdmin();

  await db.update(documentClaims).set({ status }).where(eq(documentClaims.id, id));
  revalidatePath("/portal/admin/document-claims");
}

export async function getAdmissionContent() {
  const rows = await db.select().from(admissionContent);
  const map: Record<string, string> = {};
  for (const row of rows) map[row.section] = row.content;
  return map;
}

export async function updateAdmissionContent(section: string, content: string) {
  await requireAdmin();

  await db
    .insert(admissionContent)
    .values({ section, content, updatedAt: new Date() })
    .onConflictDoUpdate({ target: admissionContent.section, set: { content, updatedAt: new Date() } });
  revalidatePath("/portal/admin/admission");
  revalidatePath("/admission");
}

export async function getDashboardChartData() {
  const [aByYear, aByLevel, pByUnit, cByStatus, sByLevel, c, a, s, cr] = await Promise.all([
    db.select({ name: preAdmissions.academicYear, value: count() })
      .from(preAdmissions).where(isNotNull(preAdmissions.academicYear)).groupBy(preAdmissions.academicYear).orderBy(preAdmissions.academicYear),
    db.select({ name: preAdmissions.applicationLevel, value: count() })
      .from(preAdmissions).where(isNotNull(preAdmissions.applicationLevel)).groupBy(preAdmissions.applicationLevel).orderBy(preAdmissions.applicationLevel),
    db.select({ name: sasoUnits.name, value: count() })
      .from(sasoUnits).leftJoin(personnel, eq(personnel.unitId, sasoUnits.id)).where(isNotNull(sasoUnits.name)).groupBy(sasoUnits.id, sasoUnits.name).orderBy(sasoUnits.name),
    db.select({ name: documentClaims.status, value: count() })
      .from(documentClaims).where(isNotNull(documentClaims.status)).groupBy(documentClaims.status).orderBy(documentClaims.status),
    db.select({ name: students.applicationLevel, value: count() })
      .from(students).where(isNotNull(students.applicationLevel)).groupBy(students.applicationLevel).orderBy(students.applicationLevel),
    db.select({ value: count() }).from(studentNeedsAssessment).where(eq(studentNeedsAssessment.supportCounseling, true)),
    db.select({ value: count() }).from(studentNeedsAssessment).where(eq(studentNeedsAssessment.supportAcademic, true)),
    db.select({ value: count() }).from(studentNeedsAssessment).where(eq(studentNeedsAssessment.supportScholarship, true)),
    db.select({ value: count() }).from(studentNeedsAssessment).where(eq(studentNeedsAssessment.supportCareer, true)),
  ]);

  return {
    admissionsByYear: aByYear.map((d) => ({ name: d.name ?? "Unknown", value: d.value })),
    admissionsByLevel: aByLevel.map((d) => ({ name: d.name ?? "Unknown", value: d.value })),
    personnelByUnit: pByUnit.map((d) => ({ name: d.name ?? "Unknown", value: d.value })),
    claimsByStatus: cByStatus.map((d) => ({ name: d.name ?? "Unknown", value: d.value })),
    studentsByLevel: sByLevel.map((d) => ({ name: d.name ?? "Unknown", value: d.value })),
    snaSupport: [
      { name: "Counseling", value: c[0]?.value ?? 0 },
      { name: "Academic", value: a[0]?.value ?? 0 },
      { name: "Scholarship", value: s[0]?.value ?? 0 },
      { name: "Career", value: cr[0]?.value ?? 0 },
    ],
  };
}
