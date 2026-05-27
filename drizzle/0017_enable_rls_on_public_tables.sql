-- Enable RLS on public tables and create policies
-- This prevents unauthorized access via Supabase Data API (anon key)

-- users: dead table, no policies = deny all
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- college_departments: public read, admin writes via direct DB
ALTER TABLE "college_departments" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON "college_departments";
CREATE POLICY "Enable read access for all users" ON "college_departments"
  FOR SELECT USING (true);

-- shs_strands: public read, admin writes via direct DB
ALTER TABLE "shs_strands" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON "shs_strands";
CREATE POLICY "Enable read access for all users" ON "shs_strands"
  FOR SELECT USING (true);

-- academic_years: public read, admin writes via direct DB
ALTER TABLE "academic_years" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON "academic_years";
CREATE POLICY "Enable read access for all users" ON "academic_years"
  FOR SELECT USING (true);
