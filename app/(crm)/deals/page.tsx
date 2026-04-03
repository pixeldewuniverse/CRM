import { requireSession } from '@/lib/auth';
import { KanbanBoard } from '@/components/crm/KanbanBoard';

export default async function DealsPage() {
  const { supabaseFetch } = await requireSession();
  const customersRes = await supabaseFetch('/rest/v1/customers?select=id,name&order=name.asc');
<<<<<<< codex/define-data-models-for-user,-customer,-deal-5wr79d
  const dealsRes = await supabaseFetch('/rest/v1/deals?select=id,title,status,value,customer_id,customer:customers(name)&order=created_at.desc');
  const activitiesRes = await supabaseFetch('/rest/v1/activities?select=customer_id,note,created_at&order=created_at.desc');
  const customers = customersRes.ok ? await customersRes.json() : [];
  const dealsRaw = dealsRes.ok ? await dealsRes.json() : [];
  const activities = activitiesRes.ok ? await activitiesRes.json() : [];
  const latestByCustomer = new Map<number, string>();

  for (const activity of activities) {
    if (!latestByCustomer.has(activity.customer_id)) {
      latestByCustomer.set(activity.customer_id, activity.note);
    }
  }

  const deals = dealsRaw.map((deal: any) => ({
    ...deal,
    last_activity: latestByCustomer.get(deal.customer_id) || 'No activity yet'
  }));
=======
  const dealsRes = await supabaseFetch('/rest/v1/deals?select=id,title,status,value,customer:customers(name)&order=created_at.desc');
  const customers = customersRes.ok ? await customersRes.json() : [];
  const deals = dealsRes.ok ? await dealsRes.json() : [];
>>>>>>> main

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Sales Pipeline</h2>
      <form action="/api/deals" method="post" className="card grid gap-3 md:grid-cols-5">
        <input className="rounded border px-3 py-2" name="title" required placeholder="Deal title" />
        <select name="customer_id" required className="rounded border px-3 py-2">
          <option value="">Choose customer</option>
          {customers.map((customer: any) => <option value={customer.id} key={customer.id}>{customer.name}</option>)}
        </select>
        <input className="rounded border px-3 py-2" name="value" type="number" min="0" step="0.01" required placeholder="Value" />
        <select name="status" className="rounded border px-3 py-2">
          <option value="lead">Lead</option><option value="prospect">Prospect</option><option value="deal">Deal</option><option value="lost">Lost</option>
        </select>
        <button className="rounded bg-slate-900 px-3 py-2 text-white">Add Deal</button>
      </form>
      <KanbanBoard deals={deals as any} />
    </section>
  );
}
