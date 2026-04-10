'use server';

import { revalidatePath } from 'next/cache';
import { updateCustomer } from '@/lib/customers';
import type { CustomerStatus } from '@/lib/customers-types';
import { CUSTOMER_STATUSES } from '@/lib/customers-types';

export async function updateCustomerAction(formData: FormData) {
  const id = String(formData.get('id') || '');
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');
  const phone = String(formData.get('phone') || '');
  const status = String(formData.get('status') || '') as CustomerStatus;
  const notes = String(formData.get('notes') || '');

  if (!id || !name || !CUSTOMER_STATUSES.includes(status)) {
    throw new Error('Invalid customer payload');
  }

  await updateCustomer(id, { name, email, phone, status, notes });

  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${id}`);
}
