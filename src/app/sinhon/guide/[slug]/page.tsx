import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuideArticlePage from "@/components/content/GuideArticlePage";
import { getGuideBySlug, getGuideMetaTitle, getGuideStaticParams } from "@/lib/guides";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getGuideStaticParams("sinhon");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideBySlug("sinhon", decodeURIComponent(slug), true);
  if (!article) return {};

  return {
    title: getGuideMetaTitle(article),
    description: article.subtitle,
    alternates: { canonical: `/sinhon/guide/${article.slug}` },
  };
}

export default async function SinhonGuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getGuideBySlug("sinhon", decodeURIComponent(slug));
  if (!article) notFound();

  return <GuideArticlePage article={article} section="sinhon" />;
}
