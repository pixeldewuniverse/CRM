import { NextResponse } from 'next/server';
import { getPrisma, hasDbUrl } from '@/lib/prisma';

export async function PATCH(req, { params }) {
  if (!hasDbUrl()) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL is not configured' }, { status: 500 });
  }

  const body = await req.json();

  try {
    const prisma = getPrisma();
    const updated = await prisma.lead.update({
      where: { id: Number(params.id) },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.segment ? { segment: body.segment } : {}),
      },
    });

    return NextResponse.json({ ok: true, lead: updated });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to update lead' }, { status: 500 });
  }
}
