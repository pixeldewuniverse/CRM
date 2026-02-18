import BenefitClient from './BenefitClient';

export default function ThankYouPage() {
  return (
    <main className="mx-auto w-[min(700px,92%)] py-10">
      <section className="card">
        <h1 className="text-3xl font-bold">Thank you! ✅</h1>
        <p className="mt-2">Your benefit is ready.</p>
        <BenefitClient />
      </section>
    </main>
  );
}
