'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/crm/LogoutButton';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/customers', label: 'Customers' },
  { href: '/deals', label: 'Pipeline' },
  { href: '/activities', label: 'Activities' },
  { href: '/messages', label: 'Messages' }
];

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:opacity-60">
      {pending ? 'Logging out...' : 'Logout'}
    </button>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-200 bg-white px-4 py-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <h1 className="mb-4 text-xl font-bold text-slate-900">CRM Suite</h1>
      <nav className="flex gap-2 lg:flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              pathname.startsWith(link.href)
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
