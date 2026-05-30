# 신혼지기(가칭) — 조합 B 결혼·신혼 종합 허브 핸드오프 문서

> **이 문서의 목적**: 공공데이터 기반 결혼·신혼 종합 허브를 CPA 수익화 모델로 구축하기 위한 Claude Code 자율 실행 수준의 기획·실행 명세서. 이 문서 하나로 Phase 0.5부터 Phase A 발행까지 진행 가능해야 한다.
>
> **상태**: 기획 합의 완료. Phase 0.5 API 실측 → Phase A 빌드 착수 가능.
>
> **선행 결정 사항(Limo 본인 작업, 코드 시작 전 클로즈)**:
> 1. 도메인 확정 (`신혼지기`/`결혼지기`/기타 — 후이즈 확인 후 결정)
> 2. CPA 네트워크 1차 가입 (애드릭스 또는 CPA천국)
> 3. Phase 0.5 API 필드 실측 (§4.3)

---

## 0. 핵심 합의 사항 (요약)

| 항목 | 결정 |
|------|------|
| 조합 | B 확장형 — 단순 박람회 사이트가 아닌 **결혼·신혼 종합 허브** |
| 포지셔닝 | 공공데이터 기반 데이터·정보 톤 ("지기" 시리즈 후속) |
| 수익 모델 | 멀티 CPA (박람회·스드메·웨딩홀상담·결혼정보회사) + (Phase B+) 부수 CPS |
| 지역 전개 | 3-Tier (T1 박람회 개최 도시 ~50 / T2 인구 5만+ 시군구 ~80 / T3 noindex) |
| 도메인 | 신규 (bojo24와 분리, 권위 계승 X) |
| 기술 스택 | Next.js 15 App Router + Turso + Drizzle + Vercel Pro + Gemini Flash |
| MVP | A(시드) → B(성장) → C(확장) 3단계 |
| 차별화 | 공공데이터 결합 (지원금 + 신혼통계 + 박람회 + 주거) — 경쟁자 미보유 |
| 법적 안전 | 리드폼 X, 광고주 랜딩 직송, 인라인 광고 고지, 어휘 금지어 빌드 강제 |

---

## 1. 핵심 가설 & 차별화

### 1.1 가설

> **공공데이터 4축(결혼지원금·신혼통계·예식장·신혼주거)을 결합해 시군구 단위 unique 페이지를 만들면, 박람회·예식장 SEO 레드오션을 회피하면서 다중 CPA 의도 풀을 흡수할 수 있다.**

### 1.2 차별화 카드 (경쟁자 미보유)

| 데이터 축 | 출처 | 경쟁자 보유 | 페이지 기여 |
|---------|------|----------|----------|
| 결혼·신혼 지원금 | 보조금24·복지로·지자체 고시 | ❌ | 시군구별 unique 데이터 |
| 신혼부부 통계 (소득·주거·자녀) | KOSIS | ❌ | 시군구별 unique 데이터 |
| 신혼 주거지원 (전세자금·디딤돌) | HUG·국토부 | ❌ | 페이지 깊이 |
| 혼인 통계 | KOSIS | ❌ | 신뢰감 지표 |
| 예식장 인허가·분포 | LOCALDATA | 일부 | 시군구 unique |
| 박람회 일정 | CPA 네트워크 | ✅ (red ocean) | 보조 섹션 |

### 1.3 포지셔닝

- **톤**: "공공데이터로 보는 결혼·신혼 가이드". 친구·감성 톤(경쟁자 점령) 회피, 데이터·분석 톤
- **시리즈 일관성**: 닥터맵·법률지기·금리지기·보조금24와 시각·브랜드 결
- **사용자 인식**: "결혼 준비 시 가장 먼저 들르는 데이터 허브"

---

## 2. 비즈니스 모델

### 2.1 CPA 멀티 오퍼 구조

| 우선순위 | 오퍼 카테고리 | 단가(헤드라인) | 매칭 페이지 |
|---------|-----------|------------|---------|
| 1 | 박람회 사전등록 | 3~5만원 | T1 (개최 도시) |
| 2 | 스드메 견적 | 3~5만원 | 전국 매칭 |
| 3 | 웨딩홀 상담 | 3~5만원 | T1·T2 |
| 4 | 결혼정보회사 | ~5만원 | 보조 오퍼 (결혼중개업법 회피 위해 비주류로) |
| 5 (Phase B+) | 가전·혼수 CPS | 변동 | 혼수 가이드 페이지 |
| 6 (Phase B+) | 신혼여행 패키지 | 3~5만원 | 신혼여행 가이드 |

**규칙**:
- 단일 오퍼 의존 X. 페이지마다 최소 2개 매칭 후보 보유
- `cpa_offers` 테이블에서 priority + region + status 로 자동 매칭
- 만료/소진 오퍼 자동 비활성화 (죽은 CTA 방지)

### 2.2 단가·수익 모델 (보수)

가정: 평균 마케터 실수령액 30,000원 (헤드라인 40,000원 × 승인율 75%)

| 시점 | 일 방문자 | 전환률 | 월 전환 | 월 수익 |
|------|---------|------|--------|--------|
| Phase A 종료 (2개월) | 100~300 | 0.3% | 9~27건 | 약 30~80만원 |
| Phase B 종료 (6개월) | 1,000~2,000 | 0.5% | 150~300건 | 약 450~900만원 |
| Phase C 종료 (12개월) | 3,000~5,000 | 0.5% | 450~750건 | 약 1,350~2,250만원 |

**검증 KPI** (Phase A 종료 시점):
- 일 방문자 100 이상
- CPA 클릭률 1.0% 이상
- 전환 1건 이상 발생
- 셋 중 둘 이상 미달 시 전략 재검토

### 2.3 트래픽 의도 매핑

| 의도 | 키워드 예 | Layer | CPA 매칭 |
|------|---------|-------|---------|
| 지원금 검색 | "신혼부부 전세자금 대출", "[지역] 결혼 축하금" | L1 정보 | (Phase B+) 보험·청약 컨설팅 |
| 결혼 비용 | "결혼식 평균 비용", "스드메 가격" | L2 필러 | 스드메 견적 |
| 박람회 검색 | "[지역] 웨딩박람회" | L1 정보 | 박람회 사전등록 |
| 예식장 검색 | "[지역] 웨딩홀 추천" | L1 정보 | 웨딩홀 상담 |
| 신혼 주거 | "신혼 디딤돌 대출", "[지역] 신혼희망타운" | L1 정보 | 정보 제공만 (금융광고 회피) |
| 혼수·예단 (Phase B+) | "혼수 가전 추천" | L2 필러 | 가전 CPS |

---

## 3. 콘텐츠 아키텍처

### 3.1 3-Layer 구조

- **Layer 1 (80%) — 프로그래매틱 정보 페이지**: 공공데이터 1단위 = 1페이지 (시군구·항목별)
- **Layer 2 (15%) — 필러 가이드**: AI 보조 + 사람 정리, 토픽 클러스터 허브, **CPA 전환 동선의 핵심**
- **Layer 3 (5%) — 에버그린**: 고품질 전문 가이드 (도메인 권위)

### 3.2 3-Tier 지역 전개

| Tier | 대상 | 페이지 수 | CTA |
|------|------|---------|-----|
| T1 | 박람회 개최 도시 (서울·경기·광역시·거점도시) | ~50 | 박람회 직접 매칭 (최강) |
| T2 | 박람회 없는 인구 5만+ 시군구 | ~80 | 인근 T1 박람회 유도 + 스드메·웨딩홀 |
| T3 | 농촌·인구 적은 군 | 나머지 (~80) | noindex, GSC 트래픽 발생 시 승격 |

**T1 결정 알고리즘** (Phase A 시작 시):
1. 박람회 일정 데이터에서 개최 도시 추출
2. 인구 10만 이상 광역시·도시는 자동 T1
3. 인구 5만 이상 박람회 미개최 도시는 T2
4. 나머지 T3

### 3.3 URL 구조

