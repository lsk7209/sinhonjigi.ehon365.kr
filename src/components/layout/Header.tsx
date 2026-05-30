"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/jiwon", label: "지원금" },
  { href: "/wedding", label: "결혼식" },
  { href: "/sinhon", label: "신혼 생활" },
  { href: "/wedding/guide", label: "가이드" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,251,247,.88)",
          backdropFilter: "saturate(150%) blur(14px)",
          WebkitBackdropFilter: "saturate(150%) blur(14px)",
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid transparent",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
          transition: "border-color .25s, box-shadow .25s",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            padding: "13px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* 로고 */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontWeight: 700,
              color: "var(--text-strong)",
              fontSize: 19,
              letterSpacing: "-0.02em",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                background: "var(--gradient-emphasis)",
                display: "grid",
                placeItems: "center",
                boxShadow: "var(--shadow-sm)",
                flexShrink: 0,
              }}
            >
              <svg
                width="16"
                height="16"
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
          </Link>

          {/* 데스크톱 네비 */}
          <nav
            className="hidden md:flex"
            style={{ alignItems: "center", gap: 24 }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color .2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent-strong)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-secondary)")
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* 액션 */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="메뉴 열기"
              style={{
                width: 40,
                height: 40,
                border: "none",
                background: "transparent",
                borderRadius: 12,
                color: "var(--text-default)",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 슬라이드 메뉴 */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
          }}
        >
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(45,38,64,.28)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(82vw, 320px)",
              background: "var(--bg-card)",
              boxShadow: "var(--shadow-lg)",
              padding: "22px 22px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  fontWeight: 700,
                  fontSize: 19,
                  color: "var(--text-strong)",
                }}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 10,
                    background: "var(--gradient-emphasis)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
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
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="메뉴 닫기"
                style={{
                  width: 40,
                  height: 40,
                  border: "none",
                  background: "transparent",
                  borderRadius: 12,
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--text-default)",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginTop: 8,
              }}
            >
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: "14px",
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 17,
                    color: "var(--text-strong)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textDecoration: "none",
                  }}
                >
                  {l.label}
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
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
