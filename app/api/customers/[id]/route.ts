import { supabaseFetch } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const res = await supabaseFetch(`/rest/v1/customers?id=eq.${id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json(data[0] || null, { status: res.ok ? 200 : 400 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await supabaseFetch(`/rest/v1/customers?id=eq.${id}`, { method: 'DELETE' });
  if (!res.ok) return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  return NextResponse.json({ success: true });
}
