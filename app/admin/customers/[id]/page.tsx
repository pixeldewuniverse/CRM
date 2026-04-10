import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { CustomerDetailForm } from '@/components/admin/CustomerDetailForm';
import { getCustomerById } from '@/lib/customers';
import { updateCustomerAction } from './actions';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section>
        <Link href="/admin/customers" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back to customers
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Customer Detail</h1>
      </section>

      <Card>
        <CustomerDetailForm customer={customer} onSave={updateCustomerAction} />
      </Card>
    </div>
  );
}
