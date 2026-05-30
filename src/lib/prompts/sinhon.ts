import { SYSTEM_PROMPT } from "./system";
import type { Region, NewlywedStat, Subsidy } from "@/types";

interface SinhonEnrichContext {
  region: Region;
  newlywed_stats: NewlywedStat | null;
  housing_subsidies: Subsidy[];
}

export function buildSinhonPrompt(ctx: SinhonEnrichContext): string {
  const subsidyList = ctx.housing_subsidies
    .map(
      (s) =>
        `- ${s.name}: ${s.amount_text ?? `${(s.amount_won ?? 0).toLocaleString()}원`}`,
    )
    .join("\n");

  const statsText = ctx.newlywed_stats
    ? [
        `${ctx.newlywed_stats.year}년 신혼부부 통계`,
        `  - 평균 소득: ${ctx.newlywed_stats.avg_income_won ? `${Math.round(ctx.newlywed_stats.avg_income_won / 10000).toLocaleString()}만원` : "미상"}`,
        `  - 자가보유율: ${ctx.newlywed_stats.homeowner_ratio ? `${(ctx.newlywed_stats.homeowner_ratio * 100).toFixed(1)}%` : "미상"}`,
        `  - 맞벌이 비율: ${ctx.newlywed_stats.dual_income_ratio ? `${(ctx.newlywed_stats.dual_income_ratio * 100).toFixed(1)}%` : "미상"}`,
      ].join("\n")
    : "신혼부부 통계 데이터 없음";

  return `${SYSTEM_PROMPT}

---

## 작성 대상
지역: ${ctx.region.name}
페이지 유형: 신혼 생활 정보 안내 페이지

## 보유 데이터
### 주거 지원금 (${ctx.housing_subsidies.length}건)
${subsidyList || "등록된 주거 지원금 없음"}

### 신혼부부 통계
${statsText}

## 작성 요청
위 데이터를 바탕으로 ${ctx.region.name} 신혼 생활 페이지의 AI 코멘터리(200자 이상)를 작성하세요.
- 지역 신혼부부 현황과 주거 지원 연계 설명
- 실질적인 주거 자금 마련 방법 안내
- FAQ 3개 이상 (JSON 배열 형식)

응답 형식:
COMMENTARY:
(코멘터리 내용)

FAQ_JSON:
(FAQ JSON 배열)
`;
}
