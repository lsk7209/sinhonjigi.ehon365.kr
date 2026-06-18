import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createClient } from "@libsql/client";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const seedPath = path.join(root, "src", "data", "seed", "regions.json");

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("TURSO_DATABASE_URL is required");
}

const client = createClient({ url, authToken });
const rows = JSON.parse(await readFile(seedPath, "utf8"));

for (const row of rows) {
  await client.execute({
    sql: `
      insert into regions (id, sido, sigungu, name, tier, population, lat, lng, created_at)
      values (?, ?, ?, ?, ?, ?, ?, ?, ?)
      on conflict(id) do update set
        sido = excluded.sido,
        sigungu = excluded.sigungu,
        name = excluded.name,
        tier = excluded.tier,
        population = excluded.population,
        lat = excluded.lat,
        lng = excluded.lng
    `,
    args: [
      row.id,
      row.sido,
      row.sigungu ?? null,
      row.name,
      row.tier,
      row.population ?? null,
      row.lat ?? null,
      row.lng ?? null,
      null,
    ],
  });
}

const total = await client.execute("select count(*) as count from regions");

console.log(
  JSON.stringify(
    {
      seedRows: rows.length,
      upserted: rows.length,
      totalRegions: Number(total.rows[0].count),
    },
    null,
    2,
  ),
);
