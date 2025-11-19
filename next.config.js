const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Use async function for redirects
    async redirects() {
        if (process.env.MAINTENANCE === '1') {
            return [
                {
                    source: '/((?!maintenance|error|api).*)',
                    destination: '/maintenance',
                    permanent: false,
                },
            ]
        } else {
            return [
                {
                    source: '/maintenance',
                    destination: '/',
                    permanent: false,
                },
            ]
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
}

module.exports = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
    buildExcludes: [/middleware-manifest\.json$/],
    publicExcludes: ['!robots.txt', '!sitemap.xml'],
})(nextConfig)
