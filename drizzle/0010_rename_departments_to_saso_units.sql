ALTER TABLE positions RENAME COLUMN department_id TO unit_id;
--> statement-breakpoint
ALTER TABLE staff_accounts RENAME COLUMN department_id TO unit_id;
--> statement-breakpoint
ALTER TABLE departments RENAME TO saso_units;
