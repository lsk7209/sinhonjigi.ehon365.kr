import { getIndexNowKey } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

export function GET() {
  const key = getIndexNowKey();

  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
