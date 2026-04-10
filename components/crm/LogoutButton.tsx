'use client';

import { useTransition } from 'react';
import { logoutAction } from '@/app/login/actions';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logoutAction())}
      disabled={isPending}
      className="w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-100"
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}
