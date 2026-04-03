import { Sidebar } from '@/components/crm/Sidebar';
import { requireSession } from '@/lib/auth';

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  await requireSession();

  return (
    <div className="lg:flex">
      <Sidebar />
      <main className="w-full p-4 lg:p-8">{children}</main>
    </div>
  );
}
