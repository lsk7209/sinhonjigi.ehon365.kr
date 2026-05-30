import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuideArticlePage from "@/components/content/GuideArticlePage";
import { getGuideBySlug, getGuideStaticParams } from "@/lib/guides";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getGuideStaticParams("wedding");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideBySlug("wedding", decodeURIComponent(slug), true);
  if (!article) return {};

  return {
    title: article.title,
    description: article.subtitle,
    alternates: { canonical: `/wedding/guide/${article.slug}` },
  };
}

export default async function WeddingGuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getGuideBySlug("wedding", decodeURIComponent(slug));
  if (!article) notFound();

  return <GuideArticlePage article={article} section="wedding" />;
}
