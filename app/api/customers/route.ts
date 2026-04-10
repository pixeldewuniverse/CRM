import { supabaseFetch } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';

  // Landing form JSON flow (formerly /api/leads).
  if (contentType.includes('application/json')) {
    const body = await request.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const phone = String(body?.phone || '').trim();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase server config is missing.' }, { status: 500 });
    }

    const headers = {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json'
    };

    const existing = await fetch(
      `${supabaseUrl}/rest/v1/customers?select=id&phone=eq.${encodeURIComponent(phone)}&limit=1`,
      { method: 'GET', headers, cache: 'no-store' }
    );
    if (!existing.ok) {
      const details = await existing.text();
      return NextResponse.json({ error: 'Failed checking existing customer.', details }, { status: 500 });
    }
    const rows = await existing.json();

    const payload = {
      name,
      email,
      phone,
      tag: 'lead',
      source: 'landing_page'
    };

    if (rows.length > 0) {
      const update = await fetch(`${supabaseUrl}/rest/v1/customers?id=eq.${rows[0].id}`, {
        method: 'PATCH',
        headers: { ...headers, Prefer: 'return=minimal' },
        body: JSON.stringify(payload)
      });
      if (!update.ok) {
        const details = await update.text();
        return NextResponse.json({ error: 'Failed to update customer.', details }, { status: 500 });
      }
    } else {
      const insert = await fetch(`${supabaseUrl}/rest/v1/customers`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=minimal' },
        body: JSON.stringify(payload)
      });
      if (!insert.ok) {
        const details = await insert.text();
        return NextResponse.json({ error: 'Failed to save customer.', details }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Customer saved' });
  }

  // CRM dashboard form-data flow.
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
