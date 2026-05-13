import "dotenv/config";
import postgres from "postgres";

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  await client.unsafe(`ALTER TABLE "personnel" ALTER COLUMN "unit_id" DROP NOT NULL;`);
  console.log("unit_id is now nullable");
  await client.end();
}

main().catch(console.error);
