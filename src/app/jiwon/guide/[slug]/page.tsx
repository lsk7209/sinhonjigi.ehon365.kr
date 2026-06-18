import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuideArticlePage from "@/components/content/GuideArticlePage";
import { getGuideBySlug, getGuideMetaTitle, getGuideStaticParams } from "@/lib/guides";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getGuideStaticParams("jiwon");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideBySlug("jiwon", decodeURIComponent(slug), true);
  if (!article) return {};

  return {
    title: getGuideMetaTitle(article),
    description: article.subtitle,
    alternates: { canonical: `/jiwon/guide/${article.slug}` },
  };
}

export default async function JiwonGuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getGuideBySlug("jiwon", decodeURIComponent(slug));
  if (!article) notFound();

  return <GuideArticlePage article={article} section="jiwon" />;
}
