import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get('auth')?.value === 'true';
  const { pathname } = request.nextUrl;
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/customers');

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/customers/:path*', '/login']
};
