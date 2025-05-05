const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Use async function for redirects
  async redirects() {
    if (process.env.NEXT_PUBLIC_SHOW_MAINTENANCE === "1") {
      return [
        {
          source: "/((?!maintenance).*)",
          destination: "/maintenance",
          permanent: false,
        },
      ];
    } else {
      return [
        {
          source: "/maintenance",
          destination: "/",
          permanent: false,
        },
      ];
    }
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'http.cat',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;

// module.exports = withPWA({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
//   runtimeCaching,
// })(nextConfig);
