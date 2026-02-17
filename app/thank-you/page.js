export default function ThankYouPage() {
  return (
    <main className="mx-auto w-[min(700px,92%)] py-10">
      <section className="card">
        <h1 className="text-3xl font-bold">Thank you! ✅</h1>
        <p className="mt-2">Your benefit is ready.</p>
        <a href="#" className="btn mt-4 inline-block" onClick={(e) => e.preventDefault()}>
          Download benefit (placeholder)
        </a>
      </section>
    </main>
  );
}
