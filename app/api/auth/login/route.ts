import { NextResponse } from 'next/server';
import { setAccessToken } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) return NextResponse.redirect(new URL('/login?error=1', request.url));

  const data = await response.json();
  await setAccessToken(data.access_token);
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
