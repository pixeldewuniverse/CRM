import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import LeadTable from '@/components/LeadTable';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }) {
  const status = searchParams.status || undefined;
  const segment = searchParams.segment || undefined;
  const utm_campaign = searchParams.utm_campaign || undefined;

  const leads = await prisma.lead.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(segment ? { segment } : {}),
      ...(utm_campaign ? { utm_campaign: { contains: utm_campaign, mode: 'insensitive' } } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  const qs = new URLSearchParams();
  if (status) qs.set('status', status);
  if (segment) qs.set('segment', segment);
  if (utm_campaign) qs.set('utm_campaign', utm_campaign);

  return (
    <main className="mx-auto w-[min(1200px,94%)] py-8">
      <section className="card">
        <h1 className="mb-4 text-2xl font-bold">CRM Dashboard</h1>
        <form className="mb-4 flex flex-wrap gap-3">
          <select className="input w-44" name="status" defaultValue={status || ''}>
            <option value="">All status</option>
            {['new', 'contacted', 'qualified', 'won', 'lost'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className="input w-44" name="segment" defaultValue={segment || ''}>
            <option value="">All segment</option>
            {['hot', 'warm'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input className="input w-52" name="utm_campaign" placeholder="utm_campaign" defaultValue={utm_campaign || ''} />
          <button className="btn" type="submit">Apply filters</button>
        </form>

        <div className="mb-4 flex flex-wrap gap-2">
          <Link className="btn" href="/api/export?segment=hot">Export HOT CSV</Link>
          <Link className="btn" href="/api/export?segment=warm">Export WARM CSV</Link>
          <Link className="btn-secondary" href={`/api/export?${qs.toString()}`}>Export filtered CSV</Link>
        </div>

        <LeadTable leads={leads} />
      </section>
    </main>
  );
}