```
/                                  → 홈 (히어로 + 인기 지역 + 최근 업데이트)
/about                             → 운영자 정체성 (EEAT P0)
/privacy                           → 개인정보 처리방침 (P0)
/terms                             → 이용약관
/contact                           → 문의
/disclosure                        → 광고·제휴 고지 (P0)

/jiwon                             → 결혼·신혼 지원금 허브
/jiwon/[region]                    → [지역] 지원금 종합 (L1)
/jiwon/guide/[slug]                → 지원금 가이드 (L2)

/wedding                           → 결혼 정보 허브
/wedding/[region]                  → [지역] 결혼 종합 (L1, 박람회·예식장 통합)
/wedding/fair/[region]             → [지역] 박람회 일정 (L1)
/wedding/hall/[region]             → [지역] 예식장 정보 (L1)
/wedding/guide/[slug]              → 결혼 가이드 (L2)

/sinhon                            → 신혼 정보 허브
/sinhon/[region]                   → [지역] 신혼 통계·주거 (L1)
/sinhon/guide/[slug]               → 신혼 가이드 (L2, 주거·청약 등)

/learn/[slug]                      → 에버그린 (L3)

/go/[offer_id]                     → CPA 리다이렉트 (sub_id 주입)

/sitemap.xml                       → 사이트맵 인덱스
/sitemap/[page].xml                → 분할 사이트맵
/llms.txt                          → LLM 인용 가이드 (Phase C에서 활성)
/feed.xml                          → RSS
```

### 3.4 페이지 타입별 필수 구조

#### L1 — 지역 정보 페이지 (예: `/jiwon/서울특별시-마포구`)

> **모바일 우선. 실행 정보 먼저, 데이터 보조.** (P1)

1. **히어로**: 지역명 + 한 줄 요약 + 마지막 업데이트
2. **실행 정보 (메인)**: 받을 수 있는 지원금 카드 3~5개 + 신청 방법 링크
3. **CPA CTA #1**: 인근 박람회 / 스드메 견적 (인라인 광고 라벨)
4. **비교 데이터 (보조)**: 이 지역 vs 전국 평균 카드 3장
5. **인근 지역 박람회**: T2 페이지의 경우 인근 T1 박람회 유도
6. **FAQ**: 최소 3개 (지원금 자격·신청처·중복 여부 등)
7. **CPA CTA #2**: 페이지 하단 (덜 강한 CTA)
8. **출처 표시**: data.go.kr, [기관명], 마지막 갱신 일시
9. **광고 고지**: 페이지 하단 + 인라인 CTA 라벨

#### L2 — 필러 가이드 (예: `/wedding/guide/예식장-계약-체크리스트`)

> CPA 전환의 정점. 애드센스 X, CPA 집중.

1. 도입 (방문자 의도 확인)
2. 핵심 정보 5~10개 섹션 (AI 보조 + 사람 정리)
3. **CPA CTA (가운데와 끝 2회)**: 가장 강한 매칭 오퍼
4. 관련 L1 페이지 내부 링크 3~5개
5. FAQ + 광고 고지

#### L3 — 에버그린

- 운영자/팀 직접 작성. 분기 1~2개 한정
- 1차 데이터 또는 깊은 분석. AI 비중 30% 이하
- EEAT 시그널 누적용

### 3.5 토픽 클러스터 (Phase A 시드)

```
[허브] /jiwon/guide/2026-신혼부부-지원-총정리(어휘 X)
        → 신혼부부-지원-한눈에-보기
  ├ [지역 정보] /jiwon/서울특별시-마포구 (× 50)
  ├ [가이드] /jiwon/guide/전세자금-대출-3종-비교
  └ [가이드] /jiwon/guide/지자체-결혼-축하금-받는-법

[허브] /wedding/guide/결혼-준비-순서
  ├ [지역 정보] /wedding/[region] (× 50)
  ├ [가이드] /wedding/guide/박람회-100%-활용법
  └ [가이드] /wedding/guide/예식장-계약-체크리스트

[허브] /sinhon/guide/신혼-주거-가이드
  ├ [지역 정보] /sinhon/[region] (× 50)
  └ [가이드] /sinhon/guide/신혼희망타운-청약-가이드
```

---

## 4. 데이터 소스 & 적재

### 4.1 공공데이터 매트릭스

| 소스 | API/페이지 | 라이선스 | 주요 필드 | 갱신 |
|------|---------|------|---------|-----|
| 보조금24 | data.go.kr (보조금24 통합 API) | 공공누리 1 | 지원금명, 대상, 금액, 신청처, 지역 | 주 1회 |
| 복지로 | bokjiro 데이터셋 | 공공누리 1 | 복지서비스명, 대상, 신청방법 | 주 1회 |
| 지자체 결혼·출산 지원 | 지자체별 고시 (수기 큐레이션) | 변동 | 지원금명, 금액, 조건 | 분기 1회 |
| KOSIS 혼인 통계 | KOSIS Open API | OPEN | 시군구·연도별 혼인건수·평균연령 | 연 1회 |
| KOSIS 신혼부부 통계 | KOSIS Open API | OPEN | 소득·주거·자녀·맞벌이 비율 | 연 1회 |
| LOCALDATA 예식장 | LOCALDATA Open API + 다운로드 | 공공누리 1 | 업체명, 주소, 인허가일, 영업상태 | 주 1회 (증분) |
| 신혼주거 (HUG) | HUG 공시 데이터 | 변동 | 신혼희망타운, 디딤돌·버팀목 조건 | 분기 1회 |
| 박람회 일정 | CPA 네트워크 제공 (수동 또는 API) | 광고주 데이터 | 일정, 장소, 사전등록 URL | 주 1회 |

### 4.2 CPA 오퍼 데이터 모델

```ts
// cpa_offers 테이블 (핵심 운영 자산)
{
  id: string,                     // 'cpah_wedfair_jamsil_2026q2'
  vertical: 'fair' | 'sdm' | 'hall' | 'agency' | 'gift' | 'honeymoon',
  advertiser: string,             // 'CPA천국' 등
  brand: string,                  // '다이렉트 결혼준비'
  region: string | null,          // '서울특별시-송파구' (전국이면 null)
  region_inferred: boolean,       // 인근 도시 매칭 가능?
  payout_won: number,             // 마케터 실수령액 (보수 추정)
  landing_url: string,
  sub_id_param: string,           // 'utm_content' 등
  status: 'active' | 'paused' | 'expired',
  start_date: Date,
  end_date: Date | null,          // null = 상시
  priority: number,               // 1~10
  notes: string,
}
```

**규칙**:
- 새 오퍼 추가는 운영자 수동 (자동 크롤링 X — 광고주 ToS 위반 가능)
- 만료 7일 전 자동 priority -2
- end_date 경과 시 자동 status='expired'

### 4.3 ⚠️ Phase 0.5 API 필드 실측 (비협상 사전 작업)

**Limo 본인이 직접 수행. 실측 결과 없이 어떤 수집 코드도 작성 금지.**

#### 4.3.1 필드 매핑표 작성 대상

1. **보조금24 API**
   - 응답 필드명 (servId, servNm, jurMnofNm, intrsThemaArray …)
   - 지역 필터링 가능 여부
   - 페이지네이션 방식
   - 호출 제한 (개발/운영)
2. **KOSIS Open API**
   - 통계표 ID (인구동향조사 - 시군구별 혼인건수)
   - 신혼부부 통계 ID
   - 응답 포맷 (JSON/XML)
3. **LOCALDATA**
   - 결혼식장(인허가) 데이터셋 API
   - 응답 필드 (siteWhlAddr, bplcNm, trdStateNm, ...)
   - **주의**: API는 증분만 제공, 전체 데이터는 다운로드 페이지 → 초기 적재 따로
4. **복지로 데이터셋** (별도 확인 — 결혼·출산·신혼 카테고리)

#### 4.3.2 산출물 (Limo → Claude Code)

```
data/field-maps/
  bojo24.json          // 응답 필드명 → 우리 DB 필드 매핑
  kosis-marriage.json
  kosis-newlywed.json
  localdata-wedding.json
```

### 4.4 데이터 갱신 주기

