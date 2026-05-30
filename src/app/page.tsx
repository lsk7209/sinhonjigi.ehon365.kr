import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "신혼지기 — 결혼·신혼 정보의 모든 것",
  description:
    "공공데이터 기반 결혼 지원금, 신혼부부 혜택, 예식장, 웨딩박람회 정보를 지역별로 한눈에 확인하세요.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeClient />;
}
