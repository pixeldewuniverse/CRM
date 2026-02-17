'use client';

import { useMemo, useState } from 'react';

export default function LeadTable({ leads }) {
  const initialValues = useMemo(
    () =>
      leads.reduce((acc, lead) => {
        acc[lead.id] = { status: lead.status, segment: lead.segment };
        return acc;
      }, {}),
    [leads]
  );

  const [values, setValues] = useState(initialValues);

  async function updateLead(id, patch) {
    const next = { ...values[id], ...patch };
    setValues((prev) => ({ ...prev, [id]: next }));

    await fetch(`/api/lead/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-slate-200 bg-white text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Interest</th>
            <th className="border p-2">Campaign</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Segment</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const current = values[lead.id] || { status: lead.status, segment: lead.segment };
            return (
              <tr key={lead.id}>
                <td className="border p-2">{lead.id}</td>
                <td className="border p-2">{lead.name}</td>
                <td className="border p-2">{lead.phone}</td>
                <td className="border p-2">{lead.interest}</td>
                <td className="border p-2">{lead.utm_campaign || '-'}</td>
                <td className="border p-2">
                  <select
                    className="input"
                    value={current.status}
                    onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                  >
                    {['new', 'contacted', 'qualified', 'won', 'lost'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">
                  <select
                    className="input"
                    value={current.segment}
                    onChange={(e) => updateLead(lead.id, { segment: e.target.value })}
                  >
                    {['hot', 'warm'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
