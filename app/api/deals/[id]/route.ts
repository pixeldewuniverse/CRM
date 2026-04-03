import { supabaseFetch } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const res = await supabaseFetch(`/rest/v1/deals?id=eq.${id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ status: body.status })
  });
  const data = await res.json();

  return NextResponse.json(data[0] || null, { status: res.ok ? 200 : 400 });
}
