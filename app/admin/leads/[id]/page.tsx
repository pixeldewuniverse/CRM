import { notFound } from 'next/navigation';
import { getLeadById } from '@/lib/leads';
import { LeadDetailClient } from '@/components/admin/LeadDetailClient';

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  return <LeadDetailClient lead={lead} />;
}
