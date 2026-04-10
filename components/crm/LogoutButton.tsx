'use client';

import { useTransition } from 'react';
import { logoutAction } from '@/app/login/actions';

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={className ?? 'rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:opacity-60'}
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}
