import { requireSession } from '@/lib/auth';

export default async function MessagesPage() {
  const { supabaseFetch } = await requireSession();
  const customersRes = await supabaseFetch('/rest/v1/customers?select=id,name&order=name.asc');
  const messagesRes = await supabaseFetch('/rest/v1/messages?select=*&order=sent_at.desc&limit=50');
  const customers = customersRes.ok ? await customersRes.json() : [];
  const messages = messagesRes.ok ? await messagesRes.json() : [];

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Communication Center</h2>
      <form action="/api/messages" method="post" className="card grid gap-3 md:grid-cols-5">
        <select name="customer_id" required className="rounded border px-3 py-2">
          <option value="">Customer</option>
          {customers.map((customer: any) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
        </select>
        <select name="type" className="rounded border px-3 py-2">
          <option value="wa">WhatsApp</option>
          <option value="email">Email</option>
        </select>
        <input name="content" required className="rounded border px-3 py-2 md:col-span-2" placeholder="Message content" />
        <button className="rounded bg-emerald-600 px-3 py-2 text-white">Send WhatsApp (Mock)</button>
      </form>
      <div className="card space-y-3">
        {messages.map((message: any) => (
          <div key={message.id} className="rounded border p-3 text-sm">
            <p className="font-semibold">Customer #{message.customer_id} · {message.type.toUpperCase()}</p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
