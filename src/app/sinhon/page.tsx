import type { Metadata } from "next";
import Link from "next/link";
import regionsData from "@/data/seed/regions.json";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "신혼 생활 | 주거·통계·생활 지원 가이드",
  description:
    "지역별 신혼부부 주거 지원, 소득·자가 보유 통계, 생활 지원 정보를 한 화면에서 확인합니다.",
  alternates: { canonical: "/sinhon" },
};

const focusCards = [
  {
    title: "신혼 주거 지원",
    desc: "전세자금, 월세, 주택 관련 지원 항목을 지역별로 모읍니다.",
  },
  {
    title: "지역 통계 비교",
    desc: "신혼부부 소득, 자가 보유, 맞벌이 비율을 지역 판단 보조 지표로 봅니다.",
  },
  {
    title: "생활 준비 체크",
    desc: "주거, 세금, 금융 정보를 과장 없이 확인할 수 있는 흐름으로 정리합니다.",
  },
];

export default function SinhonPage() {
  const regions = regionsData.filter((region) => region.tier <= 2).slice(0, 15);

  return (
    <article className="mx-auto max-w-5xl px-5 py-8">
      <section className="rounded-2xl border border-[var(--sage-300)] bg-[linear-gradient(135deg,var(--sage-100)_0%,#D7EFC9_100%)] p-7 shadow-[var(--shadow-md)]">
        <p className="text-xs font-bold uppercase text-[var(--sage-500)]">
          Newlywed Life
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-tight text-[var(--text-strong)]">
          신혼 생활 정보
        </h1>
        <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--text-default)]">
          신혼부부 주거 지원, 지역 통계, 생활 준비 체크포인트를 지역 단위로
          정리합니다. 금융·법률 판단은 공식 기관 확인을 전제로 안내합니다.
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
          <p className="text-xs font-bold uppercase text-[var(--sage-500)]">
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
              href={`/sinhon/${region.id}`}
              className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--sage-300)] hover:shadow-[var(--shadow-md)]"
            >
              <p className="text-xs font-semibold text-[var(--text-caption)]">
                {region.sido}
              </p>
              <h3 className="mt-1 font-bold text-[var(--text-strong)]">
                {region.name}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                주거·통계 정보 보기
              </p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
