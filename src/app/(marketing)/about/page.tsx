import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "신혼지기 소개",
  description: "신혼지기는 공공데이터 기반 결혼·신혼 종합 정보 허브입니다.",
  alternates: { canonical: "/about" },
};

const SOURCES = [
  {
    name: "보조금24",
    url: "https://www.bojo24.go.kr",
    desc: "전국 정부 지원금 데이터",
  },
  {
    name: "KOSIS 국가통계포털",
    url: "https://kosis.kr",
    desc: "혼인·신혼부부 통계",
  },
  {
    name: "공공데이터포털",
    url: "https://www.data.go.kr",
    desc: "결혼식장 인허가 정보",
  },
  {
    name: "주택도시기금",
    url: "https://nhuf.molit.go.kr",
    desc: "신혼부부 전세·구입 대출",
  },
  {
    name: "국세청 홈택스",
    url: "https://www.nts.go.kr",
    desc: "결혼 증여세 공제 정보",
  },
  {
    name: "LH한국토지주택공사",
    url: "https://www.lh.or.kr",
    desc: "신혼희망타운·공공주택",
  },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px 48px" }}>
      {/* 헤더 */}
      <div style={{ margin: "8px 0 28px" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: ".02em",
            color: "var(--lav-500)",
            fontFamily: "'Inter',sans-serif",
          }}
        >
          ABOUT
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-.02em",
            marginTop: 6,
            color: "var(--text-strong)",
          }}
        >
          신혼지기 소개
        </h1>
      </div>

      {/* 소개 박스 */}
      <div
        style={{
          borderRadius: 16,
          padding: "20px 22px",
          border: "1px solid var(--lav-100)",
          background: "var(--gradient-hero)",
          boxShadow: "var(--shadow-sm)",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              background: "#fff",
              display: "grid",
              placeItems: "center",
              boxShadow: "var(--shadow-sm)",
              color: "var(--lav-500)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21s-7-4.5-9.5-9C.8 8.6 2.3 5 6 5c2.2 0 3.4 1.3 4 2.3C10.6 6.3 11.8 5 14 5c3.7 0 5.2 3.6 3.5 7-2.5 4.5-5.5 9-5.5 9Z" />
            </svg>
          </div>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "var(--text-strong)",
            }}
          >
            신혼지기란?
          </h2>
        </div>
        <p
          style={{
            color: "var(--text-default)",
            fontSize: 15.5,
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: "var(--text-strong)" }}>신혼지기</strong>는
          결혼을 준비하는 예비부부와 신혼부부를 위해 공공데이터 기반의 정확한
          정보를 제공하는 종합 정보 허브입니다. 정부·지자체 결혼 지원금,
          신혼부부 혜택, 주거 지원 정책을 지역별로 정리해 복잡한 정보를 쉽게
          찾을 수 있도록 돕습니다.
        </p>
      </div>

      {/* 제공 정보 */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 20,
          boxShadow: "var(--shadow-sm)",
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "var(--text-strong)",
            marginBottom: 14,
          }}
        >
          제공 정보
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            "전국·지역별 결혼 지원금 및 신혼부부 혜택",
            "예식장 인허가 현황 (공공데이터 기반)",
            "신혼부부 통계 (KOSIS 혼인·신혼통계)",
            "웨딩박람회 일정 안내",
            "신혼 주거 지원 (디딤돌·버팀목 대출, 신혼희망타운)",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "10px 0",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--lav-400)",
                  marginTop: 8,
                  flexShrink: 0,
                  boxShadow: "0 0 0 3px var(--lav-50)",
                }}
              />
              <span style={{ color: "var(--text-default)", fontSize: 15.5 }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 데이터 출처 */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 20,
          boxShadow: "var(--shadow-sm)",
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "var(--text-strong)",
            marginBottom: 14,
          }}
        >
          데이터 출처
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SOURCES.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: 10,
                background: "var(--bg-soft)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                transition: "border-color .2s",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-strong)",
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    marginTop: 2,
                  }}
                >
                  {s.desc}
                </div>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-caption)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* 갱신 정책 */}
      <div
        style={{
          borderRadius: 14,
          padding: "16px 18px",
          background: "var(--bg-soft)",
          border: "1px solid var(--border)",
          fontSize: 13.5,
          color: "var(--text-secondary)",
          lineHeight: 1.7,
        }}
      >
        <span style={{ color: "var(--sage-500)", marginRight: 6 }}>※</span>본
        사이트의 정보는 주 1회 이상 공공데이터를 자동 수집·갱신합니다. 실제 지원
        조건·금액은 각 기관 공식 사이트에서 반드시 확인하시기 바랍니다. 정보
        오류 신고는{" "}
        <a
          href="/contact"
          style={{ color: "var(--accent-strong)", textDecoration: "underline" }}
        >
          문의하기
        </a>
        로 연락해 주세요.
      </div>
    </div>
  );
}