| 데이터 | 주기 | 트리거 |
|------|------|------|
| 보조금24·복지로 | 매주 일요일 03:00 | Vercel Cron |
| LOCALDATA 예식장 | 매주 일요일 04:00 (증분) | Vercel Cron |
| KOSIS | 매월 1일 (연 단위 데이터지만 확인) | Vercel Cron |
| 지자체 결혼·신혼 지원 | 분기 1회 | 수동 큐레이션 (Limo 또는 별도 운영자) |
| 박람회 일정 | 매주 1회 | 수동 (광고주 데이터 ToS 준수) |
| CPA 오퍼 상태 | 매일 | Vercel Cron (만료 체크) |

---

## 5. 기술 스택 & 인프라

### 5.1 스택

- **프레임워크**: Next.js 15 App Router + TypeScript (strict)
- **DB**: Turso (Edge SQLite) + Drizzle ORM
- **렌더링**: ISR (revalidate: 86400) — 데이터 갱신 시 webhook으로 즉시 revalidate
- **AI 보강**: Google Gemini Flash (Phase A 기본), Gemini Pro (L2 필러 일부)
- **이메일**: Resend (운영 알림용)
- **호스팅**: Vercel Pro (Cron 신뢰성 + 빌드 시간)
- **CI/CD**: GitHub Actions (대량 적재 작업)
- **모니터링**: GSC, GA4, Vercel Analytics, Sentry

### 5.2 DB 스키마 (Drizzle)

```ts
// src/db/schema.ts

export const regions = sqliteTable('regions', {
  id: text('id').primaryKey(),               // 'seoul-mapo' (slug)
  sido: text('sido').notNull(),              // '서울특별시'
  sigungu: text('sigungu'),                  // '마포구' (null = 시도 자체)
  name: text('name').notNull(),              // '서울특별시 마포구'
  tier: integer('tier').notNull(),           // 1 | 2 | 3
  population: integer('population'),
  lat: real('lat'),
  lng: real('lng'),
  created_at: integer('created_at', { mode: 'timestamp' }),
});

export const subsidies = sqliteTable('subsidies', {
  id: text('id').primaryKey(),
  region_id: text('region_id').references(() => regions.id),  // null = 전국
  category: text('category').notNull(),      // 'marriage' | 'newlywed' | 'housing'
  name: text('name').notNull(),
  amount_won: integer('amount_won'),
  amount_text: text('amount_text'),          // '최대 200만원' 등 텍스트
  eligibility: text('eligibility'),
  application: text('application'),
  source_url: text('source_url'),
  source_name: text('source_name'),
  effective_from: integer('effective_from', { mode: 'timestamp' }),
  effective_to: integer('effective_to', { mode: 'timestamp' }),
  status: text('status').notNull(),          // 'active' | 'expired'
  last_verified_at: integer('last_verified_at', { mode: 'timestamp' }),
});

export const marriage_stats = sqliteTable('marriage_stats', {
  region_id: text('region_id').references(() => regions.id),
  year: integer('year').notNull(),
  total_marriages: integer('total_marriages'),
  avg_age_male: real('avg_age_male'),
  avg_age_female: real('avg_age_female'),
  // ... KOSIS 필드는 실측 후 확정
});

export const newlywed_stats = sqliteTable('newlywed_stats', {
  region_id: text('region_id').references(() => regions.id),
  year: integer('year').notNull(),
  avg_income_won: integer('avg_income_won'),
  homeowner_ratio: real('homeowner_ratio'),
  dual_income_ratio: real('dual_income_ratio'),
  // ... KOSIS 필드는 실측 후 확정
});

export const wedding_halls = sqliteTable('wedding_halls', {
  id: text('id').primaryKey(),
  region_id: text('region_id'),
  name: text('name').notNull(),
  address: text('address'),
  status: text('status'),                    // '영업/정상' | '폐업' 등
  permit_date: integer('permit_date', { mode: 'timestamp' }),
  // ... LOCALDATA 필드는 실측 후 확정
});

export const cpa_offers = sqliteTable('cpa_offers', {
  id: text('id').primaryKey(),
  vertical: text('vertical').notNull(),
  advertiser: text('advertiser').notNull(),
  brand: text('brand'),
  region_id: text('region_id'),
  region_inferred: integer('region_inferred', { mode: 'boolean' }),
  payout_won: integer('payout_won'),
  landing_url: text('landing_url').notNull(),
  sub_id_param: text('sub_id_param'),
  status: text('status').notNull(),
  start_date: integer('start_date', { mode: 'timestamp' }),
  end_date: integer('end_date', { mode: 'timestamp' }),
  priority: integer('priority').notNull(),
  notes: text('notes'),
});

export const cpa_clicks = sqliteTable('cpa_clicks', {
  id: text('id').primaryKey(),
  offer_id: text('offer_id').references(() => cpa_offers.id),
  page_slug: text('page_slug'),
  region_id: text('region_id'),
  sub_id: text('sub_id'),
  ua: text('ua'),
  ref: text('ref'),
  clicked_at: integer('clicked_at', { mode: 'timestamp' }),
});

export const pages = sqliteTable('pages', {
  slug: text('slug').primaryKey(),
  type: text('type').notNull(),              // 'jiwon' | 'wedding' | 'sinhon' | 'guide'
  region_id: text('region_id'),
  title: text('title').notNull(),
  status: text('status').notNull(),          // 'draft' | 'enriched' | 'quality_passed' | 'published' | 'noindex'
  quality_score: integer('quality_score'),   // 게이트 통과 점수
  ai_commentary: text('ai_commentary'),
  faq_json: text('faq_json'),                // JSON string
  last_published_at: integer('last_published_at', { mode: 'timestamp' }),
  last_audited_at: integer('last_audited_at', { mode: 'timestamp' }),
});

export const forbidden_words_log = sqliteTable('forbidden_words_log', {
  page_slug: text('page_slug'),
  word: text('word'),
  context: text('context'),
  detected_at: integer('detected_at', { mode: 'timestamp' }),
});
```

### 5.3 디렉토리 구조

```
sinhonjigi/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # 홈·About·고지
│   │   ├── jiwon/                    # 지원금 허브
│   │   ├── wedding/                  # 결혼 허브
│   │   ├── sinhon/                   # 신혼 허브
│   │   ├── learn/                    # 에버그린
│   │   ├── go/[id]/                  # CPA 리다이렉트
│   │   ├── api/
│   │   │   ├── cron/                 # Vercel Cron 엔드포인트
│   │   │   └── revalidate/           # ISR webhook
│   │   ├── sitemap.xml/
│   │   └── llms.txt/
│   ├── components/
│   │   ├── content/                  # 페이지 빌딩블록
│   │   │   ├── SubsidyCard.tsx
│   │   │   ├── ComparisonCards.tsx
│   │   │   ├── FairList.tsx
│   │   │   ├── FAQList.tsx
│   │   │   └── SourceAttribution.tsx
│   │   ├── cpa/
│   │   │   ├── CTACard.tsx           # 인라인 광고 라벨 강제 (P0)
│   │   │   └── CTAFooter.tsx
│   │   └── ui/                       # 공통 UI
│   ├── lib/
│   │   ├── db.ts                     # Turso 클라이언트
│   │   ├── gemini.ts                 # Gemini Flash 래퍼
│   │   ├── quality-gates.ts          # 6게이트 (§6.1)
│   │   ├── forbidden-words.ts        # 어휘 검수 (P0)
│   │   ├── cpa-matcher.ts            # 페이지-오퍼 매칭
│   │   └── tracking.ts               # sub_id 주입
│   ├── data/
│   │   ├── field-maps/               # Phase 0.5 산출물
│   │   ├── seed/                     # T1 도시 시드, 지자체 지원금 시드
│   │   └── forbidden-words.json
│   ├── db/
│   │   ├── schema.ts
│   │   └── migrations/
│   └── scripts/                      # GitHub Actions에서 호출
│       ├── ingest-bojo24.ts
│       ├── ingest-kosis.ts
│       ├── ingest-localdata.ts
│       ├── enrich-pages.ts
│       └── quality-audit.ts
├── public/
│   └── disclosure/                   # 광고 고지 정적 자산
├── .github/workflows/
│   ├── ingest-weekly.yml
│   └── quality-audit.yml
├── drizzle.config.ts
├── next.config.mjs
└── package.json
```

