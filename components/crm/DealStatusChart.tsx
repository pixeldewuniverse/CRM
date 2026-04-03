export function DealStatusChart({ data }: { data: { status: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold">Pipeline Analytics</h3>
      <div className="space-y-3">
        {data.map((row) => (
          <div key={row.status}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="capitalize">{row.status}</span>
              <span>{row.count}</span>
            </div>
            <div className="h-3 rounded bg-slate-100">
              <div
                className="h-3 rounded bg-slate-900"
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
