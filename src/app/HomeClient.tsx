"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "신혼지기",
  url: "https://sinhonjigi.com",
  description: "공공데이터 기반 결혼·신혼 종합 정보 허브",
};

const ICON_PATHS = {
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8Z" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M20 10c0 4.4-8 12-8 12s-8-7.6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  shield: (
    <>
      <path d="M20 13c0 5-3.5 7.5-8 8.5C7.5 20.5 4 18 4 13V6l8-3 8 3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  "refresh-cw": (
    <>
      <path d="M21 12a9 9 0 0 0-15.7-6.3L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 15.7 6.3L21 16" />
      <path d="M16 16h5v5" />
    </>
  ),
  "file-text": (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v5h5M9 13h6M9 17h6" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  "arrow-up-right": (
    <>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  banknote: (
    <>
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  "key-round": (
    <>
      <path d="M2.6 13.4A6 6 0 1 0 15 9a6 6 0 0 0-1.2 3.6L8 18l-2 2H4v-2l2-2" />
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
    </>
  ),
  building: (
    <>
      <rect width="16" height="20" x="4" y="2" rx="1.5" />
      <path d="M9 22v-4h6v4M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
    </>
  ),
  baby: (
    <>
      <path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
      <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
    </>
  ),
};

type IconName = keyof typeof ICON_PATHS;

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="sj-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

const subsidies = [
  {
    href: "/jiwon/guide/신혼부부-전세자금-대출",
    category: "주거",
    icon: "key-round" as const,
    status: "마감 임박",
    statusType: "warning",
    title: "신혼부부 임차보증금 이자지원",
    amount: "연 최대 800만원",
    note: "최장 10년 · 예산 소진 시까지",
    eligibility: "혼인 7년 이내 또는 예비부부 · 무주택 · 임차보증금 기준 충족",
    source: "서울주거포털",
  },
  {
    href: "/jiwon/guide/결혼-지원금-조건",
    category: "현금지원",
    icon: "banknote" as const,
    status: "상시",
    statusType: "neutral",
    title: "지역별 결혼살림·축하 지원",
    amount: "최대 100만원",
    note: "1회성 · 지자체별 상이",
    eligibility: "혼인신고 후 거주 요건과 소득 요건을 동시에 확인해야 합니다",
    source: "보조금24",
  },
  {
    href: "/sinhon/guide/신혼희망타운-청약",
    category: "대출",
    icon: "building" as const,
    status: "최근 업데이트",
    statusType: "success",
    title: "버팀목 전세자금대출 신혼 우대",
    amount: "한도 3억원",
    note: "금리 1%대부터 · 조건별 차등",
    eligibility: "부부합산 소득·순자산·무주택 세대주 요건을 함께 봅니다",
    source: "주택도시기금",
  },
];

const popularRegions = [
  { href: "/jiwon/seoul-gangnam", name: "서울 강남구", tag: "혜택 우수", count: 6 },
  { href: "/jiwon/gyeonggi-suwon", name: "경기 수원시", tag: "주거지원", count: 8 },
  { href: "/jiwon/seoul-songpa", name: "서울 송파구", tag: "", count: 5 },
  { href: "/jiwon/busan-haeundae", name: "부산 해운대구", tag: "", count: 5 },
  { href: "/jiwon/gyeonggi-seongnam", name: "경기 성남시", tag: "대출 비교", count: 7 },
  { href: "/jiwon/daegu-suseong", name: "대구 수성구", tag: "", count: 4 },
  { href: "/jiwon/sejong", name: "세종특별자치시", tag: "혜택 우수", count: 9 },
  { href: "/jiwon/daejeon-yuseong", name: "대전 유성구", tag: "", count: 6 },
];

const updates = [
  { date: "2026.05.30", region: "전국", type: "주거", text: "신혼부부 전세자금 대출 비교 가이드와 신청 전 체크리스트 보강" },
  { date: "2026.05.29", region: "서울", type: "지원금", text: "임차보증금 이자지원 조건, 소득 기준, 준비서류 최신화" },
  { date: "2026.05.28", region: "경기", type: "생활", text: "신혼희망타운 청약 조건과 지역별 생활비 가이드 추가" },
];

const guideLinks = [
  { href: "/jiwon/guide/전세자금-대출-비교", title: "신혼부부 전세자금 대출 3종 비교", meta: "지원금 · 7분" },
  { href: "/wedding/guide/박람회-활용법", title: "웨딩박람회 100% 활용하는 법", meta: "결혼식 · 5분" },
  { href: "/sinhon/guide/신혼희망타운-청약", title: "신혼희망타운 청약 조건과 신청 가이드", meta: "신혼 생활 · 6분" },
];

function RegionSearch() {
  const [query, setQuery] = useState("");
  const target = useMemo(() => {
    const found = popularRegions.find((region) =>
      region.name.replace(/\s/g, "").includes(query.replace(/\s/g, "")),
    );
    return found?.href ?? "/jiwon";
  }, [query]);

  return (
    <form className="sj-search" action={target}>
      <Icon name="map-pin" size={20} />
      <input
        aria-label="지역 검색"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="시·군·구로 검색 (예: 강남구, 수원시)"
      />
      <button type="submit">
        <Icon name="search" size={17} />
        검색
      </button>
    </form>
  );
}

export default function HomeClient() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <div className="sj-home">
        <section className="sj-hero">
          <div className="sj-container sj-hero-grid">
            <div>
              <span className="sj-eyebrow sj-eyebrow-filled">
                <Icon name="sparkles" size={14} />
                신혼부부 지원금 데이터 플랫폼
              </span>
              <h1>우리 지역 신혼부부 지원금, 흩어진 정보를 한 화면에서.</h1>
              <p className="sj-hero-lead">
                주거·현금·대출·출산 지원을 지역별로 정리했습니다. 광고가 아닌{" "}
                <strong>출처가 명확한 데이터</strong>로 받을 수 있는 혜택을 빠르게
                확인하세요.
              </p>
              <RegionSearch />
              <div className="sj-hero-meta">
                <span>
                  <Icon name="map-pin" size={14} /> 전국 시·군·구
                </span>
                <span>
                  <Icon name="refresh-cw" size={14} /> 매주 갱신
                </span>
                <span>
                  <Icon name="shield" size={14} /> 출처 5개+ 명시
                </span>
              </div>
              <div className="sj-hero-meta" style={{ marginTop: 12 }}>
                <a href="https://www.gov.kr" target="_blank" rel="noopener noreferrer">
                  정부24
                </a>
                <a href="https://www.bokjiro.go.kr" target="_blank" rel="noopener noreferrer">
                  복지로
                </a>
                <a href="https://nhuf.molit.go.kr" target="_blank" rel="noopener noreferrer">
                  주택도시기금
                </a>
              </div>
            </div>

            <aside className="sj-snapshot" aria-label="데이터 스냅샷">
              <div className="sj-snapshot-head">
                <span>실시간 데이터 스냅샷</span>
                <span className="sj-badge success">2026.05 기준</span>
              </div>
              <div className="sj-stat-grid">
                <div>
                  <strong>300</strong>
                  <span>등록 가이드</span>
                </div>
                <div>
                  <strong>228</strong>
                  <span>전국 시·군·구</span>
                </div>
                <div>
                  <strong>5</strong>
                  <span>공식 데이터 출처</span>
                </div>
                <div>
                  <strong>주 1회</strong>
                  <span>갱신 주기</span>
                </div>
              </div>
              <Link className="sj-snapshot-link" href="/jiwon/guide/전세자금-대출-비교">
                <span>
                  <Icon name="file-text" size={16} />
                  2026 신혼부부 지원금 총정리 읽기
                </span>
                <Icon name="arrow-right" size={16} />
              </Link>
            </aside>
          </div>
        </section>

        <section className="sj-section">
          <div className="sj-container">
            <div className="sj-section-head">
              <div>
                <span className="sj-eyebrow">지금 받을 수 있는 혜택</span>
                <h2>신혼부부 추천 지원금 Top 3</h2>
                <p>아래 가정 조건을 기준으로 수급 가능성이 높은 순서입니다.</p>
              </div>
              <Link className="sj-btn secondary" href="/jiwon">
                전체 보기 <Icon name="arrow-right" size={15} />
              </Link>
            </div>
            <div className="sj-basis">
              <Icon name="info" size={16} />
              <p>
                <strong>산정 기준</strong> 혼인신고 3년 이내 · 부부합산 연소득
                7,000만원 · 무주택 · 자녀 1명 가정 기준 추정
              </p>
            </div>
            <div className="sj-card-grid">
              {subsidies.map((item) => (
                <article className="sj-subsidy-card" key={item.title}>
                  <div className="sj-card-top">
                    <span className="sj-chip">
                      <Icon name={item.icon} size={14} />
                      {item.category}
                    </span>
                    <span className={`sj-badge ${item.statusType}`}>{item.status}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <strong className="sj-amount">{item.amount}</strong>
                  <span className="sj-note">{item.note}</span>
                  <p>
                    <span>자격</span>
                    {item.eligibility}
                  </p>
                  <div className="sj-card-foot">
                    <span>
                      <Icon name="info" size={13} /> {item.source}
                    </span>
                    <Link href={item.href}>
                      신청 조건 보기 <Icon name="arrow-right" size={15} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sj-section sj-region-band">
          <div className="sj-container">
            <div className="sj-section-head">
              <div>
                <span className="sj-eyebrow">지역으로 둘러보기</span>
                <h2>인기 지역</h2>
                <p>조회가 많은 지역입니다. 선택하면 지역별 지원금 페이지로 이동합니다.</p>
              </div>
            </div>
            <div className="sj-region-grid">
              {popularRegions.map((region) => (
                <Link className="sj-region-tile" href={region.href} key={region.name}>
                  <span>
                    <Icon name="map-pin" size={15} />
                    {region.name}
                    {region.tag ? <em>{region.tag}</em> : null}
                  </span>
                  <strong>
                    {region.count}
                    <small>개 프로그램</small>
                    <Icon name="arrow-up-right" size={16} />
                  </strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="sj-section">
          <div className="sj-container sj-updates-grid">
            <div>
              <div className="sj-section-head">
                <div>
                  <span className="sj-eyebrow">변경 이력</span>
                  <h2>최근 업데이트</h2>
                </div>
              </div>
              <ul className="sj-update-list">
                {updates.map((update) => (
                  <li key={`${update.date}-${update.text}`}>
                    <time>{update.date}</time>
                    <div>
                      <span className="sj-badge neutral">{update.type}</span>
                      <span className="sj-update-region">{update.region}</span>
                      <p>{update.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="sj-ad-card" aria-label="광고">
              <span className="sj-ad-label">광고</span>
              <h3>신혼부부 전세대출, 한도·금리 한 번에 비교</h3>
              <p>제휴 금융사 조건을 입력 한 번으로 확인하고, 실제 신청 전 준비서류를 점검하세요.</p>
              <Link className="sj-btn primary" href="/disclosure">
                대출 비교 안내 <Icon name="arrow-right" size={15} />
              </Link>
              <small>유료광고 · 클릭 시 광고 고지 페이지로 이동합니다</small>
            </aside>
          </div>
        </section>

        <section className="sj-section">
          <div className="sj-container sj-about-mini">
            <div>
              <span className="sj-eyebrow">운영 원칙</span>
              <h2>광고가 아니라 정보로 판단을 돕습니다</h2>
              <p>
                신혼지기는 공공·금융 공식 데이터를 정제해 제공합니다. 모든 주요
                정보에는 출처와 갱신일을 표기하고, 광고는 ‘광고’로 명확히
                구분합니다.
              </p>
              <Link className="sj-btn secondary" href="/about">
                운영팀 · 데이터 원칙 보기
              </Link>
            </div>
            <div className="sj-guide-list">
              {guideLinks.map((guide) => (
                <Link href={guide.href} key={guide.href}>
                  <span>{guide.meta}</span>
                  <strong>{guide.title}</strong>
                  <Icon name="arrow-right" size={15} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="sj-container sj-disclosure">
          <Icon name="info" size={15} />
          <p>
            일부 콘텐츠에는 <strong>유료광고</strong>가 포함되며 ‘광고’로 명확히
            표기됩니다. 광고 수익은 정보 운영비에 사용되며, 지원금 데이터의
            선정·순서에 영향을 주지 않습니다.{" "}
            <Link href="/disclosure">광고 고지 보기</Link>
          </p>
        </div>
        <section className="sj-section">
          <div className="sj-container sj-about-mini">
            <div>
              <span className="sj-eyebrow">검토 기준</span>
              <h2>지원금과 예식장 정보는 공식 확인을 전제로 읽어야 합니다</h2>
              <p>
                신혼지기는 결혼 준비, 신혼부부 지원금, 예식장 탐색을 시작하는 사용자를 위한 정보 허브입니다.
                지역별 제도와 금융 조건은 공고일, 예산, 접수 기관, 혼인 신고 시점, 소득 기준에 따라 달라질
                수 있으므로 사이트의 요약만으로 신청 가능 여부를 확정하면 안 됩니다.
              </p>
              <p>
                예식장과 웨딩홀 정보도 실제 상담, 잔여 날짜, 보증 인원, 식대, 대관료, 추가 옵션, 환불 규정에
                따라 최종 비용이 달라집니다. 후보를 고를 때는 위치와 분위기뿐 아니라 계약서 조항, 취소 조건,
                주차, 대중교통, 하객 동선까지 함께 확인하는 것이 안전합니다.
              </p>
              <p>
                광고가 포함된 영역은 본문과 구분하며, 광고 노출이 지원금 정보의 순서나 결론을 결정하지
                않습니다. 사용자는 최종 신청 전 정부24, 지자체 공고, 금융기관 상품설명서, 예식장 공식 견적을
                기준으로 다시 확인해야 합니다.
              </p>
            </div>
            <div className="sj-guide-list">
              <Link href="/blog">
                <span>공개 글</span>
                <strong>지원금과 결혼 준비 가이드 보기</strong>
                <Icon name="arrow-right" size={15} />
              </Link>
              <Link href="/contact">
                <span>정정 요청</span>
                <strong>오래된 공고나 링크 오류 제보</strong>
                <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
