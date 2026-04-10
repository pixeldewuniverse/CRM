'use client';

import { useState, useTransition } from 'react';
import { Lead, LEAD_STATUSES } from '@/lib/leads';
import { Button } from '@/components/ui/Button';

type Props = {
  lead: Lead;
  onSave: (formData: FormData) => Promise<void>;
};

export function LeadDetailForm({ lead, onSave }: Props) {
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <form
        action={(formData) => {
          startTransition(async () => {
            await onSave(formData);
          });
        }}
        className="grid gap-4 md:grid-cols-2"
      >
        <input type="hidden" name="id" value={lead.id} />

        <label className="space-y-1 text-sm">
          <span className="text-slate-600">Name</span>
          <input name="name" defaultValue={lead.name} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-slate-600">Phone</span>
          <input name="phone" defaultValue={lead.phone} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-slate-600">Email</span>
          <input name="email" defaultValue={lead.email} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-slate-600">Status</span>
          <select name="status" defaultValue={lead.status} className="w-full rounded-lg border border-slate-300 px-3 py-2 capitalize">
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm md:col-span-2">
          <span className="text-slate-600">Value</span>
          <input
            name="value"
            type="number"
            min={0}
            defaultValue={lead.value}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <div className="md:col-span-2">
          <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Notes</h3>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="mt-2 min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
          placeholder="Add notes about follow-ups, next steps, or objections..."
        />
      </div>
    </div>
  );
}
