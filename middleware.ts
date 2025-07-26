import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authOptions } from './pages/api/auth/[...nextauth]'

const EMAIL_REGEX =
    /^(?:[fh]\d{8}@(hyderabad|pilani|goa|dubai)\.bits-pilani\.ac\.in|[fh]\d{8}[pghd]@alumni\.bits-pilani\.ac\.in)$/

const routesWithoutAuth = [
    // Landing page.
    '/',
    // Auth & error pages.
    '/auth/signin',
    '/error',
    '/api/auth',
    '/maintenance',
    // Static assets.
    '/images',
    '/manifest.json',
]

const isPublicRoute = (path: string) => {
    if (routesWithoutAuth.includes(path)) return true
    return routesWithoutAuth.some(
        (route) => route !== '/' && path.startsWith(`${route}/`)
    )
}

export async function processHeaders(
    request: NextApiRequest,
    response: NextApiResponse
) {
    try {
        const session = await getServerSession(request, response, authOptions)
        if (!session) {
            throw new Error('No session found')
        }
        return {
            email: session.user?.email,
            name: session.user?.name,
        }
    } catch (error) {
        throw new Error('Error occured: ' + error)
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (isPublicRoute(pathname)) {
        return NextResponse.next()
    }

    try {
        if (!process.env.NEXTAUTH_SECRET) {
            throw new Error('NEXTAUTH_SECRET is not set')
        }

        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        })

        if (!token) {
            return NextResponse.redirect(
                new URL('/error?error=Unauthorized', request.url)
            )
        }

        if (token.email && !EMAIL_REGEX.test(token.email)) {
            return NextResponse.redirect(
                new URL('/error?error=UnauthorizedEmail', request.url)
            )
        }

        const hyderabadOnlyRoutes = [
            '/courses/grading',
            '/courses/resources',
            '/courses/reviews',
        ]
        if (
            token.email &&
            hyderabadOnlyRoutes.some((route) => pathname.startsWith(route)) &&
            !token.email.includes('hyderabad')
        ) {
            return NextResponse.redirect(
                new URL('/error?error=HyderabadOnly', request.url)
            )
        }

        return NextResponse.next()
    } catch (error) {
        return NextResponse.redirect(
            new URL('/error?error=Unauthorized', request.url)
        )
    }
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. _next/static (static files)
         * 2. _next/image (image optimization files)
         * 3. Static assets (images, icons, etc)
         * 4. public folder
         */
        '/((?!_next/static|_next/image|public).*)',
        '/(api|auth|courses|ps|placements|si|higherstudies|rants|chambers)/:path*',
    ],
}
