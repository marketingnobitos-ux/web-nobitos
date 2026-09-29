import type { Metadata } from "next";
import PublicLayout from "@/app/(public)/layout";
import BrandNotFound from "@/components/public/BrandNotFound";
import { getActiveBrand } from "@/lib/active-brand";

// 404 untuk URL yang tidak cocok dengan route mana pun (ROADMAP F0.5). Di domain brand: dibungkus layout publik
// supaya header, footer & tema brand tetap tampil. Host admin / host tak dikenal: 404 polos.
export async function generateMetadata(): Promise<Metadata> {
  const brand = await getActiveBrand();
  return {
    title: brand ? `Halaman tidak ditemukan · ${brand.name}` : "Halaman tidak ditemukan",
    description: brand?.tagline ?? undefined,
    icons: brand?.faviconUrl ? { icon: brand.faviconUrl } : undefined,
    // robots noindex ditambahkan Next.js sendiri untuk halaman 404.
  };
}

export default async function NotFound() {
  const brand = await getActiveBrand();
  if (!brand) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-gray-600">Alamat ini tidak ada.</p>
      </div>
    );
  }
  return (
    <PublicLayout>
      <BrandNotFound template={brand.template} />
    </PublicLayout>
  );
}
