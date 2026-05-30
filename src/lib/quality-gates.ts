import { checkForbiddenWords } from "./forbidden-words";
import type { FaqItem } from "@/types";

export const QUALITY_GATES = {
  G1_UNIQUE_DATA_POINTS: 3,
  G2_AI_COMMENTARY_MIN_CHARS: 200,
  G3_TITLE_SIMILARITY_MAX: 0.3,
  G4_FAQ_MIN_COUNT: 3,
  G5_CONDITIONAL_SECTION_MIN: 1,
  G6_COMPARISON_DATA: true,
} as const;

interface QualityContext {
  title: string;
  ai_commentary: string | null;
  faq_json: string | null;
  data_points: string[];
  has_comparison: boolean;
  conditional_sections: number;
  other_titles?: string[];
}

interface QualityResult {
  passed: boolean;
  gates: Record<string, boolean>;
  score: number;
}

function titleSimilarity(a: string, b: string): number {
  const setA = new Set(a.split(""));
  const setB = new Set(b.split(""));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

export function checkQuality(
  page: QualityContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _ctx: any,
): QualityResult {
  void _ctx;

  const gates: Record<string, boolean> = {};

  // G1: 고유 데이터 포인트 수
  gates["G1_UNIQUE_DATA_POINTS"] =
    page.data_points.length >= QUALITY_GATES.G1_UNIQUE_DATA_POINTS;

  // G2: AI 코멘터리 최소 글자수
  gates["G2_AI_COMMENTARY_MIN_CHARS"] =
    (page.ai_commentary?.length ?? 0) >=
    QUALITY_GATES.G2_AI_COMMENTARY_MIN_CHARS;

  // G3: 제목 유사도 (타 페이지와 중복 여부)
  const otherTitles = page.other_titles ?? [];
  const maxSimilarity = otherTitles.reduce((max, t) => {
    const sim = titleSimilarity(page.title, t);
    return sim > max ? sim : max;
  }, 0);
  gates["G3_TITLE_SIMILARITY_MAX"] =
    maxSimilarity <= QUALITY_GATES.G3_TITLE_SIMILARITY_MAX;

  // G4: FAQ 최소 개수
  let faqCount = 0;
  if (page.faq_json) {
    try {
      const faqs = JSON.parse(page.faq_json) as FaqItem[];
      faqCount = faqs.length;
    } catch {
      faqCount = 0;
    }
  }
  gates["G4_FAQ_MIN_COUNT"] = faqCount >= QUALITY_GATES.G4_FAQ_MIN_COUNT;

  // G5: 조건부 섹션 최소 1개
  gates["G5_CONDITIONAL_SECTION_MIN"] =
    page.conditional_sections >= QUALITY_GATES.G5_CONDITIONAL_SECTION_MIN;

  // G6: 비교 데이터 존재
  gates["G6_COMPARISON_DATA"] = page.has_comparison;

  // G7: 금지어 검사
  const forbiddenCheck = checkForbiddenWords(
    `${page.title} ${page.ai_commentary ?? ""}`,
  );
  gates["G7_NO_FORBIDDEN_WORDS"] = forbiddenCheck.found.length === 0;

  const passedCount = Object.values(gates).filter(Boolean).length;
  const totalCount = Object.keys(gates).length;
  const score = Math.round((passedCount / totalCount) * 100);
  const passed = passedCount === totalCount;

  return { passed, gates, score };
}
