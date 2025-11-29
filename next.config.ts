import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone' hanya untuk Docker deployment
  // Vercel tidak perlu standalone output, akan handle otomatis
  // Hanya set standalone jika DOCKER_BUILD env var ada
  ...(process.env.DOCKER_BUILD === 'true' ? { output: 'standalone' as const } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api-laporin.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: '*.up.railway.app',
      },
    ],
  },
};

export default nextConfig;
