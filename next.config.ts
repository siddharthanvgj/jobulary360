import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['jobulary360.vercel.app', 'localhost:3000'],
    },
  },
}

export default nextConfig
