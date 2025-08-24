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
        protocol: 'http',
        hostname: '65.109.88.77',
        port: '9000',
        pathname: '/creative-kindness/**',
      },
    ],
  },
  allowedDevOrigins: ['dobro.koveh.com'],
};

export default nextConfig;
