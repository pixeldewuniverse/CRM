import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req, { params }) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not configured' }, { status: 503 });
  }

  const body = await req.json();

  try {
    const updated = await prisma.lead.update({
      where: { id: Number(params.id) },
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
