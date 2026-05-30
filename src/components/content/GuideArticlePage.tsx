import Link from "next/link";
import GuideMarkdown from "@/components/content/GuideMarkdown";
import { getGuideDraft, type GuideArticle, type GuideSection } from "@/lib/guides";

interface Props {
  article: GuideArticle;
  section: GuideSection;
}

export default function GuideArticlePage({ article, section }: Props) {
  const draft = getGuideDraft(article);

  if (!draft) {
    return (
      <article className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">
          초안 파일을 찾을 수 없습니다
        </h1>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-8">
      <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--text-caption)]">
        <Link href={`/${section}/guide`} className="font-bold text-[var(--lav-600)]">
          가이드
        </Link>
        <span>/</span>
        <span>{article.title}</span>
      </nav>

      <header className="rounded-2xl border border-[var(--lav-200)] bg-[var(--gradient-hero)] p-7 shadow-[var(--shadow-md)]">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[var(--lav-600)]">
            {article.quality_score}점
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[var(--text-secondary)]">
            {article.main_keyword}
          </span>
        </div>
        <h1 className="mt-4 text-[28px] font-bold leading-tight text-[var(--text-strong)]">
          {article.title}
        </h1>
        <p className="mt-3 text-[15.5px] leading-7 text-[var(--text-default)]">
          {article.subtitle}
        </p>
        <time className="mt-4 block text-xs text-[var(--text-caption)]">
          공개일: {formatDateTime(article.scheduled_at)}
        </time>
      </header>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
        <GuideMarkdown body={draft.body} />
      </section>
    </article>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}
