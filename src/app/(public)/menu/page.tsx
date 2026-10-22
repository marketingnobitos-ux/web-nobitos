import MenuFilter from "@/components/public/MenuFilter";
import AngloMenu from "@/components/templates/anglo/AngloMenu";
import DadakMenu from "@/components/templates/dadak/DadakMenu";
import EditorialMenu from "@/components/templates/editorial/EditorialMenu";
import TungkuMenu from "@/components/templates/tungku/TungkuMenu";
import { requireActiveBrand } from "@/lib/active-brand";
import { formatRupiah } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { brandPageMetadata, joinNames } from "@/lib/seo";

export function generateMetadata() {
  return brandPageMetadata(async (brand) => {
    const items = await prisma.menuItem.findMany({
      where: { brandId: brand.id, isAvailable: true },
      orderBy: [{ isFeatured: "desc" }, { category: { order: "asc" } }, { order: "asc" }],
      select: { name: true, price: true },
    });
    const prices = items.map((i) => i.price);
    const range = items.length ? ` Harga ${formatRupiah(Math.min(...prices))} – ${formatRupiah(Math.max(...prices))}.` : "";
    const sample = items.slice(0, 3).map((i) => i.name);
    const more = items.length > sample.length;
    const list = sample.length ? `: ${more ? `${sample.join(", ")}, dan lainnya` : joinNames(sample)}.` : ".";
    return { title: "Menu & Harga", description: `Menu & harga ${brand.name}${list}${range}`, path: "/menu" };
  });
}

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
          isFeatured: true,
        },
      },
    },
  });

  if (brand.template === "EDITORIAL") return <EditorialMenu brandName={brand.name} categories={categories} />;
  if (brand.template === "ANGLO") {
    const available = categories
      .map((c) => ({ ...c, items: c.items.filter((i) => i.isAvailable) }))
      .filter((c) => c.items.length > 0);
    return <AngloMenu brandName={brand.name} categories={available} />;
  }
  if (brand.template === "DADAK") {
    const available = categories
      .map((c) => ({ ...c, items: c.items.filter((i) => i.isAvailable) }))
      .filter((c) => c.items.length > 0);
    return <DadakMenu categories={available} />;
  }
  if (brand.template === "TUNGKU") {
    const available = categories
      .map((c) => ({ ...c, items: c.items.filter((i) => i.isAvailable) }))
      .filter((c) => c.items.length > 0);
    return <TungkuMenu tagline={brand.tagline} categories={available} />;
  }

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
