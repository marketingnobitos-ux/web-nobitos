import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getActiveBrand, requireActiveBrand } from "@/lib/active-brand";
import { formatRupiah } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo";
import { trackName } from "@/lib/track";

type Props = { params: Promise<{ id: string }> };

// Item hanya ditemukan kalau milik brand aktif.
async function getItem(brandId: string, id: string) {
  return prisma.menuItem.findFirst({ where: { id, brandId }, include: { category: true } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = await getActiveBrand();
  if (!brand) return {};
  const item = await getItem(brand.id, (await params).id);
  if (!item) return {};
  const price = `${formatRupiah(item.price)}${item.portion ? ` / ${item.portion}` : ""}`;
  return pageMetadata(brand, {
    title: item.name,
    description: `${item.name} di ${brand.name}, ${price}.${item.description ? ` ${item.description}` : ""}`,
    path: `/menu/${item.id}`,
  });
}

// Detail menu: foto besar, harga, porsi. Tanpa tombol pesan.
export default async function MenuDetailPage({ params }: Props) {
  const brand = await requireActiveBrand();
  if (brand.template === "ANGLO" || brand.template === "TUNGKU") redirect("/menu"); // menu cukup daftar, tanpa halaman detail
  const item = await getItem(brand.id, (await params).id);
  if (!item) notFound();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <Link href="/menu" className="text-sm font-medium text-primary hover:underline">
        ← Kembali ke menu
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-primary/10">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-8xl font-bold text-primary/30">
              {item.name.charAt(0)}
            </span>
          )}
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">{item.category.name}</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{item.name}</h1>
          <p className="mt-4 text-2xl font-bold text-primary">{formatRupiah(item.price)}</p>
          {item.portion && <p className="mt-1 text-gray-600">Porsi: {item.portion}</p>}
          {!item.isAvailable && (
            <p className="mt-3 inline-block rounded bg-gray-100 px-3 py-1 text-sm text-gray-700">Sedang tidak tersedia</p>
          )}
          {item.description && <p className="mt-6 leading-relaxed text-gray-700">{item.description}</p>}
          <Link
            href="/cabang"
            data-track={trackName("cabang")}
            className="mt-8 inline-block rounded-lg border border-primary px-5 py-2.5 font-medium text-primary hover:bg-primary/5"
          >
            Temukan di cabang terdekat
          </Link>
        </div>
      </div>
    </section>
  );
}
