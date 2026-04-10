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

export type LeadUpdateInput = {
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  value: number;
};

function assertLeadStatus(status: string): asserts status is LeadStatus {
  if (!LEAD_STATUSES.includes(status as LeadStatus)) {
    throw new Error(`Invalid lead status: ${status}`);
  }
}

function assertLeadUpdateInput(data: Partial<LeadUpdateInput>) {
  if (data.status) {
    assertLeadStatus(data.status);
  }

  if (data.value !== undefined && Number.isNaN(Number(data.value))) {
    throw new Error('Lead value must be a valid number');
  }
}

export async function getAllLeads(options?: { search?: string; status?: string }) {
  const query: Record<string, string> = {
    select: 'id,name,phone,status,value,created_at',
    order: 'created_at.desc'
  };

  if (options?.search?.trim()) {
    query.name = `ilike.*${options.search.trim()}*`;
  }

  if (options?.status?.trim()) {
    assertLeadStatus(options.status.trim());
    query.status = `eq.${options.status.trim()}`;
  }

  return supabaseAdminRequest<Lead[]>('/rest/v1/leads', {}, query);
}

export async function getDashboardStats() {
  const leads = await supabaseAdminRequest<Array<Pick<Lead, 'status' | 'value'>>>('/rest/v1/leads', {}, {
    select: 'status,value'
  });

  const revenue = leads.reduce((sum, lead) => sum + Number(lead.value || 0), 0);

  return {
    totalLeads: leads.length,
    deals: leads.filter((lead) => lead.status === 'deal').length,
    lost: leads.filter((lead) => lead.status === 'lost').length,
    revenue,
    pipeline: LEAD_STATUSES.map((status) => ({
      status,
      count: leads.filter((lead) => lead.status === status).length
    }))
  };
}

export async function getRecentLeads(limit = 5) {
  return supabaseAdminRequest<Array<Pick<Lead, 'id' | 'name' | 'status'>>>('/rest/v1/leads', {}, {
    select: 'id,name,status',
    order: 'created_at.desc',
    limit
  });
}

export async function updateLead(id: string, data: Partial<LeadUpdateInput>) {
  if (!id) {
    throw new Error('Lead id is required');
  }

  assertLeadUpdateInput(data);

  const payload: Partial<LeadUpdateInput> = {};

  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.phone !== undefined) payload.phone = data.phone.trim();
  if (data.email !== undefined) payload.email = data.email.trim();
  if (data.status !== undefined) payload.status = data.status;
  if (data.value !== undefined) payload.value = Number(data.value);

  if (Object.keys(payload).length === 0) {
    throw new Error('No fields provided for update');
  }

  const updatedRows = await supabaseAdminRequest<Lead[]>(
    '/rest/v1/leads',
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(payload)
    },
    { id: `eq.${id}` }
  );

  return updatedRows[0] ?? null;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  assertLeadStatus(status);
  return updateLead(id, { status });
}

export async function removeLead(id: string) {
  if (!id) {
    throw new Error('Lead id is required');
  }

  await supabaseAdminRequest<void>(
    '/rest/v1/leads',
    {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' }
    },
    { id: `eq.${id}` }
  );
}