---

## 6. 품질 게이트 (Scaled Content Abuse 방어)

### 6.1 발행 전 6게이트 (필수 통과)

```ts
// src/lib/quality-gates.ts

export const QUALITY_GATES = {
  G1_UNIQUE_DATA_POINTS: 3,        // 지역 평균 비교·특이점·순위 등 3개 이상
  G2_AI_COMMENTARY_MIN_CHARS: 200, // Gemini 동적 프롬프트 결과 200자+
  G3_TITLE_SIMILARITY_MAX: 0.30,   // 기존 published 페이지와 30% 미만
  G4_FAQ_MIN_COUNT: 3,             // 각 50자+
  G5_CONDITIONAL_SECTION_MIN: 1,   // 조건부 섹션 1개 이상 활성화
  G6_COMPARISON_DATA: true,        // 지역 평균 대비 비교 데이터 포함
};
```

- **자동 차단**: 게이트 미통과 페이지는 `status='draft'` 유지, `published` 전환 차단
- **운영자 알림**: 주간 감사 리포트로 미통과 페이지 목록 메일 (Resend)
- **autofixable: false** — 본문 자동 재생성 금지 (Scaled Content Abuse 회피)

### 6.2 조건부 섹션 (페이지 고유성 확보)

같은 카테고리라도 데이터에 따라 다른 섹션이 렌더링되어야 함:

```ts
// L1 지역 페이지 예시
if (subsidies.length > avg_national_subsidies * 1.3)
  → "혜택 우수 지역" 배지 + 비교 박스
if (region.tier === 1 && upcomingFairs.length > 0)
  → "이번 달 박람회 N개" 상단 알림
if (newlywed_stats.homeowner_ratio < 0.20)
  → "이 지역 신혼 주거 마련 어려움" 섹션 + 주거 지원 강조
if (population < 50000)
  → "인근 도시 데이터로 안내" 섹션 (T2 패턴)
```

### 6.3 EEAT 시그널 (P0)

- `/about` 페이지: 운영자(또는 팀) 정체성 + 데이터 출처 + 갱신 정책
- L1 페이지 하단: "최근 업데이트 일시" + "다음 갱신 예정" + "출처: data.go.kr, [기관명]"
- L2 필러 작성자 표시 (실명 또는 운영팀명)
- 데이터 변경 이력 페이지 (Phase B 이후)

---

## 7. SEO & GEO

### 7.1 키워드 전략

- **박람회 SEO 직접 경쟁 회피**. 화력은 지원금·신혼통계·신혼주거에 집중
- 시드 키워드 50개 (Phase A 시작 전 Naver Searchad에서 검색량 확인):
  - 지원금 계열: "신혼부부 전세자금 대출", "[지역] 결혼 축하금", "신혼희망타운"
  - 결혼 비용: "결혼식 평균 비용", "스드메 가격"
  - 박람회: "[지역] 웨딩박람회" (보조)
  - 지역: "[지역] 신혼부부 지원"

### 7.2 인덱싱 전략

- **계층형**: 허브 + 상위 20% 인덱싱
- **시드 단계**: T1 전체 + L2 필러 10개 + 에버그린 3개를 시드 인덱싱 대상
- **승격 트리거**: GSC에서 노출·클릭 발생 시 T3 페이지 index 승격
- **sitemap.xml**: type별 분할 (jiwon, wedding, sinhon, guide, learn)

### 7.3 GEO/AEO (LLM 인용)

- **llms.txt**: Phase C에서 활성. 시작 전엔 깔지 X
- **구조화 청크**: 각 L1 페이지에 50~150자 단위 정보 블록 강제 (LLM 인용률 ~2.3배)
- **JSON-LD**: `FAQPage`, `Article`, `BreadcrumbList`, `Dataset` (KOSIS·LOCALDATA 출처 활용)

---

## 8. CPA 통합

### 8.1 매칭 로직

```ts
// src/lib/cpa-matcher.ts

function matchOffers(page: Page): CpaOffer[] {
  const candidates = db.cpa_offers.filter(o =>
    o.status === 'active' &&
    (
      o.region_id === page.region_id ||
      (o.region_inferred && isNearRegion(o.region_id, page.region_id)) ||
      o.region_id === null  // 전국 오퍼
    )
  );
  return candidates.sort((a, b) => b.priority - a.priority).slice(0, 3);
}
```

### 8.2 추적 (`/go/[offer_id]`)

```ts
// src/app/go/[id]/route.ts

export async function GET(req: Request, { params }) {
  const offer = await db.cpa_offers.findFirst({ where: { id: params.id, status: 'active' } });
  if (!offer) return Response.redirect('/', 302);

  const url = new URL(req.url);
  const page_slug = url.searchParams.get('from') || 'unknown';
  const region_id = url.searchParams.get('region') || null;
  const sub_id = `${page_slug}__${region_id}__${nanoid(6)}`;

  // 비동기 클릭 로그 (응답 지연 X)
  db.cpa_clicks.insert({ id: nanoid(), offer_id: offer.id, page_slug, region_id, sub_id, ua: req.headers.get('ua'), ref: req.headers.get('referer'), clicked_at: new Date() }).catch(()=>{});

  const target = new URL(offer.landing_url);
  if (offer.sub_id_param) target.searchParams.set(offer.sub_id_param, sub_id);
  return Response.redirect(target.toString(), 302);
}
```

### 8.3 광고 고지 (P0 — 코드 레벨 강제)

- `<CTACard>` 컴포넌트는 **인라인 "광고" 라벨 없이 렌더링 불가** (TypeScript 필수 prop)
- 페이지 하단 일괄 광고 고지 박스
- `/disclosure` 페이지로 상세 고지 분리

```tsx
// src/components/cpa/CTACard.tsx
interface Props {
  offer: CpaOffer;
  page_slug: string;
  region_id: string | null;
  adLabel: '광고' | '제휴 광고';   // 필수, 생략 불가
}
```

---

## 9. 법적 안전 장치 (P0)

### 9.1 어휘 금지어 (빌드 단계 차단)

`src/data/forbidden-words.json`:

```json
{
  "absolute": ["총정리", "완벽", "최저가", "1위", "필수", "반드시", "100%", "유일한"],
  "ranking_without_basis": ["TOP", "BEST", "추천", "인기"],
  "exception_with_basis": "랭킹/추천은 산정 기준 박스를 동반할 때만 허용"
}
```

- 빌드 시 `published` 페이지 본문·제목 스캔
- 절대표현 발견 시 빌드 실패
- 랭킹 어휘는 산정 기준 박스 동반 여부 체크

### 9.2 광고 고지 (구체 문구)

페이지 하단:
> 이 페이지는 제휴 광고를 포함합니다. 사용자가 광고 링크를 통해 신청·구매할 경우 본 사이트가 광고주로부터 수수료를 지급받을 수 있으나, 콘텐츠 작성에 영향을 미치지 않습니다.

인라인 (CTA 옆):
> [광고]

`/disclosure` 페이지:
- 어떤 광고주와 제휴 중인지 (CPA 네트워크명, 광고주 카테고리)
- 수수료 구조 일반론
- 사용자 데이터 처리 여부 (광고주 랜딩 직송이므로 우리는 클릭 sub_id만)

### 9.3 개인정보 (리드폼 X)

- **v1 절대 원칙**: 사용자 입력 폼 일체 금지. CTA는 외부 광고주 랜딩 직송만
- `/privacy` 처리방침에 명시:
  - 수집 정보: 접속 로그, 쿠키 (최소화)
  - CPA 추적: sub_id 파라미터 (광고주에 전달, 우리도 통계 보관)
  - 제3자 제공: 사용자가 광고주 사이트로 이동 시 우리는 sub_id만 전달
  - 보유 기간: 클릭 로그 12개월
- Phase C 이후 리드폼 도입 시 광고주별 분리 동의 시스템 별도 설계

