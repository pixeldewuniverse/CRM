'use server';

import { revalidatePath } from 'next/cache';
import { LEAD_STATUSES, LeadStatus, removeLead, updateLeadStatus } from '@/lib/leads';

export async function updateLeadAction(formData: FormData) {
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
