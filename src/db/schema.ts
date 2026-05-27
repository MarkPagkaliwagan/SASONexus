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

export const sasoUnits = pgTable("saso_units", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  unitId: integer("unit_id").notNull().references(() => sasoUnits.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const staffAccounts = pgTable("staff_accounts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  avatarUrl: text("avatar_url"),
  role: varchar("role", { length: 50 }).notNull().default("staff"),
  unitId: integer("unit_id").references(() => sasoUnits.id),
  positionId: integer("position_id").references(() => positions.id),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sasoUnitsRelations = relations(sasoUnits, ({ many }) => ({
  positions: many(positions),
  staffAccounts: many(staffAccounts),
}));

export const positionsRelations = relations(positions, ({ one }) => ({
  unit: one(sasoUnits, {
    fields: [positions.unitId],
    references: [sasoUnits.id],
  }),
}));

export const staffAccountsRelations = relations(staffAccounts, ({ one }) => ({
  unit: one(sasoUnits, {
    fields: [staffAccounts.unitId],
    references: [sasoUnits.id],
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

export const collegeDepartments = pgTable("college_departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const collegeCourses = pgTable("college_courses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  department: varchar("department", { length: 255 }).notNull(),
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

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull().default("General"),
  image: text("image"),
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

export const interviewSchedules = pgTable("interview_schedules", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull().default("initial"),
  date: varchar("date", { length: 50 }).notNull(),
  timeStart: varchar("time_start", { length: 50 }).notNull(),
  timeEnd: varchar("time_end", { length: 50 }).notNull(),
  slots: integer("slots").notNull().default(1),
  booked: integer("booked").notNull().default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const interviewAppointments = pgTable("interview_appointments", {
  id: serial("id").primaryKey(),
  scheduleId: integer("schedule_id").notNull().references(() => interviewSchedules.id, { onDelete: "cascade" }),
  interviewType: varchar("interview_type", { length: 50 }).notNull().default("initial"),
  studentType: varchar("student_type", { length: 100 }),
  academicLevel: varchar("academic_level", { length: 100 }),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  studentId: varchar("student_id", { length: 100 }),
  email: varchar("email", { length: 255 }),
  contact: varchar("contact", { length: 100 }),
  gradeLevel: varchar("grade_level", { length: 100 }),
  strand: varchar("strand", { length: 255 }),
  section: varchar("section", { length: 255 }),
  department: varchar("department", { length: 255 }),
  course: varchar("course", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  noShowReason: varchar("no_show_reason", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const personnel = pgTable("personnel", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }),
  email: varchar("email", { length: 255 }),
  contact: varchar("contact", { length: 100 }),
  avatarUrl: text("avatar_url"),
  unitId: integer("unit_id").references(() => sasoUnits.id, { onDelete: "cascade" }),
  isHead: boolean("is_head").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const personnelRelations = relations(personnel, ({ one }) => ({
  unit: one(sasoUnits, {
    fields: [personnel.unitId],
    references: [sasoUnits.id],
  }),
}));

export const cumulativeRecords = pgTable("cumulative_records", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 100 }),
  academicYear: varchar("academic_year", { length: 50 }),
  department: varchar("department", { length: 100 }),
  schoolId: varchar("school_id", { length: 100 }),
  fullName: varchar("full_name", { length: 255 }),
  studentNumber: varchar("student_number", { length: 100 }),
  address: text("address"),
  contactNumber: varchar("contact_number", { length: 50 }),
  email: varchar("email", { length: 255 }),
  birthday: varchar("birthday", { length: 50 }),
  age: varchar("age", { length: 10 }),
  nationality: varchar("nationality", { length: 100 }),
  elemSchool: varchar("elem_school", { length: 255 }),
  elemYear: varchar("elem_year", { length: 50 }),
  jhsSchool: varchar("jhs_school", { length: 255 }),
  jhsYear: varchar("jhs_year", { length: 50 }),
  shsSchool: varchar("shs_school", { length: 255 }),
  shsYear: varchar("shs_year", { length: 50 }),
  collegeProgram: varchar("college_program", { length: 255 }),
  collegeYearLevel: varchar("college_year_level", { length: 50 }),
  corUpload: text("cor_upload"),
  enrollmentFormUpload: text("enrollment_form_upload"),
  admissionRecordUpload: text("admission_record_upload"),
  reportCardUpload: text("report_card_upload"),
  torUpload: text("tor_upload"),
  subjectLoadUpload: text("subject_load_upload"),
  psaBirthCertUpload: text("psa_birth_cert_upload"),
  idPictureUpload: text("id_picture_upload"),
  schoolIdUpload: text("school_id_upload"),
  goodMoralUpload: text("good_moral_upload"),
  conductRecordUpload: text("conduct_record_upload"),
  parentName: varchar("parent_name", { length: 255 }),
  parentRelationship: varchar("parent_relationship", { length: 100 }),
  parentContact: varchar("parent_contact", { length: 50 }),
  emergencyPerson: varchar("emergency_person", { length: 255 }),
  emergencyRelationship: varchar("emergency_relationship", { length: 100 }),
  emergencyContact: varchar("emergency_contact", { length: 50 }),
  status: varchar("status", { length: 50 }).default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const studentNeedsAssessment = pgTable("student_needs_assessment", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 100 }),
  schoolId: varchar("school_id", { length: 100 }),
  academicYear: varchar("academic_year", { length: 50 }),
  department: varchar("department", { length: 100 }),
  courseOrStrand: varchar("course_or_strand", { length: 255 }),
  fullName: varchar("full_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  contactNumber: varchar("contact_number", { length: 50 }),
  birthday: varchar("birthday", { length: 50 }),
  age: varchar("age", { length: 10 }),
  address: text("address"),
  academicDifficultSubjects: text("academic_difficult_subjects"),
  academicStudyHabits: text("academic_study_habits"),
  academicLearningDifficulties: text("academic_learning_difficulties"),
  academicConcerns: text("academic_concerns"),
  personalProblems: text("personal_problems"),
  personalAdjustment: text("personal_adjustment"),
  personalFamilyConcerns: text("personal_family_concerns"),
  emotionalStressLevel: varchar("emotional_stress_level", { length: 20 }),
  emotionalAnxiety: text("emotional_anxiety"),
  emotionalMotivation: text("emotional_motivation"),
  emotionalSelfConfidence: text("emotional_self_confidence"),
  socialClassmates: text("social_classmates"),
  socialFriendships: text("social_friendships"),
  socialCommunication: text("social_communication"),
  socialBullying: text("social_bullying"),
  financialAllowance: text("financial_allowance"),
  financialExpenses: text("financial_expenses"),
  financialScholarship: text("financial_scholarship"),
  careerGoal: text("career_goal"),
  careerUncertainty: text("career_uncertainty"),
  careerSkills: text("career_skills"),
  healthMedical: text("health_medical"),
  healthPhysicalLimitations: text("health_physical_limitations"),
  supportCounseling: boolean("support_counseling").default(false),
  supportAcademic: boolean("support_academic").default(false),
  supportScholarship: boolean("support_scholarship").default(false),
  supportCareer: boolean("support_career").default(false),
  supportOther: text("support_other"),
  otherConcerns: text("other_concerns"),
  status: varchar("status", { length: 50 }).default("submitted"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verificationCodes = pgTable("verification_codes", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  code: varchar("code", { length: 10 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const handbooksPillars = pgTable("handbooks_pillars", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  image: text("image"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
