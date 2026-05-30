import type { Metadata } from "next";
import GuideIndex from "@/components/content/GuideIndex";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "신혼 생활 가이드",
  description: "신혼 주거, 생활비, 전입과 서류, 청약 준비를 실전 기준으로 정리한 가이드입니다.",
  alternates: { canonical: "/sinhon/guide" },
};

export default function SinhonGuidePage() {
  return <GuideIndex section="sinhon" />;
}
