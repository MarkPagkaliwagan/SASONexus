CREATE TABLE IF NOT EXISTS "interview_schedules" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar(255) NOT NULL,
  "type" varchar(50) DEFAULT 'initial' NOT NULL,
  "date" varchar(50) NOT NULL,
  "time_start" varchar(50) NOT NULL,
  "time_end" varchar(50) NOT NULL,
  "slots" integer DEFAULT 1 NOT NULL,
  "booked" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
