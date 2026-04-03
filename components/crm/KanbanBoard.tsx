'use client';

import { useState } from 'react';

type Deal = {
  id: number;
  title: string;
  status: string;
  value: number;
  customer: { name: string };
  last_activity: string;
};
const columns = ['lead', 'prospect', 'deal', 'lost'];

export function KanbanBoard({ deals }: { deals: Deal[] }) {
  const [items, setItems] = useState(deals);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const moveDeal = async (id: number, status: string) => {
    setItems((prev) => prev.map((deal) => (deal.id === id ? { ...deal, status } : deal)));
    await fetch(`/api/deals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  };

  const onDropColumn = (column: string) => {
    if (draggingId === null) return;
    moveDeal(draggingId, column);
    setDraggingId(null);
    setActiveColumn(null);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {columns.map((column) => (
        <div
          key={column}
          className={`rounded-xl border bg-white p-3 transition-all ${
            activeColumn === column ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200' : 'border-slate-200'
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setActiveColumn(column);
          }}
          onDragLeave={() => setActiveColumn((prev) => (prev === column ? null : prev))}
          onDrop={() => onDropColumn(column)}
        >
          <h3 className="mb-3 text-sm font-semibold uppercase text-slate-500">{column}</h3>
          <div className="space-y-3">
            {items.filter((deal) => deal.status === column).map((deal) => (
              <article
                key={deal.id}
                draggable
                onDragStart={() => setDraggingId(deal.id)}
                onDragEnd={() => {
                  setDraggingId(null);
                  setActiveColumn(null);
                }}
                className={`rounded-lg border p-3 shadow-sm transition-all duration-200 ${
                  draggingId === deal.id
                    ? 'scale-[1.02] border-slate-900 opacity-60 shadow-lg'
                    : 'border-slate-200 hover:-translate-y-0.5 hover:shadow-md'
                }`}
              >
                <p className="font-semibold">{deal.title}</p>
                <p className="text-xs text-slate-500">{deal.customer?.name}</p>
                <p className="mt-1 text-sm font-medium">${Number(deal.value).toLocaleString()}</p>
                <p className="mt-1 text-xs text-slate-500">Last activity: {deal.last_activity || 'No activity yet'}</p>
                <select
                  className="mt-2 w-full rounded border px-2 py-1 text-xs sm:hidden"
                  value={deal.status}
                  onChange={(e) => moveDeal(deal.id, e.target.value)}
                >
                  {columns.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
