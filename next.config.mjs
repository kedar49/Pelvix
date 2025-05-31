/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize font loading and reduce warnings
  experimental: {
    fontLoaders: [
      { loader: '@next/font/local', options: { preload: true } }
    ]
  },
  // Reduce development noise
  devIndicators: {
    buildActivity: false
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false
};

export default nextConfig;