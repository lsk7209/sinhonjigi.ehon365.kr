import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기",
  description: "신혼지기에 문의하세요.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <section className="rounded-2xl border border-[var(--lav-200)] bg-[var(--gradient-hero)] p-7 shadow-[var(--shadow-md)]">
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">
          문의하기
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          데이터 제보, 광고 제휴, 개선 제안을 받습니다.
        </p>
      </section>
      <div className="mt-6 space-y-4 text-[var(--text-secondary)] leading-relaxed">
        <p>
          신혼지기에 대한 문의, 제보, 광고 제안은 아래 이메일로 연락해 주세요.
        </p>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
          <p className="text-sm text-[var(--text-caption)]">이메일 문의</p>
          <p className="mt-1 font-semibold text-[var(--lav-600)]">
            contact@sinhonjigi.com
          </p>
        </div>
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-white p-5 text-sm text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
          <p>
            <strong>데이터 오류 제보:</strong> 잘못된 지원금 정보나 만료된
            정책을 발견하셨다면 알려주세요. 빠르게 수정하겠습니다.
          </p>
          <p>
            <strong>광고·제휴 문의:</strong> 결혼·신혼 관련 서비스 제공업체의
            제휴 문의를 환영합니다.
          </p>
          <p>
            <strong>개선 제안:</strong> 더 나은 서비스를 위한 의견을 보내주세요.
          </p>
        </div>
      </div>
    </article>
  );
}
