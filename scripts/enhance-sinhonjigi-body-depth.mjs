import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "output/sinhonjigi/manifest.json"), "utf8"));
const articles = manifest.articles || manifest.items || [];
const byPath = new Map(articles.map((article) => [path.normalize(article.draft_path || ""), article]));

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

function removeOldDecisionBlock(body) {
  return body.replace(/\n\n> \*\*(?:[\s\S]*?)\n(?=\n##\s+)/m, "\n\n");
}

function decisionBlock(article, filePath) {
  const topic = topicOf(article, filePath);
  const k1 = keyword(article, 0, "기준");
  const k2 = keyword(article, 1, "서류");
  const k3 = keyword(article, 2, "일정");
  const k4 = keyword(article, 3, "문의");
  const reader = clean(article.primary_reader_situation) || `${topic}을 처음 확인하는 부부`;
  const angle = clean(article.unique_angle || article.angle) || `${k1}와 ${k2}를 같은 기준으로 비교한다`;
  const decision = clean(article.decision_criterion) || `${k1} 기준으로 지금 할 일과 나중에 할 일을 구분한다`;
  const seed = articleSeed(article) % 5;
  const labels = [
    "읽기 전 맞출 기준",
    "우리 상황에 대입할 메모",
    "부부가 먼저 합의할 지점",
    "헷갈릴 때 볼 판단축",
    "실행 전에 남길 기록",
  ];
  return [
    `> **${topic} ${labels[seed]}**`,
    `> - 현재 상황: ${reader}`,
    `> - 핵심 변수: ${k1}, ${k2}, ${k3}${k4 ? `, ${k4}` : ""}`,
    `> - 이 글의 관점: ${angle}`,
    `> - 마지막 판단 문장: ${decision}`,
  ].join("\n");
}

function depthSection(article, filePath) {
  const topic = topicOf(article, filePath);
  const title = clean(article.title);
  const k1 = keyword(article, 0, "기준");
  const k2 = keyword(article, 1, "서류");
  const k3 = keyword(article, 2, "일정");
  const k4 = keyword(article, 3, "문의");
  const reader = clean(article.primary_reader_situation) || `${topic}을 처음 확인하는 부부`;
  const angle = clean(article.unique_angle || article.angle) || `${k1}와 ${k2}를 같은 기준으로 비교한다`;
  const decision = clean(article.decision_criterion) || `${k1} 기준으로 지금 할 일과 나중에 할 일을 구분한다`;
  const cta = clean(article.ending_cta_direction) || "공식 경로를 확인하고 다음 글로 이어서 점검하기";
  const type = clean(article.structure_type || article.structureType || article.structure_type_candidate) || "실전 점검형";
  const visual = list(article.visual_elements || article.visualElements).map(clean).filter(Boolean).slice(0, 3);
  const internal = list(article.internal_link_targets).map(clean).filter(Boolean).slice(0, 3);
  const seed = articleSeed(article) % 6;

  const paragraphs = [
    [
      `${topic}을 볼 때 가장 흔한 실수는 ${k1}만 확인하고 ${k2}와 ${k3}를 따로 떼어 놓는 것입니다. ${reader}라면 검색 결과에서 보이는 큰 조건보다 실제로 내 상황에서 증빙할 수 있는 항목을 먼저 좁혀야 합니다. 이 글은 ${angle}는 관점으로 작성했기 때문에, 단순 정보 나열보다 결정 직전에 확인할 문장과 기록을 중심으로 읽으면 좋습니다.`,
      `${title}에서 남길 결론은 하나입니다. ${decision}. 이 기준을 먼저 정하면 ${k4}를 해야 할 때도 질문이 짧아지고, 부부가 서로 다른 자료를 보고 판단하는 일을 줄일 수 있습니다.`,
    ],
    [
      `${topic}은 같은 단어로 검색해도 독자의 상황에 따라 답이 달라집니다. ${reader}에게 필요한 것은 일반적인 소개가 아니라 ${k1}, ${k2}, ${k3}를 어떤 순서로 확인할지입니다. 그래서 이 글에서는 ${angle}는 기준을 앞에 두고, 실제 행동으로 옮길 수 있는 확인 질문을 분리했습니다.`,
      `특히 ${k4}가 엮이면 나중에 다시 확인해야 하는 일이 생기기 쉽습니다. ${decision}라는 문장을 부부가 같이 읽고, 필요한 기록을 남겨 두면 다음 단계에서 같은 설명을 반복하지 않아도 됩니다.`,
    ],
    [
      `${topic}을 준비하는 과정에서는 '알고 있다'와 '증빙할 수 있다'가 다릅니다. ${k1}를 알고 있어도 ${k2}가 준비되지 않으면 실행이 늦어지고, ${k3}가 맞지 않으면 다시 일정을 조정해야 합니다. 이 글은 ${reader}가 바로 자기 상황에 대입할 수 있도록 ${type} 흐름으로 정리했습니다.`,
      `읽을 때는 ${angle}는 점을 기준으로 보세요. 마지막에는 ${decision}라는 기준만 남기면 됩니다. 그 기준이 서면 ${cta}로 이어가면 됩니다.`,
    ],
    [
      `${topic}의 핵심은 많은 정보를 한꺼번에 외우는 것이 아니라, 지금 확인할 것과 나중에 확인할 것을 분리하는 데 있습니다. ${reader}라면 먼저 ${k1}를 보고, 이어서 ${k2}와 ${k3}가 실제 조건에 맞는지 확인해야 합니다.`,
      `이 글의 차별점은 ${angle}는 데 있습니다. 그래서 본문에서는 ${k4}처럼 놓치기 쉬운 항목을 중간에 끼워 넣어, 단순 체크리스트가 아니라 결정 순서로 읽히게 했습니다.`,
    ],
    [
      `${topic}은 부부가 서로 다른 기준으로 이해하면 뒤늦게 의견이 갈리기 쉽습니다. 한 사람은 ${k1}를 보고 충분하다고 느끼고, 다른 사람은 ${k2}나 ${k3} 때문에 불안해할 수 있습니다. ${reader}라면 이 차이를 먼저 드러내는 것이 좋습니다.`,
      `따라서 이 글은 ${decision}라는 문장을 중심으로 설계했습니다. ${angle}. 이 관점으로 보면 ${title}은 검색용 요약이 아니라 실제 대화와 확인 기록을 남기는 글이 됩니다.`,
    ],
    [
      `${topic}을 빠르게 끝내려면 먼저 ${k1}에서 탈락하거나 지연될 가능성을 확인해야 합니다. 그다음 ${k2}, ${k3}, ${k4}를 순서대로 붙이면 실행 단계에서 빠지는 항목이 줄어듭니다. ${reader}에게는 이 순서가 특히 중요합니다.`,
      `이 글에서는 ${angle}는 기준으로 항목을 배치했습니다. 결론은 ${decision}입니다. 이 결론을 기준으로 표와 질문을 채우면 다음 행동이 자연스럽게 좁혀집니다.`,
    ],
  ][seed];

  const visualText = visual.length ? visual.join(", ") : `${k1} 체크표, ${k2} 확인 질문`;
  const linksText = internal.length ? internal.join(" / ") : cta;

  return [
    `## ${topic}을 고유하게 봐야 하는 이유`,
    "",
    paragraphs[0],
    "",
    paragraphs[1],
    "",
    `### ${k1}·${k2}·${k3}를 나누는 기준`,
    "",
    `| 구분 | 이 글에서 확인할 내용 | 부부가 남길 기록 |`,
    `|---|---|---|`,
    `| ${k1} | 우리 상황에 바로 적용되는지 먼저 확인 | 기준 충족 여부와 애매한 부분 |`,
    `| ${k2} | 제출하거나 비교할 수 있는 자료인지 확인 | 파일명, 발급일, 상담 메모 |`,
    `| ${k3} | 일정이 밀릴 때 비용이나 선택지가 바뀌는지 확인 | 마감일, 예약일, 다시 확인할 날짜 |`,
    `| ${k4} | 전화·방문·계약 전에 물어볼 문장 정리 | 담당자 답변과 출처 |`,
    "",
    `### ${topic}에서 바로 쓸 질문`,
    "",
    `- ${k1} 기준이 우리 부부에게 적용되는가?`,
    `- ${k2}를 지금 준비할 수 있는가, 아니면 먼저 확인해야 하는가?`,
    `- ${k3}가 바뀌면 비용·조건·선택지가 달라지는가?`,
    `- ${decision}`,
    "",
    `### 글 안에서 쓰는 시각 요소와 연결 글`,
    "",
    `이 글은 ${visualText}를 기준으로 읽히도록 구성했습니다. 관련 흐름은 ${linksText}와 이어서 보면 중복 확인을 줄일 수 있습니다.`,
  ].join("\n");
}

function hasDepthSection(body) {
  return body.includes("을 고유하게 봐야 하는 이유") || body.includes("를 고유하게 봐야 하는 이유");
}

function insertAfterFirstHeading(body, section) {
  if (hasDepthSection(body)) return body;
  const firstHeading = body.match(/^##\s+.+$/m);
  if (!firstHeading || firstHeading.index === undefined) return `${section}\n\n${body}`;
  return `${body.slice(0, firstHeading.index)}${section}\n\n${body.slice(firstHeading.index)}`;
}

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

  body = removeOldDecisionBlock(body);
  body = `${decisionBlock(article, filePath)}\n\n${body.trimStart()}`;
  body = insertAfterFirstHeading(body, depthSection(article, filePath));

  const next = `${frontmatter}${body}`;
  if (next !== original) {
    fs.writeFileSync(filePath, next, "utf8");
    changed += 1;
  }
}

console.log(JSON.stringify({ files: files.length, changed }, null, 2));
