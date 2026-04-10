import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { getAllCustomers } from '@/lib/customers';

function currency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

export default async function AdminDashboardPage() {
  const customers = await getAllCustomers();

  const totalLeads = customers.length;

  // ✅ SIMPLE STATS (sementara)
  const deals = customers.filter((c) => c.status === 'closed').length;
  const lost = 0; // sementara belum ada status lost
  const revenue = deals * 50; // dummy value

  const pipeline = [
    { status: 'new', count: customers.filter((c) => c.status === 'new').length },
    { status: 'contacted', count: customers.filter((c) => c.status === 'contacted').length },
    { status: 'converted', count: deals }
  ];

  const recentLeads = customers.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 🔥 STATS */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">Total Leads</p>
          <p className="mt-2 text-3xl font-semibold">{totalLeads}</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Deals</p>
          <p className="mt-2 text-3xl font-semibold">{deals}</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Lost</p>
          <p className="mt-2 text-3xl font-semibold">{lost}</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="mt-2 text-3xl font-semibold">{currency(revenue)}</p>
        </Card>
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
          <h2 className="text-base font-semibold text-slate-900">
            Recent Leads
          </h2>

          {recentLeads.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No recent leads.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentLeads.map((lead) => (
                <li
                  key={lead.id}
                  className="flex items-center justify-between border px-3 py-2 rounded-xl"
                >
                  <p>{lead.name}</p>
                  <StatusBadge status={lead.status || 'new'} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
