import { NextResponse } from 'next/server';
import { supabaseFetch } from '@/lib/supabase/server';

export async function POST(request: Request) {
  let name = '';
  let email = '';
  let phone = '';

  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const body = await request.json();
    name = String(body?.name || '').trim();
    email = String(body?.email || '').trim();
    phone = String(body?.phone || '').trim();
  } else {
    const formData = await request.formData();
    name = String(formData.get('name') || '').trim();
    email = String(formData.get('email') || '').trim();
    phone = String(formData.get('phone') || '').trim();
  }

  if (!name || !email || !phone) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
  }

  const response = await supabaseFetch(
    '/rest/v1/customers',
    {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        name,
        email,
        phone,
        tag: 'landing-lead',
        notes: 'Lead captured from Kado Bajo landing page.'
      })
    },
    ''
  );

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to save lead into CRM.' }, { status: 500 });
  }

  const whatsappUrl =
    'https://wa.me/6281234567890?text=' +
    encodeURIComponent(`Hello Kado Bajo, I am ${name} (${phone}).`);

  return NextResponse.json({ success: true, whatsappUrl });
}
