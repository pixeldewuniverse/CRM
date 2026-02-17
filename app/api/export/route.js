import { prisma } from '@/lib/prisma';

function toCsv(leads) {
  const headers = [
    'id', 'createdAt', 'name', 'phone', 'interest', 'notes', 'status', 'segment',
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'fbclid', 'gclid', 'landing_page_url', 'first_page_view_at', 'form_submit_at',
  ];

  const lines = [headers.join(',')];
  for (const lead of leads) {
    const row = headers.map((header) => {
      const value = lead[header] == null ? '' : String(lead[header]);
      return `"${value.replace(/"/g, '""')}"`;
    });
    lines.push(row.join(','));
  }
  return lines.join('\n');
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const segment = searchParams.get('segment') || undefined;
  const utm_campaign = searchParams.get('utm_campaign') || undefined;

  const leads = await prisma.lead.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(segment ? { segment } : {}),
      ...(utm_campaign ? { utm_campaign: { contains: utm_campaign, mode: 'insensitive' } } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  const csv = toCsv(leads);
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
