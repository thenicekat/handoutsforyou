import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const routesWithoutAuth = [
    '/',
    '/auth/signin',
    '/error',
    '/api/auth',
    '/faqs',
    '/maintenance',
    '/manifest.json',
]

const isPublicRoute = (path: string) => {
    if (routesWithoutAuth.includes(path)) return true

    return routesWithoutAuth.some(
        (route) => route !== '/' && path.startsWith(`${route}/`)
    )
}

const validateEmail = (email: string | null | undefined) => {
    if (!email) return false
    const EMAIL_REGEX =
        /^(?:[fh]\d{8}@(hyderabad|pilani|goa|dubai)\.bits-pilani\.ac\.in|[fh]\d{8}[pghd]@alumni\.bits-pilani\.ac\.in)$/
    return EMAIL_REGEX.test(email)
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (isPublicRoute(pathname)) {
        return NextResponse.next()
    }

    try {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        })

        if (!token) {
            return NextResponse.redirect(
                new URL('/error?error=Unauthorized', request.url)
            )
        }

        if (token.email && !validateEmail(token.email)) {
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
