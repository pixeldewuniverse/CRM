import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req, { params }) {
  const body = await req.json();

  const updated = await prisma.lead.update({
    where: { id: Number(params.id) },
    data: {
      ...(body.status ? { status: body.status } : {}),
      ...(body.segment ? { segment: body.segment } : {}),
    },
  });

  return NextResponse.json({ ok: true, lead: updated });
}
