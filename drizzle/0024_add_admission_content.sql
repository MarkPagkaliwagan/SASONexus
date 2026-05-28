CREATE TABLE IF NOT EXISTS "admission_content" (
  "id" serial PRIMARY KEY NOT NULL,
  "section" varchar(50) NOT NULL UNIQUE,
  "content" text NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
