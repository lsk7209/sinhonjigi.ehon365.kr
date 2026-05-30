import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, isNull, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { marriage_stats, regions, subsidies } from "@/db/schema";
import { matchOffers } from "@/lib/cpa-matcher";
import { computeConditionalFlags } from "@/lib/conditional-flags";
import SubsidyCard from "@/components/content/SubsidyCard";
import ComparisonCards from "@/components/content/ComparisonCards";
import FAQList from "@/components/content/FAQList";
import CTACard from "@/components/cpa/CTACard";
import CTAFooter from "@/components/cpa/CTAFooter";
import SourceAttribution from "@/components/content/SourceAttribution";
import AdDisclosure from "@/components/content/AdDisclosure";
import type { FaqItem, MarriageStat, Region, Subsidy } from "@/types";
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
    subsidies: [] as Subsidy[],
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

    const [subsidyRows, statsRows, offers] = await Promise.all([
      db
        .select()
        .from(subsidies)
        .where(
          and(
            eq(subsidies.status, "active"),
            or(eq(subsidies.region_id, regionId), isNull(subsidies.region_id)),
          ),
        ),
      db
        .select()
        .from(marriage_stats)
        .where(eq(marriage_stats.region_id, regionId))
        .limit(1),
      matchOffers({ region_id: regionId, page_slug: `jiwon/${regionId}` }),
    ]);

    return {
      region: regionRow as Region,
      subsidies: subsidyRows as Subsidy[],
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
    title: `${seed.name} 결혼 지원금`,
    description: `${seed.name} 결혼 지원금, 신혼부부 혜택, 전세자금 대출 정보를 공공데이터 기준으로 정리했습니다.`,
    alternates: { canonical: `/jiwon/${regionId}` },
  };
}

function formatPopulation(population: number | null) {
  if (!population) return "확인 필요";
  return `${Math.round(population / 10000).toLocaleString()}만명`;
}

function buildFaqs(regionName: string): FaqItem[] {
  return [
    {
      question: `${regionName} 결혼 지원금은 어디에서 신청하나요?`,
      answer:
        "지원금마다 신청 기관이 다릅니다. 지자체 지원금은 주민센터나 구청 안내를 확인하고, 전세자금 대출은 주택도시기금 수탁은행에서 조건을 확인하는 흐름이 일반적입니다.",
    },
    {
      question: "전국 공통 지원과 지역 지원을 함께 받을 수 있나요?",
      answer:
        "사업별 중복 제한이 다릅니다. 전국 단위 대출, 세제 혜택, 지자체 축하금은 운영 기관이 달라 함께 검토할 수 있지만, 최종 가능 여부는 각 기관의 최신 공고로 확인해야 합니다.",
    },
    {
      question: "혼인신고 전에도 준비할 수 있는 항목이 있나요?",
      answer:
        "소득, 자산, 거주 기간, 혼인 예정 또는 혼인 후 기간 조건을 먼저 확인할 수 있습니다. 일부 사업은 혼인신고 후 일정 기간 안에만 신청할 수 있어 신청 기한을 함께 확인하는 편이 좋습니다.",
    },
  ];
}

