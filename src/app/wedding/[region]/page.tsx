import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { marriage_stats, regions, wedding_halls } from "@/db/schema";
import { matchOffers } from "@/lib/cpa-matcher";
import { computeConditionalFlags } from "@/lib/conditional-flags";
import ComparisonCards from "@/components/content/ComparisonCards";
import FAQList from "@/components/content/FAQList";
import CTACard from "@/components/cpa/CTACard";
import CTAFooter from "@/components/cpa/CTAFooter";
import SourceAttribution from "@/components/content/SourceAttribution";
import AdDisclosure from "@/components/content/AdDisclosure";
import type { FaqItem, MarriageStat, Region, WeddingHall } from "@/types";
import regionsData from "@/data/seed/regions.json";
import curatedWeddingHalls from "@/data/seed/wedding-halls.curated.json";

export const revalidate = 86400;

interface Props {
  params: Promise<{ region: string }>;
}

type CuratedWeddingHall = Omit<WeddingHall, "permit_date"> & {
  permit_date: string | null;
  source_name?: string;
  source_url?: string;
};

function getCuratedWeddingHalls(regionId: string): WeddingHall[] {
  return (curatedWeddingHalls as CuratedWeddingHall[])
    .filter((hall) => hall.region_id === regionId)
    .map((hall) => ({
      id: hall.id,
      region_id: hall.region_id,
      name: hall.name,
      address: hall.address,
      status: hall.status,
      permit_date: hall.permit_date ? new Date(hall.permit_date) : null,
    }));
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
  const curatedHalls = getCuratedWeddingHalls(regionId);

  const fallback = {
    region: { ...seedRegion, created_at: null } as Region,
    halls: curatedHalls,
    marriageStats: null as MarriageStat | null,
    offers: [],
  };

  if (!db) return fallback;

  try {
    const [regionRow] = await db
      .select()
      .from(regions)
      .where(eq(regions.id, regionId))
      .limit(1);

    if (!regionRow) return fallback;

    const [hallRows, statsRows, offers] = await Promise.all([
      db
        .select()
        .from(wedding_halls)
        .where(eq(wedding_halls.region_id, regionId))
        .limit(20),
      db
        .select()
        .from(marriage_stats)
        .where(eq(marriage_stats.region_id, regionId))
        .limit(1),
      matchOffers({ region_id: regionId, page_slug: `wedding/${regionId}` }),
    ]);

    return {
      region: regionRow as Region,
      halls: hallRows.length > 0 ? (hallRows as WeddingHall[]) : curatedHalls,
      marriageStats: (statsRows[0] as MarriageStat) ?? null,
      offers,
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
    title: `${seed.name} 결혼 정보`,
    description: `${seed.name} 예식장 현황, 웨딩박람회 활용 기준, 결혼 준비 체크포인트를 정리했습니다.`,
    alternates: { canonical: `/wedding/${regionId}` },
  };
}

function buildFaqs(regionName: string): FaqItem[] {
  return [
    {
      question: `${regionName} 예식장은 어떤 기준으로 비교해야 하나요?`,
      answer:
        "대관료, 식대, 보증 인원, 교통, 주차, 환불 조건을 같은 기준으로 놓고 비교하는 것이 좋습니다. 견적은 날짜와 시간대에 따라 달라질 수 있습니다.",
    },
    {
      question: "웨딩박람회는 언제 활용하는 편이 좋나요?",
      answer:
        "스튜디오, 드레스, 메이크업 또는 예식장 상담을 한 번에 비교하려는 경우 활용할 수 있습니다. 계약 전에는 포함 항목과 취소 조건을 별도로 확인하세요.",
    },
    {
      question: "지역 데이터가 없으면 어떻게 판단하나요?",
      answer:
        "현재 지역 데이터가 부족하면 인근 T1 지역의 박람회나 예식장 정보도 함께 확인하는 방식으로 보완합니다.",
    },
  ];
}

export default async function WeddingRegionPage({ params }: Props) {
  const { region: regionId } = await params;
  const data = await getPageData(regionId);
  if (!data) notFound();

  const { region, halls, marriageStats, offers } = data;
  const flags = computeConditionalFlags({
    subsidies: [],
    newlywed_stats: null,
    wedding_halls: halls,
    population: region.population,
    tier: region.tier,
    upcoming_fair: offers.some((offer) => offer.vertical === "fair"),
    nearby_fair: offers.length > 0,
  });

  const pageSlug = `wedding/${regionId}`;
  const firstOffer = offers[0];
  const restOffers = offers.slice(1);
  const activeHallCount = halls.filter((hall) => hall.status !== "폐업").length;
  const faqs = buildFaqs(region.name);

  const comparisonItems = [
    {
      label: "확인된 예식장",
      value: `${halls.length}곳`,
      note: halls.length > 0 ? "공공데이터포털 기준" : "DB 연결 후 자동 표시",
    },
    {
      label: "영업 추정",
      value: `${activeHallCount}곳`,
      note: "상태값이 폐업이 아닌 항목",
    },
    {
      label: "지역 등급",
      value: `T${region.tier}`,
      note: region.tier <= 2 ? "우선 구축 대상" : "확장 후보",
    },
    ...(marriageStats
      ? [
          {
            label: `${marriageStats.year}년 혼인 건수`,
            value: `${marriageStats.total_marriages?.toLocaleString() ?? "-"}건`,
            note: "KOSIS 혼인 통계",
          },
        ]
      : []),
  ];

  const sources = [
    { name: "공공데이터포털", url: "https://www.data.go.kr" },
    {
      name: "공식 사이트·검색 검수 seed",
      url: "https://www.google.com/search?q=%EC%98%88%EC%8B%9D%EC%9E%A5",
    },
    { name: "KOSIS", url: "https://kosis.kr" },
  ];

  return (
    <article className="mx-auto max-w-5xl px-5 py-8">
      <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--text-caption)]">
        <Link href="/wedding" className="font-bold text-[var(--pink-400)]">
          결혼 정보
        </Link>
        <span>/</span>
        <span>{region.name}</span>
      </nav>

      <section className="rounded-2xl border border-[var(--pink-200)] bg-[linear-gradient(135deg,#FFF1F2_0%,#FFE4E6_100%)] p-7 shadow-[var(--shadow-md)]">
        <p className="text-xs font-bold uppercase text-[var(--pink-400)]">
          Wedding Region
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-tight text-[var(--text-strong)]">
          {region.name} 결혼 준비 정보
        </h1>
        <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--text-default)]">
          {region.name}의 예식장 현황, 박람회 상담 CTA, 계약 전 체크포인트를
          지역 기준으로 정리했습니다.
        </p>
      </section>

      {(flags.t1WithUpcomingFair || flags.t2NeedNearbyFair || flags.noLocalFair) && (
        <section className="mt-5 space-y-2">
          {flags.t1WithUpcomingFair && (
            <p className="rounded-2xl border border-[var(--pink-200)] bg-[var(--pink-50)] px-4 py-3 text-sm font-semibold text-[var(--text-strong)]">
              이 지역과 연결된 박람회 상담 항목이 있습니다. 광고 표기를 확인한
              뒤 필요한 경우만 이동하세요.
            </p>
          )}
          {flags.t2NeedNearbyFair && (
            <p className="rounded-2xl border border-[var(--lav-200)] bg-[var(--lav-50)] px-4 py-3 text-sm font-semibold text-[var(--lav-700)]">
              지역 내 박람회 데이터가 부족하면 인근 대형 권역도 함께 확인하세요.
            </p>
          )}
          {flags.noLocalFair && (
            <p className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]">
              현재 표시 가능한 지역 박람회 데이터가 없습니다. 예식장 체크리스트를
              먼저 확인하세요.
            </p>
          )}
        </section>
      )}

      <div className="mt-8">
        <ComparisonCards title="지역 결혼 지표" items={comparisonItems} />
      </div>

      {halls.length > 0 ? (
        <section className="mt-9">
          <h2 className="text-xl font-bold text-[var(--text-strong)]">
            확인된 예식장
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {halls.map((hall) => (
              <div
                key={hall.id}
                className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]"
              >
                <p className="font-bold text-[var(--text-strong)]">{hall.name}</p>
                {hall.address && (
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    {hall.address}
                  </p>
                )}
                {hall.status && (
                  <p className="mt-3 text-xs font-semibold text-[var(--pink-400)]">
                    {hall.status}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-9 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <h2 className="text-base font-bold text-[var(--text-strong)]">
            예식장 데이터 연결 대기 중입니다
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            공공데이터포털 적재가 끝나면 지역별 예식장 목록과 영업 상태가 자동으로
            표시됩니다.
          </p>
        </section>
      )}

      {firstOffer && (
        <section className="mt-8">
          <CTACard
            offer={firstOffer}
            page_slug={pageSlug}
            region_id={regionId}
            adLabel="광고"
          />
        </section>
      )}

      <section className="mt-9 rounded-2xl border border-[var(--pink-100)] bg-white p-5 shadow-[var(--shadow-sm)]">
        <h2 className="text-xl font-bold text-[var(--text-strong)]">
          계약 전 체크포인트
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["견적 범위", "식대, 대관료, 필수 옵션 포함 여부를 분리해 확인합니다."],
            ["보증 인원", "최소 보증 인원과 초과 인원 정산 방식을 확인합니다."],
            ["취소 조건", "계약금, 일정 변경, 환불 기준을 문서로 남깁니다."],
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

      <div className="mt-9">
        <CTAFooter offers={restOffers} page_slug={pageSlug} region_id={regionId} />
      </div>

      <div className="mt-9 space-y-4">
        <SourceAttribution sources={sources} />
        <AdDisclosure />
      </div>
    </article>
  );
}
