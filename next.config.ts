import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '65.109.88.77',
        port: '9000',
        pathname: '/creative-kindness/**',
      },
    ],
  },
};

export default nextConfig;
