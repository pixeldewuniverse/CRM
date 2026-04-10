import { NextResponse } from 'next/server';

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getHeaders() {
  return {
    apikey: serviceRoleKey || '',
    Authorization: `Bearer ${serviceRoleKey || ''}`,
    'Content-Type': 'application/json'
  };
}

export async function POST(req: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Supabase config missing' }, { status: 500 });
  }

  try {
    const body = (await req.json()) as LeadPayload;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    const payload = {
      name,
      email,
      phone,
      tag: 'lead',
      source: 'landing_page',
      status: 'new',
      value: 0
    };

    const existingRes = await fetch(
      `${supabaseUrl}/rest/v1/leads?phone=eq.${encodeURIComponent(phone)}&select=id&limit=1`,
      { method: 'GET', headers: getHeaders() }
    );

    if (!existingRes.ok) {
      return NextResponse.json({ error: 'Check failed' }, { status: 500 });
    }

    const existing = (await existingRes.json()) as Array<{ id: string }>;

    const url =
      existing.length > 0
        ? `${supabaseUrl}/rest/v1/leads?id=eq.${existing[0].id}`
        : `${supabaseUrl}/rest/v1/leads`;

    const method = existing.length > 0 ? 'PATCH' : 'POST';

    const upsertRes = await fetch(url, {
      method,
      headers: {
        ...getHeaders(),
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (!upsertRes.ok) {
      return NextResponse.json({ error: `${method} failed` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Lead saved' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
