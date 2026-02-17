import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const body = await req.json();
  await prisma.event.create({
    data: {
      type: 'page_view',
      path: body.path || '/',
      metadata: body,
    },
  });
  return NextResponse.json({ ok: true });
}
