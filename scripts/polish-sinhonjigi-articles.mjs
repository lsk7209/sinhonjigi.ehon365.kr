import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "output", "sinhonjigi", "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const articles = manifest.articles || [];

const sectionTargets = {
  jiwon: 5200,
  wedding: 4300,
  sinhon: 3900,
};

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function list(value) {
  return Array.isArray(value) ? value.map(clean).filter(Boolean) : [];
}

function articlePath(article) {
  return path.join(root, article.draft_path || "");
}

function frontmatterOf(raw) {
  return raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)?.[0] || "";
}

function bodyOf(raw) {
  const frontmatter = frontmatterOf(raw);
  return frontmatter ? raw.slice(frontmatter.length).trim() : raw.trim();
}

function topic(article) {
  return clean(article.main_keyword || article.title).split(" ").slice(0, 6).join(" ");
}

function keyword(article, index, fallback) {
  return list(article.expanded_keywords)[index] || fallback;
}

function seed(article) {
  return Number(String(article.id || "").replace(/\D/g, "")) || 0;
}

function officialSources(article) {
  try {
    const research = JSON.parse(fs.readFileSync(path.join(root, article.research_path), "utf8"));
    return list(research.sources)
      .filter((source) => source && source.name && source.url)
      .slice(0, 3);
  } catch {
    return [];
  }
}

