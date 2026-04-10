export const CUSTOMER_STATUSES = ['new', 'contacted', 'closed'] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

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
};

export type UpdateCustomerInput = {
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  notes: string;
};

export const LEAD_STATUSES = ['new', 'contacted', 'negotiation', 'deal', 'lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  tag: string | null;
  source: string | null;
  status: LeadStatus;
  value: number;
  created_at: string;
};

export type LeadUpdateInput = {
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  value: number;
};
