import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true });
  }

  const body = await req.json();
  try {
    await prisma.event.create({
      data: {
        type: 'page_view',
        path: body.path || '/',
        metadata: body,
      },
    });
  } catch {
    // ignore logging errors to avoid blocking UX
  }

  return NextResponse.json({ ok: true });
}
