/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
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
      source: "/backend/:slug*",
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
