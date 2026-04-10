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
