import type { CSSProperties } from "react";
import Link from "next/link";
import GuideMarkdown, { getGuideHeadings } from "@/components/content/GuideMarkdown";
import {
  getGuideDraft,
  getGuideResearch,
  type GuideArticle,
  type GuideSection,
} from "@/lib/guides";

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
  const research = getGuideResearch(article);
  const officialSources = (research?.sources ?? [])
    .filter((source) => source.url && (source.name || source.title))
    .slice(0, 4);
  const [accent, accentSoft] = article.accent_colors?.length
    ? article.accent_colors
    : ["#C9A961", "#0F1E3D"];
  const articleUrl = `/${section}/guide/${article.slug}`;
  const articleStyle = {
    "--article-accent": accent,
    "--article-accent-soft": accentSoft,
  } as CSSProperties;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: "/" },
        { "@type": "ListItem", position: 2, name: "가이드", item: `/${section}/guide` },
        { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.subtitle,
      datePublished: article.scheduled_at,
      dateModified: article.scheduled_at,
      author: { "@type": "Organization", name: "신혼지기" },
      mainEntityOfPage: articleUrl,
      keywords: [article.main_keyword, ...article.expanded_keywords].join(", "),
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-5 py-8" style={articleStyle}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--text-caption)]">
        <Link href={`/${section}/guide`} className="font-bold text-[var(--article-accent)]">
          가이드
        </Link>
        <span>/</span>
        <span>{article.title}</span>
      </nav>

      <header className="rounded-2xl border border-[var(--article-accent)] bg-[var(--gradient-hero)] p-7 shadow-[var(--shadow-md)]">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[var(--article-accent)]">
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
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-[var(--article-accent)]">
              {headings.length}개 섹션
            </span>
          </div>
          <ol className="mt-4 grid gap-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block rounded-xl px-3 py-2 text-sm leading-6 transition hover:bg-white hover:text-[var(--article-accent)] ${
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

      {officialSources.length > 0 ? (
        <aside className="mt-6 rounded-2xl border border-[var(--border-emphasis)] bg-[var(--bg-soft)] p-5">
          <h2 className="text-base font-extrabold text-[var(--text-strong)]">
            공식 확인 경로
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            제도, 금액, 신청 조건은 바뀔 수 있으니 실행 전 공식 페이지에서 한 번 더 확인하세요.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {officialSources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--article-accent)] underline"
                >
                  {source.name || source.title}
                </a>
                {source.accessed ? (
                  <span className="ml-2 text-[var(--text-caption)]">
                    확인일 {source.accessed}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
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
