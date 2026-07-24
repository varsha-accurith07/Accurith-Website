import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — matches the production constraint (Cloudflare Pages, no
  // runtime server). API calls go through Pages Functions (Srujana's track).
  output: "export",
  // next/image optimization needs a server; static export serves images as-is.
  images: { unoptimized: true },
};

export default nextConfig;
