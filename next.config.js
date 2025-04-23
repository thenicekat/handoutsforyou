const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects() {
    return process.env.NEXT_PUBLIC_SHOW_MAINTENANCE === "1"
      ? [
        {
          source: "/((?!maintenance).*)",
          destination: "/maintenance",
          permanent: false,
        },
      ]
      : [
        {
          source: "/maintenance",
          destination: "/",
          permanent: false,
        },
      ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'http.cat',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
}, nextConfig,
);
