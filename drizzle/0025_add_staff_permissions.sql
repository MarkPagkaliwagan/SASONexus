ALTER TABLE "staff_accounts" DROP COLUMN "permissions";
ALTER TABLE "staff_accounts" ADD COLUMN "permissions" jsonb NOT NULL DEFAULT '[]'::jsonb;
