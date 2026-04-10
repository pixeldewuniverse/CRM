import { supabaseAdminRequest } from '@/lib/supabase/admin-client';

export const LEAD_STATUSES = ['new', 'contacted', 'negotiation', 'deal', 'lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  tag: string | null;
  source: string | null;
  status: LeadStatus;
  value: number;
  created_at: string;
};

export async function getAllLeads(options?: { search?: string; status?: string }) {
  const query: Record<string, string> = {
    select: 'id,name,phone,status,value,created_at',
    order: 'created_at.desc'
  };

  if (options?.search) {
    query.name = `ilike.*${options.search}*`;
  }

  if (options?.status && LEAD_STATUSES.includes(options.status as LeadStatus)) {
    query.status = `eq.${options.status}`;
  }

  return supabaseAdminRequest<Lead[]>('/rest/v1/leads', {}, query);
}

export async function getDashboardStats() {
  const leads = await supabaseAdminRequest<Array<Pick<Lead, 'status' | 'value'>>>('/rest/v1/leads', {}, {
    select: 'status,value'
  });

  const revenue = leads.reduce((sum, lead) => sum + Number(lead.value || 0), 0);
  const deals = leads.filter((lead) => lead.status === 'deal').length;
  const lost = leads.filter((lead) => lead.status === 'lost').length;

  const pipeline = LEAD_STATUSES.map((status) => ({
    status,
    count: leads.filter((lead) => lead.status === status).length
  }));

  return {
    totalLeads: leads.length,
    deals,
    lost,
    revenue,
    pipeline
  };
}

export async function getRecentLeads(limit = 5) {
  return supabaseAdminRequest<Array<Pick<Lead, 'id' | 'name' | 'status'>>>('/rest/v1/leads', {}, {
    select: 'id,name,status',
    order: 'created_at.desc',
    limit
  });
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  return supabaseAdminRequest<Lead[]>(
    '/rest/v1/leads',
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ status })
    },
    { id: `eq.${id}` }
  );
}

export async function removeLead(id: string) {
  await supabaseAdminRequest<void>(
    '/rest/v1/leads',
    {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' }
    },
    { id: `eq.${id}` }
  );
}
