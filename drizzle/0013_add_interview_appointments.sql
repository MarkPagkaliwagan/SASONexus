CREATE TABLE IF NOT EXISTS "interview_appointments" (
  "id" serial PRIMARY KEY NOT NULL,
  "schedule_id" integer NOT NULL REFERENCES "interview_schedules"("id") ON DELETE CASCADE,
  "interview_type" varchar(50) DEFAULT 'initial' NOT NULL,
  "student_type" varchar(100),
  "academic_level" varchar(100),
  "full_name" varchar(255) NOT NULL,
  "student_id" varchar(100),
  "email" varchar(255),
  "contact" varchar(100),
  "grade_level" varchar(100),
  "strand" varchar(255),
  "section" varchar(255),
  "department" varchar(255),
  "course" varchar(255),
  "status" varchar(50) DEFAULT 'pending' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
