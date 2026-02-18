import LoginForm from './LoginForm';

export default function DashboardLoginPage({ searchParams }: { searchParams?: { next?: string } }) {
  const nextPath = searchParams?.next || '/dashboard';

  return (
    <main className="mx-auto w-[min(520px,92%)] py-12">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Login</h1>
        <p className="mt-2 text-slate-600">Enter your dashboard password to continue.</p>
        <LoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}
