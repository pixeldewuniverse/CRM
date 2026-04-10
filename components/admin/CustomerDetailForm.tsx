'use client';

import { useTransition } from 'react';
import type { Customer } from '@/lib/customers-types';
import { CUSTOMER_STATUSES } from '@/lib/customers-types';

type Props = {
  customer: Customer;
  onSave: (formData: FormData) => Promise<void>;
};

export function CustomerDetailForm({ customer, onSave }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await onSave(formData);
        });
      }}
      className="grid gap-4 md:grid-cols-2"
    >
      <input type="hidden" name="id" value={customer.id} />

      <label className="space-y-1 text-sm">
        <span className="text-slate-600">Name</span>
        <input name="name" defaultValue={customer.name} className="w-full rounded-xl border border-slate-300 px-3 py-2" required />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-600">Email</span>
        <input name="email" type="email" defaultValue={customer.email || ''} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-600">Phone</span>
        <input name="phone" defaultValue={customer.phone || ''} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-600">Status</span>
        <select
          name="status"
          defaultValue={customer.status}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 capitalize"
        >
          {CUSTOMER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1 text-sm md:col-span-2">
        <span className="text-slate-600">Notes</span>
        <textarea
          name="notes"
          defaultValue={customer.notes || ''}
          className="min-h-32 w-full rounded-xl border border-slate-300 px-3 py-2"
          placeholder="Add customer context, follow-up details, or internal notes..."
        />
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
