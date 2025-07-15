// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import  {jwtDecode}  from 'jwt-decode';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('adminJwt')?.value;
  const isProtectedPath = request.nextUrl.pathname.startsWith('/protected');

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      if (Date.now() / 1000 > exp) {
        // expired
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch {
      // invalid token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*'],
};