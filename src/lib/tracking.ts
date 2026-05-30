import { getDb } from "./db";
import { cpa_clicks } from "@/db/schema";

interface TrackClickParams {
  offer_id: string;
  page_slug: string;
  region_id: string | null;
  sub_id: string;
  ua: string;
  ref: string;
}

export async function trackClick(params: TrackClickParams): Promise<void> {
  const db = getDb();
  if (!db) return;

  try {
    await db.insert(cpa_clicks).values({
      id: crypto.randomUUID(),
      offer_id: params.offer_id,
      page_slug: params.page_slug,
      region_id: params.region_id,
      sub_id: params.sub_id,
      ua: params.ua,
      ref: params.ref,
      clicked_at: new Date(),
    });
  } catch {
    // 클릭 추적 실패는 사용자 경험에 영향 없이 무시
  }
}

export function buildSubId(
  page_slug: string,
  region_id: string | null,
): string {
  const regionPart = region_id ?? "national";
  const randomPart = crypto.randomUUID().slice(0, 6);
  return `${page_slug}__${regionPart}__${randomPart}`;
}
