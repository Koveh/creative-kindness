/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['child_process'],
  images: {
    unoptimized: true
  },
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
