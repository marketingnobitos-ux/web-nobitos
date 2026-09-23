import MenuFilter from "@/components/public/MenuFilter";
import { requireActiveBrand } from "@/lib/active-brand";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Menu" };

// Daftar menu per kategori + filter. Katalog saja, tanpa tombol pesan.
export default async function MenuPage() {
  const brand = await requireActiveBrand();

  const categories = await prisma.menuCategory.findMany({
    where: { brandId: brand.id },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      items: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          portion: true,
          imageUrl: true,
          isAvailable: true,
        },
      },
    },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">Menu {brand.name}</h1>
      <p className="mt-2 text-gray-600">Harga dapat berubah sewaktu-waktu. Tanyakan ketersediaan di cabang terdekat.</p>

      <div className="mt-8">
        {categories.length ? (
          <MenuFilter categories={categories} />
        ) : (
          <p className="text-gray-500">Menu belum tersedia.</p>
        )}
      </div>
    </section>
  );
}
