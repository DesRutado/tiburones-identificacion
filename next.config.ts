import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Notion uploaded images (pre-signed S3 URLs, proxied via /api/notion-image)
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      // External images embedded in Notion blocks (arbitrary user URLs)
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
