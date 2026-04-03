'use client';

import { useState } from 'react';

type Deal = { id: number; title: string; status: string; value: number; customer: { name: string } };
const columns = ['lead', 'prospect', 'deal', 'lost'];

export function KanbanBoard({ deals }: { deals: Deal[] }) {
  const [items, setItems] = useState(deals);

  const moveDeal = async (id: number, status: string) => {
    setItems((prev) => prev.map((deal) => (deal.id === id ? { ...deal, status } : deal)));
    await fetch(`/api/deals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {columns.map((column) => (
        <div key={column} className="rounded-xl border bg-white p-3">
          <h3 className="mb-3 text-sm font-semibold uppercase text-slate-500">{column}</h3>
          <div className="space-y-3">
            {items.filter((deal) => deal.status === column).map((deal) => (
              <div key={deal.id} className="rounded-lg border p-3">
                <p className="font-semibold">{deal.title}</p>
                <p className="text-xs text-slate-500">{deal.customer?.name}</p>
                <p className="mt-1 text-sm font-medium">${Number(deal.value).toLocaleString()}</p>
                <select
                  className="mt-2 w-full rounded border px-2 py-1 text-xs"
                  value={deal.status}
                  onChange={(e) => moveDeal(deal.id, e.target.value)}
                >
                  {columns.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
