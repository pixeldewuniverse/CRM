import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabaseFetch } = await requireSession();
  const { id } = await params;

  const customerRes = await supabaseFetch(`/rest/v1/customers?id=eq.${id}&select=*`);
  const customerRows = customerRes.ok ? await customerRes.json() : [];
  const customer = customerRows[0];
  if (!customer) notFound();

  const activitiesRes = await supabaseFetch(`/rest/v1/activities?customer_id=eq.${id}&select=*&order=created_at.desc`);
  const activities = activitiesRes.ok ? await activitiesRes.json() : [];

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="text-2xl font-bold">{customer.name}</h2>
        <p>{customer.phone} · {customer.email || 'No email'}</p>
        <p className="mt-2 text-sm text-slate-600">{customer.notes || 'No notes yet.'}</p>
      </div>

      <div className="card">
        <h3 className="mb-3 text-lg font-semibold">Activity History</h3>
        <ul className="space-y-3 text-sm">
          {activities.map((activity: any) => (
            <li key={activity.id} className="border-b pb-2">
              <p className="font-medium capitalize">{activity.type.replace('_', ' ')}</p>
              <p>{activity.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
