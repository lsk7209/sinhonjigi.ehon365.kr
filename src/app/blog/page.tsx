import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllGuides,
  GUIDE_SECTION_LABEL,
  isGuidePublic,
  type GuideArticle,
} from "@/lib/guides";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "블로그 | 신혼지기",
  description:
    "신혼지기의 지원금, 결혼식, 신혼 생활 공개 가이드를 한곳에서 모아봅니다.",
  alternates: { canonical: "/blog" },
};

const sectionStyles = {
  jiwon: {
    label: "지원금",
    color: "var(--lav-600)",
    bg: "var(--lav-50)",
    border: "var(--lav-200)",
  },
  wedding: {
    label: "결혼식",
    color: "var(--pink-400)",
    bg: "var(--pink-50)",
    border: "var(--pink-200)",
  },
  sinhon: {
    label: "신혼 생활",
    color: "var(--sage-500)",
    bg: "var(--sage-100)",
    border: "var(--sage-300)",
  },
} as const;

export default function BlogPage() {
  const visibleGuides = getAllGuides()
    .filter((guide) => isGuidePublic(guide))
    .slice(0, 100);

  return (
    <article className="mx-auto max-w-5xl px-5 py-8">
      <section
        style={{
          border: "1px solid var(--lav-200)",
          borderRadius: 24,
          background: "var(--gradient-hero)",
          padding: "32px",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <p
          style={{
            color: "var(--lav-600)",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 0,
            textTransform: "uppercase",
          }}
        >
          Blog
        </p>
        <h1
          style={{
            marginTop: 8,
            color: "var(--text-strong)",
            fontSize: 32,
            fontWeight: 850,
            letterSpacing: 0,
            lineHeight: 1.22,
          }}
        >
          신혼 준비 글 모아보기
        </h1>
        <p
          style={{
            marginTop: 12,
            maxWidth: 720,
            color: "var(--text-default)",
            fontSize: 16,
            lineHeight: 1.75,
          }}
        >
          지원금, 결혼식, 신혼 생활 가이드를 한곳에서 확인할 수 있습니다.
          공개 시간이 지난 글만 블로그와 피드에 표시됩니다.
        </p>
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          }}
        >
          <StatCard label="공개 글" value={visibleGuides.length} />
        </div>
      </section>

      <section
        style={{
          marginTop: 28,
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        {(["jiwon", "wedding", "sinhon"] as const).map((section) => (
          <Link
            key={section}
            href={`/${section}/guide`}
            style={{
              border: `1px solid ${sectionStyles[section].border}`,
              borderRadius: 18,
              background: "var(--bg-card)",
              padding: 18,
              boxShadow: "var(--shadow-sm)",
              textDecoration: "none",
            }}
          >
            <p
              style={{
                color: sectionStyles[section].color,
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {sectionStyles[section].label}
            </p>
            <h2
              style={{
                marginTop: 4,
                color: "var(--text-strong)",
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              {GUIDE_SECTION_LABEL[section]}
            </h2>
            <p
              style={{
                marginTop: 6,
                color: "var(--text-secondary)",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              섹션별 공개 글을 확인합니다.
            </p>
          </Link>
        ))}
      </section>

      <section style={{ marginTop: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 14,
          }}
        >
          <div>
            <p
              style={{
                color: "var(--lav-600)",
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              Latest
            </p>
            <h2
              style={{
                marginTop: 4,
                color: "var(--text-strong)",
                fontSize: 24,
                fontWeight: 850,
              }}
            >
              전체 글 목록
            </h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {visibleGuides.map((guide) => (
            <ArticleCard key={guide.id} guide={guide} />
          ))}
          {visibleGuides.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                border: "1px solid var(--border)",
                borderRadius: 18,
                background: "var(--bg-card)",
                padding: 22,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h3
                style={{
                  color: "var(--text-strong)",
                  fontSize: 18,
                  fontWeight: 850,
                  lineHeight: 1.42,
                }}
              >
                공개된 글이 아직 없습니다
              </h3>
              <p
                style={{
                  marginTop: 8,
                  color: "var(--text-secondary)",
                  fontSize: 14.5,
                  lineHeight: 1.7,
                }}
              >
                공개 시간이 지난 글만 이곳에 표시됩니다.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </article>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,.7)",
        borderRadius: 16,
        background: "rgba(255,255,255,.62)",
        padding: "14px 16px",
      }}
    >
      <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{label}</p>
      <p
        style={{
          marginTop: 2,
          color: "var(--text-strong)",
          fontSize: 24,
          fontWeight: 850,
          lineHeight: 1.1,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function ArticleCard({ guide }: { guide: GuideArticle }) {
  const section = sectionStyles[guide.type];

  return (
    <Link
      href={`/${guide.type}/guide/${guide.slug}`}
      style={{
        border: "1px solid var(--border)",
        borderRadius: 18,
        background: "var(--bg-card)",
        padding: 20,
        boxShadow: "var(--shadow-sm)",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        minHeight: 220,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            borderRadius: 999,
            background: section.bg,
            color: section.color,
            padding: "5px 10px",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {section.label}
        </span>
      </div>
      <h3
        style={{
          marginTop: 14,
          color: "var(--text-strong)",
          fontSize: 18,
          fontWeight: 850,
          lineHeight: 1.42,
          letterSpacing: 0,
        }}
      >
        {guide.title}
      </h3>
      <p
        style={{
          marginTop: 8,
          color: "var(--text-secondary)",
          fontSize: 14.5,
          lineHeight: 1.7,
        }}
      >
        {guide.subtitle}
      </p>
      <div style={{ flex: 1 }} />
      <p
        style={{
          marginTop: 16,
          color: "var(--text-caption)",
          fontSize: 12.5,
          fontWeight: 700,
        }}
      >
        {formatDateTime(guide.scheduled_at)}
      </p>
    </Link>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}
