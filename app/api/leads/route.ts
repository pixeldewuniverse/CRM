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

async function readBodySafely(response: Response) {
  const text = await response.text();
  try {
    return { text, json: text ? JSON.parse(text) : null };
  } catch {
    return { text, json: null };
  }
}

async function requestSupabase(path: string, init: RequestInit) {
  const url = `${supabaseUrl}${path}`;
  const response = await fetch(url, { ...init, headers: { ...getSupabaseHeaders(), ...(init.headers || {}) } });
  const parsed = await readBodySafely(response);

  console.log('[Supabase REST]', {
    method: init.method || 'GET',
    url,
    status: response.status,
    body: parsed.text
  });

  return { response, ...parsed, url };
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

  try {
    // Validate that `phone` column exists to avoid opaque query failures.
    const columnCheck = await requestSupabase(
      `/rest/v1/information_schema.columns?table_schema=eq.public&table_name=eq.customers&column_name=eq.phone&select=column_name`,
      { method: 'GET', cache: 'no-store' }
    );
    if (!columnCheck.response.ok) {
      return NextResponse.json(
        {
          error: 'Failed to inspect customers schema.',
          status: columnCheck.response.status,
          details: columnCheck.json || columnCheck.text
        },
        { status: 500 }
      );
    }
    const phoneColumns = Array.isArray(columnCheck.json) ? columnCheck.json : [];
    if (phoneColumns.length === 0) {
      return NextResponse.json(
        {
          error: 'Column `phone` was not found in `customers` table.',
          suggestion: 'Use the actual phone column name or add `phone` to public.customers.'
        },
        { status: 500 }
      );
    }

    const existingResponse = await requestSupabase(
      `/rest/v1/customers?select=id&phone=eq.${encodeURIComponent(phone)}&limit=1`,
      { method: 'GET', cache: 'no-store' }
    );
    if (!existingResponse.response.ok) {
      return NextResponse.json(
        {
          error: 'Failed to validate existing lead.',
          status: existingResponse.response.status,
          details: existingResponse.json || existingResponse.text,
          request_url: existingResponse.url
        },
        { status: 500 }
      );
    }

    const existingRows = Array.isArray(existingResponse.json) ? (existingResponse.json as { id: string }[]) : [];
    const payload = {
      name,
      email,
      phone,
      tag: 'lead',
      source: 'landing_page'
    };

    if (existingRows.length > 0) {
      const updateResponse = await requestSupabase(
        `/rest/v1/customers?id=eq.${existingRows[0].id}`,
        {
          method: 'PATCH',
          headers: {
            Prefer: 'return=representation'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!updateResponse.response.ok) {
        return NextResponse.json(
          {
            error: 'Failed to update existing lead.',
            status: updateResponse.response.status,
            details: updateResponse.json || updateResponse.text,
            request_url: updateResponse.url
          },
          { status: 500 }
        );
      }
    } else {
      const insertResponse = await requestSupabase('/rest/v1/customers', {
        method: 'POST',
        headers: {
          Prefer: 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (!insertResponse.response.ok) {
        return NextResponse.json(
          {
            error: 'Failed to save lead.',
            status: insertResponse.response.status,
            details: insertResponse.json || insertResponse.text,
            request_url: insertResponse.url
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Lead saved' });
  } catch (error) {
    console.error('Unexpected lead API error', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
