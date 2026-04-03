import { requireSession } from '@/lib/auth';
import { KanbanBoard } from '@/components/crm/KanbanBoard';

export default async function DealsPage() {
  const { supabaseFetch } = await requireSession();
  const customersRes = await supabaseFetch('/rest/v1/customers?select=id,name&order=name.asc');
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
}
