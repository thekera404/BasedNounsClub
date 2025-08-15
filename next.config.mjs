/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for Farcaster Mini Apps
  experimental: {
    esmExternals: true,
  },
  
  // Configure headers for Farcaster embedding
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.farcaster.xyz https://*.warpcast.com",
          },
        ],
      },
      {
        source: '/.well-known/farcaster.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ]
  },

  async rewrites() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: '/api/farcaster-manifest',
      },
    ]
  },

  // Image optimization for NFT previews
  images: {
    domains: ['placeholder.svg', 'ipfs.io', 'gateway.pinata.cloud'],
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
