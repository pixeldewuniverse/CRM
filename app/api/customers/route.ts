import { supabaseFetch } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  await supabaseFetch('/rest/v1/customers', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      name: String(formData.get('name')),
      phone: String(formData.get('phone')),
      email: String(formData.get('email') || ''),
      tag: String(formData.get('tag') || ''),
      notes: String(formData.get('notes') || '')
    })
  });

  return NextResponse.redirect(new URL('/customers', request.url));
}
