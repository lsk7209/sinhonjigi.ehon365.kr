import type { MetadataRoute } from "next";
import regions from "@/data/seed/regions.json";
import { getAllGuides, isGuidePublic, type GuideSection } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const guideSections: GuideSection[] = ["jiwon", "wedding", "sinhon"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "/",
    "/blog",
    "/jiwon",
    "/wedding",
    "/sinhon",
    "/jiwon/guide",
    "/wedding/guide",
    "/sinhon/guide",
    "/about",
    "/contact",
    "/disclosure",
  ];

  const regionRoutes = regions.flatMap((region) => [
    `/jiwon/${region.id}`,
    `/wedding/${region.id}`,
    `/sinhon/${region.id}`,
  ]);

  const guideRoutes = getAllGuides()
    .filter((guide) => isGuidePublic(guide, now))
    .map((guide) => `/${guide.type}/guide/${guide.slug}`);

  const urls = [...staticRoutes, ...regionRoutes, ...guideRoutes];

  return urls.map((url) => ({
    url: absoluteUrl(url),
    lastModified: now,
    changeFrequency: getChangeFrequency(url),
    priority: getPriority(url),
  }));
}

function getChangeFrequency(url: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (url === "/blog" || guideSections.some((section) => url === `/${section}/guide`)) {
    return "hourly";
  }
  if (url.includes("/guide/")) return "weekly";
  return "daily";
}

function getPriority(url: string) {
  if (url === "/") return 1;
  if (url === "/blog") return 0.9;
  if (["/jiwon", "/wedding", "/sinhon"].includes(url)) return 0.85;
  if (url.includes("/guide/")) return 0.75;
  return 0.65;
}
