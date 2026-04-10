'use server';

import { revalidatePath } from 'next/cache';
import { removeLead, updateLeadStatus } from '@/lib/customers';
import type { LeadStatus } from '@/lib/customers-types';
import { LEAD_STATUSES } from '@/lib/customers-types';

export async function updateLeadStatusAction(formData: FormData) {
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || '') as LeadStatus;

  if (!id || !LEAD_STATUSES.includes(status)) {
    return;
  }

  await updateLeadStatus(id, status);
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/leads');
}

export async function deleteLeadAction(formData: FormData) {
  const id = String(formData.get('id') || '');
  if (!id) {
    return;
  }

  await removeLead(id);
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/leads');
}
