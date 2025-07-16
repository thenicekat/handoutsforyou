const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Use async function for redirects
    async redirects() {
        if (process.env.NEXT_PUBLIC_SHOW_MAINTENANCE === '1') {
            return [
                {
                    source: '/((?!maintenance).*)',
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

// Enhanced runtime caching for PWA
const customRuntimeCaching = [
    ...runtimeCaching,
    {
        urlPattern: /^\/api\/auth\/session$/,
        handler: 'CacheFirst',
        options: {
            cacheName: 'auth-session-cache',
            expiration: {
                maxEntries: 1,
                maxAgeSeconds: 30, // 30 seconds cache for auth
            },
            cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}-${Date.now() - (Date.now() % 30000)}` // Cache per 30-second window
            },
        },
    },
    {
        urlPattern: /\/api\//,
        handler: 'NetworkFirst',
        options: {
            cacheName: 'api-cache',
            expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60, // 1 minute for other API calls
            },
        },
    },
]

module.exports = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    runtimeCaching: customRuntimeCaching,
    buildExcludes: [/middleware-manifest\.json$/],
    publicExcludes: ['!robots.txt', '!sitemap.xml'],
})(nextConfig)
