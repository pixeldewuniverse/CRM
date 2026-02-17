import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ leads: [] });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const segment = searchParams.get('segment') || undefined;
  const utm_campaign = searchParams.get('utm_campaign') || undefined;

  try {
    const leads = await prisma.lead.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(segment ? { segment } : {}),
        ...(utm_campaign ? { utm_campaign: { contains: utm_campaign, mode: 'insensitive' } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ leads: [] });
  }
}
