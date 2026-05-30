import { SYSTEM_PROMPT } from "./system";
import type { Subsidy, Region, MarriageStat } from "@/types";

interface JiwonEnrichContext {
  region: Region;
  subsidies: Subsidy[];
  marriage_stats: MarriageStat | null;
}

export function buildJiwonPrompt(ctx: JiwonEnrichContext): string {
  const subsidyList = ctx.subsidies
    .map(
      (s) =>
        `- ${s.name}: ${s.amount_text ?? `${(s.amount_won ?? 0).toLocaleString()}원`} (${s.source_name ?? "출처미상"})`,
    )
    .join("\n");

  const statsText = ctx.marriage_stats
    ? `${ctx.marriage_stats.year}년 혼인건수: ${ctx.marriage_stats.total_marriages?.toLocaleString() ?? "미상"}건, 평균 초혼연령 남자 ${ctx.marriage_stats.avg_age_male ?? "미상"}세 / 여자 ${ctx.marriage_stats.avg_age_female ?? "미상"}세`
    : "혼인 통계 데이터 없음";

  return `${SYSTEM_PROMPT}

---

## 작성 대상
지역: ${ctx.region.name}
페이지 유형: 결혼 지원금 안내 페이지

## 보유 데이터
### 지원금 목록 (${ctx.subsidies.length}건)
${subsidyList || "등록된 지원금 없음"}

### 혼인 통계
${statsText}

## 작성 요청
위 데이터를 바탕으로 ${ctx.region.name} 결혼 지원금 페이지의 AI 코멘터리(200자 이상)를 작성하세요.
- 지역 특성과 지원금 특징을 연결하여 설명
- 신청 방법·자격 조건의 핵심 포인트 강조
- FAQ 3개 이상 (JSON 배열 형식: [{"question": "...", "answer": "..."}])

응답 형식:
COMMENTARY:
(코멘터리 내용)

FAQ_JSON:
(FAQ JSON 배열)
`;
}
