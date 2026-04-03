export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form action="/api/auth/login" method="post" className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
        <h1 className="mb-5 text-2xl font-semibold">Sign in</h1>
        <label className="mb-2 block text-sm">Email</label>
        <input name="email" type="email" required className="mb-4 w-full rounded border px-3 py-2" />
        <label className="mb-2 block text-sm">Password</label>
        <input name="password" type="password" required className="mb-4 w-full rounded border px-3 py-2" />
        <button className="w-full rounded bg-slate-900 py-2 text-white">Login</button>
      </form>
    </div>
  );
}