export default async function JiwonRegionPage({ params }: Props) {
  const { region: regionId } = await params;
  const data = await getPageData(regionId);
  if (!data) notFound();

  const { region, subsidies: subsidyList, marriageStats, offers } = data;
  const flags = computeConditionalFlags({
    subsidies: subsidyList,
    newlywed_stats: null,
    wedding_halls: [],
    population: region.population,
    tier: region.tier,
  });

  const faqs = buildFaqs(region.name);
  const firstOffer = offers[0];
  const restOffers = offers.slice(1);
  const pageSlug = `jiwon/${regionId}`;

  const comparisonItems = [
    {
      label: "확인된 지원 항목",
      value: `${subsidyList.length}건`,
      note: subsidyList.length > 0 ? "지역 및 전국 공통 항목 포함" : "DB 연결 후 자동 표시",
    },
    {
      label: "지역 인구",
      value: formatPopulation(region.population),
      note: "지역 규모 참고 지표",
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
    { name: "보조금24", url: "https://www.bojo24.go.kr" },
    { name: "주택도시기금", url: "https://nhuf.molit.go.kr" },
    { name: "국세청", url: "https://www.nts.go.kr" },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: "/" },
      { "@type": "ListItem", position: 2, name: "지원금", item: "/jiwon" },
      {
        "@type": "ListItem",
        position: 3,
        name: region.name,
        item: `/jiwon/${regionId}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <article
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "24px 20px 56px",
        }}
      >
        <nav
          aria-label="breadcrumb"
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            color: "var(--text-caption)",
            fontSize: 13,
            marginBottom: 14,
          }}
        >
          <Link href="/jiwon" style={{ color: "var(--lav-600)", fontWeight: 700 }}>
            지원금
          </Link>
          <span>/</span>
          <span>{region.name}</span>
        </nav>

        <section
          style={{
            border: "1px solid var(--lav-200)",
            borderRadius: 20,
            background: "var(--gradient-hero)",
            boxShadow: "var(--shadow-md)",
            padding: "28px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[var(--lav-600)]">
              {region.sido}
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[var(--text-secondary)]">
              {formatPopulation(region.population)}
            </span>
            {flags.smallPopulation && (
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[var(--sage-500)]">
                인근 권역 함께 확인
              </span>
            )}
          </div>

          <h1 className="text-[28px] font-bold leading-tight text-[var(--text-strong)]">
            {region.name} 결혼·신혼 지원금
          </h1>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--text-default)]">
            공공데이터 기준으로 {region.name}에서 확인할 수 있는 결혼 지원금,
            신혼부부 주거 지원, 전국 공통 혜택을 한 화면에 정리했습니다.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {comparisonItems.slice(0, 3).map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-[var(--shadow-sm)]"
              >
                <p className="text-xs font-semibold text-[var(--text-secondary)]">
                  {item.label}
                </p>
                <p className="num mt-1 text-xl font-bold text-[var(--lav-600)]">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-[var(--text-caption)]">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        {(flags.urgentDeadline || flags.benefitsAboveAverage || flags.benefitsBelowAverage) && (
          <section className="mt-5 space-y-2">
            {flags.urgentDeadline && (
              <p className="rounded-2xl border border-[var(--pink-200)] bg-[var(--pink-50)] px-4 py-3 text-sm font-semibold text-[var(--text-strong)]">
                신청 마감이 가까운 항목이 있을 수 있습니다. 기관 공고의 접수
                기간을 먼저 확인하세요.
              </p>
            )}
            {flags.benefitsAboveAverage && (
              <p className="rounded-2xl border border-[var(--lav-200)] bg-[var(--lav-50)] px-4 py-3 text-sm font-semibold text-[var(--lav-700)]">
                이 지역은 확인된 지원 항목 수가 비교적 많은 편입니다.
              </p>
            )}
            {flags.benefitsBelowAverage && (
              <p className="rounded-2xl border border-[var(--sage-300)] bg-[var(--sage-100)] px-4 py-3 text-sm font-semibold text-[var(--text-strong)]">
                지역 항목이 적을 때는 전국 공통 신혼부부 주거 지원을 함께
                확인하는 편이 효율적입니다.
              </p>
            )}
          </section>
        )}

        <section className="mt-9">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-[var(--lav-500)]">
                Benefits
              </p>
              <h2 className="mt-1 text-xl font-bold text-[var(--text-strong)]">
                받을 수 있는 지원 항목
              </h2>
            </div>
            <Link
              href="/jiwon"
              className="text-sm font-semibold text-[var(--lav-600)]"
            >
              다른 지역 보기
            </Link>
          </div>

          {subsidyList.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {subsidyList.map((subsidy) => (
                <SubsidyCard key={subsidy.id} subsidy={subsidy} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <h3 className="text-base font-bold text-[var(--text-strong)]">
                데이터 연결 대기 중입니다
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                현재는 지역 기본 정보만 표시됩니다. Turso DB와 시드 데이터가
                연결되면 지역별 지원금 카드가 자동으로 채워집니다.
              </p>
            </div>
          )}
        </section>

        {firstOffer && (
          <section className="mt-7">
            <CTACard
              offer={firstOffer}
              page_slug={pageSlug}
              region_id={regionId}
              adLabel="광고"
            />
          </section>
        )}

        <div className="mt-9">
          <ComparisonCards title="지역 판단 지표" items={comparisonItems} />
        </div>

        <section className="mt-9 rounded-2xl border border-[var(--lav-100)] bg-white p-5 shadow-[var(--shadow-sm)]">
          <p className="text-xs font-bold uppercase text-[var(--lav-500)]">
            Checklist
          </p>
          <h2 className="mt-1 text-xl font-bold text-[var(--text-strong)]">
            신청 전 확인할 것
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["혼인 기준일", "혼인신고 전후 신청 가능 기간이 사업마다 다릅니다."],
              ["거주 요건", "신청자 또는 부부의 주민등록 기준을 확인하세요."],
              ["중복 제한", "대출, 축하금, 세제 혜택은 기관별 제한이 다릅니다."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl bg-[var(--bg-soft)] p-4 text-sm"
              >
                <p className="font-bold text-[var(--text-strong)]">{title}</p>
                <p className="mt-1 leading-6 text-[var(--text-secondary)]">{body}</p>
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
    </>
  );
}
