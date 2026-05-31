import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "output/sinhonjigi/manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const articles = manifest.articles || manifest.items || [];

const K = {
  checklist: "\uCCB4\uD06C\uB9AC\uC2A4\uD2B8",
  order: "\uC21C\uC11C",
  compare: "\uBE44\uAD50",
  situation: "\uC0C1\uD669\uBCC4",
  document: "\uC11C\uB958",
  question: "\uC9C8\uBB38",
  final: "\uB9C8\uC9C0\uB9C9",
  risk: "\uB9AC\uC2A4\uD06C",
  evidence: "\uADFC\uAC70",
  source: "\uCD9C\uCC98",
  cost: "\uBE44\uC6A9",
  schedule: "\uC77C\uC815",
  support: "\uC9C0\uC6D0",
  decision: "\uD310\uB2E8",
  practice: "\uC2E4\uC804",
  couple: "\uBD80\uBD80",
  before: "\uC804",
  mistake: "\uC2E4\uC218",
  apply: "\uC801\uC6A9",
  check: "\uD655\uC778",
  next: "\uB2E4\uC74C",
  action: "\uD589\uB3D9",
  faq: "FAQ",
  summary: "\uC815\uB9AC",
  route: "\uACBD\uB85C",
  record: "\uAE30\uB85D",
  local: "\uC9C0\uC5ED",
  ask: "\uBB38\uC758",
  standard: "\uAE30\uC900",
  prepare: "\uC900\uBE44",
  verify: "\uAC80\uC99D",
  sample: "\uC608\uC2DC",
  point: "\uD3EC\uC778\uD2B8",
  reader: "\uB3C5\uC790 \uC0C1\uD669",
  angle: "\uC774 \uAE00\uC758 \uACE0\uC720 \uAC01\uB3C4",
  use: "\uC5B4\uB5BB\uAC8C \uC368\uBA39\uC744\uC9C0",
  beware: "\uC8FC\uC758\uD560 \uC810",
  oneLine: "\uD55C \uC904 \uD310\uB2E8",
  readTogether: "\uAC19\uC774 \uBCFC \uAE00",
};

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

function articleSeed(article) {
  return Number(String(article.id || "").replace(/\D/g, "")) || 0;
}

function hasFinalConsonant(word) {
  const chars = [...String(word || "").trim()];
  const ch = chars[chars.length - 1];
  if (!ch) return false;
  const code = ch.charCodeAt(0) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
}

function fixParticles(text) {
  return String(text)
    .replace(/([가-힣A-Za-z0-9]+)(을|를)(?=\s|$|,|\.|:)/g, (_match, word) => `${word}${hasFinalConsonant(word) ? "을" : "를"}`)
    .replace(/([가-힣A-Za-z0-9]+)(과|와)(?=\s|$|,|\.|:)/g, (_match, word) => `${word}${hasFinalConsonant(word) ? "과" : "와"}`)
    .replace(/상황별별/g, "상황별")
    .replace(/\s+/g, " ")
    .trim();
}

