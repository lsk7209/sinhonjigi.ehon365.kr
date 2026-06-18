import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createClient } from "@libsql/client";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const seedPath = path.join(root, "src", "data", "seed", "wedding-halls.curated.json");

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("TURSO_DATABASE_URL is required");
}

const client = createClient({ url, authToken });
const rows = JSON.parse(await readFile(seedPath, "utf8"));

const regionRows = await client.execute("select id from regions");
const regionIds = new Set(regionRows.rows.map((row) => row.id));

let inserted = 0;
let skipped = 0;
const skippedRegions = new Set();

for (const row of rows) {
  if (!regionIds.has(row.region_id)) {
    skipped += 1;
    skippedRegions.add(row.region_id);
    continue;
  }

  await client.execute({
    sql: `
      insert into wedding_halls (id, region_id, name, address, status, permit_date)
      values (?, ?, ?, ?, ?, ?)
      on conflict(id) do update set
        region_id = excluded.region_id,
        name = excluded.name,
        address = excluded.address,
        status = excluded.status,
        permit_date = excluded.permit_date
    `,
    args: [
      row.id,
      row.region_id,
      row.name,
      row.address ?? null,
      row.status ?? null,
      row.permit_date ?? null,
    ],
  });
  inserted += 1;
}

const total = await client.execute("select count(*) as count from wedding_halls");

console.log(
  JSON.stringify(
    {
      seedRows: rows.length,
      upserted: inserted,
      skipped,
      skippedRegions: [...skippedRegions],
      totalWeddingHalls: Number(total.rows[0].count),
    },
    null,
    2,
  ),
);
