import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack doesn't require special webpack config for pdfjs
  // pdfjs-dist will work with standard asset handling
};

export default nextConfig;
