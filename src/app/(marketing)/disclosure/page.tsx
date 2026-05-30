import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "광고 및 제휴 고지",
  description: "신혼지기의 광고 및 제휴 관계를 투명하게 공개합니다.",
  alternates: { canonical: "/disclosure" },
};

export default function DisclosurePage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <section className="rounded-2xl border border-[var(--pink-200)] bg-[linear-gradient(135deg,#FFF1F2_0%,#FFE4E6_100%)] p-7 shadow-[var(--shadow-md)]">
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">
          광고 및 제휴 고지
        </h1>
        <p className="mt-2 text-sm text-[var(--text-caption)]">
          최종 수정일: 2026년 5월 30일
        </p>
      </section>
      <div className="mt-6 space-y-6 text-sm leading-relaxed text-[var(--text-secondary)]">
        <section className="rounded-2xl border border-[var(--pink-200)] bg-[var(--pink-50)] p-5 shadow-[var(--shadow-sm)]">
          <p className="font-semibold text-[var(--text-strong)]">
            신혼지기는 제휴 광고(CPA) 프로그램에 참여하고 있습니다.
          </p>
          <p className="mt-1 text-[var(--text-secondary)]">
            사이트 내 일부 링크를 통해 상품·서비스를 구매하거나 신청하면,
            신혼지기에 수수료가 지급될 수 있습니다. 이는 콘텐츠 운영 비용을
            충당하기 위한 것입니다.
          </p>
        </section>
        <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
          <h2 className="text-base font-semibold text-[var(--text-strong)]">
            광고 표시 방법
          </h2>
          <p className="mt-2">
            제휴 광고 링크에는 반드시 <strong>[광고]</strong> 또는{" "}
            <strong>[제휴 광고]</strong> 라벨이 표시됩니다.
          </p>
        </section>
        <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
          <h2 className="text-base font-semibold text-[var(--text-strong)]">
            콘텐츠 독립성
          </h2>
          <p className="mt-2">
            광고·제휴 관계는 콘텐츠의 객관성에 영향을 주지 않습니다. 신혼지기의
            모든 정보는 공공데이터를 기반으로 작성되며, 광고주의 요청으로 정보를
            왜곡하지 않습니다.
          </p>
        </section>
        <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
          <h2 className="text-base font-semibold text-[var(--text-strong)]">
            현재 제휴 관계
          </h2>
          <p className="mt-2">
            웨딩박람회 사전 등록, 스드메 상담 예약, 신혼여행 견적 서비스 등 결혼
            관련 서비스 제공업체와 제휴 관계를 맺고 있습니다.
          </p>
        </section>
        <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
          <h2 className="text-base font-semibold text-[var(--text-strong)]">
            문의
          </h2>
          <p className="mt-2">
            광고 관련 문의는{" "}
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
