import { StatusDropdown } from '@/components/crm/StatusDropdown';
import Link from 'next/link';
import type { Customer } from '@/lib/customers-types';

export function CustomerTable({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return <div className="p-10 text-center text-sm text-slate-500">No customers found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Created At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 font-medium text-slate-900">
                <Link href={`/admin/customers/${customer.id}`} className="hover:underline">
                  {customer.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">{customer.email || '-'}</td>
              <td className="px-4 py-3 text-slate-600">{customer.phone || '-'}</td>
              <td className="px-4 py-3 text-slate-600">
                <StatusDropdown id={customer.id} currentStatus={customer.status || 'new'} />
              </td>
              <td className="px-4 py-3 text-slate-600">{customer.source || '-'}</td>
              <td className="px-4 py-3 text-slate-600">{new Date(customer.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
