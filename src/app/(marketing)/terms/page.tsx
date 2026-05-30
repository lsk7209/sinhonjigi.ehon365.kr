import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "신혼지기 이용약관",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <section className="rounded-2xl border border-[var(--lav-200)] bg-[var(--gradient-hero)] p-7 shadow-[var(--shadow-md)]">
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">
          이용약관
        </h1>
        <p className="mt-2 text-sm text-[var(--text-caption)]">
          최종 수정일: 2026년 5월 30일
        </p>
      </section>
      <div className="mt-6 space-y-6 rounded-2xl border border-[var(--border)] bg-white p-6 text-sm leading-relaxed text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
        <section>
          <h2 className="text-base font-semibold text-[var(--text-strong)]">
            제1조 (목적)
          </h2>
          <p className="mt-2">
            본 약관은 신혼지기(이하 &ldquo;서비스&rdquo;)의 이용 조건 및 절차,
            이용자와 운영자의 권리·의무를 규정합니다.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-[var(--text-strong)]">
            제2조 (서비스 내용)
          </h2>
          <p className="mt-2">
            신혼지기는 공공데이터를 기반으로 결혼·신혼 관련 정보를 제공합니다.
            제공되는 정보는 참고용이며, 실제 지원 여부는 각 기관에서 확인하시기
            바랍니다.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-[var(--text-strong)]">
            제3조 (면책)
          </h2>
          <p className="mt-2">
            신혼지기는 공공데이터의 정확성에 최선을 다하지만, 정보의 변경·오류로
            인한 손해에 대해 법적 책임을 지지 않습니다.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-[var(--text-strong)]">
            제4조 (광고)
          </h2>
          <p className="mt-2">
            서비스 내 일부 링크는 제휴 광고로, 클릭 시 운영자에게 수수료가
            지급될 수 있습니다. 광고 링크는 명확히 표시됩니다.
          </p>
        </section>
      </div>
    </article>
  );
}
