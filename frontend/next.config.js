/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  env: {
  },
  
  // Move serverComponentsExternalPackages to top level (no longer experimental)
  serverExternalPackages: ['@aws-sdk/client-s3'],
  
  // Allow development access from your network IP
  allowedDevOrigins: [
    '192.168.50.16:3000', 
    '192.168.50.16', 
    'localhost:3000', 
    '127.0.0.1:3000'
  ],
  
  // Custom webpack configuration for path resolution
  webpack: (config, { isServer }) => {
    // Add path aliases to ensure @ imports work in all environments
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/constants': path.resolve(__dirname, './src/constants'),
      '@/api': path.resolve(__dirname, './src/api'),
    }
    
    return config
  },
  
  // API proxy for development and production
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },
  
  // Security headers
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