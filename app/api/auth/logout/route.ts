import { clearAccessToken } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await clearAccessToken();
  return NextResponse.redirect(new URL('/login', request.url));
}