### 9.4 결혼중개업법·금융광고 회피

- 결혼정보회사 CPA는 **보조 오퍼만**. 직접 매칭 알선·소개 문구 금지
- 신혼 대출(디딤돌·버팀목) 페이지는 **정보 제공만**. 비교·중개·상담 알선 X
- 금융 광고(보험·대출 비교)는 Phase B 이후 별도 검토 (금소법·대부업법)

---

## 10. Phase별 실행 계획

### 10.1 Phase A — 시드 (1~2개월)

**목표**: T1 60페이지 발행, 일 방문자 100~300, CPA 클릭 측정 시작

| 단계 | 기간 | 산출물 |
|------|------|------|
| 0.5 API 실측 (Limo) | 1주 | `data/field-maps/*.json` |
| 1. 인프라 셋업 | 3일 | Next.js·Turso·Vercel·GitHub Actions 세팅 |
| 2. DB 스키마 + 마이그레이션 | 2일 | Drizzle schema 적용 |
| 3. 시드 데이터 적재 | 1주 | T1 50도시 + KOSIS 통계 + LOCALDATA 예식장 + 시드 지자체 지원금 30~50건 |
| 4. CPA 네트워크 1차 가입 (Limo) | 3일 | 애드릭스 또는 CPA천국, 최소 5개 오퍼 등록 |
| 5. 페이지 템플릿 + 컴포넌트 | 1주 | L1 3종 (jiwon/wedding/sinhon) + CTACard |
| 6. 품질 게이트 + 어휘 검수 | 3일 | quality-gates.ts + forbidden-words 시스템 |
| 7. AI 보강 파이프라인 | 1주 | Gemini Flash 동적 프롬프트 (지역·카테고리별) |
| 8. SEO 기본 + 광고 고지 | 3일 | sitemap·JSON-LD·`/disclosure`·`/privacy`·`/about` |
| 9. 발행 + GSC 등록 | 2일 | 60페이지 published |
| 10. 측정 셋업 | 2일 | GA4·Vercel Analytics·CPA 클릭 추적 검증 |

**Phase A KPI 검증 (2개월 시점)**:
- 일 방문자 100 이상
- CPA 클릭률 1.0% 이상
- 전환 1건 이상
- 셋 중 둘 이상 미달 시 → 전략 재검토

### 10.2 Phase B — 성장 (3~6개월)

- T2 ~80페이지 추가 (총 ~140)
- L2 필러 30~50개 (AI 보조 + 사람 마무리, 분기 5~10개 한정)
- 박람회 일정 자동 동기화 (단 광고주 데이터 ToS 준수)
- CPA 오퍼 확장 (스드메·웨딩홀·결혼정보회사 보조)
- 백링크 시드 (bojo24 내부 링크 + 카페·블로그 시드)
- GSC 트래픽 추이 보고 T3 점진 승격

### 10.3 Phase C — 확장 (6~12개월)

- T3 점진 인덱싱 (트래픽 발생한 페이지만)
- 1차 데이터 적재 (사용자 비용 입력 기반 통계 — 별도 동의 시스템 필요)
- LLM 인용 최적화 (llms.txt 활성, structured chunks 강화)
- 지원금 계산기 (연령·소득 입력 → 받을 수 있는 지원금 합계)
- 가전 CPS, 신혼여행 패키지 등 부수 CPA 추가
- (선택) 애드센스 병행 검토 — L1 정보 페이지만, L2 필러는 CPA 집중

---

## 11. Phase A 실행 순서 (Claude Code 자율 실행용)

> **선행 조건**:
> - Limo가 §4.3 필드 매핑표 4개 작성 완료
> - Limo가 CPA 네트워크 1곳 가입 및 최소 5개 오퍼 정보 확보
> - Limo가 도메인 확정 및 Vercel Pro 프로젝트 생성

### 11.1 작업 순서

1. **레포 초기화**
   - Next.js 15 + TypeScript strict + Tailwind + shadcn/ui
   - Drizzle + Turso 연결
   - ESLint·Prettier·Husky

2. **DB 스키마 적용**
   - `src/db/schema.ts` 작성 (§5.2 그대로)
   - Drizzle 마이그레이션 실행

3. **시드 데이터 적재**
   - `scripts/seed-regions.ts`: T1 50개 + T2 80개 + T3 나머지 (인구·박람회 데이터 기반)
   - `scripts/ingest-bojo24.ts`: 보조금24 API → subsidies 테이블 (필드맵 사용)
   - `scripts/ingest-kosis.ts`: KOSIS API → marriage_stats, newlywed_stats
   - `scripts/ingest-localdata.ts`: LOCALDATA → wedding_halls (초기 다운로드 + 증분 API)
   - `data/seed/jicha-subsidies.json`: 지자체 결혼·신혼 지원금 30~50건 수기 시드

4. **CPA 오퍼 시드**
   - `data/seed/cpa-offers.json`: Limo 제공 오퍼 5개+
   - `scripts/seed-cpa.ts`: cpa_offers 테이블 적재

5. **컴포넌트 빌딩블록**
   - `SubsidyCard`, `ComparisonCards`, `FairList`, `FAQList`, `SourceAttribution`
   - `CTACard` (인라인 광고 라벨 필수 prop)
   - `CTAFooter`

6. **품질 게이트 시스템**
   - `lib/quality-gates.ts` (6게이트)
   - `lib/forbidden-words.ts` + 빌드 단계 통합
   - `scripts/quality-audit.ts` (주간 감사)

7. **AI 보강**
   - `lib/gemini.ts` (Flash 래퍼, 비용 모니터링 포함)
   - `scripts/enrich-pages.ts`: 페이지별 동적 프롬프트 → ai_commentary, faq_json 저장
   - 프롬프트 템플릿: 카테고리·지역·데이터 컨텍스트 주입

8. **페이지 템플릿**
   - `/jiwon/[region]/page.tsx` (L1 jiwon)
   - `/wedding/[region]/page.tsx` (L1 wedding)
   - `/sinhon/[region]/page.tsx` (L1 sinhon)
   - 모바일 우선, 실행 정보 → 비교 데이터 → FAQ 순

9. **CPA 추적**
   - `/go/[id]/route.ts` (§8.2)
   - cpa_clicks 테이블 적재 검증

10. **SEO 기본**
    - `sitemap.xml` (type별 분할)
    - JSON-LD 컴포넌트 (`FAQPage`, `Article`, `BreadcrumbList`, `Dataset`)
    - robots.txt
    - `/about`, `/privacy`, `/terms`, `/disclosure`, `/contact` 정적 페이지

11. **Vercel Cron**
    - 매주 일요일 03:00 보조금24·복지로 갱신
    - 매주 일요일 04:00 LOCALDATA 갱신
    - 매일 02:00 CPA 오퍼 만료 체크

12. **빌드·검증**
    - 60페이지 quality_passed 확인
    - 어휘 검수 통과 확인
    - 광고 고지 누락 검수

13. **발행 + 측정 셋업**
    - Vercel 배포
    - GSC 등록 + sitemap 제출
    - GA4 연동
    - CPA 클릭 추적 end-to-end 검증

### 11.2 산출물 체크리스트 (Claude Code 완료 보고용)

- [ ] 레포 구조 §5.3 일치
- [ ] DB 스키마 §5.2 일치
- [ ] T1 50도시 시드 완료
- [ ] subsidies ≥ 200건 (전국 + 지자체)
- [ ] marriage_stats / newlywed_stats 시군구별 1년치
- [ ] wedding_halls ≥ T1 도시별 5건
- [ ] cpa_offers ≥ 5건 active
- [ ] L1 페이지 60개 quality_passed
- [ ] 어휘 금지어 빌드 검수 통과
- [ ] CTACard 인라인 광고 라벨 의무화 확인
- [ ] /go/[id] sub_id 주입 + cpa_clicks 적재 검증
- [ ] /about, /privacy, /disclosure 발행
- [ ] sitemap·JSON-LD 검증
- [ ] Vercel Cron 3종 동작 확인
- [ ] GSC·GA4 연동 확인

---

