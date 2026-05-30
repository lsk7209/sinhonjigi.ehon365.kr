import { getDb } from "./db";
import { cpa_offers } from "@/db/schema";
import { and, eq, or, isNull, desc, lte, gte } from "drizzle-orm";
import type { CpaOffer } from "@/types";

interface MatchParams {
  region_id: string;
  page_slug: string;
}

export async function matchOffers(params: MatchParams): Promise<CpaOffer[]> {
  const db = getDb();
  if (!db) return [];

  const now = new Date();

  // 지역 일치 + region_inferred(인근) + 전국(null) 오퍼 조합
  const results = await db
    .select()
    .from(cpa_offers)
    .where(
      and(
        eq(cpa_offers.status, "active"),
        or(
          eq(cpa_offers.region_id, params.region_id),
          isNull(cpa_offers.region_id),
        ),
        or(isNull(cpa_offers.start_date), lte(cpa_offers.start_date, now)),
        or(isNull(cpa_offers.end_date), gte(cpa_offers.end_date, now)),
      ),
    )
    .orderBy(desc(cpa_offers.priority))
    .limit(3);

  return results as CpaOffer[];
}
