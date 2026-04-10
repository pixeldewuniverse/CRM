import { supabaseFetch } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();

  await supabaseFetch('/rest/v1/messages', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      customer_id: Number(formData.get('customer_id')),
      type: String(formData.get('type')),
      content: String(formData.get('content')),
      sent_at: new Date().toISOString()
    })
  });

  return NextResponse.redirect(new URL('/messages', request.url));
}
