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
  const customers = await getAllCustomers();

  const totalLeads = customers.length;

  const deals = customers.filter(
    (c) => c.status === 'deal'
  ).length;

  const lost = customers.filter(
    (c) => c.status === 'lost'
  ).length;

  const revenue = deals * 50; // dummy

  const pipeline = [
    {
      status: 'new' as CustomerStatus,
      count: customers.filter((c) => c.status === 'new').length
    },
    {
      status: 'contacted' as CustomerStatus,
      count: customers.filter((c) => c.status === 'contacted').length
    },
    {
      status: 'negotiation' as CustomerStatus,
      count: customers.filter((c) => c.status === 'negotiation').length
    },
    {
      status: 'deal' as CustomerStatus,
      count: deals
    },
    {
      status: 'lost' as CustomerStatus,
      count: lost
    }
  ];

  return {
    totalLeads,
    deals,
    lost,
    revenue,
    pipeline
  };
}
export { CUSTOMER_STATUSES };
export type { Customer, CustomerStatus, Lead, LeadUpdateInput, UpdateCustomerInput };
