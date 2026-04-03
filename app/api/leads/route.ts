import { NextResponse } from 'next/server';

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseHeaders() {
  return {
    apikey: serviceRoleKey || '',
    Authorization: `Bearer ${serviceRoleKey || ''}`,
    'Content-Type': 'application/json'
  };
}

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Supabase server config is missing.' }, { status: 500 });
  }

  const body = (await request.json()) as LeadPayload;
  const name = String(body?.name || '').trim();
  const email = String(body?.email || '').trim();
  const phone = String(body?.phone || '').trim();

  if (!name || !email || !phone) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

function getSupabaseHeaders() {
  return {
    apikey: serviceRoleKey || '',
    Authorization: `Bearer ${serviceRoleKey || ''}`,
    'Content-Type': 'application/json'
  };
}

async function readBodySafely(response: Response) {
  const text = await response.text();
  try {
    const existingResponse = await fetch(
      `${supabaseUrl}/rest/v1/customers?phone=eq.${encodeURIComponent(phone)}&select=id&limit=1`,
      {
        method: 'GET',
        headers: getSupabaseHeaders(),
        cache: 'no-store'
      }
    );

    if (!existingResponse.ok) {
      console.error('Failed checking existing lead', await existingResponse.text());
      return NextResponse.json({ error: 'Failed to validate existing lead.' }, { status: 500 });
    }

    const existingRows = (await existingResponse.json()) as { id: string }[];
    const payload = {
      name,
      email,
      phone,
      tag: 'lead',
      source: 'landing_page'
    };

    if (existingRows.length > 0) {
      const updateResponse = await fetch(
        `${supabaseUrl}/rest/v1/customers?id=eq.${existingRows[0].id}`,
        {
          method: 'PATCH',
          headers: {
            ...getSupabaseHeaders(),
            Prefer: 'return=minimal'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!updateResponse.ok) {
        console.error('Failed updating duplicate lead', await updateResponse.text());
        return NextResponse.json({ error: 'Failed to update existing lead.' }, { status: 500 });
      }
    } else {
      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/customers`, {
        method: 'POST',
        headers: {
          ...getSupabaseHeaders(),
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      if (!insertResponse.ok) {
        console.error('Failed inserting lead', await insertResponse.text());
        return NextResponse.json({ error: 'Failed to save lead.' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Lead saved' });
  } catch (error) {
    console.error('Unexpected lead API error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
