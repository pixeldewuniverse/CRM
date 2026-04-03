import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function getAccessToken() {
  const store = await cookies();
  return store.get('sb-access-token')?.value || '';
}

export async function setAccessToken(token: string) {
  const store = await cookies();
  store.set('sb-access-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/'
  });
}

export async function clearAccessToken() {
  const store = await cookies();
  store.delete('sb-access-token');
}

export async function supabaseFetch(path: string, init: RequestInit = {}, token?: string) {
  const accessToken = token ?? (await getAccessToken());
  return fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: accessToken ? `Bearer ${accessToken}` : `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    },
    cache: 'no-store'
  });
}

export async function getCurrentUser() {
  const res = await supabaseFetch('/auth/v1/user');
  if (!res.ok) return null;
  return res.json();
}
