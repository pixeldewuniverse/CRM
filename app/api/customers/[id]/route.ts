import { NextResponse } from 'next/server';
import { CUSTOMER_STATUSES } from '@/lib/customers-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = body?.status;

    if (!status || !CUSTOMER_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/customers?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({ status }),
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to update customer status', details: data }, { status: 400 });
    }

    return NextResponse.json(data[0] || null, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unexpected error updating customer status', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/customers?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!res.ok) return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  return NextResponse.json({ success: true });
}
