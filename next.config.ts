import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  distDir: "build",
  // experimental: {
  //   useCache: true,
  //   dynamicIO: true,
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    STRAPI_BASE_URL: "http://localhost:1335",
    STRAPI_API_URL: "http://localhost:1335/api",
    BASE_URL: "http://localhost:3019",
    COMPANY_NAME: "Community Archive",
  },
  images: {
    domains: ["localhost"], // or your Strapi domain
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "youtube.com",
        port: "",
        pathname: "/s/**",
      },
    ],
  },
};

export default bundleAnalyzer(nextConfig);

//export default nextConfig;
