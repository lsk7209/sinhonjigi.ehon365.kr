import { getDb } from "@/lib/db";
import { cpa_offers, cpa_clicks } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = getDb();

  if (!db) {
    return Response.redirect(new URL("/", req.url), 302);
  }

  const [offer] = await db
    .select()
    .from(cpa_offers)
    .where(and(eq(cpa_offers.id, id), eq(cpa_offers.status, "active")))
    .limit(1);

  if (!offer) {
    return Response.redirect(new URL("/", req.url), 302);
  }

  const url = new URL(req.url);
  const page_slug = url.searchParams.get("slug") ?? "unknown";
  const region_id = url.searchParams.get("region") ?? null;

  const sub_id = `${page_slug}__${region_id}__${crypto.randomUUID().slice(0, 8)}`;

  // 비동기 클릭 로그 (응답 지연 없음)
  db.insert(cpa_clicks)
    .values({
      id: crypto.randomUUID(),
      offer_id: offer.id,
      page_slug,
      region_id,
      sub_id,
      ua: req.headers.get("user-agent"),
      ref: req.headers.get("referer"),
      clicked_at: new Date(),
    })
    .catch(() => {});

  const target = new URL(offer.landing_url);
  if (offer.sub_id_param) {
    target.searchParams.set(offer.sub_id_param, sub_id);
  }

  return Response.redirect(target.toString(), 302);
}
