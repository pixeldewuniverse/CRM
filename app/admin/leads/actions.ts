'use server';

import { revalidatePath } from 'next/cache';
import { deleteLead, LEAD_STATUSES, LeadStatus, updateLead } from '@/lib/leads';

export async function updateLeadStatusAction(formData: FormData) {
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || '') as LeadStatus;

  if (!id || !LEAD_STATUSES.includes(status)) {
    return;
  }

  await updateLead(id, { status });
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/leads');
}

export async function deleteLeadAction(formData: FormData) {
  const id = String(formData.get('id') || '');
  if (!id) {
    return;
  }

  await deleteLead(id);
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/leads');
}
