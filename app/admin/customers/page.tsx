import { Card } from '@/components/ui/Card';
import { CustomerTable } from '@/components/admin/CustomerTable';
import { getAllCustomers } from '@/lib/customers';
import { CUSTOMER_STATUSES } from '@/lib/customers-types';

export default async function CustomersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || '';
  const status = params.status || '';

  const customers = await getAllCustomers({ search: q, status });

  return (
    <div className="space-y-6">
      <Card>
        <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or email"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring"
          />

          <select
            name="status"
            defaultValue={status}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring"
          >
            <option value="">All statuses</option>
            {CUSTOMER_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-700">
            Apply
          </button>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        <CustomerTable customers={customers} />
      </Card>
    </div>
  );
}
