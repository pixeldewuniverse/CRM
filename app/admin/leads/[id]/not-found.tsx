import Link from 'next/link';

export default function LeadNotFound() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <p className="text-sm text-slate-600">Lead not found.</p>
      <Link href="/admin/leads" className="mt-2 inline-block text-sm font-medium text-slate-900 hover:underline">
        Back to leads
      </Link>
    </div>
  );
}