function headingTemplates(article, filePath) {
  const topic = topicOf(article, filePath);
  const k1 = keyword(article, 0, K.standard);
  const k2 = keyword(article, 1, K.document);
  const k3 = keyword(article, 2, K.schedule);
  const k4 = keyword(article, 3, K.ask);
  const type = clean(article.structure_type || article.structureType || article.structure_type_candidate) || K.practice;
  const seed = articleSeed(article) % 8;
  const sets = [
    [
      `${topic} ${k1} ${K.check} ${K.order}`,
      `${k2} ${K.before} ${K.mistake}가 생기는 지점`,
      `${k3}와 ${k4}를 같이 보는 ${K.decision}법`,
      `${topic} ${K.practice} ${K.checklist}`,
      `${topic}에서 ${K.couple}가 나눠 맡을 ${K.action}`,
      `${topic} ${K.faq}: ${k1} ${K.question}`,
      `${topic} ${K.final} ${K.check} ${K.point}`,
    ],
    [
      `${topic}을 먼저 봐야 하는 상황`,
      `${k1} ${K.standard}과 제외 조건`,
      `${k2} ${K.prepare}에서 자주 빠지는 항목`,
      `${k3}가 밀릴 때 조정 ${K.order}`,
      `${topic} ${K.source}와 ${K.record}을 남기는 법`,
      `${topic} ${K.situation} ${K.sample}`,
      `${topic} ${K.next} ${K.action}을 정하는 ${K.decision}표`,
    ],
    [
      `${topic} ${K.risk}를 초기에 거르는 법`,
      `${k1} 때문에 달라지는 ${K.decision} 기준`,
      `${k2}와 ${k3} ${K.compare} 포인트`,
      `${topic} ${K.cost}·${K.schedule} 확인 순서`,
      `${topic} 대화가 막힐 때 던질 ${K.question}`,
      `${topic} ${K.faq}: ${k4}까지 확인하기`,
      `${topic} ${K.final}으로 남길 ${K.record}`,
    ],
    [
      `${topic} ${type} 핵심 흐름`,
      `${k1} 확인 전 필요한 ${K.evidence}`,
      `${k2}를 준비할 때 생기는 착각`,
      `${k3} 기준으로 후보를 줄이는 법`,
      `${topic} ${K.local}·${K.ask} 확인 경로`,
      `${topic} ${K.couple} 상황에 맞춘 ${K.apply} 예시`,
      `${topic} ${K.summary}: 지금 바로 볼 항목`,
    ],
    [
      `${topic}에서 먼저 정할 ${K.standard}`,
      `${k1}와 ${k2}를 분리해서 보는 이유`,
      `${k3} 확인을 늦추면 생기는 문제`,
      `${topic} ${K.document}·${K.record} 점검`,
      `${topic} ${K.mistake}를 줄이는 대화 문장`,
      `${topic} 관련 자주 나오는 ${K.question}`,
      `${topic} ${K.next} 단계로 넘어가기 전 ${K.final} 점검`,
    ],
    [
      `${topic} ${K.prepare}의 출발점`,
      `${k1} 기준을 숫자로 다시 보는 법`,
      `${k2} 항목을 놓치지 않는 ${K.checklist}`,
      `${k3}와 ${k4}가 충돌할 때`,
      `${topic} 공식 ${K.source} 확인법`,
      `${topic} ${K.situation} 선택지를 좁히는 ${K.decision} 기준`,
      `${topic} ${K.couple}가 합의할 ${K.final} 한 줄`,
    ],
    [
      `${topic}을 별도 글로 나눈 이유`,
      `${k1}부터 확인해야 하는 사람`,
      `${k2} 준비가 부족할 때 생기는 실제 문제`,
      `${k3} 기준으로 보는 선택지 차이`,
      `${topic} ${K.record}을 남기는 방식`,
      `${k4} 문의 전 정리할 질문`,
      `${topic} ${K.final}으로 결정할 한 가지`,
    ],
    [
      `${topic} ${K.practice} 적용 장면`,
      `${k1} 확인을 미루면 생기는 비용`,
      `${k2}와 ${k3}를 한 표에 놓는 법`,
      `${topic} 담당자에게 물을 문장`,
      `${topic} ${K.couple}가 서로 확인할 역할`,
      `${topic} ${K.faq}: 헷갈리는 지점`,
      `${topic} ${K.next} 글로 넘어가기 전 ${K.summary}`,
    ],
  ];
  return sets[seed];
}

