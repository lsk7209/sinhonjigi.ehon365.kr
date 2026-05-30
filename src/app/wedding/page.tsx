import type { Metadata } from "next";
import Link from "next/link";
import regionsData from "@/data/seed/regions.json";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "결혼 정보 | 지역별 예식장·박람회 가이드",
  description:
    "지역별 결혼 준비 정보, 예식장 확인 포인트, 웨딩박람회 활용 기준을 공공데이터 기반으로 정리합니다.",
  alternates: { canonical: "/wedding" },
};

const focusCards = [
  {
    title: "지역별 예식장 현황",
    desc: "영업 중인 예식장, 최근 허가·폐업 흐름, 지역 규모를 함께 확인합니다.",
  },
  {
    title: "박람회 활용 기준",
    desc: "광고성 CTA는 표시를 분리하고, 비교가 필요한 항목만 안내합니다.",
  },
  {
    title: "계약 전 체크포인트",
    desc: "대관료, 식대, 보증 인원, 환불 조건처럼 계약 전에 볼 항목을 정리합니다.",
  },
];

export default function WeddingPage() {
  const regions = regionsData.filter((region) => region.tier <= 2).slice(0, 15);

  return (
    <article className="mx-auto max-w-5xl px-5 py-8">
      <section className="rounded-2xl border border-[var(--pink-200)] bg-[linear-gradient(135deg,#FFF1F2_0%,#FFE4E6_100%)] p-7 shadow-[var(--shadow-md)]">
        <p className="text-xs font-bold uppercase text-[var(--pink-400)]">
          Wedding
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-tight text-[var(--text-strong)]">
          지역별 결혼 준비 정보
        </h1>
        <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--text-default)]">
          예식장 현황, 박람회 확인 포인트, 계약 전 체크리스트를 지역 단위로
          정리합니다. 광고 링크는 본문 정보와 분리해 표시합니다.
        </p>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        {focusCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]"
          >
            <h2 className="text-base font-bold text-[var(--text-strong)]">
              {card.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {card.desc}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-9">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase text-[var(--pink-400)]">
            Regions
          </p>
          <h2 className="mt-1 text-xl font-bold text-[var(--text-strong)]">
            지역 선택
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((region) => (
            <Link
              key={region.id}
              href={`/wedding/${region.id}`}
              className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--pink-200)] hover:shadow-[var(--shadow-md)]"
            >
              <p className="text-xs font-semibold text-[var(--text-caption)]">
                {region.sido}
              </p>
              <h3 className="mt-1 font-bold text-[var(--text-strong)]">
                {region.name}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                예식장·박람회 정보 보기
              </p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
