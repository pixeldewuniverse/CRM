'use client';

import { FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/login/actions';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);

      if (!result.success) {
        setError(result.error || 'Login failed.');
        return;
      }

      router.replace('/dashboard');
      router.refresh();
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
        <h1 className="mb-5 text-2xl font-semibold">Sign in</h1>
        <label className="mb-2 block text-sm">Email</label>
        <input name="email" type="email" required className="mb-4 w-full rounded border px-3 py-2" />
        <label className="mb-2 block text-sm">Password</label>
        <input name="password" type="password" required className="mb-2 w-full rounded border px-3 py-2" />
        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
        <button disabled={isPending} className="w-full rounded bg-slate-900 py-2 text-white disabled:opacity-60">
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
