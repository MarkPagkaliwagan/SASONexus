CREATE TABLE IF NOT EXISTS "personnel" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(255) NOT NULL,
  "position" varchar(255),
  "email" varchar(255),
  "contact" varchar(100),
  "avatar_url" text,
  "unit_id" integer NOT NULL REFERENCES "saso_units"("id") ON DELETE CASCADE,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
