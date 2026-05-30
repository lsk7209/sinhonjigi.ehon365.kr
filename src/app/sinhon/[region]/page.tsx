import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, isNull, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { newlywed_stats, regions, subsidies } from "@/db/schema";
import { computeConditionalFlags } from "@/lib/conditional-flags";
import ComparisonCards from "@/components/content/ComparisonCards";
import FAQList from "@/components/content/FAQList";
import SubsidyCard from "@/components/content/SubsidyCard";
import SourceAttribution from "@/components/content/SourceAttribution";
import AdDisclosure from "@/components/content/AdDisclosure";
import type { FaqItem, NewlywedStat, Region, Subsidy } from "@/types";
import regionsData from "@/data/seed/regions.json";

export const revalidate = 86400;

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  const db = getDb();
  if (!db) {
    return regionsData
      .filter((region) => region.tier <= 2)
      .map((region) => ({ region: region.id }));
  }

  try {
    const rows = await db.select({ id: regions.id }).from(regions);
    return rows.map((region) => ({ region: region.id }));
  } catch {
    return regionsData.map((region) => ({ region: region.id }));
  }
}

async function getPageData(regionId: string) {
  const db = getDb();
  const seedRegion = regionsData.find((region) => region.id === regionId);
  if (!seedRegion) return null;

  const fallback = {
    region: { ...seedRegion, created_at: null } as Region,
    housingSupports: [] as Subsidy[],
    newlywedStats: null as NewlywedStat | null,
  };

  if (!db) return fallback;

  try {
    const [regionRow] = await db
      .select()
      .from(regions)
      .where(eq(regions.id, regionId))
      .limit(1);

    if (!regionRow) return fallback;

    const [housingRows, statsRows] = await Promise.all([
      db
        .select()
        .from(subsidies)
        .where(
          and(
            eq(subsidies.status, "active"),
            eq(subsidies.category, "housing"),
            or(eq(subsidies.region_id, regionId), isNull(subsidies.region_id)),
          ),
        ),
      db
        .select()
        .from(newlywed_stats)
        .where(eq(newlywed_stats.region_id, regionId))
        .limit(1),
    ]);

    return {
      region: regionRow as Region,
      housingSupports: housingRows as Subsidy[],
      newlywedStats: (statsRows[0] as NewlywedStat) ?? null,
    };
  } catch {
    return fallback;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region: regionId } = await params;
  const seed = regionsData.find((region) => region.id === regionId);
  if (!seed) return {};

  return {
    title: `${seed.name} 신혼 생활 정보`,
    description: `${seed.name} 신혼부부 주거 지원, 소득·자가 보유 통계, 생활 준비 체크포인트를 정리했습니다.`,
    alternates: { canonical: `/sinhon/${regionId}` },
  };
}

function percent(value: number | null | undefined) {
  if (value === null || value === undefined) return "확인 필요";
  return `${Math.round(value * 100)}%`;
}

function won(value: number | null | undefined) {
  if (!value) return "확인 필요";
  return `${Math.round(value / 10000).toLocaleString()}만원`;
}

function buildFaqs(regionName: string): FaqItem[] {
  return [
    {
      question: `${regionName} 신혼부부 주거 지원은 어디서 확인하나요?`,
      answer:
        "전국 단위 사업은 주택도시기금과 LH·SH 등 공공기관, 지역 사업은 지자체 공고에서 확인하는 것이 기본입니다.",
    },
    {
      question: "소득 통계는 대출 가능성을 뜻하나요?",
      answer:
        "아닙니다. 통계는 지역 상황을 보는 보조 지표일 뿐이며, 실제 대출 가능 여부는 개인 소득, 자산, 주택 조건, 보증 기준으로 별도 심사됩니다.",
    },
    {
      question: "자가 보유율은 어떻게 해석해야 하나요?",
      answer:
        "자가 보유율이 낮은 지역은 전월세 수요가 상대적으로 클 수 있다는 참고 신호로 볼 수 있습니다. 개별 주거 선택은 예산과 통근 조건을 함께 봐야 합니다.",
    },
  ];
}

