import { NextResponse } from 'next/server';
import {
  createDashSession,
  getDashboardPassword,
  getDashboardSecret,
  getDashSessionCookieName,
  getDashSessionTtlSeconds,
} from '@/lib/dashboardAuth';

export async function POST(req: Request) {
  const dashboardPassword = getDashboardPassword();
  const sessionSecret = getDashboardSecret();

  if (!dashboardPassword || !sessionSecret) {
    return NextResponse.json({ ok: false, error: 'Dashboard auth is not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === 'string' ? body.password : '';

  if (!password || password !== dashboardPassword) {
    return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
  }

  const token = await createDashSession(sessionSecret);
  const response = NextResponse.json({ ok: true });

  response.cookies.set(getDashSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: getDashSessionTtlSeconds(),
  });

  return response;
}
