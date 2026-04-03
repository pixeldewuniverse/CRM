type TestimonialCardProps = {
  name: string;
  text: string;
};

export function TestimonialCard({ name, text }: TestimonialCardProps) {
  return (
    <blockquote className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-slate-700">“{text}”</p>
      <footer className="mt-4 text-sm font-semibold text-slate-900">{name}</footer>
    </blockquote>
  );
}