## 12. 미해결 항목 (Limo 결정 필요)

| 항목 | 결정 시점 | 비고 |
|------|---------|------|
| 도메인 확정 | Phase A 시작 전 | "지기" 시리즈 우선 검토 |
| CPA 네트워크 1차 가입처 | Phase A 시작 전 | 애드릭스 또는 CPA천국 추천 |
| 운영자 정체성 | About 페이지 작성 시 | 실명·필명·팀명 중 선택 |
| 박람회 데이터 수동 vs 협업 | Phase B 진입 시 | 광고주 데이터 ToS 검토 필요 |
| 애드센스 병행 여부 | Phase C 진입 시 | L1만 부착 검토 |

---

## 부록 A — 페르소나 스트레스 테스트 요약

| 페르소나 | 핵심 punch | 반영 위치 |
|---------|---------|---------|
| 공정위 표시광고 심사관 | 어휘·고지·랭킹 산정 기준 | §9.1, §9.2 |
| 개인정보보호위 조사관 | 리드폼 X, 광고주 랜딩 직송 | §9.3 |
| 결혼업계 마케터 | 트래픽 보수화, 박람회 SEO 회피, 지원금 집중 | §2.2, §7.1 |
| Google 코어 업데이트 평가관 | EEAT, 운영자 정체성, L2 필러 AI+사람 | §6.3, §10.2 |
| 결혼 예정 실사용자 | 실행 정보 우선, 모바일 카드, 광고 라벨 시각 조정 | §3.4 (L1 구조) |

---

## 부록 B — 경쟁자 분석 (Phase A 시작 전 참고)

| 사이트 | 점유 키워드 | 톤 | 우리와 충돌 |
|------|---------|-----|---------|
| weddingfair.seoul.kr (웨딩in) | "[지역] 웨딩박람회" | 친구·가이드 | 박람회 SEO 직접 충돌 (회피) |
| wedding-info.co.kr | 박람회 일정 | 단순 디렉토리 | 박람회 SEO 충돌 (회피) |
| wed-info.kr | 박람회 일정 + 무료초대권 | 단순 디렉토리 | 충돌 (회피) |
| weddingfair.co.kr | 전국 박람회 분포 | 디렉토리 | 충돌 (회피) |
| weddingeve.co.kr | 박람회 129개 | 디렉토리 | 충돌 (회피) |
| 보조금24 (정부 공식) | 지원금 | 공공 | 차별화 필요 (해석·비교·시각화) |
| 복지로 | 복지 서비스 | 공공 | 차별화 필요 |

**결론**: 박람회·예식장은 레드오션. 지원금·신혼통계·신혼주거는 정부 공식 사이트 외 경쟁자 없음. 우리 화력은 후자에 집중.

---

## 부록 C — 참고 사항

- **호출 제한**: data.go.kr 거의 모든 API가 개발 1,000건/일, 운영 100,000건/일. 활용사례 등록 시 증가. 병렬 대량 수집 불가 → 체크포인트·증분 설계 필수.
- **LOCALDATA OPEN API**: 변동분만 제공. 전체 데이터는 다운로드 페이지에서 초기 적재.
- **표준데이터셋**: 행정안전부 표준화 약 300종. 전국 동일 스키마 + 위경도 포함.
- **CPA 단가 보정**: 헤드라인 3~5만원은 마케터 실수령액. 단 광고주 승인율(통상 70~85%) 반영 시 실효 단가는 75% 수준 가정 안전.
- **결혼·신혼 지원금 큐레이션**: 지자체별 고시는 API 없음. 분기 1회 수동 큐레이션. 변동 잦으니 last_verified_at 필수.

---

## 부록 D — Phase A Claude Code 실행 보조

> 이 부록은 Phase A 자율 실행을 100% 가능하게 하기 위한 즉시 사용 가능 자산 모음. Claude Code는 이 부록의 템플릿·스키마·예시를 출발점으로 사용하고, 변경 시 사유를 commit message에 명시한다.

### D-1. Gemini 프롬프트 템플릿

#### D-1.1 공통 시스템 프롬프트 (`src/lib/prompts/system.ts`)

```ts
export const SYSTEM_PROMPT = `
당신은 한국의 결혼·신혼 정보 사이트 "신혼지기"의 콘텐츠 생성 보조입니다.

[필수 규칙]
- 출력 언어: 한국어 (존댓말, 간결한 정보 톤)
- 절대 사용 금지 어휘: 총정리, 완벽, 최저가, 1위, 필수, 반드시, 100%, 유일한, TOP, BEST, 추천, 인기
- 출처 불명 정보 추측 금지. 입력 데이터에 없는 사실은 작성하지 않음
- 광고주 주장이나 가격 약속을 자체 단언으로 작성 금지
- 의료·법률·금융 자문에 해당할 수 있는 단정 표현 금지 (예: "받을 수 있습니다" → "조건에 부합하면 신청 대상이 될 수 있습니다")
- 사용자 행동을 강요하는 표현 금지

[출력 형식]
반드시 다음 JSON 스키마로만 응답하세요. 마크다운 코드 펜스 없이 raw JSON.
{
  "commentary": "200~400자, 데이터 해석과 맥락 제시",
  "faqs": [
    {"q": "질문 50자 이내", "a": "답변 80~200자"},
    ... 3~5개
  ]
}
`;
```

#### D-1.2 jiwon (지원금) enrich 프롬프트

```ts
export function jiwonPrompt(ctx: {
  region: Region;
  subsidies: Subsidy[];
  nationalAvgSubsidies: number;
  newlywedStats?: NewlywedStat;
}): string {
  return `
[지역] ${ctx.region.name} (인구 ${ctx.region.population?.toLocaleString() ?? '미상'})

[받을 수 있는 결혼·신혼 지원금]
${ctx.subsidies.map(s => `- ${s.name}: ${s.amount_text ?? s.amount_won + '원'} (${s.eligibility?.slice(0, 80)})`).join('\n')}

[전국 평균과 비교]
- 이 지역 지원금 수: ${ctx.subsidies.length}건
- 전국 평균: ${ctx.nationalAvgSubsidies}건

[신혼부부 통계 (해당 지역, 있을 경우)]
${ctx.newlywedStats ? `
- 평균 소득: ${ctx.newlywedStats.avg_income_won?.toLocaleString()}원
- 자가 보유율: ${(ctx.newlywedStats.homeowner_ratio ?? 0) * 100}%
- 맞벌이 비율: ${(ctx.newlywedStats.dual_income_ratio ?? 0) * 100}%
` : '데이터 없음 — 통계 인용 금지'}

[작성 지침]
- commentary: 이 지역 신혼부부가 활용할 수 있는 지원금의 특징과 전국 평균 대비 위치를 객관적으로 정리
- faqs: 자격 요건·신청처·중복 가능 여부·신청 시 주의사항 위주
- 지자체 데이터가 부족하면 "지자체 공식 안내를 확인해야 합니다"로 매듭
`;
}
```

#### D-1.3 wedding (결혼) enrich 프롬프트

```ts
export function weddingPrompt(ctx: {
  region: Region;
  halls: WeddingHall[];
  marriageStats?: MarriageStat;
  upcomingFairs: CpaOffer[];     // 박람회 매칭된 active 오퍼
}): string {
  return `
[지역] ${ctx.region.name}

[예식장 현황 (LOCALDATA 기준)]
- 영업 중 예식장 수: ${ctx.halls.filter(h => h.status === '영업/정상').length}
- 최근 5년 신규 허가: ${ctx.halls.filter(h => isRecent(h.permit_date, 5)).length}
- 폐업/휴업: ${ctx.halls.filter(h => h.status !== '영업/정상').length}

[혼인 통계]
${ctx.marriageStats ? `
- 작년 혼인 건수: ${ctx.marriageStats.total_marriages?.toLocaleString()}건
- 평균 혼인 연령 (남/녀): ${ctx.marriageStats.avg_age_male}세 / ${ctx.marriageStats.avg_age_female}세
` : '데이터 없음'}

