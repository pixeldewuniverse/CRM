import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-slate-900">CRM Admin</h1>
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
            <Link href="/admin/dashboard" className="hover:text-slate-900">Dashboard</Link>
            <Link href="/admin/leads" className="hover:text-slate-900">Leads</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
