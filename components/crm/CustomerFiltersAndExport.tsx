'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CUSTOMER_STATUSES, type Customer } from '@/lib/customers-types';

function toCsvValue(value: string | null | undefined) {
  const safeValue = (value ?? '').replace(/"/g, '""');
  return `"${safeValue}"`;
}

export function CustomerFiltersAndExport({
  customers,
  selectedStatus
}: {
  customers: Customer[];
  selectedStatus: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(selectedStatus);

  function handleStatusChange(nextStatus: string) {
    setStatus(nextStatus);
    const params = new URLSearchParams(searchParams.toString());

    if (nextStatus) {
      params.set('status', nextStatus);
    } else {
      params.delete('status');
    }

    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  function handleExportCsv() {
    const csv = [
      ['Name', 'Email', 'Phone', 'Status'],
      ...customers.map((customer) => [customer.name, customer.email || '', customer.phone || '', customer.status || 'new'])
    ]
      .map((row) => row.map((cell) => toCsvValue(cell)).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'customers.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card mb-4 flex flex-wrap items-center gap-3">
      <select
        value={status}
        onChange={(event) => handleStatusChange(event.target.value)}
        className="rounded border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring"
      >
        <option value="">All</option>
        {CUSTOMER_STATUSES.map((customerStatus) => (
          <option key={customerStatus} value={customerStatus}>
            {customerStatus.charAt(0).toUpperCase() + customerStatus.slice(1)}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleExportCsv}
        className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Export CSV
      </button>
    </div>
  );
}
