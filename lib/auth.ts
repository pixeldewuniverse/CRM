import { redirect } from 'next/navigation';
import { getCurrentUser, supabaseFetch } from './supabase/server';

export async function requireSession() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const profileRes = await supabaseFetch(`/rest/v1/profiles?id=eq.${user.id}&select=*`);
  const profiles = profileRes.ok ? await profileRes.json() : [];

  return { user, profile: profiles[0] || null, supabaseFetch };
}
