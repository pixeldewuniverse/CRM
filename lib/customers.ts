import 'server-only';

import { supabaseFetch } from '@/lib/supabase/server';
import { CUSTOMER_STATUSES, type Customer, type Lead, type LeadUpdateInput, type UpdateCustomerInput } from '@/lib/customers-types';
import type { CustomerStatus } from '@/types/customer';

type SupabaseCustomerRow = Omit<Customer, 'status'> & { status: string };

export function isValidStatus(status: string): status is CustomerStatus {
  return CUSTOMER_STATUSES.includes(status as CustomerStatus);
}

function assertCustomerStatus(status: string): asserts status is CustomerStatus {
  if (!isValidStatus(status)) {
    throw new Error(`Invalid customer status: ${status}`);
  }
}

function mapCustomer(row: SupabaseCustomerRow): Customer {
  const status = row.status ?? 'new';
  assertCustomerStatus(status);

  return {
    ...row,
    status
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Supabase request failed');
  }
  return response.json() as Promise<T>;
}

// Customers
export async function getAllCustomers(options?: { search?: string; status?: string }) {
  const params = new URLSearchParams({
    select: 'id,name,email,phone,status,source,notes,tag,created_at,updated_at,value',
    order: 'created_at.desc'
  });

  const search = options?.search?.trim();
  if (search) {
    params.set('or', `(name.ilike.*${search}*,email.ilike.*${search}*)`);
  }

  const status = options?.status?.trim();
  if (status) {
    assertCustomerStatus(status);
    params.set('status', `eq.${status}`);
  }

  const response = await supabaseFetch(`/rest/v1/customers?${params.toString()}`);
  const rows = await parseResponse<SupabaseCustomerRow[]>(response);
  return rows.map(mapCustomer);
}

export async function getCustomerById(id: string) {
  if (!id) {
    throw new Error('Customer id is required');
  }

  const response = await supabaseFetch(`/rest/v1/customers?id=eq.${id}&select=*&limit=1`);
  const rows = await parseResponse<SupabaseCustomerRow[]>(response);
  return rows[0] ? mapCustomer(rows[0]) : null;
}

export async function updateCustomer(id: string, data: UpdateCustomerInput) {
  if (!id) {
    throw new Error('Customer id is required');
  }

  assertCustomerStatus(data.status);

  const payload = {
    name: data.name.trim(),
    email: data.email.trim() || null,
    phone: data.phone.trim() || null,
    status: data.status,
    notes: data.notes.trim() || null,
    updated_at: new Date().toISOString()
  };

  const response = await supabaseFetch(`/rest/v1/customers?id=eq.${id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload)
  });

  const rows = await parseResponse<SupabaseCustomerRow[]>(response);
  return rows[0] ? mapCustomer(rows[0]) : null;
}

// Legacy compatibility aliases now backed by customers.
export async function getAllLeads(options?: { search?: string; status?: string }) {
  return getAllCustomers(options);
}

export async function getDashboardStats() {
  const response = await supabaseFetch('/rest/v1/customers?select=status,value');
  const rows = await parseResponse<Array<{ status: string; value?: number | null }>>(response);
  const customers = rows.map((row) => {
    const status = row.status as CustomerStatus;
    if (!isValidStatus(status)) return { status: 'new' as CustomerStatus, value: Number(row.value || 0) };
    return { status: row.status as CustomerStatus, value: Number(row.value || 0) };
  });

  const revenue = customers.reduce((sum, customer) => sum + Number(customer.value || 0), 0);

  return {
    totalLeads: customers.length,
    deals: customers.filter((customer) => customer.status === 'deal').length,
    lost: customers.filter((customer) => customer.status === 'lost').length,
    revenue,
    pipeline: CUSTOMER_STATUSES.map((status) => ({
      status,
      count: customers.filter((customer) => customer.status === status).length
    }))
  };
}

export async function getRecentLeads(limit = 5) {
  const response = await supabaseFetch(`/rest/v1/customers?select=id,name,status&order=created_at.desc&limit=${limit}`);
  const rows = await parseResponse<Array<{ id: string; name: string; status: string }>>(response);

  return rows
    .filter((row) => isValidStatus(row.status))
    .map((row) => ({ ...row, status: row.status as CustomerStatus }));
}

export async function updateLead(id: string, data: Partial<LeadUpdateInput>) {
  if (!id) {
    throw new Error('Lead id is required');
  }

  if (data.status) {
    assertCustomerStatus(data.status);
  }

  const payload: Partial<LeadUpdateInput> = {};
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.phone !== undefined) payload.phone = data.phone.trim();
  if (data.email !== undefined) payload.email = data.email.trim();
  if (data.status !== undefined) payload.status = data.status;
  if (data.value !== undefined) payload.value = Number(data.value);

  const response = await supabaseFetch(`/rest/v1/customers?id=eq.${id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload)
  });

  const rows = await parseResponse<SupabaseCustomerRow[]>(response);
  return rows[0] ? mapCustomer(rows[0]) : null;
}

export async function updateLeadStatus(id: string, status: CustomerStatus) {
  assertCustomerStatus(status);
  return updateLead(id, { status });
}

export async function removeLead(id: string) {
  if (!id) {
    throw new Error('Lead id is required');
  }

  const response = await supabaseFetch(`/rest/v1/customers?id=eq.${id}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Delete failed');
  }
}

export { CUSTOMER_STATUSES };
export type { Customer, CustomerStatus, Lead, LeadUpdateInput, UpdateCustomerInput };
