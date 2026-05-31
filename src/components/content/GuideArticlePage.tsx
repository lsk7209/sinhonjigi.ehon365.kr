import Link from "next/link";
import GuideMarkdown, { getGuideHeadings } from "@/components/content/GuideMarkdown";
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

  const headings = getGuideHeadings(draft.body);

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

      {headings.length > 0 ? (
        <nav
          aria-label="본문 목차"
          className="mt-6 rounded-2xl border border-[var(--border-emphasis)] bg-[var(--bg-soft)] p-5 shadow-[var(--shadow-sm)]"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-[var(--text-strong)]">
              목차
            </h2>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-[var(--gold-deep)]">
              {headings.length}개 섹션
            </span>
          </div>
          <ol className="mt-4 grid gap-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block rounded-xl px-3 py-2 text-sm leading-6 transition hover:bg-white hover:text-[var(--gold-deep)] ${
                    heading.level === 3
                      ? "ml-4 border-l border-[var(--border)] text-[var(--text-secondary)]"
                      : "font-bold text-[var(--text-strong)]"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

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
