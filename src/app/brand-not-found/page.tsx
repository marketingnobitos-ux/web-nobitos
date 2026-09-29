import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
// noindex: halaman ini dijawab HTTP 200 (rewrite middleware), jangan sampai masuk indeks mesin pencari.
export const metadata = { title: "Brand tidak ditemukan", robots: { index: false, follow: false } };

// Tampil untuk domain / slug brand yang tidak terdaftar (PRD Bagian 5).
export default async function BrandNotFoundPage() {
  const isDev = process.env.NODE_ENV !== "production";
  const brands = isDev
    ? await prisma.brand.findMany({ select: { slug: true, name: true }, orderBy: { name: "asc" } })
    : [];

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Brand tidak ditemukan</h1>
      <p className="mt-2 text-gray-600">Domain atau alamat ini belum terhubung ke brand Nobitos mana pun.</p>

      {isDev && (
        <div className="mt-8 rounded border border-dashed border-gray-400 p-4 text-sm">
          <p className="font-semibold">Mode dev — pilih brand untuk preview:</p>
          <ul className="mt-2 space-y-1">
            {brands.map((b) => (
              <li key={b.slug}>
                {b.name}:{" "}
                <Link href={`/?brand=${b.slug}`} className="underline">
                  ?brand={b.slug}
                </Link>{" "}
                ·{" "}
                <Link href={`/preview/${b.slug}`} className="underline">
                  /preview/{b.slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
