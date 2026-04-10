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
  updated_at: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertConfig() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
}

function supabaseHeaders(extra: HeadersInit = {}): HeadersInit {
  return {
    apikey: SERVICE_ROLE_KEY || '',
    Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`,
    'Content-Type': 'application/json',
    ...extra
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Supabase request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getLeadStats() {
  assertConfig();

  const [allRes, dealRes, lostRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/leads?select=id,value`, { cache: 'no-store', headers: supabaseHeaders() }),
    fetch(`${SUPABASE_URL}/rest/v1/leads?status=eq.deal&select=id`, { cache: 'no-store', headers: supabaseHeaders() }),
    fetch(`${SUPABASE_URL}/rest/v1/leads?status=eq.lost&select=id`, { cache: 'no-store', headers: supabaseHeaders() })
  ]);

  const allLeads = await handleResponse<Array<Pick<Lead, 'id' | 'value'>>>(allRes);
  const deals = await handleResponse<Array<Pick<Lead, 'id'>>>(dealRes);
  const lost = await handleResponse<Array<Pick<Lead, 'id'>>>(lostRes);

  return {
    totalLeads: allLeads.length,
    deals: deals.length,
    lost: lost.length,
    totalRevenue: allLeads.reduce((sum, lead) => sum + Number(lead.value || 0), 0)
  };
}

export async function getPipelineBreakdown() {
  assertConfig();

  const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=status`, {
    cache: 'no-store',
    headers: supabaseHeaders()
  });

  const rows = await handleResponse<Array<Pick<Lead, 'status'>>>(response);

  return LEAD_STATUSES.map((status) => ({
    status,
    count: rows.filter((row) => row.status === status).length
  }));
}

export async function getRecentLeads(limit = 5) {
  assertConfig();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/leads?select=*&order=created_at.desc&limit=${limit}`,
    { cache: 'no-store', headers: supabaseHeaders() }
  );

  return handleResponse<Lead[]>(response);
}

export async function getLeads(options?: { search?: string; status?: string }) {
  assertConfig();

  const params = new URLSearchParams({
    select: '*',
    order: 'created_at.desc'
  });

  if (options?.search) {
    params.set('name', `ilike.*${options.search}*`);
  }

  if (options?.status && LEAD_STATUSES.includes(options.status as LeadStatus)) {
    params.set('status', `eq.${options.status}`);
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?${params.toString()}`, {
    cache: 'no-store',
    headers: supabaseHeaders()
  });

  return handleResponse<Lead[]>(response);
}

export async function getLeadById(id: string) {
  assertConfig();

  const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}&select=*&limit=1`, {
    cache: 'no-store',
    headers: supabaseHeaders()
  });

  const data = await handleResponse<Lead[]>(response);
  return data[0] || null;
}

export async function updateLead(id: string, payload: Partial<Pick<Lead, 'name' | 'phone' | 'email' | 'status' | 'value'>>) {
  assertConfig();

  const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
    method: 'PATCH',
    cache: 'no-store',
    headers: supabaseHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify({
      ...payload,
      updated_at: new Date().toISOString()
    })
  });

  const data = await handleResponse<Lead[]>(response);
  return data[0] || null;
}

export async function deleteLead(id: string) {
  assertConfig();

  const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
    method: 'DELETE',
    cache: 'no-store',
    headers: supabaseHeaders({ Prefer: 'return=minimal' })
  });

  await handleResponse<void>(response);
}
