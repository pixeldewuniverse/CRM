import 'server-only';

import { supabaseFetch } from '@/lib/supabase/server';
import { Customer, CUSTOMER_STATUSES, CustomerStatus, UpdateCustomerInput } from '@/lib/customers-types';

function assertStatus(status: string): asserts status is CustomerStatus {
  if (!CUSTOMER_STATUSES.includes(status as CustomerStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Supabase request failed');
  }
  return response.json() as Promise<T>;
}

export async function getAllCustomers(options?: { search?: string; status?: string }) {
  const params = new URLSearchParams({
    select: 'id,name,email,phone,status,source,created_at',
    order: 'created_at.desc'
  });

  const search = options?.search?.trim();
  if (search) {
    params.set('or', `(name.ilike.*${search}*,email.ilike.*${search}*)`);
  }

  const status = options?.status?.trim();
  if (status) {
    assertStatus(status);
    params.set('status', `eq.${status}`);
  }

  const response = await supabaseFetch(`/rest/v1/customers?${params.toString()}`);
  return parseResponse<Customer[]>(response);
}

export async function getCustomerById(id: string) {
  if (!id) {
    throw new Error('Customer id is required');
  }

  const response = await supabaseFetch(`/rest/v1/customers?id=eq.${id}&select=*&limit=1`);
  const data = await parseResponse<Customer[]>(response);
  return data[0] || null;
}

export async function updateCustomer(id: string, data: UpdateCustomerInput) {
  if (!id) {
    throw new Error('Customer id is required');
  }

  assertStatus(data.status);

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

  const rows = await parseResponse<Customer[]>(response);
  return rows[0] || null;
}

export { CUSTOMER_STATUSES };
export type { Customer, CustomerStatus, UpdateCustomerInput };
