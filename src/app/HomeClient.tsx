"use client";

import Link from "next/link";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "신혼지기",
  url: "https://sinhonjigi.com",
  description: "공공데이터 기반 결혼·신혼 종합 정보 허브",
};

const HUBS = [
  {
    href: "/jiwon",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--lav-500)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v12M19 12v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
      </svg>
    ),
    bg: "var(--gradient-hero)",
    border: "var(--lav-200)",
    title: "결혼·신혼 지원금",
    desc: "전국 및 지역별 결혼 지원금, 신혼부부 혜택을 한눈에 확인하세요.",
    tag: "전세자금 · 축하금 · 주거지원",
  },
  {
    href: "/wedding",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--pink-400)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21s-7-4.5-9.5-9C.8 8.6 2.3 5 6 5c2.2 0 3.4 1.3 4 2.3C10.6 6.3 11.8 5 14 5c3.7 0 5.2 3.6 3.5 7-2.5 4.5-5.5 9-5.5 9Z" />
      </svg>
    ),
    bg: "linear-gradient(135deg,#FFF1F2 0%,#FFE4E6 100%)",
    border: "var(--pink-200)",
    title: "결혼식 정보",
    desc: "예식장, 웨딩박람회, 스드메 등 결혼 준비에 필요한 모든 정보.",
    tag: "박람회 · 예식장 · 스드메",
  },
  {
    href: "/sinhon",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--sage-500)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    bg: "linear-gradient(135deg,var(--sage-100) 0%,#D7EFC9 100%)",
    border: "var(--sage-300)",
    title: "신혼 생활",
    desc: "신혼부부 주거 지원, 맞벌이 통계, 지역별 생활 정보를 제공합니다.",
    tag: "디딤돌 · 신혼희망타운 · 통계",
  },
];

const POPULAR_REGIONS = [
  { id: "seoul-gangnam", label: "서울 강남구" },
  { id: "seoul-mapo", label: "서울 마포구" },
  { id: "seoul-songpa", label: "서울 송파구" },
  { id: "gyeonggi-suwon", label: "경기 수원시" },
  { id: "gyeonggi-seongnam", label: "경기 성남시" },
  { id: "busan-haeundae", label: "부산 해운대구" },
  { id: "gyeonggi-goyang", label: "경기 고양시" },
  { id: "daegu-suseong", label: "대구 수성구" },
];

const GUIDES = [
  {
    href: "/wedding/guide/박람회-활용법",
    tag: "결혼식",
    tagColor: "var(--pink-400)",
    tagBg: "var(--pink-100)",
    title: "웨딩박람회 100% 활용하는 법",
    date: "2026.05.28",
    read: "5분 읽기",
    thumbBg: "linear-gradient(135deg,#FFE4E6 0%,#FECDD3 100%)",
    strokeColor: "#FB7185",
  },
  {
    href: "/jiwon/guide/전세자금-대출-비교",
    tag: "지원금",
    tagColor: "var(--lav-600)",
    tagBg: "var(--lav-100)",
    title: "신혼부부 전세자금 대출 3종 비교",
    date: "2026.05.24",
    read: "7분 읽기",
    thumbBg: "var(--gradient-hero)",
    strokeColor: "#8B5CF6",
  },
  {
    href: "/sinhon/guide/신혼희망타운-청약",
    tag: "신혼 생활",
    tagColor: "var(--sage-500)",
    tagBg: "var(--sage-100)",
    title: "신혼희망타운 청약 조건과 신청 가이드",
    date: "2026.05.20",
    read: "6분 읽기",
    thumbBg: "linear-gradient(135deg,var(--sage-100) 0%,#D7EFC9 100%)",
    strokeColor: "#6FB060",
  },
];

