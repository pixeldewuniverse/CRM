import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

export async function supabaseFetch(path: string, options: RequestInit = {}) {
  return fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    cache: 'no-store'
  });
}

export async function getCurrentUser() {
  const res = await supabaseFetch('/auth/v1/user');
  if (!res.ok) return null;
  return res.json();
}
