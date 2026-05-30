import type { Metadata } from "next";
import GuideIndex from "@/components/content/GuideIndex";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "결혼식 가이드",
  description: "예식장 계약, 박람회 상담, 스드메 견적을 비교 기준 중심으로 정리한 가이드입니다.",
  alternates: { canonical: "/wedding/guide" },
};

export default function WeddingGuidePage() {
  return <GuideIndex section="wedding" />;
}
