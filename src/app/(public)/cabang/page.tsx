import AngloBranches from "@/components/templates/anglo/AngloBranches";
import BranchCard from "@/components/public/BranchCard";
import RestaurantJsonLd from "@/components/public/RestaurantJsonLd";
import { requireActiveBrand } from "@/lib/active-brand";
import { prisma } from "@/lib/prisma";
import { branchNames, brandPageMetadata, joinNames } from "@/lib/seo";

export function generateMetadata() {
  return brandPageMetadata(async (brand) => {
    const names = await branchNames(brand);
    return {
      title: "Cabang & Kontak",
      description: `Alamat, jam buka, WhatsApp & Google Maps ${names.length} cabang ${brand.name}: ${joinNames(names)}.`,
      path: "/cabang",
    };
  });
}

// Daftar cabang: alamat, jam buka, peta, WhatsApp/telepon.
export default async function CabangPage() {
  const brand = await requireActiveBrand();
  const jsonLd = <RestaurantJsonLd brand={brand} />;
  // ANGLO: cabang dari src/data/brands, bukan DB.
  if (brand.template === "ANGLO")
    return (
      <>
        {jsonLd}
        <AngloBranches />
      </>
    );
  const branches = await prisma.branch.findMany({ where: { brandId: brand.id }, orderBy: { order: "asc" } });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      {jsonLd}
      <h1 className="text-3xl font-bold sm:text-4xl">Cabang & Kontak</h1>
      <p className="mt-2 text-gray-600">
        {branches.length} cabang {brand.name} siap melayani Anda.
      </p>

      {branches.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} brandName={brand.name} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-gray-500">Info cabang belum tersedia.</p>
      )}
    </section>
  );
}
