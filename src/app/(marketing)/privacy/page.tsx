import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "신혼지기 개인정보처리방침",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <section className="rounded-2xl border border-[var(--lav-200)] bg-[var(--gradient-hero)] p-7 shadow-[var(--shadow-md)]">
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">
          개인정보처리방침
        </h1>
        <p className="mt-2 text-sm text-[var(--text-caption)]">
          최종 수정일: 2026년 5월 30일
        </p>
      </section>
      <div className="mt-6 space-y-6 rounded-2xl border border-[var(--border)] bg-white p-6 text-sm leading-relaxed text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
        <section>
          <h2 className="text-base font-semibold text-[var(--text-strong)]">
            1. 수집하는 개인정보
          </h2>
          <p className="mt-2">
            신혼지기는 서비스 이용 과정에서 아래와 같은 정보를 자동으로 수집할
            수 있습니다.
          </p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>IP 주소, 브라우저 종류, 방문 페이지 등 접속 로그</li>
            <li>서비스 이용 행태 (Google Analytics 4를 통한 익명 통계)</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base font-semibold text-[var(--text-strong)]">
            2. 수집 목적
          </h2>
          <p className="mt-2">
            서비스 품질 개선 및 통계 분석 목적으로만 사용합니다.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-[var(--text-strong)]">
            3. 제3자 서비스
          </h2>
          <p className="mt-2">
            Google Analytics 4를 사용하며, Google의 개인정보처리방침이
            적용됩니다. 일부 외부 링크는 제휴 광고로, 클릭 시 해당 사이트의
            개인정보처리방침이 적용됩니다.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-[var(--text-strong)]">
            4. 문의
          </h2>
          <p className="mt-2">
            개인정보 관련 문의는{" "}
            <a href="/contact" className="font-semibold text-[var(--lav-600)] underline">
              문의 페이지
            </a>
            를 이용해 주세요.
          </p>
        </section>
      </div>
    </article>
  );
}
