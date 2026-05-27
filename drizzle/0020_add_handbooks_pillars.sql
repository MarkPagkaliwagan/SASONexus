CREATE TABLE IF NOT EXISTS "handbooks_pillars" (
  "id" serial PRIMARY KEY NOT NULL,
  "type" varchar(20) NOT NULL,
  "title" varchar(255) NOT NULL,
  "content" text NOT NULL,
  "sort_order" integer default 0,
  "created_at" timestamp default now() not null,
  "updated_at" timestamp default now() not null
);
