import { NextResponse } from 'next/server';
import { supabaseFetch } from '@/lib/supabase/server';

function formatWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  return digits;
}

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
  const normalizedPhone = formatWhatsAppNumber(phone);
  if (!normalizedPhone) {
    return NextResponse.json({ error: 'Invalid WhatsApp number.' }, { status: 400 });
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
        phone: normalizedPhone,
        tag: 'landing-lead',
        notes: 'Lead captured from Kado Bajo landing page.'
      })
    },
    ''
  );

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to save lead into CRM.' }, { status: 500 });
  }

  const targetNumber = formatWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890');
  if (!targetNumber) {
    return NextResponse.json({ error: 'WhatsApp number is not configured.' }, { status: 500 });
  }

  const whatsappUrl =
    `https://wa.me/${targetNumber}?text=` +
    encodeURIComponent('Hi Kado Bajo, I want to see your catalog');

  return NextResponse.json({ success: true, whatsappUrl });
}
