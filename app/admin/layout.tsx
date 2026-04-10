import { AdminSidebar } from '@/components/admin/Sidebar';
import { AdminTopbar } from '@/components/admin/Topbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
