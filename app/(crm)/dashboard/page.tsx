import { requireSession } from '@/lib/auth';
import { DealStatusChart } from '@/components/crm/DealStatusChart';

async function getTable(path: string, query: string) {
  const { supabaseFetch } = await requireSession();
  const res = await supabaseFetch(`/rest/v1/${path}?${query}`);
  return res.ok ? res.json() : [];
}

export default async function DashboardPage() {
  const { supabaseFetch } = await requireSession();

  const [customers, deals, activities] = await Promise.all([
    getTable('customers', 'select=id'),
    getTable('deals', 'select=id,value,status'),
    getTable('activities', 'select=id,type,due_date,note&order=created_at.desc&limit=5')
  ]);

  const revenue = deals.reduce((sum: number, row: any) => sum + Number(row.value || 0), 0);
  const statusData = ['lead', 'prospect', 'deal', 'lost'].map((status) => ({
    status,
    count: deals.filter((row: any) => row.status === status).length
  }));

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><p className="text-sm text-slate-500">Total Customers</p><p className="text-3xl font-bold">{customers.length}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Total Deals</p><p className="text-3xl font-bold">{deals.length}</p></div>
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
