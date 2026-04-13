import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { StatusDropdown } from '@/components/crm/StatusDropdown';
import { CustomerFiltersAndExport } from '@/components/crm/CustomerFiltersAndExport';
import { CUSTOMER_STATUSES } from '@/lib/customers-types';

export default async function CustomersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { supabaseFetch } = await requireSession();
  const params = await searchParams;
  const q = params.q || '';
  const status = params.status || '';

  const filters = [`select=*`, `order=created_at.desc`];
  if (q) filters.push(`or=(name.ilike.*${q}*,phone.ilike.*${q}*,email.ilike.*${q}*)`);
  if (status && CUSTOMER_STATUSES.includes(status as (typeof CUSTOMER_STATUSES)[number])) {
    filters.push(`status=eq.${encodeURIComponent(status)}`);
  }

  const res = await supabaseFetch(`/rest/v1/customers?${filters.join('&')}`);
  const customers = res.ok ? await res.json() : [];

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Link href="/customers/new" className="rounded bg-slate-900 px-3 py-2 text-white">+ Add Customer</Link>
      </div>

      <form className="card mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <input name="q" placeholder="Search name/phone/email" defaultValue={q} className="rounded border px-3 py-2" />
        <button className="rounded bg-slate-900 px-3 py-2 text-white">Search</button>
      </form>

      <CustomerFiltersAndExport customers={customers} selectedStatus={status} />

      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Tag</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: any) => (
              <tr key={customer.id} className="border-t">
                <td className="py-2"><Link className="font-medium" href={`/customers/${customer.id}`}>{customer.name}</Link></td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>
                  <StatusDropdown id={customer.id} currentStatus={customer.status || 'new'} />
                </td>
                <td>{customer.tag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
