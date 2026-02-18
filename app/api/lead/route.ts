import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeSegment } from '@/lib/segment';

function pickAttribution(body) {
  const source = body?.attribution || body || {};
  return {
    utm_source: source.utm_source || null,
    utm_medium: source.utm_medium || null,
    utm_campaign: source.utm_campaign || null,
    utm_content: source.utm_content || null,
    utm_term: source.utm_term || null,
    fbclid: source.fbclid || null,
    gclid: source.gclid || null,
  };
}

export async function POST(req) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not configured' }, { status: 503 });
  }

  const body = await req.json();
  const name = body?.name?.trim();
  const phone = body?.phone?.trim();
  const interest = body?.interest?.trim();

  if (!name || !phone || !interest) {
    return NextResponse.json({ error: 'Missing required fields: name, phone, interest' }, { status: 400 });
  }

  const attribution = pickAttribution(body);

  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        interest,
        notes: body.notes?.trim() || null,
        status: 'new',
        segment: computeSegment(interest, body.notes),
        ...attribution,
        landing_page_url: body.landing_page_url || null,
        first_page_view_at: body.first_page_view_at ? new Date(body.first_page_view_at) : null,
        form_submit_at: new Date(),
      },
    });

    await prisma.event.create({
      data: {
        type: 'form_submit',
        path: '/api/lead',
        metadata: { leadId: lead.id, segment: lead.segment, utm_campaign: lead.utm_campaign },
      },
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not configured' }, { status: 503 });
  }

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  try {
    const updated = await prisma.lead.update({
      where: { id: Number(body.id) },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.segment ? { segment: body.segment } : {}),
      },
    });

    return NextResponse.json({ ok: true, lead: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
