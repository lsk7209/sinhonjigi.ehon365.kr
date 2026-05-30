import type { Metadata } from "next";
import Link from "next/link";
import { and, eq, isNull } from "drizzle-orm";
import SubsidyCard from "@/components/content/SubsidyCard";
import { subsidies } from "@/db/schema";
import regionsData from "@/data/seed/regions.json";
import seedSubsidies from "@/data/seed/jicha-subsidies.json";
import { getDb } from "@/lib/db";
import type { Subsidy } from "@/types";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "결혼·신혼 지원금 | 전국·지역별 혜택 안내",
  description:
    "전국 공통 결혼 지원금, 신혼부부 전세자금 대출, 지역별 축하금과 주거 지원을 공공데이터 기준으로 정리합니다.",
  alternates: { canonical: "/jiwon" },
};

const focusCards = [
  {
    title: "전국 공통 혜택",
    desc: "전세자금, 디딤돌, 증여세 공제처럼 지역과 함께 확인해야 하는 기본 항목입니다.",
  },
  {
    title: "지역별 지원금",
    desc: "혼인신고, 거주 기간, 소득 조건에 따라 지자체별 축하금과 주거 지원이 달라집니다.",
  },
  {
    title: "신청 전 체크",
    desc: "중복 제한, 신청 기한, 공식 공고 출처를 분리해 실제 신청 전에 확인합니다.",
  },
];

function toSubsidies(rows: typeof seedSubsidies): Subsidy[] {
  return rows.map((row) => ({
    ...row,
    effective_from: row.effective_from ? new Date(row.effective_from) : null,
    effective_to: row.effective_to ? new Date(row.effective_to) : null,
    last_verified_at: row.last_verified_at ? new Date(row.last_verified_at) : null,
  })) as Subsidy[];
}

async function getNationalSubsidies(): Promise<Subsidy[]> {
  const fallback = toSubsidies(seedSubsidies)
    .filter((subsidy) => subsidy.region_id === null && subsidy.status === "active")
    .slice(0, 6);

  const db = getDb();
  if (!db) return fallback;

  try {
    const rows = await db
      .select()
      .from(subsidies)
      .where(and(eq(subsidies.status, "active"), isNull(subsidies.region_id)))
      .limit(6);

    return rows.length > 0 ? (rows as Subsidy[]) : fallback;
  } catch {
    return fallback;
  }
}

export default async function JiwonPage() {
  const nationalSubsidies = await getNationalSubsidies();
  const tierOneRegions = regionsData.filter((region) => region.tier === 1);

  return (
    <article className="mx-auto max-w-5xl px-5 py-8">
      <section className="rounded-2xl border border-[var(--lav-200)] bg-[var(--gradient-hero)] p-7 shadow-[var(--shadow-md)]">
        <p className="text-xs font-bold uppercase text-[var(--lav-500)]">
          Benefits
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-tight text-[var(--text-strong)]">
          결혼·신혼 지원금 한눈에 보기
        </h1>
        <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--text-default)]">
          전국 공통 신혼부부 주거 지원과 지역별 결혼 축하금, 대출, 세제 혜택을
          신청 흐름에 맞춰 정리합니다. 실제 신청 전에는 공식 기관 공고를 함께
          확인하세요.
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
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-[var(--lav-500)]">
              National
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--text-strong)]">
              전국 공통 지원금·대출
            </h2>
          </div>
          <Link href="/sinhon" className="text-sm font-semibold text-[var(--lav-600)]">
            신혼 주거 정보 보기
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {nationalSubsidies.map((subsidy) => (
            <SubsidyCard key={subsidy.id} subsidy={subsidy} />
          ))}
        </div>
      </section>

      <section className="mt-9">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase text-[var(--lav-500)]">
            Regions
          </p>
          <h2 className="mt-1 text-xl font-bold text-[var(--text-strong)]">
            지역별 지원금 선택
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            우선 구축 지역부터 지원 항목, 인구 규모, 지역 등급을 함께 확인할 수
            있습니다.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tierOneRegions.map((region) => (
            <Link
              key={region.id}
              href={`/jiwon/${region.id}`}
              className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--lav-200)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-[var(--text-caption)]">
                  {region.sido}
                </p>
                <span className="rounded-full bg-[var(--lav-50)] px-2.5 py-1 text-xs font-bold text-[var(--lav-600)]">
                  T{region.tier}
                </span>
              </div>
              <h3 className="mt-2 font-bold text-[var(--text-strong)]">
                {region.name}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                지원금·신혼 혜택 보기
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-9 rounded-2xl border border-[var(--lav-100)] bg-white p-5 shadow-[var(--shadow-sm)]">
        <h2 className="text-xl font-bold text-[var(--text-strong)]">
          신청 전 확인할 것
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["신청 기한", "혼인신고일, 전입일, 출생일 기준 기한이 서로 다릅니다."],
            ["중복 제한", "전국 공통과 지자체 사업은 중복 가능 여부를 따로 봐야 합니다."],
            ["공식 출처", "금액과 조건은 기관 공고 변경에 따라 달라질 수 있습니다."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl bg-[var(--bg-soft)] p-4">
              <p className="font-bold text-[var(--text-strong)]">{title}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