function removeProductionNotes(body) {
  return body
    .replace(/^## .*(가독성|확인 자료|확인자료).*\n[\s\S]*?(?=^## |\s*$)/gm, "")
    .replace(/\b[a-z]+(?:_[a-z]+)+_\d+\b/g, "")
    .replace(/\b(?:summary_box|decision_box|official_link_card|step_cards|fallback_route_box|comparison_table|checklist_box|caution_box|timeline|faq_block|risk_box|action_list|source_box|final_scan|red_flag_box)\b/g, "")
    .replace(/이 글은 [^\n]+?기준으로 읽히도록 구성했습니다\.[^\n]*\n?/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function evidenceBlock(article) {
  const t = topic(article);
  const k1 = keyword(article, 0, "조건");
  const k2 = keyword(article, 1, "서류");
  const k3 = keyword(article, 2, "일정");
  const sources = officialSources(article);
  const sourceText = sources.length
    ? sources.map((source) => `[${source.name}](${source.url})`).join(", ")
    : "공식 안내 페이지";

  return [
    `## ${t} 공식 확인 전 마지막 점검`,
    "",
    `${t}는 실행 직전에 한 번 더 확인해야 안전합니다. 특히 ${k1}, ${k2}, ${k3}는 같은 제목의 안내라도 기관, 지역, 날짜에 따라 적용 기준이 달라질 수 있습니다. 그래서 이 글의 결론은 기억용 요약으로 쓰고, 실제 신청이나 계약 전에는 ${sourceText}에서 최신 안내를 대조하는 방식이 좋습니다.`,
    "",
    ":::caution 확인 순서",
    `- ${k1}: 지금 내 상황에 적용되는 첫 조건인지 확인`,
    `- ${k2}: 제출 전 원본, 사본, 발급일 제한이 있는지 확인`,
    `- ${k3}: 예약, 상담, 납부, 신고처럼 마감이 생기는 항목인지 확인`,
    "- 마지막 판단: 부부가 같은 기준으로 이해했는지 한 문장으로 합의",
    ":::",
  ].join("\n");
}

function coupleChecklist(article) {
  const t = topic(article);
  const k1 = keyword(article, 0, "비용");
  const k2 = keyword(article, 1, "역할");
  const k3 = keyword(article, 2, "기록");
  const variants = [
    [
      `## ${t} 부부 대화 체크포인트`,
      "",
      `둘이 같이 볼 때는 ${k1}부터 말하면 대화가 계산으로만 흐르기 쉽습니다. 먼저 “이번 결정에서 피하고 싶은 실수”를 정하고, 그다음 ${k2}, ${k3} 순서로 나누면 감정 소모가 줄어듭니다.`,
      "",
      `1. ${k1} 때문에 오늘 바로 결정해야 하는지 확인합니다.`,
      `2. ${k2}를 한 사람에게 몰아주지 말고 담당자와 확인자를 분리합니다.`,
      `3. ${k3}는 캡처보다 파일명과 날짜가 남는 방식으로 보관합니다.`,
    ],
    [
      `## ${t} 실행 전 역할 나누기`,
      "",
      `${t}를 준비할 때 가장 흔한 문제는 한 사람이 검색, 문의, 결정을 모두 떠안는 상황입니다. ${k1}는 확인 담당, ${k2}는 일정 담당, ${k3}는 기록 담당처럼 역할을 나누면 같은 실수를 반복할 가능성이 낮아집니다.`,
      "",
      `- 확인 담당: ${k1} 기준이 바뀌었는지 공식 경로에서 확인`,
      `- 일정 담당: ${k2}가 필요한 날짜를 달력에 표시`,
      `- 기록 담당: ${k3} 관련 파일과 대화 내용을 한 폴더에 정리`,
    ],
    [
      `## ${t} 결정을 미뤄야 하는 신호`,
      "",
      `${t}는 빨리 정하는 것보다 잘못 정하지 않는 것이 더 중요할 때가 있습니다. ${k1} 설명이 서로 다르거나, ${k2} 책임자가 불분명하거나, ${k3}를 남길 방법이 없다면 바로 진행하지 말고 확인 단계를 하나 더 둡니다.`,
      "",
      `- 설명을 들은 사람과 실제 처리할 사람이 다르면 보류합니다.`,
      `- ${k1} 기준을 숫자나 날짜로 말할 수 없으면 다시 확인합니다.`,
      `- ${k2}와 ${k3} 중 하나라도 빠지면 다음 행동을 정하지 않습니다.`,
    ],
  ];

  return variants[seed(article) % variants.length].join("\n");
}

function answerEngineBlock(article) {
  const t = topic(article);
  const k1 = keyword(article, 0, "기준");
  const k2 = keyword(article, 1, "확인");
  const k3 = keyword(article, 2, "신청");

  return [
    `## ${t} 한 문장 답변`,
    "",
    `AEO 관점에서 ${t}의 핵심 답은 “${k1}을 먼저 고정하고, ${k2}에서 예외를 확인한 뒤, ${k3}은 증빙이 남는 순서로 진행한다”입니다. 이 문장을 기준으로 보면 검색 결과에서 본 조각 정보도 지금 내 상황에 필요한지 빠르게 걸러낼 수 있습니다.`,
    "",
    `### ${t}에서 바로 실행할 일`,
    "",
    `- 오늘 할 일: ${k1}을 부부가 같은 의미로 이해했는지 확인`,
    `- 이번 주 할 일: ${k2}가 필요한 공식 경로와 문의처 정리`,
    `- 진행 전 할 일: ${k3} 이후 되돌리기 어려운 항목이 있는지 확인`,
  ].join("\n");
}

function deeperScenario(article) {
  const t = topic(article);
  const k1 = keyword(article, 0, "선택지");
  const k2 = keyword(article, 1, "일정");
  const k3 = keyword(article, 2, "비용");
  const k4 = keyword(article, 3, "서류");

  return [
    `## ${t} 상황별 판단 예시`,
    "",
    `| 상황 | 먼저 볼 기준 | 다음 행동 |`,
    `|---|---|---|`,
    `| 시간이 부족한 경우 | ${k2} | 마감이 있는 항목만 먼저 처리하고 나머지는 보류 |`,
    `| 비용 차이가 큰 경우 | ${k3} | 총액보다 취소, 변경, 추가 비용을 먼저 비교 |`,
    `| 설명이 서로 다른 경우 | ${k1} | 공식 안내와 계약서 문구를 같은 표에 놓고 대조 |`,
    `| 제출물이 많은 경우 | ${k4} | 발급일, 원본 여부, 공동명의 여부를 파일명에 표시 |`,
    "",
    `이 표는 정답표가 아니라 대화를 시작하기 위한 기준표입니다. ${t}에서 부부가 다르게 이해하는 지점은 대개 ${k1}, ${k2}, ${k3} 중 하나에서 생기므로, 표를 채우면서 빠진 정보를 먼저 찾는 편이 안전합니다.`,
  ].join("\n");
}

function linkTextBlock(article) {
  const links = list(article.internal_link_targets).slice(0, 4);
  if (!links.length) return "";

  const t = topic(article);
  return [
    `## ${t} 다음에 이어서 볼 글`,
    "",
    ...links.map((href, index) => {
      const label = index === 0 ? `${t} 관련 상세 글` : `${t}와 함께 확인할 ${index + 1}번째 글`;
      return `- [${label}](${href})`;
    }),
  ].join("\n");
}

function ensureLength(article, body) {
  const target = sectionTargets[article.type] || 4200;
  const additions = [
    coupleChecklist(article),
    evidenceBlock(article),
    answerEngineBlock(article),
    deeperScenario(article),
    linkTextBlock(article),
  ].filter(Boolean);

  let next = body;
  for (const addition of additions) {
    if (next.length >= target) break;
    const heading = addition.match(/^## .+$/m)?.[0];
    if (heading && next.includes(heading)) continue;
    next = `${next}\n\n${addition}`;
  }

  return next.trim();
}

let changed = 0;

for (const article of articles) {
  const filePath = articlePath(article);
  if (!fs.existsSync(filePath)) continue;

  const raw = fs.readFileSync(filePath, "utf8");
  const frontmatter = frontmatterOf(raw);
  if (!frontmatter) continue;

  const polished = ensureLength(article, removeProductionNotes(bodyOf(raw)));
  const next = `${frontmatter}${polished}\n`;

  if (next !== raw) {
    fs.writeFileSync(filePath, next, "utf8");
    changed += 1;
  }
}

console.log(JSON.stringify({ total: articles.length, changed }, null, 2));
