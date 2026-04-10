import Link from 'next/link';
import { StatusBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { getLeads, LEAD_STATUSES } from '@/lib/leads';
import { deleteLeadAction, updateLeadStatusAction } from './actions';

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

export default async function LeadsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || '';
  const status = params.status || '';

  const leads = await getLeads({ search: q, status });

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Leads</h2>
        <p className="mt-1 text-sm text-slate-500">Track, update, and manage your pipeline.</p>
      </section>

      <Card>
        <form className="grid gap-3 md:grid-cols-[1fr_200px_auto]">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring"
          />
          <select name="status" defaultValue={status} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring">
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">Apply</button>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        {leads.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No leads found.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/leads/${lead.id}`} className="font-medium text-slate-900 hover:underline">{lead.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{lead.phone}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3 text-slate-600">{currency(lead.value)}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <form action={updateLeadStatusAction}>
                          <input type="hidden" name="id" value={lead.id} />
                          <select
                            name="status"
                            defaultValue={lead.status}
                            onChange={(event) => event.currentTarget.form?.requestSubmit()}
                            className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                          >
                            {LEAD_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
                          </select>
                        </form>
                        <form action={deleteLeadAction}>
                          <input type="hidden" name="id" value={lead.id} />
                          <button className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
