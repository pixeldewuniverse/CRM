import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CRM Suite',
  description: 'Fullstack CRM with Next.js + Supabase'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
