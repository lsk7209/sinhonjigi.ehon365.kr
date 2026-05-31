import { getAllGuides, isGuidePublic } from "@/lib/guides";
import { absoluteUrl, escapeXml, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const feedTitle = "\uC2E0\uD63C\uC9C0\uAE30 \uBE14\uB85C\uADF8";
const feedDescription =
  "\uC9C0\uC6D0\uAE08, \uACB0\uD63C, \uC2E0\uD63C \uC0DD\uD65C \uC815\uBCF4\uB97C \uC815\uB9AC\uD558\uB294 \uC2E0\uD63C\uC9C0\uAE30 \uCD5C\uC2E0 \uAE00\uC785\uB2C8\uB2E4.";

export function GET() {
  const now = new Date();
  const feedUrl = absoluteUrl("/rss.xml");
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

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(feedDescription)}</description>
    <language>ko-KR</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
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
