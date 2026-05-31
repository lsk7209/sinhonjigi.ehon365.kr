import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "output/sinhonjigi/manifest.json"), "utf8"));
const articles = manifest.articles || manifest.items || [];

function clean(value) {
  return String(value || "").replace(/[?]+/g, "").replace(/\s+/g, " ").trim();
}

function list(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function uniqueWords(value) {
  const out = [];
  for (const word of clean(value).split(" ")) {
    if (word.length > 1 && !out.includes(word)) out.push(word);
  }
  return out;
}

function topicOf(article, filePath) {
  const main = clean(article.main_keyword || article.mainKeyword);
  const title = clean(article.title);
  const fallback = path.basename(filePath, ".mdx").replace(/-/g, " ");
  const words = uniqueWords(main || title || fallback);
  return (words.length > 5 ? words.slice(0, 5) : words).join(" ") || clean(fallback);
}

function keyword(article, index, fallback) {
  const keywords = list(article.expanded_keywords || article.expandedKeywords)
    .map(clean)
    .filter(Boolean);
  return keywords[index % Math.max(keywords.length, 1)] || fallback;
}

function seed(article) {
  return Number(String(article.id || "").replace(/\D/g, "")) || 0;
}

function hasFinal(word) {
  const chars = [...String(word || "").trim()];
  const ch = chars[chars.length - 1];
  if (!ch) return false;
  const code = ch.charCodeAt(0) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
}

function particle(word, pair) {
  if (pair === "eul") return hasFinal(word) ? "을" : "를";
  if (pair === "gwa") return hasFinal(word) ? "과" : "와";
  return hasFinal(word) ? "이" : "가";
}

function sentencePool(article, filePath) {
  const topic = topicOf(article, filePath);
  const title = clean(article.title);
  const k1 = keyword(article, 0, "기준");
  const k2 = keyword(article, 1, "서류");
  const k3 = keyword(article, 2, "일정");
  const k4 = keyword(article, 3, "문의");
  const reader = clean(article.primary_reader_situation) || `${topic}${particle(topic, "eul")} 처음 확인하는 부부`;
  const angle = clean(article.unique_angle || article.angle) || `${k1}${particle(k1, "gwa")} ${k2}${particle(k2, "eul")} 같은 기준으로 비교한다`;
  const decision = clean(article.decision_criterion) || `${k1} 기준으로 지금 할 일과 나중에 할 일을 구분한다`;
  const intent = clean(article.search_intent) || "실전 확인";
  const type = clean(article.structure_type || article.structureType || article.structure_type_candidate) || "실전 점검형";
  const cta = clean(article.ending_cta_direction) || "공식 경로를 확인하고 다음 단계로 넘어가기";
  const visuals = list(article.visual_elements || article.visualElements).map(clean).filter(Boolean);
  const links = list(article.internal_link_targets).map(clean).filter(Boolean).slice(0, 4);
  return { topic, title, k1, k2, k3, k4, reader, angle, decision, intent, type, cta, visuals, links };
}

function intro(ctx, variant) {
  const patterns = [
    `${ctx.title}을 찾는 사람은 보통 빠른 답을 원하지만, 실제로는 ${ctx.k1}, ${ctx.k2}, ${ctx.k3}가 서로 엮이면서 판단이 달라집니다. ${ctx.reader}라면 먼저 "지금 바로 확인할 항목"과 "상담이나 공고에서 다시 확인할 항목"을 나눠야 합니다. 이 글은 ${ctx.angle}는 관점으로 ${ctx.topic}${particle(ctx.topic, "eul")} 정리합니다.`,
    `${ctx.topic}은 같은 키워드로 검색해도 부부의 준비 단계에 따라 답이 달라집니다. ${ctx.reader}에게 필요한 것은 일반 설명보다 ${ctx.k1}${particle(ctx.k1, "gwa")} ${ctx.k2}, 그리고 ${ctx.k3}의 순서를 정하는 일입니다. 그래서 이 글은 ${ctx.decision}라는 기준을 중심에 둡니다.`,
    `${ctx.title}에서 중요한 것은 많은 정보를 외우는 것이 아니라, 부부가 같은 기준으로 확인하는 것입니다. ${ctx.k1}만 보면 충분해 보여도 ${ctx.k2}가 빠지거나 ${ctx.k3}가 맞지 않으면 다시 확인해야 합니다. 아래 내용은 ${ctx.intent}에 맞춰 실제 판단 순서로 읽히게 구성했습니다.`,
  ];
  return patterns[variant % patterns.length];
}

function decisionBlock(ctx, variant) {
  const titles = ["먼저 맞출 판단 기준", "우리 상황에 대입할 메모", "부부가 같이 남길 결론"];
  return [
    `> **${ctx.topic} ${titles[variant % titles.length]}**`,
    `> - 현재 상황: ${ctx.reader}`,
    `> - 핵심 변수: ${ctx.k1}, ${ctx.k2}, ${ctx.k3}, ${ctx.k4}`,
    `> - 이 글의 관점: ${ctx.angle}`,
    `> - 마지막 판단 문장: ${ctx.decision}`,
  ].join("\n");
}

function sectionOne(ctx, variant) {
  const headings = [
    `${ctx.topic}에서 먼저 갈라야 할 기준`,
    `${ctx.topic}을 별도 글로 봐야 하는 이유`,
    `${ctx.topic} 준비의 출발점`,
  ];
  return [
    `## ${headings[variant % headings.length]}`,
    "",
    `${ctx.topic}${particle(ctx.topic, "eul")} 처음 볼 때는 ${ctx.k1}${particle(ctx.k1, "eul")} 큰 조건으로 생각하기 쉽습니다. 하지만 실제 결정은 ${ctx.k2}${particle(ctx.k2, "gwa")} ${ctx.k3}가 맞물리는 순간에 달라집니다. 예를 들어 조건은 맞아도 증빙이 늦거나, 일정은 가능해도 확인 경로가 불명확하면 실행 단계에서 다시 멈춥니다.`,
    "",
    `그래서 이 글에서는 ${ctx.k1}를 첫 문턱으로 두고, ${ctx.k2}는 남길 기록, ${ctx.k3}는 놓치면 비용이나 선택지가 바뀌는 요소로 분리합니다. 이 세 가지를 분리하면 ${ctx.reader}도 지금 해야 할 일과 나중에 확인할 일을 나눌 수 있습니다.`,
  ].join("\n");
}

function sectionTwo(ctx, variant) {
  const headings = [
    `${ctx.k1}와 ${ctx.k2}를 나눠 보는 법`,
    `${ctx.k1} 확인 후 바로 볼 항목`,
    `${ctx.k2} 준비에서 빠지기 쉬운 지점`,
  ];
  return [
    `## ${headings[variant % headings.length]}`,
    "",
    `| 확인 항목 | 이 글에서 보는 기준 | 남길 기록 |`,
    `|---|---|---|`,
    `| ${ctx.k1} | 우리 상황에 적용되는 첫 조건인지 확인 | 해당 여부와 애매한 예외 |`,
    `| ${ctx.k2} | 제출·비교·상담에 바로 쓸 수 있는지 확인 | 발급일, 파일명, 상담 메모 |`,
    `| ${ctx.k3} | 마감이나 예약이 판단을 바꾸는지 확인 | 기준일, 예약일, 다시 볼 날짜 |`,
    `| ${ctx.k4} | 전화나 방문 전에 질문을 좁히는지 확인 | 담당자 답변, 확인 경로 |`,
    "",
    `표를 채울 때는 완벽한 답보다 빈칸을 찾는 것이 먼저입니다. 빈칸이 ${ctx.k1}에 있으면 조건 확인부터, ${ctx.k2}에 있으면 자료 준비부터, ${ctx.k3}에 있으면 일정 조정부터 시작하는 편이 안전합니다.`,
  ].join("\n");
}

function sectionThree(ctx, variant) {
  const headings = [
    `${ctx.topic} 상황별 선택 기준`,
    `${ctx.topic}: ${ctx.reader}가 자주 헷갈리는 부분`,
    `${ctx.topic}에서 실수를 줄이는 순서`,
  ];
  const cases = [
    [`${ctx.k1}는 맞지만 ${ctx.k2}가 부족한 경우`, `${ctx.k2}를 먼저 보완하고 ${ctx.k3}를 다시 잡습니다.`],
    [`${ctx.k3}가 촉박한 경우`, `${ctx.k4} 전에 필요한 질문을 한 장으로 줄입니다.`],
    [`부부가 서로 다른 자료를 본 경우`, `${ctx.decision}라는 문장으로 판단 기준을 하나로 맞춥니다.`],
  ];
  return [
    `## ${headings[variant % headings.length]}`,
    "",
    `${ctx.topic}은 상황에 따라 우선순위가 달라집니다. 아래 세 경우 중 어디에 가까운지 먼저 고르면 본문을 읽는 속도도 빨라집니다.`,
    "",
    ...cases.map(([name, action]) => `- **${name}**: ${action}`),
    "",
    `${ctx.angle}. 이 관점을 적용하면 단순히 정보를 더 모으는 대신, 어떤 항목을 확인해야 다음 행동으로 넘어갈 수 있는지가 분명해집니다.`,
  ].join("\n");
}

function sectionFour(ctx, variant) {
  const headings = [
    `${ctx.topic} 확인 질문`,
    `${ctx.k4} 전에 정리할 질문`,
    `${ctx.topic} 부부 대화 문장`,
  ];
  return [
    `## ${headings[variant % headings.length]}`,
    "",
    `- ${ctx.k1} 기준이 우리에게 적용되는가?`,
    `- ${ctx.k2}를 지금 확보할 수 있는가?`,
    `- ${ctx.k3}가 밀리면 비용이나 선택지가 달라지는가?`,
    `- ${ctx.k4}를 하기 전에 어떤 답을 받아야 하는가?`,
    `- ${ctx.decision}`,
    "",
    `부부가 같이 볼 때는 "누가 맞느냐"보다 "무엇을 확인하면 결정할 수 있느냐"로 질문을 바꾸는 것이 좋습니다. 이 방식은 ${ctx.topic}뿐 아니라 이어지는 선택에도 그대로 적용됩니다.`,
  ].join("\n");
}

function visualSection(ctx) {
  const heading = `${ctx.topic} 가독성 요소와 확인 자료`;
  const visuals = ctx.visuals.length ? ctx.visuals : [`${ctx.k1} 체크표`, `${ctx.k2} 질문 카드`, `${ctx.k3} 일정 메모`];
  return [
    `## ${heading}`,
    "",
    `이 글은 ${visuals.join(", ")}를 기준으로 읽히도록 구성했습니다. 표는 판단 기준을 분리하기 위한 장치이고, 체크리스트는 부부가 역할을 나누기 위한 장치입니다. 강조 색상은 글별 1~2개만 사용해 중요한 경고와 다음 행동이 과하게 튀지 않도록 맞춥니다.`,
    "",
    `색상이 많아지면 정보가 많아 보이지만 실제 결정은 느려집니다. ${ctx.topic}에서는 ${ctx.k1}와 ${ctx.k2}처럼 서로 다른 성격의 항목만 색으로 구분하는 정도가 적당합니다.`,
  ].join("\n");
}

function faq(ctx) {
  return [
    `## ${ctx.topic} FAQ`,
    "",
    `### ${ctx.k1}만 확인하면 충분한가요?`,
    "",
    `아닙니다. ${ctx.k1}는 첫 문턱이고, 실제 실행에서는 ${ctx.k2}와 ${ctx.k3}가 함께 맞아야 합니다.`,
    "",
    `### ${ctx.k2}가 아직 없으면 어떻게 해야 하나요?`,
    "",
    `${ctx.k2}를 바로 준비할 수 있는지부터 보고, 어렵다면 ${ctx.k4} 전에 필요한 질문을 적어 두는 것이 좋습니다.`,
    "",
    `### 마지막에는 무엇을 남기면 되나요?`,
    "",
    `"${ctx.decision}"라는 문장을 남기면 됩니다. 이 문장이 서면 다음 행동이 상담인지, 서류 준비인지, 일정 조정인지 분리됩니다.`,
  ].join("\n");
}

function linkSection(ctx) {
  const links = ctx.links.length ? ctx.links : ["/jiwon", "/wedding", "/sinhon"];
  return [
    `## ${ctx.topic} 다음 행동`,
    "",
    `${ctx.cta}. 이어서 볼 글은 아래 경로에서 고르면 됩니다.`,
    "",
    ...links.map((link) => `- ${link}`),
  ].join("\n");
}

function buildBody(article, filePath) {
  const ctx = sentencePool(article, filePath);
  const variant = seed(article);
  return [
    intro(ctx, variant),
    "",
    intro(ctx, variant + 1),
    "",
    decisionBlock(ctx, variant),
    "",
    sectionOne(ctx, variant),
    "",
    sectionTwo(ctx, variant + 1),
    "",
    sectionThree(ctx, variant + 2),
    "",
    sectionFour(ctx, variant + 3),
    "",
    visualSection(ctx),
    "",
    faq(ctx),
    "",
    linkSection(ctx),
    "",
  ].join("\n");
}

let changed = 0;

for (const article of articles) {
  if (!article.draft_path) continue;
  const filePath = path.join(root, article.draft_path);
  if (!fs.existsSync(filePath)) continue;

  const original = fs.readFileSync(filePath, "utf8");
  const frontmatterMatch = original.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!frontmatterMatch) continue;
  const frontmatter = frontmatterMatch[0];
  const next = `${frontmatter}${buildBody(article, filePath)}`;

  if (next !== original) {
    fs.writeFileSync(filePath, next, "utf8");
    changed += 1;
  }
}

console.log(JSON.stringify({ total: articles.length, changed }, null, 2));
