import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sinhonjigi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "신혼지기 — 결혼·신혼 정보의 모든 것",
    template: "%s | 신혼지기",
  },
  description:
    "공공데이터 기반 결혼 지원금, 신혼부부 혜택, 예식장, 웨딩박람회 정보를 지역별로 한눈에 확인하세요.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "신혼지기",
    url: siteUrl,
  },
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          background: "var(--bg-page)",
          fontFamily:
            "'Pretendard Variable', Pretendard, -apple-system, system-ui, sans-serif",
        }}
      >
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
