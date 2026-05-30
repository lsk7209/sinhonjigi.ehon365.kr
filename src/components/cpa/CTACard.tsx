import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CpaOffer } from "@/types";

interface Props {
  offer: CpaOffer;
  page_slug: string;
  region_id: string | null;
  adLabel: "광고" | "제휴 광고";
}

const VERTICAL_LABEL: Record<string, string> = {
  fair: "웨딩박람회",
  sdm: "스드메",
  hall: "예식장",
  agency: "웨딩플래너",
  gift: "혼수",
  honeymoon: "신혼여행",
};

export default function CTACard({
  offer,
  page_slug,
  region_id,
  adLabel,
}: Props) {
  const goUrl = `/go/${offer.id}?slug=${encodeURIComponent(page_slug)}&region=${encodeURIComponent(region_id ?? "")}`;

  return (
    <Card className="border-blue-200 bg-blue-50/60">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="shrink-0 text-xs">
              {VERTICAL_LABEL[offer.vertical] ?? offer.vertical}
            </Badge>
            <Badge className="shrink-0 bg-yellow-100 text-xs text-yellow-800 hover:bg-yellow-100">
              [{adLabel}]
            </Badge>
          </div>
          <p className="mt-1 truncate font-medium text-gray-800">
            {offer.brand ?? offer.advertiser}
          </p>
        </div>
        <Link
          href={goUrl}
          className="shrink-0 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        >
          자세히 보기
        </Link>
      </CardContent>
    </Card>
  );
}
