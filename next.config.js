/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

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

module.exports = nextConfig