[다가오는 박람회]
${ctx.upcomingFairs.length > 0
  ? ctx.upcomingFairs.map(f => `- ${f.brand}`).join('\n')
  : '이 지역 박람회 오퍼 없음 — 박람회 언급 금지'}

[작성 지침]
- commentary: 이 지역 결혼 시장 데이터적 특징. 예식장 분포·혼인 추이 등
- 박람회 오퍼가 없으면 박람회 관련 멘트 금지
- faqs: 예식장 선택 기준·평균 비용 가늠·박람회 활용 방법(오퍼 있을 때만)
`;
}
```

#### D-1.4 sinhon (신혼) enrich 프롬프트

```ts
export function sinhonPrompt(ctx: {
  region: Region;
  newlywedStats?: NewlywedStat;
  housingSupports: Subsidy[];     // category='housing'
  nationalNewlywedStats: NewlywedStat;
}): string {
  return `
[지역] ${ctx.region.name}

[이 지역 신혼부부 통계]
${ctx.newlywedStats ? `
- 평균 소득: ${ctx.newlywedStats.avg_income_won?.toLocaleString()}원
- 자가 보유율: ${(ctx.newlywedStats.homeowner_ratio ?? 0) * 100}%
- 맞벌이 비율: ${(ctx.newlywedStats.dual_income_ratio ?? 0) * 100}%
` : '데이터 없음'}

[전국 평균]
- 평균 소득: ${ctx.nationalNewlywedStats.avg_income_won?.toLocaleString()}원
- 자가 보유율: ${(ctx.nationalNewlywedStats.homeowner_ratio ?? 0) * 100}%

[신혼 주거 지원]
${ctx.housingSupports.map(s => `- ${s.name}: ${s.amount_text}`).join('\n')}

[작성 지침]
- commentary: 이 지역 신혼부부의 경제·주거 상황을 전국 평균과 비교
- 대출·금융상품을 추천하거나 비교하는 표현 금지 (정보 제공만)
- faqs: 주거지원 신청 조건·자격·중복 가능 여부 위주
`;
}
```

#### D-1.5 호출 가드레일

```ts
// src/lib/gemini.ts
export const GEMINI_GUARDS = {
  MAX_TOKENS_PER_PAGE: 1500,
  MAX_PAGES_PER_HOUR: 100,
  MAX_COST_PER_DAY_USD: 5,         // 초과 시 자동 중단
  RETRY_MAX: 2,
  TIMEOUT_MS: 30000,
};
```

호출 후 검수:
- 출력 JSON 파싱 실패 → 1회 재시도 → 실패 시 page.status='draft' 유지
- 금지어 발견 → 1회 재시도 → 실패 시 차단
- 200자 미만 → page.status='draft' 유지

### D-2. 시드 데이터 JSON 스키마

#### D-2.1 지자체 결혼·신혼 지원금 시드 (`data/seed/jicha-subsidies.json`)

Limo가 30~50건 수기 큐레이션. 형식:

```json
[
  {
    "id": "seoul-mapo-marriage-2026",
    "region_id": "seoul-mapo",
    "category": "marriage",
    "name": "마포구 결혼 축하 지원금",
    "amount_won": 1000000,
    "amount_text": "100만원 (1회성)",
    "eligibility": "혼인신고일 기준 마포구 거주 1년 이상, 부부 합산 소득 8천만원 이하",
    "application": "마포구청 사회복지과 또는 정부24",
    "source_url": "https://www.mapo.go.kr/...",
    "source_name": "마포구청",
    "effective_from": "2026-01-01",
    "effective_to": null,
    "status": "active",
    "last_verified_at": "2026-05-29"
  },
  {
    "id": "national-newlywed-jeonse-2026",
    "region_id": null,
    "category": "newlywed",
    "name": "신혼부부 전용 전세자금 대출",
    "amount_won": null,
    "amount_text": "최대 2.2억원, 금리 1.2~2.4%",
    "eligibility": "혼인 7년 이내, 부부 합산 연소득 7천5백만원 이하",
    "application": "주택도시기금 수탁은행 (우리·국민·신한·하나·농협)",
    "source_url": "https://nhuf.molit.go.kr/...",
    "source_name": "주택도시기금",
    "effective_from": "2026-01-01",
    "effective_to": null,
    "status": "active",
    "last_verified_at": "2026-05-29"
  }
]
```

**큐레이션 가이드**:
- 시드 30건 우선순위: 인구 상위 10개 시군구 × 결혼/신혼/주거 각 1건
- 전국 지원금 (정부 사업) 별도 5~10건
- 각 항목 `last_verified_at` 필수. 분기마다 재검증
- `amount_text`는 사용자에게 그대로 노출되는 문구 → 정확성 우선

#### D-2.2 CPA 오퍼 시드 (`data/seed/cpa-offers.json`)

```json
[
  {
    "id": "cpah-direct-seoul-2026",
    "vertical": "fair",
    "advertiser": "CPA천국",
    "brand": "다이렉트 결혼준비 웨딩박람회",
    "region_id": "seoul-gangnam",
    "region_inferred": true,
    "payout_won": 40000,
    "landing_url": "https://example-network.kr/track/abc123",
    "sub_id_param": "subid",
    "status": "active",
    "start_date": "2026-05-29",
    "end_date": null,
    "priority": 9,
    "notes": "매주 주말 상시 박람회, 인근 지역 유도 가능"
  }
]
```

#### D-2.3 region 시드 (`data/seed/regions.json`)

```json
[
  {
    "id": "seoul-mapo",
    "sido": "서울특별시",
    "sigungu": "마포구",
    "name": "서울특별시 마포구",
    "tier": 1,
    "population": 372000,
    "lat": 37.5663,
    "lng": 126.9019
  }
]
```

T1 50개 결정 알고리즘은 §3.2 그대로. 시드는 `scripts/seed-regions.ts`에서 행정안전부 표준데이터셋 기반으로 자동 생성.

#### D-2.4 forbidden-words (`src/data/forbidden-words.json`)

```json
{
  "absolute": [
    "총정리", "완벽", "최저가", "1위", "필수", "반드시",
    "100%", "유일한", "단독", "독점", "최고"
  ],
  "ranking_keywords": ["TOP", "BEST", "추천", "인기"],
  "ranking_exception_required_box": "ranking_basis",
  "exemptions": {
    "in_quotes": true,
    "in_source_attribution": true
  }
}
```

빌드 시 published 페이지 본문·제목·메타 스캔. 절대표현 발견 시 빌드 실패. 랭킹 키워드는 `<RankingBasisBox>` 컴포넌트 동반 시 허용.

### D-3. L1 페이지 JSX 골격

#### D-3.1 `/jiwon/[region]/page.tsx`

