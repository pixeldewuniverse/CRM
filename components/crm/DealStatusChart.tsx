import type { CustomerStatus } from '@/types/customer';

export function DealStatusChart({ data }: { data: { status: CustomerStatus; count: number }[] }) {
  return (
    <div className="card">
      <h3 className="mb-3 text-lg font-semibold">Pipeline</h3>
      <div className="space-y-2">
        {data.map((row) => (
          <div key={row.status}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="capitalize">{row.status}</span>
              <span>{row.count}</span>
            </div>
            <div className="h-2 rounded bg-slate-100">
              <div className="h-2 rounded bg-slate-900" style={{ width: `${Math.max(5, row.count * 10)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
