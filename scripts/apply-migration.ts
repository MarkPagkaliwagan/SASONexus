import "dotenv/config";
import postgres from "postgres";
import fs from "fs";
import path from "path";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

  const migrationFile = path.join(process.cwd(), "drizzle", "0001_purple_turbo.sql");
  const migrationSql = fs.readFileSync(migrationFile, "utf-8");

  const statements = migrationSql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    console.log("Executing:", stmt.substring(0, 80) + "...");
    await sql.unsafe(stmt);
    console.log("Done.");
  }

  console.log("Migration applied successfully!");
  await sql.end();
}

main().catch(console.error);
