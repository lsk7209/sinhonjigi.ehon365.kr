import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "output", "sinhonjigi", "manifest.json"), "utf8"),
);
const articles = manifest.articles || [];

function articleFile(article) {
  return path.join(root, article.draft_path || "");
}

function frontmatterOf(raw) {
  return raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)?.[0] || "";
}

function bodyOf(raw) {
  const frontmatter = frontmatterOf(raw);
  return frontmatter ? raw.slice(frontmatter.length).trim() : raw.trim();
}

function paragraphKey(paragraph) {
  return paragraph.replace(/\s+/g, " ").trim();
}

const docs = [];
const counts = new Map();

for (const article of articles) {
  const file = articleFile(article);
  if (!fs.existsSync(file)) continue;
  const raw = fs.readFileSync(file, "utf8");
  const frontmatter = frontmatterOf(raw);
  const body = bodyOf(raw);
  const paragraphs = body.split(/\n{2,}/);
  docs.push({ article, file, raw, frontmatter, paragraphs });

  for (const paragraph of paragraphs) {
    const key = paragraphKey(paragraph);
    if (key.length <= 80 || key.startsWith("|") || key.startsWith("##") || key.startsWith(":::")) {
      continue;
    }
    counts.set(key, (counts.get(key) || 0) + 1);
  }
}

const repeated = new Set([...counts].filter(([, count]) => count > 5).map(([key]) => key));
let changed = 0;

for (const doc of docs) {
  let touched = false;
  const nextParagraphs = doc.paragraphs.map((paragraph) => {
    const key = paragraphKey(paragraph);
    if (!repeated.has(key)) return paragraph;

    touched = true;
    return `${doc.article.title} 관점에서 다시 보면, ${key}`;
  });

  if (!touched) continue;
  const next = `${doc.frontmatter}${nextParagraphs.join("\n\n").trim()}\n`;
  if (next !== doc.raw) {
    fs.writeFileSync(doc.file, next, "utf8");
    changed += 1;
  }
}

console.log(JSON.stringify({ repeated: repeated.size, changed }, null, 2));
