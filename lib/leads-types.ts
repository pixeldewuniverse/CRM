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
