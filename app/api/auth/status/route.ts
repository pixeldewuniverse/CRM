import { NextResponse } from 'next/server';
import { getDashboardPassword, getDashboardSecret } from '@/lib/dashboardAuth';

export async function GET() {
  const hasPassword = Boolean(getDashboardPassword());
  const hasSessionSecret = Boolean(getDashboardSecret());

  return NextResponse.json({
    ok: true,
    hasPassword,
    hasSessionSecret,
    env: {
      DASHBOARD_PASSWORD: hasPassword,
      DASHBOARD_SESSION_SECRET: hasSessionSecret,
    },
  });
}