export default function HomeClient() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .hub-card{transition:transform .2s,box-shadow .2s}
        .hub-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg)!important}
        .post-card-link{transition:transform .2s,box-shadow .2s,border-color .2s}
        .post-card-link:hover{transform:translateY(-2px);box-shadow:var(--shadow-md)!important;border-color:var(--lav-200)!important}
        .region-chip{transition:.2s}
        .region-chip:hover{border-color:var(--lav-300)!important;color:var(--text-default)!important}
        ::-webkit-scrollbar{display:none}
      `}</style>

      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "20px 20px 0",
          animation: "fadeUp .45s ease-out both",
        }}
      >
        {/* 페이지 헤더 */}
        <div style={{ margin: "8px 0 4px" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: ".02em",
              color: "var(--lav-500)",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            SINHONJIGI
          </div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-.02em",
              marginTop: 6,
              color: "var(--text-strong)",
            }}
          >
            결혼·신혼 정보의 모든 것
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 15.5,
              marginTop: 7,
              maxWidth: "90%",
            }}
          >
            공공데이터 기반으로 지역별 지원금·예식장·신혼 통계를 정확하게
            안내합니다.
          </p>
        </div>

        {/* 허브 카드 3종 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 24,
          }}
        >
          {HUBS.map((hub) => (
            <Link
              key={hub.href}
              href={hub.href}
              className="hub-card"
              style={{
                display: "block",
                borderRadius: 20,
                border: `1px solid ${hub.border}`,
                background: hub.bg,
                boxShadow: "var(--shadow-md)",
                textDecoration: "none",
              }}
            >
              <div style={{ padding: "20px 22px 22px" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "rgba(255,255,255,.7)",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  {hub.icon}
                </div>
                <h2
                  style={{
                    fontSize: 19,
                    fontWeight: 700,
                    marginTop: 12,
                    color: "var(--text-strong)",
                  }}
                >
                  {hub.title}
                </h2>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 15,
                    marginTop: 6,
                  }}
                >
                  {hub.desc}
                </p>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 12.5,
                    color: "var(--text-caption)",
                    fontFamily: "'Inter',sans-serif",
                    letterSpacing: ".01em",
                  }}
                >
                  {hub.tag}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 인기 지역 */}
        <section style={{ marginTop: 36 }}>
          <h2
            style={{
              fontSize: 19,
              fontWeight: 700,
              color: "var(--text-strong)",
              marginBottom: 14,
            }}
          >
            지역별 지원금 바로가기
          </h2>
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: 8,
              margin: "0 -20px",
              padding: "2px 20px 8px",
              scrollbarWidth: "none",
            }}
          >
            {POPULAR_REGIONS.map((r) => (
              <Link
                key={r.id}
                href={`/jiwon/${r.id}`}
                className="region-chip"
                style={{
                  flexShrink: 0,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "8px 15px",
                  borderRadius: 999,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {r.label}
              </Link>
            ))}
          </div>
        </section>

        {/* 광고 슬롯 */}
        <div style={{ margin: "28px 0" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: ".06em",
              color: "var(--text-caption)",
              fontWeight: 600,
              marginBottom: 6,
              textTransform: "uppercase",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            광고
          </div>
          <div
            style={{
              border: "1px dashed #E7DDD2",
              borderRadius: 12,
              background: "var(--bg-soft)",
              minHeight: 92,
              display: "grid",
              placeItems: "center",
              color: "var(--text-caption)",
              fontSize: 13,
            }}
          >
            AdSense 슬롯 · 반응형
          </div>
        </div>

        {/* 가이드 섹션 */}
        <section style={{ marginTop: 8, paddingBottom: 48 }}>
          <h2
            style={{
              fontSize: 19,
              fontWeight: 700,
              color: "var(--text-strong)",
              marginBottom: 14,
            }}
          >
            결혼 준비 가이드
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {GUIDES.map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="post-card-link"
                style={{
                  display: "grid",
                  gridTemplateColumns: "96px 1fr",
                  gap: 14,
                  alignItems: "center",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: 14,
                  boxShadow: "var(--shadow-sm)",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 12,
                    background: post.thumbBg,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <svg
                    width="52"
                    height="52"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={post.strokeColor}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21s-7-4.5-9.5-9C.8 8.6 2.3 5 6 5c2.2 0 3.4 1.3 4 2.3C10.6 6.3 11.8 5 14 5c3.7 0 5.2 3.6 3.5 7-2.5 4.5-5.5 9-5.5 9Z" />
                  </svg>
                </div>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: "3px 9px",
                      borderRadius: 999,
                      color: post.tagColor,
                      background: post.tagBg,
                    }}
                  >
                    {post.tag}
                  </span>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      marginTop: 7,
                      lineHeight: 1.4,
                      color: "var(--text-strong)",
                    }}
                  >
                    {post.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 8,
                      fontSize: 12.5,
                      color: "var(--text-caption)",
                      fontFamily: "'Inter',sans-serif",
                    }}
                  >
                    <span>{post.date}</span>
                    <span
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: "var(--text-caption)",
                        display: "inline-block",
                      }}
                    />
                    <span>{post.read}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
