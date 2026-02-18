'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', notes: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    ATTR_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) localStorage.setItem(key, value);
    });

    if (!localStorage.getItem('first_page_view_at')) {
      localStorage.setItem('first_page_view_at', new Date().toISOString());
    }

    fetch('/api/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: '/',
        first_page_view_at: localStorage.getItem('first_page_view_at'),
        attribution: Object.fromEntries(ATTR_KEYS.map((k) => [k, localStorage.getItem(k) || ''])),
      }),
    }).catch(() => {});
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...form,
      first_page_view_at: localStorage.getItem('first_page_view_at'),
      landing_page_url: window.location.href,
      attribution: Object.fromEntries(ATTR_KEYS.map((k) => [k, localStorage.getItem(k) || ''])),
    };

    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    setLoading(false);
    if (response.ok) {
      router.push('/thank-you');
      return;
    }

    const missing = data?.details?.missing;
    if (Array.isArray(missing) && missing.length) {
      setError(`Please fill required fields: ${missing.join(', ')}.`);
      return;
    }

    setError(data.error || 'We could not submit your details. Please try again.');
  }

  return (
    <main className="mx-auto grid w-[min(1000px,92%)] gap-4 py-8">
      <header className="flex justify-end">
        <Link
          href="/dashboard/login"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Login
        </Link>
      </header>

      <section className="card text-center">
        <h1 className="text-3xl font-bold">Get Your Free Growth Playbook</h1>
        <p className="mt-2 text-slate-600">Fill this short form and unlock an instant benefit.</p>
      </section>

      <section className="card">
        <h2 className="mb-4 text-xl font-semibold">Claim your benefit</h2>
        {error ? <p className="mb-3 rounded-md border border-rose-300 bg-rose-50 p-2 text-sm text-rose-800">{error}</p> : null}
        <form className="grid gap-3" onSubmit={onSubmit}>
          <label>
            <span className="mb-1 block font-medium">Name*</span>
            <input className="input" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </label>
          <label>
            <span className="mb-1 block font-medium">Phone / WhatsApp*</span>
            <input className="input" required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          </label>
          <label>
            <span className="mb-1 block font-medium">Notes (optional)</span>
            <textarea className="input" rows={3} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          </label>
          <button className="btn" disabled={loading} type="submit">
            {loading ? 'Submitting...' : 'Get Instant Access'}
          </button>
        </form>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold">Trust / Social Proof</h2>
        <p className="text-slate-600">Placeholder for testimonials and logos.</p>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <p className="text-slate-600">Placeholder for frequently asked questions.</p>
      </section>

      <footer className="py-2 text-center text-sm text-slate-500">© CRM MVP</footer>
    </main>
  );
}
