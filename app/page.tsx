'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];

const NTT_DESTINATIONS = [
  {
    title: 'Labuan Bajo & Pulau Komodo',
    desc: 'Gerbang wisata bahari dengan panorama pulau eksotis dan satwa ikonik.',
    image: 'https://picsum.photos/seed/labuanbajo/800/450',
  },
  {
    title: 'Pink Beach (Pantai Merah)',
    desc: 'Pantai unik dengan gradasi warna pasir merah muda yang memikat.',
    image: 'https://picsum.photos/seed/pinkbeach/800/450',
  },
  {
    title: 'Pulau Padar',
    desc: 'Spot trekking favorit dengan pemandangan teluk bertingkat yang dramatis.',
    image: 'https://picsum.photos/seed/padar/800/450',
  },
  {
    title: 'Danau Kelimutu',
    desc: 'Danau tiga warna legendaris dengan lanskap pegunungan yang menenangkan.',
    image: 'https://picsum.photos/seed/kelimutu/800/450',
  },
  {
    title: 'Wae Rebo',
    desc: 'Desa adat di atas awan dengan arsitektur tradisional khas Flores.',
    image: 'https://picsum.photos/seed/waerebo/800/450',
  },
  {
    title: 'Pantai Nihiwatu (Sumba)',
    desc: 'Pantai premium berpasir putih untuk relaksasi dan ombak kelas dunia.',
    image: 'https://picsum.photos/seed/nihiwatu/800/450',
  },
  {
    title: 'Bukit Wairinding (Sumba)',
    desc: 'Bukit savana bergelombang dengan pemandangan sunrise dan sunset terbaik.',
    image: 'https://picsum.photos/seed/wairinding/800/450',
  },
  {
    title: 'Air Terjun Oenesu (Kupang)',
    desc: 'Air terjun bertingkat yang sejuk dan cocok untuk wisata keluarga.',
    image: 'https://picsum.photos/seed/oenesu/800/450',
  },
];

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
    <main className="mx-auto grid w-[min(1100px,94%)] gap-4 py-8">
      <header className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-base font-semibold text-slate-900">CRM MVP</p>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <span className="mb-3 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">PROMO</span>
        <h2 className="text-xl font-semibold">Khusus Untuk Iklan</h2>
        <p className="mt-2 text-sm text-slate-600">
          Area khusus untuk promo iklan/campaign. Konten bisa diganti sesuai campaign aktif.
        </p>
        <a
          href="#"
          className="mt-4 inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Lihat Promo
        </a>
      </section>

      <section className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tempat Wisata di NTT</h2>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">Promo</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {NTT_DESTINATIONS.map((item) => (
            <article key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  Highlight
                </span>
              </div>
              <p className="text-xs text-slate-600">{item.desc}</p>
            </article>
          ))}
        </div>
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
