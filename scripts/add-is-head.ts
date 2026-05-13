import "dotenv/config";
import postgres from "postgres";

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  await client.unsafe(`ALTER TABLE "personnel" ADD COLUMN IF NOT EXISTS "is_head" boolean DEFAULT false NOT NULL;`);
  console.log("Column is_head added to personnel table");
  await client.end();
}

main().catch(console.error);
