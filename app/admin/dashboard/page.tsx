import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { getAllCustomers } from '@/lib/customers';
import { getDashboardStats } from '@/lib/customers';

function currency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

export default async function AdminDashboardPage() {
  const [{ totalLeads, deals, lost, revenue, pipeline }, recentCustomers] = await Promise.all([
    getDashboardStats(),
    getAllCustomers()
  ]);

const recentCustomers = customers.slice(0, 5);
  

  return (
    <div className="space-y-6">
      {/* 🔥 STATS */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Total Customers</p><p className="mt-2 text-3xl font-semibold">{totalLeads}</p></Card>
        <Card><p className="text-sm text-slate-500">Deals</p><p className="mt-2 text-3xl font-semibold">{deals}</p></Card>
        <Card><p className="text-sm text-slate-500">Lost</p><p className="mt-2 text-3xl font-semibold">{lost}</p></Card>
        <Card><p className="text-sm text-slate-500">Revenue</p><p className="mt-2 text-3xl font-semibold">{currency(revenue)}</p></Card>
      </section>

      {/* 🔥 PIPELINE + RECENT */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold text-slate-900">
            Pipeline Summary
          </h2>

          <ul className="mt-4 space-y-3">
            {pipeline.map((item) => (
              <li
                key={item.status}
                className="flex items-center justify-between border px-3 py-2 rounded-xl"
              >
                <StatusBadge status={item.status} />
                <span>{item.count}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-slate-900">Recent Customers</h2>
          {recentCustomers.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No recent customers.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentCustomers.map((customer) => (
                <li key={customer.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                  <p className="font-medium text-slate-900">{customer.name}</p>
                  <StatusBadge status={customer.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
