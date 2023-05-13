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
    }
  ]
},
}

module.exports = nextConfig
