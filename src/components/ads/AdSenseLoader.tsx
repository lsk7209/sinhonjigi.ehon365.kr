"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const adsensePublisherId = "ca-pub-3050601904412736";
const readerPrefixes = ["/jiwon", "/wedding", "/sinhon"];

export default function AdSenseLoader() {
  const pathname = usePathname();
  const eligible =
    pathname === "/" ||
    pathname === "/blog" ||
    readerPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

  if (!eligible) return null;

  return (
    <Script
      id="google-adsense"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
      strategy="afterInteractive"
    />
  );
}
