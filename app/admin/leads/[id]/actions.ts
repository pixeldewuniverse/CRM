'use server';

import { revalidatePath } from 'next/cache';
import { LEAD_STATUSES, LeadStatus, updateLead, updateLeadStatus } from '@/lib/leads';

export async function updateLeadAction(formData: FormData) {
  const id = String(formData.get('id') || '');
  const name = String(formData.get('name') || '');
  const phone = String(formData.get('phone') || '');
  const email = String(formData.get('email') || '');
  const status = String(formData.get('status') || '') as LeadStatus;
  const value = Number(formData.get('value') || 0);

  if (!id || !name || !phone || !email || !LEAD_STATUSES.includes(status)) {
    throw new Error('Invalid lead form payload');
  }

  await updateLead(id, { name, phone, email, status, value });

  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${id}`);
}

export async function updateLeadStatusOnlyAction(formData: FormData) {
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || '') as LeadStatus;

  if (!id || !LEAD_STATUSES.includes(status)) {
    throw new Error('Invalid lead status payload');
  }

  await updateLeadStatus(id, status);

  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${id}`);
}
