import { NextResponse } from 'next/server';
import { getPrisma, hasDbUrl } from '@/lib/prisma';

export async function GET(req) {
  if (!hasDbUrl()) {
    return NextResponse.json({ leads: [] });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const segment = searchParams.get('segment') || undefined;
  const utm_campaign = searchParams.get('utm_campaign') || undefined;

  try {
    const prisma = getPrisma();
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
