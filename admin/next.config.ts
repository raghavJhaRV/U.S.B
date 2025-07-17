/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allow production builds to succeed even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['bratlcnxybxyydxnnimr.supabase.co'],
  },
}

module.exports = nextConfig
