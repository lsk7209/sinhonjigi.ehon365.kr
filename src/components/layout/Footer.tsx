import Link from "next/link";

const footerLinks = [
  { href: "/blog", label: "블로그" },
  { href: "/about", label: "소개" },
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/disclosure", label: "광고·제휴 안내" },
  { href: "/contact", label: "문의하기" },
];

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 56,
        background: "var(--bg-soft)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "32px 20px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontWeight: 800,
            color: "var(--text-strong)",
            fontSize: 16,
          }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: "var(--gradient-emphasis)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21s-7-4.5-9.5-9C.8 8.6 2.3 5 6 5c2.2 0 3.4 1.3 4 2.3C10.6 6.3 11.8 5 14 5c3.7 0 5.2 3.6 3.5 7-2.5 4.5-5.5 9-5.5 9Z" />
            </svg>
          </span>
          신혼지기
        </div>

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gap: 10,
            maxWidth: 820,
          }}
        >
          <p
            style={{
              fontSize: 13.5,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            본 사이트의 정보는 공공데이터와 공식 기관 안내를 바탕으로 제공되며
            일반 정보 목적입니다. 실제 지원 조건과 금액은 각 기관에서 직접
            확인하세요.
          </p>
          <p
            style={{
              fontSize: 13.5,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            일부 링크에는 광고·제휴 수익이 발생할 수 있습니다.{" "}
            <Link
              href="/disclosure"
              style={{
                color: "var(--accent-strong)",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              광고 고지 전문 보기
            </Link>
          </p>
        </div>

        <nav
          style={{
            marginTop: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
          }}
          aria-label="푸터 메뉴"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 13,
                color: "var(--text-caption)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div
          style={{
            marginTop: 16,
            fontSize: 12.5,
            color: "var(--text-caption)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          최종 업데이트 · 2026.05.30
        </div>
      </div>
    </footer>
  );
}
