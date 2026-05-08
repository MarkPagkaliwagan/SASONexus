CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"pre_admission_id" integer NOT NULL,
	"student_id" varchar(50),
	"family_name" varchar(255) NOT NULL,
	"given_name" varchar(255) NOT NULL,
	"middle_name" varchar(255),
	"application_level" varchar(255) NOT NULL,
	"grade_level" varchar(255),
	"gender" varchar(50) NOT NULL,
	"birth_date" varchar(50) NOT NULL,
	"mobile_no" varchar(50),
	"email" varchar(255),
	"picture_url" text,
	"status" varchar(50) DEFAULT 'enrolled' NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_pre_admission_id_pre_admissions_id_fk" FOREIGN KEY ("pre_admission_id") REFERENCES "public"."pre_admissions"("id") ON DELETE cascade ON UPDATE no action;