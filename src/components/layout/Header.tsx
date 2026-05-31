"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/jiwon", label: "지원금" },
  { href: "/wedding", label: "결혼식" },
  { href: "/sinhon", label: "신혼 생활" },
  { href: "/blog", label: "블로그" },
];

function LogoMark() {
  return (
    <span
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        background: "var(--bg-dark)",
        color: "var(--gold)",
        display: "grid",
        placeItems: "center",
        boxShadow: "var(--shadow-sm)",
        flexShrink: 0,
        fontSize: 15,
        fontWeight: 800,
      }}
    >
      신
    </span>
  );
}

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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
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
          background: "rgba(248,244,236,.9)",
          backdropFilter: "saturate(140%) blur(12px)",
          WebkitBackdropFilter: "saturate(140%) blur(12px)",
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid var(--border)",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
          transition: "border-color .25s, box-shadow .25s",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "13px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontWeight: 800,
              color: "var(--text-strong)",
              fontSize: 19,
              letterSpacing: "-.02em",
              textDecoration: "none",
            }}
          >
            <LogoMark />
            신혼지기
          </Link>

          <nav
            className="hidden md:flex"
            style={{ alignItems: "center", gap: 24 }}
            aria-label="주요 메뉴"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 15,
                  fontWeight: 650,
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color .2s",
                }}
                onMouseEnter={(event) =>
                  (event.currentTarget.style.color = "var(--gold-deep)")
                }
                onMouseLeave={(event) =>
                  (event.currentTarget.style.color = "var(--text-secondary)")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

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
      </header>

      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60 }}>
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
                  fontWeight: 800,
                  fontSize: 19,
                  color: "var(--text-strong)",
                }}
              >
                <LogoMark />
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
              aria-label="모바일 메뉴"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: "14px",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 17,
                    color: "var(--text-strong)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
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
