require("dotenv").config();
const postgres = require("postgres");
const sql = postgres(process.env.DATABASE_URL, { prepare: false });

(async function () {
  try {
    const schedules = await sql.unsafe("SELECT * FROM admission_schedules ORDER BY id");
    console.log("=== All Schedules ===");
    schedules.forEach((s) => {
      console.log(`ID: ${s.id} | Level: ${s.level} | Slots: ${s.available_slots}/${s.max_slots} | Available: ${s.is_available}`);
    });

    const preAdmissions = await sql.unsafe("SELECT id, preferred_schedule, status, application_level FROM pre_admissions ORDER BY id");
    console.log("\n=== Pre-Admissions ===");
    preAdmissions.forEach((p) => {
      console.log(`ID: ${p.id} | Preferred Schedule: ${p.preferred_schedule} | Status: ${p.status} | Level: ${p.application_level}`);
    });

    process.exit(0);
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
})();
