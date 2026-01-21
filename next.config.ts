import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http',
        hostname: process.env.MINIO_ENDPOINT || 'localhost',
        port: process.env.MINIO_PORT || '9000',
        pathname: `/${process.env.MINIO_BUCKET || 'creative-kindness'}/**`,
      },
    ],
  },
  allowedDevOrigins: ['dobro.koveh.com'],
};

export default nextConfig;
