import { supabaseFetch } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();

  await supabaseFetch('/rest/v1/deals', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      title: String(formData.get('title')),
      customer_id: Number(formData.get('customer_id')),
      status: String(formData.get('status') || 'lead'),
      value: Number(formData.get('value'))
    })
  });

  return NextResponse.redirect(new URL('/deals', request.url));
}
