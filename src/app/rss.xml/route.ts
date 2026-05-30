import { getAllGuides, isGuidePublic } from "@/lib/guides";
import { absoluteUrl, escapeXml, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export function GET() {
  const now = new Date();
  const items = getAllGuides()
    .filter((guide) => isGuidePublic(guide, now))
    .sort(
      (a, b) =>
        new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime(),
    )
    .slice(0, 50)
    .map((guide) => {
      const link = absoluteUrl(`/${guide.type}/guide/${guide.slug}`);
      return `
        <item>
          <title>${escapeXml(guide.title)}</title>
          <link>${escapeXml(link)}</link>
          <guid isPermaLink="true">${escapeXml(link)}</guid>
          <description>${escapeXml(guide.subtitle)}</description>
          <category>${escapeXml(guide.main_keyword)}</category>
          <pubDate>${new Date(guide.scheduled_at).toUTCString()}</pubDate>
        </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>신혼지기 블로그</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>지원금, 결혼식, 신혼 생활 정보를 정리한 신혼지기 최신 글입니다.</description>
    <language>ko-KR</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <ttl>300</ttl>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
