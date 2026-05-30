import forbiddenWordsData from "@/data/forbidden-words.json";

const ABSOLUTE_WORDS: string[] = forbiddenWordsData.absolute;
const RANKING_KEYWORDS: string[] = forbiddenWordsData.ranking_keywords;
const RANKING_BASIS_INDICATORS: string[] =
  forbiddenWordsData.ranking_basis_indicators;

export interface ForbiddenWordResult {
  found: string[];
  hasRankingWithoutBasis: boolean;
}

export function checkForbiddenWords(text: string): ForbiddenWordResult {
  const found: string[] = [];

  // absolute 금지어 검사
  for (const word of ABSOLUTE_WORDS) {
    if (text.includes(word)) {
      found.push(word);
    }
  }

  // ranking 키워드 + 근거 없는 경우 검사
  let hasRankingWithoutBasis = false;
  for (const keyword of RANKING_KEYWORDS) {
    if (text.includes(keyword)) {
      // 근거 지시어가 인근 문맥(±50자)에 있는지 확인
      const idx = text.indexOf(keyword);
      const contextStart = Math.max(0, idx - 50);
      const contextEnd = Math.min(text.length, idx + keyword.length + 50);
      const context = text.slice(contextStart, contextEnd);
      const hasBasis = RANKING_BASIS_INDICATORS.some((indicator) =>
        context.includes(indicator),
      );
      if (!hasBasis) {
        hasRankingWithoutBasis = true;
        found.push(`${keyword}(근거없음)`);
      }
    }
  }

  return { found, hasRankingWithoutBasis };
}

export { ABSOLUTE_WORDS, RANKING_KEYWORDS };
