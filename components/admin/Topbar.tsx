'use client';

import { usePathname } from 'next/navigation';

const titleMap: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/leads': 'Leads'
};

export function AdminTopbar() {
  const pathname = usePathname();
  const title = titleMap[pathname] || 'Admin';

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">Admin User</div>
    </header>
  );
}
