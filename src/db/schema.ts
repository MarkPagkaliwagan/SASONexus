import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  departmentId: integer("department_id").notNull().references(() => departments.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const staffAccounts = pgTable("staff_accounts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  avatarUrl: text("avatar_url"),
  role: varchar("role", { length: 50 }).notNull().default("staff"),
  departmentId: integer("department_id").references(() => departments.id),
  positionId: integer("position_id").references(() => positions.id),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const departmentsRelations = relations(departments, ({ many }) => ({
  positions: many(positions),
  staffAccounts: many(staffAccounts),
}));

export const positionsRelations = relations(positions, ({ one }) => ({
  department: one(departments, {
    fields: [positions.departmentId],
    references: [departments.id],
  }),
}));

export const staffAccountsRelations = relations(staffAccounts, ({ one }) => ({
  department: one(departments, {
    fields: [staffAccounts.departmentId],
    references: [departments.id],
  }),
  position: one(positions, {
    fields: [staffAccounts.positionId],
    references: [positions.id],
  }),
}));

export const academicYears = pgTable("academic_years", {
  id: serial("id").primaryKey(),
  year: varchar("year", { length: 20 }).notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const semesters = pgTable("semesters", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  academicYearId: integer("academic_year_id").notNull().references(() => academicYears.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const collegeCourses = pgTable("college_courses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shsStrands = pgTable("shs_strands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const admissionSchedules = pgTable("admission_schedules", {
  id: serial("id").primaryKey(),
  level: varchar("level", { length: 50 }).notNull(),
  date: varchar("date", { length: 50 }),
  time: varchar("time", { length: 50 }),
  maxSlots: integer("max_slots").default(30).notNull(),
  availableSlots: integer("available_slots").default(30).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const academicYearsRelations = relations(academicYears, ({ many }) => ({
  semesters: many(semesters),
}));

export const semestersRelations = relations(semesters, ({ one }) => ({
  academicYear: one(academicYears, {
    fields: [semesters.academicYearId],
    references: [academicYears.id],
  }),
}));

export const preAdmissions = pgTable("pre_admissions", {
  id: serial("id").primaryKey(),

  applicationLevel: varchar("application_level", { length: 255 }).notNull(),
  academicYear: varchar("academic_year", { length: 255 }),
  semester: varchar("semester", { length: 255 }),
  gradeLevel: varchar("grade_level", { length: 255 }),
  firstChoice: varchar("first_choice", { length: 255 }),
  secondChoice: varchar("second_choice", { length: 255 }),

  familyName: varchar("family_name", { length: 255 }).notNull(),
  givenName: varchar("given_name", { length: 255 }).notNull(),
  middleName: varchar("middle_name", { length: 255 }),
  gender: varchar("gender", { length: 50 }).notNull(),
  birthDate: varchar("birth_date", { length: 50 }).notNull(),
  age: varchar("age", { length: 10 }),
  placeOfBirth: text("place_of_birth"),
  religion: varchar("religion", { length: 255 }),
  civilStatus: varchar("civil_status", { length: 50 }),
  citizenship: varchar("citizenship", { length: 100 }),
  houseNo: text("house_no"),
  province: text("province"),
  cityMunicipality: text("city_municipality"),
  barangay: text("barangay"),
  zipCode: varchar("zip_code", { length: 20 }),
  telNo: varchar("tel_no", { length: 50 }),
  mobileNo: varchar("mobile_no", { length: 50 }),
  email: varchar("email", { length: 255 }),
  residence: varchar("residence", { length: 255 }),
  pictureUrl: text("picture_url"),

  fatherName: varchar("father_name", { length: 255 }),
  fatherAddress: text("father_address"),
  fatherTel: varchar("father_tel", { length: 50 }),
  fatherCitizenship: varchar("father_citizenship", { length: 100 }),
  fatherOccupation: varchar("father_occupation", { length: 255 }),
  fatherOfficeAddress: text("father_office_address"),
  fatherOfficeTel: varchar("father_office_tel", { length: 50 }),
  fatherEducation: varchar("father_education", { length: 255 }),
  fatherLastSchool: text("father_last_school"),
  fatherAlumnus: varchar("father_alumnus", { length: 10 }),

  motherName: varchar("mother_name", { length: 255 }),
  motherAddress: text("mother_address"),
  motherTel: varchar("mother_tel", { length: 50 }),
  motherCitizenship: varchar("mother_citizenship", { length: 100 }),
  motherOccupation: varchar("mother_occupation", { length: 255 }),
  motherOfficeAddress: text("mother_office_address"),
  motherOfficeTel: varchar("mother_office_tel", { length: 50 }),
  motherEducation: varchar("mother_education", { length: 255 }),
  motherLastSchool: text("mother_last_school"),
  motherAlumnus: varchar("mother_alumnus", { length: 10 }),

  lrnNo: varchar("lrn_no", { length: 50 }),
  lastSchoolAttended: text("last_school_attended"),
  schoolAddress: text("school_address"),
  track: varchar("track", { length: 255 }),
  strand: varchar("strand", { length: 255 }),
  schoolYearAttended: varchar("school_year_attended", { length: 20 }),
  dateOfGraduation: varchar("date_of_graduation", { length: 50 }),
  honorsAwards: text("honors_awards"),
  isTransferee: varchar("is_transferee", { length: 10 }),

  freePreAdmission: varchar("free_pre_admission", { length: 10 }),
  previousSchool: text("previous_school"),
  stabCode: varchar("stab_code", { length: 100 }),
  preferredSchedule: varchar("preferred_schedule", { length: 255 }),

  privacyAgreed: boolean("privacy_agreed").notNull().default(false),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  examResult: text("exam_result"),
  rescheduleDate: varchar("reschedule_date", { length: 255 }),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  preAdmissionId: integer("pre_admission_id").notNull().references(() => preAdmissions.id, { onDelete: "cascade" }),
  studentId: varchar("student_id", { length: 50 }),
  familyName: varchar("family_name", { length: 255 }).notNull(),
  givenName: varchar("given_name", { length: 255 }).notNull(),
  middleName: varchar("middle_name", { length: 255 }),
  applicationLevel: varchar("application_level", { length: 255 }).notNull(),
  gradeLevel: varchar("grade_level", { length: 255 }),
  academicYear: varchar("academic_year", { length: 255 }),
  gender: varchar("gender", { length: 50 }).notNull(),
  birthDate: varchar("birth_date", { length: 50 }).notNull(),
  mobileNo: varchar("mobile_no", { length: 50 }),
  email: varchar("email", { length: 255 }),
  pictureUrl: text("picture_url"),
  examResult: text("exam_result"),
  rescheduleDate: varchar("reschedule_date", { length: 255 }),
  status: varchar("status", { length: 50 }).default("took-exam").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
});
