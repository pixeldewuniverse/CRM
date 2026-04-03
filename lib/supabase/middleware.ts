import { NextResponse, type NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/customers', '/deals', '/activities', '/messages'];

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value;
  const isProtected = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!token && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (token && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
