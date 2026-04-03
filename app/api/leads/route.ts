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
    return NextResponse.json(
      { error: 'Supabase config missing' },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as LeadPayload;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'All fields required' },
        { status: 400 }
      );
    }

    // 🔍 CHECK EXISTING
    const checkRes = await fetch(
      `${supabaseUrl}/rest/v1/customers?phone=eq.${encodeURIComponent(phone)}&select=id`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    const checkText = await checkRes.text();

    if (!checkRes.ok) {
      console.error("CHECK ERROR:", checkText);
      return NextResponse.json(
        { error: 'Check failed', detail: checkText },
        { status: 500 }
      );
    }

    const existing = checkText ? JSON.parse(checkText) : [];

    const payload = {
      name,
      email,
      phone,
      tag: 'lead',
      source: 'landing_page'
    };

    // 🔁 UPDATE
    if (existing.length > 0) {
      const updateRes = await fetch(
        `${supabaseUrl}/rest/v1/customers?id=eq.${existing[0].id}`,
        {
          method: 'PATCH',
          headers: {
            ...getHeaders(),
            Prefer: 'return=minimal'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!updateRes.ok) {
        const err = await updateRes.text();
        console.error("UPDATE ERROR:", err);
        return NextResponse.json(
          { error: 'Update failed' },
          { status: 500 }
        );
      }
    } 
    // ➕ INSERT
    else {
      const insertRes = await fetch(
        `${supabaseUrl}/rest/v1/customers`,
        {
          method: 'POST',
          headers: {
            ...getHeaders(),
            Prefer: 'return=minimal'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!insertRes.ok) {
        const err = await insertRes.text();
        console.error("INSERT ERROR:", err);
        return NextResponse.json(
          { error: 'Insert failed' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lead saved'
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}