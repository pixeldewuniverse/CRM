import './globals.css';

export const metadata = {
  title: 'CRM Phase 1 MVP',
  description: 'Lead capture and dashboard CRM MVP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900">{children}</body>
    </html>
  );
}
