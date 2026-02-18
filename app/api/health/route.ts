import { NextResponse } from 'next/server';
import { hasDbUrl } from '@/lib/prisma';

export async function GET() {
  return NextResponse.json({
    ok: true,
    hasDbUrl: hasDbUrl(),
    envKeys: {
      DATABASE_URL: Boolean(process.env.DATABASE_URL),
      PRISMA_DATABASE_URL: Boolean(process.env.PRISMA_DATABASE_URL),
      POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
    },
  });
}
