import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const EMAIL_REGEX = /^(?:[fh]\d{8}@(hyderabad|pilani)\.bits-pilani\.ac\.in|[fh]\d{8}[pgh]@alumni\.bits-pilani\.ac\.in)$/;

export function middleware(req: NextRequest) {  
  const email = req.cookies.get('userEmail')?.value;
  
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*'], 
};
