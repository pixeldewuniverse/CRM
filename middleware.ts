import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDashboardSecret, getDashSessionCookieName, verifyDashSession } from '@/lib/dashboardAuth';

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/dashboard/login', request.url);
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set('next', next);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard/login')) {
    return NextResponse.next();
  }

  const protectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/api/export');
  if (!protectedPath) {
    return NextResponse.next();
  }

  const secret = getDashboardSecret();
  const token = request.cookies.get(getDashSessionCookieName())?.value || '';

  if (!secret || !token) {
    return redirectToLogin(request);
  }

  const isValid = await verifyDashSession(token, secret);
  if (!isValid) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/export'],
};
