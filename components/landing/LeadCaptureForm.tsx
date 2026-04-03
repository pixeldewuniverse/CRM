'use client';

import { useState } from 'react';

type FormState = {
  name: string;
  email: string;
  phone: string;
};

const defaultForm: FormState = { name: '', email: '', phone: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ✅ ADMIN NUMBER (FIXED)
const ADMIN_WHATSAPP_NUMBER = '6285161280220';

function formatWhatsAppPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('08')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  return digits;
}

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
    if (isSubmitting) return;

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

      setSuccess('Success! Redirecting you to WhatsApp...');

      const adminPhone = formatWhatsAppPhone(ADMIN_WHATSAPP_NUMBER);

      const message = encodeURIComponent(
        `Halo Kado Bajo, saya ${form.name} tertarik dengan produk Anda`
      );

      const whatsappUrl = `https://wa.me/${adminPhone}?text=${message}`;

      setTimeout(() => {
        window.location.href = whatsappUrl;
      }, 500);

      setForm(defaultForm);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3">
      <input
        value={form.name}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="Your name"
        className="w-full rounded-xl border px-4 py-3"
      />

      <input
        type="email"
        value={form.email}
        onChange={(e) => onChange('email', e.target.value)}
        placeholder="Email address"
        className="w-full rounded-xl border px-4 py-3"
      />

      <input
        value={form.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        placeholder="WhatsApp number"
        className="w-full rounded-xl border px-4 py-3"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        disabled={isSubmitting}
        className="w-full rounded-xl bg-black py-3 text-white"
      >
        {isSubmitting ? 'Submitting...' : 'Send & Get WhatsApp Offer'}
      </button>
    </form>
  );
}