```tsx
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { matchOffers } from '@/lib/cpa-matcher';
import {
  PageHeader, SubsidyCard, ComparisonCards, FAQList,
  SourceAttribution, AdDisclosure
} from '@/components/content';
import { CTACard, CTAFooter } from '@/components/cpa';

export const revalidate = 86400;

export async function generateStaticParams() {
  const regions = await db.regions.findMany({ where: { tier: { lte: 2 } } });
  return regions.map(r => ({ region: r.id }));
}

export default async function JiwonRegionPage({ params }: { params: { region: string } }) {
  const region = await db.regions.findFirst({ where: { id: params.region } });
  if (!region) notFound();

  const page = await db.pages.findFirst({
    where: { slug: `jiwon/${region.id}`, status: 'published' }
  });
  if (!page) notFound();

  const subsidies = await db.subsidies.findMany({
    where: { region_id: { in: [region.id, null] }, status: 'active' }
  });
  const newlywedStats = await db.newlywed_stats.findFirst({
    where: { region_id: region.id }, orderBy: { year: 'desc' }
  });
  const nationalAvg = await db.newlywed_stats.findFirst({
    where: { region_id: null }, orderBy: { year: 'desc' }
  });

  const offers = matchOffers({ region_id: region.id, page_slug: `jiwon/${region.id}` });
  const primaryOffer = offers[0];
  const secondaryOffer = offers[1];

  const faqs = JSON.parse(page.faq_json ?? '[]');

  // 조건부 섹션 활성화 (§6.2, D-4)
  const flags = computeConditionalFlags({ region, subsidies, newlywedStats, nationalAvg, offers });

  return (
    <article>
      <PageHeader
        title={`${region.name} 결혼·신혼 지원금`}
        updatedAt={page.last_published_at}
      />

      {flags.benefitsAboveAverage && (
        <div className="badge">혜택 우수 지역</div>
      )}

      {/* 1. 실행 정보 (메인) */}
      <section className="actions">
        <h2>받을 수 있는 지원금</h2>
        <div className="cards">
          {subsidies.map(s => <SubsidyCard key={s.id} subsidy={s} />)}
        </div>
      </section>

      {/* 2. CPA CTA #1 */}
      {primaryOffer && (
        <CTACard
          offer={primaryOffer}
          page_slug={`jiwon/${region.id}`}
          region_id={region.id}
          adLabel="광고"
        />
      )}

      {/* 3. 비교 데이터 (보조) */}
      <section className="comparison">
        <h2>전국 평균과 비교</h2>
        <ComparisonCards
          region={region}
          regionStats={newlywedStats}
          nationalStats={nationalAvg}
        />
      </section>

      {/* 4. AI 코멘터리 */}
      {page.ai_commentary && (
        <section className="commentary">
          <p>{page.ai_commentary}</p>
        </section>
      )}

      {/* 5. T2 패턴: 인근 도시 박람회 유도 */}
      {flags.suggestNearbyFair && (
        <section className="nearby-fair">
          <h3>인근 지역 박람회</h3>
          {/* 인근 T1 오퍼 카드 */}
        </section>
      )}

      {/* 6. FAQ */}
      <FAQList items={faqs} />

      {/* 7. CPA CTA #2 (덜 강한) */}
      {secondaryOffer && (
        <CTAFooter offer={secondaryOffer} page_slug={`jiwon/${region.id}`} region_id={region.id} />
      )}

      {/* 8. 출처 + 광고 고지 */}
      <SourceAttribution
        sources={[
          { name: '보조금24', url: 'https://www.gov.kr/...' },
          { name: 'KOSIS 신혼부부 통계', url: 'https://kosis.kr/...' },
        ]}
        lastUpdatedAt={page.last_published_at}
      />
      <AdDisclosure />

      {/* 9. JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildJsonLd({ page, region, faqs }))
      }} />
    </article>
  );
}
```

**`/wedding/[region]/page.tsx`와 `/sinhon/[region]/page.tsx`는 동일 패턴**. 데이터 소스(예식장·박람회 / 신혼통계·주거지원)와 섹션 순서만 조정. 차이는 D-1.3·D-1.4 프롬프트 + D-4 조건부 룰셋에 명시.

### D-4. 조건부 섹션 룰셋 (전체)

`src/lib/conditional-flags.ts`:

| Flag | Trigger | Section / 효과 |
|------|---------|-------------|
| `benefitsAboveAverage` | `subsidies.length >= nationalAvg * 1.3` | "혜택 우수 지역" 배지 + 비교 박스 강조 |
| `benefitsBelowAverage` | `subsidies.length <= nationalAvg * 0.7` | "지자체 자체 지원 적은 지역" 안내 + 정부 사업 강조 |
| `urgentDeadline` | `subsidy.effective_to within 30 days` | 해당 지원금 카드 상단 "마감 임박" 라벨 |
| `recentlyUpdated` | `page.last_published_at within 7 days` | 헤더 "최근 업데이트" 배지 |
| `lowHomeownerRatio` | `newlywedStats.homeowner_ratio < 0.20` | "신혼 주거 마련 어려운 지역" 섹션 + 주거 지원 강조 |
| `highDualIncome` | `newlywedStats.dual_income_ratio > 0.65` | "맞벌이 비중 높은 지역" 인사이트 카드 |
| `manyHalls` | `halls.length > regionAvgHalls * 1.5` | "예식장 선택지 풍부" 인사이트 |
| `decliningHalls` | `recentNewHalls < recentClosedHalls` | "신규 예식장 감소 추이" 인사이트 |
| `t1WithUpcomingFair` | `region.tier === 1 && upcomingFairs.length > 0` | 상단 "이번 달 박람회 N개" 알림 |
| `t2NeedNearbyFair` | `region.tier === 2 && nearbyT1Fairs.length > 0` | "인근 지역 박람회" 섹션 활성 |
| `noLocalFair` | `region.tier === 2 && nearbyT1Fairs.length === 0` | 박람회 섹션 자체 미렌더 |
| `smallPopulation` | `region.population < 50000` | "인근 도시 데이터 안내" 섹션, 데이터 보강 카드 |
| `noStatsData` | `!newlywedStats && !marriageStats` | 비교 섹션 미렌더, AI 코멘터리 톤 변경 |

**구현 규칙**:
- 모든 flag는 `computeConditionalFlags(ctx)` 함수에서 한 번에 계산
- 페이지마다 최소 1개 flag 활성화 강제 (G5 게이트)
- flag 미활성화 페이지는 `quality_passed` 차단

### D-5. About 페이지 콘텐츠 가이드

`/about` 페이지는 EEAT 핵심 자산. P0 우선순위.

#### D-5.1 필수 섹션 (순서대로)

1. **사이트 소개 (1단락, 100~200자)**
   - 무엇을 다루는지, 왜 만들었는지, 누구를 위한 사이트인지
2. **데이터 출처 (목록)**
   - 보조금24, 복지로, KOSIS, LOCALDATA, HUG 등 모두 명시
   - 각 출처에 공식 링크
3. **갱신 정책 (단락)**
   - 어떤 데이터를 얼마나 자주 갱신하는지 (§4.4 요약)
   - "마지막 검증일"이 페이지마다 표시된다는 안내
4. **운영자 정체성 (단락)**
   - 옵션 A: 실명 + 이력 + 연락처
   - 옵션 B: 필명/팀명 + 활동 영역 + 연락처
   - 옵션 C: 운영팀명 + 사업자등록정보 + 대표 연락처
5. **광고 및 수익 모델 (단락)**
   - "본 사이트는 광고와 제휴 마케팅으로 운영비를 충당합니다"
   - 어떤 광고주 카테고리와 제휴하는지 (구체 광고주명은 아님)
   - 광고가 콘텐츠 작성에 영향을 미치지 않는다는 원칙
6. **데이터 정확성 신고 (단락)**
   - 정정·삭제 요청 연락처
   - 일반적인 응답 시간

#### D-5.2 작성 톤

- **1인칭 단수("저는")보다 1인칭 복수("저희는") 또는 사이트명 3인칭** — 운영 팀 인상
- 과장 X, 감정적 표현 X
- "전문가", "최고", "유일" 등 절대표현 금지 (어휘 검수 동일 적용)
- 분량: 500~1,000자

#### D-5.3 운영자 정체성 선택 가이드 (Limo 의사결정)

| 옵션 | 장점 | 단점 | 적합 케이스 |
|------|------|------|---------|
| 실명 | EEAT 최강 | 개인 노출 부담 | 향후 강연·미디어 노출 의향 시 |
| 필명/팀명 + 이력 | 보호 + 신뢰 일부 | EEAT 시그널 약화 | 기본 권장 |
| 사업자 명의 | 신뢰 + 보호 | 사업자등록 필수 | 사업자등록 있는 경우 |

**추천**: 옵션 B (필명/팀명). 메모리에 일부 프로젝트는 "피클보리" 등 익명 운영 패턴이 있으므로 일관성 유지.

#### D-5.4 EEAT 시그널 체크리스트

- [ ] 데이터 출처 5개 이상 명시
- [ ] 갱신 정책 정량적 표현 (주 1회·월 1회 등)
- [ ] 운영자 정체성 + 연락처 (이메일 1개 이상)
- [ ] 광고 수익 모델 투명 공개
- [ ] 정정·삭제 신고 절차 명시
- [ ] About 페이지 사이트 푸터 + 헤더에 노출
- [ ] About 페이지 자체 JSON-LD `Organization` 또는 `Person` 스키마 삽입

---

**문서 끝.**
