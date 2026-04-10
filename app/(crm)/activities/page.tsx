import { requireSession } from '@/lib/auth';

export default async function ActivitiesPage() {
  const { supabaseFetch, user } = await requireSession();
  const customersRes = await supabaseFetch('/rest/v1/customers?select=id,name&order=name.asc');
  const activitiesRes = await supabaseFetch('/rest/v1/activities?select=*&order=due_date.asc');
  const customers = customersRes.ok ? await customersRes.json() : [];
  const activities = activitiesRes.ok ? await activitiesRes.json() : [];

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Activity Management</h2>
      <form action="/api/activities" method="post" className="card grid gap-3 md:grid-cols-5">
        <select name="customer_id" required className="rounded border px-3 py-2">
          <option value="">Customer</option>
          {customers.map((customer: any) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
        </select>
        <select name="type" className="rounded border px-3 py-2">
          <option value="call">Call</option><option value="follow_up">Follow up</option><option value="meeting">Meeting</option>
        </select>
        <input name="note" className="rounded border px-3 py-2" placeholder="Task note" required />
        <input name="due_date" type="date" className="rounded border px-3 py-2" />
        <button className="rounded bg-slate-900 px-3 py-2 text-white">Create Task</button>
      </form>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th>Type</th><th>Customer ID</th><th>Assignee</th><th>Due</th></tr></thead>
          <tbody>
            {activities.map((activity: any) => (
              <tr key={activity.id} className="border-t"><td>{activity.type}</td><td>{activity.customer_id}</td><td>{activity.assigned_to}</td><td>{activity.due_date || '-'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
