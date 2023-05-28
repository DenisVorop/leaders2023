/** @type {import('next').NextConfig} */


const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    // if (process.env.NODE_ENV === "production") {
    //   return []
    // }
    return [
      {
        source: "/_next/:slug*",
        destination: "/_next/:slug*",
      },
      {
        source: "/-auth-/:slug*",
        destination: "https://mycareer.fun/-auth-/:slug*",
      },
      {
        source: "/backend/:slug*",
        destination: "https://mycareer.fun/:slug*",
      },
      {
        source: "/-strapi-proxy-/:slug*",
        destination: "https://cms.mycareer.fun/:slug*",
      },
    ]
  },
}

const withPWA = require('next-pwa')({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === 'development',
  skipWaiting: true,
})

module.exports = withPWA(nextConfig)
