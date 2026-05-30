# Status | 마지막: 2026-05-30

## 현재 작업
Phase A 개발 진행 중. 디자인 시스템 적용 + 빌드 성공 확인.

## 최근 변경 (최근 5개)
- 05-30: 맘스고고 디자인 시스템 적용 (라벤더-핑크 톤, Pretendard+Inter)
- 05-30: 홈 페이지 (HomeClient.tsx) — 허브카드 3종 + 지역 칩 + 가이드 카드
- 05-30: Header/Footer 맘스고고 스타일 (sticky blur, 슬라이드 메뉴)
- 05-30: About 페이지 디자인 완성
- 05-30: 빌드 성공 확인 (29 페이지), 브라우저 검증 완료

## TODO
- [ ] jiwon/[region] 페이지 디자인 개선 (현재 스타일 미적용)
- [ ] /jiwon, /wedding, /sinhon 허브 페이지 디자인
- [ ] wedding/[region], sinhon/[region] 페이지 구현
- [ ] privacy, terms, disclosure, contact 페이지 디자인
- [ ] Turso DB 연동 → Limo 작업 (.env.local 채우기)
- [ ] 시드 데이터 적재 (data/seed/*.json → DB push)
- [ ] 공공 API 필드맵 수령 후 ingest 스크립트 구현

## 결정사항
- 디자인: 맘스고고 라벤더-핑크 톤 적용 (웨딩 사이트에도 어울림)
- 폰트: Pretendard Variable (CDN) + Inter
- DB: Turso lazy init — 환경변수 없어도 빌드 성공
- UI 컴포넌트: shadcn @base-ui/react 제거, 직접 구현

## 주의
- `npm run lint` / `npx biome` 직접 호출 금지 (Stop hook 자동 처리)
- ingest 스크립트는 field-maps/*.json 수령 전 구현 금지
- CPA 오퍼 실제 값은 data/seed/cpa-offers.json 교체 필요
- dev 서버: `npm run dev` → http://localhost:3000
