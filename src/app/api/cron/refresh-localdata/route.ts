import { getDb } from "@/lib/db";
import {
  fetchLocaldataWeddingRows,
  ingestWeddingHallRows,
} from "@/lib/localdata-wedding";

export async function GET(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) return Response.json({ skipped: true, reason: "Database is not configured" });

  try {
    const url = new URL(req.url);
    const rows = await fetchLocaldataWeddingRows({
      from: url.searchParams.get("from") ?? undefined,
      to: url.searchParams.get("to") ?? undefined,
      apiTypeCode: url.searchParams.get("apiTypeCode") ?? undefined,
    });
    const result = await ingestWeddingHallRows(db, rows);
    return Response.json({ ok: true, mode: "public-data-api", ...result });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown LOCALDATA error",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) return Response.json({ skipped: true, reason: "Database is not configured" });

  const body = (await req.json().catch(() => null)) as { rows?: Record<string, unknown>[] } | null;
  const rows = body?.rows;
  if (!Array.isArray(rows)) {
    return Response.json({ error: "Expected JSON body: { rows: [...] }" }, { status: 400 });
  }

  const result = await ingestWeddingHallRows(db, rows);
  return Response.json({ ok: true, mode: "uploaded-rows", ...result });
}
