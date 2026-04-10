import type { CustomerStatus } from '@/types/customer';

export const CUSTOMER_STATUSES = ['new', 'contacted', 'negotiation', 'deal', 'lost'] as const;

export type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  tag: string | null;
  source: string | null;
  status: CustomerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  value?: number | null;
};

export type UpdateCustomerInput = {
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  notes: string;
};

export type LeadStatus = CustomerStatus;
export const LEAD_STATUSES = CUSTOMER_STATUSES;

export type Lead = Customer;

export type LeadUpdateInput = {
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  value: number;
};

export type { CustomerStatus };
