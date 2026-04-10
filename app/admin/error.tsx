'use client';

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
      <p className="font-medium">Something went wrong while loading CRM data.</p>
      <button onClick={reset} className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white">
        Try again
      </button>
    </div>
  );
}
