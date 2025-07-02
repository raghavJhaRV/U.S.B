// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('adminToken')?.value;

  const isProtectedPath = request.nextUrl.pathname.startsWith('/protected');

  if (isProtectedPath && token !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*'], // Protect all routes under /protected/
};
