type ProductCardProps = {
  name: string;
  category: string;
  price: string;
  image: string;
};

export function ProductCard({ name, category, price, image }: ProductCardProps) {
  return (
    <article className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="text-4xl">{image}</div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-emerald-700">{category}</p>
      <h3 className="mt-1 text-lg font-semibold">{name}</h3>
      <p className="mt-2 text-amber-700">{price}</p>
    </article>
  );
}
