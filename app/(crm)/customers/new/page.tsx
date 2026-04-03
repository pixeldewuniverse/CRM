export default function NewCustomerPage() {
  return (
    <section className="max-w-2xl">
      <h2 className="mb-4 text-2xl font-bold">New Customer</h2>
      <form action="/api/customers" method="post" className="card grid gap-3">
        <input name="name" required placeholder="Name" className="rounded border px-3 py-2" />
        <input name="phone" required placeholder="Phone" className="rounded border px-3 py-2" />
        <input name="email" placeholder="Email" className="rounded border px-3 py-2" />
        <select name="tag" className="rounded border px-3 py-2">
          <option value="">No tag</option>
          <option value="VIP">VIP</option>
          <option value="repeat customer">Repeat Customer</option>
        </select>
        <textarea name="notes" placeholder="Notes" className="rounded border px-3 py-2" />
        <button className="rounded bg-slate-900 py-2 text-white">Create</button>
      </form>
    </section>
  );
}
