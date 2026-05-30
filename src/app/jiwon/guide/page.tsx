import type { Metadata } from "next";
import GuideIndex from "@/components/content/GuideIndex";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "지원금 가이드",
  description: "결혼·신혼 지원금, 대출, 세제 혜택을 신청 흐름에 맞춰 정리한 가이드입니다.",
  alternates: { canonical: "/jiwon/guide" },
};

export default function JiwonGuidePage() {
  return <GuideIndex section="jiwon" />;
}
