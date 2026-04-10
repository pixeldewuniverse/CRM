import 'server-only';

export type LeadRecord = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  tag: string | null;
  source: string | null;
  notes: string | null;
  created_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getHeaders() {
  return {
    apikey: serviceRoleKey || '',
    Authorization: `Bearer ${serviceRoleKey || ''}`,
    'Content-Type': 'application/json'
  };
}

export async function getLeadById(id: string): Promise<LeadRecord | null> {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase server configuration.');
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/customers?id=eq.${encodeURIComponent(id)}&select=id,name,email,phone,tag,source,notes,created_at&limit=1`,
    { method: 'GET', headers: getHeaders(), cache: 'no-store' }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Failed to fetch lead: ${response.status} ${details}`);
  }

  const rows = (await response.json()) as LeadRecord[];
  return rows[0] || null;
}
