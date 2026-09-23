import { prisma } from "@/lib/prisma";

// Halaman percobaan Milestone 1: bukti koneksi DB & seed berhasil.
export const dynamic = "force-dynamic";

export default async function DbCheckPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { branches: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Cek Database — {brands.length} brand</h1>
      <ul className="mt-4 space-y-4">
        {brands.map((brand) => (
          <li key={brand.id}>
            <strong>{brand.name}</strong> ({brand.slug}) — {brand.colorPrimary} / {brand.colorSecondary}
            <ul className="ml-6 list-disc">
              {brand.branches.map((branch) => (
                <li key={branch.id}>
                  {branch.name} — {branch.address}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
