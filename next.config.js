// const withPWA = require("next-pwa");

// module.exports = withPWA({
//     dest: "public",
//     register: true,
//     skipWaiting: true,
//     disable: process.env.NODE_ENV === "development",
// });

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
};

module.exports = nextConfig;
