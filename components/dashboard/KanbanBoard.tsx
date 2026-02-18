'use client';

import { useMemo, useState } from 'react';

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];
const SEGMENTS = ['all', 'hot', 'warm'];

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return '-';
  }
}

function segmentBadge(segment: string) {
  if (segment === 'hot') return 'bg-rose-100 text-rose-700 border-rose-200';
  return 'bg-amber-100 text-amber-700 border-amber-200';
}

function toQuery(filters: any = {}) {
  const query = new URLSearchParams();
  if (filters.segment && filters.segment !== 'all') query.set('segment', filters.segment);
  if (filters.status && filters.status !== 'all') query.set('status', filters.status);
  if (filters.search) query.set('search', filters.search);
  if (filters.utm_campaign) query.set('utm_campaign', filters.utm_campaign);
  return query.toString();
}

export default function KanbanBoard({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads || []);
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('');
  const [exportStatus, setExportStatus] = useState('new');
  const [error, setError] = useState('');

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (segmentFilter !== 'all' && lead.segment !== segmentFilter) return false;
      if (campaignFilter && !(lead.utm_campaign || '').toLowerCase().includes(campaignFilter.toLowerCase())) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = (lead.name || '').toLowerCase();
        const phone = (lead.phone || '').toLowerCase();
        if (!name.includes(q) && !phone.includes(q)) return false;
      }
      return true;
    });
  }, [leads, segmentFilter, search, campaignFilter]);

  const board = useMemo(() => {
    const grouped = Object.fromEntries(STATUSES.map((status) => [status, []]));
    for (const lead of filteredLeads) {
      grouped[lead.status]?.push(lead);
    }
    return grouped;
  }, [filteredLeads]);

  async function moveLead(leadId: number, nextStatus: string) {
    const previous = leads;
    setError('');
    setLeads((current) => current.map((lead) => (lead.id === leadId ? { ...lead, status: nextStatus } : lead)));

    const response = await fetch('/api/lead', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: leadId, status: nextStatus }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setLeads(previous);
      setError(payload.error || 'Could not update lead status. Please try again.');
    }
  }

  const activeFilterQuery = toQuery({
    segment: segmentFilter,
    search,
    utm_campaign: campaignFilter,
  });

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <main className="mx-auto w-[min(1400px,96%)] py-8">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">CRM Kanban Dashboard</h1>
            <button type="button" className="btn-secondary" onClick={logout}>Logout</button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a className="btn" href="/api/export">Export All CSV</a>
            <a className="btn" href="/api/export?segment=hot">Export HOT CSV</a>
            <a className="btn" href="/api/export?segment=warm">Export WARM CSV</a>
            <div className="flex items-center gap-2">
              <select className="input w-40" value={exportStatus} onChange={(e) => setExportStatus(e.target.value)}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <a className="btn-secondary" href={`/api/export?status=${exportStatus}`}>Export by Status</a>
            </div>
            <a className="btn-secondary" href={`/api/export${activeFilterQuery ? `?${activeFilterQuery}` : ''}`}>Export Filtered</a>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <select className="input" value={segmentFilter} onChange={(e) => setSegmentFilter(e.target.value)}>
            {SEGMENTS.map((segment) => (
              <option key={segment} value={segment}>{segment === 'all' ? 'All segments' : segment.toUpperCase()}</option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            className="input"
            placeholder="Filter by campaign"
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
          />
        </div>

        {error ? <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

        <div className="flex gap-4 overflow-x-auto pb-2">
          {STATUSES.map((status) => (
            <div key={status} className="min-w-[280px] flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold capitalize text-slate-800">{status}</h2>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">{board[status].length}</span>
              </div>

              <div className="space-y-3">
                {board[status].length === 0 ? (
                  <p className="rounded-md border border-dashed border-slate-300 p-3 text-xs text-slate-500">No leads</p>
                ) : (
                  board[status].map((lead) => (
                    <article key={lead.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-slate-900">{lead.name}</h3>
                          <p className="text-sm text-slate-600">{lead.phone}</p>
                        </div>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${segmentBadge(lead.segment)}`}>
                          {lead.segment}
                        </span>
                      </div>

                      {lead.utm_campaign ? <p className="mb-2 text-xs text-slate-500">Campaign: {lead.utm_campaign}</p> : null}
                      <p className="mb-2 text-xs text-slate-500">Created: {formatDate(lead.createdAt)}</p>

                      <label className="text-xs font-medium text-slate-600">
                        Move
                        <select
                          className="input mt-1 w-full"
                          value={lead.status}
                          onChange={(e) => moveLead(lead.id, e.target.value)}
                        >
                          {STATUSES.map((value) => (
                            <option key={value} value={value}>{value}</option>
                          ))}
                        </select>
                      </label>
                    </article>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
