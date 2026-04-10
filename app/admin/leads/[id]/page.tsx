import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LeadDetailForm } from '@/components/admin/LeadDetailForm';
import { Card } from '@/components/ui/Card';
import { getLeadById } from '@/lib/leads';
import { saveLeadDetailAction } from './actions';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section>
        <Link href="/admin/leads" className="text-sm text-slate-500 hover:text-slate-900">← Back to leads</Link>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Lead Detail</h2>
        <p className="mt-1 text-sm text-slate-500">Last updated: {new Date(lead.updated_at).toLocaleString()}</p>
      </section>

      <Card>
        <LeadDetailForm lead={lead} onSave={saveLeadDetailAction} />
      </Card>
    </div>
  );
}
