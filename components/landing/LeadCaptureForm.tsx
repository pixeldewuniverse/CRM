export function LeadCaptureForm() {
  return (
    <form action="/api/leads" method="post" className="mt-5 space-y-3">
      <input name="name" required placeholder="Your name" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
      <input name="phone" required placeholder="WhatsApp number" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
      <button className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700">
        Send & Get WhatsApp Offer
      </button>
    </form>
  );
}
