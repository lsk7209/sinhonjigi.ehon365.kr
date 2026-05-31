import fs from "node:fs";
import path from "node:path";

export type GuideSection = "jiwon" | "wedding" | "sinhon";

export interface GuideArticle {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  type: GuideSection;
  cluster: string;
  main_keyword: string;
  expanded_keywords: string[];
  scheduled_at: string;
  draft_path: string;
  research_path: string;
  quality_score: number;
  status: string;
  accent_colors?: string[];
}

export interface GuideDraft {
  article: GuideArticle;
  body: string;
}

export interface GuideResearchSource {
  id?: string;
  name?: string;
  title?: string;
  url?: string;
  type?: string;
  official?: boolean;
  accessed?: string;
}

export interface GuideResearch {
  sources?: GuideResearchSource[];
}

interface GuideManifest {
  articles: GuideArticle[];
}

const outputDir = path.join(process.cwd(), "output", "sinhonjigi");
const manifestPath = path.join(outputDir, "manifest.json");

export const GUIDE_SECTION_LABEL: Record<GuideSection, string> = {
  jiwon: "지원금 가이드",
  wedding: "결혼식 가이드",
  sinhon: "신혼 생활 가이드",
};

export function getAllGuides(): GuideArticle[] {
  if (!fs.existsSync(manifestPath)) return [];

  const manifest = JSON.parse(
    fs.readFileSync(manifestPath, "utf-8"),
  ) as GuideManifest;

  return manifest.articles
    .filter((article) => article.status === "done")
    .sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
    );
}

export function getGuidesBySection(section: GuideSection, includeFuture = false) {
  return getAllGuides().filter(
    (article) =>
      article.type === section && (includeFuture || isGuidePublic(article)),
  );
}

export function getGuideBySlug(
  section: GuideSection,
  slug: string,
  includeFuture = false,
) {
  return getAllGuides().find(
    (article) =>
      article.type === section &&
      article.slug === slug &&
      (includeFuture || isGuidePublic(article)),
  );
}

export function getGuideDraft(article: GuideArticle): GuideDraft | null {
  const draftPath = path.join(
    outputDir,
    "drafts",
    article.cluster,
    `${article.slug}.mdx`,
  );
  if (!fs.existsSync(draftPath)) return null;

  const raw = fs.readFileSync(draftPath, "utf-8");
  return {
    article,
    body: stripFrontmatter(raw),
  };
}

export function getGuideResearch(article: GuideArticle): GuideResearch | null {
  const researchPath = path.join(
    outputDir,
    "research",
    article.cluster,
    `${article.slug}.json`,
  );
  if (!fs.existsSync(researchPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(researchPath, "utf-8")) as GuideResearch;
  } catch {
    return null;
  }
}

export function getGuideStaticParams(section: GuideSection) {
  return getAllGuides()
    .filter((article) => article.type === section)
    .map((article) => ({ slug: article.slug }));
}

export function getNextScheduledGuide(section: GuideSection) {
  return getAllGuides().find(
    (article) => article.type === section && !isGuidePublic(article),
  );
}

export function isGuidePublic(article: GuideArticle, now = new Date()) {
  return new Date(article.scheduled_at).getTime() <= now.getTime();
}

function stripFrontmatter(raw: string) {
  if (!raw.startsWith("---")) return raw;
  const parts = raw.split("---");
  if (parts.length < 3) return raw;
  return parts.slice(2).join("---").trim();
}
