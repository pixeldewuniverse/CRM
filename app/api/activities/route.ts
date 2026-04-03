import { supabaseFetch } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();

  await supabaseFetch('/rest/v1/activities', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      customer_id: Number(formData.get('customer_id')),
      type: String(formData.get('type')),
      note: String(formData.get('note')),
      due_date: String(formData.get('due_date') || ''),
      assigned_to: String(formData.get('assigned_to'))
    })
  });

  return NextResponse.redirect(new URL('/activities', request.url));
}
