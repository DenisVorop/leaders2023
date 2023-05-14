/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  async rewrites() {
    return [
      {
        source: "/_next/:slug*",
        destination: "/_next/:slug*",
      },
      {
        source: "/partner/:slug*",
        destination: "http://65.21.179.123:8999/:slug*",
      },
      {
        source: "/-strapi-proxy-/:slug*",
        destination: "http://77.232.137.109:1338/:slug*",
      },
    ]
  },
}

module.exports = nextConfig
