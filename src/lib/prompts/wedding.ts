import { SYSTEM_PROMPT } from "./system";
import type { Region, WeddingHall, MarriageStat } from "@/types";

interface WeddingEnrichContext {
  region: Region;
  halls: WeddingHall[];
  marriage_stats: MarriageStat | null;
  has_fair: boolean;
}

export function buildWeddingPrompt(ctx: WeddingEnrichContext): string {
  const hallList = ctx.halls
    .slice(0, 10)
    .map(
      (h) =>
        `- ${h.name} (${h.address ?? "주소미상"}, 상태: ${h.status ?? "정보없음"})`,
    )
    .join("\n");

  const statsText = ctx.marriage_stats
    ? `${ctx.marriage_stats.year}년 혼인건수: ${ctx.marriage_stats.total_marriages?.toLocaleString() ?? "미상"}건`
    : "혼인 통계 데이터 없음";

  return `${SYSTEM_PROMPT}

---

## 작성 대상
지역: ${ctx.region.name}
페이지 유형: 결혼식 정보 안내 페이지

## 보유 데이터
### 예식장 목록 (총 ${ctx.halls.length}개 중 상위 10개)
${hallList || "등록된 예식장 없음"}

### 혼인 통계
${statsText}

### 웨딩박람회
${ctx.has_fair ? "해당 지역 또는 인근 웨딩박람회 정보 있음" : "웨딩박람회 정보 없음"}

## 작성 요청
위 데이터를 바탕으로 ${ctx.region.name} 결혼식 정보 페이지의 AI 코멘터리(200자 이상)를 작성하세요.
- 지역 예식 문화 특징과 예식장 선택 시 고려사항 설명
- 박람회 활용법 또는 주의사항 포함
- FAQ 3개 이상 (JSON 배열 형식)

응답 형식:
COMMENTARY:
(코멘터리 내용)

FAQ_JSON:
(FAQ JSON 배열)
`;
}
