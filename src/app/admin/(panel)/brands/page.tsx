import Link from "next/link";
import { Card, PublishBadge } from "@/components/admin/fields";
import { listAccessibleBrands, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Brand" };

export default async function BrandsPage() {
  const admin = await requireAdmin();
  const ids = (await listAccessibleBrands(admin)).map((b) => b.id);
  const brands = await prisma.brand.findMany({
    where: { id: { in: ids } },
    orderBy: { name: "asc" },
    include: { domains: { where: { isPrimary: true }, take: 1 } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Kelola Brand</h1>
        {admin.role === "SUPER_ADMIN" && (
          <Link href="/admin/brands/new" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
            + Tambah brand
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <Card key={b.id}>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-10 w-10 shrink-0 rounded-md" style={{ background: b.colorPrimary }} />
              <div className="min-w-0">
                <Link href={`/admin/brands/${b.id}`} className="font-semibold hover:underline">
                  {b.name}
                </Link>
                <p className="truncate text-xs text-gray-500">{b.domains[0]?.hostname ?? `slug: ${b.slug}`}</p>
                <div className="mt-2">
                  <PublishBadge published={b.isPublished} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href={`/admin/brands/${b.id}/menu`} className="text-gray-700 hover:underline">
                Menu
              </Link>
              <Link href={`/admin/brands/${b.id}/pages`} className="text-gray-700 hover:underline">
                Konten
              </Link>
              <Link href={`/admin/brands/${b.id}/branches`} className="text-gray-700 hover:underline">
                Cabang
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
