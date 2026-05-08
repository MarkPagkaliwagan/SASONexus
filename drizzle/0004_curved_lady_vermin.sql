CREATE TABLE "academic_years" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" varchar(20) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "academic_years_year_unique" UNIQUE("year")
);
--> statement-breakpoint
CREATE TABLE "admission_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" varchar(50) NOT NULL,
	"date" varchar(50),
	"time" varchar(50),
	"max_slots" integer DEFAULT 30 NOT NULL,
	"available_slots" integer DEFAULT 30 NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "college_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "semesters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"academic_year_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shs_strands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "semesters" ADD CONSTRAINT "semesters_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE cascade ON UPDATE no action;