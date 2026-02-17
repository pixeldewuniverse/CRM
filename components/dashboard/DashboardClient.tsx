'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import LeadTable from '@/components/LeadTable';

function makeQuery(filters) {
  const qs = new URLSearchParams();
  if (filters.status) qs.set('status', filters.status);
  if (filters.segment) qs.set('segment', filters.segment);
  if (filters.utm_campaign) qs.set('utm_campaign', filters.utm_campaign);
  return qs;
}

export default function DashboardClient() {
  const [filters, setFilters] = useState({ status: '', segment: '', utm_campaign: '' });
  const [leads, setLeads] = useState([]);

  const query = useMemo(() => makeQuery(filters), [filters]);

  async function fetchLeads() {
    const response = await fetch(`/api/leads?${query.toString()}`, { cache: 'no-store' });
    const data = await response.json();
    setLeads(data.leads || []);
  }

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto w-[min(1200px,94%)] py-8">
      <section className="card">
        <h1 className="mb-4 text-2xl font-bold">CRM Dashboard</h1>
        <div className="mb-4 flex flex-wrap gap-3">
          <select className="input w-44" value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
            <option value="">All status</option>
            {['new', 'contacted', 'qualified', 'won', 'lost'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input w-44" value={filters.segment} onChange={(e) => setFilters((p) => ({ ...p, segment: e.target.value }))}>
            <option value="">All segment</option>
            {['hot', 'warm'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input className="input w-52" placeholder="utm_campaign" value={filters.utm_campaign} onChange={(e) => setFilters((p) => ({ ...p, utm_campaign: e.target.value }))} />
          <button className="btn" type="button" onClick={fetchLeads}>Apply filters</button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Link className="btn" href="/api/export?segment=hot">Export HOT CSV</Link>
          <Link className="btn" href="/api/export?segment=warm">Export WARM CSV</Link>
          <Link className="btn-secondary" href={`/api/export?${query.toString()}`}>Export filtered CSV</Link>
        </div>

        <LeadTable leads={leads} />
      </section>
    </main>
  );
}
