import "dotenv/config";
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
  await sql.unsafe(`ALTER TABLE "staff_accounts" ADD COLUMN "avatar_url" text;`);
  console.log("Column added");
  await sql.end();
}

main().catch(console.error);
