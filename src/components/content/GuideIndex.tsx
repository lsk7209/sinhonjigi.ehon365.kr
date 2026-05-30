import Link from "next/link";
import {
  getGuidesBySection,
  getNextScheduledGuide,
  GUIDE_SECTION_LABEL,
  type GuideSection,
} from "@/lib/guides";

interface Props {
  section: GuideSection;
}

export default function GuideIndex({ section }: Props) {
  const guides = getGuidesBySection(section);
  const nextGuide = getNextScheduledGuide(section);
  const label = GUIDE_SECTION_LABEL[section];

  return (
    <article className="mx-auto max-w-5xl px-5 py-8">
      <section className="rounded-2xl border border-[var(--lav-200)] bg-[var(--gradient-hero)] p-7 shadow-[var(--shadow-md)]">
        <p className="text-xs font-bold uppercase text-[var(--lav-500)]">
          Guides
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-tight text-[var(--text-strong)]">
          {label}
        </h1>
        <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--text-default)]">
          신혼지기 편집 기준을 통과한 글만 예약 시각 이후 공개합니다. 정책,
          계약, 지원금 정보는 공식 출처 확인을 전제로 안내합니다.
        </p>
      </section>

      {guides.length > 0 ? (
        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/${section}/guide/${guide.slug}`}
              className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--lav-200)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[var(--lav-50)] px-2.5 py-1 text-xs font-bold text-[var(--lav-600)]">
                  {guide.quality_score}점
                </span>
                <time className="text-xs text-[var(--text-caption)]">
                  {formatDate(guide.scheduled_at)}
                </time>
              </div>
              <h2 className="mt-3 text-base font-bold leading-snug text-[var(--text-strong)]">
                {guide.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                {guide.subtitle}
              </p>
              <p className="mt-3 text-xs font-semibold text-[var(--text-caption)]">
                {guide.main_keyword}
              </p>
            </Link>
          ))}
        </section>
      ) : (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <h2 className="text-lg font-bold text-[var(--text-strong)]">
            예약된 글을 준비 중입니다
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            아직 공개 시각이 지난 글이 없습니다.
            {nextGuide
              ? ` 다음 글은 ${formatDateTime(nextGuide.scheduled_at)}에 공개됩니다.`
              : " 생성된 예약 글이 있으면 이곳에 순차 공개됩니다."}
          </p>
        </section>
      )}
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}
