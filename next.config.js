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
  async rewrites () {
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
      source: "/:slug*",
      destination: "https://mycareer.fun/:slug*",
    },
    {
      source: "/-strapi-proxy-/:slug*",
      destination: "http://77.232.137.109:1338/:slug*",
    },
  ]
},
}

module.exports = nextConfig
