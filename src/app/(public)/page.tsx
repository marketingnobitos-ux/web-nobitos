import { requireActiveBrand } from "@/lib/active-brand";

// Halaman Utama brand. Konten lengkap dibangun di Milestone 3.
export default async function HomePage() {
  const brand = await requireActiveBrand();

  return (
    <section className="bg-secondary px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-primary">{brand.name}</h1>
        {brand.tagline && <p className="mt-2 text-lg text-primary">{brand.tagline}</p>}

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Swatch label="Primary" value={brand.colorPrimary} className="bg-primary" />
          <Swatch label="Secondary" value={brand.colorSecondary} className="bg-secondary" />
          <Swatch label="Accent" value={brand.colorAccent ?? brand.colorPrimary} className="bg-accent" />
        </div>
      </div>
    </section>
  );
}

function Swatch({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div className="flex items-center gap-2 rounded bg-white px-3 py-2 text-gray-900 shadow">
      <span className={`h-6 w-6 rounded border border-gray-300 ${className}`} />
      {label}: {value}
    </div>
  );
}
