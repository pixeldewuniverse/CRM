import { NextResponse } from 'next/server';
import { supabaseFetch } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();

  if (!name || !phone) {
    return NextResponse.redirect(new URL('/?error=missing_fields', request.url));
  }

  const response = await supabaseFetch('/rest/v1/customers', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      name,
      phone,
      tag: 'landing-lead',
      notes: 'Lead captured from Kado Bajo landing page.'
    })
  }, '');

  if (!response.ok) {
    return NextResponse.redirect(new URL('/?error=save_failed', request.url));
  }

  return NextResponse.redirect(
    new URL(
      'https://wa.me/6281234567890?text=' +
        encodeURIComponent(`Halo Kado Bajo, saya ${name} (${phone}) ingin lihat katalog souvenir.`),
      request.url
    )
  );
}
