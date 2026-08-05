import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Demo/MVP: task photos, avatars, and KYC docs come from mocked or
    // user-provided URLs. Production should scope this to the S3 bucket
    // and CDN domains HSTLE actually serves from.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
