import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeSegment } from '@/lib/segment';

export async function POST(req) {
  const body = await req.json();

  if (!body.name || !body.phone || !body.interest) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

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
}

export async function PATCH(req) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const updated = await prisma.lead.update({
    where: { id: Number(body.id) },
    data: {
      ...(body.status ? { status: body.status } : {}),
      ...(body.segment ? { segment: body.segment } : {}),
    },
  });

  return NextResponse.json({ ok: true, lead: updated });
}
