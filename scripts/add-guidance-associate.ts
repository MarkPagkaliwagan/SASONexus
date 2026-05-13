import "dotenv/config";
import postgres from "postgres";

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });

  const units = await client.unsafe(`SELECT id, name FROM saso_units WHERE slug = 'guidance' LIMIT 1`);
  if (units.length === 0) {
    console.log("Guidance unit not found");
    await client.end();
    return;
  }

  const unitId = units[0].id;
  const existing = await client.unsafe(`SELECT id FROM positions WHERE name = 'Guidance Associate' AND unit_id = $1 LIMIT 1`, [unitId]);
  if (existing.length > 0) {
    console.log("Guidance Associate position already exists");
  } else {
    await client.unsafe(`INSERT INTO positions (name, unit_id) VALUES ('Guidance Associate', $1)`, [unitId]);
    console.log("Guidance Associate position added to Guidance Office");
  }

  await client.end();
}

main().catch(console.error);
