import { NextResponse } from 'next/server';
import { getDashSessionCookieName } from '@/lib/dashboardAuth';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getDashSessionCookieName(), '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
