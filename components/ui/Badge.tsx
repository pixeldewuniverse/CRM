import type { CustomerStatus } from '@/types/customer';

const styles: Record<CustomerStatus, string> = {
  new: 'bg-slate-100 text-slate-700 border-slate-200',
  contacted: 'bg-blue-100 text-blue-700 border-blue-200',
  negotiation: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  deal: 'bg-green-100 text-green-700 border-green-200',
  lost: 'bg-red-100 text-red-700 border-red-200'
};

export function StatusBadge({ status }: { status: CustomerStatus }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${styles[status]}`}>{status}</span>;
}
