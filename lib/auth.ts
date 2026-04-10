import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseFetch } from './supabase/server';

export async function requireSession() {
  const store = await cookies();
  const isAuthenticated = store.get('auth')?.value === 'true';

  if (!isAuthenticated) redirect('/login');

  return {
    user: { email: 'admin@kadobajo.com' },
    profile: null,
    supabaseFetch
  };
}
