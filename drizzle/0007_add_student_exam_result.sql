ALTER TABLE "students" ALTER COLUMN "status" SET DEFAULT 'took-exam';--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "exam_result" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "reschedule_date" varchar(255);