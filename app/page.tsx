import Link from 'next/link';
import { LeadCaptureForm } from '@/components/landing/LeadCaptureForm';
import { ProductCard } from '@/components/landing/ProductCard';
import { TestimonialCard } from '@/components/landing/TestimonialCard';

const featuredProducts = [
  { name: 'Tenun Ikat Premium', category: 'Tenun NTT', price: 'IDR 450K', image: '🧵' },
  { name: 'Flores Arabica Beans', category: 'Flores Coffee', price: 'IDR 120K', image: '☕' },
  { name: 'Komodo Wood Carving', category: 'Handicrafts', price: 'IDR 280K', image: '🦎' },
  { name: 'Natural Rattan Basket', category: 'Handicrafts', price: 'IDR 210K', image: '🧺' },
  { name: 'Tenun Clutch Bag', category: 'Tenun NTT', price: 'IDR 320K', image: '👜' },
  { name: 'Flores Drip Pack Set', category: 'Flores Coffee', price: 'IDR 95K', image: '🌿' }
];

const testimonials = [
  { name: 'Rina, Jakarta', text: 'Kualitas tenunnya luar biasa. Berasa bawa pulang cerita dari Bajo.' },
  { name: 'Kevin, Surabaya', text: 'Kopi Floresnya wangi banget. Pengiriman cepat dan packaging premium.' },
  { name: 'Alma, Bandung', text: 'Souvenir authentic, service ramah, dan WA order sangat praktis.' }
];

export default function HomePage() {
  const waLink =
    'https://wa.me/6281234567890?text=' +
    encodeURIComponent('Halo Kado Bajo, saya ingin order souvenir khas Labuan Bajo.');

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-emerald-50 text-slate-900">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:py-6">
        <p className="text-sm font-semibold tracking-wide text-slate-700 md:text-base">Kado Bajo</p>
        <Link
          href="/login"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Admin Login
        </Link>
      </header>

      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(rgba(15,23,42,.55), rgba(15,23,42,.45)), radial-gradient(circle at top right, #f59e0b, #0f766e)'
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-24 text-white md:py-32">
          <p className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1 text-sm">Kado Bajo • Labuan Bajo, NTT</p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-6xl">Bring Home Memories from Labuan Bajo</h1>
          <p className="mt-4 max-w-xl text-lg text-amber-50">
            Authentic NTT souvenirs crafted with local culture—from Tenun, Flores coffee, to artisan handicrafts.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-xl bg-emerald-500 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-emerald-600"
          >
            Order via WhatsApp
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <p className="mt-2 text-slate-600">Curated gift picks from the heart of NTT.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2">
        <article className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="mt-4 leading-relaxed text-slate-700">
            Kado Bajo connects travelers with authentic products made by local artisans across Labuan Bajo and NTT.
            We work directly with weaving communities, coffee farmers, and craft makers to preserve culture and ensure
            every piece carries a true story from the islands.
          </p>
        </article>

        <article className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Get Catalog & Promo</h2>
          <p className="mt-2 text-slate-600">Leave your contact and our team will reach you on WhatsApp.</p>
          <LeadCaptureForm />
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-bold">Loved by Travelers</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((review) => (
            <TestimonialCard key={review.name} {...review} />
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 pt-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-slate-900 p-8 text-center text-white md:p-12">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to Order Authentic NTT Souvenirs?</h2>
          <p className="mt-3 text-slate-200">Fast response, curated recommendations, and secure shipping support.</p>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-xl bg-emerald-500 px-8 py-3 text-lg font-semibold transition hover:bg-emerald-600"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
