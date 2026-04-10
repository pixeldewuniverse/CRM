'use client';

type Props = {
  lead: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    tag: string | null;
    source: string | null;
    notes: string | null;
    created_at: string;
  };
};

export function LeadDetailClient({ lead }: Props) {
  return (
    <section className="mx-auto max-w-2xl p-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{lead.name}</h1>
        <p className="mt-2 text-sm text-slate-600">Lead ID: {lead.id}</p>

        <dl className="mt-6 grid gap-3 text-sm">
          <div><dt className="font-semibold">Email</dt><dd>{lead.email || '-'}</dd></div>
          <div><dt className="font-semibold">Phone</dt><dd>{lead.phone || '-'}</dd></div>
          <div><dt className="font-semibold">Tag</dt><dd>{lead.tag || '-'}</dd></div>
          <div><dt className="font-semibold">Source</dt><dd>{lead.source || '-'}</dd></div>
          <div><dt className="font-semibold">Notes</dt><dd>{lead.notes || '-'}</dd></div>
          <div><dt className="font-semibold">Created</dt><dd>{new Date(lead.created_at).toLocaleString()}</dd></div>
        </dl>
      </div>
    </section>
  );
}
