'use server';

import { revalidatePath } from 'next/cache';
import { LEAD_STATUSES, LeadStatus, updateLead } from '@/lib/leads';

export async function saveLeadDetailAction(formData: FormData) {
  const id = String(formData.get('id') || '');
  const name = String(formData.get('name') || '');
  const phone = String(formData.get('phone') || '');
  const email = String(formData.get('email') || '');
  const status = String(formData.get('status') || '') as LeadStatus;
  const value = Number(formData.get('value') || 0);

  if (!id || !name || !phone || !email || !LEAD_STATUSES.includes(status)) {
    return;
  }

  await updateLead(id, { name, phone, email, status, value });

  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${id}`);
}
