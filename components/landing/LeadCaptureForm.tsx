'use client';

import { useState } from 'react';

type FormState = {
  name: string;
  email: string;
  phone: string;
};

const defaultForm: FormState = { name: '', email: '', phone: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LeadCaptureForm() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      return 'All fields are required.';
    }
    if (!emailPattern.test(form.email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error || 'Failed to submit your request.');
        return;
      }

      setForm(defaultForm);
      setSuccess('Success! We received your details.');

      if (payload?.whatsappUrl) {
        window.setTimeout(() => {
          window.location.href = payload.whatsappUrl;
        }, 700);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3">
      <input
        name="name"
        value={form.name}
        onChange={(event) => onChange('name', event.target.value)}
        required
        placeholder="Your name"
        className="w-full rounded-xl border border-slate-200 px-4 py-3"
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={(event) => onChange('email', event.target.value)}
        required
        placeholder="Email address"
        className="w-full rounded-xl border border-slate-200 px-4 py-3"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={(event) => onChange('phone', event.target.value)}
        required
        placeholder="WhatsApp number"
        className="w-full rounded-xl border border-slate-200 px-4 py-3"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
      <button
        disabled={isSubmitting}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting...' : 'Send & Get WhatsApp Offer'}
      </button>
    </form>
  );
}
