'use server';

import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'admin@kadobajo.com';
const ADMIN_PASSWORD = '123456';

type LoginResult = {
  success: boolean;
  error?: string;
};

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid email or password.' };
  }

  const store = await cookies();
  store.set('auth', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  return { success: true };
}
