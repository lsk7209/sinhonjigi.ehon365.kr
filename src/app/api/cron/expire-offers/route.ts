import { getDb } from "@/lib/db";
import { cpa_offers } from "@/db/schema";
import { eq, and, lte, isNotNull } from "drizzle-orm";

export async function GET(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) return Response.json({ skipped: true });

  const now = new Date();
  const result = await db
    .update(cpa_offers)
    .set({ status: "expired" })
    .where(
      and(
        eq(cpa_offers.status, "active"),
        isNotNull(cpa_offers.end_date),
        lte(cpa_offers.end_date, now),
      ),
    );

  return Response.json({ ok: true, updated: result });
}
