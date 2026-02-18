import { getPrisma, hasDbUrl } from '@/lib/prisma';

export default async function DashboardPage({ searchParams }) {
  const status = searchParams?.status;
  const segment = searchParams?.segment;

  if (!hasDbUrl()) {
    return (
      <main className="mx-auto w-[min(1100px,94%)] py-8">
        <section className="card">
          <h1 className="mb-4 text-2xl font-bold">CRM Dashboard</h1>
          <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900">
            DATABASE_URL is not configured. Set it in your environment to load leads.
          </p>
        </section>
      </main>
    );
  }

  try {
    const prisma = getPrisma();
    const leads = await prisma.lead.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(segment ? { segment } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return (
      <main className="mx-auto w-[min(1100px,94%)] py-8">
        <section className="card">
          <h1 className="mb-4 text-2xl font-bold">CRM Dashboard</h1>
          <form className="mb-4 flex flex-wrap gap-2" method="GET">
            <select className="input w-44" name="status" defaultValue={status || ''}>
              <option value="">All status</option>
              {['new', 'contacted', 'qualified', 'won', 'lost'].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <select className="input w-44" name="segment" defaultValue={segment || ''}>
              <option value="">All segment</option>
              {['hot', 'warm'].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <button className="btn" type="submit">Filter</button>
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-200 bg-white text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Phone</th>
                  <th className="border p-2 text-left">Interest</th>
                  <th className="border p-2 text-left">Segment</th>
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-left">Campaign</th>
                  <th className="border p-2 text-left">CreatedAt</th>
                </tr>
              </thead>
              <tbody>
                {leads.length ? leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="border p-2">{lead.name}</td>
                    <td className="border p-2">{lead.phone}</td>
                    <td className="border p-2">{lead.interest}</td>
                    <td className="border p-2 uppercase">{lead.segment}</td>
                    <td className="border p-2">{lead.status}</td>
                    <td className="border p-2">{lead.utm_campaign || '-'}</td>
                    <td className="border p-2">{new Date(lead.createdAt).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td className="border p-2 text-slate-500" colSpan={7}>No leads yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    );
  } catch {
    return (
      <main className="mx-auto w-[min(1100px,94%)] py-8">
        <section className="card">
          <h1 className="mb-4 text-2xl font-bold">CRM Dashboard</h1>
          <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900">
            Could not load leads right now. Please check database connectivity and try again.
          </p>
        </section>
      </main>
    );
  }
}
