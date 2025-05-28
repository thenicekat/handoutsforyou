import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define routes that are accessible without authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/unauthorized',
  '/auth/error',
  '/api/auth',
  '/faqs',
  '/maintenance',
  '/manifest.json'
]

// Helper function to check if a route is public
const isPublicRoute = (path: string) => {
  // Check for exact matches first
  if (publicRoutes.includes(path)) return true

  // Check for routes that start with a public prefix
  return publicRoutes.some(route =>
    route !== '/' && path.startsWith(`${route}/`) // Don't match '/' as a prefix
  )
}

// Helper function to check if email is from BITS domain
const isBITSEmail = (email: string | null | undefined) => {
  if (!email) return false
  const EMAIL_REGEX = /^(?:[fh]\d{8}@(hyderabad|pilani|goa|dubai)\.bits-pilani\.ac\.in|[fh]\d{8}[pghd]@alumni\.bits-pilani\.ac\.in)$/
  return EMAIL_REGEX.test(email)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes without any token checks
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  try {
    // Check for authentication token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If no token found, redirect to unauthorized page
    if (!token) {
      return NextResponse.redirect(new URL('/auth/error?error=Unauthorized', request.url))
    }

    // Check for BITS email domain only if we have a token
    if (token.email && !isBITSEmail(token.email)) {
      return NextResponse.redirect(new URL('/auth/error?error=UnauthorizedEmail', request.url))
    }

    // Special routes that require Hyderabad campus email
    const hyderabadOnlyRoutes = ['/courses/grading', '/courses/resources', '/courses/reviews']
    if (
      token.email &&
      hyderabadOnlyRoutes.some(route => pathname.startsWith(route)) &&
      !token.email.includes('hyderabad')
    ) {
      return NextResponse.redirect(new URL('/auth/error?error=HyderabadOnly', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // If there's any error in token validation, redirect to unauthorized page
    return NextResponse.redirect(new URL('/auth/error?error=Unauthorized', request.url))
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
    '/(api|auth|courses|ps|placements|si|higherstudies|rants|chambers)/:path*'
  ]
}
