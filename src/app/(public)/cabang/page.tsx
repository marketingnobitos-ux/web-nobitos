import { requireActiveBrand } from "@/lib/active-brand";

export const metadata = { title: "Cabang" };

// Halaman Cabang. Konten lengkap dibangun di Milestone 3.
export default async function CabangPage() {
  const brand = await requireActiveBrand();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary">Cabang — {brand.name}</h1>
      <p className="mt-2 text-gray-600">Placeholder (Milestone 3).</p>
    </section>
  );
}