export default async function SinhonRegionPage({ params }: Props) {
  const { region: regionId } = await params;
  const data = await getPageData(regionId);
  if (!data) notFound();

  const { region, housingSupports, newlywedStats } = data;
  const flags = computeConditionalFlags({
    subsidies: housingSupports,
    newlywed_stats: newlywedStats,
    wedding_halls: [],
    population: region.population,
    tier: region.tier,
  });

  const faqs = buildFaqs(region.name);
  const comparisonItems = [
    {
      label: "주거 지원 항목",
      value: `${housingSupports.length}건`,
      note: housingSupports.length > 0 ? "지역 및 전국 공통 포함" : "DB 연결 후 자동 표시",
    },
    {
      label: "평균 소득",
      value: won(newlywedStats?.avg_income_won),
      note: "신혼부부 통계",
    },
    {
      label: "자가 보유율",
      value: percent(newlywedStats?.homeowner_ratio),
      note: "KOSIS 기반 보조 지표",
    },
    {
      label: "맞벌이 비율",
      value: percent(newlywedStats?.dual_income_ratio),
      note: "생활비 판단 참고",
    },
  ];

  const sources = [
    { name: "주택도시기금", url: "https://nhuf.molit.go.kr" },
    { name: "KOSIS", url: "https://kosis.kr" },
    { name: "보조금24", url: "https://www.bojo24.go.kr" },
  ];

  return (
    <article className="mx-auto max-w-5xl px-5 py-8">
      <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--text-caption)]">
        <Link href="/sinhon" className="font-bold text-[var(--sage-500)]">
          신혼 생활
        </Link>
        <span>/</span>
        <span>{region.name}</span>
      </nav>

      <section className="rounded-2xl border border-[var(--sage-300)] bg-[linear-gradient(135deg,var(--sage-100)_0%,#D7EFC9_100%)] p-7 shadow-[var(--shadow-md)]">
        <p className="text-xs font-bold uppercase text-[var(--sage-500)]">
          Newlywed Region
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-tight text-[var(--text-strong)]">
          {region.name} 신혼 생활 정보
        </h1>
        <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--text-default)]">
          {region.name}의 신혼부부 주거 지원과 지역 통계를 함께 확인할 수
          있도록 정리했습니다.
        </p>
      </section>

      {(flags.lowHomeownerRatio || flags.highDualIncome || flags.noStatsData) && (
        <section className="mt-5 space-y-2">
          {flags.lowHomeownerRatio && (
            <p className="rounded-2xl border border-[var(--sage-300)] bg-[var(--sage-100)] px-4 py-3 text-sm font-semibold text-[var(--text-strong)]">
              자가 보유율이 낮은 지역으로 표시되어 주거 지원 항목을 먼저
              확인하는 편이 좋습니다.
            </p>
          )}
          {flags.highDualIncome && (
            <p className="rounded-2xl border border-[var(--lav-200)] bg-[var(--lav-50)] px-4 py-3 text-sm font-semibold text-[var(--lav-700)]">
              맞벌이 비율이 높은 지역입니다. 소득 기준이 있는 지원은 부부 합산
              조건을 함께 확인하세요.
            </p>
          )}
          {flags.noStatsData && (
            <p className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]">
              아직 지역 통계가 연결되지 않았습니다. 주거 지원 항목과 공식 기관
              공고를 우선 확인하세요.
            </p>
          )}
        </section>
      )}

      <div className="mt-8">
        <ComparisonCards title="신혼 생활 판단 지표" items={comparisonItems} />
      </div>

      <section className="mt-9">
        <h2 className="text-xl font-bold text-[var(--text-strong)]">
          주거 지원 항목
        </h2>
        {housingSupports.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {housingSupports.map((support) => (
              <SubsidyCard key={support.id} subsidy={support} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <h3 className="text-base font-bold text-[var(--text-strong)]">
              주거 지원 데이터 연결 대기 중입니다
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              시드 데이터와 DB 적재가 끝나면 전세자금, 월세, 주택 관련 지원이
              자동으로 표시됩니다.
            </p>
          </div>
        )}
      </section>

      <section className="mt-9 rounded-2xl border border-[var(--sage-300)] bg-white p-5 shadow-[var(--shadow-sm)]">
        <h2 className="text-xl font-bold text-[var(--text-strong)]">
          신혼 생활 체크포인트
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["주거 예산", "보증금, 월세, 관리비, 이사비를 한 번에 계산합니다."],
            ["지원 조건", "혼인 기간, 소득, 자산, 무주택 조건을 분리해 봅니다."],
            ["생활권", "통근 시간, 병원, 교통, 가족 방문 동선을 함께 확인합니다."],
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

      <div className="mt-9">
        <FAQList faqs={faqs} />
      </div>

      <div className="mt-9 space-y-4">
        <SourceAttribution sources={sources} />
        <AdDisclosure />
      </div>
    </article>
  );
}
