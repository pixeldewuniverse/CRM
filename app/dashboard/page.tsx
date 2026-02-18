import KanbanBoard from '@/components/dashboard/KanbanBoard';
import { getPrisma, hasDbUrl } from '@/lib/prisma';

export default async function DashboardPage() {
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
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        name: true,
        phone: true,
        segment: true,
        status: true,
        utm_campaign: true,
      },
    });

    const initialLeads = leads.map((lead) => ({
      ...lead,
      createdAt: lead.createdAt.toISOString(),
    }));

    return <KanbanBoard initialLeads={initialLeads} />;
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
