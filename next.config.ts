import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Keep dev and build artifacts separate to avoid chunk/manifest corruption.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
}

export default nextConfig