import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './pages/api/auth/[...nextauth]';

const EMAIL_REGEX = /^(?:[fh]\d{8}@(hyderabad|pilani)\.bits-pilani\.ac\.in|[fh]\d{8}[pgh]@alumni\.bits-pilani\.ac\.in)$/;
// const EMAIL_REGEX = /a/;

export async function middleware(req: NextRequest) {
  const session = await getServerSession(req, NextResponse.next(), authOptions);

  if (!session) {
    return NextResponse.json(
      {
        message: 'Unauthorized, please login and try again',
        error: true,
        data: [],
      },
      { status: 401 }
    );
  }

  const email = session?.user?.email;

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      {
        message: 'Access restricted to BITS Hyderabad or Pilani students/alumni',
        error: true,
        data: [],
      },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