function uniqueBlock(article, filePath) {
  const topic = topicOf(article, filePath);
  const k1 = keyword(article, 0, K.standard);
  const k2 = keyword(article, 1, K.document);
  const k3 = keyword(article, 2, K.schedule);
  const reader = clean(article.primary_reader_situation) || `${topic}을 처음 확인하는 부부`;
  const angle = clean(article.unique_angle || article.angle) || `${k1}와 ${k2}를 같은 기준으로 비교한다`;
  const decision = clean(article.decision_criterion) || `${k1} 기준으로 지금 할 일과 나중에 할 일을 구분한다`;
  const seed = articleSeed(article) % 6;
  const blocks = [
    [
      `> **${topic} 고유 포인트**`,
      `> - ${K.reader}: ${reader}`,
      `> - ${K.angle}: ${angle}`,
      `> - ${K.oneLine}: ${decision}`,
      `> - ${K.use}: ${k1} 확인 뒤 ${k2}와 ${k3}를 같은 표에 놓고 결정합니다.`,
    ],
    [
      `> **이 글에서 따로 보는 판단 기준**`,
      `> - 출발 상황: ${reader}`,
      `> - 핵심 변수: ${k1}, ${k2}, ${k3}`,
      `> - 다른 글과 다른 점: ${angle}`,
      `> - 마지막 결정 문장: ${decision}`,
    ],
    [
      `> **부부가 먼저 맞출 기준**`,
      `> ${topic}은 ${k1}만 보면 부족합니다. ${reader}라면 ${k2}와 ${k3}를 함께 확인해야 같은 실수를 줄일 수 있습니다.`,
      `>`,
      `> 판단 기준은 "${decision}"입니다.`,
    ],
    [
      `> **이번 글의 사용 장면**`,
      `> - 지금 상황: ${reader}`,
      `> - 먼저 볼 항목: ${k1}`,
      `> - 같이 볼 항목: ${k2}, ${k3}`,
      `> - 읽고 남길 결론: ${decision}`,
    ],
    [
      `> **템플릿이 아니라 이 글에서만 다루는 부분**`,
      `> ${angle}. 그래서 ${topic}을 볼 때는 ${k1} 확인에서 멈추지 않고 ${k2}, ${k3}까지 이어서 봐야 합니다.`,
      `>`,
      `> 최종 기준: ${decision}`,
    ],
    [
      `> **빠르게 판단할 질문**`,
      `> 1. ${k1} 기준이 우리 상황에 맞는가?`,
      `> 2. ${k2}를 증빙하거나 비교할 자료가 있는가?`,
      `> 3. ${k3} 때문에 일정이나 비용이 달라지는가?`,
      `>`,
      `> 이 세 질문의 기준은 "${decision}"입니다.`,
    ],
  ];
  return blocks[seed].join("\n");
}

function hasUniqueBlock(markdown) {
  return markdown.includes("고유 포인트") || markdown.includes("따로 보는 판단 기준") || markdown.includes("부부가 먼저 맞출 기준") || markdown.includes("이번 글의 사용 장면") || markdown.includes("템플릿이 아니라") || markdown.includes("빠르게 판단할 질문");
}

function insertUniqueBlock(markdown, article, filePath) {
  if (hasUniqueBlock(markdown)) return markdown;
  const block = uniqueBlock(article, filePath);
  const firstHeading = markdown.search(/^##\s+/m);
  if (firstHeading === -1) return `${markdown.trim()}\n\n${block}\n`;
  const before = markdown.slice(0, firstHeading).trimEnd();
  const after = markdown.slice(firstHeading);
  return `${before}\n\n${block}\n\n${after}`;
}

function replaceHeadings(markdown, article, filePath) {
  const templates = headingTemplates(article, filePath);
  let index = 0;
  return markdown.replace(/^##\s+(.+)$/gm, () => {
    const heading = fixParticles(templates[index % templates.length]);
    index += 1;
    return `## ${heading}`;
  });
}

const byPath = new Map(articles.map((article) => [path.normalize(article.draft_path || ""), article]));
const draftRoot = path.join(root, "output/sinhonjigi/drafts");
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".mdx")) files.push(full);
  }
}

walk(draftRoot);

let changed = 0;

for (const filePath of files) {
  const relative = path.relative(root, filePath);
  const article = byPath.get(path.normalize(relative));
  if (!article) continue;

  const original = fs.readFileSync(filePath, "utf8");
  const frontmatterMatch = original.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  const frontmatter = frontmatterMatch ? frontmatterMatch[0] : "";
  let body = frontmatter ? original.slice(frontmatter.length) : original;

  body = insertUniqueBlock(body, article, filePath);
  body = replaceHeadings(body, article, filePath);

  const next = `${frontmatter}${body}`;
  if (next !== original) {
    fs.writeFileSync(filePath, next, "utf8");
    changed += 1;
  }
}

console.log(JSON.stringify({ files: files.length, changed }, null, 2));
