import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
    cpus: 2,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
