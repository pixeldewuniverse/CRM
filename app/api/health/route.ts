import { NextResponse } from 'next/server';
import { getPrisma, hasDbUrl } from '@/lib/prisma';

export async function GET() {
  const hasUrl = hasDbUrl();
  if (!hasUrl) {
    return NextResponse.json({
      ok: true,
      hasDbUrl: false,
      prismaCanConnect: false,
      error: 'DATABASE_URL is not configured',
    });
  }

  try {
    const prisma = getPrisma();
    await prisma.lead.count();
    return NextResponse.json({
      ok: true,
      hasDbUrl: true,
      prismaCanConnect: true,
    });
  } catch (error) {
    return NextResponse.json({
      ok: true,
      hasDbUrl: true,
      prismaCanConnect: false,
      error: error instanceof Error ? error.message : 'Unable to connect to database',
    });
  }
}
