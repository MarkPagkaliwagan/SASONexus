CREATE TABLE IF NOT EXISTS "document_claims" (
  "id" serial PRIMARY KEY,
  "type" varchar(20) NOT NULL,
  "or_number" varchar(100) NOT NULL,
  "full_name" varchar(255) NOT NULL,
  "academic_year" varchar(50),
  "department" varchar(100),
  "course" varchar(255),
  "strand" varchar(255),
  "level" varchar(100),
  "pillar_year" varchar(50),
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_document_claims_type_or" ON "document_claims" ("type", "or_number");
