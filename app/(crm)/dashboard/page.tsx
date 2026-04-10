import { DealStatusChart } from '@/components/crm/DealStatusChart';
import { requireSession } from '@/lib/auth';
import { CUSTOMER_STATUSES } from '@/lib/customers-types';
import type { CustomerStatus } from '@/types/customer';

async function getTable(path: string, query: string) {
  const { supabaseFetch } = await requireSession();
  const res = await supabaseFetch(`/rest/v1/${path}?${query}`);
  return res.ok ? res.json() : [];
}

export default async function DashboardPage() {
  const [customers, activities] = await Promise.all([
    getTable('customers', 'select=id,status,value'),
    getTable('activities', 'select=id,type,due_date,note&order=created_at.desc&limit=5')
  ]);

  const revenue = customers.reduce((sum: number, row: { value?: number }) => sum + Number(row.value || 0), 0);
  const statusData = CUSTOMER_STATUSES.map((status: CustomerStatus) => ({
    status,
    count: customers.filter((row: { status?: string }) => row.status === status).length
  }));
  const deals = customers.filter((customer: { status?: string }) => customer.status === 'deal').length;
  const lost = customers.filter((customer: { status?: string }) => customer.status === 'lost').length;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card"><p className="text-sm text-slate-500">Total Customers</p><p className="text-3xl font-bold">{customers.length}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Deals</p><p className="text-3xl font-bold">{deals}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Lost</p><p className="text-3xl font-bold">{lost}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Revenue</p><p className="text-3xl font-bold">${revenue.toLocaleString()}</p></div>
      </div>

      <DealStatusChart data={statusData} />

      <div className="card">
        <h3 className="mb-3 text-lg font-semibold">Recent Activities</h3>
        <ul className="space-y-2 text-sm">
          {activities.map((activity: any) => (
            <li key={activity.id} className="flex items-center justify-between border-b pb-2">
              <span className="capitalize">{activity.type.replace('_', ' ')}</span>
              <span className="text-slate-500">{activity.due_date || 'No due date'}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
