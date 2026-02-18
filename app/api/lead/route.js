import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeSegment } from '@/lib/segment';

export async function POST(req) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not configured' }, { status: 503 });
  }

  const body = await req.json();

  if (!body.name || !body.phone || !body.interest) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        phone: body.phone,
        interest: body.interest,
        notes: body.notes || null,
        status: 'new',
        segment: computeSegment(body.interest, body.notes),
        utm_source: body.attribution?.utm_source || null,
        utm_medium: body.attribution?.utm_medium || null,
        utm_campaign: body.attribution?.utm_campaign || null,
        utm_content: body.attribution?.utm_content || null,
        utm_term: body.attribution?.utm_term || null,
        fbclid: body.attribution?.fbclid || null,
        gclid: body.attribution?.gclid || null,
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

    return NextResponse.json({ ok: true, leadId: lead.id });
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
