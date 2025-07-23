import * as jose from 'jose'
import type { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const jwtConfig = {
    secret: new TextEncoder().encode(process.env.NEXTAUTH_SECRET),
}

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

export async function processHeaders(req: NextApiRequest) {
    if (!process.env.NEXTAUTH_SECRET) {
        throw new Error('NEXTAUTH_SECRET is not set.')
    }
    const h4uToken = req.headers['h4u-token'] as string
    if (!h4uToken) {
        throw new Error('H4U token not found in headers.')
    }
    const decoded = await jose.jwtVerify(h4uToken, jwtConfig.secret)
    return {
        email: decoded.payload.email,
        name: decoded.payload.name,
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

        if (
            pathname.startsWith('/api/') &&
            !pathname.startsWith('/api/auth/')
        ) {
            const response = NextResponse.next()

            if (token.email && token.name) {
                try {
                    const h4uToken = await new jose.SignJWT({
                        email: token.email,
                        name: token.name,
                    })
                        .setProtectedHeader({ alg: 'HS256' })
                        .sign(jwtConfig.secret)
                    response.headers.set('h4u-token', h4uToken)
                } catch (error) {
                    console.error('Error creating H4U token:', error)
                }
            }
            console.log('H4U token created')

            return response
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
