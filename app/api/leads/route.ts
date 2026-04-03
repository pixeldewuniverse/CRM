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
    return NextResponse.json(
      { error: 'Supabase server config is missing.' },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as LeadPayload;

    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const phone = String(body?.phone || '').trim();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const existingResponse = await fetch(
      `${supabaseUrl}/rest/v1/customers?phone=eq.${encodeURIComponent(phone)}&select=id`,
      {
        method: 'GET',
        headers: getSupabaseHeaders(),
        cache: 'no-store'
      }
    );

    const existingText = await existingResponse.text();

    if (!existingResponse.ok) {
      console.error('CHECK ERROR:', existingText);
      return NextResponse.json(
        { error: 'Failed to validate existing lead.', detail: existingText },
        { status: 500 }
      );
    }

    const existingRows = JSON.parse(existingText);

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
        const err = await updateResponse.text();
        console.error('UPDATE ERROR:', err);
        return NextResponse.json(
          { error: 'Failed to update lead.' },
          { status: 500 }
        );
      }
    } else {
      const insertResponse = await fetch(
        `${supabaseUrl}/rest/v1/customers`,
        {
          method: 'POST',
          headers: {
            ...getSupabaseHeaders(),
            Prefer: 'return=minimal'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!insertResponse.ok) {
        const err = await insertResponse.text();
        console.error('INSERT ERROR:', err);
        return NextResponse.json(
          { error: 'Failed to save lead.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lead saved'
    });
  } catch (error) {
    console.error('SERVER ERROR:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
