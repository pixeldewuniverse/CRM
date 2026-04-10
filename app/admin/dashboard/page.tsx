import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { getLeadStats, getPipelineBreakdown, getRecentLeads } from '@/lib/leads';

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export default async function AdminDashboardPage() {
  const [stats, pipeline, recentLeads] = await Promise.all([getLeadStats(), getPipelineBreakdown(), getRecentLeads(5)]);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">Overview of your sales pipeline and revenue.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Total Leads</p><p className="mt-2 text-3xl font-semibold">{stats.totalLeads}</p></Card>
        <Card><p className="text-sm text-slate-500">Deals</p><p className="mt-2 text-3xl font-semibold">{stats.deals}</p></Card>
        <Card><p className="text-sm text-slate-500">Lost</p><p className="mt-2 text-3xl font-semibold">{stats.lost}</p></Card>
        <Card><p className="text-sm text-slate-500">Total Revenue</p><p className="mt-2 text-3xl font-semibold">{currency(stats.totalRevenue)}</p></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-base font-semibold text-slate-900">Pipeline Breakdown</h3>
          <ul className="mt-4 space-y-3">
            {pipeline.map((item) => (
              <li key={item.status} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                <StatusBadge status={item.status} />
                <span className="text-sm font-medium text-slate-700">{item.count}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Recent Leads</h3>
            <Link href="/admin/leads" className="text-sm font-medium text-slate-600 hover:text-slate-900">View all</Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No leads yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="rounded-xl border border-slate-100 px-3 py-2">
                  <Link href={`/admin/leads/${lead.id}`} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{lead.name}</p>
                      <p className="text-sm text-slate-500">{lead.phone}</p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
