/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_KEY: 'earnings-sentiment',
  },
 
  // Move serverComponentsExternalPackages to top level (no longer experimental)
  serverExternalPackages: ['@aws-sdk/client-s3'],
  
  // Allow development access from your network IP
  allowedDevOrigins: [
    '192.168.50.16:3000',
    '192.168.50.16',
    'localhost:3000',
    '127.0.0.1:3000',
  ],
  
  // For static export, we need to conditionally include rewrites and headers
  ...(process.env.NODE_ENV !== 'production' && {
    // Rewrites for API proxy during development only
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        },
      ]
    },
    // Security headers for development only
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
          ],
        },
      ]
    },
  }),
  
  // Enable static exports for Amplify deployment
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig